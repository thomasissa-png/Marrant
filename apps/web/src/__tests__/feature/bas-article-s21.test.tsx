/**
 * s21, bas d'article après la concision v5 (textes-v5-a §3 et §7).
 * - bloc de fin : titre, une phrase, plein gratuit, « Sans compte. », lien OUVRIR, rien d'autre ;
 * - lettre en bas d'article : titre et phrase v5 ; les autres emplacements gardent les textes
 *   communs de la lettre.
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
import { avecOuSansGluon, lie, normalise } from "../helpers/texte-normalise";

const ANNUEL = "STRIPE_PREMIUM_ANNUAL_PRICE_ID";

async function renderArticle(slug: string) {
  return render(await BlogArticlePage({ params: { slug } }));
}

afterEach(() => {
  delete process.env[ANNUEL];
});

describe("bloc de fin (concision v5, textes-v5-a §3)", () => {
  it.each(["price_test_annuel_123", "price_XXXXXXXX"])("annuel %s : aucune note de prix sous le bloc, « Sans compte. » sous le plein", async (valeur) => {
    process.env[ANNUEL] = valeur;
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const bloc = container.querySelector<HTMLElement>("[data-blog-bloc-fin]")!;
    expect(normalise(bloc.textContent ?? "")).toBe(
      normalise("La vanne dans ta bouche, pas dans ton téléphoneLa placer à voix haute, ça s'entraîne.Tester mes premières répliques, gratuitSans compte.Ouvrir les 5 parcours · 2,99 €/mois"),
    );
    expect(bloc).not.toHaveTextContent(/24,99|TTC|14 jours|sans engagement/i);
  });
});

describe("lettre en bas d'article (concision v5, textes-v5-a §7)", () => {
  it("titre et phrase v5, sans réassurance ni vanne d'exemple, après le bloc de fin", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const lettre = container.querySelector<HTMLElement>('[data-blog-zone="lettre"]')!;
    expect(lettre).toHaveTextContent(LETTRE_ARTICLE.titre);
    expect(LETTRE_ARTICLE.titre).toBe("Une vanne décryptée, chaque mois");
    expect(lettre).toHaveTextContent(lie("Gratuite, par e-mail, avec un exercice."));
    expect(lettre).not.toHaveTextContent(/J'ai pris un chien|La lettre est gratuite, sans compte|pour t'entraîner/);
    const bloc = container.querySelector("[data-blog-bloc-fin]")!;
    expect(bloc.compareDocumentPosition(lettre) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("autre emplacement (quiz) : textes communs inchangés", () => {
    render(<LettreInscription emplacement="quiz" />);
    expect(screen.getByText(TEXTES_LETTRE.titre)).toBeInTheDocument();
    expect(screen.getByText(lie(TEXTES_LETTRE.phrase))).toBeInTheDocument();
    expect(screen.queryByText(avecOuSansGluon("Gratuite, par e-mail, avec un exercice."))).not.toBeInTheDocument();
  });
  it("zéro tiret cadratin", () => {
    expect(JSON.stringify(LETTRE_ARTICLE) + JSON.stringify(BLOC_FIN)).not.toContain("—");
  });
});
