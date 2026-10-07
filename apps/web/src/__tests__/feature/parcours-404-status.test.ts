/**
 * @jest-environment node
 *
 * Non-régression s17 (P2 prod) : /parcours/<slug inconnu> doit répondre 404 avec
 * UNE seule balise robots. Le lot B avait posé parcours/loading.tsx : il enveloppait
 * la page détail dans un Suspense, la réponse partait en 200 (streaming) avant
 * notFound(), et Next ajoutait son `noindex` à celui de generateMetadata.
 */
import fs from "fs";
import path from "path";

const pathFindUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    learningPath: { findUnique: (...a: unknown[]) => pathFindUnique(...a) },
    video: { findMany: jest.fn().mockResolvedValue([]) },
    joke: { findMany: jest.fn().mockResolvedValue([]) },
  },
}));

import ParcoursDetailPage, { generateMetadata } from "@/app/(dashboard)/parcours/[slug]/page";
import { metadata as notFoundMetadata } from "@/app/(dashboard)/parcours/[slug]/not-found";

const APP = path.join(__dirname, "..", "..", "app");
const PARCOURS = path.join(APP, "(dashboard)", "parcours");

describe("/parcours/[slug] inconnu : 404 propre", () => {
  beforeEach(() => pathFindUnique.mockReset());

  it("aucun loading.tsx sur le chemin de [slug] (sinon streaming en 200 avant notFound)", () => {
    const ancetres = [APP, path.join(APP, "(dashboard)"), PARCOURS, path.join(PARCOURS, "[slug]")];
    for (const dir of ancetres) {
      expect(fs.existsSync(path.join(dir, "loading.tsx"))).toBe(false);
      expect(fs.existsSync(path.join(dir, "loading.js"))).toBe(false);
    }
  });

  it("la liste /parcours garde son état de chargement (groupe de routes (liste))", () => {
    expect(fs.existsSync(path.join(PARCOURS, "(liste)", "loading.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(PARCOURS, "(liste)", "page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(PARCOURS, "page.tsx"))).toBe(false);
  });

  it("la page appelle notFound() pour un slug inconnu (base vide)", async () => {
    pathFindUnique.mockResolvedValue(null);
    await expect(ParcoursDetailPage({ params: { slug: "slug-inexistant" } })).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("la page appelle notFound() aussi quand la base est injoignable", async () => {
    pathFindUnique.mockRejectedValue(new Error("base injoignable"));
    await expect(ParcoursDetailPage({ params: { slug: "slug-inexistant" } })).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("generateMetadata n'émet aucune consigne robots pour un slug inconnu (null : ni la sienne ni celle du layout)", async () => {
    pathFindUnique.mockResolvedValue(null);
    expect(await generateMetadata({ params: { slug: "slug-inexistant" } })).toHaveProperty("robots", null);
    pathFindUnique.mockRejectedValue(new Error("base injoignable"));
    expect(await generateMetadata({ params: { slug: "slug-inexistant" } })).toHaveProperty("robots", null);
  });

  it("head de la 404 : not-found.tsx neutralise le robots hérité du layout (seul reste le noindex de Next)", () => {
    expect(notFoundMetadata).toHaveProperty("robots", null);
    expect(notFoundMetadata.title).toBe("Parcours introuvable");
  });

  it("un parcours connu n'appelle pas notFound()", async () => {
    pathFindUnique.mockResolvedValue(null);
    await expect(ParcoursDetailPage({ params: { slug: "repartie" } })).resolves.toBeTruthy();
  });
});
