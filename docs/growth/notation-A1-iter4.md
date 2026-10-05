# Notation : A1 /blog/message-anniversaire-drole-par-situation (itération 4, contrôle, 05/10/2026)

> Revue @reviewer. Base : rendu de production redéployé après correctifs (`snap2/message-anniversaire-drole-par-situation/` : `m00` à `m07` en 390 px, `d-haut`, `d-bas`, sans JavaScript, donc sans boutons Partager), HTML servi `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/A1-message-anniversaire-drole.md`, code `lib/blog-visibility.ts` l.32.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Itération précédente : `notation-A1-iter3.md` (9,8/10).

## 1. Correctifs de l'iter3 : appliqués et visibles

| # | Correctif | Preuve | Verdict |
|---|---|---|---|
| F1 | « Mis à jour » jamais antérieur à la publication | `publicUpdatedAt` dans `blog-visibility.ts` l.32, appelée par `blog-article-page.ts` l.78, `sitemap.ts` l.92, `llms-full.txt/route.ts` l.126 ; test `blog-visibility-faq.test.ts` l.60-72. HTML servi : `<time dateTime="2026-10-22">`, JSON-LD `datePublished` et `dateModified` = `2026-10-22`, plus aucun « Mis à jour ». En-tête `m00` : « 22 octobre 2026 · 6 min de lecture ». | PASS |
| F2 | « Une seule chute suffit : la phrase sincère va avant elle sur une carte, ou dans un second message. » | brouillon l.156, HTML servi, `m04` (encadré « À retenir ») | PASS |
| F3 | Blague du jour une seule fois dans le bloc de fin | brouillon l.172 (« le catalogue de vannes, rangé par situation, chaque vanne avec sa chute et son décryptage »), `m04` bas ; seule mention restante en l.182, `m05` | PASS |

Intouchables : 21 messages, H2, FAQ, slug inchangés ; zéro tiret cadratin dans le HTML servi (Grep `—` : 0) ; aucun humoriste.

## 2. Grille

| # | Critère | Iter3 | Iter4 | Justification |
|---|---|---|---|---|
| 1 | Réponse immédiate | 10 | **10** | En bref, sommaire et message n°1 dans le 1er écran (`m00`). |
| 2 | Sorties vers une 2e page | 10 | **10** | Inchangé. |
| 3 | CTA d'inscription | 10 | **10** | Inchangé (`m05`). |
| 4 | Lisibilité mobile | 10 | **10** | Inchangé. |
| 5 | Ton Marrant | 9 | **10** | F2 et F3 visibles : plus de « une phrase », plus de doublon de promesse. |
| 6 | Conformité | 10 | **10** | Zéro tiret cadratin, zéro humoriste. |
| 7 | Sécurité SEO | 9 | **10** | F1 : dates cohérentes dans l'en-tête, le JSON-LD et le sitemap. |
| 8 | Mesure | 10 | **10** | Gabarit commun, 21 emplacements. |

**Note globale : 10/10** (80/80).

## 3. Correctifs restants

Aucun.

## 4. Hors note

- Bandeau « Aperçu : publication prévue le 22/10/2026 » : propre à l'aperçu admin, absent de la page publique.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A1-iter4.md
- Décisions prises : F1, F2, F3 appliqués et visibles ; 10/10 (80/80) ; aucun correctif restant.
- Points d'attention : aucun avant la publication du 22/10.
---
