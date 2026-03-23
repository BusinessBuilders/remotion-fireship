# Image Guide

## Recommended Dimensions

- **Standard**: 1200x800 (3:2 aspect) or 1920x1080 (16:9)
- **Portrait elements**: 800x1200
- **Thumbnails**: 1280x720 (rendered via `FireshipThumbnail` Still composition)
- Images are displayed with `maxHeight: 400, maxWidth: 900, objectFit: contain` (side-by-side layout)

## Flux Prompt Rules (CRITICAL)

### The #1 Rule: Write Natural Language Prose

Flux uses a language model (T5 encoder) internally. It understands **flowing descriptive sentences** far better than keyword lists. Write prompts the way you'd describe a photograph to another person. **30-80 words** is the sweet spot.

### Prompt Structure

Lead with subject → environment → camera/lens → lighting → mood/atmosphere

```
[CONCRETE SUBJECT doing something] in [SPECIFIC ENVIRONMENT];
[CAMERA + LENS specs]; [LIGHTING description];
[ATMOSPHERIC details]; [MOOD]
```

### Camera & Lens Specs (BIGGEST quality lever)

Including a real camera + lens anchors photorealism dramatically:
- `"shot on Sony A7IV, 85mm f/1.2"` → shallow DOF portraits
- `"shot on Canon EOS R5, 35mm f/1.4"` → sharp detailed scenes
- `"shot on Hasselblad X2D, 45mm lens"` → medium format quality
- `"24-70mm lens"` → versatile landscape framing

### Film Stock References (controls color grading)

- `"Kodak Portra 400"` → warm, natural skin tones
- `"Fuji Velvia 50"` → vivid, saturated landscapes
- `"Kodak Ektar 100"` → fine grain, punchy colors
- `"80s vintage photography"` → retro color cast

### Material Specificity (grounds images in reality)

Name real materials: "brushed aluminum", "frosted glass", "worn leather", "polished obsidian", "carbon fiber", "oxidized copper", "matte black ceramic"

### Atmospheric Details (add life)

"steam rising", "dust motes in light beam", "rain on glass", "volumetric fog", "bokeh of city lights", "condensation on metal surface"

### DO:
- **Write natural prose** — describe the image as if talking to a person
- **Front-load the subject** — most important element first (word order matters)
- **Include camera + lens specs** — single biggest quality improvement
- **Name specific materials** — "brushed aluminum" not "metal"
- **Specify light source and direction** — "warm amber light from a single desk lamp casting long shadows"
- **Use semicolons** instead of commas (the script splits on commas)
- **Always include** "dark background" or "dark environment" for video consistency
- **Use positive framing** — describe what you want, not what to avoid

### DON'T:
- **Never use keyword dumps** — `"cyberpunk; neon; futuristic; dark; cool"` produces garbage
- **Never ask Flux to render text** — it can't do legible text reliably
- **Never use abstract descriptions** — "futuristic concept" or "AI visualization" means nothing
- **Never use vague adjectives** — "cool", "amazing", "nice" are useless
- **Never use negative prompts** — Flux doesn't support them; say "sharp focus" not "no blur"
- **Never use "white background"** — causes blurriness in Flux dev variant
- **Never use prompt weights** — syntax like `(concept)++` is unsupported
- **Avoid commas** in prompts — the script splits descriptions on commas

### Good Prompt Examples

**Tech/Hardware (cinematic product shot):**
```
"Close-up of a high-end GPU graphics card resting on a dark brushed aluminum surface; warm amber light from a single overhead source casting defined shadows; shallow depth of field with soft bokeh in the background; shot on Sony A7IV 85mm f/1.2; dark moody studio environment; Kodak Ektar 100 color grading"
```

**Data Center (environmental):**
```
"Long corridor of server racks in a dark data center; rows of blinking green and amber status LEDs reflecting on a polished concrete floor; cool blue overhead fluorescent lighting contrasting with warm indicator lights; volumetric haze in the air; shot on Canon EOS R5 24mm f/2.8; cinematic wide angle perspective"
```

**AI/Robotics (editorial portrait):**
```
"A humanoid robotic hand reaching toward a glowing holographic interface in a dim laboratory; the hand is made of matte black carbon fiber with chrome joint details; warm amber desk lamp provides key light from the left; shallow depth of field; shot on Hasselblad X2D 90mm lens; dust motes visible in the light beam; dark environment"
```

**Abstract Tech (grounded in physical objects):**
```
"Extreme macro close-up of a silicon wafer showing intricate circuit pathways; the pathways glow with a subtle green luminescence; dark void background; the wafer surface shows realistic microscopic texture and imperfections; shot on Canon MP-E 65mm macro lens at 5x magnification; clinical studio lighting with soft diffusion"
```

**Security/Lock (dramatic):**
```
"A heavy steel padlock sitting on a worn wooden table in a dimly lit room; the padlock has visible scratches and patina on brushed stainless steel; a single shaft of amber light cuts through darkness from a window; dust particles floating in the light beam; shot on Sony A7IV 50mm f/1.4; moody film noir atmosphere; Kodak Portra 400"
```

### Bad Prompt Examples (avoid these)
```
❌ "futuristic AI concept with glowing elements"          — too vague, no physical anchor
❌ "Claude Code text logo on dark background"              — Flux can't render text
❌ "amazing technology visualization"                       — no concrete subject
❌ "recursive spiral of neural network layers"              — abstract nonsense
❌ "cyberpunk; neon; dark; cinematic; cool; futuristic"    — keyword dump, not prose
❌ "a cool looking dashboard with charts and data"         — too generic, no materials
```

### Technical Settings

| Setting | Recommended | Notes |
|---------|-------------|-------|
| Steps | **28** (default) | 24-32 for quality; 15 is too low |
| Guidance | 3.0-3.8 | Higher = more prompt adherence |
| Width | 1200 | Standard video image |
| Height | 800 | 3:2 aspect ratio |

## Generating Images with Flux

```bash
# One image per command (descriptions splits on commas — avoid commas in prompts)
npx ts-node scripts/flux-images.ts \
  --descriptions "NATURAL LANGUAGE PROMPT — use semicolons not commas" \
  --slug "topic-ch1" --width 1200 --height 800

# Use unique slug suffixes to avoid overwriting
npx ts-node scripts/flux-images.ts \
  --descriptions "SECOND PROMPT" \
  --slug "topic-ch2" --width 1200 --height 800

# Higher steps for extra quality (default is now 28)
npx ts-node scripts/flux-images.ts \
  --descriptions "PROMPT" \
  --slug "topic-ch3" --steps 32 --width 1200 --height 800
```

## Thumbnail Generation (Flux + Remotion)

Thumbnails use a two-step process: Flux generates the base image, Remotion overlays styled text.

### Step 1: Generate base image with Flux
```bash
npx ts-node scripts/flux-images.ts \
  --descriptions "ONE DRAMATIC CONCRETE SUBJECT; dark background; bold contrast; single focal point; shot on Sony A7IV 35mm f/1.8; cinematic wide angle" \
  --slug "topic-thumb" --width 1280 --height 720
```

**Thumbnail image prompts should have:**
- One clear dramatic subject (not abstract patterns)
- Bold contrast — bright subject on dark background
- Simple composition — readable at small sizes
- Match the video's color palette
- Camera + lens spec for quality anchoring

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
