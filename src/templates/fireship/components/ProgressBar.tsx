import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ProgressBarProps {
  color: string;
  sectionStartFrames: number[];
  dotColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  color,
  sectionStartFrames,
  dotColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Track */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 4,
          backgroundColor: `${color}22`,
        }}
      >
        {/* Fill */}
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: color,
          }}
        />
      </div>

      {/* Section marker dots */}
      {sectionStartFrames.map((startFrame, i) => {
        const dotX = (startFrame / durationInFrames) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${dotX}%`,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: dotColor ?? color,
              transform: "translate(-50%, 1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
