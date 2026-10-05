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
  // Article à forte frappe s14 : textes de la notation iter1 (A2-voeux-drole-nouvelle-annee.md).
  "voeux-drole-nouvelle-annee": {
    title: "Ton message est choisi. Le reste de l'année, c'est toi qui écris.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi trouver tes propres chutes d'ici l'an prochain.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.",
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A3-premier-message-appli-rencontre.md).
  "premier-message-drole-appli-de-rencontre": {
    title: "Ton premier message est prêt. La suite s'entraîne.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Confiance et Répartie : de quoi oser envoyer, puis tenir la conversation qui suit.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.",
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A4-blagues-de-couple.md).
  "blagues-de-couple-drole": {
    title: "Tu as les vannes. Reste à trouver le bon moment.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Répartie : de quoi renvoyer la balle quand l'autre te répond du tac au tac.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.",
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A5-blagues-poisson-d-avril-adultes.md).
  "blagues-poisson-d-avril-adultes": {
    title: "Le canular est prêt. Et la riposte ?",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi trouver la bonne réponse le jour où c'est toi la cible.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les idées de cette page restent en accès libre, compte ou pas.",
  },
  // Article à forte frappe s14 : textes de la notation iter1 (B2-blagues-de-gamer.md).
  "blagues-de-gamer-jeux-video": {
    title: "Tu as les vannes. Reste à les sortir en vocal.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Répartie : de quoi renvoyer la balle quand ta team te répond du tac au tac.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.",
  },
};
