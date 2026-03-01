import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_MONO } from "../styles";

export const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 200 } });
  const subtitleSpring = spring({
    fps,
    frame: frame - 15,
    config: { damping: 200 },
  });
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const titleY = interpolate(titleSpring, [0, 1], [80, 0]);
  const titleOpacity = titleSpring;
  const subtitleY = interpolate(subtitleSpring, [0, 1], [60, 0]);
  const subtitleOpacity = subtitleSpring;

  // Scanline effect
  const scanlineY = (frame * 4) % 1080;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <AbsoluteFill style={{ opacity: 0.08 }}>
        <svg width="1920" height="1080">
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 48}
              y1={0}
              x2={i * 48}
              y2={1080}
              stroke={COLORS.primary}
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 23 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 48}
              x2={1920}
              y2={i * 48}
              stroke={COLORS.primary}
              strokeWidth={1}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Scanline */}
      <AbsoluteFill style={{ opacity: 0.04 }}>
        <div
          style={{
            position: "absolute",
            top: scanlineY,
            width: "100%",
            height: 2,
            background: COLORS.primary,
            boxShadow: `0 0 40px ${COLORS.primary}`,
          }}
        />
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* AI Icon */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 30,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke={COLORS.primary}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 ${glowPulse * 15}px ${COLORS.primary})`,
              }}
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 110,
            color: COLORS.white,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          <span>AI Coding Agents</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            ...FONT_MONO,
            fontSize: 36,
            color: COLORS.primary,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginTop: 20,
            letterSpacing: 4,
          }}
        >
          {"// the future of software development"}
        </div>

        {/* Gradient line */}
        <div
          style={{
            width: 400,
            height: 3,
            marginTop: 40,
            opacity: subtitleOpacity,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
