import { splitLearning } from "@/lib/learning-format";

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
