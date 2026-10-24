# Contre-épreuve @qa s21 sur `f9b49bd` (branche `claude/marrant-s21-integration`)

Date : 18/10/2026. Base : QA v4 (`docs/qa/qa-cta-s21-v4.md`, commit `5eefe5e`, 8,5/10, GO sous réserve de MJ-1).
Périmètre : diff `5eefe5e..f9b49bd` (74 fichiers, +1 916 / −275) : corrections QA v4 (`1883d71..f13b8e8`), `/api/health` (`a039e77`), ligne de stock du rapport du lundi (`0f60382`), corrections SEO/GEO (`f9b49bd`).

**Verdict : GO mise en ligne. Note : 9/10.** Aucun bloquant, aucun majeur. 4 mineurs, tous de documentation ou de texte pour les IA : aucun ne touche le site affiché.

## 1. Conditions d'exécution

- Arbre propre sur `f9b49bd` (= `origin/claude/marrant-s21-integration`). CI « Tests CI » run `39160396547` sur `f9b49bd` : `test`, `lint`, `e2e-local` à `success` (relu par `gh run view`).
- Tout en `env -i` : seules les variables factices de `tests.yml` (job `e2e-local` : `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET=secret-factice-e2e-local`, `RESEND_API_KEY=re_factice_e2e`, `RESEND_BASE_URL` vers le faux Resend, `STRIPE_PREMIUM_PRICE_ID` / `STRIPE_PREMIUM_ANNUAL_PRICE_ID` factices, `E2E_*`), plus `HTTPS_PROXY` / `NO_PROXY` et le certificat (`NODE_EXTRA_CA_CERTS`) pour les polices. Aucune clé Stripe, Anthropic ou Resend réelle. Ports privés : base 5497, serveur 5397, faux Resend 5398.
- Base : PostgreSQL **16.15** jetable (`initdb` privé), `scripts/seed.sh` (schéma + seed), puis `npm run build` (sortie standalone), `public/` et `.next/static` copiés, `node .next/standalone/server.js`.
- Aucun accès à la production, aucun déploiement. Validations marquées [LIVE] (build local réel, sortie observée) ou [STATIQUE] (lecture du code).

## 2. Relecture du diff en adversaire

| Point attaqué | Constat | Preuve |
|---|---|---|
| Texte visible changé par `f9b49bd` | Aucun. Les 29 fichiers ne touchent que `metadata`, llms, JSON-LD, sitemap et tests ; les constantes `PAGE_TITLE` / `PAGE_DESCRIPTION` reprennent mot pour mot les anciennes valeurs. | [STATIQUE] `git show f9b49bd` |
| `NOINDEX_ROBOTS` : `other.bingbot: ""` écrase-t-il les autres `other` du layout (`apple-mobile-web-app-*`, `mobile-web-app-capable`) ? | Non : Next fusionne `other` clé par clé. Les 3 balises restent sur `/lettre`, `/carnet`, `/register`, 404. | [LIVE] HTML servi |
| Robots en double, noindex posé sur une page indexable | Une seule `<meta name="robots">` par page. Noindex seulement sur `/lettre`, `/lettre/confirmer`, `/lettre/desinscrire`, `/carnet`, `/carnet/[mois]`, `/register`. Toutes les pages indexables restent `index, follow` avec `bingbot` `index`. | [LIVE] §4 |
| `pageShareMeta` remplace `openGraph` : image perdue ? | Non : `websiteOpenGraph` repose `og:image` (`/opengraph-image`), type, locale et siteName. Aucune page touchée n'avait d'`openGraph` propre (0 ligne retirée). | [LIVE] + [STATIQUE] |
| `priceValidUntil` | Calculé à chaque rendu : `2027-12-31` aujourd'hui, jamais une date passée. JSON-LD de `/abonnement` : 4 blocs, tous valides. | [LIVE] |
| llms : drapeaux de publication | `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE` = `true` : 5 parcours dans `llms.txt` et `llms-full.txt`, même durée que l'offre (3/4/6/6/6 semaines). | [LIVE] |
| `/api/health` | 503 seulement si `critical` est `down` ; un contenu en `degraded` reste en 200. Les comptages restent `null` en cas d'erreur, sans lever d'exception. Le mode `generation` reste celui d'avant. | [LIVE] + [STATIQUE] |
| Ligne de stock du lundi | `loadStockLineHtml` n'échoue jamais (`try/catch` → « illisible (base) »). Rien si la génération est active. Pluriel correct (« 0 jour »). | [STATIQUE] + Jest |
| QA v4 m-3 / m-5 | Menu mobile : même bouton prix pour le visiteur et pour le compte sans abonnement, plus de « Activer mon accès ». Murs : pagination masquée côté client seulement ; le HTML du serveur garde les liens `?page=2` (2 par mur). | [LIVE] |
| Migration | Aucun changement dans `apps/web/prisma` depuis `5eefe5e`. | [STATIQUE] |

## 3. Build et tests [LIVE]

- `npm run build` : OK (code 0). First Load : `/parcours/[slug]` **149 kB**, `/abonnement` 132, `/register` 127, `/vannes` 134 (comme annoncé).
- **Smoke desktop + iPhone 13** (`npm run test:e2e:smoke`, contre le build local) : **128 réussis, 2 ignorés (voulus), 0 échec, 0 flaky**. MJ-1 vert sur les deux projets (`murs-premium.spec.ts:108`, « l'étape 1 mène à /register puis au paiement @s21 »).
- **Playwright `local`** : **54/54, 0 flaky** (dont `mineurs-qa4-s21` m-2/m-4/m-5/m-6, `header-budget` sur 6 largeurs × 3 états, compte FREE de 320 à 768 px, 320 px sans défilement horizontal).
- Jest ciblé (`api/health`, `geo-seo-controles-s21`, `weekly-visits-job`, `sitemap-lastmod-s20`, `lettre-repliee-qa4`, `murs-pagination-qa4`, `layout/header`) : 7 suites, 110 tests OK. La suite complète, `tsc` et `lint` sont verts en CI sur `f9b49bd`.
- Mode génération : 2e serveur temporaire avec `CONTENT_GENERATION_ENABLED=true` → `mode: "generation"`, `countedInStatus` = `joke, tip, video, blogArticle, llmSuccess`, pas de `stock` (arrêté juste après).
- Captures lues (320, 375, 768, 1 280 px : accueil, `/abonnement`, `/register`, `/parcours`, `/parcours/repartie`, fin du mur `/vannes`). `scrollWidth` = largeur partout, aucun débordement. En-tête « 2,99 €/mois » à 320 et 375 px, « Premium · 2,99 €/mois » à 768 et 1 280 px. Réassurance sous chaque bouton plein qui porte un prix. Mur : « Les 10 gratuites, c'est fait. », une carte, aucune pagination. Pas de texte tronqué ni de chevauchement.
  - Une capture prise pendant le défilement doux montrait l'en-tête décalé. Ce n'est pas un défaut : remesuré, l'en-tête est `sticky` à `top: 0` à tous les instants.

## 4. Curl sur le build local [LIVE]

**`/llms.txt`** (91 lignes) et **`/llms-full.txt`** (3 425 lignes) : `text/plain; charset=utf-8`.
- Tirets cadratins : 0 et 0 ; demi-cadratins : 0 et 0. `undefined` / `null` / `[object` : 0 dans `llms.txt`. Les 3 occurrences de `llms-full.txt` sont le mot « nulle » dans des articles.
- Réassurance mot pour mot : « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » apparaît 1 fois dans `llms.txt` (fin des tarifs) et 2 fois dans `llms-full.txt` (FAQ « Combien ça coûte ? » et fin des tarifs).
- Plus de « résiliable en ligne » dans le texte propre aux llms. Il en reste 4 dans le corps d'articles du blog, identiques au site : hors périmètre.
- 5 parcours dans les deux fichiers, aux mêmes durées que l'offre.
- Carnet et lettre sans date ni mois nommé, dans les deux fichiers. Aucune date `AAAA-MM` ni « mois année » dans `llms.txt`.
- « Université du Nouveau-Mexique » : 0. Crawford et Caltabiano : présents.
- Libellé « Articles » (section et compteur `## Articles (25)`). Liens `- [..](https://deviens-marrant.fr..)` : 40 bien formés, 0 mal formé.

**`/sitemap.xml`** : 260 URL, pas de doublon, aucun lastmod dans le futur.
- `/`, `/vannes`, `/conseils`, `/videos`, `/glossaire`, `/a-propos`, `/abonnement`, `/quiz-humour` : `2026-10-18`.
- `/cgu` et `/confidentialite` : `2026-10-17`. `/mentions-legales` et `/retractation` : `2026-05-06`.
- Parcours : max(constante `2026-10-18`, base). En local, la base du seed donne l'heure du seed.
- `/lettre`, `/carnet`, `/register` absents (voulu).

**`/robots.txt`** : identique au relevé de production fait par une session précédente (`prev-robots.txt`, 19:15). `robots.ts` n'est pas modifié. `Sitemap:` présent, `/api/` bloqué.

**`<head>`** (une seule balise `robots` partout) :

| Page | HTTP | robots | bingbot | canonical | og:url |
|---|---|---|---|---|---|
| `/` | 200 | index, follow | index | `https://deviens-marrant.fr` | idem |
| `/abonnement` | 200 | index, follow | index | `/abonnement` | `/abonnement` |
| `/lettre` | 200 | noindex, nofollow | **absent** | aucun | accueil |
| `/carnet` | 200 | noindex, nofollow | **absent** | aucun | accueil |
| `/register` | 200 | noindex, nofollow | **absent** | aucun | accueil |
| `/cgu` | 200 | index, follow | index | `/cgu` | `/cgu` |
| `/vannes?page=2` | 200 | index, follow | index | `/vannes?page=2` | `/vannes?page=2` |

Aussi contrôlés :
- `/confidentialite`, `/mentions-legales`, `/retractation`, `/glossaire`, `/a-propos`, `/blog`, `/conseils`, `/videos` : canonical et og:url propres à la page, `og:image` présent, H1 unique.
- `/lettre/confirmer` et `/lettre/desinscrire` (307 sans jeton) et `/carnet/2026-10` : noindex, aucun `bingbot`.
- `/carnet/2026-11` et `/carnet/1999-01` : 404, `noindex` seul.
- Contrôle de l'entrée SEO de `REPLIT_ACTIONS.md` joué tel quel : `curl -s …/lettre | grep -c bingbot` → `0` ; `curl -s …/llms.txt | grep -c "premier paiement remboursable sous 14 jours"` → `1`.

**`/api/health`** : la forme correspond au `jq` de P6, qui tourne tel qu'écrit. On obtient `mode: "stock"` et `countedInStatus: ["dailyToday","stock","blogArticle"]`. `dailyToday` vaut `{date, foundDate, status: "ok"}`. `stock` contient `jokesNeverUsed`, `tipsNeverUsed`, `videosNeverUsed`, `plannedDaysAhead`, `jokeDaysLeft`, `tipDaysLeft`, `minDays: 14`, `status` et `note`. En local, la réponse est 503 / `down`, uniquement parce que `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` sont absents (voulu, `critical.failures`). En production, ces secrets sont posés : 200 attendu.

## 5. Procédure P0 à P8 de `REPLIT_ACTIONS.md`

Exécutable telle qu'écrite. Vérifications faites :
- **P0** : la boucle `for b in main master claude/ouverture-session-nzwj0w` n'affiche rien (les 3 branches existent sur `origin`). `gh run list` et `gh run view` renvoient bien `headSha` et les 3 jobs.
- **P3** : migration 14 jouée 2 fois sur une base PostgreSQL 16 jetable, code 0 aux deux passes. Les 3 `to_regclass` sont non vides et le `grep -cE` donne `3`. Rejeu idempotent sur un schéma final ; le passage depuis le schéma N-1 a été vérifié par les sessions précédentes.
- **P4** : `build:cf` et `deploy:cf` existent dans `package.json`.
- **P6** : le `jq` de santé est valide. Critères cohérents avec le code : `status` en 200 tant que `critical` va bien, et un stock en `stale` donne `degraded` sans P8.
- **P2 (c)** et **P7 étape 2**, modifiés, sont cohérents entre eux : plus de contrôle Resend avant, la preuve passe par l'e-mail réel en P7. Un lien réécrit n'est pas bloquant, sauf avant le 05/11.
- **P8** : inchangé. N-1 relevé en P1, `/lettre` en 404 attendu.

Trois manques de documentation, non bloquants : m-1 à m-3 ci-dessous.

## 6. Défauts

Aucun bloquant, aucun majeur.

| Id | Gravité | Défaut | Correctif précis |
|---|---|---|---|
| m-1 | Mineur (procédure) | Les contrôles après mise en ligne des entrées « Contrôles GEO et SEO s21 » (`/lettre` sans `bingbot`, réassurance dans `llms.txt`) et « `/api/health` » (ligne de stock dans le rapport du premier lundi) ne sont appelés nulle part dans P6. Ils risquent d'être oubliés. | Dans P6, ajouter une puce « SEO/GEO : `curl -s "https://deviens-marrant.fr/lettre?ne-pas-compter=1" \| grep -c bingbot` → `0` ; `curl -s https://deviens-marrant.fr/llms.txt \| grep -c "premier paiement remboursable sous 14 jours"` → `1` ». Dans « Contrôles datés », ajouter « lundi suivant : ligne Stock du contenu du jour (ou Nouveau lot à préparer) dans le rapport de 7 h ». |
| m-2 | Mineur (procédure) | P7 étape 2 : si le lien est réécrit par Resend, Thomas désactive « Click tracking » avant le 05/11. Aucun contrôle daté ne vérifie que c'est fait. | Dans « Contrôles datés » de P6, ajouter « avant le 05/11 8 h, si P7.2 a vu un lien réécrit : Click tracking désactivé (capture), sinon l'envoi du n°1 attend ». |
| m-3 | Mineur (procédure) | P0 exige que le `headSha` du dernier run = `HEAD`. Or ce rapport, puis la note « commit exact » demandée par P0, créent chacun un commit de documentation : le commit à mettre en ligne n'est plus `f9b49bd`, et chaque note relance la CI. | Écrire dans P0 : « commit à mettre en ligne = HEAD de la branche après le commit de ce rapport (doc seule, code identique à `f9b49bd` : `git diff --stat f9b49bd HEAD -- apps/web .github` vide), CI verte sur ce HEAD ». Noter le commit et la version déployés après P4, dans un seul commit de doc. |
| m-4 | Mineur (texte pour les IA) | Sommaire de `llms-full.txt` : « Sections principales : vannes, conseils, vidéos, parcours, blog » oublie le carnet et la lettre et garde « blog » ; « 25 articles de blog » au lieu du libellé « Articles » (C6 appliqué partiellement). | `apps/web/src/app/llms-full.txt/route.ts`, rendu du sommaire : « Sections principales : vannes, conseils, vidéos, parcours, carnet, lettre, articles » et « 25 articles » (via `LIBELLE_SECTION_ARTICLES`). Peut partir après la mise en ligne. |

Observations hors périmètre (déjà présentes avant `5eefe5e`, rien à faire pour la mise en ligne) :
- `llms-full.txt`, FAQ « Je suis timide » : « La majorité des membres se décrivent comme introvertis au départ ». C'est une affirmation sans source visible (règle anti-invention), à faire vérifier ou reformuler par @geo / @product-manager.
- CI `e2e-local` : `cp -r public .next/standalone/public` crée `public/public`, car `next build` a déjà créé `standalone/public/fonts`. Le favicon et les fichiers de `public/` ne sont donc pas servis en E2E CI ; les tests passent quand même. Correctif : `cp -r public/. .next/standalone/public/`. Sans effet sur la production (`build:cf`).
- `/retractation` n'a pas de `googlebot` (`robots` propre à la page) ; `/register` est à la fois `Disallow` dans `robots.txt` et en noindex. Les deux sont inoffensifs.

## 7. Note et verdict

**9/10, GO mise en ligne** sur le HEAD de la branche, qui ne contient que ce rapport en plus de `f9b49bd` (code identique), une fois la CI verte sur ce HEAD (P0).
- Les 4 corrections QA v4 tiennent en navigateur.
- Les métadonnées sont saines : une balise robots par page, noindex seulement là où c'est voulu, canonical et og:url propres.
- Le texte pour les IA est conforme : réassurance mot pour mot, 5 parcours, aucun tiret cadratin.
- `/api/health` et la ligne du lundi sont conformes.
- La procédure est exécutable.

Il manque 1 point pour 10, pour m-1 à m-4. m-1 à m-3 se corrigent dans `REPLIT_ACTIONS.md` avant P0 si possible ; m-4 au prochain lot.
