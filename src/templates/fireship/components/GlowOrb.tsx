import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import alea from "alea";

interface GlowOrbProps {
  colors: string[];
  count?: number;
  seed?: string;
  intensity?: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  colors,
  count = 4,
  seed = "glow",
  intensity = 0.3,
}) => {
  const frame = useCurrentFrame();

  const orbs = useMemo(() => {
    const rng = alea(seed);
    return Array.from({ length: count }).map((): Orb => ({
      x: 200 + rng() * 1520,
      y: 150 + rng() * 780,
      radius: 150 + rng() * 200,
      color: colors[Math.floor(rng() * colors.length)] ?? colors[0],
      phase: rng() * Math.PI * 2,
      speed: 0.03 + rng() * 0.04,
    }));
  }, [count, seed, colors]);

  return (
    <AbsoluteFill style={{ opacity: intensity }}>
      {orbs.map((orb, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(frame * orb.speed + orb.phase);
        const driftX = Math.sin(frame * 0.01 + orb.phase) * 20;
        const driftY = Math.cos(frame * 0.008 + orb.phase) * 15;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: orb.x + driftX - orb.radius,
              top: orb.y + driftY - orb.radius,
              width: orb.radius * 2,
              height: orb.radius * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              opacity: pulse,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
