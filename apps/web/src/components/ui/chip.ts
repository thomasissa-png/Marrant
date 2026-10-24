import { cn } from "@/lib/utils";

const BASE =
  "inline-flex min-h-[44px] shrink-0 snap-start items-center whitespace-nowrap rounded-full border px-4 text-sm transition-colors lg:px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";
const IDLE =
  "border-border bg-background-elevated text-text-secondary hover:border-accent-primary hover:text-text-primary";
const ACTIVE = "border-accent-secondary-hover bg-accent-secondary-hover font-semibold text-white";

/** Pastille de lien/filtre : bordée = cliquable. `active` = sélection courante (audit forme s14, P0-3). */
export function chipClass(state: "idle" | "active" = "idle", className?: string): string {
  return cn(BASE, state === "active" ? ACTIVE : IDLE, className);
}

/**
 * Rangée de pastilles (revue visuelle s21, R03, T2-09) : une seule ligne qui défile sous 1 024 px
 * (plus de pastille orpheline sur une ligne à elle seule, à 375 comme à 768), fondu de 24 px à
 * droite comme repère de défilement ; passage à la ligne dès 1 024 px. Même rangée pour /vannes, /conseils, /videos et le glossaire.
 */
export const RANGEE_CHIPS =
  "-mx-4 flex snap-x flex-nowrap gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 lg:[mask-image:none] [&::-webkit-scrollbar]:hidden";

/**
 * Revue visuelle s21, tour 4 (T3-07) : rangée qui reste sur UNE ligne à toutes les largeurs (défilement et
 * fondu de 24 px à droite, comme sous 1 024 px). Pour les 11 catégories de /vannes (abonné), qui demandent
 * environ 1 350 px quand la page en offre 1 216 à 1 280 px : jamais deux pastilles seules sur une 2e rangée.
 */
export const RANGEE_CHIPS_UNE_LIGNE =
  "-mx-4 flex snap-x flex-nowrap gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden";
