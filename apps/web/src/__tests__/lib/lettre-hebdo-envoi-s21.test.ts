/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21, US-H4, H6) : tâche du jeudi. Base simulée en mémoire (journal
 * unique numéro + adresse). Vérifie : interrupteur, jeudi 8 h Paris, jamais deux fois,
 * reprises, garde-fous (marqueur, offre, lien mort), destinataires (fin de Premium, PAST_DUE,
 * opposition, adresse non vérifiée), en-têtes d'arrêt, texte seul.
 * s22 : inscription d'office (Premium sans ligne = destinataire, jeton créé à l'envoi), arrêt
 * explicite respecté après réabonnement. Rythme (décision de Thomas du 25/10) : la lettre du mois est
 * l'une des lettres des abonnés ; sa semaine, ils la reçoivent (version Premium, canal Premium, une
 * fois) et aucune lettre réservée ne part ; plus de pause de la lettre du mois.
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
  // s22 : articles du blog en ligne (slugs), pour la lettre du mois n°1 réelle.
  articlesEnLigne: [] as string[],
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
    blogArticle: {
      findMany: jest.fn(async ({ where }: { where: { slug: { in: string[] } } }) =>
        where.slug.in.filter((slug) => mockDb.articlesEnLigne.includes(slug)).map((slug) => ({ slug, publishedAt: new Date("2026-11-02T05:00:00Z") })),
      ),
    },
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

import factice from "../helpers/lettre-hebdo-numero-factice.json";
import numerosReservesReels from "@/data/lettre/hebdo-premium.json";
import { LIGNE_QUESTION_EQUIPE_HEBDO } from "@/config/textes/lettre-hebdo-s21";
import { MARQUEUR_A_COMPLETER } from "@/config/lettre";
import { preparerNumerosHebdo } from "@/lib/lettre/numeros-hebdo";
import { corpsNumeroHebdo, envoyerLettreDeLaSemaine } from "@/lib/lettre/envoi-hebdo";
import { frPonctuation, NBSP } from "@/lib/fr-typo";
import { envoyerLettreDuMois } from "@/lib/lettre/envoi";
import numerosMensuels from "@/data/lettre/numeros.json";
import { empreinteNumero } from "@/lib/lettre/approbation-hebdo";

const BASE = "https://deviens-marrant.fr";
const JEUDI_8H05 = new Date("2026-11-12T07:05:00Z"); // jeudi 12/11, 8 h 05 Paris
const avant = new Date("2026-11-01T10:00:00Z");
const corpsValide = preparerNumerosHebdo(factice).numeros[0];

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
  mockDb.articlesEnLigne = [];
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
    expect(subject).toBe("Numéro factice des tests");
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

  it("H4-6 : marqueur [À COMPLÉTER glissé dans le texte en base : bloqué", async () => {
    mockDb.issues = [numero({ bodyText: `${MARQUEUR_A_COMPLETER} : exemple à remplacer]\n\n${corpsValide.corps}` })];
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

describe("Destinataires (fonction unique) et rythme avec la lettre du mois (s22)", () => {
  // Vrai n°1 de la lettre du mois (« On a comparé nos salaires »), jeudi 05/11 8 h (semaine 45), approuvé.
  const n1 = numerosMensuels[0];
  const SLUG_N1 = "soiree-de-noel-entreprise-humour";
  const PS_N1 = "PS : si une vanne par mois ne te suffit pas";
  const mensuelle = (p: Partial<Issue> = {}) =>
    numero({ id: "m11", audience: "MENSUELLE", periodKey: "2026-11", subject: n1.objet, preheader: n1.preEntete, bodyText: n1.corps, scheduledFor: new Date("2026-11-05T07:00:00Z"), status: "VALIDE", ...p });

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
      premium("nonverifie@x.fr", { emailVerified: null }), // cas 11 (s22, correction du 25/10) : destinataire, aucune vérification
    ];
    mockDb.abonnes = mockDb.users.map((u) => ({ email: u.email as string, unsubscribeToken: `m-${u.email}`.padEnd(43, "m"), confirmedAt: avant }));
    mockDb.articlesEnLigne = [SLUG_N1];
    // Ancienne donnée : une lettre réservée W45 VALIDE et approuvée ne doit JAMAIS partir (semaine de la lettre du mois).
    mockDb.issues = [numero({ id: "h45", periodKey: "2026-W45", scheduledFor: new Date("2026-11-05T07:00:00Z") }), numero(), mensuelle()];
  });
  const JEUDI_05 = new Date("2026-11-05T07:05:00Z");
  const ATTENDUS_HEBDO = ["actif@x.fr", "jamais@x.fr", "nonverifie@x.fr", "office@x.fr", "reabonne-fin@x.fr", "relance@x.fr"];
  const mensuellePartie = () => Object.assign(mockDb.issues.find((i) => i.id === "m11")!, { status: "ENVOYE", sentAt: new Date("2026-11-05T07:05:00Z") });

  it("s22 : Premium d'office (sans ligne ou jamais coché), réabonné après une fin de Premium, adresse jamais vérifiée ; jamais : arrêté, réabonné après arrêt, opposition, non-Premium", async () => {
    mensuellePartie();
    const e = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(e.mock.calls.map((c) => c[0]).sort()).toEqual(ATTENDUS_HEBDO);
  });

  it("s22 : jeton d'arrêt créé au premier envoi pour l'inscrit d'office, lien d'arrêt dans sa lettre ; relance : rien de recréé", async () => {
    mensuellePartie();
    const e = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(mockDb.creations).toEqual(["u-office@x.fr"]);
    const jeton = (mockDb.users.find((u) => u.email === "office@x.fr")?.premiumLetter as { unsubscribeToken: string }).unsubscribeToken;
    expect(jeton).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const [, , text, headers] = e.mock.calls.find((c) => c[0] === "office@x.fr")!;
    expect(text).toContain(`${BASE}/lettre/premium/arreter?token=${encodeURIComponent(jeton)}`);
    expect(headers["List-Unsubscribe"]).toContain(encodeURIComponent(jeton));
    mockDb.issues.find((i) => i.id === "h46")!.status = "VALIDE";
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(mockDb.creations).toEqual(["u-office@x.fr"]);
    expect(e).toHaveBeenCalledTimes(ATTENDUS_HEBDO.length);
  });

  it.each([
    ["la lettre de la semaine puis la lettre du mois", false],
    ["la lettre du mois puis la lettre de la semaine", true],
  ])("s22, jeudi 05/11 8 h, semaine de la lettre du mois : %s, aucune lettre réservée, un seul e-mail par adresse", async (_, mensuelleDabord) => {
    const hebdo = envoyer();
    const mois = envoyer();
    if (mensuelleDabord) await envoyerLettreDuMois(JEUDI_05, { envoyer: mois, baseUrl: BASE });
    const rh = await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: hebdo, baseUrl: BASE });
    expect(rh).toMatchObject({ semaineMensuelle: true, sansNumero: false, envoyes: 0 });
    await envoyerLettreDuMois(new Date("2026-11-05T07:20:00Z"), { envoyer: mois, baseUrl: BASE });
    expect(mockDb.issues.find((i) => i.id === "m11")!.status).toBe("ENVOYE");
    expect(hebdo).not.toHaveBeenCalled();
    expect(mockDb.issues.find((i) => i.id === "h45")!.status).toBe("VALIDE");
    const recus = mois.mock.calls.map((c) => c[0]);
    expect(new Set(recus).size).toBe(recus.length);
    // Destinataires de l'hebdo : canal Premium ; inscrits gratuits sans hebdo (dont fin@, plus Premium) : canal gratuit ; opposant : rien (L6).
    expect([...recus].sort()).toEqual([...ATTENDUS_HEBDO, "arrete@x.fr", "fin@x.fr", "reabonne-arret@x.fr", "revenu@x.fr"].sort());
    for (const [to, , text] of mois.mock.calls) {
      if (ATTENDUS_HEBDO.includes(to)) expect(text).toContain("incluse dans ton abonnement Premium");
      else expect(text).toContain("parce que tu l’as demandée");
    }
  });

  it("s22, 4 comptes calqués sur la production (3 à mot de passe jamais vérifiés + 1 Google, sans ligne, emailVerified vide), tous inscrits à la lettre du mois : W45 = 4 lettres du mois version Premium, 0 lettre réservée, 0 doublon ; W46 = lettre réservée seulement", async () => {
    mockDb.users = [
      { ...premium("abonne1@x.fr", { emailVerified: null }), premiumLetter: null },
      { ...premium("abonne2@x.fr", { emailVerified: null }), premiumLetter: null },
      { ...premium("abonne3@x.fr", { emailVerified: null }), premiumLetter: null },
      { ...premium("google@x.fr", { emailVerified: null, accounts: [{ id: "g" }] }), premiumLetter: null },
    ];
    mockDb.abonnes = mockDb.users.map((u) => ({ email: u.email as string, unsubscribeToken: `m-${u.email}`.padEnd(43, "m"), confirmedAt: avant }));
    const QUATRE = ["abonne1@x.fr", "abonne2@x.fr", "abonne3@x.fr", "google@x.fr"];
    const hebdo = envoyer();
    const mois = envoyer();
    // Semaine 45 : les deux tâches passent toutes les 15 min, du jeudi 8 h au dimanche soir.
    for (const t of ["2026-11-05T07:00:00Z", "2026-11-05T07:15:00Z", "2026-11-07T10:00:00Z", "2026-11-08T22:45:00Z"]) {
      await envoyerLettreDeLaSemaine(new Date(t), { envoyer: hebdo, baseUrl: BASE });
      await envoyerLettreDuMois(new Date(t), { envoyer: mois, baseUrl: BASE });
    }
    expect(hebdo).not.toHaveBeenCalled();
    expect(mois.mock.calls.map((c) => c[0]).sort()).toEqual(QUATRE);
    expect(mockDb.creations.sort()).toEqual(QUATRE.map((e) => `u-${e}`));
    for (const [to, subject, text, headers] of mois.mock.calls) {
      const jeton = (mockDb.users.find((u) => u.email === to)?.premiumLetter as { unsubscribeToken: string }).unsubscribeToken;
      expect(subject).toBe("On a comparé nos salaires");
      expect(text).toContain("Avec un collègue, on a enfin comparé nos salaires.");
      expect(text).not.toContain(PS_N1);
      expect(text).not.toContain("/abonnement");
      expect(text).not.toContain("[[");
      expect(text).toContain(`L'article est en lecture libre.\nLire l'article sur la soirée de Noël au boulot${NBSP}: https://deviens-marrant.fr/blog/${SLUG_N1}`);
      expect(text).toContain(`n1-article\n\nÀ bientôt,\nL'Équipe Deviens Marrant`);
      expect(text).toContain("Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.");
      expect(text).toContain(`${BASE}/lettre/premium/arreter?token=${encodeURIComponent(jeton)}`);
      expect(text).not.toContain("/lettre/desinscrire");
      expect(headers).toEqual({ "List-Unsubscribe": `<${BASE}/api/lettre-premium/arret-un-clic?token=${encodeURIComponent(jeton)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" });
    }
    // Semaine 46 : la lettre réservée seulement, la lettre du mois est terminée.
    const hebdo46 = envoyer();
    const mois46 = envoyer();
    await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: hebdo46, baseUrl: BASE });
    await envoyerLettreDuMois(new Date("2026-11-12T07:20:00Z"), { envoyer: mois46, baseUrl: BASE });
    expect(hebdo46.mock.calls.map((c) => c[0]).sort()).toEqual(QUATRE);
    expect(mois46).not.toHaveBeenCalled();
  });

  it("s22 : inscrit gratuit non Premium = version avec l'invitation (texte relu mot pour mot, marqueurs retirés)", async () => {
    mockDb.users = [premium("abonne@x.fr", { emailVerified: null })];
    mockDb.abonnes = [{ email: "gratuit@x.fr", unsubscribeToken: "g".repeat(43), confirmedAt: avant }];
    const mois = envoyer();
    await envoyerLettreDuMois(JEUDI_05, { envoyer: mois, baseUrl: BASE });
    const [, , text] = mois.mock.calls.find((c) => c[0] === "gratuit@x.fr")!;
    const relu = n1.corps.replace("[[invitation-premium]]\n", "").replace("\n[[/invitation-premium]]", "");
    expect(text.startsWith(frPonctuation(relu))).toBe(true);
    expect(text).toContain(`PS${NBSP}: si une vanne par mois ne te suffit pas`);
    expect(text).toContain("https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium");
    expect(text).toContain("Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.");
    expect(mois.mock.calls.map((c) => c[0]).sort()).toEqual(["abonne@x.fr", "gratuit@x.fr"]);
  });

  it("s22 : Premium qui a arrêté la lettre de la semaine mais inscrit à la lettre du mois = version sans invitation, pied gratuit", async () => {
    mockDb.users = [premium("arrete@x.fr", {}, { enabled: false, stoppedAt: avant, stopOrigin: "profil" })];
    mockDb.abonnes = [{ email: "arrete@x.fr", unsubscribeToken: "a".repeat(43), confirmedAt: avant }];
    const mois = envoyer();
    const r = await envoyerLettreDuMois(JEUDI_05, { envoyer: mois, baseUrl: BASE });
    expect(r).toMatchObject({ canalPremium: 0, envoyes: 1 });
    const [, , text, headers] = mois.mock.calls[0];
    expect(text).not.toContain(PS_N1);
    expect(text).not.toContain("/abonnement");
    expect(text).toContain("Tu reçois cette lettre parce que tu l’as demandée sur deviens-marrant.fr.");
    expect(text).toContain(`${BASE}/lettre/desinscrire?token=${"a".repeat(43)}`);
    expect(headers["List-Unsubscribe"]).toContain("/api/newsletter/unsubscribe/");
  });

  it("s22 : lettre du mois PAS approuvée : zéro e-mail pour personne la semaine 45 (ni lettre du mois, ni lettre réservée) ; approuvée le mardi 10/11, elle part, et la semaine 46 n'a pas de lettre réservée ; la semaine 47 en a une", async () => {
    const m = mockDb.issues.find((i) => i.id === "m11")!;
    const hash = m.approvedHash;
    m.approvedHash = null;
    const hebdo = envoyer();
    const mois = envoyer();
    for (const t of ["2026-11-05T07:00:00Z", "2026-11-05T07:15:00Z", "2026-11-08T22:45:00Z"]) {
      expect(await envoyerLettreDeLaSemaine(new Date(t), { envoyer: hebdo, baseUrl: BASE })).toMatchObject({ semaineMensuelle: true });
      expect(await envoyerLettreDuMois(new Date(t), { envoyer: mois, baseUrl: BASE })).toMatchObject({ nonApprouve: true });
    }
    expect(hebdo).not.toHaveBeenCalled();
    expect(mois).not.toHaveBeenCalled();
    // Approuvée le mardi de la semaine 46 : part au passage suivant ; la lettre réservée de la semaine 46 ne part pas.
    m.approvedHash = hash;
    const rm = await envoyerLettreDuMois(new Date("2026-11-10T09:00:00Z"), { envoyer: mois, baseUrl: BASE });
    expect(rm).toMatchObject({ termine: true, envoyes: 10 });
    expect(await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: hebdo, baseUrl: BASE })).toMatchObject({ semaineMensuelle: true, envoyes: 0 });
    expect(hebdo).not.toHaveBeenCalled();
    // Semaine 47 : lettre réservée de nouveau (numéro de la semaine, approuvé).
    mockDb.issues.push(numero({ id: "h47", periodKey: "2026-W47", scheduledFor: new Date("2026-11-19T07:00:00Z") }));
    const r47 = await envoyerLettreDeLaSemaine(new Date("2026-11-19T07:05:00Z"), { envoyer: hebdo, baseUrl: BASE });
    expect(r47).toMatchObject({ semaineMensuelle: false, envoyes: ATTENDUS_HEBDO.length });
  });

  it("s22 : lettre du mois approuvée le samedi 07/11 : part le samedi, toujours sans lettre réservée cette semaine-là", async () => {
    const m = mockDb.issues.find((i) => i.id === "m11")!;
    const hash = m.approvedHash;
    m.approvedHash = null;
    const hebdo = envoyer();
    const mois = envoyer();
    await envoyerLettreDuMois(new Date("2026-11-05T07:20:00Z"), { envoyer: mois, baseUrl: BASE });
    m.approvedHash = hash;
    await envoyerLettreDeLaSemaine(new Date("2026-11-07T10:00:00Z"), { envoyer: hebdo, baseUrl: BASE });
    const r = await envoyerLettreDuMois(new Date("2026-11-07T10:15:00Z"), { envoyer: mois, baseUrl: BASE });
    expect(r).toMatchObject({ termine: true, canalPremium: ATTENDUS_HEBDO.length, dedoublonnes: ATTENDUS_HEBDO.length });
    expect(await envoyerLettreDeLaSemaine(new Date("2026-11-08T10:00:00Z"), { envoyer: hebdo, baseUrl: BASE })).toMatchObject({ semaineMensuelle: true });
    expect(hebdo).not.toHaveBeenCalled();
  });

  it("s22 : lettre du mois reportée (article pas encore en ligne) : rien pour personne cette semaine-là", async () => {
    mockDb.articlesEnLigne = [];
    const hebdo = envoyer();
    const mois = envoyer();
    expect(await envoyerLettreDuMois(JEUDI_05, { envoyer: mois, baseUrl: BASE })).toMatchObject({ reporte: true });
    expect(await envoyerLettreDeLaSemaine(JEUDI_05, { envoyer: hebdo, baseUrl: BASE })).toMatchObject({ semaineMensuelle: true });
    expect(hebdo).not.toHaveBeenCalled();
    expect(mois).not.toHaveBeenCalled();
  });

  it("§4.2 cas limite : envois de l'hebdo fermés, la lettre du mois part à ses seuls inscrits, par le canal gratuit", async () => {
    mockHebdoOuvert = false;
    const mois = envoyer();
    const r = await envoyerLettreDuMois(JEUDI_05, { envoyer: mois, baseUrl: BASE });
    expect(r).toMatchObject({ canalPremium: 0, dedoublonnes: 0 });
    expect(mois.mock.calls.map((c) => c[0])).toContain("actif@x.fr");
    expect(mois.mock.calls.find((c) => c[0] === "actif@x.fr")![2]).not.toContain(PS_N1);
  });
});

describe("s22 : lettre réservée W46 réelle (texte libre de l'équipe), pied et ligne question ajoutés par le code", () => {
  it("jeudi 12/11 8 h 05, approuvée : objet et texte tels qu'écrits, puis la ligne « Ta question à l'équipe », puis le pied hebdo", async () => {
    const reel = preparerNumerosHebdo(numerosReservesReels).numeros[0];
    expect(reel).toMatchObject({ semaine: "2026-W46", statut: "VALIDE" });
    mockDb.issues = [numero({ subject: reel.objet, preheader: reel.preEntete, bodyText: reel.corps, scheduledFor: reel.envoiPrevu })];
    mockDb.parcoursActifs = ["repartie"];
    const e = envoyer();
    const r = await envoyerLettreDeLaSemaine(JEUDI_8H05, { envoyer: e, baseUrl: BASE });
    expect(r).toMatchObject({ numero: "2026-W46", bloque: false, reporte: false, envoyes: 2, termine: true });
    const [, subject, text] = e.mock.calls[0];
    expect(subject).toBe(frPonctuation("T'as perdu ta langue ? Trois réponses"));
    expect(text.startsWith(frPonctuation(reel.corps))).toBe(true);
    const ligne = frPonctuation(LIGNE_QUESTION_EQUIPE_HEBDO);
    expect(text).toContain(`À jeudi prochain,\nL'Équipe Deviens Marrant\n\n${ligne}\n\n--\n`);
    expect(text).toContain("Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.");
    expect(text).toContain("utm_content=2026-w46-etape3#etape-3");
    expect(text).not.toContain("Toutes les fiches du mois");
  });
});
