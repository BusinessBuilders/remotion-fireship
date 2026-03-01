import { AbsoluteFill, Series } from "remotion";

import { SceneIntro } from "./scenes/SceneIntro";
import { SceneCodeVsAI } from "./scenes/SceneCodeVsAI";
import { SceneAgentFlow } from "./scenes/SceneAgentFlow";
import { SceneStats } from "./scenes/SceneStats";
import { SceneOutro } from "./scenes/SceneOutro";

export const AIVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f0f" }}>
      <Series>
        <Series.Sequence durationInFrames={150}>
          <SceneIntro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <SceneCodeVsAI />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <SceneAgentFlow />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <SceneStats />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <SceneOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
