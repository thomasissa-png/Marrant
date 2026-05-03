# Design mobile — Icônes app, splash, charte visuelle

> Assets pour soumission App Store + Google Play.
> Charte cohérente avec l'identité web (violet brand, ton complice).

## 1. Icône d'application

### Concept

Microphone stand-up stylisé sur fond violet gradient, avec un sourire subtil intégré dans la grille.
Reconnaissable à toute taille (du 16x16 favicon au 1024x1024 App Store).

### Charte couleurs

| Token | Hex | Usage |
|---|---|---|
| `brand-violet-primary` | #8B5CF6 | Fond icône principale |
| `brand-violet-deep` | #6D28D9 | Gradient bottom |
| `brand-violet-light` | #C4B5FD | Highlights |
| `surface-dark` | #0F0817 | Splash background, status bar |
| `text-on-violet` | #FFFFFF | Microphone, élément central |

### Tailles iOS requises (App Store + iOS app)

- **AppStore icon** : 1024x1024 (PNG, sans alpha, sans coins arrondis — Apple les ajoute)
- **iPhone** : 60pt @1x/2x/3x = 60, 120, 180 px
- **iPad** : 76pt @1x/2x = 76, 152 px
- **iPad Pro** : 83.5pt @2x = 167 px
- **Spotlight** : 40pt @2x/3x = 80, 120 px
- **Settings** : 29pt @2x/3x = 58, 87 px
- **Notification** : 20pt @2x/3x = 40, 60 px

### Tailles Android requises (Google Play + adaptive icon)

- **Play Store** : 512x512 (PNG, alpha autorisé)
- **mdpi** : 48x48
- **hdpi** : 72x72
- **xhdpi** : 96x96
- **xxhdpi** : 144x144
- **xxxhdpi** : 192x192

### Adaptive Icon Android (foreground + background séparés)

- **Foreground** : 432x432 (microphone uniquement, transparent)
- **Background** : 432x432 (gradient violet)
- Safe zone : 264x264 centre (le launcher peut masquer 30% des bords selon device)

### Source SVG

Voir `apps/web/resources/icon-source.svg` (master 1024x1024).

### Génération automatique

Capacitor fournit `npx capacitor-resources` ou `@capacitor/assets` pour générer toutes les tailles depuis un master :

```bash
# Depuis la racine du projet
npx @capacitor/assets generate \
  --iconBackgroundColor "#8B5CF6" \
  --iconBackgroundColorDark "#0F0817" \
  --splashBackgroundColor "#8B5CF6" \
  --splashBackgroundColorDark "#0F0817"
```

Inputs attendus dans `resources/` :
- `icon.png` (1024x1024 — master)
- `icon-foreground.png` (1024x1024 — pour adaptive Android)
- `icon-background.png` (1024x1024 — pour adaptive Android)
- `splash.png` (2732x2732 — master, centré)
- `splash-dark.png` (2732x2732 — variante dark mode)

## 2. Splash screen

### Concept

Logo blanc sur fond violet (gradient subtil du brand-violet-primary vers brand-violet-deep en bas).
Pas d'animation custom V1 — la transition fade-out de 200ms vers le webview suffit.

### Tailles iOS (LaunchScreen.storyboard ou assets)

Capacitor 6 utilise un LaunchScreen.storyboard avec contraintes adaptatives. Asset unique :
- 2732x2732 PNG (couvre tous les iPad/iPhone via aspect-fill)

### Tailles Android (drawable/splash)

- **port-mdpi** : 320x480
- **port-hdpi** : 480x800
- **port-xhdpi** : 720x1280
- **port-xxhdpi** : 960x1600
- **port-xxxhdpi** : 1280x1920
- **land-*** : versions paysage (mêmes ratios)

Toutes générées automatiquement par `@capacitor/assets`.

### Variantes light/dark

- Light : fond #8B5CF6, logo blanc
- Dark : fond #0F0817 (surface-dark), logo violet clair (#C4B5FD)

iOS et Android détectent automatiquement le mode système et basculent.

## 3. Status bar

- **Style** : DARK (icônes blanches sur fond sombre)
- **Background** : #0F0817 (cohérent splash dark)
- **Plugin Capacitor** : `@capacitor/status-bar` configuré dans `capacitor.config.ts`

## 4. Bottom tab bar (UI in-app)

3 onglets en bas (mobile uniquement, masqués en web) :

| Onglet | Icône Lucide | Route |
|---|---|---|
| Daily | `Sparkles` | `/` |
| Catalogue | `Layers` | `/vannes` |
| Compte | `User` | `/compte` |

Style :
- Fond `surface-dark` (#0F0817)
- Onglet actif : violet `#8B5CF6` + label
- Onglet inactif : gris `#6B7280`
- Hauteur : 56px + safe area inset (iPhone notch/home indicator)

## 5. Onboarding visuels

5 écrans avec dégradé violet vertical. Émojis et typo display déjà cohérents avec le web (Plus Jakarta Sans).

Voir specs détaillées dans `docs/mobile/onboarding-mobile.md`.

## 6. Asset checklist V1

| Fichier | Source | Taille | Statut |
|---|---|---|---|
| `resources/icon.png` | master 1024x1024 | 1024x1024 PNG | À générer (Lot 1) |
| `resources/icon-foreground.png` | master 1024x1024 alpha | 1024x1024 PNG | À générer (Lot 1) |
| `resources/icon-background.png` | gradient solide | 1024x1024 PNG | À générer (Lot 1) |
| `resources/splash.png` | master 2732x2732 | 2732x2732 PNG | À générer (Lot 1) |
| `resources/splash-dark.png` | variante dark | 2732x2732 PNG | À générer (Lot 1) |
| `resources/icon-source.svg` | source vectoriel | SVG | Créé (ce livrable) |

## 7. Screenshots App Store / Google Play (Lot 2 — ASO)

Tailles requises (iPhone 6.7" / 6.5" / 5.5") :
- 6.7" (iPhone 15 Pro Max) : 1290x2796
- 6.5" (iPhone 11 Pro Max) : 1242x2688
- 5.5" (iPhone 8 Plus) : 1242x2208

Android :
- Phone : 1080x1920 minimum
- Tablet : 1200x1920 minimum
- Feature graphic : 1024x500

Stratégie : 5-8 screenshots par store avec accroches courtes (voir `aso-mobile.md` pour les copies).

## Handoff → @orchestrator

- **Fichier produit** : `docs/mobile/design-mobile.md` + `apps/web/resources/icon-source.svg`
- **Décisions clés** :
  - Charte cohérente avec web (violet #8B5CF6 / #0F0817)
  - Icône reconnaissable : microphone stylisé sur gradient violet
  - Splash 2s max (guideline Apple), variante dark mode
  - Génération automatique via `@capacitor/assets` à exécuter en CI
- **Points d'attention** :
  - Master PNG (icon.png 1024x1024) à finaliser via export du SVG (étape technique au moment du build)
  - Screenshots stores produits en Lot 2 avec @copywriter (textes accroches)
- **Prochaines étapes** : Lot 2 — copywriter ASO + screenshots, Lot 3 review G31 (favicons étendu mobile)
