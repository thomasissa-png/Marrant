# Relecture design à l'aveugle, en-tête et menu mobile de l'espace (s25, tour 6)

Méthode : étalon (`docs/captures/s25/etalon-accueil/visiteur-accueil-375` et `1280`), puis captures `docs/captures/s25/entete-tour-6/` lues à l'image (bandeaux visiteur, gratuit, en-cours, nouvel à plusieurs largeurs dont 320, 375, 440, 520, 600, 640, 641, 768, 1024, 1280, 1456, 1920 ; menus 375, 320, 768 ; `menu-court` 375 et 320 ; cloche pleine et vide 320, 375, 1280 ; compte 768, 1280, 1920 ; focus barre et focus dans menu et cloche), puis code. Aucune relecture existante consultée. Spec v5 et [CHOIX UTILISATEUR] respectés ; recherche à 176 px conservée (aucune correction ci-dessous ne la touche).

## Ce qui est conforme (vu)

- En-tête identique à celui de l'accueil : même logo dégradé, même barre de 65 px, mêmes liens, mêmes boutons, même bouton d'offre violet (`visiteur-accueil-1920-bandeau` vs `en-cours-mon-espace-1920-bandeau` : logo au même x=352, coque 1216 px).
- Panneaux cloche et compte : fond élevé, `rounded-xl`, filet dégradé violet de 4 px en haut (langue des cartes de l'accueil), 8 px sous le filet de l'en-tête, bord droit sur la marge de la coque (1248 à 1280, 1568 à 1920, 16 px à 375). Détachés par ombre et anneau fin.
- Cloche ouverte (fond de survol, sans soulignement) distincte de la page active (soulignement violet 2 px) : `en-cours-cloche-1280` vs `en-cours-compte-profil-1280`. Page en cours allumée dans le compte (filet gauche violet, semi-gras, texte violet). État vide : une phrase, mêmes marges que le titre (`nouvel-cloche-vide-1280`, `-320`).
- Menu mobile 375 et 320, abonné : Mon espace + 8 entrées + séparateur entièrement visibles à 568 px de haut (`en-cours-menu-court-375` : Carnet à y=507, séparateur à 529 sur 568 ; idem 320). Pas de défilement du menu pour les rubriques de l'espace à 812 et 568. Une colonne, pas de 44 px régulier, rail gauche aligné sous le texte « Mon espace » (x=28), ligne allumée aux coins droits arrondis et filet violet lisible sans la teinte. Visiteur et gratuit : mêmes lignes, même rythme.
- Bandeaux 320 à 1920, 4 comptes : aucune troncature ni débordement, cibles 44 px, logo à x=16 (<768), 24 (768 à 1279), 32 (1280), alignement sur la coque de la page.
- Focus barre (`en-cours-focus-02-1280`) : anneau violet 2 px entièrement arrondi ; focus cloche : anneau violet autour de la ligne, bien contenu dans le panneau (`en-cours-focus-dans-cloche-375-1`, `1280-2`).

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue de l'accueil | 10 |
| 2 | Cohérence comptes et pages | 10 |
| 3 | Hiérarchie et lisibilité | 10 |
| 4 | Menu mobile | 9 |
| 5 | Panneaux cloche et compte | 9 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition au pixel | 9 |

1, 2, 3, 6 : rien de mesurable à reprendre. La position de la recherche qui varie selon le compte (x=782 visiteur, 826 gratuit, 956 abonné à 1280) est la conséquence assumée de la spec (176 px, zone d'actions de largeur variable), pas un défaut.

## Défauts

### D1 (critère 4, faute dure) : menu mobile désaligné du logo de 768 à 1023 px

Preuves : `gratuit-menu-accueil-768.png`, `en-cours-menu-mon-espace-768.png`. Le logo est à x=24 (`md:px-6` de l'en-tête), alors que le séparateur, le bouton Premium et le bord des lignes partent de x=16 et le texte des lignes de x=28 (menu en `px-4`). Écart de 8 px, la règle « logo sur la verticale des lignes du menu » (tour 3) ne tient qu'à moins de 768 px. Mesure : bord gauche du séparateur 16 px, logo 24 px.
Correction : `apps/web/src/components/layout/menu-mobile-universel.tsx`, ligne 78, `px-4` devient `px-4 md:px-6` (bord du séparateur et du bouton à 24, texte des lignes à 36, ligne « Mon espace » en intitulé et rail à 36). Aucun effet sous 768 px ni sur la recherche (masquée dès 440 px).
10 : après correction, séparateur et bouton à x=24 comme le logo et le contenu de page.

### D2 (critère 5, faute légère) : « Fermer » de la cloche non aligné sur les chevrons

Preuve : `en-cours-cloche-1280.png`, texte « Fermer » finit à x=1219, chevrons à x=1231 (12 px d'écart, le padding du bouton fantôme). Les lignes du panneau ont déjà `-mx-3 px-3` pour que leur contenu reste sur la verticale ; le bouton ne le fait pas.
Correction : `apps/web/src/components/espace/cloche.tsx`, ligne 115, ajouter `-mr-3` à la classe de `Dialog.Close` (le survol `hover:bg-border-hover` déborde alors de 12 px comme celui des lignes, à 4 px du bord du panneau). Sous 300 px (panneau en `px-3`), prévoir `max-e300:-mr-2`.
10 : texte « Fermer » et chevrons sur le même bord droit.

### D3 (critère 7, faute légère) : focus de la suggestion de recherche dans le menu

Preuve : `en-cours-focus-dans-menu-375-3.png` et `gratuit-focus-dans-menu-375-3.png` : la puce « répartie » focalisée porte un anneau blanc fin, alors que tout le reste (barre, lignes du menu, cloche, recherche) a un anneau violet 2 px. Le focus du menu n'est donc pas homogène. Dans la même séquence, le premier Tab va à la recherche et ses suggestions (`en-cours-focus-dans-menu-375-1`) : le focus des lignes de l'espace dans le menu n'est donc pas démontré par ces captures (le code porte `FOCUS` inset violet, non vérifié visuellement).
Correction : `apps/web/src/components/ui/search-bar.tsx`, puces de suggestion (classes de focus à localiser, non relues ici) : `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary`. Capturer aussi un Tab de plus (4 à 6) pour montrer l'anneau sur « Mon espace » et « Quoi répondre » dans le menu.
10 : même anneau violet partout, une capture du focus sur une ligne du menu.

### Pistes (sans effet sur les notes)

- `en-cours-focus-dans-menu-375-1` : les suggestions apparaissent translucides par-dessus « Mon espace » et « Quoi répondre » (fondu en cours de capture) ; opaques à la capture suivante. Pas de défaut retenu, à contrôler sur la capture suivante lors du tour 7.
- La croix du menu ouvert reste sur fond `elevated` à droite de la cloche : bien lisible, rien à changer.

## Verdict

Langue de l'accueil respectée, hiérarchie nette, rubriques sans défilement à 568 px de haut. Reste une faute dure (D1, désalignement du menu de 768 à 1023 px) et deux légères (D2, D3).

NOTE GLOBALE : 9/10
