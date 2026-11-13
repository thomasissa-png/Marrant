/**
 * @jest-environment node
 *
 * Lot D11b (s24), avis @legal G9 (`docs/legal/espace-ligne-bonus-g9-s24.md`, point 10 et « Clôture (13/11) ») :
 * dernier alinéa de l'article 3 des CGU sur les bonus, rendu seulement avec la ligne T1 de l'offre, c'est-à-dire
 * interrupteur ouvert ET les 4 bonus publiés (`bonusTousPublies`). Fermé, ou bonus non publiés : la page est celle
 * d'aujourd'hui au caractère près. Interrupteur et publication simulés ici (jamais le code livré).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D11B_OUVERT__?: boolean }).__D11B_OUVERT__ ?? false;
  },
}));
jest.mock("@/lib/espace/bonus-publies", () => ({
  ...jest.requireActual("@/lib/espace/bonus-publies"),
  bonusTousPublies: () => (globalThis as { __D11B_BONUS__?: boolean }).__D11B_BONUS__ ?? false,
}));

import CguPage from "@/app/(dashboard)/cgu/page";
import { CGU_BONUS_ARTICLE_3 } from "@/config/textes/espace-textes-en-ligne";
import { frTypo } from "@/lib/fr-typo";

const etat = globalThis as { __D11B_OUVERT__?: boolean; __D11B_BONUS__?: boolean };
const rendu = (ouvert: boolean, publies: boolean) => {
  etat.__D11B_OUVERT__ = ouvert;
  etat.__D11B_BONUS__ = publies;
  return renderToStaticMarkup(<CguPage />);
};
const html = (t: string) => frTypo(t).replace(/'/g, "&#x27;");
const ALINEA = `<p class="mt-2" data-cgu-bonus="">${html(CGU_BONUS_ARTICLE_3)}</p>`;
const DOC_LEGAL = readFileSync(join(__dirname, "../../../../../docs/legal/espace-ligne-bonus-g9-s24.md"), "utf8");

afterAll(() => {
  etat.__D11B_OUVERT__ = false;
  etat.__D11B_BONUS__ = false;
});

describe("CGU, article 3 : alinéa des bonus (@legal G9)", () => {
  it("texte = version finale de @legal, phrase 1 de la clôture du 13/11, mot pour mot ; ni tiret cadratin ni émoji", () => {
    expect(CGU_BONUS_ARTICLE_3.startsWith("Dans ton espace, ta pratique te fait franchir des caps. ")).toBe(true);
    expect(DOC_LEGAL).toContain(`« ${CGU_BONUS_ARTICLE_3} »`);
    expect(DOC_LEGAL).toContain("Phrase 1 remplacée par « Dans ton espace, ta pratique te fait franchir des caps. »");
    expect(CGU_BONUS_ARTICLE_3).not.toMatch(/—|\p{Extended_Pictographic}/u);
  });

  it("fermé (bonus publiés ou non) : page identique au caractère près, aucun alinéa", () => {
    const reference = rendu(false, false);
    expect(rendu(false, true)).toBe(reference);
    expect(reference).not.toContain("data-cgu-bonus");
    expect(reference).not.toContain(html("ta pratique te fait franchir des caps"));
  });

  it("ouvert, bonus non publiés (aujourd'hui, `bonus.json` vide) : aucun alinéa", () => {
    expect(rendu(true, false)).not.toContain("data-cgu-bonus");
  });

  it("ouvert ET 4 bonus publiés : la seule différence est l'alinéa, en dernier de l'article 3 (avant l'article 4)", () => {
    const sans = rendu(true, false);
    const avec = rendu(true, true);
    expect(avec.replace(ALINEA, "")).toBe(sans);
    const article3 = avec.slice(avec.indexOf("3. Offres et tarifs"), avec.indexOf("4. Contenu utilisateur"));
    expect(article3).toMatch(new RegExp(`${ALINEA.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</section>`));
  });
});
