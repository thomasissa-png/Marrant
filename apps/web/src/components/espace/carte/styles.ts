/**
 * Classes communes des cartes, du geste et des missions (s24, lot D5) : tokens existants seulement,
 * cibles de 44 px au moins, focus visible, boutons qui passent à la ligne à 200 % de texte.
 */
export const BOUTON_SECONDAIRE =
  "inline-flex min-h-11 min-w-0 items-center justify-center whitespace-normal rounded-lg border border-border-input px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:cursor-default aria-disabled:border-border aria-disabled:text-text-muted disabled:cursor-default";

export const BOUTON_PRINCIPAL =
  "inline-flex min-h-11 min-w-0 items-center justify-center whitespace-normal rounded-lg bg-accent-secondary-hover px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50";

export const CARTE = "min-w-0 space-y-4 rounded-lg border border-border bg-background-card p-4 md:p-6 [overflow-wrap:anywhere]";

export const ETIQUETTE = "text-xs font-semibold uppercase tracking-wide text-text-muted";

export const LIEN = "inline-flex min-h-11 items-center text-sm text-accent-link underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

/** Puce à choix unique : coche ET contour de 2 px quand elle est choisie (jamais la couleur seule). */
export const puce = (choisie: boolean) =>
  [
    "inline-flex min-h-11 min-w-11 items-center gap-1 whitespace-normal rounded-full border px-4 py-2 text-left text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    choisie ? "border-2 border-accent-link bg-background-elevated px-3.5" : "border-border-input hover:border-text-muted hover:bg-background-elevated",
  ].join(" ");

/** Clé d'idempotence d'un geste (une par toucher, gardée pour la suite du même geste). */
export function nouvelleCle(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
