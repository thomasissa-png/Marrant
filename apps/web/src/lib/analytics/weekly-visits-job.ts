/**
 * Orchestration du rapport hebdomadaire des visites :
 *  - `runWeeklyVisitsReport` : construit le rapport, l'envoie (ou le renvoie
 *    seul en dryRun). Utilisé par la route admin manuelle et par le scheduler.
 *  - `runScheduledWeeklyVisitsReport` : fenêtre lundi 7h-8h heure de Paris
 *    (4 ticks du Cron Trigger 15 min), verrou hebdomadaire anti-doublon.
 * Aucun LLM. Lecture Umami + 2 comptages et 1 lecture d'articles en base + 1 email interne.
 */
import { getUmamiConfig } from "./umami";
import { buildWeeklyVisitsHtml, buildWeeklyVisitsSubject } from "./weekly-visits-email";
import { parisParts, parisWeekKey } from "./weekly-visits-period";
import type { BlogArticleLookup } from "./weekly-blog-report";
import { buildWeeklyVisitsReport, type ConversionCounter, type WeeklyVisitsReport } from "./weekly-visits-report";

export const WEEKLY_VISITS_JOB = "weekly-visits-report";
/** Verrou conservé après succès : un seul envoi par semaine, même si un tick rejoue. */
export const WEEKLY_VISITS_LOCK_TTL_MS = 6 * 24 * 60 * 60 * 1000;
export const WEEKLY_VISITS_PARIS_HOUR = 7;

export type WeeklyVisitsResult =
  | { status: "skipped"; reason: "umami-not-configured" }
  | { status: "dry-run" | "sent"; subject: string; report: WeeklyVisitsReport };

const prismaConversions: ConversionCounter = async (startAt, endAt) => {
  const { prisma } = await import("@/lib/prisma");
  const range = { gte: startAt, lte: endAt };
  const [signups, newPremium] = await Promise.all([
    prisma.user.count({ where: { createdAt: range } }),
    // Ligne Subscription créée au 1er passage Premium (webhook Stripe, upsert par userId).
    prisma.subscription.count({ where: { plan: "PREMIUM", createdAt: range } }),
  ]);
  return { signups, newPremium };
};

/** Statut de publication des articles suivis (section blog du rapport). */
const prismaBlogArticles: BlogArticleLookup = async (slugs) => {
  const { prisma } = await import("@/lib/prisma");
  return prisma.blogArticle.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, isPublished: true, publishedAt: true },
  });
};

/** Section « Réseaux sociaux : prévu contre publié » (s15 cycle 3). Jamais d'exception. */
export type SocialSection = (startAt: Date, endAt: Date, now: Date) => Promise<string>;

const prismaSocialSection: SocialSection = async (startAt, endAt, now) => {
  try {
    const { chargerRapport, jourParis, rapportPublicationHtml } = await import("@/lib/social/publication-report");
    return rapportPublicationHtml(await chargerRapport(jourParis(startAt), jourParis(endAt), now));
  } catch (err) {
    console.warn(`[weekly-visits] Section réseaux sociaux indisponible : ${err instanceof Error ? err.message : "erreur"}`);
    const { consigneReleveHtml } = await import("@/lib/social/publication-report");
    return `<h3 style="font-size:16px;margin:24px 0 8px;">Réseaux sociaux : prévu contre publié</h3><p style="font-size:13px;color:#b45309;">Section indisponible (base illisible) : voir l'admin social.</p>${consigneReleveHtml()}`;
  }
};

export async function runWeeklyVisitsReport(
  opts: {
    now?: Date;
    dryRun?: boolean;
    countConversions?: ConversionCounter;
    lookupArticles?: BlogArticleLookup;
    socialSection?: SocialSection;
    /** Digest des alertes admin du jour (lundi : un seul e-mail, s15 06/10). */
    digest?: { sujet: string; html: string; actions: number; filet: boolean } | null;
  } = {},
): Promise<WeeklyVisitsResult> {
  const config = getUmamiConfig();
  if (!config) {
    console.warn("[weekly-visits] UMAMI_API_KEY ou UMAMI_WEBSITE_ID absent : rapport non généré.");
    return { status: "skipped", reason: "umami-not-configured" };
  }
  const report = await buildWeeklyVisitsReport(
    opts.now ?? new Date(),
    config,
    opts.countConversions ?? prismaConversions,
    opts.lookupArticles ?? prismaBlogArticles,
  );
  const subject = buildWeeklyVisitsSubject(report);
  if (opts.dryRun) return { status: "dry-run", subject, report };

  const social = await (opts.socialSection ?? prismaSocialSection)(
    new Date(report.current.startAt),
    new Date(report.current.endAt),
    opts.now ?? new Date(),
  );
  const digest = opts.digest;
  const finalSubject = digest
    ? `${subject}${digest.actions > 0 ? ` + ${digest.actions} action(s) pour toi` : " + alertes non relues"}`
    : subject;
  const { sendAdminHtmlEmail } = await import("@/lib/email");
  await sendAdminHtmlEmail(finalSubject, buildWeeklyVisitsHtml(report, `${social}${digest?.html ?? ""}`));
  return { status: "sent", subject: finalSubject, report };
}

/** Tick du scheduler. Ne lève jamais : erreurs journalisées, verrou relâché pour retenter. */
export async function runScheduledWeeklyVisitsReport(now: Date = new Date()): Promise<void> {
  const p = parisParts(now);
  if (p.weekday !== 1 || p.hour !== WEEKLY_VISITS_PARIS_HOUR) return;
  if (!getUmamiConfig()) {
    console.warn("[weekly-visits] UMAMI_API_KEY ou UMAMI_WEBSITE_ID absent : rapport du lundi ignoré.");
    return;
  }

  const { tryAcquireLock, releaseLock } = await import("@/lib/job-lock");
  const lockKey = `${WEEKLY_VISITS_JOB}-${parisWeekKey(now)}`;
  if (!(await tryAcquireLock(lockKey, WEEKLY_VISITS_LOCK_TTL_MS))) return;

  try {
    // Lundi : le digest des alertes du matin voyage dans ce rapport (au plus
    // UN e-mail par jour, s15 06/10) ; une fois envoyé, le digest de 07:30 ne part pas.
    const { preparerDigest, validerDigest } = await import("@/lib/admin-digest");
    const digest = await preparerDigest(now);
    const res = await runWeeklyVisitsReport({ now, digest });
    if (res.status === "sent") console.log(`[weekly-visits] Rapport envoyé : ${res.subject}`);
    if (res.status === "sent" && digest) {
      await validerDigest(digest, now).catch((err) => console.error("[weekly-visits] Digest non marqué :", err));
    }
  } catch (err) {
    console.error(`[weekly-visits] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    await releaseLock(lockKey);
  }
}
