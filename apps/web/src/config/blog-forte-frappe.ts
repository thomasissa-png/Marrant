/**
 * Articles de blog « à forte frappe » (étalon `meilleures-blagues-droles-2026`
 * et les 11 articles construits sur son modèle, statiques ou en base).
 *
 * Partage : chaque ligne numérotée `**N.** texte` (avec ou sans « … ») reçoit un
 * bouton (components/blog/blog-vanne-share). Mode par slug :
 * - `with-url` : vanne + lien vers l'article ancré (#vanne-N), libellé « Partager la vanne n°N » ;
 * - `text-only` : message à envoyer tel quel, sans titre ni lien (on n'ajoute pas
 *   un lien à un vœu envoyé à son patron, notation A2 iter1 D11), libellé
 *   « Envoyer le message n°N ».
 * Slug absent = aucun bouton.
 */
export type BlogShareMode = "with-url" | "text-only";

export const FORTE_FRAPPE_SHARE: Readonly<Partial<Record<string, BlogShareMode>>> = {
  "meilleures-blagues-droles-2026": "with-url",
  "message-anniversaire-drole-par-situation": "text-only",
  "voeux-drole-nouvelle-annee": "text-only",
  "premier-message-drole-appli-de-rencontre": "text-only",
  "blagues-de-couple-drole": "with-url",
  "blagues-poisson-d-avril-adultes": "with-url",
  "refuser-une-invitation-avec-humour": "text-only",
  "blagues-de-gamer-jeux-video": "with-url",
  "mot-de-depart-collegue-drole": "text-only",
  "message-drole-fete-des-meres": "text-only",
  "message-drole-fete-des-peres": "text-only",
  "blagues-vacances-ete-entre-amis": "with-url",
};

export const FORTE_FRAPPE_SLUGS = Object.keys(FORTE_FRAPPE_SHARE);

export type ParcoursSlug = "repartie" | "machine-a-cafe" | "confiance";

/**
 * Parcours imposé dans l'encart « Parcours recommandé »
 * (components/blog/blog-article-parcours-maillage). Slug absent = parcours
 * déduit du cluster, comportement inchangé.
 */
export const FORTE_FRAPPE_PARCOURS: Readonly<Partial<Record<string, ParcoursSlug>>> = {
  // Premier message et vie de couple : oser écrire, oser plaisanter avec l'autre.
  "premier-message-drole-appli-de-rencontre": "confiance",
  "blagues-de-couple-drole": "confiance",
  // Anniversaire : sans entrée, la catégorie CATALOGUE le range dans « fort-volume »
  // (Machine à Café, l'humour de bureau), alors que 4 situations sur 5 sont privées
  // (pote, parents, fratrie, ami perdu de vue ; seule la carte du bureau ne l'est pas).
  // Répartie prolonge la promesse du CTA de l'article (« trouver la bonne phrase aussi
  // à l'oral ») : le chambrage entre potes et la phrase trouvée sur le moment, au
  // gâteau, pas seulement par écrit. Confiance vise un autre lecteur (celui qui se
  // croit pas drôle), pas quelqu'un qui cherche déjà quoi envoyer.
  "message-anniversaire-drole-par-situation": "repartie",
  // Refuser une invitation : savoir dire non avec une phrase qui fait sourire (notation B1 iter1).
  "refuser-une-invitation-avec-humour": "repartie",
  // Poisson d'avril : le CTA vend « la riposte » (notation A5 iter1).
  "blagues-poisson-d-avril-adultes": "repartie",
};
