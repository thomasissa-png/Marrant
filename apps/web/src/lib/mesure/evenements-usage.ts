/**
 * Mesure d'usage serveur (s24, lot 0 ; R3 de `docs/analytics/resiliations-s23-analyse.md`, bloc B de
 * `docs/growth/onboarding-premium-s23-plan.md`). Table `UsageEvent`, migration 18. Définitions :
 * brief `docs/espace-client/brief-espace-client-s24.md` §5.2.
 *
 * Une ligne par événement : identifiant de compte, type (liste fermée), date, détail fermé non
 * personnel. Aucun texte libre, ni e-mail, ni IP ; rien vers Umami ; le journal du Worker ne reçoit
 * que le type et un code d'erreur (jamais l'identifiant). HORS de tout interrupteur.
 * C7 (`docs/legal/onboarding-e1-resilies-s23.md`) : le motif de résiliation ne personnalise JAMAIS
 * un e-mail ; il ne sert qu'à la lecture agrégée de la mesure.
 *
 * Écriture JAMAIS bloquante : chaque fonction attrape tout (table absente, base en panne, doublon)
 * et rend `false`. Awaitée par l'appelant avant sa réponse (zéro fire-and-forget sous Workers).
 *
 * Déjà mesuré ailleurs, pas dupliqué ici :
 *  - bienvenue envoyé : ancre `onboarding-premium:E0:<userId>` (`lib/onboarding/journal-onboarding.ts`) ;
 *  - fin d'accès d'une résiliation : marqueur `onboarding-premium:FIN:<userId>` (même fichier) ;
 *  - validation d'étape (jour de pratique relisible) : `UserPathStepCompletion.completedAt`.
 *    Seul le quiz d'étape terminé (pratique sans trace datée) écrit un `jour_pratique`.
 */
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { parisDayNumber } from "@/lib/progression";

export const TYPES_EVENEMENT = [
  "souscription",
  "premier_acces_premium",
  "aha",
  "jour_pratique",
  "resiliation_programmee",
  "portail_ouvert",
  "renouvellement_paye",
  // s24, lot D9 (espace client) : écrits SEULEMENT interrupteur ouvert, par `lib/mesure/evenements-espace.ts`.
  "espace_ouvert",
  "cloche_ouverte",
  "bonus_ouvert",
  "cap_atteint",
  "replique_ecrite",
  "question_envoyee",
] as const;
export type TypeEvenement = (typeof TYPES_EVENEMENT)[number];

/** Motifs du portail Stripe (`cancellation_details.feedback`). Le commentaire libre n'est jamais lu. */
export const MOTIFS_STRIPE = [
  "too_expensive",
  "missing_features",
  "switched_service",
  "unused",
  "customer_service",
  "too_complex",
  "low_quality",
  "other",
] as const;

/** Détails admis par type (valeur exacte, ou `tête:suffixe` pour les têtes de `AVEC_SUFFIXE`). */
const DETAILS: Record<TypeEvenement, readonly string[]> = {
  souscription: ["month", "year", "iap"],
  // Pas de listes : toutes les pages des listes sont publiques (§5.2).
  premier_acces_premium: ["exercice-conseil", "exercice-video", "exercice-vanne", "carnet", "etape"],
  aha: ["etape", "quiz"],
  jour_pratique: ["quiz"],
  resiliation_programmee: MOTIFS_STRIPE,
  portail_ouvert: ["changer-formule", "resilier", "carte", "simple"],
  renouvellement_paye: ["month", "year", "iap"],
  // Lot D9 : aucun détail, sauf le seul numéro de cap (`cap:<n>`). Jamais le texte d'une réplique ou d'une question.
  espace_ouvert: [],
  cloche_ouverte: [],
  bonus_ouvert: ["cap"],
  cap_atteint: ["cap"],
  replique_ecrite: [],
  question_envoyee: [],
};
/** Suffixe admis par tête : numéro d'étape (`etape:<n>`, `quiz:<n>`), numéro de cap (`cap:1` à `cap:5`). */
const AVEC_SUFFIXE: Record<string, RegExp> = { etape: /^[0-9]{1,3}$/, quiz: /^[0-9]{1,3}$/, cap: /^[1-5]$/ };

/** Détail accepté tel quel s'il est dans la liste fermée du type, sinon `null` (jamais de texte libre). */
export function detailFerme(type: TypeEvenement, detail: string | null | undefined): string | null {
  if (!detail) return null;
  const [tete, suffixe, ...reste] = detail.split(":");
  if (reste.length > 0 || !DETAILS[type].includes(tete)) return null;
  const motif = AVEC_SUFFIXE[tete];
  // `etape` et `quiz` seuls restent admis (comme avant D9) ; `cap` exige son numéro.
  if (suffixe === undefined) return tete === "cap" ? null : detail;
  return motif?.test(suffixe) ? detail : null;
}

/** Sous-ensemble Prisma utilisé ici (injectable en test). */
export interface MesureDb {
  usageEvent: {
    create(args: {
      data: { userId: string; type: string; detail: string | null; occurredAt: Date; dedupKey: string | null };
    }): Promise<unknown>;
    findUnique(args: { where: { dedupKey: string }; select: { id: true } }): Promise<{ id: string } | null>;
  };
  subscription: {
    findUnique(args: { where: { userId: string }; select: { stripeSubscriptionId: true } }): Promise<{ stripeSubscriptionId: string | null } | null>;
  };
  webhookEvent: {
    findUnique(args: { where: { eventId: string }; select: { id: true } }): Promise<{ id: string } | null>;
  };
}

/**
 * Opposition à la mesure (sans migration) : marqueur `WebhookEvent` d'`eventId`
 * `mesure-usage:opposition:<userId>`, posé à la main (procédure de `REPLIT_ACTIONS.md`), même
 * patron que les marqueurs de l'onboarding. Lu avant CHAQUE écriture : un compte opposé n'a plus
 * aucune ligne écrite. Lecture impossible = pas d'écriture (en cas de doute, on n'écrit pas).
 */
export const PREFIXE_OPPOSITION = "mesure-usage:opposition:";

export function cleOpposition(userId: string): string {
  return `${PREFIXE_OPPOSITION}${userId}`;
}

async function estOppose(db: MesureDb, userId: string): Promise<boolean> {
  return !!(await db.webhookEvent.findUnique({ where: { eventId: cleOpposition(userId) }, select: { id: true } }));
}

const dbParDefaut = (): MesureDb => prisma as unknown as MesureDb;

function codeErreur(err: unknown): string {
  const code = (err as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : err instanceof TypeError ? "type" : "inconnue";
}

/** Clé d'unicité : `<type>:<compte>:<marque>` (marque = date en secondes, jour de Paris…). */
export function cleUnique(type: TypeEvenement, userId: string, marque: string | number): string {
  return `${type}:${userId}:${marque}`;
}

export interface OptionsEvenement {
  detail?: string | null;
  occurredAt?: Date;
  dedupKey?: string | null;
  db?: MesureDb;
  /** Opposition déjà lue dans la même requête (évite une 2e lecture). */
  oppositionLue?: boolean;
}

/** Écrit un événement. Doublon (`dedupKey` déjà pris) = `false` en silence. Ne lève jamais. */
export async function noterEvenement(type: TypeEvenement, userId: string, options: OptionsEvenement = {}): Promise<boolean> {
  if (!userId) return false;
  try {
    const db = options.db ?? dbParDefaut();
    if (!options.oppositionLue && (await estOppose(db, userId))) return false;
    await db.usageEvent.create({
      data: {
        userId,
        type,
        detail: detailFerme(type, options.detail),
        occurredAt: options.occurredAt ?? new Date(),
        dedupKey: options.dedupKey ?? null,
      },
    });
    return true;
  } catch (err) {
    const code = codeErreur(err);
    if (code !== "P2002") console.warn(`[mesure] ${type} non enregistré (${code})`);
    return false;
  }
}

/** Événements notés une fois par souscription (le suivant revient avec un nouvel abonnement). */
export type TypePremiereFois = "premier_acces_premium" | "aha";

/** Empreinte courte et non réversible de l'abonnement Stripe (l'identifiant n'est jamais stocké). */
function empreinte(valeur: string): string {
  return createHash("sha256").update(valeur).digest("hex").slice(0, 16);
}

/**
 * Premier accès à un CONTENU Premium, ou « aha » : abonné Premium (plan relu en base par l'appelant)
 * seulement. Une fois par abonnement : la clé est ancrée sur l'abonnement Stripe en cours
 * (`Subscription.stripeSubscriptionId`, posé par l'activation AVANT le passage en Premium, que
 * l'activation vienne du webhook ou de la page de succès). Un réabonnement = nouvel abonnement =
 * nouvelle clé, même si la ligne `souscription` n'est pas encore écrite (pas de course).
 * Sans abonnement Stripe (achat dans l'application) : une fois par compte.
 */
export async function noterPremiereFois(
  type: TypePremiereFois,
  plan: string | null | undefined,
  userId: string | null | undefined,
  detail: string,
  options: { now?: Date; db?: MesureDb } = {},
): Promise<boolean> {
  if (plan !== "PREMIUM" || !userId) return false;
  try {
    const db = options.db ?? dbParDefaut();
    if (await estOppose(db, userId)) return false;
    const abonnement = await db.subscription.findUnique({ where: { userId }, select: { stripeSubscriptionId: true } });
    const ancre = abonnement?.stripeSubscriptionId ? empreinte(abonnement.stripeSubscriptionId) : "sans-stripe";
    const dedupKey = cleUnique(type, userId, ancre);
    if (await db.usageEvent.findUnique({ where: { dedupKey }, select: { id: true } })) return false;
    return await noterEvenement(type, userId, { detail, occurredAt: options.now ?? new Date(), dedupKey, db, oppositionLue: true });
  } catch (err) {
    console.warn(`[mesure] ${type} non enregistré (${codeErreur(err)})`);
    return false;
  }
}

/** Jour de pratique sans trace datée ailleurs (quiz d'étape terminé). Un par jour civil de Paris. */
export async function noterJourPratique(userId: string, detail: "quiz", options: { now?: Date; db?: MesureDb } = {}): Promise<boolean> {
  const now = options.now ?? new Date();
  return noterEvenement("jour_pratique", userId, {
    detail,
    occurredAt: now,
    dedupKey: cleUnique("jour_pratique", userId, parisDayNumber(now)),
    db: options.db,
  });
}
