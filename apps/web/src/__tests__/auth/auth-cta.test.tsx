/**
 * AuthCta (s15) : lien direct /register pour un anonyme (et dans le HTML
 * serveur, session en chargement), plus aucune modale.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthCta } from "@/components/auth/auth-cta";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
const { useSession } = require("next-auth/react");

describe("AuthCta", () => {
  it.each(["unauthenticated", "loading"])("%s : lien /register avec destination et source", (status) => {
    useSession.mockReturnValue({ status });
    render(<AuthCta label="Créer mon compte" callbackUrl="/vannes" src="vannes" />);
    expect(screen.getByRole("link", { name: "Créer mon compte" })).toHaveAttribute(
      "href",
      "/register?callbackUrl=%2Fvannes&src=vannes",
    );
  });

  it("connecté avec action : bouton qui l'exécute", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    const onClick = jest.fn();
    render(<AuthCta label="Go" onAuthenticatedClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("connecté sans action : lien direct vers la destination", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AuthCta label="Go" callbackUrl="/parcours/repartie" />);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/parcours/repartie");
  });
});
