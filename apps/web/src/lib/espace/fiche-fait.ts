/**
 * État « Fait » par fiche (s24, lot D5 ; architecture v20 2.7 point 8 « Voir / Fait », 4.4 état 1).
 *
 * « Fait » est DÉCLARÉ par l'abonné, par la ligne « Ton retour » sous le geste de la fiche (maquette
 * `carte-rafale.html`, valeurs fermées de 2.4) : « Essayé, bof » ou « Essayé, ça a marché » posent
 * `FicheFait` (une ligne par abonné et fiche, migration 24) ; « Pas essayé » la retire (statut « Voir »).
 * Écrire « ma réplique à moi » ne coche jamais « Fait » (2.7). Aucun point, aucune série (C4).
 */
import { prisma } from "@/lib/prisma";
import { RETOURS_GESTE, type RetourGeste } from "@/lib/espace/retours";
import { figerPremierPas } from "@/lib/espace/premier-pas-fige";

export { RETOURS_GESTE, type RetourGeste };

export async function declarerRetour(userId: string, ficheId: string, retour: RetourGeste): Promise<{ fait: boolean }> {
  if (retour === "pas-essaye") {
    await prisma.ficheFait.deleteMany({ where: { userId, ficheId } });
    return { fait: false };
  }
  await prisma.ficheFait.upsert({
    where: { userId_ficheId: { userId, ficheId } },
    update: { retour },
    create: { userId, ficheId, retour },
  });
  // Lot D7 : le premier pas est figé dès le « Fait » (un « Pas essayé » ensuite ne le défait pas).
  await figerPremierPas(userId);
  return { fait: true };
}

/** Retour déclaré sur une fiche (null : « Voir »). */
export async function lireRetour(userId: string, ficheId: string): Promise<RetourGeste | null> {
  const f = await prisma.ficheFait.findUnique({ where: { userId_ficheId: { userId, ficheId } }, select: { retour: true } });
  return f && (RETOURS_GESTE as readonly string[]).includes(f.retour) ? (f.retour as RetourGeste) : null;
}

/**
 * Premier pas fait (4.4 : « Aucune fiche faite » = état 1) : une fiche déclarée faite, ou une carte de
 * la rafale jouée (la situation a été jouée). Lecture seule.
 */
export async function auMoinsUneFicheFaite(userId: string): Promise<boolean> {
  const [faites, cartes] = await Promise.all([
    prisma.ficheFait.count({ where: { userId } }),
    prisma.carteReponse.count({ where: { userId } }),
  ]);
  return faites + cartes > 0;
}
