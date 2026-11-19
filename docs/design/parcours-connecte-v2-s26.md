# Parcours v2, spec design s26 : /parcours et /parcours/[slug]

Pour @fullstack. Corrige les relectures à l'aveugle (design 6,5, UX 6) ; complète `parcours-connecte-s26.md` (reste valable sauf mention) et copie le gabarit de `liste-detail-quoi-repondre-s26.md`. Espace ouvert seulement (`ESPACE_CLIENT_PUBLIE=false` : HTML fermé identique, classes sur parents de l'espace ouvert). Échelle `typo.ts` seule, 0 capitale, `rounded-xl`, bordure 1 px, 0 ombre, rythme 8 px. Aucun texte neuf : tout libellé nouveau = `[TEXTE À VALIDER]`. Mesures `[ESTIMÉ]` (pas de navigateur), @qa mesure. Limite : `docs/founder-preferences.md` (décisions 14-19/11) non relu faute d'outil de recherche ; `[À VÉRIFIER orchestrateur]` qu'aucune n'est contredite. Composants `step-blocks.tsx`, `parcours-detail.tsx` non relus : `[À VÉRIFIER @fullstack]`.

## 1. Détail : menu d'étapes persistant (4 comptes, dès 1024)
- Ligne 1 (pleine largeur) : fil d'Ariane existant `mb-4` (porte le retour « Parcours » dès 1024). Sous 1024 : `LienRetour` « Parcours » EN HAUT (avant le H1, `flex min-h-11 items-center mb-4`, bord gauche de la carte), le fil d'Ariane masqué `max-lg:hidden`.
- Grille : `lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[22.5rem_minmax(0,1fr)] xl:gap-8` : menu 320 (1024) / 360 (1280, 1920), gouttière 24 / 32, corps 632 / 824. Remplace la grille 7/5 de l'en-tête (§3 de la spec s26) et la carte « progression » à droite.
- Menu : cellule `lg:h-0 lg:min-h-full`, dedans `lg:sticky lg:top-36 lg:max-h-[calc(100dvh-10.5rem)] flex flex-col`, carte `CADRE_CARTE_NEUTRE`. En-tête fixe `p-6 pb-4` : titre du parcours TITRE_CARTE, `n sur N étapes` META_FORT (texte existant). Corps `overflow-y-auto overscroll-contain` : `ol`, une ligne par étape.
- Ligne : `relative flex min-h-11 items-center gap-3 px-6 py-2 hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5`. Numéro TEXTE_FORT gris `w-5`, titre META `[overflow-wrap:anywhere]`, à droite statut (coche `text-success h-4 w-4`, texte `Fait` existant, jamais couleur seule). Active (`aria-current="step"`) : `bg-background-elevated before:bg-text-primary` (filet blanc 2 px, arbitrage QR du 19/11), titre META_FORT. Texte fixe à x = 24 (aucun décalage à l'activation).
- Sous-étapes : sous l'étape active seulement (`ol pb-2`, `pl-14 pr-6`, lignes `min-h-11 META`, titre existant de la sous-étape). Pas de fondu nécessaire si `max-h` suffit ; sinon dégradé 24 px `from-background-card` en bas du corps.
- Pied fixe du menu : abonné, bouton plein `buttonVariants({size:"lg"})` `m-6 mt-4 w-auto` (`Reprendre` / `Commencer`, texte existant) = SEUL aplat de l'écran. Visiteur/gratuit : aucun bouton (plein = en-tête « Tout ouvrir »), lignes en liens `#etape-N`, pastille « Lecture libre » en contour neutre `rounded-xl border border-border px-2 META` (fin du vert).
- Corps (colonne droite) `flex min-w-0 flex-col gap-6` : carte d'en-tête `CADRE_CARTE_NEUTRE p-6` (H1 TITRE_PAGE, méta, argumentaire `max-w-none`, « Pour qui ? » dedans, séparés `mt-6 border-t border-border pt-6`), puis l'étape active, puis carte de fin/lettre. Les hauts du menu et de la carte d'en-tête sont à la même ordonnée (0 px). Sous 1024 : en-tête, puis menu en `details` (`SOMMAIRE_REPLIABLE min-h-11`, replié, titre existant du sommaire), puis étapes.
- Mesure de ligne, sans tiers vide : carte d'étape ouverte `CADRE_CARTE_NEUTRE p-6`, corps `grid gap-6 xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-8`. 1280 : texte 520 px (≈ 65 signes), zone droite 224 px = bloc « Format » / exercice existant `self-start` ; 1024 : une colonne, texte `max-w-none` 584 px (≈ 70 signes), zone droite dessous `mt-0`. Si la zone droite est absente : une colonne, `max-w-none` (776 px ≈ 90 signes, comme la fiche QR). Aucun `max-w-2xl` sur un paragraphe de carte ; zéro `mx-auto`. Écart de hauteur des deux zones ≤ 32 px sinon bloc droit sous le texte `[À VÉRIFIER step-blocks.tsx]`.

## 2. Ouvrir une étape sans saut (440 px mesurés)
- Dès 1024 : plus d'accordéon. Une seule étape visible (celle du menu, `?etape=n` ou état client, défaut = étape en cours / la 1re). Le contenu s'échange sur place : la carte garde son haut ; si le haut de la carte est au-dessus de 144 px à la sélection, `scrollTo` pour le caler à `top-36` (144), sinon aucun défilement.
- Sous 1024 : `details` exclusifs (attribut `name="etape"` ; une seule ouverte). Fermer la précédente (au-dessus) décalerait celle qu'on ouvre : `[overflow-anchor:none]` sur la liste, mémoriser `top = en-tête.getBoundingClientRect().top` avant `toggle`, puis après `window.scrollBy(0, nouveauTop - top)` (pas d'animation, `prefers-reduced-motion` ou pas). L'en-tête cliqué reste sous le doigt, écart ≤ 2 px. Étape fermée : le titre ne perd pas son soulignement actif ; titres d'étape tous sans soulignement, la seule marque d'actif = filet + META_FORT (un seul traitement).
- Ancres `#etape-N` : `scroll-mt-[var(--entete-colle)]` (variable existante `[À VÉRIFIER]`, 137 px à 1280) ; l'ouverture suit le hash à l'arrivée et au `hashchange`.

## 3. Liens des sous-étapes (5 « Voir » identiques)
La ligne de sous-étape entière devient le lien (`min-h-11`), texte = `numéro + titre existant de la sous-étape` (ex. « 3.1 » + son titre), META underline `underline-offset-2` ; le « Voir » visible disparaît (non remplacé par du texte : chevron `text-text-secondary` seul à droite). Nom accessible = le titre (WCAG 2.4.4). Si un titre manque ou est dupliqué : `[TEXTE À VALIDER]`. La sous-étape suivante à faire : filet blanc 2 px + titre META_FORT (pas de plein ; le plein reste celui du menu) ; faite : coche + titre gris. Libellé « Suivante » : `[TEXTE À VALIDER]`, non utilisé tant que non validé.

## 4. /parcours : carte « Étape en cours »
Même carte `CADRE_CARTE_NEUTRE p-6`, trois rangées sur la MÊME grille `grid gap-x-6 lg:grid-cols-12` (gauche `lg:col-span-9 min-w-0`, droite `lg:col-span-3 justify-self-end`), bords gauche = x du titre, droit = x du bouton :
1. Gauche : ETIQUETTE, titre du parcours TITRE_CARTE `mt-2`, titre d'étape TEXTE_FORT `mt-2`. Droite `self-center` : bouton plein `min-h-12` (seul aplat). « Étape n sur N » quitte cette rangée.
2. `mt-4` : gauche = barre segmentée ; droite `self-center` « Étape n sur N » META `tabular-nums` (texte existant), alignée à droite sur le bord du bouton.
3. `mt-6 border-t border-border pt-6 lg:col-span-12` : `TonCap enLigne` (inchangé), calé sur x gauche de la carte ; absente chez le nouvel abonné (barre et Ton cap restent comme en s26).
Barre segmentée `grid auto-cols-fr grid-flow-col gap-1` (un segment par étape, `h-2 rounded-full`) : faite `bg-text-primary`, en cours `border border-text-primary bg-transparent`, à venir `bg-border` ; jamais violet. `role="progressbar"` `aria-valuenow` = étapes faites, `aria-valuemax` = N, `aria-valuetext` = texte « Étape n sur N » existant. « Étape 3 sur 3 » = 2 pleins + 1 cerné : plus de contradiction. Même composant sur les cartes de parcours (piste 4) ; sans entamé : tous « à venir ».

## 5. Annonce « Nouveau cap »
`CADRE_CARTE_NEUTRE flex flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:justify-between mb-6` (même bord que les autres cartes, plus de `border-border-input`). Texte META_FORT `min-w-0` ; « Fermer » en lien `min-h-11 shrink-0 META_FORT underline underline-offset-2 px-2`. Dès 768 : une ligne (texte à gauche, Fermer à droite, centrés verticalement) ; 375 : texte puis Fermer à gauche `-ml-2`. Hauteur 1280 : 20 + 32 = 72 (`py-4`, cible 44). Aucun aplat.

## 6. Visiteur et gratuit, mobile (< 768)
- « Tester l'étape 1 » (bouton existant de la carte) remonté sous le H1 : `max-md:order-2 w-full min-h-12` en CONTOUR (`BOUTON_SECONDAIRE`, « Tout ouvrir » de l'en-tête reste le seul plein), puis le chapô `max-md:order-3 mt-4`. Cible : bas du bouton ≤ 700 px à 375x812 `[ESTIMÉ]` (en-tête 89 + H1 ≈ 100 + mb-8 + bouton 48). `[À VÉRIFIER @fullstack : composant et DOM du bouton]`.
- Lien = `/parcours/[slug]#etape-1`. À l'arrivée, `details#etape-1` `open` (visiteur et gratuit, toutes largeurs, ≥ 1024 : étape 1 active dans le menu), `scroll-mt` de §2, étape 1 visible sans clic de plus.

## 7. Cartes de la liste des parcours (rythme)
Piste 1 : méta `flex flex-wrap gap-x-4 gap-y-0 min-h-6 META` avec chaque item `whitespace-nowrap` (« 325 XP à gagner » ne s'orpheline plus ; le retour à la ligne se fait entre items) ; titre `mt-2` (méta-titre = 8) ; description `mt-2` (titre-texte = 8, plus de 0) ; témoignage `mt-4` ; barre `mt-4` ; pied `mt-6`. Les autres classes de §2.4 de la spec s26 sont inchangées (sous-grille, pistes).

## 8. Table d'acceptation (px, tolérance ±2) `[ESTIMÉ]`
| # | Mesure | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|---|
| 1 | Menu : largeur / gouttière / corps | n.a. (details) | n.a. | 320 / 24 / 632 | 360 / 32 / 824 | 360 / 32 / 824 |
| 2 | Haut menu moins haut carte d'en-tête | n.a. | n.a. | 0 | 0 | 0 |
| 3 | Haut collé du menu | n.a. | n.a. | 144 | 144 | 144 |
| 4 | Dernière ligne du menu atteignable | n.a. | n.a. | oui | oui | oui |
| 5 | Largeur du texte d'étape / vide à droite dans la carte | 295 / 0 | 672 / 0 | 584 / 0 | 520 / 0 (zone 224) | idem 1280 |
| 6 | Saut de l'en-tête cliqué à l'ouverture d'une étape | ≤ 2 | ≤ 2 | 0 (carte calée) | 0 | 0 |
| 7 | Étapes ouvertes simultanément | 1 | 1 | 1 | 1 | 1 |
| 8 | Lien « Retour Parcours » : y du bas / ordre DOM | ≤ 56 / avant H1 | idem | fil haut | fil haut | fil haut |
| 9 | Liens de sous-étape : intitulés distincts | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 |
| 10 | Segments de barre = N ; segment en cours distinct | oui | oui | oui | oui | oui |
| 11 | Carte En cours : x gauche rangées 1, 2, 3 / x droit bouton = x droit « Étape n sur N » | 0 / n.a. | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| 12 | Annonce : une ligne texte + Fermer ; bords = autres cartes | non / 0 | oui / 0 | oui / 0 | oui / 0 | oui / 0 |
| 13 | Bas du bouton « Tester l'étape 1 » (visiteur, gratuit) | ≤ 700 | n.a. | n.a. | n.a. | n.a. |
| 14 | `#etape-1` ouvert à l'arrivée (visiteur, gratuit) | oui | oui | oui | oui | oui |
| 15 | Carte de parcours : méta-titre / titre-texte | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 |
| 16 | Aplats `bg-accent*` pleins par écran, en-tête compris | 1 | 1 | 1 | 1 | 1 |
| 17 | Vide interne visible > 32 | 0 | 0 | 0 | 0 | 0 |
| 18 | Cibles | >= 44 | >= 44 | >= 44 | >= 44 | >= 44 |
Comptes : 4 x 5 largeurs ; lignes 1 à 9 sur le détail, 10 à 12 et 15 sur /parcours (abonné), 13 et 14 visiteur et gratuit.

## 9. Handoff
-> @fullstack : menu sticky et grille de `parcours-detail.tsx`, étape unique (desktop) et `details name` + compensation de défilement (mobile), lignes de sous-étape en liens titrés, barre segmentée (carte En cours et cartes de liste), annonce, remontée du bouton visiteur, rythme de piste 1 ; rendu fermé identique (`git show`).
-> @qa : table §8, captures 5 largeurs x 4 comptes, diff réel (P0 s11). -> Thomas : libellé « Suivante » `[TEXTE À VALIDER]` ; filet blanc de l'étape active (cohérent QR).

## Vérification de l'orchestrateur (19/11)

Décisions de Thomas du 14 au 19/11 relues contre cette v2 : « Tester l'étape 1 de {Parcours}, gratuite » gardé et en CONTOUR (16/11 et 19/11) : respecté ; méta des cartes sans « · » : respecté (items en `whitespace-nowrap`, pas de séparateur) ; pastilles de « Ton cap » neutres : la barre segmentée est neutre aussi (jamais violette) ; un seul aplat violet par écran, en-tête compris : respecté. Aucune contradiction.
