# Lot 1a (12/10 au 18/10/2026) : dry-run du 07/10, après insertion de la semaine 0

> @fullstack, 07/10/2026, **mis à jour après 2 correctifs du script (2e passe, même jour)**. Recette du plan `plan-execution-s15.md` §5 et §7 (l.128). **Rien n'a été inséré en base et rien n'a été déployé.** Lectures Neon en SELECT seulement (API SQL HTTPS : le dry-run n'utilise pas `--driver`, réservé à `--insert` et `--rollback`).

## Commande

```bash
cd apps/web
npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict \
  --debut 2026-10-12 --fin 2026-10-18 \
  --out <scratchpad>/lot-1a.md --json <scratchpad>/lot-1a.json
```

Exécutée 2 fois : 1re passe (code d'origine), puis 2e passe après les correctifs (sorties `lot-1a-v2.{md,json}`). Les chiffres ci-dessous sont ceux de la 2e passe. `--out` et `--json` pointent hors du dépôt : sans eux, le script aurait écrasé `lot-relance-s15.{md,json}`, le dry-run obsolète de 140 posts, qui est versionné. Code de sortie : 0. Graine `relance-s15`, donc le même plan est reproduit tant que la base ne change pas.

Sortie console :
- Catalogue : 125 vannes GARDER, pool 40 identifiants (**stock éligible 22**), 2 articles, 14 posts récents.
- Lot : **12 posts (X 5, Instagram 5, LinkedIn 2)**, **3 replis en réserve** (2 à la 1re passe : IG2 n'en avait pas).
- Test LinkedIn texte / image : 1 éligible, image 1, texte 0, 0 paire.
- Test d'heure A/B : X A 2, B 1, hors test 2 ; Instagram A 2, B 1, hors test 2 ; LinkedIn hors test 2.

## Contrôles

| Contrôle | Résultat | Preuve |
|---|---|---|
| Erreurs bloquantes | **0** | sortie du script ; JSON écrit (il n'est écrit que s'il n'y a aucune erreur) |
| 12 posts, X 5, IG 5, LinkedIn 2 | **OK** | `parReseau` du JSON |
| Aucun dimanche | **OK** | posts du lun. 12 au ven. 16/10 ; rien le 17 ni le 18/10 |
| Heures de Paris vers UTC (CEST, UTC+2) | **OK** | X 12:30 = 10:30Z, IG 19:30 = 17:30Z, LinkedIn 08:15 = 06:15Z ; heure B : X 09:00 = 07:00Z (14/10), IG 12:30 = 10:30Z (14/10) |
| 10 `sourceId` de `lot-semaine0.json` dans le lot | **0** (posts et replis, 1re et 2e passes) | recherche dans le JSON du lot ; les 10 en base (approvedBy `lot-semaine0` : 3 PUBLISHED, 7 APPROVED) sont identiques aux 10 du fichier |
| Posts déjà en base à partir du 12/10 | 0 | SELECT `SocialPost` (hors REJECTED et FAILED) |
| `[variante:image\|texte]` LinkedIn dès le 13/10 | **OK** | 15/10 L1 `[variante:image]` ; 13/10 L3 hors test (relais avec lien), comme prévu par le script |
| `[heure:A\|B]` | **OK** | du mardi au jeudi sur X et IG ; lundi, vendredi et LinkedIn hors test |
| `[repli:<id>]` sur les relais | **OK sur les 3 relais** (X 12/10, IG2 12/10, LinkedIn 13/10) | 2e passe : IG2 porte `[article:se-presenter-avec-humour] [repli:c92df7ca8db3e3ef8cdd36470]` (correctif 1) |
| `longueurX` X ≤ 270 | **OK** | 12/10 : 191 (294 bruts) ; 13/10 : 93 ; 14/10 : 248 (332 bruts) ; 15/10 : 106 ; 16/10 : 139 ; repli 12/10 : 132 |
| IG mer. 14/10 = carrousel décryptage IG3 | **OK, fiche présente** | `DECRYPTAGE (VALIDE IG3)`, **5 `threadParts` exactement**, 4 slides `/api/social/image` (parties 4 et 5 sur la carte 4) ; heure B (12:30 Paris) |
| Vannes tirées dans le pool strict | **OK** pour les 6 tirages et les 3 replis | identifiants présents dans `src/config/social-pool.ts` ; X1, IG2, IG3 et L1 = posts validés par Thomas (exemptés) |
| Vanne du relais X 12/10 au niveau | **NON** | `cs14jkd6b11e811ffbf7f301` (V053, « alternant2 ») : hors pool strict, notes à l'aveugle **9 et 8** (`aveugle-stock-relecteur-1.md` l.60, `-2.md` l.59), sous la barre D1 (au moins 8,5 chez les 2) |

## Les 12 posts

Heures en UTC, telles qu'elles seraient insérées (`scheduledAt`). Extrait = accroche ou début du texte, 60 caractères.

| Date (UTC) | Réseau | Type (origine) | Source | Extrait | Marqueurs |
|---|---|---|---|---|---|
| lun. 12/10 10:30 | X | RELAIS (V5 relais-x-12-10) | JOKE `cs14jkd6b11e811ffbf7f301` | « Mon adresse mail pro d'alternant commence par “alternant2” | `[article:se-presenter-avec-humour]` `[repli:c82e06a7777c62ab260b12f1b]` |
| lun. 12/10 17:30 | Instagram | RELAIS (validé IG2) | JOKE `cs14jk8f28ff20e1cf82f3a8` | Au jeu de mimes, ma carte disait « la timidité ». | `[article:se-presenter-avec-humour]` `[repli:c92df7ca8db3e3ef8cdd36470]` |
| mar. 13/10 06:15 | LinkedIn | RELAIS (validé L3) | BLOG `se-presenter-avec-humour` | Au tour de table, tu es le suivant, et celui d'avant vient d | `[article:se-presenter-avec-humour]` `[repli:cb2cb272487d56bb82eff560f]` |
| mar. 13/10 10:30 | X | VANNE (validé X1) | JOKE `cmmnsqn130027th63at2ene9i` | « J'ai dit à Alexa de me raconter une blague. » | `[heure:A]` |
| mar. 13/10 17:30 | Instagram | VANNE (tirage) | JOKE `cs14jka3336e7e90a453a9d6` | Mon copain a dit « je m'en occupe » pour la fuite sous l'évi | `[heure:A]` |
| mer. 14/10 07:00 | X | VANNE_QUIZ (tirage) | JOKE `cmni62ad30005s60yc7qnog31` | « Ma copine a fait le tri de printemps. Elle a gardé mon vél | `[heure:B]` |
| mer. 14/10 10:30 | Instagram | DECRYPTAGE (validé IG3) | JOKE `cs14jk04b4bc8bbf8a2d8a05` | J'ai découvert que mes potes avaient un groupe sans moi. J'a | `[heure:B]` |
| jeu. 15/10 06:15 | LinkedIn | VANNE (validé L1) | JOKE `cs14jka89abf28d3769b05fe` | Il y a un canapé dans l'espace détente de mon bureau. Person | `[variante:image]` |
| jeu. 15/10 10:30 | X | VANNE (tirage) | JOKE `cmnz0jqsx000rs60xrbrqm8kk` | « Mon copain : 'Choisis le resto, ça m'est égal.' » | `[heure:A]` |
| jeu. 15/10 17:30 | Instagram | VANNE (tirage) | JOKE `cs14jk9a9e7a1b8e0e16264e` | Au jeu « deux vérités et un mensonge », j'ai dit trois vérit | `[heure:A]` |
| ven. 16/10 10:30 | X | VANNE (tirage) | JOKE `cmmnsqn15006kth63res9rqp9` | « J'ai installé un jeu de 120 Go. J'y ai joué 20 minutes. C' | aucun |
| ven. 16/10 17:30 | Instagram | VANNE (tirage) | JOKE `cmmnsqn120000th63o435xsb0` | Mon détecteur de fumée me sert de minuteur. La dernière fois | aucun |

Replis en réserve (3, 2e passe), envoyés seulement si l'article n'est pas publié à l'heure, tous marqués `[repli-de:<id du relais>]` : X 12/10 10:30Z `cmmnsqn130038th63fxn1wvhn` (« Ma mère m'appelle chaque dimanche… », inchangé) ; **Instagram 12/10 17:30Z `cs14jke10b58d158ae638560`** (« Mon copain m'a rendu le chargeur… », 2 cartes ; c'était le repli LinkedIn de la 1re passe) ; **LinkedIn 13/10 06:15Z `cs14jk29357d022f6880a69e`** (« Pendant que j'étais aux toilettes, mon date a remonté tout… », nouveau tirage). Les 12 posts sont identiques à la 1re passe ligne pour ligne, sauf la note d'IG2 (marqueurs).

## Erreurs et avertissements

- **Erreurs bloquantes du script : 0.**
- **Avertissement du script (1)** : 13/10 LinkedIn L3, amorce de plus de 140 caractères (coupée par « voir plus » sur mobile). Le texte validé par Thomas est conservé.
- **Écart relevé par le contrôle manuel (bloquant au sens de D1)** : le relais X du 12/10 porte V053 (9 et 8 à l'aveugle), sous la barre. Le script ne le voit pas : ce post est figé dans `scripts/content/social-lot-v5-fixes.ts` (l.53, origine « V5 », pas un post validé par Thomas), et le pool strict ne s'applique qu'aux tirages. Ce n'est pas un bug de code mais un choix de contenu : code non modifié.
- **Stock éligible 22 au J0** contre 23 au plan (§2, tranche 1a : 30 moins 7). Écart de 1 non expliqué `[À RECOMPTER @copywriter]`.
- Test LinkedIn texte / image : une seule variante (image) cette semaine, aucune paire. C'est attendu (L3 est un relais avec lien) mais à noter pour la lecture du test.

## Points d'attention pour l'insertion

1. **Piège du chemin JSON : verrouillé (correctif 2)**. `--insert` régénère maintenant le lot de la même commande (mêmes `--debut`, `--fin`, `--pool`, `--seed`) et refuse l'insertion si le JSON lu n'est pas ce dry-run ligne pour ligne (bornes, graine, total, posts, replis). L'ancien `lot-relance-s15.json` de 140 posts est donc refusé avec `--debut 2026-10-12 --fin 2026-10-18`. Le 09/10 : lancer la commande sans `--out` ni `--json` (le fichier par défaut est réécrit avec les 12 posts), relire, puis relancer la même commande avec `--insert --driver=neon-http`. Si la base a changé entre-temps (un post de la semaine 0 passé en FAILED, par exemple), le tirage peut différer : l'insertion est alors refusée et il faut refaire le dry-run.
2. L'approvedBy du lot est « thomas-s15 », règle du script pour l'identifiant `relance-s15`. Un `--rollback --lot relance-s15` viserait tous les posts « thomas-s15 », y compris ceux de 1b, 2a et 2b s'ils sont insérés sous le même identifiant.
3. Article `se-presenter-avec-humour` : en base, `isPublished = false` et `publishedAt` = 12/10 03:00 Paris. La garde des relais (X 12/10, LinkedIn 13/10) bascule sur le repli s'il n'est pas publié. Vérification manuelle à faire (§6) : l'article répond 200 une heure avant chaque relais.
4. ~~IG2 hors garde~~ **Corrigé (correctif 1)** : IG2 porte `[article:]` et un repli Instagram. Si l'article n'est pas visible à 19:30, la garde du Worker le passe en REJECTED et envoie le repli.
5. `--insert --driver=neon-http` (une seule instruction INSERT multi-lignes) doit être prouvé `[LIVE]` sur la branche Neon avant le 09/10 (§0 et §7 du plan). Ce n'est pas l'objet de ce dry-run.

## Correctifs du script (2e passe, non commités, aucun déploiement nécessaire)

1. **Relais Instagram sous la garde** : `Fixe.article` (slug relayé) ajouté dans `social-lot-v5-fixes.ts` pour IG2 (12/10, `se-presenter-avec-humour`) et `relais-ig-26-10` (`blagues-sur-l-ia-assistants-vocaux`), repris par `construireFixe` (`social-lot-v5.ts`). Nouveau contrôle bloquant : un relais Instagram sans article est une erreur. Les relais IG générés portaient déjà le marqueur. **Worker inchangé** : `articleSlugDuPost` (`src/lib/social/garde-article.ts`) lit `[article:<slug>]` dans `directorNote` pour tous les réseaux depuis `ff3ac23`, et la route `publish-social` n'a aucun filtre de réseau (l.269). Ces deux fichiers n'ont pas changé depuis `fcafdff`, ancêtre du déploiement en ligne `59948a54`.
2. **`--insert` verrouillé sur le dry-run de la même commande** : `ecartsFichierLot` (`social-lot-v5-insert.ts`) et la régénération dans `mainLot` (`prepare-social-month.ts`, fonction `genererLot` partagée avec le dry-run).
3. Tests : `src/__tests__/scripts/social-lot-insert-garde.test.ts` (5 tests). tsc (`tsconfig.build.json`) OK ; lint : 0 erreur ; Jest complet : **3 261 PASS** (3 256 de référence plus 5), 2 tests ignorés comme avant.
4. Non-régression sur le lot long (12/10 au 03/01, dry-run dans le scratchpad) : 123 erreurs avant comme après (pool strict épuisé dès le 03/11 : le mix de formats n'est pas codé ; X3 du 21/10 à 283 caractères). Ces erreurs existaient avant le correctif et ne concernent pas le lot 1a. Les seuls ajouts sont 2 avertissements « aucun repli libre » pour les relais IG du 12/10 et du 26/10 sur cette période longue.

## Verdict : PAS PRÊT pour l'insertion du 09/10, sur un seul point (V053)

Tout le reste passe (0 erreur, 12 posts 5/5/2, aucun dimanche, heures UTC exactes, 0 vanne de la semaine 0, marqueurs présents dont `[article:]` et `[repli:]` sur les 3 relais, `longueurX` ≤ 270, IG3 complet avec 5 `threadParts`, `--insert` verrouillé). Ce qu'il manque :
- **Relais X du lun. 12/10** : remplacer V053 dans `social-lot-v5-fixes.ts` (`relais-x-12-10`, `jokeId`) par une **ligne de l'article `se-presenter-avec-humour` notée au niveau (≥ 8,5 chez les 2 relecteurs)** ou, à défaut, par une vanne du pool strict sans renvoi (repli du mix). Il faut la note de @copywriter. Ensuite, nouveau dry-run et contrôle Grep des 10 `sourceId` de la semaine 0.
- Le 09/10 : dry-run puis `--insert` avec la même commande (point 1). Le script refuse désormais tout autre JSON.
