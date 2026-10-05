/**
 * Mesure Umami de l'article de blog (audit growth s14, E1 à E3, notation iter1 C7, C11 à C13) :
 * blog-ancre-clic, blog-sortie-clic, blog-cta-clic, blog-scroll (25, 50, 75, 100),
 * blog-vanne-partage, note et callback du CTA.
 */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BlogArticleTracking } from "@/components/blog/blog-article-tracking";
import { BlogVanneShare } from "@/components/blog/blog-vanne-share";
import { ArticleCta } from "@/components/blog/article-cta";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { getPostSignupRedirect } from "@/lib/safe-callback";

const mockAuthModal = jest.fn((_props: Record<string, unknown>) => null);
jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/components/auth/auth-modal", () => ({
  AuthModal: (props: Record<string, unknown>) => mockAuthModal(props),
}));

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
  it("sommaire : l'ancre part en blog-ancre-clic, le lien d'intro en sortie", () => {
    setup();
    fireEvent.click(screen.getByText("Soirée"));
    fireEvent.click(screen.getByText("blague du jour"));
    expect(track).toHaveBeenCalledTimes(2);
    expect(track).toHaveBeenNthCalledWith(1, "blog-ancre-clic", { slug: SLUG, cible: "#la-soiree" });
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
  it("paliers 25, 50, 75, 100 : chacun une seule fois", () => {
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

    top = 500; // (1000 - 500) / 4000 = 12,5 %
    scroll();
    expect(track).not.toHaveBeenCalled();

    top = -1500; // (1000 + 1500) / 4000 = 62,5 % : 25 et 50 d'un coup
    scroll();
    expect(track.mock.calls).toEqual([
      ["blog-scroll", { slug: SLUG, palier: 25 }],
      ["blog-scroll", { slug: SLUG, palier: 50 }],
    ]);

    top = -2000; // 75 %
    scroll();
    top = -1000; // retour en arrière : rien de neuf
    scroll();
    expect(track).toHaveBeenCalledTimes(3);
    expect(track).toHaveBeenLastCalledWith("blog-scroll", { slug: SLUG, palier: 75 });

    top = -3000; // 100 %
    scroll();
    top = -3500;
    scroll();
    expect(track).toHaveBeenCalledTimes(4);
    expect(track).toHaveBeenLastCalledWith("blog-scroll", { slug: SLUG, palier: 100 });
    raf.mockRestore();
  });
});

describe("blog-vanne-partage", () => {
  const JOKES = ['**1.** « Il a dit "ok". Fin. »\n*→ Deadpan.*', "**2.** « Deuxième vanne. »"].join("\n\n");
  const writeText = jest.fn(() => Promise.resolve());

  beforeAll(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  });

  function setupShare() {
    return render(
      <BlogArticleTracking slug={SLUG}>
        <div data-blog-body>
          <MarkdownRenderer content={JOKES} shareJokes />
        </div>
        <BlogVanneShare slug={SLUG} />
      </BlogArticleTracking>,
    );
  }

  afterEach(() => {
    delete (navigator as { share?: unknown }).share;
    writeText.mockClear();
  });

  it("un bouton Partager du site par vanne, dans son emplacement", () => {
    const { container } = setupShare();
    const buttons = screen.getAllByRole("button", { name: /^Partager la vanne n°\d+$/ });
    expect(buttons).toHaveLength(2);
    expect(container.querySelector('#vanne-1 [data-share-vanne="1"] button')).toBe(buttons[0]);
    expect(container.querySelector('#vanne-2 [data-share-vanne="2"] button')).toBe(buttons[1]);
  });

  it("partage natif : vanne entière et lien ancré, événement avec le numéro", async () => {
    const share = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    setupShare();
    fireEvent.click(screen.getByRole("button", { name: "Partager la vanne n°1" }));
    await waitFor(() => expect(track).toHaveBeenCalledWith("blog-vanne-partage", { slug: SLUG, vanne: 1, canal: "natif" }));
    expect(share).toHaveBeenCalledWith({
      title: "Vanne - deviens-marrant.fr",
      text: '« Il a dit "ok". Fin. »',
      url: `${window.location.origin}${window.location.pathname}#vanne-1`,
    });
    // Le clic sur le bouton n'est compté ni en sortie ni en CTA.
    expect(track).toHaveBeenCalledTimes(1);
  });

  it("repli copie sans Web Share ; partage annulé : aucun événement", async () => {
    setupShare();
    fireEvent.click(screen.getByRole("button", { name: "Partager la vanne n°2" }));
    await waitFor(() => expect(track).toHaveBeenCalledWith("blog-vanne-partage", { slug: SLUG, vanne: 2, canal: "copie" }));
    expect(writeText).toHaveBeenCalledWith(`« Deuxième vanne. »\n\n${window.location.origin}${window.location.pathname}#vanne-2`);

    track.mockClear();
    Object.defineProperty(navigator, "share", { value: jest.fn(() => Promise.reject(new Error("AbortError"))), configurable: true });
    fireEvent.click(screen.getByRole("button", { name: "Partager la vanne n°1" }));
    await act(async () => {});
    expect(track).not.toHaveBeenCalled();
  });
});

describe("CTA d'article : note et inscription attribuable", () => {
  it("note surchargeable, défaut : limites du compte gratuit", () => {
    const { unmount } = render(<ArticleCta note="Gratuit, sans carte." />);
    expect(screen.getByText("Gratuit, sans carte.")).toBeInTheDocument();
    unmount();
    render(<ArticleCta />);
    expect(screen.getByText(/^Compte gratuit : .+, contenu du jour\. Sans carte\.$/)).toBeInTheDocument();
  });

  it("le bouton d'inscription transmet le callback /onboarding?src=… à la modale", () => {
    mockAuthModal.mockClear();
    render(<ArticleCta freeCallbackUrl={`/onboarding?src=blog-${SLUG}`} />);
    expect(mockAuthModal).toHaveBeenCalledWith(
      expect.objectContaining({ callbackUrl: `/onboarding?src=blog-${SLUG}`, defaultTab: "register" }),
    );
    // Destination après inscription : l'onboarding avec src, tel quel.
    expect(getPostSignupRedirect(`/onboarding?src=blog-${SLUG}`)).toBe(`/onboarding?src=blog-${SLUG}`);
  });
});
