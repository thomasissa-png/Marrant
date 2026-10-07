"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  /** Nom accessible de la barre quand le libellé visible est ailleurs (ou absent). Prioritaire sur `label`. */
  ariaLabel?: string;
  showPercentage?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "gradient";
}

export function ProgressBar({
  value,
  max = 100,
  label,
  ariaLabel,
  showPercentage = false,
  className,
  variant = "primary",
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const variantClasses = {
    primary: "bg-accent-primary",
    secondary: "bg-accent-secondary",
    gradient: "bg-gradient-to-r from-accent-primary to-accent-secondary",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="mb-1 flex items-center justify-between text-sm">
          {label && <span className="text-text-secondary">{label}</span>}
          {showPercentage && (
            <span className="text-text-muted">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-background-elevated"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel ?? label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
