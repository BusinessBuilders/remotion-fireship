# Image Guide

## Recommended Dimensions

- **Standard**: 1200x800 (3:2 aspect) or 1920x1080 (16:9)
- **Portrait elements**: 800x1200
- **Thumbnails**: 1280x720 (rendered via `FireshipThumbnail` Still composition)
- Images are displayed with `maxHeight: 400, maxWidth: 900, objectFit: contain` (side-by-side layout)

## Flux Prompt Rules (CRITICAL)

### DO:
- **Lead with a concrete subject** — person, object, machine, environment
- **Specify camera angle** — close-up, wide angle, overhead, isometric
- **Specify lighting** — "amber neon backlighting", "blue rim light", "volumetric fog"
- **Specify mood** — cinematic, dramatic, moody, clean, minimal
- **Use semicolons** instead of commas (the script splits on commas)
- **Always include** "dark background" or "dark environment" for video consistency

### DON'T:
- **Never ask Flux to render text** — it can't do legible text
- **Never use abstract descriptions** — "futuristic concept" means nothing to Flux
- **Never use vague adjectives** — "cool", "amazing", "nice" are useless
- **Avoid commas** in prompts — the script splits descriptions on commas

### Prompt Formula
```
[CONCRETE SUBJECT] + [SPECIFIC ENVIRONMENT] + [LIGHTING/COLOR] + [CAMERA/COMPOSITION] + [MOOD]
```

### Good Prompt Examples

**For a robotics video:**
```
"humanoid robot standing in a dark warehouse; scanning environment with blue laser beams from its head; amber and blue neon accent lighting; wide angle shot; cinematic moody atmosphere"
```

**For a database video:**
```
"close-up of glowing server rack in dark data center; rows of blinking orange LEDs reflecting on polished floor; shallow depth of field; dramatic low-angle shot"
```

**For an AI/ML video:**
```
"3D render of a neural network as a physical sculpture; chrome nodes connected by glowing amber wires; floating in dark void; studio lighting with single orange spotlight; clean minimal"
```

**For a cloud/DevOps video:**
```
"isometric view of miniature city made of containers and servers; dark background; connected by glowing blue pipelines; tilt-shift photography style; neon accents"
```

**For a security video:**
```
"extreme close-up of a padlock being picked by a robotic hand; sparks flying; dark background with red warning light illumination; macro photography style"
```

### Bad Prompt Examples (avoid these)
```
❌ "futuristic AI concept with glowing elements"          — too vague
❌ "Claude Code text logo on dark background"              — Flux can't render text
❌ "amazing technology visualization"                       — no concrete subject
❌ "a cool looking dashboard with charts and data"         — too generic
```

## Generating Images with Flux

```bash
# One image per command (descriptions splits on commas — avoid commas in prompts)
npx ts-node scripts/flux-images.ts \
  --descriptions "PROMPT HERE — use semicolons not commas" \
  --slug "topic-ch1" --width 1200 --height 800

# Use unique slug suffixes to avoid overwriting
npx ts-node scripts/flux-images.ts \
  --descriptions "SECOND PROMPT" \
  --slug "topic-ch2" --width 1200 --height 800
```

## Thumbnail Generation (Flux + Remotion)

Thumbnails use a two-step process: Flux generates the base image, Remotion overlays styled text.

### Step 1: Generate base image with Flux
```bash
npx ts-node scripts/flux-images.ts \
  --descriptions "SUBJECT-FOCUSED PROMPT; dark dramatic background; bold contrast; single focal point; cinematic wide angle" \
  --slug "topic-thumb" --width 1280 --height 720
```

**Thumbnail image prompts should have:**
- One clear dramatic subject (not abstract patterns)
- Bold contrast — bright subject on dark background
- Simple composition — readable at small sizes
- Match the video's color palette

### Step 2: Overlay text with Remotion
```bash
npx remotion still src/index.tsx FireshipThumbnail \
  out/thumbnail.png \
  --props='{"backgroundImage":"generated/topic-thumb-0.png","title":"Your Title Here","subtitle":"OPTIONAL SUBTITLE","primaryColor":"#FF6B00","accentColor":"#00d4ff","textPosition":"bottom-left"}'
```

**Text position options:**
- `"bottom-left"` — title anchored bottom-left with gradient overlay (default, most viral)
- `"left"` — title centered-left with side gradient
- `"center"` — title centered with radial vignette

The composition handles: bold 88-96px text with bloom glow, accent color subtitle, gradient overlay for readability, accent bars, corner glow.

## When to Use Each Scene Type

| Need | Scene Type | Notes |
|------|-----------|-------|
| Flow/architecture diagram | `diagram` | Uses SVG icons + animated arrows, no images needed |
| Side-by-side comparison | `comparison` | Code or bullet points, no images needed |
| Featured statistic | `stats` | Animated number counters, 2-4 items |
| Notable quote | `quote` | Word-by-word reveal with attribution |
| Historical progression | `timeline` | Infographic zigzag with per-event colors |
| Screenshot/photo | `image` | External image with glow frame, side-by-side layout |
| Code walkthrough | `codeSnippet` | Syntax highlighted, line-by-line reveal |
| General content | (default) | Text + optional bullets/images |

## Directory Structure

```
public/
  generated/       # Flux AI-generated images (gitignored)
  music/           # Background music (future)
  lottie/          # Lottie animations
  images/          # Curated/user-provided images
  voiceover/       # TTS-generated voiceover files
```

## Available Diagram Icons

`brain`, `database`, `search`, `cube`, `robot`, `code`,
`cloud`, `api`, `lock`, `lightning`, `server`, `terminal`,
`git`, `docker`, `kubernetes`, `aws`, `globe`, `chart`,
`shield`, `rocket`
