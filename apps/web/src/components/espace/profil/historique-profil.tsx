import { HistoriqueLectureSeule } from "@/components/espace/profil/historique-lecture-seule";

/**
 * Server Component asynchrone (s24, lot D10) : lit l'historique de l'ancien abonné puis le rend. Monté par
 * `profil/page.tsx` seulement interrupteur ouvert ; la page elle-même reste synchrone (rendu fermé inchangé).
 * Lecture chargée à la demande : fermé, la page n'importe ni la garde ni Prisma (rendu de test en jsdom).
 */
export async function HistoriqueProfil() {
  const { historiqueAncienAbonne } = await import("@/lib/espace/profil");
  return <HistoriqueLectureSeule {...await historiqueAncienAbonne()} />;
}
