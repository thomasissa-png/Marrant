# Rendu itération 5 : relecture visuelle @design, Parcours Boulot (état publié) et non-régression (s19, 11/10/2026)

Base : `docs/qa/captures-parcours-boulot-s19/` (index, 110 PNG) et `.../regression/` (index, 94 PNG). Relecture précédente : `rendu-iter-4-design.md` (Boulot 10, non-régression 10, suggestions G et H, défauts N-1 à N-3). Corrections lues : `implementation.md`, section « Rendu itération 5 » (87ba351). Aucun code ni token modifié. Les [CHOIX UTILISATEUR] ne sont pas re-questionnés.

## Ce qui a été réellement regardé (Read sur les PNG)

- **Boulot publié, éléments** : `premium-375-etape2-version-sans-risque`, `premium-375/1280-etape6-version-sans-risque`, `premium-375/1280-etape3-version-sans-risque` (témoin : critère dans le repli), `visiteur-375-quiz-orientation-q1-icone`, `visiteur-375-quiz-orientation-q2-apres-boulot`, `visiteur-375-quiz-orientation-boulot-raconter` (résultat et nouvelle raison), `premium-375-onboarding-tout-boulot-resultat`.
- **Anciens parcours, éléments** : `regression/machine-a-cafe-375-premium-etape2-typographie`, `regression/confiance-375-premium-etape2-typographie`, `regression/{machine-a-cafe,repartie,confiance}-{375,1280}-premium-etape2-exemple-defi` (6 sur 6), `regression/quiz-375-boulot-masque-quiz-orientation-q1-icone`, `regression/onboarding-375-tout-boulot-masque-resultat`, `regression/repartie-375-visiteur-apercu-etape2`.
- **Anciens parcours, pleines pages (vue réduite : structure et enchaînement seulement)** : `regression/machine-a-cafe-375-premium-etape2`, `regression/repartie-375-premium-etape2`, `regression/confiance-375-visiteur-etape1`, `regression/confiance-1280-premium-etape2`.
- **Non relu cette fois** : carte de progression (en cours, erreur), hub, cartes de fin, étapes 4 et 5, variantes 768, Storytelling. Rien n'a été modifié de ce côté à l'itération 5 d'après `implementation.md`, mais je ne le certifie pas sur capture. Détail typographique jugé sur éléments (343 à 768 px), jamais sur une pleine page réduite.

## Notes

| | Note | Pourquoi |
|---|---|---|
| **Parcours Boulot (état publié)** | **10 / 10** | Aucun bloquant. N-3 corrigé et prouvé, critère décollé du repli (G, corrigé à moitié, suffisant), titre du repli plus lisible. 2 défauts neufs, mineurs, non bloquants (N-4, N-5) |
| **Non-régression des 4 parcours en ligne** | **10 / 10** | R-1 (coupes « : » et « réécris-le ») est corrigé sur Machine à Café et Confiance, sans aucune dégradation vue sur Répartie ni sur les aperçus verrouillés. Boulot reste invisible avec l'interrupteur à `false` (☕, « Parcours Machine à Café », onboarding inchangé) |

## Statut de G, H, N-1, N-2, N-3

| Point | Statut | Preuve vue |
|---|---|---|
| **G** Critère de réussite sous l'encadré | **Corrigée à moitié, suffisante** | Étape 2 (375) : « C'est gagné si ton PS tient en une phrase… » est maintenant séparé du repli par un blanc net (environ 20 px contre 12 px entre défi et repli) et ne se lit plus comme la fin du repli. Étape 6 (375 et 1280), même effet : repli pointillé, blanc, critère. **Non traité** : l'amorce (semi-gras) n'a pas été posée, par choix annoncé. À l'étape 6 en 375, le critère reste le plus long paragraphe de la section (9 lignes) et se lit encore comme du texte courant, suivi de la note « Ici, … » de même corps et de même couleur, séparée de 12 px seulement : le bloc de 2 à 3 paragraphes semblables demeure. La lecture est juste, la hiérarchie fine ne l'est pas. Non bloquant |
| **H** Typographie française sur les anciens parcours | **Corrigée et prouvée** | Machine à Café 375 (`etape2-typographie`, `exemple-defi`) : « Tu as ta phrase, mais tu ne dis / rien : tu laisses… » et « Alors, / très calme : « Ils ont validé ? » » : plus aucune ligne ne commence par « : ». Confiance 375 : « Écris-le d'abord… », « puis / réécris-le en fait raconté » : plus de « réécris- / le ». Même propreté en 1280 sur les 3 parcours, et sur Répartie 375 et 1280 (aucun signe haut orphelin). Texte inchangé à l'œil, interlignes et encadrés identiques à l'itération 4. Aperçu verrouillé de Répartie (« Ce que tu vas apprendre ») : retours à la ligne naturels, aucun orphelin, aucune ligne trop courte |
| **N-1** Poids du repli (titre et pointillés) | **Partiellement corrigée** | Titre « Version sans risque » en 13 px, graisse 500, gris : à côté de « DÉFI X » (14 px, 600, blanc), les deux niveaux sont bien distincts en 375 (étapes 2, 3, 6) et en 1280, et le titre se lit mieux qu'en 12 px. La bordure en pointillés reste très discrète sur fond sombre (surtout en 375, étape 6). **Contraste du gris 13 px et de la bordure non mesuré à l'outil par moi** : reste à @qa (F, I) |
| **N-2** Rappel e-mail absent sur Boulot en erreur | **Non traitée, non relue** | Aucun changement à l'itération 5, je n'ai pas re-regardé `premium-375-carte-progression-erreur`. Reste en l'état : probable état du compte de test [HYPOTHÈSE non vérifiée]. Action @fullstack inchangée |
| **N-3** Icône ☕ vers Boulot | **Corrigée et prouvée** | Publié (`visiteur-375-quiz-orientation-q1-icone`) : 💼 sur « Au boulot, en réunion, à la pause », 🎉 et 🌱 inchangés. Masqué (`regression/quiz-375-boulot-masque-quiz-orientation-q1-icone`) : ☕ comme en ligne. Le résultat « Parcours Boulot » porte bien la même icône que la carte du hub. Q2 après « Au boulot » : « Question 2/2 », 3 réponses lisibles, 2 lignes maximum, sans coupe gênante |

## Défauts bloquants

Aucun, ni sur Boulot ni sur la non-régression. Aucune régression de typographie sur les anciens parcours.

## Défauts neufs (non bloquants)

**N-4. Voix de la raison du quiz** (`visiteur-375-quiz-orientation-boulot-raconter`, `premium-375-onboarding-tout-boulot-resultat` contre `regression/onboarding-375-tout-boulot-masque-resultat`)
- Constat : la nouvelle raison « Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. » décrit le parcours. Les raisons des autres résultats parlent de la personne (« Tu veux avoir de quoi raconter à la pause, autre chose que la météo. »). Visuellement c'est propre : 3 lignes en 343 px (quiz) comme en onboarding, pas d'orphelin, « au / boulot » coupé sans gêne. C'est une différence de registre, pas de mise en page.
- À faire : rien côté design. Si @ux veut un registre « tu » homogène, c'est un choix de copy, non requis. Texte déjà tranché (phrase validée de la fiche).

**N-5. Longueur de ligne du critère à 1280** (`premium-1280-etape6-version-sans-risque`)
- Constat : sorti de l'encadré, le critère occupe toute la largeur de la colonne, environ 120 à 130 caractères par ligne, plus long que dans les encadrés (texte retiré). Lisible, mais proche de la limite de confort. Même cause à l'étape 3 pour la note « Ici, … » (une ligne, aucun souci).
- Correction optionnelle : `max-w-prose` sur le bloc « suite du défi ». Cosmétique, à décider avec G si l'amorce est un jour retenue.

## Boulot publié : le reste

- Étape 2 (375) : « Aller au défi » et enchaînement inchangés, défi encadré, repli, critère, note, « Alors, ce défi ? » : hiérarchie à 4 niveaux nette (défi plein, repli pointillé, critère, retour d'exercice). Étape 3 : critère propre au repli, note « Ici, … » seule en dessous, cohérent.
- Étape 6 (1280) : défi violet teinté dominant, repli secondaire, critère et note alignés sur le bord extérieur des encadrés comme à l'itération 4.
- Résultat du quiz et onboarding : bouton plein « Voir ce parcours » / « Voir par où commencer » dominant, texte gris lisible, aucune coupe.

## Pour déployer

1. Rien de bloquant : G, N-1 (contraste), N-2, N-4, N-5 ne conditionnent pas le déploiement.
2. Seul point de contrôle ouvert : mesure de contraste par @qa (titre 13 px gris et bordure pointillée, dans les deux modes si applicable).
3. Ne rien déployer sous `BOULOT_PUBLIE = true` hors feu vert de Thomas et sans entrée `REPLIT_ACTIONS.md`.

---
**Handoff → @orchestrator (puis @fullstack pour N-2 ; @qa pour le contraste)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-5-design.md`
- Décisions : Boulot publié 10/10, non-régression 10/10 ; H et N-3 corrigés et prouvés ; G corrigé à moitié (décollement fait, pas d'amorce, suffisant) ; N-1 partiel (13 px lisible, pointillés discrets, contraste non mesuré) ; N-2 non traité et non relu ; 0 bloquant, 0 régression typographique ; 2 défauts neufs mineurs (N-4 registre de la raison du quiz, N-5 longueur de ligne du critère en 1280)
- Points d'attention : aucun code ni token modifié ; carte de progression, hub, cartes de fin, étapes 4 et 5 et Storytelling non relus cette fois ; pleines pages 375 lues en vue réduite, détail jugé sur captures d'élément ; hypothèse marquée (N-2)
---
