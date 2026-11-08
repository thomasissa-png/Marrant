/**
 * Confidentialité, puce C8 « e-mails d'accueil » (s23, texte @legal du 08/11/2026, adapté le 08/11 à trois
 * e-mails, E1b approuvé ; le test le relit dans `docs/legal/onboarding-e1-resilies-s23.md`) : publiée
 * SEULEMENT interrupteur ONBOARDING_PREMIUM_OUVERT ouvert. Fermé : page strictement identique
 * à la production (texte et date). Page d'arrêt : textes validés par Thomas le 08/11/2026.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen } from "@testing-library/react";

jest.mock("@/config/onboarding-premium", () => ({
  ...jest.requireActual("@/config/onboarding-premium"),
  get ONBOARDING_PREMIUM_OUVERT() {
    return (globalThis as { __ONBOARDING_OUVERT__?: boolean }).__ONBOARDING_OUVERT__ === true;
  },
}));

import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { dateTextesJuridiques } from "@/lib/date-textes-juridiques";
import { CONFIDENTIALITE_ONBOARDING_PREMIUM } from "@/config/textes/onboarding-premium";

const drapeau = globalThis as { __ONBOARDING_OUVERT__?: boolean };
const texte = () => document.body.textContent?.replace(/\u2060/g, "").replace(/[\u00A0\u202F]/g, " ") ?? "";

const C8 =
  "Après ton abonnement, on t’envoie jusqu’à trois e-mails d’accueil, au bout de 5, 12 puis 21 jours, tant que ton accès est ouvert : exécution du contrat. Tu les arrêtes en un clic depuis le bas de chaque e-mail, sans te connecter, ou en répondant à l’e-mail ; ils ne contiennent ni pixel ni suivi des clics.";

function rendu(ouvert: boolean): { html: string; texte: string } {
  drapeau.__ONBOARDING_OUVERT__ = ouvert;
  const { container, unmount } = render(<ConfidentialitePage />);
  const r = { html: container.innerHTML, texte: texte() };
  unmount();
  return r;
}

afterEach(() => {
  drapeau.__ONBOARDING_OUVERT__ = false;
});

describe("confidentialité : e-mails d'accueil Premium (C8)", () => {
  it("texte de la puce = texte @legal mot pour mot, sans tiret cadratin", () => {
    expect(CONFIDENTIALITE_ONBOARDING_PREMIUM).toBe(C8);
    const legal = readFileSync(join(__dirname, "../../../../../docs/legal/onboarding-e1-resilies-s23.md"), "utf8");
    expect(legal).toContain(`**Adapté le 08/11 : trois e-mails, E1b approuvé** (texte en vigueur, remplace le précédent) : \`${C8}\``);
    expect(CONFIDENTIALITE_ONBOARDING_PREMIUM).not.toContain("—");
  });

  it("fermé : aucune puce, date de production, page identique sans la puce", () => {
    const ferme = rendu(false);
    expect(ferme.texte).not.toContain("e-mails d’accueil");
    expect(ferme.texte).not.toContain("8 novembre 2026");
    expect(ferme.texte).toContain(`Dernière mise à jour : ${dateTextesJuridiques()}`);
    drapeau.__ONBOARDING_OUVERT__ = false;
    render(<ConfidentialitePage />);
    expect(screen.queryAllByTestId("confidentialite-onboarding-premium")).toHaveLength(0);
  });

  it("ouvert : puce juste après le rappel de parcours, date des ajouts ; seul diff avec le fermé", () => {
    const ferme = rendu(false);
    drapeau.__ONBOARDING_OUVERT__ = true;
    render(<ConfidentialitePage />);
    const puce = screen.getByTestId("confidentialite-onboarding-premium");
    expect(puce.textContent?.replace(/\u2060/g, "").replace(/[\u00A0\u202F]/g, " ")).toBe(C8);
    expect(puce.previousElementSibling?.textContent).toMatch(/^T’envoyer chaque semaine un rappel de ton parcours/);
    const t = texte();
    expect(t).toContain(C8);
    expect(t).toContain("Dernière mise à jour : 8 novembre 2026");
    // Hors puce et date, le texte ouvert est celui du fermé.
    const sansAjout = t.replace(C8, "").replace("8 novembre 2026", dateTextesJuridiques());
    expect(sansAjout).toBe(ferme.texte);
  });

  it("page d'arrêt : commentaire validé, plus de mention PROVISOIRE", () => {
    const src = readFileSync(join(__dirname, "../../config/textes/onboarding-premium.ts"), "utf8");
    const bloc = src.slice(src.lastIndexOf("/**", src.indexOf("export const TEXTES_ARRET_ONBOARDING")), src.indexOf("export const TEXTES_ARRET_ONBOARDING"));
    expect(bloc).toContain("validés par Thomas le 08/11/2026");
    expect(bloc).not.toMatch(/PROVISOIRE|à faire valider/);
  });
});
