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
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { BLOC_FIN } from "@/config/textes/cta-articles-accueil";
import { normalise } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));

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
      <ArticleCta />
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
  it("abonnement et étape 1, sans doublon en sortie (s15 : « inscription » devient « abonnement »)", () => {
    setup();
    fireEvent.click(screen.getByText(normalise(BLOC_FIN.lienAbonnement)));
    fireEvent.click(screen.getByText(TEXTES_PARCOURS_BLOG.repartie.finBoutonEtape1));
    expect(track).toHaveBeenCalledTimes(2);
    // s20 : position et parcours du bloc qui contient le bouton.
    const props = { slug: SLUG, position: "fin", parcours: "repartie" };
    expect(track).toHaveBeenNthCalledWith(1, "blog-cta-clic", { ...props, bouton: "abonnement" });
    expect(track).toHaveBeenNthCalledWith(2, "blog-cta-clic", { ...props, bouton: "etape-1" });
  });

  it("textes par défaut (s20) : ceux du parcours et du bloc de fin, config/textes/encarts-blog-s20", () => {
    render(<ArticleCta />);
    expect(screen.getByText(TEXTES_PARCOURS_BLOG.repartie.finTitre)).toBeInTheDocument();
    // Concision v5 : lien payant OUVRIR, « Sans compte. » sous le plein, plus de note de prix.
    expect(screen.getByText(normalise(BLOC_FIN.lienAbonnement))).toBeInTheDocument();
    expect(screen.getByText("Sans compte.")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/TTC|14 jours/);
    expect(screen.getByText(TEXTES_PARCOURS_BLOG.repartie.finBoutonEtape1).closest("a")).toHaveAttribute(
      "href",
      "/parcours/repartie?src=blog#etape-1",
    );
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

  it("mode text-only (messages à envoyer) : ligne seule, sans titre ni lien, ni numéro, ni indication", async () => {
    const MESSAGES = [
      "**1.** Joyeux anniversaire [prénom] ! J'ai dû être **original**.\n*→ WhatsApp, premier message de la journée.*",
      "**2.** Bonne année. Voir [la vanne du jour](/blague-du-jour). *→ Pour le mail collectif.*",
    ].join("\n\n");
    render(
      <BlogArticleTracking slug="voeux-drole-nouvelle-annee">
        <div data-blog-body>
          <MarkdownRenderer content={MESSAGES} shareJokes />
        </div>
        <BlogVanneShare slug="voeux-drole-nouvelle-annee" mode="text-only" />
      </BlogArticleTracking>,
    );
    expect(screen.queryByRole("button", { name: /^Partager la vanne/ })).toBeNull();

    const share = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer le message n°1" }));
    await waitFor(() =>
      expect(track).toHaveBeenCalledWith("blog-vanne-partage", { slug: "voeux-drole-nouvelle-annee", vanne: 1, canal: "natif" }),
    );
    expect(share).toHaveBeenCalledWith({ text: "Joyeux anniversaire [prénom] ! J'ai dû être original." });

    delete (navigator as { share?: unknown }).share;
    fireEvent.click(screen.getByRole("button", { name: "Envoyer le message n°2" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("Bonne année. Voir la vanne du jour."));
  });
});

describe("CTA d'article : « Sans compte. » et inscription attribuable", () => {
  it("concision v5 : plus de note sous le bloc, « Sans compte. » sous le plein gratuit", () => {
    render(<ArticleCta />);
    const plein = screen.getByText(TEXTES_PARCOURS_BLOG.repartie.finBoutonEtape1).closest("a")!;
    const note = screen.getByText("Sans compte.");
    expect(plein.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/l'abonnement du site|TTC/);
  });

  it("le bouton principal mène à /abonnement avec retour au parcours et source de l'article (s15)", () => {
    const { container } = render(<ArticleCta parcours="repartie" src={`blog-${SLUG}`} />);
    const link = container.querySelector('a[data-blog-cta="abonnement"]');
    expect(link).toHaveAttribute("href", `/abonnement?returnTo=%2Fparcours%2Frepartie&src=blog-${SLUG}`);
    expect(container.querySelector('a[data-blog-cta="etape-1"]')).toHaveAttribute("href", "/parcours/repartie?src=blog#etape-1");
    expect(container.querySelector('[data-blog-cta="inscription"]')).toBeNull();
  });
});
