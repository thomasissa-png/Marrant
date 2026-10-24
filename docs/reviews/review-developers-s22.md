# Relecture à l'aveugle : page `/developers` (API vanne du jour) : s22, 24/10/2026

## Verdict : NO-GO (note globale 8/10, 2 bloquants)

Résumé exécutif : la page est propre, lisible et presque prête pour l'annuaire. Gratuit, sans clé, CORS, exemple et licence sont tous présents, et le rendu PC comme mobile est sobre. Deux phrases disent pourtant autre chose que le code : l'en-tête de cache cité est incomplet, et la section vie privée affirme un usage unique du domaine appelant, ce qui est faux. Une fois ces deux phrases et l'exemple `fetch` corrigés (une demi-heure de travail), la page passe au-dessus de 9.

Sources lues : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, `api/widget/v1/vanne-du-jour/route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, `vannes/[slug]/page.tsx` (section « Pourquoi ça marche » publique : l'affirmation « explains why it is funny » est exacte), captures PC et mobile.

## Notes par critère

| # | Critère | Note | Commentaire |
|---|---|---|---|
| 1 | Exactitude technique | 7/10 | CORS `*`, GET/OPTIONS, champs, `date` UTC, 503 + `Retry-After: 3600`, 403 `acces-refuse`, `utm_content` Origin puis Referer sinon `inconnu`, attribution : tout est exact. 2 affirmations fausses (B1, B2), et un point à vérifier sur le 429 (C2). |
| 2 | Clarté dev anglophone (20 s) | 8/10 | Endpoint, curl et fetch arrivent dès le premier écran : bien. Les erreurs sont tassées dans un seul paragraphe, les codes d'erreur ne sont pas traduits et il y a quelques tournures calquées (« answers », « when neither gives it », « today »). |
| 3 | Complétude annuaire | 8,5/10 | Gratuit, sans clé, CORS, limite et licence sont là. HTTPS n'est jamais dit en toutes lettres et le `Content-Type` n'est pas mentionné. |
| 4 | Exemple `fetch` | 7/10 | Sûr (`textContent`, `append` de chaînes, pas d'`innerHTML`) et l'attribution est affichée. Mais le `await` de premier niveau donne une SyntaxError dans un `<script>` classique, et il n'y a aucun contrôle de `res.ok` : sur un 503, `joke.attribution.url` lève une TypeError. |
| 5 | Règles maison | 9/10 | Grep `[—–]` : 0. Aucun concurrent cité. « picked by hand, suitable for all audiences » est sourcé (93 vannes gardées par 2 relecteurs tout public, `widget-vanne-du-jour.ts:20-23`). La licence exclut toute garantie de disponibilité. Seul écart : « "replique" is planned for later » est une promesse de feuille de route (C5). |
| 6 | SEO de base | 9/10 | Title 52 car., description environ 136 car., canonical relatif `/developers` (metadataBase), `lang="en"` sur le conteneur, `og:locale en_US`, 1 H1 + 9 H2, JSON-LD WebPage + WebAPI `isAccessibleForFree`. Le H1 ne porte pas « French » (O1). |

## Corrections

### Bloquant

1. **B1 : en-tête Cache-Control cité faux** (`TEXTE_CORS_CACHE`). Le code envoie `public, max-age=${min(300, s)}, s-maxage=${s}`, avec `s = min(3600, secondes avant minuit UTC)` (`route.ts:62`, `vanne-du-jour.ts:78-80`). Un `curl -i` montre donc `s-maxage=3600`, absent de la doc.
   - Actuel : `CORS is open: responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser. They also carry Cache-Control: public, max-age=300. Browsers keep a response for 5 minutes at most, and shared caches for up to 1 hour, never past midnight UTC. The joke changes every day at midnight UTC, the same one for everybody. Every joke in the rotation was picked by hand and is suitable for all audiences.`
   - Proposé : `CORS is enabled for every origin: responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser. They also carry Cache-Control: public, max-age=300, s-maxage=3600. Browsers keep a response for 5 minutes at most and shared caches for 1 hour at most. Both values shrink as midnight UTC approaches, so no cache keeps a joke past midnight UTC. The joke changes every day at midnight UTC, the same one for everybody.`
   - La dernière phrase actuelle (« Every joke in the rotation… ») n'a rien à faire dans une section CORS : elle passe dans l'intro (C9).

2. **B2 : « only goes into utm_content » est faux** (`TEXTE_VIE_PRIVEE`). Le domaine appelant sert aussi au contrôle de la liste de blocage (`route.ts:49-51`, `isDomaineBloque`). Par ailleurs l'IP sert à la limite de requêtes, ce qui va au-delà de « to serve the response ».
   - Actuel : `The API sets no cookies and does not track your visitors. Only the technical data of the request is processed to serve the response. The domain of the calling site only goes into the utm_content parameter of the link, so we can see which sites send clicks (nothing about your visitors).`
   - Proposé : `The API sets no cookies and does not track your visitors. Request data is used only to serve the response and to enforce the rate limit. The domain of the calling site, read from the Origin or Referer header, is used for two things only: checking it against our list of blocked sites, and filling the utm_content parameter of the link, so we can see which sites send clicks. It says nothing about your visitors.`

### À corriger

3. **C1 : exemple `fetch`** (`page.tsx:84-91`, `EXEMPLE_FETCH`). Remplacer les 6 lignes par :
   ```js
   // <div id="joke"></div> then, in a <script type="module">:
   const res = await fetch("https://deviens-marrant.fr/api/widget/v1/vanne-du-jour");
   if (res.ok) {
     const joke = await res.json();
     const link = document.createElement("a");
     link.href = joke.attribution.url;
     link.textContent = joke.attribution.name;
     document.getElementById("joke").append(joke.amorce, " ", joke.chute, " ", link);
   }
   ```
   (L'URL reste construite via `${API_URL}`. Sur mobile, ajouter des lignes ne casse pas le rendu : `pre-wrap` est déjà en place.)

4. **C2 : erreurs illisibles d'un coup d'œil, codes non traduits, 429 à vérifier** (`TEXTE_ERREURS`, à passer en liste comme `CHAMPS`, rendue en `<dl>`).
   - Actuel : `503 with {"type":"vanne","error":"indisponible"}: the service is unavailable. The response includes a Retry-After: 3600 header, so try again in an hour. 403 with {"type":"vanne","error":"acces-refuse"}: the calling site is blocked (abuse). 429: you went over the rate limit, wait 10 seconds before the next call.`
   - Proposé (3 entrées) :
     - `503`: `{"type":"vanne","error":"indisponible"} ("unavailable"): the service is temporarily unavailable. The response carries Retry-After: 3600, so try again in an hour.`
     - `403`: `{"type":"vanne","error":"acces-refuse"} ("access denied"): the calling site has been blocked for abuse.`
     - `429`: `Rate limit exceeded. Wait 10 seconds before the next call.`
   - À vérifier avant de publier : le 429 est produit par la règle WAF Cloudflare, pas par la route, donc il ne porte probablement ni `Access-Control-Allow-Origin` ni corps JSON. Dans ce cas, un navigateur le voit comme une erreur CORS, pas comme un 429. Test à faire : 11 appels en 10 s avec `-H "Origin: https://exemple.fr" -i`. Si l'en-tête manque, ajouter à l'entrée 429 : `This response comes from our CDN: its body is not JSON, and a browser may report it as a CORS error.` (ou bien ajouter l'en-tête côté Cloudflare). Je n'ai pas pu le confirmer dans la documentation Cloudflare, il faut tester.

5. **C3 : « A new joke » est trompeur** (`PAGE_DESCRIPTION`). La rotation tourne sur 93 vannes (`dayNumber % eligible.length`), donc les vannes reviennent.
   - Actuel : `A new joke every day, read-only.` → Proposé : `A different joke every day, read-only.`

6. **C4 : champ `url`, fin de phrase calquée et cas curl absent** (`CHAMPS[url]`).
   - Actuel : `The public page of the joke on deviens-marrant.fr, which explains why it is funny. The link already carries UTM parameters. Its utm_content value is the domain of the calling site, taken from the Origin or Referer header, or inconnu (French for unknown) when neither gives it.`
   - Proposé : `The public page of the joke on deviens-marrant.fr (in French), which explains why it is funny. The link already carries UTM parameters. Its utm_content value is the domain of the calling site, taken from the Origin header, then the Referer header (lowercase, without "www."), or inconnu (French for "unknown") when neither header is usable, as with a server-side call or curl.`

7. **C5 : champ `type`, « today » ambigu et promesse de feuille de route** (`CHAMPS[type]`).
   - Actuel : `Always "vanne" (French for a joke) today. A value "replique" is planned for later, with no date yet.`
   - Proposé : `Currently always "vanne" (French for "joke"). Other values, such as "replique", may be added later: do not reject unknown values.`

8. **C6 : limite et cache client, relier à la licence** (`TEXTE_LIMITE`).
   - Actuel : `One call a day is enough, since the joke only changes at midnight UTC: cache it on your side.`
   - Proposé : `When you call the API from the browser, each visitor counts against their own IP. The joke only changes at midnight UTC, so one call a day is enough: cache the response on your side (the license allows up to 24 hours) and refresh it after midnight UTC.`

9. **C7 : HTTPS et Content-Type non dits, « answers » calqué** (`TEXTE_ENDPOINT`).
   - Actuel : `Send a GET request to the endpoint below. There is no key, no sign-up and no parameter. The endpoint answers GET and OPTIONS requests.`
   - Proposé : `Send a GET request to the endpoint below, over HTTPS. There is no key, no sign-up and no parameter. The endpoint responds to GET and OPTIONS (CORS preflight) requests and returns application/json.`

10. **C8 : H2 et première phrase redondants** (`TEXTE_WIDGET`, sous le H2 « Prefer not to code? »).
    - Actuel : `Not in the mood to code? A ready-to-copy widget is on the page /integrer-la-vanne-du-jour. That page is in French.`
    - Proposé : `A copy-and-paste widget (iframe or script tag) is available at /integrer-la-vanne-du-jour. That page is in French.` (le chemin n'apparaît qu'une fois : le `split` de `page.tsx:95` reste valide)

11. **C9 : intro, faire comprendre les champs en 20 s et y placer la phrase « tout public »** (`TEXTE_INTRO`).
    - Actuel : `This API returns one French joke per day as JSON: a setup, a punchline, and a link to the page that explains why it is funny. It is free, needs no key and is read-only. The jokes are in French, and everyone gets the same one until midnight UTC.`
    - Proposé : `This API returns one French joke per day as JSON: a setup (amorce), a punchline (chute) and a link to a page that explains why it is funny. It is free, needs no key, works over HTTPS and is read-only. The jokes are in French, and everyone gets the same one until midnight UTC. Every joke in the rotation was picked by hand and is suitable for all audiences.`

### Optionnel

12. **O1 : H1 sans « French »** (`H1`, qui sert aussi de `name` au JSON-LD WebAPI). `Joke of the Day API` → `French Joke of the Day API`.
13. **O2 : champ `attribution`, guillemets typographiques autour d'une clé JSON.** `An object {name, url, required}. “required” is true: the visible “Deviens Marrant” attribution link, pointing to that url, is mandatory wherever you display the joke (see the License section below).` → `An object {name, url, required}. required is always true: a visible "Deviens Marrant" link pointing to that url is mandatory wherever you display the joke (see the License section below).`
14. **O3 : champ `license`.** `The URL of the terms of use (see the License section below).` → `The URL of the terms of use, in French (an English translation is in the License section below).`
15. **O4 : typographie des textes.** Ajouter au champ `amorce` : `Plain UTF-8 text with French typography (curly apostrophes, non-breaking spaces before some punctuation). No HTML.` (le texte passe par `frTypo`, `vanne-du-jour.ts:137-138`).
16. **O5 : exemple curl.** `curl https://…` → `curl -i https://…` : le dev voit tout de suite les en-têtes CORS et cache qui sont documentés.
17. **O6 : changement en cours de journée.** Si une vanne est retirée de la liste blanche, l'empreinte du cache change et la vanne du jour peut changer avant minuit (`vanne-du-jour.ts:83-97`). La licence couvre déjà ce cas (« it may change »), mais on peut l'écrire dans la section cache : `If we withdraw a joke, the joke of the day can change before midnight UTC.`
18. **O7 : rendu mobile des blocs de code.** `overflow-wrap:anywhere` coupe les jetons en plein milieu (`fetch("https://deviens-` / `marrant.fr/…`). C'est lisible et la copie reste juste, mais un bouton « Copy » aiderait.

### Licence (signalements pour @legal, sans réécriture de fond)

- **L1 : traduction.** Une cible anglophone voudra traduire la vanne. `Do not modify the text of the joke` l'interdit de fait, mais ce n'est pas dit. À trancher et à écrire explicitement (autorisé ou interdit).
- **L2 : périmètre.** `you can use it on your site` : les apps, les bots (Discord, Slack) et les newsletters sont l'usage typique des API de l'annuaire. Sont-ils couverts ?
- **L3 : style.** Le paragraphe « Usage license: display of the joke free of charge and unmodified… » est une suite de groupes nominaux et se lit comme une traduction. Il est cohérent sur le fond (cache de 24 h, interdiction d'entraîner un modèle, aucune garantie). C'est à @legal de décider s'il faut le reformuler.

### Vérifications avant GO (mesures, pas de texte)

- `curl -i` sur l'endpoint : vérifier la valeur réelle de `Cache-Control` (B1) et l'**absence de `Set-Cookie`** (un cookie Cloudflare du type `__cf_bm` rendrait faux « sets no cookies », dans la doc comme dans la licence).
- Rafale de 11 appels avec `Origin` : vérifier les en-têtes et le corps du 429 (C2).

## Captures (PC 1440 px, mobile 390 px)

- PC : hiérarchie nette (H1, puis 9 H2 réguliers), code et texte bien distincts, aéré, aucune donnée brute visible hors des blocs de code voulus. Les liens de licence et de widget sont soulignés et visibles.
- Mobile : pas de débordement horizontal, le JSON et les URL passent à la ligne, la lecture reste possible. La page est longue (environ 5 800 px) et le paragraphe Errors y est le plus dense, ce qui justifie C2.
- Menu et pied de page en français sur une page anglaise : c'est cohérent avec le site et ça ne bloque pas.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22.md`
- Décision : **NO-GO, 8/10, 2 bloquants** (B1 Cache-Control cité sans `s-maxage`, B2 « only goes into utm_content » alors que le domaine sert aussi au blocage).
- Top 3 : B1 (`TEXTE_CORS_CACHE`), B2 (`TEXTE_VIE_PRIVEE`), C1 (exemple `fetch` : `type="module"` + `if (res.ok)`).
- À relancer : l'auteur des textes et du code de `/developers` pour B1, B2 et C1 à C9. @legal pour L1 et L2. Les mesures curl (Set-Cookie, 429) sont à faire avant la relecture suivante, qui repasse à l'aveugle.
---
