/**
 * Preuve des 4 images Open Graph (spec @design cycle 8 §1.9) : rend en vrais PNG,
 * via `next/og` (moteur de production) et les TTF de public/fonts/, les gabarits
 * que servent `/opengraph-image`, `/quiz-humour/…`, `/blog/[slug]/…`, `/vannes/[slug]/…`.
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-og.ts [dossier de sortie]
 * Sortie par défaut : docs/social/visuels-s15/og/. Pour chaque cas : `<nom>.png` (1200×630),
 * `<nom>-x358.png` (largeur de la carte X mobile) et `mesures.json` (corps, lignes,
 * dernière rangée d'encre du bloc, écart au pied, zone bas gauche, bord droit du pied).
 * Textes : titres et vannes réels (catalogue validé), sauf les titres de 100 et 140 caractères
 * (cas limites construits pour le test, jamais publiés). Aucune lecture ni écriture en base.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, resolve } from "path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { enregistrerPolice } from "../src/lib/social/mesure-texte";
import { blogCategoryLabel } from "../src/lib/blog-labels";
import {
  OgAccueil,
  OgArticle,
  OgQuiz,
  OgVanne,
  composerTitreOg,
  corpsVanneOg,
} from "../src/lib/social/templates/cartes-og";

const OUT = resolve(process.argv[2] ?? join(process.cwd(), "..", "..", "docs", "social", "visuels-s15", "og"));
const W = 1200;
const H = 630;
const FOND = [0x0d, 0x0d, 0x0d];

const POLICES = [
  { name: "Inter", weight: 400, file: "Inter-Regular.ttf" },
  { name: "Inter", weight: 700, file: "Inter-Bold.ttf" },
  { name: "Inter", weight: 800, file: "Inter-ExtraBold.ttf" },
  { name: "Plus Jakarta Sans", weight: 700, file: "PlusJakartaSans-Bold.ttf" },
  { name: "Plus Jakarta Sans", weight: 800, file: "PlusJakartaSans-ExtraBold.ttf" },
] as const;

const TITRE_100 =
  "Comment répondre avec humour à un collègue qui te coupe la parole en réunion : 12 répliques testées.";
// Relecture @design cycle 9, C3 : seul cas où le titre est coupé au mot, « … » rendu.
const TITRE_140 =
  "Comment répondre avec humour à un collègue qui te coupe la parole en réunion sans passer pour le relou de service : 12 répliques à recycler.";

type Cas = { nom: string; element: () => ReactElement; detail: () => Record<string, unknown> };

const article = (titre: string, categorie?: string): Pick<Cas, "element" | "detail"> => {
  const etiquette = categorie ? blogCategoryLabel(categorie) : undefined;
  return {
    element: () => OgArticle({ titre, etiquette }),
    detail: () => ({ titre, etiquette: etiquette ?? null, ...composerTitreOg(titre, Boolean(etiquette)), longueur: [...titre].length }),
  };
};
const vanne = (content: string, punchline: string): Pick<Cas, "element" | "detail"> => ({
  element: () => OgVanne({ content, punchline }),
  detail: () => ({ content, punchline, corps: corpsVanneOg(content, punchline) }),
});

const CAS: Cas[] = [
  { nom: "accueil", element: () => OgAccueil(), detail: () => ({}) },
  { nom: "quiz", element: () => OgQuiz(), detail: () => ({}) },
  // Relais LinkedIn du 13/10 : titre de docs/copy/articles-q4/S2-se-presenter-avec-humour.md (metaTitle en base non relu).
  { nom: "article-se-presenter", ...article("Se présenter avec humour : 5 accroches qui passent", "PRATIQUE") },
  { nom: "article-halloween", ...article("Blagues d'Halloween : 8 vannes pour ta soirée déguisée", "CATALOGUE") },
  { nom: "article-pilier", ...article("Comment devenir drôle : 5 piliers et un plan sur 30 jours", "GUIDE") },
  { nom: "article-100-car", ...article(TITRE_100, "PRATIQUE") },
  { nom: "article-140-car", ...article(TITRE_140, "PRATIQUE") },
  { nom: "article-repli", ...article("Le blog humour et répartie") },
  // Catalogue validé : cs14jk9cc844b92fde69e845 (1re personne), cs14jkefbc9f40abb6f8a2ca (3e personne).
  { nom: "vanne-courte-1re-personne", ...vanne("J'ai pris un chien pour me faire des amis.", "Il en a plein. Moi, je tiens la laisse.") },
  { nom: "vanne-3e-personne", ...vanne("Notre chef a offert à chacun un mug « meilleur collègue du monde ». On est quatorze.", "Depuis, on se surveille.") },
  // Plus longue vanne du catalogue (cs14jk7cac6246ac112b5afc, 223 caractères).
  {
    nom: "vanne-longue",
    ...vanne(
      "Ma mère dit que je ne lui donne plus de nouvelles depuis que j'ai quitté Facebook. On s'est parlé deux fois cette semaine.",
      "Elle a répondu : « oui, mais je n'ai pas pu mettre de like ».",
    ),
  },
  // Vanne introuvable ou base en erreur : la route rend la carte de marque (relecture @design cycle 9, C1).
  { nom: "vanne-repli", element: () => OgAccueil(), detail: () => ({ repli: "vanne introuvable ou base en erreur : carte de marque" }) },
  // Vanne de 400 caractères (cas limite construit) : ne tient pas à 36 px, carte de marque.
  { nom: "vanne-400-car-repli-marque", ...vanne("Mon collègue raconte ses vacances. ".repeat(8).trim(), "Ça fait deux heures. On en est à l'aéroport. ".repeat(3).trim()) },
];

function estEncre(d: Buffer, x: number, y: number): boolean {
  const i = (y * W + x) * 4;
  return Math.abs(d[i] - FOND[0]) + Math.abs(d[i + 1] - FOND[1]) + Math.abs(d[i + 2] - FOND[2]) > 24;
}

async function mesurer(png: Buffer) {
  const { data } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let encreBloc = -1;
  for (let y = 0; y < 510; y++) for (let x = 0; x < W; x++) if (estEncre(data, x, y)) { encreBloc = y; break; }
  let encreBasGauche = 0;
  for (let y = 550; y < H; y++) for (let x = 0; x < 360; x++) if (estEncre(data, x, y)) encreBasGauche++;
  let bordDroitPied = -1;
  for (let y = 510; y < 574; y++) for (let x = W - 1; x > bordDroitPied; x--) if (estEncre(data, x, y)) { bordDroitPied = x; break; }
  let fondUni = true;
  for (const [x, y] of [[5, 5], [1195, 5], [5, 625], [1195, 625], [600, 3]]) if (estEncre(data, x, y)) fondUni = false;
  return { derniereRangeeEncreBloc: encreBloc, ecartAuPied: 510 - encreBloc, pixelsEncreBasGauche: encreBasGauche, bordDroitPied, fondUni };
}

async function main() {
  const fonts = await Promise.all(POLICES.map(async (p) => {
    const b = await readFile(join(process.cwd(), "public", "fonts", p.file));
    const data = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
    enregistrerPolice(p.name, p.weight, data);
    return { name: p.name, weight: p.weight, style: "normal" as const, data };
  }));
  await mkdir(OUT, { recursive: true });
  const mesures: Record<string, unknown> = {};
  for (const c of CAS) {
    const res = new ImageResponse(c.element(), { width: W, height: H, fonts });
    const png = Buffer.from(await res.arrayBuffer());
    await writeFile(join(OUT, `${c.nom}.png`), png);
    await sharp(png).resize({ width: 358 }).png().toFile(join(OUT, `${c.nom}-x358.png`));
    const meta = await sharp(png).metadata();
    mesures[c.nom] = { largeur: meta.width, hauteur: meta.height, ...c.detail(), ...(await mesurer(png)) };
    console.log(`${c.nom}.png`, JSON.stringify(mesures[c.nom]));
  }
  await writeFile(join(OUT, "mesures.json"), `${JSON.stringify(mesures, null, 2)}\n`, "utf-8");
  console.log(`Sortie : ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
