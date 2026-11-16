# Tailles de police au premier écran d'« Aujourd'hui » (échelle s25)

Sortie de `tailles.mjs` (copie avec connexion par `storageState`, comme `captures-sections.mjs`), préversion locale 5400, `main` seulement (hors en-tête global et bande des rubriques), premier écran : 375 x 812 et 1280 x 900. Clé = taille, graisse, famille (et `MAJ` si capitales). Les nœuds `sr-only` (phrase lue de l'aperçu, cap lu) sont comptés, comme dans le script ; ils héritent de 16/400.

## Résumé avant (HEAD ae15ed80) et après

| Compte | Largeur | Avant : tailles | Avant : combinaisons | Après : tailles | Après : combinaisons |
|---|---|---|---|---|---|
| visiteur | 375 | 8 (36px, 24px, 20px, 18px, 16px, 15px, 14px, 12px) | 11 | 4 (24px, 20px, 16px, 14px) | 6 |
| visiteur | 1280 | 8 (60px, 30px, 24px, 20px, 18px, 16px, 14px, 12px) | 13 | 4 (30px, 20px, 16px, 14px) | 6 |
| inscrit gratuit | 375 | 8 (36px, 24px, 20px, 18px, 16px, 15px, 14px, 12px) | 11 | 4 (24px, 20px, 16px, 14px) | 6 |
| inscrit gratuit | 1280 | 8 (60px, 30px, 24px, 20px, 18px, 16px, 14px, 12px) | 13 | 4 (30px, 20px, 16px, 14px) | 6 |
| abonné avancé | 375 | 6 (30px, 24px, 20px, 16px, 14px, 12px) | 8 | 4 (24px, 20px, 16px, 14px) | 6 |
| abonné avancé | 1280 | 7 (36px, 30px, 20px, 18px, 16px, 14px, 12px) | 11 | 4 (30px, 20px, 16px, 14px) | 6 |
| nouvel abonné | 375 | 7 (30px, 24px, 20px, 18px, 16px, 14px, 12px) | 9 | 4 (24px, 20px, 16px, 14px) | 6 |
| nouvel abonné | 1280 | 7 (36px, 30px, 20px, 18px, 16px, 14px, 12px) | 9 | 4 (30px, 20px, 16px, 14px) | 6 |

## Sortie complète, après

```

## visiteur 375 x 812
24px 600 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu
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
20px 600 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Quelqu’un te lance « Tiens, tu
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

## Sortie complète, avant (HEAD ae15ed80)

```

## visiteur 375 x 812
36px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
24px 700 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu
20px 700 __Plus_Jakarta_Sans_8f0720      | 1 500+
18px 400 __Inter_f4e4db                  | Ton tableau de bord : chaque j
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d
15px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium
14px 400 __Inter_f4e4db                  | inscrits bossent leur humour. / Connexion / 5 min
12px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
12px 600 __Inter_f4e4db                  | Premium
12px 600 __Inter_f4e4db MAJ              | Ton premier pas
TAILLES DISTINCTES : 8 36px, 24px, 20px, 18px, 16px, 15px, 14px, 12px | COMBINAISONS : 11

## visiteur 1280 x 900
60px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
30px 700 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu
24px 400 __Inter_f4e4db                  | Ton tableau de bord : chaque j
24px 700 __Plus_Jakarta_Sans_8f0720      | La suite est dans Premium
20px 700 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Tu t’échauffes
18px 700 __Plus_Jakarta_Sans_8f0720      | Répartie / À voix haute, sans public / Contenu du jour
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Commencer
14px 600 __Inter_f4e4db                  | Premium / Étape 1 sur 4 / Commencer l’étape 1
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
12px 400 __Inter_f4e4db                  | Premium : premier paiement rem / Facultative
12px 600 __Inter_f4e4db                  | Premium / Premium / Premium
12px 600 __Inter_f4e4db MAJ              | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 8 60px, 30px, 24px, 20px, 18px, 16px, 14px, 12px | COMBINAISONS : 13

## gratuit 375 x 812
36px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
24px 700 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu
20px 700 __Plus_Jakarta_Sans_8f0720      | 1 500+
18px 400 __Inter_f4e4db                  | Ton tableau de bord : chaque j
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d
15px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois
14px 600 __Inter_f4e4db                  | Premium
14px 400 __Inter_f4e4db                  | Premium ouvre tout : le catalo / inscrits bossent leur humour. / 5 min
12px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
12px 600 __Inter_f4e4db                  | Premium
12px 600 __Inter_f4e4db MAJ              | Ton premier pas
TAILLES DISTINCTES : 8 36px, 24px, 20px, 18px, 16px, 15px, 14px, 12px | COMBINAISONS : 11

## gratuit 1280 x 900
60px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
30px 700 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu
24px 400 __Inter_f4e4db                  | Ton tableau de bord : chaque j
24px 700 __Plus_Jakarta_Sans_8f0720      | La suite est dans Premium
20px 700 __Plus_Jakarta_Sans_8f0720      | 1 500+ / Tu t’échauffes
18px 700 __Plus_Jakarta_Sans_8f0720      | Répartie / À voix haute, sans public / Contenu du jour
16px 400 __Inter_f4e4db                  | Rubrique Premium. Exemple ci-d / Tu t’échauffes, cap 1 sur 5
16px 600 __Inter_f4e4db                  | Premium · 1,99 €/mois / Commencer
14px 600 __Inter_f4e4db                  | Premium / Étape 1 sur 4 / Commencer l’étape 1
14px 400 __Inter_f4e4db                  | Ton premier pas / Ton cap / Série
12px 400 __Inter_f4e4db                  | Premium : premier paiement rem / Facultative
12px 600 __Inter_f4e4db                  | Premium / Premium / Premium
12px 600 __Inter_f4e4db MAJ              | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 8 60px, 30px, 24px, 20px, 18px, 16px, 14px, 12px | COMBINAISONS : 13

## en-cours 375 x 812
30px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
24px 700 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes
20px 700 __Plus_Jakarta_Sans_8f0720      | Tu te lances
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | Tu te lances, cap 2 sur 5
14px 400 __Inter_f4e4db                  | lundi 16 novembre / La bonne réponse qui te vient  / 1 situation nouvelle, 1 carte 
12px 600 __Inter_f4e4db MAJ              | S’entraîner / Ton cap
12px 600 __Inter_f4e4db                  | Nouvelle / À revoir
TAILLES DISTINCTES : 6 30px, 24px, 20px, 16px, 14px, 12px | COMBINAISONS : 8

## en-cours 1280 x 900
36px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
30px 700 __Plus_Jakarta_Sans_8f0720      | Si tu as 5 minutes / 250 / 1
20px 700 __Plus_Jakarta_Sans_8f0720      | Tu te lances
18px 700 __Plus_Jakarta_Sans_8f0720      | Machine à Café / À un proche, par message
16px 600 __Inter_f4e4db                  | Les cartes du jour
16px 400 __Inter_f4e4db                  | Tu te lances, cap 2 sur 5
14px 400 __Inter_f4e4db                  | lundi 16 novembre / La bonne réponse qui te vient  / 1 situation nouvelle, 1 carte 
14px 600 __Inter_f4e4db                  | Étape 3 sur 3 / Reprendre
12px 600 __Inter_f4e4db MAJ              | S’entraîner / Ton cap / Étape en cours
12px 600 __Inter_f4e4db                  | Nouvelle / À revoir
12px 400 __Inter_f4e4db                  | XP gagnés depuis ton arrivée / jour de pratique d’affilée / Un jour compte quand tu valide
TAILLES DISTINCTES : 7 36px, 30px, 20px, 18px, 16px, 14px, 12px | COMBINAISONS : 11

## nouvel 375 x 812
30px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
24px 700 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu
20px 700 __Plus_Jakarta_Sans_8f0720      | Tu t’échauffes
18px 700 __Plus_Jakarta_Sans_8f0720      | Répartie
16px 600 __Inter_f4e4db                  | Commencer
16px 400 __Inter_f4e4db                  | Tu t’échauffes, cap 1 sur 5
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Étape 1 sur 4
12px 600 __Inter_f4e4db MAJ              | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 7 30px, 24px, 20px, 18px, 16px, 14px, 12px | COMBINAISONS : 9

## nouvel 1280 x 900
36px 700 __Plus_Jakarta_Sans_8f0720      | Aujourd’hui
30px 700 __Plus_Jakarta_Sans_8f0720      | Quelqu’un te lance « Tiens, tu / Contenu du jour
20px 700 __Plus_Jakarta_Sans_8f0720      | Tu t’échauffes
18px 700 __Plus_Jakarta_Sans_8f0720      | Répartie / Tes 4 premières semaines
16px 600 __Inter_f4e4db                  | Commencer / Vanne du jour / Pas moi.
16px 400 __Inter_f4e4db                  | Tu t’échauffes, cap 1 sur 5 / Le micro de la salle capte les
14px 400 __Inter_f4e4db                  | lundi 16 novembre / 5 min / cap 1 sur 5
14px 600 __Inter_f4e4db                  | Étape 1 sur 4 / Commencer l’étape 1 / Semaine 1 :
12px 600 __Inter_f4e4db MAJ              | Ton premier pas / Ton cap / Étape conseillée
TAILLES DISTINCTES : 7 36px, 30px, 20px, 18px, 16px, 14px, 12px | COMBINAISONS : 9
```
