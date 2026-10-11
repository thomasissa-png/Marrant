# Notation : A5 /blog/blagues-poisson-d-avril-adultes (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures de production de la page d'aperçu admin (`snap/blagues-poisson-d-avril-adultes/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), brouillon `docs/copy/articles-forte-frappe/A5-blagues-poisson-d-avril-adultes.md` (numéros de ligne = ce fichier), `config/blog-forte-frappe.ts`, `components/blog/blog-vanne-share.tsx`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : aucun correctif ne touche le texte des 15 idées ; 0 tiret cadratin ; 0 humoriste.
> Non compté : boutons Partager absents (sans JS). Le libellé de ces boutons se lit donc dans le code (C1 ci-dessous).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Où | Capture |
|---|---|---|---|
| C1 | Sommaire sous « En bref » | l.43 | m00 : dans le 1er écran |
| C2 | Fin de corps sans 2e « blague du jour » | l.128 | m04 |
| C3 | Encart Répartie | `blog-forte-frappe.ts` l.54 | m06, d-bas |
| C4 | Ordre des idées (sœur, samedi) | l.87-111 | m02, m03 |
| C5 | Partager « l'idée » | `blog-vanne-share.tsx` | **Non appliqué** : l.46 `title="Vanne - deviens-marrant.fr"`, l.49 `Partager la vanne n°${vanne}` ; `FORTE_FRAPPE_IDEA_SLUGS` absent |
| C6 | 12 indications | l.60 à l.120 | m01 à m04 |
| C7 | Sortie famille | l.96 | m03 |
| C8 | 2 affirmations non sourcées | l.57, l.145 | m01, m04 |
| C9 | Quiz | l.139 | m04 |
| C10 | Title, H1, « blague » dans « En bref » | l.10, l.41 | m00, d-haut |

9 sur 10.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | H1 lisible, « En bref » avec « blague de poisson d'avril pour adultes », sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **9/10** | Le bloc de sortie « Tu as fait le tour ? » + 7 thèmes + quiz (l.128-139) arrive avant la section « Les règles » (m04, m05) : le lecteur reçoit le « fin de page » alors qu'il lui reste une section du sommaire. B1, B2 et B3 le placent après les règles. |
| 3 | CTA d'inscription | **10/10** | « Le canular est prêt. Et la riposte ? » suivi de l'encart Répartie : promesse et sortie alignées (m05, m06). |
| 4 | Lisibilité mobile et structure | **9/10** | C5 non appliqué : le bouton dira « Partager la vanne n°N » et le partage aura pour titre « Vanne » sur un canular. |
| 5 | Ton Marrant des textes affichés | **9/10** | « Avoir des idées en stock, c'est bien. Les jouer proprement, c'est ce qui sépare [...] » (l.147, m04) : tic « X, c'est bien. Y, c'est… » retiré de B3 à l'iter1 (C11). |
| 6 | Conformité | **10/10** | Plus d'affirmation de fréquence, quiz exact, « Révèle vite » appliqué dans les indications (n°3, 5, 6), zéro tiret cadratin, zéro humoriste. |
| 7 | Sécurité SEO | **10/10** | Title 59 car. en français, requête en tête, « blague » dans les 20 premiers mots, 4 H2 en question. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage, ancres, scroll, `src=`). |

**Note globale : 9,6/10** (77/80), contre 8,6 à l'iter1.
**Après les 3 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 3. Correctifs exacts

### C1. Partager « l'idée », pas « la vanne » (critère 4, report de l'iter1 C5)

Fichier : `apps/web/src/config/blog-forte-frappe.ts`. **Avant** (l.30) : `export const FORTE_FRAPPE_SLUGS = Object.keys(FORTE_FRAPPE_SHARE);`
**Après** :
```ts
export const FORTE_FRAPPE_SLUGS = Object.keys(FORTE_FRAPPE_SHARE);

/** Lignes numérotées = idées (canulars), pas des vannes : libellé et titre de partage adaptés. */
export const FORTE_FRAPPE_IDEA_SLUGS: ReadonlySet<string> = new Set(["blagues-poisson-d-avril-adultes"]);
```
Fichier : `apps/web/src/components/blog/blog-vanne-share.tsx`.

| Ligne | Avant | Après |
|---|---|---|
| l.7 | `import type { BlogShareMode } from "@/config/blog-forte-frappe";` | `import { FORTE_FRAPPE_IDEA_SLUGS, type BlogShareMode } from "@/config/blog-forte-frappe";` |
| l.31 | `const textOnly = mode === "text-only";` | la même ligne, puis : `const idea = FORTE_FRAPPE_IDEA_SLUGS.has(slug);` |
| l.46 | `title="Vanne - deviens-marrant.fr"` | `title={idea ? "Idée de poisson d'avril - deviens-marrant.fr" : "Vanne - deviens-marrant.fr"}` |
| l.49 | ``label={textOnly ? `Envoyer le message n°${vanne}` : `Partager la vanne n°${vanne}`}`` | ``label={textOnly ? `Envoyer le message n°${vanne}` : `Partager ${idea ? "l'idée" : "la vanne"} n°${vanne}`}`` |

Les 11 autres slugs ne bougent pas. Pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, ligne dans `REPLIT_ACTIONS.md`. À vérifier sur une capture avec JavaScript.

### C2. Bloc de sortie après les règles (critère 2)

Fichier : brouillon A5. Déplacement, aucun mot changé.
**Avant** (ordre actuel) : l.126 `---` · l.128-139 (« **Tu as fait le tour ?** [...] » + liste des 7 thèmes + quiz) · l.141 `---` · l.143-157 (H2 « Comment réussir un poisson d'avril sans le gâcher ? » jusqu'à « [...] plan semaine par semaine. ») · l.159-163 (3 lignes →).
**Après** : l.126 `---` · H2 règles et son contenu (ex-l.143-157) · `---` · bloc « Tu as fait le tour ? » + liste + quiz (ex-l.128-139) · 3 lignes → (ex-l.159-163) · `## FAQ`.
Pourquoi : même ordre que B1 et B3 (règles, puis sortie de fin, puis CTA) ; « Tu as fait le tour ? » devient vrai au moment où il s'affiche. Ancre « Les règles » inchangée. Réimport `--update`.

### C3. Phrase d'entrée des règles (critère 5)

**Avant** (l.147) : `Avoir des idées en stock, c'est bien. Les jouer proprement, c'est ce qui sépare le bon complice de celui qu'on évite jusqu'au 2 avril.`
**Après** : `Quatre règles pour les jouer proprement, et rester le complice qu'on n'évite pas jusqu'au 2 avril.`
Pourquoi : retire le tic de gabarit, garde la chute du « 2 avril » et annonce les 4 règles en gras qui suivent.

Diff réel (P0 s11) : 1 ligne réécrite et 1 bloc de 7 lignes déplacé sur environ 140 lignes de contenu ; environ 6 lignes de code ; 0 mot changé dans les 15 idées.

## 4. Ne comptent pas contre le 10

- **« Mis à jour le 5 octobre 2026 »** sous « 25 février 2027 » (m00, d-haut) : artefact d'aperçu, disparaît à la publication (voir notation B1 iter2, §4).
- **« Laisse-la paniquer »** dans la n°6 : texte d'idée validé à l'aveugle ; l'indication (« Révèle dès sa première réponse ») le borne.
- **Heures « 7 h 20 », « 20 h »** : aucune coupure sur les captures ; protégées de toute façon par le correctif `fr-typo` de la notation B2 iter2 (C2).
- **Section bureau à 3 idées** et **« À lire ensuite »** commun aux CATALOGUE : inchangés depuis l'iter1, hors note.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A5-iter2.md
- Décisions prises : 9,6/10 ; 9 correctifs iter1 sur 10 appliqués et visibles, C5 (libellé de partage) non appliqué et reporté ; 3 correctifs pour 10/10.
- Points d'attention : @fullstack applique C1 (et capture avec JS) ; @copywriter applique C2 et C3 puis réimport `--update` ; publication le 25/02/2027.
---
