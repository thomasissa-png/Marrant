# Relecture à l'aveugle s25 v6 tour 4 : groupe « vannes »

Périmètre : `vannes/` (visiteur, gratuit, en-cours, nouvel x 375, 768, 1280, 1456, 1920) et `dediees/*vannes*` (fenêtre basse 375x480 et 1280x480 avec menu, « Plus » ouvert 1280x900, 4 comptes). Ouvertes : visiteur 375, 768, 1280, 1920 ; gratuit 1280 ; en-cours 375, 1280 ; nouvel 375, 1920 ; dédiées : visiteur (5), gratuit (menu 375, Plus), en-cours (375, Plus), nouvel (menu 1280, Plus). 1456 identique à 1280 (coque `max-w-7xl`, voulu).

## Design
1. Fidélité à l'accueil : 9. Cartes à filet violet en haut, pastilles de catégorie, titres de section centrés, hero centré, rythme aéré : conforme. Seul écart à l'étalon : le H1 n'a pas de mot accentué en violet (piste, non retenue : H1 validé).
2. Hiérarchie et lisibilité : 10. H1, sous-titre, filtres, grille, offre, FAQ : ordre net. Textes secondaires lisibles.
3. Cinq largeurs : 10. 375 une colonne, 768 et 1280+ deux colonnes alignées sur la coque ; aucun vide à droite, rien de collé à gauche, aucun débordement. Les filtres défilent avec chevron et fondu.
4. Cohérence avec l'espace : 10. Même bande, mêmes cartes, mêmes titres que les autres pages.
5. Finition : 9. Étoile et partage : bouton `h-11 w-11` (44 px) à pastille de 32 px, vérifié dans `favorite-button.tsx` et `share-button.tsx`. Pagination (en-cours, nouvel) : 44 px sous 768 px et en pointeur tactile, `md:min-w-8` en souris (32 px visibles, arbitrage s20 documenté dans `list-pagination.tsx`) : piste, pas faute.

## UX
1. Compréhension : 10. « Vannes » allumé dans la bande, H1 explicite, action « Révéler la chute » sur chaque carte.
2. Action principale unique : 10. Visiteur et gratuit : un seul bouton plein (« Ouvrir la suite des vannes · 1,99 €/mois ») après les 10 vannes gratuites, plus le bouton d'en-tête existant. Abonnés : aucun appel à l'offre.
3. États vides / nouvel abonné : 9. Le catalogue n'est jamais vide, la page nouvel est identique à en-cours (pas de page morte). Piste : en-cours et nouvel ouvrent la page 1 avec 11 vannes sur 12 en « Boulot & Collègues » alors que « Toutes » est active, ce qui donne une impression de filtre appliqué ; c'est un ordre de tri des données (`vannes-list.tsx`, requête de l'API), à confirmer par Thomas, non retenu en faute.
4. Aperçu Premium : 10. Page publique gratuite : 10 vraies vannes lisibles, une seule offre, aucun mur ni flou. Cadenas du groupe 1 de la bande et de « Plus » cohérents pour visiteur et gratuit, absents pour abonnés.
5. Accessibilité et cohérence : 9. Fenêtre basse : bande masquée, rubriques dans le menu (ordre, cadenas, Vannes allumé, fermeture visible), rangée non collante : conforme. « Plus » s'ouvre en liste de 2 lignes, cadenas pour visiteur et gratuit, aucun pour abonnés. Le popover recouvre le H1 : normal pour une surcouche.

## Pistes (ne retiennent pas la note)
- Variété de la page 1 « Toutes » pour les abonnés (voir UX 3), `apps/web/src/components/vannes/vannes-list.tsx`.
- Pagination souris à 32 px, `apps/web/src/components/ui/list-pagination.tsx` (arbitrage s20).
- Hors périmètre signalé : en fenêtre basse le menu ouvert masque le bouton d'offre à 375 (il est plus bas dans la liste défilable).

## Verdict
Aucune faute dure. NOTE GLOBALE : 9/10.
