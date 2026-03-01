import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { SceneHook } from "./scenes/SceneHook";
import { SceneFour } from "./scenes/SceneFour";
import { SceneHero } from "./scenes/SceneHero";
import { SceneReveal } from "./scenes/SceneReveal";
import { SceneCTA } from "./scenes/SceneCTA";

const TRANSITION_FRAMES = 15;

// Scene durations (total = 960, minus 4 transitions × 15 = 60, net = 900)
const SCENE_DURATIONS = {
  hook: 185,
  four: 155,
  hero: 250,
  reveal: 185,
  cta: 185,
};

export const AppIntro = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.hook}
        >
          <SceneHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.four}
        >
          <SceneFour />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.hero}
        >
          <SceneHero />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.reveal}
        >
          <SceneReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.cta}
        >
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
