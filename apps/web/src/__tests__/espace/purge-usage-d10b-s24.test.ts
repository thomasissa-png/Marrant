/**
 * @jest-environment node
 *
 * Lot D10b (s24) : la purge de `UsageEvent` est programmée par le planificateur EXISTANT du dépôt
 * (`lib/scheduler/jobs.ts`, pas de nouveau mécanisme), inerte tant que l'interrupteur de l'espace est
 * fermé, durée en constante unique ([HYPOTHÈSE : 13 mois] à fixer par Thomas), la même que la phrase de la
 * politique de confidentialité. Interrupteur simulé ici (jamais le code livré, qui reste fermé).
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D10B_OUVERT__?: boolean }).__D10B_OUVERT__ ?? false;
  },
}));
const count = jest.fn(async (_a?: unknown) => 0);
const deleteMany = jest.fn(async (_a?: unknown) => ({ count: 3 }));
jest.mock("@/lib/prisma", () => ({ prisma: { usageEvent: { count: (a: unknown) => count(a), deleteMany: (a: unknown) => deleteMany(a) } } }));

import { createSchedulerJobs } from "@/lib/scheduler/jobs";
import { DUREE_CONSERVATION_USAGE_MOIS, limiteConservation } from "@/lib/mesure/conservation-usage";
import { CONFIDENTIALITE_ESPACE } from "@/config/textes/espace-confidentialite";
import { ESPACE_CLIENT_PUBLIE as LIVRE } from "@/config/espace-client";

const etat = globalThis as { __D10B_OUVERT__?: boolean };
const SRC = join(__dirname, "..", "..");
const JOBS = readFileSync(join(SRC, "lib/scheduler/jobs.ts"), "utf8");
// 20/11/2026 à 3 h 10 UTC = 4 h 10 à Paris (heure d'hiver) ; 9 h 10 UTC = 10 h 10 à Paris.
const QUATRE_H_PARIS = new Date("2026-11-20T03:10:00Z");
const DIX_H_PARIS = new Date("2026-11-20T09:10:00Z");
const jobs = () => createSchedulerJobs(jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
  etat.__D10B_OUVERT__ = false;
});

describe("purge de `UsageEvent` programmée (lot D10b)", () => {
  it("interrupteur fermé (état livré) : inerte, aucune lecture ni écriture, même à 4 h", async () => {
    expect(LIVRE).toBe(false);
    expect(await jobs().runUsageEventsPurgeJob(QUATRE_H_PARIS)).toBe(0);
    expect(count).not.toHaveBeenCalled();
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("ouvert, hors de 4 h (Paris) : rien", async () => {
    etat.__D10B_OUVERT__ = true;
    expect(await jobs().runUsageEventsPurgeJob(DIX_H_PARIS)).toBe(0);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("ouvert, à 4 h (Paris) : efface avant la limite de la constante unique", async () => {
    etat.__D10B_OUVERT__ = true;
    expect(await jobs().runUsageEventsPurgeJob(QUATRE_H_PARIS)).toBe(3);
    expect(deleteMany).toHaveBeenCalledWith({ where: { occurredAt: { lt: limiteConservation(QUATRE_H_PARIS) } } });
    expect(limiteConservation(QUATRE_H_PARIS).toISOString()).toBe("2025-10-20T03:10:00.000Z");
  });

  it("base en échec : l'erreur ne remonte pas (les autres jobs du tick passent)", async () => {
    etat.__D10B_OUVERT__ = true;
    deleteMany.mockRejectedValueOnce(new Error("timeout"));
    const erreur = jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(jobs().runUsageEventsPurgeJob(QUATRE_H_PARIS)).resolves.toBe(0);
    erreur.mockRestore();
  });

  it("branchée sur le tick existant (`runAllJobs`), aucun autre mécanisme ne l'appelle", () => {
    const tick = JOBS.slice(JOBS.indexOf("const runAllJobs"));
    expect(tick).toContain("await runUsageEventsPurgeJob();");
    const fichiers = (d: string): string[] => readdirSync(d).flatMap((e) => (statSync(join(d, e)).isDirectory() ? fichiers(join(d, e)) : [join(d, e)]));
    const appelants = fichiers(SRC)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__"))
      .filter((f) => readFileSync(f, "utf8").includes("purgerUsageEvents("))
      .map((f) => f.slice(SRC.length + 1))
      .sort();
    expect(appelants).toEqual(["lib/mesure/conservation-usage.ts", "lib/scheduler/jobs.ts"]);
  });

  it("durée : une seule constante, toujours [HYPOTHÈSE] à fixer par Thomas, reprise par la politique de confidentialité", () => {
    expect(DUREE_CONSERVATION_USAGE_MOIS).toBe(13);
    expect(readFileSync(join(SRC, "lib/mesure/conservation-usage.ts"), "utf8")).toContain("[HYPOTHÈSE : 13 mois] À FIXER PAR THOMAS");
    expect(CONFIDENTIALITE_ESPACE.mesure).toContain(`gardées au plus ${DUREE_CONSERVATION_USAGE_MOIS} mois`);
    expect(JOBS).not.toMatch(/occurredAt|setUTCMonth|13 \* 30/);
  });
});
