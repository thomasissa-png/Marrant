# Pilote liste + détail de Quoi répondre : spec design (s26, 19/11/2026)

Pour @fullstack, après `docs/ux/liste-detail-quoi-repondre-s26.md` (comportement : fait foi) et `typo-harmonie-espace-s25.md`. Valable espace ouvert seulement : `ESPACE_CLIENT_PUBLIE=false` garde la 404 en premier, rendu fermé inchangé. Échelle `typo.ts` seule (14/16/20/24-30, 400/600, 0 capitale, rythme 8 px, `rounded-xl`, bordures 1 px, 0 ombre). Aucun texte neuf : tout libellé nouveau = `[TEXTE À VALIDER]`. Mesures marquées `[ESTIMÉ]` : lues dans le code, non chronométrées (aucun navigateur dans cette session), à confirmer par @qa.

## 1. Géométrie (abonnés, dès 1024)
Coque lue dans `layout/gabarit.ts` : `max-w-7xl px-4 md:px-6 xl:px-8`, donc contenu 343 (375), 720 (768), 976 (1024), 1216 (1280 et 1920). **Tranche pour 1920 : la coque ne s'élargit pas.** Même géométrie qu'à 1280, 320 px de marge de chaque côté (identique au reste du site et à l'en-tête de 121 px). La fiche en 8/4 dès 1536 de la spec UX est abandonnée : à 1920 rien ne la rend nécessaire.
| Largeur | Mode | Liste | Gouttière | Panneau | Classes (grille) |
|---|---|---|---|---|---|
| 375 | liste OU fiche | 343 | - | 343 | `grid-cols-1` |
| 768 | liste OU fiche | 720 (2 col. de lignes, `gap-x-6`) | - | 720 | `md:grid-cols-2` sur la seule liste |
| 1024 à 1279 | liste + fiche | 320 | 24 (`gap-6`) | 632 à 887 | `lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-6` |
| 1280 et 1920 | liste + fiche | 360 | 32 (`gap-8`) | 824 | `xl:grid-cols-[22.5rem_minmax(0,1fr)] xl:gap-8` |
- Conteneur : `pt-8 pb-16` (comme les autres rubriques). Dès 1024, plus de H1 de page séparé : « Quoi répondre » (`T.titre`) devient le titre de la carte de liste, en `TITRE_CARTE`, et l'H1 de la page est celui de la fiche. Sous 1024, le H1 `TITRE_PAGE` actuel reste (page liste).
- **Liste collante** : cellule `lg:h-0 lg:min-h-full` (elle ne compte pas dans la hauteur de rangée), à l'intérieur `lg:sticky lg:top-36 lg:max-h-[calc(100dvh-10.5rem)]` : haut 144 px (`top-36` : 121 + 23 de respiration), bas à 24 px de l'écran. Défilement interne : `overflow-y-auto overscroll-contain` sur le corps des lieux (l'en-tête de carte et le pied « carnet » restent fixes). Dernière ligne atteignable (critère 10 UX).
- **Bords** : liste et fiche commencent à la même ordonnée (grille, aucun `mt` d'un côté seul). Les deux sont des cartes `CADRE_CARTE_NEUTRE` (bordure 1 px) : haut des bordures identique au pixel. Lignes de base : titre de liste (20/28) et H1 de fiche (30/36) dans leur carte en `p-6` ; la liste ajoute `pt-2` à son titre pour rattraper l'écart de demi-interligne (8 px `[ESTIMÉ]`, tolérance 2 px, à mesurer sur `Range.getBoundingClientRect` des deux textes).

## 2. Ligne de liste (colonne unique, `<ul>` par lieu)
- Carte de liste : `rounded-xl border border-border bg-background-card` ; titre `TITRE_CARTE p-6 pt-8 pb-4` (ou `px-6 pt-8 pb-4`). Filtres : un `<details>` replié `SOMMAIRE_REPLIABLE` (`min-h-11`, libellé `filtrerLesCartes`) sous le titre, `FiltresSituations` existant dedans. Pied : lien « carnet » `META underline underline-offset-2 inline-flex min-h-11 items-center px-6`, `border-t border-border`.
- Titre de lieu : `ETIQUETTE` à gauche, `CompteFaits` à droite, `flex items-baseline justify-between px-6 pt-4 pb-2`. Pas de `BarreProgression` dans la liste (trop de blocs en 360 px ; la barre reste en mode page).
- Ligne : `relative flex min-h-11 items-center gap-3 px-6 py-2 hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5`. Titre `META text-text-primary` (14/20, `[overflow-wrap:anywhere]`, 2 lignes admises), à droite durée `META tabular-nums flex-none` (existant `T.minutes`).
- **Active** (`aria-current="page"`) : `bg-background-elevated before:bg-accent-primary`, titre en `META_FORT` (14/600). Le filet est un pseudo-élément (aucun décalage de texte : le texte reste à x = 24). Violet = repère fonctionnel de 2 px, pas un aplat.
- **Prochaine** : le filet blanc `FILET_PROCHAINE` n'est PAS repris dans la liste (il se confondrait avec l'actif). La prochaine action se lit par le panneau ouvert d'office et par son rang. Sous 1024 la tuile « Voir » existante la porte toujours.
- **Fait** : coche `text-success h-4 w-4` + `T.fait` en `META` à la place de la durée ; titre en `text-text-secondary` (la coque grise suffit, jamais la couleur seule). Fait ET actif : titre `META_FORT`, coche conservée.
- Survol `bg-background-elevated` ; focus bague inset (le conteneur défile, une bague externe serait rognée) ; clavier flèches selon spec UX.

## 3. Fiche dans le panneau
Colonne `flex min-w-0 flex-col gap-6` (24 px entre blocs, jamais plus). Aucun `max-w` : à 824 px la carte occupe tout le panneau, donc aucun blanc à droite à 1280 ni 1920 ; lignes de 776 px utiles, soit environ 90 signes `[ESTIMÉ]`, sous 100.
1. **Carte A** `CADRE_CARTE_NEUTRE p-6` : H1 `TITRE_PAGE` (24/32 sous 1024, 30/36 dès 1024, 600 ; retirer `text-3xl font-bold md:text-4xl max-e300:text-2xl`, garder `[overflow-wrap:anywhere]`). Dessous `mt-2 META` (type · durée), `mt-4 TEXTE` accroche si présente, puis le corps après `mt-6 border-t border-border pt-6`. Blocs internes du corps : `space-y-6` (24), séparateurs `border-t border-border`, titres de bloc `ETIQUETTE`/`TEXTE_FORT`, jamais `font-bold`.
2. **Carte B** (geste : « À toi », « Ma réplique à moi ») `CADRE_CARTE_NEUTRE p-6`. Seul aplat de l'écran : son bouton principal (`buttonVariants({ size: "lg" })`).
3. **Liens catalogue** : `flex flex-wrap gap-x-6` `META underline underline-offset-2 min-h-11`, sans carte ; collés au gap de 24.
4. **« Situation suivante »** (`[TEXTE À VALIDER]`, repli `L.voir` + titre) : dernier élément du panneau, `BOUTON_SECONDAIRE min-h-12 w-full sm:w-auto` en contour. Après « Fait » le geste perd son aplat : « Situation suivante » passe alors en plein (`buttonVariants({ size: "lg" })`) pour qu'il reste exactement 1 aplat. Rien sous lui : le panneau finit sur ce bouton, `pb-16` de page seulement.
- Vides : le pied de A et B finit sur son dernier élément + `p-6` (24). Aucun `min-h` ni `h-full` sur une carte. Squelette `loading.tsx` : mêmes cartes, mêmes `p-6`, hauteurs de A (H1 + 3 lignes) et B.
- Panneau d'office (sans id) : même rendu, même H1 ; aucune bannière ni étiquette ajoutée.

## 4. Quatre états
| État | 375 / 768 | dès 1024 |
|---|---|---|
| Visiteur, gratuit | aperçu verrouillé (spec UX §1) | idem ; seule différence : bouton de la carte d'offre |
| Nouvel abonné (0 fait) | page liste : tuile « Voir » (plein), filtres repliés, lieux `0/n`, rangs normaux ; fiche plein écran | liste (aucune coche), panneau = 1re situation, sa ligne active |
| Abonné avancé | idem, compteurs `n/total`, lignes faites en gris + coche | panneau = 1re sans « Fait » (sinon 1re du filtre) ; actif visible dans la liste (`scrollIntoView nearest`) |
Humour noir exclu (cookie), filtre vide : tuile `vide` + `raconte` (`CADRE_CARTE_NEUTRE p-6`) dans les deux colonnes sans carte de liste vide.

## 5. Hero de l'aperçu sans « 1 500+ » (visiteur, gratuit ; `hero-apercu.tsx`, `offre-apercu.tsx`)
Retirer `<Preuve place="hero" />` et le `Preuve` de la carte (le composant reste pour l'accueil et /abonnement). La colonne de texte perd 44 px (24 + 20) ; la carte d'offre gagne le surplus étiré. Rééquilibrage, sans texte, sans visuel, au pas de 8 px, dans l'ordre :
1. 1024 à 1919 : retirer `etiree` (`lg:h-full`) : carte à hauteur naturelle, plus d'air ajouté sous « Connexion ». `items-start` sur la grille du hero.
2. Resserrer la carte : zone « Connexion » `pt-6` -> `pt-4` et `Reassurance` `md:mt-4` -> `md:mt-2` (-16 px). Padding `p-6` conservé (l'objet Premium reste au niveau de l'accueil).
3. Étoffer la colonne de texte par le rythme seulement : promesse `mt-4` -> `lg:mt-6` (+8), pastilles `md:mt-6` -> `lg:mt-8` (+8), badge -> H1 inchangé.
Cible : bas du texte (dernier rang de pastilles) et bas de la carte à <= 32 px à 1024, 1280, 1920 ; `[ESTIMÉ]` texte 1280 ~ 172 + 16 = 188 contre carte ~ 200 : écart ~ 12 px. Si un écart > 32 reste mesuré : repasser la pastille « Premium » et le H1 sur `gap` +8 (+8), jamais de `justify-between` (vide au milieu). 768 : carte sous le texte (E2), seul le bas du texte monte de 44 px, sans vide. 375 : la preuve de hero sortait déjà du premier écran ; la première tuile remonte de 44 px, aucune autre retouche.

## 6. Un seul aplat violet par écran
- **Visiteur, gratuit** : le bouton de la carte d'offre du hero (`BOUTON_OFFRE`). L'en-tête reste sans bouton d'offre : `offre-en-haut.ts` le masque déjà par adresse (`/mon-espace/quoi-repondre` y est), décision de Thomas du 16/11 (« un seul bouton de paiement en haut »). **Je ne suis pas la reco UX d'un bouton d'en-tête en contour** : ce `[CHOIX UTILISATEUR]` prime, et elle exigerait un observateur JS. Fin d'extrait : `BOUTON_OFFRE_FIN` (contour dès 960 de haut, plein en dessous : un seul plein visible, la carte du haut étant alors sortie ; à vérifier à 1280x900 et 375x812).
- **Abonné** : en-tête sans bouton d'offre ; la liste, ses lignes, les filtres : 0 aplat ; la fiche : « À toi »/« Fait » plein, « Situation suivante » en contour (plein après « Fait »). Sous 1024 en page liste : « Voir » est l'unique plein ; fiche plein écran : le geste.

## 7. Mobile (< 1024)
- Liste : page actuelle (tuile « Voir » prochaine action, filtres repliés `min-h-11`, un bloc par lieu `p-6 gap-6`, lignes 1 colonne à 375 et `md:grid-cols-2 md:gap-x-6` à 768, `min-h-14` existants). Liste masquée quand `[id]` est actif.
- Fiche plein écran : barre de retour `LienRetour` au-dessus, `flex min-h-11 items-center mb-4`, alignée sur le bord gauche de la carte A (x = 16 à 375, 24 dès 768), même place que sur les autres fiches ; puis les cartes A, B, liens, « Situation suivante » en `w-full`. Cartes en `p-6` partout (rythme 8 px), H1 24/32.
- Pas de bottom sheet ici (pas de modale). `pb-[env(safe-area-inset-bottom)]` sur le conteneur de page.

## 8. Table d'acceptation (px, 375x812, 768x1024, 1024x768, 1280x900, 1920x1080)
| # | Mesure | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|---|
| 1 | Largeur liste | pleine 343 | pleine 720 | 320 | 360 | 360 |
| 2 | Gouttière liste/fiche | - | - | 24 | 32 | 32 |
| 3 | Largeur panneau | 343 | 720 | 632 | 824 | 824 |
| 4 | Haut liste = haut fiche (écart) | - | - | 0 | 0 | 0 |
| 5 | Haut collé de la liste | - | - | 144 | 144 | 144 |
| 6 | Hauteur max liste (`100dvh - 168`) | - | - | 600 | 732 | 912 |
| 7 | Écart de lignes de base titre liste / H1 | - | - | <= 2 | <= 2 | <= 2 |
| 8 | Blanc à droite du panneau (bord carte -> bord coque) | 0 | 0 | 0 | 0 | 0 |
| 9 | Vide entre deux blocs de fiche | 24 | 24 | 24 | 24 | 24 |
| 10 | Vide de fin de carte (dernier enfant -> bord) | <= 24 | <= 24 | <= 24 | <= 24 | <= 24 |
| 11 | Bas du texte hero / bas carte d'offre (aperçu) | - | <= 32 | <= 32 | <= 32 | <= 32 |
| 12 | Cible ligne, retour, suivante | >= 44 | >= 44 | >= 44 | >= 44 | >= 44 |
| 13 | Aplats `bg-accent*` pleins par écran | 1 | 1 | 1 | 1 | 1 |
| 14 | Tailles distinctes / graisses | <= 4 / 2 | idem | idem | idem | idem |
| 15 | Décalage du texte de ligne à l'activation | - | - | 0 | 0 | 0 |
Comptes : visiteur, gratuit (lignes 11, 13), nouvel abonné, abonné avancé (lignes 1 à 10, 12 à 15). Ligne 10 : fiche la plus courte du catalogue incluse ; si la liste dépasse le panneau de plus de 32 px sur une fiche courte, signaler (aucun `min-h` ne doit le masquer).

## 9. Handoff -> @fullstack, puis @qa
Fichiers : `quoi-repondre/layout.tsx` (grille §1, liste §2), `quoi-repondre/[id]/page.tsx` + `loading.tsx`, `fiche.tsx` (H1, cartes A/B, pied §3), `liste-fiches.tsx` (variante liste de panneau, sans toucher le rendu fermé), `hero-apercu.tsx` + `offre-apercu.tsx` (§5). Points d'attention : sticky avec `h-0 min-h-full` à valider au navigateur (repli : `lg:self-start` + `max-h`), mesures §8 à produire par @qa avec captures 5 largeurs x 4 comptes, rapport de diff réel (P0 s11), 0 tiret cadratin. `[À VALIDER THOMAS]` : « Situation suivante », filet violet de la ligne active, plein de « Situation suivante » après « Fait ».

## Arbitrage de l'orchestrateur (19/11)

- Ligne active : filet de 2 px **blanc** (`text-primary`), pas violet. Thomas a retiré le filet violet des cartes de rubrique le 18/11 (`CADRE_CARTE_RUBRIQUE` neutre) ; la couleur violette reste réservée à l'offre et aux actions. Le filet blanc « prochaine » n'existant pas dans la liste de panneau, il n'y a pas de confusion.
- « Situation suivante » : libellé posé dans `config/textes/` marqué `À VALIDER (s26)`, soumis à Thomas avec les captures du pilote (interrupteur à false : rien de visible en production).
- « Situation suivante » en plein après « Fait » : retenu (un seul aplat à l'écran).
