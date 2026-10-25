/**
 * Liste paginée des inscrits à la lettre pour la page admin (s21, 18/10).
 *
 * Colonnes lues : celles de la migration 9 seulement (la liste marche sans la
 * migration 14). Jamais `ipAddress` (empreinte IP), `userAgent`, ni les jetons de
 * confirmation ou de désinscription : `select` explicite, aucune autre colonne.
 * Compte du site et Premium : rapprochement par e-mail (casse ignorée).
 * Comptes de test : marqués (`compteTest`), jamais masqués de la liste.
 */
import { z } from "zod";
import { emplacementDeSource } from "@/config/lettre";
import { emailsExclus } from "@/lib/analytics/comptes-test";
import { destinatairesHebdo } from "@/lib/lettre/hebdo";

export const LETTRE_STATUTS = ["PENDING", "CONFIRMED", "UNSUBSCRIBED"] as const;

export const listeLettreQuery = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  statut: z.enum(LETTRE_STATUTS).optional(),
  q: z.string().trim().max(120).optional(),
});

export type ListeLettreQuery = z.infer<typeof listeLettreQuery>;

export type InscritLettre = {
  id: string;
  email: string;
  statut: (typeof LETTRE_STATUTS)[number];
  source: string | null;
  emplacement: string;
  consentAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  compteSite: boolean;
  premium: boolean;
  compteTest: boolean;
  /** s21 hebdo (H7-9) ; s22 : le compte reçoit la lettre de la semaine, donc la lettre du mois par le canal Premium (version Premium, une seule fois). */
  hebdo: boolean;
};

export type ListeLettre = {
  inscrits: InscritLettre[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function listerInscritsLettre(
  query: ListeLettreQuery,
  exclus: string[] = emailsExclus(),
): Promise<ListeLettre> {
  const { prisma } = await import("@/lib/prisma");
  const where = {
    ...(query.statut ? { status: query.statut } : {}),
    ...(query.q ? { email: { contains: query.q, mode: "insensitive" as const } } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { consentAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        email: true,
        status: true,
        source: true,
        consentAt: true,
        confirmedAt: true,
        unsubscribedAt: true,
      },
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);
  const comptes = rows.length
    ? await prisma.user.findMany({
        where: { OR: rows.map((r) => ({ email: { equals: r.email, mode: "insensitive" as const } })) },
        select: { email: true, plan: true },
      })
    : [];
  const parEmail = new Map(comptes.map((c) => [c.email.toLowerCase(), c.plan]));
  // Fonction unique « reçoit l'hebdo » : vide (sans lecture) tant que les envois de l'hebdo sont fermés.
  const hebdo = new Set(rows.length ? (await destinatairesHebdo()).map((d) => d.email) : []);
  return {
    inscrits: rows.map((r) => {
      const plan = parEmail.get(r.email.toLowerCase());
      return {
        id: r.id,
        email: r.email,
        statut: r.status,
        source: r.source,
        emplacement: emplacementDeSource(r.source) ?? "autre",
        consentAt: r.consentAt.toISOString(),
        confirmedAt: r.confirmedAt?.toISOString() ?? null,
        unsubscribedAt: r.unsubscribedAt?.toISOString() ?? null,
        compteSite: plan !== undefined,
        premium: plan === "PREMIUM",
        compteTest: exclus.includes(r.email.toLowerCase()),
        hebdo: hebdo.has(r.email.toLowerCase()),
      };
    }),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.max(1, Math.ceil(total / query.limit)) },
  };
}
