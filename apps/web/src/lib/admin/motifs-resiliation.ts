/**
 * Compteur des motifs de résiliation (s23) pour l'admin : réponses à la question FACULTATIVE de
 * l'écran /resiliation (table `CancellationFeedback`, migration 17). Comptes seulement : jamais
 * d'identifiant ni d'adresse. Les mots libres ne sont pas listés ici (lecture en base si besoin).
 */
import { prisma } from "@/lib/prisma";
import { estTableAbsente } from "@/lib/analytics/weekly-lettre";
import { RESILIATION_RAISONS, type RaisonResiliation } from "@/config/resiliation";

export interface MotifsResiliation {
  disponible: true;
  /** Réponses enregistrées (au moins une raison ou un mot), toutes dates / 30 derniers jours. */
  reponses: number;
  reponses30j: number;
  avecMot: number;
  parRaison: Array<{ code: RaisonResiliation; libelle: string; total: number; total30j: number }>;
  derniere: string | null;
}

export type ReponseMotifsResiliation = MotifsResiliation | { disponible: false; raison: string };

export async function chargerMotifsResiliation(now: Date = new Date()): Promise<ReponseMotifsResiliation> {
  const depuis = new Date(now.getTime() - 30 * 24 * 3600_000);
  try {
    const lignes = await prisma.cancellationFeedback.findMany({
      select: { reasons: true, comment: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    const parRaison = RESILIATION_RAISONS.map(({ code, libelle }) => ({
      code,
      libelle,
      total: lignes.filter((l) => l.reasons.includes(code)).length,
      total30j: lignes.filter((l) => l.createdAt >= depuis && l.reasons.includes(code)).length,
    }));
    return {
      disponible: true,
      reponses: lignes.length,
      reponses30j: lignes.filter((l) => l.createdAt >= depuis).length,
      avecMot: lignes.filter((l) => (l.comment ?? "").trim().length > 0).length,
      parRaison,
      derniere: lignes[0]?.createdAt.toISOString() ?? null,
    };
  } catch (err) {
    if (estTableAbsente(err)) return { disponible: false, raison: "Table des motifs absente : migration 17 pas encore jouée." };
    throw err;
  }
}
