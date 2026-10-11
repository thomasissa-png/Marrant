# Notation : A4 /blog/blagues-de-couple-drole (itération 4, contrôle, 05/10/2026)

> Revue @reviewer. Base : rendu de production redéployé après correctifs (`snap2/blagues-de-couple-drole/` : `m00` à `m08` en 390 px, `d-haut`, `d-bas`, sans JavaScript, donc sans boutons Partager), HTML servi `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/A4-blagues-de-couple.md`, `components/ui/markdown-renderer.tsx` l.43-51 (`nestedGuillemets`), `__tests__/ui/markdown-renderer-forte-frappe.test.ts` l.107-136.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A4-iter3.md` (9,6/10).
> Typographie actée (non rouverte) : seul un « » à l'intérieur d'un « … » extérieur passe en “…”.

## 1. Correctifs de l'iter3 : appliqués et visibles

| # | Correctif | Preuve | Verdict |
|---|---|---|---|
| F1 | « Mis à jour » jamais antérieur à la publication (code commun, voir `notation-A1-iter4.md`) | HTML servi : `<time dateTime="2026-11-05">`, JSON-LD `datePublished` et `dateModified` = `2026-11-05`, plus aucun « Mis à jour ». En-tête `m00` : « 5 novembre 2026 · 7 min de lecture ». | PASS |
| F2 | « » cités dans une vanne « … » rendus en “…”, à l'affichage et au partage | Implémenté par `nestedGuillemets` (variante plus sûre que le code proposé : imbrication déséquilibrée ou à 3 niveaux laissée intacte), tests l.107-136. Rendu : n°3 « À la fin du film, j'ai dit “j'ai un truc dans l'œil”. Elle a répondu “oui, depuis la bande-annonce”. », n°8 (`m01`), n°15, 16, 17, 20 (`m03`). n°17 : « … Ils disent tous “on ne l'entend plus”. Moi, on est devenus proches. », la chute n'est plus coupée. `data-text` du partage identique (HTML servi). Grep « « » imbriqués dans le HTML : 0. Indications en italique : « » conservés (« notaire », « Je savoure encore »), conforme. | PASS |

Intouchables : 30 vannes (texte stocké intact, conversion au rendu seul), H2, ancres, slug, title, meta, FAQ, `lib/vannes-themes.ts` ; « 30 » cohérent entre title, meta et En bref (`m00`) ; zéro tiret cadratin dans le HTML servi ; aucun humoriste.

## 2. Grille

| # | Critère | Iter3 | Iter4 | Justification |
|---|---|---|---|---|
| 1 | Réponse immédiate | 10 | **10** | En bref chiffré, sommaire des 6 moments dans le 1er écran (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Inchangé. |
| 3 | CTA d'inscription | 10 | **10** | Inchangé. |
| 4 | Lisibilité mobile | 8 | **10** | F2 : plus aucune vanne avec des « » dans des « » (`m01`, `m03`). |
| 5 | Ton Marrant | 10 | **10** | Inchangé. |
| 6 | Conformité | 10 | **10** | Inchangé. |
| 7 | Sécurité SEO | 9 | **10** | F1 : dates cohérentes partout. |
| 8 | Mesure | 10 | **10** | 30 emplacements, verrouillés par test. |

**Note globale : 10/10** (80/80).

## 3. Correctifs restants

Aucun.

## 4. Hors note

- **Blague du jour citée 2 fois** (sommaire l.43, fin l.197) : 2 formules différentes à 150 lignes d'écart, déjà accepté à l'iter3.
- **Section Messages à 3 vannes** : faute de lignes validées à l'aveugle en réserve, inchangé depuis l'iter1.
- **n°18 (grand-père « qui entend rien »)** : gardée par défaut, décision de Thomas en attente (voir `notation-A4-iter3.md` §5). La retirer ferait passer title, meta et En bref à 29.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A4-iter4.md
- Décisions prises : F1 et F2 appliqués et visibles ; 10/10 (80/80) ; aucun correctif restant.
- Points d'attention : décision fondateur sur la n°18 avant le 05/11 (hors note).
---
