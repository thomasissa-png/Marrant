/**
 * Contrôle local du rendu des cartes conseil Instagram (s15, lot 1b) : chaque conseil Instagram de
 * `docs/social/preparation/textes-formats-valides.json` est rendu en PNG par `generatePostImage` (même chemin
 * que /api/social/image hors Workers), carte 1 avec la technique en tête (`carteAvecSurtitre`), puis contrôlé :
 * un pixel de texte dans la marge haute (96 px) = le bloc déborde en hauteur (bloc centré : aussi en bas) ; dans
 * la moitié extérieure de la marge droite = une ligne sort de la colonne. Aucun mot n'est coupé ni retiré : le
 * script signale, il ne corrige rien. `--sans-surtitre` : même rendu sans la technique (comparaison).
 *
 *   cd apps/web && npx tsx scripts/content/social-conseil-rendu.ts --out /tmp/conseils [--sans-surtitre] [--copie <id>-<carte>:<chemin.png>]
 *
 * Sortie : un PNG par carte dans --out, une ligne par carte (« tient » ou « DÉBORDE »), code 1 si une carte déborde.
 */
import fs from "node:fs";
import path from "node:path";
import * as React from "react";
import sharp from "sharp";
import { carteAvecSurtitre, lireTextesFormats } from "./social-lot-v5-mix";

const FICHIER = path.resolve(__dirname, "../../../../docs/social/preparation/textes-formats-valides.json");
/** Marge haute des cartes 4:5 (FORMATS.instagram.padY). */
const MARGE_HAUTE = 96;

const arg = (nom: string) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : undefined; };

/** Haut du pied (monogramme 72 px, marge basse 96 px) : le contrôle de la marge droite s'arrête au-dessus. */
const HAUT_PIED = 1350 - 96 - 72;

/**
 * Rangées de texte blanc (texte des cartes : blanc sur noir et sur l'aplat) hors de la zone de texte : marge haute
 * (débordement vertical) et marge droite au-dessus du pied (ligne trop large pour la colonne).
 */
async function horsZone(png: Buffer): Promise<{ haut: number; droite: number }> {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const blanc = (x: number, y: number) => { const i = (y * info.width + x) * info.channels; return data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200; };
  const rangees = (y0: number, y1: number, x0: number, x1: number) => {
    let n = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (blanc(x, y)) { n++; break; }
    return n;
  };
  return { haut: rangees(0, MARGE_HAUTE, 0, info.width), droite: rangees(0, HAUT_PIED, info.width - MARGE_HAUTE / 2, info.width) };
}

async function main(): Promise<void> {
  const out = arg("--out");
  if (!out) throw new Error("--out <dossier> requis");
  fs.mkdirSync(out, { recursive: true });
  // Les gabarits .tsx sont compilés en JSX classique par tsx : React global avant leur chargement.
  (globalThis as unknown as { React: typeof React }).React = React;
  const { generatePostImage } = await import("../../src/lib/social/generate-post-image");
  const { textes, erreurs } = lireTextesFormats(fs.readFileSync(FICHIER, "utf-8"), FICHIER);
  if (erreurs.length) throw new Error(erreurs.join("\n"));
  let deborde = 0;
  for (const t of textes.filter((x) => x.format === "conseil" && x.reseau === "INSTAGRAM")) {
    const cartes = process.argv.includes("--sans-surtitre") ? [...(t.cartes ?? [])] : carteAvecSurtitre(t.cartes ?? [], t.surtitre);
    const post = { format: "IMAGE_QUI_CLAQUE", hook: "", content: t.legende ?? "", targetPersona: t.persona ?? "YANIS", threadParts: cartes, platform: "INSTAGRAM" };
    for (const [i, texte] of cartes.entries()) {
      const png = await generatePostImage(post, i);
      const nom = `${t.id}-${i + 1}.png`;
      fs.writeFileSync(path.join(out, nom), png);
      const h = await horsZone(png);
      const motifs = [h.haut ? `${h.haut} rangées de texte dans la marge haute` : "", h.droite ? `${h.droite} rangées dans la marge droite` : ""].filter(Boolean);
      if (motifs.length) deborde++;
      console.log(`${t.creneau ?? "sans créneau"} ${t.id} carte ${i + 1} (${texte.length} car.) : ${motifs.length ? `DÉBORDE (${motifs.join(", ")})` : "tient"}`);
    }
  }
  const copie = arg("--copie");
  if (copie) {
    const [source, cible] = copie.split(":");
    fs.copyFileSync(path.join(out, `${source}.png`), cible);
    console.log(`Copie de contrôle : ${cible}`);
  }
  console.log(deborde ? `${deborde} carte(s) débordent : à signaler, aucun mot coupé.` : "Toutes les cartes tiennent.");
  process.exitCode = deborde ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exit(2); });
