/**
 * Admin, Abonnés › Lettre : comptes de la lettre de la semaine (hebdo Premium, s21,
 * spec US-H7) et actions (arrêter, proposer, aperçu).
 * Jamais de jeton d'arrêt ni d'identifiant de session : `select` explicite.
 * Comptes de test marqués (`compteTest`), jamais masqués de la liste.
 * L'admin n'ACTIVE jamais la lettre pour quelqu'un (le consentement ne se donne pas pour autrui).
 */
import { z } from "zod";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { PROPOSITION_LETTRE_HEBDO } from "@/config/textes/lettre-hebdo-s21";
import { emailsExclus } from "@/lib/analytics/comptes-test";
import { avecDelai, LETTRE_EMAIL_TIMEOUT_MS, type EnvoyerEmail } from "@/lib/lettre/inscription";
import { corpsNumeroHebdo } from "@/lib/lettre/envoi-hebdo";
import { frPonctuation } from "@/lib/fr-typo";
/** s22 : invitation des abonnés existants supprimée (inscription d'office). Jamais à rouvrir sans nouveau texte. */
export const LETTRE_HEBDO_PROPOSITION_OUVERTE = false;

export const FILTRES_HEBDO = ["actives", "arretees", "premium-sans"] as const;

export const listeHebdoQuery = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  statut: z.enum(FILTRES_HEBDO).optional(),
  q: z.string().trim().max(120).optional(),
});
export type ListeHebdoQuery = z.infer<typeof listeHebdoQuery>;

export type CompteHebdo = {
  userId: string;
  email: string;
  enabled: boolean;
  activatedAt: string | null;
  activationOrigin: string | null;
  stoppedAt: string | null;
  stopOrigin: string | null;
  proposedAt: string | null;
  premium: boolean;
  compteTest: boolean;
};

export type ListeHebdo = {
  comptes: CompteHebdo[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

export async function listerComptesHebdo(query: ListeHebdoQuery, exclus: string[] = emailsExclus()): Promise<ListeHebdo> {
  const { prisma } = await import("@/lib/prisma");
  const recherche = query.q ? { email: { contains: query.q, mode: "insensitive" as const } } : {};
  const { ARRET_EXPLICITE } = await import("@/lib/lettre/hebdo");
  const pref = query.statut === "actives" ? { is: { enabled: true } } : query.statut === "arretees" ? { is: { enabled: false } } : { isNot: null };
  // s22 inscription d'office : un Premium est « sans la lettre » seulement après un arrêt explicite ou une opposition globale.
  const where =
    query.statut === "premium-sans"
      ? { plan: "PREMIUM" as const, ...recherche, OR: [{ emailOptOut: true }, { premiumLetter: { is: ARRET_EXPLICITE } }] }
      : { ...recherche, premiumLetter: pref };
  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        email: true,
        plan: true,
        premiumLetter: { select: { enabled: true, activatedAt: true, activationOrigin: true, stoppedAt: true, stopOrigin: true, proposedAt: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    comptes: rows.map((u) => ({
      userId: u.id,
      email: u.email,
      enabled: u.premiumLetter?.enabled ?? false,
      activatedAt: iso(u.premiumLetter?.activatedAt),
      activationOrigin: u.premiumLetter?.activationOrigin ?? null,
      stoppedAt: iso(u.premiumLetter?.stoppedAt),
      stopOrigin: u.premiumLetter?.stopOrigin ?? null,
      proposedAt: iso(u.premiumLetter?.proposedAt),
      premium: u.plan === "PREMIUM",
      compteTest: exclus.includes(u.email.toLowerCase()),
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.max(1, Math.ceil(total / query.limit)) },
  };
}

export type ResultatProposition = { statut: "envoyee" } | { statut: "fermee" | "inconnu" | "non-premium" | "opposition" | "deja-active" | "deja-proposee" | "echec" };

/**
 * Proposition unique (avis @legal §6.5) : inscriptions ouvertes seulement, Premium,
 * sans opposition globale, lettre pas active, jamais proposée. `proposedAt` réservé
 * AVANT l'envoi (une seule fois même en double clic), remis à vide si l'envoi échoue.
 * Le silence ne vaut jamais activation : rien d'autre n'est écrit.
 */
export async function proposerLettreHebdo(
  userId: string,
  deps: { envoyer: EnvoyerEmail; baseUrl: string; now: Date; inscriptionsOuvertes?: boolean; propositionOuverte?: boolean },
): Promise<ResultatProposition> {
  // s22 (25/10, décision de Thomas) : inscription d'office, plus d'invitation. Son texte (« tant que tu ne
  // coches pas la case ») serait faux : la proposition ne part plus, quel que soit l'interrupteur.
  if (!(deps.propositionOuverte ?? LETTRE_HEBDO_PROPOSITION_OUVERTE)) return { statut: "fermee" };
  if (!(deps.inscriptionsOuvertes ?? LETTRE_HEBDO_INSCRIPTIONS_OUVERTES)) return { statut: "fermee" };
  const { prisma } = await import("@/lib/prisma");
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, plan: true, emailOptOut: true, premiumLetter: { select: { enabled: true, proposedAt: true } } },
  });
  if (!u) return { statut: "inconnu" };
  if (u.plan !== "PREMIUM") return { statut: "non-premium" };
  if (u.emailOptOut) return { statut: "opposition" };
  if (u.premiumLetter?.enabled) return { statut: "deja-active" };
  if (u.premiumLetter?.proposedAt) return { statut: "deja-proposee" };
  let reservee: boolean;
  if (!u.premiumLetter) {
    try {
      await prisma.premiumLetterPreference.create({ data: { userId, enabled: false, proposedAt: deps.now } });
      reservee = true;
    } catch {
      reservee = false;
    }
  } else {
    reservee = (await prisma.premiumLetterPreference.updateMany({ where: { userId, proposedAt: null }, data: { proposedAt: deps.now } })).count > 0;
  }
  if (!reservee) return { statut: "deja-proposee" };
  try {
    const { sujet, corps } = PROPOSITION_LETTRE_HEBDO;
    await avecDelai(deps.envoyer(u.email, frPonctuation(sujet), frPonctuation(corps(deps.baseUrl))), LETTRE_EMAIL_TIMEOUT_MS, "Proposition de la lettre");
    return { statut: "envoyee" };
  } catch {
    await prisma.premiumLetterPreference.updateMany({ where: { userId }, data: { proposedAt: null } });
    return { statut: "echec" };
  }
}

/** Aperçu (spec H7-5) : le prochain numéro non envoyé, à l'adresse de l'admin SEULEMENT, objet « [Aperçu] ». */
export async function envoyerApercuHebdo(deps: { envoyer: EnvoyerEmail; baseUrl: string; now: Date; adresseAdmin: string }): Promise<"envoye" | "aucun"> {
  const { prisma } = await import("@/lib/prisma");
  const numero = await prisma.newsletterIssue.findFirst({
    where: { audience: "HEBDO_PREMIUM", status: { in: ["BROUILLON", "VALIDE"] }, scheduledFor: { gte: new Date(deps.now.getTime() - (3 * 24 + 16) * 3600 * 1000) } },
    orderBy: { scheduledFor: "asc" },
    select: { subject: true, bodyText: true },
  });
  if (!numero) return "aucun";
  await avecDelai(
    deps.envoyer(deps.adresseAdmin, `[Aperçu] ${frPonctuation(numero.subject)}`, corpsNumeroHebdo(numero.bodyText, deps.baseUrl, "apercu-sans-effet")),
    LETTRE_EMAIL_TIMEOUT_MS,
    "Aperçu de la lettre de la semaine",
  );
  return "envoye";
}
