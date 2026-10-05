/**
 * Interrupteur Pause / Reprise par réseau social (s15 cycle 3, K7).
 *
 * Remplace la constante `PAUSED_PLATFORMS` de publish-social : l'état vit en
 * base (`SocialPlatformSetting`) et se change depuis l'admin, sans
 * redéploiement. Fail-safe : ligne absente ou base illisible = EN PAUSE (rien
 * ne part par accident). État initial (migration 11) : les 3 réseaux en pause.
 *
 * Pause automatique : un canal Buffer déconnecté (autorisation perdue) ou une
 * erreur d'autorisation à la remise ou à la relecture met le réseau en pause,
 * puis une alerte part ; `alertSentAt` n'est posé qu'après un envoi réussi.
 *
 * Reprise : les posts APPROVED restés en retard pendant la pause ne partent
 * pas tous d'un coup ; ils sont replanifiés à 1 par jour, sur les jours libres
 * du réseau, à leur heure d'origine.
 */
import type { SocialPlatform } from "@prisma/client";
import type { BufferChannel, BufferPlatform } from "./buffer-client";

export const RESEAUX: BufferPlatform[] = ["TWITTER", "INSTAGRAM", "LINKEDIN"];
export const RESEAU_LABEL: Record<BufferPlatform, string> = {
  TWITTER: "X",
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
};
/** Rattrapage à la reprise : au plus N posts en retard par jour et par réseau. */
export const MAX_RATTRAPAGE_PAR_JOUR = 1;

export interface PlatformSettingRow {
  platform: SocialPlatform;
  paused: boolean;
  reason: string | null;
  changedBy: string | null;
  pausedAt: Date | null;
  alertSentAt: Date | null;
  updatedAt?: Date;
}

export interface Interrupteur {
  platform: BufferPlatform;
  paused: boolean;
  reason: string | null;
  changedBy: string | null;
  pausedAt: Date | null;
  alertSentAt: Date | null;
  /** true si aucune ligne en base : pause par défaut. */
  parDefaut: boolean;
}

/** Sous-ensemble Prisma utilisé (injectable en test). */
export interface SwitchDb {
  socialPlatformSetting: {
    findMany(args?: unknown): Promise<PlatformSettingRow[]>;
    upsert(args: unknown): Promise<PlatformSettingRow>;
    updateMany(args: unknown): Promise<{ count: number }>;
  };
  socialPost: {
    findMany(args: unknown): Promise<Array<{ id: string; scheduledAt: Date }>>;
    update(args: unknown): Promise<unknown>;
  };
}

/** Message d'erreur Buffer / réseau qui signifie « autorisation perdue ». */
const AUTORISATION_PERDUE =
  /lost authori[sz]ation|invalid credentials|reconnect|disconnected|déconnecté|access token|token (has )?expired|session (has been )?invalidated|permissions? (have been )?revoked/i;

export function estAutorisationPerdue(message: string | null | undefined): boolean {
  return !!message && AUTORISATION_PERDUE.test(message);
}

/** État des 3 réseaux. Ligne absente = pause ; base illisible = tout en pause. */
export async function lireInterrupteurs(db: SwitchDb): Promise<Interrupteur[]> {
  let rows: PlatformSettingRow[] = [];
  let lisible = true;
  try {
    rows = await db.socialPlatformSetting.findMany();
  } catch (err) {
    lisible = false;
    console.error("[platform-switch] Interrupteurs illisibles, tous les réseaux en pause :", err);
  }
  return RESEAUX.map((platform) => {
    const row = rows.find((r) => r.platform === platform);
    if (!row) {
      return {
        platform, paused: true, parDefaut: true, changedBy: null, pausedAt: null, alertSentAt: null,
        reason: lisible ? "Aucun réglage en base : en pause par défaut." : "Base illisible : en pause par sécurité.",
      };
    }
    return {
      platform, paused: row.paused, parDefaut: false, reason: row.reason, changedBy: row.changedBy,
      pausedAt: row.pausedAt, alertSentAt: row.alertSentAt,
    };
  });
}

export async function reseauxEnPause(db: SwitchDb): Promise<Set<SocialPlatform>> {
  const etats = await lireInterrupteurs(db);
  // THREADS n'est jamais publié (aucun canal) : toujours exclu.
  return new Set<SocialPlatform>([...etats.filter((e) => e.paused).map((e) => e.platform), "THREADS"]);
}

/** Pause manuelle (admin). */
export async function mettreEnPause(db: SwitchDb, platform: BufferPlatform, reason: string, now: Date): Promise<void> {
  await db.socialPlatformSetting.upsert({
    where: { platform },
    create: { platform, paused: true, reason, changedBy: "admin", pausedAt: now, alertSentAt: null },
    update: { paused: true, reason, changedBy: "admin", pausedAt: now, alertSentAt: null },
  });
}

/**
 * Replanifie des posts en retard : 1 par jour (MAX_RATTRAPAGE_PAR_JOUR), à
 * partir du lendemain, sur les jours UTC sans post déjà prévu, à l'heure
 * d'origine. Fonction pure.
 */
export function replanifierRetards(
  retards: Array<{ id: string; scheduledAt: Date }>,
  joursOccupes: Set<string>,
  now: Date,
): Array<{ id: string; scheduledAt: Date }> {
  const parJour = new Map<string, number>();
  for (const j of joursOccupes) parJour.set(j, MAX_RATTRAPAGE_PAR_JOUR);
  const out: Array<{ id: string; scheduledAt: Date }> = [];
  let jour = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  for (const p of [...retards].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())) {
    while ((parJour.get(jour.toISOString().slice(0, 10)) ?? 0) >= MAX_RATTRAPAGE_PAR_JOUR) {
      jour = new Date(jour.getTime() + 24 * 60 * 60 * 1000);
    }
    const cle = jour.toISOString().slice(0, 10);
    parJour.set(cle, (parJour.get(cle) ?? 0) + 1);
    const h = p.scheduledAt;
    out.push({
      id: p.id,
      scheduledAt: new Date(Date.UTC(jour.getUTCFullYear(), jour.getUTCMonth(), jour.getUTCDate(),
        h.getUTCHours(), h.getUTCMinutes())),
    });
  }
  return out;
}

/** Reprise (admin) : réseau actif, posts en retard replanifiés à 1 par jour. */
export async function reprendre(
  db: SwitchDb,
  platform: BufferPlatform,
  now: Date,
): Promise<{ replanifies: number }> {
  const retards = await db.socialPost.findMany({
    where: { platform, status: "APPROVED", scheduledAt: { lt: now } },
    select: { id: true, scheduledAt: true },
  });
  const futurs = await db.socialPost.findMany({
    where: { platform, status: "APPROVED", scheduledAt: { gte: now } },
    select: { id: true, scheduledAt: true },
  });
  const occupes = new Set(futurs.map((p) => p.scheduledAt.toISOString().slice(0, 10)));
  const plan = replanifierRetards(retards, occupes, now);
  for (const p of plan) {
    await db.socialPost.update({ where: { id: p.id }, data: { scheduledAt: p.scheduledAt } });
  }
  await db.socialPlatformSetting.upsert({
    where: { platform },
    create: { platform, paused: false, reason: null, changedBy: "admin", pausedAt: null, alertSentAt: null },
    update: { paused: false, reason: null, changedBy: "admin", pausedAt: null, alertSentAt: null },
  });
  return { replanifies: plan.length };
}

/** Canaux Buffer inutilisables parmi les réseaux configurés. Fonction pure. */
export function canauxEnPanne(
  channels: Pick<BufferChannel, "id" | "isDisconnected" | "isLocked">[],
  configures: Partial<Record<BufferPlatform, string>>,
): Array<{ platform: BufferPlatform; motif: string }> {
  const out: Array<{ platform: BufferPlatform; motif: string }> = [];
  for (const platform of RESEAUX) {
    const id = configures[platform];
    if (!id) continue;
    const ch = channels.find((c) => c.id === id);
    if (!ch) out.push({ platform, motif: "Canal introuvable chez Buffer (supprimé ou autre organisation)." });
    else if (ch.isDisconnected) out.push({ platform, motif: "Buffer a perdu l'autorisation du réseau (canal déconnecté)." });
    else if (ch.isLocked) out.push({ platform, motif: "Canal verrouillé chez Buffer (offre ou paiement)." });
  }
  return out;
}

/**
 * Pause automatique d'un réseau (canal cassé). Idempotente : même motif déjà
 * enregistré = aucun changement. Retourne true si l'état a changé.
 */
export async function pauserAutomatiquement(
  db: SwitchDb,
  platform: BufferPlatform,
  motif: string,
  now: Date,
): Promise<boolean> {
  const etat = (await lireInterrupteurs(db)).find((e) => e.platform === platform);
  if (etat && !etat.parDefaut && etat.paused && etat.changedBy === "auto" && etat.reason === motif) return false;
  await db.socialPlatformSetting.upsert({
    where: { platform },
    create: { platform, paused: true, reason: motif, changedBy: "auto", pausedAt: now, alertSentAt: null },
    update: { paused: true, reason: motif, changedBy: "auto", pausedAt: etat?.pausedAt ?? now, alertSentAt: null },
  });
  return true;
}

export type EnvoiAlerte = (subject: string, html: string, now: Date, alertJob: string) => Promise<boolean>;

/** Alerte des pauses automatiques pas encore signalées (alertSentAt posé après envoi). */
export async function alerterPausesAutomatiques(
  db: SwitchDb,
  envoyer: EnvoiAlerte,
  now: Date,
): Promise<BufferPlatform[]> {
  const alertes: BufferPlatform[] = [];
  for (const e of await lireInterrupteurs(db)) {
    if (e.parDefaut || !e.paused || e.changedBy !== "auto" || e.alertSentAt) continue;
    const label = RESEAU_LABEL[e.platform];
    const ok = await envoyer(
      `${label} mis en pause automatiquement : reconnecter le canal Buffer`,
      `<p>La publication <strong>${label}</strong> est <strong>en pause</strong> (aucun post ne part).</p>
      <p><strong>Cause :</strong> ${escapeHtml(e.reason ?? "canal Buffer inutilisable")}</p>
      <p><strong>Action :</strong> reconnecter le canal dans Buffer (Channels &gt; Reconnect), puis cliquer
      « Reprendre » pour ${label} dans l'admin social. Les posts en retard repartiront à 1 par jour.</p>`,
      now,
      `social-auto-pause-${e.platform.toLowerCase()}`,
    );
    if (ok) {
      await db.socialPlatformSetting.updateMany({
        where: { platform: e.platform, changedBy: "auto", alertSentAt: null },
        data: { alertSentAt: now },
      });
      alertes.push(e.platform);
    }
  }
  return alertes;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
