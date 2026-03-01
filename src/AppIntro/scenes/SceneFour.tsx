import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, column } from "../styles";

export const SceneFour = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "What if" text
  const whatIfSpring = spring({ fps, frame, config: { damping: 200 } });
  const whatIfY = interpolate(whatIfSpring, [0, 1], [50, 0]);

  // "FOUR" with dramatic entrance
  const fourSpring = spring({
    fps,
    frame: frame - 18,
    config: { damping: 12, mass: 0.6, stiffness: 200 },
  });
  const fourScale = interpolate(fourSpring, [0, 1], [0.1, 1]);

  // 4 circles light up sequentially
  const circleDelays = [35, 45, 55, 65];
  const circleColors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.green,
  ];

  // Glow intensity cycles
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Radial glow background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${COLORS.bgCard} 0%, ${COLORS.bg} 70%)`,
          opacity: fourSpring,
        }}
      />

      <AbsoluteFill style={column}>
        {/* "What if you could activate" */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 60,
            color: COLORS.white,
            opacity: whatIfSpring,
            transform: `translateY(${whatIfY}px)`,
            textAlign: "center",
          }}
        >
          What if you could activate
        </div>

        {/* "FOUR?" */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 160,
            color: COLORS.accent,
            opacity: fourSpring,
            transform: `scale(${fourScale})`,
            textAlign: "center",
            marginTop: 10,
            filter: `drop-shadow(0 0 40px rgba(245, 158, 11, 0.6))`,
            letterSpacing: 8,
          }}
        >
          FOUR?
        </div>

        {/* Four circles in a row */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            gap: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {circleDelays.map((delay, i) => {
            const s = spring({
              fps,
              frame: frame - delay,
              config: { damping: 15, mass: 0.5 },
            });
            const scale = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: circleColors[i],
                  transform: `scale(${scale})`,
                  opacity: s,
                  boxShadow: `0 0 ${glowPulse * 25}px ${circleColors[i]}`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
