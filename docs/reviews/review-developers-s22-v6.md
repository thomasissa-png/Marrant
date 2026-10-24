# Relecture à l'aveugle : page `/developers` (API « vanne du jour »), v6, 24/10/2026

Relecteur : @reviewer (relecture à l'aveugle, aucun rapport antérieur lu). Périmètre : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, captures `docs/qa/captures-developers-s22/` (PC 1440, mobile 390 haut de page, mobile 390 complète), et pour vérifier l'exactitude : `api/widget/v1/vanne-du-jour/route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, `lib/fr-typo.ts`, plus les faits mesurés en production le 24/10/2026.
Hors périmètre (décisions du fondateur, non re-questionnées) : traduction de la licence, pas de bouton Copy, U+2060 documenté, preflight sans en-têtes autorisés, `<html lang="fr">` global, ordre des sections, mise en forme des blocs de code et coupures de ligne visuelles.

## Verdict : **GO** (9,3/10, zéro bloquant)

| # | Critère | Note | Justification courte |
|---|---|---|---|
| 1 | Exactitude technique | 9,5 | J'ai confronté chaque affirmation au code ou aux mesures de production : aucune n'est fausse. Il reste deux simplifications (IP partagée, compteur par IP et datacenter), voir AC1 et O1. |
| 2 | Clarté pour un dev anglophone en 20 s | 9 | L'intro donne tout (free, no key, HTTPS, CORS, 1/jour, français, minuit UTC). Sur mobile, le bloc `GET` est visible sans scroller. Le paragraphe CORS/cache est dense (AC2). |
| 3 | Complétude pour l'annuaire | 9 | Auth, HTTPS, CORS, limite, exemple réel, 7 champs, erreurs, vie privée, licence, contact : tout y est. La structure JSON est stable, ce que note le robot de santé. Manquent seulement HEAD/405 (O2). |
| 4 | Exemples corrects et sûrs | 9,5 | `curl -i` est pertinent. Le `fetch` est sûr : nœuds texte via `append`, aucun `innerHTML`, try/catch qui couvre le 429 sans CORS, `lang="fr"`, lien d'attribution visible, contexte `type="module"` signalé. Le JSON correspond à `toWidgetApiPayload` (ordre et 7 champs). |
| 5 | Règles maison | 10 | Grep `[—–]` sur `developers.ts` : 0 résultat. Aucun concurrent ni fournisseur nommé (« our CDN »). « no guarantee of availability ». Pas de feuille de route : la valeur `replique` est neutralisée par « treat any other value like "vanne" ». Aucun chiffre inventé. |
| 6 | SEO de base | 9 | Le titre fait 52 caractères et la description 141. Canonical `/developers`, `og:locale en_US`, `lang="en"` sur le conteneur. JSON-LD WebPage + WebAPI (documentation, termsOfService, offre à 0). La page est dans le sitemap et reçoit un lien `hrefLang="en"` depuis `/integrer-la-vanne-du-jour`. |

## Vérification d'exactitude (affirmation par affirmation)

| Affirmation de la page | Source | Verdict |
|---|---|---|
| GET en JSON, OPTIONS en 204 sans corps | `route.ts:70-72` | Exact |
| ACAO `*` sur 200, 403, 503 et preflight | `route.ts:21-31`, `BASE_HEADERS` sur toutes les réponses JSON | Exact |
| Le 429 du CDN n'a ni CORS ni JSON | mesure en production | Exact |
| Le preflight n'autorise aucun en-tête : Authorization, X-Requested-With et `Content-Type: application/json` échouent | absence d'`Access-Control-Allow-Headers` (`route.ts:21-25`). Ces trois en-têtes déclenchent un preflight. | Exact |
| `public, max-age=300, s-maxage=3600`, s-maxage plafonné à minuit dans la dernière heure, max-age dans les 5 dernières minutes | `route.ts:58-62`, `widgetSharedMaxAge` | Exact |
| La vanne change à minuit UTC, peut changer en cas de retrait, revient avec le temps | `widgetDateKey`, `dayNumber % eligible.length`, empreinte de liste dans la clé de cache | Exact |
| `utm_content` = Origin, sinon Referer, en minuscules, sans `www.`, sinon `inconnu` | `hostFromHeader`, `withWidgetUtm` | Exact (Origin illisible ou `null` : repli sur Referer, couvert par « neither header is usable ») |
| 503 `indisponible` + `Retry-After: 3600` ; 403 `acces-refuse` selon Origin/Referer | `route.ts:33-52` | Exact |
| Insécables U+00A0, apostrophes courbes, « », U+2060 après le trait d'union de certains composés | `frTypo` (`fr-typo.ts:77-104`) | Exact (la liste est introduite par « for example ») |
| La page liée « explains why it is funny » | `VALIDATED_JOKE_WHERE.comedyTechnique not null` ; bloc « Pourquoi ça marche » public sur `/vannes/[slug]` | Exact |
| « picked by hand, suitable for all audiences » | `WIDGET_JOKE_IDS` : 93 vannes gardées par deux relecteurs tout public, catégories exclues | Exact, sourcé |
| Aucun cookie ; logs techniques de l'hébergeur | aucun `Set-Cookie` mesuré ; journaux Workers activés | Exact |
| Réponse renvoyée sur une ligne | `NextResponse.json` (compact) | Exact |
| 10 req / 10 s par IP, blocage 10 s, 429 | règle CDN mesurée (clé IP + datacenter) | Exact pour l'usage (borne prudente), voir O1 |

## Corrections

### Bloquant
Aucun.

### À corriger (n'empêche pas le GO)
- **AC1. IP partagée** (`TEXTE_LIMITE`, developers.ts:96). « each visitor counts against their own IP » laisse croire à un compteur par visiteur. Or des visiteurs derrière une même IP publique (bureau, école, NAT d'opérateur mobile) partagent les 10 requêtes, ce qui compte pour un site à fort trafic qui appelle l'API côté navigateur. Proposition : « When you call the API from the browser, each visitor counts against their IP address; visitors who share one (office, school, mobile carrier) share the limit, so on a busy site prefer a server-side call with your own cache. » Agent : @copywriter.
- **AC2. Paragraphe CORS et cache trop dense** (`TEXTE_CORS_CACHE`, 1 paragraphe d'environ 110 mots). Le dev pressé y cherche deux réponses (« can I call it from the browser? », « how long can I cache? »). Proposition : couper en deux paragraphes, CORS puis Cache-Control, sans changer un mot. L'ordre des sections ne bouge pas. Agent : @copywriter.

### Optionnel
- **O1. Compteur par IP et datacenter.** La règle compte par IP et par datacenter. Une IP qui touche deux datacenters peut donc dépasser 10/10 s. Présenter la limite comme « per IP address » reste une borne sûre (qui la respecte n'est jamais bloqué) : je ne demande pas de correction, sauf si l'annuaire exige la valeur exacte.
- **O2. Méthodes non gérées.** HEAD est implémenté automatiquement par Next.js à partir de GET. POST, PUT et les autres méthodes reçoivent 405, sans CORS. Une demi-phrase dans `ERREURS` ou `TEXTE_ENDPOINT_NAVIGATEUR` éviterait une surprise.
- **O3. Renvoi non cliquable dans l'erreur 403.** « see License and terms » n'est pas un lien, alors que les champs `attribution` et `license` renvoient à `#license`. Il suffit de passer `erreur.description` par `AvecRenvoiLicence`, en harmonisant le libellé (`page.tsx:193`).
- **O4. Uniformité entre datacenters.** Si une vanne de la liste sort du pool validé en base sans nouveau déploiement, les datacenters déjà en cache gardent l'ancienne vanne et les autres recalculent sur le nouveau modulo. « the same for everybody » peut alors être faux quelques heures. C'est rare et déjà couvert en substance par « If we withdraw a joke… ». À garder en tête plutôt qu'à corriger.
- **O5. JSON-LD WebAPI.** On pourrait ajouter `inLanguage: "en"` (pour la doc) et `url` vers l'endpoint. Gain marginal.

## Captures (rendu)
- PC 1440 : hiérarchie nette H1 > H2, blocs de code lisibles, liens soulignés, aucun débordement. Présentation propre, alignée, aérée, dans l'identité sombre du site.
- Mobile 390 : le bloc endpoint est visible au-dessus de la ligne de flottaison. Les coupures dans les URL et le code ont été acceptées par le fondateur. Aucun débordement horizontal, et les `<dt>` des champs se repèrent bien.
- Je ne vois ni JSON brut hors bloc de code, ni lien mort, ni `undefined` affiché.

## Top 3
1. AC1 : préciser que les visiteurs qui partagent une IP partagent la limite, et orienter les sites à fort trafic vers l'appel serveur.
2. AC2 : couper le paragraphe CORS et cache en deux.
3. O3 : rendre cliquable le renvoi vers la licence dans l'erreur 403.

Sources externes : [Free Public APIs, about](https://freepublicapis.com/about) (robot quotidien, score de santé fondé sur la stabilité de la structure JSON, les erreurs et la vitesse).
