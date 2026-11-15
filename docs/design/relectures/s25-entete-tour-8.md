# Relecture design à l'aveugle, en-tête et menu mobile (s25, tour 8)

Périmètre : en-tête universel et menu mobile de l'espace client, interrupteur ouvert. Étalon : page d'accueil du site. Décisions de Thomas appliquées sans les rediscuter : spec v5, recherche à 176 px et position variable selon le compte (ligne 194, 15/11), menus en une colonne, critère 5 (rubriques sans défilement dès 568 px de haut).

## Couverture (captures lues, `docs/captures/s25/entete-tour-8/`)

- Étalon : accueil visiteur 375 et 1280 (pleine page, réduites : j'ai lu le bandeau, la hiérarchie et la langue des cartes, pas le détail au pixel).
- Bandeaux : visiteur 320, 440, 520, 641, 768, 1024, 1280, 1920 ; gratuit 520, 641, 1024, 1280, 1920 ; en-cours 320, 440, 640, 768, 1024, 1280, 1456, 1920 ; nouvel 375, 768, 1456. Les autres largeurs (visiteur 375, 600, 640, 1456 ; gratuit 320 à 440, 600 à 768, 1456 ; en-cours 375, 520 à 641 ; nouvel 320, 440 à 641, 1024 à 1280, 1920) ne sont PAS lues une à une : elles découlent des mêmes classes (le code est unique), mais ce n'est pas une preuve par capture.
- Menu ouvert : visiteur 320, 375, 641, 768 ; gratuit 375, 600 ; en-cours 320, 375, 440, 520, 768 ; nouvel 320, 440.
- `menu-court` (568 px) : gratuit, en-cours, nouvel à 320 et 375 (lues). Visiteur : captures en échec dans l'INDEX (navigation vers /mon-espace renvoyée à la connexion, normal), donc pas de vue ; sans objet, le visiteur n'a pas de rubriques d'espace.
- Cloche : en-cours 375 et 1280, nouvel vide 375, 1280, 1920 ; compte : en-cours 1280 (/profil), gratuit 768, nouvel 1920.
- Focus : série `focus-dans-menu` en-cours 375 (01 à 12, toutes), `focus-retour-menu` en-cours 375 (01 à 04), `focus-dans-cloche` en-cours 375 (01 à 03) et nouvel 1280 (02), `focus-dans-compte` en-cours 1280 (01, 03) et gratuit 768 (02).
- Limite : les autres comptes à 320 et 1920 pour les focus ne sont pas lus ; le gratuit n'a pas de cloche (conforme à la spec).

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue de l'accueil | 10 |
| 2 | Cohérence entre comptes et pages | 10 |
| 3 | Hiérarchie et lisibilité | 10 |
| 4 | Menu mobile | 10 |
| 5 | Panneaux cloche et compte | 9 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition au pixel | 9 |

### 1. Fidélité à l'accueil : 10
Même barre que l'accueil visiteur (logo dégradé violet, liens 14 px, champ de recherche arrondi, Connexion en texte, bouton Premium violet plein `rounded-lg`) : `visiteur-vannes-1280-bandeau.png` se superpose à l'en-tête de `visiteur-accueil-1280.png`. Les panneaux reprennent la carte de l'accueil (`rounded-xl`, filet dégradé `h-1` en haut : visible dans `en-cours-cloche-1280.png`, `nouvel-compte-1920.png`). Aucun écart.

### 2. Cohérence comptes et pages : 10
Logo à x = 32 (1280) et 16 (mobile) pour les quatre états ; premier lien au même x (276 à 1280) pour gratuit, visiteur et abonné ; hauteur 65 px constante ; même contrôle à la même place d'un compte à l'autre (cloche, compte, Menu à droite). La position de la recherche varie selon le compte à 1280 et plus : décision de Thomas du 15/11, non retenue.

### 3. Hiérarchie : 10
Un seul élément plein par barre (Premium), lien actif repérable sans la teinte (fond + soulignement 2 px), Connexion et liens en secondaire. Menu : « Mon espace » (semi-gras blanc) > rail des 8 rubriques (gris, `font-medium`) > liens du site > actions.

### 4. Menu mobile : 10
- Une colonne, pas de 44 px partout, séparateurs 1 px seuls porteurs d'air. Mesuré sur `en-cours-menu-court-375.png` et `-320.png` : dernière rubrique (Carnet) à y = 507, séparateur à 529, fenêtre de 568 px : les 8 rubriques sont entières sans défilement, à 812 aussi (`en-cours-menu-mon-espace-375.png`).
- Alignements : fonds des lignes de x = 16 à x = 359 (375 px), exactement la coque ; texte des liens à 28, des rubriques à 53, rail à 28 ; bouton fermer à 315 à 359. Coins : `rounded-lg` ou `rounded-r-lg` sur le rail, ligne allumée entière (filet gauche violet 2 px, fond élevé, semi-gras violet) : `en-cours-menu-situation-375.png` (Quoi répondre) et `visiteur-menu-vannes-641.png` (Vannes).
- Graisse : semi-gras réservé à « Mon espace » (parent), à la ligne allumée et au bouton d'offre. 
- Pistes non retenues (conformes à la spec et subjectives) : sur « Mon profil » allumé (`en-cours-menu-profil-375.png`, `-520.png`), le défilement automatique plafonné à 16 px (critère 5) amène la ligne entière (bas à 811 sur 812, 0 px d'air dessous) et remonte la recherche de 8 px ; c'est le compromis voulu « ligne entière avant l'air », il ne casse ni la spec ni une règle de Thomas.

### 5. Cloche et compte : 9
Points conformes : panneau 8 px sous le filet, bord droit sur la marge de la coque (x = 1248 à 1280, 744 à 768, 1568 à 1920), ombre + anneau fin, détaché des cartes (`en-cours-cloche-1280.png`) ; état vide propre « Rien de nouveau. Reviens quand tu veux. » à 23 px d'air haut et bas (`nouvel-cloche-vide-1280.png`, 375, 1920) ; cloche ouverte (fond élevé, sans soulignement) distincte de l'icône compte active (fond + soulignement violet, `en-cours-compte-profil-1280.png`) ; ligne « Mon profil » en cours : filet violet, semi-gras, fond en creux.

**Faute légère (retient la note) : rayons des lignes du compte.** Les lignes du panneau compte sont en `rounded-md` (6 px) : `ITEM_UNIVERSEL` et `ITEM_COURANT` dans `account-menu.tsx`, visible dans `en-cours-focus-dans-compte-1280-03.png` et `gratuit-focus-dans-compte-768-02.png`. Les lignes de la cloche (`LIGNE`, `cloche-lignes.tsx`) et du menu mobile (`FOCUS`) sont en `rounded-lg` (8 px). Le panneau étant `rounded-xl` (12 px) avec `p-1` (4 px), le rayon concentrique est 8 px : le 6 px est faux deux fois (incohérent avec la cloche, non concentrique).
Correction codable : dans `account-menu.tsx`, remplacer `rounded-md` par `rounded-lg` dans `ITEM_UNIVERSEL` et dans `group-data-[clavier]/compte:data-[highlighted]:rounded-md` de `ITEM_COURANT`. Aucun nouveau texte.
Ce qui fait 10 : ce changement ; rien d'autre n'est à reprendre dans les panneaux.

### 6. Grandes largeurs : 10
1456 : coque 1216 px centrée, logo à x = 120 (`en-cours-vannes-1456-bandeau.png`) ; 1920 : logo à x = 352, bord droit des contrôles à 1568 (`visiteur-vannes-1920-bandeau.png`, `gratuit-profil-1920-bandeau.png`, `en-cours-mon-espace-1920-bandeau.png`), comme la coque du contenu dessous (titre à 352, cartes à 1568, `nouvel-cloche-1920.png`). Aucun bord à bord, aucun vide à droite non voulu.

### 7. Finition au pixel : 9
Points conformes : lignes de base communes (liens, Connexion, Premium, recherche alignés sur y = 32 ; `pt-0.5` compense le `border-b-2`), cibles de 44 px (boutons 44 x 44, lignes `h-11`), aucune troncature ni débordement vus de 320 à 1024 (`visiteur-vannes-320-bandeau.png` : logo, Premium, Menu tiennent), anneau 2 px `accent-link` (7,14 / 5,27 / 4,18 : AA non texte atteint, valeurs documentées dans `panneau-eleve.ts`) visible et identique en couleur et épaisseur dans la barre (`retour-menu-02`, logo), le menu (`dans-menu-01 à 12`), la cloche (`dans-cloche-01 à 03`) et le compte. L'ordre au clavier est cohérent, le focus enfermé dans le menu ouvert (`retour-menu-03` et `-04` : Maj+Tab depuis le logo mène à Déconnexion, puis Mon profil).
Seul reproche : l'anneau n'est pas homogène en rayon. Lignes du compte 6 px (voir 5), lignes du menu et de la cloche 8 px, champ de recherche 12 px (`dans-menu-01`). Le champ garde son rayon propre (c'est un champ, comme à l'accueil) : non retenu. Le 6 px du compte est la seule faute, même correction qu'en 5.
Ce qui fait 10 : correction du 5.

## Fautes dures : aucune. Fautes légères : 1 (rayon 6 px du compte, `account-menu.tsx`). Pistes non retenues : défilement du menu sur « Mon profil » (0 px d'air dessous).

NOTE GLOBALE : 9/10
