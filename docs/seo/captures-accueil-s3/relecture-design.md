# Relecture design : accueil, maillage S3 (commit `399fd14`)

Périmètre : ligne S3a « Deux autres parcours : Parcours Storytelling et Parcours Boulot. » et bloc S3b « Derniers articles » (`apps/web/src/app/(dashboard)/page.tsx`, `components/home/autres-parcours.tsx`, `components/home/derniers-articles.tsx`).
Preuves : les 6 captures de ce dossier lues une à une (section 375 / 1280, ligne S3a 375 / 1280, page entière 375 / 1280), plus `blog-article-related.tsx` (style « À lire ensuite »), `lib/fr-typo.ts`, `chip.ts`, `button.tsx`, `tailwind.config.ts`. Textes validés par Thomas le 12/10 : non touchés, aucune ligne de contenu ajoutée.

## Notes

| Device | Note | Résumé |
|---|---|---|
| Desktop 1280 | **8 / 10** | Cartes propres et lisibles, mais : axe d'alignement rompu (titre à gauche dans une page centrée), gouttières des 3 cartes décalées de celles des personas juste au-dessus (16 px contre 24 px), échelle d'espacement plate entre les 3 blocs, coupure « 7 / raisons ». |
| Mobile 375 | **8 / 10** | Lisible, cibles 52 px de haut (≥ 44), mais mêmes défauts de rythme et de typographie ; coupure « 7 / raisons » visible dans la 1re carte ; risque de « ? » orphelin sur la phrase du pilier (largeurs voisines). |

## Arbitrages demandés

### 1. Titre « Derniers articles » : centré (pas à gauche)
Constat sur page entière : tous les titres de l'accueil (« Ton contenu du jour », « Trois outils… », « Tu te reconnais ? », « Questions fréquentes », « Prochainement ») sont centrés ; la ligne S3a et la phrase du pilier juste au-dessus sont centrées aussi. Un titre isolé à gauche, à x = 16 px, au milieu de cette colonne centrée, se lit comme un oubli et casse « le site entier sent la même marque » (critère 4). Le style « Explore aussi » de `/blog` s'explique par sa page (colonne de lecture alignée à gauche), pas par l'accueil. **Décision : centré**, mais plus petit que les titres de section (`text-xl md:text-2xl`) pour garder la hiérarchie : ce bloc est du maillage, il ne doit pas concurrencer le CTA qui suit (critères 8 et 9). Les cartes, elles, restent pleine largeur avec texte aligné à gauche, comme les cartes personas.

### 2. Coupure « 7 / raisons » : oui, chiffre + nom insécables, par `frTypo`
Cause : `DerniersArticles` affiche `a.title` brut, alors que le blog applique `frTypo` à tous ses titres (`blog-article-related.tsx` l.28, l.39, l.61) et que `frTypo` a précisément la règle « 7 techniques », « 5 min » (`fr-typo.ts` l.56-57), plus l'espace insécable avant « : ». C'est un oubli de câblage, pas un cas à traiter à part. Vaut aussi pour « Rester muet en groupe : 7 techniques… ». Compléter par `text-wrap: balance` pour éviter un mot seul sur la 2e ligne (« concrètes ») une fois « 7 raisons » collé.
Résultat attendu : « Pourquoi tes blagues ne marchent pas : » / « 7 raisons concrètes » (375 et 1280) ; carte 2 : « Rester muet en groupe : 7 techniques » / « pour reprendre la parole » (plus de « la parole » orphelin).
`frTypo` ne modifie que le rendu JSX, jamais le texte stocké ni le JSON-LD : aucun effet SEO (Google normalise les insécables du texte d'ancre).

### 3. Hiérarchie et espacements entre S3a, pilier et bloc
Mesuré (1280 / 375) : cartes → ligne S3a = 24 px (`mt-6`), S3a → phrase du pilier = 24 px (`mt-6`), phrase du pilier → titre « Derniers articles » ≈ 64 px (48 px mobile, `py-16` / `py-12` de la section). Deux lignes identiques (14 px, gris secondaire, centrées) espacées pareil que la ligne qui les relie aux cartes : aucun groupement. Or S3a complète la liste des parcours (elle appartient aux cartes) alors que le pilier est une autre intention (le guide). Échelle de proximité proposée, qui double à chaque niveau : **16 px** (cartes → S3a) / **32 px** (S3a → pilier) / **64 px** (pilier → bloc, déjà en place, 48 px mobile). Pas de changement de taille ni de couleur : ce sont des notes de bas de section, elles doivent rester discrètes (texte `#B3B3B3` sur `#0D0D0D` ≈ 9:1, liens `#A78BFA` soulignés).

## Autres constats

1. **Gouttières désalignées (desktop).** Cartes personas : `md:grid-cols-3` + `gap-6` (colonnes x = 16 / 440 / 864). Cartes articles : `sm:grid-cols-3` + `gap-4` (x = 16 / 437 / 859). Empilées l'une sous l'autre, les colonnes ne tombent pas au même endroit (critère ALIGNÉ). De plus `sm` (640 px) donne 3 colonnes de ~190 px aux titres de 4 lignes : passer à `md` comme les personas.
2. **Focus clavier.** Les cartes articles n'ont aucune classe `focus-visible` (les pastilles et boutons du site ont l'anneau violet `ring-2 ring-accent-primary`, `chip.ts`, `button.tsx`). Anneau ajouté au correctif. `[À VÉRIFIER : style de focus global dans le CSS de l'app, non retrouvé ; sans lui, c'est l'outline natif du navigateur.]`
3. **Pilier : « mécanisme ? Lis ».** Espace simple avant « ? » dans `page.tsx` l.160 : à 375 px la coupure tombe bien après « ? », mais un viewport voisin (360, 390) peut renvoyer « ? » seul à la ligne suivante. Insécable à poser.
4. **S3a : liens coupables.** « Parcours Storytelling » / « Parcours Boulot » peuvent se couper en deux lignes à 320 px ; `whitespace-nowrap` sur le lien (≈ 140 px, tient dans 288 px).
5. **Cible tactile des liens de phrase (S3a, pilier).** Hauteur de ligne 20 px, sous la règle 44 px du projet, mais exception « lien dans une phrase » de WCAG 2.5.8 AA. Non bloquant, accepté (le texte validé est une phrase) ; les cartes articles (52 px) et les liens des personas (`min-h-[44px]`) respectent la règle.
6. **Cohérence de forme (OK).** Cartes articles : même bordure, même fond `background-card`, même rayon que les personas (rounded-lg = 12 px dans ce `tailwind.config.ts`), `p-4` contre `p-6` pour marquer le niveau secondaire : bon. Texte blanc sur `#1F1F1F` : AA. Pas d'icône carrée ni d'illustration générique ajoutée : conforme au « No Manufacturing Defaults ».
7. **Hiérarchie au plissement des yeux (page entière).** Les 3 éléments dominants restent : bouton violet du hero, titres de section, CTA « Accéder aux parcours complets ». Le bloc S3 ne vole pas l'attention : à conserver, d'où un titre `text-xl md:text-2xl` et pas `text-3xl`.

## Correctif exact

### `components/home/derniers-articles.tsx`

```tsx
import { frTypo } from "@/lib/fr-typo";   // ajout

<section aria-labelledby="derniers-articles" className="pb-12 md:pb-16">
  <h2
    id="derniers-articles"
    className="font-display mb-4 text-center text-xl font-bold md:mb-6 md:text-2xl"
  >
    Derniers articles
  </h2>
  <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
    ...
      <Link
        href={`/blog/${a.slug}`}
        className="block h-full rounded-lg border border-border bg-background-card p-4 text-sm font-semibold text-text-primary transition-colors [text-wrap:balance] hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {frTypo(a.title)}
      </Link>
```

Changements : `h2` + `text-center`, `md:text-2xl`, `md:mb-6` ; `ul` : `sm:grid-cols-3` devient `md:grid-cols-3`, ajout `md:gap-6` ; lien : `[text-wrap:balance]` + anneau de focus ; `{a.title}` devient `{frTypo(a.title)}`.

### `components/home/autres-parcours.tsx`
- `<p className="mt-6 text-center text-sm text-text-secondary">` devient `mt-4`.
- Classe du `Link` : ajouter `whitespace-nowrap` (`"whitespace-nowrap font-medium text-accent-link underline underline-offset-2"`).

### `app/(dashboard)/page.tsx` (phrase du pilier, l.159-160)
- `<p className="mt-6 text-center text-sm text-text-secondary">` devient `mt-8`.
- `mécanisme ? Lis` devient `mécanisme&nbsp;? Lis`.

Aucun nouveau token, aucune nouvelle couleur, aucun texte modifié, liens et ordre du DOM inchangés (le maillage S3 reste dans le HTML serveur).

## À vérifier après correction (recapture)

1. 375 et 1280 : titre « Derniers articles » centré ; 1re carte « 7 raisons concrètes » sur la même ligne ; 2e carte sans « la parole » seul.
2. 1280 : bords des 3 cartes articles alignés sur ceux des 3 cartes personas (x = 16 / 440 / 864).
3. Cartes → S3a = 16 px ; S3a → pilier = 32 px (mesure à la règle sur la capture).
4. 320 et 390 px : aucune coupure dans « Parcours Boulot » / « Parcours Storytelling », « ? » jamais en début de ligne.
5. Tabulation clavier : anneau violet visible sur chaque carte article.
6. Test : si un test compare le texte des liens à `a.title`, comparer à `frTypo(a.title)` (ou normaliser U+00A0).

## Notes projetées après correctif

Desktop 10 / 10, mobile 10 / 10 sous réserve de la recapture (points 1 à 5). Aucun point résiduel connu hors exception WCAG 2.5.8 des liens dans une phrase (acceptée).

---
**Handoff → @fullstack (correctifs ci-dessus), @qa (recapture + test ancres)**
- Fichier produit : `/home/user/Marrant/docs/seo/captures-accueil-s3/relecture-design.md`.
- Décisions : titre centré (`text-xl md:text-2xl`), `frTypo` + `[text-wrap:balance]` sur les titres, grille `md:grid-cols-3 md:gap-6` alignée sur les personas, échelle 16 / 32 / 64 px, anneau de focus violet, `&nbsp;` avant « ? ».
- Points d'attention : déploiement à noter dans `REPLIT_ACTIONS.md` ; textes S3 validés par Thomas non modifiés.
---

# Tour 2 : relecture du commit `3902aa8` (arbitrage design + UX)

Preuves : `accueil-s3-section-{375,640,768,1280}px.png`, `accueil-s3a-ligne-375px.png`, `accueil-s3b-focus-clavier-1280px.png` lues une à une (les captures « page entière » ne sont pas relues : la section couvre le périmètre), plus `autres-parcours.tsx`, `derniers-articles.tsx`, `relecture-ux.md` (C1, C2).

## Notes

| Device | Tour 1 | Tour 2 | Reste |
|---|---|---|---|
| Desktop 1280 | 8 | **9 / 10** | ligne S3a trop haute (44 px de ligne), échelle 16 / 32 déformée |
| Mobile 375 | 8 | **7 / 10** | trou entre « et » et « Parcours Boulot », cadence de lecture cassée |

## Résolu (constaté)

- Titre « Derniers articles » centré, `text-xl md:text-2xl` : cohérent avec l'accueil (375, 640, 768, 1280).
- Titres d'articles : « Pourquoi tes blagues ne marchent / pas : 7 raisons concrètes » (375 et 1280), « Rester muet en groupe : 7 techniques / pour reprendre la parole ». Plus de « 7 » orphelin ni de « la parole » seul.
- 768 px : colonnes des cartes articles alignées sur celles des personas (x = 16 / 269 / 523). 640 px : une colonne, propre. 1280 px : x = 16 / 440 / 864 sur les deux grilles.
- Focus clavier (1280) : anneau violet net sur la carte, décalage de 2 px, aucun chevauchement des voisines (gouttière 24 px).
- C1 (destination `/parcours/<slug>`) appliqué dans le code, rien à redire côté design.

## Problème : la cible de 44 px casse le rythme de la phrase S3a

Cause : `inline-flex min-h-[44px]` fait un bloc de 44 px dans la ligne, donc la **ligne entière** passe à 44 px de haut. À 375 px : deux lignes à 44 px de pas (« Deux autres parcours : Parcours Storytelling et » puis « Parcours Boulot. »), grand vide entre « et » et la ligne suivante, alors que la phrase du pilier dessous a un pas de 20 px. À 640-1280 px : la ligne unique fait 44 px, ce qui gonfle l'espace au-dessus (cartes → texte ≈ 33 px au lieu de ≈ 20) et au-dessous (texte → pilier ≈ 52 px) : l'échelle voulue 16 / 32 n'est plus lisible.

### La piste « `inline-block py-3 -my-3` seule » ne suffit pas à 375 px
Elle garde le pas de 20 px (boîte de 44 px, marges négatives de 12 px), mais quand les deux liens tombent sur des **lignes consécutives**, leurs zones de 44 px se recouvrent (le lien en dernier dans le DOM l'emporte). Calcul : zones de −12 à +32 px autour de chaque ligne de 20 px, recouvrement d'environ 24 px sur la largeur commune des deux liens (x ≈ 186-239 à 375 px) : la moitié basse de « Parcours Story… » déclencherait « Parcours Boulot ». C'est exactement le risque de clic raté relevé par @ux (§2.3), en pire. Aucune zone de 44 px n'est possible sur deux lignes consécutives à pas de 20 px.

### Décision : zone de 44 px sans changer la hauteur de ligne, et jamais deux liens sur des lignes voisines
1. **Zone cliquable** : `inline-block` + `py-3` + `-my-3` (20 + 24 = 44 px de boîte, marge de boîte = 20 px, donc pas de ligne inchangé). Pas de pseudo-élément : sa hauteur dépendrait de la boîte de contenu de la police (≈ 17 px), donc fragile ; l'`inline-block` est exact tant que le `<p>` garde `text-sm` (line-height 20 px).
2. **Mise en page mobile** : sous 640 px, la phrase se coupe **après les deux-points**. Ligne 1 : « Deux autres parcours : ». Ligne 2 : « Parcours Storytelling et Parcours Boulot. » (≈ 272 px de large, tient dans 288 px dès 320 px). Les deux liens sont alors **côte à côte sur la même ligne**, séparés par « et » (≈ 22 px), jamais sur deux lignes voisines : zéro recouvrement, deux zones de 44 px au moins (140 × 44 et 107 × 44).
3. Le texte validé par Thomas reste identique caractère pour caractère (la coupure est visuelle : un `<span>` en bloc sous 640 px, pas de `<br>` ni de `display:none`, le HTML serveur garde la phrase entière).

Cela respecte la règle projet de 44 px (au-delà de l'exception WCAG 2.5.8 des liens dans une phrase) sans dégrader le rythme.

## Correctif exact (`components/home/autres-parcours.tsx`)

```tsx
<p className="mt-4 text-center text-sm text-text-secondary">
  <span className="max-sm:block">{autresParcoursIntro(autres.length)}&nbsp;:</span>{" "}
  {autres.map((p, i) => (
    <Fragment key={p.href}>
      {i > 0 && (i === autres.length - 1 ? " et " : ", ")}
      <Link
        href={p.href}
        className="-my-3 inline-block whitespace-nowrap py-3 font-medium text-accent-link underline underline-offset-2"
      >
        Parcours {p.name}
      </Link>
    </Fragment>
  ))}
  .
</p>
```

Changements : (a) `inline-flex min-h-[44px] items-center` devient `-my-3 inline-block py-3` (on garde `whitespace-nowrap`) ; (b) l'intro passe dans `<span className="max-sm:block">…&nbsp;:</span>` suivi de `{" "}`. Ne pas modifier le `text-sm` du `<p>` (la zone de 44 px en dépend).

Même motif recommandé pour le lien de la phrase du pilier (`page.tsx`, lien « comment devenir drôle », seul lien de sa ligne) : `-my-3 inline-block whitespace-nowrap py-3 font-medium text-accent-link underline underline-offset-2`. Hors lot S3 mais 1 classe, et cela met les deux phrases au même niveau (un seul lien par ligne : aucun recouvrement possible). Test : le texte rendu reste « Deux autres parcours : Parcours Storytelling et Parcours Boulot. » ; remplacer l'assertion `min-h-[44px]` par `py-3`.

Limite connue : si l'offre passe à 3 parcours « autres », la ligne 2 mobile pourrait se couper en deux lignes de liens voisines ; dans ce cas, passer à une liste (hors lot, `[À SURVEILLER]` quand `PREMIUM_PARCOURS` change).
Focus : le contour natif entoure la boîte de 44 px (plus haute que le texte) : acceptable, il matérialise la zone ; à contrôler à la recapture.

## Point secondaire (768 px, hors lot, 3 classes)
Sur la capture 768 px, les liens des cartes personas se coupent « Parcours Confiance · 6 / semaines → » et « Parcours Répartie · 4 / semaines → » (nombre séparé de son nom). Correction sans changer le texte : `{parcoursWeeks("...")}&nbsp;semaines` dans les trois liens de `page.tsx`. Non bloquant pour S3 (cartes déjà validées), à joindre au même commit si possible.

## À vérifier après correction (recapture)

1. 375 px : ligne 1 « Deux autres parcours : », ligne 2 « Parcours Storytelling et Parcours Boulot. », pas de 20 px entre ces deux lignes (plus de vide entre « et » et le lien), 32 px avant la phrase du pilier.
2. 320 px : la ligne 2 tient sans coupure dans un lien.
3. 640 et 1280 px : phrase sur une ligne, ≈ 20 px entre le bas des cartes et le texte, ≈ 32 px avant la phrase du pilier (échelle 16 / 32 / 64 lisible).
4. Mesure DevTools : boîte de chaque lien = 44 px de haut, hauteur de ligne du `<p>` = 20 px.

## Notes projetées

Desktop 10 / 10, mobile 10 / 10 après le correctif (zone de 44 px conservée, rythme normal restauré, aucun texte modifié). Seul résidu hors lot : coupure « 6 / semaines » sur les cartes personas à 768 px.

---
**Handoff → @fullstack (correctif S3a, pilier, test ; `&nbsp;semaines` si accepté), @qa (recapture 320 / 375 / 640 / 1280 + mesure de la boîte de 44 px)**
- Fichier produit : `/home/user/Marrant/docs/seo/captures-accueil-s3/relecture-design.md` (section Tour 2).
- Décisions : zone cliquable `-my-3 inline-block py-3` (exacte, rythme inchangé) + coupure après les deux-points sous 640 px (liens jamais sur lignes voisines).
- Points d'attention : le `<p>` doit garder `text-sm` ; déploiement à noter dans `REPLIT_ACTIONS.md`.
---
