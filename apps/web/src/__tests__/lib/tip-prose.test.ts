import { tipProse } from "@/lib/tip-prose";

const NBSP = String.fromCharCode(0xa0);

describe("tipProse", () => {
  it("retire les tirets cadratins et passe les répliques en guillemets français", () => {
    const out = tipProse("Ne te défends pas — complimente-le sur son 'expertise' du sujet.");
    expect(out).not.toContain("—");
    expect(out).toContain(`«${NBSP}expertise${NBSP}»`);
    expect(out).toContain("complimente-le sur son");
  });

  it("laisse les apostrophes des mots intactes", () => {
    expect(tipProse("L'autre a dit aujourd'hui qu'il rit.")).toBe("L'autre a dit aujourd'hui qu'il rit.");
  });

  it("ne change pas un texte déjà propre", () => {
    const text = "Observe, puis rebondis sur le dernier mot.";
    expect(tipProse(text)).toBe(text);
  });
});
