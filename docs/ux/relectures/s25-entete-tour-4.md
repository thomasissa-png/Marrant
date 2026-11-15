# Relecture UX à l'aveugle s25, en-tête et menu mobile (tour 4)

Relecteur : @ux, seul, sans lire de relecture antérieure. Référence : `docs/ux/navigation-universelle-s24.md` v5, `founder-preferences.md` l. 191 à 193, étalon `docs/captures/s25/etalon-accueil/`. Captures : `docs/captures/s25/entete-tour-4/`.

Périmètre réellement vu (Read) : étalon accueil 375 et 1280 ; menus ouverts en-cours 375 (mon-espace, vannes, profil, situation), 320 (mon-espace, vannes nouvel), 768 (accueil, vannes, profil) ; visiteur menu vannes 320 ; gratuit menu mon-espace 375 et profil 320 ; cloche ouverte en-cours 320, 375, 768, 1280 ; cloche vide nouvel 375 et 1280 ; cloche avec carnet seul nouvel 375 ; compte ouvert gratuit 1280, en-cours 768 et 1920 ; focus en-cours 375, 768, 1280 et visiteur 375, 1280 ; bandeaux 320, 440, 520, 640, 641, 768, 1024, 1280 pour plusieurs comptes. Non ouverts un à un : les autres combinaisons compte x largeur (même code, rendu identique selon les captures vues). Aucune capture à 568 px de hauteur : la tenue sans défilement à 568 est vérifiée par mesure sur capture (voir critère 3), pas par image.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité à la spec v5 | 10 |
| 2 | Orientation | 9 |
| 3 | Menu mobile | 9,5 |
| 4 | Cloche et compte | 10 |
| 5 | Charge cognitive et cohérence | 9,5 |
| 6 | Largeurs extrêmes, 440 à 767, 1024 à 1279 | 10 |
| 7 | Accessibilité visible | 9,5 |

## 1. Conformité à la spec v5 : 10/10

- Éléments par état et par largeur conformes au §1 : visiteur 320 (logo, Premium court, Menu), 520 (loupe, Connexion, Premium court, Menu), 640 et 641 (libellé complet « Premium · 1,99 €/mois »), 1024 (liens, loupe, Premium court, compte pour le gratuit), 1280 (champ de recherche, Connexion). Abonné : 320 et 375 logo, cloche, Menu ; 440 et 520 loupe ajoutée ; 768 « Mon espace », loupe, cloche, compte, Menu ; 1024 « Mon espace » plus 5 liens, sans « La lettre ». Gratuit 768 : compte dès 768, Premium complet.
- État actif : `/mon-espace` allume « Mon espace » (768 et 1280, fond élevé, texte violet, soulignement 2 px) ; `/vannes` allume Vannes (1024, 1280, 1920, abonné compris) ; `/profil` allume l'icône du compte (en-cours 1280, gratuit 768) ; accueil n'allume rien ; `/mon-espace/fiche/situation/*` allume « Quoi répondre » dans le menu abonné ; menu mobile : ligne Vannes, Mon profil, Mon espace allumées sur leur adresse.
- Intitulé « Mon espace » non cliquable de 768 à 1023 dans le menu : présent, `font-semibold` blanc (menu en-cours 768).
- Menu : ordre unique, séparateurs, actions par état (visiteur : offre, Connexion ; gratuit : Favoris, Mon profil, Déconnexion ; abonné : Mon profil, Déconnexion), bouton d'offre absent du menu sur `/abonnement` (gratuit mon-espace renvoyé là). Conforme.
- Pas de défaut.

## 2. Orientation : 9/10

Défaut (piste, pas faute dure) : sous 768 px, sur `/profil`, l'icône du compte n'est pas en barre (spec §1) ; le seul signe « tu es ici » est la ligne « Mon profil » du menu, qui est la dernière ligne visible à 812 px de haut (coupée à moitié sur `en-cours-menu-profil-375.png`, y 775 à 819 pour 812) et entièrement sous le pli à 568 px. Même chose de 768 à 1023 px sur `/vannes`, `/conseils` : aucun élément allumé en barre (`en-cours-vannes-768.png`), l'allumage n'existe que menu ouvert ; le fil d'Ariane de la page compense (« Accueil / Vannes »).
Correction codable (sans texte nouveau) : à l'ouverture du menu, faire défiler la ligne portant `aria-current` dans la vue (`scrollIntoView({ block: "nearest" })` dans un `useEffect` de `MenuMobileUniversel`). Ce qui ferait 10 : la ligne allumée toujours visible à l'ouverture, quelle que soit la hauteur de fenêtre.

## 3. Menu mobile : 9,5/10

- Deux touchers sans défilement pour les 8 rubriques : OK à 375 et à 320 (`en-cours-menu-mon-espace-375.png`, `-320.png` : Carnet occupe y 485 à 529, fenêtre de 812). Mesure : 65 + 16 + 52 + 44 + 352 + 1 = 530 px, conforme à la spec ; à 568 px de haut, 38 px libres. Cohérent avec la capture (bas de Carnet à 529).
- Ordre, hiérarchie (parent semi-gras, rail `ml-3`, entrées en gris, séparateur 1 px), ligne allumée (filet violet 2 px, fond, semi-gras : lisible sans la teinte) : conformes, texte qui ne bouge pas d'une ligne à l'autre.
- Défaut mineur, faute légère : la ligne allumée des 8 rubriques a les coins droits carrés (`en-cours-menu-situation-375.png`, « Quoi répondre » rectangle plein) alors que « Mon espace », « Vannes », « Mon profil » allumés ont des coins arrondis (`en-cours-menu-vannes-375.png`). Cause : `rounded-lg` absent de la classe des `<li><Link>` de `INDEX_ESPACE`, alors que `ALLUMEE` ne retire que le coin gauche (`rounded-l-none`). Correction : ajouter `rounded-r-lg` aux liens des 8 entrées. Ce qui ferait 10 : une seule forme de ligne allumée dans tout le menu.

## 4. Cloche et compte : 10/10

- Cloche : nom accessible au singulier, pluriel, « aucune » (`nomCloche`) ; point violet seulement avec réponses non lues (en-cours : point ; nouvel : pas de point, panneau avec « Le carnet du mois » seul, `nouvel-cloche-375.png`, conforme au choix « un fait, un signal ») ; état vide « Rien de nouveau. Reviens quand tu veux. » lisible et sans trou (`nouvel-cloche-vide-375.png`, `-1280.png`).
- État ouvert distinct de l'état actif : cloche et compte ouverts = fond élevé sans soulignement ; actif = fond plus soulignement violet de 2 px (`en-cours-compte-768.png` : icône ouverte sans filet ; `en-cours-profil-1280-bandeau.png` : icône active avec filet). Distinction lisible.
- Fermeture : Échap, clic dehors, « Fermer » de 44 px (cloche, Radix Dialog) ; Radix DropdownMenu pour le compte ; focus rendu au bouton ; menu mobile : Échap, croix, voile, focus rendu au bouton Menu (code).
- Panneaux alignés sur la marge de la coque (bord droit à 1248 à 1280, 744 à 768), filet dégradé, même finition que l'accueil. Pas de défaut.

## 5. Charge cognitive et cohérence : 9,5/10

- Un en-tête de 65 px, logo ancré à gauche au même x pour les 3 comptes, recherche au même x dès 1280, actions calées à droite. Au plus 4 à 5 contrôles actifs en barre à chaque largeur ; menu mobile en une colonne, un seul pas de 44 px. Cohérence entre comptes et pages : vannes, accueil, mon-espace, profil montrent le même bandeau d'un état donné (hors lien allumé).
- Défaut : le même que critère 3 (forme de la ligne allumée), seule incohérence relevée. Ce qui ferait 10 : la correction `rounded-r-lg`.
- Piste non retenue : à 1280, « Mon espace » en barre a le même poids que les liens du site (pas de séparation) : c'est la spec v5 (un seul lien, pas de seconde barre).

## 6. Largeurs extrêmes, 440 à 767, 1024 à 1279 : 10/10

Aucun libellé coupé ni débordement sur les captures vues : 320 (logo en `text-sm`, cloche, Menu), 440 et 520 (loupe, Connexion dès 520), 600, 640 et 641 (cas le plus serré, visiteur : logo, loupe, Connexion, bouton complet, Menu, sans chevauchement), 768, 1024 (Premium court), 1280, 1920 (en-tête contenu dans la coque, alignée sur la page). Bandeau menu ouvert : le bouton d'offre se retire de la barre (pas de vide). Pas de défaut.

## 7. Accessibilité visible : 9,5/10

Contrastes calculés depuis `tailwind.config.ts` (luminance relative WCAG) : `text-secondary` #B3B3B3 sur fond #0D0D0D 9,27:1, sur élevé #2A2A2A 6,85:1 ; `text-muted` #9A9A9A sur fond 6,9:1 ; `accent-link` #A78BFA sur fond 7,14:1, sur élevé 5,28:1 ; blanc sur le bouton d'offre (#7C3AED, `accent-secondary-hover`, `button.tsx` l. 12) 5,70:1 ; anneau de focus `accent-primary` #8B5CF6 sur fond 4,59:1, sur élevé 3,39:1 (≥ 3:1, 1.4.11) ; filet actif violet sur fond 4,59:1. Tous au niveau AA.
- Cibles : boutons Menu, loupe, cloche, compte 44 x 44 ; lignes du menu 44 ; « Connexion » `min-w-[44px] h-11` ; « Fermer » `h-11`. Vu sur captures (rangées de 44 px).
- Focus : anneau violet visible sur logo, liens de barre (actif compris), cloche, burger (`en-cours-focus-02-375.png`, `-04-768.png`, `-02-1280.png`, `-06-1280.png`, `visiteur-focus-03-375.png`) ; inset dans le menu mobile (code).
- État actif sans teinte : soulignement 2 px ou filet 2 px, fond, semi-gras. OK.
- Défaut (piste) : dans le menu du compte, la ligne « Mon profil » n'est pas marquée quand on est sur `/profil` : seul le bouton porte `aria-current` (`account-menu.tsx` l. 60), pas l'item. Correction : `aria-current="page"` sur le `<Link href="/profil">` (et `/favoris` pour le gratuit) quand `universel.actif`. Ce qui ferait 10 : l'item actif aussi annoncé.

## Faute dure / pistes

- Faute dure : aucune.
- Pistes : (a) ligne allumée amenée dans la vue à l'ouverture du menu (critère 2) ; (b) `rounded-r-lg` sur les 8 entrées (critères 3 et 5) ; (c) `aria-current` sur l'item actif du menu du compte (critère 7). Aucun texte nouveau proposé. Aucune piste écartée par la spec n'est comptée.

NOTE GLOBALE : 9/10
