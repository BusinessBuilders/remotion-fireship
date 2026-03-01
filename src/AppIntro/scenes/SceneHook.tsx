import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, column } from "../styles";

export const SceneHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text animation
  const textSpring = spring({ fps, frame, config: { damping: 200 } });
  const textY = interpolate(textSpring, [0, 1], [60, 0]);

  // "ONE" emphasis appears after main text
  const oneSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 15, mass: 0.8 },
  });
  const oneScale = interpolate(oneSpring, [0, 1], [0.3, 1]);

  // Lonely circle fades in
  const circleSpring = spring({
    fps,
    frame: frame - 30,
    config: { damping: 200 },
  });

  // Subtle pulse on the lonely circle
  const pulse = Math.sin(frame * 0.08) * 0.15 + 0.85;

  // Dim circles appear later to show emptiness
  const dimSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 200 },
  });

  // Grid background movement
  const gridOffset = (frame * 0.3) % 48;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Animated grid background */}
      <AbsoluteFill style={{ opacity: 0.05 }}>
        <svg width="1920" height="1080">
          {Array.from({ length: 42 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 48 - gridOffset}
              y1={0}
              x2={i * 48 - gridOffset}
              y2={1080}
              stroke={COLORS.primary}
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 48 + gridOffset}
              x2={1920}
              y2={i * 48 + gridOffset}
              stroke={COLORS.primary}
              strokeWidth={1}
            />
          ))}
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={column}>
        {/* Main text */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 64,
            color: COLORS.white,
            opacity: textSpring,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Most learning apps activate
        </div>

        {/* "ONE" with emphasis */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 120,
            color: COLORS.primary,
            opacity: oneSpring,
            transform: `scale(${oneScale})`,
            textAlign: "center",
            marginTop: 10,
            filter: `drop-shadow(0 0 30px ${COLORS.glowCyan})`,
          }}
        >
          ONE
        </div>

        <div
          style={{
            ...FONT_BOLD,
            fontSize: 52,
            color: COLORS.gray,
            opacity: oneSpring,
            textAlign: "center",
            marginTop: 5,
          }}
        >
          brain region
        </div>

        {/* Lonely circle visualization */}
        <div
          style={{
            marginTop: 60,
            position: "relative",
            width: 300,
            height: 120,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Active node */}
          <svg
            width="300"
            height="120"
            viewBox="0 0 300 120"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* Glow behind active node */}
            <circle
              cx={150}
              cy={60}
              r={35 * pulse}
              fill="none"
              stroke={COLORS.primary}
              strokeWidth={2}
              opacity={circleSpring * 0.3}
            />
            {/* Active circle */}
            <circle
              cx={150}
              cy={60}
              r={22}
              fill={COLORS.primary}
              opacity={circleSpring}
              style={{
                filter: `drop-shadow(0 0 ${pulse * 20}px ${COLORS.glowCyan})`,
              }}
            />

            {/* Dim inactive circles */}
            {[-80, 80].map((offsetX, i) => (
              <circle
                key={i}
                cx={150 + offsetX}
                cy={60}
                r={16}
                fill={COLORS.dimNode}
                stroke={COLORS.gray}
                strokeWidth={1}
                opacity={dimSpring * 0.3}
              />
            ))}
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
