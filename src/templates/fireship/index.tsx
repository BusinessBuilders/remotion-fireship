import type { CalculateMetadataFunction } from "remotion";
import { Fireship } from "./Fireship";
import { fireshipSchema, TIMING } from "./schema";
import type { FireshipProps } from "./schema";

export const calculateFireshipMetadata: CalculateMetadataFunction<
  FireshipProps
> = ({ props }) => {
  const { FPS, INTRO_SECONDS, OUTRO_SECONDS, TRANSITION_FRAMES } = TIMING;

  const sectionFrames = props.sections.reduce(
    (sum, s) => sum + (s.duration ?? 5) * FPS,
    0,
  );

  const numTransitions = props.sections.length + 1;
  const totalFrames =
    (INTRO_SECONDS + OUTRO_SECONDS) * FPS +
    sectionFrames -
    numTransitions * TRANSITION_FRAMES;

  return {
    durationInFrames: Math.max(totalFrames, FPS),
    fps: FPS,
    width: 1920,
    height: 1080,
  };
};

export { Fireship, fireshipSchema };
export type { FireshipProps };
