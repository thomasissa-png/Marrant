# Relecture UX à l'aveugle, espace client s25, section 1 : en-tête et menu mobile (tour 9)

Brief compris : relecture UX seule, sans lire de relecture antérieure, des captures `docs/captures/s25/entete-tour-9/` face à la spec v5 (`docs/ux/navigation-universelle-s24.md`), à l'étalon accueil et au code.
Périmètre : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `search-bar.tsx`, `cloche.tsx`, `cloche-lignes.tsx`, `espace-navigation.ts`, `tailwind.config.ts`, `panneau-eleve.ts`, `input.tsx`, `button.tsx`, `globals.css`.

## Ce qui a été vu

- Étalon : accueil visiteur 375 et 1280 (aperçu réduit), 1920 (aperçu réduit).
- Barre : les 4 comptes, 320 à 1920 (visiteur 320, 375, 440, 520, 600, 640, 641, 1024, 1920 ; gratuit 375, 520, 1024 ; abonné 320, 600, 1024, 1280, 1920).
- Menu mobile : visiteur, gratuit, en-cours, nouvel, à 320, 375, 440, 520, 600, 641, 768 (accueil, mon-espace, situation, vannes, profil).
- `menu-court` : en-cours 320 et 375, gratuit 375, nouvel 320.
- Cloche : pleine (768, 1280, 375 et 320) et vide (375, 1280).
- Compte : gratuit 768 et 1280, en-cours 768 et 1920 (sur /vannes et /profil).
- Focus : barre en-cours 768 et 1280 (01, 02, 04, 06), visiteur 1280 (02), menu en-cours 375 `-01` à `-12` en entier, menu gratuit 375 (12), cloche 375 (01, 03), compte 768 (00, 01, 03) et 1280 (00, 02, 03), `retour-menu` en-cours 375 `-01` à `-04` et gratuit (03).
- Le visiteur sur /mon-espace et /profil est renvoyé à la connexion : normal, non noté. Les `ÉCHEC` de l'INDEX pour le visiteur sont le même cas.
- Non vu en capture : le panneau de recherche ouvert (loupe, 440 à 1279), les suggestions et résultats de recherche, la cloche ouverte quand le menu est ouvert. Ces points sont lus dans le code seulement.

## Contrastes calculés depuis le thème (WCAG, luminance relative)

| Paire | Ratio | Verdict |
|---|---|---|
| `text-secondary` #B3B3B3 sur page #0D0D0D / élevé #2A2A2A / survol #3A3A3A | 9,3 / 6,84 / 5,42 | AA |
| `accent-link` #A78BFA (lien actif, anneau) sur page / carte / élevé / survol | 7,14 / 6,05 / 5,27 / 4,17 | texte AA sur page, carte, élevé ; anneau (3:1) AA partout |
| `text-muted` #9A9A9A sur page / élevé | 6,9 / 5,1 | AA |
| Blanc sur bouton d'offre #7C3AED | 5,7 | AA |
| Soulignement actif `accent-primary` #8B5CF6 sur page | 4,59 | AA (3:1 requis) |
| Bordure du champ de recherche `border` #2A2A2A sur page #0D0D0D | 1,36 | sous 3:1 |
| Fond du champ `background-light` #1A1A1A sur page | 1,12 | sous 3:1 |
| Jeton `border-input` #707070 sur page (existe, non utilisé ici) | 3,92 | AA |

Le logo (dégradé #A78BFA vers #7C3AED, 3,4:1 à l'extrémité) est un logotype : exempté de 1.4.3.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité du rendu à la spec v5 | 10/10 |
| 2 | Orientation | 10/10 |
| 3 | Menu mobile | 9/10 |
| 4 | Cloche et compte | 10/10 |
| 5 | Charge cognitive et cohérence entre comptes et pages | 10/10 |
| 6 | Largeurs extrêmes, 440 à 767 et 1024 à 1279 | 10/10 |
| 7 | Accessibilité visible | 9/10 |

## 1. Conformité à la spec : 10/10

Vérifié point par point, aucun écart :
- Barre : abonné logo (vers /mon-espace), Mon espace, 5 liens, recherche 176 px, cloche avec point violet, compte (Mon profil, Déconnexion) ; gratuit : 6 liens dont La lettre, Premium, compte avec Favoris ; visiteur : Connexion, Premium. En-tête de 65 px, aucune seconde barre.
- 1024 à 1279 : loupe, libellé court « Premium ». 768 à 1023 : liens du site dans Menu, rien d'allumé en barre pour eux, Mon espace reste en barre (abonné), compte dès 768. 440 à 767 : loupe dès 440, Connexion dès 520, Premium seul sous 640 et complet à 640/641, cloche à toutes les largeurs, pas de compte en barre. 320 à 439 : abonné logo, cloche, Menu ; visiteur et gratuit logo, Premium, Menu ; loupe en tête du menu.
- Menu : un seul ordre ; Mon espace suivi de ses 8 entrées dans un bloc à rail, séparateur, 5 liens (+ La lettre), séparateur, actions. De 768 à 1023, l'intitulé « Mon espace » est non cliquable (`<p>`, vu à `en-cours-menu-mon-espace-768`), alors que le lien reste allumé en barre.
- État actif : fond élevé, texte `accent-link`, soulignement de 2 px en barre, filet gauche de 2 px et semi-gras en menu ; Quoi répondre allumé sur la fiche situation (parent) ; Mon espace seulement sur Aujourd'hui ; Vannes, Mon profil (menu et icône compte) allumés.
- Critère 5 de la spec : à 568 px de haut, les 8 entrées sont entières et visibles à 320 et 375 (`en-cours-menu-court-320`, `-375`, `nouvel-menu-court-320`), Carnet se termine vers 529 px. Le défilement automatique ne dépasse pas le plafond (16 px).
- Décisions de Thomas : recherche à 176 px, position variable (782, 826, 956 observées en cohérence avec le 15/11) : ne retient pas la note.

## 2. Orientation : 10/10

À chaque page, la bonne entrée est allumée par au moins deux signes (fond, soulignement ou filet, semi-gras, `aria-current`). Le parent s'allume sur les pages A (vu : Quoi répondre sur la situation). Les adresses hors tableau n'allument rien. Le logo de l'abonné mène à Aujourd'hui. Aucune page vue n'a un état trompeur. L'absence d'allumage des liens du site de 440 à 1023 px est la spec.

## 3. Menu mobile : 9/10

Bien : ordre unique, lignes de 44 px, voile lisible, croix, focus enfermé, retour au bouton Menu, deux touchers pour toute rubrique, Premium et Connexion toujours atteignables.

Défaut (piste, pas faute dure) : à 375 x 812, sur /profil, l'ouverture fait défiler le menu de 8 px pour amener la ligne « Mon profil » allumée dans la vue. Elle se retrouve collée au bord bas de l'écran (ligne de 767 à 811 px sur 812) et Déconnexion est entièrement cachée, sans aucun indice qu'il y a une suite (`en-cours-menu-profil-375.png`, `nouvel-menu-profil-375.png`). Sur /mon-espace au même format, la ligne Mon profil est coupée en bas, ce qui sert d'indice ; ici le menu a l'air complet. Cause : dans `menu-mobile-universel.tsx`, `cible = defilement + MARGE_BASSE <= plafond ? defilement + MARGE_BASSE : defilement` retombe sur le défilement minimal quand 8 + 16 dépasse le plafond de 16.
Correction codable : `const cible = Math.min(defilement + MARGE_BASSE, plafond);` (le plafond de 16 px protège toujours « Mon espace »). La ligne allumée reste entière, avec 8 px d'air et 8 px de Déconnexion visibles dessous : l'indice de suite est rendu.
Ce qui ferait 10 : cette correction, vérifiée à 375 x 812 sur /profil pour gratuit et abonné (capture avec une amorce de Déconnexion visible).

## 4. Cloche et compte : 10/10

- Cloche : nom accessible juste (réponses non lues), point violet réservé à la cloche, absent pour le nouvel abonné et dans le cas vide ; panneau à 8 px sous le filet, bord droit sur la marge de la coque, pleine largeur de coque sous 768 (aucun débordement à 320), « Fermer » 44 px, lignes 44 px avec chevron, textes vide et groupes lisibles (6,8:1).
- Focus de la cloche : à l'ouverture le focus entre dans le panneau, Tab suit Une question, Le carnet du mois, Fermer, puis reboucle (Radix Dialog) ; Échap et retour au bouton garantis par Radix.
- Compte : trois entrées pour le gratuit (Favoris, Mon profil, Déconnexion), deux pour l'abonné ; Entrée met le focus sur la première ligne, les flèches avancent, anneau 2 px dans la ligne, aucune ligne coupée ; ligne en cours avec filet violet et semi-gras ; icône du compte allumée sur /profil (soulignement), lisible sans la teinte.

## 5. Charge cognitive et cohérence : 10/10

Même grammaire à tous les comptes : même hauteur, même logo, même ordre, mêmes états, mêmes anneaux. Le menu abonné compte 15 lignes mais deux niveaux nets (parent semi-gras, rail, séparateurs). Pas de doublon de lien hors logo. Cohérent avec l'étalon accueil (même en-tête, même centrage 1920, mêmes marges).

## 6. Largeurs extrêmes, 440 à 767 et 1024 à 1279 : 10/10

Aucun libellé coupé ni débordement vu à 320, 375, 440, 520, 600, 640, 641, 768, 1024, 1280, 1920. Les transitions de 639 à 640 (« Premium » vers libellé complet) et de 519 à 520 (Connexion) tiennent avec de l'air. À 320, logo en `text-sm` et bouton Premium tiennent sans coupure. À 1024, les trois comptes tiennent avec la loupe.

## 7. Accessibilité visible : 9/10

Bien : cibles de 44 px (logo, liens, loupe, cloche, compte, Menu, lignes du menu, lignes de cloche et de compte, champ de recherche à `h-11` dans la barre, le panneau mobile et le menu) ; anneau unique `accent-link` de 2 px, visible partout (barre, 12 étapes du menu, cloche, compte, croix) ; focus enfermé : Maj+Tab depuis le logo saute à la dernière ligne du menu, Tab revient au logo (vu `retour-menu` 01 à 04 : cloche, logo, Déconnexion, Mon profil) ; ordre logique (logo, liens, recherche, cloche, compte, Menu ; puis recherche, Mon espace, 8 entrées, liens, actions) ; état actif lisible sans la teinte ; contrastes AA (tableau).

Défaut 1 (piste forte, à trancher) : bordure du champ de recherche. `Input` donne `border-border` #2A2A2A sur fond #0D0D0D : 1,36:1, et fond de champ 1,12:1 (visible sur toutes les captures de barre et de menu, par exemple `en-cours-mon-espace-1280.png`). WCAG 1.4.11 demande 3:1 pour le contour d'un champ. Le champ reste identifiable par la loupe et le placeholder (6,9:1), d'où « piste » et non « faute dure », mais le thème possède déjà `border-input` #707070 (3,92:1) créé pour cela (commentaire s22).
Correction codable : dans `en-tete-universel.tsx`, `menu-mobile-universel.tsx` (SearchBar de l'en-tête uniquement, via la constante CHAMP de `panneau-eleve.ts`) ajouter `[&_input]:border-border-input`; le focus `[&_input:focus]:border-accent-link` existant reprend la main. L'accueil gardant le même en-tête, l'étalon reste cohérent. Hors en-tête, `Input` ne change pas.

Défaut 2 (piste, lu dans le code, non capturé) : dans `search-bar.tsx`, hors `dansMenu`, les puces de suggestion (`py-1`, environ 30 px) et le bouton « Voir vannes » du titre de groupe (`text-xs`, 16 px de haut) sont sous les 44 px demandés ; le second est même sous 24 px (WCAG 2.5.8). Seules les puces du menu portent `PUCE_MENU`.
Correction codable : appliquer `min-h-11 inline-flex items-center` aux puces à toutes les largeurs et `min-h-11` au bouton « Voir {type} » (ligne d'en-tête de groupe en `items-center`).

Ce qui ferait 10 : les deux corrections, avec une capture de la liste de suggestions ouverte à 1280 et dans le panneau mobile (à 768).

## Pistes sans effet sur la note (non retenues)

- `aria-label="Menu"` reste le même croix affichée (`aria-expanded` porte l'état) ; « Fermer le menu » serait plus explicite (texte à valider par Thomas).
- Défilement de la page derrière le voile non verrouillé (`overscroll-contain` limite l'effet).
- La cloche reste cliquable menu ouvert (vu dans le code, non capturé) : empilement acceptable.

## Verdict

Aucune faute dure. Rendu conforme à la spec v5 et à l'étalon sur les quatre comptes et toutes les largeurs vues. Restent trois points codables : l'indice de suite du menu sur /profil (critère 3), le contour du champ de recherche et les cibles de la liste de suggestions (critère 7).

NOTE GLOBALE : 9/10
