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

---

# Tour 2 : relecture du commit `e906661` (arbitrage design + UX)

Preuves : les 16 captures `pagination-vannes-*` lues une à une (p1/p6/p12 à 320, 375, 768, 1280 ; 30 pages p10 à 375 et 1280 ; avant/après clic 7 à 375), plus `list-pagination.tsx`, `list-results.tsx`, `lib/list-pagination.ts`. Données simulées, thème sombre.

## Notes

| Device | Tour 1 | Tour 2 | Reste |
|---|---|---|---|
| Desktop 1280 (et 768) | 8 | **10 / 10** | rien |
| Mobile 375 (320, 360) | 5 | **9 / 10** | 1 micro-correctif visuel (ci-dessous) |

## Ce qui est résolu (constaté sur le rendu)

- **Desktop** : pas régulier de 36 px de 1 à 12 (1280 : 10 à x=775, 11 à 811, 12 à 847), page courante violette (même #7C3AED que `chipClass("active")`), Précédent / Suivant en texte ghost avec écart de groupe, extrémité inactive de même largeur (la rangée ne bouge pas d'une page à l'autre). 768 identique, propre. Tablette tactile : couverte par `[@media(pointer:coarse)]`, non capturable ici.
- **Mobile 375** : une grille 7 + 7 parfaitement alignée (colonnes x=39, 89, 138, 187, 237, 286, 335), 2 lignes (~90 px, contre ~195 avant), chevrons bordés 44 px (« bordé = cliquable »), page courante violette lisible sur p1, p6 et p12, géométrie identique sur toutes les pages. Précédent en haut à gauche, Suivant en bas à droite (zone du pouce).
- **Mobile 30 pages (ellipses)** : 14 cellules, 7 + 7, `1 2 … 8 9 [10]` puis `11 12 … 29 30 ›` : aucune rupture, courante toujours visible, « … » en gris secondaire non cliquable.
- **Mobile 320** : 5 + 5 + 4 (3 lignes), sans débordement ; la dernière rangée a une case vide à droite, acceptable (cas limite, colonnes calculées pour des rangées quasi égales).
- **Après clic 7 (375)** : la liste arrive en haut sous l'en-tête collant (première carte « Vanne 73 », marge 16 px sous le header, `scroll-mt-20` correct). La capture « avant-clic » montre la liste atténuée (60 %) avec la courante encore sur 1 : c'est en réalité l'état de chargement (`pending`), cohérent (indicateur et contenu sur la même page, pagination intacte). Le feedback de tap existe bien.
- **Accessibilité lue dans le code** : « Page 6 sur 12 » en `sr-only`, `aria-label` des chevrons contenant le texte visible (« Page suivante (page 7) » contient « suivant » : 2.5.3 respecté), extrémités inactives non annoncées, focus ring hérité.

## Reste à corriger (mobile : 9 → 10)

**Constat** : à 2 px d'écart, la pastille violette (47 × 44) touche presque la bordure du chevron voisin : p1 (violet « 1 » à x=65, bord du chevron Précédent à x=63) et p12 (violet « 12 » finit à x=310, chevron Suivant commence à x=312). Le contraste violet / contour crée une tension visuelle (critères PROPRE, AÉRÉ), et la pastille rectangulaire (47 × 44) est moins nette qu'un carré.

**Correctif exact** (`list-pagination.tsx`, une ligne) : cellules carrées 44 px centrées dans leur colonne.

```tsx
// avant
const MOBILE_CELL = "max-md:h-11 max-md:w-full max-md:min-w-11";
// après : ~5 px entre pastille et chevron à 375 px, 14 px à 320 px, cible toujours 44 × 44
const MOBILE_CELL = "max-md:mx-auto max-md:h-11 max-md:w-11";
```

`mx-auto` agit car chaque `<li>` est `flex`. `min-w-11` devient redondant (retiré). Aucune autre classe à changer : `gap-0.5` et les colonnes (7 max dès 360 px : cellule 45,1 px ≥ 44) restent valables. Les cibles tactiles passent de 47 × 44 à 44 × 44 (conforme à la règle 44 px du projet).

**Vérification** : recapturer p1 et p12 à 375 px ; attendu : écart visible d'environ 5 px entre la pastille violette et le contour du chevron, pastille carrée 44 × 44. Après cela : mobile 10 / 10.

## Points non bloquants (pas de correctif demandé)

- Test `pagination-numerotee-s20.test.tsx` : l'assertion `not.toMatch(/nofollow|display:\s*none|hidden/)` échoue à cause de `aria-hidden` ; la cibler sur `class="[^"]*\bhidden\b` et `display:\s*none` (déjà signalé par @ux). Les libellés Précédent / Suivant sont bien dans le HTML (`max-md:sr-only`, pas `display:none`).
- Renommer la capture « avant-clic-7 » en « pendant-chargement-7 » pour ne pas induire en erreur la prochaine lecture.
- Décision « Page X / Y » : confirmée, non rétabli (X = violet + `sr-only`, Y = dernier numéro + « sur Y » `sr-only` + annonce `role="status"`).

Verdict tour 2 : **GO** après le correctif d'une ligne ci-dessus. Notes finales attendues : desktop 10 / 10, mobile 10 / 10.
