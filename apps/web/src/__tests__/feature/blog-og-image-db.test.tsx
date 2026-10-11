/** @jest-environment node */
/**
 * s15 (06/10) : l'image Open Graph d'un article EN BASE affichait « Article introuvable »
 * (carte X du relais Halloween). Elle doit utiliser la même résolution que la page.
 * s15 (11/10) : gabarit OgArticle (spec @design cycle 8 §1) ; le texte est lu sur le
 * balisage rendu (les composants ne sont plus visibles dans `props.children`).
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
jest.mock("@/lib/blog-article-page", () => ({
  findBlogArticle: jest.fn(),
}));
jest.mock("@/lib/social/polices", () => ({
  getFonts: jest.fn().mockResolvedValue([]),
}));

import OgImage from "@/app/(dashboard)/blog/[slug]/opengraph-image";
import { findBlogArticle } from "@/lib/blog-article-page";
import { getFonts } from "@/lib/social/polices";

// Mêmes polices que le rendu : la mise en lignes mesure les vrais glyphes.
beforeAll(() => {
  for (const [poids, f] of [[700, "PlusJakartaSans-Bold.ttf"], [800, "PlusJakartaSans-ExtraBold.ttf"]] as const) {
    const b = readFileSync(join(process.cwd(), "public", "fonts", f));
    enregistrerPolice("Plus Jakarta Sans", poids, b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  }
});

type Rendu = { element: ReactElement; options: Record<string, unknown> };

/** Texte visible, espaces insécables normalisées (même normalisation que cartes-piste-a.test.tsx). */
const texte = (el: ReactElement) =>
  renderToStaticMarkup(el)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[\s   ]+/g, " ")
    .replace(/ ([.,…’])/g, "$1")
    .replace(/’ /g, "’");

describe("opengraph-image des articles du blog", () => {
  it("article en base : titre réel, jamais « Article introuvable »", async () => {
    (findBlogArticle as jest.Mock).mockResolvedValue({
      article: { title: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée", category: "CATALOGUE" },
      isVisible: true,
    });
    const img = (await OgImage({ params: { slug: "blagues-halloween-soiree-deguisee" } })) as unknown as Rendu;
    const t = texte(img.element);
    expect(t).toContain("Blagues d’Halloween : 8 vannes pour ta soirée déguisée");
    expect(t).not.toContain("Article introuvable");
    expect(t).not.toContain("CATALOGUE");
    // Libellé lisible (rendu en capitales par CSS, jamais le code interne).
    expect(t).toContain("Catalogue");
    // Jamais les articles programmés : findBlogArticle appelé sans includeScheduled.
    expect(findBlogArticle).toHaveBeenLastCalledWith("blagues-halloween-soiree-deguisee");
  });

  it("polices chargées avant la composition et passées à ImageResponse, taille 1200×630", async () => {
    (findBlogArticle as jest.Mock).mockResolvedValue(null);
    const img = (await OgImage({ params: { slug: "inconnu" } })) as unknown as Rendu;
    expect(getFonts).toHaveBeenCalled();
    expect(img.options).toMatchObject({ width: 1200, height: 630, fonts: [] });
  });

  it("article absent ou base en erreur : libellé du blog, pas d'erreur", async () => {
    (findBlogArticle as jest.Mock).mockRejectedValue(new Error("base indisponible"));
    const img = (await OgImage({ params: { slug: "inconnu" } })) as unknown as Rendu;
    const t = texte(img.element);
    expect(t).toContain("Le blog humour et répartie");
    expect(t).not.toContain("Article introuvable");
  });

  it("titre en base très long : affiché entier, jamais « ... »", async () => {
    const titre = "Comment répondre avec humour à un collègue qui te coupe la parole en réunion : 12 répliques testées.";
    (findBlogArticle as jest.Mock).mockResolvedValue({ article: { title: titre, category: "PRATIQUE" }, isVisible: true });
    const img = (await OgImage({ params: { slug: "long" } })) as unknown as Rendu;
    const t = texte(img.element);
    expect(t).toContain("12 répliques testées.");
    expect(t).not.toContain("...");
    expect(t).not.toContain("…");
  });
});
