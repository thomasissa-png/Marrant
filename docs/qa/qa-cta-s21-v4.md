# QA v4 des blocs d'appel s21 : concision du tunnel, contre-épreuve finale

> @qa, session 21, 18/10/2026. Branche testée : `claude/marrant-s21-integration` @ `825426b` (worktree `agent-a6072b0ac19da7774`, CI verte annoncée). Contre-épreuve C2 de `docs/reviews/revue-cta-s21-v3.md`.
> Méthode : celle de la QA v3 (`docs/qa/qa-cta-s21-v3.md`). Sources : `docs/copy/cta-s21/concision/VALIDE.md`, `textes-v5-a/b/c.md`, `fins-articles-v3.md` ; structure : `docs/ux/audit-charge-lecture-s21.md` ; contrôles P6 1 à 15 de `REPLIT_ACTIONS.md`. Captures : `docs/qa/captures-s21-v4/` (214 fichiers JPEG, 9,1 Mo).
> Marquage : **[LIVE]** = Chromium réel sur le build de production local, sortie observée ; **[STATIQUE]** = lecture du code, Grep ou Jest sans navigateur.

## Verdict

**Note : 8,5/10. Aucun bloquant, 1 majeur (procédure de mise en ligne), 7 mineurs.**
- **Lien de test : GO.**
- **Mise en ligne : GO après MJ-1** (un test smoke à mettre à jour, puis CI verte). Sans cette correction, le contrôle 11 de P6 sort rouge en production alors que le site est juste. Les mineurs peuvent partir après.

Ce qui est prouvé [LIVE] :
- **Textes v5 mot pour mot** sur 271 rendus (3 profils, 320, 375 et 1280 px, 40 surfaces) : le texte de chaque bloc contient les chaînes v5 attendues, dans l'ordre, sans reste. Seule exception : le libellé gratuit des articles du parcours Répartie (m-2, contradiction interne de la v5). Les 11 fins d'articles « à forte frappe » sont conformes à `fins-articles-v3.md`, titres sans point final.
- **0 tiret cadratin, 0 « undefined », 0 « NaN »** sur 271 pages ; 0 débordement horizontal ; aucune chaîne marquée « Disparaît » dans un bloc d'appel.
- **Structure** : 211 blocs contrôlés, **un seul plein par bloc**, et la réassurance apparaît exactement sous chaque plein qui mène au paiement (jamais sous un lien ni sous un bouton gratuit).
- **Tunnel mocké : 47 entrées sur 47** jusqu'à `checkout-ouvert` avec la bonne `src`, plus 2 `checkout-echec` avec la bonne `src`. Les mineurs v3 sont corrigés : `favoris` sort bien (m-1), la fenêtre du compte connecté n'a plus « Deux étapes » (m-2), et le bouton de `/abonnement` est entier à 360 × 740 (m-3, bas à 548 px).
- **Suites** : Jest 340 suites, 5 198 tests, 0 échec ; Playwright `local` **47/47** ; specs liées à la date contre un serveur au 01/11 : **18/18** ; smoke **126 réussis, 1 test en échec ×2 projets (MJ-1)**, 2 ignorés.
- **Carnet** : bascule de novembre jouée par un même processus serveur à minuit, heure de Paris ; 0 fuite des répliques verrouillées.

Chemins relatifs à `apps/web/src/` sauf mention.

| # | Gravité | Défaut | Preuve | Fichier : ligne |
|---|---|---|---|---|
| MJ-1 | **Majeur (procédure)** | Le test smoke `@s21` de la fin d'étape 1 attend encore `/abonnement` (« quiz en cours : vers /abonnement »). Or depuis `9a03c41` (revue v3 m6), le plein mène à `/register?…&src=parcours-etape`, ce qui est voulu. Le contrôle 11 de P6 (`test:e2e:smoke -- --grep @s21` contre la production) échouera donc sur `desktop` et `iphone-13`. La CI ne lance pas ce smoke, d'où la CI verte | `pw-smoke` : `Expected "/abonnement", Received "/register"` (×2 projets, retry compris) | `playwright/tests/smoke/murs-premium.spec.ts:108-127` ; code : `components/parcours/step-blocks.tsx:95-97` |
| m-1 | Mineur (procédure) | Contrôle 14, motif `Reste le repas\.` attendu à 0 : il vaut **1** alors que le code est juste. Le titre brut (`"title":"Le SMS, c'est fait. Reste le repas."`) est transmis dans la charge RSC ; le HTML affiché est bien `Reste le repas</p>`. Fausse alerte assurée en P6 | curl local sur l'article posé en base jetable | `REPLIT_ACTIONS.md:116` (motif à remplacer par `Reste le repas\.<` → 0) |
| m-2 | Mineur (texte, CONTRADICTION v5) | Articles du parcours Répartie hors table (ex. `jamais-quoi-repondre-techniques`) : le plein affiche « Tester mes premières répliques, gratuit » au lieu de « Tester l'étape 1 de Répartie, gratuite », que donne le tableau des déclinaisons de `textes-v5-a.md` §3. Mais la même section fixe `BLOC_FIN.boutonEtape1.repartie` = GRATUIT_ACCUEIL, et le code suit cette clé. Les 5 autres parcours sont conformes | `article-repartie-*` (3 profils sans abonnement × 3 largeurs) | `config/textes/cta-articles-accueil.ts:92`, `components/blog/article-cta.tsx:98` |
| m-3 | Mineur (texte hors v5) | En-tête, compte sans abonnement : « Activer mon accès », sans prix, de 1 024 px à 1 440 px, alors que tous les autres libellés payants sont unifiés. Sous 1 024 px, ce compte n'a aucun bouton payant dans l'en-tête. C'est voulu dans le code, mais ce n'est pas dans la v5 | `[en-tête] Activer mon accès` ×22 rendus ; tunnel `en-tête 1280` (compte) → `checkout-ouvert {src: header}` | `components/layout/header.tsx:173-175, 222` |
| m-4 | Mineur (structure, lecture 5 s) | Résultat du quiz d'orientation (`/onboarding`, compte sans abonnement) : le parcours est nommé deux fois (« Ton point de départ : Parcours Répartie », puis « Ton parcours : Répartie »). Une carte de profil de 27 mots et une raison hors v5 précèdent le bloc v5. Le lien gratuit est placé **au-dessus** du plein payant, et ce plein est hors du premier écran (866-930 px à 375 × 812) | `quiz-orientation-resultat-gratuit-375.jpg`, `quiz-orientation-resultat-plein-gratuit-375.jpg` | `components/onboarding/humor-quiz.tsx:72-73, 109-131, 226-257` ; `lib/parcours-orientation.ts:63` |
| m-5 | Mineur (structure, préexistant s20) | Murs : sous le mur, le visiteur voit une pagination « 1 2 3 4 … Suivant » (8 pages sur `/vannes`). Les pages 2 et suivantes ne contiennent **aucune** carte : seulement la limite et le mur. Dans l'écran du plein de `/vannes`, cela fait 7 éléments de plus en concurrence | `/vannes?page=2` : 0 lien de fiche, « Page 2 sur 8 » ; `lecture5s-mur-vannes-visiteur-375.jpg` | `components/vannes/vannes-list.tsx:183-187, 396-401` (même gabarit sur conseils et vidéos) |
| m-6 | Mineur (structure, préexistant) | `/parcours`, encart « Explore aussi » : « Abonnement 2,99 €/mois / Premium : tous les parcours, vannes, conseils et vidéos. » est affiché **aussi à l'abonné**, qui est ensuite renvoyé vers `/vannes` s'il clique. Cela contredit « l'abonné ne voit aucun prix » (revue v3 §2) | rendus `parcours-liste-abonne-*` | `app/(dashboard)/parcours/(liste)/page.tsx:110-114` |
| m-7 | Mineur (perf) | First Load JS de `/parcours/[slug]` : **153 Ko**, au-dessus du budget de 150 (150 en v3) | `next build`, environnement vide | page `/parcours/[slug]` |

## Conditions du test

- **Environnement vide (P0).** Build, serveurs, Jest, tsc, lint, Playwright et scripts de QA lancés par `env -i`, avec seulement les variables factices du job `e2e-local` de `.github/workflows/tests.yml`, plus `PATH`, un `HOME` vide, `CI=true`, `NODE_EXTRA_CA_CERTS` et `PLAYWRIGHT_BROWSERS_PATH`. Aucune clé réelle, aucun e-mail, aucun paiement, aucune requête vers la production ni vers Neon.
- **Build de production local** de `825426b`, port 5570. Base PostgreSQL 16 jetable (port 5571, `scripts/seed.sh`), supprimée à la fin. Les 11 articles « à forte frappe » et `se-presenter-avec-humour` n'existent qu'en production : 12 lignes `BlogArticle` factices (slug réel, corps de test) ont été posées sur la base jetable, parce que leur bloc de fin ne dépend que du slug.
- **Profils** : visiteur ; compte sans abonnement (`FREE`, 120 XP) ; abonné (`PREMIUM`). Largeurs 320, 375 (mobile tactile) et 1280 ; en-tête aussi à 360, 640, 768, 1024, 1279 et 1440.
- **Umami et Stripe mockés** ; tout appel hors localhost bloqué. Les attendus sont recopiés à la main depuis la v5, jamais importés du code.

## 1. Textes : PASS, sauf m-2 [LIVE]

| Surface | Profils × largeurs | Résultat |
|---|---|---|
| Haut d'accueil, carte Premium, en-tête | v, g × 3 | Égal à la v5 (`accueil-haut`, `accueil-carte-premium`). Carte du compte connecté identique à celle du visiteur, comme le veut la v5 §5. Abonné : pas de carte |
| Article n°1 : encart du milieu, fin, lettre | v, g, p × 3 | Égal ; abonné : titre et « Continuer mon parcours » |
| Fins par parcours (Machine à Café, Confiance, Storytelling, Boulot) | v, g, p × 3 | Égal |
| Fins des 11 articles « à forte frappe » | v × 3, p × 375 | **11/11 égales à `fins-articles-v3.md`** ; titres sans point final, « ? » et « » » gardés ; plein `GRATUIT_P` sur les 5 articles qui nomment un parcours |
| Fiches vanne, conseil, vidéo ; murs `/vannes`, `/conseils`, `/videos` | v, g × 3 | Égal ; limites « Les 10 gratuites, c'est fait. », « 3 conseils gratuits… », « 3 vidéos gratuites… » |
| Fenêtre Premium (cœur ×3, carte floutée ×3) | v, g | Égal : titre, « 2,99 € TTC / mois », plein, REASS ; pas de « Deux étapes » pour le compte. Vote : [STATIQUE] (`cta-pages.ts:117`), aucune idée en base locale |
| Quiz d'humour, fin d'étape 1 (finie et quiz en cours), `/parcours`, page d'un parcours | v, g | Égal (« Étape 2 sur 4 », « 5 vannes dans cette étape. ») |
| `/abonnement` (Répartie, Confiance, Storytelling, Machine à Café, Boulot) | v, g × 3 | Égal, ordre compris ; visiteur « Ton compte, puis le paiement sécurisé. », compte « Paiement sécurisé par Stripe » |
| `/register`, `/profil`, `/glossaire`, `/a-propos` | v / g × 3 | Égal ; « Déjà 1 500+ inscrits. » visiteur seulement |
| Retour de paiement | g (statut mocké `PREMIUM`) | « Paiement reçu ! », « Merci. Ton accès s'active… », « Choisir mon parcours » (`config/textes/paiement.ts:142-145`). La page redirige aussitôt vers le parcours d'origine (`/parcours/repartie?premium=bienvenue`), si bien que ce texte n'est visible qu'un instant ; `abonnement-reussi` émis. Comportement inchangé depuis s16 |

**Libellés uniques** (relevés sur les rendus) : payant générique « Ouvrir les 5 parcours · 2,99 €/mois » (120 rendus) ; libellés de geste conformes à la v5 ; en-tête « 2,99 €/mois » / « Premium · 2,99 €/mois » ; gratuits « Tester mes premières répliques, gratuit » et « Tester l'étape 1 de {P}, gratuite » seulement. Hors v5 : « Activer mon accès » (m-3) et l'encart de `/parcours` (m-6).
**« Disparaît »** : aucune occurrence dans un bloc d'appel. Les occurrences relevées ailleurs sont du contenu hors périmètre : corps d'article (« t'attendent »), descriptions de parcours (« sans te forcer », « un cran à la fois »), terme du glossaire « One-liner », encart de la lettre sur l'accueil (« Gratuit, sans compte. », textes de la lettre).

## 2. Structure : PASS, sauf m-4 à m-6 [LIVE]

- **Un plein par bloc** : 211/211. **REASS** = nombre de pleins payants du bloc, partout (0 sous un lien ou un gratuit).
- **`/register`** : pas de champ prénom (0 `given-name`) ; ordre visuel Google → CGU → e-mail (`register-visiteur-375.jpg`) ; le tout tient dans un écran de 812 px ; lien `src=register-etape1` présent. Depuis la fin d'étape 1, le lien vers l'étape 1 est absent, comme le veut la v5.
- **Carte « Ton prénom »** (`/profil`, compte) : « Zoé 🎉 <b>&amp; » enregistré tel quel puis réaffiché échappé, et toujours là après rechargement ; vidé → `name = null` ; `PATCH /api/user` 200 ×2.
- **Fin d'étape 1** (320, 375, 1280) : « Bien joué ! », carte « Étape 2 sur 4 » (aperçu coupé à 3 lignes), plein, REASS, ligne de la lettre `aria-expanded=false` sans champ ; au clic, le champ e-mail prend le focus et la case apparaît, **le plein ne bouge pas (0 px)**. `src=parcours-etape` présent **une seule fois** dans le lien. Variante quiz en cours : « Les étapes suivantes s'ouvrent avec Premium. », plein vers `/register`, REASS. Lettre avec l'interrupteur fermé : `LettreInscription` renvoie `null` avant la ligne repliée (`components/lettre/lettre-inscription.tsx:99`) [STATIQUE] (constante de compilation, non rejouée).
- **En-tête** (visiteur) : « 2,99 €/mois » à 320, 360 et 375 (cible de 44 px, 0 débordement) ; « Premium · 2,99 €/mois » à 640 et 768 ; libellé court de 1 024 à 1 279 ; « Premium · 2,99 €/mois » dès 1 280 ; absent sur `/abonnement` et `/register`.
- **Murs** (320 et 375, tactile) : toucher l'amorce révèle la chute, on reste sur `/vannes` ; la flèche fait 44 × 44 px, ne chevauche aucun autre bouton de la carte et ouvre la fiche. Sur `/conseils` et `/videos`, le titre est le lien vers la fiche (toucher → fiche). **Maillage 12 / 10 / 12** (HTML du serveur), « Page dédiée » 0, 12 flèches.
- **Abonné** : `/parcours/confiance`, l'étape 3 s'ouvre sans « pour débloquer » [LIVE] ; validation dans le désordre (1, 3 puis 2) couverte par Jest (`__tests__/api/parcours-progress.test.ts:164`) [STATIQUE].

## 3. Tunnel mocké : 47/47 PASS [LIVE]

Visiteur (375) : en-tête, carte d'accueil, article milieu → carnet (`blog-demo-milieu-1` de bout en bout), fin d'article n°1 et article « couple » (`blog-<slug>`), 3 murs, 3 fiches, fenêtres cœur ×3 et carte floutée ×2 (`modale-favoris`, `modale-carte`), quiz d'humour, **fin d'étape 1 et variante quiz en cours** (`parcours-etape` dans `inscription-envoi`, `inscription-reussie`, puis `checkout-ouvert`, sans `abonnement-vu {src: parcours-etape}`), aperçu d'étape (`parcours-apercu`), `/parcours` (`parcours-liste`), `/abonnement`, `/register` direct, carnet, glossaire, à-propos. Compte sans abonnement : en-tête à 1 280, carte, carnet, chaîne article → carnet, `/abonnement`, profil, glossaire, à-propos, **favoris (menu) → `favoris`**, murs, fiches, fenêtres, quiz d'orientation (`onboarding`), quiz d'humour, `/parcours`, fin d'étape 1 (`parcours-etape`).
Corps du `POST /api/stripe/checkout` : `returnTo` correct (ex. `/parcours/repartie`, `/carnet`, `/favoris`).
**`checkout-echec`** (API mockée en 500) : visiteur depuis la fiche vanne → `{src: exercice-vanne, raison: erreur}` ; compte depuis `/abonnement?src=header` → `{src: header}`. On reste sur `/abonnement`.

## 4. Non-régression

| Contrôle | Résultat |
|---|---|
| `tsc` (build, complet, Playwright), `next lint` | 0 erreur [LIVE] |
| Jest complet | **340 suites, 5 198 réussis, 0 échec** (5 ignorés) [LIVE] |
| Playwright `local` | **47/47** [LIVE] |
| Specs datées (`blocs-appel-s21-a`, `mesure-source-carnet-s21`, `garde-fous-s21`, `concision-s21`) contre le serveur au 01/11 | **18/18** [LIVE] |
| Smoke (desktop + iPhone 13) | **126 réussis**, 2 ignorés (voulu), **1 test en échec sur les 2 projets : MJ-1** [LIVE] |
| Contrôles P6 1 à 6, 8, 9, 14, 15 (curl, build local) | Valeurs attendues, sauf le motif du contrôle 14 (m-1) [LIVE] |
| CLS `/abonnement` (320 × 568, 360 × 740, 375 × 700, 375 × 812 ; visiteur et compte) | **0,0000 ×8**. Bouton entier à 360 × 740 (bas à 548 px pour le compte, 568 pour le visiteur : corrige m-3 v3) et à 375 (bas à 496-500). À 320 × 568, il passe sous le pli (bas à 600-620 px), hors cible [LIVE] |
| First Load JS | `/` 146, `/abonnement` 132, `/register` 127, `/vannes` 133, `/conseils` 134, `/videos` 138, `/blog/[slug]` 128, `/carnet` 96,4, `/profil` 135, **`/parcours/[slug]` 153 (m-7)** |

**Carnet à la bascule** (horloge serveur décalée hors dépôt, par `node --require`) :

| `/carnet`, visiteur | Aujourd'hui | 31/10 23:59 Paris | Même processus après minuit | 01/11 00:00:30 |
|---|---|---|---|---|
| `fiche-2026-10-15` / `fiche-2026-11-10` | 1 / 0 | 1 / 0 | **0 / 1** | **0 / 1** |
| « Il en reste 14 » / « 29 » ; « Et 11 » / « 26 autres répliques » | 1 / 0 ; 1 / 0 | 1 / 0 ; 1 / 0 | **0 / 1 ; 0 / 1** | **0 / 1 ; 0 / 1** |
| « préparatifs de Noël » ; `/abonnement` « Situation 10, offerte » | 0 ; 0 | 0 ; 0 | **1 ; 1** | **1 ; 1** |
| `/carnet/2026-11` | 404 | 404 | **200** | 200 |
| `returnTo=%2Fcarnet&amp;src=carnet` ; chaînes interdites | 1 ; 0 | 1 ; 0 | 1 ; 0 | 1 ; 0 |

Article n°1 au 01/11 : `blog-demo-milieu-1#fiche-2026-11-10` à la 2e requête (cache ISR), comme annoncé au contrôle 7. Détecteur de fuite (réponse, « pourquoi », « si ça se tend » des fiches verrouillées cherchés dans le HTML) : octobre 0/14, novembre 0/29 ; la fiche offerte est entière (3/3). `data/carnet/2026-11.json` : sha256 `e2b15d0f…`, conforme à REPLIT.

## 5. Captures [LIVE]

`docs/qa/captures-s21-v4/` : 3 profils × 320, 375 et 1280 pour accueil (haut, carte), article (milieu, fin), fiches, murs, `/parcours`, Répartie, carnet, `/abonnement`, `/register`, `/profil`, `/glossaire`, `/a-propos`. S'y ajoutent les vues ciblées : fin d'étape 1 (finie, quiz en cours, lettre dépliée), fenêtres, carte Premium cadrée, en-tête à 5 largeurs, plis de `/abonnement`, quiz, prénom, mur à chute révélée, étape 3 de l'abonné, et les 20 écrans `lecture5s-*`. Lues une à une pour les écrans du tunnel à 375 et 320 : rien de coupé, de chevauché ni de vide. Sur certaines captures « bloc en haut », l'en-tête apparaît décalé : c'est son animation au défilement, figée par la capture ; les vues cadrées (attente de 900 ms) sont nettes.

## 6. Lecture à 5 secondes (375 × 812) [LIVE]

Il s'agit des éléments visibles dans l'écran du bouton principal, en-tête exclu (P = plein, L = lien, C = contour).

| Écran | En concurrence avec le plein | Pavés (> 30 mots) |
|---|---|---|
| Accueil, haut | 3 pastilles de situation (navigation) | 0 |
| Carte Premium (visiteur, compte) | 1 lien gratuit | 0 |
| Article n°1, milieu / fin ; article « couple », fin | 1 lien (partage / OUVRIR) ; champ de la lettre sous le bloc | 0 |
| Fiches vanne, conseil, vidéo | 1 lien + 1 ou 2 cartes « même catégorie » | 0 |
| Mur `/vannes` | 1 lien + **7 éléments de pagination** (m-5) + 2 contrôles de la dernière carte | 0 (texte des cartes coupé à 4 lignes) |
| Murs `/conseils`, `/videos` | 1 lien (+ pagination sur `/conseils`) | 0 |
| Fin d'étape 1 | 1 lien (lettre) | 0 (aperçu coupé à 3 lignes) |
| Fenêtre Premium | bouton fermer | 0 |
| `/parcours` | aucune | 1 (description du parcours, 38 mots) |
| `/carnet` | aucune | 0 |
| `/abonnement` (visiteur, compte) | sélecteur Mensuel / Annuel | 0 |
| `/register` | Google (contour), 2 champs, 3 liens | 0 |
| `/profil` (compte) | carte « Ton prénom » (champ + « Enregistrer ») + 1 lien | 0 |
| `/glossaire`, `/a-propos` | 1 lien + cartes « Explore aussi » ou contact | 0 |
| Quiz d'orientation (compte) | plein hors écran, lien gratuit au-dessus (m-4) | carte de profil de 27 mots |

Il ne reste aucun pavé dans un bloc d'appel. Les seuls textes longs à l'écran sont du contenu (descriptions de parcours, corps d'article).

## Ce qui n'a pas été joué en vrai

- Paiement Stripe réel et webhook : **[STATIQUE UNIQUEMENT : pas de clé Stripe de test, voulu]**.
- Fenêtre « vote » : aucune idée à voter en base locale, texte vérifié dans la config [STATIQUE].
- Interrupteur de la lettre fermé : constante de compilation, non rebâtie [STATIQUE].
- Bascule de novembre sur Cloudflare : simulée en local ; contrôle 7 à faire le 01/11 après 01:00 Paris.
- Safari et Firefox : Chromium seul (émulation mobile tactile).

## À faire, par qui

| # | Pour | Action |
|---|---|---|
| MJ-1 | @fullstack | `murs-premium.spec.ts:118-126` : attendre `/register`, `src=parcours-etape` et `callbackUrl=/abonnement?returnTo=%2Fparcours%2Fmachine-a-cafe` (comme `concision-s21.spec.ts:96-101`), puis relancer le smoke en local et la CI. |
| m-1 | @fullstack (REPLIT) | Contrôle 14 : remplacer le motif `Reste le repas\.` par `Reste le repas\.<`. |
| m-2 | @copywriter, puis Thomas | Trancher la contradiction de `textes-v5-a.md` §3 (clé `boutonEtape1.repartie` = GRATUIT_ACCUEIL ou déclinaison `GRATUIT_P`) ; @fullstack applique. |
| m-3, m-4 | @copywriter, @ux | « Activer mon accès » (en-tête du compte) et résultat du quiz d'orientation : à faire entrer dans la v5, ou à garder par décision écrite. |
| m-5, m-6 | @fullstack, @seo | Masquer au visiteur la pagination des murs (en gardant les liens `?page=N` pour l'exploration si @seo le demande), et masquer l'encart « Abonnement » de `/parcours` pour l'abonné. |
| m-7 | @fullstack | `/parcours/[slug]` à 153 Ko : revenir sous 150. |

Aucun code applicatif modifié par cette QA, aucun test ajouté au dépôt. Base jetable, copies du serveur et processus de QA arrêtés et supprimés à la fin.

---
**Handoff → @orchestrator**
- Fichiers produits : `docs/qa/qa-cta-s21-v4.md`, `docs/qa/captures-s21-v4/` (214 captures).
- Décisions : 8,5/10 ; lien de test GO ; mise en ligne GO après MJ-1 (test smoke périmé), mineurs après.
- Points d'attention : tout en [LIVE] sur build local (Stripe et Umami mockés) sauf paiement réel, vote et interrupteur de la lettre [STATIQUE]. Pattern A non déclenché (aucun défaut v3 revenu). Pattern B non déclenché.
---
