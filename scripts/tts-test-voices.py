#!/usr/bin/env python3
"""Generate short voice samples with different Chatterbox settings to compare."""

import os
import time
import torch
from chatterbox.tts import ChatterboxTTS
import torchaudio

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "voiceover", "samples")
os.makedirs(OUTPUT_DIR, exist_ok=True)

TEST_TEXT = "Docker is a platform that packages applications into containers. It revolutionized DevOps and changed how we deploy software forever."

PRESETS = [
    {"name": "calm",      "exaggeration": 0.2, "cfg_weight": 0.5, "temperature": 0.7},
    {"name": "neutral",   "exaggeration": 0.5, "cfg_weight": 0.5, "temperature": 0.8},
    {"name": "energetic", "exaggeration": 0.7, "cfg_weight": 0.5, "temperature": 0.8},
    {"name": "hype",      "exaggeration": 0.9, "cfg_weight": 0.3, "temperature": 0.9},
    {"name": "precise",   "exaggeration": 0.5, "cfg_weight": 0.8, "temperature": 0.6},
]

print("Loading Chatterbox TTS model...")
t0 = time.time()
device = "cuda" if torch.cuda.is_available() else "cpu"
model = ChatterboxTTS.from_pretrained(device=device)
print(f"Model loaded in {time.time() - t0:.1f}s on {device}\n")

for p in PRESETS:
    print(f"Generating '{p['name']}' (exag={p['exaggeration']}, cfg={p['cfg_weight']}, temp={p['temperature']})...")
    t1 = time.time()
    wav = model.generate(
        TEST_TEXT,
        exaggeration=p["exaggeration"],
        cfg_weight=p["cfg_weight"],
        temperature=p["temperature"],
    )
    out_path = os.path.join(OUTPUT_DIR, f"{p['name']}.wav")
    torchaudio.save(out_path, wav, model.sr)
    dur = wav.shape[1] / model.sr
    print(f"  -> {out_path} ({dur:.1f}s, {time.time() - t1:.1f}s to generate)\n")

print(f"Done! Listen to samples in: {OUTPUT_DIR}")
