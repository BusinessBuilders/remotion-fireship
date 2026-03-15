import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";

import type { TransitionPresentation } from "@remotion/transitions";
import type { FireshipProps } from "./schema";
import { TIMING, getSectionStartFrames } from "./schema";
import { buildColors, buildFontBold, buildFontRegular, buildFontMono } from "./styles/theme";
import { FONT_FAMILIES } from "./styles/fonts";

import { ProgressBar } from "./components/ProgressBar";
import { glitch } from "./components/GlitchTransition";
import { LightLeak } from "./components/LightLeak";

import { IntroScene } from "./scenes/IntroScene";
import { ContentScene } from "./scenes/ContentScene";
import { CodeScene } from "./scenes/CodeScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { DiagramScene } from "./scenes/DiagramScene";
import { StatsScene } from "./scenes/StatsScene";
import { QuoteScene } from "./scenes/QuoteScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { OutroScene } from "./scenes/OutroScene";

const { INTRO_SECONDS, OUTRO_SECONDS, TRANSITION_FRAMES, FPS } = TIMING;

type AnyPresentation = TransitionPresentation<Record<string, unknown>>;

const getPresentation = (
  transition: string,
  width: number,
  height: number,
): AnyPresentation => {
  switch (transition) {
    case "slide":
      return slide({ direction: "from-right" }) as AnyPresentation;
    case "wipe":
      return wipe() as AnyPresentation;
    case "glitch":
      return glitch() as unknown as AnyPresentation;
    case "zoom":
      return slide({ direction: "from-bottom" }) as AnyPresentation;
    case "clockWipe":
      return clockWipe({ width, height }) as unknown as AnyPresentation;
    case "flip":
      return flip() as unknown as AnyPresentation;
    case "iris":
      return iris({ width, height }) as unknown as AnyPresentation;
    case "fade":
    default:
      return fade() as AnyPresentation;
  }
};

export const Fireship: React.FC<FireshipProps> = (props) => {
  const {
    title,
    subtitle,
    topic,
    topicLogo,
    sections,
    backgroundMusic,
    backgroundMusicVolume,
    voiceoverAudio,
    style,
    watermark,
    lightLeaks,
  } = props;

  const { width, height } = useVideoConfig();

  const colors = buildColors(style);
  const fontBold = buildFontBold(FONT_FAMILIES.sans);
  const fontRegular = buildFontRegular(FONT_FAMILIES.sans);
  const fontMono = buildFontMono(FONT_FAMILIES.mono);

  const introFrames = INTRO_SECONDS * FPS;
  const outroFrames = OUTRO_SECONDS * FPS;
  const sectionStartFrames = getSectionStartFrames(sections, FPS);

  const renderScene = (section: typeof sections[number], index: number) => {
    if (section.stats) {
      return (
        <StatsScene
          key={index}
          heading={section.heading}
          stats={section.stats}
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
          fontMono={fontMono}
        />
      );
    }

    if (section.quote) {
      return (
        <QuoteScene
          key={index}
          heading={section.heading}
          quote={section.quote}
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
          fontMono={fontMono}
        />
      );
    }

    if (section.timeline) {
      return (
        <TimelineScene
          key={index}
          heading={section.heading}
          timeline={section.timeline}
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
          fontMono={fontMono}
        />
      );
    }

    if (section.diagram) {
      return (
        <DiagramScene
          key={index}
          section={section}
          diagram={section.diagram}
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
          fontMono={fontMono}
        />
      );
    }

    if (section.comparison) {
      return (
        <ComparisonScene
          key={index}
          heading={section.heading}
          comparison={section.comparison}
          colors={colors}
          fontBold={fontBold}
          fontRegular={fontRegular}
        />
      );
    }

    if (section.codeSnippet && !section.image) {
      return (
        <CodeScene
          key={index}
          section={section}
          colors={colors}
          fontBold={fontBold}
          fontMono={fontMono}
        />
      );
    }

    return (
      <ContentScene
        key={index}
        section={section}
        colors={colors}
        fontBold={fontBold}
        fontRegular={fontRegular}
        fontMono={fontMono}
      />
    );
  };

  // Calculate light leak positions: every 2-3 transitions, alternating
  const lightLeakIndices = new Set<number>();
  if (lightLeaks) {
    for (let i = 0; i < sections.length; i += 3) {
      lightLeakIndices.add(i);
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <TransitionSeries>
        {/* Intro */}
        <TransitionSeries.Sequence durationInFrames={introFrames}>
          <IntroScene
            title={title}
            subtitle={subtitle}
            topicLogo={topicLogo}
            colors={colors}
            fontBold={fontBold}
            fontMono={fontMono}
          />
        </TransitionSeries.Sequence>

        {/* Sections */}
        {sections.map((section, i) => {
          const sectionFrames = (section.duration ?? 5) * FPS;
          return [
            <TransitionSeries.Transition
              key={`t-${i}`}
              presentation={getPresentation(section.transition, width, height)}
              timing={springTiming({
                config: { damping: 200 },
                durationInFrames: TRANSITION_FRAMES,
              })}
            />,
            <TransitionSeries.Sequence
              key={`s-${i}`}
              durationInFrames={sectionFrames}
            >
              {renderScene(section, i)}
            </TransitionSeries.Sequence>,
          ];
        })}

        {/* Outro transition + scene */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION_FRAMES,
          })}
        />
        <TransitionSeries.Sequence durationInFrames={outroFrames}>
          <OutroScene
            title={title}
            topic={topic}
            colors={colors}
            fontBold={fontBold}
            fontMono={fontMono}
            watermark={watermark}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Light Leak overlays — placed over select transitions */}
      {lightLeaks &&
        [...lightLeakIndices].map((i) => {
          const startFrame = sectionStartFrames[i + 1] ?? 0;
          const leakDuration = TRANSITION_FRAMES + 30;
          return (
            <Sequence
              key={`ll-${i}`}
              from={Math.max(0, startFrame - 10)}
              durationInFrames={leakDuration}
            >
              <LightLeak
                color1={colors.primary}
                color2={colors.accent}
                seed={`leak-${i}`}
                intensity={0.4}
              />
            </Sequence>
          );
        })}

      {/* Overlay: ProgressBar */}
      <ProgressBar
        color={colors.primary}
        sectionStartFrames={sectionStartFrames}
      />

      {/* Background music */}
      {backgroundMusic && (
        <Audio
          src={
            backgroundMusic.startsWith("http")
              ? backgroundMusic
              : staticFile(backgroundMusic)
          }
          volume={backgroundMusicVolume}
          loop
        />
      )}

      {/* Voiceover */}
      {voiceoverAudio && (
        <Audio
          src={
            voiceoverAudio.startsWith("http")
              ? voiceoverAudio
              : staticFile(voiceoverAudio)
          }
        />
      )}

      {/* Watermark */}
      {watermark && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            ...fontMono,
            fontSize: 16,
            color: `${colors.muted}66`,
          }}
        >
          {watermark}
        </div>
      )}
    </AbsoluteFill>
  );
};
