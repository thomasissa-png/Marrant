/**
 * s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5, espace ouvert seulement) : amène l'élément `id` sous
 * l'en-tête collant (sa `scroll-margin-top`), puis le recale à chaque changement de hauteur de la page (session,
 * progression ou caps lus après coup) tant que la page n'est pas restée stable `calmeMs` ; arrêt au premier geste
 * (molette, toucher, clavier) ou après 4 s. Focus éventuel sans défilement. Renvoie la fonction d'arrêt.
 */
export function recalerAncre(id: string, { focusId, calmeMs = 600 }: { focusId?: string; calmeMs?: number } = {}): () => void {
  const aligner = () => document.getElementById(id)?.scrollIntoView?.({ behavior: "instant", block: "start" });
  aligner();
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
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
