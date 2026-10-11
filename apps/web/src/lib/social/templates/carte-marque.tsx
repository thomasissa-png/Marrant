import type { ReactNode } from "react";
import { COLORS, BRAND } from "./instagram-templates";

// ───────────────────────────────────────────────────────────────────
// Cadre de marque des cartes « piste A » (audit visuels s15, §4-5)
//
// Formats : Instagram 4:5 (1080×1350), X 16:9 (1600×900),
// LinkedIn lien (1200×627), Open Graph (1200×630, CarteOg). Fond sombre #0D0D0D ou aplat #6D28D9
// (slide chute / dernière slide). Pied de carte : monogramme « d »
// du favicon + deviens-marrant.fr (+ « Glisse → » en slide 1).
// Plancher texte 28 px, pied 32 px, zone de sécurité 96 px (Instagram).
// ───────────────────────────────────────────────────────────────────

export const FORMATS = {
  instagram: { width: 1080, height: 1350, padX: 96, padY: 96 },
  x: { width: 1600, height: 900, padX: 112, padY: 80 },
  linkedin: { width: 1200, height: 627, padX: 80, padY: 56 },
  /** Open Graph (accueil, quiz, articles, vannes) : spec @design cycle 8 §1.5. */
  og: { width: 1200, height: 630, padX: 80, padY: 56 },
} as const;

export type FormatCarte = keyof typeof FORMATS;
export type KindCarte = "vanne" | "article" | "conseil";
export type FondCarte = "sombre" | "aplat";

/** Familles chargées par image-generator : Plus Jakarta Sans = titres (comme le site). */
export const FONT_TITRE = "Plus Jakarta Sans";
export const FONT_TEXTE = "Inter";

/** Pied et étiquettes : jamais sous 32 px (notation cycle 2, V2). */
export const TAILLE_PIED: Record<FormatCarte, number> = { instagram: 32, x: 40, linkedin: 32, og: 40 };
export const TAILLE_MONOGRAMME: Record<FormatCarte, number> = { instagram: 72, x: 72, linkedin: 56, og: 64 };
/** Écart texte/pied de la position « debut » (= ECART_TITRE_PIED des cartes piste A). */
export const ECART_PIED_DEBUT = 64;

/** Étiquette affichée selon le type de contenu (vanne : aucune). */
export const ETIQUETTES: Record<KindCarte, string | null> = {
  vanne: null,
  article: "Article",
  conseil: "Conseil",
};

export function Monogramme({ fond, taille = 72 }: { fond: FondCarte; taille?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: taille,
        height: taille,
        borderRadius: Math.round(taille * 0.1875),
        backgroundColor: fond === "aplat" ? COLORS.bg : COLORS.bgCard,
        color: COLORS.accent,
        fontFamily: FONT_TEXTE,
        fontWeight: 800,
        fontSize: Math.round(taille * 0.72),
        lineHeight: 1,
        paddingBottom: Math.round(taille * 0.08),
      }}
    >
      d
    </div>
  );
}

export interface CarteProps {
  format: FormatCarte;
  fond?: FondCarte;
  kind?: KindCarte;
  /** Indice de swipe affiché en pied (« Glisse → », slides 1 seulement). */
  indice?: string;
  /**
   * « haut » : bloc centré à 40 % de la hauteur (slide 1, arrêt du défilement).
   * « debut » (gabarit conseil) : bloc ancré en haut, 64 px réservés au-dessus du pied.
   */
  position?: "centre" | "haut" | "debut";
  children: ReactNode;
}

/**
 * Cadre commun. Pas de pagination « n/N » : Instagram affiche déjà son
 * compteur (notation cycle 2, point 8).
 */
export function Carte({ format, fond = "sombre", kind, indice, position = "centre", children }: CarteProps) {
  const f = FORMATS[format];
  const etiquette = kind ? ETIQUETTES[kind] : null;
  const pied = TAILLE_PIED[format];
  const couleurPied = fond === "aplat" ? COLORS.textPrimary : COLORS.textSecondary;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: f.width,
        height: f.height,
        backgroundColor: fond === "aplat" ? COLORS.accentSecondary : COLORS.bg,
        padding: `${f.padY}px ${f.padX}px`,
        fontFamily: FONT_TEXTE,
        color: COLORS.textPrimary,
      }}
    >
      {etiquette && (
        <div
          style={{
            display: "flex",
            fontSize: pied,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: fond === "aplat" ? COLORS.textPrimary : COLORS.accentHover,
          }}
        >
          {etiquette}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: position === "debut" ? "flex-start" : "center",
          // Centre du bloc remonté de 50 % à 40 % de la hauteur (notation cycle 3, V1).
          // « debut » : jamais d'overflow hidden, un texte trop long fait échouer le rendu en amont.
          paddingBottom: position === "haut" ? Math.round(f.height * 0.2) : position === "debut" ? ECART_PIED_DEBUT : 0,
        }}
      >
        {children}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Monogramme fond={fond} taille={TAILLE_MONOGRAMME[format]} />
          <div style={{ display: "flex", fontSize: pied, color: couleurPied }}>{BRAND}</div>
        </div>
        {indice && (
          <div style={{ display: "flex", fontSize: pied, color: COLORS.textPrimary, fontWeight: 700 }}>
            {indice}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Cadre des images Open Graph (spec @design cycle 8 §1.5) : même structure
 * que Carte (étiquette, bloc centré, pied), fond #0D0D0D uni, un seul écart
 * assumé : le pied (monogramme + domaine) est à DROITE, pour ne jamais
 * croiser le domaine que X incruste en bas à gauche de la carte.
 */
export function CarteOg({ etiquette, children }: { etiquette?: string; children: ReactNode }) {
  const f = FORMATS.og;
  const pied = TAILLE_PIED.og;
  const monogramme = TAILLE_MONOGRAMME.og;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: f.width,
        height: f.height,
        backgroundColor: COLORS.bg,
        padding: `${f.padY}px ${f.padX}px`,
        fontFamily: FONT_TEXTE,
        color: COLORS.textPrimary,
      }}
    >
      {etiquette && (
        <div
          style={{
            display: "flex",
            fontSize: pied,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: COLORS.accentHover,
          }}
        >
          {etiquette}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>{children}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 20, height: monogramme }}>
        <Monogramme fond="sombre" taille={monogramme} />
        <div style={{ display: "flex", fontSize: pied, fontWeight: 400, color: COLORS.textSecondary }}>{BRAND}</div>
      </div>
    </div>
  );
}
