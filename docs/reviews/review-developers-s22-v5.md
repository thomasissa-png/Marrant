# Relecture à l'aveugle : /developers (s22, v5) : 24/10/2026

Périmètre : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, captures PC / mobile / mobile haut de page, confrontés à `route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, `lib/fr-typo.ts` et aux faits mesurés en production le 24/10/2026. Rapports antérieurs non lus. Décisions du fondateur (licence, pas de bouton Copy, U+2060, preflight, `lang="fr"` global, ordre des sections) non re-questionnées.

## Verdict : GO (9,3/10, zéro bloquant)

| # | Critère | Note | En bref |
|---|---|---|---|
| 1 | Exactitude technique | 9,5 | Aucune affirmation fausse. Une formulation imprécise sur le plafonnement de `max-age` (C1) |
| 2 | Clarté pour un dev anglophone en 20 s, anglais naturel | 8,5 | Chapeau excellent. URL de l'endpoint après un paragraphe de 5 lignes (à la limite de la ligne de flottaison en mobile), anglais un peu raide par endroits |
| 3 | Complétude pour l'annuaire | 9,5 | Gratuit, sans clé, HTTPS, CORS, limite de requêtes, exemple réel, erreurs, licence : tout y est dès le chapeau |
| 4 | Exemples curl/fetch | 9,5 | Corrects, sûrs (nœuds texte, pas d'`innerHTML`), lien d'attribution conforme à la licence, 403/429/503 gérés |
| 5 | Règles maison | 10 | Zéro « — » / « – » (Grep), aucun concurrent nommé (« our CDN », « our hosting provider »), rien d'inventé, aucune promesse de disponibilité ni de feuille de route |
| 6 | SEO de base | 9 | Title 52 car., meta environ 141 car., H1, canonical, `og:locale en_US`, `lang="en"` sur le conteneur, JSON-LD WebPage + WebAPI. Une propriété schema.org hors domaine (O1) |

## Points vérifiés (exacts)

- GET + OPTIONS (204 sans corps), `Access-Control-Allow-Origin: *` sur 200, 403, 503 et sur le preflight (`route.ts:21-31`, `:70-72`). Le preflight n'a pas d'`Access-Control-Allow-Headers`, donc la mise en garde sur Authorization / X-Requested-With / `Content-Type: application/json` est juste.
- `Cache-Control: public, max-age=min(300, s), s-maxage=min(3600, secondes avant minuit UTC)` (`route.ts:58-62`, `vanne-du-jour.ts:72-80`) : conforme, à la nuance C1 près.
- 503 `{"type":"vanne","error":"indisponible"}` + `Retry-After: 3600` ; 403 `acces-refuse` sur Origin, puis Referer (`route.ts:33-51`).
- 429 du CDN sans CORS et sans JSON, 10 req / 10 s, blocage 10 s : conforme aux mesures. « per IP address » est plus prudent que la règle réelle (IP + datacenter), donc pas trompeur.
- `utm_content` : Origin, puis Referer, en minuscules et sans « www. », sinon `inconnu` (`vanne-du-jour.ts:184-221`).
- Typographie : apostrophes courbes, « », U+00A0 avant `: ; ! ?` et autour des guillemets, U+2060 après le trait d'union des mots composés courts (`fr-typo.ts:13-14, 60-80`).
- « explains why it is funny » : le pool impose `comedyTechnique: { not: null }` (`daily-joke-pool.ts:20`) et la fiche affiche « Pourquoi ça marche » en public : exact.
- « picked by hand, suitable for all audiences » : 93 vannes gardées par deux relecteurs « tout public » (`widget-vanne-du-jour.ts:21-29`).
- L'exemple de réponse respecte l'ordre et les 7 champs de `toWidgetApiPayload`. L'id du slug (`cmmnsqn160…`) est cohérent avec la liste blanche, et l'API renvoie bien le JSON sur une seule ligne.
- Aucun cookie (mesure), journaux Workers couverts par « may appear in our hosting provider's technical logs ».

## Corrections

### Bloquant

Aucun.

### À corriger

**C1. TEXTE_CORS_CACHE : plafonnement de max-age (exactitude).** `max-age` n'est réduit que pendant les 5 dernières minutes, pas « in the last hour ».
- Actuel : « Neither value ever runs past midnight UTC: in the last hour of the day, each one is capped at the seconds left before midnight, so a cache that follows these headers does not serve yesterday's joke. »
- Proposé : « Neither lifetime ever extends past midnight UTC: s-maxage is capped at the seconds left before midnight during the last hour of the day, and max-age during the last 5 minutes, so a cache that follows these headers does not serve yesterday's joke. »

**C2. Endpoint : l'URL d'abord (clarté en 20 s).** Le dev pressé lit 5 lignes de mises en garde CORS avant de voir l'URL. Le découpage reste à l'intérieur de la section, donc l'ordre des sections ne change pas.
- Actuel : TEXTE_ENDPOINT (un seul paragraphe), puis les blocs Endpoint, curl et JavaScript.
- Proposé : `TEXTE_ENDPOINT` = « Send a GET request to the endpoint below, over HTTPS. There is no key, no sign-up and no parameters. » ; puis le bloc Endpoint ; puis le bloc curl ; puis un nouveau `TEXTE_ENDPOINT_NAVIGATEUR` = « The endpoint responds to GET (JSON) and OPTIONS (CORS preflight, 204 with no body). From the browser, send a plain GET: the preflight allows no request headers, so adding one such as Authorization, X-Requested-With or Content-Type: application/json makes the request fail with a CORS error. Server-side calls are not affected. » ; puis le bloc JavaScript (ajout d'un `<p>` dans `page.tsx`).

**C3. TEXTE_VIE_PRIVEE : « two things only » à côté des journaux (précision vie privée).** L'Origin et le Referer (URL complète de la page hôte) font partie des données de requête que les journaux Workers peuvent contenir. Le « only » doit en tenir compte.
- Actuel : « The domain of the calling site, read from the Origin or Referer header, is used for two things only: »
- Proposé : « Apart from those technical logs, the domain of the calling site, read from the Origin or Referer header, is used for two things only: »

### Optionnel

**O1. JSON-LD WebAPI.** `isAccessibleForFree` n'est pas une propriété valide de `Offer` (son domaine est CreativeWork / Event / Place), ce qui donne un avertissement dans les validateurs. Actuel : `offers: { "@type": "Offer", price: 0, priceCurrency: "EUR", isAccessibleForFree: true }`. Proposé : `offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" }`.

**O2. Champ url : ordre Origin / Referer.** Actuel : « taken from the Origin header, then the Referer header (lowercase, without "www.") ». Proposé : « taken from the Origin header, or from the Referer header when there is no Origin (lowercase, without "www.") ».

**O3. Coupure d'en-tête en mobile.** À 390 px, la prose coupe « X- / Requested-With » (capture `developers-mobile-endpoint.png`), alors que c'est un nom que le dev recopie. Proposé : dans `page.tsx`, rendre les jetons HTTP de la prose (`X-Requested-With`, `Access-Control-Allow-Origin: *`, `Cache-Control: …`, `Retry-After: 3600`, `utm_content`) en `<code className={`${CODE} whitespace-nowrap`}>`. Cela rend aussi la page plus facile à parcourir. Ne pas utiliser U+2011 ni U+2060 : ces caractères seraient copiés avec le texte.

**O4. Blocs d'une ligne en mobile.** `GET https://deviens-` / `marrant.fr/…` se coupe au trait d'union du domaine. La copie reste correcte (retour à la ligne visuel), mais à la lecture on croit à deux lignes. Proposé : `whitespace-pre` + défilement horizontal pour les seuls blocs Endpoint et curl.

**O5. Redondance « midnight UTC ».** Elle est répétée 5 fois (chapeau, CORS, rotation, limite, champ date). Actuel (TEXTE_ROTATION) : « The joke changes every day at midnight UTC and is the same for everybody. » Proposé : « The joke changes every day at midnight UTC. » (« the same for everybody » est déjà dans le chapeau.)

**O6. À vérifier (hors fichiers lus) :** présence d'un lien interne vers `/developers` depuis `/integrer-la-vanne-du-jour` et dans le sitemap (`DEVELOPERS_LASTMOD` existe), pour que le robot de l'annuaire et Google la découvrent.

## Captures

- PC 1440 : hiérarchie nette, blocs de code lisibles, JSON indenté, liens d'ancrage visibles, aucun débordement.
- Mobile haut de page : H1 et chapeau lisibles. Le bloc Endpoint arrive vers 810 px, donc à la limite du premier écran (C2). Voir aussi la coupure « X- » (O3).
- Mobile pleine page : trop réduite pour juger le détail. Aucun débordement horizontal visible.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22-v5.md`
- Note : 9,3/10, GO, zéro bloquant
- Top 3 : C1 (plafonnement de `max-age` : 5 dernières minutes, pas dernière heure), C2 (URL de l'endpoint avant les mises en garde CORS), C3 (« two things only » à concilier avec les journaux Workers)
- Agent à relancer pour les corrections : @fullstack (textes + `page.tsx`)
---
