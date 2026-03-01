import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accentColor: string;
  textColor: string;
  fontStyle: CSSProperties;
  monoStyle?: CSSProperties;
  align?: "left" | "center";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  accentColor,
  textColor,
  fontStyle,
  monoStyle,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  const titleX = interpolate(titleSpring, [0, 1], [40, 0]);
  const barWidth = interpolate(barSpring, [0, 1], [0, 4]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 16,
        textAlign: align,
      }}
    >
      {/* Accent bar */}
      {align === "left" && (
        <div
          style={{
            width: barWidth,
            height: 60,
            backgroundColor: accentColor,
            borderRadius: 2,
            marginTop: 6,
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            ...fontStyle,
            fontSize: 56,
            color: textColor,
            opacity: titleSpring,
            transform: `translateX(${titleX}px)`,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              ...(monoStyle ?? fontStyle),
              fontSize: 28,
              color: accentColor,
              opacity: subtitleSpring,
              letterSpacing: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
