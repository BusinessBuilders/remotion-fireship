/**
 * Flux AI Image Generator
 *
 * Calls the Flux API on nova (Jetson Orin via Tailscale) to generate images.
 * Uses the model-manager to auto-load the flux model, then generates via port 8096.
 * Files are SCP'd from nova to local public/generated/.
 *
 * Usage:
 *   npx ts-node scripts/flux-images.ts --descriptions "a robot thinking,a cloud network" --slug "ai-agents"
 *   npx ts-node scripts/flux-images.ts --descriptions "cyberpunk cityscape" --slug "test" --steps 20 --width 1200 --height 800
 */

import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { execFileSync } from "child_process";

const NOVA_TAILSCALE_IP = "100.105.14.117";
const MODEL_MANAGER_PORT = 8095;
const FLUX_PORT = 8096;
const NOVA_ASSET_PATH = "/mnt/ssd/models/nova_vault/assets";

interface FluxResponse {
  ok: boolean;
  model: string;
  file: string;
  filename: string;
  seed: number;
  elapsed_seconds: number;
}

function httpPost(
  host: string,
  port: number,
  urlPath: string,
  body: object,
  timeoutMs = 300000,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request(
      {
        hostname: host,
        port,
        path: urlPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
        timeout: timeoutMs,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const responseBody = Buffer.concat(chunks).toString();
          if (res.statusCode === 200) {
            resolve(responseBody);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseBody}`));
          }
        });
      },
    );
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    });
    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function ensureFluxLoaded(): Promise<void> {
  console.log("Ensuring flux model is loaded via model-manager...");
  try {
    await httpPost(NOVA_TAILSCALE_IP, MODEL_MANAGER_PORT, "/load", {
      model: "flux",
    });
    console.log("  Flux model ready.");
  } catch (err) {
    console.warn(
      `  Model manager not available (${(err as Error).message}).`,
    );
    console.warn("  Trying flux endpoint directly...");
  }
}

async function generateImage(
  prompt: string,
  steps: number,
  width: number,
  height: number,
): Promise<FluxResponse> {
  const responseBody = await httpPost(
    NOVA_TAILSCALE_IP,
    FLUX_PORT,
    "/generate",
    { prompt, steps, width, height },
    600000, // 10 min timeout for first gen (model load)
  );
  const parsed = JSON.parse(responseBody) as FluxResponse;
  if (!parsed.ok) {
    throw new Error(`Flux generation failed: ${responseBody}`);
  }
  return parsed;
}

function scpFromNova(remoteFilename: string, localPath: string): void {
  const remotePath = `${NOVA_ASSET_PATH}/${remoteFilename}`;
  execFileSync("scp", [`nova:${remotePath}`, localPath], {
    stdio: "pipe",
  });
}

async function main() {
  const args = process.argv.slice(2);
  let descriptions: string[] = [];
  let slug = "output";
  let steps = 28;
  let width = 1200;
  let height = 800;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--descriptions" && next) {
      descriptions = next.split(",").map((d) => d.trim());
      i++;
    } else if (arg === "--slug" && next) {
      slug = next;
      i++;
    } else if (arg === "--steps" && next) {
      steps = parseInt(next, 10);
      i++;
    } else if (arg === "--width" && next) {
      width = parseInt(next, 10);
      i++;
    } else if (arg === "--height" && next) {
      height = parseInt(next, 10);
      i++;
    }
  }

  if (descriptions.length === 0) {
    console.error(
      'Usage: npx ts-node scripts/flux-images.ts --descriptions "prompt1,prompt2" --slug "topic" [--steps 15] [--width 1200] [--height 800]',
    );
    process.exit(1);
  }

  const outDir = path.join(__dirname, "..", "public", "generated");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Load the flux model
  await ensureFluxLoaded();

  const filenames: string[] = [];

  for (let i = 0; i < descriptions.length; i++) {
    const prompt = descriptions[i];
    const localFilename = `${slug}-${i}.png`;
    const localPath = path.join(outDir, localFilename);

    console.log(
      `\n[${i + 1}/${descriptions.length}] Generating: "${prompt}"`,
    );
    console.log(`  ${width}x${height}, ${steps} steps`);

    try {
      const result = await generateImage(prompt, steps, width, height);
      console.log(
        `  Generated in ${result.elapsed_seconds.toFixed(1)}s (seed: ${result.seed})`,
      );

      // SCP the file from nova to local
      console.log(`  Copying from nova: ${result.filename}`);
      scpFromNova(result.filename, localPath);
      console.log(`  Saved: public/generated/${localFilename}`);
      filenames.push(`generated/${localFilename}`);
    } catch (err) {
      console.error(`  Error: ${(err as Error).message}`);
      console.error("  Skipping this image...");
    }
  }

  console.log("\n--- Results ---");
  if (filenames.length > 0) {
    console.log("Generated files (use in video JSON 'image' field):");
    filenames.forEach((f) => console.log(`  "${f}"`));
  } else {
    console.log("No images were generated.");
  }
}

main().catch(console.error);
