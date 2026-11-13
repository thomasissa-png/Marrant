/**
 * @jest-environment node
 *
 * Espace client, lot D5b (s24), cookie du coin « Humour noir » (@legal `docs/legal/espace-d6-cookie-coin-s24.md`,
 * décisions de la session du 13/11) : durée ramenée à 6 mois ; poste partagé : le témoin est retiré à la
 * déconnexion (`POST /api/auth/signout`) et à la suppression du compte (`DELETE /api/user`). Interrupteur
 * fermé : réponses inchangées (aucun en-tête ajouté). Ligne de la confidentialité : ouverte seulement.
 */
// État de l'interrupteur simulé, lu à chaque accès (le module est importé avant ce fichier ne s'exécute).
const espace = globalThis as unknown as { __espaceOuvertD5b?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as unknown as { __espaceOuvertD5b?: boolean }).__espaceOuvertD5b === true;
  },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({
  __esModule: true,
  default: () => async () => new Response("{}", { status: 200, headers: { "Set-Cookie": "next-auth.session-token=; Path=/; Max-Age=0" } }),
  getServerSession: (...a: unknown[]) => getServerSession(...a),
}));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/account", () => ({
  deleteAccount: jest.fn(async () => ({ deleted: true, stripeCanceled: 0 })),
  StripeCancelError: class extends Error {},
}));
jest.mock("@/lib/same-site", () => ({ refuserSiAutreSite: () => null }));

import { NextRequest } from "next/server";
import { POST as auth } from "@/app/api/auth/[...nextauth]/route";
import { DELETE as supprimer } from "@/app/api/user/route";
import { COOKIE_COIN, DUREE_COIN_SECONDES, effacerTemoinCoin } from "@/lib/espace/humour-noir";
import { MOT_CONFIRMATION_SUPPRESSION } from "@/config/textes/compte";
import { CONFIDENTIALITE_ESPACE } from "@/config/textes/espace-confidentialite";

const deconnexion = (action: string) => auth(new NextRequest(`http://localhost/api/auth/${action}`, { method: "POST" }), { params: { nextauth: [action] } });
const suppression = () =>
  supprimer(
    new Request("http://localhost/api/user", {
      method: "DELETE",
      body: JSON.stringify({ confirmation: MOT_CONFIRMATION_SUPPRESSION }),
      headers: { "Content-Type": "application/json" },
    }),
  );
const cookies = (r: Response) => r.headers.getSetCookie();

beforeEach(() => {
  espace.__espaceOuvertD5b = false;
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  jest.spyOn(console, "log").mockImplementation(() => undefined);
});

describe("témoin du coin « Humour noir »", () => {
  it("durée : 6 mois fixes (183 jours), plus un an", () => {
    expect(DUREE_COIN_SECONDES).toBe(183 * 86_400);
    expect(DUREE_COIN_SECONDES).toBeLessThan(365 * 86_400);
  });

  it("fermé : déconnexion et suppression du compte rendent exactement les en-têtes d'aujourd'hui", async () => {
    expect(cookies(await deconnexion("signout"))).toEqual(["next-auth.session-token=; Path=/; Max-Age=0"]);
    const r = await suppression();
    expect(r.status).toBe(200);
    expect(cookies(r).some((c) => c.startsWith(`${COOKIE_COIN}=`))).toBe(false);
    const h = new Headers();
    effacerTemoinCoin(h);
    expect(h.getSetCookie()).toEqual([]);
  });

  it("ouvert : la déconnexion retire le témoin (et garde les cookies de NextAuth) ; les autres actions n'y touchent pas", async () => {
    espace.__espaceOuvertD5b = true;
    const sortie = cookies(await deconnexion("signout"));
    expect(sortie).toContain("next-auth.session-token=; Path=/; Max-Age=0");
    expect(sortie).toContain(`${COOKIE_COIN}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
    expect(cookies(await deconnexion("session")).some((c) => c.startsWith(`${COOKIE_COIN}=`))).toBe(false);
    expect(cookies(await deconnexion("callback")).some((c) => c.startsWith(`${COOKIE_COIN}=`))).toBe(false);
  });

  it("ouvert : la suppression du compte retire aussi le témoin", async () => {
    espace.__espaceOuvertD5b = true;
    const r = await suppression();
    expect(r.status).toBe(200);
    expect(cookies(r).find((c) => c.startsWith(`${COOKIE_COIN}=`))).toMatch(/Max-Age=0/);
  });

  it("confidentialité : texte de @legal, durée de 6 mois, ni « 1 an » ni tiret cadratin", () => {
    expect(CONFIDENTIALITE_ESPACE.cookie).toContain("pendant 6 mois");
    expect(CONFIDENTIALITE_ESPACE.cookie).not.toContain("1 an");
    expect(CONFIDENTIALITE_ESPACE.cookie).not.toContain("—");
    expect(CONFIDENTIALITE_ESPACE.cookie).toMatch(/^Coin « Humour noir » de ton espace : si tu cliques sur « Entrer »/);
  });
});
