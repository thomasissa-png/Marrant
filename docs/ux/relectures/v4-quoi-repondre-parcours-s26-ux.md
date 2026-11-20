# Relecture UX à l'aveugle v4 : Quoi répondre + Parcours (s26)

Base : brief v7 + SEQUENCES.md + toutes les captures qr-* et pa-* (375 et 1280, 4 comptes, pleines pages, 1920 visiteur et gratuit). Aucune spec ni relecture lue. Notes sur 10, hors périmètre exclu (/abonnement, /register, pied de page, caps et série, textes nouveaux).

## Notes par page
| Page | Note | Pourquoi |
|---|---|---|
| Quoi répondre, aperçu (visiteur, gratuit) | 8 | Offre en haut, tuiles lues FERMÉES (cadenas, barres grises), page connue. Perd : clic tuile quasi muet, bouton du bas incohérent à 1920, 375 plus dense chez le gratuit. |
| Quoi répondre, abonné | 8,5 | Ordinateur : liste fixe à gauche, situation en cours surlignée, « Fait » visible, suite violette seulement après le retour. Mobile : retour à la liste sans repère. |
| Parcours, liste | 7,5 | Visiteur et gratuit : clair, offre trouvable (bouton d'en-tête). Abonné : 3 blocs empilés avant les parcours. |
| Parcours, détail | 7,5 | Ordinateur : menu fixe, état de l'étape, retour bas de page, très bon. Mobile : arrivées en milieu de page, sans titre ni retour visibles. |

## Notes par trajet
| Trajet | Note | Défaut principal |
|---|---|---|
| qr-visiteur-375 | 8,5 | D1 |
| qr-visiteur-1280 | 8,5 | D1 |
| qr-gratuit-375 | 8,5 | D1, D3 |
| qr-gratuit-1280 | 8,5 | D1 |
| qr-abonne-en-cours-375 | 8,5 | D4 |
| qr-abonne-en-cours-1280 | 9 | aucun bloquant |
| qr-nouvel-abonne-375 | 8,5 | D4 |
| qr-nouvel-abonne-1280 | 9 | aucun bloquant |
| pa-visiteur-375 | 8 | D8 |
| pa-visiteur-1280 | 9 | aucun bloquant |
| pa-gratuit-375 | 8 | D8 |
| pa-gratuit-1280 | 9 | aucun bloquant |
| pa-abonne-en-cours-375 | 7 | D5, D6 |
| pa-abonne-en-cours-1280 | 8,5 | D6, D7 |
| pa-nouvel-abonne-375 | 7 | D5, D6 |
| pa-nouvel-abonne-1280 | 8,5 | D6, D7 |

## Défauts et correction minimale (note < 9)
- **D1 (Nielsen 1, visibilité de l'état) : qr-visiteur/gratuit, étape 1→2.** Le clic sur une tuile fermée ne fait qu'ajouter un anneau de focus sur « Tout ouvrir » (1280 : rien ne bouge ; 375 : défilement vers le bouton). L'utilisateur ne comprend pas ce qui s'est passé. Correction : un clic sur une tuile fermée met le bouton d'offre en `scrollIntoView` (centre) et le fait pulser une fois, sans texte nouveau.
- **D2 (Nielsen 4, cohérence) : qr-*-1920-pleine.** Le bouton de « La suite est dans Premium » est un contour (fantôme) à 1920 et plein à 1280. Deux apparences pour la même offre. Correction : forcer la variante pleine à tous les breakpoints (probable état survol ou classe `xl:`), ou la variante fantôme partout.
- **D3 (Nielsen 8, minimalisme) : qr-gratuit-375-1.** Deux paragraphes (« Premium ouvre tout… » puis « premier paiement… ») sous le bouton : la boîte d'offre fait 190 px et repousse la tuile d'exemple. Correction : serrer l'espace entre les deux (`space-y-1`, `text-sm`), sans texte nouveau.
- **D4 (Nielsen 1 et 6) : qr-abonne/nouvel 375, étape 4→5.** « Retour : Quoi répondre » ramène à scrollY 363-391 : on voit la liste, mais la situation qu'on vient de quitter n'est pas marquée et la carte « Voir » est hors écran. Le contexte (position) est perdu par rapport à 1280. Correction : à l'arrivée, faire défiler jusqu'à la ligne de la situation quittée (`scrollIntoView({block:'center'})`) et lui donner le style « en cours » de la liste 1280.
- **D5 (Nielsen 1) : pa-*-375, « Reprendre » et « Commencer l'étape 1 ».** Arrivée à scrollY 755 / 904 : on tombe sur la sous-liste de l'étape, sans « Retour : Parcours », sans le menu « Étape x sur y » (ils sont au-dessus). Pour revenir, il faut remonter de 800 à 900 px. Correction : bandeau collant fin sur mobile (flèche retour + « Étape 3 sur 3 » qui ouvre le menu), sous la bande des rubriques.
- **D6 (Nielsen 3 et 6) : pa-*, étape 4→5, sous-étape 2.2.** L'ancre #fiche-2-3 mène aux deux vidéos (« Pour aller plus loin, facultatif ») : à 375, aucun titre de sous-étape ni ligne de liste visible (capture 5/6 : on voit « Jason Brokerss », pas « 2.2 »). À 1280, 2.2 et 2.3 (puis 2.4 chez le nouvel abonné) retombent au même scrollY (1591 / 1792) : cliquer 2.3 ne change rien de visible, sauf la surbrillance du menu. Correction : décaler l'ancre pour inclure le titre du bloc (`scroll-mt` + ancre sur le titre) ; les sous-étapes qui partagent le même bloc doivent le dire (surbrillance de la vidéo ciblée, bord violet).
- **D7 (Nielsen 6, reconnaissance) : pa-abonne-en-cours-1280-1 et liste.** L'abonné avancé (étape 3 sur 3, 125 XP) voit « Nouveau cap : Tu te lances » puis « Tes 4 premières semaines » (semaine 1 : « le faux secret »), avant la liste : 850 px d'amorçage pour quelqu'un qui a fini 2 étapes. « 2/3 étapes » dans la carte et « Étape 3 sur 3 » en haut se contredisent à première lecture. Correction : replier « Tes 4 premières semaines » dès que le parcours a 1 étape faite (`defaultOpen` faux, ou masquer) ; la bannière « cap » se ferme déjà. Chez le nouvel abonné, la liste ne marque pas Répartie comme le parcours conseillé en haut : ajouter un liseré violet fin sur cette carte (sans texte).
- **D8 (Nielsen 6 et 10) : pa-visiteur/gratuit-375, étape 2→3.** L'étape 1 gratuite fait environ 4 000 px de défilement ; aucune trace des étapes 2 et 3 verrouillées ni de l'offre avant le bas (à 1280 la liste de gauche les montre avec cadenas). Seul « Tout ouvrir » en en-tête reste visible. Correction : menu replié « Étape 1 sur 3 » aussi pour le visiteur à 375, avec cadenas sur 2 et 3 (même composant que l'abonné).

## Ce qui est bon (à conserver)
- Contexte conservé à 1280 : liste Quoi répondre et menu de parcours fixes, surbrillance de l'élément courant, retour du navigateur au bon endroit (pa-*-1280-4/5, qr-*-1280-5).
- Visiteur : jamais de page morte, offre en haut de l'aperçu (1,99 €/mois, remboursement 14 jours), « Connexion » dans la boîte, retour du navigateur à la position d'avant (scrollY 120 ou 0 conservé).
- Retour « Parcours » : arrive sur la carte du parcours (#parcours-…) à 375 et 1280, bon repère.
- Chaîne « Essayé, ça a marché » puis « Situation suivante » devenue violette : l'action suivante est évidente.

## Propositions qui demandent un texte nouveau (non notées)
- Mention courte sur le clic d'une tuile fermée (« Ouverte avec Premium »).
- Badge « Conseillé » sur la carte Répartie du nouvel abonné.
- Titre « 2.2 Le mariage » rappelé au-dessus des vidéos.

## Frictions restantes (Nielsen)
H1 visibilité (D1, D4, D5, D6), H3 contrôle et retour (D5, D6), H4 cohérence mobile/ordinateur (D2, D4, D8), H6 reconnaissance (D6, D7, D8), H8 minimalisme (D3, D7).

NOTE GLOBALE : 7,5/10 (minimum : Parcours abonné et détail à 375)
