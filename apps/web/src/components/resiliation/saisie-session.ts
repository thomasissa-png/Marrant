import { CLE_SAISIE_SESSION, RESILIATION_CODES, RESILIATION_COMMENTAIRE_MAX, type RaisonResiliation } from "@/config/resiliation";

/**
 * Saisie gardée le temps d'une reconnexion (session expirée, UX O3) : écrite juste avant d'aller sur
 * /login, relue au retour sur /resiliation puis effacée. Stockage de l'onglet seulement, jamais dans
 * l'URL. Stockage refusé (navigation privée) : rien n'est gardé, aucune erreur.
 */
export interface SaisieResiliation {
  raisons: RaisonResiliation[];
  commentaire: string;
}

export function garderSaisie(saisie: SaisieResiliation): void {
  try {
    sessionStorage.setItem(CLE_SAISIE_SESSION, JSON.stringify(saisie));
  } catch {
    // Stockage refusé : la saisie est perdue, la résiliation reste possible.
  }
}

/** Relit puis efface la saisie gardée ; null s'il n'y en a pas (ou si elle est illisible). */
export function reprendreSaisie(): SaisieResiliation | null {
  try {
    const brut = sessionStorage.getItem(CLE_SAISIE_SESSION);
    if (brut === null) return null;
    sessionStorage.removeItem(CLE_SAISIE_SESSION);
    const lu = JSON.parse(brut) as { raisons?: unknown; commentaire?: unknown };
    const recues = new Set(Array.isArray(lu.raisons) ? lu.raisons : []);
    return {
      raisons: RESILIATION_CODES.filter((code) => recues.has(code)),
      commentaire: typeof lu.commentaire === "string" ? lu.commentaire.slice(0, RESILIATION_COMMENTAIRE_MAX) : "",
    };
  } catch {
    return null;
  }
}
