import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

// s22 : lien « Intègre la vanne du jour » dans le pied de page, seulement widget ouvert,
// juste avant « Nos offres » (go Thomas 24/10). Retouche minimale : rien d'autre ne bouge.
jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }));

let mockPublie = false;
jest.mock("@/config/widget-vanne-du-jour", () => {
  const actual = jest.requireActual("@/config/widget-vanne-du-jour");
  return {
    ...actual,
    get WIDGET_VANNE_DU_JOUR_PUBLIE() {
      return mockPublie;
    },
  };
});

describe("Footer, lien du widget (s22)", () => {
  it("widget fermé : aucun lien vers la page du programme", () => {
    mockPublie = false;
    const { container } = render(<Footer />);
    expect(container.querySelector('a[href="/integrer-la-vanne-du-jour"]')).toBeNull();
  });

  it("widget ouvert : lien présent, juste avant « Nos offres »", () => {
    mockPublie = true;
    const { container } = render(<Footer />);
    const lien = screen.getByText("Intègre la vanne du jour").closest("a");
    expect(lien).toHaveAttribute("href", "/integrer-la-vanne-du-jour");
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs[hrefs.indexOf("/integrer-la-vanne-du-jour") + 1]).toBe("/abonnement");
  });
});
