/**
 * Rendu local des cartes « piste A » v4 en vrais PNG, via `next/og`
 * (ImageResponse), le même moteur que la production sous Cloudflare
 * Workers, avec les TTF de public/fonts/ (Inter + Plus Jakarta Sans).
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts
 * Sortie : docs/social/visuels-s15/v4/*.png (+ charge/ : tests de charge)
 * et alt.json (texte alternatif de chaque image).
 *
 * Textes figés : docs/social/strategie-relance-v5.md §8, gagnants de
 * docs/social/duels-resultat-cycle5.md (textes de duels-aveugle-cycle5.md).
 * Aucune publication.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { ImageResponse } from "next/og";
import {
  carrouselVanne,
  carrouselRelais,
  carrouselDecryptage,
  carrouselConseil,
  carteArticleUnique,
  defautsLegende,
  type Slide,
} from "../src/lib/social/carrousel-piste-a";
import { enregistrerPolice } from "../src/lib/social/mesure-texte";

const OUT = join(process.cwd(), "..", "..", "docs", "social", "visuels-s15", "v4");

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

const SE_PRESENTER = "Se présenter avec humour : 5 accroches qui passent";
const TITRE_LONG = "Rester muet en groupe : 12 techniques pour reprendre la parole en soirée, au bureau, en famille";

/** Légendes Instagram (v5 §8), contrôlées avant rendu (80 caractères, « À envoyer à »). */
const LEGENDES: Record<string, string> = {
  "ig1-tuteur": "À envoyer à ton tuteur de stage. deviens-marrant.fr",
  "ig2-mimes": "À envoyer à qui a un tour de table demain. Les 4 autres exemples : lien en bio.",
  "ig3-anniv-de-lea": "À envoyer à celui qui n'est jamais sûr d'être invité. deviens-marrant.fr",
  "ig-relais-blagues-ia": "À envoyer à qui t'a fait lire son roman. Les 5 autres vannes : lien en bio.",
  "ig-halloween-date": "À envoyer à qui a un date pour Halloween. deviens-marrant.fr",
};

const CAS: Array<{ prefixe: string; slides: Slide[] }> = [
  // IG1, mar. 27/10 : JOKE cs14jke5d015b07714055538 (tuteur)
  {
    prefixe: "ig1-tuteur",
    slides: carrouselVanne({
      amorce: "Mon tuteur a lu mon rapport de stage. Il m'a dit “les remerciements sont très bien”.",
      chute: ["Ils sont en page 2. Le rapport commence page 3."],
    }),
  },
  // IG2, lun. 12/10 : gagnant A du duel (mimes), relais de se-presenter-avec-humour
  {
    prefixe: "ig2-mimes",
    slides: carrouselRelais({
      amorce: "Au jeu de mimes, ma carte disait “la timidité”.",
      chute: ["J'avais à peine bougé qu'ils avaient trouvé."],
    }),
  },
  // IG3, mer. 14/10 : gagnant A du duel (Anniv de Léa), décryptage 4 cartes
  {
    prefixe: "ig3-anniv-de-lea",
    slides: carrouselDecryptage({
      // Lignes imposées (@reviewer cycle 4) : « sans moi. » groupé, « J'ai boudé trois jours. » seul sur sa ligne.
      amorce: "J'ai découvert que\nmes potes avaient\nun groupe sans moi.\nJ'ai boudé trois jours.",
      chute: ["Il s'appelait “Anniv de Léa”. Léa, c'est moi."],
      mecanisme:
        "Pourquoi ça fait rire : celui qui boude trois jours est l'invité d'honneur, et la preuve se trouvait dans le titre du groupe.",
      consigne:
        "À toi de jouer : repense à un moment où tu t'es cru mis de côté, puis cherche le détail qui prouvait le contraire.",
      renvoi: "Le quiz est dans le lien de la bio.",
    }),
  },
  // Relais d'article Instagram, lun. 26/10 : blagues-sur-l-ia-assistants-vocaux, IG n°4 cs14jke6736001250d3a940d
  {
    prefixe: "ig-relais-blagues-ia",
    slides: carrouselRelais({
      amorce: "J'ai demandé à l'IA un avis honnête sur mon manuscrit. Elle a répondu « passionnant ».",
      chute: ["C'est le mot de ma mère. Je cherche quelqu'un qui me déteste."],
    }),
  },
  // Halloween, ven. 30/10 : IG cs14jk1bc86d3502a2cef27b, carte vanne sans lien (v5 §8)
  {
    prefixe: "ig-halloween-date",
    slides: carrouselVanne({
      amorce: "Pour Halloween, j'ai proposé à mon date qu'on se déguise en couple.",
      chute: ["Elle a dit “ne va pas trop vite”."],
    }),
  },
  // Couverture d'article LinkedIn (option : LinkedIn est en texte seul par défaut, v5 §8)
  { prefixe: "linkedin-article-se-presenter", slides: [carteArticleUnique("linkedin", SE_PRESENTER)] },
  // ─── Tests de charge (textes de test, non publiables) ───
  { prefixe: "charge/x-titre-95-car", slides: [carteArticleUnique("x", TITRE_LONG)] },
  { prefixe: "charge/linkedin-titre-95-car", slides: [carteArticleUnique("linkedin", TITRE_LONG)] },
  { prefixe: "charge/x-titre-stand-upper", slides: [carteArticleUnique("x", "Répartie : 7 techniques de stand-upper")] },
  {
    prefixe: "charge/ig-conseil",
    slides: carrouselConseil({
      titreConseil: "L'ironie bienveillante",
      situation: "Ton pote arrive avec 45 minutes de retard.",
      replique: ["Pile à l'heure.", "Le serveur commençait à croire qu'on t'avait inventé."],
      principe:
        "L'ironie bienveillante consiste à dire le contraire de ce que tu penses, mais de façon tellement évidente que ça fait rire sans piquer.",
    }, "linkedin"),
  },
];

async function main() {
  for (const [cle, legende] of Object.entries(LEGENDES)) {
    const d = defautsLegende(legende);
    if (d.length) throw new Error(`Légende ${cle} : ${d.join(", ")}`);
    console.log(`légende ${cle} : ${[...legende].length} caractères`);
  }
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
      if (!nom.startsWith("charge/")) alts[nom] = s.alt;
      console.log(`${nom} | ${s.width}×${s.height} | ${png.length} o`);
    }
  }
  await writeFile(join(OUT, "alt.json"), `${JSON.stringify(alts, null, 2)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
