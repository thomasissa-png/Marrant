# Tailles de police au premier écran d'« Aujourd'hui » (échelle s25, tour 7 : décisions de Thomas du 16/11)

Sortie de `tailles-comptes.mjs` (connexion par `storageState`, comme `captures-sections.mjs`), préversion locale 5400, `main` seulement (hors en-tête global et bande des rubriques), premier écran : 375 x 812 et 1280 x 900. Clé = taille, graisse, famille (et `MAJ` si capitales). Les nœuds `sr-only` (phrase lue de l'aperçu, cap lu) sont comptés ; ils héritent de 16/400.

Tour 7 : aucune taille ni graisse ajoutée (le titre de Z1 reste en `TITRE_CARTE`, 20/600). Changent la couleur (plus de filet violet, fond de Z1, segments et barre en gris clair, lignes des semaines) et le placement (Z1 en colonne, pastilles du hero rangées, parcours et mission en 5 + 7). Gate PASS sur les 8 lignes.

## Résumé

| Compte | Largeur | Tailles | Combinaisons |
|---|---|---|---|
| visiteur | 375 | 4 (24px, 20px, 16px, 14px) | 6 |
| visiteur | 1280 | 4 (30px, 20px, 16px, 14px) | 6 |
| inscrit gratuit | 375 | 4 (24px, 20px, 16px, 14px) | 6 |
| inscrit gratuit | 1280 | 4 (30px, 20px, 16px, 14px) | 6 |
| abonné avancé | 375 | 4 (24px, 20px, 16px, 14px) | 6 |
| abonné avancé | 1280 | 4 (30px, 20px, 16px, 14px) | 6 |
| nouvel abonné | 375 | 4 (24px, 20px, 16px, 14px) | 6 |
| nouvel abonné | 1280 | 4 (30px, 20px, 16px, 14px) | 6 |

## Sortie complète

```

## visiteur 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Ton tableau de bord : chaque j
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## visiteur 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Ton tableau de bord : chaque j / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Commencer
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / Ton cap
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## gratuit 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Ton tableau de bord : chaque j
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## gratuit 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Ton tableau de bord : chaque j / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Commencer
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / Ton cap
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## en-cours 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes / Tu te lances
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | La bonne réponse qui te vient  / Tu te lances, cap 2 sur 5
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 1 situation nouvelle, 1 carte  / Amis : « Tu as changé quelque 
14px 600 __Inter_f4e4db                  | S’entraîner / Nouvelle / Ton cap
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## en-cours 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes / Tu te lances / 250
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | La bonne réponse qui te vient  / Tu te lances, cap 2 sur 5 / Pense à un petit ridicule réce
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 1 situation nouvelle, 1 carte  / Amis : « Tu as changé quelque 
14px 600 __Inter_f4e4db                  | S’entraîner / Nouvelle / Ton cap
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## nouvel 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu / Tu t’échauffes / Répartie
16px 600 __Inter_f4e4db                  | Commencer
16px 400 __Inter_f4e4db                  | Tu t’échauffes, cap 1 sur 5
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## nouvel 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu / Tu t’échauffes / Répartie
16px 600 __Inter_f4e4db                  | Commencer / Pas moi.
16px 400 __Inter_f4e4db                  | Tu t’échauffes, cap 1 sur 5 / Le micro de la salle capte les
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6
```
