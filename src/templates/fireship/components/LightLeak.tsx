import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createNoise2D } from "simplex-noise";
import alea from "alea";

interface LightLeakProps {
  color1?: string;
  color2?: string;
  seed?: string;
  intensity?: number;
}

export const LightLeak: React.FC<LightLeakProps> = ({
  color1 = "#FF6B00",
  color2 = "#00d4ff",
  seed = "light-leak",
  intensity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rng = alea(seed);
  const noise = createNoise2D(rng);

  // Fade in and out over the duration
  const fadeIn = spring({ fps, frame, config: { damping: 200 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const envelope = fadeIn * fadeOut;

  // Animate positions using noise for organic movement
  const t = frame * 0.02;
  const x1 = interpolate(noise(t, 0), [-1, 1], [10, 70]);
  const y1 = interpolate(noise(t, 100), [-1, 1], [10, 60]);
  const x2 = interpolate(noise(t + 50, 200), [-1, 1], [30, 90]);
  const y2 = interpolate(noise(t + 50, 300), [-1, 1], [20, 80]);
  const scale1 = interpolate(noise(t, 400), [-1, 1], [0.8, 1.4]);
  const scale2 = interpolate(noise(t + 30, 500), [-1, 1], [0.6, 1.2]);

  return (
    <AbsoluteFill
      style={{
        opacity: envelope * intensity,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    >
      {/* Primary warm leak */}
      <div
        style={{
          position: "absolute",
          left: `${x1}%`,
          top: `${y1}%`,
          width: 600 * scale1,
          height: 400 * scale1,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${color1}90 0%, ${color1}30 40%, transparent 70%)`,
          filter: "blur(80px)",
          transform: `translate(-50%, -50%) rotate(${frame * 0.5}deg)`,
        }}
      />
      {/* Secondary cool leak */}
      <div
        style={{
          position: "absolute",
          left: `${x2}%`,
          top: `${y2}%`,
          width: 500 * scale2,
          height: 350 * scale2,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${color2}70 0%, ${color2}20 40%, transparent 70%)`,
          filter: "blur(100px)",
          transform: `translate(-50%, -50%) rotate(${-frame * 0.3}deg)`,
        }}
      />
      {/* Anamorphic streak */}
      <div
        style={{
          position: "absolute",
          left: `${(x1 + x2) / 2}%`,
          top: "50%",
          width: 1200,
          height: 40,
          background: `linear-gradient(90deg, transparent, ${color1}40, ${color2}30, transparent)`,
          filter: "blur(20px)",
          transform: `translate(-50%, -50%) scaleX(${scale1})`,
          opacity: interpolate(noise(t, 600), [-1, 1], [0.3, 0.8]),
        }}
      />
    </AbsoluteFill>
  );
};
