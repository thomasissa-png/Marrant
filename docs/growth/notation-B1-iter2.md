# Notation : B1 /blog/refuser-une-invitation-avec-humour (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures de production de la page d'aperçu admin (`snap/refuser-une-invitation-avec-humour/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, prises sans JavaScript), HTML source de la même page (`apercu-source.html`), brouillon `docs/copy/articles-forte-frappe/B1-refuser-une-invitation-avec-humour.md` (numéros de ligne = ce fichier), `config/blog-forte-frappe.ts`, `scripts/content/article-markdown.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : aucun correctif ne touche le texte des 21 lignes ; 0 tiret cadratin dans les textes proposés ; 0 humoriste.
> Non compté : boutons « Envoyer le message n°N » absents des captures (sans JS ; les 21 emplacements `data-share-vanne` sont bien dans le HTML) ; liens bleutés « le timing de l'humour » et « parcours Machine à Café » (même classe `text-accent-link` que les autres dans le source : style `:visited` du navigateur de capture).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Brouillon | Capture |
|---|---|---|---|
| D1 | Sommaire en 2e bloc | l.46 | m00 : sommaire dans le 1er écran, avant « Chaque réponse » |
| D2 | Phrase du timing | l.73 | m01 |
| D3 | Intro famille | l.98 | m02 |
| D4 | Indications n°3, 5, 11, 14, 18, 19 | l.63, 69, 107, 126, 148, 151 | m01, m02, m03, m04 |
| D5 | Fin de section 5 vers Répartie | l.161 | m04 |
| D6 | Encart parcours Répartie | `blog-forte-frappe.ts` l.52 | m07, d-bas : « Parcours Répartie » |
| D7 | FAQ 3 | l.207 | m06 |

7 sur 7.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref », promesse « 21 réponses » et sommaire tiennent dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, plus de doublon autodérision, encart Répartie aligné sur le CTA « la relance en face ». |
| 3 | CTA d'inscription | **10/10** | Juste après le corps (m05), titre relié à la section 5, note vraie (m06). |
| 4 | Lisibilité mobile et structure | **7/10** | **Texte technique visible** : la dernière réponse de la FAQ finit par « <!-- FIN → » (m06, d-bas). Le reste est propre (format numéro, ligne, indication). |
| 5 | Ton Marrant des textes affichés | **9/10** | Il reste le tic « Copier un texte, c'est bien. L'adapter, c'est ce qui le rend à toi. » (l.169, m04), déjà retiré de B3 à l'iter1 (C11). |
| 6 | Conformité | **10/10** | Promesse Répartie exacte, zéro tiret cadratin, zéro humoriste, rien sur l'organisateur. |
| 7 | Sécurité SEO | **9/10** | Le JSON-LD FAQPage contient le commentaire : `acceptedAnswer` de la 4e question = « [...] trois paragraphes. <!-- FIN --> » (source). |
| 8 | Mesure | **10/10** | Inchangé, hérité du gabarit (slug suivi, partage, ancres, scroll, `src=`). |

**Note globale : 9,4/10** (75/80), contre 9,25 à l'iter1.
**Publication du 19/11 : NO-GO tant que C1 n'est pas appliqué** (texte technique visible et dans les données structurées).
**Après les 3 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 3. Correctifs exacts

### C1. Retirer le commentaire « FIN » du brouillon (critères 4 et 7, bloquant)

Cause : `extractContent` (`scripts/content/article-markdown.ts` l.84-88) prend tout ce qui suit « ## Contenu de l'article » jusqu'à la fin du fichier ; le `<!-- FIN -->` de la l.213 est donc collé à la dernière réponse de la FAQ. Le rendu l'échappe (`&lt;!-- FIN --&gt;` dans le HTML, donc texte visible) et la ligature de la police affiche « --> » comme une flèche. B1 est le seul brouillon concerné (Grep `<!--` sur `articles-forte-frappe/` : 1 occurrence).

Fichier : `docs/copy/articles-forte-frappe/B1-refuser-une-invitation-avec-humour.md`.
**Avant** (l.211 à l.213) :
```md
Cela dépend de l'invitation. [...] un refus drôle suivi d'un mot sincère passe presque toujours mieux qu'un message froid de trois paragraphes.

<!-- FIN -->
```
**Après** (l.211, fin de fichier) :
```md
Cela dépend de l'invitation. [...] un refus drôle suivi d'un mot sincère passe presque toujours mieux qu'un message froid de trois paragraphes.
```
Puis réimport `--update` (article non publié, accepté par `updateRefusal`).

### C2. Garde-fou à l'import (évite la récidive sur les 7 brouillons suivants)

Fichier : `apps/web/scripts/content/article-markdown.ts`. **Avant** (l.191-193) :
```ts
  if (/^# /m.test(article.content)) {
    errors.push("Le contenu contient un titre H1 (« # ») : le H1 de la page vient du champ title.");
  }
```
**Après** :
```ts
  if (/^# /m.test(article.content)) {
    errors.push("Le contenu contient un titre H1 (« # ») : le H1 de la page vient du champ title.");
  }
  if (article.content.includes("<!--")) {
    errors.push("Le contenu contient un commentaire HTML (« <!-- ») : le rendu l'affiche en texte, FAQ et JSON-LD compris. Le retirer du brouillon.");
  }
```
Test à ajouter (`__tests__/scripts/import-article.test.ts`) : un brouillon finissant par `<!-- FIN -->` produit cette erreur. Pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, ligne dans `REPLIT_ACTIONS.md`.

### C3. Phrase d'entrée des règles (critère 5)

**Avant** (l.169) : `Copier un texte, c'est bien. L'adapter, c'est ce qui le rend à toi. Quatre règles, dans l'ordre :`
**Après** : `Pour que ton refus sonne comme toi, quatre règles, dans l'ordre :`
Pourquoi : tic « X, c'est bien. Y, c'est… » de la charte copy s11 et « le rend à toi » (« rendre à » = restituer), corrigés sur B3 (iter1 C11). Formulation propre à B1, pour ne pas dupliquer celle de B3.

Diff réel (P0 s11) : 2 lignes de contenu sur environ 165, 3 lignes de code ; 0 caractère dans les 21 lignes, le title, la meta ou les H2.

## 4. Ne comptent pas contre le 10

- **« Mis à jour le 5 octobre 2026 » avant « 19 novembre 2026 »** (m00, d-haut) : artefact d'aperçu. `updatedAt` = date du dernier `--update` ; à la publication, `prepared-content.ts` l.132-135 passe par `updateMany`, qui renseigne `@updatedAt` le jour même : `updatedAt` = date, la mention disparaît (`blog-article-view.tsx` l.98). À contrôler sur la 1re capture après le 19/11.
- **« À lire ensuite » avec « Comment faire rire une fille »** : cartes du cluster `fort-volume`, communes à tous les articles CATALOGUE (gabarit noté 10/10).
- **Espace réservé à droite des 3 premières lignes de chaque réponse** : emplacement du bouton, rempli avec JS.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B1-iter2.md
- Décisions prises : 9,4/10 ; D1 à D7 appliqués et visibles ; NO-GO publication tant que le commentaire « <!-- FIN --> » reste dans le contenu (visible et dans le JSON-LD) ; 3 correctifs pour 10/10.
- Points d'attention : @copywriter applique C1 et C3 puis réimport `--update` ; @fullstack ajoute le garde-fou C2 (et son test) ; nouvelle capture m06 et d-bas avant le 19/11.
---
