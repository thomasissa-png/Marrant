# Relecture UX à l'aveugle, s25, en-tête et menu mobile, tour 8

Périmètre : en-tête universel et menu mobile de l'espace client (interrupteur ouvert), 4 comptes (visiteur, gratuit, en-cours, nouvel), 320 à 1920 px. Juge : le rendu (captures de `docs/captures/s25/entete-tour-8/`) face à la spec v5 (`docs/ux/navigation-universelle-s24.md`), à l'étalon (accueil, `docs/captures/s25/etalon-accueil/`) et à l'usage. Aucune relecture antérieure, aucun commit, aucun `REPLIT_ACTIONS.md` lu. Non rediscutés : les 10 [CHOIX UTILISATEUR] ROUVRE du §6, la recherche à 176 px en position variable (décision du 15/11), le plafond du critère 5 (rubriques de l'espace sans défilement dès 568 px, liens du site et actions du compte permis sous le pli), les liens du site dans Menu de 768 à 1023 px.

Captures ouvertes : étalon accueil 375 et 1280 ; menus mobiles (accueil, mon-espace, situation, vannes, profil) pour les 4 comptes à 320, 375, 768 (et 640, 520, 1920 par sondage) ; `menu-court` des 4 comptes à 320 et 375 ; cloche pleine (en-cours 320, 375, 768, 1280, 1920) et vide (nouvel 320, 768, 1280) ; menu du compte (`compte`, `compte-profil`, 768, 1024, 1280, 1920) ; barre à 320, 375, 440, 520, 600, 640, 641, 768, 1024, 1280, 1920 ; `focus-01 à 06` (375, 768, 1280) ; série `focus-dans-menu-375-01 à 12` (en-cours, relue 01 à 06 et 09 à 12) ; `focus-retour-menu-375-01 à 04` (en-cours, et 01 gratuit) ; `focus-dans-cloche-375` ; `focus-dans-compte` (768 et 1280). Les captures `visiteur-menu-*` de /mon-espace, situation, profil sont en échec dans l'INDEX (le visiteur est renvoyé à la connexion, normal) ; le visiteur est jugé sur accueil et vannes.

Contrastes calculés depuis `tailwind.config.ts` : `text-secondary` #B3B3B3 : 9,27:1 sur le fond #0D0D0D, 6,85:1 sur l'élevé #2A2A2A ; `accent-link` #A78BFA : 7,14:1 sur le fond, 5,27:1 sur l'élevé, 4,18:1 sur #3A3A3A ; filet `accent-primary` #8B5CF6 : 4,59:1 sur le fond, 3,39:1 sur l'élevé (au-dessus de 3:1, 1.4.11) ; `text-muted` #9A9A9A : 6,9:1 sur le fond. Tout est AA.

## Constats par critère

### 1. Conformité du rendu à la spec v5 : 10/10
- Tableau §1 respecté à 1280 : visiteur (liens + La lettre, loupe 176 px, Connexion, Premium · 1,99 €/mois, `visiteur-vannes-1280`), gratuit (idem sans Connexion, icône compte, `gratuit-vannes-1280`), abonné (Mon espace + 5 liens, cloche, compte, pas de bouton d'offre, `en-cours-vannes-1280`). Mêmes en-têtes que l'accueil étalon, 65 px, aucune seconde barre.
- Largeurs : 1024 (liens, loupe, Premium court, `gratuit-vannes-1024`) ; 768 (liens dans Menu, Mon espace en barre pour l'abonné, compte dès 768, `en-cours-focus-02-768`) ; 640 et 641 (libellé complet, Connexion dès 520, `visiteur-vannes-640`, `-641`) ; 440 (loupe, Premium seul, `visiteur-vannes-440`) ; 320 (abonné logo + cloche + Menu, `en-cours-vannes-320`).
- Menu mobile : ordre unique, Mon espace suivi des 8 entrées dans le rail, séparateur, liens, actions ; Connexion seulement sous 520 px ; hiérarchie à 768 (intitulé non cliquable, `en-cours-menu-vannes-768`). Ligne allumée conforme (Vannes sur /vannes, Quoi répondre sur la fiche situation, Mon profil sur /profil, Mon espace sur Aujourd'hui).
- Gratuit sur /mon-espace : la page rendue est l'offre (adresse /abonnement), donc bouton d'offre masqué par la règle « masqué sur /abonnement » (`gratuit-mon-espace-1280`, `gratuit-menu-mon-espace-375`). Conforme à la règle ; la redirection relève du §9 de la spec, hors périmètre de cette section.
- Cloche : panneau 8 px sous le filet, bord droit sur la marge, état vide « Rien de nouveau. Reviens quand tu veux. » (`nouvel-cloche-vide-1280`).

### 2. Orientation : 10/10
- Élément courant allumé en barre sur toutes les pages vues (Vannes, `en-cours-vannes-1280` ; icône compte sur /profil, `gratuit-profil-1024`, `en-cours-compte-profil-768`), et dans le menu à l'ouverture : Mon espace (`en-cours-menu-mon-espace-375`), Vannes (`en-cours-menu-vannes-375`, y = 604 sous le pli de 812 non atteint), Mon profil amené dans la vue par le défilement de 8 px (`en-cours-menu-profil-375`, `nouvel-menu-profil-320`). Aucun défilement quand la ligne est visible. À 568 px de haut, une ligne de liens du site allumée peut rester sous le pli : c'est le plafond du critère 5, ne retient pas la note.
- Lisible sans la teinte : filet gauche violet de 2 px, fond élevé, semi-gras, `aria-current` ; soulignement de 2 px en barre.
- Le parent « Mon espace » en blanc semi-gras (non allumé) se distingue nettement de la ligne allumée (fond, filet, violet).

### 3. Menu mobile : 10/10
- 375 x 812 : Mon espace + 8 entrées + séparateur tiennent avec la recherche (`en-cours-menu-court-375`, 568 px : Carnet à y = 507, séparateur à 529, Parcours amorcé ; `-320` idem). Lignes de 44 px sans interstice, rail `ml-3 border-l`, texte à 24 px du rail.
- Gratuit et visiteur : liste, séparateur, bouton d'offre pleine largeur, Connexion ou actions alignées à gauche avec icônes (`gratuit-menu-profil-375`, `visiteur-menu-vannes-375`). À 768 et plus, bouton d'offre à largeur du libellé, aligné sur les liens (`visiteur-menu-vannes-768`).
- Contrôles d'en-tête (logo, cloche, croix) restent au-dessus du voile ; le voile couvre la page (`en-cours-menu-vannes-768`). Croix à l'ouverture, retour du focus au bouton Menu (code, `fermerMenu`, Échap).
- Aucune coupure de libellé de 320 à 768 (`visiteur-menu-accueil-320`, `en-cours-menu-mon-espace-640`).

### 4. Cloche et compte : 10/10
- Cloche : bouton 44 px, point violet, bordure de couleur du fond, panneau à toute la largeur de la coque sous 768 px, 320 px dès 768 (`en-cours-cloche-375`, `-320`, `-768`, `-1920`) ; titre, « Fermer » 44 px, lignes avec chevron et date, groupes lisibles ; état vide court à deux lignes à 320 sans débordement (`nouvel-cloche-vide-320`). Panneau en Dialog Radix : focus dans le panneau, ordre logique Fermer, première ligne, seconde ligne, retour à Fermer (`en-cours-focus-dans-cloche-375-01` et `-03`), anneau violet net.
- Compte : panneau sous le filet, bord droit sur la marge à toutes les largeurs (`en-cours-compte-1920`, `gratuit-compte-profil-1280`) ; ligne courante Mon profil allumée sans la teinte (filet, semi-gras) ; Favoris absent pour l'abonné, présent pour le gratuit ; séparateur avant Déconnexion visible ; l'anneau de focus suit la ligne (`en-cours-focus-dans-compte-1280-01`, `gratuit-focus-dans-compte-768-01`).
- Piste (ne retient pas la note) : les trois captures `focus-dans-compte-NN` de chaque compte sont identiques (Radix neutralise Tab dans un menu, flèches haut et bas à la place) ; elles ne prouvent donc pas l'accès clavier à chaque ligne. Voir « Pistes ».

### 5. Charge cognitive et cohérence entre comptes et pages : 10/10
- Une seule barre, un lien « Mon espace » (barre ou menu), pas de doublon barre/menu hors logo ; ordre des liens identique pour les 3 états (Parcours en premier au même x que l'étalon). L'en-tête d'un état est identique sur /vannes, /profil, /mon-espace (hors lien courant et bouton d'offre masqué sur /abonnement) : comparaison `en-cours-vannes-1280` et `en-cours-mon-espace-1280` (non vu : `nouvel-mon-espace-1280` identique à droite).
- Au plus 3 actions principales par écran de menu. Trois contrôles à droite à 768 pour l'abonné (loupe, cloche, compte) plus Menu : un de moins que le seuil de lisibilité du bandeau ; icônes distinctes, noms accessibles.
- Position de la recherche variable selon le compte (x = 782, 826, 956) : décision du 15/11, ne retient pas la note.

### 6. Largeurs extrêmes, 440 à 767 et 1024 à 1279 : 10/10
- 320 : rien ne déborde, logo 14 px lisible, cloche et Menu 44 px (`en-cours-vannes-320`, `visiteur-vannes-320`). 440 : loupe en barre (`visiteur-vannes-440`) ; 520 : Connexion apparaît (`visiteur-vannes-520`) ; 600 : Premium seul (`gratuit-vannes-600`) ; 640/641 : libellé complet, ~12 px libres, aucune coupure (`visiteur-vannes-640`, `-641`) ; 1024 : liens + loupe + Premium court (`gratuit-vannes-1024`), abonné sans bouton d'offre (`en-cours-vannes-1024`) ; 1920 : coque 1216 px centrée, panneaux alignés sur la marge de la coque (`visiteur-vannes-1920`, `en-cours-cloche-1920`).
- Le vide entre liens et loupe à 1024 pour l'abonné est la conséquence de la spec (barre ancrée à gauche).

### 7. Accessibilité visible : 9/10
Acquis : cibles 44 px (logo `min-h-11`, liens `h-11`, loupe/cloche/compte/Menu `h-11 w-11`, Connexion `h-11 min-w-[44px]`, Premium `h-11`, lignes du menu `min-h-11`, Fermer `h-11`, puces de suggestion `min-h-11` dans le menu) ; anneau `accent-link` de 2 px partout (7,14:1 sur le fond, 5,27:1 sur l'élevé) ; ordre de tabulation logique : logo, Mon espace, liens, recherche, cloche, compte, Menu (`en-cours-focus-01 à 06` à 375, 768, 1280) ; focus enfermé dans le menu ouvert, contrôles d'en-tête compris : première Tab sur la recherche, 12 Tab ordonnées jusqu'à Vannes (`en-cours-focus-dans-menu-375-01 à 12`), Maj+Tab depuis la croix passe à la cloche puis au logo (`focus-retour-menu-375-01`, `-02`), puis boucle sur Déconnexion (`-03`) et Mon profil (`-04`) ; état actif sans la teinte ; Échap ferme et rend le focus.

Défaut (faute, non dure) : champ de recherche de la barre à 40 px de haut dès 768 px (`en-cours-vannes-1280` : champ de y = 12 à 52 ; `Input` en `h-10`, `max-md:h-11` seulement sous 768 ; même champ dans `#mobile-search` à 768-1279 quand la loupe l'ouvre). Le critère 7 de la spec demande des cibles de 44 px. L'étalon accueil porte le même champ de 40 px, ce qui explique l'oubli, mais la grille juge le rendu. Correction codable : dans `en-tete-universel.tsx`, ajouter `[&_input]:h-11` à la `className` du `SearchBar` de la barre (ligne 208) et du `SearchBar` de `#mobile-search` (ligne 275) ; l'en-tête est à 64 px (`h-16`), 44 px y entre sans changer sa hauteur ni la largeur de 176 px. Ce qui ferait 10 : champ à 44 px aux deux endroits, capture `*-vannes-1280` montrant 10 à 54.

## Fautes dures

Aucune.

## Pistes (ne retiennent pas la note)

1. Menu du compte : ajouter à la série de captures `focus-dans-compte` une séquence Flèche bas ×3 (au lieu de Tab) pour prouver que chaque ligne est atteignable ; aujourd'hui les trois vues sont identiques (Radix ne fait pas avancer Tab). Au clavier, la ligne focalisée après ouverture est la deuxième (Déconnexion pour l'abonné, Mon profil pour le gratuit) ; à confirmer par une capture juste après Entrée.
2. Gratuit sur /mon-espace : le bouton d'offre disparaît de la barre parce que l'adresse devient /abonnement ; si c'est une redirection, elle va contre le critère 9 (« aucune redirection ») ; à trancher côté page, pas côté en-tête.

## Notes

| Critère | Note |
|---|---|
| 1. Conformité à la spec v5 | 10 |
| 2. Orientation | 10 |
| 3. Menu mobile | 10 |
| 4. Cloche et compte | 10 |
| 5. Charge cognitive et cohérence | 10 |
| 6. Largeurs extrêmes et plages | 10 |
| 7. Accessibilité visible | 9 |

NOTE GLOBALE : 9/10
