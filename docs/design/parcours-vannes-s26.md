# Parcours et Vannes, spec visuelle s26 (espace ouvert seulement, rien en production)

Structure : `docs/ux/parcours-vannes-s26.md` (fait foi). Traitement : `typo-harmonie-espace-s25.md` (4 tailles 14/16/20/24-30, 400/600, 0 capitale, pas de 8 px, `rounded-xl`, `border` 1 px, zéro ombre, un aplat violet). Langage : `rubriques-abonne-s26.md`. Objet Premium : `encarts-premium-s26.md`, réutilisé tel quel. Constantes de `components/espace/typo.ts` (TITRE_PAGE, TITRE_CARTE, TEXTE, TEXTE_FORT, META, META_FORT, ETIQUETTE) et `CADRE_CARTE_NEUTRE`, `BOUTON_SECONDAIRE`, `PASTILLE`, `BarreProgression` (`tableau.tsx`). Tout ce qui suit est derrière `ESPACE_CLIENT_PUBLIE`. Zéro texte neuf.

## 0. Règles communes
- **SEO : seuls les attributs `class` changent.** Aucun élément, texte, lien, ordre DOM ajouté ou retiré. Les grilles se posent sur les parents existants ; l'ordre visuel passe par `lg:col-start-*`, `lg:row-start-*`, `max-lg:order-*`. Si un parent commun manque (H1 dans `page.tsx`, quiz dans `parcours-content.tsx`), ne PAS ajouter de `div` : empiler et le signaler.
- **Un seul plein par écran.** Plein = `buttonVariants({ size: "lg" })` (16/600, `h-12`). Contour = `BOUTON_SECONDAIRE` + `h-auto min-h-12 w-full whitespace-normal sm:w-auto`. Le bouton Premium de l'en-tête global passe en contour tant que la page porte son propre plein (Parcours visiteur : « Tester l'étape 1 » ; Vannes visiteur dès `lg` : carte d'offre du hero). Repli si l'en-tête ne peut pas : sur Parcours visiteur toutes les cartes en contour, sur Vannes la carte du hero sans bouton plein. Jamais deux pleins visibles ensemble.
- **Filet violet des cartes retiré** (comme s26 rubriques, même arbitrage Thomas en attente) : `Card filet={false}`, cadre `CADRE_CARTE_NEUTRE p-6`. Plus de `border-accent-primary/40`, `bg-accent-primary/5`, `text-accent-link` (persona, XP, liens, chute) : texte neutre, liens `text-text-primary underline underline-offset-2`. `text-text-muted`, `text-xs`, `font-bold|medium`, `uppercase`, `tracking-*`, `rounded-lg|md|2xl` (hors objet Premium) interdits.
- Rythme : `pt-8`, `mt-8` en-tête vers contenu, `gap-6`, `mt-12` entre grands blocs, `mt-2` titre vers texte, `mt-4` groupe vers groupe, `pb-16`. Contenu pleine coque (≥ 1100 px à 1280), plus de `mx-auto max-w-3xl`.
- En-tête de page : H1 `TITRE_PAGE` (blanc, aligné à gauche, `text-center` retiré), chapô `TEXTE mt-4 max-w-xl`. Le chapô de Vannes passe de `text-lg` à `TEXTE`.
- Barre de progression : `BarreProgression` (rail `bg-border-hover`, remplissage `bg-text-secondary`, `h-2 rounded-full`). Nom lisible au-dessus : `flex justify-between META tabular-nums`, libellé `{n}/{total} étapes` (existant).
- Focus : `focus-visible:ring-2 ring-accent-primary` existant. Cibles `min-h-11`.

## 1. Parcours, liste (`/parcours`)
### 1.1 Visiteur et inscrit gratuit
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| H1 + chapô | `col-span-1` | `md:col-span-2` | `lg:col-span-8 lg:row-start-1` |
| Quiz | sous la liste (`order-last`) | idem | `lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start` |
| Cartes | 1 col | 2 col | `lg:col-span-12`, grille `lg:grid-cols-2` (6/6) |
| Dernière carte si impair | normale | `md:col-span-2` | `lg:col-span-2` avec zones internes 7/5 (§1.3) |
| Explore aussi | 1 col | 2 col | `lg:grid-cols-3` (4/4/4) |
| FAQ | 1 col | 1 col | titre `lg:col-span-4`, accordéon `lg:col-span-8` |
Parent de grille (page) : `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12`. `GRILLE_CARTES_OUVERTE` devient `grid gap-6 md:grid-cols-2 lg:[&>:last-child:nth-child(odd)]:col-span-2` (plus de `mx-auto w-[calc(50%-0.75rem)]`).

Quiz compact (4 cols) : cadre `CADRE_CARTE_NEUTRE p-6`, `filet={false}`. H2 « Quel parcours est fait pour toi ? » `TITRE_CARTE` (retirer `text-center`, `mb-4` devient `mt-4` sur le bloc). Étape : `META` « Question 1/2 » (plus de `Badge primary`), deux segments `h-2 w-6 rounded-full` (`bg-text-secondary` fait, `bg-border-hover` à faire). Question `TEXTE_FORT`. Réponses en colonne `gap-2` : `flex min-h-11 w-full items-center gap-2 rounded-xl border border-border-input bg-transparent px-4 py-2 text-left META hover:border-border-hover hover:bg-background-elevated` (plus de `hover:border-accent-primary`, `active:scale`). Résultat : titre `TITRE_CARTE`, raison `META`, « Voir ce parcours » = contour (jamais plein : le plein est sur la carte conseillée), « Refaire le quiz » lien `META` souligné.

### 1.2 Abonné
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| H1 « Parcours » | col 1 | `md:col-span-2` | `lg:col-span-8` |
| Étape à reprendre (QuatreSemaines) | 1er | 1er | `lg:col-span-8` : LE plein |
| Cartes | 1 col, sous le rail compact | 1 col | `lg:col-span-8`, 1 colonne de cartes |
| Rail (TonCap puis TesBonus) | TonCap sous « à reprendre », TesBonus après les cartes | rail sous « à reprendre », 2 col | `lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-3 lg:self-start lg:sticky lg:top-24` |
| Quiz | sous la liste | idem | `lg:col-span-8`, même traitement qu'au §1.1 |
| FAQ (prix masquée) | 1 col | 1 col | 4/8 comme au §1.1 |
Rail : ne dépasse pas `100dvh - 6rem`, sinon retirer `sticky`. `top-24` à ajuster à l'en-tête réel [À VÉRIFIER @fullstack].

### 1.3 Carte de parcours (tous profils)
Cadre : `CADRE_CARTE_NEUTRE flex flex-col p-6`. Interne à `lg` : `lg:grid lg:grid-cols-12 lg:gap-x-6`, infos `lg:col-span-7`, zone progression + Programme `lg:col-span-5` (sous 1024 : une colonne, `mt-4`). Ordre DOM inchangé.
1. Parcours commencé seulement : en tête de carte, libellé `{n}/{total} étapes` + `BarreProgression mt-2`, `mb-4`.
2. Méta en ligne unique : `flex flex-wrap items-center gap-x-2 META`. Difficulté `META_FORT` sans fond (plus de `Badge primary`), puis durée, rythme, XP `META`, séparateurs `·` en `text-text-secondary`. Terminé : `LISTE_PARCOURS.termine` en `PASTILLE text-success`.
3. Titre `TITRE_CARTE mt-2` (20/600, plus de `text-2xl`), emoji conservé. Persona `TEXTE mt-2`. Description `TEXTE mt-2`. Témoignage `META italic mt-4` sans fond ni `rounded` (plus de `bg-accent-primary/5 p-3`).
4. « Programme » (même mot) : `summary` `flex min-h-11 items-center justify-between rounded-xl border border-border px-4 META_FORT hover:border-border-hover`, casse normale. Ouvert : `ol mt-4 space-y-2`, `li rounded-xl bg-background-elevated p-4`, semaine `META_FORT`, titre d'étape `TEXTE_FORT`, détail `META mt-2`, « Format » `META`, « +n XP » `META` (plus de violet). Étape 1 : `ETAPE_LIBRE_BADGE` en `PASTILLE text-success`. Étapes 2+ : verrou nu `h-4 w-4 text-text-secondary` aria-hidden devant le titre (jamais de badge Premium, un repère par page).
5. Pied : `mt-auto flex flex-col gap-2`. Bouton + ligne frontière `META` (plus de `text-xs text-text-muted`).
Boutons : visiteur et gratuit, « Tester l'étape 1 de {Parcours}, gratuite » plein sur la carte du parcours conseillé (quiz, sinon `PARCOURS_PAR_DEFAUT`), contour sur les autres ; abonné, plein sur `pleinUnique`, contour ailleurs ; terminé : `revoir` contour. États : chargement des caps = liste telle quelle (`aria-busy`) ; erreur API = liste sans barres ; aucun parcours entamé = parcours conseillé en plein.

## 2. Parcours, page d'un parcours (`/parcours/{slug}`)
Parent : `lg:grid lg:grid-cols-12 lg:gap-6`. Étapes `lg:col-span-8`. Rail `lg:col-span-4 lg:self-start lg:sticky lg:top-24`, `max-lg:order-first` (375 et 768 : sommaire replié en tête, une colonne). DOM inchangé : l'ordre visuel diffère de l'ordre de tabulation à 375, accepté car le sommaire est un `details` d'une ligne ; sinon rail après les étapes. [À VÉRIFIER @fullstack : lire `parcours-detail.tsx`, `step-blocks.tsx`, `sommaire-parcours.tsx` avant d'écrire ; ce qui suit est la cible.]
- Cartes d'étape : `CADRE_CARTE_NEUTRE p-6`, titre `TITRE_CARTE`, texte `TEXTE`, méta `META`, vannes et blocs internes `rounded-xl bg-background-elevated p-4`, plus de violet ni de capitales.
- Visiteur : rail = carte d'offre de l'objet Premium (a) (bouton plein en haut du rail, réassurance dessous) ; sommaire dessous (`META`, étapes 2+ avec verrou nu). Étape 1 : ses actions en contour, un seul plein sur la page (l'offre).
- Abonné : rail = sommaire avec `BarreProgression` + `{n}/{total} étapes`, « Fait » `META` + coche `text-success`, étape courante `META_FORT bg-background-elevated -mx-6 px-6` (pas de filet violet ni d'aplat). Plein = « Continuer » de l'étape à faire, placé dans l'étape ; les autres contour.
- Fil d'Ariane, H1, Course JSON-LD, contenu SSR de l'étape 1 inchangés.

## 3. Vannes (`/vannes`)
### 3.1 Visiteur et inscrit gratuit
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| H1 + chapô (`<header>` : `pt-8`, plus de `text-center`) | col 1 | `md:col-span-2` | `lg:col-span-8` |
| Carte d'offre (a) | `hidden` (l'en-tête porte l'offre) | `hidden` | `lg:block lg:col-span-4 lg:col-start-9 lg:row-start-1` |
| Rangée de catégories | `col-span-1`, défilement horizontal, 44 px | idem | `lg:col-span-12` |
| Vannes | 1 col | 2 col | `lg:grid-cols-3` (4/4/4) |
| Dernière vanne seule | normale | `md:max-lg:col-span-2` si impair | `lg:col-span-3` si le reste de 3 vaut 1 (10 gratuites : oui) |
| Mur de fin | pleine largeur | idem | `lg:col-span-12` (§3.3) |
| Bloc SEO | 1 col | 1 col | 3 colonnes (§3.4) |
| FAQ | 1 col | 1 col | titre `lg:col-span-4`, accordéon `lg:col-span-8` |
- Carte d'offre du hero = objet Premium (a), classes de `encarts-premium-s26.md` à l'identique (bord 2 px, halo 5 %, `p-6`), éléments existants (bouton, réassurance). Pas de titre ajouté. Visible seulement quand la page est large, pour que 375 garde H1, chapô, rangée et 1re vanne entière avant y = 812.
- Rangée : `RangeeDefilante`, « Toutes » active par défaut. Pastille : `inline-flex min-h-11 items-center rounded-full border border-border-input px-4 py-2 META hover:border-border-hover hover:bg-background-elevated` ; active `border-text-primary bg-background-elevated META_FORT`. Chevrons 44 px dès 1024 conservés.
- Squelette : `lg:grid-cols-3`, `gap-6`, `rounded-xl`.

### 3.2 Carte de vanne (visiteur, gratuit, abonné)
Cadre `CADRE_CARTE_NEUTRE flex h-full cursor-pointer flex-col p-6 hover:border-border-hover` (retirer `hover:bg-background-light`, filet, `gap-4` de grille devient `gap-6`). Catégorie `PASTILLE` (plus de `Badge primary`) ; favori et partage inchangés. Amorce `text-base text-text-primary mt-4`. Chute révélée : `mt-4 TEXTE_FORT` (plus de `text-accent-link`). Décryptage : bloc `mt-4 rounded-xl border border-border bg-background-elevated p-4` ; « Pourquoi ça marche : … » `META_FORT` (casse normale, mêmes mots) ; explication `META mt-2` ; « À toi de jouer » `META_FORT` dans `mt-4 rounded-xl border border-border bg-background-card p-4`, texte `META mt-2` ; lien anatomie `META` neutre souligné. Pied `mt-auto pt-4` : « Révéler la chute » = `BOUTON_SECONDAIRE`-ghost `-ml-3 min-h-11 META_FORT`, teaser `META` (plus de `text-muted`), flèche inchangée.

### 3.3 Mur de fin de liste (visiteur et gratuit)
`mt-12`, plus de `text-center [&_.text-left]:text-center`. Objet Premium (b), classes de `encarts-premium-s26.md`, avec `lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:text-left` : phrase et réassurance à gauche (8 col), bouton à droite (`lg:w-1/3 lg:shrink-0`, 4 col). Réassurance toujours sous le bouton : en `lg`, bouton et réassurance dans le même bloc de droite. Règle du 19/11 : bouton de la carte de fin en contour dès 1000 px de haut (déjà codé, à ne pas perdre). Aucune carte floutée. 375 et 768 : carte `max-w-md mx-auto` (b) inchangée.

### 3.4 Bloc SEO et FAQ
- Section `mt-12 border-t border-border pt-12`. H2 « Pourquoi ces vannes sont différentes » `TITRE_CARTE`, à gauche (retirer `text-center`, `font-bold`). Paragraphes (div existante) : `mt-6 grid gap-6 lg:grid-cols-3 TEXTE` (remplace `mx-auto max-w-3xl space-y-3 text-sm lg:text-base`), `strong` en `TEXTE_FORT`, liens `text-text-primary underline underline-offset-2`. 375 et 768 : une colonne.
- FAQ : `FaqSection` reçoit la variante de classes « split » (aucun changement de contenu) : racine `lg:grid lg:grid-cols-12 lg:gap-6`, titre `TITRE_CARTE lg:col-span-4`, liste `lg:col-span-8`. Item : question `TEXTE_FORT` (`min-h-12`), réponse `TEXTE`, séparateur `divide-y divide-border`.
- « La suite » : `grid gap-6 md:grid-cols-3`, cartes `CADRE_CARTE_NEUTRE p-6` (retirer `CARTE_A_FILET`, `rounded-lg p-4`, `hover:border-accent-primary/40`), titre `TEXTE_FORT`, texte `META`.

### 3.5 Vue abonné (classes seulement)
Hero : H1 + chapô `lg:col-span-12 max-w-xl` (plus de colonne 4 ni de carte d'offre ; aucun vide à droite), rangée collée dessous `mt-6`. Liste : mêmes classes que le §3.1 (`lg:grid-cols-3`, 12 vannes par page, jamais de dernière seule), carte du §3.2. `ListPagination` conservée, `mt-12`. Pas de mur, pas de barre (aucune donnée de progression). Bloc SEO et FAQ : mêmes classes que le §3.4, FAQ jamais retirée.

## 4. Critères mesurables
1. Premier écran, 4 comptes, 375 et 1280 : ≤ 4 tailles, ≤ 6 combinaisons, 400/600, `textTransform: none`, rayons 12 px (objet Premium 16 px excepté), bords 1 px, zéro ombre hors objet Premium.
2. Aplats : exactement 1 fond `accent-secondary-hover` par écran, à 375, 768, 1280 et 1280 x 1080 ; aucun texte ni bordure violets hors ce bouton, l'objet Premium et le focus.
3. Grilles : Parcours abonné 8/4 ; cartes 6/6 ; Vannes 4/4/4 ; FAQ 4/8 ; bloc SEO 3 col ; aucun bloc centré seul à 1280 ; contenu ≥ 1100 px ; aucun vide > 32 px dans un bloc ; cartes frères espacées de 24 px, `p-6`.
4. Parcours visiteur : 1 bouton « Tester l'étape 1 de {Parcours}, gratuite » plein, les autres contour. Abonné : 1 plein (étape à reprendre) ; barre `n/total` sur toute carte commencée. Détail : 1 plein par vue.
5. Vannes visiteur : 10 vannes sur ≥ 5 catégories ; à 375, H1, rangée et 1re vanne entière avant y = 812 ; abonné : « Toutes » active, 12 premières vannes sur ≥ 5 catégories sans doublon consécutif.
6. SEO : diff du HTML serveur visiteur (fermé contre ouvert) = attributs `class` seuls, 0 octet de différence sur H1, chapô, FAQ, JSON-LD, hrefs, slugs, textes ; Jest d'inertie 47/47 sans mise à jour.
7. Cibles ≥ 44 px, WCAG 2.2 AA (texte `#B3B3B3` sur `#1F1F1F`), clavier sur la rangée, aucun défilement horizontal à 375 et 320 hors rangée.
8. Captures 375/768/1280 des 4 comptes lues par @design (10 critères Thomas) avant de clore ; diff réel dans le rapport @fullstack.

Handoff -> @fullstack : Vannes abonné (§3.5, §3.2) tout de suite ; Parcours (§0, §1, §2) et Vannes visiteur (§3.1, §3.3, §3.4) ensuite, classes seules, aucun élément ajouté.
Handoff -> @orchestrator : arbitrages à confirmer : bouton Premium de l'en-tête en contour sur ces pages (repli au §0), filet violet retiré (même arbitrage que s26 rubriques).
Handoff -> @qa : gate `tailles-comptes.mjs` aux 4 comptes, diff HTML fermé/ouvert, captures 375/768/1280 + 1280 x 1080 (un seul plein).
