import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { StatsProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { SectionTitle } from "../components/SectionTitle";
import { GridBackground } from "../components/GridBackground";
import { ParticleBackground } from "../components/ParticleBackground";
import { GlowOrb } from "../components/GlowOrb";

interface StatsSceneProps {
  heading: string;
  stats: StatsProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
}

const StatCard: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  index: number;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
  frame: number;
  fps: number;
  isPortrait: boolean;
}> = ({ label, value, suffix, index, colors, fontBold, fontRegular, fontMono, frame, fps, isPortrait }) => {
  const delay = 15 + index * 12;
  const cardSpring = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200 },
  });
  const cardY = interpolate(cardSpring, [0, 1], [60, 0]);

  // Animated number counter
  const counterProgress = spring({
    fps,
    frame: frame - delay - 5,
    config: { damping: 80, mass: 0.8 },
  });
  const displayValue = Math.round(value * counterProgress);

  const isEven = index % 2 === 0;
  const accentColor = isEven ? colors.primary : colors.accent;

  return (
    <div
      style={{
        flex: isPortrait ? "0 0 calc(50% - 12px)" : 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isPortrait ? 10 : 16,
        opacity: cardSpring,
        transform: `translateY(${cardY}px)`,
        padding: isPortrait ? "24px 16px" : "40px 20px",
        borderRadius: 20,
        background: `linear-gradient(135deg, ${colors.secondary}80, ${colors.bg}60)`,
        border: `1px solid ${accentColor}30`,
        boxShadow: `0 0 40px ${accentColor}15, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Value */}
      <div
        style={{
          ...fontBold,
          fontSize: isPortrait ? 52 : 72,
          color: accentColor,
          lineHeight: 1,
        }}
      >
        {displayValue.toLocaleString()}
        {suffix && (
          <span style={{ ...fontMono, fontSize: isPortrait ? 28 : 40, color: colors.text }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          ...fontRegular,
          fontSize: 24,
          color: colors.muted,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC<StatsSceneProps> = ({
  heading,
  stats,
  colors,
  fontBold,
  fontRegular,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <GridBackground color={colors.primary} opacity={0.03} animated />
      <ParticleBackground
        colors={[colors.primary, colors.accent]}
        count={10}
        seed={`stats-${heading}`}
        opacity={0.2}
      />
      <GlowOrb
        colors={[colors.primary, colors.accent]}
        count={2}
        seed={`glow-stats-${heading}`}
        intensity={0.05}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: isPortrait ? "40px 40px" : "60px 100px",
          gap: isPortrait ? 30 : 50,
        }}
      >
        <SectionTitle
          title={heading}
          accentColor={colors.primary}
          primaryColor={colors.primary}
          textColor={colors.text}
          fontStyle={fontBold}
          monoStyle={fontMono}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: isPortrait ? "wrap" : "nowrap",
            alignItems: "center",
            justifyContent: "center",
            gap: isPortrait ? 20 : 30,
          }}
        >
          {stats.items.map((item, i) => (
            <StatCard
              key={i}
              label={item.label}
              value={item.value}
              suffix={item.suffix}
              index={i}
              colors={colors}
              fontBold={fontBold}
              fontRegular={fontRegular}
              fontMono={fontMono}
              frame={frame}
              fps={fps}
              isPortrait={isPortrait}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
