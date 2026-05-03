/**
 * Tests PremiumPaywall — détection mode native vs web, fallback Stripe en web.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PremiumPaywall } from "@/components/marketing/premium-paywall";

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
      expect(mockApi).toHaveBeenCalledWith("/api/stripe/checkout", { method: "POST" });
    });
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
