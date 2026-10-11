/** @jest-environment node */
/**
 * Images Open Graph (spec @design cycle 8 §1.8) : gabarits hors système interdits,
 * polices chargées, aucun texte tronqué, replis.
 */
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { enregistrerPolice, largeurTexte } from "@/lib/social/mesure-texte";
import { FONT_TITRE } from "@/lib/social/templates/carte-marque";
import {
  OgAccueil,
  OgArticle,
  OgQuiz,
  OgVanne,
  composerTitreOg,
  corpsVanneOg,
  couperAuMot,
  LIGNES_TITRE_OG,
  PLANCHER_TITRE_OG,
} from "@/lib/social/templates/cartes-og";

beforeAll(() => {
  for (const [poids, f] of [[700, "PlusJakartaSans-Bold.ttf"], [800, "PlusJakartaSans-ExtraBold.ttf"]] as const) {
    const b = readFileSync(join(process.cwd(), "public", "fonts", f));
    enregistrerPolice("Plus Jakarta Sans", poids, b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  }
});

const html = (el: ReactElement) => renderToStaticMarkup(el);
const texte = (el: ReactElement) =>
  html(el)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/[\s   ]+/g, " ")
    .replace(/ ([.,…’])/g, "$1")
    .replace(/’ /g, "’");

const TITRE_100 = "Comment répondre avec humour à un collègue qui te coupe la parole en réunion : 12 répliques testées.";
const VANNE_400 = ["Mon collègue raconte ses vacances. ".repeat(8).trim(), "Ça fait deux heures. On en est à l'aéroport. ".repeat(3).trim()] as const;
const LONGUE = [
  "Ma mère dit que je ne lui donne plus de nouvelles depuis que j'ai quitté Facebook. On s'est parlé deux fois cette semaine.",
  "Elle a répondu : « oui, mais je n'ai pas pu mettre de like ».",
] as const;

const GABARITS: Array<[string, ReactElement]> = [
  ["accueil", <OgAccueil key="a" />],
  ["quiz", <OgQuiz key="q" />],
  ["article", <OgArticle key="ar" titre="Blagues d'Halloween : 8 vannes pour ta soirée déguisée" etiquette="Catalogue" />],
  ["vanne", <OgVanne key="v" content="J'ai pris un chien pour me faire des amis." punchline="Il en a plein. Moi, je tiens la laisse." />],
];

describe("gabarits Open Graph : identité des cartes", () => {
  it.each(GABARITS)("%s : fond #0D0D0D, Plus Jakarta Sans, aucun reliquat de l'ancien gabarit", (_nom, el) => {
    const h = html(el);
    expect(h).toContain("#0D0D0D");
    expect(h).toContain("Plus Jakarta Sans");
    for (const interdit of ["linear-gradient", "#1a1a2e", "#16213e", "#EC4899", "sans-serif", "background-clip", "—", "→", "..."]) {
      expect(h).not.toContain(interdit);
    }
    expect(h).not.toMatch(/gratuit/i);
    // Aucun emoji (pictogrammes des profils du quiz).
    expect(h).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("pied à droite : monogramme puis domaine, 40 px", () => {
    const h = html(<OgQuiz />);
    expect(h).toMatch(/justify-content:flex-end/);
    expect(h).toContain("deviens-marrant.fr");
    expect(h).toMatch(/font-size:40px[^"]*color:#B3B3B3/);
  });

  it("quiz et accueil : sous-ligne « sans inscription », accent lilas", () => {
    expect(texte(<OgQuiz />)).toContain("Quiz d’humour, sans inscription.");
    expect(texte(<OgAccueil />)).toContain("plus drôle.");
    expect(html(<OgQuiz />)).toContain("#A78BFA");
  });
});

describe("titres d'article : jamais tronqués", () => {
  it("titre de 100 caractères : entier, corps ≥ 48, 3 lignes au plus", () => {
    const t = composerTitreOg(TITRE_100, true);
    expect(t.texte).toBe(TITRE_100);
    expect(t.corps).toBeGreaterThanOrEqual(PLANCHER_TITRE_OG);
    expect(t.lignes.length).toBeLessThanOrEqual(LIGNES_TITRE_OG);
    expect(LIGNES_TITRE_OG).toBe(3);
    expect(texte(<OgArticle titre={TITRE_100} etiquette="Pratique" />)).toContain("12 répliques testées.");
  });

  it("titre Halloween : 64 px, aucune ligne d'un mot, dernière ligne ≥ 40 %", () => {
    const t = composerTitreOg("Blagues d'Halloween : 8 vannes pour ta soirée déguisée", true);
    expect(t.corps).toBe(64);
    const mots = (l: string) => l.split(/[\s   ]+/).filter((m) => m && !/^[:;?!»«“”…,.]+$/.test(m)).length;
    t.lignes.forEach((l) => expect(mots(l)).toBeGreaterThanOrEqual(2));
    const largeurs = t.lignes.map((l) => largeurTexte(l, FONT_TITRE, 800, t.corps));
    expect(largeurs[largeurs.length - 1]).toBeGreaterThanOrEqual(0.4 * Math.max(...largeurs));
  });

  it("couperAuMot coupe à un mot entier, jamais au milieu d'un mot ni par « ... »", () => {
    const c = couperAuMot(TITRE_100, 40);
    expect(c).toBe("Comment répondre avec humour à un…");
    expect(c).not.toContain("...");
    expect(couperAuMot("Court", 40)).toBe("Court");
  });
});

describe("vannes : réduction par paliers, jamais de troncature", () => {
  it("vanne courte : 48 px", () => {
    expect(corpsVanneOg("J'ai pris un chien pour me faire des amis.", "Il en a plein. Moi, je tiens la laisse.")).toBe(48);
  });

  it("vanne longue du catalogue (223 caractères) : corps réduit, texte entier", () => {
    const corps = corpsVanneOg(...LONGUE);
    expect(corps).not.toBeNull();
    expect(corps!).toBeLessThan(48);
    expect(corps!).toBeGreaterThanOrEqual(36);
    const t = texte(<OgVanne content={LONGUE[0]} punchline={LONGUE[1]} />);
    expect(t).toContain("On s’est parlé deux fois cette semaine.");
    expect(t).toContain("je n’ai pas pu mettre de like");
    expect(t).not.toContain("...");
  });

  it("vanne de 400 caractères : null, la route rend la carte de marque", () => {
    expect([...VANNE_400.join("")].length).toBeGreaterThanOrEqual(400);
    expect(corpsVanneOg(...VANNE_400)).toBeNull();
    expect(html(<OgVanne content={VANNE_400[0]} punchline={VANNE_400[1]} />)).toBe(html(<OgAccueil />));
  });

  it("R6 : guillemets à la 1re personne, aucun à la 3e", () => {
    expect(texte(<OgVanne content="J'ai pris un chien pour me faire des amis." punchline="Il en a plein. Moi, je tiens la laisse." />)).toMatch(/«.*»/);
    // Catalogue validé cmmnsqn14003rth6379n30nzd (2e personne, aucun guillemet dans le texte).
    const t = texte(<OgVanne content="En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien." punchline="Il te fait asseoir et baisse la voix." />);
    expect(t).not.toContain("«");
    expect(t).not.toContain("»");
  });
});

describe("polices (polices.ts)", () => {
  it("getFonts renvoie Plus Jakarta Sans 800 et 700, Inter 400 (TTF de public/fonts)", async () => {
    const { getFonts } = await import("@/lib/social/polices");
    const fonts = await getFonts();
    const noms = fonts.map((f) => `${f.name} ${f.weight}`);
    expect(noms).toEqual(expect.arrayContaining(["Plus Jakarta Sans 800", "Plus Jakarta Sans 700", "Inter 400"]));
    fonts.forEach((f) => expect(f.data.byteLength).toBeGreaterThan(10_000));
  });
});
