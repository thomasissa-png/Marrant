/**
 * Les textes publics des limites gratuites suivent la constante de config.
 * La config est remplacée par des limites fictives (12 / 6 / 2) : si un texte
 * affichait encore un chiffre en dur, il ne refléterait pas ces valeurs.
 */
import { render, screen } from "@testing-library/react";
import { ArticleCta } from "@/components/blog/article-cta";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";

// s21 (CLS) : la page lit la session au rendu ; ici, visiteur côté serveur (session client mockée).
jest.mock("@/lib/session-serveur", () => ({ lireConnecteServeur: async () => false }));
import { LLMS_FAQ_FULL, LLMS_TARIFS } from "@/lib/llms-content";
import { MUR_LISTE } from "@/config/textes/cta-pages";

jest.mock("@/config/premium", () => ({
  ...jest.requireActual("@/config/premium"),
  FREE_JOKE_LIMIT: 12,
  FREE_TIP_LIMIT: 6,
  FREE_VIDEO_LIMIT: 2,
  FREE_CATALOGUE_LIMITS_LABEL: "12 vannes, 6 conseils, 2 vidéos",
}));
jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/components/auth/auth-cta", () => ({ AuthCta: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 100, tips: 100, videos: 80, members: 0 }),
}));

describe("limites gratuites affichées = constantes de config", () => {
  it("CTA de fin d'article : plus aucune limite gratuite vendue (s15), « Sans compte. » seul", () => {
    const { container } = render(<ArticleCta />);
    expect(screen.getByText("Sans compte.")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/compte gratuit|sans carte|TTC/i);
  });

  it("page /abonnement : concision v5, plus de limites gratuites dans les avantages", async () => {
    const { container } = render(await AbonnementPage({}));
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/compte gratuit/i);
    expect(text).not.toMatch(/au lieu de|\b10 vannes\b/);
  });

  it("murs des listes : limites lues dans les constantes de config", () => {
    expect(MUR_LISTE.vannes.limite).toBe("Les 12 gratuites, c’est fait.");
    expect(MUR_LISTE.conseils.limite).toBe("6 conseils gratuits, c’est fait.");
    expect(MUR_LISTE.videos.limite).toBe("2 vidéos gratuites, c’est fait.");
  });

  it("llms.txt / llms-full.txt (tarifs et FAQ)", () => {
    expect(LLMS_TARIFS[0]).toContain("Sans abonnement et sans compte : 12 vannes, 6 conseils, 2 vidéos,");
    const cout = LLMS_FAQ_FULL.find((f) => f.question === "Combien ça coûte ?");
    expect(cout?.answer).toContain("Sans abonnement et sans compte : 12 vannes, 6 conseils, 2 vidéos, la première étape de chaque parcours, la situation offerte du carnet du mois et le contenu du jour.");
    expect(cout?.answer).not.toMatch(/accès gratuit/i);
  });
});
