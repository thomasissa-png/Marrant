/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21, US-H4, H6) : tâche du jeudi. Base simulée en mémoire (journal
 * unique numéro + adresse). Vérifie : interrupteur, jeudi 8 h Paris, jamais deux fois,
 * reprises, garde-fous (marqueur, offre, lien mort), destinataires (fin de Premium, PAST_DUE,
 * opposition, adresse non vérifiée), en-têtes d'arrêt, texte seul, et la cohérence avec la
 * mensuelle : aucun Premium exclu de la mensuelle sans être destinataire de l'hebdo.
 */
let mockHebdoOuvert = true;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_HEBDO_ENVOIS_OUVERTS() {
    return mockHebdoOuvert;
  },
  LETTRE_ENVOIS_OUVERTS: true,
  LETTRE_MENTION_EDITEUR_NUMERO: "deviens-marrant SAS",
}));

type Ligne = { id: string; issueId: string; email: string; status: string; attempts: number; error?: string | null };
type Issue = {
  id: string;
  audience: string;
  periodKey: string;
  subject: string;
  preheader: string | null;
  bodyText: string;
  scheduledFor: Date;
  status: string;
  approvedAt?: Date | null;
  approvedHash?: string | null;
};
const mockDb = {
  issues: [] as Issue[],
  users: [] as Array<Record<string, unknown>>,
  abonnes: [] as Array<{ email: string; unsubscribeToken: string; confirmedAt: Date | null }>,
  journal: [] as Ligne[],
  parcoursActifs: ["confiance"],
};

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findUnique: jest.fn(async ({ where }: { where: { audience_periodKey: { audience: string; periodKey: string } } }) =>
        mockDb.issues.find((i) => i.audience === where.audience_periodKey.audience && i.periodKey === where.audience_periodKey.periodKey) ?? null,
      ),
      findFirst: jest.fn(async ({ where }: { where: { audience: string } }) => mockDb.issues.find((i) => i.audience === where.audience && i.status === "VALIDE") ?? null),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Issue> }) => Object.assign(mockDb.issues.find((i) => i.id === where.id)!, data)),
    },
    user: {
      findMany: jest.fn(async ({ where }: { where: { plan?: string; emailOptOut?: boolean } }) =>
        where.emailOptOut ? mockDb.users.filter((u) => u.emailOptOut) : mockDb.users.filter((u) => u.plan === "PREMIUM"),
      ),
    },
    ceoLead: { findMany: jest.fn(async () => []) },
    blogArticle: { findMany: jest.fn(async () => []) },
    learningPath: { findMany: jest.fn(async ({ where }: { where: { slug: { in: string[] } } }) => where.slug.in.filter((s) => mockDb.parcoursActifs.includes(s)).map((slug) => ({ slug }))) },
    newsletterSubscriber: { findMany: jest.fn(async () => mockDb.abonnes) },
    newsletterSend: {
      findMany: jest.fn(async ({ where }: { where: { issueId: string } }) => mockDb.journal.filter((l) => l.issueId === where.issueId).map((l) => ({ ...l }))),
      create: jest.fn(async ({ data }: { data: Omit<Ligne, "id"> }) => {
        if (mockDb.journal.some((l) => l.issueId === data.issueId && l.email === data.email)) throw Object.assign(new Error("unique"), { code: "P2002" });
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
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Ligne> }) => Object.assign(mockDb.journal.find((x) => x.id === where.id)!, data)),
    },
  },
}));

import carnetNovembre from "@/data/carnet/2026-11.json";
import factice from "../helpers/lettre-hebdo-numero-factice.json";
import { parseCarnets } from "@/lib/carnet";
import { GABARIT_HEBDO } from "@/config/textes/lettre-hebdo-s21";
import { preparerNumerosHebdo } from "@/lib/lettre/numeros-hebdo";
import { envoyerLettreDeLaSemaine } from "@/lib/lettre/envoi-hebdo";
import { envoyerLettreDuMois } from "@/lib/lettre/envoi";
import { empreinteNumero } from "@/lib/lettre/approbation-hebdo";

const BASE = "https://deviens-marrant.fr";
const JEUDI_8H05 = new Date("2026-11-12T07:05:00Z"); // jeudi 12/11, 8 h 05 Paris
const avant = new Date("2026-11-01T10:00:00Z");
const corpsValide = preparerNumerosHebdo(factice, parseCarnets([carnetNovembre]), { ...GABARIT_HEBDO, valide: true }).numeros[0];

function premium(email: string, p: Record<string, unknown> = {}, pref: Record<string, unknown> = {}) {
  return {
    id: `u-${email}`,
    email,
    plan: "PREMIUM",
    emailVerified: avant,
    emailOptOut: false,
    updatedAt: avant,
    accounts: [],
    premiumLetter: { enabled: true, activatedAt: avant, consentVersion: "lettre-hebdo-premium-v1", unsubscribeToken: `jeton-${email}`.padEnd(43, "x"), ...pref },
    ...p,
  };
}

// s22 : par défaut, numéro approuvé par Thomas pour son contenu exact (verrou testé à part,
// `lettre-hebdo-approbation-s22.test.ts`). Empreinte calculée sur le contenu final : les garde-fous
// suivants (marqueur, offre, lien mort) restent testés sur un numéro approuvé.
function numero(p: Partial<Issue> = {}): Issue {
  const base = { id: "h46", audience: "HEBDO_PREMIUM", periodKey: "2026-W46", subject: corpsValide.objet, preheader: corpsValide.preEntete, bodyText: corpsValide.corps, scheduledFor: corpsValide.envoiPrevu, status: "VALIDE" };
  const n: Issue = { ...base, ...p };
  return { approvedAt: avant, approvedHash: empreinteNumero(n), ...n };
}

beforeEach(() => {
  mockHebdoOuvert = true;
  mockDb.issues = [numero()];
  mockDb.users = [premium("yanis@x.fr"), premium("marc@x.fr")];
  mockDb.abonnes = [];
  mockDb.journal = [];
  mockDb.parcoursActifs = ["confiance"];
});

const envoyer = () => jest.fn().mockResolvedValue(undefined);

describe("Quand ça part", () => {
  it("H4-1 : interrupteur fermé, rien n'est lu ni envoyé", async () => {
    mockHebdoOuvert = false;
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r.ferme).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });

  it.each([
    ["mercredi 11/11", "2026-11-11T09:00:00Z"],
    ["jeudi 7 h 59 Paris (heure d'hiver)", "2026-11-12T06:59:00Z"],
  ])("H4-3 : %s, rien ne part", async (_, instant) => {
    const e = envoyer();
    await envoyerLettreDeLaSemaine(new Date(instant), { envoyer: e, baseUrl: BASE });
    expect(e).not.toHaveBeenCalled();
  });

  it("H4-2 / H4-12 : jeudi 8 h, un e-mail texte seul par destinataire, pied légal et arrêt propre au destinataire, en-têtes RFC 8058", async () => {
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r).toMatchObject({ envoyes: 2, echecs: 0, termine: true, numero: "2026-W46" });
    expect(mockDb.issues[0].status).toBe("ENVOYE");
    const [to, subject, text, headers] = e.mock.calls[0];
    expect(to).toBe("yanis@x.fr");
    expect(subject).toBe("Le vendeur dans ton dos");
    const jeton = "jeton-yanis@x.fr".padEnd(43, "x");
    expect(text).toContain(`${BASE}/lettre/premium/arreter?token=${encodeURIComponent(jeton)}`);
    expect(text).toContain("Tu reçois cette lettre parce que tu es abonné Premium et que tu as choisi de la recevoir.");
    expect(text).toContain("Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.");
    expect(text).not.toMatch(/<[a-z]+[\s>]/i); // aucun HTML, donc aucun pixel
    expect(headers).toEqual({
      "List-Unsubscribe": `<${BASE}/api/lettre-premium/arret-un-clic?token=${encodeURIComponent(jeton)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
  });

  it("H4-4 : tâche relancée ou concurrente, personne ne reçoit deux fois", async () => {
    const e = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    mockDb.issues[0].status = "VALIDE";
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(e).toHaveBeenCalledTimes(2);
  });

  it("H4-5 : échec Resend retenté au passage suivant, 3 essais au plus, puis numéro terminé", async () => {
    const e = jest.fn(async (to: string) => {
      if (to === "marc@x.fr") throw new Error("Resend 500 pour marc@x.fr");
    });
    let r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r).toMatchObject({ envoyes: 1, echecs: 1, termine: false });
    expect(mockDb.journal.find((l) => l.email === "marc@x.fr")?.error).toContain("[adresse]");
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r.termine).toBe(true);
    expect(e.mock.calls.filter((c) => c[0] === "marc@x.fr")).toHaveLength(3);
  });

  it("H4-11 : pas de rattrapage, le numéro de la semaine 46 n'est plus lu la semaine 47", async () => {
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(new Date("2026-11-19T07:05:00Z"), { envoyer: e, baseUrl: BASE });
    expect(r).toMatchObject({ semaine: "2026-W47", sansNumero: true });
    expect(e).not.toHaveBeenCalled();
  });
});

describe("Garde-fous : rien ne part", () => {
  it("H4-9 / H5-8 : aucun numéro VALIDE (absent ou BROUILLON) : alerte, rien n'est envoyé", async () => {
    mockDb.issues = [numero({ status: "BROUILLON" })];
    const e = envoyer();
    expect((await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE })).sansNumero).toBe(true);
    mockDb.issues = [];
    expect((await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE })).sansNumero).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });

  it("H4-6 : marqueur [À COMPLÉTER (gabarit non validé) : bloqué", async () => {
    mockDb.issues = [numero({ bodyText: preparerNumerosHebdo(factice, parseCarnets([carnetNovembre])).numeros[0].corps })];
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r.bloque).toBe(true);
    expect(e).not.toHaveBeenCalled();
  });

  it("H4-13 / avis C1 : une offre glissée dans le numéro en base (lien /abonnement, prix) : bloqué", async () => {
    mockDb.issues = [numero({ bodyText: `${corpsValide.corps}\nPasse à l'annuel : ${BASE}/abonnement, 29,99 €` })];
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r.bloque).toBe(true);
    expect(r.motifs).toEqual(expect.arrayContaining(["lien /abonnement", "symbole €", "mot « annuel »"]));
    expect(e).not.toHaveBeenCalled();
  });

  it("H4-7 / H4-8 : article du blog ou parcours cité hors ligne : reporté, jamais de lien mort", async () => {
    mockDb.issues = [numero({ bodyText: `${corpsValide.corps}\n${BASE}/blog/article-pas-encore-publie\n${BASE}/parcours/inactif#etape-2` })];
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r.reporte).toBe(true);
    expect(r.liensMorts).toEqual(["blog/article-pas-encore-publie", "parcours/inactif"]);
    expect(e).not.toHaveBeenCalled();
  });
});

describe("Destinataires (fonction unique) et cohérence avec la mensuelle", () => {
  beforeEach(() => {
    mockDb.users = [
      premium("actif@x.fr"),
      premium("fin@x.fr", { plan: "FREE" }), // H6-2 : plan passé à FREE, rapprochement pas encore passé
      premium("relance@x.fr"), // H6-3 / H6-4 : cancelAtPeriodEnd ou PAST_DUE gardent le plan PREMIUM
      premium("jamais@x.fr", {}, { enabled: false, activatedAt: null, consentVersion: null }),
      premium("opposant@x.fr", { emailOptOut: true, updatedAt: new Date("2026-11-05T00:00:00Z") }),
      premium("revenu@x.fr", { emailOptOut: true, updatedAt: new Date("2026-10-01T00:00:00Z") }), // H6-10
      premium("nonverifie@x.fr", { emailVerified: null }),
    ];
    mockDb.abonnes = mockDb.users.map((u) => ({ email: u.email as string, unsubscribeToken: `m-${u.email}`.padEnd(43, "m"), confirmedAt: avant }));
    // s22 : mensuelle approuvée elle aussi (même verrou que l'hebdo).
    mockDb.issues.push(numero({ id: "m11", audience: "MENSUELLE", periodKey: "2026-11", subject: "Mensuelle", preheader: null, bodyText: "Corps du mois.", scheduledFor: new Date("2026-11-05T07:00:00Z"), status: "VALIDE" }));
  });

  it("H4-10 / H6 : seuls les Premium avec la case cochée, adresse vérifiée, sans opposition antérieure", async () => {
    const e = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(e.mock.calls.map((c) => c[0]).sort()).toEqual(["actif@x.fr", "relance@x.fr", "revenu@x.fr"]);
  });

  it("spec §4.2 : aucun Premium exclu de la mensuelle sans être destinataire de l'hebdo, et jamais les deux", async () => {
    const hebdo = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: hebdo, baseUrl: BASE });
    const mensuelle = envoyer();
    const r = await envoyerLettreDuMois(JEUDI_8H05, { envoyer: mensuelle, baseUrl: BASE });
    const recoiventHebdo = new Set(hebdo.mock.calls.map((c) => c[0]));
    const recoiventMensuelle = new Set(mensuelle.mock.calls.map((c) => c[0]));
    expect(r.exclusPremiumHebdo).toBe(recoiventHebdo.size);
    for (const a of mockDb.abonnes) {
      if (a.email === "opposant@x.fr") continue; // opposition globale : ni l'une ni l'autre (L6)
      expect(recoiventHebdo.has(a.email) !== recoiventMensuelle.has(a.email)).toBe(true);
    }
  });

  it("§4.2 cas limite : envois de l'hebdo fermés, la mensuelle part à tous ses inscrits (pas de pause)", async () => {
    mockHebdoOuvert = false;
    const mensuelle = envoyer();
    const r = await envoyerLettreDuMois(JEUDI_8H05, { envoyer: mensuelle, baseUrl: BASE });
    expect(r.exclusPremiumHebdo).toBe(0);
    expect(mensuelle.mock.calls.map((c) => c[0])).toContain("actif@x.fr");
  });
});
