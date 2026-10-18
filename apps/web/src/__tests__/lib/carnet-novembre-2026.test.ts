/**
 * Carnet de novembre 2026 sur le code de production (filet si s21 n'est pas en ligne au 01/11).
 * Le schéma de cette version ignore (strip) `accroche` et `offerte` : la fiche offerte
 * aux non-abonnés reste la première (`2026-11-01`).
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { carnetViewForPlan, getCurrentCarnet, listCarnetMonths, parseCarnets } from "@/lib/carnet";

/** Empreinte de la source validée (`docs/copy/carnet/novembre/carnet-2026-11.json`, commit e6f5584). */
const SHA256_VALIDE = "44b3a8c74c2ae5b68742c43d6d0033dbf0f2e171941fbc39978b05c3c67cac8c";
const DATA = path.join(__dirname, "..", "..", "data", "carnet");
const brut = (f: string) => fs.readFileSync(path.join(DATA, f));

describe("carnet de novembre 2026", () => {
  const carnets = parseCarnets([JSON.parse(brut("2026-10.json").toString("utf8")), JSON.parse(brut("2026-11.json").toString("utf8"))]);
  const novembre = carnets.find((c) => c.mois === "2026-11");

  it("octets identiques à la version validée, schéma accepté (30 fiches)", () => {
    expect(crypto.createHash("sha256").update(brut("2026-11.json")).digest("hex")).toBe(SHA256_VALIDE);
    expect(carnets).toHaveLength(2);
    expect(novembre?.fiches).toHaveLength(30);
    // z.object par défaut : clés inconnues retirées, pas d'erreur.
    for (const f of novembre!.fiches) expect(Object.keys(f)).not.toEqual(expect.arrayContaining(["accroche"]));
    expect(novembre!.fiches.some((f) => "offerte" in f)).toBe(false);
  });

  it("caché jusqu'au 01/11 00:00 Paris (2026-10-31T23:00:00Z), courant ensuite", () => {
    expect(getCurrentCarnet(carnets, new Date("2026-10-31T22:59:59Z"))?.mois).toBe("2026-10");
    expect(listCarnetMonths(carnets, new Date("2026-10-31T22:59:59Z"))).toEqual(["2026-10"]);
    expect(getCurrentCarnet(carnets, new Date("2026-10-31T23:00:00Z"))?.mois).toBe("2026-11");
  });

  it("non abonné : fiche offerte = la première (2026-11-01), 29 en aperçu", () => {
    const vue = carnetViewForPlan(novembre!, null);
    expect(vue.fiches.map((f) => f.id)).toEqual(["2026-11-01"]);
    expect(vue.apercus).toHaveLength(29);
  });
});
