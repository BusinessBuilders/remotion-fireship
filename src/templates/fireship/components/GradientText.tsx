import type { CSSProperties } from "react";

interface GradientTextProps {
  colors: string[];
  children: React.ReactNode;
  fontSize?: number;
  style?: CSSProperties;
}

export const GradientText: React.FC<GradientTextProps> = ({
  colors,
  children,
  fontSize,
  style,
}) => {
  const gradient =
    colors.length >= 2
      ? `linear-gradient(135deg, ${colors.join(", ")})`
      : colors[0] ?? "#ffffff";

  return (
    <span
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
