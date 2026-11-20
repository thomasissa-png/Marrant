/**
 * @jest-environment node
 *
 * s26 lancement (porte G2 non levée : `data/espace/bonus.json` et `ecouter.json` = `[]`) : espace OUVERT (simulé
 * ici, jamais le code livré), aucun texte n'annonce un bonus inexistant et aucune section vide ne s'affiche.
 * Liste vide : la mention ou la section est masquée (aucun texte nouveau) ; elle revient dès qu'un élément existe.
 */
const mockDb = {
  user: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  userPathStepCompletion: { findMany: jest.fn() },
  userPathProgress: { findMany: jest.fn() },
  capAnnonce: { findMany: jest.fn(), createMany: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({ get prisma() { return mockDb; } }));
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  ESPACE_CLIENT_PUBLIE: true,
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/mesure/evenements-espace", () => ({ noterCapsAtteints: jest.fn(async () => 0) }));
// Bonus rangés pilotés par le test ; le reste du module (bonusOuverts, hrefBonus) est le vrai.
const bonusRanges = jest.fn();
jest.mock("@/lib/espace/bonus", () => {
  const vrai = jest.requireActual("@/lib/espace/bonus");
  return { ...vrai, bonusRanges: (...a: unknown[]) => bonusRanges(...a) };
});
jest.mock("next/navigation", () => ({ useSelectedLayoutSegment: () => null, usePathname: () => "/mon-espace/bibliotheque" }));

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GET } from "@/app/api/espace/caps/route";
import bonusJson from "@/data/espace/bonus.json";
import ecouterJson from "@/data/espace/ecouter.json";
import { annoncesAFaire } from "@/lib/espace/caps";
import { bonusTousPublies } from "@/lib/espace/bonus-publies";
import { ecouterPublie } from "@/lib/espace/ecouter-publie";
import { TesBonus } from "@/components/espace/tes-bonus";
import { TonCap } from "@/components/espace/ton-cap";
import { BlocVannes } from "@/components/espace/bloc-bibliotheque";
import { ColonneBibliotheque } from "@/components/espace/bibliotheque/colonne-liste";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { TEXTES_BIBLIOTHEQUE } from "@/config/textes/espace-bibliotheque";
import { frEspace } from "@/lib/fr-typo";

const BONUS_RANGE = { cap: 2 as const, id: "bonus-cap-2", titre: "Un passage" };
const ECOUTER = frEspace(TEXTES_BIBLIOTHEQUE.ecouter);
const LIGNE_ECOUTER = { id: "e1", titre: "Une fiche", href: "/mon-espace/bibliotheque/e1", minutes: 5, fait: false };
const html = (el: ReturnType<typeof createElement>) => renderToStaticMarkup(el);

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  mockDb.user.findUnique.mockImplementation(async (a: { select: Record<string, unknown> }) =>
    "plan" in a.select ? { plan: "PREMIUM", subscription: null } : { xp: 412, streak: 3, lastPracticeAt: new Date() },
  );
  mockDb.userPathStepCompletion.findMany.mockResolvedValue([1, 2, 3].map((stepOrder) => ({ stepOrder, learningPath: { slug: "machine-a-cafe" } })));
  mockDb.userPathProgress.findMany.mockResolvedValue([]);
  mockDb.capAnnonce.findMany.mockResolvedValue([]);
  bonusRanges.mockReturnValue([]);
});

describe("s26 lancement : état des données au lancement", () => {
  it("bonus.json et ecouter.json vides : aucune promesse publiée (offre, CGU, E0, semaine 4)", () => {
    expect(bonusJson).toEqual([]);
    expect(ecouterJson).toEqual([]);
    expect(bonusTousPublies()).toBe(false);
    expect(ecouterPublie()).toBe(false);
  });
});

describe("s26 lancement : phrase de l'écart dans « Ton cap » (« les bonus s'ouvrent avec tes étapes… »)", () => {
  it("aucun bonus rangé : écart masqué malgré cap affiché 3 et déblocage 2", async () => {
    const corps = await (await GET()).json();
    expect(corps).toMatchObject({ capAffiche: 3, capDeblocage: 2, ecart: false, bonus: [] });
    expect(corps.annonce.bonus).toBeNull();
  });

  it("un bonus rangé : la phrase revient (et l'annonce du bonus aussi)", async () => {
    bonusRanges.mockReturnValue([BONUS_RANGE]);
    const corps = await (await GET()).json();
    expect(corps.ecart).toBe(true);
    expect(corps.annonce.bonus).toMatchObject({ cap: 2, titre: "Un passage" });
  });

  it("TonCap n'écrit la phrase que si `ecart` est vrai", () => {
    expect(html(createElement(TonCap, { cap: 3, serie: 1, ecart: false }))).not.toContain("bonus");
    expect(html(createElement(TonCap, { cap: 3, serie: 1, ecart: true }))).toContain("bonus");
  });
});

describe("s26 lancement : annonces de cap « Un bonus s'ouvre… »", () => {
  it("aucun bonus rangé : l'annonce ne porte que le cap", () => {
    const a = annoncesAFaire({ capAffiche: 3, capDeblocage: 3, dejaFaites: [], bonusRanges: [] });
    expect(a.cap).toBe(3);
    expect(a.bonus).toBeNull();
    expect(a.aMarquer.some((m) => m.type === "BONUS")).toBe(false);
  });

  it("un bonus rangé : il est annoncé", () => {
    expect(annoncesAFaire({ capAffiche: 3, capDeblocage: 3, dejaFaites: [], bonusRanges: [BONUS_RANGE] }).bonus).toEqual(BONUS_RANGE);
  });
});

describe("s26 lancement : raccourci « Tes bonus »", () => {
  it("liste vide : rien n'est rendu ; un bonus ouvert : le raccourci revient", () => {
    expect(html(createElement(TesBonus, { bonus: [] }))).toBe("");
    expect(html(createElement(TesBonus, { bonus: [{ cap: 2, href: "/mon-espace/bonus/bonus-cap-2" }] }))).toContain(frEspace(TEXTES_CAPS.bonus.raccourci));
  });
});

describe("s26 lancement : section « Écouter, repérer » de la Bibliothèque", () => {
  it("page liste (BlocVannes) : sans ligne, ni titre ni liste ; avec une ligne, la section revient", () => {
    expect(html(createElement(BlocVannes, { ecouter: [] }))).not.toContain(ECOUTER);
    expect(html(createElement(BlocVannes, { ecouter: [LIGNE_ECOUTER] }))).toContain(ECOUTER);
  });

  it("colonne dès 1024 (ColonneBibliotheque) : groupe vide absent, groupe non vide présent", () => {
    const technique = { ...LIGNE_ECOUTER, id: "c1", famille: "construction" as const };
    const sans = html(createElement(ColonneBibliotheque, { lignes: [technique], coin: null }));
    expect(sans).not.toContain(ECOUTER);
    const avec = html(createElement(ColonneBibliotheque, { lignes: [technique, { ...LIGNE_ECOUTER, famille: "ecouter" as const }], coin: null }));
    expect(avec).toContain(ECOUTER);
  });
});
