# Notation : B5 /blog/message-drole-fete-des-peres (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures du rendu production de l'aperçu (`snap3/message-drole-fete-des-peres/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/B5-message-drole-fete-des-peres.md` (numéros de ligne = ce fichier), `config/blog-cta.ts` l.86-92, `config/blog-forte-frappe.ts` l.80, `config/blog-related-cards.ts` l.33-37, `lib/blog-article-page.ts` l.76-78.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : 19 lignes (vanne catalogue n°19 comprise), slug, title, meta, questions de FAQ inchangés ; pages thèmes non touchées ; « 1 500+ » absent. Grep U+2014 : 0 dans le brouillon, 0 dans le HTML servi. Zéro humoriste, zéro concurrent, aucun chiffre ajouté.
> Non compté : boutons « Envoyer le message n°N » absents (sans JS) ; « À lire ensuite » réduit à l'étalon (B4, A1 et les vœux ne sont pas encore publiés) ; `<meta name="description">` générique de l'aperçu (le JSON-LD porte la bonne).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Brouillon / code | Capture |
|---|---|---|---|
| C1 | Sommaire en 2e bloc, 2 ancres mises à jour | l.47-49 | m00 : sommaire dans le 1er écran |
| C2 | « Une ou deux phrases » retiré | l.13, l.43 | m00 |
| C3 | « restée garée » (n°15) | l.116 | m03 |
| C4 | N°19 : indication et bouton d'accord | l.128 | m03 |
| C5 | Sortie autodérision propre à B5 | l.75 | m01 |
| C6 | Exemples barbecue et voiture = n°7, 9, 10 | l.81 | m01 |
| C7 | Timing une seule fois, plus de « soirée » | l.101, l.146 | m02, m04 |
| C8 | 2 H2 distincts de B4 | l.105, l.134 | m02, m03 |
| C9 | Intro de l'appel sans éventer la n°19 | l.107 | m02 |
| C10 | Promesse Confiance | l.130 | m03 |
| C11 | « À retenir » et règles 1-2 propres au père | l.136-142 | m04 |
| C12 | FAQ 1 alignée sur la règle 1 | l.167 | m05, d-bas |
| C13 | Pied de page | l.152 | m04 |
| C14 | Parcours Confiance | blog-forte-frappe.ts l.80 | d-bas |
| C15 | Lien vers B4 | l.148 | m04 |
| G1 | Plus de « Mis à jour » antérieur | blog-article-page.ts l.76-78 | m00 : « 13 mai 2027 » seul ; JSON-LD `dateModified` = `datePublished` = 2027-05-13 |

16 sur 16. Ancres du sommaire (l.47) = `headingId` des H2 l.79, l.105, l.134 (recalculées). Cartes « À lire ensuite » : B4 en tête (`blog-related-cards.ts` l.34), visible le 13/05 puisque B4 sort le 22/04.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | Date du 20 juin, « 19 messages drôles » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, timing une fois, B4 lié au bon moment, encart Confiance cohérent avec l.130. |
| 3 | CTA d'inscription | **10/10** | Inchangé, « Reste à le dire en face », distinct de B4 (m05). |
| 4 | Lisibilité mobile et structure | **10/10** | Accord de la n°15 et usage écrit de la n°19 dits à côté de la ligne ; rendu propre en 390 px. |
| 5 | Ton Marrant des textes affichés | **9/10** | « tient sur un écran de téléphone » 2 fois dans le 1er écran : En bref (l.43) puis 3e paragraphe (l.49), à 6 lignes d'écart (m00). Écho créé par l'iter1 elle-même (C1 et C2 ont prescrit la même formule aux deux endroits). |
| 6 | Conformité | **10/10** | Règle 1 et FAQ 1 ne contredisent plus les n°14 et 18 ; Confiance décrit par sa propre promesse ; date vraie. |
| 7 | Sécurité SEO | **10/10** | H2 distincts de B4, 4/4 ancres justes, `dateModified` = `datePublished`, title et meta inchangés. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage `text-only`, ancres, scroll, `src=`). |

**Note globale : 9,9/10** (79/80), contre 8,6 à l'iter1.
**Après le correctif ci-dessous : 10/10 sur les 8 critères.**

## 3. Correctif restant

### C1. Une seule fois « tient sur un écran de téléphone » (critère 5)

Fichier : `docs/copy/articles-forte-frappe/B5-message-drole-fete-des-peres.md`, puis import `--update`.
**Avant** (l.49, 1re phrase) : `Chaque message tient sur un écran de téléphone, avec en dessous l'endroit et le moment où l'envoyer.`
**Après** : `En dessous de chaque message : l'endroit et le moment où l'envoyer.`
Pourquoi : l'En bref (l.43) garde la formule, c'est la réponse à « c'est quoi, un message drôle de fête des pères ». Le 3e paragraphe ne la répète plus et garde son rôle (dire ce qu'il y a sous chaque ligne). Construction distincte de B4 l.48 (« Sous chacun, une indication en italique te dit où et quand l'utiliser »). La 2e phrase de l.49 ne change pas.

Diff réel (P0 s11) : 1 phrase sur environ 180 lignes de contenu ; 0 caractère dans les 19 lignes, le slug, le title, la meta, les H2, les ancres, les questions de FAQ. Zéro code.

Vérification des correctifs iter1 (P0 s11) : chaque ligne visée par C1 à C13 et C15 porte le texte prescrit, au caractère près ; les 19 lignes n'étaient visées par aucun correctif.

## 4. Hors note (sans effet sur le 10)

- **« le parcours Confiance t'aide à reprendre confiance »** (l.130) : écho nom/promesse, mais c'est le titre exact de l'encart (« Reprends confiance, une conversation à la fois ») ; formule prescrite à l'iter1, à laisser.
- **Règle 4, « Décide d'abord où il la recevra, ensuite la phrase »** (l.146) : « la » annonce « la phrase » qui suit ; se lit d'une traite. À laisser.
- **CTA sans parcours nommé** alors que l'encart montre Confiance : choix iter1 (critère 3 à 10) maintenu, le corps nomme Confiance l.130. Le commentaire de code `blog-forte-frappe.ts` l.78 (« le CTA nomme Confiance ») n'est vrai que pour B4 : sans effet visible.
- **Date du 20 juin** (l.45, FAQ 4) : à remettre à jour chaque année avec `updatedAt`.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B5-iter2.md
- Décisions prises : 9,9/10 (79/80) ; C1 à C15 et G1 appliqués et visibles ; 1 correctif d'une phrase (l.49) pour 10/10.
- Points d'attention : @copywriter applique C1 puis import `--update` ; condition de publication (B4 indexé à J+21) inchangée.
---
