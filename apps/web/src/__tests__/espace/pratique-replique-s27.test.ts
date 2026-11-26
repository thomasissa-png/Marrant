/**
 * @jest-environment node
 *
 * s27 D4 (`docs/qa/parcours-abonne-s27.md`, go de Thomas du 26/11) : une réplique écrite sur la situation de « Ton
 * premier pas » ne comptait pas comme pratique ; au retour, « Aujourd'hui » reproposait la même situation avec « Ta série
 * démarre à ta prochaine pratique ». Désormais une réplique enregistrée, ou un « Ton retour » qui dit « Essayé… », compte
 * comme pratique du jour (série, règle s17 `lastPracticeAt`) et fige le premier pas. Anti-triche s24 : AUCUN XP.
 */
const userFindUnique = jest.fn();
const userUpdate = jest.fn();
const createMany = jest.fn(async () => ({ count: 1 }));
const updateMany = jest.fn(async () => ({ count: 0 }));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a), update: (...a: unknown[]) => userUpdate(...a) },
    espaceCompte: { createMany: (...a: unknown[]) => createMany(...(a as [])), updateMany: (...a: unknown[]) => updateMany(...(a as [])) },
  },
}));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("@/lib/espace/garde", () => ({
  ...jest.requireActual("@/lib/espace/garde"),
  garderApiLectureSeule: jest.fn(async () => ({ userId: "u1", actif: true })),
  garderApiEspace: jest.fn(async () => ({ userId: "u1" })),
}));
const enregistrerReplique = jest.fn(async () => true);
jest.mock("@/lib/espace/repliques", () => ({
  ...jest.requireActual("@/lib/espace/repliques"),
  ficheAcceptantReplique: () => true,
  enregistrerReplique: (...a: unknown[]) => enregistrerReplique(...(a as [])),
  supprimerReplique: jest.fn(async () => undefined),
}));
jest.mock("@/lib/espace/api", () => ({ ...jest.requireActual("@/lib/espace/api"), limiterEcritures: jest.fn(async () => null) }));
jest.mock("@/lib/espace/compteurs", () => ({ compterAnonyme: jest.fn(async () => undefined) }));
const declarerRetour = jest.fn();
jest.mock("@/lib/espace/fiche-fait", () => ({ ...jest.requireActual("@/lib/espace/fiche-fait"), declarerRetour: (...a: unknown[]) => declarerRetour(...a) }));

import { PUT as ecrire, DELETE as effacer } from "@/app/api/espace/replique/route";
import { POST as ficheFait } from "@/app/api/espace/fiche-fait/route";
import { premierPasDepuis } from "@/lib/espace/premier-pas-serveur";
import { compterPratiqueEspace } from "@/lib/espace/pratique-espace";

const req = (corps: unknown, methode: string) =>
  new Request("http://localhost/api/espace/x", { method: methode, body: JSON.stringify(corps), headers: { "Content-Type": "application/json" } });
const FICHE = "amis-tu-as-change-quelque-chose";

beforeEach(() => {
  jest.clearAllMocks();
  userFindUnique.mockResolvedValue({ streak: 0, lastPracticeAt: null });
});

/** Champs écrits sur le compte : jamais d'XP, de niveau ni de cap. */
function champsEcrits(): string[] {
  return userUpdate.mock.calls.flatMap(([a]) => Object.keys((a as { data: object }).data)).sort();
}

describe("réplique enregistrée = pratique du jour (s27 D4)", () => {
  it("PUT /api/espace/replique : série démarrée (1 jour), premier pas figé, aucun XP", async () => {
    const res = await ecrire(req({ ficheId: FICHE, texte: "Oui, j'ai changé d'avis sur toi." }, "PUT"));
    expect(res.status).toBe(200);
    expect(userUpdate).toHaveBeenCalledTimes(1);
    expect(userUpdate.mock.calls[0][0].data.streak).toBe(1);
    expect(champsEcrits()).toEqual(["lastActiveAt", "lastPracticeAt", "streak"]);
    expect(createMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ userId: "u1" })], skipDuplicates: true });
  });

  it("même jour, 2e réplique : la série ne bouge pas (un jour civil de Paris au plus)", async () => {
    userFindUnique.mockResolvedValue({ streak: 1, lastPracticeAt: new Date() });
    await ecrire(req({ ficheId: FICHE, texte: "Une autre." }, "PUT"));
    expect(userUpdate.mock.calls[0][0].data.streak).toBe(1);
  });

  it("veille pratiquée : +1 jour", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] }).setSystemTime(new Date("2026-11-26T12:00:00Z"));
    userFindUnique.mockResolvedValue({ streak: 3, lastPracticeAt: new Date("2026-11-25T12:00:00Z") });
    await ecrire(req({ ficheId: FICHE, texte: "Encore une." }, "PUT"));
    jest.useRealTimers();
    expect(userUpdate.mock.calls[0][0].data.streak).toBe(4);
  });

  it("texte refusé (vide) ou suppression : rien ne compte", async () => {
    expect((await ecrire(req({ ficheId: FICHE, texte: "   " }, "PUT"))).status).toBe(400);
    expect((await effacer(req({ ficheId: FICHE }, "DELETE"))).status).toBe(200);
    expect(userUpdate).not.toHaveBeenCalled();
    expect(createMany).not.toHaveBeenCalled();
  });

  it("le corps ne peut rien imposer (XP, série) : champs inconnus refusés", async () => {
    const res = await ecrire(req({ ficheId: FICHE, texte: "Ok", xp: 500, streak: 99 }, "PUT"));
    expect(res.status).toBe(400);
    expect(userUpdate).not.toHaveBeenCalled();
  });
});

describe("« Ton retour » sur Quoi répondre (s27 D4)", () => {
  it("« Essayé… » : pratique du jour, aucun XP", async () => {
    declarerRetour.mockResolvedValue({ fait: true });
    const res = await ficheFait(req({ ficheId: FICHE, retour: "essaye-ca-a-marche" }, "POST"));
    expect(res.status).toBe(200);
    expect(champsEcrits()).toEqual(["lastActiveAt", "lastPracticeAt", "streak"]);
  });

  it("« Pas essayé » : ne compte pas", async () => {
    declarerRetour.mockResolvedValue({ fait: false });
    await ficheFait(req({ ficheId: FICHE, retour: "pas-essaye" }, "POST"));
    expect(userUpdate).not.toHaveBeenCalled();
  });
});

describe("premier pas et robustesse", () => {
  it("une réplique enregistrée suffit au premier pas (y compris les répliques d'avant la règle)", () => {
    const sans = { ficheOuCarte: false, etapesValidees: 0, c9Repondue: false };
    expect(premierPasDepuis(sans)).toBe(false);
    expect(premierPasDepuis({ ...sans, repliques: 0 })).toBe(false);
    expect(premierPasDepuis({ ...sans, repliques: 1 })).toBe(true);
  });

  it("échec de la base pendant le décompte : la réplique reste enregistrée, la route répond 200, rien n'est journalisé du texte", async () => {
    const erreur = jest.spyOn(console, "error").mockImplementation(() => undefined);
    userFindUnique.mockRejectedValue(new Error("base indisponible"));
    const res = await ecrire(req({ ficheId: FICHE, texte: "Ma phrase secrète" }, "PUT"));
    expect(res.status).toBe(200);
    expect(enregistrerReplique).toHaveBeenCalled();
    expect(JSON.stringify(erreur.mock.calls)).not.toMatch(/secrète/);
    erreur.mockRestore();
  });

  it("compterPratiqueEspace ne lève jamais", async () => {
    userFindUnique.mockRejectedValue(new Error("x"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(compterPratiqueEspace("u1", "retour")).resolves.toBeUndefined();
  });
});
