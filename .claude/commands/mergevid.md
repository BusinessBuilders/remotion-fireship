---
description: Merge all videos in a directory with motion interpolation
---

I need you to merge videos from a directory with smooth transitions (best for walking/continuous motion).

**You provide:**
1. **Directory path** containing the videos (e.g., `storage/novarobot` or `.` for current directory)
2. **Video numbers** to merge (e.g., `2 3` or `1 2 3 4`)
3. **Transition type** (optional, default: smoothleft):
   - `smoothleft` - directional wipe left (best for walking/motion)
   - `fade` - crossfade blend
   - `wipeleft`, `wiperight`, `wipeup`, `wipedown` - directional wipes
   - `slideleft`, `slideright` - sliding transitions

**I will:**
1. Find the specified .mp4 files in that directory
2. Get video durations to calculate transition offsets
3. **Merge using pair-wise approach** (2 videos at a time, then combine pairs):
   - For 4 videos: merge 1+2, merge 3+4, then combine both
   - This produces smoother results than merging all at once
4. Use ffmpeg xfade filter with:
   - 0.15 second transitions (quick and seamless)
   - Audio crossfade matching video transition
   - High quality output (CRF 18)
5. **If a .mp3 file exists** with matching name, replace the audio
6. **Apply audio cleanup**:
   - FFT denoiser to remove background noise
   - High-pass filter (200Hz) to remove low-frequency rumble
   - Low-pass filter (3000Hz) to remove high-frequency hiss
   - Volume normalization
7. **Ensure mobile compatibility**:
   - Convert to yuv420p pixel format
   - Use H.264 High profile (compatible with Telegram mobile)
   - Proper encoding for all devices
8. Save to `final_merged.mp4` in the same directory
9. Tell you the output file path

**How it works:**
- Uses ffmpeg's xfade filter for smooth video transitions
- The smoothleft transition creates a left-sliding wipe that maintains motion continuity
- Short 0.15s duration makes the transition nearly invisible while avoiding hard cuts
- Audio crossfade prevents audio pops/clicks
- Pair-wise merging approach provides better quality than merging all at once
- Mobile-compatible encoding ensures playback on all devices including Telegram

**Example commands used:**
```bash
# Step 1: Merge pairs
ffmpeg -i 1.mp4 -i 2.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=smoothleft:duration=0.15:offset=5.892[v];[0:a][1:a]acrossfade=d=0.15[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac temp_1_2.mp4

# Step 2: Combine pairs
ffmpeg -i temp_1_2.mp4 -i temp_3_4.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=smoothleft:duration=0.15:offset=11.85[v];[0:a][1:a]acrossfade=d=0.15[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac final_merged.mp4

# Step 3: Replace audio if .mp3 exists
ffmpeg -i final_merged.mp4 -i final_merged.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest final_merged_new.mp4

# Step 4: Apply noise reduction
ffmpeg -i final_merged.mp4 -af "afftdn=nf=-25,highpass=f=200,lowpass=f=3000,volume=2" -c:v copy -c:a aac -b:a 192k final_merged_clean.mp4

# Step 5: Ensure mobile compatibility
ffmpeg -i final_merged.mp4 -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.0 -crf 18 -preset medium -c:a copy final_merged_mobile.mp4
```

This creates seamless video merges perfect for walking characters or continuous motion clips, with clean audio and mobile compatibility.
