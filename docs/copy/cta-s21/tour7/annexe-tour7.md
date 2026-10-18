# Annexe du tour 7 : ce qui a été repris, d'où, et le taux de changement par bloc

> Interne, jamais transmis aux relecteurs. Relecteurs : r1, r2, r3 (verdicts du tour 6 : `tour6/verdicts/verdict-r{1,2,3}.md`). Point de départ de chaque bloc : le texte final du tour 6 (`tour6/textes-finaux.md`). Règle d'intégration : manque cité par au moins deux relecteurs, ou demande explicite de Thomas ; sinon la meilleure formulation proposée, vérifiée contre les faits vrais. B1, B6, B15, B17 : validés 10/10/10, recopiés sans une virgule de changement.

## Mesure du taux de changement (P0 s11)

Pas d'outil de diff disponible dans cette session (aucun Bash) : mesure faite à la main, mot à mot, sur le texte complet de chaque bloc tel que montré aux relecteurs (boutons, liens, lignes de prix compris). Formule : `(mots supprimés + mots ajoutés) / (mots avant + mots après)`, plus longue sous-séquence commune prise en compte (un passage déplacé compte comme supprimé puis ajouté). Les données publiques (S17/S18 de B14, hero de B3, 4 avantages de B4+B5) sont exclues du comptage. Précision : ± 3 mots par bloc. Pour B11, le texte avant est pris sur les 5 gestes tels que le pack les affiche (le texte unique « /conseils et /videos » du tour 6 compté pour chacun des deux).

| Bloc | Mots avant | Supprimés | Ajoutés | Mots après | Taux |
|---|---|---|---|---|---|
| B1, B6, B15, B17 | (inchangés) | 0 | 0 | idem | 0 % |
| B2 | 129 | 0 | 9 | 138 | 3,4 % |
| B18 | 90 | 15 | 17 | 92 | 17,6 % |
| B3 (zone d'action, pastilles comprises) | 66 | 5 | 17 | 78 | 15,3 % |
| B4+B5 | 109 | 8 | 21 | 122 | 12,6 % |
| B7 (3 listes) | 345 | 18 | 60 | 387 | 10,7 % |
| B8 | 110 | 22 | 24 | 112 | 20,7 % |
| B9 | 112 | 18 | 22 | 116 | 17,5 % |
| B10 | 98 | 14 | 11 | 95 | 13,0 % |
| B11 (5 gestes) | 402 | 59 | 68 | 411 | 15,6 % |
| B12 | 83 | 12 | 14 | 85 | 15,5 % |
| B13 (Répartie + Storytelling) | 153 | 12 | 51 | 192 | 18,3 % |
| B14 | 82 | 8 | 17 | 91 | 14,5 % |
| B16 | 110 | 2 | 3 | 111 | 2,3 % |

Ensemble des 13 blocs retouchés : 193 mots supprimés, 334 ajoutés, 1 889 avant, 2 030 après : **environ 13 %** de mots changés (12,7 % en comptant les 4 blocs validés, 246 mots, à 0 %). C'est une passe de finition ciblée, pas une refonte. Les plus gros écarts sont des ajouts d'information demandés (B13 : le pas restant, Stripe, la ligne de carte entière ; B7 : S22 en phrase entière et contours qui disent le contenu de l'étape 1) ou une phrase réordonnée (B8 : l'envie avant l'outil ; B11 : l'intro retournée, comptée comme 9 mots supprimés et 9 ajoutés dans chacun des 5 gestes).

Intouchables vérifiés : aucun prix, aucune durée, aucun nom de parcours, aucune garantie, aucun slug modifié. Les titres de bloc modifiés sont des titres de copy d'appel (B9 `[S14]`, B10 `[S14]`, B11 vote et favori vidéo, B16 Confiance), pas des H1/H2 de page. Le titre d'accueil « On va arranger ça » n'est pas touché. Zéro tiret cadratin (Grep sur les trois fichiers).

## Faits vérifiés pour ce tour

- **L'étape 1 de chaque parcours a le format « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. »** : `docs/content/parcours-seed.json` (Machine à Café, Répartie, Confiance : 13 étapes, toutes « 2 vidéos »), `parcours-storytelling-s18.json` (étapes 1 à 5 « 2 vidéos », seule l'étape 6 dit « une vidéo »), `parcours-boulot-s19.json` (« une vidéo » seulement aux étapes 5 et 6, test `parcours-contenu-s19-boulot.test.ts`). Les contours « 5 vannes et un défi », « un conseil et un défi », « 2 vidéos et un défi » sont donc vrais pour l'étape 1 de tout parcours. Jamais « 5 vannes de plus ».
- **L'exercice « À toi de jouer » d'une vanne sert à écrire la sienne** avec la même technique : vérifié par l'orchestrateur (`joke-agent.ts` l.184-189). « Écrire la tienne » (B7, B8) reste donc vrai.
- Le mot « parcours » n'est expliqué nulle part sur le premier écran d'accueil : B3 le définit dans `[S20]` (« une étape par semaine »).

## Ce qui est repris, bloc par bloc

**B2** (9, 9, 10). Repris : « La première se lit tout de suite, sans compte. » (r1 : sur mobile « gratuit » veut souvent dire « crée un compte gratuit » ; demande de Thomas). Écarté : le titre « La prochaine vanne, c'est toi qui la sors » (r2 seul, r1 et r3 le laissent tel quel, r3 met 10).

**B18** (8, 8, 8). Repris : ligne repliée « Chaque mois, une vanne et de quoi écrire la tienne. » (r1 et r2, mot pour mot ; r3 : « Une vanne par mois, et de quoi… », plus long) et titre « La vanne du mois, et de quoi écrire la tienne » (r1, r2, r3). « Pourquoi elle marche » n'est plus dit qu'une fois (sous-titre : « ce qui la fait marcher ») ; « pour écrire la tienne » retiré du sous-titre, déjà dans le titre (r2). Note « La lettre est gratuite, sans compte. » : nomme « la lettre » avant le bouton (r2 : « le bouton parle d'une lettre qu'aucune ligne n'a nommée »). Bouton « Envoie-moi la lettre » gardé. Écarté : « Envoie-moi la prochaine » (r3 seul) et « la vanne du mois » (r2 seul) : la lettre contient aussi l'exercice, le bouton ne doit pas la réduire à une vanne. Ligne repliée : 51 caractères sur 2 × 28, bouton 19 (< 20).

**B9** (8, 8, 8). Repris : titre avec verbe, « Essaie-le avant le soir où il te servira » (r1, r2, r3 ; avec « te », r3). Le défi entre dans la phrase d'étape : « avec son défi à tenter, dans la vie ou à l'écrit » (r1, r3 ; r2 voulait raccourcir). L'inventaire « un conseil, des vannes, des vidéos et un quiz » disparaît (r2 : n'ajoute rien à l'envie d'essayer CE conseil ; r1 : inventaire). Contour : voir B7.

**B12** (8, 8, 8). Repris : ouverture rattachée à « Ta force » (r1 « Ta force, tu viens de la voir. Ça se travaille », r3 « Ta force, tu viens de la lire. Le reste s'entraîne », r2 « Ton profil, tu l'as. Reste à t'en servir », piste de Thomas). Tranché : « Ta force, tu viens de la lire. Reste à t'en servir : » (rattachement r1/r3 + « reste à t'en servir » de r2 et de Thomas) ; « Ça se travaille » abandonné (r3 : formule qu'on lit partout, r2 : brusque). Bouton « Commencer Confiance, étape 1 gratuite » (r3 : prolonge « Ton point de départ » ; même forme que B15, déjà validé). Ligne Premium : « Résiliable en ligne quand tu veux » (r2).

**B3** (9, 8, 8). Repris : `[S20]` ne répète plus le bouton, il nomme l'étape : « Tes premières répliques », c'est l'étape 1 de Répartie (r1, Thomas). « Parcours » expliqué avant d'être compté : « l'un des 5 parcours du site (une étape par semaine, 20 minutes ici) » (r2, r3 : le lien dit « 5 parcours » à quelqu'un qui ne sait pas ce que c'est). **Contrainte de forme** : le lien « Ouvrir les 5 parcours » est lu avant `[S20]`, l'ordre du bloc ne change pas ; la définition est donc la toute première chose que dit la note, juste sous le lien. Écarté : retirer la garantie de 14 jours (r3 seul ; r1 et r2 la gardent) ; retirer le prix ou le lien (le lien prix est ce qui rassure l'explorateur, r3 le dit lui-même). Hors périmètre, non touchés : le titre « On va arranger ça » (signalé par r1, r2 ; à soumettre à Thomas, proposition « Ça s'entraîne. »), « Toi, tu ramènes ta motivation » (r1, r3 : ton de coach), « On a les vannes, les techniques et les exercices » (r1).

**B4+B5** (9, 9, 9). Repris : première phrase de `[S11]` « La table qui rit, et c'est ta réplique qui l'a lancée. » (r1 : l'autre virgule rendait la scène hachée). Liste de parcours avec de l'envie, tirée des cartes : Machine à Café et Boulot « pour faire rire au travail sans devenir le collègue qui force » (r1, r2, r3), Storytelling « pour que ta chute arrive avant le dessert » (r1, r2 ; r3 « placer ta chute »), Répartie « pour répondre quand on te chambre ». Écarté : « pour ne plus sécher quand on te chambre » (r3) : « ne plus » promet un résultat ; « pour répondre » décrit l'usage. Confiance gardé tel quel (« retrouver ta légèreté » est déjà la ligne de carte).

**B7** (9, 9, 9). Repris : `[S22]` en phrase entière, qui se lit à la suite de `[S21]` (r2, r3 : bout de phrase elliptique) : « Tu y trouves aussi le filtre par catégorie, pour aller droit à celles qu'il te faut. » (r3 pour « pour aller droit à… », r2 pour « sont aussi dans Premium » ; « Tu y trouves » évite de redire « Premium », déjà dans `[S21]`). Contours qui disent ce que contient l'étape 1 gratuite, par liste (r1) : « Étape 1 de Répartie, gratuite : 5 vannes et un défi » (/vannes), « un conseil et un défi » (/conseils), « 2 vidéos et un défi » (/videos). Libellé réécrit sans le verbe « Essayer » (déjà dans le bouton plein voisin, « Voir la suite… ») : r1 le gardait en tête de phrase, ici le format « Étape 1 de… » est plus court (une ligne et demie sur mobile). `[S24]` /vannes : « pour écrire la tienne » gardé (r2 demandait confirmation : vérifié, voir plus haut).

**B8** (9, 9, 9). Repris : l'envie avant l'outil, l'exercice dit une seule fois (r1, r2, r3, qui proposent chacun la même inversion) : « Reste à écrire ta version, celle que tu auras envie de sortir à la prochaine soirée : c'est l'exercice « À toi de jouer », une consigne et un exemple à réutiliser. Il est dans Premium… » (forme r1). Contour : voir B7 (« 5 vannes et un défi »). Taux élevé (20,7 %) dû à l'inversion, pas à un remaniement de fond.

**B10** (9, 9, 10). Repris : titre = le pont salle/table (r2 : c'est lui qui donne envie et il arrivait en deuxième phrase) : « Faire rire une salle, c'est son métier. Toi, une table te suffit », puis « Et ça s'entraîne. » ouvre le texte. Contour : « Étape 1 de Répartie, gratuite : 2 vidéos et un défi » (r1). **Risque assumé** : r3 mettait 10 avec l'ancien titre « Après le rire, le décryptage » et r1 le jugeait bon ; seul r2 le trouvait en retrait. Le bouton « Décrypter cette vidéo avec Premium » garde le mot « décryptage » que le titre ne porte plus ; si r1 ou r3 baisse sur ce point, la piste est de remettre l'ancien titre et de ne garder que le contour.

**B11** (9, 9, 8). Repris : les deux étapes avant la sortie (r2, r3, qui le disent) : « S'abonner, c'est deux étapes : ton compte, puis le paiement sécurisé. Si tu fermes cette fenêtre, ta page reste là. » (r2 pour la phrase, avec « Si tu fermes » plutôt que « Sinon, ferme » de r3 : pas d'injonction). Carte floutée : l'exercice est cité (r1) et la carte est séparée en deux textes, /conseils (« l'exercice « À toi de jouer » de chaque conseil ») et /videos (« les points clés et l'exercice de chaque vidéo »), parce que l'exercice d'une vidéo n'est pas le même objet (fait vrai). « Tes favoris » retiré de ces deux lignes pour rester à deux lignes (r1 fait de même). Titre du vote : « Ton vote sur les nouveautés t'attend dans Premium » (r3 ; r1 « Ton avis… c'est avec Premium » écarté : « avis » n'est pas le mot du site). Titre favori vidéo : « Garde-la sous le coude pour quand tu en auras besoin » (r3 « sous le coude », sans « soir » : faux pour une vidéo, comme au tour 6).

**B13** (9, 9, 8). Repris : le pas restant nommé, « Ton compte est prêt, il ne reste que le paiement. » (r3, dont c'est le manque principal) ; Stripe dans la ligne de garantie (r1 ; vrai, le bouton ouvre le paiement Stripe) ; la ligne de carte entière, donc « tu as de quoi tenir une table » pour Storytelling et « en soirée, en coloc ou en TD » pour Répartie (r1) ; « L'étape 1 est offerte, les étapes 2 à 4 s'ouvrent ensuite » (r2 : « la suite » supposait l'étape 1 lue). Les cinq parcours sont donnés dans `textes-finaux.md` avec leur ligne de carte exacte. Gardé : « tu ouvres les 5 parcours, pas seulement Répartie » (le meilleur argument du bloc, r3).

**B14** (9, 9, 9). Repris : « Le même abonnement ouvre aussi les 4 autres parcours. » (r2 mot pour mot ; r1 et r3 en variante). « Toute la suite » remplacé par « les étapes 2 à 4 » (concret, r1 dit « les deux dernières »). Gardé : « tu la valides » (fait vrai : on ne valide pas l'étape sans Premium). Écarté : « puis aux suivantes » (r2) et « puis la suite » (r3) : trop proches du vague de départ.

**B16** (9, 9, 9). Repris : Confiance « Retrouver ta légèreté, 20 minutes par semaine, sans te forcer » (r1 et r2 mot pour mot ; Thomas autorise la formule : c'est la ligne de carte du parcours). Écarté : « une étape par semaine » (r3) : la durée « 20 minutes » rassure et c'est le choix de Thomas au tour 6.

## Points d'attention pour Thomas et @fullstack

- Le titre d'accueil « On va arranger ça » est toujours signalé comme promesse par r1 et r2 : à trancher par Thomas, hors périmètre de ce tour.
- B10 : changement de titre à surveiller (risque expliqué plus haut).
- B3 : la note `[S20]` fait 3 phrases en petit ; vérifier le rendu à 360 px.
- B11 : deux textes `[S27]` distincts pour /conseils et /videos au lieu d'un.
- Grep après branchement : `Essayer gratuitement l'étape 1 du parcours` et `Débloquer` ne doivent plus apparaître dans un libellé d'appel.
- Zéro tiret cadratin dans les trois fichiers du tour 7.
