import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import alea from "alea";

interface FloatingCodeProps {
  tokens?: string[];
  color?: string;
  seed?: string;
  speed?: number;
  count?: number;
  opacity?: number;
}

const DEFAULT_TOKENS = ["{ }", "=>", "[]", "fn()", "0x", "//", "</>", "&&", "::", "**", "!=", "??"];

interface CodeToken {
  x: number;
  startY: number;
  token: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  moveSpeed: number;
  tokenOpacity: number;
}

export const FloatingCode: React.FC<FloatingCodeProps> = ({
  tokens = DEFAULT_TOKENS,
  color = "#ffffff",
  seed = "code-float",
  speed = 1,
  count = 18,
  opacity = 0.08,
}) => {
  const frame = useCurrentFrame();

  const items = useMemo(() => {
    const rng = alea(seed);
    return Array.from({ length: count }).map((): CodeToken => ({
      x: rng() * 1920,
      startY: rng() * 1400,
      token: tokens[Math.floor(rng() * tokens.length)],
      size: 14 + rng() * 12,
      rotation: rng() * 360,
      rotSpeed: (rng() - 0.5) * 0.5,
      moveSpeed: 0.3 + rng() * 0.7,
      tokenOpacity: 0.4 + rng() * 0.6,
    }));
  }, [tokens, seed, count]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {items.map((item, i) => {
        const y = 1200 - ((frame * item.moveSpeed * speed + item.startY) % 1500);
        const rot = item.rotation + frame * item.rotSpeed;
        const drift = Math.sin(frame * 0.015 + i * 1.5) * 20;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x + drift,
              top: y,
              fontSize: item.size,
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              fontWeight: 500,
              color,
              opacity: item.tokenOpacity,
              transform: `rotate(${rot}deg)`,
              whiteSpace: "nowrap",
            }}
          >
            {item.token}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
