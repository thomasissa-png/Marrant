# Verdict design s21 : relecture visuelle à l'aveugle (post-passe d'alignement)

> Relecteur : @design. Méthode : captures `apres/` lues une à une avant toute lecture de `audit.md` (lu ensuite, uniquement pour trancher N1 à N4). Textes validés : aucune correction ci-dessous ne change un mot ; ce qui ne se règle qu'avec du texte est isolé en section 5.
> Barre : site grand public premium, 10/10 exigé.

## 1. Verdict

**Note globale : 7,5 / 10. Verdict : NON, pas encore au niveau « irréprochable ». GO conditionnel : 2 bloquants + 14 majeurs à corriger (corrections CSS et mise en page seulement, aucune dépendance copy), puis nouvelle boucle de captures.**

La passe a réglé la cause racine (colonnes et bords) : sur la quasi-totalité des pages le bord gauche et le bord droit sont désormais communs, les blocs d'appel ont un seul style, les murs vannes/conseils/vidéos sont alignés sur la liste, les fiches partagent la colonne de 768 px. C'est net et mesurable. Ce qui reste n'est plus de l'alignement de colonne mais de la **finition** : hauteurs de cartes irrégulières, paddings de boîtes empilées qui décalent le texte de 4 à 7 px, chips orphelines sur mobile, boutons principaux sur 2 lignes, deux pages (conseils à 1 280, favoris à 1 280) dont la composition reste « flottante ».

Total : **31 défauts : 2 bloquants, 14 majeurs, 15 mineurs.**

### Limite de la relecture (à lire avant de décider)

- Les captures pleine page à 375 px de plus de 5 000 px de haut (`accueil-*-375`, `carnet-premium-375`, `blog-article-*-375`, `videos-premium-375`, `parcours-*-375`) sont réduites à l'affichage : j'y juge la structure, les rythmes et les alignements, pas les détails sous 12 px. Pour ces pages, demander à @qa des captures découpées par section (viewport 375 x 812, scroll par pas) avant la validation finale.
- `parcours-repartie-fin-etape1-*` : l'en-tête sticky est figé au milieu de la page (artefact de capture, voir R20). Le haut de ces pages (titre) n'est pas jugeable ; à recapturer sans scroll préalable.
- Non vues en détail à cause de la taille : `blog-article-*` (jugé sur la structure : encarts, FAQ, lettre alignés sur la colonne, RAS visible), `carnet-premium-*`.

## 2. Notes par page (/10)

Grille : alignement, largeurs, rythme, hiérarchie, boutons de même rôle, orphelins, tactile, contraste, cohérence sœurs, impression à 3 s. Note = pire largeur/profil relevé, pondérée.

| Page | Note | Défauts liés |
|---|---|---|
| Accueil (visiteur, gratuit, premium) | 7,5 | R11, R29, R26 |
| /abonnement | 8 | R07, R17 |
| /register | 7,5 | R07, R19 |
| /login | 8 | R19 |
| /onboarding (quiz 3 questions) | 8 | RAS bloquant |
| /onboarding résultat | 7 | R07, R16 |
| /vannes (liste + murs) | 7,5 | R03, R04, R08, R10 |
| Fiche vanne | 7,5 | R06, R12, R27 |
| /conseils | 6,5 | **R01**, R03, R08 |
| Fiche conseil | 7,5 | R05, R06, R13 |
| /videos | 7 | R05, R08, R10 |
| Fiche vidéo | 8 | R06 |
| /parcours et orientation | 8 | R07 (boutons d'étape sur 2 lignes à 375, acceptable) |
| Parcours /repartie étape 1 | 8 | R20 (capture) |
| Fin d'étape 1 (lettre dépliée) | 7 | R09, R20 |
| /carnet | 8 | R28 |
| /glossaire | 8 | R30, R31 |
| /a-propos | 8,5 | RAS |
| /lettre | 8,5 | RAS |
| /blog | 8,5 | RAS |
| Article de blog | 7,5 (structure seule) | à revérifier sur captures découpées |
| /profil | 7,5 | R08, R23 |
| /favoris | 6,5 | **R02** |
| /quiz-humour | 8 | RAS |
| Menu mobile | 7,5 | R22 |
| Fenêtre Premium | 8 | R21 |
| Admin « Semaine » | 6,5 | R14, R15 |
| Admin « Abonnés, Lettre » | 8 | R14, R24 |
| Admin « Abonnés, Premium » | 7,5 | R14, R25 |

## 3. Défauts restants

Captures dans `docs/design/revue-visuelle-s21/apres/`. Corrections en Tailwind (stack du projet), sans changer un mot. `gabarit.ts`, `BLOC_APPEL`, `BOUTON_BLOC_APPEL`, `MurListe`, `FaqSection`, `frTypo` : composants existants cités dans `audit.md`.

### Bloquants (2)

**R01 : /conseils à 1 280 et 1 440, cartes à moitié vides**
- Captures : `conseils-visiteur-1280`, `conseils-premium-1280`, `conseils-premium-1440`, `conseils-gratuit-1280`. C'est la page de la capture de Thomas : elle « flotte » toujours.
- Zone : liste des cartes conseil. Chaque carte fait 1 248 px de large, mais le texte s'arrête vers 465 px (mesure de lecture) ; la moitié droite est vide, avec étoile et partage isolés à 1 264 px.
- Correction : à partir de `lg`, la liste devient une grille 2 colonnes comme /vannes et /blog : conteneur `grid gap-4 lg:grid-cols-2 items-stretch`, carte `h-full flex flex-col p-5`, retirer le `max-w-prose` interne de l'extrait (il reste borné par la colonne de 600 px), `line-clamp-4` sur l'extrait, pied de carte (« Clique pour l'exemple… ») en `mt-auto`. Sous `lg` (768 : correct tel quel) garder 1 colonne. Dernière carte impaire : `lg:[&>*:last-child:nth-child(odd)]:col-span-2` (règle D15 déjà utilisée sur /blog).

**R02 : /favoris à 1 280 et 1 440, vignettes vidéo démesurées**
- Captures : `favoris-premium-1280`, `favoris-premium-1440`.
- Zone : cartes vidéo des favoris. Vignette 16/9 sur 1 244 px (environ 700 px de haut chacune), texte sur 1 200 px de long (plus de 150 caractères par ligne), pendant que les cartes vanne et conseil voisines font 80 px de haut. Rupture totale de rythme sur la page payante.
- Correction : carte vidéo en deux colonnes dès `lg` : `lg:grid lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-6` (vignette à gauche `aspect-video w-full`, contenu à droite), texte `max-w-prose`. Sous `lg` garder l'empilé actuel (375 correct). Les cartes vanne/conseil restent en carte compacte, mais passer toute la liste en `lg:grid-cols-2` pour les deux types courts (la carte vidéo en `lg:col-span-2`).

### Majeurs (14)

**R03 : chips de filtre orphelines et irrégulières à 375**
- Captures : `vannes-gratuit-375` et `vannes-premium-375` (« Autodérision » seule sur la 3e ligne), `conseils-premium-375` et `videos-premium-375` (« Expert » seul), `vannes-premium-375` (rangée 2 en 4 lignes irrégulières).
- Correction : un seul composant de chip pour les trois listes. Sous `md` : `flex flex-nowrap gap-2 overflow-x-auto snap-x -mx-4 px-4 pb-1 [scrollbar-width:none]` avec `mask-image: linear-gradient(to right, #000 calc(100% - 24px), transparent)` ; chip `min-h-11 px-4 snap-start whitespace-nowrap`. À partir de `md` : `flex-wrap`. Même rayon (`rounded-full`), même fond, même état actif (violet) sur vannes, conseils, vidéos (aujourd'hui pastilles sur vannes, onglets plats sur conseils).

**R04 : double rangée de filtres redondante sur /vannes premium**
- Captures : `vannes-premium-1280`, `vannes-premium-375`, `vannes-premium-1440`.
- Zone : la rangée 1 (Boulot & Collègues, Couple, Dating…) répète en plus petit les libellés de la rangée 2 (Toutes, Vie quotidienne, Boulot & Collègues, Couple & Dating…) ; deux styles de chips empilés.
- Correction : quand la rangée 2 (filtres) est affichée, masquer la rangée 1 (`hidden` via la condition d'abonnement, le contenu reste dans le DOM pour le SEO : `sr-only` plutôt que `hidden`). Une seule rangée visible par profil.

**R05 : cartes d'une même rangée de hauteurs différentes**
- Captures : `videos-visiteur-1280` et `videos-visiteur-768` (3e carte, ou carte de droite, plus courte de 70 px), `conseil-fiche-visiteur-1280` (« Dans la même thématique » : carte 1 à 74 px, carte 2 à 54 px), `accueil-premium-1280` (voir R11).
- Correction : grilles `items-stretch` (retirer tout `items-start`), carte `h-full flex flex-col`, bloc d'accordéons `flex-1`, pied en `mt-auto`. Pour les liens « même thématique » : `grid auto-rows-fr`.

**R06 : boîtes empilées des fiches, texte décalé de 4 à 7 px**
- Captures : `video-fiche-visiteur-1280` (bords de texte à 252, 259, 255 px), `conseil-fiche-visiteur-1280` (276, 280, 276), `vanne-fiche-visiteur-1440` (357, 361, 357).
- Zone : « Technique principale » / « Exemple concret » / « Pourquoi ça marche » (padding 16 à 21 px) face au bloc d'appel (24 px) face à « Dans un parcours » (20 px). Le bloc d'appel garde en plus 36 px sous son lien contre 24 px au-dessus.
- Correction : une valeur unique pour tous les blocs de colonne de lecture : `p-5` (20 px) en mobile, `md:p-6` (24 px) dès 768, appliquée à `BLOC_APPEL` et aux boîtes d'info de `gabarit.ts`. Supprimer le `pb`/`mb` supplémentaire sous le lien gratuit du bloc d'appel (padding bas = padding haut).

**R07 : bouton principal sur 2 lignes à 375**
- Captures : `abonnement-visiteur-375`, `abonnement-gratuit-375` (« Ouvrir les 5 parcours · / 2,99 €/mois »), `onboarding-resultat-gratuit-375`, `register-visiteur-375` (« Créer mon compte et passer au paiement » sur 2 lignes serrées).
- Zone : deux boutons de même rôle (CTA Premium) de 48 px d'un côté, 68 px de l'autre.
- Correction : sous 400 px, carte Premium `p-5` (au lieu de 24) et bouton `text-[15px] px-3 whitespace-nowrap` pour « Ouvrir les 5 parcours · 2,99 €/mois » (≈ 270 px dans 303 px utiles). Pour les libellés longs qui ne tiennent pas (register) : `min-h-12 py-3 leading-5 text-balance`. Règle commune : `min-h-12` sur tout bouton plein.

**R08 : cibles tactiles encore sous 44 px à 375**
- Captures : `vannes-gratuit-375` et `conseils-gratuit-375` (étoile et partage des cartes, pastilles de 28 à 32 px), `vannes-premium-375` (pagination, environ 36 px), `profil-premium-375` (« Gérer mon abonnement », « Changer de formule », « Résilier ton contrat » à environ 32 px ; ce sont des actions de compte), chips (voir R03).
- Correction : pastille visuelle inchangée, zone de 44 px par pseudo-élément : `relative after:absolute after:-inset-2 after:content-['']` sur les boutons icône (espacement entre les deux `gap-3`). Boutons de profil : `min-h-11 px-4`. Pagination : `min-h-11 min-w-11`.

**R09 : fin d'étape 1, lettre dépliée** (point 3, voir section 4)
- Captures : `parcours-repartie-fin-etape1-gratuit-375`, `parcours-repartie-fin-etape1-visiteur-375`, `...-1280`.
- Correction : voir décision 3.

**R10 : cartes floutées des murs : un rectangle vide qui ressemble à une erreur**
- Captures : `videos-visiteur-1280` (grand bloc vignette gris vide + lignes décalées), `conseils-visiteur-1280` (bordure en pointillés, à vérifier), `vannes-visiteur-1440`.
- Zone : sous la carte d'appel, un second cadre gris sans contenu lisible. À 3 secondes il se lit comme un chargement raté, et les trois murs n'ont pas le même cadre (pointillés sur /conseils, plein sur /vannes et /videos).
- Correction : un seul cadre pour les trois : `border border-border` plein (jamais `border-dashed`), hauteur fixe `h-24`, fond `bg-gradient-to-b from-surface-2 to-background`, lignes floues limitées à 2 barres `h-3 rounded-full bg-surface-3/60` de largeurs 70 % et 45 %, cadenas centré. Sur /videos, supprimer le grand carré de vignette (le garder uniquement dans une vraie carte).

**R11 : accueil, carte « Vanne du jour »** (point 1, voir section 4)
- Captures : `accueil-premium-1280`, `accueil-visiteur-1280`, `accueil-*-375`.

**R12 : fiche vanne à 375, boutons de partage sur 3 + 1**
- Capture : `vanne-fiche-visiteur-375` (« WhatsApp » seul sur la 2e ligne).
- Correction : `grid grid-cols-2 gap-2 sm:flex sm:flex-wrap`, chaque bouton `w-full sm:w-auto min-h-11` ; « Partager » reste en tête.

**R13 : fiche conseil, « Exemple concret » écrasé**
- Captures : `conseil-fiche-visiteur-375`, `conseil-fiche-visiteur-1280`.
- Zone : l'exemple (cœur utile du conseil) est en 14 px gris moyen, plus petit que l'intro (17 px), et ses lignes (Sincère, Humour, Fermeture, Total) sont collées sans espace.
- Correction : rendre chaque ligne dans son `<p>` (`text.split('\n')`, rendu uniquement) avec `space-y-2`, texte `text-base leading-7 text-foreground/90`, la ligne « Total » en `mt-3 pt-3 border-t border-border text-sm text-muted`. Aucun mot changé.

**R14 : admin, onglets coupés à 375**
- Captures : `admin-semaine-375`, `admin-abonnes-lettre-375`, `admin-abonnes-premium-375` (onglet « Planning » invisible, « Réseaux sociaux » collé au bord).
- Correction : sous `sm`, `grid grid-cols-2 gap-1` (2 x 2, chaque onglet `min-h-11`) ; dès `sm`, 4 colonnes égales comme à 1 280.

**R15 : admin « Semaine », valeurs longues alignées à droite sur plusieurs lignes**
- Capture : `admin-semaine-1280` (tableau « Parcours » : « Passage d'étape (abonnés) », « Parcours terminés sur commencés »), `admin-semaine-375`.
- Zone : chaînes à plusieurs segments (« confiance (étape 1 : 1 | 1→2 : 0 sur 1 | … ») renvoyées à la ligne en alignement droit, bords déchiquetés.
- Correction : pour ces lignes, cellule en pile : libellé en haut, puis valeur `text-left text-xs tabular-nums leading-5` ; segments séparés par « | » rendus en `flex flex-wrap gap-x-3` (chaque segment `whitespace-nowrap`). Les nombres simples restent alignés à droite.

**R16 : résultat d'onboarding, alignement mixte dans une seule carte**
- Captures : `onboarding-resultat-gratuit-375`, `onboarding-resultat-gratuit-1280`.
- Zone : titre et chapô centrés, « Ton parcours : Répartie » à gauche, REASS « Premium : premier paiement… » à gauche et en retrait sur 420 px sous un bouton pleine largeur, lien gratuit centré. Environ 60 px de vide sous le lien.
- Correction : bloc « Ton parcours » à gauche (c'est de la lecture), puis tout le groupe d'action (bouton, REASS, lien) en `text-center` sous le bouton pleine largeur ; retirer le `max-w` qui coupe la REASS ; padding bas de la carte = padding haut.

### Mineurs (15)

| # | Capture(s) | Zone et description | Correction |
|---|---|---|---|
| R17 | `abonnement-visiteur-1280`, `-768`, `-375` | Rythme : la carte Premium et le titre « Le carnet, en vrai » sont à 22 à 28 px l'un de l'autre, alors que carnet puis FAQ sont à 60 à 100 px. Le badge « plus de 3 mois offerts » flotte sous « Annuel » sans rattachement. | Espacement de section unique `mt-12 md:mt-16` entre carte, carnet, FAQ. Badge : le placer en ligne à droite du sélecteur (`flex items-center gap-3`) ou en `absolute -top-2 right-2` sur la pastille « Annuel ». |
| R18 | `vannes-visiteur-768`, `parcours-visiteur-768`, `abonnement-visiteur-768` (pieds de page) | À 768 px la colonne « Produit » fait une seule liste de 11 liens contre 6 pour « Légal », colonne marque étroite (texte sur 4 lignes). | Dès `md` : `grid-cols-[1.3fr_1.7fr_1fr]`, liste Produit en `grid grid-cols-2 gap-x-6` (comme à 1 280). |
| R19 | `login-visiteur-375`, `register-visiteur-375`, `-1280` | Logo aligné à gauche au-dessus d'un titre centré ; « Continuer avec Google » est en premier sur /register et en dernier sur /login ; la carte démarre à 100 px (register) contre 82 px (login) à 375. | Logo `mx-auto` (centré avec le titre) ; même gabarit vertical `min-h-dvh grid place-items-center py-8` pour les deux ; l'ordre des boutons est un choix de parcours (à confirmer avec @ux), mais l'écart de position doit disparaître. |
| R20 | `parcours-repartie-fin-etape1-visiteur-375` et `-1280`, `-gratuit-*` | Artefact de capture : l'en-tête sticky s'affiche au milieu de la page et masque le titre « Parcours Répartie ». | Recapturer : scroll en haut avant `fullPage`, ou `header { position: static }` injecté pour la capture. Ne pas en conclure un défaut de site sans revérification. |
| R21 | `fenetre-premium-visiteur-375` | Le bouton fermer (44 px) chevauche le bord haut de la feuille ; 15 px de marge sous la REASS. | Fermer à `top-3 right-3` à l'intérieur de la feuille ; `pb-[max(1.5rem,env(safe-area-inset-bottom))]`. |
| R22 | `menu-mobile-visiteur-375`, `-premium-375` | Pas de voile derrière le panneau (le titre de la page reste lumineux dessous) ; en visiteur, deux boutons « 2,99 €/mois » visibles ensemble (en-tête et panneau). | Voile `bg-black/60` sous le panneau, panneau jusqu'à `100dvh`, bouton d'en-tête masqué quand le menu est ouvert. |
| R23 | `profil-gratuit-375`, `profil-premium-375` | CTA du bloc Abonnement à largeur du texte alors que tous les autres CTA mobiles sont pleine largeur (D10) ; pastille « Ta série démarre… » en `rounded-full` sur 2 lignes. | `w-full sm:w-auto` ; pastille `rounded-2xl` dès qu'elle passe sur 2 lignes. |
| R24 | `admin-abonnes-lettre-375` | Fiches d'inscrits : « Consentement… Confirmé… Compte… Premium… » en flux libre, retours à la ligne irréguliers. | `dl` en `grid grid-cols-2 gap-x-4 gap-y-1` (libellé au-dessus de la valeur). |
| R25 | `admin-abonnes-premium-375`, `-1280` | Lien « Sync / Sync Stripe » en 12 px (cible minuscule) ; colonne « Dernière activité » à 100 % « jamais ». | Bouton fantôme `min-h-11 px-3` à 375 ; masquer la colonne tant qu'aucune valeur n'est renseignée (`hidden` conditionnel). |
| R26 | `accueil-premium-1280`, `vannes-premium-1280`, toutes pages catalogue à 1 280 | Le contenu tient entre 16 et 1 264 px : marges de 16 px, cartes collées au bord. À 1 440 px (96 px de marge) la page respire, à 1 280 non. | Coque : `px-4 sm:px-6 lg:px-8` (contenu 1 216 px à 1 280 px). À valider par @fullstack sur `gabarit.ts` (une seule valeur à changer) puis recapturer. |
| R27 | `abonnement-visiteur-1440` (FAQ en apostrophes courbes « C’est ») contre toutes les autres pages (apostrophes droites) | Typographie incohérente d'une page à l'autre. | Voir décision 4 : filtre d'affichage unique. |
| R28 | `carnet-visiteur-1280`, `-375`, `-768` | Liste « Au programme » : cadenas aligné sur la 1re ligne, pas centré sur la carte de 96 px. | `flex items-center gap-4` sur la rangée. |
| R29 | `accueil-premium-1280` | Quatre tailles de H2 sur la même page (« Ton contenu du jour », « Trois outils… » plus grand, « Derniers articles » plus petit, « Prochainement » grand). | Deux niveaux seulement : section principale `text-3xl`, secondaire `text-xl`. « Derniers articles » en secondaire, les trois autres en principal. |
| R30 | `glossaire-visiteur-375` | Nav d'ancres : défile à l'horizontale, dernier lien coupé (« Sto ») sans repère de défilement. | Même masque dégradé que R03 (24 px à droite) et `snap-x`. |
| R31 | `glossaire-visiteur-1280`, `-1440` | Cartes de définition pleines 1 244 px dont 40 % vide à droite (texte borné à 768 px). Conforme à la règle de gabarit, mais visuellement proche de R01. | Grille `lg:grid-cols-2` avec carte `h-full` ; ou colonne de 768 px centrée si l'index d'ancres reste pleine largeur. À arbitrer après la boucle conseils (R01) pour garder les deux pages sœurs identiques. |

## 4. Décisions sur les 4 points ouverts

### 1. Accueil, « Ton contenu du jour » : **ÉTIRER**

- Raison : sur 1 280 la carte vanne s'arrête 190 px plus haut que ses voisines, ce qui lit comme un décalage (le défaut même dont se plaint Thomas). Le « vide dans la carte » est un vide cadré, donc propre ; le vide hors carte est un bord irrégulier. La rangée est un module à trois colonnes : un module a une base commune.
- Pour que la carte étirée ne paraisse pas vide :
  - Grille : `grid items-stretch gap-4 md:grid-cols-3` ; carrousel mobile : `flex snap-x gap-3` avec `items-stretch`, chaque carte `min-w-[85%] md:min-w-0`.
  - Carte vanne : `flex flex-col h-full`. Setup de la vanne en `text-xl leading-7 font-medium` (au lieu du corps courant). Bouton « Révéler la chute » en `mt-auto w-full min-h-12` (variante niveau 2 outline). Rangée de réactions et partage sous le bouton, en pied commun aligné avec les pieds des cartes voisines (`mt-4 pt-4 border-t border-border`).
  - Cartes conseil et vidéo : même pied commun (`mt-auto`), mêmes paddings (R06).
- Critère de réussite : à 1 280, les trois cartes ont le même haut et le même bas, et les trois rangées d'actions sont sur la même ligne horizontale.

### 2. Titres-liens des cartes /conseils et /videos (21 à 28 px) : **LIEN ÉTENDU SUR /CONSEILS, ZONE MINIMALE DE 44 PX SUR /VIDEOS**

- /conseils : la carte est un seul objet (clic = ouvrir/déplier). Titre en lien étendu : `after:absolute after:inset-0 after:content-['']` sur le `<a>` du titre, carte `relative`, étoile et partage en `relative z-10`. La cible devient la carte entière (au moins 150 px de haut). Focus visible : `focus-visible:after:ring-2 after:ring-accent after:rounded-2xl` (outline 2 px, offset 2 px). Un seul lien par carte pour les lecteurs d'écran, nom accessible = titre. Le « geste de la carte » évoqué dans `audit.md` N2 est conservé : le lien étendu fait précisément ce geste.
- /videos : la carte contient des accordéons interactifs (« Ce que tu vas apprendre », « Exercice pratique ») ; un lien étendu les recouvrirait. Titre-lien seul : `inline-flex min-h-11 items-center py-2.5` (cible 44 px sans changer la taille visuelle), accordéons en `relative z-10`.
- Test de clôture : mesure Playwright des cibles à 375 px, aucune cible de titre sous 44 px de haut sur ces deux pages.

### 3. Fin d'étape 1, lettre dépliée à 375 px : **CENTRER LA LIGNE, FORMULAIRE EN COLONNE CENTRÉE, BOUTON D'ENVOI DE LA MÊME FORME QUE SUR /LETTRE**

- Un bloc centré ne porte pas de ligne alignée à gauche : la ligne repliée « Lettre gratuite… » appartient au groupe d'action centré (bouton, REASS, lien). Elle se centre (`mx-auto justify-center min-h-11`), repliée comme dépliée, donc la propriété « identique au pixel avant et après dépliage » de N3 est conservée.
- Formulaire déplié : conteneur `mx-auto w-full max-w-md text-left` (champs et texte du consentement lisibles à gauche, mais la colonne est centrée dans le bloc, donc aucun bord flottant à 375 comme à 1 280 où le champ occupe aujourd'hui toute la carte).
- Bouton d'envoi : « Envoie-moi la lettre » est aujourd'hui un lien souligné, alors que le même rôle est un bouton outline sur /lettre : même composant `outline-accent` en `w-full min-h-12`. La règle « un seul plein par bloc » est respectée (le bouton plein reste « Passer à l'étape 2 »).
- Capturer ensuite sans artefact (R20).

### 4. Fiche vanne, « Pourquoi ça marche » (tiret cadratin, apostrophes droites) : **OUI, FILTRE D'AFFICHAGE, À ÉTENDRE DE `frTypo`, SANS TOUCHER LA BASE**

- Apostrophes : `'` entre deux lettres devient `’` ; guillemets droits `"` en « » avec espaces insécables fines ; espace insécable avant `: ; ? !` et autour de `« »` (déjà posées par `frTypo`, D16). Aucun mot ne change : c'est du rendu, la donnée reste intacte, idempotent.
- Périmètre : tous les textes issus de la base rendus en nœuds texte (vannes, conseils, vidéos, carnet, parcours, favoris, résumés de listes), y compris les titres de carte et les `alt`. Exclusions : attributs `href`, slugs, JSON-LD, balises `<code>`, URL. Ce filtre résout aussi l'incohérence R27 (l'`abonnement` est en apostrophes courbes, le reste en droites).
- Tiret cadratin : le filtre peut le retirer en dernier recours, en remplaçant ` — ` par `, ` (une virgule) à l'affichage ; ce n'est qu'un signe, pas un mot, et cela applique la règle 12 du projet. Mais une virgule peut parfois mal tomber (incise) : le choix par phrase relève de @copywriter (section 5). Je recommande donc : filtre en filet de sécurité immédiat pour ` — `, plus passe @copywriter sur les occurrences réelles (une requête de comptage suffit).
- Test à ajouter : un test unitaire de `frTypo` avec les cas `l'abonnement`, `« elle le partage »`, ` — `, texte déjà typographié (doit rester identique).

## 5. À traiter par le texte uniquement (non modifiable ici)

- Tiret cadratin « — elle le partage » de « Pourquoi ça marche » (vanne, en base) : choix de ponctuation de remplacement par phrase, @copywriter (voir décision 4).
- Titre « Roman Frayssinet – L'intelligence des animaux » : tiret demi-cadratin dans les données (liste et fiche vidéo). Même traitement.
- Extraits de cartes conseil tronqués au milieu d'une phrase (« C'est pour… ») : limite de lignes, pas de texte à changer ; aucune action sauf si Thomas veut un extrait écrit exprès.

## 6. Points solides (à ne pas casser en corrigeant)

- Bords gauche et droit communs sur les pages de lecture à 768 px de colonne (fiches, carnet, lettre, abonnement, parcours, glossaire, quiz) : mesuré sur 1 280 et 1 440, net.
- Blocs d'appel `BLOC_APPEL` : même cadre, même ordre titre, bouton, REASS, lien sur les murs, fiches, carnet, glossaire, à propos.
- /a-propos, /lettre, /blog (grille à 2 colonnes, dernière carte pleine rangée) : propres sur toutes les largeurs vues.
- Fenêtre Premium en feuille basse à 375 px, carte centrée à 1 280 : conforme au pattern imposé.
- Admin : même système que le front, tableaux avec nombres alignés à droite, badges de statut lisibles (contrastes AA vus sur vert, orange, rouge).

## 7. Boucle de validation demandée

1. @fullstack : R01 et R02 d'abord, puis R03 à R16 ; R17 à R31 dans la même passe si possible (aucune ne dépend d'un texte).
2. @qa : recapturer sans artefact (R20), captures découpées par section à 375 px pour les pages longues, mesure Playwright : cibles sous 44 px (objectif 0 hors réactions pseudo-élément), hauteurs de cartes égales par rangée (accueil, vidéos, fiche « même thématique »), bords de texte identiques dans les colonnes de fiches.
3. @design : relecture à l'aveugle des nouvelles captures. Critère de sortie : plus aucun bloquant ni majeur, note globale supérieure ou égale à 9,5 ; les mineurs restants listés avec date.
4. Aucun contenu sous la barre n'est remis en ligne : ces corrections sont de la mise en page, elles repassent la relecture à l'aveugle avant mise en ligne (règle d'or s18).

---

# Tour 2 : relecture des captures `apres-v2/` (et découpes `apres-v2/sections/`)

> Méthode : même couverture qu'au tour 1 (chaque page en visiteur à 375 et 1 280 ; accueil, abonnement, vannes, conseils, vidéos, parcours, carnet, profil, favoris, onboarding en gratuit/premium à 375 ; fenêtre Premium, menu, fin d'étape 1, 6 captures admin ; 768 sur 7 pages : accueil, vannes, conseils, vidéos, profil, favoris, plus abonnement et vannes en 1 440 ; 1 440 sur accueil, conseils, profil). Notes posées avant la lecture de la section 7 de `audit.md`.
> Rappel : la décision 2 du tour 1 (lien étendu sur /conseils) est retirée : le dépliage sur place avec comptage XP prime. Le titre à 44 px de cible est accepté, le rendu n'a aucun défaut visible (cartes /conseils propres à 375, 768, 1 280, 1 440).

## T2.1 Verdict

**Note globale : 8,7 / 10. Pas encore 10/10 : 4 défauts majeurs visibles restent, 0 bloquant.**
Gros progrès : les 2 bloquants (/conseils et /favoris à 1 280) sont réglés, 14 majeurs sur 14 du tour 1 sont soit corrigés soit réduits au rang de mineur. La page de Thomas (/conseils) est enfin une vraie page de produit. Ce qui reste est étroit et précis : une grille qui laisse un orphelin, un décalage de 12 px dans les cartes vannes, un orphelin de 3e vidéo à 768 px, et la typographie (apostrophes) qui se voit.

**Décompte tour 2 : 4 majeurs, 12 mineurs, 0 bloquant.**

## T2.2 Statut des 31 défauts du tour 1

| # | Statut | Preuve visuelle (captures `apres-v2/`) |
|---|---|---|
| R01 | Corrigé, mais effet de bord (voir T2-01) | `conseils-premium-1440` : 10 cartes en 2 colonnes, égales, propres. `conseils-visiteur-1280` : 2 + 1 carte pleine largeur. |
| R02 | Corrigé | `favoris-premium-1280` : vignette 420 px à gauche, contenu à droite. Reste un vide en bas à gauche (T2-12). |
| R03 | Corrigé à 375 et 1 280, reste 1 orphelin à 768 (T2-09) | `vannes-premium-375` : ligne défilante avec fondu ; `vannes-visiteur-768` : « Autodérision » seul. |
| R04 | Corrigé | `vannes-premium-375` : une seule rangée visible. |
| R05 | Corrigé | `videos-visiteur-1280` : 3 cartes de même hauteur ; accueil 1 280 : 3 cartes et 3 rangées d'actions alignées (y identique). |
| R06 | Corrigé | `vanne-fiche-visiteur-1280` : bords de texte à 278 px sur les 4 boîtes ; `conseil-fiche-visiteur-1280` : 262 sur 3 boîtes ; `video-fiche-visiteur-1280` : 258. |
| R07 | Corrigé | `abonnement-visiteur-375` : bouton sur 1 ligne ; `onboarding-resultat-gratuit-375` : 1 ligne. `register-visiteur-375` : 2 lignes équilibrées, acceptable. |
| R08 | Non vérifiable à l'écran pour les boutons de /profil (T2-13) ; chips, pastilles, pagination OK à l'œil | `profil-premium-375` : « Gérer mon abonnement » semble faire environ 28 px de haut. Mesure Playwright demandée. |
| R09 | Corrigé | `parcours-repartie-fin-etape1-gratuit-375` : ligne centrée, formulaire en colonne centrée, bouton outline. |
| R10 | Corrigé, reste un détail (T2-10) | Trois murs au même cadre plein, plus de pointillés. |
| R11 | Corrigé | `accueil-premium-1280` : 3 cartes à la même hauteur, réactions sur la même ligne. Le vide dans la carte vanne (150 px) est cadré et acceptable. |
| R12 | Corrigé | `vanne-fiche-visiteur-375` : grille 2 x 2. |
| R13 | Corrigé | `conseil-fiche-visiteur-1280` et `-375` : paragraphes séparés, total en pied. |
| R14 | Corrigé | `admin-semaine-375` : onglets 2 x 2. |
| R15 | Corrigé à 1 280, réduit à 375 (T2-14) | `admin-semaine-1280` : valeurs sous le libellé. |
| R16 | Corrigé | `onboarding-resultat-gratuit-375`. |
| R17 | Corrigé | `abonnement-visiteur-1280` : badge « plus de 3 mois offerts » en ligne avec le sélecteur ; espacements réguliers. |
| R18 | Réduit (T2-08) | Footer 1 280 propre ; 768 : libellés sur 2 lignes. |
| R19 | Corrigé | `login-visiteur-375`, `register-visiteur-375` : logo centré, carte à la même position. |
| R20 | Corrigé | Plus d'en-tête figé ; `parcours-repartie-fin-etape1-*` jugeables. |
| R21 | Corrigé | `fenetre-premium-visiteur-375` : fermer dans la feuille ; `-1280` : carte centrée. |
| R22 | Corrigé | `menu-mobile-visiteur-375` : un seul bouton Premium, panneau plein écran. |
| R23 | Corrigé | `profil-premium-375`, `-768`. |
| R24 | Corrigé | `admin-abonnes-lettre-375` : grille 2 colonnes. |
| R25 | Corrigé, reste un détail (T2-14) | `admin-abonnes-premium-1280` : colonne remplie ; « Sync » en 12 px. |
| R26 | Corrigé dès 1 280 (marges 32 px) | `vannes-visiteur-1280` : respiration correcte ; 768 reste à 16 px (T2-11, accepté sous réserve). |
| R27 | **Non corrigé : majeur** (voir T2.3 et T2-04) | Voir ci-dessous. |
| R28 | Corrigé | `carnet-visiteur-1280`. |
| R29 | Corrigé | `accueil-premium-1280` : deux niveaux de titres. |
| R30 | Non vérifiable (capture 375 trop réduite) ; sans défaut visible | `glossaire-visiteur-375` |
| R31 | Corrigé | `glossaire-visiteur-1280` : 2 colonnes, cartes égales, liens alignés en pied. |

## T2.3 Décision R27 : MAJEUR

Les apostrophes droites restantes sont **visibles et gênantes**, car elles cohabitent avec des apostrophes courbes sur le même écran, parfois dans le même bloc :
- `vanne-fiche-visiteur-1280` : « Mon manager me dit que j'ai beaucoup… » (carte « même catégorie », droite) à 25 px d'un titre « Demain, c’est peut-être… » (courbe).
- `carnet-visiteur-1280` et `carnet-premium-375` : titre « Carnet d'octobre » (H1 40 px, droite) à côté de « Ça, c’était la réplique offerte » (courbe) ; tout le contenu des situations (« Tu viens d'arriver », « l'heure précise », « d'un ») est en droite alors que les articles du blog sont en courbe : le carnet est un contenu en base qui n'est pas passé par `frTypo`.
- `quiz-humour-visiteur-1280` : H1 « Quel type d'humour es-tu ? » (droite) ; `a-propos-visiteur-1280` : tout le texte en droite, puis le bloc d'appel du bas (« Observer d’abord, roder ensuite ») en courbe ; `videos-visiteur-1280` : FAQ « l’humour » (courbe) au-dessus de « Notre méthode » (« l'analyse », droite) ; `glossaire-visiteur-1280` : définitions courbes, titre de page et liens d'index droits.
- Pied de page, sur toutes les pages : « Anatomie d'une vanne » en droite.
- Guillemets ouvrants isolés en fin de ligne (orphelins) : `accueil-visiteur-375` (carte « 90+ vannes », « Mon père m'a demandé ce que c'était un « / meme ». ») et `accueil-premium-1280` (même phrase). C'est un défaut d'espace insécable manquante après « (aucun mot changé).

Passe typographique à la source, sans changer un mot :
1. Étendre `frTypo` : `(\p{L})'(\p{L})` devient `$1’$2` ; après « et avant » une espace insécable (U+00A0) ; espace insécable fine (U+202F) avant `: ; ? !` (les deux-points ne sont pas à fine en usage courant : garder U+00A0). Idempotent.
2. Appliquer `frTypo` à tout texte issu de la base encore non filtré : carnet (liste, fiche, « Au programme »), cartes « même catégorie / même thématique » (vannes, conseils, vidéos), exemples de la carte « Trois outils » de l'accueil, favoris, titres vidéo (le tiret « - » entre nom et titre reste tel quel : c'est une donnée).
3. Textes en dur : codemod `ts-morph` sur `apps/web/src/**/*.tsx` limité aux `JsxText`, aux attributs `alt`, `title`, `aria-label`, `placeholder` et aux littéraux des fichiers de contenu (FAQ, `metadata` titres et descriptions compris) ; remplacer `(\p{L})'(\p{L})` par `$1’$2`, ne jamais toucher `import`, `className`, `href`, clés d'objet, `data-*`, regex, JSON-LD. Lancer `npx tsc --noEmit` et Jest ; mettre à jour les tests qui cherchent un texte avec apostrophe droite (`getByText`), en normalisant `'` et `’` dans les helpers de test.
4. Pied de page et titres de la coque : mêmes règles (« Anatomie d’une vanne »).
5. Test de clôture Playwright, 27 pages x 3 profils : `body.innerText` ne contient aucun `/\p{L}'\p{L}/u` hors iframe YouTube (le titre « L'intelligence » dans la lecture embarquée vient de YouTube, pas de nous) ; aucun nœud texte ne se termine par `«` sans insécable.
- Critère de sortie : zéro apostrophe droite visible entre deux lettres sur les captures v3, zéro `«` ou `»` isolé en bord de ligne.

## T2.4 Défauts restants

### Majeurs (4)

**T2-01 : /conseils à 1 280 (visiteur, gratuit), dernière carte pleine largeur à moitié vide**
- Capture : `conseils-visiteur-1280` (3 cartes : 2 puis 1 carte de 1 248 px dont le texte s'arrête à 640 px), `conseils-gratuit-1280`.
- Zone : liste de 3 cartes gratuites. La règle « carte impaire seule = rangée entière » (D15) s'applique ici et recrée le défaut R01 sur la page de Thomas, avec étoile et partage seuls à l'extrême droite.
- Correction : ne pas étendre la carte impaire sur /conseils. Retirer `lg:[&>*:last-child:nth-child(odd)]:col-span-2` de la liste conseils (le mur d'appel qui suit est pleine largeur, donc la rangée de 1 carte ne se lit pas comme un trou). Alternative si on veut un bord plein : sur le mur uniquement (visiteur/gratuit, 3 cartes), `xl:grid-cols-3` au lieu de 2. Garder la règle de la dernière carte uniquement sur /blog (cartes courtes, texte pleine carte).

**T2-02 : cartes vannes, étiquette « Révéler la chute » décalée de 12 px et rangée d'action instable**
- Captures : `vannes-premium-375` (section 01 : « Révéler la chute » à x=45, texte de la vanne et « Clique pour la chute » à x=33), `vannes-visiteur-768`, `vannes-visiteur-1280` (x=39 contre 31), `vannes-gratuit-375`.
- Zone : pied de chaque carte vanne. Deux défauts : (1) l'étiquette « Révéler la chute » est en retrait de 12 px par rapport au texte de la carte (le padding horizontal du bouton ghost se voit). (2) La rangée n'est pas à la même place d'une carte à l'autre : à 1 280 elle suit directement le texte (carte « Mon casier » : y=467, voisine « Jeudi, en visio » : y=500, 33 px d'écart sur la même rangée), et à 768 elle est tantôt sur une ligne (« Les murs sont fins. »), tantôt sur deux (« Clique pour la chute » en dessous). C'est exactement le « texte qui flotte ».
- Correction :
  - Carte : `flex h-full flex-col`; zone texte `flex-1`; rangée d'action `mt-auto pt-4`.
  - Bouton « Révéler la chute » : `-ml-3` (compense `px-3`) pour aligner le texte sur le bord gauche du contenu de la carte, hauteur `min-h-11`, zone tactile inchangée.
  - Rangée : `flex-col items-start gap-1` en dessous de `xl` (375 et 768 : toujours 2 lignes, jamais 1) ; `xl:flex-row xl:items-center xl:gap-3` dès 1 280 (toujours 1 ligne). Flèche ronde en `ml-auto self-end xl:self-center`.

**T2-03 : /videos à 768 px, 3e carte seule dans une moitié de rangée**
- Capture : `videos-visiteur-768` (2 cartes en haut, la 3e à gauche, toute la moitié droite vide jusqu'à la carte d'appel).
- Correction : `grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3` ; carte impaire seule en `md:max-xl:[&:last-child:nth-child(odd)]:col-span-2` avec disposition `md:grid md:grid-cols-[minmax(0,320px)_1fr] md:gap-5` (vignette à gauche, accordéons à droite) comme la carte vidéo des favoris. À 1 280 la grille 3 colonnes reste.

**T2-04 : typographie : apostrophes droites et guillemets orphelins** : voir T2.3 (R27, majeur).

### Mineurs (12)

| # | Capture(s) | Défaut | Correction |
|---|---|---|---|
| T2-05 | `accueil-visiteur-375`, `accueil-premium-375` (sections 03) | Dans « Trois outils », les liens d'exemple (« En cours, j'ai levé la main pour aller / aux toilettes. ») cassent à 275 px alors que la carte offre 300 px : fin de ligne trop courte, orphelin « aux toilettes. » | Retirer le `max-w-*` des liens d'exemple (`w-full`) et ajouter `text-pretty`. |
| T2-06 | `accueil-visiteur-768`, `accueil-premium-1440` | À 768 px, « Ton contenu du jour » défile à l'horizontale, 2e et 3e cartes coupées à droite (une seule carte lisible) ; sur la vanne du jour, 150 px de vide entre le setup et le bouton. | `md:grid md:grid-cols-3 md:gap-4 md:overflow-visible` dès 768 avec padding de carte `p-4` (3 x 230 px : le texte du conseil passe en `line-clamp-6`), carrousel seulement sous 768. Le vide de la vanne est accepté. |
| T2-07 | `favoris-premium-375` | Onglets « Tout / Vannes / Conseils » sur une ligne, « Vidéos » seule sur la 2e. | Même ligne défilante que les chips (R03) : `flex-nowrap overflow-x-auto snap-x`, fondu à droite. |
| T2-08 | `vannes-visiteur-768`, `conseils-visiteur-768`, `videos-visiteur-768`, `profil-premium-768` (pied de page) | « Anatomie d'une vanne » et « Comment devenir drôle » passent sur 2 lignes dans le pied de page à 768 px ; colonne marque sur 4 lignes. | À `md` : `grid-cols-[1.2fr_2fr_1fr]`, liens `whitespace-nowrap`, ou liste Produit en 1 colonne à 768 et 2 colonnes dès `lg`. |
| T2-09 | `vannes-visiteur-768` | Chip « Autodérision » seule sur la 2e ligne. | Ligne défilante jusqu'à `lg` : `md:flex-nowrap lg:flex-wrap`. |
| T2-10 | `vannes-visiteur-1280`, `conseils-visiteur-1280`, `videos-visiteur-1280` | Carte floutée : le cadenas se pose par-dessus les deux barres floues au lieu de les compléter. | Cadenas à droite : `flex items-center justify-between`, barres `w-2/3`, cadenas `shrink-0 ml-4`. |
| T2-11 | `vannes-visiteur-768`, `conseils-visiteur-768` | Marges latérales de 16 px à 768 px (iPad), cartes près du bord. | Accepté tant que l'en-tête manque de place ; envisager `md:px-6` sur la coque en passant le menu en burger jusqu'à 1 024 px (l'en-tête à 768 l'est déjà). |
| T2-12 | `favoris-premium-1280`, `favoris-premium-768` | Dans les cartes vidéo, 250 px de vide sous la vignette (colonne gauche). | Les deux accordéons (« Ce que tu vas apprendre », « Exercice pratique ») en `lg:col-span-2` sous la rangée vignette + texte. |
| T2-13 | `profil-premium-375` | « Gérer mon abonnement », « Changer de formule », « Résilier ton contrat » à environ 28 px de haut. À mesurer, à ne pas supposer : `audit.md` section 7 annonce 44 px mesurés, le rendu de la capture dit moins ; réconcilier par une mesure sur la capture elle-même (hauteur de la boîte du bouton, pas du texte). Si 44 px confirmés, fermer. | `min-h-11 px-4` sous 768 ; mesure Playwright des cibles de /profil. |
| T2-14 | `admin-semaine-375`, `admin-abonnes-premium-1280` | Valeurs longues multi-lignes encore alignées à droite (« repartie (étape 1 : 1 ; 1→2 : 1 sur 1 … ») ; lien « Sync » à 12 px. | Valeurs longues `text-left` en pile sous le libellé comme à 1 280 ; « Sync » `min-h-11 px-3` sous 768. |
| T2-15 | `vanne-fiche-visiteur-1280`, `conseil-fiche-visiteur-1280` | Cartes « même catégorie / thématique » : texte collé en haut, vide en bas quand le titre tient sur 1 ligne. | `flex flex-col justify-center` (ou `items-start justify-center`) sur ces cartes `h-full`. |
| T2-16 | `register-visiteur-375` | Libellé « Créer mon compte et passer au paiement » sur 2 lignes. | `text-balance` ; accepté, pas de changement de largeur nécessaire. |

## T2.5 Notes par page (tour 2)

| Page | Note | Ce qui retient la note |
|---|---|---|
| Accueil | 8,5 | R27 (« orphelin), T2-05, T2-06 |
| /abonnement | 9,5 | RAS visible |
| /register | 9 | T2-16 |
| /login | 9,5 | RAS |
| /onboarding et résultat | 9 | RAS bloquant |
| /vannes | 8 | T2-02, T2-09 |
| Fiche vanne | 8,5 | R27, T2-15 |
| /conseils | 8,5 | T2-01 |
| Fiche conseil | 9 | R27, T2-15 |
| /videos | 8,5 | T2-03 |
| Fiche vidéo | 9,5 | RAS (titre dans l'iframe : YouTube) |
| /parcours et orientation | 9 | RAS |
| Étape 1 et fin d'étape 1 | 9 | RAS |
| /carnet | 8,5 | R27 (carnet entier en apostrophes droites) |
| /glossaire | 9,5 | R27 (index) |
| /a-propos | 9 | R27 |
| /lettre | 9,5 | R27 mineur |
| /blog et article | 9,5 | RAS (article propre sur les découpes 375) |
| /profil | 9 | T2-13 |
| /favoris | 8,5 | T2-07, T2-12 |
| /quiz-humour | 9 | R27 (H1) |
| Menu mobile, fenêtre Premium | 9,5 | RAS |
| Admin : Semaine | 8,5 | T2-14 |
| Admin : Abonnés (lettre, premium) | 9 | T2-14 |

## T2.6 Critère de passage à 10/10

Les 4 majeurs (T2-01 à T2-04) corrigés, plus T2-05, T2-07, T2-09 et T2-13 (rapides, visibles), puis recapture v3 des pages touchées : /conseils, /vannes, /videos (768 et 1 280), /carnet, accueil (375 et 768), /favoris, quiz, à propos. Les autres mineurs peuvent partir avec une date. Sans défaut visible à cette relecture, la note est 10.

---

# Tour 3 : relecture des captures `apres-v3/` (et découpes `apres-v3/sections/`)

> Méthode : captures relues avant `audit.md` §8. Couverture : chaque page en visiteur à 375 et 1 280 ; profils gratuit/premium à 375 (accueil, abonnement, vannes, conseils, vidéos, parcours, carnet, profil, favoris, résultat d'onboarding) ; 768 sur 12 pages (accueil, abonnement, parcours, glossaire, blog, vannes, conseils, vidéos, vanne-fiche, profil, favoris, carnet) ; 1 440 sur accueil, vannes, conseils ; fenêtre Premium, menu mobile, fin d'étape 1 (sections), 6 captures admin.
> Limites : (1) les vignettes YouTube sont en fond de secours (ytimg bloqué), je ne les juge pas ; (2) le titre à l'intérieur du lecteur YouTube (`video-fiche-*`, « "L'intelligence" des animaux ») est la donnée de YouTube, pas de nous ; (3) `blog-article-*` jugé sur la structure et les découpes (encart, lettre, FAQ alignés sur la colonne), les pages de 7 000 à 12 000 px (`carnet-premium-*`, `blog-article-*`) ne sont pas lisibles ligne à ligne à l'affichage réduit.

## T3.1 Verdict

**Note globale : 9,3 / 10. Pas encore 10 : 1 majeur et 7 mineurs visibles, 0 bloquant.** Le site tient : colonnes, bords, cartes de même hauteur, murs, fiches, blocs d'appel et pied de page sont propres à 375, 768, 1 280 et 1 440. Les 4 majeurs du tour 2 sont réglés (T2-01 par une autre mise en page, voir T3-04). La typographie est enfin homogène : plus aucune apostrophe droite visible sur le public (carnet, quiz, à propos, glossaire, fiches, pied de page, formulaires : toutes courbes), les « » sont sans orphelin. Il reste un bouton d'appel sur 2 lignes à 375 sur quelques pages, et des finitions.

## T3.2 Statut des 16 défauts du tour 2

| # | Statut | Preuve |
|---|---|---|
| T2-01 | Corrigé, effet de bord (T3-04) | `conseils-visiteur-1280` : la 3e carte n'est plus à moitié vide mais n'a plus la même anatomie que ses voisines. |
| T2-02 | Corrigé | `vannes-visiteur-1280`, `vannes-premium-1280` : « Révéler la chute » aligné sur le texte, pied de carte sur la même ligne ; `vannes-visiteur-768` : toujours 2 lignes, cartes égales. |
| T2-03 | Corrigé | `videos-visiteur-768` : 3e carte pleine rangée, vignette à gauche, accordéons dessous. |
| T2-04 / R27 | Corrigé sur le public | Voir T3.3. |
| T2-05 | **Partiel** (T3-03) | `accueil-visiteur-375` section 03 : « Le toast de soixante secondes qui / tient debout » casse à 265 px sur 335 disponibles. L'exemple « aux toilettes » est réglé. |
| T2-06 | Corrigé | `accueil-visiteur-768` : trois cartes visibles, plus de défilement. Dense mais lisible (note T3-09). |
| T2-07 | Corrigé | `favoris-premium-375` : onglets sur une ligne qui défile, « Vidéos » rogné par le fondu. |
| T2-08 | Corrigé | `vannes-visiteur-768` : pied de page propre, libellés sur 1 ligne. |
| T2-09 | Accepté | `vannes-visiteur-768` : rangée défilante, dernier chip rogné avec fondu. |
| T2-10 | Corrigé | Trois murs : cadre plein, deux barres à gauche, cadenas à droite. |
| T2-11 | Accepté | 768 : marges 16 px, sans défaut visible. |
| T2-12 | Corrigé | `favoris-premium-1280` : vignette à gauche, accordéons pleine largeur dessous. |
| T2-13 | Fermé | Mesure de l'intégrateur acceptée (44 px). |
| T2-14 | Corrigé, un reste (T3-08) | `admin-semaine-375` valeurs en pile. |
| T2-15 | Corrigé | `vanne-fiche-visiteur-1280`, `conseil-fiche-visiteur-1280`, `video-fiche-visiteur-1280` : cartes « même thématique » de même hauteur, texte centré. |
| T2-16 | Accepté | `register-visiteur-375`. |

## T3.3 Décision R27 : CLOS sur le public

Vérifié sur 30 captures publiques à 375 et 1 280 : titres (« Carnet d’octobre », « Quel type d’humour es-tu ? », « L’équipe »), corps, formulaires (« T’as le potentiel », « m’abonner »), pied de page (« Anatomie d’une vanne »), FAQ, cartes « même catégorie » : apostrophes courbes partout, même dans le carnet. Plus de « isolé en fin de ligne. Restent hors périmètre : le titre du lecteur YouTube (donnée YouTube) et l'admin (T3-08, mineur).

## T3.4 Défauts restants

### Majeur (1)

**T3-01 : bouton d'appel Premium sur 2 lignes à 375, sur quelques pages seulement**
- Captures : `video-fiche-visiteur-375` (« Décrypter cette / vidéo · 2,99 €/mois », bouton de 66 px), `conseils-gratuit-375` et `conseils-visiteur-375` (« Voir la suite des / conseils · 2,99 €/mois »). Les mêmes blocs sur `vanne-fiche-visiteur-375` (« Écrire la mienne · 2,99 €/mois »), `conseil-fiche-visiteur-375` (« Essayer ce conseil · 2,99 €/mois »), `carnet-gratuit-375`, `abonnement-*-375` sont sur 1 ligne : un même rôle (bouton plein du bloc d'appel) prend deux hauteurs selon la page.
- Zone : `BOUTON_BLOC_APPEL` dans les blocs d'appel des fiches vidéo et des murs conseils/vidéos.
- Correction : appliquer `BOUTON_PRIX_UNE_LIGNE` (15 px, `px-3`, `whitespace-nowrap`) à `BOUTON_BLOC_APPEL`, donc à tous les boutons à prix des blocs d'appel sous 400 px. « Décrypter cette vidéo · 2,99 €/mois » mesure environ 250 px à 15 px pour 303 px utiles (carte `p-5`) : ça tient. Garantie de clôture : test Playwright à 375 qui vérifie `boundingBox().height <= 52` sur tout bouton `[data-appel]`.

### Mineurs (9)

| # | Capture(s) | Défaut | Correction |
|---|---|---|---|
| T3-02 | Pied de page de toutes les pages (« stand-/up pour briller »), `vannes-visiteur-768` (« Vidéos stand-/up analysées »), `video-fiche-visiteur-375` (« en mode start-/up »), `accueil-visiteur-768` (« L’auto-/dérision sociale ») | Césure sur le trait d'union laisse « stand- » ou « auto- » en fin de ligne. | `frTypo` : remplacer le trait d'union par U+2011 dans `stand-up`, `start-up`, `auto-dérision`, `one-liner`, `rendez-vous`, `e-mail`, `peut-être`, et dans tout mot de la forme `\p{L}{2,}-\p{L}{2,}` de moins de 12 caractères. Ou `hyphens: none` plus `whitespace-nowrap` sur ces mots. |
| T3-03 | `accueil-visiteur-375` section 03 (liens d'exemple « Le toast… », « Ce que raconte… » des cartes « Trois outils ») | Le lien casse à 265 px dans une carte qui offre 335 px : la ligne se coupe trop tôt. | Supprimer le `max-w-*` du lien (`w-full`) et ajouter `text-pretty`. |
| T3-04 | `conseils-visiteur-1280`, `conseils-gratuit-1280` | 3e carte en pleine rangée avec une autre anatomie (titre à gauche, extrait à droite) que ses deux voisines (extrait sous le titre). Propre, mais pas pareille. | Pour une liste de 3 cartes (murs visiteur et gratuit) : `xl:grid-cols-3`, aucune carte en `col-span-2`. Garder la règle « dernière carte pleine rangée » seulement sur /blog et sur /favoris. |
| T3-05 | `vanne-fiche-visiteur-1280`, `-768` | Titre H1 borné à environ 580 px dans une colonne de 760 px, avec une césure « …chacun a / cotisé… ». | `text-balance` et retirer le `max-w` du titre (ou le porter à la colonne). |
| T3-06 | `favoris-premium-768` | Vignette vidéo à 700 px de large (environ 330 px de haut) et cartes vannes en pleine largeur pour une phrase : le tablette se lit comme un mobile étiré. | Dès `md` : carte vidéo `md:grid md:grid-cols-[minmax(0,300px)_1fr] md:gap-5` ; vannes et conseils en `md:grid-cols-2`. |
| T3-07 | `vannes-premium-1280` | Deux chips (« Absurde », « Jeux de mots ») isolées sur une 2e rangée. | `lg:px-3` sur les chips à partir de 1 024 px (12 chips tiennent sur une ligne de 1 216 px) ; sinon laisser. |
| T3-08 | `admin-abonnes-lettre-375` ; `admin-semaine-375`, `-1280` | Fiches d'inscrits : l'adresse se coupe en pleine ligne (« …@exam / ple.com ») car la pastille de statut lui prend la place. Libellés d'admin en apostrophes droites (« aujourd'hui », « d'étape »). | Pastille de statut au-dessus de l'adresse (`flex-col items-start`) ou en `shrink-0` avec `[overflow-wrap:anywhere]` sur l'adresse seulement. Apostrophes : même passe `frTypo` appliquée à `app/admin/**`. Usage interne, non bloquant. |
| T3-09 | `accueil-visiteur-768` | Trois colonnes de 230 px : titres des cartes coupés sur 3 lignes, « Tu te reconnais ? » avec des extraits de 8 lignes. Lisible, dense. | Accepté tel quel. Si on veut l'alléger : `md:grid-cols-3` seulement dès `lg`, et à `md` une rangée de cartes `snap-x` de 70 % de largeur. Non compté dans les notes. |

Décompte tour 3 : **1 majeur, 7 mineurs (T3-02 à T3-08), 0 bloquant** ; T3-09 est une observation acceptée, non comptée.

## T3.5 Notes par page (tour 3)

| Page | Note |
|---|---|
| Accueil | 9,3 (T3-02, T3-03) |
| /abonnement | 10 |
| /register | 9,5 |
| /login | 10 |
| /onboarding et résultat | 10 |
| /vannes | 9,5 (T3-07) |
| Fiche vanne | 9,3 (T3-05, T3-02) |
| /conseils | 9 (T3-01, T3-04) |
| Fiche conseil | 10 |
| /videos | 9,5 |
| Fiche vidéo | 9 (T3-01, T3-02) |
| /parcours, étape 1, fin d'étape 1 | 9,7 |
| /carnet | 10 |
| /glossaire | 9,7 |
| /a-propos | 10 |
| /lettre | 10 |
| /blog et article | 9,7 |
| /profil | 9,7 |
| /favoris | 9,3 (T3-06) |
| /quiz-humour | 10 |
| Menu mobile, fenêtre Premium | 10 |
| Admin : Semaine | 9,3 (T3-08) |
| Admin : Abonnés (lettre, premium) | 9,3 (T3-08) |

## T3.6 Pour passer à 10

T3-01 (obligatoire), puis T3-02, T3-03, T3-04, T3-05 (rapides, visibles, 1 ligne de CSS chacun). T3-06 à T3-08 peuvent partir avec date. Recapturer : `conseils-*-1280`, `video-fiche-*-375`, `conseils-*-375`, `accueil-visiteur-375`, `vanne-fiche-*-1280`, pied de page (1 page suffit pour T3-02). Si ces 5 pages sont propres, la note est 10.

---
**Handoff → @orchestrator (puis @fullstack)**
- Fichier : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/design/revue-visuelle-s21/verdict-design.md`
- Décisions : accueil étiré avec pied commun ; lien étendu sur /conseils, zone 44 px sur /videos ; ligne « Lettre gratuite » centrée et bouton outline ; filtre `frTypo` étendu aux apostrophes (tiret : filet de sécurité + passe copy).
- Points d'attention : 375 / 768 / 1 280 / 1 440, contrastes AA non régressés (aucun changement de couleur demandé), dark mode seul en vigueur sur ces captures, tokens inchangés ; R26 touche `gabarit.ts` (rebase captures par @qa).

