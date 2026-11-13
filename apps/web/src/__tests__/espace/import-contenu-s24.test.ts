/**
 * @jest-environment node
 *
 * Import du contenu de l'espace (s24) : les JSON servis sont EXACTEMENT la sortie de
 * `scripts/importer-fiches.ts` (aucune fiche écrite à la main), chaque réplique reprise est
 * identique à sa source, et les 5 entrées du quiz existent sous les identifiants du premier pas.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { construireImport, enJson } from "../../../scripts/importer-fiches/construire";
import { ENTREES_QUIZ } from "@/lib/espace/premier-pas";

const DATA = join(__dirname, "..", "..", "data", "espace");
const resultat = construireImport();

describe("import du contenu validé (docs/copy/espace)", () => {
  it.each([...resultat.parFichier.keys()])("%s.json est la sortie de l'import, au caractère près", (nom) => {
    expect(readFileSync(join(DATA, `${nom}.json`), "utf8")).toBe(enJson(resultat.parFichier.get(nom) ?? []));
  });

  it("chaque réplique reprise (jeux, bilans) est identique à sa source", () => {
    expect(resultat.controles.length).toBeGreaterThan(0);
    expect(resultat.controles.filter((c) => !c.ok)).toEqual([]);
  });

  it("les 5 situations d'entrée du quiz sont importées sous les identifiants du premier pas, au palier 1", () => {
    const situations = resultat.parFichier.get("situations") ?? [];
    for (const id of Object.values(ENTREES_QUIZ)) {
      expect(situations.find((s) => s.id === id)?.palier).toBe("P1");
    }
  });

  it("les jeux « Quelle réplique ? » renvoient à une situation importée", () => {
    const ids = new Set((resultat.parFichier.get("situations") ?? []).map((s) => s.id));
    const reprises = (resultat.parFichier.get("jeux") ?? []).flatMap((j) => (j.type === "jeu" ? (j.contenu.situationsReprises ?? []) : []));
    expect(reprises.length).toBe(6);
    for (const id of reprises) expect(ids.has(id)).toBe(true);
  });

  it("les fichiers hors import (Écouter, bonus) restent vides", () => {
    for (const nom of ["ecouter", "bonus"]) expect(JSON.parse(readFileSync(join(DATA, `${nom}.json`), "utf8"))).toEqual([]);
  });
});
