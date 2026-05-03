/**
 * Tests pour le wrapper IAP (RevenueCat).
 *
 * Couverture :
 *  - getOfferings retourne [] en web (graceful degradation)
 *  - purchasePackage throw en web
 *  - restorePurchases throw en web
 *  - getCustomerInfo retourne objet "non-Premium" en web
 */

import { getOfferings, purchasePackage, restorePurchases, getCustomerInfo } from "@/lib/iap";

// Forcer le mode "pas mobile" : on n'a pas Capacitor en environnement test
jest.mock("@/lib/api-base", () => ({
  isMobileNative: () => false,
}));

describe("iap (mode web)", () => {
  it("getOfferings retourne tableau vide en web", async () => {
    const offerings = await getOfferings();
    expect(offerings).toEqual([]);
  });

  it("purchasePackage throw en web", async () => {
    await expect(purchasePackage("premium_monthly")).rejects.toThrow(
      "L'achat IAP n'est disponible que sur mobile",
    );
  });

  it("restorePurchases throw en web", async () => {
    await expect(restorePurchases()).rejects.toThrow("Restore IAP indisponible en web");
  });

  it("getCustomerInfo retourne objet non-Premium en web", async () => {
    const info = await getCustomerInfo();
    expect(info).toEqual({
      isPremium: false,
      expirationDate: null,
      productIdentifier: null,
      managementURL: null,
    });
  });
});
