# Remotion Fireship Project

## Project Overview
Remotion v4.0.332 video generation project with a data-driven Fireship-style "X in 100 Seconds" template system. TypeScript strict mode enabled.

## Required Tools & Skills
- **Always** invoke the `/remotion-best-practices` skill before writing any Remotion code
- **Always** use the `mcp__remotion-documentation__remotion-documentation` MCP tool to look up Remotion APIs before implementing — do not guess at API signatures
- **Always** use `mcp__context7__resolve-library-id` + `mcp__context7__query-docs` for any dependency docs (zod, prism-react-renderer, etc.)

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
- `src/templates/fireship/Fireship.tsx` — Main orchestrator (TransitionSeries)
- `src/templates/fireship/index.tsx` — Composition registration + calculateMetadata
- `src/Root.tsx` — All compositions registered here
- `data/videos/docker-100s.json` — Example input

### Scene Routing Logic
```
section.comparison → ComparisonScene
section.codeSnippet && !section.image → CodeScene
else → ContentScene
```

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

## Verification
```bash
npx tsc --noEmit                       # Must pass (only server.tsx:72 error is pre-existing)
npm run start                          # Verify in Remotion Studio
```
