/**
 * s21, correctif « premier paiement » sur /register (duel à l'aveugle, 3/3) :
 * - ligne du haut : prix TTC de la formule choisie (mensuel ou annuel) ;
 * - ligne du bas : seul le premier paiement est remboursable ;
 * - plus aucune trace de « remboursé sous 14 jours » dans le code du site.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";

const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const ANCIENNE_PHRASE = "remboursé sous 14 jours";
const LIGNE_BAS = "Tu as 14 jours pour te faire rembourser ton premier paiement.";

/** Texte de la page, espaces insécables ramenés à des espaces simples. */
function textePage(): string {
  return (document.body.textContent ?? "").replace(/[  ]/g, " ");
}

function lignes(): { haut: string; bas: string } {
  const haut = screen.getByRole("heading", { level: 1, name: "Ton compte" }).nextElementSibling;
  const bas = screen.getByTestId("register-reassurance");
  return {
    haut: (haut?.textContent ?? "").replace(/ /g, " "),
    bas: (bas.textContent ?? "").replace(/ /g, " "),
  };
}

describe("/register, lignes prix et remboursement (s21)", () => {
  beforeEach(() => {
    for (const key of [...mockSearchParams.keys()]) mockSearchParams.delete(key);
    global.fetch = jest.fn();
  });

  it("mensuel (par défaut) : les deux lignes validées, sans l'ancienne phrase", () => {
    render(<RegisterPage />);
    expect(lignes()).toEqual({
      haut: "Premium, 2,99 € TTC par mois, annulable à tout moment.",
      bas: LIGNE_BAS,
    });
    expect(textePage()).not.toContain(ANCIENNE_PHRASE);
    expect(textePage()).not.toContain("€/mois");
  });

  it("annuel depuis l'offre (callbackUrl /abonnement?plan=annual) : seul le prix change", () => {
    mockSearchParams.set("callbackUrl", "/abonnement?plan=annual");
    render(<RegisterPage />);
    expect(lignes()).toEqual({
      haut: "Premium, 24,99 € TTC par an, annulable à tout moment.",
      bas: LIGNE_BAS,
    });
    expect(textePage()).not.toContain(ANCIENNE_PHRASE);
    expect(textePage()).not.toContain("par mois");
  });

  it("annuel par ?plan=annual : même ligne du haut", () => {
    mockSearchParams.set("plan", "annual");
    render(<RegisterPage />);
    expect(lignes().haut).toBe("Premium, 24,99 € TTC par an, annulable à tout moment.");
  });

  it("aucun fichier de apps/web/src (hors tests) ne contient encore « remboursé sous 14 jours »", () => {
    const racine = join(__dirname, "..", "..");
    const fautifs: string[] = [];
    const parcourir = (dossier: string) => {
      for (const nom of readdirSync(dossier)) {
        const chemin = join(dossier, nom);
        if (statSync(chemin).isDirectory()) {
          if (nom !== "__tests__") parcourir(chemin);
        } else if (/\.(ts|tsx)$/.test(nom) && readFileSync(chemin, "utf-8").includes(ANCIENNE_PHRASE)) {
          fautifs.push(relative(racine, chemin));
        }
      }
    };
    parcourir(racine);
    expect(fautifs).toEqual([]);
  });
});
