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
    expect(screen.getByText(/Prêt à devenir plus drôle/)).toBeInTheDocument();
    expect(screen.getByText(/Commencer à 0,99 €\/mois/)).toBeInTheDocument();
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
    expect(screen.getByText(/ton futur toi drôle/i)).toBeInTheDocument();
  });

  it("CTA opens auth modal (button, not link to /register)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    const cta = screen.getByText(/Commencer à 0,99 €\/mois/);
    expect(cta.closest("button")).toBeTruthy();
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
