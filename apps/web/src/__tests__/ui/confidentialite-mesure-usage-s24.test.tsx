/**
 * s24 (mesure d'usage, bloc 1 de `docs/legal/espace-client-s24-phrases.md`) : la phrase de la partie 3
 * et la puce de la partie 2 sont publiées MOT POUR MOT (relues dans le fichier @legal, pas recopiées
 * dans le test), l'ancienne phrase « de façon globale » a disparu, et la date « Dernière mise à jour »
 * tient compte de la mise en ligne de la mesure. Aucun tiret cadratin.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen } from "@testing-library/react";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { MESURE_USAGE_DATE_TEXTES } from "@/config/mesure-usage";
import { dateTextesJuridiques, servicesTextesJuridiques } from "@/lib/date-textes-juridiques";

/** Citations du bloc 1 (lignes « > ») : actuelle, proposée (partie 3), puce (partie 2). */
function citationsBloc1(): string[] {
  const md = readFileSync(join(__dirname, "../../../../../docs/legal/espace-client-s24-phrases.md"), "utf8");
  const bloc = md.slice(md.indexOf("## Bloc 1"), md.indexOf("## Bloc 2"));
  return bloc
    .split("\n")
    .filter((l) => l.startsWith("> "))
    .map((l) => l.slice(2).trim());
}

const texte = () => (document.body.textContent ?? "").replace(/⁠/g, "");

describe("confidentialité : mesure d'usage (s24, bloc 1 @legal)", () => {
  const [actuelle, proposee, puce] = citationsBloc1();

  it("le fichier @legal donne bien 3 citations (actuelle, partie 3, puce de la partie 2)", () => {
    expect(actuelle).toContain("de façon globale");
    expect(proposee).toMatch(/^Comprendre où les abonnés/);
    expect(puce).toMatch(/^Usage du service/);
  });

  it("partie 3 : phrase remplacée mot pour mot, l'ancienne a disparu", () => {
    render(<ConfidentialitePage />);
    expect(texte()).toContain(proposee);
    expect(texte()).not.toContain(actuelle);
    expect(texte()).not.toContain("de façon globale, où les membres");
  });

  it("partie 2 : puce ajoutée mot pour mot, après l'abonnement", () => {
    render(<ConfidentialitePage />);
    const li = screen.getByTestId("confidentialite-mesure-usage");
    expect((li.textContent ?? "").replace(/⁠/g, "")).toBe(puce);
    expect(li.previousElementSibling?.textContent).toMatch(/^Abonnement : formule, statut/);
    expect(li.closest("section")?.querySelector("h2")?.textContent).toMatch(/^2\. /);
  });

  it("« Dernière mise à jour » tient compte de la mise en ligne de la mesure", () => {
    render(<ConfidentialitePage />);
    expect(MESURE_USAGE_DATE_TEXTES).toMatch(/^\d{1,2} [a-zéû]+ \d{4}$/);
    const attendue = dateTextesJuridiques([...servicesTextesJuridiques(), { ouvert: true, date: MESURE_USAGE_DATE_TEXTES }]);
    expect(texte()).toContain(`Dernière mise à jour : ${attendue}`);
  });

  it("aucun tiret cadratin dans les ajouts", () => {
    expect(`${proposee}${puce}`).not.toContain("—");
  });
});
