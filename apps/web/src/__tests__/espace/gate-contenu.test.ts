/**
 * @jest-environment node
 *
 * Porte G2 du plan s24 (§3 lot D1, §4) : comptage du contenu avant l'ouverture de l'espace.
 * 163 fiches neuves (par type : 60, 12, 8, 12, 30, 12, 10, 5, 6, 8) et 4 bonus à part (un par
 * cap, 2 à 5). Exécuté SEULEMENT avec `GATE_CONTENU=1` (`GATE_CONTENU=1 npx jest gate-contenu`),
 * jamais dans la CI courante : les fichiers sont vides tant que les lots de contenu (§5) ne sont
 * pas importés.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { FICHIERS_ESPACE, FICHIER_BONUS, VOLUMES_V1, VOLUME_BONUS, validerBonus, validerFichier } from "@/lib/espace/fiches-schema";

const DATA = join(__dirname, "..", "..", "data", "espace");
const lire = (nom: string): unknown => JSON.parse(readFileSync(join(DATA, `${nom}.json`), "utf8"));
const decrire = process.env.GATE_CONTENU === "1" ? describe : describe.skip;

decrire("porte G2 : contenu complet (GATE_CONTENU=1)", () => {
  it.each(Object.entries(FICHIERS_ESPACE))("%s.json : volume V1 atteint", (nom, type) => {
    expect(validerFichier(type, lire(nom))).toHaveLength(VOLUMES_V1[type]);
  });

  it("163 fiches neuves au total", () => {
    const total = Object.entries(FICHIERS_ESPACE).reduce((s, [nom, type]) => s + validerFichier(type, lire(nom)).length, 0);
    expect(total).toBe(163);
  });

  it("4 bonus à part, un par cap de 2 à 5", () => {
    const bonus = validerBonus(lire(FICHIER_BONUS));
    expect(bonus).toHaveLength(VOLUME_BONUS);
    expect(bonus.map((b) => b.cap).sort()).toEqual([2, 3, 4, 5]);
  });
});
