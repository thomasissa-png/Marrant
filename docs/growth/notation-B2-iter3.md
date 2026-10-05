# Notation : B2 /blog/blagues-de-gamer-jeux-video (itération 3, contrôle, 05/10/2026)

> Revue @reviewer. Base : nouvelles captures de production après déploiement des correctifs (`snap2/blagues-de-gamer-jeux-video/` : m00 à m08 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), HTML servi (`apercu-source.html`), brouillon `docs/copy/articles-forte-frappe/B2-blagues-de-gamer.md` (numéros de ligne = ce fichier), `components/ui/markdown-renderer.tsx`, `lib/fr-typo.ts`, `config/blog-forte-frappe.ts`, test `markdown-renderer-forte-frappe.test.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Typographie actée (non rouverte) : « » de 1er niveau conservés, 2e niveau affiché “…”.
> Intouchables : texte stocké des 24 vannes intact (les correctifs agissent au rendu), page thème Gaming non touchée, slug inchangé ; 0 tiret cadratin dans le HTML servi ; 0 humoriste, 0 marque.

## 1. Correctifs iter2 : appliqués et visibles

| # | Correctif | Code / brouillon | Rendu |
|---|---|---|---|
| C1 | 2e niveau de guillemets en “…” | `markdown-renderer.tsx` l.51 et l.167 ; test l.131-136 | m02 à m04 : n°7 « … “bonsoir à tous”. … “bonsoir madame”. », n°9, 10, 11, 12, 13, 16, 18, 23 au même format ; la vanne ne semble plus finir au 1er « » » |
| C2 | Milliers et heures insécables | `fr-typo.ts` l.26 | m03 : « 4 812 » sur une seule ligne ; HTML : `23 h 40` lié |
| C3 | Encart parcours sur Répartie | `blog-forte-frappe.ts` l.77 | m07 : « Parcours Répartie », aligné sur le CTA « dont Répartie » (m06) et la sortie Vocal (m02) |
| C4 | 2e paragraphe sans redite | l.45 finit sur « ce que les autres en pensent. » | m00, d-haut |

4 sur 4.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section ; CTA, section Vocal et encart parlent tous de Répartie. |
| 3 | CTA d'inscription | **10/10** | Après le corps, « Reste à les sortir en vocal », note vraie (m06). |
| 4 | Lisibilité mobile et structure | **10/10** | Guillemets à deux niveaux lisibles, nombres et heures non coupés, puces thèmes à 44 px (m05). |
| 5 | Ton Marrant des textes affichés | **10/10** | Plus de redite « Ici, » ; intro, test et règles sans gabarit. |
| 6 | Conformité | **10/10** | Quiz exact, FAQ cohérente, zéro marque, jeu, console, humoriste ou tiret cadratin. |
| 7 | Sécurité SEO | **10/10** | Title, meta, 6 H2, ancres inchangés ; texte stocké des vannes identique. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage avec URL, ancres, scroll, `src=`) ; le texte partagé passe aussi par `nestedGuillemets` (l.340). |

**Note globale : 10/10** (80/80), contre 9,5 à l'iter2.
**Correctifs restants : aucun.**

## 3. Hors note (aucun effet sur le 10)

- « Mis à jour le … » n'apparaît plus sous la date (m00, d-haut) : point de l'iter2 §4 résolu.
- « À lire ensuite » (m07) montre encore les cartes du cluster générique (dont « Comment faire rire une fille ») alors que `config/blog-related-cards.ts` l.66-70 et `lib/blog-related.ts` (notation B4 iter1) prévoient une liste dédiée. Deux lectures possibles : ce code n'est pas encore dans le déploiement capturé, ou l'aperçu passe par un autre chemin. À contrôler par @fullstack (`git show <branche déployée>:apps/web/src/lib/blog-article-page.ts`) ; sujet du gabarit, déjà classé hors note à l'iter2.
- H2 à parenthèse sur 4 lignes en 390 px : position de l'iter2 maintenue (mots-clés, ancres).
- Boutons Partager non visibles (captures sans JS) : à contrôler sur une capture avec JS avant le 26/11.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B2-iter3.md
- Décisions prises : 10/10 ; C1 à C4 de l'iter2 appliqués et visibles.
- Points d'attention : vérifier si la liste « À lire ensuite » dédiée (B4 iter1) est déployée ; capture avec JS avant publication.
---
