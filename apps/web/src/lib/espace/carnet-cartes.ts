/**
 * Cartes « Et toi ? » tirées du carnet (s24, lot D5 ; architecture v20 1.4, 2.2, 2.3 ; plan §4 porte G5).
 *
 * Les fiches du carnet sont LUES sans modification (`lib/carnet.ts`, carnets déjà ouverts). Elles
 * n'entrent dans la rafale qu'après la porte G5 (relecture du carnet : tour de H10, diff complet de
 * `2026-11.json`, relecture d'octobre, retour à Thomas de toute fiche corrigée). Tant que G5 n'est pas
 * passée, `CARNET_DANS_LA_RAFALE` reste `false` : aucune carte du carnet, et le carnet garde son URL et
 * son extrait actuels. Le passer à `true` est une décision de Thomas (plan §4, G5).
 */
import { currentParisMonth, listPublishedCarnets, type Carnet } from "@/lib/carnet";
import { cartesDuCarnet, type CarteEtToi } from "@/lib/espace/rafale";

export const CARNET_DANS_LA_RAFALE: boolean = false;

/** Cartes du carnet servies à la rafale (aucune avant G5). */
export function cartesCarnetRafale(porteG5: boolean = CARNET_DANS_LA_RAFALE, carnets?: Carnet[], maintenant: Date = new Date()): CarteEtToi[] {
  if (!porteG5) return [];
  return cartesDuCarnet(listPublishedCarnets(carnets, maintenant).flatMap((c) => c.fiches));
}

/**
 * Carnet du mois en retard (2.3) : le carnet du mois de Paris n'est pas encore publié. La rafale passe
 * alors à une situation nouvelle un jour sur deux. Sans G5, le carnet n'alimente pas la rafale : jamais en retard.
 */
export function carnetEnRetard(porteG5: boolean = CARNET_DANS_LA_RAFALE, carnets?: Carnet[], maintenant: Date = new Date()): boolean {
  if (!porteG5) return false;
  return !listPublishedCarnets(carnets, maintenant).some((c) => c.mois === currentParisMonth(maintenant));
}
