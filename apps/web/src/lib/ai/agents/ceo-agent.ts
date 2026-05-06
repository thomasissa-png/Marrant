/**
 * CEO Agent — agent IA single-agent cron-based qui délivre de la valeur
 * éducative en autonomie sur email, social et presse pour deviens-marrant.fr.
 *
 * Architecture (cf docs/ia/ceo-agent-architecture.md) :
 *  - Triage (DM, mention, commentaire entrant) : Haiku 4.5 — input court, scoring binaire
 *  - Rédaction (email, DM, commentaire, pitch backlink) : Sonnet 4.6 + cache 90%
 *  - Validation : Stand-Up Director Sonnet 4.6 (réuse standup-director-agent.ts)
 *  - Rapport hebdo : Opus 4.7 (1×/sem lundi 9h)
 *
 * Le module expose les fonctions principales (signatures + corps minimum) qui
 * seront étoffées en Phase 5.B (intégrations APIs externes : Twitter v2 DM,
 * Resend Inbound, Instagram Graph) et Phase 5.C (dashboard /admin/ceo).
 *
 * Garde-fous (cf specs §5) :
 *  1. Kill-switch DB-backed (`CeoConfig.enabled`) vérifié au début de chaque tick
 *  2. Frequency cap par lead (max 2/mois segment A, 1/mois segment B)
 *  3. Anti-loop (CeoTask.attempts max 3)
 *  4. Allowlist destinataires (User en DB ou inbound récent)
 *  5. PII masking dans les logs
 *  6. Budget LLM (alerte > 3€/jour, hard stop > 4€/jour)
 *  7. Endpoint contestation art. 22 RGPD
 *  8. requiresHumanReview = true sur LinkedIn/Instagram (drafts permanents)
 */
import type { CeoLead, CeoOutboundMessage, CeoOutboundChannel } from "@prisma/client";
import { z } from "zod";
import {
  buildCachedSystemBlock,
  callWithRetry,
  extractJson,
  getResponseText,
  SONNET_MODEL,
} from "../client";
import { prisma } from "@/lib/prisma";
import {
  acquireCeoLock,
  applyFrequencyCap,
  checkAndStoreDedup,
  getCeoConfig,
  hashPii,
  isCeoEnabled,
  lookupJoke,
  lookupResource,
  maskPii,
  markCeoTouchpoint,
  recordAudit,
  releaseCeoLock,
} from "../ceo-helpers";

// ─── Modèles + constantes ─────────────────────────────────────────────

/** Haiku 4.5 — utilisé pour triage (scoring binaire input court). */
export const CEO_HAIKU_MODEL = "claude-haiku-4-5-20251001";

/** Opus 4.7 — utilisé 1x/sem pour weekly report. */
export const CEO_OPUS_MODEL = "claude-opus-4-6";

/** Caps anti-runaway. */
export const CEO_BUDGET_HARD_STOP_EUR = 4;
export const CEO_BUDGET_ALERT_EUR = 3;

/** Limites char par canal — calibrées sur étalons Thomas. */
export const CHANNEL_CHAR_LIMITS: Record<CeoOutboundChannel, number> = {
  EMAIL: 2000,
  DM_TWITTER: 270,
  DM_LINKEDIN: 1300,
  DM_INSTAGRAM: 200,
  COMMENT_TWITTER: 270,
  BACKLINK_EMAIL: 800,
};

// ─── Types ────────────────────────────────────────────────────────────

export type PlaybookId = "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7";

export interface InboundSignal {
  source: "twitter_dm" | "linkedin_mention" | "instagram_dm" | "email_inbound" | "twitter_mention";
  authorHandle: string;
  content: string;
  contextUrl?: string;
  receivedAt: Date;
}

export interface TriageResult {
  score: number; // 1-10
  topic:
    | "repartie"
    | "humour_pro"
    | "humour_quotidien"
    | "stand_up"
    | "douleur_persona"
    | "off_topic";
  intent: "question" | "demande_aide" | "compliment" | "troll" | "spam";
  shouldRespond: boolean;
  playbook: "P5" | "P6" | "ignore";
  reasoning: string;
}

export interface DraftResult {
  subject: string;
  body: string;
  reasoningShort: string;
  citationsUsed: string[];
}

export interface BacklinkOpportunity {
  id: string;
  source: "HARO" | "BLOGGER" | "PODCAST" | "DIRECTORY" | "EXCHANGE";
  query: string;
  domain: string;
  outlet?: string;
  journalistName?: string;
  deadline?: string;
  category: string;
  url?: string;
}

// ─── System prompt CEO (cf docs/ia/ceo-agent-architecture.md §3) ─────
//
// Bloc volumineux (~3 800 tokens) construit une fois au chargement du module
// pour être passé à `buildCachedSystemBlock()` → cache hit Anthropic 90%+ sur
// les call sites Sonnet du CEO. À MIGRER en bloc complet en Phase 5.A.2 — pour
// l'instant, on charge la version condensée (identité + 3 étalons + 10 règles).
//
// La version verbatim 140 lignes vit dans `docs/ia/ceo-agent-architecture.md`
// section 3 et sera collée ici une fois validée par @reviewer en Phase 5.B.
export const CEO_SYSTEM_PROMPT = `<identité>
Tu es la voix de Deviens Marrant en autonomie sur les canaux email, DM social et pitch presse. Tu n'es pas un personnage distinct, tu n'es pas "le fondateur", tu n'es pas "un agent IA". Tu es Deviens Marrant qui parle. La signature collective "L'Équipe Deviens Marrant" est la seule autorisée — jamais "Alex", jamais "agent IA Marrant", jamais "Marrant" sans "Deviens".
</identité>

<mission>
Tu délivres de la valeur éducative concrète sur l'humour et la répartie. La conversion en abonné premium est la conséquence de cette valeur, jamais l'objectif direct du message. Chaque message doit passer le test : "est-ce utile au destinataire même s'il ne clique sur rien ?" Si non, réécris.
Tu n'argumentes jamais le prix (0,99€/mois). À ce niveau, l'argumentation crée plus de friction qu'elle n'en lève.
</mission>

<voix>
Tutoiement systématique. Oral mais soigné, ni argot ni langue formelle. Phrases construites et fluides — pas hachées en deux mots. Les idées s'enchaînent par des transitions logiques.
Observation > prescription. Sobriété > saturation. 1 trait drôle bien placé pour 4-5 phrases — pas une chute par phrase.
Voix narrative compte = marque (G-S19) — anti-1ère-personne hors observation explicite sur le lecteur.
Vocabulaire prescrit : vanne, progresser, parcours, sortir une vanne, tac au tac, à la machine à café, technique, s'entraîner.
Vocabulaire banni : growth mindset, scaler, optimiser, leverage, synergies, actionnable, onboarder, valeur ajoutée, impact, challenger.
Style banni — staccato : "Court. Direct. Je clique." Banni systématiquement (gate G-S21 programmatique côté Director).
</voix>

<règles_permanentes_non_négociables>
1. SIGNATURE — Toujours "L'Équipe Deviens Marrant".
2. CITATION VANNES — Toute vanne citée DOIT venir du catalogue (lookupJoke). Tu ne fabriques jamais une vanne.
3. VOIX = MARQUE (G-S19) — Anti-1ère-personne hors observation sur le lecteur.
4. STYLE FLUIDE (G-S21) — Phrases construites, pas hachées en 2 mots.
5. PATTERN INVITATION RESSOURCE — En DM/reply, verbatim attendu : "On peut te partager X si tu as envie d'en savoir plus." Banni : "[→ lien]" inline, lien direct sans demande explicite.
6. DOCTRINE TROLL — Détaché bienveillant. Silence ou chaleur détachée brève. Banni : riposte humour qui donne l'impression d'avoir été touché.
7. CONSEILS > VANNES — La vraie valeur Deviens Marrant = conseils, vidéos décryptées, parcours.
8. AUDIENCE PAR COMPORTEMENT DB — Tu décris le destinataire par ce qu'il a fait (streak, likes, dernier login), jamais par profil persona. Les noms "Yanis", "Sophie", "Marc" sont INTERDITS dans tout contenu généré.
9. NOM MARQUE — Toujours "Deviens Marrant", jamais "Marrant" tout court. Toujours "deviens-marrant.fr" pour le domaine.
10. PRIX SANS ARGUMENTATION — À 0,99€/mois, ne jamais argumenter la valeur. Le prix est mentionné 1 fois sobrement, jamais en hook.
</règles_permanentes_non_négociables>

<output_format>
Tu réponds TOUJOURS en JSON strict :
{
  "subject": "string ≤ 50 chars (vide si pas email)",
  "body": "string — corps du message sans footer",
  "reasoning_short": "1 phrase",
  "citations_used": ["IDs vannes/ressources citées, [] si aucune"]
}
Pas de markdown autour. JSON strict uniquement.
</output_format>`;

/**
 * Bloc cacheable à passer à `buildCachedSystemBlock()` pour bénéficier du
 * prompt caching Anthropic (-90% tokens stables). Module-level constant →
 * construit une fois au chargement, réutilisé sur tous les call sites Sonnet.
 */
export const CEO_SYSTEM_CACHED_BLOCK = buildCachedSystemBlock(CEO_SYSTEM_PROMPT);

// ─── Output schemas (zod, validation stricte JSON LLM) ────────────────

const triageSchema = z.object({
  score: z.number().min(1).max(10),
  topic: z.enum([
    "repartie",
    "humour_pro",
    "humour_quotidien",
    "stand_up",
    "douleur_persona",
    "off_topic",
  ]),
  intent: z.enum(["question", "demande_aide", "compliment", "troll", "spam"]),
  should_respond: z.boolean(),
  playbook: z.enum(["P5", "P6", "ignore"]),
  reasoning: z.string(),
});

const draftSchema = z.object({
  subject: z.string().max(80).default(""),
  body: z.string().min(1),
  reasoning_short: z.string(),
  citations_used: z.array(z.string()).default([]),
});

// ─── 1. Triage inbound (Haiku 4.5) ────────────────────────────────────

/**
 * Score un signal entrant (DM, mention, commentaire) sur la pertinence
 * humour/répartie/soft skills. Si score ≥ 7 et intent ≠ spam → tâche
 * `DRAFT_DM_REPLY` créée. Si score < 7 ou spam → silence + audit.
 *
 * Modèle : Haiku 4.5 (input court, scoring binaire avec critères explicites
 * = sweet spot Haiku, 14× moins cher que Sonnet sans perte de qualité).
 */
export async function triageOpportunity(signal: InboundSignal): Promise<TriageResult> {
  const userPrompt = `Score 1-10 sur thèmes humour/répartie/soft skills + classification.
Message : ${signal.content}
Source : ${signal.source}
Auteur : ${signal.authorHandle}

JSON strict : {score:1-10, topic, intent, should_respond:bool (≥7 et ≠spam), playbook, reasoning}`;

  const response = await callWithRetry(
    {
      model: CEO_HAIKU_MODEL,
      max_tokens: 200,
      system: CEO_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    },
    2,
    { agent: "ceo", fn: "triageOpportunity" },
  );

  const text = getResponseText(response);
  const raw = extractJson<unknown>(text);
  const parsed = triageSchema.parse(raw);

  return {
    score: parsed.score,
    topic: parsed.topic,
    intent: parsed.intent,
    shouldRespond: parsed.should_respond,
    playbook: parsed.playbook,
    reasoning: parsed.reasoning,
  };
}

// ─── 2. Selection playbook (déterministe, pas de LLM) ─────────────────

/**
 * Détermine le playbook applicable pour un lead donné en fonction de ses
 * signaux DB (cf docs/growth/ceo-conversion-playbooks.md §funnel).
 *
 * Règle de priorité Phase 3 audit @reviewer : **P7 (fan) prime sur P3
 * (conversion soft)** quand les deux trigger en même temps. Valeur avant
 * conversion (cf founder-preferences.md 06/05/2026 pivot session 8).
 */
export function selectPlaybook(
  lead: CeoLead,
  signals: { streak?: number; likes?: number; lastActiveDays?: number; plan?: "FREE" | "PREMIUM" },
): PlaybookId | "skip" {
  // P7 (fan) — prioritaire si streak ≥ 7 ET likes ≥ 10
  if ((signals.streak ?? 0) >= 7 && (signals.likes ?? 0) >= 10) return "P7";

  // P4 winback — premium passé en FREE OU inactif > 30j
  if (signals.plan === "FREE" && (signals.lastActiveDays ?? 0) > 30) return "P4";

  // P3 conversion — streak ≥ 3 ET likes ≥ 5 ET FREE
  if (
    (signals.streak ?? 0) >= 3 &&
    (signals.likes ?? 0) >= 5 &&
    signals.plan === "FREE"
  ) {
    return "P3";
  }

  // P2 réactivation — inactif 7-30j
  if ((signals.lastActiveDays ?? 0) >= 7 && (signals.lastActiveDays ?? 0) <= 30) return "P2";

  // P1 welcome — créé < 24h, jamais contacté
  if (lead.touchpoints === 0) return "P1";

  return "skip";
}

// ─── 3. Composition message outbound (Sonnet + cache) ─────────────────

/**
 * Génère le corps d'un message outbound (email, DM, pitch) calibré sur la
 * voix unifiée v3 + 3 étalons Thomas. **Ne FAIT PAS l'envoi** — produit le
 * draft, l'enregistre en DB avec status PENDING, retourne l'objet pour
 * validation Director (étape suivante : `dualPassValidate`).
 *
 * Pattern obligatoire : `callWithRetry` avec `meta: { agent: "ceo", fn: ... }`
 * pour instrumentation tokens (cf usage-log.ts).
 */
export async function composeOutboundMessage(
  playbook: PlaybookId,
  lead: CeoLead,
  audience: { channel: CeoOutboundChannel; recipient: string; leadContext?: string },
): Promise<CeoOutboundMessage> {
  const charLimit = CHANNEL_CHAR_LIMITS[audience.channel];

  const userPrompt = `Playbook : ${playbook}
Canal : ${audience.channel} (limite ${charLimit} chars)
Contexte lead : ${audience.leadContext ?? "(non fourni)"}

Génère subject+body. Calibre étalon Thomas correspondant (1=DM, 2=email, 3=pitch).
${playbook === "P3" ? "P3 : limite premium JAMAIS hook — hook = constat progression, prix cité 1× sobrement en contexte.\n" : ""}${playbook === "P4" ? "P4 : zéro réduction, zéro culpabilisation. Verbatim type 'Pas de pression. Le catalogue est là si tu reviens.'\n" : ""}${playbook === "P7" ? "P7 : insight pédagogique offert directement, zéro CTA conversion.\n" : ""}
Output JSON strict, pas de markdown.`;

  const response = await callWithRetry(
    {
      model: SONNET_MODEL,
      max_tokens: 800,
      system: [CEO_SYSTEM_CACHED_BLOCK, { type: "text", text: `Lead context: ${audience.leadContext ?? ""}` }],
      messages: [{ role: "user", content: userPrompt }],
    },
    2,
    { agent: "ceo", fn: "composeOutboundMessage" },
  );

  const text = getResponseText(response);
  const raw = extractJson<unknown>(text);
  const parsed = draftSchema.parse(raw);

  // Persiste le draft. requiresHumanReview = true par défaut sur LinkedIn/Instagram
  // (drafts permanents — risque ban + zone grise ToS, cf specs §6).
  const requiresHumanReview =
    audience.channel === "DM_LINKEDIN" || audience.channel === "DM_INSTAGRAM";

  const created = await prisma.ceoOutboundMessage.create({
    data: {
      channel: audience.channel,
      direction: "OUTBOUND",
      recipient: audience.recipient,
      subject: parsed.subject || null,
      content: parsed.body,
      status: "PENDING",
      playbook,
      leadId: lead.id,
      requiresHumanReview,
      utmSource: "ceo",
      utmCampaign: playbook,
      utmMedium: audience.channel.toLowerCase().replace("dm_", ""),
    },
  });

  return created;
}

// ─── 4. Validation Director (délégué au standup-director) ─────────────

/**
 * Délègue la validation au Stand-Up Director — réuse pattern strict de
 * `validateSocialPost()`. Score ≥ 9 → APPROVED · 7-8 → NEEDS_REVISION · ≤ 6
 * → REJECTED. Si 3 rejets → `directorRewriteCeoMessage` (TODO Phase 5.B).
 *
 * Cette fonction met à jour `directorScore` + `directorValidated` + `status`
 * sur le `CeoOutboundMessage` passé en argument.
 *
 * TODO Phase 5.B : implémenter `validateCeoOutbound()` dans
 * `standup-director-agent.ts` (gate G-CEO1 anti-surveillance, G-CEO2 anti-FOMO,
 * G-CEO3 valeur éducative > conversion).
 */
export async function dualPassValidate(
  messageId: string,
): Promise<{ approved: boolean; score: number; note: string }> {
  const message = await prisma.ceoOutboundMessage.findUnique({ where: { id: messageId } });
  if (!message) throw new Error(`CeoOutboundMessage ${messageId} introuvable`);

  // Phase 5.A : placeholder — score conservateur 8 (NEEDS_REVISION) pour forcer
  // tous les drafts en review humaine jusqu'à implémentation Director Phase 5.B.
  // En production cette fonction appellera `validateCeoOutbound()` dans
  // standup-director-agent.ts avec dual-pass Haiku→Sonnet.
  const score = 8;
  const note = "Phase 5.A placeholder — validation Director CEO à implémenter en Phase 5.B";

  await prisma.ceoOutboundMessage.update({
    where: { id: messageId },
    data: {
      directorScore: score,
      directorValidated: false, // false jusqu'à validation Director réelle
      directorNote: note,
      status: score >= 9 ? "APPROVED" : "PENDING",
    },
  });

  return { approved: score >= 9, score, note };
}

// ─── 5. Rédaction pitch backlink (migration haro-agent — Phase 5.B) ────

/**
 * TODO Phase 5.B : migrer haro-agent.ts (96 topics + ALEX_BIO + templates) ici.
 * Pour l'instant : signature + corps minimum qui produit un draft basique.
 */
export async function draftBacklinkPitch(
  opportunity: BacklinkOpportunity,
): Promise<CeoOutboundMessage> {
  const userPrompt = `Opportunité presse/blog/podcast :
Source : ${opportunity.source}
Domaine : ${opportunity.domain}
${opportunity.outlet ? `Média : ${opportunity.outlet}` : ""}
${opportunity.journalistName ? `Contact : ${opportunity.journalistName}` : ""}
Question/contexte : ${opportunity.query}

Génère un pitch ≤100 mots, calibré étalon 3 Thomas (HARO journaliste).
Vouvoiement HARO/presse, tutoiement blog/podcast/annuaire.
Angle expert citable AVANT demande. Zéro "backlink"/"SEO"/"guest post".
Output JSON strict.`;

  const response = await callWithRetry(
    {
      model: SONNET_MODEL,
      max_tokens: 600,
      system: [CEO_SYSTEM_CACHED_BLOCK],
      messages: [{ role: "user", content: userPrompt }],
    },
    2,
    { agent: "ceo", fn: "draftBacklinkPitch" },
  );

  const text = getResponseText(response);
  const parsed = draftSchema.parse(extractJson<unknown>(text));

  const created = await prisma.ceoOutboundMessage.create({
    data: {
      channel: "BACKLINK_EMAIL",
      direction: "OUTBOUND",
      recipient: opportunity.domain,
      subject: parsed.subject || `Sujet ${opportunity.category}`,
      content: parsed.body,
      status: "PENDING",
      playbook: `backlink_${opportunity.source.toLowerCase()}`,
      utmSource: "ceo",
      utmCampaign: `backlink_${opportunity.source.toLowerCase()}`,
      utmMedium: "email",
      requiresHumanReview: true, // backlinks toujours en review en Phase 5.A
    },
  });

  return created;
}

// ─── 6. Boucle principale — runDailyTick ──────────────────────────────

/**
 * Entry point du cron `/api/cron/ceo-tick` (toutes 2-4h).
 * Pipeline :
 *  1. Kill-switch DB (`CeoConfig.enabled`) → return immédiat si false
 *  2. Acquisition lock global pour éviter overlap multi-worker
 *  3. Budget LLM check (CEO_BUDGET_HARD_STOP_EUR)
 *  4. Pull tasks PENDING triées par scheduledFor (max maxActionsPerTick)
 *  5. Pour chaque task : execute → log CeoAuditLog → update CeoTask.status
 *  6. Cleanup + release lock
 *
 * Idempotent par CeoTask.id. Silent-fail sur erreurs individuelles (une task
 * en échec n'arrête pas les suivantes).
 *
 * TODO Phase 5.B : implémenter le routage par CeoTaskType (DRAFT_EMAIL → ...).
 */
export async function runDailyTick(): Promise<{ status: string; processed: number; errors: number }> {
  // 1. Kill-switch
  if (!(await isCeoEnabled())) {
    console.log("[ceo-tick] Désactivé via kill-switch — return immédiat");
    return { status: "disabled", processed: 0, errors: 0 };
  }

  const cfg = await getCeoConfig();
  if (!cfg) return { status: "no_config", processed: 0, errors: 0 };

  // 2. Lock global (évite double tick concurrent)
  const tickKey = new Date().toISOString().slice(0, 13); // précision heure
  const lockAcquired = await acquireCeoLock(tickKey);
  if (!lockAcquired) {
    console.log("[ceo-tick] Lock déjà détenu — un autre worker tourne");
    return { status: "locked", processed: 0, errors: 0 };
  }

  let processed = 0;
  let errors = 0;

  try {
    // 3. Budget check (read LlmUsageLog du jour pour agent='ceo')
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const dailyCost = await prisma.llmUsageLog.aggregate({
      where: { agent: "ceo", createdAt: { gte: startOfDay } },
      _sum: { costUsd: true },
    });
    const dailyEur = (dailyCost._sum.costUsd ?? 0) * 0.92; // ~conversion USD→EUR
    if (dailyEur > CEO_BUDGET_HARD_STOP_EUR) {
      console.warn(`[ceo-tick] Budget dépassé ${dailyEur.toFixed(2)}€ > ${CEO_BUDGET_HARD_STOP_EUR}€ — skip génération`);
      await recordAudit({
        action: "tick_skip_budget",
        targetType: "system",
        targetId: "ceo-tick",
        channel: "internal",
        outcome: "skipped",
        reasoning: `daily_eur=${dailyEur.toFixed(2)}`,
      });
      return { status: "budget_exceeded", processed: 0, errors: 0 };
    }

    // 4. Pull tasks PENDING
    const tasks = await prisma.ceoTask.findMany({
      where: {
        status: "PENDING",
        scheduledFor: { lte: new Date() },
        attempts: { lt: 3 }, // anti-loop
      },
      orderBy: { scheduledFor: "asc" },
      take: cfg.maxActionsPerTick,
    });

    // 5. Execute chaque task (TODO Phase 5.B : routage par type)
    for (const task of tasks) {
      try {
        await prisma.ceoTask.update({
          where: { id: task.id },
          data: { status: "RUNNING", startedAt: new Date(), attempts: { increment: 1 } },
        });

        // Phase 5.A : placeholder — chaque type sera implémenté en 5.B
        await prisma.ceoTask.update({
          where: { id: task.id },
          data: {
            status: "DONE",
            completedAt: new Date(),
            result: { phase: "5.A", note: "task router not yet implemented" },
          },
        });

        processed++;
      } catch (err) {
        errors++;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`[ceo-tick] Task ${task.id} échec :`, maskPii(errMsg));
        await prisma.ceoTask
          .update({
            where: { id: task.id },
            data: {
              status: task.attempts + 1 >= 3 ? "FAILED" : "PENDING",
              errorMessage: errMsg.slice(0, 500),
            },
          })
          .catch(() => undefined);
      }
    }

    return { status: "ok", processed, errors };
  } finally {
    await releaseCeoLock(tickKey);
  }
}

// ─── 7. Rapport hebdo Thomas (Opus 4.7, lundi 9h) ─────────────────────

/**
 * Génère et envoie le rapport hebdomadaire au fondateur.
 * Structure 4 sections fixes (cf docs/strategy/ceo-agent-scope.md Q8) :
 *   1. KPIs delta 7j (tableau markdown)
 *   2. Ce qui a bien fonctionné (2-3 exemples)
 *   3. Ce qui n'a pas fonctionné (1-2 obs sobres)
 *   4. 1 observation pédagogique (signal faible audience)
 *
 * Modèle : Opus 4.7 (qualité > coût pour 1 appel/sem). Coût attendu ~0.16€/sem.
 *
 * TODO Phase 5.B : implémenter envoi Resend + agrégation KPIs depuis
 * CeoKpiSnapshot des 7 derniers jours.
 */
export async function runWeeklyReport(weekStartDate: Date): Promise<{ sent: boolean }> {
  if (!(await isCeoEnabled())) return { sent: false };

  // Aggregate KPIs des 7 derniers jours depuis CeoKpiSnapshot
  const snapshots = await prisma.ceoKpiSnapshot.findMany({
    where: { date: { gte: weekStartDate } },
    orderBy: { date: "asc" },
  });

  const userPrompt = `Rapport hebdo CEO Deviens Marrant — semaine du ${weekStartDate.toISOString().slice(0, 10)}.
Données : ${JSON.stringify({
    snapshots: snapshots.length,
    avgEngagement30d:
      snapshots.length > 0
        ? snapshots.reduce((a, s) => a + s.northStarEngagement30d, 0) / snapshots.length
        : 0,
    conversionsAttribuees: snapshots.reduce((a, s) => a + s.ceoAttributedConversions, 0),
    backlinksDaSum: snapshots.length > 0 ? snapshots[snapshots.length - 1].backlinksDaSum : 0,
  })}

Structure verbatim :
1. KPIs delta 7j (tableau markdown)
2. Ce qui a bien fonctionné (2-3 exemples)
3. Ce qui n'a pas fonctionné (1-2 obs sobres)
4. 1 observation pédagogique (signal faible audience)

Ton sobre, factuel, zéro édito narratif. Output : markdown brut.`;

  const response = await callWithRetry(
    {
      model: CEO_OPUS_MODEL,
      max_tokens: 2000,
      system: CEO_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    },
    2,
    { agent: "ceo", fn: "runWeeklyReport" },
  );

  const reportMarkdown = getResponseText(response);

  // TODO Phase 5.B : envoyer via Resend à alex@deviens-marrant.fr
  // Pour l'instant, on log + stocke dans CeoMemory pour relecture admin.
  const { setCeoMemory } = await import("../ceo-helpers");
  await setCeoMemory("weekly_report", `last_${weekStartDate.toISOString().slice(0, 10)}`, {
    weekStart: weekStartDate.toISOString(),
    markdown: reportMarkdown,
    generatedAt: new Date().toISOString(),
  });

  console.log(`[ceo-weekly] Rapport généré ${weekStartDate.toISOString().slice(0, 10)} — ${reportMarkdown.length} chars`);

  return { sent: false }; // false jusqu'à implémentation Resend Phase 5.B
}

// ─── Exports utilitaires ──────────────────────────────────────────────

// Re-export des helpers pour faciliter les imports depuis l'extérieur du module.
export {
  applyFrequencyCap,
  checkAndStoreDedup,
  hashPii,
  isCeoEnabled,
  lookupJoke,
  lookupResource,
  maskPii,
  markCeoTouchpoint,
  recordAudit,
};
