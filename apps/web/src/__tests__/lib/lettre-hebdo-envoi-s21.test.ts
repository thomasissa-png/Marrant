/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21, US-H4, H6) : tâche du jeudi. Base simulée en mémoire (journal
 * unique numéro + adresse). Vérifie : interrupteur, jeudi 8 h Paris, jamais deux fois,
 * reprises, garde-fous (marqueur, offre, lien mort), destinataires (fin de Premium, PAST_DUE,
 * opposition, adresse non vérifiée), en-têtes d'arrêt, texte seul, et la cohérence avec la
 * mensuelle : aucun Premium exclu de la mensuelle sans être destinataire de l'hebdo.
 * s22 : inscription d'office (Premium sans ligne = destinataire, jeton créé à l'envoi), arrêt
 * explicite respecté après réabonnement, pause de la mensuelle seulement si l'hebdo part vraiment.
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
  creations: [] as string[],
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
    // s22 : jeton d'arrêt créé au premier envoi pour un inscrit d'office (ligne portée par l'utilisateur simulé).
    premiumLetterPreference: {
      findUnique: jest.fn(async ({ where }: { where: { userId: string } }) => (mockDb.users.find((u) => u.id === where.userId)?.premiumLetter as Record<string, unknown> | null) ?? null),
      create: jest.fn(async ({ data }: { data: { userId: string } & Record<string, unknown> }) => {
        const u = mockDb.users.find((x) => x.id === data.userId)!;
        if (u.premiumLetter) throw Object.assign(new Error("unique"), { code: "P2002" });
        u.premiumLetter = { stoppedAt: null, stopOrigin: null, ...data };
        mockDb.creations.push(data.userId);
        return u.premiumLetter;
      }),
      updateMany: jest.fn(async ({ where, data }: { where: { userId: string; unsubscribeToken?: null }; data: Record<string, unknown> }) => {
        const pref = mockDb.users.find((u) => u.id === where.userId)?.premiumLetter as Record<string, unknown> | null | undefined;
        if (!pref || (where.unsubscribeToken === null && pref.unsubscribeToken)) return { count: 0 };
        Object.assign(pref, data);
        return { count: 1 };
      }),
    },
    ceoLead: { findMany: jest.fn(async () => []) },
    blogArticle: { findMany: jest.fn(async () => []) },
    learningPath: { findMany: jest.fn(async ({ where }: { where: { slug: { in: string[] } } }) => where.slug.in.filter((s) => mockDb.parcoursActifs.includes(s)).map((slug) => ({ slug }))) },
    newsletterSubscriber: { findMany: jest.fn(async () => mockDb.abonnes) },
    newsletterSend: {
      findMany: jest.fn(async ({ where }: { where: { issueId: string; status?: string } }) =>
        mockDb.journal.filter((l) => l.issueId === where.issueId && (where.status === undefined || l.status === where.status)).map((l) => ({ ...l })),
      ),
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
import { GABARIT_HEBDO, LIGNE_QUESTION_EQUIPE_HEBDO } from "@/config/textes/lettre-hebdo-s21";
import { preparerNumerosHebdo } from "@/lib/lettre/numeros-hebdo";
import { corpsNumeroHebdo, envoyerLettreDeLaSemaine } from "@/lib/lettre/envoi-hebdo";
import { frPonctuation } from "@/lib/fr-typo";
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
    premiumLetter: { enabled: true, stoppedAt: null, stopOrigin: null, unsubscribeToken: `jeton-${email}`.padEnd(43, "x"), ...pref } as Record<string, unknown> | null,
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
  mockDb.creations = [];
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
    expect(text).toContain("Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.");
    expect(text).not.toContain("choisi de la recevoir");
    expect(text).toContain("Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.");
    expect(text).not.toMatch(/<[a-z]+[\s>]/i); // aucun HTML, donc aucun pixel
    expect(headers).toEqual({
      "List-Unsubscribe": `<${BASE}/api/lettre-premium/arret-un-clic?token=${encodeURIComponent(jeton)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
  });

  it("s22 : ligne « Ta question à l'équipe » posée par le code entre le texte approuvé et le pied, seulement service ouvert", () => {
    const ouvert = corpsNumeroHebdo(corpsValide.corps, BASE, "jeton", true);
    const ferme = corpsNumeroHebdo(corpsValide.corps, BASE, "jeton", false);
    const ligne = frPonctuation(LIGNE_QUESTION_EQUIPE_HEBDO);
    expect(ouvert).toContain(`\n\n${ligne}\n\n--\n`);
    expect(ferme).not.toContain("Ta question");
    expect(ouvert.replace(`\n\n${ligne}`, "")).toBe(ferme);
    // Hors texte approuvé : l'empreinte d'approbation ne bouge pas quand le service s'ouvre.
    expect(corpsValide.corps).not.toContain("Ta question");
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
    mockDb.issues = [numero({ bodyText: preparerNumerosHebdo(factice, parseCarnets([carnetNovembre]), { ...GABARIT_HEBDO, valide: false }).numeros[0].corps })];
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
      { ...premium("office@x.fr"), premiumLetter: null }, // s22 : inscrit d'office, aucune ligne
      premium("jamais@x.fr", {}, { enabled: false, unsubscribeToken: null }), // ancienne proposition jamais cochée : inscrit d'office
      premium("arrete@x.fr", {}, { enabled: false, stoppedAt: avant, stopOrigin: "lien-email" }),
      premium("reabonne-arret@x.fr", {}, { enabled: false, stoppedAt: avant, stopOrigin: "profil" }), // arrêt, fin, réabonnement
      premium("reabonne-fin@x.fr", {}, { enabled: false, stoppedAt: avant, stopOrigin: "fin-premium" }), // fin, réabonnement
      premium("opposant@x.fr", { emailOptOut: true, updatedAt: new Date("2026-11-05T00:00:00Z") }),
      premium("revenu@x.fr", { emailOptOut: true, updatedAt: new Date("2026-10-01T00:00:00Z") }), // mensuelle confirmée après l'opposition (L6)
      premium("nonverifie@x.fr", { emailVerified: null }),
    ];
    mockDb.abonnes = mockDb.users.map((u) => ({ email: u.email as string, unsubscribeToken: `m-${u.email}`.padEnd(43, "m"), confirmedAt: avant }));
    // s22 : mensuelle approuvée elle aussi (même verrou que l'hebdo), jeudi 05/11 (semaine 45).
    mockDb.issues = [
      numero({ id: "h45", periodKey: "2026-W45", scheduledFor: new Date("2026-11-05T07:00:00Z") }),
      numero({ id: "m11", audience: "MENSUELLE", periodKey: "2026-11", subject: "Mensuelle", preheader: null, bodyText: "Corps du mois.", scheduledFor: new Date("2026-11-05T07:00:00Z"), status: "VALIDE" }),
    ];
  });
  const JEUDI_05 = new Date("2026-11-05T07:05:00Z");
  const ATTENDUS_HEBDO = ["actif@x.fr", "jamais@x.fr", "office@x.fr", "reabonne-fin@x.fr", "relance@x.fr"];

  it("s22 : Premium d'office (sans ligne ou jamais coché), réabonné après une fin de Premium ; jamais : arrêté, réabonné après arrêt, opposition, non-Premium, non vérifié", async () => {
    const e = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: e, baseUrl: BASE });
    expect(e.mock.calls.map((c) => c[0]).sort()).toEqual(ATTENDUS_HEBDO);
  });

  it("s22 : jeton d'arrêt créé au premier envoi pour l'inscrit d'office, lien d'arrêt dans sa lettre ; relance : rien de recréé", async () => {
    const e = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: e, baseUrl: BASE });
    expect(mockDb.creations).toEqual(["u-office@x.fr"]);
    const jeton = (mockDb.users.find((u) => u.email === "office@x.fr")?.premiumLetter as { unsubscribeToken: string }).unsubscribeToken;
    expect(jeton).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const [, , text, headers] = e.mock.calls.find((c) => c[0] === "office@x.fr")!;
    expect(text).toContain(`${BASE}/lettre/premium/arreter?token=${encodeURIComponent(jeton)}`);
    expect(headers["List-Unsubscribe"]).toContain(encodeURIComponent(jeton));
    mockDb.issues[0].status = "VALIDE";
    await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: e, baseUrl: BASE });
    expect(mockDb.creations).toEqual(["u-office@x.fr"]);
    expect(e).toHaveBeenCalledTimes(ATTENDUS_HEBDO.length);
  });

  it("spec §4.2 : aucun Premium exclu de la mensuelle sans être destinataire de l'hebdo, et jamais les deux", async () => {
    const hebdo = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: hebdo, baseUrl: BASE });
    const mensuelle = envoyer();
    const r = await envoyerLettreDuMois(new Date("2026-11-05T07:20:00Z"), { envoyer: mensuelle, baseUrl: BASE });
    const recoiventHebdo = new Set(hebdo.mock.calls.map((c) => c[0]));
    const recoiventMensuelle = new Set(mensuelle.mock.calls.map((c) => c[0]));
    expect(r.exclusPremiumHebdo).toBe(recoiventHebdo.size);
    expect(r).toMatchObject({ attenteHebdo: 0, termine: true });
    for (const a of mockDb.abonnes) {
      if (a.email === "opposant@x.fr") continue; // opposition globale : ni l'une ni l'autre (L6)
      expect(recoiventHebdo.has(a.email) !== recoiventMensuelle.has(a.email)).toBe(true);
    }
    expect([...recoiventMensuelle]).toEqual(expect.arrayContaining(["arrete@x.fr", "reabonne-arret@x.fr", "revenu@x.fr"]));
  });

  it.each([
    ["l'hebdo puis la mensuelle", false],
    ["la mensuelle puis l'hebdo", true],
  ])("s22, jeudi 05/11 8 h (n°1 de l'hebdo ET n°1 de la mensuelle le même matin) : %s, jamais deux lettres pour un abonné", async (_, mensuelleDabord) => {
    const hebdo = envoyer();
    const mensuelle = envoyer();
    if (mensuelleDabord) {
      const r1 = await envoyerLettreDuMois(JEUDI_05, { envoyer: mensuelle, baseUrl: BASE });
      // Premium en attente de l'hebdo : la mensuelle ne leur part pas et reste ouverte.
      expect(r1).toMatchObject({ attenteHebdo: ATTENDUS_HEBDO.length, termine: false });
    }
    const r = await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: hebdo, baseUrl: BASE });
    // Passage suivant de la mensuelle (15 min plus tard) : l'hebdo est partie, pause confirmée.
    const r2 = await envoyerLettreDuMois(new Date("2026-11-05T07:20:00Z"), { envoyer: mensuelle, baseUrl: BASE });
    expect(r.numero).toBe("2026-W45");
    expect(r2).toMatchObject({ attenteHebdo: 0, termine: true });
    const recoiventHebdo = hebdo.mock.calls.map((c) => c[0]);
    const recoiventMensuelle = mensuelle.mock.calls.map((c) => c[0]);
    expect(recoiventHebdo.length).toBeGreaterThan(0);
    expect(recoiventMensuelle.length).toBeGreaterThan(0);
    for (const a of mockDb.abonnes) {
      const n = recoiventHebdo.filter((x) => x === a.email).length + recoiventMensuelle.filter((x) => x === a.email).length;
      expect(n).toBeLessThanOrEqual(1);
    }
  });

  it("s22 : n°1 de l'hebdo PAS approuvé le 05/11 : rien ne part (verrou intact), la mensuelle attend la fin de la semaine puis part aux Premium le lundi (aucune perte)", async () => {
    mockDb.issues[0].approvedHash = "autre-contenu";
    const hebdo = envoyer();
    const mensuelle = envoyer();
    const rh = await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: hebdo, baseUrl: BASE });
    expect(rh.nonApprouve).toBe(true);
    const jeudi = await envoyerLettreDuMois(new Date("2026-11-05T07:20:00Z"), { envoyer: mensuelle, baseUrl: BASE });
    expect(jeudi).toMatchObject({ attenteHebdo: ATTENDUS_HEBDO.length, termine: false });
    const dimanche = await envoyerLettreDuMois(new Date("2026-11-08T21:00:00Z"), { envoyer: mensuelle, baseUrl: BASE }); // 22 h Paris
    expect(dimanche.attenteHebdo).toBe(ATTENDUS_HEBDO.length);
    expect(await envoyerLettreDeLaSemaine(new Date("2026-11-08T21:00:00Z"), { envoyer: hebdo, baseUrl: BASE })).toMatchObject({ nonApprouve: true });
    expect(hebdo).not.toHaveBeenCalled();
    const lundi = await envoyerLettreDuMois(new Date("2026-11-09T07:00:00Z"), { envoyer: mensuelle, baseUrl: BASE });
    expect(lundi).toMatchObject({ attenteHebdo: 0, exclusPremiumHebdo: 0, termine: true });
    const recoiventMensuelle = mensuelle.mock.calls.map((c) => c[0]);
    expect(recoiventMensuelle).toEqual(expect.arrayContaining(ATTENDUS_HEBDO));
    expect(new Set(recoiventMensuelle).size).toBe(recoiventMensuelle.length);
  });

  it("s22 : n°1 approuvé le samedi 07/11 : part le samedi, la mensuelle (en attente depuis jeudi) est mise en pause pour ses destinataires", async () => {
    const hash = mockDb.issues[0].approvedHash;
    mockDb.issues[0].approvedHash = null;
    const hebdo = envoyer();
    const mensuelle = envoyer();
    await envoyerLettreDuMois(new Date("2026-11-05T07:20:00Z"), { envoyer: mensuelle, baseUrl: BASE });
    mockDb.issues[0].approvedHash = hash;
    await envoyerLettreDeLaSemaine(new Date("2026-11-07T10:00:00Z"), { envoyer: hebdo, baseUrl: BASE });
    const r = await envoyerLettreDuMois(new Date("2026-11-07T10:15:00Z"), { envoyer: mensuelle, baseUrl: BASE });
    expect(r).toMatchObject({ attenteHebdo: 0, exclusPremiumHebdo: ATTENDUS_HEBDO.length, termine: true });
    const recoiventMensuelle = mensuelle.mock.calls.map((c) => c[0]);
    for (const email of ATTENDUS_HEBDO) expect(recoiventMensuelle).not.toContain(email);
    expect(hebdo.mock.calls.map((c) => c[0]).sort()).toEqual(ATTENDUS_HEBDO);
  });

  it("§4.2 cas limite : envois de l'hebdo fermés, la mensuelle part à tous ses inscrits (pas de pause, pas d'attente)", async () => {
    mockHebdoOuvert = false;
    const mensuelle = envoyer();
    const r = await envoyerLettreDuMois(JEUDI_05, { envoyer: mensuelle, baseUrl: BASE });
    expect(r).toMatchObject({ exclusPremiumHebdo: 0, attenteHebdo: 0 });
    expect(mensuelle.mock.calls.map((c) => c[0])).toContain("actif@x.fr");
  });
});
