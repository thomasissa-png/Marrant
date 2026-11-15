# Relecture UX à l'aveugle, v6 tour 2 : /parcours et /parcours/repartie (s25)

Captures : `docs/captures/s25/v6-tour-2/parcours/` (4 comptes x 5 largeurs x 2 pages). Ouvertes : visiteur 375/1280/1920 (repartie), 1280 (liste) ; gratuit 375/768 ; en-cours 768/1280 ; nouvel 1280. Les autres largeurs n'ont pas été ouvertes une à une (les hauteurs de page 1280/1456/1920 sont identiques dans l'INDEX : coque plafonnée, voulu). Lu : brief v6, navigation v6, `docs/design/cta-forme-place-s21.md` (§1.3, B15, §3.4). Aucun texte réécrit.

## Conformité aux décisions écrites
- B15 (/parcours) : un plein `primary` par carte (étape 1 gratuite), pleine largeur de carte, ligne frontière « Sans compte. La suite : Premium. » dessous, aucun Premium sur la carte, jamais deux pleins dans une carte : conforme (visiteur et gratuit).
- Abonné : un plein par carte reste respecté ; la carte du parcours le plus avancé est en plein, les autres en contour : conforme à l'esprit §1.3 (le pas suivant).
- Un seul plein Premium par écran hors en-tête sur /repartie (« Passer à l'étape 2 · 1,99 €/mois », prix et garantie à côté) : conforme.
- Bande des rubriques : présente, parcours allumé, défilante à 375 et 768 : non cassée par la page.

## Grille

| Critère | Note | Constat |
|---|---|---|
| D1 fidélité accueil | 9 | Cartes à filet dégradé en haut, pastilles, rythme aéré : oui. Piste : H1 et titres de section alignés à gauche, l'étalon centre hero et titres. |
| D2 hiérarchie | 9 | H1, cartes, bouton plein pleine largeur : lisible. |
| D3 aux 5 largeurs | 9 | Colonne centrée (~770 px sur /parcours, ~600 px sur /repartie) aux trois grandes largeurs, aucun vide d'un seul côté, aucun débordement vu à 375/768. |
| D4 cohérence espace | 9 | Mêmes cartes, mêmes titres entre /parcours et /repartie et entre comptes. |
| D5 finition | 9 | Piste : interlignes inconsistants (voir pistes). |
| UX1 compréhension | 9 | On sait où on est (fil d'Ariane, bande) et quoi faire. |
| UX2 action unique | 9 | Visiteur : un plein par carte de choix ; abonné : « Reprendre » puis « Continuer ce parcours » doublonnent (piste). |
| UX3 états vides / nouvel | 9 | Nouvel : « Étape conseillée Répartie, Commencer l'étape 1 », « cap 1 sur 5 », « Commencer » en tête de la liste d'étapes, jamais une page morte. |
| UX4 aperçu Premium | 9 | /parcours EST l'aperçu : 5 parcours lisibles, programme dépliable, une seule offre (« Abonnement 1,99 €/mois » dans « Explore aussi » en simple carte), pas de mur. |
| UX5 accessibilité / cohérence comptes | 8 | Faute dure F1 ci-dessous. |

**NOTE GLOBALE (minimum) : 8/10, sous la barre de 9 à cause de F1.**

## Fautes dures

**F1. L'inscrit gratuit lit des phrases de visiteur sans compte** (`gratuit-parcours-repartie-768.png`, `gratuit-parcours-repartie-375.png`, `gratuit-parcours-768.png`). Connecté (icône de compte dans l'en-tête), il lit sous le plein « Passer à l'étape 2 · 1,99 €/mois » : « D'abord ton compte, puis le paiement. », et sur chaque carte de /parcours : « Sans compte. La suite : Premium. ». Faux pour lui : il a déjà un compte. Rend l'état du compte illisible (UX5, cohérence entre comptes). Correction codable : passer l'état `inscritGratuit` (session sans abonnement) au bloc de fin d'étape et à la ligne frontière de carte, et afficher pour ce cas une variante sans mention de compte (ou ne rien afficher de cette ligne). Le texte de la variante est **à valider par Thomas** (ne pas inventer ici). Fichiers : `apps/web/src/components/parcours/parcours-detail.tsx` (bloc « Passer à l'étape 2 »), `apps/web/src/components/parcours/parcours-content.tsx` (ligne « Sans compte. La suite : Premium. » des cartes de la liste). Ce qui fait 10 : les 3 états (visiteur, gratuit, abonné) disent chacun une phrase vraie.

## Pistes (ne retiennent pas la note)
1. Titres alignés à gauche sur une page où l'étalon centre : `(dashboard)/parcours/(liste)/page.tsx`, en-tête de page. À arbitrer avec les autres pages de l'espace.
2. Abonné /parcours : « Reprendre » (carte du haut) et « Continuer ce parcours » (carte Machine à Café) sont deux pleins pour la même action. Garder le plein du haut, passer celui de la carte en contour (`outline-accent`) : `espace/parcours/parcours-espace.tsx`.
3. Abonné et nouvel : le quiz « Quel parcours est fait pour toi ? Question 1/2 » reste affiché alors que le parcours est choisi ou conseillé (déjà « Étape conseillée »). Le replier ou le masquer pour ces comptes : `parcours-content.tsx`.
4. /repartie visiteur et gratuit : la barre « Étape 1 gratuite, la suite avec Premium » est une carte fine à filet violet avec un petit texte gris, elle se lit comme un bloc vide. Lui donner la hauteur d'une pastille ou l'intégrer à l'en-tête de page.
5. Interlignes : « Ce que tu vas apprendre », « Le conseil » en `leading` lâche (~2) contre « Pourquoi cette étape » serré, et colonne de texte plus étroite que sa carte à 1280 : uniformiser `leading-relaxed` et la largeur dans `components/parcours/step-blocks.tsx`.
6. Abonné /repartie : le « Pour qui ? » et le pitch passent tout en bas de page (sous le programme), alors qu'ils sont en haut pour visiteur et nouvel. Cohérent si voulu, à confirmer.
7. Spec §3.4 : la carte « Étape 2 » (aperçu de l'étape suivante) n'apparaît pas avant le plein « Passer à l'étape 2 », et le plein s'affiche quiz non commencé (visiteur, gratuit). Vérifier que c'est une décision postérieure à s21.
8. Liens « Voir » des listes d'étapes (nouvel, en-cours) : vérifier la zone tactile de 44 px (`espace/parcours/lignes-fiches.tsx`) ; rien de mesurable sur capture.
