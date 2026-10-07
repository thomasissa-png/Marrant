/** Formes servies au client par la page /parcours/[slug] et l'API by-slug. */
import type { StepJoke } from "@/lib/parcours-vannes";

export interface VideoRef {
  youtubeId: string;
  artist: string;
  title: string;
  why: string;
  /** Fiche vidéo du catalogue (vidéo active en base), SEO-05. */
  href?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  /** Explication de la bonne réponse, si @copywriter l'a écrite (D5). */
  explanation?: string;
}

export interface Step {
  id: string;
  order: number;
  dayNumber: number;
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
  /** Nombre de vannes prévues (les textes ne quittent jamais le serveur). */
  jokeCount?: number;
  /** Vannes actives de l'étape, servies aux abonnés seulement (D4). */
  jokes?: StepJoke[];
  videos?: VideoRef[];
  quiz?: QuizQuestion[];
  /** Fiche conseil du catalogue (SEO-05). */
  tipHref?: string;
  /** true : aperçu servi par le serveur (contenu réservé Premium, non envoyé). */
  locked?: boolean;
}

export interface PathData {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  difficulty: string;
  /** Plage de niveau du seed (« DEBUTANT → EXPERT »), transmise par le serveur. */
  difficultyLabel?: string | null;
  /** Rythme du parcours (« 15 min/semaine ») : durée estimée d'une étape. */
  timePerWeek?: string | null;
  icon: string;
  steps: Step[];
  nextParcours?: string | null;
  nextParcoursReason?: string | null;
  personaTagline?: string | null;
  testimonial?: string | null;
}

export interface UserProgress {
  completedSteps: number[];
  currentStep: number;
  completedAt: string | null;
  startedAt?: string | null;
}

/** Statut Umami (data-analyst §5) : jamais d'identifiant. */
export type StatutParcours = "visiteur" | "membre" | "premium";
