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
 * Reprise (s15, QA cycle 1 C3/C4, plan v2 §7-§8) : refusée si Buffer est
 * injoignable (route admin). Posts APPROVED en retard de plus de 24 h, relais
 * d'article et posts datés en retard : REJECTED « expiré à la reprise ». Le
 * reste : replanifié à 1 par jour, sur les jours libres, jamais un dimanche ni
 * un jour de silence, à l'heure de Paris du réseau.
 * Commande « sauter les posts avant J0 » : `sauterAvantJ0`.
 */
import type { SocialPlatform } from "@prisma/client";
import { HEURE_B_PARIS, HEURE_PARIS, RETARD_MAX_REPRISE_HEURES, SILENCES_SOCIAL } from "@/config/social-calendrier";
import type { BufferChannel, BufferPlatform } from "./buffer-client";
import { estDateOuRelais } from "./garde-article";
import { ajouterJours, dateParis, jourSemaine, parisVersUtc } from "./heure-paris";

/** Marqueur du bras B du test d'heure (script de lot, `lib/social/heure-test.ts`). */
const MARQUEUR_HEURE_B = "[heure:B]";

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
  /** Dernier changement de l'interrupteur (reprise d'un réseau actif), null si inconnu. */
  depuis: Date | null;
}

/** Ligne SocialPost lue par l'interrupteur et la couverture (champs selon `select`). */
export interface PostFile {
  id: string;
  scheduledAt: Date;
  status?: string;
  directorNote?: string | null;
  content?: string;
  cta?: string | null;
  sourceId?: string | null;
  platform?: string;
}

/** Sous-ensemble Prisma utilisé (injectable en test). */
export interface SwitchDb {
  socialPlatformSetting: {
    findMany(args?: unknown): Promise<PlatformSettingRow[]>;
    upsert(args: unknown): Promise<PlatformSettingRow>;
    updateMany(args: unknown): Promise<{ count: number }>;
  };
  socialPost: {
    findMany(args: unknown): Promise<PostFile[]>;
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
        platform, paused: true, parDefaut: true, changedBy: null, pausedAt: null, alertSentAt: null, depuis: null,
        reason: lisible ? "Aucun réglage en base : en pause par défaut." : "Base illisible : en pause par sécurité.",
      };
    }
    return {
      platform, paused: row.paused, parDefaut: false, reason: row.reason, changedBy: row.changedBy,
      pausedAt: row.pausedAt, alertSentAt: row.alertSentAt, depuis: row.updatedAt ?? null,
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

/** Marge minimale entre la reprise et un créneau du jour même (le cron passe toutes les 15 min). */
const MARGE_CRENEAU_MS = 15 * 60 * 1000;

/**
 * Replanifie des posts en retard (moins de 24 h) : 1 par jour
 * (MAX_RATTRAPAGE_PAR_JOUR), sur les jours de Paris sans post déjà prévu,
 * jamais un dimanche ni un jour de silence (v5 §3), toujours à l'heure de
 * Paris du réseau (heure d'hiver comprise). Fonction pure.
 */
export function replanifierRetards(
  retards: Array<{ id: string; scheduledAt: Date; directorNote?: string | null }>,
  joursOccupes: Set<string>,
  now: Date,
  platform: BufferPlatform,
): Array<{ id: string; scheduledAt: Date }> {
  const parJour = new Map<string, number>();
  for (const j of joursOccupes) parJour.set(j, MAX_RATTRAPAGE_PAR_JOUR);
  const out: Array<{ id: string; scheduledAt: Date }> = [];
  let jour = dateParis(now);
  const libre = (d: string, h: number, m: number) =>
    (parJour.get(d) ?? 0) < MAX_RATTRAPAGE_PAR_JOUR && !SILENCES_SOCIAL.has(d) && jourSemaine(d) !== 0 &&
    parisVersUtc(d, h, m).getTime() >= now.getTime() + MARGE_CRENEAU_MS;
  for (const p of [...retards].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())) {
    // s15 cycle 7 (F1) : un post du bras B du test d'heure garde l'heure B (marqueur `[heure:B]`).
    const { h, m } = p.directorNote?.includes(MARQUEUR_HEURE_B) ? HEURE_B_PARIS[platform] : HEURE_PARIS[platform];
    while (!libre(jour, h, m)) jour = ajouterJours(jour, 1);
    parJour.set(jour, (parJour.get(jour) ?? 0) + 1);
    out.push({ id: p.id, scheduledAt: parisVersUtc(jour, h, m) });
  }
  return out;
}

const fr = (d: Date) => `${dateParis(d).split("-").reverse().join("/")}`;

/**
 * Reprise (admin) : réseau actif. Posts APPROVED en retard de plus de 24 h, et
 * relais d'article ou posts datés (`[date:…]`) en retard quel que soit le retard :
 * REJECTED « expiré à la reprise », jamais rattrapés hors contexte.
 * Le reste : replanifié à 1 par jour (voir replanifierRetards).
 */
export async function reprendre(
  db: SwitchDb,
  platform: BufferPlatform,
  now: Date,
): Promise<{ replanifies: number; expires: number }> {
  const retards = await db.socialPost.findMany({
    where: { platform, status: "APPROVED", scheduledAt: { lt: now } },
    select: { id: true, scheduledAt: true, directorNote: true, content: true, cta: true },
  });
  const limite = now.getTime() - RETARD_MAX_REPRISE_HEURES * 60 * 60 * 1000;
  const horsContexte = (p: PostFile) => estDateOuRelais({ content: p.content ?? "", cta: p.cta ?? null, directorNote: p.directorNote ?? null });
  const expire = (p: PostFile) => p.scheduledAt.getTime() < limite || horsContexte(p);
  const expires = retards.filter(expire);
  for (const p of expires) {
    const motif = p.scheduledAt.getTime() < limite ? `plus de ${RETARD_MAX_REPRISE_HEURES} h avant` : "relais d'article ou post daté, jamais rattrapé";
    await db.socialPost.update({
      where: { id: p.id },
      data: {
        status: "REJECTED",
        directorNote: `Expiré à la reprise du ${fr(now)} : prévu le ${fr(p.scheduledAt)}, ${motif}.${p.directorNote ? ` ${p.directorNote}` : ""}`,
      },
    });
  }
  const futurs = await db.socialPost.findMany({
    where: { platform, status: "APPROVED", scheduledAt: { gte: now } },
    select: { id: true, scheduledAt: true },
  });
  const occupes = new Set(futurs.map((p) => dateParis(p.scheduledAt)));
  const plan = replanifierRetards(retards.filter((p) => !expire(p)), occupes, now, platform);
  for (const p of plan) {
    await db.socialPost.update({ where: { id: p.id }, data: { scheduledAt: p.scheduledAt } });
  }
  await db.socialPlatformSetting.upsert({
    where: { platform },
    create: { platform, paused: false, reason: null, changedBy: "admin", pausedAt: null, alertSentAt: null },
    update: { paused: false, reason: null, changedBy: "admin", pausedAt: null, alertSentAt: null },
  });
  return { replanifies: plan.length, expires: expires.length };
}

/**
 * Commande admin « sauter les posts avant J0 » : les posts APPROVED (jamais
 * envoyés) datés avant le J0 du réseau (minuit, heure de Paris) passent en
 * REJECTED. Le réseau reste dans son état (pause ou non).
 */
export async function sauterAvantJ0(
  db: SwitchDb,
  platform: BufferPlatform,
  j0: string,
): Promise<{ sautes: number }> {
  const posts = await db.socialPost.findMany({
    where: { platform, status: "APPROVED", scheduledAt: { lt: parisVersUtc(j0, 0, 0) } },
    select: { id: true, scheduledAt: true, directorNote: true },
  });
  const j0Fr = j0.split("-").reverse().join("/");
  for (const p of posts) {
    await db.socialPost.update({
      where: { id: p.id },
      data: {
        status: "REJECTED",
        directorNote: `Sauté : prévu le ${fr(p.scheduledAt)}, avant le J0 du réseau (${j0Fr}).${p.directorNote ? ` ${p.directorNote}` : ""}`,
      },
    });
  }
  return { sautes: posts.length };
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

/** Préfixe du motif de pause automatique après échecs consécutifs (job de couverture). */
export const MOTIF_PAUSE_ECHECS = "Échecs de publication consécutifs";

export function estPauseSurEchecs(reason: string | null | undefined): boolean {
  return !!reason && reason.startsWith(MOTIF_PAUSE_ECHECS);
}

export type EnvoiAlerte =(subject: string, html: string, now: Date, alertJob: string) => Promise<boolean>;

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
    const echecs = estPauseSurEchecs(e.reason);
    const action = echecs
      ? `lire la note des posts FAILED de ${label} dans l'admin social, corriger la cause (texte, lien, image), puis cliquer
      « Reprendre ».`
      : `reconnecter le canal dans Buffer (Channels &gt; Reconnect), puis cliquer « Reprendre » pour ${label} dans l'admin social.`;
    const ok = await envoyer(
      `${label} mis en pause automatiquement : ${echecs ? "échecs de publication consécutifs" : "reconnecter le canal Buffer"}`,
      `<p>La publication <strong>${label}</strong> est <strong>en pause</strong> (aucun post ne part).</p>
      <p><strong>Cause :</strong> ${escapeHtml(e.reason ?? "canal Buffer inutilisable")}</p>
      <p><strong>Action :</strong> ${action} Les posts en retard de moins de 24 h repartiront à 1 par jour, les autres passent en REJECTED.</p>`,
      now,
      // s15 (06/10) : « canal » = Thomas reconnecte Buffer (alerte A, digest) ; « echecs » = la session corrige (B).
      `social-auto-pause-${echecs ? "echecs" : "canal"}-${e.platform.toLowerCase()}`,
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
