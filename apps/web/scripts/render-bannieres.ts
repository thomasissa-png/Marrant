/**
 * Bannières des réseaux (s15) : en-tête X 1500×500, couverture de page LinkedIn
 * 1128×191, couvertures de stories à la une Instagram 1080×1920. Même moteur
 * (`next/og`, satori) et même identité que les cartes « piste A » : Plus Jakarta Sans
 * 800/700, noir #0D0D0D, aplat #6D28D9, guillemets lilas, monogramme « d » + adresse.
 * Lignes calculées sur les largeurs réelles des glyphes (mise-en-lignes.ts).
 *
 * Chaque PNG a sa version `-controle.png` : zones masquées par l'interface en surimpression.
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-bannieres.ts
 * Sortie : docs/social/visuels-s15/bannieres/*.png. Aucune publication.
 */
import { createElement as h, type ReactElement, type ReactNode } from "react";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import { COLORS, BRAND } from "../src/lib/social/templates/instagram-templates";
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
const LILAS_CLAIR = COULEUR_GUILLEMETS.aplat; // #DDD6FE sur l'aplat

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

/** Pied des cartes : monogramme « d » + deviens-marrant.fr. */
function Pied({ fond, taille, corps }: { fond: Fond; taille: number; corps: number }): ReactElement {
  return h("div", { style: { display: "flex", alignItems: "center", gap: Math.round(taille * 0.28) } },
    h(Monogramme, { fond, taille }),
    h("div", { style: { display: "flex", fontFamily: FONT_TEXTE, fontSize: corps, color: fond === "aplat" ? COLORS.textPrimary : COLORS.textSecondary } }, BRAND));
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
/** Vanne du pool strict (config/social-pool.ts), catalogue validé, mot pour mot : `cs14jk90226d6abb90287724`. */
const VANNE_X = { amorce: "Ma mère me demande encore des nouvelles de mon ex.", chute: "Je n'en ai pas. Elle, si." };
const MESSAGE_LI = "Des vannes pour le bureau,\nun quiz pour ton profil d'humour.";

// ─── Zones masquées [HYPOTHÈSE : relevés approximatifs des interfaces, octobre 2026] ──
const X = { w: 1500, h: 500, avatar: { x: 0, y: 300, w: 400, hh: 200 }, recadrage: 70 };
const LI = { w: 1128, h: 191, logo: { x: 0, y: 90, w: 260, hh: 101 }, gauche: 300 };
const IG = { w: 1080, h: 1920, diametre: 1080 };

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

/** X, variante A : le message seul, sur noir ; « plus drôle. » en lilas ; pied en bas à droite. */
function xMessage(): Banniere {
  const t = { texte: MESSAGE_X, corps: 84, largeur: X.w - 224, accent: "plus drôle." };
  const c = composer(t);
  const haut = X.recadrage + Math.round((X.avatar.y - X.recadrage - c.hauteur) / 2);
  return {
    fichier: "x-entete-a-message", w: X.w, h: X.h, zones: zonesX(),
    controles: [`message ${c.lignes.length} lignes à ${c.corps} px, y ${haut} à ${haut + c.hauteur} (photo de profil à partir de y ${X.avatar.y})`],
    element: racine(X.w, X.h, COLORS.bg,
      abs({ left: 112, top: haut }, Texte(t)),
      abs({ right: 112, bottom: X.recadrage + 12 }, Pied({ fond: "sombre", taille: 72, corps: 44 }))),
  };
}

/** X, variante B : message à gauche sur noir, vanne du pool sur l'aplat à droite (une paire « » par ligne, R6). */
function xVanne(): Banniere {
  const panneau = 780;
  const colonne = panneau + 112;
  const largeur = X.w - colonne - 64;
  const msg = { texte: MESSAGE_X, corps: 60, largeur: panneau - 96 - 56, accent: "plus drôle." };
  const cm = composer(msg);
  const am = { texte: VANNE_X.amorce, corps: 46, largeur, poids: 700 as const, citation: "aplat" as const };
  const ch = { texte: VANNE_X.chute, corps: 46, largeur, citation: "aplat" as const };
  const ca = composer(am);
  const cc = composer(ch);
  if (ca.corps !== cc.corps) throw new Error(`Corps différents amorce ${ca.corps} / chute ${cc.corps}`);
  const hv = ca.hauteur + 20 + cc.hauteur;
  const hautVanne = X.recadrage + Math.round((X.h - 2 * X.recadrage - hv) / 2);
  const hautMsg = X.recadrage + Math.round((X.avatar.y - X.recadrage - cm.hauteur) / 2);
  // Pied à droite de la photo de profil, dans le panneau noir.
  const piedX = X.avatar.w + 24;
  return {
    fichier: "x-entete-b-vanne", w: X.w, h: X.h, zones: zonesX(),
    controles: [
      `message ${cm.lignes.length} lignes à ${cm.corps} px, y ${hautMsg} à ${hautMsg + cm.hauteur}`,
      `vanne ${ca.lignes.length}+${cc.lignes.length} lignes à ${ca.corps} px, y ${hautVanne} à ${hautVanne + hv}, guillemet ouvrant x ${Math.round(colonne - ca.suspendu)}`,
      `pied x ${piedX} à ${piedX + 48 + 14 + Math.round(largeurTexte(BRAND, FONT_TEXTE, 400, 30))} (panneau à x ${panneau})`,
    ],
    element: racine(X.w, X.h, COLORS.bg,
      abs({ left: panneau, top: 0, width: X.w - panneau, height: X.h, backgroundColor: COLORS.accentSecondary }),
      abs({ left: 96, top: hautMsg }, Texte(msg)),
      abs({ left: colonne, top: hautVanne, flexDirection: "column", gap: 20 }, Texte(am), Texte(ch)),
      abs({ left: piedX, bottom: X.recadrage + 12 }, Pied({ fond: "sombre", taille: 48, corps: 30 }))),
  };
}

// ─── LinkedIn, couverture de page 1128×191 ──────────────────────
function zonesLI(): ReactElement[] {
  const l = LI.logo;
  return [h(Zone, { key: "logo", x: l.x, y: l.y, w: l.w, hh: l.hh, libelle: "Logo de la page", corps: 18 })];
}

/** LinkedIn, variante A : noir, bio sur 2 lignes (« pour le bureau » en lilas), pied sous le texte. */
function liNoir(): Banniere {
  const t = { texte: MESSAGE_LI, corps: 44, largeur: LI.w - LI.gauche - 40, accent: "pour le bureau" };
  const c = composer(t);
  const hb = c.hauteur + 12 + 36;
  const haut = Math.round((LI.h - hb) / 2);
  return {
    fichier: "linkedin-couverture-a-noir", w: LI.w, h: LI.h, zones: zonesLI(),
    controles: [`texte ${c.lignes.length} lignes à ${c.corps} px, x ${LI.gauche} à ${LI.gauche + Math.round(c.plusLongue)}, y ${haut} à ${haut + hb}`],
    element: racine(LI.w, LI.h, COLORS.bg,
      abs({ left: LI.gauche, top: haut, flexDirection: "column", gap: 12 }, Texte(t), Pied({ fond: "sombre", taille: 36, corps: 24 }))),
  };
}

/** LinkedIn, variante B : aplat violet, « Des vannes pour le bureau. » en grand, le quiz en lilas clair. */
function liAplat(): Banniere {
  const largeur = LI.w - LI.gauche - 40;
  const t1 = { texte: "Des vannes pour le bureau.", corps: 54, largeur };
  const t2 = { texte: "Un quiz pour ton profil d'humour.", corps: 32, largeur, poids: 700 as const, couleur: LILAS_CLAIR };
  const c1 = composer(t1);
  const c2 = composer(t2);
  const hb = c1.hauteur + 6 + c2.hauteur;
  const haut = Math.round((LI.h - hb) / 2);
  return {
    fichier: "linkedin-couverture-b-aplat", w: LI.w, h: LI.h, zones: zonesLI(),
    controles: [`titre ${c1.lignes.length} ligne à ${c1.corps} px (x ${LI.gauche} à ${LI.gauche + Math.round(c1.plusLongue)}), sous-titre ${c2.lignes.length} ligne à ${c2.corps} px, y ${haut} à ${haut + hb}`],
    element: racine(LI.w, LI.h, COLORS.accentSecondary,
      abs({ left: LI.gauche, top: haut, flexDirection: "column", gap: 6 }, Texte(t1), Texte(t2))),
  };
}

// ─── Instagram, couvertures de stories à la une 1080×1920 ───────
/** Côté du pictogramme dans le cercle de 1080 px (lisible à la taille du cercle du profil). */
const PICTO = 440;
const TRAIT = { fill: "none", stroke: LILAS_CLAIR, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function svg(...enfants: ReactElement[]): ReactElement {
  return h("svg", { width: PICTO, height: PICTO, viewBox: "0 0 24 24", ...TRAIT }, ...enfants);
}

/** Glyphe Plus Jakarta 800 dont le corps est calé pour tenir dans `largeur` px. */
function glyphe(texte: string, largeur: number, decalage = 0): ReactElement {
  const corps = Math.floor(largeur / largeurTexte(texte, FONT_TITRE, 800, 1));
  return h("div", { style: { display: "flex", fontFamily: FONT_TITRE, fontWeight: 800, fontSize: corps, lineHeight: 1, color: LILAS_CLAIR, marginTop: decalage } }, texte);
}

const PICTOS: Record<string, () => ReactElement> = {
  vannes: () => glyphe(`«${affichage(NNBSP)}»`, PICTO),
  conseils: () => svg(
    h("path", { d: "M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" }),
    h("path", { d: "M9 18h6" }), h("path", { d: "M10 22h4" })),
  quiz: () => glyphe("?", 250),
  bureau: () => svg(
    h("rect", { x: 2, y: 7, width: 20, height: 14, rx: 2 }),
    h("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })),
};

function zonesIG(): ReactElement[] {
  const b = 1300;
  const r = IG.diametre / 2;
  return [
    abs({ key: "anneau", left: IG.w / 2 - r - b, top: IG.h / 2 - r - b, width: IG.diametre + 2 * b, height: IG.diametre + 2 * b,
      borderRadius: r + b, border: `${b}px solid rgba(239,68,68,0.45)` }),
    abs({ key: "cercle", left: 0, top: IG.h / 2 - r, width: IG.diametre, height: IG.diametre, borderRadius: r, border: "4px dashed #FFFFFF" }),
    abs({ key: "lib", left: 0, top: 220, width: IG.w, justifyContent: "center", fontFamily: FONT_TEXTE, fontWeight: 700, fontSize: 40, color: "#FFFFFF" },
      "Hors du cercle de la story à la une"),
  ];
}

function alaUne(cle: string, libelle: string): Banniere {
  return {
    fichier: `instagram-alaune-${cle}`, w: IG.w, h: IG.h, zones: zonesIG(), controles: [`pictogramme ${PICTO} px + « ${libelle} » 132 px, centrés`],
    element: racine(IG.w, IG.h, COLORS.accentSecondary,
      abs({ left: 0, top: 0, width: IG.w, height: IG.h, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 },
        // Guillemets : glyphe bas (hauteur d'x), boîte à sa hauteur naturelle pour garder le groupe compact.
        h("div", { style: { display: "flex", width: PICTO, ...(cle === "vannes" ? {} : { height: PICTO }), alignItems: "center", justifyContent: "center" } }, PICTOS[cle]()),
        h("div", { style: { display: "flex", fontFamily: FONT_TITRE, fontWeight: 800, fontSize: 132, lineHeight: 1, color: COLORS.textPrimary } }, libelle))),
  };
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
  const lot: Array<() => Banniere> = [
    xMessage, xVanne, liNoir, liAplat,
    () => alaUne("vannes", "Vannes"), () => alaUne("conseils", "Conseils"),
    () => alaUne("quiz", "Quiz"), () => alaUne("bureau", "Bureau"),
  ];
  for (const fabrique of lot) {
    const b = fabrique();
    const controle = h("div", { style: { display: "flex", position: "relative", width: b.w, height: b.h } }, b.element, ...b.zones);
    for (const [el, suffixe] of [[b.element, ""], [controle, "-controle"]] as const) {
      const res = new ImageResponse(el, { width: b.w, height: b.h, fonts });
      await writeFile(join(OUT, `${b.fichier}${suffixe}.png`), Buffer.from(await res.arrayBuffer()));
    }
    console.log(`${b.fichier} (${b.w}x${b.h}) : ${b.controles.join(" ; ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
