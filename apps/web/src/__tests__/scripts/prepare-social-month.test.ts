/**
 * @jest-environment node
 *
 * Préparation mensuelle des posts sociaux (s14) : plan déterministe, règles de
 * Thomas du 01/10 et contrôle bloquant sans IA. Données simulées, aucune base.
 */
const mockLaVanne = jest.fn().mockResolvedValue(Buffer.from("png"));
const mockRenderSlides = jest.fn().mockResolvedValue([Buffer.from("slide")]);
jest.mock("@/lib/social/image-generator", () => ({
  generateLaVanne: (...a: unknown[]) => mockLaVanne(...a),
  renderSlides: (...a: unknown[]) => mockRenderSlides(...a),
  generateTechniqueDuJour: jest.fn(),
  generateLeDefi: jest.fn(),
}));

import { generatePostImage, nombreDeSlides, slidesDuPost, texteAlternatifDuPost } from "@/lib/social/generate-post-image";
import { checkPost } from "../../../scripts/content/social-controls";
import {
  buildPlan,
  CADENCE_V2,
  estAngleBureau,
  IG_ARTICLE_LINE,
  LI_ARTICLE_LINE,
  QUIZ_LINE,
  drawSample,
  parisToUtc,
  utmLink,
  vanneText,
  type CatalogueJoke,
} from "../../../scripts/content/social-month-plan";
import { renderMarkdown, toRows } from "../../../scripts/content/prepare-social-month";

const joke = (n: number, extra: Partial<CatalogueJoke> = {}): CatalogueJoke => ({
  id: `j${String(n).padStart(3, "0")}`,
  setup: `Amorce numéro ${n} du catalogue.`,
  punchline: `Chute numéro ${n}.`,
  isActive: true,
  verdict: "GARDER",
  ...extra,
});

const POOL = Array.from({ length: 80 }, (_, i) => joke(i + 1));

/** Vanne du jour : j001 le 01/10, j002 le 02/10, etc. (semaines complètes). */
function dailyMap(start: string, days: number, offset = 1): Map<string, CatalogueJoke> {
  const m = new Map<string, CatalogueJoke>();
  for (let i = 0; i < days; i++) {
    const d = new Date(`${start}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    m.set(d.toISOString().slice(0, 10), POOL[(i + offset - 1) % POOL.length]);
  }
  return m;
}

const ARTICLES = [
  { slug: "blagues-halloween-soiree-deguisee", title: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée", date: "2026-10-05" },
];

function octoberPlan(overrides: Partial<Parameters<typeof buildPlan>[0]> = {}) {
  return buildPlan({
    month: "2026-10", from: "2026-10-02", daily: dailyMap("2026-09-28", 42), pool: POOL,
    articles: ARTICLES, alreadyUsed: [], ...overrides,
  });
}

describe("checkPost : contrôle bloquant sans IA", () => {
  const base = { platform: "TWITTER" as const, quoted: "" };
  it("accepte une vanne propre, « je » compris dans la vanne", () => {
    const v = "Je dis toujours oui.\nMon agenda dit non.";
    expect(checkPost({ ...base, text: v, quoted: v })).toEqual([]);
  });
  it("refuse tiret cadratin, gros mot, « je » hors vanne, longueur ; accepte un humoriste nommé", () => {
    expect(checkPost({ ...base, text: "Une idée — une autre" })).toContain("tiret cadratin");
    expect(checkPost({ ...base, text: "Ah merde." }).join()).toContain("merde");
    expect(checkPost({ ...base, text: "Comme Fary en spectacle." })).toEqual([]);
    expect(checkPost({ ...base, text: "Vanne.\nJe la trouve bonne.", quoted: "Vanne." })).toContain("« je » hors de la vanne");
    expect(checkPost({ ...base, text: "x".repeat(271) }).join()).toContain("trop long");
    expect(checkPost({ platform: "INSTAGRAM", quoted: "", text: "x".repeat(151) }).join()).toContain("trop long");
  });
  it("ne confond pas un mot courant avec un nom (roman, cons-truire)", () => {
    expect(checkPost({ ...base, text: "Un roman à construire." })).toEqual([]);
  });
  it("ignore les slugs des liens pour le contrôle « je »", () => {
    const t = "Titre\nhttps://deviens-marrant.fr/blog/ma-blague?utm_source=x";
    expect(checkPost({ ...base, text: t, quoted: "Titre" })).toEqual([]);
  });
});

describe("buildPlan : stratégie v2 (05/10) et règles maintenues du 01/10", () => {
  it("cadence v2 : 5 X + 4 Instagram automatiques (mercredi décryptage à part) + 2 LinkedIn par semaine", () => {
    const { posts, errors, warnings } = octoberPlan();
    expect(errors).toEqual([]);
    const week = posts.filter((p) => p.date >= "2026-10-05" && p.date <= "2026-10-11");
    expect(week.filter((p) => p.platform === "TWITTER")).toHaveLength(5);
    expect(week.filter((p) => p.platform === "INSTAGRAM").map((p) => p.date)).toEqual(["2026-10-05", "2026-10-06", "2026-10-08", "2026-10-09"]);
    expect(week.filter((p) => p.platform === "LINKEDIN").map((p) => `${p.date} ${p.parisTime}`)).toEqual(["2026-10-06 08:15", "2026-10-08 08:15"]);
    expect(warnings.join()).toContain("2026-10-07 INSTAGRAM : carrousel décryptage à préparer à part");
    expect(posts.every((p) => p.date >= "2026-10-02" && p.date <= "2026-10-31")).toBe(true);
  });

  it("cadence paramétrable : une stratégie v3 n'a qu'à fournir la sienne", () => {
    const { posts } = octoberPlan({ cadence: { LINKEDIN: { h: 9, m: 0, jours: { 3: "VANNE" } } } });
    expect(posts.every((p) => p.platform === "LINKEDIN" && p.parisTime === "09:00" && new Date(`${p.date}T12:00:00Z`).getUTCDay() === 3)).toBe(true);
    expect(CADENCE_V2.LINKEDIN!.jours).toEqual({ 2: "RELAIS_BUREAU_OU_VANNE", 4: "RELAIS_BUREAU_OU_VANNE" });
  });

  it("X mercredi : vanne puis ligne quiz avec lien UTM, 270 caractères max", () => {
    const { posts } = octoberPlan();
    const wed = posts.find((p) => p.date === "2026-10-07" && p.platform === "TWITTER")!;
    expect(wed.kind).toBe("VANNE_QUIZ");
    expect(wed.text).toContain(`\n\n${QUIZ_LINE} https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz`);
    expect(wed.text.length).toBeLessThanOrEqual(270);
  });

  it("LinkedIn : relais d'article à angle bureau (lien en 1er commentaire), sinon vanne de bureau, jamais 2 relais par semaine", () => {
    const bureau = { slug: "pot-de-depart-discours-drole", title: "Pot de départ : 6 phrases pour faire rire tes collègues", date: "2026-10-12" };
    const jeudi = { slug: "visio-humour-reunion", title: "Humour en visio : 5 vannes de réunion", date: "2026-10-15" };
    const pool = POOL.map((j, i) => (i < 5 ? { ...j, category: "BOULOT" } : j));
    const { posts } = octoberPlan({ articles: [...ARTICLES, bureau, jeudi], pool });
    const mardi = posts.find((p) => p.date === "2026-10-13" && p.platform === "LINKEDIN")!;
    expect(mardi.kind).toBe("ARTICLE");
    expect(mardi.text).toBe(`${bureau.title}\n${LI_ARTICLE_LINE}`);
    expect(mardi.text).not.toContain("http");
    expect(mardi.firstComment).toBe(utmLink("https://deviens-marrant.fr", bureau.slug, "LINKEDIN", "2026-10", "commentaire"));
    const jeu = posts.find((p) => p.date === "2026-10-15" && p.platform === "LINKEDIN")!;
    expect(jeu.kind).not.toBe("ARTICLE"); // 2e relais de la semaine refusé
    expect(["j001", "j002", "j003", "j004", "j005"]).toContain(posts.find((p) => p.date === "2026-10-06" && p.platform === "LINKEDIN")!.sourceId);
    const halloween = posts.find((p) => p.date === "2026-10-06" && p.platform === "LINKEDIN")!;
    expect(halloween.kind).not.toBe("ARTICLE"); // Halloween : pas d'angle bureau
  });

  it("LinkedIn : jamais une amorce coupée par « voir plus » (> 140 caractères)", () => {
    const longue = joke(600, { setup: `${"Amorce très longue ".repeat(9)}fin.`, category: "BOULOT" });
    const { posts } = octoberPlan({ pool: [longue, ...POOL] });
    expect(posts.some((p) => p.platform === "LINKEDIN" && p.sourceId === "j600")).toBe(false);
  });

  it("angle bureau : mots du slug ou du titre", () => {
    expect(estAngleBureau({ slug: "soiree-de-noel-au-boulot", title: "x", date: "" })).toBe(true);
    expect(estAngleBureau({ slug: "blagues-halloween", title: "Blagues d'Halloween", date: "" })).toBe(false);
  });

  it("X reprend la vanne du jour mot pour mot", () => {
    const { posts } = octoberPlan();
    const tue = posts.find((p) => p.date === "2026-10-06" && p.platform === "TWITTER")!;
    const daily = dailyMap("2026-09-28", 42).get("2026-10-06")!;
    expect(tue.kind).toBe("VANNE_DU_JOUR");
    expect(tue.text).toBe(vanneText(daily));
    expect(tue.sourceId).toBe(daily.id);
  });

  it("vanne du jour non GARDER → repli catalogue documenté", () => {
    const daily = dailyMap("2026-09-28", 42);
    daily.set("2026-10-06", joke(999, { verdict: "REECRIRE" }));
    const tue = octoberPlan({ daily }).posts.find((p) => p.date === "2026-10-06" && p.platform === "TWITTER")!;
    expect(tue.kind).toBe("VANNE");
    expect(tue.note).toContain("non validée");
  });

  it("jamais deux fois la même vanne sur une plateforme dans le mois", () => {
    const { posts } = octoberPlan({ alreadyUsed: [{ platform: "INSTAGRAM", sourceId: "j050" }] });
    for (const pf of ["TWITTER", "INSTAGRAM"]) {
      const ids = posts.filter((p) => p.platform === pf && p.sourceType === "JOKE").map((p) => p.sourceId);
      expect(new Set(ids).size).toBe(ids.length);
    }
    expect(posts.some((p) => p.platform === "INSTAGRAM" && p.sourceId === "j050")).toBe(false);
  });

  it("Instagram n'utilise jamais une vanne du jour de la même semaine", () => {
    const daily = dailyMap("2026-09-28", 42);
    const { posts } = octoberPlan({ daily });
    for (const p of posts.filter((x) => x.platform === "INSTAGRAM" && x.sourceType === "JOKE")) {
      const monday = new Date(`${p.date}T12:00:00Z`);
      monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setUTCDate(d.getUTCDate() + i);
        expect(daily.get(d.toISOString().slice(0, 10))?.id).not.toBe(p.sourceId);
      }
      expect(p.card).toEqual({ setup: expect.any(String), punchline: expect.any(String) });
      expect(p.text.split("\n").slice(0, 2).join("\n")).toBe(`${p.card!.setup}\n${p.card!.punchline}`);
    }
  });

  it("lundi : article avec lien UTM (X dans le texte, Instagram « Lien en bio. » sans note de bio)", () => {
    const { posts } = octoberPlan();
    const x = posts.find((p) => p.date === "2026-10-05" && p.platform === "TWITTER")!;
    const ig = posts.find((p) => p.date === "2026-10-05" && p.platform === "INSTAGRAM")!;
    expect(x.kind).toBe("ARTICLE");
    expect(x.text).toContain("utm_source=x&utm_medium=social&utm_campaign=2026-10");
    expect(x.text).toContain("utm_content=lundi");
    expect(ig.link).toBe(utmLink("https://deviens-marrant.fr", ARTICLES[0].slug, "INSTAGRAM", "2026-10", "lundi"));
    expect(ig.text).not.toContain("http");
    expect(ig.text.endsWith(IG_ARTICLE_LINE)).toBe(true);
    expect(ig.note).toBeNull(); // la bio pointe une fois pour toutes vers /liens
  });

  it("lundi sans article → avertissement et vanne", () => {
    const { posts, warnings } = octoberPlan({ articles: [] });
    expect(warnings.join()).toContain("2026-10-05");
    expect(posts.find((p) => p.date === "2026-10-05" && p.platform === "TWITTER")!.sourceType).toBe("JOKE");
  });

  it("vanne trop longue pour la légende Instagram : jamais retenue sur Instagram", () => {
    const long = joke(500, { setup: "a ".repeat(80).trim() });
    const { posts } = octoberPlan({ pool: [long, ...POOL] });
    expect(posts.some((p) => p.platform === "INSTAGRAM" && p.sourceId === "j500")).toBe(false);
  });

  it("créneaux fixes en heure de Paris (heure d'été puis d'hiver)", () => {
    expect(parisToUtc("2026-10-06", 12, 30).toISOString()).toBe("2026-10-06T10:30:00.000Z");
    expect(parisToUtc("2026-10-27", 18, 30).toISOString()).toBe("2026-10-27T17:30:00.000Z");
  });

  it("déterministe : même graine, même plan et même échantillon de 10", () => {
    const a = octoberPlan().posts;
    const b = octoberPlan().posts;
    expect(a).toEqual(b);
    expect(drawSample(a, 10, "2026-10")).toEqual(drawSample(b, 10, "2026-10"));
    expect(drawSample(a, 10, "2026-10")).toHaveLength(10);
  });
});

describe("rendu et lignes à insérer", () => {
  it("markdown lisible sans tiret cadratin, lignes APPROVED prêtes", () => {
    const { posts, warnings, errors } = octoberPlan();
    const md = renderMarkdown("2026-10", "2026-10-02", posts, drawSample(posts, 10, "2026-10"), warnings, errors, "2026-10");
    expect(md).toContain("Échantillon de 10 posts");
    expect(md).not.toMatch(/—/);
    let n = 0;
    const rows = toRows(posts, "2026-10", () => `id${n++}`);
    const ig = rows.find((r) => r.platform === "INSTAGRAM" && r.sourceType === "JOKE")!;
    expect(ig.format).toBe("IMAGE_QUI_CLAQUE");
    expect(ig.threadParts).toHaveLength(2);
    expect(rows.find((r) => r.platform === "TWITTER")!.format).toBe("TWEET");
    expect(rows.find((r) => r.platform === "LINKEDIN")!.format).toBe("POTE_AU_TAF");
  });
});

describe("carrousel Instagram v3 (cartes piste A)", () => {
  const vanne = { format: "IMAGE_QUI_CLAQUE", hook: "Amorce", content: "Amorce\nChute", targetPersona: "YANIS", threadParts: ["Amorce", "Chute"] };

  it("vanne [amorce, chute] → 2 slides 4:5, slide n rendue seule", async () => {
    expect(nombreDeSlides(vanne)).toBe(2);
    expect(slidesDuPost(vanne)!.map((s) => [s.width, s.height])).toEqual([[1080, 1350], [1080, 1350]]);
    await generatePostImage(vanne, 1);
    expect(mockRenderSlides).toHaveBeenCalledTimes(1);
    expect(mockRenderSlides.mock.calls[0][0]).toHaveLength(1);
    expect(mockLaVanne).not.toHaveBeenCalled();
    expect(texteAlternatifDuPost(vanne)).toBe("Amorce Chute");
  });

  it("relais d'article (sourceType BLOG) → couverture + fin", () => {
    const article = { ...vanne, threadParts: [], sourceType: "BLOG", content: `Blagues d'Halloween : 8 vannes\n${IG_ARTICLE_LINE}` };
    expect(nombreDeSlides(article)).toBe(2);
    expect(texteAlternatifDuPost(article)).toBe("Blagues d'Halloween : 8 vannes");
  });

  it("anciens formats : image unique, anciens gabarits", async () => {
    expect(nombreDeSlides({ ...vanne, format: "TECHNIQUE_DU_JOUR" })).toBe(1);
    await generatePostImage({ ...vanne, threadParts: [], content: "Punch" });
    expect(mockLaVanne).toHaveBeenCalled();
  });
});
