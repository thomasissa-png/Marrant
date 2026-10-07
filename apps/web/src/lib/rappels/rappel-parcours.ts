/**
 * Rappel e-mail hebdomadaire des parcours, SUR DEMANDE (s17, D7, avis @legal §1 et §5).
 *
 *  - Consentement : désactivé par défaut, activé par la personne (profil, lot C) ;
 *    preuve conservée (date d'activation, jour, version du texte affiché).
 *  - Envoi (C3, C4, C5) : Premium en cours, adresse vérifiée (e-mail vérifié ou
 *    compte Google), `emailOptOut` faux, parcours en cours, jour choisi (Paris),
 *    UNE fois par semaine de Paris (`lastSentWeek` réservé AVANT l'envoi : un
 *    retard ou un double passage du job ne renvoie jamais).
 *  - Arrêt automatique (C3) : à chaque passage, les rappels actifs d'un compte
 *    qui n'est plus Premium (fin de période, remboursement, résiliation
 *    immédiate) passent à l'arrêt, origine `fin-premium`. Suppression du compte :
 *    effacement (cascade + `deleteAccount`).
 *  - Lien d'arrêt DÉDIÉ (C7) : jeton HMAC propre au rappel (ne coupe que lui,
 *    jamais `emailOptOut`), sans connexion, immédiat, idempotent.
 */
import { createHmac, timingSafeEqual } from "crypto";
import type { Prisma } from "@prisma/client";
import { parisParts, parisWeekKey } from "@/lib/analytics/weekly-visits-period";
import { NEXT_STEP_DELAY_DAYS } from "@/lib/progression";
import { JOURS_SEMAINE, rappelParcoursEmail } from "@/config/textes/parcours-emails";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

export type OrigineArret = "profil" | "lien-email" | "fin-premium" | "suppression";

/**
 * Destinataire possible du rappel : Premium en cours, pas désinscrit des e-mails,
 * adresse vérifiée (e-mail vérifié ou compte Google). MÊME filtre pour l'envoi et
 * pour `eligible` (case du profil, réserve N1 s17) : pas de « C'est noté » sans envoi.
 */
export const FILTRE_DESTINATAIRE_RAPPEL = {
  plan: "PREMIUM",
  emailOptOut: false,
  OR: [{ emailVerified: { not: null } }, { accounts: { some: { provider: "google" } } }],
} satisfies Prisma.UserWhereInput;

const TOKEN_PURPOSE = "rappel-parcours";

function secret(): string | null {
  const s = process.env.UNSUBSCRIBE_HMAC_SECRET;
  return s && s.length >= 32 ? s : null;
}

function signature(userId: string, key: string): string {
  return createHmac("sha256", key).update(`${TOKEN_PURPOSE}:${userId}`).digest("hex").slice(0, 32);
}

/** Jeton d'arrêt du rappel (null si le secret manque : aucun envoi possible sans lien d'arrêt). */
export function signerJetonArret(userId: string): string | null {
  const key = secret();
  if (!key) return null;
  return `${Buffer.from(userId).toString("base64url")}.${signature(userId, key)}`;
}

/** userId si le jeton est valide, sinon null. */
export function verifierJetonArret(token: string | null | undefined): string | null {
  const key = secret();
  if (!key || !token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  let userId: string;
  try {
    userId = Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!userId) return null;
  const attendu = Buffer.from(signature(userId, key));
  const recu = Buffer.from(sig);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu) ? userId : null;
}

export function urlArret(baseUrl: string, token: string): string {
  return `${baseUrl}/api/rappel-parcours/arret?token=${encodeURIComponent(token)}`;
}

/** Sous-ensemble Prisma utilisé (injectable en test). */
export interface RappelDb {
  parcoursReminderPreference: {
    updateMany(args: { where: Record<string, unknown>; data: Record<string, unknown> }): Promise<{ count: number }>;
    findMany(args: Record<string, unknown>): Promise<CandidatRow[]>;
  };
  userPathProgress: {
    findMany(args: Record<string, unknown>): Promise<ProgressRow[]>;
  };
  userPathStepCompletion: {
    findFirst(args: Record<string, unknown>): Promise<{ completedAt: Date } | null>;
  };
}

export interface CandidatRow {
  id: string;
  userId: string;
  weekday: number;
  activatedAt: Date | null;
  lastSentWeek: string | null;
  user: { email: string; name: string | null };
}

interface ProgressRow {
  learningPathId: string;
  completedSteps: number[];
  learningPath: { slug: string; title: string; steps: { order: number }[] };
}

/** Arrête le rappel (idempotent : déjà arrêté = rien ne change). Retourne vrai si un rappel actif a été coupé. */
export interface ArretDb {
  parcoursReminderPreference: {
    updateMany(args: { where: { userId: string; enabled: boolean }; data: { enabled: boolean; stoppedAt: Date; stopOrigin: OrigineArret } }): Promise<{ count: number }>;
  };
}

export async function arreterRappel(db: ArretDb, userId: string, origine: OrigineArret, now: Date): Promise<boolean> {
  const res = await db.parcoursReminderPreference.updateMany({
    where: { userId, enabled: true },
    data: { enabled: false, stoppedAt: now, stopOrigin: origine },
  });
  return res.count > 0;
}

const SEED = parcoursSeed as Array<{ slug: string; steps: Array<{ week: number; moduleTitle?: string }> }>;

function titreEtape(slug: string, order: number): string {
  return SEED.find((p) => p.slug === slug)?.steps.find((s) => s.week === order)?.moduleTitle ?? `Étape ${order}`;
}

const dateLongue = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" });
const dateDemande = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });

export interface RappelDeps {
  db: RappelDb;
  sendEmail: (to: string, subject: string, text: string, headers: Record<string, string>) => Promise<void>;
  baseUrl: string;
}

export interface RappelRunResult {
  arretesFinPremium: number;
  candidats: number;
  envoyes: number;
  sansParcours: number;
  echecs: number;
  secretAbsent: boolean;
}

/** Un passage du job (le planificateur choisit l'heure). Ne lève que si la base est illisible. */
export async function runParcoursReminders(now: Date, deps: RappelDeps): Promise<RappelRunResult> {
  const result: RappelRunResult = { arretesFinPremium: 0, candidats: 0, envoyes: 0, sansParcours: 0, echecs: 0, secretAbsent: false };
  const { db } = deps;

  // C3 : arrêt automatique pour les comptes qui ne sont plus Premium.
  result.arretesFinPremium = (
    await db.parcoursReminderPreference.updateMany({
      where: { enabled: true, user: { plan: { not: "PREMIUM" } } },
      data: { enabled: false, stoppedAt: now, stopOrigin: "fin-premium" },
    })
  ).count;

  if (!secret()) {
    result.secretAbsent = true;
    return result;
  }

  const semaine = parisWeekKey(now);
  const candidats = await db.parcoursReminderPreference.findMany({
    where: {
      enabled: true,
      weekday: parisParts(now).weekday,
      OR: [{ lastSentWeek: null }, { lastSentWeek: { not: semaine } }],
      user: FILTRE_DESTINATAIRE_RAPPEL,
    },
    select: { id: true, userId: true, weekday: true, activatedAt: true, lastSentWeek: true, user: { select: { email: true, name: true } } },
  });
  result.candidats = candidats.length;

  for (const c of candidats) {
    const progressions = await db.userPathProgress.findMany({
      where: { userId: c.userId, completedAt: null, learningPath: { isActive: true } },
      select: { learningPathId: true, completedSteps: true, learningPath: { select: { slug: true, title: true, steps: { select: { order: true } } } } },
    });
    // Parcours en cours = au moins une étape validée, au moins une restante.
    const enCours = progressions
      .map((p) => {
        const orders = p.learningPath.steps.map((s) => s.order).sort((a, b) => a - b);
        return { p, prochaine: orders.find((o) => !p.completedSteps.includes(o)) };
      })
      .filter((x) => x.p.completedSteps.length > 0 && x.prochaine !== undefined);
    if (enCours.length === 0) {
      result.sansParcours++;
      continue;
    }

    // Réserve la semaine AVANT l'envoi (C5) : 0 ligne = déjà envoyé par un autre passage.
    const claim = await db.parcoursReminderPreference.updateMany({
      where: { id: c.id, enabled: true, OR: [{ lastSentWeek: null }, { lastSentWeek: { not: semaine } }] },
      data: { lastSentWeek: semaine, lastSentAt: now },
    });
    if (claim.count === 0) continue;

    try {
      const { p, prochaine } = enCours[0];
      const derniere = await db.userPathStepCompletion.findFirst({
        where: { userId: c.userId, learningPathId: p.learningPathId },
        orderBy: { completedAt: "desc" },
        select: { completedAt: true },
      });
      const conseillee = derniere ? new Date(derniere.completedAt.getTime() + NEXT_STEP_DELAY_DAYS * 86_400_000) : null;
      const token = signerJetonArret(c.userId) as string;
      const lienArret = urlArret(deps.baseUrl, token);
      const { subject, text } = rappelParcoursEmail({
        prenom: c.user.name?.trim().split(/\s+/)[0] || null,
        parcoursTitre: p.learningPath.title,
        etapeNumero: prochaine as number,
        etapeTitre: titreEtape(p.learningPath.slug, prochaine as number),
        dateConseillee: conseillee && conseillee > now ? dateLongue.format(conseillee) : null,
        lienEtape: `${deps.baseUrl}/parcours/${p.learningPath.slug}?src=rappel`,
        lienArret,
        lienChangerJour: `${deps.baseUrl}/profil#rappel-parcours`,
        dateDemande: dateDemande.format(c.activatedAt ?? now),
        jourChoisi: JOURS_SEMAINE[(c.weekday - 1 + 7) % 7],
      });
      await deps.sendEmail(c.user.email, subject, text, {
        "List-Unsubscribe": `<${lienArret}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      });
      result.envoyes++;
    } catch (err) {
      result.echecs++;
      console.error("[rappel-parcours] Envoi en échec :", err instanceof Error ? err.message : err);
      // Libère la semaine pour retenter au passage suivant (même jour).
      await db.parcoursReminderPreference.updateMany({
        where: { id: c.id, lastSentWeek: semaine },
        data: { lastSentWeek: c.lastSentWeek, lastSentAt: null },
      });
    }
  }
  return result;
}
