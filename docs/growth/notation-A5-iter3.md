# Notation : A5 /blog/blagues-poisson-d-avril-adultes (itération 3, contrôle, 05/10/2026)

> Revue @reviewer. Base : nouvelles captures de production après déploiement des correctifs (`snap2/blagues-poisson-d-avril-adultes/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), HTML servi (`apercu-source.html`), brouillon `docs/copy/articles-forte-frappe/A5-blagues-poisson-d-avril-adultes.md` (numéros de ligne = ce fichier), `config/blog-forte-frappe.ts`, `components/blog/blog-vanne-share.tsx`, test `markdown-renderer-forte-frappe.test.ts`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : texte des 15 idées intact (contrôlé sur m01 à m04), slug inchangé ; 0 tiret cadratin dans le HTML servi ; 0 humoriste.

## 1. Correctifs iter2 : appliqués et visibles

| # | Correctif | Code / brouillon | Rendu |
|---|---|---|---|
| C1 | Partager « l'idée » | `blog-forte-frappe.ts` l.37 (`FORTE_FRAPPE_IDEA_SLUGS`), l.40-50 (`shareLabel`, `shareTitle`) ; `blog-vanne-share.tsx` l.46 et l.49 les appellent ; test l.179-182 : « Partager l'idée n°3 », titre « Idée de poisson d'avril - deviens-marrant.fr » | non visible (captures sans JS) ; vérifié dans le code et le test |
| C2 | Bloc de sortie après les règles | ordre l.128 H2 règles → l.142 → `---` → l.146 « Tu as fait le tour ? » → l.148-157 → l.159-163 → FAQ | m04 puis m05 : règles, puis « Tu as fait le tour ? », thèmes, quiz, 3 lignes →, CTA |
| C3 | Phrase d'entrée des règles | l.132 « Quatre règles pour les jouer proprement, et rester le complice qu'on n'évite pas jusqu'au 2 avril. » | m04 |

3 sur 3. Le report de l'iter1 (C5) est soldé.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | H1, « En bref » avec la requête et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | « Tu as fait le tour ? » arrive après la dernière section du sommaire ; encart Répartie aligné sur le CTA « Et la riposte ? » (m05, m06). |
| 3 | CTA d'inscription | **10/10** | « Le canular est prêt. Et la riposte ? », note « Les idées de cette page restent en accès libre » (m05). |
| 4 | Lisibilité mobile et structure | **10/10** | Libellé de partage juste (« l'idée »), heures liées (« 7 h 20 », « 20 h »), puces thèmes à 44 px (m03, m05). |
| 5 | Ton Marrant des textes affichés | **10/10** | Tic « X, c'est bien. Y, c'est… » retiré ; la phrase annonce les 4 règles en gras qui suivent. |
| 6 | Conformité | **10/10** | Aucune affirmation de fréquence, quiz exact, zéro tiret cadratin, zéro humoriste. |
| 7 | Sécurité SEO | **10/10** | Title, H1, 4 H2 et ancre « Les règles » inchangés ; bloc déplacé sans mot changé. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage `with-url`, ancres, scroll, `src=`). |

**Note globale : 10/10** (80/80), contre 9,6 à l'iter2.
**Correctifs restants : aucun.**

## 3. Hors note (aucun effet sur le 10)

- « Mis à jour le … » n'apparaît plus sous la date (m00, d-haut) : point de l'iter2 §4 résolu.
- « À lire ensuite » (m06) : cartes du cluster générique (« Comment faire rire une fille ») au lieu de la liste dédiée de `config/blog-related-cards.ts` l.61-65. Même constat que B2 iter3 §3 : déploiement à vérifier par @fullstack, sujet du gabarit.
- Indication n°12 (l.111) : « Ceux qui répondent « ok » tout de suite » alors que l'idée n°12 demande de lever le pouce, et que la n°10 écrit « OK ». Mineur, optionnel : `Ceux qui lèvent le pouce tout de suite sont ta cible préférée.` (indication, pas une idée validée à l'aveugle).
- Libellé « Partager l'idée n°N » : à confirmer sur une capture avec JS avant le 25/02/2027.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A5-iter3.md
- Décisions prises : 10/10 ; C1 à C3 de l'iter2 appliqués (C1 vérifié dans le code et le test, C2 et C3 visibles).
- Points d'attention : capture avec JS (libellé de partage) ; liste « À lire ensuite » dédiée à vérifier dans le déploiement.
---
