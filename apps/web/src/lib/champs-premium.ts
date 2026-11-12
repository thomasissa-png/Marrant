/**
 * Champs réservés aux membres Premium dans les listes (trajet de conversion s21, tour 2,
 * arbitrage 5) : l'exercice d'une fiche (« À toi de jouer » d'une vanne, exercice d'un conseil,
 * points clés et exercice d'une vidéo) n'est jamais envoyé à un compte qui n'est pas Premium,
 * ni par le HTML (`lib/catalogue-pages.ts`), ni par les API `/api/jokes`, `/api/tips`,
 * `/api/videos`. Mêmes valeurs vides que le HTML public : le client n'a aucun cas nouveau.
 */
export function sansExerciceVanne<T extends { howToApply?: string | null }>(vanne: T): T {
  return { ...vanne, howToApply: null };
}

export function sansExerciceConseil<T extends { exercise?: string | null }>(conseil: T): T {
  return { ...conseil, exercise: "" };
}

export function sansExerciceVideo<T extends { learnings?: string[]; exercise?: string | null }>(video: T): T {
  return { ...video, learnings: [], exercise: null };
}

/**
 * Fiches neuves de l'espace client (s24, lot D1 ; plan §2 règle 6) : réservées aux abonnés
 * actifs, aucune n'est envoyée à un autre compte, ni par le HTML ni par l'API. Liste vide
 * sinon (même forme, aucun cas nouveau côté client). Seul passage des chargeurs
 * `lib/espace/fiches.ts`.
 */
export function fichesSelonPlan<T>(fiches: readonly T[], abonneActif: boolean): T[] {
  return abonneActif ? [...fiches] : [];
}
