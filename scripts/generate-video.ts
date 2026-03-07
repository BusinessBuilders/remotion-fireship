/**
 * Video Generation Pipeline
 *
 * Takes a topic name and generates a complete Fireship-style video.
 * Usage: npx ts-node scripts/generate-video.ts --topic "AI Agents"
 *
 * Steps:
 * 1. Generate video JSON content (manually or via LLM)
 * 2. Validate against Zod schema
 * 3. Optionally generate Flux images
 * 4. Render with Remotion
 */

import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";

// Use require for the schema since it's TS
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fireshipSchema } = require("../src/templates/fireship/schema");

function slugify(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getVideoTemplate(topic: string): object {
  const safeName = topic.replace(/\s+/g, "");
  return {
    title: topic,
    subtitle: `// ${topic.toLowerCase()} explained`,
    topic,
    lightLeaks: true,
    sections: [
      {
        heading: `What is ${topic}?`,
        body: `A brief introduction to ${topic} and why it matters.`,
        bulletPoints: [
          "Key concept 1",
          "Key concept 2",
          "Key concept 3",
        ],
        duration: 5,
        transition: "slide",
      },
      {
        heading: "How It Works",
        body: `The core mechanism behind ${topic}.`,
        diagram: {
          nodes: [
            { label: "Input", icon: "code" },
            { label: "Process", icon: "brain" },
            { label: "Output", icon: "rocket" },
          ],
        },
        duration: 6,
        transition: "wipe",
      },
      {
        heading: "By the Numbers",
        stats: {
          items: [
            { label: "Adoption Rate", value: 85, suffix: "%" },
            { label: "Performance Gain", value: 10, suffix: "x" },
            { label: "Community Size", value: 500, suffix: "K+" },
          ],
        },
        duration: 5,
        transition: "fade",
      },
      {
        heading: "Key Insight",
        quote: {
          text: `The future of ${topic} is not about replacing humans, but augmenting them.`,
          author: "Industry Expert",
          role: "Tech Lead",
        },
        duration: 5,
        transition: "glitch",
      },
      {
        heading: "Evolution",
        timeline: {
          events: [
            { year: "2020", label: "Early research" },
            { year: "2022", label: "First production use" },
            { year: "2024", label: "Mass adoption" },
            { year: "2025", label: "Industry standard" },
          ],
        },
        duration: 6,
        transition: "slide",
      },
      {
        heading: "Getting Started",
        body: `Here's how to start with ${topic} today.`,
        codeSnippet: {
          code: `// Quick start\nimport { ${safeName} } from 'library';\n\nconst result = await ${safeName}.run({\n  input: "Hello World",\n});`,
          language: "typescript",
          filename: "index.ts",
        },
        duration: 6,
        transition: "fade",
      },
    ],
    style: {
      backgroundColor: "#0a0a0a",
      primaryColor: "#FF6B00",
      accentColor: "#00d4ff",
      secondaryColor: "#1a1a2e",
      textColor: "#ffffff",
      mutedColor: "#a0a0b0",
      fontFamily: "Inter",
      codeFontFamily: "JetBrains Mono",
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  let topic = "";
  let renderVideo = false;
  let generateImages = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--topic" && args[i + 1]) {
      topic = args[i + 1];
      i++;
    } else if (args[i] === "--render") {
      renderVideo = true;
    } else if (args[i] === "--images") {
      generateImages = true;
    }
  }

  if (!topic) {
    console.error(
      'Usage: npx ts-node scripts/generate-video.ts --topic "AI Agents" [--render] [--images]',
    );
    process.exit(1);
  }

  const slug = slugify(topic);
  const dataDir = path.join(__dirname, "..", "data", "videos");
  const jsonPath = path.join(dataDir, `${slug}.json`);

  // 1. Generate template JSON
  console.log(`Generating video JSON for: "${topic}"`);
  const videoData = getVideoTemplate(topic);

  // 2. Validate against schema
  console.log("Validating against schema...");
  try {
    fireshipSchema.parse(videoData);
    console.log("Schema validation passed.");
  } catch (err) {
    console.error("Schema validation failed:", err);
    process.exit(1);
  }

  // 3. Write JSON
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(jsonPath, JSON.stringify(videoData, null, 2));
  console.log(`Written to: ${jsonPath}`);

  // 4. Optionally generate images via Flux
  if (generateImages) {
    console.log("\nGenerating images via Flux...");
    try {
      execFileSync(
        "npx",
        [
          "ts-node",
          "scripts/flux-images.ts",
          "--descriptions",
          `clean minimal tech diagram showing ${topic}, dark background, neon blue and orange accents, vector style,abstract 3D render of ${topic}, dark moody lighting, blue and orange glow`,
          "--slug",
          slug,
          "--width",
          "1200",
          "--height",
          "800",
          "--steps",
          "15",
        ],
        { stdio: "inherit", cwd: path.join(__dirname, "..") },
      );
    } catch {
      console.warn("Image generation failed — continuing without images.");
    }
  }

  // 5. Optionally render
  if (renderVideo) {
    const outDir = path.join(__dirname, "..", "out");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, `${slug}.mp4`);
    console.log(`\nRendering video to: ${outPath}`);
    try {
      execFileSync(
        "npx",
        [
          "remotion",
          "render",
          "src/index.tsx",
          "Fireship",
          outPath,
          `--props=${jsonPath}`,
        ],
        { stdio: "inherit", cwd: path.join(__dirname, "..") },
      );
      console.log(`\nVideo rendered: ${outPath}`);
    } catch {
      console.error("Render failed.");
      process.exit(1);
    }
  }

  console.log("\nDone! Next steps:");
  console.log(`  1. Edit: ${jsonPath}`);
  console.log(`  2. Preview: npm run start`);
  console.log(
    `  3. Render: npx remotion render src/index.tsx Fireship out/${slug}.mp4 --props="data/videos/${slug}.json"`,
  );
}

main().catch(console.error);
