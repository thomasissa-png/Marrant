# Relecture UX à l'aveugle, tour 3, groupe vannes (/vannes), navigation v6

Captures lues : `docs/captures/s25/v6-tour-3/vannes/` (visiteur, gratuit, en-cours, nouvel x 375, 768, 1280, 1456, 1920, plus INDEX). Lecture visuelle : pleines pages réduites (375 très réduit, détails fins non mesurables). Hors note : réponse FAQ filtres validée.

## Constats généraux
- La page parle la langue de l'accueil : titre H1 centré, sous-titre centré, cartes `rounded-xl` à filet violet en haut, pastilles de catégorie, bloc d'offre encadré, FAQ centrée étroite, « La suite » en 3 cartes, rythme aéré. Cohérent avec l'étalon.
- La bande des rubriques est correcte pour la page : « Vannes » allumée (soulignement violet), cadenas sur le groupe 1 pour visiteur et gratuit, aucun cadenas pour l'abonné, mêmes rubriques pour tous.
- Coque identique à 1280, 1456, 1920 (voulu par la spec) : pas de vide à droite, pas de colonne collée à gauche, aucun débordement horizontal visible. À 768 et 375 : grille 2 colonnes à 768, 1 colonne à 375, bande qui défile avec fondu.
- Visiteur et gratuit : 10 vannes gratuites, puis un seul bloc d'offre « Ouvrir la suite des vannes · 1,99 €/mois » (prix lu dans la config, garantie 14 jours en dessous), lien secondaire « Tester l'étape 1 de Répartie, gratuite ». Valeur visible, pas de mur, pas de fenêtre surgissante.
- Abonné (en-cours, nouvel) : plus de bloc d'offre, pagination 1 à 8, sous-titre adapté, cloche et compte. Aucune page morte : le catalogue est identique pour en-cours et nouvel (page publique, pas d'état vide attendu).

## Notes

| Critère | Note | Justification |
|---|---|---|
| D1 Fidélité accueil | 10 | Mêmes cartes, filets, pastilles, titres centrés. |
| D2 Hiérarchie, lisibilité | 9 | H1 > filtres > cartes > offre clairs. Textes d'aide (« Clique pour la chute ») en gris moyen petit : contraste non mesurable sur capture, à vérifier au code (piste). |
| D3 Mise en page 5 largeurs | 10 | Rien ne déborde, grille tenue à toutes les largeurs, coque cohérente. Les pastilles de filtre sont tronquées (« Absu ») avec chevron : signal de défilement voulu, pas un défaut. |
| D4 Cohérence espace | 10 | Mêmes cartes, titres et rythme que l'accueil et la bande. |
| D5 Finition | 9 | Voir pistes P1 et P2. |
| U1 Compréhension | 10 | H1 et sous-titre disent quoi faire (choisir une situation, révéler la chute). |
| U2 Action principale unique | 10 | Révéler la chute (cartes) ; une offre unique par page pour le non-abonné (le bouton d'en-tête est le même, même prix). |
| U3 États vides, nouvel | 10 | Page publique, nouvel = en-cours, aucun vide. |
| U4 Aperçu Premium | 10 | Bloc d'offre sous les 10 vannes gratuites, valeur visible, une offre, garantie visible, pas de mur. |
| U5 Accessibilité, cohérence comptes | 9 | Voir P3 et P4. |

**NOTE GLOBALE : 9/10** (minimum des critères), aucune faute dure.

## Pistes (ne bloquent pas)
- **P1 (D5)** : étoile et partage des cartes (cercles d'environ 28 px à 1280, visibles sur `en-cours-vannes-1280.png`) : si la zone cliquable réelle est de 28 px, elle est sous les 44 px de la grille. Vérifier au code (composant carte de vanne, classes `h-7 w-7`) ; correction : `min-h-11 min-w-11` avec le cercle visuel conservé en pseudo-élément ou padding. Ce qui ferait 10 : zone 44 px prouvée.
- **P2 (D5)** : cartes d'une même ligne à hauteur égale : « École & Études » (`visiteur-vannes-1280.png`) laisse un vide entre le texte et « Révéler la chute » ; acceptable, aucune correction obligatoire.
- **P3 (U5)** : sur la page 1 de l'abonné (`en-cours-vannes-1280.png`, `nouvel-vannes-1280.png`), « Toutes » affiche 11 vannes sur 12 de « Boulot & Collègues », alors que le visiteur voit un mélange de catégories. Un abonné peut croire que le filtre « Toutes » est resté sur une catégorie, et les comptes ne se ressemblent pas. À vérifier : ordre de tri de la liste paginée (page de la liste /vannes côté abonné) ; correction : alterner les catégories ou trier par date mélangée, comme l'échantillon visiteur. Si l'ordre est voulu, le dire dans une phrase d'aide à valider par Thomas.
- **P4 (U5)** : lien « Tester l'étape 1 de Répartie, gratuite » sous le bouton d'offre : second appel, mais en lien discret et conforme à l'accueil (« Apprends à répondre à une pique, gratuit ») ; aucune correction.

## Edge cases vérifiés sur capture
Visiteur 375 : bande centrée sur Vannes, offre pleine largeur, FAQ lisible. Abonné 375 : pagination sur deux lignes lisible, bouton Menu et cloche présents. Aucune capture d'état d'erreur ou de connexion lente dans ce groupe : non évalué.
