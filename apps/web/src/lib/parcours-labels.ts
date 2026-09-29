/**
 * Libellés d'affichage des parcours : source unique pour la liste (/parcours)
 * et le détail (/parcours/<slug>) (passe UX s12 T27, design T7/T8).
 */
import parcoursSeed from "../../../../docs/content/parcours-seed.json";

export const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
  EXPERT: "Expert",
};

/** « DEBUTANT → EXPERT » devient « Débutant → Expert » (valeurs inconnues conservées). */
export function formatDifficulty(raw: string): string {
  return raw
    .split("→")
    .map((part) => part.trim())
    .map((part) => DIFFICULTY_LABELS[part] ?? part)
    .join(" → ");
}

/**
 * Niveau affiché pour un parcours : la plage du seed (« Débutant → Expert »)
 * quand elle existe, sinon le niveau unique de la base.
 */
export function getParcoursDifficultyLabel(slug: string, fallback: string): string {
  const seed = parcoursSeed.find((p) => p.slug === slug);
  return formatDifficulty(seed?.difficultyLabel ?? fallback);
}

/** Sélecteur de variation emoji (VS16) : ☕ et ⚡ s'affichent en couleur, pas en glyphe gris. */
const VS16 = "\u{FE0F}";

export function withEmojiPresentation(icon: string): string {
  if (!icon || icon.endsWith(VS16)) return icon;
  // Uniquement pour les caractères simples (☕, ⚡) ; les emojis déjà colorés sont intacts.
  return [...icon].length === 1 && (icon.codePointAt(0) ?? 0x1f000) < 0x1f000 ? icon + VS16 : icon;
}

const NBSP = String.fromCharCode(0xa0);
// Réplique entre apostrophes droites : ouverte en début de texte ou après une espace,
// fermée avant une espace, une ponctuation ou la fin (les apostrophes de « l'après-midi » restent).
const SINGLE_QUOTED_RE = /(^|[\s(:])'(.+?)'(?=$|[\s.,;:!?)])/g;

/**
 * Répliques des options de quiz ('Ferme-la') rendues en « Ferme-la », AU RENDU
 * (ponctuation seulement). Des « … » déjà présents dans la réplique passent en “…”.
 */
export function frenchQuizQuotes(text: string): string {
  if (!text.includes("'")) return text;
  return text.replace(SINGLE_QUOTED_RE, (_m, lead: string, inner: string) => {
    const nested = inner.replace(/«\s?/g, "“").replace(/\s?»/g, "”");
    return `${lead}«${NBSP}${nested}${NBSP}»`;
  });
}
