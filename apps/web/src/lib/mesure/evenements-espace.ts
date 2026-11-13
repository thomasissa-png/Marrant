/**
 * Mesure d'usage de l'espace client (s24, lot D9 ; architecture v20 7.6 et 7.7, plan §3 « Lot D9 »).
 * Branche la mesure du lot 0 (`UsageEvent`, migration 18, `evenements-usage.ts`) sur l'espace, sans
 * table neuve : une ligne par événement, compte, type de la liste fermée, détail fermé ou rien.
 *
 * - **Interrupteur fermé : aucun événement écrit** (rendu `false` avant toute lecture de base). Les
 *   routes et pages de l'espace répondent déjà 404 fermé ; ce test est la seconde barrière.
 * - Jamais de texte saisi par l'abonné (réplique, question) : `replique_ecrite` et `question_envoyee`
 *   n'ont aucun détail ; `bonus_ouvert` et `cap_atteint` ont le seul numéro de cap (`cap:<n>`).
 * - Clé d'unicité par type (aucun doublon) : ouverture de l'espace et de la cloche une fois par jour
 *   de Paris ; bonus une fois par jour et par cap ; cap atteint une fois par cap ; réplique une fois
 *   par fiche ; question une fois par envoi (fil ou message).
 * - Capteurs anonymes (toucher « Ce soir, c'est plutôt ? », « Une autre ») : `EspaceCompteur` (lot D3,
 *   migration 21), sans identifiant d'abonné, hors de ce fichier.
 * - Opposition à la mesure, écriture jamais bloquante, journal sans identifiant : ceux du lot 0.
 *   Awaité par l'appelant avant sa réponse (zéro fire-and-forget sous Workers).
 */
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { parisDayNumber } from "@/lib/progression";
import { cleUnique, noterEvenement, type MesureDb } from "@/lib/mesure/evenements-usage";

export const TYPES_EVENEMENT_ESPACE = ["espace_ouvert", "cloche_ouverte", "bonus_ouvert", "cap_atteint", "replique_ecrite", "question_envoyee"] as const;
export type TypeEvenementEspace = (typeof TYPES_EVENEMENT_ESPACE)[number];

/** Événements que le navigateur peut signaler (`POST /api/espace/mesure`) : la cloche seule. */
export const EVENEMENTS_NAVIGATEUR = ["cloche_ouverte"] as const;

export type NumeroCapMesure = 1 | 2 | 3 | 4 | 5;

/** Ce qui fait la clé d'unicité et le détail, par type (aucun texte libre possible). */
export type SujetEvenement =
  | { type: "espace_ouvert" | "cloche_ouverte" }
  | { type: "bonus_ouvert" | "cap_atteint"; cap: NumeroCapMesure }
  | { type: "replique_ecrite"; ficheId: string }
  | { type: "question_envoyee"; envoi: string };

const FORMAT_MARQUE = /^[A-Za-z0-9_-]{1,80}$/;

/** Clé d'unicité et détail d'un événement (null : sujet invalide, rien n'est écrit). */
export function cleEtDetail(sujet: SujetEvenement, userId: string, maintenant: Date): { dedupKey: string; detail: string | null } | null {
  const jour = parisDayNumber(maintenant);
  switch (sujet.type) {
    case "espace_ouvert":
    case "cloche_ouverte":
      return { dedupKey: cleUnique(sujet.type, userId, jour), detail: null };
    case "bonus_ouvert":
      return { dedupKey: cleUnique(sujet.type, userId, `${sujet.cap}:${jour}`), detail: `cap:${sujet.cap}` };
    case "cap_atteint":
      return { dedupKey: cleUnique(sujet.type, userId, sujet.cap), detail: `cap:${sujet.cap}` };
    case "replique_ecrite":
      return FORMAT_MARQUE.test(sujet.ficheId) ? { dedupKey: cleUnique(sujet.type, userId, sujet.ficheId), detail: null } : null;
    case "question_envoyee":
      return FORMAT_MARQUE.test(sujet.envoi) ? { dedupKey: cleUnique(sujet.type, userId, sujet.envoi), detail: null } : null;
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
