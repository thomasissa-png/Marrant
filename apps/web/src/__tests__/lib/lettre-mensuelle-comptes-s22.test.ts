/**
 * @jest-environment node
 *
 * Lettre du mois, canal COMPTE (s22, décision de Thomas du 25/10 : les comptes gratuits, actuels et
 * futurs, la reçoivent d'office, version sans invitation, désinscription en un clic). Base simulée en
 * mémoire, vrai n°1 de `data/lettre/numeros.json`, approuvé. Vérifie : 12 comptes calqués sur la
 * production (11 adresses jamais vérifiées), doublon compte + inscrit par adresse (1 e-mail, version
 * complète), désinscription durable (jamais réinscrit, même après un passage par Premium), passage
 * gratuit → Premium → gratuit, rebond, mensuelle non approuvée = 0 e-mail.
 */
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  LETTRE_ENVOIS_OUVERTS: true,
  LETTRE_HEBDO_ENVOIS_OUVERTS: true,
  LETTRE_MENTION_EDITEUR_NUMERO: "deviens-marrant SAS",
}));

type Ligne = { id: string; issueId: string; email: string; status: string; attempts: number };
type Compte = {
  id: string;
  email: string;
  plan: string;
  emailOptOut: boolean;
  updatedAt: Date;
  emailVerified: Date | null;
  premiumLetter: Record<string, unknown> | null;
};
type Inscrit = { id: string; email: string; status: string; unsubscribeToken: string; confirmedAt: Date | null };
const mockDb = {
  issue: null as null | Record<string, unknown>,
  users: [] as Compte[],
  prefsCompte: [] as Array<{ id: string; userId: string; unsubscribeToken: string; stoppedAt: Date | null }>,
  inscrits: [] as Inscrit[],
  journal: [] as Ligne[],
};
const avecPrefs = (u: Compte) => ({
  ...u,
  monthlyLetter: mockDb.prefsCompte.find((p) => p.userId === u.id) ?? null,
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findFirst: jest.fn(async () => (mockDb.issue?.status === "VALIDE" ? mockDb.issue : null)),
      findUnique: jest.fn(async () => null), // aucune lettre réservée cette semaine
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => Object.assign(mockDb.issue ?? {}, data)),
    },
    user: {
      findMany: jest.fn(async ({ where }: { where: { plan?: string | { not: string }; emailOptOut?: boolean } }) => {
        let l = mockDb.users;
        if (where.emailOptOut === true) l = l.filter((u) => u.emailOptOut);
        if (where.emailOptOut === false) l = l.filter((u) => !u.emailOptOut);
        if (where.plan === "PREMIUM") l = l.filter((u) => u.plan === "PREMIUM");
        if (typeof where.plan === "object") l = l.filter((u) => u.plan !== "PREMIUM");
        return l.map(avecPrefs);
      }),
    },
    premiumLetterPreference: {
      findUnique: jest.fn(async ({ where }: { where: { userId: string } }) => mockDb.users.find((u) => u.id === where.userId)?.premiumLetter ?? null),
      create: jest.fn(async ({ data }: { data: { userId: string } & Record<string, unknown> }) => {
        const u = mockDb.users.find((x) => x.id === data.userId)!;
        u.premiumLetter = { stoppedAt: null, stopOrigin: null, ...data };
        return u.premiumLetter;
      }),
      updateMany: jest.fn(async () => ({ count: 0 })),
    },
    accountLetterPreference: {
      create: jest.fn(async ({ data }: { data: { userId: string; unsubscribeToken: string } }) => {
        if (mockDb.prefsCompte.some((p) => p.userId === data.userId)) throw Object.assign(new Error("unique"), { code: "P2002" });
        const p = { id: `p${mockDb.prefsCompte.length + 1}`, stoppedAt: null, ...data };
        mockDb.prefsCompte.push(p);
        return p;
      }),
      findUnique: jest.fn(async ({ where }: { where: { userId?: string; unsubscribeToken?: string } }) =>
        mockDb.prefsCompte.find((p) => (where.userId ? p.userId === where.userId : p.unsubscribeToken === where.unsubscribeToken)) ?? null,
      ),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => Object.assign(mockDb.prefsCompte.find((p) => p.id === where.id)!, data)),
    },
    ceoLead: { findMany: jest.fn(async () => []) },
    blogArticle: {
      findMany: jest.fn(async ({ where }: { where: { slug: { in: string[] } } }) => where.slug.in.map((slug) => ({ slug, publishedAt: new Date("2026-11-02T05:00:00Z") }))),
    },
    newsletterSubscriber: {
      findMany: jest.fn(async ({ where }: { where: { status?: string; email?: { in: string[] } } }) =>
        mockDb.inscrits.filter((i) => (where.status ? i.status === where.status : true) && (where.email ? where.email.in.includes(i.email) : true)),
      ),
      findUnique: jest.fn(async ({ where }: { where: { unsubscribeToken: string } }) => mockDb.inscrits.find((i) => i.unsubscribeToken === where.unsubscribeToken) ?? null),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => Object.assign(mockDb.inscrits.find((i) => i.id === where.id)!, data)),
    },
    newsletterSend: {
      findMany: jest.fn(async () => mockDb.journal.map((l) => ({ ...l }))),
      create: jest.fn(async ({ data }: { data: Omit<Ligne, "id"> }) => {
        if (mockDb.journal.some((l) => l.email === data.email)) throw Object.assign(new Error("unique"), { code: "P2002" });
        const l = { id: `l${mockDb.journal.length + 1}`, ...data };
        mockDb.journal.push(l);
        return { id: l.id };
      }),
      updateMany: jest.fn(async () => ({ count: 0 })),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Ligne> }) => Object.assign(mockDb.journal.find((x) => x.id === where.id)!, data)),
    },
  },
}));

import numeros from "@/data/lettre/numeros.json";
import { envoyerLettreDuMois } from "@/lib/lettre/envoi";
import { recoitParCompte } from "@/lib/lettre/compte";
import { desinscrireLettre } from "@/lib/lettre/inscription";
import { empreinteNumero } from "@/lib/lettre/approbation-hebdo";
import { frPonctuation } from "@/lib/fr-typo";

const BASE = "https://deviens-marrant.fr";
const JEUDI = new Date("2026-11-05T07:05:00Z");
const avant = new Date("2026-03-15T10:00:00Z");
const PS_N1 = "PS : rester muet, ça arrive à tout le monde.";
const PIED_COMPTE = "Tu reçois cette lettre parce que tu as un compte sur deviens-marrant.fr.";
const n1 = numeros[0];

function numeroApprouve(p: Record<string, unknown> = {}) {
  const n = { id: "m11", audience: "MENSUELLE", periodKey: "2026-11", subject: n1.objet, preheader: n1.preEntete, bodyText: n1.corps, scheduledFor: new Date("2026-11-05T07:00:00Z"), status: "VALIDE", ...p };
  return { approvedAt: avant, approvedHash: empreinteNumero(n as Parameters<typeof empreinteNumero>[0]), ...n };
}
const compte = (email: string, p: Partial<Compte> = {}): Compte => ({ id: `u-${email}`, email, plan: "FREE", emailOptOut: false, updatedAt: avant, emailVerified: null, premiumLetter: null, ...p });
const envoyer = () => jest.fn().mockResolvedValue(undefined);
/** Numéro suivant : même texte, journal vidé (chaque numéro a son propre journal). */
const numeroSuivant = () => {
  mockDb.issue = numeroApprouve();
  mockDb.journal = [];
};

beforeEach(() => {
  mockDb.issue = numeroApprouve();
  mockDb.users = [];
  mockDb.prefsCompte = [];
  mockDb.inscrits = [];
  mockDb.journal = [];
});

describe("recoitParCompte : LA fonction du canal compte", () => {
  const base = { id: "u", email: "a@x.fr", plan: "FREE", emailOptOut: false, premiumLetter: null, monthlyLetter: null };
  it.each([
    ["compte gratuit, jamais inscrit par adresse", base, null, true],
    ["inscription par adresse jamais confirmée", base, "PENDING", true],
    ["inscrit par adresse confirmé : canal gratuit, version complète", base, "CONFIRMED", false],
    ["désinscrit de la lettre du mois par adresse", base, "UNSUBSCRIBED", false],
    ["Premium : canal Premium", { ...base, plan: "PREMIUM" }, null, false],
    ["opposition (rebond, plainte, demande)", { ...base, emailOptOut: true }, null, false],
    ["désinscrit par le canal compte", { ...base, monthlyLetter: { stoppedAt: avant, unsubscribeToken: "t" } }, null, false],
    ["ancien Premium qui avait arrêté la lettre de la semaine", { ...base, premiumLetter: { enabled: false, stoppedAt: avant, stopOrigin: "profil" } }, null, false],
    ["ancien Premium, fin d'abonnement seule", { ...base, premiumLetter: { enabled: false, stoppedAt: avant, stopOrigin: "fin-premium" } }, null, true],
  ] as const)("%s", (_, u, inscrit, attendu) => {
    expect(recoitParCompte(u, inscrit)).toBe(attendu);
  });
});

describe("envoyerLettreDuMois, canal compte", () => {
  it("12 comptes gratuits calqués sur la production (11 adresses jamais vérifiées, 1 vérifiée), aucun inscrit par adresse : 12 lettres du mois sans invitation, pied « tu as un compte », désinscription en un clic", async () => {
    mockDb.users = Array.from({ length: 12 }, (_, i) => compte(`compte${i + 1}@x.fr`, { emailVerified: i === 0 ? avant : null }));
    const e = envoyer();
    const r = await envoyerLettreDuMois(JEUDI, { envoyer: e, baseUrl: BASE });
    expect(r).toMatchObject({ canalCompte: 12, canalPremium: 0, envoyes: 12, termine: true });
    expect(mockDb.prefsCompte).toHaveLength(12);
    for (const [to, subject, text, headers] of e.mock.calls) {
      const token = mockDb.prefsCompte.find((p) => p.userId === `u-${to}`)!.unsubscribeToken;
      expect(subject).toBe(frPonctuation("Alors, t'as perdu ta langue ?"));
      expect(text).toContain("Samedi soir, il pleut. Vous êtes huit dans le salon de la coloc de Léa");
      expect(text).not.toContain(PS_N1);
      expect(text).not.toContain("/abonnement");
      expect(text).toContain(`n1-etape3#etape-3\n\nÀ bientôt,\nL'Équipe Deviens Marrant\n\n--\n${PIED_COMPTE}`);
      expect(text).toContain(`${BASE}/lettre/desinscrire?token=${token}`);
      expect(headers).toEqual({ "List-Unsubscribe": `<${BASE}/api/newsletter/unsubscribe/${token}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" });
    }
    expect(new Set(e.mock.calls.map((c) => c[0])).size).toBe(12);
  });

  it("compte gratuit aussi inscrit par adresse (confirmé) : 1 seul e-mail, version complète, pied de l'inscription par adresse", async () => {
    mockDb.users = [compte("double@x.fr")];
    mockDb.inscrits = [{ id: "i1", email: "double@x.fr", status: "CONFIRMED", unsubscribeToken: "d".repeat(43), confirmedAt: avant }];
    const e = envoyer();
    const r = await envoyerLettreDuMois(JEUDI, { envoyer: e, baseUrl: BASE });
    expect(e).toHaveBeenCalledTimes(1);
    expect(r).toMatchObject({ canalCompte: 0, envoyes: 1 });
    const [, , text] = e.mock.calls[0];
    expect(text).toContain("PS");
    expect(text).toContain("https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium");
    expect(text).toContain("Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.");
    expect(mockDb.prefsCompte).toHaveLength(0);
  });

  it("inscription par adresse jamais confirmée : canal compte (version sans invitation)", async () => {
    mockDb.users = [compte("pending@x.fr")];
    mockDb.inscrits = [{ id: "i1", email: "pending@x.fr", status: "PENDING", unsubscribeToken: "p".repeat(43), confirmedAt: null }];
    const e = envoyer();
    await envoyerLettreDuMois(JEUDI, { envoyer: e, baseUrl: BASE });
    expect(e).toHaveBeenCalledTimes(1);
    expect(e.mock.calls[0][2]).toContain(PIED_COMPTE);
  });

  it("désinscription en un clic (même lien que la lettre du mois) : 0 e-mail ensuite, jamais réinscrit, même après un passage par Premium", async () => {
    mockDb.users = [compte("stop@x.fr")];
    await envoyerLettreDuMois(JEUDI, { envoyer: envoyer(), baseUrl: BASE });
    const token = mockDb.prefsCompte[0].unsubscribeToken;
    expect(await desinscrireLettre(token, new Date("2026-11-06T10:00:00Z"))).toBe("desinscrit");
    expect(await desinscrireLettre(token, new Date("2026-11-07T10:00:00Z"))).toBe("desinscrit"); // idempotent
    expect(mockDb.prefsCompte[0].stoppedAt).toEqual(new Date("2026-11-06T10:00:00Z"));
    numeroSuivant();
    const e2 = envoyer();
    expect(await envoyerLettreDuMois(JEUDI, { envoyer: e2, baseUrl: BASE })).toMatchObject({ canalCompte: 0, envoyes: 0 });
    // Passe Premium : canal Premium (lettre de la semaine, inscription d'office) ; puis redevient gratuit : rien.
    mockDb.users[0].plan = "PREMIUM";
    numeroSuivant();
    const e3 = envoyer();
    expect(await envoyerLettreDuMois(JEUDI, { envoyer: e3, baseUrl: BASE })).toMatchObject({ canalPremium: 1, canalCompte: 0 });
    mockDb.users[0].plan = "FREE";
    mockDb.users[0].premiumLetter = { ...mockDb.users[0].premiumLetter, enabled: false, stoppedAt: new Date(), stopOrigin: "fin-premium" };
    numeroSuivant();
    const e4 = envoyer();
    expect(await envoyerLettreDuMois(JEUDI, { envoyer: e4, baseUrl: BASE })).toMatchObject({ canalCompte: 0, envoyes: 0 });
    expect(mockDb.prefsCompte).toHaveLength(1);
  });

  it("passage gratuit → Premium → gratuit : canal compte, puis canal Premium, puis canal compte ; ancien Premium qui avait arrêté la lettre de la semaine : rien", async () => {
    mockDb.users = [compte("bascule@x.fr")];
    const e1 = envoyer();
    await envoyerLettreDuMois(JEUDI, { envoyer: e1, baseUrl: BASE });
    expect(e1.mock.calls[0][2]).toContain(PIED_COMPTE);
    mockDb.users[0].plan = "PREMIUM";
    numeroSuivant();
    const e2 = envoyer();
    await envoyerLettreDuMois(JEUDI, { envoyer: e2, baseUrl: BASE });
    expect(e2).toHaveBeenCalledTimes(1);
    expect(e2.mock.calls[0][2]).toContain("Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.");
    mockDb.users[0].plan = "FREE";
    mockDb.users[0].premiumLetter = { ...mockDb.users[0].premiumLetter, enabled: false, stoppedAt: new Date(), stopOrigin: "fin-premium" };
    numeroSuivant();
    const e3 = envoyer();
    await envoyerLettreDuMois(JEUDI, { envoyer: e3, baseUrl: BASE });
    expect(e3.mock.calls[0][2]).toContain(PIED_COMPTE);
    mockDb.users[0].premiumLetter = { enabled: false, stoppedAt: new Date(), stopOrigin: "profil", unsubscribeToken: "h".repeat(43) };
    numeroSuivant();
    const e4 = envoyer();
    expect(await envoyerLettreDuMois(JEUDI, { envoyer: e4, baseUrl: BASE })).toMatchObject({ envoyes: 0 });
  });

  it("rebond ou plainte (webhook : `emailOptOut`), désinscrit par adresse : 0 e-mail", async () => {
    mockDb.users = [compte("rebond@x.fr", { emailOptOut: true }), compte("parti@x.fr")];
    mockDb.inscrits = [{ id: "i1", email: "parti@x.fr", status: "UNSUBSCRIBED", unsubscribeToken: "u".repeat(43), confirmedAt: avant }];
    const e = envoyer();
    expect(await envoyerLettreDuMois(JEUDI, { envoyer: e, baseUrl: BASE })).toMatchObject({ envoyes: 0, canalCompte: 0 });
    expect(e).not.toHaveBeenCalled();
  });

  it("lettre du mois non approuvée : 0 e-mail pour tous les canaux", async () => {
    mockDb.users = [compte("a@x.fr"), compte("p@x.fr", { plan: "PREMIUM" })];
    mockDb.inscrits = [{ id: "i1", email: "libre@x.fr", status: "CONFIRMED", unsubscribeToken: "l".repeat(43), confirmedAt: avant }];
    mockDb.issue = { ...numeroApprouve(), approvedHash: null };
    const e = envoyer();
    expect(await envoyerLettreDuMois(JEUDI, { envoyer: e, baseUrl: BASE })).toMatchObject({ nonApprouve: true, envoyes: 0 });
    expect(e).not.toHaveBeenCalled();
    expect(mockDb.prefsCompte).toHaveLength(0);
  });
});

describe("Textes du canal compte, mot pour mot (décision de Thomas du 25/10)", () => {
  it("pied « tu as un compte », ligne de l'inscription, phrase de la confidentialité", () => {
    const { EMAILS_LETTRE, CONFIDENTIALITE_LETTRE_COMPTE } = jest.requireActual("@/config/textes/lettre-s21") as typeof import("@/config/textes/lettre-s21");
    const { LETTRE_MOIS_INSCRIPTION_COMPTE } = jest.requireActual("@/config/textes/offre") as typeof import("@/config/textes/offre");
    const pied = EMAILS_LETTRE.piedNumeroCompte("LIEN", BASE).replace(/ | /g, " ");
    expect(pied).toBe(
      ["", "--", PIED_COMPTE, "Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.", "Se désinscrire en un clic : LIEN", `Confidentialité : ${BASE}/confidentialite`].join("\n"),
    );
    expect(LETTRE_MOIS_INSCRIPTION_COMPTE).toBe("Tu recevras aussi la lettre du mois, une fois par mois. Désinscription en un clic.");
    expect(CONFIDENTIALITE_LETTRE_COMPTE).toBe(
      "T'envoyer la lettre du mois si tu as un compte sans abonnement, sans l'invitation à t'abonner : intérêt légitime, et tu peux te désinscrire en un clic à tout moment.",
    );
    for (const t of [pied, LETTRE_MOIS_INSCRIPTION_COMPTE, CONFIDENTIALITE_LETTRE_COMPTE]) expect(t).not.toMatch(/[—–]/);
  });
});
