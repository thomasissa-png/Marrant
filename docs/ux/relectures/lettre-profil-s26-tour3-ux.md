# Relecture UX à l'aveugle : La lettre et Profil, s26 tour 3 (interrupteur ouvert)

Lu : brief v7, specs UX et design s26, TAILLES-lettre.md et TAILLES-profil.md, captures `docs/captures/s26/lot2-tour-3/{lettre,profil}/` (375, 1280, 1920 ouverts ; 768 et 1456 non ouverts, mêmes grilles par construction), code de `lettres-abonne-cartes.tsx`, `lettre-page-ouverte.tsx`, `lettre-page-inscription.tsx`. Mesures lues sur captures réduites (échelle 1,58 ou 1,21) : précision environ 3 px.
Hors notation (décidés) : titre blanc, un seul aplat, colonne de lecture, « Supprimer mon compte » sous son texte, textes validés, page de connexion du visiteur sur /profil.

## Gate typographique citée (premier écran)

La lettre (TAILLES-lettre.md) : visiteur et gratuit : 4 tailles (24 ou 30, 20, 16, 14 px), 6 combinaisons à 375, 768, 1280 et 1920 ; en-cours et nouvel : 4 tailles, 5 combinaisons. Limite (4 tailles, 6 combinaisons) respectée, aucune faute dure.
Profil (TAILLES-profil.md) : gratuit, en-cours, nouvel : 4 tailles, 5 combinaisons à 375, 768, et 6 à 1280 et 1920 (6 = limite, pas un dépassement). Le visiteur (3 tailles, 24/20/14 en 700) est la page de connexion : hors périmètre.

## La lettre

Constat par compte :
- Visiteur et gratuit, 1280 : titre blanc à gauche, formulaire 7 col (bouton vers y 444-491, haut du bouton sous 450, bas au-dessus de 500 : mesure à ±3 px, tenable), « dernier numéro » 5 col. Un seul aplat violet. Le gratuit voit son e-mail pré-rempli. À 375 le bouton est vers y 500 (cible < 700), inscription avant le numéro. Colonne gauche collante (`lg:sticky lg:top-36`, code) : le vide sous le formulaire (environ 2 000 px en capture pleine page) est un vide de fin de colonne, permis.
- Abonné (en-cours et nouvel), 1280 : « La lettre » + compteur « 2 » collé au titre, tuile « La lettre du jeudi 12 novembre » pleine largeur (teinte violette et filet, aucun aplat), carte précédente 389 px de large en 3 col (les 2/3 de droite vides : fin de grille, permis). 375 : une colonne, sans débordement. Écarts entre blocs 48 px entre blocs, jamais 32 px au milieu d'un bloc.

Notes (grille UX) :
| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| 1 Prospect, 3 secondes | 9 | Promesse, champ et bouton au premier écran, une seule offre. Reste : la case de consentement est lisible mais petite (environ 24 px visibles à 1280), cible 44 px non vérifiée au code (`lettre-inscription.tsx`, `LettrePageInscription`). 10 = `min-h-11` sur le libellé de la case (déjà cliquable si `label`). Piste. |
| 2 Abonné : je sais quoi faire | 8 | La tuile de dernière lettre n'a aucun signe qu'elle se clique : pas de bouton « Lire » (le code le dit : aucune constante), pas de chevron. Le premier visiteur de la page voit un bloc teinté, pas une action (`lettres-abonne-cartes.tsx`, `CARTE_ACTION`). Correction sans texte neuf : icône flèche SVG `h-5 w-5` alignée à droite dans la tuile (et dans les cartes précédentes), `group-hover` sur le filet. Ou « Lire » à faire valider par Thomas (texte). 10 = signe d'action visible. |
| 3 Abonné : envie de continuer | 8 | Aucune progression possible (pas d'état « lue », décision de code) ; seul signal : le compteur « 2 », sans unité, qui se lit comme un résidu à côté du titre. 10 = un état de lecture (`lues / envoyées`) si Thomas ouvre la donnée ; sans cela, 8 est le plafond honnête. |
| 4 Nouvel abonné | 9 | Jamais une page morte : 2 lettres lisibles, même vue. L'état vide (`ArchiveLettres`, 8/4) n'est pas dans les captures, non jugé. |
| 5 Accessibilité, cohérence | 9 | Tuile entière = lien étiré avec anneau `focus-within`, cibles >= 44 px, cohérence visiteur/gratuit totale. Le « 2 » nu n'a pas de nom accessible explicite (`data-compteur-lettres`) : piste `aria-label` = texte à valider. |

Aperçu comparé au brief : « donne envie de continuer » côté abonné reste le point faible de la page, à cause de la donnée, pas de la mise en page.

NOTE GLOBALE La lettre : 8/10

## Profil

Constat :
- Gratuit 1280 : 8/4. Gauche « Prochaine étape » (3 tuiles 2+1, une case vide de 370 px à droite de la 3e, en fin de carte : permis), droite « Abonnement » avec le bouton « S'abonner · 1,99 €/mois » (seul aplat, haut vers y 400 à 1280, premier élément de la colonne), « Ton prénom ». « Supprimer mon compte » pleine largeur sous un filet. Pas de Premium simulé.
- Gratuit 375 : ordre « Prochaine étape » (3 tuiles empilées, environ 550 px), puis Abonnement : le bouton d'offre est à y environ 940 (hors premier écran 812).
- En-cours 1280 : « Reprendre ton parcours » (seul aplat, étape 3), « Ton cap » (cap 2 sur 5 + pastilles + 250 XP), « Statistiques » en 4 colonnes, « Mes parcours » avec 2 barres. Droite : Abonnement (Premium), Rappel, Lettre de la semaine, Prénom, Ta question. Colonne gauche finit à environ y 1 065, droite à environ 1 360 : vide de fin de colonne, permis.
- Nouvel 1280 : cap 1, série à zéro, stats à 0, « Mes parcours » vide avec « Découvrir les parcours » en contour. Aucun aplat violet sur toute la page.

Notes :
| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| 1 Prospect (gratuit) | 8 | À 375 l'offre est après 3 tuiles de « Prochaine étape » (bouton à y environ 940). Le brief demande l'offre en haut. Correction : colonne latérale `order-first` sous `lg:` ... c'est-à-dire carte Abonnement avant « Prochaine étape » à 375 uniquement (`max-lg:order-first` sur le bloc Abonnement, fichier de la page profil). 1280 : correct. 10 = bouton avant y 700 à 375. |
| 2 Abonné : clarté | 9 | « Reprendre l'étape 3 » en tête, seul aplat, sans ambiguïté. Léger bruit : « Tu te lances · cap 2 sur 5 » à côté de « Ta série démarre à ta prochaine pratique. » dit deux états pour le même abonné avancé (texte validé : signalé, pas réécrit). |
| 3 Abonné : envie de continuer | 9 | Cap, 5 pastilles, XP, barres par parcours, stats : la progression est lisible au premier écran à 1280. À 375 elle arrive après « Reprendre » (ordre voulu). Pour 10 : la série à zéro chez un abonné qui a 250 XP est démotivante (donnée, pas mise en page). |
| 4 Nouvel abonné | 8 | Page non morte (3 pistes, cap 1, parcours vide), mais aucune action pleine : trois tuiles « Prochaine étape » sans signe d'action visible et un bouton contour « Découvrir les parcours ». Correction sans texte neuf : puisque le nouvel abonné n'a aucun autre aplat, passer « Découvrir les parcours » en `buttonVariants({ size: "lg" })` (composant « Mes parcours » vide). 10 = une action pleine claire. |
| 5 Accessibilité, cohérence | 9 | Titres blancs, hiérarchie cohérente entre les trois comptes connectés, ancres conservées. Les trois tuiles de « Prochaine étape » ne montrent pas qu'elles sont des liens (même piste flèche SVG que La lettre). Les blocs ambre et rouge de suppression sont des états d'alerte, pas un accent violet : ok. |

Le visiteur sur /profil est renvoyé à la connexion : hors périmètre, non noté.

NOTE GLOBALE Profil : 8/10

## Fautes dures (chiffrables)

Aucune faute dure sur les deux pages : gate typographique (4 tailles, <= 6 combinaisons) respectée sur tous les comptes mesurés, un seul aplat par écran (zéro sur La lettre abonné et le Profil nouvel abonné, jamais deux), aucun vide > 32 px au milieu d'un bloc relevé, aucun débordement visible à 375.

Liste numérotée des fautes dures : aucune.

## Pistes (3 max par page, non bloquantes ; barre 9 non atteinte, donc à traiter)

La lettre
1. Signe d'action sur la tuile de dernière lettre et sur les cartes précédentes (flèche SVG, pas de texte) : `apps/web/src/components/lettre/lettres-abonne-cartes.tsx`.
2. Texte « Lire » ou unité du compteur « 2 » (ex. « lettres ») : texte neuf à valider par Thomas, ne pas coder avant.
3. Cible 44 px de la case de consentement à vérifier : `apps/web/src/components/lettre/lettre-inscription.tsx`.

Profil
1. Offre avant « Prochaine étape » à 375 pour le gratuit (`max-lg:order-first` sur Abonnement), fichier de la page `/profil` du dashboard.
2. Nouvel abonné : « Découvrir les parcours » en bouton plein, seul aplat de la page.
3. Flèche SVG sur les tuiles « Prochaine étape » pour signaler le lien.

NOTE GLOBALE La lettre : 8/10
NOTE GLOBALE Profil : 8/10
Fautes dures : aucune.
