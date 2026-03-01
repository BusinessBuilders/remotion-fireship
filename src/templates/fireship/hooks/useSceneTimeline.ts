import { useCurrentFrame, useVideoConfig } from "remotion";
import type { SectionProps } from "../schema";

interface SceneTimeline {
  activeScene: number;
  sceneFrame: number;
  sceneProgress: number;
  totalProgress: number;
  sectionStartFrames: number[];
}

export const useSceneTimeline = (
  sections: SectionProps[],
  introSeconds: number,
  outroSeconds: number,
): SceneTimeline => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const introFrames = introSeconds * fps;
  const outroFrames = outroSeconds * fps;

  // Build start frames for each section (including intro and outro)
  const sectionStartFrames: number[] = [0]; // intro starts at 0
  let accumulated = introFrames;
  for (const section of sections) {
    sectionStartFrames.push(accumulated);
    accumulated += (section.duration ?? 5) * fps;
  }
  sectionStartFrames.push(accumulated); // outro start

  // Determine active scene: 0 = intro, 1..N = sections, N+1 = outro
  const totalScenes = sections.length + 2;
  let activeScene = 0;
  let sceneStart = 0;
  let sceneDuration = introFrames;

  for (let i = 0; i < totalScenes; i++) {
    const start = sectionStartFrames[i] ?? 0;
    let dur: number;
    if (i === 0) {
      dur = introFrames;
    } else if (i === totalScenes - 1) {
      dur = outroFrames;
    } else {
      dur = ((sections[i - 1]?.duration) ?? 5) * fps;
    }

    if (frame >= start && frame < start + dur) {
      activeScene = i;
      sceneStart = start;
      sceneDuration = dur;
      break;
    }

    // If past all scenes, clamp to last
    if (i === totalScenes - 1) {
      activeScene = i;
      sceneStart = start;
      sceneDuration = dur;
    }
  }

  const sceneFrame = frame - sceneStart;
  const sceneProgress =
    sceneDuration > 0 ? Math.min(1, sceneFrame / sceneDuration) : 0;
  const totalProgress =
    durationInFrames > 0 ? Math.min(1, frame / durationInFrames) : 0;

  return {
    activeScene,
    sceneFrame,
    sceneProgress,
    totalProgress,
    sectionStartFrames,
  };
};
