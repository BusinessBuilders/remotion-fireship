# Remotion Fireship Project

## Project Overview
Remotion v4.0.332 video generation project with a data-driven Fireship-style "X in 100 Seconds" template system. TypeScript strict mode enabled.

## Required Tools & Skills
- **Always** invoke the `/remotion-best-practices` skill before writing any Remotion code
- **Always** use the `mcp__remotion-documentation__remotion-documentation` MCP tool to look up Remotion APIs before implementing — do not guess at API signatures
- **Always** use `mcp__context7__resolve-library-id` + `mcp__context7__query-docs` for any dependency docs (zod, prism-react-renderer, etc.)

## Generating a Video from a Topic

1. Create JSON at `data/videos/{topic}.json` following `schema.ts`
2. Or use the pipeline: `npm run generate -- --topic "AI Agents"`
3. For images: either reference existing files in `public/` or describe what's needed
4. For Flux generation: `npx ts-node scripts/flux-images.ts --descriptions "..." --slug "topic"` (calls nova via Tailscale REST API)
5. Render: `npx remotion render src/index.tsx Fireship out/{topic}.mp4 --props="data/videos/{topic}.json"`
6. Or shorthand: `npm run render:fireship -- out/video.mp4 --props="data/videos/topic.json"`

## Fireship Template System

### Location
`src/templates/fireship/` — see `FIRESHIP-TEMPLATE.md` for full architecture docs.

### Creating a New Video
1. Create a JSON file at `data/videos/[topic].json` following the Zod schema in `src/templates/fireship/schema.ts`
2. The schema defines all valid fields, defaults, and types — read it first
3. No external media is required — all visuals are procedurally generated
4. Optional: add images to `public/`, reference by filename; audio same way

### Key Files
- `src/templates/fireship/schema.ts` — Zod schema (single source of truth for props + timing constants)
- `src/templates/fireship/Fireship.tsx` — Main orchestrator (TransitionSeries + light leaks)
- `src/templates/fireship/index.tsx` — Composition registration + calculateMetadata
- `src/Root.tsx` — All compositions registered here
- `src/templates/fireship/scenes/` — All scene components
- `src/templates/fireship/components/TechIcons.tsx` — SVG icon library (20 icons)
- `src/templates/fireship/components/LightLeak.tsx` — Animated light leak overlay
- `src/templates/fireship/components/FlowDiagram.tsx` — Animated flow chart with arrows
- `src/templates/fireship/components/GlowOrb.tsx` — Pulsing ambient light orbs
- `src/templates/fireship/components/ConstellationBg.tsx` — Connected dot network
- `src/templates/fireship/components/FloatingCode.tsx` — Drifting code tokens
- `src/templates/fireship/components/LottieHero.tsx` — Lottie animation wrapper (@remotion/lottie)
- `scripts/generate-video.ts` — Video generation pipeline
- `scripts/flux-images.ts` — Flux AI image generator (via nova)
- `docs/IMAGE-GUIDE.md` — Image recommendations and Flux prompt templates
- `data/videos/ai-agents.json` — Full example with images + diagram + all scene types
- `data/videos/vector-memory.json` — Full example with images + diagram

### Scene Types (9 total)
| Scene | Trigger Field | Description |
|-------|--------------|-------------|
| StatsScene | `section.stats` | Animated number counters (2-4 stat cards) |
| QuoteScene | `section.quote` | Word-by-word quote reveal with attribution |
| TimelineScene | `section.timeline` | Horizontal timeline with staggered events |
| DiagramScene | `section.diagram` | Flow chart with SVG icons + arrows |
| ComparisonScene | `section.comparison` | Side-by-side with VS divider |
| CodeScene | `section.codeSnippet` (no image) | Syntax-highlighted code |
| ContentScene | (default) | Text/bullets/images |
| IntroScene | (automatic) | Title + subtitle + logo |
| OutroScene | (automatic) | Closing card |

### Scene Routing Logic (priority order)
```
section.stats       → StatsScene       (animated number counters)
section.quote       → QuoteScene       (featured quote with word reveal)
section.timeline    → TimelineScene    (chronological events)
section.diagram     → DiagramScene     (flow chart with SVG icons + arrows)
section.comparison  → ComparisonScene  (side-by-side with VS divider)
section.codeSnippet && !section.image → CodeScene (syntax-highlighted code)
else                → ContentScene     (text/bullets/images)
```

### Available Diagram Icons (20)
`brain`, `database`, `search`, `cube`, `robot`, `code`, `cloud`, `api`, `lock`, `lightning`, `server`, `terminal`, `git`, `docker`, `kubernetes`, `aws`, `globe`, `chart`, `shield`, `rocket`

### Light Leaks
- Controlled by `lightLeaks: boolean` (default `true`) in the schema
- Animated translucent color wash overlays placed every 3 transitions
- Uses `simplex-noise` + `alea` for organic movement

### Preview & Render
```bash
npm run start                          # Remotion Studio preview
npx remotion render src/index.tsx Fireship out/video.mp4 --props="data/videos/topic.json"
```

## Coding Rules

### Remotion-Specific
- Use `useCurrentFrame()` + `useVideoConfig()` for all animation — NEVER use CSS transitions/animations
- Use `spring()` from remotion for entrance animations — negative frame values are safe for delays
- Use `<Img>` from remotion (not raw `<img>`) — it has built-in `delayRender`
- Use `staticFile()` for assets in `public/`
- Use `interpolate()` with `extrapolateRight: "clamp"` for bounded animations
- Fonts: loaded via `@remotion/google-fonts` at module level in `styles/fonts.ts`
- Particles/randomness: use `alea` package for deterministic seeded random — never `Math.random()`

### TypeScript
- Strict mode: `noUnusedLocals`, `noUnusedParameters`, `strictNullChecks` all enabled
- No non-null assertions (`!`) — use proper narrowing or guard clauses
- Use `type` (not `interface`) for props passed to `TransitionPresentation<T>` (Record<string, unknown> compat)
- Pre-existing error in `server.tsx:72` — ignore it, not our code

### Architecture
- Shared timing constants live in `schema.ts` (`TIMING` object + `getSectionStartFrames()`)
- All colors/fonts are derived from props via `buildColors()` / `buildFontBold()` etc. in `styles/theme.ts`
- Components are self-contained — each receives typed props, no global state
- New scene types go in `scenes/`, new reusable elements in `components/`
- All scenes have layered animated backgrounds: GridBackground + ParticleBackground + GlowOrb (keep intensities LOW: grid 0.03, particles 0.15-0.2, glow 0.04-0.05)
- Images in `public/` referenced by filename in JSON `image` field — displayed large (maxHeight 750) with glow shadow
- Diagram sections use `diagram.nodes[]` with `icon` mapping to TechIcons ICON_MAP keys
- `@remotion/lottie` + `lottie-web` installed for Lottie animations via LottieHero component

## Verification
```bash
npx tsc --noEmit                       # Must pass (only server.tsx:72 error is pre-existing)
npm run start                          # Verify in Remotion Studio
```
