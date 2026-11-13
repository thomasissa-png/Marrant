/**
 * Bonus des caps (s24, lot D4 ; niveaux-xp-s24.md 5.3 à 5.5, critères 14 à 19). Côté serveur.
 *
 * - Un bonus s'ouvre par le cap de DÉBLOCAGE (étapes et bonus de fin), jamais par `User.xp`.
 * - Un bonus non ouvert est absent partout : il n'est dans aucune liste de fiches (`lib/espace/fiches.ts`),
 *   ni la recherche, ni les favoris, ni la rafale, ni la cloche (aucun de ces modules ne lit
 *   `data/espace/bonus.json`, test) ; son adresse directe répond la vraie 404 du site.
 * - Une seule porte par bonus (5.4) : la fiche `/mon-espace/bonus/{id}` ; « Tes bonus » et « Ouvrir »
 *   y mènent. La Bibliothèque (lot D6) la listera au même endroit.
 */
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { chargeursFiches } from "@/lib/espace/fiches";
import type { FicheBonus } from "@/lib/espace/fiches-schema";
import type { AccesEspace } from "@/lib/espace/garde";
import type { BonusRange, NumeroCap } from "@/lib/espace/caps";

export const hrefBonus = (id: string) => `${ESPACE_ACCUEIL}/bonus/${encodeURIComponent(id)}`;

/** Bonus effectivement rangés (fiches présentes), pour les annonces ; vide hors abonné actif. */
export function bonusRanges(acces: AccesEspace, chargeurs = chargeursFiches): BonusRange[] {
  return chargeurs.bonusOuverts(5, acces).map((b) => ({ cap: b.cap as NumeroCap, id: b.id, titre: b.titre }));
}

export interface BonusOuvert {
  cap: NumeroCap;
  id: string;
  titre: string;
  href: string;
  dureeMinutes: number;
}

/** Bonus ouverts au cap de déblocage donné, du plus récent (cap le plus haut) au plus ancien. */
export function bonusOuverts(capDeblocage: NumeroCap, acces: AccesEspace, chargeurs = chargeursFiches): BonusOuvert[] {
  return chargeurs
    .bonusOuverts(capDeblocage, acces)
    .map((b) => ({ cap: b.cap as NumeroCap, id: b.id, titre: b.titre, href: hrefBonus(b.id), dureeMinutes: b.dureeMinutes }))
    .sort((a, b) => b.cap - a.cap);
}

/** Un bonus par son id, s'il est ouvert ; sinon null (la page répond la 404 du site). */
export function trouverBonusOuvert(
  id: string,
  capDeblocage: NumeroCap,
  acces: AccesEspace,
  chargeurs = chargeursFiches,
): FicheBonus | null {
  return chargeurs.trouverBonus(id, capDeblocage, acces);
}
