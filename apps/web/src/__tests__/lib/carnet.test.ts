/**
 * Carnet mensuel (décision Thomas, 03/10/2026) : mois courant à Paris, mois
 * futurs cachés, aperçu non Premium sans fuite, Premium complet, JSON réels
 * conformes au format.
 */
import fs from "fs";
import path from "path";
import {
  carnetViewForPlan,
  currentParisMonth,
  formatCarnetMonth,
  getCarnetByMonth,
  getCurrentCarnet,
  listCarnetMonths,
  parseCarnets,
  type Carnet,
} from "@/lib/carnet";
import { CARNET_FIXTURES, SECRET_FIELDS } from "../helpers/carnet-fixture";

const OCT_3 = new Date("2026-10-03T12:00:00Z");

describe("currentParisMonth", () => {
  it("bascule à minuit heure de Paris, pas à minuit UTC", () => {
    expect(currentParisMonth(new Date("2026-09-30T21:59:00Z"))).toBe("2026-09");
    expect(currentParisMonth(new Date("2026-09-30T22:00:00Z"))).toBe("2026-10");
    expect(currentParisMonth(new Date("2026-12-31T23:30:00Z"))).toBe("2027-01");
  });
});

describe("mois disponibles", () => {
  it("carnet courant = le plus récent déjà commencé (novembre reste caché le 3 octobre)", () => {
    expect(getCurrentCarnet(CARNET_FIXTURES, OCT_3)?.mois).toBe("2026-10");
    expect(listCarnetMonths(CARNET_FIXTURES, OCT_3)).toEqual(["2026-10", "2026-09"]);
  });

  it("un mois futur n'est pas accessible par son URL", () => {
    expect(getCarnetByMonth("2026-11", CARNET_FIXTURES, OCT_3)).toBeNull();
    expect(getCarnetByMonth("2026-09", CARNET_FIXTURES, OCT_3)?.mois).toBe("2026-09");
    expect(getCarnetByMonth("n-importe-quoi", CARNET_FIXTURES, OCT_3)).toBeNull();
  });

  it("le 1er novembre à 0 h 30 (Paris), novembre devient le carnet courant", () => {
    expect(getCurrentCarnet(CARNET_FIXTURES, new Date("2026-10-31T23:30:00Z"))?.mois).toBe("2026-11");
  });

  it("aucun carnet : null, pas d'exception", () => {
    expect(getCurrentCarnet([], OCT_3)).toBeNull();
  });

  it("libellé du mois en français", () => {
    expect(formatCarnetMonth("2026-10")).toBe("octobre 2026");
    expect(formatCarnetMonth("2027-02")).toBe("février 2027");
  });
});

describe("carnetViewForPlan", () => {
  const october = CARNET_FIXTURES.find((c) => c.mois === "2026-10") as Carnet;

  it.each([null, undefined, "FREE"])(
    "non Premium (%s) : première fiche entière, titres et contextes des autres, rien de plus",
    (plan) => {
      const view = carnetViewForPlan(october, plan);
      expect(view.premium).toBe(false);
      expect(view.fiches).toEqual([october.fiches[0]]);
      expect(view.apercus).toEqual(
        october.fiches.slice(1).map((f) => ({ id: f.id, titre: f.titre, contexte: f.contexte })),
      );
      const serialized = JSON.stringify(view);
      for (const fiche of october.fiches.slice(1)) {
        for (const field of SECRET_FIELDS) expect(serialized).not.toContain(fiche[field]);
      }
    },
  );

  it("Premium : toutes les fiches complètes, aucun aperçu", () => {
    const view = carnetViewForPlan(october, "PREMIUM");
    expect(view.premium).toBe(true);
    expect(view.fiches).toEqual(october.fiches);
    expect(view.apercus).toEqual([]);
    expect(view.totalFiches).toBe(october.fiches.length);
  });

  it("ne modifie pas le carnet source", () => {
    const before = JSON.stringify(october);
    carnetViewForPlan(october, null);
    expect(JSON.stringify(october)).toBe(before);
  });
});

describe("parseCarnets", () => {
  it("écarte un fichier mal formé sans casser les autres", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const parsed = parseCarnets([{ mois: "2026-13", titre: "x" }, CARNET_FIXTURES[0]]);
    expect(parsed).toEqual([CARNET_FIXTURES[0]]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("JSON réels de src/data/carnet", () => {
  const dir = path.join(__dirname, "../../data/carnet");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}\.json$/.test(f)) : [];

  it.each(files.length > 0 ? files : ["(aucun fichier)"])("%s respecte le format", (file) => {
    if (file === "(aucun fichier)") return;
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    expect(parseCarnets([raw])).toHaveLength(1);
    expect(raw.mois).toBe(file.replace(".json", ""));
    const ids = raw.fiches.map((f: { id: string }) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("server only", () => {
  it("aucun fichier \"use client\" n'importe @/lib/carnet", () => {
    const root = path.join(__dirname, "../..");
    const offenders: string[] = [];
    const walk = (d: string) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "__tests__") walk(full);
        } else if (/\.tsx?$/.test(entry.name)) {
          const src = fs.readFileSync(full, "utf8");
          if (/^\s*["']use client["']/.test(src) && src.includes("@/lib/carnet")) offenders.push(full);
        }
      }
    };
    walk(root);
    expect(offenders).toEqual([]);
  });
});
