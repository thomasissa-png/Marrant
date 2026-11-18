/**
 * Libellés des cartes de favoris, sortis de `favoris-list.tsx` sans retouche (v6 tour 1) : module sans
 * `"use client"`, lisible aussi par l’aperçu de Favoris rendu côté serveur (`espace/apercu/apercu-favoris.tsx`).
 */
export const JOKE_CATEGORY_LABELS: Record<string, string> = {
  AUTODERISION: "Autodérision",
  SITUATION: "Vie quotidienne",
  ABSURDE: "Absurde",
  OBSERVATIONNEL: "Vie quotidienne",
  JEUX_DE_MOTS: "Jeux de mots",
  CULTUREL: "Vie quotidienne",
  COUPLE: "Couple & Dating",
  BOULOT: "Boulot & Collègues",
  ECOLE: "École & Études",
  GAMING: "Digital & Gaming",
  RESEAUX_SOCIAUX: "Digital & Gaming",
  DATING: "Couple & Dating",
  SOIREES: "Soirées & Apéro",
  PARENTS: "Famille",
};

export const TIP_CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Autodérision",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
  ABSURDE: "Absurde",
  JEUX_DE_MOTS: "Jeux de mots",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  EXPERT: "Expert",
};

export const DIFFICULTY_VARIANT: Record<string, "secondary" | "primary" | "error"> = {
  DEBUTANT: "secondary",
  INTERMEDIAIRE: "primary",
  EXPERT: "error",
};

/** Filtre d'onglet de la page Favoris. */
export type TabFilter = "ALL" | "JOKE" | "TIP" | "VIDEO";

/**
 * Onglets de Favoris et leurs états vides, sortis de `favoris-list.tsx` sans retouche (s26) : lus aussi par l'aperçu
 * (pastilles du hero, rendu serveur) et par la vue de l'abonné, espace ouvert (`espace/favoris/favoris-abonne.tsx`).
 * `emptyEmoji` ne sert plus qu'au rendu fermé (s26 : états vides sans émoji, espace ouvert).
 */
export const TABS: { value: TabFilter; label: string; emptyEmoji: string; emptyTitle: string; emptyDesc: string; ctaLabel: string; ctaHref: string }[] = [
  {
    value: "ALL",
    label: "Tout",
    emptyEmoji: "⭐",
    emptyTitle: "Aucun favori pour l’instant",
    emptyDesc: "Mets des vannes, conseils ou vidéos de côté : tu nous remercieras en soirée.",
    ctaLabel: "Explorer les vannes",
    ctaHref: "/vannes",
  },
  {
    value: "JOKE",
    label: "Vannes",
    emptyEmoji: "😅",
    emptyTitle: "Pas encore de vanne en favoris",
    emptyDesc: "Trouve ta prochaine punchline et garde-la ici pour la ressortir au bon moment.",
    ctaLabel: "Parcourir les vannes",
    ctaHref: "/vannes",
  },
  {
    value: "TIP",
    label: "Conseils",
    emptyEmoji: "🎓",
    emptyTitle: "Pas encore de conseil en favoris",
    emptyDesc: "Sauvegarde les techniques qui te parlent pour les travailler à ton rythme.",
    ctaLabel: "Découvrir les conseils",
    ctaHref: "/conseils",
  },
  {
    value: "VIDEO",
    label: "Vidéos",
    emptyEmoji: "🎬",
    emptyTitle: "Pas encore de vidéo en favoris",
    emptyDesc: "Garde tes vidéos préférées ici pour les revoir et t’en inspirer.",
    ctaLabel: "Explorer les vidéos",
    ctaHref: "/videos",
  },
];

/** Étiquette de type des cartes de favoris (« Vanne », « Conseil », « Vidéo » : libellés des cartes de `favoris-list.tsx`). */
export const TYPE_FAVORI = { JOKE: "Vanne", TIP: "Conseil", VIDEO: "Vidéo" } as const;
