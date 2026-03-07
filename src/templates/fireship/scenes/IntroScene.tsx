import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ColorMap } from "../styles/theme";
import { GridBackground } from "../components/GridBackground";
import { ParticleBackground } from "../components/ParticleBackground";
import { GradientText } from "../components/GradientText";
import { TechLogo } from "../components/TechLogo";

interface IntroSceneProps {
  title: string;
  subtitle?: string;
  topicLogo?: string;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontMono: CSSProperties;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  subtitle,
  topicLogo,
  colors,
  fontBold,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  const logoSpring = spring({ fps, frame, config: { damping: 200 } });
  const titleSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 200 },
  });
  const subtitleSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 200 },
  });
  const lineSpring = spring({
    fps,
    frame: frame - 25,
    config: { damping: 200 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [80, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [60, 0]);
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 400]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <GridBackground color={colors.primary} />
      <ParticleBackground colors={[colors.primary, colors.accent]} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        {topicLogo && (
          <div style={{ opacity: logoSpring, marginBottom: 30 }}>
            <TechLogo
              src={topicLogo}
              size={120}
              brandColor={colors.primary}
            />
          </div>
        )}

        {/* Title */}
        <div
          style={{
            ...fontBold,
            fontSize: isPortrait ? 64 : 100,
            color: colors.text,
            opacity: titleSpring,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          <GradientText colors={[colors.primary, colors.accent]}>
            {title}
          </GradientText>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              ...fontMono,
              fontSize: isPortrait ? 24 : 36,
              color: colors.primary,
              opacity: subtitleSpring,
              transform: `translateY(${subtitleY}px)`,
              marginTop: 20,
              letterSpacing: 4,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Gradient divider line */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            marginTop: 40,
            opacity: lineSpring,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
