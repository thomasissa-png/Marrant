# Tailles de police au premier écran d'« Aujourd'hui » (échelle s25, tour 13)

Sortie de `tailles-comptes.mjs` (connexion par `storageState`, comme `captures-sections.mjs`), préversion locale 5400, `main` seulement (hors en-tête global et bande des rubriques), premier écran : 375 x 812, 768 x 900, 1280 x 900 et 1920 x 900. Clé = taille, graisse, famille (et `MAJ` si capitales). Les nœuds `sr-only` sont comptés.

Tour 13 : aucune taille ni combinaison ajoutée. Libellés des répliques fermées en `META_FORT` (14/600) ; H1 de l'aperçu en texte dégradé, même `TITRE_PAGE` (24/600 puis 30/600) ; promesse T1 en `TEXTE` (16/400). Gate PASS sur les 16 lignes ; aucune capitale ; graisses 400 et 600 seulement.

## Résumé

| Compte | Largeur | Tailles | Combinaisons |
|---|---|---|---|
| visiteur | 375 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| visiteur | 768 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| visiteur | 1280 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| visiteur | 1920 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| gratuit | 375 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| gratuit | 768 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| gratuit | 1280 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| gratuit | 1920 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| en-cours | 375 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| en-cours | 768 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| en-cours | 1280 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| en-cours | 1920 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| nouvel | 375 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| nouvel | 768 | 4 (24px,, 20px,, 16px,, 14px) | 6 |
| nouvel | 1280 | 4 (30px,, 20px,, 16px,, 14px) | 6 |
| nouvel | 1920 | 4 (30px,, 20px,, 16px,, 14px) | 6 |

## Détail

```
## visiteur 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## visiteur 768 x 900
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## visiteur 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Je suis la roulette de gauche.
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## visiteur 1920 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Je suis la roulette de gauche.
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## gratuit 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## gratuit 768 x 900
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## gratuit 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Je suis la roulette de gauche.
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## gratuit 1920 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu / Tu t’échauffes
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Cinq minutes par jour pour ose / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Je suis la roulette de gauche.
14px 600 __Inter_f4e4db                  | Premium / Ton premier pas / La sûre
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

## en-cours 768 x 900
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes / Tu te lances / 250
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | La bonne réponse qui te vient  / Tu te lances, cap 2 sur 5
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 1 situation nouvelle, 1 carte  / Amis : « Tu as changé quelque 
14px 600 __Inter_f4e4db                  | S’entraîner / Nouvelle / Ton cap
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## en-cours 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes / Tu te lances / 250
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | La bonne réponse qui te vient  / Tu te lances, cap 2 sur 5 / Raconter une anecdote qu’on éc
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 1 situation nouvelle, 1 carte  / Amis : « Tu as changé quelque 
14px 600 __Inter_f4e4db                  | S’entraîner / Nouvelle / Ton cap
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## en-cours 1920 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes / Tu te lances / 250
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | La bonne réponse qui te vient  / Tu te lances, cap 2 sur 5 / Raconter une anecdote qu’on éc
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

## nouvel 768 x 900
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu / Tu t’échauffes / Répartie
16px 400 __Inter_f4e4db                  | Un samedi chez un ami. Quelqu’ / Tu t’échauffes, cap 1 sur 5 / Tes premières répliques
16px 600 __Inter_f4e4db                  | Commencer
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6

## nouvel 1280 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu / Tu t’échauffes / Répartie
16px 400 __Inter_f4e4db                  | Un samedi chez un ami. Quelqu’ / Tu t’échauffes, cap 1 sur 5 / Tes premières répliques
16px 600 __Inter_f4e4db                  | Commencer
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6

## nouvel 1920 x 900
30px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu / Tu t’échauffes / Répartie
16px 400 __Inter_f4e4db                  | Un samedi chez un ami. Quelqu’ / Tu t’échauffes, cap 1 sur 5 / Tes premières répliques
16px 600 __Inter_f4e4db                  | Commencer
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 4 30px, 20px, 16px, 14px | COMBINAISONS : 6
```
