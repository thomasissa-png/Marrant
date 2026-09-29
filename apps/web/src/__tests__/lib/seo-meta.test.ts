/**
 * Passe SEO finale s11 — helpers de métadonnées + garde-fous blog.
 */
import { fitDescription, fitTitle, stripMarkdown, truncateAtWord, SITE_SUFFIX } from "@/lib/seo-meta";
import { blogArticles } from "@/lib/blog-articles";
import { UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import rewrites from "@/data/blog-article-rewrites.json";

describe("fitTitle", () => {
  it("garde le template (marque) quand titre + suffixe ≤ 60", () => {
    expect(fitTitle("Timing humour : le secret de la blague")).toBe("Timing humour : le secret de la blague");
  });

  it("passe en absolute (titre = H1 exact) quand titre + suffixe > 60 mais titre ≤ 60", () => {
    const t = "Comment faire rire une fille : 7 techniques";
    expect(t.length + SITE_SUFFIX.length).toBeGreaterThan(60);
    expect(fitTitle(t)).toEqual({ absolute: t });
  });

  it("ne produit jamais « ... » et coupe à la frontière de mot au-delà de 60", () => {
    const t = "Rester muet en groupe : 7 techniques pour reprendre la parole ce soir";
    const out = fitTitle(t) as { absolute: string };
    expect(out.absolute.length).toBeLessThanOrEqual(60);
    expect(out.absolute).not.toContain("...");
    expect(out.absolute.startsWith("Rester muet en groupe")).toBe(true);
  });
});

describe("fitDescription / truncateAtWord / stripMarkdown", () => {
  it("retire le Markdown", () => {
    expect(stripMarkdown("**Gras** et [lien](/blog/x)\n## Titre")).toBe("Gras et lien Titre");
  });

  it("coupe en fin de phrase si possible, sinon au mot, toujours ≤ 160", () => {
    const long = "Phrase un assez longue pour dépasser le seuil minimal de coupure en fin de phrase, avec quelques mots de plus pour tenir. Deuxième phrase qui déborde largement la limite des cent soixante caractères.";
    const out = fitDescription(long);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith(".")).toBe(true);
    expect(truncateAtWord("un deux trois quatre", 12)).toBe("un deux…");
  });
});

describe("Blog — excerpts / metaDescription (140-160 car.)", () => {
  // Page n°1 SEO : meta description validée « intacte » par Thomas (29/09/2026).
  const FROZEN = new Set(["meilleures-blagues-droles-2026"]);

  it.each(
    blogArticles
      .filter((a) => !UNPUBLISHED_STATIC_SLUGS.has(a.slug) && !FROZEN.has(a.slug))
      .map((a) => [a.slug, a.excerpt] as const),
  )("statique %s", (_slug, excerpt) => {
    expect(excerpt.length).toBeGreaterThanOrEqual(140);
    expect(excerpt.length).toBeLessThanOrEqual(160);
  });

  it.each(
    (rewrites as { rewrites: { slug: string; excerpt?: string; metaDescription?: string }[] }).rewrites.flatMap((r) => [
      [`${r.slug} (excerpt)`, r.excerpt ?? ""],
      [`${r.slug} (metaDescription)`, r.metaDescription ?? ""],
    ]),
  )("réécriture DB %s", (_label, text) => {
    expect(text.length).toBeGreaterThanOrEqual(140);
    expect(text.length).toBeLessThanOrEqual(160);
  });

  it("aucun lien interne d'article vers un slug redirigé", () => {
    const redirected = [...UNPUBLISHED_STATIC_SLUGS];
    for (const a of blogArticles.filter((x) => !UNPUBLISHED_STATIC_SLUGS.has(x.slug))) {
      for (const slug of redirected) {
        expect(a.content).not.toContain(`](/blog/${slug})`);
      }
    }
  });
});
