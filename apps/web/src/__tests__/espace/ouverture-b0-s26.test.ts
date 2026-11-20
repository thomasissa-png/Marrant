/**
 * @jest-environment node
 *
 * s26, phase B du lancement, étape B0 (`docs/infra/lancement-s26-runbook.md` §4 ; go écrit de Thomas du
 * 20/11/2026) : valeurs COMMITÉES, lues sans le mock « fermé par défaut » de `jest.setup.ts`.
 * Le reste de la suite Jest décrit le régime fermé (retour arrière C) ou force l'ouvert test par test.
 */
import { readFileSync } from "fs";
import { join } from "path";

const reel = <T extends object>(module: string) => jest.requireActual<T>(module);

describe("B0 : activation de l'espace client", () => {
  it("interrupteur ouvert", () => {
    expect(reel<typeof import("@/config/espace-client")>("@/config/espace-client").ESPACE_CLIENT_PUBLIE).toBe(true);
  });

  it("date des textes de l'espace = date de la mesure d'usage (phase A)", () => {
    const { ESPACE_DATE_TEXTES } = reel<typeof import("@/config/textes/espace-confidentialite")>("@/config/textes/espace-confidentialite");
    const { MESURE_USAGE_DATE_TEXTES } = reel<typeof import("@/config/mesure-usage")>("@/config/mesure-usage");
    expect(ESPACE_DATE_TEXTES).toBe("20 novembre 2026");
    expect(ESPACE_DATE_TEXTES).toBe(MESURE_USAGE_DATE_TEXTES);
  });

  it("restent fermés : seuil du toucher (null) et page de résiliation (false)", () => {
    expect(reel<typeof import("@/lib/espace/vanne")>("@/lib/espace/vanne").SEUIL_TOUCHER).toBeNull();
    expect(reel<typeof import("@/config/resiliation")>("@/config/resiliation").RESILIATION_PAGE_OUVERTE).toBe(false);
  });

  it("Jest tourne fermé par défaut (jest.setup.ts) : le mock est bien celui de l'interrupteur seul", () => {
    expect(jest.requireMock<typeof import("@/config/espace-client")>("@/config/espace-client").ESPACE_CLIENT_PUBLIE).toBe(false);
    const setup = readFileSync(join(__dirname, "../../../jest.setup.ts"), "utf8");
    expect(setup).toContain('jest.mock("@/config/espace-client"');
  });
});
