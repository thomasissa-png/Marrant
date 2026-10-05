# Notation : /blog/meilleures-blagues-droles-2026 (itération 2, 05/10/2026)

> Revue @reviewer. Base : code à HEAD après le commit 1e37eaa (blog-articles.ts l.1368-1591, blog/[slug]/page.tsx, markdown-renderer.tsx, article-cta.tsx, blog-vanne-share.tsx, blog-article-tracking.tsx, share-button.tsx, config/blog-cta.ts, lib/blog-clusters.ts, tests markdown-renderer et s14) + captures RÉELLES du rendu en ligne : mobile 390 px en 10 tranches (m00 à m09) et desktop (haut de page), toutes lues une par une.
> Même grille de 8 critères que l'itération 1 (`notation-article-blagues-2026-iter1.md`).
> Limites : tests non exécutés (pas de shell), aucune donnée Umami depuis la mise en ligne, desktop vu seulement en haut de page.

## 1. Vérification des 13 correctifs de l'itération 1

| # | Correctif | Code | Rendu (capture) | Verdict |
|---|---|---|---|---|
| C1 | Sommaire en 2e paragraphe, ancre Inclassables | blog-articles.ts l.1376 | m00 : sommaire dans le 1er écran (vers 580 px sur 844), 7 ancres | PASS |
| C2 | Lien « machine à café » vers le parcours | l.1442 `/parcours/machine-a-cafe` | m02 | PASS |
| C3 | 3e mention de la blague du jour reformulée | l.1575 | m06 | PASS |
| C4 | CTA juste après le corps | page.tsx l.259-261, l.352 | m07 : CTA avant la FAQ | PASS |
| C5 | Promesse du CTA | blog-cta.ts l.19 | m07 | PASS |
| C6 | Note rassurante sous les boutons | blog-cta.ts l.21, article-cta.tsx l.29, l.94 | m07 : « Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas. » | PASS |
| C7 | Partager sur chaque vanne | markdown-renderer.tsx l.249-254, blog-vanne-share.tsx | m00 à m05 : pastille sur les 50 vannes, flottante, cible 44 px | PASS (implémentation meilleure que proposée : réutilise `ShareButton`) |
| C8 | Thèmes en puces de 44 px | l.1546-1553, markdown-renderer.tsx l.164-168 | m05-m06 | PASS |
| C9 | « Toi aussi. » remplacé | l.1565 | m06 | PASS |
| C10 | 4 sorties de section réécrites | l.1414, 1444, 1468, 1488 | m01 à m04 | PASS |
| C11 | Scroll en 4 paliers | blog-article-tracking.tsx l.7, l.52-68 | sans objet | PASS |
| C12 | Ancres hors du KPI 2e page | blog-article-tracking.tsx l.43-48 | sans objet | PASS |
| C13 | Inscription attribuable | page.tsx l.178 | sans objet | PASS |

13/13 appliqués, sans écart avec le texte prescrit. Intouchables vérifiés : slug, title, meta, H1, 8 H2, 50 vannes (texte stocké inchangé), Définition, CLEF, FAQ ; « 1 500+ » absent de l'article. Aucun pop-up. Zéro tiret cadratin dans les textes visibles de la page.

## 2. Grille et notes

| # | Critère | Iter1 | Iter2 | Justification (1 ligne) |
|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 8 | **10** | Le sommaire tombe dans le 1er écran mobile (m00) et mène en un tap à la situation cherchée ; ce qui le précède est 1 paragraphe d'accroche. |
| 2 | Sorties vers une 2e page | 9 | **9** | Le même article (« 30 phrases drôles prêtes à ressortir ») est proposé 2 fois de suite : carte « Suivant » du cluster puis 1re carte de « À lire ensuite » (m07-m08). Une sortie sur 4 est perdue. |
| 3 | CTA d'inscription | 6 | **10** | Bloc placé juste après la dernière ligne du corps, promesse que la page ne donne pas déjà, « sans carte » une seule fois, note qui rassure au lieu de restreindre (m07). |
| 4 | Lisibilité mobile et structure | 7 | **9** | Partager et puces OK, mais les citations dans les vannes s'affichent « « … » … » : sur 31 vannes, deux niveaux de guillemets identiques (m00 à m05). La n°45 se lit fausse : « Ma banque m'a écrit : « Merci [...] précieux. » Même ma banque me friendzone. » (le » du milieu semble fermer la vanne), et la n°39 commence par « « . |
| 5 | Ton Marrant des textes affichés | 8 | **9** | Les textes ajoutés sont bons, mais le cluster affiche au visiteur son libellé interne « MOTS-CLÉS FORT VOLUME (ACQUISITION) » (m07, bas de capture) : jargon marketing qui dit au lecteur qu'il est une cible d'acquisition. |
| 6 | Conformité | 9 | **10** | Zéro humoriste nommé, zéro tiret cadratin, promesses vraies (page publique, quiz sans inscription, 15 min/semaine cohérent avec l'encart parcours m08). |
| 7 | Sécurité SEO | 10 | **10** | Texte stocké inchangé, id des H2 inchangés ; les `div#vanne-N` et `span` ajoutés ne touchent ni les titres ni les ancres. |
| 8 | Mesure | 7 | **10** | 4 paliers, ancres séparées, partage mesuré par canal, inscription attribuable par `?src=`. |

**Note globale : 9,6/10** (77/80, contre 64/80 à l'itération 1).
**Après application des 3 correctifs ci-dessous : 10/10 sur les 8 critères.** Les 3 défauts n'étaient visibles qu'au rendu : l'itération 1 n'avait pas de captures.

## 3. Top 3

1. **D2 (guillemets imbriqués)** : touche 31 vannes sur 50, c'est le contenu que le visiteur est venu lire ; la n°45 devient ambiguë.
2. **D3 (libellé de cluster interne)** : 1 ligne, mais c'est le seul texte de la page qui casse la confiance.
3. **D1 (carte en double)** : rend une sortie de plus vers un article différent (le suivant disponible du cluster ou de la catégorie CATALOGUE ; `comment-faire-rire-ses-amis` n'est pas dans blog-articles.ts, à voir s'il existe en base).

## 4. Correctifs exacts

### D1. « À lire ensuite » ne reprend pas la carte « Suivant » (critère 2)

Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`.

**Avant** (l.166) :
```tsx
  const relatedArticles = [...clusterArticles, ...sameCategoryArticles, ...otherArticles].slice(0, 3);
```
**Après** :
```tsx
  // Jamais 2 fois la même carte : l'article déjà proposé en « Suivant » ou
  // « Précédent » (navigation cluster) n'est pas repris dans « À lire ensuite ».
  const clusterNavSlugs = new Set([getNextInCluster(article.slug), getPrevInCluster(article.slug)]);
  const relatedArticles = [...clusterArticles, ...sameCategoryArticles, ...otherArticles]
    .filter((a) => !clusterNavSlugs.has(a.slug))
    .slice(0, 3);
```
Pourquoi : m07-m08 montrent « 30 phrases drôles prêtes à ressortir » en carte « Suivant » puis, juste en dessous, en 1re carte de « À lire ensuite ». 4 cartes affichées, 3 destinations. Le correctif vaut pour tous les articles d'un cluster (même défaut partout où le suivant est aussi le 1er satellite). Aucun nouvel import : `getNextInCluster` et `getPrevInCluster` sont déjà importés (l.24). Pas de test à modifier.

### D2. Guillemets de 2e niveau en “…” dans une vanne déjà entre « … » (critère 4)

Fichier : `apps/web/src/components/ui/markdown-renderer.tsx`. Texte stocké des vannes inchangé (empreinte SHA-256 du test s14 intacte) : seul le rendu change.

**Avant** (l.101-103) :
```ts
  const converted =
    nestedQuotes(masked) ??
    masked.replace(/"([^"\n]+?)"/g, (_m, inner: string) => `«${NBSP}${inner.trim()}${NBSP}»`);
```
**Après** :
```ts
  const converted =
    nestedQuotes(masked) ??
    masked.replace(/"([^"\n]+?)"/g, (_m, inner: string, offset: number) => {
      // Citation dans une vanne déjà entre « … » : 2e niveau en “…” (comme nestedQuotes).
      const before = masked.slice(0, offset);
      const inside = (before.match(/«/g) ?? []).length > (before.match(/»/g) ?? []).length;
      return inside ? `“${inner.trim()}”` : `«${NBSP}${inner.trim()}${NBSP}»`;
    });
```
Pourquoi : les vannes sont stockées entre « … » et leurs citations internes en guillemets droits ; le rendu actuel les convertit aussi en « … », d'où « « Tu fais quoi ? » Le message… » (n°39) et une n°45 qui semble finir après « précieux. ». La convention du site existe déjà : `nestedQuotes` rend le 2e niveau en “…” (test markdown-renderer l.78-79). Les décryptages en italique (hors « … », ex. n°1 « techniquement c'est un choix ») restent en « … ». Effet sur les autres articles : même amélioration partout où une citation est dans des « … ».

Test à ajouter dans `apps/web/src/__tests__/ui/markdown-renderer.test.ts` (bloc `frenchQuotes`) :
```ts
  it("rend le 2e niveau en “…” dans une citation déjà entre « … »", () => {
    expect(frenchQuotes('« Il dit "bonjour". »')).toBe("« Il dit “bonjour”. »");
    expect(frenchQuotes('« Vanne. » Puis "ça".')).toBe(`« Vanne. » Puis «${NBSP}ça${NBSP}».`);
  });
```

### D3. Libellé de cluster lisible par un visiteur (critère 5)

Fichier : `apps/web/src/lib/blog-clusters.ts`. Ce `name` n'est affiché qu'à un endroit (page.tsx l.284, surtitre de la navigation cluster) et n'est vérifié par aucun test.

**Avant** (l.58) :
```ts
    name: "Mots-clés fort volume (acquisition)",
```
**Après** :
```ts
    name: "Blagues et vannes à ressortir",
```
Pourquoi : m07 affiche « MOTS-CLÉS FORT VOLUME (ACQUISITION) » au-dessus de la carte « Suivant ». C'est une note de stratégie SEO, pas un texte pour le lecteur. Le nouveau libellé reprend le mot du H1 (« ressortir ») et couvre les 6 articles du cluster.

Même défaut, autres pages (hors note, à faire dans le même commit) : l.64 `"Contenu saisonnier (pics de trafic)"` → `"Humour de saison"` ; l.52 `"Douleurs et situations concrètes"` → `"Quand l'humour coince"`. @copywriter valide les 3 libellés contre la charte s11.

### Récapitulatif

| # | Critère | Fichier | Test |
|---|---|---|---|
| D1 | 2 | blog/[slug]/page.tsx l.166 | aucun |
| D2 | 4 | markdown-renderer.tsx l.101-103 | ajouter 1 cas (ci-dessus) |
| D3 | 5 | blog-clusters.ts l.58 (+ l.52, l.64 hors note) | aucun |

Un seul déploiement, documenté dans `REPLIT_ACTIONS.md`. Pre-commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`. Diff réel (P0 s11) : 0 ligne de contenu de l'article, environ 12 lignes de code ; intouchables : 0. Après déploiement, refaire les captures m00, m05 et m07-m08 pour vérifier D1 à D3 au rendu.

Notes projetées après D1 à D3 : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

## 5. Ne comptent pas contre le 10

- **Coupure « Post- / it » (n°2) et « week- / end » (n°24) à 390 px** : dépend de la largeur d'écran, et le correctif générique (trait d'union insécable U+2011 au rendu) demande de vérifier que la police l'affiche. À instruire par @fullstack, pas bloquant.
- **Repris de l'itération 1, toujours conditionnés aux données** : sommaire en puces (si `blog-ancre-clic` faible), 2e point d'inscription dans le corps (si moins de la moitié atteint le palier 75), Partager étendu aux autres articles CATALOGUE (si `blog-vanne-partage` est utilisé). Relevé à 30 jours par @data-analyst.
- **Une ligne d'intro pour « WhatsApp / réseaux » et « Pépites inclassables »** : déjà classée hors note à l'itération 1, pas d'élément nouveau.

## 6. Décisions pour Thomas (hors note, inchangées)

- Bouton « Tout débloquer à 2,99 €/mois » dans le CTA de cet article (m07) : défaut proposé, le garder et lire `blog-cta-clic {bouton: premium}` à 30 jours.
- Signature « Alex Durand » du gabarit blog : hors périmètre, déjà instruite en s11.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-article-blagues-2026-iter2.md
- Décisions prises : 13/13 correctifs de l'itération 1 vérifiés (code et rendu) ; note 9,6/10 (77/80) ; 3 correctifs D1 à D3, vus uniquement au rendu, mènent à 10/10 sans toucher aux intouchables ni ajouter de pop-up.
- Points d'attention : @fullstack applique D1 à D3 et ajoute le test D2 ; @copywriter valide les libellés de cluster (D3) ; nouvelles captures mobile après déploiement pour clore.
---
