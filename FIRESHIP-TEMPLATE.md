# Fireship Video Template

## Overview

A data-driven Remotion video template inspired by Fireship's "X in 100 Seconds" format. All content is driven by JSON input — no hardcoded content, no external media required.

## Architecture

```
src/templates/fireship/
├── index.tsx              # Composition registration + calculateMetadata
├── schema.ts              # Zod input schema + shared timing constants
├── Fireship.tsx            # Main orchestrator (TransitionSeries + Audio + ProgressBar)
├── scenes/
│   ├── IntroScene.tsx      # Title card + logo + particles
│   ├── ContentScene.tsx    # Adaptive: text+code, text+image, text+bullets
│   ├── CodeScene.tsx       # Full-screen syntax-highlighted code
│   ├── ComparisonScene.tsx # Side-by-side with "VS" divider
│   └── OutroScene.tsx      # CTA + subscribe + bottom bar
├── components/
│   ├── AnimatedCode.tsx    # Prism syntax highlighting, line-by-line reveal
│   ├── SectionTitle.tsx    # Heading with accent bar + spring animation
│   ├── BrowserFrame.tsx    # Chrome-like screenshot mockup + Ken Burns
│   ├── TechLogo.tsx        # Logo with spring bounce + glow
│   ├── ProgressBar.tsx     # Timeline indicator with section markers
│   ├── ParticleBackground.tsx  # Deterministic floating particles (alea)
│   ├── GlitchTransition.tsx    # Custom RGB-split transition effect
│   ├── GridBackground.tsx  # SVG grid overlay
│   └── GradientText.tsx    # Gradient text utility
├── hooks/
│   ├── useAnimatedText.ts  # Typewriter effect
│   └── useSceneTimeline.ts # Scene frame/progress tracking
└── styles/
    ├── theme.ts            # Dynamic color/font system from props
    └── fonts.ts            # Inter + JetBrains Mono via @remotion/google-fonts
```

## Usage

### Preview in Studio
```bash
npm run start
# Navigate to Templates > Fireship in the sidebar
```

### Render with JSON props
```bash
npx remotion render src/index.tsx Fireship out/my-video.mp4 --props="data/videos/docker-100s.json"
```

### Edit props in Studio
All props are editable in the Remotion Studio sidebar:
- Change `style.primaryColor` to theme the entire video
- Add/remove sections to change content and duration
- Set `transition` per section: `fade`, `slide`, `wipe`, `zoom`, `glitch`

## JSON Input Schema

```json
{
  "title": "Your Topic",
  "subtitle": "// optional tagline",
  "topic": "Category",
  "topicLogo": "logo.png",           // optional, in public/ or URL
  "sections": [
    {
      "heading": "Section Title",
      "body": "Description text",
      "bulletPoints": ["Point 1", "Point 2"],
      "duration": 5,
      "transition": "slide"
    },
    {
      "heading": "Code Example",
      "body": "Explanation",
      "codeSnippet": {
        "code": "const x = 1;",
        "language": "typescript",
        "filename": "index.ts",
        "highlightLines": [1]
      },
      "duration": 6,
      "transition": "fade"
    },
    {
      "heading": "Comparison",
      "comparison": {
        "left": { "label": "Before", "points": ["Slow", "Manual"] },
        "right": { "label": "After", "points": ["Fast", "Automated"] }
      },
      "duration": 6,
      "transition": "glitch"
    }
  ],
  "backgroundMusic": "music.mp3",     // optional
  "backgroundMusicVolume": 0.3,
  "style": {
    "primaryColor": "#FF6B00",
    "accentColor": "#00d4ff",
    "backgroundColor": "#0a0a0a"
  },
  "watermark": "your-channel"         // optional
}
```

## Scene Types

| Scene | Triggered When | Layout |
|-------|---------------|--------|
| IntroScene | Always first | Centered title + logo + particles |
| ContentScene | Default section | Adaptive: code+text split, image+browser, or text+bullets |
| CodeScene | `codeSnippet` without `image` | Full-screen syntax-highlighted code |
| ComparisonScene | `comparison` field present | Side-by-side with animated "VS" |
| OutroScene | Always last | CTA button + subscribe + bottom bar |

## Transitions

- `fade` — Cross-fade (default)
- `slide` — Slide from right
- `wipe` — Wipe effect
- `zoom` — Slide from bottom
- `glitch` — Custom RGB channel split + scanlines

## No External Media Required

Everything is procedurally generated: particles, grids, gradients, code highlighting, text animations. Optional fields (`topicLogo`, `image`, `backgroundMusic`) only load if provided.
