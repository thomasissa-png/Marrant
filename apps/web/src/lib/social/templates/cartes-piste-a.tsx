import { COLORS } from "./instagram-templates";
import { Carte, FONT_TITRE, FORMATS, type FormatCarte } from "./carte-marque";
import { typo } from "../typo";
import { mettreEnLignes } from "../mise-en-lignes";

// ───────────────────────────────────────────────────────────────────
// Cartes « piste A », v3 (notations cycle 2 @design et @reviewer)
//
// Plus Jakarta Sans 800/700 (police de titre du site), lignes calculées
// sur les largeurs réelles des glyphes (mise-en-lignes.ts) : plus de
// trou d'espace ni de mot seul. Une slide = un temps : jamais amorce et
// chute sur la même slide d'un carrousel. Le chevron « ne marque que la
// réplique à dire (conseil). Aucun texte sous 28 px, pied 32 px.
// ───────────────────────────────────────────────────────────────────

/** Tailles par format (Instagram = référence, notation @design point 4). */
export const TAILLES: Record<FormatCarte, { amorce: number; chute: number; titre: number; nombre: number }> = {
  instagram: { amorce: 80, chute: 100, titre: 76, nombre: 220 },
  x: { amorce: 72, chute: 88, titre: 76, nombre: 180 },
  linkedin: { amorce: 44, chute: 60, titre: 52, nombre: 120 },
};

type Poids = 700 | 800;

/** Largeur utile d'un format (hors marges de sécurité). */
export function largeurUtile(format: FormatCarte): number {
  return FORMATS[format].width - 2 * FORMATS[format].padX;
}

/** Corps commun et lignes de chaque paragraphe (même corps pour tout le bloc). */
export function composerBloc(textes: string[], taille: number, poids: Poids, largeur: number) {
  const police = { famille: FONT_TITRE, poids };
  const corps = Math.min(...textes.map((t) => mettreEnLignes(typo(t), police, taille, largeur).corps));
  return { corps, paragraphes: textes.map((t) => mettreEnLignes(typo(t), police, corps, largeur).lignes) };
}

/**
 * Approche optique de la ponctuation basse et de l'apostrophe : Plus
 * Jakarta Sans leur donne de larges approches (point : 0,13 em de chaque
 * côté) et satori n'applique pas le crénage GPOS, d'où un « trou » visible
 * après « TGV, » ou avant le point final. Valeurs en em.
 */
export const APPROCHE: Record<string, { avant: number; apres: number }> = {
  ".": { avant: -0.07, apres: -0.05 },
  ",": { avant: -0.06, apres: -0.06 },
  "…": { avant: -0.05, apres: -0.03 },
  "’": { avant: -0.05, apres: -0.05 },
};

/** Découpe une ligne en segments : texte courant et ponctuation à rapprocher. */
export function segmentsLigne(ligne: string): Array<{ texte: string; avant: number; apres: number }> {
  return ligne
    .split(/([.,…’])/)
    .filter(Boolean)
    .map((t) => ({ texte: t, avant: APPROCHE[t]?.avant ?? 0, apres: APPROCHE[t]?.apres ?? 0 }));
}

function Ligne({ texte, corps }: { texte: string; corps: number }) {
  return (
    <div style={{ display: "flex" }}>
      {segmentsLigne(texte).map((s, k) => (
        <div
          key={k}
          style={{
            display: "flex",
            whiteSpace: "pre",
            marginLeft: Math.round(s.avant * corps),
            marginRight: Math.round(s.apres * corps),
          }}
        >
          {s.texte}
        </div>
      ))}
    </div>
  );
}

/** Paragraphes : une ligne = un div sans retour automatique. */
function Bloc({
  textes,
  taille,
  format = "instagram",
  poids = 800,
  couleur = COLORS.textPrimary,
  gap = 40,
}: {
  textes: string[];
  taille: number;
  format?: FormatCarte;
  poids?: Poids;
  couleur?: string;
  gap?: number;
}) {
  const { corps, paragraphes } = composerBloc(textes, taille, poids, largeurUtile(format));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {paragraphes.map((lignes, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: FONT_TITRE,
            fontWeight: poids,
            fontSize: corps,
            lineHeight: 1.12,
            color: couleur,
          }}
        >
          {lignes.map((l, j) => (
            <Ligne key={j} texte={l} corps={corps} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Grand chevron « : marque la réplique à dire (règle unique). */
function GrandGuillemet({ taille = 140, couleur = COLORS.bg }: { taille?: number; couleur?: string }) {
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

/** Surtitre (« Vanne n° 2 sur 8 », titre du conseil). */
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
      {typo(texte).replace(/ /g, " ").replace(/ /g, " ")}
    </div>
  );
}

/** Bouton d'appel à l'action (« Lien en bio ») : blanc, texte violet, rayon lg. */
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

// ─── Vanne ───────────────────────────────────────────────────────

export function VanneAmorce({ amorce, indice }: { amorce: string; indice?: string }) {
  return (
    <Carte format="instagram" kind="vanne" indice={indice} position="haut">
      <Bloc textes={[amorce]} taille={TAILLES.instagram.amorce} />
    </Carte>
  );
}

export function VanneChute({ chute, format = "instagram" }: { chute: string[]; format?: FormatCarte }) {
  return (
    <Carte format={format} fond="aplat">
      <Bloc textes={chute} taille={TAILLES[format].chute} format={format} gap={format === "linkedin" ? 20 : 48} />
    </Carte>
  );
}

/** Repli LinkedIn (amorce > 140 caractères) : amorce et chute sur une carte. */
export function VanneComplete({ amorce, chute, format }: { amorce: string; chute: string[]; format: FormatCarte }) {
  const t = TAILLES[format];
  return (
    <Carte format={format}>
      <Bloc textes={[amorce]} taille={t.amorce} format={format} poids={700} />
      <div style={{ display: "flex", marginTop: format === "linkedin" ? 20 : 40 }}>
        <Bloc textes={chute} taille={t.amorce} format={format} couleur={COLORS.accentHover} gap={12} />
      </div>
    </Carte>
  );
}

// ─── Article ─────────────────────────────────────────────────────

export function ArticleCouverture({
  titre,
  nombre,
  format = "instagram",
  sansEtiquette = false,
  indice,
}: {
  titre: string;
  nombre?: number;
  format?: FormatCarte;
  sansEtiquette?: boolean;
  indice?: string;
}) {
  const t = TAILLES[format];
  return (
    <Carte format={format} kind={sansEtiquette ? undefined : "article"} indice={indice}>
      {nombre !== undefined && (
        <div
          style={{
            display: "flex",
            fontFamily: FONT_TITRE,
            fontWeight: 800,
            fontSize: t.nombre,
            lineHeight: 1,
            letterSpacing: -4,
            color: COLORS.accent,
            marginBottom: Math.round(t.titre * 0.4),
          }}
        >
          {String(nombre)}
        </div>
      )}
      <Bloc textes={[titre]} taille={t.titre} format={format} />
    </Carte>
  );
}

/** Extrait, temps 1 : l'amorce seule, surtitre « Vanne n° 2 sur 8 ». */
export function ArticleExtraitAmorce({ amorce, surtitre }: { amorce: string; surtitre: string }) {
  return (
    <Carte format="instagram" kind="article">
      <Surtitre texte={surtitre} />
      <Bloc textes={[amorce]} taille={TAILLES.instagram.amorce} />
    </Carte>
  );
}

/** Dernière slide : « Les N autres … » + bouton (lien en bio ou en commentaire). */
export function CarteFin({ texte, cta }: { texte: string; cta: string }) {
  return (
    <Carte format="instagram" fond="aplat">
      <Bloc textes={[texte]} taille={88} />
      <Bouton texte={cta} />
    </Carte>
  );
}

// ─── Conseil ─────────────────────────────────────────────────────

export function ConseilSituation({
  titreConseil,
  situation,
  indice,
}: {
  titreConseil: string;
  situation: string;
  indice?: string;
}) {
  return (
    <Carte format="instagram" kind="conseil" indice={indice} position="haut">
      <Surtitre texte={titreConseil} />
      <Bloc textes={[situation]} taille={TAILLES.instagram.amorce} />
    </Carte>
  );
}

export function ConseilReplique({ replique }: { replique: string[] }) {
  return (
    <Carte format="instagram" fond="aplat">
      <GrandGuillemet />
      <Bloc textes={replique} taille={TAILLES.instagram.chute} gap={40} />
    </Carte>
  );
}

/** Principe en une phrase (tiré du conseil) + appel à l'action : fin du carrousel. */
export function ConseilPrincipe({ surtitre, principe, cta }: { surtitre: string; principe: string; cta: string }) {
  return (
    <Carte format="instagram" kind="conseil">
      <Surtitre texte={surtitre} />
      <Bloc textes={[principe]} taille={64} />
      <Bouton texte={cta} />
    </Carte>
  );
}
