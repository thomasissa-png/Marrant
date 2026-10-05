# Notation de la relance, cycle 6 : K7 Fiabilité de la chaîne (@qa, 05/10/2026, soir)

> Objet : chaîne base → `publish-social` → Buffer du lot `semaine0` (10 posts, 06 au 09/10), sur l'état réel. Aucun fichier de code modifié.
> `[LIVE]` = lecture réelle (SELECT Neon, API Buffer `channels`/`posts`, `wrangler secret list`, `curl` des cartes). `[STATIQUE]` = lecture du code. Code en ligne = `ff3ac23` (Worker `0edcaee7`) : `git diff ff3ac23 HEAD` vide sur `lib/social`, `publish-social`, `api/social`.

## Note K7 : 6,5/10 (9 posts sur 10 partent ; le 10e échouera à coup sûr, et rien ne l'a vu)
La chaîne est saine pour LinkedIn, Instagram et 3 posts X sur 4. **Le post X du mer. 07/10 12:30 (quiz) passera en FAILED** : la limite X a été corrigée dans la route (longueur comptée par X) mais pas dans `buffer-client.ts`, qui recompte en brut. Les 463 tests passent parce que la route est testée avec `buffer-client` simulé : le défaut ne peut pas y apparaître.

## Tests Jest `[LIVE local]`
`npx jest src/__tests__/lib/social src/__tests__/api` : **31 suites, 463 tests PASS** (4,1 s). Aucun ne combine la route et le vrai `createBufferPost` avec un lien long.

## Trace d'un post par réseau
| Étape | LinkedIn `c59404f4…` 06/10 | X `c2acdc88…` 07/10 (quiz) | Instagram `cade959f…` 06/10 |
|---|---|---|---|
| Base `[LIVE]` | APPROVED, `lot-semaine0`, score null, cta null, 123 car. | APPROVED, 313 car. bruts | APPROVED, `imageUrls` = 2, texte « deviens-marrant.fr » |
| Interrupteur `[LIVE]` | `paused=false` (19:44:45 UTC) | `paused=false` | `paused=false` |
| Canal Buffer `[LIVE]` | connecté, secret présent sur le Worker | connecté, secret présent | connecté, secret présent |
| Heure | 06:15Z = 08:15 Paris | 10:30Z = 12:30 | 17:30Z = 19:30 |
| Sélection | `approvedBy` non nul : passe le filtre score ; format non déprécié ; aucun marqueur `[article:]` ni lien `/blog/` (garde inactive, vérifié sur les 10) | idem | idem |
| Remise | 1er passage `*/15` à l'heure ; `dueAt` = maintenant + 2 min (envoi vers 08:17) ; texte seul, sans 1er commentaire | route : `longueurX` = 229 ≤ 270, OK ; puis `ensureContentLength` : **313 > 280 → `BufferContentTooLongError`** | `createBufferImagePost`, 2 URL de la base, `type: post`, alt amorce + chute (157 car.) sur chaque image |
| Issue | PUBLISHED, puis relecture Buffer horaire | **FAILED** (« trop long » = erreur permanente), note « Contenu trop long pour TWITTER : 313 chars (max 280) » | PUBLISHED si Buffer récupère les 2 PNG |
Cartes `[LIVE]` : slide 0 = 200 `image/png` 66 Ko en 3,4 s ; slide 1 = 200, 54 Ko, 2,1 s. File Buffer actuelle : 0 post programmé. Aucun autre post actif du 06 au 12/10, aucun APPROVED en retard.
LinkedIn `[LIVE]` : dernier envoi Buffer le 09/08 16:45 UTC (hors appli : le dernier PUBLISHED en base date du 15/06). Le post du 06/10 est le **1er envoi par l'API depuis 58 jours**. Il passe avant le brouillon LinkedIn prévu le 08/10 comme preuve C4 : c'est donc lui la preuve.

## (1) Ce qui peut faire échouer un post demain, et comment le voir
| # | Risque | Proba | Détection |
|---|---|---|---|
| R1 | **X 07/10 12:30 en FAILED** (`buffer-client.ts:140` et `:171` comptent `content.length` contre 280 ; l'URL UTM fait 313 bruts). Même sort pour **tout post X avec lien** de `relance-s15` (quiz, relais) | certaine | e-mail `social-echec-twitter` vers 12:30, note FAILED ; 1 seul échec, donc pas de pause automatique |
| R2 | LinkedIn 06/10 : Buffer accepte, LinkedIn refuse à l'envoi (autorisation expirée après 58 jours sans envoi par l'API) | faible à moyenne | relecture Buffer horaire : FAILED + e-mail `buffer-status-alert-linkedin` ; contrôle H+45 à 09:00 (`sentAt`, lien réel) |
| R3 | Instagram : Buffer abandonne la récupération d'une carte (rendu en 2 à 3,4 s, à froid) | faible | erreur classée temporaire : `[retry:1]`, report de 30 min (19:30 → 20:00) ; FAILED au 3e essai |
| R4 | 429 Buffer : réseau bloqué 24 h **sans e-mail** (`rateLimitOnly` coupe l'alerte, route l.476-480) | faible | aucune alerte ; seul le H+45 voit le trou |
| R5 | Neon à froid ou panne en cours de passage | faible | e-mail « erreur critique », nouvel essai 15 min plus tard (au plus 15 min de retard) |
| R6 | Un post échoué ne repart jamais seul (FAILED n'est jamais repris) | certaine si R1 | la session le remet en APPROVED sur un créneau libre après correction |
Hors risque `[LIVE]` : heures Paris → UTC exactes (heure d'été jusqu'au 25/10) ; le FAILED Instagram du 05/10 17:31 (`cmup7tzf…`) est antérieur à la reprise de 19:44:49 : il ne compte pas pour la pause après 2 FAILED.

## Correctif R1 (à chaud, avant le 07/10 10:15 UTC)
1. `buffer-client.ts`, `ensureContentLength` : `const n = platform === "TWITTER" ? longueurX(content) : content.length;` comparé à la limite (message sans « splitté en thread »).
2. Test de non-régression sans simulation de `buffer-client` : `createBufferPost("TWITTER", <texte exact de c2acdc88>)` appelle `fetch` (229 comptés par X, 313 bruts) ; 271 comptés par X → refus.
3. tsc, lint, build, Jest 100 %, `build:cf` + `deploy:cf`, N-1 = `0edcaee7-9e95-4b61-9acb-4c22ff8861f0` consignée. Preuve `[LIVE]` : brouillon X réel (`saveToDraft`) du texte de `c2acdc88`, puis suppression.
4. Secours sans déploiement (au plus tard 09:45 UTC, décision Thomas car le suivi est touché) : retirer `utm_medium=social&` et `&utm_campaign=2026-10` de l'URL en base (313 → 274 bruts). Sinon, après le FAILED : remettre le post en APPROVED sur le prochain créneau X libre hors dimanche (10/10 12:30 au plus tôt, après le déploiement).

## (2) Script d'insertion en HTTP (proposition, non appliquée)
Cause : avec l'adaptateur HTTP, `createMany` ouvre une transaction, refusée. Une **seule instruction `INSERT` multi-lignes** est atomique sans transaction (c'est ce que la session a fait à la main) :
```ts
import { Prisma } from "@prisma/client";
const lignes = [...f.posts, ...replis].map(donnees).map((d) => Prisma.sql`(${d.id}, CAST(${d.platform} AS "SocialPlatform"),
  CAST(${d.format} AS "SocialFormat"), ${d.content}, ${d.hook}, ${d.cta}, ${d.hashtags}::text[], ${d.targetPersona}, ${d.sourceType},
  ${d.sourceId}, ${d.threadParts}::text[], ${d.imageUrls}::text[], CAST(${d.status} AS "SocialPostStatus"), ${d.approvedBy},
  ${d.directorScore}, ${d.directorNote}, ${d.scheduledAt}, NOW(), NOW())`);
const n = driver === "neon-http"
  ? await prisma.$executeRaw`INSERT INTO "SocialPost" ("id","platform","format","content","hook","cta","hashtags","targetPersona",
      "sourceType","sourceId","threadParts","imageUrls","status","approvedBy","directorScore","directorNote","scheduledAt",
      "createdAt","updatedAt") VALUES ${Prisma.join(lignes)}`
  : (await prisma.socialPost.createMany({ data: [...f.posts, ...replis].map(donnees) })).count;
// puis `inseres: n - replis.length` ; le contrôle après insertion (relecture par réseau et par semaine) reste inchangé.
```
`updatedAt` n'a pas de valeur par défaut en base (`@updatedAt`), d'où `NOW()`. Variante : pilote `neon-ws` (`PrismaNeon({ connectionString })`, transactions acceptées) `[À VÉRIFIER : WebSocket à travers le proxy]`. Tests : unitaire (en `neon-http`, `$executeRaw` appelé 1 fois et `createMany` jamais) ; `[LIVE]` sur la branche Neon : `--insert --driver=neon-http` puis `--rollback --lot <id> --confirmer`. **`updateMany` de `--rollback` n'a jamais tourné en HTTP** `[À VÉRIFIER]`, avant le lot 1a du 09/10.

## (3) Coût d'une image sur X et LinkedIn
Les cartes existent (`carteVanneUnique("x" | "linkedin")`, 16:9 et 1200×627) mais `/api/social/image` ne les sert pas : `slidesDuPost` ne traite que `IMAGE_QUI_CLAQUE`. Changements :
- `generate-post-image.ts` : branche TWEET / POTE_AU_TAF vers `carteVanneUnique` (amorce et chute = `threadParts`, ou les 2 lignes « » du texte, sans le paragraphe quiz ni l'URL) ; texte alternatif idem.
- Script de lot : `threadParts` = [amorce, chute] pour X et LinkedIn (les 10 posts actuels en ont 0).
- `buffer-client.ts`, `createBufferImagePost` : option `firstComment` (métadonnée LinkedIn) et **même correctif de longueur X que R1** (sinon même échec).
- Route : TWITTER et LINKEDIN passent par `createBufferImagePost` avec 1 URL `slide=0` ; repli texte seul si le rendu échoue (`HEAD` non 200), pour ne jamais perdre le créneau.
- Tests (8 environ) : choix de la carte par réseau et dimensions ; alt ; route X avec image (1 URL, sans hashtags) ; LinkedIn avec image et 1er commentaire ; X 229/313 avec image ; repli texte si rendu en 500 ; forme de la mutation (pas de métadonnée Instagram) ; `[LIVE]` brouillons X et LinkedIn réels avec image, puis suppression.
- Charge : environ 80 lignes de code, 1 déploiement, une validation visuelle par Thomas des 2 cartes. Effet à mesurer : sur X, l'image remplace l'aperçu du lien quiz.

## Pour 10/10
1. R1 corrigé et déployé avant le 07/10 10:15 UTC, avec le test non simulé et le brouillon X réel.
2. Un test d'intégration route + vrai `buffer-client` (seul `fetch` simulé) pour chaque réseau, sur des textes réels du lot : la classe de défaut de R1 ne pourra plus passer.
3. R4 : alerte aussi sur 429 (1 par jour et par réseau).
4. Script HTTP corrigé, `--insert` et `--rollback` prouvés `[LIVE]` sur la branche Neon avant le lot 1a.
5. H+45 des 06 et 07/10 consignés : LinkedIn `sent` (preuve C4), Instagram 2 images avec alt, X `sent` avec lien réel.
