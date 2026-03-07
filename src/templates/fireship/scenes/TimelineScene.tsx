import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TimelineProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { SectionTitle } from "../components/SectionTitle";
import { GridBackground } from "../components/GridBackground";
import { ParticleBackground } from "../components/ParticleBackground";
import { GlowOrb } from "../components/GlowOrb";

interface TimelineSceneProps {
  heading: string;
  timeline: TimelineProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  heading,
  timeline,
  colors,
  fontBold,
  fontRegular,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const events = timeline.events;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <GridBackground color={colors.primary} opacity={0.03} animated />
      <ParticleBackground
        colors={[colors.primary, colors.accent]}
        count={8}
        seed={`timeline-${heading}`}
        opacity={0.15}
      />
      <GlowOrb
        colors={[colors.primary, colors.accent]}
        count={2}
        seed={`glow-tl-${heading}`}
        intensity={0.04}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 80px",
          gap: 40,
        }}
      >
        <SectionTitle
          title={heading}
          accentColor={colors.primary}
          textColor={colors.text}
          fontStyle={fontBold}
          monoStyle={fontMono}
        />

        {/* Horizontal timeline */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          {/* Timeline line */}
          <div style={{ position: "relative", height: 4, marginBottom: 0 }}>
            {/* Animated line draw */}
            {(() => {
              const lineSpring = spring({
                fps,
                frame: frame - 10,
                config: { damping: 200 },
              });
              return (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 4,
                    width: `${lineSpring * 100}%`,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                    borderRadius: 2,
                  }}
                />
              );
            })()}
          </div>

          {/* Events */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {events.map((event, i) => {
              const delay = 20 + i * 10;
              const dotSpring = spring({
                fps,
                frame: frame - delay,
                config: { damping: 100, mass: 1.5 },
              });
              const dotScale = interpolate(dotSpring, [0, 1], [0, 1]);
              const contentSpring = spring({
                fps,
                frame: frame - delay - 5,
                config: { damping: 200 },
              });
              const contentY = interpolate(contentSpring, [0, 1], [30, 0]);

              const isEven = i % 2 === 0;
              const accentColor = isEven ? colors.primary : colors.accent;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {/* Dot on timeline */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: accentColor,
                      transform: `scale(${dotScale})`,
                      boxShadow: `0 0 20px ${accentColor}60`,
                      marginTop: -12,
                      position: "relative",
                      zIndex: 1,
                    }}
                  />

                  {/* Connecting line down */}
                  <div
                    style={{
                      width: 2,
                      height: 40,
                      backgroundColor: `${accentColor}40`,
                      opacity: contentSpring,
                    }}
                  />

                  {/* Event content */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      opacity: contentSpring,
                      transform: `translateY(${contentY}px)`,
                      padding: "16px 12px",
                      borderRadius: 12,
                      background: `${colors.secondary}60`,
                      border: `1px solid ${accentColor}25`,
                      minWidth: 120,
                    }}
                  >
                    <div
                      style={{
                        ...fontMono,
                        fontSize: 28,
                        color: accentColor,
                        fontWeight: 700,
                      }}
                    >
                      {event.year}
                    </div>
                    <div
                      style={{
                        ...fontRegular,
                        fontSize: 20,
                        color: colors.text,
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {event.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
