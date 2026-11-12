/**
 * @jest-environment node
 *
 * s24 lot 0 : mesure d'usage serveur (`lib/mesure/evenements-usage.ts`). Base simulée en mémoire
 * avec la même contrainte d'unicité que la migration 18 (`dedupKey`). Vérifie : dédoublonnage,
 * premier accès une fois par souscription, compte non Premium = rien, écriture en échec = pas
 * d'exception, aucune donnée personnelle (liste fermée, pas d'e-mail ni de texte libre, journal
 * sans identifiant).
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  cleUnique,
  depasseLimiteGratuite,
  detailFerme,
  noterEvenement,
  noterExerciceOuvert,
  noterJourPratique,
  noterPremiereFois,
  type MesureDb,
} from "@/lib/mesure/evenements-usage";

type Ligne = { userId: string; type: string; detail: string | null; occurredAt: Date; dedupKey: string | null };

function fausseBase() {
  const lignes: Ligne[] = [];
  const db: MesureDb = {
    usageEvent: {
      create: jest.fn(async ({ data }: { data: Ligne }) => {
        if (data.dedupKey && lignes.some((l) => l.dedupKey === data.dedupKey)) {
          throw Object.assign(new Error("Unique constraint failed"), { code: "P2002" });
        }
        lignes.push({ ...data });
        return data;
      }),
      findFirst: jest.fn(async ({ where }: { where: { userId: string; type: { in: string[] } } }) => {
        const l = lignes
          .filter((x) => x.userId === where.userId && where.type.in.includes(x.type))
          .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())[0];
        return l ? { type: l.type, occurredAt: l.occurredAt } : null;
      }),
    } as unknown as MesureDb["usageEvent"],
  };
  return { db, lignes };
}

const T0 = new Date("2026-11-20T09:00:00Z");
const plus = (min: number) => new Date(T0.getTime() + min * 60_000);
let warn: jest.SpyInstance;
beforeEach(() => {
  warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => warn.mockRestore());

describe("détail fermé (aucun texte libre)", () => {
  it("accepte les valeurs de la liste, refuse le reste", () => {
    expect(detailFerme("souscription", "month")).toBe("month");
    expect(detailFerme("premier_acces_premium", "parcours:confiance-en-soi")).toBe("parcours:confiance-en-soi");
    expect(detailFerme("aha", "etape:3")).toBe("etape:3");
    expect(detailFerme("resiliation_programmee", "too_expensive")).toBe("too_expensive");
    expect(detailFerme("resiliation_programmee", "Trop cher pour moi")).toBeNull();
    expect(detailFerme("premier_acces_premium", "yanis@example.com")).toBeNull();
    expect(detailFerme("premier_acces_premium", "carnet:quelque chose")).toBeNull();
    expect(detailFerme("premier_acces_premium", "parcours:A B")).toBeNull();
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

  it("client sans la table (ancien mock, Prisma pas régénéré) : false", async () => {
    await expect(noterEvenement("souscription", "u1", { db: {} as MesureDb })).resolves.toBe(false);
  });
});

describe("premier accès Premium et « aha » : une fois par souscription", () => {
  it("compte non Premium ou anonyme : aucune ligne, aucune requête", async () => {
    const { db, lignes } = fausseBase();
    expect(await noterPremiereFois("premier_acces_premium", "FREE", "u1", "carnet", { db })).toBe(false);
    expect(await noterPremiereFois("premier_acces_premium", null, "u1", "carnet", { db })).toBe(false);
    expect(await noterPremiereFois("aha", "PREMIUM", null, "etape:1", { db })).toBe(false);
    expect(lignes).toHaveLength(0);
    expect(db.usageEvent.findFirst).not.toHaveBeenCalled();
  });

  it("deuxième accès ignoré ; nouvelle souscription = nouveau premier accès", async () => {
    const { db, lignes } = fausseBase();
    await noterEvenement("souscription", "u1", { occurredAt: T0, dedupKey: cleUnique("souscription", "u1", 1), db });
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "liste-vannes", { now: plus(4), db })).toBe(true);
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "carnet", { now: plus(9), db })).toBe(false);
    await noterEvenement("souscription", "u1", { occurredAt: plus(60 * 24 * 40), dedupKey: cleUnique("souscription", "u1", 2), db });
    expect(await noterPremiereFois("premier_acces_premium", "PREMIUM", "u1", "carnet", { now: plus(60 * 24 * 41), db })).toBe(true);
    const acces = lignes.filter((l) => l.type === "premier_acces_premium");
    expect(acces.map((l) => l.detail)).toEqual(["liste-vannes", "carnet"]);
    expect(new Set(acces.map((l) => l.dedupKey)).size).toBe(2);
  });

  it("deux requêtes simultanées : une seule ligne (clé ancrée)", async () => {
    const { db, lignes } = fausseBase();
    await Promise.all([
      noterPremiereFois("aha", "PREMIUM", "u1", "etape:1", { now: T0, db }),
      noterPremiereFois("aha", "PREMIUM", "u1", "etape:2", { now: T0, db }),
    ]);
    expect(lignes.filter((l) => l.type === "aha")).toHaveLength(1);
    expect(lignes[0].dedupKey).toBe("aha:u1:0");
  });

  it("exercice ouvert = premier accès ET « aha », une fois chacun", async () => {
    const { db, lignes } = fausseBase();
    await noterExerciceOuvert("PREMIUM", "u1", "video", { now: T0, db });
    await noterExerciceOuvert("PREMIUM", "u1", "conseil", { now: plus(1), db });
    expect(lignes.map((l) => [l.type, l.detail])).toEqual([
      ["premier_acces_premium", "exercice-video"],
      ["aha", "exercice-video"],
    ]);
  });

  it("lecture en échec : false, aucune exception", async () => {
    const db = { usageEvent: { findFirst: jest.fn().mockRejectedValue(new Error("base en panne")), create: jest.fn() } };
    await expect(noterPremiereFois("aha", "PREMIUM", "u1", "etape:1", { db: db as unknown as MesureDb })).resolves.toBe(false);
    expect(db.usageEvent.create).not.toHaveBeenCalled();
  });
});

describe("jour de pratique (quiz) et limite gratuite", () => {
  it("un seul jour de pratique par jour civil de Paris", async () => {
    const { db, lignes } = fausseBase();
    await noterJourPratique("u1", "quiz", { now: new Date("2026-11-20T08:00:00Z"), db });
    await noterJourPratique("u1", "quiz", { now: new Date("2026-11-20T22:30:00Z"), db }); // 23 h 30 à Paris
    await noterJourPratique("u1", "quiz", { now: new Date("2026-11-20T23:30:00Z"), db }); // lendemain à Paris
    expect(lignes).toHaveLength(2);
  });

  it("liste au-delà de la limite gratuite seulement", () => {
    expect(depasseLimiteGratuite(0, 10, 10)).toBe(false);
    expect(depasseLimiteGratuite(0, 11, 10)).toBe(true);
    expect(depasseLimiteGratuite(10, 10, 10)).toBe(true);
    expect(depasseLimiteGratuite(20, 0, 10)).toBe(false);
  });
});
