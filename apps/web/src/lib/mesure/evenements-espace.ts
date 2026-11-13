/**
 * Mesure d'usage de l'espace client (s24, lot D9 ; architecture v20 7.6 et 7.7, plan §3 « Lot D9 »).
 * Branche la mesure du lot 0 (`UsageEvent`, migration 18, `evenements-usage.ts`) sur l'espace, sans
 * table neuve : une ligne par événement, compte, type de la liste fermée, détail fermé ou rien.
 *
 * - **Interrupteur fermé : aucun événement écrit** (rendu `false` avant toute lecture de base). Les
 *   routes et pages de l'espace répondent déjà 404 fermé ; ce test est la seconde barrière.
 * - Lot D10 (architecture 7.7 point 6, avis @legal `espace-d9-mesure-s24.md` points 6 et 7) : seuls
 *   `espace_ouvert` et `cap_atteint` restent rattachés au compte. Cloche, bonus, coin « Humour noir »,
 *   archive « Lettres », réplique écrite et question envoyée sont des compteurs ANONYMES
 *   (`lib/espace/compteurs.ts`, table `EspaceCompteur`), sans identifiant d'abonné.
 * - Jamais de texte saisi par l'abonné ; `cap_atteint` a le seul numéro de cap (`cap:<n>`).
 * - Clé d'unicité par type (aucun doublon) : ouverture de l'espace une fois par jour de Paris ; cap
 *   atteint une fois par cap.
 * - Opposition à la mesure, écriture jamais bloquante, journal sans identifiant : ceux du lot 0.
 *   Awaité par l'appelant avant sa réponse (zéro fire-and-forget sous Workers).
 */
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { parisDayNumber } from "@/lib/progression";
import { cleUnique, noterEvenement, type MesureDb } from "@/lib/mesure/evenements-usage";

export const TYPES_EVENEMENT_ESPACE = ["espace_ouvert", "cap_atteint"] as const;
export type TypeEvenementEspace = (typeof TYPES_EVENEMENT_ESPACE)[number];

export type NumeroCapMesure = 1 | 2 | 3 | 4 | 5;

/** Ce qui fait la clé d'unicité et le détail, par type (aucun texte libre possible). */
export type SujetEvenement = { type: "espace_ouvert" } | { type: "cap_atteint"; cap: NumeroCapMesure };

/** Clé d'unicité et détail d'un événement (null : sujet invalide, rien n'est écrit). */
export function cleEtDetail(sujet: SujetEvenement, userId: string, maintenant: Date): { dedupKey: string; detail: string | null } | null {
  const jour = parisDayNumber(maintenant);
  switch (sujet.type) {
    case "espace_ouvert":
      return { dedupKey: cleUnique(sujet.type, userId, jour), detail: null };
    case "cap_atteint":
      return Number.isInteger(sujet.cap) && sujet.cap >= 1 && sujet.cap <= 5
        ? { dedupKey: cleUnique(sujet.type, userId, sujet.cap), detail: `cap:${sujet.cap}` }
        : null;
  }
}

export interface OptionsEspace {
  maintenant?: Date;
  db?: MesureDb;
  /** Interrupteur (tests) ; par défaut `ESPACE_CLIENT_PUBLIE`. */
  publie?: boolean;
}

/** Écrit un événement de l'espace. `false` si fermé, doublon, opposition ou erreur. Ne lève jamais. */
export async function noterEvenementEspace(sujet: SujetEvenement, userId: string, options: OptionsEspace = {}): Promise<boolean> {
  if (!(options.publie ?? ESPACE_CLIENT_PUBLIE) || !userId) return false;
  const maintenant = options.maintenant ?? new Date();
  const cle = cleEtDetail(sujet, userId, maintenant);
  if (!cle) return false;
  return noterEvenement(sujet.type, userId, { ...cle, occurredAt: maintenant, db: options.db });
}

/** Caps réellement atteints (annonce montrée, jamais le recalcul silencieux) : un `cap_atteint` chacun. */
export async function noterCapsAtteints(userId: string, caps: readonly number[], options: OptionsEspace = {}): Promise<number> {
  let n = 0;
  for (const cap of caps) {
    if (cap < 1 || cap > 5 || !Number.isInteger(cap)) continue;
    if (await noterEvenementEspace({ type: "cap_atteint", cap: cap as NumeroCapMesure }, userId, options)) n += 1;
  }
  return n;
}
