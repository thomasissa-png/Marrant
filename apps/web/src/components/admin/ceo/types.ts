/**
 * Types partagés pour le dashboard /admin/ceo.
 * Source : Prisma models CeoXxx (apps/web/prisma/schema.prisma).
 */

export type CeoTabId = "tasks" | "drafts" | "funnel" | "kpis" | "backlinks" | "audit";

export interface CeoConfigDto {
  id: string;
  enabled: boolean;
  dailyBudgetEur: number;
  maxActionsPerTick: number;
  autoSendEmail: boolean;
  autoSendDm: boolean;
  killSwitchReason: string | null;
  socialOutboundEnabled: boolean;
  dryRun: boolean;
  updatedAt: string;
}

export interface CeoTaskDto {
  id: string;
  type: string;
  status: "PENDING" | "RUNNING" | "DONE" | "FAILED" | string;
  scheduledFor: string;
  attempts: number;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  payloadSummary: string;
}

export interface CeoDraftDto {
  id: string;
  channel: string;
  recipient: string;
  subject: string | null;
  content: string;
  status: string;
  directorScore: number | null;
  directorValidated: boolean;
  directorNote: string | null;
  requiresHumanReview: boolean;
  playbook: string | null;
  createdAt: string;
}

export interface CeoFunnelDto {
  sent: number;
  opens: number;
  replies: number;
  clicks: number;
  siteVisits: number;
  conversions: number;
  // Pourcentages calculés côté serveur
  openRate: number;
  replyRate: number;
  clickRate: number;
  visitRate: number;
  conversionRate: number;
}

export interface CeoKpiSnapshotDto {
  id: string;
  date: string;
  northStarEngagement30d: number;
  emailReplyRate: number;
  siteReturn48h: number;
  emailOpenRate: number;
  killSwitchTriggers24h: number;
  directorFailRate: number;
  draftsAutoSendRatio: Record<string, number>;
  costPerAcquiredSubscriber: number | null;
  ceoAttributedConversions: number;
  backlinksDaSum: number;
  createdAt: string;
}

export interface CeoBacklinkDto {
  id: string;
  source: string;
  domain: string;
  url: string | null;
  pageTitle: string | null;
  da: number | null;
  status: string;
  pitchedAt: string;
  repliedAt: string | null;
  acquiredAt: string | null;
  daysSincePitched: number;
}

export interface CeoAuditLogDto {
  id: string;
  timestamp: string;
  action: string;
  targetType: string;
  channel: string;
  outcome: string;
  reasoning: string | null;
  aiDecisionScore: number | null;
  aiModel: string | null;
}

export interface CeoDashboardData {
  config: CeoConfigDto | null;
  lastSnapshot: CeoKpiSnapshotDto | null;
  kpiHistory: CeoKpiSnapshotDto[];
  tasks: CeoTaskDto[];
  drafts: CeoDraftDto[];
  funnel: CeoFunnelDto;
  backlinks: CeoBacklinkDto[];
  auditLog: CeoAuditLogDto[];
  budgetSpentToday: number;
  lastTickAt: string | null;
  nextTickAt: string | null;
}
