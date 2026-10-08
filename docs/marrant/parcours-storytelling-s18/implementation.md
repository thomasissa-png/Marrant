# Import du parcours Storytelling : plan d'implémentation (s18, @fullstack)

Source du contenu (validé) : `docs/copy/etalons-parcours-storytelling-s18.md` (§1 à §5) et `docs/copy/parcours-storytelling-etapes-2-6-s18.md`. Squelette, XP, dayNumber : spec s17 §2 et annexe A.1.

## Décisions d'architecture

1. **Un seul interrupteur** : `STORYTELLING_PUBLIE` dans `apps/web/src/config/parcours-publication.ts` (`false` à la livraison). Activation = passer à `true` + déployer ; la tâche de démarrage aligne `LearningPath.isActive` sur cette valeur.
2. **Contenu dans un fichier à part** : `docs/content/parcours-storytelling-s18.json` (même forme qu'une entrée de `parcours-seed.json`). Il n'entre dans la liste des parcours (hub, llms.txt, fiches, quiz, progression, rappels, page) que si l'interrupteur est à `true`, via `src/lib/parcours-seed.ts` (liste unique). Ainsi, rien ne fuit tant que le parcours est inactif, et `prisma db seed` ne le crée jamais.
3. **Repli seed de la page** : un parcours absent de la liste publiée n'est jamais reconstruit depuis le seed (404 tant qu'inactif).

## Tâche de démarrage `parcours-storytelling-sync.ts` (idempotente, fail-safe)

- Conseils : relit les 3 ids de l'audit s14, vérifie le titre, pose le texte validé (contenu, exemple, défi) et `isActive = true` dans une transaction avec un marqueur `DataPatch` qui garde l'ancien texte (retour arrière). Même chose pour les retouches de défi des étapes 3 (repli solo) et 6 (défi B), et le titre du callback (« vanne », `previousTitle`).
- Vannes neuves de l'étape 5 : créées si absentes (rapprochement par `content` exact), marqueur par vanne.
- Parcours : créé s'il manque (`isActive` = interrupteur), 6 étapes créées ou réalignées (conseil, dayNumber), `isActive` réaligné à chaque démarrage.
- Rapport : vannes des 6 étapes retrouvées par texte exact et actives, dans les journaux.

## Code

- `nextParcoursRanking` (spec §5.5) dans le seed et `pickSuite` : en cours d'abord, puis classement, puis `order` ; phrase = `nextParcoursReason` ou `personaTagline`.
- Quiz : profil Storyteller vers `storytelling` (accroche 4 A) seulement si publié.
- Types `ParcoursSlug`, offre Premium (`PREMIUM_PARCOURS`) et métadonnées de page conditionnées par l'interrupteur.

## Tests, build, captures

Test de contenu `parcours-contenu-s18-storytelling.test.ts` ; `tsc`, lint, build, Jest complet ; captures locales avec l'interrupteur forcé (jamais committé) dans `docs/qa/captures-parcours-storytelling-s18/`.

## Manques signalés (aucune invention)

- Étape 1 : questions 3 et 4 du quiz non écrites (étalons §3) : import avec 2 questions, à compléter par @copywriter avant activation.
- `nextParcoursReason` de Storytelling non écrit : repli sur la `personaTagline` du parcours proposé.
- `icon` à choisir par @design : provisoire.
