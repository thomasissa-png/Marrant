# Corrections cycle 8 (@design, 07/10/2026) : K3 Visuels et K4 Formats

Réponse aux 10 points « Pour 10/10 » de `notation-relance-cycle8-design.md` §5. Tout ce qui est doc ou spec est ici. Le code (`apps/web/**`) n'est pas touché. Plans (`strategie-relance-v5.md`, `plan-execution-s15.md`) et mesure (`mesure.md`, `releves/`) non modifiés : les textes de correction sont fournis en §4, à coller par la session.

**Limites de cet environnement** : Read, Glob, Write, Edit, WebSearch. Pas de shell : `git pull --no-rebase` non exécuté (à faire par la session avant le commit de ce fichier), aucun rendu PNG, aucune mesure de pixels. Toute cote d'écran ci-dessous est calculée sur les formules du code lu (`carte-marque.tsx`, `cartes-piste-a.tsx`, `mise-en-lignes.ts`) et marquée `[À MESURER au rendu]` quand elle dépend des glyphes.

## 0. Garde de déploiement : état réel au 07/10 (à corriger dans le README des routines)

| Constat | Preuve |
|---|---|
| s16 **est déployé** (`d7fd90b2` 14:31, puis `712ee919`). La « Garde de déploiement » du README cite encore s16 : elle est périmée sur ce point. | `REPLIT_ACTIONS.md` l.60-66 ; `routines/README.md` l.33 |
| **Mais un lot s17 est sur la même branche, NON DÉPLOYÉ**, avec un bloquant : la migration Neon `13_parcours_s17` doit être jouée et vérifiée (`1 \| 3 \| 2`) AVANT tout déploiement, sinon connexion, compte et paiement tombent. Mise en ligne sur feu vert de Thomas en une ligne, après 10/10 @design et @ux. | `REPLIT_ACTIONS.md` l.11-50 ; `founder-preferences.md` l.75 |
| Donc **le gel tient toujours** : un déploiement « OG seul » emporterait le code s17 sans sa migration. | idem |

**Conséquence pour l'OG** : on implémente et on teste en local (tsc, lint, build, Jest), on commite, et la mise en ligne part **avec** le lot s17 (migration 13 d'abord). **Butoir : commit avant le déploiement du 10/10**. Sinon le relais X du 12/10 10:30Z (article `se-presenter-avec-humour`) et le post quiz du 14/10 07:00Z partent avec l'ancien gabarit : X met la carte en cache au premier partage et ne la purge pas.

## 1. Open Graph : spec d'implémentation pour @fullstack (K3, point 5)

### 1.1 Constat, vérifié sur les 4 fichiers

`apps/web/src/app/opengraph-image.tsx` (accueil), `(dashboard)/quiz-humour/opengraph-image.tsx`, `(dashboard)/blog/[slug]/opengraph-image.tsx`, `(dashboard)/vannes/[slug]/opengraph-image.tsx` : tous en `linear-gradient(135deg, #0D0D0D, #1a1a2e, #16213e)`, marque en texte dégradé `#8B5CF6` vers `#EC4899`, `fontFamily: "sans-serif"` sans aucun `fonts` passé à `ImageResponse` (donc police par défaut de `next/og`, poids 800 non fourni), libellés de 14 à 24 px. Hors système, et c'est l'unique visuel de 3 posts X sur 5.

### 1.2 Tokens (tous déjà dans le code, rien de nouveau)

| Token | Valeur | Source | Contraste sur `#0D0D0D` |
|---|---|---|---|
| fond | `#0D0D0D` aplat, aucun dégradé | `COLORS.bg` | |
| texte principal | `#FFFFFF` | `COLORS.textPrimary` | 19,4:1 |
| accent (nombre du titre, chute, étiquette) | `#A78BFA` | `COLORS.accentHover` = `COULEUR_GUILLEMETS.sombre` | 7,1:1 |
| pied (URL), sous-ligne | `#B3B3B3` ; sous-ligne du quiz et de l'accueil `#D4D4D4` (comme la bannière X) | `COLORS.textSecondary` | 9,3:1 ; 13,1:1 |
| monogramme « d » | fond `#1F1F1F`, lettre `#8B5CF6` | `Monogramme` | décoratif |
| interdits | `#1a1a2e`, `#16213e`, `#EC4899`, `linear-gradient`, `backgroundClip`, emojis, carrés arrondis autour d'une icône, « → » | `cartes-piste-a.test.tsx` l.175, DA anti-look IA | |

### 1.3 Polices : fichiers existants, vérifiés (Glob)

`apps/web/public/fonts/` contient **déjà** `PlusJakartaSans-ExtraBold.ttf` (800), `PlusJakartaSans-Bold.ttf` (700), `Inter-Regular.ttf` (400), `Inter-Bold.ttf` (700), `Inter-ExtraBold.ttf`, plus des `.woff2` **inutilisables** (satori ne lit pas le woff2). Aucun téléchargement, aucune dépendance Google Fonts : le chargeur de `image-generator.ts` (`loadFonts`) sait déjà lire le TTF par `fs` (build, Node), puis par le binding `ASSETS` (Workers), puis en repli CDN. C'est le chemin prouvé en prod pour les cartes ; l'OG doit s'en servir à l'identique. Sous Workers, `readFile` seul échouerait : ne pas écrire un chargeur neuf.

### 1.4 Fichiers à créer ou modifier

1. **NEW `apps/web/src/lib/social/polices.ts`** : déplacer **sans changer le comportement** `CDN_URLS`, `fetchFontFromAssets`, `FONT_FILES`, `loadFonts`, `getFonts` depuis `image-generator.ts` et exporter `getFonts()`. `image-generator.ts` l'importe. Raison : `image-generator.ts` importe `satori` et `@resvg/resvg-js` (binaire natif) en tête de fichier, à ne pas tirer dans 4 routes OG. **Ordre obligatoire dans chaque route : `const fonts = await getFonts()` AVANT toute composition**, car `loadFonts` appelle `enregistrerPolice`, dont dépend la mise en lignes mesurée (`mesure-texte.ts`).
2. **EDIT `templates/carte-marque.tsx`** : `FORMATS.og = { width: 1200, height: 630, padX: 80, padY: 56 }` ; `TAILLE_PIED.og = 40` ; `TAILLE_MONOGRAMME.og = 64` ; nouveau composant `CarteOg` (cadre, §1.5). Le typage `Record<FormatCarte, …>` force les entrées `og` partout : suivre les erreurs `tsc`.
3. **EDIT `templates/cartes-piste-a.tsx`** : `TAILLES.og = { amorce: 44, chute: 60, titre: 64 }` ; `export function Bloc` et `export interface BlocProps` (aujourd'hui privés). Rien d'autre.
4. **NEW `templates/cartes-og.tsx`** : `OgArticle`, `OgQuiz`, `OgAccueil`, `OgVanne` (+ helpers `composerTitreOg`, `corpsVanneOg`, `couperAuMot`), §1.5 et §1.6.
5. **EDIT les 4 `opengraph-image.tsx`** : `const fonts = await getFonts(); return new ImageResponse(<…/>, { ...size, fonts })`. `alt`, `size`, `contentType`, `revalidate`, `generateStaticParams`, `runtime` : inchangés. L'accueil et le quiz deviennent `async`.
6. **NEW `apps/web/scripts/render-og.ts`** et **NEW `apps/web/src/__tests__/lib/social/cartes-og.test.tsx`** + adaptation de `blog-og-image-db.test.tsx` (§1.8).

### 1.5 Mise en page 1200×630 (px)

`CarteOg` = même structure que `Carte` (étiquette, bloc centré `flex: 1`, pied), donc même identité que les cartes et les bannières, avec **un seul écart assumé : le pied est à DROITE**.

| Zone | Spécification |
|---|---|
| Cadre | 1200×630, `#0D0D0D`, padding 56 px haut et bas, 80 px gauche et droite, colonne utile **1040 px**, `fontFamily: "Inter"` |
| Étiquette (optionnelle) | Inter 700, **40 px**, `uppercase`, `letterSpacing: 4`, `#A78BFA`, `lineHeight: 1.2` (hauteur 48), en haut à gauche, comme `Carte` |
| Bloc central | `flex: 1`, `justifyContent: center`, hauteur libre **278 px avec étiquette, 326 sans** (= `hauteurTitreMax("og", …)`, écart garanti ≥ 64 px au-dessus et au-dessous du bloc) |
| Pied | rangée de 64 px de haut à y 510-574, `justifyContent: flex-end`, `gap: 20` : `Monogramme` 64 px (rayon 12, « d » 46 px) puis `deviens-marrant.fr` en Inter 400 **40 px** `#B3B3B3` |
| Interligne | `1.12` comme toutes les cartes (≈ 72 px à 64 px). Écart assumé avec « multiple de 4 » : l'identité avec les cartes prime sur la règle de grille |

**Pourquoi le pied à droite** : sur la carte large de X, le domaine est affiché par l'application en incrustation dans le coin bas gauche de l'image `[HYPOTHÈSE : comportement X observé de mémoire, non vérifié ; la recherche web du jour ne le confirme pas ; à regarder sur un vrai post]`. À droite, le pied ne peut entrer en collision dans aucun des deux cas. Zone gauche y 550-630 **sans aucune encre** (le bloc de texte s'arrête à y ≤ 446 par construction).

**Lisibilité** : carte X mobile ≈ 358 pt de large, soit 0,298 pt par px `[HYPOTHÈSE : largeur non mesurée]`. Pied et étiquette 40 px = 11,9 pt (seuil 11 pt tenu) ; titre 64 px = 19 pt ; plancher du titre 48 px = 14 pt ; plancher du corps de vanne 36 px = 10,7 pt (seul cas sous 11 pt, voir `OgVanne`).

### 1.6 Les 4 gabarits, texte et tailles

| Route | Étiquette | Bloc central | Sous-ligne |
|---|---|---|---|
| **Accueil** `/opengraph-image` | aucune | Plus Jakarta 800, nominal **80 px**, blanc, lignes imposées `"Une vanne par jour\npour devenir plus drôle."`, « plus drôle. » en `#A78BFA` (même message et même accent que la bannière X) ; `mettreEnLignes` réduit le corps jusqu'à ce que chaque ligne tienne `[À MESURER : ≈ 76-80 px]` | « Quiz d'humour, sans inscription. » Inter 400 **44 px** `#D4D4D4`, 40 px sous le titre |
| **Quiz** `/quiz-humour` | aucune | Jakarta 800 **88 px**, lignes imposées `"Quel type\nd'humour es-tu ?"` (9 contre 16 caractères : 56 % ≥ 40 %), « es-tu ? » en `#A78BFA` | « Quiz d'humour, sans inscription. » Inter 400 44 px `#D4D4D4`. Hauteur du bloc ≈ 197 + 40 + 57 = 294 ≤ 326 |
| **Article** `/blog/[slug]` | catégorie lisible (`blogCategoryLabel`), jamais le code interne ; libellés actuels ≤ 12 caractères, donc une ligne sûre | Titre Jakarta 800 **64 px**, blanc, nombres (`/\d+/`) en `#A78BFA` comme `ArticleCouverture`, **3 lignes max** (`lignesTitreMax("og", true)` = 3). Réduction automatique par pas de 2 ; **plancher 48 px** | aucune |
| **Vanne** `/vannes/[slug]` | « Vanne » (plus de « Vanne · observation » : la catégorie en base est un code, pas un libellé) | amorce Jakarta 700 blanche, chute Jakarta 700 `#A78BFA`, écart 24 px, **même corps** pour les deux : essais 48, 44, 40, 36 px, on garde le premier dont la hauteur totale (lignes × corps × 1,12 + 24) tient en 278 px | aucune |

**Règles de composition** (déjà dans `mettreEnLignes`, à ne pas contourner) : jamais un mot seul sur une ligne, dernière ligne ≥ 40 % de la plus longue, typographie par `typo()` (apostrophe ’, insécables avant `: ? ! ;`).

**Vanne** :
- R6 appliquée comme sur toutes les cartes : si `estPremierePersonne(content, punchline)`, une paire « » par ligne de vanne (`citation: "sombre"`), « suspendu dans la marge et lilas, comme les cartes. Sinon aucun guillemet.
- **Plus jamais de troncature** (le gabarit actuel coupe à 130 et 90 caractères avec « ... » : une chute coupée est un défaut grave). Si rien ne tient à 36 px, la route rend `OgAccueil()` (carte de marque), jamais un texte tronqué.
- Plus de « → » devant la chute : la couleur lilas suffit.

**Titre d'article** : `composerTitreOg(titre, avecEtiquette)` essaie le titre entier, puis `couperAuMot(titre, 100)`, puis `couperAuMot(titre, 80)` (ajoute « … » si coupé) jusqu'à obtenir un corps ≥ 48 px. Un titre de 100 caractères tient à 52 px environ `[À MESURER]` : la coupe ne se déclenche en pratique jamais.

### 1.7 Libellés (contradiction levée avec `docs/founder-preferences.md`)

- **« QUIZ GRATUIT · 2 MINUTES » est retiré.** Motifs : (1) « gratuit » est exclu de tous les visuels (`bannieres/index.md` § Contrôles du texte) ; (2) il suggère un palier gratuit qui n'existe plus (« PAS DE COMPTE GRATUIT », 05/10, et « aucun changement pour les visiteurs ») ; (3) ce que l'on peut affirmer, c'est que le quiz reste **sans inscription** (FAQ vérifiée par @growth, formule déjà signée dans la bannière X et dans `FORMULES.quizCourt`).
- Sous-ligne = **« Quiz d'humour, sans inscription. »** (phrase de la bannière X, déjà validée). **« 2 minutes » n'est pas repris** : la durée est dans `FORMULES.quizCourt` mais je n'ai pas relu la page `/quiz-humour` `[À VÉRIFIER @copywriter avant d'ajouter « 2 minutes »]`.
- « Blog humour & répartie », « Des vannes à ressortir », « /quiz-humour » : retirés (ils répétaient le contexte et étaient à 16-20 px). Zéro tiret cadratin, zéro prix, zéro mention de l'IA, zéro nom de concurrent.
- Les 5 profils du quiz (emojis, carrés arrondis, noms à 14 px) sont supprimés : illisibles à 4 pt et anti-look IA. Rien ne les remplace.

### 1.8 Articles en base (cas à traiter et tests)

- `findBlogArticle(slug)` (sans `includeScheduled`) renvoie `null` pour un article en base non publié ou programmé : **aucune fuite du titre d'un article programmé** (22/10, 29/10…). Ne pas passer `includeScheduled: true`. Un `null` ou une erreur base donne le repli `"Le blog humour et répartie"` (texte conservé, test existant), sans étiquette, rendu par `OgArticle` (3 lignes max, aucun risque de débordement).
- Titre d'un article en base = `metaTitle || title` : peut être long (≤ 70 caractères attendus) et contenir `:`, apostrophes, nombres : tout passe par `typo()` et la mise en lignes, rien n'est mis en forme à la main.
- Les articles en base ne sont pas dans `generateStaticParams` : rendus à la demande, `revalidate = 3600` conservé. Au build (Node) les statiques lisent le TTF par `fs` ; en prod (Workers) tous passent par `ASSETS`.
- **Tests à écrire** :
  1. `blog-og-image-db.test.tsx` : le test lit aujourd'hui `props.children` récursivement ; avec des composants cela ne voit plus le titre. Remplacer `texte()` par `renderToStaticMarkup(img.element)` + la normalisation de `cartes-piste-a.test.tsx` l.50-58 ; l'attendu devient `"Blagues d’Halloween : 8 vannes pour ta soirée déguisée"` (apostrophe typographique, `typo()`). Garder les 3 assertions « jamais Article introuvable » et « jamais CATALOGUE ». Mocker `@/lib/social/polices` (`getFonts: jest.fn().mockResolvedValue([])`) et **enregistrer les polices dans `beforeAll`** comme `cartes-piste-a.test.tsx` l.41-46 (sinon la mesure échoue).
  2. `cartes-og.test.tsx` : pour les 4 gabarits, le balisage ne contient ni `linear-gradient`, ni `#1a1a2e`, `#16213e`, `#EC4899`, ni `sans-serif`, ni `gratuit` (insensible à la casse), ni `—`, ni `→` ; contient `Plus Jakarta Sans` et `#0D0D0D`. Titre long (100 caractères) : `corps ≥ 48` et `lignes ≤ 3`. Vanne de 400 caractères : `corpsVanneOg` renvoie `null` (repli accueil). Vanne courte à la 1re personne : le balisage contient les guillemets « et » ; à la 3e personne, aucun. `getFonts()` renvoie `Plus Jakarta Sans` 800 et 700, `Inter` 400.
  3. Règles de composition : sur le titre Halloween, aucune ligne à un mot, dernière ligne ≥ 40 % (même helper que §3, point 9).

### 1.9 Rendu de preuve et critères d'acceptation

`render-og.ts` (modèle : `render-carte-linkedin.ts`, mêmes polices lues par `readFile`, `ImageResponse` avec `fonts`) écrit dans `docs/social/visuels-s15/og/` **9 PNG** : `accueil`, `quiz`, `article-halloween` (titre court + étiquette « Catalogue »), `article-pilier` (« Comment devenir drôle : 5 piliers et un plan sur 30 jours », 57 caractères), `article-100-car` (titre de 100 caractères, cas limite), `article-repli`, `vanne-courte-1re-personne`, `vanne-longue` (limite du plancher 36 px), `vanne-repli` ; plus pour chacun `-x358.png` (réduction à 358 px de large, `sharp`, comme `-apercu-mobile.png` des bannières).

Je relis chaque PNG (10 critères Thomas) avant mise en ligne. **PASS =** fond uni `#0D0D0D` ; Plus Jakarta visible (le « g » et le « a » de Jakarta, pas Noto) ; aucun mot seul, dernière ligne ≥ 40 % ; ≥ 64 px entre le bloc et le pied ; 0 pixel d'encre dans x 0-360 × y 550-630 ; pied à droite, bord droit à x 1120 ; étiquette et URL lisibles sur le `-x358.png` ; accent lilas seulement sur les nombres (article), « plus drôle. » (accueil), « es-tu ? » (quiz), la chute (vanne).

### 1.10 Mise en ligne et cache

Avec le lot s17 (§0). Après déploiement : `curl -sI https://deviens-marrant.fr/opengraph-image`, `/quiz-humour/opengraph-image`, `/blog/<slug>/opengraph-image` (statique ET article en base publié), `/vannes/<slug>/opengraph-image` : 200 `image/png` 1200×630 ; temps du 1er rendu à froid (3 polices lues dans `ASSETS`) `[À MESURER, attendu < 3 s comme la carte LinkedIn]` ; relire un PNG servi. Les cartes déjà vues par X (post du 05/10) et LinkedIn restent en cache : seuls les nouveaux partages en profitent ; LinkedIn se rafraîchit par « Post Inspector » (Thomas ou la session).

## 2. Les 10 points de la notation : nature et traitement

| # | Point | Nature | Traitement |
|---|---|---|---|
| 1 | Insérer le lot 1a le 09/10, relire en base ; créer `v5-linkedin/index.md` | base + doc | **index.md créé** (`visuels-s15/v5-linkedin/index.md`, ids de la preuve Buffer du 05/10 tirés de `REPLIT_ACTIONS.md` l.228). Insertion et relecture : session, §6 |
| 2 | Brouillon Buffer de 4 images (IG3) | opération Buffer, sans déploiement | session, §6, **avant le 14/10 12:30 Paris** |
| 3 | Relevés avec preuve d'assets | mesure | session, modèle de ligne en §6 (relevés non modifiés ici) |
| 4 | Corriger §2.11 de `strategie-relance-v5.md` | doc de plan | texte prêt en §4.1, à coller par la session |
| 5 | Aligner les 4 Open Graph | **code** | spec §1, pour @fullstack |
| 6 | Rendre les cartes avant leur date (L1 du 15/10, 4 cartes du 21/10) | **code** (script) + exécution | spec §3.1 ; exécution par @fullstack (pas de shell chez moi) puis ma relecture |
| 7 | Captures à 390 px + capture téléphone du post IG du 07/10 | **code** (script) + **Thomas** | script §3.2 ; capture téléphone : Thomas §5 |
| 8 | Écart de corps entre cartes voisines | décision + plan + test | **décision prise** (plancher 70 % du nominal, déjà dans le code), texte §4.2, test §3.3 |
| 9 | Test Jest de composition | **code** | test exact en §3.3 |
| 10 | Poser les bannières LinkedIn et Instagram | **Thomas** | marche à suivre §5 (X déjà en ligne) |

## 3. Code à ajouter à la spec (@fullstack)

### 3.1 Rendus des cartes à venir (point 6)

Étendre `apps/web/scripts/render-carte-linkedin.ts` : ajouter à `VANNES` la vanne **L1 canapé** (`cs14jka89abf28d3769b05fe`, 15/10), dont les 2 lignes sont à **copier mot pour mot de `docs/copy/catalogue-vannes-valides.md`** (je n'en ai pas le texte complet : ne rien reconstituer de mémoire). Nouveau script `render-fiche-ig-21-10.ts` (même schéma, chemin `carrouselDecryptage` comme IG3) pour les 4 cartes de V028 de `preparation/fiche-ig-21-10.md`, sortie `docs/social/visuels-s15/v5-ig-21-10/`.

Le script écrit aussi `mesures.json` (je ne juge pas à l'oeil) : par carte, lignes, mots par ligne, corps, largeur de chaque ligne en % de la plus longue (`largeurTexte`), dernière rangée d'encre du bloc par balayage de pixels (`sharp`) et marge au pied. **Seuils PASS** : aucune ligne à un mot ; aucune ligne < 40 % de la plus longue ; dernière rangée d'encre du bloc **≤ y 1118** (pied de la carte 4:5 à y 1182, moins 64 px) ; corps ≥ 70 % du nominal. Pour la carte 4 de V028 (31 mots), marge attendue ≈ 190 px `[À MESURER]`. Un PASS retire le `[HYPOTHÈSE à confirmer au rendu de @design]` des plafonds (§4.2) ; un FAIL corrige les plafonds, pas le texte validé.

### 3.2 Aperçus à 390 px (point 7)

Nouveau `apps/web/scripts/render-apercus-mobile.ts` : réduit `v4/ig2-mimes-1.png`, `v4/ig3-anniv-de-lea-1.png`, `v4/ig3-anniv-de-lea-4.png`, `v5-linkedin/li-v044-nicolas.png` (et les cartes du §3.1 une fois rendues) de 1080×1350 à **390×488** (échelle 0,361, `sharp`), fichiers `<nom>-390.png` à côté de l'original, et ajoute à `mesures.json` les corps en points : corps px × 0,361. **Seuils** : corps de texte ≥ 24 pt (≈ 66 px), pied ≥ 11 pt (32 px donnent 11,6 pt). Ex. chute de Nicolas à ≈ 74 px = 26,7 pt : PASS attendu. Je relis ensuite les PNG.

### 3.3 Test de composition (points 8 et 9), à ajouter à `cartes-piste-a.test.tsx`

Imports à ajouter : `largeurTexte` (`@/lib/social/mesure-texte`), `FONT_TITRE` (`@/lib/social/templates/carte-marque`). Les polices sont déjà enregistrées par le `beforeAll` du fichier. Textes réels de `visuels-s15/v5-linkedin/alt.json` (la carte LinkedIn est la carte chute 4:5 d'Instagram) :

```ts
const motsDeLigne = (l: string) =>
  l.split(/[\s   ]+/).filter((m) => m && !/^[:;?!»«“”…,.]+$/.test(m)).length;

describe("composition des chutes LinkedIn (cycle 8, K3)", () => {
  const VANNES: Array<[string, string, string[]]> = [
    ["Rome", "Mon collègue revient de 4 jours à Rome et me raconte tout en détail.", ["Ça fait 2h. On vient de récupérer les valises."]],
    ["Nicolas", "Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit.", ["Huit mois après, Nicolas est très apprécié. Julien, on ne sait pas."]],
    // À AJOUTER dès que le texte est relu : L1 canapé (15/10), puis les cartes 3 et 4 de V028 (21/10).
  ];
  it.each(VANNES)("%s : aucun mot seul, aucune ligne sous 40 pour cent, corps au moins 70 pour cent du nominal", (_nom, amorce, chute) => {
    const nominal = TAILLES.instagram.chute;
    const c = composition({ textes: chute, taille: nominal, format: "instagram", citation: estPremierePersonne(amorce, ...chute) ? "aplat" : undefined });
    const lignes = c.paragraphes.flat();
    const largeurs = lignes.map((l) => largeurTexte(l, FONT_TITRE, 800, c.corps));
    const plusLongue = Math.max(...largeurs);
    lignes.forEach((l) => expect(motsDeLigne(l)).toBeGreaterThanOrEqual(2));
    largeurs.forEach((w) => expect(w).toBeGreaterThanOrEqual(0.4 * plusLongue));
    expect(c.corps).toBeGreaterThanOrEqual(Math.round(nominal * 0.7));
  });
});
```

Le test doit passer sur Rome et Nicolas (rendus relus : 4 lignes, aucun mot seul, 48 % pour « Nicolas est »). S'il échoue, c'est un défaut réel de composition à corriger dans `mise-en-lignes.ts`, pas un test à assouplir. Le dernier `expect` fixe le plancher du point 8 : 70 px sur 100, soit le plancher que `mettreEnLignes` applique déjà (`Math.round(corps * 0.7)`).

## 4. Textes de correction des documents de plan (à coller par la session, non modifiés ici)

### 4.1 `strategie-relance-v5.md` §2.11, l.72 (point 4)

Remplacer, dans la phrase qui décrit la carte pour « un post TWITTER ou LINKEDIN » : « X 16:9 1600x900 … pour un post TWITTER ou LINKEDIN » par **« LinkedIn 4:5 1080x1350 seulement ; X en texte seul, carte 16:9 à J+28 (§8) »**, et « 3 PNG `visuels-s15/v5-xli/` » par **« 2 PNG `visuels-s15/v5-linkedin/` relus (`index.md`) »**. Raison : le code ne sert la carte qu'à LinkedIn (`estVarianteImage` : `platform === "LINKEDIN"`) et le dossier `v5-xli/` n'existe pas. Libellé exact de la ligne : voir la notation cycle 8 §3, ligne « Spec §2.11 ».

### 4.2 `strategie-relance-v5.md` §8, l.167 (point 8 et plafonds)

Ajouter : **« Corps de la chute LinkedIn : 100 px nominal, plancher 70 px (70 % du nominal, appliqué par `mettreEnLignes`). Écart maximal entre deux cartes voisines : 30 %. Mesure à l'oeil du cycle 8 (± 3 px) : Rome ≈ 100 à 104, Nicolas ≈ 74. Verrouillé par le test de composition de `cartes-piste-a.test.tsx`. »** Retirer `[HYPOTHÈSE à confirmer au rendu de @design]` des plafonds LinkedIn uniquement si `mesures.json` du §3.1 est PASS.

### 4.3 `routines/README.md` l.33, « Garde de déploiement » (constat du §0)

Remplacer « branche partagée avec la session s16 » par : **« s16 est déployé (07/10, `712ee919`). La garde porte sur le lot s17 : tant que `REPLIT_ACTIONS.md` le marque NON DÉPLOYÉ, aucune routine ne lance `deploy:cf` (la migration `13_parcours_s17` doit passer avant, feu vert de Thomas en une ligne). »**

## 5. Actions de Thomas

1. **Poser la couverture LinkedIn** : page entreprise, modifier, couverture, fichier `docs/social/visuels-s15/bannieres/linkedin-couverture.png` (1128×191) ; champ site web : `https://deviens-marrant.fr/liens/li`. Alternative : un nouveau jeton LinkedIn (droits d'administration de la page), la session pose alors la couverture (`LINKEDIN_ACCESS_TOKEN` expiré, `REPLIT_ACTIONS.md` l.123).
2. **Poser les 4 stories à la une Instagram**, dans cet ordre et sous ces noms : Quiz, Vannes, Conseils, Répartie, avec `instagram-alaune-quiz.png`, `-vannes.png`, `-conseils.png`, `-repartie.png` (dossier `bannieres/`) ; marche à suivre dans `bannieres/notation-growth-cycle3.md`. Lien de bio : `/liens`.
3. **Captures d'écran téléphone** (une fois les poses faites ; elles ferment la réserve « zones sûres non mesurées » du cycle 3) : profil X, profil LinkedIn, profil Instagram (cercles des stories), et le post Instagram du 07/10 (`instagram.com/p/DeM51N8lkhD/`) en plein écran. À déposer dans `docs/social/visuels-s15/captures-telephone/` (ou à donner à la session).
4. **Une vérification de 10 secondes** : ouvrir sur ton téléphone un post X quelconque avec une grande carte de lien et me dire si le nom de domaine s'affiche **en bas à gauche, par-dessus l'image**. Cela valide ou non le choix du pied à droite du §1.5.
5. **Ton choix** : le post X du 05/10 dont la carte affiche « Article introuvable » (X ne se purge pas par API). Ma lecture : compte neuf, probablement très peu vu `[HYPOTHÈSE : engagement non mesuré]`, mais défaut visible sur le profil ; suppression en 1 geste dans l'application. À toi de trancher, rien n'est fait sans toi.
6. **Rien de plus pour l'OG** : il part avec le lot s17 sur ton feu vert habituel (migration 13 d'abord).

## 6. Actions de la session (aucun déploiement)

- **Point 1, jeudi 09/10** : commande du dry-run **sans** `--out` ni `--json`, relecture, puis la même avec `--insert --driver=neon-http` (`lot-1a-dry-run-07-10.md`, point d'attention 1). Relire ensuite en base le post L1 du 15/10 : `directorNote` contient `[variante:image]`, `threadParts` = [amorce, chute], `content` sur 2 lignes, `vanneLinkedInImage(post)` non nul. Consigner dans `REPLIT_ACTIONS.md`.
- **Point 2, avant mer. 14/10 12:30 Paris (10:30Z)** : même protocole que la preuve du 05/10 : brouillon Buffer (jamais une publication) du post IG3 inséré, 4 images `/api/social/image?postId=<id>&slide=0..3`, texte alternatif sur les 4, statut `draft`, `deletePost`, relecture NOT_FOUND. Consigner l'id du brouillon dans `REPLIT_ACTIONS.md`.
- **Point 3, relevés** : à ajouter aux lignes de preuve, **14/10** : IG3, 4 images, ordre 1 à 4, alt présent sur 4 sur 4, `sent`, lien du post ; **15/10** : LinkedIn, asset `image/png`, alt présent, `sent`, lien `urn:li:share:…` réel. Relire par l'API (lecture) l'alt du post IG du 06/10 (`DeKVBhaIFPb`), non noté au relevé.
- **Point 6** : faire exécuter §3.1 par @fullstack avant le 14/10 (carte L1) et le 20/10 (4 cartes du 21/10), puis me passer les PNG et `mesures.json`.
- **Point 10 (si jeton LinkedIn renouvelé)** : poser la couverture, vérifier l'image servie identique, comme pour X.
- **OG** : commit avant le déploiement du 10/10 (§0), puis relecture de mes 9 PNG avant mise en ligne.

## 7. Notes après cette passe (sans preuve de rendu : rien n'est validé)

Aucune note n'est relevée : **K3 reste à 9,0 et K4 à 9,5** tant que les 4 OG ne sont pas rendus et relus (§1.9), que L1 et les 4 cartes du 21/10 ne sont pas mesurées (§3.1), que les captures 390 px et téléphone manquent (§3.2, §5) et que les bannières LinkedIn et Instagram ne sont pas posées (§5). Je ne valide jamais un design sans PNG relu.


