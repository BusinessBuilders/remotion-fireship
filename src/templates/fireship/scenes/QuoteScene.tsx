import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { QuoteProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { GridBackground } from "../components/GridBackground";
import { GlowOrb } from "../components/GlowOrb";
import { ConstellationBg } from "../components/ConstellationBg";
import { GradientText } from "../components/GradientText";

interface QuoteSceneProps {
  heading: string;
  quote: QuoteProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular?: CSSProperties;
  fontMono: CSSProperties;
}

export const QuoteScene: React.FC<QuoteSceneProps> = ({
  heading,
  quote,
  colors,
  fontBold,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  // Split text into words for staggered reveal
  const words = quote.text.split(" ");

  const quoteMarkSpring = spring({
    fps,
    frame: frame - 5,
    config: { damping: 100, mass: 2 },
  });
  const quoteMarkScale = interpolate(quoteMarkSpring, [0, 1], [4, 1]);

  const authorSpring = spring({
    fps,
    frame: frame - 30 - words.length * 2,
    config: { damping: 200 },
  });
  const authorY = interpolate(authorSpring, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <GridBackground color={colors.primary} opacity={0.03} animated />
      <ConstellationBg
        color={colors.accent}
        nodeCount={15}
        seed={`quote-${heading}`}
        opacity={0.04}
      />
      <GlowOrb
        colors={[colors.primary, colors.accent]}
        count={2}
        seed={`glow-quote-${heading}`}
        intensity={0.04}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: isPortrait ? "60px 50px" : "80px 140px",
          gap: 40,
        }}
      >
        {/* Opening quote mark */}
        <div
          style={{
            ...fontBold,
            fontSize: isPortrait ? 120 : 160,
            lineHeight: 0.6,
            opacity: quoteMarkSpring * 0.3,
            transform: `scale(${quoteMarkScale})`,
            color: colors.primary,
          }}
        >
          &ldquo;
        </div>

        {/* Quote text — word by word reveal */}
        <div
          style={{
            ...fontBold,
            fontSize: isPortrait ? 34 : 48,
            color: colors.text,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: isPortrait ? 900 : 1400,
          }}
        >
          {words.map((word, i) => {
            const wordSpring = spring({
              fps,
              frame: frame - 10 - i * 2,
              config: { damping: 200 },
            });
            return (
              <span
                key={i}
                style={{
                  opacity: wordSpring,
                  display: "inline-block",
                  marginRight: 12,
                  transform: `translateY(${interpolate(wordSpring, [0, 1], [15, 0])}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Attribution */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: authorSpring,
            transform: `translateY(${authorY}px)`,
          }}
        >
          {/* Divider line */}
          <div
            style={{
              width: interpolate(authorSpring, [0, 1], [0, 120]),
              height: 2,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
              marginBottom: 12,
            }}
          />
          <div style={{ ...fontBold, fontSize: 28 }}>
            <GradientText colors={[colors.primary, colors.accent]}>
              {quote.author}
            </GradientText>
          </div>
          {quote.role && (
            <div
              style={{
                ...fontMono,
                fontSize: 20,
                color: colors.muted,
                letterSpacing: 1,
              }}
            >
              {quote.role}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
