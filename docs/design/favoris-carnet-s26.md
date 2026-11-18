# Favoris et Carnet s26 (spec @design pour @fullstack)

Structure : `docs/ux/favoris-carnet-s26.md` (fait foi). Traitement : `typo-harmonie-espace-s25.md` (14/16/20/24-30, 400/600, 0 capitale, rayons `rounded-xl`, bords 1 px, `gap-6`, `p-6`, `mt-8`/`mt-12`, 1 aplat violet) et langage de `rubriques-abonne-s26.md`. Offre : objet Premium de `encarts-premium-s26.md` (existe, non réinventé). Constantes de `typo.ts` seulement, aucun texte neuf (emplacement `PROMESSE` pour @copywriter). Espace ouvert uniquement.

## 0. Décisions communes (cohérence s26)
- **Titre en blanc** (Thomas 18/11) : `TITRE_PAGE` sans `text-gradient`/`text-transparent`. Valable Favoris, Carnet ; si `HeroApercu` reste partagé, retirer le dégradé pour toutes les rubriques (même retour).
- **Cadres** : `CADRE_CARTE_NEUTRE p-6` (filet violet des cartes retiré, 18/11). Prochaine action : `CARTE_ACTION`. Écarts `gap-6`, en-tête `pt-8`, grille `mt-8`, grands blocs `mt-12`, bas `pb-16`.
- **Onglet / ligne actifs (arbitrage, dit explicitement)** : le « filet violet » de la spec UX devient un **filet BLANC 2 px** (`border-l-2 border-text-primary` en rail, `border-b-2 border-text-primary` en rangée) + `TEXTE_FORT`. Raison : un filet n'est pas un aplat, mais en s26 on a passé le filet de la prochaine ligne en blanc ; un violet ferait un second accent au premier écran et rendrait la gate « aucun violet hors bouton » (s25 §4.3) KO. Inactif : `border-transparent` + `TEXTE`. Même règle pour la première fiche du Carnet.
- **Seul aplat** : `buttonVariants({ size: "lg" })` (offre pour le prospect ; état vide pour l'abonné). Liens secondaires : `META underline underline-offset-2 inline-flex min-h-11 items-center`. Focus `focus-visible:ring-2 ring-accent-primary`.
- **Aucune icône décorative** ; seul le verrou existant des tuiles fermées. Aucun emoji.

## 1. Favoris, aperçu (visiteur et gratuit) : `ApercuVerrouille rubrique="favoris"`
Hero 8/4 inchangé (`HeroApercu`, offre = objet Premium, `offre-en-haut.ts` + `favoris`). Promesse = `PROMESSE`. Pastilles : `Tout, Vannes, Conseils, Vidéos` (`TABS[].label`, `META` sur `bg-background-elevated rounded-full px-3 py-1`, inertes, `sr-only` sous 768).
Extrait, UNE grille avec le hero : `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12`, `mt-12` après le hero.
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Vanne (lecture seule, chute visible) | `col-span-1` | `col-span-1` | `lg:col-span-5` |
| Conseil (replié, titre + `line-clamp-2`) | `col-span-1`, fondu dedans | `col-span-1` (6/6), fondu dessous | `lg:col-span-7` |
| Rangée 2 `SuiteCoupee` : `TuileFermee` « Vidéo » (libellé `TEXTES_APERCU`) | `col-span-1` | `md:col-span-2` | `lg:col-span-12` |
- Cartes = mêmes composants que l'abonné (§2.2), sans « Retirer » ni « Partager » ; classes `CADRE_CARTE_NEUTRE p-6 flex h-full flex-col`. Étiquettes « Vanne », « Conseil » en `ETIQUETTE`, catégorie en `META` (une seule, un seul gris) ; titre/texte `TITRE_CARTE` (vanne : texte `TEXTE`, chute `TEXTE_FORT mt-4`). Zéro badge coloré, zéro « Exemple », zéro majuscule.
- Verrou : contenu des tuiles fermées `opacity-75` ; pas de pastille Premium par tuile (un repère, celui du hero). `favoris === null` : 2 `TuileFermee` `lg:col-span-6`.
- Fin d'extrait : objet Premium (b) de `encarts-premium-s26.md`, inchangé.
- Premier écran 1280x900 : hero + vanne + conseil replié visibles ; bouton d'offre y < 450 ; bouton de fin y > 900. 375 : bouton d'offre y < 700, vanne visible.

## 2. Favoris, vue abonné
### 2.1 Grille et en-tête
`<header className="pt-8">` : `TITRE_PAGE` aligné à gauche (plus de `centre`). Grille `mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start`.
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Onglets | rangée défilante `flex gap-2 overflow-x-auto` | rangée `md:col-span-2` | rail `lg:col-span-3 lg:sticky lg:top-24` (`top-24` à vérifier) |
| Liste | 1 col | `md:grid-cols-2` | `lg:col-span-9`, cartes courtes `lg:col-span-6`, vidéo `lg:col-span-12` |
### 2.2 Onglets
- Rail (`lg`) : `CADRE_CARTE_NEUTRE p-6`, `role="tablist"` vertical, chaque onglet `flex min-h-11 w-full items-center justify-between gap-4 border-l-2 border-transparent px-4`, libellé `TEXTE`, effectif `META tabular-nums` à droite (chiffre seul, aucun inventé). Actif : `border-text-primary TEXTE_FORT bg-background-elevated`. Survol `hover:bg-background-elevated`.
- Sous 1024 : `RangeeOnglets`, onglet `inline-flex min-h-11 items-center gap-2 border-b-2 border-transparent px-4 TEXTE`, actif `border-text-primary TEXTE_FORT`. Plus de bouton `variant="primary"`, plus de pastille colorée. Flèches clavier, `aria-selected`.
### 2.3 Cartes (vanne, conseil, vidéo)
- Gabarit unique : `CADRE_CARTE_NEUTRE p-6`, étiquette `ETIQUETTE`, titre `TITRE_CARTE mt-2` (vanne : texte en `TEXTE`), catégorie `META mt-2`, séparateur `mt-6 border-t border-border pt-4`, actions « Partager » et « Retirer » en `META underline underline-offset-2 min-h-11` (liens gris, jamais boutons pleins), `flex gap-6`. `ReactionButtons` inchangés.
- Prochaine action : carte la plus récente en tête, dépliée (`CARTE_ACTION`, chute visible). Vidéo : vignette `lg:col-span-5` + texte `lg:col-span-7` dans la carte (`lg:grid lg:grid-cols-12 lg:gap-6`), lecture à la demande (jamais pleine largeur de liste).
- Zéro badge de difficulté/catégorie coloré (`DIFFICULTY_VARIANT` non utilisé ici : difficulté en `META`).
### 2.4 États
- Vide par onglet : `CADRE_CARTE_NEUTRE p-6 lg:col-span-9` ; étoile `h-6 w-6 text-text-secondary` (icône de la bande, pas d'emoji), `emptyTitle` `TEXTE_FORT mt-4`, `emptyDesc` `TEXTE mt-2`, `ctaLabel` en `buttonVariants({ size: "lg" }) mt-6` = seul aplat. Le rail reste affiché.
- Chargement : 3 squelettes `rounded-xl bg-background-card h-40` dans la grille. Mur `!estPremium` : même grille, une carte `lg:col-span-9` + bouton plein existant.

## 3. Carnet, visiteur (`/carnet`)
Plus de `max-w-3xl` : conteneur de la coque, grille `lg:grid-cols-12`. Hero : `grid gap-4 md:grid-cols-5 md:gap-8 lg:grid-cols-12 lg:gap-12`.
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Texte hero (kicker `META`, H1 `TITRE_PAGE` blanc, intro `TEXTE max-w-xl`, bouton `buttonVariants({ size: "lg" })`, réassurance `META`) | 1 col, bouton y < 700 | `md:col-span-3` | `lg:col-span-8` |
| Tuile programme (3 titres + `listeReste(n)`, verrous) | dessous, `col-span-1` | `md:col-span-2` | `lg:col-span-4 lg:sticky lg:top-24` |
| Fiche offerte | 1 col | pleine largeur, intérieur `md:grid-cols-2` | `lg:col-span-8`, intérieur `lg:grid-cols-2 gap-6` |
| Fin d'extrait `CarnetPaywall` | `col-span-1` | `md:col-span-2` | sous la fiche, objet Premium (b) |
- Tuile programme : `CADRE_CARTE_NEUTRE p-6`, lignes `flex min-h-11 items-center gap-4 border-t border-border first:border-t-0 TEXTE_FORT` + verrou `h-4 w-4 text-text-secondary`, contenu `opacity-75` ; pied `META mt-4`. Kicker sans capitales : `META` (« Carnet de novembre 2026, 30 situations »).
- Fiche : `CADRE_CARTE_NEUTRE p-6` (plus de `FiletCarte`/`CARTE_A_FILET`), étiquette `ETIQUETTE` « Situation 10, offerte ». Gauche : contexte, « On te dit », « Tu réponds » ; droite : « Pourquoi ça marche », « Si ça se tend », « À toi de jouer » ; sous-titres `TEXTE_FORT`, corps `TEXTE`, `mt-2`, blocs `mt-6`. Fiche `lg:col-start-1` sur 8, la 4e colonne reste à la tuile programme.
- Dans `Au programme` : les 8 colonnes de gauche ne restent jamais vides à droite de la fiche (tuile sticky à 4). Jamais 2 boutons pleins ensemble (hero puis fin : un seul visible au premier écran).

## 4. Carnet, abonné
En-tête `pt-8` à gauche : kicker `META`, H1 `TITRE_PAGE`, intro `TEXTE mt-2 max-w-xl`. Aucun bouton plein, aucun aplat.
- **Sommaire** `<nav id="carnet-sommaire" className="mt-8 scroll-mt-24">`, `<ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">`. Tuile : `<a>` `CADRE_CARTE_NEUTRE flex min-h-11 flex-col p-6 hover:border-border-hover focus-visible:ring-2 ring-accent-primary` ; numéro `META tabular-nums`, titre `TEXTE_FORT mt-2`, contexte `META mt-2`. Première fiche (ou première non lue si le suivi existe, jamais simulé) : `border-l-2 border-text-primary` + `bg-background-elevated`. 1280 : 3 col (4/4/4) ; 768 : 2 ; 375 : 1.
- **Fiches** `mt-12` : `lg:grid lg:grid-cols-12 lg:gap-6`. Rail `hidden lg:block lg:col-span-3 lg:sticky lg:top-24 lg:self-start` : `CADRE_CARTE_NEUTRE p-6`, liste `META` numéro + titre, ligne `min-h-11`, position courante `border-l-2 border-text-primary TEXTE_FORT` (au scroll, `aria-current`). Fiche `lg:col-span-9`, intérieur `lg:grid-cols-2 gap-6` comme §3 ; entre fiches `mt-6`. Sous 1024, pas de rail.
- « Retour au sommaire » : lien `META underline underline-offset-2 inline-flex min-h-11 items-center mt-4`, à gauche sous chaque fiche (16/11).
- Carnets précédents : `mt-12`, titre `TITRE_CARTE`, pastilles `chipClass` en `flex flex-wrap gap-2 mt-6`, alignées à gauche, `lg:col-span-12`. Mois sans carnet : `CADRE_CARTE_NEUTRE p-6 lg:col-span-12` + texte existant `TEXTE_FORT`, alignée à gauche. `loading` : 6 squelettes de tuiles dans la même grille.

## 5. Critères mesurables (gate, 375x812 et 1280x900, comptes visiteur, gratuit, abonné)
1. Premier écran : <= 4 tailles {14, 16, 20, 24 ou 30}, <= 6 combinaisons, graisses {400, 600}, `textTransform: none`, zéro `text-xs`, `font-bold`, `uppercase`, `tracking-*`.
2. Un seul fond violet opaque par écran (visiteur : offre ; abonné : état vide seul) ; aucun texte, bord ou fond violet hors ce bouton, la teinte `CARTE_ACTION`, le halo de l'objet Premium et le focus ; filets d'onglet/fiche blancs ; titres blancs (#FFFFFF calculé, pas de dégradé).
3. Rayons 12 px, bords 1 px (hors objet Premium), pas d'ombre sur les cartes ; `gap` 24 px ; padding 24 px ; aucun vide > 32 px dans un bloc.
4. 1280 : Favoris aperçu hero 8/4 et extrait 5/7 sur 12 col ; Favoris abonné rail 3 + liste 9 ; Carnet visiteur 8/4 (fiche 8, programme 4) ; Carnet abonné sommaire 4/4/4, rail 3 + fiche 9 ; largeur utile >= 1 100 px ; aucune colonne centrée seule.
5. Aperçus : bouton d'offre y < 450 (1280) et < 700 (375) ; bouton de fin y > 900 / > 812 ; conseil replié, 0 bloc « Exemple » ; hauteur Favoris aperçu 1280 <= 2 000 px.
6. Carnet : 30 tuiles >= 44 px, « Retour au sommaire » après chacune des 30 fiches ; props visiteur = fiche offerte + titres/contextes seulement (test Jest conservé).
7. Cibles >= 44 px ; onglets au clavier (flèches), focus visible ; contrastes AA ; pas de défilement horizontal à 375 hors rangée d'onglets ; zéro emoji, zéro tiret cadratin ; zéro texte neuf hors `PROMESSE`.
8. Relecture @design sur captures 375/768/1280 par compte, comparées à l'étalon accueil et aux pages refaites (10 critères Thomas) ; diff réel mesuré (P0 s11).

## Handoff
-> @fullstack : `ApercuVerrouille` Favoris (+ `offre-en-haut.ts`, pas de `ESPACE_CLIENT_PUBLIE` fermé touché), `favoris-list.tsx` (rail/rangée, cartes unifiées, états sans emoji), `carnet-page.tsx` (hero 8/4, tuile programme, sommaire tuiles, rail sticky) ; à vérifier : `top-24`, suivi « lu » du carnet, `DIFFICULTY_VARIANT`.
-> @copywriter : `PROMESSE` Favoris. -> Thomas : filet d'onglet blanc au lieu de violet (§0), titre blanc sur tous les aperçus.
-> @qa : gate §5 aux 3 comptes, snapshots Favoris et Carnet à refaire, inertie fermée 47/47.
