/**
 * Textes du CTA de fin d'article (components/blog/article-cta) surchargés par
 * slug. Article absent de la table = textes par défaut du composant.
 * Le bouton Premium (2,99 €/mois) n'est pas surchargeable ici.
 */
export interface BlogCtaCopy {
  title: string;
  text: string;
  primaryLabel: string;
}

export const BLOG_CTA_BY_SLUG: Record<string, BlogCtaCopy> = {
  // Audit growth s14 (R4) : visiteur venu chercher une vanne, pas un programme.
  "meilleures-blagues-droles-2026": {
    title: "Tu les as lues. Reste à les sortir pour de vrai.",
    text: "Un compte gratuit te donne chaque jour une vanne décryptée et la première étape de chaque parcours, pour passer de la lecture à l'oral. Sans carte.",
    primaryLabel: "Créer mon compte gratuit",
  },
};
