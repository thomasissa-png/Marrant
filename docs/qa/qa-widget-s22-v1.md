# QA indépendante : widget « La vanne du jour » V1 (s22)

Commit audité : `89a97648` (branche `claude/ouverture-session-nzwj0w`), non déployé, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`.
Pendant la QA, la branche a avancé jusqu'à `5cf15de1` : seul `apps/web/scripts/widget/exporter-candidats-widget.ts` (script hors ligne) a changé côté code, rien dans le code exécuté par le site. Le verdict vaut donc aussi pour `5cf15de1`.
24/10/2026, @qa. Aucun déploiement, aucune écriture en base, aucun commit. Tests existants non pris pour preuve : tout est revérifié.

## Verdict

**NO-GO à la publication** (passage de l'interrupteur à `true`) : 2 défauts bloquants côté hôte (décalage de mise en page du format script, lien de marque masqué dans le format iframe) et 1 majeur (retrait d'urgence d'une vanne inopérant le jour même).
**Sécurité : PASS.** Déployé inerte (`false`), le code ne change rien au site : en-têtes identiques sur les 140 autres routes, API en 503, page en 404, iframe neutre. Un déploiement inerte n'est pas risqué ; la décision appartient à Thomas.

Légende : `[LIVE]` = sortie observée (Worker local `wrangler dev`, navigateur Chromium réel) ; `[STATIQUE]` = Jest, tsc, lecture de code.

## Contrôles

| # | Contrôle | Statut | Preuve |
|---|---|---|---|
| 1 | Seul `/embed/*` encadrable, autres routes inchangées vs `27caee2e` | PASS | `[STATIQUE]` comparaison des en-têtes effectifs (matcher Next `getPathMatch`) ancienne et nouvelle config sur les 146 routes de `src/app` + 17 chemins limites : 140 identiques, 6 différents, tous attendus (`/embed*`, `/integrer-la-vanne-du-jour` CSP + `'self'` en frame-src). `[LIVE]` Worker : `/`, `/a-propos`, `/vannes`, `/blague-du-jour`, `/api/daily`, `/api/widget/v1/vanne-du-jour`, `/login`, `/blog`, `/embedded`, `/integrer-la-vanne-du-jour`, `/lettre/confirmer` : « en-têtes identiques à 27caee2e » (7 en-têtes comparés valeur par valeur) |
| 2 | OpenNext applique `headers()` de next.config | PASS | `[LIVE]` `curl -I` Worker : `/embed/vanne-du-jour` sans `x-frame-options`, `content-security-policy: default-src 'none'; script-src 'sha256-…'; … frame-ancestors *`, `x-robots-tag: noindex`, HSTS, nosniff ; `/` avec `x-frame-options: DENY` et CSP du site |
| 3 | `_headers` appliqué à l'asset `/widget.js` | PASS | `[LIVE]` `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`, `Content-Type: text/javascript`, 1 075 octets (632 gzip). Voir m7 |
| 4 | Empreinte CSP du script en ligne juste | PASS | `[LIVE]` sha256 du seul `<script>` de la réponse Worker présent dans la CSP servie (`hashOK=true`) ; dans Chromium, la classe `js` est posée (script exécuté) chez un hôte cross-origin, 0 violation |
| 5 | Rien d'autre ne se charge dans l'iframe | PASS | `[LIVE]` requêtes d'une page hôte : page, `/widget.js`, `/embed/vanne-du-jour`, rien d'autre (ni police, ni Umami, ni image) |
| 6 | XSS via Referer, paramètre `theme`, contenu de la vanne | PASS | `[LIVE]` Referer `"><script>alert(1)</script>` et `javascript:` + `?theme="><svg onload>` : aucun écho, classe `t-auto`. `[LIVE]` banc navigateur, vanne piégée (`<img onerror>`, `<svg onload>`, `&#x3C;script&#x3E;`, `</script><script>`, `<math><mtext>`, `" onmouseover="`) : 0 dialogue, 0 `img/svg/math` dans le DOM, 1 seul script. `[STATIQUE]` 6 vecteurs en Jest |
| 7 | Aucun cookie | PASS | `[LIVE]` aucun `Set-Cookie` sur `/embed/*` (y compris 403/503) ; `context.cookies()` vide après chargement chez l'hôte |
| 8 | `X-Robots-Tag: noindex` (embed et API) ; `/embed/` absent de robots.txt | PASS | `[LIVE]` en-têtes + `<meta name="robots" content="noindex">` ; robots.txt sans `/embed/` (conforme à la spec @seo), sans canonical dans l'embed |
| 9 | Interrupteur `false` | PASS | `[LIVE]` page du programme 404, absente de `sitemap.xml`, API 503 `{"type":"vanne","error":"indisponible"}` + `Retry-After: 3600`, iframe 503 repli « La vanne du jour revient très vite. » |
| 10 | Interrupteur `true` (local, rebuild `build:cf`) | PASS | `[LIVE]` page 200, 1 H1, canonical propre, pas de meta noindex, dans le sitemap ; aperçu réel chargé dans la page (CSP `frame-src 'self'`) ; API/iframe en 503 tant que `WIDGET_JOKE_IDS` est vide. Remis à `false`, `git diff` vide sur `src/config/` |
| 11 | Liste blanche, DATING/SOIREES/COUPLE refusées | PASS | `[STATIQUE]` filtre SQL `notIn` + double garde ; test ajouté avec une base simulée qui IGNORE le filtre : jamais de catégorie exclue sur 3 jours. Valeurs vérifiées dans l'enum `JokeCategory` |
| 12 | Aucun champ interdit dans l'API | PASS | `[STATIQUE]` base simulée renvoyant décryptage, technique, vidéo, verdict, `isPremium` : réponse = exactement 7 clés (`type, date, amorce, chute, url, attribution, license`) |
| 13 | Déterminisme du jour | PASS (voir m3) | `[STATIQUE]` minuit **Paris** (`2026-10-24T22:00Z` → `2026-10-25`), tri par id, rang du jour modulo le pool. Le site (`/api/daily`, `todayUTC`) bascule à minuit **UTC** |
| 14 | 403 domaine bloqué, sous-domaines | PASS (voir m2) | `[STATIQUE]` `a.b.exemple.fr` bloqué ; `evilexemple.fr`, `exemple.fr.evil.com` non bloqués ; `exemple.fr.` contourne |
| 15 | CORS, méthodes, cache | PASS | `[LIVE]` OPTIONS 204 `Access-Control-Allow-Origin: *`, `GET, OPTIONS` ; POST/PUT/DELETE 405 ; 503 en `public, max-age=60` |
| 16 | `widget.js` : taille, hôte simple, plusieurs widgets, CSP stricte, message usurpé | PASS | `[LIVE]` 1 075 octets ; iframe insérée à la place du script ; 3 widgets dans 3 conteneurs, ouverture indépendante ; hôte `default-src 'none'; style-src 'self'` : rendu sans violation ; `postMessage` usurpé par l'hôte : hauteur inchangée (240) |
| 17 | Accessibilité | PASS | `[LIVE]` `title` de l'iframe présent ; bouton atteint au Tab depuis l'hôte, Entrée révèle, `aria-expanded=true`, focus sur la chute ; anneau de focus visible ; axe-core WCAG 2.2 AA : 0 violation (clair, sombre, vanne longue, repli, page du programme). Contrastes mesurés : texte 16,48:1 / 19,44:1, lien 6,06:1 / 7,10:1, marque 7,86:1 / 8,86:1, bouton 7,10:1 |
| 18 | Hôte sombre | PASS (voir m6) | `[LIVE]` carte lisible dans les 4 combinaisons thème/OS ; coins blancs carrés quand l'OS est clair (capture `qa-hote-sombre-normale-light.png`) |
| 19 | Core Web Vitals de l'hôte (hauteur réservée, pas de décalage) | **FAIL** | `[LIVE]` format script : décalage sans interaction **0,094** à 1 280 px et **0,309** à 375 px (seuil « mauvais » 0,25), +0,061 si la vanne est longue (agrandissement au chargement). Format iframe : 0 décalage. Voir B1 |
| 20 | Lien de marque toujours présent et visible | **FAIL** | `[LIVE]` présent partout, `rel="noopener"`, `target="_blank"`, ancre exacte « Deviens Marrant », UTM `widget / embed / vanne-du-jour / <domaine hôte>` (`inconnu` sans Referer). Mais format iframe (240 px fixes) : contenu 258 px à 375 px après révélation d'une vanne courte, 336 px avant révélation d'une vanne longue : **lien de marque hors champ** (capture `qa-longue-iframe-375.png`). Voir B2 |
| 21 | Chaîne sous `env -i` | PASS | voir section « Chaîne » |

## Défauts

### Bloquants (publication)

- **B1. Le format script (B) décale la page de l'hôte.** `apps/web/src/config/widget-vanne-du-jour.ts:82` (gabarit `<script async>` seul) et `apps/web/public/widget.js:13-14` (iframe de 240 px insérée après le premier rendu, rien de réservé). Mesure ci-dessus (contrôle 19). La capture @fullstack `hote-apres-revelation-375.png` affirme « la hauteur réservée évite que ce paragraphe saute » : faux pour ce format. **Correction** : gabarit B = conteneur réservé, par ex. `<div class="dm-vanne" style="min-height:240px"><script async src="…/widget.js"></script></div>`, ou `widget.js` qui remplit un `<div data-dm-vanne style="height:240px">` ; et ne pas agrandir l'iframe au chargement (seulement après le clic).
- **B2. Format iframe (A) : le lien de marque sort du cadre.** `apps/web/src/lib/widget/embed-html.ts:146` (lien en bas du document) avec `WIDGET_IFRAME_HEIGHT = 240` (`widget-vanne-du-jour.ts:52`) et aucun script d'agrandissement dans ce format. Contredit la décision 4 (lien « visible ») et la licence (« laisse-le en place et visible »). **Correction** : placer « Deviens Marrant » dans la ligne de titre (toujours dans les 40 premiers px), ou réserver une hauteur calculée sur la vanne la plus longue de la liste blanche à 320 px de large (test à ajouter à la constitution de la liste), avec défilement interne pour la chute.

### Majeurs

- **M1. Retrait d'urgence d'une vanne inopérant jusqu'à minuit.** `apps/web/src/lib/widget/vanne-du-jour.ts:132` : clé de cache = jour seulement. `caches.default` survit aux déploiements : une vanne retirée de `WIDGET_JOKE_IDS` (ou passée hors `GARDER`) reste servie par chaque point de présence qui l'a en cache jusqu'à minuit Paris. Seul l'interrupteur `false` coupe tout. Prouvé par un test `it.failing`. **Correction** : ajouter à la clé une empreinte de la liste blanche (ex. sha256 de `WIDGET_JOKE_IDS.join(",")`, 8 caractères) ; documenter dans `REPLIT_ACTIONS.md` que le retrait d'une vanne = liste corrigée + déploiement.

### Mineurs

- **m1. Règle `/embed/:path*` plus large que la route.** `next.config.js:134` et `:149`. `/embed/<inconnu>` sert la page 404 du site encadrable (`frame-ancestors *`, sans X-Frame-Options) avec ses scripts bloqués ; `/embed` reçoit à la fois `X-Frame-Options: DENY` et `frame-ancestors *` ; `/embed/` (308) part sans aucun en-tête de sécurité `[LIVE]`. **Correction** : `source: "/embed/vanne-du-jour"` et règle générale `/((?!embed/vanne-du-jour$).*)`.
- **m2. Contournement du blocage par point final.** `vanne-du-jour.ts:163` : `https://exemple.fr./` donne `exemple.fr.`, non bloqué (`it.failing`). **Correction** : `.replace(/\.$/, "")`. (Rappel : `referrerpolicy="no-referrer"` contourne de toute façon ; limite documentée.)
- **m3. Jour du widget (Paris) différent du jour du site (UTC)** : de 00:00 à 02:00 (été) le champ `date` du widget a un jour d'avance sur `/blague-du-jour` ; la spec @seo §4 dit « clé = date UTC ». Arbitrage @product-manager, puis aligner code ou doc.
- **m4. Repli servi en 503** (`apps/web/src/app/embed/vanne-du-jour/route.ts:33,36,39`) : chaque page hôte affiche une erreur console tant que la liste est vide ou l'interrupteur fermé (Lighthouse « Best Practices »). **Correction** : repli en 200 (déjà noindex, `private`), garder 503 pour l'API.
- **m5. Contrat d'API différent de la spec @seo §4** (`setup/punchline/slug/category`, `stale-while-revalidate`, `ETag` prévus ; livrés : `amorce/chute`, sans slug ni catégorie, ni ETag). Trancher et aligner la doc publique avant publication.
- **m6. Coins blancs carrés sur hôte sombre** quand l'OS est clair (fond opaque de l'iframe, `embed-html.ts:37-39`). **Correction** : `color-scheme` déclaré dans l'iframe ou `border-radius` à 0 sur `main`.
- **m7. Le test `widget-headers-s22.test.ts:42` annonce pour `/widget.js` les en-têtes de next.config** ; en réalité la couche assets ne sert que `Cache-Control` et `ETag` (pas de `nosniff`). Sans risque (type MIME juste), mais le test trompe. **Correction** : retirer `/widget.js` de la liste ou ajouter `X-Content-Type-Options: nosniff` sous `/widget.js` dans `public/_headers`.
- **m8. Observation @legal** : `referrerpolicy="strict-origin-when-cross-origin"` posé par le widget l'emporte sur un hôte en `no-referrer` (origine de l'hôte transmise malgré son choix). Seulement l'origine, jamais le visiteur.

### Hors périmètre widget (préexistants)

- `wrangler dev` local échoue avec l'entrée du dépôt : `cloudflare/worker.ts` exporte des valeurs non-handler (`IMMUTABLE_CACHE_CONTROL`, `CRON_ROUTES`, fonctions), refusées par workerd local (« Incorrect type for map entry 'IMMUTABLE_CACHE_CONTROL' »). Contournement QA : entrée et config dans le scratchpad, mêmes liaisons, sans toucher au dépôt. À signaler à @fullstack (déplacer ces exports dans un module à part).
- `/abonnement` : la redirection 307 du middleware part sans en-têtes de sécurité sous Worker (sans lien avec s22).

## Tests ajoutés

- `apps/web/src/__tests__/lib/widget-qa-s22.test.ts` (Jest, 18 tests) : 6 vecteurs XSS dans la vanne et la fiche, Referer et thème hostiles, `hostFromHeader` hostile (`javascript:`, `data:`, `null`, port, majuscules, IDN), domaines bloqués aux bornes, double garde des catégories avec base qui ignore le filtre, API à 7 champs exactement, bascule minuit Paris, `widget.js` (< 2 Ko, < 1 Ko gzip, aucune API dangereuse, constantes alignées sur la config, `e.source`, plafond 900). 3 `it.failing` = défauts ouverts B1, M1, m2 : ils cassent à la correction, retirer alors `.failing`.
- `playwright/tests/local/widget-hote-s22.spec.ts` (3 tests, lecture seule) : page hôte simulée sur l'origine testée, vrais `/widget.js` et `/embed/vanne-du-jour` ; en-têtes servis, attributs de l'iframe, script en ligne exécuté sous la CSP réelle, lien de marque et UTM, zéro cookie, 3 widgets, message usurpé, hôte à CSP stricte. `[LIVE]` 3/3 contre le Worker local (`E2E_BASE_URL=http://127.0.0.1:8787`).

## Chaîne

Sous `env -i` (variables factices du brief ; proxy et CA ajoutés seulement pour les builds ; chaîne Hyperdrive factice pour `build:cf` et `wrangler dev`), interrupteur à `false`, nouveaux tests inclus :
- `tsc --noEmit -p tsconfig.build.json` : 0 erreur ; `tsc --noEmit` (config complète, CI) : 0 erreur ; `tsc -p playwright/tsconfig.json` : 0 erreur ; `next lint` : 0 avertissement.
- Jest complet sans secret Stripe : 358 suites, 5 440 tests PASS (5 ignorés, préexistants).
- `npm run build` : OK. `build:cf` : OK trois fois (`false`, `true` local, `false` final : `.open-next` laissé dans l'état `false`).
- `wrangler dev --local` (Worker réel, assets, `_headers`, liaisons locales) : utilisé pour tous les contrôles `[LIVE]`. Aucune commande de publication lancée.
- État final : `git status` = 2 fichiers de test ajoutés + ce rapport + 6 captures `docs/qa/captures-widget-s22/qa-*.png` ; `src/config/widget-vanne-du-jour.ts` sans diff (`PUBLIE = false`).

## Limites de cette QA

- Aucune vanne réelle affichée : pas de base locale et `WIDGET_JOKE_IDS` vide. Le rendu avec vanne a été testé sur un banc (HTML produit par `renderEmbedVanne`, servi avec les en-têtes exacts de next.config pour `/embed/*`), le repli sur le vrai Worker.
- Cache API, limite de 60 requêtes par minute (règle WAF à poser) et `Retry-After` du 429 : non vérifiables hors Cloudflare.
- Chromium seul (pas de WebKit ni Firefox).
