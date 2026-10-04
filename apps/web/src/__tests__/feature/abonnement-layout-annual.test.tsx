/**
 * @jest-environment node
 *
 * /abonnement layout (rendu dynamique) : JSON-LD produit, FAQ JSON-LD et
 * metadata suivent le secret serveur STRIPE_PREMIUM_ANNUAL_PRICE_ID, lu à
 * chaque rendu (aucun redéploiement nécessaire).
 */
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsRounded: async () => ({ jokes: 600, tips: 400, videos: 80 }),
}));

import AbonnementLayout, { dynamic, generateMetadata } from "@/app/(dashboard)/abonnement/layout";

const saved = process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
afterEach(() => {
  if (saved === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
  else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = saved;
});

const html = () => renderToStaticMarkup(<AbonnementLayout><div /></AbonnementLayout>);

describe("AbonnementLayout et formule annuelle", () => {
  it("rendu dynamique", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("sans secret : mensuel seul (JSON-LD, FAQ, metadata)", async () => {
    delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
    const out = html();
    expect(out).toContain('"price":"2.99"');
    expect(out).not.toMatch(/24\.99|24,99|P1Y/);
    expect((await generateMetadata()).description).not.toContain("24,99");
  });

  it("secret posé (sans redéploiement) : offres P1M + P1Y, FAQ et metadata avec l'annuel", async () => {
    process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "price_test_annual_1";
    const out = html();
    expect(out).toContain('"billingDuration":"P1Y"');
    expect(out).toContain('"price":"24.99"');
    expect(out).toContain("24,99 €/an en une fois, soit 2,08 € par mois (10,89 € économisés par an)");
    expect((await generateMetadata()).description).toContain("à 2,99 €/mois ou 24,99 €/an");
  });
});
