---
name: remotion-fireship
description: Analyze, improve, or create Remotion video templates in the fireship style. Use when working on Remotion video generation, fireship-style tech explainers, video templates, composition improvements, asset management, or automated video pipelines. Triggers on mentions of remotion, fireship, video template, video generation, compositions, or video automation.
---

# Remotion Fireship Template Builder & Optimizer

Build and optimize Remotion video templates that produce Fireship-style fast-paced, visually rich tech explainer videos with programmatic generation.

## Quick Start — Audit Existing Template

Before doing ANYTHING, run a full audit of the current state:

```bash
# 1. Map the entire project
find ~/remotion -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" -o -name "*.json" -o -name "*.css" \) | head -80

# 2. Find existing templates
find ~/remotion -type d -name "*template*" -o -name "*fireship*" 2>/dev/null
ls ~/remotion/templates/ 2>/dev/null
ls ~/remotion/src/templates/ 2>/dev/null

# 3. Find the Root composition and all compositions
grep -r "registerRoot\|<Composition" ~/remotion/src --include="*.tsx" --include="*.ts" -l

# 4. Check what assets already exist
find ~/remotion -type d -name "assets" -o -name "public" -o -name "static" -o -name "images" -o -name "fonts" 2>/dev/null
find ~/remotion/public -type f 2>/dev/null | head -40

# 5. Check the input schema / props structure
grep -r "inputProps\|defaultProps\|schema\|z\.object" ~/remotion/src --include="*.ts" --include="*.tsx" | head -20

# 6. Check package.json for what's installed
cat ~/remotion/package.json

# 7. Find how videos are rendered/triggered
grep -r "renderMedia\|bundle\|npx remotion" ~/remotion --include="*.ts" --include="*.tsx" --include="*.sh" --include="*.js" -l
```

## Step 1: Understand Current Template Anatomy

After the audit, map each file to its role:

| File Pattern | Role | What to Look For |
|---|---|---|
| `Root.tsx` | Composition registry | All registered compositions, fps, dimensions, duration |
| `**/Composition.tsx` | Main video component | Top-level structure, scene ordering |
| `**/scenes/*.tsx` | Individual scenes | Intro, content sections, outro |
| `**/components/*.tsx` | Reusable elements | Code blocks, titles, transitions, avatars |
| `**/lib/schema.ts` | Input props schema | What data drives the video |
| `**/styles/*.css` | Global styles | Fonts, base colors |
| `public/` or `assets/` | Static assets | Images, fonts, audio, backgrounds |

**CRITICAL**: Read every `.tsx` file in the template. Don't skim. The quality ceiling depends on understanding what each animation does and how data flows through props.

## Step 2: Identify What's Missing (Gap Analysis)

A high-quality fireship-style video needs ALL of these. Check each one:

### Data/Content Layer (what drives the video)
- [ ] **Rich input schema** — Does the schema accept enough data? It should support:
  - `title`, `subtitle`, `topic`
  - `sections[]` — array of content sections, each with heading, body, talking points
  - `codeSnippets[]` — code blocks with language, content, highlights
  - `images[]` — URLs or paths to visual assets per section
  - `backgroundMusic` — audio file path
  - `voiceoverScript` or `voiceoverAudio` — narration
  - `branding` — colors, logo, watermark
  - `metadata` — author, date, duration hints

### Visual Layer (what the viewer sees)
- [ ] **Dynamic backgrounds** — Gradient animations, particle effects, or subtle patterns (not static colors)
- [ ] **Code display component** — Syntax-highlighted code with line-by-line reveal animation
- [ ] **Image/screenshot component** — Framed screenshots, browser mockups, device frames
- [ ] **Icon/logo component** — Tech logos (React, Python, Docker etc.) with entrance animations
- [ ] **Text typography** — Multiple font weights, sizes. Title vs body vs code distinction
- [ ] **Progress indicator** — Timeline bar, section counter, or chapter markers
- [ ] **Transitions** — Slide, zoom, morph, glitch between sections (not just cuts)
- [ ] **Lower thirds** — Name/topic overlays
- [ ] **Split layouts** — Code left / explanation right, before/after comparisons

### Motion Layer (how things move)
- [ ] **Spring animations** — `useSpring()` for natural feeling motion
- [ ] **Staggered entrances** — Elements arriving in sequence, not all at once
- [ ] **Parallax depth** — Background moves slower than foreground
- [ ] **Easing curves** — Custom bezier curves, not just linear
- [ ] **Camera movements** — Scale/translate the entire scene for zoom effects

### Audio Layer
- [ ] **Background music** — Loopable track, volume ducking during speech
- [ ] **Sound effects** — Whoosh on transitions, click on code typing, notification sounds
- [ ] **Voiceover sync** — Audio aligned to scene timestamps

### Asset Pipeline
- [ ] **Font loading** — Custom fonts loaded via `@font-face` or `staticFile()`
- [ ] **Image optimization** — Pre-sized images, not runtime scaling
- [ ] **SVG icons** — Vector tech logos, not raster

## Step 3: Asset Organization

### Recommended Directory Structure

```
~/remotion/
├── public/
│   ├── fonts/
│   │   ├── Inter-Bold.woff2
│   │   ├── Inter-Regular.woff2
│   │   └── JetBrainsMono-Regular.woff2    # For code
│   ├── images/
│   │   ├── backgrounds/
│   │   │   ├── gradient-dark.png
│   │   │   ├── grid-pattern.svg
│   │   │   └── noise-texture.png
│   │   ├── logos/                          # Tech logos per topic
│   │   │   ├── react.svg
│   │   │   ├── python.svg
│   │   │   └── docker.svg
│   │   ├── screenshots/                   # Per-video screenshots
│   │   │   └── {video-id}/
│   │   │       ├── screenshot-1.png
│   │   │       └── screenshot-2.png
│   │   └── avatars/
│   │       └── host-avatar.png
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── upbeat-tech.mp3
│   │   │   └── chill-ambient.mp3
│   │   ├── sfx/
│   │   │   ├── whoosh.mp3
│   │   │   ├── click.mp3
│   │   │   ├── pop.mp3
│   │   │   └── notification.mp3
│   │   └── voiceover/
│   │       └── {video-id}.mp3
│   └── lottie/                            # Optional animated elements
│       ├── loading-spinner.json
│       └── checkmark.json
├── src/
│   ├── templates/
│   │   └── fireship/
│   │       ├── index.tsx                  # Composition export
│   │       ├── schema.ts                  # Zod input props schema
│   │       ├── Fireship.tsx               # Main composition
│   │       ├── scenes/
│   │       │   ├── IntroScene.tsx
│   │       │   ├── ContentScene.tsx
│   │       │   ├── CodeScene.tsx
│   │       │   ├── ComparisonScene.tsx
│   │       │   └── OutroScene.tsx
│   │       ├── components/
│   │       │   ├── AnimatedCode.tsx
│   │       │   ├── TechLogo.tsx
│   │       │   ├── ProgressBar.tsx
│   │       │   ├── SectionTitle.tsx
│   │       │   ├── BrowserFrame.tsx
│   │       │   ├── GlitchTransition.tsx
│   │       │   └── ParticleBackground.tsx
│   │       ├── hooks/
│   │       │   ├── useAnimatedText.ts
│   │       │   └── useSceneTimeline.ts
│   │       └── styles/
│   │           └── fireship.module.css
│   └── ...
└── data/
    └── videos/
        └── {video-id}.json               # Per-video input data
```

### Where Assets Go — Quick Reference

| Asset Type | Location | Why |
|---|---|---|
| Fonts | `public/fonts/` | Loaded via `staticFile()`, available at render |
| Background images/textures | `public/images/backgrounds/` | Reusable across videos |
| Tech logos/icons | `public/images/logos/` | Referenced by name in input data |
| Per-video screenshots | `public/images/screenshots/{id}/` | Unique to each video |
| Background music | `public/audio/bgm/` | Selected per video via props |
| Sound effects | `public/audio/sfx/` | Triggered at specific frames |
| Voiceover | `public/audio/voiceover/` | Generated per video (ElevenLabs/TTS) |
| Input data JSON | `data/videos/` | Drives what each video contains |

## Step 4: Build or Improve the Template

### Input Schema (schema.ts) — This Is The Most Important File

```typescript
import { z } from 'zod';

export const fireshipSchema = z.object({
  // Core content
  title: z.string().describe('Video title shown in intro'),
  subtitle: z.string().optional().describe('Secondary tagline'),
  topic: z.string().describe('Main technology/topic name'),
  topicLogo: z.string().optional().describe('Path to topic logo SVG'),

  // Sections — the meat of the video
  sections: z.array(z.object({
    heading: z.string(),
    body: z.string().describe('Main explanation text, 1-3 sentences'),
    bulletPoints: z.array(z.string()).optional(),
    image: z.string().optional().describe('Screenshot or diagram path'),
    imageFrame: z.enum(['browser', 'phone', 'terminal', 'none']).default('none'),
    codeSnippet: z.object({
      code: z.string(),
      language: z.string(),
      highlightLines: z.array(z.number()).optional(),
      filename: z.string().optional(),
    }).optional(),
    duration: z.number().optional().describe('Scene duration in seconds, default 5'),
    transition: z.enum(['slide', 'zoom', 'glitch', 'fade', 'morph']).default('slide'),
  })),

  // Audio
  backgroundMusic: z.string().optional().describe('Path to BGM file'),
  musicVolume: z.number().min(0).max(1).default(0.3),
  voiceoverAudio: z.string().optional().describe('Path to voiceover file'),

  // Branding / Style
  style: z.object({
    primaryColor: z.string().default('#FF6B00'),
    secondaryColor: z.string().default('#1a1a2e'),
    backgroundColor: z.string().default('#0a0a0a'),
    accentColor: z.string().default('#00d4ff'),
    fontFamily: z.string().default('Inter'),
    codeFontFamily: z.string().default('JetBrains Mono'),
  }).optional(),

  // Metadata
  fps: z.number().default(30),
  width: z.number().default(1920),
  height: z.number().default(1080),
  watermark: z.string().optional().describe('Watermark text or logo path'),
});

export type FireshipProps = z.infer<typeof fireshipSchema>;
```

### Key Components to Build/Improve

Read the reference file for complete component implementations:
→ See [components-reference.md](components-reference.md)

### Scene Timeline Architecture

```
Frame 0                                                    Frame N
├── IntroScene (3-5s) ──┤
│   - Title zoom in      │
│   - Logo animate       │
│   - Subtitle fade      │
│                        ├── ContentScene 1 (4-6s) ──┤
│                        │   - Heading slide in       │
│                        │   - Body text type          │
│                        │   - Image/code reveal       │
│                        │                             ├── ContentScene 2 ──┤
│                        │                             │   ...               │
│                        │                             │                     ├── OutroScene (3s)
│                        │                             │                     │   - Summary
│                        │                             │                     │   - CTA
│                        │                             │                     │   - Logo
├── ProgressBar (entire duration) ─────────────────────────────────────────┤
├── BackgroundMusic (entire duration, fade in/out) ────────────────────────┤
├── Watermark (entire duration) ───────────────────────────────────────────┤
```

## Step 5: Input Data JSON Example

Create a sample data file that demonstrates all features:

```json
{
  "title": "Docker in 100 Seconds",
  "subtitle": "Containers explained fast",
  "topic": "Docker",
  "topicLogo": "logos/docker.svg",
  "sections": [
    {
      "heading": "What is Docker?",
      "body": "Docker packages your app and its dependencies into a lightweight container that runs anywhere.",
      "image": "screenshots/docker/docker-desktop.png",
      "imageFrame": "browser",
      "duration": 5,
      "transition": "slide"
    },
    {
      "heading": "The Dockerfile",
      "body": "Everything starts with a Dockerfile — a recipe for your container image.",
      "codeSnippet": {
        "code": "FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"node\", \"index.js\"]",
        "language": "dockerfile",
        "highlightLines": [1, 5],
        "filename": "Dockerfile"
      },
      "duration": 7,
      "transition": "zoom"
    },
    {
      "heading": "Build & Run",
      "body": "Two commands to go from code to running container.",
      "codeSnippet": {
        "code": "docker build -t myapp .\ndocker run -p 3000:3000 myapp",
        "language": "bash",
        "filename": "terminal"
      },
      "duration": 5,
      "transition": "glitch"
    }
  ],
  "backgroundMusic": "audio/bgm/upbeat-tech.mp3",
  "musicVolume": 0.25,
  "style": {
    "primaryColor": "#2496ED",
    "accentColor": "#00d4ff"
  }
}
```

## Step 6: Rendering & Automation

### Manual render
```bash
cd ~/remotion
npx remotion render src/index.ts fireship out/video.mp4 \
  --props="data/videos/docker-100s.json"
```

### Programmatic render (for pipeline)
```typescript
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';

async function renderVideo(propsFile: string, outputPath: string) {
  const bundled = await bundle(path.resolve('./src/index.ts'));
  const inputProps = JSON.parse(fs.readFileSync(propsFile, 'utf-8'));

  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'fireship',
    inputProps,
  });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
  });
}
```

## Step 7: Quality Checklist Before Render

Before rendering any video, verify:

- [ ] All images referenced in props exist in `public/`
- [ ] Font files are present and loaded
- [ ] Code snippets have correct language tags
- [ ] Scene durations add up to desired total length
- [ ] Audio files exist if referenced
- [ ] No text overflows its container (check at 1920x1080)
- [ ] Transitions don't create jarring jumps
- [ ] Color contrast passes accessibility (text readable on backgrounds)
- [ ] Watermark doesn't obscure content

## Common Problems & Fixes

| Problem | Cause | Fix |
|---|---|---|
| Static/boring look | No animations | Add `useSpring()`, `interpolate()` to every element |
| Text appears instantly | No entrance animation | Use `useCurrentFrame()` + opacity/translate interpolation |
| Jarring scene changes | Missing transitions | Add transition components between scenes |
| Code is unreadable | Wrong font size or no highlighting | Use monospace font at min 24px, add syntax highlighting |
| Video feels generic | No brand colors or personality | Pass style config through props, use distinctive color palette |
| Assets missing at render | Wrong paths | Use `staticFile()` for everything in `public/` |
| Audio doesn't play | Wrong format or path | Convert to MP3, use `staticFile()` path |

## Integration with AI Pipeline

For automated video generation (Claude Code → Remotion):

1. **Claude generates the JSON** — Use Claude to create the input props JSON from a topic
2. **Image generation** — Use DALL-E/Stable Diffusion for custom visuals, save to `public/images/screenshots/`
3. **TTS voiceover** — Generate with ElevenLabs/OpenAI TTS, save to `public/audio/voiceover/`
4. **Render** — Call the render script with the generated JSON
5. **Post-process** — Add captions with ffmpeg if needed

```bash
# Full pipeline example
claude "Generate fireship JSON for: React Server Components" > data/videos/rsc.json
python generate_assets.py data/videos/rsc.json  # generates images + voiceover
npx remotion render src/index.ts fireship out/rsc.mp4 --props="data/videos/rsc.json"
```
