import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_REGULAR, column } from "../styles";

// Simple brain SVG icon (two hemispheres with neural connections)
const BrainIcon = ({ size, opacity }: { size: number; opacity: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ opacity }}
  >
    {/* Left hemisphere */}
    <path
      d="M9.5 2a5.5 5.5 0 0 0-4 9.3V17a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-6"
      stroke={COLORS.primary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 7.5a3.5 3.5 0 0 1 4-3.46"
      stroke={COLORS.primary}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    {/* Right hemisphere */}
    <path
      d="M14.5 2a5.5 5.5 0 0 1 4 9.3V17a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-6"
      stroke={COLORS.secondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 7.5a3.5 3.5 0 0 0-4-3.46"
      stroke={COLORS.secondary}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    {/* Center connection */}
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="19"
      stroke={COLORS.accent}
      strokeWidth={1}
      opacity={0.4}
      strokeDasharray="2 3"
    />
  </svg>
);

export const SceneReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Brain icon scales in
  const brainSpring = spring({
    fps,
    frame,
    config: { damping: 12, mass: 0.5 },
  });
  const brainScale = interpolate(brainSpring, [0, 1], [0.3, 1]);

  // App name
  const nameSpring = spring({
    fps,
    frame: frame - 15,
    config: { damping: 200 },
  });
  const nameY = interpolate(nameSpring, [0, 1], [40, 0]);

  // Tagline
  const taglineSpring = spring({
    fps,
    frame: frame - 30,
    config: { damping: 200 },
  });

  // Gradient line
  const lineSpring = spring({
    fps,
    frame: frame - 40,
    config: { damping: 200 },
  });
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 500]);

  // Glow pulse
  const glowPulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Ambient glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(139,92,246,0.1) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill style={column}>
        {/* Brain icon */}
        <div
          style={{
            transform: `scale(${brainScale})`,
            opacity: brainSpring,
            filter: `drop-shadow(0 0 ${glowPulse * 30}px ${COLORS.glowPurple})`,
            marginBottom: 30,
          }}
        >
          <BrainIcon size={160} opacity={1} />
        </div>

        {/* App name */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 100,
            color: COLORS.white,
            opacity: nameSpring,
            transform: `translateY(${nameY}px)`,
            textAlign: "center",
            letterSpacing: 3,
          }}
        >
          <span style={{ color: COLORS.primary }}>Autism</span>{" "}
          <span style={{ color: COLORS.secondary }}>Types</span>
        </div>

        {/* Gradient divider */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            marginTop: 25,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            borderRadius: 2,
            opacity: lineSpring,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            ...FONT_REGULAR,
            fontSize: 38,
            color: COLORS.gray,
            opacity: taglineSpring,
            textAlign: "center",
            marginTop: 30,
            lineHeight: 1.4,
          }}
        >
          Multi-sensory learning that builds
          <br />
          <span
            style={{
              color: COLORS.accent,
              ...FONT_BOLD,
              filter: `drop-shadow(0 0 8px rgba(245,158,11,0.4))`,
            }}
          >
            neural connections
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
