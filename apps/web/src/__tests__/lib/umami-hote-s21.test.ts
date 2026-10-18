/**
 * @jest-environment node
 *
 * s21, blocs d'appel partie A (point 7) : le rapport Umami du lundi (et les alertes)
 * ne compte que le site en production : `hostname=deviens-marrant.fr` sur chaque appel
 * de l'API ; un filtre explicite de l'appelant reste prioritaire.
 */
import { UMAMI_HOSTNAME, fetchUmamiMetrics } from "@/lib/analytics/umami";

const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
});

describe("API Umami : filtre d'hôte", () => {
  it("hostname=deviens-marrant.fr par défaut ; un filtre explicite reste prioritaire", async () => {
    const fetchMock = jest.fn(async (_url: string) => ({ ok: true, status: 200, json: async () => [] }));
    global.fetch = fetchMock as unknown as typeof fetch;
    const config = { apiKey: "k", websiteId: "w" };
    await fetchUmamiMetrics(config, 1, 2, "event", 5);
    await fetchUmamiMetrics(config, 1, 2, "event", 5, { hostname: "autre.example" });
    const urls = fetchMock.mock.calls.map(([u]) => new URL(u));
    expect(UMAMI_HOSTNAME).toBe("deviens-marrant.fr");
    expect(urls[0].searchParams.get("hostname")).toBe("deviens-marrant.fr");
    expect(urls[1].searchParams.getAll("hostname")).toEqual(["autre.example"]);
  });
});
