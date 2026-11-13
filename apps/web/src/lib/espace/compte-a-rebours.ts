/**
 * Compte à rebours facultatif de la rafale (s24, lot D5b ; architecture v20 2.2 ; libellés
 * `docs/copy/libelles-compte-a-rebours-s24.md`, clôture du 13/11). Règles pures, sans base.
 *
 * - Désactivé la première fois : l'interrupteur n'apparaît qu'une fois au moins une carte jouée.
 * - Durées 10, puis 7, puis 5 secondes. Le compte à rebours ne raccourcit JAMAIS de lui-même : l'espace
 *   PROPOSE la durée suivante, l'abonné peut refuser sans conséquence (aucun message après le refus).
 * - Condition d'elon : « Tu peux revenir à 10 quand tu veux » exige un moyen visible de revenir. Chaque
 *   durée déjà essayée reste un bouton (« 10 secondes pour répondre », « 7 secondes pour répondre »).
 * - Rien n'est noté : aucune note, aucune sanction, rien ne se bloque à la fin du temps.
 *
 * Mémoire : la colonne `CarteReponse.compteARebours` (migration 23), écrite avec chaque réponse ; aucun
 * stockage dans le navigateur. Durées disponibles = de 10 à la plus courte déjà utilisée pour répondre.
 * Proposition [HYPOTHÈSE de lecture de 2.2 « Oui sur 7 cartes ou plus de 10 »] : la semaine (lundi à
 * dimanche, heure de Paris) précédente compte au moins 10 cartes jouées à la durée la plus courte, dont
 * au moins 7 « Oui » ; elle reste affichée tant qu'aucune carte n'est jouée cette semaine (un refus
 * « Garder » lance le compte à rebours habituel, la réponse qui suit la clôt jusqu'à la semaine suivante).
 */
import { jourParis, lundiParis } from "@/lib/espace/rafale";

export const DUREES_COMPTE_A_REBOURS = [10, 7, 5] as const;
export type DureeCompteARebours = (typeof DUREES_COMPTE_A_REBOURS)[number];
export const CARTES_AVANT_PROPOSITION = 10;
export const OUI_AVANT_PROPOSITION = 7;

export const estDuree = (n: unknown): n is DureeCompteARebours => (DUREES_COMPTE_A_REBOURS as readonly unknown[]).includes(n);

export interface PropositionRaccourcir {
  essayer: DureeCompteARebours;
  garder: DureeCompteARebours;
}

export interface EtatCompteARebours {
  /** Interrupteur affiché (jamais à la toute première carte). */
  visible: boolean;
  /** Durées proposées, de la plus longue à la plus courte déjà essayée. */
  durees: DureeCompteARebours[];
  proposition: PropositionRaccourcir | null;
}

export interface ReponseLue {
  repondueLe: Date;
  reponse: string;
  compteARebours: number | null;
}

export function etatCompteARebours(e: {
  /** Valeurs distinctes de `compteARebours` des réponses de l'abonné (null compris) ; vide = jamais joué. */
  dureesUtilisees: readonly (number | null)[];
  /** Réponses des 15 derniers jours au moins. */
  recentes: readonly ReponseLue[];
  maintenant: Date;
}): EtatCompteARebours {
  const visible = e.dureesUtilisees.length > 0;
  const essayees = e.dureesUtilisees.filter(estDuree);
  const plusCourte: DureeCompteARebours = essayees.length ? (Math.min(...essayees) as DureeCompteARebours) : 10;
  const durees = DUREES_COMPTE_A_REBOURS.filter((d) => d >= plusCourte);
  const suivante = DUREES_COMPTE_A_REBOURS[DUREES_COMPTE_A_REBOURS.indexOf(plusCourte) + 1];
  if (!visible || !suivante) return { visible, durees, proposition: null };

  const lundi = lundiParis(e.maintenant);
  const lundiAvant = lundiParis(new Date(e.maintenant.getTime() - 7 * 86_400_000));
  const jours = e.recentes.map((r) => ({ ...r, jour: jourParis(r.repondueLe) }));
  if (jours.some((r) => r.jour >= lundi)) return { visible, durees, proposition: null };
  const semaine = jours.filter((r) => r.jour >= lundiAvant && r.jour < lundi && r.compteARebours === plusCourte);
  const oui = semaine.filter((r) => r.reponse === "OUI").length;
  const proposer = semaine.length >= CARTES_AVANT_PROPOSITION && oui >= OUI_AVANT_PROPOSITION;
  return { visible, durees, proposition: proposer ? { essayer: suivante, garder: plusCourte } : null };
}
