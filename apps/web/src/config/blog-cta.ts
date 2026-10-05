/**
 * Textes du CTA de fin d'article (components/blog/article-cta) surchargés par
 * slug. Article absent de la table = textes par défaut du composant, CTA en bas.
 * Article présent = CTA placé juste après le corps (blog/[slug]/page.tsx).
 * Le bouton Premium (2,99 €/mois) n'est pas surchargeable ici.
 */
export interface BlogCtaCopy {
  title: string;
  text: string;
  primaryLabel: string;
  /** Ligne sous les boutons (défaut du composant si absente). */
  note?: string;
}

export const BLOG_CTA_BY_SLUG: Record<string, BlogCtaCopy> = {
  // Audit growth s14 (R4) puis notation iter1 (C5, C6) : visiteur venu chercher une vanne, pas un programme.
  "meilleures-blagues-droles-2026": {
    title: "Tu les as lues. Reste à les sortir pour de vrai.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi t'entraîner à les placer au bon moment, pas juste à les connaître.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.",
  },
  // A1 (docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md, section « CTA »).
  "message-anniversaire-drole-par-situation": {
    title: "Le message, c'est fait. Reste le moment du gâteau.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi trouver la bonne phrase aussi à l'oral, pas seulement par écrit.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.",
  },
};
