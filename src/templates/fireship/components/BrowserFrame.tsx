import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface BrowserFrameProps {
  src: string;
  url?: string;
  borderColor?: string;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  src,
  url = "https://example.com",
  borderColor = "#333",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ken Burns: subtle zoom 1.0 → 1.05
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  const resolvedSrc = src.startsWith("http") ? src : staticFile(src);

  return (
    <div
      style={{
        backgroundColor: "#1e1e2e",
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${borderColor}`,
        width: "100%",
      }}
    >
      {/* Chrome top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          gap: 10,
          backgroundColor: "#2a2a3e",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#FF5E57",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#FFBC30",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#29C93F",
            }}
          />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1a1a2e",
            borderRadius: 6,
            padding: "6px 14px",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            color: "#888",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {url}
        </div>
      </div>

      {/* Content area */}
      <div style={{ overflow: "hidden" }}>
        <Img
          src={resolvedSrc}
          style={{
            width: "100%",
            display: "block",
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </div>
    </div>
  );
};
