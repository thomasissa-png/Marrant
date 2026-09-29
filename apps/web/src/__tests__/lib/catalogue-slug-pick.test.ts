import { buildVideoSlug, pickBySlug } from "@/lib/catalogue-slug";

// s11 : des cuid créés en rafale partagent leur shortId (10 caractères) —
// la résolution doit choisir le contenu dont le slug correspond.
describe("pickBySlug", () => {
  const a = { id: "cmumhxw9i00967d28jk6hghfu", title: "Vérino - Le distributeur de baguettes" };
  const b = { id: "cmumhxw9i00977d2894zy7n2t", title: "Élodie Poux - Survivre en école maternelle" };

  it("partage bien le même shortId (cas réel)", () => {
    expect(buildVideoSlug(a).slice(-10)).toBe(buildVideoSlug(b).slice(-10));
  });

  it("choisit le candidat dont le slug complet correspond", () => {
    expect(pickBySlug([a, b], buildVideoSlug(b), buildVideoSlug)).toBe(b);
    expect(pickBySlug([a, b], buildVideoSlug(a), buildVideoSlug)).toBe(a);
  });

  it("à défaut de correspondance exacte, prend le plus de mots en commun", () => {
    expect(pickBySlug([a, b], "elodie-poux-ecole-cmumhxw9i0", buildVideoSlug)).toBe(b);
  });

  it("gère les cas vides et uniques", () => {
    expect(pickBySlug([], "x", buildVideoSlug)).toBeNull();
    expect(pickBySlug([a], "nimporte-quoi-cmumhxw9i0", buildVideoSlug)).toBe(a);
  });
});
