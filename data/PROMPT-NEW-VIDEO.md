# Prompt: Create a New Fireship-Style Video

Copy everything below the line and paste it into a new Claude Code session.

---

I have a Remotion project at `~/remotion-fireship` with a Fireship-style video template. Read `FIRESHIP-TEMPLATE.md` for the full architecture and JSON schema.

Create a new video about **[YOUR TOPIC HERE]** in the "X in 100 Seconds" style.

1. Create a JSON props file at `data/videos/[topic-slug].json` following the schema in `src/templates/fireship/schema.ts`
2. Include:
   - A catchy title and subtitle
   - 3-5 sections covering the key concepts
   - At least one section with a `codeSnippet` (real, useful code)
   - At least one section with a `comparison` (before/after, old/new, etc.)
   - Varied transitions between sections (`slide`, `fade`, `glitch`, `wipe`)
   - A `style.primaryColor` matching the topic's brand color
   - Section durations: 4-7 seconds each, totaling roughly 100 seconds of content
3. Verify it renders: `npx remotion render src/index.tsx Fireship out/[topic-slug].mp4 --props="data/videos/[topic-slug].json"`
4. Preview it: `npm run start` and navigate to Templates > Fireship

Example topics: React, Kubernetes, Rust, GraphQL, WebSockets, SQLite, Tailwind CSS, Bun, Deno, HTMX
