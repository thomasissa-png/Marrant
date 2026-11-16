# Relecture UX à l'aveugle, « Aujourd'hui » s25 v7, tour 2

Périmètre : 4 comptes (visiteur, gratuit, en-cours, nouvel), 5 largeurs en pleine page, séries `*-ecran-*` (375, 768, 1280, 1456, 1920) ouvertes pour le visiteur, 375 et 768 pour les autres. Étalon : `visiteur-accueil-1280.png`. Code lu : `aujourdhui/*`, `apercu/{badge-premium,offre-apercu,extrait-coupe,tuile-fermee,hero-apercu,apercu-verrouille,tableau-verrouille}.tsx`, `mon-espace/page.tsx`. Aucune relecture antérieure lue.

## Notes

| Critère | Note | Raison courte |
|---|---|---|
| D1 Élégance, fidélité accueil | 9 | Même carte, même filet, même violet que l'accueil ; retenue. Reste la coupe de l'extrait (D5). |
| D2 Hiérarchie | 9 | Aperçu : H1, offre encadrée, premier pas. Abonné : Z1 dominante (8/12), un seul plein. Deux boutons pleins identiques sur le premier écran 1280 (piste P1). |
| D3 Usage de la largeur | 8 | Abonné : grille bien remplie. Aperçu et C9 : zones mortes (pistes P3, P4). |
| D4 Cohérence entre comptes | 9 | Visiteur et gratuit identiques à la phrase d'objet près ; abonnés mêmes tuiles. |
| D5 Finition au pixel | 8 | Fragment orphelin sous le fondu (faute dure 1) ; bouton figé sous 3:1 (faute dure 2). Cibles 44 px OK au code. |
| U1 Prospect, envie en 3 s | 9 | Pastille Premium, H1, promesse, offre encadrée en haut, premier pas concret lisible mais fermé. |
| U2 Abonné, clarté | 9 | Une action dominante, étiquette claire dans les 4 états. |
| U3 Abonné, envie de continuer | 9 | Cap, XP, série, étape n sur N, mission, feuille de route. |
| U4 Nouvel abonné | 9 | Jamais une page morte : premier pas, cap 1, étape conseillée, 4 semaines, contenu du jour. |
| U5 Accessibilité, cohérence | 9 | Cibles 44 px (`BOUTON_OFFRE` h-12, `PIED_TUILE` min-h-12, `min-h-14` lignes de cartes, `puce`), anneaux de focus, extrait `inert` et `aria-hidden`. |

NOTE GLOBALE = minimum = 8/10. Barre de 9 non atteinte : 2 fautes dures.

## Ce qui est juste (à ne pas toucher)

- Aperçu lisible FERMÉ au premier coup d'œil (1280, 1920, 375) : pastille « Premium » avec le mot sur chaque bloc, premier pas et cap grisés, bouton « Commencer » atténué, fondu vers le fond, légende « Voici un exemple… ». On ne se croit jamais dedans. Offre dans le hero, au-dessus de tout (y 179 à 1280, y 448 à 375 donc dans le premier écran 375 x 812).
- Une seule offre : même libellé, même prix, une réassurance, une preuve, « Connexion » au visiteur seulement.
- Abonné : H1 à gauche, date, grille 8/4 à hauteur égale (Z1 et Z2 mêmes hauteurs à 1280 et 1920), rangée 2 partagée sans cellule vide (`spansRangee`), plus de colonne centrée de 768 px. 1456 et 1920 identiques à 1280 (coque 1216 px alignée sur la bande).
- Nouvel abonné : rangée 5/7 « Étape conseillée » et « Tes 4 premières semaines », pas de « 0 XP », série à démarrer sans reproche.
- Abonné avancé : 250 et 1 en gros chiffres, flamme, aide de la série ; mission avec accroche (plus de creux).

## Fautes dures

### F1 [D5] Fragment orphelin sous le fondu de l'extrait (toutes largeurs, les deux comptes aperçu)

Capture : `visiteur-aujourdhui-ecran-1280.png` y 744 à 760, idem 375 y 970 et 768 y 1100. La rangée 2 de l'extrait est coupée à 160 px (`SuiteCoupee`, `h-40`, masque transparent à `100% - 3rem`). Le rail de la barre d'étapes (`bg-border`) est invisible sous le masque, il ne reste que « Étape 1 sur 4 » seul, fantôme, collé à droite de la tuile et à 12 px de la pastille « Premium » de fin. La tuile « Contenu du jour » ne montre que son titre et un « Vanne du jour » spectral. Un prospect lit un défaut, pas une coupe voulue. Le commentaire du code annonce que le fondu « finit entre deux lignes de texte » : faux pour cette ligne.

Correction codable (`apps/web/src/components/espace/apercu/extrait-coupe.tsx`, `SuiteCoupee`) : faire finir le fondu AVANT la ligne d'avancement (à environ 88 px) : `h-36` et `[mask-image:linear-gradient(to_bottom,black_20%,transparent_5.5rem)]`. Alternative plus sûre : dans `tableau-verrouille.tsx`, ne pas rendre `Avancement` quand `fige` (`ParcoursTuile`, `etape-en-cours.tsx`), la tuile fermée garde étiquette, nom du parcours et pied « Commencer l'étape 1 ». Vérifier sur capture 375, 768, 1280 : plus aucune ligne isolée, la dernière chose lisible est un titre entier. Ce qui ferait 10 : une coupe où la dernière ligne visible est un titre complet et où le badge de fin respire (au moins 24 px sous la dernière ligne lisible).

### F2 [D5, U5] Bouton figé de l'extrait sous le seuil de contraste de la spec (estimation à partir du code)

`TuileFermee` applique `opacity-75` aux enfants de la section (donc à la rangée qui contient le bouton), et `ActionDuJour` ajoute `opacity-60` au bouton figé : 0,75 x 0,60 = 0,45. Texte blanc composité sur fond violet composité sur carte : environ #868686 sur #4B2D7E, soit environ 2,9:1. La spec UX §5 et la spec design §3.4 interdisent « jamais sous 3:1 » (3,9:1 visé) pour le texte lisible ; « Commencer » est le seul libellé du bouton de l'extrait, grisé à la limite de la lecture (visible sur `visiteur-aujourdhui-ecran-1280.png`, bouton à x 626 à 802). Même double atténuation sur `PIED_TUILE` figé de `ParcoursTuile` (`opacity-60` dans `etape-en-cours.tsx`).

Correction codable : supprimer `opacity-60` du bouton figé (`action-du-jour.tsx`, branche `fige`) et du pied figé (`etape-en-cours.tsx`) : l'atténuation de `TuileFermee` suffit (0,75 donne environ 4,5:1, mesuré par le même calcul). Garder `aria-disabled` et `pointer-events-none`. Ce qui ferait 10 : bouton figé encore plus pâle que le vrai bouton mais lisible, 4,5:1.

## Pistes (ne bloquent pas)

- P1 [D2, U1] À 900 px de haut (1280, 1456, 1920), le premier écran montre le bouton du hero ET le bouton de fin, plus celui de l'en-tête (`visiteur-aujourdhui-ecran-1280.png`, y 853 à 900). La spec §2.3 dit qu'ils ne sont jamais visibles ensemble. Piste : `mt-8 md:mt-10` vers `mt-10 md:mt-14` sur `ExtraitCoupe` (`extrait-coupe.tsx`) pousse le second bouton sous la ligne de flottaison sans toucher la lecture du premier écran (la coupe et « La suite est dans Premium » restent visibles).
- P2 [D1, U1] Seul le premier pas et le cap sont montrés entiers ; étape, mission, contenu du jour ne sont que des titres. Le prospect voit peu de valeur sous le premier pas. Piste : après correction F1, laisser une ligne de plus lisible dans `SuiteCoupee` (h-44) pour que « À voix haute, sans public » soit accompagnée de sa pastille « Facultative » avant le fondu.
- P3 [D3] Hero aperçu à 1280 et 1920 : entre la promesse (fin à x 380) et la carte d'offre (x 875 à 1280), environ 480 px de vide sur 90 px de haut, plus grand à 1920 (promesse `max-w-xl` seule). Piste : `max-w-2xl` sur la promesse dans `hero-apercu.tsx` ou `lg:col-span-7` pour la colonne texte et `lg:col-span-5` pour l'offre comme la spec UX (la réassurance gagne une ligne de moins).
- P4 [D3] Tuile « Où veux-tu être plus à l'aise ? » (`question-aise.tsx`) à 1280 et 1920 : les 4 puces tiennent sur 410 px, le tiers droit de la tuile est vide (`en-cours-aujourdhui-1280.png` y 1310 à 1436). Piste : `lg:col-span-5` pour la question et `lg:col-span-7` pour les puces, ou `lg:justify-end` sur le groupe de puces.
- P5 [D3, U4] « Étape conseillée » du nouvel abonné : le rail d'étapes à zéro est une ligne grise vide sur 350 px (1280) et 700 px (768, 1920), avec « Étape 1 sur 4 » à droite : lit comme un composant cassé. Piste : à zéro étape faite, n'afficher que « Étape 1 sur 4 » en pastille (`PASTILLE`) sans rail, ou donner au rail une valeur minimale visible (`min-w-2` sur le remplissage dans `BarreProgression`, `tableau.tsx`).
- P6 [D4] H1 de 48 px côté aperçu (hero) contre 36 px côté abonné : saut compréhensible (hero de vente contre outil), mais un abonné qui voit l'aperçu n'existe pas, donc sans conséquence. À garder.
- P7 [D2] « Si tu as 5 minutes » (`cartes-du-jour.tsx`) est la seule variante de Z1 sans étiquette violette : une phrase de corps de 14 px prend sa place. Piste : texte inchangé, passer le chapeau en `text-xs` + `text-accent-link` n'est pas nécessaire ; accepter, ou garder la phrase mais la placer sous le titre.
- P8 [D3] Contenu du jour : 2 colonnes à 1280 (vanne et conseil à gauche, vidéo à droite) au lieu de 3 x col-4 de la spec design §4 Z6, choix documenté du v7 (vignette plus haute, bas alignés) : rendu bon, les 3 cartes ne se lisent plus « au même poids », la vidéo domine. À assumer.
- P9 [U5] Halo de page : visible à 375 et 768, presque invisible à 1920 (352 px de noir de chaque côté). Conforme à l'arbitrage coque 1216 px ; si Thomas veut plus d'espace à 1920, élargir bande, en-tête, pied ensemble (hors page).

## Nielsen (flows critiques)

| Heuristique | Aperçu | Abonné |
|---|---|---|
| H1 Visibilité de l'état | PASS (pastille, légende) | PASS (cap, étape n sur N, série) |
| H2 Vocabulaire | PASS | PASS |
| H3 Contrôle | PASS (extrait inerte, Connexion) | PASS (mission facultative, C9 une fois) |
| H4 Cohérence | PASS (même carte que l'accueil) | PASS |
| H5 Prévention d'erreurs | PASS | PASS |
| H6 Reconnaissance | PASS (pastilles = titres de l'extrait) | PASS |
| H7 Raccourcis | PASS (offre haut et fin) | PASS (tuiles entières cliquables) |
| H8 Minimalisme | FAIL léger (fragment orphelin F1) | PASS |
| H9 Erreurs | sans objet | PASS (repli du contenu du jour au code) |
| H10 Aide | PASS (réassurance près du prix) | PASS (aide série) |

## Cognitive walkthrough

- Visiteur 375, arrive par la bande : sait que c'est réservé (pastille et H1 dans le même écran), voit l'offre sans défiler, comprend que le premier pas est un aperçu. Friction : aucune bloquante ; [FRICTION H8] à l'étape « je regarde l'extrait », le first-time user lit « Étape 1 sur 4 » seul comme un bug. Solution : F1.
- Nouvel abonné : sait quoi faire (Commencer, seul plein), voit où il va (cap 1, 4 semaines). [FRICTION H1] rail vide de l'étape conseillée : solution P5.

---

NOTE GLOBALE : 8/10

Fautes dures :
1. Fragment orphelin « Étape 1 sur 4 » et tuiles creuses sous le fondu de l'extrait, toutes largeurs : `apps/web/src/components/espace/apercu/extrait-coupe.tsx` (`SuiteCoupee`), ou `etape-en-cours.tsx` (`Avancement` non rendu en `fige`).
2. Bouton « Commencer » et pied de tuile figés à environ 2,9:1 (double opacité 0,75 x 0,60, spec : jamais sous 3:1) : `apps/web/src/components/espace/aujourdhui/action-du-jour.tsx` et `etape-en-cours.tsx` (retirer `opacity-60` en `fige`).
