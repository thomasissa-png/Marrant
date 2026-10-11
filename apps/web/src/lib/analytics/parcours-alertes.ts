/**
 * Alertes quotidiennes des parcours (s17, data-analyst §7), enregistrées par
 * `recordAdminAlert` (classe B) et reprises par le digest du matin : aucun
 * e-mail en plus. Comptes seulement (volumes trop faibles pour des taux),
 * jamais d'e-mail ni d'identifiant dans le détail. Comptes de test exclus.
 *
 *  1. `parcours-sans-demarrage` : abonné Premium actif depuis 72 à 96 h sans
 *     aucune étape validée (fenêtre de 24 h : une alerte par abonné).
 *  2. `parcours-progress-erreur` : posée directement par la route progress.
 *  3. `parcours-suivi-muet` : sur 7 jours, au moins 5 pages vues `/parcours/<slug>`
 *     et 0 `parcours-ouvert`. Active seulement si `PARCOURS_SUIVI_ACTIF_DEPUIS`
 *     (date AAAA-MM-JJ de mise en ligne des événements) a au moins 7 jours.
 */
import { CLES_PARCOURS, recordAdminAlert } from "@/lib/admin-alerts";
import { emailsExclus } from "./comptes-test";
import { fetchUmamiMetrics, fetchUmamiPathMetrics, getUmamiConfig, type UmamiConfig } from "./umami";

const HOUR = 3_600_000;
export const SUIVI_MUET_MIN_VUES = 5;
export const ENV_SUIVI_ACTIF_DEPUIS = "PARCOURS_SUIVI_ACTIF_DEPUIS";

/** Sous-ensemble Prisma (injectable en test). */
export interface AlertesParcoursDb {
  subscription: {
    findMany(args: Record<string, unknown>): Promise<Array<{ createdAt: Date; user: { email: string } }>>;
  };
}

/** Abonnés de 3 jours sans aucune étape validée (dates de création seulement). */
export async function abonnesSansDemarrage(db: AlertesParcoursDb, now: Date, exclus: string[] = emailsExclus()): Promise<Date[]> {
  const rows = await db.subscription.findMany({
    where: {
      plan: "PREMIUM",
      status: "ACTIVE",
      createdAt: { gte: new Date(now.getTime() - 96 * HOUR), lt: new Date(now.getTime() - 72 * HOUR) },
      user: {
        pathStepCompletions: { none: {} },
        pathProgress: { none: { completedSteps: { isEmpty: false } } },
      },
    },
    select: { createdAt: true, user: { select: { email: true } } },
  });
  return rows.filter((r) => !exclus.includes(r.user.email.toLowerCase())).map((r) => r.createdAt);
}

/** Suivi muet : vues des pages `/parcours/<slug>` et nombre de `parcours-ouvert` sur 7 jours. */
export async function mesureSuivi(config: UmamiConfig, now: Date): Promise<{ vues: number; ouverts: number }> {
  const startAt = now.getTime() - 7 * 24 * HOUR;
  const [paths, events] = await Promise.all([
    fetchUmamiPathMetrics(config, startAt, now.getTime(), 500),
    fetchUmamiMetrics(config, startAt, now.getTime(), "event", 100),
  ]);
  const vues = paths.filter((p) => /^\/parcours\/[^/?#]+/.test(p.x)).reduce((s, p) => s + p.y, 0);
  const ouverts = events.filter((p) => p.x === "parcours-ouvert").reduce((s, p) => s + p.y, 0);
  return { vues, ouverts };
}

export function suiviMuetActif(now: Date, env: Record<string, string | undefined> = process.env): boolean {
  const raw = env[ENV_SUIVI_ACTIF_DEPUIS];
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  const depuis = Date.parse(`${raw}T00:00:00Z`);
  return Number.isFinite(depuis) && now.getTime() - depuis >= 7 * 24 * HOUR;
}

const dateCourte = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long" });

/** Passage quotidien (planificateur). Ne lève jamais. */
export async function runParcoursAlertes(
  now: Date,
  deps: { db?: AlertesParcoursDb; umami?: UmamiConfig | null; record?: typeof recordAdminAlert } = {},
): Promise<{ sansDemarrage: number; suiviMuet: boolean | null }> {
  const record = deps.record ?? recordAdminAlert;
  const out: { sansDemarrage: number; suiviMuet: boolean | null } = { sansDemarrage: 0, suiviMuet: null };

  try {
    const db = deps.db ?? ((await import("@/lib/prisma")).prisma as unknown as AlertesParcoursDb);
    const dates = await abonnesSansDemarrage(db, now);
    out.sansDemarrage = dates.length;
    if (dates.length > 0) {
      await record({
        cle: CLES_PARCOURS.sansDemarrage,
        sujet: `${dates.length} abonné(s) de 3 jours n'ont validé aucune étape`,
        html: `<p>Abonnement(s) du ${dates.map((d) => dateCourte.format(d)).join(", ")}.</p><p>À faire : préparer un brouillon d'e-mail d'accueil (étalon validé par Thomas, jamais envoyé sans accord) et vérifier que la validation marche (FS-09, FS-01).</p>`,
        now,
      });
    }
  } catch (err) {
    console.error("[parcours-alertes] Contrôle « sans démarrage » en échec :", err);
  }

  const umami = deps.umami === undefined ? getUmamiConfig() : deps.umami;
  if (umami && suiviMuetActif(now)) {
    try {
      const { vues, ouverts } = await mesureSuivi(umami, now);
      out.suiviMuet = vues >= SUIVI_MUET_MIN_VUES && ouverts === 0;
      if (out.suiviMuet) {
        await record({
          cle: CLES_PARCOURS.suiviMuet,
          sujet: "Les pages parcours sont vues mais l'événement parcours-ouvert n'arrive plus",
          html: `<p>7 derniers jours : ${vues} pages vues de parcours, 0 parcours-ouvert.</p><p>À faire : vérifier le script Umami et le code de parcours-detail (une page vue et un événement dépendent du même script : un écart veut dire que le code est cassé).</p>`,
          now,
        });
      }
    } catch (err) {
      console.error("[parcours-alertes] Contrôle « suivi muet » en échec :", err);
    }
  }
  return out;
}
