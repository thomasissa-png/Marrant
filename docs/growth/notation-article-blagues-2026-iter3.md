# Notation : /blog/meilleures-blagues-droles-2026 (itération 3, 05/10/2026)

> Revue @reviewer. Base : code à HEAD après le commit 67a3650 (`lib/blog-related.ts`, `blog/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx`, `lib/blog-clusters.ts`, `lib/fr-typo.ts`) et NOUVELLES captures du rendu en ligne prises après le déploiement : mobile 390 px en 10 tranches (m00 à m09) et desktop (haut de page). Toutes ont été lues une par une.
> Grille de 8 critères identique aux itérations 1 et 2. Intouchables : les 50 vannes, le slug, le title, la meta, le H1, les H2 et « 1 500+ ».
> Limites : tests non exécutés et diff git non mesuré (consigne : pas de git), aucune donnée Umami, desktop vu seulement en haut de page.

## 1. Vérification des 3 correctifs de l'itération 2

| # | Correctif | Code | Rendu (capture) | Verdict |
|---|---|---|---|---|
| D1 | « À lire ensuite » ne reprend plus la carte « Suivant » | `blog-related.ts` l.13-24, `page.tsx` l.174-178 | m07-m08 : « Suivant » = 30 phrases drôles ; « À lire ensuite » = fille, homme. Aucun doublon. | PASS (voir l'écart ci-dessous) |
| D2 | 2e niveau de guillemets en “…” dans une vanne | `markdown-renderer.tsx` l.103-109 | m00 à m05 : n°1, 3, 5, 8 à 12, 14, 16 à 18, 21, 23, 24, 26 à 29, 31 à 33, 35, 37, 38, 43, 44, 46 et 50 en “…”. La n°45 se lit juste : « Ma banque m'a écrit : “Merci […] précieux.” Même ma banque me friendzone. ». La n°39 ouvre sur « “Tu fais quoi ?” ». | PASS |
| D3 | Libellés de cluster lisibles | `blog-clusters.ts` l.53, l.59, l.65 | m07 : « BLAGUES ET VANNES À RESSORTIR » | PASS (les 2 libellés recommandés hors note sont aussi appliqués) |

**Écart sur D1 (accepté).** L'itération 2 prescrivait de compléter la liste avec la même catégorie, puis les articles récents. L'implémentation ne la complète qu'avec le cluster, sinon elle affiche moins de cartes (`blog-related.ts` l.5-8). Ici, 2 slugs du cluster n'ont pas d'article publié (`comment-faire-rire-ses-amis`, `creer-ses-propres-blagues`), d'où 2 cartes au lieu de 3. C'est un arbitrage défendable : pas de 3e carte hors sujet. Le coût pour le lecteur est nul, puisque le doublon de l'itération 2 n'apportait aucune destination. Le seul effet visible concerne la grille desktop, traité en E3.

Intouchables vérifiés au rendu : H1, 8 H2, 50 vannes (texte stocké inchangé, seul le rendu des guillemets internes change). « 1 500+ » est absent de l'article, aucun pop-up, aucun tiret cadratin visible et aucun humoriste nommé (les marques citées sont Carambar, Uber, Strava, WhatsApp, Google et YouTube).

## 2. Grille et notes

| # | Critère | Iter1 | Iter2 | Iter3 | Justification (1 ligne) |
|---|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 8 | 10 | **10** | Sommaire à 7 ancres dans le 1er écran mobile (m00) et desktop. Rien à gagner. |
| 2 | Sorties vers une 2e page | 9 | 9 | **10** | 3 cartes d'article, 3 destinations distinctes, plus les 7 pages situation, la blague du jour, le catalogue, le quiz et le parcours (m05-m08). Plus aucune sortie gaspillée. |
| 3 | CTA d'inscription | 6 | 10 | **10** | Inchangé : placé juste après le corps, avec une promesse propre et une note rassurante (m07). |
| 4 | Lisibilité mobile et structure | 7 | 9 | **9** | Les guillemets sont réglés. Restent 2 coupures visibles à 390 px et un vide de grille sur desktop, détaillés en E1 à E3. |
| 5 | Ton Marrant des textes affichés | 8 | 9 | **10** | Plus aucun jargon interne : « Blagues et vannes à ressortir » reprend le mot du H1. Les autres textes affichés sont dans la voix. |
| 6 | Conformité | 9 | 10 | **10** | Zéro humoriste nommé et zéro tiret cadratin. Les promesses restent vraies : quiz sans inscription, 15 min/semaine identique dans le corps (m02) et l'encart parcours (m08). |
| 7 | Sécurité SEO | 10 | 10 | **10** | Les changements portent sur le rendu seul : texte stocké, id des H2, JSON-LD et FAQ du schema inchangés. |
| 8 | Mesure | 7 | 10 | **10** | Inchangée : `data-blog-zone="cluster"` et `"related"` séparent toujours les 2 blocs de sortie. |

**Note globale : 9,9/10** (79/80, contre 77/80 à l'itération 2 et 64/80 à l'itération 1).
**Après E1 à E3 : 10/10 sur les 8 critères.** Je n'ai rien trouvé d'autre de concret à améliorer.

Correction de l'itération 2 : elle projetait 10/10 après D1 à D3. C'était faux. E1 était déjà visible sur l'ancienne m07 et je l'ai manqué. E2 était classé « hors note » parce que le seul correctif proposé alors (U+2011) dépendait de la police. Le correctif E2 ci-dessous n'a plus ce risque, donc le défaut compte.

## 3. Top 3

1. **E2 (mots composés coupés)** : il touche le contenu que le visiteur vient lire. Dans la n°2, la coupure « Post- / it » (m01) tombe sur le mot qui porte la vanne. La n°24 coupe « week- / end » (m03).
2. **E1 (« ? » orphelin dans la FAQ)** : la 1re question de la FAQ finit par un « ? » seul sur sa ligne (m07). C'est la seule faute typographique visible de la page.
3. **E3 (grille desktop à 2 cartes)** : la grille garde 3 colonnes pour 2 cartes. La 3e reste vide et le bloc a l'air incomplet. Déduit du code, pas vu en capture.

## 4. Correctifs exacts (tous pour le critère 4)

### E1. Typographie française dans la FAQ et les cartes

Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`. `frTypo` est déjà importé (utilisé l.231). Le JSON-LD FAQ (l.192) garde le texte brut, comme l'exige `fr-typo.ts` l.4-5.

**Avant** (l.278-279) :
```tsx
                  <dt className="text-sm font-semibold text-text-primary">{faq.question}</dt>
                  <dd className="mt-2 text-sm text-text-secondary">{faq.answer}</dd>
```
**Après** :
```tsx
                  <dt className="text-sm font-semibold text-text-primary">{frTypo(faq.question)}</dt>
                  <dd className="mt-2 text-sm text-text-secondary">{frTypo(faq.answer)}</dd>
```
Pourquoi : sur m07, la question « Comment trouver des blagues drôles à raconter ? » coupe avant le « ? », qui reste seul sur sa ligne. La FAQ est le seul texte de la page rendu sans `frTypo`. Le corps passe par `inlineMarkdown` et le H1 par l.239.

À faire dans le même commit, même cause et même remède : l.301 `{frTypo(prevArticle.title)}`, l.312 `{frTypo(nextArticle.title)}` et l.337 `{frTypo(related.title)}`. Cela protège les titres de type « Comment faire rire une fille : 7 techniques », où le « : » et le « 7 » peuvent se retrouver orphelins quand le titre passe à la ligne.

### E2. Mot composé court jamais coupé au trait d'union

Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`, fonction `inlineMarkdown`. Cette passe agit au rendu seul et uniquement sur le texte hors balises, donc les `href` et les `class` ne sont jamais touchés. Elle utilise une classe CSS au lieu d'un caractère spécial : aucune dépendance à la police, et le copier-coller garde le vrai trait d'union.

**Avant** (l.120-125) :
```ts
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-accent-link hover:underline">$1</a>'
  );
  return result;
```
**Après** :
```ts
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-accent-link hover:underline">$1</a>'
  );
  // Mot composé court (Post-it, week-end, Wi-Fi) : jamais coupé en fin de ligne.
  // Texte seul : les segments impairs du split sont des balises, laissées intactes.
  return result
    .split(/(<[^>]*>)/)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(COMPOUND_RE, '$1<span class="whitespace-nowrap">$2</span>')))
    .join("");
```
Et, à côté de `NBSP` (l.42) :
```ts
// Mot composé de 2 parties courtes (8 lettres max chacune) : Post-it, week-end, petit-déj.
// Classe de lettres explicite, sans \p{L} : tsconfig.build.json cible ES2017
// (même convention que lib/learning-format.ts l.14-15).
const L = "A-Za-zÀ-ÖØ-öø-ÿŒœ";
const COMPOUND_RE = new RegExp(`(^|[^${L}-])([${L}]{1,8}-[${L}]{1,8})(?=[^${L}-]|$)`, "g");
```
Pourquoi : sur m01, la n°2 coupe « Post- / it » sur le mot qui porte la vanne, et sur m03 la n°24 coupe « week- / end ». La pastille Partager flottante réduit la largeur des premières lignes, donc la coupure tombe souvent là. La limite de 8 lettres laisse les mots longs (« pré-production ») se couper normalement, ce qui évite tout débordement à 320 px. Le texte stocké, les ancres des H2 (calculées sur le Markdown brut, l.135) et le `data-text` du partage (l.258) restent inchangés.

Test à ajouter dans `apps/web/src/__tests__/ui/markdown-renderer.test.ts` (bloc `renderMarkdown`) :
```ts
  it("ne coupe pas un mot composé court, sans toucher aux liens", () => {
    const html = renderMarkdown("Un Post-it et un [lien](/blog/blague-du-jour).");
    expect(html).toContain('<span class="whitespace-nowrap">Post-it</span>');
    expect(html).toContain('href="/blog/blague-du-jour"');
  });
```

### E3. Grille « À lire ensuite » ajustée au nombre de cartes

Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`.

**Avant** (l.326) :
```tsx
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
```
**Après** :
```tsx
            <div className={`mt-4 grid gap-4 ${relatedArticles.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
```
Pourquoi : `pickRelatedArticles` peut désormais renvoyer moins de 3 cartes, et c'est le cas sur cette page. Avec 3 colonnes fixes, la 3e colonne reste vide à partir de 640 px. Les 2 classes sont écrites en entier, donc Tailwind les génère. Mobile inchangé (1 colonne).

### Récapitulatif

| # | Critère | Fichier | Test |
|---|---|---|---|
| E1 | 4 | page.tsx l.278-279 (+ l.301, 312, 337) | aucun |
| E2 | 4 | markdown-renderer.tsx l.42, l.120-125 | ajouter 1 cas (ci-dessus) |
| E3 | 4 | page.tsx l.326 | aucun |

Un seul déploiement, documenté dans `REPLIT_ACTIONS.md`. Pre-commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, plus `markdown-renderer.test.ts` et `blog-article-cta-position.test.tsx`. Diff réel attendu (P0 s11) : 0 ligne de contenu, environ 15 lignes de code, 0 intouchable touché. Après déploiement, refaire m01, m03, m07 et une capture desktop du bas de page pour clore.

Notes projetées après E1 à E3 : 10 sur les 8 critères.

## 5. Ne comptent pas contre le 10

- **2 slugs du cluster sans article** (`comment-faire-rire-ses-amis`, `creer-ses-propres-blagues`, `blog-clusters.ts` l.61) : c'est un manque de contenu, pas un défaut de cette page. Publier ces articles rendrait la 3e carte. Décision à prendre par @seo et @copywriter dans la feuille de route éditoriale.
- **Conditionnés aux données (repris des itérations 1 et 2)** : sommaire en puces (si `blog-ancre-clic` est faible), 2e point d'inscription dans le corps (si moins de la moitié des lecteurs atteint le palier 75), Partager étendu aux autres articles CATALOGUE (si `blog-vanne-partage` est utilisé). Relevé à 30 jours par @data-analyst.

## 6. Décisions pour Thomas (hors note, inchangées)

- Bouton « Tout débloquer à 2,99 €/mois » dans le CTA (m07) : par défaut, on le garde et on lit `blog-cta-clic {bouton: premium}` à 30 jours.
- Signature « Alex Durand » du gabarit blog : hors périmètre, déjà instruite en s11.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-article-blagues-2026-iter3.md
- Décisions prises : D1 à D3 vérifiés dans le code et au rendu (PASS) ; écart D1 accepté (pas de carte hors sujet) ; note 9,9/10 (79/80) ; 3 correctifs E1 à E3, tous sur le critère 4, mènent à 10/10 sans toucher aux intouchables.
- Points d'attention : @fullstack applique E1 à E3 et ajoute le test E2 ; nouvelles captures m01, m03, m07 et desktop bas de page après déploiement.
---
