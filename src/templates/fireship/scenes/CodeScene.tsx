import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import type { SectionProps } from "../schema";
import type { ColorMap } from "../styles/theme";
import { SectionTitle } from "../components/SectionTitle";
import { AnimatedCode } from "../components/AnimatedCode";
import { GridBackground } from "../components/GridBackground";

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
      <GridBackground color={colors.primary} opacity={0.04} />

      <div
        style={{
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
        <div style={{ flex: 1, overflow: "hidden" }}>
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
