# Relecture UX à l'aveugle s25, section 1 : en-tête et menu mobile (tour 10)

Méthode : spec v5 (`docs/ux/navigation-universelle-s24.md`), préférences fondateur 191 à 194, code des 7 fichiers demandés, captures réelles `docs/captures/s25/entete-tour-10/` (4 comptes, largeurs 290 à 1920, menu, menu court, cloche, compte, focus, recherche ouverte) comparées à l'étalon `docs/captures/s25/etalon-accueil/`. Aucune relecture antérieure lue. Non retenus : position variable de la recherche à 176 px (décision du 15/11), débordement de `/profil` à 290 px (hors périmètre), pages réservées à l'abonné renvoyées vers l'offre (comportement antérieur : les captures gratuit de `/mon-espace` montrent bien l'offre, bouton Premium masqué car l'adresse devient `/abonnement`).

Limite de preuve : les séries de focus du menu s'arrêtent à 12 Tab (Vannes) ; Mon profil et Déconnexion sont vus par `focus-retour-menu-03/04` (Maj+Tab). Le défilement de la page sous le voile et l'ouverture de la cloche menu ouvert ne sont pas capturés : pas de note retenue dessus.

## Constats vérifiés (conformes)

- Barres par compte et par largeur conformes au §1 : abonné « Mon espace » + 5 liens (`en-cours-vannes-1280`), sans « La lettre » ; gratuit et visiteur avec « La lettre » ; loupe de 440 à 1279 ; icône compte dès 768 ; Connexion dès 520 ; « Premium » seul à 600 et à 1024, libellé complet à 640, 641 et dès 1280 ; 320 à 439 : logo, cloche, Menu (abonné) ; logo, Premium, Menu (gratuit, visiteur). Aucun débordement de 290 à 1920 (`visiteur-vannes-641`, `en-cours-vannes-290`, `visiteur-vannes-1024`).
- Menu : ordre unique respecté (`en-cours-menu-mon-espace-375`), rail `ml-3 border-l`, séparateur avant Parcours, ligne allumée = fond + filet violet 2 px + semi-gras (lisible sans la teinte), `aria-current`. 768 à 1023 : intitulé non cliquable (`en-cours-menu-mon-espace-768`), rien d'allumé en barre pour les liens du site. 568 px de haut : les 8 entrées et « Carnet » (y 507 à 529) sans défilement à 320 et 375 (`en-cours-menu-court-320`, `-375`, `nouvel-menu-court-320`), indice de suite visible (Parcours estompé), absent quand tout tient (`gratuit-menu-court-375`).
- Ligne allumée sous le pli amenée dans la vue (`en-cours-menu-profil-375`, `nouvel-menu-profil-290` : défilement de 8 px, ligne entière visible).
- Focus : anneau violet 2 px sur tous les contrôles, ordre logique logo, cloche, Menu, puis lignes (`en-cours-focus-dans-menu-375-01` à `-12`), focus enfermé : Maj+Tab depuis le logo mène à Déconnexion (`focus-retour-menu-03`), Tab revient au logo (code `enfermerFocus`), Échap rend le focus à Menu. Compte : `-00` ligne 1 allumée dès l'ouverture, flèches suivantes (`gratuit-focus-dans-compte-768-03`). Cloche : focus dans le panneau, « Fermer » cerclé (`en-cours-focus-dans-cloche-1280-03`).
- Cloche pleine, vide (`nouvel-cloche-vide-1280`, `-290`), compte (`gratuit-compte-profil-768` : « Mon profil » allumé, icône soulignée) cohérents avec l'accueil (filet dégradé, cartes arrondies).
- Cibles : barre 44 px (`h-11`), lignes 44 px, puces de suggestion 44 px (`PUCE_MENU`), Fermer 44 px, logo `min-h-11`.
- Contrastes calculés (thème) : `text-secondary` #B3B3B3 sur élevé #2A2A2A 6,85:1 ; `accent-link` #A78BFA sur page 7,14, sur élevé 5,27 ; violet du soulignement #8B5CF6 sur page 4,59 (non-texte, seuil 3) ; blanc sur bouton `accent-secondary-hover` #7C3AED 5,7:1 ; contour de champ `border-input` #707070 sur page #0D0D0D 3,92:1 (calcul refait : 0,162 et 0,0040 de luminance, (0,212)/(0,054)) ; puce active `accent-link` sur #2A2535 environ 5,4:1.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité du rendu à la spec v5 | 10/10 |
| 2 | Orientation | 10/10 |
| 3 | Menu mobile | 10/10 |
| 4 | Cloche, compte, suggestions | 8/10 |
| 5 | Charge cognitive et cohérence | 9/10 |
| 6 | Largeurs extrêmes et plages | 10/10 |
| 7 | Accessibilité visible | 8/10 |

### 1, 2, 3, 6 : 10/10
Rien à reprocher face aux captures listées ci-dessus. Orientation : état actif visible dans la barre (≥ 768 px) et le menu, parent allumé sur les pages A (`en-cours-menu-situation-768` : « Quoi répondre » allumé, « Mon espace » allumé en barre), indice de suite présent. L'absence de point sur Menu est écartée par la spec.

### 4. Cloche, compte et liste de suggestions : 8/10

**FAUTE DURE 4-A : en barre, la liste de suggestions et le Tab.**
- Captures : `gratuit-focus-08-1280` (focus sur le champ, liste ouverte dès le focus) puis `gratuit-focus-09-1280` et `en-cours-focus-09-1280` (le Tab suivant est dans la puce « timing »). La série « 9 contrôles » s'arrête donc sur une puce : logo, liens, champ, puce ; Premium et le compte sont repoussés derrière 6 puces.
- Cause (`search-bar.tsx`) : `onFocus` ouvre la liste et `onBlur` ne la ferme que si `dansMenu` ; les puces sont des `<button role="option">` tabulables alors que la navigation est déjà faite par `aria-activedescendant` (flèches). Le correctif « n'ouvre pas au focus, referme à la sortie » du tour 6 n'a été posé que pour le menu, pas pour la barre (`enTete`).
- Correction codable : `const compact = dansMenu || enTete;` puis utiliser `compact` à la place de `dansMenu` dans `onFocus` (ne pas ouvrir), `onBlur` (fermer quand le focus sort du composant), `onChange` et `garderFocus` ; ajouter `tabIndex={-1}` aux puces et lignes `role="option"` (suggestions, résultats, « Voir {type} » exclus car ce sont des boutons de navigation : les laisser tabulables seulement quand la liste est ouverte par la frappe).
- Ce qui ferait 10 : Tab depuis le champ va à Premium (ou au compte) sans traverser de puce, la liste se ferme à la sortie, flèche bas l'ouvre et Entrée choisit.

**FAUTE 4-B : largeur de la liste en barre.** `en-cours-recherche-ouverte-1280`, `visiteur-recherche-ouverte-1280`, `gratuit-recherche-ouverte-1280` : la liste hérite des 176 px du champ ; les 6 puces tombent une par ligne, le panneau fait environ 290 px de haut et masque le titre et la rangée de catégories, alors qu'à 375 et 768 les mêmes puces tiennent sur 2 lignes (`en-cours-recherche-ouverte-375`, `-768`). La décision du 15/11 fixe la largeur du CHAMP, pas celle de la liste. Correction : en variante `enTete` du bloc `Suggestions`, `w-72 max-w-[calc(100vw-2rem)] right-0 left-auto` (ou `xl:w-72 xl:left-auto xl:right-0`) ; le champ garde 176 px, le bord droit de la liste s'aligne sur celui du champ. Ce qui ferait 10 : à 1280 px, 2 lignes de puces, hauteur proche de celle du menu mobile (environ 140 px). Les résultats groupés (`showResults`, `showNoResults`) sont à contrôler avec la même largeur (non capturés).

Cloche et compte : sans défaut visible (positions, ancrage 8 px, vide, 290 px, focus).

### 5. Charge cognitive et cohérence : 9/10
- Une même recherche se comporte autrement selon l'instance : la barre ouvre ses suggestions au focus et piège le Tab, le menu non (`search-bar.tsx`, `dansMenu` contre `enTete`) ; la liste est en 6 lignes en barre, 2 lignes ailleurs. Même correction que 4-A et 4-B ; ce qui ferait 10 : un seul comportement pour les trois instances. Piste, pas faute.
- Hors note : barre et menu restent proches de l'étalon (`visiteur-accueil-1280` contre l'étalon : même grammaire, logo, liens, champ, Connexion, Premium).

### 7. Accessibilité visible : 8/10
- Retenu : FAUTE DURE 4-A (ordre de tabulation et liste qui reste ouverte quand le focus sort, WCAG 2.4.3 et 3.2.1 dans l'esprit) ; mêmes captures et mêmes corrections.
- Piste (ne retient pas la note) : la puce active des suggestions (`bg-accent-primary/10 text-accent-link`) ne se distingue des autres que par la teinte et un fond de 5,4:1 (`en-cours-recherche-ouverte-375`) ; ajouter un anneau intérieur de 2 px `ring-inset ring-accent-link` quand `activeIndex === i` rend l'état lisible sans la teinte.
- Piste : `aria-controls="search-results-listbox"` et les `id` `search-item-N` sont communs aux trois instances de `SearchBar` montées en même temps dans le DOM (barre masquée, `#mobile-search`, menu) ; suffixer par `useId()`.

## Pistes écartées ou non retenues
- Position variable de la recherche (décision 15/11), `Mon espace` répété en barre et en intitulé de 768 à 1023 (spec §1), absence de point sur Menu (spec), bouton Premium masqué dans le menu gratuit sur `/mon-espace` (adresse devenue `/abonnement`), débordement `/profil` à 290.

## Verdict
Aucune faute sur la spec v5 ni sur le menu mobile. Une faute dure et une faute de rendu, toutes deux dans `search-bar.tsx` en variante barre ; corrections courtes (3 lignes de logique, 1 classe de largeur). Après correction et nouvelle capture `*-recherche-ouverte-1280` plus un Tab depuis le champ : 10/10 attendu sur 4, 5 et 7.

NOTE GLOBALE : 8/10
