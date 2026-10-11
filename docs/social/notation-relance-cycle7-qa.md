# Notation de la relance, cycle 7 : K7 Fiabilité de la chaîne (@qa, 05/10/2026, 20:30 UTC)

> Objet : chaîne base → `publish-social` → Buffer du lot `semaine0` (10 posts, 06 au 09/10) et chemin LinkedIn `[variante:image]` (dès le 13/10), sur le code actuel. Aucun fichier de code modifié.
> `[LIVE]` = lecture réelle (SELECT Neon, API Buffer en lecture, `wrangler deployments list`, `curl`). `[LIVE local]` = vrai code exécuté sur les vraies lignes de la base, seul l'appel réseau à Buffer intercepté (mutation capturée, rien envoyé). `[STATIQUE]` = lecture du code. `[DÉCLARÉ]` = preuve rapportée par la session, non revérifiable.
> En ligne `[LIVE]` : Worker `c5c0529b` à 100 % depuis 20:28 UTC (N-1 `16638a00`) ; HEAD = `d3bdc84`.

## Note K7 : 8/10 (aucun échec certain sur les 10 posts ; 3 des 5 conditions restent sans preuve)
Le défaut certain du cycle 6 (X du 07/10 en FAILED) est corrigé, déployé et vérifié. La classe de défaut qui l'a laissé passer n'est toujours pas fermée : la route reste testée avec `buffer-client` simulé. Le chemin LinkedIn image est juste sur le papier et en local, jamais exécuté dans le Worker.

## Les 5 conditions du cycle 6
| # | Condition | État | Preuve |
|---|---|---|---|
| 1 | R1 corrigé, déployé, test non simulé, brouillon X réel | **Fait** | `buffer-client.ts:174` compte X avec `longueurX` `[STATIQUE]` ; `buffer-longueur-x.test.ts` appelle le vrai client sur le texte du lot `[LIVE local]` ; déployé dans `c32b0f0b` puis `c5c0529b` `[LIVE]` ; brouillon X du texte exact accepté puis supprimé `[DÉCLARÉ]` ; ma trace : 328 bruts, 244 comptés par X, mutation produite `[LIVE local]` |
| 2 | Test route + vrai `buffer-client` par réseau | **Pas fait** | `publish-social-failures.test.ts:65` et `publish-social-linkedin-image.test.ts:40` simulent toujours `@/lib/social/buffer-client` ; aucun test ne relie la route à la mutation réelle |
| 3 | Alerte 429 (1 par jour et par réseau) | **Fait, en code** | `route.ts:412-425`, clé `social-429-<réseau>`, e-mail en échec sans effet sur le passage ; 3 tests (l.211-237) `[STATIQUE + Jest]`. Jamais déclenché en vrai (aucun 429 depuis) |
| 4 | Script HTTP, `--insert` et `--rollback` prouvés sur branche Neon | **À moitié** | Code (`INSERT` et `UPDATE` uniques en `neon-http`) + `social-lot-v5-insert-http.test.ts` `[STATIQUE + Jest]`. **Aucun passage sur branche Neon** (REPLIT_ACTIONS : « reste à prouver »). Butoir : lot 1a du 09/10 |
| 5 | H+45 des 06 et 07/10 consignés | **Pas encore possible** | Nous sommes le 05/10 ; à faire 06/10 09:00, 13:15, 20:15 et 07/10 13:15 Paris |

## Tests Jest `[LIVE local]`
`npx jest src/__tests__/lib/social src/__tests__/api src/__tests__/scripts` : **41 suites, 592 tests PASS** (6,0 s, code 0). Bruit sans effet : un `console.warn` IndexNow attendu (`weekly-seo`), un worker forcé à quitter (fuite de minuterie, à isoler avec `--detectOpenHandles`).

## Trace d'un post par réseau (code actuel)
| Étape | LinkedIn `c59404f4…` 06/10 | X `c2acdc88…` 07/10 (quiz) | Instagram `cade959f…` 06/10 |
|---|---|---|---|
| Base `[LIVE]` | APPROVED, `lot-semaine0`, cta null, 123 car., 0 `threadParts`, pas de `[variante:…]` | APPROVED, 328 bruts | APPROVED, 2 `imageUrls`, 2 `threadParts`, 0 hashtag |
| Interrupteur, canal `[LIVE]` | `paused=false` (19:44:45 UTC) ; canal connecté, file non en pause, 0 programmé | idem (19:44:47) | idem (19:44:49) |
| Sélection `[STATIQUE]` | `approvedBy` non nul : pas de rétrogradation ; aucun lien `/blog/` ni `[article:]` | idem | idem |
| Branche route | `estVarianteImage` = faux → `createBufferPost`, sans 1er commentaire | `longueurX` 244 ≤ 270 → `createBufferPost` | `createBufferImagePost`, URL de la base |
| Mutation `[LIVE local]` | `CreatePost`, texte complet 2 lignes, canal `…2223`, `dueAt` 06:15Z | `CreatePost`, 244 ≤ 280 : **plus de `BufferContentTooLongError`** | `CreateImagePost`, 2 assets, alt amorce + chute sur chacun, `instagram: { type: post }` |
| Issue attendue | PUBLISHED puis relecture horaire | PUBLISHED (lien réel à vérifier à H+45) | PUBLISHED si Buffer récupère les 2 PNG |
Cartes Instagram `[LIVE]` : slide 0 = 200 `image/png` 66 Ko en 2,5 s ; slide 1 = 200, 54 Ko, 2,0 s. Les 6 autres posts (X 06, 08, 09 ; Instagram 07, 08, 09 ; LinkedIn 08) suivent les mêmes branches ; tous les X sans lien font moins de 170 car.

## Chemin LinkedIn `[variante:image]` et son repli
Aucun post `[variante:image]` en base `[LIVE]` (rien après le 09/10 : `relance-s15` pas encore régénéré). Trace sur les 2 LinkedIn du lot, marqueur ajouté en mémoire `[LIVE local]` :
- **Marqueur sans `threadParts`** (cas des posts actuels) : non éligible → `createBufferPost` texte complet ; note `[variante:texte] … Repli texte seul (prévu avec carte) : post non éligible…`. Créneau conservé.
- **Marqueur + `threadParts` bruts** (forme du script, `social-lot-v5.ts:339`) : éligible (amorces 72 et 124 car. ≤ 140) ; carte rendue **PNG 1080×1350** (46 et 39 Ko, rendu Node) ; `CreateImagePost` : texte = amorce seule entre « », 1 asset `slide=0`, alt « amorce » « chute », sans métadonnée Instagram. Conforme à la spec.
- **Rendu en échec** : couvert par 2 tests (`linkedin-image.test.ts:116, 128`) → texte seul, PUBLISHED, bras noté texte.

Défauts et angles morts (aucun ne touche `semaine0`) :
| # | Constat | Effet | Gravité |
|---|---|---|---|
| L1 | Rendu **dans le Worker** jamais exécuté en prod (Node seul en local) | s'il échoue en Worker (WASM, CPU), **tous** les bras image partent en texte, sans e-mail : le test A/B est faussé en silence | haute pour la mesure |
| L2 | Aucune alerte sur repli : la cause est seulement dans `directorNote` | L1 invisible jusqu'au relevé | moyenne |
| L3 | Échec permanent : `buildPublishErrorNote(errMsg)` (`route.ts:455`) écrase `[variante:…]` | post sorti du compteur par bras | faible |
| L4 | `threadParts` saisis avec « » (édition à la main) : alt « “…” » doublé | lecteur d'écran gêné | faible (le script stocke des lignes brutes) |
| L5 | Bras image : `firstComment` non transmis (`route.ts:341`) | sans effet tant que le bras exclut les liens (cta null) | faible |

## Pour 10/10 (liste exacte)
1. **Test d'intégration route + vrai `buffer-client`** (seuls `fetch`, Prisma et l'e-mail simulés), 1 cas par réseau sur les textes réels de `lot-semaine0.json` + 1 cas LinkedIn `[variante:image]` : assertion sur la mutation (texte, nombre d'assets, alt, `instagram: type post`). Condition 2 du cycle 6, toujours ouverte.
2. **Script HTTP sur branche Neon** `[LIVE]` : `--insert --driver=neon-http` puis `--rollback --lot <id> --confirmer`, comptes avant/après consignés, avant le lot 1a du 09/10.
3. **H+45 consignés** (06/10 : LinkedIn `sent` = preuve C4, Instagram 2 images + alt ; 07/10 : X `sent` avec lien réel), dans `REPLIT_ACTIONS.md`.
4. **Rendu Worker prouvé avant le 13/10 06:00 UTC** : après régénération de `relance-s15`, `curl` de `/api/social/image?postId=<1er [variante:image]>&slide=0` → 200 `image/png` 1080×1350, puis brouillon LinkedIn image réel (`saveToDraft`) et suppression (preuve K4).
5. **Alerte sur repli image** (1 par jour, clé `social-repli-image-linkedin`) pour rendre L1 visible le jour même ; et conserver `[variante:…]` dans la note d'échec permanent (L3, via `conserverMarqueurs`).
Points 1, 2 et 4 relèvent de @fullstack (2 et 4 avec la session pour l'accès) ; 3 de la session. L4 et L5 : à corriger au passage, non bloquants.

## Note de la session (05/10, ~23:00)
Point 4 en partie FAIT avant cette notation : carte LinkedIn `[variante:image]` rendue PAR LE WORKER EN PRODUCTION (`/api/social/image`, post de test REJECTED, 200 `image/png` 1080×1350 en 3,0 s) et brouillon Buffer LinkedIn 1 image accepté puis supprimé (`REPLIT_ACTIONS.md`). Reste du point 4 : refaire sur un vrai post du lot régénéré avant le 13/10, et vérifier le chemin d'envoi qui rend la carte dans le Worker sans passer par l'URL.
