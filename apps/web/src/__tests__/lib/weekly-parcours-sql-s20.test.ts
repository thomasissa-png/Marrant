/**
 * s20 : le rapport du lundi 12/10 affichait « Section partielle » pour les
 * parcours. Un paramètre non typé suivi de `- interval` est lu par Postgres
 * comme un intervalle (`timestamp >= interval` : erreur 42883). Tout paramètre
 * combiné à un intervalle doit être typé (`::timestamp`).
 */
import { readFileSync } from "fs";
import { join } from "path";

describe("rapport du lundi, section parcours : SQL", () => {
  const src = readFileSync(join(__dirname, "../../lib/analytics/weekly-parcours.ts"), "utf8");

  it("aucun paramètre non typé suivi d'un intervalle", () => {
    expect(src).not.toMatch(/\$\{\w+\}\s*[-+]\s*interval/);
  });

  it("la borne des 28 jours est typée timestamp", () => {
    expect(src).toContain("${startAt}::timestamp - interval '28 days'");
  });
});
