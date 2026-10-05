/**
 * Relecture du statut réel des posts remis à Buffer (s15, 05/10/2026).
 *
 * Avant : `SocialPost.status = PUBLISHED` dès que Buffer ACCEPTE le post, statut
 * jamais relu. Le post Instagram du 02/10 restait PUBLISHED alors qu'il était
 * en `error` chez Buffer (autorisation Instagram perdue), sans alerte.
 *
 * Sens des statuts (aucune migration, choix du minimum) :
 *  - PUBLISHED sans ligne de confirmation = remis à Buffer, pas encore confirmé ;
 *  - PUBLISHED + ligne « Publication confirmée par Buffer … » dans `directorNote`
 *    = réellement publié (`publishedAt = sentAt`, lien réel dans la note) ;
 *  - FAILED + « Échec publication Buffer : <message> » = refusé par le réseau.
 *
 * Idempotent : un post confirmé ou passé en FAILED sort des candidats ; mises à
 * jour conditionnées à `status = PUBLISHED`. Buffer injoignable → aucun changement.
 */
import type { SocialPlatform } from "@prisma/client";
import type { BufferPostStatus } from "./buffer-client";
import { buildPublishErrorNote } from "./publish-failure";

export const BUFFER_CONFIRMED_PREFIX = "Publication confirmée par Buffer";
export const STATUS_CHECK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const STATUS_ALERT_JOB_PREFIX = "buffer-status-alert";

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  TWITTER: "X (Twitter)",
  THREADS: "Threads",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
};

interface CandidatePost {
  id: string;
  platform: SocialPlatform;
  externalId: string | null;
  directorNote: string | null;
}

/** Sous-ensemble du client Prisma utilisé (injectable en test). */
export interface StatusCheckDb {
  socialPost: {
    findMany(args: unknown): Promise<CandidatePost[]>;
    updateMany(args: unknown): Promise<{ count: number }>;
  };
}

export interface StatusCheckDeps {
  db: StatusCheckDb;
  fetchStatuses: () => Promise<BufferPostStatus[]>;
  /** Alerte au plus 1×/jour pour `alertJob` ; retourne true si l'e-mail est parti. */
  sendAlert: (subject: string, html: string, now: Date, alertJob: string) => Promise<boolean>;
}

export interface StatusCheckResult {
  candidates: number;
  confirmed: number;
  failed: number;
  unchanged: number;
  alerted: SocialPlatform[];
  error?: string;
}

/** Message Buffer lisible : « message (détail : rawError) ». */
export function formatBufferError(err: BufferPostStatus["error"]): string {
  const message = err?.message?.trim() || "Erreur inconnue";
  const raw = err?.rawError?.trim();
  return raw && raw !== message ? `${message} (détail : ${raw})` : message;
}

export function buildConfirmationNote(previous: string | null, sentAt: Date, link: string | null): string {
  const line = `${BUFFER_CONFIRMED_PREFIX} le ${sentAt.toISOString()}${link ? ` : ${link}` : ""}`;
  return previous?.trim() ? `${previous.trim()}\n${line}` : line;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildAlertHtml(platform: SocialPlatform, failures: BufferPostStatus[]): string {
  const first = failures[0];
  const support = first.error?.supportUrl
    ? `<p><a href="${escapeHtml(first.error.supportUrl)}">Aide Buffer</a></p>`
    : "";
  return `<p>Buffer n'a pas publié <strong>${failures.length} post(s) ${PLATFORM_LABELS[platform]}</strong>
    (marqués FAILED dans l'admin).</p>
    <p><strong>Message Buffer :</strong> ${escapeHtml(formatBufferError(first.error))}</p>
    ${support}
    <p><strong>Action à faire :</strong> reconnecter le canal ${PLATFORM_LABELS[platform]} dans Buffer
    (Buffer &gt; Channels &gt; Reconnect), puis reprogrammer les posts concernés.</p>`;
}

export async function reconcileBufferPostStatuses(deps: StatusCheckDeps, now: Date): Promise<StatusCheckResult> {
  const result: StatusCheckResult = { candidates: 0, confirmed: 0, failed: 0, unchanged: 0, alerted: [] };

  const candidates = await deps.db.socialPost.findMany({
    where: {
      status: "PUBLISHED",
      externalId: { not: null },
      publishedAt: { gte: new Date(now.getTime() - STATUS_CHECK_WINDOW_MS) },
      OR: [{ directorNote: null }, { NOT: { directorNote: { contains: BUFFER_CONFIRMED_PREFIX } } }],
    },
    select: { id: true, platform: true, externalId: true, directorNote: true },
  });
  result.candidates = candidates.length;
  if (candidates.length === 0) return result;

  let statuses: BufferPostStatus[];
  try {
    statuses = await deps.fetchStatuses();
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    result.unchanged = candidates.length;
    return result;
  }
  const byId = new Map(statuses.map((s) => [s.id, s]));
  const failuresByPlatform = new Map<SocialPlatform, BufferPostStatus[]>();

  for (const post of candidates) {
    const remote = post.externalId ? byId.get(post.externalId) : undefined;
    if (remote?.status === "sent") {
      const sentAt = remote.sentAt ? new Date(remote.sentAt) : now;
      const { count } = await deps.db.socialPost.updateMany({
        where: { id: post.id, status: "PUBLISHED" },
        data: { publishedAt: sentAt, directorNote: buildConfirmationNote(post.directorNote, sentAt, remote.externalLink) },
      });
      result.confirmed += count;
    } else if (remote?.status === "error") {
      const { count } = await deps.db.socialPost.updateMany({
        where: { id: post.id, status: "PUBLISHED" },
        data: { status: "FAILED", directorNote: buildPublishErrorNote(formatBufferError(remote.error)) },
      });
      result.failed += count;
      if (count > 0) failuresByPlatform.set(post.platform, [...(failuresByPlatform.get(post.platform) ?? []), remote]);
    } else {
      result.unchanged += 1; // scheduled, sending, absent de la page : on relira plus tard
    }
  }

  for (const [platform, failures] of failuresByPlatform) {
    const sent = await deps.sendAlert(
      `Publication ${PLATFORM_LABELS[platform]} en échec chez Buffer : reconnecter le canal`,
      buildAlertHtml(platform, failures),
      now,
      `${STATUS_ALERT_JOB_PREFIX}-${platform.toLowerCase()}`,
    );
    if (sent) result.alerted.push(platform);
  }
  return result;
}

/** Exécution réelle (Prisma + Buffer + alerte admin). Utilisée par le job et le démarrage. */
export async function runBufferStatusCheck(now: Date = new Date()): Promise<StatusCheckResult | null> {
  const { isBufferConfigured, getBufferFinishedPosts } = await import("./buffer-client");
  if (!isBufferConfigured()) return null;
  const { prisma } = await import("@/lib/prisma");
  const { sendDailyPublishFailureAlert } = await import("./publish-failure");
  return reconcileBufferPostStatuses(
    {
      db: prisma as unknown as StatusCheckDb,
      fetchStatuses: () => getBufferFinishedPosts(),
      sendAlert: sendDailyPublishFailureAlert,
    },
    now,
  );
}
