# Relecture design à l'aveugle : Quoi répondre et Parcours (captures s26 v4)

Méthode : lu brief v7, typo.ts, SEQUENCES.md ; regardé les séquences qr-* et pa-* (4 comptes, 375 et 1280), les pleines pages et les 1920 de l'aperçu. Les ss-* ignorées. Aucune mesure de tailles de police fournie : le comptage typographique n'est pas jugé ici (seule l'impression visuelle l'est). Hors périmètre non noté (nav collante, pied de page, émojis, mesure d'intro).

## Notes par page (/10)
| Page | Note | Verrou principal |
|---|---|---|
| Quoi répondre, aperçu (visiteur, gratuit) | 8 | vide sous les pastilles, tuiles du bas coupées, CTA bas différent 1280/1920 |
| Quoi répondre, abonné (en cours, nouvel) | 8,5 | pas d'action violette à l'arrivée à 1280, bouton qui change de style |
| Parcours, liste | 8,5 | barre de progression non alignée (abonné), bandeau « Nouveau cap » lourd |
| Parcours, détail | 8 | hiérarchie plate dans la carte d'étape, titre du parcours dupliqué à 375 |

## Notes par trajet (/10)
| Trajet | 375 | 1280 |
|---|---|---|
| qr-visiteur | 8,5 | 8 |
| qr-gratuit | 8,5 | 8 |
| qr-abonne-en-cours | 8,5 | 8,5 |
| qr-nouvel-abonne | 8,5 | 8,5 |
| pa-visiteur | 8,5 | 8,5 |
| pa-gratuit | 8,5 | 8,5 |
| pa-abonne-en-cours | 8 | 8 |
| pa-nouvel-abonne | 8 | 8,5 |

Un seul bouton violet plein par écran : respecté partout (en-tête compris : « Tout ouvrir » du header sur /parcours visiteur/gratuit est seul, les CTA de page y sont en contour). Pastille de cloche non comptée. Aucun écran avec deux pleins.

## Défauts et corrections minimales (notes < 9)
1. **Aperçu, vide sous les pastilles** (qr-visiteur-1280-1, qr-gratuit-1280-1) : entre la dernière ligne de pastilles (y≈340) et « Voici un exemple » (y≈415), environ 75 px vides à gauche de la carte d'offre (haut 154 à 356). Correction : aligner le bas du bloc titre/pastilles sur le bas de la carte d'offre (items-end ou carte plus basse) et ramener l'espace avant « Voici un exemple » à 24 ou 32 px (token d'espacement existant).
2. **Aperçu, tuiles du bas coupées** (pleines 1280/1920 : « Rattraper un faux pas », « L'erreur… », « Comment choisir ») : les cartes s'arrêtent net sur un dégradé, sans bord bas ni padding, avec deux barres grises : elles se lisent comme tronquées ou cassées. Correction : cartes complètes (bord bas et padding), ou dégradé sur la rangée entière et non sur chaque tuile.
3. **Aperçu, CTA bas incohérent entre largeurs** : « La suite est dans Premium » a un bouton plein à 1280 (pleines) et un bouton contour à 1920 (qr-*-1920-pleine). Même page, deux rendus : à 1280 la pleine page montre deux pleins. Correction : choisir contour partout (le plein est déjà en haut) ou plein partout.
4. **Aperçu, squelettes gris sur gris** (La sûre, La joueuse, « Pour quoi faire ? ») : barres et pastilles quasi invisibles, la rangée « Pour quoi faire ? » ressemble à une zone vide. Correction : pastilles avec libellé en gris secondaire lisible (le contraste actuel est sous AA à l'œil) ou rangée réduite à une ligne de texte.
5. **Aperçu, redondance** : « Quoi répondre » apparaît en titre de page puis comme étiquette de la carte exemple (qr-visiteur-1280-1). Correction : retirer l'étiquette de la carte ou la remplacer par « Exemple ».
6. **Abonné, pas d'action violette à l'arrivée 1280** (qr-abonne-en-cours-1280-1, qr-nouvel-abonne-1280-1) alors que le 375 montre la carte « Voir ». Le 1280 ouvre directement la fiche, sans bouton primaire visible ; « Situation suivante » n'apparaît qu'en bas de page. Correction : sur 1280, mettre « Situation suivante » (ou « Commencer ») en pied de la carte de la scène, visible sans défiler ; 375 et 1280 doivent exposer la même action.
7. **Abonné, « Situation suivante » change de style** : contour (pleine page nouvel, ligne 1106) puis plein violet après « Essayé » (qr-*-1280-3). Le passage est logique mais le bouton « saute » de fonction visuelle sans transition ; de plus la carte gagne 2 à 6 px quand la pastille « Fait » apparaît (« À toi » 686 puis 666). Correction : réserver la hauteur de la pastille (min-height de la ligne « À toi ») ; garder le contour tant que rien n'est validé.
8. **Abonné, bouton « Enregistrer » désactivé** presque invisible (bord et fond gris sur gris, qr-*-1280-pleine) : se lit comme un trou. Correction : bord text-muted visible, libellé en gris secondaire.
9. **Abonné, sidebar qui saute de 9 px** au défilement (carte à y=153 puis 144, qr-abonne-en-cours-1280-3 contre -1). Correction : aligner `top` du sticky sur la marge de page (153) ou supprimer le décalage initial.
10. **Abonné, ligne orpheline « Prends ton temps »** : 14 px gris, entre l'aide et la question, sans lien visible avec l'un ni l'autre (qr-*-1280-1). Correction : la rattacher en pied de l'aide (même bloc, espacement sm) ou la supprimer si redondante.
11. **Liste Parcours, barre de progression non alignée** (pa-abonne-en-cours-1280-1 et pleine) : la barre 3 segments de « Étape en cours » s'arrête à x≈925 alors que le bouton « Reprendre » et la carte vont à 1223 ; « Étape 3 sur 3 » flotte à droite. Correction : barre pleine largeur (comme les cartes du dessous) ou bornée à la colonne de texte avec libellé collé dessous.
12. **Liste Parcours, rangée « Ton cap »** (abonné et nouvel, 1280) : points gris pleins, barres blanches ailleurs, deux phrases en gras côte à côte (« Ta série démarre… », « Tu te lances · cap 2 sur 5 ») qui se concurrencent ; à 375 elles s'empilent sur trois lignes. Correction : une phrase en gras, l'autre en méta grise ; points de la même couleur que les barres.
13. **Liste Parcours, bandeau « Nouveau cap : Tu te lances. »** (abonné, 77 px de haut pour une ligne et « Fermer ») : bloc lourd en tête, il repousse « Reprendre » et dédouble la rangée « Ton cap » juste dessous. Correction : l'intégrer dans la carte « Étape en cours » ou le réduire à 48 px.
14. **Liste Parcours, doublon d'action** (abonné pleine) : « Reprendre » en plein en haut et « Continuer ce parcours » en contour sur la même carte plus bas. Correction : retirer le CTA de la carte déjà promue en tête (garder la barre de progression seule).
15. **Détail, hiérarchie plate** (pa-*-1280-1/2 et 375-2) : titre de l'étape (16 px, 600) identique au sous-titre de la fiche (« La règle des détails… ») et aux H3 (« Ce que tu vas apprendre », « Le conseil »). Une seule zone dominante manque, alors que la sidebar porte le titre en 20 px. Correction : titre d'étape en TITRE_CARTE (20 px) ; sous-titre de fiche en TEXTE_FORT et regroupé avec « Pourquoi cette étape ? ».
16. **Détail 375, titre du parcours dupliqué** (pa-abonne-en-cours-375-1) : « Parcours Machine à Café » en 24 px dans la carte d'en-tête, puis à nouveau 20 px dans la carte suivante, avec « Étape 3 sur 3 » deux fois (bouton de menu et carte). Correction : supprimer le titre et la ligne d'étape de la deuxième carte, garder la liste d'étapes.
17. **Détail 375, séparateur orphelin** (pa-visiteur-375-2) : « Parcours Machine à Café · » à la fin d'une ligne, « 3 semaines » à la suivante. Correction : `whitespace-nowrap` sur « · 3 semaines » ou mettre la durée sur sa propre ligne.
18. **Détail, imbrication** (pa-visiteur-375-3) : carte d'étape, carte de quiz, cartes d'options : trois bordures empilées, texte à 16 px dans des cadres de 12 px de marge. Correction : retirer la bordure de la carte de quiz (fond seul).
19. **Détail, sidebar abonné/nouvel** : double barre blanche (étape et sous-étape actives) et survol souligné y compris sur le numéro « 2.2 » (pa-nouvel-abonne-1280-3/4). Correction : barre sur la sous-étape seule quand elle est active ; ne souligner que le libellé.

## Ce qui est tenu
Un seul plein par écran ; alignements de grille du hero et des cartes d'aperçu (cartes gauche et droite de même hauteur, y=449 à 775) ; cartes de liste Parcours (Programme et CTA alignés, y=562 à 610) ; en-tête et nav stables entre écrans ; progression « Fait » lisible ; 375 sans débordement.

NOTE GLOBALE : 8/10 (minimum des pages). Verdict : sous la barre de 9.
