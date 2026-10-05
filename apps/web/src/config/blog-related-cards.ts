/**
 * Cartes « À lire ensuite » des articles forte frappe en base (notation B4 iter1).
 *
 * Sans entrée, un article CATALOGUE en base tombe dans le cluster `fort-volume`
 * par sa catégorie et hérite de ses satellites (« Comment faire rire une fille »
 * sous un message pour la fête des mères). Ici, chaque article liste ses voisins
 * de même intention, par ordre de pertinence ; l'étalon `meilleures-blagues-droles-2026`
 * est ajouté en dernier recours (lib/blog-related). Un slug non publié ou programmé
 * est sauté (lib/blog-visibility) : la carte suivante prend sa place.
 *
 * « Comment faire rire une fille / un homme » n'apparaît que là où il prolonge
 * l'article (premier message, couple).
 */
export const FORTE_FRAPPE_RELATED: Readonly<Partial<Record<string, readonly string[]>>> = {
  // Messages à envoyer, occasions de famille et de calendrier.
  "message-anniversaire-drole-par-situation": [
    "message-drole-fete-des-meres",
    "message-drole-fete-des-peres",
    "voeux-drole-nouvelle-annee",
    "mot-de-depart-collegue-drole",
  ],
  "voeux-drole-nouvelle-annee": [
    "message-anniversaire-drole-par-situation",
    "mot-de-depart-collegue-drole",
    "message-drole-fete-des-meres",
    "message-drole-fete-des-peres",
  ],
  "message-drole-fete-des-meres": [
    "message-drole-fete-des-peres",
    "message-anniversaire-drole-par-situation",
    "voeux-drole-nouvelle-annee",
  ],
  "message-drole-fete-des-peres": [
    "message-drole-fete-des-meres",
    "message-anniversaire-drole-par-situation",
    "voeux-drole-nouvelle-annee",
  ],
  // Messages à envoyer, vie sociale et bureau.
  "mot-de-depart-collegue-drole": [
    "refuser-une-invitation-avec-humour",
    "voeux-drole-nouvelle-annee",
    "message-anniversaire-drole-par-situation",
  ],
  "refuser-une-invitation-avec-humour": [
    "mot-de-depart-collegue-drole",
    "message-anniversaire-drole-par-situation",
    "voeux-drole-nouvelle-annee",
  ],
  // Séduction et couple : ici, faire rire une fille / un homme est dans le sujet.
  "premier-message-drole-appli-de-rencontre": [
    "blagues-de-couple-drole",
    "comment-faire-rire-une-fille",
    "comment-faire-rire-un-homme",
  ],
  "blagues-de-couple-drole": [
    "premier-message-drole-appli-de-rencontre",
    "comment-faire-rire-une-fille",
    "comment-faire-rire-un-homme",
  ],
  // Blagues par situation, entre potes.
  "blagues-poisson-d-avril-adultes": [
    "meilleures-blagues-droles-2026",
    "blagues-vacances-ete-entre-amis",
    "blagues-de-gamer-jeux-video",
  ],
  "blagues-de-gamer-jeux-video": [
    "meilleures-blagues-droles-2026",
    "blagues-poisson-d-avril-adultes",
    "blagues-vacances-ete-entre-amis",
  ],
  "blagues-vacances-ete-entre-amis": [
    "meilleures-blagues-droles-2026",
    "blagues-poisson-d-avril-adultes",
    "blagues-de-gamer-jeux-video",
  ],
};
