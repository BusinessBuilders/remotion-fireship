import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_MONO } from "../styles";

const StatCard = ({
  value,
  label,
  delay,
  color,
}: {
  value: string;
  label: string;
  delay: number;
  color: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 200 } });
  const scale = interpolate(s, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        opacity: s,
        transform: `scale(${scale})`,
        backgroundColor: `${color}10`,
        border: `2px solid ${color}40`,
        borderRadius: 24,
        padding: "50px 60px",
        textAlign: "center",
        minWidth: 350,
      }}
    >
      <div
        style={{
          ...FONT_BOLD,
          fontSize: 90,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          ...FONT_MONO,
          fontSize: 26,
          color: COLORS.gray,
          marginTop: 15,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SceneStats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerSpring = spring({ fps, frame, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div
        style={{
          ...FONT_BOLD,
          fontSize: 64,
          color: COLORS.white,
          textAlign: "center",
          marginTop: 80,
          opacity: headerSpring,
        }}
      >
        The Numbers Don't Lie
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
          marginTop: 100,
        }}
      >
        <StatCard value="10x" label="faster development" delay={20} color={COLORS.primary} />
        <StatCard value="73%" label="less bugs shipped" delay={35} color={COLORS.green} />
        <StatCard value="$0" label="salary required" delay={50} color={COLORS.accent} />
      </div>

      {/* Bottom note */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...FONT_MONO,
            fontSize: 28,
            color: COLORS.gray,
            opacity: spring({ fps, frame: frame - 70, config: { damping: 200 } }),
          }}
        >
          {"*results may vary // but the trend is clear"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
