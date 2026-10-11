# Audit de forme s14 : cohérence visuelle (hero, accueil, pages clés)

Auteur : @design. Périmètre : FORME uniquement. Aucun texte, prix, lien, slug, H1/H2 ne change. « 1 500+ membres » intact. Aucun tiret cadratin dans les textes visibles. Tokens et classes Tailwind déjà présents dans `apps/web/tailwind.config.ts` et `src/components/ui/*` uniquement.

Méthode : lecture du code (pas de capture disponible côté agent : les points marqués `[À VÉRIFIER CAPTURE]` demandent une preuve visuelle 375/768/1280 après application). Repères de tokens :
- Fonds : `background` #0D0D0D, `background-card` #1F1F1F, `background-elevated` #2A2A2A. Bordure `border` #2A2A2A, `border-hover` #3A3A3A.
- Textes : `text-primary`, `text-secondary` #B3B3B3, `text-muted` #9A9A9A, `accent-link` #A78BFA.
- Rayons : `rounded-lg` (0,75rem, token projet) = même rendu que `rounded-xl` Tailwind ; `rounded-2xl` = 1rem réservé aux grands panneaux (CTA, offres) ; `rounded-full` = pastilles/badges.

## Grammaire visuelle retenue (règle unique, à appliquer partout)

| Rôle | Forme | Classes |
|---|---|---|
| Lien-pastille cliquable | bordée, fond, hover violet, 44 px | `inline-flex min-h-[44px] items-center rounded-full border border-border bg-background-elevated px-4 text-sm text-text-secondary transition-colors hover:border-accent-primary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary` |
| Étiquette de contenu (non cliquable) | composant `Badge`, `text-xs`, sans bordure | PREMIER badge d'une rangée (étiquette « du jour », catégorie principale) = `primary` ; niveau/difficulté = `secondary` (jamais `error`, le rouge dit « erreur ») ; catégorie/type/technique secondaire = `default` ; gratuit/offert = `success` |
| Filtre / navigation en pastille | même peau que le lien-pastille, état actif plein | voir P0-3 : fichier partagé `chip.ts` (`chipClass("idle" \| "active")`) |
| Information non cliquable (atout) | texte + coche, sans fond ni bordure | `flex items-center gap-2 text-sm text-text-muted` + coche `text-success` |
| Bouton d'action | composant `Button` | `primary` = action dominante, `outline` = secondaire, `ghost` = tertiaire |
| Lien texte dans un contenu | violet, souligné au survol | `text-accent-link hover:underline` |

Référence consultée : guides de systèmes de design (Smart Interface Design Patterns « Badges vs Pills vs Chips vs Tags » ; design system du Queensland, composant Tag) : un composant statique ne doit pas ressembler à un bouton, un composant interactif ne doit pas ressembler à une étiquette. C'est exactement la règle appliquée ici.

Principe : une pastille bordée = on peut cliquer. Une étiquette sans bordure = on lit seulement. Jamais de mélange dans la même rangée.

---

## SYNTHÈSE

24 problèmes : 3 P0, 11 P1, 10 P2.

| ID | Priorité | Sujet | Fichier principal |
|---|---|---|---|
| P0-1 | P0 | Hero : 3 pastilles bordées + 2 libellés nus dans la même rangée | `home/hero-section.tsx` |
| P0-2 | P0 | Badges : variantes différentes pour le même rôle (« du jour », difficulté en rouge, catégorie) | `home/daily-content.tsx` |
| P0-3 | P0 | Filtres/navigations de /vannes sans contour, 3 peaux de pastille | `vannes/*`, `carnet-page.tsx` |
| P1-1 | P1 | Hero : espacement pastilles/CTA | `hero-section.tsx` |
| P1-2 | P1 | Hero connecté : boutons non pleine largeur en mobile, Link>Button | `hero-section.tsx` |
| P1-3 | P1 | Cartes statiques qui réagissent au survol ; bordure d'accent écrasée au survol | `feature-cards`, `daily-content`, `upcoming`, `abonnement`, `carnet-fiche-card` |
| P1-4 | P1 | 8 boutons violets pleins sur l'accueil | `feature-cards.tsx`, `daily-content.tsx` |
| P1-5 | P1 | Squelette du jour différent du carrousel | `daily-content.tsx` |
| P1-6 | P1 | « Prochainement » : padding, contraste d'icônes, pastille de vote | `upcoming-features.tsx` |
| P1-7 | P1 | Offres : padding mobile, titres sans police d'affichage | `premium-cta.tsx`, `abonnement/page.tsx` |
| P1-8 | P1 | Paywall du carnet : violet hors tokens, titre, bouton | `carnet-page.tsx` |
| P1-9 | P1 | Quiz /parcours : padding asymétrique | `parcours-content.tsx` |
| P1-10 | P1 | FAQ des catalogues : alignement et titre | `faq-section.tsx` |
| P1-11 | P1 | En-tête desktop : débordement probable 1024-1300 px | `layout/header.tsx` |
| P2-1 | P2 | Micro-textes du hero | `hero-section.tsx` |
| P2-2 | P2 | Sur-titres : 4 variantes du même style | carnet, daily, vannes-list, parcours |
| P2-3 | P2 | Link>Button imbriqués | 6 fichiers |
| P2-4 | P2 | Ordre des 3 parcours (à valider Thomas) | `hero-section.tsx` |
| P2-5 | P2 | Emojis des cartes persona | `app/(dashboard)/page.tsx` |
| P2-6 | P2 | Échelle de padding et d'écarts | home-cta, carnet, parcours |
| P2-7 | P2 | Cartes-liens de fin de page : 3 tailles | `vannes/page.tsx`, `parcours/page.tsx` |
| P2-8 | P2 | /liens : fond de carte, action dominante, survol | `liens/page.tsx` |
| P2-9 | P2 | Pied de page : lien e-mail, liste Produit mobile | `layout/footer.tsx` |
| P2-10 | P2 | Icônes seules desktop (conditionnel) | `layout/header.tsx` |

Choix pour le hero : sortir les 2 libellés de la rangée. Rangée A = 3 pastilles-liens (seules à avoir fond + contour = cliquable). Ligne B dessous = 2 libellés avec la coche `✓` verte du site, sans fond ni bordure, non cliquables, masqués sous 640 px.

---

## 1. HERO (`apps/web/src/components/home/hero-section.tsx`)

### P0-1 : rangée de 5 éléments de deux natures (le problème de la capture)

Fichier : `hero-section.tsx`, lignes 76-96.

Constat :
- 3 liens en pastille (`border`, `bg-background-elevated`, `px-4`, `min-h-[44px]`, `text-text-secondary`) et 2 libellés en texte nu (`bg-transparent px-3 py-1 text-text-muted`) dans le MÊME `ul flex-wrap`, au même `gap-3`. L'œil lit « 3 boutons + 2 restes », et les libellés non cliquables ont le même alignement que les pastilles sans en avoir la forme.
- Les libellés ont une boîte de 28 px de haut contre 44 px pour les pastilles : lignes de base décalées quand tout tient sur une ligne en desktop.
- `<li className="hidden sm:inline-block">` : `inline-block` n'a aucun effet sur un enfant flex, classe trompeuse.

Décision (arbitrage forme, textes inchangés, libellés conservés non cliquables et masqués en mobile) : DEUX GROUPES DISTINCTS.
1. Rangée A : uniquement les 3 pastilles-liens (inchangées dans leur forme).
2. Ligne B, à part, sous la rangée A : les 2 libellés en texte avec coche verte, sans fond ni bordure, centrés, masqués sous `sm`.
Raison : la forme dit la fonction. Bordé = clic. Coche + texte = argument rassurant. Plus aucune zone grise entre les deux. Plus propre que de mettre les libellés en pastille (ils sembleraient cliquables, ce que Thomas reproche) ou de les supprimer (interdit).

Avant (lignes 76-96) :
```tsx
<ul className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3">
  {HERO_PARCOURS_LINKS.map((item) => ( ... ))}
  {HERO_EXTRA_TAGS.map((label) => (
    <li key={label} className="hidden sm:inline-block">
      <span className="inline-block rounded-full bg-transparent px-3 py-1 text-sm text-text-muted">
        {label}
      </span>
    </li>
  ))}
</ul>
```

Après (remplacer lignes 76-96 ; les 3 `<li><Link>` restent identiques) :
```tsx
{/* Situations concrètes : 3 liens-pastilles (bordé = cliquable), sous le CTA (spec UX §2.8) */}
<ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
  {HERO_PARCOURS_LINKS.map((item) => (
    <li key={item.href}>
      <Link
        href={item.href}
        className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-background-elevated px-4 text-sm text-text-secondary transition-colors hover:border-accent-primary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        {item.label}
      </Link>
    </li>
  ))}
</ul>

{/* Atouts : texte informatif, NON cliquable (pas de fond ni de bordure), masqué en mobile : arbitrage Thomas s12 */}
<ul className="mx-auto mt-4 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted sm:flex">
  {HERO_EXTRA_TAGS.map((label) => (
    <li key={label} className="flex items-center gap-2">
      <span className="text-success" aria-hidden="true">✓</span>
      {label}
    </li>
  ))}
</ul>
```
Notes d'implémentation : `mt-4` → `mt-6` sur la rangée A (voir P1-1) ; `gap-3` → `gap-2 sm:gap-3` ; la ligne B garde `mt-4`. La coche est EXACTEMENT le glyphe `<span className="text-success" aria-hidden="true">✓</span>` déjà utilisé par `PremiumBenefits` (premium-benefits.tsx l.26) et par la liste du coaching (premium-cta.tsx l.120) : une seule coche dans tout le site, aucun nouvel asset. Constantes `HERO_EXTRA_TAGS` / `HERO_PARCOURS_LINKS` inchangées.
Rendu attendu : desktop = 3 pastilles centrées, puis dessous une ligne discrète « ✓ Un petit exercice par jour   ✓ Vannes prêtes à ressortir ». Mobile (375) = 3 pastilles seules, aucune ligne B.

### P0-2 : badges « du jour », difficulté et catégorie : une couleur différente pour le même rôle

Fichiers : `src/components/home/daily-content.tsx` l.87-91, 168-173, 242-251, 300-309 ; `src/components/parcours/parcours-list.tsx` l.22-26 ; `src/components/parcours/parcours-content.tsx` l.285.

Constat (même nature que la capture : des pastilles qui ne parlent pas la même langue) :
- Étiquette « du jour » : `primary` (Vanne), `secondary` (Conseil), `default` (Vidéo). Trois couleurs pour le même rôle sur trois cartes côte à côte.
- Catégorie : `default` (vanne, conseil) mais `secondary` (vidéo). Technique de la vidéo : `primary`, la couleur du badge « du jour » des autres cartes.
- Difficulté : `DEBUTANT secondary / INTERMEDIAIRE primary / EXPERT error` : « Expert » s'affiche en rouge, comme un message d'erreur (même table dupliquée dans `parcours-list.tsx`).
- « Essai gratuit » (parcours-content l.285) est `primary`, alors que le gratuit est un statut positif.

Correctifs (règle : voir tableau « Grammaire visuelle ») :
```tsx
// daily-content.tsx : supprimer la constante DIFFICULTY_VARIANT (l.87-91), puis
<Badge variant="primary">Vanne du jour</Badge>                       // l.168 : inchangé
<Badge variant="default">{JOKE_CATEGORY_LABELS[...]}</Badge>         // l.170 : inchangé
<Badge variant="primary">Conseil du jour</Badge>                     // l.242 : secondary -> primary
<Badge variant="secondary">{DIFFICULTY_LABELS[data.tip.difficulty] ?? data.tip.difficulty}</Badge> // l.245 : variant dynamique -> "secondary"
<Badge variant="default">{TIP_VIDEO_CATEGORY_LABELS[...]}</Badge>    // l.248 : inchangé
<Badge variant="primary">Vidéo du jour</Badge>                       // l.300 : default -> primary
<Badge variant="default">{TIP_VIDEO_CATEGORY_LABELS[data.video.category] ?? data.video.category}</Badge> // l.303 : secondary -> default
<Badge variant="default">{data.video.technique}</Badge>              // l.308 : primary -> default
```
```tsx
// parcours-list.tsx : remplacer la table l.22-26 par
const DIFFICULTY_VARIANT: Record<string, "secondary"> = {
  DEBUTANT: "secondary",
  INTERMEDIAIRE: "secondary",
  EXPERT: "secondary",
};
// parcours-content.tsx l.285
<Badge variant="success">Essai gratuit</Badge>
```
`VannesList` (l.287-293 : catégorie `primary`, type `default`) est déjà conforme à la règle. Les libellés ne changent pas : seule la variante change.

### P0-3 : filtres et navigations en pastilles : trois peaux différentes, dont une sans contour

Fichiers : `src/components/vannes/vannes-list.tsx` l.232-245 ; `src/components/vannes/vannes-theme-nav.tsx` l.21 ; `src/components/carnet/carnet-page.tsx` l.77-82 ; référence : pastilles du hero.

Constat :
- Hero : `rounded-full border bg-background-elevated`, hover violet.
- Filtres de catégories et pages thème de /vannes : `Button variant="ghost" size="sm"` (`rounded-lg`, aucune bordure ni fond) : seules la pastille active (violette pleine) et celle survolée ont une forme, les autres ressemblent à des mots flottants. C'est exactement le défaut « entourés / pas entourés » de la capture, sur la page la plus vue. Sur /vannes, deux rangées identiques se suivent (thèmes = liens, catégories = onglets) sans différence visuelle.
- Carnet (archives) : `rounded-lg border bg-background-card`, une 3e peau.
- Cible tactile : les filtres font 32 px de haut en desktop (`size="sm"`), 44 px en mobile seulement.

Correctif : UNE peau de pastille partagée. Créer `apps/web/src/components/ui/chip.ts` :
```ts
import { cn } from "@/lib/utils";

const BASE =
  "inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";
const IDLE =
  "border-border bg-background-elevated text-text-secondary hover:border-accent-primary hover:text-text-primary";
const ACTIVE = "border-accent-secondary-hover bg-accent-secondary-hover font-semibold text-white";

/** Pastille de lien/filtre : bordée = cliquable. `active` = sélection courante. */
export function chipClass(state: "idle" | "active" = "idle", className?: string): string {
  return cn(BASE, state === "active" ? ACTIVE : IDLE, className);
}
```
`vannes-theme-nav.tsx` (importer `chipClass`, retirer `buttonVariants`) :
```tsx
// avant
className={buttonVariants({ variant: isCurrent ? "primary" : "ghost", size: "sm" })}
// après
className={chipClass(isCurrent ? "active" : "idle")}
```
`vannes-list.tsx` l.232-245 (importer `chipClass`, plus de `Button` pour cette rangée ; `Button` reste utilisé ailleurs dans le fichier) :
```tsx
// avant
<Button key={cat.value} variant={category === cat.value ? "primary" : "ghost"} size="sm" role="tab" aria-selected={category === cat.value} onClick={() => handleCategoryChange(cat.value)}>
  {cat.label}
</Button>
// après
<button
  key={cat.value}
  type="button"
  role="tab"
  aria-selected={category === cat.value}
  onClick={() => handleCategoryChange(cat.value)}
  className={chipClass(category === cat.value ? "active" : "idle")}
>
  {cat.label}
</button>
```
`carnet-page.tsx` l.77-82 : `className="inline-flex min-h-[44px] items-center rounded-lg border border-border bg-background-card px-4 text-sm text-text-secondary transition-colors hover:border-accent-primary/40 hover:text-text-primary"` devient `className={chipClass()}` (importer `chipClass` ; `gap-2` du `ul` inchangé).
Hero (optionnel, même rendu) : remplacer la longue chaîne des 3 pastilles par `className={chipClass()}`.
Les deux rangées de /vannes (thèmes en liens, catégories en onglets) gardent leurs 24 px d'écart et partagent maintenant la même peau : l'onglet actif est plein violet, toutes les autres pastilles sont bordées.

### P1-1 : espacements verticaux du bloc sous le titre irréguliers

Lignes 34, 41, 61, 77 : `mt-4` (paragraphe), `mt-6` (preuve sociale), `mt-8` (CTA), `mt-4` (pastilles). Le groupe CTA contient déjà 3 éléments (bouton, mention de prix, lien souligné) en `gap-1` : les pastilles collées à 16 px du lien « Voir les vannes gratuites » se lisent comme un 4e élément du groupe CTA, pas comme un bloc séparé.
Correctif : rangée A `mt-4` → `mt-6` (déjà dans le P0-1). Ainsi l'échelle devient 16 / 24 / 32 / 24 / 16 : respiration plus grande entre le CTA et les situations, plus petite entre pastilles et atouts (ils appartiennent au même bas de hero).

### P1-2 : version « connecté » du CTA (lignes 47-59) : pas de pleine largeur en mobile, `Link > Button` imbriqué

Constat : en anonyme, le bouton est `w-full sm:w-auto`. En connecté, deux `Link` contenant des `Button` sans largeur : sur 375 px les boutons font leur largeur de texte, centrés, alors que l'anonyme est pleine largeur. Même page, même emplacement, deux gabarits. Un `<button>` dans un `<a>` est aussi du HTML invalide (focus double, zone de clic partielle).
Après :
```tsx
<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
  <Link
    href="/vannes"
    className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
  >
    Explorer les vannes
  </Link>
  <Link
    href="/conseils"
    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
  >
    Voir les conseils
  </Link>
</div>
```
Imports à ajouter : `import { Button, buttonVariants } from "@/components/ui/button";` et `import { cn } from "@/lib/utils";` (`buttonVariants` est déjà exporté par `ui/button.tsx`). Le bouton « Créer mon compte gratuit » reste un `Button` (ouvre une modale, ce n'est pas un lien).

### P2-1 : micro-textes du hero : trois styles pour quatre lignes

Ligne 41 : `text-sm font-medium text-accent-link` (preuve sociale) ; ligne 66 : `text-sm text-text-muted` (prix) ; ligne 69 : lien `text-sm font-medium text-text-secondary` souligné. Hiérarchie voulue (preuve sociale > prix > lien), aucune action requise. Seul point optionnel : la même phrase de preuve sociale est grise (`text-text-secondary`) dans l'offre de l'accueil (`premium-cta.tsx` l.95) : passer cette ligne à `text-sm font-medium text-accent-link` si Thomas veut une preuve sociale identique partout.

---

## 2. ACCUEIL (`src/app/(dashboard)/page.tsx` et `src/components/home/*`)

### P1-3 : cartes non cliquables qui réagissent comme des liens (et cartes « mises en avant » qui perdent leur bordure au survol)

Constat :
- `Card` (ui/card.tsx l.9) porte `hover:border-border-hover` en base. Les cartes purement informatives qui l'utilisent changent donc de bordure au survol alors qu'elles ne mènent nulle part.
- BUG visuel : sur les cartes avec bordure d'accent, la classe `hover:border-border-hover` de `Card` écrase la couleur voulue au survol (le `border-accent-primary` de base n'a pas de variante hover). Résultat : l'offre « Accès complet » de /abonnement passe du violet vif au gris #3A3A3A dès que la souris passe dessus, et les 4 cartes « Prochainement » perdent leur liseré violet.
- `FeatureCards` (l.80) et `DailyContent` (l.163, 237, 295) ont `hover:border-accent-primary/40` / `group` sur des conteneurs dont seuls certains éléments internes sont cliquables : la carte entière « s'allume » comme un lien.
- À l'inverse, les vraies cartes-liens (cross-links de /vannes, /parcours : `hover:border-accent-primary/40`) ont le même hover : impossible de distinguer cliquable et non cliquable. Règle à poser : seule une carte ENTIÈREMENT cliquable change de bordure.

Correctifs :
```tsx
// feature-cards.tsx l.80
// avant
className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40"
// après
className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card"

// daily-content.tsx l.163, 237, 295 : retirer `group`, `transition-colors` et le `hover:border-*`
className="relative w-[86%] shrink-0 snap-center overflow-hidden rounded-xl border border-border bg-background-card lg:w-auto"
```
`group` seul sur ces conteneurs n'est référencé par aucun `group-hover:` (les `group-open/d` des chevrons utilisent le groupe nommé `d`, indépendant) : suppression sans effet de bord. Vérifier par Grep `group-hover` dans les deux fichiers avant de retirer.
```tsx
// abonnement/page.tsx l.117 : garder la bordure d'accent au survol
<Card className={`${isAuthenticated ? "mt-10" : "mt-6"} border-2 border-accent-primary p-0 shadow-lg shadow-accent-primary/10 hover:border-accent-primary`}>
// abonnement/page.tsx l.95 : carte « Compte gratuit » statique
<Card className="mt-10 p-0 hover:border-border">
// upcoming-features.tsx l.182 : liseré violet conservé au survol
"relative overflow-hidden border-accent-primary/20 hover:border-accent-primary/20 bg-gradient-to-br",
// carnet-fiche-card.tsx l.15 : fiche statique
<Card className="space-y-4 p-5 hover:border-border" id={`fiche-${fiche.id}`}>
```
`tailwind-merge` (déjà dans `cn`) résout `hover:border-border` contre `hover:border-border-hover` de la base : aucune modification de `ui/card.tsx` (les cartes réellement cliquables comme celles de VannesList et ParcoursList gardent leur hover).

### P1-4 : trois boutons « primary » dans les cartes d'outils : l'action de conversion se noie

Fichier : `src/components/home/feature-cards.tsx` l.17, 28, 47 (`variant: "primary"`), l.104-112.

Constat : pour un visiteur anonyme, l'accueil empile le CTA du hero, trois boutons violets pleins de navigation (« Voir les vannes », « Découvrir les techniques », « Regarder les vidéos »), « Révéler la chute » (violet plein), le CTA de `HomeCta`, celui de l'offre. Huit boutons de même poids : critère 8 (une action primaire dominante) non tenu. Les boutons de navigation vers le catalogue doivent être `outline`, comme le bouton secondaire du hero et de `HomeCta`. De plus, `<Link><Button/></Link>` est imbriqué (voir P2-3).

Après (les 3 lignes `variant` passent à `"outline" as const`, et le CTA de la carte devient) :
```tsx
<div className="mt-auto pt-5">
  <Link
    href={feature.href}
    className={cn(
      buttonVariants({ variant: feature.variant, size: "sm" }),
      "h-auto min-h-8 whitespace-normal py-1.5 text-left leading-snug max-md:h-auto max-md:min-h-11",
    )}
  >
    {feature.cta} →
  </Link>
</div>
```
Imports : `import { buttonVariants } from "@/components/ui/button";` (remplace `Button`) et `import { cn } from "@/lib/utils";`. L'élément est maintenant UN lien qui a l'apparence d'un bouton ; le conteneur `mt-auto pt-5` garde l'alignement en pied de carte. `self-start` : la `div` n'est plus un enfant flex étiré en largeur car le `Link` est `inline-flex` ; ajouter `self-start` sur la `div` si la capture montre un bouton pleine largeur.
`daily-content.tsx` l.184-191 : « Révéler la chute » est une action de contenu, passer en `variant="outline"` (même logique) ; les vannes de `VannesList` utilisent déjà `ghost` pour la même action.

### P1-5 : squelette du contenu du jour : grille empilée au lieu du carrousel (saut de mise en page en mobile)

Fichier : `daily-content.tsx` l.141-150.

Constat : le chargement affiche `grid gap-6 lg:grid-cols-3` (3 cartes empilées sous 1024 px) puis le contenu réel arrive en carrousel horizontal (`flex overflow-x-auto`, cartes `w-[86%]`) : la page se rétracte de ~500 px en mobile/tablette au chargement.
Après :
```tsx
<div className="-mx-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
  {[0, 1, 2].map((i) => (
    <div
      key={i}
      className="w-[86%] shrink-0 snap-center animate-pulse rounded-xl border border-border bg-background-card p-6 lg:w-auto"
    >
      <div className="mb-3 h-5 w-24 rounded bg-background-elevated" />
      <div className="h-4 w-3/4 rounded bg-background-elevated" />
      <div className="mt-2 h-4 w-1/2 rounded bg-background-elevated" />
      <div className="mt-4 h-10 w-full rounded bg-background-elevated" />
    </div>
  ))}
</div>
```

### P1-6 : « Prochainement » : padding, icônes illisibles, pastille de vote hors grammaire

Fichier : `upcoming-features.tsx`.
1. Padding : `Card` (base `p-4`) + `CardHeader` donnent 16 px de marge intérieure, contre 24 px (`p-6`) sur toutes les autres cartes de l'accueil. Ligne 179-185 : ajouter `p-6` à la `cn(...)` (`"relative overflow-hidden border-accent-primary/20 bg-gradient-to-br p-6"`).
2. Contraste des icônes : les features 2 et 4 utilisent `iconColor: "text-accent-secondary"` (#6D28D9) sur une teinte `bg-accent-secondary/10` sur fond #1F1F1F : environ 2,3:1, sous les 3:1 exigés pour un graphisme (WCAG 1.4.11). L.49 et l.80 : `iconColor: "text-accent-link"`. Pour l'homogénéité, mettre aussi `text-accent-link` aux lignes 35 et 66 (au lieu de `text-accent-primary`) afin que les 4 icônes aient la même couleur.
3. Pastille de vote (l.203-230) : fond `bg-background-elevated` sans bordure et texte `text-text-muted`, une forme qui n'existe nulle part ailleurs. C'est un élément cliquable : même peau que les pastilles de lien. L.206-211 :
```tsx
className={cn(
  "mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
  voted
    ? "border-accent-secondary-hover bg-accent-secondary-hover text-white"
    : "border-border bg-background-elevated text-text-secondary hover:border-accent-primary hover:text-text-primary"
)}
```
(`transition-all` devient `transition-colors`, comme partout.)

### P2-5 : cartes « Tu te reconnais ? » : emoji plus petit que dans les cartes d'outils, non masqué aux lecteurs d'écran

Fichier : `src/app/(dashboard)/page.tsx` l.97, 113, 130.
`<p className="text-2xl">☕️</p>` vs `<span className="text-3xl" aria-hidden="true">` dans `FeatureCards` : deux rangées de 3 cartes l'une sous l'autre avec des emojis de 24 et 30 px.
Après (3 occurrences) : `<p className="text-3xl" aria-hidden="true">☕️</p>` (idem pour ⚡️ et 🌱).
Les cartes persona gardent leur lien texte (`text-accent-link`), c'est cohérent : ce sont des cartes éditoriales, pas des outils. Seule remarque d'espacement : les liens ont `mt-4` + `min-h-[44px]`, ce qui est correct.

## 3. PAGES CLÉS (/vannes, /parcours, /abonnement, /carnet, /liens) ET OFFRES D'ACCUEIL

### P1-7 : cartes d'offre : padding mobile 32 px contre 24 px, titres sans la police d'affichage

Fichiers : `src/components/home/premium-cta.tsx` l.56, 60, 62, 104, 106 ; `src/app/(dashboard)/abonnement/page.tsx` l.96, 97, 118, 120, 125.

Constat :
- Accueil : l'offre « Accès complet » est en `p-8` (32 px à 375 px) alors que la carte « Coaching individuel » juste dessous a `p-6 sm:px-8` (24 px) : les bords gauches du texte ne s'alignent pas sur mobile. Sur /abonnement : `p-5 sm:p-8` (20 px mobile) : troisième valeur.
- Les titres d'offre (`h3`/`h2` « Accès complet », « Coaching individuel », « Compte gratuit ») et les prix sont en `font-semibold`/`font-bold` police Inter, alors que tous les autres titres de carte du site (`CardTitle`, cartes d'accueil) sont en `font-display font-bold`.
Règle d'échelle : panneau d'offre ou de CTA = `p-6 sm:p-8`.

Après :
```tsx
// premium-cta.tsx l.56
<div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10 sm:p-8">
// l.60
<h3 className="font-display text-lg font-bold text-text-primary">Accès complet</h3>
// l.62
<span className="font-display text-4xl font-bold text-text-primary">2,99 €</span>
// l.104
<h3 className="min-w-0 font-display text-lg font-bold text-text-primary">Coaching individuel</h3>
// l.106
<span className="font-display text-lg font-bold text-text-primary">99&nbsp;€</span>
```
```tsx
// abonnement/page.tsx l.96 et l.118
<CardContent className="p-6 sm:p-8">
// l.97 et l.120
<h2 className="font-display text-lg font-bold text-text-primary">
// l.125
<span className="font-display text-4xl font-bold text-text-primary">2,99 &euro;</span>
```
(La carte « Compte gratuit » et l'offre gardent la même hiérarchie : titre `text-lg`, prix `text-4xl`.)

### P1-8 : paywall du carnet : couleurs hors système, titre plus gros que son titre de section, bouton de taille unique

Fichier : `src/components/carnet/carnet-page.tsx` l.95, 96, 102-106.

Constat :
- `border-violet-500/30 bg-violet-950/20` : classes Tailwind par défaut, absentes des tokens projet (`accent-primary`), teinte différente du panneau équivalent de l'accueil (`HomeCta` l.23 : `border-accent-primary/20 bg-accent-primary/5`). Même rôle (panneau d'appel à l'abonnement), deux violets.
- `h3` en `text-2xl` sous un `h2` « Les N autres situations du mois » en `text-xl` : le sous-titre est plus gros que le titre.
- Bouton : `Button` sans `size` (h-10) forcé à `min-h-[44px]`, alors que tous les CTA de panneau sont `size="lg"` (h-12). `Link` + `Button` imbriqués (P2-3).

Après :
```tsx
<div className="rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-6 sm:p-8">
  <h3 className="mb-2 font-display text-xl font-bold">Débloque tout le carnet</h3>
  ...
  <Link
    href={buildAbonnementUrl(returnTo)}
    className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
  >
    S&apos;abonner · {PREMIUM_PRICE_LABEL}
  </Link>
</div>
```
Imports : `import { buttonVariants } from "@/components/ui/button";` (remplace `Button`, plus utilisé dans le fichier) et `import { cn } from "@/lib/utils";`.

### P1-9 : quiz d'orientation de /parcours : padding 16 px à gauche/droite et 40 px en haut/bas

Fichier : `src/components/parcours/parcours-content.tsx` l.68-69 et l.88-89.

Constat : `Card` (p-4) contenant `CardContent className="py-6"` donne 16 px latéral / 40 px vertical, alors que les cartes de parcours juste dessous sont `p-4 sm:p-6` (uniformes). Le quiz paraît étiré et décalé par rapport au reste de la page.
Après :
```tsx
// l.68-69 (résultat)
<Card className="p-4 text-center sm:p-6">
  <CardContent>
// l.88-89 (question)
<Card className="p-4 sm:p-6">
  <CardContent>
```
(retirer `py-6` des deux `CardContent`.)

### P1-10 : FAQ des pages catalogue : centrée et étroite sous des blocs alignés à gauche et plus larges

Fichiers : `src/components/home/faq-section.tsx` l.12-28 ; `src/app/(dashboard)/vannes/page.tsx` l.127 ; `src/app/(dashboard)/parcours/page.tsx` l.145-147.

Constat : sur /vannes, les sections « Pourquoi ces vannes… » et « La suite… » ont un `h2` `text-xl` aligné à gauche (largeur 768 px max), puis la FAQ passe en `h2` `text-2xl` CENTRÉ dans une colonne de 672 px centrée : trois bords gauches différents, deux tailles de titre. Idem sur /parcours (« Explore aussi » à gauche, FAQ centrée) avec en plus un espacement différent (`mt-16` sans filet, contre `mt-12 border-t pt-8` pour les autres sections).
Après, `faq-section.tsx` :
```tsx
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  items?: readonly FaqItem[];
  title?: string;
  /** "left" : pages catalogue (titre aligné à gauche, même largeur que les blocs voisins). */
  align?: "center" | "left";
}

export function FaqSection({ items = faqs, title = "Questions fréquentes", align = "center" }: FaqSectionProps = {}) {
  const left = align === "left";
  return (
    <div className={left ? "max-w-3xl" : "mx-auto max-w-2xl"}>
      <h2
        className={cn(
          "font-display font-bold text-text-primary",
          left ? "mb-4 text-xl" : "mb-8 text-center text-2xl",
        )}
      >
        {title}
      </h2>
```
(le reste du composant est inchangé.) Appels :
```tsx
// vannes/page.tsx l.127
<FaqSection items={vannesFaqs} align="left" />
// parcours/page.tsx l.145-147
<section className="mt-12 border-t border-border pt-8">
  <FaqSection align="left" />
</section>
```
Accueil, /abonnement (en-tête centré) : valeur par défaut `center`, inchangé. Autres pages qui appellent `<FaqSection` : Grep, appliquer `align="left"` si le contenu voisin est aligné à gauche.

### P2-2 : sur-titres (« eyebrows ») : quatre graisses/interlettrages pour le même style

Référence déjà présente : `liens/page.tsx` l.37 et `daily-content.tsx` l.95 : `text-xs font-semibold uppercase tracking-wider text-accent-link`.
Écarts :
- `carnet-fiche-card.tsx` l.17 : `font-medium ... tracking-wide` devient `text-xs font-semibold uppercase tracking-wider text-accent-link`.
- `carnet-page.tsx` l.37 : `text-sm font-medium text-accent-link` (ni majuscules ni même taille que le sur-titre des fiches) devient `text-xs font-semibold uppercase tracking-wider text-accent-link`.
- `daily-content.tsx` l.196 et `vannes-list.tsx` l.319 : `tracking-wide` devient `tracking-wider`.
- `parcours-content.tsx` l.264 (summary « Programme ») : `tracking-wide` devient `tracking-wider`.
Aucun texte ne change : les majuscules sont déjà produites par CSS sur les autres sur-titres.

### P2-3 : `<Link><Button/></Link>` imbriqués (HTML invalide, double focus, zone de clic partielle)

Occurrences : `hero-section.tsx` l.49-58 (traité en P1-2), `feature-cards.tsx` l.104-112 (P1-4), `carnet-page.tsx` l.102-106 (P1-8), `premium-cta.tsx` l.141-153 (le `<a>` autour du bouton Calendly), `parcours-list.tsx` l.112-116, `header.tsx` l.98-111 et l.195-210.
Recette unique : `<Link href=... className={cn(buttonVariants({ variant, size }), "w-full")}>libellé</Link>`. Pour `premium-cta.tsx` :
```tsx
<a
  href="https://calendly.com/contact-deviens-marrant/45min"
  target="_blank"
  rel="noopener noreferrer"
  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 w-full")}
>
  Réserver un appel · 99 €
  <svg className="ml-2 h-4 w-4" ... />
</a>
```
Pour le header (boutons-icône `ghost sm` avec `aria-label`), la recette donne `className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}` sur le `Link` en déplaçant `aria-label` et `title` sur lui. `home-cta.tsx` l.38 applique déjà `w-full` sur le `Link` ET le `Button` : même recette. Pas de changement visuel attendu, gain d'accessibilité et de zone cliquable : à traiter après les P0/P1.

### P2-4 : ordre des trois parcours : le hero diffère du reste du site `[À VALIDER PAR THOMAS, NE PAS APPLIQUER D'OFFICE]`

Hero : répartie, machine à café, confiance. Accueil (« Tu te reconnais ? »), /parcours, `PremiumBenefits` : machine à café, répartie, confiance (le plus court d'abord, commentaire l.95 de `page.tsx`). Si l'ordre du hero n'est pas un choix délibéré, aligner `HERO_PARCOURS_LINKS` sur l'ordre du site (échanger les deux premières entrées, libellés et href inchangés).

### P2-6 : échelle de marges intérieures et d'écarts entre cartes

Règle : carte de contenu `p-4 sm:p-6` ; panneau d'offre ou de CTA `p-6 sm:p-8` ; écart entre grandes cartes `gap-6` / `space-y-6`, entre cartes denses `gap-4`.
Écarts : `home-cta.tsx` l.23 `p-8` devient `p-6 sm:p-8` ; `carnet-fiche-card.tsx` l.15 `p-5` devient `p-4 sm:p-6` (combiné avec le `hover:border-border` du P1-3) ; `carnet-page.tsx` l.44 `space-y-5` devient `space-y-6` ; `parcours-content.tsx` l.210 `gap-8` devient `gap-6`.

### P2-7 : cartes-liens de fin de page (/vannes, /parcours) : titres et descriptions à trois tailles

Fichiers : `vannes/page.tsx` l.150-161 ; `parcours/page.tsx` l.93-117 et l.129-140.
Constat : titres `text-base font-semibold` (haut de /parcours, en `h2`) et `text-sm font-semibold` (cross-links), tous sans `font-display` ; descriptions en `text-xs` (12 px, petit pour du corps de texte).
Après (tous les titres de ces cartes, quel que soit le niveau de balise) :
```tsx
<h3 className="font-display text-base font-bold text-text-primary">…</h3>
<p className="mt-1 text-sm text-text-secondary">…</p>
```
(les `h2` de /parcours l.97, 106, 115 gardent leur balise, seules les classes changent.)

### P2-8 : /liens : fond de carte différent du reste du site, aucune action dominante, survol qui éteint le liseré

Fichier : `src/app/liens/page.tsx` l.38, 71-74, 82-90.
- `CARD` utilise `bg-background-elevated` (#2A2A2A, même gris que la bordure donc bordure invisible) : toutes les cartes de contenu du site sont `bg-background-card`. Après : `"block rounded-xl border border-border bg-background-card p-5 transition-colors hover:border-border-hover"`.
- Carte « blague du jour » : `hover:border-border-hover` écrase le liseré violet au survol. Après : `className={cn(CARD, "border-accent-primary/30 bg-accent-primary/10 hover:border-accent-primary/60")}`.
- Les 3 liens du bas sont tous `outline` : aucune action dominante (page de bio, un seul but). Premier lien en `primary` :
```tsx
{FIXED_LINKS.map((link, index) => (
  <Link
    key={link.href}
    href={withBioUtm(link.href)}
    className={cn(buttonVariants({ variant: index === 0 ? "primary" : "outline", size: "lg" }), "w-full justify-center")}
  >
    {link.label}
  </Link>
))}
```

## 4. EN-TÊTE ET PIED DE PAGE

### P1-11 : en-tête desktop probablement trop large entre 1024 et ~1300 px pour un abonné `[À VÉRIFIER CAPTURE]`

Fichier : `src/components/layout/header.tsx` l.75, 92, 95.
Constat (calcul sur le code, non confirmé par capture) : tous les blocs sont `shrink-0` dans un conteneur `max-w-7xl px-4`. Estimation à 1024 px, utilisateur connecté : logo ~190 + nav 6 onglets ~410 + recherche 176 (`w-44`) + actions (Favoris, Profil, Déconnexion) ~200 + 3 gaps de 16 = ~1025 px pour 992 px disponibles. L'onglet « Carnet » (Premium) ajoute ~75 px, et le débordement subsiste à 1280 px (recherche `xl:w-64`). Risque : défilement horizontal ou chevauchement.
Correctif sans toucher aux libellés (ligne 92) :
```tsx
// avant
<SearchBar className="hidden w-44 lg:block xl:w-64" onNavigate={closeMobileSearch} />
// après
<SearchBar className="hidden w-36 lg:block xl:w-48 2xl:w-64" onNavigate={closeMobileSearch} />
```
Gain : 32 px à 1024, 64 px à 1280. Valider par captures à 1024 et 1280 px (connecté, Premium). Si ça déborde encore, afficher le menu burger jusqu'à `xl` (remplacer les `lg:` par `xl:` des lignes 75, 95, 128, 165, 173) plutôt que de réduire les cibles de clic.

### P2-9 : pied de page : lien e-mail dans une couleur de lien qui n'existe pas dans les colonnes, liste « Produit » très haute en mobile

Fichier : `src/components/layout/footer.tsx` l.69, l.94.
- Les liens des colonnes sont `text-text-secondary hover:text-text-primary` ; l'adresse e-mail hérite de `text-text-muted` et survole en `accent-link`. Après (l.69) :
  `<a href="mailto:contact@deviens-marrant.fr" className="inline-flex min-h-[44px] items-center text-text-secondary transition-colors hover:text-text-primary">contact@deviens-marrant.fr</a>`
  Les icônes sociales (`text-text-muted hover:text-accent-link`) restent : ce sont des icônes, pas des liens texte.
- En mobile, « Produit » aligne 9 liens à 44 px sur une seule colonne (~400 px de haut) pour une largeur de 343 px dont la moitié est vide. L.94 : `<ul className="grid lg:grid-cols-2 lg:gap-x-6">` devient `<ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-1 lg:grid-cols-2">` (« Anatomie d'une vanne », le libellé le plus long, tient dans ~160 px). Valider à 375 px.

### P2-10 : en-tête desktop : Favoris et Profil en icônes seules `[CONDITIONNEL]`

Fichier : `header.tsx` l.98-111. Le menu mobile affiche les libellés « Favoris » / « Mon profil », le desktop uniquement des icônes (avec `aria-label`/`title`). Principe de la charte : libellé texte plutôt qu'icône seule. À n'appliquer qu'APRÈS validation du P1-11 (la largeur manque déjà) et seulement à partir de `2xl` : ajouter dans chaque `Button` `<span className="hidden 2xl:ml-2 2xl:inline">Favoris</span>` (resp. `Mon profil`). Les libellés existent déjà dans le code (aria-label), aucun nouveau texte.

---

## 5. Non-problèmes vérifiés (ne pas toucher)

- `rounded-lg` (token projet, 0,75 rem) et `rounded-xl` (Tailwind) rendent le même arrondi : mélange apparent dans le code, pas à l'écran. `rounded-2xl` pour les panneaux d'offre/CTA, `rounded-full` pour pastilles et badges : cohérent.
- Bordure `border-border` (#2A2A2A) identique au fond `background-elevated` des pastilles du hero : le contour ne se voit pas, la pastille se lit comme un bouton plein gris. Volontaire, conservé : elle se distingue de la ligne de coches (sans fond) justement par ce remplissage.
- Tailles de H2 : 3xl/4xl pour les sections d'accueil, 2xl pour les panneaux (CTA, FAQ), xl pour les sections de fin de catalogue : hiérarchie voulue, hors P1-10.
- Badge `text-xs` contre pastille `text-sm` et 44 px : volontaire (étiquette lue contre lien cliquable).
- Blocs repliables « Exemple concret » (fond gris) contre « Exercice du jour » (liseré violet) : distinction fonctionnelle.
- Navigation de l'en-tête : états actif/survol/focus identiques en desktop et mobile ; cibles 44 px en mobile ; pied de page : tous les liens à `min-h-[44px]`.
- Preuve sociale violette du hero (`font-medium text-accent-link`) : accent volontaire sous le titre. Dans l'offre /accueil elle est grise (`text-text-secondary`) : acceptable car posée sous un bouton dans une carte.
- Carrousel du contenu du jour (< 1024 px) puis grille : conforme à la spec UX §2.8.

---

## 6. Application et vérification

Ordre conseillé (aucune dépendance entre eux sauf P0-3 qui crée `chip.ts`) : P0-1, P0-2, P0-3, puis P1-1 à P1-11, puis P2.

Fichiers touchés (classes et variantes uniquement, aucun texte, lien, slug, titre ni prix) :
`ui/chip.ts` (nouveau), `home/hero-section.tsx`, `home/daily-content.tsx`, `home/feature-cards.tsx`, `home/home-cta.tsx`, `home/premium-cta.tsx`, `home/upcoming-features.tsx`, `home/faq-section.tsx`, `app/(dashboard)/page.tsx`, `vannes/page.tsx`, `vannes/vannes-list.tsx`, `vannes/vannes-theme-nav.tsx`, `parcours/page.tsx`, `parcours/parcours-content.tsx`, `parcours/parcours-list.tsx`, `abonnement/page.tsx`, `carnet/carnet-page.tsx`, `carnet/carnet-fiche-card.tsx`, `liens/page.tsx`, `layout/header.tsx`, `layout/footer.tsx`.

Contrôles avant livraison :
1. `git diff` ne contient aucune ligne de texte visible modifiée (seuls `className`, `variant`, balises d'enrobage, imports). Les libellés « Un petit exercice par jour », « Vannes prêtes à ressortir » et « 1 500+ membres » sont présents au même endroit.
2. Grep du tiret cadratin « — » dans les fichiers touchés : aucun nouveau.
3. `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`.
4. Captures 375 / 768 / 1280 de `/`, `/vannes`, `/parcours`, `/abonnement`, `/carnet`, `/liens` (sans capture à ce jour, `tests/screenshots/` est absent) : vérifier surtout le hero (3 pastilles + ligne de coches masquée en 375), la rangée de filtres de /vannes (pastilles bordées, 44 px), l'en-tête à 1024 et 1280 (P1-11), le carrousel du jour en chargement (P1-5).
5. Consigner dans `REPLIT_ACTIONS.md` (déploiement par la branche indiquée par Thomas).
