# Notation growth des bannières s15, cycle 2 (06/10/2026)

> @growth. Lu : `index.md`, `notation-growth.md` (cycle 1), les 15 PNG ouverts un par un (6 visuels, 6 contrôles, 3 aperçus mobiles), bios (`corrections-cycle7-copy.md` §5), `strategie-relance-v5.md` §2, `lib/liens.ts` (liste blanche UTM), `founder-preferences.md`. Pas de shell : cotes lues sur les images (±5 px), cohérentes avec `index.md`. Test : en 2 secondes, une raison de suivre et un chemin vers le site.
> Unit economics : budget 0 €, CAC direct nul, lecture à J+28 (`mesure.md`). `[HYPOTHÈSE : une bannière plus claire augmente le taux d'abonnement par visite de profil ; relever visites de profil et abonnés avant/après]`

## Notes

| Visuel | Cycle 1 | Cycle 2 | Verdict |
|---|---|---|---|
| X A message + quiz | 8 | **10** | Promesse à 22 px, ligne d'appel à 13 px, photo ronde dégagée, 0 pixel dans la photo et les recadrages |
| LinkedIn B aplat | 8 | **10** | Titre 18 px (bureau, Sophie), sous-titre impératif 13 px (quiz), logo sans collision (texte dès x 300, fin x 929) |
| Instagram Quiz | 9 | **10** | Première position, « ? » lisible à 64 px, nom « Quiz » dessous |
| Instagram Vannes (micro) | 8 | **10** | Le micro de scène remplace les « » lus comme « précédent / suivant » |
| Instagram Conseils | 9 | **10** | Ampoule, trait identique aux autres, centrée (540, 960) |
| Instagram Répartie | 6 (Bureau) | **9** | Bon sujet (promesse n°1, douleur de Yanis), mais glyphe trop gros : rayon 328 px sur 360, soit 3 px de marge dans un cercle de 64 px, contre 112 px de marge pour le Quiz |

**Règles : toutes passent.** Aucun prix, aucun « gratuit », aucun compte gratuit (« sans inscription » = le quiz, FAQ vérifiée), aucun tiret cadratin (2 textes relus), aucune IA, aucun « je » de marque, aucune photo ni nom du fondateur (le « d » des aperçus est un simulacre). Bios : X reprend la promesse de la bio X + le quiz ; LinkedIn reprend la bio 2 (« des vannes pour le bureau, un quiz pour ton profil d'humour ») ; Instagram = les 4 blocs de `/liens` (quiz, vannes, conseils, parcours Répartie). Réserve des bios : « une vanne par jour » reste vrai tant que la vanne du jour est publiée chaque jour.

## Mes corrections du cycle 1, point par point

- **X A : fait.** Monogramme et adresse retirés ; ligne unique Inter 52 `#D4D4D4`, alignée à droite, x 598 à 1388 (après 580), y 356 à 406 ; X B supprimée (sans objet : lot `cs14jk90226d6abb90287724` non concerné).
- **LinkedIn B : fait, 2 écarts acceptés.** Sous-titre « Fais le quiz de ton profil d'humour. » 38 px, marges 54 et 36 px (≥ 20), ni pied ni URL. Écarts : `#EDE9FE` au lieu de `#DDD6FE` (contraste 6:1) et titre 52 px au lieu de 54 (fin x 982 sous la limite 1014 du recadrage mobile). Bouton de page « Visiter le site web » : **pas fait**, hors PNG, geste de Thomas (ligne 2 ci-dessous). LinkedIn A supprimée.
- **Instagram : fait sauf 2 points.** Répartie remplace Bureau (deux bulles, sans libellé par arbitrage) ; Vannes refait en micro ; Quiz en 1re position. Pas fait : Répartie en 2e position (livrée 4e par arbitrage, sans effet : les 4 cercles tiennent d'un coup sur 390 px) ; story du Quiz et 3 cartes Conseils : gestes de Thomas ci-dessous. Évolution de ma position : Conseils reçoit un sticker lien (un conseil sans lien est une impasse, et conseils prime sur vannes, P0 s8).

## Correction exacte (note < 10)

**Instagram Répartie (9 vers 10)** : régénérer `instagram-alaune-repartie.png`, mêmes deux bulles, boîte de 420 px au lieu de 520 (centre (540, 960) inchangé), trait inchangé à 61 px (`stroke-width` 3,5 en viewBox 24 au lieu de 2,8). Contrôle : rayon maximal mesuré ≤ 270 px (aujourd'hui 328), bulles toujours ouvertes (intérieur ≥ 150 px), aperçu mobile relu à côté des 3 autres cercles.

## Marche à suivre pour Thomas (6 lignes)

1. **X** : Modifier le profil, en-tête = `x-entete.png` ; lien du profil = `https://deviens-marrant.fr/liens/x` (la page pose `utm_source=x`, n'ajoute aucun UTM).
2. **LinkedIn** : page, Modifier, couverture = `linkedin-couverture.png` ; site web et bouton « Visiter le site web » = `https://deviens-marrant.fr/liens/li` `[À VÉRIFIER : bouton personnalisable dans l'interface]`.
3. **Instagram** : lien de bio unique = `https://deviens-marrant.fr/liens` ; publier 4 stories, puis les classer à la une dans l'ordre Quiz, Vannes, Conseils, Répartie (noms exacts), couverture = `instagram-alaune-<nom>.png` `[À VÉRIFIER : Buffer ne gère pas les stories à la une]`.
4. **Story derrière chaque couverture** (sans prix, sans compte) : Quiz = texte « Quel est ton profil d'humour ? Environ 2 minutes, sans inscription. » ; Vannes = une carte vanne déjà publiée ; Conseils = une carte conseil déjà publiée ; Répartie = une carte déjà publiée + « Avoir de la répartie, étape par étape. »
5. **Sticker lien** = `https://deviens-marrant.fr` + chemin + `?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=` + valeur : Quiz `/quiz-humour` `bio-quiz` ; Vannes `/vannes` `bio-vannes` ; Conseils `/conseils` `bio-conseils` ; Répartie `/parcours/repartie` `bio-parcours` (4 valeurs de la liste blanche, jamais `/register` ni `/abonnement`).
6. **Avant** : ouvrir `/liens`, `/liens/x`, `/liens/li` en production (`/liens/ig` doit rester 404). **Après** : regarder les 3 bannières sur un vrai téléphone (zones sûres non mesurées dans les applis) et relever visites de profil et abonnés à J+28.

## Handoff @orchestrator
- Fichier : `/home/user/Marrant/docs/social/visuels-s15/bannieres/notation-growth-cycle2.md`. Décisions : X A, LinkedIn B, Instagram Quiz, Vannes, Conseils à 10 ; Répartie 9 vers 10 après réduction du glyphe (@design, 1 PNG) ; sticker Conseils ajouté.
- À faire : @design régénère Répartie ; Thomas pose les 6 gestes ; mise à jour de l'historique des interventions de `project-context.md` par la session (non lu en entier : 37 000 tokens).
