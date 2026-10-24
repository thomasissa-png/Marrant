# QA indépendante : widget « La vanne du jour », tour 2 (s22)

Commit audité : `6040311f` (branche `claude/ouverture-session-nzwj0w`), non déployé, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`. Les commits suivants (`ee04e965` à `7dfb7761`) ne touchent que des docs et le test ajouté par cette QA : aucun code exécuté par le site n'a changé.
24/10/2026, @qa. Aucun déploiement, aucune écriture en base ; aucun commit de ma part (`7dfb7761` et `45779077`, qui embarquent mon test et un brouillon de ce rapport, viennent de la session principale). Le rapport @fullstack (`REPLIT_ACTIONS.md`, entrée s22 Widget) n'est pas pris pour preuve : tout est rejoué.
Légende : `[LIVE]` = sortie observée (Worker local `wrangler dev --local`, `next start`, Chromium réel) ; `[STATIQUE]` = Jest, tsc, lecture de code, calcul sur la config.

## Verdict

**NO-GO à la publication, pour un seul point bloquant : V1, la carte à moitié vide sur ordinateur** (hauteur fixe de 504 px). @design (revue tour 2) conclut aussi « non acceptable » : à trancher par @design, puis la version retenue repasse les mesures de décalage et de lien de marque ci-dessous.
Un point majeur, à lever avant la mise en ligne : V2, la garantie « aucune IP de visiteur chez Umami » dépend de l'hébergement d'Umami.
Tout le reste est au niveau : B1, B2 et M1 du tour 1 sont corrigés et prouvés, m1 à m4 et m6 à m8 aussi, m5 à moitié (doc interne). Sécurité PASS, non-régression PASS, liste blanche exacte.
Déployé inerte (`false`), le code ne change rien au site : un déploiement inerte reste sans risque (décision de Thomas).

## Défauts du tour 1, rejoués

| Défaut | État | Preuve |
|---|---|---|
| B1 décalage de page (format script) | CORRIGÉ | `[LIVE]` banc hôte cross-origin, gabarits officiels (`widgetIframeSnippet`, `widgetScriptSnippet`), vraies vannes de la liste (la plus courte `cs19jkboulot5`, la plus longue `cs18jkstory5v4`, une médiane). 37 scénarios : 1280, 768, 375, 320 px × hôte clair et sombre × iframe seule et script × vanne courte et longue, plus thème `sombre` sur OS clair et médiane. **CLS 0 avant et après le clic dans les 37.** Seul mouvement : script, 320 px, vanne la plus longue, l'iframe passe de 504 à 551 px APRÈS le clic (0,0034 marqué `hadRecentInput`, hors CLS) |
| B2 lien de marque hors cadre | CORRIGÉ | `[LIVE]` « Deviens Marrant » dans le cadre visible dans les 37 scénarios, avant et après révélation, y compris iframe de 288 px (hôte de 320 px, marges 16 px) avec la vanne la plus longue |
| M1 retrait d'urgence inopérant | CORRIGÉ `[STATIQUE]` | clé du cache edge = jour UTC + empreinte FNV-1a de `WIDGET_JOKE_IDS` et des catégories exclues ; l'ancien `it.failing` est un test normal vert. Pas de base locale : non rejouable en vrai |
| m1 règle `/embed/:path*` trop large | CORRIGÉ | `[LIVE]` `/embed/inconnu` et `/embed` : 404, `X-Frame-Options: DENY` + CSP du site ; `/embed/` et `/embed/vanne-du-jour/` : 308 |
| m2 point final | CORRIGÉ `[STATIQUE]` | points finaux retirés dans `hostFromHeader` et `matchesDomaine` (Jest) |
| m3 jour Paris / UTC | CORRIGÉ `[STATIQUE]` | `widgetDateKey` = jour UTC, comme `/api/daily` |
| m4 repli en 503 | CORRIGÉ | `[LIVE]` iframe en 200 avec repli ; API en 503 + `Retry-After: 3600` |
| m5 contrat d'API / spec @seo | À MOITIÉ | page du programme alignée sur le code (« Champs : type, date, amorce, chute, url, attribution, license ») ; `docs/seo/widget-replique-du-jour-s22-seo.md` §4 annonce toujours `setup/punchline/slug/category` et un `ETag`. Voir m-a |
| m6 coins sur hôte sombre | CORRIGÉ | `[LIVE]` capture hôte sombre, OS clair, thème `sombre` : coins arrondis propres |
| m7 `nosniff` de `/widget.js` | CORRIGÉ | `[LIVE]` `x-content-type-options: nosniff`, `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`, 1 243 octets (727 gzip) |
| m8 `referrerpolicy` imposé | CORRIGÉ `[STATIQUE]` | plus aucun `referrerpolicy` dans `widget.js` ni dans les gabarits |

## Contrôles

| # | Contrôle | Statut | Preuve |
|---|---|---|---|
| 1 | En-têtes de toutes les routes hors `/embed/vanne-du-jour` identiques à `27caee2e` | PASS | `[STATIQUE]` en-têtes effectifs calculés avec le compilateur de règles de Next (`buildCustomRoute`) et la correspondance d'OpenNext (`new RegExp(regex)`, sensible à la casse), config de `27caee2e` contre `6040311f`, 130 routes de `src/app` des deux commits + 20 chemins limites : 146 identiques, 4 différents, tous attendus (`/embed/vanne-du-jour`, `/integrer-la-vanne-du-jour`, et leurs variantes à barre finale, qui partent en 308). `[LIVE]` Worker : 137 routes interrogées, en-têtes servis comparés aux en-têtes attendus de `27caee2e` (8 en-têtes) : 128 identiques ; les 9 écarts sont préexistants ou attendus (redirections 307 du middleware sans en-têtes : `/abonnement`, `/abonnement/success`, `/favoris`, `/onboarding`, `/profil`, déjà notées au tour 1 ; `X-Robots-Tag` posé par la route elle-même : `/api/widget/v1/vanne-du-jour`, `/blog/apercu/x` ; fichiers servis par la couche assets : `/widget.js`, `/favicon.ico`) |
| 2 | `/embed/inconnu` non encadrable | PASS | `[LIVE]` 404, `X-Frame-Options: DENY`, CSP du site (`frame-ancestors` absent, XFO prime) |
| 3 | CSP de l'embed juste | PASS | `[LIVE]` `default-src 'none'; script-src 'sha256-i6O6…R4pg='; style-src 'unsafe-inline'; img-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors *` ; un seul `<script>` dans la réponse, son sha256 = celui de la CSP ; 0 violation CSP dans Chromium |
| 4 | XSS (Referer, `?theme=`, contenu) | PASS | `[LIVE]` Worker : Referer `https://"><script>alert(1)</script>.evil/` + `?theme="><svg onload=alert(1)>` : 0 écho ; Referer `javascript:` + `theme=sombre'` : `t-auto`. Banc Chromium, vanne piégée (`<img onerror>`, `<svg onload>`, `&#x3C;script&#x3E;`, `</script><script>`, `<math><mtext>`, `"onmouseover="` dans le chemin) : 0 dialogue, 0 `img/svg/math`, 1 script, attribut `onmouseover` absent |
| 5 | noindex | PASS | `[LIVE]` `x-robots-tag: noindex` (embed et API) + `<meta name="robots" content="noindex">` dans l'iframe |
| 6 | Zéro cookie | PASS | `[LIVE]` 0 `Set-Cookie` sur `/embed/vanne-du-jour` (deux thèmes), l'API, `/widget.js` |
| 7 | Méthodes, CORS | PASS | `[LIVE]` OPTIONS API 204 ; POST API, POST et DELETE embed : 405 |
| 8 | Interrupteur `false` | PASS | `[LIVE]` page du programme 404, absente du sitemap, API 503, iframe en repli 200 (titre et marque seulement, aucune phrase) |
| 9 | Interrupteur `true` (local, `npm run build` + `next start`) | PASS | `[LIVE]` page du programme 200, 1 H1, canonical propre, sans noindex, dans le sitemap, CSP `frame-src 'self' …`, deux aperçus réels chargés (repli : pas de base), gabarit B avec `min-height:504px`, 0 tiret cadratin, 0 erreur console ; axe-core WCAG 2.2 AA : 0 violation à 1280 et 375. Remis à `false`, `git diff` de `src/config` : 0 ligne, `.next` et `.open-next` reconstruits en `false` |
| 10 | Accessibilité de l'iframe | PASS | `[LIVE]` axe-core 0 violation, avant et après révélation, clair et sombre, 1280 et 375 (un `color-contrast` relevé pendant le fondu de 0,3 s disparaît après 800 ms et avec `reduced-motion` : artefact de mesure) ; clavier depuis l'hôte : bouton, Entrée, `aria-expanded=true`, focus sur la chute, puis fiche, marque, sortie vers l'hôte, pas de piège |
| 11 | Liste blanche | PASS | `[STATIQUE]` 93 identifiants, 93 uniques, `diff` avec le bloc de `selection-finale.md` vide ; 93/93 parmi les 114 candidates de `widget-candidats-s22.md` : ABSURDE 7, AUTODERISION 10, BOULOT 21, CULTUREL 9, ECOLE 4, GAMING 3, OBSERVATIONNEL 5, PARENTS 15, RESEAUX_SOCIAUX 9, SITUATION 10 ; 0 DATING/SOIREES/COUPLE ; les 8 désaccords absents |
| 12 | Mesure `mesure.ts` | PASS code, voir V2 | voir section « Mesure » |
| 13 | Hauteur fixe 504 px | **FAIL** | voir V1 |
| 14 | Runtime Cloudflare | PASS | `[LIVE]` `build:cf` code 0 ; `wrangler dev --local` avec l'entrée du dépôt plante toujours (`Incorrect type for map entry 'IMMUTABLE_CACHE_CONTROL'`, préexistant) ; contournement : entrée et config dans le scratchpad, mêmes liaisons. Aucune commande de publication lancée |
| 15 | Chaîne sous `env -i` | PASS | voir section « Chaîne » |

## Mesure des affichages (`src/lib/widget/mesure.ts`)

- **Contenu envoyé** `[STATIQUE]` (8 tests ajoutés, chemin Workers simulé) : un POST vers `https://cloud.umami.is/api/send`, en-têtes exactement `Content-Type` et le User-Agent fixe, corps `{ website, hostname: <domaine>, url: "/embed/vanne-du-jour", language: "fr", name: "widget-affichage", data: { domaine, theme } }`. Avec un Referer `https://www.blog-hote.fr/articles/ma-page-privee?email=…`, un User-Agent iPhone, `X-Forwarded-For`, `CF-Connecting-IP` et un cookie dans la requête du visiteur : rien de tout cela dans l'envoi (domaine seul, sans `www.`, sans chemin ni paramètre). Sans Referer : `inconnu`.
- **Jamais bloquant** : envoi confié à `ctx.waitUntil`, non attendu ; avec un Umami qui ne répond jamais, la page part quand même (< 500 ms dans le test). Délai `AbortSignal.timeout(5000)` : Umami lent, l'envoi est abandonné et vaut `false`. Umami en panne (erreur réseau, 500, 403, 429) : `false`, aucune exception, 0 appel à `console.*` (aucun journal, donc aucun secret journalisé). Hors contexte de requête Workers : rien, sans exception.
- **Pas d'envoi** : `deviens-marrant.fr` et `www.` (aperçu), `localhost`, `127.0.0.1`, `*.workers.dev`, User-Agent absent, Googlebot, `facebookexternalhit`, identifiant Umami absent ou factice. Un affichage n'est compté que si la vanne est servie (ni repli, ni domaine bloqué).
- **User-Agent fixe** : accepté aujourd'hui. `[STATIQUE]` `isbot` 5.2.2 (bibliothèque de filtrage des robots utilisée par Umami, de mémoire, non relu dans leur code) renvoie `false` pour cette chaîne, et le filtre du widget aussi. Fiabilité limitée : un filtre plus strict côté Umami Cloud écarterait l'événement avec une réponse OK (perte silencieuse) ; et tous les affichages partagent une même session Umami (même IP de sortie, même navigateur), sur le site Umami principal (avis @reviewer N7 confirmé à la lecture). Mieux : **Cloudflare Workers Analytics Engine** (liaison du Worker, `writeDataPoint` avec le domaine et le thème) : aucun tiers, aucun User-Agent à imiter, aucune question d'IP, statistiques du site non mêlées, quota Umami intact [À VÉRIFIER : disponibilité et quota sur l'offre Workers de Thomas]. À défaut : un site Umami dédié au widget.
- **IP du visiteur** : voir V2.

## Défauts restants

### Bloquant (publication)

- **V1. Carte à moitié vide sur ordinateur.** `apps/web/src/config/widget-vanne-du-jour.ts` (`WIDGET_IFRAME_HEIGHT = 504`) et `embed-html.ts` (pied ancré en bas, vide entre la vanne et le pied). Mesure `[LIVE]` sur les 93 vannes, chute révélée : carte de 640 px de large (ordinateur, tablette), vide entre la vanne et le pied de **181 à 293 px, médiane 265 px (53 % de la carte), 84 vannes sur 93 au-delà de 250 px** ; à 343 px (téléphone) médiane 217 px ; à 288 px médiane 145 px. Capture : carte de 504 px avec deux lignes de texte en haut et un grand rectangle blanc, lu comme un bloc cassé (critères PRO, AÉRÉ, CONVERSION). Défaut d'usage réel : l'hôte cède 504 px d'article pour deux lignes, sur l'aperçu même de la page du programme. La réserve est dictée par une seule vanne (`cs18jkstory5v4`, 195/111 caractères, déjà hors de la limite éditoriale de @design) dans l'iframe la plus étroite. Hauteurs nécessaires mesurées (titre, amorce, chute, pied) : 640 px de large, 319 max et 235 en médiane ; 320 px, 495 max ; 288 px, 551 max. **Sans les 6 vannes hors limite éditoriale** (`selection-finale.md`) : 263 à 640 px, 383 à 320 px, 411 à 288 px. Pistes pour @design (choix de forme, pas de QA) : retirer ces 6 vannes de la liste et réserver environ 392 px ; ou centrer verticalement la vanne dans la carte ; ou une hauteur réservée par le format script selon la largeur du conteneur, mesurée AVANT insertion (le gabarit A reste fixe). La version retenue repasse le banc de CLS et de lien de marque (scripts dans le scratchpad, voir « Tests »).

### Majeur

- **V2. IP du visiteur chez Umami : protégée aujourd'hui par un fait extérieur, pas par le code.** `mesure.ts:58-63`. La doc Cloudflare (en-têtes HTTP, sous-requêtes de Workers) : vers une destination HORS Cloudflare, `CF-Connecting-IP` et `x-real-ip` portent l'IP du visiteur ; vers une autre zone Cloudflare, `CF-Connecting-IP` vaut l'adresse fixe `2a06:98c0:3600::103`. Vérifié `[LIVE]` le 24/10 : `cloud.umami.is` résout en `104.26.0.192`, `104.26.1.192`, `172.67.70.186` (plages Cloudflare) et répond `server: cloudflare` + `cf-ray` (origine Vercel derrière) : on est dans le cas « autre zone Cloudflare », l'IP du visiteur n'est pas transmise dans `CF-Connecting-IP`. Restent non prouvés : le sort de `x-real-ip` dans ce cas (la doc ne le dit pas) et la stabilité (si Umami quitte Cloudflare, l'IP part sans changement de notre code). Le texte « ni IP ni navigateur du visiteur transmis » de `REPLIT_ACTIONS.md` et la phrase de confidentialité proposée ne peuvent pas reposer là-dessus. **Correction** : Workers Analytics Engine (supprime la question), ou poser explicitement `x-real-ip` à une valeur neutre dans l'envoi (la doc dit cet en-tête modifiable par le script) ET faire l'affichage de test de la procédure (étape 7) en regardant le pays et la ville de la session Umami ; @legal revalide la phrase après coup. Rejoint @reviewer N1.

### Mineurs

- **m-a (m5 du tour 1).** Spec @seo §4 non mise à jour (`setup/punchline/slug/category`, `ETag`) : la page publique est juste, la spec interne trompe le prochain agent. Mettre la spec au niveau du code.
- **m-b. Anneau de focus du bouton rogné sur les côtés** `[STATIQUE]` : `.k{overflow-y:auto}` force aussi `overflow-x` à `auto`, et `#b` fait 100 % de la largeur avec `outline-offset:2px` : les 4 px latéraux de l'anneau sont coupés. Relevé par @design (revue tour 2), confirmé à la lecture du CSS. Correction : `outline-offset:-2px` sur `#b`, ou 4 px de marge intérieure dans `.k`.
- **m-c. Iframe seule de 288 px, vanne la plus longue** : après révélation, la zone défile et le haut de l'amorce (et le titre) passe sous la bande du haut (capture `iframe-clair-auto-longue-320-apres.png`). Disparaît si V1 retire les 6 vannes hors limite.
- **m-d. Quota et propriétés Umami** : un affichage enregistre l'événement plus ses propriétés `domaine` et `theme`, comptées une à une par Umami Cloud selon sa FAQ (@reviewer N2) [À VÉRIFIER] ; quota partagé avec la mesure du site entier : un widget à succès peut épuiser le quota du site. Retirer `data.theme` (et `data.domaine`, déjà dans `hostname`), ou V2 par Analytics Engine.
- **m-e. Sous `next start` seulement** : Next compare les chemins sans tenir compte de la casse, donc `/EMBED/vanne-du-jour` y reçoit les en-têtes encadrables (page 404). Sans effet en production (OpenNext compare en tenant compte de la casse, prouvé ci-dessus). Pour mémoire.

### Hors périmètre widget (préexistants, déjà signalés au tour 1)

- `wrangler dev` local avec l'entrée du dépôt : `cloudflare/worker.ts` exporte des valeurs non-handler (`IMMUTABLE_CACHE_CONTROL`, `CRON_ROUTES`, fonctions). @fullstack : les déplacer dans un module à part.
- Redirections 307 du middleware sans en-têtes de sécurité sous Worker.

## Tests ajoutés

- `apps/web/src/__tests__/lib/widget-mesure-qa-s22.test.ts` (Jest, 8 tests, déjà commité par la session principale dans `7dfb7761`) : chemin Workers de la mesure, que les tests @fullstack ne couvrent pas (ils restent hors Workers) : contenu exact de l'envoi et absence de toute donnée du visiteur, réponse non retardée par un Umami muet, délai de 5 s, pannes avalées sans journal, exclusions (aperçu, local, robots, identifiant factice), `inconnu` sans Referer.
- Bancs hors dépôt (scratchpad de session, `/tmp/claude-0/-home-user-Marrant/5d6d1c1e-57ce-52c7-8f39-4aea23f0efcf/scratchpad/`) : `v2-harness.js` (hôte 4411, widget 4412 avec les en-têtes réels de next.config), `v2-cls.js` (37 scénarios), `v2-vide.js` et `v2-hreq.js` (93 vannes), `v2-axe.js`, `v2-kbd.js`, `v2-xss.js`, `hdr/compare.js` et `hdr/live.js` (en-têtes contre `27caee2e`). Captures : dossier `v2shots/` du même scratchpad.

## Chaîne

Sous `env -i` (variables factices du brief ; proxy et CA ajoutés seulement pour les builds ; chaîne Hyperdrive factice pour `build:cf` et `wrangler dev`), interrupteur à `false` :
- `tsc --noEmit -p tsconfig.build.json` : 0 erreur ; `tsc --noEmit` (config complète) : 0 ; `tsc -p ../../playwright/tsconfig.json` : 0 ; `next lint` : 0 avertissement.
- Jest complet sans secret Stripe : 359 suites, 5 459 tests PASS, 5 ignorés (préexistants), test QA compris.
- `npm run build` : OK (trois fois : `false`, `true` local, `false` final). `build:cf` : OK.
- e2e `playwright/tests/local/widget-hote-s22.spec.ts` contre le Worker local (`E2E_BASE_URL=http://127.0.0.1:8787`, `E2E_CHROMIUM_PATH` vers le Chromium installé : le navigateur attendu par la version de Playwright du dépôt est absent de cette machine) : 3/3 PASS `[LIVE]`.
- État final : arbre propre hormis ce rapport ; `src/config` sans diff ; serveurs locaux arrêtés.

## Limites

- Aucune vanne servie par le vrai Worker (pas de base locale) : rendu avec vanne testé sur banc (HTML de `renderEmbedVanne`, en-têtes exacts de next.config), repli sur le vrai Worker. Cache edge, envoi Umami réel, règle WAF et `Retry-After` du 429 : non vérifiables hors Cloudflare.
- Chromium seul (ni WebKit ni Firefox).
