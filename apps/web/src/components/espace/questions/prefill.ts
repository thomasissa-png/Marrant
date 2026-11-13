/**
 * Préremplissage de « Mes questions » (architecture 2.6) : « Montre ta réplique à l'équipe » reprend la note
 * « ma réplique à moi » comme texte préchargé ; « Raconte-nous ce qui s'est passé » choisit « Une situation
 * à gérer ». Copie côté NAVIGATEUR seulement (`sessionStorage` de l'onglet), JAMAIS dans l'adresse, lue une
 * fois puis effacée, et JAMAIS envoyée seule : l'abonné relit et clique « Envoyer à l'équipe », ou non.
 */
import type { TypeQuestion } from "@/lib/espace/questions-types";

const CLE = "espace-questions-prefill";

export interface Prefill {
  type?: TypeQuestion;
  texte?: string;
}

export function preparerQuestion(p: Prefill): void {
  try {
    window.sessionStorage.setItem(CLE, JSON.stringify(p));
  } catch {
    // Stockage refusé (navigation privée stricte) : le formulaire s'ouvre vide, rien d'autre.
  }
}

/** Lu une seule fois (puis effacé) ; valeurs hors liste ignorées. */
export function prendrePrefill(): Prefill {
  try {
    const brut = window.sessionStorage.getItem(CLE);
    window.sessionStorage.removeItem(CLE);
    if (!brut) return {};
    const p = JSON.parse(brut) as Record<string, unknown>;
    const type = p.type === "PROBLEME" || p.type === "SITUATION" || p.type === "QUESTION" ? p.type : undefined;
    return { type, texte: typeof p.texte === "string" ? p.texte : undefined };
  } catch {
    return {};
  }
}
