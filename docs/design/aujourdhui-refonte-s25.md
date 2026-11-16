# Aujourd'hui, refonte s25 : spec visuelle (aperçu verrouillé + tableau de bord abonné)

Spec @design pour @fullstack. Part de `docs/ux/aujourdhui-refonte-s25.md` (structure, ordre du DOM, grilles, textes : ils font foi). Espace ouvert seulement. Uniquement des classes du thème existant (`tailwind.config.ts`) et des helpers existants (`CADRE_CARTE`, `FILET_CARTE`, `ETIQUETTE`, `LIEN`, `puce()`, `buttonVariants`, `BOUTON_SECONDAIRE`). Aucune couleur hors tokens. Les opacités sur tokens (`bg-accent-primary/10`) sont permises, comme l'accueil les utilise déjà.

Rappels du thème : `rounded-md` = 8 px, `rounded-lg` = `rounded-xl` = 12 px (les deux se valent), `rounded-2xl` = 16 px (défaut Tailwind, non surchargé). Écrans : `md` 768, `lg` 1024, `xl` 1280. Site sombre uniquement : aucune variante `dark:` à écrire, tout se lit sur `background` #0D0D0D / `background-card` #1F1F1F / `background-elevated` #2A2A2A.

## 1. Direction visuelle

### 1.1 Lecture des captures (constat)

- Abonné (`nouvel-aujourdhui-1280.png`) : H1 centré de 48 px, un bandeau plat où le titre de 30 px flotte entre « 5 min » et un bouton, 140 px de vide, puis trois cartes de contenu dont deux à moitié vides. Tout pèse pareil : même fond, même bord, même hauteur de texte.
- Aperçu (`visiteur-aujourdhui-1280.png`) : une fiche de 768 px de large lisible en entier dans 1280 px (256 px de vide de chaque côté), aucun mot « Premium » hors de la barre, bouton en bas à 970 px.
- Étalon accueil : H1 gros, sections à fort rythme (`py-12 md:py-16`), cartes `rounded-xl` à filet violet, un seul plein violet par bloc, carte d'offre `border-2 border-accent-primary`.

### 1.2 Ce que « pas PowerPoint » veut dire ici (règles d'exécution, vérifiables)

PowerPoint = un titre centré, des boîtes de même taille, un bord sur tout, des puces d'icônes dans des carrés, un violet partout. Remède :

1. **Un seul accent fort par écran** : le bouton plein et la carte qui le porte (Z1 côté abonné, bloc offre côté aperçu). Tout le reste est neutre (`text-text-primary`, `text-text-secondary`, `border-border`) avec du violet en petite touche (étiquettes, chiffres, filet).
2. **Trois niveaux de taille, pas plus de trois par carte** : étiquette (`text-xs`), titre (`text-lg` à `text-3xl` selon le poids), corps (`text-sm`/`text-base`). Les chiffres sont un niveau à part, plus grand que le titre de leur carte.
3. **Un seul bord gauche par carte** : étiquette, titre, corps et pied alignés à gauche sur le même padding. Rien de centré, sauf le bloc offre de l'aperçu (comme la carte Premium de l'accueil) et la fin d'extrait.
4. **Bords fins partout (1 px `border-border`), ombre nulle**, sauf la carte d'offre de l'aperçu (`shadow-lg shadow-accent-primary/10`, reprise de l'accueil). Pas de flou décoratif.
5. **Hiérarchie par la taille et l'espace, pas par la boîte** : Z1 est plus grande, plus haute, plus claire (dégradé violet léger) ; Z3 à Z5 sont des tuiles sobres ; Z6 reprend la carte de l'accueil.
6. **Zéro icône dans un carré arrondi, zéro emoji**. Les seules icônes : verrou (pastille Premium), flamme (série), coche (rafale faite), chevron (lignes cliquables).
7. **Chiffres en `font-display font-bold tabular-nums`**, jamais dans une phrase courante.

### 1.3 Hiérarchie, densité, rythme

| Niveau | Éléments | Taille |
|---|---|---|
| 1 | H1 de page, titre de Z1, chiffres XP et série | H1 `text-3xl md:text-4xl` ; Z1 `text-2xl md:text-3xl` ; chiffres `text-3xl` |
| 2 | Titres de tuiles Z3 à Z5, nom du cap, H2 « Contenu du jour » | `text-lg` ; H2 `text-2xl md:text-3xl` |
| 3 | Corps, étiquettes, légendes | `text-sm`, `text-xs` |

Rythme vertical (échelle 4 px, tokens Tailwind) : en-tête puis grille `mt-6 md:mt-8` ; entre rangées `gap-6` ; avant le H2 de Z6 `mt-10 md:mt-14` ; H2 puis cartes `mt-4 md:mt-6` ; bas de page `pb-16`. Haut de page `pt-6 md:pt-10`. Padding : Z1 `p-6 md:p-8` ; Z2 `p-5 md:p-6` ; tuiles `p-5`.

Largeur : coque `max-w-7xl` inchangée (1216 px, alignée sur la barre des rubriques), 12 colonnes dès `lg`. À 1920 le gain d'espace vient de la grille et du **halo de page** (§1.5), pas de la largeur : sans lui, 352 px de noir de chaque côté lisent « page vide » (le « on n'utilise pas l'espace » de Thomas).

### 1.4 Couleur et chiffres

- Texte violet courant (< 24 px) : `text-accent-link` (#A78BFA, AA). `text-accent-primary` (#8B5CF6) ne fait que 3,6:1 sur carte : réservé aux **chiffres de 24 px et plus en gras** (seuil « grand texte ») et aux éléments non textuels (segments du cap, filet).
- XP et série : le nombre en `font-display text-3xl font-bold tabular-nums text-text-primary`, son libellé en `text-xs text-text-secondary` dessous. Un seul chiffre en violet par écran possible : le numéro de la ligne courante des « 4 premières semaines ».
- Barres (cap, parcours) : remplissage `bg-gradient-to-r from-accent-primary to-accent-secondary`, rail `bg-background` (sur tuile) ; hauteur `h-2`, `rounded-full`.

### 1.5 Halo de page (recommandé, aperçu et abonné)

Un dégradé plat plein-largeur derrière l'en-tête et la première rangée, pour que 1920 ne soit pas un fond uni :

`relative isolate before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-72 before:bg-gradient-to-b before:from-accent-primary/10 before:to-transparent`

Sur le conteneur de page (pleine largeur, hors coque). Contrastes : texte `text-secondary` sur ce fond reste au-dessus de 6,5:1. [ARBITRAGE : si Thomas le juge trop présent, retirer le halo, rien d'autre ne change.]

## 2. En-tête de page : tranché

**Abonné : H1 aligné à gauche, date dessous, repère à droite. On ne garde pas le H1 centré.** Raisons : (1) la barre des rubriques juste au-dessus est alignée à gauche, un H1 centré casse la ligne ; (2) un tableau de bord se lit en F, pas en pyramide ; (3) l'accueil est centré parce que c'est un hero de vente, pas un outil. Les rubriques qui restent des colonnes `max-w-3xl` gardent `EN_TETE_CENTRE` (hors périmètre).

Classes (page abonné) :

- Conteneur : `flex flex-col gap-1 md:flex-row md:items-end md:justify-between`.
- H1 : `font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl` (pas de `text-5xl`/`text-6xl` : ce n'est pas un hero).
- Date : `mt-1 text-sm text-text-secondary` (mise en forme `lundi 16 novembre`, T3).
- Repère (à droite dès `md`, sous la date en dessous) : `text-sm text-text-secondary` avec le nombre en `font-semibold text-text-primary tabular-nums`. Pas de pastille bordée : bordé = cliquable (convention `chipClass`).
- **La série n'est PAS répétée dans l'en-tête** : elle vit dans Z2, juste dessous à droite à 1280. Une donnée, un endroit.

**Aperçu** : pas d'en-tête séparé. Le H1 « Aujourd’hui » est dans le hero, aligné à gauche (même bord gauche que la barre), voir A1.

## 3. Aperçu verrouillé : composants nommés (réutilisables pour toutes les rubriques)

Fichiers : `apercu/apercu-verrouille.tsx` (assemble), `apercu/badge-premium.tsx`, `apercu/offre-apercu.tsx`, `apercu/extrait-coupe.tsx`, `apercu/tuile-fermee.tsx`. Aucun appel réseau, rendu serveur.

### 3.1 `BadgePremium` (le verrou lisible : icône ET mot)

`inline-flex items-center gap-1.5 rounded-full bg-accent-primary/15 px-2.5 py-1 text-xs font-semibold text-accent-link` + icône verrou `h-3.5 w-3.5` (`aria-hidden`) + texte `OFFRE_NOM`.

- Variante `grand` (hero) : `px-3 py-1.5 text-sm`, verrou `h-4 w-4`.
- Sans bordure : non cliquable. Contraste du texte : #A78BFA sur fond `accent-primary/15` posé sur carte ou page, plus de 5:1.
- Dans une tuile fermée : positionné `absolute right-3 top-3 md:right-4 md:top-4` (jamais dans le flux, pour ne pas déplacer le contenu).
- Règle d'usage : **le verrou ne vit jamais seul**. L'icône de la barre des rubriques reste telle quelle (hors périmètre), mais chaque page Premium montre le mot.

### 3.2 `OffreApercu` (bloc offre, zone B)

Reprise visuelle de la carte Premium de l'accueil (`premium-cta.tsx`) sans son halo flou :

- Cadre : `relative rounded-2xl border-2 border-accent-primary bg-background-card p-5 shadow-lg shadow-accent-primary/10 md:p-6`.
- Contenu, de haut en bas (ordre du DOM de la spec UX) :
  1. Bouton : `buttonVariants({ variant: "primary", size: "lg" })` + `w-full whitespace-normal text-center [text-wrap:balance]` + `BOUTON_PRIX_UNE_LIGNE` (comme `CartePremiumAchat`). `h-12`, plus de 44 px.
  2. Gratuit seulement : `PHRASE_OBJET_CONNECTE` en `mt-3 text-center text-sm text-text-secondary`.
  3. Réassurance : composant `Reassurance` de l'accueil (`ui/reassurance`), `mt-3 text-center text-xs text-text-muted` (#9A9A9A sur #1F1F1F : 5,9:1). [clé `REASS` à confirmer par @fullstack, voir spec UX]
  4. Preuve : `mt-5 border-t border-border pt-4 text-center text-sm text-text-secondary`, le nombre « 1 500+ » en `font-display text-xl font-bold text-text-primary` (voir §7, coupe du texte).
  5. Visiteur seulement : lien « Connexion » `LIEN` centré `mt-1 justify-center`.
- Bouton : le seul plein de la page. Le bouton plein du header est global et de même libellé (même précédent que l'accueil), il ne compte pas ; le plein du hero est plus grand (`size lg`) donc dominant.

### 3.3 `ExtraitCoupe` (extrait inerte avec fondu, zones C et D)

Structure : un wrapper `relative` contenant (a) la boîte masquée, (b) la fin d'extrait en SIBLING (jamais dans la boîte masquée, sinon le masque l'efface).

(a) Boîte masquée :

```
aria-hidden="true" inert (ou ref) 
className="pointer-events-none relative h-80 select-none overflow-hidden md:h-[400px] lg:h-[440px] [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)]"
```

- Hauteurs exactes de la spec UX : 320 (< 768), 400 (md), 440 (lg et plus). Fondu : opaque jusqu'à 55 %, transparent à 100 %, vers le fond de page (c'est un masque, il n'y a aucun voile gris).
- Pas de flou, pas d'animation, rien à désactiver pour `prefers-reduced-motion`.
- Intérieur : la grille de §5.1 (rangée 1 : Z1 col-8 + Z2 col-4 ; rangée 2 : 3 tuiles col-4), `gap-6`, identique à l'abonné nouvel, donc le prospect voit le produit réel.

(b) Fin d'extrait (zone D), chevauche les 48 derniers px entièrement transparents :

`relative -mt-12 flex flex-col items-center gap-3 px-4 text-center` : `BadgePremium` (variante `grand`), phrase T2 `font-display text-xl font-bold text-text-primary md:text-2xl`, bouton plein `size lg` `w-full sm:w-auto sm:min-w-64`. Pas de lien « Connexion » ici.

Légende (zone E) : `mt-6 text-center text-sm text-text-secondary`.

### 3.4 `TuileFermee` (enveloppe d'un bloc dans l'extrait)

Même cadre que la tuile ouverte (pour que le prospect reconnaisse le futur produit) avec trois différences :

- Cadre : `relative rounded-xl border border-border bg-background-card` ; Z1 fermée garde son dégradé et son filet.
- Contenu dans un `div` `opacity-75` (texte `text-muted` à 75 % : 3,9:1, jamais sous 3:1 comme l'exige la spec UX ; l'extrait est inerte et `aria-hidden`).
- `BadgePremium` en `absolute right-3 top-3` (hors du `div` atténué, donc à pleine opacité).
- Boutons dessinés : `opacity-60`, `aria-disabled`, `tabIndex={-1}`, sans `hover:`. Le curseur reste par défaut (`pointer-events-none` hérité).

Pas de gros cadenas au centre, pas de flou sur la tuile : la pastille et l'atténuation suffisent à dire « fermé », le contenu intact dit « désirable ».

### 3.5 `HeroApercu` (zones A et B) : composition

Pas de carte autour du texte : le texte est posé sur la page (halo derrière), la carte d'offre est le seul objet encadré. Moins de boîtes dans la boîte, plus d'air.

- Conteneur : `grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12` ; `pt-6 md:pt-10`.
- Colonne texte `lg:col-span-7` : `BadgePremium grand` ; phrase `sr-only` T4 ; H1 `mt-4 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl` ; promesse `mt-4 max-w-xl text-lg text-text-secondary md:text-xl [text-wrap:balance]` ; pastilles `mt-6 flex flex-wrap gap-2`.
- Pastille « dedans » (non cliquable, donc sans bord) : `inline-flex items-center gap-2 rounded-full bg-background-elevated px-3 py-1.5 text-sm text-text-secondary` + point `h-1.5 w-1.5 rounded-full bg-accent-primary` (`aria-hidden`). À 375 : `text-xs px-2.5 py-1`, trois rangées environ.
- Colonne offre `lg:col-span-5` : `OffreApercu`.
- Dégradé du H1 (`text-gradient`) non utilisé : un seul accent fort (le plein et sa carte).

Largeurs :

| Largeur | Rendu |
|---|---|
| 375 | une colonne ; hero environ 360 px avant le bouton, bouton en pleine largeur à environ 460 px de haut de page (113 px de barre collante comprise) : visible sans défiler dans les 667 px ; `OffreApercu` `p-5` |
| 768 | une colonne, `max-w-2xl` pour le texte, offre dessous pleine largeur, boutons `h-12` ; extrait pleine largeur, tuiles en 2 colonnes (voir §5.2) |
| 1280 | 7/5 côte à côte, offre centrée verticalement, hero environ 330 px, début de l'extrait visible sans défiler |
| 1920 | identique à 1280 (coque plafonnée) ; le halo prolonge le fond |

### 3.6 Ce qui change par rubrique

Le squelette (`HeroApercu` + `ExtraitCoupe` + fin + légende) est constant. Variables : promesse, pastilles, contenu de l'extrait (spec UX §2.4). Les pastilles de « Quoi répondre » (catégories) sont non cliquables dans l'aperçu : même style sans bord.

## 4. Tableau de bord abonné : les 7 zones

Grille : `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12`. Chaque cellule `min-w-0`, tuiles `flex h-full flex-col` (hauteur égale par rangée, le pied d'action en `mt-auto`).

Tuile standard (Z3, Z4, Z5, Z7) : `CADRE` sans filet, soit `relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background-card p-5 [overflow-wrap:anywhere]` (pas de `FILET_CARTE`). Étiquette `ETIQUETTE`. Titre `mt-2 font-display text-lg font-bold text-text-primary`.

Pied d'action de tuile (Z3, Z4) : `-mx-5 -mb-5 mt-auto flex min-h-12 items-center justify-between border-t border-border px-5 text-sm font-semibold text-accent-link transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary` + chevron `h-4 w-4`. Cible de 48 px sur toute la largeur, jamais un second plein.

### Z1 Action du jour (dominante)

- Carte : avec filet. `CADRE_CARTE` + `border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 via-background-card to-background-card p-6 md:p-8`. C'est la seule carte teintée de la page.
- Structure dès `md` : `grid gap-x-8 gap-y-4 md:grid-cols-[1fr_auto] md:items-end` ; rangée 1 (`md:col-span-2 flex items-center justify-between`) : étiquette violette `text-xs font-semibold uppercase tracking-wide text-accent-link` à gauche, durée `text-sm text-text-secondary tabular-nums` à droite ; rangée 2 : titre à gauche, bouton à droite.
- Titre : `font-display text-2xl font-bold leading-snug text-text-primary md:text-3xl [text-wrap:balance]`. La scène par défaut de 62 caractères tient sur 2 lignes à 1280.
- Bouton : `buttonVariants({ variant: "primary", size: "lg" })` + `w-full md:w-auto md:min-w-44`. Le seul plein de l'écran.
- Variante « Étape en cours » : sous le titre, ligne `mt-4 flex items-center gap-3` : barre `h-2 flex-1 rounded-full bg-background` + remplissage dégradé ; « Étape n sur N » `text-sm font-semibold tabular-nums text-text-primary`. Parcours en `text-sm text-text-secondary`. Bouton « Reprendre ».
- Variante « Si tu as 5 minutes » : « Nouvelle » et « À revoir » en pastilles non bordées `rounded-full bg-background px-2.5 py-1 text-xs text-text-secondary`, nombre en `font-semibold text-text-primary tabular-nums`.
- Hauteur : mini 232 px dès `md` ; ensuite elle suit Z2 (`items-stretch` natif).
- Largeurs : 375 une colonne, bouton pleine largeur, `p-6` ; 768 pleine largeur en bandeau (titre gauche, bouton droite) ; 1280 et 1920 `lg:col-span-8` ; 1024 pareil.

### Z2 Ton cap (récompense, série, XP)

- Carte : sans filet (Z1 porte l'accent), `rounded-xl border border-border bg-background-card p-5 md:p-6`.
- Haut : `ETIQUETTE` « Ton cap » ; nom du cap `mt-2 font-display text-xl font-bold text-text-primary` ; « cap n sur 5 » `text-sm text-text-secondary` à droite du nom (`flex items-baseline justify-between`).
- Segments : `mt-4 flex gap-1.5` ; chaque segment `h-2 flex-1 rounded-full` ; rempli `bg-accent-primary` (3,6:1 sur carte, non textuel), vide `bg-border`. `aria-hidden` (le texte « cap n sur 5 » porte l'information).
- Bas, abonné avec XP et/ou série : `mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5`. Chaque statistique : nombre `font-display text-3xl font-bold tabular-nums text-text-primary` (flamme `h-5 w-5 text-accent-primary` devant le nombre de série) ; libellé `mt-1 text-xs text-text-secondary`. Aide de la série en dessous : `mt-4 text-xs text-text-muted`.
- Nouvel abonné : pas de grille de statistiques ; la phrase `serieZero` en `mt-5 border-t border-border pt-5 text-sm text-text-secondary`, avec une flamme `h-4 w-4 text-text-muted` devant (éteinte). Jamais « 0 XP » ni « 0 jour ».
- Largeurs : 375 pleine largeur ; 768 pleine largeur en bandeau `md:flex md:items-center md:gap-8` (cap et segments à gauche, statistiques à droite, sans le trait du haut) ; 1280 `lg:col-span-4`, hauteur égale à Z1.

### Z3 Parcours en cours / Étape conseillée

- Tuile standard. Titre : nom du parcours. Abonné avancé : barre `h-2` + « Étape n sur N » `text-sm tabular-nums` ; titre de l'étape `text-sm text-text-secondary`. Pied d'action : « Reprendre » ou « Commencer l'étape 1 ».
- Largeurs : 375 pleine ; 768 `md:col-span-1` ; 1280 `lg:col-span-4`, ou `lg:col-span-5` en état nouvel (à côté de « 4 premières semaines » en col-7).

### Z4 Mission

- Toute la tuile est un lien (`<a>` sur la carte, focus : `focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`, `hover:border-border-hover`). Étiquette « Mission · Marche n », titre `text-lg`, chevron en bas à droite ; « Facultative » en pastille non bordée `rounded-full bg-background-elevated px-2.5 py-0.5 text-xs text-text-secondary`. Pas de pied séparé (la carte entière est la cible, bien au-dessus de 44 px).
- Largeurs identiques à Z3.

### Z5 Cartes du jour / « C'est tout pour aujourd'hui »

- Tuile standard. Rafale non faite (Z1 est l'étape) : carte secondaire, titre « Si tu as 5 minutes », pastilles de comptes (comme Z1), bouton `BOUTON_SECONDAIRE` pleine largeur de tuile en bas (`mt-auto pt-4`, `w-full`). Jamais plein.
- Rafale faite : coche dans un rond `inline-flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success` (rond de sens, pas décoratif) ; titre « C'est tout pour aujourd'hui » à côté, `flex items-center gap-3`. Pas de lien. La seule note de couleur verte de la page.
- Largeurs : comme Z3.

### Z6 Contenu du jour

- Réutiliser telles quelles les cartes de l'accueil (`home/daily-content.tsx`, filet violet inclus) : l'étalon. Aucun nouveau style.
- H2 : `font-display text-2xl font-bold text-text-primary md:text-3xl`, aligné à gauche (l'accueil le centre ; le tableau de bord est à gauche).
- Grille : `grid gap-6 md:grid-cols-2 lg:grid-cols-3` ; vidéo `md:col-span-2 lg:col-span-1`. [PROPOSITION : « Une autre » de la vanne en `mt-auto` en bas de carte, pour réduire les 150 px de vide de la capture 1280. À valider par @fullstack, composant existant.]
- Largeurs : 375 empilées ; 768 2 + 1 pleine ; 1280 et 1920 3 x col-4.

### Z7 Question C9

- Tuile standard, pleine ligne. Dès `lg` : `lg:grid lg:grid-cols-12 lg:items-center lg:gap-6` ; question `lg:col-span-4` en `text-base font-semibold text-text-primary` ; les 4 réponses `lg:col-span-8` : `flex flex-wrap gap-2` avec `puce()` (44 px, déjà au format). En dessous de `lg`, question puis puces empilées. Disparaît une fois répondue ; aucune cellule vide.

## 5. Grilles par largeur et états

### 5.1 Tableau des spans

| Zone | 375 | 768 (`md:grid-cols-2`) | 1280 / 1920 (`lg:grid-cols-12`) |
|---|---|---|---|
| Z1 | `col-span-1` | `md:col-span-2` | `lg:col-span-8` |
| Z2 | idem | `md:col-span-2` | `lg:col-span-4` |
| Z3 + Z4 + Z5 (3 présentes) | empilées | Z3, Z4 : 1 colonne ; Z5 `md:col-span-2` | chacune `lg:col-span-4` |
| 2 présentes | empilées | 1 colonne chacune | chacune `lg:col-span-6` |
| 1 présente | pleine | `md:col-span-2` | `lg:col-span-12` |
| Nouvel : Z3 + « 4 semaines » | empilées | 1 colonne chacune | `lg:col-span-5` + `lg:col-span-7` |
| Z6 | empilées | 2 + 1 | 3 x `lg:col-span-4` |
| Z7 | pleine | `md:col-span-2` | `lg:col-span-12` |

Le nombre de cellules d'une rangée est calculé côté serveur (aucune rangée à moitié vide). 1456 et 1920 : même rendu que 1280, seule la marge latérale grandit (halo visible).

### 5.2 État vide du nouvel abonné

| Zone | Rendu |
|---|---|
| Z1 | « Ton premier pas », carte teintée, bouton plein « Commencer » |
| Z2 | nom du cap (`Tu t’échauffes`), « cap 1 sur 5 », un segment violet + 4 vides, `serieZero` éteint, pas de statistiques |
| Z3 | « Étape conseillée » + nom du parcours + pied d'action « Commencer l'étape 1 » (lien, jamais plein) |
| Z4 absente, remplacée par « Tes 4 premières semaines » | tuile standard, `ol` `divide-y divide-border`, chaque ligne `flex items-baseline gap-4 py-3` : numéro `w-8 font-display text-2xl font-bold tabular-nums text-accent-primary` (ligne 1) ou `text-text-muted` (lignes 2 à 4), libellé `text-sm text-text-primary` (ligne 1) ou `text-text-secondary`. Le seul usage du violet en chiffre. |
| Z5, Z7 | absentes |
| Z6 | présente |

Aperçu de la même grille (extrait fermé) : rangée 2 en 3 x col-4 (Étape conseillée, Mission, Contenu du jour) comme le wireframe 1280 de la spec UX §3.4.

## 6. Détails transverses

**Contrastes AA** (calculés sur les tokens) : `text-secondary` sur card 7:1 ; `text-muted` sur card 5,9:1 et sur `background-elevated` 5,1:1 ; `accent-link` sur card ou `accent-primary/10` plus de 5:1 ; blanc sur `accent-secondary-hover` 6,6:1 ; `accent-primary` en chiffre de 24 px gras seulement (3,6:1, seuil grand texte 3:1) ; segments pleins 3,6:1 (non texte 3:1). Extrait atténué : texte au moins 3,9:1 (inerte, exempté du 4,5:1 mais non sous 3:1).

**Cibles 44 px** : boutons `h-12`, `BOUTON_SECONDAIRE` et `puce()` en `min-h-11`, pieds de tuile `min-h-12`, Z4 entière cliquable. Les pastilles non cliquables (hero, « Facultative ») n'ont pas besoin de 44 px.

**Focus visibles** : boutons via `buttonVariants` (anneau `accent-link`), tuiles liens `focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`, pieds de tuile `ring-inset` (l'anneau extérieur serait coupé par `overflow-hidden`). Jamais `outline-none` sans anneau.

**Mode sombre** : site sombre unique ; aucune variante `dark:`. Les opacités de tokens (`/10`, `/15`, `/30`) sont les seuls ajustements.

**Mouvement** : aucune nouvelle animation. Barres et fondu statiques ; `transition-colors` seulement. `prefers-reduced-motion` : rien à désactiver.

**Chiffres et texte ajouté** : toute valeur en `tabular-nums`.

## 7. Textes qui gênent la mise en page (aucune réécriture, seulement la coupe)

1. **« {xp} XP gagnés depuis ton arrivée » et « {n} jours de pratique d’affilée »** : pour mettre le nombre en grand il faut le séparer du reste. Couper sur le premier nombre (`/^(\d[\d\s  ]*)\s(.*)$/`, repli : phrase entière en taille normale si pas de nombre). Le texte lu reste identique (nombre puis libellé, dans le même parent).
2. **« Tu t’échauffes · cap 1 sur 5 »** : à couper sur « · » (nom en `text-xl`, « cap 1 sur 5 » en `text-sm`).
3. **Preuve « 1 500+ inscrits bossent leur humour. »** : même coupe sur le premier nombre.
4. **Réassurance** (2 à 3 lignes à 375 dans la carte d'offre) : aucune action, prévoir la hauteur.
5. **Aucun texte à changer**. Les textes neufs T1 à T4 de la spec UX tiennent : promesse 3 lignes à 375, 2 lignes à 1280.

## 8. Application et preuve attendue

- Tailwind seulement, helpers existants ; créer `TuileAbonne`, `StatChiffre`, `BarreProgression`, `SegmentsCap` si @fullstack veut factoriser (même classes que ci-dessus, aucune nouvelle valeur d'échelle).
- Captures à fournir (375, 768, 1280, 1920) : visiteur, gratuit, nouvel, avancé (rafale non faite), avancé (étape en cours). Critères Thomas à rejouer sur les rendus : PRO, BEAU, MÊME IDENTITÉ (comparer à `visiteur-accueil-1280.png`), AÉRÉ, CONVERSION (un plein dominant), HIÉRARCHIE (en plissant les yeux : H1, Z1, bouton), ACCESSIBLE.
- Points ouverts : halo de page (§1.5) ; « Une autre » en bas de carte (Z6) ; les deux boutons pleins du visiteur (header global + hero) assumés comme à l'accueil.
