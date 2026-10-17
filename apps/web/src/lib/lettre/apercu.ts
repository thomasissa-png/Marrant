import { prisma } from "@/lib/prisma";
import { envoiPrevuFixe } from "@/lib/lettre/numeros";

export interface ApercuLettre {
  /** Dernier numéro mensuel ENVOYÉ (preuve réelle, rien d'inventé ; spec §1.4). */
  dernier: { subject: string; bodyText: string } | null;
  /**
   * Date du prochain numéro VALIDÉ programmé (affichée seulement si elle existe ; spec §5),
   * et seulement si son `envoiPrevu` est fixé dans `numeros.json`.
   */
  prochain: Date | null;
}

/** Lecture pour `/lettre`. Base indisponible : rien d'affiché, jamais d'erreur visible. */
export async function lireApercuLettre(now: Date): Promise<ApercuLettre> {
  try {
    const [dernier, prochain] = await Promise.all([
      prisma.newsletterIssue.findFirst({
        where: { audience: "MENSUELLE", status: "ENVOYE" },
        orderBy: { sentAt: "desc" },
        select: { subject: true, bodyText: true },
      }),
      prisma.newsletterIssue.findFirst({
        where: { audience: "MENSUELLE", status: "VALIDE", scheduledFor: { gt: now } },
        orderBy: { scheduledFor: "asc" },
        select: { scheduledFor: true, periodKey: true },
      }),
    ]);
    return { dernier, prochain: prochain && envoiPrevuFixe(prochain.periodKey) ? prochain.scheduledFor : null };
  } catch (err) {
    console.error("[lettre] Aperçu illisible :", err instanceof Error ? err.message : err);
    return { dernier: null, prochain: null };
  }
}
