import { useMemo } from "react";
import { interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type GlitchProps = {
  intensity: number;
};

const GlitchComponent: React.FC<
  TransitionPresentationComponentProps<GlitchProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const { intensity } = passedProps;

  const isEntering = presentationDirection === "entering";

  // For entering: progress goes 0→1, effect is strong at start fading out
  // For exiting: progress goes 0→1, effect is weak at start growing
  const effectAmount = isEntering
    ? interpolate(presentationProgress, [0, 0.6, 1], [1, 0.3, 0])
    : interpolate(presentationProgress, [0, 0.4, 1], [0, 0.3, 1]);

  const offset = effectAmount * intensity;
  const scaleVal = isEntering
    ? interpolate(presentationProgress, [0, 1], [1.02, 1])
    : interpolate(presentationProgress, [0, 1], [1, 1.02]);

  const containerOpacity = isEntering
    ? interpolate(presentationProgress, [0, 0.3], [0, 1], {
        extrapolateRight: "clamp",
      })
    : interpolate(presentationProgress, [0.7, 1], [1, 0], {
        extrapolateLeft: "clamp",
      });

  const scanlineOpacity = effectAmount * 0.15;

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      position: "absolute" as const,
      transform: `scale(${scaleVal})`,
      opacity: containerOpacity,
    }),
    [scaleVal, containerOpacity],
  );

  const redStyle = useMemo(
    () => ({
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      mixBlendMode: "screen" as const,
      transform: `translateX(${offset}px)`,
      opacity: effectAmount > 0.01 ? 0.8 : 1,
      filter:
        effectAmount > 0.01
          ? `saturate(2) hue-rotate(-30deg)`
          : undefined,
    }),
    [offset, effectAmount],
  );

  const blueStyle = useMemo(
    () => ({
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      mixBlendMode: "screen" as const,
      transform: `translateX(${-offset}px)`,
      opacity: effectAmount > 0.01 ? 0.8 : 1,
      filter:
        effectAmount > 0.01
          ? `saturate(2) hue-rotate(30deg)`
          : undefined,
    }),
    [offset, effectAmount],
  );

  const scanlineStyle = useMemo(
    () => ({
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
      opacity: scanlineOpacity,
      pointerEvents: "none" as const,
    }),
    [scanlineOpacity],
  );

  if (effectAmount < 0.01) {
    return (
      <div style={containerStyle}>
        {children}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Red channel offset */}
      <div style={redStyle}>{children}</div>
      {/* Blue channel offset */}
      <div style={blueStyle}>{children}</div>
      {/* Scanline overlay */}
      <div style={scanlineStyle} />
    </div>
  );
};

export const glitch = (props?: Partial<GlitchProps>): TransitionPresentation<GlitchProps> => {
  return {
    component: GlitchComponent,
    props: {
      intensity: props?.intensity ?? 8,
    },
  };
};
