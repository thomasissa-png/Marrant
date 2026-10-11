# Audit SEO Global — deviens-marrant.fr — Session 11
**Date :** 2026-09-29
**Agent :** @seo
**Périmètre :** Audit global tous thèmes (indexabilité, cannibalisation, maillage, mots-clés, structured data, perfs, Bing, backlinks, longue traîne catalogue)
**Branche auditée :** `claude/marrant-s10-session-recovery-CtZyw` — NOTE : sessions 8/9/10 non mergées dans master → la prod peut différer du code de la branche sur certains points.

---

## 1. Verdict global + Score

**Score : 55/100** (estimation — données GSC/trafic manquantes, voir Section 5)

| Période | Score | Source |
|---|---|---|
| Audit Bing avril 2026 | ~40/100 Bing | `bing-audit-complet.md` |
| Audit Bing s10 (30 mai 2026) | 50/100 global estimé | `bing-audit-s10.md` |
| **Audit global s11 (29 sept. 2026)** | **55/100** | Ce document |

**Progression : oui, mais insuffisante.** Le blog est passé de 21 à 42 articles (doublement) — c'est la seule progression mesurable. En revanche, les P0 identifiés en s10 (msvalidate.01, Organization.logo, og-image.png) ne sont PAS appliqués en prod. La cannibalisation a empiré (nouvelles paires créées par le seo-blog-agent hebdo sans contrôle sémantique). Les trous techniques structurels de s7/s8 restent ouverts.

---

## 2. Tableau des trous P0/P1/P2

| ID | Trou | Preuve | Impact | Fix proposé | Agent | Effort IA |
|---|---|---|---|---|---|---|
| **P0-01** | `msvalidate.01` absent en prod | Live HTML home : aucune balise msvalidate (grep 0 résultat) | Bing non configurable — 0 trafic Bing structurel | Ajouter dans layout.tsx metadata.verification | @fullstack | 5 min |
| **P0-02** | `twitter:image` pointe `/og-image.png` → 404 | `curl -I https://deviens-marrant.fr/og-image.png` = 404 | Toutes les cartes Twitter/X cassées → 0 engagement social partage | Créer `/public/og-image.png` 1200×630 OU changer twitter:image vers dynamic endpoint | @fullstack | 30 min |
| **P0-03** | Cannibalisation : 8 paires d'articles blog indexées (même intention) | Sitemap live : 2 URLs distinctes indexées pour chaque paire (liste section 3.3) | Dilution autorité thématique — Google arbitre entre les 2, les 2 sortent mal | Fusionner/redirect 301 ou différencier l'angle (section 3.3) | @seo + @copywriter | 2-4h |
| **P0-04** | Zéro URL individuelle pour vannes/conseils/vidéos | `/vannes/1` = 404 ; `/conseils/1` = 404 ; `/videos/1` = 404 (curl confirmé) | 290+ vannes, 66 conseils, 89 vidéos = 445+ pages longue traîne manquantes | Créer pages `/vannes/[slug]`, `/conseils/[slug]`, `/videos/[slug]` avec schema Thing/Article | @fullstack | 3-5j |
| **P1-01** | `Organization.logo` : string URL, pas ImageObject | JSON-LD home : `"logo":"https://deviens-marrant.fr/icon-512.png"` (pas `"@type":"ImageObject"`) | Knowledge Panel Google bloqué | Remplacer par `{"@type":"ImageObject","url":"...","width":512,"height":512}` | @fullstack | 15 min |
| **P1-02** | www → https redirect : 3 sauts (http://www → https://www → https://) | `curl -v http://www.deviens-marrant.fr/` : HTTP 301 → https://www.deviens-marrant.fr:443/ → 301 → https://deviens-marrant.fr/ | PageRank leak + lenteur perçue Bingbot (timeout possible) | Corriger redirect direct http://www → https:// sans www en 1 saut | @infrastructure | 30 min |
| **P1-03** | Couverture mots-clés : 5 intentions manquantes | keywords.md cible "cours humour en ligne", "coaching humour", "devenir drôle au travail", "stand-up débutant" — aucune URL blog ne couvre ces termes (grep 0 résultat sitemap) | Trafic informationnel perdu sur des mots-clés à intention forte | Créer 5 articles cluster sur ces intentions (section 3.5) | @copywriter | auto via seo-blog-agent |
| **P1-04** | Maillage interne : blog → parcours individuels absent | Analyse liens blog/comment-devenir-drole.html : /parcours linké globalement mais aucun lien vers /parcours/repartie, /parcours/machine-a-cafe, /parcours/confiance | Les parcours reçoivent 0 PageRank des articles | Ajouter CTA en fin d'article vers le parcours le plus pertinent | @fullstack / template article | 2h |
| **P1-05** | `meilleures-blagues-droles-2026` : slug daté → deviendra stale fin 2026 | Sitemap : `https://deviens-marrant.fr/blog/meilleures-blagues-droles-2026` lastmod 2026-03-19 | Perte ranking dès 2027 — Google pénalise les contenus datés non mis à jour | Migrer vers slug pérenne `/meilleures-blagues-droles` + 301 | @fullstack | 30 min |
| **P2-01** | Sitemap lastmod : 9 pages structurelles figées à 2026-09-12 | Sitemap XML : home, vannes, conseils, videos, blog → toutes à `2026-09-12T00:00:00.000Z` (BUILD_DATE env var) | Bing : date stable = signal OK. Google : date ne reflète pas les vraies mises à jour | Documenter que c'est intentionnel ou utiliser la vraie date de dernière modif DB | @fullstack | 30 min |
| **P2-02** | Favicon : `twitter:image` statique vs `og:image` dynamique = incohérence | home HTML : `og:image` = `/opengraph-image?a50de8d6f5ac2745` (dynamique) ; `twitter:image` = `/og-image.png` (statique, 404) | Double standard OG vs Twitter — cassé sur tous les réseaux utilisant twitter:image | Unifier vers le même endpoint dynamique ou créer la static | @fullstack | 20 min |
| **P2-03** | Backlinks : 0 backlink externe connu | Audit Bing s10 confirmait 0 ; pas de changement détecté (haro-agent actif mais résultats non confirmés) | Autorité domaine stagnante — premier levier de ranking sur mots-clés compétitifs | Activer campagne backlinks (Reddit, article invité, HARO) — voir backlink-strategy.md | @growth | continu |
| **P2-04** | Blog : 42 articles, pagination /blog?page=2 retourne 200 sans canonical article | curl /blog?page=2 = 200 ; canonical = /blog (OK) — mais contenu dupliqué si page 2 affiche des articles déjà sur page 1 | Duplicate content faible (canonical correct) mais expérience dégradée | Vérifier que page 2 affiche bien des articles distincts ; sinon ajouter noindex sur pages pagination > 1 | @fullstack | 1h |

---

## 3. Détails par thème

### 3.1 Indexabilité — codes HTTP, redirections, robots.txt

**robots.txt live (29 sept 2026) — PASS global :**
- bingbot : Allow / + Disallow /api/ /admin/ /profil /favoris ✓
- LLM bots (GPTBot, ClaudeBot, PerplexityBot, etc.) : tous Allow / ✓
- Sitemap déclaré ✓

**Redirections — ANOMALIE P1 :**
- `http://deviens-marrant.fr/` → `https://deviens-marrant.fr:443/` (port explicite, 1 saut) : OK techniquement mais port :443 explicite est inhabituel — à surveiller
- `http://www.deviens-marrant.fr/` → `https://www.deviens-marrant.fr:443/` (301) → `https://deviens-marrant.fr/` (301) : **3 sauts** (P1-02)
- Trailing slash : `/blog/` → `/blog` = **200** (pas de redirect) — cohérent mais peut créer doublons si des liens pointent avec trailing slash

**Codes HTTP pages principales :**
Toutes les pages auditées retournent 200. Aucun 404 détecté sur les URLs déclarées dans le sitemap.

**noindex :** Aucune page publique avec noindex inapproprié détecté. Pages privées (/profil, /admin, /onboarding) sont dans robots Disallow — PASS.

---

### 3.2 Sitemap

**60 URLs déclarées** (vs 49 en s10 — +11 articles nouveaux entre mai et sept 2026).

**lastmod :**
- Pages structurelles (home, vannes, conseils, videos, blog) : `2026-09-12T00:00:00.000Z` — figées à la date de build. Stable = signal OK pour Bing. Google peut interpréter cela comme "pas mis à jour depuis 17 jours" pour un site déclaré daily. **Risque P2.**
- Pages statiques (parcours, abonnement, glossaire, mentions légales) : `2026-03-27T00:00:00.000Z` — date réelle probable. OK.
- Articles anciens (avant cron) : dates de fév/mars 2026 — cohérent.
- Articles récents (post-cron) : timestamps DB réels avec heure (ex: `2026-05-04T00:12:29.731Z`) — **PASS**, signal de fraîcheur authentique.

**Anomalie :** `blague-courte-arme-secrete-humour` lastmod `2026-05-25T11:02:16.671Z` et `citation-drole` lastmod `2026-06-02T02:00:22.279Z` — ces deux articles ont des dates réelles récentes. Mais `jeu-de-mots-drole-techniques-creer` lastmod `2026-06-09T00:40:02.683Z` est le plus récent dans le sitemap. Aucun article publiable après le 9 juin 2026 n'est dans le sitemap — pourtant le seo-blog-agent hebdo tourne. **Trou : le cron weekly-seo publie-t-il mais ne met-il pas à jour le sitemap dynamique ?** [DONNÉE MANQUANTE — à vérifier Thomas]

---

### 3.3 Cannibalisation blog — 8 paires confirmées

Les 8 paires ci-dessous sont **toutes indexées** (dans le sitemap live, aucune n'est en noindex ou 404) et couvrent la même intention :

| Paire | URL 1 (slug) | URL 2 (slug) | Intention commune | Fix recommandé |
|---|---|---|---|---|
| Silence en groupe | `rester-muet-en-groupe` | `ne-plus-rester-muet-en-groupe` | "comment ne plus rester muet" | Garder `ne-plus-rester-muet` (intention positive) + 301 l'autre |
| Quoi répondre | `jamais-quoi-repondre-techniques` | `je-ne-sais-jamais-quoi-repondre` | "je sais pas quoi répondre" | Fusionner dans `jamais-quoi-repondre-techniques` + 301 l'autre |
| Timing humour | `timing-humour` | `timing-humour-ralentir` | "timing dans l'humour" | `timing-humour` = pilier + `timing-humour-ralentir` = cluster si angle distinct confirmé |
| Raconter une blague | `raconter-blague-sans-massacrer` | `comment-raconter-une-blague-sans-la-rater` | "comment raconter une blague" | Garder slug SEO-friendly `comment-raconter-une-blague-sans-la-rater` + 301 l'autre |
| Jeux de mots | `jeux-de-mots-technique-3-etapes` | `jeu-de-mots-drole-techniques-creer` | "techniques jeux de mots" | Garder `jeu-de-mots-drole-techniques-creer` (+ récent, lastmod DB) + 301 |
| Humour après rupture | `humour-apres-rupture` | `confiance-humour-apres-rupture` | "retrouver humour après rupture" | Différencier si angle distinct ; sinon 301 `humour-apres-rupture` → `confiance-humour-apres-rupture` |
| Blagues courtes | `blagues-courtes-vs-longues` | `blague-courte-arme-secrete-humour` | "blagues courtes" | Garder `blague-courte-arme-secrete-humour` (lastmod récent) + 301 l'autre |
| Apprendre la répartie | `apprendre-la-repartie-methode-30-jours` | `comment-avoir-de-la-repartie` | "apprendre répartie" | `comment-avoir-de-la-repartie` = pilier ; `methode-30-jours` = cluster si programme concret |

**Preuve :** toutes ces URLs apparaissent dans le sitemap live (`sitemap.xml` du 29 sept 2026) avec leurs propres lastmod distincts. Aucune n'est en canonical de l'autre.

**Impact estimé :** 16 pages se disputent l'autorité sur 8 intentions → autorité divisée par ~2 sur chaque intention cible.

---

### 3.4 Maillage interne

**Blog → catalogue** : l'article `/blog/comment-devenir-drole` lie vers /vannes (3x), /conseils (3x), /videos (3x), /parcours (3x), /abonnement (1x) — PASS sur les sections principales.

**Blog → parcours individuels** : aucun lien vers `/parcours/repartie`, `/parcours/machine-a-cafe`, `/parcours/confiance` dans l'article analysé. Ces parcours reçoivent 0 jus interne des articles. **P1-04.**

**Pages orphelines identifiées** :
- `/anatomie-vanne` : présente dans le sitemap, non linkée depuis `/blog/comment-devenir-drole` ni depuis les pages navigation analysées. À vérifier si linkée depuis `/vannes`.
- `/quiz-humour` : présente dans le sitemap, linkée depuis l'article analysé (1x `/quiz-humour`). OK.
- `/glossaire` : linkée depuis l'article (1x). OK.

**Profondeur de clic** : blog articles accessible en 2 clics (accueil → /blog → article). Parcours individuels en 2 clics (accueil → /parcours → sous-parcours). PASS.

---

### 3.5 Couverture mots-clés vs keywords.md

**Couverts** : "comment devenir drôle", "avoir de la répartie", "apprendre la répartie", "timing humour", "jeux de mots", "blagues drôles", "raconter une blague", "autodérision", "rester muet", "storytelling drôle", "timidité et humour".

**Trous confirmés (intentions non couvertes dans le sitemap)** :

| Mot-clé cible (keywords.md) | URL existante | Verdict |
|---|---|---|
| "cours humour en ligne" / "coaching humour" | Aucune | TROU — intention transactionnelle forte, 0 article |
| "devenir drôle au travail" | `/blog/blagues-travail-faire-rire-pro` existe | Partiel — titre orienté "blagues" pas "devenir drôle travail" |
| "stand-up français débutant" | Aucune | TROU — pourtant positionnement clé de la marque |
| "apprendre l'humour adulte" (persona Marc) | Aucune | TROU — intentions adulte/reconstruction absentes |
| "exercices répartie débutant" | `repartie-debutant-5-etapes` existe | OK — mais liée via cannibalisation avec `apprendre-la-repartie` |
| "blagues intelligentes sans être vulgaire" | Aucune | TROU — intention forte persona Sophie |

**Opportunité immédiate** : 4 articles à créer (coaching humour en ligne, stand-up débutant, humour adulte/reconstruction, blagues intelligentes non vulgaires). Seo-blog-agent peut les générer.

---

### 3.6 Données structurées JSON-LD

**Schémas présents en prod (homepage)** :
- `Organization` ✓ (mais logo = string, pas ImageObject — P1-01)
- `WebSite` avec SearchAction ✓
- `FAQPage` avec 12 questions/réponses ✓

**Schémas présents sur article blog** :
- `Organization` ✓
- `WebSite` ✓
- `Article` avec headline, datePublished, dateModified, author Person ✓
- `Person` (Alex Durand, jobTitle "Fondateur & Coach d'humour") ✓
- `FAQPage` ✓
- `HowTo` ✓
- `BreadcrumbList` ✓

**Anomalie Organization.logo** (P1-01) :
- Actuel : `"logo":"https://deviens-marrant.fr/icon-512.png"` (string)
- Requis Google Knowledge Panel : `"logo":{"@type":"ImageObject","url":"https://deviens-marrant.fr/icon-512.png","width":512,"height":512}`

**Article dateModified** : `"datePublished":"2026-03-13","dateModified":"2026-03-13"` — date de publication = date de modification = signal de contenu jamais mis à jour. Pour les pillar articles, mettre à jour `dateModified` à chaque révision.

---

### 3.7 Performances / Cache-Control / CWV

**Cache-Control headers live** :
- Pages app (home, blog, articles) : `cache-control: s-maxage=31536000, stale-while-revalidate` (CDN cache 1 an) — **PASS**
- Page `/blog` : `cache-control: s-maxage=3600, stale-while-revalidate` — cohérent avec `revalidate=3600` du code (fix s10 confirmé appliqué)
- Serveur : `Google Frontend` + `via: 1.1 google` → site derrière Google Cloud / Cloudflare/GFE — bon CDN
- `x-nextjs-cache: HIT` sur les pages statiques → ISR fonctionne, pages en cache ✓

**CWV** : aucun outil RUM disponible sans GSC. [DONNÉE MANQUANTE — demander Thomas les Core Web Vitals depuis GSC ou PageSpeed Insights]

**HTTPS** : `strict-transport-security: max-age=63072000; includeSubDomains; preload` — PASS.

---

### 3.8 Bing / IndexNow

**Régression par inaction (P0-01)** : `msvalidate.01` toujours absent de la prod HTML 4 mois après l'audit s10 qui documentait ce fix. Action non appliquée malgré handoff @fullstack documenté.

**IndexNow** : code en place côté branche. Clé `INDEXNOW_KEY` dans Replit Secrets non confirmée. [DONNÉE MANQUANTE — vérifier Thomas]

**État Bing** : [DONNÉE MANQUANTE — refaire `site:deviens-marrant.fr` sur Bing pour voir si indexation a progressé depuis les 2 pages d'avril]

---

### 3.9 Backlinks

**0 backlink externe connu** (état au 30 mai 2026 — non mis à jour depuis). `haro-agent` actif en production mais aucun résultat confirmé.

[DONNÉE MANQUANTE — Thomas : le haro-agent a-t-il généré des publications avec backlinks depuis mai ? Si oui, combien et sur quels domaines ?]

---

### 3.10 Longue traîne catalogue — opportunité majeure non exploitée

**Situation actuelle** : /vannes, /conseils, /videos = pages de liste sans URLs individuelles indexables.
- `/vannes/1` = 404 (confirmé curl)
- `/conseils/1` = 404 (confirmé curl)
- `/videos/1` = 404 (confirmé curl)

**Opportunité** : 290+ vannes × 66 conseils × 89 vidéos = potentiellement 445+ pages longue traîne avec des requêtes comme "vanne sur [thème]", "conseil humour [situation]", "analyse vidéo [humoriste]".

**Prérequis** : chaque page individuelle doit avoir un contenu substantiel (≥ 300 mots) pour éviter le thin content. Le champ `comedyTechnique` + `techniqueExplanation` + `howToApply` (ajoutés en s10) rend cela possible sans contenu additionnel.

---

## 4. Données manquantes à demander au fondateur

| # | Question | Pourquoi nécessaire |
|---|---|---|
| DM-01 | Volume trafic Google mensuel (Umami ou GSC) | Évaluer si Bing 0% est statistiquement normal ou anormal |
| DM-02 | Positions GSC sur "devenir drôle" et "avoir de la répartie" | Mesurer progression vers l'objectif #1 à 12 mois |
| DM-03 | Bing Webmaster Tools : configuré ? Pages indexées actuellement ? | Mesurer effet (ou non) des fixes depuis avril |
| DM-04 | `INDEXNOW_KEY` dans Replit Secrets : présent et correct ? | Valider que les soumissions IndexNow fonctionnent |
| DM-05 | haro-agent : backlinks publiés depuis mai 2026 ? Domaines ? | Seul vecteur backlink actif connu |
| DM-06 | Core Web Vitals (LCP, INP, CLS) depuis GSC ou PageSpeed | Diagnostiquer CWV sans accès RUM |
| DM-07 | Sitemap : pourquoi aucun article publié après le 9 juin dans le sitemap ? Le cron weekly-seo tourne-t-il encore ? | Détecter blocage potentiel dans la pipeline de publication |
| DM-08 | Umami : referrers Bing (bing.com, cn.bing.com, m.bing.com) dans les stats brutes | Confirmer ou infirmer le 0% Bing |

---

## 5. Handoff structuré

---
**Handoff → @orchestrator**

**Fichiers produits :**
- `/home/user/Marrant/docs/seo/audit-global-s11.md` (ce document)

**Décisions et faits établis :**
- Score 55/100 — légère progression vs s10 (contenu ×2) mais P0 techniques non corrigés
- 4 P0 actifs (msvalidate.01, twitter:image 404, cannibalisation 8 paires, 0 URLs longue traîne catalogue)
- 5 P1 actifs (Organization.logo, www redirect, mots-clés manquants, maillage parcours, slug daté)
- Sitemap : 60 URLs live, lastmod articles réels et cohérents, mais aucun article post-9 juin — anomalie à investiguer

**Actions immédiates pour @fullstack (P0) :**
1. Ajouter `msvalidate.01` dans `layout.tsx` (attente clé Thomas — DM-03)
2. Créer `/public/og-image.png` 1200×630 ou remplacer `twitter:image` par l'endpoint dynamique
3. Corriger `Organization.logo` : string → ImageObject dans le composant JSON-LD

**Actions pour @copywriter (P0-03 + P1-03) :**
1. Arbitrage cannibalisation 8 paires : décision garder/fusionner/301 pour chaque paire
2. Créer 4 articles manquants : "cours humour en ligne", "stand-up débutant", "humour adulte", "blagues intelligentes non vulgaires"

**Actions pour @infrastructure (P1-02) :**
1. Corriger la chaîne de redirect www : http://www → https:// (1 saut direct)

**Points d'attention :**
- Les sessions 8/9/10 ne sont PAS en production tant que Thomas n'a pas mergé et déployé → certains fixes code peuvent être en branche mais invisibles en prod
- La cannibalisation empire à chaque nouvelle session du seo-blog-agent hebdo : ajouter une vérification anti-cannibalisation dans le prompt du seo-blog-agent (comparer avec les slugs existants avant publication)
- Le trou longue traîne catalogue (P0-04) est le plus grand gain potentiel : 445+ pages. @fullstack doit prioriser après les P0 techniques immédiats

**Coordination @geo :**
- Pas de conflit SEO/GEO détecté. JSON-LD FAQPage, HowTo, Article sont déjà GEO-optimisés.
- DM-07 (sitemap post-juin) peut indiquer que le seo-blog-agent hebdo est bloqué — @geo vérifier aussi côté llms.txt si du nouveau contenu n'est pas déclaré

**Coordination @social (Bing) :**
- P0-01 (msvalidate.01) débloque Bing — coordonner avec @social pour booster les signaux sociaux Bing simultanément (shares URL canoniques dans les posts)

---

## Résumé P0/P1 — 15 lignes max

1. **P0 : twitter:image = 404** — `/og-image.png` inexistant, toutes les cartes Twitter/X cassées. Fix : créer le fichier ou changer vers l'endpoint dynamique. @fullstack.
2. **P0 : msvalidate.01 absent en prod** — Bing Webmaster Tools non configurable. Fix documenté en s10, jamais appliqué. @fullstack (attente clé Thomas).
3. **P0 : cannibalisation 8 paires d'articles** — 16 pages se disputent 8 intentions, autorité divisée. Décision fusion/redirect 301 requise. @seo + @copywriter.
4. **P0 : zéro URL longue traîne catalogue** — 290 vannes, 66 conseils, 89 vidéos sans page individuelle indexable. Opportunité ×445 pages. @fullstack.
5. **P1 : Organization.logo pas ImageObject** — Knowledge Panel Google bloqué. Fix 15 min JSON-LD. @fullstack.
6. **P1 : www redirect 3 sauts** — leak PageRank et timeout Bingbot potentiel. Corriger en 1 saut direct. @infrastructure.
7. **P1 : 4 intentions de mots-clés non couvertes** — "cours humour", "stand-up débutant", "humour adulte", "blagues non vulgaires". Articles à générer via seo-blog-agent.
8. **P1 : maillage interne blog → parcours individuels absent** — /parcours/repartie etc. reçoivent 0 jus. Ajouter CTA fin d'article.
9. **P1 : slug daté** `meilleures-blagues-droles-2026` → stale fin 2026. Migrer + 301.
10. **0 backlink confirmé** — priorité @growth long terme.
11. **Sitemap : aucun article post-9 juin** — seo-blog-agent hebdo potentiellement bloqué. Vérifier Thomas (DM-07).
12. **Trafic GSC/Umami non communiqué** — impossible de mesurer la progression vers l'objectif #1.
