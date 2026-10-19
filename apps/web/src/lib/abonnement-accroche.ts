/**
 * Origine du clic sur /abonnement (trajet de conversion s21, textes-trajet-v1 §1.1) : accroche
 * au-dessus du titre et ligne du tableau mise en avant. Lu côté serveur (`src` et `returnTo`
 * sont dans l'URL) : l'accroche est dans le HTML, aucun saut au chargement.
 *
 * Priorité : `src` pour les murs, fiches, favoris, recherche, quiz d'orientation et aperçu d'étape ;
 * sinon `returnTo` exact `/carnet` ; sinon la règle générique ; sinon rien.
 */
import { ACCROCHES, type LigneTableauCle } from "@/config/textes/abonnement-vente";
import { PARCOURS_NOMS, parcoursSlugFromHref } from "@/lib/entrees-parcours";
import { sanitizeSignupSrc } from "@/lib/auth-links";
import { sanitizeReturnTo } from "@/lib/premium-return";

export interface OrigineAbonnement {
  accroche: string | null;
  ligneMiseEnAvant: LigneTableauCle | null;
}

const PAR_SRC: Readonly<Record<string, OrigineAbonnement>> = {
  "mur-vannes": { accroche: ACCROCHES.murVannes, ligneMiseEnAvant: "listes" },
  "mur-conseils": { accroche: ACCROCHES.murConseils, ligneMiseEnAvant: "listes" },
  "mur-videos": { accroche: ACCROCHES.murVideos, ligneMiseEnAvant: "listes" },
  "exercice-vanne": { accroche: ACCROCHES.exerciceVanne, ligneMiseEnAvant: "exercices" },
  "exercice-conseil": { accroche: ACCROCHES.exerciceConseil, ligneMiseEnAvant: "exercices" },
  "exercice-video": { accroche: ACCROCHES.exerciceVideo, ligneMiseEnAvant: "exercices" },
  favoris: { accroche: ACCROCHES.favoris, ligneMiseEnAvant: "favoris" },
  recherche: { accroche: ACCROCHES.recherche, ligneMiseEnAvant: null },
};

/** Portes génériques « Tout ouvrir · 2,99 €/mois ». */
const SRC_GENERIQUES = new Set(["accueil-premium", "glossaire", "a-propos", "quiz"]);

const AUCUNE: OrigineAbonnement = { accroche: null, ligneMiseEnAvant: null };

export function origineAbonnement(rawSrc: string | null | undefined, rawReturnTo: string | null | undefined): OrigineAbonnement {
  const src = sanitizeSignupSrc(rawSrc);
  const returnTo = sanitizeReturnTo(rawReturnTo);
  const parcours = parcoursSlugFromHref(returnTo ?? undefined);

  if (src && PAR_SRC[src]) return PAR_SRC[src];
  if (src === "onboarding" && parcours) return { accroche: ACCROCHES.tonParcours(PARCOURS_NOMS[parcours]), ligneMiseEnAvant: null };
  if (src === "parcours-apercu" && parcours) return { accroche: ACCROCHES.suiteParcours(PARCOURS_NOMS[parcours]), ligneMiseEnAvant: "parcours" };
  if ((returnTo && returnTo.split(/[?#]/)[0] === "/carnet") || src === "carnet") return { accroche: ACCROCHES.carnet, ligneMiseEnAvant: "carnet" };
  if (src && (SRC_GENERIQUES.has(src) || src.startsWith("blog-") || src === "onboarding" || src === "parcours-apercu")) {
    return { accroche: ACCROCHES.generique, ligneMiseEnAvant: null };
  }
  return AUCUNE;
}
