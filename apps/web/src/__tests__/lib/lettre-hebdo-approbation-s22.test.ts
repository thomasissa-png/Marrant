/**
 * @jest-environment node
 *
 * Verrou d'approbation de la lettre de la semaine (s22, décision de Thomas du 25/10 :
 * « chaque numéro doit être approuvé par Thomas avant envoi »). Interrupteur d'envoi
 * OUVERT et heure atteinte dans tous les cas : seule l'approbation décide.
 *  - VALIDE sans approbation : rien ne part, quelle que soit l'heure dans la semaine.
 *  - L'approbation ne se pose que par l'action admin (Bearer ADMIN_PASSWORD), pour
 *    l'empreinte du texte affiché ; brouillon, empreinte périmée, sans mot de passe : refus.
 *  - Toute modification du contenu après approbation (synchronisation du fichier ou
 *    écriture directe en base) l'annule ; un retrait explicite aussi.
 */
// s22 (25/10) : interrupteurs RÉELS (ouverts), plus aucun forçage par mock :
// la preuve porte sur la configuration qui sera déployée.
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
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
  approvedAt: Date | null;
  approvedBy: string | null;
  approvedHash: string | null;
};
type Ligne = { id: string; issueId: string; email: string; status: string; attempts: number };
const mockDb = { issues: [] as Issue[], journal: [] as Ligne[], users: [] as Array<Record<string, unknown>> };
const trouve = (w: { audience_periodKey?: { audience: string; periodKey: string }; id?: string }) =>
  mockDb.issues.find((i) => (w.id ? i.id === w.id : i.audience === w.audience_periodKey!.audience && i.periodKey === w.audience_periodKey!.periodKey)) ?? null;

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findUnique: jest.fn(async ({ where }: { where: Parameters<typeof trouve>[0] }) => (trouve(where) ? { ...trouve(where)! } : null)),
      // Liste admin (sans `periodKey`) ; synchronisation : numéros absents du fichier (`periodKey.notIn`).
      findMany: jest.fn(async ({ where }: { where: { periodKey?: { notIn: string[] } } }) =>
        mockDb.issues.filter((i) => i.audience === "HEBDO_PREMIUM" && i.status !== "ENVOYE" && !where.periodKey?.notIn.includes(i.periodKey)).map((i) => ({ ...i })),
      ),
      deleteMany: jest.fn(async ({ where }: { where: { periodKey: { notIn: string[] } } }) => {
        const avant = mockDb.issues.length;
        mockDb.issues = mockDb.issues.filter(
          (i) => !(i.audience === "HEBDO_PREMIUM" && i.status !== "ENVOYE" && !where.periodKey.notIn.includes(i.periodKey) && !mockDb.journal.some((l) => l.issueId === i.id)),
        );
        return { count: avant - mockDb.issues.length };
      }),
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
    user: { findMany: jest.fn(async ({ where }: { where: { emailOptOut?: boolean } }) => (where.emailOptOut ? [] : mockDb.users)) },
    ceoLead: { findMany: jest.fn(async () => []) },
    blogArticle: { findMany: jest.fn(async () => []) },
    learningPath: { findMany: jest.fn(async () => []) },
    newsletterSubscriber: { findMany: jest.fn(async () => []) },
    newsletterSend: {
      findMany: jest.fn(async ({ where }: { where: { issueId: string } }) => mockDb.journal.filter((l) => l.issueId === where.issueId).map((l) => ({ ...l }))),
      create: jest.fn(async ({ data }: { data: Omit<Ligne, "id"> }) => {
        const ligne = { id: `l${mockDb.journal.length + 1}`, ...data };
        mockDb.journal.push(ligne);
        return { id: ligne.id };
      }),
      updateMany: jest.fn(async ({ where, data }: { where: Partial<Ligne>; data: Partial<Ligne> }) => {
        const l = mockDb.journal.find((x) => x.id === where.id && x.status === where.status && x.attempts === where.attempts);
        if (l) Object.assign(l, data);
        return { count: l ? 1 : 0 };
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Ligne> }) => Object.assign(mockDb.journal.find((x) => x.id === where.id)!, data)),
    },
  },
}));

import { NextRequest } from "next/server";
import factice from "../helpers/lettre-hebdo-numero-factice.json";
import numerosReels from "@/data/lettre/hebdo-premium.json";
import { LETTRE_HEBDO_ENVOIS_OUVERTS, LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { synchroniserNumerosHebdo } from "@/lib/lettre/numeros-hebdo";
import { envoyerLettreDeLaSemaine } from "@/lib/lettre/envoi-hebdo";
import { approbationValide, empreinteNumero } from "@/lib/lettre/approbation-hebdo";
import { GET as getNumeros } from "@/app/api/admin/lettre-premium/numeros/route";
import { POST as approuver, DELETE as retirer } from "@/app/api/admin/lettre-premium/approbation/route";

const BASE = "https://deviens-marrant.fr";
const avant = new Date("2026-11-01T10:00:00Z");
const JEUDI_8H05 = new Date("2026-11-12T07:05:00Z");
const DIMANCHE_22H = new Date("2026-11-15T21:00:00Z");

const requete = (method: string, corps?: unknown, mdp = "mdp-admin") =>
  new NextRequest("http://localhost/api/admin/lettre-premium/approbation", {
    method,
    headers: { authorization: `Bearer ${mdp}`, "content-type": "application/json" },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
const lister = async () => (await (await getNumeros(new NextRequest("http://localhost/api/admin/lettre-premium/numeros", { headers: { authorization: "Bearer mdp-admin" } }))).json()) as {
  numeros: Array<{ semaine: string; empreinte: string; approuve: boolean; approbationPerimee: boolean; texte: string }>;
};
const envoyer = () => jest.fn().mockResolvedValue(undefined);
const tache = (now: Date, e = envoyer()) => envoyerLettreDeLaSemaine(now, { envoyer: e, baseUrl: BASE });

beforeEach(async () => {
  process.env.ADMIN_PASSWORD = "mdp-admin";
  mockDb.issues = [];
  mockDb.journal = [];
  mockDb.users = [
    {
      id: "u1",
      email: "yanis@x.fr",
      plan: "PREMIUM",
      emailVerified: avant,
      emailOptOut: false,
      updatedAt: avant,
      accounts: [],
      premiumLetter: { enabled: true, activatedAt: avant, consentVersion: "lettre-hebdo-premium-v1", unsubscribeToken: "jeton".padEnd(43, "x") },
    },
  ];
  // Le numéro arrive en base comme en production : synchronisation du fichier, statut VALIDE.
  await synchroniserNumerosHebdo(factice, avant);
});

describe("Sans approbation de Thomas, rien ne part", () => {
  it("configuration déployée : inscriptions et envois ouverts (aucun forçage)", () => {
    expect(LETTRE_HEBDO_INSCRIPTIONS_OUVERTES).toBe(true);
    expect(LETTRE_HEBDO_ENVOIS_OUVERTS).toBe(true);
  });

  it("fichier réel synchronisé (W46, lettre A) : aucun numéro approuvé par défaut, le jeudi 12/11 8 h 05 rien ne part", async () => {
    mockDb.issues = [];
    await synchroniserNumerosHebdo(numerosReels, avant);
    expect(mockDb.issues).toHaveLength(1);
    for (const i of mockDb.issues) {
      expect(i).toMatchObject({ approvedAt: null, approvedBy: null, approvedHash: null });
      expect(approbationValide(i)).toBe(false);
    }
    // Même passé à VALIDE (commit de Thomas), un numéro sans approbation ne part pas.
    for (const i of mockDb.issues) i.status = "VALIDE";
    const e = envoyer();
    const r = await tache(JEUDI_8H05, e);
    expect(r).toMatchObject({ ferme: false, numero: "2026-W46", nonApprouve: true, envoyes: 0 });
    expect(e).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
  });

  it.each([
    ["jeudi 8 h 05", JEUDI_8H05],
    ["dimanche 22 h (fin de semaine)", DIMANCHE_22H],
  ])("numéro VALIDE, interrupteur ouvert, %s : aucun e-mail, alerte « non approuvé »", async (_, now) => {
    expect(mockDb.issues[0]).toMatchObject({ status: "VALIDE", approvedAt: null });
    const e = envoyer();
    const r = await tache(now, e);
    expect(r).toMatchObject({ nonApprouve: true, envoyes: 0, termine: false });
    expect(e).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
    expect(mockDb.issues[0].status).toBe("VALIDE");
  });

  it("date d'approbation sans empreinte (écriture directe en base) : refusé", async () => {
    Object.assign(mockDb.issues[0], { approvedAt: avant, approvedBy: "admin", approvedHash: null });
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });
});

describe("L'approbation : action admin explicite, sur le texte affiché", () => {
  it("sans mot de passe admin : 401, rien d'approuvé", async () => {
    const { numeros } = await lister();
    const res = await approuver(requete("POST", { semaine: "2026-W46", empreinte: numeros[0].empreinte }, "mauvais"));
    expect(res.status).toBe(401);
    expect(mockDb.issues[0].approvedAt).toBeNull();
  });

  it("empreinte d'un autre texte : 409, rien d'approuvé", async () => {
    const res = await approuver(requete("POST", { semaine: "2026-W46", empreinte: "a".repeat(64) }));
    expect(res.status).toBe(409);
    expect(mockDb.issues[0].approvedAt).toBeNull();
  });

  it("brouillon : 409, jamais approuvable", async () => {
    mockDb.issues[0].status = "BROUILLON";
    const res = await approuver(requete("POST", { semaine: "2026-W46", empreinte: empreinteNumero(mockDb.issues[0]) }));
    expect(res.status).toBe(409);
    expect(mockDb.issues[0].approvedAt).toBeNull();
  });

  it("aperçu puis « Approuver ce numéro » : approbation posée (date, auteur, empreinte), puis le numéro part le jeudi", async () => {
    const { numeros } = await lister();
    expect(numeros[0]).toMatchObject({ semaine: "2026-W46", approuve: false, approbationPerimee: false });
    expect(numeros[0].texte).toContain("Numéro FACTICE");
    const res = await approuver(requete("POST", { semaine: "2026-W46", empreinte: numeros[0].empreinte }));
    expect(res.status).toBe(200);
    expect(mockDb.issues[0]).toMatchObject({ approvedBy: "admin", approvedHash: numeros[0].empreinte });
    expect(mockDb.issues[0].approvedAt).toBeInstanceOf(Date);
    expect((await lister()).numeros[0].approuve).toBe(true);
    const e = envoyer();
    const r = await tache(JEUDI_8H05, e);
    expect(r).toMatchObject({ nonApprouve: false, envoyes: 1, termine: true });
    expect(e).toHaveBeenCalledTimes(1);
  });
});

describe("Ce qui annule l'approbation", () => {
  async function approuve() {
    const { numeros } = await lister();
    expect((await approuver(requete("POST", { semaine: "2026-W46", empreinte: numeros[0].empreinte }))).status).toBe(200);
  }

  it("fichier modifié puis synchronisé (corps changé) : approbation effacée, rien ne part", async () => {
    await approuve();
    const modifie = [{ ...factice[0], corps: factice[0].corps.replace("trois répliques", "trois réponses") }];
    await synchroniserNumerosHebdo(modifie, avant);
    expect(mockDb.issues[0]).toMatchObject({ approvedAt: null, approvedBy: null, approvedHash: null });
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });

  it("synchronisation sans changement : l'approbation reste", async () => {
    await approuve();
    await synchroniserNumerosHebdo(factice, avant);
    expect(approbationValide(mockDb.issues[0])).toBe(true);
  });

  it.each([
    ["corps modifié directement en base", { bodyText: "Autre texte." }],
    ["objet modifié directement en base", { subject: "Autre objet" }],
    ["date d'envoi déplacée", { scheduledFor: new Date("2026-11-12T06:00:00Z") }],
  ])("%s après approbation : empreinte différente, rien ne part", async (_, modif) => {
    await approuve();
    Object.assign(mockDb.issues[0], modif);
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
    expect((await lister()).numeros[0]).toMatchObject({ approuve: false, approbationPerimee: true });
  });

  it("« Retirer l'approbation » : rien ne part", async () => {
    await approuve();
    expect((await retirer(requete("DELETE", { semaine: "2026-W46" }))).status).toBe(200);
    expect(mockDb.issues[0].approvedAt).toBeNull();
    const e = envoyer();
    expect((await tache(JEUDI_8H05, e)).nonApprouve).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });
});
