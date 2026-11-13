/**
 * Chargement des données de la lecture de l'espace (s24, lot D9) : une requête agrégée par table, en
 * lecture seule, pour `GET /api/admin/espace-lecture`. Les identifiants de compte ne servent qu'à
 * rattacher les comptes entre tables ; `lectureEspace` les remplace par M-A, M-B… avant toute sortie.
 */
import { prisma } from "@/lib/prisma";
import type { DonneesLecture } from "@/lib/analytics/espace-lecture";
import { TYPES_EVENEMENT_ESPACE } from "@/lib/mesure/evenements-espace";

const enMap = (lignes: { userId: string; _count: { _all: number } }[]) => new Map(lignes.map((l) => [l.userId, l._count._all]));

export async function chargerDonneesLecture(): Promise<DonneesLecture> {
  const [evenements, missions, fiches, cartes, compteurs] = await Promise.all([
    prisma.usageEvent.findMany({
      where: { type: { in: [...TYPES_EVENEMENT_ESPACE] } },
      select: { userId: true, type: true, detail: true, occurredAt: true },
    }),
    prisma.missionRetour.groupBy({ by: ["userId"], where: { retour: { not: "pas-essaye" } }, _count: { _all: true } }),
    prisma.ficheFait.groupBy({ by: ["userId"], _count: { _all: true } }),
    prisma.carteReponse.groupBy({ by: ["userId"], _count: { _all: true } }),
    prisma.espaceCompteur.groupBy({ by: ["cle", "valeur"], _sum: { n: true } }),
  ]);
  return {
    evenements,
    missions: enMap(missions),
    fiches: enMap(fiches),
    cartes: enMap(cartes),
    compteurs: compteurs.map((c) => ({ cle: c.cle, valeur: c.valeur, n: c._sum.n ?? 0 })),
  };
}
