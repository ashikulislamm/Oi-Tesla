import React from "react";

export interface DataDisplayProps {
  value: string | number;
  unit?: string;
  label?: string;
  caption?: string;
  size?: "sm" | "lg";
  className?: string;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({
  value,
  unit,
  label,
  caption,
  size = "lg",
  className = "",
}) => {
  const sizeStyles = {
    sm: "text-lg sm:text-xl",
    lg: "text-3xl sm:text-4xl",
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <span className="text-xs font-medium text-[var(--ink-muted)] mb-1">
          {label}
        </span>
      )}
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-data font-medium text-[var(--deep-harbor)] tracking-tight ${sizeStyles[size]}`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[var(--ink-muted)]">
            {unit}
          </span>
        )}
      </div>
      {caption && (
        <span className="text-xs text-[var(--ink-muted)] mt-1">{caption}</span>
      )}
    </div>
  );
};
