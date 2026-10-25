/**
 * Lettre du mois, canal COMPTE (s22, décision de Thomas du 25/10 : « inscris les users gratuits
 * historiques aussi », version sans le PS Premium). Les comptes gratuits, actuels et futurs, reçoivent
 * la lettre du mois d'office, en version sans invitation, avec le pied « tu as un compte » et une
 * désinscription en un clic (même lien et même page que la lettre du mois : `desinscrireLettre`).
 *
 * « Reçoit par le canal compte » = UNE fonction (`recoitParCompte`) :
 *  - compte gratuit (plan différent de PREMIUM ; un Premium passe par le canal Premium) avec adresse ;
 *  - pas d'opposition globale (`User.emailOptOut`, posée aussi par le webhook des rebonds et plaintes) ;
 *  - jamais désinscrit par ce canal (`AccountLetterPreference.stoppedAt`, durable : un passage par
 *    Premium ne l'efface pas) ;
 *  - pas d'arrêt explicite de la lettre de la semaine (un ancien Premium qui l'avait arrêtée ne reçoit
 *    rien d'office ; `arretExplicite`) ;
 *  - adresse pas inscrite par adresse : `CONFIRMED` → canal gratuit, version complète (il l'a
 *    demandée) ; `UNSUBSCRIBED` → rien (il s'est désinscrit de la lettre du mois). `PENDING` (jamais
 *    confirmée) : canal compte.
 * Jeton de désinscription créé au premier envoi (`avecJetonsCompte`), jamais au déploiement.
 */
import { prisma } from "@/lib/prisma";
import { generateOpaqueToken } from "@/lib/newsletter";
import { arretExplicite, type PreferenceHebdo } from "@/lib/lettre/hebdo";

export interface CandidatCompte {
  id: string;
  email: string | null;
  plan: string;
  emailOptOut: boolean;
  premiumLetter: Pick<PreferenceHebdo, "enabled" | "stoppedAt" | "stopOrigin"> | null;
  monthlyLetter: { stoppedAt: Date | null; unsubscribeToken: string } | null;
}

/** Statut de l'adresse dans les inscrits par adresse (`NewsletterSubscriber`), s'il y en a un. */
export type StatutInscritAdresse = "PENDING" | "CONFIRMED" | "UNSUBSCRIBED" | null;

/** LA fonction « reçoit la lettre du mois par le canal compte ». Pure : testable sans base. */
export function recoitParCompte(u: CandidatCompte, inscrit: StatutInscritAdresse): boolean {
  if (!u.email || u.plan === "PREMIUM" || u.emailOptOut) return false;
  if (u.monthlyLetter?.stoppedAt) return false;
  if (arretExplicite(u.premiumLetter)) return false;
  return inscrit !== "CONFIRMED" && inscrit !== "UNSUBSCRIBED";
}

export interface DestinataireCompte {
  userId: string;
  email: string;
  /** Vide tant que la tâche d'envoi ne l'a pas créé (`avecJetonsCompte`). */
  unsubscribeToken: string | null;
}

/** Destinataires du canal compte (adresses en minuscules). Lecture seule. */
export async function destinatairesCompte(): Promise<DestinataireCompte[]> {
  const comptes: CandidatCompte[] = await prisma.user.findMany({
    where: { plan: { not: "PREMIUM" }, emailOptOut: false },
    select: {
      id: true,
      email: true,
      plan: true,
      emailOptOut: true,
      premiumLetter: { select: { enabled: true, stoppedAt: true, stopOrigin: true } },
      monthlyLetter: { select: { stoppedAt: true, unsubscribeToken: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  const adresses = comptes.map((u) => u.email?.toLowerCase()).filter((e): e is string => Boolean(e));
  const inscrits = adresses.length
    ? await prisma.newsletterSubscriber.findMany({ where: { email: { in: adresses } }, select: { email: true, status: true } })
    : [];
  const statut = new Map(inscrits.map((i) => [i.email.toLowerCase(), i.status as StatutInscritAdresse]));
  return comptes
    .filter((u) => recoitParCompte(u, statut.get((u.email ?? "").toLowerCase()) ?? null))
    .map((u) => ({ userId: u.id, email: (u.email as string).toLowerCase(), unsubscribeToken: u.monthlyLetter?.unsubscribeToken ?? null }));
}

const estDoublon = (err: unknown) => (err as { code?: string }).code === "P2002";

/** À l'envoi seulement : jeton de désinscription de chaque compte, créé s'il manque (idempotent). */
export async function avecJetonsCompte(destinataires: DestinataireCompte[]): Promise<Array<DestinataireCompte & { unsubscribeToken: string }>> {
  const prets: Array<DestinataireCompte & { unsubscribeToken: string }> = [];
  for (const d of destinataires) {
    let token = d.unsubscribeToken;
    if (!token) {
      try {
        token = (await prisma.accountLetterPreference.create({ data: { userId: d.userId, unsubscribeToken: generateOpaqueToken() }, select: { unsubscribeToken: true } })).unsubscribeToken;
      } catch (err) {
        if (!estDoublon(err)) throw err;
        token = (await prisma.accountLetterPreference.findUnique({ where: { userId: d.userId }, select: { unsubscribeToken: true } }))?.unsubscribeToken ?? null;
      }
    }
    // Sans jeton, pas d'envoi : jamais une lettre sans lien de désinscription.
    if (token) prets.push({ ...d, unsubscribeToken: token });
  }
  return prets;
}

/** Désinscription du canal compte par le jeton du lien (idempotente, durable). `false` : jeton inconnu. */
export async function desinscrireCompte(token: string, now: Date): Promise<boolean> {
  const pref = await prisma.accountLetterPreference.findUnique({ where: { unsubscribeToken: token }, select: { id: true, stoppedAt: true } });
  if (!pref) return false;
  if (!pref.stoppedAt) await prisma.accountLetterPreference.update({ where: { id: pref.id }, data: { stoppedAt: now } });
  return true;
}
