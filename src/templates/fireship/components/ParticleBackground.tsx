import { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import alea from "alea";

interface ParticleBackgroundProps {
  count?: number;
  seed?: string;
  colors: [string, string];
  opacity?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  colorIndex: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 16,
  seed = "fireship",
  colors,
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const rng = alea(seed);
    return Array.from({ length: count }).map((): Particle => ({
      x: rng() * 1920,
      y: rng() * 1080,
      size: 2 + rng() * 4,
      speed: 0.5 + rng() * 1.0,
      colorIndex: rng() > 0.5 ? 1 : 0,
    }));
  }, [count, seed]);

  return (
    <svg
      width="1920"
      height="1080"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {particles.map((p, i) => {
        const y = 1080 - ((frame * p.speed + p.y) % 1200);
        const x = p.x + Math.sin(frame * 0.02 + i) * 30;
        const particleOpacity = interpolate(
          y,
          [0, 150, 900, 1080],
          [0, opacity, opacity, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={p.size}
            fill={colors[p.colorIndex] ?? colors[0]}
            opacity={particleOpacity}
          />
        );
      })}
    </svg>
  );
};
