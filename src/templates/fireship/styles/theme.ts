import type { CSSProperties } from "react";
import type { StyleProps } from "../schema";

export interface ColorMap {
  bg: string;
  primary: string;
  accent: string;
  secondary: string;
  text: string;
  muted: string;
}

export const DEFAULT_COLORS: ColorMap = {
  bg: "#0a0a0a",
  primary: "#FF6B00",
  accent: "#00d4ff",
  secondary: "#1a1a2e",
  text: "#ffffff",
  muted: "#a0a0b0",
};

export const buildColors = (style: StyleProps): ColorMap => ({
  bg: style.backgroundColor,
  primary: style.primaryColor,
  accent: style.accentColor,
  secondary: style.secondaryColor,
  text: style.textColor,
  muted: style.mutedColor,
});

export const centered: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
};

export const column: CSSProperties = {
  ...centered,
  flexDirection: "column",
};

export const buildFontBold = (family: string): CSSProperties => ({
  fontFamily: `${family}, system-ui, sans-serif`,
  fontWeight: 900,
});

export const buildFontRegular = (family: string): CSSProperties => ({
  fontFamily: `${family}, system-ui, sans-serif`,
  fontWeight: 400,
});

export const buildFontMono = (codeFamily: string): CSSProperties => ({
  fontFamily: `'${codeFamily}', 'SF Mono', 'Fira Code', monospace`,
  fontWeight: 500,
});

/**
 * Triple-layer bloom text glow.
 * intensity multiplier scales alpha channels (default 1.0).
 */
export const buildTextGlow = (color: string, intensity = 1.0): string => {
  const a1 = Math.round(0x60 * intensity).toString(16).padStart(2, '0');
  const a2 = Math.round(0x30 * intensity).toString(16).padStart(2, '0');
  const a3 = Math.round(0x10 * intensity).toString(16).padStart(2, '0');
  return `0 0 50px ${color}${a1}, 0 0 100px ${color}${a2}, 0 0 150px ${color}${a3}`;
};

/** Glass card box-shadow with color-tinted glow + drop shadow. */
export const buildCardGlow = (color: string): string =>
  `0 0 30px ${color}25, 0 6px 20px rgba(0,0,0,0.5)`;

const EVENT_PALETTE = ['#ec4899', '#f59e0b', '#22d3ee', '#8b5cf6', '#10b981'];

/** Per-element color array for timelines, diagrams, bullets. */
export const buildEventColors = (
  primary: string,
  accent: string,
  count: number,
): string[] => {
  const base = [primary, accent, ...EVENT_PALETTE];
  return Array.from({ length: count }, (_, i) => base[i % base.length]);
};
