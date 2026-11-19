# Relecture UX à l'aveugle : Quoi répondre + Parcours (s26)

Périmètre : brief v7 + SEQUENCES.md + 16 séquences vues dans l'ordre (375 et 1280). Les `*-pleine.png` n'ont pas été ouvertes. Aucune capture ne montre le contenu révélé après « Oui / À moitié / Rien » : la valeur centrale de Quoi répondre reste non jugée.
Nielsen : H1 état visible, H2 vocabulaire, H3 contrôle, H4 cohérence, H5 prévention d'erreurs, H6 reconnaissance, H7 raccourcis, H8 minimalisme, H9 erreurs, H10 aide.

## Notes par page (minimum des comptes et largeurs)
| Page | Note | Pourquoi |
|---|---|---|
| Quoi répondre, liste/arrivée (visiteur, gratuit) | 7 | Offre en haut, exemple lisible FERMÉ (barres grises + cadenas). Mais clic sans effet (voir F3). |
| Quoi répondre, abonné (en cours, nouvel) | 8 | Master-detail à 1280 : la liste reste à gauche, reprise sur la 1re non faite. Mobile : liste puis fiche, contexte perdu. |
| Quoi répondre, fiche | 7 | Retour/suivant clairs, mais état « ça a marché » trompeur (F4). |
| Parcours, liste | 7 | Bon à 1280 (hero « Reprendre », progression). Visiteur mobile : l'action est sous le pli. |
| Parcours, détail | 6 | Page longue en accordéon, aucun menu d'étapes pour l'abonné, Retour en bas (F1). |
| /abonnement | 8 | Offre unique claire, mensuel présélectionné. Perd la bande de rubriques et tout retour visible. |
| /register (depuis Parcours) | 5 | Page nue : ni en-tête, ni bande, ni fermeture (F2). |

## Notes par trajet
| Trajet | 375 | 1280 |
|---|---|---|
| qr-visiteur | 6 | 6 |
| qr-gratuit | 6 | 7 |
| qr-abonné en cours | 7 | 8 |
| qr-nouvel abonné | 7 | 8 |
| pa-visiteur | 5 | 7 |
| pa-gratuit | 5 | 7 |
| pa-abonné en cours | 5 | 6 |
| pa-nouvel abonné | 6 | 7 |

## Frictions les plus fortes (ordre d'importance)
**F1 [H3, H6, H7] Parcours détail : on n'a ni menu d'étapes persistant ni retour à portée.** C'est la critique du fondateur (« pourquoi on ne garde pas le menu à gauche »). Visible dans pa-abonné 1280-3/4/5 et pa-nouvel 1280-3/4, ainsi que dans les mêmes captures à 375. « Retour : Parcours » n'est atteint qu'après défilement jusqu'au bas (SEQUENCES 4→5), alors que Quoi répondre a son Retour en haut de fiche. Le visiteur a une colonne d'étapes à droite (pa-visiteur-1280-2), l'abonné n'a rien. À l'ouverture, « Reprendre » ou « Commencer l'étape 1 » atterrit dans un accordéon de 5 lignes toutes intitulées « Voir » (3.1 à 3.5) sans dire laquelle faire d'abord ni laquelle est faite (abonné 375-2).
Correction minimale : sur ≥1024 px, colonne gauche sticky des étapes avec coches et sous-étapes (même gabarit que la liste Quoi répondre). Sur mobile, lien « ‹ Parcours » en haut et barre sticky « Étape 3/3 · 3.1 suivante ». Libellés des liens « Voir » = titre de la sous-étape (WCAG 2.4.4). Une sous-étape suivante mise en avant (bouton plein), pas cinq liens égaux.

**F2 [H3, H4] /abonnement et /register sont des pages nues.** Captures : qr-visiteur-1280-3, pa-visiteur-1280-3, pa-gratuit-375-3. Le fondateur veut une auth en modale fermable avec en-tête et pied visibles. Ici /register n'affiche aucun en-tête, aucune bande, aucun X, aucun « retour à Machine à Café ». /abonnement garde l'en-tête mais pas la bande de rubriques. Seul recours : le bouton retour du navigateur (qui, lui, restitue bien la position : scrollY 4234 et 2370 retrouvés).
Correction minimale : /register en modale (Escape, clic dehors, X) au-dessus de la page d'origine ; sur /abonnement, ajouter un « ‹ Retour à <rubrique> » (paramètre `from`) en haut à gauche et conserver la bande.

**F3 [H1, H6] Clic sans effet sur la tuile « fermée » (visiteur, gratuit).** qr-visiteur-1280-2 est identique à -1, et à 375 la page ne bouge pas non plus. La carte « Coloc : la poêle » avec cadenas, les puces « Où et avec qui ? », « Pour quoi faire ? » et les trois cartes « La sûre / La joueuse / La risquée » ressemblent à des boutons et ne répondent pas. C'est l'impression de « page morte ». Correction : toute zone cadenassée déclenche la même action, scroll vers l'offre en haut avec focus sur « Tout ouvrir » ou petit message « Ouvert avec Premium », sinon retirer l'apparence interactive (`cursor-default`, pas de hover).

**F4 [H5, H1, H4] Fiche d'une situation : l'état par défaut ment, et « suivante » contredit le hero.**
- « Essayé, ça a marché » est rempli en violet avant tout clic (qr-abonné-1280-1/2, nouvel-1280-1). On lit « déjà choisi » ; après le clic il devient un contour avec coche (-3/4). La logique est inversée. À 1280 il ajoute aussi un second accent plein à côté de « Situation suivante » (faute dure du brief : un seul accent). Correction : trois pastilles neutres à l'arrivée, la choisie seule en contour violet + coche.
- Hero mobile « Voir » = « C'est quoi, cette odeur ? » (non faite), mais « Situation suivante » saute à « Tu en as pour longtemps ? » (qr-abonné-375-4) : l'utilisateur laisse une situation non faite derrière lui sans le savoir. Correction : « suivante » = prochaine non faite de la série, avec l'intitulé dans le bouton (« Suivante : C'est quoi, cette odeur ? »).

**F5 [H4, H6] Parcours visiteur/gratuit mobile : la promesse « Tester l'étape 1 gratuite » est invisible puis non tenue.**
- À 375, l'arrivée (pa-visiteur-375-1) montre 2 paragraphes et pas un seul bouton de la carte (l'offre « Tout ouvrir » est dans l'en-tête, c'est tout). Le bouton est plus bas.
- Le clic arrive en haut de la page détail (375-2) avec l'étape 1 REPLIÉE (« Étape 1 gratuite, la suite avec Premium » + chevron), alors qu'à 1280 elle est ouverte. Un clic de plus pour un contenu promis gratuit. Correction : lien d'ancre `#etape-1` et accordéon ouvert par défaut pour l'étape gratuite, sur toutes les largeurs.

## Autres défauts (note < 9)
- **Retour à la liste sur mobile (qr-abonné-375-5, nouvel-375-5)** : la liste revient en haut (scrollY 24 / 0), la ligne qu'on vient de faire (3e) est sous le pli. Liste à 1280 : la ligne courante est surlignée, bon. Correction : `scrollIntoView({block:'center'})` sur la ligne `aria-current`, et la liste sur mobile ouverte sur la série en cours.
- **Mobile Quoi répondre fiche** : on ne sait plus où on est dans la série (pas de « 2/4 »), on n'a aucun accès à la liste sans repasser par « Retour ». Correction : en-tête de fiche « Coloc · 3/4 » + lien « ‹ Liste » (H6, H7).
- **Bouton « Situation suivante » tout en bas** (qr-abonné-375-3, scrollY 665) : deux défilements avant de continuer. Correction : sticky bas d'écran une fois la pastille de retour choisie (≥ 44 px).
- **Bandeau « Nouveau cap : Tu te lances. Fermer »** (pa-abonné 375-1/1280-1) : c'est un encart sans icône qui pousse l'action « Reprendre » sous le pli sur mobile, au-dessus du hero. Correction : le replier en une ligne ou le placer après le hero.
- **Vocabulaire « Ton cap · cap 2 sur 5 · Tu t'échauffes »** (nouvel et en cours) : jargon non expliqué (H2, H10). Un nouvel abonné ne sait pas ce que sont les 5 cercles. Correction : info-bulle ou libellé « 2 pratiques sur 5 cette semaine » (texte à valider par Thomas).
- **Cohérence gratuit/visiteur** : sur Quoi répondre mobile, le cadre d'offre du gratuit empile deux lignes « Premium… » (qr-gratuit-375-1), le visiteur une seule + « Connexion ». À 1280, le visiteur a « Tout ouvrir » dans l'en-tête sur Parcours, pas sur Quoi répondre (la ligne d'offre y est dans la page). Harmoniser sur une seule offre, une seule ligne de réassurance (H4, H8).
- **Parcours liste abonné** : « Continuer ce parcours » en contour sur toutes les cartes, y compris celles à 0/4 (« Commencer ce parcours » en contour aussi) : aucune différence de poids entre l'étape en cours et les autres, hormis le hero. Acceptable, à garder.
- **Nouvel abonné Parcours** : « Commencer l'étape 1 » mène à la liste 1.1-1.5 et non au premier contenu (pa-nouvel-1280-2) : il faut encore trouver le bon « Voir » (H6). Même correction que F1.
- **Bande de rubriques mobile** : l'onglet « Bibliothèque » et les suivants sont coupés (« S'en… », « B ») ; c'est le comportement attendu d'un défilement, mais la bande des visiteurs a des cadenas coupés à gauche (qr-visiteur-375-1). Hors périmètre (validé), noté seulement.

## Ce qui est au niveau (à ne pas toucher)
- Liste fixe à gauche + fiche à droite sur Quoi répondre à 1280 (compte abonné) : exactement ce que demandait le fondateur.
- Position de défilement restituée au retour du navigateur depuis /abonnement et /register.
- Retour vers `/parcours#parcours-<id>` : atterrit sur la carte du parcours, pas en haut de page.
- Aperçu Premium lisible FERMÉ avec offre en haut, à 375 comme à 1280.
- Nouvel abonné : jamais de page morte (« Voir » ou « Commencer » toujours présents, arrivée directe sur la 1re situation).

## Mobile/ordinateur
L'écart est le point faible : le fondateur obtient le menu gauche à 1280 sur Quoi répondre seulement. Parcours détail abonné n'a aucune navigation latérale à aucune largeur ; le visiteur en a une que l'abonné n'a plus (régression de contexte entre comptes).

NOTE GLOBALE : 5/10 (min : /register page nue et Parcours détail sans navigation, 6/10 hors /register).
