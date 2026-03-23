---
description: Generate a complete Fireship-style video from a topic name
---

Generate a top-grade Fireship-style explainer video from just a topic name, end-to-end.

**User provides:** A topic (e.g., `$ARGUMENTS` or asked interactively)

---

## Step 0.5: Check for Reference Transcription

Before researching, check if `~/remotion-fireship/data/videos/current.md` exists:

```bash
ls ~/remotion-fireship/data/videos/current.md 2>/dev/null && echo "FOUND" || echo "NOT FOUND"
```

**If `current.md` exists:** Read it in full. This is a transcription of a reference video. Use it as the **primary source material**:
- Follow its structure, talking points, and narrative flow closely
- Extract key facts, stats, quotes, and code examples directly from it
- The video you generate should closely mirror the reference — same concepts, same order, same emphasis
- Tavily searches in Step 1 become **supplementary** — only fill gaps (verify stats, find missing dates, get exact quotes with attribution)

**If `current.md` does NOT exist:** Skip this step — Tavily is the sole research source.

---

## Step 1: Deep Research with Tavily

**This step is mandatory.** Use `mcp__tavily__search` or `mcp__tavily__searchContext` to deeply research the topic before writing anything. Gather:
- Real statistics and numbers (adoption rates, market size, performance benchmarks)
- Key quotes from industry leaders (with name + role)
- Historical timeline (founding dates, major milestones, version releases)
- Technical architecture / how it works
- Comparisons with alternatives or predecessors
- Real code examples (not placeholder)
- Current state and future outlook

**If `current.md` was found:** Run **2-3 targeted searches** to fill gaps in the transcription (verify stats, find attribution for quotes, get exact dates). Don't over-research — the transcription is your blueprint.

**If no `current.md`:** Run **multiple Tavily searches** to cover different angles:
1. `mcp__tavily__search` — "{topic} overview statistics 2024 2025"
2. `mcp__tavily__search` — "{topic} architecture how it works technical"
3. `mcp__tavily__search` — "{topic} history timeline milestones"
4. `mcp__tavily__searchQNA` — "what is {topic} used for and why does it matter"

Compile research into structured notes before proceeding to Step 2.

---

## Step 2: Write Comprehensive Video JSON

Using the research from Step 1, write a complete video JSON to `~/remotion-fireship/data/videos/{slug}.json`.

### Content Quality Standards
- **Every fact, stat, and quote must come from the research** — no placeholder text
- **Body text should be punchy and concise** — this is a video script, not a blog post
- **Each section should flow naturally into the next** — tell a story arc:
  1. **Dopamine Cold Open (MANDATORY — first 2 sections)**
  2. How it works (architecture, mechanism)
  3. Evidence (stats, comparisons)
  4. Context (timeline, quotes from leaders)
  5. Practical (code example, getting started)
  6. Future / takeaway

### MANDATORY: Dopamine Cold Open (first 2 sections)

**Every short-form video MUST start with a 2-section cold open (~8 seconds) that spikes curiosity:**

1. **Shock Stat or Bold Claim** (StatsScene or ContentScene, 4s) — The most mind-blowing number OR the most provocative one-liner from your research. Use `glitch` transition. One sentence max. Make them stop scrolling.
2. **The Tease + Context** (ContentScene, 4s) — Quick context AND a "watch to the end" hook in one breath: "In 50 seconds I'll show you [X]. Stay to the end — [the twist/recommendation]." Use `iris` transition.

**Then the arc continues from section 3 onward.**

**Cold Open voiceover pattern:**
```
Section 1: "[Jaw-dropping stat or claim]. Let that sink in."
Section 2: "In the next 50 seconds you'll see exactly [what]. But watch to the end — [promise]."
```

**Rules:**
- Section 1 MUST be a different scene type than section 2 (variety = dopamine)
- Use `glitch` → `iris` transitions (front-load the energy)
- Body text is SHORT — 1 sentence max per section
- Stats/claims must be real facts from research

### Scene Type Mix (aim for 10-12 sections, including 2 cold open sections)
Use ALL available scene types for visual variety:
- **ContentScene**: intro text + bullet points (with optional image)
- **DiagramScene**: architecture/flow diagrams using icons (brain, database, search, cube, robot, code, cloud, api, lock, lightning, server, terminal, git, docker, kubernetes, aws, globe, chart, shield, rocket)
- **StatsScene**: 2-4 animated number counters with labels + suffixes (%, K+, ms, x, B, etc.)
- **QuoteScene**: featured quote with real author + real role
- **TimelineScene**: 2-6 real chronological events with year labels
- **CodeScene**: real syntax-highlighted code snippet from actual usage
- **ComparisonScene**: side-by-side with VS divider (e.g., old vs new, tool A vs B)

### Transition Strategy (smooth flow)
Transitions should feel cinematic, not random. 8 types available: `slide`, `fade`, `wipe`, `zoom`, `glitch`, `clockWipe`, `flip`, `iris`. Follow this pattern:
- **Opening sections**: `slide` (clean, directional)
- **Technical/architecture sections**: `wipe` or `iris` (reveals content)
- **Impact/stats sections**: `fade` (smooth, no distraction)
- **Dramatic moments (quotes, key insights)**: `glitch` or `flip` (attention-grabbing, use sparingly — max 1-2 times)
- **Timeline/history**: `slide` (left-to-right feels like progression)
- **Code sections**: `fade` or `clockWipe` (circular reveal for variety)
- **Never use the same transition twice in a row**
- All transitions use `springTiming` for organic motion (25 frames)

### Timing
- Sections with more text/bullets: 6-7 seconds
- Stats/quote/diagram: 5-6 seconds
- Code sections: 7-8 seconds (needs time to read)
- Total video: 50-80 seconds ideal

### Validate
Schema is at `~/remotion-fireship/src/templates/fireship/schema.ts` — read it if unsure about field types.

---

## Step 3: Write Voiceover Script

After writing the video JSON, create a voiceover script at `~/remotion-fireship/data/videos/{slug}-voiceover.md`:

```markdown
# {Topic} — Voiceover Script

## Section 1: {heading} (0:00 - 0:05)
"Spoken text that matches what's on screen..."

## Section 2: {heading} (0:05 - 0:11)
"Next section's narration..."

[continue for all sections]

---
Total duration: ~{X} seconds
Tone: Fireship-style — fast, punchy, slightly irreverent, technical but accessible
```

The voiceover script should:
- Match the timing of each section exactly
- Be written in Fireship's signature style: fast-paced, direct, slightly witty
- Reference what's visually on screen ("as you can see in this diagram...")
- Include natural pauses at transition points
- Be speakable — read it aloud mentally to check pacing

---

## Step 3.5: Generate Per-Section Synced Voiceover Audio

**Use `tts-generate-synced.py`** — it generates TTS for each section individually, pads each clip with silence to match its visual duration, and concatenates them. This ensures perfect sync between voiceover and scene transitions (no narration cut off at scene changes).

```bash
cd ~/chatterbox-tts && source venv/bin/activate && python ~/remotion-fireship/scripts/tts-generate-synced.py \
  --voiceover ~/remotion-fireship/data/videos/{slug}-voiceover.md \
  --json ~/remotion-fireship/data/videos/{slug}.json \
  --slug "{slug}" \
  --voice-ref ~/remotion-fireship/public/voiceover/my-voice-ref.wav \
  --exaggeration 0.25 \
  --cfg-weight 0.5
```

**NOTE:** The user's voice reference is always at `public/voiceover/my-voice-ref.wav` — always include `--voice-ref` pointing to it.

The script will:
1. Parse voiceover markdown and extract **per-section** quoted text
2. Read the video JSON for per-section visual durations
3. Generate TTS for each section separately (with voice cloning)
4. Pad each clip with silence to match its section's visual duration
5. If any section's audio exceeds its visual duration, **auto-update the JSON** with corrected durations
6. Concatenate all padded clips (with 4s intro + 4s outro silence)
7. Save WAV + auto-resample to 44.1kHz stereo MP3

Output: `public/voiceover/{slug}.wav` + `public/voiceover/{slug}.mp3`

**IMPORTANT:** Do NOT add `voiceoverAudio` to the video JSON. Audio is merged post-render via ffmpeg in Step 5.

**If the script reports "JSON durations were updated":** You MUST re-render the video (Step 5) since section durations changed. This is expected — Chatterbox TTS speaks at ~2-3 words/sec vs scripted ~4 words/sec.

**Tuning parameters:**
- `--exaggeration` (0-1): Higher = more emotional/dramatic delivery. 0.25 for calm, 0.7 for energetic.
- `--cfg-weight` (0-1): Higher = more precise but less natural. 0.5 is a good default.
- `--voice-ref`: Path to a WAV file (5-15s clean speech) for voice cloning.

If Chatterbox fails or no GPU is available, skip — the video works without voiceover.

---

## Step 4: Generate Images via Flux on Nova

**Generate exactly 2 eye-catching images** for the video. See `docs/IMAGE-GUIDE.md` for full prompt rules.

1. Check nova: `ssh nova "curl -s http://100.105.14.117:8095/status"`
2. If model-manager not running:
   - `ssh nova "docker start glm-server"`
   - `ssh nova "docker exec -d glm-server python3 /models/nova_model_manager/model_manager.py --port 8095"`
3. Generate images **one at a time** with unique slugs:
```bash
cd ~/remotion-fireship && npx ts-node scripts/flux-images.ts \
  --descriptions "CONCRETE SUBJECT; specific environment; lighting/color; camera angle; mood" \
  --slug "{slug}-ch1" --width 1200 --height 800
```
Run twice with unique slugs (`-ch1`, `-ch2`) and different prompts.

**Flux Prompt Formula:** `[CONCRETE SUBJECT] + [ENVIRONMENT] + [LIGHTING] + [CAMERA] + [MOOD]`

**DO:** Lead with a concrete subject (robot, server rack, circuit board). Specify camera angle and lighting. Use semicolons not commas. Always include "dark background".

**DON'T:** Ask Flux to render text. Use vague descriptions ("futuristic concept"). Use commas (script splits on them).

**Good example:** `"humanoid robot standing in dark warehouse; scanning with blue laser beams; amber and blue neon accent lighting; wide angle; cinematic moody"`

**Bad example:** `"cool futuristic AI concept with text saying Claude Code"` — no concrete subject, text won't render

4. Reference in JSON as `"image": "generated/{slug}-ch1-0.png"` on ContentScene sections

If nova is unavailable, skip — the video works with procedural visuals only.

---

## Step 5: Render + Merge Audio (Both Formats)

**IMPORTANT:** The video JSON must NOT contain `voiceoverAudio`. Audio is merged post-render via ffmpeg.

### 5a. Ensure JSON has no voiceoverAudio
If the JSON has a `voiceoverAudio` field, remove it before rendering.

### 5b. Render both formats
```bash
# Desktop (1920x1080)
cd ~/remotion-fireship && npx remotion render src/index.tsx Fireship out/{slug}.mp4 --props="data/videos/{slug}.json"

# TikTok / Reels / Shorts (1080x1920)
cd ~/remotion-fireship && npx remotion render src/index.tsx FireshipTikTok out/{slug}-tiktok.mp4 --props="data/videos/{slug}.json"
```

### 5c. Merge voiceover audio via ffmpeg

**CRITICAL: Use explicit stream mapping (`-map 0:v -map 1:a`).** Remotion renders a silent AAC audio track in the output. Without `-map`, ffmpeg uses that silent track instead of the voiceover.

```bash
# Desktop final (with volume boost)
ffmpeg -y -i out/{slug}.mp4 -i public/voiceover/{slug}.mp3 \
  -map 0:v -map 1:a -c:v copy -af "volume=6dB" -c:a aac -b:a 192k -shortest out/{slug}-final.mp4

# TikTok final (with volume boost)
ffmpeg -y -i out/{slug}-tiktok.mp4 -i public/voiceover/{slug}.mp3 \
  -map 0:v -map 1:a -c:v copy -af "volume=6dB" -c:a aac -b:a 192k -shortest out/{slug}-tiktok-final.mp4
```

**Verify audio merged correctly:** Check that `audio:` in ffmpeg output shows >500kB (not 16kB which means silent).

### 5d. Speed up 1.2x (final delivery)

Speed up both video and audio by 1.2x for punchy Fireship pacing:

```bash
# Desktop fast
ffmpeg -y -i out/{slug}-final.mp4 \
  -filter_complex "[0:v]setpts=PTS/1.2[v];[0:a]atempo=1.2[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 192k out/{slug}-fast.mp4

# TikTok fast
ffmpeg -y -i out/{slug}-tiktok-final.mp4 \
  -filter_complex "[0:v]setpts=PTS/1.2[v];[0:a]atempo=1.2[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 192k out/{slug}-tiktok-fast.mp4
```

The `-fast` files are the **primary deliverables**. Report durations and file sizes for both.

Report output paths, durations, and file sizes for all renders.

---

## Step 6: Generate Viral Thumbnail (Flux + Remotion)

**Two-step process:** Flux generates the base image, Remotion overlays styled text.

### 6a. Generate base image with Flux
Focus on ONE dramatic concrete subject — no text, no clutter:
```bash
cd ~/remotion-fireship && npx ts-node scripts/flux-images.ts \
  --descriptions "CONCRETE DRAMATIC SUBJECT; dark background; bold contrast; single focal point; cinematic wide angle; {video accent colors}" \
  --slug "{slug}-thumb" --width 1280 --height 720
```

**Good thumbnail base prompts:**
- `"close-up of robotic hand typing on glowing keyboard; dark background; amber neon rim lighting; dramatic shallow depth of field"`
- `"massive glowing brain made of circuit boards; floating in dark void; blue and orange spotlights; cinematic wide shot"`
- `"developer silhouette against giant glowing monitor; dark room; screen reflecting {primaryColor} light on face; dramatic"`

### 6b. Overlay text with Remotion
```bash
npx remotion still src/index.tsx FireshipThumbnail \
  out/{slug}-thumbnail.png \
  --props='{"backgroundImage":"generated/{slug}-thumb-0.png","title":"{SHORT PUNCHY TITLE}","subtitle":"{OPTIONAL SUBTITLE}","primaryColor":"{primaryColor}","accentColor":"{accentColor}","textPosition":"bottom-left"}'
```

**Text position options:** `"bottom-left"` (default, most viral), `"left"` (side gradient), `"center"` (radial vignette)

**Title tips:** Keep under 4 words. Bold. Curiosity-inducing. Examples: "It Changed Everything", "This Broke GitHub", "The $2.5B Agent"

Output: `out/{slug}-thumbnail.png` (1280x720, ready to upload)

---

## Step 7: Auto-Generate YouTube Description

Generate a ready-to-paste YouTube description and save to `~/remotion-fireship/data/videos/{slug}-description.md`.

### 7a. Calculate chapter timestamps
Read the video JSON and compute timestamps adjusted for 1.2x speedup:

```python
python3 -c "
import json
d = json.load(open('data/videos/{slug}.json'))
intro = 4  # intro silence
t = intro
chapters = []
for s in d['sections']:
    # Divide by 1.2 for speedup
    adj_t = t / 1.2
    mins = int(adj_t) // 60
    secs = int(adj_t) % 60
    chapters.append(f'{mins}:{secs:02d} {s[\"heading\"]}')
    t += s.get('duration', 5)
print('\n'.join(chapters))
"
```

### 7b. Write description file
The description should include:

```markdown
# {Title} — YouTube Description

## Description
{2-3 sentence summary of the video topic — punchy, informative, SEO-friendly}

## Links
- {Topic} GitHub: {url if known}
- {Any other relevant links from research}

## Chapters
0:00 {Section 1 heading}
0:XX {Section 2 heading}
[...all sections with 1.2x-adjusted timestamps]

## Keywords
{Comma-separated relevant keywords: topic name, key technologies, people mentioned, category terms}

## Hashtags
#{Topic} #Tech #{Category} [5-8 relevant hashtags]
```

Save to `data/videos/{slug}-description.md` and display the full description to the user so they can copy-paste it.

---

## JSON Schema Quick Reference
```json
{
  "title": "Topic Name",
  "subtitle": "// tagline here",
  "topic": "Category",
  "lightLeaks": true,
  "sections": [
    {
      "heading": "Section Title",
      "body": "Description text",
      "bulletPoints": ["point 1", "point 2"],
      "image": "generated/slug-0.png",
      "imageFrame": "none|browser|phone",
      "codeSnippet": { "code": "...", "language": "typescript", "filename": "index.ts" },
      "comparison": { "left": { "label": "A", "points": ["..."] }, "right": { "label": "B", "points": ["..."] } },
      "diagram": { "nodes": [{ "label": "Step", "icon": "brain" }] },
      "stats": { "items": [{ "label": "Users", "value": 1000000, "suffix": "+" }] },
      "quote": { "text": "...", "author": "Name", "role": "Title" },
      "timeline": { "events": [{ "year": "2024", "label": "Event" }] },
      "duration": 5,
      "transition": "slide|fade|wipe|zoom|glitch|clockWipe|flip|iris"
    }
  ],
  "style": {
    "backgroundColor": "#0a0a0a",
    "primaryColor": "#FF6B00",
    "accentColor": "#00d4ff",
    "secondaryColor": "#1a1a2e",
    "textColor": "#ffffff",
    "mutedColor": "#a0a0b0"
  }
}
```

## Key Rules
- Working directory: `~/remotion-fireship`
- **If `data/videos/current.md` exists, it's the primary source** — follow its structure closely, use Tavily only for gap-filling
- **Research first, write second** — never use placeholder content
- All animation is procedural — no external assets required
- Use `staticFile()` paths for images in `public/`
- Stats values should be real numbers from research
- Quote text must be a real quote from a real person (under 30 words)
- Timeline events must be real dates from research
- Diagram nodes: 2-5 nodes with icon names from the ICON_MAP
- Never use the same transition consecutively
- Write the voiceover script to match the video timing exactly
- **Always use `-map 0:v -map 1:a` when merging audio with ffmpeg**
- **Generate exactly 2 Flux images — one prompt per command invocation**
