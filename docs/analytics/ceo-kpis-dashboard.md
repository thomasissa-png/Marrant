# KPIs + Dashboard `/admin/ceo` — CEO Agent Deviens Marrant

> Version 1.0 — 2026-05-06 — @data-analyst — Phase 3
> Sources : ceo-agent-specs.md, ceo-agent-architecture.md, ceo-agent-scope.md v2, ceo-conversion-playbooks.md, schema.prisma
> Pivot session 8 : KPIs prioritaires = engagement valeur éducative. MRR delta = KPI conséquence.

---

## 1. North Star + 3 satellites — formules + seuils d'alerte

### North Star — Taux d'engagement valeur 30j glissants

**Définition** : proportion de messages CEO ayant généré au moins 1 engagement actif (open tracé + reply + clic sur ressource) parmi tous les messages envoyés sur les 30 derniers jours.

**Formule** :
```
NS = SUM(opens + replies + clicks) / COUNT(CeoOutboundMessage WHERE sentAt >= NOW()-30d AND status = SENT)
```
**Source** : `CeoOutboundMessage` → colonnes `opens`, `replies`, `clicks`, `sentAt`, `status`

**Agrégation** : 30 jours glissants, recalcul daily 5h UTC + snapshot `CeoKpiSnapshot`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≥ 25% | Aucune — nominal |
| Orange | 15-24% | Revue prompts par canal dans les 7j |
| Rouge | < 15% | Alerte email Thomas + audit playbooks sous 48h |
| Dégradation | Drop > 8 points sur 7j rolling | Alerte immédiate + kill-switch envisagé |

---

### Satellite 1 — Taux de réponse email (engagement actif)

**Définition** : proportion d'emails CEO ayant reçu une réponse réelle (repliedAt non null).

**Formule** :
```
S1 = COUNT(CeoOutboundMessage WHERE channel = EMAIL AND repliedAt IS NOT NULL AND sentAt >= NOW()-30d)
     / COUNT(CeoOutboundMessage WHERE channel = EMAIL AND status = SENT AND sentAt >= NOW()-30d)
```
**Source** : `CeoOutboundMessage` → `channel`, `repliedAt`, `sentAt`, `status`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≥ 8% | Nominal |
| Rouge | < 4% | Revoir objet + corps des 3 derniers playbooks envoyés |
| Dégradation | Drop > 3 points sur 7j | Alerte + review A/B en cours |

---

### Satellite 2 — Taux de retour site 48h post-message

**Définition** : proportion d'utilisateurs qui ont visité deviens-marrant.fr dans les 48h suivant un message CEO.

**Formule** :
```
S2 = COUNT(User WHERE lastActiveAt BETWEEN sentAt AND sentAt+48h
           AND id IN (CeoLead.userId WHERE CeoOutboundMessage.sentAt >= NOW()-30d))
     / COUNT(CeoOutboundMessage DISTINCT leadId WHERE sentAt >= NOW()-30d AND status = SENT)
```
**Source** : `User.lastActiveAt`, `CeoLead.userId`, `CeoOutboundMessage.sentAt`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≥ 15% | Nominal |
| Rouge | < 8% | Revoir la pertinence des ressources citées dans les messages |
| Dégradation | Drop > 5 points sur 7j | Alerte + check liens dans messages (broken links ?) |

---

### Satellite 3 — Taux d'ouverture emails

**Définition** : opens / emails envoyés sur 30j. Signal de qualité perçue du sujet + réputation expéditeur.

**Formule** :
```
S3 = SUM(CeoOutboundMessage.opens WHERE channel = EMAIL AND sentAt >= NOW()-30d)
     / COUNT(CeoOutboundMessage WHERE channel = EMAIL AND status = SENT AND sentAt >= NOW()-30d)
```
**Source** : `CeoOutboundMessage` → `opens`, `channel`, `sentAt` (via webhook Resend)

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≥ 40% | Benchmark qualité atteint |
| Orange | 25-39% | A/B test sur les objets (3 variantes sur 14j) |
| Rouge | < 25% | Audit réputation expéditeur + rotation objets d'email |
| Dégradation | Drop > 10 points sur 7j | Alerte spam possible — vérifier bounces + plaintes Resend |

---

## 2. KPIs opérationnels — 6 métriques supplémentaires

### OP-1 — Kill-switch trigger count (hebdo)

**Formule** : `COUNT(CeoAuditLog WHERE action = 'kill_switch_triggered' AND timestamp >= NOW()-7d)`

**Source** : `CeoAuditLog`, `CeoConfig.killSwitchReason`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | 0 / semaine | Nominal |
| Rouge | ≥ 1 / semaine | Audit cause immédiat — budget dépassé ou erreur critique |

---

### OP-2 — Gate G-CEO fail rate Director (24h)

**Formule** :
```
OP2 = COUNT(CeoOutboundMessage WHERE directorValidated = false AND directorScore < 7
            AND createdAt >= NOW()-24h)
      / COUNT(CeoOutboundMessage WHERE createdAt >= NOW()-24h)
```
**Source** : `CeoOutboundMessage.directorValidated`, `CeoOutboundMessage.directorScore`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | < 30% | Prompt nominal |
| Orange | 30-49% | Revue du prompt système par @ia |
| Rouge | ≥ 50% | Alerte — prompt a dérivé, audit immédiat avant prochain tick |

---

### OP-3 — Drafts vs auto-send ratio (hebdo par canal)

**Formule** :
```
OP3_canal = COUNT(CeoTask WHERE status = DRAFT AND channel = X AND createdAt >= NOW()-7d)
            / COUNT(CeoTask WHERE channel = X AND createdAt >= NOW()-7d)
```
**Source** : `CeoTask.status`, `CeoOutboundMessage.channel`, `CeoConfig.autoSendEmail`, `autoSendDm`

Valeurs attendues selon la semaine de déploiement :
- S1 : 100% drafts (normal)
- S3 : emails ≤ 10% drafts (les autres auto-envoyés après Director ≥ 9)
- S4 : DMs Twitter ≤ 30% drafts

Alerte si ratio drafts EMAIL > 20% en S3+ : blocage technique ou Director trop strict.

---

### OP-4 — Coût par abonné acquis via CEO (cost-per-acquired-subscriber)

**Formule** :
```
OP4 = SUM(LlmUsageLog.costEur WHERE agent = 'ceo' AND createdAt >= NOW()-30d)
      / COUNT(Subscription WHERE createdAt >= NOW()-30d
              AND userId IN (CeoLead.userId WHERE lastCeoTouchpoint >= NOW()-37d))
```
**Source** : `LlmUsageLog.costEur`, `LlmUsageLog.agent`, `Subscription.createdAt`, `User.lastCeoTouchpoint`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≤ 2,88€ (LTV pessimiste = ROI positif) | Nominal |
| Orange | 2,88-5,76€ | ROI incertain — croiser avec durée abonnement réelle |
| Rouge | > 5,76€ (LTV médiane = ROI négatif) | Réviser playbooks conversion ou réduire tokens Sonnet |

---

### OP-5 — Taux de conversion free→premium attribué CEO (30j)

**Formule** :
```
OP5 = COUNT(User WHERE plan = PREMIUM AND updatedAt >= NOW()-30d
            AND lastCeoTouchpoint >= NOW()-37d)
      / COUNT(CeoLead WHERE status IN (IN_SEQUENCE, PENDING_ACTION)
              AND updatedAt >= NOW()-30d)
```
**Source** : `User.plan`, `User.lastCeoTouchpoint`, `CeoLead.status`

KPI conséquence — pas objectif direct. Cible Phase 1 : ≥ 8% sur leads chauds (score ≥ 21).

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≥ 8% (leads score ≥ 21) | Nominal — cible phase 1 |
| Orange | 4-7% | Revoir P3 refondé + timing d'envoi |
| Rouge | < 4% | Audit scoring lead (signaux S1-S12) + révision playbooks |

---

### OP-6 — Backlinks acquis × DA moyen (mensuel)

**Formule** :
```
OP6_count = COUNT(CeoBacklink WHERE status = ACQUIRED AND acquiredAt >= NOW()-30d)
OP6_da    = AVG(CeoBacklink.da WHERE status = ACQUIRED AND acquiredAt >= NOW()-30d)
```
**Source** : `CeoBacklink.status`, `CeoBacklink.acquiredAt`, `CeoBacklink.da`

| Seuil | Valeur | Action |
|---|---|---|
| Vert | ≥ 4 backlinks/mois, DA moyen ≥ 30 | Nominal |
| Orange | 1-3 backlinks/mois OU DA < 20 | Revoir templates B-E + ciblage domaines |
| Rouge | 0 backlinks en 30j | Audit pipeline pitch + vérifier rate limits |

---

## 3. Mécanisme d'attribution MRR delta

### Tracking UTM sur tous les liens CEO

Chaque message CEO injecte des paramètres UTM sur les liens vers deviens-marrant.fr :

```
utm_source=ceo
utm_medium=email|dm_twitter|dm_linkedin|dm_instagram|comment|backlink
utm_campaign=P1|P2|P3|P4|P5|P6|P7|backlink_haro|backlink_blogger
```

Stocké sur `CeoOutboundMessage` (colonnes à créer : `utmSource`, `utmCampaign`, `utmMedium`).

### Fenêtre d'attribution

**7 jours** après le dernier touchpoint CEO sur un utilisateur (`User.lastCeoTouchpoint`).

Logique : si `Subscription.createdAt <= User.lastCeoTouchpoint + 7j` → conversion attribuée au CEO.

Fenêtre specs @product-manager citait 72h — élargie à 7j pour cohérence avec le cycle email moyen (P3.2 = J+3 après trigger). Aligner avec Thomas avant S3.

### Formule MRR delta CEO

```
MRR_delta_CEO = COUNT(Subscription WHERE createdAt >= NOW()-30d
                      AND User.lastCeoTouchpoint IS NOT NULL
                      AND User.lastCeoTouchpoint >= Subscription.createdAt - 7d)
                × 0.99  // prix premium mensuel
```
**Source** : `Subscription.createdAt`, `User.lastCeoTouchpoint`, `User.plan`

KPI conséquence à surveiller pour valider l'hypothèse pivot : si NS engagement > 25% mais MRR delta = 0 sur 60j, revoir le parcours post-engagement (accès premium mal positionné ?).

Cible 6 mois : 300 conversions × 0,99€ = **297€ MRR attribué CEO**.

---

## 4. Dashboard `/admin/ceo` — design fonctionnel

### Header (always-on, sticky)

```
[ KILL-SWITCH ✋ OFF | ON ]   Budget : 1.34€ / 2.00€ (67%)   Last tick : il y a 2h03
Auto-send : Email [S3 actif] · DM Twitter [S1 drafts] · Backlinks [S3 actif]
```

- Kill-switch toggle : rouge si `CeoConfig.enabled = false`, vert si actif. 1-clic → confirmation modal
- Barre budget jour : verte < 1.5€, orange 1.5-1.8€, rouge > 1.8€ (hard stop 4€ = `enabled = false` auto)
- Status auto-send par canal : lu depuis `CeoConfig.autoSendEmail`, `autoSendDm`, `socialOutboundEnabled`
- Last tick : `CeoMemory WHERE key = 'last_ceo_tick_at'`

---

### Vue 1 — Timeline actions 24h

**Contenu** : liste chronologique des 50 dernières `CeoOutboundMessage` + `CeoBacklink` créés/mis à jour dans les 24h.

Colonnes : horodatage · canal (icône) · playbook · statut (badge coloré) · destinataire masqué (hash) · score Director

Filtres URL-persistés : canal (ALL / EMAIL / DM_TWITTER / DM_LINKEDIN / BACKLINK) · statut (ALL / SENT / DRAFT / REJECTED)

Click sur une ligne : drawer latéral avec corps du message complet, `reasoning_short`, `citations_used`, `directorScore`, `attempts`.

Rafraîchissement : 60s polling.

---

### Vue 2 — File drafts en attente (validation 1-clic)

**Contenu** : `CeoOutboundMessage WHERE status = PENDING OR status = APPROVED AND directorValidated = false`

Groupé par playbook (P1, P2, P3... + backlinks séparés).

Pour chaque draft :
- Objet (email) ou début du corps (DM) + canal
- Score Director (badge 0-10, rouge < 7)
- Boutons : [Approuver] → `status = APPROVED` + déclenche `executeApproved()` · [Rejeter] → `status = REJECTED` + champ raison · [Éditer] → textarea inline puis re-soumission Director
- Warning si `directorValidated = false` : "Validation Director non disponible — review manuelle requise"

Indicateur en header : "14 drafts en attente" (badge orange si > 20).

---

### Vue 3 — KPIs delta 24h / 7j / 30j

Tableau 9 lignes (North Star + 3 satellites + 5 ops) :

| Métrique | Valeur 24h | 7j glissants | 30j glissants | Seuil | Tendance |
|---|---|---|---|---|---|
| NS engagement | — | 22% | 27% | ≥25% | sparkline 30j |
| S1 reply rate email | — | 6% | 9% | ≥8% | sparkline |
| S2 retour site 48h | — | 13% | 16% | ≥15% | sparkline |
| S3 open rate email | 38% | 41% | 43% | ≥40% | sparkline |
| OP1 kill-switch triggers | 0 | 0 | 1 | =0/sem | — |
| OP2 Director fail rate | 18% | 22% | 19% | <30% | sparkline |
| OP3 drafts ratio (email) | 100% | 45% | 62% | selon semaine | — |
| OP4 coût/abonné CEO | — | — | 1.62€ | ≤2.88€ | sparkline |
| OP6 backlinks acquis | 0 | 1 | 4 | ≥4/mois | cumul |

Sparklines 30 points (30j) via mini SVG. Valeurs en rouge si seuil franchi.

Source : `CeoKpiSnapshot` table (snapshot quotidien 5h UTC) jointure avec données temps réel 24h.

---

### Vue 4 — Tasks ouvertes

**Contenu** : `CeoTask WHERE status IN (PENDING, DRAFT, APPROVED, EXECUTING)`, triées par `scheduledFor ASC`.

Colonnes : type de tâche (badge) · statut · `scheduledFor` · `attempts` / 3 · payload résumé

Click : drawer avec payload JSON complet, historique des attempts, `contestedAt` si applicable.

Filtre : type (SCORE_LEADS / DRAFT_EMAIL / DRAFT_DM / DRAFT_BACKLINK_PITCH / EXECUTE_SEND / WEEKLY_REPORT)

Indicateur : "3 tasks bloquées (attempts = 3)" si `CeoTask.attempts >= 3 AND status != DONE`.

---

### Vue 5 — Backlinks (mois en cours)

**Contenu** : `CeoBacklink WHERE createdAt >= début du mois courant`

Tableau :
- Domain · URL · DA (badge couleur : rouge < 20, orange 20-40, vert > 40) · statut · pitchedAt / acquiredAt
- Totaux en pied : X pitchs · Y réponses · Z acquis · DA moyen acquis

Sparkline hebdomadaire du cumul `ACQUIRED` sur les 12 dernières semaines.

Filtre par source (HARO / BLOGGER / PODCAST / DIRECTORY / EXCHANGE).

---

### Vue 6 — Health & alerts

**Contenu** : agrégats techniques des dernières 24h.

Sections :
- **Budget LLM** : `LlmUsageLog WHERE agent='ceo' AND createdAt >= NOW()-24h` ventilé par `subAgent` (triage / draft_email / draft_social / validate / weekly). Barre 0→4€ avec zones colorées.
- **Rate limits** : pour chaque canal, consommé/max (ex: "Email : 12/50 · DM Twitter : 3/30 · Commentaires : 1/5").
- **Throttle events 24h** : `CeoAuditLog WHERE action = 'throttle_triggered' AND timestamp >= NOW()-24h` count par raison (budget / rate_limit / dedup).
- **Anomalies** : `CeoTask WHERE status = FAILED AND updatedAt >= NOW()-24h` avec `type` + résumé erreur.
- **Gate Director** : taux de passage par gate CEO (G-CEO1 catalogue / G-CEO2 valeur éducative / G-CEO3 zéro surveillance) sur 24h.

---

### Footer

Lien vers archive rapports hebdo : `CeoMemory WHERE key LIKE 'weekly_report_%'` → liste des 12 derniers rapports avec date, expandable pour lire le contenu markdown.

---

## 5. A/B testing framework

### Mécanisme

Feature flag via `CeoConfig` : champ `activeAbTest: Json?` stockant `{testId, variant, startDate, endDate}`.

Split 50/50 déterministe par `hash(userId) % 2` → variante A ou B stable par utilisateur.

Mesure sur **14 jours minimum** (sauf early-stop si North Star diverge > 15 points à 7j).

Critère gagnant : North Star 30j glissants (pas le MRR delta — trop noisy à court terme).

Garde-fou : **1 seul A/B test simultané** sauf si les dimensions sont orthogonales (ex: heure d'envoi × densité humour sont indépendants — OK en parallèle si clairement isolés). Colonne `CeoOutboundMessage.promptVersion` (string nullable) pour traçabilité.

### Tests prioritaires au lancement (mois 1)

| Priorité | Test | Variantes | Durée | Critère |
|---|---|---|---|---|
| P0 | Voix `<voix>` block — densité humour | A: 0,5 trait/msg · B: 1 trait/msg | 14j | NS engagement |
| P1 | Heure d'envoi email P1-P3 | A: 12h-14h · B: 19h-22h | 14j | S3 open rate + S1 reply |
| P2 | Pattern invitation ressource | A: verbatim étalon · B: inline lien contextualisé · C: sans lien | 21j | S2 retour site 48h |
| P3 | Prompt version P3 refondé vs P3 original | A: pivot valeur éducative · B: ancienne structure | 14j | OP5 conversion + NS |

Résultats documentés dans `CeoMemory.key = 'ab_test_results'` + section "Ce qui a bien fonctionné" du rapport hebdo.

---

## 6. Plan d'instrumentation Phase 5 — checklist @fullstack

### Prisma — colonnes à ajouter

- [ ] `User.lastCeoTouchpoint DateTime?` — mis à jour à chaque `CeoOutboundMessage.sentAt` vers cet userId
- [ ] `CeoOutboundMessage.utmSource String?` / `utmCampaign String?` / `utmMedium String?` — auto-injectés au draft
- [ ] `CeoOutboundMessage.promptVersion String?` — pour A/B testing traces
- [ ] `LlmUsageLog.traceId String?` + `subAgent String?` — déjà spécifié en architecture §6, à confirmer migration
- [ ] Table `CeoKpiSnapshot` : `{ id, date DateTime @unique, northStar Float, s1ReplyRate Float, s2ReturnRate Float, s3OpenRate Float, op2DirectorFailRate Float, op4CostPerSub Float, op6BacklinksCount Int, op6DaAvg Float, budgetEur Float, createdAt DateTime @default(now()) }`
- [ ] Middleware conversion : dans tout `User.update({ plan: PREMIUM })`, si `User.lastCeoTouchpoint IS NOT NULL AND lastCeoTouchpoint >= now()-7d` → `CeoAuditLog INSERT action='conversion_attributed'`

### Vues SQL à créer

- [ ] `vw_ceo_north_star` : agrégation 30j rolling (opens + replies + clicks) / total_sent par canal + global
- [ ] `vw_ceo_funnel` : free inscrits → leads scorés → PENDING_ACTION → SENT → CONVERTED (par mois)

### Cron à créer

- [ ] `/api/cron/ceo-kpis-snapshot` — quotidien 5h UTC, calcule les 9 KPIs et INSERT dans `CeoKpiSnapshot`
- [ ] Se déclenche après `/api/cron/daily-content` (5h-6h UTC) — ajouter dans la séquence cron Replit

### Dashboard React — composants à créer

```
apps/web/src/app/admin/ceo/
  page.tsx              — layout 6 vues + header sticky
  components/
    CeoHeader.tsx       — kill-switch toggle + budget barre + status canaux
    ActionTimeline.tsx  — liste 50 dernières actions, filtres, drawer message
    DraftQueue.tsx      — file drafts, validation 1-clic, grouping playbook
    KpiTable.tsx        — 9 KPIs × 3 périodes + sparklines SVG
    TaskList.tsx        — CeoTask ouvertes, tri scheduledFor
    BacklinkTracker.tsx — tableau CeoBacklink + DA moyen + sparkline hebdo
    HealthPanel.tsx     — budget LLM ventilé, rate limits, throttle events, fails
    WeeklyReportArchive.tsx — 12 derniers rapports expandables
```

API routes : `GET /api/admin/ceo/kpis` · `GET /api/admin/ceo/drafts` · `POST /api/admin/ceo/drafts/[id]/approve` · `POST /api/admin/ceo/drafts/[id]/reject` · `GET /api/admin/ceo/tasks` · `GET /api/admin/ceo/backlinks` · `GET /api/admin/ceo/health`

Auth : même pattern `ADMIN_PASSWORD` Bearer que `/api/admin/db`.

---

## 7. Critères qualité G23 — auto-évaluation

| Critère | Status |
|---|---|
| Chaque KPI a formule + seuil documentés | ✓ 9 KPIs complets |
| Source de données Prisma path précise | ✓ table + colonnes pour chaque KPI |
| Niveau d'agrégation explicite (24h/7j/30j) | ✓ précisé sur chaque KPI |
| Sparklines spécifiées pour tendance | ✓ Vue 3 + Vue 5 + Vue 6 |
| Attribution MRR delta avec UTM + fenêtre + formule | ✓ Section 3 |
| Dashboard 6 vues fonctionnelles minimum | ✓ Header + 6 vues + footer |
| Plan instrumentation exécutable @fullstack | ✓ Section 6 checklist |
| Minimum 9 KPIs avec formule + seuil | ✓ NS + 3 satellites + 6 ops = 10 |

---

## Handoff

---

**Handoff → @reviewer Phase 3**

Fichiers produits : `docs/analytics/ceo-kpis-dashboard.md`

Zones à challenger :
1. **Fenêtre d'attribution 7j** : specs @product-manager citaient 72h, ce doc propose 7j (aligné sur cycle P3.2 J+3). Décision Thomas requise — impact direct sur le count MRR delta (7j gonfle les chiffres vs 72h).
2. **North Star = (opens + replies + clicks) / total_sent** : les "opens" Resend sont approximatifs (pixel tracker bloqué iOS 15+). Risque de sous-comptage systématique → peut-être pondérer ou exclure opens au profit de (replies + clicks) / total_sent comme North Star primaire.
3. **Cible NS ≥ 25%** : hypothèse sans benchmark secteur email éducatif FR. Benchmark email marketing général = 20-25% open rate (différent du taux d'engagement composite). Le seuil 25% peut être trop optimiste en mois 1 — envisager cible démarrage 15% avec révision à M3.
4. **OP5 cible 8% conversion leads chauds** : provient du playbook @growth marqué [HYPOTHÈSE]. Aucune donnée réelle Marrant n'a encore validé ce chiffre. À considérer comme signal de tendance, pas seuil d'alerte opérationnel avant M2.
5. **Vue 3 sparklines** : spécifiées via `CeoKpiSnapshot`, mais la table n'existe pas encore — les 30 premiers jours, le dashboard affichera des sparklines vides ou partielles. Prévoir un fallback visuel "données disponibles à partir du J+1 de déploiement".

---

**Handoff → @fullstack Phase 5**

Fichiers à créer ou modifier :
- `apps/web/prisma/schema.prisma` : ajouter `User.lastCeoTouchpoint`, `CeoOutboundMessage.utmSource/utmCampaign/utmMedium/promptVersion`, table `CeoKpiSnapshot`
- `apps/web/src/app/admin/ceo/page.tsx` et 8 composants (liste complète section 6)
- `apps/web/src/app/api/cron/ceo-kpis-snapshot/route.ts` : cron daily 5h UTC
- `apps/web/src/app/api/admin/ceo/[...routes].ts` : 7 API routes
- Middleware conversion dans `User.update()` plan FREE→PREMIUM

P0 absolu avant S3 auto-send : colonnes UTM + `lastCeoTouchpoint` sur User + `CeoKpiSnapshot` table (sans ça, le North Star ne peut pas être calculé fiablement).

---

**Handoff → @ia v3 (si refonte prompt système A/B)**

Variantes à tester en priorité selon les KPIs :
1. Si NS < 15% à J14 : tester block `<voix>` avec densité humour réduite (0,5 trait/msg — variante A actuelle à 1 trait/msg peut saturer certains personas)
2. Si S1 reply rate < 4% : tester pattern d'invitation ressource — variante sans invitation explicite (observation pure, sans "on peut te partager") pour profils Yanis qui perçoivent l'invitation comme un CTA
3. Si OP2 Director fail rate > 50% : symptôme de dérive du prompt — revoir le bloc `<anti_patterns_bannis>` avec exemples supplémentaires tirés des rejections les plus fréquentes (les 3 anti-patterns les plus triggés dans `CeoAuditLog.action = 'director_rejected'`)
4. Le bloc `<étalons_canoniques_thomas>` est la partie du prompt la plus résistante — ne pas tester en A/B sans validation Thomas explicite (les 3 étalons sont la source de vérité voix)

---

*Produit par @data-analyst — 2026-05-06 — Phase 3*
*North Star CEO = engagement valeur éducative. MRR delta = conséquence à monitorer, jamais objectif direct.*
