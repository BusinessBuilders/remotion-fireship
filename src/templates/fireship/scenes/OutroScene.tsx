import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ColorMap } from "../styles/theme";
import { ParticleBackground } from "../components/ParticleBackground";
import { GradientText } from "../components/GradientText";

interface OutroSceneProps {
  title: string;
  topic: string;
  colors: ColorMap;
  fontBold: CSSProperties;
  fontMono: CSSProperties;
  watermark?: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  title,
  topic,
  colors,
  fontBold,
  fontMono,
  watermark,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainSpring = spring({ fps, frame, config: { damping: 200 } });
  const taglineSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 200 },
  });
  const ctaSpring = spring({
    fps,
    frame: frame - 45,
    config: { damping: 100, mass: 2 },
  });
  const bottomSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 200 },
  });

  const scale = interpolate(mainSpring, [0, 1], [0.8, 1]);
  const glowPulse = Math.sin(frame * 0.08) * 0.5 + 0.5;
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <ParticleBackground
        colors={[colors.primary, colors.accent]}
        seed="outro"
        count={12}
        opacity={0.3}
      />

      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}15 0%, transparent 60%)`,
          opacity: glowPulse,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Main message */}
        <div
          style={{
            ...fontBold,
            fontSize: 90,
            color: colors.text,
            textAlign: "center",
            opacity: mainSpring,
            transform: `scale(${scale})`,
            lineHeight: 1.2,
          }}
        >
          {title}
          <br />
          <GradientText colors={[colors.primary, colors.accent]} fontSize={90}>
            in 100 Seconds
          </GradientText>
        </div>

        {/* Tagline */}
        <div
          style={{
            ...fontMono,
            fontSize: 30,
            color: colors.muted,
            marginTop: 30,
            opacity: taglineSpring,
            textAlign: "center",
          }}
        >
          Like & Subscribe for more {topic} content
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 60,
            opacity: ctaSpring,
            transform: `scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              ...fontBold,
              fontSize: 36,
              color: colors.text,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              padding: "20px 60px",
              borderRadius: 16,
              boxShadow: `0 0 ${glowPulse * 40}px ${colors.primary}50`,
            }}
          >
            Subscribe
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            gap: 40,
            opacity: bottomSpring,
          }}
        >
          {watermark && (
            <>
              <div
                style={{ ...fontMono, fontSize: 20, color: colors.muted }}
              >
                {watermark}
              </div>
              <div
                style={{ ...fontMono, fontSize: 20, color: colors.primary }}
              >
                |
              </div>
            </>
          )}
          <div style={{ ...fontMono, fontSize: 20, color: colors.muted }}>
            Made with Remotion
          </div>
          <div style={{ ...fontMono, fontSize: 20, color: colors.primary }}>
            |
          </div>
          <div style={{ ...fontMono, fontSize: 20, color: colors.muted }}>
            Links in Description
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
