/**
 * s21 (revue d'ensemble v2, m-1 et mineur glossaire) : les 5 boutons payants hors chantier
 * portent chacun leur `src` (suivie par /abonnement jusqu'à `checkout-ouvert`), et les blocs
 * de fin de page du glossaire et de l'à-propos ne s'affichent plus pour un abonné Premium.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { AuthCta, avecSourceAbonnement } from "@/components/auth/auth-cta";
import GlossairePage from "@/app/(dashboard)/glossaire/page";
import AProposPage from "@/app/(dashboard)/a-propos/page";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-est-premium", () => ({ useEstPremium: jest.fn() }));
const { useSession } = require("next-auth/react");
const { useEstPremium } = require("@/hooks/use-est-premium");

const SRC = path.join(__dirname, "..", "..");
const lire = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf8");

// /favoris, compte sans abonnement : le middleware redirige avant que ce bouton s'affiche ; la
// redirection porte la même source, jouée sur une vraie requête (lib/middleware-abonnement-src-s21.test.ts).
describe("m-1 : une source distincte par bouton payant", () => {
  it.each([
    ["app/(dashboard)/glossaire/page.tsx", 'buildAbonnementUrl(null, "monthly", "glossaire")'],
    ["app/(dashboard)/parcours/(liste)/page.tsx", 'buildAbonnementUrl(null, "monthly", "parcours-liste")'],
    ["components/favoris/favoris-list.tsx", 'buildAbonnementUrl("/favoris", "monthly", "favoris")'],
    ["components/ui/search-bar.tsx", 'buildAbonnementUrl(null, "monthly", "recherche")'],
    // Trajet de conversion s21 (arbitrage du 19/10) : le visiteur passe par /abonnement, comme au glossaire.
    ["app/(dashboard)/a-propos/page.tsx", 'buildAbonnementUrl(null, "monthly", "a-propos")'],
  ])("%s", (fichier, attendu) => {
    const source = lire(fichier);
    expect(source).toContain(attendu);
    expect(source).not.toMatch(/href="\/abonnement"/);
  });

  it("AuthCta connecté : la source suit vers /abonnement (à-propos)", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AuthCta label="Go" src="a-propos" />);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/abonnement?src=a-propos");
  });

  it("avecSourceAbonnement : seulement /abonnement, jamais une source déjà posée ni invalide", () => {
    expect(avecSourceAbonnement("/abonnement?returnTo=%2Fvannes", "a-propos")).toBe(
      "/abonnement?returnTo=%2Fvannes&src=a-propos",
    );
    expect(avecSourceAbonnement("/abonnement?src=header", "a-propos")).toBe("/abonnement?src=header");
    expect(avecSourceAbonnement("/parcours/repartie", "a-propos")).toBe("/parcours/repartie");
    expect(avecSourceAbonnement("/abonnement", "Pas Valide")).toBe("/abonnement");
    expect(avecSourceAbonnement("/abonnement", undefined)).toBe("/abonnement");
  });
});

describe("QA v4 m-6 : /parcours, encart « Abonnement » masqué pour l'abonné", () => {
  it("l'encart payant de « Explore aussi » est enveloppé par MasqueSiPremium", () => {
    const source = lire("app/(dashboard)/parcours/(liste)/page.tsx");
    const encart = source.match(/<MasqueSiPremium>([\s\S]*?)<\/MasqueSiPremium>/);
    expect(encart?.[1]).toContain('buildAbonnementUrl(null, "monthly", "parcours-liste")');
    expect(encart?.[1]).toContain("PREMIUM_PRICE_LABEL");
    expect(source.match(/PREMIUM_PRICE_LABEL/g)).toHaveLength(2); // import + encart masqué
  });
});

describe("Glossaire et à-propos : bloc payant masqué pour un abonné", () => {
  beforeEach(() => useSession.mockReturnValue({ status: "authenticated" }));

  it.each([
    // s21 (E5, E6) : libellé validé « Tout ouvrir · 2,99 €/mois ».
    ["glossaire", () => <GlossairePage />, /^Tout ouvrir/],
    ["à-propos", () => <AProposPage />, /^Tout ouvrir/],
  ] as const)("%s", (_nom, page, bouton) => {
    useEstPremium.mockReturnValue(false);
    const { unmount } = render(page());
    expect(screen.getByRole("link", { name: bouton })).toBeInTheDocument();
    unmount();
    useEstPremium.mockReturnValue(true);
    render(page());
    expect(screen.queryByRole("link", { name: bouton })).not.toBeInTheDocument();
  });
});
