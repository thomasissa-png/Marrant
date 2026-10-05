/**
 * @jest-environment node
 *
 * Garde des relais d'article (plan v2 §6, §7, R3) : lecture des marqueurs posés
 * par le script de lot, repli valide, conservation des marqueurs à la relance.
 */
import {
  articleSlugDuPost,
  conserverMarqueurs,
  estDateOuRelais,
  noteRelaisRejete,
  repliDuPost,
  repliValide,
} from "@/lib/social/garde-article";

const base = { content: "Une vanne.", cta: null, directorNote: null };

describe("garde-article", () => {
  it("articleSlugDuPost : marqueur, puis lien /blog/ du texte, puis 1er commentaire LinkedIn", () => {
    expect(articleSlugDuPost({ ...base, directorNote: "[article:repas-de-famille] Lot x" })).toBe("repas-de-famille");
    expect(articleSlugDuPost({ ...base, content: "Vanne\n\nhttps://deviens-marrant.fr/blog/toast-drole?utm_source=x" })).toBe("toast-drole");
    expect(articleSlugDuPost({ ...base, cta: "https://deviens-marrant.fr/blog/humour-en-visio?utm_source=linkedin" })).toBe("humour-en-visio");
    expect(articleSlugDuPost({ ...base, content: "Le quiz : https://deviens-marrant.fr/quiz-humour?utm_source=x" })).toBeNull();
  });

  it("repliDuPost et estDateOuRelais", () => {
    expect(repliDuPost("[article:a] [repli:c0ffee12] Lot x")).toBe("c0ffee12");
    expect(repliDuPost("Lot x")).toBeNull();
    expect(estDateOuRelais({ ...base, directorNote: "[date:2026-10-30] Lot x (VANNE)" })).toBe(true);
    expect(estDateOuRelais({ ...base, directorNote: "[article:a] Lot x" })).toBe(true);
    expect(estDateOuRelais({ ...base, directorNote: "Lot x (VANNE)" })).toBe(false);
  });

  it("conserverMarqueurs : article, repli et date survivent, le reste de l'ancienne note non", () => {
    expect(conserverMarqueurs("[article:a] [repli:r1] [date:2026-10-30] Lot x", "Échec publication Buffer : 500 [retry:1]"))
      .toBe("[article:a] [repli:r1] [date:2026-10-30] Échec publication Buffer : 500 [retry:1]");
    expect(conserverMarqueurs("Lot x", "Nouvelle note")).toBe("Nouvelle note");
    expect(conserverMarqueurs(null, "Nouvelle note")).toBe("Nouvelle note");
  });

  it("repliValide : réserve REJECTED du même réseau, liée à ce relais", () => {
    const relais = { id: "x1", platform: "TWITTER" };
    const repli = { status: "REJECTED", platform: "TWITTER", directorNote: "[repli-de:x1] Lot x (VANNE)" };
    expect(repliValide(repli, relais)).toBe(true);
    expect(repliValide(null, relais)).toBe(false);
    expect(repliValide({ ...repli, status: "PUBLISHED" }, relais)).toBe(false);
    expect(repliValide({ ...repli, platform: "INSTAGRAM" }, relais)).toBe(false);
    expect(repliValide({ ...repli, directorNote: "[repli-de:x12] Lot x" }, relais)).toBe(false);
  });

  it("noteRelaisRejete : avec ou sans repli", () => {
    expect(noteRelaisRejete("a", "r1", "Lot x")).toBe("Relais rejeté : article « a » non publié à l'heure de l'envoi (repli r1 envoyé sur le même créneau). Lot x");
    expect(noteRelaisRejete("a", null, null)).toBe("Relais rejeté : article « a » non publié à l'heure de l'envoi (aucun repli en réserve, créneau vide).");
  });
});
