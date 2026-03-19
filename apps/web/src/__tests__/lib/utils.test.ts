import { cn, USER_LEVELS, formatDateFr } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("resolves tailwind conflicts", () => {
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("handles undefined and null", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });
});

describe("USER_LEVELS", () => {
  it("has 5 levels", () => {
    expect(Object.keys(USER_LEVELS)).toHaveLength(5);
  });

  it("NOVICE starts at 0 XP", () => {
    expect(USER_LEVELS.NOVICE.minXp).toBe(0);
    expect(USER_LEVELS.NOVICE.label).toBe("Novice");
    expect(USER_LEVELS.NOVICE.icon).toBe("🌱");
  });

  it("APPRENTI requires 100 XP", () => {
    expect(USER_LEVELS.APPRENTI.minXp).toBe(100);
  });

  it("FARCEUR requires 500 XP", () => {
    expect(USER_LEVELS.FARCEUR.minXp).toBe(500);
  });

  it("COMIQUE requires 1500 XP", () => {
    expect(USER_LEVELS.COMIQUE.minXp).toBe(1500);
  });

  it("LEGENDE requires 5000 XP", () => {
    expect(USER_LEVELS.LEGENDE.minXp).toBe(5000);
    expect(USER_LEVELS.LEGENDE.label).toBe("Légende");
    expect(USER_LEVELS.LEGENDE.icon).toBe("👑");
  });

  it("XP thresholds are in ascending order", () => {
    const xps = Object.values(USER_LEVELS).map((l) => l.minXp);
    for (let i = 1; i < xps.length; i++) {
      expect(xps[i]).toBeGreaterThan(xps[i - 1]);
    }
  });
});


describe("formatDateFr", () => {
  it("formats a date in French", () => {
    const date = new Date("2024-03-15");
    const formatted = formatDateFr(date);
    expect(formatted).toContain("mars");
    expect(formatted).toContain("2024");
  });

  it("includes day number", () => {
    const date = new Date("2024-12-25");
    const formatted = formatDateFr(date);
    expect(formatted).toContain("25");
    expect(formatted).toContain("décembre");
  });
});
