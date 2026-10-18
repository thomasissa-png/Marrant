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
**Handoff → @orchestrator (puis @fullstack)**
- Fichier : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/design/revue-visuelle-s21/verdict-design.md`
- Décisions : accueil étiré avec pied commun ; lien étendu sur /conseils, zone 44 px sur /videos ; ligne « Lettre gratuite » centrée et bouton outline ; filtre `frTypo` étendu aux apostrophes (tiret : filet de sécurité + passe copy).
- Points d'attention : 375 / 768 / 1 280 / 1 440, contrastes AA non régressés (aucun changement de couleur demandé), dark mode seul en vigueur sur ces captures, tokens inchangés ; R26 touche `gabarit.ts` (rebase captures par @qa).

