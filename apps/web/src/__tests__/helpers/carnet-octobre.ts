/**
 * Carnet réel d'octobre 2026 pour les tests (sous Jest, `require.context` n'existe pas :
 * `getAllCarnets()` renvoie []). À utiliser dans une fabrique `jest.mock("@/lib/carnet")`
 * pour que l'encart DemoVanne des articles s'affiche comme en production le 18/10/2026.
 */
import fs from "fs";
import path from "path";
import type { Carnet } from "@/lib/carnet";

export const OCTOBRE_18 = new Date("2026-10-18T10:00:00Z");

export function lireCarnetOctobre(): unknown {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "data", "carnet", "2026-10.json"), "utf8"));
}

/** Fabrique de `jest.mock("@/lib/carnet", …)` : vrai module, carnet d'octobre embarqué. */
export function mockCarnetOctobre() {
  const actual = jest.requireActual<typeof import("@/lib/carnet")>("@/lib/carnet");
  const carnets: Carnet[] = actual.parseCarnets([lireCarnetOctobre()]);
  return {
    ...actual,
    getCarnetDemo: () => actual.getCarnetDemo(carnets, OCTOBRE_18),
  };
}
