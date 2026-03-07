import type { CSSProperties } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ColorMap } from "../styles/theme";
import { ICON_MAP } from "./TechIcons";

interface FlowNode {
  label: string;
  icon?: string;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  colors: ColorMap;
  fontBold: CSSProperties;
}

const NODE_WIDTH = 190;
const NODE_HEIGHT = 160;
const ARROW_GAP = 50;
const STAGGER_FRAMES = 12;

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  colors,
  fontBold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalWidth =
    nodes.length * NODE_WIDTH + (nodes.length - 1) * ARROW_GAP;
  const startX = (1920 - totalWidth) / 2;

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 300,
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        width={1920}
        height={300}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Arrows between nodes */}
        {nodes.slice(0, -1).map((_, i) => {
          const arrowDelay = 15 + i * STAGGER_FRAMES + 6;
          const arrowSpring = spring({
            fps,
            frame: frame - arrowDelay,
            config: { damping: 200 },
          });
          const arrowProgress = interpolate(arrowSpring, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          const x1 = startX + i * (NODE_WIDTH + ARROW_GAP) + NODE_WIDTH + 5;
          const x2 = startX + (i + 1) * (NODE_WIDTH + ARROW_GAP) - 5;
          const midY = 150;
          const arrowLen = x2 - x1;
          const currentX2 = x1 + arrowLen * arrowProgress;

          return (
            <g key={`arrow-${i}`} opacity={arrowSpring}>
              <line
                x1={x1}
                y1={midY}
                x2={currentX2}
                y2={midY}
                stroke={colors.primary}
                strokeWidth={2}
              />
              {arrowProgress > 0.8 && (
                <polygon
                  points={`${currentX2},${midY - 6} ${currentX2 + 12},${midY} ${currentX2},${midY + 6}`}
                  fill={colors.primary}
                />
              )}
              {/* Glow line */}
              <line
                x1={x1}
                y1={midY}
                x2={currentX2}
                y2={midY}
                stroke={colors.primary}
                strokeWidth={10}
                opacity={0.2}
              />
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const nodeDelay = 15 + i * STAGGER_FRAMES;
        const nodeSpring = spring({
          fps,
          frame: frame - nodeDelay,
          config: { damping: 200 },
        });
        const nodeY = interpolate(nodeSpring, [0, 1], [40, 0]);
        const isActive =
          frame >= nodeDelay && frame < nodeDelay + STAGGER_FRAMES + 20;

        const nodeX = startX + i * (NODE_WIDTH + ARROW_GAP);
        const IconComponent = node.icon ? ICON_MAP[node.icon] : null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: nodeX,
              top: 150 - NODE_HEIGHT / 2,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              opacity: nodeSpring,
              transform: `translateY(${nodeY}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              background: `linear-gradient(135deg, ${colors.secondary}dd, ${colors.bg}bb)`,
              borderRadius: 20,
              border: `2px solid ${isActive ? colors.primary : colors.muted}44`,
              boxShadow: isActive
                ? `0 0 50px ${colors.primary}50, 0 0 100px ${colors.primary}20, inset 0 0 30px ${colors.primary}10`
                : `0 0 25px ${colors.primary}15`,
            }}
          >
            {IconComponent && (
              <IconComponent
                size={48}
                color={isActive ? colors.primary : colors.text}
                glowColor={isActive ? colors.primary : undefined}
              />
            )}
            <div
              style={{
                ...fontBold,
                fontSize: 18,
                color: colors.text,
                textAlign: "center",
                lineHeight: 1.2,
                padding: "0 10px",
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
