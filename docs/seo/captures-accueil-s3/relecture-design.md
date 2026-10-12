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
