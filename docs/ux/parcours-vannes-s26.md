# Parcours et Vannes, spec UX s26 (espace ouvert seulement)

Pour @design (spec visuelle, là où c'est dit) puis @fullstack. Fondé sur `reprise-s26.md` §2, §4, §5, les décisions de `founder-preferences.md` du 14 au 19/11 (non re-questionnables) et le modèle de `rubriques-premium-s26.md`. Le code lu : `parcours/(liste)/page.tsx`, `parcours-content.tsx`, `espace/parcours/parcours-espace.tsx`, `parcours/[slug]/page.tsx` (en-tête seulement), `vannes/page.tsx`, `vannes-list.tsx`.

## 0. Cadre commun
- Pages PUBLIQUES et référencées : PAS d'aperçu verrouillé (le contenu est déjà lisible, c'est l'étape 1 et les 10 vannes qui donnent envie). Le modèle s26 se transpose ainsi : offre claire en haut, contenu réel visible, encarts Premium sobres. Aucune donnée n'est retirée du HTML serveur.
- Règles : `typo.ts` (30/24, 20, 16, 14 ; 600 et 400 ; aucune capitale), titre blanc, un seul aplat violet par écran, grille 12 colonnes (8/4 en hero, 4/4/4 ou 6/6 en liste), aucun vide > 32 px au milieu d'un bloc, aucun texte neuf.
- SEO INTACT, rien ne bouge : H1 et chapô (texte, balise, ordre dans le HTML), `<ul class="sr-only">` des liens parcours, tous les JSON-LD (Breadcrumb, ItemList, FAQ, CollectionPage), slugs, canonical, metadata, textes des FAQ, `/parcours/{slug}` et `/vannes/{slug}`, section « Pourquoi ces vannes sont différentes » (textes, H2, liens), cartes « Explore aussi » et « La suite » (liens). Seuls changent des classes de disposition et la place visuelle des blocs, derrière l'interrupteur.
- Décisions reprises telles quelles : bouton « Tester l'étape 1 de {Parcours}, gratuite » (16/11) ; FAQ prix de /parcours masquée pour l'abonné (14/11) ; une rangée de catégories, « Toutes » active par défaut, 10 vannes gratuites sur 5 catégories au moins (14/11) ; « Toutes » abonné en alternance (16/11) ; FAQ /vannes validée le 15/11, jamais retirée à l'abonné.

## 1. Parcours (`/parcours`)

### 1.1 Constat (code actuel, ouvert)
H1 et chapô centrés dans 768 px ; abonné : colonne 768 px empilée (4 semaines, Ton cap, Tes bonus) puis cartes 2 colonnes ; carte parcours = 9 styles de texte (badge, durée, rythme, XP, titre 24, persona, description, témoignage, « Programme » en capitales) ; un plein par carte pour le visiteur (3 à 5 aplats par écran) ; quiz d'orientation centré 768 px ; FAQ centrée. Prochaine action de l'abonné noyée sous 3 blocs ; pas de vue d'ensemble de la progression.

### 1.2 Visiteur et inscrit gratuit (même rendu ; l'inscrit gratuit perd seulement « Sans compte. », déjà géré)
- Premier écran : 1280 : hero 8/4 : gauche H1 (blanc, aligné à gauche) + chapô existant ; droite : quiz d'orientation compact (texte existant « Quel parcours est fait pour toi ? », 2 questions, réponses en lignes). Sous le hero, début de la grille. 375 : H1, chapô, puis première carte (le quiz passe sous la liste, comme chez l'abonné).
- Prochaine action : UN seul plein, « Tester l'étape 1 de {Parcours}, gratuite » sur la carte du parcours conseillé (résultat du quiz, sinon `PARCOURS_PAR_DEFAUT`) ; les autres cartes en contour (même libellé). Remplace l'exception s21 « un plein par carte ». L'offre reste le bouton standard « Premium · prix » de l'en-tête (non dupliqué dans la page ; un plein de page + le bouton d'en-tête : [À VÉRIFIER @design : aucun double aplat visible au même écran, sinon le bouton d'en-tête passe en contour sur cette page]).
- Cartes : lg 6/6 ; nombre impair : la dernière carte pleine largeur en 7/5 (description et bouton à gauche, « Programme » ouvert à droite) au lieu de la carte centrée de 50 % ; 768 : 2 colonnes ; 375 : 1 colonne. Carte réduite à 4 niveaux : titre (24), persona (16/400), description (16/400), méta en ligne unique (14/400 : difficulté · durée · rythme · XP) ; le témoignage reste, en 14/400 italique sans fond (pas de nouvelle taille) ; « Programme » en 14/600 sans capitale, même mot. Badge de difficulté sans capitale ni fond plein.
- « Explore aussi » en 4/4/4 (visiteur) et FAQ en 4/8 (titre à gauche, accordéon à droite) : [STRUCTURE].
- Encarts Premium : étapes 2+ dans « Programme » avec cadenas discret (composant `TuileFermee`/`BadgePremium` existants), l'étape 1 marquée par `ETAPE_LIBRE_BADGE`. Aucun mur, aucun texte neuf.
- États vides : aucun parcours publié = impossible (liste = `PREMIUM_PARCOURS`) ; progression en échec (`/api/parcours`) = liste telle quelle (existant).

### 1.3 Abonné
- Premier écran 1280 : H1 « Parcours » (blanc, à gauche) ; colonne gauche 8 : « étape à reprendre » (QuatreSemaines) = LE plein (bouton existant, `pleinUnique`), puis la liste des parcours ; colonne droite 4 (sticky) : `TonCap` puis `TesBonus`. Plus aucune colonne centrée de 768 px.
- Progression visible : barre `ProgressBar` « n/total étapes » en tête de chaque carte commencée (existant, déplacée au-dessus du titre) ; cap et série dans le rail. Parcours terminé : badge `LISTE_PARCOURS.termine` + bouton `revoir` en contour.
- Cartes : 6/6 dans la colonne de 8 ? Non : liste en 1 colonne dans les 8 colonnes, carte en 2 zones internes 7/5 (infos / progression + « Programme ») ; 768 : 1 colonne, rail sous l'étape à reprendre ; 375 : étape à reprendre, TonCap (compact), cartes, TesBonus, quiz.
- Boutons des autres cartes : contour. Quiz d'orientation sous la liste (existant), FAQ prix masquée (14/11), reste de la FAQ en 4/8.
- États : chargement des caps = calendrier seul (`aria-busy`, existant) ; erreur = calendrier seul ; aucun parcours entamé = étape conseillée par défaut (existant) ; retour après 30 jours = « étape à reprendre » identique.
- STRUCTURE CHANGE (rail 8/4, cartes 7/5) => spec @design.

### 1.4 Page d'un parcours (`/parcours/{slug}`)
[À VÉRIFIER @fullstack : lire `parcours-detail.tsx` et `step-blocks.tsx` avant d'écrire ; ce qui suit est la cible, pas un constat.]
- Visiteur : étape 1 complète en 8 colonnes, rail droit 4 (sommaire des étapes, étapes 2+ avec cadenas, bouton d'offre standard unique plein en haut du rail) ; 375 : sommaire replié en tête, étape 1, puis offre. Aperçu des étapes 2+ inchangé (décision 03/10).
- Abonné : même grille, rail = sommaire avec progression (« Fait », étape courante en `TEXTE_FORT` + filet violet 2 px, pas d'aplat) ; plein = « Continuer » de l'étape à faire ; toutes les étapes ouvertes (18/10).
- SEO : H1, fil d'Ariane (gardé sur pages de détail), Course JSON-LD, contenu SSR de l'étape 1 : inchangés.

## 2. Vannes (`/vannes`)

### 2.1 Constat
En-tête centré 768 px ; rangée de catégories (`RangeeDefilante`, une seule, conforme au 14/11) ; cartes 2 colonnes ; mur Premium centré ; FAQ et bloc SEO centrés dans `max-w-3xl` ; texte « Pourquoi ça marche » en capitales ; pas de progression (page de référence, comme Bibliothèque).

### 2.2 Visiteur et inscrit gratuit
- Premier écran 1280 : hero 8/4 : gauche H1 (blanc, à gauche) + chapô existant ; droite : bouton d'offre standard « Premium · prix » dans une carte sobre (aucun texte neuf, éléments existants seulement) ; sous le hero la rangée de catégories (« Toutes » active), puis les 3 premières cartes. 375 : H1, chapô, rangée (défilement horizontal, 44 px), 1re carte entière avant y = 812 ; bouton d'offre = celui de l'en-tête.
- Prochaine action : toucher la première vanne pour révéler la chute (geste existant, aucun plein). L'unique aplat violet = le bouton d'offre.
- Liste : lg 4/4/4 (au lieu de 2 colonnes), 768 : 2 colonnes, 375 : 1. La dernière carte seule garde la règle « prend la rangée ». Les 10 gratuites couvrent ≥ 5 catégories (14/11), vérifiées sur « Toutes » ; filtre actif = les gratuites de la catégorie.
- Encarts Premium : le mur de fin de liste (`MurListe`) en pleine largeur, contenu 8/4 aligné à gauche (texte et bouton existants, un seul plein) ; plus de centrage. Aucune carte floutée (déjà retirée).
- Bas de page : bloc « Pourquoi ces vannes sont différentes » en 3 colonnes dès lg (un paragraphe par colonne, liens inchangés), FAQ en 4/8, « La suite » en 4/4/4 (déjà). [STRUCTURE] pour FAQ et bloc SEO.
- États : filtre sans résultat = `EmptyState` existant ; erreur = `ErrorState` existant ; chargement = squelette existant (3 colonnes à lg) ; connexion lente = repli sur la liste serveur (existant).

### 2.3 Abonné
- Premier écran : même hero mais la carte d'offre est retirée (pas de prix pour lui) : H1 + chapô sur 8 colonnes, droite 4 = rien d'ajouté (le chapô de l'abonné est déjà court) : le hero se réduit alors à une ligne, rangée de catégories collée dessous. [À VÉRIFIER @design : pas de vide à droite > 32 px ; sinon H1 et chapô sur 12 colonnes à gauche, sans colonne vide.]
- « Toutes » = alternance entre groupes (16/11) : critère §3.4. Prochaine action : première chute à révéler ; aucun plein (aucun aplat requis : page de référence). Pagination `ListPagination` conservée (liens `?page=N`).
- Progression : aucune donnée de progression n'existe pour les vannes [rien d'inventé] ; seul repère : favoris existants (`FavoriteButton`). Pas de compteur.
- États : retour après 30 jours = « Toutes » active ; filtre perdu au rechargement = acceptable (état local, existant).

### 2.4 Textes et capitales à corriger (mêmes mots)
« Pourquoi ça marche : … » (capitales) et « Programme » (capitales) passent en casse normale, 14/600. Aucun autre texte ne change.

## 3. Critères chiffrables (gate mesurée `tailles-comptes.mjs` + relecture à l'aveugle)
1. 4 comptes, 375 et 1280, premier écran : ≤ 4 tailles, ≤ 6 combinaisons, 1 seul aplat violet, 0 capitale, aucun vide > 32 px au milieu d'un bloc.
2. 1280 : aucun bloc centré seul ; contenu ≥ 1100 px de large ; Parcours abonné 8/4, Parcours cartes 6/6 (ou 7/5 pour la dernière), Vannes 4/4/4, FAQ 4/8.
3. Parcours visiteur : exactement 1 bouton « Tester l'étape 1 … » plein par écran, les autres en contour ; abonné : 1 plein (étape à reprendre) ; barre `n/total` présente sur toute carte commencée.
4. Vannes : visiteur, 10 vannes gratuites sur ≥ 5 catégories distinctes ; abonné « Toutes », les 12 premières vannes comptent ≥ 5 catégories distinctes et jamais 2 de la même catégorie consécutives (alternance).
5. SEO : diff du HTML serveur visiteur (fermé contre ouvert) limité aux attributs `class` ; H1, chapô, FAQ, JSON-LD, hrefs : 0 octet de différence ; Jest d'inertie 47/47 sans mise à jour ; régime fermé identique.
6. Cibles ≥ 44 px, focus visible, rangée de catégories au clavier, WCAG 2.2 AA ; 375 : aucun défilement horizontal hors rangée.
7. Premier écran 375x812 : Parcours, H1 + chapô + début de la 1re carte ; Vannes, H1 + rangée + 1re vanne entière.
8. HEART : Task success = clic « Tester l'étape 1 » / visiteurs ≥ [HYPOTHÈSE : base à relever dans Umami, événement existant des cartes] ; Adoption = abonnés qui reprennent une étape depuis /parcours ≥ 60 % ; mesure Umami (`orientation-resultat`, boutons de carte, `mur-vu` vannes).

## 4. Structure changée ?
| Page | Visiteur | Abonné |
|---|---|---|
| Parcours liste | OUI (hero 8/4, 7/5 dernière carte, FAQ 4/8) => @design | OUI (rail 8/4) => @design |
| Page d'un parcours | OUI (rail sommaire) => @design | OUI => @design |
| Vannes | OUI (hero 8/4, mur 8/4, FAQ 4/8, SEO 3 col) => @design | NON (grille 4/4/4 par classes) => @fullstack |

## 5. [TEXTE À VALIDER]
Aucun indispensable : tout est repris des textes existants et validés. Optionnel seulement si Thomas veut un repère sur le parcours conseillé après le quiz (visiteur) : proposition « Pour toi ».

Handoff -> @design : spec visuelle Parcours (liste et détail, visiteur et abonné) et hero, mur, FAQ de Vannes visiteur, grilles et rails fixés ici.
Handoff -> @fullstack : Vannes abonné (§2.3, 4/4/4, capitales) tout de suite ; le reste après @design ; SEO intact (critère 5).
Handoff -> @orchestrator : arbitrages à soumettre à Thomas : un seul plein par écran sur /parcours visiteur (remplace un plein par carte), aucun aperçu verrouillé sur ces deux pages publiques.
