# Notation : A4 /blog/blagues-de-couple-drole (itération 3, finale, 05/10/2026)

> Revue @reviewer. Base : captures du rendu de production sur l'aperçu admin (`snap/blagues-de-couple-drole/` : `m00` à `m08` en 390 px, `d-haut` et `d-bas` en 1280 px, sans JavaScript), brouillon `docs/copy/articles-forte-frappe/A4-blagues-de-couple.md` (228 lignes, 30 vannes, numéros de ligne ci-dessous), `components/ui/markdown-renderer.tsx` l.35, l.43-46, l.313-318, `__tests__/ui/markdown-renderer-forte-frappe.test.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A4-iter2.md` (9,1/10, 29 vannes).
> Boutons Partager absents des captures (ajoutés en JavaScript) : non compté. L'espace réservé à droite des 30 vannes est visible.
> Intouchables respectés par tous les correctifs : 30 vannes (0 caractère du texte stocké touché), zéro tiret cadratin, aucun humoriste, `lib/vannes-themes.ts` non touché (textes de page thème validés par Thomas, [CHOIX UTILISATEUR] rappelé en l.8 et l.31 du brouillon).

## 1. Correctifs de l'itération 2

| # | Correctif | Vu sur | Verdict |
|---|---|---|---|
| C1 | Titre du CTA « Et quand l'autre te les renvoie ? » | `m06` | PASS |
| C2 | n°13 « tenu comme une pièce à conviction » | `m02` | PASS |
| C3 | Intro belle-famille « loin de la tablée », n°21 racontée à des amis | `m03` | PASS |
| C4 | « Ça vous détend tous les deux » | `m03` (n°15) | PASS |
| C5 | n°29 « le lendemain, jamais pendant » | `m05` | PASS |
| C6 | « le sujet que l'autre ne prendra jamais mal » | `m02` | PASS |
| C7 | « Pour une conversation à plusieurs, au dîner ou au bureau » | `m05` | PASS |
| C8 | FAQ 1 « tout ce qu'il t'a confié » | `m06`, `m07` | PASS |
| C9 | n°19 « le soir ou sur la route » | `m03` | PASS |
| C10 | « « ma copine » ou « mon copain » par le prénom de l'autre » | `m06` | PASS |
| C11 | Page thème couple | non applicable | Retiré : `vannes-themes.ts` est intouchable. La différence est portée par l'article (ancre « le catalogue de vannes de couple », `m01`). Ne compte plus contre le critère 7. |

Hors liste : F5 (grand-père) est revenue en n°18 ; nombre recompté : 8 + 6 + 7 + 6 + 3 = 30, cohérent avec le title, la meta et l'En bref (`m00`).

**Écart avec l'iter2** : « « » imbriqués rendus en “…” » y était noté acquis. Les captures montrent le contraire : 10 vannes sur 30 s'affichent avec des « » dans des « » (n°3, 8, 10, 15, 16, 17, 20, 23, 26, 30 ; `m01` à `m05`, `d-haut`). Exemple n°17 : « Chez ses parents, un coq chante à 5 h. Ils disent tous « on ne l'entend plus ». Moi, on est devenus proches. » On croit que la vanne finit après « plus ». La conversion existe pour les `"` de l'étalon, pas pour des « » dans des « ».

## 2. Grille et notes

| # | Critère | Iter2 | Iter3 | Justification (1 ligne) |
|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 10 | **10** | En bref chiffré, sommaire des 6 moments et intro dans le 1er écran (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Une sortie différente par section, 4 puces, quiz, conseils, vidéos, encart Confiance. |
| 3 | CTA d'inscription | 9 | **10** | Titre aligné sur ce que le texte vend (Répartie), placé après le corps (`m06`). |
| 4 | Lisibilité mobile et structure | 10 | **8** | Guillemets imbriqués « « » » sur 10 vannes : la chute paraît coupée au premier ». |
| 5 | Ton Marrant des textes affichés | 8 | **10** | Les 7 défauts de l'iter2 sont corrigés et visibles ; plus aucune formule répétée. |
| 6 | Conformité | 8 | **10** | n°19 hors de la table, consigne « prénom » applicable, zéro tiret cadratin, zéro humoriste. |
| 7 | Sécurité SEO | 8 | **9** | C11 hors périmètre (intouchable), mais l'en-tête affiche « 5 novembre 2026 · Mis à jour le 5 octobre 2026 » (`m00`, `d-haut`) ; ce 5 octobre partira en `dateModified`, `modifiedTime` et `lastmod`. |
| 8 | Mesure | 10 | **10** | 30 emplacements de partage, slug suivi. |

**Note globale : 9,6/10** (77/80).
**Après les 2 correctifs ci-dessous : 10/10 sur les 8 critères.** Je ne vois pas d'autre amélioration concrète.

## 3. Correctifs exacts

### F1. « Mis à jour » antérieur à la publication (critère 7, commun aux 4 articles)

Correctif de code unique, détaillé dans `notation-A1-iter3.md` §3 F1 : fonction `publicUpdatedAt` dans `lib/blog-visibility.ts`, utilisée par `lib/blog-article-page.ts` l.77, `app/sitemap.ts` l.92 et `app/llms-full.txt/route.ts` l.126.

### F2. « » cités dans une vanne « … » : 2e niveau en “…”, au rendu et au partage (critère 4)

Le texte stocké ne change pas (intouchable) : la conversion se fait au rendu, comme pour les `"` de l'étalon. Elle réutilise `innerQuotes` (l.44-46), que `notation-A3-iter3.md` F3 garde pour cette raison.

Fichier `apps/web/src/components/ui/markdown-renderer.tsx`. **Avant** (l.313 à l.318) :
```ts
    const joke = options.shareJokes ? JOKE_RE.exec(block) : null;
    htmlParts.push(
      joke
        ? `<div id="vanne-${joke[1]}" class="flow-root scroll-mt-20"><span data-share-vanne="${joke[1]}" data-text="${escapeAttr(shareText(joke[2]))}" class="float-right ml-3 mt-3 block h-11 w-11"></span>${renderBlock(block)}</div>`
        : renderBlock(block),
    );
```
**Après** :
```ts
    const joke = options.shareJokes ? JOKE_RE.exec(block) : null;
    // Vanne « … » qui cite des « … » (format A4) : 2e niveau en “…”, affiché comme partagé.
    const quote = joke?.[2].startsWith("«") ? `«${innerQuotes(joke[2].slice(1, -1))}»` : joke?.[2];
    const shown = joke && quote ? block.replace(joke[2], () => quote) : block;
    htmlParts.push(
      joke && quote
        ? `<div id="vanne-${joke[1]}" class="flow-root scroll-mt-20"><span data-share-vanne="${joke[1]}" data-text="${escapeAttr(shareText(quote))}" class="float-right ml-3 mt-3 block h-11 w-11"></span>${renderBlock(shown)}</div>`
        : renderBlock(block),
    );
```
Effet : n°3 s'affiche « À la fin du film, j'ai dit “j'ai un truc dans l'œil”. Elle a répondu “oui, depuis la bande-annonce”. », et part ainsi au partage. Les indications en italique, hors de `joke[2]`, gardent leurs « » (une citation en italique n'est pas imbriquée). Étalon : ses vannes « … » ne contiennent pas de « » (ses citations sont des `"`), `innerQuotes` n'y change rien ; son empreinte SHA-256 porte sur le texte stocké, inchangé. A1 et A2 : lignes sans « en tête, chemin inchangé.

Fichier `apps/web/src/__tests__/ui/markdown-renderer-forte-frappe.test.ts`. **Avant** (fin de fichier) : rien. **Après**, ajouter :
```ts
describe("A4 importé : vannes « … » qui citent des « … »", () => {
  const content = importedContent("A4-blagues-de-couple.md");
  const html = renderMarkdown(content, { shareJokes: true });

  it("30 emplacements ; 2e niveau en “…”, affiché et partagé", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    const shared = slots(html)[2].text;
    expect(shared.match(/«/g)).toHaveLength(1);
    expect(shared).toContain("“j");
    const shown = html.slice(html.indexOf('id="vanne-3"'), html.indexOf('id="vanne-4"'));
    expect(shown.match(/«/g)).toHaveLength(2); // 1 dans data-text, 1 affiché (indication n°3 sans « »)
  });
});
```
Pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`, avant le 05/11. Contrôle au rendu : captures 390 px des n°3, 17 et 30.

### Diff réel (P0 s11)

0 ligne du brouillon, 0 caractère des 30 vannes, H2, ancres, slug, title, meta, FAQ. Code : 3 lignes modifiées et 2 ajoutées dans le renderer, 1 bloc de test, plus F1 (commun). Pas de `--update` nécessaire.

## 4. Ne comptent pas contre le 10

- **Section Messages à 3 vannes** : position inchangée depuis l'iter1, faute de lignes validées à l'aveugle en réserve sur ce moment.
- **Blague du jour citée 2 fois** (l.43, l.197) : 2 formules différentes, 150 lignes d'écart.
- **« À lire ensuite » avec « Comment faire rire une fille »** (`m07`) : sélection automatique du gabarit.

## 5. Décision pour Thomas (hors note)

- **n°18 (F5, le grand-père « qui entend rien »)** : remise en place par le brouillon (l.8, point 6), alors que l'iter2 proposait de la laisser en réserve. La chute porte sur le narrateur (pris pour le notaire), mais le point de départ est l'ouïe d'un membre de la famille, ce que la section (l.111) et la FAQ 3 excluent. Défaut : la garder, la vanne est validée et son indication l'écarte de la table de Noël. La retirer ferait passer le title, la meta et l'En bref à 29.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A4-iter3.md
- Décisions prises : C1 à C10 appliqués et visibles, C11 retiré (intouchable) ; 9,6/10 (77/80) ; 2 correctifs restants, tous en code : F1 (commun aux 4 articles) et F2 (guillemets imbriqués, avec test).
- Points d'attention : l'iter2 tenait F2 pour acquis, ce que les captures démentent ; @fullstack applique F2 en même temps que F3 de l'A3 (même fonction `innerQuotes`), avant le 05/11.
---
