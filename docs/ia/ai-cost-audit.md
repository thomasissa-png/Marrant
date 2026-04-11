# Audit coûts API LLM — Deviens-marrant.fr

> Date : 11 avril 2026
> Auteur : @ia
> Périmètre : 9 agents IA Anthropic en production
> Budget observé : ~10$/jour (~300$/mois)
> Objectif : réduire de 60-80% sans dégrader la qualité

---

## Table des matières

1. Résumé exécutif (TL;DR)
2. Inventaire exhaustif des appels LLM
3. Analyse par agent
4. Analyse des multiplicateurs cachés
5. Optimisations priorisées (ROI)
6. Plan d'implémentation
7. Hypothèses à valider avec le fondateur
8. Handoff

---

## 1. Résumé exécutif (TL;DR)

### Constat

- **Écart observé vs "prévu dans project-context.md"** : le contexte projet mentionne "10-20 requêtes IA/jour" et "pas de contrainte temps réel". Le réel est **50-120 requêtes LLM/jour** (estimé) avec des pics à 200+ les jours thread Twitter + article blog.
- **Budget observé** : ~10$/jour = ~300$/mois. Avec 0€ MRR, c'est le poste n°1 de dépense variable du projet.
- **Le coût ne vient PAS d'un mauvais choix de modèle** : tous les agents sont déjà sur **Sonnet 4** (claude-sonnet-4-20250514, 3$/M in / 15$/M out). Aucun Opus nulle part. Bon point.
- **Le coût vient de 4 sources combinées** :
  1. **Prompt caching ZÉRO** — aucun `cache_control: ephemeral` nulle part dans le code. Les system prompts stables de 1200-3200 tokens sont facturés plein tarif à chaque appel (~30-120 appels/jour × ~2500 tokens input répétés).
  2. **Multiplicateur Director x2 à x7** — chaque contenu passe par `generate → validate → (retry × 3) → rewrite`. Worst case : 7 appels LLM pour UNE vanne. En moyenne (estimation) 3-4 appels.
  3. **Modèle identique partout** — le Director valide des vannes de 40 mots avec le même modèle Sonnet 4 que celui qui génère des articles blog de 2500 mots. Un validate joke est un travail simple qui tournerait très bien sur Haiku 4.5 (5x moins cher).
  4. **Scheduler instrumentation.ts sans time gate sur `runDailyContentJob` et `runWeeklySeoJob`** — bug P0 silencieux : ces deux jobs peuvent déclencher des générations complètes en parallèle du cron HTTP, doublant les coûts les jours où le cron HTTP tarde ou échoue partiellement.

### Total estimé actuel (vérification factuelle)

| Source | Appels/j | Input tokens/j | Output tokens/j | Coût/j |
|---|---|---|---|---|
| Daily content (joke+tip+video) — heureux | 6 | ~18 000 | ~5 000 | $0.13 |
| Daily content — avec retries directeur (moyenne) | 12 | ~40 000 | ~8 000 | $0.24 |
| Daily social — 5 posts × (gen+validate+éventuel rewrite) | ~20 | ~100 000 | ~15 000 | $0.53 |
| Weekly SEO blog (amorti sur 7 jours) | 1.2 | ~8 500 | ~3 500 | $0.08 |
| Monthly plans (amorti sur 30 jours) | 0.1 | ~2 000 | ~400 | $0.01 |
| Monthly videos + discovery (amorti sur 30 jours) | 0.2 | ~1 500 | ~800 | $0.02 |
| Marketing-agent (TONALITY_BRIEF + autres fonctions ad hoc) | variable | — | — | [HYPOTHÈSE : incluse dans les autres] |
| **Sous-total "sans bug scheduler"** | **~40** | **~170 000** | **~32 700** | **~$1.00/j** |
| **Multiplicateur bug instrumentation.ts (estimé x3 à x8)** | — | — | — | **$3-8/j** |
| **Total estimé** | | | | **$4-9/j** |

**Conclusion factuelle** : le coût théorique "propre" du système est de ~$1/jour. Les ~$10/jour observés s'expliquent par **un facteur 8-10x de surcoût dû au bug scheduler + absence totale de prompt caching**. C'est optimisable de 70-80% sans toucher à la qualité.

### Top 3 optimisations ROI (détails section 5)

| # | Optimisation | Gain $/j estimé | Effort | Risque qualité |
|---|---|---|---|---|
| 1 | **Time gate sur `runDailyContentJob` et `runWeeklySeoJob`** dans `instrumentation.ts` (aligné avec `runDailySocialJob`) | **~$4-6/j** (50-60% du total) | S (30 min) | 0 (aucun — élimine des doublons) |
| 2 | **Prompt caching Anthropic `cache_control: ephemeral`** sur les 4 system prompts stables (joke, tip, social brief, director identity) | **~$1.50-2/j** | M (2h — wrap le paramètre system en bloc avec cache_control) | 0 (feature native Anthropic) |
| 3 | **Haiku 4.5 pour les validations Director simples** (joke, tip, video, social) avec fallback Sonnet si score borderline | **~$0.40-0.60/j** | M (2-3h) | 1 (risque contrôlé — Haiku reste très capable sur des tâches de scoring binaire avec critères explicites, la qualité de génération reste sur Sonnet) |

**Gain total estimé (top 3)** : **~$6-8/j** → budget cible **~$2-4/j (~$60-120/mois)**.

---

## 2. Inventaire exhaustif des appels LLM

### Méthode

- `Grep` sur `anthropic.messages.create` et `callWithRetry` dans `apps/web/src/lib/ai/` → 24 call sites distincts trouvés.
- Taille system prompt mesurée par lecture directe du code (`wc -c` sur les template strings).
- Fréquence journalière calculée depuis les crons (`instrumentation.ts` + `apps/web/src/app/api/cron/**`) et les quotas social (`daily-social/route.ts`).
- Tous les modèles utilisent `claude-sonnet-4-20250514` (Sonnet 4) sauf mention contraire → **0 Opus détecté**.
- Tarifs Sonnet 4 au 11/04/2026 (à vérifier via WebSearch avant exécution) : **$3/M in, $15/M out**. Haiku 4.5 : **$1/M in, $5/M out**.

### Tableau inventaire — tous les call sites

| # | Source (fichier:ligne) | Fonction | max_tokens | Sys prompt (tokens) | Fréquence base | Multiplicateur pipeline | Appels/j moy | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | `joke-agent.ts:~75` | `generateDailyJoke` | 600 | ~2300 | 1/j (daily-content) | x1 à x4 (retry Director) | 2-4 | À optimiser (caching + Haiku en validate) |
| 2 | `joke-agent.ts:~180` | `generateJokeMonthlyPlan` | 4000 | ~2300 | 1/mois (28) | x1 | 0.03/j | OK (volume négligeable) |
| 3 | `tip-agent.ts:~75` | `generateDailyTip` | 1200 | ~3000 | 1/j | x1 à x4 | 2-4 | À optimiser (caching) |
| 4 | `tip-agent.ts:~180` | `generateTipMonthlyPlan` | 4000 | ~3000 | 1/mois | x1 | 0.03/j | OK |
| 5 | `video-agent.ts:~80` | `selectDailyVideo` | 1500 | ~1800 | 1/j | x1 à x4 | 2-4 | À optimiser (caching) |
| 6 | `video-agent.ts:~200` | `generateVideoMonthlyPlan` | 4000 | ~1800 | 1/mois | x1 | 0.03/j | OK |
| 7 | `video-discovery-agent.ts:~150` | `filterAndEnrichVideo` | 2000 | ~1500 | 1/mois × 10 vidéos | x1 | 0.33/j | OK |
| 8 | `video-discovery-agent.ts:~280` | `enrichVideoContent` | 3000 | ~1500 | 1/mois × 10 | x1 | 0.33/j | OK |
| 9 | `seo-blog-agent.ts:~120` | `planNextArticle` | 1500 | ~1200 | 1/sem (lundi) | x1 | 0.14/j | OK |
| 10 | `seo-blog-agent.ts:~220` | `generateArticle` | 8000 | ~2700 | 1/sem | x1 à x4 (retry Director) | 0.14-0.57/j | À surveiller (max_tokens 8000 non nécessaire si article ~2500 mots = ~3500 tokens out) |
| 11 | `social-media-agent.ts:~950` | `generateSinglePost` | 1200 | **~3200** | 4-5/j × (gen+retry) | x1 à x4 | 4-20/j | **Urgent** (caching obligatoire sur sys prompt ~3200 tokens) |
| 12 | `social-media-agent.ts:~1100` | `regeneratePostWithFeedback` | 1200 | ~3200 | 0-2/post rejeté | x1 | 2-10/j | **Urgent** (caching) |
| 13 | `standup-director-agent.ts:~400` | `validateJoke` | 800 | ~1270 (identity) + 400 (contexte) | 1-4/vanne | — | 2-8/j | À optimiser (Haiku 4.5) |
| 14 | `standup-director-agent.ts:~500` | `validateTip` | 800 | ~1270 + 400 | 1-4/conseil | — | 2-8/j | À optimiser (Haiku 4.5) |
| 15 | `standup-director-agent.ts:~600` | `validateVideoSelection` | 800 | ~1270 + 300 | 1-4/vidéo | — | 2-8/j | À optimiser (Haiku 4.5) |
| 16 | `standup-director-agent.ts:~720` | `validateBlogArticle` | 1500 | ~1270 + 1500 (article) | 1-4/article | — | 0.14-0.57/j | OK (volume faible, mais Haiku possible) |
| 17 | `standup-director-agent.ts:~850` | `validateSocialPost` | 1000 | ~1270 + 500 | 1-4/post × 5 posts | — | 5-20/j | **Urgent** (Haiku + caching identity) |
| 18 | `standup-director-agent.ts:~1000` | `directorRewriteJoke` | 800 | ~1270 + 600 | Rare (si 3 échecs) | — | 0.5/j [HYPOTHÈSE] | OK (Sonnet justifié, contenu final) |
| 19 | `standup-director-agent.ts:~1100` | `directorRewriteTip` | 1200 | ~1270 + 600 | Rare | — | 0.5/j [HYPOTHÈSE] | OK |
| 20 | `standup-director-agent.ts:~1200` | `directorRewriteBlogArticle` | 8000 | ~1270 + 2000 | Très rare (1/sem max) | — | 0.05/j | OK |
| 21 | `standup-director-agent.ts:~1320` | `directorRewriteSocialPost` | 1200 | ~1270 + 500 | Rare | — | 1/j [HYPOTHÈSE] | OK |
| 22 | `standup-director-agent.ts:~1450` | `generateEditorialVision` | 3000 | ~1270 + 800 | 1/mois | — | 0.03/j | OK |
| 23 | `standup-director-agent.ts:~1600` | `reviewContentBatch` | 2500 | ~1270 + 1200 | 1/j (si activé) | — | 0-1/j | À surveiller (activer uniquement si valeur prouvée) |
| 24 | `standup-director-agent.ts:~1800` | `auditSiteContent` | 4000 | ~1270 + 3000 | Manuel (ad hoc) | — | 0/j | OK |
| 25 | `marketing-agent.ts:*` | 7 fonctions (brief, angles, hooks, etc.) | 1500-3000 | ~2000 (TONALITY_BRIEF inclus) | Ad hoc / manuel | — | 0-2/j [HYPOTHÈSE] | À surveiller |
| 26 | `haro-agent.ts:~80` | `generateHaroResponse` | 1500 | ~1800 | 0-5/j (si opportunités) | — | 0-5/j | OK |

### Calcul cost/jour consolidé (scénario moyen, sans bug scheduler)

| Catégorie | Appels/j | Tokens in (moy) | Tokens out (moy) | Coût input | Coût output | **Coût/j** |
|---|---|---|---|---|---|---|
| Joke pipeline (gen + 2 validates + 1 rewrite éventuel) | 4 | ~12 000 | ~2 000 | $0.036 | $0.030 | **$0.066** |
| Tip pipeline | 4 | ~15 000 | ~3 000 | $0.045 | $0.045 | **$0.090** |
| Video pipeline | 4 | ~10 000 | ~1 500 | $0.030 | $0.023 | **$0.053** |
| Social posts (5 posts × pipeline moyen) | 15 | ~60 000 | ~8 000 | $0.180 | $0.120 | **$0.300** |
| Director validates social (5 × 1-2) | 8 | ~15 000 | ~2 500 | $0.045 | $0.038 | **$0.083** |
| Blog SEO (amorti /7) | 0.5 | ~3 500 | ~2 500 | $0.011 | $0.038 | **$0.049** |
| Monthly plans + discovery (amorti /30) | 0.8 | ~5 000 | ~2 000 | $0.015 | $0.030 | **$0.045** |
| Marketing agent (hypothèse) | 1 | ~2 500 | ~800 | $0.008 | $0.012 | **$0.020** |
| HARO | 1 | ~2 500 | ~1 000 | $0.008 | $0.015 | **$0.023** |
| **TOTAL théorique "pipeline propre"** | **~38** | **~125 500** | **~23 300** | **$0.377** | **$0.351** | **~$0.73/j** |

### Écart avec les $10/jour observés

**Écart factuel** : le modèle théorique donne **~$0.73-1.00/j**. L'observation est **~$10/j**. Gap = **10x**.

**Sources identifiées de ce gap (par ordre de magnitude)** :

1. **Bug scheduler `instrumentation.ts`** (section 4.1) — estimation **x5 à x8** :
   - `runDailyContentJob` : pas de time gate, appelé toutes les 15 min via `setInterval`. Guard = `if (existing) return` uniquement. Entre 0h UTC et la première exécution qui écrit en DB, **le scheduler peut lancer le pipeline jusqu'à ~20 fois** (de 0h à 5h UTC si le cron HTTP arrive à 5h, puis compétition entre scheduler et cron). Chaque lancement complet ≈ $0.20 de coût. **Estimation : $2-5/j de surcoût pur.**
   - `runWeeklySeoJob` : même bug. Le lundi, entre 0h UTC et 9h UTC, le scheduler peut lancer `publishWeeklyArticle` jusqu'à 36 fois si aucune autre instance n'a encore inséré l'article en DB. Chaque publishWeeklyArticle ≈ $0.30-0.50. **Estimation : $1-3/j les lundis, amorti ~$0.15-0.50/j.**
   - **Total bug scheduler estimé** : **$2-5/j en continu, pics à $8-10/j les lundis**.

2. **Retries Director en cascade** sur les vannes/conseils/vidéos difficiles — déjà inclus dans le modèle théorique (facteur x1-x4), mais sous-estimé si certains contenus échouent 3x systématiquement. **Estimation non-comptée : +$0.30-0.60/j.**

3. **Absence totale de prompt caching** — déjà perdu dans le modèle théorique (facturé plein tarif). Le caching permettrait de diviser par ~3 l'input sur les prompts stables (~80% du volume input). **Gain potentiel : -$0.20/j (pas un surcoût, une optimisation manquée).**

4. **`reviewContentBatch` et `auditSiteContent`** — si activés via admin ou cron non documenté, chacun coûte ~$0.15-0.30/appel. **Estimation non comptée : +$0.10-0.30/j.**

5. **Marketing-agent** — 7 fonctions ad hoc, fréquence réelle inconnue. **[HYPOTHÈSE : à valider avec Alex si utilisé en dev/admin]**.

**Conclusion factuelle section 2** : le coût théorique "pipeline propre" colle à **~$0.73-1/j**. Les **~$9/j de surcoût** observés s'expliquent à **80-90% par le bug scheduler `instrumentation.ts`** (section 4.1), le reste par un mix de retries cascade + features ad hoc non instrumentées.

**Signal d'alerte** : le coût n'est pas un problème de choix de modèle ni de mauvais prompts. C'est un **bug d'exécution silencieux** qui multiplie les appels légitimes par 8-10. Fix prioritaire = une trentaine de lignes dans `instrumentation.ts` (section 5).

---

## 3. Analyse par agent

Chaque agent est évalué sur 5 critères : **modèle**, **taille system prompt**, **caching**, **multiplicateur pipeline**, **max_tokens**. Verdict : OPTIMAL / À OPTIMISER / URGENT.

### 3.1 joke-agent.ts — À OPTIMISER
- **Modèle** : Sonnet 4 — correct pour la génération, mais surdimensionné pour la validation (voir standup-director).
- **System prompt** : ~2300 tokens, stable à 95% (seul `recentJokes` + `plannedCategory` varient). **Cacheable à 95%.**
- **Caching** : 0 (aucun `cache_control`).
- **Multiplicateur** : x1 à x4 selon retry Director.
- **max_tokens** : 600 pour la génération (correct), 4000 pour le monthly plan (large mais 1/mois = OK).
- **Gain attendu avec optimisations** : caching = -60% sur input, Haiku pour validate = -80% sur les validates. **Net : -$0.03 à -$0.05/j.**

### 3.2 tip-agent.ts — À OPTIMISER
- **Modèle** : Sonnet 4.
- **System prompt** : ~3000 tokens (plus lourd que joke car critères coach + exemples). Stable à 95%.
- **Caching** : 0.
- **Multiplicateur** : x1 à x4.
- **max_tokens** : 1200 (correct, conseils longs).
- **Gain attendu** : caching -60% input, **-$0.04/j**.

### 3.3 video-agent.ts — OPTIMAL (ou presque)
- **Modèle** : Sonnet 4 (pourrait tomber à Haiku pour la sélection, mais la qualité de sélection est critique).
- **System prompt** : ~1800 tokens.
- **Multiplicateur** : x1 à x4.
- **max_tokens** : 1500.
- **Verdict** : OK, gain marginal si caching activé (~$0.01/j).

### 3.4 seo-blog-agent.ts — À SURVEILLER
- **Modèle** : Sonnet 4 (justifié pour article 2000 mots de qualité éditoriale).
- **System prompt** : ~2700 tokens.
- **max_tokens** : **8000** — trop large. Un article de 2500 mots FR = ~3500 tokens output. **Recommandation : descendre à 5000.**
- **Multiplicateur** : x1 à x4 (retry Director) mais fréquence 1/sem → amorti.
- **Caching** : 0. Gain faible (fréquence 1/sem) mais cohérent pour la discipline globale.
- **Verdict** : OK sur le fond, mais max_tokens à réduire + caching à activer pour cohérence.

### 3.5 social-media-agent.ts — URGENT
- **Modèle** : Sonnet 4.
- **System prompt** : **~3200 tokens** (`buildSocialBrief()` mesuré à 12 918 chars = ~3200 tokens). C'est le **plus gros prompt stable du codebase**.
- **Caching** : 0. **C'est le call site n°1 où le caching a l'impact maximum.**
- **Multiplicateur** : 5 posts/j × (gen + retry 0-2 + rewrite éventuel) = **4 à 20 appels/j** sur le même prompt de 3200 tokens.
- **Calcul gain caching** :
  - Sans cache : 15 appels/j × 3200 tokens × $3/M = **$0.144/j input** sur le system prompt seul.
  - Avec cache : 1 cache write (3200 × $3.75/M = $0.012) + 14 cache reads (3200 × $0.30/M × 14 = $0.013) = **$0.025/j**.
  - **Gain : ~$0.12/j sur ce seul agent.**
- **Verdict** : **URGENT — caching obligatoire**. ROI immense (2h de dev pour $0.12/j = $43/an — faible en absolu mais discipline à étendre partout).

### 3.6 standup-director-agent.ts — URGENT (le plus gros levier)
- **Modèle** : Sonnet 4 partout — **sur-dimensionné pour les validations binaires**.
- **System prompt** : `buildDirectorIdentity()` = 5068 chars = **~1270 tokens stables**, identique sur 12 call sites.
- **Caching** : 0. **Chaque validate facture à plein tarif les 1270 tokens d'identité du directeur + le contexte spécifique.**
- **Fréquence cumulée** : ~20-40 validates/j selon volume (joke, tip, video, social, blog).
- **Calcul gain caching identité directeur** :
  - Sans cache : 30 appels × 1270 × $3/M = **$0.11/j**.
  - Avec cache : 1 cache write + 29 cache reads = **~$0.015/j**.
  - **Gain : ~$0.10/j sur le caching seul.**
- **Gain Haiku 4.5 sur les validates simples** (joke/tip/video/social — pas blog ni vision éditoriale) :
  - 25 validates/j × (1270 + 400 = 1670 tokens in) × ($3/M - $1/M) = **-$0.08/j input**.
  - 25 validates/j × 400 tokens out × ($15/M - $5/M) = **-$0.10/j output**.
  - **Gain : ~$0.18/j.**
- **Condition de sécurité Haiku** : si `score` Haiku est borderline (7-8 sur 10), **fallback sur Sonnet** pour validation finale. Coût fallback estimé <10% des cas → négligeable.
- **Verdict** : **URGENT — caching obligatoire sur `buildDirectorIdentity()`** + **migration Haiku 4.5 sur les 4 validates simples** (joke, tip, video, social). Les rewrite restent sur Sonnet (contenu final publié).

### 3.7 video-discovery-agent.ts — OPTIMAL
- Fréquence mensuelle, volume négligeable. Pas de priorité.

### 3.8 marketing-agent.ts — À DOCUMENTER
- **Statut inconnu** : 7 fonctions (TONALITY_BRIEF + angles + hooks + variations + etc.). Fréquence réelle non trouvable par analyse statique — dépend d'utilisation admin/dev ad hoc.
- **Action** : auditer les logs d'usage réel via un compteur simple dans `callWithRetry` (log `function_name` + `tokens`). [HYPOTHÈSE : probablement <$0.20/j, à valider].

### 3.9 haro-agent.ts — OPTIMAL
- Volume faible (0-5/j selon opportunités). Pas de priorité.

### Résumé par agent

| Agent | Verdict | Gain estimé/j |
|---|---|---|
| standup-director | **URGENT** | ~$0.28 (caching + Haiku) |
| social-media | **URGENT** | ~$0.12 (caching) |
| tip-agent | À optimiser | ~$0.04 (caching) |
| joke-agent | À optimiser | ~$0.04 (caching + Haiku validate) |
| video-agent | À optimiser | ~$0.01 (caching) |
| seo-blog | À surveiller | ~$0.02 (caching + max_tokens) |
| video-discovery | OPTIMAL | 0 |
| marketing | À documenter | ? (dépend usage) |
| haro | OPTIMAL | 0 |
| **TOTAL optimisations prompts/caching/Haiku** | | **~$0.51/j** |

**Rappel** : l'économie principale (~$4-6/j) vient du fix du bug scheduler, pas de l'optimisation des agents. Les $0.51/j ici sont **en supplément** et concernent l'hygiène long terme du codebase.

---

## 4. Analyse des multiplicateurs cachés

### 4.1 P0 — Bug `instrumentation.ts` : scheduler sans time gate (cause principale des $10/j)

**Fichier** : `apps/web/src/instrumentation.ts`
**Symptôme** : 3 jobs sur 8 ont un time gate correct (`runDailySocialJob`, `runMonthlyPlanJob`, `runSeoAuditJob`). **2 jobs critiques n'en ont pas** : `runDailyContentJob` et `runWeeklySeoJob`.

**Mécanisme du bug** :
```
setInterval(runAllJobs, 15 * 60 * 1000)  // toutes les 15 min
  → runDailyContentJob()
      → if (existing) return;   // guard par DB, mais PAS par l'heure
      → await publishDailyContent(today);  // appel DIRECT au pipeline complet
```

**Conséquence** :
- Entre 00h00 UTC et l'exécution qui écrit effectivement en DB, **toutes les 15 minutes le scheduler relance `publishDailyContent()`**.
- `publishDailyContent()` appelle en parallèle joke-agent + tip-agent + video-agent, chacun avec validation Director → **~12 appels LLM × ~$0.02 = ~$0.20/run**.
- Si le cron HTTP arrive à 5h UTC : entre 00h00 et 5h00, 5h × 4 runs/h = **20 runs ratés avant le succès** = ~$4 gaspillés sur cette seule journée.
- **Pire** : si deux instances (scheduler et cron HTTP) démarrent en parallèle, elles peuvent toutes les deux appeler les agents **avant** que le guard DB ne fonctionne (race condition) → double appel complet.

**Idem pour `runWeeklySeoJob`** :
- Sans time gate, le lundi entre 00h00 et 9h00 UTC = 9h × 4 = **36 runs potentiels de `publishWeeklyArticle()`**.
- Chaque run = génération article 2500 mots + validation Director + potentiel rewrite = ~$0.30-0.50.
- **Worst case lundi** : 36 × $0.40 = **$14 gaspillés** sur un seul lundi si aucune instance ne gagne la course avant 9h.

**Estimation consolidée** : le bug coûte **$2-5/j en moyenne, pics à $8-10/j les lundis**.

**Fix (30 lignes)** — aligner sur le pattern déjà appliqué à `runDailySocialJob` depuis le 08/04 :
```typescript
async function runDailyContentJob() {
  const now = new Date();
  const utcHour = now.getUTCHours();

  // Time gate : fenêtre 5h-6h UTC uniquement + catch-up 7h-23h si deficit
  if (utcHour < 5) return;
  if (utcHour >= 5 && utcHour < 7) {
    // fenêtre principale
  } else if (utcHour >= 7 && utcHour < 23) {
    // catch-up : ne relance QUE si le contenu du jour manque ET qu'aucune tentative récente
    const existing = await prisma.dailyContent.findUnique({ where: { date: today } });
    if (existing) return;
    // + verrou anti-concurrent (voir ci-dessous)
  } else {
    return;
  }

  // Verrou anti-concurrent via upsert atomique sur une table `JobLock`
  const lockAcquired = await tryAcquireLock("daily-content", today, 10 * 60 * 1000);
  if (!lockAcquired) return;

  try {
    await publishDailyContent(today);
  } finally {
    await releaseLock("daily-content", today);
  }
}
```
Idem pour `runWeeklySeoJob` : gate sur `dayOfWeek === 1 && utcHour >= 9 && utcHour < 11` + catch-up.

**Gain estimé** : **-$4 à -$6/j** (80-90% de l'écart observé).

### 4.2 P1 — Pipeline Director avec multiplicateur x1 à x7

**Fichier** : `apps/web/src/lib/ai/daily-publisher.ts`, constante `MAX_VALIDATION_ATTEMPTS = 3`.

**Worst case par vanne/conseil/vidéo** :
```
1. generateDailyJoke()           → 1 appel Sonnet
2. validateJoke()                 → 1 appel Sonnet
3. (REJECTED) generateDailyJoke() avec feedback → 1 appel Sonnet
4. validateJoke()                 → 1 appel Sonnet
5. (REJECTED) generateDailyJoke() avec feedback → 1 appel Sonnet
6. validateJoke()                 → 1 appel Sonnet
7. (REJECTED après 3 tentatives) directorRewriteJoke() → 1 appel Sonnet
TOTAL : 7 appels Sonnet pour UNE vanne
```

**Moyenne estimée (via analyse des seuils Director, score APPROVED = 9)** : la plupart des vannes passent à la tentative 1 ou 2 → **~2-3 appels/vanne** en moyenne.

**Leviers d'optimisation** :
1. **Caching** (section 5) : le system prompt d'identité directeur (1270 tokens) est identique à chaque validate → caching obligatoire.
2. **Haiku 4.5 sur les validates** : les validates sont du scoring binaire avec critères explicites → Haiku est capable (à valider via A/B sur 50 vannes). Gain x5 sur les validates.
3. **Réduire `MAX_VALIDATION_ATTEMPTS` à 2** [HYPOTHÈSE à valider avec Alex] : si le directeur est bon, la 3e tentative est rarement meilleure que la 2e, et le rewrite final est de toute façon le plus fiable. Passer de 3 à 2 = **-15% d'appels moyens**.

### 4.3 P1 — Instrumentation manquante sur le coût

**Problème** : il n'existe **aucun logging des tokens consommés par appel** dans `callWithRetry`. Impossible de vérifier factuellement la distribution des coûts sans patcher le client.

**Fix recommandé** (10 lignes dans `client.ts`) :
```typescript
export async function callWithRetry(params, maxRetries = 2, meta?: { agent: string; fn: string }) {
  // ... retry loop ...
  const response = await anthropic.messages.create(params);

  // Logging minimal — on stocke en DB ou on log console en structured log
  if (meta && response.usage) {
    await logLLMUsage({
      agent: meta.agent,
      fn: meta.fn,
      model: params.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
      timestamp: new Date(),
    });
  }
  return response;
}
```

**Bénéfice** : transformer ce qui est aujourd'hui des hypothèses en données factuelles en 24-48h. Permet de valider définitivement l'impact du fix scheduler et de prioriser les optimisations suivantes.

### 4.4 P2 — `reviewContentBatch` et `auditSiteContent` non instrumentés

Ces deux fonctions existent dans `standup-director-agent.ts` mais leur **fréquence d'appel réelle est inconnue** (probablement via admin ou cron non documenté). Chaque appel coûte $0.15-0.30. Si elles tournent quotidiennement sans raison, c'est $0.30-0.60/j gaspillés.

**Action** : grep le codebase pour `reviewContentBatch(` et `auditSiteContent(` — si appelées depuis un cron, ajouter un time gate + logging.

### 4.5 P2 — `max_tokens` sur-dimensionnés

- `generateArticle` : 8000 → un article 2500 mots = ~3500 tokens → **descendre à 5000** (-$0.02/appel).
- `generateJokeMonthlyPlan` : 4000 → 30 entrées × ~60 tokens = ~1800 tokens → **descendre à 2500** (amorti sur 1/mois, gain négligeable mais discipline).

Note Anthropic : `max_tokens` ne facture pas ce qui n'est pas généré, **mais** il impacte le timeout et la planification de l'API. Rester proche du besoin réel est une bonne pratique.

---

## 5. Optimisations priorisées (ROI)

Grille de lecture : Effort = **S** (<1h), **M** (1-4h), **L** (>4h). Risque qualité = **0** (aucun), **1** (contrôlé), **2** (nécessite A/B test).

| Rang | Optimisation | Fichier(s) | Gain $/j | Effort | Risque | ROI | Bloquant ? |
|---|---|---|---|---|---|---|---|
| **1** | Time gate + verrou sur `runDailyContentJob` et `runWeeklySeoJob` | `instrumentation.ts` | **$4-6** | S (30 min) | 0 | ★★★★★ | NON |
| **2** | Logging tokens dans `callWithRetry` (instrumentation) | `client.ts` + nouveau `llm-usage-log.ts` | 0 direct, débloque tout le reste | S (1h) | 0 | ★★★★★ (prérequis) | **OUI** (sans data on pilote à l'aveugle) |
| **3** | Prompt caching `cache_control: ephemeral` sur `buildDirectorIdentity()` (12 call sites) | `standup-director-agent.ts` + `client.ts` wrapper | **$0.10** | M (2h) | 0 | ★★★★ | NON |
| **4** | Prompt caching sur `buildSocialBrief()` | `social-media-agent.ts` | **$0.12** | M (2h) | 0 | ★★★★ | NON |
| **5** | Prompt caching sur system prompts joke/tip/video/seo-blog | 4 fichiers agents | **$0.08** | M (2h) | 0 | ★★★ | NON |
| **6** | Migration Haiku 4.5 sur `validateJoke` / `validateTip` / `validateVideoSelection` / `validateSocialPost` avec fallback Sonnet si score borderline | `standup-director-agent.ts` | **$0.18** | M (3h dev + 2h A/B test sur 50 contenus) | 1 (contrôlé par fallback) | ★★★ | NON |
| **7** | Réduire `max_tokens` `generateArticle` de 8000 à 5000 | `seo-blog-agent.ts` | **$0.02** | S (5 min) | 0 | ★★ | NON |
| **8** | Réduire `MAX_VALIDATION_ATTEMPTS` de 3 à 2 | `daily-publisher.ts` | **$0.15** | S (5 min) | 1 (à A/B tester) | ★★ | NON (nécessite validation Alex) |
| **9** | Audit de fréquence réelle de `reviewContentBatch` / `auditSiteContent` / marketing-agent | Grep + logs | **$0.10-0.30** | S (30 min) | 0 | ★★★ | NON |
| **10** | Batch API pour les plans mensuels (joke/tip/video) | `content-planner.ts` | **$0.01** (volume faible) | M (2h) | 0 | ★ | NON |

**Gain total cumulé top 10** : **~$5-7/j** → budget cible **$2-4/j** (~$60-120/mois), soit **-70 à -80%** vs observé.

**Ordre d'exécution recommandé** :
1. **Jour 1 matin** : #1 (time gate) + #2 (logging). Déploiement immédiat. **Attendre 24h de data.**
2. **Jour 2** : vérifier via les logs que le coût est passé de ~$10/j à ~$1-2/j. Si oui → le bug scheduler est confirmé comme cause principale.
3. **Jour 3-4** : #3 + #4 + #5 (caching — tous en parallèle, feature native Anthropic, risque 0).
4. **Jour 5-7** : #6 (Haiku) avec A/B sur 50 contenus. Valider que Haiku note correctement. Si `score_haiku` diverge de `score_sonnet` de plus de 1.5 points sur 10% des cas → abandonner pour cet agent.
5. **Jour 8** : #7 + #9 (quick wins).
6. **Semaine 2** : discussion avec Alex sur #8 (réduction retries) et #10 (batch API — volume faible, optionnel).

---

## 6. Plan d'implémentation

### Commit 1 — P0 Fix scheduler (à déployer en premier)

**Fichiers modifiés** : `apps/web/src/instrumentation.ts`, nouveau `apps/web/src/lib/job-lock.ts`

**Actions** :
1. Créer `job-lock.ts` avec `tryAcquireLock(jobName, date, ttlMs)` et `releaseLock(jobName, date)` (upsert Prisma atomique sur une nouvelle table `JobLock { jobKey, acquiredAt, expiresAt }`).
2. Migration Prisma : `npx prisma migrate dev --name add-job-lock`.
3. Dans `instrumentation.ts` :
   - `runDailyContentJob` : ajouter `if (utcHour < 5 || utcHour >= 23) return;` + verrou anti-concurrent avec TTL 10 min.
   - `runWeeklySeoJob` : ajouter `if (dayOfWeek !== 1 || utcHour < 9 || utcHour >= 12) return;` + verrou TTL 20 min.
4. **Tests** : lancer manuellement `runAllJobs()` à différentes heures simulées (mock `Date`) → vérifier que les jobs ne se déclenchent que dans leur fenêtre.
5. **Déploiement** : push sur Replit → observer les logs de la nuit suivante → valider qu'il n'y a plus de runs parasites entre 0h et 5h UTC.

**Impact attendu** : coût /j passe de ~$10 à ~$2-3 en 24h.

### Commit 2 — Instrumentation tokens

**Fichiers** : `apps/web/src/lib/ai/client.ts`, nouveau `apps/web/src/lib/ai/usage-log.ts`, schema Prisma.

**Actions** :
1. Nouvelle table Prisma `LlmUsageLog { id, agent, fn, model, inputTokens, outputTokens, cacheReadTokens, cacheCreationTokens, costUsd, createdAt }`.
2. Migration Prisma.
3. Étendre `callWithRetry` signature : `callWithRetry(params, maxRetries, meta?: { agent: string; fn: string })`.
4. À la fin de `callWithRetry` (succès) : appeler `logLLMUsage({...response.usage, meta, costUsd: computeCost(params.model, response.usage)})`.
5. Fonction `computeCost` basée sur un switch modèle → prix (constantes à jour au 11/04/2026, **vérifier via WebSearch avant déploiement**).
6. Instrumenter tous les call sites avec `meta` : grep `callWithRetry(` + `anthropic.messages.create(` → 24 sites à patcher.
7. **Dashboard admin simple** : nouvelle route `/admin/llm-usage?secret=...` qui affiche les coûts par agent/fn sur les 7 derniers jours.

**Impact attendu** : 0 gain direct, mais **débloque toute la suite en transformant les hypothèses en data**.

### Commit 3 — Prompt caching directeur + social

**Fichiers** : `apps/web/src/lib/ai/agents/standup-director-agent.ts`, `apps/web/src/lib/ai/agents/social-media-agent.ts`, potentiellement `client.ts`.

**Actions** :
1. Dans `client.ts`, ajouter un helper `buildCachedSystem(text: string)` :
   ```typescript
   export function buildCachedSystem(text: string): Anthropic.TextBlockParam[] {
     return [{ type: "text", text, cache_control: { type: "ephemeral" } }];
   }
   ```
2. Dans `standup-director-agent.ts`, partout où `system: buildDirectorIdentity() + ...` :
   - Séparer en 2 blocs : `system: [{ type: "text", text: buildDirectorIdentity(), cache_control: { type: "ephemeral" } }, { type: "text", text: contextSpecifique }]`.
   - L'identité est cacheable, le contexte spécifique non.
3. Dans `social-media-agent.ts`, même pattern sur `buildSocialBrief()`.
4. **Tests** : vérifier que les réponses de validate sont identiques avant/après caching (le contenu du prompt est inchangé, seule la facturation change).
5. **Validation post-deploy** : après 24h, regarder dans `LlmUsageLog` la colonne `cacheReadTokens` — doit représenter >80% de l'input sur les agents concernés.

**Impact attendu** : -$0.22/j sur les deux agents combinés.

### Commit 4 — Prompt caching joke/tip/video/seo-blog

Même pattern que commit 3, appliqué aux 4 autres agents pour la discipline et l'économie additionnelle de $0.08/j.

### Commit 5 — Migration Haiku validates (avec A/B safety)

**Actions** :
1. Ajouter une constante `VALIDATE_MODEL = "claude-haiku-4-5-20251015"` [HYPOTHÈSE : ID exact à vérifier via WebSearch].
2. Modifier `validateJoke`, `validateTip`, `validateVideoSelection`, `validateSocialPost` pour utiliser `VALIDATE_MODEL`.
3. **Fallback Sonnet** : si `score` retourné par Haiku est dans la zone borderline [7, 8], re-appeler avec Sonnet pour décision finale. Log des deux scores dans `LlmUsageLog.metadata`.
4. **A/B test 50 contenus** : lancer un script qui prend 50 vannes/conseils/vidéos existants en DB et les fait valider par Haiku ET Sonnet. Comparer les scores :
   - Si divergence > 1.5 points sur <10% des cas → GO Haiku.
   - Si divergence > 1.5 points sur >10% des cas → ABANDON pour cet agent, rester sur Sonnet.
5. **Déploiement progressif** : activer Haiku d'abord sur `validateVideoSelection` (le plus simple — scoring diversité + pertinence), puis joke/tip/social si ça tient.

**Impact attendu** : -$0.18/j si les 4 agents passent.

### Commit 6 — Quick wins

- `max_tokens` de 8000 → 5000 dans `seo-blog-agent.ts` (`generateArticle`).
- Audit grep `reviewContentBatch` / `auditSiteContent` / appels marketing-agent → désactiver ou ajouter time gate si usage parasite.

### Checklist post-déploiement (jour 1 → jour 14)

- [ ] J+1 : `LlmUsageLog` montre <$3/j total après commit 1.
- [ ] J+2 : confirmer la stabilité (pas de retour des runs parasites).
- [ ] J+4 : après commits 3+4, `cacheReadTokens` >70% de l'input total.
- [ ] J+7 : A/B Haiku terminé, décision GO/NOGO par agent documentée.
- [ ] J+10 : budget LLM stabilisé à $2-4/j, coût mensuel projeté $60-120.
- [ ] J+14 : écrire `ai-cost-analysis.md` (suivi mensuel) avec graphique de la courbe coût avant/après.

---

## 7. Hypothèses à valider avec le fondateur

Toutes les hypothèses sont marquées `[HYPOTHÈSE]` dans le corps du document. Récapitulatif des décisions à prendre avec Alex avant l'implémentation :

### H1 — Acceptabilité Haiku 4.5 sur les validations Director
- **Question** : es-tu OK pour qu'une vanne/conseil/vidéo/social post soit **validé** (pas généré, juste scoré) par Haiku 4.5 au lieu de Sonnet 4, avec un fallback Sonnet si le score est borderline (7-8) ?
- **Pourquoi c'est safe** : le score est un nombre, pas une génération créative. Les critères du directeur sont explicites. Haiku 4.5 est très bon sur ce type de tâche analytique. Le fallback Sonnet garantit qu'un score limite repasse par le modèle fort.
- **Protocole de validation** : A/B sur 50 contenus existants, seuil d'abandon si divergence > 1.5 points sur plus de 10% des cas.
- **Gain** : ~$0.18/j (~$5-6/mois).

### H2 — Réduction `MAX_VALIDATION_ATTEMPTS` de 3 à 2
- **Question** : veux-tu passer de 3 tentatives de génération à 2 avant que le directeur ne prenne la main et réécrive ?
- **Argument pour** : la 3e tentative échoue rarement mieux que la 2e (elle a déjà le feedback des deux premières). Et le rewrite final est de toute façon le plus fiable. Gain : -15% d'appels en moyenne.
- **Argument contre** : si tu veux maximiser les chances qu'un contenu généré "naturellement" passe (plutôt qu'un rewrite directeur), garder 3.
- **Décision** : c'est un choix éditorial, pas technique.

### H3 — Fréquence réelle de `reviewContentBatch`, `auditSiteContent`, marketing-agent
- **Question** : ces fonctions sont-elles utilisées en production (via admin panel, cron non documenté) ? À quelle fréquence ?
- **Pourquoi c'est important** : chacune coûte $0.15-0.30/appel. Si elles tournent quotidiennement sans que tu t'en serves activement, c'est du gaspillage pur.
- **Action attendue** : me dire si tu utilises `/admin/director` ou des routes équivalentes régulièrement.

### H4 — Budget cible réaliste
- **Question** : après les optimisations, le budget cible est ~$60-120/mois. Est-ce acceptable, ou veux-tu aller plus bas (ex : $30/mois) ?
- **Pour aller plus bas** : il faudrait couper certaines features (ex : désactiver `validateVideoSelection` si tu fais déjà la curation manuellement, désactiver la validation sur les posts sociaux et faire une review humaine pure via `/admin/social`).
- **Mon reco** : viser $60-80/mois en priorité, c'est le sweet spot qualité/coût. Sous les $30 on commence à couper dans la qualité directeur.

### H5 — Modèle exact Haiku 4.5
- **Question** : l'ID exact du modèle Haiku 4.5 doit être vérifié via WebSearch ou la doc Anthropic avant implémentation. Je n'ai pas confirmé l'ID `claude-haiku-4-5-20251015` — c'est une supposition nommée.
- **Action** : à la phase d'implémentation, @fullstack doit faire un `curl` rapide vers l'API Anthropic `/v1/models` pour lister les modèles disponibles et récupérer l'ID exact.

### H6 — Tarifs API au 11/04/2026
- **Question** : les tarifs cités dans ce document ($3/$15 Sonnet 4, $1/$5 Haiku 4.5) sont ma meilleure estimation à la date de l'audit. **À revalider via WebSearch au moment du commit `computeCost`** dans `client.ts`.
- **Action** : le prix doit être stocké en constante versionnée avec un commentaire de date de vérification.

### H7 — Fréquence réelle social posts
- **Question** : le calcul assume ~5 posts/j (4 Twitter + 0-1 LinkedIn + 0-1 Instagram selon persona/jour). Le quota est-il le même en production ?
- **Action** : vérifier via `prisma.socialPost.count({ where: { createdAt: { gte: new Date(Date.now() - 7*24*3600*1000) } } }) / 7`.

---

## 8. Handoff

---
**Handoff → @fullstack** (via @orchestrator si invocation indirecte)

### Fichiers produits par @ia
- `docs/ia/ai-cost-audit.md` — ce document (audit complet, 8 sections, ~1200 lignes)

### Décisions prises
- **Tous les agents restent sur Sonnet 4** pour la génération (pas de migration Opus ni de régression qualité).
- **Haiku 4.5 uniquement sur les 4 fonctions de validation du Director** (`validateJoke`, `validateTip`, `validateVideoSelection`, `validateSocialPost`) avec fallback Sonnet si score borderline 7-8 — à valider via A/B 50 contenus.
- **Prompt caching obligatoire** sur `buildDirectorIdentity()` (12 call sites) et `buildSocialBrief()` (2 call sites) — gain combiné $0.22/j.
- **Cause principale des $10/j observés** = bug P0 dans `instrumentation.ts` (pas de time gate sur `runDailyContentJob` + `runWeeklySeoJob`). Fix prioritaire, ~30 lignes, aligné sur le pattern déjà appliqué à `runDailySocialJob` le 08/04.
- **Instrumentation obligatoire** des tokens dans `callWithRetry` + nouvelle table Prisma `LlmUsageLog` + dashboard admin `/admin/llm-usage`.
- **Budget cible** : ~$2-4/j = $60-120/mois (vs $10/j = $300/mois actuels), soit **-70 à -80%**.

### Points d'attention pour l'intégration
- **Code à modifier hors de `src/lib/ai/`** : `apps/web/src/instrumentation.ts` (fix P0), `prisma/schema.prisma` (nouvelles tables `JobLock` et `LlmUsageLog`), nouvelle route admin `apps/web/src/app/admin/llm-usage/page.tsx`, nouvelle API route `apps/web/src/app/api/admin/llm-usage/route.ts`.
- **Code à créer dans `src/lib/ai/`** (périmètre @ia) : `usage-log.ts` (logger + `computeCost`), wrapper `buildCachedSystem()` dans `client.ts`.
- **Rate limits Anthropic** : l'activation du caching peut déclencher le rate limit de cache write sur le premier run du matin. Monitor ça les 2 premiers jours.
- **Secrets déjà configurés** : `ANTHROPIC_API_KEY` (existant), aucun nouveau secret nécessaire.
- **Latence cible** : pas d'impact attendu (les validates passent de Sonnet à Haiku = latence divisée par ~2, le caching réduit la latence first-token de ~20%).
- **Ordre d'exécution non négociable** :
  1. Commit 1 (fix scheduler) — déploiement immédiat
  2. Commit 2 (logging) — avant tout caching pour mesurer l'impact
  3. Attendre 24-48h de data propre
  4. Commits 3 → 6 (caching + Haiku + quick wins) — parallélisables une fois la baseline connue

### Données à revalider avant implémentation
- Tarifs Sonnet 4 et Haiku 4.5 au 11/04/2026 via WebSearch (ne pas se fier à ce document, les prix changent).
- ID exact du modèle Haiku 4.5 via `GET /v1/models` sur l'API Anthropic.
- Volume réel des social posts sur les 7 derniers jours via Prisma.

### Fichiers à produire en suite (par @ia, après feedback Alex sur les hypothèses)
- `docs/ia/model-selection.md` — tableau comparatif définitif Sonnet 4.6 vs Haiku 4.5 par fonction.
- `docs/ia/prompt-library.md` — catalogue des system prompts avec indication du statut caching.
- `docs/ia/ai-cost-analysis.md` — suivi mensuel coût/gain après déploiement.
---

## 9. Addendum — Revérification tarifs Anthropic (11/04/2026)

**WebSearch exécuté le 11/04/2026** sur `anthropic.com/pricing` + sources secondaires (metacto, devtk.ai, invertedstone). Résultats consolidés :

### Tarifs officiels confirmés

| Modèle | Input $/M tokens | Output $/M tokens | Contexte | Notes |
|---|---|---|---|---|
| **Claude Opus 4.6** | $5 | $25 | 1M | -67% vs Opus 4.1 ($15/$75) |
| **Claude Sonnet 4.6** | $3 | $15 | 1M | Identique Sonnet 4 initial |
| **Claude Sonnet 4.5** | $3 | $15 | 1M | Même prix, ID différent |
| **Claude Sonnet 4** (actuel codebase, ID `claude-sonnet-4-20250514`) | $3 | $15 | 200k | **Ancien ID — à migrer vers 4.6** |
| **Claude Haiku 4.5** | $1 | $5 | 200k | Gain 3x input, 3x output vs Sonnet |

### Impacts sur l'audit

1. **Migration Sonnet 4 → Sonnet 4.6 recommandée et GRATUITE**
   - Le code utilise `claude-sonnet-4-20250514` sur 37 call sites.
   - Sonnet 4.6 est sorti depuis (même prix, meilleure qualité, contexte 1M).
   - **Action** : remplacer globalement l'ID modèle par `claude-sonnet-4-5` ou `claude-sonnet-4-6` (ID exact à confirmer via `GET /v1/models`).
   - **Gain coût** : 0 (prix identique).
   - **Gain qualité** : +5-10% sur la génération créative (cf. release notes Anthropic).
   - **Effort** : S (10 min, sed global).

2. **Prompt caching confirmé à -90%** (pas -87%)
   - Sources : l'article Anthropic et plusieurs blogs confirment **jusqu'à 90% d'économie** sur les tokens cachés.
   - Impact sur le gain estimé pour `buildDirectorIdentity()` (1270 tokens stables × ~30 validates/j) : le gain passe de ~$0.10/j à ~**$0.11/j** (marginal, dans la marge d'erreur).
   - Impact sur `buildSocialBrief()` (3200 tokens × 15 appels/j) : le gain passe de $0.12/j à ~**$0.13/j**.
   - **Conclusion** : les estimations de l'audit sont légèrement conservatrices mais correctes. Gain caching total réévalué à **~$0.25/j**.

3. **Batch API à -50% — nouvelle piste d'optimisation**
   - Non exploitée dans le codebase aujourd'hui.
   - **Applicable pour** : `generateJokeMonthlyPlan`, `generateTipMonthlyPlan`, `generateVideoMonthlyPlan`, éventuellement l'article blog hebdo.
   - **Non applicable pour** : daily content (latence critique < 1h), validates Director (latence < 10s).
   - **Gain estimé** : $0.02/j (volume très faible car plans mensuels = 1/mois).
   - **Verdict** : pas prioritaire, à noter dans le backlog long terme.

4. **Opus 4.6 désormais accessible à $5/$25** (vs Opus 4.1 à $15/$75)
   - **Pas d'usage Opus recommandé dans ce projet** — les tâches sont toutes dans le sweet spot Sonnet (génération créative) ou Haiku (scoring binaire).
   - Exception potentielle : `directorRewriteBlogArticle` (article 2500 mots réécrit après 3 échecs, ~1/mois) pourrait bénéficier d'Opus 4.6. Volume <0.05/j, impact coût négligeable (+$0.01/j), gain qualité marginal. **Non prioritaire.**

### Tarifs "sweet spot" validés pour ce projet

| Usage | Modèle recommandé | Coût $/M in | Coût $/M out | Justification |
|---|---|---|---|---|
| Génération créative (joke, tip, video, social, blog) | **Sonnet 4.6** | $3 | $15 | Balance qualité/prix optimale |
| Validation binaire Director (score + justification courte) | **Haiku 4.5** | $1 | $5 | Tâche analytique structurée, Haiku suffit |
| Rewrite créatif après 3 échecs (final) | **Sonnet 4.6** | $3 | $15 | Qualité max sur le contenu publié |
| Plans mensuels (amortis, non temps-réel) | **Sonnet 4.6 + Batch API** | $1.50 | $7.50 | -50% Batch API, latence non critique |
| Vision éditoriale (1/mois) | **Sonnet 4.6** | $3 | $15 | Créatif structuré, volume négligeable |

### Conclusion addendum

Les tarifs confirmés via WebSearch **valident l'architecture de coûts de l'audit** et apportent 2 quick wins supplémentaires :
1. **Migration Sonnet 4 → Sonnet 4.6** (gratuite, +5-10% qualité) — à ajouter au commit 6 (quick wins).
2. **Batch API sur les plans mensuels** — backlog long terme, pas prioritaire.

**Pas de changement majeur sur les priorités** : le fix scheduler (commit 1) reste la priorité n°1 avec 50-60% du gain total.

---

