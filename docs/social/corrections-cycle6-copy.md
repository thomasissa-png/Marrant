# Corrections cycle 6, copy : légendes Instagram semaine 0, pont du quiz X, modèle de légende (05/10/2026)

> @copywriter. Lu : founder-preferences (R6, compte = marque, zéro tiret cadratin, jamais de prix, humoristes et IA autorisés), validation-thomas-s15 (étalons), strategie-relance-v5 §8 et §10 (R3 : pour qui ou quand, jamais ce que la vanne raconte), notation-relance-cycle6-social §2 et §4, lot-semaine0.json, page et données du quiz.
> Aucun texte ci-dessous ne contient de lien, d'émoji, de hashtag, de prix ni de tiret cadratin. Décomptes faits à la main, caractères et espaces compris, point final inclus.
> Étalons validés : « À envoyer à ton tuteur de stage. » (destinataire précis), « À envoyer à qui a un tour de table demain. » (le moment), « À envoyer à celui qui n'est jamais sûr d'être invité. » (le type de personne). Ils reprennent le sujet de la vanne, jamais sa chute.

## 1. Légendes Instagram, 4 cartes vanne de la semaine 0

Format : légende seule, 80 caractères au plus. Les 4 retenues font 58 caractères ou moins : si Thomas ou @fullstack veulent garder le pied « deviens-marrant.fr » (espace + 18), le total reste sous 80 (maximum 77).

### Post 06/10, `cade959f…` (draps)
| | Candidate | Car. |
|---|---|---|
| A | À envoyer à ton copain, avant de partir chez ta mère. | 53 |
| B | À envoyer à celui qui ne peut pas vivre sans toi. | 49 |
| **C, retenue** | **À envoyer à ton copain, à tes risques.** | **38** |

Retenue C : même mécanique que « ton tuteur de stage » (on l'envoie à la personne visée, et la menace fait rire), sans rien dire de la chute. A est plus drôle mais place « ta mère » deux fois dans la semaine (le 09/10 aussi). B explique trop la phrase de départ.

### Post 07/10, `c9ce63fb…` (Robert, entretien)
| | Candidate | Car. |
|---|---|---|
| A | À envoyer à qui a un entretien cette semaine. | 45 |
| **B, retenue** | **À envoyer à qui a un entretien demain et rien à se mettre.** | **58** |
| C | À envoyer à qui répète son entretien devant le miroir. | 54 |

Retenue B : le moment (étalon « tour de table demain ») plus la phrase que tout le monde a déjà dite la veille d'un entretien. Elle annonce la situation de la vanne (le costume) sans citer le costume ni le nom cousu.

### Post 08/10, `c7322a82…` (père retraité)
| | Candidate | Car. |
|---|---|---|
| A | À envoyer à ton père, s'il a le temps. | 38 |
| **B, retenue** | **À envoyer à ton père, s'il peut se libérer.** | **43** |
| C | À envoyer à ton père, entre deux rendez-vous. | 45 |

Retenue B : « se libérer » est le vocabulaire d'agenda de quelqu'un de très pris, donc la légende joue déjà la scène. A est juste mais « avoir le temps » parle à un retraité de ce qu'il a trop. Aucune candidate ne parle du nuage ni de « planning » (le post X du jour porte déjà ce mot).

### Post 09/10, `cffb035c…` (numéro de sécu)
| | Candidate | Car. |
|---|---|---|
| **A, retenue** | **À envoyer à qui a déjà appelé sa mère pour un papier.** | **53** |
| B | À envoyer à ta mère, qui garde tous tes papiers. | 48 |
| C | À envoyer à qui ne sait jamais où est sa carte vitale. | 54 |

Retenue A : le type de personne (étalon 3), tout le monde s'y reconnaît, et elle ne dit rien de « de mémoire, avec les espaces ». B laisse deviner que la mère sait tout (début de chute). C glisse de « numéro de sécu » à « carte vitale » : fait voisin, pas identique.

## 2. Pont du post X du quiz, mer. 07/10 12:30

**Faits vérifiés** (page `apps/web/src/app/(dashboard)/quiz-humour/page.tsx`, `quiz-data.ts`) : 5 profils (Observateur, Storyteller, Absurde, Punchlineur, Taquin ; `QUIZ_PROFILES`, FAQ de la page) ; « environ 2 minutes » (FAQ et meta de la page) ; « sans inscription » (FAQ : « gratuit et se fait sans inscription », aucun accès à la session dans `components/quiz`). Non retenu faute de preuve : tout lien entre la vanne du jour et un profil, toute promesse de précision du résultat.

**Base du décompte X** : vanne entière 129 (ligne 1 : 97, ligne 2 : 31, saut de ligne : 1) + 2 sauts de ligne avant le pont = 131. Lien compté 23. Plafond 270, donc pont texte + lien ≤ 139.

| | Candidate (avant le lien) | Pont texte | + lien 23 | Total X |
|---|---|---|---|---|
| A | Et toi, quel est ton profil d'humour ? Cinq possibles, environ 2 minutes, sans inscription : | 93 | 116 | 247 |
| B | 5 profils d'humour : Observateur, Storyteller, Absurde, Punchlineur, Taquin. Lequel es-tu ? Sans inscription : | 111 | 134 | 265 |
| **C, retenue** | **Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription :** | **90** | **113** | **244** |

Retenue C : garde le « Et toi » qui fait le lien avec la vanne, ajoute « d'humour » (le seul manque du texte actuel), garde les deux faits qui rassurent (2 minutes, sans inscription), 26 caractères sous le plafond. B nomme les profils mais perd « 2 minutes » (moins de motivation à cliquer). A dit « cinq possibles », moins net que « 5 profils ».

Texte complet à mettre en base (le lien UTM existant reste identique) :
```
« Mon copain a vu sur la carte que j'allais à la salle de sport tous les mardis. Il était fier. »
« Il a zoomé. Sur le parking. »

Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription : <lien>
```
Signalé sans y toucher : « sur la carte » ne dit pas qu'il s'agit de Google Maps ; la vanne reste inchangée (hors périmètre de cette correction).

## 3. Modèle de légende pour les lots suivants (5 lignes)

1. Forme : « À envoyer à ... », une phrase, point final, 80 caractères au plus, sans lien, émoji, hashtag, prix ni tiret cadratin ; le pied reste sur la carte.
2. Destinataire précis : une personne (« ton tuteur de stage »), un moment (« qui a un tour de table demain ») ou un type (« celui qui n'est jamais sûr d'être invité »), pris dans le sujet de la vanne.
3. Drôle par la situation : la légende met le lecteur dans l'action (envoyer la vanne à la personne visée, avec ou sans menace), jamais de jeu de mots ajouté.
4. Jamais la chute ni son explication, aucun mot de la ligne 2 de la carte ; test : la légende lue seule ne permet pas de deviner la chute.
5. Écrire 3 candidates, retenir la plus courte qui garde la situation, et varier d'un post à l'autre (pas deux « ton père, ta mère » dans la même semaine, pas deux fois la même tournure). « Lien en bio » une seule fois, seulement sur un relais d'article de moins de 48 h.

## Handoff

- Fichier : `/home/user/Marrant/docs/social/corrections-cycle6-copy.md`.
- Retenues : 06/10 « À envoyer à ton copain, à tes risques. » (38) ; 07/10 « À envoyer à qui a un entretien demain et rien à se mettre. » (58) ; 08/10 « À envoyer à ton père, s'il peut se libérer. » (43) ; 09/10 « À envoyer à qui a déjà appelé sa mère pour un papier. » (53). Pont quiz : « Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription : <lien> » (244 sur 270).
- À faire (@fullstack) : remplacer `content` des 4 posts Instagram (aujourd'hui « deviens-marrant.fr ») et le pont du post `c2acdc88…` ; rien d'autre n'est modifié.
- Décision Thomas : légende avec ou sans pied « deviens-marrant.fr » ; par défaut sans (déjà sur la carte, non cliquable), les 4 tiennent dans les 80 avec.
- Registre : [Framework : invitation au partage, une phrase] ; [Conscience : Problem-Aware, froid à 0 abonné]. Objection traitée : « pub déguisée » (aucun lien, aucune promesse de produit).
