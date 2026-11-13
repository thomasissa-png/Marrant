/**
 * @jest-environment node
 *
 * Espace client, lot D4 (s24), côté serveur : `/api/espace/caps` interrupteur OUVERT (simulé ici,
 * jamais le code livré), recalcul unique silencieux, export des données (@legal G9, point 1).
 */
const mockDb = {
  user: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  userPathStepCompletion: { findMany: jest.fn() },
  userPathProgress: { findMany: jest.fn() },
  userPathStepFeedback: { findMany: jest.fn(async () => []) },
  parcoursReminderPreference: { findUnique: jest.fn(async () => null) },
  espaceCompte: { findUnique: jest.fn() },
  capAnnonce: { findMany: jest.fn(), createMany: jest.fn() },
  // Lot D5 : tables lues par l'export des données.
  carteSuivi: { findMany: jest.fn(async () => []) },
  carteReponse: { findMany: jest.fn(async () => []) },
  ficheFait: { findMany: jest.fn(async () => []) },
  missionRetour: { findMany: jest.fn(async () => []) },
  userReplique: { findMany: jest.fn(async () => []) },
  // Lot D7 : « Mes questions » dans l'export.
  equipeFil: { findMany: jest.fn(async () => []) },
};
jest.mock("@/lib/prisma", () => ({ get prisma() { return mockDb; } }));
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  ESPACE_CLIENT_PUBLIE: true,
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
// Lot D9 : mesure `cap_atteint` espionnée (annonce montrée seulement, jamais le recalcul silencieux).
const noterCapsAtteints = jest.fn(async (_u: string, caps: readonly number[]) => caps.length);
jest.mock("@/lib/mesure/evenements-espace", () => ({ noterCapsAtteints: (u: string, c: readonly number[]) => noterCapsAtteints(u, c) }));

import { GET, POST } from "@/app/api/espace/caps/route";
import { recalculerCapsSilencieux, type DbCaps } from "@/lib/espace/caps-serveur";
import { collecterDonneesParcours } from "@/lib/account";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { CONFIDENTIALITE_ESPACE, ESPACE_DATE_TEXTES } from "@/config/textes/espace-confidentialite";
import { frTypo } from "@/lib/fr-typo";

const etapes = (slug: string, ordres: number[]) => ordres.map((stepOrder) => ({ stepOrder, learningPath: { slug } }));
const db = mockDb as unknown as DbCaps;

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  mockDb.user.findUnique.mockImplementation(async (a: { select: Record<string, unknown> }) =>
    "plan" in a.select ? { plan: "PREMIUM", subscription: null } : { xp: 412, streak: 3, lastPracticeAt: new Date() },
  );
  mockDb.userPathStepCompletion.findMany.mockResolvedValue(etapes("machine-a-cafe", [1, 2, 3]));
  mockDb.userPathProgress.findMany.mockResolvedValue([]);
  mockDb.capAnnonce.findMany.mockResolvedValue([]);
  mockDb.capAnnonce.createMany.mockImplementation(async (a: { data: unknown[] }) => ({ count: a.data.length }));
});

describe("GET /api/espace/caps (ouvert)", () => {
  it("cap affiché (412 XP : cap 3), déblocage (étapes seules : 225, cap 2), écart, annonce due, étape à reprendre", async () => {
    mockDb.userPathProgress.findMany.mockImplementation(async (a: { where: Record<string, unknown> }) =>
      "completedAt" in a.where
        ? []
        : [{ completedSteps: [1, 2], completedAt: null, startedAt: new Date(), learningPath: { slug: "confiance", stepCompletions: [] } }],
    );
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    const corps = await res.json();
    expect(corps).toMatchObject({ xp: 412, capAffiche: 3, capDeblocage: 2, ecart: true, bonus: [] });
    // Aucun bonus rangé en production (lot C8 à venir) : l'annonce ne porte que le cap.
    expect(corps.annonce).toEqual({ cap: 3, bonus: null, marques: [{ type: "CAP", numero: 2 }, { type: "CAP", numero: 3 }] });
    expect(corps.etape).toMatchObject({ slug: "confiance", ordre: 3, enCours: true });
  });

  it("compte sans abonnement actif (plan relu en base) : 403, aucune lecture de caps", async () => {
    mockDb.user.findUnique.mockResolvedValue({ plan: "FREE", subscription: null });
    expect((await GET()).status).toBe(403);
    expect(mockDb.capAnnonce.findMany).not.toHaveBeenCalled();
  });

  it("sans session : 401", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await GET()).status).toBe(401);
  });
});

describe("POST /api/espace/caps (acquittement)", () => {
  const poster = (corps: unknown) => POST(new Request("http://localhost/api/espace/caps", { method: "POST", body: JSON.stringify(corps) }));

  it("n'écrit que les annonces dues, jamais un cap non atteint, silencieux = false", async () => {
    const res = await poster({ annonces: [{ type: "CAP", numero: 3 }, { type: "CAP", numero: 5 }, { type: "BONUS", numero: 2 }] });
    expect(res.status).toBe(200);
    expect(mockDb.capAnnonce.createMany).toHaveBeenCalledTimes(1);
    const { data, skipDuplicates } = mockDb.capAnnonce.createMany.mock.calls[0][0];
    expect(skipDuplicates).toBe(true);
    expect(data).toEqual([expect.objectContaining({ userId: "u1", type: "CAP", numero: 3, silencieux: false })]);
    expect(mockDb.user.update).not.toHaveBeenCalled();
    expect(noterCapsAtteints).toHaveBeenCalledWith("u1", [3]);
  });

  it("valeur hors liste : 400, rien d'écrit", async () => {
    expect((await poster({ annonces: [{ type: "XP", numero: 3 }] })).status).toBe(400);
    expect((await poster({ annonces: [] })).status).toBe(400);
    expect(mockDb.capAnnonce.createMany).not.toHaveBeenCalled();
  });
});

describe("recalcul unique des caps (silencieux, vers le haut)", () => {
  beforeEach(() => {
    mockDb.user.findMany.mockResolvedValue([
      { id: "a", xp: 750, level: "APPRENTI" },
      { id: "b", xp: 5200, level: "LEGENDE" },
      { id: "c", xp: 40, level: "NOVICE" },
    ]);
    mockDb.userPathStepCompletion.findMany.mockImplementation(async (a: { where: { userId: string } }) =>
      a.where.userId === "a" ? etapes("confiance", [1, 2, 3, 4, 5, 6]) : [],
    );
    mockDb.userPathProgress.findMany.mockImplementation(async (a: { where: { userId: string } }) =>
      a.where.userId === "a" ? [{ learningPath: { slug: "confiance" } }] : [],
    );
  });

  it("lecture seule par défaut : aucun écrit", async () => {
    const bilan = await recalculerCapsSilencieux(db, false);
    expect(bilan.comptes).toBe(3);
    expect(mockDb.user.update).not.toHaveBeenCalled();
    expect(mockDb.capAnnonce.createMany).not.toHaveBeenCalled();
  });

  it("appliqué : niveaux relevés jamais abaissés, lignes `silencieux = true` seulement, aucun bonus pour un XP gonflé sans étape", async () => {
    await recalculerCapsSilencieux(db, true);
    expect(mockDb.user.update).toHaveBeenCalledTimes(1);
    expect(mockDb.user.update).toHaveBeenCalledWith({ where: { id: "a" }, data: { level: "COMIQUE" } });
    const lignes = mockDb.capAnnonce.createMany.mock.calls.flatMap((c) => c[0].data as Array<Record<string, unknown>>);
    expect(lignes.every((l) => l.silencieux === true)).toBe(true);
    // Lot D9 : le recalcul unique de l'ouverture n'émet aucun `cap_atteint`.
    expect(noterCapsAtteints).not.toHaveBeenCalled();
    const de = (id: string, type: string) => lignes.filter((l) => l.userId === id && l.type === type).map((l) => l.numero);
    expect(de("a", "CAP")).toEqual([2, 3, 4]);
    expect(de("a", "BONUS")).toEqual([2, 3, 4]);
    expect(de("b", "CAP")).toEqual([2, 3, 4, 5]);
    expect(de("b", "BONUS")).toEqual([]);
    expect(de("c", "CAP")).toEqual([]);
  });
});

describe("export des données du compte (@legal, espace-c9-information-s24.md point 1)", () => {
  it("collecterDonneesParcours inclut `EspaceCompte` (réponse C9 et dates) et les annonces de cap", async () => {
    const espace = { aise: "BOULOT", aiseLe: new Date("2026-11-12"), rencontreServieLe: null, createdAt: new Date(), updatedAt: new Date() };
    mockDb.espaceCompte.findUnique.mockResolvedValue(espace);
    mockDb.capAnnonce.findMany.mockResolvedValue([{ type: "CAP", numero: 2, annonceLe: new Date(), silencieux: true }]);
    const donnees = await collecterDonneesParcours("u1");
    expect(donnees.espace).toEqual(espace);
    expect(donnees.annoncesCaps).toHaveLength(1);
    expect(mockDb.espaceCompte.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u1" } }));
    // Lot D7 : date du premier pas et fils de « Mes questions » (messages ET réponses) exportés.
    expect(mockDb.espaceCompte.findUnique.mock.calls.at(-1)?.[0].select).toMatchObject({ premierPasLe: true });
    expect(donnees.questions).toEqual([]);
    expect(mockDb.equipeFil.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u1" } }));
  });
});

describe("confidentialité, espace OUVERT (simulé) : les trois lignes de @legal (G9)", () => {
  it("partie 2, partie 3 et phrase de la partie 6 rendues ; date de mise à jour inchangée tant que la date est vide", () => {
    const html = renderToStaticMarkup(createElement(ConfidentialitePage));
    // D5b : quatrième ligne, le cookie du coin « Humour noir » (partie 5, @legal `espace-d6-cookie-coin-s24.md`).
    // D10 (plan §6 T6) : caps annoncés (@legal D4) et usage de l'espace (@legal D9), parties 2 et 3.
    const E = CONFIDENTIALITE_ESPACE;
    for (const t of [E.donnees, E.base, E.dureeEtapes, E.cookie, E.donneesCaps, E.baseCaps, E.mesure, E.baseMesure]) {
      expect(html).toContain(frTypo(t).replace(/'/g, "&#x27;"));
    }
    expect(ESPACE_DATE_TEXTES).toBe("");
    // D7 (plan §6 T5) : puces 1 et 4 de la partie 9 remplacées par les phrases de @legal (bloc 2) ; D10 : + 4 lignes.
    expect(html.match(/data-testid="confidentialite-espace"/g)).toHaveLength(10);
    for (const t of Object.values(CONFIDENTIALITE_ESPACE.questions)) expect(html).toContain(frTypo(t).replace(/'/g, "&#x27;"));
    expect(html).not.toContain("Le site ne les garde pas dans sa base de données");
    // Placée juste après « Cookies essentiels ».
    const essentiels = html.indexOf("Cookies essentiels");
    expect(essentiels).toBeGreaterThan(0);
    expect(html.indexOf("Coin « Humour noir »", essentiels)).toBeLessThan(html.indexOf("Mesure d’audience", essentiels));
  });
});
