# Tour 19, relecteur @ux (à l'aveugle) : `architecture-contenu-v19.md`

> Relu : en-tête, résumé, 0 bis, 1.1 (ligne Connexion), 2.2, 3.12 et 3.13, 4.1, 4.2, 4.4, 5.3 à 5.5, 6.1 à 6.3, 7.4 (ordre 8), 7.5 (e, i, j), section 8 (C1 à C9), comparé à ma note `tour-18-ux.md` et à `tunnel-inscription-s15.md`.
> Non relus (hors parcours de l'abonné, ou trop longs) : 0.2 en détail, 2.3 à 2.9, 3.1 à 3.11 (lus en partie), 7.1 à 7.3, 7.6, 7.7, sections 8 (C10 à fin), 9, annexes : [NON VÉRIFIÉ]. Le rendu visuel est renvoyé à l'étalon E5 et n'est pas noté. Les [CHOIX UTILISATEUR] ne sont pas rediscutés.

## 1. Mes points du tour 18

| # | Sujet | Statut | Preuve dans la v19 |
|---|---|---|---|
| T1 | Un seul emplacement de la carte « Ton cap » | **LEVÉ** | Même phrase en 4.4 (l. 707), 5.4, 6.2, 6.3, C4 : après le bloc de l'étape à reprendre, avant la liste des 5 parcours ; « et après les étapes faites » supprimé ; intitulé de niveau 2, 24 px d'écart, texte sans le mot « étape » ; « Tes bonus » juste après, seulement si un bonus est ouvert |
| T2 | Sortie de la page neutre | **LEVÉ** | 3.13, 5.5, 7.5 j : deux liens (« Retour à la Bibliothèque », « Aujourd'hui »), statut introuvable, `noindex`, réponse identique à une adresse inexistante, testé |
| T3 | Barre qui défile | **LEVÉ** | 6.2 : `aria-current="page"`, région « Mon espace », `prefers-reduced-motion`, entrée suivante coupée de 16 à 24 px, contrainte de test E5 |
| T4 a à d | Renvois et mots | **LEVÉ** | 5.3 (et non 5.5) ; v10 ; « leur contenu n'est pas annoncé d'avance » ; « promesse de temps inchangée » (C2) |
| T5 | Connexion en fenêtre | **LEVÉ À MOITIÉ** | l. 136 et 632 : « fait de code, pas une préférence du fondateur » ; voir N3 |

## 2. Nouveaux points (aucun bloquant)

**N1. Retour après paiement : le cas « paiement fait, abonnement pas encore actif » n'est écrit nulle part dans ce que j'ai lu** (4.2 l. 630, 7.5 e : seul le chemin heureux est testé).
Problème : « Continuer » mène vers « Aujourd'hui » ; si la confirmation de Stripe arrive après le clic, l'abonné peut retomber sur `/abonnement` (règle de l'ancien abonné) alors qu'il vient de payer. Heuristiques H1 (état) et H9 (erreur humaine) en échec dans ce cas.
Correction : ajouter à 4.2 et à l'essai 7.5 e une ligne : si l'abonnement n'est pas encore actif au clic sur « Continuer », la page de succès reste, affiche « Ton paiement est en cours de confirmation » et revérifie seule ; jamais de redirection vers `/abonnement` ni de message d'erreur ; test avec confirmation retardée. [NON VÉRIFIÉ : le cas peut déjà être géré dans le code ou dans une section non relue.]

**N2. « Parcours » à 375 px : trois blocs empilés avant la liste (l. 707).** En-tête avec étape à reprendre, carte « Ton cap » à 3 lignes, puis « Tes bonus » : la liste des 5 parcours peut passer sous deux écrans.
Correction : ajouter au test E5 « à 375 px et à 200 % de texte, le premier parcours de la liste est atteint en deux écrans au plus, et la page n'offre pas plus de 3 actions principales (étape à reprendre, « Tes bonus », un parcours) » ; en cas d'échec, @design réduit la carte, sans déplacer son emplacement.

**N3. Modale de connexion : formulation à corriger (l. 136, 632).** « pas une préférence du fondateur » se lit à l'envers : la préférence UX du fondateur est bien la connexion en fenêtre. La suppression en s15 avait une raison de mesure (`tunnel-inscription-s15.md` l. 4 : aucune URL, aucune mesure) et n'est pas un [CHOIX UTILISATEUR] relevé.
Correction : écrire « retirée en s15 pour mesurer le tunnel (`tunnel-inscription-s15.md` l. 4), décision de session, non décidée par Thomas ; la préférence UX du fondateur (fenêtre fermable) n'est pas rouverte ici, sans effet sur l'arrivée ». Une ligne dans le résumé à Thomas.

**N4. « Aujourd'hui » : densité (l. 703).** Salutation, action principale, vanne avec 5 puces et « une autre », conseil, vidéo, S'entraîner, nouveautés, « Ton mois », question C9. Ordre et état de l'action sont bien définis ; seul le test manque.
Correction : au test E5, « à 375 px, le premier écran contient la salutation et l'action principale, rien d'autre qui demande un geste ; la question C9 n'apparaît jamais avant le premier pas fait ».

## 3. Notes

| Critère | T18 | T19 | Justification |
|---|---|---|---|
| Clarté du chemin | 9,3 | 9,5 | Emplacement unique, sortie de la page neutre, arrivée après paiement et connexion claires ; N1 (paiement en attente) et N2 (Parcours à 375 px) |
| Charge | 9,3 | 9,5 | Une action principale par état, 6 entrées, carte « Ton cap » compacte ; N2 et N4 sont des tests à ajouter |
| Accessibilité prévue | 9 | 10 | `aria-current`, région nommée, mouvement réduit, indice de défilement, 44 px, focus, 200 % de texte, page neutre avec statut ; rien à ajouter |
| Cohérence | 9,3 | 9,5 | Quatre formulations réduites à une ; renvois exacts ; reste N3 |
| **Global** | **9,3** | **9,5** | |

## 4. Verdict

**Mes cinq points du tour 18 sont levés (T5 à moitié, N3).** Aucun bloquant. N1 vaut d'être écrit avant l'essai du lot 0 ; N2 et N4 s'ajoutent comme tests à E5 ; N3 est une phrase à corriger.
