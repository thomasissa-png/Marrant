/**
 * Condition de vérité de la ligne « Semaine 4 » du calendrier « Tes 4 premières semaines » (s24, lot
 * D11b, défaut @ux D-1) : « un exercice « Écouter, repérer » » n'est dit que si au moins une fiche
 * « Écouter, repérer » est publiée (`data/espace/ecouter.json` valide et non vide). Même mécanique que
 * `bonusTousPublies` (lot D10b). Serveur seulement (zod et le fichier de données) : `/api/espace/caps`
 * renvoie le résultat au calendrier, rendu côté navigateur.
 */
import ecouter from "@/data/espace/ecouter.json";
import { validerFichier } from "@/lib/espace/fiches-schema";

export function ecouterPublie(donnees: unknown = ecouter): boolean {
  try {
    return validerFichier("ecouter", donnees).length > 0;
  } catch {
    // Fichier invalide : rien n'est servi, la promesse ne s'affiche pas.
    return false;
  }
}
