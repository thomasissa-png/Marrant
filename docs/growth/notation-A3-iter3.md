# Notation : A3 /blog/premier-message-drole-appli-de-rencontre (itération 3, finale, 05/10/2026)

> Revue @reviewer. Base : captures du rendu de production sur l'aperçu admin (`snap/premier-message-drole-appli-de-rencontre/` : `m00` à `m09` en 390 px, `d-haut` et `d-bas` en 1280 px, sans JavaScript), brouillon `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md` (numéros de ligne ci-dessous), `components/ui/markdown-renderer.tsx` l.43-46 et l.300-307, `__tests__/ui/markdown-renderer-forte-frappe.test.ts` l.60-91.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A3-iter2.md` (9,5/10).
> Boutons Partager absents des captures (ajoutés en JavaScript) : non compté. L'espace réservé à droite des 18 titres de situation est visible.
> Intouchables respectés par tous les correctifs : 20 lignes (18 messages + 2 vannes du catalogue), aucun mot touché, la ponctuation validée est au contraire rétablie (F3) ; zéro tiret cadratin, aucun humoriste, aucune marque d'appli, aucune page thème touchée.

## 1. Correctifs de l'itération 2 : appliqués et visibles

| # | Correctif | Vu sur | Verdict |
|---|---|---|---|
| C1 | Bouton relié à « moules, pas scripts » | `m06` | PASS |
| C2 | Titre n°18 avec la condition, indication réécrite | `m05`, `m06` | PASS |
| C3 | Indications n°8, 9, 10 aux ouvertures différentes | `m03`, `m04` | PASS |
| C4 | N°16 sans redite de la n°15 | `m05` | PASS |
| C5 | N°17 sans redite du paragraphe relance | `m05` | PASS |
| C6 | N°2 : porte ouverte ajoutée | `m01` | PASS |
| C7 | FAQ 2 : une seule comparaison | `m07`, `d-bas` | PASS |
| C8 | « jamais aux dépens du message de l'autre » | `m04` bas, `m05` haut | PASS |

Rendu : sommaire dans le 1er écran mobile (`m00`), règles en encadré, format titre / message en citation / indication régulier sur les 18, 4 puces thèmes en zone de tap pleine hauteur (`m07`), CTA juste après le corps (`m07`), FAQ en cartes, encart Confiance en bas (`m08`). Desktop propre (`d-haut`, `d-bas`).

## 2. Grille et notes

| # | Critère | Iter2 | Iter3 | Justification (1 ligne) |
|---|---|---|---|---|
| 1 | Réponse immédiate à l'intention | 10 | **10** | En bref et sommaire des 4 situations dans le 1er écran mobile (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Une sortie ciblée par section, 4 puces, quiz, étalon, conseils, encart Confiance. |
| 3 | CTA d'inscription | 10 | **10** | Après le corps, promesse tournée vers l'écrit, note vraie (`m07`). |
| 4 | Lisibilité mobile et structure | 9 | **9** | C1 et C2 réglés, mais au rendu les messages numérotés affichent “pardon”, “ce week-end”, “Plus tard” en guillemets anglais, juste sous des titres en « » (n°15, n°17) et sur la même page que deux autres citations restées en « » (l.47, l.226). |
| 5 | Ton Marrant des textes affichés | 8 | **9** | C3 à C7 réglés, mais l.49 annonce « une ou deux phrases » juste avant des messages de 3 phrases (n°1, 3, 4) et contredit le point 2 (« Deux ou trois phrases ») et l'En bref (« deux ou trois lignes »). |
| 6 | Conformité | 9 | **10** | C8 réglé : plus aucune phrase ne contredit la règle 2. |
| 7 | Sécurité SEO | 10 | **9** | En-tête « 29 octobre 2026 · Mis à jour le 5 octobre 2026 » (`m00`, `d-haut`) ; le 5 octobre partira en `dateModified`, `modifiedTime` et `lastmod`. |
| 8 | Mesure | 10 | **10** | Gabarit commun, 18 emplacements, slug suivi. |

**Note globale : 9,6/10** (77/80).
**Après les 3 correctifs ci-dessous : 10/10 sur les 8 critères.** Je ne vois pas d'autre amélioration concrète.

## 3. Correctifs exacts

### F1. « Mis à jour » antérieur à la publication (critère 7, commun aux 4 articles)

Correctif de code unique, détaillé dans `notation-A1-iter3.md` §3 F1 : fonction `publicUpdatedAt` dans `lib/blog-visibility.ts`, utilisée par `lib/blog-article-page.ts` l.77, `app/sitemap.ts` l.92 et `app/llms-full.txt/route.ts` l.126. À déployer avant le 22/10, donc avant le 29/10.

### F2. « Une ou deux phrases » (critère 5)

**Avant** (l.49) :
```md
Un premier message drôle n'est pas un numéro de scène. C'est une ou deux phrases qui disent que tu as regardé le profil, que tu ne te prends pas trop au sérieux, et qu'on peut te répondre en une ligne.
```
**Après** :
```md
Un premier message drôle n'est pas un numéro de scène. C'est un message court qui dit que tu as regardé le profil, que tu ne te prends pas trop au sérieux, et qu'on peut te répondre en une ligne.
```
Pourquoi : n°1, 3 et 4 (les premiers que lit le visiteur) ont 3 phrases, la n°16 en a 4. Le même défaut a été corrigé en A1 (D1). « Court » ne se contredit nulle part ; le point 2 (l.212) garde son repère chiffré, qui est une consigne d'adaptation.

### F3. Guillemets des messages numérotés : « » comme dans le texte validé (critère 4)

Le texte stocké porte « pardon », « ce week-end », « Plus tard », « merci pour l'info »… (un seul niveau depuis que les messages sont en citation sans guillemets extérieurs, C7 de l'iter1). Le rendu les convertit en “…” comme s'ils étaient imbriqués : ils ne le sont plus. Résultat visible en `m05` : titre n°15 « Tu fais quoi ce week-end ? », message juste dessous « inscrite à “ce week-end” ». En typographie française, une citation en retrait n'a pas de guillemets propres : ceux qu'elle contient restent au 1er niveau, en « ».

Fichier `apps/web/src/components/ui/markdown-renderer.tsx`. **Avant** (l.43 à l.46) :
```ts
/** « … » dans un message cité en blockquote = 2e niveau : “…”, comme dans les vannes de l'étalon. */
function innerQuotes(text: string): string {
  return text.replace(/«\s*([^«»]*?)\s*»/g, "“$1”");
}
```
**Après** : garder la fonction, que `notation-A4-iter3.md` F2 réutilise pour les vannes « … » qui citent des « … » ; seul son commentaire change :
```ts
/** « … » cités dans une vanne déjà entre « … » = 2e niveau : “…”, comme les " de l'étalon. */
function innerQuotes(text: string): string {
  return text.replace(/«\s*([^«»]*?)\s*»/g, "“$1”");
}
```
**Avant** (l.305) :
```ts
      const message = innerQuotes(quoteLines.map((line) => line.replace(/^>\s?/, "")).join("\n"));
```
**Après** :
```ts
      // La citation en retrait tient lieu de guillemets : les « » du message restent au 1er niveau.
      const message = quoteLines.map((line) => line.replace(/^>\s?/, "")).join("\n");
```
Fichier `apps/web/src/__tests__/ui/markdown-renderer-forte-frappe.test.ts` :

| Ligne | Avant | Après |
|---|---|---|
| l.71 | `it("texte partagé = le blockquote seul, sans guillemets ajoutés ni numéro ; « » imbriqués en “…”", () => {` | `it("texte partagé = le blockquote seul, sans guillemets ajoutés ni numéro ; « » du message conservés", () => {` |
| l.74 | `expect(texts[1]).toBe("Ma dernière blague en réunion a reçu un “merci pour l'info”.");` | `expect(texts[1]).toMatch(/^Ma dernière blague en réunion a reçu un «\s?merci pour l'info\s?»\.$/);` |
| l.75 | `expect(texts).toContain("“Plus tard”, j'ai dit ça à ma vaisselle il y a une semaine. Prends ton temps.");` | `expect(texts).toContainEqual(expect.stringMatching(/^«\s?Plus tard\s?», j'ai dit ça à ma vaisselle/));` |
| l.76 | `for (const text of texts) expect(text).not.toMatch(/^>\|^\d\|«\|»\|\*/);` | `for (const text of texts) expect(text).not.toMatch(/^>\|^\d\|“\|”\|\*/);` |
| l.79 | `it("affichage : « » imbriqués du message en “…”, titres inchangés", () => {` | `it("affichage : « » du message conservés, titres inchangés", () => {` |
| l.81-82 | `expect(quote).toContain("“merci pour l");` puis `expect(quote).not.toMatch(/[«»]/);` | `expect(quote).toMatch(/«.merci pour l/);` puis `expect(quote).not.toMatch(/[“”]/);` |

(Les `\|` du tableau sont des `|` dans le code.) Effet : les messages affichés et envoyés reprennent la ponctuation validée à l'aveugle, et la page n'a plus qu'un style de guillemets. Les vannes de l'étalon (« **N.** « … » ») ne passent pas par ce chemin (`JOKE_RE`, pas `TITLED_RE`) : leur 2e niveau “…” ne change pas. Pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`.

### Application et diff réel (P0 s11)

F2 : 1 ligne du brouillon, puis `import-article.ts … --update` (dry-run : `content` seul), puis `--write`. F1 et F3 : code. 0 mot changé dans les 20 lignes, titres de situation, H2, slug, title, meta, FAQ.

## 4. Ne comptent pas contre le 10

- **« Le gag est sur » restant aux n°6 et n°15** : 2 occurrences à 9 messages d'écart, après le correctif C3.
- **« Comment faire rire une fille » lié 2 fois dans le corps et repris dans « À lire ensuite »** (`m08`) : liens de cadrage voulus, plus sélection automatique du gabarit.
- **Message n°4** : décision toujours ouverte pour Thomas (iter1), gardé par défaut.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A3-iter3.md
- Décisions prises : C1 à C8 appliqués et visibles ; 9,6/10 (77/80) ; 3 correctifs restants : F1 (code commun aux 4 articles), F2 (1 ligne du brouillon), F3 (renderer + test, guillemets).
- Points d'attention : @fullstack applique F3 avec le test, en même temps que F1, avant le 29/10 ; @copywriter applique F2 puis `--update`.
---
