# Audit de la page admin (s21, 18/10/2026)

Demande de Thomas (18/10) : inscrits à la lettre dans les abonnés, page revue « nickel », qui reflète le rapport du lundi.
Périmètre lu : `apps/web/src/app/admin/page.tsx` (1 517 lignes, un seul composant client), `admin/layout.tsx`, `api/admin/*`, `lib/analytics/weekly-*`.

## 1. Ce que la page montre aujourd'hui

Connexion par mot de passe (`POST /api/admin/auth`, 5 essais / 15 min), puis 4 onglets.

| Onglet | Source | Contenu |
|---|---|---|
| Tableau de bord | `/api/admin/stats` | Alertes contenu (contenu du jour, blog, posts sociaux en attente ou en échec) ; « KPIs Business » (MRR, conversion, utilisateurs, inscrits 30 j) ; « Abonnements » (Premium actifs, plan gratuit, annulés, impayés) ; « Engagement » (XP total, favoris, parcours, contenu total). |
| Utilisateurs | `/api/admin/users` | Table paginée des comptes (plan, abonnement, XP, streak, favoris, dates), bouton « Sync » Stripe. |
| Social Media | `/api/admin/social` | Posts par statut, approbation et rejet. |
| Planning | `/api/admin/planning` | Plan éditorial blog (JSON), calendrier SEO, posts sociaux 30 j, contenu du jour sur 14 jours, « Plans mensuels agents ». |

APIs admin sans écran : `visits-report` (rapport du lundi à la demande), `alertes`, `llm-usage`, `db`, `planning`, `ceo/*`, `social/report`, `social/platforms` (page `/admin/social`).

## 2. Cassé, périmé ou faux

1. **Explications d'alerte fausses depuis le 01/10.** « Le cron daily-content a probablement échoué (contenu rejeté par le directeur artistique, score < 9/10) » et « le cron weekly-seo a peut-être rejeté l'article » : la génération IA au fil de l'eau est coupée (`CONTENT_GENERATION_ENABLED` absent). Le contenu du jour sort du **stock préparé** : la vraie cause d'un trou est un stock vide ou une base illisible.
2. **Le stock n'apparaît nulle part**, alors que c'est l'alerte qui compte depuis le 18/10 (« Nouveau lot à préparer » sous 14 jours dans le rapport du lundi).
3. **« Plans mensuels agents »** (onglet Planning) : plans de l'agent mensuel IA, abandonné. À retirer.
4. **Posts sociaux « en attente du score 9/10 du directeur artistique »** : les posts viennent du stock préparé et partent par Buffer. Le texte est périmé ; « Tweet ID », impressions, likes et RT ne sont plus alimentés.
5. **Chiffres divergents du rapport du lundi** : « Inscrits 30 j », « +N cette semaine » (7 jours glissants, pas la semaine du rapport), « Annulés » (cumul depuis l'origine, pas les résiliations de la semaine), « Plan gratuit » (plus de compte gratuit depuis le 06/10 : ce sont les 11 anciens comptes). Calculs refaits à part dans `api/admin/stats`, au lieu des fonctions du rapport (`weekly-funnel.ts`).
6. **« Engagement » (XP total, favoris)** : indicateurs de l'ancienne version gamifiée, sans lien avec l'objectif (MRR). « Parcours dispo. » compte aussi les parcours inactifs.
7. **Contenu du jour « aujourd'hui »** calculé à l'heure locale du serveur alors que les jours sont stockés en UTC.
8. Erreurs de chargement avalées (`// silently fail`) : une API en panne donne un écran vide, sans message.
9. Mobile : 4 onglets serrés sur une ligne, table des comptes à 10 colonnes.

Noms d'événements : la page n'en lit aucun. Le rapport du lundi lit `checkout-ouvert` et `checkout-echec` par `src` (s21). Point à trancher : `abonnement-clic` **est encore émis** par le code (6 appels, voir `components/premium`, `home/carte-premium-achat.tsx`, `hooks/use-premium-checkout.ts`) ; il reste donc compté dans l'entonnoir, en amont de `checkout-ouvert` (clic, puis ouverture de Stripe). `accueil-hero` n'est plus émis (retiré avec le lien) ; s'il apparaît encore, c'est un ancien visiteur en cache.

## 3. Ce qui manque par rapport au rapport du lundi

Le rapport du lundi (un seul e-mail) contient : visites (semaine contre précédente, par jour, pages, sources), blog (événements, paliers, articles suivis), stock du contenu du jour, entonnoir (dont paiement ouvert par `src`), parcours, réseaux sociaux (prévu contre publié), digest des alertes. **La page admin n'en montre aucune section.**

Manquent aussi : abonnés actifs par formule (mensuel, annuel), nouveaux abonnés et résiliations **de la semaine**, et tout ce qui concerne la lettre (inscrits par statut et par emplacement, envois par numéro, prochain numéro). Le rapport du lundi n'a pas non plus de section lettre.

## 4. Décisions (Thomas suit les recos)

- Onglet par défaut **« Semaine »** : la semaine du dernier rapport du lundi (lundi au dimanche), option « 7 derniers jours ». Une API `GET /api/admin/semaine` appelle **les mêmes fonctions** que l'e-mail (`buildWeeklyVisitsReport`, `buildWeeklyFunnel`, `buildWeeklyParcours`, stock `getStockCoverage`, `chargerRapport`), avec les mêmes lectures en base. Ordre : alertes, chiffres clés, visites, entonnoir, parcours, blog, lettre, réseaux sociaux.
- Onglet **« Abonnés »** : Premium (comptes) et **lettre** (`GET /api/admin/lettre`). Jamais l'empreinte IP ni les jetons ; comptes de test (`ANALYTICS_EMAILS_EXCLUS`) exclus des compteurs et marqués dans la liste ; sans la migration 14, la liste des inscrits reste lisible et les numéros affichent « migration 14 non jouée ».
- Section **lettre ajoutée au rapport du lundi** (même fonction que l'admin) : le rapport et la page disent la même chose.
- Abonnés actifs ventilés mensuel / annuel dans la fonction partagée (`prismaFunnelCounter`), donc dans l'e-mail aussi.
- Retirés : « Engagement », « Plans mensuels agents », textes « directeur artistique 9/10 », métriques Twitter. Corrigés : alerte contenu du jour (jour UTC, cause = stock), libellés.
- Recommandation non appliquée (change les chiffres du lundi) : exclure les comptes de test de l'entonnoir (comptes créés, abonnés actifs, MRR), comme le bloc parcours.

## 5. Livré (s21, 18/10)

- `app/admin/page.tsx` : 1 517 → 150 lignes (connexion et onglets) ; onglets dans `components/admin/` (`semaine-tab`, `semaine-trafic`, `semaine-conversion`, `abonnes-tab`, `comptes-section`, `lettre-section`, `social-tab`, `planning-tab`, `admin-ui`) et `hooks/use-admin-fetch.ts` (erreurs affichées, 401 = reconnexion).
- APIs : `GET /api/admin/semaine` (`lib/admin/semaine.ts`), `GET /api/admin/lettre` (`lib/admin/lettre-inscrits.ts`), contrôle `lib/admin/auth.ts` (même règle que les routes existantes, inchangées).
- Fonctions partagées avec l'e-mail : `lib/analytics/weekly-lettre.ts` (nouveau), `lignesFunnel` et `compterParFormule` (`weekly-funnel.ts`), `lignesParcours` (`weekly-parcours.ts`), `dernierRapportDuLundi` (`weekly-visits-period.ts`) ; Umami facultatif dans `buildWeeklyFunnel` / `buildWeeklyParcours` (la base reste lue sans Umami).
- `/api/admin/stats` n'est plus lu par la page (gardé pour les appels curl et son test) ; `/api/admin/planning` renvoie encore `contentPlans`, ignoré par l'écran.
- Captures (build local, PostgreSQL 16 jetable, données factices, Umami simulé côté serveur pour la capture seulement) : `captures/admin-semaine-{375,1280}.png`, `captures/admin-abonnes-lettre-{375,1280}.png`, `captures/admin-abonnes-premium-{375,1280}.png`. Aucun débordement horizontal à 375 px, aucune erreur JavaScript.
