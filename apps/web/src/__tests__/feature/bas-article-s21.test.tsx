/**
 * s21, blocs d'appel partie A (B2, B18) : bas d'article.
 * - note [S9] : l'annuel n'apparaît que si le prix Stripe annuel est configuré ;
 * - lettre en bas d'article : titre, sous-titre (2 paragraphes) et note du tour 4 ;
 *   les autres emplacements gardent les textes communs de la lettre.
 */
import { render, screen } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/blog",
}));
jest.mock("@/lib/carnet", () => jest.requireActual("../helpers/carnet-octobre").mockCarnetOctobre());
jest.mock("@/lib/prisma", () => ({
  prisma: { blogArticle: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn().mockResolvedValue(null) } },
}));

import BlogArticlePage from "@/app/(dashboard)/blog/[slug]/page";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { BLOC_FIN, LETTRE_ARTICLE } from "@/config/textes/cta-articles-accueil";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { normalise } from "../helpers/texte-normalise";

const ANNUEL = "STRIPE_PREMIUM_ANNUAL_PRICE_ID";

async function renderArticle(slug: string) {
  return render(await BlogArticlePage({ params: { slug } }));
}

afterEach(() => {
  delete process.env[ANNUEL];
});

describe("note [S9] du bloc de fin", () => {
  it("annuel configuré : 24,99 € TTC par an (2,08 € par mois)", async () => {
    process.env[ANNUEL] = "price_test_annuel_123";
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const bloc = container.querySelector<HTMLElement>("[data-blog-bloc-fin]")!;
    expect(bloc).toHaveTextContent(normalise(BLOC_FIN.note(true)));
    expect(bloc).toHaveTextContent(/2,99 € TTC par mois, ou 24,99 € TTC par an \(2,08 € par mois\)\./);
  });
  it("annuel absent ou placeholder : mensuel seul", async () => {
    process.env[ANNUEL] = "price_XXXXXXXX";
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    expect(container.querySelector("[data-blog-bloc-fin]")).not.toHaveTextContent("24,99");
  });
  it("aucun « sans engagement » dans les textes de la partie A", () => {
    expect(BLOC_FIN.note(true) + BLOC_FIN.note(false)).not.toMatch(/sans engagement/i);
  });
});

describe("lettre en bas d'article (B18)", () => {
  it("titre, sous-titre en deux paragraphes et note du tour 16, après le bloc de fin", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const lettre = container.querySelector<HTMLElement>('[data-blog-zone="lettre"]')!;
    expect(lettre).toHaveTextContent(LETTRE_ARTICLE.titre);
    expect(lettre).toHaveTextContent("J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse.");
    expect(lettre).toHaveTextContent("Et surtout trois étapes pour fabriquer la tienne, avec un exemple.");
    expect(lettre).toHaveTextContent("La lettre est gratuite, sans compte. En fin de message, une lecture à suivre et un mot sur Premium, notre abonnement. Désinscription en un clic.");
    expect(lettre).not.toHaveTextContent(TEXTES_LETTRE.titre);
    const bloc = container.querySelector("[data-blog-bloc-fin]")!;
    expect(bloc.compareDocumentPosition(lettre) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("autre emplacement (quiz) : textes communs inchangés", () => {
    render(<LettreInscription emplacement="quiz" />);
    expect(screen.getByText(TEXTES_LETTRE.titre)).toBeInTheDocument();
    expect(screen.queryByText(LETTRE_ARTICLE.titre)).not.toBeInTheDocument();
  });
  it("zéro tiret cadratin", () => {
    expect(JSON.stringify(LETTRE_ARTICLE) + JSON.stringify(BLOC_FIN)).not.toContain("—");
  });
});
