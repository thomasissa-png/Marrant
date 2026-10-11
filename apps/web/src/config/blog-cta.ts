/**
 * Textes du CTA de fin d'article (components/blog/article-cta) surchargés par
 * slug. Article absent de la table = textes par défaut du composant, CTA en bas.
 * Article présent = CTA placé juste après le corps (blog/[slug]/page.tsx).
 *
 * Plus de compte gratuit (s15) : déclinaison des étalons validés par Thomas
 * (docs/copy/etalons-chemin-premium-s15.md) : 3.1 quand l'article ne nomme
 * pas de parcours, 3.2c quand il en nomme un. Titre propre à l'article gardé.
 * Prix lu dans config/premium.ts (s16, lot E : plus de prix écrit en dur).
 */
import { PREMIUM_PRICE_LABEL } from "@/config/premium";

export interface BlogCtaCopy {
  title: string;
  text: string;
  primaryLabel: string;
  /** Ligne sous les boutons (défaut du composant si absente). */
  note?: string;
  /** Lien secondaire vers l'étape 1 (défaut du composant si absent). */
  secondaryLabel?: string;
  /** Parcours lié : lien secondaire et retour après paiement (défaut : /parcours). */
  parcoursHref?: string;
}

export const BLOG_CTA_BY_SLUG: Record<string, BlogCtaCopy> = {
  // Audit growth s14 (R4) puis notation iter1 (C5, C6) : visiteur venu chercher une vanne, pas un programme. Étalon 3.1.
  "meilleures-blagues-droles-2026": {
    title: "Tu les as lues. Reste à les sortir pour de vrai.",
    text: "Les parcours complets : de quoi t'entraîner à les placer au bon moment, pas juste à les connaître.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les vannes de cette page restent en accès libre.`,
  },
  // A1 (docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md, section « CTA »). Étalon 3.1.
  "message-anniversaire-drole-par-situation": {
    title: "Le message, c'est fait. Reste le moment du gâteau.",
    text: "Les parcours complets : de quoi trouver la bonne phrase aussi à l'oral, pas seulement par écrit.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les messages de cette page restent en accès libre.`,
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A2-voeux-drole-nouvelle-annee.md). Étalon 3.1.
  "voeux-drole-nouvelle-annee": {
    title: "Ton message est choisi. Le reste de l'année, c'est toi qui écris.",
    text: "Les parcours complets : de quoi trouver tes propres chutes d'ici l'an prochain.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les messages de cette page restent en accès libre.`,
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A3-premier-message-appli-rencontre.md). Étalon 3.2c.
  "premier-message-drole-appli-de-rencontre": {
    title: "Ton premier message est prêt. La suite s'entraîne.",
    text: "Les parcours Confiance et Répartie t'entraînent à oser envoyer, puis à tenir la conversation qui suit, étape après étape.",
    primaryLabel: "Commencer le parcours Confiance",
    note: `Premium à ${PREMIUM_PRICE_LABEL}, sans engagement. La première étape se lit sans compte.`,
    secondaryLabel: "Lire l'étape 1 de Confiance",
    parcoursHref: "/parcours/confiance",
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A4-blagues-de-couple.md). Étalon 3.2c (texte exact validé).
  "blagues-de-couple-drole": {
    title: "Tu as les vannes. Et quand l'autre te les renvoie ?",
    text: "Le parcours Répartie t'entraîne à renvoyer la balle quand l'autre te répond du tac au tac, étape après étape.",
    primaryLabel: "Commencer le parcours Répartie",
    note: `Premium à ${PREMIUM_PRICE_LABEL}, sans engagement. La première étape se lit sans compte.`,
    secondaryLabel: "Lire l'étape 1 de Répartie",
    parcoursHref: "/parcours/repartie",
  },
  // Article à forte frappe s14 : textes de la notation iter1 (A5-blagues-poisson-d-avril-adultes.md). Étalon 3.1.
  "blagues-poisson-d-avril-adultes": {
    title: "Le canular est prêt. Et la riposte ?",
    text: "Les parcours complets : de quoi trouver la bonne réponse le jour où c'est toi la cible.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les idées de cette page restent en accès libre.`,
  },
  // Article à forte frappe s14 : textes de la notation iter1 (B2-blagues-de-gamer.md). Étalon 3.2c.
  "blagues-de-gamer-jeux-video": {
    title: "Tu as les vannes. Reste à les sortir en vocal.",
    text: "Le parcours Répartie t'entraîne à renvoyer la balle quand ta team te répond du tac au tac, étape après étape.",
    primaryLabel: "Commencer le parcours Répartie",
    note: `Premium à ${PREMIUM_PRICE_LABEL}, sans engagement. La première étape se lit sans compte.`,
    secondaryLabel: "Lire l'étape 1 de Répartie",
    parcoursHref: "/parcours/repartie",
  },
  // Article à forte frappe s14 (B1-refuser-une-invitation-avec-humour.md). Étalon 3.1.
  "refuser-une-invitation-avec-humour": {
    title: "Le refus est parti. Reste la relance en face.",
    text: "Les parcours complets : de quoi trouver la bonne phrase aussi à l'oral, quand on te redemande en face, pas seulement par écrit.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les réponses de cette page restent en accès libre.`,
  },
  // Article à forte frappe s14 (B3-mot-de-depart-collegue.md). Étalon 3.1.
  "mot-de-depart-collegue-drole": {
    title: "Le mot est écrit. Reste le pot.",
    text: "Les parcours complets : de quoi t'entraîner à la répartie pour le pot, pas seulement pour la carte.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les textes de cette page restent en accès libre.`,
  },
  // Article à forte frappe s14 (B4-message-drole-fete-des-meres.md). Étalon 3.2c.
  "message-drole-fete-des-meres": {
    title: "Le message est choisi. Le reste de la journée s'improvise.",
    text: "Le parcours Confiance t'entraîne, étape après étape, à trouver tes mots au téléphone ou à table aussi, quand il n'y a plus de texte à copier.",
    primaryLabel: "Commencer le parcours Confiance",
    note: `Premium à ${PREMIUM_PRICE_LABEL}, sans engagement. La première étape se lit sans compte.`,
    secondaryLabel: "Lire l'étape 1 de Confiance",
    parcoursHref: "/parcours/confiance",
  },
  // Article à forte frappe s14 (B5-message-drole-fete-des-peres.md). Étalon 3.1.
  "message-drole-fete-des-peres": {
    title: "Le message est prêt. Reste à le dire en face.",
    text: "Les parcours complets : de quoi oser la phrase à voix haute, au téléphone ou à table, pas seulement par SMS.",
    primaryLabel: "Passer à Premium",
    note: `${PREMIUM_PRICE_LABEL}, sans engagement. Les messages de cette page restent en accès libre.`,
  },
  // Article à forte frappe s14 (B6-blagues-vacances-entre-amis.md). Étalon 3.2c.
  "blagues-vacances-ete-entre-amis": {
    title: "Les vannes sont prêtes. Reste à oser les sortir.",
    text: "Le parcours Confiance t'entraîne, étape après étape, à sortir ta vanne devant tout le groupe, même si tu n'es pas le drôle de la bande.",
    primaryLabel: "Commencer le parcours Confiance",
    note: `Premium à ${PREMIUM_PRICE_LABEL}, sans engagement. La première étape se lit sans compte.`,
    secondaryLabel: "Lire l'étape 1 de Confiance",
    parcoursHref: "/parcours/confiance",
  },
};
