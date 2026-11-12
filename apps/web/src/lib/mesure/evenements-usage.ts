/**
 * Mesure d'usage serveur (s24, lot 0 ; R3 de `docs/analytics/resiliations-s23-analyse.md`, bloc B de
 * `docs/growth/onboarding-premium-s23-plan.md`). Table `UsageEvent`, migration 18.
 *
 * Une ligne par événement : identifiant de compte, type (liste fermée), date, détail fermé non
 * personnel. Aucun texte libre, ni e-mail, ni IP ; rien vers Umami ; le journal du Worker ne reçoit
 * que le type et un code d'erreur (jamais l'identifiant). HORS de tout interrupteur.
 *
 * Écriture JAMAIS bloquante : chaque fonction attrape tout (table absente, base en panne, doublon)
 * et rend `false`. Awaitée par l'appelant avant sa réponse (zéro fire-and-forget sous Workers).
 *
 * Déjà mesuré ailleurs, pas dupliqué ici :
 *  - bienvenue envoyé : ancre `onboarding-premium:E0:<userId>` (`lib/onboarding/journal-onboarding.ts`) ;
 *  - fin d'accès d'une résiliation : marqueur `onboarding-premium:FIN:<userId>` (même fichier) ;
 *  - validation d'étape (jour de pratique et « aha » relisibles) : `UserPathStepCompletion.completedAt`.
 *    Seul le quiz d'étape terminé (pratique sans trace datée) écrit un `jour_pratique`.
 */
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
  souscription: ["month", "year"],
  premier_acces_premium: [
    "liste-vannes", "liste-conseils", "liste-videos",
    "exercice-conseil", "exercice-video", "exercice-vanne",
    "carnet", "parcours",
  ],
  aha: ["etape", "exercice-conseil", "exercice-video", "exercice-vanne"],
  jour_pratique: ["quiz"],
  resiliation_programmee: MOTIFS_STRIPE,
  portail_ouvert: ["changer-formule", "resilier", "carte", "simple"],
  renouvellement_paye: ["month", "year"],
};
/** Slug de parcours (`parcours:<slug>`) ou numéro d'étape (`etape:<n>`). */
const AVEC_SUFFIXE = new Set(["parcours", "etape"]);
const SUFFIXE = /^[a-z0-9-]{1,80}$/;

/** Détail accepté tel quel s'il est dans la liste fermée du type, sinon `null` (jamais de texte libre). */
export function detailFerme(type: TypeEvenement, detail: string | null | undefined): string | null {
  if (!detail) return null;
  const [tete, suffixe, ...reste] = detail.split(":");
  if (reste.length > 0 || !DETAILS[type].includes(tete)) return null;
  if (suffixe === undefined) return detail;
  return AVEC_SUFFIXE.has(tete) && SUFFIXE.test(suffixe) ? detail : null;
}

/** Sous-ensemble Prisma de `UsageEvent` (injectable en test). */
export interface MesureDb {
  usageEvent: {
    create(args: {
      data: { userId: string; type: string; detail: string | null; occurredAt: Date; dedupKey: string | null };
    }): Promise<unknown>;
    findFirst(args: {
      where: { userId: string; type: { in: string[] } };
      orderBy: { occurredAt: "desc" };
      select: { type: true; occurredAt: true };
    }): Promise<{ type: string; occurredAt: Date } | null>;
  };
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
}

/** Écrit un événement. Doublon (`dedupKey` déjà pris) = `false` en silence. Ne lève jamais. */
export async function noterEvenement(type: TypeEvenement, userId: string, options: OptionsEvenement = {}): Promise<boolean> {
  if (!userId) return false;
  try {
    const db = options.db ?? dbParDefaut();
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

/** Événements notés une fois par souscription (le suivant revient après une nouvelle souscription). */
export type TypePremiereFois = "premier_acces_premium" | "aha";

/**
 * Premier accès à un CONTENU Premium, ou « aha » : abonné Premium (plan relu en base par l'appelant)
 * seulement. Une fois par souscription : si l'événement le plus récent parmi {souscription, type}
 * est déjà ce type, rien n'est écrit (1 requête indexée). Sinon une ligne, clé ancrée sur la date
 * de la dernière souscription (0 avant la mesure), qui absorbe deux requêtes simultanées.
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
    const dernier = await db.usageEvent.findFirst({
      where: { userId, type: { in: ["souscription", type] } },
      orderBy: { occurredAt: "desc" },
      select: { type: true, occurredAt: true },
    });
    if (dernier?.type === type) return false;
    const ancre = dernier ? Math.floor(dernier.occurredAt.getTime() / 1000) : 0;
    return await noterEvenement(type, userId, {
      detail,
      occurredAt: options.now ?? new Date(),
      dedupKey: cleUnique(type, userId, ancre),
      db,
    });
  } catch (err) {
    console.warn(`[mesure] ${type} non enregistré (${codeErreur(err)})`);
    return false;
  }
}

/** Exercice d'une fiche lu par un abonné : premier accès Premium ET « aha » (premier exercice ouvert). */
export async function noterExerciceOuvert(
  plan: string | null | undefined,
  userId: string | null | undefined,
  type: "conseil" | "video" | "vanne",
  options: { now?: Date; db?: MesureDb } = {},
): Promise<void> {
  const detail = `exercice-${type}`;
  await noterPremiereFois("premier_acces_premium", plan, userId, detail, options);
  await noterPremiereFois("aha", plan, userId, detail, options);
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

/** Une liste servie à un abonné dépasse-t-elle la limite gratuite (éléments au-delà du rang `limite`) ? */
export function depasseLimiteGratuite(debut: number, servis: number, limite: number): boolean {
  return servis > 0 && debut + servis > limite;
}
