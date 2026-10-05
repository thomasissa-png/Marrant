# Notation : B1 /blog/refuser-une-invitation-avec-humour (itération 3, contrôle, 05/10/2026)

> Revue @reviewer. Base : nouvelles captures de production après déploiement des correctifs (`snap2/refuser-une-invitation-avec-humour/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), HTML servi (`apercu-source.html`), brouillon `docs/copy/articles-forte-frappe/B1-refuser-une-invitation-avec-humour.md` (numéros de ligne = ce fichier), `scripts/content/article-markdown.ts`, `__tests__/scripts/import-article.test.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : texte des 21 lignes intact (contrôlé sur m00 à m04), slug inchangé ; 0 tiret cadratin dans le HTML servi ; 0 humoriste.

## 1. Correctifs iter2 : appliqués et visibles

| # | Correctif | Code / brouillon | Rendu |
|---|---|---|---|
| C1 | Commentaire « FIN » retiré | brouillon finit l.211 sur « trois paragraphes. » | m06, d-bas : dernière réponse de FAQ propre ; HTML servi : 0 `&lt;!--`, JSON-LD FAQPage finit sur `trois paragraphes."}}]}` |
| C2 | Garde-fou import | `article-markdown.ts` l.196 + test `import-article.test.ts` l.127-130 | sans objet (code) |
| C3 | Phrase d'entrée des règles | l.169 « Pour que ton refus sonne comme toi, quatre règles, dans l'ordre : » | m04 |

3 sur 3. Le NO-GO publication de l'iter2 est levé.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref », « 21 réponses » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, bloc de fin après les règles, encart Répartie aligné sur le CTA (m05, d-bas). |
| 3 | CTA d'inscription | **10/10** | Juste après le corps, « Le refus est parti. Reste la relance en face. », note vraie (m05, m06). |
| 4 | Lisibilité mobile et structure | **10/10** | Plus aucun texte technique ; numéro, ligne, indication lisibles ; puces thèmes à 44 px (m05). |
| 5 | Ton Marrant des textes affichés | **10/10** | Tic « X, c'est bien. Y, c'est… » retiré ; aucun autre gabarit relevé. |
| 6 | Conformité | **10/10** | Zéro tiret cadratin, zéro humoriste, rien sur l'organisateur, promesse Répartie exacte. |
| 7 | Sécurité SEO | **10/10** | JSON-LD FAQPage propre, slug, title, H2 et ancres inchangés. |
| 8 | Mesure | **10/10** | Inchangé (gabarit : slug suivi, partage, ancres, scroll, `src=`). |

**Note globale : 10/10** (80/80), contre 9,4 à l'iter2.
**Correctifs restants : aucun.** Publication du 19/11 : GO.

## 3. Hors note (aucun effet sur le 10)

- « Mis à jour le … » n'apparaît plus sous la date (m00, d-haut) : point de l'iter2 §4 résolu.
- « À lire ensuite » (m06, d-bas) : cartes du cluster générique (« Comment faire rire une fille ») au lieu de la liste dédiée de `config/blog-related-cards.ts` l.44-48. Même constat que B2 iter3 §3 : déploiement à vérifier par @fullstack, sujet du gabarit.
- Encart parcours (d-bas) : puces du gabarit (« la pique en TD ») communes à tous les articles qui pointent Répartie ; hors périmètre de l'article.
- Boutons « Envoyer le message n°N » non visibles (captures sans JS) : à contrôler sur une capture avec JS avant le 19/11.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B1-iter3.md
- Décisions prises : 10/10 ; C1 à C3 de l'iter2 appliqués et visibles ; NO-GO levé.
- Points d'attention : une capture avec JavaScript (boutons d'envoi) avant publication.
---
