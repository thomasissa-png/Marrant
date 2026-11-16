# Relecture UX à l'aveugle, « Aujourd'hui » s25 v7, tour 3

Périmètre : `/mon-espace`, 4 comptes (visiteur, gratuit, en-cours, nouvel), captures pleine page et premier écran lues à 375, 768, 1280 et 1920 (1456 identique à 1280 par construction de la coque `max-w-7xl`). Étalon : `visiteur-accueil-1280.png`. Code lu : `page.tsx`, `aujourdhui/*`, `apercu/{badge-premium,offre-apercu,extrait-coupe,tuile-fermee,hero-apercu,apercu-verrouille,tableau-verrouille}.tsx`, `tableau.tsx`, `carte/styles.ts`, `tailwind.config.ts`. Aucune relecture antérieure consultée.

## Vérifications au code (avant toute faute)

| Point | Résultat |
|---|---|
| Cibles 44 px | OK : boutons `buttonVariants lg` (h-12), `BOUTON_SECONDAIRE`/`puce()`/`LIEN`/`lienCarte` en `min-h-11`, pied de tuile `min-h-12`, lignes de rafale `min-h-14`, « Connexion » `min-h-11 min-w-11`, Z4 = tuile entière cliquable |
| Contraste texte courant | OK : `text-muted` #9A9A9A sur #1F1F1F = 5,9:1 (réassurance, aide de série, étiquettes) ; `accent-link` #A78BFA > 5:1 ; `text-secondary` 7:1 |
| Extrait fermé | `opacity-75` sur les enfants : `accent-link` tombe à environ 3,9:1, `muted` à environ 3,9:1. Extrait `aria-hidden` + `inert`, exempté (1.4.3 ne s'applique pas au texte inactif) et jamais sous 3:1. Pas une faute |
| Label in name (2.5.3) | OK : `nomAccessible` commence par « Premium » ; visible « Premium · 1,99 €/mois » |
| Éléments non textuels | segments du cap `accent-primary` 3,6:1 ; rails `border-hover` décoratifs, l'info est portée par « cap n sur 5 » et « Étape n sur N » |
| Inertie / ordre clavier | OK : `inert=""`, `aria-hidden`, `pointer-events-none`, aucun lien dans l'extrait ; ordre DOM = hero, Connexion, bouton de fin |

## Design

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | Mêmes cartes `rounded-xl` à filet, H1 `font-display`, carte d'offre `border-2` de l'accueil, halo discret. Retenue réelle, plus de « PowerPoint ». Reste : trois filets violets sur les cartes de contenu du jour + filet Z1 + barres : la page porte plus de violet que l'accueil (piste). |
| 2 Hiérarchie | 9 | Abonné : Z1 (carte teintée + seul plein) domine, Z2 secondaire, tuiles sobres, nette en plissant les yeux. Aperçu : H1, bouton d'offre dans la carte encadrée, le reste neutre. |
| 3 Usage de la largeur, aucun vide mort | 8 | Voir défaut D1 (faute dure) et D2, D3 (pistes). 1280/1920 : grille 8/4 puis 6/6 ou 5/7 puis 2 colonnes de contenu, aucune cellule vide ; 1920 = même grille, halo qui prolonge le fond, coque alignée sur la bande. |
| 4 Cohérence entre comptes | 9 | Même en-tête, même grille, même Z2 sur les 3 abonnés/états ; l'aperçu reprend les mêmes composants en mode figé (le prospect voit le vrai produit). |
| 5 Finition au pixel | 9 | Alignements nets (bord gauche H1 = bande = coque), contrastes et cibles vérifiés au code. Pastille « Premium » toujours à pleine opacité, aucun chevauchement avec « 5 min » (réserve `pr-24`) ni « cap 1 sur 5 ». |

### D1 [FAUTE DURE] 768 : la tuile « Vidéo du jour » est à moitié creuse (en-cours-768, nouvel-768, et tout abonné avec vignette)
À 768 (`md` à `lg`), la carte garde la ligne entière : vignette sur la moitié gauche (260 px), et en face seulement le titre sur 2 lignes. Le quart bas droit de la carte (environ 350 x 125 px) est vide. Défaut inverse de celui que Thomas a nommé (« espace inutilisé », tuile creuse).
Correction codable, `components/espace/aujourdhui/contenu-du-jour.tsx`, constante `VIDEO_768` :
`md:max-lg:grid md:max-lg:grid-cols-[3fr_2fr] md:max-lg:items-center md:max-lg:gap-6` (au lieu de `grid-cols-2 items-start`). La vignette passe à environ 340 x 190 px, le titre se centre verticalement dans sa colonne (3 lignes), la carte se remplit. Alternative équivalente : `lienCarte` en `md:max-lg:text-base md:max-lg:font-semibold`.
Ce qui ferait 10 : à 768, aucun quart de carte vide.

### D2 [piste] Aperçu 768 : bloc d'offre pleine largeur
Le bloc d'offre s'étire sur 686 px (bouton de 640 px, réassurance et preuve centrées en petit) : c'est le « gros bloc centré » que Thomas rejette, alors que la spec UX §2.3 demandait 60/40 dès 768. Correction, `apercu/hero-apercu.tsx` : conteneur `md:max-lg:grid-cols-5 md:max-lg:items-start`, texte `md:max-lg:col-span-3`, offre `md:max-lg:col-span-2` (le bouton `h-12` et `BOUTON_PRIX_UNE_LIGNE` tiennent dans 280 px). L'extrait suit, pleine largeur.

### D3 [piste] Aperçu 1280/1920 : vide sous le texte du hero
La carte d'offre (255 px) dépasse le texte de 60 px, puis `lg:mt-20` de l'extrait : environ 140 px d'air noir sous les pastilles, côté gauche. Volontaire (garder le bouton de fin sous le premier écran, tour 3) mais lisible comme un trou. Correction, `hero-apercu.tsx` : colonne texte `lg:flex lg:h-full lg:flex-col`, pastilles `lg:mt-auto` : elles s'alignent sur le bas de la carte d'offre et l'air devient une marge de section, pas un trou. Pas de nouvelle hauteur, le pli ne bouge pas.

## UX

| Critère | Note | Constat |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Premier écran 375 : pastille « Premium », H1, promesse, 6 pastilles, offre avec prix et réassurance, début du premier pas : sans défiler. 1280 : offre en haut à droite, extrait visible. Se lit FERMÉ sans ambiguïté : une pastille « Premium » (verrou + mot) par bloc, bouton « Commencer » éteint, fondu, « La suite est dans Premium », légende « exemple ». Une seule offre (le bouton de fin n'est jamais visible avec celui du hero à 1280). Valeur visible : scène réelle, cap, étape, mission. Gratuit : la phrase d'objet est bien placée sous le bouton. |
| 2 Abonné, je sais quoi faire | 9 | Un plein par écran (Commencer / Les cartes du jour), à droite du titre dès 768, pleine largeur à 375. Z1 au-dessus de la ligne de flottaison à 375 (bouton compris). |
| 3 Abonné, envie de continuer | 9 | Cap, XP, série avec flamme et aide dès le jour 1 ; barre « Étape n sur N » ; mission facultative ; feuille de route de 4 semaines. |
| 4 Nouvel abonné, jamais une page morte | 9 | Z1, Z2 (série « démarre à ta prochaine pratique », sans reproche), étape conseillée, « Tes 4 premières semaines », contenu du jour. Aucune cellule vide à 375, 768, 1280, 1920. |
| 5 Accessibilité visible et cohérence | 9 | Focus visibles dans tout le code lu, un seul H1, H2 par zone, extrait hors tabulation, `sr-only` T4. |

Pistes UX (non bloquantes) :
- Nouvel abonné, « Étape conseillée » : le rail de la barre est entièrement vide avec « Étape 1 sur 4 » ; lisible, mais le lien « Commencer l'étape 1 » et le plein « Commencer » du premier pas se ressemblent. Aucun changement de texte demandé (hors périmètre), à surveiller en test.
- Aperçu : sous le fondu, « Vidéo du jour » n'est jamais montrée ; acceptable (le contenu du jour est déjà gratuit à l'accueil).
- Textes T1 et T2 : jugés sur leur place, elle est bonne (promesse juste sous le H1, « La suite est dans Premium » juste avant le bouton de fin). Aucun texte faux repéré.

NOTE GLOBALE : 8/10

Fautes dures :
1. 768, tuile « Vidéo du jour » à moitié creuse pour tous les abonnés avec vignette : `apercu` non concerné ; corriger `apps/web/src/components/espace/aujourdhui/contenu-du-jour.tsx` (`VIDEO_768`).
