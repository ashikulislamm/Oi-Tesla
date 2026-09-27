import React from "react";

export type CardSurface = "canvas" | "raised";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: CardSurface;
  padding?: CardPadding;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  surface = "raised",
  padding = "md",
  interactive = false,
  children,
  className = "",
  ...props
}) => {
  const surfaceStyles: Record<CardSurface, string> = {
    canvas: "bg-[var(--mist-sage)]",
    raised: "bg-[var(--surface-raised)]",
  };

  const paddingStyles: Record<CardPadding, string> = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const interactiveStyles = interactive
    ? "transition-all hover:border-[var(--deep-harbor)]/40 cursor-pointer"
    : "";

  return (
    <div
      className={`border border-[var(--line)] rounded-[var(--radius-container)] ${surfaceStyles[surface]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
