# Image Guide

## Recommended Dimensions

- **Standard**: 1200x800 (3:2 aspect) or 1920x1080 (16:9)
- **Portrait elements**: 800x1200
- Images are displayed with `maxHeight: 750, maxWidth: 1400, objectFit: contain`

## When to Use Each Scene Type

| Need | Scene Type | Notes |
|------|-----------|-------|
| Flow/architecture diagram | `diagram` | Uses SVG icons + animated arrows, no images needed |
| Side-by-side comparison | `comparison` | Code or bullet points, no images needed |
| Featured statistic | `stats` | Animated number counters, 2-4 items |
| Notable quote | `quote` | Word-by-word reveal with attribution |
| Historical progression | `timeline` | Horizontal timeline with staggered events |
| Screenshot/photo | `image` | External image with glow frame |
| Code walkthrough | `codeSnippet` | Syntax highlighted, line-by-line reveal |
| General content | (default) | Text + optional bullets/images |

## Generating Images with Flux

The project includes a Flux image generator that calls the local GPU server on `nova` via Tailscale.

### Quick Start

```bash
npx ts-node scripts/flux-images.ts \
  --descriptions "a futuristic AI neural network,a cloud computing diagram" \
  --slug "my-topic"
```

### Prompt Templates for Tech Diagrams

- `"Clean minimal tech diagram showing [concept], dark background, neon accents, vector style"`
- `"Abstract 3D render of [concept], dark moody lighting, blue and orange glow"`
- `"Isometric illustration of [architecture], dark theme, glowing connections"`

### Prompt Tips

- Always specify "dark background" to match the video theme
- Use "neon accents" or "glowing" for consistency with the Fireship aesthetic
- Avoid text in generated images (Flux text rendering is unreliable)
- Specify "clean", "minimal", or "vector" for diagram-style outputs

## Curated Free Image Sources (Fallback)

- [Unsplash](https://unsplash.com) - High quality photography
- [Pexels](https://pexels.com) - Free stock photos
- [unDraw](https://undraw.co) - Open-source SVG illustrations
- [Heroicons](https://heroicons.com) - SVG icons

## Directory Structure

```
public/
  generated/       # Flux AI-generated images (gitignored)
  music/           # Background music (future)
  lottie/          # Lottie animations
  images/          # Curated/user-provided images
```

## Available Diagram Icons

The following icons are available for `diagram.nodes[].icon`:

`brain`, `database`, `search`, `cube`, `robot`, `code`,
`cloud`, `api`, `lock`, `lightning`, `server`, `terminal`,
`git`, `docker`, `kubernetes`, `aws`, `globe`, `chart`,
`shield`, `rocket`
