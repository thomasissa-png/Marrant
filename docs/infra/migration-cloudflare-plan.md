# Migration Marrant : Replit → Cloudflare Workers + Neon (plan validé le 29/09/2026)

> Remplace `docs/migrations/marrant-migration.md` du repo Agent-Team (mai 2026, écrit à l'aveugle, adaptateur `next-on-pages` obsolète).

## Décisions fondateur (29/09/2026)
- **Pas de redéploiement sur Replit** : la prod actuelle reste telle quelle jusqu'à la bascule ; tout le travail s11 (branche `claude/marrant-s10-session-recovery-CtZyw`) part en ligne avec Cloudflare.
- **Le nom de domaine ne change pas** (deviens-marrant.fr, toutes les URL identiques). Seul change l'endroit où il pointe.
- **Base : Neon (région UE, Francfort) + Cloudflare Hyperdrive.** D1 écarté (SQLite = réécriture du schéma et du code Postgres).
- État de départ : base = PostgreSQL intégré de Replit ; domaine enregistré chez **IONOS** ; rien sur Cloudflare.

## Ce que le code impose (vérifié en s11)
- Planificateur interne (`src/instrumentation.ts`, ~12 jobs, self-fetch `127.0.0.1`) et tâches de démarrage (`src/lib/startup-tasks.ts`, dont `applyCatalogueContentTask` qui applique la refonte du catalogue) : Workers n'a ni processus permanent ni boot → Cron Triggers qui appellent les routes existantes `/api/cron/*` (+ une route idempotente pour les tâches de démarrage, marqueurs `DataPatch`).
- Prisma 6 → adaptateur Neon/Hyperdrive compatible Workers. Next 14.2.35 → OpenNext Cloudflare (`@opennextjs/cloudflare`), `nodejs_compat`, cache ISR sur R2.
- Le seed reste bloqué en prod (garde-fou) : le contenu passe par les tâches de démarrage.
- Offre Workers payante nécessaire (taille du bundle, CPU des crons).

## Pas à pas
**A. Thomas (≈ 45 min)** : compte Cloudflare + offre Workers payante ; compte Neon, projet en région UE ; dans les réglages de l'environnement Claude (variables d'environnement, jamais dans le chat) : `CLOUDFLARE_API_TOKEN` (droits Workers, R2, Hyperdrive, DNS de la zone), `CLOUDFLARE_ACCOUNT_ID`, `REPLIT_DATABASE_URL` (copie du `DATABASE_URL` Replit), `NEON_DATABASE_URL` ; export (capture) de la liste des enregistrements DNS dans IONOS.
**B. Claude, nouvelle session (le site en ligne n'est pas touché)** : adaptation du code ; copie Replit → Neon avec contrôle des comptes par table ; déploiement sur une adresse `*.workers.dev` branchée sur une branche Neon (copie de prod) ; tests : crawl des 462 pages, inscription/connexion, parcours, paiement Stripe en mode test, exécution de chaque cron, logs des tâches de démarrage (~250 vannes mises à jour).
**C. DNS sans changement visible** : ajout de la zone deviens-marrant.fr sur Cloudflare (import auto des enregistrements) → Claude compare avec l'export IONOS, en particulier MX, SPF/DKIM/DMARC (Resend, boîte mail), vérifications Google/Replit → désactiver DNSSEC chez IONOS s'il est actif → remplacer les 2 serveurs DNS chez IONOS par ceux de Cloudflare. Le site pointe toujours vers Replit : aucun visiteur ne voit de différence. Propagation : quelques heures à 48 h.
**D. Bascule (GO de Thomas, soirée calme)** : dernière copie Replit → Neon, puis le domaine pointe vers le Worker ; contrôle immédiat (crawl, connexion, email, paiement). Retour arrière = repointer vers Replit (minutes).
**E. Après 30 jours sans incident** : arrêt de Replit.
