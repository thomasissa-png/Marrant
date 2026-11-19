# Relecture UX à l'aveugle : Quoi répondre + Parcours (s26, v2)

Base : brief v7 + SEQUENCES.md + 93 captures (375/1280, 4 comptes). Aucune spec lue. Hors périmètre : /abonnement, /register. Notes /10, exigeantes. Pas de code lu : les corrections sont des pistes de fichier à confirmer.

## Notes par page
| Page | Note | Raison courte |
|---|---|---|
| Quoi répondre (visiteur/gratuit) | 7,5 | Fermé lisible, offre en haut, mais clic sur tuile muet, deux offres, deux textes différents selon compte |
| Quoi répondre (abonné, liste + fiche) | 8 | Liste + fiche, progression, "Fait" ; "Situation suivante" ambiguë |
| Parcours liste | 7 | Mur de texte x5, colonnes cassées (Storytelling, Boulot), pas de reco pour visiteur |
| Parcours détail | 6,5 | Sous-étapes = ancres qui atterrissent au mauvais endroit, offre invisible en bas d'étape visiteur |

## Notes par trajet
| Trajet | Note | | Trajet | Note |
|---|---|---|---|---|
| qr-visiteur-375 | 7 | | pa-visiteur-375 | 7 |
| qr-visiteur-1280 | 7,5 | | pa-visiteur-1280 | 6,5 |
| qr-gratuit-375 | 7 | | pa-gratuit-375 | 7 |
| qr-gratuit-1280 | 7,5 | | pa-gratuit-1280 | 6,5 |
| qr-en-cours-375 | 8 | | pa-en-cours-375 | 6,5 |
| qr-en-cours-1280 | 8,5 | | pa-en-cours-1280 | 7,5 |
| qr-nouvel-375 | 7,5 | | pa-nouvel-375 | 6,5 |
| qr-nouvel-1280 | 8 | | pa-nouvel-1280 | 7,5 |

## Défauts et corrections minimales (note < 9)

### F1. Sous-étape "2.2 Vannes à pratiquer" : on n'arrive pas sur 2.2 (pa-en-cours 375-5, 1280-4 ; pa-nouvel 375-5, 1280-4) [H1, H2, H4]
Le clic sur 2.2 (#fiche-2-2) atterrit sur "Alors, ce défi ?" puis les vidéos (scrollY 3879 en 375). Aucun titre "2.2 Vannes à pratiquer" visible. Au 1280 nouvel, le menu garde 2.1 en gras/liseré et 2.2 seulement en fond gris : deux états actifs contradictoires. Le trajet "je clique, je suis où ?" échoue : c'est le défaut le plus fort. Correction : l'ancre doit viser le titre de la sous-étape (avec `scroll-mt` sous l'en-tête sticky), et l'état actif du menu suit l'ancre (un seul actif). Si les sous-étapes n'ont pas de bloc propre, ne pas les présenter comme des liens de page.

### F2. Visiteur : fin d'étape 1, l'offre n'apparaît pas (pa-visiteur 375-3, 1280-3 ; pa-gratuit idem) [H1, H10]
Le trajet annonce « Passer à l'étape 2 · 1,99 €/mois » visible, or capture 3 quasi identique à 2 (24 px de défilement), toujours en plein texte, sans bouton. Je ne peux pas valider que le point de conversion existe au bon moment. Les étapes 2 et 3 du menu n'ont ni cadenas ni verbe : seul « la suite avec Premium » (petit gras) le dit. Correction : cadenas sur 2 et 3 dans le menu + un bloc d'offre en fin d'étape 1 ; refaire la capture 3 au bas réel de l'étape.

### F3. Retour perd la position au 1280 (pa-visiteur/gratuit/en-cours 1280, dernière capture ; qr-en-cours 1280-5) [H3, H6]
Au 375, « Retour : Parcours » ramène à la carte du parcours (#parcours-machine-a-cafe). Au 1280, le retour navigateur ramène en haut de /parcours (scrollY 0) : la carte Machine à Café est à ~310 px donc visible ici, mais avec 5 cartes la position n'est pas garantie. Cohérence 375/1280 à vérifier : le lien « Retour : Parcours » du pied de fiche (visible en pa-en-cours-1280-4) doit utiliser la même ancre.

### F4. Clic sur tuile fermée : aucun effet explicatif (qr-visiteur/gratuit 375-2, 1280-2) [H1, H9]
Le clic ne fait que mettre un anneau de focus sur « Tout ouvrir ». Sans lecture d'écran, l'utilisateur voit un halo et ne sait pas pourquoi. Correction : au clic, ajouter une ligne visible (« Cette partie s'ouvre avec Premium ») près du bouton, plus le focus ; au 375 ramener le bouton dans la zone visible avec le texte.

### F5. « Situation suivante » n'est pas la suivante (qr-en-cours 375-4 ; qr-nouvel 375-4/1280-4) [H2, H4]
Après « Samedi » (3e de la liste), le bouton mène à « La poêle » (1re, pas faite), pas à la 4e. Pour le nouvel abonné cela revient en arrière, sans l'annoncer. Correction : libellé honnête (« Prochaine non faite : La poêle ») ou ordre de la liste. Le bouton passe de violet à contour blanc selon l'état (qr-en-cours 1280-pleine) : un seul style.

### F6. Parcours liste : texte en bloc, colonnes cassées (pa-*-1280-pleine) [H8, H4]
Storytelling et Boulot : le paragraphe de gauche s'arrête (« jusqu'à ce qu'on te ») et la fin tombe en haut de l'autre colonne (« la redemande. »). 5 cartes de ~350 px de texte identique, CTA en contour blanc : aucune carte ne domine. Correction : ne pas répartir le paragraphe en colonnes CSS ; 2 blocs fixes (promesse | Léa/Tom). Réduire l'« Imagine… » au premier écran de chaque carte.

### F7. Visiteur : offre trouvable mais dispersée (qr-*, pa-*) [H4, H8]
Quoi répondre : bouton en haut, répété en bas (« La suite est dans Premium ») : correct. Mais le texte d'offre diffère visiteur/gratuit (le visiteur n'a pas « catalogue, 5 parcours, carnet », le gratuit si ; le visiteur a « Connexion », le gratuit non). Au 375 le visiteur n'a pas « Connexion » dans l'en-tête : seulement dans la carte. Correction : même corps d'offre pour les deux, valeur en une ligne avant le prix.

### F7b. Parcours visiteur : pas de recommandation (pa-visiteur-375-1) [H7]
Bouton « Tester l'étape 1 de Machine à Café, gratuite » en tête, mais 5 cartes concurrentes et le quiz « Quel parcours est fait pour toi ? » tout en bas. Un visiteur ne sait pas lequel choisir en 3 secondes. Correction : remonter le quiz en haut ou pré-marquer un parcours conseillé.

### F8. Abonné Parcours : vocabulaire et chiffres qui se contredisent (pa-en-cours 375-1/375-3, 1280-1) [H2, H4]
« Étape 3 sur 3 » (hero) vs « 2 sur 3 étapes » (menu) : lequel est vrai ? « Nouveau cap : Tu te lances. » + « cap 2 sur 5 » + « Ta série démarre à ta prochaine pratique » : trois formulations de la progression, le mot « cap » non défini. Le bandeau « Fermer » occupe une ligne pleine avant l'action. Correction : « Étape 3 sur 3 à faire (2 faites) » ; un seul texte de progression ; bandeau en une ligne sous le bouton.

### F9. Nouvel abonné Parcours : le premier clic reste froid (pa-nouvel) [H7, H10]
Le hero « Répartie, Commencer l'étape 1 » est clair (bon). Mais « Commencer » dans le menu d'une fiche étape 2 (pa-nouvel-1280-3) ne dit pas quelle étape il lance ; et le clic sur l'étape 2 avant la 1 n'avertit pas. « Tes 4 premières semaines » prend autant de place que l'action. Correction : « Commencer l'étape 1 » ; replier le bloc semaines après la première visite.

### F10. Mobile : la fiche ne dit pas où je suis (qr-en-cours 375-2/-3/-4) [H1]
La fiche n'affiche pas « 3 sur 4 · Coloc » ; seul « Retour : Quoi répondre » rappelle le contexte. Au 1280 le menu latéral le fait. Correction : une ligne « Coloc · 3/4 » au-dessus du titre au 375. « Enregistrer » grisé sans raison affichée (contraste faible).

### F11. Parcours mobile : menu replié "N sur M étapes" (pa-en-cours/nouvel 375-3) [H6, H3]
Le menu des étapes est sous la grosse carte d'en-tête et le bloc rappel e-mail (≈500 px) : il faut défiler pour trouver la navigation. Correction : le menu replié en premier, rappel e-mail déplacé en bas.

## Ce qui est bon (à ne pas casser)
Quoi répondre abonné : liste groupée avec « Fait », fiche à droite, position conservée (liste restaurée à scrollY 278/186 au retour mobile). Parcours abonné : « Reprendre » unique et violet, progression en segments. Fermé lisible, offre en haut, cadenas homogènes, menu global conservé partout. Pas de page morte pour visiteur/gratuit.

## 5 frictions les plus fortes
1. F1 : sous-étapes mal ancrées (H1, H4).
2. F2 : offre introuvable en bas d'étape 1 visiteur, étapes 2/3 sans cadenas (H1, H10).
3. F6 : colonnes de texte cassées et mur de cartes (H8).
4. F5 : « Situation suivante » qui renvoie en arrière (H2, H4).
5. F8 : progression Parcours contradictoire (H2, H4).

NOTE GLOBALE : 6,5/10 (minimum, Parcours détail). Fautes dures :
1. Ancre de sous-étape fausse et double état actif (composant menu d'étapes /parcours/[slug]).
2. Point de conversion absent en bas d'étape 1 visiteur (vue détail parcours, bloc fin d'étape).
3. Texte réparti en colonnes qui coupe les phrases (carte parcours, page /parcours).
