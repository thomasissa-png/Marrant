/**
 * @jest-environment node
 *
 * Revue s21 M1 (complément) : au démarrage, la date plancher de chaque numéro
 * VALIDE est comparée à la publication réelle de l'article cité, pour alerter
 * dès le déploiement plutôt que le jour de l'envoi.
 */
type Article = { slug: string; isPublished: boolean; publishedAt: Date | null };
const mockArticles: Article[] = [];

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: {
      findMany: jest.fn(async ({ where }: { where: { slug: { in: string[] } } }) =>
        mockArticles.filter((a) => where.slug.in.includes(a.slug)),
      ),
    },
  },
}));

import { controlerDatesPlancher } from "@/lib/lettre/numeros";

const SLUG = "soiree-de-noel-entreprise-humour";
const NOW = new Date("2026-10-20T10:00:00Z");
const numero = {
  periode: "2026-11",
  objet: "Objet du mois",
  corps: `Lis l'article : https://deviens-marrant.fr/blog/${SLUG}?utm_source=lettre, puis reviens nous dire ce que tu en penses.`,
  envoiPrevu: "2026-11-05T08:00:00+01:00",
  datePlancher: "2026-11-02",
  statut: "VALIDE",
};

beforeEach(() => {
  mockArticles.length = 0;
});

describe("controlerDatesPlancher", () => {
  it("article publié à la date plancher : aucune alerte", async () => {
    mockArticles.push({ slug: SLUG, isPublished: true, publishedAt: new Date("2026-11-02T06:00:00Z") });
    expect(await controlerDatesPlancher([numero], NOW)).toEqual([]);
  });

  it("article publié après la date plancher (dates échangées) : alerte dès le démarrage", async () => {
    mockArticles.push({ slug: SLUG, isPublished: true, publishedAt: new Date("2026-11-16T06:00:00Z") });
    const alertes = await controlerDatesPlancher([numero], NOW);
    expect(alertes).toHaveLength(1);
    expect(alertes[0]).toContain("publié le 2026-11-16, après la date plancher 2026-11-02");
  });

  it("article absent de la base, ou non publié sans date : alerte", async () => {
    expect(await controlerDatesPlancher([numero], NOW)).toEqual([`2026-11 : article cité « ${SLUG} » absent de la base`]);
    mockArticles.push({ slug: SLUG, isPublished: false, publishedAt: null });
    expect((await controlerDatesPlancher([numero], NOW))[0]).toContain("non publié et sans date");
  });

  it("brouillon, numéro sans date plancher ou parti depuis longtemps : non contrôlé", async () => {
    const entrees = [
      { ...numero, statut: "BROUILLON" },
      { ...numero, datePlancher: null },
    ];
    expect(await controlerDatesPlancher(entrees, NOW)).toEqual([]);
    expect(await controlerDatesPlancher([numero], new Date("2027-01-15T10:00:00Z"))).toEqual([]);
  });
});
