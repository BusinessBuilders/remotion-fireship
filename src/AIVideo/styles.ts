import type { CSSProperties } from "react";

export const COLORS = {
  bg: "#0f0f0f",
  bgCard: "#1a1a2e",
  primary: "#00d4ff",
  secondary: "#7c3aed",
  accent: "#ff6b35",
  green: "#22c55e",
  red: "#ef4444",
  white: "#ffffff",
  gray: "#a0a0b0",
  gradientStart: "#00d4ff",
  gradientEnd: "#7c3aed",
};

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

export const FONT_BOLD: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontWeight: 900,
};

export const FONT_REGULAR: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontWeight: 400,
};

export const FONT_MONO: CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontWeight: 500,
};
