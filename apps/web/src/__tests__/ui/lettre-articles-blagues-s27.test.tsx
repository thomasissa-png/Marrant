/**
 * s27 (décision de Thomas du 25/11/2026) : sur les articles « blagues » (catégorie CATALOGUE),
 * la lettre gratuite est le PREMIER appel : au fil du texte après la 1re section, et en fin
 * d'article au-dessus du bloc payant (qui passe en contour). Textes existants (LETTRE_ARTICLE,
 * TEXTES_LETTRE), mesure à part : `blog-lettre-vu` / `blog-lettre-envoi` {slug, position}.
 * Les autres articles ne changent pas.
 */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  LETTRE_INSCRIPTIONS_OUVERTES: true,
}));

let mockSession: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: jest.fn(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/blog",
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn().mockResolvedValue(null) },
    newsletterIssue: { findFirst: jest.fn().mockResolvedValue(null) },
  },
}));

import BlogArticlePage from "@/app/(dashboard)/blog/[slug]/page";
import { BlogArticleView } from "@/components/blog/blog-article-view";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { lettreEnPremierSurArticle } from "@/config/lettre";
import { LETTRE_ARTICLE } from "@/config/textes/cta-articles-accueil";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { placerLettreEnPremier, type EncartPlacement } from "@/lib/blog-encarts";
import { NBSP } from "@/lib/fr-typo";

const sansInsecables = (t: string) => t.split(NBSP).join(" ");
const BOUTON = sansInsecables(TEXTES_LETTRE.formulaire.bouton);
const LABEL = sansInsecables(TEXTES_LETTRE.formulaire.label);
const BLAGUES = "meilleures-blagues-droles-2026";

const track = jest.fn();
type Entry = { isIntersecting: boolean; intersectionRatio: number };
let observerCallback: (entries: Entry[]) => void = () => {};
const fetchMock = jest.fn();

beforeEach(() => {
  mockSession = { data: null, status: "unauthenticated" };
  track.mockClear();
  fetchMock.mockReset();
  window.localStorage.clear();
  (window as unknown as { umami: { track: jest.Mock } }).umami = { track };
  (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: (entries: Entry[]) => void) {
      observerCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const suit = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("critère : catégorie de l'article", () => {
  it("CATALOGUE (cluster « Blagues et vannes à ressortir ») oui, le reste non", () => {
    expect(lettreEnPremierSurArticle("CATALOGUE")).toBe(true);
    for (const c of ["REPARTIE", "GUIDE", "SAISONNIER", "", undefined, null]) expect(lettreEnPremierSurArticle(c)).toBe(false);
  });
});

describe("placerLettreEnPremier", () => {
  const sections = [null, "A", "B", "C", "D"].map((heading) => ({ heading, weight: 100 }));
  const encart = (apresIndex: number): EncartPlacement => ({ apresIndex, position: "milieu-1", parcours: "repartie" });

  it("lettre après la 1re section H2 ; un encart au même endroit descend d'une section", () => {
    expect(placerLettreEnPremier(sections, [encart(1)])).toEqual({ lettreApres: 1, encarts: [encart(2)] });
  });

  it("encart déjà plus bas : inchangé", () => {
    expect(placerLettreEnPremier(sections, [encart(3)])).toEqual({ lettreApres: 1, encarts: [encart(3)] });
  });

  it("pas de place sous la lettre (avant la dernière section) : l'encart est retiré, jamais empilé", () => {
    const courtes = [null, "A", "B"].map((heading) => ({ heading, weight: 100 }));
    expect(placerLettreEnPremier(courtes, [encart(1)])).toEqual({ lettreApres: 1, encarts: [] });
  });

  it("aucune section H2 utilisable : pas de lettre au fil du texte, encarts intacts", () => {
    expect(placerLettreEnPremier([{ heading: null, weight: 10 }], [])).toEqual({ lettreApres: null, encarts: [] });
    expect(placerLettreEnPremier([null, "A"].map((heading) => ({ heading, weight: 1 })), []).lettreApres).toBeNull();
  });
});

function verifierArticleBlagues(container: HTMLElement, slug: string) {
  const blocs = Array.from(container.querySelectorAll<HTMLElement>('[data-lettre="article"]'));
  expect(blocs.map((b) => b.dataset.blogLettrePosition)).toEqual(["milieu", "fin"]);
  const [milieu, fin] = blocs;
  // Au fil du texte : dans le corps, juste après la 1re section H2, avant tout encart.
  const corps = container.querySelector("[data-blog-body]")!;
  expect(corps.contains(milieu)).toBe(true);
  const sections = corps.querySelectorAll("[data-blog-section]");
  expect(milieu.previousElementSibling).toBe(sections[1]);
  const encart = corps.querySelector("[data-demo-vanne]");
  if (encart) expect(suit(milieu, encart)).toBe(true);
  // Fin : juste au-dessus du bloc payant, plus rien après les articles liés.
  const blocFin = container.querySelector<HTMLElement>("[data-blog-bloc-fin]")!;
  expect(fin.nextElementSibling).toBe(blocFin);
  expect(container.querySelector('[data-blog-zone="related"]')!.nextElementSibling?.hasAttribute("data-lettre")).toBeFalsy();
  // Plein sur la lettre de fin, contour sur l'offre payante (lien, libellé et mesure inchangés).
  const payant = blocFin.querySelector<HTMLAnchorElement>('[data-blog-cta="abonnement"]')!;
  expect(payant.getAttribute("href")).toContain(`src=blog-${slug}`);
  expect(payant.className).toMatch(/bg-transparent/);
  const boutons = screen.getAllByRole("button", { name: BOUTON });
  expect(boutons).toHaveLength(2);
  expect(boutons[1].className).not.toBe(boutons[0].className);
  // Textes existants, mot pour mot ; identifiants propres à chaque formulaire.
  expect(screen.getAllByText(sansInsecables(LETTRE_ARTICLE.titre))).toHaveLength(2);
  // Phrase rendue avec « e-mail » insécable (`lierComposes`) : comparée sur le texte des blocs.
  const normal = (t: string) => t.replace(/\u2060/g, "").replace(/[\u00A0\u202F]/g, " ").replace(/\u2011/g, "-");
  for (const b of blocs) expect(normal(b.textContent ?? "")).toContain(normal(LETTRE_ARTICLE.phrase[0]));
  expect(screen.getAllByLabelText(LABEL).map((c) => c.id)).toEqual(["lettre-article-milieu-email", "lettre-article-fin-email"]);
  for (const b of blocs) expect(b.querySelector("[data-blog-cta], [data-blog-cta-position]")).toBeNull();
}

describe("articles « blagues » : la lettre d'abord", () => {
  it.each([BLAGUES, "phrases-droles-conversations"])("%s : milieu + fin au-dessus du bloc payant", async (slug) => {
    const { container } = render(await BlogArticlePage({ params: { slug } }));
    verifierArticleBlagues(container, slug);
  });

  it("article en base (Halloween, CATALOGUE) : même traitement", () => {
    const contenu = ["Intro.", "## Les costumes", "**1.** Vanne un.", "## Les déguisements ratés", "**2.** Vanne deux.", "## En vrai", "Fin."].join("\n\n");
    const article = {
      slug: "blagues-halloween-soiree-deguisee",
      title: "Blagues d'Halloween",
      excerpt: "Vannes",
      content: contenu,
      date: "2026-10-05",
      readingTime: "4 min",
      category: "CATALOGUE",
    };
    const nav = { cluster: undefined, nextArticle: null, prevArticle: null, relatedArticles: [] };
    const { container } = render(<BlogArticleView article={article} navigation={nav} />);
    expect(Array.from(container.querySelectorAll<HTMLElement>("[data-lettre]")).map((b) => b.dataset.blogLettrePosition)).toEqual(["milieu", "fin"]);
  });

  it("abonné Premium : aucune lettre, bloc de fin abonné inchangé", async () => {
    mockSession = { data: { user: { email: "p@x.fr", plan: "PREMIUM" } }, status: "authenticated" };
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
    const { container } = render(await BlogArticlePage({ params: { slug: BLAGUES } }));
    expect(container.querySelector("[data-lettre]")).toBeNull();
    expect(container.querySelector('[data-blog-cta="parcours"]')).not.toBeNull();
  });
});

describe("autres articles : rien ne change", () => {
  it("comment-avoir-de-la-repartie : une lettre après les articles liés, plein payant", async () => {
    const { container } = render(await BlogArticlePage({ params: { slug: "comment-avoir-de-la-repartie" } }));
    const blocs = container.querySelectorAll<HTMLElement>("[data-lettre]");
    expect(blocs).toHaveLength(1);
    expect(blocs[0].hasAttribute("data-blog-lettre-position")).toBe(false);
    expect(container.querySelector('[data-blog-zone="related"]')!.nextElementSibling).toBe(blocs[0]);
    expect(container.querySelector("[data-blog-body] [data-lettre]")).toBeNull();
    const payant = container.querySelector<HTMLElement>('[data-blog-cta="abonnement"]')!;
    expect(payant.className).not.toMatch(/bg-transparent/);
  });
});

describe("mesure Umami distincte", () => {
  it("blog-lettre-vu {slug, position} en plus de lettre-vu, une fois", () => {
    render(<LettreInscription emplacement="article" slug={BLAGUES} textes={LETTRE_ARTICLE} positionBlog="milieu" />);
    act(() => observerCallback([{ isIntersecting: true, intersectionRatio: 0.6 }]));
    act(() => observerCallback([{ isIntersecting: true, intersectionRatio: 1 }]));
    expect(track.mock.calls).toEqual([
      ["lettre-vu", { emplacement: "article", slug: BLAGUES, position: "milieu" }],
      ["blog-lettre-vu", { slug: BLAGUES, position: "milieu" }],
    ]);
  });

  it("blog-lettre-envoi {slug, position} ; l'API reçoit la même source qu'avant (article + slug)", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });
    render(<LettreInscription emplacement="article" slug={BLAGUES} textes={LETTRE_ARTICLE} positionBlog="fin" boutonPlein />);
    fireEvent.change(screen.getByLabelText(LABEL), { target: { value: "yanis@exemple.fr" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    expect(track).toHaveBeenCalledWith("lettre-envoi", { emplacement: "article", slug: BLAGUES, position: "fin" });
    expect(track).toHaveBeenCalledWith("blog-lettre-envoi", { slug: BLAGUES, position: "fin" });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const corps = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(corps).toMatchObject({ emplacement: "article", slug: BLAGUES });
    expect(corps).not.toHaveProperty("position");
  });

  it("sans position (autres articles) : aucun événement blog-lettre-*", () => {
    render(<LettreInscription emplacement="article" slug="comment-avoir-de-la-repartie" textes={LETTRE_ARTICLE} />);
    act(() => observerCallback([{ isIntersecting: true, intersectionRatio: 1 }]));
    expect(track.mock.calls).toEqual([["lettre-vu", { emplacement: "article", slug: "comment-avoir-de-la-repartie" }]]);
  });
});
