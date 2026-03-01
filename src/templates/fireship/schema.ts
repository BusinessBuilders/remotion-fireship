import { z } from "zod";
import { zColor } from "@remotion/zod-types";

const codeSnippetSchema = z.object({
  code: z.string(),
  language: z.string().default("typescript"),
  filename: z.string().optional(),
  highlightLines: z.array(z.number()).optional(),
});

const comparisonSideSchema = z.object({
  label: z.string(),
  code: z.string().optional(),
  points: z.array(z.string()).optional(),
});

const comparisonSchema = z.object({
  left: comparisonSideSchema,
  right: comparisonSideSchema,
});

const transitionEnum = z
  .enum(["slide", "fade", "wipe", "zoom", "glitch"])
  .default("fade");

const imageFrameEnum = z
  .enum(["none", "browser", "phone"])
  .default("none");

const sectionSchema = z.object({
  heading: z.string(),
  body: z.string().default(""),
  bulletPoints: z.array(z.string()).optional(),
  image: z.string().optional(),
  imageFrame: imageFrameEnum,
  codeSnippet: codeSnippetSchema.optional(),
  comparison: comparisonSchema.optional(),
  duration: z.number().min(1).default(5),
  transition: transitionEnum,
});

const styleSchema = z.object({
  backgroundColor: zColor().default("#0a0a0a"),
  primaryColor: zColor().default("#FF6B00"),
  accentColor: zColor().default("#00d4ff"),
  secondaryColor: zColor().default("#1a1a2e"),
  textColor: zColor().default("#ffffff"),
  mutedColor: zColor().default("#a0a0b0"),
  fontFamily: z.string().default("Inter"),
  codeFontFamily: z.string().default("JetBrains Mono"),
});

export const fireshipSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  topic: z.string(),
  topicLogo: z.string().optional(),
  sections: z.array(sectionSchema).min(1),
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.3),
  voiceoverAudio: z.string().optional(),
  style: styleSchema.default({}),
  watermark: z.string().optional(),
});

export type FireshipProps = z.infer<typeof fireshipSchema>;
export type SectionProps = z.infer<typeof sectionSchema>;
export type CodeSnippetProps = z.infer<typeof codeSnippetSchema>;
export type StyleProps = z.infer<typeof styleSchema>;
export type ComparisonProps = z.infer<typeof comparisonSchema>;

// Shared timing constants — single source of truth
export const TIMING = {
  INTRO_SECONDS: 4,
  OUTRO_SECONDS: 4,
  TRANSITION_FRAMES: 15,
  FPS: 30,
} as const;

export const getSectionStartFrames = (
  sections: SectionProps[],
  fps: number,
): number[] => {
  const introFrames = TIMING.INTRO_SECONDS * fps;
  const starts: number[] = [0];
  let accumulated = introFrames;
  for (const section of sections) {
    starts.push(accumulated);
    accumulated += (section.duration ?? 5) * fps;
  }
  starts.push(accumulated);
  return starts;
};
