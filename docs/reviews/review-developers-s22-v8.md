# Revue à l'aveugle : page /developers (API « vanne du jour »), v8, 24/10/2026

Relecteur : @reviewer. Revue à l'aveugle : aucun fichier de `docs/reviews/` lu.
Sources lues : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, `api/widget/v1/vanne-du-jour/route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, `lib/fr-typo.ts`, `lib/widget/mesure.ts` (pour vérifier la section Privacy), les 3 captures `docs/qa/captures-developers-s22/`, plus les faits mesurés en production le 24/10/2026 qui m'ont été transmis.
Hors périmètre (décisions du fondateur, non re-questionnées) : texte de la licence, pas de bouton Copy, U+2060 documenté, preflight sans en-têtes autorisés, `<html lang="fr">`, ordre des sections, mise en forme des blocs de code.

## Verdict : NO-GO (1 bloquant), note globale 9,2/10

Une seule phrase pose problème, et elle se corrige en un mot. Le reste est exact, vérifié ligne à ligne contre le code et les mesures de production. Une fois B1 corrigé, la page passe en GO sans autre relecture complète : il suffit de vérifier la phrase modifiée.

| # | Critère | Note | Justification courte |
|---|---|---|---|
| 1 | Exactitude technique | 8/10 | Contradiction interne entre l'intro et la section Rotation (B1). Tout le reste est conforme au code et aux mesures |
| 2 | Clarté pour un dev anglophone en 20 s, anglais naturel | 9/10 | L'intro donne tout (gratuite, sans clé, HTTPS, CORS, JSON, en français). L'endpoint est visible sans défiler sur PC. Deux phrases trop longues (O1) |
| 3 | Complétude pour l'annuaire | 9,5/10 | Endpoint, auth (aucune), HTTPS, CORS, exemple réel, 7 champs, erreurs, limite de requêtes, cache, licence, contact |
| 4 | Exemples corrects et sûrs | 9,5/10 | curl `-i` cohérent avec la doc. fetch : nœuds texte via `append` (pas d'innerHTML, donc pas de XSS), `lang="fr"`, lien d'attribution présent, try/catch qui couvre le 429 sans CORS |
| 5 | Règles maison | 10/10 | Grep `[—–]` : 0 occurrence. Aucun concurrent. Hébergeur non nommé. Aucune promesse de disponibilité ni de feuille de route |
| 6 | SEO de base | 9/10 | Titre de 52 caractères, meta de 141 caractères, canonical, H1, JSON-LD WebPage + WebAPI, sitemap, lien entrant depuis la page du programme, `lang="en"` sur le conteneur |

## Vérifications d'exactitude (toutes PASS sauf B1)

- **CORS** : `Access-Control-Allow-Origin: *` sur les réponses 200, 403 et 503 (route.ts:21-31, 33-46) et sur OPTIONS 204 sans corps (route.ts:70-72). Pas d'`Allow-Headers`, donc l'affirmation « adding a header makes the request fail » est exacte. Le 429 du CDN sans CORS correspond à la mesure.
- **Cache** : `max-age=min(300, s)` et `s-maxage=min(3600, secondes avant minuit)` (route.ts:58-62, vanne-du-jour.ts:72-80). Le texte « s-maxage plafonné pendant la dernière heure, max-age pendant les 5 dernières minutes » est exact.
- **Rotation et retrait** : la clé du cache edge contient l'empreinte de la liste (vanne-du-jour.ts:155-157), et l'index est calculé modulo la taille du pool (l.133). Un retrait change donc la vanne du jour avant minuit. La doc le dit bien.
- **utm_content** : Origin, puis Referer ; minuscules, sans `www.`, sinon `inconnu` (route.ts:49-50, vanne-du-jour.ts:184-193, 217-222). C'est exact, à une précision près (C1).
- **Typographie** : `frTypo` (fr-typo.ts:87-104) produit l'apostrophe ’, les guillemets « » et l'espace U+00A0 devant `: ; ! ?` et autour des guillemets, plus U+2060 dans les mots composés courts. La formule « for example » couvre les autres cas (chiffres, tirets). Rien n'est promis à tort.
- **Exemple de réponse** : la vanne `cmmnsqn16008jth63zwal8rzj` est dans la liste blanche, son texte source (`docs/copy/catalogue-vannes-valides.md:153`) correspond une fois passé par frTypo (apostrophes courbes), le slug finit par les 10 premiers caractères de l'id et `utm_content=inconnu` est cohérent avec un appel curl.
- **Erreurs** : 503 avec `Retry-After: 3600` (route.ts:42) et 403 `acces-refuse` (route.ts:51) sont exacts. Le 429 correspond à la mesure de production.
- **Privacy** : l'API ne compte aucun affichage. `compterAffichage` n'est importé que par `/embed/vanne-du-jour` et pas par la route API, donc « two things only » est exact. Aucun `Set-Cookie` d'après la mesure. Les journaux Workers sont activés, ce que couvre « may appear in our hosting provider's technical logs ».
- **Vérification externe** : le formulaire d'ajout de Free Public APIs demande l'URL de la doc, puis au moins un endpoint testé avec une description. La page fournit les deux, et l'endpoint renvoie 200 en JSON sans clé.

## Corrections

### Bloquant

**B1. L'intro contredit la section Rotation** (`developers.ts:28` contre `developers.ts:96`)
- Intro : « everyone gets the same one on a given UTC day ».
- Rotation : « If we withdraw a joke, the joke of the day can change before midnight UTC ».
- Un jour de retrait, deux visiteurs du même jour UTC peuvent donc recevoir deux vannes différentes, et la promesse de l'intro devient fausse. Le texte de la page se contredit lui-même, ce que la grille classe en bloquant.
- Correction (@copywriter) : « and everyone normally gets the same one on a given UTC day ». « Normally » est déjà le mot utilisé dans TEXTE_CACHE et TEXTE_LIMITE, donc la page reste cohérente. Autre option : « everyone gets the same one at the same time ».

### À corriger (non bloquant, avant ou juste après la soumission)

**C1. Le repli sur Referer est décrit trop étroitement** (`developers.ts:72`)
- La doc dit « from the Referer header when there is no Origin ».
- Or le code passe aussi au Referer quand l'Origin vaut `null` (iframes sandboxées, `file://`, certaines redirections) ou n'est pas lisible (vanne-du-jour.ts:185-191).
- Remplacer par « when there is no usable Origin ». La phrase garde sa longueur et devient exacte dans tous les cas.

### Optionnel

- **O1. Clarté** : la description de `url` (l.72) fait 60 mots en une phrase. Elle se lirait mieux en deux phrases : « Its utm_content value is the calling site's domain (lowercase, without "www."), read from the Origin header, or from the Referer header if there is no usable Origin. It is inconnu (French for "unknown") when neither header is usable, as with a server-side call or curl. » Même remarque, plus légère, pour `type` (l.52) : « Other values may appear later; handle them like "vanne" » serait plus naturel que « Do not reject the response on this field ». Attention toutefois : « later » ne doit pas devenir une annonce de feuille de route.
- **O2. Meta description** (l.12) : « A different joke every day » est vrai d'un jour sur l'autre, mais peut se lire « jamais deux fois la même ». Or la page dit que les vannes reviennent. « A new joke every day » lève l'ambiguïté.
- **O3. Minuit au poil près** : `secondsUntilUtcMidnight` arrondit au supérieur (vanne-du-jour.ts:74). Une réponse peut donc rester fraîche jusqu'à moins d'une seconde après minuit, alors que la doc dit « Neither lifetime ever extends past midnight UTC ». C'est sans effet pratique : soit on laisse, soit @fullstack arrondit à l'inférieur avec un minimum de 1.
- **O4. Lien** : dans l'erreur 403 (l.114), « see License and terms » n'est pas cliquable, alors que les champs `attribution` et `license` renvoient vers `#license`. Faire passer la description par `AvecRenvoiLicence` (page.tsx:195) avec le libellé adapté.
- **O5. Comparaison de texte** : à côté de « Strip U+2060 », conseiller aussi de remplacer U+00A0 par une espace normale avant une recherche ou une comparaison.
- **O6. Contrôle QA** : vérifier en production que `cf-cache-status` vaut DYNAMIC ou est absent sur l'API. Si le CDN mettait la réponse en cache, le `Vary: Origin, Referer` serait ignoré et `utm_content` d'un site serait servi aux autres, ce qui rendrait faux ce que dit le champ `url`.
- **O7. SEO** : ajouter `url` et `inLanguage: "en"` au JSON-LD WebAPI. Le seul lien entrant interne vient aujourd'hui de la page du programme : suffisant pour l'annuaire, mais faible pour l'indexation.

## Captures (3 lues)

- **PC 1440** : hiérarchie nette (H1, chapeau, H2 réguliers), blocs de code lisibles, aucun JSON brut hors bloc, aucun lien mort. Le lien vers la licence en français et `/integrer-la-vanne-du-jour` sont visibles. PASS.
- **Mobile, haut de page** : intro et endpoint lisibles, pas de débordement horizontal. Les URL se coupent dans les blocs (`deviens-` / `marrant.fr`), mais c'est un retour à la ligne visuel : la copie reste intacte. La mise en forme des blocs est un choix du fondateur. PASS.
- **Mobile, page entière** : capture trop réduite pour juger le détail, mais la structure est conforme et aucune zone n'est cassée. PASS.

## Top 3

1. **B1** : ajouter « normally » dans l'intro (`developers.ts:28`). C'est le seul obstacle au GO.
2. **C1** : « when there is no usable Origin » (`developers.ts:72`).
3. **O2** : « A new joke every day » dans la meta description (`developers.ts:12`).

Sources externes : [Free Public APIs, formulaire d'ajout](https://freepublicapis.com/new), [Free Public APIs, Sad Robot](https://www.freepublicapis.com/sadrobot).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22-v8.md`
- Décision : NO-GO, 9,2/10, 1 bloquant (B1). Après correction de B1, GO sans nouvelle relecture complète : vérifier uniquement la phrase modifiée.
- Agents à relancer : @copywriter pour B1, C1, O1 et O2 (textes uniquement, `developers.ts`) ; en option @fullstack pour O3 et O4, et @qa pour O6.
---
