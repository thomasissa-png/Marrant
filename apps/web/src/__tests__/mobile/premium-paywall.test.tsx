/**
 * Tests PremiumPaywall — détection mode native vs web, fallback Stripe en web.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PremiumPaywall } from "@/components/marketing/premium-paywall";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

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
    (window as any).location = { href: "" };
  });

  it("affiche le CTA Stripe en mode web", () => {
    render(<PremiumPaywall />);
    expect(screen.getByText(/Passe Premium/i)).toBeInTheDocument();
    expect(screen.getByText(/S'abonner/)).toBeInTheDocument();
  });

  it("appelle /api/stripe/checkout au clic", async () => {
    render(<PremiumPaywall />);
    fireEvent.click(screen.getByText(/S'abonner/));

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
    fireEvent.click(screen.getByText(/S'abonner/));
    await waitFor(() => {
      expect(JSON.parse(mockApi.mock.calls[0][1].body)).toEqual({ returnTo: "/parcours/repartie" });
    });
  });

  it("vend les parcours complets, sans contenu quotidien ni filtres avancés", () => {
    render(<PremiumPaywall />);
    const text = document.body.textContent ?? "";
    expect(text).toContain(`Les ${STORYTELLING_PUBLIE ? 4 : 3} parcours en entier`);
    expect(text).toContain("première étape de chaque parcours restant offerte");
    expect(text).not.toMatch(/quotidien|Filtres avancés|illimit|sans limite/i);
  });

  it("redirige vers checkout.stripe.com après réponse", async () => {
    render(<PremiumPaywall />);
    fireEvent.click(screen.getByText(/S'abonner/));

    await waitFor(() => {
      expect((window as any).location.href).toBe("https://checkout.stripe.com/test");
    });
  });

  it("affiche un mention Sans engagement", () => {
    render(<PremiumPaywall />);
    expect(screen.getByText(/Sans engagement/i)).toBeInTheDocument();
  });

  it("contient lien rétractation conformité L221-28", () => {
    render(<PremiumPaywall />);
    const link = screen.getByText(/conditions de rétractation/i);
    expect(link.closest("a")).toHaveAttribute("href", "/retractation");
  });
});
