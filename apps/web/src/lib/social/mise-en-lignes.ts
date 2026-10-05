import { largeurTexte } from "./mesure-texte";

// ───────────────────────────────────────────────────────────────────
// Mise en lignes équilibrée des cartes sociales (visuels v3, s15)
//
// Entrée : un paragraphe passé par typo() (insécables = mots collés).
// Sortie : des lignes prêtes à afficher, une par div sans retour
// automatique. Règles (notation @design cycle 2, point 2) :
//   - coupure aux seules espaces normales, largeurs réelles de glyphes ;
//   - nombre minimal de lignes, longueurs équilibrées ;
//   - jamais un mot seul sur une ligne (début, milieu ou fin) ;
//   - dernière ligne ≥ 40 % de la plus longue ;
//   - corps réduit seulement si un bloc insécable déborde, plancher 28 px.
// ───────────────────────────────────────────────────────────────────

export const PLANCHER_CORPS = 28;
const NBSP = " ";
const NNBSP = " ";
/** Espace fine affichée (U+202F absente de Plus Jakarta Sans, U+2009 présente). */
const FINE = " ";
/** Marge de prudence : la mesure ignore le crénage et l'arrondi de satori. */
const MARGE = 0.97;

export interface Police {
  famille: string;
  poids: number;
}

export interface Lignes {
  lignes: string[];
  corps: number;
}

/** Texte affiché : insécables rendues en espaces simples (plus de trous). */
export function affichage(texte: string): string {
  return texte.split(NBSP).join(" ").split(NNBSP).join(FINE);
}

function nbMots(texte: string): number {
  return texte
    .split(/[   ]+/)
    .filter((m) => m && !/^[:;?!»«“”…,.]+$/.test(m)).length;
}

/** Sépare un bloc insécable trop large (on garde « : », « ? » et « » » collés). */
function decollerBloc(bloc: string): string[] {
  const parts = bloc.split(/[ ]/);
  const out: string[] = [];
  for (const p of parts) {
    if (out.length > 0 && (/^[:»]/.test(p) || out[out.length - 1].endsWith("«"))) {
      out[out.length - 1] += NBSP + p;
    } else out.push(p);
  }
  return out;
}

/** La ligne finit par un début de phrase d'un seul mot (« … ». J’ai »). */
function debutDePhraseSeul(ligne: string): boolean {
  const m = ligne.match(/[.?!»] (\S+)$/);
  return m !== null && nbMots(m[1]) < 2;
}

interface Solution {
  lignes: string[];
  largeurs: number[];
  defauts: number;
}

function resoudre(blocs: string[], larg: number[], esp: number, max: number, nbLignes: number): Solution | null {
  const n = blocs.length;
  const motsTotal = nbMots(blocs.join(" "));
  const largeurLigne = (i: number, j: number) => {
    let w = 0;
    for (let k = i; k < j; k++) w += larg[k] + (k > i ? esp : 0);
    return w;
  };
  const cout = (i: number, j: number) => {
    const w = largeurLigne(i, j);
    if (w > max) return Infinity;
    const texte = blocs.slice(i, j).join(" ");
    const seul = motsTotal > 1 && nbMots(texte) < 2 ? 1e12 : 0;
    // Coupe de sens : on préfère couper après « : » ou une fin de phrase
    // plutôt qu'au milieu de la ligne suivante (« … avec humour : / 5 … »).
    const ponctuationInterne = (texte.match(/(:|[.?!»]) \S/g) ?? []).length;
    // Début de phrase laissé seul en fin de ligne (« … ». J’ai / dit… ») :
    // aussi visible qu'un orphelin, on l'évite autant que possible.
    const debutSeul = j < blocs.length && debutDePhraseSeul(texte) ? 1e10 : 0;
    return (max - w) ** 2 + seul + debutSeul + ponctuationInterne * (0.3 * max) ** 2;
  };
  // dp[l][j] : coût minimal pour poser les j premiers blocs sur l lignes.
  const dp: number[][] = Array.from({ length: nbLignes + 1 }, () => new Array(n + 1).fill(Infinity));
  const prec: number[][] = Array.from({ length: nbLignes + 1 }, () => new Array(n + 1).fill(-1));
  dp[0][0] = 0;
  for (let l = 1; l <= nbLignes; l++) {
    for (let j = 1; j <= n; j++) {
      for (let i = l - 1; i < j; i++) {
        if (dp[l - 1][i] === Infinity) continue;
        const c = dp[l - 1][i] + cout(i, j);
        if (c < dp[l][j]) {
          dp[l][j] = c;
          prec[l][j] = i;
        }
      }
    }
  }
  if (dp[nbLignes][n] === Infinity) return null;
  const coupes: Array<[number, number]> = [];
  for (let l = nbLignes, j = n; l > 0; l--) {
    const i = prec[l][j];
    coupes.unshift([i, j]);
    j = i;
  }
  const lignes = coupes.map(([i, j]) => blocs.slice(i, j).join(" "));
  const largeurs = coupes.map(([i, j]) => largeurLigne(i, j));
  const plusLongue = Math.max(...largeurs);
  let defauts = lignes.filter((l) => motsTotal > 1 && nbMots(l) < 2).length;
  defauts += lignes.slice(0, -1).filter(debutDePhraseSeul).length;
  if (lignes.length > 1 && largeurs[largeurs.length - 1] < 0.4 * plusLongue) defauts++;
  return { lignes, largeurs, defauts };
}

/**
 * Coupe un paragraphe (déjà passé par typo()) en lignes équilibrées
 * tenant dans `largeur` px, au corps `corps` ou au plus grand corps
 * possible au-dessus du plancher.
 */
export function mettreEnLignes(texte: string, police: Police, corps: number, largeur: number): Lignes {
  // Si un mot seul est inévitable au corps nominal, on descend jusqu'à
  // -30 % pour trouver une coupe sans défaut avant de l'accepter.
  const nominal = composer(texte, police, corps, largeur);
  if (nominal.defauts === 0) return nominal;
  const plancher = Math.max(PLANCHER_CORPS, Math.round(corps * 0.7));
  for (let c = nominal.corps - 2; c >= plancher; c -= 2) {
    const essai = composer(texte, police, c, largeur);
    if (essai.defauts === 0) return essai;
  }
  return nominal;
}

function composer(texte: string, police: Police, corps: number, largeur: number): Lignes & { defauts: number } {
  const max = largeur * MARGE;
  let blocs = texte.trim().split(/ +/).filter(Boolean);
  const mesure = (t: string, c: number) => largeurTexte(affichage(t), police.famille, police.poids, c);
  let c = corps;
  while (c > PLANCHER_CORPS && blocs.some((b) => mesure(b, c) > max)) c -= 2;
  c = Math.max(PLANCHER_CORPS, c);
  if (blocs.some((b) => mesure(b, c) > max)) {
    blocs = blocs.flatMap((b) => (mesure(b, c) > max ? decollerBloc(b) : [b]));
  }
  const larg = blocs.map((b) => mesure(b, c));
  const esp = mesure(" ", c);

  let meilleure: Solution | null = null;
  let minimum = 0;
  for (let l = 1; l <= blocs.length; l++) {
    const s = resoudre(blocs, larg, esp, max, l);
    if (!s) continue;
    if (s.defauts === 0) return { lignes: s.lignes.map(affichage), corps: c, defauts: 0 };
    if (!minimum) minimum = l;
    if (!meilleure || s.defauts < meilleure.defauts) meilleure = s;
    // Au-delà de 2 lignes de plus que le minimum, on garde le moins mauvais.
    if (l >= minimum + 2) break;
  }
  const lignes = meilleure ? meilleure.lignes : blocs;
  return { lignes: lignes.map(affichage), corps: c, defauts: meilleure ? meilleure.defauts : 1 };
}
