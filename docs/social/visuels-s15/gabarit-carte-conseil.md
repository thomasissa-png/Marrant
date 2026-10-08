# Gabarit de carte Instagram « conseil » (4:5, 1080×1350), spec prête à coder

> @design, 08/10/2026. Pour @fullstack. **Rien codé, rien déployé, rien rendu** : cette session n'a pas de shell, donc aucune mesure de glyphes ni aucun rendu du nouveau gabarit. Tous les chiffres de lignes et de hauteurs ci-dessous sont des **estimations calibrées** (voir §2) marquées `[À MESURER]` : le script de contrôle (§8) tranche, pas ce document. Les contrastes sont calculés (formule WCAG), pas estimés.
> Périmètre : les 5 conseils Instagram du lot 1b (K26, K30, K22, K07, K27 = 10 cartes). Les 5 autres conseils de `textes-formats-valides.json` sont des posts X, sans carte.

## 1. Diagnostic (carte de contrôle lue : `controle-conseil-ig-06-11-fausse-naivete-carte1.png`)

Défauts visibles sur le rendu actuel (gabarit vanne `VanneAmorce`, citation R6 forcée) :
1. La technique est collée au texte, en blanc, même corps : « La fausse naïveté : Premier rendez-vous… » se lit comme une phrase, pas comme un titre.
2. « » lilas autour de tout le bloc (R6 déclenché par « j'ai », « me » dans la carte 2), et le « du menu devient “ ” imbriqué : faux pour un conseil.
3. Lignes coupées comme un poème (10 lignes dont « Tu prends » seul à mi-largeur) : `mettreEnLignes` préfère couper après chaque point (`ponctuationInterne`), bon pour une vanne de 12 mots, mauvais pour 30 mots.
4. Corps réduit en silence de 80 à **68 px** (mesuré : 10 lignes, pas de 76 px = 68 × 1,12) pour éviter un mot seul ; texte du haut à y 130, bas à y 880.
5. Cause des 5 débordements : zone centrée « haut » = 816 px de haut (1350 − 192 − 72 − 270) et chute de carte 2 à 100 px. Un bloc plus haut que la zone déborde **en haut et en bas** (constaté sur K26, K22, K07 carte 2).

## 2. Données de calibrage

- Largeur utile : 1080 − 2 × 96 = **888 px** ; largeur de coupe = 888 × 0,97 (`MARGE`) = **861 px**. Pas de « suspendu » : aucun décalage de colonne.
- Chasse mesurée sur la carte de contrôle (169 caractères, 10 lignes, Plus Jakarta Sans 800, 68 px, espaces élargies de `ESPACE_MOTS` comprises) : **0,50 em par caractère** en moyenne (0,47 à 0,55 selon les lignes). Le 700 est un peu plus étroit : on garde 0,50 par prudence.
- Remplissage moyen d'une ligne en coupe équilibrée : 88 % (hypothèse prudente). Soit, par palier `c` : **caractères par ligne ≈ 1515 / c** (21 à 72 px, 27 à 56 px).
- Estimation du nombre de lignes : `N = ceil(caractères × c / 1515)`. `[À MESURER]` par le vrai moteur, qui lit les avances des glyphes.
- Mobile : 390 pt de large pour 1080 px, facteur **0,361** ; seuil de lisibilité du projet **14 pt** (notation design cycle 3) = 38,8 px.

## 3. Cadre commun (identique au gabarit vanne, `Carte` de `carte-marque.tsx`)

| Élément | Valeur | Source |
|---|---|---|
| Format | 1080×1350, `FORMATS.instagram`, `padX` 96, `padY` 96 | existant |
| Fond carte 1 | `#0D0D0D` (`COLORS.bg`) | existant |
| Fond carte 2 | aplat `#6D28D9` (`COLORS.accentSecondary`), même rythme noir puis aplat que la vanne et que `ConseilReplique` | existant |
| Étiquette « Conseil » | **aucune** (`kind` non passé) : le surtitre fait le travail, deux étiquettes empilées seraient redondantes | décision |
| Pied | monogramme « d » 72 px (`TAILLE_MONOGRAMME`) + « deviens-marrant.fr » Inter 400 32 px (`TAILLE_PIED`), `#B3B3B3` sur noir, `#FFFFFF` sur aplat | existant, inchangé |
| « Glisse → » | carte 1 seulement, `INDICE_SWIPE`, Inter 700 32 px blanc, à droite du pied. Rien sur la carte 2 | existant |
| Découpe grille 3:4 | 34 px de chaque côté coupés : marge 96 > 34, rien à faire | existant |

**Zone de texte** (nouvelle position `position="debut"` de `Carte`, sans toucher à `centre` ni `haut`) :
- x de 96 à 984 (**888 px**), y de **96 à 1118** (**1022 px** de haut) ;
- `justifyContent: flex-start` (**ancrage en haut**, début du bloc toujours à y 96) ;
- `paddingBottom = ECART_TITRE_PIED` (64 px, token existant) : 1350 − 96 − 72 − 64 = 1118. Écart minimal de 64 px avec le pied, qu'aucun texte ne peut manger ;
- **jamais `overflow: hidden`** : un texte qui ne tient pas doit faire échouer le rendu (§7), pas être rogné en silence.

Pourquoi l'ancrage en haut et pas le centrage : le surtitre reste au même endroit d'une carte à l'autre (identité de série, lecture du haut vers le bas), et un bloc trop haut ne peut plus déborder des deux côtés à la fois. Variantes écartées : centrage 40 % (position `haut` actuelle, cause du défaut 5), surtitre en majuscules espacées (crie, et casse les apostrophes typographiques de « L’anecdote »), carte 2 sur noir (perd le rythme de la marque et se confond avec la carte 1).

## 4. Carte 1 : surtitre puis situation

**Surtitre = nom de la technique** (champ `surtitre`, 4 mots au plus, jamais préfixé dans le texte : `carteAvecSurtitre` n'est plus utilisée pour le rendu).

| Propriété | Valeur |
|---|---|
| Police, graisse | Plus Jakarta Sans **800** (le `Surtitre` actuel est en 700 : ajouter une prop `poids`, défaut 700 pour ne rien changer ailleurs) |
| Corps / interligne | **40 px** (existant) / **48 px** (1,2, multiple de 4) |
| Couleur | **lilas `#A78BFA`** (`COLORS.accentHover`), 7,14:1 sur `#0D0D0D` |
| Casse | **casse de phrase, telle que dans le JSON** (« Consoler en exagérant », « L’anecdote qui déraille »). Pas de majuscules, pas de `letter-spacing`, pas de « : » ni de point final |
| Typo | `affichage(typo(texte))` (apostrophe ’), une seule ligne, `whiteSpace: pre`, jamais de retour à la ligne |
| Espace sous le surtitre | **32 px** (existant) ; bloc surtitre = 48 + 32 = **80 px** |
| Garde | largeur mesurée > 888 px ou > 4 mots : erreur de rendu. Estimé : « L’anecdote qui déraille » (23 car.) ≈ 460 px `[À MESURER]` |

**Situation** (cartes[0] du JSON, mot pour mot) :

| Propriété | Valeur |
|---|---|
| Police, graisse | Plus Jakarta Sans **700** (le 800 est réservé à la réplique et à la vanne : voir la différence d'un coup d'œil) |
| Couleur | `#FFFFFF`, 19,4:1 sur `#0D0D0D` |
| Corps | fitté par la règle du §6 : palier max **72 px**, plancher **56 px** |
| Alignement | gauche, un seul paragraphe, coupe équilibrée **sans préférence de fin de phrase** (§6) |
| « » du texte | **blancs**, 1er niveau, typographie `typo()` (insécables). **Jamais lilas, jamais suspendus, jamais de paire ajoutée** : ni R6, ni `estPremierePersonne` ne s'appliquent à ce gabarit |

Hauteur du bloc = 80 (surtitre) + lignes × interligne ≤ 1022.

## 5. Carte 2 : réplique puis « À toi de jouer : … »

**Découpe du texte** (cartes[1] du JSON) : la consigne commence à la **dernière** occurrence de `À toi de jouer :` ; ce qui précède (trim) est la réplique. Absence de la formule : erreur de rendu, on ne devine pas. Les 5 cartes 2 du lot contiennent la formule une fois.

| Bloc | Police, graisse | Couleur | Corps | Notes |
|---|---|---|---|---|
| Réplique | Plus Jakarta Sans **800** | `#FFFFFF` (7,10:1 sur `#6D28D9`) | corps `R` (§6) | Un paragraphe, y compris la narration qui précède (« Puis, plus doucement : », « Trois semaines plus tard : ») |
| « » de la réplique | idem | **lilas `#DDD6FE`** (`COULEUR_GUILLEMETS.aplat`, 5,11:1 sur l'aplat) | idem | Ce sont **les guillemets du texte**, pas une paire ajoutée : tout « et » de 1er niveau est teinté, y compris deux paires dans la même carte (K26). Inline : le « ouvrant est le premier caractère de sa ligne, **aucun suspendu, aucun décalage de colonne** (x de départ 96). Les “ ” imbriqués restent blancs |
| Écart réplique, consigne | | | | **48 px** (existant, `VanneChute`) |
| Consigne | Plus Jakarta Sans **700** | `#FFFFFF` ; « À toi de jouer : » en **`#DDD6FE`** (même repérage que `DecryptageConsigne`, `SURTITRE_INTEGRE`) | `C = 4 × round(0,8 × R / 4)`, plancher **40 px** | Un paragraphe, aucun guillemet ajouté |

`#A78BFA` est **interdit sur l'aplat** (2,6:1, échec AA) : sur `#6D28D9`, seul `#DDD6FE` ou le blanc.

## 6. Règle de réduction automatique (corps, plancher, interlignage)

**Paliers de corps `R`** (carte 1 : la situation ; carte 2 : la réplique), pas de 4 px :

| `R` (px) | pt à 390 px | Interligne `R` | `C` consigne (px) | pt à 390 | Interligne `C` |
|---|---|---|---|---|---|
| **72 (max)** | 26,0 | 92 | 56 | 20,2 | 72 |
| 68 | 24,6 | 84 | 56 | 20,2 | 72 |
| 64 | 23,1 | 80 | 52 | 18,8 | 64 |
| 60 | 21,7 | 76 | 48 | 17,3 | 60 |
| **56 (plancher)** | 20,2 | 72 | 44 | 15,9 | 56 |

- **Interlignage** = `4 × round(1,25 × corps / 4)` (multiple de 4 ; 1,25 contre 1,12 pour la vanne : un paragraphe se lit, une vanne se claque). Surtitre : 48.
- **Corps maximal 72 px** (26 pt) : plus petit que l'amorce vanne (88/80) et la chute (100), pour que le gabarit ne se confonde pas avec une vanne. 64 est déjà le corps des cartes 3 et 4 du décryptage.
- **Plancher 56 px = 20,2 pt à 390 px** pour le texte de lecture, 44 px = 15,9 pt pour la consigne, **40 px = 14,4 pt** plancher absolu (seuil 14 pt). Surtitre 40 px = 14,4 pt, pied 32 px = 11,6 pt (existant, étiquette de marque, hors texte de lecture).
- **Algorithme** (par carte, indépendant d'une carte à l'autre : un conseil peut avoir 72 en carte 1 et 68 en carte 2, comme la vanne a deux corps) :
  1. Pour `R` de 72 à 56 par pas de 4 : composer chaque paragraphe à son corps, largeur 888 × 0,97, **coupe équilibrée à nombre de lignes minimal, sans le critère `ponctuationInterne`**, en gardant les garde-fous existants (jamais un mot seul, jamais un début de phrase d'un mot en fin de ligne, dernière ligne ≥ 40 % de la plus longue).
  2. Hauteur `H` = (80 si carte 1) + lignes × interligne `R` (+ 48 + lignes × interligne `C` si carte 2).
  3. Retenir le premier `R` tel que `H ≤ 1022` **et** qu'aucun bloc insécable ne dépasse 861 px.
  4. Aucun `R` ne convient au plancher : **lever une erreur** (carte, nombre de lignes, hauteur). Pas de corps sous 56, pas de rognage, pas de mot retiré.
- **Pas de réduction silencieuse** : l'actuel « −30 % pour éviter un mot seul » de `mettreEnLignes` (cause du 80 vers 68 sur la carte de contrôle) n'existe pas dans ce gabarit : on change de palier, jamais de 2 px en 2 px.
- **Code** : nouvelle fonction `composerParagraphe` (même base que `composer`, drapeau `coupeDeSens: false` passé à `resoudre`, défaut `true`). Les cartes vanne, décryptage, article, LinkedIn restent **octet pour octet identiques** (tests existants + comparaison de 3 PNG vanne avant et après).

**Capacité** (estimée, `[À MESURER]`, pour la répartition 70 % réplique / 30 % consigne) :

| | à 72 px | au plancher 56 px | plus longue des 10 | marge au plancher |
|---|---|---|---|---|
| Carte 1 (situation) | ≈ 210 car. (10 lignes) | ≈ 350 car. (13 lignes) | K27 : 183 | +90 % |
| Carte 2 (réplique + consigne) | ≈ 250 car. | ≈ 400 car. | K07 : 220 (33 mots) | +80 % |

Le plafond de 35 mots par carte du mix (≈ 245 car.) tient donc au moins à 64 px.

## 7. Les 10 cartes du lot : corps et hauteurs attendus `[À MESURER]`

Comptage des caractères à la main sur `textes-formats-valides.json` (hors surtitre ; carte 2 : réplique + consigne). Estimation `N = ceil(car. × c / 1515)`, tolérance **± 1 palier (4 px)**.

| Carte | Car. (réplique + consigne) | Corps attendu | Lignes attendues | Bas du bloc (y) |
|---|---|---|---|---|
| K26 carte 1 (la plus courte) | 125 | 72 | 6 | ≈ 728 |
| K30 carte 1 | 136 | 72 | 7 | ≈ 820 |
| K22 carte 1 | 159 | 72 | 8 | ≈ 912 |
| K07 carte 1 | 160 | 72 | 8 | ≈ 912 |
| K27 carte 1 (la plus longue) | 183 | 72 | 9 | ≈ 1004 |
| K27 carte 2 | 97 + 88 | 72 | 5 + 4 | ≈ 892 |
| K22 carte 2 | 114 + 69 | 72 | 6 + 3 | ≈ 912 |
| K30 carte 2 | 125 + 68 | 72 | 6 + 3 | ≈ 912 |
| K26 carte 2 | 148 + 61 | 72 ou 68 | 8 + 3 ou 7 + 3 | ≈ 1096 ou 948 |
| K07 carte 2 (la plus longue) | 152 + 68 | 72 ou 68 | 8 + 3 ou 7 + 3 | ≈ 1096 ou 948 |

Les deux cartes 2 les plus chargées sont à moins de 25 px de la limite à 72 : le passage à 68 est attendu et normal, pas un échec. La règle compte sur 1022 px, donc le bas du texte reste à 64 px au moins du pied dans tous les cas (le pied commence à y 1182).

## 8. Cas de test (à coder dans le test du gabarit et dans `social-conseil-rendu.ts`)

| # | Cas | Entrée | Attendu (assertions dures) |
|---|---|---|---|
| T1 | Carte la plus longue, carte 2 | K07 carte 2 (152 + 68 car.) | Rendu OK ; `R` ∈ {68, 72} ; `H ≤ 1022` ; bas du texte ≤ y 1118 ; « Cordialement » et le “ ” imbriqués blancs ; les 2 « » lilas `#DDD6FE` ; « À toi de jouer : » lilas |
| T2 | Carte la plus longue, carte 1 | K27 carte 1 (183 car.) | `R` = 72 attendu (tolérance 68) ; 8 à 10 lignes ; surtitre « L’anecdote qui déraille » sur 1 ligne à y 96 ; « » et “ ” de l'anecdote **blancs** |
| T3 | Carte la plus courte, carte 1 | K26 carte 1 (125 car.) | `R` = 72 (jamais au-dessus du max) ; 5 à 7 lignes ; bloc ancré à y 96, bas ≈ 728 ; **aucun recentrage** (le surtitre ne bouge pas) |
| T4 | Carte la plus courte, carte 2 | K27 carte 2 (97 + 88 car.) | `R` = 72 ; 4 à 6 lignes de réplique ; consigne 3 à 5 lignes ; un seul « … » lilas |
| T5 | Deux paires « » | K26 carte 2 | Les 2 paires lilas (« Un week-end… » et « Tu as pu… »), la narration « Puis, plus doucement : » blanche entre les deux |
| T6 | Aucune citation R6 | K27 carte 2 (« Je », « m'a » : déclenchait R6), K22 carte 1 (« tartare… » entre « »), K30 carte 1 (« effectivement » entre « ») | Pas de « suspendu, x de départ 96 pour toutes les lignes, aucun « » lilas en carte 1, un seul « … » lilas en carte 2 |
| T7 | Limite haute | Carte 2 synthétique de 260 car. (35 mots, réplique 180 + consigne 80) | Rendu OK à `R` ∈ {64, 68} ; `H ≤ 1022` |
| T8 | Refus | Carte 2 synthétique de 480 car. | Erreur explicite (nombre de lignes, hauteur, plancher 56), **aucun PNG produit**, aucun texte rogné |
| T9 | Surtitre invalide | 5 mots, ou largeur > 888 px | Erreur de rendu |
| T10 | Pas de formule | Carte 2 sans « À toi de jouer : » | Erreur de rendu |
| T11 | Non-régression | 3 cartes vanne (amorce, chute, décryptage) rendues avant et après | PNG identiques à l'octet ; `jest` existant vert |
| T12 | Pied | Les 10 cartes | « Glisse → » sur les cartes 1 seulement ; monogramme et URL au même pixel que la vanne (y 1182 à 1254) |

Vérifications par pixels (extension de `horsZone` dans `social-conseil-rendu.ts`, « encre » = pixel à plus de 80 de distance RGB du fond, pour voir aussi le lilas sur noir qui échappait au seuil « blanc > 200 ») : **0 pixel d'encre** dans y 0 à 95, dans x 0 à 95, dans x 985 à 1079, et dans la bande **y 1118 à 1181** (écart au pied). Le script sort le corps, le nombre de lignes et la hauteur pour chaque carte, et code 1 si une carte déborde ou si le rendu a échoué. L'ancienne vérification de la marge droite à 48 px devient 96 px.

## 9. Contraste AA (calculé, WCAG 2.2)

| Texte | Fond | Ratio | Seuil | Verdict |
|---|---|---|---|---|
| Situation, `#FFFFFF` 700, 56 à 72 px | `#0D0D0D` | 19,4:1 | 4,5 (3 pour grand texte) | OK |
| Surtitre, `#A78BFA` 800 40 px | `#0D0D0D` | 7,14:1 | 4,5 | OK |
| Réplique et consigne, `#FFFFFF` | `#6D28D9` | 7,10:1 | 4,5 | OK |
| « » et « À toi de jouer : », `#DDD6FE` | `#6D28D9` | 5,11:1 | 4,5 | OK |
| Pied, URL `#B3B3B3` 32 px / blanc sur aplat | `#0D0D0D` / `#6D28D9` | 9,3:1 / 7,10:1 | 4,5 | OK |
| `#A78BFA` | `#6D28D9` | 2,6:1 | 4,5 | **Interdit** |

Tout texte de lecture est à 56 px (20,2 pt) ou plus, la consigne à 44 px (15,9 pt) ou plus, rien sous 14 pt hors pied. Image fixe : pas de variante dark mode (les deux fonds sont déjà sombres). Texte alternatif : carte 1 = « surtitre : situation » ; carte 2 = « réplique consigne » (sans coupe forcée), « » du texte conservés ; **jamais** de « » ajoutés (le `citer()` de la vanne ne s'applique pas).

## 10. Branchement (contrat pour @fullstack)

- **Entrée** : un post `IMAGE_QUI_CLAQUE` Instagram avec `threadParts = [surtitre, carte1, carte2]` (3 parties, jamais ambigu avec les vannes à 2 et les décryptages à 5). `slidesDuPost` appelle une nouvelle `carrouselConseilCartes({ surtitre, situation, replique, consigne })` (distincte de `carrouselConseil`, qui reste le gabarit à 3 slides). À vérifier : `nombreDeSlides`, `texteAlternatifDuPost` et la préparation mensuelle acceptent 3 parties ; sinon marqueur `[format:conseil]` dans `directorNote`, comme `[variante:image]`.
- **Nouveaux composants** dans `cartes-piste-a.tsx` : `ConseilCarte1`, `ConseilCarte2`, `Carte` avec `position="debut"`. Constantes regroupées dans un objet `CONSEIL` : `corpsMax 72`, `corpsPlancher 56`, `pas 4`, `ratioInterligne 1.25`, `ratioConsigne 0.8`, `consignePlancher 40`, `ecartReplique 48`, `surtitre { corps 40, interligne 48, poids 800, marge 32 }`. Toutes les autres valeurs (96, 64, 32, 72, couleurs, polices, `INDICE_SWIPE`) sont des tokens existants.
- **Polices** : aucune nouvelle (Plus Jakarta Sans 700 et 800, Inter 400 et 700, déjà chargées et enregistrées pour la mesure).
- **Données** : `textes-formats-valides.json` inchangé (cartes mot pour mot, `surtitre` séparé). `carteAvecSurtitre` n'est plus utilisée pour le rendu (le préfixe « Technique : » disparaît des images ; le post X garde sa technique en tête de texte). Le script `prepare-social-month.ts` doit écrire `threadParts` à 3 parties pour ces posts.
- **Garde** : une carte qui échoue au §6 fait échouer le post (statut visible), jamais une image rognée publiée. Le déploiement reste gelé : la levée passe par la garde, et l'entrée va dans `REPLIT_ACTIONS.md` (règle Marrant).

## 11. Critères visuels (10 critères Thomas) : état

Aucun rendu du nouveau gabarit n'existe : **aucun critère n'est noté PASS ici**. Seule la carte de contrôle actuelle a été lue (défauts du §1). Par construction, la spec vise : 1 pro, 2 beau (une hiérarchie, pas de décor), 3 marque (noir, aplat, lilas, Plus Jakarta), 4 même identité (cadre, pied et rythme noir puis aplat identiques à la vanne), 5 propre, 6 aligné (colonne unique x 96, aucun suspendu), 7 aéré (64 px mini avant le pied, 400 px libres sous une carte courte), 8 conversion (une seule action : « Glisse → » en carte 1, la consigne en carte 2), 9 hiérarchie (squint : le bloc blanc, la ligne lilas, le pied), 10 accessible (§9). **Audit à faire sur les 10 PNG** (`tests/screenshots` ou `--out`) à 1080 px et en aperçu 390 px, une fois le gabarit codé : lire chaque PNG, ne rien valider sur le code seul.
