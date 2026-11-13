# Harmonie de la préversion Premium s24 (audit visuel)

> @design, 13/11/2026. Sources : `docs/captures/s24-preversion/` + `INDEX.md`, étalon `etalon-e5-s24.md`, code `apps/web/src/components/espace/**`, `(dashboard)/layout.tsx`, `app/not-found.tsx`.
> **Couverture réelle** : lues image par image : 01 à 04 (en cours, 375 et 1280), 05 (2 comptes, 2 largeurs), 06 (en cours, 2 largeurs), 12 (1280), 14 (375), 16 (375), 24 (1280), 26 (375), 27 (1280), 28 (375), 29 (1280), 30 (375). **Non relues individuellement** : le reste des 118 (07 à 11, 13, 15, 17 à 23, 25, doublons « nouvel »). Pour celles-ci je m'appuie sur INDEX.md (anomalies déjà listées) : à confirmer par une relecture avant le go. Les 10 critères Thomas ne sont pas scorés page par page.

## Verdict global

**Pas de go en l'état, mais proche : 3 bloquants, tous des corrections de classes CSS.** Le socle est cohérent (mêmes cartes `rounded-xl` fond surface, même violet, mêmes boutons pleins/contour, mêmes puces, menus propres, aucun débordement). Ce qui casse l'harmonie : (1) trois mises en page à 1280 px, (2) l'onglet actif coupé à 375 px, (3) le titre doublé. Le reste est de la finition.

## Défauts classés

| # | Gravité | Capture(s) | Défaut | Correction pour @fullstack |
|---|---|---|---|---|
| 1 | Bloquant | 14, 15, 16, 17, 22, 23 (375) | Onglet actif « Bibliothèqu › » coupé sous le fondu | `espace-barre-client.tsx` : après le `scrollLeft` d'ancrage, si le bord droit de l'onglet actif dépasse `zone - INDICE_MIN`, remplacer l'objectif par « bord droit de l'actif = bord droit de la zone - 8 px » (priorité sur `margeIndice`, qui ne garantit que actif + épinglée). Le fondu droit (`styles-barre.ts`) doit s'arrêter à 24 px de l'actif : masquer le fondu quand l'actif est le dernier visible. |
| 2 | Bloquant | 14 (2 largeurs) | « Vocabulaire : Vocabulaire : … » | `T.prefixes.vocabulaire` (`config/textes/espace-bibliotheque`) + `ligneDeFiche` : ne préfixer que si le titre ne commence pas déjà par le préfixe (comparaison insensible à la casse, sans accent). Idem « Formules à détourner : Proverbes » (titre propre : garder). |
| 3 | Bloquant | 05 à 11, 12, 13, 14 à 29 (1280) | Trois largeurs : 720 px à gauche (la plupart), ~770 px centré (Parcours), pleine largeur 1216 px (Questions, Favoris, Profil). L'en-tête et la barre sont, eux, pleine largeur : l'œil attend un bloc aligné à leur marge gauche | Une règle par type d'écran, tokens `max-w-lecture` (720, déjà défini) et `max-w-7xl` : **lecture** (Aujourd'hui, S'entraîner, Quoi répondre, fiches, Bibliothèque, Lettres, Répliques, Profil, fil de question) = `max-w-lecture`, collé à gauche (`mx-0`) comme déjà fait ; **liste large** (Mes questions, Favoris) = `max-w-7xl` ; **Parcours** : retirer le `mx-auto` + largeur propre de `(dashboard)/parcours/(liste)/page.tsx`, passer à `max-w-lecture` à gauche. **Profil** (`profil/page.tsx`) : `max-w-lecture` aussi : les cartes Statistiques et Supprimer mon compte à 1216 px sont étirées. |
| 4 | Gênant | 05 nouvel 375 | Carte « Ton premier pas » : ~1 500 px de vide entre question et « Commencer » | Retirer le `min-height` étiré (`calc(100svh - 431px)` et variantes) de la carte du premier pas ; l'étalon v3 dit « hauteur naturelle + 48 px dessous ». Garder `p-6`, titre 24/32, bouton pleine largeur 48 px. Le vide est un bug (la capture pleine page agrandit la hauteur de viewport), mais le CSS en `svh` ne doit pas dépendre de la hauteur : borner à `max-h-[28rem]` si on garde l'étirement. |
| 5 | Gênant | 28 (375) | Onglet « Tout » collé au bord gauche (x = 0) et « Vidéos » coupé sans indice | `favoris/page.tsx` (rangée d'onglets) : `px-4` sur le conteneur défilant, `-mx-4` sur la rangée, `scroll-pl-4`, + fondu droit comme la barre. |
| 6 | Gênant | 30 (375) | Boutons « Retour à l'accueil » / « Voir les vannes » sur deux lignes | `app/not-found.tsx` : `<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">` et liens `w-full sm:w-auto`. |
| 7 | Gênant | 06/07 nouvel 375, 16 (375) | Guillemet orphelin « » en fin de ligne, flèche « → » seule | `frTypo` (lib de typographie) : espace fine insécable U+202F entre « et le mot, et avant », U+00A0 avant `→`. Une fonction, tous les rendus. |
| 8 | Gênant | 06 (1280) | « Ta scène » : `« Ça va ? » habituel` coupé après `? ` (guillemet fermant seul en début de ligne) | Même correction que 7 (U+202F avant `»`). |
| 9 | Gênant | 04 (1280) | Cloche = fenêtre centrée avec voile, alors que Plus et Compte sont des menus sous leur bouton | `cloche.tsx` : à `md:` et plus, panneau ancré sous la cloche (`absolute right-0 top-full w-80`), sans voile ; garder la feuille du bas sous 768. |
| 10 | Gênant | Fiches (16, 15…), 26, 27 | Pas de lien « retour » ni de rubrique cliquable : fiche = étiquette non cliquable « FORMULES À DÉTOURNER » ; Mes répliques / Lettres sans repère | Un seul composant « retour » en tête de page de détail : lien texte `text-sm text-text-secondary hover:text-text-primary` + chevron gauche, cible 44 px, vers la liste parente (Bibliothèque, Quoi répondre, Mes questions). Étiquette de type = lien. |
| 11 | Finition | 01 à 04 | « Aujourd'hui » : apostrophe droite dans le H1 et la page, typographique dans l'onglet | Passer tous les titres et libellés par `frTypo` (’). |
| 12 | Finition | 02 | Menu Plus : 1er groupe « S'entraîner » sans titre, les autres avec | Ajouter un titre de groupe (ex. « Pratique ») ou retirer les titres de groupe si le copy valide l'absence ; décision copy, pas design. |
| 13 | Finition | 05, 27 | Cartes « Conseil », « Vidéo » du jour et carte Lettres : ~24 px de vide sous le lien | Retirer le `min-h` / `pb` en trop des cartes simples ; `p-6` seul. |
| 14 | Finition | 05 (1280) | Un titre `h1` + « 4 cartes cette semaine » : ligne d'aide en 14 px proche du H1 (8 px), alors que S'entraîner met 24 px | Aligner : H1, puis sous-titre `mt-2`, puis contenu `mt-6` partout. |
| 15 | Finition | 04, 01 | Anneau de focus sur la cloche (capture après Échap) | Artefact de capture, rien à faire. |
| 16 | À trancher | 23 | Humour noir : 2e « Voir » nécessaire | Fonctionnel : hors périmètre design, voir @ux. |
| 17 | Verdict | 30 | « La 404 sans en-tête » | **La 404 de l'espace est la vraie 404 du site** (`app/not-found.tsx`, `notFound()` du layout) : le site n'a pas d'en-tête sur ses 404. Ne pas en ajouter ici (une 404 d'espace avec barre serait incohérente avec `/nimporte-quoi`). Emoji conservé (décision validée). |

## Les 5 corrections qui changent le plus l'impression

1. **Une seule largeur par type d'écran à 1280 px** (défaut 3) : `max-w-lecture` à gauche partout sauf Mes questions et Favoris. C'est le plus gros gain visuel.
2. **Onglet actif jamais coupé à 375 px** (défaut 1) : la barre est vue sur chaque page, chaque visite.
3. **Titre doublé « Vocabulaire : Vocabulaire : »** (défaut 2) : 8 lignes de la Bibliothèque, visible tout de suite.
4. **Typographie insécable** (7, 8, 11) : une fonction `frTypo` qui règle guillemets orphelins, flèches et apostrophes d'un coup.
5. **Carte « Ton premier pas » à hauteur naturelle + onglets de Favoris avec marge et indice** (4, 5) : premier écran du nouvel abonné et page Favoris à 375 px.

## Écart à l'étalon E5

L'étalon (maquettes `aujourdhui.html`, `carte-rafale.html`) place le contenu dans une colonne de 720 px à 1280 ; le code respecte cela sur Aujourd'hui et S'entraîner. L'écart vient des pages hors étalon (Parcours, Profil, Favoris, Questions) qui ont gardé leurs largeurs historiques. Boutons Oui / À moitié / Rien égaux et lisibles ; carte de rafale conforme (étiquette, scène, contexte, 3 boutons).

## Handoff @fullstack

Fichiers à toucher : `espace-barre-client.tsx`, `styles-barre.ts`, `liste-fiches.tsx` / `ligneDeFiche`, `parcours/(liste)/page.tsx`, `profil/page.tsx`, `favoris/page.tsx`, `app/not-found.tsx`, `cloche.tsx`, `frTypo`. Tokens inchangés, aucune couleur ni valeur arbitraire. Après correction : refaire les captures 14 à 17, 28, 30 (375) et 05 à 29 (1280), puis me les repasser (@qa : snapshots visuels à rebaser).
