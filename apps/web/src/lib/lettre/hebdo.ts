/**
 * Lettre de la semaine (hebdomadaire Premium, s21) : qui la reçoit, activation, arrêt.
 * Spec `docs/product/lettre-hebdo-premium-s21.md` §4 ; avis `docs/legal/lettre-hebdo-premium-s21.md` §6.
 *
 * Règle d'or de cohérence (spec §4.2) : « reçoit l'hebdo » est UNE fonction
 * (`recoitHebdo`, appliquée par `destinatairesHebdo`), utilisée par la tâche du
 * jeudi ET par la mise en pause de la mensuelle (`envoi.ts`). Un Premium n'est
 * donc jamais privé des deux lettres, ni destinataire des deux.
 *
 * Reçoit l'hebdo = interrupteur `LETTRE_HEBDO_ENVOIS_OUVERTS` ouvert, plan PREMIUM
 * (l'accès : `cancelAtPeriodEnd` et `PAST_DUE` le gardent, le webhook le retire aux
 * statuts de fin), case cochée (enabled + date + version), jeton d'arrêt présent,
 * adresse vérifiée (ou compte Google), et pas d'opposition globale postérieure à
 * l'activation (L6 : une activation après l'opposition est un nouvel acte positif).
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  LETTRE_HEBDO_CONSENT_VERSION,
  LETTRE_HEBDO_ENVOIS_OUVERTS,
  LETTRE_HEBDO_JOURNAL_MOIS,
  type LettreHebdoOrigineActivation,
  type LettreHebdoOrigineArret,
} from "@/config/lettre";
import { generateOpaqueToken } from "@/lib/newsletter";

/** Pré-filtre en base ; la décision finale reste `recoitHebdo`. */
export const FILTRE_CANDIDAT_HEBDO = {
  plan: "PREMIUM",
  premiumLetter: { is: { enabled: true, activatedAt: { not: null }, consentVersion: { not: null } } },
} satisfies Prisma.UserWhereInput;

export const SELECT_CANDIDAT_HEBDO = {
  id: true,
  email: true,
  plan: true,
  emailVerified: true,
  emailOptOut: true,
  updatedAt: true,
  accounts: { where: { provider: "google" }, select: { id: true }, take: 1 },
  premiumLetter: { select: { enabled: true, activatedAt: true, consentVersion: true, unsubscribeToken: true } },
} satisfies Prisma.UserSelect;

export interface CandidatHebdo {
  id: string;
  email: string | null;
  plan: string;
  emailVerified: Date | null;
  emailOptOut: boolean;
  /** Date d'opposition majorée par `updatedAt` (prudente, comme la mensuelle). */
  updatedAt: Date;
  accounts: Array<{ id: string }>;
  premiumLetter: { enabled: boolean; activatedAt: Date | null; consentVersion: string | null; unsubscribeToken: string | null } | null;
}

/** LA fonction « reçoit l'hebdo ». Pure : testable sans base. */
export function recoitHebdo(u: CandidatHebdo, envoisOuverts: boolean = LETTRE_HEBDO_ENVOIS_OUVERTS): boolean {
  if (!envoisOuverts || !u.email || u.plan !== "PREMIUM") return false;
  const pref = u.premiumLetter;
  if (!pref?.enabled || !pref.activatedAt || !pref.consentVersion || !pref.unsubscribeToken) return false;
  if (!u.emailVerified && u.accounts.length === 0) return false;
  if (u.emailOptOut && pref.activatedAt.getTime() <= u.updatedAt.getTime()) return false;
  return true;
}

export interface DestinataireHebdo {
  userId: string;
  email: string;
  unsubscribeToken: string;
}

/** Destinataires de l'hebdo (vide si l'interrupteur des envois est fermé). Adresses en minuscules. */
export async function destinatairesHebdo(envoisOuverts: boolean = LETTRE_HEBDO_ENVOIS_OUVERTS): Promise<DestinataireHebdo[]> {
  if (!envoisOuverts) return [];
  const candidats: CandidatHebdo[] = await prisma.user.findMany({
    where: FILTRE_CANDIDAT_HEBDO,
    select: SELECT_CANDIDAT_HEBDO,
    orderBy: { createdAt: "asc" },
  });
  return candidats
    .filter((u) => recoitHebdo(u, envoisOuverts))
    .map((u) => ({ userId: u.id, email: (u.email as string).toLowerCase(), unsubscribeToken: u.premiumLetter?.unsubscribeToken as string }));
}

export type ResultatActivation = "activee" | "deja-activee";

/**
 * Activation (case cochée). Le serveur écrit SA version et la date ; jamais le texte
 * du navigateur. Idempotente : déjà active = rien n'est réécrit (`activatedAt` garde
 * sa date). Une réactivation (après arrêt, fin de Premium) efface la trace d'arrêt,
 * pose une nouvelle date et la version courante. Jeton d'arrêt créé une fois, stable.
 */
export async function activerLettreHebdo(userId: string, origine: LettreHebdoOrigineActivation, now: Date): Promise<ResultatActivation> {
  const activation = {
    enabled: true,
    activatedAt: now,
    consentVersion: LETTRE_HEBDO_CONSENT_VERSION,
    activationOrigin: origine,
    stoppedAt: null,
    stopOrigin: null,
  };
  const existant = await prisma.premiumLetterPreference.findUnique({ where: { userId }, select: { enabled: true, unsubscribeToken: true } });
  if (!existant) {
    try {
      await prisma.premiumLetterPreference.create({ data: { userId, ...activation, unsubscribeToken: generateOpaqueToken() } });
      return "activee";
    } catch (err) {
      // Double clic : l'autre requête a créé la ligne. Elle est active : rien à refaire.
      if ((err as { code?: string }).code !== "P2002") throw err;
      return "deja-activee";
    }
  }
  if (existant.enabled) return "deja-activee";
  // Écriture conditionnelle : deux requêtes concurrentes, une seule activation.
  const pris = await prisma.premiumLetterPreference.updateMany({
    where: { userId, enabled: false },
    data: { ...activation, unsubscribeToken: existant.unsubscribeToken ?? generateOpaqueToken() },
  });
  return pris.count > 0 ? "activee" : "deja-activee";
}

export type ResultatArret = "arretee" | "deja-arretee" | "inconnu";

/** Arrêt d'un compte (profil, paiement, admin). Idempotent : `stoppedAt` n'est jamais réécrit. */
export async function arreterLettreHebdo(userId: string, origine: LettreHebdoOrigineArret, now: Date): Promise<ResultatArret> {
  const res = await prisma.premiumLetterPreference.updateMany({
    where: { userId, enabled: true },
    data: { enabled: false, stoppedAt: now, stopOrigin: origine },
  });
  if (res.count > 0) return "arretee";
  return (await prisma.premiumLetterPreference.count({ where: { userId } })) > 0 ? "deja-arretee" : "inconnu";
}

/** Arrêt par le jeton du lien (page d'arrêt, en-tête un clic). Marche interrupteurs fermés. */
export async function arreterLettreHebdoParJeton(token: string, now: Date): Promise<ResultatArret> {
  const pref = await prisma.premiumLetterPreference.findUnique({ where: { unsubscribeToken: token }, select: { userId: true } });
  if (!pref) return "inconnu";
  return arreterLettreHebdo(pref.userId, "lien-email", now);
}

/**
 * Fin de Premium (avis @legal §6.2) : à joindre à la transaction qui passe le plan à
 * FREE (webhook Stripe, remboursement, RevenueCat, admin). Un réabonné ne retrouve
 * jamais une lettre active sans nouvel acte. Le rapprochement quotidien reste un filet.
 */
export function finPremiumLettreHebdo(userId: string, now: Date) {
  return prisma.premiumLetterPreference.updateMany({
    where: { userId, enabled: true },
    data: { enabled: false, stoppedAt: now, stopOrigin: "fin-premium" },
  });
}

/** Filet quotidien : toute lettre active d'un compte qui n'est plus Premium passe en `fin-premium`. */
export async function rapprocherFinPremium(now: Date): Promise<number> {
  const res = await prisma.premiumLetterPreference.updateMany({
    where: { enabled: true, user: { is: { plan: { not: "PREMIUM" } } } },
    data: { enabled: false, stoppedAt: now, stopOrigin: "fin-premium" },
  });
  return res.count;
}

/** Journal des envois de l'hebdo : effacé après 12 mois (avis @legal §4.2). */
export async function purgerJournalHebdo(now: Date): Promise<number> {
  const limite = new Date(now);
  limite.setUTCMonth(limite.getUTCMonth() - LETTRE_HEBDO_JOURNAL_MOIS);
  const res = await prisma.newsletterSend.deleteMany({ where: { issue: { is: { audience: "HEBDO_PREMIUM" } }, createdAt: { lt: limite } } });
  return res.count;
}

/** Opérations d'effacement de la suppression de compte (avis @legal §6.3), à joindre à sa transaction. */
export function effacementLettreHebdo(userId: string, email: string) {
  return [
    prisma.premiumLetterPreference.deleteMany({ where: { userId } }),
    // Le journal n'a pas de clé vers User : la cascade ne l'atteint pas.
    prisma.newsletterSend.deleteMany({ where: { email: email.toLowerCase(), issue: { is: { audience: "HEBDO_PREMIUM" } } } }),
  ];
}
