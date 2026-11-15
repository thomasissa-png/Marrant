# Relecture DESIGN à l'aveugle, tour 3, groupe /vannes (navigation v6)

Captures lues : `docs/captures/s25/v6-tour-3/vannes/` (visiteur, gratuit, en-cours en 375, 768, 1280, 1456 et 1920 pour les largeurs clés : 1280 pour les trois comptes, 375 et 768 pour visiteur, en-cours et gratuit, 1920 visiteur ; 1456 identique à 1280 selon l'index, non rouvert). Étalon : `etalon-accueil/visiteur-accueil-1280.png`. FAQ de /vannes : texte validé, non discuté.

## Notes

| Critère | Note |
|---|---|
| 1 Fidélité à l'accueil | 9 |
| 2 Hiérarchie et lisibilité | 9 |
| 3 Mise en page aux 5 largeurs | 8 |
| 4 Cohérence avec l'espace | 9 |
| 5 Finition au pixel | 9 |
| **Globale (minimum)** | **8** |

## Ce qui est juste (à ne pas toucher)
- Langue de l'accueil bien reprise : H1 centré, cartes `rounded-xl` à filet violet en haut, pastille de rubrique lilas, bloc d'offre encadré en fin de liste, FAQ en accordéons, bloc « La suite » en 3 cartes à filet.
- Grille 2 colonnes régulière à 1280/1456/1920 (coque `max-w-7xl` centrée, marges égales des deux côtés, aucun vide à droite, aucun débordement). Rangées de cartes de hauteur égale.
- Un seul bouton plein dans la page (hors en-tête) pour visiteur et gratuit, absent pour l'abonné : conforme.
- Bande des rubriques : Vannes allumée (soulignement + teinte), cadenas visibles pour visiteur et gratuit, absents pour l'abonné.
- Mobile : cartes en 1 colonne, bloc d'offre lisible, pied de page propre.

## Faute dure

**F1. Rangée de filtres collée au bord gauche de l'écran à 375 et 768** (`visiteur-vannes-375.png`, `visiteur-vannes-768.png`, idem gratuit et en-cours). La pastille « Toutes » démarre à x = 0 alors que les cartes, le titre et la FAQ ont leur marge (environ 26 px à 768, 16 px à 375). À 1280+ la rangée est alignée sur les cartes, donc le défaut vient du défilement pleine largeur sans retrait initial. Critère 3 de la grille : « aucune colonne collée à gauche ».
- Correction codable : sur le conteneur de défilement des filtres, garder le débord (`-mx-4 md:-mx-6` ou équivalent à la marge de page) et ajouter le retrait de départ `px-4 md:px-6` (ou `scroll-pl-4`) avec la même valeur que la marge de la coque ; le dernier chip garde le même retrait à droite (`pr-4`). Fichier probable : le composant de filtres de `/vannes` (liste des catégories) dans `apps/web/src`. Vérifier en pixel : bord gauche de « Toutes » = bord gauche des cartes.
- Ce qui ferait 10 : « Toutes » aligné sur la colonne des cartes à 375 et 768, début et fin de défilement.

## Pistes (ne retiennent pas la note)
1. Pagination abonné à 375 (`en-cours-vannes-375.png`) : les numéros passent à la ligne (1 à 4 puis 5 à 8), ce qui casse la lecture d'une seule rangée. Rendre la pagination défilante ou réduite (« Précédent, 3 / 8, Suivant ») sous 640 px. Cibles des numéros à vérifier à 44 px (elles semblent plus proches de 32 px à 1280).
2. Hiérarchie des H2 sous la liste : « Questions fréquentes » est plus grand que « Pourquoi ces vannes sont différentes » et « La suite, si tu as pris goût » (environ 28 px contre 22 px). À aligner sur une même échelle de titres de section (étalon : titres de section d'accueil, tous de même taille).
3. Cartes à texte court (ex. « Pour ta valise de départ… », visiteur 1280) : vide vertical entre le texte et « Révéler la chute » parce que la rangée prend la hauteur de la voisine. Acceptable, à garder.
4. Contrastes à mesurer à l'outil (non mesurables à l'œil) : texte d'aide gris des cartes (« Clique pour la chute ») et pastille de rubrique 11 px lilas sur fond violet translucide. Doivent rester >= 4,5:1.
5. Abonné (`en-cours-vannes-1280.png`) : la page 1 de « Toutes » est presque entièrement « Boulot & Collègues » ; effet de tri du contenu, pas de mise en page. À signaler au produit, pas de correction de design.

## Verdict
8/10 : mise en page propre et fidèle à l'étalon, bloquée sous la barre de 9 par F1 (alignement gauche de la rangée de filtres en mobile et tablette).
