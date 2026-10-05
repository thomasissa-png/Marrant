/**
 * Les textes publics des limites gratuites suivent la constante de config.
 * La config est remplacée par des limites fictives (12 / 6 / 2) : si un texte
 * affichait encore un chiffre en dur, il ne refléterait pas ces valeurs.
 */
import { render, screen } from "@testing-library/react";
import { ArticleCta } from "@/components/blog/article-cta";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";
import { LLMS_FAQ_FULL, LLMS_TARIFS } from "@/lib/llms-content";

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
  it("CTA de fin d'article", () => {
    render(<ArticleCta />);
    expect(
      screen.getByText("Compte gratuit : 12 vannes, 6 conseils, 2 vidéos, contenu du jour. Sans carte."),
    ).toBeInTheDocument();
  });

  it("page /abonnement (sous-titre, bloc gratuit, avantages Premium)", () => {
    const { container } = render(<AbonnementPage />);
    const text = container.textContent ?? "";
    expect(text).toContain("Compte gratuit d'abord (12 vannes, 6 conseils, 2 vidéos, la première étape");
    expect(text).toContain("12 vannes, 6 conseils, 2 vidéos, le contenu du jour");
    expect(text).toContain("au lieu de 12 vannes, 6 conseils et 2 vidéos en compte gratuit");
    expect(text).not.toMatch(/\b10 vannes\b/);
  });

  it("llms.txt / llms-full.txt (tarifs et FAQ)", () => {
    expect(LLMS_TARIFS[0]).toContain("Accès gratuit : 12 vannes, 6 conseils, 2 vidéos,");
    const cout = LLMS_FAQ_FULL.find((f) => f.question === "Combien ça coûte ?");
    expect(cout?.answer).toContain("(12 vannes, 6 conseils, 2 vidéos et le contenu du jour)");
  });
});
