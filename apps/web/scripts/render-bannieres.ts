/**
 * Bannières des réseaux (s15, cycle 3) : en-tête X 1500×500, couverture de page LinkedIn
 * 1128×191, couvertures de stories à la une Instagram 1080×1920. Même moteur
 * (`next/og`, satori) et même identité que les cartes « piste A » : Plus Jakarta Sans
 * 800/700, noir #0D0D0D, aplat #6D28D9, lilas. Lignes calculées sur les largeurs
 * réelles des glyphes (mise-en-lignes.ts).
 *
 * Chaque PNG a sa version `-controle.png` (zones masquées par l'interface en surimpression)
 * et un `-apercu-mobile.png` : affichage simulé à taille réelle sur un écran de 390 px.
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-bannieres.ts
 * Sortie : docs/social/visuels-s15/bannieres/*.png. Aucune publication.
 */
import { createElement as h, type ReactElement, type ReactNode } from "react";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import { COLORS } from "../src/lib/social/templates/instagram-templates";
import { Monogramme, FONT_TITRE, FONT_TEXTE } from "../src/lib/social/templates/carte-marque";
import { COULEUR_GUILLEMETS, segmentsLigne, texteCite } from "../src/lib/social/templates/cartes-piste-a";
import { mettreEnLignes, affichage } from "../src/lib/social/mise-en-lignes";
import { enregistrerPolice, largeurTexte } from "../src/lib/social/mesure-texte";
import { typo, NNBSP } from "../src/lib/social/typo";

const OUT = join(process.cwd(), "..", "..", "docs", "social", "visuels-s15", "bannieres");

const POLICES = [
  { name: "Inter", weight: 400, file: "Inter-Regular.ttf" },
  { name: "Inter", weight: 700, file: "Inter-Bold.ttf" },
  { name: "Inter", weight: 800, file: "Inter-ExtraBold.ttf" },
  { name: "Plus Jakarta Sans", weight: 700, file: "PlusJakartaSans-Bold.ttf" },
  { name: "Plus Jakarta Sans", weight: 800, file: "PlusJakartaSans-ExtraBold.ttf" },
] as const;

const INTERLIGNE = 1.12;
const LILAS = COULEUR_GUILLEMETS.sombre; // #A78BFA sur noir

type Poids = 700 | 800;
type Fond = "sombre" | "aplat";

interface TexteOpts {
  texte: string;
  corps: number;
  largeur: number;
  poids?: Poids;
  couleur?: string;
  /** Passage du texte (après typo, espaces simples) affiché en couleur d'accent. */
  accent?: string;
  couleurAccent?: string;
  /** Ligne de vanne citée (R6) : « suspendu à gauche, » collé au dernier mot. */
  citation?: Fond;
}

/** Composition mesurée d'un bloc (lignes, corps, largeur de la plus longue ligne). */
export function composer(o: TexteOpts) {
  const poids = o.poids ?? 800;
  const src = o.citation ? texteCite(o.texte, true) : typo(o.texte);
  const { lignes, corps } = mettreEnLignes(src, { famille: FONT_TITRE, poids }, o.corps, o.largeur);
  const ouvrant = `«${affichage(NNBSP)}`;
  const suspendu = o.citation ? largeurTexte(ouvrant, FONT_TITRE, poids, corps) : 0;
  const plusLongue = Math.max(...lignes.map((l) => largeurTexte(l, FONT_TITRE, poids, corps)));
  return { lignes, corps, ouvrant, suspendu, plusLongue, hauteur: Math.round(lignes.length * corps * INTERLIGNE) };
}

/** Une ligne : segments (ponctuation rapprochée, espace élargie, trait d'union en Inter) par tronçon de teinte. */
function Ligne(texte: string, corps: number, teintes: Array<string | undefined>): ReactElement {
  const troncons: Array<{ texte: string; couleur?: string }> = [];
  [...texte].forEach((ch, i) => {
    const der = troncons[troncons.length - 1];
    if (der && der.couleur === teintes[i]) der.texte += ch;
    else troncons.push({ texte: ch, couleur: teintes[i] });
  });
  return h("div", { style: { display: "flex" } },
    ...troncons.flatMap((t, i) => segmentsLigne(t.texte).map((s, k) => h("div", {
      key: `${i}-${k}`,
      style: {
        display: "flex", whiteSpace: "pre",
        marginLeft: Math.round(s.avant * corps), marginRight: Math.round(s.apres * corps),
        ...(s.police ? { fontFamily: s.police } : {}),
        ...(t.couleur ? { color: t.couleur } : {}),
      },
    }, s.texte))));
}

/** Bloc de texte des cartes, lignes explicites (une ligne = un div sans retour automatique). */
function Texte(o: TexteOpts): ReactElement {
  const c = composer(o);
  const joint = c.lignes.join(" ");
  const teintes: Array<string | undefined> = new Array([...joint].length).fill(undefined);
  if (o.accent) {
    const i = joint.indexOf(o.accent);
    if (i < 0) throw new Error(`Accent « ${o.accent} » introuvable dans « ${joint} ».`);
    const d = [...joint.slice(0, i)].length;
    for (let k = 0; k < [...o.accent].length; k++) teintes[d + k] = o.couleurAccent ?? LILAS;
  }
  const lilas = o.citation ? COULEUR_GUILLEMETS[o.citation] : undefined;
  if (lilas && joint.endsWith("»")) teintes[teintes.length - 1] = lilas;
  let pos = 0;
  return h("div", {
    style: {
      display: "flex", flexDirection: "column", fontFamily: FONT_TITRE, fontWeight: o.poids ?? 800,
      fontSize: c.corps, lineHeight: INTERLIGNE, color: o.couleur ?? COLORS.textPrimary,
    },
  }, ...c.lignes.map((l, j) => {
    const t = teintes.slice(pos, pos + [...l].length);
    pos += [...l].length + 1;
    const ligne = Ligne(l, c.corps, t);
    if (!(lilas && j === 0)) return h("div", { key: j, style: { display: "flex" } }, ligne);
    return h("div", { key: j, style: { display: "flex", marginLeft: -Math.round(c.suspendu) } },
      h("div", { style: { display: "flex", whiteSpace: "pre", color: lilas } }, c.ouvrant), ligne);
  }));
}

/** Position absolue (raccourci). */
function abs(style: Record<string, number | string>, ...enfants: ReactNode[]): ReactElement {
  return h("div", { style: { position: "absolute", display: "flex", ...style } }, ...enfants);
}

/** Zone masquée de la version de contrôle : hachure rouge translucide, bord pointillé, libellé. */
function Zone({ x, y, w, hh, libelle, couleur = "rgba(239,68,68,0.45)", corps = 22 }: {
  x: number; y: number; w: number; hh: number; libelle: string; couleur?: string; corps?: number;
}): ReactElement {
  return abs({ left: x, top: y, width: w, height: hh, backgroundColor: couleur, border: "3px dashed #FFFFFF",
    alignItems: "center", justifyContent: "center", fontFamily: FONT_TEXTE, fontWeight: 700, fontSize: corps, color: "#FFFFFF" },
  libelle);
}

// ─── Textes (bios validées, pool strict) ────────────────────────
const MESSAGE_X = "Une vanne par jour pour devenir plus drôle.";
/** Ligne d'appel @growth (cycle 1) : nomme le quiz, sans URL ni flèche. */
const APPEL_X = "Quiz d'humour, sans inscription.";
const GRIS_APPEL = "#D4D4D4";
const LILAS_TRES_CLAIR = "#EDE9FE"; // sous-titre LinkedIn sur l'aplat (6:1)

// ─── Zones masquées [HYPOTHÈSE : relevés approximatifs des interfaces, octobre 2026] ──
const X = { w: 1500, h: 500, avatar: { x: 0, y: 300, w: 400, hh: 200 }, recadrage: 70 };
const LI = { w: 1128, h: 191, logo: { x: 0, y: 90, w: 260, hh: 101 }, gauche: 348, haut: 35 };
/**
 * Recadrage mobile LinkedIn sur les 900 px centraux (source unique) : zone vue x 114 à 1014,
 * échelle 390/900. Logo de 72 pt (80 au pire) à 16 pt du bord = x 151 à 317 (335) en source.
 */
const LI_RECADRAGE = { x0: 114, x1: 1014, logoFin80: 335 };
/** Zone vue dans le cercle de la story à la une : diamètre 720 (rayon 360), centre (540, 960). */
const IG = { w: 1080, h: 1920, diametre: 720, cx: 540, cy: 960 };

interface Banniere { fichier: string; w: number; h: number; element: ReactElement; zones: ReactElement[]; controles: string[] }

function racine(w: number, hh: number, fond: string, ...enfants: ReactNode[]): ReactElement {
  return h("div", { style: { display: "flex", position: "relative", width: w, height: hh, backgroundColor: fond, overflow: "hidden" } }, ...enfants);
}

function zonesX(): ReactElement[] {
  const a = X.avatar;
  return [
    h(Zone, { key: "haut", x: 0, y: 0, w: X.w, hh: X.recadrage, libelle: "Recadrage mobile (haut)", couleur: "rgba(249,115,22,0.45)" }),
    h(Zone, { key: "bas", x: a.w, y: X.h - X.recadrage, w: X.w - a.w, hh: X.recadrage, libelle: "Recadrage mobile (bas)", couleur: "rgba(249,115,22,0.45)" }),
    h(Zone, { key: "avatar", x: a.x, y: a.y, w: a.w, hh: a.hh, libelle: "Photo de profil" }),
  ];
}

/**
 * X : le message sur noir, « plus drôle. » en lilas, bloc remonté à top 75 (@design) ;
 * en pied, une seule ligne d'appel alignée à droite (@growth) : Inter 56 px (cycle 3, 14,6 pt
 * sur mobile), #D4D4D4, fin x 1388, ligne de base y 392, hors photo (x 0 à 400) et hors recadrage (y > 430).
 */
const APPEL = { corps: 56, fin: 1388, base: 392 };
/** Position de la ligne de base dans une boîte Inter à interligne 1 (mesurée sur le rendu cycle 2 : 42,5 / 52). */
const BASE_INTER = 0.817;

function xMessage(): Banniere {
  const t = { texte: MESSAGE_X, corps: 84, largeur: X.w - 224, accent: "plus drôle." };
  const c = composer(t);
  const haut = 75;
  const appel = typo(APPEL_X);
  const lAppel = Math.round(largeurTexte(appel, FONT_TEXTE, 400, APPEL.corps));
  const hautAppel = APPEL.base - Math.round(BASE_INTER * APPEL.corps);
  return {
    fichier: "x-entete", w: X.w, h: X.h, zones: zonesX(),
    controles: [
      `message ${c.lignes.length} lignes à ${c.corps} px, boîte y ${haut} à ${haut + c.hauteur}, x 112 à ${112 + Math.round(c.plusLongue)}`,
      `appel Inter ${APPEL.corps} px, x ${APPEL.fin - lAppel} à ${APPEL.fin}, boîte y ${hautAppel} à ${hautAppel + APPEL.corps}, base visée ${APPEL.base} (photo jusqu'à x ${X.avatar.w}, recadrage à y ${X.h - X.recadrage})`,
    ],
    element: racine(X.w, X.h, COLORS.bg,
      abs({ left: 112, top: haut }, Texte(t)),
      abs({ left: APPEL.fin - lAppel - 20, top: hautAppel, width: lAppel + 20, height: APPEL.corps, justifyContent: "flex-end",
        fontFamily: FONT_TEXTE, fontWeight: 400, fontSize: APPEL.corps, lineHeight: 1, color: GRIS_APPEL, whiteSpace: "pre" }, appel)),
  };
}

// ─── LinkedIn, couverture de page 1128×191 ──────────────────────
function zonesLI(): ReactElement[] {
  const l = LI.logo;
  const r = LI_RECADRAGE;
  const orange = "rgba(249,115,22,0.45)";
  return [
    h(Zone, { key: "rg", x: 0, y: 0, w: r.x0, hh: LI.h, libelle: "Recadré", couleur: orange, corps: 16 }),
    h(Zone, { key: "rd", x: r.x1, y: 0, w: LI.w - r.x1, hh: LI.h, libelle: "Recadré", couleur: orange, corps: 16 }),
    h(Zone, { key: "logo", x: l.x, y: l.y, w: l.w, hh: l.hh, libelle: "Logo", corps: 16 }),
    h(Zone, { key: "logo900", x: r.x0 + 37, y: l.y, w: r.logoFin80 - r.x0 - 37, hh: l.hh, libelle: "Logo 900",
      couleur: "rgba(239,68,68,0.3)", corps: 16 }),
  ];
}

/**
 * LinkedIn (cycle 3) : aplat violet, titre 48 px blanc, sous-titre impératif 38 px #EDE9FE, ni pied ni URL.
 * Bloc à x 348 (13 px après le logo agrandi par le recadrage 900 px), top 35 (monté de 6 px).
 */
function liAplat(): Banniere {
  const largeur = LI_RECADRAGE.x1 - LI.gauche;
  const t1 = { texte: "Des vannes pour le bureau.", corps: 48, largeur };
  const t2 = { texte: "Fais le quiz de ton profil d'humour.", corps: 38, largeur, poids: 700 as const, couleur: LILAS_TRES_CLAIR };
  const c1 = composer(t1);
  const c2 = composer(t2);
  if (c1.lignes.length !== 1 || c2.lignes.length !== 1 || c1.corps !== 48 || c2.corps !== 38) {
    throw new Error(`LinkedIn : titre ${c1.lignes.length}×${c1.corps} px, sous-titre ${c2.lignes.length}×${c2.corps} px (attendu 1×48 et 1×38).`);
  }
  const fin = LI.gauche + Math.round(Math.max(c1.plusLongue, c2.plusLongue));
  if (fin >= LI_RECADRAGE.x1) throw new Error(`LinkedIn : texte fini à x ${fin}, limite ${LI_RECADRAGE.x1}.`);
  const hb = c1.hauteur + 8 + c2.hauteur;
  const haut = LI.haut;
  return {
    fichier: "linkedin-couverture", w: LI.w, h: LI.h, zones: zonesLI(),
    controles: [
      `titre ${c1.corps} px x ${LI.gauche} à ${LI.gauche + Math.round(c1.plusLongue)}, sous-titre ${c2.corps} px x ${LI.gauche} à ${LI.gauche + Math.round(c2.plusLongue)} (limite ${LI_RECADRAGE.x1})`,
      `bloc y ${haut} à ${haut + hb} (logo pleine largeur jusqu'à x ${LI.logo.w}, recadré jusqu'à x ${LI_RECADRAGE.logoFin80}, y ${LI.logo.y})`,
    ],
    element: racine(LI.w, LI.h, COLORS.accentSecondary,
      abs({ left: LI.gauche, top: haut, flexDirection: "column", gap: 8 }, Texte(t1), Texte(t2))),
  };
}

// ─── Instagram, couvertures de stories à la une 1080×1920 ───────
/**
 * Pictogramme : boîte 520 px (viewBox 24), trait blanc 2,8/24 = 61 px identique pour les 4, aucun libellé.
 * Répartie (cycle 3) : boîte 420 px, trait 3,5/24 = 61 px (même épaisseur à l'écran), rayon max ≤ 270.
 */
const PICTO = 520;
const TAILLES: Record<string, { boite: number; trait: number }> = {
  quiz: { boite: PICTO, trait: 2.8 }, vannes: { boite: PICTO, trait: 2.8 },
  conseils: { boite: PICTO, trait: 2.8 }, repartie: { boite: 420, trait: 3.5 },
};
const TRAIT = { fill: "none", stroke: "#FFFFFF", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function svg(cle: string, ...enfants: ReactElement[]): ReactElement {
  const t = TAILLES[cle];
  return h("svg", { width: t.boite, height: t.boite, viewBox: "0 0 24 24", ...TRAIT, strokeWidth: t.trait }, ...enfants);
}

const PICTOS: Record<string, () => ReactElement> = {
  // Point d'interrogation dans un cercle.
  quiz: () => svg("quiz",
    h("circle", { cx: 12, cy: 12, r: 10 }),
    h("path", { d: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" }), h("path", { d: "M12 17h.01" })),
  // Micro de scène sur pied. Cycle 3 : tige en bout droit partant de y 18,92 (= y 1110 px, axe de l'arc),
  // noyée dans l'arc et le pied ; un bout rond dépasserait de 2 px dans le creux de l'arc.
  vannes: () => svg("vannes",
    h("rect", { x: 9, y: 2, width: 6, height: 13, rx: 3 }),
    h("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }), h("path", { d: "M12 18.92V22", strokeLinecap: "butt" }), h("path", { d: "M8 22h8" })),
  // Ampoule.
  conseils: () => svg("conseils",
    h("path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }),
    h("path", { d: "M9 18h6" }), h("path", { d: "M10 22h4" })),
  // Deux bulles de dialogue (échange de répliques). Cycle 3 : la 2e bulle s'arrête à 4,8 unités
  // (axe) de la 1re, soit 4,8 × 17,5 − 61 ≈ 23 px de jeu entre les traits ; plus de soudure.
  repartie: () => svg("repartie",
    h("path", { d: "M5 2.5h6.5a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H6l-4 4v-10a3 3 0 0 1 3-3z" }),
    h("path", { d: "M19.3 8a2.2 2.2 0 0 1 2.2 2.2v11.3l-3.5-2.5h-5.5a2.5 2.5 0 0 1-2.5-2.5v-.2" })),
};

/** Ordre des stories à la une (arbitrage s15) : Quiz, Vannes, Conseils, Répartie. */
const ALAUNE = [
  { cle: "quiz", nom: "Quiz" }, { cle: "vannes", nom: "Vannes" },
  { cle: "conseils", nom: "Conseils" }, { cle: "repartie", nom: "Répartie" },
] as const;

function zonesIG(boite: number): ReactElement[] {
  const b = 1300;
  const r = IG.diametre / 2;
  return [
    abs({ key: "anneau", left: IG.cx - r - b, top: IG.cy - r - b, width: IG.diametre + 2 * b, height: IG.diametre + 2 * b,
      borderRadius: r + b, border: `${b}px solid rgba(239,68,68,0.45)` }),
    abs({ key: "cercle", left: IG.cx - r, top: IG.cy - r, width: IG.diametre, height: IG.diametre, borderRadius: r, border: "4px dashed #FFFFFF" }),
    abs({ key: "boite", left: IG.cx - boite / 2, top: IG.cy - boite / 2, width: boite, height: boite, border: "2px dashed rgba(255,255,255,0.6)" }),
    abs({ key: "lib", left: 0, top: 380, width: IG.w, justifyContent: "center", fontFamily: FONT_TEXTE, fontWeight: 700, fontSize: 40, color: "#FFFFFF" },
      "Hors du cercle vu (rayon 360 px)"),
  ];
}

function alaUne(cle: string): Banniere {
  const { boite, trait } = TAILLES[cle];
  return {
    fichier: `instagram-alaune-${cle}`, w: IG.w, h: IG.h, zones: zonesIG(boite),
    controles: [`pictogramme ${boite} px, centre (${IG.cx}, ${IG.cy}), trait ${trait}/24 = ${Math.round(trait * boite / 24)} px, sans libellé`],
    element: racine(IG.w, IG.h, COLORS.accentSecondary,
      abs({ left: IG.cx - boite / 2, top: IG.cy - boite / 2, width: boite, height: boite }, PICTOS[cle]())),
  };
}

// ─── Aperçus mobiles, taille réelle (écran de 390 px, 1 px = 1 pt) ──
const TEL = 390;
const versDonnees = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;

function image(png: Buffer, w: number, hh: number, left = 0, top = 0): ReactElement {
  return h("img", { src: versDonnees(png), width: w, height: hh, style: { position: "absolute", left, top } });
}

function barre(left: number, top: number, w: number, hh = 10): ReactElement {
  return abs({ left, top, width: w, height: hh, borderRadius: hh / 2, backgroundColor: "#E5E5E5" });
}

/** Photo de profil simulée par le monogramme (cercle ou carré arrondi), bord blanc. */
function photo(cote: number, bord: number, rayon: number, left: number, top: number): ReactElement {
  return abs({ left, top, width: cote, height: cote, borderRadius: rayon, border: `${bord}px solid #FFFFFF`, backgroundColor: COLORS.bg,
    overflow: "hidden", alignItems: "center", justifyContent: "center" }, h(Monogramme, { fond: "aplat", taille: cote - 2 * bord }));
}

/** X : bannière 390×130, photo ronde de 84 px (bord 4) à x 16, y 78 = zone retenue x 0 à 400, y 300 à 500. */
function apercuX(png: Buffer) {
  const hb = Math.round(X.h * TEL / X.w);
  return { w: TEL, h: 240, element: racine(TEL, 240, "#FFFFFF",
    image(png, TEL, hb), photo(84, 4, 42, 16, 78),
    abs({ right: 16, top: hb + 12, width: 78, height: 32, borderRadius: 16, backgroundColor: "#0F1419", alignItems: "center", justifyContent: "center",
      fontFamily: FONT_TEXTE, fontWeight: 700, fontSize: 14, color: "#FFFFFF" }, "Suivre"),
    barre(16, 174, 110, 14), barre(16, 196, 80), barre(16, 218, 300)) };
}

/** Libellé gris d'une simulation dans un aperçu. */
function legende(top: number, texte: string): ReactElement {
  return abs({ left: 16, top, fontFamily: FONT_TEXTE, fontWeight: 700, fontSize: 12, color: "#737373" }, texte);
}

/**
 * LinkedIn, deux simulations empilées, logo carré de 72 pt (bord 2) à x 16 :
 * 1. pleine largeur : couverture 390×66 (échelle 0,346), logo à y 31 = zone x 0 à 260, y 90 à 191 ;
 * 2. recadrage central 900 px : x 114 à 1014 affichés sur 390 (échelle 0,433), couverture 390×83,
 *    logo par-dessus à y 39 (= y 90 en source), soit x 151 à 317 en source.
 */
function apercuLI(png: Buffer) {
  const r = LI_RECADRAGE;
  const hb = Math.round(LI.h * TEL / LI.w);
  const s = TEL / (r.x1 - r.x0);
  const hr = Math.round(LI.h * s);
  const y2 = 222;
  const hauteur = y2 + hr + 104;
  return { w: TEL, h: hauteur, element: racine(TEL, hauteur, "#FFFFFF",
    legende(4, "Pleine largeur"),
    abs({ left: 0, top: 22, width: TEL, height: 176 },
      image(png, TEL, hb), photo(72, 2, 6, 16, 31),
      barre(16, 114, 140, 14), barre(16, 136, 220), barre(16, 154, 180)),
    legende(y2 - 18, "Recadrage central 900 px (x 114 à 1014)"),
    abs({ left: 0, top: y2, width: TEL, height: hr, overflow: "hidden" },
      image(png, Math.round(LI.w * s), hr, -Math.round(r.x0 * s), 0)),
    photo(72, 2, 6, 16, y2 + Math.round(LI.logo.y * s)),
    barre(16, y2 + hr + 48, 140, 14), barre(16, y2 + hr + 70, 220), barre(16, y2 + hr + 88, 180)) };
}

/** Instagram : 4 cercles de 64 px (zone vue de 720 px), anneau gris, nom en dessous en 12 px. */
function apercuIG(pngs: Buffer[]) {
  const d = 64;
  const s = d / IG.diametre;
  const pas = 88;
  return { w: TEL, h: 120, element: racine(TEL, 120, "#FFFFFF",
    ...ALAUNE.map((a, i) => abs({ left: 16 + i * pas, top: 14, width: 72, flexDirection: "column", alignItems: "center" },
      h("div", { style: { display: "flex", width: 72, height: 72, borderRadius: 36, border: "1px solid #DBDBDB", alignItems: "center", justifyContent: "center" } },
        h("div", { style: { display: "flex", position: "relative", width: d, height: d, borderRadius: d / 2, overflow: "hidden" } },
          image(pngs[i], Math.round(IG.w * s), Math.round(IG.h * s), -Math.round((IG.cx - IG.diametre / 2) * s), -Math.round((IG.cy - IG.diametre / 2) * s)))),
      h("div", { style: { display: "flex", marginTop: 6, fontFamily: FONT_TEXTE, fontWeight: 400, fontSize: 12, color: "#262626" } }, a.nom)))) };
}

// ─── Rendu ──────────────────────────────────────────────────────
async function main() {
  const fonts = await Promise.all(POLICES.map(async (p) => {
    const b = await readFile(join(process.cwd(), "public", "fonts", p.file));
    const data = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
    enregistrerPolice(p.name, p.weight, data);
    return { name: p.name, weight: p.weight, style: "normal" as const, data };
  }));
  await mkdir(OUT, { recursive: true });
  const rendre = async (el: ReactElement, w: number, hh: number, nom: string) => {
    const png = Buffer.from(await new ImageResponse(el, { width: w, height: hh, fonts }).arrayBuffer());
    await writeFile(join(OUT, `${nom}.png`), png);
    return png;
  };
  const sortie = async (b: Banniere) => {
    const png = await rendre(b.element, b.w, b.h, b.fichier);
    const controle = h("div", { style: { display: "flex", position: "relative", width: b.w, height: b.h } }, b.element, ...b.zones);
    await rendre(controle, b.w, b.h, `${b.fichier}-controle`);
    console.log(`${b.fichier} (${b.w}x${b.h}) : ${b.controles.join(" ; ")}`);
    return png;
  };
  const x = xMessage();
  const ax = apercuX(await sortie(x));
  await rendre(ax.element, ax.w, ax.h, `${x.fichier}-apercu-mobile`);
  const li = liAplat();
  const al = apercuLI(await sortie(li));
  await rendre(al.element, al.w, al.h, `${li.fichier}-apercu-mobile`);
  const couvertures: Buffer[] = [];
  for (const a of ALAUNE) couvertures.push(await sortie(alaUne(a.cle)));
  const ai = apercuIG(couvertures);
  await rendre(ai.element, ai.w, ai.h, "instagram-alaune-apercu-mobile");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

