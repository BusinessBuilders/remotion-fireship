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

const STAGGER_FRAMES = 12;

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  colors,
  fontBold,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  if (isPortrait) {
    return (
      <VerticalFlow
        nodes={nodes}
        colors={colors}
        fontBold={fontBold}
        frame={frame}
        fps={fps}
        containerWidth={width}
      />
    );
  }

  return (
    <HorizontalFlow
      nodes={nodes}
      colors={colors}
      fontBold={fontBold}
      frame={frame}
      fps={fps}
      containerWidth={width}
    />
  );
};

// --- Horizontal layout (landscape) ---
const HorizontalFlow: React.FC<{
  nodes: FlowNode[];
  colors: ColorMap;
  fontBold: CSSProperties;
  frame: number;
  fps: number;
  containerWidth: number;
}> = ({ nodes, colors, fontBold, frame, fps, containerWidth }) => {
  const NODE_WIDTH = 190;
  const NODE_HEIGHT = 160;
  const ARROW_GAP = 50;

  const totalWidth =
    nodes.length * NODE_WIDTH + (nodes.length - 1) * ARROW_GAP;
  const startX = (containerWidth - totalWidth) / 2;

  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: 300,
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        width={containerWidth}
        height={300}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
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

// --- Vertical layout (portrait / TikTok) ---
const VerticalFlow: React.FC<{
  nodes: FlowNode[];
  colors: ColorMap;
  fontBold: CSSProperties;
  frame: number;
  fps: number;
  containerWidth: number;
}> = ({ nodes, colors, fontBold, frame, fps, containerWidth }) => {
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 120;
  const ARROW_GAP = 40;
  const totalHeight =
    nodes.length * NODE_HEIGHT + (nodes.length - 1) * ARROW_GAP;

  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: totalHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg
        width={containerWidth}
        height={totalHeight}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
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

          const midX = containerWidth / 2;
          const y1 = i * (NODE_HEIGHT + ARROW_GAP) + NODE_HEIGHT + 5;
          const y2 = (i + 1) * (NODE_HEIGHT + ARROW_GAP) - 5;
          const arrowLen = y2 - y1;
          const currentY2 = y1 + arrowLen * arrowProgress;

          return (
            <g key={`arrow-${i}`} opacity={arrowSpring}>
              <line
                x1={midX}
                y1={y1}
                x2={midX}
                y2={currentY2}
                stroke={colors.primary}
                strokeWidth={2}
              />
              {arrowProgress > 0.8 && (
                <polygon
                  points={`${midX - 6},${currentY2} ${midX},${currentY2 + 12} ${midX + 6},${currentY2}`}
                  fill={colors.primary}
                />
              )}
              <line
                x1={midX}
                y1={y1}
                x2={midX}
                y2={currentY2}
                stroke={colors.primary}
                strokeWidth={10}
                opacity={0.2}
              />
            </g>
          );
        })}
      </svg>

      {nodes.map((node, i) => {
        const nodeDelay = 15 + i * STAGGER_FRAMES;
        const nodeSpring = spring({
          fps,
          frame: frame - nodeDelay,
          config: { damping: 200 },
        });
        const nodeX = interpolate(nodeSpring, [0, 1], [40, 0]);
        const isActive =
          frame >= nodeDelay && frame < nodeDelay + STAGGER_FRAMES + 20;

        const nodeTop = i * (NODE_HEIGHT + ARROW_GAP);
        const IconComponent = node.icon ? ICON_MAP[node.icon] : null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (containerWidth - NODE_WIDTH) / 2,
              top: nodeTop,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              opacity: nodeSpring,
              transform: `translateX(${nodeX}px)`,
              display: "flex",
              flexDirection: "row",
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
                size={40}
                color={isActive ? colors.primary : colors.text}
                glowColor={isActive ? colors.primary : undefined}
              />
            )}
            <div
              style={{
                ...fontBold,
                fontSize: 16,
                color: colors.text,
                textAlign: "center",
                lineHeight: 1.2,
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
