# Notation : A1 /blog/message-anniversaire-drole-par-situation (itération 3, finale, 05/10/2026)

> Revue @reviewer. Base : captures du rendu de production sur l'aperçu admin (`snap/message-anniversaire-drole-par-situation/` : `m00` à `m07` en 390 px, `d-haut` et `d-bas` en 1280 px, sans JavaScript), brouillon `docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md` (numéros de ligne ci-dessous), `components/blog/blog-article-view.tsx` l.96-105, `lib/blog-article-page.ts` l.73-77, `lib/blog-visibility.ts`, `app/sitemap.ts` l.92, `app/llms-full.txt/route.ts` l.126.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A1-iter2.md` (9,6/10).
> Boutons Partager absents des captures (ajoutés en JavaScript) : non compté. L'espace réservé à droite des 21 messages est visible et régulier.
> Intouchables respectés par tous les correctifs : 21 messages (0 caractère touché), zéro tiret cadratin, aucun humoriste, aucune page thème touchée.

## 1. Correctifs de l'itération 2 : appliqués et visibles

| # | Correctif | Vu sur | Verdict |
|---|---|---|---|
| D1 | « court, une seule chute » (En bref, l.47, l.136) | `m00` (En bref, paragraphe sous le sommaire), `m03` (« un message court suffit ») | PASS |
| D2 | FAQ 1 et 4 : la chute garde le dernier mot | `m05` (FAQ 1), `m06` et `d-bas` (FAQ 4) | PASS |
| D3 | Indication n°4 « À voix haute, au moment des bougies. Dis-le » | `m01` | PASS |
| D4 | « tes photos ratées, ta flemme, tes vocaux trop longs » | `m00` | PASS |
| D5 | « Pour une autre occasion que l'anniversaire » | `m04` | PASS |
| D6 | « La carte d'anniversaire d'un collègue » | `m01` | PASS |

Rendu : sommaire dans le 1er écran mobile (`m00`), message n°1 à la fin du même écran, indications en italique sous chaque message, 4 puces thèmes en zone de tap pleine hauteur (`m05`), CTA juste après le corps (`m05`), FAQ en cartes, encart Répartie en bas (`m06`). Desktop propre, colonne de lecture centrée (`d-haut`, `d-bas`).

## 2. Grille et notes

| # | Critère | Iter2 | Iter3 | Justification (1 ligne) |
|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 10 | **10** | En bref, sommaire à 6 ancres et message n°1 dans le 1er écran mobile (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Une sortie par section, 4 puces thèmes, quiz, parcours, encart Répartie. |
| 3 | CTA d'inscription | 10 | **10** | Placé juste après le corps, titre sur le gâteau, note vraie (`m05`). |
| 4 | Lisibilité mobile et structure | 10 | **10** | Vu au rendu : rythme message / indication régulier, rien de collé, rien de coupé. |
| 5 | Ton Marrant des textes affichés | 8 | **9** | Le bloc « À retenir » dit « Une phrase drôle suffit » au-dessus de messages qui en font 3 ou 4 (le défaut D1, resté là), et la blague du jour est proposée deux fois dans le même écran de fin (`m04` puis `m05`). |
| 6 | Conformité | 10 | **10** | Zéro tiret cadratin, zéro humoriste, durées exactes, note du CTA vraie. |
| 7 | Sécurité SEO | 9 | **9** | D6 réglé, mais l'en-tête affiche « 22 octobre 2026 · Mis à jour le 5 octobre 2026 » (`m00`, `d-haut`), et le même 5 octobre partira en `dateModified`, `modifiedTime` et `lastmod` : une modification antérieure à la publication. |
| 8 | Mesure | 10 | **10** | Gabarit commun, 21 emplacements de partage visibles. |

**Note globale : 9,8/10** (78/80).
**Après les 3 correctifs ci-dessous : 10/10 sur les 8 critères.** Je ne vois pas d'autre amélioration concrète.

## 3. Correctifs exacts

### F1. « Mis à jour » antérieur à la publication (critère 7, commun à A1, A2, A3 et A4)

Cause : l'import pose `updatedAt = now()` (`import-article.ts` l.215), soit le 05/10 ; aucune tâche ne le touche à la publication (`blog-visibility.ts` ne fait que filtrer). `blog-article-view.tsx` l.98 affiche « Mis à jour le » dès que `updatedAt ≠ date`. Le 22/10, la page publique affichera donc une mise à jour du 5 octobre sur un article du 22.

Fichier `apps/web/src/lib/blog-visibility.ts`. **Avant** (fin de fichier, après `isBlogArticleVisible`) : rien. **Après**, ajouter :
```ts
/**
 * Date de modification publiable : `updatedAt` seulement s'il suit la publication.
 * Un article programmé, corrigé avant sa sortie, n'a pas été « mis à jour ».
 */
export function publicUpdatedAt(article: { publishedAt: Date | null; updatedAt: Date | null }): Date | null {
  if (!article.updatedAt) return null;
  if (article.publishedAt && article.updatedAt.getTime() <= article.publishedAt.getTime()) return null;
  return article.updatedAt;
}
```
Fichier `apps/web/src/lib/blog-article-page.ts`. **Avant** (l.77) :
```ts
      updatedAt: dbArticle.updatedAt ? dbArticle.updatedAt.toISOString().split("T")[0] : undefined,
```
**Après** (import de `publicUpdatedAt` ajouté à la ligne l.11 existante) :
```ts
      updatedAt: publicUpdatedAt(dbArticle)?.toISOString().split("T")[0],
```
Fichier `apps/web/src/app/sitemap.ts`. **Avant** (l.92) : `      lastModified: article.updatedAt || article.publishedAt || new Date(),`
**Après** : `      lastModified: publicUpdatedAt(article) || article.publishedAt || new Date(),`
Fichier `apps/web/src/app/llms-full.txt/route.ts`. **Avant** (l.126) : `      updatedAt: a.updatedAt ? a.updatedAt.toISOString().split("T")[0] : undefined,`
**Après** : `      updatedAt: publicUpdatedAt(a)?.toISOString().split("T")[0],`

Effet : sans mise à jour réelle après le 22/10, l'en-tête n'affiche que « 22 octobre 2026 », et JSON-LD, OG et sitemap retombent sur la date de publication (repli déjà codé : `json-ld.tsx` l.217, `[slug]/page.tsx` l.44). C'est ce que demande l'en-tête du brouillon (l.15, « updatedAt : identique à la date au jour J »). Un `--update` fait après publication réaffiche « Mis à jour le », à juste titre. Test à ajouter : `publicUpdatedAt({ publishedAt: 2026-10-22, updatedAt: 2026-10-05 })` vaut `null`, et avec `updatedAt: 2026-11-02` renvoie le 2 novembre. Pre-commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`, avant le 22/10.

### F2. « Une phrase drôle suffit » (critère 5)

**Avant** (l.156) :
```md
> **À retenir :** Un message drôle réussi est court, vrai, et s'envoie au bon moment. Une phrase drôle suffit : le reste de ton message peut être sincère.
```
**Après** :
```md
> **À retenir :** Un message drôle réussi est court, vrai, et s'envoie au bon moment. Une seule chute suffit : la phrase sincère va avant elle sur une carte, ou dans un second message.
```
Pourquoi : 17 messages sur 21 font 3 ou 4 phrases (décompte de l'iter2, D1) ; « une phrase drôle » est le chiffre que D1 a retiré partout ailleurs. « Le reste de ton message peut être sincère » laisse aussi croire qu'on peut finir sur la phrase sincère, ce que contredisent le n°1 (« la dernière phrase doit rester la dernière chose lue ») et les FAQ 1 et 4 corrigées en D2. La nouvelle phrase reprend la règle 2 (« une situation, une chute ») et la FAQ 1, mot pour mot sur le placement.

### F3. La blague du jour une seule fois dans le bloc de fin (critère 5)

**Avant** (l.172) :
```md
**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage. Le reste est dans [le catalogue de vannes](/vannes), rangé par situation.
```
**Après** :
```md
**Tu as fait le tour ?** Le reste est dans [le catalogue de vannes](/vannes), rangé par situation, chaque vanne avec sa chute et son décryptage.
```
Pourquoi : l.172 et l.182 (« → La blague du jour : celle d'aujourd'hui, et demain une autre. ») font la même promesse vers la même page à 10 lignes d'écart, dans le même écran mobile (`m04` en bas, `m05` en haut). La l.182 reste, c'est la dernière sortie avant le CTA. « Chute et décryptage » reste vrai : chaque carte du catalogue ouvre la fiche qui porte le décryptage. Aucun test ne vérifie la l.172 (Grep dans `src/__tests__` : 0).

### Application et diff réel (P0 s11)

F2 et F3 : 2 lignes du brouillon, puis `npx tsx scripts/content/import-article.ts ../../docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md --update` (dry-run : seul `content` change), puis `--write`. F1 : 1 fonction et 3 lignes de code. 0 caractère dans les 21 messages, H2, slug, title, meta, FAQ. Le `--update` posant `updatedAt = now()`, F1 doit être déployé pour que le rendu du 22/10 soit propre.

## 4. Ne comptent pas contre le 10

- **« À lire ensuite » avec « Comment faire rire une fille »** (`m06`) : sélection automatique du gabarit (cluster, puis catégorie, puis récents) ; elle changera avec les articles publiés d'ici le 22/10.
- **Titre de l'encart « Ces techniques, entraîne-les… »** : texte de l'encart Répartie, commun au gabarit noté 10/10.
- **Repris de l'iter2** : bouton Envoyer sur les lignes à dire à voix haute, « [prénom] » envoyé tel quel, hiérarchie citée 4 fois dans la section bureau.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A1-iter3.md
- Décisions prises : D1 à D6 appliqués et visibles au rendu ; 9,8/10 (78/80) ; 3 correctifs restants : F1 (code, commun aux 4 articles), F2 et F3 (2 lignes du brouillon).
- Points d'attention : @fullstack déploie F1 avant le 22/10 ; @copywriter applique F2 et F3 puis `--update`.
---
