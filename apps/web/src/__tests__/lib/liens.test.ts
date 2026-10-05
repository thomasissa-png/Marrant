/**
 * Lien de bio (v5 §2.1 et §2.2) : UTM par route et par bloc, règle des 48 h.
 */
import { buildBioHref, isArticleRecent, orderLiensBlocs, origineFromSegment } from "@/lib/liens";

describe("origineFromSegment", () => {
  it("/liens → instagram, /liens/x → x, /liens/li → linkedin", () => {
    expect(origineFromSegment(undefined)).toBe("instagram");
    expect(origineFromSegment("x")).toBe("x");
    expect(origineFromSegment("li")).toBe("linkedin");
  });

  it.each(["linkedin", "instagram", "ig", "toString", "", "X"])("segment %p → aucune route", (s) => {
    expect(origineFromSegment(s)).toBeNull();
  });
});

describe("buildBioHref", () => {
  it("UTM complètes, utm_content du bloc", () => {
    expect(buildBioHref("/quiz-humour", "x", "quiz")).toBe(
      "/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=bio&utm_content=bio-quiz",
    );
    expect(buildBioHref("/parcours/repartie", "linkedin", "parcours")).toBe(
      "/parcours/repartie?utm_source=linkedin&utm_medium=social&utm_campaign=bio&utm_content=bio-parcours",
    );
  });

  it("chemin avec query : paramètres ajoutés après &", () => {
    expect(buildBioHref("/vannes?tri=recent", "instagram", "vannes")).toBe(
      "/vannes?tri=recent&utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=bio-vannes",
    );
  });
});

describe("règle des 48 h", () => {
  const published = "2026-10-05T07:00:00.000Z";

  it.each([
    ["2026-10-05T07:00:00.000Z", true],
    ["2026-10-07T06:59:59.999Z", true],
    ["2026-10-07T07:00:00.000Z", false],
    ["2026-10-05T06:00:00.000Z", false],
  ])("à %s : récent = %s", (now, expected) => {
    expect(isArticleRecent(published, new Date(now))).toBe(expected);
  });

  it("date absente ou invalide : pas récent", () => {
    expect(isArticleRecent(null, new Date())).toBe(false);
    expect(isArticleRecent("pas une date", new Date())).toBe(false);
  });

  const now = new Date("2026-10-06T12:00:00.000Z");

  it("article de moins de 48 h : article, quiz, vanne, parcours, vannes, conseils", () => {
    expect(orderLiensBlocs({ articlePublishedAt: published, hasArticle: true, hasVanne: true }, now)).toEqual([
      "article", "quiz", "vanne", "parcours", "vannes", "conseils",
    ]);
  });

  it("article plus ancien : quiz en premier", () => {
    expect(
      orderLiensBlocs({ articlePublishedAt: "2026-10-01T07:00:00.000Z", hasArticle: true, hasVanne: true }, now),
    ).toEqual(["quiz", "article", "vanne", "parcours", "vannes", "conseils"]);
  });

  it("sans article ni vanne : blocs retirés, ordre conservé", () => {
    expect(orderLiensBlocs({ articlePublishedAt: null, hasArticle: false, hasVanne: false }, now)).toEqual([
      "quiz", "parcours", "vannes", "conseils",
    ]);
  });
});
