import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import type { SectionProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { SectionTitle } from "../components/SectionTitle";
import { AnimatedCode } from "../components/AnimatedCode";
import { GridBackground } from "../components/GridBackground";
import { ParticleBackground } from "../components/ParticleBackground";
import { GlowOrb } from "../components/GlowOrb";

interface CodeSceneProps {
  section: SectionProps;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontMono: CSSProperties;
}

export const CodeScene: React.FC<CodeSceneProps> = ({
  section,
  colors,
  fontBold,
  fontMono,
}) => {
  const snippet = section.codeSnippet;
  if (!snippet) {
    return <AbsoluteFill style={{ backgroundColor: colors.bg }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <GridBackground color={colors.primary} opacity={0.05} animated />
      <ParticleBackground colors={[colors.primary, colors.accent]} count={8} seed={`code-${section.heading}`} opacity={0.15} />
      <GlowOrb colors={[colors.primary, colors.accent]} count={2} seed={`glow-code-${section.heading}`} intensity={0.05} />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 100px",
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
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            borderRadius: 12,
            boxShadow: `0 0 40px ${colors.primary}25, 0 0 80px ${colors.primary}10`,
          }}
        >
          <AnimatedCode
            code={snippet.code}
            language={snippet.language}
            filename={snippet.filename}
            highlightLines={snippet.highlightLines}
            fontSize={24}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
