/**
 * Politique de confidentialité, ajouts « résiliation » (s23, @legal O2 et O3) : publiés SEULEMENT
 * interrupteur RESILIATION_PAGE_OUVERTE ouvert. Fermé : page strictement inchangée (ni texte, ni
 * ancre, ni date). Textes mot pour mot de la revue légale, durée provisoire de 24 mois.
 */
import { render, screen } from "@testing-library/react";

// 08/11 : onboarding Premium ouvert (puce C8 datée du 8 novembre). Ce fichier vérifie sa propre
// fonction et sa propre date : onboarding fermé ici (état ouvert : `confidentialite-onboarding-premium-s23`).
// s24 : la date de mise en ligne de la mesure d'usage est neutralisée pour isoler ce qui est testé ici.
jest.mock("@/config/mesure-usage", () => ({ MESURE_USAGE_DATE_TEXTES: "" }));
jest.mock("@/config/onboarding-premium", () => ({
  ...jest.requireActual("@/config/onboarding-premium"),
  ONBOARDING_PREMIUM_OUVERT: false,
}));
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __RESILIATION_OUVERTE__?: boolean }).__RESILIATION_OUVERTE__ === true;
  },
}));

import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { dateTextesJuridiques } from "@/lib/date-textes-juridiques";
import { CONFIDENTIALITE_RESILIATION } from "@/config/textes/resiliation";
import { RESILIATION_CONSERVATION_MOIS, RESILIATION_DELAI_EQUIPE } from "@/config/resiliation";

const drapeau = globalThis as { __RESILIATION_OUVERTE__?: boolean };
const texte = () => document.body.textContent?.replace(/⁠/g, "").replace(/ | /g, " ") ?? "";

beforeEach(() => {
  drapeau.__RESILIATION_OUVERTE__ = false;
});

describe("confidentialité : résiliation", () => {
  it("valeurs provisoires uniques : 24 mois, « sous un jour ouvré »", () => {
    expect(RESILIATION_CONSERVATION_MOIS).toBe(24);
    expect(RESILIATION_DELAI_EQUIPE).toBe("sous un jour ouvré");
  });

  it("fermé : aucun ajout, aucune ancre #resiliation, date inchangée", () => {
    render(<ConfidentialitePage />);
    expect(screen.queryAllByTestId("confidentialite-resiliation")).toHaveLength(0);
    expect(document.getElementById("resiliation")).toBeNull();
    // s24 : la mention de la mesure d'usage (bloc 1 @legal, sans interrupteur) cite la résiliation
    // programmée ; hors elle, la page fermée ne parle toujours pas de résiliation.
    const sansMesure = texte()
      .replace(screen.getByTestId("confidentialite-mesure-usage").textContent ?? "", "")
      .replace("Comprendre où les abonnés avancent ou décrochent (souscription, parcours, résiliation)", "");
    expect(sansMesure).not.toMatch(/résiliation/i);
    expect(texte()).toContain(`Dernière mise à jour : ${dateTextesJuridiques()}`);
  });

  it("ouvert : parties 2, 3, 6 et 7 mot pour mot, ancre sur la partie 2, date des ajouts", () => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    render(<ConfidentialitePage />);
    expect(screen.getAllByTestId("confidentialite-resiliation")).toHaveLength(4);
    const t = texte();
    expect(t).toContain(
      "Résiliation, si tu réponds à la question facultative : les raisons cochées, ton mot libre, ta formule (mensuelle ou annuelle), l’ancienneté de ton abonnement en jours et la date. Ni ton adresse e-mail ni ton adresse IP ne sont ajoutées.",
    );
    expect(t).toContain(
      "Comprendre pourquoi des abonnés résilient, pour améliorer le site : intérêt légitime. Ta réponse est facultative et tu peux t’y opposer (voir la partie 7).",
    );
    expect(t).toContain(
      "Ta réponse à la question de la résiliation est gardée 24 mois, puis effacée. Si tu supprimes ton compte, ton mot libre est effacé et tes raisons cochées sont détachées de ton compte.",
    );
    expect(t).toContain("Tu peux demander l’accès ou l’effacement de ta réponse à la résiliation en écrivant à contact@deviens-marrant.fr.");
    expect(document.getElementById("resiliation")?.textContent?.replace(/⁠/g, "")).toContain("Résiliation, si tu réponds");
    expect(t).toContain("Dernière mise à jour : 6 novembre 2026");
  });

  it("zéro tiret cadratin dans les ajouts", () => {
    expect(Object.values(CONFIDENTIALITE_RESILIATION).join(" ")).not.toContain("—");
  });
});
