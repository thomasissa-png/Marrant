/**
 * Classes partagées des entrées de la barre de l'espace (liens et bouton « Plus »).
 * Marge intérieure horizontale : `--app-onglet-pad`, posée par la barre pour l'indice de
 * suite (voir `margeIndice`) ; à défaut 12 px, 8 px sous 300 px de large (200 % de texte).
 */
export const CLASSE_ONGLET =
  "relative flex h-11 flex-none snap-start items-center whitespace-nowrap border-0 bg-transparent px-[var(--app-onglet-pad,0.75rem)] text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary aria-[current=page]:text-text-primary max-e300:px-[var(--app-onglet-pad,0.5rem)] max-e300:text-xs";

/** Trait de 2 px sous l'entrée courante, aligné sur le texte. */
/**
 * Lot D7 (cause des 2 échecs `espace-barre` en régime ouvert) : l'accroche `scroll-snap` (proximity) n'avait
 * que les DÉBUTS d'onglets ; un défilement programmé (focus clavier, `scrollIntoView`) qui montrait l'entrée
 * entière était ensuite ramené au début d'onglet le plus proche, et l'entrée visée repassait sous le bord
 * droit (0,6 px avec nos métriques de police, 5 px et plus avec des glyphes un peu plus larges : ratio 0,958).
 * Cette marque donne aussi un point d'accroche à la FIN de chaque onglet (bord droit moins 8 px,
 * `scroll-pr-2` de la liste) : l'accroche ne coupe plus l'entrée qu'on vient de montrer. Décorative.
 */
export const CLASSE_ACCROCHE_FIN = "pointer-events-none absolute inset-0 snap-end";

export const CLASSE_SOULIGNEMENT =
  "absolute inset-x-[var(--app-onglet-pad,0.75rem)] bottom-0 h-0.5 bg-accent-primary max-e300:inset-x-[var(--app-onglet-pad,0.5rem)]";

/** Largeur du fondu droit et de son chevron (`w-10`, 40 px) : l'entrée courante s'arrête avant (lot D11c). */
export const LARGEUR_FONDU_DROIT = 40;

/** Partie visible visée de l'entrée coupée au bord droit (architecture 6.2, règle c de @ux). */
export const INDICE_MIN = 16;
export const INDICE_MAX = 24;

/**
 * Marge ajoutée de chaque côté de chaque entrée (en px, de -4 à +8, marge finale d'au moins 8 px, la plus petite possible)
 * pour que la première entrée qui passe le bord droit de la zone en montre de 16 à 24 px,
 * barre au repos. Contrainte prioritaire : l'entrée courante (`active`, index) tient entière à
 * côté de l'épinglée (index 0). 0 si les entrées tiennent toutes, ou si aucun réglage n'y arrive.
 * `largeurs` : largeurs naturelles des entrées (marge `base` comprise), `zone` : largeur de la liste.
 */
export function margeIndice(largeurs: number[], zone: number, base: number, active = -1): number {
  if (largeurs.reduce((s, w) => s + w, 0) <= zone) return 0;
  const essais = [0];
  for (let k = 0.5; k <= 8; k += 0.5) {
    essais.push(k);
    if (k <= 4 && base - k >= 8) essais.push(-k); // marge >= 8 px : le fondu de gauche (8 px) ne touche jamais le texte
  }
  const tient = (x: number) => active <= 0 || largeurs[0] + largeurs[active] + 4 * x <= zone;
  const coupe = (x: number) => {
    let gauche = 0;
    for (const w of largeurs) {
      const l = w + 2 * x;
      if (gauche + l > zone) {
        const visible = zone - gauche;
        return visible >= INDICE_MIN && visible <= INDICE_MAX;
      }
      gauche += l;
    }
    return false;
  };
  return essais.find((x) => tient(x) && coupe(x)) ?? essais.find(tient) ?? 0;
}
