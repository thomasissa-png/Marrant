# Revue design de l'intégration des blocs d'appel s21 (18/10/2026)

> Auteur : @design. Sources : spec `docs/design/cta-forme-place-s21.md`, design system du worktree `agent-a6072b0ac19da7774`, captures `docs/qa/captures-s21/{textes-finaux,fusion-cta,cta-partie-b}/`, `mesures.json`, et lecture du code (`demo-vanne.tsx`, `article-cta.tsx`, `hero-section.tsx`, `premium-cta.tsx`, `premium-modal.tsx`, `modal.tsx`, `bloc-exercice.tsx`, `cta-articles-accueil.ts`). Aucun texte modifié, aucun commit.
> Marquage : **[VU]** = lu sur une capture lisible ; **[MESURE]** = `mesures.json` ; **[CODE]** = lecture du code ; **[CALCUL]** = contraste ou hauteur calculés ; **[NON VÉRIFIABLE]** = pas de preuve visuelle exploitable.

## Verdict : 8 / 10, GO conditionnel

GO : aucune correction ne change un texte, aucune n'est bloquante pour la conversion. Conditions avant mise en ligne : corrections P1 (3) et nouvelles captures (§6). Pour 10/10 : P1 + P2 (§5).

Pourquoi pas plus : (1) le doublon de contour sur les fiches conseil et vidéo contredit la règle « un plein, un contour » ; (2) les trois blocs les plus exposés (encart du milieu B1, bloc de fin B2, haut d'accueil B3) n'ont aucune capture lisible dans le lot : les pleines pages font 10 000 à 16 000 px de haut et sont réduites à 47 à 75 px de large à la lecture ; (3) la capture « fiche-vanne » de `textes-finaux` est une page 404 (375 et 1280).

## 1. Les quatre décisions de @fullstack

| # | Question | Décision | Raison |
|---|---|---|---|
| 1 | B2 : 582 px pour 560 | **Accepter. Le plafond devient 600 px**, avec un invariant plus utile : bouton plein à 450 px ou moins du haut du bloc | [CALCUL] sur article n°1 : padding 20 + surtitre 16 + titre 56 + paragraphe 13 lignes à 20 px (260) = plein à ≈ 380-430 ; le dépassement est entièrement SOUS le plein (lien 44 + note 64). Bloc + en-tête sticky 64 = 646, il tient dans un écran 375×667. Le budget de 560 supposait une vanne de 136 px ; le texte validé (paragraphe de 560 caractères) l'a remplacée. Aucune compaction à faire. Levier si le texte grandit : `p-4 sm:p-6` (-8 px) |
| 2 | Bouton /abonnement sur deux lignes | **Accepter, garder le libellé nommé** | [MESURE] y du bouton inchangé (602,1 à 375, 622,7 à 360), hauteur 64 px (cible tactile large). À 360 le libellé générique passe DÉJÀ sur 2 lignes (64 px) : basculer ne gagne rien à 360 et 16 px à 375. [VU] césure équilibrée « Ouvrir Machine à Café et / les 4 autres · 2,99 €/mois », le prix reste groupé. Bas du bouton à 666 px sur 700 : entier dans l'écran de test. Seul coût : la ligne « Deux étapes… » passe sous le pli à 375×700 (≈ 706 contre 690), sans effet sur le geste |
| 3 | B3 : note sur 4 lignes (64 px) | **Accepter, sous condition mesurée** | 4 × 16 px de `text-xs`, 200 caractères (limite du test), `max-w-md text-balance` [CODE]. Estimation [CALCUL] : plein à ≈ 440-505 px du haut de page à 375, lien 510-575, note 580-640 ; le plein est dans le premier écran 375×667, les pastilles passent sous le pli. Condition : test « bas du plein ≤ 600 px à 375×667 » ; sans capture du haut d'accueil, c'est une estimation (P1-2) |
| 4 | Lien d'accueil de 62 caractères | **Accepter avec un réglage de forme** | [CALCUL] 2 lignes à 375 et 360 (≈ 36-38 caractères par ligne en 16 px semi-gras), hauteur ≈ 64 px ; risque de 3 lignes (96 px) à 320. Le lien n'a ni `text-center` explicite ni `[text-wrap:balance]` [CODE] : ajouter `text-center [text-wrap:balance]` ; la césure ne doit jamais isoler « 2,99 €/mois » (l'espace insécable est déjà dans `POINT_MEDIAN`). Ajouter `lienB3` (hauteur, lignes) à `mesures.json`, et 320 aux largeurs mesurées |

## 2. Respect de « un seul bouton plein par écran »

| Page | Pleins visibles (hors en-tête) | Verdict |
|---|---|---|
| Accueil, haut | 1 (« Tester mes premières répliques, gratuit ») + lien L1 + pastilles | OK [CODE] |
| Accueil, carte Premium | 1 plein Premium + 1 contour, même écran | OK [VU 375 fusion] |
| Article, bloc de fin | 1 (étape 1) + lien L1 + note | OK [VU lot 2, [CODE] s21] |
| Fiches vanne, conseil, vidéo | 1 Premium + 1 contour + 1 lien L2 | OK sur la forme, **doublon de contour** sur conseil et vidéo (P1-1) |
| Murs de liste | 1 plein, 1 contour, « Voir Premium » en L2 sur les cartes verrouillées | OK [VU 375-vannes-mur] |
| /abonnement | 1 plein ; bouton d'en-tête absent [VU 375] | OK |
| Fenêtre Premium | 1 plein, lien L2 [VU 375] | OK |
| /parcours | 1 plein par carte, 5 cartes de ≈ 625 px | Exception (b) respectée |
| Résultat du quiz | 1 plein (parcours conseillé) + lien L1 | OK [VU 375-quiz-absurde] |

Le bouton d'en-tête passe à un libellé de prix seul « 2,99 €/mois » (écart avec le « Commencer » de la spec B6, texte validé par ailleurs) : sans verbe, il se lit comme une étiquette de prix. Exempté, nom accessible fourni [CODE] ; à relire au bilan du 10/11 avec le clic d'en-tête.

## 3. Hiérarchie selon la température

Cohérente partout où je peux la lire : froid = plein gratuit (hero, bloc de fin, /parcours, quiz), tiède = plein Premium puis contour gratuit (carte d'accueil, murs, fiches), chaud = plein Premium seul (/abonnement, fenêtre, fin d'étape 1). Le risque assumé de la spec (§1.3) se confirme à l'œil : le plein gratuit du hero et le plein Premium de la carte d'accueil sont identiques en forme ; le libellé « gratuit » et la présence du prix font la différence. Aucun changement, à relire au bilan.

## 4. Composants

| Composant | Note | Constats |
|---|---|---|
| **DemoVanne** (B1) | 7/10, non vérifié visuellement | [CODE] conforme à la spec : `aside` nommé, `my-10`, carte sans filet violet, objet sombre `bg-background border-border p-4`, un seul bouton `min-h-12` pleine largeur, cible unique. Écart de fond : il montre la situation OFFERTE du carnet (situation + « Tu réponds quoi ? »), sans zone « Pourquoi ça marche » (Z3) ; la note 2 phrases en `text-xs` joue le rôle de Z5. Hauteur estimée [CALCUL] ≈ 390 px à 375 (plafond 400) : **non mesurée** |
| **Carte Premium fusionnée** | 7,5/10 | Plein puis contour dans la carte [CODE]. Défauts : (a) la liste `<ul>` des 5 parcours n'a ni puce ni nom en évidence, lignes centrées et irrégulières, peu scannable ; (b) les 5 parcours sont listés deux fois à moins de 700 px (liste d'intro, puis première puce de `PremiumBenefits`) ; (c) le plein tombe très bas dans la section (introduction de ≈ 14 lignes à 375). (b) touche à un texte validé : décision de Thomas ou @copywriter, non appliquée |
| **Fenêtre en panneau (B11)** | 9/10 | [VU 375×700] panneau collé en bas, coins hauts arrondis, fermeture 44×44 en haut à droite, plein à 543-607, pied `pb-[max(1rem,env(safe-area-inset-bottom))]` [CODE], `items-end sm:items-center` [CODE], bordure violette 2 px. Retrait : « Je m'abonne et j'ouvre toute la / liste » laisse « liste » seul sur sa 2e ligne (le plein de la fenêtre n'a pas `[text-wrap:balance]`) ; lien L2 collé au plein (0 px d'écart) |
| **BlocExercice** | 7,5/10 | [VU 375 et 1280] bon ordre (titre, texte, plein, prix, contour, L2). À 1280 le plein (307 px) et le contour (473 px) sont empilés, alignés à gauche, de largeurs différentes : la spec disait « côte à côte », or la ligne de prix s'intercale ; il faut au moins des largeurs égales |
| **Bloc de fin (B2)** | 8/10 | [VU lot 2 pour l'ancienne version, [CODE] pour s21] un plein, lien L1 `min-h-11`, note ; plus de puces. Pas de vanne dans le bloc (la spec en prévoyait une autre) : texte validé de l'article n°1, non remis en cause |
| **Murs de liste** | 8,5/10 | [VU 375-vannes-mur] plein, prix, contour, cartes floutées avec « Voir Premium » en L2 ; cohérent |
| **Fin d'étape 1** | 8,5/10 | [VU 375-b14] carte « Étape 2 » sans plein, plein unique dessous ; `line-clamp-3` coupe « tout l… » en milieu de phrase, acceptable |

## 5. Corrections pour atteindre 10/10 (dans cet ordre)

Chemins sous `apps/web/src/` ; les noms de fichier non lus sont à confirmer par @fullstack.

**P1 (avant mise en ligne)**
1. **Doublon de contour, fiches conseil et vidéo** [VU 375/1280 fiche-conseil, 375-fiche-video]. Le contour de `BlocExercice` (« Gratuit : un défi à tenter et 5 vannes, étape 1 de Boulot ») et le bouton de la carte « Dans un parcours » (« Lire la première étape gratuite du parcours Boulot ») mènent à la même étape, à 120 px l'un de l'autre. Garder le contour du bloc ; dans la carte « Dans un parcours » (composant `FicheParcoursLien`, à localiser), quand `parcours` est celui de `BlocExercice`, remplacer `buttonVariants({ variant: "outline-accent", … })` par `LIEN_L2` (`components/premium/mur-liste.tsx`) : même libellé, même destination, plus de second bouton. Écart de libellé « du parcours » / « de » déjà noté par la QA : à traiter par @copywriter.
2. **Preuves absentes** (§6) : B1, B2, B3 à 375 et 360, fiche vanne réelle (la capture est une 404), avec mesures de hauteur.
3. **`premium-modal.tsx` ligne 67**, constante `plein` : ajouter `px-4 [text-wrap:balance]` (déjà sur tous les autres pleins multi-lignes).

**P2 (pour le 10/10)**
4. **`bloc-exercice.tsx`** : sur les deux boutons, remplacer `sm:w-auto` par `sm:w-full sm:max-w-lg` (largeurs égales, bords alignés à 1280) ; abandonner l'idée « côte à côte ».
5. **`hero-section.tsx` ligne 101** : ajouter `text-center [text-wrap:balance]` au lien L1 ; extraire une constante unique `LIEN_L1` (aujourd'hui `LIEN_FORT` dans `article-cta.tsx` sans `px-3`, copie avec `px-3 py-2` dans le hero) à côté de `LIEN_L2`.
6. **Anneau de focus du plein** : `button.tsx`, variante `primary`, `focus-visible:ring-accent-secondary-hover` (#7C3AED) donne ≈ **2,9:1** contre une carte #1F1F1F [CALCUL] (3,4:1 sur le fond #0D0D0D) : sous les 3:1 exigés (WCAG 1.4.11) sur DemoVanne, BlocExercice, fenêtre. Remplacer par `focus-visible:ring-accent-link` (#A78BFA, ≈ 7:1), offset 2 px conservé.
7. **`premium-cta.tsx`, liste d'intro** (ligne 85) : `ul` en `mx-auto max-w-md space-y-1 text-left` ; le nom du parcours en `<strong className="font-semibold text-text-primary">` (balisage seul, pas de texte). Décision à prendre par Thomas : retirer la première puce de `PremiumBenefits` sur l'accueil (doublon de la liste).
8. **/parcours** : `mesures.json` signale un débordement sur les 5 cartes à 360, 375 et 1280. Probablement un `line-clamp` ou `overflow-hidden` faussement détecté ; @fullstack confirme ou corrige.

**P3**
9. **`premium-modal.tsx` ligne 106** : `mt-1` entre le plein et le lien L2.
10. **Page 404** (hors s21) : à 375, « Retour à l'accueil » et « Voir les vannes » passent sur deux lignes côte à côte ; empiler (`flex-col sm:flex-row`, `w-full sm:w-auto`) ; bordure du bouton neutre très faible (#2A2A2A sur #0D0D0D).
11. **QA** : ajouter aux tests de garde-fou la hauteur de B2 (≤ 600), la hauteur de DemoVanne (≤ 400), le bas du plein d'accueil (≤ 600 à 375×667) et le lien B3 à 320.

## 6. Contrastes, cibles tactiles, captures

- **Contrastes (site 100 % sombre, un seul mode)** [CALCUL] : blanc sur plein #7C3AED 5,7:1 ; `text-muted` #9A9A9A sur carte 5,9:1 et sur fond 6,9:1 ; `accent-link` #A78BFA sur carte ≈ 6:1 ; bordure `outline-accent` (accent-primary 80 %) ≈ 3,2:1. Seule exception : l'anneau de focus du plein (correction 6).
- **Cibles ≥ 44 px** : pleins `min-h-12` (48), L1 et L2 `min-h-11`, fermeture de la fenêtre 44×44 [CODE, VU]. Conforme.
- **Captures lisibles et exploitées** : 375-abonnement (3 variantes), 1280-abonnement-machine-a-cafe, 375/1280-fiche-conseil, 375-fiche-video, 375-vannes-mur, 375-parcours, 375-quiz-absurde, cta-partie-b 375-b8, b11 (favori, carte), b14, b16. **Non exploitables** : 375-article (15 911 px), 375-accueil (10 045 px), 1280-article, 1280-accueil : trop hautes pour juger l'espacement. `375-fiche-vanne` et `1280-fiche-vanne` : page 404 (mauvaise adresse). `375-fiche-video` : lecteur vidéo blanc (iframe non chargée, artefact de capture). `375-quiz-absurde` : l'en-tête collant apparaît au milieu de la page (artefact de capture pleine page).
- **À produire** : captures de viewport 375×812 et 360×740 (pas de pleine page) : haut d'accueil, encart du milieu, bloc de fin, carte Premium d'accueil ; fiche vanne réelle ; chacune avec la hauteur mesurée du bloc.
- Les 10 critères de Thomas ne se jugent que sur le rendu ; sur les pages lisibles ils passent (PRO, ALIGNÉ, AÉRÉ, HIÉRARCHIE, ACCESSIBLE), sauf critère 8 (CONVERSION) sur fiches conseil et vidéo à cause du doublon de contour. Pour B1, B2 et B3 : **non jugés**, pas de capture.

---
**Handoff → @orchestrator (puis @fullstack, @qa)**
- Fichiers : `/home/user/Marrant/docs/design/revue-cta-s21.md` ; section « Boutons et blocs d'appel (s21) » ajoutée au design system du worktree `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/design/design-system.md`.
- Décisions : B2 accepté (plafond 600, plein à ≤ 450 px) ; bouton /abonnement nommé conservé ; note B3 acceptée sous test ; lien d'accueil accepté avec `text-center [text-wrap:balance]`.
- Points d'attention : doublon de contour fiches conseil et vidéo, anneau de focus 2,9:1, captures de viewport à refaire (B1, B2, B3, fiche vanne), doublon des 5 parcours sur l'accueil (décision Thomas).
---
