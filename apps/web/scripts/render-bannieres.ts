/**
 * Bannières des réseaux (s15, cycle 2) : en-tête X 1500×500, couverture de page LinkedIn
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
const LI = { w: 1128, h: 191, logo: { x: 0, y: 90, w: 260, hh: 101 }, gauche: 300 };
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
 * en pied, une seule ligne d'appel alignée à droite (@growth) : Inter 52 px, #D4D4D4,
 * fin x 1388, boîte y 350 à 410, hors photo de profil (x 0 à 400) et hors recadrage (y > 430).
 */
function xMessage(): Banniere {
  const t = { texte: MESSAGE_X, corps: 84, largeur: X.w - 224, accent: "plus drôle." };
  const c = composer(t);
  const haut = 75;
  const appel = typo(APPEL_X);
  const lAppel = Math.round(largeurTexte(appel, FONT_TEXTE, 400, 52));
  const finAppel = 1388;
  return {
    fichier: "x-entete", w: X.w, h: X.h, zones: zonesX(),
    controles: [
      `message ${c.lignes.length} lignes à ${c.corps} px, boîte y ${haut} à ${haut + c.hauteur}, x 112 à ${112 + Math.round(c.plusLongue)}`,
      `appel Inter 52 px, x ${finAppel - lAppel} à ${finAppel}, y 350 à 410 (photo jusqu'à x ${X.avatar.w}, recadrage à y ${X.h - X.recadrage})`,
    ],
    element: racine(X.w, X.h, COLORS.bg,
      abs({ left: 112, top: haut }, Texte(t)),
      abs({ left: finAppel - lAppel - 20, top: 350, width: lAppel + 20, height: 60, alignItems: "center", justifyContent: "flex-end",
        fontFamily: FONT_TEXTE, fontWeight: 400, fontSize: 52, lineHeight: 1, color: GRIS_APPEL, whiteSpace: "pre" }, appel)),
  };
}

// ─── LinkedIn, couverture de page 1128×191 ──────────────────────
function zonesLI(): ReactElement[] {
  const l = LI.logo;
  return [h(Zone, { key: "logo", x: l.x, y: l.y, w: l.w, hh: l.hh, libelle: "Logo de la page", corps: 18 })];
}

/** LinkedIn : aplat violet, titre 52 px blanc, sous-titre impératif 38 px #EDE9FE, ni pied ni URL. */
function liAplat(): Banniere {
  const largeur = LI.w - LI.gauche - 20;
  const t1 = { texte: "Des vannes pour le bureau.", corps: 52, largeur };
  const t2 = { texte: "Fais le quiz de ton profil d'humour.", corps: 38, largeur, poids: 700 as const, couleur: LILAS_TRES_CLAIR };
  const c1 = composer(t1);
  const c2 = composer(t2);
  if (c1.lignes.length !== 1 || c2.lignes.length !== 1 || c1.corps !== 52 || c2.corps !== 38) {
    throw new Error(`LinkedIn : titre ${c1.lignes.length}×${c1.corps} px, sous-titre ${c2.lignes.length}×${c2.corps} px (attendu 1×52 et 1×38).`);
  }
  const hb = c1.hauteur + 8 + c2.hauteur;
  const haut = Math.round((LI.h - hb) / 2);
  return {
    fichier: "linkedin-couverture", w: LI.w, h: LI.h, zones: zonesLI(),
    controles: [
      `titre ${c1.corps} px x ${LI.gauche} à ${LI.gauche + Math.round(c1.plusLongue)}, sous-titre ${c2.corps} px x ${LI.gauche} à ${LI.gauche + Math.round(c2.plusLongue)}`,
      `bloc y ${haut} à ${haut + hb} (logo à partir de x ${LI.logo.w} max, y ${LI.logo.y})`,
    ],
    element: racine(LI.w, LI.h, COLORS.accentSecondary,
      abs({ left: LI.gauche, top: haut, flexDirection: "column", gap: 8 }, Texte(t1), Texte(t2))),
  };
}

// ─── Instagram, couvertures de stories à la une 1080×1920 ───────
/** Pictogramme : boîte 520 px (viewBox 24), trait blanc 2,8 identique pour les 4, aucun libellé. */
const PICTO = 520;
const TRAIT = { fill: "none", stroke: "#FFFFFF", strokeWidth: 2.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function svg(...enfants: ReactElement[]): ReactElement {
  return h("svg", { width: PICTO, height: PICTO, viewBox: "0 0 24 24", ...TRAIT }, ...enfants);
}

const PICTOS: Record<string, () => ReactElement> = {
  // Point d'interrogation dans un cercle.
  quiz: () => svg(
    h("circle", { cx: 12, cy: 12, r: 10 }),
    h("path", { d: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" }), h("path", { d: "M12 17h.01" })),
  // Micro de scène sur pied.
  vannes: () => svg(
    h("rect", { x: 9, y: 2, width: 6, height: 13, rx: 3 }),
    h("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }), h("path", { d: "M12 19v3" }), h("path", { d: "M8 22h8" })),
  // Ampoule.
  conseils: () => svg(
    h("path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }),
    h("path", { d: "M9 18h6" }), h("path", { d: "M10 22h4" })),
  // Deux bulles de dialogue (échange de répliques).
  repartie: () => svg(
    h("path", { d: "M5 2.5h7a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H6l-4 4V5.5a3 3 0 0 1 3-3z" }),
    h("path", { d: "M15 8.5h4a3 3 0 0 1 3 3v10l-4-3h-6a3 3 0 0 1-3-3v-3" })),
};

/** Ordre des stories à la une (arbitrage s15) : Quiz, Vannes, Conseils, Répartie. */
const ALAUNE = [
  { cle: "quiz", nom: "Quiz" }, { cle: "vannes", nom: "Vannes" },
  { cle: "conseils", nom: "Conseils" }, { cle: "repartie", nom: "Répartie" },
] as const;

function zonesIG(): ReactElement[] {
  const b = 1300;
  const r = IG.diametre / 2;
  return [
    abs({ key: "anneau", left: IG.cx - r - b, top: IG.cy - r - b, width: IG.diametre + 2 * b, height: IG.diametre + 2 * b,
      borderRadius: r + b, border: `${b}px solid rgba(239,68,68,0.45)` }),
    abs({ key: "cercle", left: IG.cx - r, top: IG.cy - r, width: IG.diametre, height: IG.diametre, borderRadius: r, border: "4px dashed #FFFFFF" }),
    abs({ key: "boite", left: IG.cx - PICTO / 2, top: IG.cy - PICTO / 2, width: PICTO, height: PICTO, border: "2px dashed rgba(255,255,255,0.6)" }),
    abs({ key: "lib", left: 0, top: 380, width: IG.w, justifyContent: "center", fontFamily: FONT_TEXTE, fontWeight: 700, fontSize: 40, color: "#FFFFFF" },
      "Hors du cercle vu (rayon 360 px)"),
  ];
}

function alaUne(cle: string): Banniere {
  return {
    fichier: `instagram-alaune-${cle}`, w: IG.w, h: IG.h, zones: zonesIG(),
    controles: [`pictogramme ${PICTO} px, centre (${IG.cx}, ${IG.cy}), trait ${TRAIT.strokeWidth}/24, sans libellé`],
    element: racine(IG.w, IG.h, COLORS.accentSecondary,
      abs({ left: IG.cx - PICTO / 2, top: IG.cy - PICTO / 2, width: PICTO, height: PICTO }, PICTOS[cle]())),
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

/** LinkedIn : couverture 390×66, logo carré de 72 px (bord 2) à x 16, y 31 = zone retenue x 0 à 260, y 90 à 191. */
function apercuLI(png: Buffer) {
  const hb = Math.round(LI.h * TEL / LI.w);
  return { w: TEL, h: 176, element: racine(TEL, 176, "#FFFFFF",
    image(png, TEL, hb), photo(72, 2, 6, 16, 31),
    barre(16, 114, 140, 14), barre(16, 136, 220), barre(16, 154, 180)) };
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

