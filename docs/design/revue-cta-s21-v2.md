# Revue design v2 des blocs d'appel s21 (18/10/2026)

> Auteur : @design. Sources : ma revue `docs/design/revue-cta-s21.md` (v1, 8/10), `docs/qa/qa-cta-s21-v2.md` et captures `docs/qa/captures-s21-v2/` (worktree `agent-a6072b0ac19da7774`, branche `claude/marrant-s21-integration` @ `9568ed0`). Code relu seulement pour trois points : `premium-modal.tsx`, `button.tsx`, `plan-selector.tsx`. Aucun texte ni code modifié.
> Marquage : **[VU]** capture lisible ; **[VU basse résolution]** pleine page réduite (le haut d'accueil à 375 est lu à 75 px de large : ordre de grandeur seulement) ; **[CODE]** ; **[MESURE]** chiffre de la QA ; **[NON VÉRIFIABLE]** aucune capture exploitable.

## Verdict : 8,5 / 10, GO (aucun bloquant)

Les blocs lisibles tiennent : un seul plein, libellés longs entiers à 320 px, hiérarchie plein / contour / lien cohérente. Les deux défauts de la v1 qui comptaient (doublon de contour, anneau de focus) sont corrigés. Il reste, avant mise en ligne : le vide de 60 px de `/abonnement` (il fait sortir le bouton du premier écran pour le compte sans abonnement) et trois blocs jamais capturés en viewport.

Pourquoi pas 9 : (1) B1 (encart du milieu), B3 (haut d'accueil à 375/360) et la fenêtre B11 n'ont toujours aucune capture lisible, alors que ce sont les blocs les plus exposés (56 % de vues pour B1) ; (2) bouton de `/abonnement` hors du premier écran 375×700 pour le compte connecté ; (3) titre B2 sur 3 lignes à 320 px, bloc de 652 px.

## 1. Points de la v1

| # | Point v1 | Statut | Preuve |
|---|---|---|---|
| P1-1 | Doublon de contour fiches conseil et vidéo | **Corrigé sur la fiche vanne ; conseil et vidéo non vérifiables** | [VU] fiche vanne 375 et 1280 : 1 plein (« Écrire la mienne avec Premium »), 1 contour (« Gratuit : 5 vannes et un défi, étape 1 de Répartie »), 1 lien L2, « Partager » en contour (m7). Aucune capture de fiche conseil ni vidéo dans le lot v2 ; la QA l'affirme sans image |
| P1-2 | Preuves absentes | **Partiel** | Fiche vanne réelle fournie (3 profils × 4 largeurs). B2, E1, E2, E3, E4 capturés à 320/360/375/1280. **Toujours absents : B1, B3 en viewport, B11** |
| P1-3 | `premium-modal.tsx` : `px-4 [text-wrap:balance]` sur le plein | **Corrigé [CODE]** ligne 67 | Fenêtre non capturée en v2 |
| P2-4 | `BlocExercice` : deux boutons de même largeur à 1280 | **Corrigé** | [VU 1280 fiche vanne] plein et contour de même largeur (≈ 307 px), bords alignés |
| P2-5 | Lien L1 d'accueil `text-center [text-wrap:balance]`, constante `LIEN_L1` | **Non vérifiable** | Haut d'accueil 375 illisible (pleine page 10 045 px) ; à 1280 [VU] lien et plein bien ordonnés |
| P2-6 | Anneau de focus du plein (2,9:1) | **Corrigé [CODE]** | `button.tsx` : `focus-visible:ring-accent-link` (#A78BFA) |
| P2-7 | Liste d'intro de la carte Premium d'accueil | **Partiel** | [VU E2 320] noms de parcours en gras, liste alignée à gauche, lisible. Les 5 parcours restent listés deux fois à moins de 700 px (liste d'intro, puis 1re puce) : décision de Thomas, toujours en attente |
| P2-8 | Débordement signalé sur /parcours | **Résolu côté mesure** | QA : 0 élément débordant sur 196 pages |
| P3-9 | `mt-1` plein / lien L2 de la fenêtre | **Corrigé [CODE]** ligne 107 | Fenêtre non capturée |
| P3-10 | 404 (hors s21) | Non traité, non vérifié | hors périmètre |
| P3-11 | Tests de hauteur B2, DemoVanne, plein d'accueil, lien B3 à 320 | Non vérifié | B2 mesuré par la QA (652/584/548/366) ; DemoVanne et lien B3 toujours non mesurés |

## 2. Vérifications demandées

1. **Un seul plein par écran, L1/L2 cohérents : OK** sur tout ce qui est lisible. [VU] E1 carnet (1 plein, note), E2 carte connectée (plein Premium puis contour gratuit, l'ordre de la spec), B2 (plein gratuit, lien L1 souligné, note), fiche vanne, E4 profil (1 plein seul), E3 `/abonnement` (1 plein, bouton d'en-tête absent). Le plein reste plus dominant que le contour partout (couleur et surface). L1 (blanc, souligné violet) et L2 (violet clair souligné) restent distincts et utilisés à leur place.
2. **Bouton payant visible sans défiler (375×700, barres Safari comprises, critère du commentaire de `abonnement-view.tsx`)** :
   - **Visiteur : OK.** [VU basse résolution] bas du bouton ≈ 650 px à 375 (1 ligne), ≈ 675 à 320 (2 lignes).
   - **Compte sans abonnement : NON à 375 (≈ 742 px) et à 320 (≈ 783 px)**, oui à 812 de haut. [VU] `bloc-E3-*-360/320`. Cause : paragraphe E3 plus long (validé) + vide de 60 px (point 4). Hero d'accueil : plein bas ≈ 455-510 px à 375 [VU basse résolution], donc dans le premier écran. E4 `/profil` : bouton à ≈ 970 px, sous le pli, sans exigence de spec (page de réglages), acceptable.
3. **Libellés longs à 320 px : OK, aucune coupure.** [VU] « Voir les 14 autres / répliques · 2,99 €/mois » (E1, même hauteur pour « 29 », capture de novembre à 375), « Ouvrir les 5 parcours · / 2,99 €/mois » (B2 en lien L1, E2, E3), le prix toujours groupé sur la même ligne. La version annuelle « · 24,99 €/an » est plus courte d'un caractère que le mensuel (texte 4/4 par la QA, pas de capture visuelle). Détail : le « · » reste en fin de première ligne, sans gravité.
4. **Vide d'environ 60 px sur `/abonnement` : confirmé, défaut de forme [VU].** 320 : 670 → 735 px ; 360 : 600 → 663 px ; visiteur 375 : ≈ 65 px. Il n'est pas aléatoire : `plan-selector.tsx` lignes 107-126 réserve dans une grille la hauteur de la plus haute des deux formules (annuel : ligne d'économie + « Payé en une fois, renouvelé chaque année, résiliable depuis ton profil », soit 2 à 4 lignes) alors que le mensuel n'en occupe que 2. C'est mon garde-fou m2 (« le bouton ne bouge plus ») : le principe reste bon, le coût est trop haut. Le bouton paraît flotter et sort du premier écran (point 2).
5. **Titre B2 à 320 px sur 3 lignes : accepter.** [VU] « La vanne qui sort / de ta bouche, pas / de ton téléphone », césure équilibrée, rien de coupé. Coût : bloc 652 px, plein à 425-487 px du haut du bloc (l'invariant « plein à ≤ 450 px » passe de justesse à 375, pas à 320). 320 px est une largeur marginale ; la règle de 600 px s'applique à partir de 360 (584) et 375 (548). Pas de correction de code ; l'écrire dans la spec comme exception « 320 px : 3 lignes tolérées ». Petit défaut de rythme [VU 320] : paragraphe du bloc en coupes irrégulières (« défi à / tenter, en vrai ou à l'écrit. » puis « La première… ») ; `text-wrap: pretty` à envisager, sans urgence.
6. **Bouton d'en-tête « 2,99 €/mois » plein, dans le même écran qu'un autre plein sur l'accueil : décision confirmée, avec une réserve à mesurer.** [VU 1280] le hero porte un plein de ≈ 345 × 55 px au centre, l'en-tête un bouton de ≈ 100 × 36 px au coin : la hiérarchie tient par la taille, la position et le fait que l'en-tête est du chrome (exempté, spec §1.3 exception a). [VU 375] sur `/carnet` et la fiche vanne, l'en-tête est le seul plein du premier écran : il fait son travail. Réserve : sur l'accueil, deux pleins violets identiques dans le premier écran, l'un « gratuit » (hero), l'autre « 2,99 €/mois » (payant). À relire au bilan du 10/11 : si le clic d'en-tête reste à 2 sur 28 jours ou si l'étape gratuite est suivie d'abandons, passer l'en-tête en `outline-accent` sur l'accueil seulement. Pas de changement maintenant.

## 3. Demandes classées

**Bloquant : aucune.**

**À corriger avant mise en ligne**
1. **Vide de 60 px sur `/abonnement`** (`apps/web/src/components/premium/plan-selector.tsx`, grille lignes 107-126, et `abonnement-view.tsx` ligne 267-295). Garder l'absence de saut du bouton, mais ne réserver que la hauteur de la ligne d'économie (1re ligne de la formule annuelle) ; sortir « Payé en une fois, renouvelé chaque année… » de la grille réservée et l'afficher sous le bouton, dans la zone de réassurance (ce qui bouge sous le bouton ne déplace rien sous le pouce). Objectif : écart prix-bouton de 16 à 24 px, bouton du compte connecté à ≈ 680 px à 375 et à ≤ 667 px à 360, de quoi remonter dans l'écran 375×700. Aucun texte modifié, un texte déplacé. Vérifier à 320 : bascule Mensuel/Annuel sans saut du bouton.
2. **Captures de viewport manquantes** (QA, pas de code) : B1 encart du milieu (article n°1, 375×812 et 360×740, avec hauteur mesurée, plafond 400), B3 haut d'accueil (375×812 et 360×740, bas du plein ≤ 600 px, lien d'accueil à 320), fenêtre B11 (375×700), fiches conseil et vidéo (confirmer l'absence de doublon de contour). Sans elles, B1, B3 et B11 restent « non jugés » sur les 10 critères.

**Plus tard**
3. **Bouton d'en-tête sur l'accueil** : relire au bilan du 10/11 (point 2.6), `components/layout/` du bouton d'en-tête (fichier à confirmer).
4. **Doublon des 5 parcours sur l'accueil** (liste d'intro + 1re puce de `PremiumBenefits`, `components/home/premium-cta.tsx`) : décision Thomas, toujours en attente.
5. **E1 et E2** : le plein arrive après ≈ 650 px de contenu (liste d'avantages) ; titre et bouton jamais dans le même écran 812 à 375. Raccourcir la liste commune des avantages Premium est un choix de texte : hors de ma mission.
6. **Plan selector à 320 px** : « Annuel » passe sous « Mensuel » et la pastille « plus de 3 mois offerts » sur une troisième ligne ; lisible mais haut. À reprendre en même temps que la demande 1 (`flex-wrap` du sélecteur).
7. **Hauteurs de garde-fou** : tests QA pour B2 ≤ 600 px dès 360 px, DemoVanne ≤ 400, bas du plein d'accueil ≤ 600 à 375×667.
8. Points de la QA hors design, repris pour mémoire : MJ-1 (source du bouton E1 du carnet), m-b (nom de source de la carte d'accueil connectée), m-c et m-d (textes, à valider à l'aveugle).

---
**Handoff → @orchestrator (puis @fullstack, @qa)**
- Fichier : `/home/user/Marrant/docs/design/revue-cta-s21-v2.md`.
- Décisions : note 8,5/10, GO sans bloquant ; titre B2 à 3 lignes à 320 px accepté (exception écrite) ; bouton d'en-tête plein confirmé, à relire au bilan du 10/11 ; vide de /abonnement à corriger (1 demande de code, @fullstack).
- Points d'attention : B1, B3, B11 et fiches conseil/vidéo à capturer en viewport (@qa) ; /abonnement compte connecté sous le pli à 375×700 ; MJ-1 reste ouvert côté QA.
---
