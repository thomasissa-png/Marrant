import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../_helpers";

/**
 * GET /api/admin/ceo/data
 *
 * Agrège toutes les données nécessaires au dashboard /admin/ceo en un seul appel :
 * config, dernier snapshot KPI, history 30j, tasks récentes, drafts à valider,
 * funnel 30j, backlinks, audit log (100 derniers).
 *
 * Auth : Bearer ADMIN_PASSWORD.
 */
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    config,
    lastSnapshot,
    kpiHistory,
    tasksRaw,
    draftsRaw,
    funnelAgg,
    conversionsCount,
    siteVisits,
    backlinksRaw,
    auditLogRaw,
  ] = await Promise.all([
    prisma.ceoConfig.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.ceoKpiSnapshot.findFirst({ orderBy: { date: "desc" } }),
    prisma.ceoKpiSnapshot.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      orderBy: { date: "asc" },
      take: 30,
    }),
    prisma.ceoTask.findMany({ orderBy: { scheduledFor: "desc" }, take: 100 }),
    prisma.ceoOutboundMessage.findMany({
      where: {
        OR: [{ status: "PENDING" }, { requiresHumanReview: true }],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.ceoOutboundMessage.aggregate({
      where: { sentAt: { gte: thirtyDaysAgo, not: null }, status: "SENT" },
      _count: { _all: true },
      _sum: { opens: true, replies: true, clicks: true },
    }),
    // Conversions PREMIUM attribuées (utm_source = "ceo" + sentAt 30j)
    prisma.ceoOutboundMessage.count({
      where: {
        sentAt: { gte: thirtyDaysAgo, not: null },
        utmSource: "ceo",
        // proxy : on compte les leads marqués CONVERTED
        lead: { is: { status: "CONVERTED" } },
      },
    }),
    // Site visits 48h post-message — proxy via lead.user.lastActiveAt
    prisma.ceoLead.count({
      where: {
        lastContactAt: { gte: thirtyDaysAgo },
        user: {
          is: { lastActiveAt: { gte: thirtyDaysAgo } },
        },
      },
    }),
    prisma.ceoBacklink.findMany({
      orderBy: [{ status: "asc" }, { da: "desc" }],
      take: 200,
    }),
    prisma.ceoAuditLog.findMany({ orderBy: { timestamp: "desc" }, take: 100 }),
  ]);

  // Funnel
  const sent = funnelAgg._count._all;
  const opens = funnelAgg._sum.opens ?? 0;
  const replies = funnelAgg._sum.replies ?? 0;
  const clicks = funnelAgg._sum.clicks ?? 0;
  const safeRate = (n: number) => (sent === 0 ? 0 : n / sent);

  const funnel = {
    sent,
    opens,
    replies,
    clicks,
    siteVisits,
    conversions: conversionsCount,
    openRate: safeRate(opens),
    replyRate: safeRate(replies),
    clickRate: safeRate(clicks),
    visitRate: safeRate(siteVisits),
    conversionRate: safeRate(conversionsCount),
  };

  // Tasks → DTO avec payloadSummary lisible
  const tasks = tasksRaw.map((t) => ({
    id: t.id,
    type: t.type,
    status: t.status,
    scheduledFor: t.scheduledFor.toISOString(),
    attempts: t.attempts,
    errorMessage: t.errorMessage,
    createdAt: t.createdAt.toISOString(),
    startedAt: t.startedAt?.toISOString() ?? null,
    completedAt: t.completedAt?.toISOString() ?? null,
    payloadSummary: summarizePayload(t.payload),
  }));

  // Drafts → masquer recipient (PII) sauf premiers caractères
  const drafts = draftsRaw.map((d) => ({
    id: d.id,
    channel: d.channel,
    recipient: maskRecipient(d.recipient),
    subject: d.subject,
    content: d.content,
    status: d.status,
    directorScore: d.directorScore,
    directorValidated: d.directorValidated,
    directorNote: d.directorNote,
    requiresHumanReview: d.requiresHumanReview,
    playbook: d.playbook,
    createdAt: d.createdAt.toISOString(),
  }));

  const backlinks = backlinksRaw.map((b) => ({
    id: b.id,
    source: b.source,
    domain: b.domain,
    url: b.url,
    pageTitle: b.pageTitle,
    da: b.da,
    status: b.status,
    pitchedAt: b.pitchedAt.toISOString(),
    repliedAt: b.repliedAt?.toISOString() ?? null,
    acquiredAt: b.acquiredAt?.toISOString() ?? null,
    daysSincePitched: Math.max(
      0,
      Math.floor((now.getTime() - b.pitchedAt.getTime()) / (1000 * 60 * 60 * 24))
    ),
  }));

  const auditLog = auditLogRaw.map((l) => ({
    id: l.id,
    timestamp: l.timestamp.toISOString(),
    action: l.action,
    targetType: l.targetType,
    channel: l.channel,
    outcome: l.outcome,
    reasoning: l.reasoning,
    aiDecisionScore: l.aiDecisionScore,
    aiModel: l.aiModel,
  }));

  // Budget consommé jour : pas encore tracké en DB → placeholder à 0
  // (sera implémenté en Phase 5.B.2 backend par l'autre agent)
  const budgetSpentToday = 0;
  const lastTickAt = lastSnapshot?.createdAt.toISOString() ?? null;
  const nextTickAt = lastTickAt
    ? new Date(new Date(lastTickAt).getTime() + 4 * 60 * 60 * 1000).toISOString()
    : null;

  return NextResponse.json({
    config: config
      ? {
          ...config,
          updatedAt: config.updatedAt.toISOString(),
        }
      : null,
    lastSnapshot: lastSnapshot
      ? {
          ...lastSnapshot,
          date: lastSnapshot.date.toISOString(),
          createdAt: lastSnapshot.createdAt.toISOString(),
        }
      : null,
    kpiHistory: kpiHistory.map((s) => ({
      ...s,
      date: s.date.toISOString(),
      createdAt: s.createdAt.toISOString(),
    })),
    tasks,
    drafts,
    funnel,
    backlinks,
    auditLog,
    budgetSpentToday,
    lastTickAt,
    nextTickAt,
  });
}

function summarizePayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "—";
  const p = payload as Record<string, unknown>;
  const keys = ["leadId", "playbookId", "opportunityId", "signal", "domain", "url"];
  for (const k of keys) {
    if (p[k]) return `${k}: ${String(p[k]).slice(0, 60)}`;
  }
  const json = JSON.stringify(p);
  return json.length > 80 ? json.slice(0, 80) + "…" : json;
}

function maskRecipient(input: string): string {
  if (!input) return "—";
  if (input.includes("@")) {
    const [local, domain] = input.split("@");
    return `${local.slice(0, 2)}***@${domain}`;
  }
  return `${input.slice(0, 3)}***`;
}
