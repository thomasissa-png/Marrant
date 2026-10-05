/**
 * @jest-environment node
 *
 * Dates et heures de Paris (s15) : passage à l'heure d'hiver (25/10/2026) et
 * à l'heure d'été (28/03/2027), minuit de Paris, lundi de la semaine.
 */
import { ajouterJours, dateParis, jourSemaine, lundiDe, parisVersUtc } from "@/lib/social/heure-paris";

describe("heure-paris", () => {
  it("dateParis : la date bascule à minuit de Paris, pas à minuit UTC", () => {
    expect(dateParis(new Date("2026-10-11T21:59:00Z"))).toBe("2026-10-11");
    expect(dateParis(new Date("2026-10-11T22:00:00Z"))).toBe("2026-10-12");
    expect(dateParis(new Date("2026-12-31T23:30:00Z"))).toBe("2027-01-01");
  });

  it("parisVersUtc : heure d'été, heure d'hiver du 25/10, heure d'été du 28/03/2027", () => {
    expect(parisVersUtc("2026-10-24", 12, 30).toISOString()).toBe("2026-10-24T10:30:00.000Z");
    expect(parisVersUtc("2026-10-25", 12, 30).toISOString()).toBe("2026-10-25T11:30:00.000Z");
    expect(parisVersUtc("2026-10-27", 8, 15).toISOString()).toBe("2026-10-27T07:15:00.000Z");
    expect(parisVersUtc("2027-03-27", 19, 30).toISOString()).toBe("2027-03-27T18:30:00.000Z");
    expect(parisVersUtc("2027-03-29", 12, 30).toISOString()).toBe("2027-03-29T10:30:00.000Z");
    expect(parisVersUtc("2026-11-16", 0, 0).toISOString()).toBe("2026-11-15T23:00:00.000Z");
  });

  it("ajouterJours, jourSemaine, lundiDe", () => {
    expect(ajouterJours("2026-12-31", 1)).toBe("2027-01-01");
    expect(ajouterJours("2026-10-25", -1)).toBe("2026-10-24");
    expect(jourSemaine("2026-10-12")).toBe(1);
    expect(jourSemaine("2026-11-08")).toBe(0);
    expect(lundiDe("2026-11-08")).toBe("2026-11-02");
    expect(lundiDe("2026-11-11")).toBe("2026-11-09");
    expect(lundiDe("2026-11-09")).toBe("2026-11-09");
  });
});
