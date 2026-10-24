# Design System — deviens-marrant.fr

## Palette de couleurs

### Fonds
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0D0D0D` | Fond principal |
| `background-light` | `#1A1A1A` | Fond secondaire (footer, sections) |
| `background-card` | `#1F1F1F` | Cards et conteneurs |
| `background-elevated` | `#2A2A2A` | Éléments surélevés (hover, actif) |

### Accents — Palette 100% violet
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-primary` | `#8B5CF6` | Accent principal (CTA, liens, badges, focus) |
| `accent-primary-hover` | `#A78BFA` | Hover de l'accent principal |
| `accent-secondary` | `#6D28D9` | Accent secondaire (boutons secondary, deep) |
| `accent-secondary-hover` | `#7C3AED` | Hover de l'accent secondaire |
| `accent-link` | `#A78BFA` | Texte violet courant (< 24 px), AA sur fond, carte et élevé |

**Règle (s17 tour 1, DES-1-03)** : `accent-secondary` est **interdit en couleur de texte** (2,3:1 sur fond sombre), réservé aux fonds de bouton et aux teintes de fond (`/10`). Texte violet = `accent-link`.

### États
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Texte, bordure et fond de succès (≈ 6,2:1 sur carte) |
| `error` | `#EF4444` | Bordures et fonds d'erreur seulement (≈ 4,0:1 en texte : sous AA) |
| `error-text` | `#F87171` | Tout texte d'erreur (≈ 6:1 sur carte, ≈ 5,4:1 sur `bg-error/10`), s17 tour 1 (DES-1-02) |

### Texte
| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#FFFFFF` | Texte principal |
| `text-secondary` | `#B3B3B3` | Texte secondaire |
| `text-muted` | `#9A9A9A` | Texte désactivé / labels |

### Bordures
| Token | Hex | Usage |
|-------|-----|-------|
| `border` | `#2A2A2A` | Bordure par défaut |
| `border-hover` | `#3A3A3A` | Bordure au hover |

## Typographie

- **Titres** : Plus Jakarta Sans 800/700 (font-display, chargée par `layout.tsx`), aussi sur les cartes sociales (s15)
- **Corps** : Inter (font-sans), regular/medium
- **Tailles** : system Tailwind (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl)

## Composants UI

### Button
Variants : `primary` (violet vif), `outline-accent`, `outline`, `ghost`, `danger` ; `secondary` (violet profond plein) est déprécié.
Tailles : `sm`, `md`, `lg`, `icon`

**Trois niveaux de boutons (revue design s21 M3, étendue s21 « température », `docs/design/cta-forme-place-s21.md` §1)** :
- **Niveau 1 = `primary`** (plein) : le pas suivant que CE visiteur est prêt à faire, **un seul par écran hors en-tête** (l'en-tête est du chrome, exempté ; masqué sur /abonnement et /register). La température se lit sur ce que le visiteur a déjà reçu dans la page : **froid** = étape 1 gratuite (hero, bloc de fin d'article, /parcours, résultat du quiz) ; **tiède** = Premium (carte d'accueil, murs de liste, fiches) ; **chaud** = Premium seul (/abonnement, fenêtre, fin d'étape 1). Un plein Premium porte toujours le prix TTC et la garantie dans le même écran ; un plein gratuit ne porte jamais de prix. Exceptions : une liste de choix équivalents (/parcours) a un plein par carte, jamais deux par carte.
- **Niveau 2 = `outline-accent`**, UNIQUE variante : l'alternative (étape 1 gratuite à côté d'un plein Premium, lettre). Bordure `accent-primary/80` (environ 3,2:1). Aucune surcharge locale de bordure (`border-accent-primary/60` interdit sur un bouton ; garde-fou dans `__tests__/ui/button.test.tsx`). Jamais deux boutons de niveau 2 vers la même destination dans le même écran (revue s21 : doublon fiches conseil et vidéo).
- **Niveau 3 = lien texte** : **L1** lien fort `inline-flex min-h-11 items-center text-base font-semibold text-text-primary underline decoration-accent-link decoration-2 underline-offset-4 text-center [text-wrap:balance]` (le payant sous un plein gratuit) ; **L2** lien discret `LIEN_L2` (`text-accent-link underline underline-offset-2 min-h-11 text-sm`). Une seule constante par style, partagée (pas de copie par composant).
- **`outline`** (bordure neutre) : utilitaire seulement (annuler, retour, voir tout).
- **Libellé long** : tout bouton dont le libellé peut passer sur 2 lignes à 360 px (nom de parcours, prix) porte `h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance]` ; le prix reste groupé (« · » et « € » précédés d'une espace insécable). Un bouton qui passe de 1 à 2 lignes sans que son haut bouge est accepté (cible 64 px).
- **Anneau de focus du `primary`** : `focus-visible:ring-accent-link` (≈ 7:1 sur carte), pas `accent-secondary-hover` (≈ 2,9:1 sur `background-card`, sous 3:1). Écart relevé par la revue s21 : à corriger dans `button.tsx`.

### Blocs d'appel (s21)
Plafonds de hauteur à 375 px de large, contrôlés par la QA (mesure du bloc réel, pas du nombre de caractères) :
| Bloc | Composant | Plafond | Règle de forme |
|------|-----------|---------|----------------|
| Encart du milieu d'article (B1) | `DemoVanne` | 400 px | `aside` nommé, `my-10 rounded-lg border border-border bg-background-card p-5 sm:p-6`, objet sombre `rounded-md border border-border bg-background p-4`, jamais de filet violet ni de repli, un seul plein, objet non cliquable |
| Bloc de fin d'article (B2) | `ArticleCta` | **600 px** (était 560 : la vanne de la spec a été remplacée par le paragraphe validé), plein à 450 px ou moins du haut du bloc, bloc entier + en-tête 64 px ≤ 667 | plein étape 1, lien L1, note `text-xs text-text-muted`, plus de puces ; paragraphe en `text-sm leading-5` sous 640 px |
| Fiches vanne, conseil, vidéo (B8 à B10) | `BlocExercice` | 330 px | titre, texte, plein Premium, ligne prix, contour étape 1, lien L2 ; boutons empilés, **largeurs égales** dès `sm` (`sm:w-full sm:max-w-lg`) |
| Murs de liste (B7) | `MurListe` | 330 px | plein, prix, contour étape 1 ; « Voir Premium » en L2 sur les cartes verrouillées |
| Fin d'étape 1 (B14) | `CarteEtapeSuivante` | 180 px (carte seule) | jamais de plein dans la carte ; un plein unique dessous |
| Carte Premium d'accueil (B4 + B5) | `PremiumCta` | — | plein Premium, contour étape 1 de Répartie, dans le même écran ; liste d'intro en `<ul>` alignée à gauche, nom du parcours en `font-semibold text-text-primary` ; ne pas répéter la liste des parcours dans la carte |

**Fenêtre Premium (B11) = panneau qui monte du bas sur mobile** : `Modal sheet` (`items-end sm:items-center`, `rounded-t-2xl sm:rounded-2xl`, `max-h-[90dvh] overflow-y-auto`), pied collant `sticky bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))]` avec le plein, fermeture 44×44 en haut à droite, plein avec `[text-wrap:balance]`, lien L2 à 4 px du plein.

**Notes sous un plein** (`text-xs text-text-muted`, 6:1) : jusqu'à 4 lignes à 375 px (limite de texte : 200 caractères), `text-balance`, centrées sous un bouton centré.

### En-tête (budget de largeur, revue design s21)
Largeur utile 992 px à 1024, 1248 px dès 1280 (max-w-7xl). Tout est `shrink-0`. De 1024 à 1279 : recherche en loupe (panneau `#mobile-search`) ; dès 1280 : champ `w-44`. Compte connecté : « Favoris », « Mon profil », « Déconnexion » dans un seul menu Radix (`account-menu.tsx`) ; « Activer mon accès » reste dans la barre. Un onglet ou un bouton de plus doit d'abord trouver sa place dans ce budget (tableau dans `components/layout/header.tsx`), sinon il va dans le menu de compte ou le menu déroulant. Garde-fou : `playwright/tests/local/header-budget.spec.ts` (6 largeurs x 3 états). Menu déroulant mobile : hauteur maximale = écran moins la barre, défilement interne.

### Contrôles natifs
`color-scheme: dark` sur `:root` (`styles/globals.css`) : cases à cocher, barres de défilement, listes déroulantes et saisie automatique dessinées en sombre (plus de carré blanc sur fond noir).

### Card
Fond `background-card`, bordure `border`, hover `border-hover`, radius `lg`

### Badge
Variants : `default`, `primary`, `secondary`, `success`, `error`, `premium`

### Input
Fond `background-light`, bordure `border`, focus `accent-primary`

### ProgressBar
Variants : `primary`, `secondary`, `gradient`

### StreakCounter
Animation pulse sur l'emoji feu (coupée si mouvement réduit), fond `accent-secondary/10`, texte `accent-link` « {n} jours de pratique d'affilée » + aide (étalon 3.8 A)

### Interrupteur (s17 tour 1, DES-1-08)
`<input type="checkbox" role="switch" class="peer sr-only">` + piste `h-6 w-11 rounded-full` (`background-elevated`, cochée `accent-primary`, focus visible `accent-primary`) + pastille blanche `h-5 w-5`, le tout dans un `<label>` de 44 px de haut. Pour un interrupteur (oui/non), jamais de case native : la piste ci-dessus. Pour une case de consentement (lettre), la case native est admise, dessinée en sombre par `color-scheme: dark` (voir plus haut).

## Animations

- `fade-in` : 300ms ease-in-out
- `slide-up` : 300ms ease-out
- `scale-in` : 200ms ease-out
- `streak-pulse` : 2s ease-in-out infinite
- `xp-float` : 2s ease-out notification +XP

## Directives personas

Le design doit satisfaire simultanément 3 profils :

### Yanis (20 ans, étudiant)
- Interface engageante type « gaming » : animations XP, badges, streak avec pulse
- Utiliser les tons violets généreusement pour les éléments de progression
- Éviter un look « corporate » ou trop sobre — garder l'énergie
- Cards interactives avec transitions fluides (hover, scale, reveal)

### Sophie (26 ans, active)
- Design clean, scannable : hiérarchie visuelle claire, pas de surcharge
- Cards compactes avec l'info essentielle visible (setup de blague, catégorie)
- CTAs bien identifiés, actions rapides (favori, partage en 1 clic)
- Responsive impeccable sur mobile (elle consulte en pause café)

### Marc (34 ans, en reconstruction)
- Interface mature sans être austère : le dark mode Netflix convient bien
- Barres de progression bien visibles, feedback de réussite (XP gagné, niveau monté)
- Pas de design trop « ado » (éviter les emojis excessifs dans l'UI, les garder dans le contenu)
- Sections « Prochaine étape » et parcours structurés mis en avant visuellement
