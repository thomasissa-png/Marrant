# Relecture à l'aveugle : étiquetage des défis par marche (s24)

Relu : `etiquetage-defis-marches-s24.md` (127 défis) contre `conseils-seed.json` et `videos-seed.json`, cadre `architecture-contenu-v20.md` l. 271 à 280. Méthode de citation : Grep des 127 champs `exercise` (numéros de ligne) puis comparaison phrase à phrase, et Grep exact du texte de la table sur les passages longs (conseils 81 et 82). Pas de script de diff possible ici (pas d'outil d'exécution) : contrôle manuel outillé, pas un diff machine.

## 1. Écarts de citation (1 sur 127)
- **conseil-70 (l. 272)** : la table ajoute « sans te retourner » dans « puis fais encore cinq pas ~~sans te retourner~~ avant de t'arrêter ». Le seed dit « puis fais encore cinq pas avant de t'arrêter. » Vérifié : la chaîne n'existe que dans la table. À corriger dans la table, pas dans le seed.
- Les 127 numéros de ligne et la correspondance des id sont justes. conseil-6 : `<br><br>` rend le `\n\n` du seed (deux paragraphes), acceptable pour `enonce` en tableau.

## 2. Marches à changer
| Défi | Actuelle | Juste | Raison |
|---|---|---|---|
| conseil-30 | 3 | 1 | « Lis-le à quelqu'un **si tu peux** » est facultatif ; le critère principal (deux lectures vraies) se vérifie seul. Même règle que conseil-46 (l. 9 de la table). |
| conseil-39 | 1 | 3 | « Pas de public : dis-le… devant ton téléphone » est le repli ; le chemin principal suppose un public (règle l. 8 : le repli ne fixe pas la marche). |
| video-64 | 3 | 1 | « raconte une visite » sans destinataire, aucun critère de réaction : la règle l. 10 donne 1 (traité comme video-63, conseil-45). Comparer video-44, qui dit « à un ami ». |
| conseil-14 | 1 | hors missions [1] | H4 limite : 2 options sur 3 (« un voisin, un collègue ») font d'un absent la cible de l'escalade. Même motif que conseil-18. |
| video-1 | 3 | hors missions [3] | H4 limite : l'option « un collègue » décrit comme un animal rare, raconté en son absence. |
| video-17 | 4 | hors missions [4] | H4 limite : l'option « voisins » comme cible d'un message envoyé dans un groupe (motif de video-14). |
| video-85 | 3 | hors missions [3] | H5 : le défi impose de regarder « La vie éternelle » (Blanche Gardin, sur la mort, l. 1537 : « aller là où ça fait mal ») ; il touche au deuil et à l'humour noir. Décision de session : il reste hors missions. |

Les autres marches déduites tiennent (conseils 1, 31, 40, 45 ; vidéos 5, 6, 20, 22, 29, 51, 62, 63, 67, 70, 79). « Collègue » reste en 5 (conseil 53, vidéos 24, 66, 86), comme décidé.

## 3. Provocable cette semaine
Juste partout. Les attentes d'un événement sont couvertes par un repli écrit (conseils 31, 42, 58, 71) ou tiennent dans les 7 jours (vidéos 2, 7, 39, 69, 86). H1 justifié pour les vidéos 9, 30 et 89.

## 4. Les 16 hors missions
Tous justifiés au regard des décisions (les 6 limite restent dehors, H5 reste dehors). **Écart de rédaction** : H5 (l. 19) et les raisons des vidéos 38, 59 et 76 disent « relève du coin humour noir 3.12 », et le point 6.3 en fait une hypothèse. La décision de session est l'inverse : hors missions, **pas d'envoi au coin**. Il faut réécrire H5 et retirer le point 6.3.

## 5. Sujets interdits dans les défis gardés
Rien sur la rupture, le deuil ou la santé d'un proche une fois les corrections de §2 faites. Deux points restent à surveiller :
- **video-61** : la raison dit « présente, jamais absente », alors que le seed dit « **idéalement** devant la personne concernée ». La raison est donc inexacte. Je garde la marche 3, mais le fondateur doit trancher entre garder et mettre en limite.
- **Contexte manquant à l'import** : video-33 (« le gala ») et video-60 (défi rattaché à une vidéo d'humour noir, l. 1086, mais l'énoncé ne renvoie pas à la vidéo) sont gardés. Le format de `missions.json` n'a pas de champ vidéo, donc l'énoncé de video-33 ne veut rien dire seul.

## 6. Comptes après corrections
Marche 1 : 44 (inchangé, +2 −2) · 2 : 10 · 3 : 39 · **4 : 6** · 5 : 8 · hors missions : 20 · missions : 107. Toutes les marches restent au-dessus du seuil de 5 ; la marche 4 est la plus juste.

## Verdict
**NO-GO en l'état, GO après corrections.** Il faut corriger 1 citation, changer 3 marches, sortir 4 défis et réécrire H5. Aucune correction ne touche aux seeds. Les corrections sont à faire par l'auteur de la table, puis seuls les points ci-dessus sont à revérifier.
