/**
 * Caps de l'espace client (s24, lot D4 ; conception `docs/espace-client/niveaux-xp-s24.md` v10.1).
 * Module pur, sans base ni dépendance : importable côté navigateur et côté serveur.
 *
 * - SEUL endroit des seuils des caps (critère 5) : 0, 100, 300, 700, 2 300 (Q2). L'ancienne table
 *   (0/100/500/1 500/5 000) reste servie interrupteur fermé par `lib/progression.ts`
 *   (`A_SUPPRIMER_APRES_OUVERTURE`, lot D13).
 * - Deux caps (Q10, 5.5) : le cap AFFICHÉ suit le total d'XP (`User.xp`, ne baisse jamais) ; le cap
 *   de DÉBLOCAGE suit les XP d'étapes validées et de bonus de fin (une ligne par étape en base, hors
 *   de portée de toute route d'XP), mêmes seuils. Un bonus ne s'ouvre que par le second.
 * - Annonces (3.0, 5.4, critère 17) : « Nouveau cap » quand le cap affiché monte, « Un bonus s'ouvre »
 *   quand un bonus est effectivement rangé (fiche présente) ; ensemble, une seule annonce ; chacune
 *   une fois (`CapAnnonce`). Le recalcul unique de l'ouverture marque tout en silencieux.
 */

export type NumeroCap = 1 | 2 | 3 | 4 | 5;
export const NUMEROS_CAPS: readonly NumeroCap[] = [1, 2, 3, 4, 5];

/** Seuils des caps 1 à 5 (Q2, décision du 12/11). Un seul endroit du code. */
export const SEUILS_CAPS: readonly number[] = [0, 100, 300, 700, 2300];

/** Valeur du type fermé `UserLevel` en base pour chaque cap (5 valeurs, aucune migration de structure). */
export const NIVEAU_PAR_CAP = {
  1: "NOVICE",
  2: "APPRENTI",
  3: "FARCEUR",
  4: "COMIQUE",
  5: "LEGENDE",
} as const satisfies Record<NumeroCap, string>;
export type NiveauEnBase = (typeof NIVEAU_PAR_CAP)[NumeroCap];

/** Seuils des caps indexés par la valeur en base (même forme que l'ancienne table). */
export const SEUILS_PAR_NIVEAU = Object.fromEntries(
  NUMEROS_CAPS.map((n) => [NIVEAU_PAR_CAP[n], SEUILS_CAPS[n - 1]]),
) as Record<NiveauEnBase, number>;

/** Cap atteint pour un total d'XP (négatif ou invalide : cap 1). */
export function capDepuisXp(xp: number): NumeroCap {
  const total = Number.isFinite(xp) ? xp : 0;
  let cap: NumeroCap = 1;
  for (const n of NUMEROS_CAPS) if (total >= SEUILS_CAPS[n - 1]) cap = n;
  return cap;
}

/** Cap d'une valeur en base (`User.level`) ; inconnue : cap 1. */
export function capDepuisNiveau(niveau: string | null | undefined): NumeroCap {
  return NUMEROS_CAPS.find((n) => NIVEAU_PAR_CAP[n] === niveau) ?? 1;
}

export interface EtapeValidee {
  slug: string;
  ordre: number;
}

/**
 * XP de déblocage (5.5) : XP de chaque étape validée (valeur du seed, via `xpEtape`) et bonus de fin
 * de chaque parcours terminé. Jamais `User.xp` : un total gonflé sans étape n'ouvre rien (critère 16).
 * Une étape comptée une fois même si elle apparaît deux fois (double validation).
 */
export function xpDeDeblocage(
  etapes: readonly EtapeValidee[],
  parcoursTermines: readonly string[],
  xpEtape: (slug: string, ordre: number) => number,
  bonusFin: number,
): number {
  const vues = new Set<string>();
  let total = 0;
  for (const e of etapes) {
    const cle = `${e.slug}#${e.ordre}`;
    if (vues.has(cle)) continue;
    vues.add(cle);
    total += xpEtape(e.slug, e.ordre);
  }
  return total + new Set(parcoursTermines).size * bonusFin;
}

export type TypeAnnonce = "CAP" | "BONUS";
export interface MarqueAnnonce {
  type: TypeAnnonce;
  numero: NumeroCap;
}
export interface BonusRange {
  cap: NumeroCap;
  id: string;
  titre: string;
}
export interface AnnonceAFaire {
  /** Cap affiché à annoncer (le plus haut atteint, une seule phrase), ou null. */
  cap: NumeroCap | null;
  /** Bonus à annoncer (le plus haut ouvert, une seule phrase), ou null. */
  bonus: BonusRange | null;
  /** Lignes `CapAnnonce` à écrire quand l'annonce est montrée. */
  aMarquer: MarqueAnnonce[];
}

/**
 * Ce qu'il reste à annoncer (critère 17). Cap 1 : jamais annoncé (départ, aucun bonus). Un bonus
 * n'est annoncé que s'il est rangé (`bonusRanges`) ET que le DÉBLOCAGE atteint son cap.
 * [HYPOTHÈSE] deux caps franchis d'un coup : une seule phrase, celle du plus haut ; idem pour deux bonus.
 */
export function annoncesAFaire(p: {
  capAffiche: NumeroCap;
  capDeblocage: NumeroCap;
  dejaFaites: readonly MarqueAnnonce[];
  bonusRanges: readonly BonusRange[];
}): AnnonceAFaire {
  const faite = (type: TypeAnnonce, n: NumeroCap) => p.dejaFaites.some((d) => d.type === type && d.numero === n);
  const caps = NUMEROS_CAPS.filter((n) => n >= 2 && n <= p.capAffiche && !faite("CAP", n));
  const bonus = p.bonusRanges
    .filter((b) => b.cap >= 2 && b.cap <= p.capDeblocage && !faite("BONUS", b.cap))
    .sort((a, b) => a.cap - b.cap);
  return {
    cap: caps.length > 0 ? caps[caps.length - 1] : null,
    bonus: bonus.length > 0 ? bonus[bonus.length - 1] : null,
    aMarquer: [
      ...caps.map((numero) => ({ type: "CAP" as const, numero })),
      ...bonus.map((b) => ({ type: "BONUS" as const, numero: b.cap })),
    ],
  };
}

/**
 * Lignes du recalcul unique (5.4 : silencieux) : tout cap atteint (affiché) et tout bonus gagné
 * (déblocage) sont marqués annoncés, sans annonce. Vers le haut seulement : rien n'est retiré.
 */
export function marquesSilencieuses(capAffiche: NumeroCap, capDeblocage: NumeroCap): MarqueAnnonce[] {
  return [
    ...NUMEROS_CAPS.filter((n) => n >= 2 && n <= capAffiche).map((numero) => ({ type: "CAP" as const, numero })),
    ...NUMEROS_CAPS.filter((n) => n >= 2 && n <= capDeblocage).map((numero) => ({ type: "BONUS" as const, numero })),
  ];
}

/** Niveau à écrire en base au recalcul : jamais plus bas que l'actuel (aucun abonné ne baisse). */
export function niveauRecalcule(niveauActuel: string | null | undefined, xp: number): NiveauEnBase {
  const cap = Math.max(capDepuisNiveau(niveauActuel), capDepuisXp(xp)) as NumeroCap;
  return NIVEAU_PAR_CAP[cap];
}
