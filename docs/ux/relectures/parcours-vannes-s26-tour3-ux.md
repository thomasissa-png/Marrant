# Relecture UX à l'aveugle, Parcours et Vannes, s26 tour 3 (interrupteur ouvert)

Périmètre : `/parcours`, `/parcours/repartie`, `/vannes`, 4 comptes, 375/768/1280/1456/1920 (ouvert : 375, 1280, 1920 de chaque compte, plus la page d'un parcours en visiteur, en-cours et nouvel). Décisions de Thomas (titre blanc, un seul aplat, cartes à hauteur égale, éléments reportés, textes validés) non notées. Vide de fin de carte/colonne toléré, faute dure = chiffrable seulement.

## Gate typographique (citée, `TAILLES-*.md`)
| Page | Tailles par écran | Combinaisons | Verdict |
|---|---|---|---|
| Parcours (tous comptes, 375 à 1920) | 4 (30 ou 24, 20, 16, 14) | 5 à 6 | PASS (plafonds 4 / 6 atteints, pas dépassés) |
| Parcours Répartie | 3 à 4 | 4 à 6 | PASS |
| Vannes | 3 (30 ou 24, 16, 14) | 4 | PASS, marge confortable |

Aplat violet : Parcours visiteur/gratuit = bouton Premium de l'en-tête seul, « Tester l'étape 1 » en contour ; Parcours abonné = « Reprendre » (nouvel : « Commencer l'étape 1 ») seul, pas de Premium en en-tête ; Vannes visiteur = Premium de l'en-tête seul, mur de fin en contour ; Vannes abonné = aucun au premier écran (page courante de la pagination, seul aplat de son écran). Aucun second aplat constaté.

## Parcours (`/parcours`)

Constats (captures 1280, 375) :
- Visiteur/gratuit 1280 : hero 8/4 (H1 + chapô à gauche, quiz compact à droite), cartes 6/6 de hauteur égale, dernière carte (Boulot) en pleine largeur 7/5, Explore aussi 4/4/4, FAQ 4/8. Contenu pleine coque, aucun bloc centré seul. Conforme à la spec.
- Abonné 1280 : « Tes 4 premières semaines » en tête avec LE plein (« Reprendre ») dans la colonne 8, « Ton cap » collant dans la colonne 4, cartes en une colonne, barre 2/3 et 2/4 sur les cartes commencées. Nouvel abonné : « Étape conseillée : Répartie / Commencer l'étape 1 » en plein : jamais une page morte.
- 375 : H1, chapô, carte 1 démarre vers y = 440 ; abonné : étape à reprendre puis Ton cap compact.

Notes UX :
1. Prospect, envie en 3 s : 9/10. Contenu réel et lisible, une seule offre (en-tête), quiz visible au premier écran. Défaut : à 1280x900 le bouton « Tester l'étape 1 » des deux premières cartes tombe vers y = 870 (Programme) et 935 (bouton), donc sous le pli ; zone vide à gauche sous le chapô (environ 760 x 215 px, fin de colonne, tolérée).
2. Abonné, clarté : 9/10. L'étape à reprendre (nom, étape 3 sur 3, consigne, plein) est dans l'écran. Défaut : la barre n/total est placée sous le témoignage, pas en tête de carte comme le spec design §1.3 (point 1), donc la progression n'est pas lue avant le texte.
3. Abonné, envie de continuer : 9/10. Barre, cap 2 sur 5, série, XP. Rail seul dans sa colonne ensuite (fin de colonne, collant, toléré).
4. Nouvel abonné : 9/10. Étape conseillée + plein + cap 1 sur 5 + série qui démarre. Défaut : les cinq cartes affichent toutes « Commencer ce parcours » sans repère sur celle qui est conseillée.
5. Accessibilité et cohérence entre comptes : 9/10. Mêmes tailles et mêmes grilles pour les 4 comptes, aucun débordement à 375. Cibles : `Programme` `min-h-11` et boutons `min-h-12` au spec.

### Parcours d'un parcours (`/parcours/repartie`)
- Visiteur 1280 : étape 1 complète en 8 colonnes, rail 4 réduit à « Étape 1 gratuite, la suite avec Premium » (rail visiteur reporté), étapes 2+ avec cadenas nu, offre d'étape 2 en contour en fin d'étape 1. Aplat unique = en-tête.
- Abonné en-cours 1280 : rail 4 collant avec « 2 sur 4 étapes », barre, Fait / Voir, « Reprendre » en plein sur l'étape 3 ; étapes 1 et 2 repliées avec coche, étape 3 dépliée avec sommaire 3.1 à 3.5. Je sais quoi faire maintenant : oui.
- Nouvel 375 : rail avec « Commencer » juste après le chapô et « Pour qui ? ».
- Défaut mesuré à la capture : à 375, le bouton « Commencer » du rail nouvel abonné est vers y = 830 à 850 (estimation sur capture réduite, à re-mesurer), c'est-à-dire à la limite sous le pli de 812.

Note page d'un parcours : 9/10.

### Corrections codables (Parcours)
- Carte abonné : `lg:grid lg:grid-cols-12`, infos `lg:col-span-7`, barre + Programme `lg:col-span-5` ; barre `{n}/{total} étapes` placée avant la méta (spec design §1.3, points 1 et 2). `apps/web/src/app/(public)/parcours/(liste)/parcours-content.tsx` et `components/espace/parcours/parcours-espace.tsx`. Aucun texte neuf. Ferait 10 : lignes de 95 caractères réduites à 60, progression lue avant le texte.
- Cartes de l'abonné sans parcours entamé : la carte du parcours conseillé en premier par `order-first` (DOM inchangé), même libellé. Ferait 10 au critère 4.
- 375 nouvel, `/parcours/{slug}` : rail avant « Pour qui ? » par `max-lg:order-*` (le sommaire est déjà un bloc compact) pour remonter « Commencer » sous le pli ; 1280 visiteur : visuellement placer le bouton de carte avant le `<details>` Programme (`order`, DOM inchangé) pour qu'il passe au-dessus de y = 900.

## Vannes (`/vannes`)

Constats :
- Visiteur 1280 : H1, chapô, rangée de catégories (« Toutes » active), 3 cartes par rangée de hauteur égale, 10 gratuites sur 9 catégories, mur de fin 8/4 avec un contour, FAQ 4/8, bloc SEO 3 colonnes, « La suite » 4/4/4. Conforme.
- Abonné/nouvel 1280 et 1920 : même hero sans carte d'offre, 12 vannes en 4 rangées 4/4/4, alternance vérifiée sur la capture (9 catégories distinctes, jamais deux consécutives identiques : Boulot, Vie quotidienne, Soirées, École, Autodérision, Famille, Absurde, Couple, Digital, Jeux de mots, Boulot, Vie quotidienne), pagination 1 à 8, FAQ et bloc SEO conservés.
- 375 : H1, chapô, rangée à défilement horizontal, 1re vanne entière avant y = 812 (carte de y = 413 à 548 environ). Respecte le critère 7 du spec.

Notes UX :
1. Prospect : 9/10. Valeur lisible (vannes réelles, chute à révéler), offre en en-tête, mur de fin sans plein. Défaut : la 10e vanne reste seule en tiers de rangée (2 colonnes vides, environ 860 x 245 px à 1280), alors que le spec design §3.1 prévoit `lg:col-span-3` ; vide hors milieu de bloc, donc piste et non faute.
2. Abonné, clarté : 9/10. Première chute à révéler au premier écran, aucun plein ni compteur inventé.
3. Abonné, envie de continuer : 9/10 (favoris, 8 pages numérotées, « Toutes » alternée). Page de référence : pas de progression à montrer.
4. Nouvel abonné : 9/10, page identique, jamais vide.
5. Accessibilité et cohérence : 9/10. Pagination : cibles `h-11` sur mobile et tactile (`list-pagination.tsx` : `COARSE`, `MOBILE_CELL`), `h-9` en pointeur fin (arbitrage s20, au-dessus des 24 px de WCAG 2.2 AA). Rangée : pastilles `min-h-11`.

### Corrections codables (Vannes)
- Dernière vanne seule : soit `lg:[&>:last-child:nth-child(3n+1)]:col-span-3` (spec), soit mieux, mur de fin dans la même grille sur les 2 colonnes libres (`lg:col-span-2`), sans texte neuf. `apps/web/src/app/(public)/vannes/vannes-list.tsx`. Ferait 10 : plus de tiers de rangée vide.

## Pistes (3 max par page, aucune n'ajoute de texte ni de taille)
Parcours : 1) carte abonné 7/5 et barre en tête ; 2) parcours conseillé en premier (`order-first`) pour abonné sans parcours entamé, rail avant « Pour qui ? » à 375 ; 3) boutons de carte avant `Programme` à 1280 pour passer au-dessus du pli.
Vannes : 1) mur de fin dans la grille sur les colonnes libres, ou `col-span-3` ; 2) aucune autre piste nécessaire, la page est au niveau.

## Fautes dures
Aucune : gate PASS partout (3 à 4 tailles, 4 à 6 combinaisons), un seul aplat par écran, aucun vide mi-bloc chiffrable, aucun texte hors échelle, aucun débordement visible à 375.

NOTE GLOBALE Parcours : 9/10
NOTE GLOBALE Vannes : 9/10

Fautes dures :
(aucune)
