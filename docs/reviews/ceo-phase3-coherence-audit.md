# Audit cohérence Phase 3 — CEO Agent Deviens Marrant

> Version 1.0 — 2026-05-06 — @reviewer
> Inputs : `ceo-agent-specs.md` (@PM), `ceo-agent-architecture.md` (@ia v2), `ceo-kpis-dashboard.md` (@data-analyst), `ceo-agent-scope.md` v2 + `ceo-voice-unified.md` v3 (briefs source de vérité)
> Mission : détecter contradictions/incohérences/gaps **avant** Phase 4 (création .md) et Phase 5 (implémentation).

---

## 1. Tableau des contradictions / incohérences détectées

| # | Sujet | Livrable A dit | Livrable B dit | Sévérité | Résolution proposée |
|---|---|---|---|---|---|
| 1 | **Fenêtre attribution conversion** | @PM Handoff @data-analyst : "fenêtre 72h" | @data-analyst §3 : "7 jours après dernier touchpoint" | **BLOQUANT** | Trancher avec Thomas. Reco @reviewer : **7j** (cohérent avec cycle P3.2 J+3 + benchmarks email FR). Mettre à jour @PM specs ligne 503 + @data-analyst §3 + le note "élargie à 7j pour cohérence". |
| 2 | **Modèle `CeoKpiSnapshot`** | @PM §2 : 6 modèles métier + 3 auxiliaires (CeoDedup, CeoAuditLog, CeoCommentBlacklist) — pas de CeoKpiSnapshot | @data-analyst §6 + Vue 3 : `CeoKpiSnapshot` requis pour sparklines 30j | **HAUTE** | Ajouter `CeoKpiSnapshot` aux specs Prisma @PM §2 (table snapshot quotidien — schéma défini @data-analyst §6). Patch @PM ou @orchestrator direct. |
| 3 | **Colonnes UTM sur CeoOutboundMessage** | @PM §2 modèle CeoOutboundMessage : pas de utmSource/utmCampaign/utmMedium | @data-analyst §3 + §6 : "à créer : utmSource, utmCampaign, utmMedium" + promptVersion | **HAUTE** | Ajouter 4 colonnes au modèle CeoOutboundMessage @PM §2. Cohérent avec attribution UTM décrite. |
| 4 | **Champ `User.lastCeoTouchpoint`** | @PM : non mentionné dans schéma | @data-analyst §6 : User.lastCeoTouchpoint requis pour OP4/OP5/MRR delta | **HAUTE** | Ajouter migration `User.lastCeoTouchpoint DateTime?` aux specs @PM. Sinon le North Star MRR delta n'est pas calculable. |
| 5 | **Conflit P3 vs P7 (streak ≥ 3 + likes ≥ 5)** | @PM Handoff @reviewer ligne 545 : signalé comme à résoudre | @ia §3 ligne 132 + Handoff @reviewer ligne 365 : "à résoudre côté `selectPlaybook()` orchestrateur. P7 doit primer" | **MOYENNE** | Documenter la règle de priorité dans @PM §3 fonction `ceoTick()` : `if (signals.streak≥3 && signals.likes≥5) → P7 prime over P3`. Pas de désaccord sur le verdict (P7 prime), juste manque d'inscription dans les specs. |
| 6 | **Outil `lookupJoke()` / `lookupResource()`** | @PM : non modélisé, non mentionné | @ia §3 ligne 122 + Handoff @fullstack : `lookupJoke(category, persona)` + `lookupResource(topic)` requis P0 | **HAUTE** | Ajouter section §3.bis "Outils disponibles à l'agent" dans specs @PM avec signatures + tables consultées (Joke, BlogArticle, LearningPath). Sans cet outil, hallucination vannes inévitable. |
| 7 | **Mention IA dans la signature** | @scope.md ligne 101 : "à arbitrer Phase 2" / @PM Handoff ligne 548 : "décision Thomas requise avant S3 (défaut = OUI EU AI Act art.52)" | @ia §3 règle 1 ligne 120 : "Toujours 'L'Équipe Deviens Marrant'. Jamais 'agent IA'... Si exigée @legal, va dans le footer légal — jamais dans le corps signataire." | **MOYENNE** | @ia a tranché techniquement (footer-only). Faire valider par Thomas comme décision binaire et inscrire dans `project-context.md`. Le défaut "footer uniquement" me semble la seule solution compatible avec la voix marque. |
| 8 | **Signal S3 (limite blagues touchée)** | @PM Handoff ligne 544 : "front signal non DB-persistant — vérifier avec @fullstack comment tracker côté serveur" | @ia : non adressé | **MOYENNE** | À résoudre en Phase 5 par @fullstack (option : tracker via event analytics → table SignalEvent). Ne bloque pas Phase 4. |
| 9 | **Flag `CeoTask.requiresHumanReview`** | @PM §6 : critère S3 = "50 drafts sans correction majeure" = flag requiresHumanReview | @PM §2 modèle CeoTask : flag absent du schéma | **MOYENNE** | Ajouter `requiresHumanReview Boolean @default(false)` au modèle CeoTask @PM §2. Auto-fix possible par @orchestrator. |
| 10 | **Modèles LLM cohérence** | @PM §1 : Haiku 4.5 triage + Sonnet 4.6 rédaction + Opus 4.7 weekly | @ia §2 : identique + détail tarifs/cache | **PASS** | Cohérent. Aucune action. |
| 11 | **Coût LLM** | @scope.md : cap 2€/j, estimé 1.35€/j | @ia §2 : 1.34€/j (-33% sous cap) | **PASS** | Cohérent. Marge confirmée. |
| 12 | **Suppression haro-agent.ts** | @scope.md Q10 iii (Thomas tranché) + @PM §9 plan migration | @ia §3 ligne 286 : pas de mention résiduelle / Handoff P2 mois 2 | **PASS** | Cohérent. |
| 13 | **Cibles NS / OP5** | @scope.md : open rate > 40%, 300 abonnés à 6 mois | @data-analyst : NS ≥ 25% engagement composite + cible 297€ MRR | **MINEUR** | @data-analyst Handoff signale "cible NS ≥ 25% sans benchmark secteur, peut-être trop optimiste mois 1, démarrer 15% révision M3". Documenter dans le rapport hebdo M1. |
| 14 | **Gates G-CEO Director** | @PM §3 : `validateCeoOutbound` mentionne valeur éducative + zéro surveillance + zéro FOMO | @ia Handoff P0 : "G-CEO1 catalogue lookup + G-CEO2 valeur éducative + G-CEO3 zéro surveillance" | **MINEUR** | Cohérent dans l'esprit, mais @ia donne un naming explicite (G-CEO1/2/3). Adopter ce naming dans @PM §3 + section tests. |

**Synthèse** : 1 BLOQUANT, 4 HAUTES, 4 MOYENNES, 5 PASS/MINEURS.

---

## 2. Gaps détectés

- **Outils LLM (`lookupJoke`, `lookupResource`)** : aucune spec @PM ne les modélise. Sans eux, règle 2 du prompt (hallucination de vannes) ne tient pas. **À ajouter avant Phase 4.**
- **Migration table `CeoKpiSnapshot`** : absente du plan migration @PM §2 + Handoff P0 @fullstack. Vue 3 dashboard inutilisable sans cette table.
- **Mécanisme tracking signal S3** (limite blagues atteinte) : signal client-only — aucun mécanisme serveur défini. Sans persistance, scoring lead S1-S12 incomplet.
- **Test Director sur les 16 exemples canoniques** : @ia Handoff §1 recommande "tester sur 16 exemples avant déploiement, scoring ≥ 8/10, si < 5/16 match → revoir prompt". Ce test n'est pas dans le plan tests Jest @PM §8. **À ajouter en `ceo-prompt-calibration.test.ts`.**
- **Flag `requiresHumanReview` sur CeoTask** : critère de passage S2→S3 "50 drafts sans correction majeure" repose dessus, mais pas modélisé.
- **Endpoint `/api/admin/ceo/*` API routes** : @data-analyst §6 liste 7 routes, @PM ne les mentionne pas. Cohérence fonctionnelle OK mais à inscrire en Handoff @fullstack consolidé.
- **Décision `CeoConfig.killSwitchReason = "budget_hard_stop"` auto à 4€/j** : @ia §6 propose hard stop auto, @PM §5 dit "hard stop 4€/j" sans détailler le mécanisme auto-disable. Cohérent à 99%, à clarifier en Phase 5.

---

## 3. Cohérence avec briefs source de vérité

- **3 étalons Thomas intégrés dans prompt @ia** : ✅ Étalon 1 (DM Twitter), Étalon 2 (Welcome), Étalon 3 (HARO) tous présents verbatim dans `<étalons_canoniques_thomas>` (lignes 90-117 architecture). PASS.
- **Pivot agent valeur éducative** : ✅ Aucune mention "convert/conversion" comme objectif direct dans les fonctions @PM ou prompt @ia. P3 "Conversion soft" gardé en nom mais comportement refondu (limite premium = contexte factuel, pas hook). Cohérent avec scope Q6 + Q8.
- **10 règles permanentes** : ✅ Toutes présentes dans `<règles_permanentes_non_négociables>` @ia §3. Conformes à scope.md + voice-unified.md.
- **North Star valeur éducative mesurable** : ✅ KPIs @data-analyst (NS 30j = opens+replies+clicks/total_sent) cohérent avec scope Q6. MRR delta = KPI conséquence comme tranché. PASS.
- **Phrase de mission v3** : ✅ Reprise verbatim @ia ligne 65 + cohérente avec @PM §1.
- **Réserve** : @data-analyst Handoff signale risque "opens Resend approximatifs (pixel bloqué iOS 15+)". Réel. Solution : pondérer NS = (replies+clicks)*2 + opens (replies/clicks pèsent plus). À trancher Phase 5.

---

## 4. Priorité des résolutions

**BLOQUANT (résoudre avant Phase 4)** :
- Contradiction #1 : fenêtre attribution 72h vs 7j — impacte directement les KPIs MRR et la formule Subscription.

**HAUTE (résoudre avant Phase 5 — patch @PM)** :
- #2 ajouter `CeoKpiSnapshot` au schéma Prisma
- #3 ajouter colonnes UTM + promptVersion sur CeoOutboundMessage
- #4 ajouter `User.lastCeoTouchpoint`
- #6 ajouter section "Outils LLM" (`lookupJoke`, `lookupResource`)

**MOYENNE (clarifier Phase 5)** :
- #5 P7 prime sur P3 (inscrire dans `selectPlaybook()`)
- #7 mention IA = footer-only (faire valider Thomas + inscrire project-context.md)
- #8 tracking signal S3 (mécanisme serveur)
- #9 flag `requiresHumanReview`

**BASSE (monitorer post-prod)** :
- #13 cible NS 25% trop optimiste mois 1 → démarrer 15% rev M3
- Test Director 16 exemples canoniques (à ajouter au plan tests)

---

## 5. Recommandations actionnables pour @orchestrator

1. **Patch @PM direct par orchestrator** (gains de temps, pas de réinvocation) : appliquer #2, #3, #4, #6, #9 sur `ceo-agent-specs.md`. Ce sont des additions de modèles/colonnes/sections, pas des changements de logique. Compter ~30 lignes de patch.
2. **Décision Thomas requise avant Phase 4** : un seul arbitrage = **fenêtre attribution conversion 72h ou 7j ?** (contradiction #1). Pas une question de copy ou de stratégie — une convention de mesure. Reco @reviewer : 7j.
3. **Mention IA dans signature** (#7) : décision binaire faisable par Thomas, mais @ia a déjà tranché techniquement (footer-only). Soumettre comme "validation par défaut" — Thomas peut juste dire OK ou override.
4. **Pas besoin de réinvoquer @PM, @ia ou @data-analyst** : les 4 livrables sont solides individuellement. Les contradictions sont des oublis de cross-référence, pas des désaccords stratégiques. Patches surface, pas refonte.
5. **Ajouter en Phase 4** : générer `.claude/agents/ceo.md` + créer `ceo-prompt-calibration.test.ts` (test sur 16 exemples canoniques avec seuil Director ≥ 8/10).

---

## 6. Verdict global

**GO Phase 4 avec correctifs précis** (orchestrator les applique seul sur @PM specs).

Conditions GO :
- Patch @PM appliqué (HAUTES #2, #3, #4, #6, #9 — édits directs orchestrator)
- Thomas tranche fenêtre attribution 72h vs 7j (BLOQUANT #1)
- Thomas valide mention IA = footer-only (MOYENNE #7, défaut OK)

Verdict détaillé :
- Cohérence inter-livrables : 9/14 PASS, 5 contradictions actionnables — pas de désaccord stratégique de fond
- Cohérence avec scope.md + voice-unified.md : 5/5 PASS
- Architecture techniquement implémentable : OUI, sous réserve des 4 patches HAUTES
- Risque fond inventé : NUL (tarifs LLM sourcés anthropic.com, attribution 7j justifiée par cycle email)

---

## Handoff

---

**Handoff → @orchestrator**

Fichiers produits : `docs/reviews/ceo-phase3-coherence-audit.md`

Actions immédiates par priorité :
1. **Avant Phase 4** : appliquer 5 patches HAUTES sur `docs/product/ceo-agent-specs.md` (CeoKpiSnapshot, UTM colonnes, lastCeoTouchpoint, lookupJoke/lookupResource section, requiresHumanReview flag). Édits directs orchestrator, pas de réinvocation @PM.
2. **Soumettre Thomas (gate fondateur Phase 3)** : voir bloc ci-dessous (1 question bloquante + 1 validation par défaut).
3. **GO Phase 4** dès #1 et #2 traités → @agent-factory pour génération `.claude/agents/ceo.md`.
4. **Phase 5** : ajouter au plan @fullstack le test `ceo-prompt-calibration.test.ts` (16 exemples canoniques × Director ≥ 8/10) + tracking serveur signal S3.

Décisions prises : GO Phase 4 conditionnel · 14 sujets vérifiés · 1 BLOQUANT à arbitrer Thomas · 4 HAUTES à patcher orchestrator.

Points d'attention : aucune contradiction stratégique de fond — uniquement des oublis de cross-référence entre les 4 livrables. Les 4 agents ont produit du solide.

---

**Handoff → Thomas (gate fondateur Phase 3) — 2 questions tranchantes**

1. **Fenêtre d'attribution conversion CEO → premium** : 72h (specs @PM) ou 7 jours (KPIs @data-analyst) ? Reco @reviewer : **7j** — cohérent avec ton cycle email P3.2 (J+3) et benchmarks email FR. Impact direct sur le compteur MRR delta.
2. **Mention "agent IA" dans signature email** : @ia recommande **footer légal uniquement** (jamais dans le corps signataire qui reste "L'Équipe Deviens Marrant"), conforme EU AI Act art. 52. OK pour défaut footer-only ou veux-tu mentionner "agent IA" dans le corps ?

Si OK sur les 2 → GO Phase 4 immédiat.

---

*Produit par @reviewer — 2026-05-06 — Phase 3*
*14 sujets audités · 1 BLOQUANT · 4 HAUTES · 4 MOYENNES · 5 PASS · GO Phase 4 conditionnel*
