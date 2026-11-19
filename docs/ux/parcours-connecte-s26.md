# Parcours, refonte de composition s26 : /parcours et /parcours/[slug] (4 états, 5 largeurs)

Pour @design (traitement) puis @fullstack. Remplace la composition 8/4 de `parcours-vannes-s26.md` §1.2, §1.4 et `docs/design/parcours-vannes-s26.md` §1.2, §2 (les règles de typo, de cadres neutres, d'aplat unique et de cibles 44 px restent). Fondé sur `audit-trajets-connectes-s26.md` §2 bis, §6 (mesures `[MESURÉ]`), le code (`(liste)/page.tsx`, `parcours-espace.tsx`, `quatre-semaines.tsx`, `ton-cap.tsx`, `sommaire-parcours.tsx`, `parcours-detail.tsx` jusqu'à la ligne 780) et les décisions du 14 au 19/11 (`founder-preferences.md`). Interrupteur `ESPACE_CLIENT_PUBLIE` : tout est derrière, rendu fermé identique au caractère près.
Limites : les captures PNG n'ont pas été rouvertes (chiffres repris de l'audit) ; `parcours-content.tsx`, `step-blocks.tsx`, `tes-bonus.tsx` non lus : les points qui en dépendent portent `[À VÉRIFIER @fullstack]`. Zéro libellé neuf : tout est repris de `TEXTES_PARCOURS_ESPACE`, `LISTE_PARCOURS`, `etapeLienTexte`, `LienRetour`.

## 1. Diagnostic (cause commune des 4 défauts)
Une grille 8/4 avec un rail court collé à côté d'une colonne qui fait 3000 px. Le rail (`TonCap`, 175 px) laisse 3009 à 3307 px vides ; la colonne de 8 laisse 317 à 503 px vides entre le rail et « Tes 4 premières semaines » ; sur le parcours, la carte de progression laisse 2665 px. Un rail collant n'y change rien : le vide est visible dès le premier écran et sur toute capture pleine page. Un rail n'a le droit d'exister que si sa hauteur est ≥ celle du bloc voisin du premier écran. Décision : PLUS DE RAIL court sur ces deux pages, tout en largeur 12 colonnes, blocs en rangées.
Cause du « Reprendre » à 375 : le recalage d'ancre (`ancreARecaler`) s'applique avant que la page raccourcisse, et le sommaire (second « Reprendre ») est empilé en tête.

## 2. /parcours, abonné (avancé et nouvel abonné)
Grille de 12 colonnes dès 1024, une colonne dessous. Ordre (DOM = ordre visuel, aucun `order` sauf mention) :
| # | Bloc | 375 | 768 | 1024 / 1280 / 1920 |
|---|---|---|---|---|
| 1 | H1 « Parcours » (blanc, `TITRE_PAGE`) | col 1 | idem | 12 col, à gauche |
| 2 | `AnnonceCap` (si annonce) | pleine largeur | idem | 12 col, `mb-6` |
| 3 | CARTE « EN COURS » : étape à reprendre + `Ton cap` | empilé : étiquette, titre parcours, « Étape n sur N », titre d'étape, barre `n/total`, bouton `Reprendre`, filet, ligne cap | idem, bouton en `sm:w-auto` | 12 col, 2 rangées internes pleine largeur (voir 2.1) |
| 4 | « Tes 4 premières semaines » | 1 col, `details` (existant, ouvert dès 300 px) | grille 2x2 | 12 col, grille 4 colonnes 3/3/3/3, filets verticaux |
| 5 | « Tes bonus » (seulement si un bonus est ouvert) | 1 col | 2 col | 12 col, une carte, bonus en rangée : 1 = ligne texte + action, 2 = 6/6, 3 ou 4 = grille égale `[À VÉRIFIER @fullstack : tes-bonus.tsx]` |
| 6 | H2 « Les parcours » (`P.listeParcours`) puis cartes | 1 col | 2 col | 12 col, 2 col 6/6 ; effectif impair : dernière carte en 12 col avec zones internes 7/5 (existant) |
| 7 | Quiz d'orientation (existant, sous la liste) | 1 col | 1 col | 12 col, une carte pleine largeur : titre et question à gauche, réponses en grille 2 colonnes à droite (1 colonne à 375) |
| 8 | « Explore aussi » | 1 col | 2 col | 12 col, 4/4/4 (2 cartes : 6/6) |
| 9 | FAQ (prix masquée) | 1 col | 1 col | 12 col, titre au-dessus, accordéon pleine largeur (fin du 4/8 : une colonne de titre seul laisse 400 à 600 px vides à gauche) `[À VÉRIFIER : FaqSection disposition]` |

### 2.1 Carte « En cours » (réponse à « où vit Ton cap »)
Choix : Ton cap INTÉGRÉ à la carte d'étape en cours, ni rail ni bandeau séparé. Une carte `CADRE_CARTE_NEUTRE p-6`, deux rangées pleines largeur, aucune colonne :
- Rangée 1 (lg) : à gauche étiquette (`E.enCours` ou `E.conseillee`), titre du parcours (`TITRE_CARTE`), « Étape n sur N » (`META`), titre d'étape (`TEXTE`) ; à droite, centré verticalement, le bouton plein `Reprendre` (nouvel abonné : `Commencer l'étape 1`). Hauteur ≈ 150 px, rien de vide en dessous.
- Filet `border-t`, rangée 2 : barre `BarreProgression` `n/total` du parcours en cours (existant, 8 colonnes) ; puis, sur la même ligne, `Ton cap` en ligne : titre « Ton cap » `META_FORT`, série (flamme neutre), « {nom}, cap n sur 5 », cinq repères neutres (`NEUTRE_CAP`, décision 19/11), phrase d'écart si `ecart`. Wrap propre : 768 en 2 lignes, 375 en 3 lignes (série, cap, repères).
- `TonCap` reçoit une variante `enLigne` (l'id `#cap`, `aria-labelledby="ton-cap-titre"` et le H2 restent). Ses textes, `T.serieZero` pour la série à 0, ne changent pas.
- Un seul aplat violet : `Reprendre`. Pas de second plein dans la page (les cartes en contour, décision 19/11).
- États : chargement des caps = squelette de la carte à hauteur finale (`min-h` égal à la carte rendue, `aria-busy`), zéro saut de mise en page ; échec API = rangée 1 seule (calendrier des 4 semaines reste), pas de rangée 2 ; aucun parcours entamé = étape conseillée, barre absente ; retour après 30 jours = même carte.

### 2.2 Cartes de parcours
Cadre et contenus du design §1.3 (méta sans « · », décision 19/11). Barre `n/total` en tête des cartes commencées. Bouton : contour, jamais le mot « Reprendre » (le seul « Reprendre » de l'écran est celui de la carte « En cours ») ; la carte du parcours en cours porte le bouton contour de ses cartes commencées (libellé existant). Cartes d'une rangée à même hauteur (décision 19/11) SANS `mt-auto` : le vide de fin de carte est mesuré, critère C5.

## 3. /parcours, visiteur et inscrit gratuit (public, ISR)
Même HTML, classes seulement. L'aperçu verrouillé `components/espace/apercu/*` n'est PAS utilisé ici : page publique, contenu lisible (décision `parcours-vannes-s26.md` §0), aucune carte floutée ni « 1 500+ » ajouté ; « 1 500+ » est absent de tous les aperçus de l'espace (décision 19/11, critère C9).
- Ordre : H1 + chapô en 12 col (`max-w-3xl`, une seule colonne, pas de quiz à droite : un quiz de ≈ 260 px à côté d'un chapô de ≈ 160 px laisse ≈ 100 px vides sous le H1 `[HYPOTHÈSE : à mesurer, le critère C3 tranche]`), cartes (6/6, dernière en 7/5), quiz en carte pleine largeur (comme 2 rangée 7), Explore aussi, FAQ. À 375 : H1, chapô, première carte entamée avant y = 812.
- Boutons : contour sur toutes les cartes (« Tester l'étape 1 de {Parcours}, gratuite », décision 19/11) ; le seul plein de l'écran est celui de l'en-tête collant. Inscrit gratuit : même page, sans « Sans compte. ».
- `Ton cap`, 4 semaines, bonus : rien (réservés à l'abonné, côté navigateur après contrôle du plan). Pas de trou à la place : la page est déjà en 12 colonnes sans bloc réservé.

## 4. /parcours/[slug], composition commune
Fin de la colonne de 8 et du rail collant. Grille 12 colonnes dès 1024 :
1. En-tête, rangée haute en 7/5 (lg). Gauche (7) : fil d'Ariane, H1 + méta, description (`argumentaire` sans « Pour qui »). Droite (5) : carte de progression. Dessous 1024 : empilé, la carte passe après la description.
2. « Pour qui ? » et témoignage : rangée 12 col sous l'en-tête, 6/6 (une zone seule = pleine largeur) ; abonné ayant déjà validé une étape ou parcours terminé : après le programme (logique existante `argumentaireApresProgramme`).
3. Programme : étapes en 12 col, rangées pleines. Étape repliée = une ligne (numéro, titre, méta à droite, statut). Étape ouverte : corps en 7/5 à partir de 1024 (texte à gauche, exercice, quiz ou vannes à droite) `[À VÉRIFIER @fullstack : step-blocks.tsx ; si un corps ne se coupe pas en deux zones à ≤ 32 px d'écart, ce corps reste en une colonne de 12 pleine largeur, jamais une colonne de 8 avec 4 vides]`.
4. Carte de fin (parcours terminé) et lettre : 12 col, structure existante.
Carte de progression (zone droite de l'en-tête) :
- Abonné : `SommaireParcours` tel quel (barre, « n sur N étapes », liste, un « Reprendre » plein sur la ligne à reprendre, « Fait » avec coche). C'est LE plein de l'écran. 5 à 6 étapes ≈ 350 px, alignée à la hauteur de l'en-tête gauche (critère C3). Chargement : squelette à hauteur finale.
- Visiteur et gratuit : même carte, liste des étapes (numéro, titre ; étape 1 marquée par `ETAPE_LIBRE_BADGE`), chaque ligne = lien d'ancre `#etape-N`, aucun bouton, aucun cadenas (laissé pour plus tard, 19/11) ; ligne `progressionVisiteurTexte()` en tête. Le plein reste celui de l'en-tête.
- Sous 1024 : abonné, carte réduite à la barre `n sur N étapes` ; la liste et son bouton `Reprendre` passent dans un `details` fermé par défaut (aucun second « Reprendre » visible, T5 à 375) ; visiteur : même `details` fermé.

## 5. Trajets
- « Reprendre » (T5) : `etape.href` = `/parcours/{slug}#etape-{n}`. Arrivée : étape n ouverte, `scrollIntoView({ block: "start", behavior: "instant" })`, `scroll-margin-top` = hauteur de l'en-tête collant + 16 px (137 px à 1280), refait une fois à la fin du chargement abonné ET une fois au premier `ResizeObserver` stable (≤ 600 ms), puis focus `#etape-{n}-entete` en `preventScroll`. Mesure cible : `getBoundingClientRect().top` de la carte = 137 ± 2 px à 375, 768, 1024, 1280.
- Étape → suivante : pied de chaque étape ouverte : lien `etapeLienTexte(n+1, titre)` (existant, cible 44 px, ancre + ouverture, même code que `allerAEtape`) ; après « Valider » : comportement existant (focus et défilement vers l'étape suivante). Dernière étape : pas de lien « suivante », la carte de fin prend la suite.
- Retour : pied de chaque étape ouverte et fil d'Ariane (existant) : `LienRetour` « Retour : Parcours » vers `/parcours#parcours-{slug}` (id posé sur la carte du parcours, `scroll-mt` de l'en-tête) ; la carte retrouvée est entière dans le premier écran. `goBack()` du navigateur : position restaurée (mesuré 100 %). `[À VÉRIFIER @qa]` : l'attribut `id` sur une page publique touche le test d'inertie du HTML (47/47) ; sinon repli `sessionStorage` côté abonné.
- Un seul « Reprendre » : sur /parcours (carte « En cours ») ; sur /parcours/[slug] (sommaire, ≥ 1024) ; aucun à 375 sauf `details` ouvert par l'utilisateur.

## 6. Critères d'acceptation (4 comptes : visiteur, gratuit, nouvel abonné, abonné avancé ; 375, 768, 1024, 1280, 1920 ; `[MESURÉ]` par Playwright, `getBoundingClientRect`)
- C1 Vide en milieu de bloc (bas du contenu d'une carte ou d'une zone moins bas du dernier enfant) ≤ 32 px, toutes cartes, toutes zones internes.
- C2 Aucune colonne ni zone dont le bas est > 32 px au-dessus du bas du bloc voisin de la même rangée (rangée 1 de la carte « En cours », en-tête 7/5, corps d'étape 7/5, quiz).
- C3 Premier écran (1280x800, 1920x1080, 375x812) : aucune zone vide > 32 px de haut sur toute la largeur de 12 colonnes hors marge de page ; hauteur colonne gauche de l'en-tête de /parcours/[slug] moins hauteur de la carte de progression : |écart| ≤ 32 px.
- C4 Alignements au pixel : bords gauche H1 = carte « En cours » = 4 semaines = liste = quiz = FAQ ; bord droit identique (écart 0 px, 1280 et 1920) ; gouttières 24 px ; haut du H1 = haut de la première zone de l'en-tête.
- C5 Cartes d'une même rangée : même hauteur, vide de fin de carte ≤ 32 px ; sinon renvoi @design (réduire la cause), jamais `mt-auto`.
- C6 Un seul plein violet par écran, en-tête collant compris (abonné : `Reprendre` ; visiteur et gratuit : bouton de l'en-tête) ; un seul « Reprendre » visible (compte des éléments nommés, 375 compris).
- C7 Clics : abonné avancé, /parcours -> étape exacte = 1 clic à 375 et à 1280, `scrollY` d'arrivée tel que le haut de la carte d'étape = 137 ± 2 px ; étape suivante = 1 clic ; retour = 1 clic, carte du parcours visible entière. Chaque trajet rejoué avec `goBack()`.
- C8 Hauteur totale : aucune colonne de contenu seule sur 12 colonnes dont le côté droit reste vide sur > 32 px de haut hors paragraphe de texte (chapô, description).
- C9 « 1 500+ » : 0 occurrence dans `components/espace/apercu/*` et `config/textes/espace-apercu.ts` (Grep) ; HTML serveur fermé identique avant et après, HTML ouvert visiteur : différences limitées aux `class` (et à l'`id` de §5 si autorisé), JSON-LD, H1, FAQ, liens `sr-only` à 0 octet.
- C10 WCAG 2.2 AA : clavier complet, focus visible, cibles ≥ 44 px, `aria-busy` et `aria-live` conservés, ordre de tabulation = ordre visuel (pas d'`order` ; le `details` du sommaire à 375 est avant les étapes dans le DOM visuel).
- C11 Relecture à l'aveugle sur trajet enchaîné (accueil, /parcours, Reprendre, étape, suivante, retour), 4 comptes, 2 largeurs, avant toute présentation à Thomas.

## 7. Nielsen (extrait, flows « Reprendre » et « Étape suivante »)
H1 visibilité : PASS (barre `n/total`, « Étape n sur N ») ; H2 vocabulaire : PASS (mots existants) ; H3 contrôle : FAIL aujourd'hui (retour sans ancre, 375), corrigé §5 ; H4 cohérence : FAIL (deux « Reprendre », deux logiques de retour), corrigé §2.2, §5 ; H5 erreurs : PASS (échec API = calendrier seul) ; H6 reconnaissance : PASS ; H7 raccourcis : PASS (ancres) ; H8 minimalisme : FAIL (rail vide), corrigé §1 ; H9 messages d'erreur : PASS (existants) ; H10 aide : PASS.
Cognitive walkthrough (abonné avancé, 375) : `[FRICTION H3]` à l'étape « Reprendre », le first-time user arrive en haut de page. Solution : §5 (recalage double, `details` fermé). `[FRICTION H4]` au retour, il perd sa carte. Solution : `/parcours#parcours-{slug}`. `[FRICTION H8]` à 1280, la colonne de droite est vide dès le premier écran. Solution : §2, §4.
HEART : Task success = clic `Reprendre` puis étape visible ≥ 90 % (événements existants `lien-etape-clic`, `etape-ouverte`) ; Adoption = abonnés qui reprennent depuis /parcours ≥ 60 % (cible du 2.4 existant) ; Happiness = relecture de Thomas (« nickel »), CSAT ≥ 8/10 `[HYPOTHÈSE : pas de mesure CSAT existante]`.

## 8. Handoff
-> @design : traitement de la carte « En cours » (variante `enLigne` de `TonCap`), grille 4 colonnes des semaines, quiz en carte pleine largeur, en-tête 7/5 du parcours, corps d'étape 7/5 ; rendre C1 à C5 mesurables.
-> @fullstack : implémenter derrière l'interrupteur, rendre fermé identique ; lire `parcours-content.tsx`, `step-blocks.tsx`, `tes-bonus.tsx`, `FaqSection` avant les points `[À VÉRIFIER]` ; mesurer avec le script de l'audit.
-> @qa : C7 (trajets rejoués 4 comptes x 2 largeurs) et C9 (inertie HTML).
-> Thomas : accord pour retirer définitivement le rail collant de ces deux pages et pour l'`id` de carte (§5) ; aucun libellé à valider.

## Arbitrage de l'orchestrateur (19/11)

- Retrait du rail collant sur /parcours et /parcours/[slug] : retenu sans le soumettre à Thomas. C'est la réponse directe à sa critique du 19/11 (« pas super aligné », vide de 3000 px) et à sa consigne « que tout soit nickel ».
- `id` des cartes de /parcours pour le retour par ancre : posé SEULEMENT espace ouvert (`ESPACE_CLIENT_PUBLIE`), donc HTML fermé inchangé, inertie 47/47 sans mise à jour. Pas de repli `sessionStorage`.
