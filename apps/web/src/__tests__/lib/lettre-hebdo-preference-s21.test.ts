/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21 ; s22 inscription d'office des Premium, décision de Thomas du 25/10) :
 * la fonction unique « reçoit l'hebdo », arrêt explicite respecté à vie (même après réabonnement),
 * reprise depuis le profil, jeton d'arrêt créé à l'envoi, fin de Premium, purge du journal à
 * 12 mois, effacement à la suppression du compte.
 */
type Pref = {
  userId: string;
  enabled: boolean;
  activatedAt: Date | null;
  consentVersion: string | null;
  activationOrigin: string | null;
  stoppedAt: Date | null;
  stopOrigin: string | null;
  unsubscribeToken: string | null;
};
const mockPrefs: Pref[] = [];
const mockUsers = new Set<string>(["u1"]);
let mockEchecCreation: { code: string } | null = null;

/** Filtre Prisma réduit à ce qu'utilise `lib/lettre/hebdo.ts` (égalité, `not: null`, `OR`). */
function mockCorrespond(p: Record<string, unknown>, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([cle, attendu]) => {
    if (cle === "OR") return (attendu as Record<string, unknown>[]).some((w) => mockCorrespond(p, w));
    if (attendu && typeof attendu === "object" && !(attendu instanceof Date) && "not" in attendu) return p[cle] !== (attendu as { not: unknown }).not;
    return p[cle] === attendu;
  });
}

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(async () => []),
      findUnique: jest.fn(async ({ where }: { where: { id: string } }) => (mockUsers.has(where.id) ? { id: where.id } : null)),
    },
    premiumLetterPreference: {
      findUnique: jest.fn(async ({ where }: { where: { userId?: string; unsubscribeToken?: string } }) =>
        mockPrefs.find((p) => (where.userId ? p.userId === where.userId : p.unsubscribeToken === where.unsubscribeToken)) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Partial<Pref> & { userId: string } }) => {
        if (mockEchecCreation) throw mockEchecCreation;
        if (mockPrefs.some((p) => p.userId === data.userId)) throw { code: "P2002" };
        const ligne: Pref = { enabled: false, activatedAt: null, consentVersion: null, activationOrigin: null, stoppedAt: null, stopOrigin: null, unsubscribeToken: null, ...data };
        mockPrefs.push(ligne);
        return ligne;
      }),
      updateMany: jest.fn(async ({ where, data }: { where: Record<string, unknown>; data: Partial<Pref> }) => {
        const lignes = mockPrefs.filter((p) => mockCorrespond(p, where));
        for (const l of lignes) Object.assign(l, data);
        return { count: lignes.length };
      }),
      count: jest.fn(async ({ where }: { where: { userId: string } }) => mockPrefs.filter((p) => p.userId === where.userId).length),
      deleteMany: jest.fn((a: unknown) => ({ op: "premiumLetterPreference.deleteMany", a })),
    },
    newsletterSend: {
      deleteMany: jest.fn(async (a: unknown) => ({ count: 2, a })),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  activerLettreHebdo,
  arretExplicite,
  arreterLettreHebdo,
  arreterLettreHebdoParJeton,
  avecJetonsHebdo,
  destinatairesHebdo,
  effacementLettreHebdo,
  finPremiumLettreHebdo,
  purgerJournalHebdo,
  rapprocherFinPremium,
  recoitHebdo,
  type CandidatHebdo,
} from "@/lib/lettre/hebdo";

const db = prisma as unknown as {
  user: { findMany: jest.Mock };
  premiumLetterPreference: { updateMany: jest.Mock; create: jest.Mock; deleteMany: jest.Mock };
  newsletterSend: { deleteMany: jest.Mock };
};
const NOW = new Date("2026-11-10T10:00:00Z");
const avant = new Date("2026-11-01T10:00:00Z");
const JETON = "t".repeat(43);

function candidat(p: Partial<CandidatHebdo> = {}, pref: Partial<NonNullable<CandidatHebdo["premiumLetter"]>> = {}): CandidatHebdo {
  return {
    id: "u1",
    email: "Yanis@Exemple.fr",
    plan: "PREMIUM",
    emailOptOut: false,
    premiumLetter: { enabled: true, stoppedAt: null, stopOrigin: null, unsubscribeToken: JETON, ...pref },
    ...p,
  };
}
const arretee = (stopOrigin: string) => ({ enabled: false, stoppedAt: avant, stopOrigin });

beforeEach(() => {
  mockPrefs.length = 0;
  mockUsers.clear();
  mockUsers.add("u1");
  mockEchecCreation = null;
  jest.clearAllMocks();
});

describe("recoitHebdo : LA fonction (envoi du jeudi ET pause de la mensuelle), inscription d'office", () => {
  it("s22 : Premium SANS ligne de préférence (inscrit d'office) : reçoit", () => {
    expect(recoitHebdo(candidat({ premiumLetter: null }), true)).toBe(true);
  });

  it("Premium, ligne active, adresse vérifiée : reçoit ; ligne sans jeton aussi (jeton créé à l'envoi)", () => {
    expect(recoitHebdo(candidat(), true)).toBe(true);
    expect(recoitHebdo(candidat({}, { unsubscribeToken: null }), true)).toBe(true);
  });

  it("ligne jamais activée ni arrêtée (ancienne proposition, case jamais cochée) : inscrit d'office, reçoit", () => {
    expect(recoitHebdo(candidat({}, { enabled: false }), true)).toBe(true);
  });

  it("H4-1 / §6.4 : envois fermés, personne ne reçoit (la lettre du mois part à ses seuls inscrits)", () => {
    expect(recoitHebdo(candidat(), false)).toBe(false);
  });

  it.each([
    ["plan FREE (non-Premium, ou fin de Premium avant le rapprochement : H6-2)", candidat({ plan: "FREE" })],
    ["plan FREE sans ligne", candidat({ plan: "FREE", premiumLetter: null })],
    ["arrêtée depuis le profil", candidat({}, arretee("profil"))],
    ["arrêtée par le lien de l'e-mail", candidat({}, arretee("lien-email"))],
    ["arrêtée par l'admin", candidat({}, arretee("admin"))],
    ["rebond définitif", candidat({}, arretee("rebond"))],
    ["plainte", candidat({}, arretee("plainte"))],
    ["arrêt sans origine notée (prudence)", candidat({}, { enabled: false, stoppedAt: avant, stopOrigin: null })],
    ["opposition globale (emailOptOut), ligne active", candidat({ emailOptOut: true })],
    ["opposition globale (emailOptOut), sans ligne", candidat({ emailOptOut: true, premiumLetter: null })],
    ["sans adresse", candidat({ email: null })],
  ])("ne reçoit pas : %s", (_, c) => {
    expect(recoitHebdo(c, true)).toBe(false);
  });

  it("s22 : réabonné après un arrêt EXPLICITE : ne reçoit toujours pas (l'arrêt reste valable)", () => {
    // Arrêt au profil, puis fin de Premium (`finPremiumLettreHebdo` ne touche pas une ligne déjà arrêtée), puis réabonnement.
    expect(recoitHebdo(candidat({ plan: "PREMIUM" }, arretee("profil")), true)).toBe(false);
  });

  it("s22 : réabonné après une simple fin de Premium (pas un choix) : inscrit d'office, reçoit", () => {
    expect(recoitHebdo(candidat({}, arretee("fin-premium")), true)).toBe(true);
  });

  it("cas 11 (s22, correction du 25/10) : adresse jamais vérifiée = destinataire (aucune condition de vérification)", () => {
    // Le candidat ne porte même plus `emailVerified` ni les comptes liés : la règle ne les lit pas.
    expect(recoitHebdo(candidat({ premiumLetter: null }), true)).toBe(true);
    expect(recoitHebdo({ ...candidat(), emailVerified: null, accounts: [] } as CandidatHebdo, true)).toBe(true);
  });

  it("s22 : 4 comptes calqués sur la production (3 à mot de passe jamais vérifiés + 1 Google, aucune ligne) : 4 destinataires", async () => {
    // Forme réelle d'un enregistrement Prisma : `emailVerified` vide pour les 4, ligne de préférence absente.
    const prod = [
      { ...candidat({ id: "p1", email: "Abonne1@Exemple.fr", premiumLetter: null }), emailVerified: null, accounts: [] },
      { ...candidat({ id: "p2", email: "abonne2@exemple.fr", premiumLetter: null }), emailVerified: null, accounts: [] },
      { ...candidat({ id: "p3", email: "abonne3@exemple.fr", premiumLetter: null }), emailVerified: null, accounts: [] },
      { ...candidat({ id: "p4", email: "google@exemple.fr", premiumLetter: null }), emailVerified: null, accounts: [{ id: "g" }] },
    ];
    db.user.findMany.mockResolvedValueOnce(prod);
    const d = await destinatairesHebdo(true);
    expect(d.map((x) => x.email)).toEqual(["abonne1@exemple.fr", "abonne2@exemple.fr", "abonne3@exemple.fr", "google@exemple.fr"]);
    // La requête ne lit plus aucune donnée de vérification.
    const select = db.user.findMany.mock.calls[0][0].select as Record<string, unknown>;
    expect(select).not.toHaveProperty("emailVerified");
    expect(select).not.toHaveProperty("accounts");
  });

  it("arretExplicite : sans ligne ou fin-premium = non ; profil = oui", () => {
    expect(arretExplicite(null)).toBe(false);
    expect(arretExplicite(arretee("fin-premium"))).toBe(false);
    expect(arretExplicite(arretee("profil"))).toBe(true);
  });

  it("destinatairesHebdo : envois fermés, aucune lecture en base", async () => {
    expect(await destinatairesHebdo(false)).toEqual([]);
    expect(db.user.findMany).not.toHaveBeenCalled();
  });

  it("destinatairesHebdo : Premium sans opposition pré-filtrés en base, minuscules, filtre final par recoitHebdo, lecture seule", async () => {
    db.user.findMany.mockResolvedValueOnce([
      candidat(),
      candidat({ id: "u2", email: "free@x.fr", plan: "FREE" }),
      candidat({ id: "u3", email: "Office@X.fr", premiumLetter: null }),
      candidat({ id: "u4", email: "stop@x.fr" }, arretee("lien-email")),
    ]);
    expect(await destinatairesHebdo(true)).toEqual([
      { userId: "u1", email: "yanis@exemple.fr", unsubscribeToken: JETON },
      { userId: "u3", email: "office@x.fr", unsubscribeToken: null },
    ]);
    expect(db.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { plan: "PREMIUM", emailOptOut: false } }));
    expect(db.premiumLetterPreference.create).not.toHaveBeenCalled();
    expect(db.premiumLetterPreference.updateMany).not.toHaveBeenCalled();
  });
});

describe("Jeton d'arrêt créé à l'envoi (aucune écriture de masse au déploiement)", () => {
  it("sans ligne : ligne créée (inscrit, origine office) avec un jeton opaque ; second passage : même jeton, rien de recréé", async () => {
    const [d1] = await avecJetonsHebdo([{ userId: "u1", email: "yanis@exemple.fr", unsubscribeToken: null }], NOW);
    expect(d1.unsubscribeToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(mockPrefs).toHaveLength(1);
    expect(mockPrefs[0]).toMatchObject({ enabled: true, activatedAt: NOW, activationOrigin: "office", stoppedAt: null });
    const [d2] = await avecJetonsHebdo([{ userId: "u1", email: "yanis@exemple.fr", unsubscribeToken: null }], NOW);
    expect(d2.unsubscribeToken).toBe(d1.unsubscribeToken);
    expect(db.premiumLetterPreference.create).toHaveBeenCalledTimes(1);
  });

  it("ligne existante sans jeton (ancienne proposition) : jeton posé, état inchangé", async () => {
    mockPrefs.push({ userId: "u1", enabled: false, activatedAt: null, consentVersion: null, activationOrigin: null, stoppedAt: null, stopOrigin: null, unsubscribeToken: null });
    const [d] = await avecJetonsHebdo([{ userId: "u1", email: "y@x.fr", unsubscribeToken: null }], NOW);
    expect(d.unsubscribeToken).toBe(mockPrefs[0].unsubscribeToken);
    expect(mockPrefs[0]).toMatchObject({ enabled: false, stoppedAt: null });
  });

  it("jeton déjà connu : aucune écriture", async () => {
    expect(await avecJetonsHebdo([{ userId: "u1", email: "y@x.fr", unsubscribeToken: JETON }], NOW)).toEqual([{ userId: "u1", email: "y@x.fr", unsubscribeToken: JETON }]);
    expect(db.premiumLetterPreference.create).not.toHaveBeenCalled();
    expect(db.premiumLetterPreference.updateMany).not.toHaveBeenCalled();
  });

  it("ligne créée par un autre passage entre-temps : son jeton est repris, jamais d'envoi sans jeton", async () => {
    mockPrefs.push({ userId: "u1", enabled: true, activatedAt: NOW, consentVersion: null, activationOrigin: "office", stoppedAt: null, stopOrigin: null, unsubscribeToken: "c".repeat(43) });
    const [d] = await avecJetonsHebdo([{ userId: "u1", email: "y@x.fr", unsubscribeToken: null }], NOW);
    expect(d.unsubscribeToken).toBe("c".repeat(43));
  });
});

describe("Reprise depuis le profil (réglage réactivé)", () => {
  it("inscrit d'office sans ligne : rien n'est écrit", async () => {
    expect(await activerLettreHebdo("u1", "profil", NOW)).toBe("deja-activee");
    expect(db.premiumLetterPreference.create).not.toHaveBeenCalled();
    expect(db.premiumLetterPreference.updateMany).not.toHaveBeenCalled();
  });

  it("après un arrêt explicite : trace d'arrêt effacée, nouvelle date, origine profil, MÊME jeton (H3-9)", async () => {
    mockPrefs.push({ userId: "u1", enabled: false, activatedAt: avant, consentVersion: "lettre-hebdo-premium-v1", activationOrigin: "paiement", stoppedAt: avant, stopOrigin: "profil", unsubscribeToken: "ancien".padEnd(43, "a") });
    expect(await activerLettreHebdo("u1", "profil", NOW)).toBe("activee");
    expect(mockPrefs[0]).toMatchObject({ enabled: true, activatedAt: NOW, activationOrigin: "profil", stoppedAt: null, stopOrigin: null, unsubscribeToken: "ancien".padEnd(43, "a") });
    expect(await activerLettreHebdo("u1", "profil", NOW)).toBe("deja-activee");
  });

  it("ligne fin-premium (réabonné) : déjà inscrit d'office, rien n'est réécrit", async () => {
    mockPrefs.push({ userId: "u1", enabled: false, activatedAt: avant, consentVersion: null, activationOrigin: "office", stoppedAt: avant, stopOrigin: "fin-premium", unsubscribeToken: JETON });
    expect(await activerLettreHebdo("u1", "profil", NOW)).toBe("deja-activee");
    expect(mockPrefs[0].stoppedAt).toEqual(avant);
  });
});

describe("Arrêt (toujours possible, respecté à vie) et fin de Premium", () => {
  beforeEach(() => {
    mockPrefs.push({ userId: "u1", enabled: true, activatedAt: avant, consentVersion: "v", activationOrigin: "profil", stoppedAt: null, stopOrigin: null, unsubscribeToken: "j".repeat(43) });
  });

  it.each(["profil", "paiement", "admin"] as const)("arrêt %s : enabled=false, stoppedAt, origine", async (origine) => {
    expect(await arreterLettreHebdo("u1", origine, NOW)).toBe("arretee");
    expect(mockPrefs[0]).toMatchObject({ enabled: false, stoppedAt: NOW, stopOrigin: origine });
  });

  it("H3-7 : déjà arrêtée, `stoppedAt` n'est pas réécrit", async () => {
    await arreterLettreHebdo("u1", "profil", avant);
    expect(await arreterLettreHebdo("u1", "profil", NOW)).toBe("deja-arretee");
    expect(mockPrefs[0].stoppedAt).toEqual(avant);
  });

  it("H3-2 / H3-6 : par jeton, origine lien-email ; jeton inconnu = inconnu", async () => {
    expect(await arreterLettreHebdoParJeton("j".repeat(43), NOW)).toBe("arretee");
    expect(mockPrefs[0].stopOrigin).toBe("lien-email");
    expect(await arreterLettreHebdoParJeton("x".repeat(43), NOW)).toBe("inconnu");
  });

  it("s22 : inscrit d'office SANS ligne qui arrête : ligne arrêtée créée (jeton compris), plus jamais destinataire", async () => {
    mockUsers.add("u2");
    expect(await arreterLettreHebdo("u2", "profil", NOW)).toBe("arretee");
    const ligne = mockPrefs.find((p) => p.userId === "u2");
    expect(ligne).toMatchObject({ enabled: false, stoppedAt: NOW, stopOrigin: "profil" });
    expect(ligne?.unsubscribeToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(arretExplicite(ligne)).toBe(true);
  });

  it("s22 : ligne fin-premium (réabonné) qui arrête : devient un arrêt explicite", async () => {
    Object.assign(mockPrefs[0], arretee("fin-premium"));
    expect(await arreterLettreHebdo("u1", "lien-email", NOW)).toBe("arretee");
    expect(mockPrefs[0]).toMatchObject({ enabled: false, stoppedAt: NOW, stopOrigin: "lien-email" });
  });

  it("compte inexistant : inconnu, rien d'écrit", async () => {
    expect(await arreterLettreHebdo("u-absent", "admin", NOW)).toBe("inconnu");
    expect(db.premiumLetterPreference.create).not.toHaveBeenCalled();
  });

  it("§6.2 : fin-premium posé avec le passage à FREE, sans jamais écraser un arrêt explicite", async () => {
    await finPremiumLettreHebdo("u1", NOW);
    expect(db.premiumLetterPreference.updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", enabled: true },
      data: { enabled: false, stoppedAt: NOW, stopOrigin: "fin-premium" },
    });
  });

  it("H6-1 : filet quotidien, toute lettre active d'un compte non Premium passe en fin-premium", async () => {
    await rapprocherFinPremium(NOW);
    expect(db.premiumLetterPreference.updateMany).toHaveBeenCalledWith({
      where: { enabled: true, user: { is: { plan: { not: "PREMIUM" } } } },
      data: { enabled: false, stoppedAt: NOW, stopOrigin: "fin-premium" },
    });
  });
});

describe("Journal et suppression de compte", () => {
  it("H6-11 : journal de l'HEBDO seulement, effacé après 12 mois", async () => {
    expect(await purgerJournalHebdo(NOW)).toBe(2);
    expect(db.newsletterSend.deleteMany).toHaveBeenCalledWith({
      where: { issue: { is: { audience: "HEBDO_PREMIUM" } }, createdAt: { lt: new Date("2025-11-10T10:00:00Z") } },
    });
  });

  it("H6-7 / avis §6.3 : préférence et journal de l'hebdo à l'adresse (minuscules) effacés", () => {
    effacementLettreHebdo("u1", "Yanis@Exemple.fr");
    expect(db.premiumLetterPreference.deleteMany).toHaveBeenCalledWith({ where: { userId: "u1" } });
    expect(db.newsletterSend.deleteMany).toHaveBeenCalledWith({ where: { email: "yanis@exemple.fr", issue: { is: { audience: "HEBDO_PREMIUM" } } } });
  });
});
