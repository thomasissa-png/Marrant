/**
 * @jest-environment node
 *
 * GET /api/admin/lettre (s21, 18/10) : inscrits à la lettre dans la partie
 * « Abonnés » de l'admin. Auth Bearer ADMIN_PASSWORD, comptes de test exclus des
 * compteurs et marqués, jamais d'empreinte IP ni de jeton, sans migration 14.
 */
type Row = {
  id: string;
  email: string;
  status: "PENDING" | "CONFIRMED" | "UNSUBSCRIBED";
  source: string | null;
  consentAt: Date;
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  ipAddress: string | null;
  confirmationToken: string;
  unsubscribeToken: string;
};

const tableAbsente = () => Object.assign(new Error("The table `public.NewsletterIssue` does not exist in the current database."), { code: "P2021" });

let rows: Row[] = [];
let issuesAbsentes = false;
let abonnesAbsents = false;
const findManyArgs: Array<{ select: Record<string, boolean> }> = [];

const garde = <T>(fn: () => T) => (abonnesAbsents ? Promise.reject(tableAbsente()) : Promise.resolve(fn()));
const filtre = (where: { email?: { notIn?: string[]; in?: string[] }; status?: string } = {}) =>
  rows.filter(
    (r) =>
      (!where.email?.notIn || !where.email.notIn.includes(r.email)) &&
      (!where.email?.in || where.email.in.includes(r.email)) &&
      (!where.status || r.status === where.status),
  );

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterSubscriber: {
      groupBy: (a: { where: Parameters<typeof filtre>[0] }) =>
        garde(() => {
          const m = new Map<string, { source: string | null; status: string; _count: { _all: number } }>();
          for (const r of filtre(a.where)) {
            const k = `${r.source}|${r.status}`;
            const g = m.get(k) ?? { source: r.source, status: r.status, _count: { _all: 0 } };
            g._count._all += 1;
            m.set(k, g);
          }
          return [...m.values()];
        }),
      count: (a: { where: Parameters<typeof filtre>[0] }) => garde(() => filtre(a.where).length),
      findMany: (a: { where: Parameters<typeof filtre>[0]; select: Record<string, boolean> }) =>
        garde(() => {
          findManyArgs.push(a);
          // Simule Prisma : seules les colonnes demandées sortent.
          return filtre(a.where).map((r) => Object.fromEntries(Object.keys(a.select).map((k) => [k, r[k as keyof Row]])));
        }),
    },
    newsletterIssue: {
      findFirst: () =>
        issuesAbsentes
          ? Promise.reject(tableAbsente())
          : Promise.resolve({ id: "i2", periodKey: "2026-11", subject: "Novembre", status: "VALIDE", scheduledFor: new Date("2026-11-05T07:00:00Z"), sentAt: null }),
      count: () => (issuesAbsentes ? Promise.reject(tableAbsente()) : Promise.resolve(1)),
      findMany: () =>
        issuesAbsentes
          ? Promise.reject(tableAbsente())
          : Promise.resolve([{ id: "i1", periodKey: "2026-10", subject: "Octobre", status: "ENVOYE", scheduledFor: new Date("2026-10-01T06:00:00Z"), sentAt: new Date("2026-10-01T06:20:00Z") }]),
    },
    newsletterSend: {
      groupBy: () =>
        Promise.resolve([
          { issueId: "i1", status: "ENVOYE", _count: { _all: 2 } },
          { issueId: "i1", status: "ECHEC", _count: { _all: 1 } },
        ]),
    },
    user: {
      findMany: () => Promise.resolve([{ email: "Premium@Exemple.fr", plan: "PREMIUM" }, { email: "test@marrant.fr", plan: "FREE" }]),
    },
  },
}));

import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/lettre/route";

const req = (qs = "", auth: string | null = "Bearer secret") =>
  new NextRequest(`https://deviens-marrant.fr/api/admin/lettre${qs}`, { headers: auth ? { authorization: auth } : {} });

const row = (id: string, email: string, status: Row["status"], source: string | null): Row => ({
  id,
  email,
  status,
  source,
  consentAt: new Date("2026-10-15T10:00:00Z"),
  confirmedAt: status === "CONFIRMED" ? new Date("2026-10-15T10:05:00Z") : null,
  unsubscribedAt: status === "UNSUBSCRIBED" ? new Date("2026-10-16T10:00:00Z") : null,
  ipAddress: "f00dcafe0123456789abcdef01234567",
  confirmationToken: "jeton-confirmation-secret-0123456789",
  unsubscribeToken: "jeton-desinscription-secret-0123456789",
});

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "secret";
  process.env.ANALYTICS_EMAILS_EXCLUS = "test@marrant.fr";
  issuesAbsentes = false;
  abonnesAbsents = false;
  findManyArgs.length = 0;
  rows = [
    row("a", "premium@exemple.fr", "CONFIRMED", "article:devenir-drole"),
    row("b", "attente@exemple.fr", "PENDING", "quiz"),
    row("c", "parti@exemple.fr", "UNSUBSCRIBED", "page"),
    row("d", "test@marrant.fr", "CONFIRMED", "page"),
  ];
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterAll(() => {
  delete process.env.ANALYTICS_EMAILS_EXCLUS;
});

describe("GET /api/admin/lettre", () => {
  it("401 sans authentification ou avec un mauvais mot de passe ; 500 sans ADMIN_PASSWORD", async () => {
    expect((await GET(req("", null))).status).toBe(401);
    expect((await GET(req("", "Bearer faux"))).status).toBe(401);
    delete process.env.ADMIN_PASSWORD;
    expect((await GET(req())).status).toBe(500);
  });

  it("compteurs par statut et par emplacement, comptes de test exclus des compteurs et marqués dans la liste", async () => {
    const body = await (await GET(req())).json();
    expect(body.disponible).toBe(true);
    expect(body.resume).toMatchObject({ etat: "ok", statuts: { confirmes: 1, enAttente: 1, desinscrits: 1 }, comptesTestExclus: 1 });
    const page = body.resume.parEmplacement.find((e: { emplacement: string }) => e.emplacement === "page");
    expect(page).toEqual({ emplacement: "page", confirmes: 0, enAttente: 0, desinscrits: 1 });
    expect(body.resume.parEmplacement.find((e: { emplacement: string }) => e.emplacement === "article")).toMatchObject({ confirmes: 1 });
    const test = body.liste.inscrits.find((i: { email: string }) => i.email === "test@marrant.fr");
    expect(test).toMatchObject({ compteTest: true, compteSite: true, premium: false });
    const premium = body.liste.inscrits.find((i: { email: string }) => i.email === "premium@exemple.fr");
    expect(premium).toMatchObject({ statut: "CONFIRMED", source: "article:devenir-drole", emplacement: "article", compteSite: true, premium: true, compteTest: false });
    expect(body.liste.inscrits.find((i: { email: string }) => i.email === "attente@exemple.fr")).toMatchObject({ compteSite: false, premium: false });
  });

  it("aucune empreinte IP, aucun jeton dans la réponse ni dans la requête en base", async () => {
    const texte = await (await GET(req())).text();
    expect(texte).not.toMatch(/f00dcafe|jeton-|ipAddress|Token|userAgent/);
    for (const a of findManyArgs) {
      expect(Object.keys(a.select).sort()).toEqual(["confirmedAt", "consentAt", "email", "id", "source", "status", "unsubscribedAt"]);
    }
  });

  it("numéros : prochain numéro (date d'envoi prévue) et envois par numéro", async () => {
    const body = await (await GET(req())).json();
    expect(body.resume.numeros.prochain).toMatchObject({ periodKey: "2026-11", statut: "VALIDE", envoiPrevu: "2026-11-05T07:00:00.000Z" });
    expect(body.resume.numeros.envoyes).toEqual([
      expect.objectContaining({ periodKey: "2026-10", envoyes: 2, echecs: 1, enCours: 0 }),
    ]);
  });

  it("sans la migration 14 : numéros null, inscrits toujours lisibles", async () => {
    issuesAbsentes = true;
    const res = await GET(req());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.resume.etat).toBe("ok");
    expect(body.resume.numeros).toBeNull();
    expect(body.liste.inscrits).toHaveLength(4);
  });

  it("sans la table des inscrits : 200, disponible false, message clair", async () => {
    abonnesAbsents = true;
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ disponible: false });
  });

  it("filtre par statut, pagination bornée, paramètre invalide refusé", async () => {
    const body = await (await GET(req("?statut=PENDING&page=1&limit=10"))).json();
    expect(body.liste.inscrits.map((i: { email: string }) => i.email)).toEqual(["attente@exemple.fr"]);
    expect(body.liste.pagination).toMatchObject({ page: 1, limit: 10, total: 1, totalPages: 1 });
    expect((await GET(req("?statut=PIRATE"))).status).toBe(400);
    expect((await GET(req("?limit=1000"))).status).toBe(400);
  });
});
