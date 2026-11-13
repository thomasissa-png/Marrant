/**
 * Plafond de « Ma réplique à moi » (arbitrage @ux D5 n°1, `docs/ux/arbitrages-d5-s24.md`) : constante
 * UNIQUE, lue par le champ (`note-replique.tsx` : `maxLength`, compteur, message de limite), par le
 * serveur (`lib/espace/repliques.ts`, 400 au-delà) et égale à la contrainte CHECK de la migration 24.
 * Thomas peut changer le chiffre ici seulement (et dans la contrainte, par une migration).
 */
export const REPLIQUE_MAX_CLIENT = 200;
