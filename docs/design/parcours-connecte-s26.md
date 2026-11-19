# Parcours, spec design s26 : /parcours et /parcours/[slug] (4 états, 5 largeurs)

Pour @fullstack. Structure et trajets : `docs/ux/parcours-connecte-s26.md` (fait foi, arbitrage inclus : plus de rail court, `id` d'ancre espace ouvert seulement). Remplace la composition 8/4 de `parcours-vannes-s26.md` §1.2 et §2 ; restent : typo, cadres neutres, un seul aplat, cibles 44 px. Tout est derrière `ESPACE_CLIENT_PUBLIE` ; fermé = HTML identique au caractère près (classes seulement sur les parents publics). Zéro texte neuf. Échelle `typo.ts` seule : TITRE_PAGE 24/32 puis 30/36 dès 1024, TITRE_CARTE 20/28, TEXTE 16/24, TEXTE_FORT 16/24 600, META 14/20, META_FORT et ETIQUETTE 14/20 600 ; 0 capitale, `rounded-xl`, bordure 1 px, 0 ombre, rythme 8 px. Mesures : `[ESTIMÉ]` (calcul depuis `gabarit.ts` : `max-w-7xl px-4 md:px-6 xl:px-8`, aucun navigateur ici) ; @qa mesure.
Limite : `step-blocks.tsx` et `FaqSection` hors carte (corps d'étape) non lus en détail : points `[À VÉRIFIER @fullstack]`.

## 1. Géométrie commune (12 colonnes dès 1024, gouttière `gap-x-6` = 24 px)
Largeur de contenu : 343 (375) / 720 (768) / 976 (1024) / 1216 (1280) / 1216 (1920, marge 352 de chaque côté, la coque ne s'élargit pas). Colonne : 59,3 (1024), 79,3 (1280, 1920).
Parent de page (`ColonneParcours`) : `grid w-full grid-cols-1 lg:grid-cols-12 lg:gap-x-6` (existant). Chaque bloc : `lg:col-span-12` (plus aucun `col-span-8`, `col-start-9`, `row-span`, `sticky`). Rythme vertical, un seul jeu : H1 `mb-8` ; blocs de l'en-tête de l'abonné `mt-6` entre eux ; grands blocs `mt-12` ; `pb-16`. Bords gauche et droit : ceux du parent, jamais de `mx`, `ml`, `max-w` sur un bloc en cadre (seuls les paragraphes de texte gardent `max-w-2xl`).

## 2. /parcours, rangée par rangée
| # | Rangée | Classes (lg = dès 1024 ; en dessous : une colonne, `md` = 2 col quand dit) |
|---|---|---|
| 1 | H1 | `TITRE_PAGE mb-8 lg:col-span-12` (abonné : « Parcours » ; visiteur : titre long + chapô `TEXTE mt-4 max-w-2xl`) |
| 2 | Annonce | `lg:col-span-12 lg:has-[p]:mb-6` (existant, si annonce) |
| 3 | Carte « En cours » | voir 2.1 |
| 4 | Tes 4 semaines | voir 2.2 |
| 5 | Tes bonus | voir 2.3 |
| 6 | H2 « Les parcours » + cartes | H2 `TITRE_CARTE lg:col-span-12 mt-12 mb-6` ; cartes voir 2.4 |
| 7 | Quiz | voir 2.5 |
| 8 | Explore aussi | `mt-12 border-t border-border pt-12 lg:col-span-12` ; H2 `TITRE_CARTE` ; grille `mt-6 grid gap-6 sm:grid-cols-2 md:[&:has(>:nth-child(3))]:grid-cols-3 sm:max-md:[&>:last-child:nth-child(odd)]:col-span-2`. 3 cartes : 4/4/4 dès 768 ; 2 cartes : 6/6. Cartes `p-6`, titre TEXTE_FORT, texte META `mt-2` (existant). Hauteurs égales par `items-stretch` (défaut grid) |
| 9 | FAQ | `mt-12 border-t border-border pt-12 lg:col-span-12`. `FaqSection split` perd sa grille 4/8 : parent sans `lg:grid`, H2 `TITRE_CARTE mb-6`, liste `divide-y divide-border border-y border-border` pleine largeur (réponses `MESURE_TEXTE` : seul un paragraphe de texte reste étroit, admis) |

### 2.1 Carte « En cours » (abonnés : avancé, nouvel abonné)
`QuatreSemaines` se scinde en deux `section` (composant ouvert seulement, client) : carte « En cours » PUIS calendrier. Carte : `CADRE_CARTE_NEUTRE p-6 lg:col-span-12`, deux rangées, aucune colonne latérale.
- Rangée 1 : `grid gap-y-4 lg:grid-cols-12 lg:gap-x-6`. Gauche `min-w-0 lg:col-span-9 space-y-2` : ETIQUETTE (`enCours` / `conseillee`), titre du parcours TITRE_CARTE, « Étape n sur N » META `tabular-nums` (si en cours), titre d'étape TEXTE_FORT. Droite `lg:col-span-3 lg:self-center lg:justify-self-end` : bouton plein `buttonVariants({size:"lg"})` `h-auto min-h-12 w-full whitespace-normal sm:w-auto sm:px-8` (`Reprendre` ou `Commencer l'étape n`). Sous 1024 : bouton sous le texte `mt-2`, pleine largeur à 375, `sm:w-auto` dès 640. Hauteur rangée 1 : 116 px de texte, 48 de bouton centré (`self-center`) : aucun vide > 32 `[ESTIMÉ]`.
- Rangée 2 (si caps lus ; sinon absente) : `mt-6 border-t border-border pt-6 grid gap-x-6 gap-y-4 lg:grid-cols-12 lg:items-center`. Barre `BarreProgression` du parcours en cours : `lg:col-span-4` (absente chez le nouvel abonné : alors `TonCap` en `lg:col-span-12`). `TonCap` variante `enLigne` : `lg:col-span-8 min-w-0`, sans cadre (`border-0 bg-transparent p-0 shadow-none`, `section#cap` et `aria-labelledby` gardés), contenu `flex flex-wrap items-center gap-x-6 gap-y-2` : H2 « Ton cap » META_FORT (plus `text-xl font-bold`), série TEXTE_FORT (flamme `text-text-secondary` : plus de violet), cap TEXTE_FORT, cinq repères `h-4 w-4` neutres (`NEUTRE_CAP` : bordure `border-text-secondary`, plein `bg-text-secondary`), phrase d'écart META (ligne entière `basis-full`). Wrap : 1280 une ligne (≈ 685 px de contenu pour 770 de colonne) `[ESTIMÉ]`, 1024 deux lignes, 768 et 375 : H2 + repères sur la première, série puis cap dessous.
- Chargement : squelette de la carte entière à la hauteur finale (rangée 1 + rangée 2), `aria-busy`, pas de `min-h` en dur : blocs gris de mêmes hauteurs que les textes (20, 28, 20, 24, 48 ; 28). Échec API : rangée 1 seule, calendrier présent.
- Un seul aplat : `Reprendre`. `TonCap` n'a plus de `before:hidden`, ni `lg:sticky`, ni `RAIL_CAP`.

### 2.2 Tes 4 premières semaines
`CADRE_CARTE_NEUTRE p-6 mt-6 lg:col-span-12` ; `details` + `summary` `min-h-11` (existant, ouvert dès 300 px). `ol mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-6` ; `li` en pile : `border-t border-border pt-4` (filet horizontal sur chaque cellule, jamais de filet vertical qui montrerait un bas de colonne), étiquette `<b>` META_FORT en bloc, texte META `mt-1` dessous (remplace le `grid-cols-[auto_1fr]` de 2 colonnes). 768 : 2x2 (cellules 348 px) ; 1024 : 4 x ≈ 214 px de texte `[ESTIMÉ]` (3 à 4 lignes) ; 1280 et 1920 : 4 x 274. Hauteurs égales : `items-stretch` ; la semaine 4 (texte le plus court) laisse au plus 2 lignes (≈ 40 px) sous son texte, sans cadre ni filet vertical : non compté dans C1 (cadre = la carte, dont le bas suit la cellule la plus longue). Si un jour > 3 lignes d'écart `[ESTIMÉ]` : renvoi @copywriter, jamais `min-h`.

### 2.3 Tes bonus (si un bonus est ouvert)
`TesBonus` est UN lien (le dernier bonus), pas une grille (le UX supposait 1 à 4 cartes : corrigé ici). Classes : `mt-6 lg:col-span-12 flex min-h-11 items-center justify-between rounded-xl border border-border bg-background-card px-6 py-2` (au lieu de `rounded-lg border-border-input px-4`), META_FORT, chevron `text-text-secondary` à droite. Bords gauche et droit = ceux de la carte au-dessus (écart 0).

### 2.4 Liste des cartes de parcours
Parent : `grid gap-x-6 gap-y-0 md:grid-cols-2 lg:col-span-12 -mb-6` ; carte : `mb-6 flex flex-col md:row-span-5 md:grid md:grid-rows-subgrid md:gap-y-0 p-6` (`grid-rows-subgrid` : Tailwind ≥ 3.4 `[À VÉRIFIER @fullstack]`, sinon `md:[grid-template-rows:subgrid]`). Valable pour l'abonné ET le visiteur (même grille, plus de `GRILLE_CARTES_ABONNE` en `col-span-8`).
Principe d'égalité de hauteur SANS `min-h`, SANS `mt-auto`, SANS `justify-between` : les deux cartes d'une rangée partagent 5 pistes (sous-grille) ; chaque section occupe SA piste, de hauteur = la plus haute des deux. Titres, descriptions, boutons tombent à la même ordonnée, au pixel ; la différence de texte (une à deux lignes de 24) se répartit entre les pistes : au plus 24 px de blanc par piste `[ESTIMÉ]`, jamais 100 px en fin de carte.
Pistes (explicites, sinon un élément absent décale les suivants) : 1 `md:row-start-1` en-tête (méta `min-h-6` pour absorber la pastille « terminé », titre `mt-2`, persona `mt-2`) ; 2 `md:row-start-2` description `mt-2` ; 3 `md:row-start-3` témoignage `mt-4` ; 4 `md:row-start-4` barre `n/total` `mt-4` (parcours entamés) ; 5 `md:row-start-5` pied (`PiedCarte`) `mt-6` : « Programme » (`min-h-11 rounded-xl`) puis bouton contour `min-h-12`, ligne frontière META dessous (visiteur, gratuit). La piste 4 vide vaut 0 px si aucune des deux cartes n'a de barre.
`[ÉCART À L'UX §2.2 : barre « en tête »]` : en tête, une paire mixte (une entamée, une non) décalerait tous les titres de 36 px. En piste 4 (juste avant « Continuer ») les titres restent alignés ; coût : paire mixte = un blanc de ≈ 52 px (20 + 8 + 8 + 16) entre témoignage et pied dans la carte sans barre `[ESTIMÉ]`, seule exception à C1 : arbitrage orchestrateur (alternative : retirer la barre des cartes puisque « En cours » porte la progression du parcours actif).
Dernière carte impaire (tous profils, `md:col-span-2`) : plus de zones 7/5 (125 px de vide au tour 2, 90 px estimés ici côté droit) ; elle reste empilée sur 12 colonnes : pistes 1 à 3 en `md:col-span-2` (texte `max-w-none`), pied en rangée `lg:flex lg:flex-row lg:items-center lg:gap-6` : « Programme » `lg:flex-1` (même largeur que le bouton + écart, 6 colonnes) et bouton contour `lg:flex-1 lg:w-auto` ; aucun côté droit vide. `<details>` ouvert : liste des étapes en `md:grid-cols-2 gap-2` sur cette carte.
Méta : `flex flex-wrap items-center gap-x-4 gap-y-1 META` (aucun « · »). Boutons : contour, jamais « Reprendre ».

### 2.5 Quiz d'orientation
H2 `TITRE_CARTE mt-12` (sans `mt` neuf pour le quiz : le wrapper existant `placeQuiz` devient `mt-12 lg:col-span-12`, `lg:row-start` supprimés). Carte `CADRE_CARTE_NEUTRE p-6 mt-6`, empilée sur toute la largeur : ligne 1 « Question n/2 » META + segments `h-2 w-6` (existant) ; ligne 2 question TEXTE_FORT `mb-4` ; réponses `grid gap-2 md:grid-cols-3` (3 réponses : 4/4/4 dès 768, 343 px à 375 en 1 colonne), `min-h-11 rounded-xl border border-border-input` (existant) ; à 768 les 3 colonnes de 232 px : libellé jusqu'à 2 lignes `[ESTIMÉ]`, `items-stretch`. Résultat : `flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between` : titre TITRE_CARTE + raison META à gauche (`max-w-2xl`), boutons à droite ; plus de colonne de 4 : le visiteur n'a plus de quiz à côté du H1 (UX §3).
Visiteur et gratuit : en-tête = H1 + chapô sur `lg:col-span-12` (`max-w-3xl` sur le chapô seul), cartes (2.4), quiz SOUS les cartes (`order` retiré : c'est déjà l'ordre DOM voulu) `[À VÉRIFIER : le quiz est avant les cartes dans le DOM pour le visiteur ; sans l'`order`, il passerait avant : garder `max-lg:order-1` en mobile ET ajouter `lg:order-1` (classes seules)]`.

## 3. /parcours/[slug]
Parent : `lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-8` (remplace `COLONNE_DETAIL` 8 et `RAIL_DETAIL`). Rangée A (en-tête) : gauche = bloc existant (fil d'Ariane, H1, méta, argumentaire) `lg:col-span-7 lg:mb-0` ; droite = carte de progression `lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-9 lg:h-full lg:self-stretch lg:mb-0`. `lg:mt-9` = 36 px = fil d'Ariane (20) + `mb-4` (16) : haut de la carte = haut du H1, au pixel (bords hauts alignés ; le fil seul dépasse au-dessus). Largeurs : 7 col = 559 (1024), 699 (1280/1920) ; 5 col = 393 (1024), 493 (1280/1920). Sous 1024 : une colonne, carte après l'argumentaire.
Carte : `CADRE_CARTE_NEUTRE p-6`, contenu empilé du haut, aucun `mt-auto`. Abonné : `SommaireParcours` (barre `n sur N étapes` META_FORT, lignes `py-3` = 48 px, numéro TEXTE_FORT gris, titre META, `Reprendre` plein). Hauteur : 48 + 8 + 8 + 16 + 48 x N + 48 de padding ≈ 100 + 48 N ≈ 340 (N = 5) ; colonne gauche ≈ 36 (fil) + 36 (H1) + 28 (méta) + 16 + description ≈ 96 + « Pour qui » ≈ 120 ≈ 330 à 400 `[ESTIMÉ]`. Si |gauche − droite| > 32 : levier 1 `lg:max-w-none` sur description et « Pour qui » (lignes plus longues = moins de lignes) ; levier 2 mettre la ligne « Pour qui ? » (section existante, DOM dans le bloc gauche) dans la rangée B ; jamais `min-h`.
Visiteur et gratuit : même carte, lignes `flex items-center gap-x-3 py-3 min-h-12`, lien `#etape-N` (META, numéro TEXTE_FORT gris), `ETAPE_LIBRE_BADGE` en PASTILLE sur l'étape 1, ligne `progressionVisiteurTexte()` META en tête ; aucun bouton plein (le plein = en-tête collant).
Rangée B (« Pour qui ? » + témoignage, si sortis du bloc gauche ou abonné avancé : après le programme) : `lg:col-span-12`, `max-w-none`.
Rangée C (programme) : `lg:col-span-12`, étapes `space-y-6`. Étape repliée : une ligne `flex min-h-12 items-center gap-3` (numéro TEXTE_FORT, titre TEXTE_FORT `flex-1`, méta META à droite, statut). Étape ouverte (`CADRE_CARTE_NEUTRE p-6`) : corps `lg:grid lg:grid-cols-12 lg:gap-x-6` texte `lg:col-span-7`, exercice ou vannes `lg:col-span-5 lg:self-start` ; condition : écart de hauteur des deux zones ≤ 32 px, sinon une colonne pleine largeur (12) avec l'exercice en dessous `mt-6` `[À VÉRIFIER @fullstack : step-blocks.tsx]`. Carte de fin et lettre : `lg:col-span-12`.
Ancre : `scroll-mt-[137px]` à 1280 (121 + 16) ; sous 1024 (en-tête collant plus bas, `[ESTIMÉ]` 89 px) valeur lue de la variable existante, pas en dur `[À VÉRIFIER]`.

## 4. États : ce qui change par compte (HTML identique, classes seules)
| État | /parcours | /parcours/[slug] |
|---|---|---|
| Visiteur | H1 long + chapô, cartes 6/6 (contour partout), quiz, explore, FAQ ; zéro carte en cours, semaines, bonus | en-tête 7/5, carte de progression = liste de lien ; plein = en-tête collant |
| Gratuit | idem, ligne frontière sans « Sans compte. » | idem |
| Nouvel abonné | H1 « Parcours », carte En cours (conseillée, rangée 1 + TonCap en `col-span-12`, pas de barre), semaines, cartes sans barre | sommaire avec « Commencer », plein |
| Abonné avancé | carte En cours (rangée 2 : barre 4 + Ton cap 8), semaines, bonus, cartes avec barre piste 4 | sommaire, « Reprendre » plein, « Fait » |
Un seul plein par écran partout, en-tête collant compris (abonné : « Reprendre » ; sinon bouton d'offre).

## 5. Table de mesures d'acceptation (px, `getBoundingClientRect`, tolérance ±2 sauf mention) `[ESTIMÉ]`
| Mesure | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|
| Largeur contenu = bords G et D de H1, carte En cours, semaines, bonus, liste, quiz, explore, FAQ (écart 0) | 343 | 720 | 976 | 1216 | 1216 |
| Gouttière | 24 | 24 | 24 | 24 | 24 |
| Carte de parcours (6/6) | 343 | 348 | 476 | 596 | 596 |
| Cellule des semaines | 295 | 348 | 214 | 274 | 274 |
| Réponses du quiz | 295 | 232 | 3 x 288 | 3 x 389 | 3 x 389 |
| En-tête de parcours : gauche 7 / droite 5 | 343 / 343 | 720 / 720 | 559 / 393 | 699 / 493 | 699 / 493 |
| Explore (3 cartes) | 343 | 232 | 309 | 389 | 389 |
| Haut carte de progression moins haut du H1 | 0 | 0 | 0 | 0 | 0 |
| Écart des hauteurs gauche / droite de l'en-tête | n.a. | n.a. | ≤ 32 | ≤ 32 | ≤ 32 |
| Écart des bas, cartes d'une rangée (hauteurs égales) | 0 | 0 | 0 | 0 | 0 |
| Vide de fin de carte (bas du dernier enfant à bas de carte moins 24) | ≤ 8 | ≤ 8 | ≤ 8 | ≤ 8 | ≤ 8 |
| Écart des hauts de titres d'une rangée (lignes de base) | 0 | 0 | 0 | 0 | 0 |
| Écart des hauts de boutons d'une rangée | n.a. | 0 | 0 | 0 | 0 |
| Hauteur carte En cours | ≈ 330 | ≈ 270 | ≈ 270 | ≈ 245 | ≈ 245 |
| Vide interne > 32 | 0 | 0 | 0 | 0 | 0 (exception : paire mixte 2.4 ≈ 52) |
| Cibles (boutons, summary, lignes) | ≥ 44 | ≥ 44 | ≥ 44 | ≥ 44 | ≥ 44 |
Lignes de base : même classes (méta `min-h-6`, titre TITRE_CARTE) dans des pistes de sous-grille, donc écart 0 ; mesure sur `Range.getBoundingClientRect` du texte, tolérance 1 px. Premier écran (1280 x 800, 1920 x 1080, 375 x 812) : aucune zone vide > 32 px sur la largeur ; plus aucune colonne à moitié vide (rail retiré).

## 6. Handoff
-> @fullstack : scinder `QuatreSemaines` (carte En cours, calendrier), variante `enLigne` de `TonCap`, sous-grille des cartes (pistes explicites), grille des semaines, quiz empilé, `FaqSection split` en pleine largeur, en-tête 7/5 de `parcours-detail.tsx` ; tout en classes ou composants du seul espace ouvert, `git show` du fermé identique ; mesurer avec le script de l'audit.
-> @qa : table du §5 sur 4 comptes x 5 largeurs ; C1 à C5 de l'UX.
-> Orchestrateur : arbitrer la barre des cartes (piste 4 vs retrait, §2.4) ; confirmer l'écart « Tes bonus = un lien » (§2.3).

## Arbitrage de l'orchestrateur (19/11)

- Point 10 (paire mixte, ~52 px de blanc) : pour l'abonné, la barre de progression est affichée sur TOUTES les cartes de parcours, y compris non entamées (barre vide, même composant et même gabarit `n/total` existants, aucun texte nouveau). La piste 4 est donc toujours remplie : plus d'exception à la règle des 32 px.
- Semaines : 2x2 de 768 à 1279, 4 colonnes dès 1280 (pas de cellule de 214 px à 1024).
- `id="parcours-{slug}"` : déjà présent sans condition dans le HTML fermé ; on le garde tel quel (rien à ajouter, inertie inchangée). L'arbitrage UX « seulement espace ouvert » ne concernait qu'un `id` NOUVEAU.
