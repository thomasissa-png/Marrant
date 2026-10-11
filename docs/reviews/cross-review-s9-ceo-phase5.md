# Cross-review s9 — CEO Phase 5.A + 5.B + audit @legal

> **Mode** : audit orchestrator direct (commandement n°4 exception "maintenance gouvernance"). @reviewer dédié a timeout (stream idle après 31 lectures sans Write persistant). Audit ciblé sur BLOQUANTS critiques uniquement, pas exhaustif sur les 8 volets initialement prévus.
>
> **Date** : 06/05/2026 — session 9 — branche `claude/marrant-s9-conformite-gouvernance-zwLbC`
> **Commits review** : `e8a33dc` (@legal) + `316aee3` (Phase 5.A) + `c90bbc3` (Phase 5.B)

---

## TL;DR

**Verdict : GO Phase 5.B.2 + 5.C + 5.D** — les 4 BLOQUANTS critiques sont résolus côté code. 1 risque MOYEN identifié (regex G-CEO3 faux positifs), 0 BLOQUANT, 0 HAUTE.

Les actions Thomas restantes sont toutes hors-code (signatures DPA, secrets Replit, redéploiement).

---

## 1. Statut des 3 BLOQUANTS @legal s9 côté code

| BLOQUANT | Action requise | Statut |
|---|---|---|
| #1 DPA Resend | Signer dashboard `resend.com/legal/dpa` | ⏳ Action manuelle Thomas (pas du code) |
| #2 Compte Anthropic plan commercial | Vérifier dashboard | ⏳ Action manuelle Thomas (pas du code) |
| **#3 `enforceEmailFooter()` activé côté code** | Câblé AVANT validation Director | ✅ **RÉSOLU** |

**Vérifications #3** (`ceo-agent.ts`) :
- L52 : import `enforceEmailFooter` from `@/lib/email/ceo-email-footer`
- L338 : `finalBody = enforceEmailFooter(parsed.body, audience.recipient)` — appliqué dans `composeOutboundMessage` AVANT `dualPassValidate`
- L454 : appliqué dans `draftBacklinkPitch` (2e fonction de génération outbound)

**Vérifications footer** (`ceo-email-footer.ts`) :
- L10 : footer comporte adresse postale + lien désinscription 1-clic + mention CPCE L34-5 + lien politique de confidentialité
- L42 : `generateUnsubscribeToken()` utilise HMAC-SHA256
- L24 : check `UNSUBSCRIBE_HMAC_SECRET` ≥ 32 chars (sinon throw — fail-safe)
- L57 : `verifyUnsubscribeToken()` roundtrip OK

**Vérifications endpoint /unsubscribe** (`apps/web/src/app/api/unsubscribe/route.ts`) :
- L23 : `verifyUnsubscribeToken(token)` — set null si invalid
- L38 : `update User.emailOptOut = true`

→ Conformité RGPD art. 21 (droit d'opposition) + CPCE L34-5 (lien désinscription 1-clic) **OK**.

---

## 2. Garde-fous `runDailyTick` — ordre d'exécution

| # | Garde-fou | Ligne | Statut |
|---|---|---|---|
| 1 | Kill-switch (`getCeoConfig()` + `cfg.enabled`) | L497 | ✅ Premier check |
| 2 | Lock global tick (`acquireCeoLock(hourKey)`) | L506 | ✅ Anti-double-tick |
| 3 | Budget cap hard-stop 4€/j via `LlmUsageLog` aggregate | L515-535 | ✅ Avant tout appel LLM |
| 4 | Anti-loop `attempts < 3` sur tasks | L542 | ✅ Cohérent specs |

**Verdict** : ordre conforme à `ceo-agent-specs.md` section "Garde-fous". Audit log écrit en cas de skip budget (L519).

---

## 3. Gates G-CEO1/2/3/4 dans Director

`standup-director-agent.ts` L2486 — `runCeoOutboundGates()` :

| Gate | Implémentation | Verdict |
|---|---|---|
| **G-CEO1** Signature équipe | L2475 regex `/L'Équipe Deviens Marrant/i` + interdit `/\b(Alex\|Alexandre)\b/m` (sécurité override) | ✅ Conforme founder-prefs s8 |
| **G-CEO2** Zéro persona | L2506 réutilise `INTERNAL_PERSONA_NAMES` (Yanis/Sophie/Marc) | ✅ Cohérent avec gates blog/social existants |
| **G-CEO3** Zéro mention IA | L2479 regex large : `(IA\|intelligence artificielle\|agent IA\|LLM\|GPT\|Claude\|ChatGPT\|automatisation\|bot)` + `propulsé par`/`powered by AI` | ⚠️ Voir risque #1 ci-dessous |
| **G-CEO4** Pattern invitation ressource | L2529 (BONUS — pas dans brief initial, ajouté @fullstack) | ✅ Bonus voix Marrant |

---

## 4. Risques identifiés

### Risque MOYEN #1 — G-CEO3 faux positifs

La regex AI_MENTIONS contient `\b(automatisation\|bot)\b`. Cas problématiques possibles :
- "Le **bot** Slack de l'équipe" → REJECTED (faux positif léger)
- "Notre démarche d'**automatisation** des process" → REJECTED (faux positif moyen)

**Mitigation proposée** : pas de correctif urgent. Si Thomas remonte un cas concret de blocage légitime, ajouter une whitelist contextuelle. Note Phase 5.D : ajouter test unitaire qui vérifie qu'**"humour intelligent"** ne match PAS (déjà OK car `\b` boundaries).

### Risque MINEUR #2 — Token HMAC sans expiration

Décision @fullstack documentée : "un email lu 6 mois plus tard doit pouvoir désinscrire — anti-tampering, pas anti-replay". Acceptable mais : si la clé `UNSUBSCRIBE_HMAC_SECRET` fuit, désinscriptions anonymes possibles → **réinitialiser la clé invalide tous les tokens existants** (impact : un user qui clique sur un vieil email aura un 410). Documenter dans `REPLIT_ACTIONS.md` que la rotation de clé = invalidation des liens.

### Risque MINEUR #3 — `dualPassValidate` Haiku ne bénéficie pas du cache

Cf Phase 5.A note : `DIRECTOR_IDENTITY_CACHED_BLOCK` ~1278 tokens, sous le minimum cache Haiku 2048t. Pas bloquant — gain prix brut Haiku 14× compense. Phase 5.D : ajouter un test qui confirme cache hit Sonnet (Pass 2 borderline).

---

## 5. Cohérence specs PM vs code

Vérifié par grep, pas par audit ligne-à-ligne :
- ✅ 11 modèles Prisma livrés (specs en demandaient 9 + 2 auxiliaires) — 2 modèles bonus : `CeoTopic`, `SocialPostDailyLock` (P1 race condition s08/04)
- ✅ Architecture multi-modèle conforme (Haiku triage / Sonnet rédaction + cache / Opus weekly)
- ✅ Pattern `callWithRetry({ meta: { agent: "ceo", fn } })` appliqué (instrumentation tokens visible J1 dans `/api/admin/llm-usage`)
- ✅ Colonnes UTM sur `CeoOutboundMessage` + `User.lastCeoTouchpoint` ajouté
- ✅ Priorité P7 > P3 codée dans `selectPlaybook` (audit @reviewer Phase 3 résolu)
- ✅ `requiresHumanReview = true` par défaut sur LinkedIn/Instagram + tous backlinks Phase 5.A

**Non vérifié exhaustivement** : 13 décisions autorisées/non-autorisées, 16 exemples canoniques v6 utilisés en few-shot dans le prompt. À couvrir Phase 5.D tests.

---

## 6. Performance des agents (notes 1-5)

| Agent | Date | Livrable | Spécificité | Notes |
|---|---|---|---|---|
| @legal | 06/05 | docs/legal/ceo-dpa-audit-s3.md (390L) | 5 | 4 volets + 13 actions priorisées + sources sourcées (12 URLs) |
| @fullstack Phase 5.A | 06/05 | 11 modèles + ceo-agent.ts core (1844L) | 5 | Migration idempotente + lookupJoke sécurisé sans $queryRawUnsafe |
| @fullstack Phase 5.B | 06/05 | 5 endpoints + Director CEO + footer (1461L) | 5 | enforceEmailFooter idempotent + token HMAC + 2 locks distincts |
| @reviewer cross-review | 06/05 | TIMEOUT (aucun output persistant) | N/A | Stream idle après 31 lectures — scope trop large |

---

## 7. Récap actions priorisées

| Priorité | Action | Owner | Délai |
|---|---|---|---|
| **HAUTE** | Pre-commit check `npx tsc --noEmit && npx next lint && npm run build` sur Replit | Thomas | Avant push prod |
| **MOYENNE** | Documenter rotation `UNSUBSCRIBE_HMAC_SECRET` = invalide tous tokens existants | @fullstack ou orchestrator (édit REPLIT_ACTIONS.md) | Phase 5.B.2 |
| **MOYENNE** | Tests unitaires anti-faux-positifs G-CEO3 ("humour intelligent" ne match pas) | @qa Phase 5.D | Phase 5.D |
| **MINEURE** | Whitelist contextuelle G-CEO3 si Thomas remonte un cas concret | @fullstack si remonté | Sur demande |

**Aucun BLOQUANT** détecté. **Aucune contradiction inter-livrables** majeure.

---

## 8. Verdict & Handoff

**GO Phase 5.B.2 + 5.C + 5.D** sans corrections préalables.

**Recommandations pour la suite de session 9 (autopilot)** :
1. **Phase 5.B.2** (intégrations APIs externes) — Twitter v2 DM + Resend Inbound webhook + Instagram Graph + suppression `haro-agent.ts` + remplacement scraping → RSS/Zapier (reco @legal). **Lancer en background.**
2. **Phase 5.C** (dashboard React `/admin/ceo` 8 composants) — peut tourner en parallèle de 5.B.2 (frontend ≠ backend, pas d'overlap fichiers). **Lancer en background.**
3. **Phase 5.D** (tests Jest exhaustifs) — APRÈS 5.B.2 et 5.C complétés (couvrir le code final). À séquencer.

**Risque session 9** : volume de code produit en 1 session (~3700 lignes nettes hors gouvernance) augmente le coût d'un éventuel rollback si bug structurel. Mitigation : chaque sous-phase commitée séparément (déjà fait), Thomas peut `git reset` à un commit intermédiaire si besoin.
