/**
 * @jest-environment node
 *
 * Lot D11c (décision du 12/11 sur l'arrivée) : un abonné Premium qui ouvre `/abonnement`, interrupteur de l'espace
 * OUVERT, arrive sur « Aujourd'hui » (`/mon-espace`) au lieu de `/vannes` ; fermé, rien ne change (`/vannes`,
 * `auth-middleware-redirects.test.ts`). Garde-fou : second passage dans les 10 s (jeton PREMIUM périmé, la garde de
 * l'espace renvoie vers /abonnement) = règle d'avant, jamais de boucle.
 */
import { NextRequest } from "next/server";

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "secret-de-test-middleware-d11c";
});

afterAll(() => {
  delete process.env.NEXTAUTH_SECRET;
});

async function requete(path: string, plan: string, cookies = "") {
  const { encode } = await import("next-auth/jwt");
  const jeton = await encode({ token: { sub: "user-1", plan }, secret: process.env.NEXTAUTH_SECRET! });
  return new NextRequest(new URL(path, "https://deviens-marrant.fr"), {
    headers: { host: "deviens-marrant.fr", cookie: `next-auth.session-token=${jeton}${cookies}` },
  });
}

function chargerMiddleware(ouvert: boolean): typeof import("@/middleware") {
  let mod: typeof import("@/middleware") | undefined;
  jest.isolateModules(() => {
    jest.doMock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: ouvert }));
    mod = jest.requireActual<typeof import("@/middleware")>("@/middleware");
  });
  return mod!;
}

const cible = (res: Response) => new URL(res.headers.get("location") ?? "", "https://deviens-marrant.fr");

describe("/abonnement pour un abonné Premium", () => {
  afterEach(() => jest.dontMock("@/config/espace-client"));

  it.each(["/abonnement", "/abonnement?src=header", "/abonnement/autre"])("ouvert : %s → /mon-espace, témoin anti-boucle posé (navigation de page)", async (path) => {
    const { default: middleware, TEMOIN_ARRIVEE_ESPACE } = chargerMiddleware(true);
    const req = await requete(path, "PREMIUM");
    req.headers.set("sec-fetch-mode", "navigate");
    const res = await middleware(req);
    expect(cible(res).pathname).toBe("/mon-espace");
    const temoin = res.headers.get("set-cookie") ?? "";
    expect(temoin).toContain(`${TEMOIN_ARRIVEE_ESPACE}=1`);
    expect(temoin).toMatch(/Path=\/abonnement/i);
    expect(temoin).toMatch(/Max-Age=10/i);
    expect(temoin).toMatch(/HttpOnly/i);
  });

  it("ouvert, préchargement ou requête RSC vers /abonnement : /mon-espace SANS témoin (un vrai clic ensuite mène aussi à /mon-espace)", async () => {
    const { default: middleware } = chargerMiddleware(true);
    for (const entete of [{ "sec-fetch-mode": "cors" }, { purpose: "prefetch" }, { "sec-fetch-mode": "navigate", "sec-purpose": "prefetch" }]) {
      const req = await requete("/abonnement", "PREMIUM");
      for (const [k, v] of Object.entries(entete)) req.headers.set(k, v);
      const res = await middleware(req);
      expect(cible(res).pathname).toBe("/mon-espace");
      expect(res.headers.get("set-cookie") ?? "").not.toContain("dm_arrivee_espace");
    }
  });

  it("ouvert, second passage dans les 10 s : règle d'avant (/vannes), pas de boucle", async () => {
    const { default: middleware, TEMOIN_ARRIVEE_ESPACE } = chargerMiddleware(true);
    const res = await middleware(await requete("/abonnement", "PREMIUM", `; ${TEMOIN_ARRIVEE_ESPACE}=1`));
    expect(cible(res).pathname).toBe("/vannes");
  });

  it("ouvert : /abonnement/success reste servi ; compte gratuit : /abonnement servi", async () => {
    const { default: middleware } = chargerMiddleware(true);
    expect((await middleware(await requete("/abonnement/success?session_id=cs_1", "PREMIUM"))).headers.get("location")).toBeNull();
    expect((await middleware(await requete("/abonnement", "FREE"))).headers.get("location")).toBeNull();
  });

  it("fermé : /abonnement → /vannes, sans témoin (inchangé)", async () => {
    const { default: middleware } = chargerMiddleware(false);
    const res = await middleware(await requete("/abonnement", "PREMIUM"));
    expect(cible(res).pathname).toBe("/vannes");
    expect(res.headers.get("set-cookie") ?? "").not.toContain("dm_arrivee_espace");
  });
});
