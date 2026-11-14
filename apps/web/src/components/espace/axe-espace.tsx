import type { ReactNode } from "react";

/**
 * Ancienne colonne de l'abonné sur l'axe de l'espace (lot D11c, `lg:max-w-lecture` collé à gauche),
 * supprimée par la navigation universelle v5 §3 : plus aucune colonne de 720 px à gauche, la page garde la
 * même colonne pour tout lecteur (`visiteur`). Gardé comme simple enveloppe parce que
 * `app/(dashboard)/parcours/(liste)/page.tsx` est figé par hachage (`profil-d10-s24.test.tsx`, textes NON
 * touchés du §6) ; à retirer avec la retouche suivante autorisée de ce fichier.
 */
export function AxeEspace({ visiteur, children }: { visiteur?: string; children: ReactNode }) {
  return <div className={visiteur}>{children}</div>;
}
