/**
 * Lot D10b (s24) : la ligne des bonus (T1, page d'offre) et la puce des bonus (T3, e-mail E0) ne sont
 * servies que si les 4 fiches bonus sont publiées (`data/espace/bonus.json` complet et valide), interrupteur
 * ouvert compris (relecture @reviewer : « un bonus ne s'ouvre que si sa fiche est rangée »). Fermé : rien
 * ne change. Interrupteur et publication simulés ici (jamais le code livré).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen } from "@testing-library/react";

const etat = globalThis as { __D10B_OUVERT__?: boolean; __D10B_BONUS__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D10B_OUVERT__?: boolean }).__D10B_OUVERT__ ?? false;
  },
}));
jest.mock("@/lib/espace/bonus-publies", () => ({
  ...jest.requireActual("@/lib/espace/bonus-publies"),
  bonusTousPublies: () => (globalThis as { __D10B_BONUS__?: boolean }).__D10B_BONUS__ ?? false,
}));
jest.mock("@/lib/espace/ancien-abonne", () => ({ lignesAncienAbonne: async () => [] }));
jest.mock("@/lib/session-serveur", () => ({ lireConnecteServeur: async () => false }));
jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/hooks/use-content-stats", () => ({ useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }) }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => <div data-testid="faq-section" /> }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));

import AbonnementPage from "@/app/(dashboard)/abonnement/page";
import { LIGNE_BONUS_OFFRE } from "@/config/textes/espace-textes-en-ligne";
import { envNeutre } from "../helpers/env-neutre";

envNeutre("STRIPE_PREMIUM_ANNUAL_PRICE_ID", "NEXTAUTH_URL");
const { bonusTousPublies, CAPS_A_BONUS } = jest.requireActual<typeof import("@/lib/espace/bonus-publies")>("@/lib/espace/bonus-publies");
const SRC = join(__dirname, "..", "..");
const passage = JSON.parse(readFileSync(join(SRC, "lib/espace/fixtures/bonus-factice-cap-2.json"), "utf8")) as Record<string, unknown>;
const bonusDuCap = (cap: number) =>
  cap === 5
    ? { ...passage, id: "fixture-bonus-cap-5", nature: "coulisses", cap: 5, contenu: { blocs: [{ titre: "Bloc factice", texte: "Texte factice." }] }, geste: undefined }
    : { ...passage, id: `fixture-bonus-cap-${cap}`, cap };
const QUATRE = [2, 3, 4, 5].map(bonusDuCap).map((b) => JSON.parse(JSON.stringify(b)) as unknown);

beforeEach(() => {
  etat.__D10B_OUVERT__ = false;
  etat.__D10B_BONUS__ = false;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) }) as unknown as typeof fetch;
});

describe("`bonusTousPublies` : vrai seulement avec les 4 bonus valides", () => {
  it("fichier servi aujourd'hui (vide) : faux", () => {
    expect(bonusTousPublies()).toBe(false);
    expect(JSON.parse(readFileSync(join(SRC, "data/espace/bonus.json"), "utf8"))).toEqual([]);
  });
  it("les 4 caps 2 à 5, valides : vrai", () => {
    expect(CAPS_A_BONUS).toEqual([2, 3, 4, 5]);
    expect(bonusTousPublies(QUATRE)).toBe(true);
  });
  it("3 sur 4, ou un fichier invalide (cap en double, champ manquant, pas une liste) : faux", () => {
    expect(bonusTousPublies(QUATRE.slice(0, 3))).toBe(false);
    expect(bonusTousPublies([...QUATRE.slice(0, 3), QUATRE[0]])).toBe(false);
    expect(bonusTousPublies([...QUATRE.slice(0, 3), { ...(QUATRE[3] as object), titre: undefined }])).toBe(false);
    expect(bonusTousPublies({})).toBe(false);
  });
});

describe("T1, page d'offre : ligne des bonus", () => {
  const ligne = () => screen.queryByTestId("abonnement-ligne-bonus");

  it.each([
    ["fermé, bonus absents", false, false, false],
    ["fermé, bonus publiés", false, true, false],
    ["ouvert, bonus absents (texte actuel)", true, false, false],
    ["ouvert, bonus publiés", true, true, true],
  ])("%s", async (_nom, ouvert, publies, attendue) => {
    etat.__D10B_OUVERT__ = ouvert;
    etat.__D10B_BONUS__ = publies;
    render(await AbonnementPage({ searchParams: {} }));
    if (attendue) expect(ligne()).toHaveTextContent(LIGNE_BONUS_OFFRE.replace(/'/g, "’"));
    else expect(ligne()).toBeNull();
  });
});

describe("T3, e-mail E0 : la condition est calculée côté serveur par l'appelant", () => {
  it("`conditionsBienvenue` passe `bonus: bonusTousPublies()` ; `paiement.ts` (lu aussi par le navigateur) n'importe pas les fiches", () => {
    expect(readFileSync(join(SRC, "lib/emails/paiement-notifications.ts"), "utf8")).toContain("bonus: bonusTousPublies() }");
    const paiement = readFileSync(join(SRC, "config/textes/paiement.ts"), "utf8");
    expect(paiement).toContain("ESPACE_CLIENT_PUBLIE && v.bonus === true ? PUCE_BONUS_E0 : null");
    expect(paiement).not.toMatch(/bonus-publies|data\/espace/);
  });
});
