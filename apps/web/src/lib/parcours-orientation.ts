/**
 * Orientation vers un parcours : source unique partagée par le quiz
 * d'orientation de /parcours et l'onboarding (passe UX s12, T43).
 * Textes repris à l'identique du quiz d'orientation de /parcours.
 */
import { BOULOT_PUBLIE } from "@/config/parcours-publication";

export type ParcoursSlug = "confiance" | "repartie" | "machine-a-cafe" | "boulot";

export interface ParcoursRecommendation {
  slug: ParcoursSlug;
  title: string;
  reason: string;
}

/** Raison affichée quand le quiz ou l'onboarding mène à Boulot. */
export const RAISON_BOULOT =
  "Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un.";

/**
 * s19 iter 5 (N-3 @design) : icône de la réponse « Au boulot, en réunion, à la pause » du quiz.
 * 💼 (celle de la carte Boulot) une fois Boulot publié, sinon ☕ comme avant s19.
 * Lue au rendu : `boulotPublie` est un paramètre pour les tests.
 */
export function emojiReponseBoulot(boulotPublie: boolean = BOULOT_PUBLIE): string {
  return boulotPublie ? "💼" : "☕";
}

/**
 * Signaux reconnus : "confiance" | "global" | "repartie" | "social" | "content" | "work".
 * Priorité : Boulot (si publié), puis confiance, puis répartie, sinon Machine à Café.
 * PM-11 (s17) : « Partout » (global) ne mène à Confiance que si aucune difficulté
 * n'est nommée ; « je ne sais pas quoi répondre » ou « rien à raconter » l'emporte.
 * s19 ([CHOIX UTILISATEUR] 11/10, point 1) : « Au boulot » (work) mène à Boulot, quelle
 * que soit la réponse suivante, une fois `BOULOT_PUBLIE` à true ; à false, `work` reste
 * sans effet (comportement d'avant s19). `boulotPublie` : paramètre pour les tests.
 */
export function recommendParcours(
  signals: readonly string[],
  boulotPublie: boolean = BOULOT_PUBLIE,
): ParcoursRecommendation {
  if (boulotPublie && signals.includes("work")) {
    return {
      slug: "boulot",
      title: "Parcours Boulot",
      // s19 iter 5 (S15 @ux, arbitrage du 11/10) : vraie pour les 3 réponses de Q2. Seconde moitié de
      // l'accroche validée de la carte Boulot, la même quelle que soit la deuxième réponse.
      reason: RAISON_BOULOT,
    };
  }
  const namedDifficulty = signals.includes("repartie") || signals.includes("content");
  if (signals.includes("confiance") || (signals.includes("global") && !namedDifficulty)) {
    return {
      slug: "confiance",
      title: "Parcours Confiance",
      reason: "Tu veux retrouver ta légèreté sans te forcer : ce parcours prend son temps, et il a raison.",
    };
  }
  if (signals.includes("repartie") || signals.includes("social")) {
    return {
      slug: "repartie",
      title: "Parcours Répartie",
      reason: "Tu veux la bonne réplique pendant qu'elle sert encore : c'est exactement le programme.",
    };
  }
  return {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    reason: "Tu veux avoir de quoi raconter à la pause, autre chose que la météo.",
  };
}

/** Q1 de l'onboarding (objectif) vers les signaux d'orientation. */
const OBJECTIVE_SIGNALS: Record<string, string> = {
  REPARTIE: "repartie",
  VANNES: "content",
  CONFIANCE: "confiance",
  // GLOBAL : aucun signal, le contexte (Q2) tranche.
};

/** Q2 de l'onboarding (contexte) vers les signaux d'orientation. */
const CONTEXT_SIGNALS: Record<string, string> = {
  social: "social",
  party: "social",
  work: "work",
  // everywhere : aucun signal (« Partout » ne dit rien de la confiance).
};

/**
 * Recommandation à partir des réponses Q1 (objectif) et Q2 (contexte)
 * de l'onboarding. L'objectif prime sur le contexte.
 */
export function recommendParcoursFromOnboarding(
  objective: string | undefined,
  context: string | undefined,
): ParcoursRecommendation {
  const fromObjective = objective ? OBJECTIVE_SIGNALS[objective] : undefined;
  if (fromObjective === "content") {
    // « Faire rire les gens » : avoir quoi raconter, sauf si le contexte est festif.
    return recommendParcours(context && CONTEXT_SIGNALS[context] === "social" ? ["social"] : ["content"]);
  }
  if (fromObjective) return recommendParcours([fromObjective]);
  const fromContext = context ? CONTEXT_SIGNALS[context] : undefined;
  return recommendParcours(fromContext ? [fromContext] : []);
}
