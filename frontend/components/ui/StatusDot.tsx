import React from "react";

export type StatusType = "success" | "warning" | "error" | "info";

export interface StatusDotProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  label,
  pulse = false,
  className = "",
}) => {
  const colorMap: Record<StatusType, string> = {
    success: "bg-[var(--status-success)]",
    warning: "bg-[var(--status-warning)]",
    error: "bg-[var(--status-error)]",
    info: "bg-[var(--deep-harbor)]",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorMap[status]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${colorMap[status]}`}
        />
      </span>
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
    </div>
  );
};
