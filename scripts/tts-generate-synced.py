#!/usr/bin/env python3
"""Generate per-section synced voiceover audio for Remotion videos.

Unlike tts-generate.py which creates one continuous audio stream,
this script generates audio for each section separately and pads
each clip to match the section's visual duration — ensuring perfect
sync between voiceover and scene transitions.

Usage:
    python scripts/tts-generate-synced.py \
      --voiceover data/videos/superpowers-voiceover.md \
      --json data/videos/superpowers.json \
      --slug superpowers \
      --voice-ref public/voiceover/my-voice-ref.wav
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

MAX_CHUNK_CHARS = 900
INTRO_SECONDS = 4
OUTRO_SECONDS = 4


def extract_sections(md_path: str) -> list[str]:
    """Extract per-section quoted text from voiceover markdown."""
    with open(md_path, "r") as f:
        content = f.read()

    # Split by section headers (### Section N: ...)
    parts = re.split(r'###\s+Section\s+\d+', content)

    result = []
    for part in parts[1:]:  # Skip preamble before first section
        quotes = re.findall(r'"([^"]+)"', part)
        if quotes:
            result.append(" ".join(quotes))

    return result


def split_long_text(text: str, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    """Split text into chunks at sentence boundaries."""
    if len(text) <= max_chars:
        return [text]

    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current = ""

    for sentence in sentences:
        if len(current) + len(sentence) + 1 > max_chars and current:
            chunks.append(current.strip())
            current = sentence
        else:
            current = current + " " + sentence if current else sentence

    if current.strip():
        chunks.append(current.strip())

    return chunks


def generate_synced_audio(sections_text: list[str], section_durations: list[float],
                          output_path: str, voice_ref: str | None = None,
                          exaggeration: float = 0.3, cfg_weight: float = 0.5):
    """Generate per-section audio, pad to match visual timing, concatenate."""
    import torch
    import torchaudio
    from chatterbox.tts import ChatterboxTTS

    print("Loading Chatterbox TTS model...")
    t0 = time.time()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr
    print(f"Model loaded in {time.time() - t0:.1f}s on {device} (sample rate: {sr})")

    if voice_ref:
        print(f"Voice cloning from: {voice_ref}")

    # Start with intro silence
    print(f"\nAdding {INTRO_SECONDS}s intro silence")
    all_clips = [torch.zeros(1, int(INTRO_SECONDS * sr))]

    adjustments = []

    for i, (text, vis_dur) in enumerate(zip(sections_text, section_durations)):
        print(f"\n[Section {i+1}/{len(sections_text)}] Visual: {vis_dur}s | Text: {len(text)} chars")
        print(f"  \"{text[:80]}...\"")

        t_start = time.time()

        kwargs = {"exaggeration": exaggeration, "cfg_weight": cfg_weight}
        if voice_ref:
            kwargs["audio_prompt_path"] = voice_ref

        # Handle long sections by chunking
        chunks = split_long_text(text)
        if len(chunks) > 1:
            wavs = []
            for j, chunk in enumerate(chunks):
                print(f"  Chunk {j+1}/{len(chunks)}: {len(chunk)} chars")
                wav = model.generate(chunk, **kwargs)
                wavs.append(wav)
            wav = torch.cat(wavs, dim=1)
        else:
            wav = model.generate(text, **kwargs)

        audio_dur = wav.shape[1] / sr
        elapsed = time.time() - t_start
        print(f"  Generated in {elapsed:.1f}s -> {audio_dur:.1f}s audio")

        if audio_dur <= vis_dur:
            # Pad with silence to fill the section duration
            pad_samples = int((vis_dur - audio_dur) * sr)
            padded = torch.cat([wav, torch.zeros(1, pad_samples)], dim=1)
            print(f"  Padded +{vis_dur - audio_dur:.1f}s silence (total: {vis_dur:.1f}s)")
            all_clips.append(padded)
        else:
            # Audio exceeds visual — use full audio, note adjustment needed
            all_clips.append(wav)
            adjustments.append((i, vis_dur, audio_dur))
            print(f"  WARNING: Audio exceeds visual by {audio_dur - vis_dur:.1f}s — section needs extending")

    # Add outro silence
    print(f"\nAdding {OUTRO_SECONDS}s outro silence")
    all_clips.append(torch.zeros(1, int(OUTRO_SECONDS * sr)))

    # Concatenate all clips
    combined = torch.cat(all_clips, dim=1)
    total_dur = combined.shape[1] / sr

    torchaudio.save(output_path, combined, sr)
    file_size = os.path.getsize(output_path)
    print(f"\nSaved: {output_path}")
    print(f"Total duration: {total_dur:.1f}s | Size: {file_size / 1024:.0f} KB")

    # Convert to 44.1kHz stereo MP3 for ffmpeg merge
    mp3_path = output_path.replace(".wav", ".mp3")
    print("Resampling to 44.1kHz stereo MP3...")
    subprocess.run([
        "ffmpeg", "-y", "-i", output_path,
        "-ar", "44100", "-ac", "2", "-b:a", "192k", mp3_path
    ], capture_output=True)
    if os.path.exists(mp3_path):
        mp3_size = os.path.getsize(mp3_path)
        print(f"MP3: {mp3_path} ({mp3_size / 1024:.0f} KB)")

    return adjustments, total_dur


def apply_adjustments(json_path: str, adjustments: list[tuple[int, float, float]]):
    """Update section durations in video JSON where audio exceeds visual."""
    if not adjustments:
        print("\nNo duration adjustments needed — all sections fit perfectly!")
        return False

    with open(json_path, "r") as f:
        data = json.load(f)

    print(f"\nAdjusting {len(adjustments)} section durations in {json_path}:")
    for section_idx, old_dur, audio_dur in adjustments:
        new_dur = int(audio_dur) + 1  # Round up + 1s buffer for breathing room
        data["sections"][section_idx]["duration"] = new_dur
        heading = data["sections"][section_idx].get("heading", f"Section {section_idx + 1}")
        print(f"  [{heading}] {old_dur}s -> {new_dur}s (audio was {audio_dur:.1f}s)")

    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)

    return True


def main():
    parser = argparse.ArgumentParser(description="Generate synced per-section voiceover")
    parser.add_argument("--voiceover", type=str, required=True, help="Path to voiceover markdown")
    parser.add_argument("--json", type=str, required=True, help="Path to video JSON")
    parser.add_argument("--slug", type=str, required=True, help="Video slug for output filename")
    parser.add_argument("--voice-ref", type=str, help="Reference voice WAV for cloning")
    parser.add_argument("--exaggeration", type=float, default=0.3, help="Emotion exaggeration (0-1)")
    parser.add_argument("--cfg-weight", type=float, default=0.5, help="CFG weight (0-1)")
    args = parser.parse_args()

    # Resolve paths
    voiceover_path = args.voiceover if os.path.isabs(args.voiceover) else os.path.join(PROJECT_ROOT, args.voiceover)
    json_path = args.json if os.path.isabs(args.json) else os.path.join(PROJECT_ROOT, args.json)

    voice_ref = None
    if args.voice_ref:
        voice_ref = args.voice_ref if os.path.isabs(args.voice_ref) else os.path.join(PROJECT_ROOT, args.voice_ref)
        if not os.path.exists(voice_ref):
            parser.error(f"Voice ref not found: {voice_ref}")

    # Extract per-section texts
    sections_text = extract_sections(voiceover_path)
    print(f"Found {len(sections_text)} sections in voiceover markdown")

    # Get per-section durations from JSON
    with open(json_path, "r") as f:
        video_data = json.load(f)

    section_durations = [s.get("duration", 5) for s in video_data["sections"]]
    print(f"Found {len(section_durations)} sections in video JSON")

    if len(sections_text) != len(section_durations):
        print(f"WARNING: voiceover has {len(sections_text)} sections but JSON has {len(section_durations)}")
        min_len = min(len(sections_text), len(section_durations))
        sections_text = sections_text[:min_len]
        section_durations = section_durations[:min_len]
        print(f"Using first {min_len} sections")

    # Generate synced audio
    output_path = os.path.join(PROJECT_ROOT, "public", "voiceover", f"{args.slug}.wav")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    adjustments, total_dur = generate_synced_audio(
        sections_text, section_durations, output_path,
        voice_ref, args.exaggeration, args.cfg_weight
    )

    # Apply any needed duration adjustments to JSON
    needs_rerender = apply_adjustments(json_path, adjustments)

    if needs_rerender:
        print(f"\nJSON durations were updated — re-render the video!")
        print(f"  npx remotion render src/index.tsx Fireship out/{args.slug}.mp4 --props=\"data/videos/{args.slug}.json\"")
    else:
        print(f"\nPerfect sync achieved — no re-render needed.")

    print(f"\nDone! Synced voiceover: public/voiceover/{args.slug}.wav ({total_dur:.1f}s)")
    print(f"MP3: public/voiceover/{args.slug}.mp3")


if __name__ == "__main__":
    main()
