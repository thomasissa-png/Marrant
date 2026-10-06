/**
 * Digest quotidien des alertes admin (s15, 06/10/2026) : le SEUL e-mail
 * d'alerte vers l'admin, au plus un par jour, le matin (07:30 heure de Paris,
 * retentes jusqu'à 09:59 si Resend refuse). Rien si aucune alerte à traiter.
 *
 * Contenu :
 *  - alertes A (action de Thomas) pas encore envoyées ;
 *  - filet : si la session n'a pas lu `GET /api/admin/alertes` depuis 48 h
 *    (ou jamais, compté depuis la plus ancienne alerte B en attente), les
 *    alertes B en attente s'ajoutent, pour que rien ne se perde.
 *
 * Le lundi, le rapport hebdomadaire des visites (07:00) embarque ce digest :
 * une fois envoyé, le verrou du jour est posé et le digest de 07:30 ne part pas.
 */
import {
  type AdminAlert,
  type AlertDb,
  getDerniereLecture,
  jourParisDe,
  listAdminAlerts,
  marquerEnvoyees,
  purgerAlertesExpirees,
} from "@/lib/admin-alerts";
import { parisParts } from "@/lib/analytics/weekly-visits-period";

export const DIGEST_JOB = "admin-digest";
export const DIGEST_HEURE_PARIS = 7;
export const DIGEST_MINUTE_PARIS = 30;
/** Dernière heure (incluse) de retente si l'envoi échoue. */
export const DIGEST_HEURE_MAX_PARIS = 9;
export const FILET_SILENCE_MS = 48 * 60 * 60 * 1000;
const LOCK_TTL_MS = 36 * 60 * 60 * 1000;

export interface Digest {
  sujet: string;
  html: string;
  /** Alertes incluses (marquées envoyées après envoi accepté). */
  alertes: AdminAlert[];
  actions: number;
  filet: boolean;
}

export function digestLockKey(now: Date): string {
  return `${DIGEST_JOB}-${jourParisDe(now)}`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bloc(a: AdminAlert): string {
  const fois = a.occurrences > 1 ? ` (${a.occurrences} fois, dernière le ${a.derniereFois.slice(0, 16).replace("T", " ")} UTC)` : "";
  return `<li style="margin-bottom:12px;"><strong>${esc(a.sujet)}</strong>${esc(fois)}
<div style="white-space:pre-wrap;font-size:13px;color:#444;margin-top:4px;">${esc(a.detail)}</div></li>`;
}

/** Alertes B en attente : ni envoyées, ni vues par une lecture de la session. */
export function alertesBEnAttente(alertes: AdminAlert[], derniereLecture: Date | null): AdminAlert[] {
  return alertes.filter(
    (a) => a.classe === "B" && !a.envoyeeLe && (!derniereLecture || new Date(a.derniereFois) > derniereLecture),
  );
}

/** Le filet se déclenche-t-il ? (silence de lecture >= 48 h avec des B en attente) */
export function filetActif(enAttente: AdminAlert[], derniereLecture: Date | null, now: Date): boolean {
  if (enAttente.length === 0) return false;
  const depuis = derniereLecture
    ? derniereLecture.getTime()
    : Math.min(...enAttente.map((a) => new Date(a.premiereFois).getTime()));
  return now.getTime() - depuis >= FILET_SILENCE_MS;
}

/** Construit le digest (pur). `null` si rien à envoyer. */
export function construireDigest(alertes: AdminAlert[], derniereLecture: Date | null, now: Date): Digest | null {
  const actions = alertes.filter((a) => a.classe === "A" && !a.envoyeeLe);
  const enAttente = alertesBEnAttente(alertes, derniereLecture);
  const filet = filetActif(enAttente, derniereLecture, now);
  const incluses = [...actions, ...(filet ? enAttente : [])];
  if (incluses.length === 0) return null;

  const jour = jourParisDe(now).split("-").reverse().join("/");
  const sujet = actions.length > 0
    ? `[Marrant] ${actions.length} action(s) pour toi${filet ? ` + ${enAttente.length} alerte(s) non relue(s)` : ""} (${jour})`
    : `[Marrant] ${enAttente.length} alerte(s) non relue(s) par la session (${jour})`;
  const lecture = derniereLecture ? `le ${derniereLecture.toISOString().slice(0, 16).replace("T", " ")} UTC` : "jamais";
  const html = `<h3 style="font-size:16px;margin:24px 0 8px;">Ce que tu as à faire</h3>
${actions.length > 0 ? `<ol style="padding-left:20px;">${actions.map(bloc).join("")}</ol>` : "<p>Rien de ton côté aujourd'hui.</p>"}
${filet ? `<h3 style="font-size:16px;margin:24px 0 8px;">Alertes que la session n'a pas relues</h3>
<p style="font-size:13px;color:#b45309;">Dernière lecture de /api/admin/alertes : ${lecture}. Ces alertes se traitent en session : relance les routines du matin (ou une session) pour qu'elles soient prises en charge.</p>
<ul style="padding-left:20px;">${enAttente.map(bloc).join("")}</ul>` : ""}`;
  return { sujet, html, alertes: incluses, actions: actions.length, filet };
}

export function emballerDigest(digest: Digest): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
<h2 style="color:#7c3aed;margin-bottom:8px;">Deviens Marrant : le point du matin</h2>
${digest.html}
<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
<p style="font-size:12px;color:#999;">Un seul e-mail par jour au plus, seulement s'il y a quelque chose à faire. Le reste est traité par la session.</p>
</body></html>`;
}

export interface DigestDeps {
  db?: AlertDb;
  send?: (sujet: string, html: string) => Promise<void>;
  acquire?: (key: string, ttlMs: number) => Promise<boolean>;
  release?: (key: string) => Promise<void>;
}

/** Prépare le digest du jour (null si rien). Ne lève jamais. */
export async function preparerDigest(now: Date, db?: AlertDb): Promise<Digest | null> {
  try {
    const [alertes, lecture] = await Promise.all([listAdminAlerts(db), getDerniereLecture(db)]);
    return construireDigest(alertes, lecture, now);
  } catch (err) {
    console.error("[admin-digest] Alertes illisibles :", err);
    return null;
  }
}

/** Après un envoi accepté : alertes marquées, verrou du jour posé (plus d'autre digest). */
export async function validerDigest(digest: Digest, now: Date, deps: DigestDeps = {}): Promise<void> {
  const acquire = deps.acquire ?? (await import("@/lib/job-lock")).tryAcquireLock;
  await acquire(digestLockKey(now), LOCK_TTL_MS);
  await marquerEnvoyees(digest.alertes, now, deps.db);
}

export type DigestResult =
  | { status: "hors-fenetre" | "deja-envoye" | "rien" | "echec" }
  | { status: "envoye"; sujet: string; alertes: number; filet: boolean };

/**
 * Tick du scheduler (toutes les 15 min). Fenêtre 07:30-09:59 heure de Paris :
 * verrou du jour pris AVANT l'envoi (deux ticks concurrents n'envoient pas 2
 * e-mails), relâché si rien à envoyer ou si l'envoi échoue (retente au tick
 * suivant). Ne lève jamais.
 */
export async function runDailyAdminDigest(now: Date = new Date(), deps: DigestDeps = {}): Promise<DigestResult> {
  const p = parisParts(now);
  const minutes = p.hour * 60 + p.minute;
  if (minutes < DIGEST_HEURE_PARIS * 60 + DIGEST_MINUTE_PARIS || p.hour > DIGEST_HEURE_MAX_PARIS) {
    return { status: "hors-fenetre" };
  }
  try {
    const acquire = deps.acquire ?? (await import("@/lib/job-lock")).tryAcquireLock;
    const release = deps.release ?? (await import("@/lib/job-lock")).releaseLock;
    const key = digestLockKey(now);
    if (!(await acquire(key, LOCK_TTL_MS))) return { status: "deja-envoye" };

    const digest = await preparerDigest(now, deps.db);
    if (!digest) {
      await release(key);
      return { status: "rien" };
    }
    try {
      const send = deps.send ?? (await import("@/lib/email")).sendAdminHtmlEmail;
      await send(digest.sujet, emballerDigest(digest));
    } catch (err) {
      console.error(`[admin-digest] Envoi refusé, nouvel essai au prochain tick : ${err instanceof Error ? err.message : "erreur"}`);
      await release(key);
      return { status: "echec" };
    }
    await marquerEnvoyees(digest.alertes, now, deps.db);
    await purgerAlertesExpirees(now, deps.db).catch(() => undefined);
    console.log(`[admin-digest] Envoyé : ${digest.sujet}`);
    return { status: "envoye", sujet: digest.sujet, alertes: digest.alertes.length, filet: digest.filet };
  } catch (err) {
    console.error("[admin-digest] Échec :", err);
    return { status: "echec" };
  }
}
