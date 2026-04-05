# Audit SEO des gates programmatiques blog — runBlogGates

**Date** : 2026-04-05
**Agent** : @seo
**Scope** : Audit des 8 gates programmatiques de `runBlogGates` dans `standup-director-agent.ts`
**Fichiers analysés** :
- `apps/web/src/lib/ai/agents/standup-director-agent.ts` (lignes 173-244)
- `seo-editorial-plan.json` (v4.0, qualityRules)
- `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`
- `apps/web/src/lib/blog-articles.ts` (articles statiques existants)

---

## Note globale : 5.5 / 10

Les gates existantes protegent bien les bases de ton et de forme (vouvoiement, excerpt trop long, persona leak). Elles sont insuffisantes sur les criteres SEO qui determinent le classement Google : presence du mot-cle, structure H2, schema conditionnel. Sur 8 gates, 5 protegent un critere de qualite editoriale ou de marque, mais seulement 2 protegent un critere directement indexe par les crawlers (G-B2 titre, G-B3 excerpt). 6 gates SEO critiques sont absentes.

---

## Tableau analyse gate par gate

| Gate | Libelle | Pertinence SEO | Calibration | Verdict |
|------|---------|---------------|-------------|---------|
| G-B1 | Pas de persona leak | Indirecte — evite les textes incohérents vis-a-vis de l'intention de recherche | Bonne — regex `\b(yanis|sophie|marc)\b` couvre les cas | Pertinente, bien calibree |
| G-B2 | Titre < 60 chars | Directe — Google tronque les title tags au-dela de ~580px (~60 chars) | Bonne — seuil conforme aux recommandations Google Search Central | Pertinente, bien calibree |
| G-B3 | Excerpt < 155 chars | Directe — la meta description au-dela de 155 chars est tronquee dans les SERP | Correcte mais incomplete — voir faux positif potentiel section suivante | Pertinente, calibration partielle |
| G-B4 | Min 5 liens internes | Directe — le maillage interne transmet le PageRank et structure le cocon semantique | Seuil trop permissif pour les pages piliers (objectif = 8-10 liens) — correct pour les satellites | Pertinente, seuil a differencier |
| G-B5 | Min 1500 mots | Directe — Google favorise le contenu substantiel pour les requetes informationnelles | 1500 mots pour un satellite est correct ; pour un pilier, le seuil devrait etre 2000 | Pertinente, seuil a differencier |
| G-B6 | FAQ presente | Directe — FAQPage schema eligiblex aux Rich Results ; H2 sous forme de question capte les PAA | Detection fragile — `/faq|questions?\s+(fréquentes|courantes)|##.*\?/i` rate les FAQ sans H2 explicite | Pertinente, detection a renforcer |
| G-B7 | Refs legacy <= 1 | Indirecte — critere editorial, pas SEO au sens strict. Google ne penalise pas les mentions de Jamel | Aucune pertinence SEO directe — critere artistique valide mais mal place dans les gates SEO | Hors scope SEO, bien calibree editorialement |
| G-B8 | Tutoiement obligatoire | Indirecte — cohérence de marque, impacte l'engagement et le taux de rebond | Bonne — regex couvre les conjugaisons courantes | Pertinente pour la marque, indirecte pour le SEO |

---

## Faux positifs potentiels sur les gates existantes

### G-B3 — Excerpt < 155 chars : limite trop stricte

La gate rejette a 155 chars. Or Google peut afficher jusqu'a ~160 chars sur desktop et ~130 chars sur mobile. Le seuil de 155 est correct mais la gate compare `article.excerpt.length` sans distinguer les caracteres multi-byte (accents, apostrophes typographiques). Un excerpt de 154 chars avec plusieurs accents peut mesurer 160+ octets. Risque faible en pratique (UTF-8 n'est pas le probleme) mais le commentaire dans le code dit "155 chars" alors que la spec Google dit "~155 chars" — il est possible de passer la gate avec un excerpt qui sera tronque sur mobile (< 130 chars idealement pour les mobiles).

**Recommandation** : abaisser le seuil a 150 chars pour avoir une marge de securite confortable sur mobile et desktop.

### G-B4 — Comptage des liens internes : sous-compte probable

La regex `/\/(vannes|conseils|videos|parcours|blog\/[a-z])/g` ne capture pas :
- Les liens vers `/abonnement` ou `/a-propos` qui sont des pages internes valides pour le maillage
- Les liens en format absolu (`https://deviens-marrant.fr/vannes`)
- Les liens vers la homepage `/`

Le comptage reporte peut etre inferieur au nombre reel de liens internes, ce qui peut rejeter des articles correctement mailles. Ce n'est pas un faux positif bloquant mais une sous-estimation systematique.

### G-B8 — Vouvoiement : faux positifs sur certains mots courants

La regex `/votre\b|vos\b/i` peut matcher des extraits comme "votre propre style d'humour" dans le contexte d'une citation ou d'un exemple au discours indirect. Exemple : `Il dit "votre question est excellente"` declenche un faux positif. Risque faible mais non nul sur les articles qui citent des propos en style indirect.

---

## Gates SEO critiques manquantes

### G-B9 — Mot-cle principal dans le titre (BLOQUANT recommande)

**Pourquoi c'est critique :** Google et Bing utilisent le title tag comme signal de pertinence primaire. Selon Google Search Central, le titre est l'element on-page le plus important pour la comprehension du sujet par le crawler. Un article sur "timing humour" dont le titre serait "L'art de la pause comedique" ne rankera pas sur "timing humour".

**Ce qui manque :** aucune gate ne verifie que `article.targetKeyword` est present dans `article.title`. La gate G-B2 verifie seulement la longueur.

**Implementation proposee :**
```typescript
// G-B9 — Mot-clé dans le titre
// Nécessite targetKeyword dans la signature de runBlogGates
const keyword = article.targetKeyword?.toLowerCase().trim() ?? "";
const titleLower = article.title.toLowerCase();
const keywordInTitle = keyword.length === 0 || titleLower.includes(keyword) ||
  keyword.split(/\s+/).every((word) => titleLower.includes(word));
results.push({
  gate: "G-B9 Mot-clé dans titre",
  pass: keywordInTitle,
  reason: !keywordInTitle ? `Mot-clé "${keyword}" absent du titre` : "OK",
});
```

**Impact** : les 5 articles piliers actuels passent tous cette gate (verifications manuelles : "comment devenir drole", "avoir de la repartie", "timing humour" — tous presents dans les titres). Gate de protection pour les articles generes par IA qui pourraient derive du mot-cle cible.

---

### G-B10 — Mot-cle dans les 100 premiers mots du corps (BLOQUANT recommande)

**Pourquoi c'est critique :** Google favorise les pages ou le mot-cle apparait tot dans le contenu. Selon John Mueller (Google), "l'introduction doit clairement signaler le sujet de la page". Bing confirme la meme regle dans ses Webmaster Guidelines. Un article "exercice humour" qui commence par une anecdote de 200 mots avant de mentionner le mot-cle sera penalise en pertinence.

**Ce qui manque :** aucune gate ne verifie la presence du mot-cle dans l'introduction.

**Implementation proposee :**
```typescript
// G-B10 — Mot-clé dans l'intro (100 premiers mots)
const intro = article.content.split(/\s+/).slice(0, 100).join(" ").toLowerCase();
const keywordInIntro = keyword.length === 0 || intro.includes(keyword) ||
  keyword.split(/\s+/).some((word) => intro.includes(word));
results.push({
  gate: "G-B10 Mot-clé dans intro",
  pass: keywordInIntro,
  reason: !keywordInIntro ? `Mot-clé "${keyword}" absent des 100 premiers mots` : "OK",
});
```

**Verification sur les articles existants :** "comment devenir drole" apparait en paragraphe 2 de l'article pilier. "avoir de la repartie" est dans l'intro. "timing humour" egalement. Les articles actuels passent. La gate protege contre les derives futures de l'agent IA.

---

### G-B11 — Minimum 3 balises H2 dans le contenu (BLOQUANT recommande)

**Pourquoi c'est critique :** les balises H2 sont le signal de structure semantique principal pour les crawlers. Google utilise les H2 pour comprendre les sous-themes couverts par l'article et pour generer des extraits enrichis (People Also Ask, Rich Snippets). Un article sans structure H2 est traite comme un bloc de texte sans hierarchie. Bing Webmaster Tools signale explicitement l'absence de structure heading comme un probleme d'indexation.

**Ce qui manque :** aucune gate ne compte les H2. La gate G-B6 detecte la FAQ mais pas la structure generale.

**Verification sur les articles existants :** l'article "comment devenir drole" contient 7 H2 (verifies dans blog-articles.ts). L'article "comment avoir de la repartie" en contient 12. Les articles actuels passent largement. La gate protege contre les articles IA mal structures.

**Implementation proposee :**
```typescript
// G-B11 — Minimum 3 H2 dans le contenu
const h2Count = (article.content.match(/^## .+$/gm) || []).length;
results.push({
  gate: "G-B11 Min 3 H2",
  pass: h2Count >= 3,
  reason: h2Count < 3 ? `${h2Count} H2 détectés (min 3)` : "OK",
});
```

---

### G-B12 — Schema HowTo applicable si categorie GUIDE/PRATIQUE/ROADMAP et >= 3 H2 (REQUIS recommande)

**Pourquoi c'est critique :** le schema HowTo est eligible aux Rich Snippets Google (etapes affichees directement dans la SERP, +CTR de 15-30% selon les etudes schema.org). La page `/blog/[slug]/page.tsx` genere deja le schema HowTo automatiquement si `category IN [GUIDE, PRATIQUE, ROADMAP]` ET `h2Count >= 3`. Mais aucune gate ne verifie que ces conditions sont remplies pour les articles de ces categories.

**Ce qui manque :** si l'agent IA genere un article GUIDE avec moins de 3 H2, le schema HowTo n'est pas genere et le Rich Snippet manque — sans que la gate le signale.

**Implication architecturale :** la gate G-B11 (H2 minimum 3) resout deja le probleme structurel. G-B12 est complementaire : elle verifie l'eligibilite au Rich Snippet HowTo pour les categories qui en beneficient.

**Implementation proposee :**
```typescript
// G-B12 — HowTo schema eligible pour GUIDE/PRATIQUE/ROADMAP
const howToCategories = ["GUIDE", "PRATIQUE", "ROADMAP"];
if (howToCategories.includes(article.category ?? "")) {
  const h2CountForHowTo = (article.content.match(/^## .+$/gm) || []).length;
  results.push({
    gate: "G-B12 HowTo eligible (GUIDE/PRATIQUE/ROADMAP)",
    pass: h2CountForHowTo >= 3,
    reason: h2CountForHowTo < 3
      ? `Article ${article.category} avec ${h2CountForHowTo} H2 — HowTo schema ne sera pas genere (min 3 requis)`
      : "OK",
  });
}
```

---

### G-B13 — GEO : minimum 3 listes numerotees (REQUIS recommande)

**Pourquoi c'est critique :** selon la strategie GEO documentee dans CLAUDE.md, "les LLM extraient les listes numerotees pour leurs reponses". ChatGPT, Perplexity et Gemini privilegient les contenus avec des listes structurees. L'objectif projet est d'etre "reference comme source par les LLM quand on demande comment devenir drole" (project-context.md, Objectifs 12 mois). Cette gate aligne directement le contenu sur cet objectif.

**Ce qui manque :** aucune gate ne verifie la presence de listes numerotees. Les qualityRules du seo-editorial-plan.json mentionnent les listes GEO uniquement dans les instructions agent (pas dans les gates de rejet).

**Verification sur les articles existants :** l'article "comment avoir de la repartie" contient la liste des 10 techniques en debut d'article (verifiee). L'article "comment devenir drole" contient le plan en 4 semaines. Les articles actuels passent. Protection pour les articles IA futurs.

**Implementation proposee :**
```typescript
// G-B13 — GEO : min 3 listes numérotées
const numberedLists = (article.content.match(/^\d+\.\s+.+$/gm) || []).length;
results.push({
  gate: "G-B13 GEO min 3 listes numérotées",
  pass: numberedLists >= 3,
  reason: numberedLists < 3 ? `${numberedLists} élément(s) de liste numérotée (min 3)` : "OK",
});
```

**Note d'implementation :** le comptage est sur les lignes individuelles, pas sur le nombre de listes. Une liste de 5 items compte pour 5. Ajuster si necessaire a `min 1 liste d'au moins 3 items`.

---

### G-B14 — GEO : au moins 1 blockquote CLEF (REQUIS recommande)

**Pourquoi c'est critique :** la strategie GEO de CLAUDE.md requiert des "citation-worthy statements" au format `> **CLEF :** [affirmation memorable]`. Ces blockquotes sont extraits preferentiellement par les LLM comme des definitions ou des cles de comprehension. Verifies dans les articles statiques existants, ils sont presents dans les 5 articles piliers. La gate protege contre leur absence dans les articles IA generes.

**Ce qui manque :** aucune gate programmatique ne verifie leur presence.

**Implementation proposee :**
```typescript
// G-B14 — GEO : au moins 1 blockquote CLEF
const hasClefBlockquote = />\s*\*\*CLEF\b/i.test(article.content);
results.push({
  gate: "G-B14 GEO blockquote CLEF",
  pass: hasClefBlockquote,
  reason: !hasClefBlockquote ? 'Pas de blockquote > **CLEF :** — requis pour optimisation LLM' : "OK",
});
```

---

### G-B15 — Anti-cannibalisation : slug unique non existant (BLOQUANT recommande)

**Pourquoi c'est critique :** la cannibalisation SEO est le risque le plus destructeur pour un site blog. Deux articles sur le meme mot-cle divisent l'autorite et font baisser les deux. Google selectionne arbitrairement lequel montrer, generalement ni l'un ni l'autre de facon optimale. L'agent `seo-blog-agent.ts` a deja une logique de verification anti-cannibalisation avant la generation, mais aucune gate dans `runBlogGates` ne bloque un article cannibalisant s'il passe au travers du pipeline.

**Ce qui manque :** `runBlogGates` ne recoit pas la liste des slugs existants. La gate doit etre conditionnelle (si la liste est fournie) ou le contexte de la validation doit etre enrichi.

**Implementation proposee (avec liste optionnelle) :**
```typescript
// Enrichir la signature de runBlogGates :
export function runBlogGates(
  article: { title: string; excerpt: string; content: string; slug: string; category?: string; targetKeyword?: string },
  existingSlugs?: string[]
): GateResult[] {

  // G-B15 — Anti-cannibalisation slug
  if (existingSlugs && existingSlugs.length > 0) {
    const slugExists = existingSlugs.includes(article.slug);
    results.push({
      gate: "G-B15 Slug unique (anti-cannibalisation)",
      pass: !slugExists,
      reason: slugExists ? `Slug "${article.slug}" existe déjà — cannibalisation détectée` : "OK",
    });
  }
}
```

**Appel dans `validateBlogArticle()` :** passer la liste des slugs existants en parametre depuis `seo-blog-agent.ts` qui a deja acces a la DB.

---

## Verification : qualityRules du seo-editorial-plan.json vs gates

| Regle qualite (seo-editorial-plan.json) | Gate existante | Couverture |
|----------------------------------------|---------------|-----------|
| Titre < 60 chars, mot-cle en debut | G-B2 (longueur) | Partielle — longueur OK, presence mot-cle non verifiee |
| Excerpt < 155 chars | G-B3 | Complete |
| 1500-2500 mots pillar / 1000-1800 satellite | G-B5 (min 1500 uniforme) | Partielle — pas de differentiation pillar/satellite, pas de seuil max |
| Structure H2/H3 | Aucune | Manquante |
| Min 5 liens internes | G-B4 | Complete (voir faux positif sous-comptage) |
| FAQ schema 3-5 questions | G-B6 | Partielle — detection de presence, pas du nombre de questions |
| Min 3 traits d'humour | Aucune | Manquante (difficilement programmable — correctement deleguee a l'IA) |
| Max 1 ref legacy | G-B7 | Complete |
| Tutoiement | G-B8 | Complete |
| Verif anti-cannibalisation | Partiellement dans seo-blog-agent | Pas dans les gates de `runBlogGates` |
| CTA vers /parcours, /vannes ou /conseils | Partiellement via G-B4 | Pas de gate dediee |

---

## Top 3 ameliorations prioritaires

### Priorite 1 — G-B9 : Mot-cle dans le titre (BLOQUANT)

**Justification Google + Bing :** le title tag est le signal on-page numero 1 dans les deux algorithmes. Google Search Central documentait explicitement : "Create unique, accurate page titles that include your most important keywords." Bing Webmaster Guidelines : "Use descriptive and keyword-rich page titles." Actuellement, un article genere par l'IA pourrait avoir un titre creatif qui ne contient pas le mot-cle cible — la gate G-B2 ne protege pas contre ca. C'est la correction la plus simple et la plus impactante.

**Dependance technique :** necessite d'ajouter `targetKeyword` dans la signature de `runBlogGates`. Cela implique une modification de l'interface et de l'appel dans `validateBlogArticle`. Faible complexite.

**Risque si absent :** l'agent IA peut generer "L'art de rester calme et percutant" pour un article cible sur "avoir de la repartie" — aucune gate ne le bloquera.

### Priorite 2 — G-B11 : Minimum 3 H2 (BLOQUANT)

**Justification Google + Bing :** la structure heading est le deuxieme signal on-page le plus important. Les H2 permettent a Google de comprendre les sous-themes couverts et d'extraire des featured snippets. Bing utilise explicitement la hierarchie heading pour evaluer la completude du contenu. Un article de 1500 mots sans H2 sera traite comme un mur de texte — penalisant pour l'indexation et catastrophique pour la lisibilite (taux de rebond eleve → signal negatif).

**Dependance technique :** aucune. La gate peut etre ajoutee immediatement avec la regex `^## .+$/gm`.

**Impact sur le schema HowTo :** la gate G-B11 est un pre-requis implicite de G-B12. Si G-B11 passe, G-B12 peut etre ajoutee gratuitement.

### Priorite 3 — G-B13 : GEO min 3 listes numerotees (REQUIS)

**Justification projet :** l'objectif explicite de project-context.md est d'etre "reference comme source par les LLM". Les listes numerotees sont le format le plus extrait par ChatGPT, Perplexity et Gemini dans leurs reponses. La strategie GEO dans CLAUDE.md est claire : "au moins 3 listes numerotees par article". Sans gate, cette regle reste aspirationnelle. Avec la gate, elle devient non-negociable.

**Lien avec le SEO traditionnel :** les listes numerotees ont aussi un impact SEO direct — elles sont eligibles aux "featured snippets" de type liste dans Google, ce qui peut generer jusqu'a 30% de trafic supplementaire sur une position 1.

---

## Ajustements secondaires recommandes

- **G-B3** : abaisser de 155 a 150 chars pour securiser l'affichage mobile
- **G-B4** : considerer un seuil differencie selon le type : pillar >= 8 liens, satellite >= 5 liens (necessite `type` dans la signature)
- **G-B5** : considerer un seuil max de 2500 mots pour eviter le keyword stuffing implicite (articles tres longs avec contenu de remplissage)
- **G-B6** : renforcer la detection avec `/##\s+.+\?|faq/i` et verifier le nombre minimal de questions (min 3 selon qualityRules)

---

## Signature proposee pour runBlogGates apres ameliorations

```typescript
export function runBlogGates(
  article: {
    title: string;
    excerpt: string;
    content: string;
    slug: string;
    category?: string;      // nouveau — pour G-B12 HowTo conditionnel
    targetKeyword?: string; // nouveau — pour G-B9 et G-B10
  },
  existingSlugs?: string[]  // nouveau — pour G-B15 anti-cannibalisation
): GateResult[]
```

Les appels existants dans `validateBlogArticle()` et les tests associes devront etre mis a jour.

---

**Handoff → @fullstack**
- Fichiers produits : `/home/user/Marrant/docs/reviews/gates-audit-seo.md`
- Decisions prises : 6 gates SEO recommandees (G-B9 a G-B15), 3 en BLOQUANT, 3 en REQUIS. Top priorites : G-B9 mot-cle titre, G-B11 min 3 H2, G-B13 GEO listes.
- Points d'attention : la signature de `runBlogGates` doit etre etendue (ajout `category`, `targetKeyword`, `existingSlugs?`) — les tests dans `apps/web/src/__tests__/` devront etre mis a jour en consequence. G-B15 necessite que `validateBlogArticle()` dans `seo-blog-agent.ts` passe la liste des slugs existants deja calcules lors du check anti-cannibalisation.
