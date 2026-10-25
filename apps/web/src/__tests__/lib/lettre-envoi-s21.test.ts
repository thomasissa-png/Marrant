/**
 * @jest-environment node
 *
 * Lettre s21 : tâche d'envoi mensuelle. Base simulée en mémoire (journal avec
 * contrainte unique numéro + adresse) pour vérifier « jamais deux fois », les
 * exclusions (oppositions), les en-têtes de désinscription et, s22 (décision de Thomas du
 * 25/10), le canal Premium : les destinataires de l'hebdo reçoivent la lettre du mois en version
 * Premium (sans invitation, pied hebdo), une seule fois, plus de pause.
 */
let mockOuvert = true;
// Envois : null = suit `mockOuvert` (les deux interrupteurs ensemble), sinon valeur propre.
let mockEnvoisOuverts: boolean | null = null;
// Valeur d'essai : la vraie mention attend @legal (marqueur, voir lettre-numeros-s21.test.ts).
let mockMention = "deviens-marrant SAS";
// s22 : le canal Premium de la mensuelle n'existe que si les envois de l'hebdo sont ouverts.
let mockHebdoOuvert = true;
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
  get LETTRE_HEBDO_ENVOIS_OUVERTS() {
    return mockHebdoOuvert;
  },
}));

type Ligne = { id: string; issueId: string; email: string; status: string; attempts: number; error?: string | null; sentAt?: Date };
const mockDb = {
  issue: null as null | Record<string, unknown>,
  abonnes: [] as Array<{ email: string; unsubscribeToken: string; confirmedAt: Date | null }>,
  users: [] as Array<Record<string, unknown>>,
  leads: [] as Array<Record<string, unknown>>,
  journal: [] as Ligne[],
  // s22 : lettre réservée de la semaine 2026-W45 (garde-fou « jamais deux lettres ») et adresses qui l'ont reçue.
  hebdo: null as null | { id: string; status: string },
  hebdoRecus: [] as string[],
};

function mockApprouve(issue: null | Record<string, unknown>) {
  if (!issue) return null;
  const { empreinteNumero } = jest.requireActual("@/lib/lettre/approbation-hebdo") as typeof import("@/lib/lettre/approbation-hebdo");
  const n = { preheader: null, scheduledFor: new Date("2026-11-05T07:00:00Z"), ...issue } as Record<string, unknown> & Parameters<typeof empreinteNumero>[0];
  return { approvedAt: new Date("2026-10-25T00:00:00Z"), approvedHash: empreinteNumero(n), ...n };
}

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      // s22 : numéro lu = approuvé par Thomas pour son contenu exact (verrou testé à part,
      // `lettre-mensuelle-approbation-s22.test.ts`) ; les garde-fous s21 restent testés dessus.
      findFirst: jest.fn(async () => mockApprouve(mockDb.issue)),
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => Object.assign(mockDb.issue ?? {}, data)),
      findUnique: jest.fn(async ({ where }: { where: { audience_periodKey: { audience: string; periodKey: string } } }) =>
        where.audience_periodKey.audience === "HEBDO_PREMIUM" && where.audience_periodKey.periodKey === "2026-W45" ? mockDb.hebdo : null,
      ),
    },
    user: { findMany: jest.fn(async () => mockDb.users) },
    ceoLead: { findMany: jest.fn(async () => mockDb.leads) },
    newsletterSubscriber: { findMany: jest.fn(async () => mockDb.abonnes) },
    newsletterSend: {
      findMany: jest.fn(async ({ where }: { where: { issueId: string } }) =>
        mockDb.hebdo && where.issueId === mockDb.hebdo.id ? mockDb.hebdoRecus.map((email) => ({ email })) : mockDb.journal.map((l) => ({ ...l })),
      ),
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
  mockHebdoOuvert = true;
  mockDb.issue = { id: "n1", periodKey: "2026-11", subject: "Objet du mois", bodyText: "Corps préparé du numéro.", status: "VALIDE" };
  mockDb.abonnes = [abonne("a@x.fr"), abonne("b@x.fr"), abonne("premium@x.fr"), abonne("stop@x.fr"), abonne("revenu@x.fr", new Date("2026-10-20T00:00:00Z"))];
  mockDb.users = [
    {
      id: "u-premium",
      email: "premium@x.fr",
      plan: "PREMIUM",
      emailVerified: avant,
      accounts: [],
      emailOptOut: false,
      updatedAt: avant,
      premiumLetter: { enabled: true, stoppedAt: null, stopOrigin: null, unsubscribeToken: "jeton-hebdo".padEnd(43, "x") },
    },
    { email: "stop@x.fr", plan: "FREE", emailOptOut: true, updatedAt: new Date("2026-10-10T00:00:00Z"), premiumLetter: null },
    { email: "revenu@x.fr", plan: "FREE", emailOptOut: true, updatedAt: new Date("2026-10-10T00:00:00Z"), premiumLetter: null },
  ];
  mockDb.leads = [];
  mockDb.journal = [];
  // s22 : semaine de la mensuelle, aucune lettre réservée partie.
  mockDb.hebdo = null;
  mockDb.hebdoRecus = [];
});

// s22 : corps avec le bloc d'invitation Premium entre ses marqueurs (comme `data/lettre/numeros.json`).
const INVITATION = "PS : Premium, résiliable en ligne.\nVoir l'offre Premium : https://deviens-marrant.fr/abonnement?utm_content=n1-premium";
const CORPS_INVITATION = `Corps préparé du numéro.\n\n[[invitation-premium]]\n${INVITATION}\n[[/invitation-premium]]\n\nRendez-vous le mois prochain,`;

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

  it("s22 : envoie aux confirmés et au Premium par le canal Premium (une fois), exclut l'opposition antérieure, journalise, termine le numéro", async () => {
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    const destinataires = envoyer.mock.calls.map((c) => c[0]).sort();
    // revenu@ : confirmation de la lettre POSTÉRIEURE à l'opposition (nouvel acte positif, @legal L6).
    // premium@ : destinataire de l'hebdo ET inscrit à la mensuelle : un seul e-mail, canal Premium.
    expect(destinataires).toEqual(["a@x.fr", "b@x.fr", "premium@x.fr", "revenu@x.fr"]);
    expect(r).toMatchObject({ canalPremium: 1, dedoublonnes: 1, exclusOpposition: 1, envoyes: 4, termine: true });
    expect(mockDb.journal.map((l) => [l.email, l.status])).toEqual([
      ["premium@x.fr", "ENVOYE"],
      ["a@x.fr", "ENVOYE"],
      ["b@x.fr", "ENVOYE"],
      ["revenu@x.fr", "ENVOYE"],
    ]);
    expect(mockDb.issue?.status).toBe("ENVOYE");

    const [, sujet, texte, headers] = envoyer.mock.calls.find((c) => c[0] === "a@x.fr")!;
    expect(sujet).toBe("Objet du mois");
    expect(texte).toContain("Corps préparé du numéro.");
    expect(texte).toContain(`${BASE}/lettre/desinscrire?token=u-a%40x.fr`);
    expect(texte).toContain(`Éditeur${NBSP}: deviens-marrant SAS`);
    expect(texte).not.toMatch(/<img|pixel/i);
    expect(headers["List-Unsubscribe"]).toMatch(/^<https:\/\/deviens-marrant\.fr\/api\/newsletter\/unsubscribe\/u-a%40x\.fr/);
    expect(headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");

    // Canal Premium : pied et en-têtes de la lettre de la semaine (arrêt propre à l'abonné).
    const jeton = encodeURIComponent("jeton-hebdo".padEnd(43, "x"));
    const [, sujetP, texteP, headersP] = envoyer.mock.calls.find((c) => c[0] === "premium@x.fr")!;
    expect(sujetP).toBe("Objet du mois");
    expect(texteP).toContain("Corps préparé du numéro.");
    expect(texteP).toContain("Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.");
    expect(texteP).toContain(`${BASE}/lettre/premium/arreter?token=${jeton}`);
    expect(texteP).not.toContain("/lettre/desinscrire");
    expect(headersP).toEqual({ "List-Unsubscribe": `<${BASE}/api/lettre-premium/arret-un-clic?token=${jeton}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" });
  });

  it("s22 : version gratuite (invitation comprise, marqueurs retirés) aux inscrits, version Premium (sans invitation) aux abonnés", async () => {
    mockDb.issue = { ...mockDb.issue, bodyText: CORPS_INVITATION };
    const envoyer = jest.fn().mockResolvedValue(undefined);
    await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    const texteDe = (email: string) => envoyer.mock.calls.find((c) => c[0] === email)![2] as string;
    expect(texteDe("a@x.fr")).toContain(`Corps préparé du numéro.\n\nPS${NBSP}: Premium, résiliable en ligne.\nVoir l'offre Premium${NBSP}: https://deviens-marrant.fr/abonnement?utm_content=n1-premium\n\nRendez-vous le mois prochain,`);
    expect(texteDe("premium@x.fr")).toContain("Corps préparé du numéro.\n\nRendez-vous le mois prochain,");
    for (const email of ["a@x.fr", "premium@x.fr"]) expect(texteDe(email)).not.toContain("[[");
    expect(texteDe("premium@x.fr")).not.toContain("/abonnement");
  });

  it("s22 : un Premium qui a ARRÊTÉ la lettre de la semaine mais est inscrit à la mensuelle : canal gratuit, version sans invitation, pied gratuit", async () => {
    mockDb.issue = { ...mockDb.issue, bodyText: CORPS_INVITATION };
    mockDb.users = [
      { id: "u-p", email: "premium@x.fr", plan: "PREMIUM", emailVerified: avant, accounts: [], emailOptOut: false, updatedAt: avant, premiumLetter: { enabled: false, stoppedAt: avant, stopOrigin: "profil", unsubscribeToken: null } },
    ];
    mockDb.abonnes = [abonne("premium@x.fr")];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer).toHaveBeenCalledTimes(1);
    expect(r).toMatchObject({ canalPremium: 0, dedoublonnes: 0, envoyes: 1 });
    const [, , texte, headers] = envoyer.mock.calls[0];
    expect(texte).toContain("Corps préparé du numéro.\n\nRendez-vous le mois prochain,");
    expect(texte).not.toContain("/abonnement");
    expect(texte).toContain("Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.");
    expect(texte).toContain(`${BASE}/lettre/desinscrire?token=u-premium%40x.fr`);
    expect(headers["List-Unsubscribe"]).toContain("/api/newsletter/unsubscribe/");
  });

  it("s22 : une lettre réservée déjà partie cette semaine (numéro chargé après coup) : la lettre du mois attend le jeudi suivant à 8 h", async () => {
    mockDb.hebdo = { id: "h45", status: "ENVOYE" };
    mockDb.hebdoRecus = ["premium@x.fr"];
    const envoyer = jest.fn();
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(r).toMatchObject({ reporte: true, prochainEnvoi: new Date("2026-11-12T07:00:00Z"), envoyes: 0, termine: false });
    expect(envoyer).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
    // Lundi suivant : la lettre réservée était de la semaine précédente, la lettre du mois attend encore le jeudi 8 h.
    const lundi = await envoyerLettreDuMois(new Date("2026-11-09T10:00:00Z"), { envoyer, baseUrl: BASE });
    expect(lundi).toMatchObject({ reporte: true, prochainEnvoi: new Date("2026-11-12T07:00:00Z") });
    expect(envoyer).not.toHaveBeenCalled();
    const jeudi = await envoyerLettreDuMois(new Date("2026-11-12T07:05:00Z"), { envoyer: jest.fn().mockResolvedValue(undefined), baseUrl: BASE });
    expect(jeudi).toMatchObject({ reporte: false, envoyes: 4, termine: true });
  });

  it("s22 : lettre réservée de la semaine préparée mais jamais partie : la lettre du mois part, au Premium par le canal Premium", async () => {
    mockDb.hebdo = { id: "h45", status: "VALIDE" };
    mockDb.users[0].premiumLetter = null;
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: Record<string, unknown> };
    prisma.premiumLetterPreference = {
      findUnique: jest.fn(async () => ({ unsubscribeToken: "jeton-office".padEnd(43, "x") })),
    };
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer.mock.calls.filter((c) => c[0] === "premium@x.fr")).toHaveLength(1);
    expect(r).toMatchObject({ canalPremium: 1, dedoublonnes: 1, termine: true });
    delete prisma.premiumLetterPreference;
  });

  it("s21 hebdo : envois de l'hebdo fermés, le Premium inscrit reçoit la mensuelle par le canal gratuit, sans invitation (spec §4.2)", async () => {
    mockHebdoOuvert = false;
    mockDb.issue = { ...mockDb.issue, bodyText: CORPS_INVITATION };
    mockDb.abonnes = [abonne("premium@x.fr")];
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
    expect(envoyer).toHaveBeenCalledTimes(1);
    expect(r).toMatchObject({ canalPremium: 0, dedoublonnes: 0 });
    expect(envoyer.mock.calls[0][2]).not.toContain("/abonnement");
  });

  it("s22 : version Premium non conforme (offre hors du bloc d'invitation) ou marqueurs mal posés : rien ne part pour personne", async () => {
    const envoyer = jest.fn();
    for (const bodyText of [`${CORPS_INVITATION}\nAnnuel à 24,99 €`, "Corps.\n\n[[invitation-premium]]\nPS sans fin", "Corps.\nVoir : https://deviens-marrant.fr/abonnement"]) {
      mockDb.issue = { id: "n1", periodKey: "2026-11", subject: "Objet du mois", bodyText, status: "VALIDE" };
      const r = await envoyerLettreDuMois(NOW, { envoyer, baseUrl: BASE });
      expect(r).toMatchObject({ bloque: true, envoyes: 0, termine: false });
      expect(r.motifs.length).toBeGreaterThan(0);
    }
    expect(envoyer).not.toHaveBeenCalled();
    expect(mockDb.journal).toHaveLength(0);
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
    expect(r2.dejaTraites).toBe(4);
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
    expect(texte).toContain("Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.");
    expect(texte).toContain(`Contact${NBSP}: contact@deviens-marrant.fr`);
    expect(texte).toContain(`Confidentialité${NBSP}: ${BASE}/confidentialite`);
    expect(texte).not.toContain("—");
  });
});
