# Étapes 2 à 6, itération 1, relecteur à l'aveugle n°1

> Fichier noté : `docs/copy/parcours-storytelling-etapes-2-6-s18.md` (non modifié). Hors notation : les 5 vannes neuves de l'étape 5. Acquis non rediscuté : étalons, conseils en base, 3 conseils validés, callback réécrit (C033).
> Sources confrontées : `vannes-actives-s17.json`, `parcours-reecriture-s17.json` (13 étapes s17, vannes en `jokeContents`), `conseils-storytelling-base-s18.json`, `conseils-finaux-109.json` (C033), `videos-seed.json`, étalons s18.

## Vérifications

| Point | Résultat |
|---|---|
| 20 vannes actives (étapes 2, 3, 4, 6) | Toutes présentes au texte exact dans `vannes-actives-s17.json`, `content` et `punchline` (y compris les guillemets droits de « Choisis le resto »). Aucune dans `parcours-reecriture-s17.json`, aucune dans l'étape 1 (carottes, Halloween, série, tondeuse, couettes). Aucun doublon entre les étapes 2 à 6. |
| Conseils affichés | Étapes 2 et 3 : texte de la base. Étapes 4 et 5 : textes validés des étalons §1. Étape 6 : C033 au mot près (« un détail qui a déjà fait rire (ou qui a juste été dit) », chiffre, version débutant, version avancée, « C'est réussi si quelqu'un sourit »). Les quiz des étapes 2, 4 et 5 et les questions 1 à 5 de l'étape 6 suivent chacun une phrase du conseil. |
| Bonnes réponses | Positions A C B D, C D A B, D A C B, C B D A, B D C A D. Recompte : A 6, B 6, C 6, D 7 sur 25 (max 28 %). Jamais deux de suite au même rang, y compris aux jonctions entre étapes (C→A, D→C, B→D, B→C, A→B). Jamais plus de 2 fois le même rang dans une étape. Chaque explication tient en 3 phrases et nomme la faute de chaque mauvaise réponse. |
| Vidéos | Les 9 durées sont identiques à `videos-seed.json`, et les 3 plafonds de 8 min concernent les obligatoires (Djimo, 8 min 50, est facultative). Une seule vidéo à l'étape 6, conformément à la spec. Les légendes s'appuient sur les fiches (imitation tendre, dialogue reconstruit, ironie plutôt que pathos, souvenir amplifié, public pris à témoin, récurrence). Écarts : R2 et R7. |
| Voix | Zéro tiret cadratin (recherche). « Blague » seulement dans le titre consacré et dans la note sur l'ancien titre du callback. Aucun prénom de persona (Samir, Hugo, Nadia, Maëlle), aucune marque, tutoiement partout. |

## Notes

| Critère | Note | Justification |
|---|---|---|
| C1 Drôlerie et naturel | 9/10 | Les scènes sont au niveau de l'étalon : le cousin « Attends, attends », l'étagère qui fait pencher la tête, le chat pris pour un amoureux, les poules qui regardent un défilé, le sandwich « pour l'énergie ». Comme la question 3 de l'étape 2 (« Ce n'est pas un reproche »). Seule ombre : la bonne réponse de la question 2 de l'étape 3 recopie la vanne de la scène (R3). |
| C2 Voix et règles | 10/10 | Toutes les règles sont tenues. |
| C3 Exactitude et preuve | 8/10 | Une « vraie leçon » culinaire fausse (R3), un décryptage qui décrit mal sa vanne (R4), une explication qui ne correspond pas à son option (R5), une légende qui affirme un moment absent de la fiche (R7). |
| C4 Cohérence spec, étalons et conseils | 8/10 | Le défi B de l'étape 6, validé par Thomas, est réécrit sans son accord, et la scène de l'étape 6 contredit la raison donnée (R1). La vidéo obligatoire de l'étape 4 renvoie à la technique de l'étape 6 (R2). |
| C5 Facilité de décision | 9/10 | Le récapitulatif des positions, les signalements et le handoff sont clairs. Mais la modification d'un texte validé n'est remontée nulle part comme point à confirmer (R1). |

**Note globale : 8/10.**

## Défauts

### Importants

**R1. Étape 6 : défi B réécrit alors que Thomas l'a validé, et scène incohérente avec la raison donnée** (étape 6, défi « TON ANECDOTE », l. 328 ; paragraphe l. 330 ; `moduleDetail` l. 323).
Le texte validé (étalons §7, choix 6B) dit : « Plante dans ses deux premières phrases un détail qui fait sourire, et fais-le revenir dans la chute : la deuxième fois, il fait rire. » Il devient « dans ses premières phrases […] : ceux qui s'en souviennent sourient », au motif que C033 « a retiré « double le rire » ». Or C033 ne contredit pas le texte validé (« la surprise s'ajoute au souvenir »), et le changement n'est soumis à Thomas nulle part (P0 s8). En même temps, la scène garde l'idée du double rire, mais embrouillée : « Personne n'y repense. […] La salle rit une première fois sur le sandwich, une seconde parce qu'elle se souvient. »
Correction :
- Remettre le défi B mot pour mot tel que validé (« Plante dans ses deux premières phrases un détail qui fait sourire, et fais-le revenir dans la chute : la deuxième fois, il fait rire. Raconte-la ensuite à deux personnes cette semaine, à une soirée si l'occasion se présente ou une par une. Pas de public ? Envoie-la en vocal ou par écrit à deux amis. »).
- L. 330 : remplacer « Deux ajustements de mot… » par « Défi B repris tel que validé au §7 des étalons. »
- Scène : remplacer la phrase par « Au début, le thon a fait sourire ; à la fin, il fait rire, parce que tout le monde s'en souvient. »
- Si « premières phrases » paraît vraiment nécessaire, le présenter à Thomas en une ligne dans le handoff, sans l'appliquer d'office.

**R2. Étape 4 : la légende de la vidéo obligatoire enseigne le callback de l'étape 6, pas la double lecture** (étape 4, légende Paul Mirabel, l. 226).
Citation : « Repère un détail lâché en passant au début, et regarde s'il revient plus tard avec un autre sens ». C'est la « technique du callback personnel » de la fiche, presque la consigne de la légende de l'étape 6 (« Repère ce qui revient »). L'étape 4 enseigne la double lecture : l'élève y voit la technique de l'étape 6 avant de l'avoir apprise.
Correction : « Paul Mirabel raconte comment il s'est fait racketter. Repère un moment où tu crois comprendre une chose, et où la phrase suivante t'en montre une autre. `[À VÉRIFIER en visionnant : qu'un tel moment existe ; sinon, @product-manager échange les vidéos des étapes 4 et 6, la fiche de celle-ci décrivant justement le callback]` » Ajouter ce point au handoff (« À vérifier avant import »).

**R3. Étape 3, question 2 : leçon fausse et bonne réponse calquée sur la scène** (l. 124 à 129).
- A : « J'ai appris qu'il faut toujours saler l'eau. » L'explication la qualifie de « vraie leçon », or saler l'eau n'empêche pas les pâtes de coller (c'est remuer qui l'empêche).
- D : « la pizzeria d'en face connaît mon prénom » reprend la mécanique de la scène, juste au-dessus (« la quincaillerie me connaît par mon prénom »). La bonne réponse se trouve par simple ressemblance, et la vanne se répète.
Correction : A « J'ai appris qu'il faut remuer les pâtes pendant la cuisson. » ; D « **Le dîner n'est pas un échec : pour la première fois, tous mes invités se sont proposés pour cuisiner la prochaine fois.** » (l'explication reste juste telle quelle).

**R4. Étape 6, vanne 4 : le décryptage décrit un retour qui n'a pas lieu** (l. 392).
Citation : « Le verbe du conseil (« comparer ») revient dans la chute ». La chute (« J'ai vérifié, les autres n'ont pas ce problème. ») ne contient pas « comparer » : ce qui revient, c'est « les autres ».
Correction : « « Les autres » revient dans la chute : à peine le conseil reçu, il se compare encore, et c'est le détail du début qui le trahit. »

### Mineurs

**R5. Étape 5, question 1 : l'explication ne correspond pas à l'option A** (l. 264). La A (« si j'étais en retard, c'est que je n'étais pas à l'heure ») tourne en rond, elle n'explique rien. Correction : « La A tourne en rond, la B explique le retard, et la D annonce la chute au lieu d'ouvrir un tiroir. »

**R6. Étape 2, vanne 5 : décryptage qui genre le narrateur et reste flou** (l. 91). Citation : « le « ça dépend » du grand frère prudent, puis le frère, et même papa ». La vanne ne dit pas que le narrateur est un garçon. Correction : « Une phrase par personnage suffit : le « ça dépend » prudent de l'aîné, le « merci » du petit frère, et même papa, qu'on entend sans qu'il parle. »

**R7. Étape 3, légende Nora Hamzawi : un moment affirmé que la fiche n'établit pas** (l. 153). « Repère un moment où elle garde exactement les mêmes faits mais change de regard » vient de la spec, pas de la fiche, et contredit la règle « elles restent vraies quoi qu'on voie ». Correction : « Repère un moment où elle analyse sa propre réaction comme si elle la découvrait : c'est ce recul qui fait le bilan. » (fiche : introspection à voix haute, ironie plutôt que pathos). La dernière phrase sur le sujet sensible reste.

**R8. Étape 4, scène : les croquettes ne tranchent pas « pour le chat »** (l. 177). Des croquettes conviennent aussi à un chien, alors que le texte affirme « La troisième a tranché pour le chat ». Correction de la troisième phrase de la scène : « On a dîné face à face : des pâtes pour moi, des croquettes pour lui, et il a ronronné tout le repas. »

## Décompte

0 bloquant, 4 importants (R1 à R4), 4 mineurs (R5 à R8). Ces huit points corrigés, rien d'autre n'empêche 10/10.
