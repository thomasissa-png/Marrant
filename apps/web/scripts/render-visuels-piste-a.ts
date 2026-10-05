/**
 * Rendu local des cartes « piste A » (audit visuels s15) en vrais PNG,
 * via `next/og` (ImageResponse), le même moteur que la production sous
 * Cloudflare Workers, avec les TTF de public/fonts/.
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts
 * Sortie : docs/social/visuels-s15/v2/*.png
 *
 * Textes repris mot pour mot du catalogue validé (sources dans
 * docs/social/visuels-s15/v2/index.md). Aucune publication.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import {
  carrouselVanne,
  carrouselArticle,
  carrouselConseil,
  carteVanneUnique,
  type Slide,
} from "../src/lib/social/carrousel-piste-a";

const OUT = join(process.cwd(), "..", "..", "docs", "social", "visuels-s15", "v2");

const POLICES = [
  { name: "Inter", weight: 400, file: "Inter-Regular.ttf" },
  { name: "Inter", weight: 700, file: "Inter-Bold.ttf" },
  { name: "Inter", weight: 800, file: "Inter-ExtraBold.ttf" },
  { name: "Syne", weight: 700, file: "Syne-Bold.ttf" },
  { name: "Syne", weight: 800, file: "Syne-ExtraBold.ttf" },
] as const;

async function polices() {
  return Promise.all(
    POLICES.map(async (p) => {
      const b = await readFile(join(process.cwd(), "public", "fonts", p.file));
      return {
        name: p.name,
        weight: p.weight,
        style: "normal" as const,
        data: b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer,
      };
    }),
  );
}

const CAS: Array<{ prefixe: string; slides: Slide[] }> = [
  {
    prefixe: "ig-vanne-audioguide",
    slides: carrouselVanne({
      amorce: "L'audioguide du musée s'est éteint dans la première salle.",
      chute: ["J'ai hoché la tête pendant deux heures."],
    }),
  },
  {
    prefixe: "ig-vanne-tgv",
    slides: carrouselVanne({
      amorce: "Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu.",
      chute: ["J'ai voyagé à genoux devant lui.", "On n'en a jamais parlé."],
    }),
  },
  {
    prefixe: "ig-article-halloween",
    slides: carrouselArticle({
      titre: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée",
      extrait: {
        rang: 2,
        amorce: "J'ai passé la soirée à expliquer mon costume.",
        chute: "À minuit, j'étais déguisé en guide de musée.",
      },
    }),
  },
  {
    prefixe: "ig-article-se-presenter",
    slides: carrouselArticle({
      titre: "Se présenter avec humour : 5 accroches qui passent",
      extrait: {
        rang: 3,
        amorce: "Moi, c'est Camille. Au jeu de mimes, ma carte disait « la timidité ».",
        chute: "J'avais à peine bougé qu'ils avaient trouvé.",
      },
    }),
  },
  {
    prefixe: "ig-conseil-ironie-bienveillante",
    slides: carrouselConseil({
      titreConseil: "L'ironie bienveillante",
      situation: "Ton pote arrive avec 45 minutes de retard.",
      replique: ["Pile à l'heure.", "Le serveur commençait à croire qu'on t'avait inventé."],
    }),
  },
  {
    prefixe: "x-vanne-tgv",
    slides: [carteVanneUnique("x", ["J'ai voyagé à genoux devant lui.", "On n'en a jamais parlé."])],
  },
  {
    prefixe: "linkedin-vanne-tgv",
    slides: [
      carteVanneUnique("linkedin", ["J'ai voyagé à genoux devant lui.", "On n'en a jamais parlé."]),
    ],
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const fonts = await polices();
  for (const cas of CAS) {
    for (let i = 0; i < cas.slides.length; i++) {
      const s = cas.slides[i];
      const res = new ImageResponse(s.element, { width: s.width, height: s.height, fonts });
      const png = Buffer.from(await res.arrayBuffer());
      const nom = cas.slides.length > 1 ? `${cas.prefixe}-${i + 1}.png` : `${cas.prefixe}.png`;
      await writeFile(join(OUT, nom), png);
      console.log(`${nom} | ${s.width}×${s.height} | ${png.length} o`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
