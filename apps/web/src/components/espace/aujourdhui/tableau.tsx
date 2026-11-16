import { NUMEROS_CAPS, type NumeroCap } from "@/lib/espace/caps";
import { cn } from "@/lib/utils";
import { CADRE_CARTE } from "@/components/espace/carte/styles";

/**
 * Briques du tableau de bord d'« Aujourd'hui » (refonte s25, `docs/design/aujourdhui-refonte-s25.md` §4) : classes
 * des tuiles et petits éléments visuels partagés entre la page de l'abonné et l'extrait fermé de l'aperçu (mêmes
 * composants, pour que le prospect reconnaisse le produit). Tokens du thème seulement, aucune valeur neuve.
 */

/** Z1 : la seule carte teintée de la page (filet de l'accueil, dégradé violet léger). */
export const CARTE_ACTION = cn(
  CADRE_CARTE,
  "flex h-full min-w-0 flex-col border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 via-background-card to-background-card p-6 [overflow-wrap:anywhere] md:min-h-[14.5rem] md:p-8",
);

/** Tuile standard (Z3, Z4, Z5, Z7, « 4 premières semaines ») : sans filet, Z1 porte l'accent. */
export const TUILE =
  "relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background-card p-5 [overflow-wrap:anywhere]";

/** Étiquette violette de Z1 (texte violet courant : `accent-link`, AA). */
export const ETIQUETTE_ACTION = "text-xs font-semibold uppercase tracking-wide text-accent-link";

export const TITRE_TUILE = "mt-2 font-display text-lg font-bold text-text-primary";

/** Pied d'action d'une tuile (Z3) : ligne entière de 48 px, anneau intérieur (la tuile coupe ce qui dépasse). */
export const PIED_TUILE =
  "-mx-5 -mb-5 mt-auto flex min-h-12 items-center justify-between border-t border-border px-5 text-sm font-semibold text-accent-link transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary";

/** Pastille non cliquable (donc sans bord) : comptes de la rafale, « Facultative ». */
export const PASTILLE = "inline-flex items-center gap-1 rounded-full bg-background-elevated px-2.5 py-1 text-xs text-text-secondary";

export function Chevron({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 flex-none", className)} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/** Flamme de la série (tracé repris de « Ton mois »), décorative. */
export function Flamme({ className }: { className?: string }) {
  return (
    <svg className={cn("flex-none", className)} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  );
}

export function Coche({ className }: { className?: string }) {
  return (
    <svg className={cn("flex-none", className)} aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * Barre d'étapes (validées sur total), décorative : « Étape n sur N » porte l'information, jamais un pourcentage
 * écrit (interdit des caps). Rail `bg-background` sur la tuile, remplissage dégradé.
 */
export function BarreProgression({ faites, total, className }: { faites: number; total: number; className?: string }) {
  const part = total > 0 ? Math.min(1, Math.max(0, faites / total)) : 0;
  return (
    <span className={cn("block h-2 overflow-hidden rounded-full bg-background", className)} aria-hidden="true" data-barre-etapes>
      <span className="block h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary" style={{ width: `${part * 100}%` }} />
    </span>
  );
}

/** Les 5 segments du cap (non textuels, masqués : « cap n sur 5 » porte l'information). */
export function SegmentsCap({ cap, className }: { cap: NumeroCap; className?: string }) {
  return (
    <span className={cn("flex gap-1.5", className)} aria-hidden="true" data-segments-cap={cap}>
      {NUMEROS_CAPS.map((n) => (
        <span key={n} className={cn("block h-2 flex-1 rounded-full", n <= cap ? "bg-accent-primary" : "bg-border")} />
      ))}
    </span>
  );
}

/**
 * Coupe d'une phrase sur son premier nombre (spec design §7) : « 420 XP gagnés… » donne « 420 » et « XP gagnés… ».
 * Sans nombre en tête : `null` (la phrase reste entière, taille normale). Le texte lu reste identique.
 */
export function couperNombre(phrase: string): { nombre: string; reste: string } | null {
  // `\s` couvre aussi les espaces insécables (fine ou non) que pose `frEspace` dans les milliers.
  const m = /^(\d[\d\s]*?)\s+(\D.*)$/u.exec(phrase);
  return m ? { nombre: m[1], reste: m[2] } : null;
}

/** Statistique de Z2 : le nombre en grand (`tabular-nums`), son libellé dessous, dans le même parent. */
export function StatChiffre({ phrase, icone }: { phrase: string; icone?: React.ReactNode }) {
  const coupe = couperNombre(phrase);
  if (!coupe) return <p className="text-sm text-text-primary">{phrase}</p>;
  return (
    <p className="min-w-0">
      <span className="flex items-center gap-1.5 font-display text-3xl font-bold tabular-nums text-text-primary">
        {icone}
        {coupe.nombre}
      </span>{" "}
      <span className="mt-1 block text-xs text-text-secondary">{coupe.reste}</span>
    </p>
  );
}
