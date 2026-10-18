/**
 * Audit conversion s20 (lots 0-1) : mesure des encarts d'article et exclusion du trafic interne.
 * - blog-cta-vu {slug, position, parcours} : une fois par encart, visible à 50 % ou plus ;
 * - blog-cta-clic {slug, bouton, position, parcours} ;
 * - ?ne-pas-compter=1 / ?compter=1 : localStorage « umami.disabled », sans casse si stockage indisponible.
 */
import { act, fireEvent, render } from "@testing-library/react";
import { BlogArticleTracking, linkZone } from "@/components/blog/blog-article-tracking";
import { BlogArticleBody } from "@/components/blog/blog-article-body";
import { ArticleCta } from "@/components/blog/article-cta";
import { buildUmamiBeforeSendScript } from "@/lib/umami-before-send";
import { BLOC_FIN, DEMO_VANNE } from "@/config/textes/cta-articles-accueil";
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { normalise } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
// s21 : l'encart du milieu montre la fiche offerte du carnet du mois (DemoVanne).
jest.mock("@/lib/carnet", () => jest.requireActual("../helpers/carnet-octobre").mockCarnetOctobre());

const SLUG = "meilleures-blagues-droles-2026";
const CONTENT = [
  "Intro.",
  "## Quelles blagues sortir en soirée ? (celles qui marchent à partir de 22h)",
  "Texte soirée.",
  "## Quelles blagues au bureau ? (le lundi matin est un sport de combat)",
  "Texte bureau, voir [la machine à café](/blog/machine).",
  "## Comment faire rire en date ?",
  "Texte date.",
].join("\n\n");

type Entry = { target: Element; isIntersecting: boolean; intersectionRatio: number };
let observerCallback: (entries: Entry[]) => void = () => {};
const observed: Element[] = [];
const track = jest.fn();

beforeEach(() => {
  track.mockClear();
  observed.length = 0;
  (window as unknown as { umami: { track: jest.Mock } }).umami = { track };
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: (entries: Entry[]) => void) {
      observerCallback = cb;
    }
    observe(el: Element) {
      observed.push(el);
    }
    unobserve() {}
    disconnect() {}
  };
});

function setup() {
  return render(
    <BlogArticleTracking slug={SLUG}>
      <BlogArticleBody slug={SLUG} category="CATALOGUE" content={CONTENT} />
      <ArticleCta parcours="repartie" src={`blog-${SLUG}`} />
    </BlogArticleTracking>,
  );
}

describe("blog-cta-vu", () => {
  it("observe les 2 encarts (s21 : plus de milieu-2) ; un envoi par position, seulement à 50 % visible", () => {
    setup();
    expect(observed.map((el) => (el as HTMLElement).dataset.blogCtaPosition)).toEqual(["milieu-1", "fin"]);
    const [m1, fin] = observed;
    act(() => observerCallback([{ target: m1, isIntersecting: true, intersectionRatio: 0.3 }]));
    expect(track).not.toHaveBeenCalled();
    act(() => observerCallback([{ target: m1, isIntersecting: true, intersectionRatio: 0.6 }]));
    act(() => observerCallback([{ target: m1, isIntersecting: true, intersectionRatio: 1 }]));
    act(() => observerCallback([{ target: fin, isIntersecting: true, intersectionRatio: 0.9 }]));
    expect(track.mock.calls).toEqual([
      ["blog-cta-vu", { slug: SLUG, position: "milieu-1", parcours: "repartie", fiche: "2026-10-15" }],
      ["blog-cta-vu", { slug: SLUG, position: "fin", parcours: "repartie" }],
    ]);
  });
});

describe("blog-cta-clic", () => {
  it("position et parcours de l'encart cliqué", () => {
    const { getByText, getAllByText } = setup();
    // s21 (B1) : `blog-cta="demo-fiche"` sur le bouton de la démonstration.
    fireEvent.click(getByText(DEMO_VANNE.bouton));
    // s21 (B2) : plein de l'étape 1 puis lien payant du bloc de fin.
    const finEtape1 = getAllByText(TEXTES_PARCOURS_BLOG.repartie.finBoutonEtape1).find((el) =>
      el.closest("a")?.getAttribute("href")?.includes("?src=blog#"),
    );
    expect(finEtape1).toBeDefined();
    fireEvent.click(finEtape1!);
    fireEvent.click(getByText(normalise(BLOC_FIN.lienAbonnement)));
    expect(track.mock.calls).toEqual([
      ["blog-cta-clic", { slug: SLUG, bouton: "demo-fiche", position: "milieu-1", parcours: "repartie", fiche: "2026-10-15" }],
      ["blog-cta-clic", { slug: SLUG, bouton: "etape-1", position: "fin", parcours: "repartie" }],
      ["blog-cta-clic", { slug: SLUG, bouton: "abonnement", position: "fin", parcours: "repartie" }],
    ]);
  });

  it("corps découpé : un lien de section garde l'id de son H2", () => {
    const { getByText } = setup();
    const link = getByText("la machine à café") as HTMLAnchorElement;
    expect(linkZone(link)).toEqual({
      zone: "section",
      section: "quelles-blagues-au-bureau-le-lundi-matin-est-un-sport-de-combat",
    });
  });
});

describe("exclusion du trafic interne", () => {
  type Filter = (type: string, payload: { url?: string }) => unknown;
  const load = (path: string): Filter => {
    window.history.pushState({}, "", path);
    new Function(buildUmamiBeforeSendScript("/blog/apercu"))();
    return (window as unknown as { marrantUmamiBeforeSend: Filter }).marrantUmamiBeforeSend;
  };
  afterEach(() => window.localStorage.clear());

  it("?ne-pas-compter=1 pose umami.disabled et coupe tout envoi ; ?compter=1 l'enlève", () => {
    expect(load("/?ne-pas-compter=1")("event", { url: "/" })).toBe(false);
    expect(window.localStorage.getItem("umami.disabled")).toBe("1");
    expect(load("/blog")("event", { url: "/blog" })).toBe(false);
    const filter = load("/blog?compter=1");
    expect(window.localStorage.getItem("umami.disabled")).toBeNull();
    expect(filter("event", { url: "/blog?compter=1&utm_source=x" })).toMatchObject({ url: "/blog?utm_source=x" });
  });

  it("stockage indisponible : aucune erreur, l'envoi continue", () => {
    const spy = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    const set = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(() => load("/?ne-pas-compter=1")).not.toThrow();
    expect(load("/vannes")("event", { url: "/vannes" })).toMatchObject({ url: "/vannes" });
    spy.mockRestore();
    set.mockRestore();
  });
});
