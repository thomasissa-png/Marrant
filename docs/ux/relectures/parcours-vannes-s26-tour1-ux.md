# Relecture UX à l'aveugle, Parcours et Vannes, tour 1 (s26), interrupteur ouvert

Méthode : brief v7, grille UX, barre 9/10 sans faute dure. Ouvert : visiteur, en-cours, nouvel (375, 1280, 1920 ; 1280 pour la page détail), gratuit lu via la gate (même rendu que visiteur). Les 1456 et 768 non ouverts un par un : jugés par la gate seulement. Le code n'a pas été lu (cibles 44 px = piste à vérifier, pas faute).

## Gate typographique (citée, TAILLES-*.md)
- /parcours : 4 tailles (30 ou 24, 20, 16, 14) sur les 4 comptes aux 2 largeurs ; combinaisons 5 à 6 (max 6 : visiteur et gratuit 768/1280/1920, en-cours et nouvel 768/1280/1920). Seuil (> 4 tailles, > 6 combinaisons) NON dépassé. PASS.
- /parcours/repartie : 3 tailles à 375, 4 à 1280 ; combinaisons 4 à 6. PASS.
- /vannes : 3 tailles, 4 combinaisons partout. PASS, la page la plus sobre.
- Aplats violets : un seul plein par écran (visiteur : bouton Premium de l'en-tête ; abonné : « Reprendre » / « Commencer l'étape 1 »). PASS. Non noté (décisions) : titre blanc, boutons « Tester l'étape 1 » en contour.

## PARCOURS (/parcours)

### Visiteur et gratuit (1280/1920)
Bien : hero 8/4 réel, H1 + chapô à gauche, quiz compact à droite, première carte à y ≈ 525 ; cartes 6/6 ; dernière carte (Boulot) en 7/5 avec « Programme » et bouton à droite ; « Explore aussi » 4/4/4 ; FAQ 4/8 ; contenu ≈ 1220 px à 1920, jamais un bloc centré seul. Cartes réduites à 4 niveaux, lisibles.
Défauts :
- **Vide au milieu des cartes** : à 1280 la carte Confiance laisse ≈ 105 px (≈ 64 px de capture x 1,64) entre le témoignage et « Programme » ; Machine à Café ≈ 34 px, Répartie ≈ 39 px. Cause : cartes étirées à hauteur égale avec le bloc Programme + bouton poussé en bas. Faute dure (> 32 px, milieu de carte). Correction : `parcours-content.tsx`, retirer `mt-auto` du bloc Programme + bouton (le mettre en `mt-4`) ; le vide passe en fin de carte (permis). Ce qui ferait 10 : plus aucun écart > 32 px entre deux blocs d'une carte.
- Premier écran 1280 (900 px) : aucun bouton « Tester l'étape 1 » visible (le premier est à y ≈ 935). L'envie repose sur le quiz et le bouton d'en-tête. Piste, pas faute : remonter la première carte de 40 px en réduisant l'espace hero-grille.
- 375 : H1, chapô, puis carte 1 : conforme, mais la carte fait ≈ 640 px de haut ; le bouton contour est à y ≈ 1150, loin. Piste : couper la description (hors textes, via `line-clamp` non, texte validé), donc rien à faire sans Thomas.

### Abonné (en-cours, nouvel)
Bien : rail 8/4 (Ton cap à droite), carte « étape à reprendre » avec le seul plein, barre n/total (2/3, 2/4) au-dessus des cartes commencées, boutons autres cartes en contour, quiz et FAQ 4/8, FAQ prix absente. Nouvel : « Étape conseillée Répartie / Commencer l'étape 1 » plein, cap 1 sur 5 : jamais une page morte.
Défauts :
- **Séparateur orphelin** : sur 4 cartes sur 5 (Répartie, Confiance, Storytelling, Boulot), à 1280 et 1920, la ligne de méta se coupe sur « … 20 min/semaine · » avec le « · » en bout de ligne et « 475 XP à gagner » seul dessous. Faute dure de finition (chiffrée : 4/5 cartes). Correction : `parcours-content.tsx`, méta en `flex flex-wrap gap-x-3` avec séparateurs en pseudo-élément `before:` du second item et suivants, ou `whitespace-nowrap` par item.
- Zone droite des cartes : contient seulement Programme + bouton (≈ 120 px vides dessous, fin de colonne, permis) ; sur les cartes non commencées, la zone 5 est très creuse. Piste : l'équilibrer (méta XP/durée déplacée en haut de la zone droite).
- Doublon d'information : « 325 XP à gagner » apparaît deux fois sur la carte Machine à Café (méta + sous la barre). Piste : une seule occurrence.
- Clarté : « Étape en cours Machine à Café, Étape 3 sur 3 » face à la barre « 2/3 étapes » : deux chiffres qui se lisent comme contradictoires. Piste : ne garder que l'un.
- Ordre : le calendrier « 4 premières semaines » (4 lignes, ≈ 260 px) passe avant le plein. 1280 : « Reprendre » à y ≈ 650 (visible). 375 : y ≈ 790 pour 812 de viewport, à la limite, avec en plus le bandeau « Nouveau cap » au-dessus. Piste : étape à reprendre avant le calendrier, calendrier replié (même contenu).
- « Tes bonus » absent du rail sur ces deux comptes (le rail ne contient que Ton cap) : rail court (≈ 90 px) face à une page de 4 600 px. Piste : rail sticky (`lg:sticky lg:top-24`) vérifié au code.

### Page d'un parcours (/parcours/repartie)
- Visiteur 1280 : étape 1 complète à gauche, rail de droite réduit à un encart « Étape 1 gratuite, la suite avec Premium » (≈ 40 px de haut) puis colonne vide sur ≈ 3 000 px. Pas de sommaire, pas de bouton d'offre en haut du rail (offre = bouton d'en-tête + « Passer à l'étape 2 · 1,99 €/mois » à y ≈ 2 740). Spec §1.4 non réalisée : « un élément manquant n'est pas une faute » (refonte par classes) : piste forte, c'est le point qui retient la note prospect. Piste : rail sticky avec sommaire des 4 étapes (cadenas 2 à 4) existant dans la page.
- Abonné 1280 : rail avec « 2 sur 4 étapes », barre, sommaire Fait/Voir, un seul plein « Reprendre » : très bon. Chapô et « Pour qui ? » relégués sous les étapes : acceptable pour un abonné.
- Cibles : lignes « Voir » du sommaire de ≈ 40 px de haut mesurées sur capture : à vérifier au code (piste 44 px).

### Notes Parcours (/10)
| Critère | Note | Pourquoi |
|---|---|---|
| UX1 prospect, envie en 3 s | 8 | Hero + quiz convaincants, offre en haut (en-tête), une seule offre ; aucun bouton de carte au premier écran ; détail sans rail d'offre |
| UX2 abonné, clarté | 8 | Plein unique net ; calendrier avant l'action, « 3 sur 3 » vs « 2/3 » |
| UX3 envie de continuer | 8 | Barres n/total, cap, série (« démarre à ta prochaine pratique ») ; rail pauvre |
| UX4 nouvel abonné | 9 | Étape conseillée + « Commencer l'étape 1 », cap 1/5 |
| UX5 accessibilité et cohérence | 8 | Cohérent entre comptes ; méta orphelin ; 44 px à confirmer |
| Gate typo | 10 | 4 tailles, 6 combinaisons max |

Plafond tenu par 2 fautes dures : pas de validation.

## VANNES (/vannes)

### Visiteur et gratuit
Bien : H1 + chapô à gauche, rangée de catégories « Toutes » active (flèche de défilement visible), grille 4/4/4 (3 colonnes) à 1280 et 1920, dernière carte (Jeux de mots) qui prend la rangée, 10 vannes gratuites sur 10 catégories distinctes, mur de fin 8/4 aligné à gauche (un seul bouton), FAQ 4/8, bloc « Pourquoi… » en 3 colonnes, « La suite » 4/4/4, aucune capitale. Gate la plus propre (3 tailles).
Défauts :
- **Vide au milieu des cartes** : la carte « Pour ta valise de départ… » (rangée 1, 1280) laisse ≈ 130 px entre le texte et « Révéler la chute » (87 px de capture à l'échelle 1,49) ; même défaut ≈ 97 px sur « Mon banquier… » (abonné, rangée 4). Cause : cartes étirées avec pied poussé en bas. Faute dure. Correction : `vannes-list.tsx`, retirer `justify-between` / `mt-auto` du pied de carte et mettre `items-start` sur la grille, ou pied en `mt-6`. Ce qui ferait 10 : aucune carte avec un écart > 32 px entre texte et action.
- Hero : à droite de H1 et chapô, 4 colonnes vides sur ≈ 130 px de haut (la carte d'offre de la spec §2.2 est absente). L'offre n'est présente qu'en en-tête, puis au mur à y ≈ 1 530 (1280). Piste (élément manquant, non faute) : placer le mur (texte et bouton existants) en tête de colonne droite du hero, sans texte neuf.
- Mur : filet violet haut, bouton cerclé violet et lien « Tester l'étape 1 de Répartie, gratuite » violet : trois marques violettes dans un bloc, hors plein ; piste : retirer le filet, garder le contour.
- Cibles : étoile et partage ≈ 28 px de côté sur capture ; à vérifier au code (zone cliquable 44 px), piste.

### Abonné (en-cours, nouvel)
Hero sur 12 colonnes à gauche, sans vide à droite : bon. Alternance des catégories respectée (12 premières : 10 distinctes, jamais deux consécutives identiques). Pagination 1 à 8 présente. Aucun plein : cohérent avec une page de référence. Rien n'indique au nouvel abonné ce qu'il peut faire de plus que le gratuit (favoris par étoile, seulement). Même rendu en-cours et nouvel : piste, ajouter un repère existant (compteur de favoris si la donnée existe, sinon rien : texte neuf = Thomas).

### Notes Vannes (/10)
| Critère | Note | Pourquoi |
|---|---|---|
| UX1 prospect, envie en 3 s | 7 | Geste « révéler la chute » immédiat, 10 catégories ; offre hors premier écran, hero droit vide |
| UX2 abonné, clarté | 9 | Quoi faire : toucher une vanne ; alternance et pagination |
| UX3 envie de continuer | 8 | Favoris et alternance ; pas de progression (donnée absente) |
| UX4 nouvel abonné | 8 | Page jamais morte, mais aucun repère propre |
| UX5 accessibilité et cohérence | 8 | Cohérent entre comptes ; 44 px à confirmer |
| Gate typo | 10 | 3 tailles, 4 combinaisons |

Plafond tenu par 1 faute dure.

---
NOTE GLOBALE Parcours : 7/10
NOTE GLOBALE Vannes : 7/10

Fautes dures :
1. Parcours : vide de 34 à 105 px au milieu des cartes (Confiance 105 px, Machine à Café 34 px, Répartie 39 px à 1280) : `apps/web/src/app/parcours/(liste)/parcours-content.tsx` (retirer `mt-auto` du bloc Programme + bouton).
2. Parcours abonné : séparateur « · » orphelin en bout de ligne de méta sur 4 cartes sur 5 : `parcours-content.tsx` (méta en `flex-wrap`, séparateur attaché à l'élément suivant).
3. Vannes : vide de 97 à 130 px entre texte et « Révéler la chute » au milieu des cartes courtes (rangées 1 et 4, 1280/1920) : `apps/web/src/app/vannes/vannes-list.tsx` (pied de carte sans `justify-between`, grille `items-start`).
