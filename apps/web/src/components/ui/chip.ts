import { cn } from "@/lib/utils";

const BASE =
  "inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";
const IDLE =
  "border-border bg-background-elevated text-text-secondary hover:border-accent-primary hover:text-text-primary";
const ACTIVE = "border-accent-secondary-hover bg-accent-secondary-hover font-semibold text-white";

/** Pastille de lien/filtre : bordée = cliquable. `active` = sélection courante (audit forme s14, P0-3). */
export function chipClass(state: "idle" | "active" = "idle", className?: string): string {
  return cn(BASE, state === "active" ? ACTIVE : IDLE, className);
}
