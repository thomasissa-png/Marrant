import { cn, formatDateFr, USER_LEVELS } from "@/lib/utils";

describe("cn — fusion de classes Tailwind", () => {
  it("fusionne des classes simples", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("résout les conflits Tailwind", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("gère les valeurs conditionnelles", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("gère les valeurs undefined", () => {
    expect(cn("base", undefined, "extra")).toBe("base extra");
  });
});

describe("formatDateFr — formatage de date en français", () => {
  it("formate une date correctement", () => {
    const date = new Date("2026-03-07");
    const formatted = formatDateFr(date);
    expect(formatted).toContain("mars");
    expect(formatted).toContain("2026");
  });
});

describe("USER_LEVELS — niveaux utilisateur", () => {
  it("a 5 niveaux définis", () => {
    expect(Object.keys(USER_LEVELS)).toHaveLength(5);
  });

  it("Novice commence à 0 XP", () => {
    expect(USER_LEVELS.NOVICE.minXp).toBe(0);
  });

  it("Légende est le plus haut niveau", () => {
    expect(USER_LEVELS.LEGENDE.minXp).toBe(5000);
  });

  it("les niveaux sont croissants", () => {
    const xps = Object.values(USER_LEVELS).map((l) => l.minXp);
    for (let i = 1; i < xps.length; i++) {
      expect(xps[i]).toBeGreaterThan(xps[i - 1]);
    }
  });
});

