# Forme et place des blocs d'appel, s21 (18/10/2026)

> Auteur : @design. Périmètre : FORME et PLACE des 18 blocs B1 à B18 de `docs/growth/audit-cta-s21.md`, mobile d'abord (375 puis 1280). **Aucun texte n'est écrit ici** : chaque texte est un emplacement `[S…]` rempli par @copywriter, relu à l'aveugle (règle d'or P0 s18). Aucun code, aucun git. Tous les libellés [CHOIX UTILISATEUR] (E1 « Accéder aux parcours complets », « Commencer à {prix} », « Créer mon compte », « Lire la première étape gratuite », « Tout débloquer », « Voir Premium », « Voir ce que contient Premium », « 1 500+ ») restent intacts : seule leur forme (bouton plein, contour, lien) ou leur place change.
> Lu : audit §1 à §9, chiffres du 18/10, design system (branche s21, `button.tsx` avec `outline-accent`), revue d'intégration tour 3, code de `article-cta.tsx`, `blog-encart-milieu.tsx`, `blog-article-view.tsx`, `blog-article-body.tsx`, `blog-article-related.tsx`, `home-cta.tsx`, `premium-cta.tsx`, `hero-section.tsx`, `how-to-apply-gate.tsx`, `premium-modal.tsx`, `lib/blog-encarts.ts`, captures `final/article-bloc-lettre-375.png` et `768-article-page-entiere.png`. **Non relus en détail** (spécifiés d'après l'audit, à vérifier au code par @fullstack) : `parcours-detail`, `vannes-list`, `conseils-list`, `videos-grid`, `viral-quiz`, `components/ui/modal.tsx`, pages fiche conseil et vidéo.

## 0. Ce que les chiffres imposent à la forme

| Constat (cta-chiffres-s21) | Conséquence de design |
|---|---|
| 0 clic sur 69 vues d'encart ; milieu-1 vu à 56 %, milieu-2 à 16 %, bloc de fin à 5 % | Un encart doit se LIRE en 5 secondes (démonstration visible, pas une promesse), être l'objet visuel le plus distinct de la page, et ne pas dépasser la lecture. |
| 7 clics de sortie vers d'autres vannes contre 0 sur les encarts | Le premier bouton d'un lecteur de vannes mène à une vanne décryptée (suite de divertissement), pas à une leçon. |
| Le bas d'article n'est atteint que par ≈ 5 % des lecteurs de l'article n°1 | Remonter ce qui compte (lettre en ligne au milieu, FAQ déplacée sous les appels) ; ne pas investir de hauteur dans le bas. |
| Seul clic mesuré : l'en-tête (2 en 28 jours) | L'en-tête reste, avec la bonne destination ; il est exempté de la règle « un plein par écran » (chrome). |

## 1. Règle de hiérarchie des boutons par température (décision de design)

### 1.1 Énoncé (une phrase)

**Le bouton plein est le pas suivant que CE visiteur est prêt à faire, jamais plus d'un par écran (hors en-tête). Ce qu'il a déjà reçu de nous dans la page décide lequel : froid = l'étape gratuite, tiède ou chaud = Premium.**

La « température » ne se devine pas sur la personne : elle se lit sur ce qu'il a déjà reçu dans cette vue (signal observable), donc elle est fixée par le type de bloc, jamais par un calcul.

### 1.2 Les trois températures

| Température | Signal (ce que le visiteur a déjà reçu) | Plein (niveau 1) | Contour (niveau 2) | Lien texte (niveau 3) |
|---|---|---|---|---|
| **FROID** | Rien de l'entraînement : arrivée par une page de lecture, de choix ou d'exploration | **Étape 1 gratuite** (ou fiche de vanne décryptée pour l'encart du milieu) | Lettre, si le bloc la porte | **Premium : E1 « Accéder aux parcours complets »** + prix et garantie en petit (jamais un bouton) |
| **TIÈDE** | A reçu une preuve de valeur dans la page (décryptage gratuit lu, 10 vannes vues, bas de l'accueil atteint) et l'action suivante est la sienne | **Premium** | **Étape 1 gratuite** du parcours qui colle | Liens utilitaires (« Voir toutes les vannes ») |
| **CHAUD** | A demandé ou a fini : /abonnement, /register, fin de l'étape 1 + quiz, fenêtre ouverte par un cœur ou un vote | **Premium, seul** | Aucun | Alternative discrète (lettre, étape gratuite) |

### 1.3 Cohérence avec le système à deux niveaux du lot 2

- **Aucune nouvelle variante.** Niveau 1 = `primary` (plein), niveau 2 = `outline-accent` (bordure violette 80 %, 3,2:1), `outline` neutre = utilitaire. Seule change l'**attribution** du plein : le lot 2 disait « plein = Premium », la règle devient « plein = pas suivant du visiteur, et c'est Premium dès que le visiteur a reçu une preuve ou demandé ». Ajout d'un **niveau 3 = lien texte** (formalise ce qui existe : hero, fiches).
- Deux styles de lien : **L1 lien fort** = `text-text-primary font-semibold underline decoration-accent-link decoration-2 underline-offset-4`, `min-h-11 inline-flex items-center` (celui du hero). **L2 lien discret** = `text-accent-link underline underline-offset-2`, `min-h-11`, `text-sm`.
- Non négociable, quelle que soit la température : un seul plein par écran ; un plein Premium est toujours accompagné, dans le même écran, du prix TTC et de la garantie (premier paiement, 14 jours) ; un plein d'étape gratuite ne porte jamais de prix ; aucun bouton « Premium » en contour (le visiteur ne doit jamais lire Premium comme secondaire quand il est tiède ou chaud) ; abonné Premium connecté : un seul plein « Continuer mon parcours » ou rien.
- **Exceptions déclarées** : (a) **en-tête** : « Commencer » / « Activer mon accès » est un plein permanent de chrome, non compté ; masqué sur /abonnement et /register (même destination ou boucle) ; (b) **liste de choix équivalents** (/parcours, 5 cartes) : un plein par carte, jamais deux par carte ; (c) **page à action unique** (/lettre) : l'action est le plein.
- Risque assumé et à mesurer : l'étape gratuite en plein (froid) rend le violet plein moins « Premium » à l'œil. Garde-fou : le libellé de l'étape gratuite dit « gratuite » et n'a jamais de prix ; Premium plein (tiède, chaud) a toujours le prix à côté. Si au bilan du 10/11 la confusion est visible (clic « étape gratuite » suivi d'un abandon à l'écran de compte), repasser le froid en contour : un seul réglage (paramètre `temperature` du bloc), pas de refonte.

### 1.4 Où elle s'applique, bloc par bloc

| Bloc | Température | Plein | Contour | Lien |
|---|---|---|---|---|
| B1 encart du milieu | Froid | Fiche de la vanne décryptée | aucun | aucun |
| B2 bloc de fin | Froid | Étape 1 gratuite du parcours | aucun (la lettre est à part, B18) | E1 + garantie |
| B3 haut d'accueil | Froid | Étape 1 de Répartie | aucun | E1 + prix en petit ; pastilles inchangées |
| B4 + B5 carte Premium d'accueil | Tiède | Premium | Étape 1 de Répartie | aucun |
| B6 en-tête | Chrome | « Commencer » (plein, exempté) | | |
| B7 murs de liste | Tiède | « Tout débloquer » | Étape 1 gratuite | « Voir Premium » sur cartes verrouillées |
| B8 à B10 fiches | Tiède | Premium (exercice) | Étape 1 gratuite | « Voir toutes les … » en L2 |
| B11 fenêtre | Chaud | « Créer mon compte et m'abonner » | aucun | Étape 1 gratuite en L2 |
| B12 résultat du quiz | Froid | Étape 1 du parcours conseillé | Lettre | E1 |
| B13 quiz d'onboarding (compte sans abonnement) | Chaud | « Active mon accès · {prix} » | aucun | « Refaire le quiz » en L2 |
| B14 fin d'étape 1 | Chaud | Premium | aucun | Lettre en L2 |
| B15 /parcours | Froid | Étape 1 gratuite (un par carte) | aucun | aucun |
| B16 /abonnement | Chaud | « Commencer à {prix} » | aucun | « Lis d'abord une étape » (existant) |
| B17 /register | Chaud | « Créer mon compte » | Google (existant) | Étape gratuite en L2 |
| B18 lettre | Froid (article, quiz) | non plein (contour) ; plein seulement sur /lettre | | |

## 2. Nouveau composant « Démonstration » (`DemoVanne`)

Remplace `BlogEncartMilieu` (carte à filet violet, texte, bouton contour) et sert de base au bloc de fin. Une vraie vanne du catalogue validé + son « Pourquoi ça marche » public + un appel. Composant serveur, dans le flux de lecture (ni fenêtre, ni barre collante : décision 17/10).

### 2.1 Anatomie (de haut en bas)

| # | Zone | Contenu | Forme |
|---|---|---|---|
| Z0 | Conteneur `aside` | | `rounded-lg border border-border bg-background-card p-5 sm:p-6`. **Plus de filet violet à gauche** (il se lit comme une citation ou un intertitre). `my-10` au milieu d'un article (40 px de respiration au-dessus et en dessous). |
| Z1 | Surtitre | `[S1]` | `text-xs font-medium uppercase tracking-wider text-text-muted` (identique à l'actuel, 1 ligne). |
| Z2 | **Objet vanne** | `[S2]` setup, `[S3]` chute (une vanne du catalogue, jamais écrite pour l'encart sauf relecture à l'aveugle) | Bloc intérieur **plus sombre que la carte** : `mt-3 rounded-md bg-background p-4`, bordure `border border-border`. Setup : `text-base text-text-primary` (Inter 16/24). Chute sur un paragraphe séparé, `mt-2 font-semibold text-text-primary`. Guillemets « » seulement si la vanne est à la 1re personne (R6). Aucun glyphe décoratif, aucune icône, aucun avatar. Ce bloc sombre est ce qui distingue l'encart du texte de l'article : c'est un objet, pas un paragraphe. |
| Z3 | Pourquoi ça marche | `[S4]` étiquette, `[S5]` explication (déjà publique sur la fiche) | Étiquette `mt-4 text-xs font-semibold uppercase tracking-wider text-accent-link` ; texte `mt-1 text-sm leading-5 text-text-secondary`. **Toujours visible, jamais replié** (voir 2.3). |
| Z4 | Appel | `[S6]` libellé du bouton | Plein `primary` taille `lg` : `mt-4 h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto`. Destination : fiche de la vanne affichée, `?src=blog-demo-<position>`, même onglet. Attribut de mesure : `data-blog-cta="demo-fiche"` (+ `data-blog-cta-position`, `data-blog-cta-parcours` conservés). |
| Z5 | Micro-ligne | `[S7]` (ce qui attend au clic, si utile) | `mt-2 text-xs text-text-muted`, 1 ligne à 375, facultative. |

La vanne n'est PAS cliquable (une seule cible tactile : le bouton ; zéro clic accidentel en scrollant).

### 2.2 Hauteur maximale sur mobile (375 de large)

Largeur de texte : 375 − 2×16 (marge de page) = 343 de carte, − 2×20 de padding = 303, − 2×16 dans l'objet vanne = **271 px** pour la vanne ; 303 px pour le reste. Ordre de grandeur : Inter 16 px ≈ 36 caractères par ligne dans l'objet vanne ; Inter 14 px ≈ 43 caractères par ligne en Z3 (à confirmer sur capture).

| Zone | Hauteur (px) |
|---|---|
| Padding haut + bas | 40 |
| Surtitre (1 ligne) + marge | 28 |
| Objet vanne : padding 32 + setup ≤ 2 lignes 48 + espace 8 + chute ≤ 2 lignes 48 | 136 |
| Z3 : marge 16 + étiquette 16 + 4 + 3 lignes × 20 | 96 |
| Z4 : marge 16 + bouton 48 (2 lignes de libellé : 56) | 64 à 72 |
| Z5 facultative | 0 ou 20 |
| **Total** | **364 à 392** |

**Plafond impératif : 400 px à 375** (≈ 49 % d'un écran de 812, ≈ 57 % de 700), **cible 360**. Contraintes de contenu transmises à @copywriter, vérifiées à la capture et non au nombre de caractères seul : setup + chute ≤ 4 lignes à 375 (ordre de grandeur 140 caractères au total) ; Z3 ≤ 3 lignes (≈ 130 caractères) ; libellé du bouton ≤ 2 lignes. Une vanne qui ne tient pas dans ces lignes n'est pas choisie pour l'encart (on en prend une autre, ou on la passe en variante « fin »). À 1280 (carte de 768 de large) la même carte tient en ≈ 270 px.

### 2.3 État replié : non

Pas de repli. Raison : l'encart a 56 % d'exposition et 0 clic ; son seul rôle est de montrer la valeur en 5 secondes, un tap pour déplier le tue. Un encart plus court est obtenu par le contenu (2.2), pas par un accordéon. Seule exception : la ligne de lettre du milieu (B18, 4.4), repliée par nature.

### 2.4 Séparation avec l'article

Trois signaux cumulés, sans ombre ni dégradé : (1) carte `bg-background-card` + bordure sur un fond d'article `bg-background` ; (2) objet vanne plus sombre que la carte (rupture de ton unique dans la page) ; (3) marges `my-10` (40 px) au-dessus et en dessous, et jamais collé à un H2 (placé en FIN de section, comme aujourd'hui). `aria-label` = surtitre.

### 2.5 Variantes

| | **Milieu** (`variante="milieu"`) | **Fin** (`variante="fin"`) |
|---|---|---|
| Où | Après la section dont la fin tombe vers 35 à 45 % du texte (règle actuelle de `lib/blog-encarts.ts`) ; article n°1 : après « Quelles blagues sortir en soirée ? » (≈ 21 %) | Fin du corps, avant la lettre (ordre en §3) |
| Température | Froid | Froid |
| Vanne | Liée à la section (catalogue) | **Une AUTRE vanne** que celle du milieu, jamais la même deux fois dans un article |
| Titre | aucun | `[S8]` titre propre à l'article (existant) : `font-display text-xl font-bold text-text-primary`, `mt-2` |
| Z3 | 3 lignes max | 4 lignes max |
| Appel | **Un plein** : fiche de la vanne. Rien d'autre. | **Un plein** : étape 1 gratuite du parcours de l'article (`primary lg`, pleine largeur à 375, `sm:w-auto` ensuite). Dessous : **lien L1 E1** « Accéder aux parcours complets » (`min-h-11`, `mt-3`), puis note `[S9]` (prix TTC + premier paiement remboursable 14 jours) en `text-xs text-text-muted mt-2`. Les deux puces actuelles disparaissent (gain ≈ 90 px). |
| Hauteur max à 375 | **400 px** | **560 px** (cible 520) : lecteur engagé, mais le plein doit rester visible avec la vanne dans le même écran |
| Abonné Premium | **Masqué** (comme la lettre) | « Continuer mon parcours », un plein, sans vanne (comportement actuel) |
| `data-` | `data-blog-cta-position="milieu-1"` | `data-blog-cta-position="fin"`, `data-blog-bloc-fin` conservés |

**Milieu-2 disparaît comme encart d'offre** (cf. D1c de l'audit : 16 % de vues, 0 clic, article de 18 écrans). Sur les articles ayant eu deux encarts, la position milieu-2 reçoit la ligne de lettre (4.4). Un seul encart démonstration par article.

### 2.6 États

| État | Rendu |
|---|---|
| default | comme ci-dessus |
| hover (≥ 1024) | bouton `primary` hover standard ; la carte ne bouge pas |
| active | `primary` standard |
| focus-visible | anneau 2 px, offset 2 px, `focus-visible:ring-accent-secondary-hover` (déjà dans `button.tsx`) |
| disabled / loading | non applicable (lien) |
| Données absentes (aucune vanne trouvée pour la section) | **ne pas afficher l'encart** (vide propre plutôt que vanne de substitution hors sujet) ; le bloc de fin garde sa forme sans objet vanne (titre, lien, plein) |

Accessibilité : contrastes vérifiés au calcul : blanc sur #7C3AED ≈ 5,7:1 ; `text-secondary` #B3B3B3 sur #1F1F1F ≈ 8:1 ; étiquette `accent-link` #A78BFA sur #1F1F1F ≈ 6:1 ; `text-muted` #9A9A9A sur #1F1F1F ≈ 6:1 ; objet vanne `text-primary` sur #0D0D0D 19:1. Cible tactile du bouton 48 px. Ordre clavier = ordre visuel. Lecteur d'écran : `aside` nommé, la vanne lue comme deux paragraphes.

## 3. Place : les quatre ensembles

### 3.1 Bas d'article : ordre exact (remonté, réordonné)

Aujourd'hui : corps, (FAQ), bloc de fin, lettre, navigation de cluster, « À lire ensuite » ; la FAQ (3 à 6 questions, ≈ 700 à 900 px à 375) s'intercale entre le corps et les appels sur la plupart des articles. Nouvel ordre, **identique pour tous les articles** (la liste `BLOC_FIN_AVANT_FAQ` n'a plus d'objet) :

| Rang | Bloc | Espacement au-dessus | Notes de forme |
|---|---|---|---|
| 1 | Corps de l'article, avec la démonstration du milieu (B1) à 35-45 % ; ligne de lettre repliée (B18, 4.4) à la place de l'ancien milieu-2, articles longs seulement | | |
| 2 | Partage des vannes (`BlogVanneShare`), si l'article en a | `mt-8` | inchangé |
| 3 | **Bloc de fin** (`DemoVanne variante="fin"`, B2) | `mt-10` (au lieu de `mt-12`) | un plein (étape 1) + lien E1 ; ≤ 560 px à 375 |
| 4 | **Lettre** (formulaire complet, B18), bouton `outline-accent` | `mt-8 border-t border-border pt-6` (32 / 24, déjà validé tour 3) | rien entre le bloc de fin et la lettre |
| 5 | **Navigation de cluster** (précédent / suivant) puis **« À lire ensuite »** (3 cartes) | `mt-10 border-t pt-8` | à 375 : cartes en une colonne, ≈ 100 px chacune ; titre `line-clamp-2` conservé |
| 6 | **FAQ** | `mt-10 border-t pt-8` | déplacée en dernier ; reste visible et balisée (le JSON-LD FAQPage ne dépend pas de l'ordre du DOM) : **@seo à confirmer** |

Gain attendu pour le lecteur qui arrive en bas : le bloc de fin remonte d'environ 700 à 900 px (hauteur de la FAQ) sur les articles où la FAQ le précédait. Gain pour les 95 % qui n'y arrivent pas : aucun ; c'est pourquoi la démonstration du milieu et la ligne de lettre portent l'essentiel (3.1 bis).

**Option à valider par Thomas (hors des 18 blocs)** : une carte « quiz d'humour » en tête de zone 5 (lien de la même famille que les cartes « À lire ensuite », sans bouton), qui répond à B12 « promouvoir le quiz comme sortie des articles ». Par défaut : non incluse.

### 3.1 bis. Les trois points de contact d'un article long (article n°1, 18 écrans à 375)

| Position | Exposition mesurée | Bloc | Poids visuel |
|---|---|---|---|
| ≈ 21 % | 56 % des lecteurs | Démonstration milieu (vanne + pourquoi + 1 plein) | fort : objet sombre + bouton plein |
| ≈ 32 % | 16 % | Ligne de lettre repliée (56 px) | faible : une ligne et un contour |
| fin | 5 % | Bloc de fin puis lettre complète | fort puis moyen |

Articles courts ou à un seul encart : milieu + fin + lettre complète ; pas de ligne repliée.

### 3.2 Accueil (visiteur), ordre exact

1. **Hero** (B3) : H1 ; intro ; « 1 500+ membres… » inchangé ; **plein = étape 1 de Répartie** (froid) ; **lien L1 E1** + prix en petit ; 3 pastilles ; atouts (≥ sm).
2. Contenu du jour, cartes vannes / conseils / vidéos, « Tu te reconnais ? » + autres parcours + pilier, « Derniers articles » : inchangés.
3. **Carte Premium fusionnée** (B4 + B5) : le bloc « Tu crois avoir tout essayé » **disparaît comme bloc** ; son accroche, si elle passe l'aveugle sans le décompte de vannes, devient le titre `[S10]` de la section de la carte Premium (remplace « Pour t'y mettre, il y a Premium » ou le complète en sous-titre `[S11]`).
4. **FAQ** (inchangée, sous la carte).
5. **Lettre** (lien discret, B18), puis « Prochainement ».

**Carte Premium fusionnée, de haut en bas** (largeur 343 à 375 ; `max-w-2xl` = 672 à 1280, centrée ; `rounded-2xl border-2 border-accent-primary` existant) : titre `[S10]` + intro `[S11]` hors carte, centrés ; dans la carte : « Premium », prix 36 px + TTC / mois, **une seule** mention « sans engagement » `[S12]` (aujourd'hui dite deux fois) + lien « Droit de rétractation », 4 puces, **plein Premium** `primary lg w-full` (`Commencer à {prix}`, E1/1.1 intacts), **contour `outline-accent lg w-full` = étape 1 gratuite de Répartie** `mt-3` (remplace « Voir les vannes gratuites », qui menait à un mur), réassurance `[S13]` (premier paiement, 14 jours, résiliation en ligne), « Déjà 1 500+ inscrits, et toi ? » inchangé. Plein et contour sont dans le même écran (≈ 120 px à eux deux). Destination du plein : un seul chemin canonique ; **recommandation : `/abonnement?src=accueil-premium`**, comme l'en-tête (le visiteur voit le prix, le carnet, la garantie avant le formulaire) ; décision produit à confirmer, la forme ne change pas.

### 3.3 Fiches vanne, conseil, vidéo : un seul plein

Composant unique `BlocExercice` (variantes `vanne`, `conseil`, `video`), placé **juste après le décryptage gratuit** (le « Pourquoi ça marche » / l'exemple concret / l'analyse visible), `mt-8`. Il remplace : sur la fiche vanne, le bloc pointillé « À toi de jouer » ET les deux boutons de « Comment la ressortir » (le TEXTE de cette section reste, en prose, sans bouton) ; sur conseil et vidéo, le bloc verrouillé existant.

| Rang dans le bloc | Élément | Forme |
|---|---|---|
| 1 | Titre `[S14]` (« À toi de jouer » ou équivalent) | `font-display text-lg font-bold` |
| 2 | Teaser de l'exercice `[S15]` : UNE ligne réelle de la consigne ou son format, seulement si vrai pour cette fiche ; sinon omis (vide propre) | `text-sm text-text-secondary`, ≤ 2 lignes |
| 3 | **Plein Premium** : « Voir ce que contient Premium » (existant) | `primary lg w-full sm:w-auto`, destination `/abonnement?src=exercice-<type>&returnTo=<fiche>` |
| 4 | Ligne prix + garantie `[S16]` | `mt-2 text-xs text-text-muted` (prix TTC, premier paiement 14 jours) |
| 5 | **Contour** : étape 1 gratuite du parcours qui colle à la catégorie de la fiche (toujours présent, pas seulement quand la vanne est dans une étape) | `outline-accent lg w-full sm:w-auto`, `mt-3` ; boutons côte à côte dès `sm` avec `gap-3` |
| 6 | « Voir toutes les vannes / conseils / vidéos » | **lien L2**, plus un bouton (3e bouton supprimé), `mt-3` |

Conteneur : `rounded-lg border border-border bg-background-card p-5` (la bordure pointillée violette disparaît : un bloc payant n'a pas à imiter un état « verrouillé »). 375 : empilé, ≈ 290 à 330 px ; 1280 : même carte, boutons sur une ligne. Abonné : l'exercice s'affiche (comportement actuel), aucun bouton.

### 3.4 Fin d'étape 1 (parcours, visiteur) : carte « Étape 2 »

Ordre : (1) résultat du quiz de l'étape 1 (existant) ; (2) **carte « Étape 2 »** ; (3) phrase de l'étalon 4.1 « Valider l'étape fait partie de Premium. » (inchangée) ; (4) **plein Premium** (existant « Voir ce que contient Premium ») ; (5) prix et garantie (existant, + garantie) ; (6) **lien L2 lettre** pour qui n'est pas prêt (emplacement nouveau : accord de Thomas, spec lettre).

**Carte « Étape 2 »** (`CarteEtapeSuivante`) : `rounded-lg border border-accent-primary/40 bg-background-card p-4 sm:p-5`, jamais de plein dedans. Contenu : surtitre `[S17]` (étape 2), titre de l'étape `font-display text-lg font-bold`, « Ce que tu vas apprendre » `[S18]` (texte déjà public de l'aperçu, `line-clamp-3`, `text-sm text-text-secondary`). **Rien de payant dévoilé.** Hauteur à 375 ≈ 180 px ; (2)+(3)+(4)+(5) tiennent en ≈ 340 px, donc le plein est dans le même écran que la carte. Au-dessus du quiz terminé : le bloc n'apparaît pas (contour d'attente actuel conservé, sans carte).

**Aperçus des étapes 2+ ouverts** : plus de plein dans chaque aperçu (un plein par page). Chaque aperçu garde son texte et finit par un **lien L2** « Voir ce que contient Premium » ; le plein unique de la page est celui de la fin d'étape 1 (ou, tant que le quiz n'est pas fini, le bouton de l'étape 1 elle-même).

## 4. Spécification forme et place, B1 à B18

Conventions : « 375 » = écran de 375 (carte de 343 de large, marges de page 16) ; « 1280 » = bureau. `[S#]` = emplacement de texte pour @copywriter (aucun texte n'est fourni). Boutons : plein = `buttonVariants({variant:"primary"})`, contour = `"outline-accent"`, lien = L1 / L2 (§1.3). `lg` = 48 px, cibles ≥ 44 px partout. Chaque ligne « Mesure » conserve ou ajoute un `data-` pour Umami (à brancher par @fullstack avec @data-analyst).

### B1. Encart au fil des articles → `DemoVanne variante="milieu"`
- **Composant et règles** : §2 en entier. Un seul par article ; milieu-2 supprimé comme encart d'offre. Masqué pour Premium. Température froide : un plein = fiche de la vanne.
- **Position** : fin de la section H2 la plus proche de 35-45 % (règle de `lib/blog-encarts.ts` inchangée) ; article n°1 : après « Quelles blagues sortir en soirée ? ».
- **375** : carte 343, ≤ 400 px de haut, bouton pleine largeur 48 px. **1280** : carte 768 (colonne de l'article), bouton `w-auto` aligné à gauche, vanne dans un bloc sombre pleine largeur de la carte.
- **Textes** : `[S1]` surtitre, `[S2]` setup, `[S3]` chute, `[S4]` étiquette, `[S5]` pourquoi, `[S6]` bouton, `[S7]` micro-ligne facultative.
- **Mesure** : `data-blog-cta="demo-fiche"`, `blog-cta-vu` / `blog-cta-clic` avec `position`, slug de la vanne.

### B2. Bloc de fin d'article → `DemoVanne variante="fin"` (§2.5)
- **Règles** : un plein (étape 1 gratuite) ; lien L1 E1 dessous ; note de garantie ; plus de puces ; l'ordre contour puis plein du lot 1 disparaît (**accord de Thomas requis**, validé le 13/10 : audit §8).
- **Position** : rang 3 du bas d'article (§3.1). **375** : ≤ 560 px, plein pleine largeur ; **1280** : plein `w-auto` + lien E1 sur la même ligne (`sm:flex-row sm:items-center gap-4`).
- **Textes** : `[S8]` titre, `[S2]`..`[S5]` autre vanne, `[S6]` étape 1, `[S9]` note, E1 intact.

### B3. Accueil, haut de page → `HeroSection` visiteur
- **Règles** : plein = étape 1 de **Répartie** (destination changée, libellé du patron « … de Répartie » `[S19]`) ; E1 passe en **lien L1** sous le plein avec la note prix `[S20]` en `text-xs text-text-muted` ; pastilles, « 1 500+ » et H1 inchangés. Au maximum 3 actions fortes au premier écran 375 : plein, lien E1, pastilles (celles-ci restent des chips de navigation, non des boutons) ; plus « Commencer » de l'en-tête (exempté).
- **Position** : sous le « 1 500+ », comme aujourd'hui. **375** : plein pleine largeur 48 px, lien 44 px, note ; ≈ 130 px. **1280** : colonne centrée, plein `w-auto`.
- **Textes** : `[S19]` plein, `[S20]` note, E1 inchangé.

### B4 + B5. Carte Premium d'accueil fusionnée (§3.2)
- **Règles** : tiède ; plein Premium puis contour étape 1 de Répartie ; une seule mention « sans engagement » ; plus de bloc « Tu crois avoir tout essayé » séparé ; plus de bouton « Voir les vannes gratuites ».
- **Position** : après « Derniers articles », avant la FAQ. **375** : carte 343, ≈ 600 px, plein et contour dans le même écran ; **1280** : `max-w-2xl` centrée.
- **Textes** : `[S10]`, `[S11]`, `[S12]`, `[S13]`.

### B6. Bouton d'en-tête → `header.tsx` (aucun changement de forme)
- **Règles** : plein `sm` (44 px sous `md`), libellé inchangé (« Commencer ») ; destination `/abonnement?src=header` (recommandation audit, décision de config) ; **masqué sur /abonnement et /register** (page courante ou boucle) : un seul plein par page chaude. « Activer mon accès » (membre non abonné) inchangé. Rien ne bouge dans le budget d'en-tête (`header-budget` reste vert : un bouton masqué ne consomme rien).
- **375** : visible dès 360 (≈ 107 px de large), à 320 absent (menu seul) ; **1280** : à droite de « Connexion ».

### B7. Murs des listes /vannes, /conseils, /videos → `MurListe`
- **Règles** : tiède. (a) **Plus de bandeau en haut** : la limite s'annonce sous les 10 vannes, pas avant (ligne `[S21]` en `text-sm text-text-secondary`, après la 10e carte) ; (b) ligne « Filtres… Premium » : lien L2 `[S22]` (texte existant), pas de bandeau teinté ; (c) cartes verrouillées : forme actuelle (floutées, pointillées), jamais de faux contenu flouté ; lien court « Voir Premium » en L2 (≥ 44 px), même destination que le plein ; (d) bloc de bas de liste `MurListe` : carte `rounded-lg border border-border bg-background-card p-5 sm:p-6 mx-auto max-w-xl`, `mt-8` ; titre `[S23]`, 2-3 lignes d'usage `[S24]` (ce qu'il y a derrière en usage, pas en volume), **plein « Tout débloquer »** [CHOIX] `primary lg w-full sm:w-auto` → `/abonnement?src=mur-<liste>` ; **contour** étape 1 gratuite `[S25]`, `mt-3` ; prix + garantie `[S26]`. Une seule destination pour tous les murs de liste (/abonnement) ; la fenêtre B11 est réservée aux favoris et au vote.
- **375** : carte 343 ≈ 330 px ; **1280** : 576 de large centrée sous la grille. Aucune phrase ne laisse croire que les fiches sont verrouillées (elles sont publiques).

### B8, B9, B10. Fiches vanne, conseil, vidéo → `BlocExercice` (§3.3)
- **Règles** : un seul plein (Premium), un contour (étape 1), « Voir toutes les … » en L2 ; ligne prix + garantie près du plein ; vanne : « Comment la ressortir » garde son texte sans bouton ; vidéo : si les points clés ne sont pas exploitables en teaser, `[S15]` omis (ne rien inventer ; à vérifier au code et en base).
- **Position** : après le décryptage / l'exemple / l'analyse gratuits, `mt-8`. **375** : empilé ≈ 290-330 px ; **1280** : colonne de la fiche, boutons côte à côte.
- **Textes** : `[S14]`..`[S16]`, `[S25]` pour l'étape gratuite par catégorie. À vérifier : la phrase sur « les variantes » (audit B8) avant d'écrire `[S15]`.

### B11. Fenêtre Premium → `PremiumModal`
- **Règles** : chaud ; **bottom sheet sur mobile** (pattern obligatoire du projet) : conteneur `fixed inset-0 flex items-end sm:items-center justify-center`, panneau `w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-y-auto`, pied collant `sticky bottom-0 bg-background-card pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]` contenant le plein et les deux lignes de réassurance : **le plein est toujours visible sans défiler**. Avantages réduits à ceux du geste (favoris : 2 lignes), les 4 avantages complets sont retirés de la fenêtre. Plein « Créer mon compte et m'abonner » (exception motivée du lot 2) ; lien L2 « étape 1 gratuite » dans le pied (alternative). Fermeture : bouton 44 px en haut à droite, clic sur le fond, Échap.
- **375 x 667** : hauteur ≤ 90dvh (≈ 600), plein à ≈ 500-560 ; **1280** : modale centrée 512 de large. **À vérifier dans `components/ui/modal.tsx`** : le composant est-il déjà un bottom sheet ? (non lu). Pas de capture de la fenêtre dans le dossier : à produire.
- **Textes** : titre selon le geste et intro existants ; `[S27]` avantage du geste (2 lignes) ; `[S28]` lien étape gratuite.

### B12. Résultat du quiz d'humour
- **Règles** : froid. Ordre : carte du profil (existant) ; « Ton point de départ » + parcours conseillé (existant) ; **plein = étape 1 du parcours conseillé**, libellé qui nomme le parcours `[S29]` ; **lien L1 E1** dessous (destination /abonnement avec retour au parcours conseillé, inchangée) ; puis la lettre (contour). Texte SEO long reste en bas.
- **375** : plein pleine largeur sous la carte du parcours ; **1280** : plein `w-auto`, lien à droite.
- **Promotion du quiz** : voir l'option §3.1 (carte dans « À lire ensuite », accord de Thomas).

### B13. Résultat du quiz d'onboarding (compte sans abonnement)
- **Règles** : chaud. Le lien gris xs « Tout débloquer à … » est remplacé par un **plein** « Active mon accès · {prix} » (forme et libellé de la fenêtre, un seul libellé pour ce geste) `primary lg w-full sm:w-auto` ; « Refaire le quiz » passe en L2. Trafic ≈ 0 : forme seulement, aucun temps de plus. Relance d'un compte non payé : hors chantier (décision 18/10).

### B14. Fin d'étape 1 et aperçus 2+ → `CarteEtapeSuivante` (§3.4)
- **375** : carte 343 ≈ 180 px, puis phrase 4.1, plein `primary lg w-full`, prix + garantie, lien L2 lettre ; **1280** : colonne de la page parcours, plein `w-auto`. Textes : `[S17]`, `[S18]` (déjà publics), garantie `[S16]`, lien lettre `[S30]`.

### B15. Page /parcours
- **Règles** : froid, liste de choix équivalents : **un plein par carte** `primary` = étape 1 gratuite (appliquer G9 du lot 2 : libellé « Lire la première étape gratuite de {parcours} », patron validé) ; ligne frontière `[S31]` (« étape 1 gratuite, étapes 2 à N avec Premium ») `mt-2 text-xs text-text-muted` sous le bouton ; l'encart en italique du membre fictif (présenté comme exemple, 29/09) inchangé ; aucun Premium sur la carte.
- **375** : une carte par écran (≈ 560 px), bouton pleine largeur 48 px ; **1280** : grille existante, boutons `w-full` de carte. Cinq pleins sur la page mais jamais deux dans une même carte.

### B16. Page /abonnement (visiteur)
- **Règles** : chaud ; plein unique « Commencer à {prix} » ; position du bouton inchangée (y ≈ 603 à 650 sur 375 x 700, **ne pas bouger**). **Nouvelle ligne `[S32] « ce qui suit »` (compte, puis paiement)** : `mt-2 text-xs text-text-secondary`, placée juste SOUS le bouton et avant la ligne de garantie (donc sous le bouton visible, sans le pousser). Ordre sous le bouton : `[S32]`, garantie, droit de rétractation + Stripe, avantages, **aperçu public de l'étape 2 du parcours d'origine** (`CarteEtapeSuivante`, nouvelle position : avant l'extrait du carnet), extrait du carnet, « Pas encore sûr ? », « Tu annules quand tu veux », FAQ. Surtitre variable selon `returnTo` : trois variantes `[S33a/b/c]` (Yanis, Sophie, Marc), même gabarit, même hauteur (2 lignes max à 375 pour ne pas déplacer le bouton). Trou de 60 px en mensuel : **ne pas y toucher** (hauteur réservée anti-saut, validée tour 3).
- **Header** : bouton d'en-tête masqué (B6).

### B17. Page /register
- **Règles** : chaud ; plein « Créer mon compte » (2.1 intact) ; ordre des champs : Email, Mot de passe, **Prénom en dernier et facultatif** (libellé `[S34]`) ; Google en contour sous le plein (existant) ; **lien L2 étape gratuite** `[S35]` sous « Déjà un compte ? » ; « Étape 1 sur 2 » et garantie inchangés. 375 : formulaire pleine largeur, champs 48 px ; 1280 : colonne centrée existante.
- **Header** : bouton d'en-tête masqué.

### B18. Lettre mensuelle (cinq emplacements)
- **Article (complet)** : formulaire existant, bouton `outline-accent`, `mt-8 border-t border-border pt-6`, rang 4 du bas d'article ; mention et « Gratuit, sans compte » fusionnées (m6, déjà fait) ; **aucun changement de forme**, seulement la place (rang 4, juste après le bloc de fin, qui est maintenant plus haut).
- **Ligne repliée au milieu de l'article** (articles longs, à la place de milieu-2, **accord de Thomas et @legal requis** : spec lettre §1.2) : état replié = une ligne `rounded-lg border border-border bg-background-card px-4` de 56 px, texte `[S36]` à gauche, bouton `outline-accent` `h-11` « déplier » à droite ; au tap, le formulaire complet s'ouvre sur place (`<details>` / Radix Collapsible, clavier et `aria-expanded`), **la case de consentement et la mention d'éditeur sont visibles avant l'envoi** (exigence @legal non touchée). Jamais ouverte par défaut, jamais de pop-up. Position ≈ 32 %, au moins 4 écrans (≈ 3 000 px) sous l'encart du milieu.
- **Quiz** : sous le plein et le lien E1, `mt-6` (24 px, déjà validé) ; contour.
- **/lettre** : le formulaire est la seule action de la page : bouton **plein** (`primary lg`, pleine largeur à 375, `sm:w-auto`) ; recommandation non bloquante, la page est notée 10 par la revue, à décider avec Thomas.
- **Accueil et pied de page** : lien L2 discret, inchangé (bloc d'accueil validé tour 3).
- **375** : formulaire 343, ≈ 450 px (validé) ; **1280** : colonne de l'article / 640 sur /lettre.

## 5. Mises à jour du design system à faire avec cette passe (`docs/design/design-system.md`)

1. Rubrique Button, « Deux niveaux de boutons » : remplacer par « **Trois niveaux** : niveau 1 `primary` (plein) = le pas suivant du visiteur, un seul par écran hors en-tête, Premium dès que le visiteur est tiède ou chaud, étape gratuite quand il est froid ; niveau 2 `outline-accent` = l'alternative ; niveau 3 = lien texte L1 / L2. La température se lit sur ce que le visiteur a déjà reçu dans la page (§1 de `cta-forme-place-s21.md`). Un plein Premium porte toujours prix TTC et garantie ; un plein gratuit ne porte jamais de prix. »
2. Nouvelle rubrique Composants : `DemoVanne` (milieu, fin), `BlocExercice`, `CarteEtapeSuivante`, `MurListe`, avec leurs plafonds de hauteur mobile (400 / 560 / 330 / 180 / 330 px).
3. Tests de garde-fou à ajouter (@qa) : (a) pas deux `primary` visibles dans un même écran 375 x 812 sur 8 pages types (hors en-tête) ; (b) hauteur de `DemoVanne` ≤ 400 px (milieu) et ≤ 560 px (fin) à 375 avec les trois plus longues vannes retenues ; (c) bouton /abonnement entier à 375 x 700 (aucun changement de position) ; (d) bottom sheet de la fenêtre à 375 x 667 : plein dans l'écran.

## 6. Points d'attention, accords et preuves

| Sujet | Statut |
|---|---|
| **Accord de Thomas** (audit §8) | Bloc de fin : un seul plein, note changée, ordre contour/plein du 13/10 abandonné (B2) ; fusion B4 dans B5 (décision 18/10 déjà actée : « fusionné ») ; lettre repliée au milieu de l'article et lien de lettre en fin d'étape 1 (B14, B18, nouveaux emplacements) ; carte quiz dans les articles (option, B12) |
| **@seo** | Confirmer que la FAQ en dernier rang de l'article ne pose aucun souci (elle reste visible et balisée) |
| **@legal** | Case de consentement visible avant l'envoi dans la ligne repliée ; aucune promesse au-delà des faits dans les murs et les fiches |
| **@fullstack** | Vérifier au code : `parcours-detail`, listes, quiz, `modal.tsx` (bottom sheet ?), page conseil et vidéo (non relus) ; `BLOC_FIN_AVANT_FAQ` devient sans objet ; destination de l'en-tête et du plein d'accueil |
| **@data-analyst** | Mesure : `data-blog-cta="demo-fiche"`, clics fiche → `mur-vu` → `abonnement-vu` (chaîne par `src`) ; `lettre-vu` par emplacement ; la règle de température se juge au bilan du 10/11 (volume ≈ 13 vues par jour de l'article n°1 : aucune différence fine mesurable) |
| **Risque principal** | Deux pleins aux premiers écrans 375 des pages froides (en-tête + corps), destinations différentes. Assumé (chrome). Si le clic en-tête chute après le changement, c'est le signal à lire en premier |
| **Preuves absentes** | Aucune capture des nouveaux composants (inexistants). Avant mise en ligne : captures 375, 768, 1280 de l'article n°1 (milieu, fin, ligne de lettre), accueil bas, fiche vanne, fin d'étape 1, fenêtre Premium en bottom sheet, /parcours, puis relecture des 10 critères sur le rendu réel (règle du 07/10 : itérer à 10/10). La note finale de ce document ne vaut qu'après ces captures |

Les 10 critères visuels se jugent sur le rendu, pas sur ce document. Prévision de design (non une note) : les deux risques les plus probables sont la hauteur de l'encart si la vanne choisie est longue (§2.2) et la lisibilité du plein « étape gratuite » comme bouton payant (§1.3).

---
**Handoff → @orchestrator (puis @copywriter, @fullstack, @qa)**
- Fichier : `/home/user/Marrant/docs/design/cta-forme-place-s21.md` (règle de température §1, composant `DemoVanne` §2, ordres de page §3, 18 fiches B1 à B18 §4, 36 emplacements de texte `[S1]` à `[S36]`).
- Règle : plein = pas suivant du visiteur ; froid = étape gratuite, tiède et chaud = Premium ; un plein par écran (hors en-tête), aucune nouvelle variante de bouton, lien texte en niveau 3.
- Encart : vanne + pourquoi + un plein vers la fiche, 400 px max à 375, jamais replié ; bas d'article : bloc de fin, lettre, cluster + « À lire ensuite », FAQ en dernier.
- Accords à obtenir : B2, ligne de lettre repliée, lettre en fin d'étape 1 ; à vérifier au code : parcours-detail, listes, modal, fiches conseil et vidéo ; aucune capture des nouveaux composants encore.
---

