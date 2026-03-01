import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_MONO } from "../styles";

export const SceneOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainSpring = spring({ fps, frame, config: { damping: 200 } });
  const taglineSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 200 },
  });
  const ctaSpring = spring({
    fps,
    frame: frame - 45,
    config: { damping: 100, mass: 2 },
  });
  const bottomSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 200 },
  });

  const scale = interpolate(mainSpring, [0, 1], [0.8, 1]);
  const glowPulse = Math.sin(frame * 0.08) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${COLORS.primary}15 0%, transparent 60%)`,
          opacity: glowPulse,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Main message */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 100,
            color: COLORS.white,
            textAlign: "center",
            opacity: mainSpring,
            transform: `scale(${scale})`,
            lineHeight: 1.2,
          }}
        >
          The Future
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Is Autonomous
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            ...FONT_MONO,
            fontSize: 32,
            color: COLORS.gray,
            marginTop: 30,
            opacity: taglineSpring,
            textAlign: "center",
          }}
        >
          {"AI agents don't replace developers"}
          <br />
          {"they give them superpowers"}
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 60,
            opacity: ctaSpring,
            transform: `scale(${interpolate(ctaSpring, [0, 1], [0.5, 1])})`,
          }}
        >
          <div
            style={{
              ...FONT_BOLD,
              fontSize: 36,
              color: COLORS.white,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              padding: "20px 60px",
              borderRadius: 16,
              boxShadow: `0 0 ${glowPulse * 40}px ${COLORS.primary}50`,
            }}
          >
            Start Building with AI
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            gap: 50,
            opacity: bottomSpring,
          }}
        >
          <div style={{ ...FONT_MONO, fontSize: 22, color: COLORS.gray }}>
            Like & Subscribe
          </div>
          <div style={{ ...FONT_MONO, fontSize: 22, color: COLORS.primary }}>
            |
          </div>
          <div style={{ ...FONT_MONO, fontSize: 22, color: COLORS.gray }}>
            Made with Remotion
          </div>
          <div style={{ ...FONT_MONO, fontSize: 22, color: COLORS.primary }}>
            |
          </div>
          <div style={{ ...FONT_MONO, fontSize: 22, color: COLORS.gray }}>
            Links in Description
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
