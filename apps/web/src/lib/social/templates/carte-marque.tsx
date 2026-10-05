import type { ReactNode } from "react";
import { COLORS, BRAND } from "./instagram-templates";

// ───────────────────────────────────────────────────────────────────
// Cadre de marque des cartes « piste A » (audit visuels s15, §4-5)
//
// Formats : Instagram 4:5 (1080×1350), X 16:9 (1600×900),
// LinkedIn lien (1200×627). Fond sombre #0D0D0D ou aplat #6D28D9
// (slide chute / dernière slide). Pied de carte : monogramme « d »
// du favicon + deviens-marrant.fr + pagination. Plancher texte 28 px,
// zone de sécurité 96 px sur Instagram.
// ───────────────────────────────────────────────────────────────────

export const FORMATS = {
  instagram: { width: 1080, height: 1350, padX: 96, padY: 96 },
  x: { width: 1600, height: 900, padX: 112, padY: 80 },
  linkedin: { width: 1200, height: 627, padX: 80, padY: 56 },
} as const;

export type FormatCarte = keyof typeof FORMATS;
export type KindCarte = "vanne" | "article" | "conseil";
export type FondCarte = "sombre" | "aplat";

/** Familles de polices chargées par image-generator (Syne = titres). */
export const FONT_TITRE = "Syne";
export const FONT_TEXTE = "Inter";

/** Étiquette affichée selon le type de contenu (vanne : aucune). */
export const ETIQUETTES: Record<KindCarte, string | null> = {
  vanne: null,
  article: "Article",
  conseil: "Conseil",
};

export function Monogramme({ fond, taille = 56 }: { fond: FondCarte; taille?: number }) {
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
  /** Pagination « 1/2 » (carrousel Instagram uniquement). */
  page?: { n: number; total: number };
  /** Indice de swipe affiché en pied (« Glisse »). */
  indice?: string;
  children: ReactNode;
}

export function Carte({ format, fond = "sombre", kind, page, indice, children }: CarteProps) {
  const f = FORMATS[format];
  const etiquette = kind ? ETIQUETTES[kind] : null;
  const compact = format === "linkedin";
  const pied = compact ? 28 : 30;
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
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: fond === "aplat" ? COLORS.textPrimary : COLORS.accentHover,
          }}
        >
          {etiquette}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
        {children}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Monogramme fond={fond} taille={compact ? 48 : 56} />
          <div style={{ display: "flex", fontSize: pied, color: couleurPied }}>{BRAND}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: pied }}>
          {indice && (
            <div style={{ display: "flex", color: COLORS.textPrimary, fontWeight: 700 }}>
              {indice}
            </div>
          )}
          {page && (
            <div style={{ display: "flex", color: couleurPied }}>
              {`${page.n}/${page.total}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
