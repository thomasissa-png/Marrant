# Relecture à l'aveugle des captures : navigation universelle s24, tour 3 ciblé (@reviewer)

Base : 15 captures lues image par image dans `docs/captures/s24-nav-universelle-3/` (dont 2 paires fermées et 2 à 1024).
**Note : 9/10. 0 faute dure, 6 pistes.** Barre de passage atteinte.

## Fautes dures du tour 2
- **FD-A corrigée.** `abonne-en-cours-menu-mobile-mon-espace-375.png` : tout le menu tient à 812 px, sans barre collée ; Parcours,
  Vannes, Conseils, Vidéos, Articles sur 2 colonnes (ordre de lecture gardé), puis Mon profil et Déconnexion dans le flux (bas à 780).
- **FD-B corrigée.** `nouvel-abonne-mon-espace-repliques-1280.png` : titre et état vide dans la colonne, pied à y 423, bas de page à 900.
- **FD-B2 corrigée.** `abonne-en-cours-mon-espace-bibliotheque-1280.png` : « Quand on te lance une pique »… sans préfixe ;
  `…-quoi-repondre-375.png` : « La poêle », « Le retard (premier verre) », plus de « 5 min » par ligne.

## Preuves demandées au tour 2
- Pages entières fermées : 42 captures `*-page-entiere-*` (vannes et carnet pour 3 états, favoris pour l'abonné, 3 largeurs).
  `avant-` et `apres-premium-page-entiere-favoris-1280.png` sont identiques à l'œil ; carnet 768 rendu en page entière.
- `/lettre` vue par l'abonné : `abonne-en-cours-lettre-1280.png`, aucun lien allumé (critère 8 confirmé).
- 1024 : `abonne-en-cours-mon-espace-1024.png` (Mon espace + 5 liens, loupe, cloche, compte), `visiteur-vannes-1024.png`
  (loupe, Connexion, « Premium » court) : conforme au §1.

## Typographie (5 pages de l'espace)
Aujourd'hui 1024, Quoi répondre 375, Bibliothèque 1280, jeu 375, bilan 768 : `’` partout, « » avec espace fine, aucun
tiret cadratin, accents et majuscules justes.

## Pistes
- P1 `/lettre` vue par l'abonné est une page vide (en-tête puis pied). C'est le site actuel, et la nouvelle nav n'y mène plus,
  donc ce n'est pas bloquant. Thomas peut trancher : une phrase et un lien « Tes lettres sont dans Mon espace ».
- P2 La paire fermée de `/favoris` est prise avec 0 favori (état vide) : la grille « 3 colonnes, ouvert seulement » n'est pas
  exercée en fermé. Refaire la paire avec 3 favoris.
- P3 Aujourd'hui 1024 : « Vidéo du jour » prend toute la largeur avec une vignette de 440 px, et la moitié droite de la carte est vide.
- P4 Filet `border-t` orphelin en haut des cartes « À toi » (jeu 375, bilan 768), persistant.
- P5 « Le carnet du mois » reste en tête de Quoi répondre (doublon de l'entrée Carnet).
- P6 « Jonathan Cohen - Serge » (trait d'union) contre « – » à l'accueil.
