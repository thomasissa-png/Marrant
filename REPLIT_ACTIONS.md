# Actions Replit — Deviens-marrant.fr

## À DÉPLOYER

#### CARTES DU JOUR (branche `claude/marrant-cartes-du-jour`) : PAS ENCORE DÉPLOYÉ

Refonte de la section « Ton contenu du jour » de l'accueil selon `docs/design/cartes-du-jour/diagnostic-et-spec.md` (D1 : « Pourquoi ça marche » fermé par défaut). Commit de code `5b7b245`, qui descend de la version en production. Fichiers touchés : `apps/web/src/components/home/daily-content.tsx`, `apps/web/src/__tests__/dashboard/daily-content.test.tsx`, `apps/web/src/__tests__/feature/corrections-s16-lot-f.test.tsx` ; captures `docs/design/cartes-du-jour/apres-v1/`. **Aucune migration, aucun secret, aucune variable.** Aucun texte, donnée, route ni composant partagé modifié. Attend la relecture à l'aveugle des captures, puis le feu vert écrit de Thomas.

#### MISE EN LIGNE DU TRAJET DE CONVERSION s21 (branche `claude/marrant-conversion`) : P0, P1, P4, P6 adapté, P8 (@qa, 19/10/2026). **P2, P3, P5 et P7 ne se rejouent pas.**

**DÉPLOYÉ le 19/10/2026 à 20:44 UTC** (feu vert écrit de Thomas « go mise en ligne! ») : version `b5e645dd-f3b3-4d80-92dc-14c71354780d`, commit `e8b431c` (code `acddd1d`), N-1 `3b52c0c2` à 100 % vérifié en P1. P6 conforme : pages 200, /abonnement porte « Premium ouvre tout », « S’abonner · 2,99 €/mois », la FAQ « Et si j’arrête ? » et le lien `#le-carnet-en-vrai`, zéro « Ouvrir les 5 parcours » sur /, /parcours et /abonnement ; `/api/tips` en visiteur sans exercice ; `/api/health` ok (base up, Stripe live) ; routes admin 401 ; six en-têtes de sécurité identiques à l'avant. Rollback si besoin : `npx wrangler rollback 3b52c0c2-a626-4be3-8471-85723c70e69e`.

~~PAS ENCORE DÉPLOYÉ.~~ Commit relu par @qa : `d8aae2f` (contre-épreuve `docs/qa/qa-contre-epreuve-conversion-s21.md`, GO 9,3/10). **Code à mettre en ligne : `acddd1d`** = `d8aae2f` + correctifs des mineurs m2 à m4 de la contre-épreuve (middleware : `/abonnement/success` n'est plus renvoyé vers `/vannes` pour un Premium ; le reste est dans les tests). Ce correctif touche `src/middleware.ts`, `lib/premium-return.ts` et `lib/stripe.ts` (même `success_url`, construite par une fonction partagée). N-1 attendu : `3b52c0c2-a626-4be3-8471-85723c70e69e` = commit `7314477`, dont la branche descend. Rien au déploiement : **aucune migration** (`git diff --name-only 7314477..acddd1d | grep -iE 'migration|prisma'` vide), aucun secret, aucune variable ; écriture en base seulement au fil de l'usage (une ligne `UserFavorite` au retour d'un paiement lancé par l'étoile). Ne pas appeler `startup-tasks`. Feu vert de Thomas écrit requis avant P4.

**P0 ter. Prérequis** (commandes de P0, branche `claude/marrant-conversion`)
- `git fetch origin && git status --short && git rev-parse HEAD` ; `gh run list --branch claude/marrant-conversion --limit 3 --json headSha,name,conclusion` ; `gh run view <id> --json jobs --jq '.jobs[]|[.name,.conclusion]|@tsv'` ; `git diff --stat acddd1d HEAD -- apps/web .github` ; `git merge-base --is-ancestor 7314477 HEAD && echo descend`.
- Réussite : arbre propre ; HEAD = `origin/claude/marrant-conversion` ; le `diff --stat` est vide (seuls des commits de doc après `acddd1d`) ; dernier run « Tests CI » sur `git rev-parse HEAD` à `success`, jobs `test`, `lint` et `e2e-local` à `success` ; `descend` affiché.
- Si échec : pas de mise en ligne (voir P0).

**P1 ter. N-1** : `npx wrangler deployments list | tail -8`, puis, hors du dépôt, `curl -sI "https://deviens-marrant.fr/?ne-pas-compter=1" > entetes-avant.txt`.
- Réussite : `3b52c0c2-a626-4be3-8471-85723c70e69e` à 100 %, noté ici ; `entetes-avant.txt` non vide. Autre version à 100 % : arrêt, comprendre qui a déployé quoi.

**P4 ter. Build et déploiement** (depuis `apps/web`) : `rm -rf .open-next && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run build:cf && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run deploy:cf`, puis `npx wrangler deployments list | tail -8`.
- Réussite : code 0 aux deux ; nouvelle version à 100 %, notée ici au format « DÉPLOYÉ le …, version …, N-1 3b52c0c2, commit … ». Messages Prisma « URL must start with postgresql:// » au build : replis attendus.
- Si échec du build : rien n'est en ligne, @fullstack. Si déployé et pages en 5xx : P8 ter tout de suite.

**P6 ter. Contrôles après mise en ligne** (page en 5xx ou contenu Premium exposé = P8 ter ; texte = @fullstack)
1. **Pages** : `V=$(curl -s https://deviens-marrant.fr/sitemap.xml | grep -o 'https://deviens-marrant.fr/videos/[a-z0-9-]*' | head -1 | sed 's#https://deviens-marrant.fr##')` puis `for p in / /abonnement /abonnement/success /register /login /lettre /carnet /parcours /parcours/repartie /vannes /conseils /videos "$V" /blog/se-presenter-avec-humour /quiz-humour /a-propos /profil /admin /llms.txt /llms-full.txt /api/health; do printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://deviens-marrant.fr$p?ne-pas-compter=1"; done`. Réussite : 200 partout (`/profil` peut rendre 200 ou une redirection 307 vers `/login` : identique à N-1).
2. **Page de vente** : `A=$(curl -s "https://deviens-marrant.fr/abonnement?ne-pas-compter=1" | sed -e "s/&#x27;/'/g" -e 's/\xc2\xa0/ /g' -e 's/\xe2\x80\xaf/ /g' -e 's/\xe2\x80\x99/'"'"'/g')` ; `echo "$A" | grep -c "Premium ouvre tout"` → au moins `1` ; `echo "$A" | grep -c "S'abonner · 2,99 €/mois"` → au moins `1` ; `for p in / /abonnement /register /parcours /carnet /vannes /blog/se-presenter-avec-humour; do curl -s "https://deviens-marrant.fr$p?ne-pas-compter=1" | sed -e 's/\xc2\xa0/ /g' -e 's/\xe2\x80\xaf/ /g' | grep -c "Ouvrir les 5 parcours"; done` → `0` sept fois ; `for p in /abonnement /; do curl -s "https://deviens-marrant.fr$p?ne-pas-compter=1" | sed -e 's/\xc2\xa0/ /g' | grep -ciE "chaque semaine"; done` → `0` deux fois (`LETTRE_HEBDO_PROMESSE = false`). Commandes 2, 3 et 5 jouées par @qa contre le build local de `d8aae2f` : `1`, `1`, `0` ×6, `0`, `0`, `0`, `5`, `0` ×2.
3. **Contenu Premium fermé en visiteur** : `curl -s "https://deviens-marrant.fr/api/tips?ne-pas-compter=1" | jq '[.tips[] | select((.exercise // "") != "")] | length'` → `0` ; même chose pour `curl -s "https://deviens-marrant.fr/api/jokes?ne-pas-compter=1" | jq '[.jokes[] | select(.howToApply != null)] | length'` → `0` et `curl -s "https://deviens-marrant.fr/api/videos?ne-pas-compter=1" | jq '[.videos[] | select((.learnings|length) > 0 or .exercise != null)] | length'` → `0`. Un résultat non nul = P8 ter (la version servie n'est pas la bonne, règle P0 s8 : `git show` du commit déployé avant tout).
4. **Santé et en-têtes** : `curl -s "https://deviens-marrant.fr/api/health?ne-pas-compter=1" | jq '{status, mode: .checks.content.mode, dailyToday: .checks.content.dailyToday.status}'` → `status` `ok` (ou `degraded` pour le seul stock, comme en P6), `mode` `stock`, `dailyToday` `ok` ; `curl -sI "https://deviens-marrant.fr/lettre?ne-pas-compter=1" | grep -i '^referrer-policy'` → `same-origin` ; `diff` des en-têtes de sécurité de P6 contre `entetes-avant.txt` → aucune différence.
5. **SEO et GEO** : `curl -s "https://deviens-marrant.fr/llms.txt" | grep -c $'\xe2\x80\x94'` → `0` (même chose pour `/llms-full.txt`) ; `curl -s "https://deviens-marrant.fr/abonnement?ne-pas-compter=1" | grep -o '"@type":"Question"' | wc -l` → `5` (FAQ de vente, dont « Et si j'arrête ? »).
6. **À l'œil** (vrai navigateur, 375 px, visiteur) : en-tête « Premium » → `/abonnement?returnTo=<page>&src=header` ; une étoile de `/vannes` ouvre la fenêtre avec le début de la vanne entre guillemets. **Aucun paiement réel**.
7. **Trace** : heure, version et N-1 notées ici. À transmettre à @data-analyst : ruptures de série datées de la mise en ligne (voir l'entrée « Trajet de conversion s21 » plus bas).

**P8 ter. Retour arrière** : `npx wrangler rollback 3b52c0c2-a626-4be3-8471-85723c70e69e`, puis `npx wrangler deployments list | tail -8`.
- Réussite : `3b52c0c2` à 100 % ; `/`, `/abonnement`, `/api/health` en 200 ; `/abonnement` contient de nouveau l'ancienne page (sans « Premium ouvre tout »).
- Ce qu'il laisse : rien en base, hormis d'éventuelles lignes `UserFavorite` ajoutées après paiement (valides sur N-1). Un paiement lancé depuis la nouvelle version et repris sur N-1 aboutit quand même (webhook et `/abonnement/success` de N-1 ignorent `favori`, l'étoile n'est simplement pas remplie).
- Quand : une page en 5xx, un exercice Premium servi à un visiteur, ou le bouton d'achat de `/abonnement` qui ne mène pas à `/register` (visiteur) ou à Stripe (compte connecté).

**DÉPLOYÉ le 19/10/2026 à 09:37 UTC (11:37 Paris) : exclusion d'alex@ des statistiques, version `3b52c0c2-a626-4be3-8471-85723c70e69e` à 100 %, commit `7314477`, N-1 `20be1a8b-c30d-4085-87d4-e381b754fae7`.** P0 bis et P1 bis OK (CI verte run 39216914492, diff limité aux 5 fichiers). P4 bis : build:cf et deploy:cf en code 0 (lancés depuis la session principale, mode Accept edits, après feu vert explicite de Thomas). P6 bis réduit : 10 pages en 200, `/api/admin/{semaine,lettre,users,stats}` en 401, `/api/health` ok (mode stock, dailyToday ok), `Referrer-Policy: same-origin` sur `/lettre`, en-têtes de sécurité identiques. Retour arrière : `npx wrangler rollback 20be1a8b-c30d-4085-87d4-e381b754fae7`.


### Trajet de conversion s21 (19/10/2026) : /abonnement en page de vente, branche `claude/marrant-conversion` (depuis `29598ff`, enfant de `d01635b` de `claude/marrant-s21-integration`)

**PAS ENCORE À DÉPLOYER : relecture du trajet à l'aveugle d'abord (grille `docs/ux/trajet-conversion-s21.md` §11, captures `docs/design/conversion-s21/trajets-v1/`).** Rien au déploiement : aucune migration, aucun secret, aucune variable, aucune écriture en base.
- /abonnement refaite (textes `docs/copy/conversion-s21/textes-trajet-v1.md` et arbitrages du 19/10) ; « S'abonner » sur les 5 surfaces d'achat ; porte générique « Tout ouvrir · 2,99 €/mois » ; /a-propos visiteur vers /abonnement ; en-tête « Premium » sous 640 px et de 1 024 à 1 279 px ; /register depuis la fin d'étape 1, retour de paiement « Continuer », bienvenue, FAQ prix et JSON-LD Product alignés.
- Page d'attente « Te voilà connecté. » rendue par le serveur au retour d'inscription (`auto=1` avec session) : plus de flash de la page de vente avant Stripe ; tout échec rend la page complète.
- **Fusion avec `claude/marrant-lettre-hebdo`** : `apps/web/src/config/lettre-hebdo-promesse-temporaire.ts` (`LETTRE_HEBDO_PROMESSE = false`) est temporaire ; garder la constante de la branche lettre, supprimer ce fichier et repointer les imports (`grep -rn lettre-hebdo-promesse-temporaire apps/web/src` : 4 composants et 1 test).
- **Mesure** : `checkout-ouvert {src}` inchangé ; nouvelle propriété `emplacement` (`haut`, `bas`, `barre`) sur `abonnement-clic` de /abonnement. À transmettre à @data-analyst : rupture de série de `abonnement-vu` et `abonnement-clic` le jour de la mise en ligne (nouvelle page).
- **Tour 2 (19/10/2026, textes `docs/copy/conversion-s21/textes-trajet-v2.md` et arbitrages du tour 2, commits `7044849` à la tête de la branche)** : toujours PAS À DÉPLOYER avant la relecture à l'aveugle du trajet v2 (captures `docs/design/conversion-s21/trajets-v2/`, 375 × 700 et 320 × 640). Rien au déploiement : aucune migration, aucun secret, aucune variable.
  - Textes v2 partout (/abonnement, /register, fenêtre Premium, murs, carnet, fin d'article, FAQ prix, /conseils) ; « sauf résiliation » sur /register seulement (avis @legal, consigne de Thomas : page d'attente au texte v2).
  - **Inscription par e-mail : plus de page d'attente** ; le paiement s'ouvre depuis /register, attente dans le bouton (`lib/checkout-apres-inscription.ts`). Google et connexion gardent une attente brève (sans pied de page) sur /abonnement `auto=1`.
  - **Favori après paiement** : l'étoile mémorise l'élément dans `returnTo` (`favori=JOKE.<id>`) ; /abonnement/success l'ajoute (POST /api/favorites, plan vérifié) avant de rediriger. Écriture en base : une ligne `UserFavorite`, comme un clic sur l'étoile.
  - **Fuite corrigée** : `/api/jokes`, `/api/tips`, `/api/videos` vident `howToApply`, `exercise`, `learnings` pour un compte non Premium (comme le HTML public).
  - **Mesure** (à transmettre à @data-analyst) : `checkout-ouvert {src, formule}` toujours émis, désormais depuis /register pour une inscription par e-mail ; `abonnement-vu {src: "retour-inscription"}` disparaît pour ces inscriptions (rupture datée de la mise en ligne) ; `abonnement-clic {declencheur: "auto"}` émis depuis /register. M05 (carnet) et W07 (vote, carte) gardent leur `src` (`carnet`, `modale-vote`, `modale-carte`) jusqu'à `checkout-ouvert`.
  - Contrôles : tsc ×3, `next lint`, build, Jest complet, Playwright `local` (115) et smoke (128) contre le build, en `env -i` avec les variables factices de la CI.
- **Tour 3 (19/10/2026, textes `docs/copy/conversion-s21/textes-trajet-v3.md` et arbitrages du tour 3, commit `1bdaef3` et suivants)** : toujours PAS À DÉPLOYER avant la relecture à l'aveugle (captures `docs/design/conversion-s21/trajets-v3/`). Rien au déploiement : aucune migration, aucun secret, aucune variable.
  - Textes v3 (avantage 1, carnet, tableau, attente « Dernière étape. », bienvenue BV1 à BV3, FAQ « Et si j'arrête ? », fin d'article F02b et lien gratuit unique S01). « TTC » non remis, titre de /abonnement inchangé.
  - **Retour sur la page d'origine** : le bouton « Premium » de l'en-tête (et le menu mobile) et la recherche passent le `returnTo` de la page courante (sauf l'accueil, qui garde /parcours).
  - **Drapeau « favori ajouté »** : /abonnement/success ajoute `favori=JOKE|TIP|VIDEO` (le type, jamais l'id) à la destination seulement si l'ajout a réussi ou 409 ; la bienvenue le lit (liste blanche).
  - La FAQ « Et si j'arrête ? » garde sa dernière phrase (favoris et progression conservés) grâce au test `__tests__/api/resiliation-conserve-favoris-progression-s21.test.ts` ; s'il tombe, retirer la phrase.
  - **Mesure** (à transmettre à @data-analyst) : après paiement, les visiteurs venus de l'en-tête reviennent sur leur page d'origine au lieu de /parcours (rupture datée sur les pages vues après `abonnement-reussi`) ; nouvelle question dans le JSON-LD FAQPage (accueil, /abonnement).
  - Contrôles : tsc ×3, `next lint`, build, Jest complet, Playwright `local` et smoke contre le build, en `env -i` avec les variables factices de la CI.
- **Finition du tour 3 (19/10/2026, arbitrages de l'orchestrateur après la relecture v3 : 9,5 / 9,8 / 10)** : PAS À DÉPLOYER tant que l'orchestrateur ne l'a pas validé (captures `docs/design/conversion-s21/trajets-v3-1/`). Rien au déploiement.
  - Textes : fenêtre « Premium ouvre aussi… », avantage 3 « Chaque mois, un carnet de situations et leurs répliques » (lien vers `#le-carnet-en-vrai`), ligne compte « D'abord ton compte, puis le paiement sur Stripe. ».
  - Mise en page : carte Annuel (séparateur sous 400 px), « 1 500+ inscrits » sous la garantie sous 360 px, FAQ à 560 px, cartes de formule à la hauteur de leur contenu, titre de la fiche centré ; T3 : étape 2 non répétée dans la liste quand la carte est affichée, lettre gratuite sous la liste.
  - Mesure : la lettre gratuite de fin d'étape 1 change de place (emplacement `parcours` inchangé) : rupture possible du taux d'inscription depuis cette ligne, à transmettre à @data-analyst.

### Exclusion d'alex@deviens-marrant.fr des statistiques (19/10/2026, feu vert de Thomas), branche `claude/marrant-exclusion-alex` (depuis `7cce384` de `claude/marrant-s21-integration`, avance rapide possible)

**Rien au déploiement : aucune migration, aucun secret, aucune variable, aucune écriture en base.** `ANALYTICS_EMAILS_EXCLUS` est un secret illisible : ne PAS le reposer (un `secret put` écraserait les 3 adresses de Thomas). Le code ajoute `EMAILS_INTERNES_EXCLUS` (`apps/web/src/lib/analytics/comptes-test.ts`), fusionné avec le secret dans `emailsExclus()`.
- Effets : plus de `mesure=1` à la confirmation de la lettre pour cette adresse ; exclue du rapport du lundi, de l'admin et des alertes. La liste n'est plus jamais vide : une lecture `user.findMany` de plus par rapport (lecture seule).
- **Mesure** : rupture datée de la mise en ligne si alex@ a un compte ou une inscription à la lettre (−1, ligne « compte(s) de test exclu(s) » +1). À transmettre à @data-analyst.
- **Procédure courte** : P0 bis (HEAD = `origin`, CI verte sur le commit déployé, `git diff --stat bb470f3 HEAD -- apps/web .github` = `comptes-test.ts` + 4 fichiers de test), P1 bis, P4 bis, P6 bis réduit (étapes 1, 2 et 4 : pages en 200, admin en 401 ×4, santé et en-têtes), P8 bis avec N-1 = `20be1a8b-c30d-4085-87d4-e381b754fae7` (`npx wrangler rollback 20be1a8b-c30d-4085-87d4-e381b754fae7`). Aucun essai d'inscription en production (écriture en base) : la preuve est le test `exclusion-alex-s21.test.ts`.

**Deuxième mise en ligne s21 (admin et revue visuelle, branche `claude/marrant-s21-integration`)** : **DÉPLOYÉ le 19/10/2026 à 03:22 UTC, version `20be1a8b-c30d-4085-87d4-e381b754fae7`, N-1 `586c4adc`, commit `bb470f3`** (résultats dans l'entrée plus bas). suivre la variante « DEUXIÈME MISE EN LIGNE s21 » en tête de l'entrée « s21 Intégration » plus bas (P0, P1, P4, P6 adapté, P8, N-1 `586c4adc`). P2, P3, P5 et P7 sont déjà faits en production : ne pas les rejouer. Contre-épreuve : `docs/qa/qa-contre-epreuve-s21-deuxieme-mise-en-ligne.md`.

### Page admin s21 (18/10/2026) : refonte + inscrits à la lettre, branche `claude/marrant-s21-admin` (depuis `claude/marrant-s21-integration`)

**Rien au déploiement : aucune migration, aucun secret, aucune variable nouvelle, aucune écriture en base.** Lecture seule. Sans la migration 14, la page tourne (numéros de la lettre affichés « migration 14 non jouée »).
- `/admin` : onglets Semaine (défaut : semaine du dernier rapport du lundi, ou 7 derniers jours), Abonnés (Premium et comptes ; Lettre), Réseaux sociaux, Planning. Connexion inchangée.
- Nouvelles routes, même protection Bearer `ADMIN_PASSWORD` : `GET /api/admin/semaine`, `GET /api/admin/lettre` (jamais l'empreinte IP ni les jetons).
- Rapport du lundi : section « Lettre mensuelle » ajoutée ; ligne « Abonnés actifs » ventilée mensuel / annuel. Mêmes fonctions que la page admin.
- **Comptes de test (`ANALYTICS_EMAILS_EXCLUS`) exclus** des comptes créés, abonnés actifs, revenu mensuel, nouveaux abonnés et résiliations, dans l'admin ET l'e-mail du lundi (même fonction `prismaFunnelCounter`), ligne « N compte(s) de test exclu(s) ». **Rupture de série datée de la mise en ligne** : ces chiffres baissent du nombre de comptes de test (à transmettre à @data-analyst).
- `/admin` et `/admin/ceo` : coquille dédiée (barre « Backoffice », « Voir le site », Déconnexion), sans l'en-tête ni le pied de page publics. `/admin/social` inchangé.
- Audit et captures : `docs/admin/audit-admin-s21.md`, `docs/admin/captures/`.
- Après mise en ligne : ouvrir `/admin` après 07:00 Paris, vérifier l'onglet Semaine (« Semaine du rapport » = 12/10 au 18/10) contre l'e-mail du **lundi 19/10**, premier parti de `bb470f3` (déployé le 19/10 à 05:22 Paris, avant le rapport de 7 h) : comptes de test exclus et section lettre. Le 19/10 ouvre une nouvelle série (rupture), voir `docs/data/mesure-apres-s21.md`. (QA m-1 révisé.)

### Revue visuelle s21 (ordinateur et mobile) : branche `claude/marrant-s21-visuel`, à fusionner dans `claude/marrant-s21-integration` avant la mise en ligne

Mise en page seulement : **aucun texte modifié, aucune migration, aucun secret, aucune variable, aucune écriture en base**. Gabarit de colonne unique (`apps/web/src/components/layout/gabarit.ts`) : pages catalogue sur la pleine colonne, pages de lecture sur une colonne centrée de 768 px, un seul style de bloc d'appel ; mur des listes aligné sur la liste, phrase de limite dans le mur ; FAQ en accordéon commun ; cibles tactiles de 44 px sur mobile. Audit, avant/après et 540 captures : `docs/design/revue-visuelle-s21/`. Nouveau test Playwright `local` : `mur-alignement-s21.spec.ts`. Après déploiement : ouvrir `/conseils` en visiteur à 1 280 et 375 px, le bloc « Pour la prochaine fois qu'on te chambre » doit avoir les bords de la liste.
Tour 2 (verdict @design, 31 défauts, `docs/design/revue-visuelle-s21/audit.md` §7) : mêmes règles (rien au déploiement). Visible : /conseils et /glossaire en 2 colonnes dès 1 024 px, favoris vidéo en vignette bornée, cartes du jour de même hauteur, pastilles de filtre sur une ligne qui défile sur mobile, voile sous le menu mobile, marges de 32 px dès 1 280 px, apostrophes typographiques sur les textes passés par `frTypo` et les contenus de la base (aucun mot changé). Admin : onglets 2 x 2 sur mobile.
Tour 3 (verdict @design 8,7/10, `audit.md` §8) : rien au déploiement non plus. Visible : dernière carte seule d'un mur en pleine rangée horizontale, marges de 24 px de 768 à 1 279 px, apostrophes typographiques (’) et guillemets « » insécables dans tout le texte affiché, sans aucun mot changé (slugs, URL et données en base intacts).
Tour 4 (verdict @design 9,3/10, `audit.md` §9) : rien au déploiement non plus. Visible : boutons prix sur une ligne à 375 px partout (2 lignes dans le bouton à 320 px pour 6 libellés, signalés), « stand-up », « start-up », « auto-dérision » jamais coupés en fin de ligne, /conseils en 3 colonnes dès 1 280 px, titre de la fiche vanne équilibré, /favoris en 2 colonnes dès 768 px, catégories de /vannes sur une rangée défilante, admin : adresses entières à 375 px et apostrophes courbes. Aucun mot changé.

### Blocs d'appel s21 et concision du tunnel : UNE SEULE ENTRÉE, branche `claude/marrant-s21-integration` (consolidée par @reviewer le 18/10/2026, revue `docs/reviews/revue-cta-s21-v3.md`, HEAD relu `712d6ae`), **DÉPLOYÉ le 18/10/2026 avec l'intégration s21 (version `586c4adc`, commit `43c222f`, N-1 `5ea46dd8`) ; résultats des contrôles dans l'entrée P0 à P8**

Part avec la mise en ligne s21 (P0 à P8 ci-dessous), jamais seule. **Rien de propre à cette entrée au déploiement : aucune migration, aucun secret, aucune variable nouvelle, aucune écriture en base** (migration 14 et P5 = celles de la lettre, dans P0 à P8). Une seule donnée change : la clé `intro` du carnet de novembre (`apps/web/src/data/carnet/2026-11.json`, sha256 `e2b15d0f…5b270a`, épinglé par le test `carnet-novembre-2026`). **Textes : `docs/copy/cta-s21/concision/VALIDE.md` + `textes-v5-a/b/c.md`, seule référence** (remplacent `textes-finaux-valides.md` et `textes-valides-boutons.md`) ; code : `apps/web/src/config/textes/*.ts`, `lib/faqs.ts`. L'historique des tours (QA v1 à v3, revues v1 à v3, E1 à E6, structure puis textes de la concision) est dans le journal git de la branche, `docs/qa/` et `docs/reviews/` : il ne contient plus aucune consigne à exécuter.

**Ce qui change (état final)**
- Tunnel réécrit en v5 : un bloc = un titre, une phrase, un bouton plein, puis la réassurance unique « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » sous chaque plein qui porte un prix, puis un lien. Libellé payant unique « Ouvrir les 5 parcours · 2,99 €/mois ». Surfaces : accueil (haut, carte Premium), en-tête, articles (démonstration du carnet au milieu, bloc de fin, lettre), murs `/vannes` `/conseils` `/videos` (une seule carte floutée), fiches, fenêtre Premium, quiz, `/parcours` et page d'un parcours, fin d'étape 1, `/abonnement`, `/register`, retour de paiement, `/carnet`, `/profil`, `/glossaire`, `/a-propos`, FAQ de vente (4 questions sur l'accueil et `/abonnement`), e-mail de confirmation (une phrase).
- Structure : plus de lien payant dans le haut de l'accueil. Le payant passe par le bouton prix de l'en-tête, visible à toutes les largeurs : « 2,99 €/mois » sous 640 px et de 1 024 à 1 279 px, « Premium · 2,99 €/mois » de 640 à 1 023 px et dès 1 280 px (onglets resserrés, revue v3 m4) ; il est masqué sur `/abonnement` et `/register`. **Même bouton pour le compte sans abonnement** (QA v4 m-3) : « Activer mon accès » n'existe plus, le compte a le bouton prix à toutes les largeurs (avant : rien sous 1 024 px), vers `/abonnement?src=header` comme le visiteur (plus de `returnTo` de la page courante).
- Fin d'étape 1 (visiteur) : le plein « Passer à l'étape 2 · 2,99 €/mois » mène à `/register`, quiz fini ou en cours (revue v3 m6). Le paiement s'ouvre ensuite tout seul, puis on revient au parcours. Sous la réassurance, une ligne de la lettre déplie le champ (emplacement `parcours`).
- `/register` : plus de champ prénom, Google passe en premier, la mention des CGU juste dessous (revue v3 m2). Le prénom se renseigne dans `/profil` (carte « Ton prénom », route `PATCH /api/user`).
- Fins des 11 articles « à forte frappe » (correction C1, `docs/copy/cta-s21/concision/fins-articles-v3.md`) : titre et phrase v3, plein « Tester l'étape 1 de {P}, gratuite » (5 articles qui nomment un parcours) ou « Tester mes premières répliques, gratuit », « Sans compte. », lien « Ouvrir les 5 parcours · 2,99 €/mois » ; titres du bloc de fin sans point final (sauf « ? » et « » »). L'article n°1 garde son bloc v5.
- Libellé unique du plein de fin d'article (QA v4 m-2) : parcours connu, Répartie compris = « Tester l'étape 1 de {P}, gratuite » ; « Tester mes premières répliques, gratuit » reste à l'accueil, à l'article n°1 et aux articles dont le parcours n'est pas connu.
- QA v4 m-4 à m-7 : résultat du quiz d'orientation (compte sans abonnement) réduit au bloc v5, parcours nommé une fois, plein payant au-dessus du lien gratuit et dans le premier écran à 375 × 812 (bas du plein : 923 → 708 px) ; plus de pagination sous les murs pour une liste limitée (visiteur, compte sans abonnement : les pages 2 et suivantes étaient vides ; l'abonné la garde, le HTML du serveur garde les liens `?page=N`) ; encart « Abonnement 2,99 €/mois » de `/parcours` masqué à l'abonné ; formulaire de la lettre de fin d'étape 1 chargé au dépliage (First Load `/parcours/[slug]` 153 → 149 kB).
- Murs `/vannes`, `/conseils`, `/videos` : plus de « Page dédiée ». Sur `/conseils` et `/videos`, le titre de chaque carte est le lien vers la fiche. Sur `/vannes`, toucher l'amorce (ou la carte) révèle la chute, comme avant ; le lien vers la fiche est une petite flèche sans texte au coin inférieur droit de la carte (nom accessible « Voir la fiche de cette vanne », cible de 44 px). Même maillage : un lien de fiche par carte (mesuré en local : 12 / 10 / 12 avant et après).
- Avantages Premium (4 lignes) : sur `/abonnement` seulement.
- Gardé de l'intégration :
  - avec Premium, toutes les étapes sont ouvertes d'un coup (plus de 409 `ordre`) ;
  - section « Articles » (l'adresse `/blog` ne change pas) ;
  - carnet de novembre embarqué (30 fiches, offerte `2026-11-10`, bascule le 01/11 à 00:00 Paris), numéro réel de la fiche offerte ;
  - l'abonné est reconnu par la session.
- Gardé volontairement (revue v3) :
  - « Voir par où commencer » (abonné) ;
  - titre « Passe Premium » du paywall natif.

**Mesure (à transmettre à @data-analyst ; rupture datée par la trace de P6)**
- Rapport du lundi, tableau « Paiement ouvert par bloc d'entrée (src) » (`checkout-ouvert` / `checkout-echec`) :
  - sources ajoutées : `header` (seule entrée payante du haut de l'accueil), `accueil-premium`, `carnet`, `glossaire`, `parcours-liste`, `favoris`, `recherche`, `a-propos`, `onboarding-visiteur` ;
  - **source supprimée : `accueil-hero`** (série close à la mise en ligne). `abonnement-clic` ne porte plus `accueil`.
- Fin d'étape 1 (visiteur) :
  - `parcours-etape` ne passe plus par `abonnement-vu` ; on la retrouve dans `inscription-envoi` / `inscription-reussie`, puis dans `checkout-ouvert` ;
  - **`abonnement-clic` baisse mécaniquement** sur ce chemin : il ne reste que le clic automatique, compté `src: abonnement, declencheur: auto` ;
  - juger sur `checkout-ouvert` et sur les paiements Stripe, pas sur `abonnement-clic`.
- `abonnement-vu` : `retour-inscription` remplace `direct` après une inscription. `direct` baisse aussi (`onboarding-visiteur`, `favoris`).
- `parcours-ouvert` : nouvelles valeurs `mur-vannes`, `mur-conseils`, `mur-videos`, `glossaire-etape1`, `a-propos-etape1`, `register-etape1` (lien vers l'étape 1 sous le formulaire de `/register`, compté `abonnement` jusque-là : revue v3 m3).
- Lettre : `lettre-vu` / `lettre-inscrite` peuvent porter `emplacement: "parcours"` ; source `parcours` en base.

**Vérifié par @fullstack en local (sur `a641de4` + spec `murs-titres-s21`, `env -i` avec les seules variables factices de `tests.yml`)** :
- `tsc -p tsconfig.build.json`, `tsc` complet et `tsc -p ../../playwright/tsconfig.json` : OK.
- `next lint` : OK (avertissements `<img>` préexistants). `npm run build` : OK.
- Jest : 340 suites / 5 198 tests OK (5 ignorés). Playwright, projet `local` : 44/44 OK (dont en-tête à 1 280 px avec « Premium · 2,99 €/mois », titres cliquables des murs au clavier).
- Maillage des murs, HTML du serveur sur la même base jetable : 12 / 10 / 12 liens de fiche sur `/vannes`, `/conseils`, `/videos` avant (`f0f400a`) et après, mêmes fiches.
- Flèche de fiche de `/vannes` (commit suivant `f5946f6`, mêmes contrôles `env -i`) : tsc ×3, lint, build OK ; Jest 340 suites / 5 198 tests OK ; Playwright `local` 47/47 OK (amorce touchée = chute révélée, flèche = fiche) ; maillage 12 / 10 / 12, 12 flèches, 0 « Page dédiée » ; First Load `/vannes` 133 kB inchangé.
- First Load JS (avant la QA v4) : `/parcours/[slug]` 153 kB, `/register` 127 kB (126 avant), `/vannes` 133, `/conseils` 134, `/videos` 138 kB (inchangés).
- **Correctifs de la QA v4** (`docs/qa/qa-cta-s21-v4.md`, commits `1883d71` à `d975885`, mêmes contrôles `env -i` avec les seules variables factices de `tests.yml`) :
  - MJ-1 : smoke `@s21` de la fin d'étape 1 (quiz en cours) mis à jour (`/register`, `src=parcours-etape`, `callbackUrl` vers `/abonnement?returnTo=…`). **Smoke complet (desktop + iPhone 13) contre le build local : 128 réussis, 2 ignorés (voulus), 0 échec** ; le contrôle 11 ne sortira plus rouge sur ce test ;
  - m-1 : contrôle 14 réécrit avec des motifs ancrés sur le HTML affiché (vérifiés sur le build local, articles posés en base jetable : `Reste le repas\.` valait 1 à cause de la charge RSC, `Reste le repas\.<` vaut 0) ;
  - tsc ×3, `next lint`, build : OK. Jest : 342 suites / 5 212 tests OK (5 ignorés). Playwright `local` : 54/54 OK (dont `mineurs-qa4-s21`, en-tête du compte FREE de 320 à 768 px, lettre dépliée sans saut de la ligne ni du plein) ;
  - First Load JS : `/parcours/[slug]` 153 → **149 kB** ; `/parcours` 128 → 129, `/vannes` 133 → 134, `/blog/[slug]` 128 → 129 ; `/` 146, `/onboarding` 130, `/abonnement` 132, `/register` 127, `/conseils` 134, `/videos` 138 inchangés.
- **À faire avant P0** : CI verte sur le commit final, et contre-épreuve @qa de la concision (rendu à 320, 375, 768 et 1 280 px, captures lues).

**Contrôles P6 : SEULE liste valable (revue v3, 18/10). Elle remplace toutes les anciennes listes et consignes de contrôle de cette entrée.**

Règles de lecture :
- `?ne-pas-compter=1` sur toutes les adresses.
- `grep -c` compte des LIGNES, et le HTML tient sur peu de lignes : « ≥ 1 » veut dire présent, « 0 » veut dire absent.
- Aucun motif ne contient d'apostrophe (elle est échappée en `&#x27;` dans le HTML).
- Si un motif attendu manque : d'abord `git show <commit déployé>:apps/web/src/config/textes/offre.ts | grep -c REASSURANCE_UNIQUE` → 1 (règle P0 s8), puis @fullstack. Un écart de texte ne déclenche pas P8, sauf si la page est cassée.

Contrôles :
1. **Accueil**, `U="https://deviens-marrant.fr/?ne-pas-compter=1"` puis `curl -s "$U" | grep -c "<motif>"` :
   - ≥ 1 : `Tester mes premières répliques, gratuit`, `inscrits bossent leur humour`, `afterwork`, `data-en-tete-prix` ;
   - 0 : `Rejoins-les`, `accueil-hero`, `avantages-premium`, `Débloquer`, `Droit de rétractation`, `Tu crois avoir tout essayé`.
2. **`/abonnement`**, `A="https://deviens-marrant.fr/abonnement?ne-pas-compter=1"` :
   - ≥ 1 : `Ta réplique en soirée`, `attente entre les étapes`, `premier paiement remboursable sous`, `puis le paiement sécurisé`, `avantages-premium` ;
   - 0 : `1 clic`, `par semaine conseillée`, `Tu annules quand tu veux`, `économisés`, `Situation 1, offerte` ;
   - jusqu'au 31/10 : `Situation 15, offerte` ≥ 1 ; dès le 01/11 : `Situation 10, offerte` ≥ 1 ;
   - `curl -s "https://deviens-marrant.fr/abonnement?returnTo=%2Fparcours%2Fconfiance&ne-pas-compter=1" | grep -c "Rire à table, sans monter sur scène"` ≥ 1.
3. **`/register`** :
   - ≥ 1 : `Créer mon compte et passer au paiement`, `Continuer avec Google`, `premier paiement remboursable sous`, `src=register-etape1` ;
   - ordre (revue v3 m2) : `curl -s "https://deviens-marrant.fr/register?ne-pas-compter=1" | grep -oE "Continuer avec Google|tu acceptes les|Mot de passe" | head -3` → `Continuer avec Google`, `tu acceptes les`, `Mot de passe` ;
   - 0 : `autocomplete="given-name"` (motif entre apostrophes simples), `Étape 1 sur 2`.
4. **Parcours** :
   - `/parcours` : `Sans compte. La suite` ≥ 1, `abonnement?src=parcours-liste` ≥ 1, `Commencer Répartie` 0 ;
   - `/parcours/repartie` : `Étape 1 gratuite, la suite avec Premium` ≥ 1, `Fait partie de Premium` 0, `grep -ci "sans engagement"` 0 ;
   - `/parcours/confiance` : `pour débloquer` 0.
5. **Article**, `B="https://deviens-marrant.fr/blog/meilleures-blagues-droles-2026?ne-pas-compter=1"` :
   - ≥ 1 : `Situation offerte ce mois-ci`, `pas dans ton téléphone<`, `Tester mes premières répliques, gratuit<`, `Ouvrir les ` ;
   - 0 : `La situation offerte`, `TTC par mois`, `Débloquer` ;
   - article Répartie (QA v4 m-2) : `curl -s "https://deviens-marrant.fr/blog/jamais-quoi-repondre-techniques?ne-pas-compter=1" | grep -c "<motif>"` → `de Répartie, gratuite<` ≥ 1, `Tester mes premières répliques, gratuit` 0.
6. **`/carnet` jusqu'au 31/10**, `C="https://deviens-marrant.fr/carnet?ne-pas-compter=1"` :
   - ≥ 1 : `Il en reste 14`, `Et 11 autres répliques`, `Voir tout le carnet`, `returnTo=%2Fcarnet&amp;src=carnet` ;
   - 0 : `avantages-premium`, `Débloque tout le carnet`, `je parle dans un ascenseur`, `fiche-2026-11` ;
   - `curl -s "https://deviens-marrant.fr/carnet?src=blog-demo-milieu-1&ne-pas-compter=1" | grep -c "returnTo=%2Fcarnet&amp;src=blog-demo-milieu-1"` ≥ 1.
7. **Carnet de novembre, le 01/11 APRÈS 01:00 Paris** (si la mise en ligne a lieu plus tard : en P6). Sur `$C` :
   - ≥ 1 : `fiche-2026-11-10`, `Il en reste 29`, `Et 26 autres répliques`, `préparatifs de Noël` ;
   - 0 : `fiche-2026-10-15` ;
   - puis `curl -s "$B" | grep -c "blog-demo-milieu-1#fiche-2026-11-10"` ≥ 1. Le cache de la page dure 1 h (ISR) : faire deux requêtes à quelques secondes d'écart ;
   - si écart : `git show <commit déployé>:apps/web/src/data/carnet/2026-11.json | sha256sum` → `e2b15d0f…5b270a`, puis @fullstack.
8. **Fins de page** :
   - `/glossaire` : ≥ 1 pour `Reste à s`, `ça se travaille`, `abonnement?src=glossaire`, `src=glossaire-etape1` ; 0 pour `Commencer à` ;
   - `/a-propos` : ≥ 1 pour `voilà le programme`, `src=a-propos-etape1` ; 0 pour `Accéder aux parcours complets`, `pour juger sur pièce`.
9. **Redirection et fiche** :
   - `curl -s -o /dev/null -w '%{redirect_url}\n' "https://deviens-marrant.fr/onboarding"` → `https://deviens-marrant.fr/abonnement?src=onboarding-visiteur` ;
   - fiche vanne réelle : `F=$(curl -s https://deviens-marrant.fr/sitemap.xml | grep -oE 'https://deviens-marrant.fr/vannes/[a-z0-9-]+' | grep -v '/vannes/theme$' | head -1)` (motif corrigé le 18/10 : l'ancien prenait `/vannes/theme`), puis `curl -s -o /dev/null -w '%{http_code}\n' "$F?ne-pas-compter=1"` → `200`.
10. **À l'œil, téléphone** (375 px, et 320 px pour l'accueil), sans payer :
    - **Visiteur** :
      - accueil : bouton « 2,99 €/mois » dans l'en-tête, un seul plein au premier écran ;
      - bas de `/vannes` : « Encore des vannes à ressortir », une seule carte floutée qui ouvre « Le reste de la liste est juste derrière » ;
      - fiche vanne : « Écrire la mienne · 2,99 €/mois », réassurance, lien gratuit ;
      - cœur d'une vanne : fenêtre « Mets-la de côté » ;
      - fin de l'étape 1 de Répartie : « Bien joué ! », carte « Étape 2 sur 4 », le plein ouvre `/register`, réassurance, la ligne de la lettre déplie le champ (sans que la ligne ni le plein bougent) ;
      - bas de `/vannes` : aucune pagination sous le mur (QA v4 m-5).
    - **Compte sans abonnement** (jamais le compte Premium) :
      - accueil : carte « Et si ton… », plein, réassurance ; en-tête : bouton « 2,99 €/mois » (comme le visiteur), plus de « Activer mon accès » (QA v4 m-3) ;
      - `/abonnement` : titre du parcours d'origine, « Paiement sécurisé par Stripe », bouton entier sans défiler ;
      - `/profil` : « Chaque mois, un nouveau carnet… », plein ; carte « Ton prénom » : enregistrer un prénom, puis le vider ;
      - un cœur sur `/vannes` : fenêtre sans « Deux étapes » ;
      - menu → « Favoris » arrive sur `/abonnement?returnTo=%2Ffavoris&src=favoris`.
    - **Compte Premium de l'équipe** :
      - accueil sans carte Premium ;
      - un cœur sur `/vannes` devient « Retirer des favoris » ;
      - `/glossaire` sans bloc payant ; `/parcours` sans encart « Abonnement 2,99 €/mois » (QA v4 m-6) ;
      - étape 3 de `/parcours/confiance` ouverte (contrôle de P6, ne pas valider).
11. **Smoke** : `E2E_BASE_URL=https://deviens-marrant.fr npm run test:e2e:smoke -- --grep @s21` (lecture seule ; `test:e2e:smoke:deploye` exclut `@s21`).
12. **Mesure** :
    - le lendemain : `checkout-ouvert` / `checkout-echec` visibles dans Umami, avec la source, après un essai de paiement abandonné ;
    - le lundi suivant : le rapport contient « Paiement ouvert par bloc d'entrée (src) ». Sinon : `git show <commit déployé>:apps/web/src/lib/analytics/weekly-funnel.ts | grep -c checkout-ouvert`, puis @fullstack.
13. **Contrôle daté du 01/12** : un carnet de décembre est en ligne (« Un nouveau carnet arrive chaque mois » est affiché sur le carnet, le profil et `/abonnement`). Sinon : @copywriter et @fullstack avant le 30/11.
14. **Bloc de fin des 11 articles « à forte frappe »** (correction C1 de la revue v3, faite au commit `1403f4b`, textes `docs/copy/cta-s21/concision/fins-articles-v3.md`). Ces articles sont en base : contrôle sur le site (404 sur un build local sans ces lignes). `curl -s "https://deviens-marrant.fr/blog/<slug>?ne-pas-compter=1" | grep -c "<motif>"`. **Motifs ancrés sur le HTML affiché** (QA v4 m-1) : la page transmet aussi les textes bruts du bloc dans la charge RSC (`"title":"…"`), où un motif nu se trouve même si le texte affiché diffère ; les motifs ci-dessous finissent par `<` (fin de balise) ou commencent par `>`, ce que la charge RSC ne contient pas (vérifié sur un build local avec ces articles en base jetable : chaque motif « ≥ 1 » vaut 1 dans le HTML et 0 dans la charge RSC) :
    - `message-anniversaire-drole-par-situation` : ≥ 1 pour `Au moment du gâteau, tout le monde t&#x27;écoute<`, `de quoi enchaîner après la chanson.<`, `Tester mes premières répliques, gratuit<`, `Sans compte.<` ; 0 pour `Les parcours complets`, `Passer à Premium`, `Reste le moment du gâteau` ;
    - `blagues-de-couple-drole` : ≥ 1 pour `>Chez vous, qui a le dernier mot`, `de Répartie, gratuite<` ; 0 pour `Commencer le parcours`, `Les parcours complets` ;
    - `message-drole-fete-des-peres` : ≥ 1 pour `Reste le repas<` (titre sans point final) ; 0 pour `Reste le repas\.<` (point échappé, suivi de la fin de balise : le titre brut « Reste le repas. » de la charge RSC n'est pas compté), `Les parcours complets` ;
    - `blagues-poisson-d-avril-adultes` : ≥ 1 pour `Une riposte, ça se prépare avant.<` ; 0 pour `Le canular est prêt` ;
    - `meilleures-blagues-droles-2026` : contrôle 5 (bloc v5 `pas dans ton téléphone<`), 0 pour `Tu les as lues`.
    Les motifs « 0 » restants n'existent nulle part dans le code (ni charge RSC possible). Si écart : `git show <commit déployé>:apps/web/src/config/blog-cta.ts | grep -c "Au moment du gâteau"` → 1, puis @fullstack.
15. **Lien de fiche des cartes des murs** (`/vannes` : flèche de coin ; `/conseils`, `/videos` : titre cliquable) :
    - **Relevé N-1 (avant P0, sur le site actuel)**, puis le même après la mise en ligne : `for r in vannes conseils videos; do curl -s "https://deviens-marrant.fr/$r?ne-pas-compter=1" | grep -oE "<a [^>]*href=\"/$r/[^\"?#]+\"" | grep -v "/$r/theme/" | wc -l; done` → les trois nombres sont identiques avant et après (maillage inchangé : un lien de fiche par carte ; 12 / 10 / 12 en local, avant comme après) ;
    - `for r in vannes conseils videos; do curl -s "https://deviens-marrant.fr/$r?ne-pas-compter=1" | grep -o "Page dédiée" | wc -l; done` → `0` trois fois ;
    - `curl -s "https://deviens-marrant.fr/vannes?ne-pas-compter=1" | grep -o "Voir la fiche de cette vanne" | wc -l` → même nombre que le premier relevé de `/vannes` (chaque lien de fiche est une flèche) ;
    - à l'œil (ordinateur) : Tab jusqu'au titre de la première carte de `/conseils` (anneau de focus visible), Entrée ouvre sa fiche ; sur `/vannes`, un clic sur l'amorce révèle la chute (on reste sur `/vannes`), Tab jusqu'à la flèche du coin inférieur droit (anneau visible), Entrée ou clic ouvre la fiche sans révéler la chute ;
    - à l'œil (téléphone) : sur `/vannes`, toucher l'amorce révèle la chute ; toucher la flèche ouvre la fiche.
    Si écart : `git show <commit déployé>:apps/web/src/components/ui/liens.ts | grep -c FLECHE_CARTE_LIEN` → 1, puis @fullstack.

**Décisions** : la lettre en fin d'étape 1 (B14) est posée (choix de Thomas du 18/10). La ligne de la lettre au milieu des articles (B18) a été refusée par Thomas : elle n'est pas posée.


Retour arrière : celui de la mise en ligne s21 (P8). Aucune donnée à défaire.

### s21 Intégration (lot 2 boutons + lettre + mentions) : UNE SEULE MISE À JOUR, branche `claude/marrant-s21-integration`, sur feu vert de Thomas (@fullstack, 17/10/2026), **DÉPLOYÉ le 18/10/2026 à 20:11 UTC, version `586c4adc-12cd-41e5-ab09-d3064819baaf`, commit `43c222f`** (code identique à `f9b49bd`) ; N-1 `5ea46dd8-1e31-4175-bc99-3d0873925901` (retour arrière : `npx wrangler rollback 5ea46dd8-1e31-4175-bc99-3d0873925901`)

#### DEUXIÈME MISE EN LIGNE s21 (admin et revue visuelle) : P0, P1, P4, P6 adapté, P8 (@qa, 19/10/2026). **P2, P3, P5 et P7 ne se rejouent pas.**

**DÉPLOYÉ le 19/10/2026 à 03:22:58 UTC (05:22 Paris), version `20be1a8b-c30d-4085-87d4-e381b754fae7` (100 %), N-1 `586c4adc-12cd-41e5-ab09-d3064819baaf`, commit `bb470f3`** (@infrastructure ; retour arrière : `npx wrangler rollback 586c4adc-12cd-41e5-ab09-d3064819baaf`). Aucune écriture en base, aucun secret, aucune variable ; `startup-tasks` non appelé. Résultats :
- **P0 bis OK, un écart attendu** : arbre propre, HEAD = `origin` = `bb470f3` ; « Tests CI » run `39193566445` `success` sur `bb470f3` (`test`, `lint`, `e2e-local` à `success`) ; boucle `for` vide. Écart : `git diff --stat ffb2ad7 HEAD -- apps/web .github` n'est pas vide, il contient le correctif QA m-3 (`bb470f3`, `components/admin/lettre-section.tsx`, +5 lignes d'affichage de la date de désinscription), voulu par la coordination et couvert par cette CI.
- **P1 bis OK** : N-1 `586c4adc` à 100 % ; `entetes-avant.txt` relevé (25 lignes). Avant : `/api/admin/semaine` et `/api/admin/lettre` en 404, `users` et `stats` en 401 ; murs 12 / 10 / 12.
- **P4 bis OK** : `df -h /` 20 Go libres ; `rm -rf .open-next`, `build:cf` et `deploy:cf` en code 0 (16 messages Prisma « URL must start with postgresql:// » au build, replis attendus, identiques au 18/10) ; déclencheurs `*/15 * * * *` et `0 1 * * *` reposés.
- **P6 bis** :
  1. Pages : 16 en 200 (`/`, `/abonnement`, `/lettre`, `/confidentialite`, `/cgu`, `/register`, l'article, `/quiz-humour`, `/parcours`, `/carnet`, `/vannes`, `/conseils`, `/videos`, une fiche vidéo du sitemap, `/admin`, `/api/health`).
  2. Admin sans authentification : `semaine`, `lettre`, `users`, `stats` en `401`. En plus, les 22 routes `/api/admin/*` du code sondées en GET et en POST : 401 ou 405, aucun 200.
  3. Admin avec Bearer : `semaine` 200, `lettre` 200 ; `ipAddress|userAgent|token` dans `/api/admin/lettre` : `0` (clés `disponible`, `liste`, `resume`) ; `noindex` sur `/admin` : 1 ; aucun chiffre sur `/admin` sans connexion.
  4. `/api/health` : `status` `ok`, `mode` `stock`, `dailyToday` `ok`, stock `ok` (123 j de vannes, 100 j de conseils ; `jokesNeverUsed` 50, `tipsNeverUsed` 27) ; `Referrer-Policy: same-origin` sur `/lettre` ; en-têtes de sécurité : aucune différence.
  5. `/lettre` 0 `bingbot` ; réassurance dans `/llms.txt` : 1 ; U+2060 dans liens et métadonnées : 0 sur les 5 pages. En plus : « remboursé sous 14 jours » 0 / 0 / 0 ; formulaire de la lettre 1 / 1 / 1 ; murs 12 / 10 / 12, 0 « Page dédiée », 12 flèches (identiques à N-1).
  6. Visuel (Chromium, 375 et 1 280 px) : `/conseils`, bloc « Pour la prochaine fois qu’on te chambre » encadré, clic sur une carte = carte dépliée, carte floutée = fenêtre Premium ; `/vannes`, « Révéler la chute » révèle sans quitter la page ; menu mobile, « La lettre » présent, voile présent, un toucher dessus ferme le menu ; `/quiz-humour`, formulaire de la lettre juste sous la carte de résultat ; `/admin` connecté, barre « Backoffice » sans l'en-tête public, onglet Semaine chargé (« Rien à signaler », « 3 comptes de test exclus. »), Abonnés › Lettre : compteurs 0 / 0 / 0, numéro 2026-11 validé, aucune IP ni aucun jeton. **Non fait** : étape 2 ou 3 d'un parcours avec un compte Premium (pas d'identifiants Premium dans la session), à faire à l'œil.
  7. Tâche `*/15` de 03:30:05 UTC `Ok` (`Tick terminé en 2592 ms`), aucun `Échec` ni `ALERTE`, aucune requête en erreur.
  8. et 9. Smoke `@s21` contre la production : 31 réussis, 1 ignoré, 0 échec.
- **Écart de calendrier (à transmettre à @data-analyst)** : mise en ligne **avant** le lundi 19/10 7 h Paris. L'onglet Semaine affiche encore « Semaine du 05/10 au 11/10 » (normal avant 7 h) : contrôle « Semaine du 12/10 au 18/10 » à refaire après 07:00 Paris. Surtout, **l'e-mail du lundi 19/10 partira de `bb470f3`** (comptes de test exclus, section lettre), pas de `43c222f` : la rupture de série des chiffres date du **19/10**, pas du 26/10. Le contrôle du 26/10 garde ses critères ; la phrase « ne pas comparer à l'e-mail du 19/10 » ne s'applique plus.
- **P8 non déclenché** : aucune page en 5xx, aucune route admin ouverte.

- **Contenu** (`43c222f..HEAD`) : les entrées « Page admin s21 » et « Revue visuelle s21 », en tête de ce fichier, déjà fusionnées dans cette branche. Les noms `claude/marrant-s21-admin` et `claude/marrant-s21-visuel` sont historiques. Rien au déploiement : aucune migration, aucun secret, aucune variable, aucune écriture en base.
- **Contre-épreuve** : `docs/qa/qa-contre-epreuve-s21-deuxieme-mise-en-ligne.md`, GO 9,5/10, commit relu `ffb2ad7`.
- **Feu vert de Thomas** (19/10) : « quand c'est vérifié et que tout est propre, avec la zone admin propre, déploie ».
- **NE PAS REJOUER** (fait le 18/10, en production) :
  - **P3**, migration 14 ;
  - **P5**, « Soirée de Noël » au 02/11, ni ses tâches de démarrage (les 6 numéros existent ; le cron `0 1 * * *` les resynchronise) ;
  - **P2 (a)** : de vrais inscrits peuvent exister désormais, ce n'est plus un critère d'arrêt ;
  - **P7**, essai de la lettre : le code de la lettre n'a pas changé.

**P0 bis**. Mêmes commandes que P0.
- Réussite : arbre propre ; `git diff --stat ffb2ad7 HEAD -- apps/web .github` vide (seuls des commits de doc après `ffb2ad7`) ; dernier run « Tests CI » sur `git rev-parse HEAD` à `success`, avec `test`, `lint` et `e2e-local` ; boucle `for` vide.
- Si échec : comme P0.

**P1 bis**. Même commande que P1.
- N-1 attendu : `586c4adc-12cd-41e5-ab09-d3064819baaf` (100 %), noté ici.
- `entetes-avant.txt` relevé.

**P4 bis**. Même commande que P4.
- Nouvelle version et commit notés ici, au format « DÉPLOYÉ le …, version …, N-1 586c4adc ».
- Ne pas appeler `startup-tasks`.

**P6 bis. Contrôles après mise en ligne** (une étape en échec = P8 si une page est cassée ou si l'admin est ouverte, sinon @fullstack)
1. **Pages** : boucle de P6, avec en plus `/conseils`, `/videos` et `/admin`. Réussite : 200 partout. `/admin` en 200 est normal : c'est le formulaire de connexion, sans aucun chiffre.
2. **Admin fermée sans authentification** : `for r in semaine lettre users stats; do curl -s -o /dev/null -w "$r %{http_code}\n" "https://deviens-marrant.fr/api/admin/$r"; done`. Réussite : `401` quatre fois. **Un 200 = P8 immédiat.**
3. **Admin avec authentification**, sans jamais afficher le secret :
   - `curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $ADMIN_PASSWORD" https://deviens-marrant.fr/api/admin/semaine` → `200` ;
   - `curl -s -H "Authorization: Bearer $ADMIN_PASSWORD" https://deviens-marrant.fr/api/admin/lettre | grep -cE 'ipAddress|userAgent|[Tt]oken'` → `0` ;
   - `curl -s https://deviens-marrant.fr/admin | grep -c noindex` → au moins `1`.
4. **Santé et en-têtes** : `jq` de santé de P6 (mêmes critères) ; `Referrer-Policy: same-origin` sur `/lettre` ; `diff` des en-têtes de sécurité contre `entetes-avant.txt` → aucune différence.
5. **SEO, GEO et gluon** :
   - les deux `curl` SEO/GEO de P6 (`bingbot` → `0` ; réassurance dans `llms.txt` → `1`) ;
   - `for p in / /a-propos /vannes /quiz-humour /cgu; do curl -s "https://deviens-marrant.fr$p?ne-pas-compter=1" | grep -oE '(href|src|content)="[^"]*"' | grep -c $'\xe2\x81\xa0'; done` → `0` cinq fois. Le U+2060 est permis dans le texte affiché, jamais dans un lien ni une métadonnée.
   - Si écart : @fullstack (pas de P8).
6. **Contrôles visuels clés**, vrai navigateur à 375 et 1 280 px, en visiteur sauf mention. Référence : `docs/qa/captures-s21-mel2/` et `docs/design/revue-visuelle-s21/`.
   - `/conseils` : le bloc « Pour la prochaine fois qu’on te chambre » a les bords de la liste ; un clic sur une carte la déplie ; la carte floutée ouvre la fenêtre Premium.
   - `/vannes` : « Révéler la chute » fonctionne.
   - Menu mobile : onglet « La lettre » présent ; un toucher sur le voile ferme le menu.
   - `/quiz-humour` : le formulaire de la lettre est sous le résultat.
   - Compte Premium : une étape 2 ou 3 de `/parcours/confiance?ne-pas-compter=1` se déplie (ne pas valider, voir P6).
   - `/admin` connecté :
     - onglet Semaine : « Semaine du 12/10 au 18/10 » après le lundi 19/10 7 h ;
     - onglet Abonnés › Lettre : compteurs, aucune IP ni aucun jeton ;
     - barre « Backoffice », sans l'en-tête public.
7. **Tâches planifiées** : `wrangler tail` jusqu'au quart d'heure suivant. Réussite : `*/15` en `Ok`, aucun `Échec` ni `ALERTE`.
8. **Contrôles datés** :
   - **Lundi 26/10 après 07:00 Paris**, l'e-mail du lundi contient :
     - la section « Lettre mensuelle » ;
     - la ligne « Abonnés actifs (aujourd'hui) » au format « N (x mensuels, y annuels) » ;
     - la mention « N compte(s) de test exclu(s). » s'il y en a.

     Avec « Semaine du rapport », l'onglet Semaine de `/admin` montre les mêmes chiffres. **Ne pas comparer à l'e-mail du 19/10** : il est parti de `43c222f`, sans exclusion des comptes de test ni section lettre. Rupture de série datée de cette mise en ligne, à transmettre à @data-analyst.
   - Les contrôles datés de la première mise en ligne (02/11, 05/11) restent valables.
9. **Trace** : heure, version et N-1 notées ici ; date de rupture des chiffres (comptes de test) transmise à @data-analyst.

**P8 bis. Retour arrière** : `npx wrangler rollback 586c4adc-12cd-41e5-ab09-d3064819baaf`, puis `npx wrangler deployments list | tail -8`.
- Réussite : `586c4adc` à 100 % ; `/` et `/api/health` en 200 ; **`/lettre` en 200** (N-1 contient déjà la lettre : pas de 404 attendu, contrairement au P8 de la première mise en ligne) ; `/api/admin/semaine` en 404 (route absente sur N-1).
- Ce qu'il laisse : rien en base. La lettre, ses tâches et ses liens de désinscription restent servis par N-1, sans effet sur l'envoi du 05/11. On retrouve l'ancienne page admin et l'ancienne mise en page.
- Quand : une page en 5xx, une page cassée, ou une route `/api/admin/*` en 200 sans Bearer.
- Qui prévenir : Thomas, @fullstack, @qa.

#### `/api/health` aligné sur le contenu préparé (@fullstack, 18/10/2026), inclus dans cette mise à jour

- Quoi : génération IA coupée (`CONTENT_GENERATION_ENABLED` ≠ `true`, [CHOIX UTILISATEUR] du 01/10), le statut de contenu ne dépend plus des dates de création ni du dernier appel LLM (toujours affichés, à titre d'information). Il compte : DailyContent du jour présent (`checks.content.dailyToday` ; avant 7 h UTC la veille suffit), stock de vannes et de conseils jamais servis + jours déjà planifiés ≥ 14 (`checks.content.stock`, mêmes filtres que le cron), dernier article publié et échu de moins de 7 jours (`blogArticle`). Génération activée : comportement d'avant, inchangé. `checks.content.mode` = `stock` ou `generation`, `countedInStatus` = ce qui compte.
- Rapport du lundi (décision de Thomas du 18/10, « quand on arrive fin de stock, faut préparer un nouveau lot ») : même calcul (`getStockCoverage`, `lib/scheduler/prepared-content.ts`), ligne en tête des sections. 14 jours ou plus : « Stock du contenu du jour : N jours de vannes et M jours de conseils jamais utilisés. » en petit gris. Moins de 14 : « Nouveau lot à préparer : il reste … (seuil 14 jours). » en orange gras. Base illisible : « illisible (base), voir /api/health ». Génération activée : pas de ligne. Contrôle : premier lundi après la mise en ligne, la ligne est dans l'e-mail de 7 h Paris.
- Aucune migration, aucun secret, aucune variable.
- Lecture : `stock.status = "stale"` = moins de 14 jours de vannes ou de conseils neufs (`jokeDaysLeft`, `tipDaysLeft`) ; à 0, le site ne casse pas, il recycle d'anciennes vannes (il se répète) : préparer du stock. Vidéos recyclées par conception (`videosNeverUsed` sans seuil). `dailyToday.status = "stale"` après 7 h UTC = le contenu du jour manque (vrai incident, @fullstack). La règle « 200 = joignable » de P6 ne change pas.

#### Contrôles GEO et SEO s21 appliqués (@fullstack, 18/10/2026), inclus dans cette mise à jour

- Quoi : corrections de `docs/geo/controle-geo-s21.md` (C1 à C7) et de `docs/seo/controle-seo-s21.md` (À CORRIGER). Aucun texte visible du site ne change : seuls le texte pour les IA (`/llms.txt`, `/llms-full.txt`), les métadonnées et le balisage.
- llms : réassurance du site mot pour mot (`REASSURANCE_UNIQUE`, premier paiement remboursable sous 14 jours, résiliation depuis ton profil), plus de « résiliable en ligne » ; FAQ « Combien ça coûte ? » avec l'étape 1 et la situation offerte du carnet ; 5 parcours dans llms-full (selon les drapeaux de publication) ; blocs carnet et lettre (sans date ni mois) ; libellé « Articles » ; formule annuelle avec `ANNUEL_AVANTAGE_LABEL` ; tirets cadratins retirés à la sortie des deux routes. Phrase « Université du Nouveau-Mexique » retirée de la FAQ llms (décision de Thomas du 18/10), Crawford et Caltabiano gardée.
- JSON-LD Product : `priceValidUntil` calculé (31/12 de l'année suivante), plus de date en dur.
- SEO : lastmod du sitemap (pages structurelles et parcours au 2026-10-18, confidentialité et CGU au 2026-10-17) ; `bingbot` neutralisé sur `/lettre`, `/lettre/confirmer`, `/lettre/desinscrire`, `/carnet`, `/carnet/[mois]`, `/register` (une seule balise robots, noindex) ; `og:url` propre sur `/abonnement`, `/glossaire`, `/a-propos`, `/vannes`, `/conseils`, `/videos`, `/blog` et les 4 pages légales ; canonical sur `/cgu`, `/confidentialite`, `/mentions-legales`, `/retractation`.
- Aucune migration, aucun secret, aucune variable. Test : `feature/geo-seo-controles-s21.test.ts`.
- Contrôle après mise en ligne : `curl -s https://deviens-marrant.fr/lettre | grep -c bingbot` → `0` ; `curl -s https://deviens-marrant.fr/llms.txt | grep -c "premier paiement remboursable sous 14 jours"` → au moins `1`. IndexNow : le cron `weekly-seo` du lundi suivant soumet les pages dont le lastmod a bougé, rien à lancer à la main.

#### Procédure de mise en ligne s21, P0 à P8 (@infrastructure, 17/10/2026 ; remplace toutes les consignes de procédure plus bas)

Règles : une étape échouée = arrêt, on ne passe pas à la suivante. Ne jamais afficher un secret (`env`, `printenv`, `echo $…` interdits) : les commandes lisent `$DATABASE_URL` (production Neon), `$ADMIN_PASSWORD`, `$CRON_SECRET` depuis l'environnement. Toutes les commandes `npx` et `prisma` se lancent depuis `apps/web`. Mise en ligne avant le dimanche 01/11 (contrainte de P5) et en tout cas avant le jeudi 05/11 8 h Paris.

**État relevé en production le 17/10/2026 vers 23 h UTC (lecture seule)** : version en ligne `5ea46dd8-1e31-4175-bc99-3d0873925901` (100 %) ; CI « Tests CI » verte sur `5db36c6` ; `UNSUBSCRIBE_HMAC_SECRET` présent dans `wrangler secret list` ; `soiree-de-noel-entreprise-humour` `isPublished = false`, `publishedAt = 2026-11-16T05:00:00.000Z` ; `humour-en-visio-reunion-en-ligne` `isPublished = false`, `publishedAt = 2026-11-02T05:00:00.000Z`. `NewsletterSubscriber` **non vérifiable par l'API d'admin** (modèle absent de `ALLOWED_MODELS`, sur N-1 comme sur la nouvelle version) : contrôle obligatoire en P2 (a).

**MISE EN LIGNE DU 18/10/2026 (@infrastructure) : DÉPLOYÉ le 18/10/2026 à 20:11:26 UTC (22:11 Paris), version `586c4adc-12cd-41e5-ab09-d3064819baaf` (100 %), N-1 `5ea46dd8-1e31-4175-bc99-3d0873925901`, commit `43c222f`** (feu vert de Thomas du 18/10, `docs/founder-preferences.md` ; contre-épreuve @qa GO 9/10, `docs/qa/qa-contre-epreuve-s21-f9b49bd.md`). Résultats :
- **Accès à la base** : le proxy de la session ne laisse pas passer le TCP 5432 (`psql` et `prisma db execute` impossibles). Toutes les commandes SQL de P2, P3, P5 et P7 ont été jouées par l'API HTTP de Neon (`https://<hôte>/sql`, en-tête `Neon-Connection-String` lu dans `$NEON_DATABASE_URL`, même mécanisme que `scripts/restaurer-tip-phase1.py`), mêmes requêtes. Base vérifiée identique à celle servie en production avant toute écriture (lecture API d'admin et lecture SQL des 2 articles de P5 : `updatedAt` identiques à la milliseconde).
- **P0 OK** : arbre propre, HEAD = `origin` = `43c222f` ; `git diff --stat f9b49bd HEAD -- apps/web .github` vide ; « Tests CI » run `39161605270` `success` sur `43c222f` (jobs `test`, `lint`, `e2e-local` à `success`) ; boucle `for` vide.
- **P1 OK** : N-1 `5ea46dd8` à 100 % ; en-têtes « avant » relevés (25 lignes). Relevé N-1 du contrôle 15 : 12 / 10 / 12.
- **P2 OK** : (a) `NewsletterSubscriber` 0 ligne ; (b) `UNSUBSCRIBE_HMAC_SECRET` → `1` ; (c) rien à faire.
- **P3 OK** : migration 14 jouée deux fois (45 requêtes, une transaction par passe, les deux validées ; `UPDATE "NewsletterSubscriber"` : 0 ligne aux deux passes) ; `NewsletterIssue`, `NewsletterSend`, `PremiumLetterPreference` présentes ; 3 colonnes ajoutées ; 2 clés étrangères présentes.
- **P4 OK** : `build:cf` et `deploy:cf` en code 0 ; déclencheurs `*/15 * * * *` et `0 1 * * *` reposés.
- **P5 OK** : « Soirée de Noël » `updated`, relecture : les deux articles au `2026-11-02T05:00:00.000Z`, `isPublished = false` (« Humour en visio » non touché). Tâches de démarrage : HTTP 200, `[startup] lettre : 6 numéro(s) créé(s), 0 mis à jour, 0 ignoré(s).`, 0 `ALERTE` ; 6 numéros `VALIDE` de `2026-11` (`2026-11-05 07:00:00`) à `2027-04` ; `NewsletterSend` = 0.
- **P6 OK, deux écarts de procédure, aucun du site** : 13 pages en 200 ; `/api/health` `status` `ok`, `mode` `stock`, `dailyToday` `ok`, stock 124 jours de vannes et 101 de conseils (`jokesNeverUsed` 50, `tipsNeverUsed` 27, 74 jours planifiés) ; `Referrer-Policy: same-origin` sur `/lettre` ; en-têtes de sécurité sans différence ; « remboursé sous 14 jours » 0 / 0 / 0 ; formulaire de la lettre 1 / 1 / 1 ; SEO/GEO : `/lettre` 0 `bingbot` (une seule balise `robots` `noindex, nofollow`), réassurance complète présente dans `/llms.txt` (1) ; contrôles 1 à 6, 8, 9 et 15 conformes (murs 12 / 10 / 12, 0 « Page dédiée », 12 flèches) ; smoke `@s21` contre la production : 31 réussis, 1 ignoré, 0 échec ; tâche `*/15` de 20:15 UTC `Ok` (HTTP 200), aucun `Échec` ni `ALERTE`. **Écart 1 (contrôle 9)** : le motif `vannes/[a-z0-9-]*` prend `/vannes/theme` (tronqué avant le `/`, le `grep -v /theme/` ne l'écarte pas) → 404 ; corrigé ci-dessous en `[a-z0-9-]+` et `grep -v '/vannes/theme$'`, fiche réelle en 200. **Écart 2 (contrôle 14)** : les 4 articles sont programmés, pas en ligne (`isPublished = false` ; anniversaire 22/10, couple 05/11, poisson d'avril 25/02/2027, fête des pères 13/05/2027) : 404 normal, contrôle à faire le jour de chaque publication. Code vérifié : `git show 43c222f:apps/web/src/config/blog-cta.ts | grep -c "Au moment du gâteau"` → 1. Restent à l'œil : contrôle 10, étape 3 Premium, onglet « La lettre » et formulaire sous le quiz.
- **P7, étape 1 OK** (Chromium Playwright, profil persistant) : `/?ne-pas-compter=1` puis `/lettre`, `POST /api/newsletter` 200, écran « Regarde ta boîte mail. » ; base `PENDING | t | 1`.
- **P7, étapes 2 à 5 OK** (même profil Chromium persistant, 18/10 vers 20:20 UTC) :
  - étape 2 (lue dans Gmail par la coordination) : e-mail reçu à 20:17:05 UTC, objet « Une dernière étape pour recevoir la lettre », texte seul (aucun corps HTML), lien direct vers `/lettre/confirmer?token=…`, non réécrit. **Click tracking : sans effet (lien direct, texte seul), contrôle daté du 05/11 levé.**
  - étape 3 : bouton « Confirmer mon adresse », `POST /api/newsletter/confirm/<jeton>` 303, arrivée sur `/lettre?statut=confirmee`, écran « C'est bon, c'est confirmé. » ; base `CONFIRMED | t` (empreinte présente : secret de P2 (b) d'au moins 32 caractères) ;
  - étape 4 : jeton lu en base sans être affiché, `/lettre/desinscrire?token=…` en 200, bouton « Me désinscrire », `POST /api/newsletter/unsubscribe/<jeton>` 303, arrivée sur `/lettre?statut=desinscrit`, « C'est fait, tu ne recevras plus la lettre. » ; base `UNSUBSCRIBED`, `unsubscribedAt` renseigné ;
  - étape 5 : `DELETE 1` (`RETURNING status` = `UNSUBSCRIBED`) ; requête de P2 (a) : 0 ligne, alex@ absente ;
  - mesure : l'URL de confirmation portait `mesure=1`, donc l'événement Umami `lettre-confirmee` de l'essai (et `lettre-vu`) est compté. À retirer du bilan (@data-analyst, 18/10 entre 20:15 et 20:25 UTC).
- **Message de la coordination reçu après P4** (« arrête-toi avant P4 », défauts d'alignement en cours de correction sur une autre branche) : P4 était déjà fait, donc ni retour arrière ni arrêt, P5, P6 et P7.1 terminées comme demandé. La passe d'alignement partira dans une prochaine mise en ligne.

**P0. Prérequis**
- Commande : `git fetch origin && git status --short && git rev-parse HEAD` (arbre principal, branche `claude/marrant-s21-integration` à jour) ; `gh run list --branch claude/marrant-s21-integration --limit 3 --json headSha,name,conclusion` ; `gh run view <id> --json jobs --jq '.jobs[]|[.name,.conclusion]|@tsv'` ; `for b in main master claude/ouverture-session-nzwj0w; do git log --oneline HEAD..origin/$b -- apps/web .github; done`.
- Commit à mettre en ligne (QA m-3) : HEAD de la branche après le commit du rapport @qa (doc seule, code identique au commit relu par @qa : `git diff --stat <commit relu> HEAD -- apps/web .github` vide), CI verte sur ce HEAD. Commit et version déployés notés après P4, dans un seul commit de doc.
- Réussite : `git status --short` vide ; le `headSha` du dernier run « Tests CI » = `git rev-parse HEAD` et `success` ; jobs `test`, `lint` **et `e2e-local`** à `success` ; la boucle `for` n'affiche rien ; contre-épreuve @qa de la concision sur ce commit (rapport dans `docs/qa/`, sans bloquant) et correction C1 de `docs/reviews/revue-cta-s21-v3.md` faite ; feu vert de Thomas écrit. Noter le commit exact dans cette entrée.
- Si échec : arbre sale → ne rien déployer, comprendre l'écart (jamais `git stash` à l'aveugle) ; CI rouge ou autre commit → pas de mise en ligne, @fullstack corrige, CI relancée ; commit de code manquant → fusion par @fullstack, CI verte, puis reprendre P0.

**P1. Relevé de la version en ligne (N-1)**
- Commande : `npx wrangler deployments list | tail -8` ; puis, hors du dépôt : `curl -sI "https://deviens-marrant.fr/?ne-pas-compter=1" > entetes-avant.txt`.
- Réussite : une version à 100 %, notée ici comme N-1 (attendu `5ea46dd8-1e31-4175-bc99-3d0873925901` sauf déploiement entre-temps) ; fichier d'en-têtes non vide (sert en P6).
- Si échec : jeton Cloudflare refusé ou version introuvable → pas de déploiement sans N-1 connu (pas de retour arrière possible).

**P2. Contrôles de production avant (bloquants)**
- (a) Table `NewsletterSubscriber` : `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c 'SELECT status, count(*) FROM "NewsletterSubscriber" GROUP BY 1;'`. Réussite : `(0 rows)`. Si des lignes : arrêt, décision de Thomas (purge ou passage en `UNSUBSCRIBED`), aucune mise en ligne d'ici là (elles recevraient le n°1 sans consentement v2). Si `relation "NewsletterSubscriber" does not exist` : arrêt, la migration 14 échouerait (elle modifie cette table sans la créer) ; @infrastructure crée la table depuis `schema.prisma` sur une base jetable d'abord.
- (b) Secret serveur de la lettre : `npx wrangler secret list | grep -c '"UNSUBSCRIBE_HMAC_SECRET"'` → `1`. Nom lu dans le code : `process.env.UNSUBSCRIBE_HMAC_SECRET`, `apps/web/src/lib/lettre/inscription.ts` l.60 (`empreinteIp`). Précision : les jetons de confirmation et de désinscription de la lettre **ne sont pas signés** ; ce sont des valeurs aléatoires de 32 octets stockées en base (`lib/newsletter.ts`, `generateOpaqueToken`). Ce secret sert à l'empreinte HMAC de l'IP (@legal L4) ; absent ou de moins de 32 caractères, l'inscription marche mais aucune empreinte n'est stockée (preuve de longueur en P7). Si `0` : arrêt, Thomas pose le secret. **Ne jamais le régénérer** : il signe aussi les liens de désinscription des e-mails CEO et des rappels de parcours (`lib/email/ceo-email-footer.ts`, `lib/rappels/rappel-parcours.ts`).
- (c) Suivi d'ouverture et de clic (Resend, @legal B4) : **plus de contrôle du tableau de bord Resend par Thomas** (décision de Thomas du 18/10). Tous les e-mails de la lettre partent **en texte seul** (`sendServiceTextEmail`, champ `text`, aucun `html`) : le suivi d'ouverture (image de 1 px dans le HTML) n'a aucun effet. La preuve se fait en P7, étape 2 : e-mail de confirmation lu dans la boîte Gmail de Thomas (qui reçoit alex@deviens-marrant.fr), texte seul et lien direct vers `https://deviens-marrant.fr/lettre/confirmer?token=…`. Rien à faire ici.

**P3. Migration 14 de la lettre, jouée deux fois**
- Commande, deux fois de suite : `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/14_lettre_mensuelle_s21/migration.sql`. Jamais `prisma migrate deploy` (voir l'entrée lettre).
- Réussite : code de sortie 0 aux deux passes ; puis `psql "$DATABASE_URL" -c "SELECT to_regclass('\"NewsletterIssue\"'), to_regclass('\"NewsletterSend\"'), to_regclass('\"PremiumLetterPreference\"');"` → trois noms non vides, et `psql "$DATABASE_URL" -c '\d "NewsletterSubscriber"' | grep -cE 'confirmationSentAt|confirmationSendCount|reconfirmRequestedAt'` → `3`.
- Si échec : arrêt avant P4. La version en ligne reste N-1, compatible avec une migration partielle (ajouts seulement) ; rien à défaire. Message d'erreur à @infrastructure, rejeu sur base jetable.

**P4. Build et déploiement**
- Commande : `rm -rf .open-next && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run build:cf && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run deploy:cf`, puis `npx wrangler deployments list | tail -8`. (La variable factice est exigée aussi par `deploy:cf` et par `upload` : constaté au téléversement de la version de test du 18/10, `8f69a315`.)
- Réussite : build et déploiement en code 0 ; nouvelle version à 100 %, notée ici avec le commit (« DÉPLOYÉ le …, version …, N-1 … »). Ne pas appeler les tâches de démarrage ici : on enchaîne P5 dans la même séance.
- Si échec du build : rien n'est en ligne, @fullstack. Si déployé mais pages en 5xx : P8 tout de suite.

**P5. « Soirée de Noël au boulot » avancée au lundi 02/11/2026 à 05:00 UTC (seule date modifiée)**
- Délai : **au plus tard le dimanche 01/11**. `publishDueScheduledArticles` ne publie que les articles de la semaine ISO en cours : une date posée après le 08/11 laisserait l'article non publié et bloquerait le n°1 (garde-fou d'envoi). Si la mise en ligne glisse, faire P5 seule avant le 01/11 : elle marche aussi sur N-1.
- Avant : `curl -sS -G https://deviens-marrant.fr/api/admin/db -H "Authorization: Bearer $ADMIN_PASSWORD" --data-urlencode action=query --data-urlencode model=BlogArticle --data-urlencode 'where={"slug":{"in":["soiree-de-noel-entreprise-humour","humour-en-visio-reunion-en-ligne"]}}' --data-urlencode 'select={"slug":true,"isPublished":true,"publishedAt":true}'`. Attendu : 2 lignes, valeurs de l'état relevé ci-dessus. Écart : arrêt, Thomas.
- Écriture (comparer-et-écrire, une seule ligne) : `curl -sS -X POST https://deviens-marrant.fr/api/admin/db -H "Authorization: Bearer $ADMIN_PASSWORD" -H 'content-type: application/json' -d '{"action":"update","model":"BlogArticle","where":{"slug":"soiree-de-noel-entreprise-humour","isPublished":false,"publishedAt":"2026-11-16T05:00:00.000Z"},"data":{"publishedAt":"2026-11-02T05:00:00.000Z"}}'`. Équivalent SQL : `psql "$DATABASE_URL" -c "UPDATE \"BlogArticle\" SET \"publishedAt\" = '2026-11-02 05:00:00+00', \"updatedAt\" = now() WHERE slug = 'soiree-de-noel-entreprise-humour' AND \"isPublished\" = false AND \"publishedAt\" = '2026-11-16 05:00:00+00' RETURNING slug, \"publishedAt\";"`.
- Réussite : `"action":"updated"` avec `publishedAt` `2026-11-02T05:00:00.000Z` et `isPublished` `false` (SQL : `UPDATE 1`). On ne touche ni `isPublished` (la tâche planifiée publie) ni « Humour en visio », qui reste au 02/11 05:00 UTC. Après : relancer la lecture « Avant » ; attendu les deux articles au `2026-11-02T05:00:00.000Z`, `isPublished = false`.
- Si échec : HTTP 500 (enregistrement introuvable) ou `UPDATE 0` = la ligne a changé ; relire, ne rien forcer, Thomas. Retour : même commande, valeurs inversées.
- Puis tâches de démarrage, avec `npx wrangler tail --format pretty` ouvert dans un autre terminal : `curl -sS -m 120 -H "Authorization: Bearer $CRON_SECRET" https://deviens-marrant.fr/api/cron/startup-tasks`. Réussite : journal `[startup] lettre : 6 numéro(s) créé(s), 0 mis à jour, 0 ignoré(s).`, **aucune** ligne `lettre : ALERTE` ; `psql "$DATABASE_URL" -c 'SELECT "periodKey", status, "scheduledFor" FROM "NewsletterIssue" ORDER BY "scheduledFor";'` → 6 lignes `VALIDE`, `2026-11` à `2026-11-05 07:00:00` ; `psql "$DATABASE_URL" -c 'SELECT count(*) FROM "NewsletterSend";'` → `0`. Si ALERTE sur 2026-11 : P5 pas appliquée, la refaire puis relancer. Si moins de 6 numéros : lire les lignes `ignoré`, @fullstack.

**P6. Contrôles après mise en ligne**
- Pages : `V=$(curl -s https://deviens-marrant.fr/sitemap.xml | grep -o 'https://deviens-marrant.fr/videos/[a-z0-9-]*' | head -1 | sed 's#https://deviens-marrant.fr##')` puis `for p in / /abonnement /lettre /confidentialite /cgu /register /blog/se-presenter-avec-humour /quiz-humour /parcours /carnet /vannes "$V" /api/health; do printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://deviens-marrant.fr$p?ne-pas-compter=1"; done`. Réussite : 200 partout (`$V` = une fiche vidéo réelle, prise dans le sitemap ; vide = sitemap à vérifier avant de conclure). Si une page en 5xx : P8.
- Santé du contenu : `curl -s "https://deviens-marrant.fr/api/health?ne-pas-compter=1" | jq '{status, contentStatus, mode: .checks.content.mode, dailyToday: .checks.content.dailyToday, stock: .checks.content.stock}'`. Réussite : `mode` = `stock`, `dailyToday.status` = `ok`, `status` = `ok` si `stock.jokeDaysLeft` et `stock.tipDaysLeft` ≥ 14. `status` = `degraded` avec seulement `stock` en `stale` : pas de P8, Thomas prépare du stock (le site se répète, il ne casse pas). `dailyToday` en `stale` après 7 h UTC : @fullstack. `degraded` sur `blogArticle` : aucun article publié et échu depuis 7 jours, vérifier la publication programmée de la semaine.
- Blocs d'appel et concision : contrôles 1 à 15 de l'entrée « Blocs d'appel s21 et concision du tunnel » en tête de ce fichier (SEULE liste valable). Contrôle 6 jusqu'au 31/10, contrôle 7 le 01/11 après 01:00 Paris, contrôle 12 le lendemain puis le lundi, contrôle 13 le 01/12. Réussite : valeurs attendues partout. Si écart : @fullstack (pas de P8 pour un texte, sauf page cassée).
- Étape 3 ouverte par un abonné (décision du 18/10) : vrai navigateur, compte Premium de l'équipe, `https://deviens-marrant.fr/parcours/confiance?ne-pas-compter=1` sur un parcours où les étapes 1 et 2 ne sont **pas** validées. Clic sur l'en-tête « Étape 3 » : l'étape se déplie avec son conseil et son bouton « Valider cette étape », aucun « Termine l'étape … pour débloquer ». Ne pas valider (l'XP et la progression seraient réelles) ; si on valide pour l'essai : réponse 200 (onglet Réseau, `POST /api/parcours/<id>/progress`), jamais 409. Réussite : étape ouverte. Si l'étape reste fermée ou si un 409 `ordre` revient : le commit déployé n'est pas le bon (`git show HEAD:apps/web/src/app/api/parcours/[id]/progress/route.ts | grep -c ordre` → `0` attendu sur le code ; voir la règle P0 s8), @fullstack.
- En-têtes : `curl -sI "https://deviens-marrant.fr/lettre?ne-pas-compter=1" | grep -i '^referrer-policy'` → `same-origin` (sans lui, le bouton « Confirmer » est refusé, B1 de la QA) ; `diff <(grep -iE '^(strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|permissions-policy)' entetes-avant.txt | sort) <(curl -sI "https://deviens-marrant.fr/?ne-pas-compter=1" | grep -iE '^(strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|permissions-policy)' | sort)` → aucune différence. Si écart : @fullstack ; `Referrer-Policy` absente sur `/lettre` = P8 avant toute inscription.
- SEO/GEO (QA m-1) : `curl -s "https://deviens-marrant.fr/lettre?ne-pas-compter=1" | grep -c bingbot` → `0` ; `curl -s https://deviens-marrant.fr/llms.txt | sed -e "s/&#x27;/'/g" -e 's/\xc2\xa0/ /g' -e 's/\xe2\x80\xaf/ /g' | grep -c "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil."` → `1`. Si écart : @fullstack (pas de P8).
- Textes : `for p in / /abonnement /register; do curl -s "https://deviens-marrant.fr$p?ne-pas-compter=1" | grep -c "remboursé sous 14 jours"; done` → `0` trois fois (les autres textes : contrôles 1 à 15 de l'entrée « Blocs d'appel s21 et concision du tunnel »).
- Formulaire de la lettre visible : `for p in /lettre /blog/se-presenter-avec-humour /; do curl -s "https://deviens-marrant.fr$p?ne-pas-compter=1" | grep -cE 'confidentialite#lettre|La lettre du mois'; done` → au moins 1 partout (formulaire sur `/lettre` et sous l'article, lien de pied de page). Puis à l'œil : formulaire sous le résultat du quiz, onglet « La lettre » dans le menu. Si absent : vérifier `LETTRE_INSCRIPTIONS_OUVERTES` dans le commit déployé (`git show HEAD:apps/web/src/config/lettre.ts`), @fullstack.
- Tâches planifiées : garder `npx wrangler tail --format pretty` ouvert jusqu'au quart d'heure suivant. Réussite : un événement planifié `*/15 * * * *` en `Ok`, aucune ligne `[scheduler:lettre-mensuelle] Échec` ni `ALERTE`. Avant le 05/11, la tâche d'envoi ne journalise rien (normal). Le lendemain, Workers Logs (tableau de bord Cloudflare), recherche `lettre-entretien` : une ligne `[scheduler:lettre-entretien] … effacé(s) …` vers 4 h Paris. Si `Échec` : @fullstack ; envoi menacé avant le 05/11 → P8.
- Contrôles datés : **lundi 19/10 après 07:00 Paris** (QA m-1), le rapport du lundi contient en tête « Stock du contenu du jour : N jours de vannes et M jours de conseils jamais utilisés. » (ou « Nouveau lot à préparer… ») ; sinon `git show 43c222f:apps/web/src/lib/scheduler/prepared-content.ts | grep -c getStockCoverage`, puis @fullstack. ~~**Avant le jeudi 05/11 8 h Paris** (QA m-2), si P7 étape 2 a vu un lien réécrit : « Click tracking » désactivé dans Resend (capture de Thomas), sinon l'envoi du n°1 attend.~~ **Levé le 18/10** : P7 étape 2 a montré un e-mail en texte seul avec un lien direct non réécrit. Lundi 02/11 après 06:00 Paris, `/blog/soiree-de-noel-entreprise-humour` en 200 et `isPublished = true` (lecture de P5) ; jeudi 05/11 après 08:15 Paris, journal `[scheduler:lettre-mensuelle] 2026-11 : N envoyé(s)…` sans « reporté » ni « bloqué », et `SELECT status, count(*) FROM "NewsletterSend" GROUP BY 1;` = nombre de confirmés hors exclus.
- Trace : date et heure de mise en ligne notées dans `docs/marrant/audit-conversion-s20.md` (rupture de la mesure du lot 1), version et N-1 dans cette entrée.

**P7. Essai réel en production avec alex@deviens-marrant.fr** (vrai navigateur, pas curl ; Thomas ou la personne qui lit la boîte d'Alex)
1. `https://deviens-marrant.fr/lettre` : adresse `alex@deviens-marrant.fr`, case cochée, envoi. Réussite : écran « Regarde ta boîte mail ». En base : `psql "$DATABASE_URL" -c "SELECT status, \"ipAddress\" IS NOT NULL AS empreinte, \"confirmationSendCount\" FROM \"NewsletterSubscriber\" WHERE email = 'alex@deviens-marrant.fr';"` → `PENDING | t | 1` (si `PENDING | f | 1` : continuer, voir l'étape 3).
2. E-mail de confirmation reçu sous 5 min. Réussite : texte seul (Gmail « Afficher l'original » : `Content-Type: text/plain`, aucune balise `<img`) et lien direct vers `https://deviens-marrant.fr/lettre/confirmer?token=…` (preuve de P2 (c) ; lu dans la boîte Gmail de Thomas, qui reçoit alex@deviens-marrant.fr). Si le lien est réécrit par un domaine de redirection : **non bloquant pour la mise en ligne**, on continue et on alerte Thomas, qui désactive « Click tracking » dans Resend (Domains → `deviens-marrant.fr` → Configuration) avant l'envoi du jeudi 05/11. Si rien après 15 min : tableau de bord Resend (rejet, domaine), puis @fullstack.
3. Clic sur le lien, puis bouton « Confirmer mon adresse ». Réussite : « C'est bon, c'est confirmé. » ; même requête qu'en 1 → `CONFIRMED | t`. `empreinte = f` : le secret de P2 (b) fait moins de 32 caractères ; non bloquant pour l'inscription mais défaut @legal L4, Thomas et @fullstack (ne pas régénérer le secret, un secret distinct serait à créer). Si `/lettre?statut=erreur` : contrôle d'origine refusé, P8 et @fullstack.
4. Désinscription par le bouton : lire le jeton en base sans le coller nulle part : `psql "$DATABASE_URL" -At -c "SELECT \"unsubscribeToken\" FROM \"NewsletterSubscriber\" WHERE email = 'alex@deviens-marrant.fr';"`, puis ouvrir `https://deviens-marrant.fr/lettre/desinscrire?token=<jeton>` dans le même vrai navigateur et cliquer sur le bouton de désinscription. Réussite : `/lettre?statut=desinscrit` ; en base `UNSUBSCRIBED`. Si `/lettre?statut=erreur` : contrôle d'origine refusé, P8 et @fullstack. (Le renvoi de l'e-mail « déjà dans la liste » est plafonné à 1 par 24 h et ne peut donc pas servir le jour même ; les en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post` sont vérifiés sur le premier numéro reçu par une adresse de l'équipe.)
5. Remise à zéro : `psql "$DATABASE_URL" -c "DELETE FROM \"NewsletterSubscriber\" WHERE email = 'alex@deviens-marrant.fr' RETURNING status;"` → `DELETE 1` ; puis la requête de P2 (a) ne montre plus cette adresse (de vrais inscrits peuvent déjà exister). Réinscription d'Alex seulement si Thomas veut recevoir le n°1. Événements Umami de l'essai (`lettre-vu`, `lettre-confirmee`) à retirer du bilan s'ils sont comptés (`mesure=1` absent si l'adresse est dans `ANALYTICS_EMAILS_EXCLUS`).

**P8. Retour arrière et ce qu'il laisse**
- Commande : `npx wrangler rollback <N-1 relevé en P1>` (attendu `5ea46dd8-1e31-4175-bc99-3d0873925901`), puis `npx wrangler deployments list | tail -8` et les pages de P6. Réussite : N-1 à 100 %, `/` et `/api/health` en 200, `/lettre` en 404. Quelques secondes.
- Quand : avant le 05/11 8 h, ou pour une page cassée, rollback sans hésiter. Après un premier envoi, préférer un correctif redéployé (commit `LETTRE_ENVOIS_OUVERTS = false` sur la branche, build, déploiement : une dizaine de minutes), qui garde les pages de désinscription en ligne ; rollback seulement si le site lui-même est cassé.
- Ce qui reste en base : tables et colonnes de la migration 14 (ajouts, compatibles avec N-1, rien à défaire) ; les 6 numéros `NewsletterIssue` (inertes : N-1 n'a aucune tâche lettre, donc **le rollback arrête aussi tout envoi**) ; les lignes `NewsletterSubscriber` (N-1 ne fait pas l'entretien : les `PENDING` ne sont plus effacés à 7 jours, à purger à la main à J+7 si N-1 dure : `DELETE FROM "NewsletterSubscriber" WHERE status = 'PENDING' AND "consentAt" < now() - interval '7 days';`) ; `NewsletterSend` si un envoi a commencé ; la date du 02/11 de « Soirée de Noël » (voulue ; retour par la commande inverse de P5).
- Liens des e-mails déjà partis : sur N-1, `/lettre/desinscrire` et `/lettre/confirmer` répondent 404, donc **le lien de désinscription du corps des e-mails est mort** ; le lien en un clic des en-têtes (`/api/newsletter/unsubscribe/<jeton>`, bouton « Se désabonner » de Gmail) reste servi par N-1. L'interrupteur `LETTRE_ENVOIS_OUVERTS` n'existe pas sur N-1 : on ne peut rien y basculer. À faire : (1) redéployer le jour même une version qui sert à nouveau `/lettre/desinscrire` (commit s21 corrigé, ou commit s21 avec `LETTRE_INSCRIPTIONS_OUVERTES = false` et `LETTRE_ENVOIS_OUVERTS = false`), après contre-épreuve @qa ; (2) d'ici là, toute demande reçue en réponse (Reply-To de la lettre) est traitée à la main sous 24 h : `UPDATE "NewsletterSubscriber" SET status = 'UNSUBSCRIBED', "unsubscribedAt" = now(), "ipAddress" = NULL, "userAgent" = NULL WHERE email = '<adresse>';`.
- Qui prévenir : Thomas tout de suite (décision et feu vert du redéploiement) ; @fullstack (correctif) ; @qa (contre-épreuve avant redéploiement) ; @legal si un e-mail est parti avec un lien de désinscription mort plus de 24 h ou vers une mauvaise liste ; @data-analyst (fenêtre à exclure de la mesure). Noter dans cette entrée l'heure du rollback et la version servie.


- **Remplace l'ordre des deux entrées ci-dessous** (« après le bilan du lot 1 », « pas dans le même déploiement ») : décision de Thomas du 17/10, `docs/marrant/plan-integration-s21.md`. Les deux entrées restent la référence de ce que contient chaque chantier ; procédure et contrôles = ceux de cette entrée. Menu, bloc d'accueil, QA et revue faits (tours 1 et 2) ; reste la contre-épreuve @qa sur le commit final. **Procédure : P0 à P8 ci-dessus, seule à suivre.**
- **Fusion** : depuis `claude/ouverture-session-nzwj0w`, merge de `claude/marrant-s21-lot2-boutons` puis de `claude/marrant-s21-lettre`. Un seul conflit, dans ce fichier (deux entrées ajoutées au même endroit : les deux gardées). `viral-quiz.tsx` fusionné sans conflit et vérifié contre chaque parent : boutons du lot 2 (Premium en plein, étape 1 en contour) et bloc lettre sous le résultat, aucun texte perdu ni modifié. Aucun autre fichier touché par les deux branches.
- **Interrupteurs** (`apps/web/src/config/lettre.ts`) : `LETTRE_OUVERTE` commandait à la fois le formulaire et les envois ; séparé en deux. `LETTRE_INSCRIPTIONS_OUVERTES = true` (formulaire aux 3 emplacements, lien de pied de page, `/lettre`, `/lettre/confirmer`, `POST /api/newsletter`, confirmation, e-mails de reconfirmation). `LETTRE_ENVOIS_OUVERTS = true` (tâche mensuelle). **Pourquoi les deux à `true`** : Thomas ouvre les inscriptions dès la mise en ligne, et les envois restent tenus par les dates (premier jeudi 8 h, jamais avant la date plancher, rien si un `[À COMPLÉTER` reste) ; un deuxième interrupteur sert d'arrêt d'urgence des envois sans fermer le formulaire (et inversement, fermer les inscriptions n'arrête pas l'envoi aux confirmés). Désinscription et purge (7 j, 3 ans) marchent quel que soit l'état. Tests : `lettre-s21` (valeurs livrées, ancien nom absent), `lettre-envoi-s21` (envois fermés + inscriptions ouvertes = rien ne part, et l'inverse), entretien inscriptions fermées = purge faite sans reconfirmation.
- **Planificateur** : envoi (`runLettreMensuelleJob`, chaque tick) et entretien (`runLettreEntretienJob` : 4 h Paris, verrou 2 h, purge des non confirmés à 7 j, reconfirmation à 24 mois, traces à 3 ans) sont dans `runAllJobs` (`lib/scheduler/jobs.ts`), lancé par le Cron Trigger `*/15 * * * *` → `/api/cron/scheduler-tick` (`cloudflare/worker.ts`, `wrangler.jsonc`), même mécanisme que les autres tâches ; numéros synchronisés par les tâches de démarrage (`applyLettreNumerosTask`, cron `0 1 * * *` et à la main après déploiement). Figé par `lettre-planificateur-s21.test.ts`.
- **Numéro 1** : départ **jeudi 05/11/2026 à 8 h (Paris)**, date plancher **lundi 02/11/2026** (`data/lettre/numeros.json`) ; n°2 à 6 inchangés. Tests : `lettre-calendrier-s21` (règle + fichier livré), `lettre-numeros-s21`, `lettre-s21`. Miroir `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md` aligné (lignes de planning seulement, aucun texte d'e-mail touché).
- **Mentions @legal (B7)**, textes mot pour mot de `docs/legal/lettre-et-questions-s21.md` : `/confidentialite` nouvelle section « 8. La lettre » (`id="lettre"`, ancre du lien du formulaire) avec les phrases lettre des parties 1, 2, 3 et 6, et Resend « …, et des lettres » (partie 4) ; `/cgu` nouvel article « 10. La lettre » (`id="lettre"`, phrase « La lettre mensuelle gratuite est indépendante de l'abonnement… ») et ajout à l'article 8 (dommages corporels, faute lourde, dol). « Dernière mise à jour : 17 octobre 2026 » sur les deux pages. **Pas repris**, car pas encore ouverts (« on n'annonce rien qui n'existe pas ») : phrases « Ta question à l'équipe », lettre hebdomadaire Premium, outils de rédaction, et le reste de l'article CGU. **À trancher par @legal** : (1) phrase de la partie 7 (mêle lettre et questions : « lettre : lien en bas de chaque e-mail ; reprise d'une question : avant l'envoi ») non publiée, le retrait en un clic est dit en partie 3 ; (2) partie 6 « ton inscription à la newsletter » → « … (sauf la trace de ta désinscription…) » non appliqué : la suppression de compte efface aujourd'hui toute la ligne (`lib/account.ts`), la phrase serait inexacte (A7). Test : `dashboard/lettre-mentions-s21.test.tsx`.
- **Place de la lettre sur le site (17/10, textes validés à l'aveugle, pack `docs/copy/lettre-mensuelle-s21/pack-relecture-place-sur-le-site.md`, duels 1 A et 2 A)** : onglet « La lettre » (`TEXTES_LETTRE.menu`) dernier après « Blog », vers `/lettre`, dans le menu déroulant (< 1024 px), jamais dans la barre mobile ; dans la barre ordinateur ~~à partir de 1280 px seulement~~ **à toutes les largeurs depuis les correctifs tour 2 (menu de compte, loupe : voir plus bas)** (mesure d'origine, en local : connecté sans abonnement, la barre déborde à 1100 px avec l'onglet, et débordait déjà de 70 px à 1024 sans lui, défaut préexistant non traité ; anonyme à 1024, la recherche tombait à 65 px). Accueil : section-lien `LettreAccueil` entre `PremiumCta` et `UpcomingFeatures` (titre, phrase, « Voir la lettre → », filet, aucun bouton ni formulaire). Menu, accueil et pied de page suivent `LETTRE_INSCRIPTIONS_OUVERTES` ; onglet et bloc masqués pour un abonné Premium connecté (comme le formulaire). **Point @design** : connecté sans abonnement, à 1280 px et plus, la recherche passe de 168 à 86 px (« Rech… »). Fichiers : `components/layout/header.tsx`, `components/home/lettre-accueil.tsx`, `app/(dashboard)/page.tsx`, `config/textes/lettre-s21.ts`. Test : `layout/lettre-place-sur-le-site-s21.test.tsx`. Captures : `docs/qa/captures-s21/integration/`.
- **Garde-fou d'envoi (17/10)** : un numéro ne part jamais si un article du blog qu'il cite (lien `deviens-marrant.fr/blog/<slug>`) n'est pas en ligne au moment de l'envoi : article du code, ou article en base `isPublished` avec `publishedAt` passé (ou nul : règle `visibleBlogArticleWhere` de la page article). Vérifié en base à chaque passage ; sinon numéro reporté au passage suivant (rien envoyé, rien réservé, numéro pas clos) et alerte `[scheduler:lettre-mensuelle] ALERTE … reporté au passage suivant` dans le journal. Fichiers : `lib/lettre/envoi.ts`, `lib/scheduler/jobs.ts`. Tests : `lib/lettre-article-publie-s21.test.ts`, `lib/lettre-planificateur-s21.test.ts`. **Conséquence** : si « Soirée de Noël au boulot » n'est pas publiée le 05/11 à 8 h, le n°1 attend sa publication au lieu de partir avec un lien mort (d'où P5).
- **Mentions @legal, textes publiés à l'ouverture (17/10, fin de `docs/legal/lettre-et-questions-s21.md`)** : `/confidentialite` section 6 « ton inscription à la lettre faite avec l'adresse de ton compte », section 7 nouvelle phrase « Tu peux retirer ton consentement à la lettre à tout moment, avec le lien en bas de chaque e-mail : ce que tu as reçu avant reste valable. » (rien sur les questions), section 8 fin du paragraphe lettre « Si tu supprimes ensuite ton compte avec cette même adresse, cette trace est effacée avec lui. » ; `/cgu` article 2 « de 15 ans et plus ». Points (1) et (2) « À trancher par @legal » ci-dessus : tranchés. Test : `dashboard/lettre-mentions-s21.test.tsx` (+ `feature/suppression-compte-gratuit-s15` mis à jour).
- **Migration** `14_lettre_mensuelle_s21` rejouée 2 fois le 17/10 sur une base PostgreSQL 16 jetable (`/var/lib/postgresql/integ-jetable`, 127.0.0.1, supprimée à la fin, aucune connexion à la production), départ = `schema.prisma` de `75a809b` (version en ligne) + 1 inscrit factice avec agent utilisateur : passe 1 `prisma db execute` code 0, passe 2 `psql -v ON_ERROR_STOP=1` code 0 (seulement des NOTICE), `userAgent` NULL, `prisma migrate diff --exit-code` = 0 après chaque passe. À jouer sur Neon **avant** le déploiement (commande de l'entrée lettre, 2 fois).
- **Au déploiement** : remplacé par P0 à P8 ci-dessus (contrôles avant en P2, migration en P3, seule « Soirée de Noël » avance au 02/11 en P5, « Humour en visio » reste au 02/11).
- **Correctifs tour 2 (17/10, @fullstack, rapports `qa-integration-s21.md`, `design/revue-integration-s21.md`, `reviews/revue-integration-s21.md`), aucun texte validé modifié** :
  - **QA B1 (confirmation impossible)** : `Referrer-Policy` des pages `/lettre/*` passée de `no-referrer` à `same-origin` (`next.config.js` + `metadata.referrer` de `/lettre`, `/lettre/confirmer`, `/lettre/desinscrire`) : le jeton ne part toujours jamais vers un autre site (L5), le POST du bouton porte la vraie origine. **À faire valider d'une ligne par @legal.** `lib/same-site.ts` accepte aussi `Origin: null` SI `Sec-Fetch-Site: same-origin` (posé par le navigateur, impossible à imiter depuis un autre site). Refus d'origine sur le bouton de confirmation ou de désinscription : 303 vers `/lettre?statut=erreur`, plus jamais de JSON brut ; le POST en un clic (RFC 8058) n'est jamais soumis au contrôle.
  - **Revue M1** : un numéro reporté part au créneau suivant valable (jeudi 8 h Paris, `prochainCreneauLettre`), plus au premier passage de 15 min ; envoi déjà commencé : il se termine. Au démarrage, alerte si la date de publication réelle d'un article cité dépasse la date plancher du numéro (`controlerDatesPlancher`).
  - **En-tête (design bloquant)** : menu de compte Radix (« Favoris », « Mon profil », « Déconnexion »), recherche en loupe de 1024 à 1279 px puis champ de 176 px, « La lettre » onglet normal à toutes les largeurs ; seul texte neuf : nom vocal « Mon compte » (non affiché, `TEXTES_CONNEXION.menuCompte`, PROVISOIRE). Menu mobile : hauteur maximale et défilement.
  - **Design** : une seule variante de niveau 2 (`outline-accent`, surcharges locales supprimées), `color-scheme: dark` (case à cocher sombre), /abonnement resserré sous 640 px (bouton d'achat : bas à 646 px à 375 de large, contre 739), lignes des formules à hauteur fixe (le bouton ne bouge plus), anneau du sélecteur au clavier seulement, pied de page lu en colonnes, écarts de l'accueil, quiz, virgule des titres en police d'affichage, pagination (contraste axe).
  - **Mineurs** : `/lettre?statut=invalide|erreur` affiche le formulaire ; après confirmation, statut seul ; Premium : ni lien « La lettre du mois » en pied de page ni titre sans formulaire sur `/lettre` ; anneau du lien « Confidentialité » ; `<title>` des pages à bouton sans insécable ; `compte.ts` « newsletter » → « lettre ».
  - **Tests** : Jest (origine nulle, vraie, étrangère ; créneau ; en-tête ; pages) ; Playwright : smoke remis au vert (textes lus dans `config/textes`, tag `@s21` pour le lot 2) et nouveau projet `local` (base jetable + faux Resend) : parcours lettre complet par boutons, `header-budget` 6 largeurs x 3 états.
- **Contrôles** (depuis `apps/web`, sur le commit de cette entrée) : `tsc -p tsconfig.build.json` OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), `npm run build` OK (/abonnement 4,21 kB / 132 kB, /lettre 972 B / 121 kB, /cgu et /confidentialite 208 B / 96,2 kB), `tsc` complet OK, Jest sans secrets Stripe 316 suites / 4 817 tests OK (5 ignorés). CI GitHub à vérifier verte sur le dernier commit.
- **Procédure** : P0 à P8 ci-dessus (l'ancienne consigne de cette ligne est retirée).

### s21 Lot 2 (boutons, /abonnement, carnet) : INCLUS DANS L'INTÉGRATION S21, ne pas déployer ni suivre séparément (contenu de référence seulement) @fullstack

- **Branche** `claude/marrant-s21-lot2-boutons` (partie de `claude/ouverture-session-nzwj0w` en `433202f`, réassurance « premier paiement » déjà en ligne non touchée). **Commit de code** : `80ec6c9` (puis celui de cette entrée ; déployer le dernier de la branche). Rien de déployé, rien en base, aucune migration, aucune variable.
- **Textes appliqués, mot pour mot** (`docs/copy/lot2-boutons-abonnement-s21.md`, validés à l'aveugle) :
  - **Mur (duel 1, 3/3)** : boutons « Voir ce que contient Premium » (fiches vanne, conseil, vidéo ; bas des listes vannes, conseils, vidéos ; étapes 2+ et validation de l'étape 1 des parcours ; favoris), cartes verrouillées « Débloquer » → « Voir Premium ». Fiches conseil et vidéo : vrai bouton `primary` de 44 px (classes faites à la main retirées) ; fiche vanne passée à 44 px aussi.
  - **Étape 1 gratuite nommée (duel 2, 3/3)** : « Lire la première étape gratuite de {parcours} » sur tous les boutons des encarts d'articles et du bloc de fin (`etape1GratuiteBouton`).
  - **Haut de /abonnement (tour 3, 3/3)** : surtitre visiteur « C'est pour toi si tu restes muet quand on te chambre. », **H1 visiteur « Ta réplique pendant la soirée, pas dans le bus du retour »** (décision Thomas 17/10 : premier écran exactement celui gagné à l'aveugle, l'ancien « Accéder aux parcours complets » n'y est plus ; H1 connecté « Active ton accès pour commencer » inchangé), sous-titre « 5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre. » (5 et 15 à 20 calculés), pastille « plus de 3 mois offerts » à côté d'« Annuel » et ligne « Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an. » dès l'état mensuel, « Sans engagement, annulable à tout moment » retiré de la carte. Annuel choisi : la pastille s'efface, la ligne existante (« soit 2,08 € par mois, plus de 3 mois offerts, 10,89 € économisés par an ») la remplace, pour ne jamais le dire deux fois.
  - **Carnet (tour 2, 3/3)** : bloc « Carnet d'octobre · Situation 1, offerte » / « Le carnet, en vrai » / « Les 14 autres situations du mois sont dans Premium. » + fiche 1 (sans « Si ça se tend » ni « À toi de jouer ») + « Lire la fiche en entier » vers /carnet, entre la carte et « Pas encore sûr ? ». Tout calculé : mois sans l'année (`deMoisSeul`), singulier si 1 autre, pas de phrase si 0, pas de bloc si carnet vide. **Le bloc ne s'affiche que si le carnet du mois en cours est déposé** (`getCarnetExtrait`) : au 10/11, sans `apps/web/src/data/carnet/2026-11.json`, il sera absent (jamais le carnet d'octobre présenté comme « du mois »).
  - **Libellés déjà validés réutilisés** : carnet « S'abonner · 2,99 €/mois » → « Commencer à 2,99 €/mois » (E2) ; profil « S'abonner à 2,99 €/mois » → « Active mon accès · 2,99 €/mois » (E3) ; quiz viral : « Accéder aux parcours complets » en plein, l'étape 1 gratuite en contour (deux niveaux, un seul plein).
  - **Corrections objectives §6.7** : « Accède à tout le catalogue dès » → « pour 2,99 €/mois » (3 listes) et méta de /register (« …et carnet, pour 2,99 €/mois. », information @seo) ; « N vannes / conseils / vidéos supplémentaires avec l'abonnement » → « avec Premium » (3 routes API).
- **Laissé tel quel, à trancher par Thomas (§7)** : « Tout débloquer » (/vannes) et « Tout débloquer à 2,99 €/mois » (quiz d'humour) ; surtitre vidéo « Analyse pédagogique complète » (à rejouer à l'aveugle) ; « Commencer ce parcours » (liste /parcours) ; fiche 3 payante en extrait ; « 1 500+ » sous le bouton ; code mort (`config/blog-cta.ts`, `premium-paywall.tsx`).
- **Fichiers** (`apps/web/src/`) : `config/textes/{offre,entrees-parcours,encarts-blog-s20,carnet-extrait,parcours}.ts`, `lib/carnet.ts`, `app/(dashboard)/abonnement/page.tsx`, `components/premium/{abonnement-view,plan-selector}.tsx`, `components/carnet/{carnet-extrait,carnet-fiche-card,carnet-page}.tsx`, fiches `app/(dashboard)/{vannes,conseils,videos}/[slug]/page.tsx`, listes `components/{vannes/vannes-list,conseils/conseils-list,videos/videos-grid,favoris/favoris-list}.tsx`, `components/{parcours/step-blocks,profil/abonnement-card,quiz/viral-quiz}.tsx`, `app/api/{jokes,tips,videos}/route.ts`, `app/(auth)/register/layout.tsx`. Tests : 8 mis à jour, 2 nouveaux (`lib/lot2-libelles-s21`, `lib/carnet-extrait-s21`).
- **Correctifs de la QA visuelle s21** (`docs/qa/verification-visuelle-s21.md` §2, mise en page seulement, aucun mot changé) : (1) pastille « plus de 3 mois offerts » rangée dans la colonne d'« Annuel », sous sa pastille et alignée sur elle, annoncée avec l'option (`aria-describedby`) ; à 375 et 1280 elle est sous « Annuel », à 320 « Annuel » passe à la ligne avec elle, jamais sous « Mensuel » (`plan-selector.tsx`) ; (2) `text-wrap: balance` sur les boutons étape 1 des encarts, du bloc de fin et des fiches : « Lire la première étape / gratuite de Répartie », plus de nom de parcours seul en 2e ligne ; (3) fiches vanne, conseil, vidéo : « …du parcours X » **laissé tel quel**, c'est l'emplacement G5, hors duel 2 et déclinaison [CHOIX] gardée (§2 du doc copy) : à trancher par Thomas ou @copywriter. Captures locales : `docs/qa/captures-s21/apres-correctifs/`.
- **H1 validé posé (17/10, décision Thomas)** : `ABONNEMENT_HAUT_VISITEUR.titre` (`config/textes/offre.ts`) lu par `abonnement-view.tsx`. Premier écran vérifié mot pour mot contre le §5.3 (version corrigée du tour 3) : aucun autre écart de texte. Test qui fige tout le premier écran visiteur, dans l'ordre (`__tests__/feature/abonnement-page.test.tsx`) et le H1 dans `lib/lot2-libelles-s21`. Rendu local vérifié (annuel disponible, prix fictif local) : H1 sur 3 lignes à 375, 2 lignes à 1280 ; captures `lot2-abonnement-titre-{375,1280}.png`. Écart de structure (§7 point 3) traité au point suivant.
- **Bouton d'achat au premier écran (17/10, décision Thomas : « soit on le fait et on le fait bien », §5.2 et §7 point 3, audit s20 lot 2)** : dans la carte, ordre Premium, sélecteur, prix, ligne annuelle, **bouton**, réassurance, rétractation, **puis** les avantages (`PremiumBenefits` déplacé sous le bouton, aucun mot changé, aucun espacement réduit). Pas de barre collante. Mesuré en local (build + start, prix fictifs, sans base ni secrets Stripe) : bouton de **y 691 à 739** à 375 × 812 en mensuel (709 à 757 en annuel), de 603 à 651 à 1280 × 800 (601 à 649 en annuel), contre y ≈ 1 131 avant. Fichier : `components/premium/abonnement-view.tsx` ; test d'ordre du premier écran étendu aux avantages après le bouton (`__tests__/feature/abonnement-page.test.tsx`). Captures `docs/qa/captures-s21/apres-correctifs/lot2-abonnement-bouton-{375,1280}-{mensuel,annuel}.png`.
- **Contrôles** (depuis `apps/web`, sur `80ec6c9`, refaits sur le commit du H1 puis sur celui du bouton au premier écran : mêmes résultats, /abonnement 4,21 kB, 132 kB First Load, Jest 305 suites / 4 651 tests OK) : `tsc -p tsconfig.build.json` OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), `npm run build` OK (/abonnement 4,16 kB, 132 kB First Load), `tsc` complet OK, Jest sans secrets Stripe 305 suites / 4 650 tests OK (5 ignorés). CI GitHub à vérifier verte sur le dernier commit.
- **Avant le déploiement** : relire en captures 375 / 768 / 1280 (/abonnement visiteur mensuel et annuel, fiches, listes, quiz, encarts d'articles) ; mesure avant / après à écrire avec @data-analyst (§7 point 10) ; vérifier que `2026-11.json` est déposé si le bloc carnet doit être visible.
- **Procédure** (arbre principal propre, branche fusionnée) : relever le N-1 (`npx wrangler deployments list`), puis `cd apps/web && rm -rf .open-next && npm run build:cf && npm run deploy:cf`. Après : `/`, `/abonnement`, `/api/health` en 200 ; sur /abonnement : surtitre, « Ou 24,99 €/an… » et « plus de 3 mois offerts » une seule fois, bloc carnet si le carnet du mois existe ; une fiche conseil (« Voir ce que contient Premium ») ; l'article n°1 (« Lire la première étape gratuite de Répartie »). Retour arrière : `npx wrangler rollback <version N-1>`.

### s21 Lettre mensuelle : INCLUS DANS L'INTÉGRATION S21, ne pas déployer ni suivre séparément ; `LETTRE_OUVERTE` n'existe plus, procédure d'ouverture ci-dessous périmée (contenu de référence seulement) (@fullstack, 17/10/2026)

- **Branche** : `claude/marrant-s21-lettre` (depuis `claude/ouverture-session-nzwj0w`). **Ne pas déployer avant le bilan du lot 1 (~10/11), ni dans le même déploiement que le lot 2** (spec UX §4 règle 6).
- **Interrupteur** `LETTRE_OUVERTE = false` (`apps/web/src/config/lettre.ts`). Fermé : composant absent (fin d'article, résultat du quiz), lien de pied de page absent, `/lettre` et `/lettre/confirmer` en 404, `POST /api/newsletter` en 410 (comme depuis le 01/10), confirmation en 404, tâche d'envoi inactive. Restent actifs même fermé : la désinscription (`/lettre/desinscrire`, `POST /api/newsletter/unsubscribe/<jeton>`, `/lettre?statut=desinscrit`) et l'entretien de la liste (ne fait qu'un `count` tant que la liste est vide). Déployer fermé ne change donc rien de visible.
- **Ce qui est livré** : inscription double opt-in (case jamais cochée, texte de la case @legal L1 stocké par le serveur sous `lettre-mensuelle-v2` depuis le 17/10, empreinte HMAC de l'IP, aucun agent utilisateur, même écran « Regarde ta boîte mail » pour un déjà inscrit, 2 e-mails de confirmation au plus, limites par IP et par adresse) ; confirmation et désinscription par bouton POST (un GET ne change jamais un statut) ; `List-Unsubscribe` + `List-Unsubscribe-Post` ; page `/lettre` (statuts, dernier numéro envoyé) ; tâche mensuelle (numéro `VALIDE` du mois de Paris, journal `NewsletterSend` réservé avant chaque envoi, exclusion des Premium qui reçoivent l'hebdo et des oppositions globales) ; entretien quotidien 4 h Paris (non confirmés effacés à 7 j, reconfirmation à 24 mois puis désinscription sans clic à 30 j, traces de désinscription effacées à 3 ans ; durées dans `config/lettre.ts`, hypothèses @legal A3) ; numéros préparés dans `apps/web/src/data/lettre/numeros.json` (format en tête de `lib/lettre/numeros.ts`, synchronisés au démarrage, un numéro `ENVOYE` n'est jamais modifié) ; Umami `lettre-vu`, `lettre-envoi`, `lettre-echec`, `lettre-confirmee` (attribués ; `mesure=1` seulement hors `emailsExclus()`). Textes : `config/textes/lettre-s21.ts`.
- **Migration Neon** `14_lettre_mensuelle_s21` (idempotente : tables `NewsletterIssue`, `NewsletterSend`, `PremiumLetterPreference`, 3 enums, colonnes `NewsletterSubscriber.confirmationSentAt`, `confirmationSendCount`, `reconfirmRequestedAt`, effacement des `userAgent` déjà stockés). À jouer **avant le déploiement qui contient ce code** (le client Prisma lit les nouvelles colonnes), depuis `apps/web` : `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/14_lettre_mensuelle_s21/migration.sql`, **2 fois** (la 2e passe doit réussir). Non jouée sur la production.
- **Numéros 1 à 6 chargés (17/10, s21)** : `data/lettre/numeros.json` = versions retenues et validées à l'aveugle de `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md` (objet recommandé, pré-en-tête, corps mot pour mot ; seul le balisage Markdown `>` et `**` est retiré, e-mail texte seul), liens avec utm, `datePlancher` = publication de l'article cité (n°1 16/11, n°2 23/11, n°4 05/11/2026, n°5 25/02/2027 ; n°3 et n°6 citent une étape de parcours, aucune). `envoiPrevu: null` (jours à fixer par Thomas) : **aucun numéro n'est chargé en base** tant que le jour n'est pas renseigné ; un `envoiPrevu` antérieur au plancher est refusé. Pied des numéros : `Éditeur : [À COMPLÉTER ...]` (`LETTRE_MENTION_EDITEUR_NUMERO`, `config/lettre.ts`, avis @legal A6) ; tant qu'un marqueur `[À COMPLÉTER` figure dans le numéro rendu, la tâche ne l'envoie pas (`bloque`, log `[scheduler:lettre-mensuelle] ... bloqué`). Test : `lettre-numeros-s21.test.ts`. Rien à faire côté Replit.
- **Textes validés à l'aveugle chargés (17/10, s21)** : `config/textes/lettre-s21.ts` = versions retenues des packs `docs/copy/lettre-mensuelle-s21/pack-relecture-textes-lettre*.md`, mot pour mot (blocs 1, 2, 6, 8, 9, 11 : tour 2 ; blocs 3, 4, 5, 7, 10, 12 : tour 1 ; bloc 13 inchangé). Consentement : nouvelle étiquette `lettre-mensuelle-v2` (réserve @legal R1), ancien texte gardé dans `CONSENTEMENTS_LETTRE_ARCHIVES` (aucun consentement v1 attendu en base : interrupteur jamais ouvert). Drapeau « regarde ta boîte » limité à `LETTRE_PENDING_JOURS` (7 j). Lien Confidentialité du formulaire : `/confidentialite#lettre` (R2 : l'`id="lettre"` doit être posé sur la section lettre publiée à l'ouverture, B7). « Te réinscrire » = retour au formulaire `/lettre` (double opt-in, R3). « Déjà dans la liste » : 1 par adresse et par `LETTRE_DEJA_INSCRIT_HEURES` (24 h). Ligne « Le prochain numéro arrive le {date}. » supprimée le 17/10 (date jamais affichée, voir l'entrée calendrier). `utm_source=lettre` ajouté à la liste blanche d'attribution (`lib/attribution.ts`). Tests : `lettre-textes-valides-s21.test.ts` + `lettre-inscription-s21.test.tsx`. Rien à faire côté Replit.
- **Correctifs de la vérification visuelle @qa (17/10, s21)** : 1. espaces insécables avant « : ; ? ! » (et à l'intérieur de « … ») dans tous les textes de la lettre, écran et e-mails texte (objets compris), posées par `insecables()` dans `config/textes/lettre-s21.ts` (`frPonctuation`, `lib/fr-typo.ts`) ; mêmes insécables sur l'objet et le corps des numéros au rendu (`corpsNumero`, aperçu `/lettre`), texte stocké intact ; métadonnées de `/lettre` inchangées. Aucun mot changé (comparaison mot pour mot maintenue, insécables ramenées à des espaces). Lien « Confidentialité » précédé d'une insécable et rendu en ligne (plus de ligne haute de 44 px). 2. Formulaire en une seule colonne à toutes les largeurs : champ, case, bouton, mention (ordre visuel = ordre du clavier, WCAG 2.4.3). Test : nouveau `lettre-insecables-s21.test.ts` + 2 tests dans `lettre-inscription-s21.test.tsx`. Captures locales 375 et 1280 : `docs/qa/captures-s21/apres-correctifs/`. Rien à faire côté Replit.
- **Calendrier d'envoi et envoi de test (17/10, s21, décisions de Thomas)** : 1. Règle unique `dateEnvoiLettre(periode, datePlancher)` (`lib/lettre/envoi.ts`) : **premier jeudi du mois à 8 h, heure de Paris** (heure d'été et d'hiver gérées) ; si la date plancher tombe après ce jeudi, premier jeudi qui suit la date plancher (même mois, sinon refus). Le schéma impose `envoiPrevu` = la règle ; la tâche d'envoi ne lit rien avant le premier jeudi 8 h du mois en cours. `envoiPrevu` rempli : n°2 jeu. 03/12/2026, n°3 07/01/2027, n°4 04/02/2027, n°5 04/03/2027, n°6 01/04/2027 (tous 8 h Paris). **n°1 (période 2026-11) laissé à `null`** : son mois est avant décembre et décembre est pris par n°2 (Noël, « Rendez-vous en janvier ») ; décision de Thomas attendue. **Effet au prochain déploiement** : la synchronisation de démarrage crée en base les numéros 2 à 6 (`VALIDE`, `scheduledFor`) ; rien ne part (interrupteur fermé et mention d'éditeur `[À COMPLÉTER`). 2. La date du prochain numéro n'est **jamais** affichée sur le site : ligne « Le prochain numéro arrive le… » et son texte supprimés, `envoiPrevuFixe` retiré. 3. Script `apps/web/scripts/envoi-test-lettre-s21.ts` : liste blanche codée en dur (`alex@deviens-marrant.fr` seule), rendu par le vrai code (confirmation + numéro 1), objet « [TEST] », sans base ; lancé une fois le 17/10 : 2 e-mails acceptés par Resend (`01a14b81-42f3-7d1d-9820-c0f2d94e8716` confirmation, `01a14b81-4389-7012-9aab-926cc52fde59` numéro 1) ; statut de livraison non lisible (clé limitée à l'envoi, à voir dans le tableau de bord Resend). Tests : `lettre-calendrier-s21`, `lettre-envoi-test-script-s21`, mises à jour `lettre-envoi-s21`, `lettre-numeros-s21`, `lettre-s21`, `lettre-textes-valides-s21`, `lettre-inscription-s21`. Rien à faire côté Replit.
- **Textes neutres, mention d'éditeur, n°1 (17/10, s21, décisions de Thomas)** : 1. Quatre phrases neutres validées à l'aveugle, intégrées mot pour mot (aucun autre mot changé) : pied des numéros « Tu reçois cette lettre parce que tu l'as demandée sur deviens-marrant.fr. » (tour 1, duel 2) ; titre après confirmation « C'est bon, c'est confirmé. » (tour 2, duel 1) ; n°6 « Pourquoi ça marche » « … jamais écrit : c'est l'autre qui le reconstitue, et c'est ça qui fait rire. » et « À toi de jouer » point 3 « N'explique pas le raisonnement : laisse l'autre le reconstituer. » (tour 2, duels 2 et 3). 2. `LETTRE_MENTION_EDITEUR_NUMERO` = « deviens-marrant SAS » (identique à la mention sous le bouton) ; le garde-fou `[À COMPLÉTER` reste actif. 3. n°1 : `envoiPrevu` jeu. 19/11/2026 8 h Paris (premier jeudi après la date plancher 16/11) ; la contrainte « décembre au plus tôt » est levée. **Effet au prochain déploiement** : la synchronisation crée les numéros 1 à 6 en base (`VALIDE`, `scheduledFor`) ; rien ne part tant que l'interrupteur est fermé, mais la mention ne bloque plus : **ne pas ouvrir l'interrupteur sans feu vert de Thomas**. 4. Script d'essai : objet « [TEST 2] », relancé une fois le 17/10 vers alex@deviens-marrant.fr seule, 2 e-mails acceptés par Resend (`01a14b87-ae9a-7ed1-80fd-8cc8ac2c0c0a` confirmation, `01a14b87-af6b-7f0c-aed4-e912ceab2b89` numéro 1). Miroir `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md` (branche de session) à aligner pour le n°6. Rien à faire côté Replit.
- **Migration testée 2 fois sur base jetable le 17/10 : OK** (@infrastructure, aucune correction). Postgres 16 local jetable (127.0.0.1:55432, détruit après le test, aucune connexion à la production). État de départ = production avant la 14 : `prisma db push` du `schema.prisma` de `09f2902`, plus 1 inscrit factice avec un `userAgent`. Passe 1 : `prisma db execute` (la commande ci-dessus) OK, `userAgent` remis à NULL, `confirmationSendCount` = 0. Passe 2 : `psql -v ON_ERROR_STOP=1 -f` OK (seulement des NOTICE « already exists, skipping »). Après chacune : `prisma migrate diff --from-url <base jetable> --to-schema-datamodel prisma/schema.prisma --exit-code` = 0 (aucun écart). Test complet joué 2 fois. Constaté au passage, sans lien avec la 14 et sans effet tant que la production reste sur `db push` / `db execute` : `npx prisma migrate deploy` depuis une base vide est impossible (`0_init` commence par 2 lignes d'avertissement Prisma collées dans le SQL ; tri lexical `10_`…`14_` avant `2_` ; `WebhookEvent` jamais créée par une migration). Ne jamais utiliser `migrate deploy` pour cette migration.
- **Variables** : aucune nouvelle. Utilisées : `UNSUBSCRIBE_HMAC_SECRET` (empreinte d'IP ; absent = aucune empreinte stockée), `ANALYTICS_EMAILS_EXCLUS` (mesure), `RESEND_API_KEY`, `EMAIL_FROM`, `NEXTAUTH_URL` (liens des e-mails et redirections).
- ~~**Procédure d'ouverture**~~ **PÉRIMÉE, remplacée par P0 à P8 de l'intégration** (gardée pour l'historique) :
  1. Prérequis spec §7.1 : premier numéro relu à l'aveugle et validé, stock de 6 numéros, jour d'envoi fixé (premier jeudi 8 h, `envoiPrevu` rempli pour les 6 numéros, n°1 le 19/11/2026) ; e-mails de confirmation, « déjà dans la liste » et reconfirmation et textes d'écran : relus à l'aveugle et chargés le 17/10 (`config/textes/lettre-s21.ts`).
  2. @legal B4 : suivi d'ouverture et de clic **désactivé** dans Resend (réglage du domaine) ; B7 : sections lettre de `/confidentialite` et des CGU publiées le jour de l'ouverture (texte exact dans `docs/legal/lettre-et-questions-s21.md`, non intégré ici).
  3. Vérifier en base que `NewsletterSubscriber` est vide (0 inscrit attendu, ancien consentement abandonné).
  4. Numéros : remplir `data/lettre/numeros.json` (`"statut": "VALIDE"` = validé par Thomas), commit.
  5. Test d'envoi sur une liste de test : inscrire les adresses de Thomas en préproduction ou en local, confirmer par le bouton, numéro d'essai `VALIDE` avec `envoiPrevu` passé, laisser passer un tick ; vérifier le journal `NewsletterSend`, l'en-tête `List-Unsubscribe`, la désinscription en un clic depuis Gmail.
  6. Passer `LETTRE_OUVERTE = true`, `tsc` / lint / build / Jest, commit, déploiement. Après : `/lettre` 200, bloc sous le bloc de fin d'un article et sous le résultat du quiz, lien « La lettre du mois » en pied de page.
- **Retour arrière** (PÉRIMÉ, voir P8) : `LETTRE_OUVERTE = false` et redéploiement (les inscrits restent en base, la désinscription reste possible) ; ou `npx wrangler rollback <version N-1>`.
- **Contrôles** (depuis `apps/web`) : `tsc -p tsconfig.build.json` OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), `npm run build` OK, `tsc` complet OK, Jest sans secrets Stripe OK.

### s21 (17/10/2026) Réassurance « premier paiement » sous les boutons d'achat et sur /register @fullstack, **DÉPLOYÉ le 17/10/2026 vers 16:30 Paris** (feu vert de Thomas : « Déploie-les »)

- **Commits** : `2b96f37` (boutons d'achat) puis celui qui complète /register (`git log -1 --format=%h -- apps/web/src/config/textes/offre.ts`), branche `claude/ouverture-session-nzwj0w` ; déployer le dernier (il contient les deux).
- **Quoi** : « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. » se lisait « chaque mois remboursable » (6 relecteurs à l'aveugle) ; seul le premier paiement l'est. Remplacé par la V3 validée à l'aveugle (lot 2 tour 3, 3/3 au niveau) là où le prix est affiché en gros juste au-dessus : prix « 2,99 € TTC / mois » (« 24,99 € TTC / an » en annuel) et « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. »
- **Fichiers** (`apps/web/src/`) : `config/textes/offre.ts` (`REASSURANCE_PAIEMENT`), `components/premium/abonnement-view.tsx` (/abonnement), `components/premium/plan-selector.tsx` (TTC près du montant, 2 plans), `components/premium/premium-modal.tsx` (modale), `components/home/premium-cta.tsx` (accueil) ; tests `offre-s16-lot-c`, `premium-modal`, `emails-etalons-s16-lot-e`.
- **/register traité** (duel à l'aveugle, 3/3 au niveau, `docs/copy/lot2-s21/pack-relecture-register.md`) : ligne du haut « Premium, 2,99 € TTC par mois, annulable à tout moment. » (annuel : « Premium, 24,99 € TTC par an, annulable à tout moment. », la formule suit le choix fait sur l'offre via `callbackUrl` ou `?plan=annual`) ; sous le formulaire « Tu as 14 jours pour te faire rembourser ton premier paiement. » (`REMBOURSEMENT_PREMIER_PAIEMENT`). `reassurancePaiement` supprimée : plus aucun « remboursé sous 14 jours » dans `apps/web/src` hors tests (garde-fou dans `register-premier-paiement-s21`). Fichiers : `config/textes/offre.ts`, `app/(auth)/register/page.tsx` ; tests `register-s16`, `register`, `emails-etalons-s16-lot-e`, nouveau `register-premier-paiement-s21`.
- **Contrôles** (depuis `apps/web`, après /register) : `tsc -p tsconfig.build.json` OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), `npm run build` OK, `tsc` complet OK, Jest sans secrets Stripe 303 suites / 4 619 tests OK.
- **Procédure** (arbre principal propre, branche à jour) : relever d'abord le N-1 (`npx wrangler deployments list`, noter la version en ligne), puis `cd apps/web && npm run build:cf && npm run deploy:cf`. Après : `/`, `/abonnement`, `/api/health` en 200, vérifier « TTC / mois » et la nouvelle phrase sur /abonnement (mensuel et annuel), la modale et l'accueil, puis /register (les deux lignes) et /register?plan=annual (« 24,99 € TTC par an »). Retour arrière : `npx wrangler rollback <version N-1>`.
- **Déploiement** : depuis l'arbre principal propre, commit `75a809b` (contient `2b96f37`), CI GitHub verte sur ce commit, aucun commit de code de main, master ou de la branche de référence absent de HEAD. `rm -rf .open-next`, `npm run build:cf && npm run deploy:cf` (variable Hyperdrive factice) : OK. **Version en ligne `5ea46dd8-1e31-4175-bc99-3d0873925901`**, N-1 `476cc8f0-3d07-448a-8f40-ba37953c310e`. Retour arrière : `cd apps/web && npx wrangler rollback 476cc8f0-3d07-448a-8f40-ba37953c310e`.
- **Vérifié en ligne** (curl, `?ne-pas-compter=1`) : `/api/health` 200, `/` 200 ; `/abonnement` : « remboursé sous 14 jours » 0, « te faire rembourser ton premier paiement » 1, « TTC / mois » 1 ; `/register` : « remboursé sous 14 jours » 0, « te faire rembourser ton premier paiement » 1, « TTC par mois » 1.

- ~~**s15 (14/10/2026) pool strict 49 → 48** (`apps/web/src/config/social-pool.ts`, V1-1-05 retirée) : voir section ci-dessous. Déploiement normal, rien à lancer après. Sans déploiement, l'alerte « stock < 14 » compte encore V1-1-05 (aucun effet sur les posts déjà en base).~~ **DÉPLOYÉ le 14/10/2026** (voir section ci-dessous)

## Pause réseaux sociaux (15/10/2026, 09:50 Paris), **RIEN À DÉPLOYER** (base uniquement)

- **X, Instagram, LinkedIn EN PAUSE** via `POST /api/admin/social/platforms` (`action: pause`, raison « Pause d'une semaine demandée par Thomas le 15/10 (test) »). Vérifié par `GET` : `paused: true` sur les 3, canaux Buffer `ok`. Les posts APPROVED restent en base (X 21, Instagram 21, LinkedIn 8) ; rien n'est envoyé à Buffer à l'avance. LinkedIn du 15/10 06:15 UTC parti avant la pause.
- **Session s15 interrompue** et ses **8 routines désactivées** (non supprimées) : lecture des alertes (`trig_01CMoR4CaRWFxByFq3XLuqVB`), pilotage quotidien (`trig_01RVttxde5WDkZ5ghQdo1zan`), V1 tour 2 (`trig_01MdYLH4Pff7XCBhzvjveM2D`), production de la semaine (`trig_014aP9oq7MbtEL8Psc5ntTmM`), relevé du lundi (`trig_01HKSsVU1h8q5AxhiXV5XVs3`), pilier J+14 (`trig_01SBRUPeFnFPpqEE8D2DNY6i`), LinkedIn 27/10 (`trig_01VkVL2GErhqdQAsdqnqHJs7`), liens de bio 03/11 (`trig_01XEADTxfFqaFHqvArNCVQ88`).
- **Reprise (GO Thomas uniquement)** : décaler d'abord les dates des posts APPROVED de la durée de la pause (sinon `reprendre()` passe en REJECTED tout post en retard de plus de 24 h), puis `action: reprise` par réseau, puis réactiver les routines (`update_trigger enabled=true`).
- Effet de bord connu : sans la routine de lecture des alertes, le site peut envoyer à Thomas le digest « N alerte(s) non relue(s) » (07:30) pour des alertes hors réseaux ; les réseaux en pause n'en génèrent pas (`couverture.ts`).
- **Prolongation (17/10, s21, décision Thomas)** : pause maintenue jusqu'au **lundi 26/10** ; rappel de fin de test décalé au 26/10 07:33 UTC. Au moment de la reprise, décaler les posts APPROVED de toute la durée de la pause (du 15/10 au jour de reprise). Rien à déployer.

## s15 (15/10/2026, 07:13 Paris) : lecture quotidienne des alertes, **RIEN À DÉPLOYER**

- Lecture réelle (sans `apercu`) de `/api/admin/alertes?jours=2` : 13 alertes, toutes de classe B, aucune A. Précédente lecture : 14/10 07:34 UTC (le filet de 48 h ne se déclenche pas).
- **Stock** (X, Instagram, LinkedIn : 8 vannes éligibles, seuil 14) : déjà en traitement, rien à corriger à chaud. Les posts en base couvrent jusqu'au 15/11 (lot 1b). +4 vannes du tour 2 V1 au pool le 16/10 après le D7 (rappel programmé), livraison V1 le 26/10, lot 2a ensuite (routine de production du lundi 19/10).
- **Files basses et lancement 1b** (13/10) : périmées, le lot 1b est inséré depuis le 13/10.
- Aucun FAILED, aucun 429. Rien à écrire à Thomas.

## s15 (14/10/2026) V1-1-05 PROCHE : pool strict 49 → 48 @fullstack, **DÉPLOYÉ le 14/10/2026, version `476cc8f0-3d07-448a-8f40-ba37953c310e`, HEAD `d1f092a7`** (N-1 `3a00b3d5`, retour arrière `npx wrangler rollback 3a00b3d5-571a-460c-88fb-c7c704233cbb` ; déployé par la session depuis l'arbre principal propre, `/`, `/api/health`, `/liens` en 200 ; carte LinkedIn du 20/10 relue par la session) ; post LinkedIn du 20/10 passé à V1-3-10, **base écrite**

- Origine : contrôle catalogue du 14/10 (`docs/social/vague-v1/departage-linkedin-2-resultat.md`, « Révision du 14/10 ») : V1-1-05 `cv1105a3e91c7d42b8f06d5e1` PROCHE, ne part plus sur les réseaux.
- **Pool strict** : V1-1-05 retirée (commentaire à sa place), 49 → 48 ; note ajoutée sur C10 n°1 (« notée 7,5 / 7,5 le 14/10 : ne plus la tirer sur LinkedIn sans nouvelle relecture », placée après sa note 8,5 / 8,5 : `notesDuTexte` garde 8,5, vérifié). `couverture.test.ts` : 48 + V1-1-05 absente. La `Joke` V1-1-05 reste active au catalogue du site.
- **LinkedIn 20/10 06:15 UTC, `c9892ac953d655704e63e7fb1`** (`[variante:image]`), **base écrite le 14/10** : V1-1-23 `cv11236cb2b8716b34a7f6191` d'abord écartée (au format du post, `checkPost` refuse le texte complet : « LinkedIn : 4 phrases (max 3) », v5 R4 ; c'est le texte du repli si la carte ne se rend pas). Décision de la session : **V1-3-10** `cv13109a2ec9fb9ceba2a1ae3` (wifi de la voisine, pool strict 8,5 / 8,5, neuve, D7 passé). Mention « V1-1-23 appliquée en base » du départage à corriger.
  - Avant : V1-1-05, `content` « Pendant la réunion de direction, j'ai hoché la tête dix minutes sans rien comprendre. » / « J'ouvre l'agence de Lyon lundi. » (2 lignes, espace insécable U+00A0 à l'intérieur des « »), `hook` = amorce coupée à 80 car., `directorNote` « [variante:image] Lot relance-s15 (VANNE, ÉCHANGE C10 V1-1-05) : départage à l'aveugle du 12/10 (9 / 9), remplace V107 (7,5 / 7,5 au C10), docs/social/preparation/aveugle-c10-linkedin-resultat.md. »
  - Après : même format, texte du catalogue mot pour mot : « Ma voisine m'a invité à dîner. J'utilise son wifi depuis deux ans. » / « Au dessert, elle m'a demandé si je pouvais regarder moins de séries. » ; `threadParts` [amorce, chute], `hook` = amorce (67 car.), `sourceId` V1-3-10 ; `directorNote` : marqueur conservé et origine (contrôle catalogue 14/10, V1-1-05 PROCHE ; V1-1-23 refusée par R4 ; décision de la session). Statut APPROVED, heure, `approvedBy` `thomas-s15`, `imageUrls` inchangés.
  - UPDATE ciblé (une ligne modifiée) : WHERE id + APPROVED + LINKEDIN + ancien `sourceId` V1-1-05 + heure + ancien texte exact. Contrôles relancés juste avant : `checkPost` (R6, LinkedIn) OK sur le texte complet (3 phrases) et sur l'amorce ; `vanneLinkedInImage` OK ; 0 post V1-3-10 à ±90 jours ; 0 post « wifi » / « voisine m'a invité » à ±90 jours (5 posts X d'avril et mai contiennent « wifi », d'autres textes). V1-1-05 n'est plus sur aucun post en base (vérifié après écriture).
  - Carte en ligne (`imageUrls[0]`, URL exacte) : 200 `image/png` 1080×1350, relue : chute entière entre « », rien de rogné.
- Contrôles (depuis `apps/web`) : `tsc -p tsconfig.build.json` OK, `tsc` complet OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), Jest sans secrets Stripe 302 suites / 4 614 tests OK, `npm run build` OK.
- Retour arrière : revert du commit (pool) ; post : UPDATE vers l'état « Avant » (`content`, `hook` « Pendant la réunion de direction, j'ai hoché la tête dix minutes sans rien compre », `threadParts`, `sourceId` `cv1105a3e91c7d42b8f06d5e1`, `directorNote`), mais V1-1-05 est PROCHE : remettre plutôt une autre vanne au niveau.

- ~~**s15 (14/10/2026) pool strict 42 → 49**~~ **DÉPLOYÉ le 14/10/2026** (voir section ci-dessous) (`apps/web/src/config/social-pool.ts`) : lu par le Worker (`lib/scheduler/jobs.ts` → `lib/social/couverture.ts`, alerte « stock < 14 » par réseau). Déploiement normal, rien à lancer après. Sans déploiement, l'alerte de stock compte encore sur 42 vannes (aucun effet sur les posts déjà en base).

## s15 (14/10/2026) Vague V1 tour 1 au catalogue et au pool strict + Instagram du 16/10 échangé @fullstack, **base écrite ; DÉPLOYÉ le 14/10/2026, version `3a00b3d5-571a-460c-88fb-c7c704233cbb`, HEAD `c8712edf`** ; N-1 `e582e79f` (retour arrière : `npx wrangler rollback e582e79f-e1ca-498a-83b2-fddb543b7035`)

- Déployé par la session de pilotage depuis l'arbre principal propre (aucun worktree), garde vérifiée : seule entrée en attente ; `fb185e53` (s20, en ligne) ancêtre de HEAD ; seul diff de code depuis : `social-pool.ts` et son test. Après : `/`, `/api/health`, `/liens` en 200. Vérifié en base par la session : post `ccae22fef4df074be8e423987` APPROVED 16/10 17:30 UTC, `sourceId` V1-3-21, légende exacte ; 5 `Joke` actives ; carte slide 1 relue.

- Délai de veto D7 écoulé (14/10 08:00 Paris) sans retrait : `docs/social/vague-v1/echantillon-d7-v1-t1.md`. Écritures Neon via `@neondatabase/serverless` (scripts temporaires dans `apps/web`, supprimés) ; doublon vérifié avant insertion (texte exact de l'amorce et de la chute, mots clés Belém, wifi, serre-file, poubelle, virgules, anonyme : aucun).
- **Catalogue** (`Joke`, une transaction, ONE_LINER, `isActive`, `GARDER`, `copyReviewVersion` 1, `generatedByAI` false comme V1-1-05, décryptage de `decryptages-v1-t1.json`, mot pour mot) : V1-3-21 `cv1321baa312105ca92398ea3` (COUPLE), V1-3-10 `cv13109a2ec9fb9ceba2a1ae3` (SITUATION, voisine), V1-4-13 `cv141330f7753ee15285ae40a` (SITUATION, comme les vannes course/bus existantes), V1-3-16 `cv131698c0aa03a1194d3e2d2` (SITUATION, comme la vanne coloc existante), V1-1-23 `cv11236cb2b8716b34a7f6191` (BOULOT).
- **Pool strict** : 42 → 49, à leur rang (moyenne des notes à l'aveugle) : V1-1-05 et V1-3-21 (9 / 8,5) après V111 ; C10 n°1, V1-3-10, V1-4-13, V1-3-16, V1-1-23 (8,5 / 8,5) après P0-072, avant P0-041. Tests : `couverture.test.ts` (compte 49 ; test d'alerte de stock : « toutes sauf 10 » au lieu de « 30 sur 40 »).
- **Instagram 16/10 17:30 UTC, `ccae22fef4df074be8e423987`** (UPDATE ciblé : id + APPROVED + INSTAGRAM + ancien texte exact + ancien `sourceId` + heure) : avant détecteur de fumée `cmmnsqn120000th63o435xsb0`, légende « À envoyer à ta mère, qui t'avait dit de surveiller le four. » ; après V1-3-21, `threadParts` [amorce, chute] (format des autres posts vanne Instagram, « » posés par la carte), `hook` = amorce, légende « À envoyer à l'amie dont le mari « s'occupe des photos de vacances ». » (8,5 / 8,5, `aveugle-legende-ig-16-10-resultat.md`), `imageUrls`, heure, statut, `approvedBy` inchangés ; `directorNote` : origine (audit qualité 12/10, prémisse circulée) au lieu de « TIRAGE ». `defautsLegende` et `checkPost` (R6) : conformes. Cartes en ligne : slide 0 et 1, 200 `image/png` 1080×1350, relues : amorce et chute entières entre « », rien de rogné.
- **Contrôles** (depuis `apps/web`) : `tsc -p tsconfig.build.json` OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), `npm run build` OK, `tsc` complet OK, Jest sans secrets Stripe 302 suites / 4 614 tests OK.
- Retour arrière : UPDATE du post vers l'ancien état (`content`, `hook` « Mon détecteur de fumée me sert de minuteur. La dernière fois, les pompiers sont », `threadParts`, `sourceId` `cmmnsqn120000th63o435xsb0`, `directorNote` « Lot relance-s15 (VANNE, TIRAGE) ») puis `DELETE FROM "Joke"` des 5 ids ; revert du commit pour le pool.

## s20 Phrase Répartie de l'article couple corrigée, **DÉPLOYÉ le 13/10/2026, version `e582e79f-e1ca-498a-83b2-fddb543b7035`, commit `fb185e53`** ; N-1 `b5c6ce51`

- `config/blog-cta.ts` (`blagues-de-couple-drole`, programmé le 05/11) : « Le parcours Répartie t'entraîne, étape après étape, à trouver quoi répondre du tac au tac quand on te chambre. » (Thomas « je valide tout » ; relue 3/3 à l'aveugle, `docs/copy/relecture-videos-s20/verdict-phrase-repartie-*.md`). Test `suppression-compte-gratuit-s15` aligné. tsc ×2, lint, Jest 4 614, build OK. Rien à lancer.

## s20 Lot « montrer l'offre » (audit conversion, lots 0-1), **DÉPLOYÉ le 13/10/2026, version `b5c6ce51-dc4a-4917-ad0f-b8f694ad9ade`, commits `2a43d615` + `3faf9777`** ; N-1 `d2bdace2`

- Encarts au fil du texte (articles du code ET de la base) : `components/blog/blog-article-body.tsx` + `blog-encart-milieu.tsx`, placement `lib/blog-encarts.ts` (après une section H2 vers 40 % du texte, rien sous 3 H2) ; article n°1 : 2 encarts imposés (Répartie après « soirée », Boulot après « bureau »), à 21 % et 32 % de la page mobile (premier lien produit à 77 % avant).
- Bloc de fin unique (`components/blog/article-cta.tsx`) : étape 1 gratuite (contour violet), puis « Accéder aux parcours complets » (plein) ; ancien encart `blog-article-parcours-maillage.tsx` supprimé ; articles liés après le bloc ; `phrases-droles-conversations` : bloc avant la FAQ.
- 5 parcours (`ParcoursSlug` unique) ; correspondance article → parcours `config/blog-encarts.ts` (17 changements, `docs/copy/encarts-montrer-offre-s20.md` §D) ; clusters `fort-volume` → Répartie, `humour-contexte` → Boulot (`lib/blog-parcours.ts`).
- Textes : `config/textes/encarts-blog-s20.ts`, validés à l'aveugle (verdicts `docs/copy/relecture-videos-s20/verdict-encarts-offre-*`, tours 1 et 2) ; durées lues dans `config/premium.ts`.
- En-tête mobile : « Commencer » visible dès 360 px pour les visiteurs (cible 44 px) ; recherche dans le menu sous 440 px, « Connexion » dans la barre dès 520 px (sinon dans le menu).
- Mesure : `blog-cta-vu` (50 % visible, une fois par encart) et `blog-cta-clic` avec `position` / `parcours` / `slug` ; `?ne-pas-compter=1` / `?compter=1` (localStorage `umami.disabled`) ; rapport du lundi : nouveaux abonnés séparés des renouvellements, lignes « encarts vus » et « clics ».
- Validation sur captures : @design GO 7,5, @ux GO 7 (`docs/marrant/audit-conversion-s20/validation-lot1-*.md`) ; contrôles : tsc ×2, lint, Jest 302 suites / 4 614 tests, build. Prod vérifiée (encarts et bloc sur articles du code et de la base, clic → `/parcours/repartie?src=blog-milieu#etape-1` ouverte en lecture libre), IndexNow 200.
- **Thomas** : ouvrir une fois `https://deviens-marrant.fr/?ne-pas-compter=1` sur chacun de ses navigateurs (téléphone compris). Mesure avant / après : 4 semaines, cible `blog-cta-clic` ≥ 3 % des vues de l'article n°1 et `abonnement-vu` ×2.

## s20 Rapport du lundi : section « Parcours » réparée, **DÉPLOYÉ le 13/10/2026, version `d2bdace2-ee72-418f-b4ca-67cc4466aa28`, commit `82b47e83`** ; N-1 `11601326`

- Le rapport du 12/10 (bien envoyé à 07:01 Paris, verrou `weekly-visits-report-2026-10-12`) affichait « Section partielle » : `src/lib/analytics/weekly-parcours.ts`, paramètre non typé suivi de `- interval '28 days'` lu comme un intervalle par Postgres (erreur 42883). Correctif : `${startAt}::timestamp`. Reproduit puis validé en lecture seule sur Neon ; les 7 requêtes de la section rejouées sur la prod via l'API HTTP : OK. Test `weekly-parcours-sql-s20.test.ts`. tsc ×2, lint, build OK. Rien à lancer : prochain envoi lundi 19/10 07:00 Paris.

## s20 Fiches Boulot Haroun et Marina Rollman + méta vidéo sans guillemet orphelin, **DÉPLOYÉ le 13/10/2026, version `11601326-dc68-4a1a-8332-07a110ad8f86`, commit `5bc40319`** ; N-1 `1d420fa8-8f6f-4978-ac19-c6d79d256801`

- `src/data/video-content-s20.json` : fiches 28 (Haroun, `qdqIc-uzdbA`, AUTODERISION) et 29 (Marina Rollman, `m30qZa8p_Js`, TIMING) ajoutées (89 fiches), texte de `docs/copy/corrections-videos-s20-boulot.md`, validé à l'aveugle (Haroun au tour 7, Rollman au tour 12, 3/3 ; clé `docs/copy/relecture-videos-s20/cle-boulot-tours6-12.md`). Déployé en `1d420fa8` (commit `0a0ff963`, N-1 `8ce0accc`) ; startup-tasks lancé à 100 % du trafic : « contenus vidéo s20 v1 : 2 fiche(s) mise(s) à jour, 0 refus garde-fou, 87 déjà faite(s) », durées « 89 déjà faite(s) ». Base vérifiée en lecture seule (titre, chaîne, catégorie, exercice). Rollman change de slug : l'ancien `marina-rollman-jcc-8e-saison-cmmp8p1tw0` redirige en 308.
- `src/lib/seo-meta.ts` (`fitDescription`) : une phrase qui finit dans une citation garde son » ; une coupe au mot tombée dans une citation s'arrête avant le «. Seule la méta de Haroun change sur 149 (119 vidéos + 30 articles). Test `video-meta-155-s20.test.ts` (2 cas + contrôle d'équilibre des guillemets sur tout le JSON). tsc ×2, lint, Jest 300 suites / 4600 tests, build OK. Pages vérifiées, IndexNow 200.
- Rattrapage : la fiche Vérino (id 2, `rldvVgHQSvo`) a été déployée plus tôt le 13/10 en `8ce0accc-1d9b-4e9a-961c-ecd5726aa72b` (startup : 1 fiche mise à jour, 86 déjà faites).

## s20 Vannes d'exemple d'`/anatomie-vanne`, « école », porte G-J3 (décision Thomas « toutes recos » 13/10), **DÉPLOYÉ le 13/10/2026, version `a7d1779a-c160-4e76-94d6-a57815311eca`, commit `e8ce433f`** ; pages vérifiées (nouvelles vannes en ligne, anciennes absentes, « école » absent) ; IndexNow 200 ; N-1 `07c24e84-873d-48fa-9207-6fad53c0a987`

- Vanne 1 (Observation) : « Chaque matin, mon père m'envoie une fleur qui scintille avec « Bonne journée ». / Un matin sans réponse, il a appelé ma voisine. » ; vanne 4 (Double sens) : « Il paraît qu'il faut savoir poser ses limites. » → « J'ai planté un panneau 30 devant chez moi. Personne n'a ralenti. » Écrites pour l'occasion, choisies à l'unanimité à l'aveugle (3/3) parmi 3+3 candidates.
- « école » retiré de `llms-content.ts` et de la FAQ `/blague-du-jour` (liste « boulot, couple, soirées, famille, gaming »).

## s20 Porte G-J3 du générateur, **non commité, non déployé**

- Décision Thomas 13/10 : G-J3 vise le grille-pain qui parle tout seul (objet inanimé qui parle sans raison), plus les objets dont c'est la fonction de parler ou répondre (assistant vocal, GPS, appli, répondeur), alignée sur le texte public de `/vannes`. `src/lib/ai/agents/standup-director-agent.ts` : libellé de la porte (« G-J3 Pas d'objet inanimé qui parle tout seul ») + raison + ligne du prompt de validation des vannes. Tests : `ai-agents.test.ts` (libellé), nouveau cas dans `ai/joke-prompt-v7.test.ts`. Code seul, rien à lancer après déploiement.
- Recos validées par Thomas (13/10) : (1) critère du générateur `src/lib/ai/agents/joke-agent.ts` (ligne 130) aligné : « ❌ GRILLE-PAIN QUI PARLE TOUT SEUL », assistant vocal, GPS, appli, répondeur non visés ; reste du prompt inchangé. (2) « télé » retirée de la liste de détection de G-J3 (« La télé dit qu'il va pleuvoir » passe, « Un stylo dit à un crayon » toujours refusé). Tests ajoutés dans `ai/joke-prompt-v7.test.ts`. Contrôles (13/10, après les 2 recos) : 2 `tsc` OK, lint OK (1 avertissement préexistant `admin/page.tsx`), Jest sans secrets Stripe 300 suites / 4598 tests OK, build OK.

## s15 (13/10/2026, ~10:30 Paris) : décryptages des 2 vannes de l'échange C10 en base, **RIEN À DÉPLOYER**

- `Joke` `cv1105a3e91c7d42b8f06d5e1` (V1-1-05, « La conséquence démesurée ») et `cc10n1b7d24e8a59f3c61047a` (C10 n°1, « Le recadrage optimiste ») : `comedyTechnique`, `techniqueExplanation`, `howToApply` écrits (UPDATE ciblé id + champs vides), textes de @copywriter (`docs/social/vague-v1/decryptages-v1-1-05-c10-1.json`), même format que P0-072. Fiche en ligne vérifiée : plus de « Décryptage à venir ».

## s15 : échange C10 des LinkedIn du 20/10 et 27/10 @fullstack, **RIEN À DÉPLOYER** (13/10/2026)

- Décision : `docs/social/preparation/aveugle-c10-linkedin-resultat.md`, « Révision du 12/10 ». Écriture en base Neon, une transaction (4 lignes, 1 chacune), via `@neondatabase/serverless`, script temporaire supprimé.
- **Catalogue** (`Joke`, BOULOT, ONE_LINER, `isActive`, `GARDER`, `copyReviewVersion` 1, `generatedByAI` false, mot pour mot) : V1-1-05 `cv1105a3e91c7d42b8f06d5e1`, C10 n°1 `cc10n1b7d24e8a59f3c61047a`. **Décryptage vide** (technique, explication, « À toi de jouer ») : aucun texte relu disponible, rien inventé ; à fournir par @copywriter comme pour P0-072 / P0-041 (sinon le site affiche « Décryptage à venir » sur ces 2 vannes). Hors `POOL_STRICT` (ajout = déploiement, à décider).
- **20/10 06:15 UTC, `c9892ac953d655704e63e7fb1`** (`[variante:image]`) : avant V107 `cs14jk90226d6abb90287724` « Ma mère me demande encore des nouvelles de mon ex. » ; après V1-1-05, `threadParts` [amorce, chute], texte en 2 lignes « » (R6), envoyé = l'amorce seule (85 car.), `imageUrls` = `/api/social/image?postId=c9892ac953d655704e63e7fb1&slide=0`.
- **27/10 07:15 UTC (08:15 Paris), `cd9b63b6e046d4e8b536d59b9`** (`[variante:texte]`) : avant tondeuse `cs14jkd11f7913f8177df395` ; après C10 n°1, 2 lignes « », `threadParts` et `imageUrls` vides.
- WHERE de chaque UPDATE : id + `APPROVED` + ancien `sourceId` + texte exact relu juste avant. Heures, marqueurs, `approvedBy` (`thomas-s15`), statut inchangés ; `directorNote` : marqueur conservé, mention « TIRAGE » remplacée par l'origine de l'échange.
- **Contrôles** : `checkPost` (R6, LinkedIn) et `vanneLinkedInImage` OK avant écriture ; comptes 19/10 au 15/11 identiques avant/après (X 19 APPROVED + 20 REJECTED, Instagram 19 + 16, LinkedIn 8 APPROVED) ; registre des 90 jours (`loadLotInputs` : `sourceId` hors REJECTED/FAILED) : V107 et la tondeuse n'ont plus aucun post, de nouveau tirables ; carte en ligne : 200, `image/png`, 1080×1350, « J'ouvre l'agence de Lyon lundi. » entre « », rien de rogné (`cache-control` 24 h, sans effet au 20/10).
- Code : note V107 (« 7,5 / 7,5 au C10, ne plus tirer sur LinkedIn sans relecture ») en commentaire dans `src/config/social-pool.ts` ; commentaire seul (le parseur de notes garde 8,5 / 8,5), non bloquant pour le script de lot. tsc, lint, build OK ; Jest 4 567 PASS.
- Retour arrière : UPDATE des 2 posts vers l'ancien texte (`content`, `hook`, `threadParts`, `imageUrls`, `sourceId`, `directorNote` « [variante:…] Lot relance-s15 (VANNE, TIRAGE) ») puis `DELETE FROM "Joke"` des 2 ids.

## s20 Audit des pages, lot 1 + tour 2 + titre du bloc des offres, **DÉPLOYÉ le 13/10/2026, version `07c24e84-873d-48fa-9207-6fad53c0a987`, commits `cc6f96b0` et suivant** ; pages vérifiées en ligne (titre « Pour t'y mettre, il y a Premium », 0 coaching, listes de situations à 5, Waly Dia, titres sans tiret) ; IndexNow 200 (12 URL) ; N-1 `dbc25485-463b-44ca-80aa-8b1ede9300c5`. **Action Thomas : désactiver l'événement Calendly de 45 min (coaching) et vérifier s'il y a eu des réservations.** Vannes 1 et 4 de `/anatomie-vanne` inchangées (remplaçantes du catalogue refusées à l'aveugle)

- Code seul, aucune migration, aucune tâche de démarrage, aucune variable d'env, aucune écriture en base. 37 fichiers de `apps/web/src` modifiés + 1 test ajouté (`coaching-retire-s20.test.tsx`). Détail ligne par ligne : `docs/copy/application-pages-site-s20.md`.
- Retouches de mots validées à l'aveugle (2 sur 3) de `docs/copy/corrections-pages-site-s20.md` §1-§7 : 34 remplacements exacts (34 items J). Non appliqués : J10, J20, J29, J30, J32, J39, J40, J41, J43 (en reprise), AN2 (vanne 1 à remplacer), §11.
- Graphie « autodérision » (§8) : 15 emplacements + test `feature-cards`.
- Retouches à 0 mot : tirets cadratins des titles `/blog` et `/a-propos` et du JSON-LD FAQ `/a-propos`, « … », « 100 % », guillemets « » des devises du quiz, casse des 3 H2 de `/anatomie-vanne`, lien du glossaire vers `/parcours/storytelling`.
- **Offre coaching à 99 € retirée** (décision Thomas) : bloc de `premium-cta.tsx` (lien Calendly), ligne tarif de llms.txt, mention dans le prompt du générateur marketing. Il n'existait ni produit Stripe ni route de paiement pour le coaching (réservation Calendly externe) : rien à désactiver côté Stripe ni en base. **Avant mise en ligne** : le H2 du bloc « Deux façons de t'y mettre » ne présente plus qu'une offre, nouveau texte à faire relire à l'aveugle (voir rapport). Désactiver aussi l'événement Calendly `contact-deviens-marrant/45min` côté Calendly (Thomas).
- `homepageFaqs` supprimé (code mort) ; replis JSON-LD inventés 50 (`/conseils`) et 60 (`/videos`) retirés (base KO = `numberOfItems` omis) ; prix écrits en dur branchés sur `PREMIUM_PRICE_LABEL` (`/a-propos`, `/parcours`, `/glossaire`, FAQ prix, llms.txt, paywall mobile, quiz d'accueil), même texte affiché.
- Contrôles (13/10) : `tsc -p tsconfig.build.json` OK, `tsc` complet OK, `npm run lint` OK (1 avertissement préexistant `admin/page.tsx`), Jest sans secrets Stripe 300 suites / 4596 tests OK, `npm run build` OK.
- Pour déployer : commit, CI verte, puis déploiement normal (rien à lancer après). IndexNow conseillé sur `/`, `/vannes`, `/conseils`, `/videos`, `/a-propos`, `/blog`, `/glossaire`, `/anatomie-vanne`, `/quiz-humour`, `/parcours`, `/abonnement`.

## s20 Articles : FAQ timing et numéros des H2 (décisions Thomas 13/10), **DÉPLOYÉ le 13/10/2026, version `dbc25485-463b-44ca-80aa-8b1ede9300c5`, commit `2d4c350c`** ; journal « contenus vidéo s20 v1 : 2 fiche(s) mise(s) à jour, 0 refus garde-fou, 84 déjà faite(s) » ; pages vérifiées ; N-1 `76cf42da-6e83-499b-8c53-b3e34f237bf7`

- `timing-humour` : réponse FAQ « Comment améliorer son timing comique ? » réécrite (une seconde environ, trois exercices distincts ; relecture à l'aveugle 3/3).
- `comment-faire-rire-une-fille` et `comment-faire-rire-un-homme` : numéros « 2. », « 3. »… retirés des 8 H2 (mécanique, aucun lien ne vise ces ancres).
- Fiches vidéo Karim Duval (24) et Azencot (56) ajoutées à `video-content-s20.json` (tour 7 validé à 2 sur 3) : la tâche les applique au prochain appel (84 déjà faites).
- Paragraphe Waly Dia (`confiance-humour-apres-rupture`) : encore sous la barre, texte en ligne inchangé.

## s20 Durées réelles des fiches vidéo, **DÉPLOYÉ le 13/10/2026, version `dbc25485-463b-44ca-80aa-8b1ede9300c5`** ; journal « durées vidéo s20 v1 : 89 corrigée(s), 0 refus garde-fou, 0 déjà faite(s), 0 absente(s) » ; JSON-LD vérifié (Barré `PT2H26M19S`) ; IndexNow 200 (92 URL) ; N-1 `76cf42da-6e83-499b-8c53-b3e34f237bf7`

- Les 89 `Video.duration` en base sont fausses (estimations arrondies du seed, ex. `PT68M00S` pour 1 h 17). Vraies durées lues le 13/10 via l'API YouTube Data v3 : `src/data/video-durations-s20.json` (89 entrées, généré par la session, ne pas éditer à la main).
- Nouvelle tâche de démarrage `applyVideoDurationsS20Task` (`src/lib/video-durations-s20.ts`), branchée APRÈS `applyVideoContentS20Task` (le JSON porte le nouvel id Dany Boon `JNo86HEt86w`). Garde-fou : écriture seulement si `duration` en base === `attendu`, sinon refus « GARDE-FOU » sans écriture ni marqueur. Marqueur `video-duration-s20:v1:<youtubeId>` et `note.before.duration` posés dans la même transaction, une par vidéo. Non bloquante.
- JSON-LD `VideoObject` : `duration` transmise seulement si ISO 8601 valide (`lib/video-duration-format.ts`), heures comprises (`PT2H26M19S`). La durée n'est affichée nulle part ailleurs ; ancien `formatDuration` de `videos-grid.tsx` (code mort, qui aurait rendu `PT1H9M56S` en « 1:9:56 ») supprimé.
- Simulation prod en lecture seule (13/10) : **89/89 passent le garde-fou**, 0 refus, 0 absente, 0 déjà faite. 30 vidéos inactives hors JSON, non touchées.
- Après déploiement (attendre que la nouvelle version serve 100 % du trafic) : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`). Attendu dans le journal : « durées vidéo s20 v1 : 89 corrigée(s), 0 refus garde-fou, 0 déjà faite(s), 0 absente(s) » (la tâche ajoute environ 45 à 50 s, une transaction par vidéo). 2e appel : « 0 corrigée(s), …, 89 déjà faite(s) ». Si l'appel répond en quelques secondes sans cette ligne, voir le point « 1er appel à 4 s » du handoff s20 avant de relancer.
- Retour arrière base : SQL en tête de `video-durations-s20.ts`, en gardant les marqueurs.

## s15 (13/10/2026, 08:31 Paris) : LOT 1b INSÉRÉ en base (19/10 au 15/11), **RIEN À DÉPLOYER**

- Avant : `lot-1b.json` identique à `e7caadb` (sha256 `2268b3d9…`) ; replis du 1a REJECTED (`c92df7ca8db3e3ef8cdd36470` IG 12/10, `cb2cb272487d56bb82eff560f` LinkedIn 13/10), 0 FAILED au 1a ; V7 : `premier-message-drole-appli-de-rencontre` = 18 messages, `publishedAt` 29/10 05:00 UTC ; 0 APPROVED préexistant sur la tranche (36 REJECTED anciens).
- Commande (depuis `apps/web`) : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15 --json ../../docs/social/preparation/lot-1b.json --insert --driver=neon-http` : « Inséré : 46 posts APPROVED (thomas-s15) ; contrôle après insertion : conforme (par réseau et par semaine) ».
- Après : X 19, Instagram 19, LinkedIn 8 APPROVED ; 0 doublon de créneau depuis le 12/10 ; 1a inchangé (9 APPROVED, 3 PUBLISHED, 2 REJECTED) ; réseaux ouverts, canaux `ok`.
- Retour arrière (borné) : même commande avec `--rollback --debut 2026-10-19 --fin 2026-11-15 --confirmer` (sans `--json`/`--insert`).
- Suite : échange C10 des LinkedIn du 20/10 et 27/10 (07:30 UTC) ; remplacements issus de l'audit qualité (`docs/social/audit-qualite-12-10.md`) sur décision de Thomas, par UPDATE ciblé avant chaque date.

## s20 Contenus des fiches vidéo (duel s11 14/14, corrections relues à l'aveugle en 5 tours), **DÉPLOYÉ le 12/10/2026, version `76cf42da-6e83-499b-8c53-b3e34f237bf7`** ; journal « contenus vidéo s20 v1 : 84 fiche(s) mise(s) à jour, 0 refus garde-fou » (au 2e appel de `startup-tasks`, le 1er s'était arrêté avant la tâche) ; base : 84 marqueurs ; pages : 84/84 au nouveau texte, 8 anciennes URL en 308, méta 111-155 car. ; IndexNow 200 (84 URL), Bing SubmitUrlBatch refusé (quota du jour 76) ; N-1 `a4058f12-8409-4c1e-a890-ee93ff67b9c2`

- Nouvelle tâche de démarrage `applyVideoContentS20Task` (`src/lib/video-content-s20.ts`), branchée après `stripVideoEmDashesTask`, hors `catalogue-content` (version inchangée). Elle applique `src/data/video-content-s20.json` fiche par fiche : description, 4 enseignements, exercice, et selon la fiche titre (8), chaîne (21), catégorie (6), `youtubeId` (fiche 68 : `U80fwIfPC4M` vers `JNo86HEt86w`).
- Garde-fou : empreinte sha256 du texte en base égale à `attendu`, sinon refus « GARDE-FOU » sans écriture. Marqueur `video-content-s20:v1:<youtubeId d'origine>` et `note.before` posés dans la même transaction.
- Méta, OG et Twitter des fiches vidéo limitées à 155 caractères (`buildVideoMetaDescription`, `lib/seo-meta.ts`).
- **84 fiches** (86 moins Karim Duval id 24 et Azencot id 56, descriptions encore sous la barre au tour 5 : texte en ligne inchangé, tour 6 à part). Simulation prod en lecture seule : 84/84 passent le garde-fou ; 2e passage : 0 mise à jour.
- Après déploiement : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`). Attendu : « contenus vidéo s20 v1 : 84 fiche(s) mise(s) à jour, 0 refus garde-fou, 0 déjà faite(s) ». Puis IndexNow sur les 8 fiches renommées (anciennes URL en 308).
- Retour arrière base : SQL en tête de `video-content-s20.ts`, en gardant les marqueurs. Détails, impacts et durée de la fiche 68 à décider : `docs/copy/application-videos-s20.md`.

## s20 Audit des articles du code (corrections validées à l'aveugle), **DÉPLOYÉ le 12/10/2026, version `a4058f12-8409-4c1e-a890-ee93ff67b9c2`, commit `242477ce`** ; prod : 24 articles en 200, 0 ancien passage, 0 intertitre à tiret, 0 ancre cassée ; IndexNow 200, Bing SubmitUrlBatch 200 ; N-1 `124265e9-1eaf-42f1-935e-feb04061f66f`

- `blog-articles.ts` : 166 remplacements exacts (partie 1, partie 2, C1-C3 de `docs/copy/application-audit-code-s20.md`) + 49 intertitres « — » → « : » / « , » ; 24 articles, `updatedAt` 2026-10-12 ; diff réel au §5 du même fichier (3,8 % des mots).
- Libellés de lien vers `/blog/timing-humour` alignés sur le titre réel « Timing humour : le secret de la blague » (6 liens, dont 4 hors audit : mécanique, 0 mot ajouté).
- Part aussi avec le correctif alt OG / manifest (e4b32aae, non encore déployé).
- Statique, rien en base : prend effet au déploiement, aucune tâche de démarrage. Après déploiement : IndexNow sur les 24 slugs.
- Ancres H2 changées (aucun lien ne les vise) : `#3-sketches-decortiques` → `#3-exemples-decortiques`, `#technique-2-la-regle-des-3-secondes-reponds-avant-de-reflechir` → `#technique-2-reponds-sans-trop-reflechir`.

## s20 Tirets cadratins des fiches vidéo + llms-full.txt (décision Thomas 12/10), N-1 `f9e7ebd8-4cf6-4ac5-8c99-f3ee40225fd7`, **DÉPLOYÉ 12/10 12:49 UTC version `124265e9-1eaf-42f1-935e-feb04061f66f`**

- Nouvelle tâche de démarrage `applyVideoEmDashTask` (`src/lib/video-em-dash.ts`, hors tâche catalogue) : `stripEmDashes` sur description / technique / exercise / enseignements, marqueur `video-em-dash:v1:<youtubeId>`, `note.before`. Simulation prod en lecture seule : 52 fiches, 170 tirets, 0 mot changé.
- Gabarit méta vidéo « Chaîne : description » (était « — »), `llms-full.txt` sans tiret dans le texte produit.
- Part avec la sécurisation du catalogue (entrée ci-dessous).
- Après déploiement : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`), attendu « tirets cadratins vidéos v1 : 52 fiche(s) corrigée(s) (170 tiret(s)) ». Retour arrière base : SQL en tête de `video-em-dash.ts`.

## s20 Sécurisation du catalogue (décision Thomas 12/10 : ne rien changer en ligne), déployée avec le lot « tirets vidéo »

- Seeds alignés sur la base de prod : `blagues-seed.json` 264 → 80 (6 actives alignées, 184 inactives retirées), `conseils-seed.json` 69 → 38 (9 alignés, 31 inactifs retirés). `videos-seed.json` inchangé.
- Garde-fou `catalogue-content` (`startup-tasks.ts`) : réécriture seulement si la ligne porte encore le texte remplacé (`previousContent` / `previousTitle`), sinon refus « GARDE-FOU » sans écriture ; écritures vidéo et parcours retirées. Rejoué en lecture seule sur la prod : 0 écriture.
- Seed de dev (`seed-guard.ts`) : refus si la base contient un utilisateur ou un `DataPatch`, sauf `MARRANT_SEED_CONFIRM_HOST` = hôte exact.
- Prend effet au prochain déploiement (part avec le lot suivant).

## s20 Petit lot final (pause, règle 3-2-1, 3 métas, « 2,99 € »), **DÉPLOYÉ le 12/10/2026 à 12:18 UTC, version `f9e7ebd8-4cf6-4ac5-8c99-f3ee40225fd7`** ; « réécritures blog v5 : 9 appliquée(s) » ; HTML vérifié (pause une seconde, 3-2-1 absent, 0 « EUR ») ; N-1 `cd7a93c3-e9ad-4841-96e4-561916da4035`

- `blog-article-rewrites.json` `_meta.version` 4 → 5 : pause « d'une seconde » (`techniques-humoristes-pros`), encadré CLEF du critère #3 en trois temps sans règle 3-2-1 inventée (`blague-drole-7-criteres-pepite`), 3 métas ≤ 155 (150, 145, 152). Relus à l'aveugle (A B C E 3/3 ; D réécrit puis 2/2) : `docs/copy/lot-final-s11-s20*.md`, `docs/copy/relecture-corrections-s11/verdicts-*-lot-final.md`.
- `blog-articles.ts` : « 2,99 EUR/mois » → « 2,99 €/mois » (19 articles statiques, diff Git prouvé).
- Après déploiement : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`), attendu « réécritures blog v5 : 9 appliquée(s) ». Retour arrière JSON : commit `5d6225c4` (v4) republié en version 6.

## s20 Correctif `scripts/infra/copie-replit-neon.py` (outil local, **rien à déployer**)

- `--reset` refuse par défaut (code 2) si la cible a des tables non vides absentes de la source (`DataPatch`…) ; options `--purge-target-only-tables`, `--keep-target-only-tables=A,B`, `--dry-run`. `--verify` contrôle aussi ces tables et hache `BlogArticle`/`Joke`/`Tip` ligne à ligne. Détail : `docs/qa/diagnostic-base-vs-s11-s20.md` §5 ; tests : `scripts/infra/test_copie_replit_neon.py` (Postgres local).

## s20 Corrections de la version s11 (32 passages validés à l'aveugle, 2 sur 3), **DÉPLOYÉ le 12/10/2026 à 11:15 UTC, version `cd7a93c3-e9ad-4841-96e4-561916da4035`**, N-1 `ac0c937d-2550-4bd2-8a61-55c93349cded` ; journal « réécritures blog v4 : 9 appliquée(s) » ; HTML : 9 articles en 200, 0 tiret, Stanford absent, étude Wharton/HBS présente, « L'heure d'arrivée » en ligne ; excerpt de `comment-raconter…` sans tiret

- `blog-article-rewrites.json` `_meta.version` 3 → 4 : `applyBlogArticleRewritesTask` réapplique les 9 articles (32 corrections de `docs/copy/corrections-s11-s20.md` : §4, et §9 pour C, F, G, R, AE, N ; diff au §10). Le JSON ne contient plus aucun « — » hors titres (`stripEmDashes` appliqué à la source) : `BLOG_EM_DASH_PATCH_VERSION` reste à 3.
- `blog-liens-s4-s20.ts` : chaînes de l'appariement 10 alignées sur C07 (tâche toujours non branchée, aucun effet en base).
- Après déploiement : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`). Attendu : « réécritures blog v4 : 9 appliquée(s) », aucune ligne « tirets cadratins » (rien à retirer). Vérifs HTML : « Wharton School », « Exemple dans la veine de Fary », « L'heure d'arrivée » présents ; « Stanford », « 90% », « CLEF FINALE » absents ; 0 « — » dans le corps.
- Retour arrière : le marqueur `blog-rewrite` ne garde pas l'ancien texte. Remettre le JSON du commit `d8c819d8` (version s11 v3) en `_meta.version` 5, puis le rejeu des tirets (`BLOG_EM_DASH_PATCH_VERSION` 4) ; ou rollback Worker (ne restaure pas la base).

## s20 Version s11 des 9 articles mise en ligne (duel à l'aveugle 9/9, décision Thomas 12/10), **DÉPLOYÉ le 12/10/2026 à 10:41 UTC, version `ac0c937d-2550-4bd2-8a61-55c93349cded`** ; journal : « réécritures blog v3 : 9 appliquée(s) », « tirets cadratins blog v3 : 6 article(s) corrigé(s) (59 tiret(s)) » ; HTML : 9 articles en 200, 0 tiret, 5 liens S4 présents ; N-1 `a8ac0a07-e453-4a08-bf46-b9393a0d130c`

- `blog-article-rewrites.json` `_meta.version` 2 → 3 : `applyBlogArticleRewritesTask` réapplique les 9 articles (metaDescription + content s11, avec les 5 phrases S4 validées 2, 8, 10, 11, 12) ; `BLOG_EM_DASH_PATCH_VERSION` 2 → 3 (59 tirets de la version s11 retirés, titres exclus).
- Après déploiement : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`). Attendu : réécritures v3 9 appliquées, tirets v3 sur les articles concernés.
- Retour arrière : texte « en ligne » d'avant = fichiers `docs/copy/duel-s11-s20/<slug>-version-N.md` (clé `CLE-ne-pas-ouvrir.json`), et `DataPatch` `blog-em-dash:v2:<slug>` (`note.before`) pour 6 articles ; rollback Worker : `npx wrangler rollback a8ac0a07-e453-4a08-bf46-b9393a0d130c` (ne restaure pas la base).
- Suite : passe de corrections (chiffres non sourcés « Stanford », « 90 % », phrases sous la barre, 2 métas) relue à l'aveugle avant mise en ligne.

## s20 Tirets cadratins des 9 articles s11 (décision Thomas 12/10), **DÉPLOYÉ le 12/10/2026 à 10:02 UTC, version `a8ac0a07-e453-4a08-bf46-b9393a0d130c`** ; tâche lancée : « tirets cadratins blog v2 : 6 article(s) corrigé(s) (88 tiret(s)) » ; HTML des 9 articles : 0 tiret ; N-1 `e50059e3-b154-4073-84df-307016008b5b`

- Cause (`docs/qa/diagnostic-base-vs-s11-s20.md`) : la copie Replit → Neon du 30/09 (`copie-replit-neon.py --reset`) a remis `BlogArticle` à l'ancien contenu sans vider `DataPatch` : refonte s11 et retrait des tirets perdus, marqueurs conservés.
- Correctif : `BLOG_EM_DASH_PATCH_VERSION` 1 → 2 (`startup-tasks.ts`) : retrait des « — » du corps des articles publiés, titres exclus, aucun mot changé, contenu d'avant dans `DataPatch.note.before`.
- Après déploiement : `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`). Retour arrière base : `UPDATE "BlogArticle" b SET content = (d.note::json->>'before') FROM "DataPatch" d WHERE d."patchId" = 'blog-em-dash:v2:' || b.slug;`
- **À corriger avant toute réutilisation** : `copie-replit-neon.py` (`--reset` ne vide pas `DataPatch`, `--verify` ne voit que les tables de Replit).
- Suite (décision Thomas) : duel à l'aveugle ancienne version contre s11, article par article.

## s20 Maillage S4, liens contextuels (@copywriter, relecture à l'aveugle 3 tours, @fullstack), **DÉPLOYÉ le 12/10/2026 à 09:33 UTC, version `e50059e3-b154-4073-84df-307016008b5b`** (4 liens vérifiés en prod), N-1 `fffd731b-8355-4c04-a839-00cc0aa1945d`

- **Déployé : 4 phrases statiques** (`src/lib/blog-articles.ts`, appariements 1, 5, 7, 14 de `docs/copy/liens-s4-s20.md`), validées par les deux relecteurs ; diff 0,98 à 1,51 % de mots ajoutés, 0 retiré (§8). `updatedAt` 2026-10-12 sur les 4 articles.
- **Non branché : 5 phrases des articles en base** (2, 8, 10, 11, 12). Lecture seule du 12/10 : le contenu en base diffère du JSON de la refonte s11 (chaînes « avant » absentes, tirets cadratins encore présents) alors que les marqueurs `blog-rewrite:v2:*` sont posés depuis le 29/09. Tâche `applyBlogLiensS4S20Task` (`src/lib/blog-liens-s4-s20.ts`) gardée mais non appelée par `runStartupTasks` ; phrases reportées dans `blog-article-rewrites.json` (`_meta.version` inchangé). À rebrancher après ré-ancrage sur le texte réel (et diagnostic de l'écart base / s11).
- Retirés après relecture : 3 et 9 (tour 3), écartés à la lecture : 4, 6, 13.
- Aucune variable, migration ni ressource. Commande : celle de s19. Rollback : `npx wrangler rollback fffd731b-8355-4c04-a839-00cc0aa1945d`.

## s20 Maillage S3 accueil (@fullstack, relu @design @ux 10/10 au tour 3), **DÉPLOYÉ le 12/10/2026 à 08:52 UTC, version `fffd731b-8355-4c04-a839-00cc0aa1945d`**, N-1 `ab4b458b-636f-4747-b183-54d6518c4855` (rollback : `npx wrangler rollback ab4b458b-636f-4747-b183-54d6518c4855`). Vérifié en prod : liens `/parcours/storytelling` et `/parcours/boulot`, bloc « Derniers articles » (se-presenter-avec-humour, blagues-halloween-soiree-deguisee, jeu-de-mots-drole-techniques-creer), pilier exclu ; accueil servi en ancienne version ~1 min après le déploiement (ISR 300 s, stale-while-revalidate), puis à jour.

- **S3a** : sous les 3 cartes personas, « Deux autres parcours : Parcours Storytelling et Parcours Boulot. » (`components/home/autres-parcours.tsx`, liste = `PREMIUM_PARCOURS` hors cartes, liens `/parcours/<slug>` (alignés sur les 3 cartes, relecture ux C1)).
- **S3b** : bloc « Derniers articles », 3 liens titres (`components/home/derniers-articles.tsx`, `lib/derniers-articles.ts` : base visible + statiques, hors pilier, repli statique si la base échoue).
- **ISR accueil** : `revalidate = 3600` (plafond) ; durée effective 300 s (prerender-manifest). Test `accueil-maillage-s3-s20.test.tsx`. Captures : `docs/seo/captures-accueil-s3/`. Aucune variable, migration ni ressource.
- **Commande** : celle de s19 (chaîne Hyperdrive factice sur `build:cf` et `deploy:cf`). **Vérifs** : HTML de `/` contient `href="/parcours/storytelling"` et `href="/parcours/boulot"`, et 3 liens `/blog/` sous « Derniers articles », sans `comment-devenir-drole` dans le bloc.

## s20 Maillage S1, S2, S5 (@fullstack, relu @design @ux 10/10), **DÉPLOYÉ le 12/10/2026 à 07:46 UTC, version `ab4b458b-636f-4747-b183-54d6518c4855`**, N-1 `d344ceb6-b152-4bb0-a903-64ea5969d443`

- **S1** pagination numérotée des listes (`list-pagination.tsx`, `paginationItems`) : toutes les pages liées depuis chaque page de liste (profondeur 13 → 3) ; mobile en grille 2 rangées, chevrons bordés, page courante violette ; retour en haut + focus + annonce « Page N sur Y » (`use-list-page.ts`, `list-results.tsx`).
- **S2** « Dans la même catégorie » en anneau (`related-ring.ts`, `related-catalogue.ts`, `unstable_cache` 1 h par catégorie) : 4 liens entrants par fiche.
- **S5** sitemap : `lastmod` jamais futur, `/blog` = dernier article visible (`sitemap-lastmod.ts`).
- Spec : `docs/seo/maillage-decouverte-s20.md` ; relectures et captures : `docs/seo/captures-maillage-s20/`. Aucune variable, migration ni ressource.
- **Commande** : celle de s19 (chaîne Hyperdrive factice sur `build:cf` et `deploy:cf`). Rollback : `npx wrangler rollback d344ceb6-b152-4bb0-a903-64ea5969d443`.
- **Vérifs** : `/vannes?page=6` contient 11 `aria-label="Page N"` dans le HTML serveur, `?page=13` en 404, fiches avec 4 voisins différents, sitemap sans date future, pages clés en 200.

## s15 (12/10/2026, ~08:30 Paris) : pilotage du J0, vague V1 tour 1, **RIEN À DÉPLOYER**

- Article `se-presenter-avec-humour` en ligne (200) ; 3 réseaux ouverts, canaux `ok` ; alertes B seulement (file basse, lancement 1b, vague V1).
- **Vague V1, tour 1** (`docs/social/vague-v1/`) : 120 candidats (4 lots par thème, format C10), 11 au niveau à l'aveugle chez 2 relecteurs (9,2 %, contre 0,8 % au pilote P0), **6 neuves** au contrôle catalogue (5 écartées : 3 proches en base, 2 déjà vues en ligne). Échantillon D7 à Thomas (`echantillon-d7-v1-t1.md`), délai 14/10 08:00 Paris.
- **LinkedIn 20/10 et 27/10** : départage neuf à l'aveugle ; 20/10 = V1-1-05 (9 / 9), 27/10 = C10 n°1 (3e relecteur) ; échange en base programmé le 13/10 07:30 UTC (consigne mise à jour).
- Programmé : H+45 X 11:15 UTC et Instagram 18:15 UTC ; décision « lien en bio » 15:00 UTC ; insertion du 1b le 13/10 06:30 UTC ; fin D7 et tour 2 de V1 le 14/10 06:15 UTC.

## s20 Correctifs audit Ahrefs du 07/10 (@fullstack @copywriter @infrastructure), **DÉPLOYÉ le 11/10/2026 à 20:24 UTC, version `d344ceb6-b152-4bb0-a903-64ea5969d443`, HEAD `fb5ff6b`**, N-1 `67697811-9f53-4857-84ef-16a82eccefba`

- **robots.txt** : `/register` et `/abonnement?` bloqués pour tous les user-agents (variantes `?callbackUrl=` / `?returnTo=` : 391 noindex, 490 meta longues, ~868 lien entrant unique chez Ahrefs). `/abonnement` nu reste explorable.
- **Meta descriptions** : `/abonnement` ≤ 155 car. avec repli sans compteurs (144 aujourd'hui), `/confidentialite` 147 car. (`docs/seo/meta-descriptions-ahrefs-s20.md`).
- **Open Graph / Twitter** : helpers `websiteOpenGraph` / `websiteTwitter` (`src/lib/seo-meta.ts`) sur `/parcours`, 5 parcours, `/anatomie-vanne`, 7 thèmes, `/blague-du-jour` (og:type, og:image, twitter propres à la page). Test `seo-ahrefs-s20.test.ts`.
- **Vitesse** (`open-next.config.ts`) : `enableCacheInterception: true` + file de revalidation en `waitUntil` (fiches en STALE perpétuel, diagnostic `docs/infra/diagnostic-vitesse-ahrefs-s20.md`). Aucune variable, migration ni ressource Cloudflare nouvelle.
- **Commande** : celle de s19 (point 1 ci-dessous, chaîne Hyperdrive factice sur `build:cf` et `deploy:cf`). Rollback : `npx wrangler rollback 67697811-9f53-4857-84ef-16a82eccefba`.
- **Vérifs après déploiement** : `robots.txt`, balises og/twitter des 15 pages, `x-opennext-cache` et TTFB sur un échantillon de fiches, `sitemap.xml`, `llms.txt`, images OG, 308 des fiches retirées, requête `RSC: 1`, `/abonnement` et `/parcours/boulot` en 200.

## s19 Parcours Boulot (s19) @fullstack, **ACTIVÉ le 11/10/2026 à 15:05 UTC (version `a195f350-a85d-43b1-9ca4-26686b35bd2c`, N-1 `bcd071ca-2c22-4572-a404-c923310c023c`), `BOULOT_PUBLIE = true`, HEAD `7a8058c` de `claude/ouverture-session-nzwj0w`** (déployé masqué le 11/10 à 12:33 UTC, HEAD `977f699`)
> - **SEO après activation (11/10, 18:00 UTC)** : `/parcours/boulot` conforme (title 60 car., description 154, canonical, `index, follow`, OG, H1, JSON-LD Course + BreadcrumbList), hub « 5 parcours » (description 158), sitemap et llms.txt à jour. IndexNow : **502 (429)**, comme en s15 et s18. **Bing `SubmitUrlBatch` : OK**, 4 URL de parcours puis 81 URL (`/conseils` + les 80 fiches conseils modifiées depuis le 08/10 d'après le sitemap, dont les 12 slugs renommés en s18, jamais soumis). Reste : le cron `weekly-seo` du lundi relance IndexNow sur les URL de moins de 8 jours ; Google = Search Console (Thomas). Défaut de marque antérieur : tiret cadratin dans `og:image:alt` par défaut (`src/app/layout.tsx:84`) et dans le nom du manifest (`src/app/manifest.ts:5`).
> - **Correctif `llms.txt` (11/10, après activation)** : `src/app/llms.txt/route.ts` liste Storytelling et Boulot quand ils sont publiés (Storytelling manquait depuis s18) ; test `public-figures.test.tsx`. Redéployer avec la commande du point 1 ; contrôle : `curl -s https://deviens-marrant.fr/llms.txt | grep -c -E 'parcours/(storytelling|boulot)'` (attendu 2).
  - **DÉPLOYÉ le 11/10/2026 à 15:14 UTC** par @infrastructure, depuis l'arbre principal propre (HEAD `9692f6f`, interrupteurs `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE` à true). Déploiement `0e81d31f-ab7c-467d-86a2-fd4dcd54f678`, version `67697811-9f53-4857-84ef-16a82eccefba`. N-1 : déploiement `7af4fc52-4775-414a-861b-9feecacc70fb`, version `a195f350-a85d-43b1-9ca4-26686b35bd2c`. Retour arrière : `npx wrangler rollback a195f350-a85d-43b1-9ca4-26686b35bd2c`. Chaîne du point 1 OK du premier coup (tsc, lint avec 1 avertissement `<img>` déjà connu, build 158 pages, build:cf, deploy:cf). Pas de tâche de démarrage relancée (aucune écriture en base). Contrôles : `llms.txt` → 2, OK (« Parcours Storytelling » et « Parcours Boulot » listés) ; `/parcours/boulot` et `/parcours` 200, OK ; `/api/health` 200, critique `ok`, base `up` (statut global `degraded` déjà là avant : `video` et `llmSuccess` en `stale`), OK.

**ACTIVÉ le 11/10/2026 à 15:05 UTC** par @infrastructure, depuis l'arbre principal propre (`/home/user/Marrant`, HEAD `7a8058c`, aucun worktree). Déploiement `7af4fc52-4775-414a-861b-9feecacc70fb`, version `a195f350-a85d-43b1-9ca4-26686b35bd2c`. N-1 : déploiement `927dcc48-2f2c-4892-bb68-e54f1a138d7c`, version `bcd071ca-2c22-4572-a404-c923310c023c`. Retour arrière : `npx wrangler rollback bcd071ca-2c22-4572-a404-c923310c023c`. Ce déploiement met aussi en ligne les rendus itérations 4 et 5 (jusque-là NON DÉPLOYÉS). Feu vert : `docs/founder-preferences.md` (11/10, « vidéos regardées, activation autorisée ») ; relecture du rendu itération 5 @design 10/10 et @ux 10/10.
- **Chaîne** (commande du point 1, chaîne Hyperdrive factice sur `build:cf` et `deploy:cf`) : tsc OK, lint OK (1 avertissement `<img>` déjà connu), build OK (158 pages, +1 = `/parcours/boulot`), build:cf OK, deploy:cf OK du premier coup.
- **Tâche** (`GET /api/cron/startup-tasks` 200, 8,2 s) : `parcours-boulot:s19-v1:publie=true : conseils 0 mis à jour, 0 créé(s), 6 déjà faits, refusés [] ; vannes neuves 0 créée(s), 10 déjà là ; vannes en ligne : écarts [], generatedByAI (protégées de la relecture IA) [cmoxx7e56003xs60yyooxncw3, cmnl01zwv004ss60y2ecodj9a] ; parcours mis à jour (isActive=true) ; étapes 0 créée(s), 0 mise(s) à jour, conseils absents [] ; vannes d'étape manquantes ou inactives : 0 ; fiches vidéo 0 corrigée(s) [], 3 déjà faites, refusées [].` Conforme.
- **Base (lecture seule, Neon `Neon-Batch-Read-Only`)** : OK. `boulot` `isActive=true`, 6 étapes ; marqueurs `…:publie=false` et `…:publie=true` présents (21 marqueurs `parcours-boulot%` au total) ; 5 parcours actifs (`boulot`, `confiance`, `machine-a-cafe`, `repartie`, `storytelling`), les 4 anciens slugs (`bases-humour`, `maitre-storytelling`, `roi-repartie`, `standup-scene`) toujours inactifs.
- **Site** (1er passage, `x-nextjs-cache: MISS`, pas de vieux cache) :
  - `/parcours/boulot` : 200, OK. `<title>` « Parcours Boulot : oser une vanne sans te griller, 6 semaines », « Étape 1 offerte, étapes 2 à 6 avec Premium », « DÉFI TRACE » présent (2 occurrences).
  - `/parcours` : 200, « 5 parcours », lien `/parcours/boulot`, OK.
  - `/sitemap.xml` : `https://deviens-marrant.fr/parcours/boulot` présent, OK.
  - `/llms.txt` : **KO, sans casse**. Pas de lien `parcours/boulot` : la liste des parcours de `src/app/llms.txt/route.ts` est écrite en dur (Machine à Café, Répartie, Confiance) et Storytelling y manque aussi depuis s18. La ligne Premium dit bien « les 5 parcours en entier ». À corriger par @fullstack (point 3 annonçait Boulot dans llms.txt).
  - `/abonnement` : 200, « 5 parcours en entier », « Boulot (15 min/semaine) », OK.
  - `/parcours/machine-a-cafe`, `/parcours/repartie`, `/parcours/confiance`, `/parcours/storytelling` : 200, OK.
  - `/api/health` : 200, OK. Bloc critique `ok`, base `up`. Statut global `degraded`, déjà là avant : `video` et `llmSuccess` en `stale`.
  - Fin de Machine à Café (vérifié par le code, sans connexion) : classement `['boulot', 'storytelling', 'repartie', 'confiance']` et `pickSuite` prend le premier parcours actif non commencé, donc Boulot est proposé (sauf si un autre parcours est en cours). OK.

**DÉPLOYÉ MASQUÉ le 11/10/2026 à 12:33 UTC** par @infrastructure, depuis l'arbre principal propre (`/home/user/Marrant`, HEAD `977f699`, aucun worktree). Déploiement `927dcc48-2f2c-4892-bb68-e54f1a138d7c`, version `bcd071ca-2c22-4572-a404-c923310c023c`. N-1 : déploiement `e37c6af9-31cf-42d8-9d47-d59ec949f345`, version `151dcc45-45c7-4416-a9d0-074de0757260`. Retour arrière : `npx wrangler rollback 151dcc45-45c7-4416-a9d0-074de0757260`.
- **Chaîne** : tsc OK, lint OK (1 avertissement `<img>` déjà connu), build OK (157 pages), build:cf OK. Premier `deploy:cf` en échec à 12:32 UTC : chaîne Hyperdrive factice absente, rien envoyé, commande du point 1 corrigée. Relancé avec la chaîne : OK.
- **Tâche** (`GET /api/cron/startup-tasks` 200, 19,4 s ; le POST renvoie 405) : `parcours-boulot:s19-v1:publie=false : conseils 4 mis à jour, 2 créé(s), 0 déjà faits, refusés [] ; vannes neuves 10 créée(s), 0 déjà là ; vannes en ligne : écarts [], generatedByAI (protégées de la relecture IA) [cmoxx7e56003xs60yyooxncw3, cmnl01zwv004ss60y2ecodj9a] ; parcours créé (isActive=false) ; étapes 6 créée(s), 0 mise(s) à jour, conseils absents [] ; vannes d'étape manquantes ou inactives : 0 ; fiches vidéo 3 corrigée(s) [m30qZa8p_Js, qdqIc-uzdbA, rldvVgHQSvo], 0 déjà faites, refusées []`. Conforme à l'attendu.
- **Base (lecture seule, Neon `Neon-Batch-Read-Only`)** : OK partout. `boulot` est `isActive=false` avec 6 étapes. Les 6 conseils sont actifs, `generatedByAI` false, le PS en ABSURDE. 10 vannes `cs19jkboulot%` actives. Marqueurs : 20 = global `publie=false` + 6 conseils + 10 vannes + 3 vidéos (le point 2 en attendait 16 + global, sans compter les 3 marqueurs vidéo ajoutés le 11/10). Fiches vidéo : `m30qZa8p_Js` « Marina Rollman - JCC 8è saison » `PT5M08S` ; `qdqIc-uzdbA` « Haroun - Jamel Comedy Club Saison 9 » (durée `PT5M45S` inchangée, comme prévu) ; `rldvVgHQSvo` `PT5M51S`. Les 4 parcours en ligne sont toujours actifs.
- **Site** : contrôles OK, lus au 1er passage après déploiement (`x-nextjs-cache: MISS`, donc pas de vieux cache).
  - `/parcours/boulot` : 404, OK.
  - `/parcours` : « 4 parcours », Storytelling listé, aucun lien `/parcours/boulot`, OK. Les mots « boulot » restants sont antérieurs : quiz « Au boulot… » et texte de l'étape 3 de Storytelling.
  - `/sitemap.xml` (413 URL) et `/llms.txt` : aucun parcours Boulot, OK. Seuls `/vannes/theme/boulot` et le catalogue de vannes y figurent, comme avant.
  - `/api/health` : 200, OK. Bloc critique `ok`, base `up`. Statut global `degraded`, déjà là et sans lien avec ce déploiement : `video` et `llmSuccess` en `stale`.
  - `/parcours/machine-a-cafe`, `/parcours/repartie`, `/parcours/confiance`, `/parcours/storytelling` : 200, OK. Machine à Café affiche bien « étapes 2 et 3 ».

> Détail, décisions et résultats : `docs/marrant/parcours-boulot-s19/implementation.md` ; liste d'import : `docs/marrant/parcours-boulot-s19/import-boulot.md`.
> - **Code** : interrupteur `apps/web/src/config/parcours-publication.ts` (`BOULOT_PUBLIE = false`, à côté de `STORYTELLING_PUBLIE = true`), liste publiée `src/lib/parcours-seed.ts`, tâche de démarrage `src/lib/parcours-boulot-sync.ts` (appelée par `runStartupTasks` après Storytelling), Boulot conditionné dans les slugs, l'offre Premium, le sitemap et la page (`PARCOURS_META.boulot`) ; rendu : `whitespace-pre-line` et `frTypo` (étape ouverte, aperçu verrouillé, bloc « Programme ») ; relecture IA : vannes liées à une étape exclues (`src/lib/parcours-vannes-protegees.ts`, `copy-review-runner.ts`) ; contenu `docs/content/parcours-boulot-s19.json` ; `conseils-seed.json` ; classements `"pro"` renommés `"boulot"`.
> - **Base** : aucune migration, aucune variable. Toutes les écritures passent par la tâche de démarrage (idempotente, marqueurs `DataPatch` `parcours-boulot:s19:*`, état d'avant complet dans `note`).
> - **Fiches vidéo (ajout du 11/10, même tâche, indépendant de l'interrupteur)** : titre et durée seulement, si la base a encore l'ancienne valeur : `m30qZa8p_Js` → « Marina Rollman - JCC 8è saison » / `PT5M08S` ; `qdqIc-uzdbA` → « Haroun - Jamel Comedy Club Saison 9 » ; `rldvVgHQSvo` → `PT5M51S`. Contrôle : `SELECT "youtubeId", title, duration FROM "Video" WHERE "youtubeId" IN ('m30qZa8p_Js','qdqIc-uzdbA','rldvVgHQSvo')`. Retour arrière : titre et durée d'avant dans `note` des marqueurs `parcours-boulot:s19:video:<youtubeId>`.
> - **Effet visible au déploiement, interrupteur à false** : (1) 4 conseils en ligne remplacés ou réactivés avec le texte validé (`cmmw0tqkc000smw62bo1yfeyg` PS, passé en ABSURDE ; `cmmw0tr870014mw62jnung2qp` couloir ; `cmmw0trc60016mw629l4o8rav` afterwork ; `cmmw0tra60015mw62l0360wm9` networking), `generatedByAI = false` ; (2) 2 conseils créés (`cs19tipboulot1` « Ce que raconte une salle de réunion », `cs19tipboulot6` « Le toast de soixante secondes qui tient debout ») ; (3) 10 vannes neuves BOULOT actives (`cs19jkboulot1` à `10`) ; (4) parcours `boulot` créé `isActive = false` et ses 6 étapes. Les conseils et vannes sont donc au catalogue dès ce déploiement (même choix qu'en s18) ; `/parcours/boulot` reste en 404, absent du hub, de l'offre, du sitemap, de llms.txt, des fiches et du quiz.
> - **Rendu itération 2 (11/10, après relecture @design 8,6 et @ux 7)** : `src/lib/parcours-data.ts` (repli seed : conseil, exemple et défi lus dans le fichier de contenu, Boulot et Storytelling), `src/lib/parcours-preview.ts` (`estRepliSeed`), `src/components/parcours/parcours-detail.tsx` (visiteur sur HTML de repli = relecture de l'API ; en-tête « 6 semaines · 15 min/semaine » ; argumentaire après le programme pour un abonné en cours ; plus de barre au-dessus de la carte de fin ; typographie de l'accroche), `parcours-content.tsx` (typographie de la carte du hub), `parcours-step-card.tsx` (défi et exemple, Storytelling et Boulot ; « Lecture libre » au visiteur seulement), `step-blocks.tsx` (corps des aperçus), `src/lib/fr-typo.ts` (`frTypoTexte`). Aucune migration, aucune variable, aucune écriture en base. Effet visible dès le déploiement sur les **parcours en ligne** (en-tête, aperçus, accroche, badge, ordre de l'abonné, fin de parcours). Purge du cache à l'activation : non nécessaire (le HTML de repli porte désormais l'étape 1 entière, `revalidatePath` est sans effet sur OpenNext). Détail : `docs/marrant/parcours-boulot-s19/implementation.md`, section « Rendu itération 2 ».
> - **Hub `/parcours` (11/10, défauts vus sur les captures de non-régression, antérieurs à s19)** : `src/app/(dashboard)/parcours/(liste)/page.tsx` : intro, meta description et liens SSR hors écran tirés de `PREMIUM_PARCOURS` et du catalogue (Storytelling y manquait depuis s18 ; Boulot y entrera seul à l'activation) ; meta description réordonnée (« première étape gratuite » en tête, 150 caractères à 4 parcours, 158 à 5) ; `src/lib/liste-fr.ts` (« A, B et C ») ; `src/config/textes/parcours.ts` : « étapes 2 et 3 » pour un parcours de 3 étapes (Machine à Café). Aucune migration, aucune variable, aucune écriture en base.
> - **Rendu itération 3 (11/10, arbitrages après relecture @design 10 / 9,3 et @ux 9 / 10)** : `src/components/parcours/parcours-detail.tsx` (lien d'étape dans la carte de progression, ligne XP masquée en erreur, total d'XP à gauche sous 640 px, vide au-dessus de l'alerte), `parcours-step-card.tsx` (un seul cadenas ; Boulot seulement : encadré « Version sans risque » et lien « Aller au défi » ; place réservée du lien « Lire la fiche du conseil » dans le HTML de repli), `step-blocks.tsx`, `step-quiz.tsx`, `parcours-content.tsx` (`frTypoParcours`), `src/lib/fr-typo.ts` (`frTypoParcours` : gluon U+2060 après « Choisis- », « relis- »… ; `frTypoTexte` : « En 6 semaines » insécable), `src/config/textes/parcours.ts` (`DEFI_BOULOT`, 2 libellés validés par l'arbitrage). Aucune migration, aucune variable, aucune écriture en base. **Effet visible dès le déploiement sur les 4 parcours en ligne** : (1) abonné en cours dont la date conseillée est passée : « La prochaine étape t'attend. » devient un lien vers l'étape, avec « Étape N : titre » dessous ; (2) étape verrouillée par l'ordre conseillé : un seul cadenas (à gauche) au lieu de deux ; (3) typographie : plus de coupure de ligne après « Choisis- », « relis- », « Dis- » (vannes, quiz, défis), « En » lié au nombre dans la description ; (4) carte de progression : total d'XP aligné à gauche sur mobile, masqué si le chargement échoue. L'encadré « Version sans risque » et « Aller au défi » ne concernent que Boulot (invisible tant que `BOULOT_PUBLIE = false`). Détail : `docs/marrant/parcours-boulot-s19/implementation.md`, section « Rendu itération 3 ».
> - **Rendu itération 4 (11/10, [CHOIX UTILISATEUR] « Go tout est ok pour moi! », NON DÉPLOYÉ)** : `src/lib/parcours-orientation.ts` (quiz : « Au boulot » vers Boulot, sous `BOULOT_PUBLIE`), `src/lib/parcours-xp.ts` (`xpGagnesParcours`), `src/config/textes/parcours.ts` (`xpProgressionTexte`, `etapeLienTexte` ; `totalXpTexte` retiré), `parcours-detail.tsx`, `parcours-step-card.tsx`, `docs/content/parcours-seed.json` et sa trace `parcours-reecriture-s17.json` (2 titres de vidéo de Répartie). Aucune migration, aucune variable, aucune écriture en base. **Effet visible dès le déploiement sur les 4 parcours en ligne** : (1) carte de progression : « N XP gagnés sur T, bonus de fin compris » (« 0 XP gagné sur T… » avant toute étape, singulier pour 0 et 1) au lieu de « T XP au total, dont 100 de bonus à la dernière étape » ; (2) lien d'étape : « Étape N · titre » (point médian) en couleur de lien, souligné au survol ; marge basse de la carte réduite sous 640 px ; (3) Machine à Café, Répartie, Confiance : « DÉFI X » en gras et une ligne d'exemple = un paragraphe (comme Storytelling) ; (4) Répartie, vidéos d'étape : « Marina Rollman / JCC 8è saison » et « Haroun / Jamel Comedy Club Saison 9 » (le titre affiché vient du seed, pas de la base) ; (5) en échec de chargement, plus de « Le suivi de ta progression arrive bientôt… » ; (6) Umami : 2 événements neufs, `lien-etape-clic` et `defi-lien-clic` (`parcours`, `etape`, aucune donnée personnelle). Boulot seulement (invisible à false) : « Version sans risque » en pointillés neutres et titre discret, critère « C'est gagné / C'est réussi » des étapes 2 et 6 sorti de l'encadré, blanc autour de « Aller au défi » réduit. Détail : `implementation.md`, section « Rendu itération 4 ».
> - **Rendu itération 5 (11/10, arbitrages de la session par délégation de Thomas « Go tout est ok », NON DÉPLOYÉ)** : `src/lib/parcours-orientation.ts` (`RAISON_BOULOT`, `emojiReponseBoulot`), `parcours-content.tsx`, `parcours-step-card.tsx`, `step-blocks.tsx`, `src/lib/analytics/weekly-parcours.ts`. Aucune migration, aucune variable, aucune écriture en base, aucun texte de contenu changé. **Effet visible dès le déploiement sur les 4 parcours en ligne** : (1) typographie française étendue à Machine à Café, Répartie et Confiance (conseil, exemple, défi, « Pourquoi cette étape ? », « Ce que tu vas apprendre », aperçu verrouillé, « Programme » du hub) : plus de « : » en tête de ligne ni de « réécris- / le » coupé, seuls des espaces insécables et des caractères invisibles sont ajoutés au rendu ; (2) rapport du lundi : 2 lignes neuves, « Lien vers l'étape à faire cliqué (lien-etape-clic) » et « « Aller au défi » cliqué (defi-lien-clic) ». Boulot seulement (invisible à false) : titre « Version sans risque » en 13 px (au lieu de 12), critère des étapes 2 et 6 détaché du repli (marge de 20 px au lieu de 12). **À l'activation** : quiz, réponse « Au boulot, en réunion, à la pause » avec l'icône 💼 (☕ tant que Boulot est masqué) ; raison du résultat Boulot (quiz et onboarding) « Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. » au lieu de « Pour toi si tu fais rire tes amis le samedi… ». Détail : `implementation.md`, section « Rendu itération 5 ».
> - **Vérifications sur la branche (11/10, après l'itération 5)** : `npx tsc --noEmit -p tsconfig.build.json` 0 erreur ; `npm run lint` 0 erreur (1 avertissement préexistant) ; `npm run build` vert ; Jest complet 4 085 PASS, 4 ignorés, 284 suites (1 ignorée).
>
> **0. Avant tout déploiement** : FAIT au 11/10. Captures 375 / 768 / 1280 (interrupteur forcé à `true` en local, jamais commité) ; relecture du rendu itération 3 @design 10/10 et @ux 10/10, non-régression des 4 parcours en ligne 10/10 / 10/10 (`docs/marrant/parcours-boulot-s19/iterations/rendu-iter-3-*.md`) ; icône `💼` ; feu vert de Thomas sur l'effet (1) à (3) et sur le déploiement masqué (`docs/founder-preferences.md`, 11/10). **Le visionnage des 10 vidéos par une personne conditionne l'ACTIVATION (point 3), pas ce déploiement.**
>
> **1. Déployer** (@infrastructure, arbre principal propre, jamais un worktree) : relever le N-1 (`GET /accounts/<id>/workers/scripts/marrant/deployments`, attendu `151dcc45…` au 11/10), puis
> `cd apps/web && npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build && rm -rf .open-next && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run build:cf && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run deploy:cf`
> (la chaîne factice est requise AUSSI par `deploy:cf`, cf. `docs/infra/bascule-checklist.md` : sans elle, `UserError … CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` et rien n'est envoyé ; échec constaté le 11/10 à 12:32 UTC)
>
> **2. Contrôler après déploiement**
> - Tâche : `timeout 120 npx wrangler tail marrant --format pretty --search "boulot"` pendant un appel à `/api/cron/startup-tasks` (Bearer `CRON_SECRET`) : attendu `parcours-boulot:s19-v1:publie=false : conseils 4 mis à jour, 2 créé(s) … refusés [] ; vannes neuves 10 créée(s) … ; vannes en ligne : écarts [], generatedByAI (protégées de la relecture IA) [cmoxx7e56003xs60yyooxncw3, cmnl01zwv004ss60y2ecodj9a] ; parcours créé (isActive=false) ; étapes 6 créée(s) … vannes d'étape manquantes ou inactives : 0`.
> - En base (lecture) : `SELECT slug, "isActive" FROM "LearningPath" WHERE slug='boulot'` (false) ; `SELECT count(*) FROM "LearningPathStep" s JOIN "LearningPath" p ON p.id=s."learningPathId" WHERE p.slug='boulot'` (6) ; `SELECT id, title, category, "isActive", "generatedByAI" FROM "Tip" WHERE id IN ('cmmw0tqkc000smw62bo1yfeyg','cmmw0tr870014mw62jnung2qp','cmmw0trc60016mw629l4o8rav','cmmw0tra60015mw62l0360wm9','cs19tipboulot1','cs19tipboulot6')` (6 actifs, `generatedByAI` false, PS en ABSURDE) ; `SELECT count(*) FROM "Joke" WHERE id LIKE 'cs19jkboulot%' AND "isActive"` (10) ; `SELECT "patchId" FROM "DataPatch" WHERE "patchId" LIKE 'parcours-boulot%'` (20 marqueurs : global `…:publie=false`, 6 conseils, 10 vannes, 3 vidéos).
> - Site : `/parcours/boulot` en 404 ; `/parcours` (« 4 parcours »), `/sitemap.xml`, `/llms.txt` sans « boulot » ; `/api/health` OK.
>
> **3. Activer le parcours** (feu vert de Thomas seulement) : `sed -i 's/export const BOULOT_PUBLIE = false;/export const BOULOT_PUBLIE = true;/' apps/web/src/config/parcours-publication.ts`, commit, puis la commande du point 1 (chaîne Hyperdrive factice sur `build:cf` ET sur `deploy:cf`). Au démarrage, nouveau marqueur `…:publie=true` : `isActive` passe à true. Boulot apparaît alors dans le hub (« 5 parcours »), l'offre (« Les 5 parcours en entier »), le sitemap, llms.txt, les fiches et les suites de fin (classement `boulot` des autres parcours). **Quiz d'orientation de `/parcours` (rendu itération 4)** : la réponse « Au boulot, en réunion, à la pause » mène à Boulot, quelle que soit la 2e réponse (avant : Machine à Café, Répartie ou Confiance selon la 2e) ; l'onboarding suit la même règle quand l'objectif est « Tout ça à la fois » et le contexte « Au boulot / machine à café ». Rendu itération 5 : la réponse du quiz prend l'icône 💼 et la raison du résultat devient « Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. » (quiz et onboarding). Tests prêts pour les deux états. Après activation : `/parcours/boulot` en 200 (la 1re heure, HTML de repli seed : l'étape 1 y est entière, contrôle `curl -s https://deviens-marrant.fr/parcours/boulot | grep -c "DÉFI TRACE"` ≥ 1), `<title>` « Parcours Boulot : oser une vanne sans te griller, 6 semaines ».
>
> **4. Retour arrière**
> - Code : `npx wrangler rollback <N-1 relevé au point 1>`. Les écritures en base restent (parcours inactif invisible pour l'ancien code).
> - Désactiver seulement le parcours après activation : `UPDATE "LearningPath" SET "isActive"=false WHERE slug='boulot'` puis déployer l'interrupteur à false (le marqueur `…:publie=false` existe déjà, la tâche ne repasse pas).
> - Conseils : état d'avant complet (contenu, exemple, défi, catégorie, difficulté, `isActive`, `generatedByAI`, champs de relecture) dans `note` des marqueurs `parcours-boulot:s19:conseil:<étape>` (UPDATE à la main) ; conseils créés : `UPDATE "Tip" SET "isActive"=false WHERE id IN ('cs19tipboulot1','cs19tipboulot6')`. Vannes neuves : `UPDATE "Joke" SET "isActive"=false WHERE id LIKE 'cs19jkboulot%'`. Puis rétablir `conseils-seed.json` (`git revert`), sinon un rejeu du seed remet les textes s19.
>
> **5. Après activation** : `parcours-etape.duree_s`, étape 6 d'abord (médiane ≤ 1 300 s), puis l'étape 4 ; ajuster `dureeTexte` (arrondi à 5 min) dans le script d'extraction et relancer.

## s15 (11/10/2026, 17:35 Paris) : contrôle avant la semaine 1 = **GO**, **RIEN À DÉPLOYER**

- Semaine 0 : 10 posts `lot-semaine0` PUBLISHED, Buffer `sent` (X 4, Instagram 4, LinkedIn 2) ; 0 FAILED depuis le 06/10.
- Lot 1a (12 au 18/10) : 12 posts du JSON trouvés en base, 12 APPROVED ; écart prévu/inséré = 0 sauf le contenu du X du 15/10 (`c3a73c8392964a6f9ed2f710c`, guillemets corrigés le 11/10, voulu) ; aucune source du 1a publiée à moins de 90 jours ; 2 replis REJECTED.
- Article `se-presenter-avec-humour` : en base, `publishedAt` 12/10 05:00 UTC (relais LinkedIn le 13/10).
- Réseaux ouverts, canaux Buffer `ok` ; alertes : 3 nouvelles, classe B « file basse » seulement (résolues par le 1b le 13/10).
- Notes cycle 9 : aucun critère à 10 ; corrections en cours, voir `docs/social/corrections-cycle9-plan.md`.

## s15 : 4 Open Graph alignés (spec @design cycle 8 §1) @fullstack, **DÉPLOYÉ le 11/10/2026 vers 08:35 (Paris) par la session, version `151dcc45-45c7-4416-a9d0-074de0757260`** (N-1 `8e377821-0501-4784-bd66-47fa814c2780`, retour arrière : `npx wrangler rollback 8e377821-0501-4784-bd66-47fa814c2780`)

- Déployé depuis l'arbre principal propre (`/home/user/Marrant`, aucun worktree), HEAD `d378142` (contenu de production : `4e75c61` + `a684318` ; tsc, lint, build verts, Jest 3 947 PASS) ; relecture @design GO (`docs/social/visuels-s15/relecture-og-cycle9.md`). Garde : aucune section d'une autre session « À DÉPLOYER » ou « NON DÉPLOYÉ ». Réseaux relus avant et après : ouverts, canaux `ok`.
- Vérifié en prod : `/`, `/blog`, `/quiz-humour`, `/vannes`, `/liens`, `/liens/x`, `/liens/li`, `/register`, `/api/health`, pilier en 200 ; `og:image` de l'accueil, du quiz, du pilier, d'un article et de 4 vannes en 200 `image/png` 1200×630, rendus relus (fond uni, Plus Jakarta, aucun « ... ») ; `/api/admin/alertes` 200 ; `/api/social/image` (carte LinkedIn du 15/10) 200.
- **Suivi (non bloquant, @fullstack)** : les vannes dont le préfixe d'id est partagé (`cs18jkstor…`, vannes storytelling s18) rendent la carte de marque, pas leur texte : l'OG résout par préfixe (ambigu) alors que la page résout le slug complet. Aligner la résolution sur celle de la page (`resolveBySlug`, cas C081). Avant ce déploiement, ces vannes affichaient déjà un repli.

- **Quoi** : `/opengraph-image` (accueil), `/quiz-humour/opengraph-image`, `/blog/[slug]/opengraph-image` (statiques ET articles en base via `findBlogArticle`, sans `includeScheduled`), `/vannes/[slug]/opengraph-image` passent au gabarit des cartes : fond `#0D0D0D` uni, Plus Jakarta Sans 800/700 mesurée, accent `#A78BFA`, pied monogramme + domaine 40 px **à droite**. Plus de dégradé, d'emoji, de « gratuit », de « → » ni de troncature « ... » : titre 64 px réduit par pas de 2 (plancher 48, 3 lignes) ; vanne 48/44/40/36 px, sinon carte de marque. `alt`, `size` 1200×630, `revalidate` 3600, `generateStaticParams`, runtime (Node ; `nodejs` explicite pour les vannes) et repli article (« Le blog humour et répartie ») inchangés. **Vanne introuvable ou base en erreur : carte de marque `OgAccueil`** (relecture @design cycle 9, C1 ; plus de carte « Vanne » sans vanne, que X garderait en cache).
- **Fichiers** : NEW `apps/web/src/lib/social/polices.ts` (chargeur de polices déplacé tel quel depuis `image-generator.ts` : fs, puis ASSETS sous Workers, puis CDN), NEW `templates/cartes-og.tsx`, EDIT `templates/carte-marque.tsx` (format `og`, `CarteOg`), `templates/cartes-piste-a.tsx` (`TAILLES.og`, `Bloc` exporté), `image-generator.ts` (importe `getFonts`), les 4 `opengraph-image.tsx` ; NEW `scripts/render-og.ts` ; tests NEW `cartes-og.test.tsx` (15, dont le titre de 140 caractères coupé au mot avec « … », C2), `og-images-routes.test.tsx` (8, replis vanne en carte de marque), EDIT `blog-og-image-db.test.tsx` (4).
- **Contrôles** : `tsc -p tsconfig.build.json`, `lint`, `build` verts (routes OG : accueil et quiz statiques, blog SSG + à la demande, vannes dynamiques, comme avant) ; Jest 275 suites, 3 947 tests PASS (4 ignorés, préexistants). PNG du vrai `next build` relus (accueil, quiz, article pilier) : identiques aux rendus du script.
- **Rendus de preuve (commités)** : `docs/social/visuels-s15/og/` : 13 cas + `-x358.png` + `mesures.json` (accueil, quiz, article-se-presenter, -halloween, -pilier, -100-car, -140-car, -repli, vanne-courte-1re-personne, -3e-personne, -longue, -repli, -400-car-repli-marque). `article-140-car` : titre coupé au mot à 56 px, « … » rendu en Plus Jakarta (C3) ; `vanne-repli` identique à l'octet à `accueil.png` et `vanne-400-car-repli-marque.png`. Mesures : 0 pixel d'encre en x 0-360 × y 550-630, bord droit du pied à x 1118, encre du bloc à ≥ 73 px du pied partout, fond uni. Régénérer : `npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-og.ts [dossier]` (depuis `apps/web`, défaut `docs/social/visuels-s15/og/`).
- **Relecture @design cycle 9** (`docs/social/visuels-s15/relecture-og-cycle9.md`) : **GO déploiement**, 12 cas PASS sur les 8 critères §1.9 ; C1 à C4 appliqués (commit `a684318`) ; C5 (`alt` statiques) non traité, hors périmètre (demande `generateImageMetadata`). Conditions du GO : vérifications post-déploiement §4 de la relecture.
- **Après déploiement** : `curl -sI` sur `https://deviens-marrant.fr/opengraph-image`, `/quiz-humour/opengraph-image`, `/blog/comment-devenir-drole/opengraph-image` et `/blog/se-presenter-avec-humour/opengraph-image` (article en base, publié le 12/10), `/vannes/<slug>/opengraph-image` : 200 `image/png`, puis contrôler 1200×630 sur un PNG téléchargé (`file`) et le relire ; temps du 1er rendu à froid (polices lues dans ASSETS). Les URL d'image portent un hash : relire l'`og:image` de la page. LinkedIn : rafraîchir par Post Inspector avant le relais du 13/10.
- **Retour arrière** : `npx wrangler rollback 8e377821-0501-4784-bd66-47fa814c2780`.

## s15 : `--rollback` exige `--debut`/`--fin` (R1 QA cycle 9) @fullstack, **RIEN À DÉPLOYER** (script hors Worker)

- `prepare-social-month.ts --lot <id> --rollback` (avec ou sans `--confirmer`) sans `--debut` ET `--fin` explicites : message d'erreur, code 2, aucun client Prisma, aucune lecture ni écriture (avant : période par défaut de relance-s15, 12/10 au 03/01, soit 1a ET 1b). `--insert`, dry-run et bornage inchangés.
- Commande d'annulation (tranche seulement) : `--lot relance-s15 --rollback --debut 2026-10-19 --fin 2026-11-15 [--confirmer] --driver=neon-http`. En-tête des `.md` de lot, usage du script et `plan-execution-s15.md` (Retour arrière) corrigés.
- Contrôles : `tsc -p tsconfig.build.json`, `lint`, `build` verts ; Jest 273 suites, 3922 tests PASS (dont `social-lot-rollback-dates.test.ts`, 6 tests). Dry-run 1b régénéré dans `/tmp` : `lot-1b.json` et `lot-1b.md` identiques à l'octet (`cmp`). Aucune écriture en base, aucun `--insert`, aucun `--rollback --confirmer`.

## s15 (11/10/2026, ~08:00 Paris) : pilotage, cycle 9 et corrections en base, **RIEN À DÉPLOYER**

- **Base (UPDATE ciblé id + status + texte exact, 1 ligne)** : post X du 15/10 `c3a73c8392964a6f9ed2f710c`, guillemets droits remplacés par “ ” à l'intérieur de « » (point K2 du @reviewer, cycle 9 ; règle `strategie-relance-v5.md` l.195). Mot à mot inchangé. La vanne source au catalogue garde ses guillemets droits : contrôle bloquant et correction de la source à faire par @fullstack APRÈS l'insertion du 1b (sinon le 1a régénéré ne serait plus identique à `lot-relance-s15.json`).
- **Tests C2 et preuve D8 (@qa)** : C2 PASS sur les 3 réseaux (X avec Google actif, voulu par le code), D8 reçue par Umami le 11/10 (05:55 à 05:56 UTC) ; compte de test créé puis supprimé ; client Stripe de test `cus_VQ5vmmsBTa8djr` restant (session de paiement expirée seule) : à soustraire de la baseline 2. Détail : `docs/qa/tests-c2-navigateurs-integres-11-10.md`.
- **Liens de bio non confirmés** : décision programmée le 12/10 15:00 UTC (légende IG2 tronquée à sa 1re phrase si le lien n'est pas posé) et le 13/10 19:00 UTC (5e partie d'IG3).

## s15 lot 1b, révisions 7 et 8 : corrections E1 à E5 du contrôle @reviewer, textes tranchés à l'aveugle versés @fullstack, **RIEN À DÉPLOYER ; @reviewer GO révision 8 le 10/10 (`8453e20`) ; INSÉRÉ le 13/10 à 06:31 UTC (voir l'entrée du 13/10 en tête)**

> - **Révision 8 (10/10)** : 6 textes retenus à l'aveugle versés mot pour mot (légendes 1C et 2C, renvois 3a, 4b, 6b, 7a ; `social-lot-v5-legendes.ts`, nouveau `social-lot-v5-renvois.ts`) ; 19/10 IG : repli de la clé, L38 seule, sans renvoi. Dry-run 1b : 46 posts, **0 erreur**, `lot-1b.{md,json}` régénérés (sha256 `2268b3d9…`) ; contrôle `--insert` rejoué sans insérer : 0 écart, période vide en base. 1a identique à l'octet. tsc, lint, build verts ; Jest 3 916 passés. Commande d'insertion : `lot-1b-dry-run-08-10.md` révision 8, **à ne lancer qu'après le GO @reviewer**.
> - Révision 7 : la commande d'insertion de la révision 6 ne vaut plus (contrôle @reviewer NO-GO, 7 textes à relire à l'aveugle).
> - **Code** (`apps/web/scripts/content/`, préparation seulement) : étalon V-A en post fixe du 03/11 LinkedIn, BU rendue au pool sans cascade (`social-lot-v5-fixes.ts`) ; renvois des relais limités aux formules exactes de la v5 (`social-lot-v5.ts`) ; légende « homonyme » retirée (`social-lot-v5-legendes.ts`). Dry-run 1a identique à l'octet (sha256 `63a2f315…`). Détail : `lot-1b-dry-run-08-10.md` révision 7.
> - Aucun `deploy:cf`, aucun `--insert`, aucun `--rollback --confirmer` lancés.

## s15 lot 1b, révision 6 : légendes des relais IG du 19/10 et du 05/11 versées @fullstack, **RIEN À DÉPLOYER** (script de préparation et doc seulement, aucune écriture en base)

> - **Versé** (`apps/web/scripts/content/social-lot-v5-legendes.ts`) : L38 (concert, 19/10) et L31 (« fais tes preuves », 05/11), tranchées à l'aveugle.
> - **Dry-run 1b** : 46 posts, **0 erreur** ; lignes à insérer dans `docs/social/preparation/lot-1b.json` (relecture `lot-1b.md`). Dry-run 1a identique à l'octet (sha256 `63a2f315…`). tsc, lint, build verts ; Jest 3 906 passés.
> - **Insertion (Thomas, depuis `apps/web`)** : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15 --json ../../docs/social/preparation/lot-1b.json --insert --driver=neon-http`. Détail : `lot-1b-dry-run-08-10.md` révision 6.
> - Aucun `deploy:cf`, aucun `--insert`, aucun `--rollback --confirmer` lancés.

## s15 lot 1b, révision 5 : lignes d'article notées au tirage des relais, repli versé @fullstack, **RIEN À DÉPLOYER** (scripts de préparation et doc seulement, aucune écriture en base)

> - **Code** (`apps/web/scripts/content/social-lignes-notees.ts` nouveau, `social-lot-v5.ts`, `prepare-social-month.ts --lignes-notees`, `social-lot-v5-legendes.ts`) : les lignes `auNiveau` de `lignes-articles-notes.json` entrent au relais de leur article, même avec `--pool strict` ; « À envoyer au / aux » accepté par le contrôle des légendes.
> - **Versé** : K59, K42, K53, K63, K76 et le carrousel C3 dans `textes-formats-valides.json` ; L24, L19, L20, L29 dans les légendes.
> - **Tests** : +14 (`social-lot-lignes-notees.test.ts` 13, légendes 1), 2 ajustés au fichier versionné. tsc, lint, build verts ; Jest 3 906 passés.
> - **Dry-run 1a** : identique à l'octet (sha256 `63a2f315…`). **Dry-run 1b** : 46 posts, 2 erreurs (légendes des relais IG du 19/10 et du 05/11), détail dans `docs/social/preparation/lot-1b-dry-run-08-10.md` révision 5.
> - Le Worker n'importe pas ces scripts : aucun `deploy:cf`, aucun `--insert`, aucun `--rollback --confirmer`.

## s15 lot 1b : conseil de repli S1 tous jours ouvrés et carrousel R9 à 28 jours en base @fullstack, **RIEN À DÉPLOYER** (scripts de préparation et doc seulement, aucune écriture en base)

> - **Code** (`apps/web/scripts/content/social-lot-v5-mix.ts`, `social-lot-v5.ts`) : champ `role` du conseil dans `textes-formats-valides.json` (plan §3, décision du 10/10). `nominal` (défaut) : mardi ou vendredi, comportement inchangé. `repli` : tout jour ouvré hors 30/10, 27/11, 25/12 et 01/01, jamais LinkedIn, 8 conseils au plus par semaine (le 9e est refusé à la lecture et au tirage). Lundi et jeudi : ligne notée d'abord, puis conseil de repli seulement (le conseil nominal, même rendu, n'y va jamais). Un texte qui a son créneau sert sa case d'abord. R9 : date de 1re diffusion **en base** seulement, refus motivé (« publiée depuis N jours », « jamais publiée en base ») ; créneau du carrousel un mercredi.
> - **Tests** (`social-lot-v5-mix.test.ts`, +5, 3 ajustés à la décision du 10/10) : repli un jeudi accepté, nominal un jeudi refusé, 9e conseil refusé, carrousel à 27 jours refusé et à 28 jours accepté. tsc, lint, build verts ; Jest complet : 3 892 PASS, 4 ignorés.
> - **Dry-run 1a** (`--pool strict --debut 2026-10-12 --fin 2026-10-18`) : JSON et Markdown identiques à l'octet à `lot-relance-s15.{json,md}` (sha256 `63a2f315…`). **Dry-run 1b** : mêmes 39 posts, mêmes 12 erreurs. Seuls changent les messages des 6 cases 05/11, 09/11 et 12/11 X et IG (« ligne d'article notée ; à défaut : conseil »). Aucun texte versé : les textes viennent de @copywriter, puis passent à l'aveugle.
> - Le Worker n'importe pas ces scripts : aucun `deploy:cf`, aucun `--insert`.

## s15 (10/10/2026, 08:00 Paris) : semaine 0 = 10 posts sur 10 ; alertes B seulement

- Posts du 09/10 (X 12:32, Instagram 19:32) publiés, liens réels (`docs/social/releves/2026-10-09.md`). Semaine 0 : 10 sur 10, aucun FAILED.
- Alertes : files basses (5 à 6 jours devant), classe B, attendues avant l'insertion du lot 1b (14/10) ; aucun e-mail.

## s15 (09/10/2026, ~08:10 Paris) : LOT 1a INSÉRÉ en base (12 au 18/10)

- Dry-run final sans `--out`/`--json` : `lot-relance-s15.json` identique à l'octet à la version relue (sha256 `63a2f315…`), 0 erreur.
- `--insert --driver=neon-http` : **12 posts APPROVED** (`thomas-s15`), X 5, Instagram 5, LinkedIn 2 ; 2 replis en réserve (REJECTED, envoyés seulement si l'article du relais n'est pas en ligne) ; contrôle après insertion conforme par réseau et par semaine.
- Contrôles SQL : 0 dimanche, 0 vanne de la semaine 0 reprise ; anciens posts `preparation-mensuelle` de la période en REJECTED (inchangés).
- Retour arrière possible : `--rollback --lot relance-s15 --debut 2026-10-12 --fin 2026-10-18 --confirmer` (borné à la période).
- Gabarit carte conseil : déjà en ligne (déploiement s18 du 08/10), section mise à jour ; plus d'échéance au 23/10.

## s15 (08/10/2026, 20:16 Paris) : H+45 Instagram OK, jour 3 = 3/3

- Carte vanne `sent` à 19:32, `instagram.com/p/DePen34lAaI/`, 2 images avec texte alternatif, légende sans lien. Semaine 0 : 8 posts sur 8 publiés.

## s15 (08/10/2026, 13:17 Paris) : H+45 LinkedIn et X OK (jour 3)

- LinkedIn `sent` à 08:17, X `sent` à 12:32, liens réels, aucun FAILED (`docs/social/releves/2026-10-08.md`). Alertes du matin : 8 de classe B (files basses avant l'insertion du lot 1a le 09/10), aucun e-mail.

## s15 gabarit carte conseil : **DÉPLOYÉ le 08/10/2026 à 09:33 (Paris) avec le déploiement groupé s18, version `8e377821`** (commit `d47db06` ancêtre du commit déployé `b248ad8`, vérifié le 09/10 par `git merge-base --is-ancestor`)

> - **Pourquoi** : le 1er conseil Instagram (K26, « Consoler en exagérant ») part le ven. 23/10 à 19:30. Sans ce code, le Worker rend ses cartes avec le gabarit vanne (5 cartes sur 10 débordaient). Le Worker de production ne connaît pas encore le gabarit : il **part avec le prochain déploiement autorisé**, c'est-à-dire le déploiement groupé s18 ci-dessous, qui attend le feu vert de Thomas (garde de déploiement : une autre session a du code non déployé, donc **aucun `deploy:cf` dans cette session**). Si ce feu vert tarde, prévoir un déploiement avant le 23/10 qui embarque les deux. Ce déploiement doit avoir lieu avant l'insertion du lot 1b, ou au plus tard avant le 23/10 à 19:30.
> - **Code Worker** (`apps/web/src/lib/social/`) : nouveau `templates/cartes-conseil.tsx` (`ConseilCarte1`, `ConseilCarte2`, réduction du corps de 72 à 56 px par pas de 4, erreur si rien ne tient, jamais de rognage), `carrouselConseilCartes` (`carrousel-piste-a.ts`), sélection dans `generate-post-image.ts` (post `IMAGE_QUI_CLAQUE` à **3 parties** = conseil : `[surtitre, carte 1, carte 2]`), `position="debut"` dans `carte-marque.tsx`, `composerParagraphe` dans `mise-en-lignes.ts` (coupe sans préférence de fin de phrase). Couleurs : surtitre `#A78BFA` sur noir (7,1:1), « » et « À toi de jouer : » en `#DDD6FE` sur l'aplat (5,1:1). Pied identique à la vanne (test au pixel).
> - **Vannes inchangées** : 24 PNG du lot 1a (vannes, décryptages) identiques à l'octet avant et après ; 4 empreintes figées dans `cartes-conseil.test.tsx`.
> - **Données** : aucun post en base n'a 3 parties (semaine 0 : 2 ; lot 1a : 2 et 5 ; export s14 : 1 à 8, aucun `IMAGE_QUI_CLAQUE` à 3) ; le lot 1b n'est pas inséré. Le générateur de lots (`social-lot-v5*.ts`) écrit désormais `[surtitre, carte 1, carte 2]` (`partiesConseilIg`, 2 `imageUrls`), sans le préfixe « Technique : » de `0a12c43`. Dry-run 1a : JSON identique à l'octet (sha256 `63a2f315…`) ; 1b : mêmes 46 posts et mêmes 5 erreurs de légende, seules les 5 lignes de conseil IG changent.
> - **Rendu réel** : `docs/social/visuels-s15/conseils-1b/` (10 cartes à 1080 px + 10 aperçus à 390 px, `index.md`) : 10 sur 10 tiennent, toutes au corps 72.
> - **Après le déploiement** : ouvrir `/api/social/image?postId=<conseil IG du 1b>&slide=0` puis `&slide=1` : 2 cartes 1080×1350, surtitre lilas en haut, aucun « Technique : ».

## s18 DÉPLOIEMENT GROUPÉ : parcours Storytelling PUBLIÉ + correctif de redirection C081 @fullstack, **DÉPLOYÉ le 08/10/2026 à 09:33 (Paris), version `8e377821-0501-4784-bd66-47fa814c2780`** (N-1 `797b1dea-9cb7-4675-a484-5a8b5710a335`)

> **Déploiement** (feu vert de Thomas le 08/10 : « On s'arrête après ce tour d'itération oui, et on déploie. ») par @fullstack depuis l'arbre principal propre (`/home/user/Marrant`, `node_modules` réel, aucun worktree), branche à jour, commit `b248ad8` (`STORYTELLING_PUBLIE = true` ; tsc, lint, build verts, Jest 3 887 PASS, 4 ignorés). N-1 lu sur `GET /accounts/<id>/workers/scripts/marrant/deployments` : `797b1dea` à 100 %. `rm -rf .open-next`, `npm run build:cf`, puis `npm run deploy:cf` (la variable `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice est requise AUSSI pour `deploy:cf` : un premier essai sans elle a échoué avant tout envoi). Tâches de démarrage lancées à la main : `curl -H "Authorization: Bearer $CRON_SECRET" https://deviens-marrant.fr/api/cron/startup-tasks` : `{"success":true,"durationMs":13413}`.
> **Contrôles en ligne (07:34 à 07:38 UTC)** :
> - Base (lecture seule) : marqueur global `parcours-storytelling:s18-v1:publie=true` et les 10 marqueurs d'élément posés ; `storytelling` `isActive = true`, 6 étapes ; les 3 conseils actifs, contenu, exemple et défi identiques au texte validé (comparaison exacte) ; 5 vannes `cs18jkstory5v1` à `v5` actives (« Le tiroir ») ; défi B présent à la fin du callback, repli solo à la fin de « Rigoler de ses échecs » ; 30/30 vannes des étapes actives.
> - `/parcours/storytelling` : 200 aux 2 visites, `<title>` « Parcours Storytelling : raconter tes histoires en 6 semaines », meta description validée, étape 1 (titre, « Imagine Samir », « Environ 20 min, vidéo comprise ») présente. **Réserve** : le HTML pré-rendu au build est le repli seed, sans le conseil ni le défi de l'étape 1 pour le visiteur (l'abonné a tout via `/api/parcours/by-slug`, vérifié : DÉFI COUPE, conseil, durée). `cache-control: s-maxage=3320` à 07:38 UTC : la page devient périmée vers 08:33 UTC, la visite suivante relance la régénération, la d'après sert la version complète. **À refaire après 10:35 Paris** : `curl -s https://deviens-marrant.fr/parcours/storytelling | grep -c "DÉFI COUPE"` (2 fois), attendu ≥ 1. Correctif durable proposé : recharger `/api/parcours/by-slug` aussi pour le visiteur quand le HTML vient du repli seed (ids `seed-`).
> - Quiz : le paquet JS déployé de `/quiz-humour` contient `recommendedParcours: …q ? "storytelling" : "machine-a-cafe"` avec `q = !0` (vrai) et l'accroche 4 A ; le lien construit est `/parcours/storytelling?src=quiz#etape-1`.
> - C081 : `/conseils/construire-une-histoire-drole-cmmp8ozsx0` 308 vers `/conseils/derailler-le-plus-tard-possible-cmmp8ozsx0` ; anciens slugs C042 (`ne-jamais-expliquer-sa-blague-…`) et C033 (`le-callback-faire-revenir-une-blague-au-bon-moment-…`) toujours en 308 vers leur fiche.
> - `/api/health` : base `up`, critique `ok` (statut global `degraded` = contenu IA coupé, attendu) ; sitemap : `/parcours/storytelling` présent avec les 3 autres ; `/parcours` : « 4 parcours », Storytelling listé ; `llms.txt` cite Storytelling ; `/parcours/machine-a-cafe`, `/repartie`, `/confiance` en 200.
> - **Retour arrière** : `npx wrangler rollback 797b1dea-9cb7-4675-a484-5a8b5710a335` (puis `UPDATE "LearningPath" SET "isActive"=false WHERE slug='storytelling'` pour que l'ancien code ne liste pas le parcours via `/api/parcours`).

> Historique de préparation (avant le feu vert) :

> **Ce que le déploiement embarque depuis la version en ligne** (`cf8e25b`, Worker `797b1dea-9cb7-4675-a484-5a8b5710a335`). `git diff --stat cf8e25b..HEAD -- apps/` à relancer juste avant le déploiement (la session s15 pousse aussi sur cette branche), commit par commit :
> - **s15** (4 commits, scripts CLI de préparation sociale, hors bundle du Worker, aucun effet sur le site) : `4b58d54` mix de formats codé ; `11bd740` textes du lot 1b ; `0a12c43` cases de conseil de la carte 1 ; `44eefb9` relais LinkedIn. Fichiers : `apps/web/scripts/content/{prepare-social-month,social-conseil-rendu,social-lot-v5,social-lot-v5-export,social-lot-v5-fixes,social-lot-v5-legendes,social-lot-v5-mix}.ts` et `apps/web/src/__tests__/scripts/social-lot-v5-mix.test.ts`.
> - `a2c34ea` **s18** correctif C081 : `apps/web/src/lib/catalogue-slug.ts`, `apps/web/src/app/(dashboard)/conseils/[slug]/page.tsx`, test (détail dans l'entrée « correctif de la redirection » ci-dessous).
> - **s15, code du Worker** : `d47db06` gabarit de carte conseil Instagram (`apps/web/src/lib/social/{carrousel-piste-a,generate-post-image,mise-en-lignes}.ts`, `templates/{carte-marque,cartes-conseil,cartes-piste-a}.tsx`, test `cartes-conseil.test.tsx`, scripts `social-conseil-rendu`, `social-lot-v5`, `social-lot-v5-mix`) : rendu des images des posts sociaux (cron), aucun effet sur les pages.
> - `313cf16` fusion de la branche distante (apporte les commits s15 ci-dessus). Total : `git diff --stat cf8e25b..HEAD -- apps/` = 43 fichiers, +1 995 / -77 (au 08/10 après fusion).
> - `3e4cd28` **s18 Storytelling** : interrupteur `apps/web/src/config/parcours-publication.ts` (`STORYTELLING_PUBLIE = false`), liste des parcours publiés `src/lib/parcours-seed.ts`, tâche de démarrage `src/lib/parcours-storytelling-sync.ts` (appelée par `runStartupTasks`), suite de fin classée (`path-completion-card.tsx`, `/api/parcours` : dernière validation et accroche), phrase de protection sous le défi et retours à la ligne des défis (`parcours-step-card.tsx`), Storytelling conditionné dans l'offre, le quiz, les slugs, le sitemap et la page ; contenu `docs/content/parcours-storytelling-s18.json` ; `nextParcoursRanking` dans `parcours-seed.json`.
> - **Effet visible au déploiement, interrupteur à false** : aucun changement de page sauf (1) la redirection C081, (2) 3 conseils réactivés en base avec leur texte validé (« Raconter une anecdote en 3 actes », « Le twist final », « La blague à tiroirs », leurs fiches `/conseils/…` reviennent en 200), (3) repli solo ajouté au défi de « Rigoler de ses échecs » (« Personne ce soir ? Dis-la à voix haute ou enregistre-la en vocal. »), (4) 5 vannes neuves actives (`cs18jkstory5v1` à `v5`, catégories SITUATION, SOIREES, BOULOT, technique « Le tiroir », `copyVerdict = GARDER`, sans `howToApply` donc hors du tirage de secours de la vanne du jour ; calendrier rempli jusqu'au 31/12), (5) parcours `storytelling` créé avec `isActive = false` et ses 6 étapes. `/parcours/storytelling` reste en 404, absent du hub, du sitemap, de llms.txt, des fiches et du quiz.
> - **Base** : aucune migration, aucune variable. Toutes les écritures passent par la tâche de démarrage (idempotente, marqueurs `DataPatch` `parcours-storytelling:s18:*`, ancien texte de chaque conseil gardé dans `note`). Ids des 3 conseils revérifiés en lecture seule sur Neon le 08/10 (titres identiques, `isActive = false`) ; la tâche refuse toute écriture si le titre ne correspond pas.
> - **Vérifications sur la tête** : `npx tsc --noEmit -p tsconfig.build.json`, `npx next lint` (0 erreur), `npm run build` verts ; sur la tête fusionnée du 08/10 (après le lot rendu iter 1 et `d47db06`) : Jest complet 3 889 PASS, 2 ignorés (interrupteur à false ; aussi vert interrupteur forcé à true avant fusion : 3 863 PASS). Contrôle local sur base jetable : voir `docs/qa/captures-parcours-storytelling-s18/`.
>
> **1. Déployer** (@infrastructure, arbre principal propre, jamais un worktree) :
> `git fetch && git status` (branche `claude/marrant-s10-session-recovery-CtZyw` à jour, arbre propre), relever le N-1 par `GET /accounts/<id>/workers/scripts/marrant/deployments` (attendu `797b1dea…` à 100 %), puis
> `cd apps/web && npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build && rm -rf .open-next && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run build:cf && npm run deploy:cf`
>
> **2. Contrôler après déploiement**
> - C081 : `curl -sI https://deviens-marrant.fr/conseils/construire-une-histoire-drole-cmmp8ozsx0 | grep -i location` (2 fois si cache ISR) : attendu `/conseils/derailler-le-plus-tard-possible-cmmp8ozsx0` ; `ne-jamais-expliquer-sa-blague-cmmp8ozsx0` vers C042 et `le-callback-faire-revenir-une-blague-au-bon-moment-cmmp8ozsx0` vers C033 inchangés.
> - Tâche de démarrage : `timeout 120 npx wrangler tail marrant --format pretty --search "storytelling"` pendant un appel à `/api/cron/startup-tasks` (Bearer `CRON_SECRET`) : attendu `parcours-storytelling:s18-v1:publie=false : conseils 3 réactivé(s) … vannes neuves 5 créée(s) … parcours créé (isActive=false) ; étapes 6 créée(s) … vannes d'étape manquantes ou inactives : 0`.
> - En base (lecture) : `SELECT slug, "isActive" FROM "LearningPath" WHERE slug='storytelling'` (false) ; `SELECT count(*) FROM "LearningPathStep" s JOIN "LearningPath" p ON p.id=s."learningPathId" WHERE p.slug='storytelling'` (6) ; `SELECT title, "isActive" FROM "Tip" WHERE id IN ('cmmp8ozsx000mqk63ux155ma1','cmmp8ozsx000tqk63yhagsgqi','cmmp8ozsx0012qk63kxfsux75')` (3 true) ; `SELECT count(*) FROM "Joke" WHERE id LIKE 'cs18jkstory5v%' AND "isActive"` (5) ; `SELECT "patchId" FROM "DataPatch" WHERE "patchId" LIKE 'parcours-storytelling%'` (marqueur global `…:publie=false` présent).
> - Site : `/parcours/storytelling` en 404 ; `/parcours`, `/sitemap.xml`, `/llms.txt` sans « storytelling » ; les 3 fiches conseils réactivées en 200 (visiter 2 fois, ISR) ; `/api/health` OK.
>
> **3. Activer le parcours** (feu vert de Thomas, après relecture visuelle @design et @ux) : une variable, puis un déploiement.
> `sed -i 's/export const STORYTELLING_PUBLIE = false;/export const STORYTELLING_PUBLIE = true;/' apps/web/src/config/parcours-publication.ts`, commit, puis la commande du point 1. Au démarrage, la tâche (nouveau marqueur `…:publie=true`) passe `isActive` à true et ajoute le défi B au callback (« Tu travailles ton anecdote du parcours Storytelling ? … », en paragraphe à part). Le parcours apparaît alors dans le hub (« 4 parcours »), l'offre Premium (« Les 4 parcours en entier »), le sitemap, llms.txt, les fiches (« première étape gratuite ») et le quiz (profil Storyteller vers `/parcours/storytelling?src=quiz` avec l'accroche 4 A). Les tests sont déjà prêts pour les deux états.
> - **Lot rendu iter 1 (08/10, intégré)** : questions 3 et 4 de l'étape 1, `nextParcoursReason` et meta description (`docs/copy/parcours-storytelling-complements-s18.md`) ; icône 📖 confirmée par @design ; design I-2, M-1, M-2, M-4 (I-1 = miniature en chargement différé à la capture, le lecteur a déjà `aspect-video` et un repli `onError`) ; UX D1 (« Environ 20 min, vidéo comprise », 15 min à l'étape 6), D3 (espaces insécables), D4 (« … » au rendu des vannes), D5 (second défi titré à l'étape 6, retour précisé). Plus rien n'est en attente de texte avant l'activation.
> - **Après activation** : `/parcours/storytelling` en 200 (visiter 2 fois : le HTML pré-rendu au build est le repli seed, sans conseil ni défi à l'étape 1, jusqu'à sa régénération ISR, revalidate 1 h ; même comportement que les 3 autres parcours après chaque déploiement) ; quiz : profil Storyteller ; fiche du callback avec le défi B.
>
> **4. Retour arrière**
> - Code : `npx wrangler rollback 797b1dea-9cb7-4675-a484-5a8b5710a335` (retire aussi le correctif C081). Les écritures en base restent (parcours inactif invisible pour l'ancien code ; conseils et vannes validés).
> - Désactiver seulement le parcours après activation : remettre l'interrupteur à false ne suffit pas (le marqueur `…:publie=false` existe déjà) : `UPDATE "LearningPath" SET "isActive"=false WHERE slug='storytelling'` puis déployer l'interrupteur à false. Retirer le défi B : reprendre `before` dans la `note` du marqueur `parcours-storytelling:s18:defi:storytelling-6`.
> - Conseils : l'ancien texte et l'état de chacun sont dans `note` des marqueurs `parcours-storytelling:s18:conseil:<id>` (UPDATE à la main si besoin). Vannes neuves : `UPDATE "Joke" SET "isActive"=false WHERE id LIKE 'cs18jkstory5v%'`.
>
> **5. Revérifier ensuite** : la première validation réelle d'une étape par un Premium (`SELECT count(*), max("completedAt") FROM "UserPathStepCompletion"`), l'alerte `parcours-progress-erreur`, et après activation l'événement Umami `parcours-ouvert` avec `src=quiz` sur `storytelling`.

## s15 lot 1b, révision 3 : relais LinkedIn validés avant les vannes hors thème bureau @fullstack, **RIEN À DÉPLOYER** (scripts de préparation et doc seulement, aucune écriture en base)

> - **Code** (`apps/web/scripts/content/social-lot-v5.ts`, `relaisLinkedInValide`) : un relais LinkedIn validé garde sa case avant toute vanne hors thème bureau ; une vanne de thème bureau libre au niveau garde la priorité (mix §2, plan §2). Tests : `social-lot-v5-mix.test.ts` (+2).
> - **Dry-run 1b** : 46 posts, 0 erreur de mix, 5 erreurs de légende de relais IG (commande : `docs/social/preparation/lot-1b-legendes-a-commander.md`). **Lot 1a identique à l'octet.** Détail : `docs/social/preparation/lot-1b-dry-run-08-10.md`, révision 3.
> - Le Worker n'importe pas ces scripts : aucun `deploy:cf`, aucun `--insert`.

## s15 lot 1b, révision 2 : cases de conseil nominales et technique dans la carte 1 @fullstack, **RIEN À DÉPLOYER** (scripts de préparation et doc seulement, aucune écriture en base)

> - **Code** (`apps/web/scripts/content/social-lot-v5-mix.ts`, `social-lot-v5.ts`) : cases de conseil nominales (plan §3 : vendredi avant le 03/11, mardi et vendredi ensuite, X et IG) servies par leur conseil AVANT la vanne ; jamais de conseil le lundi ni le jeudi ; technique (`surtitre`) en tête de la carte 1 des conseils IG (`carteAvecSurtitre`). Script de contrôle `apps/web/scripts/content/social-conseil-rendu.ts` (rendu local `generatePostImage`). Tests : `social-lot-v5-mix.test.ts` (+5, 3 ajustés).
> - **Dry-run 1b** : 44 posts, 6 erreurs (4 légendes de relais IG, 12/11 X et IG sans texte), cartes conseil : 5 sur 10 débordent (gabarit vanne). **Lot 1a identique à l'octet.** Détail : `docs/social/preparation/lot-1b-dry-run-08-10.md`, révision 2.
> - Le Worker n'importe pas ces scripts : aucun `deploy:cf`, aucun `--insert`.

## s15 lot 1b : textes du repli du mix versés, dry-run du 08/10 @fullstack, **RIEN À DÉPLOYER** (scripts de préparation et doc seulement, aucune écriture en base)

> - **Versé** : `docs/social/preparation/textes-formats-valides.json` (10 conseils K04, K07, K09, K22, K25, K26, K27, K28, K30, K36 ; 3 relais LinkedIn R08 05/11, R07 10/11, R02 12/11 ; notes des 2 relecteurs ; mot pour mot, extraction par script), légendes L12 (03/11) et L13 (04/11) dans `apps/web/scripts/content/social-lot-v5-legendes.ts`.
> - **Code** (`apps/web/scripts/content/social-lot-v5-mix.ts`, `social-lot-v5.ts`) : champs `creneau` (le texte sert sa case ; vanne au niveau sur la case = texte rendu au repli, avertissement) et `surtitre` (conseil Instagram) ; barre des relais LinkedIn 8 vers 8,5 (conseils : 8). Tests : `src/__tests__/scripts/social-lot-v5-mix.test.ts` (+5).
> - **Dry-run 1b** : 46 posts, **3 erreurs** (légendes des relais IG 19/10, 29/10, 05/11 : vannes tirées différentes de la clé, L07/L16/L15 non versées) ; X 19 posts, 260 caractères au plus. **Lot 1a identique à l'octet.** Détail : `docs/social/preparation/lot-1b-dry-run-08-10.md`.
> - Le Worker n'importe pas ces scripts : aucun `deploy:cf`. Aucun `--insert` (le 1b sera régénéré et inséré après le 1a).

## s18 correctif de la redirection des anciennes URL de conseils (cas C081) @fullstack, **DÉPLOYÉ le 08/10 avec le déploiement groupé ci-dessus** (`a2c34ea` ancêtre de `b248ad8`, version `8e377821`, vérifié le 11/10)

> **Défaut** : `/conseils/construire-une-histoire-drole-cmmp8ozsx0` (ancien slug de C081) renvoie un 308 vers `le-callback-faire-revenir-une-vanne-au-bon-moment-cmmp8ozsx0` (C033) au lieu de `derailler-le-plus-tard-possible-cmmp8ozsx0`. C033, C042 et C081 partagent le préfixe d'id `cmmp8ozsx0`, et `pickBySlug` retombait sur le score de mots (C033 partage « une »). Aucune solution sans déploiement : la résolution ne lisait que `title`, `originalTitle` (déjà rempli : « Construire une histoire drôle ») n'était pas consulté. Contrôle des 12 anciens slugs de la phase 1 : 11 OK, seul C081 KO.
> - **Correctif** (`apps/web/src/lib/catalogue-slug.ts`, `apps/web/src/app/(dashboard)/conseils/[slug]/page.tsx`) : `pickBySlug` / `resolveBySlug` prennent un 4e argument facultatif `buildFormerSlugs` ; après la correspondance exacte du slug canonique, une correspondance EXACTE avec un ancien slug passe avant le score de mots. Pour les conseils : `buildFormerTipSlugs` (ancien slug calculé depuis `originalTitle`), `originalTitle` ajouté au `select` de `findTipBySlug` (non exposé au client). Vannes et vidéos inchangées.
> - **Tests** : `src/__tests__/lib/catalogue-slug-pick.test.ts` (5 tests, cas C081 reproduit avec les vrais ids). Jest complet 3 829 PASS ; `tsc -p tsconfig.build.json`, `next lint` et `npm run build` verts. Aucun autre changement dans `apps/` depuis le dernier déploiement (`cf8e25b`).
> - **Déploiement (quand Thomas donne le feu vert)**, par @infrastructure, depuis l'arbre principal propre (jamais depuis un worktree à `node_modules` symbolique) : `cd apps/web && rm -rf .open-next && CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice npm run build:cf && npm run deploy:cf`. Aucune migration, aucune variable d'environnement.
> - **Retour arrière** : `npx wrangler rollback 797b1dea-9cb7-4675-a484-5a8b5710a335` (version en ligne à 100 % au 08/10, lue sur l'API des déploiements).
> - **Contrôle après déploiement** : `curl -sI https://deviens-marrant.fr/conseils/construire-une-histoire-drole-cmmp8ozsx0 | grep -i location` (à lancer deux fois si la première réponse sort du cache ISR) : attendu `location: /conseils/derailler-le-plus-tard-possible-cmmp8ozsx0`. Vérifier aussi que `ne-jamais-expliquer-sa-blague-cmmp8ozsx0` et `le-callback-faire-revenir-une-blague-au-bon-moment-cmmp8ozsx0` redirigent toujours vers C042 et C033.

## s18 conseils, phase 2 (08/10/2026) : 5 conseils d'étapes en ligne mis à jour, 3 nouveaux conseils @fullstack, **APPLIQUÉ EN BASE le 08/10/2026** (aucun déploiement)

> Source : `docs/marrant/audit-conseils-s18/mise-en-base-phase2.json` (GO de Thomas, « en deux temps »).
> - **Sauvegarde** : `docs/marrant/audit-conseils-s18/sauvegarde-tip-avant-phase2.json` (5 lignes avant écriture, mêmes champs qu'en phase 1, et les 3 ids réservés dans `nouveaux_crees`). 109 conseils actifs avant.
> - **Contrôle préalable** : 0 tiret cadratin, 0 champ vide, titres inchangés (= titre en base), 3 nouveaux titres absents de la base, préfixes d'id libres. Étapes : Confiance 2, Machine à Café 2, Répartie 2, 3 et 4 (C109 est aussi l'étape 2 de `bases-humour`, inactif).
> - **Écriture** (une transaction `Serializable`, 8 requêtes paramétrées) : 5 `UPDATE` comme en phase 1 (textes, `copyReviewVersion = 18`, `copyVerdict = 'REECRIRE'`, `original*` en COALESCE) ; 3 `INSERT` : `cs18tip2f23fbc9f7986d735d` « Rallonger la vanne de quelqu'un d'autre » (TIMING, DEBUTANT, copié de C052), `cs18tipdad0a86f65286cc919` « Remercier celui qui te chambre » (REPARTIE, DEBUTANT, de C069), `cs18tipe7897545c144f7ca1d` « Rattraper une vanne avec ses états de service » (REPARTIE, EXPERT, de C002), `isActive = true`, `generatedByAI = false`, `copyReviewVersion = 18`, `copyVerdict = 'GARDER'`. Ids au format des ids s14 (`cs18tip` + 18 hexa, 25 caractères), préfixe de 10 caractères unique (slug sans collision avec `pickBySlug`).
> - **Vérification** : 5/5 identiques, 3/3 nouveaux conformes (catégorie et difficulté = source), **112** conseils actifs.
> - **En ligne** : les 8 fiches `/conseils/…` en 200 avec le nouveau texte (cache ISR régénéré par visites). Nouvelles fiches : `/conseils/rallonger-la-vanne-de-quelquun-dautre-cs18tip2f2`, `/conseils/remercier-celui-qui-te-chambre-cs18tipdad`, `/conseils/rattraper-une-vanne-avec-ses-etats-de-service-cs18tipe78`. Étapes : `/api/parcours/by-slug/<slug>` (`no-store`, lit le Tip à chaque requête) renvoie bien les 5 tips aux bons rangs ; en visiteur, ces étapes sont verrouillées (aperçu : titre seul, inchangé). Contrôle Premium impossible (aucun compte de test).
> - **Seed** : `docs/content/conseils-seed.json` aligné pour les 5 (ids seed 2, 31, 63, 76, 80). Les 3 nouveaux ne sont PAS ajoutés : ce fichier n'est pas le catalogue (77 conseils actifs non IA n'y figurent pas, dont tous les s14). Conséquence : un `prisma db seed` désactiverait ces 77 conseils (règle « jamais de seed en prod » à tenir).
> - **Retour arrière** : `NEON_DATABASE_URL=… python3 -I scripts/restaurer-tip-phase2.py` (simulation) puis `--appliquer` : remet les 5 conseils à l'état sauvegardé et désactive les 3 nouveaux (pas de suppression), en une transaction.

## s18 conseils, phase 1 (08/10/2026) : 69 conseils réécrits mis en base de production @fullstack, **APPLIQUÉ EN BASE le 08/10/2026** (aucun déploiement, aucun code modifié)

> GO de Thomas (08/10, `docs/founder-preferences.md`) : « Oui, en deux temps ». Phase 1 = les 69 conseils de `docs/marrant/audit-conseils-s18/mise-en-base-phase1.json` (clé = id du Tip). Les 5 conseils rattachés à des étapes de parcours en ligne ne sont pas dans ce lot et n'ont pas été touchés (phase 2).
> - **Sauvegarde avant écriture** : `docs/marrant/audit-conseils-s18/sauvegarde-tip-avant-phase1.json` (69 lignes : id, title, content, example, exercise, isActive, updatedAt, copyReviewedAt, copyReviewVersion, copyVerdict, originalTitle, originalContent). Les 69 ids existaient et étaient actifs ; 109 conseils actifs au total.
> - **Contrôle préalable** : 0 tiret cadratin, 0 champ vide, titre en base = `ancien_titre` pour les 69. 11 des 69 conseils sont rattachés à des étapes de parcours, tous INACTIFS (`bases-humour`, `roi-repartie`, `maitre-storytelling`, `standup-scene`).
> - **Écriture** (API HTTP Neon, une transaction `Serializable` de 69 `UPDATE … WHERE id = $1 AND "isActive" = true`, requêtes paramétrées) : `title`, `content`, `example`, `exercise` = nouveaux textes ; `copyReviewedAt = now()`, `copyReviewVersion = 18`, `copyVerdict = 'REECRIRE'`, `updatedAt = now()` ; `originalTitle` / `originalContent` = ancien titre / ancien contenu, sauf s'ils étaient déjà remplis (14 conseils sur 69 : valeurs d'origine gardées). 12 titres changent, donc 12 slugs : l'ancienne URL `/conseils/<ancien-slug>-<id10>` répond 308 vers la nouvelle (contrôlé).
> - **Vérification** : relecture des 69 lignes, **69/69 identiques** aux textes attendus (y compris champs copy* et original*) ; conseils actifs : **109** (inchangé).
> - **Cache** : pas de purge possible par `revalidatePath` (OpenNext sans tag cache, voir `open-next.config.ts` et `src/lib/blog-revalidate.ts`). Les fiches `/conseils/[slug]` sont en ISR 24 h dans R2 (`marrant-next-cache`) avec stale-while-revalidate : la première visite sert l'ancienne version et relance la régénération. Les 69 fiches (et les 12 anciens slugs) ont été visitées jusqu'à obtenir **69/69 pages en ligne avec le nouveau texte**. Liste `/conseils`, sitemap et llms : cache 1 h (`unstable_cache` / ISR), mise à jour automatique dans l'heure. `/api/tips` et `/api/daily` ne sont pas en cache : conseil du jour du 08/10 (C013 « L'exagération contrôlée », id `cmmp8ozsx0009…`) servi avec le nouveau texte.
> - **Seed** : `docs/content/conseils-seed.json` aligné pour les 8 conseils du lot qui y figurent (ids seed 5, 6, 8, 9, 10, 17, 20, 53) ; `previousTitle` ajouté pour le 5 (« Construire une histoire drôle ») et le 53 (ancien titre du seed « L'humour digital : mails, Slack et textos pro », jamais aligné sur la base depuis s11). `docs/content/parcours-seed.json` et `apps/web/prisma/seed-data.ts` : aucun `tipTitle` ne pointe vers un titre qui change, rien à modifier. **Ne pas lancer `prisma db seed` en prod.**
> - **Retour arrière** : `NEON_DATABASE_URL=… python3 -I scripts/restaurer-tip-phase1.py` (simulation, liste les titres qui reviendraient) puis `--appliquer` (une transaction, remet les 10 champs sauvegardés à l'identique, `updatedAt` compris). Ensuite visiter deux fois chaque fiche pour régénérer le cache ISR.
> - **Journal SEO (08/10, 07:31 Paris), 12 slugs modifiés** : 12 nouvelles URL `/conseils/<slug>` en 200 ; 11 anciennes en 308 vers la bonne nouvelle URL. **KO : l'ancienne URL de C081** (`/conseils/construire-une-histoire-drole-cmmp8ozsx0`) répond 308 vers la fiche C033 (`/conseils/le-callback-faire-revenir-une-vanne-au-bon-moment-cmmp8ozsx0`) au lieu de `/conseils/derailler-le-plus-tard-possible-cmmp8ozsx0`. Cause : les ids `cmmp8ozsx0…` partagent leur préfixe de 10 caractères, et `pickBySlug` (`src/lib/catalogue-slug.ts`) départage un slug renommé au nombre de mots communs (« une » + l'id pour C033, seul l'id pour C081). Correctif code à faire par @fullstack (ex. rediriger vers l'id complet connu, ou départager sur `originalTitle`) puis déploiement ; en attendant, cette ancienne URL n'a pas été soumise.
> - **IndexNow : NON soumis.** `POST /api/indexnow` (Bearer `CRON_SECRET`, 24 URL : 12 nouvelles, 11 anciennes sans celle de C081, `/conseils`) : **502 (IndexNow a répondu 429)**, un seul essai, pas de relance. Clé `/indexnow-key.txt` conforme à `INDEXNOW_KEY` (32 car.). À refaire plus tard avec le même corps (même limite que s15), par un lot plus petit si 429 persiste ; Bing `SubmitUrlBatch` (Bing Webmaster Tools) en alternative. Les 11 anciennes + 12 nouvelles + `/conseils` : liste construite avec le slugueur du projet, contrôlée en ligne.
> - **Sitemap** : `/sitemap.xml` (ISR 1 h) était encore périmé à 07:31 Paris (12 anciens slugs), puis régénéré dès la visite suivante (07:32) : **12/12 nouvelles URL présentes, 0 ancien slug, 109 fiches conseils, `/conseils` présent**.

## s17 correctifs de clôture (07/10/2026) : robots des 404, Wasm du cron social, pied de page à 1280 @fullstack, **DÉPLOYÉ le 07/10/2026 à 23:02 (Paris), version `797b1dea`** (N-1 `f8905bc3`)

> **Déploiement** par @infrastructure, depuis l'arbre principal propre, commit `cf8e25b`. `.open-next/` supprimé, puis `npm run build:cf && npm run deploy:cf` (variable `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice). Version : **`797b1dea-9cb7-4675-a484-5a8b5710a335`** ; retour arrière : `npx wrangler rollback f8905bc3-d680-4299-a44e-908550ea891a`. N-1 vérifié par un appel direct à l'API des déploiements (`f8905bc3` à 100 %) : `wrangler deployments list` était limité par l'API Cloudflare (code 971, `Retry-After` relancé à chaque essai, car cette commande fait une requête par version). Pendant les contrôles, préférer un seul appel à `GET /accounts/<id>/workers/scripts/marrant/deployments`.
> - **404 OK** : `/nimporte-quoi`, `/vannes/slug-inexistant`, `/conseils/slug-inexistant`, `/videos/slug-inexistant`, `/blog/slug-inexistant`, `/parcours/slug-inexistant` : 404, **une seule** `<meta name="robots" content="noindex">`, **0** balise `bingbot` (avant : 2 balises robots, dont `index, follow`, et `bingbot: index, follow…` sur les 5 premières). Titres « Page introuvable » et « Parcours introuvable ».
> - **Pages valides OK, inchangées** : `/`, `/parcours/repartie`, `/vannes/ma-mere-a-vu-que-jallais-au-hellfest-cmp9fpyd40`, `/conseils/lobservation-du-quotidien-cmmp8ozsx0`, `/videos/roman-frayssinet-lintelligence-des-animaux-cmmp8p0560`, `/blog/comment-devenir-drole` : 200, `robots: index, follow` et `bingbot: index, follow, max-image-preview:large, max-snippet:-1`, identiques au relevé fait avant le déploiement. Comme ces pages sortaient du cache ISR, j'ai aussi testé un rendu neuf (`MISS`) par type sur la nouvelle version (`/vannes/ce-matin-jai-dormi-du-cote-gauche-du-lit-par-erreur-cs14jkbe6b`, `/conseils/expliquer-une-disparition-par-un-projet-de-vie-cs14tip540`, `/videos/ahmed-sparrow-pietons-vs-automobilistes-cmmp8p5410`, `/blog/repartie-soiree-anti-malaise`, `/parcours/confiance`) : mêmes balises.
> - **`/api/health`** 200, bloc `critical` ok.
> - **Pied de page OK** (Chromium) : à 1280 px, grille de 4 pistes de 288 px, « Produit » sur 2 pistes, 4 colonnes visibles alignées (x = 16, 336, 656, 976), aucune colonne vide (avant : 3 pistes de 395 px). À 375 px : capture identique au pixel près à celle d'avant. 0 erreur console.
> - **Logs** (`wrangler tail`) : aucune exception. Seuls messages : `Revalidation failed … with status 404` (déjà connus, 404 en cache) et 4 préchargements `_rsc` du pied de page notés `Canceled`, interrompus par la fermeture des pages de mon contrôle Chromium (coupure côté client).
> - **Wasm du cron social : premier signal favorable, à confirmer au prochain cron social.** Le job de publication (`/api/cron/publish-social`) tourne à chaque tick `*/15`, et l'avertissement venait du chargement du module (import de `satori` en tête de fichier). Au tick de 21:15 UTC, le premier depuis le déploiement, donc le premier chargement de la route sur cette version : `[scheduler:publish] Posts publiés via cron HTTP.`, tick en HTTP 200, **0 ligne « Wasm »** sur 192 requêtes suivies (avant : 2 avertissements au tick de 20:00). Ce tick n'avait pas de post à publier : la vraie preuve reste le prochain post réel (créneau de 20:00 UTC). Suivi : `cd apps/web && timeout 600 npx wrangler tail marrant --format pretty --search "Wasm"` lancé quelques minutes avant le créneau, puis vérifier que le post est `sent` dans Buffer.
>
> **Aucune migration, aucune variable d'environnement, aucune tâche de démarrage.** Code seul (`apps/web`).
> - **404 du site** (`/nimporte-quoi`, `/vannes/…`, `/conseils/…`, `/videos/…`, `/blog/…`, `/parcours/…`, `/vannes/theme/…`, `/carnet/…`, `/liens/…`) : une seule balise robots (`noindex` de `notFound()`), plus de `index, follow` ni de `bingbot: index` hérités du layout racine. Constante `NOT_FOUND_ROBOTS` (`src/lib/seo-meta.ts` : `robots: null` + `other.bingbot: ""`, Next n'émet pas une meta vide) posée dans `app/not-found.tsx` (titre « Page introuvable »), `parcours/[slug]/not-found.tsx` et la branche « introuvable » des `generateMetadata` des 8 routes à slug. Pages valides inchangées. Test : `src/__tests__/feature/not-found-robots-s17.test.ts`.
> - **Wasm au cron social** : `src/lib/social/image-generator.ts` n'importe plus `satori` en tête de fichier (import dynamique sur le chemin hors Workers). Le chargement du paquet compilait son yoga.wasm embarqué (`WebAssembly.instantiate` sur des octets, refusé par workerd) dans les routes `cron/publish-social`, `cron/scheduler-tick` et `social/image`. Le rendu sous Workers (`next/og`) est inchangé. Test : `src/__tests__/lib/image-generator-wasm-s17.test.ts`. Après déploiement : plus d'avertissement « Wasm code generation disallowed by embedder » dans `wrangler tail` au cron de 20:00 UTC, et les posts partent comme avant.
> - **Pied de page** (`src/components/layout/footer.tsx`) : 4 pistes égales dès 1024 px, « Produit » sur 2 pistes (sous-colonnes alignées sur la grille), plus de 4e colonne vide ; 375 et 768 inchangés.
> - **Vérifications** : tsc (`tsconfig.build.json`) 0 erreur, ESLint OK, Jest complet 3 824 PASS, `npm run build` et `npm run build:cf` verts. `next start` en local : 404 + une seule balise robots (`noindex`) sur `/nimporte-quoi`, `/parcours/inconnu-zz`, `/vannes/theme/inconnu-zz`, `/liens/ig`, `/carnet/1999-01`, sans `bingbot` ni `index, follow` dans le payload ; `/blog/comment-devenir-drole` et `/vannes/theme/boulot` en 200 avec leurs 3 balises d'avant. Vannes, conseils, vidéos et blog en base : à contrôler en prod (pas de base en local) avec `curl -s https://deviens-marrant.fr/vannes/zz-inconnu | grep -o '<meta name="\(robots\|bingbot\)"[^>]*>'` (attendu : une seule ligne, `noindex`).

## s17 correctif P2 (07/10/2026) : `/parcours/<slug inconnu>` de nouveau en 404, une seule balise robots @fullstack, **DÉPLOYÉ le 07/10/2026 à 22:34 (Paris), version `f8905bc3`** (N-1 `cca01a65`)

> **Déploiement** par @infrastructure, depuis l'arbre principal propre, commit `b552c69`. `.open-next/` supprimé puis `npm run build:cf && npm run deploy:cf` (variable `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice). Version : **`f8905bc3-d680-4299-a44e-908550ea891a`** ; retour arrière : `npx wrangler rollback cca01a65-46ee-4640-83ee-9fbe6b35f770` (N-1 vérifié à 100 % par `wrangler deployments list`).
> - **Contrôles OK** : `/parcours/slug-inexistant` **404**, une seule balise robots (`noindex`), titre « Parcours introuvable » ; même résultat depuis le cache (`HIT` puis `STALE`, toujours 404) et sur un autre slug jamais vu. `/parcours`, `/parcours/repartie`, `/parcours/confiance`, `/parcours/machine-a-cafe`, `/` : 200, `index, follow` ; `/parcours` liste bien les 3 parcours. `/api/health` 200, bloc `critical` ok ; `/login` 200 (`noindex, nofollow`, comme avant) ; `/abonnement` 200. Chromium : sur la 404, en-tête, pied de page et lien « Voir les parcours » visibles, seule erreur console = le statut 404 du document (attendu) ; `/parcours` et `/parcours/repartie` : 0 erreur console.
> - **Logs** (`wrangler tail` limité à 5 min) : aucune exception. Seule ligne `(error)` : `Revalidation failed for /parcours/slug-inexistant with status 404`, à chaque appel servi depuis un cache périmé. C'est le comportement d'OpenNext sur toute 404 en cache : le même message sort pour `/blog/zz-controle-inexistant`, une route que le correctif ne touche pas. Ce n'est pas une régression, mais ce bruit est à garder en tête si une alerte compte les `console.error`.

> Régression du lot B (200 + 2 balises robots en prod, `cca01a65`). `parcours/page.tsx` et `parcours/loading.tsx` déplacés dans le groupe `app/(dashboard)/parcours/(liste)/` : l'URL `/parcours` et son squelette ne changent pas, mais `[slug]` n'est plus dans une frontière Suspense, donc `notFound()` repasse avant l'envoi de la réponse. Slug inconnu : `robots: null` dans `generateMetadata` et dans `[slug]/not-found.tsx` (titre « Parcours introuvable »), si bien que seul reste le `noindex` de Next (le `index, follow` du layout racine n'est plus hérité). Test de non-régression : `src/__tests__/feature/parcours-404-status.test.ts`. **Aucune migration, aucune variable d'environnement.** Mesuré en local, sans base ni secret : `next start` et worker OpenNext (`wrangler dev --local`) donnent 404, 1 balise robots (`noindex`) sur `/parcours/slug-inexistant` (2 appels), 200 sur `/parcours` et les 3 parcours. tsc, ESLint, Jest complet (3 806 PASS) et `npm run build` verts. Après déploiement : `curl -s -o /dev/null -w "%{http_code}" https://deviens-marrant.fr/parcours/slug-inexistant` doit renvoyer `404`.

## s17 tour 4 de la notation visuelle (07/10/2026) : dernières finitions @fullstack, **DÉPLOYÉ le 07/10/2026 à 21:58 (Paris), version `cca01a65`** (N-1 `712ee919`), avec le lot s17 ci-dessous

> Notes finales : @design 9,8/10, @ux 9,9/10 (GO, aucun bloquant ; Thomas : « Finissons et déployons »). Repositionnement de l'étape visée par une ancre après le chargement Premium, survol de l'en-tête d'étape et de l'interrupteur du rappel. **Aucune migration, aucune variable d'environnement.** tsc, ESLint, Jest complet (3 799 PASS) et `npm run build` verts en local.

## s15 mix de formats codé (08/10/2026) : repli sans vanne au niveau, scripts hors Worker, **rien à déployer**

> `apps/web/scripts/content/social-lot-v5-mix.ts` (nouveau), `social-lot-v5.ts`, `social-lot-v5-fixes.ts`, `social-lot-v5-export.ts`, `prepare-social-month.ts` (scripts locaux, pas dans le Worker) : une case sans vanne au niveau passe au repli du mix (`mix-formats-s15.md` §2 et §6 : conseil, ligne d'article notée, carrousel R9, quiz seul, relais LinkedIn ; plafonds ; jamais de conseil sur LinkedIn), avec des textes pris UNIQUEMENT dans `docs/social/preparation/textes-formats-valides.json` (vide à ce jour, option `--textes-formats`). **Dry-run 1a identique octet pour octet** (JSON et Markdown, sha256 `63a2f315…`). Dry-run 1b : 18 erreurs (13 « repli du mix sans texte validé » + 5 légendes déjà connues) contre 22 ; commande de textes : `docs/social/preparation/lot-1b-besoins-textes.md`. Aucune migration, aucune variable d'environnement, aucune insertion. tsc, ESLint, build et Jest complet verts.

## s15 lot social (07/10/2026, soir) : textes tranchés à l'aveugle appliqués, scripts hors Worker, **rien à déployer**

> `apps/web/scripts/content/social-lot-v5-{legendes,fixes}.ts` et `social-lot-v5.ts` (scripts locaux, pas dans le Worker) : 4 légendes du lot 1a ; X du lun. 12/10 = vanne du pool strict sans renvoi ni lien (`CASES_VANNE`, tirée après le lot, V011 `cmmnsqn130038th63fxn1wvhn`) ; 1b : IG 21/10 = carte vanne simple V028 (post fixe `IG-21-10`), légende du 30/10. **Dry-run 1a : 0 erreur, 12 posts, prêt pour l'insertion du ven. 09/10 10:15 UTC** (`docs/social/preparation/lot-1a-dry-run-07-10.md`). Aucune migration, aucune variable d'environnement, aucune insertion. tsc, ESLint, build et Jest complet (3 795 PASS) verts.

## s17 tour 3 de la notation visuelle (07/10/2026) : corrections @fullstack, **DÉPLOYÉ le 07/10/2026 à 21:58 (Paris), version `cca01a65`** (N-1 `712ee919`), avec le lot s17 ci-dessous

> Focus clavier conservé sur l'interrupteur et le choix du jour du rappel (aria-disabled + garde), un seul « Réessayer » et « Ta progression est intacte. » dans l'étape en échec, message d'échec de validation près du bouton, finitions de focus et de défilement. **Aucune migration, aucune variable d'environnement.** tsc, ESLint, Jest complet (3 770 PASS) et `npm run build` verts en local.

## s17 tour 2 de la notation visuelle (07/10/2026) : corrections @fullstack et @copywriter, **DÉPLOYÉ le 07/10/2026 à 21:58 (Paris), version `cca01a65`** (N-1 `712ee919`), avec le lot s17 ci-dessous

> Rapport : `docs/marrant/audit-parcours-apprentissage-s17/iterations/iter-1-corrections.md` (section « Tour 2 »). Chargement et échec du contenu Premium (progression gardée dans le navigateur, liée au compte ; squelette ; « Réessayer »), finitions design et UX du tour 2, 7 doublons « Ce que tu vas apprendre » réécrits (`parcours-seed.json`, lu à l'affichage, rien à rejouer en base). **Aucune migration, aucune variable d'environnement.** tsc, ESLint, Jest complet (3 765 PASS) et `npm run build` verts en local.

## s17 tour 1 de la notation visuelle (07/10/2026) : corrections @fullstack, **DÉPLOYÉ le 07/10/2026 à 21:58 (Paris), version `cca01a65`** (N-1 `712ee919`), avec le lot s17 ci-dessous

> Rapport : `docs/marrant/audit-parcours-apprentissage-s17/iterations/iter-1-corrections.md`. Code seul (interface, textes, token Tailwind `error-text`, smoke `murs-premium.spec.ts:115` réaligné) : **aucune migration, aucune variable d'environnement**. tsc, ESLint, Jest complet (3 756 PASS) et `npm run build` verts en local. Mise en ligne après 10/10 @design et @ux (choix fondateur du 07/10).

## s17 (07/10/2026) : parcours d'apprentissage, lots A à E (serveur, interface, entrées, contenu, réserves de la revue) @fullstack : **DÉPLOYÉ le 07/10/2026 à 21:58 (Paris), version `cca01a65`** (N-1 `712ee919`)

> **Déploiement du 07/10 (GO de Thomas : « Finissons et déployons »)** par @infrastructure, depuis l'arbre principal propre, commit `4914126` (branche `claude/marrant-s10-session-recovery-CtZyw`). Version en ligne : **`cca01a65-46ee-4640-83ee-9fbe6b35f770`** ; N-1 pour le retour arrière : **`712ee919-f9db-42d6-bb32-78ca5fcd553b`** (`npx wrangler rollback 712ee919-f9db-42d6-bb32-78ca5fcd553b`). Les deux `secret put` ont créé des versions intermédiaires (ancien code + nouveaux secrets) : le N-1 à utiliser reste `712ee919`.
> - **Migration 13** (21:56 Paris) : port Postgres direct fermé dans la session, donc fichier `migration.sql` exécuté par le driver HTTP Neon (38 instructions, une transaction en lecture-écriture, découpage qui respecte les blocs `DO $$`). Passe 1 OK, passe 2 OK. **Vérification : `1 | 3 | 2`** (colonne, tables, niveaux) ; en plus : 9 contraintes (3 PK, 5 FK, 1 CHECK) et 8 index sur les 3 tables.
> - **Secrets** posés par stdin (aucune valeur écrite) : `ANALYTICS_EMAILS_EXCLUS`, `PARCOURS_SUIVI_ACTIF_DEPUIS` (= jour du déploiement) ; `UNSUBSCRIBE_HMAC_SECRET` présent.
> - `npm run build:cf && npm run deploy:cf` (variable `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice) : OK, 21:58 Paris.
> - **Tâches de démarrage** : sous Workers, elles ne tournent PAS à la première requête (cron `0 1 * * *` ou appel manuel, `docs/infra/cloudflare-runbook.md`). Appel manuel `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`) : 200 en 10 s. Logs : `parcours-content:s17-v1 : 1 parcours mis à jour, 0 absent(s) ; étapes : 0 mise(s) à jour, 0 créée(s), 0 conseil(s) introuvable(s).` et `défis s17 : 5 retouché(s) [repartie-1, confiance-1, repartie-4, machine-a-cafe-3, confiance-4], 0 déjà en place, 0 introuvable(s) [], 0 en échec [].` Le 2e appel donne `déjà appliqué (skip)` et `0 retouché(s), 5 déjà en place` (idempotence prouvée).
> - **Contrôles en lecture seule** : `/api/health` 200, bloc `critical` ok (base, Stripe live mensuel et annuel, Resend). Le statut global est `degraded` à cause de la fraîcheur du contenu (conseils, vidéos, LLM), comme avant, sans lien avec s17. `/`, `/parcours`, `/parcours/repartie`, `/parcours/confiance`, `/parcours/machine-a-cafe`, `/login`, `/register`, `/abonnement`, `/sitemap.xml` (4 URL parcours), `/llms-full.txt` : 200 ; `/profil` : 307 vers `/login?callbackUrl=%2Fprofil`. Pour un visiteur, sur les 3 parcours : étape 1 lisible (texte du conseil et quiz), aperçu des étapes 2+ (titre, module), **aucun texte ni défi de conseil payant, aucun quiz ni vanne des étapes 2+ dans le HTML**, une seule balise robots. Chromium (`/`, `/parcours`, `/parcours/confiance`) : 0 erreur console. Google : bouton, puis écran `accounts.google.com` atteint (`redirect_uri` = `/api/auth/callback/google`). `/api/auth/providers` (google, credentials), `/session`, `/csrf` : 200. Logs `wrangler tail` : aucune erreur sur 66 requêtes.
> - **KO (régression s17, P2, sans rollback), CORRIGÉ le 07/10 à 22:34 (Paris) par `f8905bc3`** (voir « s17 correctif P2 » en tête du fichier) : `/parcours/slug-inexistant` répond **200** (et non 404) avec **2 balises robots** (`noindex, follow` + `noindex`), en cache comme en rendu frais (`MISS`). Cause : le `loading.tsx` ajouté par le lot B dans `app/(dashboard)/parcours/` place `[slug]` dans une frontière Suspense, le flux part en 200 avant le `notFound()`, et Next ajoute son propre `noindex`. Aucune indexation possible (noindex), mais soft 404. Correctif à faire par @fullstack (par exemple, limiter le `loading.tsx` à la liste via un groupe de routes, et ne plus poser `robots` dans `generateMetadata` quand le parcours est inconnu).
> - **Préexistant, sans lien avec s17** : au tick cron de 20:00 UTC, job de publication sociale, avertissement `WebAssembly.instantiate(): Wasm code generation disallowed by embedder` suivi de « Posts publiés via cron HTTP » (code social inchangé depuis s16). À vérifier par @fullstack.
> - **Non vérifié (pas de compte Premium de test, aucun formulaire soumis en prod)** : connexion par mot de passe (preuve indirecte : colonne présente, page et fournisseur `credentials` OK), validation d'une étape (première transaction interactive sous Workers + Hyperdrive), quiz, retour d'exercice, rappel, smoke E2E (il soumet des formulaires d'authentification), captures B3. Surveillance : `npx wrangler tail marrant --search parcours-progress` et alertes `parcours-progress-erreur` du digest du matin ; contrôle en base, en lecture seule : `SELECT count(*), max("completedAt") FROM "UserPathStepCompletion";` (une ligne doit apparaître à la première validation réelle). Étape 1 d'un parcours (ISR 1 h) : l'ancien défi peut rester affiché jusqu'à 23:00 Paris environ.
>
> Rapports : `docs/marrant/audit-parcours-apprentissage-s17/impl-lot-{a,b,c,d,e}.md`, revue : `revue-croisee.md`. Code non commité (l'orchestrateur committe après vérification globale). Mise en ligne sur feu vert de Thomas en une ligne (`docs/founder-preferences.md`).
>
> **BLOQUANT (B1) : la migration 13 doit être jouée ET vérifiée AVANT le déploiement.** Le nouveau code lit la colonne `User.lastPracticeAt`. Prisma lit toutes les colonnes de `User` dès qu'une lecture n'a pas de `select` : c'est le cas de la connexion par mot de passe (`lib/auth.ts`), de l'adaptateur d'auth (connexion Google), de `/api/user` (compte, profil) et des mises à jour de l'abonnement (`lib/stripe-activation.ts`, webhook Stripe : `user.update` sans `select` relit toute la ligne). Sans la migration, **connexion, compte et paiement tombent**, pas seulement la validation d'étape. Rendre le code tolérant à une colonne absente n'a pas été retenu (lot E) : il faudrait masquer la colonne pour tout le client Prisma (Node et Workers), adaptateur compris, ce qui n'est ni léger ni testable sans base réelle. La garde, c'est l'ordre ci-dessous.
>
> **Ordre exact**
> 1. Arbre principal **propre** sur le commit s17 (jamais un worktree) : `cd apps/web && npx tsc --noEmit -p tsconfig.build.json && npm run lint && npm run build`, Jest complet vert.
> 2. **Migration Neon** `13_parcours_s17` (idempotente, additive : colonne `User.lastPracticeAt`, tables `UserPathStepCompletion`, `UserPathStepFeedback`, `ParcoursReminderPreference`, niveaux `COMIQUE` et `LEGENDE`). Depuis `apps/web` : `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/13_parcours_s17/migration.sql`, **2 fois** (la 2e passe doit réussir ; vérifié en local sur Postgres 16).
> 3. **Vérification** (console SQL Neon ou driver HTTP, comme la migration 12). Attendu : `1 | 3 | 2`. Autre résultat : **on s'arrête, pas de déploiement.**
>    ```sql
>    SELECT
>      (SELECT count(*) FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lastPracticeAt') AS colonne,
>      (SELECT count(*) FROM information_schema.tables WHERE table_name IN ('UserPathStepCompletion', 'UserPathStepFeedback', 'ParcoursReminderPreference')) AS tables,
>      (SELECT count(*) FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'UserLevel' AND e.enumlabel IN ('COMIQUE', 'LEGENDE')) AS niveaux;
>    ```
> 4. **Variables du Worker** (`npx wrangler secret put <NOM>` ; aucune valeur dans le dépôt ni dans ce fichier) :
>    - `UNSUBSCRIBE_HMAC_SECRET` (déjà posé pour le CEO, 32 caractères minimum) : vérifier sa présence avec `npx wrangler secret list`. Absent : aucun rappel ne part (alerte `parcours-rappel-echec`), le reste marche.
>    - `ANALYTICS_EMAILS_EXCLUS` : les 3 e-mails de Thomas, séparés par des virgules, exclus du bloc « Parcours » du lundi et des alertes. **Valeur fournie par l'orchestrateur au déploiement, jamais écrite dans le dépôt.**
>    - `PARCOURS_SUIVI_ACTIF_DEPUIS` : date du jour du déploiement, `AAAA-MM-JJ`. L'alerte `parcours-suivi-muet` ne s'active que 7 jours après.
> 5. Relever l'ID de la version en ligne (N-1) : `npx wrangler deployments list`.
> 6. `npm run build:cf && npm run deploy:cf` (avec `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice, comme en s16). Journaliser ici le commit, l'ID de version et l'ID N-1.
> 7. **Logs du premier démarrage** (`npx wrangler tail`), tâche du lot D lancée après `applyCatalogueContentTask` :
>    - `[startup] parcours-content:s17-v1 : 1 parcours mis à jour, 0 absent(s) ; étapes : …, 0 conseil(s) introuvable(s).` (Confiance passe de `EXPERT` à `INTERMEDIAIRE`, nouvelle description). Un avertissement `conseil(s) introuvable(s)` est à remonter.
>    - `[startup] défis s17 : 5 retouché(s) [repartie-1, confiance-1, repartie-4, machine-a-cafe-3, confiance-4], 0 déjà en place, 0 introuvable(s) [], 0 en échec [].`
>    - Démarrages suivants : `parcours-content:s17-v1 déjà appliqué (skip).` et `défis s17 : 0 retouché(s) […], 5 déjà en place`.
>    - Les étapes 1 gratuites sont pré-rendues (ISR 1 h) : l'ancien défi peut rester affiché jusqu'à 1 h.
> 8. **Contrôles** : `/api/health` 200 (bloc `critical` vert) ; connexion mot de passe ET Google ; `/profil`, `/abonnement`, `/parcours`, `/parcours/confiance` (visiteur : aperçu des étapes 2+), `/parcours/slug-inexistant` (404, une seule balise robots) ; `cd apps/web && E2E_BASE_URL=https://deviens-marrant.fr npm run test:e2e:smoke` (tout vert, @s16 compris) ; avec un compte Premium de test : valider une étape (première transaction interactive sous Workers), finir le quiz, cocher un retour d'exercice, activer puis arrêter le rappel ; **captures B3** à 375, 768 et 1280 px (visiteur et Premium : aperçu, quiz avec lettres A à D, bilan, profil).
> 9. **Thomas (avis @legal C8)** : dans Resend, suivi d'ouverture et de clic désactivé pour le domaine d'envoi.
>
> **Jobs** portés par le cron `*/15` existant (aucun changement de `wrangler.jsonc`) : alertes des parcours à 4h UTC (digest du matin) ; rappel e-mail à 9h (Paris), envoyé seulement aux Premium qui l'ont activé avec une adresse vérifiée ou un compte Google (lot E : la case n'apparaît qu'à ces comptes).
>
> **Si la mise en ligne n'a pas lieu le 07/10** : passer `PARCOURS_PAGES_LASTMOD` (`lib/sitemap-parcours.ts`), `CONFIDENTIALITE_LASTMOD` (`app/sitemap.ts`) et « Dernière mise à jour » de `/confidentialite` à la date réelle (lot C).
>
> **Retour arrière**
> - Code : `npx wrangler rollback <ID N-1>`. La migration 13 reste en place (colonne et tables ajoutées, ignorées par l'ancien code). Ne jamais revenir en arrière sur la base avant le code.
> - Code déployé sans migration (connexions en erreur) : rollback immédiat vers N-1, puis étapes 2 et 3, puis redéploiement.
> - Un défi : `UPDATE "Tip" t SET exercise = d.note::json->>'before' FROM "DataPatch" d WHERE d."patchId" = 'parcours-defi:s17:<clé>' AND t.id = d.note::json->>'tipId';` puis supprimer la ligne `DataPatch` correspondante.
> - Parcours Confiance (niveau, description) : remettre les valeurs du seed N-1 (`git show <commit N-1>:docs/content/parcours-seed.json`) ; supprimer le marqueur `parcours-content:s17-v1` seulement si la tâche doit être rejouée.
> - Ne pas passer `CATALOGUE_CONTENT_PATCH_VERSION` à 2 tant que `conseils-seed.json` n'est pas aligné (FS-12, accord de Thomas) : les défis retouchés seraient écrasés.

## s15 (07/10/2026, 20:16 Paris) : H+45 Instagram OK, jour 2 = 2/2

- Carte vanne `sent` à 19:32, `instagram.com/p/DeM51N8lkhD/`, 2 images avec texte alternatif, légende sans lien, aucun FAILED. Semaine 0 : 5 posts sur 5 publiés (`docs/social/releves/2026-10-07.md`).

## s15 (07/10/2026, 13:17 Paris) : H+45 X OK (jour 2)

- Post quiz X `sent` à 12:33 Paris, lien réel `x.com/…/status/2107781291353481416`, UTM `quiz`, aucun FAILED. 313 caractères bruts acceptés : correctif `longueurX` prouvé en ligne (`docs/social/releves/2026-10-07.md`).

## s16 (07/10/2026) : audit parcours, lots A à H (connexion, achat, compte, finition, textes validés, corrections, juridique, réserves de la revue croisée) @fullstack : **DÉPLOYÉ le 07/10/2026 à 14:31 (Paris), version `d7fd90b2`**

> **Déploiement du 07/10 (GO de Thomas)** : commit `ecb34b6` (+ spec corrigée). Ordre suivi : réglages Stripe faits par Thomas (vérif API : portail `subscription_update.enabled=true` mais **aucun prix coché** et liens CGU/confidentialité du portail vides : à compléter par Thomas, étape 2a/2e ; URL des CGU des Informations publiques non lisible par API) → migration 12 appliquée sur Neon (driver HTTP, 2 passes OK, 11 colonnes) → ID N-1 relevé : **`79ddf8bd`** → `wrangler secret put STRIPE_CHECKOUT_CGU_CONSENT` (version intermédiaire `5f55d130`) → `build:cf` + `deploy:cf` (avec `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` factice) → **`d7fd90b2`**. Variables de build absentes de la session (vérif Google/Bing, profils sociaux, CWV) : déjà absentes de la prod précédente, aucune régression. Après déploiement : `startup-tasks` OK ; `/api/health` 200, bloc `critical` ok (base, Stripe live mensuel + annuel, Resend) ; 14 pages en 200 (`/profil` → 307 login, attendu) ; beacon Cloudflare absent ; **smoke E2E prod : 112/112 verts** (2 sautés volontaires) après correction d'une spec restée sur l'ancien texte provisoire. **Retirer `E2E_EXCLURE_S16`** si elle avait été posée. Reste : achat réel D1 de Thomas (liste de contrôle ci-dessous). Retour arrière : `npx wrangler rollback 79ddf8bd`.

> **Portail client Stripe réglé par Claude le 07/10 (~15:00 Paris, mode « Accept edits », commandes approuvées une à une par Thomas)** : configuration `bpc_1TCSOyRqTNSm2ji5rIlRwXnS`. AVANT : `subscription_update.enabled=true` sans aucun prix, liens CGU/confidentialité vides. APRÈS : changement de formule entre `price_1UMUmURqTNSm2ji544PLYGuZ` (2,99 €/mois) et `price_1UN4pdRqTNSm2ji5hM2fWxbY` (24,99 €/an), quantité NON modifiable, `proration_behavior=always_invoice` (inchangé), passage annuel → mensuel en fin de période (inchangé), résiliation en fin de période et mise à jour de carte (inchangées), liens `/cgu` et `/confidentialite`. Retour arrière : renvoyer `features[subscription_update][products]=` vide et `business_profile[...]=` vides (état complet sauvegardé hors dépôt).

> **Correctif paiement + achat réel D1 (07/10, ~15:15 Paris)** : le premier essai de Thomas (13:05 UTC) a révélé que **aucun appel Stripe n'aboutissait sous Workers** depuis la bascule du 30/09 (SDK en variante Node, `NodeHttpClient`, délai dépassé à chaque appel ; 0 client, 0 session créés). Correctif `httpClient: Stripe.createFetchHttpClient()` (`lib/stripe.ts`), tsc/lint/build/jest 3599 OK, déployé : **`712ee919`** (N-1 `d7fd90b2`). Achat réel à 13:15 UTC : session Checkout fr, bouton « S'abonner », case CGU requise et acceptée, 3DS demandé puis payé (2,99 €), 15 événements livrés (0 en attente), compte PREMIUM ACTIVE mensuel 299, échéance 07/11, e-mail de confirmation envoyé 1 fois (marqueur), `invoice.payment_failed` du 3DS sans e-mail client (1er paiement, attendu). Remboursement total à 13:20 UTC (demandé par Thomas) → `charge.refunded` a résilié l'abonnement chez Stripe (`canceled`, aucun prélèvement à venir) → compte FREE / CANCELED. **D1 validé.** Libellé de relevé et nom public Stripe passés à `DEVIENS-MARRANT.FR` par Thomas au tableau de bord (vérifié par API, ~15:30 Paris).

> Code commité par l'orchestrateur après vérification globale (tsc, lint, build, Jest complet), **non déployé**. Rapports : `docs/marrant/audit-parcours-s16/impl-lot-{a,b,c,d,e,f,g,h}.md` (revue : `revue-croisee.md`). Réglages Stripe et Cloudflare : `docs/marrant/audit-parcours-s16/impl-infrastructure.md` (étapes 1 à 3 à faire par Thomas AVANT le déploiement).
> - **Migration Neon AVANT déploiement** : `12_add_retractation_request` (idempotente), depuis `apps/web` : `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/12_add_retractation_request/migration.sql`, à jouer 2 fois (la 2e passe doit réussir). Sans elle, `/api/retractation` répond 500.
> - **Variable** `STRIPE_CHECKOUT_CGU_CONSENT` (secret du Worker) : mettre `true` SEULEMENT après la déclaration de l'URL des CGU dans Stripe (étape 1 d'`impl-infrastructure.md`). Absente = pas de case CGU au paiement, rien ne casse.
> - **Nouveau job** de réconciliation Stripe, chaque jour à 4h UTC (`lib/billing/stripe-reconciliation.ts`, lecture seule, résultat dans le digest admin). Porté par le cron `*/15` existant : aucun changement de `wrangler.jsonc`.
> - **Liens de réinitialisation du mot de passe émis avant le déploiement : invalides** (seul le hash du jeton est stocké désormais). L'utilisateur redemande un lien.
> - **Thomas, réglages hors code** (`impl-infrastructure.md`) : Stripe, URL des CGU et de la confidentialité (Informations publiques) ; portail client (changement de formule avec les 2 prix, prorata, annuel vers mensuel en fin de période) ; relances (« Résilier l'abonnement » si toutes échouent). Cloudflare : couper l'injection Web Analytics (indépendant du déploiement).
> - **Procédure** : depuis l'arbre principal **propre** (jamais un worktree), `cd apps/web && npx tsc --noEmit -p tsconfig.build.json && npm run lint && npm run build`, puis `npm run build:cf && npm run deploy:cf`. Journaliser ici le commit, l'ID de version du Worker et l'ID N-1.
> - **Après déploiement** : `/api/health` en 200 (bloc `critical` vert), `/abonnement`, `/profil`, `/login`, `/register`, `/retractation`, `/confidentialite`, `/cgu` en 200 ; une vidéo se lance depuis `www.youtube-nocookie.com` (CSP `frame-src` réduite à ce domaine) ; achat mensuel réel par Thomas puis remboursement (reco 1).
> - **Retour arrière** : `npx wrangler rollback` (version N-1). La migration 12 n'ajoute qu'une table : elle peut rester en place.
> - **Lots E (textes validés) et F (corrections finales)** dans le même déploiement : aucune variable, aucune migration en plus (rapports `impl-lot-e.md`, `impl-lot-f.md`).
> - **Tests de bout en bout** (`impl-qa-e2e.md`) : nouveau workflow GitHub `.github/workflows/e2e-parcours.yml` (manuel + chaque jour 05:30 UTC ; workflows existants intacts). **Variable de dépôt** GitHub `E2E_EXCLURE_S16=true` à poser tant que s16 n'est pas en ligne ; **la retirer** après le déploiement et un smoke vert contre la prod. Job achat (manuel) : `vars.E2E_ACHAT_BASE_URL` (préprod, jamais la prod) + secret `STRIPE_TEST_SECRET_KEY` (`sk_test_…`, D7).
> - **Scripts** : `npm run test:e2e:smoke` (lecture seule, prod possible : `E2E_BASE_URL=https://deviens-marrant.fr`), `npm run test:e2e:achat` (préprod + `sk_test` uniquement, sinon ignoré), depuis la racine ou `apps/web`. À lancer après le déploiement : `cd apps/web && E2E_BASE_URL=https://deviens-marrant.fr npm run test:e2e:smoke` (tout vert attendu, @s16 compris).
> - **Lot G (juridique)** (`impl-lot-g.md`) : aucune migration ni variable. Checkout avec `submit_type: "subscribe"` (bouton « S'abonner ») et texte « commande avec obligation de paiement » ; remboursement 14 jours limité au premier paiement (CGU art. 6, /retractation, accusé). Après déploiement, ouvrir une session Checkout de l'achat test et vérifier le libellé du bouton et le texte sous le bouton.
> - **Lot H (réserves de la revue croisée)** (`impl-lot-h.md`) : aucune migration ni variable. Remboursement relu en version acacia (bon abonnement résilié en cas de doublon), alerte A `stripe-impaye-prolonge` (impayé > 21 jours) et `stripe-reconciliation-echec`, limiteur atomique, limite par e-mail sur « mot de passe oublié », contrôle d'origine (403) sur 5 routes, appli mobile acceptée.
> - **ID N-1 du Worker : le relever AVANT l'étape (3)** (`npx wrangler deployments list`) : `wrangler secret put STRIPE_CHECKOUT_CGU_CONSENT` crée déjà une nouvelle version du Worker (ancien code + nouveau secret) ; l'ID N-1 à noter pour le retour arrière est celui d'avant ce `secret put`.
> - **E2E du matin** : si le déploiement n'a pas eu lieu avant 05:30 UTC alors que le commit s16 est sur la branche du cron, poser `E2E_EXCLURE_S16=true` (variable de dépôt GitHub) AVANT 05:30, sinon le smoke @s16 échoue contre l'ancienne prod.
> - **Liste de contrôle de l'achat réel (étape 6, D1)** : (a) e-mail de confirmation reçu une seule fois, prénom, formule, montant TTC et date de renouvellement corrects, signature « L'Équipe Deviens Marrant » ; (b) Premium effectif (contenu Premium ouvert, plus de mur) ; (c) `/profil` : formule et prochaine échéance justes, boutons du portail ouvrent Stripe ; (d) remboursement total depuis le tableau de bord Stripe ; (e) chez Stripe, l'abonnement passe à `canceled` (aucun prélèvement à venir) ; (f) compte sans Premium (mur de nouveau visible, `/profil` sans abonnement) ; (g) digest admin du lendemain : aucune alerte inattendue (ni `paiement-remboursement-resiliation`, ni `stripe-reconciliation`, ni `stripe-webhook-erreur`).
> - **Ordre au déploiement** : (1) Thomas a fait les étapes Stripe 1 à 3 ; (2) migration `12_add_retractation_request` sur Neon ; (2 bis) relever l'ID N-1 du Worker ; (3) `STRIPE_CHECKOUT_CGU_CONSENT=true` sur le Worker ; (4) `npm run build:cf && npm run deploy:cf` depuis l'arbre principal propre ; (5) smoke E2E + `/api/health` ; (6) achat test réel de Thomas puis remboursement (liste de contrôle ci-dessus).

## s15 (07/10/2026, 10:09 Paris) : IndexNow, nouvel essai

- POST `/api/indexnow` avec les 8 URL du 06/10 (pilier, `/blog`, `/`, `meilleures-blagues-droles-2026`, `5-types-humour-lequel-pour-toi`, `autoderision-interactions`, `comment-avoir-de-la-repartie`, `phrases-droles-conversations`) : **429 encore** (renvoyé en 502 par la route). Pas de nouvel essai : Bing a déjà reçu ces URL le 06/10 (`SubmitUrlBatch` OK). Contrôles Google prévus à J+7 (13/10) et J+14 (20/10).

## s15 (07/10/2026, 08:17 Paris) : DÉPLOYÉ depuis l'arbre principal (propre, `e180d1a`), Worker `79ddf8bd-172f-4c44-91f6-06b786f9a78f` (N-1 `59948a54-5cb6-498d-a90f-156da93d6513`)

- **Vannes P0-072 et P0-041 au catalogue** (Neon, `isActive`, `GARDER`, technique, explication et décryptage de @copywriter, `docs/social/preparation/p0-a-inserer.json`) : `cp05d2c3950800b7575c12ce6`, `cp0465e601e49c114994d1a00`.
- **`POOL_STRICT` passe à 42** (`src/config/social-pool.ts`). Le Worker lit cette liste pour l'alerte de stock, d'où le déploiement.
- **Contrôles** :
  - tsc, lint et build OK ; Jest 3 261 PASS ;
  - dry-run 1a inchangé (12 posts identiques) ;
  - après déploiement : `/`, `/blog`, `/quiz-humour` et `/liens` en 200 ;
  - les 3 réseaux restent ouverts, canaux `ok` ;
  - `/blog/se-presenter-avec-humour` répond 404 comme attendu : l'article est programmé le 12/10 à 05:00 UTC, `isPublished=false`.
- **Fiche du carrousel IG du 21/10** (lot 1b) : V028, dans `docs/social/preparation/fiche-ig-21-10.md`. V007 est écartée, car elle est publiée sur X le 16/10. À intégrer au lot 1b, prêt le 14/10.
- **Carrousel du 23/12** : V083 est publiée sur Instagram le 13/10 par le lot 1a, donc à 71 jours du 23/12. La fiche neuve, déjà prévue avec le lot 2b, prendra une autre vanne.

## s15 (07/10/2026) : pilotage quotidien, script de lot seulement (aucun déploiement nécessaire)

- **Alertes lues (07:57)** : 8 alertes de classe B, aucun e-mail envoyé. Ce sont les files basses X, Instagram et LinkedIn (dernier post prévu le 08 ou le 09/10) et le rappel de lancement du lot 1a. Toutes sont attendues : le lot 1a (12 au 18/10) est inséré au plus tard le 09/10. Aucune action de Thomas.
- **`prepare-social-month.ts`** (`adc2048`) :
  - un relais Instagram porte `[article:<slug>]`, lu par la garde déjà en ligne : IG2 du 12/10 et relais IG du 26/10 ; un relais IG sans article devient une erreur bloquante ;
  - `--insert` régénère le lot de la même commande et refuse un JSON différent (l'ancien `lot-relance-s15.json` de 140 posts est refusé).
- **Relais X du 12/10** (`fa67cfe`) : V053 (9 / 8, sous la barre) est remplacée par la ligne de l'article notée au niveau, avec un nouveau renvoi. X3 du 21/10 passe de 283 à 264 caractères ; la formule signée par Thomas reste intacte.
- **Contrôles** : tsc, lint et build OK ; Jest 3 261 PASS.
- **Dry-run 1a** : 0 erreur, 12 posts (X 5, IG 5, LinkedIn 2), aucune vanne de la semaine 0 (`docs/social/preparation/lot-1a-dry-run-07-10.md`). Insertion le 09/10 : commande sans `--out` ni `--json`, relecture, puis la même commande avec `--insert --driver=neon-http`.
- **14 vannes hors lot** : 0 au niveau (`resultat-hors-lot-07-10.md`). Stock recompté au 12/10 : 23 libres, 25 avec P0 (`recoupements-07-10.md`).

## s15 (06/10/2026) : DÉPLOYÉ, Worker `59948a54-5cb6-498d-a90f-156da93d6513` (N-1 `34562fa8-bb76-487d-b01f-baf949da543e`, avant `1fda1ab3-12b1-4d8e-8564-cd92dabcd782`)

- **Bug signalé par Thomas** : la carte X du relais Halloween (05/10) affichait « Article introuvable ». Cause : `blog/[slug]/opengraph-image.tsx` ne cherchait que les articles statiques ; tous les articles EN BASE (dont les relais du lundi et du jeudi) avaient cette image. Correctif : même résolution que la page (`findBlogArticle`), `revalidate` 3600, libellé lisible de la catégorie, repli « Le blog humour et répartie ». Test `blog-og-image-db.test.tsx`. Jest 3 256 PASS ; tsc, lint OK.
- Vérifié en prod : image Open Graph de l'article Halloween = vrai titre. Le post X du 05/10 garde l'ancienne carte en cache chez X (pas de purge possible par API) ; les relais à venir auront la bonne image.

## s15 (06/10/2026) : profils sociaux

- **X : en-tête posé par la session** via l'API X v1.1 (`account/update_profile_banner`, clés `TWITTER_*` de l'environnement), fichier `docs/social/visuels-s15/bannieres/x-entete.png` (10/10 @design et @growth) ; vérifié : image servie par X identique. Lien de profil (`/liens/x`) et bio : déjà posés par Thomas.
- **LinkedIn : impossible par la session**, `LINKEDIN_ACCESS_TOKEN` expiré (401 `EXPIRED_ACCESS_TOKEN`). Couverture `linkedin-couverture.png` et site web `/liens/li` à poser par Thomas, ou nouveau jeton (droits d'administration de la page) pour que la session le fasse.
- **Instagram : impossible par API** (lien de bio, stories à la une, stickers lien) : à faire dans l'application (marche à suivre : `docs/social/visuels-s15/bannieres/notation-growth-cycle3.md`).
- L'API Buffer ne gère que les posts (aucune mutation de profil).

## s15 (06/10/2026, 20:15 Paris) : H+45 Instagram OK, jour 1 = 3/3

- 1er post Instagram réellement publié : `sent` à 19:32, `instagram.com/p/DeKVBhaIFPb/`, carrousel 2 images, légende sans lien, aucun FAILED. Jour 1 : 3 posts sur 3 publiés (`docs/social/releves/2026-10-06.md`).

## s15 (06/10/2026, 13:15 Paris) : H+45 X OK

- 1er post X de la relance : `sent` à 12:32 Paris, lien réel `x.com/…/status/2107418777784570269`, aucun FAILED (`docs/social/releves/2026-10-06.md`).

## s15 (06/10/2026, 09:00 Paris) : H+45 LinkedIn OK

- 1er post LinkedIn depuis le 09/08 : `sent` à 08:18 Paris, lien réel `linkedin.com/feed/update/urn:li:share:7513120421135708160`, aucun FAILED, 3 réseaux ouverts (`docs/social/releves/2026-10-06.md`).

## s15 (06/10/2026) : DÉPLOYÉ depuis l'arbre principal, Worker `1fda1ab3-12b1-4d8e-8564-cd92dabcd782` (N-1 `03e279cf-0e52-4f01-945b-6701d10c79be`)

- Contenu : `5a0a2bf` (haut de page du pilier : En bref 1A, title/H1 2A, intro 3B ; titres alignés dans `/vannes` et `/videos`) + `7761333` (carte « Commence ici » de `/blog`). Jest 3 254 PASS ; tsc, lint OK.
- Prod : 7 pages 200 ; `<title>` et H1 du pilier = « Comment devenir drôle : 5 piliers et un plan sur 30 jours » ; nouvel « En bref » présent. Bing `SubmitUrlBatch` (pilier, `/blog`) OK ; IndexNow : voir essai programmé du 07/10.
- Thomas : demande d'indexation du pilier dans Search Console (une fois, maintenant que la nouvelle version est en ligne).

## s15 (06/10/2026) : haut de page du pilier `/blog/comment-devenir-drole` (étalons 1A, 2A, 3B) @fullstack : **DÉPLOYÉ** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration, aucun package, aucune variable d'env, aucune requête SQL (article statique), aucun event Umami, aucune URL changée. Contrôles : tsc 0, lint 0 erreur, build OK, Jest 3 254 PASS / 2 skipped. Journal et mesure du diff (9,9 % du contenu) : `docs/seo/pilier-haut-de-page-applique-s15.md`.
> - **Title = H1** : « Comment devenir drôle : 5 piliers et un plan sur 30 jours » (aussi dans le JSON-LD de `/vannes` et `/videos`). **En bref** réécrit (1A). **Intro** : paragraphe ajouté après celui de l'oncle, avec lien vers `/blog/exercices-developper-humour` (3B).
> - `updatedAt` du pilier = `2026-10-06` : **si le déploiement a lieu un autre jour, reporter la date** (`apps/web/src/lib/blog-articles.ts`, slug `comment-devenir-drole`).
> - **Après déploiement** : `/blog/comment-devenir-drole` en 200, `<title>` et H1 au nouveau texte ; `/vannes`, `/videos` en 200. Puis IndexNow pour le pilier ; **Thomas** : Search Console > Inspection de l'URL du pilier > « Demander une indexation » (une seule fois).

## s15 (06/10/2026, ~08:10 Paris) : DÉPLOYÉ depuis l'arbre principal, Worker `03e279cf-0e52-4f01-945b-6701d10c79be` (N-1 `fd1a595d-7c52-47a8-9e1e-417930b9534a`)

- Contenu : `6167a50` (liens L1 à L7 vers le pilier `/blog/comment-devenir-drole`, `updatedAt` 2026-10-06). Contrôles : tsc 0, lint 0 erreur, Jest 3 248 PASS / 2 skipped.
- Prod : `/`, `/blog`, pilier, article n°1, `/register`, `/api/health` 200 ; liens vers le pilier rendus : accueil 2, `/blog` 3, article n°1 3.
- IndexNow : 429 (limite, envoi en lot du 05/10) → à refaire ; **Bing `SubmitUrlBatch` : OK** (8 URL : pilier, `/blog`, `/`, article n°1 et les 4 articles modifiés).
- **Thomas** : Search Console > Inspection de l'URL `https://deviens-marrant.fr/blog/comment-devenir-drole` > « Tester l'URL en direct » > « Demander une indexation ». Contrôle par l'API d'inspection à J+7 (13/10) et J+14 (20/10).

## s15 (06/10/2026) : liens vers le pilier `/blog/comment-devenir-drole` (L1 à L7, `docs/seo/pilier-non-indexe-s15.md`) @fullstack : **DÉPLOYÉ le 06/10, Worker `03e279cf`** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration, aucun package, aucune variable d'env, aucune requête SQL (les 6 articles touchés sont statiques), aucun event Umami, aucune URL changée, rien supprimé. Journal avant/après et mesure du diff : `docs/seo/liens-pilier-appliques-s15.md`.
> - **L1** footer : « Comment devenir drôle » avant « Blog » (toutes les pages). **L2** accueil : phrase sous les 3 cartes « Tu te reconnais ? ». **L3** `/blog` : bloc « Commence ici » au-dessus de la liste.
> - **L4** article n°1 : lien dans l'intro (le lien final reste). **L5** une phrase dans `comment-avoir-de-la-repartie`, `5-types-humour-lequel-pour-toi`, `phrases-droles-conversations`, `autoderision-interactions`. **L6** pilier : 5 liens sortants (exercices, 8 habitudes, répartie, pourquoi les blagues ne marchent pas, `/quiz-humour`), haut de page non touché.
> - **L7** `updatedAt` du pilier = `2026-10-06` : **si le déploiement a lieu un autre jour, reporter la date** (`apps/web/src/lib/blog-articles.ts`, slug `comment-devenir-drole`) avant de déployer.
> - **Après déploiement** : `/`, `/blog`, `/blog/comment-devenir-drole`, `/blog/meilleures-blagues-droles-2026` en 200 avec le lien visible ; `/sitemap.xml` : `lastmod` du pilier à la date de L7. Puis **Thomas** : Search Console > Inspection d'URL du pilier (version apex) > « Tester l'URL en direct » > « Demander une indexation » (une seule fois) ; IndexNow pour le pilier, `/blog` et `/`.

## s15 (07/10/2026, soir) : corrections cycle 8 de la relance sociale (@fullstack) : scripts seulement, AUCUN déploiement

> Fichiers hors Worker (`apps/web/scripts/content/`), rien à déployer, rien inséré. Détail : `docs/social/corrections-cycle8-fullstack.md`.
> - `--rollback --lot <id>` est **borné par `--debut`/`--fin`** (comptes et UPDATE, pilotes `tcp` et `neon-http`) : annuler 1b (19 au 25/10) ne touche plus 1a. Le contrôle après `--insert` ne compte plus que les replis de la tranche insérée.
> - Tirage : V028 (`cmmnsqn130033th63b54ux45o`) et V060 (`cs14jk577fa779cb48fa9b55`) exclues (`RESERVEES_CARROUSEL`). V083 reste au lot 1a (IG 13/10).
> - Légendes Instagram : plus aucun pied « deviens-marrant.fr » ; légende rattachée à la vanne (`social-lot-v5-legendes.ts`), contrôle bloquant au dry-run. **Le dry-run 1a bloque sur 3 légendes à fournir par @copywriter avant le 09/10 10:15 UTC** (`docs/social/preparation/lot-1a-dry-run-07-10.md`, Verdict).
> - X3 du 21/10 : renvoi = `FORMULES.quizCourt` (246 `longueurX`). Avertissement « copain / copine » (> 2 par semaine, `[HYPOTHÈSE]`).

## s15 (06/10/2026, 07:50 Paris) : PREUVE `--insert` / `--rollback` en `--driver=neon-http` sur la base réelle (point QA cycle 6 et 7) : FAIT

- Lot fictif `preuve-http-2031` (1 post X daté du 06/01/2031, jamais publiable avant) : `--insert --driver=neon-http` : « Inséré : 1 posts APPROVED… Contrôle après insertion : conforme » ; `--rollback` sans `--confirmer` : comptes seulement, « Rien n'a été modifié » ; `--rollback --confirmer` : « Annulés (REJECTED) : 1. Après : {REJECTED:1} » ; ligne supprimée ensuite (reste 0). À noter : `--rollback` exige `--debut` et `--fin` (utilisés par le filtre depuis le cycle 8, 07/10 soir).

## s15 (06/10/2026, 07:45 Paris) : DÉPLOYÉ depuis l'arbre principal (propre), Worker `fd1a595d-7c52-47a8-9e1e-417930b9534a` (N-1 `4eebf8aa-682d-4b7e-9f33-f2b3ed37bd9f`)

- Contenu : `fcafdff` (au plus un e-mail admin par jour, classes A/B/C, `GET /api/admin/alertes`, digest 07:30) + `8fc22df` (suppression du compte gratuit L1 à L3, L5, L6 ; étalons validés par Thomas ; CGU : phrase retirée ; `origine`/`contenu` sur `abonnement-*`).
- Contrôles : tsc 0, lint 0 erreur, Jest 3 232 PASS / 2 skipped (217 suites).
- Vérifié en prod : 11 pages 200 (`/`, `/liens`, `/liens/x`, `/register`, `/login`, `/abonnement`, `/vannes`, `/quiz-humour`, `/parcours`, article n°1, `/api/health`) ; visiteur inchangé (`/api/jokes` 10, `/api/tips` 3, `/api/videos` 3) ; « compte gratuit » : 0 occurrence sur 7 pages ; `/register` = « Étape 1 sur 2 », « Ton compte » ; `/api/admin/alertes` 200 (0 alerte) ; 3 réseaux ouverts, canaux ok.
- **Rupture de série Umami** (`blog-cta-clic` : `inscription` → `abonnement`, `etape-1`) datée du 06/10 07:45 Paris (`docs/social/mesure.md` §6).
- Reste `[À VÉRIFIER]` : contrôle visuel 3 formats (header desktop avec « Activer mon accès ») ; relecture @copywriter de `docs/copy/textes-appliques-compte-gratuit-s15.md` ; e-mail légal de reconduction (« repasse en gratuit », @legal) ; requête SQL sur `BlogArticle.content` ; brouillon aux 11 comptes NON envoyé (`docs/copy/brouillon-email-11-comptes-s15.md`).

## s15 (06/10/2026) : suppression du compte gratuit (spec `docs/product/suppression-compte-gratuit-s15.md`, L1 à L3, L5, L6) @fullstack : **DÉPLOYÉ le 06/10, Worker `fd1a595d`** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration, aucun package, aucune variable d'env, aucune donnée modifiée ni supprimée (les 11 comptes FREE restent en base, XP, progression, réactions et votes compris). Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 232 PASS / 2 skipped (217 suites).
> - **Visiteur inchangé** : 10/3/3, fiches, contenu du jour, étape 1 lisible, quiz, carnet 1 fiche, recherche 3 (tests d'invariants `suppression-compte-gratuit-s15.test.ts`).
> - **Compte non abonné (dont les 11 FREE)** = visiteur : `POST /api/user/xp`, `/api/parcours/<id>/progress` (étape 1 comprise), `/api/jokes/<id>/like`, `/api/features/vote` répondent 403 sans écrire ; réactions gardées en local ; « À toi de jouer » des fiches vanne et XP des conseils réservés aux abonnés ; `/profil` sans progression/série/stats/parcours, badge « Aucun abonnement », phrase « XP conservés » si `xp > 0` ; header « Activer mon accès ».
> - **Tunnel** : `/register` = « Étape 1 sur 2 » avec formule et prix ; après inscription (e-mail ou Google) `/abonnement?…&auto=1` ouvre Stripe sans clic (paramètre retiré de l'URL avant l'appel ; rien après `upgrade=cancel`) ; 409 = lien « Connecte-toi » ; `/abonnement` visiteur sans bloc gratuit ; `/onboarding` sans session → `/abonnement` ; « Commencer ce parcours » → `/parcours/<slug>` direct ; fiches et fin d'article vers `/abonnement` (retour + `src`).
> - **Textes** : étalons 1.2, 2.1, 3.1, 3.2c, 4.1 appliqués, 12 CTA de `config/blog-cta.ts` déclinés (titres gardés), CGU §2 : seule la phrase « Un compte gratuit donne accès à une partie du contenu » retirée. Liste avant/après : `docs/copy/textes-appliques-compte-gratuit-s15.md` (relecture @copywriter).
> - **Umami** : `abonnement-clic` + `declencheur: auto|manuel` ; `origine`/`contenu` sur `abonnement-clic`, `abonnement-reussi`, `abonnement-annule` ; `inscription-*` + `etape: "abonnement"` ; `blog-cta-clic` : `inscription` devient `abonnement`, nouveau `etape-1`. **Rupture de série à dater** dans `docs/social/mesure.md` §6 le jour du déploiement.
> - **E-mail aux 11** : brouillon seulement (`docs/copy/brouillon-email-11-comptes-s15.md`), NE PAS ENVOYER sans GO.
> - **Après déploiement** : `/`, `/register?plan=annual` (« Étape 1 sur 2 », 24,99 €/an), `/abonnement` (pas de « Compte gratuit »), `/onboarding` sans session (→ `/abonnement`), `/cgu` §2, `/api/health` 200 ; une inscription test jusqu'à l'écran Stripe puis abandon (`abonnement-annule`, pas de relance) `[À VÉRIFIER en prod]` ; dater la rupture Umami.

## s15 (06/10/2026, 07:40 Paris) : INCIDENT, déploiement `c328c3de-7f5b-4fd9-87c6-e7f3abc6e704` en 500 partout, RETOUR ARRIÈRE immédiat vers `4eebf8aa-682d-4b7e-9f33-f2b3ed37bd9f` (site 200 vérifié, coupure environ 1 min)

- Contexte : déploiement de `fcafdff` (un seul e-mail admin par jour) depuis un worktree propre (`git worktree` + liens symboliques vers `node_modules`), pour exclure le travail non commité d'un autre agent. tsc et Jest (3 189 PASS) verts dans ce worktree.
- Cause probable `[À VÉRIFIER]` : bundle OpenNext incomplet à cause des `node_modules` en lien symbolique (pas le code). **Règle : ne jamais déployer depuis un worktree à `node_modules` symbolique** ; déployer depuis le dépôt principal, arbre propre (aucun fichier non commité), ou faire `npm ci` dans le worktree.
- `fcafdff` reste À DÉPLOYER (à faire dès que l'arbre principal est propre), puis vérifier `/`, `/api/health` et `GET /api/admin/alertes`.

## s15 (06/10/2026) : moins d'e-mails admin (1 digest par jour au plus) @fullstack : **DÉPLOYÉ le 06/10, Worker `fd1a595d`** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration (stockage dans la table existante `CeoMemory`, namespace `admin_alert`), aucun package, aucune variable d'env, aucun event Umami, aucun Cron Trigger nouveau (le digest tourne dans `scheduler-tick` toutes les 15 min). Inventaire : `docs/qa/inventaire-emails-admin-s15.md`.
> - **Plus aucun e-mail par alerte** : `sendAdminAlert` supprimé ; social (couverture, publish-social, buffer-status-check, pauses), IA (pannes LLM, coupe-circuit budget) et contrôle qualité passent par `recordAdminAlert` (`lib/admin-alerts.ts`), une ligne par clé et par jour de Paris.
> - **Classe A** (Thomas doit agir : token Buffer, canal Buffer à reconnecter, crédit/clé/permission Anthropic, coupe-circuit budget) : **un seul digest par jour**, 07:30 heure de Paris (retentes jusqu'à 09:59), rien si aucune action. Le lundi, il voyage dans le rapport des visites de 07:00.
> - **Classe B** (file basse, lot en retard, stock, lancement, vagues, jalons, 429, échecs, relais, repli image, non confirmés, pause sur échecs, qualité, panne modèle) : `GET /api/admin/alertes` (Bearer `ADMIN_PASSWORD`, `?jours=1..30`, `?classe=A|B`, `?apercu=1` pour lire sans dater la lecture). **Les routines du matin de la session doivent l'appeler chaque jour.**
> - **Filet** : sans lecture de la route depuis 48 h, les alertes B en attente partent dans le digest.
> - Clé de pause automatique scindée : `social-auto-pause-canal-*` (A) / `social-auto-pause-echecs-*` (B).
> - **Après déploiement** : `curl -H "Authorization: Bearer $ADMIN_PASSWORD" https://deviens-marrant.fr/api/admin/alertes` → 200 `{ success: true, alertes: [...] }` ; le lendemain matin, au plus 1 e-mail (« [Marrant] N action(s) pour toi »), aucun si rien à faire.

## s15 (06/10/2026, ~00:15 Paris) : DÉPLOYÉ par la session, Worker `4eebf8aa-682d-4b7e-9f33-f2b3ed37bd9f` (N-1 `c5c0529b-db00-4cd7-bfca-218bf1273c01`)

- Contenu : `9c1367b` (test d'intégration route → vrai `buffer-client` par réseau, alerte de repli image → texte LinkedIn, marqueurs conservés sur échec, pont du quiz dans le générateur, test d'heure A/B par jour X et Instagram du 12/10 au 09/11 mardi à jeudi, heures B : X 09:00, IG 12:30 ; LinkedIn garde l'heure A pendant le test image).
- Contrôles : tsc 0, lint 0 erreur, Jest 3 155 PASS / 2 skipped (212 suites). Prod : `/`, `/liens`, `/liens/x`, `/liens/li`, `/register`, `/api/health` 200, `/liens/ig` 404 ; 3 réseaux ouverts, canaux ok.
- Dry-run `relance-s15` (non inséré) : 0 erreur bloquante jusqu'au 02/11 (38 posts) ; 122 manques de stock du 03/11 au 03/01 (attendu : pilote P0 du 09/10, 14 hors lot, vague V1). Les fichiers `lot-relance-s15.{md,json}` du dépôt restent l'ancienne version (140 posts) : NE PAS INSÉRER, régénérer.
- Carrousel 4 cartes du post IG du 07/10 (S1) NON appliqué : le rendu exige 5 parties dont « Le quiz est dans le lien de la bio. », fausse tant que les liens de bio ne sont pas posés ; le post reste en 2 cartes (format validé).

## s15 (05/10/2026, nuit) : correctifs cycle 7 (QA 1 et 5, @social F1 et S3) @fullstack : **DÉPLOYÉ le 06/10, Worker `4eebf8aa`** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration (marqueurs dans `directorNote`), aucun package, aucune variable d'env, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 155 PASS / 2 skipped (212 suites).
> - **publish-social** : repli LinkedIn image → texte = e-mail d'alerte, 1 par jour (clé `social-repli-image-linkedin`, mécanisme `sendDailyPublishFailureAlert`, e-mail en échec sans effet sur l'envoi). Échec définitif (400/401/403, retry épuisé, X trop long) : les marqueurs `[variante:…]`, `[heure:…]`, `[article:…]`, `[repli:…]`, `[date:…]` sont conservés en tête de la note (compteur par bras juste).
> - **Test d'heure alterné par jour** (`mesure.md` §7 c) : `HEURE_B_PARIS` X 09:00, Instagram 12:30, LinkedIn 17:15 inactif ; `TEST_HEURE` X et Instagram du 12/10 au 09/11 exclu, LinkedIn `null` (heure A tant que le test image tourne) ; mar. à jeu. seulement : mar. A, mer. B, jeu. A, puis l'inverse (`src/lib/social/heure-test.ts`). Le script de lot pose `[heure:A|B]` ; la reprise (`replanifierRetards`) garde l'heure B d'un post `[heure:B]`.
> - **Pont du quiz** : `FORMULES.quizCourt` = « Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription : ».
> - **Test d'intégration** : `publish-social-buffer-reel.test.ts`, route + vrai `buffer-client` + vrai rendu de carte (seuls `fetch`, Prisma et e-mail simulés), textes exacts de `lot-semaine0.json`.
> - **Dry-run `relance-s15 --pool strict`** (rien inséré, fichiers du dépôt non modifiés) : lot complet 12/10 au 03/01 = 122 erreurs bloquantes, toutes de stock (« aucune vanne ne passe », dès le 03/11 ; identique avec l'ancien pont). Fenêtre `--fin 2026-11-02` : 0 erreur, 38 posts (X 16, Instagram 16, LinkedIn 6), 0 vanne de `semaine0`, LinkedIn image 2 / texte 2, heure X A 5 / B 4, Instagram A 5 / B 4.
> - **Après déploiement** : rien à vérifier en prod tant qu'aucun post `[heure:B]` ou `[variante:image]` n'est en base ; au 1er `[variante:image]`, suivre le point 4 de la notation QA cycle 7.

## s15 (05/10/2026, ~22:45 Paris) : DÉPLOYÉ par la session, Worker `c5c0529b-db00-4cd7-bfca-218bf1273c01` (N-1 `16638a00-0521-444a-9a85-642c1f498104`, avant : `c32b0f0b-ea8b-479d-a972-eaef036a1739`)

- Contenu : `81641f8` (LinkedIn carte unique 4:5 en test alterné dès le 13/10, contrôle « pain » sur la base) + `4c108db` (`/liens` 3 routes, `origine`/`contenu`, navigateur intégré, e-mail avant Google) + correctif de la session : `/liens/[reseau]` répondait 404 en prod avec `dynamicParams = false` (OpenNext) ; passé à `true`, 404 conservé par `notFound()` (test adapté).
- Contrôles avant déploiement : tsc 0, lint 0 erreur, Jest 3 133 PASS / 2 skipped (210 suites).
- Vérifié en prod : `/liens`, `/liens/x`, `/liens/li` 200 (UTM `utm_source=x|linkedin`, `utm_campaign=bio`, `utm_content=bio-*`), `/liens/ig` 404, `/register`, `/login`, `/quiz-humour`, article n°1 et `/api/health` 200 ; 3 réseaux ouverts, canaux Buffer ok.
- **Preuve Buffer avec les URL réelles (05/10, ~23:00)** : post LinkedIn de test `[variante:image]` inséré REJECTED (jamais publiable), `/api/social/image?postId=…&slide=0` = 200 `image/png` 1080×1350 en 3,0 s (rendu relu) ; brouillon Buffer LinkedIn 1 image `6ac4092438629554e340a405` et brouillon Instagram 2 cartes (post réel de semaine0, slides 0 et 1) `6ac409274e17d6a1b256ddc3` acceptés (`status: draft`, assets image) puis supprimés ; post de test supprimé de la base.
- Reste : liens de bio des 3 comptes à pointer vers `/liens` (Instagram), `/liens/x`, `/liens/li` (action dans les applications, Thomas ou session si accès) ; tests sur appareil des navigateurs intégrés `[À VÉRIFIER]` (Thomas a renoncé aux tests sur téléphone : surveillance des événements `inscription-*` par `origine`) ; lot `relance-s15` à régénérer avec les marqueurs `[variante:…]` avant le 13/10.

## s15 (05/10/2026, nuit) : parcours réseau → site, C2 et C3 (`/liens` 3 routes, `origine`/`contenu`, navigateur intégré) @fullstack : **DÉPLOYÉ le 05/10, Worker `c5c0529b`** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration, aucun package, aucune variable d'env, aucun nouvel événement Umami (2 propriétés ajoutées). Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK (`/liens` ○, `/liens/x` et `/liens/li` ● prérendues, `/register` et `/login` ○ statiques), Jest 3 133 PASS / 2 skipped (210 suites).
> - **C1 `/liens`** : 3 routes (`/liens` Instagram, `/liens/x`, `/liens/li`, `liens/[reseau]` en `dynamicParams = false` : toute autre route = 404), ISR 300 s. Ordre : article publié depuis moins de 48 h, sinon quiz `/quiz-humour` ; l'autre ; vanne du jour ; Répartie ; vannes ; conseils. Chaque lien : `utm_source` du réseau, `utm_medium=social`, `utm_campaign=bio`, `utm_content=bio-*` du bloc. Article statique (date seule) : 48 h comptées depuis minuit UTC du jour.
> - **C2 attribution** : `utm_source`/`utm_content` lus à chaque page (sessionStorage, listes blanches `x|instagram|linkedin` et les 11 `utm_content` de v5 §2), ajoutés en `origine`/`contenu` à `quiz-termine`, `parcours-etape`, `inscription-envoi`, `inscription-reussie` (e-mail et retour Google), `onboarding-termine`, `blog-cta-clic` ; `src`, `methode` et autres propriétés intacts ; sans arrivée sociale, événement inchangé.
> - **C3 à C5 inscription** : `order-first` retiré (e-mail avant Google pour tous). Navigateur intégré détecté au montage (agent utilisateur, sans middleware ni `Vary`) sur `/register` ET `/login` : Google désactivé + message v5 §2.4 + « Ouvrir dans mon navigateur » (Android : URL `intent:` vers Chrome) et « Copier le lien » (en premier sur iOS) ; le lien garde `callbackUrl`, `src`, `origine`, `contenu`. **Réglage par application dans `apps/web/src/config/in-app-browser.ts`** : Instagram, Facebook, LinkedIn = Google bloqué ; X = Google actif `[HYPOTHÈSE : à reproduire sur appareil]`. Si le test contredit, changer la ligne de l'application, rien d'autre.
> - **Après déploiement** : `curl -s -o /dev/null -w "%{http_code}\n"` sur `/liens`, `/liens/x`, `/liens/li` (200) et `/liens/ig` (404) ; puis remplacer les liens de bio provisoires par `/liens`, `/liens/x`, `/liens/li`. **Tests appareil (v5 §2.6, avant le J0 de chaque réseau)** : dans Instagram, X, LinkedIn, puis Safari et Chrome : (1) marqueur détecté ou non, (2) Google refusé ou non (`disallowed_useragent`), (3) inscription e-mail aboutie dans l'application, (4) bascule : « Ouvrir dans mon navigateur » (Android) et copie du lien (iOS), arrivée sur `/register?…&origine=…&contenu=…`, (5) un événement Umami de test portant `origine`. Consigner ici les résultats et la date (registre des J0, `mesure.md` §6).

## s15 (05/10/2026, nuit) : LinkedIn carte unique 4:5 en test alterné texte / image dès le 13/10 @fullstack : **DÉPLOYÉ le 05/10, Worker `c5c0529b`** (titre corrigé le 11/10 : commit ancêtre de `b248ad8`, déployé le 08/10 version `8e377821`, vérifié par `git merge-base --is-ancestor`)

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé**. Aucune migration (marqueurs dans `directorNote`), aucun package, aucune variable d'env, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 133 PASS / 2 skipped (210 suites).
> - **`/api/social/image`** : un post LINKEDIN dont `directorNote` porte `[variante:image]` et qui est éligible (`threadParts` = [amorce, chute], texte de 2 lignes dont la 1re est l'amorce mot pour mot, sans lien, amorce de 140 caractères au plus) reçoit **1 carte 4:5 1080×1350**, exactement la carte chute violette d'Instagram (chute seule, « » R6, pied, sans « Glisse »). Les autres posts LinkedIn gardent l'ancien rendu (aperçu admin). `carteVanneUnique("linkedin")` passe de 1200×627 à 4:5 et n'a plus de repli amorce + chute (amorce > 140 refusée).
> - **publish-social** : un post `[variante:image]` éligible part par `createBufferImagePost` (1 image `slide=0`, texte = l'amorce seule, alt = amorce + chute avec « », sans métadonnée Instagram). La carte est d'abord **rendue dans le Worker** (pas d'appel à l'URL publique) ; si le rendu échoue ou si le post n'est pas éligible : **texte seul** (`post.content` complet, amorce + chute), post PUBLISHED, `directorNote` passé à `[variante:texte] … Repli texte seul (prévu avec carte) : <cause>`. `[variante:texte]`, X, Instagram : inchangés. `[variante:…]` survit aux relances.
> - **Script de lot** (hors Worker) : dès `LI_TEST_IMAGE_DES` = 13/10, les vannes LinkedIn éligibles alternent `[variante:image]` / `[variante:texte]` (paires de même note du pool si possible, sinon alternance simple, ordre inversé d'une paire à l'autre) ; bras image : `threadParts` = [amorce, chute], 1 URL `slide=0`. Compteur par bras dans le récapitulatif (.md et console). Relais avec lien (L3), textes de marque (L2) : hors test. **« pain »** : contrôlé aussi contre les posts déjà en base (30 jours, tous réseaux).
> - **Lot `relance-s15` à régénérer** pour porter les marqueurs (`--lot relance-s15 --pool strict`, dry-run), puis relecture avant insertion.
> - **Après déploiement** : `curl -s -o /dev/null -w "%{http_code} %{content_type} %{time_total}\n" "https://deviens-marrant.fr/api/social/image?postId=<id LinkedIn [variante:image]>&slide=0"` → 200 image/png ; brouillon Buffer LinkedIn image réel (preuve K4) puis suppression. Preuves locales : `docs/social/visuels-s15/v5-linkedin/` (2 PNG + `alt.json`, `scripts/render-carte-linkedin.ts`).

## s15 (05/10/2026, soir) : correctifs QA cycle 6 (R1 longueur X, R4 alerte 429, insertion HTTP) @fullstack : **DÉPLOYÉ** le 05/10 à 20:03 UTC par la session (Worker `c32b0f0b-ea8b-479d-a972-eaef036a1739`, N-1 pour `wrangler rollback` : `0edcaee7-9e95-4b61-9acb-4c22ff8861f0`). Preuve R1 : brouillon X réel du texte exact du post du 07/10 (328 bruts) accepté par Buffer (`status: draft`) puis supprimé ; interrupteurs relus : 3 réseaux ouverts ; accueil 200.

> Commit poussé sur `claude/marrant-s10-session-recovery-CtZyw`, **non déployé** (la session principale déploie). Aucune migration, aucun package, aucune variable d'env, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `npm run lint` 0 erreur, `npm run build` OK, Jest 3 026 PASS / 2 skipped (203 suites).
> - **BLOQUANT, à déployer avant le 07/10 10:15 UTC (R1)** : `src/lib/social/buffer-client.ts`, `ensureContentLength` compte X comme X (`longueurX`, lien = 23, même fonction que la route) au lieu de la longueur brute ; s'applique aux 2 chemins (texte seul et avec image). Sans ce déploiement, le post X du 07/10 (quiz, 328 bruts, 244 comptés par X) passe en FAILED « Contenu trop long ». LinkedIn et Instagram : inchangés (longueur brute).
> - **R4** : `publish-social`, un 429 Buffer (réseau bloqué 24 h) envoie maintenant une alerte, 1 par jour et par réseau (clé `social-429-<réseau>`, verrou existant) ; un e-mail en échec ne casse pas le passage.
> - **Script d'insertion** (`scripts/content/social-lot-v5-insert.ts`, hors Worker) : en `--driver=neon-http`, `--insert` = UNE instruction `INSERT` multi-lignes (`$executeRaw`, enums castés, `text[]`, `createdAt`/`updatedAt` = `NOW()`) et `--rollback --confirmer` = UN `UPDATE` (même filtre). Vérifié : `updateMany` échouait AUSSI en HTTP (« Transactions are not supported in HTTP mode »). Pilote `tcp` inchangé. Reste à prouver `[LIVE]` sur une branche Neon avant le lot 1a du 09/10 : `--insert --driver=neon-http` puis `--rollback --lot <id> --confirmer`.
> - **Après déploiement** : brouillon X réel (`saveToDraft`) du texte de `c2acdc88…` puis suppression (preuve R1, voir `docs/social/notation-relance-cycle6-qa.md`).

## s15 (05/10/2026, 21:45 Paris) : RÉSEAUX ROUVERTS, démarrage avancé au mar. 06/10 (Thomas : plan validé, « qu'est-ce qui ne va pas ? ») : FAIT par la session

- **Aucun déploiement** (Worker inchangé : `0edcaee7-9e95-4b61-9acb-4c22ff8861f0`, N-1 `108da3e7-bac9-42fe-b6b1-71bedcd0143d`).
- **Lot `semaine0` (06/10 au 09/10) inséré en APPROVED** (`approvedBy` « lot-semaine0 ») : 10 posts, X 4 (12:30), Instagram 4 (19:30, carrousel 2 cartes), LinkedIn 2 (mar. et jeu. 08:15). Vannes du pool strict uniquement (≥ 8,5 chez 2 relecteurs). Échanges manuels relus : vannes de bureau sur LinkedIn (Rome, visio), ~~vanne mentionnant « une IA » retirée~~ **erreur corrigée le soir même : la vanne du prof est rétablie le 09/10 (l'IA comme sujet de vanne est autorisée, choix du 30/09 ; la règle interdit seulement de dire qu'un contenu est écrit par une IA)**. Contrôles bloquants : 0 erreur, 0 doublon. Fichiers : `docs/social/preparation/lot-semaine0.{md,json}` (le .md est le dry-run d'avant les échanges, le .json fait foi).
- **Script** : `J0` du lot avancé au 06/10 pour les 3 réseaux (`apps/web/scripts/content/social-lot-v5-config.ts`) ; les jalons de mesure restent comptés depuis `J0_SOCIAL` = 12/10. Jest social : 335 tests OK.
- **Défaut trouvé** : `--insert --driver=neon-http` échoue (« Transactions are not supported in HTTP mode » : `createMany` via l'adaptateur HTTP). Insertion faite par une requête SQL multi-lignes unique (mêmes garde-fous : période, ids, autres posts actifs = 0). **À corriger dans le script avant le lot 1a du 09/10.**
- **Interrupteurs** : LINKEDIN, TWITTER, INSTAGRAM repris via `/api/admin/social/platforms` (05/10 19:44 UTC), canaux Buffer connectés (`isDisconnected:false`, files non en pause). Cartes Instagram vérifiées en prod (`/api/social/image`, slides 0 et 1).
- **Premiers posts** : LinkedIn 06/10 08:15, X 12:30, Instagram 19:30 ; vérifications H+45 programmées (routines).

## s15 (05/10/2026) : fiabilité de la relance sociale (QA cycles 1 à 3) : lots par tranche, reprise sûre, garde des relais, job de couverture @fullstack

> Commit local, non poussé, non déployé, **rien inséré en base**. **Aucune migration** (marqueurs dans `directorNote`), aucun package, aucune nouvelle variable d'env (`ADMIN_EMAIL`, `RESEND_API_KEY`, `BUFFER_*`, `ADMIN_PASSWORD` existants), aucun LLM, aucun event Umami. Contrôles : `tsc -p tsconfig.build.json` 0, `next lint` 0 erreur, `npm run build` OK, Jest 3 010 PASS (baseline 2 954).
> - **Déploiement normal** (`build:cf` puis `deploy:cf`). Effets en ligne, réseaux toujours en pause tant que l'admin ne les reprend pas.
> - **Script de lot** (`prepare-social-month.ts`, jamais lancé ici) : `--lot <id libre> --debut AAAA-MM-JJ --fin AAAA-MM-JJ [--pool fichier|strict]` (dry-run) ; `--pool` = vannes autorisées dans l'ordre (meilleures d'abord, sans mélange), `strict` = `src/config/social-pool.ts` (40 vannes au niveau, Alexa V100 exemptée, ordre par note moyenne des 2 relecteurs) ; retour à 90 jours **sur un autre réseau** que la 1re diffusion, sauf pénurie (avertissement). approvedBy = `lot-<id>` (`thomas-s15` pour `relance-s15`, bornes par défaut 12/10 au 03/01). `--insert [--driver=neon-http]` : refus si un autre post actif occupe la période, puis **contrôle après insertion** par réseau et par semaine (attendu contre inséré, code 1 si écart). `--rollback --lot <id>` : comptes seulement ; `--rollback --lot <id> --confirmer` : posts APPROVED jamais envoyés du lot en REJECTED, comptes avant et après ; réinsertion sous un nouvel identifiant.
> - **Marqueurs posés par le lot** : `[article:<slug>]` (relais), `[repli:<id>]` (relais d'un article pas encore visible : un **repli** en réserve, vanne du même thème sans lien, inséré en REJECTED avec `[repli-de:<id du relais>]`), `[date:AAAA-MM-JJ]` (pivot, saison). Le lot `relance-s15` déjà relu doit être **régénéré** pour porter ces marqueurs.
> - **publish-social** : garde `articleSlug` : un relais part seulement si l'article est visible (`findBlogArticle`, même règle que la page) ; sinon relais REJECTED et son repli part **sur le même créneau** ; sans repli, créneau vide ; alerte par réseau (`social-relais-<réseau>`). Alerte d'échec Buffer **par réseau** (`social-echec-<réseau>`, C8). Les marqueurs survivent aux relances.
> - **Reprise** (`/api/admin/social/platforms`) : **503 si Buffer est injoignable** ; posts en retard de plus de 24 h, relais et posts datés : REJECTED « expiré à la reprise » ; le reste 1 par jour, jamais un dimanche ni un jour de silence (11/11, 27/11), à l'heure de Paris du réseau (X 12:30, Instagram 19:30, LinkedIn 08:15, heure d'hiver comprise). Nouvelle action `{"platform":"TWITTER","action":"sauter-avant-j0","j0":"2026-10-19"}` : posts APPROVED datés avant le J0 passés en REJECTED.
> - **Job 5 ter « couverture »** (scheduler, 5h-21h UTC, verrou horaire) : pause automatique après 2 FAILED consécutifs depuis la reprise ; file basse (< 10 jours) ; tranche en retard à sa date de prêt (9 tranches du plan, J-14, insérés < prévus par réseau) ; **stock < 14 par réseau sur le pool strict** ; e-mails de lancement de tranche (et rappel si une file passe sous 21 jours), de vague V1 à V4 (démarrage et livraison), de jalon (dimanche d'avant J+14 à J+112, J0 12/10 dans `social-calendrier.ts`). 1 e-mail par jour, par réseau et par type, avec la consigne à coller. E-mail du lundi : consigne du relevé `docs/social/releves/AAAA-MM-JJ.md`.
> - **À tenir à jour** (commit + déploiement) : `src/config/social-pool.ts` à chaque vague validée ; `J0_SOCIAL` si un réseau glisse.
> - **Après déploiement** : `curl -s -X POST -H "Authorization: Bearer $ADMIN_PASSWORD" -H "Content-Type: application/json" -d '{"platform":"LINKEDIN","action":"sauter-avant-j0"}' https://deviens-marrant.fr/api/admin/social/platforms` → 400 (j0 manquant) ; `npx wrangler tail` : ligne `[scheduler:social-couverture]` au plus une fois par heure entre 5h et 21h UTC.

## s15 (05/10/2026) : lot complet de relance des 3 réseaux, préparé en DRY-RUN @fullstack

> Commit local, non poussé, non déployé, **rien inséré en base**. Aucune migration, aucune variable d'env, aucun event Umami. **1 devDependency** : `@prisma/adapter-neon@6.19.2` (+ `@neondatabase/serverless`), utilisée seulement par le script d'insertion (jamais importée par `src/`, absente du Worker).
> - **Lot** : `docs/social/preparation/lot-relance-s15.md` (relecture) et `lot-relance-s15.json` (lignes exactes) : 140 posts du 12/10/2026 au 03/01/2027 (X 58 à 12:30, Instagram 58 à 19:30, LinkedIn 24 à 08:15, heures de Paris, heure d'hiver du 25/10 vérifiée). Généré par `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15` (SELECT seulement).
> - **Insertion (plus tard, par la session principale)** : `npx tsx scripts/content/prepare-social-month.ts --lot relance-s15 --insert` (Prisma TCP) ou `--insert --driver=neon-http` (adaptateur HTTP Neon si le port 5432 est bloqué). Insère le JSON tel quel en APPROVED, `approvedBy = thomas-s15` ; refus si des posts `thomas-s15` existent déjà sur la période. Les interrupteurs par réseau décident ensuite de la publication.
> - **publish-social (effet après déploiement)** : la limite X de 270 se compte comme X (lien = 23, `src/lib/social/longueur-x.ts`) ; avant, l'URL UTM complète faisait échouer en FAILED tout post X avec lien (X3, relais, quiz).
> - **Carrousel de décryptage** : `threadParts` à 5 parties (amorce, chute, mécanisme, consigne, renvoi) = 4 cartes rendues par `/api/social/image` (`carrouselDecryptage`).

## s15 cycle 4 (05/10/2026) : visuels sociaux v4 (R6 sur cartes, décryptage 4 cartes, relais 2 cartes) @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun nouvel event Umami.
> - **Gabarits** (`templates/cartes-piste-a.tsx`, `carte-marque.tsx`, `carrousel-piste-a.ts`) : vanne à la 1re personne entre « » (lilas, « suspendu), « géant du conseil retiré, trait d'union en Inter, chiffre géant des couvertures retiré (nombre du titre en lilas, 64 px garantis au-dessus du pied), amorce 88 px, `carrouselDecryptage` (4 cartes), `carrouselRelais` (2 cartes), `defautsLegende`. LinkedIn : bouton « Lien dans le post », plus de « Glisse ».
> - **Effet en production après déploiement** : les carrousels Instagram générés par `generate-post-image.ts` (vanne, article) prennent ce rendu ; aucun réseau ne publie tant que les interrupteurs restent en pause.
> - **Visuels** : `docs/social/visuels-s15/v4/` (11 PNG + 6 tests de charge, `index.md`, `alt.json`).

## s15 cycle 3 (05/10/2026) : visuels sociaux v3 + chaîne de publication (interrupteur par réseau, LinkedIn, carrousel Instagram) @fullstack

> Commits locaux, non poussés, non déployés. **1 migration** (`11_social_platform_switch`, additive, idempotente, testée 2 fois de suite sur une base Postgres jetable), aucun package, aucune nouvelle variable d'env (`BUFFER_*`, `RESEND_API_KEY`, `ADMIN_PASSWORD` existants), aucun LLM, aucun nouvel event Umami.
> - **1. Migration Neon AVANT le déploiement du code** (le client Prisma du nouveau code lit les nouvelles colonnes) : depuis `apps/web`, avec le `DATABASE_URL` de production :
>   `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/11_social_platform_switch/migration.sql`
>   Crée `SocialPlatformSetting` avec **les 3 réseaux EN PAUSE** (X, Instagram, LinkedIn : rien ne part après déploiement) et ajoute à `SocialPost` : `imageUrls`, `bufferStatus`, `bufferCheckedAt`, `alertedAt` (+ index). Rejouable : une 2e exécution ne change aucun réglage fait dans l'admin.
> - **2. Déploiement Cloudflare normal** (`build:cf` puis `deploy:cf`).
> - **Interrupteur** : admin social (`/admin/social`, bloc « Publication par réseau ») : Pause / Reprendre par réseau, sans redéploiement (`/api/admin/social/platforms`, Bearer `ADMIN_PASSWORD`). Ligne absente ou base illisible = pause. Reprise refusée tant que le canal Buffer est déconnecté (et, depuis la section « fiabilité » du 05/10 ci-dessus, si Buffer est injoignable) ; posts en retard : voir cette section (plus de 24 h, relais et posts datés = REJECTED, le reste 1 par jour hors dimanches et silences, à l'heure de Paris). `PAUSED_PLATFORMS` supprimé : LinkedIn se publie dès qu'il est repris.
> - **Pause automatique** : à chaque passage de publish-social, un canal Buffer `isDisconnected` / `isLocked` / introuvable met son réseau en pause + e-mail (1 seul, `alertSentAt` posé après envoi). Même chose sur une erreur d'autorisation à la remise ou à la relecture. **Constat du 05/10 : le canal Instagram est déconnecté chez Buffer** (requête `channels`) → au 1er passage, e-mail « Instagram mis en pause automatiquement ». **Action Thomas** : reconnecter Instagram dans Buffer avant de reprendre.
> - **Alertes (D1)** : verrou « 1 e-mail par jour » posé APRÈS l'envoi accepté par Resend (`sendAdminAlert` renvoie un booléen et lit `{ error }`). Les posts à signaler gardent `alertedAt = null` jusqu'à l'envoi : aucune alerte perdue.
> - **Relecture Buffer (D2, D4)** : pages de 100 posts avec curseur, puis lecture par identifiant des absents (25 max par passe). Supprimé chez Buffer → FAILED `introuvable` ; bloqué `scheduled`/`sending` 6 h après l'heure prévue → `non_confirme` ; fenêtre 30 jours ; note du directeur conservée ; `sentAt` illisible sans casser le lot.
> - **Fils X interdits** : plus de découpage automatique ; un post X de plus de 270 caractères passe en FAILED « fil X interdit » (`createBufferThread` supprimé).
> - **Carrousel Instagram** : chaque post Instagram préparé (vanne ou relais d'article) part en carrousel v3 4:5 (1 URL par slide `/api/social/image?postId=…&slide=N`, ou `imageUrls` en base), texte alternatif amorce + chute. Vérifié le 05/10 : brouillon Buffer réel (`saveToDraft`, jamais programmé) à 3 images + alt sur le canal Instagram, accepté (`type: post`, `carousel` refusé pour Instagram), id `6ac3d30ed394a1ebb7bb3853`, supprimé aussitôt (`deletePost` OK, relecture NOT_FOUND). Refait le 05/10 avec les cartes v4 : brouillons à **2 images** (`6ac3dcbaa3332ccdd882b57d`) et à **4 images** (`6ac3dcbb1e475b8bb4506a37`) acceptés (`status: draft`, `type: post`, assets `image/png`), supprimés, relecture NOT_FOUND (`docs/social/visuels-s15/v4/index.md`). Cartes v4 : colonne de texte fixe (x = 144), espace entre mots +0,06 em, lignes imposées par `\n` (`mise-en-lignes.ts`), aucune action Replit.
> - **LinkedIn** : `prepare-social-month.ts` prépare X + Instagram + LinkedIn selon la cadence de `strategie-relance-v2.md` (`CADENCE_V2`, paramétrable pour la v3) ; LinkedIn mar./jeu. 08:15, relais d'article à angle bureau (lien UTM en 1er commentaire, colonne `cta`) sinon vanne BOULOT ; X mercredi = vanne + quiz ; Instagram mercredi = carrousel décryptage à préparer à part (avertissement).
> - **Rapport « prévu contre publié »** : admin social (7 jours) + `/api/admin/social/report?jours=N` + section dans l'e-mail du lundi (écart = prévus échus non confirmés, doit être 0).
> - **Visuels v3** : `docs/social/visuels-s15/v3/` (35 PNG, `index.md`, `alt.json`) ; polices `PlusJakartaSans-Bold.ttf` et `-ExtraBold.ttf` ajoutées, `Syne-*.ttf` supprimées.
> - **Après déploiement** : `/admin/social` → les 3 réseaux « En pause », Instagram « Canal en panne » tant qu'il n'est pas reconnecté ; 1 e-mail de pause automatique Instagram ; `curl -s -H "Authorization: Bearer $ADMIN_PASSWORD" https://deviens-marrant.fr/api/admin/social/report?jours=7` → JSON. Reprise d'un réseau : seulement après validation des posts modèles par Thomas.

## s15 (05/10/2026) : prototype rendu des cartes sociales « piste A » (carrousel 4:5, X, LinkedIn) @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami. **Publication inchangée** : `generate-post-image.ts` et Buffer appellent toujours les anciens gabarits carrés.
> - **Nouveaux fichiers** : `src/lib/social/typo.ts` (typographie française), `templates/carte-marque.tsx` + `templates/cartes-piste-a.tsx` (cartes), `carrousel-piste-a.ts` (composition), `renderSlides()` dans `image-generator.ts` (largeur et hauteur par slide). Polices `public/fonts/Syne-Bold.ttf` et `Syne-ExtraBold.ttf` (OFL) ajoutées, lues comme Inter (fichier local, binding ASSETS sous Workers, repli CDN gstatic).
> - **Gabarits hérités** (audit §5.8-9) : « » au lieu de `&ldquo;`, « Glisse » au lieu de « Swipe », « 50+ techniques » retiré, italique non rendu retiré, aucun texte sous 28 px.
> - **Rendu local** : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts` → `docs/social/visuels-s15/v2/`.
> - **Après déploiement** : rien à vérifier côté publication (aucun appel des nouvelles cartes en production tant que Thomas n'a pas validé les modèles).

## s15 (05/10/2026) : relecture du statut réel des posts Buffer + alerte d'échec @fullstack

> Commit local, non poussé, non déployé. **Aucune migration**, aucun package, aucune nouvelle variable d'env (`BUFFER_ACCESS_TOKEN`, `BUFFER_ORGANIZATION_ID`, `RESEND_API_KEY`, `ADMIN_EMAIL` existants), aucun LLM, aucun event Umami.
> - **Déploiement normal.** Nouveau job du scheduler `runBufferStatusCheckJob` (après publish-social, verrou horaire `buffer-status-check-AAAA-MM-JJ-hHH` non relâché : 1 passage par heure) et tâche de démarrage `reconcileBufferPostStatusesTask` (rattrapage, idempotente). Un seul appel GraphQL Buffer (`posts`, statuts `sent` + `error`, 100 plus récents, timeout 5 s).
> - **Sens des statuts** : PUBLISHED = remis à Buffer. Confirmé = ligne « Publication confirmée par Buffer le <sentAt> : <lien réel> » ajoutée à `directorNote` et `publishedAt = sentAt`. Buffer en `error` → FAILED + note « Échec publication Buffer : <message> (détail : <rawError>) ». Candidats : PUBLISHED non confirmés, `publishedAt` de moins de 7 jours. Buffer injoignable : aucun changement, nouvel essai l'heure suivante.
> - **Alerte** : e-mail à `ADMIN_EMAIL` (plateforme, message Buffer, « reconnecter le canal dans Buffer »), au plus 1 par jour et par plateforme (verrou `buffer-status-alert-<plateforme>-AAAA-MM-JJ`).
> - **Publication inchangée** : `PAUSED_PLATFORMS` (LinkedIn) intact, aucun post republié automatiquement.
> - **Après déploiement** : `/api/cron/startup-tasks` (ou le premier tick) doit passer le post Instagram du 02/10 en FAILED (admin social : note « Échec publication Buffer : Buffer has lost authorization… ») et envoyer 1 e-mail Instagram. **Action Thomas** : reconnecter le canal Instagram dans Buffer, puis reprogrammer le post.

## s15 (05/10/2026) : tunnel visiteur → inscrit → Premium réparé et mesuré, IndexNow protégé et étendu au catalogue @fullstack

> **Déployé le 05/10/2026 (Worker `fa296917`).** Aucune migration, aucun package, aucune nouvelle variable d'env (`CRON_SECRET`, `ADMIN_PASSWORD`, `INDEXNOW_KEY` existants), aucun LLM. Détail : `docs/qa/tunnel-inscription-s15.md`.
> - **Déploiement normal.** Plus de modale d'inscription : tous les boutons « créer un compte » d'un anonyme sont des liens `/register?callbackUrl=<destination>&src=<origine>` (header, accueil, fin d'article, quiz, parcours, /abonnement, modale Premium, fiches). Header : lien « Connexion » ajouté. `/login` : bouton « Créer un compte ». `/onboarding` anonyme → `/register` en 1 saut ; `/profil`, `/favoris` → `/login` en 1 saut. Formule choisie sur /abonnement retrouvée après inscription.
> - **Nouveaux événements Umami** (kebab-case, aucune donnée personnelle) : `inscription-envoi`, `inscription-reussie` {methode, src}, `connexion-reussie` {methode}, `onboarding-termine` {parcours}, `abonnement-clic` {formule, src}, `abonnement-reussi` {formule}, `abonnement-annule`, `quiz-termine` {profil}, `parcours-etape` {parcours, etape}. Stripe : `success_url` annuel suffixé `&formule=annuel`.
> - **Sécurité** : `POST /api/indexnow` exige `Authorization: Bearer <CRON_SECRET>` ou `<ADMIN_PASSWORD>` (401 sinon). **Cron `weekly-seo`** : notifie aussi IndexNow des URL du sitemap dont le lastmod a moins de 8 jours (1 POST, réponse `indexnow` dans le JSON), y compris en mode contenu préparé.
> - **OAuthCallback Google** : config vérifiée par curl (redirect_uri et cookies corrects) ; les 3 retours viennent d'un callback sans cookies NextAuth (navigateur intégré d'appli, délai > 15 min). Message clair ajouté. **Action Thomas** : vérifier l'URI de redirection et l'écran de consentement « En production » dans Google Cloud, faire une inscription Google réelle sur mobile ; si l'erreur revient, `npx wrangler tail` → `OAUTH_CALLBACK_ERROR`.
> - **Après déploiement** : `curl -s https://deviens-marrant.fr/ | grep -o 'href="/register[^"]*"'` (liens présents) ; `curl -sI https://deviens-marrant.fr/onboarding` → 307 `/register?callbackUrl=%2Fonboarding` ; `curl -s -o /dev/null -w "%{http_code}" -X POST https://deviens-marrant.fr/api/indexnow` → 401 ; dans Umami, voir apparaître `inscription-envoi` sous 48 h.

## s15 (05/10/2026) : titles et metas des 5 pages à CTR ≈ 0 (données GSC réelles) @orchestrator

> **Déployé le 05/10/2026 (Worker `fa296917`).** Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal.** `lib/blog-articles.ts` : title (= H1) et excerpt (= meta) de `5-types-humour-lequel-pour-toi` (« Humour observationnel : les 5 types », meta d'origine conservée avec ses humoristes, P0 Thomas), `comment-avoir-de-la-repartie` (« Avoir de la répartie : 10 techniques »), `autoderision-interactions` (« Autodérision : définition et exemples ») ; meta seule de `phrases-droles-conversations`. `/vannes` : title « Vannes et blagues drôles à ressortir », meta avec le chiffre dynamique. `/conseils` : ancre et JSON-LD alignés sur le nouveau titre répartie. Slugs, H2, FAQ, liens, chiffres du corps inchangés (empreintes du test `blog-em-dash-static` identiques hors meta).
> - **Humoristes (P0 05/10)** : règle « zéro humoriste » retirée du prompt `seo-blog-agent` (citations réelles bienvenues) et du contrôle bloquant `scripts/content/social-controls.ts`.
> - **Après déploiement** : vérifier le `<title>` servi des 5 pages, puis annoter le 05/10 dans GSC ; mesure à J+28 (cibles : `docs/seo/avis-donnees-reelles-s15.md` §8).

## s14 (05/10/2026) : « À lire ensuite » des articles CATALOGUE en base (notation B4 iter1) @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. Les articles forte frappe en base n'héritent plus des satellites du cluster `fort-volume` (« Comment faire rire une fille » sous la fête des mères) : liste dédiée par slug (`src/config/blog-related-cards.ts`), puis l'étalon ; « faire rire une fille / un homme » gardé seulement sous premier message et couple. Pas de remplissage par catégorie : moins de 3 cartes si les voisins ne sont pas encore publiés.
> - **Visibilité** : un article non publié ou programmé n'est jamais proposé (filtre SQL + `isBlogArticleVisible`). Étalon et 30 articles statiques : maillage inchangé. À vérifier après déploiement : bas de page de B4 (fête des mères).

## s14 (05/10/2026) : forte frappe, correctifs de code des notations B1/B2/A5 iter2 et A1/A3/A4 iter3 @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami. Texte stocké des vannes inchangé (tout se joue au rendu).
> - **Déploiement normal, avant le 22/10** (1re publication programmée). **Dates** : `publicUpdatedAt` (`lib/blog-visibility.ts`) : un article corrigé avant sa sortie n'affiche plus « Mis à jour le », ni `dateModified`, ni `lastmod` du sitemap, ni « Mis à jour » dans llms-full ; affichage seulement si updatedAt > date de publication.
> - **Guillemets** : seul un « » DANS un « … » extérieur passe en “…” (B2, A4, affiché et partagé, « » extérieurs gardés) ; les « » des messages A3 en blockquote restent « » (1er niveau). **Typo** : « 4 812 » et « 23 h 40 » insécables.
> - **Config** : B2 `blagues-de-gamer-jeux-video` → encart Répartie ; A5 : bouton « Partager l'idée n°N », titre « Idée de poisson d'avril », lien inchangé (`with-url`).
> - **Import** : refus de tout commentaire HTML `<!--` (B1 « <!-- FIN --> ») ; avertissement de jour passé de lundi à jeudi (calendrier forte frappe). À vérifier après déploiement : aperçus A4 n°17 et B2 n°7 (390 px), en-tête d'A3 sans « Mis à jour ».

## s14 (05/10/2026) : aperçu admin d'un article programmé `/blog/apercu/[slug]` + script de captures @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune nouvelle variable d'env (`ADMIN_PASSWORD` existant), aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. `https://deviens-marrant.fr/blog/apercu/<slug>?cle=<ADMIN_PASSWORD>` : la clé est comparée en temps constant, un cookie httpOnly signé (2 h, chemin `/blog/apercu`, sans le mot de passe) est posé, puis redirection 303 sans le paramètre. Accepté aussi : `Authorization: Bearer <ADMIN_PASSWORD>`. Sans autorisation ou mauvaise clé : 404.
> - **Rendu** : même gabarit que `/blog/[slug]` (factorisé dans `components/blog/blog-article-view.tsx`), article programmé ou déjà publié, plus un bandeau « Aperçu : publication prévue le JJ/MM/AAAA » (« article publié le … » si déjà en ligne). Page publique inchangée : HTML et métadonnées des 30 articles statiques identiques octet pour octet avant/après.
> - **Discrétion** : `noindex, nofollow` (meta + `X-Robots-Tag`), `Cache-Control: private, no-store`, `force-dynamic`, absent du sitemap et de llms. Umami muet sous `/blog/apercu` : `data-before-send` sur le script (vues et événements) + garde dans `lib/umami.ts`.
> - **Captures** : `ADMIN_PASSWORD=… scripts/content/snapshot-article.sh <slug> <dossier>` (depuis apps/web) : curl de l'aperçu en Bearer, CSS et polices inlinées, Playwright en `file://` : `m00.png…` (390 px, tranches de 1600 px), `d-haut.png`, `d-bas.png` (1280 px). À vérifier après déploiement : 404 sans clé, puis captures d'un article programmé.

## s14 (05/10/2026) : articles à forte frappe en base, partage par ligne, CTA A1, parcours imposé @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. Config unique `src/config/blog-forte-frappe.ts` : l'étalon + 11 slugs (statiques ou en base) reçoivent un bouton par ligne numérotée. Formats : `**N.** « vanne »`, `**N.** texte` sans guillemets (A1, A2), titre `**N. Situation**` suivi d'un blockquote (A3, « » du message rendus en “…”). Texte partagé : la ligne seule, sans numéro, indication ni markdown.
> - **Mode par slug** : `with-url` (étalon et articles de blagues : comportement actuel) ; `text-only` pour les 7 articles de messages (« Envoyer le message n°N », texte seul, sans titre ni lien). Événement inchangé : `blog-vanne-partage` {slug, vanne, canal}.
> - **CTA** de `message-anniversaire-drole-par-situation` après le corps (`blog-cta.ts`). **Encart parcours** imposé : premier message et couple → Confiance, anniversaire → Répartie. **Rapport hebdo** : 12 articles suivis (+ lot B).
> - **Étalon** : rendu HTML des 30 articles statiques identique octet pour octet avant/après. À vérifier après publication d'A1 et A3 : boutons sur mobile (375 px).

## s14 (05/10/2026) : rapport hebdo des visites, section « Blog : articles à forte frappe » @fullstack

> Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune nouvelle variable d'env (mêmes secrets `UMAMI_API_KEY`, `UMAMI_WEBSITE_ID`), aucun LLM.
> - **Déploiement normal**. L'email du lundi 7h et `POST /api/admin/visits-report?dryRun=1` (champ `report.blog`) ajoutent : événements `blog-sortie-clic`, `blog-cta-clic`, `blog-ancre-clic`, `blog-vanne-partage` semaine vs précédente, `blog-scroll` par palier (25, 50, 75, 100), puis pour chaque article de `src/config/blog-tracking.ts` (`TRACKED_ARTICLES`) : vues, variation, sorties, CTA, partages, part des vues lues à 75 %. Article non publié en base : « publication prévue le JJ/MM ».
> - **Endpoints Umami** : `metrics?type=event` (global et filtré `path=/blog/<slug>`), `metrics?type=path&path=/blog/<slug>`, `event-data/values?event=blog-scroll&propertyName=palier` (global et par path). Endpoint absent ou en erreur : section marquée « partielle », le reste de l'email part quand même.
> - **Correctif** : Umami a renommé `metrics?type=url` en `type=path` le 07/10/2025 ; le Top 5 des pages demande `path` et rejoue en `url` sur HTTP 400.
> - **À vérifier après déploiement** : lancer le dryRun, contrôler `report.blog.partial` et `report.blog.warnings` (aucune valeur secrète n'y figure).

## s14 (05/10/2026) : article « 50 blagues drôles », notation iter3, correctifs E1 à E3 @fullstack

> Correctifs de `docs/growth/notation-article-blagues-2026-iter3.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun event Umami.
> - **Déploiement normal**. Contenu inchangé (0 ligne) : slug, title, meta, H1, H2 et 50 vannes (empreinte SHA-256) intacts ; FAQ du JSON-LD toujours en texte brut.
> - **Tous les articles (rendu seul)** : FAQ (questions et réponses) et titres des cartes Précédent / Suivant / « À lire ensuite » en typographie française (espace insécable avant ? ! : ; et après un nombre). `frTypo` ne pose jamais 2 insécables d'affilée.
> - **Tous les articles (rendu seul)** : mot composé court (2 parties de 8 lettres max : Post-it, week-end, Wi-Fi) jamais coupé en fin de ligne, via un span `whitespace-nowrap`. Aucun caractère ajouté, texte visible et copier-coller identiques. Mesuré : 297 mots sur les 30 articles statiques, dont 14 dans cet article.
> - **« À lire ensuite »** : 2 colonnes en desktop quand il n'y a que 2 cartes (3 sinon). Mobile inchangé. À vérifier après déploiement : captures m01, m03, m07 et desktop bas de page.

## s14 (05/10/2026) : article « 50 blagues drôles », notation iter2, correctifs D1 à D3 @fullstack

> Correctifs de `docs/growth/notation-article-blagues-2026-iter2.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM, aucun nouvel event Umami.
> - **Déploiement normal**. Contenu de l'article inchangé (0 ligne) : slug, title, meta, H1, 8 H2, 50 vannes (empreinte SHA-256) intacts.
> - **Tous les articles** : « À lire ensuite » ne reprend plus un article déjà proposé en Suivant ou Précédent ; la place revient au prochain article du même cluster, sinon la section affiche moins de cartes.
> - **Tous les articles (rendu seul)** : une citation dans un passage déjà entre « … » s'affiche en “…”. Mesuré : 2 articles touchés sur 39 rendus (30 statiques + 9 réécritures en base), 40 occurrences (36 dans les 50 vannes, 4 dans techniques-humoristes-pros) ; aucun autre écart de texte visible.
> - **Surtitre de la navigation cluster** : « Blagues et vannes à ressortir », « Humour de saison », « Quand l'humour coince », « Timing et art de raconter » remplacent les libellés internes. À vérifier après déploiement : captures m00, m05, m07-m08.

## s14 (05/10/2026) : article « 50 blagues drôles », notation iter1, correctifs C1 à C13 @fullstack

> GO Thomas sur `docs/growth/notation-article-blagues-2026-iter1.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM.
> - **Déploiement normal**. Slug, title, meta, H1, 8 H2, 50 vannes (empreinte SHA-256), Définition, CLEF et FAQ inchangés. Contenu : environ 15 lignes modifiées sur 210 (sommaire remonté en 2e paragraphe + ancre Inclassables, lien « machine à café » vers `/parcours/machine-a-cafe`, 4 sorties de section réécrites, thèmes en puces, « Toi aussi » retiré, 3e mention de la blague du jour reformulée).
> - **Cet article** : CTA placé juste après le corps (avant la FAQ), nouveau texte et note « Gratuit, sans carte… » ; bouton 2,99 €/mois conservé. Bouton Partager (le même que sur les cartes de vannes) sur chacune des 50 vannes, lien partagé ancré `#vanne-N`.
> - **Tous les articles** : bouton d'inscription du CTA vers `/onboarding?src=blog-<slug>` (même page qu'avant, `src` ignoré par l'onboarding, visible dans Umami) ; puces Markdown réduites à un lien = zone de tap de 44 px.
> - **Umami** : `blog-scroll` passe à 4 paliers {palier: 25 | 50 | 75 | 100} ; nouveau `blog-ancre-clic` {slug, cible} (les ancres ne comptent plus dans `blog-sortie-clic`) ; nouveau `blog-vanne-partage` {slug, vanne (numéro), canal : natif | copie}. À vérifier après déploiement : Umami > Events.

## s14 (05/10/2026) : article « 50 blagues drôles » : audit growth R1 à R5 + mesure Umami @fullstack

> GO Thomas sur `docs/growth/audit-article-blagues-2026-s14.md`. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucune variable d'env, aucun LLM.
> - **Déploiement normal**. Article statique (`blog-articles.ts`) : la page `/blog/meilleures-blagues-droles-2026` est régénérée au build, `updatedAt` passe au 05/10/2026.
> - **Tous les articles** : chaque H2 reçoit un `id` stable (slug du titre, sans accents) ; texte des titres inchangé.
> - **Umami** (même script, `window.umami.track`) : `blog-sortie-clic` {slug, zone, section, cible}, `blog-cta-clic` {slug, bouton : inscription | premium | parcours}, `blog-scroll` {slug, palier: 75}, une fois par page. Actifs sur tous les articles de blog. À vérifier après déploiement : Umami > Events.
> - CTA de fin : textes propres à cet article (`src/config/blog-cta.ts`) ; bouton 2,99 €/mois inchangé ; autres articles inchangés.

## s14 (05/10/2026) : rapport hebdomadaire des visites (Umami) par email le lundi @fullstack

> Demande de Thomas. Commit local, non poussé, non déployé. Aucune migration, aucun package, aucun LLM. Secrets Worker `UMAMI_API_KEY` et `UMAMI_WEBSITE_ID` déjà posés (05/10) ; `RESEND_API_KEY` déjà requis.
> - **Déploiement Cloudflare normal** (`build:cf` puis `deploy:cf`). Aucun autre geste : le job tourne dans le scheduler existant (Cron Trigger 15 min, route `/api/cron/scheduler-tick`).
> - **Déclenchement** : lundi 7h-8h heure de Paris (heure d'été et d'hiver gérées), 1 seul email par semaine (verrou `JobLock` `weekly-visits-report-<lundi>`, conservé 6 jours après l'envoi, relâché en cas d'échec pour retenter au tick suivant de la même heure).
> - **Contenu** : 7 derniers jours complets (lundi à dimanche, heure de Paris) comparés aux 7 précédents : visiteurs, visites, pages vues, taux de rebond (écart en points), temps moyen par visite, variation en % (« nouveau » si la semaine précédente est à zéro) ; visites par jour ; top 5 pages et top 5 sources ; inscriptions (`User.createdAt`) et nouveaux Premium (`Subscription` plan PREMIUM créée dans la semaine) avec le taux d'inscription.
> - **Destinataire** : `ADMIN_EMAIL` du mailer existant (`src/lib/email.ts`, alex@deviens-marrant.fr, la même adresse que les alertes). Objet : « Visites deviens-marrant.fr : semaine du 28/09 au 04/10 (+21 %) » (variation des visiteurs).
> - **Manuel** : `curl -X POST -H "Authorization: Bearer $ADMIN_PASSWORD" "https://deviens-marrant.fr/api/admin/visits-report?dryRun=1"` renvoie le JSON sans envoyer ; sans `dryRun`, envoie l'email (hors verrou hebdo). 503 si secrets Umami absents, 502 si Umami répond en erreur.
> - Secrets absents : rien n'est envoyé, avertissement `[weekly-visits]` dans les logs. La clé n'est jamais journalisée (header `x-umami-api-key`, timeout 5 s).

## s14 (04/10/2026) : formule annuelle Premium 24,99 €/an + rappel légal de reconduction @fullstack


> **05/10/2026, annuel en ligne + webhook Stripe réparé (fait par Claude, autorisé par Thomas)**
> - Migration `10_annual_plan_renewal_reminder` appliquée sur Neon prod (3 colonnes `Subscription`, table `RenewalReminder`, index et FK vérifiés).
> - Prix Stripe live annuel `price_1UN4pdRqTNSm2ji5hM2fWxbY` (24,99 € TTC/an, `tax_behavior=inclusive`) ; secret Worker `STRIPE_PREMIUM_ANNUAL_PRICE_ID` posé. Session de paiement test à 24,99 € créée puis expirée (aucun paiement).
> - Bug corrigé : les webhooks Stripe arrivent en version d'API basil (fin de période sur `items.data[].current_period_end`) : date invalide → 500 depuis le 01/10. Lecture désormais compatible avec les deux versions.
> - Endpoint webhook recréé `we_1UN4rpRqTNSm2ji5DIZCWPSt` (6 événements), son secret posé sur le Worker ; ancien `we_1ULIyN…` supprimé. Les 2 abonnés de lancement resynchronisés (0,99 €/mois, périodes correctes). **La variable `STRIPE_WEBHOOK_SECRET` de l'environnement Claude Code est obsolète** (le Worker a la bonne valeur).
> - Secrets Worker `UMAMI_API_KEY` et `UMAMI_WEBSITE_ID` posés (rapport hebdo des visites en cours de développement).

> Décision de Thomas (04/10/2026). Commit local, non poussé, non déployé. Aucun package. Aucun appel Stripe (tests sur mocks). CGU et /retractation NON modifiées (texte @legal à intégrer par l'orchestrateur, `docs/legal/annuel-renouvellement-s14.md`).
> - **1. Migration Neon AVANT le déploiement du code** (additive et idempotente, testée 2× sur une base jetable) : depuis `apps/web`, avec le `DATABASE_URL` de production :
>   `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/10_annual_plan_renewal_reminder/migration.sql`
>   Ajoute `Subscription.billingInterval`, `priceAmountCents`, `cancelAtPeriodEnd` (défaut false) et la table `RenewalReminder`. Ordre impératif : le client Prisma du nouveau code lit ces colonnes (webhook Stripe) ; code déployé sans migration = webhooks en 500 (retentés par Stripe, mais à éviter).
> - **2. Déploiement Cloudflare normal** (`build:cf` puis `deploy:cf`). Sans autre action, le site reste strictement mensuel (2,99 €/mois) : l'annuel est invisible partout et `POST /api/stripe/checkout {plan:"annual"}` répond 503, sans repli sur le mensuel.
> - **3. Activation de l'annuel, quand Thomas le décide** : créer dans Stripe un prix récurrent annuel 24,99 € EUR sur le produit Premium, puis poser le secret Worker `STRIPE_PREMIUM_ANNUAL_PRICE_ID` (`wrangler secret put STRIPE_PREMIUM_ANNUAL_PRICE_ID`). Aucun redéploiement : `/abonnement` (SSR dynamique : sélecteur Mensuel/Annuel, metadata, JSON-LD P1M + P1Y, FAQ) bascule à la requête suivante ; `llms.txt` / `llms-full.txt` (ISR 1 h) dans l'heure. Retirer le secret = retour au mensuel seul.
> - **Avant d'activer** (points @legal) : bouton « Résilier votre contrat » sur /profil (l'email de rappel le cite ; aujourd'hui « Gérer mon abonnement »), CGU §3/§6/§7, case de renonciation, TVA et médiateur.
> - Webhook : aucun traitement ne dépend du prix ni de l'intervalle (pas de comparaison à `STRIPE_PREMIUM_PRICE_ID`) ; il recopie désormais l'intervalle, le montant réel et `cancel_at_period_end`. Abonnés actuels (dont les 2 de lancement à 0,99 €) : aucun changement Stripe, champs remplis à leur prochain événement Stripe.
> - MRR admin : somme des montants réels mensualisés (annuel / 12) ; abonnement pas encore resynchronisé = `STRIPE_PREMIUM_PRICE_CENTS` comme avant.
> - **Job « rappel de reconduction »** (scheduler existant, Cron Trigger 15 min, fenêtre 8h UTC) : abonnés annuels actifs sans annulation programmée dont la période se termine dans 32 à 40 jours (cible J-40, jamais à J-31 ou après), un seul email par période (clé unique `RenewalReminder (subscriptionId, periodEnd)` insérée AVANT l'envoi, échec retenté). Texte exact @legal (`src/lib/emails/annual-renewal-reminder.ts`), envoi en texte simple via Resend (`RESEND_API_KEY` déjà requis). Rien ne part tant qu'aucun abonnement annuel n'existe.

## s14 (03/10/2026) : chiffres publics dynamiques (catalogue, limites gratuites, parcours) + arrondi à la dizaine @fullstack

> Demande de Thomas (« que tous les chiffres de vannes, vidéos, etc. soient bien dynamiques »). Aucun secret, aucune migration, aucun package, aucune donnée en base. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Limites du compte gratuit : source unique `FREE_JOKE_LIMIT` / `FREE_TIP_LIMIT` / `FREE_VIDEO_LIMIT` dans `src/config/premium.ts`, importées par `/api/jokes`, `/api/tips`, `/api/videos` (valeurs inchangées : 10 / 3 / 3, protection identique) et par tous les textes (abonnement, CTA blog, avantages Premium, liste des vannes, llms.txt).
> - Parcours : nombre (`PARCOURS_COUNT`) et durées en semaines (`parcoursWeeks`, min/max) dans `config/premium.ts`, vérifiés contre `docs/content/parcours-seed.json` par test. Quiz (`QUIZ_QUESTIONS.length`), glossaire (`src/lib/glossary.ts`, extrait de la page) et exemples d'anatomie suivent la longueur de leurs données.
> - Arrondi des compteurs (GO Thomas 03/10) : dizaine inférieure (125 → 120+, 109 → 100+, 89 → 80+), implémentation unique `src/lib/marketing-round.ts` (serveur et hook client). Cache serveur des compteurs : 5 min.
> - Textes « 1 500+ membres » reformulés à la demande de Thomas : accueil (sous le H1) et à propos (2 phrases). Chiffre inchangé.

## s14 (03/10/2026) : audit de forme appliqué (`docs/design/audit-forme-s14.md`) @fullstack

> Demande de Thomas (« bien tout revoir sur la forme »). Aucun secret, aucune migration, aucun package, aucune donnée, aucun texte/prix/lien/slug/titre modifié. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Classes et variantes uniquement : P0-1 à P0-3, P1-1 à P1-11, P2-2, P2-3, P2-5 à P2-9, et P2-4 (ordre des parcours du hero aligné sur le site, tranché par Thomas). Nouveau fichier `src/components/ui/chip.ts` (pastille unique : hero, filtres et thèmes de /vannes, archives du carnet).
> - Hero : 3 pastilles-liens, puis les 2 libellés « Un petit exercice par jour » / « Vannes prêtes à ressortir » sur une ligne à part (coche verte, sans fond ni bordure, non cliquables, masqués sous 640 px).
> - Non appliqués : P2-1 (preuve sociale violette dans l'offre, au choix de Thomas), P2-10 (libellés visibles Favoris/Mon profil en desktop : ajoute du texte visible).
> - Protection Premium du carnet et des parcours inchangée (aucun fichier serveur touché, seulement des classes).

## s14 (03/10/2026) : carnet mensuel de répartie Premium (`/carnet`) @fullstack

> Décision de Thomas (03/10/2026). Aucun secret, aucune migration, aucun package, aucune donnée en base, aucun appel IA. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Contenu : un JSON par mois dans `apps/web/src/data/carnet/AAAA-MM.json`, embarqué au build (`require.context`, validé par zod dans `src/lib/carnet.ts`, fichier invalide écarté et signalé dans les logs). Ajouter un mois = déposer le JSON puis redéployer, rien d'autre à enregistrer. Un mois n'apparaît qu'à partir du 1er à minuit, heure de Paris (le carnet courant est le plus récent déjà commencé ; un mois futur répond 404).
> - `/carnet` et `/carnet/[mois]` (SSR dynamique, `noindex, nofollow`, hors sitemap) : abonné Premium (plan lu en base, `src/lib/session-plan.ts`) = toutes les fiches + liens vers les mois précédents ; non Premium (anonyme ou gratuit) = intro + première fiche entière + titres et contextes des autres, filtrés côté serveur (vérifié dans le build : aucune autre fiche dans le HTML ni dans `.next/static`), puis appel à l'abonnement vers `/abonnement?returnTo=%2Fcarnet`.
> - Avantages Premium : « le carnet mensuel de situations de répartie (nouveau chaque mois) » ajouté (`config/premium.ts`, `premium-benefits.tsx`, paywall, JSON-LD produit, `llms-content.ts`). Lien « Carnet » dans l'en-tête pour les abonnés Premium seulement.

## s14 (03/10/2026) : Premium à 2,99 €/mois @fullstack

> Décision de Thomas (03/10/2026). Aucune migration, aucun package, aucune donnée modifiée, aucun appel Stripe. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - **Secrets Worker, au MÊME déploiement** : `STRIPE_PREMIUM_PRICE_ID` doit passer au nouveau prix Stripe à 2,99 € (créé par l'orchestrateur), sinon le checkout facture encore 4,99 € alors que le site affiche 2,99 €. Si `STRIPE_PREMIUM_PRICE_CENTS` est défini sur le Worker, le passer à `299` (ou le supprimer : défaut du code désormais 299), il sert au calcul du MRR admin.
> - Affichage : toutes les mentions 4,99 € remplacées par 2,99 € (pages abonnement et metadata, accueil, à propos, parcours, glossaire, inscription, CGU, CTA, paywall, modale premium, quiz, listes, profil, FAQ, `config/premium.ts`, `llms-content.ts`, prompts des agents IA) ; JSON-LD `offers.price` = "2.99" ; `.env.example` à 299. Aucune offre annuelle.
> - Articles statiques (`blog-articles.ts`, 19 articles ; `blog-article-rewrites.json`, 1 article) : seul le prix change (un seul mot « 4 » devenu « 2 » par article, vérifié), aucune comparaison chiffrée devenue fausse. Empreintes `words`/`numbers` de ces 19 articles régénérées dans `blog-em-dash-baseline.json`.
> - Abonnés existants : restent sur l'ancien prix Stripe tant qu'ils ne sont pas migrés (décision et opération côté Stripe, hors code).

## s14 (03/10/2026) : parcours Premium protégés côté serveur, `/api/ai` coupée, offre Premium vraie, retour après paiement @fullstack

> Décisions de Thomas (03/10/2026). Aucun secret, aucune migration, aucun package, aucune donnée modifiée, aucun appel Stripe. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - Parcours : pour un visiteur non Premium (anonyme ou compte gratuit, plan lu en base comme les favoris), les étapes 2+ ne sortent plus du serveur qu'en aperçu (titre, format, une phrase « pourquoi », XP) : ni conseil, ni quiz, ni vannes, ni vidéos (`src/lib/parcours-preview.ts`, `api/parcours/by-slug/[slug]`, `Cache-Control: private, no-store`). Le HTML ISR de `/parcours/[slug]` est toujours en aperçu ; un abonné reçoit le contenu complet via l'API après hydratation. Le seed complet (quiz avec réponses, vidéos) ne part plus dans le JS public : `/parcours` reçoit ses données du serveur (`src/lib/parcours-catalogue.ts`) et `parcours-labels.ts` n'importe plus le seed.
> - `/api/ai` : 410 pour toute requête, message neutre, sans session, base ni LLM. `AI_USER_DAILY_LIMIT` devient inutile sur le Worker.
> - Offre : `/abonnement` (page et metadata), modale Premium, paywall, carte d'accueil et JSON-LD produit partagent une seule liste vraie (`components/premium/premium-benefits.tsx`, `src/config/premium.ts`) : les 3 parcours en entier (Machine à Café 15 min/semaine, Répartie et Confiance 20 min/semaine, première étape offerte), favoris, listes complètes. Retirés : « contenu quotidien », « filtres avancés », « favoris illimités », « nouveaux contenus chaque semaine », « streaks et XP ». Aucun annuel, aucun contenu mensuel promis.
> - Chiffres : fiches vannes « 550+ » remplacé par le nombre réel de vannes actives (même source que les compteurs), `llms.txt` dynamique, « Plus de 550 vannes » et « des centaines » (a-propos, image OG des vannes, conseils, `llms-content.ts`, replis si base KO) neutralisés, repli `numberOfItems: 200` supprimé.
> - Tunnel : « Commencer à 4,99 €/mois » de l'accueil mène à `/abonnement` après inscription. `returnTo` (chemin interne validé, `src/lib/premium-return.ts`) voyage du paywall jusqu'à Stripe (`success_url`/`cancel_url`) puis `/abonnement/success`, qui renvoie à l'intention d'origine, sinon `/parcours`, avec un bandeau de bienvenue (`?premium=bienvenue`). Erreurs de paiement de `/abonnement` : plus de message brut de l'API. Favoris : modale « Les favoris font partie de Premium ».

## s14 (01/10/2026) : fin de l'offre de lancement, Premium à 4,99 €/mois @fullstack

> Décision de Thomas (01/10/2026). Aucune migration, aucun package, aucune donnée modifiée, aucun appel Stripe. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - **Secrets Worker, au MÊME déploiement** : `STRIPE_PREMIUM_PRICE_ID` doit passer au nouveau prix Stripe à 4,99 € (créé par l'orchestrateur), sinon le checkout facture encore 0,99 € alors que le site affiche 4,99 €. Si `STRIPE_PREMIUM_PRICE_CENTS` est défini sur le Worker, le passer à `499` (ou le supprimer : défaut du code désormais 499), il sert au calcul du MRR admin.
> - Affichage : toutes les mentions 0,99 € remplacées par 4,99 € (pages abonnement, accueil, à propos, parcours, glossaire, inscription, CGU, CTA, paywall, modale premium, quiz, listes, FAQ, `llms-content.ts`, prompts des agents IA) ; JSON-LD `offers.price` = "4.99". Badges et mentions « Prix de lancement » retirés ; CGU : « (4,99 €/mois) » sans clause d'évolution du prix de lancement.
> - Articles statiques (`blog-articles.ts`, 19 articles ; `blog-article-rewrites.json`, 1 article) : seul le prix change, plus 7 comparaisons devenues fausses (café, croissant, soda, verre, bière) remplacées par « sans engagement » ou retirées. Empreintes de ces 19 articles régénérées dans `blog-em-dash-baseline.json`.
> - `api/admin/stats` : MRR = abonnements actifs × `PREMIUM_PRICE_CENTS` / 100 (plus de 0,99 codé en dur).
> - Abonnés existants : restent sur l'ancien prix Stripe tant qu'ils ne sont pas migrés (décision et opération côté Stripe, hors code).

## s14 (01/10/2026) : page `/liens` (bio Instagram automatique), newsletter retirée @fullstack

> Aucun secret, aucune migration, aucun package, aucune donnée modifiée. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide.
> - `/liens` (`src/app/liens/page.tsx`, ISR 5 min, `noindex, follow`, hors sitemap, sans en-tête ni pied de page) : dernier article visible (même source que `/blog`, via `src/lib/latest-blog-article.ts` et `blog-visibility.ts`), vanne du jour (`src/lib/daily-joke.ts`), puis liens fixes parcours Répartie, vannes, conseils. Tous les liens portent `utm_source=instagram&utm_medium=social&utm_campaign=bio`. Action Thomas, une seule fois après déploiement : mettre `https://deviens-marrant.fr/liens` dans la bio Instagram.
> - Préparation sociale : plus de note « Lien de la bio à mettre à jour ce lundi » (`scripts/content/social-month-plan.ts`, retirée aussi de `docs/social/preparation/2026-10.md` et `2026-11.md`) ; la légende Instagram du lundi reste « Lien en bio. ». `docs/social/mesure.md` à jour.
> - Newsletter : formulaire retiré (fin d'article de blog, résultat du quiz), composant `newsletter-inline.tsx` et texte de consentement « une technique par semaine » supprimés. `POST /api/newsletter` répond 410 (« Les inscriptions sont fermées pour le moment. »), sans écriture. Table `NewsletterSubscriber` et routes de confirmation et de désinscription conservées (newsletter mensuelle préparée à venir).

## s14 (01/10/2026) : publication Instagram corrigée, échecs tracés, génération IA sociale arrêtée, préparation mensuelle @fullstack

> Aucun secret, aucune migration, aucun package. Non déployé (commit local). Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) quand Thomas le décide. Rien n'est inséré en base au déploiement.
> - `src/lib/social/buffer-client.ts` : mutation Instagram conforme au schéma Buffer `AssetInput` (`assets: [{ image: { url } }]`), cause prouvée des 41 échecs (`Field "images" is not defined by type "AssetInput"`). À valider sur un post de test non public avant toute reprise.
> - `api/cron/publish-social` : message exact de chaque échec enregistré dans `SocialPost.directorNote` (préfixe « Échec publication Buffer : ») ; e-mails d'échec limités à 1 par jour UTC (verrou `JobLock` `publish-social-failure-alert-AAAA-MM-JJ`, `src/lib/social/publish-failure.ts`) ; LinkedIn exclu (pause) ; coupe-circuit 429 lu en `startsWith`.
> - Génération IA des posts arrêtée définitivement : `runDailySocialJob` et `/api/cron/daily-social` retournent immédiatement (aucun LLM, aucune écriture) ; `social-media-agent.ts` archivé (commentaire en tête, non patché).
> - [CHOIX UTILISATEUR] aucune IA ne produit seule : la relecture copy-review (`runCopyReviewJob`, `runDailyCopyReviewOnce`) et `backfillMissingJokeDecryptagesTask` ne tournent plus que si `CONTENT_GENERATION_ENABLED` = "true" (absent sur le Worker : coupés).
> - Carte Instagram « amorce // chute » : `generatePostImage` (IMAGE_QUI_CLAQUE + `threadParts` [amorce, chute]) rend le gabarit « La Vanne » ; image rendue par le Worker à la publication (`/api/social/image?postId=`), aucun upload R2 depuis le script.
> - Préparation mensuelle (depuis `apps/web`, `NEON_DATABASE_URL` définie) : `npx tsx scripts/content/prepare-social-month.ts --month 2026-10 --from 2026-10-02` (dry-run, SELECT seulement, écrit `docs/social/preparation/2026-10.md` avec l'échantillon de 10), puis, après validation de Thomas, la même commande avec `--write --echantillon-valide` (posts `APPROVED`, `approvedBy = preparation-mensuelle`, créneaux X 12:30 et Instagram 18:30 heure de Paris). Mesure : `docs/social/mesure.md`.

## s14 (01/10/2026) : remplaçant jamais déjà programmé, posts sociaux en pause, agent CEO coupé @orchestrateur

> Aucun secret, aucune migration, aucun package. Déployé (version a6dbeae7).
> - `quality-watch.ts` : une vanne de remplacement ne peut plus être une vanne programmée à ±90 jours (cas du 01/10 : vanne du 28/10 tirée en double).
> - `scheduler/jobs.ts` : génération quotidienne des posts sociaux (4h UTC) suspendue tant que `CONTENT_GENERATION_ENABLED` ≠ "true" (audit réseaux sociaux demandé par Thomas, même approche que les vannes).
> - Données : les 2 posts du 01/10 (non audités) repassés `PENDING` (non publiés). `CeoConfig.enabled = false` (agent CEO : file de tâches vide depuis sa création, dry-run ; réactivable par l'admin), entrée `CeoAuditLog`.

## s14 (01/10/2026) : contrôle qualité du matin, vannes GARDER plus rejugées @orchestrateur

> Aucun secret, aucune migration, aucun package. Déployé (version 00cff7bd). Le 01/10, le juge automatique a rejeté l'étalon E3 (réveil, vanne du jour validée) à 3/10 en le prenant pour une copie d'étalon, et l'a remplacé par une vanne déjà programmée le 28/10.
> - `src/lib/ai/quality-watch.ts` : vanne du jour `copyVerdict = GARDER` (catalogue relu à l'aveugle) conservée sans appel LLM ; seules les vannes non validées sont jugées. Validation impossible → remplacement.
> - Donnée : DailyContent du 01/10 remis sur la vanne prévue (réveil). Sans le correctif, même rejet attendu les 06/10 (Alexa), 03/11 (GPS) et 09/11 (erreurs).

## s14 (30/09/2026) : parcours, option A (5 étapes sous la barre) + tirets cadratins du seed parcours

> Aucun secret, aucune migration, aucun package. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`) : `docs/content/parcours-seed.json` est importé au build (textes « pourquoi », quiz, vidéos).
> - Base (déjà faite le 30/09, Neon) : `LearningPathStep.tipId` de 5 étapes pointe vers un conseil validé de même compétence (confiance 1 : « Énoncer la règle non écrite » ; repartie 1 : « L'ironie bienveillante » ; repartie 2 : « Le silence entre deux chansons » ; maitre-storytelling 5 et roi-repartie 2, parcours inactifs : « La question qui fait raconter », « Répondre au pied de la lettre »). Les 5 anciens conseils sont désactivés. Sauvegardes dans `docs/copy/audit-vannes-s14/`.
> - Seed : `tipTitle` et phrase « pourquoi » des 3 étapes actives alignés ; 33 tirets cadratins remplacés par deux-points (+ 1 dialogue en guillemets).

## s14 (30/09/2026) : publication programmée des articles préparés + script d'import @fullstack

> Aucun secret, aucune migration, aucun package. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`). Donnée : l'article S1 n'est inséré en base que par la commande d'import lancée par Thomas (voir plus bas), jamais au déploiement.
> - `publishDueScheduledArticles` (`src/lib/scheduler/prepared-content.ts`), appelé à chaque tick de 15 min et par `/api/cron/weekly-seo` quand `CONTENT_GENERATION_ENABLED` ≠ "true" : passe `isPublished=true` sur les articles dont `publishedAt` est échu dans la semaine ISO en cours (compare-and-set, verrou `JobLock` seulement s'il y a un article échu), puis revalidation `/blog`, article, sitemap, llms (best effort, voir `src/lib/blog-revalidate.ts`) et ping IndexNow (`src/lib/indexnow.ts`, source unique, timeout 5 s). Sous OpenNext sans tag cache, `revalidatePath` est sans effet : la page article (jamais mise en cache avant) est servie dès la bascule (05:00-05:15 UTC), `/blog`, sitemap et llms se régénèrent par l'ISR 1 h (première visite après expiration du cache).
> - Garde-fou d'exposition : `/blog`, `/blog/<slug>`, sitemap, `llms.txt`, `llms-full.txt` n'affichent un article en base que s'il est publié ET daté du passé (`src/lib/blog-visibility.ts`).
> - FAQ des articles en base : section finale `## FAQ` + `### Question` dans `content`, rendue en bloc « Questions fréquentes » + JSON-LD FAQPage (`src/lib/blog-faq.ts`). Aucun article en base actuel n'a cette section (contrôlé en lecture seule le 30/09) : rendu existant inchangé.
> - Import (depuis `apps/web`, `NEON_DATABASE_URL` définie) : `npx tsx scripts/content/import-article.ts ../../docs/copy/articles-q4/S1-halloween.md` (dry-run, lecture seule) puis la même commande avec `--write`.

## s14 (30/09/2026) : lots S3a à S3d, landings vannes, sameAs, slugs canoniques @fullstack

> Aucune action manuelle : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`).
> - S3a `/blague-du-jour` (ISR, régénérée toutes les 5 min au plus) : vanne du jour avec chute et décryptage, même source que `/api/daily` (DailyContent du jour, sinon repli déterministe) via `src/lib/daily-joke.ts` en lecture seule ; FAQ + JSON-LD FAQPage, compteur de vannes dynamique.
> - S3b 7 pages `/vannes/theme/<slug>` (boulot, couple, dating, soirees, famille, gaming, autoderision ; « ecole » plus tard) : liste serveur paginée `?page=N`, canonical auto-référent, cache R2 `catalogue-theme-jokes-page-v1`. Liens depuis `/vannes` et `/blague-du-jour`. Ajoutées au sitemap avec `/blague-du-jour`.
> - S3c JSON-LD Organization : `sameAs` = Instagram, X, LinkedIn (constante `OFFICIAL_SOCIAL_PROFILES`) ; `NEXT_PUBLIC_SOCIAL_PROFILES` reste une surcharge.
> - S3d fiches vanne, conseil, vidéo actives demandées par un ancien slug : 308 vers le slug canonique. Inchangé : fiche inactive vers la liste (S2), slug inconnu en 404.

## s14 (30/09/2026) : lots Q1-Q4 « rien de moyen » (vanne du jour validée, copy-review sur la barre, gates de publication, contrôle du matin) @ia

> Aucun secret, aucune migration, aucun package. Modèles et effort inchangés. Action restante (orchestrateur) : brancher `GET /api/cron/quality-watch` (Bearer `CRON_SECRET`) dans le planificateur, recommandé 6h30 UTC (après `daily-content` 5h et 6h UTC). `?force=true` ignore le verrou quotidien.
> - Q1 : vanne du jour de repli (`/api/daily`, `daily-publisher`) = pool `isActive, copyVerdict GARDER, comedyTechnique non null` (`src/lib/ai/daily-joke-pool.ts`) ; pool vide → repli historique. Vanne générée APPROVED avec la barre → enregistrée `GARDER` (+ version, date).
> - Q2 : relecture copy-review des vannes avec la barre des étalons ; doute = REECRIRE ; réécriture écrite seulement si `validateJoke` (barre) = APPROVED, alors `GARDER` ; sinon original conservé, `REECRIRE` (hors vanne du jour). Conseils inchangés (doute = GARDER).
> - Q3 : `src/lib/ai/content-gates.ts` avant enregistrement des conseils, articles, posts sociaux et fiches vidéo : tirets cadratins corrigés ; gros mots, vouvoiement, auto-mention IA → une régénération, sinon repli ; marques signalées dans les logs.
> - Q4 : `src/lib/ai/quality-watch.ts` : 1 appel LLM/jour max, remplace la vanne sous la barre par une vanne GARDER, le conseil fautif par un conseil du stock propre, e-mail récap admin seulement si remplacement ou défaut.

## s14 (30/09/2026) : lot V7 anti-séries et barre qualité du générateur de vannes @ia (code `src/lib/ai/` uniquement)

> Aucune action manuelle : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Modèle et effort inchangés. Pris en compte au prochain `daily-content` (5h UTC) une fois la branche déployée sur le Worker.
> - `joke-series-guard.ts` (nouveau) : avant génération, lecture de tous les setups (actifs + inactifs) ; liste compacte des amorces déjà en série injectée au prompt (40 entrées max, 2 800 caractères max, bloc system caché) ; après génération, rejet d'un setup quasi identique (Jaccard ≥ 0,6), d'une 4e vanne active sur une même amorce (Jaccard des 12 premiers mots ≥ 0,5) et des tics d'écriture de l'audit s14. Une régénération au plus, sinon le repli sur le catalogue prend le relais. La réécriture du Director repasse le filtre.
> - `joke-quality-bar.ts` (nouveau) : les 4 étalons validés (Alexa, « des erreurs, principalement », réveil, GPS), les critères et les tics, injectés dans le générateur, dans `validateJoke` (option `dailyGeneration`, passée seulement par `daily-publisher`) et dans `directorRewriteJoke`.
> - Décision V6 : le générateur n'interdit plus les assistants et l'IA comme sujet ; en génération quotidienne, G-J11 laisse passer. Le copy-review (`validateJoke` appelé sans option) est inchangé.

## s14 (30/09/2026) : lot S1, catalogue crawlable (listes rendues côté serveur) @fullstack

> Aucune action Replit ni Cloudflare manuelle : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Déploiement Cloudflare normal (`build:cf` puis `deploy:cf`).
> `/vannes`, `/conseils`, `/videos` passent en rendu serveur à la requête (lecture de `?page=N`) : le HTML contient les fiches de la page (12 vannes, 10 conseils, 12 vidéos) et une pagination en vrais liens ; données en cache serveur 1 h (`src/lib/catalogue-pages.ts`, entrées R2 `catalogue-*-page-v1`). `/blog` : liste complète dans le HTML statique. Accueil : 2 fiches par carte (vannes, conseils, vidéos). Base indisponible : repli sur le chargement client d'avant (pas de 500). À vérifier après déploiement : voir le handoff du lot S1 (comptage des liens au `curl`).

## s14 (30/09/2026) : BASCULE deviens-marrant.fr → Cloudflare Workers (étape D)

> **FAIT (Thomas, 30/09) : déploiement Replit mis en pause.** Rappel de la consigne : mettre en pause / arrêter le déploiement (Deployments → Autoscale). Le domaine ne pointe plus sur Replit, mais un visiteur de l'URL `*.replit.app` réveillerait son planificateur interne (posts sociaux en double, écritures dans l'ancienne base Replit). Ne pas supprimer : retour arrière possible (voir `docs/infra/bascule-checklist.md`).
> Fait : copie finale 35/35, 25 secrets live sur le Worker, `CRON_ENABLED=true`, déploiement `59178f0a`, DNS `A @`/`CNAME www` retirés, domaines personnalisés attachés, endpoint webhook Stripe live créé (`/api/stripe/webhook`). Détail et contrôles : `docs/infra/passation-s14.md` §4.

## s13 (30/09/2026) : images sociales sous Cloudflare Workers (polices Inter)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Chemin Replit inchangé (lecture de `public/fonts/` sur le disque).
> Constat du test s13 : sous Workers, `/api/social/image` renvoyait 500 (« No fonts are loaded ») : pas de système de fichiers, et les URL Google Fonts de secours renvoient 404. Correctif : sous Workers, les TTF de `public/fonts/` sont lues via le binding `ASSETS` (`src/lib/social/image-generator.ts`). Vérifié sur le Worker de test : 3 formats rendus en PNG 1080×1080 avec Inter. Sans ce correctif, `daily-social` n'aurait produit aucune image après la bascule.

## s12 (29/09/2026) : correctifs P1 et P2 du contrôle @qa 64 pages × 4 largeurs @fullstack (code front uniquement)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Commits `caa6f95` (P1-1 à P1-6 : étapes verrouillées lisibles, tirets et apostrophes des conseils retirés au rendu, 2 réponses de FAQ, focus de la modale, blanc sur `#7C3AED`, H1 de /forgot-password et /reset-password, bouton mot de passe de /login à 44 px) et `18f77ba` (P2 : case newsletter, fil d'Ariane et lien de parcours à 44 px en mobile, H1 sans mot seul à 390, index du glossaire à 1024, symbole ✗). Détail des constats : `docs/qa/verification-s12-3-largeurs.md`. À vérifier après déploiement : `/parcours/confiance` (étapes verrouillées), modale « Créer mon compte gratuit » au clavier (Tab reste dans la modale), `/glossaire` à 1024.

## s12 (29/09/2026) : vérification finale 3 largeurs, correctifs N1 à N19 @fullstack (code front + /api/tips)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Commit `c0b1df8`. Détail des constats : `docs/design/verification-finale-s12.md`. Header en mode mobile jusqu'à 1023 px (N1), correctifs d'accueil, parcours, glossaire, anatomie, auth ; tirets cadratins retirés au rendu (parcours, vidéos, quiz, FAQ à-propos ; titres et SEO intacts) ; guillemets imbriqués corrigés au rendu (N11) ; conseils au titre identique dédoublonnés à l'affichage par `/api/tips` (N12 : le total de conseils affiché baisse du nombre de doublons). À vérifier après déploiement : header à 768 et 1024 px, `/conseils` (3 conseils gratuits différents).

## s12 (29/09/2026) : tirets cadratins retirés des articles de blog @fullstack (règle n°12)

> Aucune action manuelle : aucun secret, aucune migration, aucun package.
> - Articles statiques (`src/lib/blog-articles.ts`) : 467 « — » du corps et des réponses FAQ remplacés (ponctuation seulement, mots identiques vérifiés par `__tests__/lib/blog-em-dash-static.test.ts`). Titres, excerpt, slugs, questions FAQ inchangés.
> - Articles en base : **automatique au boot**, `stripBlogEmDashesTask` (dernière tâche de `runStartupTasks`), une seule fois par article (marqueur `DataPatch` `blog-em-dash:v1:<slug>`, 2e boot = 0 update). Ne touche que `content` des articles publiés, jamais title/excerpt/meta ni les lignes de titre `#`. Contenu d'origine gardé dans `DataPatch.note` (retour arrière : requête SQL en commentaire de la tâche).

## s12 (29/09/2026) : correctifs « hors périmètre restant » @fullstack (code front uniquement)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée (casse « eN GROUPE », vannes liées et guillemets corrigés au rendu). Commits `7f96a45`, `0239d49`, `92391ad`, `11fd944`, `f9e235d`, `6f1be77`, `a3119c1`, `0c72322`, `d2abdd8`, `147c90c`. Détail : `docs/marrant/a-valider-s12.md`.

## s12 (29/09/2026) : passe UX @fullstack (code front + /api/jokes)

> Aucune action Replit : aucun secret, aucune migration, aucun package, aucune donnée modifiée. Détail : `docs/ux/passe-ux-s12.md`.
> Commits `d34b96b` (inscription modale -> onboarding, onboarding -> parcours recommandé, vannes dédoublonnées à l'affichage par `/api/jokes`, H1 accueil sur 2 blocs), `0d7acf7` (accueil et /vannes), `c3da858` (parcours), `47227d1` (auth, /abonnement, header, arbitrages Thomas). Doublons de vannes laissés en base (dédoublonnage dans le code uniquement).

## s12 (29/09/2026) : passe visuelle @design (code front uniquement)

> Aucune action Replit : aucun secret, aucune migration, aucune donnée modifiée. Déploiement prévu sur Cloudflare (branche `claude/marrant-s10-session-recovery-CtZyw`). Détail des correctifs : `docs/design/passe-visuelle-s12.md` (T1 à T12).
> Commits `7906100` (titres équilibrés, insécables au rendu, moteur markdown : citations `>`, séparateurs `---`, listes après intro), `5ad5b42` (contrastes AA, token `accent-link`), `d35cf73` (largeurs de page, dates et catégories en français), `483d96a` (cartes alignées, emojis, puces vidéo). Texte des articles/vannes en base inchangé.

## ⭐ s11 (29/09/2026) — Déploiement de la branche `claude/marrant-s10-session-recovery-CtZyw`

> Contexte : la génération IA (vannes, conseils, blog, social, vidéos) était à l'arrêt depuis le 15/06/2026 — le modèle `claude-sonnet-4-20250514` a été retiré par Anthropic. Le code est migré sur **Claude Sonnet 5.5** (`claude-sonnet-5-5`) + **Opus 5.5** pour le rapport CEO, Haiku supprimé, SDK `@anthropic-ai/sdk` 0.129.

### A. Automatique au déploiement (zéro action)
| Quoi | Mécanisme |
|---|---|
| Table `NewsletterSubscriber` (+ enum) | `prisma db push` au build (déjà dans `.replit`) |
| Corrections des articles de blog en base (tutoiement, citations, témoignages, staccato, mentions IA, années) | boot ~30 s : `fixPublishedBlogArticlesTask` (`src/data/blog-article-fixes.json`) |
| Dépublication des 3 articles cannibalisés en base | boot : `depublishCannibalizedDbArticlesTask` |
| URL de la page n°1 `/blog/meilleures-blagues-droles-2026` **conservée** (aucun renommage, choix fondateur) | — |
| Liens internes vers des URLs redirigées réécrits dans les articles en base | boot : `rewriteRedirectedBlogLinksTask` |
| Décryptage IA des vannes anciennes sans décryptage (15 / boot) | boot : `backfillMissingJokeDecryptagesTask` (désactivable : `SKIP_JOKE_DECRYPTAGE_AI_BACKFILL=1`) |
| 14 redirections 301/308 (cannibalisation, historique) | `next.config.js` ← `src/lib/seo-redirects.data.cjs` |
| Alerte email admin si l'IA tombe en panne (modèle retiré, clé, crédit) | `lib/ai/failure-alert.ts`, 1 alerte / type / 24 h |
| **Refonte copy (passe 2)** — 249/264 vannes + décryptages, 65 conseils, 89 fiches vidéos, 3 descriptions de parcours réécrits (id et URL conservés, favoris préservés via `previousContent` / `previousTitle` ; textes seulement : 0 création, 0 suppression, 0 désactivation, étapes de parcours intactes ; vérifié sur base locale : 0 créée, 249 renommées, 2e passe = 0 update). ⚠️ PAS via le seed (bloqué en `NODE_ENV=production`) | boot : `applyCatalogueContentTask`, une seule fois (marqueur `DataPatch` `catalogue-content:v1` ; bump `CATALOGUE_CONTENT_PATCH_VERSION` pour réappliquer) — rapport `docs/qa/catalogue-boot-s11.md` |
| **Refonte copy (passe 2)** — 9 articles de blog en base réécrits, `blog-article-rewrites.json` **v2** (une seule fois, marqueur `DataPatch` par version) | boot : `applyBlogArticleRewritesTask` |
| **Refonte copy** — relecture automatique des vannes et conseils générés (25 + 25 / jour, 3h-4h UTC ; retrait seulement sur motif fermé, sinon GARDER ; originaux conservés) | scheduler : job copy-review |
| Nouveaux champs `copyVerdict`, `copyReviewedAt`, `original*` (Joke, Tip) + table `DataPatch` | `prisma db push` au build (colonnes nullables, sans perte) |

### B. Secrets Replit — tous OPTIONNELS (le code a des défauts sûrs)
| Secret | Valeur | Effet |
|---|---|---|
| `ANTHROPIC_SONNET_MODEL` | *(vide)* → `claude-sonnet-5-5` | changer de modèle sans toucher au code (prochain retrait) |
| `ANTHROPIC_OPUS_MODEL` | *(vide)* → `claude-opus-5-5` | idem pour le rapport hebdo CEO |
| `ANTHROPIC_EFFORT` | *(vide)* → `low` | `low` / `medium` / `high` — qualité vs coût de toute la génération |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | clé `msvalidate.01` de Bing Webmaster Tools | débloque l'indexation Bing |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | clé Search Console (si pas déjà vérifié par DNS) | — |
| `NEXT_PUBLIC_SOCIAL_PROFILES` | URLs des profils officiels séparées par des virgules | `sameAs` JSON-LD (entité de marque pour les IA) |
| `COPY_REVIEW_ENABLED` | *(vide)* → actif | `false` pour suspendre la relecture automatique des contenus générés |
| `COPY_REVIEW_BATCH` | *(vide)* → `25` | nombre de vannes ET de conseils relus par jour |
| `COPY_REVIEW_VERSION` | *(vide)* → `1` | incrémenter pour relire tout le corpus après une évolution de la charte |
| ⚠️ Secret à SUPPRIMER s'il existe | `ANTHROPIC_HAIKU_MODEL` | plus lu par le code |

### C. Après le déploiement (5 min)
1. `curl https://deviens-marrant.fr/api/health` → `checks.ai.sonnetModel = "claude-sonnet-5-5"`, `database.status = "up"`. `llmSuccess` passe à `ok` après la 1re génération (fenêtre 5h-6h UTC, ou catch-up 7h-22h UTC).
2. Brancher UptimeRobot (gratuit) sur `/api/health`, mot-clé `"status":"ok"`, toutes les 5 min.
3. Vérifier `https://deviens-marrant.fr/llms.txt` : doit lister les articles du blog (≈ 26).
4. Soumettre le sitemap dans Google Search Console et Bing Webmaster Tools (≈ 1 100 nouvelles URLs /vannes, /conseils, /videos).

---

> **TL;DR (s10 — deploy auto-suffisant)** : la checklist web est passée de **11 étapes manuelles à 3**.
> Tout ce qui pouvait être automatisé l'a été dans le code (auto-seed config, crons CEO via scheduler interne, application instantanée des décryptages de vannes au boot, cleanup données). Détails ci-dessous.
> La section "Setup MOBILE V1" plus bas reste une checklist distincte (comptes Apple/Google, builds natifs) non concernée par cette automatisation.

---

## ⭐ s10 — Déploiement web auto-suffisant : AUTO vs MANUEL

> "Quand je déploie, tout se met à jour tout seul." Voici précisément ce qui se passe au 1er deploy, sans rien faire.

### A. CE QUI EST DÉSORMAIS AUTOMATIQUE (zéro action)

Au déploiement Replit, la chaîne `[deployment].build` (`prisma db push` + `prisma generate` + build) synchronise le **schéma** DB. Puis, **~30 s après le boot du serveur**, le scheduler interne (`apps/web/src/instrumentation.ts`) exécute des tâches de démarrage idempotentes, puis prend le relais des crons :

| Tâche | Quand | Mécanisme | Fichier |
|---|---|---|---|
| **Schéma DB à jour** (tables, colonnes) | au build | `prisma db push` (déjà dans `.replit`) | `.replit` `[deployment].build` |
| **Seed singleton `CeoConfig`** (FAIL-SAFE : `enabled=false`, `dryRun=true`) | au boot (~30 s) | `ensureCeoConfig()` idempotent + race-safe | `lib/startup-tasks.ts` → `lib/ai/ceo-helpers.ts` |
| **Cleanup `SocialPost` WILD_CARD** (format obsolète → `REJECTED`) | au boot (~30 s) | `$executeRawUnsafe` UPDATE idempotent (cast `::text`) | `lib/startup-tasks.ts` + migration `8_cleanup_wildcard_socialpost` |
| **Décryptage des 265 vannes** (pré-rédigé, SANS IA) | au boot (~30 s) | `applyJokeDecryptagesTask()` : applique les 3 champs depuis `src/data/joke-decryptages.json`, idempotent (ne touche que `comedyTechnique IS NULL`), `withDbRetry`, fail-safe | `lib/startup-tasks.ts` + `src/data/joke-decryptages.json` |
| **Désactivation des 24 vannes faibles** (soft delete, SANS IA) | au boot (~30 s) | `deactivateWeakJokesTask()` : `updateMany` `isActive=false` sur les 24 `content` de `src/data/weak-jokes.json`, idempotent (ne touche que `isActive: true`), `withDbRetry`, fail-safe | `lib/startup-tasks.ts` + `src/data/weak-jokes.json` |
| **CEO tick** (si activé) | scheduler, 2-4h UTC | time gate + lock + court-circuit kill-switch → fetch `/api/cron/ceo-tick` | `instrumentation.ts` job 9 |
| **CEO KPIs snapshot** (si activé) | scheduler, 5h UTC | time gate + lock + court-circuit → `snapshotCeoKpis()` | `instrumentation.ts` job 10 |

**Garanties** :
- Le CEO démarre **désactivé** (aucun coût, aucune action). Thomas l'active quand il veut via le toggle `/admin/ceo` ou `POST /api/admin/ceo/kill-switch`.
- Les **265 vannes sont décryptées INTÉGRALEMENT et INSTANTANÉMENT au boot**, en une passe, depuis le fichier pré-rédigé bundlé (`src/data/joke-decryptages.json`). **Zéro appel IA, zéro coût, zéro action manuelle.** Idempotent : une fois appliqué, les boots suivants ne touchent plus rien. (L'ancien back-fill IA progressif 50/jour a été retiré.)
- Les **24 vannes faibles** flaggées par les rédacteurs (s10, décision fondateur qualité > quantité) sont **désactivées (soft delete) au boot** via `deactivateWeakJokesTask()` : `isActive=false` sur les vannes dont le `content` figure dans `src/data/weak-jokes.json`. Le catalogue filtre déjà sur `isActive` → elles disparaissent du front **sans perte d'historique** (favoris/likes préservés). Idempotent (`WHERE isActive: true`), fail-safe, sans IA. **Réversibilité** : remettre `isActive=true` en DB OU retirer le content de `weak-jokes.json`. Catalogue actif : 289 → **265 vannes**.
- Les **nouvelles vannes quotidiennes** (générées par `generateDailyJoke`) reçoivent leur décryptage via l'IA **à la génération** — `generateJokeDecryptage` reste actif uniquement pour ce cas.
- Toutes les tâches sont **fail-safe** : si la DB est froide (Neon cold start), elles loggent mais ne crashent pas le démarrage. Le boot suivant rattrape.
- Triple verrou anti coûts (bug P0 s8) sur chaque job scheduler : **time gate horaire + `tryAcquireLock` + court-circuit kill-switch/vide**.

> **Note migrations versionnées** : le deploy Replit utilise `prisma db push` (pas `migrate deploy`), qui ne joue PAS les migrations de **données** (ex. `8_cleanup_wildcard`). C'est pourquoi le cleanup est aussi exécuté au boot via `startup-tasks.ts` (garanti + idempotent). Si tu préfères basculer sur `prisma migrate deploy` au build, c'est possible mais **risqué** (la DB a été initialisée via `db push`, pas via migrations → conflit de baseline `_prisma_migrations`). NE PAS changer sans test sur une DB jetable. Le contournement actuel (cleanup au boot) évite ce risque.

### B. LE MINIMUM IRRÉDUCTIBLE MANUEL (~3 étapes)

Ce qui ne PEUT PAS être dans le code (secrets, validations externes, action humaine) :

**1. Merge + Deploy** (l'action elle-même)
- Merge la branche dans `master`, clique **Deploy** sur Replit. Tout le reste s'enchaîne automatiquement (voir section A).

**2. Secrets Replit** (à poser une fois — Replit > Secrets)
Le code se **désactive proprement** si un secret manque (pas de crash). Liste minimale pour activer chaque feature :

| Secret | Pour quoi | Comment l'obtenir |
|---|---|---|
| `DATABASE_URL` | DB (déjà posé) | Auto Replit PostgreSQL |
| `CRON_SECRET` | scheduler ↔ crons HTTP | `openssl rand -hex 32` |
| `ANTHROPIC_API_KEY` | génération contenu + CEO + vannes | console.anthropic.com |
| `ADMIN_PASSWORD` | accès `/admin/*` (dont toggle CEO) | choisir une passphrase forte |
| `RESEND_API_KEY` | emails (rapport hebdo CEO, inbound) | resend.com dashboard |
| `UNSUBSCRIBE_HMAC_SECRET` | footer unsubscribe RGPD (sinon envoi email CEO bloqué) | `openssl rand -hex 32` |
| `ADRESSE_POSTALE` | conformité CPCE footer email | décision Thomas |
| `CEO_ADMIN_EMAIL` | destinataire rapport hebdo CEO | `alex@deviens-marrant.fr` |
| `NEXT_PUBLIC_BASE_URL` | liens unsubscribe | `https://deviens-marrant.fr` |
| `TWITTER_BEARER_TOKEN` | DM CEO (optionnel — se désactive si absent) | developer.twitter.com |
| `RESEND_WEBHOOK_SECRET` | webhook Resend inbound (optionnel) | `openssl rand -hex 32` |
| `BUFFER_*` | publication sociale (déjà posés probablement) | buffer.com |

> Total ≈ 12 secrets, dont ~5 réellement bloquants pour le cœur web (DATABASE_URL, CRON_SECRET, ANTHROPIC_API_KEY, ADMIN_PASSWORD, RESEND_API_KEY). Les autres débloquent des features spécifiques (CEO email, DM, inbound).

**3. Configs dashboard externes + légal** (one-shot, hors code)
- **Webhook Resend Inbound** (si replies email CEO souhaités) : dashboard Resend → endpoint `https://deviens-marrant.fr/api/webhooks/resend-inbound`, secret = `RESEND_WEBHOOK_SECRET`.
- **3 DPA légaux** (sous-traitants RGPD) : signer les Data Processing Agreements Anthropic, Resend, Neon (action juridique, pas technique).

**C'est tout.** Plus besoin d'insérer la config CEO en SQL, ni de lancer le back-fill à la main, ni de configurer les crons CEO sur Replit Scheduled Deployments (le scheduler interne les couvre). Les sections historiques ci-dessous restent comme référence des phases passées.

---

## Actions Replit — Setup MOBILE V1

> Ce fichier liste toutes les actions manuelles à effectuer par Thomas pour finaliser la V1 mobile (iOS + Android).
> Les livrables code et docs sont déjà produits dans le repo. Cette checklist couvre le "last mile" (comptes développeurs, certificats, premiers builds, submission).

## Hook pre-commit (anti-récidive bugs enum Prisma)

> Ajouté session 8 (commit eeb08f3) après 3 bugs P0 d'affilée sur l'enum `SocialFormat`.

Le hook `.githooks/pre-commit` du repo vérifie 2 choses avant chaque commit :
1. CLAUDE.md section Gradient ≤ 125L (existant)
2. **Cohérence enums Prisma vs usages code** — exécute `scripts/check-prisma-enums.sh` si `schema.prisma` ou `apps/web/src/` modifiés

Pour activer le hook (1 fois par poste local + sur Replit shell) :

```bash
git config core.hooksPath .githooks
```

Sans cette commande, **le hook n'est PAS exécuté** et la protection est inactive. À faire AU PLUS VITE pour ne plus reproduire les bugs MINI_STANDUP / WILD_CARD.

Pour tester manuellement à tout moment :
```bash
bash scripts/check-prisma-enums.sh
```

Si le hook bloque un commit légitime (nouvelle constante interne) → ajouter la valeur à WHITELIST dans `scripts/check-prisma-enums.sh`.

## Fix s10 — Retry Neon cold start (P1 ouvert depuis le 08/04)

> P1 PROD : Neon free tier suspend le compute DB après ~5 min d'inactivité. Au réveil d'un cron sur DB froide, le 1er appel Prisma tapait avant la fin du wake (1-5s) → erreur `P1001 Can't reach database server` → le cron plantait et spammait une alerte email (~toutes les 3h).

**Aucune action Replit requise.** Fix 100% code (Option A, budget 0€) :
- Nouveau helper `apps/web/src/lib/db-retry.ts` (`withDbRetry`) : retry 3× backoff exponentiel (500ms → 1s → 2s) UNIQUEMENT sur erreurs de connexion (`P1001`, `Can't reach database server`, `Connection terminated`, `ECONNREFUSED`, `ETIMEDOUT`). Les autres erreurs (P2002, validation) sont re-throw immédiatement.
- Wrappé sur le 1er appel Prisma des crons : `publish-social`, `social-analytics`, `daily-social`. `ceo-tick` déjà résilient (son `tryAcquireLock` est silent-fail, pas d'alerte).

**Comportement attendu post-deploy** : plus d'alertes email "cron a planté" liées au cold start. Le 1er appel se réveille au retry (~500ms-1.5s) au lieu de planter. Une alerte ne reste émise QUE si la DB est réellement injoignable après 3 tentatives (panne légitime).

**Si le spam persiste après deploy** (très improbable — wake Neon < 5s, budget retry ~1.5s mais pool_timeout=30s couvre la marge) : l'alternative est l'upgrade Neon (plan payant sans suspension du compute), **hors budget actuel**. À arbitrer avec Thomas seulement si le retry s'avère insuffisant en prod.

## Hotfix s10 (06/05/2026) — Bug Buffer rate limit 24h en boucle

> P0 PROD ACTIF. Toutes publications Twitter/LinkedIn/Instagram coupées tant que le rate limit 429 reste actif. Bloque acquisition organique = bloque MRR.

**Diagnostic** : `publish-social/route.ts` a un circuit breaker correct (skip plateformes FAILED 429 sur 24h via `recentRateLimits`), mais `social-analytics/route.ts` interrogeait Buffer SANS check circuit breaker → relance la fenêtre 24h en boucle à chaque exécution (toutes les 15 min côté Replit Scheduled Deployments).

**Fixes appliqués (commit s10)** dans `apps/web/src/app/api/cron/social-analytics/route.ts` :
1. **Time gate utcHour** : exécution effective uniquement aux heures paires (1× toutes les 2h). Bypass debug avec `?force=1`.
2. **Cache module-level 60 min** sur `getBufferScheduledPosts()` — amortit la pression Buffer même si le cron est appelé toutes les 15 min.
3. **Circuit breaker** : si TOUTES les plateformes (Twitter, LinkedIn, Instagram) sont en rate limit 24h (FAILED + `directorNote contains "429"`), on **NE LIT PAS** la queue Buffer. C'est le fix critique anti-boucle.

**Action manuelle Thomas (Replit Console)** :

Dans **Replit > Deployments > Scheduled Deployments**, réduire la fréquence du cron `social-analytics` :
- **Avant** : toutes les 15 min (`*/15 * * * *`)
- **Après** : toutes les 2h (`0 */2 * * *`)

Raison : le time gate interne renvoie `skipped:true` aux heures impaires, mais on évite quand même les invocations inutiles (Replit facture chaque exécution autoscale).

Le cron `publish-social` reste à sa fréquence actuelle (toutes les 30 min) — il n'est pas concerné par ce bug.

**Validation** : 9 nouveaux tests Jest dans `apps/web/src/__tests__/api/cron/social-analytics.test.ts` couvrent les 3 fixes. Lancer :
```bash
cd apps/web && npx jest src/__tests__/api/cron/social-analytics.test.ts
```

---

## Hook pre-commit (existant — rappel)

⚠️ **PRÉREQUIS BLOQUANT** : avant tout, vérifier que la branche `master` est à jour (Réflexe P0 #2).

```bash
git fetch origin
git log master..HEAD --oneline   # diff entre master et la branche actuelle
git show master:apps/web/src/lib/auth.ts | head -50   # vérifier la version déployée
```

Si écart important → résoudre AVANT le premier `cap sync`. Sinon l'app mobile en prod va appeler des endpoints potentiellement obsolètes (risque 6+ semaines de fixes invisibles).

---

## 0. Vue d'ensemble

| Étape | Action | Coût | Temps estimé |
|---|---|---|---|
| 1 | Créer compte Apple Developer | 99€/an | 5-10j (validation Apple) |
| 2 | Créer compte Google Play Console | 25€ one-shot | 1-2j (validation Google) |
| 3 | Créer compte RevenueCat | Gratuit (jusqu'à 10K$ MTR) | 15min |
| 4 | Créer projet Firebase + activer FCM | Gratuit | 30min |
| 5 | Générer clé APNs Apple | Inclus Apple Dev | 15min |
| 6 | Configurer RevenueCat avec App Store + Play | Inclus | 1h |
| 7 | Premier `cap add ios` + `cap add android` | - | 30min |
| 8 | Migration Prisma PushToken + WebhookEvent | - | 10min |
| 9 | Installer package `apn` (APNs serveur) | - | 5min |
| 10 | Créer middleware CORS | - | 15min |
| 11 | Modifier NextAuth cookies SameSite=None | - | 10min |
| 12 | Générer assets (icons + splash) via @capacitor/assets | - | 15min |
| 13 | Premier build iOS via Xcode | Mac requis | 1h |
| 14 | Premier build Android via Android Studio | - | 1h |
| 15 | Upload TestFlight (iOS internal testing) | - | 30min |
| 16 | Upload Play Console Internal Testing | - | 30min |
| 17 | Soumission App Store (review 24-48h) | - | 30min + attente |
| 18 | Soumission Play Store (review 1-7j) | - | 30min + attente |

---

## 1. Compte Apple Developer (99€/an)

1. Aller sur https://developer.apple.com/programs/enroll
2. Choisir "Individual" ou "Organization" (Organization recommandé pour projets pros)
3. Payer 99€
4. **Attente 5-10 jours** pour validation Apple (vérifications identité)
5. Une fois actif, accéder à App Store Connect : https://appstoreconnect.apple.com
6. **Créer une App** :
   - Bundle ID : `fr.deviensmarrant.app`
   - Name : `Deviens Marrant`
   - Primary Language : French
   - SKU : `dm-ios-001`

## 2. Compte Google Play Console (25€)

1. Aller sur https://play.google.com/console/signup
2. Payer 25€ (one-shot, lifetime)
3. **Attente 24-48h** validation Google
4. **Créer une App** :
   - App name : `Deviens Marrant`
   - Default language : Français (France)
   - App or game : App
   - Free or paid : Free (avec achats in-app)

## 3. RevenueCat — Setup IAP unifié

1. Créer compte gratuit : https://app.revenuecat.com/signup
2. Créer un projet "Deviens Marrant"
3. **Onglet Apps** :
   - Add app iOS : `fr.deviensmarrant.app` + uploader le `.p8` In-App Purchase Key (généré dans Apple Developer > Keys)
   - Add app Android : `fr.deviensmarrant.app` + uploader le service account JSON Google Play
4. **Onglet Products** :
   - Créer `premium_monthly` (lié aux deux stores)
   - Créer `premium_yearly` (optionnel V1, recommandé)
5. **Onglet Entitlements** : créer `premium`, lier les 2 products
6. **Onglet Offerings** : créer `default`, ajouter les 2 packages
7. **Onglet API Keys** : copier les 2 clés publiques (iOS + Android)
8. **Onglet Integrations > Webhooks** :
   - URL : `https://deviens-marrant.fr/api/iap/revenuecat-webhook`
   - Authorization Header Name : `Authorization`
   - Authorization Header Value : `Bearer <secret>` (générer un secret 32+ chars)

### Secrets Replit à ajouter

```
NEXT_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxx
NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxx
REVENUECAT_WEBHOOK_SECRET=<même secret que l'URL webhook>
```

## 4. Firebase + FCM (Push Android)

1. Créer projet : https://console.firebase.google.com
2. Add app Android : package `fr.deviensmarrant.app`
3. Télécharger `google-services.json` → placer dans `android/app/` après `cap add android`
4. Project Settings > Cloud Messaging > **Server key** (Legacy)
5. Si Server Key non visible : Cloud Console > APIs & Services > Library > activer "Cloud Messaging API (Legacy)" puis revenir

### Secret Replit

```
FCM_SERVER_KEY=AAAAxxxxx:APA91bxxxxx
```

## 5. APNs (Push iOS)

1. Apple Developer > Certificates, IDs & Profiles > **Keys** > "+"
2. Activer "Apple Push Notifications service (APNs)"
3. Continue + Register
4. **Télécharger le `.p8` UNE SEULE FOIS** (Apple ne permet pas de redownload — sauvegarder)
5. Noter le **Key ID** (10 caractères, ex : ABCD1234XY)
6. Account > Membership > **Team ID** (10 caractères)

### Secrets Replit

```
APNS_KEY_ID=ABCD1234XY
APNS_TEAM_ID=XXXXXXXXXX
APNS_BUNDLE_ID=fr.deviensmarrant.app
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkw...
-----END PRIVATE KEY-----"
```

(Coller le contenu intégral du fichier `.p8`, retours ligne préservés. Replit Secrets supporte les multi-lignes.)

## 6. Migration Prisma — Modèles PushToken + WebhookEvent

Éditer `prisma/schema.prisma` (et la copie `apps/web/prisma/schema.prisma`) :

```prisma
model PushToken {
  id          String   @id @default(cuid())
  token       String   @unique
  platform    String   // "ios" | "android"
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  lastSeenAt  DateTime @default(now())

  @@index([userId])
  @@index([lastSeenAt])
}

// Vérifier si WebhookEvent existe déjà depuis l'audit du 15/03 — sinon ajouter :
model WebhookEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique
  provider    String   // "stripe" | "revenuecat"
  eventType   String
  receivedAt  DateTime @default(now())

  @@index([provider, eventType])
}
```

Sur `model User`, ajouter :
```prisma
  pushTokens  PushToken[]
```

Puis :
```bash
cd apps/web
npx prisma db push
npx prisma generate
```

## 7. Installer package `apn` pour APNs serveur

```bash
cd apps/web
npm install apn
```

Puis finaliser `app/api/cron/daily-push/route.ts` fonction `sendAPNS()` selon le snippet documenté dans `docs/mobile/infrastructure-mobile.md` §1.

## 8. Middleware CORS

Créer `apps/web/src/middleware.ts` selon le contenu de `docs/mobile/infrastructure-mobile.md` §5.

## 9. NextAuth cookies SameSite=None

Modifier `apps/web/src/lib/auth.ts` :

```typescript
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
    },
  },
},
useSecureCookies: true,
```

⚠️ Tester en dev (HTTPS local nécessaire — utiliser `mkcert` ou tunnel Cloudflare).

## 10. Build check obligatoire

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build && BUILD_TARGET=mobile npm run build:mobile && npx jest --no-coverage
```

Si échec → corriger avant `cap sync`.

## 11. Capacitor — Premier add iOS + Android

Depuis la racine du projet :

```bash
# Install Capacitor (déjà fait via package.json après les ajouts)
cd apps/web
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android \
  @capacitor/push-notifications @capacitor/share @capacitor/app \
  @capacitor/status-bar @capacitor/splash-screen \
  @revenuecat/purchases-capacitor

# Build mobile (export statique)
BUILD_TARGET=mobile npm run build

# Retour à la racine
cd ../..

# Init (si pas déjà fait — capacitor.config.ts existe déjà)
# npx cap init "Deviens Marrant" "fr.deviensmarrant.app" --web-dir=apps/web/out

# Add platforms
npx cap add ios
npx cap add android

# Sync (copie l'export Web + plugins natifs)
npx cap sync
```

## 12. Génération assets icons + splash

Depuis la racine :

```bash
npm install --save-dev @capacitor/assets

# Convertir SVG → PNG master (si pas encore fait)
# Outil au choix : Figma, Inkscape, rsvg-convert
# Inputs requis dans apps/web/resources/ :
#   - icon.png (1024x1024)
#   - icon-foreground.png (1024x1024 alpha)
#   - icon-background.png (1024x1024)
#   - splash.png (2732x2732)
#   - splash-dark.png (2732x2732)

# Si tu as juste icon.png et splash.png, @capacitor/assets dérive le reste :
npx capacitor-assets generate \
  --iconBackgroundColor "#8B5CF6" \
  --iconBackgroundColorDark "#0F0817" \
  --splashBackgroundColor "#8B5CF6" \
  --splashBackgroundColorDark "#0F0817"
```

## 13. Build iOS (Mac requis)

```bash
npx cap open ios
# → Ouvre Xcode

# Dans Xcode :
# 1. Sélectionner le projet "App" dans le navigator
# 2. Tab "Signing & Capabilities"
#    - Team : ton Apple Developer team
#    - Bundle Identifier : fr.deviensmarrant.app (déjà défini)
#    - Activer "Automatically manage signing"
# 3. Add Capabilities :
#    - Push Notifications
#    - Background Modes > Remote notifications
# 4. Choisir un device "Any iOS Device (arm64)" pour archive
# 5. Product > Archive
# 6. Window > Organizer > Distribute App > App Store Connect > Upload
```

Une fois l'archive uploadée, elle apparaît dans App Store Connect > TestFlight après ~30 minutes (processing).

## 14. Build Android

```bash
npx cap open android
# → Ouvre Android Studio

# Dans Android Studio :
# 1. Build > Generate Signed Bundle / APK > Android App Bundle
# 2. Si pas de keystore : "Create new" — sauvegarder le keystore + mots de passe (CRITIQUE — sans ça pas de mise à jour possible)
# 3. Build variant : release
# 4. Le fichier .aab est dans android/app/release/app-release.aab
```

Recommandation : utiliser **Play App Signing** (Google gère la clé de signing). Plus safe.

## 15. Upload TestFlight (iOS)

1. App Store Connect > ton app > TestFlight
2. Le build uploadé via Xcode apparaît
3. Compléter "Test Information" (Beta App Description, Email)
4. Add Internal Testers (max 100, gratuit, pas de review Apple)
5. Tester sur device réel via app TestFlight
6. **Vérifier** :
   - [ ] Onboarding 5 écrans fluide
   - [ ] Push notif arrive bien à 9h (ou test manuel via cron)
   - [ ] Achat IAP fonctionne en sandbox (créer un Sandbox Tester dans App Store Connect > Users and Access > Sandbox)
   - [ ] Restore Purchases fonctionne
   - [ ] Suppression compte cascade
   - [ ] NextAuth login fonctionne dans le webview

## 16. Upload Play Console Internal Testing

1. Play Console > ton app > Testing > Internal testing
2. Create new release > Upload .aab
3. Add testers (email list)
4. Lien partagé aux testeurs → install via Play Store
5. Tests identiques iOS + spécifiques Android (back button, share intent)

## 17. Soumission App Store (review)

1. App Store Connect > ton app > **App Store** tab
2. Compléter :
   - **App Information** : catégorie Lifestyle, secondary Education
   - **Pricing and Availability** : Free (avec IAP)
   - **App Privacy** : remplir Privacy Nutrition Labels (voir `docs/mobile/legal-mobile.md` §1)
   - **Age Rating** : 12+
3. **Prepare for Submission** :
   - Description (copier `docs/mobile/aso-mobile.md` §1)
   - Keywords (idem)
   - Support URL : `https://deviens-marrant.fr/contact`
   - Marketing URL : `https://deviens-marrant.fr`
   - Privacy Policy URL : `https://deviens-marrant.fr/confidentialite-mobile`
4. **Screenshots** : uploader 5 captures par taille (6.7", 6.5", 5.5")
5. **Build** : sélectionner le build TestFlight validé
6. **In-App Purchases** : créer `premium_monthly` dans App Store Connect (lié à RevenueCat)
7. **Submit for Review**
8. Attente review : 24-48h en général

## 18. Soumission Play Store

1. Play Console > Production > Create new release
2. Promote depuis Internal testing OU upload nouveau .aab
3. Compléter :
   - **Store listing** : titre, description (`docs/mobile/aso-mobile.md` §3), screenshots, feature graphic
   - **Content rating** : remplir le questionnaire (Teen — humour suggestif occasionnel)
   - **Data safety** : remplir form (voir `docs/mobile/legal-mobile.md` §2 tableau)
   - **App content** : Privacy policy URL
   - **Subscriptions** : créer `premium_monthly` (lié RevenueCat)
4. **Send for review**
5. Attente review : 1-7 jours (variable)

---

## Risques persistants — À garder en tête

| # | Risque | Action |
|---|---|---|
| R1 | Master merge non confirmé | Vérifier `git show master:...` AVANT cap sync |
| R2 | IAP -30% commission = -9% MRR estimé | Monitor 90j, ajuster tarif mobile +30% si confirmé |
| R3 | Réflexe P0 #2 — vérifier branche déployée | Tout fix prod : commencer par `git show master:<file>` |

---

## Checklist finale avant submission

- [ ] Master merge confirmé (Réflexe P0 #2)
- [ ] Build web + mobile passent (`npm run build && BUILD_TARGET=mobile npm run build:mobile`)
- [ ] Tests passent (`npx jest --no-coverage`)
- [ ] Migration Prisma effectuée (PushToken + WebhookEvent)
- [ ] Package `apn` installé + sendAPNS finalisé
- [ ] Middleware CORS créé
- [ ] NextAuth cookies SameSite=None
- [ ] 8 secrets Replit ajoutés (FCM, APNs, RevenueCat)
- [ ] CGV mobile en ligne : `https://deviens-marrant.fr/cgv-mobile`
- [ ] Privacy mobile en ligne : `https://deviens-marrant.fr/confidentialite-mobile`
- [ ] Apple Developer + Google Play Console actifs
- [ ] RevenueCat configuré + webhook actif
- [ ] FCM Server Key + APNs `.p8` en place
- [ ] Premier build TestFlight + Play Console Internal validés
- [ ] Sandbox IAP testé avec succès
- [ ] Push notif testée (manuel + cron)

---

## Phase 5.A — CEO Agent — Couche données + agent core (session 10)

> Migration Prisma + squelette agent posé. Cette section liste les actions manuelles Replit pour activer la base CEO en production.
> Source : `docs/product/ceo-agent-specs.md` §2, `docs/ia/ceo-agent-architecture.md`, branche `claude/marrant-s10-ceo-implementation-*`.

### 1. Migration Prisma — créer les 9 tables CEO + extensions User

```bash
# Sur Replit shell, après merge de la branche dans master :
cd apps/web
npx prisma generate
npx prisma migrate deploy   # applique 5_add_ceo_tables/migration.sql
```

Tables créées :
- `CeoConfig` (singleton kill-switch + budget + dryRun)
- `CeoTask` (file de tâches PENDING/RUNNING/DONE/FAILED)
- `CeoMemory` (clé/valeur namespace, mémoire long-terme + TTL court-terme)
- `CeoLead` (CRM léger, score 0-50, status COLD→IN_SEQUENCE→CONVERTED)
- `CeoOutboundMessage` (messages outbound + inbound, UTM tracking)
- `CeoKpiSnapshot` (snapshot quotidien KPIs dashboard /admin/ceo)
- `CeoBacklink` (pitchs + acquisitions backlinks 5 canaux)
- `CeoAuditLog` (RGPD rétention 3 ans, PII hashé SHA256)
- `CeoDedup` (anti-spam 24h, hash SHA256)
- `CeoCommentBlacklist` (humoristes pros + influenceurs >10k + journalistes)
- **+ `SocialPostDailyLock`** (P1 race condition s08/04 — 1 run social/jour)

Colonnes ajoutées sur `User` :
- `lastCeoTouchpoint TIMESTAMP(3)` (fenêtre attribution conversion 7j)
- `emailOptOut BOOLEAN DEFAULT false` (CEO refuse cet utilisateur si true)

Migration **idempotente** : utilise `IF NOT EXISTS` partout. Peut être rejouée sans effet secondaire.

### 2. Seeder initial CeoConfig (kill-switch ON par défaut = SAFE)

Avant le 1er tick CEO, insérer la ligne singleton de config. **Par défaut `enabled = false`** (fail-safe — l'agent ne fait RIEN tant que Thomas ne l'active pas explicitement) :

```sql
-- À exécuter une fois en console Neon ou via prisma studio
INSERT INTO "CeoConfig" (
  "id", "enabled", "dailyBudgetEur", "maxActionsPerTick",
  "autoSendEmail", "autoSendDm", "socialOutboundEnabled", "dryRun", "updatedAt"
) VALUES (
  'ceo-config-singleton', false, 2.0, 3, false, false, false, true, NOW()
)
ON CONFLICT ("id") DO NOTHING;
```

### 3. Nouveaux Secrets Replit à ajouter (Phase 5.A — préparation 5.B)

À mettre dès maintenant dans Replit Secrets (mais pas encore utilisés en Phase 5.A) :

| Secret | Description | Source |
|---|---|---|
| `CEO_KILL_SWITCH_OVERRIDE` | (optionnel) String "true" pour forcer kill-switch même si DB activée | Manuel — dépannage urgence |
| `CEO_ADMIN_EMAIL` | Email destinataire alertes budget + reporting hebdo | `alex@deviens-marrant.fr` |
| `TWITTER_API_KEY` | OAuth dédié CEO (distinct de Buffer) | https://developer.twitter.com Phase 5.B |
| `TWITTER_API_SECRET` | idem | idem |
| `TWITTER_ACCESS_TOKEN` | idem | idem |
| `TWITTER_ACCESS_SECRET` | idem | idem |
| `INSTAGRAM_PAGE_ACCESS_TOKEN` | DMs inbound Business (fenêtre 24h) | Meta Business Suite Phase 5.B |
| `RESEND_INBOUND_WEBHOOK_SECRET` | Validation HMAC webhook Resend Inbound | Resend dashboard Phase 5.B |

**Important** : `TWITTER_*` du CEO doit être un **compte/app distinct** du Buffer daily-social pour éviter les rate limits croisés.

### 4. Vérifier que les tests existants passent

```bash
cd apps/web
npx jest --no-coverage
```

Attendu : **1051/1051 tests passent** (Phase 5.A n'ajoute que des `describe.skip` placeholders, zéro test fonctionnel — ceux-là arrivent en Phase 5.D).

### 5. Préparation Phase 5.B (HORS périmètre Phase 5.A)

À faire en Phase 5.B (prochaine sous-passe) :

- [ ] Créer `/api/cron/ceo-tick` (toutes 2-4h)
- [ ] Créer `/api/cron/ceo-kpis-snapshot` (daily 5h UTC)
- [ ] Créer `/api/ceo/contest` (endpoint art. 22 RGPD)
- [ ] Migrer `apps/web/src/lib/ai/agents/haro-agent.ts` (96 topics + ALEX_BIO + templates) vers le module backlinks de `ceo-agent.ts`
- [ ] Supprimer `haro-agent.ts` + `apps/web/src/app/api/cron/haro/route.ts` après Grep d'orphelins
- [ ] Implémenter `validateCeoOutbound()` dans `standup-director-agent.ts` (gate G-CEO1 anti-surveillance, G-CEO2 anti-FOMO, G-CEO3 valeur éducative > conversion)
- [ ] Intégrations APIs : Twitter v2 DM, Resend Inbound webhook, Instagram Graph
- [ ] Mettre à jour `enforceEmailFooter()` pour les emails CEO (footer opt-out RGPD obligatoire)
- [ ] Implémentation Resend pour envoi rapport hebdo Thomas

### 6. Préparation Phase 5.C / 5.D (HORS périmètre)

- Phase 5.C : Dashboard React `/admin/ceo` (8 composants : timeline, file drafts, funnel, budget, KPIs sem, kill-switch toggle, audit log, leads scoring)
- Phase 5.D : Tests Jest exhaustifs (cible 90% sur `ceo-agent.ts`, `ceo-helpers.ts`, `ceo-validate.ts`)

### Checklist Phase 5.A — done quand :

- [ ] Branche `claude/marrant-s10-ceo-implementation-*` mergée dans master
- [ ] `npx prisma migrate deploy` exécuté avec succès sur Replit (vérifie 11 nouvelles tables + 2 colonnes User)
- [ ] CeoConfig singleton inséré (kill-switch OFF par défaut)
- [ ] 8 nouveaux Secrets Replit ajoutés (vides ok pour Phase 5.A — utilisés en 5.B)
- [ ] Tests existants passent (1051/1051)
- [ ] `runDailySocialJob` lancé une fois → `SocialPostDailyLock` insère 1 ligne (vérifier en console Neon : `SELECT * FROM "SocialPostDailyLock" ORDER BY "createdAt" DESC LIMIT 5;`)

---

## Phase 5.B — CEO Agent — Crons + Director CEO + Footer email + Rapport hebdo (session 10)

### 1. Nouveaux Secrets Replit (BLOQUANTS — à ajouter avant déploiement)

| Secret | Description | Valeur recommandée |
|---|---|---|
| `UNSUBSCRIBE_HMAC_SECRET` | Clé HMAC-SHA256 pour signer les tokens unsubscribe (≥ 32 chars). Si compromis : la rotation invalide tous les liens existants — à générer 1 fois et garder stable. | `openssl rand -hex 32` |
| `ADRESSE_POSTALE` | Adresse postale identifiable pour conformité CPCE L34-5 (footer email obligatoire). Décision Thomas : adresse perso, domiciliation pro, ou formulation minimale type "France". | À trancher par Thomas |
| `CEO_ADMIN_EMAIL` | Email destinataire rapport hebdo CEO (Opus 4.7 lundi) | `alex@deviens-marrant.fr` (par défaut) |
| `NEXT_PUBLIC_BASE_URL` | URL base pour construire les liens unsubscribe (déjà existant probablement) | `https://deviens-marrant.fr` |

**Sans `UNSUBSCRIBE_HMAC_SECRET` configuré** : `enforceEmailFooter()` throw → tout envoi email CEO échoue (BLOQUANT pré-S3 conforme audit @legal).

### 2. Configurer les nouveaux crons Replit (Scheduled Deployments)

| Cron | Fréquence | Endpoint | Header auth |
|---|---|---|---|
| `ceo-tick` | Toutes les heures | `GET https://deviens-marrant.fr/api/cron/ceo-tick` | `Authorization: Bearer $CRON_SECRET` |
| `ceo-kpis-snapshot` | Toutes les heures | `GET https://deviens-marrant.fr/api/cron/ceo-kpis-snapshot` | `Authorization: Bearer $CRON_SECRET` |

**Time gate côté code** :
- `ceo-tick` ne s'exécute QUE entre 2h et 4h59 UTC (sinon retourne `skipped: out-of-window`)
- `ceo-kpis-snapshot` ne s'exécute QUE à 5h UTC (sinon `skipped: out-of-window`)

→ Sur Replit, configurer un cron horaire suffit (les autres heures retournent immédiatement, coût négligeable).

**Pour tester manuellement (force exécution hors fenêtre)** :
```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://deviens-marrant.fr/api/cron/ceo-tick?force=true"
curl -H "Authorization: Bearer $CRON_SECRET" "https://deviens-marrant.fr/api/cron/ceo-kpis-snapshot?force=true"
```

### 3. Endpoint manuel `/api/ceo/contest` (art. 22 RGPD)

Pas de cron — endpoint admin manuel utilisable depuis le futur dashboard `/admin/ceo` (Phase 5.C) ou via curl :

```bash
curl -X POST https://deviens-marrant.fr/api/ceo/contest \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"messageId":"<id>", "reason":"Ton trop directif sur le P3"}'
```

Effet : `CeoOutboundMessage.status = REJECTED`, audit log + blocage envoi.

### 4. Tester le footer email + désinscription

Après déploiement, vérifier que le pipeline complet fonctionne :

```bash
# 1. Lancer un tick CEO en force pour générer un draft email
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://deviens-marrant.fr/api/cron/ceo-tick?force=true"

# 2. Vérifier dans la DB que le footer est présent dans le content
psql $DATABASE_URL -c "SELECT content FROM \"CeoOutboundMessage\" ORDER BY \"createdAt\" DESC LIMIT 1;" | grep "CEO_FOOTER_V1"

# 3. Tester le lien unsubscribe (récupérer un token signé du draft)
# Le token est dans le HTML : <a href=".../api/unsubscribe?token=XXX">
curl -i "https://deviens-marrant.fr/api/unsubscribe?token=<token>"
# Attendu : 200 + page HTML "Désinscription confirmée"
```

### 5. Vérifier conformité Audit @legal s9 (BLOQUANT pré-S3)

- [ ] `enforceEmailFooter()` appelé dans `composeOutboundMessage()` AVANT `dualPassValidate()` (déjà câblé Phase 5.B)
- [ ] Footer contient adresse postale identifiable (`ADRESSE_POSTALE` configuré)
- [ ] Lien désinscription token signé HMAC valide
- [ ] Mention "Tu reçois cet email parce que tu t'es inscrit·e..." (CPCE L34-5)
- [ ] User.emailOptOut respecté dans `handleOutboundEmail` (skip envoi si true)
- [ ] CeoLead.optOut + status OPT_OUT respectés

### 6. HORS périmètre Phase 5.B (gardé pour 5.B.2 / 5.C / 5.D)

À faire en Phase 5.B.2 :
- [ ] Twitter v2 DM API (auth OAuth + send DM + Resend Inbound webhook)
- [ ] Instagram Graph API (drafts permanents)
- [ ] Suppression `haro-agent.ts` (migration des 96 topics + ALEX_BIO + templates → module backlinks CEO)
- [ ] Remplacement scraping Connectively/SourceBottle par RSS/Zapier (recommandation @legal)
- [ ] Lead scoring auto (signaux Umami + DB `User.streak`/`JokeLike`)

À faire en Phase 5.C :
- [ ] Dashboard React `/admin/ceo` (8 composants — cf docs/analytics/ceo-kpis-dashboard.md)
- [ ] UI contest message (bouton "Contester" sur chaque draft)
- [ ] UI kill-switch toggle

À faire en Phase 5.D :
- [ ] Tests Jest exhaustifs (cible 90% coverage `ceo-agent.ts`, `ceo-helpers.ts`, `ceo-email-footer.ts`)
- [ ] Tests E2E pipeline complet (draft → validation → footer → send → unsubscribe)

### 7. Pre-commit check (BLOQUANT — Règle n°6 CLAUDE.md)

Sur Replit avant tout commit :

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build
```

Si une commande échoue → corriger AVANT de commiter. Phase 5.B introduit 4 nouveaux fichiers + 3 modifs (ceo-agent.ts, ceo-helpers.ts, standup-director-agent.ts) — toute erreur TypeScript doit être traitée.

### Checklist Phase 5.B — done quand :

- [ ] 4 nouveaux Secrets Replit configurés (`UNSUBSCRIBE_HMAC_SECRET`, `ADRESSE_POSTALE`, `CEO_ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`)
- [ ] 2 crons configurés sur Replit Scheduled Deployments (ceo-tick, ceo-kpis-snapshot)
- [ ] `npx prisma migrate deploy` re-exécuté (rien de nouveau Phase 5.B mais idempotent OK)
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Test manuel `?force=true` sur les 2 crons → réponses JSON success
- [ ] Test manuel `/api/unsubscribe?token=...` → page HTML "Désinscription confirmée"
- [ ] Test manuel `POST /api/ceo/contest` → 200 + audit log inséré
- [ ] Vérifier en DB qu'un draft email contient bien le marker `CEO_FOOTER_V1`

---

## Phase 5.B.2 — APIs externes CEO (Twitter v2 DM + Resend Inbound + suppression haro-agent)

> Livrée session 9 (3e sous-passe Phase 5). Couvre l'envoi LIVE de DMs Twitter
> + la réception de replies email Resend + la migration haro-agent → ceo-backlinks.

### 1. Nouveaux Replit Secrets (BLOQUANT)

```
TWITTER_BEARER_TOKEN=AAAA...      # OAuth 2.0 Bearer (lookup user OK, DM POST exige user-context)
RESEND_WEBHOOK_SECRET=<32+ chars> # HMAC SHA-256 — généré via `openssl rand -hex 32`
```

**Note Twitter user-context (DM POST)** : le Bearer suffit pour `lookupTwitterUserId`, mais `POST /2/dm_conversations/...` exige OAuth 1.0a User Context en prod. Si Twitter retourne 401 sur le DM send, ajouter aussi :
```
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...
```
(Phase 5.B.3 — pour l'instant le Bearer reste le default, on log 401 et on traitera quand ça arrive.)

### 2. Configuration webhook Resend Inbound

Dashboard Resend → Webhooks :
1. Endpoint : `https://deviens-marrant.fr/api/webhooks/resend-inbound`
2. Events : `email.received` (inbound replies)
3. Signing secret : utiliser la valeur mise dans `RESEND_WEBHOOK_SECRET`
4. Test : Resend permet d'envoyer un payload test → vérifier 200 OK + entrée dans `CeoOutboundMessage` direction=`INBOUND_REPLY`

Si Resend Inbound n'est pas activé sur le compte (pricing payant), reporter en Phase 5.B.3 — le code est prêt et inerte sans webhook envoyé.

### 3. Suppression du cron HARO

Replit Scheduled Deployments → Supprimer le cron `/api/cron/haro` (s'il existait). La route est supprimée du code (404 sinon). Le module `haro-agent.ts` est remplacé par `ceo-backlinks.ts` (96 topics + bio collective + 8 templates) et la fonction `pitchToBacklinkOpportunity()` exposée par `ceo-agent.ts`.

### 4. Pre-commit check (BLOQUANT — Règle n°6 CLAUDE.md)

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build
```

3 nouveaux fichiers Phase 5.B.2 :
- `apps/web/src/lib/ai/ceo-backlinks.ts`
- `apps/web/src/lib/twitter/twitter-client.ts`
- `apps/web/src/app/api/webhooks/resend-inbound/route.ts`

2 fichiers modifiés :
- `apps/web/src/lib/ai/agents/ceo-agent.ts` (ajout `pitchToBacklinkOpportunity`, complétion `handleOutboundDm`, routage `DRAFT_DM_REPLY`)
- `apps/web/src/__tests__/lib/ceo-backlinks.test.ts` (remplace `haro-agent.test.ts`)

2 fichiers supprimés :
- `apps/web/src/lib/ai/agents/haro-agent.ts`
- `apps/web/src/app/api/cron/haro/route.ts`
- `apps/web/src/__tests__/lib/haro-agent.test.ts`

### 5. Checklist Phase 5.B.2 — done quand :

- [ ] 2 nouveaux Secrets configurés (`TWITTER_BEARER_TOKEN`, `RESEND_WEBHOOK_SECRET`)
- [ ] Webhook Resend configuré dashboard + test ping 200 OK
- [ ] Cron `/api/cron/haro` supprimé de Replit Scheduled Deployments
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Test manuel `POST /api/webhooks/resend-inbound` avec signature valide → entrée `CeoOutboundMessage direction=INBOUND_REPLY`
- [ ] Test manuel reply contenant "stop" → `User.emailOptOut=true` + `CeoLead.status=OPT_OUT`
- [ ] Tests Jest `ceo-backlinks.test.ts` PASS

### Hors périmètre Phase 5.B.2 (reporté Phase 5.B.3) :

- [ ] Instagram Graph API (drafts permanents)
- [ ] Lead scoring auto (signaux Umami + User.streak/JokeLike)
- [ ] Câblage `siteReturn48h` dans `snapshotCeoKpis` (Umami cross-session)
- [ ] Routage IA des replies entrants (le webhook persiste seulement)
- [ ] Twitter OAuth 1.0a User Context (si DM POST retourne 401 avec Bearer)
- [ ] Remplacement scraping Connectively → RSS/Zapier (handoff manuel Thomas, hors code)

---

## Phase 5.C — Dashboard `/admin/ceo` (frontend)

### Aucun nouveau Secret requis

L'auth utilise le `ADMIN_PASSWORD` existant (mêmes Bearer headers que `/admin/social`).
Aucune action env / Secrets / cron à effectuer côté Replit.

### Vérification post-déploiement

1. Aller sur `https://deviens-marrant.fr/admin/ceo`
2. Login avec `ADMIN_PASSWORD`
3. Vérifier que les 6 onglets se chargent : Tâches, Brouillons, Funnel 30j, KPIs, Backlinks, Audit
4. Si vide partout → c'est normal tant que la Phase 5.B.2 backend n'a pas tourné (pas de tasks, pas de drafts, pas de snapshots KPI)
5. Tester le toggle kill-switch (peut être OFF/ON sans risque tant que `dryRun=true` dans `CeoConfig`)

### Fichiers ajoutés Phase 5.C (frontend uniquement) :

- `apps/web/src/app/admin/ceo/page.tsx`
- `apps/web/src/components/admin/ceo/types.ts`
- `apps/web/src/components/admin/ceo/CeoHeader.tsx`
- `apps/web/src/components/admin/ceo/CeoTasksList.tsx`
- `apps/web/src/components/admin/ceo/CeoDraftsList.tsx`
- `apps/web/src/components/admin/ceo/CeoFunnel.tsx`
- `apps/web/src/components/admin/ceo/CeoKpiPanel.tsx`
- `apps/web/src/components/admin/ceo/CeoBacklinksList.tsx`
- `apps/web/src/components/admin/ceo/CeoAuditLog.tsx`
- `apps/web/src/app/api/admin/ceo/_helpers.ts`
- `apps/web/src/app/api/admin/ceo/data/route.ts`
- `apps/web/src/app/api/admin/ceo/kill-switch/route.ts`
- `apps/web/src/app/api/admin/ceo/run-task/route.ts`
- `apps/web/src/app/api/admin/ceo/approve/route.ts`
- `apps/web/src/app/api/admin/ceo/reject/route.ts`
- `apps/web/src/app/api/admin/ceo/contest/route.ts`
- `apps/web/src/__tests__/feature/CeoHeader.test.tsx`
- `apps/web/src/__tests__/feature/CeoDraftsList.test.tsx`
- `apps/web/src/__tests__/feature/CeoKpiPanel.test.tsx`

### Checklist Phase 5.C — done quand :

- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Tests Jest `CeoHeader / CeoDraftsList / CeoKpiPanel` PASS
- [ ] `/admin/ceo` accessible avec ADMIN_PASSWORD
- [ ] Kill-switch toggle fonctionnel (test ON → OFF → ON, vérifier `CeoConfig.enabled` en DB)
- [ ] Phase 5.D (tests exhaustifs) à lancer ensuite

## Hotfix s9 deploy bugs (07/05/2026 — TSC FAIL 30+ erreurs)

Découvert lors du `npx tsc --noEmit` post-merge de la branche s9. Mix de :
- Bugs Phase 5.A/B nouveaux (4) : casts SocialPlatform/SocialFormat, Prisma.InputJsonValue, union type outcome
- Bugs latents Phase 5 mobile session 7 (3) : `PushToken` model jamais déclaré, `WebhookEvent.eventId` champ jamais ajouté, ces erreurs masquées par `next.config.js ignoreBuildErrors:true` en build (tsc --noEmit ne triche pas)
- Configs (3) : tsconfig target trop bas (Set/Map iteration + regex `s` flag), `@types/jest` absent, `auth-cta` size "default" obsolète

### Actions Replit après merge du commit hotfix

```bash
# 1. Re-installer (pour @types/jest ajouté)
cd apps/web && npm install

# 2. Re-générer le client Prisma (pour PushToken + WebhookEvent.eventId)
npx prisma generate

# 3. Appliquer la nouvelle migration (idempotente — peut être rejouée sans casser)
npx prisma migrate deploy

# 4. Pre-commit check obligatoire (Règle n°6 CLAUDE.md)
npx tsc --noEmit && npx next lint && npm run build
```

### Migration `6_fix_pushtoken_webhookevent_schema/migration.sql`

Idempotente :
- `WebhookEvent` : ajout `eventId` UNIQUE + `provider` + `eventType` + `receivedAt` (backfill `eventId = id` pour rows existants)
- `PushToken` : nouveau modèle (id, userId, token UNIQUE, platform, lastSeenAt, createdAt) + FK `User.id` ON DELETE CASCADE

### Checklist hotfix done quand
- [ ] `npm install` réussit (lock file mis à jour)
- [ ] `npx prisma generate` régénère le client avec `pushToken` et `webhookEvent.eventId`
- [ ] `npx prisma migrate deploy` applique migration 6 sans erreur
- [ ] `npx tsc --noEmit` retourne 0 erreur
- [ ] `npx next lint` passe (warnings OK, errors NOK)
- [ ] `npm run build` réussit
- [ ] Smoke test : POST `/api/cron/ceo-tick?force=true` → 200 + JSON success

---

## Phase 1b — Vannes pédagogiques : décryptage des 265 vannes (session 10)

> Phase 1a (schéma `Joke.comedyTechnique/techniqueExplanation/howToApply` + agent `generateJokeDecryptage` + migration `7_add_joke_decryptage`) déjà livrée et mergée.
> Phase 1b : affichage UI du décryptage dans le catalogue + **application automatique au boot** des 265 décryptages pré-rédigés.
> **Note s10 (retrait vannes faibles)** : le catalogue est passé de 289 → 265 vannes (24 vannes faibles désactivées en soft delete au boot via `deactivateWeakJokesTask`). Les compteurs de cette section reflètent désormais 265.

### Aucune action manuelle requise — c'est appliqué au boot

Les 265 décryptages sont rédigés à la main et bundlés dans `apps/web/src/data/joke-decryptages.json`
(indexés par `content`). À chaque déploiement, ~30 s après le boot, `applyJokeDecryptagesTask()`
(`lib/startup-tasks.ts`) applique les 3 champs (`comedyTechnique`, `techniqueExplanation`,
`howToApply`) à toutes les vannes `comedyTechnique IS NULL`, **en une passe, SANS IA, SANS coût**.

- **Instantané** : le catalogue est décrypté intégralement dès le démarrage (pas de progressif 50/jour).
- **Idempotent** : ne touche que les vannes null → relançable, 0 effet une fois appliqué.
- **Robuste** : `withDbRetry` (cold start Neon) + try/catch global → ne bloque jamais le boot.
- **Log attendu** : `[startup] décryptages appliqués : 265/265.` puis `[startup] vannes faibles désactivées : 24` (au 1er boot post-déploiement ; 0 aux boots suivants car idempotent).

> La migration `7_add_joke_decryptage` (3 colonnes nullable) est appliquée par `prisma db push`
> au build. Le décryptage des données suit au boot.

### Nouvelles vannes quotidiennes (IA conservée)

`generateJokeDecryptage` (Sonnet) reste actif **uniquement** pour les NOUVELLES vannes générées
chaque jour par `generateDailyJoke` : elles reçoivent leur décryptage à la génération. Le catalogue
existant, lui, n'appelle plus jamais l'IA.

### Script manuel (optionnel, debug)

`apps/web/scripts/backfill-joke-decryptage.ts` reste lançable à la main si besoin :

```bash
cd apps/web
npx tsx scripts/backfill-joke-decryptage.ts            # ré-applique depuis le fichier (SANS IA, défaut)
npx tsx scripts/backfill-joke-decryptage.ts --dry-run  # log sans écrire
npx tsx scripts/backfill-joke-decryptage.ts --ai       # fallback IA pour les vannes ABSENTES du fichier
```

### Vérification

```bash
# Doit retourner 0 (toutes les vannes du catalogue sont décryptées)
psql $DATABASE_URL -c "SELECT count(*) FROM \"Joke\" WHERE \"comedyTechnique\" IS NULL AND \"isActive\" = true;"
```

Puis dans le catalogue `https://deviens-marrant.fr/vannes` : cliquer une vanne pour révéler
la chute → un bloc "Pourquoi ça marche — [technique]" + "À toi de jouer" apparaît sous la chute.

### Checklist Phase 1b — done quand :

- [ ] Migration 7 appliquée (via `prisma db push` au build)
- [ ] Au boot, log `[startup] décryptages appliqués : 265/265.`
- [ ] Au 1er boot post-déploiement, log `[startup] vannes faibles désactivées : 24` (puis 0 aux boots suivants)
- [ ] `count(*) WHERE comedyTechnique IS NULL AND isActive` = 0
- [ ] `count(*) WHERE isActive = true` = 265 (catalogue actif après retrait des 24 faibles)
- [ ] Vérif visuelle catalogue (bloc décryptage affiché)
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS

---

## s12 — Adaptation du code pour Cloudflare Workers (29/09/2026) : AUCUNE action Replit

**Aucune action requise sur Replit.** Rien n'est redéployé (décision fondateur du 29/09 : la prod
Replit reste telle quelle jusqu'à la bascule). Détails : `docs/infra/cloudflare-runbook.md`.

Le build et le démarrage Replit (`npm run build` / `npm start` racine, sortie standalone) sont
inchangés et vérifiés (`tsc -p tsconfig.build.json`, `next lint`, `next build` : PASS). Les
chemins Cloudflare passent par de nouveaux scripts (`build:cf`, `preview:cf`, `deploy:cf`) et la
variable `MARRANT_BUILD_TARGET=cloudflare`, jamais posée sur Replit.

Différences observables si cette branche était un jour redéployée sur Replit (retour arrière) :
- Planificateur : corps de `instrumentation.ts` déplacé tel quel dans `src/lib/scheduler/`
  (mêmes jobs, fenêtres, verrous, ordre, self-fetch `localhost`/`127.0.0.1:${PORT}`).
  `register()` ne l'importe que sous `NEXT_RUNTIME === "nodejs"` : l'instrumentation edge
  n'embarque plus de code Node (bundle middleware affiché 51 kB au build).
- 3 images OpenGraph (`/opengraph-image`, `/quiz-humour/…`, `/blog/[slug]/…`) passent du runtime
  edge au runtime Node (OpenNext refuse l'edge) : elles sont désormais prérendues au build
  (même rendu `next/og`).
- `npm install` installe en plus `@prisma/adapter-pg` (non chargé sous Node), `@opennextjs/cloudflare`
  et `wrangler` (dev, binaire workerd : installation plus longue).
- 2 nouvelles routes protégées par `CRON_SECRET` : `/api/cron/scheduler-tick`,
  `/api/cron/startup-tasks` (non planifiées sur Replit).
