import { prisma } from "@/lib/prisma";
import { versionGratuite } from "@/lib/lettre/invitation-premium";

export interface ApercuLettre {
  /** Dernier numéro mensuel ENVOYÉ (preuve réelle, rien d'inventé ; spec §1.4). */
  dernier: { subject: string; bodyText: string } | null;
}

/**
 * Lecture pour `/lettre`. Base indisponible : rien d'affiché, jamais d'erreur visible.
 * La date du prochain numéro n'est jamais affichée sur le site (décision de
 * Thomas du 17/10), même quand `envoiPrevu` est fixé.
 */
export async function lireApercuLettre(): Promise<ApercuLettre> {
  try {
    const dernier = await prisma.newsletterIssue.findFirst({
      where: { audience: "MENSUELLE", status: "ENVOYE" },
      orderBy: { sentAt: "desc" },
      select: { subject: true, bodyText: true },
    });
    // s22 : version gratuite (marqueurs de l'invitation Premium retirés), comme dans l'e-mail.
    return { dernier: dernier ? { subject: dernier.subject, bodyText: versionGratuite(dernier.bodyText) ?? dernier.bodyText } : null };
  } catch (err) {
    console.error("[lettre] Aperçu illisible :", err instanceof Error ? err.message : err);
    return { dernier: null };
  }
}
