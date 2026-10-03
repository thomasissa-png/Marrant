import { roundDownMarketing, formatCount } from "@/lib/content-stats-server";

describe("roundDownMarketing", () => {
  it("arrondit à la dizaine inférieure au-dessus de 100 (GO Thomas 03/10 : arrondi à la dizaine)", () => {
    expect(roundDownMarketing(125)).toBe(120);
    expect(roundDownMarketing(109)).toBe(100);
    expect(roundDownMarketing(602)).toBe(600);
    expect(roundDownMarketing(499)).toBe(490);
    expect(roundDownMarketing(562)).toBe(560);
    expect(roundDownMarketing(372)).toBe(370);
    expect(roundDownMarketing(100)).toBe(100);
  });

  it("arrondit à la dizaine inférieure en dessous de 100", () => {
    expect(roundDownMarketing(89)).toBe(80);
    expect(roundDownMarketing(66)).toBe(60);
    expect(roundDownMarketing(10)).toBe(10);
    expect(roundDownMarketing(9)).toBe(0);
  });

  it("renvoie 0 pour les valeurs invalides", () => {
    expect(roundDownMarketing(0)).toBe(0);
    expect(roundDownMarketing(-5)).toBe(0);
    expect(roundDownMarketing(NaN)).toBe(0);
    expect(roundDownMarketing(Infinity)).toBe(0);
  });
});

describe("formatCount", () => {
  it("formate en '600+' quand la valeur est > 0", () => {
    expect(formatCount(602, "des centaines")).toBe("600+");
    expect(formatCount(89, "des dizaines")).toBe("80+");
    expect(formatCount(125, "des centaines")).toBe("120+");
  });

  it("renvoie le fallback texte quand la valeur est 0", () => {
    expect(formatCount(0, "des centaines")).toBe("des centaines");
    expect(formatCount(NaN, "des dizaines")).toBe("des dizaines");
  });
});
