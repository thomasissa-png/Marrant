import type { EtatInfoPaiement } from "@/config/textes/lettre-hebdo-s21";

/**
 * Ligne de la lettre de la semaine au retour de paiement (s22, relecture à l'aveugle B1) : choisie
 * d'après `GET /api/lettre-premium/preference`, pour qu'elle soit vraie pour qui la lit. Réponse
 * illisible ou compte pas encore Premium : aucune ligne (jamais une phrase devinée). Module pur,
 * importable côté client.
 */
export function etatInfoPaiement(d: unknown): EtatInfoPaiement | null {
  if (!d || typeof d !== "object") return null;
  const r = d as { eligible?: unknown; enabled?: unknown; opposition?: unknown };
  if (r.eligible !== true) return null;
  if (r.opposition === true) return "opposition";
  if (r.enabled === true) return "recoit";
  if (r.enabled === false) return "arretee";
  return null;
}
