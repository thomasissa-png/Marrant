/**
 * Titre et phrase du bloc de fin (components/blog/article-cta) surchargés par slug, pour les
 * 11 articles « à forte frappe ». Article absent = textes du parcours (encarts-blog-s20.ts) ;
 * l'article n°1 (`meilleures-blagues-droles-2026`) a ses textes v5 dans cta-articles-accueil.ts.
 *
 * Source : `docs/copy/cta-s21/concision/fins-articles-v3.md`, v3 VALIDÉE (correction C1 de la
 * revue v3), mot pour mot. Gabarit v5 : titre, une phrase, plein gratuit, « Sans compte. »,
 * lien « Ouvrir les 5 parcours · 2,99 €/mois ». Ponctuation du titre : règle unique du composant
 * (pas de point final, sauf « ? » et « » »).
 *
 * Plein gratuit (blog-article-view) : `parcoursHref` présent = « Tester l'étape 1 de {P}, gratuite »
 * (P = parcours de l'article, même valeur que `parcoursHref`, vérifié par un test) ; absent =
 * « Tester mes premières répliques, gratuit ».
 */
import { BLOC_FIN, GRATUIT_ACCUEIL, libelleGratuitParcours } from "@/config/textes/cta-articles-accueil";
import { articleParcoursConnu } from "@/lib/blog-parcours";
import type { ParcoursSlug } from "@/lib/entrees-parcours";

export interface BlogCtaCopy {
  title: string;
  text: string;
  /** Parcours nommé par l'article : le plein gratuit porte son nom. */
  parcoursHref?: string;
}

export const BLOG_CTA_BY_SLUG: Record<string, BlogCtaCopy> = {
  "message-anniversaire-drole-par-situation": {
    title: "Au moment du gâteau, tout le monde t'écoute",
    text: "Mieux vaut avoir de quoi enchaîner après la chanson.",
  },
  "voeux-drole-nouvelle-annee": {
    title: "En janvier, les vœux se disent en face.",
    text: "Toute la tournée des bises, sans rester sec.",
  },
  "premier-message-drole-appli-de-rencontre": {
    title: "On te répond. Tu écris quoi, maintenant ?",
    text: "C'est au deuxième message que ça se joue.",
    parcoursHref: "/parcours/confiance",
  },
  "blagues-de-couple-drole": {
    title: "Chez vous, qui a le dernier mot ?",
    text: "Du tac au tac, même pour la télécommande.",
    parcoursHref: "/parcours/repartie",
  },
  "blagues-poisson-d-avril-adultes": {
    title: "Le 1er avril, tu peux aussi être la cible.",
    text: "Une riposte, ça se prépare avant.",
  },
  "blagues-de-gamer-jeux-video": {
    title: "En vocal, la team ne laisse rien passer.",
    text: "Prochaine partie, à toi de chambrer.",
    parcoursHref: "/parcours/repartie",
  },
  "refuser-une-invitation-avec-humour": {
    title: "Après ton non, il y a le « t'es sûr ? »",
    text: "Répondre sans dix excuses, ça se travaille.",
  },
  "mot-de-depart-collegue-drole": {
    title: "Au pot, il faudra bien dire un mot.",
    text: "Autour du buffet, ta carte ne parlera pas pour toi.",
  },
  "message-drole-fete-des-meres": {
    title: "À table, impossible de copier-coller.",
    text: "Il faudra tes propres mots.",
    parcoursHref: "/parcours/confiance",
  },
  "message-drole-fete-des-peres": {
    title: "Le SMS, c'est fait. Reste le repas.",
    text: "Garde une vanne pour le dessert.",
  },
  "blagues-vacances-ete-entre-amis": {
    title: "Cet été, la blague culte peut être la tienne.",
    text: "Celle qu'on se répète encore à la rentrée.",
    parcoursHref: "/parcours/confiance",
  },
};

/** Plein gratuit d'un article de la table (undefined hors table : libellé du parcours). */
export function boutonEtape1Article(slug: string, parcours: ParcoursSlug): string | undefined {
  const copy = BLOG_CTA_BY_SLUG[slug];
  if (!copy) return undefined;
  return copy.parcoursHref ? libelleGratuitParcours(parcours) : GRATUIT_ACCUEIL;
}

/**
 * Plein gratuit du bloc de fin, tous articles (QA v4 m-2, libellé unique) : table ci-dessus, puis
 * article n°1 (`GRATUIT_ACCUEIL` validé), puis `GRATUIT_ACCUEIL` si le parcours n'est pas connu.
 * undefined = « Tester l'étape 1 de {P}, gratuite » du parcours (`TEXTES_PARCOURS_BLOG`).
 */
export function boutonFinArticle(slug: string, parcours: ParcoursSlug, category?: string): string | undefined {
  return (
    boutonEtape1Article(slug, parcours) ??
    BLOC_FIN.parArticle[slug]?.bouton ??
    (articleParcoursConnu(slug, category) ? undefined : BLOC_FIN.boutonSansParcours)
  );
}
