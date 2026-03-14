#!/usr/bin/env python3
"""Generate voiceover audio from a voiceover markdown script using Chatterbox TTS.

Usage:
    python scripts/tts-generate.py --voiceover data/videos/my-topic-voiceover.md --slug my-topic
    python scripts/tts-generate.py --text "Hello world, this is a test." --slug test
    python scripts/tts-generate.py --voiceover data/videos/my-topic-voiceover.md --slug my-topic --voice-ref public/voiceover/my-voice.wav

The output WAV is saved to public/voiceover/{slug}.wav

Voice cloning:
    Use --voice-ref to pass a WAV file of a reference voice. Chatterbox will clone that voice's
    characteristics (tone, pacing, timbre) for the generated audio. 5-15 seconds of clean speech works best.

Chunked generation:
    Chatterbox has a ~40s max output per call. For longer text, the script automatically splits into
    chunks of ~900 characters, generates each separately, and concatenates the results.
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

MAX_CHUNK_CHARS = 900  # Chatterbox caps at ~40s / 1000 steps per call


def extract_voiceover_text(md_path: str) -> str:
    """Extract all quoted spoken text from a voiceover markdown file."""
    with open(md_path, "r") as f:
        content = f.read()

    # Match text inside double quotes on lines (the spoken parts)
    quotes = re.findall(r'"([^"]+)"', content)
    if not quotes:
        print(f"Warning: No quoted text found in {md_path}", file=sys.stderr)
        return content.strip()

    # Join with a brief pause marker (period + space) between sections
    return " ".join(quotes)


def split_text_into_chunks(text: str, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    """Split text into chunks at sentence boundaries, respecting max_chars."""
    if len(text) <= max_chars:
        return [text]

    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 1 > max_chars and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk = current_chunk + " " + sentence if current_chunk else sentence

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def generate_audio(text: str, output_path: str, voice_ref: str | None = None,
                   exaggeration: float = 0.2, cfg_weight: float = 0.5):
    """Generate audio using Chatterbox TTS with automatic chunking for long text."""
    print(f"Loading Chatterbox TTS model...")
    t0 = time.time()

    import torch
    import torchaudio
    from chatterbox.tts import ChatterboxTTS

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    model = ChatterboxTTS.from_pretrained(device=device)
    t1 = time.time()
    print(f"Model loaded in {t1 - t0:.1f}s")

    if voice_ref:
        print(f"Voice cloning from: {voice_ref}")

    chunks = split_text_into_chunks(text)
    print(f"Text: {len(text)} chars → {len(chunks)} chunk(s)")

    all_wavs = []
    for i, chunk in enumerate(chunks):
        print(f"\n[Chunk {i+1}/{len(chunks)}] {len(chunk)} chars: {chunk[:80]}...")
        t_chunk = time.time()

        kwargs = {
            "exaggeration": exaggeration,
            "cfg_weight": cfg_weight,
        }
        if voice_ref:
            kwargs["audio_prompt_path"] = voice_ref

        wav = model.generate(chunk, **kwargs)
        elapsed = time.time() - t_chunk
        duration = wav.shape[1] / model.sr
        print(f"  Generated in {elapsed:.1f}s ({duration:.1f}s audio)")
        all_wavs.append(wav)

    # Concatenate all chunks
    if len(all_wavs) == 1:
        combined = all_wavs[0]
    else:
        combined = torch.cat(all_wavs, dim=1)

    torchaudio.save(output_path, combined, model.sr)

    file_size = os.path.getsize(output_path)
    total_duration = combined.shape[1] / model.sr
    print(f"\nSaved: {output_path}")
    print(f"Duration: {total_duration:.1f}s | Size: {file_size / 1024:.0f} KB | Sample rate: {model.sr} Hz")

    # Also create resampled 44.1kHz stereo MP3 for ffmpeg merge
    mp3_path = output_path.replace(".wav", ".mp3")
    print(f"Resampling to 44.1kHz stereo MP3...")
    subprocess.run([
        "ffmpeg", "-y", "-i", output_path,
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        mp3_path
    ], capture_output=True)
    if os.path.exists(mp3_path):
        mp3_size = os.path.getsize(mp3_path)
        print(f"MP3: {mp3_path} ({mp3_size / 1024:.0f} KB)")
    else:
        print(f"Warning: MP3 conversion failed", file=sys.stderr)

    return total_duration


def patch_video_json(slug: str):
    """Add voiceoverAudio field to the video JSON if it exists."""
    json_path = os.path.join(PROJECT_ROOT, "data", "videos", f"{slug}.json")
    if not os.path.exists(json_path):
        print(f"No video JSON at {json_path}, skipping patch")
        return

    with open(json_path, "r") as f:
        data = json.load(f)

    voiceover_ref = f"voiceover/{slug}.wav"
    if data.get("voiceoverAudio") == voiceover_ref:
        print(f"JSON already has voiceoverAudio set")
        return

    data["voiceoverAudio"] = voiceover_ref
    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Patched {json_path} with voiceoverAudio: {voiceover_ref}")


def main():
    parser = argparse.ArgumentParser(description="Generate voiceover audio with Chatterbox TTS")
    parser.add_argument("--voiceover", type=str, help="Path to voiceover markdown file")
    parser.add_argument("--text", type=str, help="Direct text to synthesize (alternative to --voiceover)")
    parser.add_argument("--slug", type=str, required=True, help="Video slug (used for output filename)")
    parser.add_argument("--voice-ref", type=str, help="Path to reference voice WAV for voice cloning (5-15s of clean speech)")
    parser.add_argument("--exaggeration", type=float, default=0.2, help="Emotion exaggeration (0-1, default 0.2 'calm')")
    parser.add_argument("--cfg-weight", type=float, default=0.5, help="CFG weight (0-1, default 0.5)")
    parser.add_argument("--no-patch", action="store_true", help="Skip patching the video JSON")
    args = parser.parse_args()

    if not args.voiceover and not args.text:
        parser.error("Provide either --voiceover or --text")

    # Resolve voice ref path
    voice_ref = None
    if args.voice_ref:
        voice_ref = args.voice_ref
        if not os.path.isabs(voice_ref):
            voice_ref = os.path.join(PROJECT_ROOT, voice_ref)
        if not os.path.exists(voice_ref):
            parser.error(f"Voice reference file not found: {voice_ref}")
        print(f"Using voice reference: {voice_ref}")

    # Get the text
    if args.voiceover:
        voiceover_path = args.voiceover
        if not os.path.isabs(voiceover_path):
            voiceover_path = os.path.join(PROJECT_ROOT, voiceover_path)
        text = extract_voiceover_text(voiceover_path)
    else:
        text = args.text

    print(f"Text preview: {text[:120]}...")

    # Generate
    output_path = os.path.join(PROJECT_ROOT, "public", "voiceover", f"{args.slug}.wav")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    duration = generate_audio(text, output_path, voice_ref, args.exaggeration, args.cfg_weight)

    # Patch the video JSON
    if not args.no_patch:
        patch_video_json(args.slug)

    print(f"\nDone! Voiceover: public/voiceover/{args.slug}.wav ({duration:.1f}s)")
    print(f"MP3 ready: public/voiceover/{args.slug}.mp3")


if __name__ == "__main__":
    main()
