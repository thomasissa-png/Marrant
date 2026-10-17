import { prisma } from "@/lib/prisma";

export interface ApercuLettre {
  /** Dernier numéro mensuel ENVOYÉ (preuve réelle, rien d'inventé ; spec §1.4). */
  dernier: { subject: string; bodyText: string } | null;
  /** Date du prochain numéro VALIDÉ programmé (affichée seulement si elle existe ; spec §5). */
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
        select: { scheduledFor: true },
      }),
    ]);
    return { dernier, prochain: prochain?.scheduledFor ?? null };
  } catch (err) {
    console.error("[lettre] Aperçu illisible :", err instanceof Error ? err.message : err);
    return { dernier: null, prochain: null };
  }
}
