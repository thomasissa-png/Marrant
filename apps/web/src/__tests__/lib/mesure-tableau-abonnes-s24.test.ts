/**
 * @jest-environment node
 *
 * s24 lot 0 : lecture de la mesure (tableau « une ligne par abonné », §5.2 du brief espace client).
 * Lignes brutes telles que les rend la requête (requête exécutée sur Postgres par
 * `playwright/tests/local/mesure-usage-sql-s24.spec.ts`). Vérifie : aucun identifiant, lettres
 * « M- » distinctes des données s23, heures de Paris quel que soit le fuseau de la machine, cas par
 * cas sous 15 ABONNÉS entrés depuis la mesure (ou depuis l'activation), « x sur n » au-delà,
 * cohortes avant/après, filtre « depuis », comptes sans souscription annoncés.
 */
import {
  enDate,
  formaterDelai,
  heureParis,
  lettre,
  lignesAbonnes,
  lireDateParis,
  SQL_JSON,
  SQL_SANS_SOUSCRIPTION,
  SQL_TABLEAU_ABONNES,
  tableauAbonnes,
  type LigneBrute,
} from "@/lib/mesure/tableau-abonnes";

const NOW = new Date("2026-11-12T10:00:00Z");
const brute = (over: Partial<LigneBrute> = {}): LigneBrute => ({
  rang: 1, numero: 1, souscritLe: "2026-10-01T10:00:00+00:00", formule: "month",
  premierAcces: null, premierContenu: null, aha: null, joursPratiqueJ7: 0, bienvenue: false,
  clicResilier: null, resiliation: null, motif: null, renouvele: false, ...over,
});

describe("lignes", () => {
  it("délais, J7, bienvenue, clic « résilier » et 2e prélèvement", () => {
    const [a, b, c] = lignesAbonnes([
      brute({ premierAcces: "2026-10-01T10:04:00+00:00", aha: "2026-10-01T19:00:00+00:00", joursPratiqueJ7: 2, bienvenue: true, renouvele: true }),
      brute({ rang: 2, souscritLe: "2026-10-05T08:00:00+00:00", formule: "year", clicResilier: "2026-10-05T08:07:00+00:00", resiliation: "2026-10-05T08:10:00+00:00", motif: "too_expensive" }),
      brute({ rang: 1, numero: 2, souscritLe: new Date("2026-11-10T08:00:00Z") }),
    ], NOW);
    expect(a).toMatchObject({ abonne: "M-A", premierAccesMs: 4 * 60_000, joursPratiqueJ7: 2, bienvenue: true, actifDeuxiemePrelevement: "oui" });
    expect(b).toMatchObject({ abonne: "M-B", clicResilierMs: 7 * 60_000, resiliationMs: 10 * 60_000, motif: "too_expensive", actifDeuxiemePrelevement: "pas encore" });
    expect(c).toMatchObject({ abonne: "M-A2", joursPratiqueJ7: null, premierAccesMs: null });
    expect(lignesAbonnes([brute()], NOW)[0].actifDeuxiemePrelevement).toBe("non");
  });

  it("dates : texte sans fuseau lu en UTC, jamais en heure locale ; affichage en heure de Paris", () => {
    expect(enDate("2026-10-01 10:00:00")?.toISOString()).toBe("2026-10-01T10:00:00.000Z");
    expect(enDate("2026-10-01T12:00:00+02:00")?.toISOString()).toBe("2026-10-01T10:00:00.000Z");
    expect(heureParis(new Date("2026-10-01T22:30:00Z"))).toBe("02/10/2026 00:30");
    expect(heureParis(new Date("2026-12-01T22:30:00Z"))).toBe("01/12/2026 23:30");
  });

  it("formats et lettres propres au tableau", () => {
    expect(formaterDelai(4 * 60_000)).toBe("4 min");
    expect(formaterDelai(2 * 3_600_000 + 5 * 60_000)).toBe("2 h 05");
    expect(formaterDelai(3 * 86_400_000 + 1)).toBe("3 j");
    expect([1, 2, 26, 27].map(lettre)).toEqual(["M-A", "M-B", "M-Z", "M-AA"]);
  });
});

describe("règles de lecture (§5.2)", () => {
  it("moins de 15 abonnés : cas par cas, aucun chiffre agrégé ; heures de Paris ; comptes sans souscription annoncés", () => {
    const sortie = tableauAbonnes([brute(), brute({ rang: 2 })], NOW, { sansSouscription: 3 });
    expect(sortie).toContain("| M-A | 01/10/2026 12:00 |");
    expect(sortie).toContain("lecture cas par cas");
    expect(sortie).toContain("3 compte(s) Premium sans ligne de souscription");
    expect(sortie).toContain("sans lien avec les A à D");
    expect(sortie).not.toMatch(/%| sur \d/);
  });

  it("le seuil compte les ABONNÉS, pas les souscriptions (réabonnements)", () => {
    const lignes = Array.from({ length: 16 }, (_, i) => brute({ rang: (i % 8) + 1, numero: i < 8 ? 1 : 2 }));
    expect(tableauAbonnes(lignes, NOW)).toContain("8 abonné(s), lecture cas par cas");
  });

  it("15 abonnés et plus : « x sur n », jamais de pourcentage", () => {
    const lignes = Array.from({ length: 15 }, (_, i) =>
      brute({ rang: i + 1, premierAcces: i < 6 ? "2026-10-01T10:05:00+00:00" : null, renouvele: i < 9 }),
    );
    const sortie = tableauAbonnes(lignes, NOW);
    expect(sortie).toContain("accès à un contenu Premium dans les 10 minutes : 6 sur 15");
    expect(sortie).toContain("actif au 2e prélèvement : 9 sur 15");
    expect(sortie).not.toContain("%");
  });

  it("activation : 10 dernières avant (référence) et suivantes ; seuil calculé sur les abonnés d'après", () => {
    const avant = Array.from({ length: 12 }, (_, i) => brute({ rang: i + 1, souscritLe: `2026-10-${String(i + 1).padStart(2, "0")}T10:00:00+00:00` }));
    const apres = Array.from({ length: 3 }, (_, i) => brute({ rang: 13 + i, souscritLe: `2026-11-0${i + 2}T10:00:00+00:00` }));
    const sortie = tableauAbonnes([...avant, ...apres], NOW, { activation: new Date("2026-11-01T00:00:00Z") });
    const reference = sortie.slice(sortie.indexOf("## Référence"), sortie.indexOf("## Après"));
    expect(reference).not.toContain("| M-B |");
    expect(reference).toContain("| M-C |");
    expect(reference).toContain("| M-L |");
    expect(sortie).toContain("Après l'activation : 3 abonné(s), lecture cas par cas");
  });

  it("depuis : souscriptions antérieures écartées (facteur confondant de l'onboarding du 08/11)", () => {
    const sortie = tableauAbonnes([brute(), brute({ rang: 2, souscritLe: "2026-11-09T10:00:00+00:00" })], NOW, {
      depuis: new Date("2026-11-08T00:00:00Z"),
    });
    expect(sortie).not.toContain("| M-A |");
    expect(sortie).toContain("| M-B |");
  });
});

describe("requêtes", () => {
  it("aucun identifiant de compte ni e-mail en sortie, aucune écriture", () => {
    const select = SQL_TABLEAU_ABONNES.slice(SQL_TABLEAU_ABONNES.lastIndexOf("SELECT\n"));
    expect(select).not.toMatch(/"userId" AS|s\."userId",\n|email/i);
    for (const sql of [SQL_TABLEAU_ABONNES, SQL_SANS_SOUSCRIPTION, SQL_JSON]) {
      expect(sql).not.toMatch(/\b(INSERT|UPDATE|DELETE|ALTER|DROP)\b|email/i);
    }
    expect(SQL_SANS_SOUSCRIPTION).toMatch(/count\(\*\)/);
  });

  it("dates rendues avec fuseau (timestamptz) : aucun pilote ne les relit en heure locale", () => {
    expect(SQL_TABLEAU_ABONNES).toContain(`(s.souscrit_le AT TIME ZONE 'UTC') AS "souscritLe"`);
    expect(SQL_TABLEAU_ABONNES).toContain("AT TIME ZONE 'Europe/Paris')::date");
  });
});

describe("options de lecture en heure de Paris (QA tour 2, correction 4)", () => {
  it("date seule = minuit à Paris (hiver, été, jours de changement d'heure) ; ISO avec fuseau inchangée", () => {
    expect(lireDateParis("2026-11-08")?.toISOString()).toBe("2026-11-07T23:00:00.000Z");
    expect(lireDateParis("2026-07-01")?.toISOString()).toBe("2026-06-30T22:00:00.000Z");
    expect(lireDateParis("2026-03-29")?.toISOString()).toBe("2026-03-28T23:00:00.000Z");
    expect(lireDateParis("2026-10-25")?.toISOString()).toBe("2026-10-24T22:00:00.000Z");
    expect(lireDateParis("2026-11-08T12:00:00Z")?.toISOString()).toBe("2026-11-08T12:00:00.000Z");
    expect(lireDateParis("pas une date")).toBeNull();
  });

  it("--depuis 2026-11-08 garde une souscription de 00 h 30 à Paris (23 h 30 UTC la veille)", () => {
    const sortie = tableauAbonnes(
      [brute({ souscritLe: "2026-11-07T23:30:00+00:00" }), brute({ rang: 2, souscritLe: "2026-11-07T22:30:00+00:00" })],
      NOW,
      { depuis: lireDateParis("2026-11-08") },
    );
    expect(sortie).toContain("| M-A | 08/11/2026 00:30 |");
    expect(sortie).not.toContain("| M-B |");
  });
});

describe("abonnés de l'application (QA tour 2, correction 5)", () => {
  it("renouvellement reçu = « oui » ; sans renouvellement après un mois = « inconnu (application) », exclu du « x sur n »", () => {
    const [a, b, c] = lignesAbonnes(
      [brute({ formule: "iap", renouvele: true }), brute({ rang: 2, formule: "iap" }), brute({ rang: 3, formule: "iap", souscritLe: "2026-11-10T10:00:00+00:00" })],
      NOW,
    );
    expect(a.actifDeuxiemePrelevement).toBe("oui");
    expect(b.actifDeuxiemePrelevement).toBe("inconnu (application)");
    expect(c.actifDeuxiemePrelevement).toBe("pas encore");
    const lignes = Array.from({ length: 15 }, (_, i) => brute({ rang: i + 1, formule: i < 5 ? "iap" : "month", renouvele: i >= 10 }));
    expect(tableauAbonnes(lignes, NOW)).toContain("actif au 2e prélèvement : 5 sur 10");
  });
});
