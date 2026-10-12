/**
 * Garde-fou du seed de développement (`prisma/seed-data.ts`, s20).
 *
 * Le seed renomme, réactive et désactive des vannes et des conseils, recrée les
 * étapes des parcours et réécrit les vidéos : lancé sur une copie de la base de
 * prod (branche Neon de test, restauration), il fausserait le catalogue sans
 * bruit (diagnostic `docs/qa/diagnostic-vannes-s11-s20.md` §3.2 : 124 vannes
 * validées désactivées, 57 créées). Règle :
 * - base vierge (aucun utilisateur, aucun marqueur `DataPatch`) : seed autorisé
 *   (installation locale, Postgres jetable des scripts de QA) ;
 * - sinon (données réelles ou base déjà démarrée par l'application) : refus,
 *   sauf si `MARRANT_SEED_CONFIRM_HOST` vaut exactement l'hôte de
 *   `DATABASE_URL`. La confirmation est liée à la base visée : une valeur
 *   restée dans un `.env` ne peut pas autoriser une autre base.
 * Le blocage `NODE_ENV=production` (build Replit) reste en amont, inchangé.
 */

export const SEED_CONFIRM_ENV = "MARRANT_SEED_CONFIRM_HOST";

export interface SeedTargetState {
  /** Nombre de lignes `User` (comptes réels ou de test). */
  users: number;
  /** Nombre de lignes `DataPatch` (écrites par les tâches de démarrage de l'app). */
  dataPatches: number;
}

export type SeedGuardDecision = { allowed: true; reason: string } | { allowed: false; reason: string };

/** Hôte de la chaîne de connexion, ou `null` si elle est absente ou illisible. */
export function databaseHost(databaseUrl: string | undefined): string | null {
  if (!databaseUrl) return null;
  try {
    const host = new URL(databaseUrl).hostname;
    return host.length > 0 ? host : null;
  } catch {
    return null;
  }
}

export function checkSeedTarget(
  state: SeedTargetState,
  databaseUrl: string | undefined,
  confirmHost: string | undefined,
): SeedGuardDecision {
  if (state.users === 0 && state.dataPatches === 0) {
    return { allowed: true, reason: "base vierge (aucun utilisateur, aucun marqueur DataPatch)" };
  }
  const host = databaseHost(databaseUrl);
  const found = `${state.users} utilisateur(s), ${state.dataPatches} marqueur(s) DataPatch`;
  if (host && confirmHost && confirmHost.trim() === host) {
    return { allowed: true, reason: `base non vierge (${found}), confirmée pour ${host}` };
  }
  return {
    allowed: false,
    reason:
      `base non vierge (${found}) : copie de prod ou base déjà utilisée. Seed refusé, aucune écriture. ` +
      `Si c'est voulu (base de développement jetable), relancer avec ${SEED_CONFIRM_ENV}=${host ?? "<hôte de DATABASE_URL>"}.`,
  };
}
