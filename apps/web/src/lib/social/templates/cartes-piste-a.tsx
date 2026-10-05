import { COLORS } from "./instagram-templates";
import { Carte, FONT_TITRE, FORMATS, type FormatCarte } from "./carte-marque";
import { typo } from "../typo";

// ───────────────────────────────────────────────────────────────────
// Cartes « piste A » (audit visuels s15, §4) : carrousel 4:5,
// slide 1 amorce sur fond sombre, slide 2 chute sur aplat #6D28D9.
// Syne 800/700 pour titres et chutes, Inter pour le reste, texte
// aligné à gauche, aucun texte sous 28 px.
// ───────────────────────────────────────────────────────────────────

type Page = { n: number; total: number };

/** Tailles de titre par format (Instagram = référence de l'audit). */
const TAILLES: Record<FormatCarte, { amorce: number; chute: number; titre: number; nombre: number }> = {
  instagram: { amorce: 64, chute: 84, titre: 72, nombre: 200 },
  x: { amorce: 60, chute: 76, titre: 72, nombre: 160 },
  linkedin: { amorce: 44, chute: 56, titre: 54, nombre: 120 },
};

/** Chasse moyenne d'un caractère Syne, en em (mesurée sur les rendus). */
const CHASSE_SYNE = { 700: 0.66, 800: 0.78 } as const;

/**
 * Corps maximal pour qu'aucun bloc insécable (mots collés par typo())
 * ne déborde de la zone de texte : Syne 800 est très large, satori ne
 * coupe pas les mots et ne réduit pas le corps tout seul.
 */
export function corpsSansDebordement(
  textes: string[],
  taille: number,
  poids: 700 | 800,
  largeur: number,
): number {
  const plusLong = Math.max(
    ...textes.flatMap((t) => typo(t).split(/[ \n]+/)).map((m) => m.length),
  );
  const max = Math.floor(largeur / (CHASSE_SYNE[poids] * plusLong));
  return Math.max(28, Math.min(taille, max));
}

/**
 * Bloc insécable rendu mot par mot : satori surestime la largeur d'un
 * nœud texte contenant une espace insécable (trou visible après le
 * bloc, constaté au rendu). Les insécables deviennent donc des marges :
 * espace normale avant « : » et dans « », espace fine avant ; ? !
 */
function BlocInsecable({ bloc, corps }: { bloc: string; corps: number }) {
  const parties = bloc.split(/([\u00A0\u202F])/);
  const mots: Array<{ mot: string; marge: number }> = [];
  for (let k = 0; k < parties.length; k += 2) {
    const sep = parties[k - 1];
    const marge = sep === undefined ? 0 : Math.round(corps * (sep === "\u202F" ? 0.12 : 0.24));
    if (parties[k]) mots.push({ mot: parties[k], marge });
  }
  return (
    <div style={{ display: "flex" }}>
      {mots.map(({ mot, marge }, k) => (
        <div key={k} style={{ display: "flex", marginLeft: marge }}>
          {mot}
        </div>
      ))}
    </div>
  );
}

/** Paragraphes en Syne, typographie française appliquée. */
function Bloc({
  textes,
  taille,
  format = "instagram",
  poids = 800,
  couleur = COLORS.textPrimary,
  gap = 40,
  citation = false,
}: {
  textes: string[];
  taille: number;
  format?: FormatCarte;
  /** Texte cité (ouvert par le grand « ) : un « » intérieur devient “ ”. */
  citation?: boolean;
  poids?: 700 | 800;
  couleur?: string;
  gap?: number;
}) {
  const largeur = FORMATS[format].width - 2 * FORMATS[format].padX;
  const corps = corpsSansDebordement(textes, taille, poids, largeur);
  // Chaque bloc insécable (mots collés par typo()) est un élément flex
  // distinct, espacement fixé ici à la chasse d'une espace Syne.
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {textes.map((t, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: Math.round(corps * 0.24),
            fontFamily: FONT_TITRE,
            fontWeight: poids,
            fontSize: corps,
            lineHeight: 1.15,
            color: couleur,
          }}
        >
          {(citation ? typo(`«${t}»`).slice(2, -2) : typo(t)).split(" ").map((bloc, j) => (
            <BlocInsecable key={j} bloc={bloc} corps={corps} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Grand guillemet « violet qui ouvre une amorce ou un extrait. */
function GrandGuillemet({ taille = 160, couleur = COLORS.accent }: { taille?: number; couleur?: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_TITRE,
        fontWeight: 800,
        fontSize: taille,
        lineHeight: 0.8,
        color: couleur,
        marginBottom: 24,
      }}
    >
      «
    </div>
  );
}

function Kicker({ texte, couleur = COLORS.accentHover }: { texte: string; couleur?: string }) {
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
      }}
    >
      {typo(texte)}
    </div>
  );
}

// ─── Vanne ───────────────────────────────────────────────────────

export function VanneAmorce({ amorce, page, indice }: { amorce: string; page?: Page; indice?: string }) {
  return (
    <Carte format="instagram" kind="vanne" page={page} indice={indice}>
      <GrandGuillemet />
      <Bloc textes={[amorce]} taille={TAILLES.instagram.amorce} poids={700} citation />
    </Carte>
  );
}

export function VanneChute({
  chute,
  format = "instagram",
  page,
}: {
  /** Un élément par temps de la chute (le second temps va à la ligne). */
  chute: string[];
  format?: FormatCarte;
  page?: Page;
}) {
  return (
    <Carte format={format} fond="aplat" page={page}>
      <Bloc textes={chute} taille={TAILLES[format].chute} format={format} gap={format === "linkedin" ? 24 : 48} />
    </Carte>
  );
}

// ─── Article ─────────────────────────────────────────────────────

export function ArticleCouverture({
  titre,
  nombre,
  format = "instagram",
  sansEtiquette = false,
  page,
  indice,
}: {
  titre: string;
  nombre?: number;
  format?: FormatCarte;
  sansEtiquette?: boolean;
  page?: Page;
  indice?: string;
}) {
  const t = TAILLES[format];
  return (
    <Carte format={format} kind={sansEtiquette ? undefined : "article"} page={page} indice={indice}>
      {nombre !== undefined && (
        <div
          style={{
            display: "flex",
            fontFamily: FONT_TITRE,
            fontWeight: 800,
            fontSize: t.nombre,
            lineHeight: 0.9,
            color: COLORS.accent,
            marginBottom: format === "linkedin" ? 12 : 32,
          }}
        >
          {String(nombre)}
        </div>
      )}
      <Bloc textes={[titre]} taille={t.titre} format={format} />
    </Carte>
  );
}

export function ArticleExtrait({
  amorce,
  chute,
  rang,
  total,
  page,
}: {
  amorce: string;
  chute?: string;
  rang: number;
  total: number;
  page?: Page;
}) {
  return (
    <Carte format="instagram" kind="article" page={page}>
      <Kicker texte={`Extrait : n° ${rang} sur ${total}`} />
      <GrandGuillemet taille={120} />
      <Bloc textes={[amorce]} taille={56} poids={700} citation />
      {chute && (
        <div style={{ display: "flex", marginTop: 40 }}>
          <Bloc textes={[chute]} taille={56} couleur={COLORS.accentHover} citation />
        </div>
      )}
    </Carte>
  );
}

export function ArticleFin({ texte, page }: { texte: string; page?: Page }) {
  return (
    <Carte format="instagram" fond="aplat" page={page}>
      <Bloc textes={[texte]} taille={72} />
      <div style={{ display: "flex", marginTop: 24 }}>
        <Bloc textes={["sur deviens-marrant.fr"]} taille={48} poids={700} />
      </div>
      <div style={{ display: "flex", marginTop: 56, fontSize: 40, fontWeight: 700 }}>Lien en bio</div>
    </Carte>
  );
}

// ─── Conseil ─────────────────────────────────────────────────────

export function ConseilSituation({
  titreConseil,
  situation,
  page,
  indice,
}: {
  titreConseil: string;
  situation: string;
  page?: Page;
  indice?: string;
}) {
  return (
    <Carte format="instagram" kind="conseil" page={page} indice={indice}>
      <Kicker texte={titreConseil} />
      <Bloc textes={[situation]} taille={TAILLES.instagram.amorce} poids={700} />
    </Carte>
  );
}

export function ConseilReplique({ replique, page }: { replique: string[]; page?: Page }) {
  return (
    <Carte format="instagram" fond="aplat" page={page}>
      <GrandGuillemet taille={120} couleur={COLORS.bg} />
      <Bloc textes={replique} taille={TAILLES.instagram.chute} gap={40} citation />
    </Carte>
  );
}
