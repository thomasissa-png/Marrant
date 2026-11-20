# Relecture UX à l'aveugle v5 : Quoi répondre et Parcours (s26)

Base : brief v7 + SEQUENCES.md + toutes les captures `qr-*` et `pa-*` (375 et 1280, 4 comptes, pleines pages incluses). `ss-*` ignorées. Notes sur ce qui se voit.

## Notes par page (minimum des deux largeurs)
| Page | Note |
|---|---|
| Quoi répondre aperçu (visiteur, gratuit) | 9 |
| Quoi répondre abonné (hub 375, liste + fiche 1280) | 9 |
| Parcours liste | 8 |
| Parcours détail | 8 |

## Notes par trajet (375 / 1280)
| Trajet | 375 | 1280 |
|---|---|---|
| qr-visiteur | 9 | 9 |
| qr-gratuit | 9 | 9 |
| qr-abonne-en-cours | 9 | 9 |
| qr-nouvel-abonne | 9 | 9 |
| pa-visiteur | 9 | 8 |
| pa-gratuit | 9 | 8 |
| pa-abonne-en-cours | 8 | 8 |
| pa-nouvel-abonne | 8 | 9 |

## Ce qui est au niveau (à ne pas toucher)
- Quoi répondre : la liste (menu) reste visible à 1280 pendant toute la lecture, la fiche active est marquée, « Fait » apparaît dans la liste dès « Essayé, ça a marché », « Situation suivante » passe d'outline à violet une fois la pose faite (qr-*-1280-3, -pleine). À 375, « Retour : Quoi répondre » revient à la liste à la bonne position (qr-*-375-5, scrollY 391 / 363).
- Un nouvel abonné n'a jamais de page morte : 1280 ouvre directement « La poêle » (qr-nouvel-abonne-1280-1), 375 propose « Voir » sur la situation recommandée.
- Visiteur et gratuit : aperçu lisible fermé, offre en haut, retour du navigateur ramène à la même position (qr-visiteur-375-4, 1280-4). Un seul violet par écran.
- Parcours : bascule de menu à 375 (pastille « Étape n sur m ») fonctionnelle, retour sur l'ancre de la carte du parcours (pa-*-375-4/6). Non-abonné : étapes 2 et 3 verrouillées avec cadenas, « Lecture libre » sur l'étape 1, sortie « Passer à l'étape 2 » en fin d'étape (pa-visiteur-1280-3).

## Défauts (notes < 9) et correction minimale
1. **[H1 visibilité de l'état] Pastille de menu à 375 contredit la page.** pa-abonne-en-cours-375-5 : on lit la fiche 2.2 (étape 2), la pastille collante dit « Étape 3 sur 3 ». pa-nouvel-abonne-375-5 : fiche 2.2, pastille « Étape 1 sur 4 ». Le first-time user croit s'être trompé. Correction : la pastille affiche le numéro de l'étape LUE (même format, nombre seul qui change) ; l'étape en cours reste dans le panneau. Fichier du menu replié des étapes. Impact : pa-abonne 375, pa-nouvel 375, détail.
2. **[H3 contrôle, H7 efficacité] Retour sur la carte du parcours en cours sans action.** pa-abonne-en-cours-1280-5 et 375-6 : on revient sur la carte « Machine à Café » (2/3 étapes), la cellule à droite de « Programme » est vide alors que Répartie affiche « Continuer ce parcours » dans la même position. Arrivé par « Retour », « Reprendre » est hors écran : cul-de-sac et trou de mise en page. Correction : afficher dans la carte du parcours en cours le bouton existant « Reprendre » (outline, comme « Continuer ce parcours »). Aucun texte nouveau. Impact : pa-abonne 1280 et 375, Parcours liste.
3. **[H3 retour] À 1280, aucun « Retour : Parcours » visible en haut du détail.** À 375 il est collant en haut (pa-visiteur-375-2/3) ; à 1280 il n'existe qu'en bas de l'étape (pa-abonne-en-cours-1280-4, y 667). Les trajets visiteur et gratuit 1280 sortent par le navigateur. Incohérence 375/1280. Correction : reprendre le lien existant « Retour : Parcours » en tête de la colonne menu 1280. Impact : pa-visiteur/gratuit 1280, détail.
4. **[H1, H6] Clic sur une sous-étape 1.2 ou 2.2 : atterrissage sur un bloc partagé.** pa-abonne-en-cours-1280-4 et pa-nouvel-abonne-1280-4 : le bloc « Pour aller plus loin » montre deux vidéos côte à côte (1.2 et 1.3), seule la ligne du menu dit laquelle est visée. À 375 (pa-*-375-5), la carte vidéo arrive sans numéro de sous-étape visible. Correction (piste) : style `:target` (anneau fin) sur la carte visée, sans changer de taille de police. Pas de faute dure.
5. **Trajet d'offre : page /abonnement sans la bande des rubriques ni lien de retour visible** (qr-*-375-3, qr-*-1280-3, pa). Hors périmètre de la page, mais on perd le menu au clic ; `returnTo` est dans l'URL, sans lien visible. Seul le retour du navigateur ramène (et marche bien). Signalé, non noté.

## Frictions Nielsen restantes (synthèse)
- H1 : pastille d'étape (défaut 1). H3 : retour absent en haut à 1280 (3), carte sans action au retour (2). H4 : « Fait » et les caps cohérents partout ; sous-étape sans repère visuel (4). H7 : « Reprendre » hors écran après un retour (2).
- Aucune faute dure : pas de second violet, pas de page morte, contexte (menu, liste, position) conservé dans 14 trajets sur 16 sans réserve.

## Hors note : propositions demandant un texte nouveau (à décider par le fondateur)
- Le libellé « Voir » du hub Quoi répondre 375 (qr-abonne-en-cours-375-1, qr-nouvel-abonne-375-1) dit peu l'action (ex. « Commencer » côté nouvel abonné) : texte à valider.
- À la fin de l'étape 1 gratuite, « Passer à l'étape 2 » est en outline : cohérent avec un seul violet (« Tout ouvrir » collant), non retenu comme défaut.

NOTE GLOBALE : 8/10 (minimum des pages ; trajets Quoi répondre à 9)
