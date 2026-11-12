/**
 * @jest-environment node
 *
 * s24 lot 0 : lecture de la mesure (tableau « une ligne par abonné », §5.2 du brief espace client).
 * Lignes brutes telles que les rend la requête (vérifiée sur base jetable locale) : aucun
 * identifiant, lettres dans l'ordre des souscriptions, cas par cas sous 15, « x sur n » au-delà.
 */
import { formaterDelai, lettre, lignesAbonnes, SQL_TABLEAU_ABONNES, tableauAbonnes, type LigneBrute } from "@/lib/mesure/tableau-abonnes";

const NOW = new Date("2026-11-12T10:00:00Z");
const brute = (over: Partial<LigneBrute> = {}): LigneBrute => ({
  rang: 1, numero: 1, souscritLe: "2026-10-01T10:00:00", formule: "month",
  premierAcces: null, premierContenu: null, aha: null, joursPratiqueJ7: 0,
  resiliation: null, motif: null, renouvele: false, ...over,
});

describe("tableau une ligne par abonné", () => {
  it("délais, J7 et 2e prélèvement", () => {
    const [a, b, c] = lignesAbonnes([
      brute({ premierAcces: "2026-10-01T10:04:00", aha: "2026-10-01T19:00:00", joursPratiqueJ7: 2, renouvele: true }),
      brute({ rang: 2, souscritLe: "2026-10-05T08:00:00", formule: "year", resiliation: "2026-10-05T08:10:00", motif: "too_expensive" }),
      brute({ rang: 1, numero: 2, souscritLe: new Date("2026-11-10T08:00:00Z") }),
    ], NOW);
    expect(a).toMatchObject({ abonne: "A", premierAccesMs: 4 * 60_000, joursPratiqueJ7: 2, actifDeuxiemePrelevement: "oui" });
    expect(b).toMatchObject({ abonne: "B", resiliationMs: 10 * 60_000, motif: "too_expensive", actifDeuxiemePrelevement: "pas encore" });
    expect(c).toMatchObject({ abonne: "A2", joursPratiqueJ7: null, premierAccesMs: null });
    expect(lignesAbonnes([brute()], NOW)[0].actifDeuxiemePrelevement).toBe("non");
  });

  it("formats", () => {
    expect(formaterDelai(4 * 60_000)).toBe("4 min");
    expect(formaterDelai(2 * 3_600_000 + 5 * 60_000)).toBe("2 h 05");
    expect(formaterDelai(3 * 86_400_000 + 1)).toBe("3 j");
    expect([1, 2, 26, 27].map(lettre)).toEqual(["A", "B", "Z", "AA"]);
  });

  it("moins de 15 : cas par cas, aucun pourcentage ni « x sur n »", () => {
    const sortie = tableauAbonnes([brute(), brute({ rang: 2 })], NOW);
    expect(sortie).toContain("| A | 2026-10-01 10:00 |");
    expect(sortie).toContain("lecture cas par cas");
    expect(sortie).not.toMatch(/%| sur \d/);
  });

  it("15 et plus : « x sur n », jamais de pourcentage", () => {
    const lignes = Array.from({ length: 15 }, (_, i) =>
      brute({ rang: i + 1, premierAcces: i < 6 ? "2026-10-01T10:05:00" : null, renouvele: i < 9 }),
    );
    const sortie = tableauAbonnes(lignes, NOW);
    expect(sortie).toContain("accès à un contenu Premium dans les 10 minutes : 6 sur 15");
    expect(sortie).toContain("actif au 2e prélèvement : 9 sur 15");
    expect(sortie).not.toContain("%");
  });

  it("la requête ne sort aucun identifiant de compte et ne lit que les tables de mesure", () => {
    const select = SQL_TABLEAU_ABONNES.slice(SQL_TABLEAU_ABONNES.lastIndexOf("SELECT\n"));
    expect(select).not.toMatch(/"userId" AS|s\."userId",\n|email/i);
    expect(SQL_TABLEAU_ABONNES).not.toMatch(/INSERT|UPDATE|DELETE|"User"\b|email/i);
  });
});
