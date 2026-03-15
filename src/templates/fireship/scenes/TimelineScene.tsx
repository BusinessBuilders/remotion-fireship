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
import { buildCardGlow, buildEventColors } from "../styles/theme";
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

const isLightColor = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
};

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  heading,
  timeline,
  colors,
  fontBold,
  fontRegular,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;
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

      {/* Layered background blobs */}
      <div style={{ position: "absolute", width: "130%", height: "130%", top: "-30%", left: "-15%", background: `radial-gradient(ellipse at center, ${colors.primary}0a 0%, transparent 55%)`, borderRadius: "50%", pointerEvents: "none" as const }} />
      <div style={{ position: "absolute", width: "80%", height: "80%", bottom: "-20%", right: "-10%", background: `radial-gradient(ellipse at center, ${colors.accent}08 0%, transparent 50%)`, borderRadius: "50%", pointerEvents: "none" as const }} />
      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "10%", background: "linear-gradient(to top, rgba(10,10,26,0.5), transparent)", pointerEvents: "none" as const, zIndex: 2 }} />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: isPortrait ? "40px 40px" : "60px 80px",
          gap: isPortrait ? 20 : 40,
        }}
      >
        <SectionTitle
          title={heading}
          accentColor={colors.primary}
          primaryColor={colors.primary}
          textColor={colors.text}
          fontStyle={fontBold}
          monoStyle={fontMono}
        />

        {isPortrait ? (
          <VerticalTimeline
            events={events}
            colors={colors}
            fontRegular={fontRegular}
            fontMono={fontMono}
            frame={frame}
            fps={fps}
          />
        ) : (
          <HorizontalTimeline
            events={events}
            colors={colors}
            fontRegular={fontRegular}
            fontMono={fontMono}
            frame={frame}
            fps={fps}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

// --- Horizontal (landscape) — Infographic Zigzag ---
const HorizontalTimeline: React.FC<{
  events: { year: string; label: string }[];
  colors: ColorMap;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
  frame: number;
  fps: number;
}> = ({ events, colors, fontRegular, fontMono, frame, fps }) => {
  const eventColors = buildEventColors(colors.primary, colors.accent, events.length);

  // Bar draw-in spring
  const barSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Top row: even-indexed events (0, 2, 4) with stems pointing down */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 8,
          padding: "0 2%",
        }}
      >
        {events.map((event, i) => {
          if (i % 2 !== 0) {
            return (
              <div
                key={i}
                style={{ width: `${90 / events.length}%` }}
              />
            );
          }

          const eventColor = eventColors[i];
          const delay = 20 + i * 10;
          const cardSpring = spring({
            fps,
            frame: frame - delay,
            config: { damping: 200 },
          });
          const cardY = interpolate(cardSpring, [0, 1], [-20, 0]);

          return (
            <div
              key={i}
              style={{
                width: `${90 / events.length}%`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: cardSpring,
                transform: `translateY(${cardY}px)`,
              }}
            >
              {/* Card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${eventColor}1f, ${colors.bg}cc)`,
                  border: `2px solid ${eventColor}66`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  width: "100%",
                  boxShadow: buildCardGlow(eventColor),
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 22,
                    color: eventColor,
                    marginBottom: 4,
                  }}
                >
                  {event.label.split(" ").slice(0, 3).join(" ")}
                </div>
                <div
                  style={{
                    ...fontRegular,
                    fontSize: 18,
                    color: colors.text,
                    lineHeight: 1.5,
                  }}
                >
                  {event.label}
                </div>
              </div>
              {/* Connector stem down */}
              <div
                style={{
                  width: 3,
                  height: 22,
                  background: `linear-gradient(180deg, ${eventColor}80, ${eventColor}10)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Timeline bar with year badges */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: 50,
        }}
      >
        {/* Gradient bar */}
        <div
          style={{
            position: "absolute",
            left: "2%",
            right: `${(1 - barSpring) * 98 + 2}%`,
            height: 6,
            top: 22,
            background: `linear-gradient(90deg, ${eventColors.join(", ")})`,
            borderRadius: 4,
            boxShadow: `0 0 16px ${colors.primary}40, 0 0 32px ${colors.primary}15`,
          }}
        />
        {/* Year pill badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {events.map((event, i) => {
            const badgeDelay = 15 + i * 8;
            const badgeSpring = spring({
              fps,
              frame: frame - badgeDelay,
              config: { damping: 100, mass: 1.2 },
            });

            return (
              <div
                key={i}
                style={{
                  background: eventColors[i],
                  color: isLightColor(eventColors[i])
                    ? colors.bg
                    : colors.text,
                  fontWeight: 800,
                  fontSize: 28,
                  padding: "6px 18px",
                  borderRadius: 8,
                  boxShadow: `0 0 16px ${eventColors[i]}99, 0 4px 12px rgba(0,0,0,0.4)`,
                  ...fontMono,
                  letterSpacing: 2,
                  opacity: badgeSpring,
                  transform: `scale(${interpolate(badgeSpring, [0, 1], [0.6, 1])})`,
                }}
              >
                {event.year}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom row: odd-indexed events (1, 3) with stems pointing up */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 8,
          padding: "0 2%",
        }}
      >
        {events.map((event, i) => {
          if (i % 2 !== 1) {
            return (
              <div
                key={i}
                style={{ width: `${90 / events.length}%` }}
              />
            );
          }

          const eventColor = eventColors[i];
          const delay = 20 + i * 10;
          const cardSpring = spring({
            fps,
            frame: frame - delay,
            config: { damping: 200 },
          });
          const cardY = interpolate(cardSpring, [0, 1], [20, 0]);

          return (
            <div
              key={i}
              style={{
                width: `${90 / events.length}%`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: cardSpring,
                transform: `translateY(${cardY}px)`,
              }}
            >
              {/* Connector stem up */}
              <div
                style={{
                  width: 3,
                  height: 22,
                  background: `linear-gradient(0deg, ${eventColor}80, ${eventColor}10)`,
                }}
              />
              {/* Card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${eventColor}1f, ${colors.bg}cc)`,
                  border: `2px solid ${eventColor}66`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  width: "100%",
                  boxShadow: buildCardGlow(eventColor),
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 22,
                    color: eventColor,
                    marginBottom: 4,
                  }}
                >
                  {event.label.split(" ").slice(0, 3).join(" ")}
                </div>
                <div
                  style={{
                    ...fontRegular,
                    fontSize: 18,
                    color: colors.text,
                    lineHeight: 1.5,
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
  );
};

// --- Vertical (portrait / TikTok) ---
const VerticalTimeline: React.FC<{
  events: { year: string; label: string }[];
  colors: ColorMap;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
  frame: number;
  fps: number;
}> = ({ events, colors, fontRegular, fontMono, frame, fps }) => {
  const eventColors = buildEventColors(colors.primary, colors.accent, events.length);

  // Vertical bar draw-in
  const barSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      {/* Vertical progress bar */}
      <div style={{ position: "relative", width: 40, marginRight: 24 }}>
        {/* Gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 17,
            width: 6,
            height: `${barSpring * 100}%`,
            background: `linear-gradient(180deg, ${eventColors.join(", ")})`,
            borderRadius: 4,
            boxShadow: `0 0 16px ${colors.primary}40, 0 0 32px ${colors.primary}15`,
          }}
        />

        {/* Year badges on the bar */}
        {events.map((event, i) => {
          const delay = 15 + i * 8;
          const badgeSpring = spring({
            fps,
            frame: frame - delay,
            config: { damping: 100, mass: 1.2 },
          });
          const topPos =
            events.length > 1
              ? `${(i / (events.length - 1)) * 100}%`
              : "50%";

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: topPos,
                left: -18,
                transform: `translateY(-50%) scale(${interpolate(badgeSpring, [0, 1], [0.6, 1])})`,
                background: eventColors[i],
                color: isLightColor(eventColors[i])
                  ? colors.bg
                  : colors.text,
                ...fontMono,
                fontWeight: 800,
                fontSize: 26,
                padding: "4px 14px",
                borderRadius: 8,
                boxShadow: `0 0 16px ${eventColors[i]}99, 0 4px 12px rgba(0,0,0,0.4)`,
                letterSpacing: 2,
                opacity: badgeSpring,
                zIndex: 1,
                whiteSpace: "nowrap" as const,
              }}
            >
              {event.year}
            </div>
          );
        })}
      </div>

      {/* Event cards */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {events.map((event, i) => {
          const eventColor = eventColors[i];
          const delay = 20 + i * 10;
          const cardSpring = spring({
            fps,
            frame: frame - delay - 5,
            config: { damping: 200 },
          });
          const cardX = interpolate(cardSpring, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                opacity: cardSpring,
                transform: `translateX(${cardX}px)`,
                background: `linear-gradient(135deg, ${eventColor}1f, ${colors.bg}cc)`,
                border: `2px solid ${eventColor}66`,
                borderRadius: 14,
                padding: "16px 18px",
                boxShadow: buildCardGlow(eventColor),
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: eventColor,
                  marginBottom: 4,
                }}
              >
                {event.label.split(" ").slice(0, 3).join(" ")}
              </div>
              <div
                style={{
                  ...fontRegular,
                  fontSize: 20,
                  color: colors.text,
                  lineHeight: 1.5,
                }}
              >
                {event.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
