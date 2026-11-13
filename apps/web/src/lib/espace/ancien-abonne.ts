/**
 * Lignes de l'ancien abonné sur `/abonnement` (s24, lot D10 ; plan §6 T11, brief §3.8, architecture v20
 * 2.6). Serveur seulement. Interrupteur fermé : AUCUNE lecture (ni session ni base), aucune ligne.
 *
 * Ancien abonné = compte non PREMIUM qui a eu un abonnement Stripe (`lireAccesEspace`, garde du lot D0).
 * Chaque ligne ne dit que ce qui existe (lot D10b, relectures @elon et @reviewer) :
 * - étapes et favoris : les deux au-dessus de 0, la ligne d'origine ; un seul, sa partie seule
 *   (« Ta progression est gardée : … » ou « Tes favoris sont gardés : … ») ; aucun, rien ;
 * - questions et répliques : les deux, la ligne d'origine ; une seule sorte, sa phrase ; aucune, rien.
 * Une requête agrégée par table (`count`), rien n'est écrit.
 */
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { ANCIEN_ABONNE } from "@/config/textes/espace-textes-en-ligne";
import { prisma } from "@/lib/prisma";

export interface ComptesAncienAbonne {
  etapes: number;
  favoris: number;
  questions: number;
  repliques: number;
}

/** Lignes à afficher, dans l'ordre, à partir des nombres (pure, testée). */
export function lignesDepuisComptes(c: ComptesAncienAbonne): string[] {
  const lignes: string[] = [];
  if (c.etapes > 0 && c.favoris > 0) lignes.push(ANCIEN_ABONNE.progression(c.etapes, c.favoris));
  else if (c.etapes > 0) lignes.push(ANCIEN_ABONNE.etapesSeules(c.etapes));
  else if (c.favoris > 0) lignes.push(ANCIEN_ABONNE.favorisSeuls(c.favoris));
  if (c.questions > 0 && c.repliques > 0) lignes.push(ANCIEN_ABONNE.historique);
  else if (c.questions > 0) lignes.push(ANCIEN_ABONNE.questionsSeules);
  else if (c.repliques > 0) lignes.push(ANCIEN_ABONNE.repliquesSeules);
  return lignes;
}

/** Lignes de l'ancien abonné connecté ; [] fermé, visiteur, abonné actif, compte jamais abonné ou base en échec. */
export async function lignesAncienAbonne(publie: boolean = ESPACE_CLIENT_PUBLIE): Promise<string[]> {
  if (!publie) return [];
  try {
    // Garde chargée à la demande : fermé, la page d'offre n'importe ni la garde ni `next/server`.
    const { lireAccesEspace } = await import("@/lib/espace/garde");
    const acces = await lireAccesEspace();
    if (acces.acces !== "abonnement" || !acces.ancienAbonne) return [];
    const userId = acces.userId;
    const [etapes, favoris, questions, repliques] = await Promise.all([
      prisma.userPathStepCompletion.count({ where: { userId } }),
      prisma.userFavorite.count({ where: { userId } }),
      prisma.equipeFil.count({ where: { userId } }),
      prisma.userReplique.count({ where: { userId } }),
    ]);
    return lignesDepuisComptes({ etapes, favoris, questions, repliques });
  } catch {
    // Lignes de confort : en cas d'échec, la page d'offre s'affiche sans elles.
    return [];
  }
}
