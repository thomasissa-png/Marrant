# Itération 6, relecteur à l'aveugle n°1 : étalons Storytelling après réécriture des 3 conseils

> Fichier noté : `docs/copy/etalons-parcours-storytelling-s18.md`, relu en entier (non modifié). Le fond des 3 conseils du §1 est validé et n'est pas discuté : ils servent de référence pour juger le reste.
> Recherche dans le fichier : zéro tiret cadratin, aucun prénom de persona, « blague » seulement dans « blague à tiroirs » et dans la citation du titre en base, tutoiement partout.
> Ce qui est sain : le tableau des choix (6 lignes), « Je suis tes recos » (l. 20) et le handoff disent la même chose. Le §3 suit le conseil de la coupe : geste, matière, mesure et repli sont alignés sur le DÉFI COUPE. La question 1 colle à la règle « garde le détail qui fait voir la scène, coupe le détail neutre ». La question 2 tient : bonne réponse en B, la plus courte (6 mots contre 11 et plus), une règle enfreinte par mauvaise réponse, 3 phrases d'explication, positions D puis B. Le §7 décrit exactement les défis du §1. Les comptes de mots des 5 décryptages sont justes (20/6, 11/6, 15/9, 15/6/4, 12/5).

## Notes

| Critère | Note | Justification |
|---|---|---|
| C1 Drôlerie et naturel | 10/10 | Les chutes du quiz (« Depuis, il fait partie de l'immeuble. »), la scène et la fiche font sourire. |
| C2 Voix et règles | 10/10 | Toutes les règles sont tenues. |
| C3 Exactitude et preuve | 7/10 | Trois vannes de l'étape 1 contredisent la règle du conseil qu'elles illustrent (R29). Les chiffres sur les vannes se contredisent entre eux et avec le §6 (R30). |
| C4 Cohérence spec et conseils | 8/10 | Le critère des vannes (l. 146) n'est pas celui du conseil validé (R29). Le reste suit le §1. |
| C5 Facilité de décision | 9/10 | « deux critiques « = » » est opaque pour Thomas (R31). |

**Note globale : 7/10.**

## Défauts

### Bloquant

**R29. Trois vannes de l'étape 1 contredisent la règle enseignée par le conseil validé** (§3, tableau des 5 vannes, et critère l. 146).
Le conseil 1a dit : « La chute est la phrase la plus courte ». Le défi : « la dernière est la plus courte ». La question 2 : « C'est la phrase la plus courte ». Le critère des vannes a été changé en « plus courte que tout ce qui la précède » (total des mots), ce qui ne se voit pas à la lecture :
- Vanne 2 : « Pas le vélo. » (3 mots) est plus court que la chute « Je prends ça pour une critique. » (6).
- Vanne 3 : « J'ai appelé ma mère. » (4) est plus court que la chute « Elle me l'a dicté de mémoire, avec les espaces. » (9).
- Vanne 1 : « Il était fier. » (3) est à égalité avec « Sur le parking. » (3), donc la dernière n'est pas la plus courte.
Dans la vitrine gratuite, l'élève qui applique la règle trouve trois contre-exemples juste sous le conseil (même nature que R1 et R2 au tour 1). Les vannes 4 et 5 sont conformes.
Correction : remplacer les vannes 1 à 3 par des actives où la dernière phrase est strictement la plus courte (vérifiées au texte exact dans `vannes-actives-s17.json`, comptes refaits ; à vérifier, comme les autres, hors des 13 étapes s17) :
- « Mon voisin m'a offert une tomate de son balcon avec la solennité d'un don d'organe. » / « J'ai dû la manger devant lui, en silence. » Décryptage : « Quinze mots pour poser la scène, huit pour la chute : « en silence » montre la gêne sans l'expliquer. »
- « Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu. » / « J'ai voyagé à genoux devant lui. On n'en a jamais parlé. » Décryptage : « Quatorze mots, puis six, puis une chute de cinq : « On n'en a jamais parlé. » est la phrase la plus courte des trois. »
- « J'ai mis mon réveil en face du lit pour être obligé de me lever. » / « Maintenant je dors par terre, à côté du réveil. » Décryptage : « Quatorze mots pour poser la scène, neuf pour la chute : « à côté du réveil » referme la boucle sans commentaire. » (seed 323 : vérifier son absence des 13 étapes s17)
Critère l. 146 : « Critère : la dernière phrase est la plus courte, comme le demande le conseil (mots comptés, vérifiés un à un). » Mettre à jour aussi le tableau du §6 (ligne étape 4 : « Il a zoomé » n'est plus en étape 1) et la phrase sur `seedId null` du handoff si la vanne 323 est retenue.

### Important

**R30. Chiffres des vannes incohérents** (« Ce que la base a changé », l. 25 ; §6, l. 190 et ligne étape 5).
- L. 25 : « seules les 125 vannes relues à l'aveugle restent actives », puis, dans la même puce, « parmi les 127 actives ». 
- L. 25 : « 3 sont actives (seed 136, 308 et 322) ». Mais §6 l. 190 : « une seule des 30 vannes prévues est active (322, GPS) ».
- L. 25 : « la vanne 136 (étape 5, détour) est à relire pour le choix 5 ». Mais le §6 dit qu'aucune active ne montre un détour, sans citer la 136.
Correction : donner la source de 125 et 127 et l'écart entre les deux (ou un seul chiffre). Au §6 l. 190 : « Contrainte : 3 des 30 vannes prévues sont actives (136, 308, 322). » Ligne étape 5 du §6 : ajouter « sauf la 136, à relire avant de trancher le choix 5 ».

### Mineur

**R31. « deux critiques « = » » opaque pour Thomas** (tableau des choix, l. 12 ; §1, l. 33).
Correction l. 12 : « Conseils réécrits, jugés au niveau des meilleurs conseils par deux relecteurs à l'aveugle : tu valides le texte ». L. 33 : « (jugés au niveau des étalons de l'audit s14 par les deux critiques) ».

## Décompte

1 bloquant (R29), 1 important (R30), 1 mineur (R31). Ces trois points corrigés, rien d'autre n'empêche 10/10.
