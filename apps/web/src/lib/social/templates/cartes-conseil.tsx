import { COLORS } from "./instagram-templates";
import { Carte, FONT_TITRE } from "./carte-marque";
import { COULEUR_GUILLEMETS, Ligne, Surtitre, largeurUtile, type Poids, type Teinte } from "./cartes-piste-a";
import { typo } from "../typo";
import { affichage, composerParagraphe } from "../mise-en-lignes";
import { largeurTexte } from "../mesure-texte";

// ───────────────────────────────────────────────────────────────────
// Gabarit de carte Instagram « conseil » (s15, docs/social/visuels-s15/
// gabarit-carte-conseil.md). Carte 1 : surtitre lilas (technique) puis
// situation ; carte 2 : réplique (« » du texte en lilas clair) puis
// « À toi de jouer : … ». Bloc ancré en haut, corps réduit par paliers
// de 4 px de 72 à 56 ; rien ne tient au plancher = erreur, jamais de
// rognage. Ni R6 ni guillemets ajoutés : ce n'est pas une vanne.
// ───────────────────────────────────────────────────────────────────

export const CONSEIL = {
  corpsMax: 72,
  corpsPlancher: 56,
  pas: 4,
  ratioInterligne: 1.25,
  ratioConsigne: 0.8,
  consignePlancher: 40,
  ecartReplique: 48,
  /** Zone de texte : 1350 − 96 (haut) − 72 (pied) − 96 (bas) − 64 (écart au pied). */
  hauteurZone: 1022,
  surtitre: { corps: 40, interligne: 48, poids: 800 as Poids, marge: 32, motsMax: 4 },
} as const;

/** « À toi de jouer : » (début de la consigne, carte 2). */
export const FORMULE_CONSIGNE = "À toi de jouer :";
const MOTIF_CONSIGNE = /^À toi de jouer\s*:/;
const MOTIF_GUILLEMETS = /[«»]/g;

/** Interlignage en multiple de 4 (1,25 × corps). */
export function interligneConseil(corps: number): number {
  return 4 * Math.round((CONSEIL.ratioInterligne * corps) / 4);
}

/** Corps de la consigne pour un corps de réplique R : 0,8 × R arrondi à 4, plancher 40. */
export function corpsConsigne(r: number): number {
  return Math.max(CONSEIL.consignePlancher, 4 * Math.round((CONSEIL.ratioConsigne * r) / 4));
}

export interface ParagrapheConseil {
  lignes: string[];
  corps: number;
  interligne: number;
  poids: Poids;
}

export interface CompositionConseil {
  /** Corps R retenu (situation ou réplique). */
  corps: number;
  paragraphes: ParagrapheConseil[];
  /** Hauteur du bloc (surtitre compris), ≤ CONSEIL.hauteurZone. */
  hauteur: number;
  /** Défauts de coupe restants (mot seul, dernière ligne courte) : 0 attendu. */
  defauts: number;
}

/** Surtitre valide : 4 mots au plus, une ligne de 888 px au plus. */
export function verifierSurtitre(surtitre: string): string {
  const t = affichage(typo(surtitre.trim()));
  const mots = t.split(/\s+/).filter(Boolean).length;
  if (!t || mots > CONSEIL.surtitre.motsMax) throw new Error(`Surtitre conseil « ${surtitre} » : ${mots} mots (1 à ${CONSEIL.surtitre.motsMax}).`);
  const w = largeurTexte(t, FONT_TITRE, CONSEIL.surtitre.poids, CONSEIL.surtitre.corps);
  if (w > largeurUtile("instagram")) throw new Error(`Surtitre conseil « ${surtitre} » : ${Math.ceil(w)} px (max ${largeurUtile("instagram")}).`);
  return t;
}

/** Carte 2 : la consigne commence à la DERNIÈRE « À toi de jouer : » ; absente = erreur. */
export function decouperCarte2(texte: string): { replique: string; consigne: string } {
  const i = texte.lastIndexOf(FORMULE_CONSIGNE);
  const replique = i >= 0 ? texte.slice(0, i).trim() : "";
  if (i < 0 || !replique) throw new Error(`Carte 2 du conseil sans « ${FORMULE_CONSIGNE} » ou sans réplique : « ${texte.slice(0, 60)}… ».`);
  return { replique, consigne: texte.slice(i).trim() };
}

/**
 * Premier palier R (72 → 56, pas 4) où tous les paragraphes tiennent dans la
 * zone (entête + lignes × interligne + écarts ≤ 1022). Sinon : erreur.
 */
function ajuster(nom: string, entete: number, blocs: Array<{ texte: string; poids: Poids; consigne?: boolean }>): CompositionConseil {
  const largeur = largeurUtile("instagram");
  const essais: string[] = [];
  for (let r = CONSEIL.corpsMax; r >= CONSEIL.corpsPlancher; r -= CONSEIL.pas) {
    const paras = blocs.map((b) => {
      const corps = b.consigne ? corpsConsigne(r) : r;
      const l = composerParagraphe(typo(b.texte), { famille: FONT_TITRE, poids: b.poids }, corps, largeur);
      return l && { lignes: l.lignes, corps, interligne: interligneConseil(corps), poids: b.poids, defauts: l.defauts };
    });
    if (paras.some((p) => !p)) { essais.push(`${r} px : mot plus large que la colonne`); continue; }
    const ok = paras as Array<ParagrapheConseil & { defauts: number }>;
    const hauteur = entete + ok.reduce((h, p) => h + p.lignes.length * p.interligne, 0) + CONSEIL.ecartReplique * (ok.length - 1);
    const lignes = ok.map((p) => p.lignes.length).join(" + ");
    if (hauteur <= CONSEIL.hauteurZone) {
      return {
        corps: r, hauteur, defauts: ok.reduce((d, p) => d + p.defauts, 0),
        paragraphes: ok.map(({ lignes: l, corps, interligne, poids }) => ({ lignes: l, corps, interligne, poids })),
      };
    }
    essais.push(`${r} px : ${lignes} lignes, ${hauteur} px`);
  }
  throw new Error(`${nom} trop longue pour le gabarit conseil (zone ${CONSEIL.hauteurZone} px, plancher ${CONSEIL.corpsPlancher} px) : ${essais.join(" ; ")}. Rien n'est rogné.`);
}

export function compositionConseilCarte1(surtitre: string, situation: string): CompositionConseil {
  verifierSurtitre(surtitre);
  return ajuster("Carte 1 du conseil", CONSEIL.surtitre.interligne + CONSEIL.surtitre.marge, [{ texte: situation, poids: 700 }]);
}

export function compositionConseilCarte2(replique: string, consigne: string): CompositionConseil {
  return ajuster("Carte 2 du conseil", 0, [{ texte: replique, poids: 800 }, { texte: consigne, poids: 700, consigne: true }]);
}

/** Teinte de chaque caractère des lignes d'un paragraphe (motif en lilas). */
function teintesLignes(lignes: string[], motif: RegExp | undefined, couleur: string): Teinte[][] {
  const texte = lignes.join(" ");
  const t: Teinte[] = new Array([...texte].length).fill(undefined);
  if (motif) {
    const re = new RegExp(motif.source, motif.flags.includes("g") ? motif.flags : `${motif.flags}g`);
    for (const m of texte.matchAll(re)) {
      const debut = [...texte.slice(0, m.index)].length;
      for (let k = 0; k < [...m[0]].length; k++) t[debut + k] = couleur;
    }
  }
  let pos = 0;
  return lignes.map((l) => {
    const n = [...l].length;
    const s = t.slice(pos, pos + n);
    pos += n + 1;
    return s;
  });
}

function Paragraphe({ p, motif, couleurMotif = COULEUR_GUILLEMETS.aplat }: { p: ParagrapheConseil; motif?: RegExp; couleurMotif?: string }) {
  const teintes = teintesLignes(p.lignes, motif, couleurMotif);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_TITRE,
        fontWeight: p.poids,
        fontSize: p.corps,
        lineHeight: `${p.interligne}px`,
        color: COLORS.textPrimary,
      }}
    >
      {p.lignes.map((l, j) => (
        <Ligne key={j} texte={l} corps={p.corps} teintes={teintes[j]} />
      ))}
    </div>
  );
}

/**
 * Carte 1 : surtitre (technique, lilas #A78BFA, 800) puis situation (blanc, 700), « » du texte blancs.
 * Composée au rendu (polices chargées, mesure réelle) : trop long = erreur, aucun PNG.
 */
export function ConseilCarte1({ surtitre, situation, indice }: { surtitre: string; situation: string; indice?: string }) {
  const composition = compositionConseilCarte1(surtitre, situation);
  return (
    <Carte format="instagram" indice={indice} position="debut">
      <Surtitre texte={surtitre} poids={CONSEIL.surtitre.poids} />
      <Paragraphe p={composition.paragraphes[0]} />
    </Carte>
  );
}

/** Carte 2 (aplat) : réplique 800, ses « » en #DDD6FE ; consigne 700, « À toi de jouer : » en #DDD6FE. */
export function ConseilCarte2({ texte }: { texte: string }) {
  const d = decouperCarte2(texte);
  const [replique, consigne] = compositionConseilCarte2(d.replique, d.consigne).paragraphes;
  return (
    <Carte format="instagram" fond="aplat" position="debut">
      <Paragraphe p={replique} motif={MOTIF_GUILLEMETS} />
      <div style={{ display: "flex", marginTop: CONSEIL.ecartReplique }}>
        <Paragraphe p={consigne} motif={MOTIF_CONSIGNE} />
      </div>
    </Carte>
  );
}
