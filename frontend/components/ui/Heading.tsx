import React from "react";

export type HeadingLevel = "display" | "1" | "2" | "3";

export interface HeadingProps {
  level?: HeadingLevel;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export const Heading: React.FC<HeadingProps> = ({
  level = "1",
  subtitle,
  children,
  className = "",
  as,
}) => {
  const defaultTagMap: Record<HeadingLevel, React.ElementType> = {
    display: "h1",
    "1": "h1",
    "2": "h2",
    "3": "h3",
  };

  const Component = as || defaultTagMap[level];

  const styleMap: Record<HeadingLevel, string> = {
    display:
      "font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-semibold leading-tight text-[var(--deep-harbor)] tracking-tight",
    "1": "font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-semibold leading-snug text-[var(--deep-harbor)] tracking-tight",
    "2": "font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-semibold leading-snug text-[var(--deep-harbor)]",
    "3": "font-[family-name:var(--font-body)] text-base font-semibold leading-normal text-[var(--deep-harbor)]",
  };

  return (
    <div className="flex flex-col">
      <Component className={`${styleMap[level]} ${className}`}>
        {children}
      </Component>
      {subtitle && (
        <p className="text-sm text-[var(--ink-muted)] mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
