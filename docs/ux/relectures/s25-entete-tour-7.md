# Relecture UX à l'aveugle, s25, en-tête et menu mobile, tour 7

Périmètre : en-tête universel et menu mobile de l'espace client (spec `docs/ux/navigation-universelle-s24.md` v5). Étalon : accueil (`etalon-accueil/visiteur-accueil-{375,768,1280,1456,1920}.png`). Captures : `docs/captures/s25/entete-tour-7/`. Code : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `cloche.tsx`, thème `tailwind.config.ts`.

Hors note, par décision : recherche à 176 px et position variable selon le compte (founder-preferences l.194, accord écrit du 15/11) ; liens du site dans Menu de 768 à 1023 px, rien d'allumé en barre pour eux (spec) ; liens du site et actions du compte sous le pli du menu (critère 5).

Limites de ma preuve : `visiteur-menu-mon-espace/situation/profil` et `visiteur-menu-court-*` et `visiteur-focus-dans-menu-*` sont en échec dans l'INDEX (le visiteur est renvoyé à la connexion, normal) ; je n'ai pas vu de capture de la loupe ouverte entre 440 et 1279 px (champ déroulant sous la barre) ; je n'ai lu ni `search-bar.tsx` ni `cloche-lignes.tsx` en détail, seules leurs captures comptent.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité du rendu à la spec v5 | 10/10 |
| 2 | Orientation | 10/10 |
| 3 | Menu mobile | 10/10 |
| 4 | Cloche et compte | 10/10 |
| 5 | Charge cognitive et cohérence entre comptes et pages | 10/10 |
| 6 | Largeurs extrêmes, 440 à 767, 1024 à 1279 | 10/10 |
| 7 | Accessibilité visible | 9/10 |

## 1. Conformité à la spec v5 : 10/10

Vérifié sur capture, état par état :
- 1280 : visiteur (`visiteur-vannes-1280-bandeau`) logo, 6 liens, recherche 176 px, Connexion, « Premium · 1,99 €/mois » ; inscrit gratuit (`gratuit-vannes-1280-bandeau`) idem sans Connexion, avec icône compte ; abonné (`en-cours-mon-espace-1280-bandeau`) Mon espace + 5 liens, recherche, cloche à point violet, compte, pas de bouton d'offre, pas de « La lettre ». Conforme au tableau §1. Logo, premier lien et coque (x = 352 à 1920 px) identiques à l'accueil étalon (`visiteur-accueil-1920`).
- 1024 : loupe, bouton court « Premium », compte pour le gratuit (`gratuit-vannes-1024-bandeau`, `visiteur-vannes-1024-bandeau`).
- 768 : liens du site dans Menu ; abonné logo, Mon espace, loupe, cloche, compte, Menu (`en-cours-vannes-768-bandeau`) ; visiteur logo, loupe, Connexion, Menu (`visiteur-menu-accueil-768`) ; gratuit loupe, Premium, compte, Menu (`gratuit-compte-profil-768`).
- 640 / 641 : « Premium · 1,99 €/mois » complet, Connexion visiteur (`visiteur-vannes-640-bandeau`), aucun débordement. 600, 520 : « Premium » seul ; Connexion dès 520 (`visiteur-vannes-520-bandeau`), absente à 440 (`visiteur-vannes-440-bandeau`).
- 320 à 439 : abonné logo, cloche, Menu (`en-cours-cloche-320`) ; visiteur et gratuit logo, Premium court, Menu (`visiteur-accueil-320-bandeau`).
- Menu : un seul ordre (recherche sous 440 px, Mon espace + 8 entrées dans le bloc à filet, séparateur, liens du site, actions), intitulé non cliquable de 768 à 1023 (`en-cours-menu-mon-espace-768` : « Mon espace » blanc, sans filet gauche violet, non focalisé aux Tab, voir `en-cours-focus-dans-menu-768-01`). Aucun lien en double hors logo (Connexion et actions du compte retirés du menu quand ils sont en barre : `en-cours-menu-vannes-600` montre Mon profil et Déconnexion dans le menu à 600, le compte n'étant en barre qu'à partir de 768 : conforme).
- Allumage : Vannes sur /vannes (`en-cours-menu-vannes-375`), Mon profil sur /profil (`en-cours-menu-profil-375`), Quoi répondre sur une fiche situation (`nouvel-menu-situation-375`), Mon espace seulement sur Aujourd'hui, icône compte allumée sur /profil (`en-cours-compte-profil-1280`, `gratuit-compte-profil-768`).

Aucun écart.

## 2. Orientation : 10/10

Sur chaque capture, un seul élément est allumé (barre ou menu) et il correspond à la page : Vannes sur /vannes aux trois comptes, Mon espace sur Aujourd'hui, compte sur /profil. En barre : fond, texte violet et soulignement de 2 px (visibles sans la teinte). Dans le menu : filet gauche de 2 px, fond, semi-gras. Le logo de l'abonné mène à Aujourd'hui (code l.139). Le menu s'ouvre sans masquer la ligne allumée (`en-cours-menu-profil-375` : défilement de 8 px, dans la marge prévue). Rien n'est allumé sur l'accueil ni sur les pages hors tableau (`visiteur-menu-accueil-768`).

## 3. Menu mobile : 10/10

- 2 touchers (Menu, ligne) sans défilement du menu : `en-cours-menu-mon-espace-375` (812 px), `en-cours-menu-court-375`, `en-cours-menu-court-320`, `nouvel-menu-court-375` (568 px) montrent Mon espace et les 8 entrées, Carnet finit à ~529 px, « Parcours » dépasse en bas : l'indice de suite est visible. Mesuré sur le code : 65 + 16 + 52 + 44 + 352 + 1 = 530 px, cohérent.
- Ordre et hiérarchie : parent semi-gras blanc, entrées en `font-medium` gris dans le bloc à filet, séparateur, liens du site, séparateur, actions. Gratuit et visiteur (`gratuit-menu-court-375`, `visiteur-menu-vannes-320`) : liens, séparateur, bouton d'offre, actions, tout tient dans 568 px.
- Voile, croix, Échap ferment (code l.129 et l.102 à 111), focus rendu au bouton Menu. Panneau en `max-h-[calc(100dvh-4rem-1px)]` avec défilement interne.
- Tab dans l'ordre visuel : `en-cours-focus-dans-menu-375-01` à `-12` : recherche, Mon espace, 8 entrées dans l'ordre, Parcours, Vannes. À 768 : Quoi répondre en premier (intitulé non focalisé), puis les entrées, Parcours... Anneau violet intérieur, visible à chaque pas.

## 4. Cloche et compte : 10/10

- Cloche abonné : bouton 44 px, point violet seul signal (nom accessible porte le compte, `nomCloche`), panneau 8 px sous l'en-tête, bord droit sur la coque à 1280 (`en-cours-cloche-1280`), pleine largeur de coque sous 768 (`en-cours-cloche-320`), ombre et anneau de couche, filet dégradé en haut comme les cartes de l'accueil. État vide : « Rien de nouveau. Reviens quand tu veux. » (`nouvel-cloche-vide-1280`, `nouvel-cloche-vide-320`) lisible, sans trou. Bouton de la cloche en état ouvert (fond élevé) lisible.
- Focus dans la cloche (`en-cours-focus-dans-cloche-375-01` à `-03`) : à l'ouverture Radix place le focus sur « Fermer » (premier du DOM, premier visuellement), puis Une question, Le carnet du mois, retour à Fermer : boucle fermée, ordre = ordre visuel, anneau net.
- Compte : menu à 1280 (`gratuit-compte-1280` Favoris, Mon profil, Déconnexion ; `en-cours-compte-profil-1280` Mon profil, Déconnexion) ; ligne de la page courante allumée avec filet, semi-gras, violet (`gratuit-compte-profil-768`) ; icône soulignée tant qu'on est sur /profil.

## 5. Charge cognitive et cohérence : 10/10

Trois états lisibles de la même barre : mêmes ancrages (logo à x = 32, premier lien à x = 276 de 1024 à 1280 pour les trois comptes), mêmes styles de lien, un seul bouton plein (Premium) par état, aucune seconde barre, au plus 3 groupes d'actions à droite. Même vocabulaire et même ordre d'une page à l'autre (/, /vannes, /profil, /mon-espace). Le bouton d'offre s'efface du bandeau quand le menu est ouvert (il passe dans le menu) : déplacement voulu, sans doublon. La seule variation par compte est la position de la recherche à 1280 et plus, décidée par Thomas.

## 6. Largeurs : 10/10

320 (aucun libellé coupé, logo en 14 px, Premium court), 375, 440 (loupe en barre), 520 (Connexion), 600, 640 et 641 (libellé complet, ~12 px libres au cas le plus serré : visible sur `visiteur-vannes-640-bandeau`, pas de débordement), 768, 1024 (bouton court), 1280, 1456 et 1920 (coque `max-w-7xl` centrée, comme l'accueil étalon). Aucun saut visible entre 640 et 641, ni entre 1023 et 1024 sur les captures disponibles. 440 à 767 : cloche, loupe, Menu, bien espacés ; 1024 à 1279 : bouton court, loupe, compte, rien ne se chevauche.

## 7. Accessibilité visible : 9/10

Acquis :
- Cibles : liens de barre `h-11`, icônes `h-11 w-11`, Premium `h-11`, Connexion `h-11 min-w-[44px]`, lignes du menu 44 px, logo `min-h-11`.
- Focus visible partout : anneau violet 2 px sur le logo, Mon espace (`en-cours-focus-02-1280`), la cloche (`en-cours-focus-04-768`), les lignes du menu (anneau intérieur), les entrées de la cloche.
- Ordre de tabulation logique : barre dans l'ordre visuel (logo, liens, recherche, cloche, compte, Menu), menu dans l'ordre vertical, cloche Fermer puis lignes.
- État actif sans la teinte : soulignement 2 px en barre, filet gauche 2 px et semi-gras dans le menu et dans le menu du compte.
- Contrastes calculés depuis le thème : `accent-link` #A78BFA sur fond élevé #2A2A2A 5,3:1 (ligne allumée) ; sur carte #1F1F1F ~6:1 ; `text-secondary` #B3B3B3 sur #0D0D0D ~9,3:1, sur #2A2A2A ~6,9:1 ; blanc sur #2A2A2A 14:1 ; anneau `accent-primary` #8B5CF6 sur #0D0D0D 4,6:1 et sur #2A2A2A 3,4:1 (seuil non textuel 3:1 tenu) ; blanc sur le bouton violet ~5,7:1.

Défaut (piste, pas faute dure) : le focus enfermé du menu ouvert exclut les contrôles de l'en-tête qui restent visibles et cliquables au-dessus du voile (la croix, la cloche, le logo). `menu-mobile-universel.tsx` l.78 à 93 : le gestionnaire est sur `<nav>` et ne relève que ses descendants. Conséquence : après le premier Tab, Maj+Tab sur le premier élément du menu saute au dernier et ne mène jamais à la croix ; la croix et la cloche, bien visibles, ne sont atteignables ni par Tab ni par Maj+Tab tant que le menu est ouvert (seul Échap ferme). Constat sur les captures : `en-cours-focus-dans-menu-375-01` (focus sur la recherche, croix et cloche à l'écran) ; la série 01 à 12 ne repasse jamais par eux. Ce n'est pas un blocage (Échap ferme, 2.1.1 tenu), mais un contrôle visible hors du cycle.

Correction codable : poser le gestionnaire `onKeyDown` sur le `<header>` d'`en-tete-universel.tsx` quand `menuOuvert`, avec `e.currentTarget.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), [tabindex]")` filtrés visibles (même filtre `tabIndex >= 0` et `getClientRects().length > 0`) : premier = logo, dernier = dernière ligne du menu ; ordre du DOM conservé (logo, cloche, compte, croix, puis menu), la croix devient atteignable. Retirer `onKeyDown` du `<nav>` (même code, déplacé). Pour 10 : cette boucle étendue, et la capture d'un Maj+Tab depuis la recherche qui tombe sur la croix.

## Fautes dures : aucune. Pistes : 1 (critère 7).

NOTE GLOBALE : 9/10
