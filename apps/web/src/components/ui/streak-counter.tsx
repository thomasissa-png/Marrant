"use client";

import { cn } from "@/lib/utils";

interface StreakCounterProps {
  count: number;
  className?: string;
}

export function StreakCounter({ count, className }: StreakCounterProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-accent-orange/10 px-4 py-2",
        className
      )}
    >
      <span
        className={cn("text-2xl", count > 0 && "animate-streak-pulse")}
        role="img"
        aria-label="streak"
      >
        🔥
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-accent-orange">
          {count} jour{count > 1 ? "s" : ""}
        </span>
        <span className="text-xs text-text-muted">de suite</span>
      </div>
    </div>
  );
}
