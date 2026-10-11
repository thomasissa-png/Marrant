/**
 * Relecture du statut réel des posts remis à Buffer (s15, 05/10/2026 ; cycle 3).
 *
 * PUBLISHED = remis à Buffer. Chaque passage relit les posts non confirmés
 * des 30 derniers jours :
 *  - `sent`  → confirmé : `bufferStatus = sent`, `publishedAt = sentAt`, ligne
 *    « Publication confirmée par Buffer … : <lien réel> » ajoutée à la note ;
 *  - `error` → FAILED, message Buffer ajouté à la note (la note précédente est
 *    gardée), alerte ; autorisation perdue → réseau mis en pause automatiquement ;
 *  - introuvable chez Buffer (supprimé) → FAILED `introuvable`, alerte ;
 *  - toujours `scheduled` / `sending` / brouillon 6 h après l'heure prévue →
 *    `non_confirme` (reste PUBLISHED, relu ensuite), alerte.
 * Lecture : pages de 100 posts `sent|error` avec curseur jusqu'à trouver tous
 * les candidats, puis relecture par identifiant des absents (25 max par passe).
 *
 * Alertes : un post à signaler garde `alertedAt = null` tant que l'alerte n'est
 * pas enregistrée (s15 06/10 : plus d'e-mail, alerte B lue par la session via
 * `/api/admin/alertes`) ; base illisible : il part au passage suivant.
 * Idempotent ; Buffer injoignable → aucun changement de statut.
 */
import type { SocialPlatform } from "@prisma/client";
import type { BufferPostStatus } from "./buffer-client";
import { buildPublishErrorNote } from "./publish-failure";
import { estAutorisationPerdue } from "./platform-switch";

export const BUFFER_CONFIRMED_PREFIX = "Publication confirmée par Buffer";
export const STATUS_CHECK_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
export const NON_CONFIRME_APRES_MS = 6 * 60 * 60 * 1000;
export const MAX_RELECTURES_PAR_PASSE = 25;
export const STATUS_ALERT_JOB_PREFIX = "buffer-status-alert";
export const STATUTS_A_SIGNALER = ["error", "introuvable", "non_confirme"] as const;

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  TWITTER: "X (Twitter)",
  THREADS: "Threads",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
};

export interface CandidatePost {
  id: string;
  platform: SocialPlatform;
  externalId: string | null;
  directorNote: string | null;
  scheduledAt: Date;
  publishedAt: Date | null;
  bufferStatus: string | null;
}

export interface PostASignaler {
  id: string;
  platform: SocialPlatform;
  scheduledAt: Date;
  hook: string;
  bufferStatus: string | null;
  directorNote: string | null;
}

/** Accès base (injectable en test ; l'implémentation réelle est en bas). */
export interface StatusStore {
  candidats(since: Date): Promise<CandidatePost[]>;
  /** Met à jour si le post est encore PUBLISHED ; retourne 1 ou 0. */
  maj(id: string, data: Record<string, unknown>): Promise<number>;
  aSignaler(since: Date): Promise<PostASignaler[]>;
  marquerAlertes(ids: string[], now: Date): Promise<void>;
}

export interface StatusCheckDeps {
  store: StatusStore;
  fetchFinished: (wantedIds: string[]) => Promise<BufferPostStatus[]>;
  fetchOne: (id: string) => Promise<BufferPostStatus | null>;
  /** Enregistre l'alerte `alertJob` ; true si elle est en base. */
  sendAlert: (subject: string, html: string, now: Date, alertJob: string) => Promise<boolean>;
  /** Pause automatique d'un réseau dont Buffer a perdu l'autorisation. */
  autoPause?: (platform: SocialPlatform, motif: string, now: Date) => Promise<boolean>;
}

export interface StatusCheckResult {
  candidates: number;
  confirmed: number;
  failed: number;
  missing: number;
  unconfirmed: number;
  unchanged: number;
  paused: SocialPlatform[];
  alerted: SocialPlatform[];
  error?: string;
}

/** Message Buffer lisible : « message (détail : rawError) ». */
export function formatBufferError(err: BufferPostStatus["error"]): string {
  const message = err?.message?.trim() || "Erreur inconnue";
  const raw = err?.rawError?.trim();
  return raw && raw !== message ? `${message} (détail : ${raw})` : message;
}

function ajouterLigne(previous: string | null, line: string): string {
  return previous?.trim() ? `${previous.trim()}\n${line}` : line;
}

export function buildConfirmationNote(previous: string | null, sentAt: Date, link: string | null): string {
  return ajouterLigne(previous, `${BUFFER_CONFIRMED_PREFIX} le ${sentAt.toISOString()}${link ? ` : ${link}` : ""}`);
}

function dateValide(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const LIBELLE_STATUT: Record<string, string> = {
  error: "refusé par le réseau",
  introuvable: "introuvable chez Buffer (supprimé ?)",
  non_confirme: "pas publié 6 h après l'heure prévue",
};

export function buildAlertHtml(platform: SocialPlatform, posts: PostASignaler[]): string {
  const lignes = posts
    .map((p) => {
      const derniere = (p.directorNote ?? "").split("\n").filter(Boolean).pop() ?? "";
      return `<li>${escapeHtml(p.scheduledAt.toISOString().slice(0, 16).replace("T", " "))} UTC, « ${escapeHtml(p.hook.slice(0, 80))} » :
        <strong>${escapeHtml(LIBELLE_STATUT[p.bufferStatus ?? ""] ?? p.bufferStatus ?? "anomalie")}</strong>
        ${derniere ? `<br><small>${escapeHtml(derniere.slice(0, 300))}</small>` : ""} (id ${escapeHtml(p.id)})</li>`;
    })
    .join("");
  return `<p><strong>${posts.length} post(s) ${PLATFORM_LABELS[platform]}</strong> ne sont pas confirmés publiés :</p>
    <ul>${lignes}</ul>
    <p><strong>Action :</strong> vérifier le canal ${PLATFORM_LABELS[platform]} dans Buffer (Channels &gt; Reconnect si
    déconnecté), puis reprogrammer les posts concernés depuis l'admin social. Détail : rapport « prévu contre publié ».</p>`;
}

export async function reconcileBufferPostStatuses(deps: StatusCheckDeps, now: Date): Promise<StatusCheckResult> {
  const result: StatusCheckResult = {
    candidates: 0, confirmed: 0, failed: 0, missing: 0, unconfirmed: 0, unchanged: 0, paused: [], alerted: [],
  };
  const since = new Date(now.getTime() - STATUS_CHECK_WINDOW_MS);
  const candidates = (await deps.store.candidats(since)).filter((p) => p.externalId);
  result.candidates = candidates.length;

  if (candidates.length > 0) {
    let finished: BufferPostStatus[] | null = null;
    try {
      finished = await deps.fetchFinished(candidates.map((p) => p.externalId as string));
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err);
      result.unchanged = candidates.length;
    }
    if (finished) await appliquer(deps, candidates, finished, now, result);
  }

  await alerter(deps, since, now, result);
  return result;
}

async function appliquer(
  deps: StatusCheckDeps,
  candidates: CandidatePost[],
  finished: BufferPostStatus[],
  now: Date,
  result: StatusCheckResult,
): Promise<void> {
  const byId = new Map(finished.map((s) => [s.id, s]));
  let relectures = 0;
  for (const post of candidates) {
    const externalId = post.externalId as string;
    let remote: BufferPostStatus | null | undefined = byId.get(externalId);
    if (remote === undefined) {
      if (relectures >= MAX_RELECTURES_PAR_PASSE) {
        result.unchanged += 1;
        continue;
      }
      relectures += 1;
      try {
        remote = await deps.fetchOne(externalId);
      } catch {
        result.unchanged += 1; // Buffer injoignable pour ce post : relu au prochain passage
        continue;
      }
    }
    const base = { bufferCheckedAt: now };
    if (remote === null) {
      result.missing += await deps.store.maj(post.id, {
        ...base, status: "FAILED", bufferStatus: "introuvable", alertedAt: null,
        directorNote: ajouterLigne(post.directorNote, buildPublishErrorNote("post introuvable chez Buffer (supprimé ou jamais créé)")),
      });
    } else if (remote.status === "sent") {
      const sentAt = dateValide(remote.sentAt) ?? now;
      result.confirmed += await deps.store.maj(post.id, {
        ...base, bufferStatus: "sent", publishedAt: sentAt,
        directorNote: buildConfirmationNote(post.directorNote, sentAt, remote.externalLink),
      });
    } else if (remote.status === "error") {
      const message = formatBufferError(remote.error);
      result.failed += await deps.store.maj(post.id, {
        ...base, status: "FAILED", bufferStatus: "error", alertedAt: null,
        directorNote: ajouterLigne(post.directorNote, buildPublishErrorNote(message)),
      });
      if (deps.autoPause && estAutorisationPerdue(message) && !result.paused.includes(post.platform)) {
        if (await deps.autoPause(post.platform, `Buffer : ${message.slice(0, 300)}`, now)) result.paused.push(post.platform);
      }
    } else {
      const prevu = dateValide(remote.dueAt ?? null) ?? post.scheduledAt;
      const reference = Math.max(prevu.getTime(), post.publishedAt?.getTime() ?? 0);
      if (now.getTime() - reference > NON_CONFIRME_APRES_MS && post.bufferStatus !== "non_confirme") {
        result.unconfirmed += await deps.store.maj(post.id, { ...base, bufferStatus: "non_confirme" });
      } else {
        await deps.store.maj(post.id, { ...base, bufferStatus: post.bufferStatus === "non_confirme" ? "non_confirme" : remote.status });
        result.unchanged += 1;
      }
    }
  }
}

async function alerter(deps: StatusCheckDeps, since: Date, now: Date, result: StatusCheckResult): Promise<void> {
  const parReseau = new Map<SocialPlatform, PostASignaler[]>();
  for (const p of await deps.store.aSignaler(since)) parReseau.set(p.platform, [...(parReseau.get(p.platform) ?? []), p]);
  for (const [platform, posts] of parReseau) {
    const sent = await deps.sendAlert(
      `Publication ${PLATFORM_LABELS[platform]} non confirmée chez Buffer (${posts.length} post(s))`,
      buildAlertHtml(platform, posts),
      now,
      `${STATUS_ALERT_JOB_PREFIX}-${platform.toLowerCase()}`,
    );
    if (sent) {
      await deps.store.marquerAlertes(posts.map((p) => p.id), now);
      result.alerted.push(platform);
    }
  }
}

/** Accès base réel (Prisma). */
export function prismaStatusStore(prisma: import("@prisma/client").PrismaClient): StatusStore {
  return {
    candidats: (since) =>
      prisma.socialPost.findMany({
        where: {
          status: "PUBLISHED",
          externalId: { not: null },
          publishedAt: { gte: since },
          OR: [{ bufferStatus: null }, { bufferStatus: { not: "sent" } }],
          AND: [{ OR: [{ directorNote: null }, { NOT: { directorNote: { contains: BUFFER_CONFIRMED_PREFIX } } }] }],
        },
        select: { id: true, platform: true, externalId: true, directorNote: true, scheduledAt: true, publishedAt: true, bufferStatus: true },
      }),
    maj: async (id, data) => (await prisma.socialPost.updateMany({ where: { id, status: "PUBLISHED" }, data })).count,
    aSignaler: (since) =>
      prisma.socialPost.findMany({
        where: { bufferStatus: { in: [...STATUTS_A_SIGNALER] }, alertedAt: null, updatedAt: { gte: since } },
        select: { id: true, platform: true, scheduledAt: true, hook: true, bufferStatus: true, directorNote: true },
        orderBy: { scheduledAt: "asc" },
      }),
    marquerAlertes: async (ids, now) => {
      await prisma.socialPost.updateMany({ where: { id: { in: ids } }, data: { alertedAt: now } });
    },
  };
}

/** Exécution réelle (Prisma + Buffer + alerte admin). Utilisée par le job et le démarrage. */
export async function runBufferStatusCheck(now: Date = new Date()): Promise<StatusCheckResult | null> {
  const { isBufferConfigured, getBufferFinishedPosts, getBufferPostStatus } = await import("./buffer-client");
  if (!isBufferConfigured()) return null;
  const { prisma } = await import("@/lib/prisma");
  const { sendDailyPublishFailureAlert } = await import("./publish-failure");
  const { pauserAutomatiquement, alerterPausesAutomatiques } = await import("./platform-switch");
  const db = prisma as unknown as import("./platform-switch").SwitchDb;
  const res = await reconcileBufferPostStatuses(
    {
      store: prismaStatusStore(prisma),
      fetchFinished: (ids) => getBufferFinishedPosts({ wantedIds: ids }),
      fetchOne: (id) => getBufferPostStatus(id),
      sendAlert: sendDailyPublishFailureAlert,
      autoPause: (platform, motif, at) =>
        platform === "THREADS" ? Promise.resolve(false) : pauserAutomatiquement(db, platform, motif, at),
    },
    now,
  );
  if (res.paused.length > 0) await alerterPausesAutomatiques(db, sendDailyPublishFailureAlert, now);
  return res;
}
