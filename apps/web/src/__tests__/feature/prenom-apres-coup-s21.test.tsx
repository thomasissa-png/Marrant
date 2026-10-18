/**
 * s21 concision (choix de Thomas du 18/10) : le prénom n'est plus demandé à
 * l'inscription. Il se renseigne après coup dans /profil (PATCH /api/user),
 * reste facultatif, et les e-mails gardent leur repli « Salut, ».
 * Route PATCH et repli des e-mails : src/__tests__/api/user-prenom-s21.test.ts.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockToast = jest.fn();
jest.mock("@/components/ui/toast", () => ({ toast: (...a: unknown[]) => mockToast(...a) }));

import { PrenomCard } from "@/components/profil/prenom-card";
import { TEXTES_API, TEXTES_PRENOM } from "@/config/textes/compte";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Carte « Ton prénom » de /profil", () => {
  it("vide au départ, enregistre puis confirme", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ name: "Jean" }) });
    render(<PrenomCard prenom={null} />);
    const champ = screen.getByLabelText(TEXTES_PRENOM.label);
    expect(champ).toHaveValue("");
    expect(champ).not.toBeRequired();
    await userEvent.type(champ, "Jean");
    await userEvent.click(screen.getByRole("button", { name: TEXTES_PRENOM.bouton }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledWith(TEXTES_PRENOM.succes, "success"));
    expect(global.fetch).toHaveBeenCalledWith("/api/user", expect.objectContaining({ method: "PATCH", body: JSON.stringify({ name: "Jean" }) }));
  });

  it("un caractère : erreur reliée au champ, aucun appel", async () => {
    global.fetch = jest.fn();
    render(<PrenomCard prenom="Jean" />);
    const champ = screen.getByLabelText(TEXTES_PRENOM.label);
    await userEvent.clear(champ);
    await userEvent.type(champ, "J");
    await userEvent.click(screen.getByRole("button", { name: TEXTES_PRENOM.bouton }));
    expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_PRENOM.tropCourt);
    expect(champ).toHaveAttribute("aria-describedby", "profil-prenom-erreur");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("erreur serveur ou réseau : « Ça n'a pas marché, réessaie. »", async () => {
    expect(TEXTES_PRENOM.erreur).toBe("Ça n’a pas marché, réessaie.");
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({ error: TEXTES_API.erreurServeur }) });
    const { unmount } = render(<PrenomCard prenom="Jean" />);
    await userEvent.click(screen.getByRole("button", { name: TEXTES_PRENOM.bouton }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_PRENOM.erreur));
    unmount();
    global.fetch = jest.fn().mockRejectedValue(new Error("hors ligne"));
    render(<PrenomCard prenom="Jean" />);
    await userEvent.click(screen.getByRole("button", { name: TEXTES_PRENOM.bouton }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_PRENOM.erreur));
  });

  it("textes de la carte : titre, bouton, succès", () => {
    expect(TEXTES_PRENOM.titre).toBe("Ton prénom");
    expect(TEXTES_PRENOM.bouton).toBe("Enregistrer");
    expect(TEXTES_PRENOM.succes).toBe("C’est noté.");
  });
});
