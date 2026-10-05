/**
 * Preuve de la carte LinkedIn du test texte / image (s15, v5 §8) : rend en vrais PNG,
 * via `next/og` (moteur de production sous Cloudflare Workers) et les TTF de
 * public/fonts/, la carte que `/api/social/image` sert pour un post LINKEDIN
 * `[variante:image]` (même chemin : `slidesDuPost`, slide 0).
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-carte-linkedin.ts
 * Sortie : docs/social/visuels-s15/v5-linkedin/*.png + alt.json (texte du post, alt).
 * Textes : catalogue validé (docs/copy/catalogue-vannes-valides.md), pool strict. Aucune publication.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import { slidesDuPost } from "../src/lib/social/generate-post-image";
import { vanneLinkedInImage } from "../src/lib/social/carte-linkedin";
import { enregistrerPolice } from "../src/lib/social/mesure-texte";
import { vanneR6 } from "./content/social-month-plan";
import { premierePersonne } from "./content/social-controls";

const OUT = join(process.cwd(), "..", "..", "docs", "social", "visuels-s15", "v5-linkedin");

const POLICES = [
  { name: "Inter", weight: 400, file: "Inter-Regular.ttf" },
  { name: "Inter", weight: 700, file: "Inter-Bold.ttf" },
  { name: "Inter", weight: 800, file: "Inter-ExtraBold.ttf" },
  { name: "Plus Jakarta Sans", weight: 700, file: "PlusJakartaSans-Bold.ttf" },
  { name: "Plus Jakarta Sans", weight: 800, file: "PlusJakartaSans-ExtraBold.ttf" },
] as const;

/** Vannes du pool strict (src/config/social-pool.ts), texte du catalogue validé. */
const VANNES = [
  { id: "cmonlkgeu000ds60wu0gazutb", fichier: "li-v074-rome.png",
    lignes: ["Mon collègue revient de 4 jours à Rome et me raconte tout en détail.", "Ça fait 2h. On vient de récupérer les valises."] },
  { id: "cs14jk0c96df8dc97a67e3f6", fichier: "li-v044-nicolas.png",
    lignes: ["Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit.", "Huit mois après, Nicolas est très apprécié. Julien, on ne sait pas."] },
];

async function main() {
  const fonts = await Promise.all(POLICES.map(async (p) => {
    const b = await readFile(join(process.cwd(), "public", "fonts", p.file));
    const data = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
    enregistrerPolice(p.name, p.weight, data);
    return { name: p.name, weight: p.weight, style: "normal" as const, data };
  }));
  await mkdir(OUT, { recursive: true });
  const alt: Record<string, { texteDuPost: string; alt: string; largeur: number; hauteur: number }> = {};
  for (const v of VANNES) {
    // Post tel que le lot l'insère (bras image) : texte R6 sur 2 lignes, threadParts = [amorce, chute].
    const post = { id: v.id, platform: "LINKEDIN", format: "POTE_AU_TAF", hook: v.lignes[0].slice(0, 80), targetPersona: "SOPHIE",
      content: vanneR6(v.lignes, premierePersonne(v.lignes.join(" "))), threadParts: v.lignes, directorNote: "[variante:image] preuve" };
    const li = vanneLinkedInImage(post);
    const slide = slidesDuPost(post)?.[0];
    if (!li || !slide) throw new Error(`${v.id} : non éligible à la carte LinkedIn.`);
    const res = new ImageResponse(slide.element, { width: slide.width, height: slide.height, fonts });
    await writeFile(join(OUT, v.fichier), Buffer.from(await res.arrayBuffer()));
    alt[v.fichier] = { texteDuPost: li.texte, alt: slide.alt, largeur: slide.width, hauteur: slide.height };
    console.log(`${v.fichier} : ${slide.width}x${slide.height}, texte du post « ${li.texte} »`);
  }
  await writeFile(join(OUT, "alt.json"), `${JSON.stringify(alt, null, 2)}\n`, "utf-8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
