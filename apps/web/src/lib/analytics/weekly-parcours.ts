/**
 * Bloc « Parcours » du rapport du lundi (s17, data-analyst §6), dans le MÊME
 * e-mail (aucun envoi en plus). Sur le modèle de `weekly-funnel.ts` :
 * comptages injectables pour les tests, « n.d. » si une source échoue, jamais
 * d'exception. Chaque ligne donne un nombre ET son dénominateur, jamais un
 * pourcentage seul (volumes trop faibles, §8). Comptes de test exclus
 * (`ANALYTICS_EMAILS_EXCLUS`, voir `comptes-test.ts`). Lecture seule.
 */
import { Prisma } from "@prisma/client";
import { fetchUmamiMetrics, fetchUmamiPathMetrics, type UmamiConfig, type UmamiPoint } from "./umami";
import { escapeHtml } from "./weekly-visits-email";
import { emailsExclus } from "./comptes-test";

export type ParcoursDbCounts = {
  /** Q1 : abonnés d'au moins 48 h (fenêtre 28 j) et ceux qui ont validé l'étape 1 dans les 48 h. */
  activation: { eligibles: number; actives48h: number };
  /** Q2 : par parcours, nombre d'abonnés ayant validé chaque étape (cumul). */
  passage: Array<{ slug: string; etape: number; ontValide: number }>;
  /** Q3 : commencés, terminés, médiane de jours. */
  completion: Array<{ slug: string; commences: number; termines: number; medianeJours: number | null }>;
  /** Q4 : parcours finis depuis 7 j et suite démarrée dans les 7 j. */
  suivant: { finis: number; autreDemarre: number };
  /** Q5 : semaines actives sur semaines écoulées (plafond 6). */
  rythme: { abonnes: number; semainesActives: number; semainesEcoulees: number };
  /** Q6 : retour à J7 (nouvelle étape entre 12 h et 8 j après la première). */
  retourJ7: { eligibles: number; revenus: number };
  /** Étapes validées en base dans la semaine (cohérence avec `parcours-etape`). */
  validationsSemaine: number;
};

export type ParcoursDbCounter = (startAt: Date, endAt: Date, exclus: string[]) => Promise<ParcoursDbCounts>;

export type WeeklyParcours = {
  pagesVues: number | null;
  events: Record<string, number> | null;
  db: ParcoursDbCounts | null;
  warnings: string[];
};

/** Événements Umami lus (data-analyst §5.1 et §5.2, noms exacts). */
export const PARCOURS_EVENTS = [
  "parcours-ouvert",
  "etape-ouverte",
  "quiz-etape-termine",
  "mur-vu",
  "parcours-etape",
  "parcours-termine",
  "parcours-erreur",
  "orientation-resultat",
] as const;

const num = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));

export const prismaParcoursCounter: ParcoursDbCounter = async (startAt, endAt, exclus) => {
  const { prisma } = await import("@/lib/prisma");
  const ex = exclus;
  const [q1, q2, q3, q4, q5, q6, sem] = await Promise.all([
    prisma.$queryRaw<Array<{ eligibles: bigint; actives: bigint }>>(Prisma.sql`
      SELECT COUNT(*) AS eligibles,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM "UserPathProgress" p
               WHERE p."userId" = s."userId" AND 1 = ANY (p."completedSteps")
                 AND p."startedAt" <= s."createdAt" + interval '48 hours'
             )) AS actives
      FROM "Subscription" s JOIN "User" u ON u.id = s."userId"
      WHERE s.plan = 'PREMIUM' AND s.status <> 'INACTIVE'
        AND s."createdAt" >= ${startAt} - interval '28 days' AND s."createdAt" < ${endAt}
        AND s."createdAt" <= now() - interval '48 hours'
        AND lower(u.email) <> ALL (${ex}::text[])`),
    prisma.$queryRaw<Array<{ slug: string; etape: number; ont_valide: bigint }>>(Prisma.sql`
      SELECT lp.slug, k AS etape, COUNT(*) FILTER (WHERE k = ANY (p."completedSteps")) AS ont_valide
      FROM "LearningPath" lp
      JOIN "UserPathProgress" p ON p."learningPathId" = lp.id
      JOIN "User" u ON u.id = p."userId" AND u.plan = 'PREMIUM' AND lower(u.email) <> ALL (${ex}::text[])
      CROSS JOIN LATERAL generate_series(1, (SELECT COUNT(*) FROM "LearningPathStep" st WHERE st."learningPathId" = lp.id)::int) k
      WHERE lp."isActive"
      GROUP BY lp.slug, k ORDER BY lp.slug, k`),
    prisma.$queryRaw<Array<{ slug: string; commences: bigint; termines: bigint; mediane: number | null }>>(Prisma.sql`
      SELECT lp.slug, COUNT(*) AS commences, COUNT(p."completedAt") AS termines,
             percentile_cont(0.5) WITHIN GROUP (ORDER BY extract(epoch FROM (p."completedAt" - p."startedAt")) / 86400) AS mediane
      FROM "UserPathProgress" p JOIN "LearningPath" lp ON lp.id = p."learningPathId" AND lp."isActive"
      JOIN "User" u ON u.id = p."userId" AND lower(u.email) <> ALL (${ex}::text[])
      GROUP BY lp.slug ORDER BY lp.slug`),
    prisma.$queryRaw<Array<{ finis: bigint; autre: bigint }>>(Prisma.sql`
      SELECT COUNT(*) AS finis,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM "UserPathProgress" q
               WHERE q."userId" = f."userId" AND q.id <> f.id
                 AND q."startedAt" > f."completedAt" AND q."startedAt" <= f."completedAt" + interval '7 days'
             )) AS autre
      FROM "UserPathProgress" f JOIN "User" u ON u.id = f."userId" AND lower(u.email) <> ALL (${ex}::text[])
      WHERE f."completedAt" IS NOT NULL AND f."completedAt" <= now() - interval '7 days'`),
    prisma.$queryRaw<Array<{ abonnes: bigint; actives: bigint; ecoulees: number }>>(Prisma.sql`
      WITH debut AS (
        SELECT c."userId", MIN(c."completedAt") AS t0 FROM "UserPathStepCompletion" c
        JOIN "User" u ON u.id = c."userId" AND lower(u.email) <> ALL (${ex}::text[])
        GROUP BY c."userId"
      ), par AS (
        SELECT d."userId",
               COUNT(DISTINCT floor(extract(epoch FROM (c."completedAt" - d.t0)) / 604800)) AS actives,
               LEAST(floor(extract(epoch FROM (now() - d.t0)) / 604800) + 1, 6) AS ecoulees
        FROM debut d JOIN "UserPathStepCompletion" c ON c."userId" = d."userId"
        WHERE d.t0 <= now() - interval '14 days'
        GROUP BY d."userId", d.t0
      )
      SELECT COUNT(*) AS abonnes, COALESCE(SUM(actives), 0) AS actives, COALESCE(SUM(ecoulees), 0) AS ecoulees FROM par`),
    prisma.$queryRaw<Array<{ eligibles: bigint; revenus: bigint }>>(Prisma.sql`
      WITH debut AS (
        SELECT c."userId", MIN(c."completedAt") AS t0 FROM "UserPathStepCompletion" c
        JOIN "User" u ON u.id = c."userId" AND lower(u.email) <> ALL (${ex}::text[])
        GROUP BY c."userId"
      )
      SELECT COUNT(*) AS eligibles,
             COUNT(*) FILTER (WHERE EXISTS (
               SELECT 1 FROM "UserPathStepCompletion" c
               WHERE c."userId" = debut."userId"
                 AND c."completedAt" > debut.t0 + interval '12 hours'
                 AND c."completedAt" <= debut.t0 + interval '8 days')) AS revenus
      FROM debut WHERE t0 <= now() - interval '8 days'`),
    prisma.$queryRaw<Array<{ n: bigint }>>(Prisma.sql`
      SELECT COUNT(*) AS n FROM "UserPathStepCompletion" c
      JOIN "User" u ON u.id = c."userId" AND lower(u.email) <> ALL (${ex}::text[])
      WHERE c."completedAt" >= ${startAt} AND c."completedAt" <= ${endAt}`),
  ]);
  return {
    activation: { eligibles: num(q1[0]?.eligibles), actives48h: num(q1[0]?.actives) },
    passage: q2.map((r) => ({ slug: r.slug, etape: num(r.etape), ontValide: num(r.ont_valide) })),
    completion: q3.map((r) => ({
      slug: r.slug,
      commences: num(r.commences),
      termines: num(r.termines),
      medianeJours: r.mediane === null ? null : Number(r.mediane),
    })),
    suivant: { finis: num(q4[0]?.finis), autreDemarre: num(q4[0]?.autre) },
    rythme: { abonnes: num(q5[0]?.abonnes), semainesActives: num(q5[0]?.actives), semainesEcoulees: num(q5[0]?.ecoulees) },
    retourJ7: { eligibles: num(q6[0]?.eligibles), revenus: num(q6[0]?.revenus) },
    validationsSemaine: num(sem[0]?.n),
  };
};

const reason = (err: unknown) => (err instanceof Error ? err.message : "erreur inconnue");

export function sommeVuesParcours(points: UmamiPoint[]): number {
  return points.filter((p) => /^\/parcours(\/|$|\?)/.test(p.x)).reduce((s, p) => s + p.y, 0);
}

export async function buildWeeklyParcours(
  config: UmamiConfig,
  window: { startAt: number; endAt: number },
  countDb: ParcoursDbCounter = prismaParcoursCounter,
  exclus: string[] = emailsExclus(),
): Promise<WeeklyParcours> {
  const warnings: string[] = [];
  const [paths, events, db] = await Promise.all([
    fetchUmamiPathMetrics(config, window.startAt, window.endAt, 500).catch((err) => {
      warnings.push(`pages parcours : ${reason(err)}`);
      return null;
    }),
    fetchUmamiMetrics(config, window.startAt, window.endAt, "event", 100).catch((err) => {
      warnings.push(`événements Umami : ${reason(err)}`);
      return null;
    }),
    countDb(new Date(window.startAt), new Date(window.endAt), exclus).catch((err) => {
      warnings.push(`base : ${reason(err)}`);
      return null;
    }),
  ]);
  const ev = events
    ? Object.fromEntries(PARCOURS_EVENTS.map((n) => [n, events.filter((p) => p.x === n).reduce((s, p) => s + p.y, 0)]))
    : null;
  return { pagesVues: paths ? sommeVuesParcours(paths) : null, events: ev, db, warnings };
}

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const TD = "padding:8px 6px;border-bottom:1px solid #eee;";
const TD_NUM = `${TD}text-align:right;white-space:nowrap;`;
const H3 = "font-size:16px;margin:24px 0 8px;color:#7c3aed;";
const NA = "n.d.";
const n = (v: number | null | undefined) => (v === null || v === undefined ? NA : nf.format(v));
const surDe = (a: number | undefined, b: number | undefined) =>
  a === undefined || b === undefined ? NA : `${nf.format(a)} sur ${nf.format(b)}`;

/** Passage d'une étape à la suivante, par parcours : « 1 → 2 : 1 sur 2 ». */
function lignesPassage(passage: ParcoursDbCounts["passage"]): string {
  const parSlug = new Map<string, Map<number, number>>();
  for (const r of passage) {
    if (!parSlug.has(r.slug)) parSlug.set(r.slug, new Map());
    parSlug.get(r.slug)?.set(r.etape, r.ontValide);
  }
  if (parSlug.size === 0) return "aucune progression";
  return Array.from(parSlug.entries())
    .map(([slug, m]) => {
      const etapes = Array.from(m.keys()).sort((a, b) => a - b);
      const sauts = etapes.slice(1).map((k) => `${k - 1}→${k} : ${surDe(m.get(k), m.get(k - 1))}`);
      return `${escapeHtml(slug)} (étape 1 : ${n(m.get(1))}${sauts.length ? ` ; ${sauts.join(" ; ")}` : ""})`;
    })
    .join("<br>");
}

/** Section HTML « Parcours de la semaine » (même e-mail du lundi). */
export function buildParcoursSectionHtml(w: WeeklyParcours): string {
  const e = w.events;
  const d = w.db;
  const ev = (k: string) => n(e ? e[k] : null);
  const completion = d
    ? d.completion.length
      ? d.completion
          .map((c) => `${escapeHtml(c.slug)} : ${surDe(c.termines, c.commences)}${c.medianeJours !== null ? `, médiane ${nf.format(c.medianeJours)} j` : ""}`)
          .join("<br>")
      : "aucun parcours commencé"
    : NA;
  const ecart = d && e ? d.validationsSemaine - (e["parcours-etape"] ?? 0) : null;
  const rows: [string, string][] = [
    ["Pages vues des parcours (/parcours*)", n(w.pagesVues)],
    ["Parcours ouverts (parcours-ouvert)", ev("parcours-ouvert")],
    ["Étapes ouvertes (etape-ouverte)", ev("etape-ouverte")],
    ["Quiz d'étape terminés (quiz-etape-termine)", ev("quiz-etape-termine")],
    ["Murs vus (mur-vu, tous types)", ev("mur-vu")],
    ["Orientation terminée (orientation-resultat)", ev("orientation-resultat")],
    ["Activation : étape 1 validée dans les 48 h", d ? surDe(d.activation.actives48h, d.activation.eligibles) : NA],
    ["Passage d'étape en étape (abonnés)", d ? lignesPassage(d.passage) : NA],
    ["Parcours terminés sur commencés", completion],
    ["Parcours suivant démarré dans les 7 j", d ? surDe(d.suivant.autreDemarre, d.suivant.finis) : NA],
    ["Rythme : semaines actives sur semaines écoulées", d ? `${surDe(d.rythme.semainesActives, d.rythme.semainesEcoulees)} (${n(d.rythme.abonnes)} abonné(s))` : NA],
    ["Retour à J7", d ? surDe(d.retourJ7.revenus, d.retourJ7.eligibles) : NA],
    ["Erreurs vues (parcours-erreur)", ev("parcours-erreur")],
    ["Étapes validées : base / Umami (parcours-etape)", d ? `${n(d.validationsSemaine)} / ${ev("parcours-etape")}${ecart ? ` (écart ${nf.format(ecart)})` : ""}` : NA],
  ];
  const body = rows
    .map(([label, value]) => `<tr><td style="${TD}">${label}</td><td style="${TD_NUM}font-weight:600;">${value}</td></tr>`)
    .join("");
  const partial = w.warnings.length
    ? `<p style="font-size:13px;color:#b45309;margin:0 0 8px;">Section partielle : ${escapeHtml(w.warnings.join(" ; "))}.</p>`
    : "";
  return `<h3 style="${H3}">Parcours de la semaine (chiffres absolus)</h3>${partial}
  <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${body}</table>
  <p style="font-size:12px;color:#999;margin:8px 0 0;">Umami pour les visiteurs (avant paiement), base pour les abonnés (cumul, comptes de test exclus). Un taux ne se lit pas sous 30 cas : nombre et dénominateur seulement. n.d. : donnée non disponible.</p>`;
}
