# Annexe du tour 16 : B3, B10, B12 (critère unique : l'envie de payer)

Entrées lues : `tour15/resultats-tour15.md`, `tour15/pack-tour15.md`, `tour15/cles-tour15.md`, `tour15/verdicts/verdict-r{1,2,3}.md`, `tour14/textes-finaux.md`, `tour14/pack-tour14.md`, `tour14/annexe-tour14.md`. Gagnants du vote : B3 = E, B10 = A (version du tour 13), B12 = A. Les 14 autres blocs (B1, B2, B4+B5, B6, B7, B8, B9, B11, B13, B14, B15, B16, B17, B18) sont recopiés sans une retouche. Frameworks et niveaux de conscience inchangés : B3 `[Framework : PAS léger, Conscience : Problem-Aware]`, B10 `[Framework : AIDA, Conscience : Solution-Aware]`, B12 `[Framework : AIDA, Conscience : Product-Aware]`.

Règle suivie : je pars du gagnant et je n'applique que les retouches où au moins deux relecteurs convergent. Quand une demande du brief n'est portée que par un seul relecteur, je le dis.

## 1. Ce qui change, mesuré (par rapport à `tour14/textes-finaux.md`)

| Bloc | Zone touchée | Zone intouchée (vérifiée) |
|---|---|---|
| B3 | Libellé du lien (35 à 62 caractères, libellé propre `OUVRIR_ACCUEIL`) ; `[S20]` : « La suite » devient « Les 3 suivantes », « c'est Premium » reste, les articles « un » de la liste sautent (186 à 187 caractères) | Titre, bouton `[S19]`, « Retourner les piques avec le sourire », « résiliable depuis ton profil », « du parcours Répartie », liste (défi, 5 vannes, 2 vidéos, quiz) |
| B10 | `[S15]` : les favoris quittent la dernière phrase et entrent dans la phrase des parcours, avec leur rôle (4 phrases ramenées à 3) | `[S14]`, les deux premières phrases de `[S15]` (mot pour mot), « un défi à chaque fois », boutons, `[S16]`, `[S25]`, lien |
| B12 | Phrase de profil de L'Absurde seule (147 à environ 180 caractères) | Phrase d'étape 1, bouton, lien, les deux phrases de prix et de garantie, les 4 autres profils : mot pour mot |

Aucun slug, titre d'étape, prix, durée ni chiffre n'a bougé. Trois retouches ciblées, pas une réécriture. Pour les 14 blocs validés : même nombre de lignes dans chaque section que `tour14/textes-finaux.md` (contrôle des repères `##`, décalage constant de +1 ligne dû à la seule nouvelle constante `OUVRIR_ACCUEIL`) et 11 lignes témoins longues retrouvées à l'identique dans les deux fichiers.

## 2. B3

**Lien : `Ouvrir les 5 parcours, de la coloc à l'afterwork · 2,99 €/mois`** (62 caractères, comptés par outil). Gagnant des trois relecteurs, sans retouche demandée. Libellé **propre à l'accueil** (`OUVRIR_ACCUEIL`) : `OUVRIR` partagé avec B2, B4+B5 et B16 ne bouge pas. Vérité de « de la coloc à l'afterwork » : carte Répartie (« en coloc ») et carte Machine à Café (« à l'afterwork », étape 4 de Boulot aussi). Repli sur `OUVRIR` si un de ces deux parcours est dépublié ou si `PARCOURS_COUNT` est inférieur à 5.

**Note `[S20]` : 187 caractères.** Mesure faite avec un outil (recherche par expression régulière `^.{N}$` sur le texte exact, espaces, guillemets et apostrophes comptés pour un), pas à la main. Variantes testées :

| Variante | Caractères | Tient en 190 ? |
|---|---|---|
| Note du tour 14 (« La suite », liste avec « un ») | 186 | oui |
| « Les 3 suivantes », « c'est », liste avec « un » | 193 | non |
| « Les 3 suivantes », « sont dans », liste avec « un » (proposition r2 à la lettre, avec « du parcours ») | 197 | non |
| « Les 3 suivantes », « sont dans », liste sans « un » | 191 | non (1 de trop) |
| « Les 3 suivantes », « sont dans », sans le quiz | 188 | oui, mais sans quiz |
| « Les 3 suivantes », « sont dans », « de Répartie » au lieu de « du parcours Répartie » (version de r2) | 188 | oui, mais sans le mot « parcours » |
| avec conseil, « c'est », liste sans « un » | 196 | non |
| avec conseil, « sont dans », liste sans « un » | entre 198 et 205 (196 + 4) | non |
| **Retenue : « Les 3 suivantes », « c'est », liste sans « un »** | **187** | **oui** |

Arbitrage, dans l'ordre du brief puis du nombre de relecteurs :
- **« Les 3 suivantes » gardé** (priorité du brief). Il dit combien d'étapes sont derrière Premium et lève le doute de r2 et r3 (l'étape 2 passait pour gratuite).
- **« du parcours Répartie » gardé** : r1 et r3 signalent que « l'étape 1 de Répartie » sans le mot « parcours » laisse le nouveau venu deviner ce qu'est Répartie (le paragraphe au-dessus ne contient pas ce mot).
- **Le quiz reste dans la liste** : les trois relecteurs l'ont gardé dans leur propre version de la note.
- **« sont dans Premium » (r2) n'a pas tenu** : avec les trois éléments ci-dessus, la note fait 191. Je prends « c'est Premium », forme du gagnant et du tour 14 (déjà notée 9, 9, 9), qui dit aussi que les étapes sont payantes. Les articles « un » de la liste sautent (« défi, 5 vannes, 2 vidéos, quiz »), forme que r3 utilise dans sa propre version.
- **Le conseil ne rentre pas.** Il n'est demandé que par r3 (un relecteur sur trois : pas de convergence) et il coûte 9 caractères que la note n'a pas sans sacrifier « Les 3 suivantes », « parcours » ou les nombres. La liste reste un sous-ensemble vrai du contenu de l'étape 1 (un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz). Si Thomas veut le conseil, la piste mesurée est de passer à « de Répartie » (9 caractères de moins, donc 196 - 9 = 187 avec « c'est »), ce qui perd le mot « parcours ».
- **Non retenu, hors périmètre du brief** : le verbe « Trouver » à la place de « Tester » dans le bouton (r3 seul), le bouton et le titre restent ceux du gagnant.

## 3. B10

Point de départ : la version du tour 13 (9, 10, 10), deux phrases de tête identiques, une phrase de parcours.

- **Favoris** : sortis de la liste qui mène à « faire rire » (r1, r3), rôle dit avec la formule validée de B8 et B9 (« tes favoris te gardent … sous la main »), placés dans la phrase des parcours : « Avec le même abonnement, tes favoris te gardent cette vidéo sous la main, et les 5 parcours sont ouverts en entier : 15 à 20 minutes par étape, un défi à chaque fois. » Le texte finit comme la version du tour 13, sur « un défi à chaque fois », pas sur les favoris (argument le plus faible, selon r1 et r2).
- « Avec le même abonnement » plutôt que « Tes favoris te la gardent » en tête de phrase : sans ce rappel, les favoris pourraient se lire comme gratuits. « cette vidéo » plutôt que « la » : après un nom d'étape, « la » pourrait désigner l'étape (raison déjà notée au tour 14). « sont ouverts en entier » plutôt que « ouvre » : une seule principale par phrase, et « en entier » garde le fait (tout est ouvert d'un coup).
- **Contour `[S25]` : gabarit gardé** (« Gratuit : 2 vidéos et un défi, étape 1 de Répartie »). r1 et r3 demandent « étape 1 du parcours Répartie ». B8 et B9 sont validés avec « étape 1 de {P} » et le brief interdit de les rouvrir. Le mot « parcours » est déjà dans `[S15]`, au-dessus : « les 5 parcours sont ouverts en entier ». Je n'ai pas ajouté « Répartie » dans `[S15]` : cela rendrait le texte dépendant de `{P}` et l'alourdirait. Si le vote montre encore ce frein, la piste est de changer le gabarit des trois blocs ensemble (B8, B9, B10), décision pour un autre tour.
- Vérité : favoris des vidéos dans Premium (faits communs) ; points clés et exercice dans Premium ; rien n'est dit du contenu de l'analyse.

## 4. B12 (L'Absurde seulement)

Retenu : « Les autres ne savent jamais où vont tes idées, encore faut-il les placer : « Sentir le bon moment », la 2e de Machine à Café, t'apprend à repérer où il y a de la place pour elles. »

- **Contradiction dans les consignes, résolue ainsi.** La proposition de r2 (« Les autres ne savent jamais où tu vas, encore faut-il choisir quand y aller ») et « pour elles » ne vont pas ensemble : « elles » n'aurait aucun antécédent. J'ai gardé l'image exacte du profil (« Les autres ne savent jamais où tu vas ») en la faisant porter sur les idées (« où vont tes idées »), ce qui fournit l'antécédent de « les placer » et de « pour elles ». « Encore faut-il les placer » est le manque nommé par le gagnant, que les trois relecteurs créditent.
- **« Allège le début »** : le début perd la relative (« que personne n'attendait ») et devient une phrase simple, mais il n'est pas plus court en caractères (environ 72 contre 61). La phrase entière passe de 147 à environ 180 caractères. Repli si une relecture la juge encore lourde : « Personne ne sait où vont tes idées, encore faut-il les placer », qui garde l'image sans l'écho mot pour mot (à tester, pas retenu).
- **« la 2e de Machine à Café »** gardé, comme les quatre autres profils. « pour elles » vaut « pour toi » (les idées de la phrase) : la fin reprend toujours le texte public de l'étape 2 (« où il y a de la place pour toi »).
- **Vérité** : « t'apprend à repérer où il y a de la place » décrit le contenu de l'étape 2 (« Écouter un groupe … où il y a de la place pour toi »), pas un résultat promis. « Les autres ne savent jamais où tu vas » est le texte public du profil.
- **Hors périmètre** : la remarque de r3 (sur les quatre autres profils, nommer ce qui reste à travailler plutôt que flatter une force) touche des phrases que le brief déclare fixes. Pas appliquée, relevée pour un tour ultérieur.

## 5. Objections traitées dans les trois blocs

- « Combien ça coûte, et si je regrette ? » : prix, résiliation depuis le profil et remboursement du premier paiement dans 14 jours (B3 note, B10 `[S16]`, B12 ligne Premium).
- « Je ne sais pas ce que c'est un parcours / si c'est pour moi » : B3 (lien « de la coloc à l'afterwork », « du parcours Répartie »), B12 (étape 1 gratuite d'abord).
- « Je ne vais pas payer pour ce que je sais déjà ou pour regarder un humoriste » : B10 (« pour faire rire, plus seulement pour rire »), B12 (le manque nommé avant l'étape).
- « L'étape 2 est-elle gratuite ? » : B3 (« Les 3 suivantes … c'est Premium »).

## 6. Contrôles faits

- Zéro tiret cadratin ni demi-cadratin dans les trois fichiers du tour 16 (recherche automatique, 0 occurrence). Zéro « en un clic » pour la résiliation. Aucun témoignage, aucun chiffre hors faits vrais, aucune promesse de résultat.
- `pack-tour16.md` : trois blocs, format du pack du tour 14, consigne et faits vrais identiques, aucune mention d'une version précédente, d'un tour, d'un candidat ni d'une retouche (recherche des mots « tour », « version », « candidat », « gagnant »).
- `textes-finaux.md` : table complète des 17 blocs, variables et liste de chaînes à grep mises à jour (nouvelles chaînes interdites au tour 16 : l'ancienne note B3, l'ancienne liste de cette note, l'ancien début et l'ancienne fin de la phrase de L'Absurde, l'ancienne dernière phrase de B10).
- Pas de commit, aucun fichier de `src/` touché, donc rien à ajouter dans `REPLIT_ACTIONS.md`.

## 7. Reste hors périmètre

La correction de « en un clic » dans `apps/web/src/lib/llms-content.ts` (l. 78 et l. 154), signalée au tour 13, n'est pas faite ici. Rien ne se branche tant que les trois blocs ne sont pas à 10 chez les trois relecteurs.
