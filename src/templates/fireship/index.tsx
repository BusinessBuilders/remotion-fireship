import type { CalculateMetadataFunction } from "remotion";
import { Fireship } from "./Fireship";
import { fireshipSchema, TIMING } from "./schema";
import type { FireshipProps } from "./schema";

const calculateDuration = (props: FireshipProps) => {
  const { FPS, INTRO_SECONDS, OUTRO_SECONDS, TRANSITION_FRAMES } = TIMING;
  const sectionFrames = props.sections.reduce(
    (sum, s) => sum + (s.duration ?? 5) * FPS,
    0,
  );
  const numTransitions = props.sections.length + 1;
  return Math.max(
    (INTRO_SECONDS + OUTRO_SECONDS) * FPS +
      sectionFrames -
      numTransitions * TRANSITION_FRAMES,
    FPS,
  );
};

export const calculateFireshipMetadata: CalculateMetadataFunction<
  FireshipProps
> = ({ props }) => ({
  durationInFrames: calculateDuration(props),
  fps: TIMING.FPS,
  width: 1920,
  height: 1080,
});

export const calculateFireshipTikTokMetadata: CalculateMetadataFunction<
  FireshipProps
> = ({ props }) => ({
  durationInFrames: calculateDuration(props),
  fps: TIMING.FPS,
  width: 1080,
  height: 1920,
});

export { Fireship, fireshipSchema };
export type { FireshipProps };
