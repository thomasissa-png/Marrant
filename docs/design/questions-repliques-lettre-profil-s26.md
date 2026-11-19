# Mes questions, Mes répliques, La lettre, Profil s26 (spec @design pour @fullstack)

Structure : `docs/ux/questions-repliques-lettre-profil-s26.md` (fait foi). Traitement : `typo-harmonie-espace-s25.md`. Langage : `rubriques-abonne-s26.md` et `favoris-carnet-s26.md`. Espace ouvert seulement (`ESPACE_CLIENT_PUBLIE`), HTML fermé inchangé (test d'inertie). Aucun texte neuf : emplacements `PROMESSE_QUESTIONS`, `PROMESSE_REPLIQUES`, `LIEN_AUTRE_REPLIQUE`.

## 0. Décisions communes
- Titre : `<header className="pt-8">`, `TITRE_PAGE` blanc, à gauche, sans dégradé ; sous-titre éventuel `TEXTE mt-2 max-w-xl`. Grille `mt-8`, bas `pb-16`, `gap-6`, `p-6`, blocs `mt-12`. Plus de `EN_TETE_CENTRE` ni de `text-center` sur ces pages.
- Grille de page : `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start`. Cadres : `CADRE_CARTE_NEUTRE p-6` ; prochaine action : `CARTE_ACTION`. Rails : `lg:sticky lg:top-24 lg:self-start` (`top-24` à vérifier, comme Quoi répondre).
- Seul aplat violet : `buttonVariants({ size: "lg" })`, un par écran. Autres boutons `BOUTON_SECONDAIRE` (contour). Liens secondaires : `META underline underline-offset-2 inline-flex min-h-11 items-center` (jamais `text-accent-link`).
- Élément actif : filet BLANC 2 px (`border-l-2 border-text-primary` + `bg-background-elevated`), inactif `border-transparent`.
- Compteur : `META tabular-nums` (chiffres seuls) à droite du titre : `flex items-baseline justify-between gap-4`. Barres : `BarreProgression` neutre. Verrou : SVG de l'espace `h-4 w-4 text-text-secondary`. Aucun émoji.
- Interdits (s25 §2.4) : `text-xs`, `font-bold|medium`, `uppercase`, `tracking-*`, `leading-*`, `rounded-2xl|md`, `shadow-*`, `border-2`, `text-text-muted`, marges 1 1.5 2.5 3 5 10 14 20.

## 1. Mes questions, aperçu (visiteur, gratuit) : `ApercuVerrouille rubrique="mesQuestions"`
Pas de style neuf. Hero 8/4 (`HeroApercu`, `PROMESSE_QUESTIONS`, offre en haut via `offre-en-haut.ts`), puis `mt-12` et UNE grille `lg:grid-cols-12`.
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Tuile « Mes envois » EN CLAIR (`Q.envois.titre` `TITRE_CARTE`, un exemple de message par type `TEXTE mt-2`, délai de réponse `META mt-4`) | `col-span-1` | `col-span-1` (3/2 avec historique) | `lg:col-span-7` |
| Tuile « Ton historique » fermée (3 lignes verrou + barres `h-2 rounded-full bg-border-hover`, pastilles inertes envoyé / répondu en `META`, `opacity-75`) | `col-span-1` | `col-span-1` | `lg:col-span-5` |
| Rangée 2 sous le fondu : tuile fermée « fil d'une réponse » (barres seules) | `col-span-1` | `md:col-span-2` | `lg:col-span-12` |
375 : 2 exemples avant y = 760. Aucune question ni réponse d'abonné dans le HTML.

## 2. Mes questions, abonné
Header `pt-8` : `TITRE_PAGE` à gauche. Compteur `répondues / envoyées` en `META tabular-nums` au titre de la zone historique.
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Formulaire d'envoi | `col-span-1`, premier | `md:col-span-2`, replié (« Continuer » existant) | `lg:col-span-4 lg:row-span-2` sticky |
| Réponse non lue (tuile de tête) | `col-span-1`, avant l'historique | `md:col-span-2` | `lg:col-span-8` |
| Historique (fils par statut) | 1 col | `md:col-span-2`, 2 col | `lg:col-span-8`, lignes 1 col |
- Tuile réponse non lue : `CARTE_ACTION`, type `ETIQUETTE`, première ligne de la réponse `TEXTE mt-2 line-clamp-2`, bouton « Lire » existant `buttonVariants({ size: "lg" }) mt-4 w-full md:w-auto` = seul aplat. Sans réponse non lue : pas de tuile, le bouton d'envoi du formulaire devient l'aplat.
- Formulaire : `CADRE_CARTE_NEUTRE p-6 flex flex-col gap-4` ; type (pastilles `min-h-11 rounded-full border border-border-input px-4`, choisie `border-text-primary bg-background-elevated META_FORT`), `textarea` `min-h-32 rounded-xl border border-border-input bg-background-elevated p-4 TEXTE`, bouton d'envoi `buttonVariants({ size: "lg" }) w-full` ; texte conservé si échec.
- Ligne d'historique : `CADRE_CARTE_NEUTRE p-6`, type `ETIQUETTE`, première ligne `TEXTE mt-2 line-clamp-2`, statut `META mt-2` ; `hover:border-border-hover`, cible 44 px minimum.
- Vide (nouvel abonné) : `EtatVideQuestions` dans `CADRE_CARTE_NEUTRE p-6 lg:col-span-8`, aucun second aplat.

## 3. Fil (`/mon-espace/questions/[id]`)
Grille 12. Fil : `col-span-1 md:col-span-2 lg:col-span-8 min-w-0`, colonne de lecture 600 à 760 px, messages `CADRE_CARTE_NEUTRE p-6`, `gap-6`, texte `TEXTE`, auteur et date `META`, `[overflow-wrap:anywhere]`. Rail : `lg:col-span-4` sticky, `CADRE_CARTE_NEUTRE p-6` : retour à Mes questions (lien `META`), autres fils (lignes `min-h-11`, titre `TEXTE`, statut `META`, fil courant `border-l-2 border-text-primary TEXTE_FORT`), puis `mt-6 border-t border-border pt-6` « Retirer de mon historique » existant en `BOUTON_SECONDAIRE`. 375/768 : retour en haut, fil, rail dessous. Aucun aplat. 404 inchangé.

## 4. Mes répliques, aperçu : `ApercuVerrouille rubrique="mesRepliques"`
Hero 8/4 (`PROMESSE_REPLIQUES`), `mt-12`, grille 12 : tuile EN CLAIR de la fiche désignée `lg:col-span-7` (titre `TITRE_CARTE`, durée `META mt-2`, consigne « À toi » `G.aToi` `TEXTE mt-4`, champ « Ma réplique à moi » `G.note.label` en `textarea` inerte `aria-hidden`, 0 focusable) ; tuile fermée « Tes répliques » `lg:col-span-5` (3 lignes verrou + barres) ; rangée 2 tuile fermée « modifier / supprimer » `md:col-span-2 lg:col-span-12`. 375 et 768 : `col-span-1`, ordre du DOM.

## 5. Mes répliques, abonné
Header : `flex flex-wrap items-baseline justify-between gap-4` : `TITRE_PAGE` à gauche, compteur `META tabular-nums` à droite. Avec répliques : `LIEN_AUTRE_REPLIQUE` en lien `META` neutre dans l'en-tête, aucun aplat.
- Liste : `mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`, la plus récente d'abord (4/4/4 en 1280, 2 col en 768, 1 col en 375). Carte `CADRE_CARTE_NEUTRE p-6 flex h-full flex-col` : titre de fiche (lien) `TITRE_CARTE`, réplique `TEXTE mt-2`, `mt-auto border-t border-border pt-4` « Modifier » et « Supprimer » en `META underline min-h-11`, `flex gap-6`. Suppression en échec : la carte reste.
- Vide : tuile `CARTE_ACTION lg:col-span-8` (dans la grille 12) : texte existant `TEXTE`, bouton « Écrire ma première réplique » `buttonVariants({ size: "lg" }) mt-4 w-full md:w-auto` = seul aplat ; à droite `lg:col-span-4` `CADRE_CARTE_NEUTRE p-6` avec le lien existant vers Quoi répondre (`META` neutre). 375/768 : empilées.

## 6. La lettre : `/lettre` (SEO intact : metadata, H1, textes, 308, `?statut=`)
Conteneur : coque, plus de `mx-auto max-w-3xl space-y-8 py-10` : `pt-8 pb-16`, grille 12 `gap-6`. Bandeaux `LettreStatut` : `col-span-full`, texte `META`, lien `META underline` neutre (retirer `text-accent-link`, `text-xs`, `text-text-muted`). Confirmée et désinscrit : statut seul, `lg:col-span-8`, sans colonne droite.
### 6.1 Visiteur, gratuit, ancien abonné
| Bloc | 375 | 768 | 1280 |
|---|---|---|---|
| Inscription `LettrePageInscription` | `col-span-1`, premier, bouton avant y = 700 | `md:col-span-2` | `lg:col-span-7`, bouton y < 450 |
| Dernier numéro (`section`, H2 `lettre-dernier` en `TITRE_CARTE`, plus de `uppercase tracking-wider`) | dessous | `md:col-span-2` dessous | `lg:col-span-5 lg:sticky lg:top-24` |
- Inscription : `CADRE_CARTE_NEUTRE p-6`, champ e-mail `min-h-12 rounded-xl border border-border-input bg-background-elevated px-4 TEXTE`, case de consentement `META` avec cible 44 px, bouton `buttonVariants({ size: "lg" }) w-full md:w-auto` = seul aplat.
- Dernier numéro : `CADRE_CARTE_NEUTRE p-6` (plus de `Card filet`, plus de `p-5 sm:p-6`) ; objet `TEXTE_FORT`, corps `LettreCorpsApercu` en `TEXTE mt-4 min-w-0 [overflow-wrap:anywhere] whitespace-pre-line`. Aucun numéro : colonne droite absente, inscription `lg:col-span-12` sans vide. Erreurs avec le formulaire, inchangées.
### 6.2 Abonné actif : archive
Header `TITRE_PAGE` (« La lettre ») à gauche + compteur « n lettres » `META tabular-nums`. Dernière lettre : `CARTE_ACTION col-span-full`, titre `TITRE_CARTE`, objet `TEXTE mt-2`, bouton « Lire » existant `buttonVariants({ size: "lg" }) mt-4` = seul aplat. Précédentes : `mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`, `CADRE_CARTE_NEUTRE p-6 hover:border-border-hover` (numéro `META`, titre `TEXTE_FORT mt-2`, objet `META mt-2`, `min-h-11`). Nouvel abonné : `ArchiveLettres` vide `lg:col-span-8` + rail `lg:col-span-4` (lien vers Aujourd'hui `META`), aucun aplat.
### 6.3 Une lettre (`/mon-espace/lettres/[numero]`)
Corps `col-span-1 md:col-span-2 lg:col-span-8 min-w-0`, colonne de lecture 600 à 760 px, `CADRE_CARTE_NEUTRE p-6`, texte `TEXTE`, `[overflow-wrap:anywhere]`, liens sans `utm_*`. Rail `lg:col-span-4` sticky `CADRE_CARTE_NEUTRE p-6` : « La lettre » (retour), précédente et suivante (titres `TEXTE_FORT`, `min-h-11`, `border-t border-border` entre elles). 768 : rail dessous ; 375 : retour en haut, précédente et suivante en bas. Aucun aplat. 404 inchangé.

## 7. Profil (`/profil`)
Header : `pt-8`, `TITRE_PAGE` « Mon profil » et sous-titre `TEXTE mt-2 max-w-xl` à gauche (plus de `text-center`, `text-3xl font-bold md:text-4xl`). Grille `mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start`.
| Bloc | 375 (ordre) | 768 | 1280 |
|---|---|---|---|
| Colonne principale : Reprendre le parcours (`CARTE_ACTION`), cap et progression `CapProfil`, Mes parcours | 1, 3 | 1 col pleine largeur | `lg:col-span-8` |
| Colonne latérale : Abonnement, Ton prénom, rappel du parcours, lettre hebdomadaire, Ta question | 2, 4 | cartes courtes `md:grid-cols-2` | `lg:col-span-4`, 1 col `gap-6` |
| Supprimer mon compte | 5 | `col-span-full` | `lg:col-span-12`, `mt-12 border-t border-border pt-6`, `BOUTON_SECONDAIRE` discret |
- Ordre du DOM : prochaine action, abonnement, progression, réglages, suppression. Cartes `CADRE_CARTE_NEUTRE p-6`, titres `TITRE_CARTE`, valeurs `TEXTE`, aides `META`. Cap : `TITRE_CARTE tabular-nums` ; barre `BarreProgression mt-4` ; `StreakCounter` en `META`.
- Aplat : abonné = « Reprendre le parcours » ; gratuit = bouton d'offre en tête de la colonne latérale ; ancien abonné : lecture seule, aucun aplat. Ancres `#abonnement` et `#rappel-parcours` conservées (`scroll-mt-24`).
- Carte « Connecte-toi pour voir ton profil » : `CADRE_CARTE_NEUTRE p-6 lg:col-span-8`, verrou SVG `h-6 w-6 text-text-secondary` à la place du 🔒 (ouvert seulement ; fermé : HTML inchangé), texte `TEXTE_FORT`, bouton existant en `buttonVariants({ size: "lg" })` = seul aplat. Vide « série à zéro » : texte validé en `META`.

## 8. Critères mesurables (375x812, 1280x900 ; visiteur, gratuit, abonné avancé, nouvel abonné)
1. Premier écran : <= 4 tailles {14, 16, 20, 24 ou 30}, <= 6 combinaisons, graisses {400, 600}, `textTransform: none`.
2. Un seul fond violet opaque ; aucun texte, bord ou fond violet hors ce bouton, `CARTE_ACTION` et le focus ; titres #FFFFFF.
3. 1280 : aucune colonne centrée seule ; largeur utile >= 1100 px ; Mes questions 4/8, fil 8/4, répliques 4/4/4, lettre 7/5 et 8/4, Profil 8/4 ; fil et lettre : corps de 600 à 760 px.
4. Rayons 12 px, bords 1 px, ombres aucune, `gap` 24 px, padding 24 px, aucun vide > 32 px dans un bloc.
5. Aperçus : bouton d'offre y < 450 (1280) et < 700 (375) ; bouton de fin y > 900 / > 812 ; extrait `aria-hidden`, 0 focusable ; 0 donnée d'abonné dans HTML et RSC.
6. `/lettre` : scrollWidth = fenêtre à 375, 320, 1280 ; 0 `utm_` ; metadata, H1, 308 identiques (inertie fermée).
7. Cibles >= 44 px, contrastes AA, focus visible, zéro émoji, zéro tiret cadratin, zéro texte neuf hors les 3 emplacements.
8. Diff réel mesuré (P0 s11) ; captures 375/768/1280 par compte relues par @design.

Handoff -> @fullstack : aperçus §1 et §4 (grilles, aucun style neuf), vues §2, §3, §5, §6, §7 aux classes ci-dessus, `top-24` à vérifier ; tests d'inertie fermée et de verrouillage.
Handoff -> @copywriter : `PROMESSE_QUESTIONS`, `PROMESSE_REPLIQUES`, `LIEN_AUTRE_REPLIQUE` ; -> Thomas : filet blanc (pas violet) pour l'élément actif, `/lettre` `noindex` dans le code.
Handoff -> @qa : gate §8 aux 4 comptes, snapshots à refaire, inertie fermée 47/47.
