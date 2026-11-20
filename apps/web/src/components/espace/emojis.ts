/**
 * s26 finition avant lancement (décision de Thomas du 20/11, point 2) : UN émoji par rubrique, le même PARTOUT
 * (Aujourd'hui, en-tête de rubrique, fiches, listes, aperçus). Source unique : aucun émoji de rubrique écrit en dur
 * ailleurs dans l'espace (test `emojis-rubriques-s26.test.ts`). Ceux de l'accueil quand ils existent (« Ton contenu du
 * jour », « Trois outils… », « Tu te reconnais ? ») ; les parcours gardent le leur (`emojiParcours`).
 * Module sans dépendance : serveur comme navigateur.
 */
export const EMOJIS_RUBRIQUES = {
  /** Quoi répondre (la répartie : « Je reste muet quand on me chambre » à l'accueil). */
  quoiRepondre: "⚡️",
  /** S'entraîner (rafale, mission, échelle des marches). */
  sEntrainer: "🎯",
  /** Bibliothèque (techniques, vocabulaire, formules). */
  bibliotheque: "💡",
  /** Carnet du mois. */
  carnet: "📒",
  /** Vannes (« Vanne du jour » de l'accueil). */
  vanne: "😂",
  /** Vidéos (« Vidéo du jour »). */
  video: "🎬",
  /** Conseils (« Conseil du jour »). */
  conseil: "💡",
} as const;

export type RubriqueEmoji = keyof typeof EMOJIS_RUBRIQUES;

/** Émoji du parcours, celui de sa carte « Tu te reconnais ? » à l'accueil (les autres parcours n'en ont pas). */
export const EMOJIS_PARCOURS: Readonly<Record<string, string>> = { "machine-a-cafe": "☕️", repartie: "⚡️", confiance: "🌱" };
export const emojiParcours = (slug: string): string | null => EMOJIS_PARCOURS[slug] ?? null;
