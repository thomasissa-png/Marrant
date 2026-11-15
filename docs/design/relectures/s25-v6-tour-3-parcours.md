# Relecture DESIGN à l'aveugle, tour 3, groupe parcours (/parcours, /parcours/repartie), navigation v6

Captures lues : `docs/captures/s25/v6-tour-3/parcours/` (visiteur, gratuit, en-cours, nouvel ; 375/768/1280/1456/1920 ; lecture détaillée à 1280 et 375, 768/1456/1920 jugées sur la même mise en page par construction de coque, hauteurs identiques 1280/1456/1920 dans INDEX.md). Étalon : `etalon-accueil/visiteur-accueil-1280.png` (lu en 490 px de large). Décision prioritaire : `cta-forme-place-s21.md` §1.3 + B15.

Limite : les pleines pages sont réduites à la lecture (1 px affiché = 2 à 3,5 px réels). Les mesures fines (44 px, contrastes) sont estimées, jamais citées comme mesurées.

## Conformité à la décision s21 (§1.3, B15, exception b)
- Visiteur et gratuit, /parcours : un plein par carte (« Tester l'étape 1 de {parcours}, gratuite »), jamais deux par carte, aucun Premium dans les cartes, ligne frontière en dessous (« Sans compte. La suite : Premium. » visiteur ; « La suite : Premium. » gratuit, correctement adaptée à un compte existant). CONFORME.
- /parcours/repartie visiteur : un seul plein dans la page (« Passer à l'étape 2 · 1,99 €/mois », fin d'étape 1), prix + garantie 14 jours dessous, « D'abord ton compte, puis le paiement » ; gratuit : même plein sans la ligne compte (cohérent). Pas de plein par étape verrouillée (étapes 2 à 4 repliées avec cadenas). CONFORME.
- En-cours / nouvel : « Reprendre » / « Commencer l'étape 1 » (carte du haut) = plein ; carte du parcours recommandé = plein ; les autres cartes en contour. Cohérent avec B15 (un plein par carte, l'alternative en contour). En-tête : bouton d'offre absent pour l'abonné, présent pour visiteur/gratuit.

## Notes /10
| Critère | Note | Preuve |
|---|---|---|
| 1 Fidélité à l'accueil | 8 | Cartes `rounded-xl` à filet violet en haut, pastilles de niveau, rythme aéré : présents sur toutes les cartes. Écart : H1 « Parcours humour : deviens drôle pas à pas » (visiteur-parcours-1280) aligné à gauche, sans sous-titre centré ni hero, alors que l'étalon centre H1 et titres de section ; « Explore aussi » et « Questions fréquentes » aussi à gauche. |
| 2 Hiérarchie et lisibilité | 9 | Visiteur : en plissant les yeux, on voit H1, quiz, puis cartes avec bouton plein violet pleine largeur, très dominant. Détail : texte `xs` gris de la ligne frontière et « Format : … Environ 20 min » petits mais lisibles. |
| 3 Mise en page 5 largeurs | 8 | Aucun débordement ni colonne collée. Mais le contenu est une colonne unique de ~766 px (visiteur-parcours-1280 : x≈257 à 1023) sous une bande de 1216 px : aux 1280/1456/1920, 40 % de largeur utile à 1920, bords gauche/droit du contenu sans lien avec ceux de la bande. L'accueil et l'étalon exploitent des grilles 3 colonnes pleine coque. Les 5 cartes en pile = 4678 px de haut à 1280 (gratuit/visiteur). |
| 4 Cohérence avec l'espace | 9 | Titre, cartes, boutons et FAQ identiques entre les 4 comptes ; carte « Tes 4 premières semaines » et « Ton cap » même langage que les cartes parcours. Fil d'Ariane et en-tête de /parcours/repartie homogènes. |
| 5 Finition au pixel | 8 | Alignements propres, boutons ≈ 48 px, accordéons « PROGRAMME » ≈ 44 px (estimés). Défaut : cartes vidéo de l'étape 1 (visiteur/gratuit/nouvel/en-cours-parcours-repartie-1280) = deux vignettes strictement identiques (dégradé violet + bouton lecture rouge) pour deux vidéos différentes (Marina Rollman, Lilia Benchabane), alors que l'accueil affiche une vraie vignette. Rend « placeholder » (règle anti-placeholder). À confirmer : si les vignettes sont absentes de la capture seulement (réseau) ou de la prod. |

**Globale (minimum) : 8/10. Aucune faute dure établie** ; la barre de 9 n'est pas atteinte à cause des pistes 1 à 3 ci-dessous.

## Pistes pour atteindre 9-10 (codables)
1. **Vignettes vidéo** (finition, retient la note si confirmé en prod) : vérifier que le composant vignette de l'étape (apps/web, composant des cartes vidéo du parcours) affiche `thumbnailUrl` réel ; si l'URL manque, ne pas afficher de dégradé + lecture identique : vide propre (carte texte seule) ou vignette réelle. Aujourd'hui deux vidéos différentes = même image.
2. **Largeur de /parcours** (critère 3) : passer la liste de 5 cartes en `max-w-7xl` avec grille `lg:grid-cols-2` (ou la carte recommandée en pleine largeur puis 2 colonnes), ou à défaut aligner le titre/colonne sur la coque ; cela ramène la page à ≈ 3000 px à 1280 et à l'étalon. Si le gabarit étroit est une décision écrite (gabarit C v5), la piste ne retient pas la note.
3. **Titre** (critère 1) : H1 et titres de section de /parcours centrés avec sous-titre centré, comme l'accueil (classes `text-center` sur l'en-tête et `max-w-2xl mx-auto` sur l'intro). À valider avec la règle de gabarit de l'espace.
4. En-cours /parcours : la carte du haut (« Reprendre » Machine à Café) et la carte Machine à Café (« Continuer ce parcours » plein) mènent au même endroit avec deux pleins visibles à l'écran à 1280 ; la décision s21 l'autorise (exception b), piste uniquement : passer la carte Machine à Café en contour si la carte du haut est visible.
5. Quiz « Quel parcours est fait pour toi ? » en tête pour visiteur/gratuit (avant les cartes) et en bas pour abonné : logique, mais la carte de quiz à 1280 est une grande boîte vide à droite (questions en 3 colonnes étroites) ; piste, non retenue.
6. Lien « Tu y prends goût ? Jette un œil au parcours suivant » (bas de /parcours/repartie) : fond plus sombre et texte gris : contraste à vérifier au calcul, non mesurable sur capture réduite.

## Ce qui est réussi
- Un seul plein dominant par écran sur /parcours/repartie ; plein et prix/garantie groupés ; états abonné/nouvel (étape 1 « Commencer », barres de progression, « Terminer le quiz pour valider cette étape ») jamais morts.
- Aucune largeur ne casse (pas de défilement horizontal vu à 375 hors bande des rubriques, hors périmètre).

## Fautes dures
Aucune.
