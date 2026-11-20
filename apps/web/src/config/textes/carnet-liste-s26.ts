/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3 et §5), espace OUVERT seulement : le rendu fermé
 * (`CarnetPage`) ne lit aucun de ces textes.
 *
 * À VALIDER (s26) : les trois libellés ci-dessous sont les propositions de l'audit (§5, points 1 et 3), posés tels
 * quels. Proposés, pas encore validés par Thomas (interrupteur fermé : rien de visible en production). « Situation
 * suivante » n'est pas redéfini ici : c'est celui de Quoi répondre (`TEXTES_QUOI_REPONDRE.situationSuivante`, lui
 * aussi À VALIDER).
 */
export const TEXTES_CARNET_LISTE = {
  /** À VALIDER (s26) : ligne d'usage sous l'intro du carnet (audit §5, point 1). */
  usage: "Ouvre une situation : ce qu'on te dit, ce que tu réponds, pourquoi ça marche.",
  /** À VALIDER (s26) : étiquette de la fiche (« Situation n » existait ; audit §5, point 3). */
  situationSur: (n: number, total: number) => `Situation ${n} sur ${total}`,
  /** À VALIDER (s26) : pastille du filtre par contexte qui montre tout (mot déjà employé par Vannes ; audit §5, point 3). */
  toutes: "Toutes",
} as const;
