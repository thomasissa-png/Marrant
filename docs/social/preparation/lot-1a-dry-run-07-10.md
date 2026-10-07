# Lot 1a (12/10 au 18/10/2026) : dry-run refait le 07/10 (soir), état du code après le cycle 8

> @fullstack, 07/10/2026, **3e version** (remplace les 2 passes du matin). Mis à jour par `fa67cfe` (relais X 12/10 = ligne de `se-presenter-avec-humour`, V053 retirée ; correctifs du matin commités dans `adc2048`) puis par les corrections du cycle 8 (`corrections-cycle8-fullstack.md`). **Rien n'a été inséré en base, rien n'a été déployé.** Lectures Neon en SELECT seulement. Sorties dans `/tmp/fs-c8/`, hors dépôt.

## Commande

```bash
cd apps/web
npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict \
  --debut 2026-10-12 --fin 2026-10-18 \
  --out /tmp/fs-c8/1a-new.md --json /tmp/fs-c8/1a-new.json
```

Graine `relance-s15` : le même plan est reproduit tant que la base ne change pas. Sans `--out` ni `--json`, le script réécrit `lot-relance-s15.{md,json}` (versionné) : à ne faire que le 09/10.

Sortie console : catalogue 127 vannes GARDER, pool 42 identifiants, **stock éligible 22**, 2 articles, 14 posts récents ; **12 posts (X 5, Instagram 5, LinkedIn 2), 3 replis**. **3 erreurs bloquantes** (légendes Instagram manquantes, voir Verdict) : le JSON n'est pas écrit.

## Les 12 posts sont ceux du dry-run d'avant le cycle 8 (preuve)

Référence : la même commande lancée sur le code commité `4e84336` (worktree détaché, `/tmp/fs-c8/1a-head.json`, 0 erreur). Comparaison ligne par ligne des 17 champs insérés (`id`, `content`, `threadParts`, `imageUrls`, `directorNote`, `scheduledAt`…), 12 posts et 3 replis :
- **mêmes 15 `id`, mêmes vannes, mêmes dates et heures, mêmes cartes, mêmes notes et marqueurs** : 0 ligne différente hors légende Instagram ;
- **5 légendes Instagram changent, et elles seules** (correction imposée par le [CHOIX UTILISATEUR] du 06/10, `founder-preferences.md` l.67 : légendes sans « deviens-marrant.fr ») :

| Post | Légende avant | Légende maintenant |
|---|---|---|
| IG mar. 13/10 (V083) | « deviens-marrant.fr » | « À envoyer à celui qui répare tout, bientôt. » (`corrections-cycle7-copy.md` §2) |
| IG3 mer. 14/10 (validé Thomas) | « À envoyer à celui qui n'est jamais sûr d'être invité. deviens-marrant.fr » | même phrase, sans le pied (`corrections-cycle7-copy.md` l.70) |
| IG jeu. 15/10 `cs14jk9a9e7a1b8e0e16264e` | « deviens-marrant.fr » | **à fournir par @copywriter** |
| IG ven. 16/10 `cmmnsqn120000th63o435xsb0` | « deviens-marrant.fr » | **à fournir par @copywriter** |
| Repli IG 12/10 `cs14jke10b58d158ae638560` | « deviens-marrant.fr » | **à fournir par @copywriter** |

Comparaison faite avec une légende factice « À envoyer à TEST. » pour les 3 vannes sans texte, uniquement pour lever l'erreur et comparer le reste (script hors dépôt `/tmp/fs-c8/compare.ts`).

## Contrôles

| Contrôle | Résultat |
|---|---|
| 12 posts, X 5, IG 5, LinkedIn 2 ; aucun dimanche | OK (lun. 12 au ven. 16/10) |
| Heures UTC (CEST) | X 12:30 = 10:30Z, IG 19:30 = 17:30Z, LinkedIn 08:15 = 06:15Z ; heure B : X 09:00 = 07:00Z, IG 12:30 = 10:30Z (14/10) |
| 10 `sourceId` de la semaine 0 | 0 (posts et replis) |
| `[repli:<id>]` sur les 3 relais, `[repli-de:<id>]` en retour | 3 sur 3 |
| `longueurX` X ≤ 270 | 12/10 : 224 (327 bruts) ; 13/10 : 93 ; 14/10 : 248 (332 bruts) ; 15/10 : 106 ; 16/10 : 139 ; repli 12/10 : 132 |
| V028 et V060 (réservées aux carrousels) | absentes du lot ; stock 24 → 22 |
| V083 | tirée en IG le 13/10, gardée (voir plus bas) |
| Légendes IG : « À envoyer à », ≤ 80 car., sans lien ni pied | 3 conformes (IG2, V083, IG3), **3 manquantes (erreur : 2 posts, 1 repli)** |

## Les 12 posts

| Date (UTC) | Réseau | Type (origine) | Source | Extrait | Marqueurs |
|---|---|---|---|---|---|
| lun. 12/10 10:30 | X | RELAIS (V5 relais-x-12-10) | BLOG `se-presenter-avec-humour#letourdetable…` | Le tour de table commence à gauche et tu comptes les places | `[article:se-presenter-avec-humour]` `[repli:c82e06a7777c62ab260b12f1b]` |
| lun. 12/10 17:30 | Instagram | RELAIS (validé IG2) | JOKE `cs14jk8f28ff20e1cf82f3a8` | Au jeu de mimes, ma carte disait « la timidité ». | `[article:se-presenter-avec-humour]` `[repli:c92df7ca8db3e3ef8cdd36470]` |
| mar. 13/10 06:15 | LinkedIn | RELAIS (validé L3) | BLOG `se-presenter-avec-humour` | Au tour de table, tu es le suivant, et celui d'avant vient d | `[article:se-presenter-avec-humour]` `[repli:cb2cb272487d56bb82eff560f]` |
| mar. 13/10 10:30 | X | VANNE (validé X1) | JOKE `cmmnsqn130027th63at2ene9i` | « J'ai dit à Alexa de me raconter une blague. » | `[heure:A]` |
| mar. 13/10 17:30 | Instagram | VANNE (tirage) | JOKE `cs14jka3336e7e90a453a9d6` (V083) | Mon copain a dit « je m'en occupe » pour la fuite sous l'évi | `[heure:A]` |
| mer. 14/10 07:00 | X | VANNE_QUIZ (tirage) | JOKE `cmni62ad30005s60yc7qnog31` | « Ma copine a fait le tri de printemps. Elle a gardé mon vél | `[heure:B]` |
| mer. 14/10 10:30 | Instagram | DECRYPTAGE (validé IG3) | JOKE `cs14jk04b4bc8bbf8a2d8a05` | J'ai découvert que mes potes avaient un groupe sans moi. | `[heure:B]` |
| jeu. 15/10 06:15 | LinkedIn | VANNE (validé L1) | JOKE `cs14jka89abf28d3769b05fe` | « Il y a un canapé dans l'espace détente de mon bureau. | `[variante:image]` (`c55c58e5410ff05de08c28332`) |
| jeu. 15/10 10:30 | X | VANNE (tirage) | JOKE `cmnz0jqsx000rs60xrbrqm8kk` | « Mon copain : 'Choisis le resto, ça m'est égal.' » | `[heure:A]` |
| jeu. 15/10 17:30 | Instagram | VANNE (tirage) | JOKE `cs14jk9a9e7a1b8e0e16264e` | Au jeu « deux vérités et un mensonge », j'ai dit trois vérit | `[heure:A]` |
| ven. 16/10 10:30 | X | VANNE (tirage) | JOKE `cmmnsqn15006kth63res9rqp9` | « J'ai installé un jeu de 120 Go. J'y ai joué 20 minutes. | aucun |
| ven. 16/10 17:30 | Instagram | VANNE (tirage) | JOKE `cmmnsqn120000th63o435xsb0` | Mon détecteur de fumée me sert de minuteur. | aucun |

Replis (3), envoyés seulement si l'article n'est pas en ligne : X 12/10 10:30Z `cmmnsqn130038th63fxn1wvhn` ; Instagram 12/10 17:30Z `cs14jke10b58d158ae638560` ; LinkedIn 13/10 06:15Z `cs14jk29357d022f6880a69e`.

## Avertissements du script (non bloquants)

- 13/10 LinkedIn L3 : amorce de plus de 140 caractères, texte validé par Thomas conservé.
- **« copain / copine » 3 fois la semaine du 12/10** (IG 13/10, X 14/10, X 15/10), plafond 2 `[HYPOTHÈSE]` : avertissement seulement, **aucun remplacement** (consigne : 1a inchangé).
- IG2 12/10 (« … lien en bio ») et IG3 14/10 (« Le quiz est dans le lien de la bio. ») : ne partent tels quels que si les liens de bio sont posés la veille (contrôle manuel, `mesure.md` §3).
- 13/10 et 14/10 Instagram : même tournure « celui qui » deux fois de suite.

## V083 et le carrousel du 23/12

V083 reste tirée en IG le mar. 13/10 (lot 1a inchangé). Elle n'est **pas** dans les vannes réservées (`RESERVEES_CARROUSEL`, `social-lot-v5-fixes.ts`). Le carrousel du mer. 23/12 prendra une autre vanne du pool avec une fiche neuve, livrée avec le lot 2b ; l'anti-répétition de 90 jours empêche de toute façon V083 de revenir avant le 11/01.

## Stock éligible 22 (expliqué)

Décompte au 12/10 par le script de contrôle `/tmp/fs-c8/stock.ts` (SELECT seulement) : pool strict 42 = 22 libres + 3 exemptées (IG3, IG1, X3, posts fixes) + 4 réservées à Noël (posts fixes) + **11** vannes en base depuis moins de 90 jours + 2 réservées aux carrousels (V028, V060). Les 11 = les 10 de la semaine 0 + **`cs14jk72ac436450535a3c29`, publiée sur X le 02/10** (`preparation-mensuelle`, PUBLISHED 10:32Z), que le calcul « 23 » du plan ne comptait pas. Ce matin (pool 40, V028 et V060 non exclues) : 40 − 3 − 4 − 11 = 22, contre 23 au plan. Ce soir : 42 − 3 − 4 − 11 − 2 = 22.

## Verdict : PRÊT pour le 09/10 sur tout le reste, BLOQUÉ par 3 légendes manquantes

V053 est retirée (`fa67cfe`), le relais X du 12/10 est la ligne de l'article (224 `longueurX`), 0 erreur hors légendes. Il manque :
1. **@copywriter, avant le 09/10 10:15 UTC** : 3 légendes « À envoyer à... » (≤ 80 caractères, sans pied ni lien) pour `cs14jk9a9e7a1b8e0e16264e` (deux vérités et un mensonge), `cmmnsqn120000th63o435xsb0` (détecteur de fumée) et `cs14jke10b58d158ae638560` (chargeur, repli IG du 12/10), à ajouter dans `apps/web/scripts/content/social-lot-v5-legendes.ts`. Sans elles, le dry-run refuse d'écrire le JSON et `--insert` est impossible.
2. Le 09/10 : dry-run sans `--out` ni `--json`, relecture, puis la même commande avec `--insert --driver=neon-http`.
3. Un `--rollback` éventuel se borne désormais à `--debut`/`--fin` : annuler 1b ne touche plus 1a.
