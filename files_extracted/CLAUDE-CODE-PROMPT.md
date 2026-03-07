# CLAUDE CODE PROMPT — Remotion Fireship Template Audit & Improvement

Paste this into Claude Code when you're in your ~/remotion project directory.

---

## PROMPT (copy everything below this line):

I need you to audit and improve my Remotion fireship video template. Here's what I need you to do:

### Phase 1: Full Audit (do this FIRST before ANY changes)

1. Run `find ~/remotion -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" \) | head -100` to map the project
2. Find and READ every file in the fireship template — check `templates/`, `src/templates/`, or wherever it lives
3. Find and READ the Root.tsx or index.ts where compositions are registered
4. List ALL assets in `public/` — fonts, images, audio, everything
5. Read the package.json to see what Remotion packages and versions are installed
6. Check if there's a Zod schema or inputProps definition

After reading everything, give me a report:
- What files exist and what each one does
- What's MISSING compared to a production-quality fireship-style template
- What assets we need to add (fonts, images, audio, logos)
- What the current input schema looks like vs what it should look like
- Rate the current template 1-10 on: animations, data flexibility, visual quality, code quality

### Phase 2: Decide — Modify or Rebuild

Based on the audit, recommend one of:
A) **Modify existing** — if the foundation is solid (good component structure, proper use of Remotion APIs, just needs more features)
B) **Rebuild from scratch** — if the architecture is wrong (hardcoded content, no props schema, no scene separation, bad animation patterns)

Tell me which you recommend and why BEFORE making changes.

### Phase 3: Implement Improvements

Whether modifying or rebuilding, the template MUST have:

1. **Rich Zod schema** (schema.ts) — accepting title, sections array (each with heading, body, code, images), style config, audio paths
2. **Scene components** — separate IntroScene, ContentScene, CodeScene, OutroScene files
3. **Reusable components** — AnimatedCode (syntax highlighted, line-by-line reveal), SectionTitle (with accent bar animation), BrowserFrame (screenshot mockup), ProgressBar, TechLogo
4. **Spring animations** — every element should animate in, not just appear
5. **Transitions** — smooth transitions between scenes (slide, zoom, or glitch)
6. **Dynamic styling** — colors/fonts driven by props, not hardcoded
7. **Asset loading** — proper use of staticFile() for fonts, images, audio
8. **Sample data JSON** — a complete example input that exercises every feature

### Phase 4: Asset Checklist

Tell me exactly what files I need to add to `public/` and where:
- Which fonts to download and where to put them
- What background textures/patterns would help
- What sound effects to add
- How to organize per-video screenshots

### Key Rules:
- Use `useSpring()` and `interpolate()` from remotion for ALL animations
- Use `<Sequence>` for scene timing
- Use `staticFile()` for all asset references
- Use deterministic randomness (seeded) for any particle/generative effects
- Code font must be monospace (JetBrains Mono or similar)
- Target 1920x1080 at 30fps
- Keep components small and composable
- TypeScript strict mode

Start with Phase 1 NOW — read everything first, report back, then we'll decide next steps.
