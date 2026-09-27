import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = "",
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const borderStyle = error
    ? "border-[var(--status-error)] focus-visible:ring-[var(--status-error)]"
    : "border-[var(--line)] focus-visible:ring-[var(--deep-harbor)]";

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--ink)] mb-1.5 block"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full h-10 px-3.5 py-2 text-sm bg-[var(--surface-raised)] text-[var(--ink)] placeholder:text-[var(--ink-muted)]/70 border rounded-[var(--radius-control)] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-1 ${borderStyle} ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-[var(--status-error)] mt-1.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[var(--ink-muted)] mt-1.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
