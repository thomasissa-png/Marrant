# Anomalie : canonique Google `747live.bet` sur l'URL `www` du pilier (enquête 13/10/2026)

Origine : `docs/seo/pilier-non-indexe-s15.md`, « Suivi J+7 ». URL concernée : `https://www.deviens-marrant.fr/blog/comment-devenir-drole` (« Page avec redirection », canonique choisi par Google : `https://www.747live.bet/`). Enquête en lecture seule (curl, WebSearch, lecture du code). Rien modifié côté site, Cloudflare ou Search Console.

## 1. Constats vérifiés (13/10, ~06:40 UTC)

| Test | Résultat |
|---|---|
| `www.deviens-marrant.fr/blog/comment-devenir-drole` (UA navigateur et UA Googlebot) | 301 vers `https://deviens-marrant.fr/blog/comment-devenir-drole`, identique dans les deux cas : pas de cloaking côté nous |
| Apex, même chemin | 200, `rel=canonical` absolu `https://deviens-marrant.fr/blog/comment-devenir-drole` |
| `747live.bet` (DNS) | 172.67.146.174, 104.21.65.152 (Cloudflare, autres IP que les nôtres) ; apex 301 vers `www.747live.bet` |
| `www.747live.bet/` | 200, plateforme SpringBuilder (site de paris, EN), `canonical` = `https://www.747live.bet/`, `robots: index, follow`, 0 mention de « marrant » ou « drôle » |
| `www.747live.bet/blog/comment-devenir-drole` | 200 mais « Page Not Found » (page d'erreur servie en 200), 0 contenu à nous |
| `747live.bet/sitemap.xml` | index de sitemaps (main, sport…), 0 mention de « marrant » |
| Requête avec `Host`/SNI `www.deviens-marrant.fr` envoyée sur l'IP de 747live | renvoie NOTRE 301 : Cloudflare route par nom d'hôte, les IP sont partagées. Aucune trace que la zone de 747live réponde pour notre hôte |
| WebSearch `site:747live.bet "deviens marrant"`, `"deviens-marrant.fr" 747live`, 2 extraits exacts du pilier (« Soit t'es drôle, soit tu l'es pas » + oncle/blondes ; « pas un chromosome ») | 0 résultat : aucune copie de nos pages repérée sur 747live ni ailleurs. Limite : WebSearch n'est pas Google, un index absent ne prouve pas l'absence |
| Contexte 747live | marque de paris/casino dont le spam de liens (profils GitLab, forums) est signalé dans les résultats ; rien qui nous cite |

Conclusion de l'enquête : **aucune preuve de détournement par proxy ni de contenu scrapé** sur `747live.bet`. `[À VÉRIFIER]` : autres domaines copieurs (pas de recherche de plagiat Google/Copyscape accessible ici) ; historique DNS et certificats de `www` (crt.sh a renvoyé 502, Wayback 429) ; contenu servi à Googlebot depuis les IP de Google (non reproductible d'ici).

## 2. Hypothèses classées

1. **Artefact ou état transitoire d'inspection (le plus plausible, non prouvé)** : le champ « canonique choisi par Google » d'une URL redirigée est peu fiable et peut refléter un signal périmé. Le crawl du 11/10 suit la bascule DNS Replit vers Cloudflare du 30/09 (`apps/web/wrangler.jsonc`) : un état intermédiaire de `www` pendant la bascule reste possible `[À VÉRIFIER : journal d'audit Cloudflare, historique des enregistrements DNS de `www`]`.
2. **Mauvais routage ponctuel de `www`** (enregistrement orphelin ou domaine personnalisé revendiqué par un autre compte pendant la bascule) : aucun signe aujourd'hui, la réponse actuelle est saine.
3. **Proxy ou copie hébergée par 747live** : non étayé (point 1 ci-dessus).

## 3. Risque

- **Apex : faible.** Statut « Envoyée et indexée », canonique auto-référent, 12/10 exploré. L'anomalie touche une URL redirigée (`www`), qui n'a pas vocation à être indexée. Pas de déduplication défavorable observée tant que l'apex garde son propre canonique.
- **Pages remplacées dans les SERP : non constaté**, mais à surveiller (si l'anomalie se reproduit sur l'apex, le risque passe en fort).
- **Marque : faible aujourd'hui** ; devient moyen si une requête `site:deviens-marrant.fr` ou une SERP de marque montre `747live` ou si d'autres URLs `www` affichent le même canonique. Un fournisseur de paris associé à un site humour/EdTech est un risque d'image, et un risque de confiance si le canonique s'étend.
- **Code : sain.** Canonicals absolus en dur sur toutes les pages (`blog/[slug]/page.tsx` l.35, `layout.tsx` l.67 `metadataBase` apex, listes, fiches) ; 301 `www` vers apex dans `middleware.ts` l.105-109 (chemin et query conservés). Rien à corriger côté balises.

## 4. Recommandations classées

| # | Action | Qui | Quand |
|---|---|---|---|
| 1 | Search Console : inspecter en direct (« Tester l'URL en direct ») `https://www.deviens-marrant.fr/blog/comment-devenir-drole` et `https://www.deviens-marrant.fr/` ; noter le canonique choisi et la page de référence. Si « Page avec redirection » avec canonique apex : anomalie résolue | Thomas (capture, 5 min) | Immédiat |
| 2 | Reproduire par l'API d'inspection sur 5 URLs apex (accueil, `/blog`, 3 articles) puis sur 3 URLs `www` : l'anomalie est-elle isolée à `www` ? Refaire à J+3 et J+7 | @data-analyst / @seo | 13/10 puis 16/10 et 20/10 |
| 3 | Cloudflare (lecture) : DNS de `www` (aucun enregistrement orphelin, proxy actif), Workers > Domaines personnalisés (`deviens-marrant.fr` et `www` rattachés au Worker `marrant` uniquement), journal d'audit autour du 30/09 | Thomas ou @infrastructure | Cette semaine |
| 4 | Recherche Google manuelle : `site:deviens-marrant.fr`, `"deviens-marrant.fr" 747live`, deux phrases du pilier entre guillemets. Capture si `747live` ou une copie apparaît | Thomas | Cette semaine |
| 5 | Vérifier que l'URL `*.workers.dev` renvoie bien `noindex` (comme annoncé dans `wrangler.jsonc`) : seconde surface de duplication possible `[À VÉRIFIER]` | @fullstack | Cette semaine |
| 6 | **Seulement si une copie ou un proxy est confirmé** : règles Cloudflare (WAF, rejet des `Host` hors `deviens-marrant.fr`/`www`, blocage des ASN ou IP du proxy identifiés dans les logs) ; signalement Google (formulaire spam « contenu copié / détournement » et DMCA via l'hébergeur ou Cloudflare Abuse), Bing en parallèle | @infrastructure + Thomas (formulaires) | Après preuve |
| 7 | Ne pas lancer de désaveu, de signalement spam ni de demande d'indexation sur `www` : aucun gain sans preuve ; l'URL `www` doit rester une redirection pure | tous | n/a |

Note : si #1 et #2 montrent un canonique apex ou un retour à la normale en 7 jours, clore comme artefact et consigner dans `docs/marrant/audits-history.md`.

## Handoff → @fullstack (point 5), @infrastructure (points 3 et 6), @data-analyst (point 2)
- **Fichier produit** : `/home/user/Marrant/docs/seo/anomalie-canonique-747live-13-10.md` (aucun autre fichier modifié, pas de commit).
- **Décision** : pas de changement de code ni de règle Cloudflare tant qu'aucune copie n'est prouvée.
- **Points d'attention** : limites WebSearch ; crt.sh et Wayback indisponibles ; la bascule du 30/09 est la fenêtre suspecte ; `REPLIT_ACTIONS.md` à mettre à jour seulement si une règle Cloudflare est posée.

## Reproduction par l'API (session, 13/10 ~06:50 UTC)

| URL | Couverture | Dernière exploration | Canonique Google |
|---|---|---|---|
| `https://www.deviens-marrant.fr/` | Page avec redirection | 20/09 | `https://deviens-marrant.fr/` (correct) |
| `https://deviens-marrant.fr/` | Envoyée et indexée | 09/10 | la même (correct) |
| `https://www.deviens-marrant.fr/blog` | Page avec redirection | 11/08 | `https://deviens-marrant.fr/blog` (correct) |
| `https://www.deviens-marrant.fr/quiz-humour` | Google ne reconnaît pas cette URL | jamais | aucun |
| `https://deviens-marrant.fr/quiz-humour` | **Détectée, actuellement non indexée** | jamais | aucun |

**Lecture** : l'anomalie 747live est isolée à une seule URL `www` (le pilier) ; les autres URL `www` ont le bon canonique. Gravité faible confirmée ; recontrôle avec le J+14 du pilier (20/10). **Constat annexe** : `/quiz-humour`, destination des posts X du mercredi, est « Détectée, actuellement non indexée » (sans effet sur le trafic social, à traiter côté SEO : liens internes et sitemap) `[@seo]`.
