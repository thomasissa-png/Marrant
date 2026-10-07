# Audit QA s17 : parcours d'apprentissage en prod (C4, C5, C6, C11)

> @qa, 07/10/2026. Prod https://deviens-marrant.fr (Cloudflare Workers, version 712ee919 ; code lu : 79b11f3). Visiteur anonyme, Chromium Playwright, desktop 1280 px et mobile 375 px (`devices['iPhone 13']`), locale fr-FR. Scripts dans le scratchpad de session (`qa/audit.js`, `flows.js`, `quiz.js`, `quiz2.js`, `entry.js`, `perf.js`, `img.js`, `ev.js`, `small.js`). Captures : `docs/qa/captures-parcours-apprentissage-s17/`.
> Toutes les validations sont **[LIVE]** sauf mention **[STATIQUE]** (lecture du code ou tests jest).

## 1. TL;DR

1. Les 3 parcours et la liste répondent 200, sans erreur console, sans débordement à 375 px, CLS 0, LCP mobile bridé entre 1,6 et 2,7 s. L'étape 1 est entièrement lisible sans compte (conseil, exercice, 2 vidéos intégrées, quiz), et rien du contenu Premium ne fuit (HTML et API vérifiés).
2. **Le blocage parle faux (P1)** : les étapes 2+ disent « Termine l'étape 1 pour débloquer », ce qu'un visiteur ne peut pas faire (valider = Premium). L'aperçu Premium prévu pour ces étapes n'est jamais affiché à un visiteur, donc l'événement `mur-vu` des parcours ne remonte jamais.
3. **Bug de récompense (P1, [STATIQUE])** : toute étape à 100 XP ou plus affiche « Parcours terminé ! ». C'est faux pour l'étape 3 de Répartie et les étapes 3, 4 et 5 de Confiance.
4. Le tunnel visiteur vers Premium fonctionne (bouton de l'étape 1 vers `/abonnement?returnTo=/parcours/<slug>`, 7 points d'entrée sur 8 relient un parcours). En revanche, la partie Premium (progression, fin, parcours suivant) n'est **pas vérifiable en prod** : on la juge seulement par la lecture du code.
5. Tests : 8 suites jest parcours, **123/123 PASS** ; Playwright smoke du repo sur la prod, **112 PASS, 2 ignorés**. Mais le test du mur de l'étape 2 simule un état devenu impossible (compte gratuit ayant validé l'étape 1). C'est pour ça que le bug n° 2 passe au vert.

## 2. Notes par critère

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C4 Parcours bout en bout | **6** | Visiteur : liste, orientation 2 questions, étape 1, quiz, vidéos, bouton Premium avec retour : tout marche (3 parcours × 2 tailles). Impasse de message sur les étapes 2+ (QA-01) ; le quiz dit « Tu peux valider l'étape » (QA-03) ; « 5 vannes sélectionnées » renvoie au catalogue général (QA-04). Premium vers la fin : non vérifié |
| C5 Fonctionnement et bugs | **6** | 0 erreur console, 0 fuite Premium, 404 et 308 corrects. Mais « Parcours terminé ! » à tort (QA-02), XP final affiché sans le bonus (QA-07), API de progression sans contrôle d'ordre ni protection contre le double clic (QA-08), 2 miniatures en 500 une fois sur deux visites (QA-09) |
| C6 UX/UI | **7** | 375 px sans débordement, CLS 0, clavier complet avec focus visible. axe : 1 violation `serious` sur les 3 pages détail (QA-05) ; réponses du quiz signalées par la seule couleur, sans annonce vocale (QA-06) ; bouton principal à 40 px de haut |
| C11 Performance et technique | **7** | Rendu serveur complet de l'étape 1 et aperçu seul des étapes 2+ (curl), cache ISR HIT, LCP desktop 0,6 à 2,0 s, mobile bridé 1,6 à 2,7 s, CLS 0. TTFB variable (0,3 à 1,8 s malgré le cache) et 203 à 213 Ko de JS transféré (au-dessus du budget de 150 Ko) (QA-10) |

## 3. Constats

Format : problème / effet pour l'utilisateur / ce qu'on fait, puis le détail technique.

### QA-01 (P1) Les étapes 2+ disent « Termine l'étape 1 pour débloquer », ce qui est impossible pour un visiteur
- **Problème** : chaque étape suivante affiche un cadenas et « Termine l'étape 1 pour débloquer ». Or un visiteur ne peut pas terminer l'étape 1, puisque la valider est réservé à Premium. Cliquer sur l'étape 2 ne fait rien. Si l'étape 1 est refermée, la page ne montre **plus aucun lien vers Premium** (0 lien, capture `mobile-etapes-fermees.png`).
- **Effet pour l'utilisateur** : Yanis fait le quiz, voit « Tu peux valider l'étape », ne peut pas, et l'étape 2 reste muette. La vraie raison (Premium) n'apparaît qu'en bas de l'étape 1. Il conclut que le site est cassé, ou qu'il faut un compte gratuit qui n'existe plus.
- **Ce qu'on fait** : pour un non-abonné, afficher « Réservé Premium » sur les étapes 2+ et les laisser s'ouvrir sur l'aperçu déjà codé (ce qu'on y apprend, format, bouton « S'abonner »).
- Détail : `parcours-detail.tsx:538-544` évalue le verrou séquentiel (`isSequentiallyLocked`) avant le verrou Premium. Un visiteur n'a aucune progression, donc ses étapes 2+ sont toutes en `canExpand=false` et `LockedStepPreview` (l.92-120 : aperçu, CTA, événement `mur-vu`) n'est **jamais rendu** pour lui. Constaté [LIVE] sur 3 parcours × 2 tailles : après le clic, texte inchangé et 0 `role=button`. Le test jest qui couvre ce mur (`parcours-detail.test.tsx:490`) le simule avec un compte FREE ayant `completedSteps:[1]`, un état impossible depuis s15. Agent : @fullstack (+ test à réécrire en visiteur), effort rapide.

### QA-02 (P1, [STATIQUE]) « Parcours terminé ! » s'affiche au milieu du parcours
- **Problème** : le message de gain d'XP ajoute « Parcours terminé ! » dès que l'étape rapporte 100 XP ou plus.
- **Effet pour l'utilisateur** : un abonné qui valide l'étape 3 de Répartie (100 XP) ou les étapes 3, 4 et 5 de Confiance (100, 125, 150 XP) lit « Parcours terminé ! » alors qu'il lui reste des étapes. La récompense ment, au cœur de la gamification promise à Marc.
- **Ce qu'on fait** : n'afficher « Parcours terminé » que si l'API renvoie `pathCompleted: true`.
- Détail : `parcours-detail.tsx`, notification XP : `xpGained.xp >= 100 ? "s ! Parcours terminé !" : "s !"`. XP du seed : Répartie [50, 75, 100, 150], Confiance [50, 75, 100, 125, 150, 200]. Non reproductible en prod (compte Premium nécessaire). Aucun test ne le couvre. Agent : @fullstack, rapide.

### QA-03 (P2) Le quiz de l'étape 1 dit « Tu peux valider l'étape » à un visiteur qui ne le peut pas
- **Problème** : en fin de quiz : « Sans faute ! Tu peux valider l'étape » (ou « 2/4 bonnes réponses… Tu peux valider l'étape »), puis « Quiz bouclé, tu peux valider l'étape ». Juste en dessous : « Valider l'étape fait partie de Premium ».
- **Effet pour l'utilisateur** : deux messages contradictoires, l'un à la suite de l'autre (capture `mobile-apres-quiz-visiteur.png`).
- **Ce qu'on fait** : pour un non-abonné, conclure le quiz par une phrase qui mène à l'offre (« Pour garder tes XP et débloquer l'étape 2 : Premium ») au lieu de « tu peux valider ». Texte à faire valider par @copywriter.
- Détail : `StepQuiz` (l.155-170) et le bloc `isQuizDone` ignorent `isPremium`. Le quiz réussi est bien gardé dans `sessionStorage` (`parcours-quiz-done:<slug>`), y compris après un rechargement [LIVE]. Agent : @fullstack + @copywriter, rapide.

### QA-04 (P2) « 5 vannes sélectionnées pour ce module » mène au catalogue général
- **Problème** : chaque étape annonce 5 vannes choisies, mais le lien « Découvre-les dans le catalogue » ouvre `/vannes` (toutes les vannes, 10 libres puis un mur). Les 5 vannes ne sont montrées nulle part.
- **Effet pour l'utilisateur** : la promesse « sélectionnées pour ce module » n'est pas tenue. Le visiteur tombe sur un mur sans rapport avec l'étape.
- **Ce qu'on fait** : afficher les 5 vannes de l'étape (au moins celle de l'étape 1, qui est libre) ou des liens directs vers leurs fiches.
- Détail : `JokeTeaser` (l.244-260) n'utilise que `jokeIds.length`. Les `jokeIds` existent dans le seed (ex. étape 1 Machine à Café : 7, 83, 41, 64, 99). Agent : @fullstack, moyen.

### QA-05 (P2) axe : nom accessible de l'en-tête d'étape différent du texte visible
- **Problème** : l'en-tête de l'étape 1 (bouton qui ouvre ou ferme l'étape) annonce « Étape 1 : Des vannes courtes… », alors que le texte visible contient aussi « +50 XP Lecture libre ».
- **Effet pour l'utilisateur** : une personne qui pilote à la voix (« clique Lecture libre ») ne peut pas l'activer.
- **Ce qu'on fait** : inclure le texte visible dans le libellé ou retirer l'`aria-label`.
- Détail : axe 4.14, règle `label-content-name-mismatch` (serious), 1 nœud `div[role="button"]` sur les 3 pages détail × 2 tailles. 0 violation sur `/parcours` et la 404. Le smoke du repo `accessibilite.spec.ts` (mêmes tags WCAG) passe sur la prod avec axe 4.11.1 (`apps/web/node_modules`). L'écart vient très probablement de la version : la règle n'est remontée qu'avec axe 4.14.0 `[À VÉRIFIER : statut « experimental » de la règle en 4.11]`. Monter axe-core dans le repo pour que la CI la voie. Agent : @fullstack, rapide.

### QA-06 (P2) Quiz : bonne ou mauvaise réponse indiquée seulement par la couleur
- **Problème** : après un clic, la bonne réponse passe en vert et la mauvaise en rouge, sans icône, sans texte et sans annonce vocale. Aucune explication de la bonne réponse.
- **Effet pour l'utilisateur** : un daltonien ou un utilisateur de lecteur d'écran ne sait pas s'il a juste. Tout le monde perd le « pourquoi », alors que c'est le moment où l'on apprend.
- **Ce qu'on fait** : ajouter « Bien vu » / « Pas tout à fait » avec une icône, dans une zone `aria-live`, et une phrase d'explication par question (contenu @copywriter).
- Détail : [LIVE] classes `text-success` / `text-error`, 0 région `aria-live` remplie (`quiz2.js`). WCAG 1.4.1 et 4.1.3. Agent : @fullstack + @copywriter, moyen.

### QA-07 (P2, [STATIQUE]) Le total d'XP affiché ne compte pas le bonus de fin
- **Problème** : l'API ajoute 100 XP de bonus quand le parcours est fini, mais la carte « Bravo » affiche la somme des étapes (225 XP pour Machine à Café au lieu de 325). La liste annonce « 225 XP à gagner ».
- **Effet pour l'utilisateur** : chiffres incohérents entre le profil et la page.
- **Ce qu'on fait** : afficher le total réel (étapes + bonus), ou supprimer le bonus.
- Détail : `progress/route.ts` (`increment: 100`) contre `totalXp` (somme de `moduleXp`) dans `parcours-detail.tsx`. Agent : @fullstack, rapide.

### QA-08 (P2, [STATIQUE]) API de progression : pas de contrôle d'ordre, double XP possible
- **Problème** : un abonné peut valider l'étape 3 sans les étapes 1 et 2 (seule l'interface impose l'ordre). Deux clics simultanés peuvent compter l'étape et ses XP deux fois. La limite de 10 validations par minute est gardée en mémoire et ne tient pas sur Cloudflare (plusieurs instances).
- **Effet pour l'utilisateur** : faible pour un utilisateur honnête. Les XP et le classement deviennent manipulables.
- **Ce qu'on fait** : refuser une étape si la précédente n'est pas validée, verrouiller la ligne de progression (ou contrainte d'unicité), et utiliser `sharedRateLimit` comme pour la connexion.
- Détail : `app/api/parcours/[id]/progress/route.ts` (lecture `existingProgress` puis `push` sans verrou, `rateLimit` en mémoire). Agent : @fullstack, moyen.

### QA-09 (P2) Miniatures vidéo en erreur 500, par intermittence
- **Problème** : lors de 2 visites de `/parcours/confiance` (desktop et mobile), les 2 miniatures de l'étape 1 ont répondu 500 via l'optimiseur d'images (`/_next/image?url=…i.ytimg.com…`).
- **Effet pour l'utilisateur** : vignettes vides à la place des vidéos de Pierre Croce et Roman Frayssinet.
- **Ce qu'on fait** : surveiller le taux d'erreur de `/_next/image` sur Cloudflare et, pour YouTube, servir directement `i.ytimg.com` (`unoptimized`).
- Détail : non reproduit ensuite (44/44 en 200 sur 12 visites, 12/12 en curl). Les 26 vidéos des 3 parcours sont en ligne (oEmbed 200, miniature 200). Agent : @infrastructure, rapide.

### QA-10 (P2) Temps de réponse serveur irrégulier et JS au-dessus du budget
- **Problème** : malgré le cache (`x-nextjs-cache: HIT`), le premier octet arrive entre 0,3 et 1,8 s selon la visite. Chaque page charge 203 à 213 Ko de JavaScript compressé.
- **Effet pour l'utilisateur** : pages correctes aujourd'hui (LCP < 2,7 s même en mobile bridé), mais sans marge sur un vieux téléphone en 4G faible.
- **Ce qu'on fait** : vérifier que le cache Cloudflare sert bien ces pages en edge, et alléger le JS des pages parcours.
- Détail : desktop non bridé, TTFB 1 098 à 1 779 ms au 1er passage, puis 340 à 682 ms en mobile ; mobile bridé (CPU ×4, 1,6 Mb/s, 150 ms) : TTFB 517 à 1 643 ms, LCP 1 628 à 2 668 ms. Lighthouse non lancé. Agent : @infrastructure, moyen.

### QA-11 (P2) Page 404 d'un parcours inexistant : sans menu et avec des balises contradictoires
- **Problème** : `/parcours/slug-inexistant` renvoie bien 404 avec « Oups, cette page a oublié sa punchline ». Mais la page n'a ni en-tête ni pied de page, ni lien vers les parcours, et son HTML contient à la fois `noindex` et `index, follow`.
- **Effet pour l'utilisateur** : seules issues proposées : « Retour à l'accueil » et « Voir les vannes ».
- **Ce qu'on fait** : ajouter un lien « Voir les parcours » sur la 404 des parcours et ne garder que `noindex`.
- Détail : curl, 0 `<header>`, deux `<meta name="robots">`. Majuscules : `/parcours/MACHINE-A-CAFE` donne 404 ; barre finale : 308 vers l'URL propre. Agent : @fullstack, rapide.

### QA-12 (P2, C9) La mesure du parcours s'arrête à la page vue
- **Problème** : sur une page parcours, un visiteur ne déclenche qu'une page vue. Le quiz terminé, la vidéo lancée et le clic sur une étape verrouillée ne déclenchent aucun événement. Le seul événement suivant est `abonnement-vu {src: parcours-etape}`, une fois arrivé sur /abonnement. Le `mur-vu` des parcours, compté dans le rapport du lundi, ne peut jamais partir pour un visiteur (QA-01).
- **Effet pour l'utilisateur** : aucun direct. Mais on ne saura pas combien de visiteurs lisent l'étape 1 jusqu'au bout avant de partir.
- **Ce qu'on fait** : après QA-01, ajouter 2 événements (`parcours-quiz-fini`, `parcours-video`) au plan de tracking. À cadrer par @data-analyst.
- Détail : [LIVE] `ev.js` : pageview, puis rien après le clic sur la vidéo et le clic sur l'étape 2, puis `abonnement-vu`. Seuls `parcours-etape` (validation Premium) et `mur-vu` existent dans `components/parcours`.

### QA-13 (P2, C4/C12) Petites promesses non tenues autour des parcours
- Blog : « Lire la première étape d'un parcours » (bloc fin d'article, 3 articles testés) mène à la **liste** `/parcours`, pas à une étape 1. Effet : un clic de plus et une promesse approximative. Correction : pointer vers l'étape 1 du parcours lié à l'article (le lien principal le fait déjà, ex. `/parcours/repartie`). @fullstack, rapide.
- `/abonnement` (H1 « Accéder aux parcours complets ») ne propose aucun lien vers un parcours dans le contenu (seulement le menu et le pied de page). Effet : impossible de voir ce qu'on achète sans repartir. @ux / @fullstack, rapide.
- Quiz humour : 1 profil sur 5 recommande les parcours, vers la liste générale et jamais vers l'un des 3 parcours (`components/quiz/quiz-data.ts:56`, [STATIQUE]). @product-manager, rapide.
- La barre « 0/3 étapes complétées » s'affiche au visiteur alors qu'elle ne peut pas bouger pour lui. À remplacer par « Étape 1 offerte, 2 à 3 avec Premium ». @ux, rapide.

## 4. Mesures brutes

**Pages (Playwright, 1er passage, contexte neuf)**

| Page | HTTP | Console | Requêtes KO | Débordement 375 | LCP desktop / mobile (ms) | CLS | JS (Ko) | axe |
|---|---|---|---|---|---|---|---|---|
| /parcours | 200 | 0 | 0 | non (375/375) | 1 384 / 864 | 0 | 212 / 203 | 0 |
| /parcours/machine-a-cafe | 200 | 0 | 1 prefetch `/vannes?_rsc` annulé (bénin) | non | 1 400 / 612 | 0 | 212 / 203 | 1 serious |
| /parcours/repartie | 200 | 0 | 0 | non | 1 984 / 716 | 0 | 212 / 203 | 1 serious |
| /parcours/confiance | 200 | 0 | 0 (2 × 500 miniatures lors d'un autre passage, QA-09) | non | 1 720 / 552 | 0 | 213 / 203 | 1 serious |
| /parcours/slug-inexistant-qa | 404 | 1 (le 404 lui-même) | – | non | 1 708 / 1 516 | 0 | 181 | 0 |

Mobile bridé (CPU ×4, 1,6 Mb/s, 150 ms, 2 passages) : LCP /parcours 1 628 et 2 508 ; machine-a-cafe 2 132 et 1 888 ; repartie 2 668 et 1 748 ; confiance 1 916 et 1 948 ms ; CLS 0 partout, après défilement.

**Rendu serveur (curl) contre rendu après JS** : le HTML serveur contient tout le contenu de l'étape 1 (conseil, exemple, exercice, quiz avec réponses, vidéos), les titres et l'XP des étapes 2+, et **aucun** contenu des étapes 2+ (`moduleDetail` et quiz absents, vérifié pour les 13 étapes). Même résultat sur `GET /api/parcours/by-slug/<slug>` en visiteur : étapes 2+ en `locked:true`, `Cache-Control: private, no-store`. Seul ajout après JS : `GET /api/auth/session`.

**Ce qui est accessible sans compte** : étape 1 des 3 parcours, lisible en entier (vidéos YouTube intégrées en youtube-nocookie, lecture sur place), quiz jouable avec score. La validation de l'étape renvoie vers `/abonnement?returnTo=%2Fparcours%2F<slug>&src=parcours-etape` (H1 « Accéder aux parcours complets », 200). Étapes 2+ : cadenas, non ouvrables (QA-01).

**Boutons et liens** : « Commencer ce parcours » ×3 vers la bonne page détail (66 à 78 ms, navigation côté client ; ce sont des `<button>` et non des liens, donc pas d'ouverture dans un nouvel onglet). Orientation : 2 questions, puis « Ton point de départ : Parcours Machine à Café » avec « Voir ce parcours » et « Refaire le quiz ». « Jette un œil au parcours suivant » enchaîne Machine à Café, Répartie, Confiance, puis revient à Machine à Café. 26/26 vidéos en ligne. 0 lien cassé sur les pages parcours.

**Points d'entrée (desktop et mobile)**

| Page | Liens vers les parcours | Fonctionnels |
|---|---|---|
| Accueil | 6 liens dans le contenu (3 situations + 3 cartes) vers les 3 parcours, en plus du menu et du pied de page | oui (200) |
| Menu (header) | « Parcours » (desktop, et menu burger sur mobile) | oui |
| Pied de page | « Parcours » sur toutes les pages testées | oui |
| Blog `comment-avoir-de-la-repartie` | `/parcours/repartie` ×2, `/parcours` (« Lire la première étape… »), « Passer à Premium » avec `returnTo=/parcours` | oui (QA-13) |
| Blog `comment-devenir-drole` | « Commencer le parcours Répartie », `/parcours`, Premium | oui |
| Blog `meilleures-blagues-droles-2026` | `/parcours/machine-a-cafe` ×2, `/parcours` ×2, Premium | oui |
| /blog, /conseils | bloc « Parcours structurés » vers /parcours | oui |
| /abonnement | aucun dans le contenu (QA-13) | – |
| /quiz-humour | « parcours structurés » vers /parcours dans le texte | oui |
| /vannes, /videos | menu et pied de page seulement | – |
| /onboarding | redirige vers /abonnement (choix s15) | – |

**Tests automatisés**
- Jest (dépendances installées en 38 s) : `api/parcours-by-slug-premium`, `api/parcours-progress`, `feature/parcours-detail`, `feature/parcours-list`, `feature/parcours-user-simulation`, `feature/blog-article-parcours-maillage`, `ui/progress-bar-aria-s16`, `feature/suppression-compte-gratuit-s15` : **8 suites, 123 tests PASS** (3,8 s). Autres suites qui mentionnent les parcours (non lancées) : json-ld, blog-article-tracking, markdown-renderer, humor-quiz, viral-quiz, abonnement-page, premium-modal, offre-s16-lot-c, corrections-s16-lot-f, etc.
- Trous : aucun test pour le visiteur anonyme face aux étapes 2+ (QA-01), pour le message « Parcours terminé » (QA-02), pour l'ordre des étapes et la double validation côté API (QA-08).
- Playwright du repo (`playwright/tests/smoke`, projets desktop + iphone-13, `@achat` exclu) contre la prod : **112 PASS, 2 ignorés**, 2,4 min.

## 5. Vérifié / Non vérifié (G_PROOF)

**Vérifié [LIVE]** : codes HTTP, console, réseau, débordement, LCP/CLS, axe des 5 URL × 2 tailles ; contenu serveur (curl) et API en visiteur (aucune fuite Premium) ; orientation, « Commencer », quiz complet (juste/faux, score, mémoire de session après rechargement), lecture vidéo intégrée, étape 2 non ouvrable, bouton Premium vers /abonnement avec `returnTo` ; points d'entrée de 11 pages × 2 tailles ; 26 vidéos ; navigation clavier (30 Tab, focus visible partout) ; événements Umami (interceptés localement) ; jest 123/123 ; smoke 112/112.

**Vérifié [STATIQUE]** : QA-02, QA-07, QA-08, la chaîne `returnTo` jusqu'après paiement (`lib/premium-return.ts`, `api/stripe/checkout`, `abonnement/success`), la règle d'accès (`lib/parcours-access.ts` : lecture étape 1 libre, étapes 2+ et toute validation réservées Premium, refus 403 côté API).

**Non vérifié** : tout le parcours Premium en prod (déblocage après paiement, validation, XP, streak, fin de parcours, parcours suivant), car interdit sans compte. Également : Safari réel, paysage, zoom 200 %, lecteur d'écran, INP, Lighthouse, résultat du quiz humour (12 questions non jouées).

**Effets de bord de l'audit (transparence)** :
- Le smoke Playwright du repo, lancé sur la prod, **soumet des formulaires** : 4 connexions avec un compte inexistant, 1 « mot de passe oublié » sur une adresse `@example.invalid` (aucun e-mail envoyé, aucun compte existant), 2 réinitialisations avec un faux jeton. Cela va au-delà de la consigne « aucun formulaire ». Conséquence probable : quelques lignes temporaires de limitation d'essais (`jobLock`, clés hachées, expiration automatique) dans la base Neon. Aucun compte, abonnement ni e-mail créé.
- Premier passage de `audit.js` : l'interception Umami visait `cloud.umami.is` alors que l'envoi part vers `gateway.umami.is`, donc **10 pages vues de test** sont parties dans Umami le 07/10 vers 13h43 UTC (5 URL parcours × 2 tailles). Corrigé pour tous les passages suivants. Le smoke du repo intercepte Umami.

## 6. Handoff

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/marrant/audit-parcours-apprentissage-s17/qa.md` ; captures `/home/user/Marrant/docs/qa/captures-parcours-apprentissage-s17/` (pages en haut et en entier × 2 tailles, orientation, après quiz, étapes fermées, quiz résultat, bloc blog).
- Décisions prises : seuils LCP 2,5 s desktop / 3 s mobile, budget JS 150 Ko, axe WCAG 2.2 AA (axe 4.14.0) ; aucune modification de code ni commit.
- Priorités : QA-01 et QA-02 (@fullstack, rapides, avec tests jest en visiteur et sur un parcours de 4 à 6 étapes) ; QA-03 et QA-06 (@fullstack + @copywriter) ; QA-12 (@data-analyst) après QA-01 ; QA-09 et QA-10 (@infrastructure).
- Points d'attention : le smoke du repo n'est pas strictement en lecture seule sur la prod (formulaires d'auth) : à baliser `@ecriture` ou à réserver à une préproduction. Monter axe-core dans le repo (QA-05). Validation Premium non testable sans un compte Premium de test en mode Stripe test (déjà demandé en s16).
---
