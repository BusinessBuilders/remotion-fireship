Improve the visual quality of the Fireship video template. Work on the `feature/visual-improvements` branch.

**IMPORTANT:** Before writing any Remotion code, invoke `/remotion-best-practices` and use `mcp__remotion-documentation__remotion-documentation` to look up any Remotion APIs you use. Use `mcp__context7__resolve-library-id` + `mcp__context7__query-docs` for any dependency docs.

**CRITICAL SAFETY:** Commit after EACH numbered improvement below. If something breaks, we can `git revert` individual commits. Run `npx tsc --noEmit` after each change to verify compilation (ignore the pre-existing `server.tsx:72` error).

---

## Reference Screenshots (known issues)

These screenshots show the current problems — reference them for context:
- `/home/magiccat/Pictures/Screenshots/Screenshot from 2026-03-14 17-34-23.png` — ContentScene with image: image WAY too big, body text tiny at bottom getting cut off
- `/home/magiccat/Pictures/Screenshots/Screenshot from 2026-03-14 17-34-30.png` — ContentScene with bullets: text bunched in top third, massive empty space below
- `/home/magiccat/Pictures/Screenshots/Screenshot from 2026-03-14 17-34-41.png` — TimelineScene: functional but sparse, dead space above/below, needs more visual polish
- `/home/magiccat/Pictures/Screenshots/Screenshot from 2026-03-14 17-34-55.png` — DiagramScene: nodes work but body text at bottom clipped, needs more visual pop

---

## Improvement 1: SectionTitle — Add text glow and gradient effects

File: `src/templates/fireship/components/SectionTitle.tsx`

Current state: Plain 56px bold white text with a 4px accent bar. No visual effects.

Changes needed:
- Add a `textShadow` glow effect using the `primaryColor` (e.g., `0 0 40px {primary}40, 0 0 80px {primary}20`)
- Add a subtle gradient on the heading text using `backgroundClip: 'text'` and `WebkitBackgroundClip: 'text'` with `color: 'transparent'` — gradient from `textColor` to a slightly tinted version of the `accentColor`
- Make the accent bar wider (6px instead of 4px) and add box-shadow glow
- Increase accent bar height to match text height dynamically or use 70px
- Add a very subtle letter-spacing (1-2px) for more premium feel

**Commit after this change.**

---

## Improvement 2: ContentScene — Better image + text layout

File: `src/templates/fireship/scenes/ContentScene.tsx`

Current state: Image at `maxHeight: 750px` fills the frame, body text at 26px is tiny and gets clipped at the bottom.

Changes needed for the **image layout branch** (the `section.image` path):
- Reduce image size: `maxHeight: 450px` (landscape) / `350px` (portrait), `maxWidth: 900px` (landscape) / `700px` (portrait)
- Move to a **side-by-side layout** on desktop: image on the right (~55% width), text content on the left (~40% width) — use flexDirection row
- Body text font size: increase to 30px (landscape) / 24px (portrait)
- Body text color: use `colors.text` (white) not `colors.muted` (gray) for better readability
- Add a subtle `borderRadius: 16px` on the image
- Keep the glow box-shadow but reduce the spread (80px instead of 120px)
- For the fallback (portrait/no-bullets) keep stacked layout but with smaller image

Changes needed for the **text-only with bullets** path:
- Increase bullet text font size from 26px to 30px (landscape) / 24px (portrait)
- Increase bullet dot size from 8x8 to 10x10
- Add more vertical gap between bullets: 20px instead of 16px
- Center the bullet content vertically in the frame (use `justifyContent: 'center'` on the container)
- Body text font size: increase from 32px to 36px (landscape)

**Commit after this change.**

---

## Improvement 3: TimelineScene — More visual polish

File: `src/templates/fireship/scenes/TimelineScene.tsx`

Current state: Functional horizontal timeline with 20x20 dots, 28px year text, 20px label text. Lots of dead space.

Changes needed:
- Center the timeline vertically in the frame (add `justifyContent: 'center'` on the main container, remove extra gap)
- Increase event card background opacity from 60% to 80%
- Add a subtle `boxShadow` glow on event cards: `0 0 20px {color}15`
- Increase year font size from 28px to 34px
- Increase label font size from 20px to 24px
- Make the timeline line thicker: 5px instead of 4px
- Add a pulsing glow animation on the timeline dots using `interpolate()` with a sine-like pattern (frame % period)
- Event dot size: increase from 20x20 to 24x24, with a thicker border
- Add a subtle gradient background to event cards

**Commit after this change.**

---

## Improvement 4: DiagramScene — Better spacing and body text

File: `src/templates/fireship/scenes/DiagramScene.tsx`

Current state: Body text at 26px at the very bottom, often clipped.

Changes needed:
- Increase body text font size from 26px to 30px
- Move body text positioning — add `maxWidth: '80%'` and give it more top margin (20px)
- Reduce gap between title and diagram from 30px to 20px to make room for body text
- Ensure the diagram + body text are vertically centered as a group
- Add subtle text-shadow on body text for readability: `0 2px 8px rgba(0,0,0,0.5)`

Also improve the FlowDiagram component (`src/templates/fireship/components/FlowDiagram.tsx`):
- Check that node cards have enough padding and glow
- Arrow color should be more vibrant — use full accent color at higher opacity
- Add a subtle scale animation on node hover/entrance (if not already present)

**Commit after this change.**

---

## Improvement 5: Better transitions in Fireship.tsx

File: `src/templates/fireship/Fireship.tsx`

Current state: Uses `@remotion/transitions` with basic presentations (fade, slide, wipe). The `glitch` and `zoom` options map to custom/basic implementations.

**IMPORTANT:** Before implementing, use the Remotion MCP to look up:
- `mcp__remotion-documentation__remotion-documentation` query: "transitions presentations custom"
- Check what presentations are available in `@remotion/transitions/presentations`

Changes needed:
- Increase `TRANSITION_FRAMES` from 15 to 20 in `schema.ts` for smoother transitions (but check this doesn't break existing videos — the constant is shared)
- OR: make transition duration configurable per-section in the schema (add optional `transitionDuration` field)
- Improve the `wipe` transition — add a slight blur or color flash during the wipe
- The `slide` transition could use easing — look up if `springTiming` is available for transitions instead of `linearTiming`
- Consider adding a `clock-wipe` or `circle-wipe` custom presentation for variety
- Light leaks during transitions should be slightly more visible — increase intensity from 0.3 to 0.4

**Commit after this change.**

---

## Improvement 6: Global font and spacing polish

File: `src/templates/fireship/styles/theme.ts`

Changes:
- Ensure `fontWeight: 900` is used for titles (already is, just verify)
- Add a utility function `buildTextGlow(color: string, intensity: number)` that returns a textShadow string — reusable across all scenes
- Add a utility function `buildCardGlow(color: string)` that returns a boxShadow string for glass cards

These utilities should be used by the scene improvements above for consistency.

**Commit after this change.**

---

## Verification

After all improvements:
1. `npx tsc --noEmit` — must pass (only server.tsx:72 pre-existing error)
2. `npm run start` — preview in Remotion Studio, check each scene type visually
3. Re-render a test video:
   ```bash
   npx remotion render src/index.tsx Fireship out/test-improved.mp4 --props="data/videos/ai-news-march-2026.json"
   ```
4. Compare old vs new side by side

## Rollback Strategy

Each improvement is its own commit on `feature/visual-improvements`. To undo any single change:
```bash
git revert <commit-hash>  # undo one specific improvement
```

To undo everything:
```bash
git checkout master  # go back to the working baseline
```

To merge when satisfied:
```bash
git checkout master && git merge feature/visual-improvements
```

---

## What NOT to change
- Do NOT modify the JSON schema structure (keep backward compat with existing videos)
- Do NOT change scene routing logic in Fireship.tsx
- Do NOT modify the TTS pipeline or generation scripts
- Do NOT touch the intro/outro scenes unless specifically asked
- Keep all background effect intensities LOW (grid ≤0.04, particles ≤0.2, glow ≤0.06)
