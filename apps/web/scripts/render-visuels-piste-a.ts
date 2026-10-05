/**
 * Rendu local des cartes « piste A » v3 en vrais PNG, via `next/og`
 * (ImageResponse), le même moteur que la production sous Cloudflare
 * Workers, avec les TTF de public/fonts/ (Inter + Plus Jakarta Sans).
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts
 * Sortie : docs/social/visuels-s15/v3/*.png (+ charge/ : tests de charge)
 * et alt.json (texte alternatif de chaque image).
 *
 * Textes repris mot pour mot du catalogue validé (sources dans
 * docs/social/visuels-s15/v3/index.md). Aucune publication.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { ImageResponse } from "next/og";
import {
  carrouselVanne,
  carrouselArticle,
  carrouselConseil,
  carteVanneUnique,
  carteArticleUnique,
  carteVanneRepli,
  type Slide,
} from "../src/lib/social/carrousel-piste-a";
import { enregistrerPolice } from "../src/lib/social/mesure-texte";

const OUT = join(process.cwd(), "..", "..", "docs", "social", "visuels-s15", "v3");

const POLICES = [
  { name: "Inter", weight: 400, file: "Inter-Regular.ttf" },
  { name: "Inter", weight: 700, file: "Inter-Bold.ttf" },
  { name: "Inter", weight: 800, file: "Inter-ExtraBold.ttf" },
  { name: "Plus Jakarta Sans", weight: 700, file: "PlusJakartaSans-Bold.ttf" },
  { name: "Plus Jakarta Sans", weight: 800, file: "PlusJakartaSans-ExtraBold.ttf" },
] as const;

async function polices() {
  return Promise.all(
    POLICES.map(async (p) => {
      const b = await readFile(join(process.cwd(), "public", "fonts", p.file));
      const data = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
      enregistrerPolice(p.name, p.weight, data);
      return { name: p.name, weight: p.weight, style: "normal" as const, data };
    }),
  );
}

const TGV = {
  amorce: "Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu.",
  chute: ["J'ai voyagé à genoux devant lui.", "On n'en a jamais parlé."],
};
/** Plus longue amorce du catalogue (136 caractères, sous le seuil LinkedIn de 140). */
const ROBERT = {
  amorce:
    "Pour mon entretien, j'ai emprunté le costume de mon père. Son nom est cousu sur la manche. Le recruteur m'a appelé Robert toute l'heure.",
  chute: ["Robert commence en septembre."],
};
const HALLOWEEN = "Blagues d'Halloween : 8 vannes pour ta soirée déguisée";
const SE_PRESENTER = "Se présenter avec humour : 5 accroches qui passent";
const IRONIE = {
  titreConseil: "L'ironie bienveillante",
  situation: "Ton pote arrive avec 45 minutes de retard.",
  replique: ["Pile à l'heure.", "Le serveur commençait à croire qu'on t'avait inventé."],
  principe:
    "L'ironie bienveillante consiste à dire le contraire de ce que tu penses, mais de façon tellement évidente que ça fait rire sans piquer.",
};

const CAS: Array<{ prefixe: string; slides: Slide[] }> = [
  {
    prefixe: "ig-vanne-audioguide",
    slides: carrouselVanne({
      amorce: "L'audioguide du musée s'est éteint dans la première salle.",
      chute: ["J'ai hoché la tête pendant deux heures."],
    }),
  },
  { prefixe: "ig-vanne-tgv", slides: carrouselVanne(TGV) },
  {
    prefixe: "ig-article-halloween",
    slides: carrouselArticle({
      titre: HALLOWEEN,
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
      titre: SE_PRESENTER,
      extrait: {
        rang: 3,
        amorce: "Moi, c'est Camille. Au jeu de mimes, ma carte disait « la timidité ».",
        chute: "J'avais à peine bougé qu'ils avaient trouvé.",
      },
    }),
  },
  { prefixe: "ig-conseil-ironie-bienveillante", slides: carrouselConseil(IRONIE) },
  { prefixe: "linkedin-conseil-ironie-bienveillante", slides: carrouselConseil(IRONIE, "linkedin") },
  { prefixe: "x-vanne-tgv", slides: [carteVanneUnique("x", TGV)] },
  { prefixe: "linkedin-vanne-tgv", slides: [carteVanneUnique("linkedin", TGV)] },
  { prefixe: "x-article-halloween", slides: [carteArticleUnique("x", HALLOWEEN)] },
  { prefixe: "linkedin-article-halloween", slides: [carteArticleUnique("linkedin", HALLOWEEN)] },
  { prefixe: "x-article-se-presenter", slides: [carteArticleUnique("x", SE_PRESENTER)] },
  { prefixe: "linkedin-article-se-presenter", slides: [carteArticleUnique("linkedin", SE_PRESENTER)] },
  // ─── Tests de charge (textes de test, non publiables) ───
  {
    prefixe: "charge/ig-vanne-courte",
    slides: carrouselVanne({ amorce: "J'ai pris un chien pour me faire des amis.", chute: ["Il en a plein. Moi, je tiens la laisse."] }),
  },
  {
    prefixe: "charge/ig-vanne-longue",
    slides: carrouselVanne({
      amorce: "Dans le métro, quelqu'un m'a demandé « vous descendez ? ». J'ai dit oui par réflexe.",
      chute: ["Je suis descendu. J'habite à trois stations. Je tiens parole."],
    }),
  },
  { prefixe: "charge/linkedin-vanne-amorce-136-car", slides: [carteVanneUnique("linkedin", ROBERT)] },
  { prefixe: "charge/linkedin-vanne-repli", slides: [carteVanneRepli("linkedin", ROBERT)] },
  { prefixe: "charge/ig-titre-90-car-12", slides: carrouselArticle({ titre: "Rester muet en groupe : 12 techniques pour reprendre la parole en soirée, au bureau, en famille" }).slice(0, 1) },
  { prefixe: "charge/x-titre-90-car-12", slides: [carteArticleUnique("x", "Rester muet en groupe : 12 techniques pour reprendre la parole en soirée, au bureau, en famille")] },
  { prefixe: "charge/linkedin-titre-90-car-12", slides: [carteArticleUnique("linkedin", "Rester muet en groupe : 12 techniques pour reprendre la parole en soirée, au bureau, en famille")] },
  { prefixe: "charge/ig-titre-1", slides: carrouselArticle({ titre: "Répartie : 1 technique de stand-upper" }).slice(0, 1) },
  { prefixe: "charge/ig-titre-7", slides: carrouselArticle({ titre: "Répartie : 7 techniques de stand-upper" }).slice(0, 1) },
];

async function main() {
  const fonts = await polices();
  const alts: Record<string, string> = {};
  for (const cas of CAS) {
    for (let i = 0; i < cas.slides.length; i++) {
      const s = cas.slides[i];
      const res = new ImageResponse(s.element, { width: s.width, height: s.height, fonts });
      const png = Buffer.from(await res.arrayBuffer());
      const nom = cas.slides.length > 1 ? `${cas.prefixe}-${i + 1}.png` : `${cas.prefixe}.png`;
      await mkdir(dirname(join(OUT, nom)), { recursive: true });
      await writeFile(join(OUT, nom), png);
      alts[nom] = s.alt;
      console.log(`${nom} | ${s.width}×${s.height} | ${png.length} o`);
    }
  }
  await writeFile(join(OUT, "alt.json"), `${JSON.stringify(alts, null, 2)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
