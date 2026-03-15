import type { CSSProperties } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ColorMap } from "../styles/theme";
import { buildEventColors, buildCardGlow } from "../styles/theme";
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
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 180;
  const ARROW_GAP = 50;

  const nodeColors = buildEventColors(colors.primary, colors.accent, nodes.length);

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
          const arrowColor = nodeColors[i + 1] ?? colors.accent;

          return (
            <g key={`arrow-${i}`} opacity={arrowSpring}>
              <line
                x1={x1}
                y1={midY}
                x2={currentX2}
                y2={midY}
                stroke={arrowColor}
                strokeWidth={14}
                opacity={0.15}
              />
              <line
                x1={x1}
                y1={midY}
                x2={currentX2}
                y2={midY}
                stroke={arrowColor}
                strokeWidth={5}
              />
              {arrowProgress > 0.8 && (
                <polygon
                  points={`${currentX2},${midY - 7} ${currentX2 + 14},${midY} ${currentX2},${midY + 7}`}
                  fill={arrowColor}
                />
              )}
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
        const nodeColor = nodeColors[i];

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
              background: `linear-gradient(135deg, ${nodeColor}22, ${colors.bg}bb)`,
              borderRadius: 20,
              border: `2px solid ${isActive ? nodeColor : colors.muted}44`,
              boxShadow: isActive
                ? buildCardGlow(nodeColor)
                : `0 0 25px ${nodeColor}15`,
            }}
          >
            {IconComponent && (
              <IconComponent
                size={60}
                color={isActive ? nodeColor : colors.text}
                glowColor={isActive ? nodeColor : undefined}
              />
            )}
            <div
              style={{
                ...fontBold,
                fontSize: 20,
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
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 150;
  const ARROW_GAP = 40;
  const totalHeight =
    nodes.length * NODE_HEIGHT + (nodes.length - 1) * ARROW_GAP;

  const nodeColors = buildEventColors(colors.primary, colors.accent, nodes.length);

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
          const arrowColor = nodeColors[i + 1] ?? colors.accent;

          return (
            <g key={`arrow-${i}`} opacity={arrowSpring}>
              <line
                x1={midX}
                y1={y1}
                x2={midX}
                y2={currentY2}
                stroke={arrowColor}
                strokeWidth={10}
                opacity={0.2}
              />
              <line
                x1={midX}
                y1={y1}
                x2={midX}
                y2={currentY2}
                stroke={arrowColor}
                strokeWidth={5}
              />
              {arrowProgress > 0.8 && (
                <polygon
                  points={`${midX - 7},${currentY2} ${midX},${currentY2 + 14} ${midX + 7},${currentY2}`}
                  fill={arrowColor}
                />
              )}
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
        const nodeColor = nodeColors[i];

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
              background: `linear-gradient(135deg, ${nodeColor}22, ${colors.bg}bb)`,
              borderRadius: 20,
              border: `2px solid ${isActive ? nodeColor : colors.muted}44`,
              boxShadow: isActive
                ? buildCardGlow(nodeColor)
                : `0 0 25px ${nodeColor}15`,
            }}
          >
            {IconComponent && (
              <IconComponent
                size={50}
                color={isActive ? nodeColor : colors.text}
                glowColor={isActive ? nodeColor : undefined}
              />
            )}
            <div
              style={{
                ...fontBold,
                fontSize: 18,
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
