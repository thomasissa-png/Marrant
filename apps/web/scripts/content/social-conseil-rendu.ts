/**
 * Rendu réel et contrôle des cartes conseil Instagram (s15, gabarit `docs/social/visuels-s15/gabarit-carte-conseil.md`) :
 * chaque conseil Instagram de `docs/social/preparation/textes-formats-valides.json` est rendu par `generatePostImage`
 * (même fonction que /api/social/image), threadParts = `[surtitre, carte 1, carte 2]` comme le lot (`partiesConseilIg`).
 * Contrôle par pixels (§8) : « encre » = pixel à plus de 80 de distance RGB du fond ; 0 pixel d'encre attendu dans
 * y 0-95, x 0-87 (jambage du « j » toléré), x 985-1079 et dans la bande y 1118-1181 (écart au pied). Le script
 * signale, il ne corrige rien.
 *
 *   cd apps/web && npx tsx scripts/content/social-conseil-rendu.ts --out <dossier> [--apercu] [--index]
 *
 * `--apercu` : copie 390 px de large de chaque carte (lecture mobile) ; `--index` : écrit `index.md` dans --out.
 * Sortie : une ligne par carte (corps, lignes, hauteur, verdict) ; code 1 si une carte déborde ou si un rendu échoue.
 */
import fs from "node:fs";
import path from "node:path";
import * as React from "react";
import sharp from "sharp";
import { lireTextesFormats, partiesConseilIg } from "./social-lot-v5-mix";

const FICHIER = path.resolve(__dirname, "../../../../docs/social/preparation/textes-formats-valides.json");
const LARGEUR = 1080;
/** Zones sans encre (x0, y0, x1, y1 exclus) : marges 96 px et bande entre la zone de texte (1118) et le pied (1182). */
const ZONES: Array<{ nom: string; x0: number; y0: number; x1: number; y1: number }> = [
  { nom: "marge haute", x0: 0, y0: 0, x1: LARGEUR, y1: 96 },
  // Tolérance de 8 px à gauche : le jambage du « j » en début de ligne déborde de 5 px de la colonne (dessin du
  // glyphe, mesuré le 08/10 sur « j’attends », 13/11) ; la colonne reste à x 96. À valider par @design.
  { nom: "marge gauche", x0: 0, y0: 0, x1: 88, y1: 1350 },
  { nom: "marge droite", x0: 985, y0: 0, x1: LARGEUR, y1: 1350 },
  { nom: "bande au-dessus du pied", x0: 0, y0: 1118, x1: LARGEUR, y1: 1182 },
];

const arg = (nom: string) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : undefined; };

/** Rangées contenant de l'encre dans chaque zone (fond lu au pixel (2, 2)). */
export async function encreHorsZone(png: Buffer): Promise<string[]> {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const px = (x: number, y: number) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
  const fond = px(2, 2);
  const encre = (x: number, y: number) => { const p = px(x, y); return Math.hypot(p[0] - fond[0], p[1] - fond[1], p[2] - fond[2]) > 80; };
  const motifs: string[] = [];
  for (const z of ZONES) {
    let n = 0;
    for (let y = z.y0; y < Math.min(z.y1, info.height); y++) for (let x = z.x0; x < z.x1; x++) if (encre(x, y)) { n++; break; }
    if (n) motifs.push(`${n} rangées d'encre en ${z.nom}`);
  }
  return motifs;
}

/** Défauts de coupe lisibles : ligne d'un seul mot, début de phrase d'un mot laissé en fin de ligne. */
function defautsDeCoupe(paragraphes: Array<{ lignes: string[] }>): string[] {
  const mots = (l: string) => l.split(/\s+/).filter((m) => m && !/^[:;?!»«“”…,.]+$/.test(m)).length;
  return paragraphes.flatMap((p) => p.lignes.flatMap((l, i) => [
    ...(mots(l) < 2 ? [`ligne d'un mot « ${l} »`] : []),
    // Mot (avec une lettre) seul après une fin de phrase : « … ? Plutôt ». Un » fermant n'en est pas un.
    ...(i < p.lignes.length - 1 && /[.?!»] \p{L}\S*$/u.test(l) ? [`début de phrase seul en fin de ligne « ${l} »`] : []),
  ]));
}

interface Ligne { creneau: string; id: string; carte: number; corps?: number; lignes?: string; hauteur?: number; verdict: string; fichier?: string }

async function main(): Promise<void> {
  const out = arg("--out");
  if (!out) throw new Error("--out <dossier> requis");
  fs.mkdirSync(out, { recursive: true });
  // Les gabarits .tsx sont compilés en JSX classique par tsx : React global avant leur chargement.
  (globalThis as unknown as { React: typeof React }).React = React;
  const { generatePostImage } = await import("../../src/lib/social/generate-post-image");
  const { compositionConseilCarte1, compositionConseilCarte2, decouperCarte2 } = await import("../../src/lib/social/templates/cartes-conseil");
  const { textes, erreurs } = lireTextesFormats(fs.readFileSync(FICHIER, "utf-8"), FICHIER);
  if (erreurs.length) throw new Error(erreurs.join("\n"));
  const rapport: Ligne[] = [];
  for (const t of textes.filter((x) => x.format === "conseil" && x.reseau === "INSTAGRAM")) {
    const parties = partiesConseilIg(t.cartes ?? [], t.surtitre);
    const post = { format: "IMAGE_QUI_CLAQUE", hook: "", content: t.legende ?? "", targetPersona: t.persona ?? "YANIS", threadParts: parties, platform: "INSTAGRAM" };
    for (const carte of [1, 2]) {
      const l: Ligne = { creneau: t.creneau ?? "sans créneau", id: t.id, carte, verdict: "" };
      try {
        // Rendu d'abord : il charge les polices, la composition du rapport mesure alors les vrais glyphes.
        const png = await generatePostImage(post, carte - 1);
        const d = carte === 2 ? decouperCarte2(parties[2]) : null;
        const compo = d ? compositionConseilCarte2(d.replique, d.consigne) : compositionConseilCarte1(parties[0], parties[1]);
        const base = `${t.creneau ?? "x"}-${t.id}-carte${carte}`;
        fs.writeFileSync(path.join(out, `${base}.png`), png);
        if (process.argv.includes("--apercu")) await sharp(png).resize({ width: 390 }).png().toFile(path.join(out, `${base}-390.png`));
        const motifs = await encreHorsZone(png);
        Object.assign(l, {
          corps: compo.corps, hauteur: compo.hauteur, fichier: `${base}.png`,
          lignes: compo.paragraphes.map((p) => `${p.lignes.length} à ${p.corps} px`).join(" + "),
          verdict: motifs.length ? `DÉBORDE (${motifs.join(", ")})`
          : compo.defauts ? `tient ; coupe : ${defautsDeCoupe(compo.paragraphes).join(", ") || `${compo.defauts} défaut(s)`}` : "tient",
        });
      } catch (e) {
        l.verdict = `ÉCHEC : ${(e as Error).message}`;
      }
      rapport.push(l);
      console.log(`${l.creneau} ${l.id} carte ${carte} : corps ${l.corps ?? "-"} px, lignes ${l.lignes ?? "-"}, hauteur ${l.hauteur ?? "-"} px : ${l.verdict}`);
    }
  }
  const ko = rapport.filter((l) => !l.verdict.startsWith("tient")).length;
  if (process.argv.includes("--index")) fs.writeFileSync(path.join(out, "index.md"), indexMd(rapport));
  console.log(ko ? `${ko} carte(s) en défaut : à signaler, aucun mot coupé.` : `Les ${rapport.length} cartes tiennent.`);
  process.exitCode = ko ? 1 : 0;
}

function indexMd(rapport: Ligne[]): string {
  const lignes = rapport.map((l) => `| ${l.creneau} | ${l.id} | ${l.carte} | ${l.corps ?? "-"} | ${l.lignes ?? "-"} | ${l.hauteur ?? "-"} | ${l.verdict} | ${l.fichier ? `[PNG](${l.fichier})` : "-"} |`);
  return [
    "# Cartes conseil Instagram du lot 1b : rendu réel",
    "",
    "> Généré par `apps/web/scripts/content/social-conseil-rendu.ts --apercu --index` (même fonction que `/api/social/image`).",
    "> Corps = corps retenu de la situation (carte 1) ou de la réplique (carte 2), paliers 72 à 56 px. Lignes : par paragraphe",
    "> (carte 2 : réplique + consigne). Hauteur du bloc, surtitre compris, sur 1022 px disponibles. Chaque PNG a sa copie `-390.png` (aperçu mobile).",
    "> Contrôle pixels : aucune encre (distance RGB > 80 du fond) en marge haute, gauche (tolérance 8 px pour le jambage du « j »), droite, ni entre",
    "> y 1118 et 1181. « Coupe » : garde-fou de mise en lignes impossible à tenir avec ce texte (mot cité trop long pour partager sa ligne) ;",
    "> la coupe retenue est la moins mauvaise au nombre minimal de lignes, sans rien couper ni retirer.",
    "",
    "| Créneau | Texte | Carte | Corps (px) | Lignes | Hauteur (px) | Contrôle pixels | Fichier |",
    "|---|---|---|---|---|---|---|---|",
    ...lignes,
    "",
  ].join("\n");
}

main().catch((e) => { console.error(e); process.exit(2); });
