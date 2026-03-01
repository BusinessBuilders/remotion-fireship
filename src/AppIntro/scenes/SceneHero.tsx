import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FONT_BOLD,
  FONT_REGULAR,
  BRAIN_REGIONS,
  DIAMOND_POSITIONS,
} from "../styles";

const NODE_RADIUS = 32;
const DIAMOND_SIZE = 180; // distance from center to node

// Connection pairs: indices into DIAMOND_POSITIONS
const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 2],
  [1, 3],
];

const NODE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.green,
];

const NODE_ICONS = [
  // Eye - See
  "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  // MessageSquare - Language
  "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  // Keyboard - Type
  "M2 6h20v12H2zM6 10h0M10 10h0M14 10h0M18 10h0M8 14h8",
  // CheckCircle - Confirm
  "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
];

export const SceneHero = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2 - 20;

  // Nodes appear staggered
  const nodesSprings = DIAMOND_POSITIONS.map((_, i) =>
    spring({
      fps,
      frame: frame - i * 12,
      config: { damping: 14, mass: 0.6 },
    }),
  );

  // Connection lines draw after nodes
  const connectionSprings = CONNECTIONS.map((_, i) =>
    spring({
      fps,
      frame: frame - 50 - i * 8,
      config: { damping: 200 },
    }),
  );

  // Labels appear after connections
  const labelSpring = spring({
    fps,
    frame: frame - 100,
    config: { damping: 200 },
  });

  // Pulse effect on nodes
  const pulse = Math.sin(frame * 0.06) * 0.2 + 0.8;

  // Slow rotation of entire diamond
  const rotation = interpolate(frame, [0, 240], [0, 3], {
    extrapolateRight: "clamp",
  });

  // Subtitle
  const subtitleSpring = spring({
    fps,
    frame: frame - 120,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, rgba(0,212,255,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Diamond network */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Connection lines */}
        {CONNECTIONS.map(([a, b], i) => {
          const posA = DIAMOND_POSITIONS[a];
          const posB = DIAMOND_POSITIONS[b];
          const x1 = cx + posA.x * DIAMOND_SIZE;
          const y1 = cy + posA.y * DIAMOND_SIZE;
          const x2 = cx + posB.x * DIAMOND_SIZE;
          const y2 = cy + posB.y * DIAMOND_SIZE;

          const progress = connectionSprings[i];
          const lineX2 = interpolate(progress, [0, 1], [x1, x2]);
          const lineY2 = interpolate(progress, [0, 1], [y1, y2]);

          return (
            <g key={`conn-${i}`}>
              {/* Glow line */}
              <line
                x1={x1}
                y1={y1}
                x2={lineX2}
                y2={lineY2}
                stroke={COLORS.primary}
                strokeWidth={4}
                opacity={progress * 0.3}
                strokeLinecap="round"
                style={{
                  filter: `blur(4px)`,
                }}
              />
              {/* Main line */}
              <line
                x1={x1}
                y1={y1}
                x2={lineX2}
                y2={lineY2}
                stroke={COLORS.primary}
                strokeWidth={2}
                opacity={progress * 0.8}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {DIAMOND_POSITIONS.map((pos, i) => {
          const x = cx + pos.x * DIAMOND_SIZE;
          const y = cy + pos.y * DIAMOND_SIZE;
          const s = nodesSprings[i];
          const scale = interpolate(s, [0, 1], [0, 1]);

          return (
            <g
              key={`node-${i}`}
              transform={`translate(${x}, ${y}) scale(${scale})`}
            >
              {/* Outer glow ring */}
              <circle
                r={NODE_RADIUS + 12}
                fill="none"
                stroke={NODE_COLORS[i]}
                strokeWidth={2}
                opacity={s * pulse * 0.4}
              />
              {/* Filled node */}
              <circle
                r={NODE_RADIUS}
                fill={COLORS.bgCard}
                stroke={NODE_COLORS[i]}
                strokeWidth={3}
              />
              {/* Icon inside */}
              <g
                transform="translate(-12, -12) scale(1)"
                opacity={s}
              >
                <path
                  d={NODE_ICONS[i]}
                  fill="none"
                  stroke={NODE_COLORS[i]}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Labels around the diamond (not rotated) */}
      {DIAMOND_POSITIONS.map((pos, i) => {
        // Push labels outward: more space for horizontal nodes
        const isHorizontal = Math.abs(pos.x) > 0;
        const labelX = cx + pos.x * (DIAMOND_SIZE + (isHorizontal ? 110 : 0));
        const labelY = cy + pos.y * (DIAMOND_SIZE + (isHorizontal ? 0 : 70));
        return (
          <div
            key={`label-${i}`}
            style={{
              position: "absolute",
              left: labelX,
              top: labelY,
              transform: "translate(-50%, -50%)",
              ...FONT_BOLD,
              fontSize: 28,
              color: NODE_COLORS[i],
              opacity: labelSpring,
              textAlign: "center",
              filter: `drop-shadow(0 0 10px ${NODE_COLORS[i]})`,
            }}
          >
            {BRAIN_REGIONS[i]}
          </div>
        );
      })}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          textAlign: "center",
          ...FONT_REGULAR,
          fontSize: 36,
          color: COLORS.gray,
          opacity: subtitleSpring,
        }}
      >
        4 brain regions working{" "}
        <span style={{ color: COLORS.primary, ...FONT_BOLD }}>together</span>
      </div>
    </AbsoluteFill>
  );
};
