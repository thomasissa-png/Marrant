/**
 * @jest-environment node
 *
 * Audit des parcours d'apprentissage s17, lot B (serveur de l'interface) :
 * D1 jamais de contenu payant pour un non-Premium (HTML ISR et API), D4
 * vannes actives servies au seul abonné, liens vers les fiches (SEO-05),
 * D8 titres et aperçu de partage, JSON-LD dédoublonné (SEO-04), 404 propre.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const userFindUnique = jest.fn();
const pathFindUnique = jest.fn();
const pathFindMany = jest.fn();
const progressFindUnique = jest.fn();
const progressFindMany = jest.fn();
const completionsFindMany = jest.fn();
const videoFindMany = jest.fn();
const jokeFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    learningPath: {
      findUnique: (...a: unknown[]) => pathFindUnique(...a),
      findMany: (...a: unknown[]) => pathFindMany(...a),
    },
    userPathProgress: {
      findUnique: (...a: unknown[]) => progressFindUnique(...a),
      findMany: (...a: unknown[]) => progressFindMany(...a),
    },
    userPathStepCompletion: { findMany: (...a: unknown[]) => completionsFindMany(...a) },
    video: { findMany: (...a: unknown[]) => videoFindMany(...a) },
    joke: { findMany: (...a: unknown[]) => jokeFindMany(...a) },
  },
}));

import type { ReactElement } from "react";
import { NextRequest } from "next/server";
import { GET as getBySlug } from "@/app/api/parcours/by-slug/[slug]/route";
import { GET as getList } from "@/app/api/parcours/route";
import ParcoursDetailPage, { generateMetadata } from "@/app/(dashboard)/parcours/[slug]/page";
import { metadata as hubMetadata } from "@/app/(dashboard)/parcours/page";
import { buildParcoursCourseJsonLd, buildParcoursItemListJsonLd, parcoursCourseId } from "@/lib/parcours-jsonld";
import { jokeSeedTexts, resolveStepJokes } from "@/lib/parcours-vannes";
import { withoutJokeTexts } from "@/lib/parcours-data";
import vannesActives from "../../../../../docs/content/vannes-actives-s17.json";
import { PARCOURS_BONUS_FIN_XP, PARCOURS_RYTHME_JOURS, prochaineEtapeConseillee, totalParcoursXp } from "@/lib/parcours-xp";
import { NEXT_STEP_DELAY_DAYS, PATH_COMPLETION_BONUS_XP } from "@/lib/progression";
import { normalizeParcoursSrc } from "@/lib/parcours-tracking";
import { recommendParcours } from "@/lib/parcours-orientation";
import { PREMIUM_MONTHLY_PRICE_CENTS } from "@/config/premium";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

const SLUG = "repartie";
const seed = (parcoursSeed as Array<{ slug: string; steps: Array<{ week: number; jokeIds?: number[]; videos?: Array<{ youtubeId: string }> }> }>).find(
  (p) => p.slug === SLUG,
)!;

function dbPath() {
  return {
    id: "db-repartie",
    slug: SLUG,
    title: "Parcours Répartie",
    steps: seed.steps.map((s) => ({
      id: `step-${s.week}`,
      order: s.week,
      dayNumber: s.week * 7,
      tip: {
        id: `cmtip${s.week}xxxxxxxx`,
        title: `Conseil ${s.week}`,
        content: `CONTENU SECRET ${s.week}`,
        category: "GENERAL",
        difficulty: "INTERMEDIAIRE",
        example: `EXEMPLE SECRET ${s.week}`,
        exercise: `EXERCICE SECRET ${s.week}`,
      },
    })),
  };
}

const firstJokeText = jokeSeedTexts(seed.steps[1].jokeIds![0])[0];

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue(null);
  pathFindUnique.mockResolvedValue(dbPath());
  progressFindUnique.mockResolvedValue(null);
  completionsFindMany.mockResolvedValue([]);
  videoFindMany.mockImplementation(async ({ where }: { where: { youtubeId: { in: string[] } } }) =>
    where.youtubeId.in.map((y, i) => ({ id: `cmvid${i}xxxxxxx`, title: `Vidéo ${y}`, youtubeId: y })),
  );
  jokeFindMany.mockResolvedValue([
    { id: "cmjoke1xxxxxxx", content: firstJokeText, punchline: "Chute active", comedyTechnique: "Technique" },
  ]);
});

async function bySlug() {
  const res = await getBySlug(new NextRequest(`https://deviens-marrant.fr/api/parcours/by-slug/${SLUG}`), { params: { slug: SLUG } });
  return res.json();
}

type Served = { order: number; locked?: boolean; jokes?: unknown[]; tipHref?: string; videos: Array<{ href?: string }> };

describe("API by-slug : vannes de l'étape (D4) et liens vers les fiches (SEO-05)", () => {
  it("visiteur : aucune vanne servie, aucune requête aux vannes, liens seulement sur l'étape 1", async () => {
    const body = await bySlug();
    const steps = body.path.steps as Served[];
    expect(jokeFindMany).not.toHaveBeenCalled();
    steps.forEach((s) => expect(s.jokes).toBeUndefined());
    expect(steps[0].tipHref).toMatch(/^\/conseils\/conseil-1-/);
    expect(steps[0].videos.every((v) => v.href?.startsWith("/videos/"))).toBe(true);
    steps.slice(1).forEach((s) => {
      expect(s.locked).toBe(true);
      expect(s.tipHref).toBeUndefined();
      expect(s.videos).toEqual([]);
    });
    expect(JSON.stringify(body)).not.toMatch(/SECRET [2-9]/);
  });

  it("Premium : vannes ACTIVES résolues par le texte, avec lien vers la fiche", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-premium" } });
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    progressFindUnique.mockResolvedValue({ completedSteps: [1], currentStep: 1, completedAt: null });
    completionsFindMany.mockResolvedValue([{ stepOrder: 1, completedAt: new Date("2026-10-05T10:00:00Z") }]);
    const body = await bySlug();
    expect(jokeFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ isActive: true }) }));
    const step2 = (body.path.steps as Served[])[1] as Served & { jokes: Array<{ content: string; href: string }> };
    expect(step2.jokes).toHaveLength(1);
    expect(step2.jokes[0]).toMatchObject({ content: firstJokeText, punchline: "Chute active" });
    expect(step2.jokes[0].href).toMatch(/^\/vannes\//);
    expect(body.stepValidations).toHaveLength(1);
  });

  it("table du lot A absente : pas de date, pas de panne", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u-premium" } });
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    progressFindUnique.mockResolvedValue({ completedSteps: [1], currentStep: 1, completedAt: null });
    completionsFindMany.mockRejectedValue(new Error("relation does not exist"));
    const body = await bySlug();
    expect(body.stepValidations).toEqual([]);
    expect(body.path.steps[1].tip.content).toBe("CONTENU SECRET 2");
  });
});

describe("Page /parcours/[slug] (ISR) : D1, D8, SEO-02, SEO-04, SEO-11", () => {
  function findDetailProps(node: unknown): { initialPath: { steps: Served[] } } | null {
    if (!node || typeof node !== "object") return null;
    const el = node as ReactElement<Record<string, unknown>>;
    if (el.props && "initialPath" in el.props) return el.props as unknown as { initialPath: { steps: Served[] } };
    const children = el.props?.children;
    for (const c of Array.isArray(children) ? children : [children]) {
      const found = findDetailProps(c);
      if (found) return found;
    }
    return null;
  }

  it("HTML partagé : jamais le conseil, le quiz, les vannes ni les vidéos des étapes 2+", async () => {
    const el = await ParcoursDetailPage({ params: { slug: SLUG } });
    const props = findDetailProps(el);
    expect(props).not.toBeNull();
    const raw = JSON.stringify(props!.initialPath);
    expect(raw).not.toMatch(/SECRET [2-9]/);
    props!.initialPath.steps.slice(1).forEach((s) => {
      expect(s.locked).toBe(true);
      expect(s.videos).toEqual([]);
      expect((s as unknown as { quiz: unknown[] }).quiz).toEqual([]);
    });
    expect(jokeFindMany).not.toHaveBeenCalled();
  });

  it("titres D8, « première étape gratuite » et aperçu de partage twitter propre à la page", async () => {
    const meta = await generateMetadata({ params: { slug: SLUG } });
    expect(meta.title).toEqual({ absolute: "Parcours Répartie : 4 semaines pour répondre du tac au tac" });
    expect(String(meta.description)).toContain("Première étape gratuite.");
    expect(String(meta.description)).not.toMatch(/cours gratuit/i);
    expect(meta.twitter).toMatchObject({ title: "Parcours Répartie : 4 semaines pour répondre du tac au tac" });
    expect(meta.openGraph).toMatchObject({ url: "https://deviens-marrant.fr/parcours/repartie" });
    for (const slug of ["machine-a-cafe", "confiance"]) {
      const m = await generateMetadata({ params: { slug } });
      expect(String(m.description).length).toBeLessThanOrEqual(160);
      expect(String(m.description)).toContain("Première étape gratuite.");
    }
  });

  it("parcours inconnu : une seule consigne robots, noindex", async () => {
    pathFindUnique.mockResolvedValue(null);
    const meta = await generateMetadata({ params: { slug: "slug-inexistant" } });
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("hub /parcours : titre D8 « Cours d'humour en ligne » et aperçu de partage de la page", () => {
    expect(hubMetadata.title).toEqual({ absolute: "Cours d'humour en ligne : 3 parcours pour devenir drôle" });
    expect(hubMetadata.openGraph).toMatchObject({ url: "https://deviens-marrant.fr/parcours" });
    expect(hubMetadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(String(hubMetadata.description)).toContain("Première étape gratuite.");
  });

  it("JSON-LD : Course avec @id, prix lu dans la config, sans tiret cadratin ; hub en ItemList", () => {
    const course = buildParcoursCourseJsonLd({ slug: "repartie", name: "Parcours — Répartie", description: "x", weeks: 4, difficulty: "EXPERT" });
    expect(course["@id"]).toBe(parcoursCourseId("repartie"));
    expect(course.offers.price).toBe((PREMIUM_MONTHLY_PRICE_CENTS / 100).toFixed(2));
    expect(course.name).not.toContain("—");
    expect(course.educationalLevel).toBe("Advanced");
    const list = buildParcoursItemListJsonLd([{ slug: "repartie", name: "Parcours Répartie" }]);
    expect(list["@type"]).toBe("ItemList");
    expect(list.itemListElement[0]).toMatchObject({ position: 1, url: "https://deviens-marrant.fr/parcours/repartie" });
  });
});

describe("API /api/parcours : progression par slug (FS-13 b, UX-06)", () => {
  it("renvoie la progression de chaque parcours, étapes dédoublonnées", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    pathFindMany.mockResolvedValue([{ id: "p1", slug: "repartie", title: "Parcours Répartie", steps: [] }]);
    progressFindMany.mockResolvedValue([{ learningPathId: "p1", completedSteps: [1, 1, 2], completedAt: null }]);
    const body = await (await getList()).json();
    expect(body.paths[0].progress).toEqual({ completedSteps: [1, 2], completedAt: null });
    expect(progressFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u1" } }));
  });
});

describe("Constantes partagées avec le lot A et provenance", () => {
  it("bonus de fin et rythme identiques à lib/progression (serveur)", () => {
    expect(PARCOURS_BONUS_FIN_XP).toBe(PATH_COMPLETION_BONUS_XP);
    expect(PARCOURS_RYTHME_JOURS).toBe(NEXT_STEP_DELAY_DAYS);
    expect(totalParcoursXp([{ moduleXp: 50 }, { moduleXp: 75 }, { moduleXp: 100 }])).toBe(325);
  });

  it("date conseillée : 7 jours après, null si déjà passée", () => {
    const now = new Date("2026-10-07T12:00:00Z");
    expect(prochaineEtapeConseillee("2026-10-05T12:00:00Z", now)?.toISOString()).toBe("2026-10-12T12:00:00.000Z");
    expect(prochaineEtapeConseillee("2026-09-01T12:00:00Z", now)).toBeNull();
    expect(prochaineEtapeConseillee(null, now)).toBeNull();
  });

  it("src : liste fermée, toute autre valeur devient direct", () => {
    expect(normalizeParcoursSrc("blog")).toBe("blog");
    expect(normalizeParcoursSrc("BLOG")).toBe("blog");
    expect(normalizeParcoursSrc("a@b.fr")).toBe("direct");
    expect(normalizeParcoursSrc(null)).toBe("direct");
  });
});

describe("PM-11 : orientation, la difficulté nommée passe avant « Partout »", () => {
  it.each([
    [["global", "repartie"], "repartie"],
    [["global", "content"], "machine-a-cafe"],
    [["global", "confiance"], "confiance"],
    [["global"], "confiance"],
    [["work", "repartie"], "repartie"],
  ])("%j → %s", (signals, slug) => {
    expect(recommendParcours(signals).slug).toBe(slug);
  });
});

describe("D4, contrat jokeContents : textes exacts de vannes actives", () => {
  const actives = (vannesActives as Array<{ content?: string; punchline?: string; comedyTechnique?: string }>)
    .filter((v): v is { content: string; punchline: string; comedyTechnique?: string } => typeof v.content === "string")
    .slice(0, 4);

  it("1 texte inconnu sur 5 : 4 vannes affichées, jamais d'emplacement vide", async () => {
    jokeFindMany.mockImplementation(async ({ where }: { where: { content: { in: string[] }; isActive: boolean } }) => {
      expect(where.isActive).toBe(true);
      return actives
        .filter((v) => where.content.in.includes(v.content))
        .map((v, i) => ({ id: `cmjk${i}xxxxxxxx`, content: v.content, punchline: v.punchline, comedyTechnique: v.comedyTechnique ?? null }));
    });
    const jokeContents = [...actives.map((v) => v.content), "Texte qui n'existe pas en base"];
    const byStep = await resolveStepJokes([{ order: 2, jokeContents, jokeIds: [1, 2, 3] }]);
    const jokes = byStep.get(2)!;
    expect(jokes).toHaveLength(4);
    expect(jokes.map((j) => j.content)).toEqual(actives.map((v) => v.content));
    jokes.forEach((j) => expect(j.href).toMatch(/^\/vannes\//));
  });

  it("sans jokeContents : repli sur jokeIds (ancien seed)", async () => {
    jokeFindMany.mockResolvedValue([]);
    await resolveStepJokes([{ order: 1, jokeIds: [seed.steps[1].jokeIds![0]] }]);
    expect(jokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true, content: { in: expect.arrayContaining([firstJokeText]) } } }),
    );
  });

  it("les textes des vannes ne partent jamais au navigateur, seulement leur nombre", () => {
    const out = withoutJokeTexts({
      steps: [
        { id: "a", order: 1, tip: { id: "t", title: "", content: "", category: "", difficulty: "", example: "", exercise: "" }, jokeIds: [], jokeContents: ["A", "B", "C"] },
        { id: "b", order: 2, locked: true, tip: { id: "t", title: "", content: "", category: "", difficulty: "", example: "", exercise: "" }, jokeIds: [] },
      ],
    } as never) as unknown as { steps: Array<Record<string, unknown>> };
    expect(out.steps[0].jokeContents).toBeUndefined();
    expect(out.steps[0].jokeCount).toBe(3);
    expect(out.steps[1].jokeCount).toBe(0);
  });
});
