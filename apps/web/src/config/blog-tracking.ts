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
] as const;
