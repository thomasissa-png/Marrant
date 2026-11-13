/**
 * Cartes « Et toi ? » tirées du carnet (s24, lots D5 et D5b ; architecture v20 1.4, 2.2, 2.3 ; plan §4 porte G5).
 *
 * Les fiches du carnet sont LUES sans modification (`lib/carnet.ts`, carnets déjà ouverts). Porte G5
 * franchie le 13/11 (`docs/founder-preferences.md` : Thomas valide les 28 fiches corrigées, « les 45
 * cartes du carnet peuvent alors entrer dans la rafale ») : l'ancien interrupteur unique est remplacé
 * par la LISTE des fiches relues. Seule une fiche de cette liste entre dans la rafale ; un carnet à venir
 * (décembre et suivants) n'y entre qu'une fois relu et ajouté ici (même porte, fiche par fiche).
 */
import { currentParisMonth, listPublishedCarnets, type Carnet } from "@/lib/carnet";
import { cartesDuCarnet, type CarteEtToi } from "@/lib/espace/rafale";

const jours = (mois: string, n: number): string[] => Array.from({ length: n }, (_, i) => `${mois}-${String(i + 1).padStart(2, "0")}`);

/**
 * Fiches du carnet relues (porte G5, 13/11) : octobre (15 fiches) et novembre (30), 17 validées d'emblée
 * et 28 corrigées (`docs/copy/espace/g5-corrections-carnet.md`, diff réel `g5-diff-reel.md`).
 */
export const FICHES_CARNET_RELUES: ReadonlySet<string> = new Set([...jours("2026-10", 15), ...jours("2026-11", 30)]);

/** Cartes du carnet servies à la rafale : fiches publiées ET relues. */
export function cartesCarnetRafale(
  relues: ReadonlySet<string> = FICHES_CARNET_RELUES,
  carnets?: Carnet[],
  maintenant: Date = new Date(),
): CarteEtToi[] {
  const fiches = listPublishedCarnets(carnets, maintenant).flatMap((c) => c.fiches);
  return cartesDuCarnet(fiches.filter((f) => relues.has(f.id)));
}

/**
 * Carnet du mois en retard (2.3) : aucune fiche relue du mois de Paris n'est publiée (carnet pas encore
 * sorti, ou pas encore relu). La rafale passe alors à une situation nouvelle un jour sur deux.
 */
export function carnetEnRetard(
  relues: ReadonlySet<string> = FICHES_CARNET_RELUES,
  carnets?: Carnet[],
  maintenant: Date = new Date(),
): boolean {
  const mois = currentParisMonth(maintenant);
  return !listPublishedCarnets(carnets, maintenant).some((c) => c.mois === mois && c.fiches.some((f) => relues.has(f.id)));
}
