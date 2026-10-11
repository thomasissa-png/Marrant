# Diagnostic vitesse (audit Ahrefs du 07/10) : s20

> @infrastructure, 11/10/2026. Lecture seule sur la prod (aucune écriture en base, aucun déploiement).
> Adaptateur : `@opennextjs/cloudflare` 1.15.1 (dépend de `@opennextjs/aws` 3.9.12), Next 14.2.35.
> `node_modules` absent du conteneur : sources lues dans les paquets npm officiels de ces versions exactes (`npm pack`).

## 1. Constat d'entrée

- Ahrefs 07/10 : 185 « slow page », 19 « slow server response for AI crawlers ».
- Passe de la session (414 URL du sitemap, conteneur US, colo IAD) : TTFB 38 < 0,5 s, 324 entre 0,5 et 1 s, 47 entre 1 et 2 s, 5 > 2 s.

## 2. Mesures (11/10, ~20:10 UTC, colo IAD)

**Biais de mesure à retirer.** Depuis ce conteneur, `time_starttransfer` inclut la poignée TLS via le proxy sortant de l'agent (0,12 à 0,42 s). Sur une connexion réutilisée, le même conseil répond en 0,20 à 0,24 s. Le « TTFB ≈ 0,4-0,6 s sur un HIT » de la passe de session contient donc 0,1 à 0,4 s de réseau propre au conteneur. Plancher mesuré : `/favicon.ico` (servi par la couche assets, sans Worker) = 0,09 s après TLS. Les chiffres ci-dessous sont des **temps serveur** = `time_starttransfer - time_pretransfer`.

**Échantillon de 69 URL du sitemap (1 sur 6), deux passes à quelques minutes d'écart :**

| `x-nextjs-cache` | Passe 1 | Passe 2 |
|---|---|---|
| `STALE` | **65** (médiane 0,40 s, max 1,55 s) | **57** (médiane 0,39 s, max 1,30 s) |
| `HIT` | 3 | 11 (médiane 0,38 s, max 0,47 s) |
| sans cache (dynamique) | 1 | 1 |

- 60 des 65 réponses `STALE` n'ont **aucun** `Cache-Control` ; 5 ont `s-maxage=2`.
- Les `HIT` : pages du prerender-manifest (`/glossaire`, `/quiz-humour`, blog, `/parcours/repartie`, accueil) et 3 fiches tombées sur un isolat qui venait de les régénérer.
- `/conseils/raconter-le-personnage-secondaire-cs14tip525` (pire URL de la session) : `STALE` aux deux passes, 1,35 s puis 0,36 s.

**Pages rendues à chaque requête** (`cache-control: private, no-cache, no-store`) : `/vannes`, `/conseils`, `/videos` (1,0 à 2,2 s au premier appel, 1,0 à 1,3 s au second), `/abonnement` (`force-dynamic`), `robots.txt` (1,19 s). Aucune réponse ne porte `cf-cache-status` : rien n'est servi par le cache CDN, tout passe par le Worker (normal sur un domaine personnalisé de Worker).

## 3. Cause

**Cause n° 1 (majeure) : les fiches ISR sont perpétuellement `STALE`.**

1. `conseils/[slug]`, `vannes/[slug]` et `videos/[slug]` ont `generateStaticParams() { return [] }` + `dynamicParams = true` : aucune fiche n'est dans le prerender-manifest, elles sont générées à la demande puis stockées dans R2.
2. OpenNext stocke bien `revalidate` dans l'entrée R2 (`adapters/cache.js`, `set`), mais au `get` il ne rend à Next que `lastModified` et le contenu.
3. Next 14.2.35 calcule alors l'obsolescence avec sa table en mémoire (`incremental-cache/index.js`, `calculateRevalidate`) : « if an entry isn't present in routes we fallback to a default of revalidating after 1 second ». Cette table n'apprend le vrai `revalidate` qu'au moment où l'isolat écrit lui-même la page.
4. Sous Workers, les isolats sont nombreux et éphémères : tout isolat qui lit une fiche écrite par un autre la juge obsolète au bout d'**1 seconde**. Chaque visite (Googlebot, Ahrefs, robots IA) déclenche donc :
   - le passage par le serveur Next complet (chargement du module de la page, à froid si l'isolat est neuf), puis la lecture R2 ;
   - **en plus**, une revalidation en tâche de fond (memory-queue, `HEAD` via `WORKER_SELF_REFERENCE`) qui rend toute la page avec ses requêtes Neon via Hyperdrive (Francfort).
   Sur un crawl de 400 pages, cela fait environ 400 rendus complets supplémentaires qui se disputent le CPU des isolats et la base. D'où la forte variance (même URL : 0,4 s puis 1,2 s) et les queues à 2-3 s.

**Cause n° 2 : les listes `/vannes`, `/conseils`, `/videos` sont dynamiques.** Elles lisent `searchParams` (`?page=`, `?q=`), donc Next les rend à chaque requête (`private, no-store`). Les requêtes catalogue sont sous `unstable_cache` (`src/lib/catalogue-pages.ts`), mais le rendu complet reste à payer à chaque hit. Une correction demande de toucher au code des pages (hors périmètre de cette mission, voir §4.3).

**Cause n° 3 (secondaire) : même un vrai `HIT` traverse tout le serveur Next.** `enableCacheInterception` vaut `false` par défaut dans `defineCloudflareConfig`. OpenNext ne sert donc jamais directement l'entrée de cache : il charge le serveur Next et le module de la route, ce qui coûte cher sur un isolat froid (accueil : 1,3 à 2,1 s sur `HIT`).

**Écartés :** tag cache (aucun `revalidateTag`/`revalidatePath` dans le code, cache de tags factice, sans coût) ; Hyperdrive (non sollicité sur un vrai `HIT`) ; Cache Rules du tableau de bord (un domaine personnalisé de Worker exécute le Worker avant le cache : une Cache Rule ne met pas en cache la réponse du Worker).

## 4. Correctif

### 4.1 Implémenté (config seule) : `apps/web/open-next.config.ts`

1. **`enableCacheInterception: true`** (option publique de `defineCloudflareConfig` 1.15.1, `false` par défaut). L'intercepteur (`@opennextjs/aws` `core/routing/cacheInterceptor.js`) tourne après les redirections et le middleware. Pour toute route du prerender-manifest (`routes` + regex `dynamicRoutes`), il lit l'entrée R2 et la renvoie **sans charger le serveur Next**. L'obsolescence est calculée avec le `revalidate` **stocké dans l'entrée**, ce qui supprime le « STALE à 1 s ». Les en-têtes `next.config` (CSP, HSTS…) sont réappliqués (`applyMiddlewareHeaders`). En cas d'échec de lecture ou d'absence d'entrée, la requête passe au serveur Next comme aujourd'hui.
2. **File de revalidation non bloquante.** Dans l'intercepteur, `computeCacheControl` fait `await queue.send(...)`, et la memory-queue attend la fin du rendu (`HEAD` via `WORKER_SELF_REFERENCE`, délai max 10 s). Sans ce changement, la première visite d'une page réellement obsolète attendrait le rendu complet. Un enrobage minimal passe `memoryQueue.send` dans `getCloudflareContext().ctx.waitUntil(...)` (API publique, même module que celui de la memory-queue). La déduplication par isolat est inchangée. Sur le chemin sans interception, l'envoi passait déjà par `waitUntil` : le comportement y est identique.
3. Inchangés : cache R2 enrobé par `withoutHttpFetchCache` (incident s14), aucun tag cache, `wrangler.jsonc` non modifié (aucune ressource ni binding nouveau).

Contrôles : `npx tsc --noEmit -p tsconfig.build.json` = 0 et `npx tsc --noEmit` (configuration complète, la seule qui inclut `open-next.config.ts`) = 0. Le `dist` installé est identique octet pour octet au paquet 1.15.1 lu. Ni build ni déploiement (à la charge de la session).

### 4.2 Évalué, non retenu pour ce lot

- **`withRegionalCache` (cache API par colo devant R2)** : il existe bien en 1.15.1 (`overrides/incremental-cache/regional-cache`, modes `short-lived`/`long-lived`). Le commentaire du paquet lui-même dit qu'il « n'améliore pas directement beaucoup la performance » (le gain vient du contournement du tag cache, que nous n'avons pas). Il ajoute une désynchronisation par colo (sans purge, la copie locale n'est rafraîchie qu'au hit suivant). **Piège s14** : sa méthode `set` écrit dans le cache API **même si** le store sous-jacent refuse l'écriture. Il ne faut donc jamais faire `withRegionalCache(withoutHttpFetchCache(r2))`, qui réintroduirait le rejeu des réponses Anthropic/Buffer pendant 30 min. Le seul ordre sûr est `withoutHttpFetchCache(withRegionalCache(r2IncrementalCache, { mode: "long-lived" }))`. À tester en phase 2 seulement si, après ce lot, le temps serveur médian des fiches reste au-dessus de 0,15 s.
- **Cache Rules / cache CDN** : le Worker s'exécute avant le cache sur un domaine personnalisé, et sa réponse n'est pas mise en cache par une Cache Rule. L'option équivalente consiste à mettre en cache dans le Worker via l'API Cache (`caches.default`), ce qui demande de modifier le code (voir 4.3).
- **Tag cache (D1/DO/KV)** : inutile, le code n'appelle pas `revalidateTag`/`revalidatePath`.
- **Pré-rendu au build des fiches** (`generateStaticParams` non vide) : corrigerait aussi le STALE, mais demande la base au build et touche les pages. Inutile si l'interception tient.

### 4.3 Hors périmètre de ce lot (à confier à @fullstack, pages vannes en cours chez d'autres agents)

- **Listes `/vannes`, `/conseils`, `/videos`** (1 à 2,2 s, rendues à chaque visite) : mettre en cache dans `cloudflare/worker.ts`, via l'API Cache, les `GET` **sans cookie de session** (`next-auth.session-token`, `__Secure-next-auth.session-token`) sur ces 3 chemins exactement (clé = URL complète avec `?page=`), avec un TTL de 300 s aligné sur `LIST_REVALIDATE_SECONDS`. Prérequis à vérifier : aucun rendu serveur de ces pages ne lit la session (aujourd'hui seulement `searchParams`). Autre option : rendre la page 1 statique (ISR) et lire `?q=` côté client.
- **`robots.txt`** (1,19 s) : fichier en cours de modification par un autre agent ; à re-mesurer après ce lot.

## 5. Gain attendu

[ESTIMATION à confirmer par la mesure du §7, non mesurable avant déploiement]

- **Fiches vannes/conseils/vidéos (351 des 414 URL du sitemap)** : fin du rendu de fond déclenché à chaque visite, donc fin de la contention CPU/Neon pendant les crawls. Temps serveur visé : plancher Worker + lecture R2, soit 0,10 à 0,25 s, au lieu d'une médiane de 0,40 s avec une queue à 1,5-3 s. Les « slow page » Ahrefs portent majoritairement sur ces fiches : la quasi-totalité devrait sortir du seuil.
- **Pages déjà `HIT` (blog, parcours, pages statiques)** : économie du chargement du serveur Next, surtout à froid.
- **Base Neon / Hyperdrive** : environ un rendu complet en moins par visite de robot sur les fiches. Seule subsiste la revalidation réelle (1 par fiche et par jour, 1 par 5 min pour les fiches dont le `revalidate` effectif est 300).
- **Aucun gain** sur `/vannes`, `/conseils`, `/videos`, `/abonnement` (dynamiques) ni sur l'accueil (le chemin `/` est normalisé en `""` par l'intercepteur et n'est pas reconnu : passage au serveur Next comme aujourd'hui, toujours en `HIT` grâce au manifeste).

## 6. Risques

| Risque | Analyse | Niveau |
|---|---|---|
| **Page personnalisée (connectée) servie depuis le cache** | Seules les routes du prerender-manifest sont interceptées. `/abonnement` (`force-dynamic`), `/profil`, `/favoris`, `/carnet`, `/blog/apercu`, `/onboarding`, les API et les listes à `searchParams` n'y figurent pas. Les routes interceptées servent **déjà** aujourd'hui le même HTML ISR à tout le monde (Next ignore les cookies sur un hit ISR) ; la personnalisation des parcours se fait côté client (relecture de l'API). Le middleware (`withAuth`) s'exécute **avant** l'intercepteur. Les cookies d'aperçu Next (`__prerender_bypass`) et les Server Actions (`next-action`) contournent l'intercepteur. Aucun nouveau HTML personnalisé n'entre en cache. | Exclu |
| Contenu du jour figé | `blague-du-jour` (600 s), accueil (60 s), `liens` (300 s) : obsolescence calculée sur le `revalidate` de l'entrée ; la revalidation part comme avant (memory-queue). Accueil non intercepté. | Faible |
| Revalidation ISR cassée (type s14) | File inchangée (même memory-queue, même `WORKER_SELF_REFERENCE`), seulement passée en `waitUntil` (limite de 30 s après réponse, contre 10 s de délai de revalidation). Les requêtes de revalidation (`x-prerender-revalidate`) ne sont jamais interceptées. Le filtre anti-`fetch` HTTP (s14) reste devant R2. Cas limite : une entrée sans `revalidate` hors manifeste serait considérée valide 1 an ; impossible ici, car chaque fiche est réécrite à l'exécution avec son `revalidate` (nouvelles clés R2 à chaque build). | Faible |
| `sitemap.xml`, `llms.txt`, `llms-full.txt`, images OG | Routes `route` interceptées : corps et `content-type` relus depuis `meta.headers` (base64 pour le binaire). L'en-tête `cache-control` peut changer (sans effet : rien n'est mis en cache par le CDN devant le Worker). | Faible, à vérifier |
| Fiches retirées (308 sans `Location`) | Le 308 mis en cache est renvoyé par l'intercepteur avec son HTML ; `restoreRedirectLocation` (`cloudflare/worker.ts`) reconstruit `Location` comme avant. | Faible, à vérifier |
| Navigation client (RSC) | Une requête `RSC: 1` reçoit le flux `rsc` de l'entrée (`text/x-component`), avec le même `Vary`. | Faible, à vérifier |
| Outils qui lisent `x-nextjs-cache` | Sur une réponse interceptée, l'en-tête devient `x-opennext-cache` (HIT/STALE). Aucun code ni test du dépôt ne lit ces en-têtes (seulement des documents d'audit). | Nul |
| Option `dangerous` | Documentée par OpenNext, incompatible seulement avec le PPR (absent en Next 14). | Accepté |

## 7. Vérification post-déploiement

À lancer depuis un poste ou le conteneur, 5 à 10 min après `deploy:cf` (le premier passage réécrit les fiches dans R2 avec le nouveau buildId). Le temps serveur se calcule toujours comme `time_starttransfer - time_pretransfer`.

1. **Interception active** : `curl -sI https://deviens-marrant.fr/conseils/raconter-le-personnage-secondaire-cs14tip525 | grep -iE 'x-opennext-cache|cache-control|content-security-policy'`. Attendu : `x-opennext-cache: HIT` (ou `STALE` une seule fois juste après le déploiement), `cache-control: s-maxage=<proche de 86400 ou 300>`, CSP présente.
2. **Fin du STALE perpétuel** : rejouer l'échantillon (1 URL sur 6 du sitemap, deux passes). Attendu : 0 `STALE` en passe 2 sur les fiches, temps serveur médian ≤ 0,25 s, max < 0,8 s.
3. **Non-régression** :
   - `curl -sI /sitemap.xml` : `content-type: application/xml`, 414 `<loc>` ;
   - `/llms.txt` : `text/plain` ;
   - une image OG de blog : `image/png` lisible ;
   - `curl -s -H 'RSC: 1' <fiche> | head -c 200` : flux RSC ;
   - une fiche retirée : 308 avec `Location` ;
   - un slug inexistant : 404 ;
   - `/abonnement`, `/vannes` : toujours `private, no-store` ;
   - `/profil` sans session : redirection vers `/login`.
4. **Revalidation** : `npx wrangler tail marrant --format pretty --search "Revalidation failed"` pendant 15 min de crawl : aucune ligne attendue. `--search "[isr]"` : aucune ligne.
5. **Base** : tableau de bord Hyperdrive/Neon, nombre de requêtes sur 24 h comparé au 10/10 (baisse attendue).
6. **J+7** : relancer le crawl Ahrefs, comparer « slow page » (185) et « slow server response for AI crawlers » (19).

## 8. Rollback

- **Code** : `npx wrangler rollback <N-1>`, où N-1 est la version en ligne relevée juste avant ce déploiement (au 11/10 15:14 UTC : `67697811-9f53-4857-84ef-16a82eccefba`, à reconfirmer au moment du déploiement). Effet immédiat, sans écriture en base.
- **Source** : retirer `enableCacheInterception: true` et remettre `queue: memoryQueue` dans `apps/web/open-next.config.ts` (ou `git revert` du commit), puis rebuild/deploy.
- R2 : rien à purger (les clés dépendent du buildId).

