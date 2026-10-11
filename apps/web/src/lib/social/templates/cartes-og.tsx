import { COLORS } from "./instagram-templates";
import { CarteOg } from "./carte-marque";
import { Bloc, composition, estPremierePersonne, hauteurTitreMax, lignesTitreMax, TAILLES } from "./cartes-piste-a";
import { typo } from "../typo";
import { affichage } from "../mise-en-lignes";

// ───────────────────────────────────────────────────────────────────
// Images Open Graph 1200×630 (spec @design cycle 8 §1.5 et §1.6)
//
// Même identité que les cartes sociales : fond #0D0D0D uni, Plus Jakarta
// Sans 800/700 mesurée (mise-en-lignes.ts), accent lilas #A78BFA, pied
// monogramme + domaine à droite. Jamais de dégradé, d'emoji ni de texte
// tronqué : un titre trop long réduit son corps (plancher 48 px), une
// vanne qui ne tient pas à 36 px rend la carte de marque (OgAccueil).
// Appelant : `await getFonts()` (polices.ts) AVANT de composer.
// ───────────────────────────────────────────────────────────────────

/** Sous-ligne de l'accueil et du quiz (phrase de la bannière X, déjà validée). */
export const SOUS_LIGNE_OG = "Quiz d'humour, sans inscription.";
const COULEUR_SOUS_LIGNE = "#D4D4D4";
const INTERLIGNE = 1.12;

/** Titre d'article : 64 px nominal, pas de 2, plancher 48, 3 lignes max. */
export const CORPS_TITRE_OG = TAILLES.og.titre;
export const PLANCHER_TITRE_OG = 48;
export const LIGNES_TITRE_OG = lignesTitreMax("og", true);

/** Vanne : même corps pour l'amorce et la chute, premier palier qui tient. */
export const PALIERS_VANNE_OG = [48, 44, 40, 36] as const;
export const ECART_VANNE_OG = 24;
/** Débordement des jambages sous la dernière boîte de ligne, en em. */
const JAMBAGE = 0.2;

const NOMBRE = /\d+/;

/**
 * Coupe un texte au dernier mot entier tenant en `max` caractères, « … »
 * ajouté (spec §1.6). Jamais au milieu d'un mot, ponctuation finale retirée.
 */
export function couperAuMot(texte: string, max: number): string {
  const t = texte.trim();
  if ([...t].length <= max) return t;
  const debut = [...t].slice(0, max).join("");
  const espace = debut.lastIndexOf(" ");
  const coupe = (espace > 0 ? debut.slice(0, espace) : debut).replace(/[\s:;,.!?\-–]+$/u, "");
  return `${coupe}…`;
}

export interface TitreOg {
  texte: string;
  corps: number;
  lignes: string[];
}

/** Lignes et corps d'un titre au corps `taille` (mêmes règles que la couverture). */
function essayerTitre(texte: string, taille: number) {
  const c = composition({ textes: [texte], taille, format: "og", accent: NOMBRE });
  return { corps: c.corps, lignes: c.paragraphes.flat() };
}

/**
 * Titre entier, puis coupé à 100, puis à 80 caractères, jusqu'à obtenir
 * ≤ 3 lignes à un corps ≥ 48 px qui tiennent dans la hauteur garantie.
 */
export function composerTitreOg(titre: string, avecEtiquette: boolean): TitreOg {
  const hauteur = hauteurTitreMax("og", avecEtiquette);
  const candidats = [...new Set([titre.trim(), couperAuMot(titre, 100), couperAuMot(titre, 80)])];
  let dernier: TitreOg | null = null;
  for (const texte of candidats) {
    for (let taille = CORPS_TITRE_OG; taille >= PLANCHER_TITRE_OG; taille -= 2) {
      const { corps, lignes } = essayerTitre(texte, taille);
      dernier = { texte, corps, lignes };
      const tient = lignes.length <= LIGNES_TITRE_OG && lignes.length * corps * INTERLIGNE <= hauteur;
      if (tient && corps >= PLANCHER_TITRE_OG) return dernier;
    }
  }
  // Inatteignable en pratique (80 caractères tiennent en 3 lignes à 48 px).
  return dernier ?? { texte: titre, corps: PLANCHER_TITRE_OG, lignes: [titre] };
}

/**
 * Corps commun de l'amorce et de la chute d'une vanne, ou null si rien ne
 * tient à 36 px dans la hauteur garantie (la route rend alors OgAccueil).
 */
export function corpsVanneOg(content: string, punchline: string): number | null {
  const textes = [content, punchline].map((t) => t.trim()).filter(Boolean);
  if (textes.length === 0) return null;
  const citation = estPremierePersonne(...textes) ? ("sombre" as const) : undefined;
  const hauteur = hauteurTitreMax("og", true);
  const composer = (taille: number) =>
    textes.map((t) => composition({ textes: [t], taille, format: "og", poids: 700, citation }));
  for (const palier of PALIERS_VANNE_OG) {
    let blocs = composer(palier);
    const corps = Math.min(...blocs.map((b) => b.corps));
    if (corps !== palier) blocs = composer(corps);
    if (corps < PALIERS_VANNE_OG[PALIERS_VANNE_OG.length - 1] || blocs.some((b) => b.corps !== corps)) continue;
    const lignes = blocs.reduce((n, b) => n + b.paragraphes.flat().length, 0);
    const total = lignes * corps * INTERLIGNE + (textes.length - 1) * ECART_VANNE_OG;
    // Jambages (p, j, q) : l'encre de la dernière ligne déborde de la boîte d'environ
    // 0,2 em à l'interligne 1,12 (mesuré au rendu : 8 px à 44 px). Compté pour
    // garantir 64 px d'ENCRE entre la vanne et le pied, pas seulement de boîte.
    if (total + JAMBAGE * corps <= hauteur) return corps;
  }
  return null;
}

function SousLigne() {
  return (
    <div style={{ display: "flex", marginTop: 40, fontSize: 44, fontWeight: 400, lineHeight: 1.2, color: COULEUR_SOUS_LIGNE }}>
      {affichage(typo(SOUS_LIGNE_OG))}
    </div>
  );
}

/** Accueil (et carte de marque de repli) : « plus drôle. » en lilas. */
export function OgAccueil() {
  return (
    <CarteOg>
      <Bloc textes={["Une vanne par jour\npour devenir plus drôle."]} taille={80} format="og" accent={/plus drôle\./} />
      <SousLigne />
    </CarteOg>
  );
}

/** Quiz : « es-tu ? » en lilas. Plus de profils (emojis) ni de « gratuit ». */
export function OgQuiz() {
  return (
    <CarteOg>
      <Bloc textes={["Quel type\nd'humour es-tu ?"]} taille={88} format="og" accent={/es-tu\s*\?/u} />
      <SousLigne />
    </CarteOg>
  );
}

/** Article : catégorie lisible en étiquette, titre 64 px (plancher 48), nombres en lilas. */
export function OgArticle({ titre, etiquette }: { titre: string; etiquette?: string }) {
  const t = composerTitreOg(titre, Boolean(etiquette));
  return (
    <CarteOg etiquette={etiquette || undefined}>
      <Bloc textes={[t.texte]} taille={t.corps} format="og" accent={NOMBRE} />
    </CarteOg>
  );
}

/**
 * Vanne : amorce blanche, chute lilas, même corps (`corpsVanneOg`). R6 :
 * à la 1re personne, une paire « » par ligne de vanne. Sans place : carte de marque.
 */
export function OgVanne({ content, punchline }: { content: string; punchline: string }) {
  const corps = corpsVanneOg(content, punchline);
  if (corps === null) return <OgAccueil />;
  const citation = estPremierePersonne(content, punchline) ? ("sombre" as const) : undefined;
  return (
    <CarteOg etiquette="Vanne">
      {content.trim() && <Bloc textes={[content.trim()]} taille={corps} format="og" poids={700} citation={citation} />}
      {punchline.trim() && (
        <div style={{ display: "flex", marginTop: content.trim() ? ECART_VANNE_OG : 0 }}>
          <Bloc
            textes={[punchline.trim()]}
            taille={corps}
            format="og"
            poids={700}
            couleur={COLORS.accentHover}
            citation={citation}
          />
        </div>
      )}
    </CarteOg>
  );
}
