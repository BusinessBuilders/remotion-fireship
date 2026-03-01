import { useMemo } from "react";
import { Highlight } from "prism-react-renderer";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as oneDarkTheme } from "../../../Video/components/oneDark";

interface AnimatedCodeProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  staggerFrames?: number;
  fontSize?: number;
}

export const AnimatedCode: React.FC<AnimatedCodeProps> = ({
  code,
  language = "typescript",
  filename,
  highlightLines = [],
  staggerFrames = 3,
  fontSize = 22,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlightSet = useMemo(
    () => new Set(highlightLines),
    [highlightLines],
  );

  return (
    <div
      style={{
        backgroundColor: oneDarkTheme.plain.backgroundColor,
        borderRadius: 16,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Title bar with traffic light dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          borderBottom: "1px solid #383c44",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#FF5E57",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#FFBC30",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#29C93F",
          }}
        />
        {filename && (
          <div
            style={{
              marginLeft: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: "#abb2bf",
              opacity: 0.7,
            }}
          >
            {filename}
          </div>
        )}
      </div>

      {/* Code content */}
      <div style={{ padding: "16px 20px", overflow: "hidden" }}>
        <Highlight code={code} language={language} theme={oneDarkTheme}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...oneDarkTheme.plain,
                fontSize,
                fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                margin: 0,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {tokens.map((line, lineIndex) => {
                const lineSpring = spring({
                  fps,
                  frame: frame - lineIndex * staggerFrames,
                  config: { damping: 200 },
                });

                const isHighlighted = highlightSet.has(lineIndex + 1);
                const highlightPulse = isHighlighted
                  ? Math.sin(frame * 0.08) * 0.15 + 0.15
                  : 0;

                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={lineIndex}
                    {...lineProps}
                    style={{
                      ...lineProps.style,
                      opacity: lineSpring,
                      transform: `translateX(${(1 - lineSpring) * 20}px)`,
                      display: "flex",
                      backgroundColor: isHighlighted
                        ? `rgba(255, 255, 255, ${highlightPulse})`
                        : undefined,
                      borderRadius: isHighlighted ? 4 : undefined,
                      padding: isHighlighted ? "0 4px" : undefined,
                    }}
                  >
                    {/* Line number */}
                    <span
                      style={{
                        width: 40,
                        textAlign: "right",
                        marginRight: 16,
                        color: "#5c6370",
                        userSelect: "none",
                        flexShrink: 0,
                      }}
                    >
                      {lineIndex + 1}
                    </span>
                    <span>
                      {line.map((token, tokenIndex) => {
                        const tokenProps = getTokenProps({ token });
                        return <span key={tokenIndex} {...tokenProps} />;
                      })}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};
