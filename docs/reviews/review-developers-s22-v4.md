# Revue à l'aveugle : page `/developers` (API « vanne du jour »), v4, 24/10/2026

Relecteur : @reviewer. Périmètre : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, captures `docs/qa/captures-developers-s22/` (PC, mobile haut de page, mobile complet), code de l'API (`route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, `lib/fr-typo.ts`) et faits mesurés en production le 24/10/2026. Aucun rapport existant lu. Hors notation (décisions fondateur) : licence, absence de bouton Copy, U+2060 documenté, preflight sans en-têtes autorisés, `<html lang="fr">`.

## Résumé exécutif

La page est juste, complète et lisible. Je n'ai trouvé aucune affirmation fausse qui induise un développeur en erreur, aucun tiret cadratin, aucun nom de concurrent, aucune promesse de disponibilité. Restent trois formulations imprécises (en-têtes « extra », valeurs de cache « près de minuit », champ `type` « toujours » puis « autre valeur ») qu'il vaut mieux corriger avant la soumission à l'annuaire, mais rien ne bloque.

## Verdict : **GO** (9,3/10, zéro bloquant)

| # | Critère | Note | Justification courte |
|---|---|---|---|
| 1 | Exactitude technique | 9/10 | Tout est vérifié dans le code et dans les faits prod (CORS sur 200/403/503/OPTIONS, Cache-Control et son plafonnement, 503 + Retry-After 3600, 403, 429 du CDN sans CORS ni JSON, utm_content Origin puis Referer puis `inconnu`, typographie frTypo). L'exemple de réponse est cohérent avec l'algorithme : jour 20750 modulo 93 = rang 11 de la liste triée = `cmmnsqn16008j…`, d'où le slug `…-cmmnsqn160`. Trois imprécisions (C1, C2, C3), aucune fausse au point de tromper. |
| 2 | Clarté dev anglophone en 20 s | 9/10 | H1 + chapeau donnent gratuit, sans clé, HTTPS, CORS et format en 2 lignes. Anglais naturel. Le paragraphe Endpoint parle du preflight avant de montrer l'URL (O1). |
| 3 | Complétude annuaire | 9/10 | Gratuit, sans clé, sans inscription, HTTPS, CORS, format, limite, erreurs, licence, contact : tout y est. Pas de bloc récapitulatif lisible d'un coup d'œil par un robot (O2). |
| 4 | Exemples curl / fetch | 9,5/10 | `curl -i` montre les en-têtes documentés. `fetch` sûr : nœuds texte via `append` et `textContent`, jamais `innerHTML` ; lien d'attribution présent ; `lang="fr"` ; `try/catch` pour le 429 sans CORS ; contrainte `type="module"` dite. |
| 5 | Règles maison | 10/10 | Grep `[—–]` sur `developers.ts` : 0 occurrence. Zéro concurrent. Rien d'inventé (93 vannes et relecture tout public sourcées dans la config). « No guarantee of availability » dans les conditions ; aucune feuille de route. |
| 6 | SEO de base | 9/10 | Titre 52 caractères, description 141, canonical `/developers`, `og:locale en_US`, `lang="en"` sur le contenu, sitemap (`sitemap.ts:92`), lien interne depuis `/integrer-la-vanne-du-jour` avec `hrefLang="en"`, JSON-LD WebPage + WebAPI. Une propriété hors schéma (O5). |

Note globale : 9,3/10 (moyenne 55,5 / 6).

## Bloquants

Aucun.

## À corriger (avant soumission à l'annuaire, recommandé)

**C1. En-têtes « extra » : la règle est trop large** (`TEXTE_ENDPOINT`). Le preflight n'autorise aucun en-tête, mais seuls les en-têtes hors liste « CORS-safelisted » déclenchent un preflight (`Accept`, par exemple, passe sans problème), et un appel serveur ou curl n'est jamais concerné. Tel quel, la phrase dit qu'un `Accept` ajouté fait échouer la requête, ce qui est faux.
- Actuel : « Send a plain GET with no custom headers: the preflight allows none, so a request with extra headers fails with a CORS error. »
- Proposé : « From the browser, send a plain GET: the preflight allows no request headers, so adding one such as Authorization, X-Requested-With or Content-Type: application/json makes the request fail with a CORS error. Server-side calls are not affected. »

**C2. « Both values shrink to the time left before midnight » est inexact** (`TEXTE_CORS_CACHE`). Code : `max-age = min(300, s-maxage)` et `s-maxage = min(3600, secondes avant minuit)`. À 23:30 UTC, `s-maxage` vaut 1800 mais `max-age` reste à 300. Chaque valeur est plafonnée au temps restant ; elles ne baissent pas toutes les deux.
- Actuel : « Near midnight UTC, both values shrink to the time left before midnight: a cache that follows these headers never serves yesterday's joke. »
- Proposé : « Neither value ever runs past midnight UTC: in the last hour of the day, each one is capped at the seconds left before midnight, so a cache that follows these headers does not serve yesterday's joke. »
(Le « never » absolu tombe aussi : l'arrondi `Math.ceil` laisse jusqu'à 1 s de dépassement.)

**C3. Champ `type` : « Always » contredit la phrase suivante** (`CHAMPS[0]`). « Always "vanne" » suivi de « if you get another value » se contredit. Le code prévoit bien un autre type (`WidgetType = "vanne" | "replique"`), mais la doc ne doit annoncer aucune feuille de route.
- Actuel : « Always "vanne" (French for "joke"). Do not reject the response if you get another value. »
- Proposé : « "vanne" (French for "joke"). Do not reject the response on this field: treat any other value like "vanne". »

## Optionnel

**O1. URL avant le preflight** (`page.tsx:154-158`, `TEXTE_ENDPOINT`). Sur mobile (capture `developers-mobile-endpoint.png`), il faut lire 8 lignes sur OPTIONS et le preflight avant de voir l'URL. Proposé : bloc `GET https://…` juste sous le H2, puis « Send a GET request over HTTPS. No API key, no sign-up, no parameters. » ; déplacer la phrase OPTIONS / preflight (version C1) dans « CORS and caching ».

**O2. Bloc récapitulatif pour l'annuaire et le dev pressé.** Ajouter sous le chapeau une `<dl>` courte : « Auth: none (no API key) · HTTPS: yes · CORS: yes · Format: JSON · Price: free · Rate limit: 10 requests / 10 s per IP ». Le robot y trouve les cinq cases d'un coup ; l'expression « no API key » correspond au vocabulaire des annuaires, mieux que « no key ».

**O3. « fixed set » contredit le retrait possible** (`TEXTE_ROTATION`).
- Actuel : « The rotation is a fixed set of hand-picked jokes, so jokes come back over time. »
- Proposé : « The rotation is a limited set of hand-picked jokes, so jokes come back over time. »

**O4. Erreurs : renvoi et méthodes** (`ERREURS`, `page.tsx:192`). « see License and terms » dans le 403 n'est pas un lien (au contraire des champs, rendus avec `AvecRenvoiLicence`). Proposé : rendre cette description avec le même composant (renvoi « License and terms » vers `#license`). On peut aussi ajouter une ligne `405` : « Any method other than GET, HEAD or OPTIONS. » (vérifier d'abord en production : Next.js génère HEAD et le 405 automatiquement).

**O5. JSON-LD** (`page.tsx:82`). `isAccessibleForFree` n'est pas défini sur `Service`/`WebAPI` dans schema.org (CreativeWork, Event, Offer, Place seulement), ce qui donne un avertissement au validateur. Proposé : le déplacer dans l'`Offer` (`offers: { "@type": "Offer", price: 0, priceCurrency: "EUR", isAccessibleForFree: true }`).

**O6. Rendu** (capture PC, champ `amorce`). Le « ? » de « before : ; ! ? » part seul en début de ligne. Proposé : mettre la liste en `<code>` (« before `:` `;` `!` `?` ») ou écrire « before colons, semicolons, exclamation and question marks ». Sur mobile, le bloc JavaScript passe à la ligne et perd son indentation (`whitespace-pre-wrap`) : `whitespace-pre` + défilement horizontal sur ce seul bloc le rendrait plus lisible.

**O7. IP partagée** (`TEXTE_LIMITE`). Ajout possible après « each visitor counts against their own IP » : « (visitors behind the same network address share the limit) ». À noter : la limite mesurée est comptée par IP et par datacenter Cloudflare ; « per IP address » reste la formulation juste pour un client donné.

## Angles morts (à vérifier, hors texte)

- Le robot de l'annuaire teste l'endpoint depuis un serveur : vérifier que Bot Fight Mode ou un challenge Cloudflare ne renvoie pas un 403 ou une page HTML à un client non navigateur (les en-têtes mesurés le 24/10 viennent d'un appel qui a réussi ; refaire le test depuis une IP de datacenter, user-agent générique).
- `Vary: Origin, Referer` + `s-maxage=3600` : correct pour un cache tiers. Cloudflare ignore `Vary` mais ne met pas en cache cette réponse de Worker par défaut. Si une règle de cache est ajoutée un jour, `utm_content` se mélangerait entre sites.

## Décisions à confirmer par l'utilisateur

Aucune : les trois corrections C1 à C3 sont rédactionnelles et ne touchent ni la licence ni le code.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22-v4.md`
- Décision : **GO**, 9,3/10, zéro bloquant.
- Top 3 : C1 (règle des en-têtes trop large), C2 (plafonnement du cache près de minuit mal décrit), C3 (`type` « Always » contredit la phrase suivante).
- Agent à relancer (facultatif avant soumission) : @copywriter pour C1 à C3 et O1 à O3 dans `config/textes/developers.ts` ; @fullstack pour O4 à O6 dans `page.tsx`. Le texte corrigé repasse une relecture à l'aveugle (règle d'or s18).
---
