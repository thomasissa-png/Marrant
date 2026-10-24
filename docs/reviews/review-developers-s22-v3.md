# Revue à l'aveugle : page `/developers` (API vanne du jour), v3, 24/10/2026

Relecteur : @reviewer. J'ai jugé la page sur le résultat seul, sans ouvrir les rapports précédents de `docs/reviews/`.
Fichiers lus : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, `app/api/widget/v1/vanne-du-jour/route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, `lib/fr-typo.ts`, plus `robots.ts`, `layout.tsx` (racine et `(dashboard)`), `lib/ai/daily-joke-pool.ts` (filtre du pool), `vannes/[slug]/page.tsx` (fiche), `lib/widget/mesure.ts`, `wrangler.jsonc`. J'ai aussi regardé les deux captures.
Hors périmètre, conformément aux décisions du fondateur : texte de licence (TEXTE_LICENCE_*), absence de bouton Copy, documentation de U+2060.

## Verdict : NO-GO (1 bloquant), note globale 9,0/10

Les 6 critères sont notés en fin de rapport. La page est solide : tout ce qu'elle dit du format, du cache, des erreurs 403/503/429, des UTM et de la rotation correspond au code et aux mesures de production. Il reste une affirmation absolue fausse, « the 429 below is the only exception » sur CORS. La grille la classe en bloquant, et une phrase suffit à la corriger. Avec B1, C1, C2 et C3 corrigés, je prévois ≥ 9,3/10 et un GO.

### Résumé exécutif
Un développeur pressé trouve en quelques secondes l'endpoint, l'absence de clé, CORS et un exemple réel. Le robot de l'annuaire peut tester l'endpoint, car `robots.txt` autorise `/api/widget/`. Il reste trois points avant publication : une phrase sur CORS trop absolue, une formulation vie privée qui laisse croire que seule l'IP de l'intégrateur est traitée, et une mise en garde manquante sur les en-têtes personnalisés (le preflight n'en autorise aucun). Rien d'inventé, aucun tiret cadratin, aucun concurrent cité.

## Vérification d'exactitude (affirmation → preuve)

| Affirmation de la page | Verdict | Preuve |
|---|---|---|
| GET + OPTIONS 204 sans corps | Exact | route.ts:70-72 |
| Pas de clé, pas de paramètre | Exact | route.ts:48-57 (aucune lecture de query) |
| `type` toujours "vanne" | Exact | vanne-du-jour.ts:135, route.ts:35 |
| `date` jour UTC AAAA-MM-JJ | Exact | vanne-du-jour.ts:67-69 |
| Apostrophes courbes, « », U+00A0 avant : ; ! ?, U+2060 après le trait d'union | Exact | fr-typo.ts:13-14, 60-62, 77-80, 87-103 ; appliqué vanne-du-jour.ts:137-138 |
| La fiche « explains why it is funny » | Exact | pool = `comedyTechnique: { not: null }` (daily-joke-pool.ts:20), section publique « Pourquoi ça marche » (vannes/[slug]/page.tsx:232) |
| utm_content = Origin puis Referer, minuscules, sans www., sinon « inconnu » | Exact | route.ts:49-50, vanne-du-jour.ts:184-193, 217-222 |
| Ordre des UTM de l'exemple | Exact | widget-vanne-du-jour.ts:116-122 |
| attribution {name,url,required:true} | Exact | widget-vanne-du-jour.ts:125-129 |
| Cache-Control 300 / 3600, les deux raccourcis avant minuit UTC | Exact | route.ts:58-62, vanne-du-jour.ts:72-80 |
| Changement avant minuit si une vanne est retirée | Exact | empreinte de la liste dans la clé de cache (vanne-du-jour.ts:155-157), modulo du pool (l.133) |
| Rotation fixe, retour des vannes | Exact | 93 ids, `dayNumber % eligible.length` |
| 503 + Retry-After: 3600 | Exact | route.ts:42 |
| 403 domaine bloqué via Origin/Referer | Exact | route.ts:49-51 |
| 429 du CDN, sans CORS, corps non JSON, blocage 10 s | Exact | mesure de prod du 24/10 ; doc Cloudflare (code 429 par défaut, durée de mitigation) |
| ACAO `*` sur toutes nos réponses, « the 429 is the only exception » | **Faux** | voir B1 |
| Aucun cookie, pas de suivi des visiteurs | Exact | mesure de prod (aucun Set-Cookie) ; la mesure Analytics Engine ne concerne que l'iframe (mesure.ts:1-5), pas l'API |
| Journaux techniques de l'hébergeur | Exact (prudent) | wrangler.jsonc:82-84 (observability active, échantillonnage par défaut 1 = toutes les requêtes) |
| « 10 requests per 10 seconds per IP » | Exact, simplifié | compteur par IP et par datacenter, mise à jour avec quelques secondes de délai (doc Cloudflare) : voir O3 |

## Corrections

### Bloquant

**B1. Exception CORS présentée comme unique** (`TEXTE_CORS_CACHE`, 1re phrase)
Problème : la phrase affirme que le 429 est la seule réponse sans `Access-Control-Allow-Origin`. C'est faux dans des cas identifiables :
- une méthode autre que GET/OPTIONS reçoit le 405 automatique de Next.js, sans les en-têtes de `CORS_HEADERS` (route.ts n'exporte que GET et OPTIONS) ;
- une erreur du CDN ou du runtime (5xx Cloudflare, exception du Worker) n'en porte pas non plus.
Un dev qui croit à cette exception unique interprète mal une erreur CORS.
- Actuel : « CORS is enabled for every origin: our responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser (the 429 below is the only exception). »
- Proposé : « CORS is enabled for every origin: every GET response from the API (200, 403 and 503) and the OPTIONS preflight carry Access-Control-Allow-Origin: *, so you can call it straight from the browser. Responses generated by our CDN, such as the 429 below, have no CORS header. »

### À corriger

**C1. Vie privée : l'IP traitée n'est pas seulement « la vôtre »** (`TEXTE_VIE_PRIVEE`, 2e phrase)
Problème : en intégration navigateur, c'est l'IP de chaque visiteur qui est traitée, limitée et éventuellement journalisée. La phrase qui précède dit « does not track your visitors », et un intégrateur soumis au RGPD doit savoir que les IP de ses visiteurs nous parviennent. Le fond est exact, seule la formulation trompe.
- Actuel : « Request data, such as your IP address, is used to serve the response and enforce the rate limit, and may appear in our hosting provider's technical logs. »
- Proposé : « Request data, such as the IP address of whoever makes the call (your server, or each visitor's browser if you call the API client-side), is used to serve the response and enforce the rate limit, and may appear in our hosting provider's technical logs. »

**C2. Le preflight n'autorise aucun en-tête personnalisé** (`TEXTE_ENDPOINT`)
Problème : `CORS_HEADERS` (route.ts:21-25) n'a pas de `Access-Control-Allow-Headers`. Un `fetch` avec un en-tête non standard (`X-Api-Key`, `Content-Type: application/json` sur un GET, `X-Requested-With`) déclenche un preflight, puis échoue en erreur CORS. La page annonce pourtant « CORS enabled » et un preflight pris en charge.
- Actuel : « … The endpoint responds to GET (JSON) and OPTIONS (CORS preflight, 204 with no body). »
- Proposé (texte) : « … The endpoint responds to GET (JSON) and OPTIONS (CORS preflight, 204 with no body). Send a plain GET with no custom headers: the preflight allows none, so a request with extra headers fails with a CORS error. »
- Autre option (code, @fullstack, hors page) : ajouter `"Access-Control-Allow-Headers": "*"` dans `CORS_HEADERS` (valable sans credentials). Dans ce cas, garder la phrase actuelle sans ajout.

**C3. Paragraphe « CORS and caching » trop dense** (`TEXTE_CORS_CACHE`, 7 phrases et 3 sujets)
Problème : CORS, en-têtes de cache et règles de rotation sont mélangés dans un seul bloc. Un dev ne lit pas ça en 20 s (voir la capture PC, plus long paragraphe de la page).
- Proposé : couper en deux `<p>`. Le premier garde CORS et cache (jusqu'à « …never serves yesterday's joke. »). Le second commence à « The joke changes every day at midnight UTC… » jusqu'à la fin. Il suffit d'exporter `TEXTE_ROTATION` à part et d'ajouter un `<p>` dans page.tsx, sans changer un mot.

### Optionnel

**O1. Intro absolue vs exception de retrait** (`TEXTE_INTRO`)
- Actuel : « …and everyone gets the same one until midnight UTC. »
- Proposé : « …and everyone gets the same one for the whole UTC day. » La phrase reste vraie dans l'esprit, et la page précise l'exception (retrait) plus bas. Une autre solution est de ne rien changer : l'exception est déjà documentée sur la même page.

**O2. Ligne de faits rapides sous l'intro** (scan en 20 s, lecture par le robot d'annuaire)
- Proposé (nouvelle ligne après `TEXTE_INTRO`) : « Auth: none · HTTPS: yes · CORS: yes · Format: JSON · Rate limit: 10 requests per 10 seconds per IP. » Uniquement des faits déjà présents sur la page, rien de nouveau.

**O3. Limite de requêtes approximative** (`TEXTE_LIMITE`, 1re phrase)
- Actuel : « The limit is 10 requests per 10 seconds per IP address. »
- Proposé : « The limit is 10 requests per 10 seconds per IP address. Counting is approximate, so stay well below it. » Le compteur Cloudflare est tenu par datacenter, et sa mise à jour peut prendre quelques secondes.

**O4. Exemple reformaté** (`TEXTE_EXEMPLE`)
- Actuel : « A real response, returned on 24 October 2026: »
- Proposé : « A real response, returned on 24 October 2026 (indented here for reading; the API returns it on one line): ». page.tsx:86 réindente la réponse, alors que `curl -i` montre une seule ligne.

**O5. `date` : détecter une copie périmée** (CHAMPS `date`)
- Actuel : « The day of the joke, in UTC, formatted YYYY-MM-DD. »
- Proposé : « The day of the joke, in UTC, formatted YYYY-MM-DD. If it is not today's UTC date, your cached copy is stale. » C'est utile à qui garde la réponse jusqu'à 24 h, comme la licence le permet.

**O6. Renvoi licence non cliquable dans l'erreur 403** (page.tsx:190)
- Le texte « see License and terms » de `ERREURS[403]` reste du texte brut, alors que les CHAMPS renvoient vers `#license` par un lien (`AvecRenvoiLicence`). Proposé : appliquer le même composant aux descriptions d'erreurs, avec « License and terms » comme texte du lien.

**O7. Méthodes non prises en charge** (ERREURS, complète B1)
- Proposé (nouvelle entrée) : code « 405 », description « Any method other than GET or OPTIONS. This response has no CORS header. » À ajouter seulement si @fullstack confirme le 405 en production (`curl -i -X POST …`). Sinon, ne rien ajouter : rien d'inventé.

**O8. « in this version »** (CHAMPS `type`)
- Actuel : « Always "vanne" (French for "joke") in this version. If you get another value, do not reject the response. »
- Proposé : « Always "vanne" (French for "joke"). Do not reject the response if you get another value. » On garde la consigne de robustesse, sans laisser entendre une version suivante (pas de feuille de route).

**O9. Guillemets de marque** : « "Deviens Marrant" » est entre guillemets droits dans CHAMPS `attribution` et entre guillemets courbes dans la licence. Proposé : “Deviens Marrant” partout en prose (pas dans les blocs de code). Pure cohérence visuelle.

## Notes par critère

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Exactitude technique | 8/10 | 17 affirmations vérifiées exactes sur 18. B1 faux (bloquant). C1 et C2 : formulation trompeuse ou mise en garde manquante |
| 2 | Clarté dev anglophone en 20 s | 8,5/10 | H1 et 1re phrase parfaits (« Free JSON API, no key, HTTPS, CORS enabled »), endpoint visible sans défiler sur PC. Anglais naturel. Le paragraphe CORS/cache est trop dense (C3) |
| 3 | Complétude annuaire | 9/10 | Gratuit, sans clé, HTTPS, CORS, limite, erreurs, licence, contact, exemple réel, `robots.txt` qui autorise `/api/widget/` (robots.ts:19). Il manque un bloc de faits rapides (O2) |
| 4 | Exemples curl/fetch | 9,5/10 | `curl -i` montre les en-têtes documentés. `fetch` sûr : `append` et `textContent`, aucun `innerHTML`, donc pas d'injection. Attribution visible, `lang="fr"`, try/catch cohérent avec le 429 sans CORS, `await` de premier niveau signalé (module) |
| 5 | Règles maison | 10/10 | Aucun tiret cadratin ni demi-cadratin (Grep `[—–]` vide sur developers.ts), aucun concurrent, aucune promesse de disponibilité (« no guarantee of availability »), exemple réel daté, « hand-picked / all audiences » appuyé par la liste blanche de 93 vannes relues |
| 6 | SEO de base | 9/10 | Title de 52 caractères, description d'environ 140, canonical relatif résolu par `metadataBase` → `https://deviens-marrant.fr/developers`, 1 H1 et 9 H2, JSON-LD WebPage (`inLanguage: en`) + WebAPI (gratuit, offre à 0), og `en_US`, présence dans le sitemap. Seule réserve : `lang="en"` est porté par le conteneur et `<html lang="fr">` reste global (layout.tsx:134), ce qui est acceptable avec un en-tête et un pied en français |
| | **Globale** | **9,0/10** | Moyenne arithmétique (54/6). Le seuil de 9 est atteint, mais le GO exige aussi zéro bloquant : B1 suffit à donner un NO-GO |

## Captures
- PC (1440 px) : rendu propre. Hiérarchie H1/H2 nette, blocs de code contrastés et lisibles, liens identifiables (soulignés, couleur d'accent), pas de débordement, URL longue de l'exemple coupée proprement. Le seul défaut visible est la densité du paragraphe « CORS and caching » (C3).
- Mobile (390 × 7067 px) : réduite à 110 px de large à l'affichage, donc illisible en détail. Je ne valide que la colonne unique et l'absence de débordement horizontal apparent. La lisibilité du code replié (`pre-wrap`) à 375 px n'est **pas validée** : il faudrait une capture recadrée sur la section Endpoint.

## Top 3
1. **B1** : réécrire l'exception CORS (une phrase, bloquant).
2. **C2** : signaler que le preflight n'accepte aucun en-tête, ou ajouter `Access-Control-Allow-Headers` côté code.
3. **C1** : préciser que l'IP traitée est celle de chaque visiteur en appel navigateur.

## Décisions à confirmer par l'utilisateur
- C2 : correction par le texte (page seule) ou par le code (`Access-Control-Allow-Headers: *`, @fullstack, à noter dans REPLIT_ACTIONS.md) ?

## Recommandation
NO-GO tant que B1 n'est pas corrigé. Il faut relancer @copywriter pour B1, C1, C2 (texte) et C3, et @fullstack pour le `<p>` de C3 (et C2 code si choisi). La version corrigée repasse ensuite une relecture à l'aveugle sur B1/C1/C2/C3 seulement.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22-v3.md`
- Décisions prises : NO-GO, 9,0/10, 1 bloquant (B1), 3 à corriger (C1-C3), 9 optionnels (O1-O9)
- Points d'attention : capture mobile non exploitable en détail (recadrer la section Endpoint à 375 px) ; O7 (405) à mesurer avant tout ajout
---
