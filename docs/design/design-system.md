# Design System — deviensmarrant.fr

## Palette de couleurs

### Fonds
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0D0D0D` | Fond principal |
| `background-light` | `#1A1A1A` | Fond secondaire (footer, sections) |
| `background-card` | `#1F1F1F` | Cards et conteneurs |
| `background-elevated` | `#2A2A2A` | Éléments surélevés (hover, actif) |

### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-yellow` | `#F5C518` | Accent principal (CTA, liens, badges) |
| `accent-yellow-hover` | `#FFD93D` | Hover de l'accent jaune |
| `accent-orange` | `#FF6B35` | Accent secondaire (conseils, streaks) |
| `accent-orange-hover` | `#FF8555` | Hover de l'accent orange |

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

- **Titres** : Syne (font-display), bold
- **Corps** : Inter (font-sans), regular/medium
- **Tailles** : system Tailwind (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl)

## Composants UI

### Button
Variants : `primary` (jaune), `secondary` (orange), `ghost`, `outline`, `danger`
Tailles : `sm`, `md`, `lg`, `icon`

### Card
Fond `background-card`, bordure `border`, hover `border-hover`, radius `lg`

### Badge
Variants : `default`, `yellow`, `orange`, `success`, `error`, `premium`

### Input
Fond `background-light`, bordure `border`, focus `accent-yellow`

### ProgressBar
Variants : `yellow`, `orange`, `gradient`

### StreakCounter
Animation pulse sur l'emoji feu, fond `accent-orange/10`

## Animations

- `fade-in` : 300ms ease-in-out
- `slide-up` : 300ms ease-out
- `scale-in` : 200ms ease-out
- `streak-pulse` : 2s ease-in-out infinite

## Directives personas

Le design doit satisfaire simultanément 3 profils :

### Yanis (17 ans, lycéen)
- Interface engageante type « gaming » : animations XP, badges, streak avec pulse
- Utiliser les accents jaune/orange généreusement pour les éléments de progression
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
