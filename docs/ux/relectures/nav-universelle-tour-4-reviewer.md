# Relecture à l'aveugle, tour 4 : `docs/ux/navigation-universelle-s24.md` v4 (@reviewer, 14/11)

**Note : 9,5/10** (tour 3 : 9). J'ai relu la spec en entier : R1 est corrigée et les pistes du tour 3 sont appliquées. Il reste une seule faute dure, apparue avec l'édition de la ligne 52.

## R1 (tour 3) : CORRIGÉE

Les trois sections disent désormais la même chose :
- §3 l.77 : C n'a aucun fil d'Ariane, Aujourd'hui n'a pas de retour, S'entraîner porte « Retour : Mon espace » ;
- §4.3 l.107-109 : les pages B de l'espace et S'entraîner renvoient à Mon espace, Aujourd'hui n'a rien, `/favoris` et `/carnet` gardent leurs repères publics ;
- critères 4 et 13 : ils reprennent ces mêmes règles.

Le bilan renvoie vers `/parcours/[slug]`, avec Parcours allumé (l.104 et l.48) : c'est cohérent.

## Faute dure

**T1. Ligne allumée du menu mobile sur une page B de l'espace : la règle se contredit (critère 6, -0,5).** La l.52 dit que « la ligne du parent (§4.3) s'allume », avec « Mon espace » seulement sur Aujourd'hui. Mais pour /mon-espace/quoi-repondre, /mon-espace/bibliotheque, etc., le parent donné par le §4.3 (l.107) est justement « Mon espace ». La règle allume donc « Mon espace » tout en l'interdisant. Le cas de `/favoris` et `/carnet` n'est pas couvert non plus, car ils n'ont pas de parent au §4.3 (l.109). Le critère 8 ne se tranche pas sur capture.
Correction, l.52 : « Menu mobile abonné : sur une rubrique de l'index (pages B de l'espace, S'entraîner, `/favoris`, `/carnet`), sa propre ligne s'allume ; sur une page A, la ligne de son parent (§4.3 ; Carnet pour `/carnet/[mois]`, Parcours pour un bilan) ; « Mon espace » seulement sur Aujourd'hui. »

## Pistes

- P1. L.1 affiche encore « v3 » et la l.3 cite les « relectures des tours 1 et 2 » : passer à v4 et aux tours 1 à 3.
- P2. De 768 à 1023 px, la ligne « Mon espace » est masquée (l.37), mais le bloc `ml-3 border-l` de ses 8 entrées reste en retrait sous un titre absent. Dire si les 8 entrées restent dans le menu à ces largeurs, et si oui, sans retrait (`md:ml-0 md:border-l-0 md:pl-4`).
- P3. La l.97 dit « sans état ni paramètre », alors que le retour d'un bilan dépend du parcours d'origine. Préciser « déduit de l'identifiant de la fiche (`bilan-repartie` → `/parcours/repartie`) », pour que @fullstack ne lise pas une valeur de session.
- P4. Le §7 l.165 numérote les pistes du tour 3 de P9 à P12, mais la relecture du reviewer les numérote de P1 à P4. Citer la source de chaque piste pour la traçabilité.
