/**
 * « Où veux-tu être plus à l'aise ? » (décision C9 du 12/11, architecture 4.2) : posée une seule
 * fois, après le premier pas, gardée sur le compte (`EspaceCompte.aise`, migration 20). La première
 * réponse est la bonne : une deuxième ne remplace rien. Serveur seulement.
 */
import { prisma } from "@/lib/prisma";

export const REPONSES_AISE = ["POTES", "BOULOT", "PLAIRE", "PARTOUT"] as const;
export type ReponseAise = (typeof REPONSES_AISE)[number];

export async function lireAise(userId: string): Promise<ReponseAise | null> {
  const compte = await prisma.espaceCompte.findUnique({ where: { userId }, select: { aise: true } });
  return REPONSES_AISE.includes(compte?.aise as ReponseAise) ? (compte?.aise as ReponseAise) : null;
}

/** Enregistre la réponse si aucune n'existe ; `deja` = une réponse était déjà gardée (rien changé). */
export async function enregistrerAise(userId: string, aise: ReponseAise, maintenant: Date = new Date()): Promise<{ deja: boolean }> {
  const { count } = await prisma.espaceCompte.updateMany({ where: { userId, aise: null }, data: { aise, aiseLe: maintenant } });
  if (count > 0) return { deja: false };
  const existant = await prisma.espaceCompte.findUnique({ where: { userId }, select: { aise: true } });
  if (existant) return { deja: true };
  try {
    await prisma.espaceCompte.create({ data: { userId, aise, aiseLe: maintenant } });
    return { deja: false };
  } catch {
    // Création concurrente (double clic) : la première réponse est gardée.
    return { deja: true };
  }
}
