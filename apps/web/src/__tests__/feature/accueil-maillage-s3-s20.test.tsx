/**
 * Accueil, maillage S3 (docs/seo/maillage-decouverte-s20.md §4, textes validés
 * par Thomas le 12/10) : S3a « N autres parcours » sous les cartes personas,
 * S3b « Derniers articles » (3 articles visibles les plus récents, hors pilier).
 */
import { render, screen, within } from "@testing-library/react";
import { blogArticles } from "@/lib/blog-articles";
import { UNPUBLISHED_STATIC_SLUGS, REDIRECTED_BLOG_SLUGS } from "@/lib/seo-redirects";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { frTypo } from "@/lib/fr-typo";

type Row = { slug: string; title: string; isPublished: boolean; publishedAt: Date | null };
type Where = {
  isPublished: boolean;
  OR: [{ publishedAt: null }, { publishedAt: { lte: Date } }];
  slug: { notIn: string[] };
};

let rows: Row[] = [];
const findMany = jest.fn(async ({ where }: { where: Where }) =>
  rows
    .filter((r) => r.isPublished === where.isPublished)
    .filter((r) => r.publishedAt === null || r.publishedAt.getTime() <= where.OR[1].publishedAt.lte.getTime())
    .filter((r) => !where.slug.notIn.includes(r.slug))
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .map(({ slug, title, publishedAt }) => ({ slug, title, publishedAt })),
);
jest.mock("@/lib/prisma", () => ({ prisma: { blogArticle: { findMany: (a: { where: Where }) => findMany(a) } } }));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));
jest.mock("next/dynamic", () => () => function DynamicStub() { return null; });
jest.mock("@/components/home/hero-section", () => ({ HeroSection: () => null }));
jest.mock("@/components/home/daily-content", () => ({ DailyContent: () => null }));
jest.mock("@/components/home/feature-cards", () => ({ FeatureCards: () => null }));
jest.mock("@/lib/catalogue-pages", () => ({ getHomeFeatureExamples: jest.fn().mockResolvedValue({}) }));
jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsRounded: jest.fn().mockResolvedValue({ jokes: 0, tips: 0, videos: 0 }),
}));
jest.mock("@/components/seo/json-ld", () => ({ JsonLd: () => null, buildFaqJsonLd: () => ({}) }));

import HomePage, { revalidate } from "@/app/(dashboard)/page";
import { AutresParcours, autresParcoursIntro } from "@/components/home/autres-parcours";
import { DerniersArticles } from "@/components/home/derniers-articles";
import { getDerniersArticles, PILIER_SLUG } from "@/lib/derniers-articles";

const NBSP = String.fromCharCode(0xa0);
const NOW = new Date("2026-10-15T10:00:00Z"); // jeudi
const TOUS = [
  { slug: "machine-a-cafe", name: "Machine à Café" },
  { slug: "repartie", name: "Répartie" },
  { slug: "confiance", name: "Confiance" },
  { slug: "storytelling", name: "Storytelling" },
  { slug: "boulot", name: "Boulot" },
];

const row = (slug: string, iso: string | null, isPublished = true): Row => ({
  slug,
  title: `Titre ${slug}`,
  isPublished,
  publishedAt: iso ? new Date(iso) : null,
});

/** Les statiques visibles à NOW, du plus récent au plus ancien, hors pilier. */
function staticsAttendus() {
  const today = NOW.toISOString().slice(0, 10);
  return blogArticles
    .filter((a) => !UNPUBLISHED_STATIC_SLUGS.has(a.slug) && !REDIRECTED_BLOG_SLUGS.includes(a.slug))
    .filter((a) => a.slug !== PILIER_SLUG && a.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

beforeEach(() => {
  rows = [];
  findMany.mockClear();
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe("S3a : autres parcours sous les cartes personas", () => {
  it("0 parcours restant : la ligne n'apparaît pas", () => {
    const { container } = render(<AutresParcours parcours={TOUS.slice(0, 3)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("1 parcours restant : « Un autre parcours : X. »", () => {
    const { container } = render(<AutresParcours parcours={TOUS.slice(0, 4)} />);
    expect(container.textContent).toBe(`Un autre parcours${NBSP}: Parcours Storytelling.`);
    expect(screen.getByRole("link", { name: "Parcours Storytelling" })).toHaveAttribute(
      "href",
      "/parcours/storytelling",
    );
  });

  it("2 parcours restants : texte validé, liens vers la page du parcours (sans ?src, cibles 44 px)", () => {
    const { container } = render(<AutresParcours parcours={TOUS} />);
    expect(container.textContent).toBe(`Deux autres parcours${NBSP}: Parcours Storytelling et Parcours Boulot.`);
    const liens = screen.getAllByRole("link");
    expect(liens.map((l) => l.getAttribute("href"))).toEqual([
      "/parcours/storytelling",
      "/parcours/boulot",
    ]);
    for (const l of liens) expect(l).toHaveClass("inline-flex", "min-h-[44px]", "items-center", "whitespace-nowrap");
  });

  it("3 parcours restants : « Trois autres parcours : X, Y et Z. »", () => {
    const { container } = render(<AutresParcours parcours={TOUS} exclus={["machine-a-cafe", "repartie"]} />);
    expect(container.textContent).toBe(
      `Trois autres parcours${NBSP}: Parcours Confiance, Parcours Storytelling et Parcours Boulot.`,
    );
    for (const l of screen.getAllByRole("link")) expect(l.getAttribute("href")).not.toContain("?");
  });

  it("par défaut : la liste des parcours publiés (PREMIUM_PARCOURS) privée des 3 cartes", () => {
    render(<AutresParcours />);
    const attendus = PREMIUM_PARCOURS.filter((p) => !["machine-a-cafe", "repartie", "confiance"].includes(p.slug));
    expect(screen.queryAllByRole("link").map((l) => l.textContent)).toEqual(attendus.map((p) => `Parcours ${p.name}`));
  });

  it("nombre en lettres", () => {
    expect([1, 2, 3, 4].map(autresParcoursIntro)).toEqual([
      "Un autre parcours",
      "Deux autres parcours",
      "Trois autres parcours",
      "Quatre autres parcours",
    ]);
  });
});

describe("S3b : derniers articles (même source et même filtre que /blog)", () => {
  it("retient les 3 articles visibles les plus récents, pilier et article programmé exclus", async () => {
    rows = [
      row("programme-futur", "2026-10-22T07:00:00Z"), // jeudi suivant : pas encore visible
      row(PILIER_SLUG, "2026-10-14T07:00:00Z"), // pilier en base, plus récent : exclu
      row("publie-ce-matin", "2026-10-15T07:00:00Z"),
      row("brouillon", "2026-10-13T07:00:00Z", false),
      row("lundi", "2026-10-12T07:00:00Z"),
      row("jeudi-dernier", "2026-10-08T07:00:00Z"),
      row("lundi-dernier", "2026-10-05T07:00:00Z"),
      row("ancien-sans-date", null),
    ];
    const articles = await getDerniersArticles(NOW);
    expect(articles.map((a) => a.slug)).toEqual(["publie-ce-matin", "lundi", "jeudi-dernier"]);
    expect(articles[0]).toEqual({ slug: "publie-ce-matin", title: "Titre publie-ce-matin", date: "2026-10-15" });
  });

  it("complète avec les statiques quand la base a moins de 3 articles datés", async () => {
    rows = [row("seul-en-base", "2026-10-12T07:00:00Z")];
    const articles = await getDerniersArticles(NOW);
    expect(articles.map((a) => a.slug)).toEqual(["seul-en-base", ...staticsAttendus().slice(0, 2).map((a) => a.slug)]);
  });

  it("repli sur les articles statiques si la base répond mal, sans erreur", async () => {
    findMany.mockRejectedValueOnce(new Error("connexion refusée"));
    const articles = await getDerniersArticles(NOW);
    expect(articles.map((a) => a.slug)).toEqual(staticsAttendus().slice(0, 3).map((a) => a.slug));
    expect(articles.some((a) => a.slug === PILIER_SLUG)).toBe(false);
  });

  it("un article statique daté du futur n'est pas retenu", async () => {
    findMany.mockRejectedValueOnce(new Error("panne"));
    const plusRecent = staticsAttendus()[0];
    const veille = new Date(`${plusRecent.date}T00:00:00Z`);
    veille.setUTCDate(veille.getUTCDate() - 1);
    const articles = await getDerniersArticles(veille);
    expect(articles.map((a) => a.slug)).not.toContain(plusRecent.slug);
  });

  it("rend 3 liens titres sous le titre « Derniers articles », sans extrait", () => {
    render(
      <DerniersArticles
        articles={[
          { slug: "a", title: "Article A", date: "2026-10-15" },
          { slug: "b", title: "Article B", date: "2026-10-12" },
          { slug: "c", title: "Article C", date: "2026-10-08" },
        ]}
      />,
    );
    const bloc = screen.getByRole("region", { name: "Derniers articles" });
    const liens = within(bloc).getAllByRole("link");
    expect(liens.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["Article A", "/blog/a"],
      ["Article B", "/blog/b"],
      ["Article C", "/blog/c"],
    ]);
    expect(bloc.textContent).toBe("Derniers articlesArticle AArticle BArticle C");
    expect(within(bloc).getByRole("heading", { name: "Derniers articles" })).toHaveClass("text-center");
    for (const l of liens) expect(l).toHaveClass("focus-visible:ring-2", "focus-visible:ring-accent-primary");
  });

  it("titres passés par frTypo : chiffre collé au nom, insécable avant « : »", () => {
    render(<DerniersArticles articles={[{ slug: "p", title: "Pourquoi tes blagues ne marchent pas : 7 raisons concrètes", date: "2026-10-15" }]} />);
    const lien = screen.getByRole("link");
    expect(lien.textContent).toBe(frTypo("Pourquoi tes blagues ne marchent pas : 7 raisons concrètes"));
    expect(lien.textContent).toContain(`7${NBSP}raisons`);
    expect(lien.textContent).toContain(`pas${NBSP}:`);
  });

  it("liste vide : aucun bloc", () => {
    const { container } = render(<DerniersArticles articles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Accueil : placement et revalidation", () => {
  it("S3a entre les cartes et la phrase du pilier ; S3b après la section personas", async () => {
    // La page lit l'heure réelle : article publié il y a une heure.
    rows = [row("publie-ce-matin", new Date(Date.now() - 3_600_000).toISOString())];
    render(await HomePage());
    const section = screen.getByText("Tu te reconnais ?").closest("section") as HTMLElement;
    const ligne = within(section).getByText(/autres? parcours/).closest("p") as HTMLElement;
    const pilier = within(section).getByRole("link", { name: "comment devenir drôle" }).closest("p");
    expect(ligne.nextElementSibling).toBe(pilier);
    const bloc = screen.getByRole("region", { name: "Derniers articles" });
    expect(section.nextElementSibling).toBe(bloc);
    expect(within(bloc).getAllByRole("link")).toHaveLength(3);
    expect(within(bloc).getByRole("link", { name: "Titre publie-ce-matin" })).toHaveAttribute("href", "/blog/publie-ce-matin");
  });

  it("ISR de l'accueil plafonnée à 1 h", () => {
    expect(revalidate).toBe(3600);
  });
});
