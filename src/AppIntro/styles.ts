import type { CSSProperties } from "react";

export const COLORS = {
  bg: "#0a0a1a",
  bgCard: "#111128",
  primary: "#00d4ff",
  secondary: "#8b5cf6",
  accent: "#f59e0b",
  green: "#22c55e",
  white: "#ffffff",
  gray: "#9ca3af",
  dimNode: "#1e293b",
  glowCyan: "rgba(0, 212, 255, 0.6)",
  glowPurple: "rgba(139, 92, 246, 0.5)",
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
  fontWeight: 800,
};

export const FONT_REGULAR: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontWeight: 400,
};

export const FONT_MONO: CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  fontWeight: 500,
};

// Labels for the 4 brain regions
export const BRAIN_REGIONS = ["See", "Language", "Type", "Confirm"] as const;

// Diamond layout positions (relative to center, normalized -1 to 1)
export const DIAMOND_POSITIONS = [
  { x: 0, y: -1 }, // top - See
  { x: 1, y: 0 }, // right - Language
  { x: 0, y: 1 }, // bottom - Type
  { x: -1, y: 0 }, // left - Confirm
] as const;
