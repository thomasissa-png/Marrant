/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21) : la fonction unique « reçoit l'hebdo », activation (opt-in,
 * idempotente, réactivation après fin de Premium), arrêt (profil, lien, admin), fin de
 * Premium, purge du journal à 12 mois, effacement à la suppression du compte.
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
let mockEchecCreation: { code: string } | null = null;

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findMany: jest.fn(async () => []) },
    premiumLetterPreference: {
      findUnique: jest.fn(async ({ where }: { where: { userId?: string; unsubscribeToken?: string } }) =>
        mockPrefs.find((p) => (where.userId ? p.userId === where.userId : p.unsubscribeToken === where.unsubscribeToken)) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Pref }) => {
        if (mockEchecCreation) throw mockEchecCreation;
        mockPrefs.push({ ...data });
        return data;
      }),
      updateMany: jest.fn(async ({ where, data }: { where: Partial<Pref>; data: Partial<Pref> }) => {
        const lignes = mockPrefs.filter((p) => (where.userId === undefined || p.userId === where.userId) && (where.enabled === undefined || p.enabled === where.enabled));
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
  arreterLettreHebdo,
  arreterLettreHebdoParJeton,
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

function candidat(p: Partial<CandidatHebdo> = {}, pref: Partial<NonNullable<CandidatHebdo["premiumLetter"]>> = {}): CandidatHebdo {
  return {
    id: "u1",
    email: "Yanis@Exemple.fr",
    plan: "PREMIUM",
    emailVerified: avant,
    emailOptOut: false,
    updatedAt: avant,
    accounts: [],
    premiumLetter: { enabled: true, activatedAt: avant, consentVersion: "lettre-hebdo-premium-v1", unsubscribeToken: "t".repeat(43), ...pref },
    ...p,
  };
}

beforeEach(() => {
  mockPrefs.length = 0;
  mockEchecCreation = null;
  jest.clearAllMocks();
});

describe("recoitHebdo : LA fonction (envoi du jeudi ET pause de la mensuelle)", () => {
  it("Premium, case cochée, adresse vérifiée, jeton : reçoit", () => {
    expect(recoitHebdo(candidat(), true)).toBe(true);
  });

  it("H4-1 / §6.4 : envois fermés, personne ne reçoit (la mensuelle reprend pour tous)", () => {
    expect(recoitHebdo(candidat(), false)).toBe(false);
  });

  it.each([
    ["plan FREE (fin de Premium, avant le rapprochement : H6-2)", candidat({ plan: "FREE" })],
    ["case jamais cochée (enabled=false)", candidat({}, { enabled: false })],
    ["sans ligne", candidat({ premiumLetter: null })],
    ["sans date d'activation (consentement incomplet)", candidat({}, { activatedAt: null })],
    ["sans version du texte", candidat({}, { consentVersion: null })],
    ["sans jeton d'arrêt (aucun envoi sans lien d'arrêt)", candidat({}, { unsubscribeToken: null })],
    ["adresse jamais vérifiée et pas de compte Google (cas 11)", candidat({ emailVerified: null })],
    ["opposition globale postérieure à l'activation", candidat({ emailOptOut: true, updatedAt: NOW })],
    ["sans adresse", candidat({ email: null })],
  ])("ne reçoit pas : %s", (_, c) => {
    expect(recoitHebdo(c, true)).toBe(false);
  });

  it("compte Google sans date de vérification : reçoit", () => {
    expect(recoitHebdo(candidat({ emailVerified: null, accounts: [{ id: "g" }] }), true)).toBe(true);
  });

  it("H6-10 / L6 : activation POSTÉRIEURE à l'opposition globale = nouvel acte positif, reçoit", () => {
    expect(recoitHebdo(candidat({ emailOptOut: true, updatedAt: new Date("2026-10-01T00:00:00Z") }), true)).toBe(true);
  });

  it("destinatairesHebdo : envois fermés, aucune lecture en base", async () => {
    expect(await destinatairesHebdo(false)).toEqual([]);
    expect(db.user.findMany).not.toHaveBeenCalled();
  });

  it("destinatairesHebdo : adresses en minuscules, filtre final par recoitHebdo", async () => {
    db.user.findMany.mockResolvedValueOnce([candidat(), candidat({ id: "u2", email: "free@x.fr", plan: "FREE" })]);
    expect(await destinatairesHebdo(true)).toEqual([{ userId: "u1", email: "yanis@exemple.fr", unsubscribeToken: "t".repeat(43) }]);
  });
});

describe("Activation (case jamais cochée d'avance : seule une action écrit)", () => {
  it("H1-2 / H2-2 : première activation = enabled, date, version SERVEUR, origine, jeton opaque", async () => {
    expect(await activerLettreHebdo("u1", "paiement", NOW)).toBe("activee");
    expect(mockPrefs[0]).toMatchObject({ enabled: true, activatedAt: NOW, consentVersion: "lettre-hebdo-premium-v1", activationOrigin: "paiement", stoppedAt: null, stopOrigin: null });
    expect(mockPrefs[0].unsubscribeToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("idempotente : déjà active, `activatedAt` n'est pas réécrit", async () => {
    await activerLettreHebdo("u1", "profil", avant);
    expect(await activerLettreHebdo("u1", "profil", NOW)).toBe("deja-activee");
    expect(mockPrefs[0].activatedAt).toEqual(avant);
  });

  it("H1-8 : double coche concurrente (création en conflit) = une seule activation", async () => {
    mockEchecCreation = { code: "P2002" };
    expect(await activerLettreHebdo("u1", "profil", NOW)).toBe("deja-activee");
  });

  it("H1-10 / §6.2 : réabonné (fin-premium) qui recoche : nouvelle date, version courante, trace d'arrêt effacée, MÊME jeton (H3-9)", async () => {
    mockPrefs.push({ userId: "u1", enabled: false, activatedAt: avant, consentVersion: "lettre-hebdo-premium-v1", activationOrigin: "paiement", stoppedAt: avant, stopOrigin: "fin-premium", unsubscribeToken: "ancien".padEnd(43, "a") });
    expect(await activerLettreHebdo("u1", "paiement", NOW)).toBe("activee");
    expect(mockPrefs[0]).toMatchObject({ enabled: true, activatedAt: NOW, stoppedAt: null, stopOrigin: null, unsubscribeToken: "ancien".padEnd(43, "a") });
  });
});

describe("Arrêt (toujours possible) et fin de Premium", () => {
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

  it("compte sans ligne : inconnu", async () => {
    expect(await arreterLettreHebdo("u-absent", "admin", NOW)).toBe("inconnu");
  });

  it("§6.2 : fin-premium posé avec le passage à FREE (opération jointe à la transaction)", async () => {
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
