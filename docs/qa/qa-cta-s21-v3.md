# QA v3 des blocs d'appel s21 : contre-épreuve avant le lien de test

> @qa, session 21, 18/10/2026. Branche testée : `claude/marrant-s21-integration` @ `aef4240` (worktree `agent-a6072b0ac19da7774`, CI verte annoncée).
> Contre-épreuve demandée par la revue v2 (`docs/reviews/revue-cta-s21-v2.md`, I-B) et par la revue design v2. Même méthode que la QA v2 (`docs/qa/qa-cta-s21-v2.md`). Captures : `docs/qa/captures-s21-v3/` (38 fichiers, 2,1 Mo).
> Marquage : **[LIVE]** = Chromium réel sur le build de production local, sortie observée ; **[STATIQUE]** = lecture du code, Grep ou Jest sans navigateur.

## Verdict

**Note : 9/10. Aucun bloquant, aucun majeur, 3 mineurs.**
- **Lien de test : GO.**
- **Mise en ligne : GO côté QA.** Les trois mineurs peuvent partir après (deux touchent la mesure, un touche un texte). Restent les préalables de la revue v2 : feu vert de Thomas après le lien de test, et I-A, désormais réglé dans le code (E5 et E6 posés).

Ce qui est prouvé :
- **Corrections de la v2 tenues** : MJ-1, m-b, m-c et m-d sont corrigés **[LIVE]**. Le tunnel mocké passe **31 entrées sur 32**, chacune avec la bonne `src` jusqu'à `checkout-ouvert`, dont la chaîne article → carnet → E1 (`blog-demo-milieu-1` de bout en bout, visiteur et compte). La seule entrée qui échoue, `/favoris`, n'est pas une régression : voir m-1.
- **E5 et E6** : 16 rendus sur 16 identiques au document validé, caractère pour caractère (visiteur et compte sans abonnement, 320, 360, 375 et 1280). Les deux blocs sont absents pour l'abonné. Le lien « Lis d'abord une étape » émet `parcours-ouvert {src: glossaire-etape1 | a-propos-etape1}`.
- **Chaînes interdites** : « Active mon accès », « Commencer à 2,99 », « Accéder aux parcours complets », « Débloque tout le carnet », tiret cadratin, « undefined » et « [object Object] » : **0 sur 228 pages rendues** (3 profils × 4 largeurs × 19 pages). Aucun débordement horizontal.
- **Carnet** : un **même processus** serveur passe d'octobre à novembre à minuit, heure de Paris (« Il en reste 29 », « Situation 10, offerte », `/carnet/2026-11` qui passe de 404 à 200). Aucune réplique verrouillée ne fuit dans le HTML.
- **Suites** : Jest **332 suites, 5 082 tests, 0 échec** ; Playwright `local` **36/36** ; les specs liées à la date passent aussi contre un serveur au 01/11 ; smoke : section 4. Tous les First Load JS sont ≤ 150 Ko.

La note perd 1 point pour les trois mineurs, qui ont un point commun : un cas de profil ou de taille d'écran que les tests du dépôt ne couvrent pas.

Chemins relatifs à `apps/web/src/`.

| # | Gravité | Défaut | Preuve | Fichier : ligne |
|---|---|---|---|---|
| m-1 | Mineur (mesure) | La source `favoris` (revue v2 m-1) ne sort jamais : le middleware renvoie un compte sans abonnement de `/favoris` vers `/abonnement` **sans `src`**, donc le bouton `src=favoris` n'est jamais affiché. Le clic sur « Favoris » du menu de compte est compté `direct` puis `abonnement`. Le test Jest ne vérifie qu'une chaîne dans le fichier, il ne peut pas échouer sur ce cas | tunnel [LIVE] : `/favoris` → `http://localhost:5530/abonnement`, `abonnement-vu` | `middleware.ts:41-43`, `components/favoris/favoris-list.tsx:198`, `components/layout/account-menu.tsx:38` |
| m-2 | Mineur (texte) | Fenêtre B11 (cœur), **compte sans abonnement** : « Deux étapes : ton compte, puis le paiement sécurisé. » Or il a déjà son compte : le bouton l'envoie directement au paiement. Même cas que m-c (texte juste pour le visiteur, inexact pour le compte connecté), non relevé en v2 | `B11-fenetre-coeur-gratuit-375x700.png` | `config/textes/cta-pages.ts:209`, `components/premium/premium-modal.tsx:86` |
| m-3 | Mineur (forme) | `/abonnement`, compte sans abonnement, émulation mobile tactile : à **360 × 740**, le bouton est coupé par le bas de l'écran (haut à 704 px, bas à 752 px). La cible de la revue design était ≤ 667. À 375 × 700, il touche juste le bord (bas à 700). Le garde-fou du dépôt mesure en émulation bureau (684 px à 360) et ne voit donc pas l'écart. En formule annuelle, le bouton descend de 44 px (accepté dans REPLIT, alors que la revue design demandait « sans saut ») | `abonnement-gratuit-360x740.png`, `captures3.json` | `components/premium/plan-selector.tsx`, `playwright/tests/local/abonnement-pli-s21.spec.ts:96` |

## Conditions du test

- **Environnement vide (P0).** Build, serveurs, Jest, tsc, Playwright et scripts de QA lancés par `env -i`, avec seulement les variables factices du job `e2e-local` de `.github/workflows/tests.yml` (`NEXTAUTH_SECRET=secret-factice-e2e-local`, `RESEND_API_KEY=re_factice_e2e`, `STRIPE_PREMIUM_PRICE_ID` et `STRIPE_PREMIUM_ANNUAL_PRICE_ID` factices, `ANTHROPIC_API_KEY=dummy`), plus `PATH`, un `HOME` vide, `CI=true`, `NODE_EXTRA_CA_CERTS` (polices Google au build) et `PLAYWRIGHT_BROWSERS_PATH`. **Aucune clé réelle, aucun e-mail, aucun paiement, aucune requête vers la production ni vers Neon, aucun déploiement.**
- **Build de production local** de `aef4240` (`npm run build`, `node .next/standalone/server.js`, port 5530). Base PostgreSQL 16 jetable (port 5531, `scripts/seed.sh` du dépôt), **supprimée à la fin**, avec les deux copies du serveur. Deux copies du même build avec une horloge décalée, chargée par `node --require` (script hors dépôt, comme en v2) : 01/11 00:00:30 Paris (port 5540) et 31/10 23:59:00 Paris (port 5550). Cette seconde copie a franchi minuit pendant le test.
- **Profils** : visiteur ; compte sans abonnement (`FREE`, 120 XP) ; abonné (`PREMIUM`), créés sur la base jetable et connectés par `/login`. **Largeurs** : 320, 360, 375 (mobile tactile) et 1280 ; hauteurs 568, 700, 740, 812 pour les mesures de pli.
- **Umami et Stripe mockés** (faux `umami.track`, `POST /api/stripe/checkout` intercepté, page Stripe simulée). Tout appel hors localhost est bloqué.
- Scripts hors dépôt. Les attendus E5 et E6 sont recopiés à la main depuis `/home/user/Marrant/docs/copy/cta-s21/complements/textes-valides-boutons.md`, jamais importés du code.

## 1. Corrections depuis la QA v2 : PASS

| Point | Statut | Preuve |
|---|---|---|
| **MJ-1** source du bouton du carnet | **Corrigé** [LIVE] | Tunnel : E1 `/carnet` visiteur → `/register` → `checkout-ouvert {src: carnet}` ; compte → `{src: carnet}` ; compte depuis `/carnet/2026-10` → `{src: carnet}`. **Chaîne B1 → carnet → E1** : `abonnement-vu`, `inscription-reussie` et `checkout-ouvert` portent tous `blog-demo-milieu-1` (visiteur et compte). curl : `returnTo=%2Fcarnet&amp;src=carnet` → 1 ; avec `?src=blog-demo-milieu-1` → 1 ; `src` piégée (`n'importe-quoi<x>`) → repli sur `carnet` (1). |
| **m-b** une seule source pour la carte d'accueil | **Corrigé** [LIVE] | Compte connecté : `abonnement-clic {src: accueil-premium}` puis `checkout-ouvert {src: accueil-premium}` ; visiteur : `accueil-premium` partout. La valeur `accueil` n'apparaît plus. |
| **m-c** « Déjà 1 500+ inscrits, et toi ? » | **Corrigé** [LIVE] | Carte `#offres` : visiteur 1 élément visible à 320, 360, 375 et 1280 ; compte sans abonnement 0 ; abonné : pas de carte. Captures `mc-carte-accueil-bouton-visiteur-375.png` (ligne présente) et `-gratuit-375.png` (« Tu as déjà ton compte… », sans la ligne). |
| **m-d** corps visiteur masqué pour l'abonné (fin d'article) | **Corrigé** [LIVE] | Abonné, 4 largeurs : surtitre, titre et « Continuer mon parcours » seulement (bloc de 212, 188, 188 et 174 px) ; visiteur et compte : corps présent (652, 568, 548 et 342 px). `md-B2-fin-article-abonne-375.png`. |
| Tests indépendants de la date | **Vérifié** [LIVE] | Serveur au 01/11 (port 5540), lanceur à la vraie date : `blocs-appel-s21-a`, `mesure-source-carnet-s21` et `garde-fous-s21` : **14/14**. Jest complet avec l'horloge au 02/11 (`--require`, contrôlé : `new Date()` → `2026-11-02T10:00:00Z`) : **5 082 réussis, 0 échec**, comme à la vraie date. |
| Sources des 5 boutons hors chantier (revue v2 m-1) | **4 sur 5** [LIVE] | `glossaire` (visiteur et compte), `a-propos` (visiteur par `/register`, compte par `/abonnement?src=a-propos`), `parcours-liste` (les deux) : `checkout-ouvert` avec la bonne `src`. `recherche` : lien présent dans le code (`ui/search-bar.tsx:256`), non joué (il faut des résultats limités) [STATIQUE]. **`favoris` : jamais émise** (m-1). |
| Glossaire et à-propos masqués pour l'abonné | **Corrigé** [LIVE] | `[data-testid=glossaire-fin]` et `[data-testid=a-propos-fin]` absents du DOM pour l'abonné, aux 4 largeurs. Remarque : les deux pages sont statiques, donc le bloc est dans le HTML serveur et disparaît à l'hydratation. C'est en bas de page, hors de l'écran au chargement ; le CLS mesuré en haut de page est nul. |
| `/abonnement`, bouton ≤ 680 px à 375 × 812 | **PASS** [LIVE] | Compte sans abonnement, mobile tactile : haut à 652 px, bas à 700 px, entier. Visiteur : 558 / 606. Mais à 360 × 740, le bouton est coupé (m-3). |
| `/abonnement`, CLS < 0,05 | **PASS** [LIVE] | CLS au chargement **0,0000** à 320 × 568, 360 × 740, 375 × 812 et 375 × 700, visiteur **et** compte sans abonnement (8 mesures, observateur `layout-shift` posé avant la navigation). La pastille « Un abonnement, tout ouvert » arrive directement, sans bascule depuis le titre visiteur. |
| Rapport du lundi : `checkout-ouvert` par `src` | **PASS** [STATIQUE] | `lib/analytics/weekly-funnel.ts:162-179,210-211,235-238` ; `weekly-funnel.test.ts` (8 cas, Umami mocké) : lecture de `src` sur la semaine, fusion, « inconnu », « n.d. » si la répartition est illisible. Non joué contre un vrai Umami (voulu). |
| Numéro réel de la fiche offerte | **PASS** [LIVE] | Octobre : carte du carnet « Situation 15 · offerte », `/abonnement` « Situation 15, offerte » → 1, « Situation 1, offerte » → 0. Novembre : « Situation 10 · offerte » et « Situation 10, offerte » → 1. |

## 2. E5 et E6 : PASS [LIVE]

**Textes.** Le `innerText` du bloc est comparé à la concaténation des chaînes attendues, après normalisation des espaces insécables et des apostrophes. Le test porte sur l'égalité du bloc entier, pas seulement sur la présence des morceaux : un ajout ou un ordre différent le ferait échouer.

| Bloc | Profil | 320 | 360 | 375 | 1280 |
|---|---|---|---|---|---|
| E5 `/glossaire` (titre, paragraphe, bouton, ligne, lien) | visiteur | égal | égal | égal | égal |
| E5 | compte sans abonnement | égal | égal | égal | égal |
| E6 `/a-propos` (titre de l'accueil, paragraphe **+ « Déjà 1 500+ inscrits, et toi ? »**, bouton, ligne, lien) | visiteur | égal | égal | égal | égal |
| E6 (paragraphe **sans** la dernière phrase) | compte sans abonnement | égal | égal | égal | égal |
| E5, E6 | abonné | absents | absents | absents | absents |

**Liens.** E5 : bouton → `/abonnement?src=glossaire`, lien → `/parcours/repartie?src=glossaire-etape1#etape-1`. E6 : bouton visiteur → `/register?callbackUrl=%2Fabonnement&src=a-propos`, compte → `/abonnement?src=a-propos`, lien → `/parcours/repartie?src=a-propos-etape1#etape-1`.

**Lien « Lis d'abord une étape, elle est offerte »** (clic réel, 375 px) : arrivée sur `/parcours/repartie?src=…-etape1#etape-1`, ancre à 112 px du haut, `parcours-ouvert {parcours: repartie, src: glossaire-etape1 | a-propos-etape1}`, avec `statut: visiteur` ou `membre`.

**Tunnel mocké depuis les deux boutons** : E5 et E6, visiteur et compte, arrivent tous les quatre sur la page Stripe simulée avec `checkout-ouvert {src: glossaire | a-propos}`.

**Contrôle 13 de REPLIT_ACTIONS** rejoué sur le build local : « Reste à s » 1, `src=glossaire-etape1` 1, `abonnement?src=glossaire` 1, « Commencer à » 0 ; « pour juger sur pièce » 1, `src=a-propos-etape1` 1, « Accéder aux parcours complets » 0.

**Lecture visuelle** (`E5-*`, `E6-*`, 320, 375 et 1280) : un seul plein, bouton entier sur 2 lignes à 320 et 375 (« Ouvrir les / 5 parcours · 2,99 €/mois ») et sur 1 ligne à 1280, ligne discrète puis lien souligné (niveau L2), centrés, rien de coupé. Hauteurs : E5 684, 613, 613 et 319 px ; E6 visiteur 633, 588, 562 et 372 ; E6 compte 608, 562, 562 et 372.

## 3. Captures demandées par la revue design : faites [LIVE]

Toutes dans `docs/qa/captures-s21-v3/`, lues une à une.

| Demande | Fichiers | Mesure et lecture |
|---|---|---|
| B1, encart du milieu (article n°1), hauteur mesurée, plafond 400 | `B1-encart-milieu-visiteur-375x812.png`, `-360x740.png`, `-320x568.png`, `B1-encart-milieu-bloc-*.png` | **370 px à 375, 394 px à 360** : sous le plafond. 434 à 320 (largeur hors critère). Un plein « Voir la réplique », note en dessous, rien de coupé ; seul autre plein dans l'écran : le bouton d'en-tête (décision de design confirmée). |
| B3, haut d'accueil, bas du plein ≤ 600 | `B3-haut-accueil-visiteur-375x812.png`, `-360x740.png`, `-375x667.png`, `-320x568.png` | Bas du plein : **523 px** à 375 × 812 et 375 × 667, **594 px** à 360 × 740 (6 px de marge). Lien B3 sur 2 lignes, entier et centré à 320, 360 et 375. CLS 0. |
| Fenêtre B11 (375 × 700) | `B11-fenetre-coeur-visiteur-375x700.png`, `-gratuit-375x700.png` | Feuille de 700 px, plein « Je m'abonne et je la garde » (555-603 px), lien L2 puis garantie, tout dans l'écran. **Compte sans abonnement : « Deux étapes : ton compte… »** (m-2). |
| Fiches conseil et vidéo (doublon de contour) | `fiche-conseil-bloc-exercice-visiteur-375.png`, `-1280.png`, `fiche-video-…` | **Pas de doublon** : 1 plein (« Essayer ce conseil avec Premium », « Décrypter cette vidéo avec Premium »), 1 contour (« Gratuit : … étape 1 de … »), 1 lien texte, plein et contour de même largeur (301 px à 375, 512 px à 1280). |
| E5 et E6 à 320, 375 et 1280 | `E5-glossaire-{visiteur,gratuit}-{320,375,1280}.png`, `E6-a-propos-…` | Voir la section 2. |
| `/abonnement` annuel « · 24,99 €/an » à 320 | `abonnement-annuel-gratuit-320x568.png`, `-375x812.png` | « Ouvrir les 5 parcours · / 24,99 €/an » sur 2 lignes, entier ; « Payé en une fois… » sous la ligne d'économie. Le bouton descend de 44 px en passant en annuel (m-3). |
| `/abonnement`, premier écran | `abonnement-{visiteur,gratuit}-{320x568,360x740,375x700,375x812}.png` | Visiteur : bouton dans l'écran à 360 × 740, 375 × 700 et 375 × 812. Compte : entier à 375 × 812 et 375 × 700 (bas exactement à 700), **coupé à 360 × 740** (m-3). |

## 4. Non-régression : PASS

| Contrôle | Résultat |
|---|---|
| Jest complet, environnement `e2e-local` | **332 suites, 5 082 tests réussis, 0 échec** (5 ignorés), [LIVE] |
| Jest complet, horloge au 02/11 | **5 082 réussis, 0 échec** [LIVE] |
| `tsc --noEmit` (config complète) et `tsc -p playwright/tsconfig.json` | 0 erreur |
| Playwright `local` | **36/36** (dont `abonnement-pli-s21` : 652 / 684 / 756 px et CLS 0 en émulation bureau, `mesure-source-carnet-s21` 2/2) |
| Smoke (desktop 1440 + iPhone 13, `@s21` compris) | **128 réussis**, 2 ignorés (achat, voulu) |
| Tunnel mocké | **31/32** entrées avec la bonne `src` jusqu'à `checkout-ouvert` (les 23 de la v2, plus E1 depuis `/carnet/2026-10`, B1 → E1 pour le compte, E5 et E6 dans les deux profils, `parcours-liste` dans les deux profils). Échec : `/favoris` (m-1). |
| Chaînes interdites dans le texte rendu (« Active mon accès », « Active ton accès », « Débloque tout le carnet », « Commencer à 2,99 », « Accéder aux parcours complets », « — », « undefined », « [object Object] ») | **0 sur 228 pages** (3 profils × 4 largeurs × 19 pages, dont `/glossaire`, `/a-propos`, `/blog`, les fiches et les parcours) |
| Débordement horizontal | 0 sur 228 |
| Contrôles 1 à 7, 11 (partie curl) et 13 de REPLIT_ACTIONS (curl, visiteur, build local) | Tous à la valeur attendue |

**Carnet à la bascule** (horloge serveur décalée hors dépôt, comme en v2) :

| `/carnet?ne-pas-compter=1`, visiteur | Aujourd'hui (5530) | 31/10 23:59 Paris (5550) | Même processus 5550, après minuit | 01/11 00:00:30 (5540) |
|---|---|---|---|---|
| `fiche-2026-10-15` / `fiche-2026-11-10` | 1 / 0 | 1 / 0 | **0 / 1** | **0 / 1** |
| « Il en reste 14 » / « Il en reste 29 » | 1 / 0 | 1 / 0 | **0 / 1** | **0 / 1** |
| `/abonnement` « Situation 10, offerte » | 0 | 0 | **1** | **1** |
| `/carnet/2026-11` | 404 | 404 | **200** | 200 |
| `returnTo=%2Fcarnet&amp;src=carnet` | 1 | 1 | | 1 |
| « Débloque tout le carnet », « Active mon accès », « je parle dans un ascenseur », « — » | 0 | 0 | | 0 |

- Nouveau par rapport à la v2 : le **même processus** serveur (lancé à 23:59:00 Paris) sert octobre à 23:59:58 et novembre à 00:00:18. Il n'y a donc aucun cache de mois en mémoire à craindre si une instance reste chaude à minuit.
- Détecteur de fuite (texte du JSON comparé au HTML entier, charge RSC comprise) : octobre, 14 titres, **0 fuite** ; novembre, 29 titres, **0 fuite** ; la fiche offerte est entière dans les deux cas.
- Encart B1 de l'article sur le serveur de novembre : 1re requête `#fiche-2026-10-15` (cache ISR), puis `#fiche-2026-11-10` dès la 2e. C'est le comportement annoncé au contrôle 12.
- `apps/web/src/data/carnet/2026-11.json` : sha256 `44b3a8c74c2ae5b6…`, identique à `docs/copy/carnet/novembre/carnet-2026-11.json`.

## 5. Performance : PASS [LIVE, build local]

First Load JS affiché par `next build` (`aef4240`, environnement vide), budget 150 Ko :

| Page | v2 (`9568ed0`) | **v3** |
|---|---|---|
| `/` | 147 | **148** |
| `/abonnement` | 137 | **138** (session lue côté serveur) |
| `/blog/[slug]` | 133 | 133 |
| `/parcours/[slug]` | 150 | **150, au plafond** (m-e de la v2, inchangé) |
| `/vannes` | 136 | 137 |
| `/conseils`, `/videos` | 137, 141 | 137, 141 |
| fiches vanne, conseil, vidéo | 125, 124, 124 | 125, 124, 124 |
| `/carnet`, `/carnet/[mois]` | 97,8 | 97,8 |
| `/glossaire`, `/a-propos` | | **107, 121** |
| `/profil`, `/favoris`, `/parcours` | 138, 130, 132 | 138, 130, 132 |
| `/quiz-humour`, `/register`, `/onboarding` | 128, 130 | 128, 130, 133 |

Toutes les pages touchées sont ≤ 150 Ko. L'accueil reprend 1 Ko (148) : il reste 2 Ko de marge.

## Ce qui n'a pas été joué en vrai

- Paiement Stripe réel et webhook : **[STATIQUE UNIQUEMENT : pas de clé Stripe de test, voulu]**.
- Rapport du lundi contre un vrai Umami : Jest avec Umami mocké seulement.
- Lien « passe en Premium » de la recherche (`src=recherche`) : [STATIQUE].
- Bascule de novembre sur Cloudflare : simulée en local (horloge serveur). Le contrôle 12 reste à faire le 01/11 après 01:00 Paris.
- Safari et Firefox : non installés, Chromium seul (émulation mobile tactile).

## À faire, par qui

| # | Pour | Action |
|---|---|---|
| m-1 | @fullstack, @data-analyst | Redirection de `/favoris` pour un compte sans abonnement : `/abonnement?returnTo=%2Ffavoris&src=favoris` (`middleware.ts:43`), ou ne pas afficher « Favoris » dans le menu de ce compte. Remplacer le test qui cherche une chaîne par un test Playwright local : compte FREE → menu « Favoris » → `checkout-ouvert {src: favoris}`. |
| m-2 | @copywriter, puis Thomas | Intro de la fenêtre B11 pour un compte connecté : masquer « Deux étapes : ton compte, puis le paiement sécurisé. » (comme m-c), ou faire valider à l'aveugle une variante. Pas de réécriture par @fullstack. |
| m-3 | @design, @fullstack | Décider si 360 × 740 doit montrer le bouton du compte connecté sans défiler (la cible de la revue était ≤ 667). Mesurer le garde-fou en émulation mobile (`isMobile`, `hasTouch`) plutôt qu'en bureau. Accepter le saut de 44 px en annuel ou le supprimer, et l'écrire. |
| v2 m-a, m-e | @design, @fullstack | Inchangés (titre B2 sur 3 lignes à 320 accepté ; `/parcours/[slug]` à 150 Ko). |

Aucun code applicatif modifié par cette QA, aucun test ajouté au dépôt. Base jetable, copies du serveur et processus de QA arrêtés et supprimés à la fin.

---
**Handoff → @orchestrator**
- Fichiers produits : `docs/qa/qa-cta-s21-v3.md`, `docs/qa/captures-s21-v3/` (captures B1, B3, B11, fiches, E5/E6, `/abonnement`, m-c, m-d).
- Décisions : 9/10, aucun bloquant ni majeur ; lien de test GO ; mise en ligne GO côté QA (les mineurs m-1 à m-3 peuvent suivre).
- Points d'attention : validations [LIVE] sur build local avec Stripe et Umami mockés ; paiement réel, webhook et rapport du lundi contre Umami : [STATIQUE]. Patterns A et B non déclenchés : aucun défaut v2 n'est revenu après correction.
---
