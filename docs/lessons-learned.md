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

## Session 05/05/2026

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | Cible propagation | Fichiers impactés | Statut | Propagation |
|---------|------|-----------|----------|-------------|---------------------|--------------------------|-------------------|-------------------|--------|-------------|
| 7 | 05/05/2026 | 2. Insistance utilisateur | **P0** | **Voix narrative compte=marque** : 9 posts générés v1 utilisaient "Ma coloc / Mon boss / Mon ex" — Thomas a flag avec emphase ("c'est un site !!!"). Confusion narrateur (compte) vs persona (lecteur). | Refonte brief social-media-agent.ts : règle absolue "compte = observateur stand-up qui interpelle le lecteur, pas qui se raconte" + 5 patterns valides (observation universelle, mise en scène impersonnelle, vanne citée, question rhétorique, statement provocateur) + G-S19 regex anti-`je/j'/moi/mon/ma/mes` hors guillemets | **Tout brief de génération social/copy DOIT spécifier la voix narrative en tête (compte=marque vs personne). Gate programmatique anti-1ère-personne obligatoire.** | agent-spécifique + gates | social-media-agent.ts (brief), standup-director-agent.ts (G-S19), CLAUDE.md section social | fait | propagé |
| 7 | 05/05/2026 | 1. Problème corrigé | P0 | Build Replit cassé : (a) apostrophes JSX `OnboardingFlow.tsx` non échappées (b) `eslint-disable @typescript-eslint/no-var-requires` plugin pas en devDep (c) `/blog` prerender CSR bailout (useSearchParams sans Suspense) | (a) `&apos;` lignes 99/113/177/200 ; (b) retrait nom rule (générique) ; (c) wrapper `<Suspense>` autour BlogListClient | **Patterns Next.js 14 obligatoires : escape JSX apostrophes FR + Suspense autour useSearchParams en SSG + eslint-disable rule présente en devDep.** | agent-spécifique + documentation | fullstack.md + CLAUDE.md section Next.js | fait | propagé |
| 7 | 05/05/2026 | 5. Pattern efficace | P0 | **Audit dual Director + @social /10 + itération jusqu'à 10/10 avant code** : 9 posts 12-18/20 → 20/20 en 2 cycles. ROI énorme (le code généré sans audit aurait reproduit les défauts). Coût ~277k tokens orchestrator. | Phase 1 itération qualité jusqu'au plateau, Phase 2 autopilote code dérivé du corpus final | **Pour toute refonte pipeline génération : audit dual sur 5-10 exemples canoniques + itération jusqu'à 10/10 (cap 5 cycles) AVANT d'écrire le brief. Pattern intégré framework.** | règle-globale | _base-agent-protocol.md + orchestrator.md + CLAUDE.md commandement n°5 | fait | non-propagé |
| 7 | 05/05/2026 | 4. Biais détecté | P1 | Subagents (orchestrator inclus) ne peuvent ni utiliser Bash ni faire git commit/push → friction systématique : caller (Claude Code main) commit + push après chaque retour. | Caller commit lui-même | **[FRAMEWORK GAP] Documenter limitation subagent dans `_base-agent-protocol.md`. Workaround : orchestrator produit fichiers, caller commit.** | documentation | _base-agent-protocol.md | fait | non-propagé |
| 7 | 05/05/2026 | 3. Requête non couverte | P1 | Pas de protocole prédéfini pour audit cron×quota API tierce + calendrier publication par réseau + veille technologique (OpenAI 2.0). | Audit ad-hoc livré dans `docs/social/audit-buffer-calendar-openai-s7.md` | **Créer 2 prompts récurrents : "Audit cron×quota API tierce" + "Veille tech LLM/IA stack courante". Stocker dans `templates/` Agent-Team.** | prompts | templates/ Agent-Team | à-faire | non-propagé |
| 7 | 05/05/2026 | 8. Préférence fondateur | **P0** | [PRÉFÉRENCE FONDATEUR] **Compte social = SITE/MARQUE, pas personne**. Refus catégorique 1ère personne hors citation. Twitter = single posts uniquement (pas de threads). LinkedIn = pas de ton corporate/coach/thought-leader. Itère jusqu'à 10/10 puis autopilote. Accepte risques business si plus rapide (IAP -30%). | G-S19 anti-1ère-personne + G-S15 anti-leçon LI + G-S17 anti-corporate + brief refondu + autopilote 2-phases adopté | **Pour projets B2C humour FR : compte=marque + Twitter single + LinkedIn anti-thought-leader = règles absolues. Pattern autopilote 2-phases (qualité gate utilisateur, exécution sans gate) à proposer par défaut.** | founder-prefs + agent-spécifique | docs/founder-preferences.md + social.md + CLAUDE.md | fait | propagé |

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

### Session 03/05/2026 [archivé session 7 fin — toutes entrées fait+propagé]

| Session | Date | Catégorie | Sévérité | Description (résumé) | Statut |
|---------|------|-----------|----------|----------------------|--------|
| 03/05 | 03/05/2026 | 1. Problème corrigé | P1 | CLAUDE.md doc disait "rel=shortcut icon fait" mais code ne l'avait pas (Bing) → ajout layout.tsx | fait+propagé |
| 03/05 | 03/05/2026 | 1. Problème corrigé | P1 | BUFFER_CHANNEL_INSTAGRAM marqué "optionnel" mais code throw → corrigé "REQUIS" | fait+propagé |
| 03/05 | 03/05/2026 | 5. Pattern efficace | P1 | Audit @ia AVANT @fullstack = excellent ROI cause racine | fait+propagé |
| 03/05 | 03/05/2026 | 4. Biais détecté | P1 | Orchestrateur a lancé 2e agent parallèle au lieu d'attendre SendMessage | fait+propagé |
| 03/05 | 03/05/2026 | 8. Préf fondateur | P0 | Quand fondateur valide plan, appliquer TOUT sans risque en une passe | fait+propagé |
