import React from "react";

export interface SeatBadgeProps {
  taken: number;
  capacity: number;
  className?: string;
}

export const SeatBadge: React.FC<SeatBadgeProps> = ({
  taken,
  capacity,
  className = "",
}) => {
  const isFull = taken >= capacity;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[var(--line)] bg-transparent rounded-full text-[var(--ink)] font-medium ${
        isFull ? "border-[var(--status-error)]/50 text-[var(--status-error)]" : ""
      } ${className}`}
    >
      <span className="font-data font-semibold">
        {taken}/{capacity}
      </span>
      <span>seats</span>
    </span>
  );
};
