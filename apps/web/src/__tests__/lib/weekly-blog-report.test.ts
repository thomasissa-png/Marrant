/**
 * @jest-environment node
 *
 * Section « Blog : articles à forte frappe » du rapport hebdomadaire :
 * événements semaine / précédente, paliers de lecture, suivi par article,
 * article non publié, endpoints absents (section partielle), données vides,
 * repli type=url. fetch mocké : aucun appel à l'API Umami réelle.
 */
import { TRACKED_ARTICLES } from "@/config/blog-tracking";
import { buildBlogReport, type BlogArticleLookup } from "@/lib/analytics/weekly-blog-report";
import { buildBlogSectionHtml } from "@/lib/analytics/weekly-visits-email";
import { computeReportPeriods } from "@/lib/analytics/weekly-visits-period";
import {
  MONDAY_7H_PARIS,
  TEST_UMAMI_KEY,
  TEST_WEBSITE_ID,
  WEEK_START_2809,
  installUmamiFetch,
} from "../helpers/umami-fetch-mock";

const config = { apiKey: TEST_UMAMI_KEY, websiteId: TEST_WEBSITE_ID };
const periods = computeReportPeriods(MONDAY_7H_PARIS);
const TOP = "meilleures-blagues-droles-2026";
const AVRIL = "blagues-poisson-d-avril-adultes";
const SLUGS = [TOP, AVRIL, "voeux-drole-nouvelle-annee", "inconnu-en-base"];

const lookup: BlogArticleLookup = async () => [
  { slug: TOP, isPublished: true, publishedAt: new Date("2026-09-01T08:00:00Z") },
  // 31/03 22h30 UTC = 01/04 0h30 heure de Paris (heure d'été).
  { slug: AVRIL, isPublished: false, publishedAt: new Date("2027-03-31T22:30:00Z") },
  { slug: "voeux-drole-nouvelle-annee", isPublished: false, publishedAt: null },
];

const isCurrent = (url: URL) => Number(url.searchParams.get("startAt")) === WEEK_START_2809;
const base = { currentStartAt: WEEK_START_2809, statsCurrent: {}, statsPrevious: {} };

/** Données riches : globales par semaine, et par article via le filtre path. */
function richRoute(url: URL): unknown {
  const endpoint = url.pathname.split("/").pop();
  const path = url.searchParams.get("path");
  const type = url.searchParams.get("type");
  if (endpoint === "metrics" && type === "event" && !path) {
    return isCurrent(url)
      ? [{ x: "blog-cta-clic", y: 12 }, { x: "blog-sortie-clic", y: 40 }, { x: "autre", y: 3 }, { x: "blog-scroll", y: 90 }]
      : [{ x: "blog-cta-clic", y: 10 }, { x: "blog-sortie-clic", y: 50 }, { x: "blog-scroll", y: 60 }];
  }
  if (endpoint === "values" && !path) {
    return isCurrent(url)
      ? [{ value: "25", total: 40 }, { value: "50", total: 25 }, { value: "75.0000", total: 15 }, { value: 100, total: 10 }]
      : [{ value: "25", total: 30 }, { value: "75", total: 10 }];
  }
  if (path === `/blog/${TOP}`) {
    if (type === "path") return [{ x: `/blog/${TOP}`, y: isCurrent(url) ? 120 : 100 }, { x: `/blog/${TOP}/`, y: isCurrent(url) ? 4 : 0 }];
    if (type === "event") return [{ x: "blog-sortie-clic", y: 9 }, { x: "blog-cta-clic", y: 3 }, { x: "blog-vanne-partage", y: 2 }];
    if (endpoint === "values") return [{ value: "75", total: 31 }, { value: "100", total: 20 }];
  }
  return undefined;
}

afterEach(() => jest.restoreAllMocks());

describe("buildBlogReport", () => {
  it("TRACKED_ARTICLES : les 6 articles à forte frappe", () => {
    expect(TRACKED_ARTICLES).toHaveLength(6);
    expect(TRACKED_ARTICLES).toContain("premier-message-drole-appli-de-rencontre");
  });

  it("événements, paliers et suivi par article ; article non publié sans appel Umami", async () => {
    const fetchMock = installUmamiFetch({ ...base, route: richRoute });
    const r = await buildBlogReport(config, periods, lookup, SLUGS);

    expect(r.partial).toBe(false);
    expect(r.warnings).toEqual([]);
    const byName = Object.fromEntries(r.events.map((e) => [e.name, e]));
    expect(byName["blog-cta-clic"]).toMatchObject({ current: 12, previous: 10, change: 20 });
    expect(byName["blog-sortie-clic"]).toMatchObject({ current: 40, previous: 50, change: -20 });
    expect(byName["blog-vanne-partage"]).toMatchObject({ current: 0, previous: 0, change: 0 });
    expect(r.scrollSteps).toEqual([
      { palier: 25, current: 40, previous: 30, change: 33.3 },
      { palier: 50, current: 25, previous: 0, change: null },
      { palier: 75, current: 15, previous: 10, change: 50 },
      { palier: 100, current: 10, previous: 0, change: null },
    ]);

    expect(r.articles[0]).toEqual({
      slug: TOP,
      status: "published",
      views: { current: 124, previous: 100, change: 24 },
      exits: 9,
      ctas: 3,
      shares: 2,
      read75: 31,
      readRate: 25,
    });
    expect(r.articles[1]).toEqual({
      slug: AVRIL,
      status: "scheduled",
      publishedAt: "2027-03-31T22:30:00.000Z",
      publishedLabel: "publication prévue le 01/04",
    });
    expect(r.articles[2]).toEqual({ slug: "voeux-drole-nouvelle-annee", status: "unscheduled" });
    expect(r.articles[3]).toEqual({ slug: "inconnu-en-base", status: "missing" });

    const urls = fetchMock.mock.calls.map(([u]) => String(u));
    expect(urls.some((u) => u.includes(encodeURIComponent(`/blog/${AVRIL}`)))).toBe(false);
    expect(urls.every((u) => !u.includes(TEST_UMAMI_KEY))).toBe(true);
    const scroll = new URL(urls.find((u) => u.includes("event-data/values"))!);
    expect(scroll.searchParams.get("event")).toBe("blog-scroll");
    expect(scroll.searchParams.get("eventName")).toBe("blog-scroll");
    expect(scroll.searchParams.get("propertyName")).toBe("palier");

    const html = buildBlogSectionHtml(r);
    expect(html).toContain("Blog : articles à forte frappe");
    expect(html).toContain("Lecture 75 %");
    expect(html).not.toContain("Paliers de lecture (total)");
    expect(html).toContain("124 vues (+24 %), 9 sorties, 3 CTA, 2 partages, lu à 75 % : 25 %");
    expect(html).toContain("publication prévue le 01/04");
    expect(html).not.toContain("Section partielle");
    expect(html).not.toContain("—");
  });

  it("endpoints absents (404) : section partielle, total de lecture, aucune exception", async () => {
    installUmamiFetch({
      ...base,
      route: (url) => {
        if (url.pathname.endsWith("/values")) return new Response("Not found", { status: 404 });
        if (url.searchParams.get("type") === "event") return new Response("Not found", { status: 404 });
        return undefined;
      },
    });
    const r = await buildBlogReport(config, periods, lookup, [TOP]);
    expect(r.partial).toBe(true);
    expect(r.warnings).toEqual(["Umami metrics : HTTP 404", "Umami event-data/values : HTTP 404"]);
    expect(r.scrollSteps).toBeNull();
    expect(r.events.every((e) => e.current === null && e.change === null)).toBe(true);
    expect(r.articles[0]).toMatchObject({ views: { current: 0, previous: 0 }, exits: null, read75: null, readRate: null });

    const html = buildBlogSectionHtml(r);
    expect(html).toContain("Section partielle : Umami metrics : HTTP 404 ; Umami event-data/values : HTTP 404.");
    expect(html).toContain("Paliers de lecture (total)");
    expect(html).toContain("n.d. sorties");
    expect(html).not.toContain(TEST_UMAMI_KEY);
  });

  it("type=path refusé (400) : repli sur type=url avec le filtre url", async () => {
    const fetchMock = installUmamiFetch({
      ...base,
      route: (url) => {
        const type = url.searchParams.get("type");
        if (type === "path") return new Response("bad", { status: 400 });
        if (type === "url" && url.searchParams.get("url") === `/blog/${TOP}`) return [{ x: `/blog/${TOP}`, y: 7 }];
        return undefined;
      },
    });
    const r = await buildBlogReport(config, periods, undefined, [TOP]);
    expect(r.partial).toBe(false);
    expect(r.articles[0]).toMatchObject({ status: "published", views: { current: 7, previous: 7, change: 0 } });
    expect(fetchMock.mock.calls.some(([u]) => new URL(String(u)).searchParams.get("type") === "url")).toBe(true);
  });

  it("données vides : zéros comparables, taux de lecture non calculable", async () => {
    installUmamiFetch({ ...base, urls: [], events: [], eventDataValues: [] });
    const r = await buildBlogReport(config, periods, lookup, [TOP]);
    expect(r.partial).toBe(false);
    expect(r.events.every((e) => e.current === 0 && e.change === 0)).toBe(true);
    expect(r.scrollSteps?.map((s) => s.current)).toEqual([0, 0, 0, 0]);
    expect(r.articles[0]).toMatchObject({ views: { current: 0, previous: 0, change: 0 }, read75: 0, readRate: null });
    expect(buildBlogSectionHtml(r)).toContain("0 vues (0 %), 0 sorties, 0 CTA, 0 partages, lu à 75 % : n.d.");
  });

  it("base indisponible : statut inconnu, stats quand même, avertissement", async () => {
    installUmamiFetch({ ...base, route: richRoute });
    const r = await buildBlogReport(config, periods, async () => {
      throw new Error("connexion refusée postgres://secret");
    }, [TOP, AVRIL]);
    expect(r.partial).toBe(true);
    expect(r.warnings).toEqual(["Base : statut de publication des articles indisponible"]);
    expect(r.articles.map((a) => a.status)).toEqual(["published", "unknown"]); // 1er slug = article statique (dans le code) : toujours publié
    expect(JSON.stringify(r)).not.toContain("secret");
  });

  it("réseau coupé : section partielle sans exception", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("fetch failed")) as unknown as typeof fetch;
    const r = await buildBlogReport(config, periods, lookup, [TOP]);
    expect(r.partial).toBe(true);
    expect(r.warnings).toContain("Umami metrics : réseau indisponible");
  });
});

describe("articles statiques", () => {
  it("un article écrit dans le code n'est jamais « absent de la base »", () => {
    const { blogArticles } = require("@/lib/blog-articles");
    expect(blogArticles.some((a: { slug: string }) => a.slug === "meilleures-blagues-droles-2026")).toBe(true);
  });
});
