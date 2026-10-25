/**
 * @jest-environment node
 *
 * Lettre s21 : calendrier d'envoi (décision de Thomas du 17/10). Chaque numéro
 * part le premier jeudi du mois à 8 h, heure de Paris, jamais avant sa date
 * plancher (sinon : premier jeudi qui suit la date plancher, même mois).
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import { dateEnvoiLettre } from "@/lib/lettre/envoi";
import { numeroSchema } from "@/lib/lettre/numeros";

const iso = (d: Date | null) => d?.toISOString() ?? null;

describe("dateEnvoiLettre : premier jeudi du mois à 8 h (Paris)", () => {
  it("heure d'hiver (UTC+1) : 8 h Paris = 7 h UTC", () => {
    expect(iso(dateEnvoiLettre("2026-12"))).toBe("2026-12-03T07:00:00.000Z");
    expect(iso(dateEnvoiLettre("2027-01"))).toBe("2027-01-07T07:00:00.000Z");
    expect(iso(dateEnvoiLettre("2027-03"))).toBe("2027-03-04T07:00:00.000Z");
  });

  it("heure d'été (UTC+2) : 8 h Paris = 6 h UTC", () => {
    expect(iso(dateEnvoiLettre("2027-04"))).toBe("2027-04-01T06:00:00.000Z");
    expect(iso(dateEnvoiLettre("2027-10"))).toBe("2027-10-07T06:00:00.000Z");
  });

  it("le 1er du mois est un jeudi : envoi le 1er", () => {
    expect(iso(dateEnvoiLettre("2027-07"))).toBe("2027-07-01T06:00:00.000Z");
  });

  it("toujours un jeudi, toujours 8 h à Paris, jamais après le 7 du mois", () => {
    const jour = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    for (let an = 2026; an <= 2028; an++) {
      for (let mois = 1; mois <= 12; mois++) {
        const d = dateEnvoiLettre(`${an}-${String(mois).padStart(2, "0")}`) as Date;
        const [nom, quantieme, heure] = jour.format(d).replace(" à", "").split(" ");
        expect(nom).toBe("jeudi");
        expect(Number(quantieme)).toBeLessThanOrEqual(7);
        expect(heure).toBe("08:00");
      }
    }
  });
});

describe("dateEnvoiLettre : date plancher", () => {
  it("plancher avant ou le jour du premier jeudi : premier jeudi", () => {
    expect(iso(dateEnvoiLettre("2027-02", "2026-11-05"))).toBe("2027-02-04T07:00:00.000Z");
    expect(iso(dateEnvoiLettre("2026-12", "2026-12-03"))).toBe("2026-12-03T07:00:00.000Z");
  });

  it("plancher après le premier jeudi : premier jeudi qui suit le plancher, à 8 h", () => {
    // Lundi 16/11/2026 → jeudi 19/11/2026.
    expect(iso(dateEnvoiLettre("2026-11", "2026-11-16"))).toBe("2026-11-19T07:00:00.000Z");
    // Plancher un jeudi : ce jeudi-là.
    expect(iso(dateEnvoiLettre("2026-11", "2026-11-12"))).toBe("2026-11-12T07:00:00.000Z");
  });

  it("plancher qui traverse le changement d'heure : heure d'été appliquée", () => {
    // Dimanche 28/03/2027 = passage à l'heure d'été ; jeudi 01/04 est en UTC+2, mais hors mars.
    expect(dateEnvoiLettre("2027-03", "2027-03-27")).toBeNull();
    // Mars 2027 : plancher le 20 → jeudi 25 mars, encore en heure d'hiver.
    expect(iso(dateEnvoiLettre("2027-03", "2027-03-20"))).toBe("2027-03-25T07:00:00.000Z");
  });

  it("jeudi suivant hors du mois : null (le numéro doit changer de mois)", () => {
    expect(iso(dateEnvoiLettre("2026-12", "2026-12-26"))).toBe("2026-12-31T07:00:00.000Z");
    expect(dateEnvoiLettre("2027-01", "2027-01-29")).toBeNull();
  });
});

describe("numeroSchema impose la règle à envoiPrevu", () => {
  const numero = (periode: string, envoiPrevu: string | null, datePlancher: string | null = null) => ({
    periode,
    objet: "Objet du numéro",
    corps: "x".repeat(60),
    envoiPrevu,
    datePlancher,
    statut: "VALIDE",
  });

  it("accepte le premier jeudi à 8 h, en hiver comme en été", () => {
    expect(numeroSchema.safeParse(numero("2026-12", "2026-12-03T08:00:00+01:00")).success).toBe(true);
    expect(numeroSchema.safeParse(numero("2027-04", "2027-04-01T08:00:00+02:00")).success).toBe(true);
    expect(numeroSchema.safeParse(numero("2027-04", null)).success).toBe(true);
  });

  it("refuse une autre heure, un autre jour, ou un jeudi avant la date plancher", () => {
    expect(numeroSchema.safeParse(numero("2026-12", "2026-12-03T09:00:00+01:00")).success).toBe(false);
    expect(numeroSchema.safeParse(numero("2027-04", "2027-04-01T08:00:00+01:00")).success).toBe(false);
    expect(numeroSchema.safeParse(numero("2026-12", "2026-12-10T08:00:00+01:00")).success).toBe(false);
    expect(numeroSchema.safeParse(numero("2026-11", "2026-11-05T08:00:00+01:00", "2026-11-16")).success).toBe(false);
    expect(numeroSchema.safeParse(numero("2026-11", "2026-11-19T08:00:00+01:00", "2026-11-16")).success).toBe(true);
  });

  it("n°1 (intégration s21) : plancher lundi 02/11/2026, départ jeudi 05/11/2026 à 8 h accepté", () => {
    expect(iso(dateEnvoiLettre("2026-11", "2026-11-02"))).toBe("2026-11-05T07:00:00.000Z");
    expect(numeroSchema.safeParse(numero("2026-11", "2026-11-05T08:00:00+01:00", "2026-11-02")).success).toBe(true);
  });
});

describe("Numéros livrés (intégration s21, décision de Thomas du 17/10)", () => {
  // L'article cité par le n°1 (« soiree-de-noel-entreprise-humour ») est avancé au lundi
  // 02/11/2026 à la mise en ligne (échange de dates avec « humour-en-visio-reunion-en-ligne »).
  const numerosJson = jest.requireActual("@/data/lettre/numeros.json") as Array<{
    numero: number;
    periode: string;
    datePlancher: string | null;
    envoiPrevu: string | null;
  }>;

  it("lettres relues s22 : périodes, dates plancher et envois (premier jeudi du mois, 8 h Paris)", () => {
    const parNumero = Object.fromEntries(numerosJson.map((n) => [n.numero, [n.periode, n.datePlancher, n.envoiPrevu]]));
    expect(parNumero).toEqual({
      1: ["2026-11", null, "2026-11-05T08:00:00+01:00"],
      2: ["2026-12", "2026-11-23", "2026-12-03T08:00:00+01:00"],
      3: ["2027-01", "2026-12-28", "2027-01-07T08:00:00+01:00"],
      4: ["2027-02", "2026-11-05", "2027-02-04T08:00:00+01:00"],
      5: ["2027-03", "2026-10-12", "2027-03-04T08:00:00+01:00"],
      6: ["2027-04", "2027-02-25", "2027-04-01T08:00:00+02:00"],
    });
  });

  it("chaque envoiPrevu livré = la règle (premier jeudi 8 h, jamais avant la date plancher)", () => {
    for (const n of numerosJson) {
      expect(new Date(n.envoiPrevu as string).getTime()).toBe(dateEnvoiLettre(n.periode, n.datePlancher)?.getTime());
    }
  });
});
