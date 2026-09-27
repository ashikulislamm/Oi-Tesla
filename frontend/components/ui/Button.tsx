import React from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className = "",
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--deep-harbor)] focus-visible:ring-offset-2 rounded-[var(--radius-control)]";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-5 py-2.5 h-10",
    lg: "text-base px-6 py-3.5 h-12",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--deep-harbor)] text-white hover:opacity-95 active:bg-[#0c282a]",
    accent:
      "bg-[var(--signal-amber)] text-[var(--ink)] font-semibold hover:opacity-95 active:bg-[#d69330]",
    secondary:
      "border border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-white/70 active:bg-white",
    destructive:
      "border border-[var(--status-error)] bg-transparent text-[var(--status-error)] hover:bg-red-50/50 active:bg-red-50",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 currentColor"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
