/**
 * @jest-environment node
 *
 * Verrou d'approbation de la lettre MENSUELLE (s22, chantier A ; décision de Thomas du 25/10 :
 * « il approuve chaque lettre avant envoi »). Même mécanisme que la lettre de la semaine
 * (`lettre-hebdo-approbation-s22.test.ts`). Interrupteur `LETTRE_ENVOIS_OUVERTS` OUVERT et
 * heure atteinte dans tous les cas : seule l'approbation décide. Numéro = vrai n°1 du fichier
 * `data/lettre/numeros.json` (VALIDE, envoi prévu le jeudi 05/11 à 8 h, Paris).
 *  - VALIDE sans approbation : rien ne part, ni à l'heure prévue, ni plus tard dans le mois.
 *  - Approuvé (action admin, empreinte du texte affiché) : part au passage suivant.
 *  - Approuvé en retard : part au premier passage qui suit, tant que le mois n'est pas fini.
 *  - Modifié (fichier synchronisé ou base) ou approbation retirée : bloqué.
 */
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  LETTRE_ENVOIS_OUVERTS: true,
  LETTRE_HEBDO_ENVOIS_OUVERTS: false,
  LETTRE_MENTION_EDITEUR_NUMERO: "deviens-marrant SAS",
}));

type Issue = {
  id: string;
  audience: string;
  periodKey: string;
  subject: string;
  preheader: string | null;
  bodyText: string;
  scheduledFor: Date;
  status: string;
  validatedAt?: Date | null;
  sentAt?: Date | null;
  approvedAt: Date | null;
  approvedBy: string | null;
  approvedHash: string | null;
};
type Ligne = { id: string; issueId: string; email: string; status: string; attempts: number };
const mockDb = { issues: [] as Issue[], journal: [] as Ligne[] };
const mockAlertes: Array<{ cle: string; sujet: string }> = [];
const trouve = (w: { audience_periodKey?: { audience: string; periodKey: string }; id?: string }) =>
  mockDb.issues.find((i) => (w.id ? i.id === w.id : i.audience === w.audience_periodKey!.audience && i.periodKey === w.audience_periodKey!.periodKey)) ?? null;

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findUnique: jest.fn(async ({ where }: { where: Parameters<typeof trouve>[0] }) => (trouve(where) ? { ...trouve(where)! } : null)),
      // Même filtre que la requête réelle de `envoyerLettreDuMois`.
      findFirst: jest.fn(async ({ where }: { where: { audience: string; periodKey: string; status: string; scheduledFor: { lte: Date } } }) => {
        const i = mockDb.issues.find(
          (x) => x.audience === where.audience && x.periodKey === where.periodKey && x.status === where.status && x.scheduledFor <= where.scheduledFor.lte,
        );
        return i ? { ...i } : null;
      }),
      findMany: jest.fn(async () => mockDb.issues.filter((i) => i.status !== "ENVOYE").map((i) => ({ ...i }))),
      create: jest.fn(async ({ data }: { data: Omit<Issue, "id" | "approvedAt" | "approvedBy" | "approvedHash"> }) => {
        const i = { id: `i${mockDb.issues.length + 1}`, approvedAt: null, approvedBy: null, approvedHash: null, ...data };
        mockDb.issues.push(i);
        return i;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Issue> }) => Object.assign(trouve(where)!, data)),
      updateMany: jest.fn(async ({ where, data }: { where: { id: string; status: string }; data: Partial<Issue> }) => {
        const i = mockDb.issues.find((x) => x.id === where.id && x.status === where.status);
        if (i) Object.assign(i, data);
        return { count: i ? 1 : 0 };
      }),
    },
    user: { findMany: jest.fn(async () => []) },
    ceoLead: { findMany: jest.fn(async () => []) },
    // L'article cité par le n°1 est en ligne depuis le 02/11 (date plancher du fichier).
    blogArticle: { findMany: jest.fn(async () => [{ slug: "soiree-de-noel-entreprise-humour", publishedAt: new Date("2026-11-02T06:00:00Z") }]) },
    newsletterSubscriber: { findMany: jest.fn(async () => [{ email: "abonne@x.fr", unsubscribeToken: "u".repeat(43), confirmedAt: new Date("2026-10-01T00:00:00Z") }]) },
    newsletterSend: {
      findMany: jest.fn(async ({ where }: { where: { issueId: string } }) => mockDb.journal.filter((l) => l.issueId === where.issueId).map((l) => ({ ...l }))),
      create: jest.fn(async ({ data }: { data: Omit<Ligne, "id"> }) => {
        const ligne = { id: `l${mockDb.journal.length + 1}`, ...data };
        mockDb.journal.push(ligne);
        return { id: ligne.id };
      }),
      updateMany: jest.fn(async () => ({ count: 0 })),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Ligne> }) => Object.assign(mockDb.journal.find((x) => x.id === where.id)!, data)),
    },
  },
}));
jest.mock("@/lib/job-lock", () => ({ tryAcquireLock: jest.fn(async () => true), releaseLock: jest.fn(async () => undefined) }));
jest.mock("@/lib/admin-alerts", () => ({
  recordAdminAlert: jest.fn(async (a: { cle: string; sujet: string }) => {
    mockAlertes.push({ cle: a.cle, sujet: a.sujet });
    return true;
  }),
}));
jest.mock("@/lib/email", () => ({ sendServiceTextEmail: jest.fn(async () => undefined) }));

import { NextRequest } from "next/server";
import numerosJson from "@/data/lettre/numeros.json";
import { synchroniserNumerosLettre } from "@/lib/lettre/numeros";
import { envoyerLettreDuMois } from "@/lib/lettre/envoi";
import { approbationValide } from "@/lib/lettre/approbation-hebdo";
import { sendServiceTextEmail } from "@/lib/email";
import { createSchedulerJobs } from "@/lib/scheduler/jobs";
import { GET as getNumeros } from "@/app/api/admin/lettre-premium/numeros/route";
import { POST as approuver, DELETE as retirer } from "@/app/api/admin/lettre-premium/approbation/route";

const BASE = "https://deviens-marrant.fr";
const avant = new Date("2026-10-25T10:00:00Z");
const JEUDI_8H05 = new Date("2026-11-05T07:05:00Z"); // jeudi 05/11, 8 h 05 Paris : heure prévue du n°1
const JEUDI_12_10H = new Date("2026-11-12T09:00:00Z");
const LUNDI_30_23H45 = new Date("2026-11-30T22:45:00Z"); // dernier passage de novembre (Paris)
const MARDI_1ER_0H00 = new Date("2026-11-30T23:00:00Z"); // 1er décembre 0 h Paris : mois fini

const requete = (method: string, corps?: unknown, mdp = "mdp-admin") =>
  new NextRequest("http://localhost/api/admin/lettre-premium/approbation", {
    method,
    headers: { authorization: `Bearer ${mdp}`, "content-type": "application/json" },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
type NumeroListe = { audience: string; semaine: string; empreinte: string; approuve: boolean; approbationPerimee: boolean; texte: string };
const lister = async () =>
  (await (await getNumeros(new NextRequest("http://localhost/api/admin/lettre-premium/numeros", { headers: { authorization: "Bearer mdp-admin" } }))).json()) as {
    numeros: NumeroListe[];
  };
const novembre = async () => (await lister()).numeros.find((n) => n.audience === "MENSUELLE" && n.semaine === "2026-11")!;
const envoyer = () => jest.fn().mockResolvedValue(undefined);
const tache = (now: Date, e = envoyer()) => envoyerLettreDuMois(now, { envoyer: e, baseUrl: BASE });
const n1 = () => mockDb.issues.find((i) => i.periodKey === "2026-11")!;
async function approuveNovembre() {
  const { empreinte } = await novembre();
  expect((await approuver(requete("POST", { mois: "2026-11", empreinte }))).status).toBe(200);
}

beforeEach(async () => {
  process.env.ADMIN_PASSWORD = "mdp-admin";
  mockDb.issues = [];
  mockDb.journal = [];
  mockAlertes.length = 0;
  jest.mocked(sendServiceTextEmail).mockClear();
  // Comme en production : synchronisation du fichier au démarrage, n°1 VALIDE.
  await synchroniserNumerosLettre(numerosJson, avant);
});

describe("Sans approbation de Thomas, le n°1 ne part pas (interrupteur ouvert)", () => {
  it.each([
    ["jeudi 05/11 8 h 05 (heure prévue)", JEUDI_8H05],
    ["lundi 30/11 23 h 45 (dernier passage du mois)", LUNDI_30_23H45],
  ])("%s : aucun e-mail, résultat « non approuvé »", async (_, now) => {
    expect(n1()).toMatchObject({ status: "VALIDE", approvedAt: null, scheduledFor: new Date("2026-11-05T07:00:00Z") });
    const e = envoyer();
    const r = await tache(now, e);
    expect(r).toMatchObject({ ferme: false, numero: "2026-11", nonApprouve: true, envoyes: 0, termine: false });
    expect(e).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
    expect(n1().status).toBe("VALIDE");
  });

  it("tâche planifiée : alerte admin « en attente de ton approbation », aucun e-mail", async () => {
    const jobs = createSchedulerJobs(async () => new Response("{}"));
    await jobs.runLettreMensuelleJob(JEUDI_8H05);
    expect(sendServiceTextEmail).not.toHaveBeenCalled();
    expect(mockAlertes).toEqual([{ cle: "lettre-mensuelle-non-approuve", sujet: "Lettre du mois 2026-11 : en attente de ton approbation" }]);
  });

  it("date d'approbation sans empreinte (écriture directe en base) : refusé", async () => {
    Object.assign(n1(), { approvedAt: avant, approvedBy: "admin", approvedHash: null });
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });
});

describe("Approuvé dans l'admin, il part", () => {
  it("« Numéros à approuver » liste le n°1 (texte tel qu'il partira) ; approuvé, il part au passage suivant", async () => {
    const n = await novembre();
    expect(n).toMatchObject({ approuve: false, approbationPerimee: false });
    expect(n.texte).toContain("Avec un collègue, on a enfin comparé nos salaires.");
    expect(n.texte).toContain("deviens-marrant SAS");
    await approuveNovembre();
    expect(n1()).toMatchObject({ approvedBy: "admin", approvedHash: n.empreinte });
    expect((await novembre()).approuve).toBe(true);
    const e = envoyer();
    const r = await tache(JEUDI_8H05, e);
    expect(r).toMatchObject({ nonApprouve: false, envoyes: 1, termine: true });
    expect(e).toHaveBeenCalledTimes(1);
    expect(n1().status).toBe("ENVOYE");
  });

  it("tâche planifiée, n°1 approuvé : l'e-mail part, aucune alerte d'attente", async () => {
    await approuveNovembre();
    await createSchedulerJobs(async () => new Response("{}")).runLettreMensuelleJob(JEUDI_8H05);
    expect(sendServiceTextEmail).toHaveBeenCalledTimes(1);
    expect(mockAlertes.map((a) => a.cle)).not.toContain("lettre-mensuelle-non-approuve");
  });

  it.each([
    ["le jeudi 12/11 à 10 h", JEUDI_12_10H],
    ["le lundi 30/11 à 23 h 45", LUNDI_30_23H45],
  ])("approbation tardive : bloqué à l'heure prévue, puis part au premier passage qui suit, %s", async (_, quand) => {
    expect((await tache(JEUDI_8H05)).nonApprouve).toBe(true);
    await approuveNovembre();
    const e = envoyer();
    expect(await tache(quand, e)).toMatchObject({ nonApprouve: false, envoyes: 1, termine: true });
    expect(e).toHaveBeenCalledTimes(1);
  });

  it("approuvé après la fin du mois (1er décembre 0 h, Paris) : le n°1 ne part plus jamais", async () => {
    await approuveNovembre();
    const e = envoyer();
    const r = await tache(MARDI_1ER_0H00, e);
    expect(r.numero).toBeNull(); // le mois a changé : novembre n'est plus lu, décembre pas encore à l'heure
    expect(e).not.toHaveBeenCalled();
    expect(n1().status).toBe("VALIDE");
  });

  it("corps invalide (ni semaine ni mois, mois impossible) : 400, rien d'approuvé", async () => {
    const { empreinte } = await novembre();
    expect((await approuver(requete("POST", { empreinte }))).status).toBe(400);
    expect((await approuver(requete("POST", { mois: "2026-13", empreinte }))).status).toBe(400);
    expect((await approuver(requete("POST", { mois: "2026-11", empreinte }, "mauvais"))).status).toBe(401);
    expect(n1().approvedAt).toBeNull();
  });
});

describe("Modifié, il est bloqué", () => {
  it("fichier modifié puis synchronisé (corps changé) : approbation effacée, rien ne part", async () => {
    await approuveNovembre();
    const modifie = numerosJson.map((n) => (n.periode === "2026-11" ? { ...n, corps: `${n.corps}\nUne ligne ajoutée après l'approbation.` } : n));
    await synchroniserNumerosLettre(modifie, avant);
    expect(n1()).toMatchObject({ approvedAt: null, approvedBy: null, approvedHash: null });
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });

  it("synchronisation sans changement : l'approbation reste", async () => {
    await approuveNovembre();
    await synchroniserNumerosLettre(numerosJson, avant);
    expect(approbationValide(n1())).toBe(true);
  });

  it.each([
    ["corps modifié directement en base", { bodyText: "Autre texte." }],
    ["objet modifié directement en base", { subject: "Autre objet" }],
    ["pré-en-tête modifié directement en base", { preheader: "Autre pré-en-tête" }],
  ])("%s après approbation : empreinte différente, rien ne part, l'admin affiche « à réapprouver »", async (_, modif) => {
    await approuveNovembre();
    Object.assign(n1(), modif);
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
    expect(await novembre()).toMatchObject({ approuve: false, approbationPerimee: true });
  });

  it("empreinte d'un autre texte : 409, rien d'approuvé", async () => {
    expect((await approuver(requete("POST", { mois: "2026-11", empreinte: "a".repeat(64) }))).status).toBe(409);
    expect(n1().approvedAt).toBeNull();
  });

  it("« Retirer l'approbation » : rien ne part", async () => {
    await approuveNovembre();
    expect((await retirer(requete("DELETE", { mois: "2026-11" }))).status).toBe(200);
    expect(n1().approvedAt).toBeNull();
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });
});
