# Espace client, échelle typographique et harmonie (s25) : spec @design pour @fullstack

Part de `docs/design/aujourdhui-refonte-s25.md` et `docs/ux/aujourdhui-refonte-s25.md` : la STRUCTURE (zones, ordre du DOM, grilles, textes) ne bouge pas, ce document refait le TRAITEMENT. En cas de conflit sur une taille, une graisse, une couleur, un rayon, un espacement : ce document prime sur la spec s25 d'origine. Site sombre, aucun texte nouveau, uniquement des classes du thème.

Retour Thomas (16/11) : « combien de polices de tailles différentes ? gros, agressif, petit par ici, moyen là-bas, manque d'élégance, d'harmonie ». Diagnostic mesuré : 8 tailles, 13 combinaisons, 60 px d'un côté et 12 px de l'autre (rapport 5), trois graisses de fait (400, 600, 700), deux familles, des capitales, du violet sur 6 éléments (H1 mis à part : filet, étiquettes, pastilles, bordure d'offre, halo, bouton, barres). L'élégance vient d'un petit nombre de valeurs répétées sans exception, pas d'un nouvel effet.

## 1. Échelle (4 tailles, 2 graisses, 0 capitale)

| Constante | 375 à 1023 | 1024 et plus | Graisse | Police | Couleur |
|---|---|---|---|---|---|
| `TITRE_PAGE` | `text-2xl` (24/32) | `lg:text-3xl` (30/36) | 600 | display | `text-text-primary` |
| `TITRE_CARTE` | `text-xl` (20/28) | idem | 600 | display | `text-text-primary` |
| `TEXTE` | `text-base` (16/24) | idem | 400 | sans | `text-text-secondary` |
| `TEXTE_FORT` | `text-base` | idem | 600 | sans | `text-text-primary` (boutons) |
| `META` | `text-sm` (14/20) | idem | 400 | sans | `text-text-secondary` |
| `META_FORT` | `text-sm` | idem | 600 | sans | `text-text-primary` |
| `ETIQUETTE` | `text-sm` | idem | 600 | sans | `text-text-secondary` (casse normale) |

Tranches :
- **Tailles : 14, 16, 20, 24 (< 1024) ou 30 (>= 1024).** Donc 4 par écran, jamais 5. Rapport entier du plus grand au plus petit : 2,1 (30/14), contre 5 avant.
- **Graisses : 400 et 600 seulement.** Plus de 700, plus de 500 dans le contenu de l'espace.
- **Police d'affichage (Jakarta) : seulement `TITRE_PAGE` et `TITRE_CARTE`**, chiffres compris. Tout le reste en sans (Inter).
- **Capitales : aucune.** `uppercase` et `tracking-wide` disparaissent de l'espace. `ETIQUETTE` reste une constante (même 14/600 que `META_FORT`, mais en `text-secondary`, pour distinguer une étiquette d'une valeur) en casse normale.
- **Chiffres mis en valeur** (XP, série, « 1 500+ », cap) : `TITRE_CARTE` + `tabular-nums`. Aucun chiffre plus grand que 20 px en carte. Ils ne sont pas « en plus » de l'échelle.
- Interlignes : ceux de Tailwind (36/32/28/24/20, tous multiples de 4). Retirer `leading-tight`, `leading-snug`. Garder `[text-wrap:balance]` sur les titres et la promesse.
- Combinaisons taille/graisse/casse : 30/600, 20/600, 16/400, 16/600, 14/400, 14/600 = **6 au plus**.
- Le titre de page n'écrase plus la carte : la hiérarchie vient de la position, de l'espace et du bouton plein, pas de la taille.

### Module `apps/web/src/components/espace/typo.ts` (à créer, source unique)

```ts
export const TITRE_PAGE = "font-display text-2xl font-semibold text-text-primary lg:text-3xl [text-wrap:balance]";
export const TITRE_CARTE = "font-display text-xl font-semibold tabular-nums text-text-primary [text-wrap:balance]";
export const TEXTE = "text-base text-text-secondary";
export const TEXTE_FORT = "text-base font-semibold text-text-primary";
export const META = "text-sm text-text-secondary";
export const META_FORT = "text-sm font-semibold text-text-primary";
export const ETIQUETTE = "text-sm font-semibold text-text-secondary";
```

(`tabular-nums` sur `TITRE_CARTE` est inoffensif sur du texte et garantit l'alignement des chiffres.) `carte/styles.ts` : `ETIQUETTE` y est supprimé et ré-exporté depuis `typo.ts` (ses importeurs, `cap-du-jour`, `mission-lien`, `etape-en-cours`, ne changent que de chemin). `BOUTON_SECONDAIRE`, `BOUTON_PRINCIPAL`, `LIEN`, `puce()` restent en `text-sm font-semibold` / `text-sm` : ils sont déjà dans l'échelle (14/600, 14/400). `buttonVariants({ size: "lg" })` donne déjà 16/600 : inchangé.
**Interdit hors `typo.ts` dans `components/espace/**` :** toute classe `text-xs`, `text-lg`, `text-3xl` et plus, `text-4xl+`, `font-bold`, `font-medium`, `uppercase`, `tracking-*`, `leading-*`. Les tests (§4) le vérifient au rendu, un lint de classes peut le doubler.
**À vérifier :** la police d'affichage charge bien le poids 600 (`next/font`, config `--font-display`) ; sinon l'ajouter (et retirer le 700 de la config si plus aucune page ne l'utilise).

## 2. Harmonie et retenue : ce qui change, ce qui disparaît

### 2.1 Couleur : un seul violet, le bouton plein
- **Reste violet** : le bouton plein (`buttonVariants primary`), un par écran (celui de l'en-tête global est le même bouton, même libellé, hors espace).
- **Devient neutre** : filet violet de la carte Z1 (`FILET_CARTE`, ne l'appliquer ni à Z1 ni aux tuiles d'Aujourd'hui) ; dégradé violet de Z1 ; bordure `border-2 border-accent-primary` et ombre de l'offre ; halo de page violet (devient `before:from-background-card/60`, neutre) ; étiquettes `accent-link` ; points violets des pastilles ; lien « Connexion » (`text-text-secondary underline`) ; pied de tuile « Reprendre » (`text-text-primary`, chevron `text-text-secondary`) ; préfixe « Semaine 1 » (`text-text-primary`) ; flamme (`text-text-secondary`) ; barres et segments (remplissage `bg-text-primary`, rail `bg-border-hover`, plus de dégradé) ; coche verte de la rafale faite reste (`success`, sémantique, jamais décorative).
- [ARBITRAGE : le filet violet des CARTES des autres rubriques est un choix de Thomas du 15/11 (`styles.ts`, v6 tour 1). Je ne le touche pas ailleurs ; sur Aujourd'hui il est retiré parce que la demande du 16/11 (« un seul accent violet, le bouton plein ») est postérieure et plus précise. À confirmer par Thomas avant de généraliser aux autres pages de l'espace.]
- **Gris de texte : 2 niveaux** : `text-text-primary` (#FFF) et `text-text-secondary` (#B3B3B3, 7:1 sur carte). `text-text-muted` disparaît de l'espace (réassurance, aide de série, flamme éteinte, chevrons, `ETIQUETTE`). États désactivés : `opacity-75` du cadre fermé, pas un 3e gris.

### 2.2 Le « fermé » : un seul repère, les signaux fonctionnels restent
- **Un seul repère « Premium » par page** : le `BadgePremium` du hero (verrou + mot), restylé : `inline-flex items-center gap-2 rounded-full bg-background-elevated px-3 py-1` + `META_FORT`, verrou `h-4 w-4 text-text-secondary`. Plus de variante `grand`/`coin`.
- **Retiré** : le `BadgePremium coin` sur chaque tuile (5 pastilles), le `BadgePremium` de la fin d'extrait. `TuileFermee` ne rend plus de pastille.
- **La page se lit fermée sans eux, par 5 signaux cumulés (déjà là ou ajoutés)** : le repère unique + le bouton d'offre au-dessus de tout ; contenu des tuiles à `opacity-75` (inchangé) ; boutons dessinés en contour inactif (voir ci-dessous) ; fondu de l'extrait vers le fond ; « La suite est dans Premium » avec son bouton en fin d'extrait.
- **Bouton figé de Z1** (aperçu) : plus de plein violet atténué. Même gabarit que le bouton (`h-12 rounded-lg`), rendu `border border-border-input bg-transparent text-text-primary` + `TEXTE_FORT`, `aria-disabled`, `pointer-events-none`. Il se lit « bouton éteint », et le seul plein reste l'offre.
- [ARBITRAGE : si la capture « se lit fermé ? » échoue, repli : un verrou nu `h-4 w-4 text-text-secondary` (aria-hidden, sans mot ni fond) au coin de Z1 seule, jamais sur toutes les tuiles.]

### 2.3 Carte d'offre (aperçu)

Remplacé en s26 par `docs/design/encarts-premium-s26.md` (retour de Thomas du 18/11).
- Avant : `rounded-2xl border-2 border-accent-primary shadow-lg shadow-accent-primary/10 p-5 md:p-6`. Après : `relative rounded-xl border border-border-hover bg-background-card p-6`. Pas d'ombre, pas de violet. Son poids vient du bouton plein, de sa place en haut à droite et de l'air autour.
- Contenu, mêmes éléments, mêmes textes : bouton (`BOUTON_OFFRE`), phrase d'objet (`META`, centrée, `mt-4`), réassurance (`META`, `mt-4`, plus de `text-xs text-text-muted`), preuve (`mt-6 border-t border-border pt-6 text-center`), lien « Connexion » (`LIEN`, `text-text-secondary`, `mt-2`).
- Preuve : `META` avec le nombre en `TITRE_CARTE` en ligne (même coupe regex, même texte lu).

### 2.4 Rythme vertical : une unité, 8 px
Pas autorisés (unités Tailwind) : `2` (8), `4` (16), `6` (24), `8` (32), `12` (48), `16` (64). **Interdits** dans l'espace : `1`, `1.5`, `2.5`, `3`, `5`, `10`, `14`, `20` en marges et espacements verticaux (les paddings internes des pastilles et boutons restent ceux de leurs helpers).

| Où | Valeur |
|---|---|
| Haut de page | `pt-8` |
| En-tête de page vers contenu | `mt-8` |
| Entre cartes (toutes grilles) | `gap-6` |
| Padding de toute carte et tuile | `p-6` (retirer `p-5`, `p-8`, `md:p-6`, `md:p-8` ; `max-e300:p-4` garde son cas) |
| Titre vers texte, texte vers texte voisin | `mt-2` |
| Groupe vers groupe dans une carte (barre, séparateur, bouton) | `mt-4` ; séparateur `mt-6 border-t border-border pt-6` |
| Pied de tuile | `-mx-6 -mb-6 px-6 min-h-12` |
| Entre grands blocs (hero vers extrait, grille vers Contenu du jour) | `mt-12` (retirer `mt-8 md:mt-10 lg:mt-20`, `mt-10 md:mt-14`) |
| Titre de section vers ses cartes | `mt-6` |
| Bas de page | `pb-16` |
| Hero : colonnes | `gap-8 lg:gap-12` ; H1 vers promesse `mt-4` ; promesse vers pastilles `mt-6` (plus de `lg:mt-8`) |

### 2.5 Rayons et bords
- **Cartes, tuiles, offre, boutons, blocs internes : 12 px** (`rounded-xl` ; `rounded-lg` est identique, ne garder que `rounded-xl` pour les cartes). **Pastilles, barres, segments : `rounded-full`.** Retirés : `rounded-2xl` (offre), `rounded-md` (lignes de « Contenu du jour »).
- **Bords : 1 px partout** (`border border-border`, survol `border-border-hover`). Zéro `border-2` (hors `puce` choisie, composant existant), zéro ombre, zéro bordure colorée. Les lignes de « Contenu du jour » de l'extrait : plus de cadre, `divide-y divide-border` dans la tuile.
- Z1 (carte dominante) : même fond et même padding que les autres, `border-border-hover` ; elle domine par sa place (haut, 8 colonnes), son bouton et son titre en `TITRE_CARTE`.

### 2.6 Hero de l'aperçu
- H1 : `TITRE_PAGE` (24 / 30, plus de `text-4xl md:text-5xl lg:text-6xl`). Promesse : `TEXTE`, `mt-4`, `max-w-xl` (plus de `lg:text-2xl`, plus de `max-w-3xl`). Pastilles : `META` sur `bg-background-elevated rounded-full px-3 py-1`, point `bg-text-secondary` (ou retiré), sans `md:py-1.5`, sans `text-xs`.
- Phrase lue seulement (`sr-only`), grille 5/12 colonnes, textes : inchangés.

## 3. Correspondance ancien vers nouveau (table d'application)

| Élément mesuré | Avant | Après |
|---|---|---|
| H1 « Aujourd'hui » | 60/700 display | `TITRE_PAGE` : 24/600 (< 1024), 30/600 (>= 1024) |
| Titre de la carte d'action (Z1, « Quelqu'un te lance… ») | 30/700 | `TITRE_CARTE` 20/600 |
| Promesse du hero | 24/400 Inter | `TEXTE` 16/400 |
| « La suite est dans Premium » | 24/700 | `TITRE_CARTE` 20/600 |
| « 1 500+ » | 20/700 | `TITRE_CARTE` 20/600 en ligne dans une phrase `META` |
| « Tu t'échauffes » (nom du cap) | 20/700 | `TITRE_CARTE` 20/600 |
| XP et série (chiffres de Z2) | 30/700 | `TITRE_CARTE` 20/600 (libellé dessous en `META`) |
| Titres de tuiles (Étape conseillée, Mission, Contenu du jour, Semaines) | 18/700 | `TITRE_CARTE` 20/600 |
| Boutons (« Commencer », « Premium · 1,99 €/mois ») | 16/600 | inchangé, `TEXTE_FORT` 16/600 |
| Texte courant (accroche de mission, phrase d'objet, lignes de « Contenu du jour ») | 16/400 ou 14/400 | `TEXTE` 16/400 pour l'accroche et les lignes ; `META` 14/400 pour la phrase d'objet |
| Pastille « Premium » du hero | 14/600 violet | `META_FORT` 14/600, `text-primary` sur fond élevé, neutre |
| « Étape 1 sur 4 » | 14/600 | `META_FORT` 14/600 |
| Pastilles « ce qu'il y a dedans » | 14/400 | `META` 14/400 (point neutre) |
| Durée « 5 min », « cap 1 sur 5 », parcours, titre d'étape | 14/400 | `META` 14/400 |
| Réassurance « Premium : premier paiement remboursable… » | 12/400 `text-muted` | `META` 14/400 `text-secondary` |
| « Facultative » | 12/400 | `META` 14/400 (pastille `bg-elevated`) |
| « Premium » sur chaque tuile et en fin d'extrait | 12/600 | **supprimé** (un seul repère, celui du hero) |
| « TON PREMIER PAS », « TON CAP », « ÉTAPE CONSEILLÉE », « MISSION · MARCHE 1 » | 12/600 MAJ violet ou `muted` | `ETIQUETTE` 14/600 casse normale, `text-secondary` |
| Pieds de tuile (« Reprendre », « Commencer l'étape 1 ») | 14/600 violet | `META_FORT` 14/600 `text-primary` |
| H2 « Contenu du jour » (abonné) | 24/700, 30 dès md | `TITRE_CARTE` 20/600 |
| Date et repère de l'en-tête abonné | 14/400 | `META` 14/400, nombre en `META_FORT` |
| Cartes du contenu du jour reprises de l'accueil (`daily-content`) | tailles de l'accueil | à passer au gabarit (`TITRE_CARTE`, `TEXTE`, `META`) quand l'abonné les voit ; sous le premier écran, hors règle §4 mais non exemptées du lot |

Équivalence de la mesure : 8 tailles (60, 30, 24, 20, 18, 16, 14, 12) donnent 4 (30 ou 24, 20, 16, 14). 13 combinaisons donnent 6.

## 4. Règle de contrôle (tests en vrai navigateur)

**Périmètre** : le premier écran de `main` (hors en-tête global et barre des rubriques, traités dans un lot séparé qui devra aussi se plier à 14/16 et 400/600), aux viewports **375 × 812** et **1280 × 900**, pour les 4 comptes : visiteur, gratuit, abonné avancé (rafale non faite et étape en cours), nouvel abonné. Éléments pris : tout nœud texte visible dans le viewport (`getBoundingClientRect` croisé avec l'écran), y compris `aria-hidden` et `inert` (on contrôle le visuel). Mesure : transposer `tailles.mjs`, regrouper par (`fontSize`, `fontWeight`, `textTransform`).

Seuils bloquants, par compte et par largeur :
1. **Tailles distinctes <= 4**, toutes dans {14, 16, 20, 24 à 375, 30 à 1280}.
2. **Combinaisons taille/graisse/casse <= 6** ; graisses dans {400, 600} ; `textTransform` = `none` partout.
3. **Violet** : un seul élément avec fond `accent-secondary-hover` (le bouton plein de `main`) ; aucun texte, bordure ni fond violet ailleurs dans `main` (couleurs calculées #8B5CF6, #A78BFA, #7C3AED, #6D28D9 et leurs opacités interdites sauf ce bouton).
4. **Gris de texte** : couleurs de texte calculées dans {#FFFFFF, #B3B3B3} (+ blanc du bouton, + vert `success` de la coche) ; aucune autre.
5. **Rayons** des cartes et boutons de `main` : 12 px ; ombres : aucune ; bordures : 1 px.
6. **Rythme** : écart vertical entre deux cartes frères = 24 px ; padding des cartes = 24 px.
7. **Cibles** >= 44 px (boutons, liens, pieds de tuile) ; contrastes AA texte >= 4,5:1 (calculé, extrait inerte compris : `opacity-75` sur #B3B3B3 reste > 4,5:1 sur #1F1F1F, à vérifier par le test).
8. **« Se lit fermé »** (aperçu, visiteur et gratuit) : au premier écran, repère « Premium » (mot) présent une seule fois, bouton d'offre visible, au moins une tuile de l'extrait visible avec son contenu atténué ; pas de `BadgePremium` dans une tuile.
9. Capture de chaque compte à 375 et 1280 jointe, relue par @design (10 critères Thomas) avant de clore.

## 5. Application et ordre pour @fullstack
1. Créer `typo.ts` ; supprimer `ETIQUETTE`/`TITRE_TUILE`/`ETIQUETTE_ACTION` doublons et les faire pointer dessus.
2. `tableau.tsx` : `TUILE` (`p-6`, bords §2.5), `CARTE_ACTION` (plus de dégradé ni de filet, `border-border-hover`, `p-6`), `PIED_TUILE`, `PASTILLE` (`META`, `px-3 py-1`), `BarreProgression`/`SegmentsCap` (neutres), `StatChiffre` (`TITRE_CARTE` + `META`).
3. `action-du-jour`, `cap-du-jour`, `etape-en-cours`, `mission-lien`, `semaines-tuile`, `cartes-du-jour`, `question-aise`, `dans-ton-espace`, `contenu-du-jour`, page abonné : classes de §3.
4. `apercu/*` : `badge-premium` (un repère), `tuile-fermee` (sans badge), `extrait-coupe` (sans badge, `mt-12`), `offre-apercu` (§2.3), `hero-apercu` (§2.6), `tableau-verrouille` (liste sans cadres).
5. Mettre à jour les tests existants qui comptent 5 pastilles « Premium » ou lisent `uppercase`/`text-3xl`, puis ajouter la règle §4. Signaler @qa (captures, snapshots).
6. Consigner dans `REPLIT_ACTIONS.md` (aucune action d'infra attendue, aucun changement de config).

## 6. Hors périmètre, à traiter ensuite avec la même échelle
Les autres pages de l'espace (S'entraîner, Parcours, Quoi répondre, Bibliothèque, Favoris, Carnet) importent les constantes de `typo.ts` ; l'en-tête global et la barre des rubriques ; les cartes de l'accueil réutilisées. Le gabarit est le même : 4 tailles, 2 graisses, zéro capitale, un violet, 8 px.
