# Contre-épreuve QA : trajet de conversion s21

- Branche : `claude/marrant-conversion`, HEAD `d8aae2f` (CI verte, run 39314128473)
- Base : production `3b52c0c2` = commit `7314477`
- Date : 2026-10-19, agent @qa (Opus 5.5)
- Environnement : `env -i` + variables factices de `.github/workflows/tests.yml` (+ proxy/certificat pour les polices), PostgreSQL 16 jetable dans `/var/tmp`, un seul serveur `next start`

## Verdict

**GO, 9,3/10.** Aucun défaut bloquant. Paiement, `returnTo`, favori et fermeture du contenu Premium tiennent, à la relecture comme en navigateur, sur des entrées hostiles. Jest, Playwright `local`, smoke desktop + iPhone 13, `tsc` ×2 et lint sont verts. Les 5 trajets visiteur, le compte gratuit et l'annuel vont jusqu'au retour, avec la source suivie jusqu'à `checkout-ouvert`. Aucune migration. Trois mineurs (m2 à m4) sont à corriger après la mise en ligne. Ils sont détaillés en §Défauts, avec leur correctif précis.

| Contrôle | Résultat | Mode |
|---|---|---|
| Relecture du diff (paiement, inscription, sécurité, régressions) | 0 bloquant, 1 mineur (m2) | [STATIQUE] + [LIVE] |
| `next build` (`tsconfig.build.json`), `tsc --noEmit` complet, `tsc` E2E, `next lint` | code 0 ×4, 0 avertissement | [LIVE] |
| Jest complet (env du job `test` de la CI) | 354 suites, **5 384 réussis**, 5 ignorés, 0 échec | [LIVE] |
| Playwright `local` (2 workers, base PG16 jetable, faux Resend) | **122 réussis**, 32 ignorés, 1 instable (m3), 0 échec | [LIVE] |
| Smoke `desktop` + `iphone-13` contre le build | **128 réussis**, 2 ignorés, 0 échec | [LIVE] |
| 5 trajets visiteur + compte gratuit + annuel, jusqu'au retour | 7/7 | [LIVE] |
| Sécurité adverse (`returnTo`, `favori`, `src`, gratuit, Google) | 5/5 | [LIVE] |

## 1. Relecture adversaire du diff `7314477..d8aae2f` (code) [STATIQUE]

Périmètre : 377 fichiers, dont 124 hors `docs/` et `playwright/` (code + tests Jest). **Aucune migration** : `git diff --name-only 7314477..d8aae2f | grep -iE 'migration|prisma'` ne rend rien (ni `prisma/schema.prisma`, ni `prisma/migrations/`).

### 1.1 Paiement

| Point | Constat | Verdict |
|---|---|---|
| `POST /api/stripe/checkout`, `lib/stripe.ts`, webhook (`api/webhooks`, `api/stripe/*`) | **Non modifiés** dans le diff (`git diff --stat` vide). `returnTo` toujours revalidé côté serveur (`sanitizeReturnTo`, `z.string().max(512)`), `plan` en `z.enum`, `success_url` = `…/abonnement/success?session_id=…&returnTo=<encodé>[&formule=annuel]`. | OK |
| Mensuel / annuel côté client | `use-abonnement-checkout.ts` : corps `{returnTo?}` en mensuel (historique inchangé), `{plan:"annual"}` en annuel ; `auto=1` lu puis retiré de l'URL AVANT l'appel (`replaceState`), jamais après `paiement=annule`. `checkout-apres-inscription.ts` : même corps, timeout 10 s, aucun événement d'échec mesuré ici (repli sur `/abonnement?auto=1`). | OK |
| `src` | Toujours filtré par `sanitizeSignupSrc` / regex `^[a-z0-9][a-z0-9-]{0,119}$` ; accroche de `/abonnement` par table fermée (`lib/abonnement-accroche.ts`), aucun reflet de la valeur brute. | OK |
| `returnTo` (open redirect) | `sanitizeReturnTo` (non modifié) = `sanitizeCallbackUrl` + interdits `/abonnement`, `/api/`, `/login`, `/register`. Le nouveau code ne fait que retirer/ajouter `favori` dans un chemin **déjà assaini** (`extraireFavori(getPostPaymentDestination(raw))`), sans jamais réintroduire d'origine. En-tête : `buildAbonnementUrl(pathname)` repasse par le même filtre. Vérifié aussi en LIVE (§3.3). | OK |
| Favori après paiement | Valeur `^(JOKE\|TIP\|VIDEO)\.[A-Za-z0-9_-]{1,64}$` ; ajout (`POST /api/favorites`, qui exige Premium côté serveur, route non modifiée) **seulement dans l'effet `etat === "pret"`**, atteint uniquement si `/api/stripe/status` ou `/api/stripe/verify-session` rend `plan: "PREMIUM"`. Drapeau de bienvenue = type seul (liste blanche `lireDrapeauFavori`), jamais l'id. Timeout 5 s, redirection quand même. | OK |
| Page d'attente | `retourInscription` calculé côté serveur (session + `auto=1` + pas de retour sans paiement) ; au moindre échec `setAttente(false)` rend la page complète. | OK |

### 1.2 Inscription

`/register` : phrase de contexte par table (`contexteRegister`), lien gratuit seulement sans clic d'achat ; après inscription par e-mail, le bouton passe en « On t'emmène au paiement… » et ouvre Stripe directement (`ouvrirPaiementApresInscription`) ; échec = `router.push(postAuthTarget)` = `/abonnement?…&auto=1` (relance + messages). Google : même `callbackUrl` (`getPostSignupRedirect`), inchangé. OK.

### 1.3 Fuite de contenu Premium

| Route | Constat | Verdict |
|---|---|---|
| `/api/jokes`, `/api/tips`, `/api/videos` | Vidées pour tout compte non Premium (`lib/champs-premium.ts` : `howToApply: null`, `exercise: ""`, `learnings: [], exercise: null`), mêmes valeurs que le HTML public. | OK (LIVE §3.3) |
| `/api/search` | Non modifiée ; `select` limité (`content`, `punchline`, `title`), aucun champ d'exercice ; chute masquée hors Premium. | OK |
| `/api/daily` | Non modifiée (md5 identique à `7314477`) ; renvoie `joke`, `tip`, `video` **complets** (dont `howToApply`, `exercise`, `learnings`) à tout le monde. Ce n'est pas une fuite : l'accueil (`daily-content.tsx` l.211, 277, 330) **affiche** ces champs au visiteur, le contenu du jour restant gratuit par choix du 05/10 (`docs/ux/trajet-conversion-s21.md` l.199). L'API = le HTML. | OK (info m1) |
| `/api/favorites` GET | Non modifiée ; renvoie le contenu complet des favoris du compte. Un compte redevenu gratuit garde ses favoris (promesse FAQ « Et si j'arrête ? ») avec leurs exercices : cohérent avec la promesse, pas une fuite. | OK |

### 1.4 Régressions (lecture)

- Plus aucun import de `plan-selector.tsx` (supprimé) ; `tsc` et build le confirment (§2).
- En-tête : seul `prixHref` change (retour sur la page courante, accueil exclu) et libellé court « Premium » sous 640 px ; bouton toujours masqué sur les pages chaudes.
- `LETTRE_HEBDO_PROMESSE = false` ; les 4 usages (`avantages-premium.tsx`, `premium-welcome.tsx`, `abonnement/page.tsx` via `lignesTableau`, `json-ld.tsx`) sont tous conditionnés. Vérifié en LIVE (§3.3).
- JSON-LD Product : description = titre visible + avantages visibles ; FAQ de vente : 5 questions, même source (`FAQ_VENTE`) pour le HTML et le JSON-LD. Vérifié en LIVE (§3.3).
- `.claude/settings.json` : 6 permissions ajoutées (build:cf, deploy:cf, `wrangler rollback/versions/deployments`) ; aucune n'est exécutée par le code. À noter : `deploy:cf` et `rollback` sont désormais pré-autorisés sans invite. Non bloquant pour le site.

## 2. Build local, Jest, Playwright, smoke [LIVE]

- **Environnement** : `env -i` avec `PATH`, `HOME`, les variables factices du job `e2e-local` de `.github/workflows/tests.yml` (`NEXTAUTH_SECRET=secret-factice-e2e-local`, `RESEND_API_KEY=re_factice_e2e`, `STRIPE_PREMIUM_PRICE_ID=price_e2e_local_mensuel`, `STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_e2e_local_annuel`, `ANTHROPIC_API_KEY=dummy`…), `DATABASE_URL` vers la base jetable, et seulement `HTTPS_PROXY`/`NO_PROXY`/`NODE_EXTRA_CA_CERTS`/`SSL_CERT_FILE` repris du shell (polices). Aucune clé Stripe : aucun appel à Stripe possible.
- **Base** : PostgreSQL 16 dans `/var/tmp/qa-conv-s21` (port 5442, `initdb` sous l'utilisateur `postgres`), `scripts/seed.sh` (80 vannes, 38 conseils, 89 vidéos, 7 jours de contenu, 3 parcours). 18 Go libres sur `/`.
- **Build** : `npm run build` code 0 ; un seul serveur `node .next/standalone/server.js` sur `127.0.0.1:5300`.
- **Jest** (env du job `test`) : 354 suites réussies, 1 ignorée ; 5 384 tests réussis, 5 ignorés (secrets Stripe absents), 50,8 s.
- **Playwright `local`**, 2 workers : 122 réussis, 32 ignorés (captures sur demande, achat Stripe), **1 instable** (`concision-s21.spec.ts:79`, réussi au nouvel essai, voir m3). Pas de blocage par la limite de connexions par IP : `JobLock` n'a pas eu besoin d'être vidé.
- **Smoke** `desktop` + `iphone-13` (gabarit `devices['iPhone 13']`) contre le build : 128 réussis, 2 ignorés.
- Pages : `/`, `/abonnement`, `/abonnement/success`, `/register`, `/login`, `/lettre`, `/carnet`, `/parcours`, `/parcours/{repartie,confiance,machine-a-cafe}`, `/vannes`, `/conseils`, `/videos`, `/a-propos`, `/glossaire`, `/quiz-humour`, `/blague-du-jour`, `/admin`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` en 200 ; `/profil` et `/favoris` en 307 vers `/login` ; `/onboarding` en 307 vers `/abonnement?src=onboarding-visiteur`. `/api/admin/{semaine,lettre,users,stats}` sans authentification : 500 « ADMIN_PASSWORD non configuré » (environnement factice, fermé, jamais 200). `/api/health` 503 en local, à cause du seul `blogArticle: empty` (aucun article dans la base jetable). Admin, santé, lettre et newsletter sont **hors diff** (`git diff --stat` vide).

## 3. Trajets joués en navigateur [LIVE]

Chromium, spec hors dépôt. Le faux Stripe reproduit **exactement** le `success_url` de `lib/stripe.ts` l.186 (`session_id`, `returnTo` encodé, `&formule=annuel` en annuel) et pose le plan PREMIUM en base comme le webhook. Faux traceur Umami (`window.umami.track`). Comptes créés puis supprimés (`UserFavorite` et `User`).

| Trajet | Entrée | Corps envoyé au paiement | Retour | `checkout-ouvert` | Bienvenue |
|---|---|---|---|---|---|
| T1 en-tête (375 × 700) | `/conseils` → « Premium » → `/abonnement?returnTo=%2Fconseils&src=header` | `{"returnTo":"/conseils"}` | `/conseils?premium=bienvenue` | `{src: header, formule: mensuel}` | « Tout est ouvert : les listes, les parcours, les carnets. Sers-toi. » |
| T2 mur de vannes | `/vannes` → « Ouvrir la suite des vannes » | `{"returnTo":"/vannes"}` | `/vannes?premium=bienvenue` | `{src: mur-vannes}` | idem |
| T3 fin d'étape 1 | quiz de l'étape 1 de Répartie → « Passer à l'étape 2 » ; `/register` dit « l'étape 2 de Répartie s'ouvre » | `{"returnTo":"/parcours/repartie"}` | `/parcours/repartie?premium=bienvenue` | `{src: parcours-etape}` | idem |
| T4 étoile d'une vanne | `/vannes` → étoile → fenêtre (début de la vanne entre guillemets, pas la chute) → « S'abonner et la garder » | `{"returnTo":"/vannes?favori=JOKE.<id>"}` | `/vannes?premium=bienvenue&favori=JOKE` (type seul, jamais l'id) | `{src: modale-favoris}` | « Ta vanne est dans tes favoris. Le reste est ouvert aussi… » ; **1 ligne `UserFavorite` = la vanne cliquée** ; étoile pleine |
| T5 fin d'article | `/blog/meilleures-blagues-droles-2026`, lien `data-blog-cta="abonnement"` | `{"returnTo":"/parcours/repartie"}` | `/parcours/repartie?premium=bienvenue` (le `returnTo` du lien de l'article, voulu par `config/blog-cta.ts`) | `{src: blog-meilleures-blagues-droles-2026}` | idem T1 |
| **Annuel** de bout en bout (1 280 px) | `/videos` → « Premium » → carte Annuel → « S'abonner · 24,99 €/an » ; `/register` rappelle 24,99 € | `{"returnTo":"/videos","plan":"annual"}` | `/videos?premium=bienvenue` | `{src: header, formule: annuel}` ; `abonnement-reussi {formule: annuel}` | idem |
| **Compte gratuit** connecté | `/api/tips` : 0 exercice sur 38 ; `/conseils` → étoile → bouton « S'abonner » de la fenêtre (Stripe direct, sans `/register`) | `{"returnTo":"/conseils?favori=TIP.<id>"}` | `/conseils?premium=bienvenue&favori=TIP` | `{src: modale-favoris}` | « Ton conseil est dans tes favoris… » ; 1 favori en base ; après paiement `/api/tips` rend 38 exercices |

Chaque trajet : exactement 1 `checkout-ouvert` et 1 `abonnement-reussi` (formule juste).

### 3.3 Contrôles adverses et textes [LIVE]

- **`returnTo` hostiles** sur `/abonnement/success` : `https://evil.example/x`, `//evil.example/x`, `/\evil.example/x`, `/%2F%2Fevil.example`, `javascript:alert(1)`, `/api/favorites`, `/abonnement/success?…`, `/vannes?favori=JOKE.a%26b`, `/vannes?favori=JOKE.../../x`, `/vannes#<svg onload=alert(1)>`. Les 10 restent sur `localhost:5300`, jamais `/api` ni `/abonnement`, aucune boîte de dialogue. (Compte Premium : l'arrivée est `/vannes`, voir m2.)
- **Compte gratuit** sur `/abonnement/success?returnTo=/vannes?favori=JOKE.<id>` : aucun `POST /api/favorites`, 0 favori, la page reste en vérification ; `POST /api/favorites` forcé : **403**.
- **`/abonnement?src="><svg onload=…>&returnTo=https://evil.example`** : rien dans le texte rendu ni dans les attributs (seulement dans les données RSC de Next, en JSON échappé `<`) ; bouton visiteur → `/register?callbackUrl=%2Fabonnement&src=abonnement`.
- **Google** sur `/register?callbackUrl=/abonnement?returnTo=/vannes&plan=annual&src=mur-vannes` : `callbackUrl=/abonnement?returnTo=%2Fvannes&plan=annual&src=mur-vannes&auto=1&auth=inscription-google`.
- **Visiteur** : `/api/tips` 0/3, `/api/jokes` 0/10, `/api/videos` 0/3 avec exercice ; `/api/search` : chute masquée « Abonne-toi pour voir la chute ».
- **`/abonnement`** : « Premium ouvre tout » ×1 et « S'abonner · 2,99 €/mois » ×1 (après normalisation de l'apostrophe et des espaces insécables) ; « Ouvrir les 5 parcours » : 0 sur 12 pages ; « chaque semaine » et « Lettre par e-mail » : 0 sur 12 pages (`LETTRE_HEBDO_PROMESSE = false`).
- **JSON-LD** (`/abonnement` et `/`) : FAQPage = 5 questions, **5/5 questions et 5/5 réponses présentes mot pour mot dans le texte visible** (« Et si j'arrête ? » comprise) ; Product : 4 phrases de la description toutes visibles, offres 2,99 EUR et 24,99 EUR (24,99 visible). 0 tiret cadratin dans `/`, `/abonnement`, `/llms.txt`, `/llms-full.txt` ; réassurance dans `/llms.txt` : 1.
- **Lecture des captures** (Read) : fenêtre T4 à 375 px (une fois l'animation finie : titre, rappel en italique, ligne Premium, prix, plein, ligne compte, réassurance, rien de coupé) ; retours T4, gratuit (375 px) et annuel (1 280 px) : bannière lisible, bouton « Premium » de l'en-tête disparu une fois abonné, aucun chevauchement. Une première capture de la fenêtre, prise pendant le fondu d'ouverture, montrait le texte de la page par-dessus : c'était l'animation en cours, pas un défaut (refaite après 1,2 s).

## Défauts

Aucun bloquant.

- **m1 (info, rien à faire)** : `/api/daily` sert les exercices des 3 contenus du jour à tout le monde, comme l'accueil les affiche. Petite tension de texte seulement : le tableau de `/abonnement` dit « Exercices des fiches : Gratuit Non », mais la ligne « Quiz et vanne du jour : Gratuit inclus » couvre ce cas. À arbitrer par @product-manager seulement si on veut l'écrire.
- **m2 (mineur, préexistant, nouvel effet sur le favori)** : `src/middleware.ts` l.44, non modifié depuis `7314477`, renvoie tout jeton `plan: PREMIUM` de `/abonnement*` vers `/vannes`, **`/abonnement/success` compris**. Cas réel : session perdue au retour de Stripe (navigateur intégré, Safari, autre appareil). L'écran « Connecte-toi pour retrouver ton abonnement » mène à `/login?callbackUrl=%2Fabonnement%2Fsuccess%3Fsession_id%3D…%26returnTo%3D%252Fvannes%253Ffavori%253DJOKE.<id>`. Le jeton neuf porte PREMIUM, le middleware renvoie vers `/vannes`, et l'on perd **le favori (0 ligne en base), la bienvenue et le retour sur la page d'origine**. Prouvé en [LIVE]. Le paiement, lui, n'est pas touché (compte Premium). Correctif (@fullstack, après la mise en ligne) : `if (path.startsWith("/abonnement") && path !== "/abonnement/success" && token?.plan === "PREMIUM")`, plus un test de non-régression E2E « compte Premium connecté sur `/abonnement/success?returnTo=/vannes?favori=JOKE.<id>` → `/vannes?premium=bienvenue&favori=JOKE` et 1 favori ». Pas de boucle à craindre : la page de retour redirige d'elle-même vers une destination interdite de `/abonnement`.
- **m3 (test instable, pas le produit)** : `playwright/tests/local/concision-s21.spec.ts` l.126 (« la ligne ne bouge pas ») a échoué une fois (73 px) puis réussi. Cause : `yPage` lit `boundingBox()` puis `window.scrollY` en **deux appels**, pendant le défilement lancé par le focus du champ. Une sonde mesurant les deux en un seul `evaluate` donne y = 4 258 px, stable sur 6 essais (avec et sans préchargement), avant et après dépliage : aucun saut réel. Correctif : `const yPage = (l) => l.evaluate((el) => el.getBoundingClientRect().top + window.scrollY)`, avec `// FLAKY: mesure non atomique pendant le défilement du focus, corrigé le <date>`.
- **m4 (couverture)** : le faux Stripe des specs `conversion-v2/v3-s21` et `captures-trajets-conversion-s21` construit un `success_url` sans `&formule=annuel`, et T2, T3, T5 s'arrêtent avant le retour. Ma contre-épreuve couvre ces cas. Pour garder la preuve en CI, aligner le faux sur `lib/stripe.ts` l.186 et ajouter un test annuel jusqu'à `abonnement-reussi {formule: annuel}`.
- **Info** : `.claude/settings.json` pré-autorise désormais `npm run deploy:cf` et `npx wrangler rollback *` sans invite. C'est un choix d'outillage, qui n'affecte pas le site. À garder en tête : un agent peut déployer sans demande de permission.

## 4. Procédure de mise en ligne

Variante courte en tête de `REPLIT_ACTIONS.md`, « MISE EN LIGNE DU TRAJET DE CONVERSION s21 » : P0 ter (CI verte sur HEAD, `diff --stat d8aae2f HEAD -- apps/web .github` vide, branche descendante de `7314477`), P1 ter (N-1 = `3b52c0c2`), P4 ter (`build:cf` et `deploy:cf` avec la variable Hyperdrive factice), P6 ter (pages en 200, « Premium ouvre tout » et « S'abonner · 2,99 €/mois », plus aucun « Ouvrir les 5 parcours », `/api/tips|jokes|videos` sans exercice en visiteur, santé, en-têtes identiques, llms sans tiret cadratin, 5 questions JSON-LD), P8 ter (`npx wrangler rollback 3b52c0c2-a626-4be3-8471-85723c70e69e`). Les commandes 2, 3 et 5 de P6 ter ont été jouées contre le build local et rendent les valeurs attendues. Aucune migration. Aucun accès à la production ni déploiement dans cette contre-épreuve.

## 5. Nettoyage

Serveur `next-server` (PID 19023, seul processus lancé ici) arrêté ; cluster PostgreSQL 16 arrêté (`pg_ctl stop`) ; `/var/tmp/qa-conv-s21` (base, journaux, captures) et le spec hors dépôt supprimés ; ports 5300, 5301 et 5442 libres. `apps/web/.next` (ignoré par git) contient le build de `d8aae2f`. Arbre de travail : seuls ce rapport et `REPLIT_ACTIONS.md` changent.
