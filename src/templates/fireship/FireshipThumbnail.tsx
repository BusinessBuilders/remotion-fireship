import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { FONT_FAMILIES } from "./styles/fonts";
import { buildTextGlow } from "./styles/theme";

export const thumbnailSchema = z.object({
  backgroundImage: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  primaryColor: zColor().default("#FF6B00"),
  accentColor: zColor().default("#00d4ff"),
  backgroundColor: zColor().default("#0a0a1a"),
  textPosition: z.enum(["left", "center", "bottom-left"]).default("bottom-left"),
});

export type ThumbnailProps = z.infer<typeof thumbnailSchema>;

export const FireshipThumbnail: React.FC<ThumbnailProps> = ({
  backgroundImage,
  title,
  subtitle,
  primaryColor,
  accentColor,
  backgroundColor,
  textPosition,
}) => {
  const resolvedImage = backgroundImage.startsWith("http")
    ? backgroundImage
    : staticFile(backgroundImage);

  const isCenter = textPosition === "center";
  const isLeft = textPosition === "left";

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Background image — full bleed */}
      <Img
        src={resolvedImage}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isCenter
            ? `radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)`
            : `linear-gradient(${isLeft ? "90deg" : "0deg"}, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)`,
        }}
      />

      {/* Color accent overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${isCenter ? "center" : "20% 80%"}, ${primaryColor}20 0%, transparent 60%)`,
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          ...(isCenter
            ? { inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }
            : isLeft
              ? { left: 60, top: "50%", transform: "translateY(-50%)", maxWidth: "55%" }
              : { left: 60, bottom: 60, maxWidth: "70%" }),
          zIndex: 2,
        }}
      >
        {/* Accent bar */}
        {!isCenter && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 80,
                height: 6,
                background: primaryColor,
                borderRadius: 3,
                boxShadow: `0 0 20px ${primaryColor}80`,
              }}
            />
            <div
              style={{
                width: 30,
                height: 6,
                background: `${accentColor}60`,
                borderRadius: 3,
              }}
            />
          </div>
        )}

        {/* Title — big bold with glow */}
        <div
          style={{
            fontFamily: `${FONT_FAMILIES.sans}, system-ui, sans-serif`,
            fontWeight: 900,
            fontSize: isCenter ? 96 : 88,
            lineHeight: 1.0,
            letterSpacing: -1,
            color: "white",
            textShadow: buildTextGlow(primaryColor, 1.2),
            textAlign: isCenter ? "center" : "left",
            ...(isCenter ? { maxWidth: "80%" } : {}),
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontFamily: `${FONT_FAMILIES.sans}, system-ui, sans-serif`,
              fontWeight: 700,
              fontSize: isCenter ? 36 : 32,
              color: accentColor,
              marginTop: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              textShadow: `0 2px 12px rgba(0,0,0,0.8)`,
              textAlign: isCenter ? "center" : "left",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Corner accent glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "40%",
          height: "40%",
          background: `radial-gradient(ellipse at bottom left, ${primaryColor}25 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
