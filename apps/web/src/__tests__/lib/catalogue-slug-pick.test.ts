import { buildFormerTipSlugs, buildTipSlug, buildVideoSlug, pickBySlug, resolveBySlug } from "@/lib/catalogue-slug";

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

// s18 : C033, C042 et C081 partagent le préfixe cmmp8ozsx0. L'ancienne URL de
// C081 (« Construire une histoire drôle ») partait vers C033, qui avait plus de
// mots en commun ; l'ancien slug exact (originalTitle) doit l'emporter.
describe("pickBySlug : ancien slug exact via originalTitle (cas C081)", () => {
  const c033 = {
    id: "cmmp8ozsx0005qk63z3voy5t9",
    isActive: true,
    title: "Le callback : faire revenir une vanne au bon moment",
    originalTitle: "Le callback : faire revenir une blague au bon moment",
  };
  const c042 = {
    id: "cmmp8ozsx000cqk63y6ijkl7h",
    isActive: true,
    title: "Ne jamais expliquer sa vanne",
    originalTitle: "Ne jamais expliquer sa blague",
  };
  const c081 = {
    id: "cmmp8ozsx0004qk63x4cxt89b",
    isActive: true,
    title: "Dérailler le plus tard possible",
    originalTitle: "Construire une histoire drôle",
  };
  const candidates = [c033, c042, c081];
  const oldSlug = "construire-une-histoire-drole-cmmp8ozsx0";

  it("reproduit le défaut : le score de mots seul choisit C033", () => {
    expect(pickBySlug(candidates, oldSlug, buildTipSlug)).toBe(c033);
  });

  it("l'ancien slug de C081 résout C081, dont le slug canonique est le nouveau", () => {
    expect(buildFormerTipSlugs(c081)).toEqual([oldSlug]);
    const res = resolveBySlug(candidates, oldSlug, buildTipSlug, buildFormerTipSlugs);
    expect(res).toEqual({ status: "active", item: c081 });
    expect(buildTipSlug(c081)).toBe("derailler-le-plus-tard-possible-cmmp8ozsx0");
  });

  it("les anciens slugs de C033 et C042 et les slugs canoniques restent bien résolus", () => {
    for (const tip of candidates) {
      expect(pickBySlug(candidates, buildTipSlug(tip), buildTipSlug, buildFormerTipSlugs)).toBe(tip);
      expect(pickBySlug(candidates, buildFormerTipSlugs(tip)[0], buildTipSlug, buildFormerTipSlugs)).toBe(tip);
    }
  });

  it("le slug canonique d'une fiche passe avant l'ancien slug d'une autre", () => {
    const other = { ...c042, originalTitle: "Dérailler le plus tard possible" };
    const slug = buildTipSlug(c081);
    expect(pickBySlug([other, c081], slug, buildTipSlug, buildFormerTipSlugs)).toBe(c081);
  });

  it("sans originalTitle, aucun ancien slug", () => {
    expect(buildFormerTipSlugs({ id: "cs14tip5ec09481ad1271238e", originalTitle: null })).toEqual([]);
  });
});
