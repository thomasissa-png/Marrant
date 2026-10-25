/**
 * Lettre de la semaine (hebdomadaire Premium, s21 ; s22 inscription d'office) : qui la reçoit, arrêt, reprise.
 * Spec `docs/product/lettre-hebdo-premium-s21.md` §4 ; décision de Thomas du 25/10 (`docs/founder-preferences.md`).
 *
 * Règle d'or de cohérence (spec §4.2) : « reçoit l'hebdo » est UNE fonction
 * (`recoitHebdo`, appliquée par `destinatairesHebdo`), utilisée par la tâche du
 * jeudi ET par le canal Premium de la lettre du mois (`envoi.ts`, s22 : la semaine de la lettre du
 * mois, les abonnés la reçoivent à la place d'une lettre réservée).
 *
 * s22 (25/10, décision de Thomas) : inscription d'office de tous les abonnés Premium, actuels et
 * futurs. Reçoit l'hebdo = interrupteur `LETTRE_HEBDO_ENVOIS_OUVERTS` ouvert, plan PREMIUM (l'accès :
 * `cancelAtPeriodEnd` et `PAST_DUE` le gardent, le webhook le retire aux statuts de fin), pas
 * d'opposition globale (`User.emailOptOut`, sans exception) et pas d'ARRÊT EXPLICITE
 * (`arretExplicite`). Sans ligne de préférence : inscrit.
 *
 * Aucune condition de vérification d'adresse (s22, correction du 25/10) : le site ne vérifie jamais
 * l'adresse des comptes à mot de passe (en production, les 4 Premium ont `emailVerified` vide, un seul
 * est un compte Google). Un Premium payant est destinataire ; une adresse morte est arrêtée par le
 * webhook des rebonds (`stopOrigin` `rebond`, `emailOptOut`).
 *
 * Arrêt explicite = ligne arrêtée (`enabled` faux, `stoppedAt` posé) pour une autre raison que la fin
 * de Premium : profil, lien de l'e-mail, admin, rebond, plainte. Il reste valable pour toujours, même
 * après une fin de Premium et un réabonnement : seul l'abonné le lève, en réactivant depuis son profil.
 * La fin de Premium (`fin-premium`) n'est pas un choix de l'abonné : un réabonné est inscrit d'office,
 * comme tout nouvel abonné, sauf s'il avait arrêté lui-même avant.
 *
 * Jeton d'arrêt : créé à l'envoi (`avecJetonsHebdo`, par la tâche du jeudi, idempotent), jamais par
 * une écriture de masse au déploiement.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  LETTRE_HEBDO_ENVOIS_OUVERTS,
  LETTRE_HEBDO_JOURNAL_MOIS,
  type LettreHebdoOrigineActivation,
  type LettreHebdoOrigineArret,
} from "@/config/lettre";
import { generateOpaqueToken } from "@/lib/newsletter";

/** Pré-filtre en base (sur-ensemble) ; la décision finale reste `recoitHebdo`. */
export const FILTRE_CANDIDAT_HEBDO = {
  plan: "PREMIUM",
  emailOptOut: false,
} satisfies Prisma.UserWhereInput;

export const SELECT_CANDIDAT_HEBDO = {
  id: true,
  email: true,
  plan: true,
  emailOptOut: true,
  premiumLetter: { select: { enabled: true, stoppedAt: true, stopOrigin: true, unsubscribeToken: true } },
} satisfies Prisma.UserSelect;

export interface PreferenceHebdo {
  enabled: boolean;
  stoppedAt: Date | null;
  stopOrigin: string | null;
  unsubscribeToken: string | null;
}

export interface CandidatHebdo {
  id: string;
  email: string | null;
  plan: string;
  emailOptOut: boolean;
  premiumLetter: PreferenceHebdo | null;
}

/** Arrêt demandé (abonné, équipe, messagerie), à respecter toujours. La fin de Premium n'en est pas un. */
export function arretExplicite(pref: Pick<PreferenceHebdo, "enabled" | "stoppedAt" | "stopOrigin"> | null | undefined): boolean {
  return Boolean(pref && !pref.enabled && pref.stoppedAt && pref.stopOrigin !== "fin-premium");
}

/** Ligne arrêtée explicitement (même règle que `arretExplicite`, côté base ; compteurs et liste de l'admin). */
export const ARRET_EXPLICITE = {
  enabled: false,
  stoppedAt: { not: null },
  OR: [{ stopOrigin: null }, { stopOrigin: { not: "fin-premium" } }],
} satisfies Prisma.PremiumLetterPreferenceWhereInput;

/** Ligne « pas arrêtée explicitement » (même règle que `arretExplicite`, côté base). */
const PAS_ARRETEE = {
  OR: [{ enabled: true }, { stoppedAt: null }, { stopOrigin: "fin-premium" }],
} satisfies Prisma.PremiumLetterPreferenceWhereInput;

/** LA fonction « reçoit l'hebdo ». Pure : testable sans base. */
export function recoitHebdo(u: CandidatHebdo, envoisOuverts: boolean = LETTRE_HEBDO_ENVOIS_OUVERTS): boolean {
  if (!envoisOuverts || !u.email || u.plan !== "PREMIUM" || u.emailOptOut) return false;
  return !arretExplicite(u.premiumLetter);
}

export interface DestinataireHebdo {
  userId: string;
  email: string;
  /** Vide tant que la tâche du jeudi ne l'a pas créé (`avecJetonsHebdo`). */
  unsubscribeToken: string | null;
}

/** Destinataires de l'hebdo (vide si l'interrupteur des envois est fermé). Adresses en minuscules. Lecture seule. */
export async function destinatairesHebdo(envoisOuverts: boolean = LETTRE_HEBDO_ENVOIS_OUVERTS): Promise<DestinataireHebdo[]> {
  if (!envoisOuverts) return [];
  const candidats: CandidatHebdo[] = await prisma.user.findMany({
    where: FILTRE_CANDIDAT_HEBDO,
    select: SELECT_CANDIDAT_HEBDO,
    orderBy: { createdAt: "asc" },
  });
  return candidats
    .filter((u) => recoitHebdo(u, envoisOuverts))
    .map((u) => ({ userId: u.id, email: (u.email as string).toLowerCase(), unsubscribeToken: u.premiumLetter?.unsubscribeToken ?? null }));
}

const estDoublon = (err: unknown) => (err as { code?: string }).code === "P2002";

/**
 * Jeton d'arrêt d'un inscrit d'office, créé au premier envoi puis stable. Idempotent et sûr en
 * concurrence : sans ligne, création (inscrit, origine `office`) ; ligne sans jeton, jeton posé
 * seulement s'il manque. Ne touche jamais à l'état d'arrêt.
 */
async function jetonArretHebdo(userId: string, now: Date): Promise<string | null> {
  const existant = await prisma.premiumLetterPreference.findUnique({ where: { userId }, select: { unsubscribeToken: true } });
  if (existant?.unsubscribeToken) return existant.unsubscribeToken;
  if (existant) {
    await prisma.premiumLetterPreference.updateMany({ where: { userId, unsubscribeToken: null }, data: { unsubscribeToken: generateOpaqueToken() } });
  } else {
    try {
      await prisma.premiumLetterPreference.create({
        data: { userId, enabled: true, activatedAt: now, activationOrigin: "office", unsubscribeToken: generateOpaqueToken() },
      });
    } catch (err) {
      if (!estDoublon(err)) throw err;
    }
  }
  return (await prisma.premiumLetterPreference.findUnique({ where: { userId }, select: { unsubscribeToken: true } }))?.unsubscribeToken ?? null;
}

/** À l'envoi seulement (tâche du jeudi) : chaque destinataire reçoit son jeton d'arrêt, créé s'il manque. */
export async function avecJetonsHebdo(destinataires: DestinataireHebdo[], now: Date): Promise<Array<DestinataireHebdo & { unsubscribeToken: string }>> {
  const prets: Array<DestinataireHebdo & { unsubscribeToken: string }> = [];
  for (const d of destinataires) {
    const unsubscribeToken = d.unsubscribeToken ?? (await jetonArretHebdo(d.userId, now));
    // Sans jeton, pas d'envoi : jamais une lettre sans lien d'arrêt.
    if (unsubscribeToken) prets.push({ ...d, unsubscribeToken });
  }
  return prets;
}

export type ResultatActivation = "activee" | "deja-activee";

/**
 * Reprise depuis le profil (réglage réactivé). Inscrit d'office (sans ligne, ou ligne pas arrêtée
 * explicitement) : rien à écrire. Après un arrêt explicite : la trace d'arrêt est effacée, nouvelle
 * date et origine. Écriture conditionnelle : deux requêtes concurrentes, une seule reprise.
 */
export async function activerLettreHebdo(userId: string, origine: LettreHebdoOrigineActivation, now: Date): Promise<ResultatActivation> {
  const existant = await prisma.premiumLetterPreference.findUnique({ where: { userId }, select: { enabled: true, stoppedAt: true, stopOrigin: true } });
  if (!arretExplicite(existant)) return "deja-activee";
  const pris = await prisma.premiumLetterPreference.updateMany({
    where: { userId, enabled: false, stoppedAt: { not: null } },
    data: { enabled: true, activatedAt: now, activationOrigin: origine, stoppedAt: null, stopOrigin: null },
  });
  return pris.count > 0 ? "activee" : "deja-activee";
}

export type ResultatArret = "arretee" | "deja-arretee" | "inconnu";

/**
 * Arrêt explicite d'un compte (profil, lien, admin). Idempotent : un arrêt explicite n'est jamais
 * réécrit. Inscrit d'office sans ligne : l'arrêt crée la ligne (jeton compris), pour être respecté
 * à vie. Une ligne `fin-premium` (pas un choix) devient un arrêt explicite.
 */
export async function arreterLettreHebdo(userId: string, origine: LettreHebdoOrigineArret, now: Date, essai = 0): Promise<ResultatArret> {
  const arret = { enabled: false, stoppedAt: now, stopOrigin: origine };
  const res = await prisma.premiumLetterPreference.updateMany({ where: { userId, ...PAS_ARRETEE }, data: arret });
  if (res.count > 0) return "arretee";
  if ((await prisma.premiumLetterPreference.count({ where: { userId } })) > 0) return "deja-arretee";
  if (!(await prisma.user.findUnique({ where: { id: userId }, select: { id: true } }))) return "inconnu";
  try {
    await prisma.premiumLetterPreference.create({ data: { userId, ...arret, unsubscribeToken: generateOpaqueToken() } });
    return "arretee";
  } catch (err) {
    // Ligne créée entre-temps (premier envoi, double clic) : on repasse par l'écriture conditionnelle.
    if (!estDoublon(err) || essai > 0) throw err;
    return arreterLettreHebdo(userId, origine, now, essai + 1);
  }
}

/** Arrêt par le jeton du lien (page d'arrêt, en-tête un clic). Marche interrupteurs fermés. */
export async function arreterLettreHebdoParJeton(token: string, now: Date): Promise<ResultatArret> {
  const pref = await prisma.premiumLetterPreference.findUnique({ where: { unsubscribeToken: token }, select: { userId: true } });
  if (!pref) return "inconnu";
  return arreterLettreHebdo(pref.userId, "lien-email", now);
}

/**
 * Fin de Premium (avis @legal §6.2) : à joindre à la transaction qui passe le plan à
 * FREE (webhook Stripe, remboursement, RevenueCat, admin). Trace seulement (s22) : `fin-premium`
 * n'est pas un arrêt explicite, un réabonné est donc inscrit d'office ; un arrêt explicite
 * antérieur n'est jamais écrasé (`enabled: true` seulement). Le rapprochement quotidien reste un filet.
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
