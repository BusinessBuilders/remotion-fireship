import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_REGULAR, column } from "../styles";

export const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button slides up
  const ctaSpring = spring({
    fps,
    frame,
    config: { damping: 14, mass: 0.6 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [80, 0]);
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.8, 1]);

  // URL fades in
  const urlSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 200 },
  });

  // Subtitle
  const subSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 200 },
  });

  // Pulsing glow on button
  const pulse = Math.sin(frame * 0.12) * 0.4 + 0.6;

  // Particles floating up
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const startX = 200 + (i * 137.5) % 1520;
    const speed = 0.8 + (i % 3) * 0.4;
    const y = 1080 - ((frame * speed + i * 90) % 1200);
    const x = startX + Math.sin(frame * 0.02 + i) * 30;
    const size = 3 + (i % 3) * 2;
    const opacity = interpolate(y, [0, 200, 800, 1080], [0, 0.4, 0.4, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y, size, opacity };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Ambient gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.06) 0%, transparent 60%)`,
        }}
      />

      {/* Floating particles */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={i % 2 === 0 ? COLORS.primary : COLORS.secondary}
            opacity={p.opacity}
          />
        ))}
      </svg>

      <AbsoluteFill style={column}>
        {/* Subtitle */}
        <div
          style={{
            ...FONT_REGULAR,
            fontSize: 36,
            color: COLORS.gray,
            opacity: subSpring,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Ready to unlock your child&apos;s potential?
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaSpring,
            transform: `translateY(${ctaY}px) scale(${ctaScale})`,
            padding: "28px 80px",
            borderRadius: 16,
            background: `linear-gradient(135deg, ${COLORS.accent}, #d97706)`,
            boxShadow: `0 0 ${pulse * 50}px rgba(245,158,11,${pulse * 0.5})`,
          }}
        >
          <div
            style={{
              ...FONT_BOLD,
              fontSize: 52,
              color: COLORS.white,
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            Join the Waitlist
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 42,
            color: COLORS.primary,
            opacity: urlSpring,
            textAlign: "center",
            marginTop: 40,
            letterSpacing: 2,
            filter: `drop-shadow(0 0 10px ${COLORS.glowCyan})`,
          }}
        >
          autismtypes.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
