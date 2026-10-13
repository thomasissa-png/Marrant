# Validation design du lot 1 « montrer l'offre » (13/10/2026)

**Note : 7,5/10. Verdict : GO** pour la mise en ligne. Aucun défaut bloquant visible. 4 retouches non bloquantes à passer au prochain lot (section « Réserves »).

Méthode : lecture visuelle des 20 captures `captures-offre-final/` (4 articles, mobile 375 et desktop 1280, plus l'en-tête de l'accueil) et de la capture d'avant `article-blagues-2026-mobile-tranche08.png`. Les captures d'encart sont des **découpes du composant seul** : je n'ai pas vu l'encart dans le flux de l'article, donc l'air autour et le rythme avec les listes de vannes ne sont pas jugés. Tailles et hauteurs lues à l'œil (mobile = 1:1), **aucun contraste mesuré**.

## Notes par critère

| Critère | Note | Preuve |
|---|---|---|
| Repérabilité de l'encart sans intrusion | 7/10 | `meilleures-blagues-droles-2026-bloc1-mobile.png` |
| Hiérarchie des 2 boutons du bloc de fin | 8/10 | `...-bloc3-mobile.png`, `...-bloc3-desktop.png` |
| Cohérence avec le reste du site | 8/10 | 4 articles, accueil desktop |
| En-tête mobile | 8/10 | `accueil-entete-mobile.png` |
| Lisibilité mobile | 8/10 | bloc1 à bloc3 mobile |

## Repérabilité de l'encart : 7/10
- Mieux qu'avant : la carte grise de la tranche08 (bouton violet de 187 px, mention de ≈ 11 px, même gris que les cartes de FAQ) devient un bloc avec **filet violet gauche (≈ 4 px)**, surtitre en capitales grises (« PARCOURS RÉPARTIE »), titre blanc gras d'environ 18 px et bouton pleine largeur. Aucun aplat violet : rien ne crie, c'est bien « au fil de la lecture ».
- Limite : hors le filet violet, la carte garde le gris et le rayon des cartes de FAQ. Le repérage repose sur ce seul filet. Elle ne devrait pas passer inaperçue entre deux listes de texte, mais je ne l'ai pas vue en contexte. À confirmer sur une capture pleine page.
- Positions (21 %, 32 %, 80 % sur l'article n°1) : premier appel avant 25 %, critère de l'audit tenu. 21 % puis 32 % sur ≈ 14 900 px, soit ≈ 1 600 px d'écart (2 écrans) : acceptable, car les deux encarts proposent deux parcours différents (Répartie puis Boulot). Pas de répétition à l'identique.
- Pas de barre collante, pas de fenêtre : garde-fou respecté.

## Hiérarchie des 2 boutons du bloc de fin : 8/10
- Mobile (`bloc3-mobile`) : étape gratuite en contour (≈ 44 px, texte blanc gras), puis « Accéder aux parcours complets » en violet plein (≈ 50 px, pleine largeur). L'œil va sur l'aplat violet : un seul `primary` par bloc, gratuit et payant ne se confondent plus (défaut D2 corrigé).
- Desktop : contour à gauche, plein à droite, même hauteur, alignés. Lecture claire.
- Défaut mineur 1 : le **contour est quasi invisible** (gris foncé sur gris foncé, environ 1,2:1 à l'œil). Le bouton se lit grâce à son texte et à sa forme, pas à son trait. L'audit demandait un contour violet. À rehausser (violet ou gris clair), non bloquant.
- Défaut mineur 2 : sur mobile le libellé du bouton plein passe sur 2 lignes avec « complets » seul à la ligne (bloc3 et blocs de fin des 3 autres articles). Lisible, mais moins net que le bouton de l'accueil (1 ligne). Corrigeable en CSS (`text-wrap: balance` ou padding latéral réduit), sans toucher au texte.

## Cohérence avec le site : 8/10
- Même fond sombre, même violet d'accent unique, mêmes rayons, mêmes flèches violettes que l'accueil. Rien de « template » : pas de dégradé, pas d'icône dans un carré.
- Le bloc de fin des 4 articles est le même composant (surtitre, titre, 2 puces, 2 boutons, mention), seul le contenu change : bon pour la marque.
- Le contour discret rejoint le gris des pastilles de l'accueil : cohérent, mais plus faible que le patron « fiche vidéo » (fond teinté, bordure violette) que l'audit citait comme référence.

## En-tête mobile : 8/10 (`accueil-entete-mobile.png`)
- Rien ne déborde : logo jusqu'à x ≈ 167, bouton « Commencer » x ≈ 204 à 311, menu burger à ≈ 346, marges respectées, ≈ 37 px libres entre logo et bouton.
- Cible du bouton : ≈ 107 × 44 px (y 10 à 54), donc **à 44 px pile, à confirmer à l'inspecteur**. L'icône burger fait ≈ 18 px : sa zone tactile n'est pas visible sur la capture, à vérifier (≥ 44 px).
- Deux points non vérifiables ici : (1) les icônes compte et recherche ont disparu de la barre, je n'ai pas de capture du menu ouvert pour voir où elles sont ; (2) l'audit prévoyait ce bouton pour le visiteur **non connecté** : à vérifier qu'un membre connecté ne voit pas « Commencer ».
- Sur l'accueil, l'en-tête et le hero montrent chacun un violet plein dans le même écran. Acceptable pour un en-tête persistant, à noter.

## Lisibilité mobile : 8/10
- Corps de l'encart ≈ 15 px, titre ≈ 18 px sur 2 lignes, interligne large, retours à la ligne propres. Mention de prix et d'accès libre ≈ 12 px en gris : le poste le plus faible (contraste estimé à l'œil, non mesuré). Surtitre capitales ≈ 12 px même réserve.
- Les 2 puces du bloc de fin tiennent sur 2 à 3 lignes sans orpheline gênante.

## Réserves (aucune bloquante)
1. Rehausser le contour du bouton gratuit (violet ou gris plus clair).
2. Éviter l'orpheline « complets » du bouton plein en mobile (sans changer le texte).
3. Vérifier à l'inspecteur : hauteur ≥ 44 px du bouton d'en-tête et zone du burger, état connecté, accès au compte et à la recherche dans le menu.
4. Mesurer avec axe ou Lighthouse le contraste des textes gris de 12 px (surtitre, mention de prix).
5. Joindre une capture pleine page d'un article avec l'encart en contexte au prochain passage.

Handoff → @orchestrator
- Fichier : `/home/user/Marrant/docs/marrant/audit-conversion-s20/validation-lot1-design.md` ; 7,5/10, GO.
- Points d'attention : contour trop discret, orpheline du libellé, vérifications d'en-tête (état connecté, cibles), contrastes non mesurés.
