import { COLORS } from "./instagram-templates";
import {
  Carte,
  FONT_TITRE,
  FONT_TEXTE,
  FORMATS,
  TAILLE_PIED,
  TAILLE_MONOGRAMME,
  type FondCarte,
  type FormatCarte,
} from "./carte-marque";
import { typo, NBSP, NNBSP } from "../typo";
import { mettreEnLignes, affichage } from "../mise-en-lignes";
import { largeurTexte } from "../mesure-texte";

// ───────────────────────────────────────────────────────────────────
// Cartes « piste A », v4 (notations cycle 3 @design et @reviewer, v5 §8)
//
// Plus Jakarta Sans 800/700, lignes calculées sur les largeurs réelles
// des glyphes (mise-en-lignes.ts). Une carte = un temps. R6 : une vanne
// à la 1re personne s'affiche entre « », une paire par ligne de vanne,
// guillemets lilas au même corps, « suspendu dans la marge (≥ 48 px),
// » collé au dernier mot ; “ ” à l'intérieur. Surtitres, boutons, pied,
// cartes 3 et 4 du décryptage : jamais de guillemets.
// ───────────────────────────────────────────────────────────────────

/** Tailles par format (Instagram = référence). Amorce 88 si elle tient en 4 lignes. */
export const TAILLES: Record<FormatCarte, { amorce: number; chute: number; titre: number }> = {
  instagram: { amorce: 88, chute: 100, titre: 76 },
  x: { amorce: 72, chute: 88, titre: 76 },
  linkedin: { amorce: 44, chute: 60, titre: 64 },
};
/** Repli de l'amorce Instagram au-delà de 4 lignes. */
const AMORCE_REPLI = 80;
const LIGNES_AMORCE_MAX = 4;

/** Lilas des guillemets R6 et des surtitres intégrés : sur noir (7,1:1), sur l'aplat (5,0:1). */
export const COULEUR_GUILLEMETS: Record<FondCarte, string> = { sombre: "#A78BFA", aplat: "#DDD6FE" };
/** Bord gauche minimal du « suspendu (hors découpe 3:4 de 34 px). */
export const MARGE_GUILLEMET = 48;
/** Écart minimal entre un titre de couverture et le pied (notation @reviewer cycle 3). */
export const ECART_TITRE_PIED = 64;
const INTERLIGNE = 1.12;

type Poids = 700 | 800;
type Teinte = string | undefined;

/** Largeur utile d'un format (hors marges de sécurité). */
export function largeurUtile(format: FormatCarte): number {
  return FORMATS[format].width - 2 * FORMATS[format].padX;
}

/** Corps commun et lignes de chaque paragraphe (même corps pour tout le bloc). */
export function composerBloc(textes: string[], taille: number, poids: Poids, largeur: number) {
  const police = { famille: FONT_TITRE, poids };
  const corps = Math.min(...textes.map((t) => mettreEnLignes(t, police, taille, largeur).corps));
  return { corps, paragraphes: textes.map((t) => mettreEnLignes(t, police, corps, largeur).lignes) };
}

/**
 * Texte d'une ligne de vanne citée (R6), passé par typo() : les « » de
 * 1er niveau du texte deviennent “ ”, et le » fermant est collé au
 * dernier mot par une espace fine insécable (compté dans la mesure).
 */
export function texteCite(texte: string, fermer: boolean): string {
  const t = typo(texte).replace(new RegExp(`«${NBSP}`, "g"), "“").replace(new RegExp(`${NBSP}»`, "g"), "”");
  return fermer ? `${t}${NNBSP}»` : t;
}

/** Une vanne est citée (R6) si l'une de ses lignes est à la 1re personne. */
export function estPremierePersonne(...lignes: string[]): boolean {
  return lignes.some((l) => /(^|[^\p{L}])(j['’]|m['’]|(je|me|moi|mon|ma|mes)(?!\p{L}))/iu.test(l));
}

/**
 * Approche optique de la ponctuation basse et de l'apostrophe (satori
 * n'applique pas le crénage GPOS). Valeurs en em. Le trait d'union est
 * rendu en Inter (plus court) : celui de Plus Jakarta se lit comme un
 * demi-cadratin (notation cycle 3).
 */
export const APPROCHE: Record<string, { avant: number; apres: number }> = {
  ".": { avant: -0.07, apres: -0.05 },
  ",": { avant: -0.06, apres: -0.06 },
  "…": { avant: -0.05, apres: -0.03 },
  "’": { avant: -0.05, apres: -0.05 },
};

/** Découpe une ligne en segments : texte courant, ponctuation rapprochée, trait d'union en Inter. */
export function segmentsLigne(ligne: string): Array<{ texte: string; avant: number; apres: number; police?: string }> {
  return ligne
    .split(/([.,…’-])/)
    .filter(Boolean)
    .map((t) => ({
      texte: t,
      avant: APPROCHE[t]?.avant ?? 0,
      apres: APPROCHE[t]?.apres ?? 0,
      ...(t === "-" ? { police: FONT_TEXTE } : {}),
    }));
}

/** Regroupe les caractères consécutifs de même teinte. */
function tronçons(texte: string, teintes: Teinte[]): Array<{ texte: string; couleur: Teinte }> {
  const out: Array<{ texte: string; couleur: Teinte }> = [];
  [...texte].forEach((ch, i) => {
    const c = teintes[i];
    const der = out[out.length - 1];
    if (der && der.couleur === c) der.texte += ch;
    else out.push({ texte: ch, couleur: c });
  });
  return out;
}

function Ligne({ texte, corps, teintes = [] }: { texte: string; corps: number; teintes?: Teinte[] }) {
  return (
    <div style={{ display: "flex" }}>
      {tronçons(texte, teintes).flatMap((t, i) =>
        segmentsLigne(t.texte).map((s, k) => (
          <div
            key={`${i}-${k}`}
            style={{
              display: "flex",
              whiteSpace: "pre",
              marginLeft: Math.round(s.avant * corps),
              marginRight: Math.round(s.apres * corps),
              ...(s.police ? { fontFamily: s.police } : {}),
              ...(t.couleur ? { color: t.couleur } : {}),
            }}
          >
            {s.texte}
          </div>
        )),
      )}
    </div>
  );
}

/** Teinte de chaque caractère d'un paragraphe affiché (motif en accent, » final en lilas). */
function teintesParagraphe(p: string, accent: RegExp | undefined, couleurAccent: string, fermant?: string): Teinte[] {
  const t: Teinte[] = new Array([...p].length).fill(undefined);
  if (accent) {
    const re = new RegExp(accent.source, accent.flags.includes("g") ? accent.flags : `${accent.flags}g`);
    for (const m of p.matchAll(re)) {
      const debut = [...p.slice(0, m.index)].length;
      for (let k = 0; k < [...m[0]].length; k++) t[debut + k] = couleurAccent;
    }
  }
  if (fermant && p.endsWith("»")) t[t.length - 1] = fermant;
  return t;
}

interface BlocProps {
  textes: string[];
  taille: number;
  format?: FormatCarte;
  poids?: Poids;
  couleur?: string;
  gap?: number;
  /** Vanne citée (R6) : fond de la carte, pour la teinte des guillemets. */
  citation?: FondCarte;
  /** Motif affiché en lilas (surtitre intégré, nombre d'un titre). */
  accent?: RegExp;
  /** Fond de la carte, pour la teinte du motif en accent (défaut : noir). */
  fond?: FondCarte;
  /** Plafond de lignes du bloc entier (sinon corps réduit). */
  lignesMax?: number;
}

/** Calcule la composition d'un bloc (exportée pour les tests). */
export function composition({ textes, taille, format = "instagram", poids = 800, citation, lignesMax }: BlocProps) {
  const f = FORMATS[format];
  const ouvrant = `«${affichage(NNBSP)}`;
  const suspendu = citation ? largeurTexte(ouvrant, FONT_TITRE, poids, taille) : 0;
  const decalage = citation ? Math.max(0, MARGE_GUILLEMET + Math.ceil(suspendu) - f.padX) : 0;
  const largeur = largeurUtile(format) - decalage;
  const src = citation ? textes.map((t, i) => texteCite(t, i === textes.length - 1)) : textes.map((t) => typo(t));
  let c = composerBloc(src, taille, poids, largeur);
  for (let t = taille - 2; lignesMax && t >= 28 && c.paragraphes.flat().length > lignesMax; t -= 2) {
    c = composerBloc(src, t, poids, largeur);
  }
  return { ...c, decalage, suspendu: citation ? largeurTexte(ouvrant, FONT_TITRE, poids, c.corps) : 0, ouvrant };
}

/** Paragraphes : une ligne = un div sans retour automatique. */
function Bloc(props: BlocProps) {
  const { poids = 800, couleur = COLORS.textPrimary, gap = 40, citation, accent, fond = citation ?? "sombre" } = props;
  const { corps, paragraphes, decalage, suspendu, ouvrant } = composition(props);
  const lilas = citation ? COULEUR_GUILLEMETS[citation] : undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, marginLeft: decalage }}>
      {paragraphes.map((lignes, i) => {
        const teintes = teintesParagraphe(lignes.join(" "), accent, COULEUR_GUILLEMETS[fond], lilas);
        let pos = 0;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: FONT_TITRE,
              fontWeight: poids,
              fontSize: corps,
              lineHeight: INTERLIGNE,
              color: couleur,
            }}
          >
            {lignes.map((l, j) => {
              const t = teintes.slice(pos, pos + [...l].length);
              pos += [...l].length + 1;
              const ligne = <Ligne key={j} texte={l} corps={corps} teintes={t} />;
              if (!(citation && i === 0 && j === 0)) return ligne;
              return (
                <div key={j} style={{ display: "flex", marginLeft: -Math.round(suspendu) }}>
                  <div style={{ display: "flex", whiteSpace: "pre", color: lilas }}>{ouvrant}</div>
                  {ligne}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** Surtitre (« Vanne n° 2 sur 8 », titre du conseil) : jamais de guillemets. */
function Surtitre({ texte, couleur = COLORS.accentHover }: { texte: string; couleur?: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_TITRE,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: 1.2,
        color: couleur,
        marginBottom: 32,
        whiteSpace: "pre",
      }}
    >
      {affichage(typo(texte))}
    </div>
  );
}

/** Bouton d'appel à l'action (« Lien en bio », « Lien dans le post ») : blanc, texte violet. */
function Bouton({ texte }: { texte: string }) {
  return (
    <div style={{ display: "flex", marginTop: 56 }}>
      <div
        style={{
          display: "flex",
          backgroundColor: COLORS.textPrimary,
          color: COLORS.accentSecondary,
          fontFamily: FONT_TITRE,
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1,
          padding: "26px 40px",
          borderRadius: 12,
        }}
      >
        {texte}
      </div>
    </div>
  );
}

// ─── Vanne (et relais d'article Instagram : 2 cartes vanne) ──────

/** Corps de l'amorce Instagram : 88 si elle tient en 4 lignes, sinon 80. */
export function corpsAmorce(amorce: string, citation: boolean): number {
  const c = composition({ textes: [amorce], taille: TAILLES.instagram.amorce, citation: citation ? "sombre" : undefined });
  return c.paragraphes.flat().length <= LIGNES_AMORCE_MAX ? TAILLES.instagram.amorce : AMORCE_REPLI;
}

export function VanneAmorce({ amorce, indice, citation = false }: { amorce: string; indice?: string; citation?: boolean }) {
  return (
    <Carte format="instagram" kind="vanne" indice={indice} position="haut">
      <Bloc textes={[amorce]} taille={corpsAmorce(amorce, citation)} citation={citation ? "sombre" : undefined} />
    </Carte>
  );
}

export function VanneChute({
  chute,
  format = "instagram",
  citation = false,
}: {
  chute: string[];
  format?: FormatCarte;
  citation?: boolean;
}) {
  return (
    <Carte format={format} fond="aplat">
      <Bloc
        textes={chute}
        taille={TAILLES[format].chute}
        format={format}
        gap={format === "linkedin" ? 20 : 48}
        citation={citation ? "aplat" : undefined}
      />
    </Carte>
  );
}

/** Repli LinkedIn (amorce > 140 caractères) : amorce et chute sur une carte, une paire chacune. */
export function VanneComplete({
  amorce,
  chute,
  format,
  citation = false,
}: {
  amorce: string;
  chute: string[];
  format: FormatCarte;
  citation?: boolean;
}) {
  const t = TAILLES[format];
  const fond = citation ? "sombre" : undefined;
  return (
    <Carte format={format}>
      <Bloc textes={[amorce]} taille={t.amorce} format={format} poids={700} citation={fond} />
      <div style={{ display: "flex", marginTop: format === "linkedin" ? 20 : 40 }}>
        <Bloc textes={chute} taille={t.amorce} format={format} couleur={COLORS.accentHover} gap={12} citation={fond} />
      </div>
    </Carte>
  );
}

// ─── Décryptage (carrousel 4 cartes, cartes 3 et 4) ──────────────

/** Surtitre intégré : « Pourquoi ça fait rire : », « À toi de jouer : » en lilas. */
const SURTITRE_INTEGRE = /^[^:]+:/;

/** Carte 3 : le mécanisme en une phrase, surtitre intégré, sans guillemets. */
export function DecryptageMecanisme({ texte }: { texte: string }) {
  return (
    <Carte format="instagram">
      <Bloc textes={[texte]} taille={64} accent={SURTITRE_INTEGRE} />
    </Carte>
  );
}

/** Carte 4 : consigne « à toi de jouer » puis renvoi au quiz, sans bouton. */
export function DecryptageConsigne({ consigne, renvoi }: { consigne: string; renvoi: string }) {
  return (
    <Carte format="instagram" fond="aplat">
      <Bloc textes={[consigne]} taille={64} accent={SURTITRE_INTEGRE} fond="aplat" />
      <div style={{ display: "flex", marginTop: 48 }}>
        <Bloc textes={[renvoi]} taille={64} />
      </div>
    </Carte>
  );
}

// ─── Article ─────────────────────────────────────────────────────

/** Hauteur disponible pour un titre centré, écart titre/pied garanti. */
export function hauteurTitreMax(format: FormatCarte, avecEtiquette: boolean): number {
  const f = FORMATS[format];
  const etiquette = avecEtiquette ? Math.round(TAILLE_PIED[format] * 1.2) : 0;
  const pied = TAILLE_MONOGRAMME[format];
  // Bloc centré : l'écart minimal au pied vaut aussi au-dessus.
  return f.height - 2 * f.padY - etiquette - pied - 2 * ECART_TITRE_PIED;
}

/** Lignes maximales d'un titre de couverture au corps nominal. */
export function lignesTitreMax(format: FormatCarte, avecEtiquette: boolean): number {
  return Math.max(1, Math.floor(hauteurTitreMax(format, avecEtiquette) / (TAILLES[format].titre * INTERLIGNE)));
}

/**
 * Couverture : le titre seul, son nombre en lilas (le chiffre géant
 * répétait le nombre du titre). Corps réduit si le titre dépasse la
 * hauteur qui garantit 64 px au-dessus du pied.
 */
export function ArticleCouverture({
  titre,
  format = "instagram",
  sansEtiquette = false,
  indice,
}: {
  titre: string;
  format?: FormatCarte;
  sansEtiquette?: boolean;
  indice?: string;
}) {
  return (
    <Carte format={format} kind={sansEtiquette ? undefined : "article"} indice={indice}>
      <Bloc
        textes={[titre]}
        taille={TAILLES[format].titre}
        format={format}
        accent={/\d+/}
        lignesMax={lignesTitreMax(format, !sansEtiquette)}
      />
    </Carte>
  );
}

/** Extrait, temps 1 : l'amorce seule, surtitre « Vanne n° 2 sur 8 ». */
export function ArticleExtraitAmorce({ amorce, surtitre, citation = false }: { amorce: string; surtitre: string; citation?: boolean }) {
  return (
    <Carte format="instagram" kind="article">
      <Surtitre texte={surtitre} />
      <Bloc textes={[amorce]} taille={AMORCE_REPLI} citation={citation ? "sombre" : undefined} />
    </Carte>
  );
}

/** Dernière slide : « Les N autres … » + bouton. */
export function CarteFin({ texte, cta }: { texte: string; cta: string }) {
  return (
    <Carte format="instagram" fond="aplat">
      <Bloc textes={[texte]} taille={88} />
      <Bouton texte={cta} />
    </Carte>
  );
}

// ─── Conseil ─────────────────────────────────────────────────────

export function ConseilSituation({ titreConseil, situation, indice }: { titreConseil: string; situation: string; indice?: string }) {
  return (
    <Carte format="instagram" kind="conseil" indice={indice} position="haut">
      <Surtitre texte={titreConseil} />
      <Bloc textes={[situation]} taille={AMORCE_REPLI} />
    </Carte>
  );
}

/** Réplique à dire : une paire « » autour de la réplique entière (le « géant est retiré). */
export function ConseilReplique({ replique }: { replique: string[] }) {
  return (
    <Carte format="instagram" fond="aplat">
      <Bloc textes={replique} taille={TAILLES.instagram.chute} gap={40} citation="aplat" />
    </Carte>
  );
}

/** Principe en une phrase + appel à l'action : fin du carrousel conseil. */
export function ConseilPrincipe({ surtitre, principe, cta }: { surtitre: string; principe: string; cta: string }) {
  return (
    <Carte format="instagram" kind="conseil">
      <Surtitre texte={surtitre} />
      <Bloc textes={[principe]} taille={64} />
      <Bouton texte={cta} />
    </Carte>
  );
}
