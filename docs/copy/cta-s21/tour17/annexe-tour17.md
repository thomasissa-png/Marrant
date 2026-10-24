# Annexe tour 17 : chaînes changées par rapport au tour 16 (pour @fullstack)

> Périmètre : B3, B10 et B12 seulement. Les 14 autres blocs sont identiques au tour 16 (`tour16/textes-finaux.md`) et n'ont aucune chaîne à retoucher. Texte complet de référence : `tour17/textes-finaux.md`. Statut : à brancher après la relecture à l'aveugle du tour 17 (règle d'or P0 s18). Zéro tiret cadratin. Aucune de ces chaînes n'existe encore dans `src/` (grep fait le 18/10/2026 sur les anciennes formes : aucun résultat hors `docs/`).

Comptes de caractères : faits par recherche à motif de longueur exacte sur les fichiers (espaces compris, guillemets et apostrophes pour un), l'outil ayant été calibré sur la note du tour 16 (187 caractères confirmés).

## 1. B3 `[S20]` (note sous le lien de l'accueil)

Une seule chaîne change. Le bouton `[S19]` et le lien `OUVRIR_ACCUEIL` ne changent pas.

- **Avant (tour 16, 187 car.)** : `Sans compte : l'étape 1 du parcours Répartie (défi, 5 vannes, 2 vidéos, quiz). Les 3 suivantes, dont « Retourner les piques avec le sourire », c'est Premium, résiliable depuis ton profil.`
- **Après (tour 17, 196 car.)** : `Sans compte : l'étape 1 du parcours Répartie (conseil, défi, 5 vannes, 2 vidéos, quiz). Les 3 suivantes, dont « Retourner les piques avec le sourire », c'est Premium, résiliable depuis ton profil.`
- **Différence** : insertion de `conseil, ` (9 caractères) dans la parenthèse. « du parcours » est gardé.
- **Limite** : passe de 190 à **200** (décision de l'orchestrateur). Marge de 4 caractères : ne pas rallonger. **À vérifier : hauteur de la note à 360 px** (neuf caractères de plus qu'au tour 16).
- **Variables inchangées** : « 3 » = étapes de Répartie moins 1 ; titre « Retourner les piques avec le sourire » lu dans `moduleTitle` (Répartie, module 3).
- **Vérité** : l'étape 1 de chaque parcours a le format « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz ».

## 2. B10 `[S15]` (texte sous le titre de la fiche vidéo)

Une seule chaîne change. `[S14]`, bouton plein, `[S16]` (LP-A2), `[S25]` et lien discret ne changent pas.

- **Avant (tour 16, 351 car.)** : `Et ça s'entraîne, à petites doses. Les points clés de cette vidéo et son exercice sont dans Premium, l'abonnement du site : de quoi la revoir pour faire rire, plus seulement pour rire. Avec le même abonnement, tes favoris te gardent cette vidéo sous la main, et les 5 parcours sont ouverts en entier : 15 à 20 minutes par étape, un défi à chaque fois.`
- **Après (tour 17, 321 car.)** : `Et ça s'entraîne, à petites doses. Revois cette vidéo pour faire rire, plus seulement pour rire : ses points clés et son exercice sont dans Premium, l'abonnement du site. Tu la gardes aussi en favori, et les 5 parcours, de la coloc à l'afterwork, sont ouverts en entier : 15 à 20 minutes par étape, un défi à chaque fois.`
- **Différences** : (a) la phrase qui donne envie (« Revois cette vidéo pour faire rire, plus seulement pour rire ») passe avant la mention de Premium ; (b) « Avec le même abonnement, tes favoris te gardent cette vidéo sous la main » devient « Tu la gardes aussi en favori » ; (c) « abonnement » n'apparaît plus qu'une fois ; (d) ajout de « , de la coloc à l'afterwork, » après « les 5 parcours » ; (e) la fin « 15 à 20 minutes par étape, un défi à chaque fois » est inchangée.
- **Variables** : « 5 » = `{PARCOURS_COUNT}` ; « 15 à 20 » = min et max de `{D}`. Le groupe « , de la coloc à l'afterwork, » suit la condition de `OUVRIR_ACCUEIL` (5 parcours publiés, dont Répartie et Machine à Café) ; sinon, le retirer seul (le reste de la phrase reste vrai).
- **Rendu** : une seule `<p>`, plus courte que celle du tour 16 (30 caractères de moins).

## 3. B12 (ligne Premium, deux phrases de profil)

Seules deux `{PHRASE_PROFIL}` changent dans la table. La phrase d'étape 1, le bouton, le lien, `{LP_B12_A}` / `{LP_B12_M}` et `{GARANTIE_B12}` ne changent pas. Observateur, Storyteller et Taquin : inchangés.

### 3a. `PUNCHLINEUR` (Répartie, module 2)

- **Avant** : `Les silences que tu sais utiliser ont leur étape : « {ETAPE_PROFIL} », la {RANG} de Répartie.`
- **Après** : `La seconde où la table se tait avant de rire a son étape : « {ETAPE_PROFIL} », la {RANG} de Répartie.`
- **Rendu rempli** : `La seconde où la table se tait avant de rire a son étape : « Le rythme et les silences », la 2e de Répartie.`
- **Source du début** : description publique du profil (« la table se tait une seconde avant de rire »). Si elle change, relire.

### 3b. `ABSURDE` (Machine à Café, module 2)

- **Avant** : `Les autres ne savent jamais où vont tes idées, encore faut-il les placer : « {ETAPE_PROFIL} », la {RANG} de Machine à Café, t'apprend à repérer où il y a de la place pour elles.`
- **Après** : `Tes idées, personne ne les voit venir. Le moment de les lancer a son étape : « {ETAPE_PROFIL} », la {RANG} de Machine à Café, où tu écoutes un groupe comme un morceau pour repérer où il y a de la place pour toi.`
- **Rendu rempli** : `Tes idées, personne ne les voit venir. Le moment de les lancer a son étape : « Sentir le bon moment », la 2e de Machine à Café, où tu écoutes un groupe comme un morceau pour repérer où il y a de la place pour toi.`
- **Vérification faite** (demandée avant intégration) : dans `docs/content/parcours-reecriture-s17.json` (et `parcours-seed.json`), module 2 de Machine à Café, `moduleTitle` = « Sentir le bon moment », `moduleDetail` = « Écouter un groupe comme on écoute un morceau : où ça monte, où ça retombe, où il y a de la place pour toi. C'est ce que tu t'entraînes à faire ici. Tu arrêtes de te demander si tu es assez drôle, tu te demandes seulement si c'est le bon moment. … ». La fin « où tu écoutes un groupe comme un morceau pour repérer où il y a de la place pour toi » est donc exacte (« C'est ce que tu t'entraînes à faire ici ») : **elle est gardée**.
- **Repli** : si le texte de l'étape 2 change, retirer la fin seule (`, où tu écoutes … pour toi`) ; il reste `Tes idées, personne ne les voit venir. Le moment de les lancer a son étape : « Sentir le bon moment », la 2e de Machine à Café.`, qui est vraie.
- **Le début** reprend la description du profil (« Tu relies des idées que personne n'aurait mises dans la même phrase », « Les autres ne savent jamais où tu vas »). Si elle change, relire.

## 4. Grep de contrôle après branchement

À ne plus trouver dans `src/` : `du parcours Répartie (défi,` ; `Les silences que tu sais utiliser` ; `Les autres ne savent jamais où vont tes idées` ; `encore faut-il les placer` ; `où il y a de la place pour elles` ; `Avec le même abonnement, tes favoris te gardent cette vidéo sous la main` ; `l'abonnement du site : de quoi la revoir pour faire rire`.

Attention : `pour repérer où il y a de la place pour toi` était dans la liste des chaînes interdites du tour 16 et **est retiré de cette liste**, parce que la nouvelle fin de L'Absurde la contient.

À trouver une fois dans `src/` après branchement : `La seconde où la table se tait avant de rire a son étape` ; `Tes idées, personne ne les voit venir` ; `(conseil, défi, 5 vannes, 2 vidéos, quiz)` ; `Revois cette vidéo pour faire rire, plus seulement pour rire` ; `Tu la gardes aussi en favori`.

## 5. Ce qui n'a pas changé

B1, B2, B4+B5, B6, B7, B8, B9, B11, B13, B14, B15, B16, B17, B18 ; en B3 : bouton, lien `OUVRIR_ACCUEIL`, titre d'accueil ; en B10 : `[S14]`, bouton plein, `[S16]`, `[S25]`, lien discret ; en B12 : phrase d'étape 1, bouton, lien, phrases de profil de l'Observateur, du Storyteller et du Taquin, lignes de prix et de garantie. Constantes `OUVRIR`, `OUVRIR_ACCUEIL`, `OUVRIR_P` : inchangées.
