# Notation : B4 /blog/message-drole-fete-des-meres (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures du rendu production de l'aperçu (`snap3/message-drole-fete-des-meres/` : m00 à m07 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), `apercu-source.html`, brouillon `docs/copy/articles-forte-frappe/B4-message-drole-fete-des-meres.md` (numéros de ligne = ce fichier), `config/blog-cta.ts` l.79-85, `config/blog-forte-frappe.ts` l.78-80, `config/blog-related-cards.ts` l.28-32, `lib/blog-article-page.ts` l.76-78.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : 23 lignes, slug, title, meta, H2, ancres, questions de FAQ inchangés ; pages thèmes non touchées ; « 1 500+ » absent. Grep U+2014 : 0 dans le brouillon, 0 dans le HTML servi. Zéro humoriste, zéro concurrent, aucun chiffre ajouté (seule date : 30/05/2027, vérifiée à l'iter1).
> Non compté : boutons « Envoyer le message n°N » absents (sans JS) ; « À lire ensuite » réduit à l'étalon (B5, A1 et les vœux ne sont pas encore publiés) ; `<meta name="description">` générique de l'aperçu (le JSON-LD porte la bonne).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Brouillon / code | Capture |
|---|---|---|---|
| C1 | Sommaire en 2e bloc, sortie « phrases drôles » retirée | l.46-48 | m00 : sommaire vers 860 px dans l'aperçu, vers 790 px sans le bandeau « Aperçu » (1er écran 390 × 844) ; d-haut |
| C2 | Date de la fête dans l'intro | l.44 | m00, d-haut |
| C3 | « Quelques lignes » / « Chaque message est court » | l.13, l.42, l.48 | m00 |
| C4 | Accord au féminin dans les indications n°7, 15, 18 | l.83, l.123, l.132 | m03 (n°15, n°18) |
| C5 | Exemples de la carte = n°1 à 4 | l.54 | m00, d-haut |
| C6 | Angle propre de l'appel | l.94, l.97 | m02 |
| C7 | Promesse Confiance, sans doublon autodérision | l.111 | m02 |
| C8 | Trois fins de section | l.68, l.137, l.157 | d-haut, m03, m04 |
| C9 | « À retenir » et règles 2 à 4 propres à B4 | l.163-173 | m04, m05 |
| C10 | FAQ 1 réécrite | l.195 | m06, d-bas |
| C11 | CTA distinct de B5 | blog-cta.ts l.81-82 = brouillon l.33-34 | m05 |
| C12 | Parcours Confiance | blog-forte-frappe.ts l.79 | m06, d-bas : « Reprends confiance, une conversation à la fois » |
| G1 | Plus de « Mis à jour » antérieur à la publication | blog-article-page.ts l.76-78 (`publicUpdatedAt`) | m00 et d-haut : « 22 avril 2027 » seul ; JSON-LD `dateModified` = `datePublished` = 2027-04-22 |

13 sur 13. Point §5 de l'iter1 (cartes « À lire ensuite ») traité aussi : B5, A1 et les vœux en tête de liste (`blog-related-cards.ts` l.28-32), « Comment faire rire une fille » ne sort plus. Le lien B4 → B5 prévu en §6 de l'iter1 est couvert par la carte B5, qui apparaîtra seule le 13/05/2027 : plus de `--update` à faire ce jour-là.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref », date du 30 mai, « 23 messages drôles » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, plus de doublon (autodérision 1 fois, famille 1 fois au repas) ; encart Confiance aligné sur l.111 et sur le CTA. |
| 3 | CTA d'inscription | **10/10** | « Le message est choisi. Le reste de la journée s'improvise. », Confiance nommé, note juste (m05) ; plus rien de commun avec B5. |
| 4 | Lisibilité mobile et structure | **10/10** | Numéro, ligne, indication lisibles en 390 px ; l'accord au féminin est dit à côté de la ligne concernée ; FAQ hors du corps. |
| 5 | Ton Marrant des textes affichés | **10/10** | Plus de promesse fausse, plus de phrase d'A1, exemples tous rattachés à une ligne (la règle 1 « ton écriture » renvoie à la faute de la n°20). |
| 6 | Conformité | **10/10** | Confiance décrit par sa propre promesse, rien sur l'âge ou la cuisine de la mère, jour difficile traité, 0 tiret cadratin. |
| 7 | Sécurité SEO | **10/10** | Title 50 car., meta 145 car. (JSON-LD), 6 H2 en question, 6 ancres justes, `dateModified` = `datePublished`. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage `text-only`, ancres, scroll, `src=`). |

**Note globale : 10/10** (80/80), contre 8,8 à l'iter1.

## 3. Correctifs restants

Aucun.

Diff réel (P0 s11) : vérifié ligne à ligne contre les « Après » de l'iter1 (brouillon non commité, pas de `git diff` possible) : chaque ligne visée par C1 à C10 et les 2 lignes CTA portent le texte prescrit, au caractère près ; slug, title, meta, H2, ancres et questions de FAQ identiques à ceux cités à l'iter1 ; les 23 lignes n'étaient visées par aucun correctif et les n°7, 15 et 18 (seules concernées par C4) sont intactes.

## 4. Hors note (sans effet sur le 10)

- **« Un mot drôle suffit à te rendre présent »** (l.143) : masculin générique dans un texte qui s'adresse au lecteur, jamais envoyé par le bouton. À laisser.
- **Date du 30 mai** (l.44) : à remettre à jour chaque année avec `updatedAt` (règle notée à l'iter1, C2).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B4-iter2.md
- Décisions prises : 10/10 (80/80) ; C1 à C12 et G1 appliqués et visibles ; cartes « À lire ensuite » par article confirmées.
- Points d'attention : aucun correctif ; captures avec JS (boutons Partager) à reprendre le 22/04/2027.
---
