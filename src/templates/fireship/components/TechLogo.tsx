import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface TechLogoProps {
  src: string;
  size?: number;
  brandColor: string;
}

export const TechLogo: React.FC<TechLogoProps> = ({
  src,
  size = 120,
  brandColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({
    fps,
    frame,
    config: { mass: 0.5, damping: 12 },
  });

  const floatY = Math.sin(frame * 0.05) * 3;
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const resolvedSrc = src.startsWith("http") ? src : staticFile(src);

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scaleSpring}) translateY(${floatY}px)`,
        borderRadius: size * 0.2,
        boxShadow: `0 0 ${glowPulse * 30}px ${brandColor}60`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Img
        src={resolvedSrc}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    </div>
  );
};
