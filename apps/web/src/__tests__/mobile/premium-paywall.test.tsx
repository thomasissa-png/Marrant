/**
 * Tests PremiumPaywall — détection mode native vs web, fallback Stripe en web.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PremiumPaywall } from "@/components/marketing/premium-paywall";
import { PAYWALL_PREMIUM } from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";

/** Concision v5 (textes-v5-c §9) : le plein web est `OUVRIR`. */
const BOUTON = /Ouvrir les \d parcours/;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

const mockApi = jest.fn();
jest.mock("@/lib/api-base", () => ({
  api: (...args: any[]) => mockApi(...args),
  isMobileNative: () => false,
}));

jest.mock("@/lib/iap", () => ({
  getOfferings: jest.fn(() => Promise.resolve([])),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
}));

describe("PremiumPaywall (mode web)", () => {
  beforeEach(() => {
    mockApi.mockReset();
    mockApi.mockResolvedValue({
      json: () => Promise.resolve({ url: "https://checkout.stripe.com/test" }),
    });
    // @ts-ignore : mock window.location
    delete (window as any).location;
    // pathname/search : lus par la mesure Umami (checkout-ouvert, fusion s21).
    (window as any).location = { href: "", pathname: "/parcours/repartie", search: "" };
  });

  it("affiche le CTA Stripe en mode web", () => {
    render(<PremiumPaywall />);
    expect(screen.getByRole("heading", { name: "Le reste, avec Premium" })).toBeInTheDocument();
    expect(screen.queryByText(/Passe Premium/i)).not.toBeInTheDocument();
    expect(screen.getByText(BOUTON)).toBeInTheDocument();
    expect(screen.queryByText(/S'abonner/)).not.toBeInTheDocument();
  });

  it("appelle /api/stripe/checkout au clic", async () => {
    render(<PremiumPaywall />);
    fireEvent.click(screen.getByText(BOUTON));

    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith(
        "/api/stripe/checkout",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("transmet la page courante en returnTo (retour après paiement)", async () => {
    (window as any).location = { href: "", pathname: "/parcours/repartie", search: "" };
    render(<PremiumPaywall />);
    fireEvent.click(screen.getByText(BOUTON));
    await waitFor(() => {
      expect(JSON.parse(mockApi.mock.calls[0][1].body)).toEqual({ returnTo: "/parcours/repartie" });
    });
  });

  it("texte de valeur v5, sans contenu quotidien ni filtres avancés", () => {
    render(<PremiumPaywall />);
    const text = document.body.textContent ?? "";
    expect(screen.getByText(PAYWALL_PREMIUM.valeur)).toBeInTheDocument();
    expect(PAYWALL_PREMIUM.valeur).toBe("Le carnet du mois, tes favoris, tout le catalogue.");
    expect(text).not.toMatch(/quotidien|Filtres avancés|illimit|sans limite|les listes complètes/i);
  });

  it("redirige vers checkout.stripe.com après réponse", async () => {
    render(<PremiumPaywall />);
    fireEvent.click(screen.getByText(BOUTON));

    await waitFor(() => {
      expect((window as any).location.href).toBe("https://checkout.stripe.com/test");
    });
  });

  // Concision v5 : la REASS unique sous le plein, plus de mentions juridiques en doublon.
  it("une seule ligne de garantie, sans « rétractation » ni « Sans engagement »", () => {
    render(<PremiumPaywall />);
    expect(screen.getByText(REASSURANCE_UNIQUE)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/rétractation|Sans engagement/i);
  });
});
