# Relecture design : pagination numérotée des listes (s20, spec maillage S1)

Périmètre : `apps/web/src/components/ui/list-pagination.tsx` + `lib/list-pagination.ts`.
Preuves : captures `vannes-page-{1,6}-{375,1280}px.png` (lues une à une), `button.tsx`, `chip.ts`, `tailwind.config.ts`, `vannes-theme-nav.tsx`.
Données des captures simulées ; 12 pages ; thème sombre unique du site.

## Notes

| Device | Note | Résumé |
|---|---|---|
| Desktop 1280 | **8 / 10** | Propre, aligné, groupes lisibles. Deux écarts au système : page courante grise (le site marque la sélection en violet) et pas irrégulier des numéros à 2 chiffres. |
| Mobile 375 | **5 / 10** | 4 lignes (~195 px de haut), Précédent et Suivant orphelins, numéros 7 + 5 en quinconce, page courante peu contrastée. Fonctionnel mais maladroit. |

### Détail des constats (rendu réel)

1. **Cohérence design system (desktop et mobile).** Le site a un patron de « sélection courante » : `chipClass("active")` = fond `accent-secondary-hover` (#7C3AED), texte blanc, `font-semibold` (utilisé par `VannesThemeNav`, juste au-dessus de la liste). La pagination marque la page courante en gris `background-elevated` (#2A2A2A sur #0D0D0D, soit ~1,4:1) : le repère existe mais il est faible et il parle un autre langage que les pastilles. Sur la capture mobile page 1, la case « 1 » se devine à peine.
2. **Hiérarchie.** À 1280 px la page courante se lit, mais ce n'est pas un des « 3 éléments qui ressortent en plissant les yeux » (critère 9). Le violet corrige ça sans nouvelle couleur.
3. **Espacement desktop.** Cellules `min-w-8` + `px-3` : « 1 » à « 9 » font 32 px, « 10 », « 11 », « 12 » font ~41 px. Mesuré : pas de 36-37 px pour les chiffres seuls, 42 px après 10 (captures : 10 à x=773, 11 à x=815, 12 à x=856). Rythme irrégulier. Le groupe Précédent / numéros / Suivant (gap-x-4 contre gap-1) est bon.
4. **Mobile.** `flex-wrap` sur 12 cellules de 44 px : 7 + 5 centrés (le « 8 » tombe sous le « 2 »), aucune colonne alignée (critère ALIGNÉ). Précédent et Suivant seuls sur leur ligne, sans bordure : rien n'indique que ce sont des boutons (convention du site : « bordé = cliquable », chip.ts). Cibles tactiles 44 px respectées (point positif, à garder).
5. **Disabled.** Précédent désactivé page 1 : opacité 50 %, correct (exempté WCAG), ne pas toucher.

## Décision : « Page X / Y »

**Ne pas le rétablir.** X est porté par la case violette (+ `sr-only` « Page » + `aria-current="page"`), Y par le dernier numéro, toujours rendu (liste complète jusqu'à 15 pages, et en mode abrégé `totalPages` est toujours dans la rangée). Le texte serait redondant et coûterait une ligne de plus sur mobile. Aucun ajout accessibilité nécessaire (les lecteurs d'écran annoncent déjà « Page 6, page courante »).

## Correctif exact (mobile 4 lignes en 3, desktop inchangé)

Principe : sous 768 px (`md`, le même seuil que `max-md:h-11` du bouton) la nav devient une grille ; numéros en `grid-cols-6` (12 pages = 2 rangées de 6 parfaitement alignées, cellules ≥ 44 px dès 320 px de large) ; Précédent / Suivant côte à côte dessous, pleine demi-largeur, bordés. À partir de `md` : rendu actuel.

```tsx
// Constantes (remplacent PAGE_CELL)
// px-1 : même pas pour 1 et 2 chiffres. tabular-nums : chiffres de largeur égale.
const PAGE_CELL = "px-1 tabular-nums md:min-w-8 max-md:w-full max-md:min-w-11";
// Précédent / Suivant : bordés sur mobile (convention « bordé = cliquable »), ghost dès md.
const STEP =
  "max-md:w-full max-md:border max-md:border-border max-md:text-text-primary max-md:hover:border-border-hover";
const PREV = cn(STEP, "max-md:order-2");
const NEXT = cn(STEP, "max-md:order-3");
```

Nav et liste :

```tsx
<nav
  aria-label="Pagination"
  className="mx-auto mt-8 grid w-full max-w-sm grid-cols-2 gap-2 md:flex md:max-w-none md:flex-wrap md:items-center md:justify-center md:gap-x-4 md:gap-y-2"
>
  {page > 1 ? link(page - 1, "Précédent", PREV) : (
    <Button variant="ghost" size="sm" disabled className={PREV}>Précédent</Button>
  )}
  <ol className="order-1 col-span-2 grid grid-cols-6 gap-1 md:flex md:flex-wrap md:items-center md:justify-center">
```

Cellules :

```tsx
// ellipsis : ajouter max-md:h-11 max-md:w-full
<span className={cn("inline-flex items-center justify-center text-sm text-text-secondary max-md:h-11 max-md:w-full", PAGE_CELL)}>…</span>

// page courante : même violet que chipClass("active"), neutralise le hover ghost (non cliquable)
<span
  aria-current="page"
  className={cn(
    buttonVariants({ variant: "ghost", size: "sm" }),
    PAGE_CELL,
    "cursor-default bg-accent-secondary-hover text-white hover:bg-accent-secondary-hover hover:text-white",
  )}
>
```

Suivant : `link(page + 1, "Suivant", NEXT)` et `<Button variant="ghost" size="sm" disabled className={NEXT}>`.

Notes d'implémentation :
- `max-w-sm` (384 px) sur la nav évite des cellules de 100 px entre 640 et 767 px (cases centrées, ~60 px de large).
- `order-1/2/3` ne s'applique que sous `md` : le DOM reste Précédent, numéros, Suivant (ordre de lecture des lecteurs d'écran et ordre du HTML serveur inchangés, aucun lien masqué, aucun `display:none`). Compromis assumé : sur mobile, Précédent est visuellement sous les numéros alors qu'il vient avant dans l'ordre de tabulation ; usage clavier sur mobile marginal, ordre SR logique. Si ce compromis déplaît, l'alternative sans `order` est de garder les 4 lignes (rejetée : maladroit).
- Aucune nouvelle URL, aucun nouveau token (`accent-secondary-hover`, `border`, `border-hover`, `text-primary` existent).
- Au-delà de 15 pages (11 cellules max, ellipses incluses) : 6 + 5 en grille, toujours aligné.
- Gain mobile : ~195 px → ~144 px (2 × 44 + 4 + 8 + 44) ; ≤ 6 pages : 96 px.

## Contrastes (thème sombre)

| Élément | Couleurs | Ratio | Verdict |
|---|---|---|---|
| Page courante (après) | blanc sur #7C3AED | ~5,7:1 | AA |
| Page courante vs fond page (indicateur) | #7C3AED sur #0D0D0D | ~3,3:1 | OK (3:1 composant) |
| Numéros | #B3B3B3 sur #0D0D0D | ~9:1 | AA |
| Page courante (avant) | #2A2A2A sur #0D0D0D | ~1,4:1 | trop faible |

Focus : `ring-accent-primary` + offset hérité de `buttonVariants` (inchangé).

## À vérifier après correction (boucle visuelle)

Recapturer pages 1, 6 et 12 à 320, 375, 768 et 1280 px, plus un cas > 15 pages (ellipses). Attendus : 3 lignes à 375 px, colonnes alignées, case violette visible, aucun débordement horizontal à 320 px, pas de variation de pas à 10-12 sur desktop.

## Notes projetées après correctif

Desktop 10 / 10, mobile 9,5 à 10 / 10 (sous réserve de la recapture ; le seul résidu est le compromis d'ordre visuel/DOM ci-dessus).
