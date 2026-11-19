# Relecture design à l'aveugle, Mes questions et Mes répliques (s26, lot 2, tour 1)

Grille Design du brief v7 (5 critères, globale = minimum, barre 9/10 sans faute dure). Captures lues : 4 comptes, 375/768/1280/1920 selon les cas (visiteur, en-cours, nouvel ouverts à 375, 1280, 1920 ; en-cours 768 pour Mes questions). Une cause confirmée au code (`mes-questions.tsx`).

## Gate typographique mesurée (citée)
`TAILLES-mon-espace_questions.md` : 4 tailles distinctes (24 ou 30, 20, 16, 14) à 375 et 1280 pour les 4 comptes ; combinaisons 6 (visiteur, gratuit, en-cours et nouvel à 1280) ou 5 (375/768). Passe (<= 4 / <= 6).
`TAILLES-mon-espace_repliques.md` : 4 tailles et 6 combinaisons (visiteur, gratuit), 4 tailles et 4 combinaisons (en-cours), 3 tailles et 4 combinaisons (nouvel). Passe. Aucune taille hors échelle, graisses 400/600 seulement.

## Mes questions

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité accueil | 8 | Aperçu : hero 8/4, objet Premium (bord 2 px, halo, carte de fin centrée 448 px) fidèle à l'accueil, titre blanc, un seul aplat. Abonné : sobre, mais colonne de droite quasi vide sous « Mes envois » (nouvel : 420 px vides sous la tuile d'exemples, permis car vide de fin de colonne). |
| 2 Hiérarchie, un seul accent | 9 | Visiteur : bouton d'offre à y=203 (<450) puis titre puis tuile claire. En-cours : le seul aplat est « L'équipe t'a répondu », le bouton d'envoi passe en contour ; nouvel : l'envoi est l'aplat. Correct. Piste : en-cours 375, l'aplat tombe à y≈1190 (formulaire d'abord), hors premier écran (ordre fixé par la spec UX). |
| 3 Usage de la largeur | 6 | 1280/1920 abonné : formulaire coupé (faute 1). 768 en-cours : « Mes envois » en 2 colonnes avec une seule carte, moitié droite vide (340 px sur 659). Le formulaire n'est pas replié à 768 (la spec le prévoyait replié) : 780 px de champs avant la réponse non lue (y≈890 sur 2000). |
| 4 Cohérence comptes | 8 | Même grille 4/8 en en-cours et nouvel, même titre. Les deux boutons d'envoi changent d'état (aplat/contour) comme prévu. |
| 5 Finition | 6 | Formulaire tronqué (faute 1) ; gouttière du verrou asymétrique dans les tuiles fermées (faute 2). Cibles : bouton d'envoi 44 px à 768, ~43 px à 375 (limite, à vérifier au code). Contrastes : textes #B3B3B3 sur #1F1F1F corrects. |

Textes soumis à Thomas : la promesse « Décris ta scène, l'équipe t'écrit en retour. » est bien placée (sous le titre, avant les pastilles). Pas de remarque de place.

NOTE GLOBALE Mes questions : 6/10

## Mes répliques

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité accueil | 8 | Aperçu très propre : tuile « Coloc : la poêle » en clair, champ « Ma réplique à moi » lisible, objet Premium identique aux autres aperçus. Abonné : sobre, carte neutre, liens soulignés. |
| 2 Hiérarchie | 8 | Aperçu et vide : un seul aplat net. En-cours : aucun aplat (spec : lien neutre), la page n'a pas de point focal : « Écrire ma prochaine réplique » est un lien 14 px à droite, collé au compteur « 1 » sans libellé (« 1 » seul se lit mal). Texte soumis à Thomas jugé sur sa place : trop discret pour être l'action du jour, piste 1. |
| 3 Usage de la largeur | 5 | En-cours 1280/1920 : une carte de 389 px (4/12) pour 1216 px utiles, 827 px de vide mort à droite. Nouvel 1280 : tuile droite « Quoi répondre » de 389 x 94 px contenant un seul lien 14 px = tuile creuse (faute 3). |
| 4 Cohérence comptes | 8 | Titre et grille identiques. Les états en-cours et nouvel n'ont pas la même structure d'en-tête (compteur vs rien), cohérent avec la spec. |
| 5 Finition | 7 | Gouttière du verrou asymétrique (faute 2). 375 en-cours : le texte de la réplique coupe à ~220 px dans une carte de 293 px (marge droite 72 px au lieu de 24), à vérifier (`[text-wrap:balance]` ou espaces insécables des guillemets). Liens « Modifier » « Supprimer » : cible 44 px conforme. |

NOTE GLOBALE Mes répliques : 5/10

## Fautes dures (chiffrées)
1. Mes questions, 1280 et 1920, comptes en-cours et nouvel : la colonne du formulaire est tronquée à y=961 (bouton « Envoyer à l'équipe », seul aplat du nouvel, visible sur ~33 px de 48, bas de carte sans arrondi). Cause : `lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto` sur la colonne (ligne 26). Fichier : `apps/web/src/components/espace/questions/mes-questions.tsx`.
2. Aperçus fermés (Mes questions et Mes répliques), 1280 et 1920 : dans `TuileFermee` les cartes internes ont 25 px de marge à gauche et 57 px à droite (gouttière du verrou) : padding asymétrique 25/57 px au lieu de 24/24. Fichiers : `apps/web/src/components/espace/apercu/blocs-fermes.tsx`, `apercu-questions.tsx`, `repliques-fermees.tsx`.
3. Mes répliques, nouvel, 1280 : tuile droite creuse (389 x 94 px, un seul lien « Quoi répondre » de 14 px). Fichier : `apps/web/src/components/espace/repliques/liste-repliques.tsx`.

## Pistes (max 3 par page)
Mes questions :
1. Retirer `lg:max-h-... lg:overflow-y-auto` et ne garder `lg:sticky lg:top-36` que si la carte tient dans la fenêtre (sinon `lg:static`) ; réduire la hauteur du formulaire (`textarea min-h-24`, descriptions des types en une ligne dès `lg`) pour que le bouton soit entier à 900 px de haut. Fait 10 sur la finition.
2. 768 : replier le formulaire comme la spec (« Continuer ») pour que la réponse non lue et l'historique passent avant, `md:grid-cols-1` pour la liste tant qu'il y a une seule carte.
3. 375 en-cours : placer la tuile de réponse non lue avant le formulaire (aplat dans le premier écran).

Mes répliques :
1. Faire du lien d'écriture une action lisible : bouton `BOUTON_SECONDAIRE` (contour) « Écrire ma prochaine réplique » à droite de l'en-tête, compteur avec son libellé existant ; la page gagne un point focal sans second aplat.
2. En-cours 1280 : remplir la largeur avec le contenu existant : une carte 4/12 et, à droite en 8/12, la tuile « Quoi répondre » (même rôle que dans le vide), pour que la rangée ne soit plus 70 % vide. Nouvel : fusionner le lien dans la tuile d'action (sous le bouton, `META`) et supprimer la tuile creuse, la carte passe en `lg:col-span-12` ou garde 8 colonnes avec le lien dans l'en-tête.
3. Vérifier le retour à la ligne de la réplique à 375 (marge droite 72 px).
