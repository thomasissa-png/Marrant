# Lessons Learned — Deviens-marrant.fr

## Session 01/04/2026

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | Statut | Propagation |
|---------|------|-----------|----------|-------------|---------------------|--------------------------|--------|-------------|
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | Doubles posts crons : instrumentation.ts dupliquait logique des crons HTTP | Jobs convertis en appels HTTP délégués (fetch localhost) | **Ne JAMAIS dupliquer logique métier entre instrumentation.ts et crons HTTP.** | appliqué | propagé (CLAUDE.md, fullstack.md) |
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | GCS signed URLs impossibles sur Replit (ADC sans private_key) | Supprimé @google-cloud/storage, route /api/social/stored-image | **Avant ajout dépendance cloud, vérifier que l'auth fonctionne sur Replit.** | appliqué | propagé (CLAUDE.md, infrastructure.md) |
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | IndexNow : fallback hardcodé différent de la clé env → rejet silencieux Bing | Supprimé fallbacks hardcodés, log body de réponse | **Zéro fallback hardcodé pour clés API/auth. FAIL explicite si absente.** | appliqué | propagé (CLAUDE.md) |
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | Middleware www :5904 — req.url contient port interne Replit. **1 semaine SEO perdue.** | URL canonique construite explicitement depuis hardcoded domaine | **Sur Replit, JAMAIS utiliser req.url pour URLs publiques.** Tester middleware via WebFetch immédiatement après déploiement. | appliqué | propagé (CLAUDE.md, infrastructure.md, fullstack.md) |
| 01/04 | 01/04/2026 | 8. Préférence fondateur | P0 | [PRÉFÉRENCE FONDATEUR] : Insistance fondateur = signal P0 absolu. **Voir L31 fusionné dans la session 07/04.** | Vérification live obligatoire | Voir règle fusionnée | fusionné dans L31 (07/04) | propagé (orchestrator.md) |

## Session 07/04/2026

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | Statut | Propagation |
|---------|------|-----------|----------|-------------|---------------------|--------------------------|--------|-------------|
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Daily-social compteur global : Twitter bloquait LinkedIn/Instagram. LinkedIn 0 post pendant 5j. | groupBy par plateforme + skip si TOUTES couvertes | **Toute idempotence multi-dimension DOIT grouper PAR cette dimension. Compteur global = bug en attente.** | appliqué | propagé (CLAUDE.md, fullstack.md) |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Buffer 429 retry loop infini + flood emails | Circuit breaker par plateforme (24h) | **Tout retry sur erreur tierce DOIT avoir un circuit breaker au niveau ressource.** | appliqué | propagé (CLAUDE.md, fullstack.md) |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Instagram URLs pointaient vers REPLIT_DEV_DOMAIN au lieu de prod | Hardcoder `https://deviens-marrant.fr` comme fallback ultime | **Sur Replit, NEXT_PUBLIC_SITE_URL pas toujours dispo runtime. Hardcoder domaine prod.** | appliqué | propagé (CLAUDE.md) |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Vannes sans punchline passaient validation IA seule. Score subjectif insuffisant. | 45 gates programmatiques binaires + architecture 2 niveaux | **Validation LLM seule insuffisante pour contraintes hard. Règles binaires = gates programmatiques.** | appliqué | propagé (standup-director-agent.ts, _gates.md) |
| 07/04 | 07/04/2026 | 2. Insistance utilisateur | **P0** (FUSIONNÉ — L31) | **Insistance du fondateur = signal P0 absolu** (fusion L31 + L50 + 01/04 préf fondateur). Quand Thomas insiste/challenge ("es-tu sûr ?", "1000% sûr ?", "amateurisme"), ne JAMAIS répondre "c'est corrigé" sans avoir : (1) vérifié EN LIVE maintenant, (2) revenir avec preuves factuelles, (3) admettre si diagnostic précédent incomplet. Pattern récurrent confirmé sur 3 sessions. | Vérification systématique en live AVANT toute affirmation | **[RÈGLE P0] Insistance fondateur = arrêt immédiat de toute affirmation, vérification live obligatoire dans la même réponse, admission honnête si erreur.** | propagé | propagé (orchestrator.md ligne ~202) |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P1 | Page /blog : searchParams dans props Server Component force render dynamique → annule revalidate | Filtre catégorie déplacé dans Client Component | **Next.js 14 App Router : searchParams dans Server Component = dynamic forcé. Lire dans Client Component pour ISR.** | appliqué | propagé (CLAUDE.md, fullstack.md) |
| 07/04 | 07/04/2026 | 8. Préférence fondateur | P0 | [PRÉFÉRENCE FONDATEUR] : Refus upgrade payant tant que code peut tenir plan gratuit | — | **Avant suggérer upgrade payant, vérifier 3 fois que code respecte limites plan gratuit. Bug presque toujours dans code.** | appliqué | propagé (CLAUDE.md, infrastructure.md) |

## Session 08/04/2026

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | Statut | Propagation |
|---------|------|-----------|----------|-------------|---------------------|--------------------------|--------|-------------|
| 08/04 | 08/04/2026 | 1. Problème corrigé | P0 | Daily-social scheduler 96x/j sans time gate → 21-30 posts/j accumulés | Time gate utcHour + catch-up conditionnel + filtre quantitatif | **Scheduler interne polling DOIT avoir time gate horaire. Filtre quantitatif (manque N) > binaire.** | appliqué | propagé (CLAUDE.md, fullstack.md, _gates.md) |
| 08/04 | 08/04/2026 | 1. Problème corrigé | P0 | LinkedIn publié 5j/sem dans code vs 3j/sem dans JSON plan. Désync silencieuse. | Helper linkedInOrFallback + alignement code/JSON/quotas | **Toute divergence entre plan éditorial JSON et code DOIT être détectée par test de conformité.** | ouvert | non-propagé |
| 08/04 | 08/04/2026 | 2. Insistance utilisateur | **P0** (FUSIONNÉ — L70) | **Avant tout diagnostic "le code est correct, c'est ton outil qui ment", VÉRIFIER `git show master:file` vs `git show HEAD:file`** (fusion L70 + L74). Replit deployait branche master avec code 2 semaines vieux. 5 itérations perdues à blamer Replit alors que branche feature jamais mergée. **Le pire bug de la session.** | Diagnostic git show master vs HEAD au PREMIER signalement de discrepancy | **[RÈGLE P0] Au premier signalement "le fix ne marche pas", SEULE première action : `git show master:path` vs `git show HEAD:path`. Si diff = problème de merge/deploy, pas de code. Ne jamais accuser l'outil avant ce check.** | propagé | propagé (orchestrator.md ligne ~202) |
| 08/04 | 08/04/2026 | 7. Performance IA | P1 | Race condition intra-heure : run 4h00 dépasse 15 min → run 4h15 voit DB vide → duplique | Mitigation rapide (génération <15 min). Lock applicatif à ajouter. | **Tout handler async long (>10s) avec scheduler récurrent DOIT avoir verrou applicatif (advisory lock Postgres ou table processing_lock PK unique).** | ouvert | non-propagé |
| 08/04 | 08/04/2026 | 7. Performance IA | P1 | Neon DB cold start → Prisma timeout sporadique (plan gratuit suspend après 5 min inactivité) | Pool Prisma 15/30s. Retry/keep-alive recommandé. | **Pour Replit + Neon free : retry Prisma sur erreur connexion (3 tentatives, 5s) ou cron keep-alive 4 min.** | ouvert | non-propagé |

## Session 03/05/2026

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | Statut | Propagation |
|---------|------|-----------|----------|-------------|---------------------|--------------------------|--------|-------------|
| 03/05 | 03/05/2026 | 1. Problème corrigé | P1 | CLAUDE.md documentait `rel="shortcut icon"` comme fait (audit 16/03) mais code ne l'avait pas. Bing ne détectait pas favicon. | Ajout shortcut dans layout.tsx | **Après chaque audit qui documente un fix dans CLAUDE.md, vérifier par grep que fix est bien dans le code. Ne JAMAIS faire confiance à doc seule.** | fait | propagé |
| 03/05 | 03/05/2026 | 1. Problème corrigé | P1 | BUFFER_CHANNEL_INSTAGRAM marqué "optionnel" mais code throw si absent | Corrigé "optionnel" → "REQUIS" | **Tout secret dont absence provoque throw/échec silencieux DOIT être marqué REQUIS dans documentation.** | fait | propagé |
| 03/05 | 03/05/2026 | 5. Pattern efficace | P1 | Audit @ia AVANT implémentation @fullstack = excellent ROI (cause racine identifiée) | — | **Pour tout problème coût/perf, audit @ia d'abord pour cause racine, PUIS briefer @fullstack avec plan priorisé.** | fait | propagé |
| 03/05 | 03/05/2026 | 4. Biais détecté | P1 | Orchestrateur a lancé 2e agent @ia parallèle au lieu d'attendre. Risque conflit fichier. | — | **Avant lancer renfort vers agent background, vérifier SendMessage dispo. Si non, attendre. Jamais relancer agent parallèle sur mêmes fichiers.** | fait | propagé |
| 03/05 | 03/05/2026 | 8. Préférence fondateur | P0 | [PRÉFÉRENCE FONDATEUR] : Quand fondateur valide plan, appliquer TOUT ce qui est sans risque en une passe. Pas de phasing inutile. | Actions 1-6 lancées en une session | **Quand fondateur valide plan optimisation, appliquer TOUT sans risque en une passe. Ne pas proposer phasing si risque = 0.** | fait | propagé |

---

## Archive

> Learnings archivés via TTL (>5 sessions OU statut appliqué+propagé). Voir git history pour le détail original.

### Session 26/03/2026 [archivé session 7]

| Session | Date | Catégorie | Sévérité | Description (résumé) | Statut |
|---------|------|-----------|----------|----------------------|--------|
| 26/03 | 26/03/2026 | 1. Problème corrigé | P0 | Posts sociaux publiés en rafale → rate-limiter 1 post/plateforme/run | appliqué |
| 26/03 | 26/03/2026 | 1. Problème corrigé | P0 | Buffer API 400 "subprofile not defined" → metadata.instagram.type enum | appliqué |
| 26/03 | 26/03/2026 | 1. Problème corrigé | P0 | instrumentation.ts pas synchronisé avec cron HTTP (pré-gen images, approvedBy) | appliqué |
| 26/03 | 26/03/2026 | 1. Problème corrigé | P1 | Persona leak threadParts non détecté → inclusion dans allText + tests | appliqué |
| 26/03 | 26/03/2026 | 1. Problème corrigé | P1 | Build Replit : ignoreBuildErrors + scoped packages externals callback | appliqué |
| 26/03 | 26/03/2026 | 2. Insistance utilisateur | P1 | Director doit valider TOUS articles, même statiques | appliqué |
| 26/03 | 26/03/2026 | 2. Insistance utilisateur | P1 | Diagnostic complet proactif quand fondateur questionne pipeline | appliqué |
| 26/03 | 26/03/2026 | 7. Performance IA | P1 | @reviewer Opus crash 500 → fallback validation manuelle | appliqué |
| 26/03 | 26/03/2026 | 8. Préférence fondateur | P1 | Validation Director pour TOUT contenu, qualité prime sur vélocité | appliqué |
| 26/03 | 26/03/2026 | 8. Préférence fondateur | P1 | Penser "est-ce cohérent côté utilisateur final ?" pas juste "code tourne ?" | appliqué |

### Fusions P0 (archivés session 7)

| Session | Date | Sévérité | Description (résumé) | Fusionné dans |
|---------|------|----------|----------------------|---------------|
| 01/04 | 01/04/2026 | P0 | Insistance fondateur = signal P0 absolu (préf fondateur initial) | L31 (07/04) — règle "Insistance du fondateur" |
| 08/04 | 08/04/2026 | P0 | [PRÉFÉRENCE FONDATEUR] vérifier branche déployée avant accuser outil | L70 (08/04) — règle "git show master vs HEAD" |
