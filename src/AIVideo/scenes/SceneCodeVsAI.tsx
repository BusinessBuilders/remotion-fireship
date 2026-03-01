import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_BOLD, FONT_MONO } from "../styles";

const CodeBlock = ({
  code,
  opacity,
  x,
}: {
  code: string;
  opacity: number;
  x: number;
}) => (
  <div
    style={{
      opacity,
      transform: `translateX(${x}px)`,
      backgroundColor: "#1e1e2e",
      borderRadius: 16,
      padding: "30px 40px",
      border: `1px solid ${COLORS.primary}33`,
      width: 750,
    }}
  >
    {/* Window dots */}
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#ff5f57",
        }}
      />
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#ffbd2e",
        }}
      />
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#28c840",
        }}
      />
    </div>
    <pre
      style={{
        ...FONT_MONO,
        fontSize: 24,
        color: "#a6e3a1",
        margin: 0,
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}
    >
      {code}
    </pre>
  </div>
);

export const SceneCodeVsAI = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ fps, frame, config: { damping: 200 } });
  const leftSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 200 },
  });
  const rightSpring = spring({
    fps,
    frame: frame - 40,
    config: { damping: 200 },
  });
  const vsSpring = spring({
    fps,
    frame: frame - 30,
    config: { damping: 100, mass: 2 },
  });

  const headerY = interpolate(headerSpring, [0, 1], [-60, 0]);

  const humanCode = `function sortArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}
// 15 minutes of typing...`;

  const aiCode = `// Prompt: "sort this array efficiently"

const sorted = arr.toSorted((a, b) => a - b);

// Generated in 0.3 seconds
// With tests, types, and edge cases`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div
        style={{
          ...FONT_BOLD,
          fontSize: 64,
          color: COLORS.white,
          textAlign: "center",
          marginTop: 60,
          opacity: headerSpring,
          transform: `translateY(${headerY}px)`,
        }}
      >
        Human vs AI Agent
      </div>

      {/* Side by side */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
          marginTop: 60,
          height: "70%",
        }}
      >
        {/* Human side */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              ...FONT_BOLD,
              fontSize: 32,
              color: COLORS.red,
              marginBottom: 20,
              opacity: leftSpring,
            }}
          >
            Manual Coding
          </div>
          <CodeBlock
            code={humanCode}
            opacity={leftSpring}
            x={interpolate(leftSpring, [0, 1], [-100, 0])}
          />
          <div
            style={{
              ...FONT_MONO,
              fontSize: 28,
              color: COLORS.gray,
              marginTop: 15,
              opacity: leftSpring,
            }}
          >
            ~15 min
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            ...FONT_BOLD,
            fontSize: 72,
            opacity: vsSpring,
            transform: `scale(${interpolate(vsSpring, [0, 1], [3, 1])})`,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          VS
        </div>

        {/* AI side */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              ...FONT_BOLD,
              fontSize: 32,
              color: COLORS.green,
              marginBottom: 20,
              opacity: rightSpring,
            }}
          >
            AI Agent
          </div>
          <CodeBlock
            code={aiCode}
            opacity={rightSpring}
            x={interpolate(rightSpring, [0, 1], [100, 0])}
          />
          <div
            style={{
              ...FONT_MONO,
              fontSize: 28,
              color: COLORS.green,
              marginTop: 15,
              opacity: rightSpring,
            }}
          >
            ~0.3 sec
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
