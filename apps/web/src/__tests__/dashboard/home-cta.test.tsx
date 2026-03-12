import { render, screen } from "@testing-library/react";
import { HomeCta } from "@/components/home/home-cta";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const { useSession } = require("next-auth/react");

describe("HomeCta", () => {
  it("shows CTA when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText(/Prêt à devenir plus drôle/)).toBeInTheDocument();
    expect(screen.getByText(/Commencer — 0,99 €\/mois/)).toBeInTheDocument();
    expect(screen.getByText("Voir les blagues gratuites")).toBeInTheDocument();
  });

  it("shows reassurance text", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText(/Sans engagement/)).toBeInTheDocument();
  });

  it("links to /register", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText(/Commencer — 0,99 €\/mois/).closest("a")).toHaveAttribute("href", "/register");
  });

  it("links to /blagues for free content", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HomeCta />);
    expect(screen.getByText("Voir les blagues gratuites").closest("a")).toHaveAttribute("href", "/blagues");
  });

  it("renders nothing when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    const { container } = render(<HomeCta />);
    expect(container.firstChild).toBeNull();
  });
});
