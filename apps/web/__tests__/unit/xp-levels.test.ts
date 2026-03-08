// Test du calcul de niveau — réplique de la logique dans /api/user/xp
const XP_THRESHOLDS = {
  NOVICE: 0,
  APPRENTI: 100,
  FARCEUR: 500,
  COMIQUE: 1500,
  LEGENDE: 5000,
} as const;

type UserLevel = keyof typeof XP_THRESHOLDS;

function calculateLevel(xp: number): UserLevel {
  if (xp >= XP_THRESHOLDS.LEGENDE) return "LEGENDE";
  if (xp >= XP_THRESHOLDS.COMIQUE) return "COMIQUE";
  if (xp >= XP_THRESHOLDS.FARCEUR) return "FARCEUR";
  if (xp >= XP_THRESHOLDS.APPRENTI) return "APPRENTI";
  return "NOVICE";
}

describe("calculateLevel — calcul du niveau utilisateur", () => {
  it("retourne NOVICE pour 0 XP", () => {
    expect(calculateLevel(0)).toBe("NOVICE");
  });

  it("retourne NOVICE pour 99 XP (juste sous le seuil APPRENTI)", () => {
    expect(calculateLevel(99)).toBe("NOVICE");
  });

  it("retourne APPRENTI pour exactement 100 XP", () => {
    expect(calculateLevel(100)).toBe("APPRENTI");
  });

  it("retourne FARCEUR pour 500 XP", () => {
    expect(calculateLevel(500)).toBe("FARCEUR");
  });

  it("retourne COMIQUE pour 1500 XP", () => {
    expect(calculateLevel(1500)).toBe("COMIQUE");
  });

  it("retourne LEGENDE pour 5000 XP", () => {
    expect(calculateLevel(5000)).toBe("LEGENDE");
  });

  it("retourne LEGENDE pour un XP très élevé", () => {
    expect(calculateLevel(999999)).toBe("LEGENDE");
  });

  it("gère les valeurs aux frontières (seuils - 1)", () => {
    expect(calculateLevel(99)).toBe("NOVICE");
    expect(calculateLevel(499)).toBe("APPRENTI");
    expect(calculateLevel(1499)).toBe("FARCEUR");
    expect(calculateLevel(4999)).toBe("COMIQUE");
  });

  it("les seuils sont en ordre croissant", () => {
    const values = Object.values(XP_THRESHOLDS);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});
