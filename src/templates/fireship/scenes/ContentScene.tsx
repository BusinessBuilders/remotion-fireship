import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SectionProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { SectionTitle } from "../components/SectionTitle";
import { AnimatedCode } from "../components/AnimatedCode";
import { BrowserFrame } from "../components/BrowserFrame";
import { GridBackground } from "../components/GridBackground";
import { ParticleBackground } from "../components/ParticleBackground";
import { GlowOrb } from "../components/GlowOrb";
import { FloatingCode } from "../components/FloatingCode";
import { useAnimatedText } from "../hooks/useAnimatedText";

interface ContentSceneProps {
  section: SectionProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontRegular: CSSProperties;
  fontMono: CSSProperties;
}

export const ContentScene: React.FC<ContentSceneProps> = ({
  section,
  colors,
  fontBold,
  fontRegular,
  fontMono,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;
  const animatedBody = useAnimatedText(section.body, {
    startFrame: 20,
    speed: 1.5,
  });

  const { codeSnippet, image, bulletPoints } = section;
  const hasBullets = !!bulletPoints?.length;

  // Split layout: code + text side by side
  if (codeSnippet && section.body) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.bg }}>
        <GridBackground color={colors.primary} opacity={0.03} animated />
        <ParticleBackground colors={[colors.primary, colors.accent]} count={10} seed={`content-code-${section.heading}`} opacity={0.2} />
        <GlowOrb colors={[colors.primary, colors.accent]} count={2} seed={`glow-cc-${section.heading}`} intensity={0.05} />
        <FloatingCode color={colors.accent} seed={`float-cc-${section.heading}`} opacity={0.04} />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: isPortrait ? "column" : "row",
            height: "100%",
            padding: isPortrait ? 40 : 60,
            gap: isPortrait ? 24 : 40,
          }}
        >
          {/* Code panel */}
          <div style={{ flex: isPortrait ? "none" : "0 0 55%", display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionTitle
              title={section.heading}
              accentColor={colors.primary}
              textColor={colors.text}
              fontStyle={fontBold}
              monoStyle={fontMono}
            />
            <AnimatedCode
              code={codeSnippet.code}
              language={codeSnippet.language}
              filename={codeSnippet.filename}
              highlightLines={codeSnippet.highlightLines}
            />
          </div>

          {/* Text panel */}
          <div
            style={{
              flex: isPortrait ? "none" : "0 0 40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                ...fontRegular,
                fontSize: isPortrait ? 22 : 28,
                color: colors.muted,
                lineHeight: 1.6,
              }}
            >
              {animatedBody}
            </div>
            {hasBullets && bulletPoints && (
              <BulletList
                items={bulletPoints}
                frame={frame}
                fps={fps}
                colors={colors}
                fontRegular={fontRegular}
              />
            )}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Image layout: title top, browser frame center, text below
  if (image) {
    const resolvedImage = image.startsWith("http") ? image : staticFile(image);
    return (
      <AbsoluteFill style={{ backgroundColor: colors.bg }}>
        <GridBackground color={colors.primary} opacity={0.03} animated />
        <ParticleBackground colors={[colors.primary, colors.accent]} count={8} seed={`content-img-${section.heading}`} opacity={0.15} />
        <GlowOrb colors={[colors.primary, colors.accent]} count={2} seed={`glow-ci-${section.heading}`} intensity={0.04} />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: isPortrait ? "40px 50px" : "50px 80px",
            gap: 30,
          }}
        >
          <SectionTitle
            title={section.heading}
            accentColor={colors.primary}
            textColor={colors.text}
            fontStyle={fontBold}
            monoStyle={fontMono}
          />
          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            {section.imageFrame === "browser" ? (
              <BrowserFrame
                src={image}
                borderColor={colors.secondary}
              />
            ) : (
              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: `0 0 120px ${colors.primary}40, 0 0 60px ${colors.accent}20, 0 12px 48px rgba(0,0,0,0.8)`,
                  border: `2px solid ${colors.primary}35`,
                  opacity: spring({ fps, frame, config: { damping: 200 } }),
                  transform: `scale(${interpolate(spring({ fps, frame, config: { damping: 200 } }), [0, 1], [0.88, 1])})`,
                }}
              >
                <Img
                  src={resolvedImage}
                  style={{ maxHeight: isPortrait ? 500 : 750, maxWidth: isPortrait ? 900 : 1400, objectFit: "contain", display: "block" }}
                />
              </div>
            )}
          </div>
          {section.body && (
            <div
              style={{
                ...fontRegular,
                fontSize: 26,
                color: colors.muted,
                textAlign: "center",
              }}
            >
              {animatedBody}
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // Text-focused with staggered bullets
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <GridBackground color={colors.primary} opacity={0.03} animated />
      <ParticleBackground colors={[colors.primary, colors.accent]} count={10} seed={`content-txt-${section.heading}`} opacity={0.2} />
      <GlowOrb colors={[colors.primary, colors.accent]} count={2} seed={`glow-ct-${section.heading}`} intensity={0.05} />
      <FloatingCode color={colors.accent} seed={`float-ct-${section.heading}`} opacity={0.04} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: isPortrait ? "50px 50px" : "80px 120px",
          gap: isPortrait ? 24 : 40,
        }}
      >
        <SectionTitle
          title={section.heading}
          accentColor={colors.primary}
          textColor={colors.text}
          fontStyle={fontBold}
          monoStyle={fontMono}
        />
        {section.body && (
          <div
            style={{
              ...fontRegular,
              fontSize: isPortrait ? 24 : 32,
              color: colors.muted,
              lineHeight: 1.6,
            }}
          >
            {animatedBody}
          </div>
        )}
        {hasBullets && bulletPoints && (
          <BulletList
            items={bulletPoints}
            frame={frame}
            fps={fps}
            colors={colors}
            fontRegular={fontRegular}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

// Staggered bullet list sub-component
const BulletList: React.FC<{
  items: string[];
  frame: number;
  fps: number;
  colors: ColorMap;
  fontRegular: CSSProperties;
}> = ({ items, frame, fps, colors, fontRegular }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((item, i) => {
        const itemSpring = spring({
          fps,
          frame: frame - 30 - i * 8,
          config: { damping: 200 },
        });
        const itemX = interpolate(itemSpring, [0, 1], [30, 0]);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              opacity: itemSpring,
              transform: `translateX(${itemX}px)`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
                marginTop: 10,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                ...fontRegular,
                fontSize: 26,
                color: colors.text,
                lineHeight: 1.5,
              }}
            >
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
};
