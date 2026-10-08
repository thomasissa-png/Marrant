/**
 * Entrées vers les parcours (audit parcours d'apprentissage s17, lot C).
 *
 * Module SANS donnée de contenu : importable côté client (accueil, CTA
 * d'article, quiz). La résolution fiche → parcours, qui lit les seeds, est
 * dans `lib/entrees-parcours-fiches.ts` (serveur uniquement).
 *
 * Règles :
 * - un lien d'entrée mène à l'ÉTAPE 1 du parcours (`/parcours/<slug>?src=<src>#etape-1`),
 *   jamais à la liste : pour un visiteur, la page ouvre l'étape 1 dépliée ;
 * - `src` suit `data-analyst.md` §5.3 (`parcours-ouvert`), en minuscules.
 */

import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

export type ParcoursSlug = "machine-a-cafe" | "repartie" | "confiance" | "storytelling";

/** Parcours publiés (s18 : Storytelling seulement si `STORYTELLING_PUBLIE`). */
export const PARCOURS_SLUGS: readonly ParcoursSlug[] = [
  "machine-a-cafe",
  "repartie",
  "confiance",
  ...(STORYTELLING_PUBLIE ? (["storytelling"] as const) : []),
];

/** Noms courts, identiques aux titres des parcours (« Parcours X »). */
export const PARCOURS_NOMS: Readonly<Record<ParcoursSlug, string>> = {
  "machine-a-cafe": "Machine à Café",
  repartie: "Répartie",
  confiance: "Confiance",
  storytelling: "Storytelling",
};

/**
 * Provenances des liens d'entrée. `blog`, `accueil`, `onboarding` : liste
 * §5.1 de data-analyst.md. `quiz`, `fiche`, `abonnement`, `profil` : nouvelles
 * entrées du lot C, à ajouter à la liste blanche de `parcours-ouvert` (lot B),
 * sinon comptées `direct`.
 */
export type ParcoursEntreeSrc =
  | "blog"
  | "accueil"
  | "onboarding"
  | "quiz"
  | "fiche"
  | "abonnement"
  | "profil";

export function isParcoursSlug(value: unknown): value is ParcoursSlug {
  return typeof value === "string" && (PARCOURS_SLUGS as readonly string[]).includes(value);
}

/** Lien vers l'étape 1 (lecture libre) d'un parcours, marqué `?src=`. */
export function parcoursEtape1Href(slug: ParcoursSlug, src: ParcoursEntreeSrc): string {
  return `/parcours/${slug}?src=${src}#etape-1`;
}

/**
 * Lien vers une étape précise (reprise d'un abonné). La page ouvre d'elle-même
 * la première étape non faite ; l'ancre ne sert qu'au défilement.
 */
export function parcoursEtapeHref(slug: string, etape: number, src: ParcoursEntreeSrc): string {
  return `/parcours/${slug}?src=${src}#etape-${etape}`;
}

/** Slug extrait d'un lien `/parcours/<slug>` (query et ancre ignorées), sinon null. */
export function parcoursSlugFromHref(href: string | undefined): ParcoursSlug | null {
  if (!href) return null;
  const match = /^\/parcours\/([a-z-]+)/.exec(href);
  return match && isParcoursSlug(match[1]) ? match[1] : null;
}

// ─── Reprise d'un parcours en cours (accueil abonné, profil, CTA d'article) ───

/** Ligne de `GET /api/user/progress` (champ `parcours`). */
export interface ParcoursProgressSummary {
  slug: string;
  title: string;
  completedSteps: number;
  totalSteps: number;
  completedAt: string | null;
  /** Ajouté s17 : première étape non validée (ordre), null si tout est fait. */
  nextStepOrder?: number | null;
  /** Ajouté s17 : début du parcours (ISO), pour départager plusieurs parcours en cours. */
  startedAt?: string | null;
  /** Ajouté s17 lot E : titre de l'étape suivante (seed), pour la ligne « Reprendre » (étalon 3.4 A). */
  nextStepTitle?: string | null;
}

export interface ParcoursAReprendre {
  slug: string;
  title: string;
  etape: number;
  totalSteps: number;
  completedSteps: number;
  /** Titre de l'étape à reprendre, null si inconnu. */
  titreEtape: string | null;
}

/**
 * Parcours à reprendre : non terminé, avec une étape suivante connue.
 * Plusieurs en cours : le plus avancé en proportion, puis le plus récent.
 */
export function pickParcoursAReprendre(
  list: readonly ParcoursProgressSummary[],
): ParcoursAReprendre | null {
  const enCours = list.filter(
    (p) => !p.completedAt && typeof p.nextStepOrder === "number" && p.completedSteps < p.totalSteps,
  );
  if (enCours.length === 0) return null;
  const ratio = (p: ParcoursProgressSummary) => (p.totalSteps > 0 ? p.completedSteps / p.totalSteps : 0);
  const time = (p: ParcoursProgressSummary) => (p.startedAt ? Date.parse(p.startedAt) || 0 : 0);
  const best = [...enCours].sort((a, b) => ratio(b) - ratio(a) || time(b) - time(a))[0];
  return {
    slug: best.slug,
    title: best.title,
    etape: best.nextStepOrder as number,
    totalSteps: best.totalSteps,
    completedSteps: best.completedSteps,
    titreEtape: best.nextStepTitle ?? null,
  };
}
