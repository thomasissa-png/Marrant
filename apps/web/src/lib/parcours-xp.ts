/**
 * XP et rythme des parcours (audit s17, A2 et D2), partagés par l'écran et
 * le serveur. Le bonus de fin est crédité par `api/parcours/[id]/progress`
 * (lot A) : cette constante doit rester la valeur qu'il crédite.
 */

/** Bonus crédité à la validation de la dernière étape d'un parcours. */
export const PARCOURS_BONUS_FIN_XP = 100;

/** XP par défaut d'une étape sans `moduleXp` (même repli que le serveur). */
export const PARCOURS_ETAPE_XP_DEFAUT = 20;

/** Rythme doux (D2) : étape suivante conseillée 7 jours après la précédente validation. */
export const PARCOURS_RYTHME_JOURS = 7;

/** Total réellement gagnable : somme des étapes + bonus de fin (QA-07). */
export function totalParcoursXp(steps: ReadonlyArray<{ moduleXp?: number }>): number {
  const etapes = steps.reduce((sum, s) => sum + (s.moduleXp ?? PARCOURS_ETAPE_XP_DEFAUT), 0);
  return etapes + PARCOURS_BONUS_FIN_XP;
}

/**
 * Date conseillée pour l'étape suivante, ou null si elle est déjà passée
 * (ou inconnue) : rien n'est bloqué, on n'affiche une date que si elle aide.
 */
export function prochaineEtapeConseillee(
  derniereValidation: Date | string | null | undefined,
  maintenant: Date = new Date(),
): Date | null {
  if (!derniereValidation) return null;
  const depart = new Date(derniereValidation);
  if (Number.isNaN(depart.getTime())) return null;
  const date = new Date(depart.getTime() + PARCOURS_RYTHME_JOURS * 24 * 60 * 60 * 1000);
  return date.getTime() > maintenant.getTime() ? date : null;
}

/** « jeudi 15 octobre », heure de Paris ; l'année seulement si elle change (étalon 3.3). */
export function formatDateConseillee(date: Date, maintenant: Date = new Date()): string {
  const annee = (d: Date) => new Intl.DateTimeFormat("fr-FR", { year: "numeric", timeZone: "Europe/Paris" }).format(d);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(annee(date) !== annee(maintenant) && { year: "numeric" }),
    timeZone: "Europe/Paris",
  }).format(date);
}

/** Dernière date de validation parmi les dates par étape (table du lot A). */
export function derniereValidation(
  validations: ReadonlyArray<{ completedAt: string | Date }> | null | undefined,
): string | null {
  if (!validations || validations.length === 0) return null;
  let max = -Infinity;
  for (const v of validations) {
    const t = new Date(v.completedAt).getTime();
    if (!Number.isNaN(t) && t > max) max = t;
  }
  return Number.isFinite(max) ? new Date(max).toISOString() : null;
}
