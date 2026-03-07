# Components Reference — Fireship Template

## Core Animation Patterns

### useAnimatedText Hook
Typewriter effect for text reveal:

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const useAnimatedText = (text: string, startFrame: number = 0, speed: number = 2) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(
    interpolate(frame - startFrame, [0, text.length * speed], [0, text.length], {
      extrapolateRight: 'clamp',
    })
  );
  return text.slice(0, Math.max(0, charsToShow));
};
```

### useSceneTimeline Hook
Manage sequential scenes with automatic frame offsets:

```tsx
import { useCurrentFrame } from 'remotion';

interface Scene {
  id: string;
  durationInSeconds: number;
}

export const useSceneTimeline = (scenes: Scene[], fps: number) => {
  const frame = useCurrentFrame();
  let accumulated = 0;

  for (const scene of scenes) {
    const durationInFrames = scene.durationInSeconds * fps;
    if (frame < accumulated + durationInFrames) {
      return {
        activeScene: scene.id,
        sceneFrame: frame - accumulated,
        sceneProgress: (frame - accumulated) / durationInFrames,
        totalProgress: frame / scenes.reduce((s, sc) => s + sc.durationInSeconds * fps, 0),
      };
    }
    accumulated += durationInFrames;
  }

  return {
    activeScene: scenes[scenes.length - 1].id,
    sceneFrame: 0,
    sceneProgress: 1,
    totalProgress: 1,
  };
};
```

## Visual Components

### AnimatedCode — Syntax highlighted code with line reveal

Key features:
- Line-by-line appearance with stagger
- Highlighted lines glow or pulse
- Terminal/editor frame wrapper
- Typing cursor on active line

Implementation approach:
```tsx
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { staticFile } from 'remotion';

// Split code into lines
// For each line, calculate entrance frame based on index * stagger
// Use interpolate for opacity and translateY (slide up into place)
// Highlighted lines get a background-color pulse using spring()
// Wrap in a "code editor" frame with filename tab, traffic lights, line numbers
```

Props it should accept:
```typescript
interface AnimatedCodeProps {
  code: string;
  language: string;
  highlightLines?: number[];
  filename?: string;
  staggerFrames?: number;      // frames between each line appearing (default: 4)
  showLineNumbers?: boolean;    // default: true
  theme?: 'dark' | 'monokai' | 'dracula';
  fontSize?: number;           // default: 20
}
```

### SectionTitle — Animated heading with accent bar

Key features:
- Accent color bar slides in from left
- Title text fades in and slides right
- Optional subtitle fades in with delay
- Exit animation (reverse) at scene end

```tsx
// Accent bar: width interpolated from 0 to 4px, height from 0 to 100%
// Title: opacity 0→1, translateX -30→0, with spring easing
// Subtitle: same but delayed by 8-10 frames
// Use sequence: <Sequence from={startFrame} durationInFrames={duration}>
```

### BrowserFrame — Screenshot in a browser mockup

Key features:
- Chrome-like browser frame with URL bar
- Screenshot zooms in slightly (ken burns)
- Optional highlight rectangles that pulse over specific areas
- Shadow and rounded corners

```tsx
// Outer container: rounded-xl, shadow-2xl, overflow-hidden
// Top bar: h-10, flex, traffic light dots (red/yellow/green circles)
// URL bar: bg-gray-100, rounded, shows fake URL
// Content area: <Img src={staticFile(imagePath)} />
//   - Apply subtle scale interpolation 1.0 → 1.05 over scene duration
//   - Optional: AbsoluteFill highlight overlay boxes with pulsing border
```

### TechLogo — Animated logo entrance

Key features:
- Logo scales from 0 to 1 with spring bounce
- Optional glow/shadow effect matching brand color
- Can orbit or float with subtle sine wave motion

```tsx
// Scale: spring({frame, fps, config: {mass: 0.5, damping: 12}})
// Glow: box-shadow with topic's primary color, opacity pulsing
// Float: translateY using Math.sin(frame * 0.05) * 3 for subtle bob
```

### ProgressBar — Video timeline indicator

Key features:
- Thin bar at top or bottom of frame
- Fills based on overall video progress
- Optional section markers / chapter dots
- Color matches brand accent

```tsx
// Full-width bar at bottom, height: 4px
// Inner fill width: interpolate(frame, [0, totalFrames], ['0%', '100%'])
// Section markers: small circles at each section boundary frame
// Use AbsoluteFill positioned at bottom
```

### ParticleBackground — Subtle animated background

Key features:
- Floating dots/lines that drift slowly
- Very low opacity (0.1-0.2) to not distract
- Parallax — moves opposite to content for depth
- Color-matched to theme

```tsx
// Generate N particles with random positions (seeded for consistency)
// Each particle: small circle, opacity 0.1-0.2
// Movement: translateX/Y using frame * speed * direction
// Connect nearby particles with thin lines (constellation effect)
// IMPORTANT: Use deterministic random (seed) so renders are consistent
```

### GlitchTransition — Scene transition effect

Key features:
- RGB split (offset red, green, blue channels)
- Scanline overlay
- Brief scale distortion
- Duration: 6-10 frames

```tsx
// Split frame into RGB layers offset by ±5px for 6 frames
// Overlay horizontal scanlines (repeating gradient)
// Scale: spring from 1.02 back to 1.0
// Apply to outgoing scene's last frames + incoming scene's first frames
```

## Layout Templates

### Split Layout (Code + Explanation)
```
┌──────────────────────────────────────────────┐
│  ┌───────────────┐  ┌────────────────────┐   │
│  │               │  │                    │   │
│  │  Code Block   │  │   Explanation      │   │
│  │  (55% width)  │  │   (45% width)      │   │
│  │               │  │   • Bullet 1       │   │
│  │               │  │   • Bullet 2       │   │
│  └───────────────┘  └────────────────────┘   │
│  [Progress Bar]                               │
└──────────────────────────────────────────────┘
```

### Full Visual Layout (Screenshot focus)
```
┌──────────────────────────────────────────────┐
│  [Section Title]                              │
│  ┌──────────────────────────────────────┐     │
│  │                                      │     │
│  │        Browser Frame                 │     │
│  │        + Screenshot                  │     │
│  │        (80% width, centered)         │     │
│  │                                      │     │
│  └──────────────────────────────────────┘     │
│  [Caption text below]                         │
│  [Progress Bar]                               │
└──────────────────────────────────────────────┘
```

### Title Card Layout (Intro/Outro)
```
┌──────────────────────────────────────────────┐
│                                               │
│           [Tech Logo - large]                 │
│                                               │
│        ═══ TITLE TEXT ═══                     │
│           subtitle text                       │
│                                               │
│         [Particle Background]                 │
│                                               │
└──────────────────────────────────────────────┘
```

## Animation Timing Cheat Sheet

| Element | Entrance Duration | Technique | Easing |
|---|---|---|---|
| Title text | 15-20 frames | opacity + translateX | spring (mass: 0.8) |
| Body text | 8-12 frames per line | opacity + translateY | ease-out |
| Code lines | 3-5 frames stagger | opacity + translateY | linear |
| Images | 20-25 frames | scale 0.9→1.0 + opacity | spring (damping: 15) |
| Logos | 12-18 frames | scale 0→1.0 | spring (mass: 0.5, damping: 10) |
| Transitions | 6-10 frames | varies by type | ease-in-out |
| Progress bar | continuous | width interpolation | linear |

## Font Stack

```css
/* Load these in your template */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 700;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
}

/* Usage */
/* Titles: Inter Bold, 64-80px */
/* Body: Inter Regular, 28-36px */
/* Code: JetBrains Mono, 20-24px */
/* Captions: Inter Regular, 20-24px */
```

## Color Palettes

### Default Dark (Fireship-inspired)
```
Background:  #0a0a0a (near black)
Surface:     #1a1a2e (dark navy)
Primary:     #FF6B00 (orange)
Accent:      #00d4ff (cyan)
Text:        #ffffff
Text Muted:  #888888
Code BG:     #1e1e1e (VS Code dark)
Success:     #00ff88
Error:       #ff4444
```

### Topic-Adaptive
Pass `style.primaryColor` through props to match the topic:
- React: `#61DAFB`
- Python: `#3776AB`
- Docker: `#2496ED`
- Rust: `#DEA584`
- Go: `#00ADD8`
- TypeScript: `#3178C6`

## Performance Tips

1. **Use `<Img>` from `@remotion/img`** instead of `<img>` — handles loading states
2. **Preload heavy assets** with `prefetch()` from `@remotion/preload`
3. **Avoid `filter: blur()`** on large elements — extremely slow to render
4. **Use `will-change: transform`** on animated elements
5. **Keep total composition under 5 minutes** for reasonable render times
6. **Use `--concurrency=4`** flag for faster rendering (adjust to your CPU)
7. **Render at 30fps** for YouTube (60fps doubles render time with minimal benefit for explainers)
