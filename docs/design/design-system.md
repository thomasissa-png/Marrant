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
Variants : `primary` (violet vif), `secondary` (violet profond), `ghost`, `outline`, `danger`
Tailles : `sm`, `md`, `lg`, `icon`

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
`<input type="checkbox" role="switch" class="peer sr-only">` + piste `h-6 w-11 rounded-full` (`background-elevated`, cochée `accent-primary`, focus visible `accent-primary`) + pastille blanche `h-5 w-5`, le tout dans un `<label>` de 44 px de haut. Jamais de case native sur fond sombre.

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
