---
description: Generate a long-form (2-4 min) explainer video with chapter structure and varied story arcs
---

Generate a long-form explainer video from a topic name, end-to-end. Unlike `/makevid` (which targets 50-80 seconds), this produces 2-4 minute videos with 15-20 sections grouped into chapters and varied narrative arcs.

**User provides:** A topic (e.g., `$ARGUMENTS` or asked interactively). Optionally an arc style.

---

## Step 0: Select a Story Arc

Each video should feel structurally different. Pick one of these arcs (or let the user choose with `--arc <name>`). **If no arc is specified, randomly select one.**

### Arc A: "Deep Dive" (default analytical style)
1. **Chapter: The Hook** — ContentScene (what is it + image) → StatsScene (why it matters)
2. **Chapter: How It Works** — DiagramScene (architecture) → ContentScene (key concepts) → CodeScene (core mechanism) → ContentScene (deeper detail + image)
3. **Chapter: In Practice** — ComparisonScene (vs alternatives) → CodeScene (real-world usage) → ContentScene (lessons learned)
4. **Chapter: The Story** — TimelineScene (history) → QuoteScene (industry voice)
5. **Chapter: Getting Started** — CodeScene (setup/quickstart) → ContentScene (tips + image)
6. **Chapter: What's Next** — ContentScene (future outlook)

### Arc B: "Origin Story" (narrative-driven)
1. **Chapter: The Problem** — QuoteScene (provocative opening) → ContentScene (the pain point + image)
2. **Chapter: Before** — TimelineScene (failed attempts / prior art) → ContentScene (why they fell short)
3. **Chapter: The Breakthrough** — ContentScene (the insight + image) → DiagramScene (new architecture) → CodeScene (how it works)
4. **Chapter: Proof** — StatsScene (adoption/performance) → ComparisonScene (before vs after) → CodeScene (real example)
5. **Chapter: Deep Dive** — ContentScene (advanced concepts) → CodeScene (advanced usage) → DiagramScene (internals)
6. **Chapter: Impact** — QuoteScene (leader's perspective) → ContentScene (future + image)

### Arc C: "Builder" (tutorial-flavored)
1. **Chapter: Why This Matters** — ContentScene (problem statement + image) → StatsScene (market context)
2. **Chapter: Foundations** — DiagramScene (architecture overview) → CodeScene (hello world) → ContentScene (core concepts)
3. **Chapter: Building** — CodeScene (step 1) → ContentScene (explain + image) → CodeScene (step 2) → ContentScene (explain)
4. **Chapter: Advanced** — DiagramScene (advanced architecture) → CodeScene (advanced pattern) → ComparisonScene (approaches)
5. **Chapter: Production** — StatsScene (benchmarks) → QuoteScene (practitioner quote)
6. **Chapter: Ecosystem** — TimelineScene (roadmap) → ContentScene (resources + image)

### Arc D: "Debate" (contrarian/tension-driven)
1. **Chapter: The Controversy** — QuoteScene (bold claim) → ContentScene (the tension + image)
2. **Chapter: The Case For** — ContentScene (arguments + bullets) → CodeScene (strengths demo) → StatsScene (supporting data)
3. **Chapter: The Case Against** — ContentScene (counterarguments + image) → CodeScene (pain points) → StatsScene (counter data)
4. **Chapter: The Reality** — ComparisonScene (head to head) → DiagramScene (actual architecture) → ContentScene (nuanced take)
5. **Chapter: Context** — TimelineScene (how we got here) → QuoteScene (balanced perspective)
6. **Chapter: Verdict** — ContentScene (final take + image)

---

## Step 0.5: Check for Reference Transcription

Before researching, check if `~/remotion-fireship/data/videos/current.md` exists:

```bash
ls ~/remotion-fireship/data/videos/current.md 2>/dev/null && echo "FOUND" || echo "NOT FOUND"
```

**If `current.md` exists:** Read it in full. This is a transcription of a reference video. Use it as the **primary source material**:
- Follow its structure, talking points, and narrative flow closely
- Extract key facts, stats, quotes, and code examples directly from it
- Map the transcription's sections to the selected arc's chapter structure
- The video you generate should closely mirror the reference — same concepts, same order, same emphasis
- Tavily searches in Step 1 become **supplementary** — only fill gaps (verify stats, find missing dates, get exact quotes with attribution)

**If `current.md` does NOT exist:** Skip this step — Tavily is the sole research source.

---

## Step 1: Deep Research with Tavily

**If `current.md` was found:** Run **3-4 targeted searches** to fill gaps in the transcription. Focus on:
- Verifying specific stats and numbers mentioned in the transcript
- Finding attribution for quotes (real person + role)
- Getting exact dates for timeline events
- Any claims that need a source
Don't over-research — the transcription is your blueprint. You already have the narrative structure.

**If no `current.md`:** This is the full research mode. A longer video needs deeper material. Run **at least 6 searches**:

1. `mcp__tavily__search` — "{topic} overview statistics 2024 2025 2026" (advanced depth)
2. `mcp__tavily__search` — "{topic} architecture how it works technical deep dive" (advanced depth)
3. `mcp__tavily__search` — "{topic} history timeline milestones founding" (advanced depth)
4. `mcp__tavily__search` — "{topic} vs alternatives comparison benchmark" (advanced depth)
5. `mcp__tavily__search` — "{topic} tutorial getting started code examples" (advanced depth)
6. `mcp__tavily__searchQNA` — "what is {topic} and why does it matter"
7. `mcp__tavily__search` — "{topic} problems criticism limitations" (for balanced coverage)
8. `mcp__tavily__search` — "{topic} future roadmap predictions" (for closing sections)

Compile research into structured notes organized by chapter before proceeding.

---

## Step 2: Write Comprehensive Video JSON

Write to `~/remotion-fireship/data/videos/{slug}.json`.

### Content Quality Standards (same as /makevid)
- **Every fact, stat, and quote must come from research** — no placeholder text
- **Body text should be punchy and concise** — video script, not blog post
- **Sections flow naturally** — each chapter tells a mini-story within the larger arc

### Section Count: 15-20 sections
Follow the selected arc pattern. Scene types CAN repeat — a long video should have:
- **3-4 ContentScenes** (with images where possible)
- **2-3 CodeScenes** (different aspects: intro, usage, advanced)
- **2 DiagramScenes** (overview architecture + detailed internals)
- **1-2 StatsScenes**
- **1-2 QuoteScenes** (different people — use sparingly for impact)
- **1 TimelineScene**
- **1 ComparisonScene**

### Timing (longer than /makevid)
- ContentScenes with bullets: **7-8 seconds**
- ContentScenes with image (no bullets): **6-7 seconds**
- CodeScenes: **8-10 seconds** (viewer needs time to read)
- DiagramScenes: **7-8 seconds**
- StatsScenes: **6-7 seconds**
- QuoteScenes: **5-6 seconds**
- ComparisonScenes: **7-8 seconds**
- TimelineScenes: **6-7 seconds**
- **Target total: 120-240 seconds (2-4 minutes)**

### Transition Strategy
Same rules as `/makevid` but with more variety needed across 15-20 transitions. 8 types available: `slide`, `fade`, `wipe`, `zoom`, `glitch`, `clockWipe`, `flip`, `iris`:
- **Chapter openers**: `slide` or `iris` (signals new chapter with impact)
- **Technical/architecture**: `wipe` or `clockWipe` (reveals content)
- **Stats/evidence**: `fade` (smooth)
- **Dramatic moments**: `glitch` or `flip` (max 2-3 uses in entire video)
- **Code sections**: `fade` or `clockWipe` (circular reveal for variety)
- **Timeline/history**: `slide`
- **Within a chapter**: rotate through `fade`, `wipe`, `iris`, `clockWipe` for flow
- **Never use the same transition twice in a row**
- All transitions use `springTiming` for organic motion

### Validate
Schema is at `~/remotion-fireship/src/templates/fireship/schema.ts` — read it if unsure.

---

## Step 3: Write Voiceover Script

Same format as `/makevid` but longer. Create at `~/remotion-fireship/data/videos/{slug}-voiceover.md`:

```markdown
# {Topic} — Voiceover Script (Long Form)

## Chapter 1: {Chapter Name}

### Section 1: {heading} (0:00 - 0:08)
"Spoken text..."

### Section 2: {heading} (0:08 - 0:15)
"Spoken text..."

## Chapter 2: {Chapter Name}

### Section 3: {heading} (0:15 - 0:23)
"Spoken text..."

[continue for all sections]

---
Total duration: ~{X} seconds
Arc: {arc name}
Tone: Fireship-style — fast, punchy, slightly irreverent, technical but accessible
```

The voiceover should:
- Match section timing exactly
- Use chapter transitions naturally ("Now let's look at how this actually works...")
- Maintain energy across 2-4 minutes — vary pacing (faster for excitement, slower for code/diagrams)
- Include verbal chapter markers that feel natural, not forced
- Reference on-screen visuals ("as you can see in this diagram...")

---

## Step 3.5: Generate Per-Section Synced Voiceover Audio

**Use `tts-generate-synced.py`** — it generates TTS for each section individually, pads each clip with silence to match its visual duration, and concatenates them. This ensures perfect sync between voiceover and scene transitions (no narration cut off at scene changes).

```bash
cd ~/chatterbox-tts && source venv/bin/activate && python ~/remotion-fireship/scripts/tts-generate-synced.py \
  --voiceover ~/remotion-fireship/data/videos/{slug}-voiceover.md \
  --json ~/remotion-fireship/data/videos/{slug}.json \
  --slug "{slug}" \
  --voice-ref ~/remotion-fireship/public/voiceover/my-voice-ref.wav \
  --exaggeration 0.3 \
  --cfg-weight 0.5
```

**NOTE:** Slightly higher exaggeration (0.3) for long-form to keep energy up across longer duration.

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

If Chatterbox fails or no GPU is available, skip — the video works without voiceover.

---

## Step 4: Generate Images via Flux on Nova

**Generate 4-5 eye-catching images** (more than /makevid's 2). Each should illustrate a different chapter's key concept.

1. Check nova: `ssh nova "curl -s http://100.105.14.117:8095/status"`
2. If model-manager not running:
   - `ssh nova "docker start glm-server"`
   - `ssh nova "docker exec -d glm-server python3 /models/nova_model_manager/model_manager.py --port 8095"`
3. Generate images **one at a time** with unique slugs to avoid overwriting:
```bash
cd ~/remotion-fireship && npx ts-node scripts/flux-images.ts \
  --descriptions "PROMPT WITHOUT COMMAS" \
  --slug "{slug}-ch1" --width 1200 --height 800

npx ts-node scripts/flux-images.ts \
  --descriptions "PROMPT WITHOUT COMMAS" \
  --slug "{slug}-ch2" --width 1200 --height 800

npx ts-node scripts/flux-images.ts \
  --descriptions "PROMPT WITHOUT COMMAS" \
  --slug "{slug}-ch3" --width 1200 --height 800

npx ts-node scripts/flux-images.ts \
  --descriptions "PROMPT WITHOUT COMMAS" \
  --slug "{slug}-ch4" --width 1200 --height 800
```

**Use unique slugs per image** (e.g., `{slug}-ch1`, `{slug}-ch2`) to prevent the script from overwriting previous images (it always saves as `-0.png`).

**Flux Prompt Formula:** `[CONCRETE SUBJECT] + [ENVIRONMENT] + [LIGHTING] + [CAMERA] + [MOOD]`

**DO:** Lead with a concrete subject (robot, server rack, circuit board). Specify camera angle and lighting. Use semicolons not commas. Always include "dark background". Each image for a different chapter's concept.

**DON'T:** Ask Flux to render text. Use vague descriptions ("futuristic concept"). Use commas (script splits on them).

See `docs/IMAGE-GUIDE.md` for full prompt rules and examples.

4. Reference in JSON as `"image": "generated/{slug}-ch1-0.png"` etc. on ContentScene sections

If nova is unavailable, skip — procedural visuals work fine.

---

## Step 5: Render + Merge Audio (Both Formats)

**IMPORTANT:** Video JSON must NOT contain `voiceoverAudio`. Audio merged post-render.

### 5a. Ensure JSON has no voiceoverAudio
Remove if present.

### 5b. Render desktop format only
Long-form videos are desktop-only (TikTok is only for `/makevid` short-form):
```bash
# Desktop (1920x1080)
cd ~/remotion-fireship && npx remotion render src/index.tsx Fireship out/{slug}.mp4 --props="data/videos/{slug}.json"
```

### 5c. Merge voiceover audio via ffmpeg

**CRITICAL: Use `-map 0:v -map 1:a`** to pick voiceover over Remotion's silent audio track.

```bash
# Desktop final (with volume boost)
ffmpeg -y -i out/{slug}.mp4 -i public/voiceover/{slug}.mp3 \
  -map 0:v -map 1:a -c:v copy -af "volume=6dB" -c:a aac -b:a 192k -shortest out/{slug}-final.mp4
```

**Verify audio merged correctly:** `audio:` in ffmpeg output should show >500kB (not 16kB).

### 5d. Speed up 1.2x (final delivery)

Speed up video and audio by 1.2x for punchy Fireship pacing:

```bash
ffmpeg -y -i out/{slug}-final.mp4 \
  -filter_complex "[0:v]setpts=PTS/1.2[v];[0:a]atempo=1.2[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 192k out/{slug}-fast.mp4
```

The `-fast` file is the **primary deliverable**. Report duration and file size.

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
      "image": "generated/slug-ch1-0.png",
      "imageFrame": "none|browser|phone",
      "codeSnippet": { "code": "...", "language": "typescript", "filename": "index.ts" },
      "comparison": { "left": { "label": "A", "points": ["..."] }, "right": { "label": "B", "points": ["..."] } },
      "diagram": { "nodes": [{ "label": "Step", "icon": "brain" }] },
      "stats": { "items": [{ "label": "Users", "value": 1000000, "suffix": "+" }] },
      "quote": { "text": "...", "author": "Name", "role": "Title" },
      "timeline": { "events": [{ "year": "2024", "label": "Event" }] },
      "duration": 5,
      "transition": "slide|fade|wipe|zoom|glitch"
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
- **15-20 sections** grouped into 5-6 logical chapters
- **2-4 minutes total** (120-240 seconds)
- Scene types CAN and SHOULD repeat (multiple CodeScenes, ContentScenes)
- **Randomly select an arc** if user doesn't specify one — variety is the point
- Stats values must be real numbers from research
- Quotes must be real quotes from real people (under 30 words each)
- Timeline events must be real dates
- Diagram nodes: 2-5 nodes per diagram
- Never use the same transition consecutively
- `glitch` transition max 2 times per video
- Write voiceover to match timing exactly
- **Always use `-map 0:v -map 1:a` when merging audio**
- **Generate 4-5 Flux images with unique slugs per image**
- **Use unique slug suffixes** (`-ch1`, `-ch2`, etc.) to avoid overwriting
