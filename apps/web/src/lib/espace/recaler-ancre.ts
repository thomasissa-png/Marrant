/**
 * s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5, espace ouvert seulement) : applique `aligner`, puis le
 * refait à chaque changement de hauteur de la page (session, progression ou caps lus après coup) tant que la page n'est
 * pas restée stable `calmeMs` ; arrêt au premier geste (molette, toucher, clavier) ou après 4 s. Renvoie la fonction
 * d'arrêt.
 */
function recaler(aligner: () => void, calmeMs: number): () => void {
  aligner();
  if (typeof ResizeObserver === "undefined") return () => {};

  let calme: ReturnType<typeof setTimeout> | undefined;
  let fini = false;
  const gestes = ["wheel", "touchstart", "keydown"] as const;
  const fin = () => {
    if (fini) return;
    fini = true;
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
  return fin;
}

/**
 * Amène l'élément `id` sous l'en-tête collant (`scroll-padding-top` du site + sa `scroll-margin-top`) et l'y garde
 * pendant le chargement (`recaler`). Focus éventuel sans défilement.
 */
export function recalerAncre(id: string, { focusId, calmeMs = 600 }: { focusId?: string; calmeMs?: number } = {}): () => void {
  const fin = recaler(() => document.getElementById(id)?.scrollIntoView?.({ behavior: "instant", block: "start" }), calmeMs);
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
