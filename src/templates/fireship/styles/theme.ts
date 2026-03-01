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
