/** @jest-environment node */
/**
 * s15 (11/10) : routes Open Graph de l'accueil, du quiz et des vannes (spec @design
 * cycle 8 §1) : polices passées à ImageResponse, 1200×630, vanne jamais tronquée,
 * replis si la vanne est introuvable, trop longue ou si la base est en erreur.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { enregistrerPolice } from "@/lib/social/mesure-texte";

jest.mock("next/og", () => ({
  ImageResponse: class {
    element: ReactElement;
    options: Record<string, unknown>;
    constructor(element: ReactElement, options: Record<string, unknown>) {
      this.element = element;
      this.options = options;
    }
  },
}));
jest.mock("@/lib/social/polices", () => ({
  getFonts: jest.fn().mockResolvedValue([{ name: "Plus Jakarta Sans", weight: 800 }]),
}));
jest.mock("@/lib/prisma", () => ({
  prisma: { joke: { findMany: jest.fn() } },
}));

import Accueil from "@/app/opengraph-image";
import Quiz from "@/app/(dashboard)/quiz-humour/opengraph-image";
import Vanne from "@/app/(dashboard)/vannes/[slug]/opengraph-image";
import { prisma } from "@/lib/prisma";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { OgAccueil } from "@/lib/social/templates/cartes-og";

beforeAll(() => {
  for (const [poids, f] of [[700, "PlusJakartaSans-Bold.ttf"], [800, "PlusJakartaSans-ExtraBold.ttf"]] as const) {
    const b = readFileSync(join(process.cwd(), "public", "fonts", f));
    enregistrerPolice("Plus Jakarta Sans", poids, b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  }
});

type Rendu = { element: ReactElement; options: Record<string, unknown> };
const html = (el: ReactElement) => renderToStaticMarkup(el);
const texte = (el: ReactElement) =>
  html(el)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[\s   ]+/g, " ")
    .replace(/ ([.,…’])/g, "$1")
    .replace(/’ /g, "’")
    // trait d'union rendu en segment Inter séparé (segmentsLigne) : on recolle
    .replace(/ - /g, "-");

const findMany = prisma.joke.findMany as jest.Mock;
const joke = (content: string, punchline: string) => ({ id: "cs14jk7cac6246ac112b5afc", content, punchline });
const slug = (j: { id: string; content: string }) => buildJokeSlug(j);

describe("routes Open Graph accueil et quiz", () => {
  it.each([["accueil", Accueil], ["quiz", Quiz]] as const)("%s : polices passées, 1200×630, fond uni", async (_n, Route) => {
    const img = (await Route()) as unknown as Rendu;
    expect(img.options).toMatchObject({ width: 1200, height: 630, fonts: [{ name: "Plus Jakarta Sans", weight: 800 }] });
    const h = html(img.element);
    expect(h).toContain("#0D0D0D");
    expect(h).not.toContain("linear-gradient");
  });

  it("quiz : plus de « gratuit » ni d'emojis, sous-ligne « sans inscription »", async () => {
    const img = (await Quiz()) as unknown as Rendu;
    const t = texte(img.element);
    expect(t).not.toMatch(/gratuit/i);
    expect(t).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(t).toContain("Quel type d’humour es-tu ?");
    expect(t).toContain("sans inscription.");
  });
});

describe("route Open Graph des vannes", () => {
  beforeEach(() => findMany.mockReset());

  it("vanne longue du catalogue : amorce et chute entières, jamais « ... »", async () => {
    const j = joke(
      "Ma mère dit que je ne lui donne plus de nouvelles depuis que j'ai quitté Facebook. On s'est parlé deux fois cette semaine.",
      "Elle a répondu : « oui, mais je n'ai pas pu mettre de like ».",
    );
    findMany.mockResolvedValue([j]);
    const img = (await Vanne({ params: { slug: slug(j) } })) as unknown as Rendu;
    expect(img.options).toMatchObject({ width: 1200, height: 630 });
    const t = texte(img.element);
    expect(t).toContain("On s’est parlé deux fois cette semaine.");
    expect(t).toContain("je n’ai pas pu mettre de like");
    expect(t).not.toContain("...");
    expect(t).not.toContain("→");
    expect(t).not.toMatch(/Vanne ·/);
  });

  it("vanne trop longue pour 36 px : carte de marque, jamais un texte coupé", async () => {
    const j = joke("Mon collègue raconte ses vacances. ".repeat(8).trim(), "Ça fait deux heures. On en est à l'aéroport. ".repeat(3).trim());
    findMany.mockResolvedValue([j]);
    const img = (await Vanne({ params: { slug: slug(j) } })) as unknown as Rendu;
    expect(html(img.element)).toBe(html(<OgAccueil />));
  });

  it("base en erreur : repli « Une vanne à ressortir ce soir », pas d'erreur", async () => {
    findMany.mockRejectedValue(new Error("base indisponible"));
    const img = (await Vanne({ params: { slug: "une-vanne-cs14jk7c" } })) as unknown as Rendu;
    expect(texte(img.element)).toContain("Une vanne à ressortir ce soir");
  });
});
