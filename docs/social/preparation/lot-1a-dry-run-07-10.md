# Lot 1a (12/10 au 18/10/2026) : dry-run du 07/10 après les textes tranchés à l'aveugle

> @fullstack, 07/10/2026, **4e version** (remplace la 3e, « bloqué par 3 légendes manquantes »). Code : légendes du 1a (`social-lot-v5-legendes.ts`), X du 12/10 en vanne simple (`CASES_VANNE`, `social-lot-v5-fixes.ts` et `social-lot-v5.ts`), 1b posé (21/10 V028, légende du 30/10). Sources : `aveugle-legendes-1a-resultat.md` (tours 1 et 2), `aveugle-remplacements-cycle8-resultat.md`, `aveugle-textes-neufs-cycle8-resultat.md`. **Rien n'a été inséré en base, rien n'a été déployé.** Lectures Neon en SELECT seulement, sorties dans `/tmp/fs-s15/`, hors dépôt.

## Commande

```bash
cd apps/web
npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict \
  --debut 2026-10-12 --fin 2026-10-18 \
  --out /tmp/fs-s15/1a-new.md --json /tmp/fs-s15/1a-new.json
```

Sortie : catalogue 127 vannes GARDER, pool 42, **stock éligible 22**, 2 articles, 14 posts récents ; **12 posts (X 5, Instagram 5, LinkedIn 2), 2 replis, 0 erreur**, JSON écrit.

## Ce qui change par rapport au dry-run précédent (preuve)

Référence : la même commande sur le code d'avant le X du 12/10, avec les 4 légendes déjà posées (`/tmp/fs-s15/1a-ref.json`, 0 erreur). Comparaison par `id` de tous les champs insérés :
- **11 posts sur 12 identiques** (mêmes `id`, vannes, dates, heures, cartes, notes, marqueurs) ;
- **le X du lun. 12/10 change** (`c5c405b96520291d808931a25`, même id, même heure) : la ligne de `se-presenter-avec-humour` et son lien sont retirés, à la place une vanne du pool strict sans renvoi ni lien ;
- **le repli X du 12/10 disparaît** (il n'y a plus de relais à replier) ; les replis Instagram et LinkedIn sont identiques ;
- avertissements : identiques.

Par rapport au dry-run du 07/10 au soir (3e version), les 4 légendes du 1a remplacent le texte factice ou l'ancienne légende :

| Post | Légende | Source |
|---|---|---|
| Repli IG lun. 12/10 (`cs14jke10b58d158ae638560`, chargeur) | « À envoyer à qui a ton chargeur depuis la fac. » | tour 1, G08 (9 / 9) |
| IG mar. 13/10 (V083 `cs14jka3336e7e90a453a9d6`) | « À envoyer à qui devait monter ton étagère avant l'été. » | tour 2, H03 (9 / 8,5) |
| IG jeu. 15/10 (`cs14jk9a9e7a1b8e0e16264e`) | « À envoyer à ton oncle, qui demande si c'est un vrai travail. » | tour 2, H01 (9 / 8,5) |
| IG ven. 16/10 (`cmmnsqn120000th63o435xsb0`) | « À envoyer à ta mère, qui t'avait dit de surveiller le four. » | tour 2, H11 (8,5 / 9) |

## X du lun. 12/10 : vanne du pool strict, sans renvoi

Aucune version avec renvoi n'a tenu à l'aveugle (X12a 7 / 7, X12b 7,5 / 7,5 ; V046, V050, V096 sous la barre). Décision `si_echec` : vanne du pool strict sans renvoi (repli du mix, v5 l.31). L'article reste relayé par IG2 (lien en bio) et LinkedIn L3 (13/10).

Mécanisme : l'entrée fixe `relais-x-12-10` est retirée, et la case figure dans `CASES_VANNE` (`social-lot-v5-fixes.ts`). Le script la tire avec `construireVanne`, donc avec les mêmes règles que tout tirage : pool strict, réservées (carrousel, Noël), sous 8, « pain », anti-répétition 90 jours avec la semaine 0, filtre X et R6. La tirer à sa date aurait pris la meilleure vanne libre et décalé toute la semaine (essai fait : 2 tirages Instagram changés, 2 légendes manquantes). Elle est donc tirée **après les posts du lot et avant les replis**, à la place du repli qu'aurait eu le relais. Elle ne prend aucune vanne aux autres posts, et le post garde son rang dans le lot.

Vanne tirée : **V011 `cmmnsqn130038th63fxn1wvhn`** (pool strict, 8,5 / 8,5), l'ancien repli X du 12/10 : « « Ma mère m'appelle chaque dimanche pour savoir si je mange bien. Je réponds oui. » / « Elle entend le papier alu. Elle insiste pas. » ». Contrôles : absente des 10 `sourceId` de la semaine 0, hors `RESERVEES_CARROUSEL`, `RESERVEES_NOEL`, `SOUS_HUIT`, `PAIN_IDS` ; sans lien, sans `[article:]` ni `[repli:]` ; `longueurX` 132 ; lun. 12:30 Paris = 10:30Z.

## Contrôles

| Contrôle | Résultat |
|---|---|
| 12 posts, X 5, IG 5, LinkedIn 2 ; aucun dimanche | OK (lun. 12 au ven. 16/10) |
| Heures UTC (CEST) | X 12:30 = 10:30Z, IG 19:30 = 17:30Z, LinkedIn 08:15 = 06:15Z ; heure B le 14/10 : X 09:00 = 07:00Z, IG 12:30 = 10:30Z |
| 10 `sourceId` de la semaine 0 | 0 (posts et replis) |
| `[repli:<id>]` sur les 2 relais (IG2, L3), `[repli-de:<id>]` en retour | 2 sur 2 |
| `longueurX` X ≤ 270 | 12/10 : 132 ; 13/10 : 93 ; 14/10 : 248 (332 bruts) ; 15/10 : 106 ; 16/10 : 139 |
| V028 et V060 | absentes du lot 1a |
| Légendes IG : « À envoyer à », ≤ 80 car., sans lien ni pied | 5 posts et 1 repli conformes, 0 manquante |
| `tsc -p tsconfig.build.json`, `npm run lint`, `npm run build`, `npx jest` | OK ; jest 3795 réussis, 2 ignorés |

## Les 12 posts

| Date (UTC) | Réseau | Type (origine) | Source | Extrait | Légende IG | Marqueurs |
|---|---|---|---|---|---|---|
| lun. 12/10 10:30 | X | VANNE (tirage, `CASES_VANNE`) | JOKE `cmmnsqn130038th63fxn1wvhn` (V011) | « Ma mère m'appelle chaque dimanche pour savoir si je mange bien. | | aucun |
| lun. 12/10 17:30 | Instagram | RELAIS (validé IG2) | JOKE `cs14jk8f28ff20e1cf82f3a8` | Au jeu de mimes, ma carte disait « la timidité ». | À envoyer à qui a un tour de table demain. Les 4 autres exemples : lien en bio. | `[article:se-presenter-avec-humour]` `[repli:c92df7ca8db3e3ef8cdd36470]` |
| mar. 13/10 06:15 | LinkedIn | RELAIS (validé L3) | BLOG `se-presenter-avec-humour` | Au tour de table, tu es le suivant, et celui d'avant vient d | | `[article:se-presenter-avec-humour]` `[repli:cb2cb272487d56bb82eff560f]` |
| mar. 13/10 10:30 | X | VANNE (validé X1) | JOKE `cmmnsqn130027th63at2ene9i` | « J'ai dit à Alexa de me raconter une blague. » | | `[heure:A]` |
| mar. 13/10 17:30 | Instagram | VANNE (tirage) | JOKE `cs14jka3336e7e90a453a9d6` (V083) | Mon copain a dit « je m'en occupe » pour la fuite sous l'évier. | À envoyer à qui devait monter ton étagère avant l'été. | `[heure:A]` |
| mer. 14/10 07:00 | X | VANNE_QUIZ (tirage) | JOKE `cmni62ad30005s60yc7qnog31` | « Ma copine a fait le tri de printemps. | | `[heure:B]` |
| mer. 14/10 10:30 | Instagram | DECRYPTAGE (validé IG3) | JOKE `cs14jk04b4bc8bbf8a2d8a05` | J'ai découvert que mes potes avaient un groupe sans moi. | À envoyer à celui qui n'est jamais sûr d'être invité. (inchangée) | `[heure:B]` |
| jeu. 15/10 06:15 | LinkedIn | VANNE (validé L1) | JOKE `cs14jka89abf28d3769b05fe` | « Il y a un canapé dans l'espace détente de mon bureau. | | `[variante:image]` |
| jeu. 15/10 10:30 | X | VANNE (tirage) | JOKE `cmnz0jqsx000rs60xrbrqm8kk` | « Mon copain : 'Choisis le resto, ça m'est égal.' » | | `[heure:A]` |
| jeu. 15/10 17:30 | Instagram | VANNE (tirage) | JOKE `cs14jk9a9e7a1b8e0e16264e` | Au jeu « deux vérités et un mensonge », j'ai dit trois vérités. | À envoyer à ton oncle, qui demande si c'est un vrai travail. | `[heure:A]` |
| ven. 16/10 10:30 | X | VANNE (tirage) | JOKE `cmmnsqn15006kth63res9rqp9` | « J'ai installé un jeu de 120 Go. | | aucun |
| ven. 16/10 17:30 | Instagram | VANNE (tirage) | JOKE `cmmnsqn120000th63o435xsb0` | Mon détecteur de fumée me sert de minuteur. | À envoyer à ta mère, qui t'avait dit de surveiller le four. | aucun |

Replis (2), envoyés seulement si l'article n'est pas en ligne : Instagram 12/10 17:30Z `cs14jke10b58d158ae638560` (« À envoyer à qui a ton chargeur depuis la fac. ») ; LinkedIn 13/10 06:15Z `cs14jk29357d022f6880a69e`.

## Avertissements du script (non bloquants, identiques à la référence)

- 13/10 LinkedIn L3 : amorce de plus de 140 caractères, texte validé par Thomas conservé.
- « copain / copine » 3 fois la semaine du 12/10 (IG 13/10, X 14/10, X 15/10), plafond 2 `[HYPOTHÈSE]` : avertissement seulement.
- IG2 12/10 (« … lien en bio ») et IG3 14/10 (« Le quiz est dans le lien de la bio. ») : ne partent tels quels que si les liens de bio sont posés la veille.
- Même tournure deux fois de suite sur Instagram : « qui » les 12/10 et 13/10, « ton/ta » les 15/10 et 16/10. Les 4 légendes ont été tranchées à l'aveugle, elles restent telles quelles.

## Lot 1b (19/10 au 15/11), posé en avance

- **IG mer. 21/10** : post fixe `IG-21-10`, carte vanne simple sur V028 (`cmmnsqn130033th63b54ux45o`, 2 cartes, pas de carrousel), légende R07 « À envoyer à qui a déjà décroché un « pas mal » et l'a gardé précieusement. ». V028 reste dans `RESERVEES_CARROUSEL` : jamais tirée ailleurs.
- **IG ven. 30/10** (`halloween-ig`) : légende R01 « À envoyer à celui qui planifie le costume avant le deuxième rendez-vous. ».
- IG3 (14/10) et IG1 (27/10) : légendes inchangées.

Dry-run 1b (`--debut 2026-10-19 --fin 2026-11-15`, `/tmp/fs-s15/1b-new.*`) : 33 posts (X 14, IG 14, LinkedIn 5), **22 erreurs**, toutes des textes ou des vannes en attente (rien n'est inventé) :
- 17 erreurs de stock (pool strict épuisé, régime du 03/11 : conseils à fournir) : 13 « aucune vanne du catalogue ne passe les contrôles » (05/11 LinkedIn ; 06, 09, 10, 12, 13/11 sur X et Instagram ; 10 et 12/11 LinkedIn) et 4 « aucune ligne ni vanne pour le relais » (`chambrer-sans-blesser-entre-potes` X et IG 09/11, `voeux-drole-nouvelle-annee` X et IG 12/11) ;
- 3 relais Instagram sans légende « À envoyer à... » pour leur vanne (19/10, 29/10, 05/11) ;
- 2 légendes manquantes : `cs14jk76ca7ad32cce9041ce` (03/11), `cs14jk55b4243d4d1c132b97` (04/11).

Sur HEAD (avant ce lot de changements), le même dry-run donnait 24 erreurs (dont 21/10 IG sans légende et 05/11 IG sans vanne). Le 21/10 ne tire plus de vanne, donc les tirages Instagram du 28/10 au 05/11 glissent. Le 1b sera de toute façon régénéré après l'insertion du 1a (14/10).

## Verdict : 1a PRÊT pour l'insertion du ven. 09/10, 10:15 UTC

0 erreur, 12 posts, légendes complètes, X du 12/10 conforme à la décision `si_echec`. Le 09/10 : dry-run sans `--out` ni `--json` (réécrit `lot-relance-s15.{md,json}`), relecture, puis la même commande avec `--insert --driver=neon-http` (Thomas). Le `--rollback` se borne à `--debut`/`--fin`.
