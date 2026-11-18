# Favoris et Carnet s26 (spec @ux courte)

Pour @design (Carnet abonné et Favoris abonné changent de structure) puis @fullstack. Espace ouvert seulement (`ESPACE_CLIENT_PUBLIE = true`). Fermé : rien ne change (inertie 47/47).
Retour de Thomas 18/11 : « Favoris pas au niveau visuellement, pas sûr pour Carnet ». Modèle à reprendre : `apercu-verrouille.tsx` (hero 8/4 offre en haut) et grilles 12 col de Quoi répondre, Bibliothèque, S'entraîner (`docs/ux/rubriques-premium-s26.md`).
Règles communes : `typo.ts` (30/24, 20, 16, 14 ; 600 et 400 ; aucune capitale), un seul aplat violet par écran, aucun vide > 32 px au milieu d'un bloc, aucun texte neuf, zéro tiret cadratin, cibles >= 44 px.

## 1. Favoris (`/favoris`)

### 1.1 Constat (captures s25 v6 tour 3, visiteur 1280)
- Colonne centrée `max-w-3xl` : titre et sous-titre centrés, deux cartes côte à côte de hauteurs très différentes (vanne 170 px, conseil 1 080 px avec « Exemple » déroulé), puis une carte d'offre seule en bas (bouton y = 1 410). Rien ne dit « fermé », l'offre est sous le pli, 3 aplats/filets violets, capitales dans « Exemple », badges colorés.
- Abonné : titre centré (`ContenuFavoris centre`), onglets en boutons dont l'actif est un APLAT violet plein (`variant="primary"`) et pastilles chiffrées, cartes à badges, emojis dans l'état vide, vidéo qui lit pleine largeur. Aucune prochaine action, aucune structure.

### 1.2 Décision : l'aperçu reste « deux contenus réels en lecture seule » (décision du 15/11), mais dans le squelette `ApercuVerrouille`
- Pas de passage au modèle « tout verrouillé » : pour Favoris, la preuve qui donne envie est de voir un vrai favori (ce que l'abonné garde), pas des barres. Donc on ne contredit pas Thomas. On change le CONTENANT : hero 8/4 avec offre en haut, extrait en largeur, fondu et fin d'extrait comme les 3 autres pages.
- PROMESSE : emplacement @copywriter (3 propositions, ton `docs/copy/ton-alex.md`, choix de Thomas) [TEXTE À VALIDER : promesse. Proposition : « Garde la vanne qui t'a sauvé, retrouve-la le jour J. »]. Sous-titre actuel « Voici un exemple de cette rubrique… » retiré au profit de la promesse (déjà validé : texte existant, remplacé seulement).
- Pastilles du hero : les 4 onglets réels `Tout, Vannes, Conseils, Vidéos` (`TABS[].label`), inertes, avec verrou comme les autres rubriques (aucun effectif inventé).
- Extrait, rangée 1 entière (grille `lg:grid-cols-12`) : vanne `lg:col-span-5`, conseil `lg:col-span-7`, mêmes cartes que la vue abonné (mêmes composants, lecture seule : pas de « Retirer », pas de « Partager »). Le conseil est montré REPLIÉ (titre + 2 lignes `line-clamp-2`, comme chez l'abonné) : plus de bloc « Exemple » (supprime 800 px). La vanne montre sa chute (c'est le plaisir). Étiquettes « Vanne », « Conseil » + 1 catégorie en `META`, texte pas de capitales, un seul gris.
- Rangée 2 sous le fondu (`SuiteCoupee`) : 1 tuile `TuileFermee` pleine largeur « une vidéo » avec le libellé `TEXTES_APERCU` existant des types (« Vidéo ») + verrou + barres ; aucun texte neuf.
- Si `favoris === null` (catalogue vide) : l'extrait devient 2 `TuileFermee` 6/6 ; jamais de colonne vide.
- Largeur : 375 : hero (titre, promesse, bouton d'offre y < 700, pastilles), vanne, conseil, fondu dans la tuile conseil ; 768 : hero 3/2, vanne et conseil côte à côte 6/6 (`md:grid-cols-2`), fondu après ; 1280 : hero 8/4, extrait 5/7, rangée 2 sous le fondu.
- Premier écran 1280x900 : hero + vanne + conseil replié ; bouton de fin d'extrait y > 900. Bouton d'offre haut : y < 450 (1280), y < 700 (375). Ajouter `favoris` à `apercu/offre-en-haut.ts`. Aucune donnée d'abonné, aucune écriture.
- Prochaine action du prospect : « s'abonner » (bouton unique = seul aplat violet).

### 1.3 Abonné : STRUCTURE CHANGE (=> spec @design)
- Titre aligné à gauche (en-tête de la coque), plus de colonne centrée. Grille 12 col : 1280 : rail 3 col sticky (onglets verticaux Tout, Vannes, Conseils, Vidéos avec effectif en `META`, actif = filet violet 2 px à gauche et `TEXTE_FORT`, PAS d'aplat) + liste 9 col. 768 : rangée d'onglets en haut (`RangeeOnglets`, onglet actif souligné, pas plein) puis liste 2 col. 375 : onglets en défilement, liste 1 col.
- Cartes : même gabarit pour vanne et conseil (titre ou texte en 16, catégorie en 14 gris, actions « Partager » et « Retirer » en liens gris 44 px, jamais en boutons pleins). Plus de badges colorés (un seul style, le filet violet de la carte retiré comme `CADRE_CARTE_RUBRIQUE` neutre). 1280 : cartes courtes 2 colonnes dans les 9 (6/6), vidéo pleine largeur de la liste, vignette 5 col + texte 7 col.
- Prochaine action évidente : la carte la plus récemment ajoutée en tête, dépliée (chute visible, `ReactionButtons` seuls actifs) ; pas de bouton plein. Progression : l'effectif par onglet (« Vannes 12 »). Envie de continuer : le lien existant `ctaHref` de l'état vide reste le seul bouton plein et seulement à vide.
- États vides : par onglet, 1 phrase existante (`emptyTitle`, `emptyDesc`) + un lien `ctaLabel` plein (seul aplat) vers `/vannes`, `/conseils`, `/videos` ; retirer les emojis (rupture avec l'échelle) [TEXTE À VALIDER : aucun texte neuf, seulement retrait des emojis, @design remplace par l'icône étoile de la bande]. Chargement : 3 squelettes dans la grille. Non connecté et ancien abonné : mur existant (`!estPremium`) conservé, réaligné sur la grille.
- Critères : 1280 liste dans 9 col, aucune colonne centrée seule ; 1 aplat violet max (état vide) ; <= 4 tailles et <= 6 combinaisons au premier écran ; onglets focus visible, clavier flèches.

## 2. Carnet (`/carnet`, `/carnet/<mois>`, public)

### 2.1 Constat (capture visiteur 1280, `carnet-page.tsx`)
- Tout dans `max-w-3xl` centré (688 px sur 1280) : 45 % de l'écran vide, pas de largeur utilisée.
- Hiérarchie inversée pour le prospect : la fiche offerte (650 px, 5 blocs de texte gris) occupe tout le premier écran, l'OFFRE n'apparaît qu'à y = 960 (bouton y = 1 060) ; rien en haut. Contraire à la décision du 16/11 (offre en haut).
- Kicker en capitales (« CARNET DE NOVEMBRE 2026 · 30 SITUATIONS », « SITUATION 10 · OFFERTE ») = hors échelle ; deux cartes à filet violet + un bouton plein + kicker violet : trop de violet.
- « Au programme » : 3 titres verrouillés en lignes pleine largeur (3 x 90 px), vides à droite, puis « Et 26 autres répliques » en petit gris : le carnet de 30 situations paraît maigre.
- Abonné (`sommaire`) : sommaire de 30 liens soulignés en 2 colonnes sans contexte ni hiérarchie (liste plate), puis 30 fiches l'une sous l'autre, sans repère de position ni progression ; « Retour au sommaire » (décision du 16/11) isolé à droite.

### 2.2 Visiteur : structure cible (grille 12 col, offre en haut)
- Hero 8/4 (modèle `HeroApercu`, composant réutilisé ou variante) : gauche = titre « Carnet de novembre » (30/24, blanc), intro existante, bouton plein `CARNET_PAYWALL.bouton` (= l'unique aplat), réassurance existante dessous ; droite (4 col) = tuile « au programme » : 3 titres de `view.apercus` + `CARNET_PAYWALL.listeReste(n)` en pied, chaque ligne avec verrou, sticky à 1280. Le kicker (mois, nombre de situations) passe en 14 normal, sans capitales : « Carnet de novembre 2026, 30 situations ».
- Dessous, fiche offerte en 8 col (pas de filet violet, étiquette « Situation 10, offerte » en 14 gris sans capitales). Dans la fiche à 1280 : colonne gauche = contexte + « On te dit » + « Tu réponds » (le coeur), colonne droite = « Pourquoi ça marche », « Si ça se tend », « À toi de jouer ». Fin de fiche : bloc d'appel existant `CarnetPaywall` (même bouton, texte existant) = fin d'extrait, sous y = 900 (1280).
- 768 : hero 3/2 (bouton + programme à droite), fiche pleine largeur en 2 col. 375 : titre, intro, bouton y < 700, tuile programme (3 titres), fiche (1 col dans l'ordre contexte, on te dit, tu réponds, pourquoi), bloc d'appel.
- Premier écran 1280x900 : hero avec bouton et programme visibles, début de la fiche (« On te dit » visible). Jamais deux boutons pleins ensemble.
- Verrouillage inchangé : seuls `ficheOfferte` et les titres/contextes des autres sont dans les props (test Jest existant à conserver).

### 2.3 Abonné : structure cible (STRUCTURE CHANGE => spec @design)
- En-tête aligné à gauche, kicker sans capitales, pas de bouton plein, aucun aplat violet requis (lieu de référence, comme Bibliothèque).
- Sommaire en TUILES (pas liste de liens) : 1280 : 3 colonnes (4/4/4) de tuiles cliquables 44 px mini : numéro (14 gris), titre (16, 600), contexte (14 gris, ex. « amis ») ; 768 : 2 col ; 375 : 1 col. Ancre `#carnet-sommaire` et ancres `#fiche-<id>` inchangées.
- Fiches : 1280 : rail gauche 3 col sticky (liste compacte numéro + titre, position courante soulignée au scroll), fiche en 9 col, intérieur en 2 col comme 2.2. Sans rail sous 1024 (le sommaire tuiles est en tête). « Retour au sommaire » conservé après chaque fiche (décision du 16/11, cible 44 px), aligné à gauche sous la fiche.
- Prochaine action : la tuile de la première fiche porte un filet violet 2 px (pas un aplat) ; si un suivi de lecture existe [À VÉRIFIER @fullstack : aucune donnée « lu » pour le carnet confirmée, sinon ne pas afficher, jamais simulé] la première fiche non lue prend ce filet. Progression : « n fiches » (le total existant), aucun compteur inventé.
- Carnets précédents : après les fiches, pastilles `chipClass` existantes, en 12 col (pas centrées). États : mois sans carnet (« Le carnet du mois arrive », existant) en tuile pleine largeur alignée à gauche ; mois inconnu 404 ; chargement `loading` squelette de tuiles ; retour après 30 jours : sommaire du mois courant.

## 3. Critères chiffrables (gate mesurée, 4 comptes, 375 et 1280)
1. <= 4 tailles et <= 6 combinaisons au premier écran ; 1 aplat violet (offre pour le prospect ; aucun ou état vide pour l'abonné) ; aucune capitale (kickers, « Exemple », « Pourquoi ça marche » en 16/600) ; aucun vide > 32 px au milieu d'un bloc.
2. Aperçus Favoris et Carnet prospect : bouton d'offre haut y < 450 (1280x900) et < 700 (375x812) ; bouton de fin y > 900 / > 812 ; contenu sur 12 col, jamais une colonne centrée seule à 1280.
3. Favoris prospect : conseil replié, 0 bloc « Exemple » ; hauteur de page 1280 <= 2 000 px (actuel 2 000 avec pied, dont 1 080 pour un seul conseil).
4. Carnet : largeur utile >= 1 100 px à 1280 ; fiche offerte de 8 col ; sommaire abonné en 4/4/4 ; 30 tuiles à >= 44 px ; « Retour au sommaire » après chacune des fiches.
5. Textes : 0 texte neuf hors promesse Favoris ; zéro tiret cadratin ; WCAG 2.2 AA (focus visible, clavier, onglets en flèches).
6. HEART : task success = clic « s'abonner » depuis ces aperçus (source `apercu-favoris`, `carnet`) ; cible : clics d'offre / vues de l'aperçu >= celui d'Aujourd'hui (mesure Umami) ; abonné : fiche ouverte depuis le sommaire >= 60 %.

## 4. Structure changée ?
Favoris aperçu : NON (squelette existant, nouvelles tuiles) => @fullstack. Favoris abonné : OUI (rail 3/9, onglets) => @design. Carnet visiteur : OUI (hero 8/4, offre en haut) => @design. Carnet abonné : OUI (tuiles, rail sticky) => @design.

## 5. [TEXTE À VALIDER]
1. Promesse Favoris (emplacement `PROMESSE`, @copywriter) : proposition « Garde la vanne qui t'a sauvé, retrouve-la le jour J. »
2. Aucun autre texte neuf : tout vient de `TABS`, `CARNET_PAYWALL`, `CARNET_RETOUR_SOMMAIRE`. Seuls retraits : sous-titre « Voici un exemple… » sur Favoris, emojis des états vides.

Handoff -> @design : spec visuelle Carnet (visiteur et abonné) et Favoris abonné, grilles fixées ici.
Handoff -> @fullstack : aperçu Favoris dans `ApercuVerrouille` (+ `offre-en-haut.ts`), après la spec @design pour le reste ; tests de verrouillage Carnet conservés.
Handoff -> @copywriter : promesse Favoris (3 propositions).
