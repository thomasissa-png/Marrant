# Contre-épreuve @qa s21 : deuxième mise en ligne (`43c222f..ffb2ad7`)

Date : 19/10/2026. Branche `claude/marrant-s21-integration`, HEAD relu `ffb2ad7`. En production : `43c222f`, version Cloudflare `586c4adc` (18/10).
Périmètre : refonte de l'admin (inscrits à la lettre, onglet Semaine, comptes de test exclus, coquille `/admin`), rapport du lundi (section lettre, abonnés mensuels et annuels, comptes de test exclus), revue visuelle en 5 tours (gabarit, blocs d'appel, grilles, typographie, `frTypo` étendu). Diff : 255 fichiers hors `docs/` et images (+5 523 / −3 089), plus 1 734 fichiers de `docs/design`.

**Verdict : GO pour la deuxième mise en ligne. Note : 9,5/10.** Aucun bloquant, aucun majeur. 3 mineurs : 2 portent sur la procédure (corrigés dans `REPLIT_ACTIONS.md` par ce commit), 1 sur l'ergonomie de l'admin (à faire plus tard).

## 1. Conditions d'exécution

- CI « Tests CI » run `39191811605` sur `ffb2ad7` : `test`, `lint`, `e2e-local` à `success` (relu par `gh run view`). `origin/claude/marrant-s21-integration` = `ffb2ad7`. La boucle `for b in main master claude/ouverture-session-nzwj0w` n'affiche rien.
- Tout en `env -i`. Variables :
  - les variables factices de `tests.yml` (job `e2e-local`) ;
  - `ANTHROPIC_API_KEY=dummy` ;
  - `ADMIN_PASSWORD=admin-factice-qa`, valeur factice nécessaire pour ouvrir `/admin` ;
  - `HTTPS_PROXY` / `NO_PROXY` et `NODE_EXTRA_CA_CERTS` pour les polices.

  Aucune clé Stripe, Anthropic ou Resend réelle. Ports privés : base 5497, serveur 5397, faux Resend 5398.
- Disque : 20 Go libres sur `/` au départ (seuil : 8 Go).
- Base : PostgreSQL **16.15** jetable dans `/var/tmp/qa-s21-mel2`, `scripts/seed.sh`. Puis `npm run build` (standalone), `public/.` et `.next/static` copiés, un seul serveur `node .next/standalone/server.js`.
- La limite de connexions n'a jamais bloqué : `JobLock` n'a pas eu besoin d'être vidée.
- Aucun accès à la production, aucun déploiement.
- Marquage des validations : [LIVE] = build local réel, sortie observée ; [STATIQUE] = lecture du code ou de git.

## 2. Build et tests [LIVE]

| Contrôle | Résultat |
|---|---|
| `npm run build` | Code 0. First Load : `/parcours/[slug]` 150 kB, `/abonnement` 133, `/register` 127, `/vannes` 136, `/admin` 102 (14,6 kB propres). Les seuls messages sont les `DYNAMIC_SERVER_USAGE` de `/api/user/progress`, déjà présents avant. |
| Jest complet | **347 suites, 5 279 tests réussis, 5 ignorés, 0 échec** (1 suite ignorée, voulue). |
| `tsc -p playwright/tsconfig.json` | Code 0. |
| Playwright `local` | **105/105, 0 flaky** (dont `bouton-appel-s21`, `grilles-s21`, `mur-alignement-s21`, `typographie-s21`, `lettre-parcours`, `header-budget`). |
| Smoke desktop + iPhone 13 (`--workers=2`) | **128 réussis, 2 ignorés (voulus), 0 échec, 0 flaky.** |

## 3. Relecture du diff en adversaire

### 3.1 Régressions fonctionnelles [LIVE] (script Playwright ciblé, en plus des suites)

| Point | Constat |
|---|---|
| Clic de carte `/conseils` | Un clic dans le corps de la carte la déplie (« Exemple » visible). Le clic sur le titre ouvre la fiche (`stopPropagation` gardé). Compte Premium : « +10 XP » s'affiche au dépliage. |
| Révélation de chute `/vannes` | « Révéler la chute » affiche la chute et « Pourquoi ça marche ». |
| Filtres | Visiteur limité : aucun filtre, comme avant (s21 B7). Premium : 11 pastilles ; un clic passe `aria-selected` à `true` et change la liste. La pagination est présente pour Premium. |
| Pagination masquée | Visiteur : aucune `nav` de pagination côté client sur `/vannes` et `/conseils`. Le HTML du serveur garde 2 liens `?page=2`. |
| Fenêtre Premium | La carte floutée (nouveau composant `CarteFloutee`, un `<button>` nommé « Contenu Premium : voir l'offre ») ouvre la fenêtre ; Échap la ferme. |
| Lettre | Inscription, confirmation et désinscription : couvertes par `lettre-parcours` (local, vrai navigateur, faux Resend), en vert. Formulaire sous le résultat du quiz : voir §4. |
| Parcours | Compte Premium : l'étape 2 se déplie avec son contenu, sans mur (§4). |
| Paiement | Mur `/vannes` : `/abonnement?returnTo=%2Fvannes&src=mur-vannes`. `murAbonnementHref`, `buildAbonnementUrl` et `parcoursEtape1Href` ne sont pas modifiés. Les seuls appels touchés changent leur `className` ; leurs `src` (`glossaire`, `a-propos`, `exercice-${type}`, `mur-*`) sont identiques. Aucun fichier `app/api` hors admin, `lib/stripe*` ou `lib/email*` n'est modifié. [STATIQUE] + [LIVE] |
| En-tête et menu mobile | Nouveau voile (`z-40`) : un toucher dessous ferme le menu (`aria-expanded` `true`, puis `false`). Le bouton prix de la barre est seulement `invisible` quand le menu est ouvert (la place reste gardée). Aucun débordement horizontal à 375 px. |

### 3.2 Sécurité des nouvelles routes admin [LIVE]

| Route | Sans Bearer | Bearer faux | Bearer bon | Autre |
|---|---|---|---|---|
| `GET /api/admin/semaine` | 401 | 401 | 200 | `POST` → 405 |
| `GET /api/admin/lettre` | 401 | 401 | 200 | `?limit=1000` → 400 (zod, max 100) |

- Méthode : 2 inscrits marqueurs insérés dans la base jetable, avec IP en clair, empreinte, agent utilisateur et jetons reconnaissables (`TOKCONFIRMQA*`, `TOKUNSUBQA*`, `IPHASHQA*`, `203.0.113.77`, `UAQA*`).
- Réponses lues : `/api/admin/lettre` (sans filtre, `?q=fuite`, `?statut=PENDING`), `/api/admin/semaine` (rapport et `glissante`) et `/api/admin/users`. Résultat : **0 occurrence** de ces marqueurs et des clés `ipAddress`, `userAgent`, `confirmationToken`, `unsubscribeToken` et `password*`.
- Écran `/admin` › Abonnés › Lettre : aucun marqueur dans le texte de la page.
- Le code le garantit aussi : `select` explicite dans `lettre-inscrits.ts` ; `groupBy` et `count` seulement dans `weekly-lettre.ts`. [STATIQUE]
- `refusAdmin` applique la même règle que les routes existantes : 500 si `ADMIN_PASSWORD` est absent, 401 sinon. La comparaison n'est pas en temps constant, comme dans les routes existantes : rien de nouveau.
- Comptes de test : `emailsExclus` met les adresses en minuscules ; les inscriptions à la lettre (`normaliserEmail`) et les comptes (`register`) aussi. Le `notIn` de Prisma, sensible à la casse, reste donc juste. [STATIQUE]
- `dernierRapportDuLundi` : la convention est lundi = 1 et dimanche = 7 (`WEEKDAYS`). Aucun recul négatif le dimanche ; le lundi avant 7 h, on reprend la semaine précédente. Ici : « Semaine du 05/10 au 11/10 », juste pour un lundi 19/10 avant 7 h Paris (mesure faite à 04:57 Paris). [LIVE]

### 3.3 Mesure du texte : aucun mot changé [STATIQUE, outil reproductible]

Méthode :
1. Les 152 fichiers `.ts` / `.tsx` de `apps/web/src` modifiés ou ajoutés (tests exclus) sont analysés par l'AST TypeScript, dans les versions `43c222f` et `ffb2ad7`. Pour chaque fichier, on extrait :
   - les textes JSX ;
   - les littéraux et les morceaux de gabarits ;
   - les attributs `aria-label`, `alt`, `title` et `placeholder`.

   On écarte les classes Tailwind, les `href`, `src`, `id` et clés, les imports et les comparaisons.
2. Normalisation :
   - entités HTML décodées ;
   - ’ ‘ → ' ; « » “ ” → " ;
   - U+00A0, U+202F et U+2009 → espace ; U+2060, U+200B et U+00AD retirés ;
   - minuscules, découpage en mots.
3. Diff mot à mot, fichier par fichier, et comparaison globale des multiensembles.

Résultats :
- **Fichiers publics** (117 fichiers, admin et `lib/analytics` exclus) : **17 552 mots avant, 17 558 après, 0 mot affiché changé.** Les 18 écarts bruts sont tous expliqués :
  - « Questions fréquentes » (×3) : sorti de `/videos`, `/conseils` et `/quiz-humour`, et repris par `FaqSection`. Le H2 est toujours servi sur les 4 pages, vérifié [LIVE].
  - « stand-up » (×2, `feature-cards`) : le mot est le même ; l'outil le comptait comme un slug avant l'ajout du U+2060.
  - `$1$2` : un remplacement par expression régulière, pas du texte.
  - `fr-typo.ts` : listes techniques (`auto-dérision`, `e-mail`) et `use client`.
- **Fichiers de textes** : `config/textes/*` (8 fichiers), `config/blog-cta.ts` et `config/blog-forte-frappe.ts` ne contiennent que des apostrophes, et des guillemets passés en « ». 0 mot changé.
- **Fichiers inchangés** : `lib/faqs.ts`, `data/`, `prisma/` et `public/`. `git diff --stat` est vide.
- **Admin et rapport du lundi** : textes nouveaux (fonctionnalité nouvelle, hors mesure) ; environ 140 mots de l'ancienne page admin sont retirés avec les anciens onglets.
- **Filtre d'affichage `frTypo` étendu** : il change seulement la ponctuation, les espaces et le gluon (apostrophe, guillemets, cadratin → virgule, insécable avant le tiret, U+2060 dans les mots composés courts). Aucun mot n'est modifié, et la donnée en base reste intacte (`contenuAffiche`, appliqué au rendu).

Cohérence entre ce qui est affiché et ce qui est lu par les machines [LIVE] : les 266 pages du sitemap, plus `/abonnement`, `/register`, `/login`, `/lettre`, `/carnet`, `/admin` et `/vannes?page=2`, ont été parcourues.
- JSON-LD : tous valides. Les **286** questions et réponses FAQ du JSON-LD se retrouvent toutes dans le texte visible normalisé (0 absente). L'accordéon garde les réponses dans le DOM.
- `/llms.txt` (91 lignes) et `/llms-full.txt` (3 425 lignes) :
  - 0 U+2060, 0 tiret cadratin ;
  - apostrophes droites (0 ’), comme avant : la sortie llms est normalisée.
- Métadonnées : seules les apostrophes changent (exemple : la description des fiches vanne, « d’autres »).

### 3.4 U+2060 et insécables hors du texte affiché [LIVE + STATIQUE]

| Où | Résultat |
|---|---|
| Attributs `href`, `src`, `content`, `srcset`, `action` (269 pages) | **0 U+2060** ; 0 insécable dans un `href` ou un `src`. |
| `<title>` | 0 U+2060. |
| JSON-LD | **0 U+2060**. 13 chaînes avec insécable U+00A0 (glossaire, FAQ `/vannes` et `/quiz-humour` : « 100 % », « « … » ») : c'est le même texte que la page, et une espace valide pour les moteurs. Rien de gênant. |
| Sitemap, robots, llms | 0 U+2060. |
| Slugs et URL | `MOT_COMPOSE` exclut les mots entourés de `.`, `/`, `@`, `#`, `?`, `=` et `&` ; les slugs (`buildJokeSlug`, etc.) ne passent jamais par `frTypo`. |
| E-mails envoyés | Aucun U+2060 ni insécable ajouté dans `config/textes` (scan des lignes ajoutées). `lib/email*` et `lib/lettre*` ne sont pas modifiés et n'appellent pas `frTypo`. Seul changement dans les e-mails : les apostrophes ’ (UTF-8, comme les « é » déjà présents). |
| Stripe | Aucun fichier Stripe ni route de paiement modifié ; `paiement.ts` n'a que des apostrophes. |
| Blog | `markdown-renderer` retire le gluon posé par `frTypo` (`GLUON_COMPOSE`) : une seule méthode, l'existante. |
| Partage | `vanne-share-row` : seules les classes changent ; le texte partagé reste la donnée brute. |

## 4. Contrôles « à l'œil » à 375 px [LIVE] (captures lues : `docs/qa/captures-s21-mel2/`)

| Capture | Constat |
|---|---|
| `01-menu-mobile-lettre-375.png` | Menu ouvert. « La lettre » est le dernier onglet après « Articles », vers `/lettre`, cible de 44 px. Bouton « Premium · 2,99 €/mois » et « Connexion » dessous. Aucun débordement. |
| `02-quiz-resultat-lettre-375.png` | Bloc lettre **sous** la carte du résultat, hors carte : titre, champ, case de consentement, bouton contour « Envoie-moi la lettre », mention et lien Confidentialité. Rien de tronqué, apostrophes courbes. |
| `03` / `03b-parcours-etape2-premium-375.png` | Compte Premium sur `/parcours/repartie`. L'étape 2 « Le rythme et les silences » est dépliée (« Pourquoi cette étape ? », « Ce que tu vas apprendre », « Le conseil »). Aucun mur, aucun bouton prix dans l'en-tête. |
| `04-admin-semaine-375-p0/p4.png` | Coquille dédiée (« Backoffice », « Voir le site », Déconnexion), sans en-tête ni pied de page publics. Onglets en 2 × 2. Alerte « Nouveau lot à préparer » en orange. Cartes chiffrées (« 0 mensuel(s), 0 annuel(s) »). Section « Lettre mensuelle », « Voir les inscrits », prochain numéro. `scrollWidth` = 375. |
| `05-admin-abonnes-lettre-375-p0/p1.png` | Abonnés › Lettre : « Jamais d’empreinte IP ni de jeton ici. » Compteurs, tableau par emplacement, numéros, filtre par statut, cartes d'inscrits avec l'adresse entière. Aucun marqueur de fuite. |
| `06-vannes-premium-filtre-1280.png` | Filtre « Vie quotidienne » actif, grille de 2 colonnes alignée. Une première capture prise pendant l'animation d'entrée des cartes montrait une case vide : remesurée (opacité 1 à 1,5 s, positions alignées), ce n'est pas un défaut. |

Critères Thomas : rendu pro, propre, aligné et aéré ; même identité que le site ; hiérarchie claire ; cibles de 44 px. Rien de bloquant.

## 5. Procédure P0 à P8 pour la deuxième mise en ligne

- **Constat** : la procédure P0 à P8 de `REPLIT_ACTIONS.md` ne disait nulle part que P3 (migration 14) et P5 (« Soirée de Noël ») étaient déjà faits, ni qu'ils ne doivent pas être rejoués. Son P8 attend `/lettre` en 404, ce qui est faux avec N-1 = `586c4adc`.
- **Correction** : variante « DEUXIÈME MISE EN LIGNE s21 » écrite **en tête de l'entrée « s21 Intégration »**, avec un renvoi en tête de « À DÉPLOYER ». Elle contient P0 bis, P1 bis, P4 bis, P6 bis et P8 bis (N-1 `586c4adc-12cd-41e5-ab09-d3064819baaf`). P2, P3, P5 et P7 sont marqués « ne pas rejouer ».
- **Commandes de P6 bis jouées sur le build local** (hôte local à la place de la production) [LIVE] :
  - `/api/admin/{semaine,lettre,users,stats}` sans Bearer → `401` quatre fois ;
  - `grep -cE 'ipAddress|userAgent|[Tt]oken'` sur `/api/admin/lettre` authentifié → `0` ;
  - `/admin` → `noindex` présent (1) ;
  - gluon dans `href`, `src` et `content` → `0` sur les 5 pages, alors que le texte visible de `/a-propos` en contient bien.
- `/api/admin/semaine` n'existe pas dans `43c222f` (`git cat-file`) : le 404 attendu après P8 bis est juste. [STATIQUE]

## 6. Défauts

Aucun bloquant, aucun majeur.

| Id | Gravité | Défaut | Correctif |
|---|---|---|---|
| m-1 | Mineur (procédure) | L'entrée « Page admin s21 » demandait de « vérifier l'onglet Semaine contre l'e-mail du lundi 19/10 ». Or cet e-mail part de `43c222f` : sans exclusion des comptes de test, sans section lettre, sans ventilation mensuel/annuel. La comparaison aurait signalé de faux écarts. | **Corrigé dans ce commit** : comparer à l'e-mail du lundi 26/10 (« Semaine du rapport »), et rupture de série à transmettre à @data-analyst (P6 bis, point 8). |
| m-2 | Mineur (procédure) | Rien ne disait de ne pas rejouer P3 et P5 ; P8 attendait `/lettre` en 404 avec un N-1 qui sert déjà la lettre ; les entrées admin et visuelle parlaient encore de branches « à fusionner ». | **Corrigé dans ce commit** : variante deuxième mise en ligne et renvoi en tête de « À DÉPLOYER ». |
| m-3 | Mineur (admin, ergonomie) | Abonnés › Lettre : une carte « Désinscrit » montre la date de consentement et de confirmation, pas la date de désinscription. `unsubscribedAt` est pourtant renvoyé par l'API. | `apps/web/src/components/admin/lettre-section.tsx` : afficher `dateCourte(i.unsubscribedAt)` (« Désinscrit le ») quand `statut === "UNSUBSCRIBED"`, dans la carte mobile (l. ~179) et dans la colonne du tableau (l. ~209). Peut partir après la mise en ligne. |

Observations, sans action pour la mise en ligne :
- Résultat du quiz à 375 px : la carte du résultat garde sous le lien « Ouvrir les 5 parcours · 2,99 €/mois » une marge basse plus grande que la marge haute (lecture de la capture, non mesurée). Elle a été validée 10/10 au tour 5 par @design : c'est un choix de @design, à revoir seulement s'il le demande.
- La comparaison du mot de passe admin n'est pas en temps constant, sur les nouvelles routes comme sur les anciennes. C'est préexistant ; amélioration possible avec `crypto.timingSafeEqual` dans `lib/admin/auth.ts` et les routes existantes.

## 7. Note et verdict

**9,5/10, GO pour la deuxième mise en ligne**, sur le HEAD de la branche, qui ne contient que ce rapport et `REPLIT_ACTIONS.md` en plus de `ffb2ad7` (code identique). Condition : CI verte sur ce HEAD (P0 bis).

- Aucune régression fonctionnelle trouvée : cartes, chute, filtres, pagination masquée, fenêtre Premium, lettre, parcours Premium, liens de paiement, menu mobile.
- Les nouvelles routes admin sont fermées sans Bearer et ne laissent sortir ni IP ni jeton.
- **0 mot affiché changé** sur 17 552 mots.
- Aucun U+2060 dans un lien, une métadonnée, le JSON-LD, les e-mails ou Stripe.
- Suites vertes : Jest 5 279, local 105, smoke 128.
- Captures à 375 px propres.

Il manque un demi-point pour m-3 et pour la procédure, qui ne couvrait pas la deuxième mise en ligne (corrigée ici).

## 8. Nettoyage

- Serveur local (PID noté à son lancement) et PostgreSQL jetable arrêtés ; `/var/tmp/qa-s21-mel2` supprimé.
- `.next/standalone` du worktree supprimé.
- Seuls mes processus ont été arrêtés.
