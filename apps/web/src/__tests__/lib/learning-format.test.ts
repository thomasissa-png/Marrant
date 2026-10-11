import { fixInvertedCase, splitLearning } from "@/lib/learning-format";

describe("splitLearning", () => {
  it("met en casse phrase un titre tout en majuscules", () => {
    expect(splitLearning("TECHNIQUE DU PERSONNAGE CANDIDE : crée un décalage")).toEqual({
      title: "Technique du personnage candide",
      rest: " : crée un décalage",
    });
  });

  it("garde la casse d'un titre déjà en casse mixte", () => {
    expect(splitLearning("Le rythme de Fary : trois temps")?.title).toBe("Le rythme de Fary");
  });

  it("renvoie null sans séparateur", () => {
    expect(splitLearning("Observer avant de parler")).toBeNull();
  });
});

describe("fixInvertedCase (casse inversée corrigée au rendu)", () => {
  it("rétablit une frappe en verrouillage majuscule", () => {
    expect(fixInvertedCase("DÉFI MIME : eN GROUPE, choisis 3 trucs")).toBe(
      "DÉFI MIME : En groupe, choisis 3 trucs"
    );
    expect(fixInvertedCase("éTÉ CHAUD. OK")).toBe("Été chaud. OK");
  });

  it("ne touche pas aux majuscules volontaires ni aux marques", () => {
    expect(fixInvertedCase("Parle UNIQUEMENT du RESSENTI.")).toBe("Parle UNIQUEMENT du RESSENTI.");
    expect(fixInvertedCase("iPhone et TV")).toBe("iPhone et TV");
    expect(fixInvertedCase("")).toBe("");
  });
});
