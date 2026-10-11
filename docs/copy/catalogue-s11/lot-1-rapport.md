# Lot 1 — rapport de refonte (s11, passe 2) — 29/09/2026

Périmètre : AUTODERISION, BOULOT, COUPLE, DATING, SOIREES, JEUX_DE_MOTS (126 vannes de `docs/content/blagues-seed.json`).
Sortie : `docs/copy/catalogue-s11/lot-1.jsonl` (119 lignes JSON valides, une par vanne réécrite, décryptage complet inclus).
Barre appliquée : étalons A/B, et le [CHOIX UTILISATEUR] « déjà connue ailleurs = faible ». Aucun autre fichier modifié, rien de commité.

## 1. Bilan par catégorie

| Catégorie | Total | Gardées | Réécrites | Ids gardés |
|---|---|---|---|---|
| AUTODERISION | 34 | 2 | 32 | 80, 334 |
| BOULOT | 27 | 1 | 26 | 106 |
| COUPLE | 23 | 1 | 22 | 105 |
| DATING | 19 | 0 | 19 | aucun |
| SOIREES | 19 | 2 | 17 | 284, 286 |
| JEUX_DE_MOTS | 4 | 1 | 3 | 55 |
| **Total** | **126** | **7** | **119** | |

Pourquoi j'en garde si peu : la grande majorité des vannes étaient des classiques d'Internet (psy, mémoire photographique, trois langues, sixième sens, talent caché, « irremplaçable », « on est une famille », « Chéri, tu m'écoutes ? », « elle ou le foot », loto, jean qui grossit, mot de passe « incorrect », danser comme si personne regardait…), des constats sans twist, ou des doublons avec la page n°1 et les étalons. S'y ajoutaient des amorces saturées : « Ma copine… » revenait 10 fois en COUPLE.

Les 7 vannes gardées sont gardées mot pour mot. Leurs décryptages actuels n'ont pas été audités (hors mandat).

## 2. Mes 10 meilleures nouvelles vannes

1. **87** — À la méditation, on nous a dit de laisser passer nos pensées comme des nuages. / Les miennes se sont garées.
2. **38** — Je parle anglais couramment. / Tant que personne me répond.
3. **73** — En brainstorming : « Il n'y a pas de mauvaise idée. » / J'ai proposé la mienne. Il y en avait une.
4. **165** — Je suis redoutable dans les débats. / Seul, sous la douche, trois jours après.
5. **161** — Quand on s'est séparés, on a partagé les affaires équitablement. / J'ai eu le canapé. Elle a eu les amis.
6. **12** — Pour voir si j'écoute, ma copine glisse des phrases absurdes. / J'ai dit oui à un lama. Il arrive samedi.
7. **130** — Je travaille très bien sous pression. / Du coup, j'attends qu'il y en ait.
8. **189** — Pour ranger mon appart, je déplace le bazar d'une pièce à l'autre. / Je fais tourner les cultures.
9. **153** — Elle : « Tu penses à quoi ? » Moi : « À toi. » / On regardait un documentaire sur les requins.
10. **347** — Trois mois sans nouvelles. Hier, elle a liké ma story. / Pas un retour. Un contrôle technique.

Mentions : 4 (caractère spécial → mon oncle), 186 (« en toute bienveillance » = bip du camion qui recule), 50 (« salaire selon profil » → mon profil l'a mal pris), 263 (« Il n'y a plus personne autour de vous. » → je l'ai pris personnellement).

## 3. Points à signaler (à trancher par Thomas)

**Chiffres comiques retirés des vannes.** Ce sont des détails de blague, pas des statistiques, mais la charte §1 demande de te le signaler :
- 83 : « 90 % / 10 % »
- 263 : « 200 swipes, 3 matchs, 0 réponse »
- 293 : « 47, deux fois »
- 275 : « 3 ans »
- 276 : « 8 000 km »
- 101 : « 3 % »
- 139 : « 3 minutes » (les « trois heures » sont gardées)

La taille « 1m74 / 1m80 » du 269 est conservée. Les nouveaux détails chiffrés sont de la mise en scène, pas des données : 5 ans (2, 7), 2 ans (22), 4 secondes (340), 24 heures (267), 40 minutes (294), 3 mois (347), 3 trous (133), 3 logos (279), 6h (155), 3h (285, 289), 2 heures / 2 secondes (129).

**Réécritures plus longues que l'original.** Le brief demande « plus courte ou égale ». Je l'ai respecté sur 111 vannes. Les 8 exceptions viennent d'originaux très courts, où un vrai retournement ne tient pas en moins de mots :

| Id | Original | Nouvelle |
|---|---|---|
| 187 | 56 car. | ≈95 car. |
| 129 | 55 car. | ≈91 car. |
| 145 | 59 car. | ≈109 car. |
| 94 | 74 car. | ≈94 car. |
| 99 | 79 car. | ≈91 car. |
| 340 | 72 car. | ≈82 car. |
| 290 | 84 car. | ≈98 car. |
| 338 | 93 car. | ≈95 car. |

**Doublons avec l'autre lot (catégories hors périmètre)** : j'ai écarté mes réécritures des vannes suivantes. À noter pour l'autre agent, car ces vannes recoupaient mes originaux :
- 60 (GPS qui recalcule) ;
- 160 (« c'est intéressant ») ;
- 166 (meuble et vis en trop, proche de l'ancien 133) ;
- 336 (photo de groupe en profil, proche de mon premier jet du 268).

**Amorces.** « Ma copine m'a… », « Mon chef m'a… » et « J'ai essayé… » ne sont plus utilisées dans le lot. « Ma copine » n'ouvre plus aucune vanne (elle apparaît en milieu de phrase dans le 12). « Mon pote » ouvre 2 vannes (268, 293) et « Un pote » 2 autres (298, 300). « Elle : » ouvre 3 dialogues (153, 266, 280).

**Voix narratrice.** Comme avant, plusieurs vannes COUPLE/DATING ont une narratrice (6 « invitée », 56, 121, 137, 169, 342). C'est volontaire, pour éviter le couple « homme / sa copine » par défaut.

**JEUX_DE_MOTS.** Les 3 réécritures reposent sur un double sens de l'idée (« caractère spécial », « conseil d'amie », « garer en bataille »), jamais sur un son, pour respecter la charte §3.

**Marques citées.** LinkedIn (64), Instagram (280), Bluetooth (298) et un clin d'œil jeu télé « appeler un ami » (341). Aucun concurrent de Marrant, aucune mention d'IA.

**Intégration technique (@fullstack).** `joke-decryptages.json` est indexé par `content`. Pour chaque ligne du JSONL, il faut remplacer l'entrée de l'ancien `content` par le nouveau, sinon l'ancienne entrée reste orpheline et la nouvelle vanne n'a pas de décryptage. `id`, `category`, `type` et `maturityLevel` sont inchangés, donc les URL /vannes/<slug> sont préservées.

**Hors mandat.** L'historique des interventions de `project-context.md` n'a pas été mis à jour, parce que la consigne était de ne modifier aucun autre fichier.

## 4. Frameworks et références

- [Framework : PAS condensé en setup/chute, retournement d'idée façon étalons A/B]
- [Conscience : Product-Aware — le lecteur est sur le catalogue, il veut une vanne ressortable ce soir]
- Test appliqué à chaque vanne : « un pote la ressortirait-il ce soir ? »
