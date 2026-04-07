# Audit Bing — deviens-marrant.fr
**Date :** 7 avril 2026  
**Agent :** @seo  
**Méthodologie :** vérifications live via curl + WebSearch sur les SERP Bing réelles  

---

## Résumé exécutif

**2 pages indexées sur 49 dans le sitemap.** Ce n'est pas un problème de patience — c'est un blocage technique actif. Trois causes identifiées, deux sont critiques et corrigeables en moins d'une heure.

---

## Section 1 — Crawl et accessibilité

### 1.1 — Site accessible et SSR

**PASS**

- HTTP 200, réponse en ~250ms (quand le CDN est chaud)
- Contenu textuel présent dans le HTML : `7 782 chars` de texte extractible sans exécuter de JS
- Le H1 "Deviens la personne la plus drôle du groupe." est dans le HTML initial
- Le titre et la meta description sont dans le `<head>` statique
- Next.js App Router avec rendu serveur actif : bingbot reçoit le même HTML que Mozilla

### 1.2 — robots.txt

**PASS avec warning**

```
User-Agent: bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /onboarding
Disallow: /profil
Disallow: /favoris

User-Agent: msnbot
Allow: /
```

- Bingbot et msnbot ont explicitement `Allow: /` — aucun blocage en place
- Le sitemap est déclaré en bas : `Sitemap: https://deviens-marrant.fr/sitemap.xml`
- WARNING mineur : `msnbot` n'a que `Allow: /` sans les disallow des pages privées (profil, admin). Ce n'est pas un problème d'indexation, mais harmoniser les deux entrées serait propre.

### 1.3 — sitemap.xml

**WARNING**

- 49 URLs présentes — couverture correcte
- Format XML valide, encodage UTF-8 correct
- Les `lastmod` sont réalistes (entre 2026-02-15 et 2026-04-07) — pas de dates futures
- **WARNING critique** : la homepage (`/`) et `/vannes` ont un `lastModified` qui change chaque jour (c'est la date du dernier `DailyContent` en DB). Bing interprète un `lastmod` qui bouge quotidiennement sur une page statique comme un signal de contenu instable / freshness gaming. Cela peut réduire la fréquence de crawl.

### 1.4 — Redirection www → non-www

**PASS**

```
HTTP/1.1 301 → https://deviens-marrant.fr/
```

Redirection 301 propre, pas de port parasite, pas de boucle. 

### 1.5 — Fichier de vérification IndexNow

**WARNING**

```
GET https://deviens-marrant.fr/indexnow-key.txt
→ bfacf934be9272264551f2fc4f57feb0
```

La clé est présente et non-vide. Mais le fichier est servi via une route dynamique Next.js (`/indexnow-key.txt/route.ts`) qui lit la variable d'environnement `INDEXNOW_KEY`. Si `INDEXNOW_KEY` n'est pas configurée dans les Secrets Replit, la route renvoie une chaîne vide et les soumissions IndexNow échouent silencieusement (le code affiche un `console.warn` mais continue).

**Action requise :** vérifier dans Replit Secrets que `INDEXNOW_KEY=bfacf934be9272264551f2fc4f57feb0` est bien configuré, et que la valeur dans Secrets correspond exactement à la valeur retournée par `/indexnow-key.txt`.

---

## Section 2 — Signaux on-page

### 2.1 — Homepage

**PASS**

| Élément | Valeur | Statut |
|---|---|---|
| `<title>` | "Deviens drôle et améliore ta répartie \| deviens-marrant.fr" | PASS (55 chars) |
| `<meta name="description">` | "Tu veux être la personne la plus drôle du groupe ? Vannes à ressortir..." | PASS (< 155 chars) |
| `<link rel="canonical">` | `https://deviens-marrant.fr` | PASS |
| `<meta name="robots">` | `index, follow` | PASS |
| `<meta name="bingbot">` | `index, follow, max-image-preview:large, max-snippet:-1` | PASS |
| H1 | "Deviens la personne la plus drôle du groupe." | PASS |
| Contenu textuel SSR | 7 782 chars | PASS |

Pas de `msvalidate.01` (méta de vérification Bing Webmaster Tools) — voir point 2.4.

### 2.2 — Page /vannes

**FAIL**

La page `/vannes` contient peu de contenu textuel substantiel : **2 717 chars**. Le HTML contient la section FAQ (4 Q/R) et les textes de cross-linking, mais **le catalogue de 290+ vannes n'est pas dans le HTML initial** — les vannes sont chargées via un appel API côté client après hydratation.

Ce que Bing indexe sur `/vannes` :
- Le titre, la description, la FAQ
- Quelques blocs de texte de cross-linking vers /parcours, /blog
- Aucune vanne individuelle

Ce que Bing ne voit pas :
- Les 290+ vannes (chargées en JS, non SSR)
- Les filtres par catégorie et leur contenu

Conséquence directe : la page /vannes est perçue par Bing comme une page quasi-vide avec un titre fort mais peu de contenu — signal négatif de qualité.

### 2.3 — Page /blog

**FAIL CRITIQUE**

```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
```

La page `/blog` est rendue en mode **totalement dynamique** — Bing ne peut pas la cacher, ne peut pas lui attribuer un score de fraîcheur, et la recrawlera à chaque fois depuis zéro.

**Cause identifiée dans le code :**

```typescript
// apps/web/src/app/(dashboard)/blog/page.tsx
export const revalidate = 3600; // Cette directive est ignorée !

export default async function BlogPage({
  searchParams,  // ← CETTE LIGNE est le problème
}: {
  searchParams: { category?: string };
}) {
```

En Next.js 14 App Router, accéder à `searchParams` dans les props d'une page serveur **force le rendu dynamique à chaque requête**, annulant `revalidate = 3600`. Next.js génère alors le header `cache-control: private, no-cache, no-store` que Bing ne peut pas indexer correctement.

Toutes les autres pages (/, /vannes, /conseils, /videos, /parcours, /glossaire, /abonnement) retournent `s-maxage=31536000` — seulement `/blog` est affectée.

### 2.4 — Articles de blog

**PASS partiel**

```
/blog/comment-devenir-drole: cache-control: s-maxage=3600
```

Les articles individuels sont correctement mis en cache (ISR, revalidation 1h). Contenu textuel : 10 009 chars, structure H1/H2 propre, 7 schemas JSON-LD présents. C'est la partie la mieux faite du site côté SEO technique.

---

## Section 3 — Signaux qualité

### 3.1 — Indexation Bing actuelle

**FAIL CRITIQUE**

```
WebSearch "site:deviens-marrant.fr" → 2 résultats
```

- `https://deviens-marrant.fr/` (homepage)
- `https://www.deviens-marrant.fr/blog/5-types-humour-lequel-pour-toi`

Sur 49 URLs dans le sitemap, **47 ne sont pas indexées**. Le site est en production depuis début 2026, soit 3+ mois. Ce niveau d'indexation est anormalement bas.

### 3.2 — Visibilité sur Bing pour les mots-clés cibles

**FAIL**

- Recherche "comment devenir drole" sur Bing : deviens-marrant.fr absent du top 10
- Recherche "deviens marrant" sur Bing : seuls 4 URLs retournées (blog, glossaire, 5-types-humour, comment-devenir-drole) — uniquement en requête `site:` ciblée

### 3.3 — Concurrents en position sur Bing

Sur "comment devenir drole" :
- Olivier Roland (olivier-roland.com) — DA fort, présence de longue date
- France Info (culture)
- Pas de site dédié humour/stand-up en français en top 10

Opportunité réelle : le segment est libre. Le problème n'est pas la concurrence, c'est l'indexation.

---

## Section 4 — Erreurs techniques

### 4.1 — Headers HTTP et X-Robots-Tag

**PASS**

Aucun `X-Robots-Tag: noindex` dans les headers HTTP. Le CSP, HSTS, et les autres headers de sécurité sont correctement configurés et n'interfèrent pas avec l'indexation.

Double `Strict-Transport-Security` dans les headers (l'un de Next.js, l'un de la couche Replit/Google Frontend) — sans impact sur l'indexation.

### 4.2 — Cloaking accidentel

**PASS**

Avec le User-Agent `Mozilla/5.0 (compatible; bingbot/2.0; ...)`, le site renvoie exactement le même HTML qu'avec un UA Mozilla normal :
- Taille : 81 737 chars (identique)
- Contenu textuel : 7 782 chars (identique)
- Aucune détection d'UA côté serveur détectée

### 4.3 — Temps de réponse

**WARNING**

| Test | Temps total |
|---|---|
| Test à froid (cold start Replit) | ~10 secondes |
| Tests suivants (CDN chaud) | 90ms–1 500ms |

Le cold start Replit peut atteindre **10 secondes**. Si Bingbot frappe le site pendant un cold start, il peut recevoir un timeout ou une réponse très lente — signal négatif. En revanche, quand le CDN est chaud, le TTFB est de 248ms, ce qui est acceptable.

Replit met le serveur en veille après une période d'inactivité. Bingbot peut se heurter à ces cold starts régulièrement (il ne crawle pas en continu). Ce n'est pas la cause principale de la non-indexation, mais c'est un facteur aggravant.

### 4.4 — Sitemap déclaré dans robots.txt

**PASS**

```
Sitemap: https://deviens-marrant.fr/sitemap.xml
```

Déclaré correctement en dernière ligne de robots.txt.

### 4.5 — Schemas JSON-LD

**PASS**

Sur `/blog/comment-devenir-drole` : 7 schemas validables.

```
Organization, WebSite, Article, Person, FAQPage, HowTo, BreadcrumbList
```

Les schemas sont syntaxiquement corrects (validables via Rich Results Test Google). Bing les interprète pour les rich snippets — aucun problème détecté.

### 4.6 — Vérification Bing Webmaster Tools

**FAIL — PROBLÈME MANQUANT DEPUIS LE DÉPART**

**Aucune meta `msvalidate.01` n'est présente sur le site.**

```bash
curl https://deviens-marrant.fr/ | grep msvalidate → 0 résultats
```

Sans vérification Bing Webmaster Tools, le site ne peut pas :
- Soumettre le sitemap directement à Bing (via l'interface)
- Voir les erreurs de crawl Bing
- Voir quelles pages Bing a tenté d'indexer
- Recevoir les alertes de problèmes d'indexation

**C'est probablement la cause principale du faible nombre d'indexations.** Bing crawle le web de manière autonome, mais sans BWT configuré, il n'y a aucun moyen de forcer l'indexation, de diagnostiquer les blocages, ou de soumettre le sitemap via l'interface officielle.

---

## Section 5 — Contenu et autorité

### 5.1 — H1 et contenu textuel de la homepage

**PASS partiel**

- H1 présent et unique : "Deviens la personne la plus drôle du groupe."
- Contenu textuel substantiel visible : sections "Ton contenu du jour", "Tout ce qu'il te faut pour progresser", FAQ, CTAs
- WARNING : le contenu du jour (vanne + conseil + vidéo du jour) est chargé via API côté client — Bing ne le voit pas dans le HTML initial

### 5.2 — Backlinks et autorité de domaine

**FAIL**

Aucun backlink externe visible dans les résultats Bing. Le site est récent (début 2026), pas encore cité par d'autres sites. C'est le facteur d'autorité le plus difficile à corriger rapidement, mais il explique en partie pourquoi Bing est plus lent que Google à indexer.

Google est plus agressif pour indexer les nouveaux sites même sans backlinks. Bing attend des signaux d'autorité externe avant d'investir dans le crawl complet d'un nouveau domaine.

---

## Synthèse des résultats

| # | Vérification | Statut | Criticité |
|---|---|---|---|
| 1.1 | Site accessible et SSR | PASS | — |
| 1.2 | robots.txt bingbot | PASS | — |
| 1.3 | sitemap.xml | WARNING | Moyen |
| 1.4 | Redirection www → non-www | PASS | — |
| 1.5 | Fichier IndexNow | WARNING | Moyen |
| 2.1 | Meta tags homepage | PASS | — |
| 2.2 | Contenu /vannes (SSR) | FAIL | Élevé |
| 2.3 | Cache-control /blog | FAIL CRITIQUE | Bloquant |
| 2.4 | Articles blog (ISR) | PASS partiel | — |
| 3.1 | Indexation Bing actuelle | FAIL CRITIQUE | Bloquant |
| 3.2 | Visibilité mots-clés cibles | FAIL | Élevé |
| 4.1 | Headers HTTP / X-Robots | PASS | — |
| 4.2 | Cloaking accidentel | PASS | — |
| 4.3 | Temps de réponse (cold start) | WARNING | Moyen |
| 4.4 | Sitemap dans robots.txt | PASS | — |
| 4.5 | Schemas JSON-LD | PASS | — |
| 4.6 | Vérification Bing Webmaster Tools | FAIL CRITIQUE | Bloquant |
| 5.1 | H1 et contenu homepage | PASS partiel | — |
| 5.2 | Backlinks et autorité | FAIL | Moyen-long terme |

---

## TOP 3 — Actions prioritaires pour débloquer l'indexation Bing

### ACTION 1 — Configurer Bing Webmaster Tools (30 minutes)

**C'est l'action la plus urgente et la plus impactante.**

1. Aller sur https://www.bing.com/webmasters/
2. Se connecter avec un compte Microsoft
3. Ajouter le site `deviens-marrant.fr`
4. Choisir la méthode de vérification "XML meta tag" — Bing donne une balise du type `<meta name="msvalidate.01" content="XXXXXXX"/>`
5. Dans `apps/web/src/app/layout.tsx`, ajouter dans `export const metadata`:
```typescript
verification: {
  other: {
    'msvalidate.01': 'VALEUR_DONNEE_PAR_BING',
  },
},
```
6. Déployer, vérifier dans BWT
7. Dans BWT, soumettre le sitemap : `https://deviens-marrant.fr/sitemap.xml`
8. Utiliser l'outil "URL Inspection" dans BWT pour demander l'indexation manuelle des 10 pages les plus importantes

Sans cette étape, on navigue à l'aveugle. BWT est la seule interface qui montre pourquoi Bing ne crawle pas certaines pages.

---

### ACTION 2 — Corriger le cache-control de /blog (15 minutes de code)

**La page /blog est non-cacheable à cause de `searchParams` dans les props.**

**Correction dans `apps/web/src/app/(dashboard)/blog/page.tsx` :**

```typescript
// AVANT (force le rendu dynamique, désactive le cache)
export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category;

// APRÈS — lire searchParams via la prop de manière compatible ISR
// Ne pas déclarer searchParams dans la signature du composant
// Les filtres de catégorie doivent être gérés côté client (useState + URL params)
export default async function BlogPage() {
  // Supprimer le filtrage côté serveur par searchParams
  // Le filtre par catégorie devient un filtre client-side (JavaScript)
  // Le contenu complet de la liste est SSR, le filtrage est client-side
```

**Ou alternative plus propre** : garder le filtrage serveur mais utiliser `export const dynamic = 'force-static'` avec `generateStaticParams` pour les catégories connues.

**Résultat attendu :** `/blog` passera de `private, no-cache` à `s-maxage=3600` — cohérent avec les articles individuels. Bingbot peut crawler et cacher cette page.

---

### ACTION 3 — Vérifier et forcer la soumission IndexNow (10 minutes)

**Le système IndexNow est en place mais potentiellement non fonctionnel si `INDEXNOW_KEY` n'est pas dans les Secrets Replit.**

1. Dans Replit, aller dans l'onglet Secrets
2. Vérifier que `INDEXNOW_KEY` existe avec la valeur `bfacf934be9272264551f2fc4f57feb0`
3. Tester que la route renvoie bien la clé : `curl https://deviens-marrant.fr/indexnow-key.txt` → doit afficher exactement `bfacf934be9272264551f2fc4f57feb0`
4. Faire une soumission manuelle via l'API IndexNow pour les pages prioritaires :
```bash
curl -X POST https://deviens-marrant.fr/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urls": [
    "https://deviens-marrant.fr",
    "https://deviens-marrant.fr/blog",
    "https://deviens-marrant.fr/blog/comment-devenir-drole",
    "https://deviens-marrant.fr/blog/comment-avoir-de-la-repartie",
    "https://deviens-marrant.fr/blog/5-types-humour-lequel-pour-toi",
    "https://deviens-marrant.fr/vannes",
    "https://deviens-marrant.fr/conseils"
  ]}'
```
5. Vérifier dans la réponse que `status: 200` (Bing a accepté) et non une erreur 422 ou 400

---

## Points d'attention supplémentaires (non bloquants)

### /vannes sans contenu SSR

Bing voit une page `/vannes` avec un titre "290+ vannes" mais n'a accès à aucune de ces vannes dans le HTML. La promesse n'est pas tenue dans le rendu serveur. À moyen terme, il faudrait soit un rendu SSR des 10-20 premières vannes, soit une page statique /vannes/populaires avec du contenu SSR substantiel.

### Cold start Replit

Bing peut tomber sur le cold start (10s) et marquer la page comme "lente". Il n'y a pas de solution simple sans changer d'hébergement — mais garder le site actif via un ping toutes les 5 minutes (cron Replit ou service externe comme UptimeRobot) réduit les cold starts.

### Absence de Bing Webmaster Tools depuis le lancement

Ceci aurait dû être configuré au jour 1 du lancement. Sans BWT, tous les signaux envoyés par IndexNow n'ont aucun moyen d'être diagnostiqués en cas d'échec. Les 3 mois de retard s'expliquent en partie par cette absence de configuration.

### Backlinks

Bing donne plus de poids aux backlinks que Google pour décider du budget de crawl. Avec 0 backlink externe visible, Bing crawle le site avec un budget minimal. Chaque backlink obtenu (même d'un forum humour, d'un Reddit francophone, d'une newsletter) va augmenter ce budget et accélérer l'indexation des 47 pages restantes.

---

## Chronologie réaliste après correction

| Délai | Ce qui se passe |
|---|---|
| J+0 | BWT configuré, sitemap soumis, IndexNow forcé sur les 10 pages prioritaires |
| J+3 à J+7 | Bing confirme la vérification, commence à crawler les pages soumises |
| J+14 | Premier rapport BWT disponible — erreurs de crawl visibles s'il en reste |
| J+30 | Indexation progressive des articles blog (potentiellement 15-20 pages) |
| J+60 | Indexation complète si les problèmes /blog et /vannes sont corrigés |

Sans Action 1 (BWT), les Actions 2 et 3 auront un effet limité — Bing crawle de manière autonome mais très lentement pour les nouveaux sites sans signaux d'autorité.

---

**Handoff → @fullstack**

- Fichiers produits : `docs/seo/bing-audit-complet.md`
- Décisions prises : 3 causes de blocage identifiées et documentées avec code exact
- Points d'attention techniques à implémenter :
  1. Ajout `msvalidate.01` dans `apps/web/src/app/layout.tsx` (après avoir récupéré la clé dans BWT)
  2. Fix `searchParams` dans `apps/web/src/app/(dashboard)/blog/page.tsx` — filtrage catégorie à passer en client-side pour débloquer le cache ISR
  3. Vérification `INDEXNOW_KEY` dans Replit Secrets + test de l'endpoint `/api/indexnow`
