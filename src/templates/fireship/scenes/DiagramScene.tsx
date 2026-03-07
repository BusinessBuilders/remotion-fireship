import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { DiagramProps, SectionProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { SectionTitle } from "../components/SectionTitle";
import { FlowDiagram } from "../components/FlowDiagram";
import { GridBackground } from "../components/GridBackground";
import { ConstellationBg } from "../components/ConstellationBg";
import { GlowOrb } from "../components/GlowOrb";

interface DiagramSceneProps {
  section: SectionProps;
  diagram: DiagramProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
}

export const DiagramScene: React.FC<DiagramSceneProps> = ({
  section,
  diagram,
  colors,
  fontBold,
  fontRegular,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  const bodySpring = spring({
    fps,
    frame: frame - 40,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Layered backgrounds */}
      <GridBackground color={colors.primary} opacity={0.03} animated />
      <ConstellationBg
        color={colors.accent}
        nodeCount={25}
        seed={`diagram-${section.heading}`}
        opacity={0.06}
      />
      <GlowOrb
        colors={[colors.primary, colors.accent]}
        count={2}
        seed={`glow-${section.heading}`}
        intensity={0.05}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: isPortrait ? "40px 40px" : "60px 100px",
          gap: 30,
        }}
      >
        <SectionTitle
          title={section.heading}
          accentColor={colors.primary}
          textColor={colors.text}
          fontStyle={fontBold}
          monoStyle={fontMono}
        />

        {/* Flow Diagram — centered */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FlowDiagram
            nodes={diagram.nodes}
            colors={colors}
            fontBold={fontBold}
          />
        </div>

        {/* Optional body text */}
        {section.body && (
          <div
            style={{
              ...fontRegular,
              fontSize: 26,
              color: colors.muted,
              textAlign: "center",
              opacity: bodySpring,
              lineHeight: 1.5,
            }}
          >
            {section.body}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
