/**
 * Articles de blog suivis dans le rapport hebdomadaire des visites
 * (section « Blog : articles à forte frappe »). Ajouter un slug ici suffit :
 * pages vues, clics, partages et taux de lecture sont lus dans Umami
 * (filtre path `/blog/<slug>`), le statut de publication en base.
 */
export const TRACKED_ARTICLES = [
  "meilleures-blagues-droles-2026",
  "message-anniversaire-drole-par-situation",
  "voeux-drole-nouvelle-annee",
  "premier-message-drole-appli-de-rencontre",
  "blagues-de-couple-drole",
  "blagues-poisson-d-avril-adultes",
  // Lot B
  "refuser-une-invitation-avec-humour",
  "blagues-de-gamer-jeux-video",
  "mot-de-depart-collegue-drole",
  "message-drole-fete-des-meres",
  "message-drole-fete-des-peres",
  "blagues-vacances-ete-entre-amis",
] as const;
