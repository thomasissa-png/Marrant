/**
 * Durée de conservation de la mesure d'usage rattachée au compte (`UsageEvent`, migration 18 ; s24,
 * lot D10, avis @legal `docs/legal/espace-d9-mesure-s24.md` point 3 : « la CNIL attend mieux que la vie
 * du compte »). Une seule constante, une seule purge.
 *
 * [HYPOTHÈSE : 13 mois] À FIXER PAR THOMAS (`docs/espace-client/textes-en-ligne-d10-a-valider.md`, ligne
 * « Durée de conservation de la mesure »). Tant qu'elle n'est pas fixée, la purge n'est PROGRAMMÉE nulle
 * part (aucun cron, aucun appel) : elle se lance à la main, `--ecrire` exigé (voir `REPLIT_ACTIONS.md`).
 * Les compteurs anonymes (`EspaceCompteur`) ne sont pas concernés (aucune donnée de compte).
 */
export const DUREE_CONSERVATION_USAGE_MOIS = 13;

/** Date avant laquelle un événement est effacé (même jour du mois, `mois` mois plus tôt, en UTC). */
export function limiteConservation(maintenant: Date = new Date(), mois: number = DUREE_CONSERVATION_USAGE_MOIS): Date {
  const d = new Date(maintenant.getTime());
  d.setUTCMonth(d.getUTCMonth() - mois);
  return d;
}

export interface PurgeDb {
  usageEvent: {
    count(args: { where: { occurredAt: { lt: Date } } }): Promise<number>;
    deleteMany(args: { where: { occurredAt: { lt: Date } } }): Promise<{ count: number }>;
  };
}

/** Efface (ou compte seulement, `ecrire: false`) les événements plus vieux que la durée. Nombre traité. */
export async function purgerUsageEvents(db: PurgeDb, options: { maintenant?: Date; ecrire?: boolean } = {}): Promise<number> {
  const where = { occurredAt: { lt: limiteConservation(options.maintenant) } };
  if (!options.ecrire) return db.usageEvent.count({ where });
  return (await db.usageEvent.deleteMany({ where })).count;
}
