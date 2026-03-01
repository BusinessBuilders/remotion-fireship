import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ComparisonProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { GradientText } from "../components/GradientText";
import { AnimatedCode } from "../components/AnimatedCode";

interface ComparisonSceneProps {
  heading: string;
  comparison: ComparisonProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
}

const ComparisonPanel: React.FC<{
  label: string;
  code?: string;
  points?: string[];
  side: "left" | "right";
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
  frame: number;
  fps: number;
}> = ({ label, code, points, side, colors, fontBold, fontRegular, frame, fps }) => {
  const panelSpring = spring({
    fps,
    frame: frame - (side === "left" ? 20 : 40),
    config: { damping: 200 },
  });
  const panelX = interpolate(
    panelSpring,
    [0, 1],
    [side === "left" ? -100 : 100, 0],
  );

  const labelColor = side === "left" ? colors.accent : colors.primary;

  return (
    <div
      style={{
        flex: 1,
        opacity: panelSpring,
        transform: `translateX(${panelX}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          ...fontBold,
          fontSize: 32,
          color: labelColor,
        }}
      >
        {label}
      </div>

      {code && (
        <div style={{ width: "100%" }}>
          <AnimatedCode code={code} fontSize={20} staggerFrames={4} />
        </div>
      )}

      {points && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
          }}
        >
          {points.map((point, i) => {
            const itemSpring = spring({
              fps,
              frame: frame - 30 - i * 8,
              config: { damping: 200 },
            });
            return (
              <div
                key={i}
                style={{
                  ...fontRegular,
                  fontSize: 24,
                  color: colors.text,
                  opacity: itemSpring,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: labelColor, flexShrink: 0 }}>▸</span>
                {point}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ComparisonScene: React.FC<ComparisonSceneProps> = ({
  heading,
  comparison,
  colors,
  fontBold,
  fontRegular,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ fps, frame, config: { damping: 200 } });
  const headerY = interpolate(headerSpring, [0, 1], [-60, 0]);

  const vsSpring = spring({
    fps,
    frame: frame - 30,
    config: { damping: 100, mass: 2 },
  });
  const vsScale = interpolate(vsSpring, [0, 1], [3, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <div
        style={{
          ...fontBold,
          fontSize: 56,
          color: colors.text,
          textAlign: "center",
          marginTop: 60,
          opacity: headerSpring,
          transform: `translateY(${headerY}px)`,
        }}
      >
        {heading}
      </div>

      {/* Side by side */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 60,
          padding: "40px 80px",
          marginTop: 20,
          height: "75%",
        }}
      >
        <ComparisonPanel
          label={comparison.left.label}
          code={comparison.left.code}
          points={comparison.left.points}
          side="left"
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
          frame={frame}
          fps={fps}
        />

        {/* VS divider */}
        <div
          style={{
            ...fontBold,
            fontSize: 64,
            opacity: vsSpring,
            transform: `scale(${vsScale})`,
            alignSelf: "center",
            flexShrink: 0,
          }}
        >
          <GradientText colors={[colors.primary, colors.accent]}>
            VS
          </GradientText>
        </div>

        <ComparisonPanel
          label={comparison.right.label}
          code={comparison.right.code}
          points={comparison.right.points}
          side="right"
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
          frame={frame}
          fps={fps}
        />
      </div>
    </AbsoluteFill>
  );
};
