/**
 * Interrupteur de publication du parcours Storytelling (s18).
 *
 * `false` : le parcours est importé en base mais INACTIF (`LearningPath.isActive = false`),
 * absent du hub, de l'offre, du quiz, des fiches, de llms.txt et de la page (404).
 * `true` : publié partout ; au démarrage suivant, la tâche `parcours-storytelling-sync`
 * pose `isActive = true` en base et ajoute le défi B du callback (étape 6).
 *
 * Activation (feu vert de Thomas seulement) : passer à `true`, commit, déploiement.
 * Voir REPLIT_ACTIONS.md (entrée s18). Module sans dépendance : importable côté client.
 */
export const STORYTELLING_PUBLIE = true;

/**
 * Interrupteur de publication du parcours Boulot (s19).
 *
 * `false` : le parcours est importé en base mais INACTIF (`LearningPath.isActive = false`),
 * absent du hub, de l'offre, des fiches, de llms.txt, du sitemap et de la page (404).
 * `true` : publié partout ; au démarrage suivant, la tâche `parcours-boulot-sync`
 * pose `isActive = true` en base.
 *
 * Activation (feu vert de Thomas seulement) : passer à `true`, commit, déploiement.
 * Voir REPLIT_ACTIONS.md (entrée s19). Les deux interrupteurs coexistent.
 */
export const BOULOT_PUBLIE = true;
