# Rubriques abonné s26 : Quoi répondre et S'entraîner (spec @design pour @fullstack)

Structure : `docs/ux/rubriques-premium-s26.md` §1.2 et §3.2 (fait foi). Traitement : `docs/design/typo-harmonie-espace-s25.md` (4 tailles, 2 graisses, 0 capitale, un seul aplat violet, pas de 8 px, `rounded-xl`, `border` 1 px, zéro ombre). Harmonie avec la page abonné d'Aujourd'hui (12 colonnes dès `lg`, `gap-6`, `p-6`, `mt-8`, `mt-12`). Aucun texte neuf, uniquement des constantes de `typo.ts` et des classes du thème. Écrans : `md` 768, `lg` 1024 (12 colonnes), 1280 = `lg`.

## 0. Décisions communes
- **En-tête : aligné à gauche** (plus de `EN_TETE_CENTRE` sur ces deux pages). `<header className="pt-8">` : H1 `TITRE_PAGE` ; sous-titre éventuel (S'entraîner : `T.accroche`) `TEXTE mt-2 max-w-xl`. Grille `mt-8`, bas de page `pb-16`.
- **Cadres** : `CADRE_CARTE_NEUTRE` + `p-6` (jamais `CARTE`, qui porte `p-4 md:p-6` et le filet). Zone d'accent unique par page : `CARTE_ACTION` (import de `aujourdhui/tableau.tsx`, teinte violette légère, pas un aplat) pour la tuile de prochaine action ; tout le reste `TUILE`-like neutre.
- **[ARBITRAGE À CONFIRMER PAR THOMAS] Filet violet des cartes (choix du 15/11).** Je le RETIRE sur ces deux pages (`CADRE_CARTE_NEUTRE` au lieu de `CADRE_CARTE`) : le « un seul accent violet, le bouton plein » du 16/11 est postérieur et plus précis, et le filet ferait un second violet au premier écran. Repli si Thomas tient au filet : `CADRE_CARTE` sur les seules tuiles de liste, jamais sur la tuile d'action ni sur l'échelle ; la gate « 1 aplat » reste valable (le filet est un dégradé de 4 px, pas un aplat), mais la gate « aucun violet hors bouton » (typo s25 §4.3) devient KO sur ces pages.
- **Seul aplat violet** : `buttonVariants({ size: "lg" })` (`h-12`, 16/600). Un seul par écran. Les autres boutons : `BOUTON_SECONDAIRE`. Aucun `LIEN` violet : liens secondaires = `META underline underline-offset-2 inline-flex min-h-11 items-center` (neutre).
- **Barre de progression** : `BarreProgression` de `tableau.tsx` (rail `bg-border-hover`, remplissage `bg-text-secondary`, `h-2 rounded-full`, `aria-hidden`). Segments : même gabarit que `SegmentsCap`.
- **Focus** : `focus-visible:ring-2 ring-accent-primary` existant (seul violet permis hors bouton, état fonctionnel).

## 1. Quoi répondre (`/mon-espace/quoi-repondre`)

### 1.1 Grille
Conteneur : `mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12`. Ordre du DOM : action, filtres, liste.
| Bloc | 375 | 768 | 1280 (`lg`) |
|---|---|---|---|
| Tuile action | `col-span-1` | `md:col-span-2` | `lg:col-start-4 lg:col-span-9 lg:row-start-1` |
| Filtres | `col-span-1`, repliés | `md:col-span-2`, repliés | rail `lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-24`, ouverts |
| Liste (groupes par lieu) | 1 col | `md:col-span-2`, lignes en 2 colonnes | `lg:col-start-4 lg:col-span-9 lg:row-start-2`, lignes en 2 colonnes |
`top-24` (96 px) à ajuster à la hauteur réelle de l'en-tête global + barre des rubriques [À VÉRIFIER @fullstack] ; le rail ne dépasse jamais `100dvh - 96 px` (sinon retirer `sticky`).

### 1.2 Tuile de prochaine action (première situation sans « Fait »)
- Conteneur : `CARTE_ACTION` + `lg:col-span-9` (pas de `h-full` en grille de ligne unique : laisser la hauteur naturelle, `h-auto`).
- Intérieur, empilé, aucune ligne vide : titre de la fiche `TITRE_CARTE` ; durée `META mt-2` (`TEXTES_FICHE_LIGNE.minutes`) ; bouton `buttonVariants({ size: "lg" }) mt-4 w-full self-start md:w-auto` libellé `TEXTES_FICHE_LIGNE.voir`. Aucune étiquette (aucun texte neuf). Titre sur 2 lignes max à 375 (`[text-wrap:balance]` déjà dans `TITRE_CARTE`).
- Tout « Fait » : la tuile n'est pas rendue, la ligne `lg:row-start-1` laisse la liste monter (`lg:row-start-auto` sur la liste).
- La tuile = un lien entier ? Non : le bouton seul est la cible (44 px+, `h-12`).

### 1.3 Rail de filtres (1280) et filtres repliés (< 1280)
- `lg` : `CADRE_CARTE_NEUTRE p-6`. Titre de groupe `filtreOu` puis `filtrePour` en `ETIQUETTE` ; pastilles `mt-2 flex flex-wrap gap-2` ; second groupe `mt-6 border-t border-border pt-6`. Pied du rail (carnet) : `mt-6 border-t border-border pt-6`, lien `META` neutre (§0), libellé `TEXTES_QUOI_REPONDRE.carnet`.
- Pastille de filtre : `inline-flex min-h-11 items-center rounded-full border border-border-input px-4 py-2 META text-left hover:border-border-hover hover:bg-background-elevated`. **Choisie** : `border-text-primary bg-background-elevated META_FORT` (plus de `border-2 border-accent-link`, plus de `font-medium` : 500 et violet sortent de l'échelle). Pas de coche supplémentaire : l'état se lit par bordure blanche + gras ; `aria-pressed`/`aria-current` existants conservés.
- Rendu en DEUX instances pour éviter un `<details>` forcé : `<div className="lg:hidden">` = `<details>` replié (`SOMMAIRE_REPLIABLE`, libellé `filtrerLesCartes`, même `CADRE_CARTE_NEUTRE p-0` autour du sommaire pleine largeur, `min-h-11`) ; `<div className="hidden lg:block">` = rail ouvert. Une seule des deux dans l'arbre d'accessibilité (display none).

### 1.4 Liste par lieu et progression
- Chaque lieu = une tuile `CADRE_CARTE_NEUTRE p-6` (plus de `space-y-10` : `flex flex-col gap-6` entre tuiles). En-tête : `flex items-baseline justify-between gap-4` ; H2 `TITRE_CARTE` (retirer `font-bold`) ; compteur à droite `META tabular-nums` « faits/total » (chiffres seuls, remplace le `(n)`).
- Sous l'en-tête : `BarreProgression mt-4 faites={faits} total={n}` (rail visible à zéro). Lignes : `ListeFiches` existant `mt-4`, deux colonnes dès `md` (`md:grid-cols-2 gap-x-6`), la ligne « Fait » existante conservée (coche `text-success`, seule autre couleur).
- Lieu sans fiche : omis (existant). Lignes : cibles `min-h-11`.

### 1.5 États vides
Filtre sans résultat ou rien servi : une `CADRE_CARTE_NEUTRE p-6` en `lg:col-span-9` (le rail reste affiché), `vide` en `TEXTE_FORT`, `raconte` en lien neutre `mt-2` (§0). Pas de bouton plein : l'aplat ne vit que sur « Voir ». Chargement/erreur : fichiers existants, ne passent pas la gate.

## 2. S'entraîner (`/mon-espace/s-entrainer`)

### 2.1 Grille
Conteneur : `mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start`. Remplace `COLONNE_ENTRAINEMENT` (supprimé de cette page).
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Colonne cartes (segments, cartes) | 1 col, en premier | 1 col pleine largeur | `lg:col-span-7` |
| Colonne mission (échelle, mission) | 1 col, dessous | 1 col, dessous | `lg:col-span-5` |
Chaque colonne : `flex min-w-0 flex-col gap-6`. Pas de `sticky` (échelle + mission dépassent 640 px, une colonne collante plus haute que la fenêtre se coupe) [À CONFIRMER @ux, qui l'avait prévu].

### 2.2 Colonne cartes : prochaine action et progression
- Segments (une par carte du jour, au plus 3, uniquement si le statut est lisible, sinon rien) : `flex gap-2` pleine largeur de la colonne, chaque segment `block h-2 flex-1 rounded-full` (`bg-text-secondary` = faite, `bg-border-hover` = à faire), `aria-hidden`, puis `mt-0` (le `gap-6` de la colonne sépare). Pas de texte (aucun libellé existant ne porte « n sur 3 »).
- **Première carte à faire** : dépliée, rendue par `CarteRegistre`/`CarteEtToi` dans `CARTE_ACTION` (cadre tinté, `p-6`). Son bouton principal = `buttonVariants({ size: "lg" })`, l'unique aplat. Intérieur de carte aligné sur §0 (titre `TITRE_CARTE`, texte `TEXTE`, méta `META`, aucun `text-xs`/`font-bold`/`uppercase` : les retirer dans `carte/*` au passage).
- **Autres cartes** : repliées, `<details>` (`CADRE_CARTE_NEUTRE`, sommaire `min-h-12 px-6 flex items-center justify-between gap-4`, titre en `TEXTE_FORT`, durée en `META`, chevron `Chevron` `text-text-secondary` qui pivote `group-open:rotate-90`). L'ancre `#carte-N` d'Aujourd'hui ouvre sa carte (`:target` ou ouverture au chargement) [À VÉRIFIER @fullstack]. Cartes faites : coche `success` + `META` existant, repliées.
- `T.fini` : `TUILE` neutre, texte `TEXTE_FORT`, remplace la liste de cartes (colonne 7 col), la mission monte au premier plan.
- Compte à rebours : inchangé, en `META` dans la carte.

### 2.3 Colonne mission : échelle des 5 marches, puis mission
- **Échelle** (`CADRE_CARTE_NEUTRE p-6`, `<ol>`, chaque marche un lien `?marche=n#mission`) : titre de tuile `TITRE_CARTE` = `TEXTES_MISSION.titre` ; items `mt-4`.
  - 1280 (`lg`) : liste verticale, chaque `li` `flex min-h-12 items-center justify-between gap-4 border-t border-border first:border-t-0`, gauche `marche(n)` + `titresMarches[n]` en `META`, droite `TEXTES_GESTE.fait` + `Coche h-4 w-4 text-success` pour les marches passées. Marche en cours : `META_FORT`, fond `bg-background-elevated -mx-6 px-6` (pas de violet, pas de `border-2`). Futures : `META`.
  - 768 et 375 : 5 puces `flex flex-wrap gap-2`, chaque puce `PASTILLE` (`min-h-11 items-center`) avec `marche(n)` seul ; en cours `border border-border-hover bg-background-elevated META_FORT`. Retour à la ligne, jamais de défilement horizontal.
- **Mission** : `MissionCarte`, cadre `CADRE_CARTE_NEUTRE p-6`, mêmes constantes de typo. Bouton principal : `BOUTON_SECONDAIRE` (contour) tant qu'une carte reste à faire ; `buttonVariants({ size: "lg" })` quand `T.fini`/`sansCarte` (alors la carte de rafale n'a plus d'aplat : exactement un par écran).
- Marche en cours sans mission : `M.aucuneMission` en `TEXTE_FORT`, `voirLaMarche` en lien neutre.

### 2.4 États vides
Rafale finie ou aucune carte montrable : `T.fini` (colonne 7), échelle + mission toujours rendues (colonne 5) : pas de colonne vide. `?marche=n` sans mission : tuile `mission-vide` existante en colonne 5, jamais de page muette.

## 3. Rythme (identique aux deux pages)
`pt-8` en-tête, `mt-8` vers la grille, `gap-6` partout, `p-6` des cartes, `mt-2` titre vers texte, `mt-4` groupe vers groupe, `mt-6 border-t border-border pt-6` séparateur interne, `pb-16`. Interdits (typo s25 §2.4) : `1 1.5 2.5 3 5 10 14 20`, `text-xs`, `font-bold|medium`, `uppercase`, `tracking-*`, `leading-*`, `rounded-2xl|md`, `shadow-*`, `border-2`.

## 4. Critères mesurables (gate, comptes abonnés, 375x812 et 1280x900)
1. Tailles distinctes au premier écran <= 4 : {14, 16, 20, 24 à 375, 30 à 1280}.
2. Combinaisons taille/graisse/casse <= 6 : 24 ou 30/600, 20/600, 16/400, 16/600, 14/400, 14/600 ; `textTransform: none` partout ; graisses {400, 600}.
3. Un seul élément à fond `accent-secondary-hover` par écran (Quoi répondre : « Voir » ; S'entraîner : bouton de la première carte, ou de la mission si rafale finie) ; aucun texte, bordure ou fond violet hors ce bouton, la teinte `CARTE_ACTION` et le focus ; (si filet conservé, signaler l'écart).
4. Aucun vide vertical ou horizontal > 32 px à l'intérieur d'un bloc (tuile d'action empilée, pas de `justify-between` sur grand écart) ; cartes frères espacées de 24 px, padding 24 px.
5. 1280 : Quoi répondre 3/9 (rail x = 0 à 3 col, liste 9 col), S'entraîner 7/5 ; aucun bloc centré seul ; largeur utile du contenu >= 1100 px.
6. Prochaine action au premier écran à 375 ET 1280 (bouton plein y < 812 / y < 900) ; progression visible au premier écran (Quoi répondre : compteur et barre du premier lieu ; S'entraîner : segments et échelle de marches ; si les statuts de carte ne sont pas lisibles, au moins l'échelle).
7. Rayons 12 px, bords 1 px, ombres aucune ; cibles >= 44 px ; contrastes AA (texte secondaire #B3B3B3 sur #1F1F1F) ; focus visible ; pas de défilement horizontal à 375 ni à 320.
8. Zéro texte neuf (tous libellés issus des constantes citées), zéro tiret cadratin.
9. Captures 375/768/1280 par compte relues par @design (10 critères Thomas) avant de clore ; diff réel (fichiers, lignes) dans le rapport @fullstack (P0 s11).

## Handoff
**-> @fullstack** : `quoi-repondre/page.tsx` (grille §1, tuile action, rail + `<details>`, compteurs et barres par lieu) et `s-entrainer/page.tsx` (grille 7/5, segments, cartes repliées, échelle, bouton mission contour/plein) ; classes de `carte/*`, `mission/*`, `filtres-situations` ramenées à `typo.ts` (puce neutre §1.3) ; lignes à vérifier : `top-24`, ancre `#carte-N` ouvrant la carte repliée, statut de carte lisible dans `lireRafale`.
**-> @ux / Thomas** : [ARBITRAGE À CONFIRMER PAR THOMAS] filet violet retiré ici (§0) ; [À CONFIRMER @ux] pas de `sticky` sur S'entraîner.
**-> @qa** : mesures §4 aux 4 comptes (abonné avancé, nouvel abonné), snapshots de ces deux pages à refaire.
