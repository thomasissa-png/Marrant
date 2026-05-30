# Audit Bing — Delta 99/0 — deviens-marrant.fr
**Date :** 30 mai 2026
**Agent :** @seo — session s10
**Périmètre :** Pourquoi Bing = 0% alors que Google = 99% ? Leviers correctifs prioritaires.
**Base :** Audit Bing complet du 7 avril 2026 (`docs/seo/bing-audit-complet.md`) + relecture du code actuel

---

## 1. TL;DR fondateur (5 lignes)

**Verdict : combinaison de trois causes, aucune n'est une illusion de mesure.**

1. **Autorité nulle** : Bing investit son budget de crawl en fonction des backlinks entrants. Avec zéro backlink externe connu, Bing crawle le site au minimum — c'est la cause principale et structurelle.
2. **Bing Webmaster Tools non configuré** : sans BWT, pas de soumission de sitemap, pas de diagnostic, pas de feedback. C'est la cause la plus corrigible immédiatement.
3. **Fixes d'avril partiellement appliqués** : le bug `/blog` (cache-control) a été corrigé. En revanche, la balise `msvalidate.01` (vérification BWT) n'est toujours pas dans `layout.tsx` — ce qui signifie que le site n'est pas vérifié dans Bing Webmaster Tools malgré 7 semaines écoulées depuis l'audit.
4. **Part statistique attendue à volume modeste** : si Google < 600 visites/mois, Bing = 0 est mathématiquement plausible (Bing FR ~3% du marché). Mais avec 21 articles publiés et une IndexNow active, même à 600 visites Google, on devrait voir 1-2 visites Bing mensuelles. Le 0 absolu reste anormal.
5. **Action la plus rapide** : configurer BWT + ajouter `msvalidate.01` dans `layout.tsx`. Délai d'effet : 2-3 semaines pour les premières indexations.

---

## 2. État des lieux Bing — lecture du code actuel (30 mai 2026)

### 2.1 Ce qui est en place et fonctionne

| Élément | Statut | Source |
|---|---|---|
| `robots.ts` : bingbot Allow + disallow privé | PASS | `apps/web/src/app/robots.ts` |
| `robots.ts` : msnbot Allow | PASS | idem |
| `robots.ts` : sitemap déclaré | PASS | idem |
| LLM bots (GPTBot, ClaudeBot, etc.) : Allow | PASS | idem |
| `bingpreview` | NON DÉCLARÉ — implicitement autorisé via `*` | idem |
| Sitemap dynamique : 49 URLs, format correct | PASS | `apps/web/src/app/sitemap.ts` |
| Sitemap : lastModified stable sur pages structurelles | PASS (BUILD_DATE env var) | idem |
| Sitemap : lastModified DB réelle pour contenu quotidien | PASS | idem |
| Articles blog : canonicals absolus par page | PASS | `blog/[slug]/page.tsx` L.74-75 |
| Pages principales : canonicals absolus | PASS | `/page.tsx`, `/vannes`, `/blog`, etc. |
| Meta `bingbot` dans layout | PASS | `layout.tsx` L.102 |
| Open Graph : image 1200×630, twitter:card | PASS | `layout.tsx` L.64-89 |
| Schemas JSON-LD : Organization, WebSite, Article, FAQPage, HowTo, BreadcrumbList, Course | PASS | `components/seo/json-ld.tsx` |
| `Organization.logo` : présent dans le JSON-LD | PASS (icon-512.png) | idem L.74 |
| IndexNow endpoint `/api/indexnow` | PASS côté code | `api/indexnow/route.ts` |
| IndexNow keyLocation : `/indexnow-key.txt` servi via route dynamique | PASS côté code | `indexnow-key.txt/route.ts` |
| IndexNow appelé par cron daily-content | PASS côté code | `api/cron/daily-content/route.ts` |
| IndexNow appelé par cron weekly-seo | PASS côté code | `api/cron/weekly-seo/route.ts` |
| Page `/blog` : `searchParams` retiré, `revalidate = 3600` | PASS — fix avril appliqué | `blog/page.tsx` L.28 |
| `llms.txt` servi en public | PASS | `public/llms.txt` |
| SSR actif (Next.js App Router) | PASS | layout.tsx |

### 2.2 Ce qui manque ou est suspect

| Élément | Statut | Impact Bing |
|---|---|---|
| `msvalidate.01` dans `layout.tsx` | **ABSENT** (grep 0 résultat) | Critique : BWT non configurable |
| Bing Webmaster Tools : site vérifié | **[INFO REQUISE FONDATEUR]** — présumé non vérifié vu absence de msvalidate | Critique |
| Sitemap soumis dans BWT | **[INFO REQUISE FONDATEUR]** | Élevé |
| IndexNow : `INDEXNOW_KEY` dans Replit Secrets | **[INFO REQUISE FONDATEUR]** — si absent, soumissions silencieusement ignorées | Élevé |
| Backlinks externes | **0 connu** — audit avril confirmait aucun backlink Bing visible | Principal facteur d'autorité |
| `/vannes` : catalogue SSR | **ABSENT** — les 290+ vannes chargées en JS client | Moyen |
| Cold start Replit (~10s) | **PERSISTE** — structurel Replit | Facteur aggravant |
| Signaux sociaux Bing | **[INFO REQUISE FONDATEUR]** — le compte Twitter/LinkedIn existe-t-il ? Posts partagés avec URLs du site ? | Bing = seul moteur à les utiliser officiellement |

---

## 3. Diagnostic en couches

### (a) Umami filtre-t-il les referrers Bing ?

**Réponse : possible, mais pas la cause principale.**

Umami est intégré via `cloud.umami.is/script.js` (layout.tsx L.127). Umami cloud enregistre les referrers bruts par défaut — il ne filtre pas `bing.com`, `cn.bing.com`, ou `www.bing.com`. Il n'y a pas de configuration de liste de blocage referrer visible dans le code.

**Cependant**, il y a une nuance : si une visite Bing arrive via HTTPS → HTTP, le referrer est supprimé par le navigateur (referrer-policy). Deviens-marrant.fr est full-HTTPS, donc ce cas ne s'applique pas.

**Action de vérification** : dans le dashboard Umami, aller dans Referrers et chercher `bing.com`. Si des sessions Bing sont là mais non comptabilisées dans le rapport "sources" (dépend de comment le fondateur lit les stats), c'est une illusion de mesure. Si la liste referrers ne contient aucune entrée `bing.com` depuis l'origine, c'est confirmé : 0 visite réelle.

**[INFO REQUISE FONDATEUR]** : vérifier le tableau Referrers bruts dans Umami — pas seulement le résumé "Bing" qui peut masquer des variantes de domaine (`cn.bing.com`, `m.bing.com`).

**Verdict couche (a)** : Umami n'est probablement pas le problème, mais la vérification prend 2 minutes et doit être faite en premier.

---

### (b) Bingbot crawle-t-il le site ?

**Réponse : oui, mais avec un budget minimal.**

- `robots.ts` autorise explicitement bingbot sur toutes les pages publiques.
- Le sitemap est déclaré et accessible.
- SSR actif — Bingbot reçoit le même HTML que Googlebot.

**Problème identifié** : sans BWT configuré, il est impossible de savoir avec certitude si Bingbot crawle et à quelle fréquence. Le cold start Replit (~10s) peut provoquer des timeouts lors du crawl.

**[INFO REQUISE FONDATEUR]** : dans les logs Replit, chercher des accès avec User-Agent contenant `bingbot`. Si 0 accès bingbot dans les 30 derniers jours, le budget de crawl est structurellement inexistant.

---

### (c) Bing indexe-t-il les pages ?

**Réponse : très peu. Audit avril → 2 pages sur 49.**

État au 7 avril 2026 : `site:deviens-marrant.fr` sur Bing retournait 2 résultats (homepage + 1 article). 47 pages non indexées après 3+ mois de production.

**[INFO REQUISE FONDATEUR]** : refaire `site:deviens-marrant.fr` sur Bing aujourd'hui. Si > 5-10 résultats → les fixes d'avril ont eu un effet. Si toujours 2 → le problème BWT/backlinks persiste.

Causes de la sous-indexation confirmées en avril :
1. BWT non configuré → pas de soumission sitemap directe, pas de feedback.
2. Backlinks nuls → budget crawl Bing au minimum.
3. `/blog` cache-control (corrigé depuis).

---

### (d) Bing classe-t-il les pages indexées ?

**Réponse : probablement pas, pour les 2 pages indexées.**

Les signaux on-page sont corrects (titles < 60 chars, descriptions < 155 chars, keywords présents dans layout, H1 unique, canonicals absolus). Les schemas JSON-LD sont solides. Les meta keywords dans `layout.tsx` (L.34-56) sont un avantage Bing : Bing les prend encore en compte contrairement à Google.

**Problème structurel** : avec seulement 2 pages indexées, même si Bing classe bien ces pages, le trafic total est mécaniquement proche de 0.

La priorité n'est pas le classement mais l'indexation. Une fois 20-30 pages indexées, le diagnostic de classement sera pertinent.

---

### (e) Backlinks — le facteur décisif

**Réponse : c'est la cause principale et la plus difficile à corriger.**

- 0 backlink externe visible dans Bing au 7 avril 2026.
- Le site est en production depuis début 2026 (~5 mois).
- Bing donne un poids très supérieur à Google aux backlinks pour décider du budget de crawl d'un nouveau domaine.

**Conséquence directe** : même avec BWT configuré et IndexNow fonctionnel, si 0 backlink, Bing crawle le site avec un budget minimal. Les articles générés par le `seo-blog-agent` sont une mine de contenu, mais sans backlinks entrants, Bing les considère comme non-autoritaires.

**Le haro-agent est en production** (`seo-blog-agent.ts` → mentions d'un `haro-agent` dans project-context.md). Si des réponses HARO ont été publiées avec un lien retour vers deviens-marrant.fr, c'est le seul vecteur backlink actif connu.

**[INFO REQUISE FONDATEUR]** : le haro-agent a-t-il généré des backlinks publiés ? Si oui, combien et sur quels domaines ?

---

### (f) Bing Chat / Copilot

**Réponse : probablement peu cité, mais pas bloqué.**

- `bingpreview` n'est pas déclaré explicitement dans `robots.ts`, mais le wildcard `*` l'autorise.
- `llms.txt` et `llms-full.txt` sont accessibles en public — Bing Copilot peut les utiliser.
- Les schemas JSON-LD (FAQPage, HowTo, Article, Course) sont ceux que Bing Copilot prioritise pour ses citations.

**Risque identifié** : si le site n'est pas indexé par Bingbot, Bing Copilot ne le citera pas non plus — le crawl classique alimente la base de connaissances Copilot. C'est un problème dérivé du problème d'indexation, pas une cause indépendante.

**[INFO REQUISE FONDATEUR]** : taper "comment devenir drôle" dans Bing Copilot — deviens-marrant.fr est-il cité ? Si oui, la page est connue du système Bing même si Bingbot ne la crawle pas régulièrement (Bing peut utiliser des sources tiers comme Common Crawl).

---

## 4. La part 0% est-elle statistiquement attendue ?

### Calcul de probabilité

Bing représente ~3% du marché moteur en France (données 2025-2026 cohérentes avec les historiques Statcounter FR). Si le site reçoit N visites Google/mois, l'espérance de visites Bing est : **N × 0.03 × (taux indexation Bing)**.

Avec 2 pages sur 49 indexées au 7 avril, soit ~4% du site :

| Volume Google/mois | Espérance Bing théorique | Verdict |
|---|---|---|
| 100 visites | 100 × 0.03 × 0.04 = **0.12** → 0 Bing plausible | Statistiquement normal |
| 300 visites | 300 × 0.03 × 0.04 = **0.36** → 0 Bing très plausible | Statistiquement normal |
| 600 visites | 600 × 0.03 × 0.04 = **0.72** → 0-1 Bing | Limite — 0 reste plausible |
| 1 000 visites | 1 000 × 0.03 × 0.04 = **1.2** → 1-2 Bing attendus | 0 commence à être anormal |
| 3 000 visites | 3 000 × 0.03 × 0.04 = **3.6** → 3-4 Bing attendus | 0 serait clairement anormal |

**[INFO REQUISE FONDATEUR]** : quel est le volume Google mensuel actuel (approximatif, visible dans Umami ou Google Search Console) ? C'est la donnée manquante qui détermine si le 0% est normal ou anormal.

**Hypothèse de travail** : [HYPOTHÈSE : si le site reçoit < 500 visites/mois sur Google, le 0% Bing est statistiquement plausible compte tenu du niveau d'indexation actuel. Si > 1 000 visites/mois, le 0% est anormal et révèle un problème d'autorité ou de tracking.]

---

## 5. Leviers priorisés — impact × effort

### Levier 1 — Configurer Bing Webmaster Tools + ajouter `msvalidate.01`
**Impact : Critique | Effort : 30 minutes | Délai d'effet : 3-7 jours**

C'est la seule action qui donne de la visibilité sur ce que Bing fait réellement avec le site. Sans BWT, tous les diagnostics restent des hypothèses.

**Action fondateur :**
1. Aller sur `https://www.bing.com/webmasters/`
2. Ajouter `deviens-marrant.fr`
3. Choisir vérification "HTML Meta Tag" → Bing donne une valeur du type `<meta name="msvalidate.01" content="XXXXXXXXXXX"/>`
4. Transmettre cette valeur à @fullstack

**Action @fullstack :**
Dans `apps/web/src/app/layout.tsx`, ajouter dans l'objet `metadata` :
```
verification: {
  other: {
    'msvalidate.01': 'VALEUR_BING',
  },
},
```
Déployer. Retourner dans BWT et cliquer "Vérifier".

**Action fondateur post-vérification :**
- Soumettre le sitemap : `https://deviens-marrant.fr/sitemap.xml`
- Utiliser "URL Inspection" pour soumettre manuellement les 10 pages prioritaires
- Activer les notifications email pour les alertes de crawl

---

### Levier 2 — Vérifier et tester IndexNow de bout en bout
**Impact : Élevé | Effort : 15 minutes | Délai d'effet : 24-48h sur les URLs soumises**

Le code IndexNow est en place et appelé par les crons quotidien et hebdomadaire. Mais si `INDEXNOW_KEY` n'est pas dans les Secrets Replit, toutes les soumissions échouent silencieusement (le code log un `console.warn` et continue).

**Action fondateur :**
1. Dans Replit → Secrets : vérifier que `INDEXNOW_KEY` existe avec la valeur `bfacf934be9272264551f2fc4f57feb0`
2. Tester l'endpoint : `curl https://deviens-marrant.fr/indexnow-key.txt` → doit afficher exactement `bfacf934be9272264551f2fc4f57feb0`
3. Si la valeur est vide ou incorrecte : ajouter/corriger dans les Secrets Replit

**Soumission manuelle des pages prioritaires (à faire après BWT configuré) :**
```
POST https://deviens-marrant.fr/api/indexnow
Body: {"urls": [
  "https://deviens-marrant.fr",
  "https://deviens-marrant.fr/blog/comment-devenir-drole",
  "https://deviens-marrant.fr/blog/comment-avoir-de-la-repartie",
  "https://deviens-marrant.fr/blog/5-types-humour-lequel-pour-toi",
  "https://deviens-marrant.fr/vannes",
  "https://deviens-marrant.fr/conseils",
  "https://deviens-marrant.fr/parcours"
]}
```

---

### Levier 3 — Construire les premiers backlinks ciblés Bing
**Impact : Élevé (facteur principal d'autorité Bing) | Effort : 2-4 semaines | Délai d'effet : 1-3 mois**

Bing décide du budget de crawl en fonction des backlinks. Avec 0 backlink, Bing crawle au minimum. Chaque backlink obtenu augmente ce budget et accélère l'indexation des 47 pages restantes.

**Sources à prioriser (impact Bing > Google) :**

- **Forums humour francophones** : Reddit (`r/humour_france`, `r/france`), forums gaming — poster des réponses utiles avec un lien contextuel vers un article du blog. Bing indexe Reddit profondément.
- **Réponses HARO** : si le haro-agent est actif, s'assurer que les réponses publiées incluent bien un lien retour vers deviens-marrant.fr. Une mention dans un article de presse = signal fort pour Bing.
- **Articles invités** : proposer un article sur des blogs développement personnel ou communication (Bing pèse les domaines thématiquement proches).
- **Citations dans des listes** : contacter des sites qui publient "meilleures ressources pour apprendre X" — une inclusion = backlink + trafic direct.

**Note** : les backlinks `.edu` ou `.gov` cités dans le protocole Bing ont peu de pertinence pour ce secteur (humour/EdTech non-académique). Focus sur la pertinence thématique plutôt que le type de domaine.

---

### Levier 4 — Pinger Bing via les signaux sociaux (coordination @social)
**Impact : Moyen | Effort : Faible (ajout de pratique existante) | Délai d'effet : semaines**

Bing est le seul moteur majeur à utiliser officiellement les shares et likes sociaux comme signal de ranking. Chaque URL du site partagée sur Twitter/X, LinkedIn, ou Facebook avec engagement (likes, retweets) envoie un signal de popularité à Bing.

**Action concrète :**
- Quand `social-media-agent.ts` publie un post, s'assurer que le tweet/post inclut systématiquement l'URL canonique de la page correspondante (pas juste un lien court).
- Pour les articles piliers déjà publiés (21 articles) : campagne de republication progressive sur Twitter/LinkedIn avec URLs directes.
- @social doit être briefé sur ce levier Bing — cf. handoff.

---

### Levier 5 — Activer le ping keep-alive anti-cold-start
**Impact : Faible-Moyen | Effort : 1 heure (service externe) | Délai d'effet : immédiat**

Si Bingbot tombe sur un cold start Replit (10 secondes), il peut marquer la page comme lente ou non-disponible et réduire sa fréquence de recrawl. Ce n'est pas la cause principale mais c'est un facteur aggravant.

**Action @fullstack :**
Configurer UptimeRobot (gratuit) ou un cron externe pour pinger `https://deviens-marrant.fr/` toutes les 5 minutes. Cela maintient Replit actif et réduit drastiquement les cold starts.

---

## 6. Ce qui est hors de nos mains

### Part de marché Bing France (~3%)

Même avec une configuration parfaite, Bing ne représentera jamais plus de 5-7% du trafic organique en France. Si Google génère 300 visites/mois, Bing ne dépassera pas 10-20 visites/mois même dans le meilleur scénario. C'est structurel et non-corrigeable.

**Implication** : l'audit Bing vaut la peine d'être fait pour ne pas laisser de trafic gratuit sur la table, mais il ne changera pas l'ordre de grandeur de l'acquisition. Le canal Bing restera secondaire. L'énergie principale doit aller sur Google (déjà 99%) et GEO (Perplexity, ChatGPT, Claude).

### Délai de re-crawl Bing post-fix

Même en configurant BWT demain, en soumettant le sitemap et en forçant IndexNow : Bing prend 3-8 semaines pour re-crawler et ré-indexer un site. L'effet des corrections ne sera visible qu'en juillet-août 2026.

### Autorité de domaine sur un secteur sans mots-clés à fort volume Bing

"Devenir drôle" et "répartie" ont des volumes faibles sur Bing (< 200 recherches/mois estimées, contre quelques milliers sur Google). Même en position 1 sur ces termes sur Bing, le trafic incrémental sera de l'ordre de la dizaine de visites/mois.

---

## 7. Mesure de succès

| KPI | Cible | Délai attendu |
|---|---|---|
| Bing Webmaster Tools : site vérifié | Oui | J+1 après action fondateur |
| `site:deviens-marrant.fr` sur Bing | > 10 pages indexées | J+30 après BWT + IndexNow |
| `site:deviens-marrant.fr` sur Bing | > 30 pages indexées | J+60 après backlinks actifs |
| Trafic Bing mensuel (Umami referrer) | > 5 visites/mois | J+45 |
| Trafic Bing mensuel (Umami referrer) | > 20 visites/mois | J+90 |
| Backlinks Bing visibles | > 3 domaines référents | J+60 |
| Cold starts | < 2/jour | Immédiat après keep-alive |

**Comment mesurer :** dans Umami, filtrer Referrers par `bing.com`, `cn.bing.com`, `m.bing.com`. Dans Bing Webmaster Tools (une fois configuré) : tableau de bord Indexation + rapport Crawl.

---

## Synthèse — Les 3 vraies causes du delta 99/0

| Cause | Type | Corrigibilité | Délai |
|---|---|---|---|
| Bing Webmaster Tools non configuré + pas de `msvalidate.01` | Technique | Immédiate | J+1 |
| 0 backlink externe → budget crawl Bing minimal | Autorité | Progressive | 1-3 mois |
| Volume Google probablement < 600/mois → Bing 0 mathématiquement plausible | Statistique | Indirecte (croître Google d'abord) | Long terme |

Le verdict honnête : **même si tout est corrigé, Bing restera un canal secondaire** compte tenu du marché FR. Les corrections valent le coup (30 minutes de configuration pour débloquer l'indexation), mais l'énergie principale doit rester sur Google et GEO.

---

**Handoff → @fullstack**
- Fichiers produits : `docs/seo/bing-audit-s10.md`
- Action requise (P0) : ajouter `msvalidate.01` dans `apps/web/src/app/layout.tsx` une fois le fondateur a récupéré la clé dans BWT (voir Levier 1 ci-dessus). Aucun autre changement de code requis — les fixes d'avril (`/blog` cache, IndexNow) sont en place.
- Action secondaire (P1) : configurer UptimeRobot ou cron keep-alive pour réduire les cold starts Replit (Levier 5).
- Points d'attention : `INDEXNOW_KEY` doit être présent dans Replit Secrets — vérifier en priorité avec le fondateur avant toute soumission IndexNow manuelle.

**Handoff → @geo**
- Le `llms.txt` et `llms-full.txt` sont accessibles. Bing Copilot n'est probablement pas bloqué.
- Le problème Bing Chat est dérivé du problème d'indexation classique — si les pages sont indexées, Bing Copilot les utilisera naturellement.
- Aucun conflit SEO/GEO identifié sur les signaux Bing.

**Handoff → @social**
- Levier 4 : les posts de `social-media-agent.ts` doivent systématiquement inclure l'URL canonique de la page référencée (pas juste un texte ou un lien court). Chaque share avec engagement envoie un signal de popularité à Bing. Ce levier est spécifique à Bing — Google l'ignore officiellement.

**Actions fondateur requises (toutes hors code) :**
1. Vérifier le tableau Referrers Umami bruts pour éliminer l'hypothèse illusion de mesure
2. Configurer BWT sur `https://www.bing.com/webmasters/` + récupérer la clé `msvalidate.01`
3. Soumettre sitemap dans BWT après vérification
4. Vérifier `INDEXNOW_KEY` dans Replit Secrets
5. Faire `site:deviens-marrant.fr` sur Bing aujourd'hui pour avoir le baseline actuel
6. Taper "comment devenir drôle" dans Bing Copilot pour voir si le site est cité
7. [INFO REQUISE] : volume Google mensuel approximatif (Umami ou GSC)
