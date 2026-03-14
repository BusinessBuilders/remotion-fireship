# Five Simple Hacks to Build Websites With AI Research

## Reference extraction from `data/videos/current.md`

Primary beats from the transcript:

1. AI-built websites often look generic because the workflow is generic.
2. Start in a real project environment, not a blank chatbot tab.
3. Persistent project instructions matter more than clever one-off prompting.
4. Design-specific guidance dramatically improves the result.
5. Brand assets and explicit references beat vague adjectives.
6. The best output comes from constrained iteration, not one giant prompt.

This should remain the dominant narrative spine even after broadening the title from a Claude Code tutorial into a more general AI website workflow video.

## Supplemental source-backed facts

### Tooling and workflow

- Anthropic’s Claude Code docs say `CLAUDE.md` is read at the start of every session and is meant for coding standards, architecture decisions, preferred libraries, and review checklists.
  Source: https://code.claude.com/docs/en/overview

- The same docs position Claude Code as handling planning, writing code across multiple files, verification, git actions, and MCP-connected context, which supports the “good outputs come from context + workflow” framing.
  Source: https://code.claude.com/docs/en/overview

- Anthropic pricing/help docs show Claude Code is included on individual paid plans like Pro and Max, while the Team plan article says Team does not include Claude Code.
  Sources:
  - https://claude.com/pricing
  - https://support.anthropic.com/en/articles/9266767-what-is-the-team-plan

- Vercel describes v0 as an AI builder that can take a single prompt to a deployed app and, by August 11, 2025, positioned it as “agentic,” helping research, reason, debug, and plan.
  Source: https://vercel.com/blog/v0-app

- Vercel’s February 3, 2026 v0 update says more than 4 million people have used v0 since GA in 2024, and explicitly frames the market shift from novelty vibe coding to production software.
  Source: https://vercel.com/blog/introducing-the-new-v0

- Lovable’s quick-start docs reinforce a similar pattern: start with a prompt, then refine iteratively. Their docs explicitly say the more specific the prompt, the better the results.
  Source: https://docs.lovable.dev/introduction/getting-started

### Productivity and quality framing

- GitHub’s November 18, 2024 randomized controlled trial says developers with GitHub Copilot access had a 53.2% greater likelihood of passing all 10 unit tests in the study.
  Source: https://github.blog/news-insights/research/does-github-copilot-improve-code-quality-heres-what-the-data-says/

- The same GitHub research summary says code written with Copilot improved readability, reliability, maintainability, and conciseness, and that developers were 5% more likely to approve it.
  Source: https://github.blog/news-insights/research/does-github-copilot-improve-code-quality-heres-what-the-data-says/

- GitHub continues to cite prior research that AI coding tools can help developers complete tasks up to 55% faster.
  Sources:
  - https://github.blog/2023-06-27-the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/
  - https://github.blog/developer-skills/career-growth/why-developer-expertise-matters-more-than-ever-in-the-age-of-ai/

- GitHub also quotes open source developer Claudio Wunder saying he spends less time on trial-and-error and more time ensuring code is secure and performant. That supports a quote scene about shifting effort from typing to system design and review.
  Source: https://github.blog/ai-and-ml/generative-ai/how-developers-spend-the-time-they-save-thanks-to-ai-coding-tools/

## Five hacks to anchor the story

### Hack 1: Start with a project brief, not a naked prompt

The transcript’s `claude.md` lesson generalizes into a broader rule: give the AI persistent instructions about stack, audience, quality bar, and constraints before asking for UI.

### Hack 2: Force design taste into the loop

The transcript’s design-skill example becomes: use a design system, design skill, reference library, or explicit aesthetic spec so the model is not inventing taste from scratch.

### Hack 3: Feed brand assets and references, not adjectives

The transcript shows logo + brand guidelines. Generalized version: pass logos, palettes, screenshots, copy docs, or existing pages so the site can inherit identity rather than imitate “modern SaaS” sludge.

### Hack 4: Build the page in passes

Instead of “make me a website,” ask for:
- structure first
- then visual direction
- then copy/layout polish
- then responsiveness
- then QA/fixes

This keeps the AI from collapsing everything into one bland first draft.

### Hack 5: Review like a human creative director

The transcript implies revisiting the instruction file and iterating. Generalize that into a production loop: compare output against brand, cut weak sections, fix spacing, and tighten copy before shipping.

## Recommended section map

### Chapter 1: The Problem

1. Content scene: most AI websites look AI-made
2. Stats scene: AI coding speed/quality context
3. Diagram scene: the workflow behind good outputs

### Chapter 2: Better Inputs

4. Content scene: Hack 1 overview
5. Code scene: example project brief / instruction file
6. Content scene: Hack 2 overview
7. Quote scene: less trial-and-error, more system design

### Chapter 3: Better Context

8. Content scene: Hack 3 overview with brand assets
9. Diagram scene: assets -> instructions -> prompts -> output
10. Content scene: Hack 4 overview
11. Code scene: multi-pass prompt sequence

### Chapter 4: Better Output

12. Comparison scene: one-shot generic site vs branded iterative workflow
13. Content scene: Hack 5 overview
14. Timeline scene: pass 1 through pass 4 refinement loop
15. Content scene: broad tool landscape without locking to one product
16. Content scene: five-hack recap and final takeaway

## Image directions

Use 4-5 Flux images with one distinct visual per chapter:

1. AI-generated website graveyard versus one polished branded page
2. Developer workspace with instruction file, design references, and landing page mockup
3. Brand assets board with logo, color palette, typography, and AI interface
4. Iterative website building sequence with browser previews and prompt passes
5. Clean final launch scene with polished landing page on desktop display

## Notes for authoring

- Keep the script broad enough to cover Claude Code, v0, Lovable, Bolt-style builders, and similar AI workflows.
- Do not claim every tool supports the exact same features.
- Use the transcript heavily in tone and flow, but avoid making the title feel misleadingly tool-specific.
- Prefer practical claims that can be shown on-screen over abstract AI hype.
