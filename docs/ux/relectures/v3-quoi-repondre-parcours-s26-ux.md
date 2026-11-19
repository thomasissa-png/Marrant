# Relecture UX à l'aveugle v3 : Quoi répondre et Parcours (s26)

Base : brief v7 + SEQUENCES.md + toutes les captures `qr-*` et `pa-*` (375 et 1280), 4 comptes. Hors périmètre : /abonnement, /register, pied de page. Note : seulement ce qui se voit.

## Notes par page (/10)
| Page | Note | Raison du retrait |
|---|---|---|
| Quoi répondre, aperçu (visiteur, gratuit) | 8 | D1, D2, D3 |
| Quoi répondre, abonné | 9 | D4 (mineur) |
| Parcours, liste | 8,5 | D5, D6 |
| Parcours, détail (fiche étape) | 7,5 | D7, D8, D9, D10 |

## Notes par trajet (/10)
| Trajet | 375 | 1280 | Frictions clés |
|---|---|---|---|
| qr visiteur | 8 | 8 | D1, D2 |
| qr gratuit | 8 | 8,5 | D1, D2 |
| qr abonné en cours | 9 | 9 | D4 |
| qr nouvel abonné | 9 | 9 | D4 |
| pa visiteur | 8 | 8,5 | D6, D11 |
| pa gratuit | 8 | 8,5 | D6, D11 |
| pa abonné en cours | 7 | 8 | D7, D8, D9, D10 |
| pa nouvel abonné | 7 | 8 | D7, D8, D9, D10, D5 |

Ce qui est à 9+ et doit rester : retour du navigateur et « Retour : Quoi répondre » rendent la liste à la même position (qr-abonne-375-5 : carte Coloc 2/4 mise à jour ; pa-*-375-4/6 : carte du parcours à l'écran). Le non-abonné n'a aucune page morte : bouton « Tout ouvrir · 1,99 €/mois » toujours en haut (carte à 375 ET 1280, en-tête sur Parcours), retour au même endroit après /abonnement (qr-*-4). Le gratuit connecté ne voit plus « Connexion » (qr-gratuit-*-1). Un seul bouton plein par écran. Liste persistante à gauche à 1280 (Quoi répondre et Parcours) : contexte tenu.

## Défauts et corrections minimales (notes < 9)

**D1 Quoi répondre aperçu, clic sur une tuile fermée (qr-visiteur/gratuit-375-2, -1280-2). H1, H10.** Le clic ne fait que poser un anneau de focus sur « Tout ouvrir » (à 375 la page remonte sous l'en-tête, la carte colle en haut). Le non-abonné ne reçoit aucune phrase qui explique « fermé, Premium ». Correction : sous le bouton, une ligne vivante de 3 s (aria-live) « Cette réponse s'ouvre avec Premium », sans nouvelle taille ni couleur.

**D2 Quoi répondre aperçu, 1280 (qr-visiteur-1280-pleine). Cohérence visuelle.** Trois largeurs de carte (827, 888/920, 1248) : « Pour quoi faire ? » déborde sous la colonne de gauche et laisse un vide mort à droite (x 920-1248, y 790-900) ; le fondu des 3 tuiles du bas est coupé net. Correction : « Pour quoi faire ? » dans la même colonne que « Coloc : la poêle » (même largeur 827) et « Où et avec qui ? » en colonne droite sur toute la hauteur ; tuiles du bas sur la même grille 3 colonnes.

**D3 Quoi répondre aperçu, 375 (qr-visiteur-375-1).** Entre « Tout ouvrir » et la carte exemple il y a un seul écran : bien. Mais la bande d'onglets coupe « S'e… » et le titre répète « Quoi répondre » deux fois (onglet + carte exemple). Faible : piste, pas de faute.

**D4 Quoi répondre abonné (qr-abonne-1280-3/-5, qr-nouvel-375-3). H1, H6.** (a) « Fait » apparaît dès le choix « Essayé, ça a marché » sans confirmation ni compteur du « Coloc 2/4 » visible sur la fiche (à 1280 la liste le montre, pas à 375). (b) « Enregistrer » grisé trop discret (contraste faible) alors qu'il est l'action de la carte. (c) Le bouton du premier écran à 375 s'appelle « Voir », alors que Parcours dit « Reprendre » / « Commencer l'étape 1 » : verbes incohérents. Corrections : (a) pastille « Fait · 2/4 » dans la carte à 375 ; (c) « Faire cette situation » ou « Reprendre » selon l'état.

**D5 Parcours liste, nouvel abonné (pa-nouvel-375-1, -1280-1). H2.** « Ton cap », « cap 1 sur 5 », « Tu t'échauffes », « Ta série démarre à ta prochaine pratique » : quatre messages de progression sur une ligne pour un premier jour, vocabulaire de jeu non défini. Correction : garder une seule phrase (« Ta série démarre à ta prochaine pratique ») et retirer « cap n sur 5 » tant que rien n'est validé.

**D6 Parcours liste (pa-*-1280-1 et pa-abonne-1280-4). H4, H8.** Page très longue en texte (5 cartes × 2 paragraphes) avant d'atteindre « Les parcours » chez l'abonné (3 blocs au-dessus : cap, 4 semaines, titre). L'abonné en cours voit le bandeau « Nouveau cap : Tu te lances. / Fermer » sans contenu : bruit. Correction : bandeau seulement après un vrai changement de cap ; « Tes 4 premières semaines » replié par défaut dès qu'une étape est lancée (comme à 375 il est déjà un accordéon).

**D7 Parcours détail, clic sur une sous-étape (pa-abonne-375-5, pa-nouvel-375-5, -1280-4/5 ; ss-* exclus). H1, H4.** Le clic sur 2.3 saute 3 000 px plus bas, sur la vidéo ; le titre « Pour aller plus loin, facilitat… » est coupé sous l'en-tête fixe, aucun titre « 2.3 » visible. À 1280, 2.3 et 2.4 montrent la même zone avec les deux vidéos (scrollY identique) : l'utilisateur ne voit pas ce que 2.3 a de différent. Correction : `scroll-margin-top` ≥ hauteur de l'en-tête (≈ 120 px) sur les ancres `#fiche-*`, et le titre de la sous-étape en tête du bloc atteint.

**D8 Parcours détail, numérotation (pa-abonne-375-3/-5, pa-abonne-1280-2, pa-nouvel-1280-2). H4.** Sous-étapes 1.1, 1.3, 1.4, 1.5 (pas de 1.2), idem 2.1/2.3/2.4/2.5 et 3.1/3.3/3.4/3.5 : « il manque une étape ». Correction : renuméroter 1-4 ou masquer les numéros.

**D9 Parcours détail, retour (pa-abonne-1280-4, pa-*-375-6). H3, H7.** Le seul « Retour : Parcours » est en bas de fiche (le trajet impose de défiler jusqu'à lui, scrollY 646 à 1280, 1121 à 375). Le haut de la fiche n'a ni lien ni fil d'Ariane ; seul l'onglet « Parcours » ramène (et perd peut-être la position). Correction : lien « ‹ Parcours » en tête de la colonne gauche (1280) et au-dessus de la carte (375), comme Quoi répondre.

**D10 Parcours détail, état (pa-abonne-1280-2). H1.** « Étape 3 sur 3 » alors que 2 étapes sur 3 sont faites ; « Reprendre » apparaît deux fois (carte + bas du menu), le second en bouton contour sans objet clair à 2.3. Correction : « Étape en cours : 3 sur 3 » ou « 2 faites sur 3 » ; un seul « Reprendre » (le menu).

**D11 Parcours détail visiteur/gratuit (pa-visiteur-375-3, pa-visiteur-1280-3).** (a) Dans le quiz, la réponse C est cernée de violet sans clic apparent : lue comme présélectionnée, et c'est un second accent (la consigne n'en veut qu'un). (b) À 375 le visiteur ne voit pas les étapes 2-3 verrouillées (menu absent dans la capture 2) alors qu'à 1280 « Étape 1 gratuite, la suite avec Premium » l'explique ; (c) « Lecture libre » est obscur. Corrections : (a) retirer le style hover/focus persistant ; (b) le menu replié « Étape 1 sur 3 » aussi pour le visiteur à 375 ; (c) « Gratuite » à la place de « Lecture libre ».

## Frictions Nielsen restantes (par gravité)
1. H1/H4 D7 : ancres de sous-étape mal calées et peu distinctes (abonné, 375 surtout).
2. H3/H7 D9 : retour seulement en bas de fiche.
3. H10 D1 : clic sur tuile fermée sans explication.
4. H2 D5 : vocabulaire « cap/série » non défini au premier jour.
5. H4 D8 : numérotation à trous.
6. D2 : grille de l'aperçu à 1280.

Le fondateur voulait : contexte gardé (OK sauf D7/D9), pages pensées pour l'usage (OK QR abonné, moyen détail Parcours), nickel connecté et non connecté (aperçu QR à resserrer).
