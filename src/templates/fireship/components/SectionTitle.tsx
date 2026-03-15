import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { buildTextGlow, buildCardGlow } from "../styles/theme";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  label?: string;
  accentColor: string;
  primaryColor: string;
  textColor: string;
  fontStyle: CSSProperties;
  monoStyle?: CSSProperties;
  align?: "left" | "center";
  glowIntensity?: number;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  label,
  accentColor,
  primaryColor,
  textColor,
  fontStyle,
  monoStyle,
  align = "left",
  glowIntensity = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  const titleSpring = spring({ fps, frame, config: { damping: 200 } });
  const barSpring = spring({
    fps,
    frame: frame - 3,
    config: { damping: 200 },
  });
  const subtitleSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 200 },
  });
  const labelSpring = spring({
    fps,
    frame: frame - 2,
    config: { damping: 200 },
  });
  const accentBarsSpring = spring({
    fps,
    frame: frame - 8,
    config: { damping: 200 },
  });

  const titleX = interpolate(titleSpring, [0, 1], [40, 0]);
  const barHeight = isPortrait ? 40 : 65;
  const barWidth = interpolate(barSpring, [0, 1], [0, 8]);
  const fontSize = isPortrait ? 48 : 80;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        textAlign: align,
      }}
    >
      {/* Optional accent label */}
      {label && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: labelSpring,
            marginLeft: align === "left" ? 24 : 0,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: primaryColor,
              boxShadow: `0 0 10px ${primaryColor}60`,
            }}
          />
          <span
            style={{
              ...fontStyle,
              fontSize: isPortrait ? 14 : 18,
              fontWeight: 700,
              color: accentColor,
              textTransform: "uppercase" as const,
              letterSpacing: 3,
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Title row: accent bar + gradient text */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {align === "left" && (
          <div
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: primaryColor,
              borderRadius: 4,
              marginTop: 6,
              flexShrink: 0,
              boxShadow: buildCardGlow(primaryColor),
            }}
          />
        )}

        <div
          style={{
            ...fontStyle,
            fontSize,
            letterSpacing: 2,
            lineHeight: 1.05,
            opacity: titleSpring,
            transform: `translateX(${titleX}px)`,
            textShadow: buildTextGlow(primaryColor, glowIntensity),
            background: `linear-gradient(135deg, ${textColor} 30%, ${accentColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </div>
      </div>

      {/* Staggered accent bars */}
      <div
        style={{
          display: "flex",
          gap: 5,
          marginLeft: align === "left" ? 24 : 0,
          opacity: accentBarsSpring,
        }}
      >
        <div
          style={{
            width: 50,
            height: 3,
            background: primaryColor,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            width: 16,
            height: 3,
            background: `${accentColor}50`,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            width: 6,
            height: 3,
            background: `${accentColor}25`,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            ...(monoStyle ?? fontStyle),
            fontSize: isPortrait ? 18 : 28,
            color: accentColor,
            opacity: subtitleSpring,
            letterSpacing: 2,
            marginLeft: align === "left" ? 24 : 0,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
