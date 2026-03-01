import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_MONO } from "../styles";

const FlowNode = ({
  label,
  icon,
  delay,
  x,
  y,
  color,
}: {
  label: string;
  icon: string;
  delay: number;
  x: number;
  y: number;
  color: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 200 } });
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const glow = Math.sin((frame - delay) * 0.15) * 0.4 + 0.6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        opacity: s,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 24,
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 60,
          boxShadow: `0 0 ${glow * 30}px ${color}40`,
          margin: "0 auto",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          ...FONT_BOLD,
          fontSize: 24,
          color: COLORS.white,
          marginTop: 12,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Arrow = ({ delay, x1, y1, x2, y2 }: { delay: number; x1: number; y1: number; x2: number; y2: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 200 } });

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080, opacity: s }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.primary} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={COLORS.primary}
        strokeWidth={3}
        strokeDasharray="10,5"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};

export const SceneAgentFlow = () => {
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
          marginTop: 50,
          opacity: headerSpring,
        }}
      >
        How AI Agents Work
      </div>

      {/* Flow diagram */}
      <AbsoluteFill>
        <FlowNode label="Prompt" icon="💬" delay={15} x={120} y={420} color={COLORS.primary} />
        <Arrow delay={25} x1={280} y1={490} x2={440} y2={490} />

        <FlowNode label="Plan" icon="🧠" delay={30} x={460} y={420} color={COLORS.secondary} />
        <Arrow delay={40} x1={620} y1={490} x2={780} y2={490} />

        <FlowNode label="Code" icon="⚡" delay={45} x={800} y={420} color={COLORS.accent} />
        <Arrow delay={55} x1={960} y1={490} x2={1120} y2={490} />

        <FlowNode label="Test" icon="🧪" delay={60} x={1140} y={420} color={COLORS.green} />
        <Arrow delay={70} x1={1300} y1={490} x2={1460} y2={490} />

        <FlowNode label="Ship" icon="🚀" delay={75} x={1480} y={420} color="#f59e0b" />
      </AbsoluteFill>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...FONT_MONO,
            fontSize: 30,
            color: COLORS.gray,
            opacity: spring({ fps, frame: frame - 90, config: { damping: 200 } }),
          }}
        >
          {"Prompt → Plan → Code → Test → Deploy // fully autonomous"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
