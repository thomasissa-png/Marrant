/**
 * @jest-environment node
 *
 * s21 (QA v3 m-1) : le middleware est joué sur une vraie requête (cookie de session signé
 * comme en production), et chaque redirection vers /abonnement porte sa source, distincte
 * et stable. Remplace l'ancien contrôle « chaîne présente dans middleware.ts ».
 */
import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import middleware from "@/middleware";

const SECRET = "secret-factice-test-middleware";
const ORIGINE = "http://localhost:3000";
let secretAvant: string | undefined;

beforeAll(() => {
  secretAvant = process.env.NEXTAUTH_SECRET;
  process.env.NEXTAUTH_SECRET = SECRET;
});

afterAll(() => {
  if (secretAvant === undefined) delete process.env.NEXTAUTH_SECRET;
  else process.env.NEXTAUTH_SECRET = secretAvant;
});

async function requete(chemin: string, plan?: "FREE" | "PREMIUM"): Promise<NextRequest> {
  const headers = new Headers({ host: "localhost:3000" });
  if (plan) {
    const jeton = await encode({ token: { sub: "u1", email: "test@example.com", plan }, secret: SECRET });
    // Les deux noms possibles (http et https) : getToken lit celui qui correspond à l'environnement.
    headers.set("cookie", `next-auth.session-token=${jeton}; __Secure-next-auth.session-token=${jeton}`);
  }
  return new NextRequest(new URL(chemin, ORIGINE), { headers });
}

/** Chemin + recherche de la redirection, ou null si la requête passe. */
async function redirection(chemin: string, plan?: "FREE" | "PREMIUM"): Promise<string | null> {
  const res = await middleware(await requete(chemin, plan));
  const location = res.headers.get("location");
  if (!location) return null;
  const url = new URL(location);
  return `${url.pathname}${url.search}`;
}

describe("middleware : redirections vers /abonnement avec leur source", () => {
  it("/favoris, compte sans abonnement → /abonnement avec src=favoris et retour sur /favoris", async () => {
    expect(await redirection("/favoris", "FREE")).toBe("/abonnement?returnTo=%2Ffavoris&src=favoris");
  });

  it("/favoris/quelque-chose, compte sans abonnement → même source", async () => {
    expect(await redirection("/favoris/vannes", "FREE")).toBe("/abonnement?returnTo=%2Ffavoris&src=favoris");
  });

  it("/onboarding sans session → /abonnement avec src=onboarding-visiteur (jamais /register)", async () => {
    expect(await redirection("/onboarding")).toBe("/abonnement?src=onboarding-visiteur");
  });

  it("les sources sont distinctes", async () => {
    const sources = [await redirection("/favoris", "FREE"), await redirection("/onboarding")].map((u) =>
      new URL(u ?? "", ORIGINE).searchParams.get("src"),
    );
    expect(new Set(sources).size).toBe(sources.length);
    expect(sources).not.toContain(null);
  });

  it("/favoris sans session → /login (inchangé)", async () => {
    expect(await redirection("/favoris")).toBe("/login?callbackUrl=%2Ffavoris");
  });

  it("/favoris, abonné → passe ; /abonnement, abonné → /vannes (inchangé)", async () => {
    expect(await redirection("/favoris", "PREMIUM")).toBeNull();
    expect(await redirection("/abonnement", "PREMIUM")).toBe("/vannes");
  });

  it("/abonnement, compte sans abonnement ou visiteur → passe", async () => {
    expect(await redirection("/abonnement?src=favoris", "FREE")).toBeNull();
    expect(await redirection("/abonnement")).toBeNull();
  });

  it("/onboarding avec session → passe", async () => {
    expect(await redirection("/onboarding", "FREE")).toBeNull();
  });
});
