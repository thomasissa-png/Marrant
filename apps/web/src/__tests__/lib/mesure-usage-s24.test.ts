/**
 * @jest-environment node
 *
 * s24 lot 0 : mesure d'usage serveur (`lib/mesure/evenements-usage.ts`). Base simulée en mémoire
 * avec la même contrainte d'unicité que la migration 18 (`dedupKey`). Vérifie : dédoublonnage,
 * premier accès et « aha » une fois par ABONNEMENT (ancre = abonnement Stripe, pas la ligne
 * `souscription` : aucune course au réabonnement), compte non Premium = rien, écriture en échec =
 * pas d'exception, aucune donnée personnelle (liste fermée, journal sans identifiant).
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  cleUnique,
  detailFerme,
  noterEvenement,
  noterJourPratique,
  noterPremiereFois,
  type MesureDb,
} from "@/lib/mesure/evenements-usage";

type Ligne = { userId: string; type: string; detail: string | null; occurredAt: Date; dedupKey: string | null };

function fausseBase(abonnements: Record<string, string | null> = {}) {
  const lignes: Ligne[] = [];
  const db = {
    usageEvent: {
      create: jest.fn(async ({ data }: { data: Ligne }) => {
        if (data.dedupKey && lignes.some((l) => l.dedupKey === data.dedupKey)) {
          throw Object.assign(new Error("Unique constraint failed"), { code: "P2002" });
        }
        lignes.push({ ...data });
        return data;
      }),
      findUnique: jest.fn(async ({ where }: { where: { dedupKey: string } }) =>
        lignes.some((l) => l.dedupKey === where.dedupKey) ? { id: "x" } : null,
      ),
    },
    subscription: {
      findUnique: jest.fn(async ({ where }: { where: { userId: string } }) =>
        where.userId in abonnements ? { stripeSubscriptionId: abonnements[where.userId] } : null,
      ),
    },
  };
  return { db: db as unknown as MesureDb, brut: db, lignes, abonnements };
}

const T0 = new Date("2026-11-20T09:00:00Z");
let warn: jest.SpyInstance;
beforeEach(() => {
  warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => warn.mockRestore());

describe("détail fermé (aucun texte libre)", () => {
  it("accepte les valeurs de la liste, refuse le reste", () => {
    expect(detailFerme("souscription", "month")).toBe("month");
    expect(detailFerme("souscription", "iap")).toBe("iap");
    expect(detailFerme("premier_acces_premium", "etape:3")).toBe("etape:3");
    expect(detailFerme("premier_acces_premium", "liste-conseils")).toBe("liste-conseils");
    expect(detailFerme("aha", "etape:1")).toBe("etape:1");
    expect(detailFerme("aha", "quiz:2")).toBe("quiz:2");
    expect(detailFerme("resiliation_programmee", "too_expensive")).toBe("too_expensive");
    // Définitions du §5.2 : plus de « aha » par exercice, plus de premier accès « parcours:<slug> ».
    expect(detailFerme("aha", "exercice-conseil")).toBeNull();
    expect(detailFerme("premier_acces_premium", "parcours:repartie")).toBeNull();
    expect(detailFerme("resiliation_programmee", "Trop cher pour moi")).toBeNull();
    expect(detailFerme("premier_acces_premium", "yanis@example.com")).toBeNull();
    expect(detailFerme("premier_acces_premium", "carnet:2")).toBeNull();
    expect(detailFerme("aha", "etape:abc")).toBeNull();
    expect(detailFerme("portail_ouvert", "resilier:x:y")).toBeNull();
  });
});

describe("noterEvenement", () => {
  it("écrit compte, type, date, détail fermé et clé : rien d'autre", async () => {
    const { db, lignes } = fausseBase();
    expect(await noterEvenement("portail_ouvert", "u1", { detail: "resilier", occurredAt: T0, db })).toBe(true);
    expect(lignes).toEqual([{ userId: "u1", type: "portail_ouvert", detail: "resilier", occurredAt: T0, dedupKey: null }]);
    await noterEvenement("resiliation_programmee", "u1", { detail: "commentaire libre de l'abonné", db });
    expect(lignes[1].detail).toBeNull();
  });

  it("même clé = une seule ligne, sans bruit dans le journal", async () => {
    const { db, lignes } = fausseBase();
    const dedupKey = cleUnique("souscription", "u1", 1);
    expect(await noterEvenement("souscription", "u1", { dedupKey, db })).toBe(true);
    expect(await noterEvenement("souscription", "u1", { dedupKey, db })).toBe(false);
    expect(lignes).toHaveLength(1);
    expect(warn).not.toHaveBeenCalled();
  });

  it("écriture en échec (table absente) : false, aucune exception, journal sans identifiant", async () => {
    const db = { usageEvent: { create: jest.fn().mockRejectedValue(Object.assign(new Error("relation u-secret"), { code: "P2021" })) } };
    await expect(noterEvenement("souscription", "u-secret", { db: db as unknown as MesureDb })).resolves.toBe(false);
    expect(warn).toHaveBeenCalledWith("[mesure] souscription non enregistré (P2021)");
    expect(JSON.stringify(warn.mock.calls)).not.toContain("u-secret");
  });

  it("client sans la table (Prisma pas régénéré) : false", async () => {
    await expect(noterEvenement("souscription", "u1", { db: {} as MesureDb })).resolves.toBe(false);
  });
});

describe("premier accès Premium et « aha » : une fois par abonnement", () => {
  it("compte non Premium ou anonyme : aucune ligne, aucune requête", async () => {
    const { db, brut, lignes } = fausseBase({ u1: "sub_1" });
    expect(await noterPremiereFois("premier_acces_premium", "FREE", "u1", "carnet", { db })).toBe(false);
    expect(await noterPremiereFois("premier_acces_premium", null, "u1", "carnet", { db })).toBe(false);
    expect(await noterPremiereFois("aha", "PREMIUM", null, "etape:1", { db })).toBe(false);
    expect(lignes).toHaveLength(0);
    expect(brut.subscription.findUnique).not.toHaveBeenCalled();
  });

  it("deuxième accès ignoré ; nouvel abonnement = nouveau premier accès ; identifiant Stripe jamais stocké", async () => {
    const { db, lignes, abonnements } = fausseBase({ u1: "sub_premier" });
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "liste-vannes", { now: T0, db })).toBe(true);
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "carnet", { now: T0, db })).toBe(false);
    abonnements.u1 = "sub_second";
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "carnet", { now: T0, db })).toBe(true);
    expect(lignes.map((l) => l.detail)).toEqual(["liste-vannes", "carnet"]);
    expect(new Set(lignes.map((l) => l.dedupKey)).size).toBe(2);
    expect(JSON.stringify(lignes)).not.toMatch(/sub_/);
  });

  it("course du réabonnement (correction QA 15) : accès AVANT la ligne `souscription` = compté pour le nouvel abonnement", async () => {
    const { db, lignes, abonnements } = fausseBase({ u1: "sub_ancien" });
    await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "carnet", { now: T0, db });
    // Réabonnement : l'activation (webhook ou page de succès) pose le nouvel abonnement, la ligne
    // `souscription` n'est pas encore écrite.
    abonnements.u1 = "sub_nouveau";
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "liste-videos", { now: T0, db })).toBe(true);
    expect(lignes).toHaveLength(2);
  });

  it("deux requêtes simultanées : une seule ligne", async () => {
    const { db, lignes } = fausseBase({ u1: "sub_1" });
    await Promise.all([
      noterPremiereFois("aha", "PREMIUM", "u1", "etape:1", { now: T0, db }),
      noterPremiereFois("aha", "PREMIUM", "u1", "quiz:2", { now: T0, db }),
    ]);
    expect(lignes.filter((l) => l.type === "aha")).toHaveLength(1);
  });

  it("achat dans l'application (pas d'abonnement Stripe) : une fois par compte", async () => {
    const { db, lignes } = fausseBase();
    await noterPremiereFois("aha", "PREMIUM", "u2", "etape:1", { now: T0, db });
    await noterPremiereFois("aha", "PREMIUM", "u2", "etape:2", { now: T0, db });
    expect(lignes.map((l) => l.dedupKey)).toEqual(["aha:u2:sans-stripe"]);
  });

  it("lecture en échec : false, aucune exception, aucune écriture", async () => {
    const db = {
      subscription: { findUnique: jest.fn().mockRejectedValue(new Error("base en panne")) },
      usageEvent: { create: jest.fn(), findUnique: jest.fn() },
    };
    await expect(noterPremiereFois("aha", "PREMIUM", "u1", "etape:1", { db: db as unknown as MesureDb })).resolves.toBe(false);
    expect(db.usageEvent.create).not.toHaveBeenCalled();
  });
});

describe("jour de pratique (quiz)", () => {
  it("un seul jour de pratique par jour civil de Paris", async () => {
    const { db, lignes } = fausseBase();
    await noterJourPratique("u1", "quiz", { now: new Date("2026-11-20T08:00:00Z"), db });
    await noterJourPratique("u1", "quiz", { now: new Date("2026-11-20T22:30:00Z"), db }); // 23 h 30 à Paris
    await noterJourPratique("u1", "quiz", { now: new Date("2026-11-20T23:30:00Z"), db }); // lendemain à Paris
    expect(lignes).toHaveLength(2);
  });
});
