/**
 * @jest-environment node
 *
 * s22 (décision Thomas du 24/10/2026) : Premium passe de 2,99 € à 1,99 € par mois et de
 * 24,99 € à 16,99 € par an, partout. Garde-fous :
 *  - plus aucun ancien montant (ni ses dérivés : 2,08 € par mois, 10,89 € économisés) dans
 *    `apps/web/src` hors tests, textes, commentaires et prompts compris ;
 *  - les chiffres dérivés de l'annuel sont recalculés et honnêtes (coût mensuel jamais
 *    sous-estimé, économie et mois offerts jamais surestimés).
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import {
  PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
} from "@/config/premium";
import { ANNUEL_AVANTAGE_LABEL, ANNUEL_MOIS_OFFERTS, ANNUEL_MOIS_OFFERTS_LABEL } from "@/config/textes/offre";
import { PREMIUM_PRICE_CENTS } from "@/lib/stripe";

const SRC = join(__dirname, "..", "..");
const NBSP = " ";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
    return /\.(tsx?|json|md|txt)$/.test(name) ? [path] : [];
  });
}

/** Anciens montants, en graphie française (« 2,99 ») et schema.org (« 2.99 »). */
const ANCIENS = /(?<![\d.,])(?:2[,.]99|24[,.]99|2,08|10,89|35,88)(?!\d)/;

describe("prix 1,99 € : plus aucun ancien montant dans le code servi", () => {
  it("aucun 2,99, 24,99 ni chiffre dérivé hors tests", () => {
    const trouves = sourceFiles(SRC).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((ligne, i) => ({ ligne, i }))
        .filter(({ ligne }) => ANCIENS.test(ligne))
        .map(({ i }) => `${relative(SRC, file)}:${i + 1}`),
    );
    expect(trouves).toEqual([]);
  });

  it("le garde-fou reconnaît bien les anciens montants", () => {
    expect(ANCIENS.test("Premium · 2,99 €/mois")).toBe(true);
    expect(ANCIENS.test("24,99 €/an")).toBe(true);
    expect(ANCIENS.test('price: "2.99"')).toBe(true);
    expect(ANCIENS.test("1,99 €/mois, 16,99 €/an, 12,99 €")).toBe(false);
  });
});

describe("prix 1,99 € : chiffres dérivés justes", () => {
  it("prix affichés : 199 et 1699 centimes", () => {
    expect(PREMIUM_MONTHLY_PRICE_CENTS).toBe(199);
    expect(PREMIUM_ANNUAL_PRICE_CENTS).toBe(1699);
  });

  it("équivalent mensuel de l'annuel : 16,99 / 12 = 1,4158 €, annoncé 1,42 € (jamais en dessous)", () => {
    expect(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS).toBe(142);
    expect(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS * 12).toBeGreaterThanOrEqual(PREMIUM_ANNUAL_PRICE_CENTS);
  });

  it("économie annuelle : 1,99 × 12 = 23,88 € ; 23,88 − 16,99 = 6,89 €", () => {
    expect(PREMIUM_ANNUAL_SAVINGS_CENTS).toBe(689);
  });

  it("mois offerts : 6,89 / 1,99 = 3,46, donc « plus de 3 mois offerts »", () => {
    expect(ANNUEL_MOIS_OFFERTS).toBe(3);
    expect(ANNUEL_MOIS_OFFERTS * PREMIUM_MONTHLY_PRICE_CENTS).toBeLessThanOrEqual(PREMIUM_ANNUAL_SAVINGS_CENTS);
    expect(ANNUEL_MOIS_OFFERTS_LABEL).toBe("plus de 3 mois offerts");
    expect(ANNUEL_AVANTAGE_LABEL).toBe(`plus de 3 mois offerts, 6,89${NBSP}€ économisés par an`);
  });

  it("MRR admin : le montant par défaut suit le prix affiché", () => {
    expect(PREMIUM_PRICE_CENTS).toBe(PREMIUM_MONTHLY_PRICE_CENTS);
  });
});
