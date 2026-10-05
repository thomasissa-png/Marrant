# Notation : A3 /blog/premier-message-drole-appli-de-rencontre (itération 4, contrôle, 05/10/2026)

> Revue @reviewer. Base : rendu de production redéployé après correctifs (`snap2/premier-message-drole-appli-de-rencontre/` : `m00` à `m09` en 390 px, `d-haut`, `d-bas`, sans JavaScript, donc sans boutons Partager), HTML servi `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md`, `components/ui/markdown-renderer.tsx` l.43-51 et l.328-329, `__tests__/ui/markdown-renderer-forte-frappe.test.ts` l.85-100.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A3-iter3.md` (9,6/10).
> Typographie actée (non rouverte) : « » de 1er niveau conservés dans les messages en citation.

## 1. Correctifs de l'iter3 : appliqués et visibles

| # | Correctif | Preuve | Verdict |
|---|---|---|---|
| F1 | « Mis à jour » jamais antérieur à la publication (code commun, voir `notation-A1-iter4.md`) | HTML servi : `<time dateTime="2026-10-29">`, JSON-LD `datePublished` et `dateModified` = `2026-10-29`, plus aucun « Mis à jour ». En-tête `m00` : « 29 octobre 2026 · 8 min de lecture ». | PASS |
| F2 | « C'est un message court qui dit… » | brouillon l.49, `m00` bas, HTML servi | PASS |
| F3 | « » des messages conservés au 1er niveau | renderer l.328-329 (plus de conversion dans le chemin blockquote), tests l.85-100. Rendu : n°2 « merci pour l'info » (`m01`), n°15 « ce week-end », n°16 « fragile », n°17 « Plus tard » (`m05`). HTML servi : 0 guillemet “ ou ” (Grep). La page n'a plus qu'un style de guillemets. | PASS |

Intouchables : 18 messages et 2 vannes du catalogue (aucun mot touché), titres de situation, H2, FAQ, slug ; zéro tiret cadratin dans le HTML servi ; aucun humoriste, aucune marque d'appli.

## 2. Grille

| # | Critère | Iter3 | Iter4 | Justification |
|---|---|---|---|---|
| 1 | Réponse immédiate | 10 | **10** | En bref et sommaire des 4 situations dans le 1er écran (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Inchangé. |
| 3 | CTA d'inscription | 10 | **10** | Inchangé. |
| 4 | Lisibilité mobile | 9 | **10** | F3 : titres et messages en « » cohérents (`m05`). |
| 5 | Ton Marrant | 9 | **10** | F2 : « court » ne contredit plus les messages de 3 phrases ni le point 2. |
| 6 | Conformité | 10 | **10** | Inchangé. |
| 7 | Sécurité SEO | 9 | **10** | F1 : dates cohérentes partout. |
| 8 | Mesure | 10 | **10** | 18 emplacements, slug suivi. |

**Note globale : 10/10** (80/80).

## 3. Correctifs restants

Aucun.

## 4. Hors note (repris de l'iter3, sans changement)

- « Le gag est sur » aux n°6 et n°15 : 2 occurrences à 9 messages d'écart.
- Message n°4 : décision ouverte pour Thomas depuis l'iter1, gardé par défaut.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A3-iter4.md
- Décisions prises : F1, F2, F3 appliqués et visibles ; 10/10 (80/80) ; aucun correctif restant.
- Points d'attention : aucun avant la publication du 29/10.
---
