/**
 * @jest-environment node
 *
 * Lettre s21, garde-fou d'intégration : un numéro ne part JAMAIS si un article du
 * blog qu'il cite n'est pas en ligne au moment de l'envoi (publié ET date de
 * publication passée). La tâche vérifie en base à chaque passage et reporte le
 * numéro au passage suivant, sans rien écrire au journal des envois.
 */
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  LETTRE_INSCRIPTIONS_OUVERTES: true,
  LETTRE_ENVOIS_OUVERTS: true,
}));

type Article = { slug: string; isPublished: boolean; publishedAt: Date | null };
type Where = { slug: { in: string[] }; isPublished: boolean; OR: Array<{ publishedAt: null | { lte: Date } }> };

const mockDb = {
  issue: null as null | Record<string, unknown>,
  articles: [] as Article[],
  journal: [] as Array<{ id: string; email: string; status: string; attempts: number }>,
};

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findFirst: jest.fn(async () => mockDb.issue),
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => Object.assign(mockDb.issue ?? {}, data)),
    },
    // Applique réellement le filtre de visibilité reçu (`visibleBlogArticleWhere`).
    blogArticle: {
      findMany: jest.fn(async ({ where }: { where: Where }) =>
        mockDb.articles
          .filter((a) => where.slug.in.includes(a.slug) && a.isPublished === where.isPublished)
          .filter((a) =>
            where.OR.some((c) => (c.publishedAt === null ? a.publishedAt === null : a.publishedAt !== null && a.publishedAt <= c.publishedAt.lte)),
          )
          .map((a) => ({ slug: a.slug })),
      ),
    },
    user: { findMany: jest.fn(async () => []) },
    ceoLead: { findMany: jest.fn(async () => []) },
    newsletterSubscriber: {
      findMany: jest.fn(async () => [{ email: "a@x.fr", unsubscribeToken: "u".repeat(43), confirmedAt: new Date("2026-10-01T00:00:00Z") }]),
    },
    newsletterSend: {
      findMany: jest.fn(async () => mockDb.journal),
      create: jest.fn(async ({ data }: { data: { email: string; status: string; attempts: number } }) => {
        const ligne = { id: `l${mockDb.journal.length + 1}`, ...data };
        mockDb.journal.push(ligne);
        return { id: ligne.id };
      }),
      updateMany: jest.fn(async () => ({ count: 0 })),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
        Object.assign(mockDb.journal.find((l) => l.id === where.id) ?? {}, data),
      ),
    },
  },
}));

import { articlesCites, articlesCitesNonPublies, envoyerLettreDuMois } from "@/lib/lettre/envoi";
import { blogArticles } from "@/lib/blog-articles";

const NOW = new Date("2026-11-05T07:30:00Z"); // jeudi 05/11/2026, 8 h 30 à Paris
const BASE = "https://deviens-marrant.fr";
const SLUG = "soiree-de-noel-entreprise-humour";
const corps = `Lis l'article : https://deviens-marrant.fr/blog/${SLUG}?utm_source=lettre&utm_medium=email\nEt Premium : https://deviens-marrant.fr/abonnement?utm_source=lettre`;

beforeEach(() => {
  mockDb.issue = { id: "n1", periodKey: "2026-11", subject: "Objet du mois", bodyText: corps, status: "VALIDE" };
  mockDb.articles = [];
  mockDb.journal = [];
});

describe("articlesCites", () => {
  it("trouve les slugs du blog du site (paramètres, ancre, www), sans doublon, et ignore les autres pages", () => {
    const texte = [
      "https://deviens-marrant.fr/blog/a-b-c?utm_source=lettre",
      "https://www.deviens-marrant.fr/blog/deux#faq",
      "https://deviens-marrant.fr/blog/a-b-c",
      "https://deviens-marrant.fr/parcours/confiance#etape-1",
      "https://deviens-marrant.fr/abonnement",
      "https://autre-site.fr/blog/pas-nous",
    ].join("\n");
    expect(articlesCites(texte)).toEqual(["a-b-c", "deux"]);
  });

  it("numéros livrés : les numéros qui renvoient au blog ont leur article détecté", () => {
    const numeros = jest.requireActual("@/data/lettre/numeros.json") as Array<{ numero: number; corps: string; datePlancher: string | null }>;
    for (const n of numeros) {
      const cites = articlesCites(n.corps);
      // Un numéro qui cite un article a une date plancher (et inversement) : la règle tient sur les 6.
      expect({ numero: n.numero, cite: cites.length > 0 }).toEqual({ numero: n.numero, cite: n.datePlancher !== null });
    }
    expect(articlesCites(numeros.find((n) => n.numero === 1)!.corps)).toEqual([SLUG]);
  });
});

describe("articlesCitesNonPublies", () => {
  it("un article du code est toujours en ligne : aucune lecture en base", async () => {
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: { blogArticle: { findMany: jest.Mock } } };
    prisma.blogArticle.findMany.mockClear();
    expect(await articlesCitesNonPublies([blogArticles[0].slug], NOW)).toEqual([]);
    expect(prisma.blogArticle.findMany).not.toHaveBeenCalled();
  });
});

describe("envoyerLettreDuMois : article cité pas encore en ligne", () => {
  it.each([
    ["absent de la base", []],
    ["non publié (isPublished faux)", [{ slug: SLUG, isPublished: false, publishedAt: new Date("2026-11-02T06:00:00Z") }]],
    ["publié mais date de publication à venir", [{ slug: SLUG, isPublished: true, publishedAt: new Date("2026-11-05T09:00:00Z") }]],
  ] as Array<[string, Article[]]>)("%s : numéro reporté, rien envoyé ni réservé, numéro pas clos", async (_cas, articles) => {
    mockDb.articles = articles;
    const envoyer = jest.fn();
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r).toMatchObject({ reporte: true, articlesNonPublies: [SLUG], numero: "2026-11", envoyes: 0, termine: false });
    expect(envoyer).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
    expect(mockDb.issue?.status).toBe("VALIDE");
  });

  it("passage suivant, article publié entre-temps : le numéro part", async () => {
    mockDb.articles = [{ slug: SLUG, isPublished: true, publishedAt: new Date("2026-11-05T09:00:00Z") }];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    expect((await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE })).reporte).toBe(true);

    const plusTard = new Date("2026-11-05T09:15:00Z");
    const r = await envoyerLettreDuMois(plusTard, { envoyer, baseUrl: BASE });
    expect(r).toMatchObject({ reporte: false, articlesNonPublies: [], envoyes: 1, termine: true });
    expect(envoyer).toHaveBeenCalledTimes(1);
  });

  it("article publié et date passée : envoi normal", async () => {
    mockDb.articles = [{ slug: SLUG, isPublished: true, publishedAt: new Date("2026-11-02T06:00:00Z") }];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r).toMatchObject({ reporte: false, envoyes: 1 });
  });

  it("numéro sans article du blog (parcours, abonnement) : aucune lecture des articles, envoi normal", async () => {
    mockDb.issue = { ...mockDb.issue, bodyText: "Étape 1 : https://deviens-marrant.fr/parcours/confiance#etape-1 et un corps assez long." };
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: { blogArticle: { findMany: jest.Mock } } };
    prisma.blogArticle.findMany.mockClear();
    const r = await envoyerLettreDuMois(NOW, { envoyer: jest.fn().mockResolvedValue(undefined), baseUrl: BASE });
    expect(r).toMatchObject({ reporte: false, envoyes: 1 });
    expect(prisma.blogArticle.findMany).not.toHaveBeenCalled();
  });
});
