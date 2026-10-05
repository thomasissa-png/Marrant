# Notation : A2 /blog/voeux-drole-nouvelle-annee (itération 4, contrôle, 05/10/2026)

> Revue @reviewer. Base : rendu de production redéployé après correctifs (`snap2/voeux-drole-nouvelle-annee/` : `m00` à `m08` en 390 px, `d-haut`, `d-bas`, sans JavaScript, donc sans boutons Partager), HTML servi `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A2-iter3.md` (9,6/10).

## 1. Correctifs de l'iter3 : appliqués et visibles

| # | Correctif | Preuve | Verdict |
|---|---|---|---|
| F1 | « Mis à jour » jamais antérieur à la publication (code commun, voir `notation-A1-iter4.md`) | HTML servi : `<time dateTime="2026-11-12">`, JSON-LD `datePublished` et `dateModified` = `2026-11-12`, plus aucun « Mis à jour ». En-tête `m00` : « 12 novembre 2026 · 7 min de lecture ». | PASS |
| F2 | FAQ 3 « Oui, pour la plupart. Ceux qui citent un détail d'exemple… » | brouillon l.226, `m07` (carte FAQ 3), HTML servi : présent dans la FAQ affichée ET dans le JSON-LD FAQPage | PASS |
| F3 | « **Tu as fait le tour ?** Choisis ta situation : » | brouillon l.195, `m06` (intro collée à la liste de 7 thèmes) ; blague du jour : sommaire (l.45) et fin (l.208) seulement | PASS |

Cohérence F2 : la FAQ 3 (« un fauteuil, un prénom, un mois ») renvoie bien au point 1 affiché juste au-dessus en `m06` (« fauteuil, « compta ? », Biscotte, Sébastien, mars »). Plus de contradiction.

Intouchables : 27 messages, H2, questions de FAQ, slug inchangés ; zéro tiret cadratin dans le HTML servi ; aucun humoriste.

## 2. Grille

| # | Critère | Iter3 | Iter4 | Justification |
|---|---|---|---|---|
| 1 | Réponse immédiate | 10 | **10** | En bref et sommaire des 5 destinataires dans le 1er écran (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Inchangé. |
| 3 | CTA d'inscription | 10 | **10** | Inchangé (`m06`, `m07`). |
| 4 | Lisibilité mobile | 10 | **10** | Inchangé. |
| 5 | Ton Marrant | 9 | **10** | F3 : 2 mentions de la blague du jour, une au début, une à la fin. |
| 6 | Conformité | 9 | **10** | F2 : la FAQ 3 dit vrai, à l'écran comme dans le JSON-LD. |
| 7 | Sécurité SEO | 9 | **10** | F1 : dates cohérentes partout. |
| 8 | Mesure | 10 | **10** | 27 emplacements verrouillés par test. |

**Note globale : 10/10** (80/80).

## 3. Correctifs restants

Aucun.

## 4. Hors note

- Statut interne du brouillon (l.14) : note de travail, non publiée, à rafraîchir au prochain `--update`.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A2-iter4.md
- Décisions prises : F1, F2, F3 appliqués et visibles ; 10/10 (80/80) ; aucun correctif restant.
- Points d'attention : aucun avant la publication du 12/11.
---
