/**
 * Condition de vérité de la ligne des bonus (s24, lot D10b ; plan §6 T1 et T3, relecture @reviewer :
 * « un bonus ne s'ouvre que si sa fiche est rangée »). « Et à chaque cap franchi dans les parcours, un
 * bonus en plus. » n'est vraie que si les 4 bonus des caps 2 à 5 sont publiés : `data/espace/bonus.json`
 * valide (schéma des bonus, un seul par cap) et complet. Sinon la page d'offre et l'e-mail E0 gardent
 * leur texte actuel, interrupteur ouvert compris. Serveur seulement (zod et le fichier de données).
 */
import bonus from "@/data/espace/bonus.json";
import { validerBonus } from "@/lib/espace/fiches-schema";
import type { NumeroCap } from "@/lib/espace/caps";

/** Caps qui ouvrent un bonus (3.13, Q7) : un passage pour 2, 3 et 4, les coulisses pour 5. */
export const CAPS_A_BONUS: readonly NumeroCap[] = [2, 3, 4, 5];

/** Vrai seulement si le fichier est valide ET contient un bonus pour chacun des caps 2 à 5. */
export function bonusTousPublies(donnees: unknown = bonus): boolean {
  try {
    const caps = new Set<number>(validerBonus(donnees).map((b) => b.cap));
    return CAPS_A_BONUS.every((c) => caps.has(c));
  } catch {
    // Fichier invalide : la promesse n'est pas tenue, on ne l'affiche pas.
    return false;
  }
}
