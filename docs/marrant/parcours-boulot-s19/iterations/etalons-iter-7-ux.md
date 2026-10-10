# Itération 7, relecture UX des étapes du Parcours Boulot (vérification finale : choix 7 pour Thomas, promesse « visionnage », régressions)

Fichier noté : `docs/copy/etalons-parcours-boulot-s19.md` (non modifié, 404 lignes, numéros de lignes = ce fichier).
Lu : le fichier en entier, ma note d'itération 6, la table de corrections de l'itération 6 (`etalons-historique-corrections.md`). Aucun autre fichier consulté ni modifié. Pas de code vérifié ce tour (aucune modification de `src/`).
Hors note, comme demandé : le texte des cinq conseils validés à l'aveugle.

## Note

| Critère | Note | Pourquoi, en une ligne |
|---|---|---|
| Vitrine (étape 1) | 10 | Inchangée : sans parole, sans envoi, repli visio, scène de 99 mots, `why` de 39 mots. |
| Peur « me griller » | 10 | Inchangée : le défi du PS garde ses trois filets (faible enjeu, brouillon, repli sur le dernier mail). |
| Progression d'exposition | 10 | Tableau du §7 inchangé, un repli par étape. |
| Fiche et titre de page | 10 | Inchangés (description B 73 mots, titre A 60 caractères). |
| Quiz | 10 | Inchangé (B, D, A, explication toujours affichée). |
| Vidéos | 9 | La promesse « une session ne peut pas visionner » est posée aux l.37 et l.311, mais trois passages disent encore l'inverse et personne n'est désigné pour regarder (corrections 1 et 2). |
| Décision pour Thomas | 9 | Choix 7 corrigé et décidable (voir plus bas). Reste deux imprécisions : « mais sept » jamais montré, « comme avec c » inexact (correction 3). |
| Traces caduques | 9 | Le choix 7 est nettoyé (plus de « tour », « critique A / B », « registre officiel », « converger »). Restent les trois passages « la session regarde » (correction 1). |

**Note globale : 9,5/10** (moyenne 9,6, arrondie vers le bas). **0 correction bloquante, 3 corrections non bloquantes** pour atteindre 10. Même note qu'à l'itération 6 : le choix 7 passe de 8 à 9, la promesse « visionnage » corrigée de justesse en tête de document mais pas partout fait perdre un point sur les vidéos.

## Mes 4 corrections de l'itération 6 : toutes appliquées

| # | Correction demandée | État | Preuve dans le fichier |
|---|---|---|---|
| 1 | « Je suis tes recos » ne vaut pas pour le 7 | Appliquée | l.26 : « Pour le 7, écris une lettre (a, b ou c) » et « un « je suis tes recos » ne lève jamais un choix déjà écrit » ; réponse type « 7 à écrire (reco : a) » (l.26 et l.395) ; l.19 « à écrire en toutes lettres » ; l.33 ; l.127 « « Je suis tes recos » ne vaut pas pour ce numéro » ; handoff l.393 : exception inscrite seulement si la lettre est a ou b, mot pour mot, « sans lettre » = rien inscrit, rien importé |
| 2 | Choix 7 dans les mots de Thomas, avec le mail montré | Appliquée | Plus de « tour », « critique A / B », « converger », « registre officiel » dans les textes lus pour décider ; mail complet montré une fois avec la chute reco (l.110) ; « deux relecteurs indépendants », « première relecture / relecture suivante » ; tableau des chutes l.115-118 (verdict, déjà relue ?) ; phrase claire « Pour la personne qui suit le parcours, a et b ne changent que l'exemple qu'elle lit » (l.106 et l.19) |
| 3 | Option « relancer » complète | Appliquée | Devenue c. L.123-124 : le PS en ligne est désactivé tout de suite (base et `conseils-seed.json`, réversible, avec sauvegarde) et la mise en ligne du parcours attend l'étape 2 ; l.19 et l.33 le redisent ; handoff l.396 (2) « c : désactiver … ne rien importer … l'interrupteur de publication reste éteint ». Plus de « dans tous les cas, l'ancien conseil ne reste pas en ligne » |
| 4 | Chute « son remplaçant » retirée | Appliquée | Absente de tout le document ; une seule piste jamais relue (« la plante du couloir ») est mentionnée comme point de départ de c, avec la réserve « mais sept » devinable (l.122) |

## Le choix 7 pour Thomas, relu de bout en bout

**Lisible : oui.** L.19 donne l'enjeu en une ligne, dit ce que ça change pour la lectrice (rien : même défi, même technique, seul l'exemple change), ce que lèvent a et b (deux lignes du 08/10, nommées), ce que garde c (rien ne bouge, l'étape 2 attend). La cellule reste dense (environ 100 mots contre les 45 que je proposais) mais l'ordre est bon : l'effet pour la lectrice vient en premier, le coût pour Thomas ensuite, et le détail est répété sans jargon aux l.33 et l.103-128. Je ne la repasse pas en correction : elle porte maintenant aussi la conséquence de c, que ma correction 3 exigeait.

**Décidable : oui.** Cognitive walkthrough, Thomas qui lit du haut vers le bas :
- Ligne 7 du tableau : voit l'enjeu, les trois lettres, les verdicts de a et b, la reco. Sait quoi écrire (une lettre).
- Réponse type l.26 : « 7 à écrire (reco : a) » est visible et ne peut plus être pris pour un oui global. Feedback écrit sur le cas « sans lettre ».
- §1 l.103-128 : pourquoi c'est lui qui décide, le mail complet avec le PS, tableau des chutes, raison commune à a et b, ce que devient le PS en ligne avec c, portée limitée de l'exception (« ne fait pas précédent »), reco qui avoue les défauts de a et dit comment choisir b. Aucun terme qu'il n'a pas lui-même employé, hormis « mais sept » (correction 3).

**Nielsen sur ce flux de décision, rapidement.** H1 visibilité (conséquences écrites pour a, b, c et « sans lettre ») : PASS. H2 vocabulaire (« sous la barre », « règle d'or », « au niveau » sont les mots de Thomas, « au niveau » et « sous la barre » définis l.113) : PASS sauf « mais sept ». H3 contrôle (c est la sortie réversible, désactivation réversible) : PASS. H5 prévention d'erreurs (une lettre exigée, jamais déduite) : PASS. H9 messages d'erreur (cas « sans lettre » : la question est reposée) : PASS. H10 aide : PASS. Cohérence H4 : lettres a, b, c identiques dans le tableau (l.19), la liste (l.33), la réponse type (l.26, l.395), le §1 (l.103-128) et le handoff (l.393, l.396, l.397). Aucun « d » résiduel, aucun « son remplaçant ».

**Effet pour la lectrice : sans risque pro, inchangé.** Le défi du PS (l.111) garde faible enjeu, présentable si ton chef le lit, brouillon qui compte, repli sur le dernier mail, réussite sans envoi.

## « La session regarde chaque vidéo » : corrigée en tête de document, pas partout

Correctement posée : l.7 (aucune vidéo visionnée), l.37 (« une session ne peut pas visionner une vidéo … doit être regardée une fois par une personne »), l.311 (règle de sortie, même formulation), l.234 et l.313. Trois passages disent encore l'ancienne promesse : voir correction 1. Et l'action « une personne regarde » n'a pas de propriétaire : correction 2.

## Aucune friction nouvelle introduite par les corrections de l'itération 6

Reste au niveau de l'itération 6 et vérifié : étape 1 (§3) mot pour mot, quiz B, D, A et ses longueurs, fiche B (73 mots), titre A (60 caractères), vannes 11 + 19 = 30, tableau d'exposition du §7 avec un repli par étape, test unique en paragraphe séparé, plafond de durée (choix 8a, cinq vidéos entières), réponse type de 9 numéros identique dans le tableau, la liste, le handoff. Les cinq conseils du §1 ne semblent pas modifiés (non rouverts, hors note). Aucune dérive de ton, de longueur ou de structure dans les zones touchées.

## Corrections non bloquantes (3)

**1. Trois passages disent encore que la session regarde les vidéos.**
Emplacement : l.323 (étape 6 : « Sa légende s'écrit avec l'étape 6, en regardant la vidéo, comme celles des étapes 2 à 5 »), l.328 (« Les légendes des étapes 2 à 5 s'écrivent avec les étapes, en regardant chaque vidéo »), l.397 (Décisions prises : « règle de sortie des vidéos non visionnées (la session regarde avant l'import, relève la durée et corrige la base) »).
Problème : l.37 et l.311 disent qu'une session ne peut pas visionner ; ces trois phrases supposent le contraire. Thomas qui lit l.37 puis l.328 ne sait plus qui regarde, et un agent qui lit le handoff (l.397) croit que la session s'en charge.
Correction : l.323 et l.328, remplacer « en regardant la vidéo / chaque vidéo » par « d'après la fiche, à confirmer par la personne qui regarde la vidéo avant l'import » (ou retirer la précision : les légendes s'écrivent avec les étapes). L.397 : « règle de sortie des vidéos non visionnées (une personne les regarde avant l'import, relève la durée ; @fullstack corrige la base) ».

**2. La personne qui regarde les vidéos n'est ni nommée ni dans le handoff.**
Emplacement : l.37 (« une personne »), l.311, handoff l.395-396.
Problème : l.37 dit « Rien d'autre ne demande de réponse de ta part » et l.311 « Tu n'as rien à trancher de plus », mais une action humaine est requise avant l'import (regarder environ dix vidéos, relever les durées, retirer celle qui ne tient pas). Thomas ne sait pas si c'est lui. Le handoff `Attend Thomas` et la liste `@fullstack devra` ne la contiennent pas : aucun agent ne la déclenche.
Correction : une phrase l.37, par exemple « Qui les regarde : à toi de dire (toi, ou la personne que tu désignes) ; je te remets la liste des vidéos avec leur durée de base au moment de l'import. Ce n'est pas une décision à prendre ici, c'est une tâche avant l'import. » `[À CONFIRMER par Thomas : qui regarde]`. Handoff : ajouter un point « Avant l'import : visionnage par une personne désignée par Thomas (liste du §6), durées relevées, vidéo retirée si elle ne tient pas ».

**3. Deux imprécisions dans le choix 7 que Thomas peut remarquer.**
Emplacement : l.122, l.128 (« mais sept ») ; l.26 (« l'étape 2 attend (comme avec c) »).
Problème : (a) « … mais sept » est cité comme chute que les relecteurs ont jugée devinable (l.122) puis comme chute à laquelle a est préférée (l.128), mais Thomas ne l'a jamais vue : un argument de la reco repose sur un texte absent. (b) l.26 dit « comme avec c » pour le cas sans lettre, or avec c le PS en ligne est désactivé tout de suite (l.123) et sans lettre il reste en ligne (handoff l.393 : « rien n'est désactivé »). Thomas peut croire que sans lettre le PS sous la barre est lui aussi retiré.
Correction : (a) dans l.128, ajouter les derniers mots de cette chute entre guillemets (« … mais sept » = le même PS avec la fin « mais sept. ») ou retirer la comparaison. (b) l.26 : « Sans lettre, le 7 reste sans réponse : l'étape 2 attend, le PS actuel reste en ligne en attendant, et la question t'est reposée. »
