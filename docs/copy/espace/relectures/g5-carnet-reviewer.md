# Porte G5 : relecture à l'aveugle du carnet (oct. + nov.), @reviewer, 13/11/2026

Grille : `checklist-fautes-recurrentes.md` + barre `ton-alex.md`. La carte « Et toi ? » n'offre pas de choix (`carte-et-toi.tsx` l. 15-16) : la règle « une seule bonne réponse » ne s'applique pas. `onTeDit` est affiché entre « » (l. 48) : un « » dans ce champ devient un guillemet imbriqué. Tiret cadratin et guillemets droits : zéro dans les deux JSON (Grep). Aucun fichier modifié.

## 1. H10 (`2026-11-25`), tour de relecture : GO (10/10)
Seul changement depuis la v5 relue, l. 303 : « arrachée au dernier round, et » devient « à la décision des juges. Et ». C'est juste (une victoire aux points se décide sur les feuilles des juges, sans K.-O.) et ça reprend la correction du relecteur 1 (`verdict-v5-r1.md` l. 14), sans « après tous les rounds », ce qui ne retire rien. Pas de genre, de cible ou de moule. Rien à corriger.

## 2. Diff de `2026-11.json` contre la dernière version relue
**Version de référence** : le texte effectivement lu à l'aveugle, c'est-à-dire `pack-fiches-30-aveugle-v4.md` pour les 24 fiches non retouchées et `pack-confirmation-v5.md` pour les 6 retouchées, avec la correspondance de `cles-fiches-aveugle-v3.json`. Pourquoi : les relecteurs ont noté ces packs et pas un commit du JSON. Limite : je n'avais pas de shell, donc pas de `git log`/`git show`. À lancer pour confirmer : `git log -p --follow apps/web/src/data/carnet/2026-11.json`.
**Résultat** : sur 30 fiches × 8 champs, la seule différence est H10 l. 303 (voir 1). Les champs hors packs (`id`, `contexte`, `offerte`, `intro` l. 4) n'ont jamais été relus. La carte n'affiche pas `intro`.
**Mais** : la grille de l'espace (genre) est plus stricte que celle des packs. 14 fiches de novembre ne passent pas :

| Fiche (ligne) | Faute | Correction proposée |
|---|---|---|
| 11-04 (l. 48, 51) | genre : « Tu es sûr », « Pas sûr » | « Tu connais vraiment le chemin ? La dernière fois, on a visité un champ. » / « Pas vraiment, non. Je mets le GPS… » |
| 11-05 (l. 64) | genre : « fier comme si » | « avec la fierté de quelqu'un qui vient de prendre un vrai risque » |
| 11-08 (l. 95) | genre : « t'a repéré » | « …et l'un d'eux, à l'apéro, te propose de venir. » |
| 11-11 (l. 136) | genre : « pas très fort » | « Je n'ai pas un grand niveau, mais je suis là. » |
| 11-14 (l. 173) | genre : « fier de toi » | « …entre deux doigts, avec fierté. » |
| 11-17 (l. 207) | genre : « celui qui en parle » (toi) | « …sauf à te rassurer. » |
| 11-18 (l. 220) | genre : « Désolé » (fiche gardée telle quelle par Thomas le 18/10, c'est lui qui tranche) | « Pardon pour le retard, je rattrape ça dans la matinée. » |
| 11-19 (l. 232) | genre : « Désolé » | « Pardon pour le retard. Qu'est-ce que j'ai raté ? » |
| 11-21 (l. 249, 252, 254, 257) | genre : titre « Le premier arrivé », « tu es le premier arrivé », **réplique** « Je suis venu » | titre « En avance au pot » ; « tu arrives en premier » ; « Je viens dire au revoir à Philippe. » (même chose dans l'exercice) |
| 11-22 (l. 262-266) | **blague déjà connue** (salle de sport, listée dans la checklist l. 21 ; « passer devant » la salle existe déjà en blague) + genre « inscrit », « allé » | sortir la fiche de la rafale, ou nouvelle réplique par @copywriter, puis relecture à l'aveugle |
| 11-24 (l. 291) | genre : « t'avoir mis à l'abri » | « …de te mettre à l'abri. » |
| 11-27 (l. 326-327) | genre, **réplique** : « Je suis venu », « pas venu », « rendu tout seul » | « J'étais là à Pâques. » ; « …depuis quand tu n'as pas mis les pieds ici. Tu te livres toi-même, avec ton propre alibi. » |
| 11-29 (l. 349) | guillemets imbriqués : affichage « Tu viens de dire « oui »… » | « Tu viens de dire “oui” sans m'écouter. » |
| 11-30 (l. 362, 364) | genre, **réplique** : « je suis assis », « un peu nerveux » | « Depuis qu'on a commandé, je sens la dette. » ; « J'ai un peu le trac, et ça… » |

**GO novembre (16)** : 11-01, 02, 03, 06, 07, 09, 10, 12, 13, 15, 16, 20, 23, 25 (H10), 26, 28. À signaler à Thomas sans que ce soit une faute : 11-12, le « Pourquoi » (« héritage », l. 147) fait penser à un père mort (règle « pas de deuil ») ; 11-08, l'idée de se faire doubler par une poussette est un gag connu des coureurs, mais la chute (le bébé gêné) est neuve.

## 3. Octobre (`2026-10.json`) : réplique relue (1.4), autres champs relus ici
| Fiche (ligne) | Faute | Correction proposée |
|---|---|---|
| 10-01 (l. 13) | genre : « t'a rendu bavard » | « …le soleil te fait parler dans un lieu où l'on se tait. » |
| 10-09 (l. 100) | genre, **réplique** : « m'a remercié » | « Mon professeur m'a dit merci par écrit. » (l'exercice finit toujours sur « par écrit ») |
| 10-12 (l. 132) | genre de la personne en face : « Désolé… crevé » (les deux exemples de la checklist l. 7) | « Pardon, je peux pas ce soir, je suis à plat. » |
| 10-14 (l. 156) | genre : « le nouveau venu » (la situation dit « une personne ») | « …et la personne qui vient d'arriver a envie d'en savoir plus. » |
| 10-15 (l. 170) | genre : « plutôt discret » | « Oui, au début, je parle peu. Parle-moi de toi… » |
| 10-04 (l. 43) | ambiguïté : « au salon » peut se lire comme une foire | « Dans le salon, un inconnu te raconte sa randonnée… » |
| 13 « Pourquoi » (l. 13, 24, 35, 46, 57, 68, 79, 90, 101, 112, 145, 156, 169) | moule « Le rire tombe sur… » dans 13 fiches sur 15, très visible dans une rafale (checklist l. 22) | supprimer cette proposition : la phrase qui précède porte déjà le mécanisme. Une seule décision de Thomas suffit pour les 13 |

Non bloquant : « Dis la réplique à voix haute » ouvre 11 exercices sur 15. À varier si les fiches sont réécrites.
**GO octobre (1)** : 10-11. **À corriger (14)** : 10-01, 09, 12, 14, 15 (genre, avec le moule) ; 10-04 (moule et « salon ») ; 10-02, 03, 05, 06, 07, 08, 10, 13 (le moule seulement).

## 4. Verdict global G5 : NO-GO en l'état
- **17 fiches GO sur 45** (16 en novembre, dont H10, et 10-11). **28 à corriger** : 14 en novembre, 14 en octobre, dont 8 pour le seul moule.
- Règle d'or P0 s18 : chaque fiche corrigée repasse une relecture à l'aveugle (C8 : 10/10 partout, 4 tours au plus) **puis** revient à Thomas. Les répliques touchées sont prioritaires : 11-21, 11-22, 11-27, 11-30, 10-09.
- Les 45 fiches sont en ligne : corriger le JSON change aussi le carnet publié.
- **À trancher par Thomas** : (a) faire entrer tout de suite les 17 GO, ou attendre les 45 ; (b) le moule d'octobre (une décision pour 13 fiches) ; (c) 11-22, sortie de la rafale ou réécriture ; (d) 11-18 (sa décision du 18/10 portait sur la prémisse, pas sur le « Désolé »).
