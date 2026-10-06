/**
 * Protection serveur des étapes Premium des parcours (décision Thomas, 03/10/2026).
 *
 * Pour un visiteur non Premium (anonyme ou compte non abonné), les étapes 2 et
 * suivantes sont réduites à un aperçu : titre du module, format, une phrase
 * « pourquoi », XP. Le contenu du conseil (texte, exemple, exercice), le quiz,
 * les vannes et les vidéos de l'étape ne quittent PAS le serveur.
 *
 * Utilisé par l'API `/api/parcours/by-slug/[slug]` (plan lu en base) et par la
 * page `/parcours/[slug]` (ISR : HTML partagé, donc toujours en aperçu ; un
 * abonné reçoit le contenu complet via l'API après hydratation).
 */
import { canAccessParcoursStep } from "@/lib/parcours-access";

/** Forme minimale d'une étape telle que servie au client (miroir de ParcoursDetail). */
export interface ParcoursStepPayload {
  id: string;
  order: number;
  dayNumber?: number;
  tip: {
    id: string;
    title: string;
    content: string;
    category: string;
    difficulty: string;
    example: string;
    exercise: string;
  };
  moduleTitle?: string;
  moduleDetail?: string;
  moduleFormat?: string;
  moduleXp?: number;
  why?: string;
  free?: boolean;
  jokeIds?: number[];
  videos?: unknown[];
  quiz?: unknown[];
  /** true : étape réduite à son aperçu (contenu réservé Premium). */
  locked?: boolean;
}

/** Première phrase d'un texte (aperçu « pourquoi »), sans couper au milieu d'un mot. */
export function firstSentence(text: string | null | undefined): string {
  const clean = (text ?? "").trim();
  if (!clean) return "";
  const match = clean.match(/^[\s\S]+?[.!?…](?=\s|$)/);
  return (match ? match[0] : clean).trim();
}

/** Aperçu d'une étape verrouillée : aucun contenu de conseil, quiz, vanne ni vidéo. */
export function toLockedStepPreview<S extends ParcoursStepPayload>(step: S): S {
  return {
    id: step.id,
    order: step.order,
    dayNumber: step.dayNumber,
    tip: {
      id: step.tip.id,
      title: step.tip.title,
      content: "",
      category: step.tip.category,
      difficulty: step.tip.difficulty,
      example: "",
      exercise: "",
    },
    moduleTitle: step.moduleTitle,
    moduleFormat: step.moduleFormat,
    moduleXp: step.moduleXp,
    why: firstSentence(step.why),
    free: false,
    jokeIds: [],
    videos: [],
    quiz: [],
    locked: true,
  } as unknown as S;
}

/**
 * Renvoie le parcours tel qu'il peut être servi pour ce plan : complet pour un
 * Premium, étapes 2+ réduites à l'aperçu sinon. Ne modifie pas l'objet reçu.
 */
export function redactParcoursForPlan<P extends { steps: ParcoursStepPayload[] }>(
  path: P,
  plan: string | null | undefined,
): P {
  return {
    ...path,
    steps: path.steps.map((step) =>
      canAccessParcoursStep(step.order, plan) ? step : toLockedStepPreview(step),
    ),
  };
}
