# Relecture design à l'aveugle : Quoi répondre, s26 tour 3

Captures lues : visiteur 375, 768, 1280, 1920 ; gratuit 375 ; en-cours 375, 768, 1280, 1920 ; nouvel 1280 (même structure que en-cours). Le code n'a pas été ouvert : les cibles 44 px et les contrastes sont jugés sur capture et sur la spec, pas au code.

## Gate typographique (TAILLES.md, citée)
- Visiteur et gratuit, 375 : 4 tailles (24, 20, 16, 14), 6 combinaisons. 768 : idem. 1280 et 1920 : 4 tailles (30, 20, 16, 14), 6 combinaisons.
- En-cours et nouvel, 375 / 768 : 4 tailles (24, 20, 16, 14), 5 combinaisons. 1280 / 1920 : 4 tailles (30, 20, 16, 14), 5 combinaisons.
- Graisses 400 et 600 seulement, police d'affichage limitée aux titres et au « 1 500+ ». Seuils (plus de 4 tailles ou plus de 6 combinaisons) jamais dépassés : PASS aux 4 comptes, aux 2 largeurs mesurées.

## Ce que montrent les captures
**Visiteur / gratuit (aperçu fermé).** Se lit fermé : badge « Premium » unique, bouton d'offre en haut à droite (1280, 1920, 768) ou sous le titre (375, y ≈ 340 px, bien dans le premier écran), sous-cartes à barres grises et verrous, tuiles de fin fondues, « La suite est dans Premium ». Un seul bouton plein par écran (le second est sous le pli). Deux zones de poids différents au 1280 (carte exemple 7/12, filtres 5/12) puis trois tuiles : la largeur est utilisée. La carte d'offre et la colonne hero se tiennent (hauteur 224 px chacune à 1280). Gratuit = visiteur, avec la phrase d'objet à la place du lien Connexion : cohérent.

**Abonnés (en-cours, nouvel).** Grille 3/9 au 1280 et au 1920 (contenu centré sur 1216 px, rail à gauche, tuile d'action puis lieux), lieux en deux colonnes avec compteur « faits/total » et barre, coche verte unique sur « La poêle » (en-cours), barre à zéro visible chez le nouvel abonné. Un seul aplat violet : « Voir ». Au 375, action, « Filtrer les cartes », progression du premier lieu dans le premier écran. Aucune page morte : le nouvel abonné a sa tuile d'action « Coloc : la poêle » et tous ses lieux à 0/n.

## Notes par critère (Design)
| Critère | Note | Justification |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | Gabarit sobre, un violet, bords 1 px, rayons homogènes, aucune ombre. Défaut : pastille de filtre « Commerces, voisins, transports » sur 2 lignes en `rounded-full` (forme ovale) dans le rail 1280, visible sur les 4 comptes. |
| 2 Hiérarchie | 9 | Bouton d'offre ou « Voir » dominant, titre de page, tuiles de poids égal pour les lieux. Défaut : au 1280 la tuile d'action (9 colonnes) est une bande basse de 100 px sans poids propre face au rail de 290 x 875 px. |
| 3 Usage de la largeur | 8 | Voir défauts D1, D2, D3 ci-dessous. |
| 4 Cohérence entre comptes | 9 | Même grille, mêmes tuiles, mêmes constantes. Visiteur et gratuit divergent seulement par un texte d'offre. |
| 5 Finition | 9 | Alignements propres (bord gauche du H1, du rail et des tuiles identiques à toutes les largeurs, gouttières 24 px). Non vérifiables sans code : cibles 44 px des pastilles et lignes (les lignes mesurent environ 50 px sur capture), contraste du texte à `opacity-75` sur les tuiles fermées. |

## Défauts précis (pas de faute dure)
**D1. Tuile « Coloc : la poêle » creuse (visiteur, gratuit, 1280 et 1920).** La tuile est étirée à la hauteur de la tuile de filtres : elle contient environ 105 px de vide sous les trois sous-cartes (y 765 à 870 sur 1280). C'est en fin de tuile, donc permis par la règle, mais c'est la plus grande zone vide visible de l'aperçu et elle fait « tuile creuse » (critère 3). Correction : `lg:items-start` sur la grille de l'extrait (apercu/tableau-verrouille ou la page d'aperçu) pour que chaque tuile garde sa hauteur propre ; le vide devient un vide de colonne, plus discret. Ferait 10 : aucune tuile à fond visiblement vide.

**D2. Tuile d'action abonné : 345 px vides à droite de « Voir » (en-cours et nouvel, 1280 et 1920).** Titre et durée à gauche, bouton à 26 px du titre, le reste de la tuile (≈ 340 px sur 910) est vide. C'est du vide de fin de tuile, mais le bloc entier ne pèse pas : c'est la zone qui doit dominer l'écran selon le brief. Correction sans ajouter de texte ni de taille : à `lg`, aligner le bouton à droite (`lg:flex lg:items-center lg:justify-between`) n'est pas permis par la spec (grand écart) ; préférer réduire la tuile à la largeur de son contenu (`lg:w-fit lg:max-w-full`) ou, mieux, placer dans la même tuile la progression du premier lieu (BarreProgression déjà existante). Ferait 10 : tuile d'action dont la largeur est occupée.

**D3. Colonne du rail (en-cours, nouvel, 1280 et 1920).** Le rail fait ≈ 875 px de haut, il ne tient pas dans 900 px moins l'en-tête : non collant (voulu, non noté). Conséquence chiffrée : à gauche, une colonne vide de ≈ 4 000 px à côté de la liste de 13 lieux. Permis (fin de colonne), mais le rail disparaît dès le premier lieu. Correction : réduire la hauteur du rail sous 760 px (pastilles `min-h-11` en `flex-wrap`, supprimer `gap-y` excédentaire, ou 2 colonnes de groupes) pour rendre `lg:sticky` effectif à 1280x900. Sinon laisser et ne pas noter.

**D4 (finition). Pastille à deux lignes.** « Commerces, voisins, transports » passe sur 2 lignes dans une pastille `rounded-full` (forme ovale à bords inégaux). Correction : `rounded-xl` seulement quand le libellé fait deux lignes n'est pas faisable en CSS pur ; utiliser `max-w-full` avec `rounded-full` et `text-wrap:balance`, ou accepter. Piste.

## Faute dure
Aucune chiffrable : gate typographique PASS, un seul aplat violet par écran, aucun vide > 32 px au milieu d'un bloc relevé (les vides de D1 à D3 sont en fin de tuile ou de colonne), pas de débordement horizontal à 375 et 768.

NOTE GLOBALE : 8/10

Fautes dures :
(aucune)
