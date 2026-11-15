# Relecture DESIGN à l'aveugle, v6 tour 2, groupe entete (en-tête, bande des rubriques, menu mobile, cloche, menu compte, fenêtre basse, /abonnement)

Captures lues (Read) : `v6-tour-2/entete/` (visiteur accueil 1280, mon-espace 1920 ; gratuit vannes 768, menu mon-espace 375, menu-court 320, compte 1280 ; en-cours vannes 1024 et 1280, profil 1456, accueil 640, cloche 290 et 375, compte 768, recherche-ouverte 1280, focus-dans-menu 375 ; nouvel mon-espace 768, cloche-vide 375 ; visiteur vannes 290, 375, 600, 1024, menu-vannes 290) et `dediees/` (visiteur 375x480 bande masquée et menu ; en-cours menu 1280x480 ; nouvel 1280x480 ; gratuit /abonnement 1280x900). Étalon : `etalon-accueil/visiteur-accueil-1280.png`. Décisions [CHOIX UTILISATEUR] respectées telles quelles (recherche 176 px à position variable, cadenas 14 px sur les rubriques Premium, bande d'un seul niveau toujours affichée, « … » = Mes questions + Mes répliques) : non rediscutées.

## Verdict
Aucune faute dure. En-tête et bande sont dans la langue de l'accueil (fond noir, violet de marque, rayon xl de la pastille, filets 1 px, chip actif en fond élevé + soulignement violet), identiques sur les 3 comptes aux largeurs 1280, 1456, 1920 (coque 1216 centrée, rien de collé à gauche, aucun vide parasite), et la bande défile proprement en dessous (fondu à droite, chip actif visible) de 290 à 1024.

## Notes par critère (grille Design)

1. Fidélité à la langue de l'accueil : **10/10**. Pastille arrondie, violet identique au bouton « Premium · 1,99 €/mois » de l'accueil, logo violet, menu compte et panneau cloche avec filet violet en haut comme les cartes de l'étalon (`en-cours-compte-768.png`, `en-cours-cloche-375.png`).

2. Hiérarchie et lisibilité : **9/10**. Une seule action pleine par en-tête (bouton d'offre pour visiteur et inscrit gratuit, cloche pour l'abonné), rubrique courante nette (`en-cours-vannes-1280.png`). Défaut : à 290 px, quand la bande est centrée sur Vannes, le début de bande montre un cadenas seul orphelin (chip « S'entraîner » coupé, `visiteur-vannes-290.png`, `visiteur-menu-vannes-290.png`) : lisible comme un glyphe sans libellé. Correction codable : dans `apps/web/src/components/layout/bande-rubriques.tsx`, masquer le cadenas du chip coupé en l'enveloppant dans le conteneur `overflow-hidden` du libellé, ou régler le centrage pour que le point de coupe tombe sur l'écart entre chips (scroll-padding-inline sur la nav). Piste, ne retient pas la note sous 9. Pour 10 : plus aucun glyphe orphelin à 290.

3. Mise en page aux 5 largeurs : **10/10**. 375, 768, 1280, 1456, 1920 sans débordement horizontal, `visiteur-mon-espace-1920.png` : coque de 1216 centrée, bande pleine coque avec « … » collé au bord droit de la pastille, 150 à 170 px d'air entre Carnet et « … » à 1280+, voulu (budget de largeur de la spec). 768 à 1023 : bande défilante coupée proprement par fondu (« Vid », « A », « Favo » estompés), conforme à la spec. 290 et 320 : logo, bouton d'offre, Menu tiennent sur une ligne.

4. Cohérence avec les autres pages de l'espace : **10/10**. Même hauteur de bloc (65 + 49), même chip actif entre vannes, mon-espace, profil (`en-cours-profil-1456.png` : icône du compte allumée avec soulignement), mêmes menus entre 768 et 1280, cloche vide avec phrase d'état (`nouvel-cloche-vide-375.png`, jamais un panneau mort), bande absente sur /abonnement avec rangée du haut gardée (`gratuit-abonnement-sans-bande-1280x900.png`).

5. Finition au pixel : **9/10**. Cibles 44 px visibles (boutons Menu, cloche, compte, chips de 44 px), focus visible violet sur la recherche et sur les chips (`en-cours-recherche-ouverte-1280.png`, `en-cours-focus-dans-menu-375-05.png`), contrastes des libellés gris sur fond de bande lisibles (> 4.5:1 à l'œil, cadenas de la couleur du texte). Défauts :
   - Panneau du menu mobile sans bord inférieur : le texte de la page passe sous un trait net sans filet ni ombre, « quelque chose, non ? » coupé à mi-hauteur juste sous la rangée « Déconnexion » (`gratuit-menu-mon-espace-375.png`, `gratuit-menu-court-320.png`). Correction : `apps/web/src/components/layout/header.tsx`, panneau mobile : ajouter `border-b border-border shadow-lg` (tokens du thème, `rounded-b-xl` si le coin est visible). Pour 10 : séparation franche entre le panneau et la page assombrie.
   - Menu de la fenêtre basse à 1280x480 : lignes de 44 px étirées sur 1264 px, la barre de la rubrique active court sur toute la largeur de l'écran (`en-cours-fenetre-basse-vannes-menu-1280x480.png`), et la dernière ligne est coupée à 470 px (« Articles » à demi visible, défilement attendu). Correction : `header.tsx`, liste du menu en `max-w-md` (ou `md:max-w-sm`) alignée sur la marge de la coque. Piste, cas rare (fenêtre de 480 px de haut).

## Faits conformes vérifiés (pas de défaut)
- Cadenas 14 px sur Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, S'entraîner et Favoris pour visiteur et inscrit gratuit, aucun pour l'abonné (`en-cours-vannes-1280.png` vs `gratuit-compte-1280.png`).
- Visiteur 520 à 767 : loupe + Connexion + offre en ligne, pas de bouton Menu (rien à y ranger), cohérent avec la spec ; l'échec des captures « menu » du fichier INDEX à ces largeurs vient de là et non d'un défaut d'affichage.
- Fenêtre de moins de 500 px de haut : bande masquée, rubriques dans le menu avec cadenas, page allumée par un trait violet à gauche (`visiteur-fenetre-basse-vannes-menu-375x480.png`) ; rangée du haut non collante.
- Texte « Fermer » du panneau cloche et libellés des menus : textes validés non touchés.

## Fautes dures
Aucune.

## Pistes (non bloquantes)
1. Cadenas orphelin à 290 px (`bande-rubriques.tsx`).
2. Filet/ombre sous le panneau du menu mobile (`header.tsx`).
3. Largeur max de la liste du menu en fenêtre basse large (`header.tsx`).

NOTE GLOBALE : 9/10
