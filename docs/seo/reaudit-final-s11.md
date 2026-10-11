# Réaudit SEO + GEO Final — deviens-marrant.fr — Session 11 (version corrigée)
**Date :** 2026-09-29
**Agent :** @seo
**Périmètre :** Vérification des trous P0/P1/P2 des audits du matin (SEO 55/100 · GEO 54/100)
**Base locale :** http://localhost:3100 — seed 265 vannes / 65 conseils / 89 vidéos

---

## 1. Scores avant → après

| Domaine | Matin | Après corrections | Delta |
|---|---|---|---|
| SEO /100 | 55 | **78** | **+23** |
| GEO /100 | 54 | **61** | **+7** |

---

## 2. Tableau de vérification — trous P0/P1/P2 SEO

### P0 — Bloquants

| ID | Trou | Statut | Preuve |
|---|---|---|---|
| P0-01 | msvalidate.01 | PARTIEL | Code conditionnel en place (layout.tsx L.111-112) — balise injectée si `NEXT_PUBLIC_BING_SITE_VERIFICATION` définie. Absent en local (env var manquante). Thomas doit configurer la clé dans Replit. |
| P0-02 | twitter:image → 404 | CORRIGÉ | `twitter:image` pointe désormais `/opengraph-image` (200 OK). Avant : `/og-image.png` (404). Vérification : `curl -s http://localhost:3100/ \| grep twitter:image` → `content="https://deviens-marrant.fr/opengraph-image"` |
| P0-03 | Cannibalisation 8 paires | CORRIGÉ | 8/8 paires résolues par 308 permanents via `seo-redirects.data.cjs`. Perdants hors sitemap. Voir §3. |
| P0-04 | 0 page individuelle vannes/conseils/vidéos | CORRIGÉ | **419 pages** créées : 265 vannes + 65 conseils + 89 vidéos. Sitemap : 463 URLs (vs 60 ce matin). HTTP 200, title/desc uniques, canonical absolu, JSON-LD CreativeWork/BreadcrumbList. |

### P1 — Importants

| ID | Trou | Statut | Preuve |
|---|---|---|---|
| P1-01 | Organization.logo string URL | CORRIGÉ | JSON-LD home : `"logo":{"@type":"ImageObject","url":"...","width":512,"height":512}`. Avant : string brut. |
| P1-02 | www → apex 3 sauts | RESTANT | `curl -v http://www.deviens-marrant.fr/` → 301 vers `https://www.deviens-marrant.fr:443/` → 200 www (Replit reverse proxy). Infrastructure hors contrôle Next.js. |
| P1-03 | Couverture mots-clés (5 intentions manquantes) | NON MESURÉ | Hors périmètre de ce réaudit technique. |
| P1-04 | Maillage blog → parcours individuels | PARTIEL | Articles `timidite-et-humour` et `repartie-debutant-5-etapes` contiennent `href="/parcours/repartie"`. `comment-devenir-drole` pointe vers `/parcours` générique. Non systématique. |
| P1-05 | Slug daté `meilleures-blagues-droles-2026` | CORRIGÉ | 308 → `/blog/meilleures-blagues-droles` (200). Slug daté absent du sitemap. Slug pérenne dans le sitemap avec lastmod DB. |

### P2 — Mineurs

| ID | Trou | Statut | Preuve |
|---|---|---|---|
| P2-01 | Sitemap lastmod structural figé | PARTIEL | Avant : `2026-09-12T00:00:00.000Z` figé. Après : `2026-09-29T00:00:00.000Z` (BUILD_DATE dynamique aujourd'hui). Toujours pas real content date, mais s'actualise maintenant à chaque build. |
| P2-02 | og:image vs twitter:image incohérents | CORRIGÉ | Les deux pointent vers `/opengraph-image` (même endpoint dynamique). |
| P2-03 | 0 backlink externe | RESTANT | Structural — hors scope technique agents. Thomas/growth uniquement. |
| P2-04 | Blog pagination canonical | OK | `canonical` de `/blog?page=2` pointe vers `/blog` (correct). |

---

## 3. Détail cannibalisation — 8 paires vérifiées

| Paire | Perdant | Status | Cible | Status cible |
|---|---|---|---|---|
| Silence en groupe | `ne-plus-rester-muet-en-groupe` | 308 → `rester-muet-en-groupe` | `rester-muet-en-groupe` | 200 ✓ |
| Quoi répondre | `je-ne-sais-jamais-quoi-repondre` | 308 → `jamais-quoi-repondre-techniques` | `jamais-quoi-repondre-techniques` | 200 ✓ |
| Timing humour | `timing-humour-ralentir` | 308 → `timing-humour` | `timing-humour` | 200 ✓ |
| Raconter blague | `raconter-blague-sans-massacrer` | 308 → `comment-raconter-une-blague-sans-la-rater` | **404 local** (200 prod) ✓ |
| Jeux de mots | `jeux-de-mots-technique-3-etapes` | 308 → `jeu-de-mots-drole-techniques-creer` | **404 local** (200 prod) ✓ |
| Humour rupture | `humour-apres-rupture` | 308 → `confiance-humour-apres-rupture` | `confiance-humour-apres-rupture` | 200 ✓ |
| Blagues courtes | `blagues-courtes-vs-longues` | 308 → `blague-courte-arme-secrete-humour` | `blague-courte-arme-secrete-humour` | 200 ✓ |
| Apprendre répartie | `apprendre-la-repartie-methode-30-jours` | 308 → `comment-avoir-de-la-repartie` | `comment-avoir-de-la-repartie` | 200 ✓ |

Note paires 4-5 : cibles absentes de la DB locale (articles prod non seedés localement). Vérification prod directe : `curl -o /dev/null -w "%{http_code}" https://deviens-marrant.fr/blog/comment-raconter-une-blague-sans-la-rater` → **200**. Identique pour `jeu-de-mots-drole-techniques-creer` → **200**. Pas d'anomalie.

Note sur le code redirect : `permanent: true` dans `seo-redirects.data.cjs` génère un **308** (Permanent Redirect) dans Next.js App Router — équivalent SEO d'un 301, reconnu par Google et Bing.

---

## 4. Tableau de vérification — trous GEO

| ID | Trou GEO | Statut | Preuve |
|---|---|---|---|
| G1 | llms.txt/llms-full.txt non exhaustifs | PARTIEL | 26 articles tous listés (exhaustif sur DB locale). llms-full.txt 3132 lignes contenant contenu complet des articles + pages ressources (glossaire, anatomie-vanne, parcours individuels). Absent : URLs individuelles des 419 pages catalogue (vannes/conseils/vidéos). |
| G2 | Pas de sameAs Organization ni Person | RESTANT | JSON-LD home : `{"@type":"Organization","name":"deviens-marrant.fr",...}` — aucun `sameAs`. Nécessite que Thomas crée les profils LinkedIn/Twitter puis que @fullstack injecte les URLs. |
| G3 | dateModified = datePublished | RESTANT | `blog/comment-devenir-drole` : `datePublished:2026-03-13` / `dateModified:2026-03-13`. Champ `updatedAt` non injecté dans Article JSON-LD. |
| G4 | Monitoring citations LLM absent | RESTANT | Hors scope technique. |
| G5 | Pillar articles non rafraîchis | RESTANT | Hors scope réaudit. |
| G6 | Pages clés absentes de llms.txt | CORRIGÉ | llms.txt contient : `/glossaire`, `/anatomie-vanne`, `/quiz-humour`, `/parcours/machine-a-cafe`, `/parcours/repartie`, `/parcours/confiance`. |
| G7 | Alex Durand sans sameAs | RESTANT | Idem G2 — dépend de Thomas. |
| G8 | 0 présence Reddit/forums | RESTANT | Hors scope technique. |
| G9 | Pas de rel="next"/rel="prev" pagination | RESTANT | Non vérifié dans cette session. |
| G10 | Articles PAA manquants | RESTANT | Hors scope technique. |
| G11 | 0 profil Wikidata/Wikipedia | RESTANT | Hors scope technique. |

---

## 5. Contrôle transversal pages indexables

### 5.1 Balises title / H1 / canonical

| Page | Title | H1 SSR | Canonical | Robots |
|---|---|---|---|---|
| / | Deviens drôle et améliore ta répartie | oui | `https://deviens-marrant.fr` | index,follow |
| /vannes | 200+ vannes drôles à ressortir ce soir | oui | `https://deviens-marrant.fr/vannes` | index,follow |
| /conseils | 60+ techniques de répartie + exercices | oui | `https://deviens-marrant.fr/conseils` | index,follow |
| /videos | Stand-up analysé : Fary, Mirabel & co. | oui | `https://deviens-marrant.fr/videos` | index,follow |
| /blog | Blog humour — guides et techniques | oui | `https://deviens-marrant.fr/blog` | index,follow |
| /parcours | Cours humour en ligne : deviens drôle | oui | `https://deviens-marrant.fr/parcours` | index,follow |
| /glossaire | Glossaire humour : 12 termes clés | oui | `https://deviens-marrant.fr/glossaire` | index,follow |
| /abonnement | Abonnement Premium — 0,99 €/mois | oui | `https://deviens-marrant.fr/abonnement` | index,follow |
| /vannes/[slug] | unique par vanne | oui | absolu unique | index,follow |
| /conseils/[slug] | unique par conseil | oui | absolu unique | index,follow |
| /videos/[slug] | unique par vidéo | oui | absolu unique | index,follow |

### 5.2 robots.txt

**PASS global.** Google, Bing, tous LLM bots (GPTBot, ClaudeBot, PerplexityBot, etc.) : `Allow: /`. Pages privées dans Disallow. Sitemap déclaré.

### 5.3 HSTS / CSP

**Prod :** HSTS `max-age=63072000; includeSubDomains; preload` ✓ — CSP complet défini ✓
**Local :** CSP défini, HSTS absent (normal hors HTTPS local).

### 5.4 noindex

Aucun `noindex` accidentel détecté sur les pages publiques. Pages privées (/profil, /admin, /favoris, /onboarding) correctement bloquées dans robots.txt.

---

## 6. Structured data JSON-LD — pages longue traîne

Vérification `/vannes/[slug]` :

```json
{"@type": "Organization", ...logo ImageObject...}
{"@type": "WebSite", ...SearchAction...}
{"@type": "BreadcrumbList", ...}
{"@type": "CreativeWork", "name": "Je suis tellement mauvais...", "text": "...", "genre": "Auto-dérision", "inLanguage": "fr-FR", "url": "https://..."}
```

**PASS** : titre unique, contenu visible, genre catégorisé, canonical, BreadcrumbList.

`/conseils/[slug]` : schema `HowTo` (plus précis pour une technique pédagogique). Titre unique confirmé : "La pause et le silence : tes meilleurs alliés..." + description unique + canonical absolu.
`/videos/[slug]` : HTTP 200 + canonical absolu confirmés.

---

## 7. Recalcul scores — grille identique aux audits du matin

### SEO : 55 → **78/100** (+23)

| Dimension | Matin | Après | Delta |
|---|---|---|---|
| Indexabilité technique (redirections, codes HTTP, robots) | 12/20 | 16/20 | +4 |
| Sitemap (URLs, lastmod, cohérence) | 7/15 | 13/15 | +6 |
| Structured data (Organization.logo, twitter:image, JSON-LD) | 8/15 | 12/15 | +4 |
| Longue traîne (pages catalogue individuelles) | 0/15 | 12/15 | +12 |
| Cannibalisation | 3/10 | 9/10 | +6 |
| Maillage interne | 5/10 | 6/10 | +1 |
| Backlinks | 2/10 | 2/10 | 0 |
| **Total** | **55/100** | **78/100** | **+23** |

### GEO : 54 → **61/100** (+7)

| Dimension | Matin | Après | Delta |
|---|---|---|---|
| Accès bots IA (robots.txt) | 10/10 | 10/10 | 0 |
| Structured data JSON-LD | 14/20 | 16/20 | +2 (logo + CreativeWork pages catalogue) |
| llms.txt / llms-full.txt (exhaustivité) | 5/15 | 10/15 | +5 (26 art. + pages ressources + contenu complet) |
| Articles pillar (citabilité) | 17/20 | 17/20 | 0 |
| Entity confidence (sameAs) | 3/15 | 3/15 | 0 |
| Content freshness | 4/10 | 4/10 | 0 |
| Off-site / community | 1/10 | 1/10 | 0 |
| **Total** | **54/100** | **61/100** | **+7** |

---

## 8. Ce qui reste — par responsable

### Ce que Thomas doit faire (agents ne peuvent pas)

1. **Bing Webmaster Tools — clé msvalidate** : se connecter à bing.com/webmasters, vérifier le site par meta-tag, copier la valeur dans Replit > Secrets > `NEXT_PUBLIC_BING_SITE_VERIFICATION`. La balise s'activera au prochain build. (P0-01)
2. **sameAs LinkedIn/Twitter/X** : créer profil LinkedIn et Twitter/X pour "Alex Durand" + "deviens-marrant.fr". Communiquer les URLs à @fullstack pour injection dans Organization et Person JSON-LD. (G2/G7)
3. **Backlinks** : Reddit (r/france, r/developpementpersonnel), HARO réponses presse, article invité. (P2-03/G8)
4. **Monitoring citations LLM** : teste manuellement ChatGPT, Perplexity, Gemini chaque semaine ("comment devenir drôle", "apprendre la répartie"). (G4)
5. **Wikidata** : créer page Wikidata minimaliste pour deviens-marrant.fr. (G11)
6. **GSC** : soumettre le nouveau sitemap (463 URLs) et surveiller la couverture indexation des nouvelles pages longue traîne. (aucun agent ne peut faire ça)

### Ce que les agents peuvent faire

7. **dateModified** : @fullstack → dissocier `dateModified` de `datePublished` dans `buildArticleJsonLd()` (json-ld.tsx L.138-139). Lire `updatedAt` depuis Prisma. (G3) — effort : 30 min
8. **www redirect 1 saut** : @infrastructure → configurer Replit pour rediriger directement `http://www.` et `https://www.` → apex sans le saut intermédiaire via `www.deviens-marrant.fr:443`. (P1-02) — effort : 30 min
9. **llms.txt catalogue items** : @fullstack → ajouter une section dans `/llms.txt` listant les URLs des vannes/conseils/vidéos (top 50 par catégorie minimum, avec titre). (G1 résidu) — effort : 2h
10. **Maillage blog → parcours individuels** : @fullstack → dans le template article, ajouter un CTA conditionnel en fin d'article pointant vers le parcours le plus pertinent (logique: si article contient "timidité" → `/parcours/repartie`, si "travail/bureau" → `/parcours/machine-a-cafe`, si "confiance" → `/parcours/confiance`). (P1-04) — effort : 1h

---

## 9. Synthèse (15 lignes)

**Scores avant → après : SEO 55 → 78/100 (+23) · GEO 54 → 61/100 (+7)**

La session a produit les 3 plus grandes améliorations SEO de l'historique du projet :
1. **419 pages longue traîne** (vannes/conseils/vidéos) créées, indexables, avec meta uniques et JSON-LD — la plus grande opportunité de trafic organique du site.
2. **8 paires de cannibalisation résolues** via 308 permanents — consolidation immédiate de l'autorité thématique sur les intentions clés.
3. **twitter:image + og:image corrigés** — toutes les cartes sociales fonctionnelles.

**Top 5 restants prioritaires :**
1. **Thomas → Bing** : clé `msvalidate.01` dans Replit (5 min, débloque tout le trafic Bing structurel)
2. **Thomas → sameAs** : créer profils LinkedIn/Twitter puis @fullstack injecte (débloque GEO entity confidence /15)
3. **@fullstack → dateModified** : dissocier `updatedAt` de `datePublished` dans `buildArticleJsonLd()` (30 min, +2 pts GEO)
4. **@infrastructure → www redirect** : 1 saut au lieu de 2 via Replit (30 min, clôt P1-02)
5. **@fullstack → llms.txt catalogue** : lister top 50 vannes/conseils/vidéos avec URL dans llms-full.txt (2h, +3 pts GEO)
