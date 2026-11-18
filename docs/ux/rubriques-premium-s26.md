# Rubriques Premium s26 : Quoi répondre, Bibliothèque, S'entraîner

Spec @ux pour @fullstack (et @design là où c'est dit). Espace ouvert seulement (`ESPACE_CLIENT_PUBLIE = true`). Modèle : `components/espace/apercu/` (Aujourd'hui, validé). Principe de Thomas (16/11) : prospect = super envie ; abonné = clair, prochaine action évidente, progression visible.
Règles communes : échelle `typo.ts` (30/24, 20, 16, 14 ; 600 et 400 ; aucune capitale), un seul aplat violet par écran, aucun vide > 32 px au milieu d'un bloc, aucun texte neuf, zéro tiret cadratin. Aucune donnée d'abonné simulée.

## 0. Squelette commun des trois aperçus
- Composant `ApercuVerrouille` inchangé (hero 8/4 dès 1024, 3/2 à 768, offre en haut, `ExtraitCoupe`, `SuiteCoupee`). Chaque page crée `apercu-<rubrique>.tsx` (comme `tableau-verrouille.tsx`) ; les 3 `page.tsx` rendent ce composant au lieu de `ApercuRubrique` ; ajouter les 3 pages à `apercu/offre-en-haut.ts`. `apercu-rubrique.tsx` n'est supprimé qu'une fois les 3 pages migrées (`mesQuestions`, `mesRepliques`, `favoris` l'utilisent encore).
- Rangée 1 TOUJOURS entière (le contenu qui donne envie), rangée 2 seule sous le fondu (`SuiteCoupee`). Tuiles = `TuileFermee`, grille `grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12`.
- Premier écran, critère commun : 375x812 : hero complet, bouton d'offre haut visible, titre de la première tuile et 2 lignes de son contenu avant y = 760, bouton de fin d'extrait sous y = 812. 1280x900 : hero + rangée 1 visibles, bouton de fin d'extrait à y > 900 (jamais deux boutons pleins ensemble).
- Garantie de verrouillage (les 3) : un composant d'extrait ne reçoit que (a) du texte public par nature (fiche désignée de `exemples.ts`, partie « en clair »), (b) des CLÉS ou des constantes de libellés (jamais le texte verrouillé). Test Jest par page : le HTML rendu et le payload RSC ne contiennent aucune des chaînes verrouillées listées ci-dessous.

## 1. Quoi répondre (`/mon-espace/quoi-repondre`)

### 1.1 Aperçu
- PROMESSE : emplacement @copywriter.
- Pastilles (6, ordre) : `TEXTES_QUOI_REPONDRE.filtreOu`, `.filtrePour` (`config/textes/espace-bibliotheque.ts`) ; `TEXTES_CARTES.registres.sure`, `.joueuse`, `.risquee` (`espace-cartes.ts`) ; `TEXTES_QUOI_REPONDRE.carnet`.
- Rangée 1. Gauche (lg : 7 col) : tuile situation `coloc-la-poele` EN CLAIR : étiquette `TEXTES_FICHE.types.situation`, titre, `scene.texte`, `scene.onTeDit` (la réplique qu'on te lance), puis `RepliquesFermees` (La sûre, La joueuse, La risquée : libellé + verrou + barres). Droite (lg : 5 col) : tuile « filtres fermés » : `filtreOu` avec les 12 lieux de `TEXTES_QUOI_REPONDRE.univers` en pastilles inertes, avec leur effectif (`categoriesQuoiRepondre().nombre`, déjà existant) ; `filtrePour` avec ses 5 valeurs. Montre l'étendue du catalogue sans rien ouvrir.
- Rangée 2 (sous le fondu) : trois tuiles 4/4/4 : « Quand ça tombe à plat » (`pourQuoiFaire["rattraper-faux-pas"]`, avec son effectif), `TEXTES_FICHE.erreur` et `TEXTES_FICHE.commentChoisir` en titres fermés (verrou + barres) ; `carnet` en lien inerte dans la tuile « à plat ».
- VERROUILLÉ, jamais envoyé : `repliques.*.texte`, `repliques.*.pourquoi`, `quandMonterDUnCran.*`, `erreur`, `scene.suite`, `geste.*`. Chaînes de test : « Elle est à moi », « déraciner », « Troc possible », « Nier d'abord », « Jeudi, c'était pâtes ».
- Largeur : 375 : tuile situation, puis filtres (pastilles qui passent à la ligne), fondu au milieu de la tuile filtres ; 768 : situation sur 2 colonnes (pleine largeur), filtres + « à plat » côte à côte ; 1280 : 7/5 puis 4/4/4. Fondu : juste après la rangée 1 (rangée 2 coupée). 1280x900 : visibles = hero, situation avec ses 3 répliques fermées, filtres.

### 1.2 Abonné : STRUCTURE CHANGE (=> spec @design)
- Aujourd'hui : en-tête centré, bouton carnet, filtres repliés, listes par lieu en 2 colonnes. Problème : pas de prochaine action, pas de progression, filtres cachés.
- Prochaine action évidente : en tête, une tuile pleine largeur « première situation sans « Fait » » (même ordre que la liste) : titre de la fiche, durée (`TEXTES_FICHE_LIGNE.minutes`), bouton `TEXTES_FICHE_LIGNE.voir` = l'unique aplat violet de l'écran. Aucun texte neuf (pas d'étiquette). Si tout est « Fait » : la tuile disparaît, l'état vide existant (`vide`, `raconte`) reste réservé au filtre sans résultat.
- Progression visible : à droite du titre de chaque lieu, compteur « faits / total » en `META` (chiffres seuls, même forme que le `(n)` actuel), calculé avec `idsFaits` déjà chargé ; la ligne « Fait » existante est conservée.
- Grille : 1280 : rail gauche 3 col (filtres `filtreOu` et `filtrePour` toujours ouverts, `carnet` en lien secondaire en bas du rail, sticky), liste 9 col, lignes en 2 colonnes. 768 : filtres repliés (`filtrerLesCartes`) pleine largeur, liste 2 colonnes. 375 : tout en 1 colonne, prochaine action d'abord.
- États vides : filtre sans résultat = tuile `vide` + lien `raconte` (existant) ; aucune situation servie = idem ; chargement et erreur : `loading.tsx` et `error.tsx` existants.

## 2. Bibliothèque (`/mon-espace/bibliotheque`)

### 2.1 Aperçu
- PROMESSE : emplacement @copywriter.
- Pastilles (5) : `TEXTES_BIBLIOTHEQUE.blocVannes`, `.themesNom`, `.prefixes.construction`, `.prefixes.vocabulaire`, `.prefixes.formule` (`espace-bibliotheque.ts`). Pas « Humour noir, fait bien » (coin absent : fichier vide, rien d'inventé).
- Rangée 1. Gauche (lg : 7 col) : tuile construction `le-faux-secret` : étiquette `prefixes.construction`, titre « Le faux secret », `TEXTES_FICHE.schema` + `contenu.schemaEnUneLigne` EN CLAIR ; puis `TEXTES_FICHE.exemple`, `.commentCestFait`, `.essais`, `.regle` en 4 blocs fermés (libellé + verrou + barres, même composant que `RepliquesFermees`, à généraliser en `BlocsFermes` avec une liste de libellés). Droite (lg : 5 col) : tuile « catalogue » : `blocVannes`, les 7 `themes` (pastilles inertes), les 3 liens `catalogue` (Vannes, Conseils, Vidéos) en texte inerte.
- Rangée 2 (sous le fondu) : 2 tuiles 6/6 : `prefixes.vocabulaire`, `prefixes.formule`, chacune avec l'effectif réel du fichier (si la lecture est triviale ; sinon libellé seul).
- VERROUILLÉ, jamais envoyé : `exemple`, `commentCestFait`, `essais.*`, `regle`, `erreur`, `geste.*`. Chaînes de test : « je regarde ça », « un peu en retard », « Trop flou », « non mais je rigole ».
- [ARBITRAGE] le schéma en une ligne est montré (c'est l'accroche, l'exemple et la règle restent fermés). Si Thomas juge que c'est donner trop, fermer aussi le schéma : un seul changement dans la config des blocs.
- Largeur : 375 : tuile construction (le schéma doit tenir au premier écran), puis catalogue ; 768 : construction pleine largeur, puis catalogue, rangée 2 en 2 colonnes ; 1280 : 7/5 puis 6/6. Fondu après la rangée 1. 1280x900 : hero, construction avec ses 4 blocs fermés, catalogue visibles.

### 2.2 Abonné : retraitement de classes (=> @fullstack direct, pas de spec @design)
- Aujourd'hui : cartes en colonnes CSS `md:columns-2`. Passage à `lg:columns-3` (12 col en 4/4/4 par blocs : vannes, techniques, coin quand il existe) ; 768 : 2 colonnes ; 375 : 1 colonne. Le titre de page s'aligne à gauche (en-tête de la coque, pas de centrage).
- Prochaine action : dans chaque bloc, la première ligne sans « Fait » prend `TEXTE_FORT` et un filet violet de 2 px à gauche (pas un aplat) ; les lignes « Fait » restent en gris avec leur mot. Aucun bouton plein sur cette page (aucun aplat violet requis ; c'est un lieu de référence).
- Progression : compteur « faits / total » en `META` à droite du titre de chaque bloc (chiffres seuls) ; les bonus des caps 2 à 5 déjà ouverts gardent leur marque existante (`TEXTES_CAPS.bonus.marque`).
- États vides : « Écouter, repérer » sans ligne = le bloc vannes ne montre que ses thèmes et ses liens catalogue (existant) ; coin absent = pas de carte, pas de trou (masonry) ; bloc technique sans ligne visible = omis (existant).

## 3. S'entraîner (`/mon-espace/s-entrainer`)

### 3.1 Aperçu
- PROMESSE : emplacement @copywriter.
- Pastilles (5) : `TEXTES_CARTES.eyebrow` (« Si tu as 5 minutes »), `TEXTES_CARTES.reponseDabord`, `TEXTES_FICHE.ceQuOnAuraitPuDire`, `TEXTES_MISSION.titre`, `TEXTES_MISSION.aPlat` (`espace-cartes.ts`, `espace-bibliotheque.ts`).
- Rangée 1. Gauche (lg : 7 col) : tuile jeu `quelle-replique-1` EN CLAIR : étiquette `eyebrow`, titre « Quelle réplique ? », `contenu.consigne` et les 3 propositions `contenu.matiere` (A, B, C) en lignes inertes ; puis un bloc fermé `TEXTES_FICHE.ceQuOnAuraitPuDire` (libellé + verrou + barres). C'est le « laquelle dis-tu ? » qui fait revenir. Droite (lg : 5 col) : tuile mission : `TEXTES_MISSION.titre`, les 5 marches (`marche(n)` + `titresMarches[n]`, existants) en échelle verticale, la marche 1 marquée ouverte, les autres fermées avec verrou : la progression se voit avant d'entrer.
- Rangée 2 (sous le fondu) : 2 tuiles 6/6 : `TEXTES_MISSION.aPlat` et `TEXTES_MISSION.raconte` en titres fermés.
- VERROUILLÉ, jamais envoyé : `ceQuOnAuraitPuDire` (la lettre juste), `explication`, `geste.*`, énoncés des missions. Chaînes de test : « truqué en toute franchise », « un cran trop bas », « ne relèverait pas son jeu ».
- Largeur : 375 : jeu (consigne et les 3 propositions) puis échelle des marches ; 768 : jeu pleine largeur, mission dessous en 5 puces horizontales ; 1280 : 7/5 puis 6/6. Fondu après la rangée 1. 1280x900 : hero, jeu entier, échelle des 5 marches visibles.

### 3.2 Abonné : STRUCTURE CHANGE (=> spec @design)
- Aujourd'hui : colonne centrée `max-w-3xl` (`COLONNE_ENTRAINEMENT`), cartes puis mission empilées. Retour de Thomas : plus de colonne centrée seule.
- Prochaine action évidente : la première carte de la rafale pas encore traitée est dépliée, en haut à gauche ; son bouton principal existant est l'unique aplat violet. Les autres cartes sont repliées (titre + durée), le bouton de la mission est en contour tant qu'une carte reste à faire. Si la rafale est finie (`T.fini`, existant), le bouton de la mission devient le plein.
- Progression visible (uniquement des données qui existent) : (a) trois segments sans texte, un par carte du jour (`etat.cartes`, au plus 3), pleins = cartes faites [À VÉRIFIER @fullstack : statut de carte lisible dans `lireRafale`, sinon ne pas afficher] ; (b) échelle des 5 marches (`marche(n)`, `titresMarches`), marche en cours = `mission.marche`, marches passées marquées « Fait » (`TEXTES_GESTE.fait`) [À VÉRIFIER : dérivable de `lireRetoursMission`] ; (c) compte à rebours existant inchangé.
- Grille : 1280 : cartes 7 col à gauche, mission + échelle 5 col à droite, sticky ; 768 : 1 colonne, échelle en 5 puces horizontales au-dessus de la mission ; 375 : 1 colonne (carte à faire, puis mission, marches en défilement horizontal interdit : retour à la ligne).
- États vides : `T.fini` + mission toujours visible ; `?marche=n` sans mission : `M.aucuneMission` et lien `voirLaMarche` (existants) ; aucune carte montrable = `T.fini`.

## 4. Critères d'acceptation chiffrables (gate mesurée et relecture à l'aveugle)
1. Aperçus, 4 comptes, 375 et 1280 : <= 4 tailles et <= 6 combinaisons au premier écran ; 1 aplat violet (le bouton d'offre du hero) ; aucun vide > 32 px au milieu d'un bloc ; aucune capitale.
2. Aperçus : le bouton d'offre haut est à y < 700 (375x812) et < 450 (1280x900) ; le bouton de fin est à y > 812 (375) et > 900 (1280) ; deux boutons pleins jamais ensemble au premier écran.
3. Aperçus : à 1280, aucune colonne centrée seule : le contenu occupe 12 colonnes (hero 8/4, rangée 1 en 7/5) ; largeur utile de l'extrait >= 1100 px.
4. Verrouillage : 0 occurrence des chaînes verrouillées de §1.1, §2.1, §3.1 dans le HTML et dans le payload RSC (3 tests Jest, un par page) ; extrait `aria-hidden`, aucun élément focusable, 47/47 de l'inertie intacts.
5. Textes : 100 % des libellés issus des constantes citées ; 0 texte neuf (sauf promesse @copywriter) ; zéro tiret cadratin.
6. Abonné : une seule action pleine par écran (Quoi répondre : « Voir » de la première situation à faire ; S'entraîner : bouton de la première carte à faire) ; un compteur ou une échelle de progression visible au premier écran à 375 et 1280 ; chaque bloc de liste a son compteur.
7. Abonné 1280 : grilles 3/9 (Quoi répondre), 4/4/4 (Bibliothèque), 7/5 (S'entraîner) ; aucun bloc seul dans une colonne centrée ; cibles >= 44 px ; focus visible ; WCAG 2.2 AA.
8. Mesure du diff réel (P0 s11) : lister fichiers touchés, lignes ajoutées et retirées par page dans le rapport @fullstack.

## 5. Structure changée ? (qui fait quoi)
- Aperçus des 3 pages : nouveau contenu dans le squelette existant, pas de structure nouvelle => @fullstack direct. Seul ajout : `BlocsFermes` (généralisation de `RepliquesFermees`).
- Abonné : Quoi répondre OUI (rail de filtres + tuile prochaine action) => @design ; S'entraîner OUI (7/5 + cartes repliées) => @design ; Bibliothèque NON (classes) => @fullstack direct.

## 6. [TEXTE À VALIDER]
Aucun texte neuf indispensable : tout est repris des constantes. Hors périmètre : les 3 promesses (@copywriter) et, déjà en attente depuis s25, « La suite est dans Premium » et la phrase lue seulement (`TEXTES_APERCU_VERROUILLE.suite`, `.lecteurEcran`).
Optionnel, seulement si Thomas veut un repère de texte sur la prochaine action abonné (Quoi répondre) : proposition « À faire maintenant ».

Handoff -> @fullstack : aperçus des 3 pages (§1.1, §2.1, §3.1) et abonné Bibliothèque (§2.2) tout de suite, avec les tests de verrouillage.
Handoff -> @design : spec visuelle de l'abonné Quoi répondre (§1.2) et S'entraîner (§3.2), structure et grilles fixées ici.
Handoff -> @copywriter : 3 promesses (emplacement `PROMESSE`), ton `docs/copy/ton-alex.md`.
