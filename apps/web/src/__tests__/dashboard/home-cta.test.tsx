import { render, screen } from "@testing-library/react";
import { HomeCta } from "@/components/home/home-cta";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 320, tips: 100, videos: 100 }),
}));

const { useSession } = require("next-auth/react");

describe("HomeCta", () => {
  it("shows CTA when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText(/Tu crois avoir tout essayé pour être drôle/)).toBeInTheDocument();
    // Étalon 1.2 validé par Thomas (s15), note courte de l'accueil.
    expect(screen.getByText("Accéder aux parcours complets")).toBeInTheDocument();
    expect(screen.getByText("2,99 €/mois, sans engagement.")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/compte gratuit/i);
    expect(screen.getByText("Voir les vannes gratuites")).toBeInTheDocument();
  });

  it("shows dynamic content counts", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText(/320\+/)).toBeInTheDocument();
    expect(screen.getByText(/100\+/)).toBeInTheDocument();
  });

  it("mentions the value proposition", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText(/La seule chose que tu n.as pas encore essayée/i)).toBeInTheDocument();
  });

  it("CTA is a real link to /register (s15 : présent dans le HTML serveur)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    const cta = screen.getByText("Accéder aux parcours complets");
    expect(cta.closest("a")).toHaveAttribute("href", "/register?src=accueil-cta");
  });

  it("links to /vannes for free content", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText("Voir les vannes gratuites").closest("a")).toHaveAttribute("href", "/vannes");
  });

  it("renders nothing when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    const { container } = render(<HomeCta />);
    expect(container.firstChild).toBeNull();
  });
});
