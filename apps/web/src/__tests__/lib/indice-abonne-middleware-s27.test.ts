/**
 * @jest-environment node
 *
 * s27 D2 : le middleware pose l'indice « abonné » (`dm_lecteur`) dès le PREMIER chargement d'un navigateur connecté
 * qui ne l'a pas (retour de connexion Google, nouvel appareil), plan lu dans le jeton. Le visiteur ne reçoit rien :
 * aucune lecture, aucun Set-Cookie, réponse et cache inchangés pour lui.
 */
import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import middleware from "@/middleware";

const SECRET = "secret-de-test-indice-s27";
beforeAll(() => {
  process.env.NEXTAUTH_SECRET = SECRET;
});
afterAll(() => {
  delete process.env.NEXTAUTH_SECRET;
});

function requete(chemin: string, cookies: Record<string, string> = {}) {
  const cookie = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  return new NextRequest(new URL(chemin, "https://deviens-marrant.fr"), {
    headers: { host: "deviens-marrant.fr", ...(cookie ? { cookie } : {}) },
  });
}

// Nom choisi par NextAuth selon NEXTAUTH_URL (`__Secure-` en https, comme en ligne) : celui que `getToken` relit.
const SESSION = process.env.NEXTAUTH_URL?.startsWith("https://") ? "__Secure-next-auth.session-token" : "next-auth.session-token";
const jeton = (plan: string) => encode({ token: { sub: "u1", plan }, secret: SECRET });
const setCookie = (res: Response) => res.headers.get("set-cookie") ?? "";

describe("middleware : indice abonné (s27 D2)", () => {
  it("visiteur sur une fiche publique : aucun Set-Cookie", async () => {
    const res = await middleware(requete("/conseils/lironie-bienveillante-abc"));
    expect(setCookie(res)).toBe("");
  });

  it("abonné sans indice : « dm_lecteur=abonne » posé (chemin /, 30 jours, lisible par le script, Secure en https)", async () => {
    const res = await middleware(requete("/conseils/lironie-bienveillante-abc", { [SESSION]: await jeton("PREMIUM") }));
    const sc = setCookie(res);
    expect(sc).toMatch(/dm_lecteur=abonne/);
    expect(sc).toMatch(/Path=\//);
    expect(sc).toMatch(/Max-Age=2592000/);
    expect(sc).toMatch(/Secure/);
    expect(sc).not.toMatch(/HttpOnly/i);
  });

  it("compte sans abonnement : « compte » (l'offre reste affichée)", async () => {
    const res = await middleware(requete("/vannes", { [SESSION]: await jeton("FREE") }));
    expect(setCookie(res)).toMatch(/dm_lecteur=compte/);
  });

  it("indice déjà là : rien n'est relu ni reposé", async () => {
    const res = await middleware(requete("/vannes", { [SESSION]: await jeton("PREMIUM"), dm_lecteur: "abonne" }));
    expect(setCookie(res)).toBe("");
  });

  it("jeton illisible : pas d'indice, la page passe", async () => {
    const res = await middleware(requete("/vannes", { [SESSION]: "nimporte-quoi" }));
    expect(res.status).toBe(200);
    expect(setCookie(res)).toBe("");
  });

  it("indice sans session (déconnecté ailleurs) : effacé", async () => {
    const res = await middleware(requete("/vannes", { dm_lecteur: "abonne" }));
    expect(setCookie(res)).toMatch(/dm_lecteur=;.*Max-Age=0/);
  });
});
