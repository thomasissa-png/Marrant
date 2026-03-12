# Design System — deviensmarrant.fr

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
Animation pulse sur l'emoji feu, fond `accent-secondary/10`

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
