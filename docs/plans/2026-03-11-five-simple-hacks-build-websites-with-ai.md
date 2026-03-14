# Five Simple Hacks to Build Websites With AI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a long-form standard-wide Fireship video package for "Five Simple Hacks to Build Websites With AI" using `data/videos/current.md` as the primary reference plus supplemental research, then generate assets needed for render.

**Architecture:** Start from the approved reference-led design, then gather supporting sources, map the transcript beats onto a 15-20 section builder-style arc, and author the Fireship JSON plus synced voiceover script. After the content is locked, verify rendering constraints, attempt Flux chapter images, and prepare the project for final render/audio generation.

**Tech Stack:** Remotion v4 Fireship template, TypeScript/Zod schema, local JSON/Markdown content files, Flux image generation script, synced TTS pipeline, shell verification commands

---

### Task 1: Research and reference extraction

**Files:**
- Read: `data/videos/current.md`
- Read: `src/templates/fireship/schema.ts`
- Create: `docs/plans/2026-03-11-five-simple-hacks-build-websites-with-ai-research.md`

**Step 1: Extract the reference transcript beats**

Create a concise outline from `data/videos/current.md` that captures:
- setup/tooling
- project instructions file
- design skill usage
- brand assets
- prompting and iterative output improvement

**Step 2: Run targeted research for missing or time-sensitive facts**

Use web research for:
- AI website builder landscape and current context
- current tool/access claims that appear in the reference
- quotes or framing stats for AI-assisted development/design
- any timeline or comparison claims needed for variety

**Step 3: Save structured research notes**

Write a short source-backed note file at `docs/plans/2026-03-11-five-simple-hacks-build-websites-with-ai-research.md` organized by:
- hook
- each hack
- supporting stats/quotes
- image ideas

**Step 4: Verify notes are sufficient**

Confirm the notes cover at least:
- 5 distinct hacks
- 1 comparison angle
- 1 quote or punchy framing line
- enough material for 15-20 sections

### Task 2: Story map and section design

**Files:**
- Modify: `docs/plans/2026-03-11-five-simple-hacks-build-websites-with-ai-research.md`
- Read: `data/videos/ai-agents.json`
- Read: `data/videos/google-notebooklm.json`

**Step 1: Map the approved arc**

Turn the transcript and research into a section-by-section outline with:
- chapter name
- scene type
- key onscreen message
- target duration
- transition choice

**Step 2: Keep the video broad but transcript-led**

Ensure each hack is phrased generically enough to match the title while staying faithful to the transcript's workflow principles.

**Step 3: Lock the section inventory**

Target:
- 15-20 sections
- 120-240 seconds total
- repeated but varied scene types
- no repeated transition twice in a row

### Task 3: Author the Fireship JSON

**Files:**
- Create: `data/videos/five-simple-hacks-build-websites-with-ai.json`
- Read: `src/templates/fireship/schema.ts`

**Step 1: Draft all sections**

Write each section with:
- `heading`
- `body`
- optional `bulletPoints`
- optional image/code/diagram/stats/quote/comparison/timeline payload
- `duration`
- `transition`

**Step 2: Keep scene routing intentional**

Use schema-compatible fields so the intended scenes render correctly:
- `stats` for metric cards
- `quote` for the framing quote
- `diagram` for workflow maps
- `comparison` for generic vs branded workflow
- `codeSnippet` only where code/prompt display is useful

**Step 3: Validate JSON**

Run a schema or TypeScript validation path already used by the project, or at minimum a render metadata check if available.

### Task 4: Write the long-form voiceover script

**Files:**
- Create: `data/videos/five-simple-hacks-build-websites-with-ai-voiceover.md`
- Read: `data/videos/claude-code-updates-voiceover.md`

**Step 1: Match sections exactly**

Create chapter and section headings matching the JSON order.

**Step 2: Keep narration synced to visuals**

Write punchy spoken text that fits each section's duration and references the displayed visuals naturally.

**Step 3: Check total flow**

Confirm the script has:
- clean chapter transitions
- explicit callouts of the five hacks
- a strong opening and closing

### Task 5: Prepare image generation prompts

**Files:**
- Modify: `docs/plans/2026-03-11-five-simple-hacks-build-websites-with-ai-research.md`
- Expected output path: `public/`

**Step 1: Define 4-5 image prompts**

Write one prompt per major chapter with:
- distinct concept
- no commas if the script requires that constraint
- intended slug suffix

**Step 2: Check generator feasibility**

Verify the expected local script and remote generation dependency are reachable before depending on generated images.

**Step 3: Fallback plan**

If Flux generation is blocked, note whether the video can ship with procedural scenes only or with existing local assets.

### Task 6: Generate supporting assets

**Files:**
- Create or update under: `public/voiceover/`
- Create or update under: `public/` for generated images

**Step 1: Run Flux image generation**

Generate chapter images one at a time with unique slugs.

**Step 2: Run synced TTS generation**

Use the section-synced TTS script with the final JSON and voiceover markdown.

**Step 3: Handle duration drift**

If the TTS pipeline updates JSON durations, re-check the JSON and render flow before final render.

### Task 7: Verify the package

**Files:**
- Read: `data/videos/five-simple-hacks-build-websites-with-ai.json`
- Read: `data/videos/five-simple-hacks-build-websites-with-ai-voiceover.md`

**Step 1: Type check**

Run: `npx tsc --noEmit`

Expected:
- pass, except for the known pre-existing `server.tsx:72` issue if it still exists

**Step 2: Render verification**

Run a preview render path for the new JSON with the existing Fireship composition.

**Step 3: Note remaining blockers**

Document whether any failures are due to:
- missing network access
- unavailable remote image host
- unavailable TTS environment
- unrelated pre-existing project issues
