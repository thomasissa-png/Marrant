/**
 * @jest-environment node
 *
 * Lettre s21 : tâche d'envoi mensuelle. Base simulée en mémoire (journal avec
 * contrainte unique numéro + adresse) pour vérifier « jamais deux fois », les
 * exclusions (Premium avec hebdo, oppositions) et les en-têtes de désinscription.
 */
let mockOuvert = true;
// Envois : null = suit `mockOuvert` (les deux interrupteurs ensemble), sinon valeur propre.
let mockEnvoisOuverts: boolean | null = null;
// Valeur d'essai : la vraie mention attend @legal (marqueur, voir lettre-numeros-s21.test.ts).
let mockMention = "deviens-marrant SAS";
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_INSCRIPTIONS_OUVERTES() {
    return mockOuvert;
  },
  get LETTRE_ENVOIS_OUVERTS() {
    return mockEnvoisOuverts ?? mockOuvert;
  },
  get LETTRE_MENTION_EDITEUR_NUMERO() {
    return mockMention;
  },
}));

type Ligne = { id: string; issueId: string; email: string; status: string; attempts: number; error?: string | null; sentAt?: Date };
const mockDb = {
  issue: null as null | Record<string, unknown>,
  abonnes: [] as Array<{ email: string; unsubscribeToken: string; confirmedAt: Date | null }>,
  users: [] as Array<Record<string, unknown>>,
  leads: [] as Array<Record<string, unknown>>,
  journal: [] as Ligne[],
};

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findFirst: jest.fn(async () => mockDb.issue),
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => Object.assign(mockDb.issue ?? {}, data)),
    },
    user: { findMany: jest.fn(async () => mockDb.users) },
    ceoLead: { findMany: jest.fn(async () => mockDb.leads) },
    newsletterSubscriber: { findMany: jest.fn(async () => mockDb.abonnes) },
    newsletterSend: {
      findMany: jest.fn(async () => mockDb.journal.map((l) => ({ ...l }))),
      create: jest.fn(async ({ data }: { data: Omit<Ligne, "id"> }) => {
        if (mockDb.journal.some((l) => l.issueId === data.issueId && l.email === data.email)) {
          throw Object.assign(new Error("unique"), { code: "P2002" });
        }
        const ligne = { id: `l${mockDb.journal.length + 1}`, ...data };
        mockDb.journal.push(ligne);
        return { id: ligne.id };
      }),
      updateMany: jest.fn(async ({ where, data }: { where: Partial<Ligne>; data: Partial<Ligne> }) => {
        const l = mockDb.journal.find((x) => x.id === where.id && x.status === where.status && x.attempts === where.attempts);
        if (!l) return { count: 0 };
        Object.assign(l, data);
        return { count: 1 };
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Ligne> }) => {
        const l = mockDb.journal.find((x) => x.id === where.id)!;
        Object.assign(l, data);
        return l;
      }),
    },
  },
}));

import { corpsNumero, envoyerLettreDuMois, periodeMensuelle } from "@/lib/lettre/envoi";
import { NBSP } from "@/lib/fr-typo";

const NOW = new Date("2026-11-05T08:30:00Z");
const BASE = "https://deviens-marrant.fr";
const avant = new Date("2026-10-01T00:00:00Z");

function abonne(email: string, confirmedAt: Date | null = avant) {
  return { email, unsubscribeToken: `u-${email}`.padEnd(43, "x"), confirmedAt };
}

beforeEach(() => {
  mockOuvert = true;
  mockEnvoisOuverts = null;
  mockMention = "deviens-marrant SAS";
  mockDb.issue = { id: "n1", periodKey: "2026-11", subject: "Objet du mois", bodyText: "Corps préparé du numéro.", status: "VALIDE" };
  mockDb.abonnes = [abonne("a@x.fr"), abonne("b@x.fr"), abonne("premium@x.fr"), abonne("stop@x.fr"), abonne("revenu@x.fr", new Date("2026-10-20T00:00:00Z"))];
  mockDb.users = [
    { email: "premium@x.fr", plan: "PREMIUM", emailOptOut: false, updatedAt: avant, premiumLetter: { enabled: true } },
    { email: "stop@x.fr", plan: "FREE", emailOptOut: true, updatedAt: new Date("2026-10-10T00:00:00Z"), premiumLetter: null },
    { email: "revenu@x.fr", plan: "FREE", emailOptOut: true, updatedAt: new Date("2026-10-10T00:00:00Z"), premiumLetter: null },
  ];
  mockDb.leads = [];
  mockDb.journal = [];
});

describe("periodeMensuelle", () => {
  it("suit le calendrier de Paris (31/10 23 h 30 UTC = 1er novembre à Paris)", () => {
    expect(periodeMensuelle(new Date("2026-10-31T23:30:00Z"))).toBe("2026-11");
    expect(periodeMensuelle(new Date("2026-10-31T22:30:00Z"))).toBe("2026-10");
  });
});

describe("envoyerLettreDuMois", () => {
  it("interrupteur fermé : rien n'est lu ni envoyé", async () => {
    mockOuvert = false;
    const envoyer = jest.fn();
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r.ferme).toBe(true);
    expect(envoyer).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
  });

  it("intégration s21 : envois fermés, inscriptions ouvertes : rien n'est envoyé (interrupteurs indépendants)", async () => {
    mockOuvert = true;
    mockEnvoisOuverts = false;
    const envoyer = jest.fn();
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r.ferme).toBe(true);
    expect(envoyer).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
  });

  it("intégration s21 : inscriptions fermées n'arrêtent pas les envois aux inscrits déjà confirmés", async () => {
    mockOuvert = false;
    mockEnvoisOuverts = true;
    const r = await envoyerLettreDuMois(NOW, { envoyer: jest.fn().mockResolvedValue(undefined), baseUrl: BASE });
    expect(r.ferme).toBe(false);
  });

  it("avant le premier jeudi du mois à 8 h (Paris) : rien n'est lu ni envoyé, même numéro programmé plus tôt en base", async () => {
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: { newsletterIssue: { findFirst: jest.Mock } } };
    prisma.newsletterIssue.findFirst.mockClear();
    const envoyer = jest.fn();
    // Jeudi 05/11/2026 à 7 h 59 (Paris, UTC+1), puis mercredi 04/11.
    for (const t of ["2026-11-05T06:59:00Z", "2026-11-04T12:00:00Z"]) {
      const r = await envoyerLettreDuMois(new Date(t), { envoyer, baseUrl: BASE });
      expect(r).toMatchObject({ ferme: false, numero: null, envoyes: 0 });
    }
    expect(prisma.newsletterIssue.findFirst).not.toHaveBeenCalled();
    expect(envoyer).not.toHaveBeenCalled();
    // Jeudi 05/11/2026 à 8 h pile (Paris) : la tâche lit le numéro du mois.
    await envoyerLettreDuMois(new Date("2026-11-05T07:00:00Z"), { envoyer, baseUrl: BASE });
    expect(prisma.newsletterIssue.findFirst).toHaveBeenCalledTimes(1);
  });

  it("marqueur [À COMPLÉTER] dans le pied (mention d'éditeur) : numéro bloqué, rien n'est envoyé", async () => {
    // Garde-fou conservé pour l'avenir : un marqueur réintroduit dans la mention bloque l'envoi.
    mockMention = `${jest.requireActual("@/config/lettre").MARQUEUR_A_COMPLETER} : mention d'éditeur]`;
    const envoyer = jest.fn();
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r).toMatchObject({ bloque: true, numero: "2026-11", envoyes: 0, termine: false });
    expect(envoyer).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
  });

  it("aucun numéro VALIDE du mois : rien n'est envoyé (jamais de contenu généré)", async () => {
    mockDb.issue = null;
    const envoyer = jest.fn();
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r.numero).toBeNull();
    expect(envoyer).not.toHaveBeenCalled();
  });

  it("envoie aux confirmés, exclut Premium avec hebdo et opposition antérieure, journalise, termine le numéro", async () => {
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    const destinataires = envoyer.mock.calls.map((c) => c[0]).sort();
    // revenu@ : confirmation de la lettre POSTÉRIEURE à l'opposition (nouvel acte positif, @legal L6).
    expect(destinataires).toEqual(["a@x.fr", "b@x.fr", "revenu@x.fr"]);
    expect(r.exclusPremiumHebdo).toBe(1);
    expect(r.exclusOpposition).toBe(1);
    expect(r.envoyes).toBe(3);
    expect(mockDb.journal.map((l) => [l.email, l.status])).toEqual([
      ["a@x.fr", "ENVOYE"],
      ["b@x.fr", "ENVOYE"],
      ["revenu@x.fr", "ENVOYE"],
    ]);
    expect(r.termine).toBe(true);
    expect(mockDb.issue?.status).toBe("ENVOYE");

    const [, sujet, texte, headers] = envoyer.mock.calls[0];
    expect(sujet).toBe("Objet du mois");
    expect(texte).toContain("Corps préparé du numéro.");
    expect(texte).toContain(`${BASE}/lettre/desinscrire?token=u-a%40x.fr`);
    expect(texte).toContain(`Éditeur${NBSP}: deviens-marrant SAS`);
    expect(texte).not.toMatch(/<img|pixel/i);
    expect(headers["List-Unsubscribe"]).toMatch(/^<https:\/\/deviens-marrant\.fr\/api\/newsletter\/unsubscribe\/u-a%40x\.fr/);
    expect(headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });

  it("un Premium SANS lettre hebdomadaire garde la mensuelle", async () => {
    mockDb.users = [{ email: "premium@x.fr", plan: "PREMIUM", emailOptOut: false, updatedAt: avant, premiumLetter: { enabled: false } }];
    mockDb.abonnes = [abonne("premium@x.fr")];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer).toHaveBeenCalledTimes(1);
  });

  it("prospect opposé (CeoLead) : exclu", async () => {
    mockDb.users = [];
    mockDb.leads = [{ email: "A@x.fr", updatedAt: new Date("2026-10-15T00:00:00Z") }];
    mockDb.abonnes = [abonne("a@x.fr")];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer).not.toHaveBeenCalled();
    expect(r.exclusOpposition).toBe(1);
  });

  it("tâche relancée : personne ne reçoit deux fois le même numéro", async () => {
    const envoyer = jest.fn().mockResolvedValue(undefined);
    await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    mockDb.issue = { ...mockDb.issue, status: "VALIDE" };
    envoyer.mockClear();
    const r2 = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer).not.toHaveBeenCalled();
    expect(r2.dejaTraites).toBe(3);
  });

  it("ligne réservée par un passage concurrent (RESERVE) : jamais renvoyée", async () => {
    mockDb.journal = [{ id: "l0", issueId: "n1", email: "a@x.fr", status: "RESERVE", attempts: 1 }];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer.mock.calls.map((c) => c[0])).not.toContain("a@x.fr");
  });

  it("échec Resend : ECHEC journalisé sans adresse, retenté au passage suivant, numéro non terminé", async () => {
    mockDb.abonnes = [abonne("a@x.fr")];
    mockDb.users = [];
    const envoyer = jest.fn().mockRejectedValueOnce(new Error("Resend : refus pour a@x.fr")).mockResolvedValue(undefined);
    const r1 = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r1.echecs).toBe(1);
    expect(r1.termine).toBe(false);
    expect(mockDb.journal[0].status).toBe("ECHEC");
    expect(mockDb.journal[0].error).not.toContain("a@x.fr");

    const r2 = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r2.envoyes).toBe(1);
    expect(mockDb.journal[0]).toMatchObject({ status: "ENVOYE", attempts: 2 });
    expect(r2.termine).toBe(true);
  });
});

describe("corpsNumero", () => {
  it("ajoute le pied légal et la désinscription, sans tiret cadratin", () => {
    const texte = corpsNumero("La vanne du mois.\n", BASE, "tok");
    expect(texte).toContain("Tu reçois cette lettre parce que tu l'as demandée sur deviens-marrant.fr.");
    expect(texte).toContain(`Contact${NBSP}: contact@deviens-marrant.fr`);
    expect(texte).toContain(`Confidentialité${NBSP}: ${BASE}/confidentialite`);
    expect(texte).not.toContain("—");
  });
});
