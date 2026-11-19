/**
 * s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5, espace ouvert seulement) : applique `aligner`, puis le
 * refait à chaque changement de hauteur de la page (session, progression ou caps lus après coup) tant que la page n'est
 * pas restée stable `calmeMs` ; arrêt au premier geste (molette, toucher, clavier, pointeur) ou après 4 s. Renvoie la
 * fonction d'arrêt.
 * s26 parcours connecté, tour 3 : un seul recalage à la fois (le nouveau arrête le précédent) et le clic (`pointerdown`)
 * est un geste. Avant, le recalage d'arrivée sur l'étape 2 tournait encore au clic sur « étape suivante » : la page
 * changeait de hauteur (étape 2 refermée, étape 3 ouverte) et il ramenait l'étape 2 sous l'en-tête, l'étape 3 restait
 * 114 px plus bas.
 */
let recalageEnCours: (() => void) | null = null;

function recaler(aligner: () => void, calmeMs: number): () => void {
  recalageEnCours?.();
  aligner();
  if (typeof ResizeObserver === "undefined") return () => {};

  let calme: ReturnType<typeof setTimeout> | undefined;
  let fini = false;
  const gestes = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  const fin = () => {
    if (fini) return;
    fini = true;
    if (recalageEnCours === fin) recalageEnCours = null;
    observateur.disconnect();
    clearTimeout(calme);
    clearTimeout(plafond);
    for (const g of gestes) window.removeEventListener(g, fin);
  };
  const observateur = new ResizeObserver(() => {
    aligner();
    clearTimeout(calme);
    calme = setTimeout(fin, calmeMs);
  });
  observateur.observe(document.body);
  calme = setTimeout(fin, calmeMs);
  const plafond = setTimeout(fin, 4_000);
  for (const g of gestes) window.addEventListener(g, fin, { passive: true });
  recalageEnCours = fin;
  return fin;
}

/**
 * Amène l'élément `id` sous l'en-tête collant (`scroll-padding-top` du site + sa `scroll-margin-top`) et l'y garde
 * pendant le chargement (`recaler`). Focus éventuel sans défilement. Tour 3 : `behavior: "smooth"` pour un lien de la
 * page (étape suivante, sommaire) ; chaque changement de hauteur relance le défilement vers la position à jour.
 */
export function recalerAncre(
  id: string,
  { focusId, calmeMs = 600, behavior = "instant" }: { focusId?: string; calmeMs?: number; behavior?: ScrollBehavior } = {},
): () => void {
  const fin = recaler(() => document.getElementById(id)?.scrollIntoView?.({ behavior, block: "start" }), calmeMs);
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
  return fin;
}

/**
 * s26 parcours connecté, tour 2 (retour du navigateur) : rend la position `y` quittée, et la garde pendant que la page
 * retrouve sa hauteur (étape rouverte, progression relue).
 */
export function recalerPosition(y: number, { calmeMs = 600 }: { calmeMs?: number } = {}): () => void {
  return recaler(() => window.scrollTo({ top: y, behavior: "instant" }), calmeMs);
}

/** Clé de l'état d'historique (`history.state`) qui garde la position quittée d'une page de parcours. */
const CLE_POSITION = "parcoursPosition";

/** Position quittée d'une page de parcours : étape ouverte et défilement. */
export type PositionParcours = { etape: number | null; y: number };

/**
 * Inscrit la position quittée dans l'entrée d'historique COURANTE (avant que la navigation n'en pousse une autre) : seul
 * un retour arrière sur cette entrée la relira. L'état interne de Next (`__NA`, arbre) est conservé tel quel.
 */
export function noterPosition(position: PositionParcours): void {
  const etat: unknown = window.history.state;
  window.history.replaceState({ ...(etat && typeof etat === "object" ? etat : {}), [CLE_POSITION]: position }, "");
}

/** Position notée sur l'entrée d'historique courante (retour arrière), ou `null`. */
export function lirePosition(): PositionParcours | null {
  const etat: unknown = window.history.state;
  if (!etat || typeof etat !== "object") return null;
  const p = (etat as Record<string, unknown>)[CLE_POSITION];
  if (!p || typeof p !== "object") return null;
  const { etape, y } = p as Record<string, unknown>;
  if (typeof y !== "number" || !Number.isFinite(y)) return null;
  return { etape: typeof etape === "number" ? etape : null, y };
}

/** Clé de l'état d'historique de /parcours : parcours ouvert depuis cette entrée. */
const CLE_RETOUR_LISTE = "parcoursRetourListe";

/**
 * s26 parcours, tour 5 (F3 de la relecture UX v2) : au départ de /parcours vers une page de parcours, le slug est inscrit
 * dans l'entrée d'historique COURANTE (celle de /parcours, état de Next conservé) ; au retour du navigateur sur cette
 * entrée, la liste ramène la carte du parcours sous l'en-tête, comme le lien « Retour : Parcours » (`#parcours-{slug}`).
 */
export function noterRetourListe(slug: string): void {
  const etat: unknown = window.history.state;
  window.history.replaceState({ ...(etat && typeof etat === "object" ? etat : {}), [CLE_RETOUR_LISTE]: slug }, "");
}

/**
 * s26 parcours, tour 5 : garde l'élément `id` sous l'en-tête pendant `dureeMs` contre la restauration du défilement du
 * navigateur, qui arrive APRÈS le recalage au retour arrière (mesuré à 1280 : carte ramenée de 137 à 213 px, position du
 * clic). Chaque défilement qui l'écarte de plus de 2 px le recale ; arrêt au premier geste (molette, toucher, clavier,
 * pointeur) ou au bout du délai. Renvoie la fonction d'arrêt.
 */
export function garderAncre(id: string, dureeMs = 2_000): () => void {
  const haut = () => {
    const el = document.getElementById(id);
    if (!el) return null;
    const marge = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return { el, ecart: el.getBoundingClientRect().top - marge - padding };
  };
  const surDefilement = () => {
    const h = haut();
    if (h && Math.abs(h.ecart) > 2) h.el.scrollIntoView({ behavior: "instant", block: "start" });
  };
  const gestes = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  const fin = () => {
    clearTimeout(minuterie);
    window.removeEventListener("scroll", surDefilement);
    for (const g of gestes) window.removeEventListener(g, fin);
  };
  const minuterie = setTimeout(fin, dureeMs);
  window.addEventListener("scroll", surDefilement, { passive: true });
  for (const g of gestes) window.addEventListener(g, fin, { passive: true });
  return fin;
}

/** Slug noté sur l'entrée d'historique courante de /parcours, ou `null`. */
export function lireRetourListe(): string | null {
  const etat: unknown = window.history.state;
  if (!etat || typeof etat !== "object") return null;
  const slug = (etat as Record<string, unknown>)[CLE_RETOUR_LISTE];
  return typeof slug === "string" && /^[a-z0-9-]{1,60}$/.test(slug) ? slug : null;
}
