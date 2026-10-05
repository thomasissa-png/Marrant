// ───────────────────────────────────────────────────────────────────
// Mesure de texte sur les largeurs réelles des glyphes (visuels v3, s15)
//
// satori ne sait ni équilibrer les lignes ni éviter les orphelins, et
// rend mal les espaces insécables dans un texte qui passe à la ligne.
// On calcule donc la mise en lignes nous-mêmes : chaque police chargée
// pour le rendu est aussi enregistrée ici, et on lit ses avances
// (tables head, hhea, hmtx, cmap formats 4 et 12 du TTF). Le crénage
// n'est pas lu : il resserre le texte, la mesure est donc prudente.
// ───────────────────────────────────────────────────────────────────

export interface MetriquesPolice {
  unitsPerEm: number;
  /** Avance d'un point de code, en unités de la police (null = absent). */
  avance(codePoint: number): number | null;
}

const registre = new Map<string, MetriquesPolice>();

function cle(famille: string, poids: number): string {
  return `${famille}:${poids}`;
}

/** Lit les métriques horizontales d'un TTF (sans dépendance). */
export function lireMetriques(data: ArrayBuffer): MetriquesPolice {
  const v = new DataView(data);
  const tables = new Map<string, number>();
  const nbTables = v.getUint16(4);
  for (let i = 0; i < nbTables; i++) {
    const p = 12 + i * 16;
    const tag = String.fromCharCode(v.getUint8(p), v.getUint8(p + 1), v.getUint8(p + 2), v.getUint8(p + 3));
    tables.set(tag, v.getUint32(p + 8));
  }
  const head = tables.get("head");
  const hhea = tables.get("hhea");
  const hmtx = tables.get("hmtx");
  const cmap = tables.get("cmap");
  if (head === undefined || hhea === undefined || hmtx === undefined || cmap === undefined) {
    throw new Error("TTF incomplet (head, hhea, hmtx ou cmap absent)");
  }
  const unitsPerEm = v.getUint16(head + 18);
  const nbMetrics = v.getUint16(hhea + 34);
  const avanceGlyphe = (g: number) => v.getUint16(hmtx + 4 * Math.min(g, nbMetrics - 1));

  // Sous-table cmap Unicode : format 12 (3,10) de préférence, sinon 4 (3,1 ou 0,x).
  let format4 = -1;
  let format12 = -1;
  const nbSous = v.getUint16(cmap + 2);
  for (let i = 0; i < nbSous; i++) {
    const p = cmap + 4 + i * 8;
    const plateforme = v.getUint16(p);
    const encodage = v.getUint16(p + 2);
    const off = cmap + v.getUint32(p + 4);
    const fmt = v.getUint16(off);
    if (fmt === 12 && (plateforme === 0 || (plateforme === 3 && encodage === 10))) format12 = off;
    if (fmt === 4 && (plateforme === 0 || (plateforme === 3 && encodage === 1)) && format4 < 0) format4 = off;
  }

  function glyphe(cp: number): number {
    if (format12 >= 0) {
      const n = v.getUint32(format12 + 12);
      for (let i = 0; i < n; i++) {
        const p = format12 + 16 + i * 12;
        const debut = v.getUint32(p);
        const fin = v.getUint32(p + 4);
        if (cp >= debut && cp <= fin) return v.getUint32(p + 8) + (cp - debut);
      }
      return 0;
    }
    if (format4 < 0 || cp > 0xffff) return 0;
    const segX2 = v.getUint16(format4 + 6);
    const fins = format4 + 14;
    const debuts = fins + segX2 + 2;
    const deltas = debuts + segX2;
    const offsets = deltas + segX2;
    for (let i = 0; i < segX2; i += 2) {
      if (cp > v.getUint16(fins + i)) continue;
      const debut = v.getUint16(debuts + i);
      if (cp < debut) return 0;
      const delta = v.getInt16(deltas + i);
      const ro = v.getUint16(offsets + i);
      if (ro === 0) return (cp + delta) & 0xffff;
      const g = v.getUint16(offsets + i + ro + 2 * (cp - debut));
      return g === 0 ? 0 : (g + delta) & 0xffff;
    }
    return 0;
  }

  return {
    unitsPerEm,
    avance(cp) {
      const g = glyphe(cp);
      return g === 0 ? null : avanceGlyphe(g);
    },
  };
}

/** Enregistre une police chargée pour le rendu (appelé par les chargeurs). */
export function enregistrerPolice(famille: string, poids: number, data: ArrayBuffer): void {
  try {
    registre.set(cle(famille, poids), lireMetriques(data));
  } catch (err) {
    console.warn(`[mesure-texte] ${famille} ${poids} illisible :`, err);
  }
}

export function policeEnregistree(famille: string, poids: number): boolean {
  return registre.has(cle(famille, poids));
}

/** Chasse moyenne de repli (police non enregistrée), en em : prudente. */
const CHASSE_REPLI = 0.62;

/** Largeur en pixels d'un texte sur une ligne. */
export function largeurTexte(texte: string, famille: string, poids: number, corps: number): number {
  const m = registre.get(cle(famille, poids));
  let unites = 0;
  for (const ch of texte) {
    const cp = ch.codePointAt(0) ?? 32;
    const a = m?.avance(cp);
    if (m && a !== null && a !== undefined) unites += a / m.unitsPerEm;
    else unites += CHASSE_REPLI;
  }
  return unites * corps;
}
