# Audit cron × Buffer + Calendrier publications + Analyse OpenAI 2.0 — s7

> **Mode** : audit + recherche, aucune modification source code.
> **Date** : 5 mai 2026 (post-refonte s7, commit 45fc027).
> **Périmètre** : crons `daily-social` / `publish-social`, limites Buffer, calendrier hebdo, analyse OpenAI release pertinence pour Instagram.

---

## 1. Audit cron daily-social × limites Buffer

### 1.1 Limites Buffer constatées dans le code

Le client Buffer (`apps/web/src/lib/social/buffer-client.ts`) déclare explicitement :

```ts
const BUFFER_MAX_SCHEDULED = 10;        // limite plan gratuit Buffer
const BUFFER_SAFETY_MARGIN = 2;         // marge race conditions
const BUFFER_EFFECTIVE_LIMIT = 8;       // (10 - 2)
```

Hard limits taille (avant cascade Buffer 400) :
- TWITTER : 280 chars (validation métier G-S5 à 270)
- LINKEDIN : 1300 chars
- INSTAGRAM : 2200 chars

**Note CLAUDE.md** mentionne "plan Essentials ~6$/mois". Le code commente "plan gratuit Buffer = 10 posts schedulés/channel". Désalignement à clarifier — mais peu importe le tier : le garde-fou applicatif `BUFFER_EFFECTIVE_LIMIT = 8` est la contrainte qui agit dans tous les cas.

Buffer publie / récupère via GraphQL `https://api.buffer.com`. Aucun rate-limit explicite documenté dans le code (probablement standard Buffer ~60 req/min).

### 1.2 Volumétrie générée par jour / mois (refonte s7)

| Persona du jour | Twitter | LinkedIn | Instagram | Total/jour |
|---|---|---|---|---|
| Yanis (jour 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31) | 1 | **0** | 1 | **2** |
| Sophie (jour 2, 5, 8, 11, 14, 17, 20, 23, 26, 29) | 1 | 1 | 1 | **3** |
| Marc (jour 3, 6, 9, 12, 15, 18, 21, 24, 27, 30) | 1 | 1 | 1 | **3** |

Sur 30 jours : ~10 jours Yanis (×2 posts) + ~20 jours Sophie/Marc (×3 posts) = **20 + 60 = 80 posts/mois**.

Par channel sur 30 jours :
- Twitter : 30 posts/mois (1/jour)
- LinkedIn : ~20 posts/mois (skip Yanis)
- Instagram : 30 posts/mois (1/jour)

### 1.3 Cron × plateforme — tableau d'exposition

| Cron | Fréquence | Action | Volume/jour | Volume/mois | Limite Buffer | Verdict |
|---|---|---|---|---|---|---|
| `daily-social` (4h UTC) | 1×/jour | Génère 2-3 posts (Twitter + LI sauf Yanis + IG) | 2-3 | ~80 | N/A (génération DB only) | OK |
| `publish-social` Twitter | 30 min (48 runs/j) | Push 1 post APPROVED dont scheduledAt ≤ now | 1 | 30 | 8 slots Buffer simultanés | OK (très loin du seuil) |
| `publish-social` LinkedIn | 30 min | idem | 0-1 | ~20 | 8 slots | OK |
| `publish-social` Instagram | 30 min | idem (avec image) | 1 | 30 | 8 slots | OK |

**Garde-fous applicatifs déjà en place** :
- `seenPlatforms` filter dans `publish-social` → max **1 post / plateforme / run** (espacement 30 min).
- `BufferQueueFullError` → si queue ≥ 8, post repoussé de 2h.
- Circuit breaker 24h si 429 détecté → exclut la plateforme de la query suivante 24h.
- Retry exponentiel : `[retry:1]` → `[retry:2]` → `[retry:3]` puis `FAILED`.

### 1.4 Risques mathématiques

**Test de saturation** : pire cas = 1 post/30min = 48 push/jour/plateforme théorique. Mais le code limite à 1 push/run + ne va chercher que les `APPROVED scheduledAt ≤ now`. Résultat : **1 post/jour/plateforme effectivement envoyé à Buffer**, jamais plus.

Calcul de remplissage du queue Buffer :
- Generate à 4h UTC → scheduledAt ~ entre 7h et 23h Paris
- À tout instant T, on a entre 0 et 3 posts avec `scheduledAt > now` ET `status = APPROVED` (pas encore publiés par Buffer).
- Buffer publie à `scheduledAt`, libère le slot.
- Pic de saturation : ~3 slots occupés, jamais 8.

**Vérification queue effective** : le code appelle `getBufferQueueCount(platform)` AVANT chaque `createBufferPost`. Si la queue Buffer est manuellement saturée (admin a pré-rempli depuis le dashboard Buffer), le post est repoussé de 2h. Comportement correct.

### 1.5 Points de vigilance

1. **Double-publication impossible** : `seenPlatforms` + `take: 10` + filter `status = APPROVED` rend la double-publication structurellement impossible. Le commit `seen + update PUBLISHED` est séquentiel. ✓
2. **Tokens IA gaspillés** : si `daily-social` génère mais que 100% des posts sont REJETÉS par le Director (score < 9), tous les posts vont en PENDING — pas en queue Buffer. Risque budget Anthropic, pas Buffer.
3. **Format deprecated** : `publish-social` rejette automatiquement les `THREAD / QUOTE_ANALYSIS / WILD_CARD / TECHNIQUE_DU_JOUR` même s'ils sont APPROVED. Cleanup automatique de la queue legacy. ✓
4. **Force mode** : `?force=true` regenerate même si quota atteint → si lancé 5×/jour manuellement, on aurait jusqu'à 15 posts/jour. Mais c'est manuel/admin, pas automatique. Surveillance OK.
5. **Génération vs publication asymétriques** : `daily-social` peut tomber à 4h UTC, `publish-social` à 4h30. Si scheduledAt = 7h Paris (5h UTC en heure d'été), le push effectif arrive au cron de 5h UTC. Délai de propagation Buffer ~2 min. Tout cohérent.

### 1.6 Verdict cron × Buffer

**OK — pas d'upgrade nécessaire**. Le plan gratuit Buffer (8 slots effectifs / channel) est largement sous-utilisé : volume réel ≤ 3 slots simultanés / channel. Le passage à Buffer Pro n'apporte aucune valeur sur la dimension scheduling. Pertinent UNIQUEMENT si :
- ajout Reels (besoin format vidéo, voir mission 3),
- carousels Instagram (Buffer ne les supporte pas en API gratuite),
- analytics avancées (Buffer Pro inclut métriques par post).

---

## 2. Calendrier publications par plateforme

### 2.1 Rotation persona

`getPersonaForDay(dayOfMonth)` cycle : `dayOfMonth % 3` → YANIS / SOPHIE / MARC.

Sur une semaine standard (semaine du 5 au 11 mai 2026, persona = day 5 SOPHIE → day 11 = (11-1)%3=1 = SOPHIE) — la rotation est calée sur le dayOfMonth, pas le dayOfWeek. Donc le calendrier hebdo dépend du mois.

### 2.2 Heures de publication (heure Paris)

Extraites de `getOptimalScheduleTime()` :

| Plateforme | YANIS | SOPHIE | MARC |
|---|---|---|---|
| Twitter (slot 0 → 1 post/jour) | 13h | 8h | 7h |
| LinkedIn (slot 0) | (skip) | 7h | 6h |
| Instagram (slot 0) | 19h | 11h | 7h |

**Note importante** : avec 1 post/plateforme/jour (refonte s7), seul `slotIndex = 0` est utilisé en réalité. Les autres slots du tableau (`SOPHIE Twitter [8, 12, 18]`) sont **dead code post-s7** — pertinents seulement avant la refonte (multi-tweets/jour).

### 2.3 Calendrier hebdomadaire-type (mois où jour 1 = lundi → cycle Yanis/Sophie/Marc/Yanis…)

| Jour | Persona | Twitter (heure Paris) | LinkedIn | Instagram |
|---|---|---|---|---|
| Lun (j1) | Yanis | 13h MINI_STANDUP | — (skip) | 19h IMAGE_QUI_CLAQUE |
| Mar (j2) | Sophie | 8h MINI_STANDUP | 7h POTE_AU_TAF | 11h IMAGE_QUI_CLAQUE |
| Mer (j3) | Marc | 7h MINI_STANDUP | 6h POTE_AU_TAF | 7h IMAGE_QUI_CLAQUE |
| Jeu (j4) | Yanis | 13h | — | 19h |
| Ven (j5) | Sophie | 8h | 7h | 11h |
| Sam (j6) | Marc | 7h | 6h | 7h |
| Dim (j7) | Yanis | 13h | — | 19h |

**Volume hebdo** :
- Twitter : 7 posts/sem
- LinkedIn : 5 posts/sem (skip Yanis × 2-3 jours)
- Instagram : 7 posts/sem
- **Total : ~19 posts/sem**, soit ~80 posts/mois (cohérent avec mission 1).

**Top créneau** (en termes d'engagement attendu) :
- Twitter : 13h Yanis (pause déj scrolling) et 8h Sophie (commute matin)
- LinkedIn : 7h Sophie (avant boulot, skim feed) — créneau pré-bureau bien calibré
- Instagram : 19h Yanis (rentrée du soir, scroll détente) — top créneau IG cohérent avec algo

### 2.4 Cohérence weeklySchedule JSON ↔ code

| Source | Volume/jour annoncé | Volume/jour code |
|---|---|---|
| `social-editorial-plan.json` v2.0-s7 | 3 (1 Tw + 1 LI + 1 IG) sauf Yanis (2) | 3 (1 Tw + 1 LI + 1 IG) sauf Yanis (2) |
| `daily-social/route.ts` quotas | `{TWITTER:1, LINKEDIN: isYanis?0:1, INSTAGRAM:1}` | idem |
| `getDailyPlan()` social-media-agent | 1 + (1 sauf Yanis) + 1 | idem |

**Cohérence parfaite**. Aucun flag à lever.

### 2.5 Notes calendaires

- **Yanis pas de LinkedIn** : confirmé partout. Yanis (20 ans étudiant) n'a pas de profil LI actif → décision produit cohérente.
- **Heures injectées dans Buffer dès 4h UTC** : `getOptimalScheduleTime` calcule un Date UTC et le passe à Buffer en `scheduledAt`. Buffer scheduler prend le relais — le cron `publish-social` push juste les posts dont `scheduledAt ≤ now`.
- **Variance ±15 min** : `today.setUTCHours(utcHour, Math.floor(Math.random() * 15), 0, 0)` — petit jitter pour éviter le pattern "8h00:00 pile" anti-IA suspect.
- **Heure été/hiver** : `getParisUtcOffset()` calcule dynamiquement +1 / +2 selon saison. Vérifié dans le code (ligne ~1290).

### 2.6 Verdict calendrier

**OK — calendrier cohérent et bien calibré**. Aucun ajustement bloquant. Suggestions mineures pour V2 :
- Sophie LinkedIn 7h est tôt — tester 8h ou 12h (pause déj LI activité élevée chez salariés FR).
- Marc Instagram 7h est très tôt pour un format détente ; tester 20h pour aligner sur le scroll soirée 30+.
- Twitter Yanis 13h est solide ; on peut tester 21h (algo Twitter aime les soirées weekend).

À surveiller via `/cron/social-analytics` : si engagement plat à 30j sur certains créneaux → A/B test des heures.

---

## 3. OpenAI 2.0 — pertinence pour Marrant

> **Note méthodologique** : sans WebSearch en subagent, l'analyse s'appuie sur la connaissance du modèle (cutoff jan 2026). Les éléments à confirmer côté Thomas sont marqués **[CONFIRMER]**.

### 3.1 Stack actuelle Marrant

- **SDK IA** : `@anthropic-ai/sdk` (Claude Sonnet/Opus). PAS d'OpenAI dans la stack.
- **Génération images IG** : `@vercel/og` + satori → templates SVG → PNG (`generate-post-image.ts`).
- **Format IG** : single-image 1080x1080 uniquement (Buffer API ne supporte pas carousels/Reels en API).

### 3.2 Releases OpenAI 2024-2026 — analyse pertinence

| Release | Pertinent | Pourquoi |
|---|---|---|
| **GPT-5** (2025) | ❌ NON | Marrant utilise Anthropic. Switch = refonte majeure de tous les agents (joke/tip/video/director/seo/social). Coût migration > gain marginal. À ignorer sauf si Anthropic devient indisponible/trop cher. |
| **DALL-E 3 / GPT-Image-1** | ⚠️ TESTABLE | Pourrait remplacer satori pour visuels IG plus accrocheurs. Coût ~$0.04/image × 30/mois = $1.20/mois. Risque : casse la cohérence brand (charte violette uniforme = signature visuelle reconnaissable < 1s). À tester en A/B sur 1-2 posts. |
| **Sora 2** (vidéo) **[CONFIRMER pricing]** | ✅ OUI à moyen terme | Débloque le format Reels Instagram (algo IG favorise Reels > single-image). 1 Reels/sem = 4-5/mois × ~$1-2/clip = $5-10/mois. Stack à ajouter : SDK OpenAI + endpoint génération + Buffer support vidéo (à vérifier — Buffer API gratuite ne push que single-image AFAIK). |
| **Realtime API v2** (audio) | ❌ NON | Pas de canal audio dans Marrant. Hors scope. |
| **Apps for ChatGPT** (fin 2025) | ✅ OUI long terme | Acquisition canal majeur. Yanis demande à ChatGPT "trouve-moi une vanne" → app Deviens-Marrant répond avec catalogue. Stack à ajouter : manifest app + endpoint d'API public catalogue. Effort estimé : 1-2 sem dev + soumission. |
| **Whisper / Voice mode** | ❌ NON | Hors scope produit (pas d'input audio utilisateur). |

### 3.3 Spécifique Instagram — recommandation actionnable

**Constat post-s7** : format `IMAGE_QUI_CLAQUE` = punchline ≤6 mots fond noir + caption ≤80 chars. Charte unique violette = avantage différenciant (reconnaissable au scroll). Limite IG : algo favorise Reels, single-image plafonne en reach naturel.

#### Court terme (s7-s8, mai-juin 2026)

**Action** : ne rien changer côté visuels. Garder `IMAGE_QUI_CLAQUE` charte violette pour mesurer engagement 30 jours sur les 9 posts canoniques refondus. KPI à suivre via `/cron/social-analytics` :
- Reach moyen / post
- Engagement rate (likes + comments + saves) / reach
- Saves rate (signal qualité IG)

Si engagement IG < 1% à 30j → diagnostic OpenAI Sora pertinent.

#### Moyen terme (s9-s10, juillet-août 2026)

**Action** : si engagement IG plafonne, **tester OpenAI Sora 2 pour 1 Reels/semaine**. Pré-requis :
- Compte OpenAI + budget génération (~$5-10/mois pour 4 Reels).
- Vérifier si **Buffer API supporte upload vidéo Instagram** (probablement seulement Buffer Pro, **[CONFIRMER]**).
- Adapter `generate-post-image.ts` → `generate-post-video.ts` avec prompt depuis post canonique.
- A/B : 1 Reels/sem + 6 single-image/sem pendant 4 semaines, comparer engagement.

#### Long terme (Q4 2026)

**Action** : **Apps for ChatGPT** comme canal acquisition Yanis (intent-based). User dit à ChatGPT "trouve-moi une vanne pour ce soir" → app Deviens-Marrant répond avec 3 vannes du catalogue + lien profil. Effort : ~2 sem dev (manifest + endpoint catalogue API + soumission OpenAI store). ROI attendu : trafic intent-based haute qualité, conversion premium plus forte que social.

### 3.4 Verdict OpenAI

| Reco | Horizon | Action |
|---|---|---|
| **Court terme** | Sem 7-8 | Mesurer engagement IG 30j sur charte actuelle. Ne rien changer. |
| **Moyen terme** | Sem 9-10 | Si engagement < 1% → POC Sora 2 sur 1 Reels/sem. **[CONFIRMER]** support Buffer vidéo + budget OpenAI. |
| **Long terme** | Q4 2026 | Apps for ChatGPT — backlog produit. Effort ~2 sem dev, gros potentiel acquisition. |

---

## 4. Synthèse + actions recommandées

### 4.1 Verdicts

| Domaine | Verdict | Niveau d'urgence |
|---|---|---|
| **Cron × Buffer** | OK — plan gratuit (8 slots) largement suffisant pour 80 posts/mois × 3 channels | Aucune action |
| **Calendrier hebdo** | OK — cohérence parfaite weeklySchedule JSON ↔ code, créneaux solides | Surveillance via analytics |
| **OpenAI 2.0 IG** | Court terme NON / Moyen terme TESTABLE (Sora) / Long terme OUI (Apps ChatGPT) | Backlog |

### 4.2 Actions backlog

1. **[Surveillance]** Mesurer engagement IG 30j post-refonte s7 sur les 9 posts canoniques. KPI cible : engagement rate ≥ 1.5%, saves rate ≥ 0.5%. Sortie attendue fin sem 9.
2. **[Surveillance]** Vérifier 1×/sem que la queue Buffer reste < 5 slots / channel via `getBufferQueueCount()` exposé dans `/api/admin/buffer-channels`. Si ≥ 6 → investiguer pourquoi Buffer ne publie pas assez vite.
3. **[POC]** Sem 9-10 : si engagement IG < 1%, tester OpenAI Sora 2 pour 1 Reels/sem. **[CONFIRMER avec Thomas]** : budget OpenAI dispo + Buffer Pro upgrade ($15/mois) si nécessaire pour upload vidéo IG.
4. **[Recherche]** Q3 2026 : étude faisabilité Apps for ChatGPT — manifest + endpoint API public catalogue Joke/Tip + critères validation OpenAI store.
5. **[Cleanup]** Dead code à nettoyer : les arrays multi-slots (`SOPHIE Twitter [8, 12, 18]`) dans `getOptimalScheduleTime` — post-s7 seul slot 0 utilisé. Réduire à `[8]` pour clarifier l'intention. Non urgent (no impact runtime).

### 4.3 Points d'attention

- **Désalignement plan Buffer** : CLAUDE.md dit "Essentials ~6$/mois", code dit "plan gratuit". Vérifier le tier réel du compte Marrant pour avoir les bonnes limites (gratuit = 10 slots, Essentials = scheduling illimité, Pro = analytics + vidéo). **[CONFIRMER]** avec Thomas.
- **Risque tokens IA gaspillés** : si Director rejette systématiquement (score < 9), 80 posts/mois × ~3 tentatives × ~600 tokens prompt ≈ 144k tokens/mois (Sonnet ~$0.50/mois). Acceptable mais à surveiller via dashboard Anthropic.
- **Buffer support vidéo** : à confirmer pour Reels — si Buffer free ne push que single-image, le moyen terme Sora nécessite upgrade Pro ($15/mois) ou client Instagram Graph API direct.

---

**Fin du document** — 0 modification source code, audit/research uniquement.
