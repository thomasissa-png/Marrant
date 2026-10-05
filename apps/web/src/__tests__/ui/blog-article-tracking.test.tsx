/**
 * Mesure Umami de l'article de blog (audit growth s14, E1 à E3) :
 * blog-sortie-clic, blog-cta-clic, blog-scroll (une seule fois, à 75 %).
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { BlogArticleTracking } from "@/components/blog/blog-article-tracking";
import { ArticleCta } from "@/components/blog/article-cta";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/components/auth/auth-modal", () => ({ AuthModal: () => null }));

const track = jest.fn();
const SLUG = "meilleures-blagues-droles-2026";
const CONTENT = [
  "Va direct : [Soirée](#la-soiree). La [blague du jour](/blague-du-jour) change.",
  "## La soirée",
  "Plus de vannes : [les blagues de soirée](/vannes/theme/soirees).",
].join("\n\n");

function setup() {
  return render(
    <BlogArticleTracking slug={SLUG}>
      <div data-blog-body>
        <MarkdownRenderer content={CONTENT} />
      </div>
      <div data-blog-zone="related">
        <a href="/blog/timing-humour">Timing</a>
      </div>
      <ArticleCta primaryLabel="Créer mon compte gratuit" />
    </BlogArticleTracking>,
  );
}

beforeEach(() => {
  track.mockClear();
  (window as unknown as { umami: { track: jest.Mock } }).umami = { track };
});

describe("blog-sortie-clic", () => {
  it("sommaire : ancre et lien d'intro", () => {
    setup();
    fireEvent.click(screen.getByText("Soirée"));
    fireEvent.click(screen.getByText("blague du jour"));
    expect(track).toHaveBeenNthCalledWith(1, "blog-sortie-clic", { slug: SLUG, zone: "sommaire", section: "intro", cible: "#la-soiree" });
    expect(track).toHaveBeenNthCalledWith(2, "blog-sortie-clic", { slug: SLUG, zone: "sommaire", section: "intro", cible: "/blague-du-jour" });
  });

  it("section : id du H2 précédent ; bloc balisé : sa zone", () => {
    setup();
    fireEvent.click(screen.getByText("les blagues de soirée"));
    fireEvent.click(screen.getByText("Timing"));
    expect(track).toHaveBeenNthCalledWith(1, "blog-sortie-clic", { slug: SLUG, zone: "section", section: "la-soiree", cible: "/vannes/theme/soirees" });
    expect(track).toHaveBeenNthCalledWith(2, "blog-sortie-clic", { slug: SLUG, zone: "related", section: "", cible: "/blog/timing-humour" });
  });
});

describe("blog-cta-clic", () => {
  it("inscription et premium, sans doublon en sortie", () => {
    setup();
    fireEvent.click(screen.getByText("Créer mon compte gratuit"));
    fireEvent.click(screen.getByText("Tout débloquer à 2,99 €/mois"));
    expect(track).toHaveBeenCalledTimes(2);
    expect(track).toHaveBeenNthCalledWith(1, "blog-cta-clic", { slug: SLUG, bouton: "inscription" });
    expect(track).toHaveBeenNthCalledWith(2, "blog-cta-clic", { slug: SLUG, bouton: "premium" });
  });

  it("textes par défaut conservés sans surcharge", () => {
    render(<ArticleCta />);
    expect(screen.getByText("Maintenant, reste à le dire à voix haute")).toBeInTheDocument();
    expect(screen.getByText("Essaie gratuitement")).toBeInTheDocument();
  });
});

describe("blog-scroll", () => {
  it("part une seule fois, quand 75 % du corps est lu", () => {
    // rAF asynchrone simulé : les callbacks attendent le flush de la frame.
    const frames: FrameRequestCallback[] = [];
    const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => frames.push(cb));
    const scroll = () => {
      fireEvent.scroll(window);
      fireEvent.scroll(window); // 2e scroll dans la même frame : ignoré
      frames.splice(0).forEach((cb) => cb(0));
    };
    const { container } = setup();
    const body = container.querySelector("[data-blog-body]") as HTMLElement;
    let top = 0;
    body.getBoundingClientRect = () => ({ top, height: 4000 }) as DOMRect;
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    top = -1500; // (1000 + 1500) / 4000 = 62,5 %
    scroll();
    expect(track).not.toHaveBeenCalled();

    top = -2000; // 75 %
    scroll();
    top = -3000;
    scroll();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("blog-scroll", { slug: SLUG, palier: 75 });
    raf.mockRestore();
  });
});
