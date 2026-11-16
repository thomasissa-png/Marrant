# Relecture design à l'aveugle, s25 navigation v6, tour 6, groupe « parcours »

Périmètre : `/parcours` et `/parcours/repartie`, comptes visiteur, gratuit, en-cours, nouvel. Captures : `docs/captures/s25/v6-tour-6/parcours/`.

## Ce qui a été ouvert
- 1280 : les 8 captures (4 comptes x 2 pages).
- 375 : visiteur (2 pages), nouvel (/parcours), en-cours (/repartie).
- 1920 : visiteur (2 pages), nouvel (/repartie).
- 768 : visiteur /parcours.
- Étalon : `visiteur-accueil-1280.png`. Code lu : `sommaire-parcours.tsx`, `lignes-fiches.tsx`, début de `parcours-detail.tsx`.

**Limite de la preuve.** Les captures pleine page à 375 (5 800 à 7 700 px de haut) ne me sont rendues qu'à 100-130 px de large. Je n'y juge que la structure (une colonne, ordre des blocs, absence de débordement), pas les contrastes, ni les alignements au pixel, ni la taille des cibles. Les largeurs 1280 et 1920 sont lisibles. Les 1456 sont, d'après l'INDEX, de même hauteur que les 1280 (coque plafonnée à 1216) : non ouvertes, aucun doute de mise en page.

## Constats vus (sans faute dure)
1. Boutons de `/parcours` conformes à la spec B15 : un plein par carte pour le visiteur et l'inscrit gratuit (« Tester l'étape 1 de {parcours}, gratuite »), ligne frontière `text-xs` dessous (« Sans compte. La suite : Premium. » visiteur, « La suite : Premium. » gratuit), jamais deux pleins dans une même carte, aucun Premium sur les cartes. Le libellé diffère du patron « Lire la première étape gratuite de … » cité au §4 B15 : signalé, pas retenu (libellé validé, texte non réécrit par moi).
2. Abonné : un seul plein par carte, plein pour la carte à reprendre, contour pour les autres (en-cours : Machine à Café plein, Répartie en contour ; nouvel : Répartie plein). Au premier écran, bloc « Tes 4 premières semaines » avec son plein (`Reprendre` / `Commencer l'étape 1`) puis « Ton cap » : jamais deux pleins dans le même écran à 1280 (second plein à y ≈ 1 430 sur 800 de haut).
3. Cibles tactiles vérifiées au code : « Reprendre / Voir / Commencer » du sommaire = `min-h-11` ; « Voir » des fiches = `min-h-11`. Pas de faute 44 px.
4. `/parcours/repartie` visiteur et gratuit : décision s19 respectée pour l'abonné (argumentaire après le programme). Visiteur : un seul plein de page (« Passer à l'étape 2 · 1,99 €/mois »), avec prix et garantie juste dessous (conforme §1.3), lien discret « Jette un œil au parcours suivant ». Étapes 2+ repliées avec cadenas, sans plein dedans (conforme §3.4).
5. Abonné /repartie : progression « 2 sur 4 étapes », « Fait » en texte avec coche, un seul plein (`Reprendre`), `Voir` en contour. Les états sont lisibles et l'étape courante est ouverte.
6. Vignettes vidéo en dégradé uni : préversion locale, non retenu.
7. Aucun débordement horizontal ni colonne collée à gauche à 375, 768, 1280, 1920 sur ce que j'ai ouvert. Contenu plafonné et centré à 1280+ (cartes 1216, colonne de lecture 768), identique entre 1280 et 1920 : voulu.

## Notes

### Design
| Critère | Note | Raison |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Cartes `rounded-xl` à filet violet en haut, pastilles, titres de section centrés, rythme aéré : OK. Le H1 `/parcours` est blanc, ≈ 32 px, sans mot en violet, alors que le hero de l'accueil joue le violet. Piste. |
| 2 Hiérarchie, lisibilité | 9 | Titre puis intro puis quiz puis cartes : clair. Texte `Voir` en contour sombre peu marqué (abonné /repartie). Piste. |
| 3 Mise en page 5 largeurs | 9 | Boulot (5e carte) centrée seule sous une grille 2 colonnes à 1280+ : volontaire, propre. Vide interne d'environ 60 px dans la carte Confiance entre la citation et « PROGRAMME » (cartes de même hauteur) : piste. |
| 4 Cohérence avec l'espace | 9 | Mêmes cartes, mêmes filets, mêmes titres que l'accueil et l'espace. |
| 5 Finition | 9 | Aucune faute dure. 375 non jugeable au pixel (limite de la preuve). Barre de progression vide du « nouvel » (`/repartie`, `bg-background-elevated`) presque invisible sur la carte : piste. |

### UX
| Critère | Note | Raison |
|---|---|---|
| 1 Compréhension | 9 | On sait où on est (Parcours actif dans la bande, titre) et quoi faire (un bouton par parcours). |
| 2 Action principale | 9 | Une action pleine par carte ; abonné : l'action à reprendre est la seule pleine. |
| 3 États vides, nouvel abonné | 9 | « Commencer l'étape 1 », « Ton cap 1 sur 5 », « 0 sur 4 étapes » avec « Commencer » : jamais une page morte. |
| 4 Aperçu Premium | 10 | `/parcours` est l'aperçu public (spec nav v6 §2) : valeur visible, une seule offre à la fin d'étape 1, pas de mur. |
| 5 Accessibilité, cohérence comptes | 9 | Cibles 44 px confirmées au code, statut « Fait » en texte, cohérence visiteur/gratuit/abonné. Contraste fin non mesurable sur les captures 375. |

## Pistes (ne retiennent pas la note)
- Ajouter un mot en `text-accent-link` dans le H1 `/parcours` pour coller au hero de l'accueil : `apps/web/src/components/parcours/parcours-content.tsx` (texte du titre validé : proposition de forme seulement, à valider par Thomas).
- Cartes de la grille : `Programme` calé en bas via flex colonne (`mt-auto`) déjà en place ; le vide dans Confiance vient de la hauteur de Storytelling, acceptable.
- Piste de finition : bordure du bouton `outline` `Voir` et piste de la barre du sommaire un cran plus clairs (`apps/web/src/components/espace/parcours/sommaire-parcours.tsx`, `border-border-strong` / `bg-border`) à vérifier à l'œil sur le thème avant de coder.

## Verdict
NOTE GLOBALE : 9/10. Aucune faute dure. Réserve : 375 jugé sur la structure seulement.
