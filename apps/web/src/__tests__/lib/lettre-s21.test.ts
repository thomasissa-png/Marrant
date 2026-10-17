/**
 * @jest-environment node
 *
 * Lettre s21 : textes (zéro tiret cadratin, vocabulaire protégé), interrupteur fermé
 * par défaut, numéros préparés (format, jamais un numéro envoyé modifié) et entretien
 * de la liste (@legal L4 : 7 jours, 24 mois, 3 ans).
 */
let mockOuvert = false;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_OUVERTE() {
    return mockOuvert;
  },
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    newsletterSubscriber: { deleteMany: jest.fn(), updateMany: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { EMAILS_LETTRE, TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { synchroniserNumerosLettre } from "@/lib/lettre/numeros";
import { entretenirLettre } from "@/lib/lettre/entretien";
import numerosJson from "@/data/lettre/numeros.json";
import { frPonctuation, NBSP } from "@/lib/fr-typo";

const issue = prisma.newsletterIssue as unknown as Record<"findUnique" | "create" | "update", jest.Mock>;
const sub = prisma.newsletterSubscriber as unknown as Record<"deleteMany" | "updateMany" | "findMany" | "update", jest.Mock>;

function chaines(valeur: unknown): string[] {
  if (typeof valeur === "string") return [valeur];
  if (typeof valeur === "function") return [String((valeur as (...a: string[]) => string)("lien-a", "lien-b", "https://deviens-marrant.fr"))];
  if (valeur && typeof valeur === "object") return Object.values(valeur).flatMap(chaines);
  return [];
}

describe("Textes de la lettre", () => {
  const ecran = chaines(TEXTES_LETTRE);
  const emails = chaines(EMAILS_LETTRE);

  it("zéro tiret cadratin, écrans et e-mails", () => {
    for (const t of [...ecran, ...emails]) expect(t).not.toContain("—");
  });

  it("jamais « newsletter » ni « abonnement » pour désigner la lettre (vocabulaire réservé à Premium)", () => {
    // Seule exception : la page de désinscription parle de l'abonnement PREMIUM (@legal L6).
    const horsDesinscription = ecran.filter((t) => t !== TEXTES_LETTRE.page.desinscrire.texte);
    for (const t of horsDesinscription) expect(t).not.toMatch(/newsletter|abonnement|s'abonner/i);
    expect(TEXTES_LETTRE.page.desinscrire.texte).not.toMatch(/newsletter/i);
  });

  it("case @legal L1 : Premium et désinscription en un clic (texte exact : lettre-textes-valides-s21.test.ts)", () => {
    expect(TEXTES_LETTRE.formulaire.case).toContain("parfois une mention de Premium");
    expect(TEXTES_LETTRE.formulaire.case).toContain("me désinscrire en un clic");
  });

  it("chaque e-mail porte l'identité de l'éditeur et le contact (@legal L3)", () => {
    const corps = [
      EMAILS_LETTRE.confirmation.corps("L", "https://deviens-marrant.fr"),
      EMAILS_LETTRE.dejaInscrit.corps("L", "https://deviens-marrant.fr"),
      EMAILS_LETTRE.reconfirmation.corps("L", "L2", "https://deviens-marrant.fr"),
    ];
    for (const t of corps) {
      expect(t).toContain("deviens-marrant SAS");
      expect(t).toContain("contact@deviens-marrant.fr");
    }
  });

  it("le pied des numéros porte la mention d'éditeur @legal (marqueur tant qu'elle manque) et le contact", () => {
    const pied = EMAILS_LETTRE.piedNumero("L", "https://deviens-marrant.fr");
    const { LETTRE_MENTION_EDITEUR_NUMERO } = jest.requireActual("@/config/lettre");
    expect(pied).toContain(`Éditeur${NBSP}: ${frPonctuation(LETTRE_MENTION_EDITEUR_NUMERO)}.`);
    expect(pied).toContain("contact@deviens-marrant.fr");
  });
});

describe("Interrupteur", () => {
  it("LETTRE_OUVERTE est fermé dans le code livré", () => {
    expect(jest.requireActual("@/config/lettre").LETTRE_OUVERTE).toBe(false);
  });

  it("jours d'envoi livrés : jamais avant décembre 2026 (ouverture après le 10/11)", () => {
    expect(numerosJson.length).toBeGreaterThan(0);
    for (const n of numerosJson) if (n.envoiPrevu) expect(new Date(n.envoiPrevu).getTime()).toBeGreaterThanOrEqual(Date.parse("2026-12-01T00:00:00+01:00"));
  });
});

const CORPS = "La vanne du mois, puis pourquoi elle marche, en quelques lignes préparées et relues.";
const numero = (champs: Record<string, unknown> = {}) => ({
  periode: "2026-11",
  objet: "La vanne de novembre",
  corps: CORPS,
  envoiPrevu: "2026-11-05T08:00:00+01:00",
  statut: "VALIDE",
  ...champs,
});

describe("synchroniserNumerosLettre", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    issue.findUnique.mockResolvedValue(null);
  });

  it("fichier vide : aucune requête", async () => {
    const r = await synchroniserNumerosLettre([]);
    expect(r).toEqual({ crees: 0, misAJour: 0, ignores: [], enAttente: [] });
    expect(issue.findUnique).not.toHaveBeenCalled();
  });

  it("jour d'envoi non fixé (envoiPrevu null) : en attente, rien n'est écrit en base", async () => {
    const r = await synchroniserNumerosLettre([numero({ envoiPrevu: null, datePlancher: "2026-11-16" })]);
    expect(r).toEqual({ crees: 0, misAJour: 0, ignores: [], enAttente: ["2026-11"] });
    expect(issue.findUnique).not.toHaveBeenCalled();
    expect(issue.create).not.toHaveBeenCalled();
  });

  it("refuse une date d'envoi antérieure à la date plancher", async () => {
    const r = await synchroniserNumerosLettre([numero({ datePlancher: "2026-11-16" })]);
    expect(r.ignores[0]).toContain("date plancher");
    expect(issue.create).not.toHaveBeenCalled();
  });

  it("crée un numéro VALIDE avec sa date d'envoi", async () => {
    const r = await synchroniserNumerosLettre([numero()]);
    expect(r.crees).toBe(1);
    const data = issue.create.mock.calls[0][0].data;
    expect(data).toMatchObject({ audience: "MENSUELLE", periodKey: "2026-11", status: "VALIDE", bodyText: CORPS });
    expect(data.scheduledFor.toISOString()).toBe("2026-11-05T07:00:00.000Z");
    expect(data.validatedAt).toBeInstanceOf(Date);
  });

  it("refuse un tiret cadratin, une date hors du mois ou un statut inconnu", async () => {
    const r = await synchroniserNumerosLettre([
      numero({ objet: "La vanne — novembre" }),
      numero({ envoiPrevu: "2026-12-01T08:00:00+01:00" }),
      numero({ statut: "ENVOYE" }),
    ]);
    expect(r.ignores).toHaveLength(3);
    expect(issue.create).not.toHaveBeenCalled();
  });

  it("un numéro déjà ENVOYE n'est jamais modifié", async () => {
    issue.findUnique.mockResolvedValue({ id: "n1", status: "ENVOYE" });
    const r = await synchroniserNumerosLettre([numero({ objet: "Autre objet" })]);
    expect(issue.update).not.toHaveBeenCalled();
    expect(r.ignores[0]).toContain("déjà envoyé");
  });
});

describe("entretenirLettre", () => {
  const NOW = new Date("2026-11-05T03:00:00Z");
  beforeEach(() => {
    jest.clearAllMocks();
    mockOuvert = false;
    sub.deleteMany.mockResolvedValue({ count: 0 });
    sub.updateMany.mockResolvedValue({ count: 0 });
    sub.findMany.mockResolvedValue([]);
    sub.update.mockResolvedValue({});
  });

  it("efface les non confirmés après 7 jours et les traces de désinscription après 3 ans", async () => {
    await entretenirLettre(NOW, { envoyer: jest.fn(), baseUrl: "https://deviens-marrant.fr" });
    const [pending, traces] = sub.deleteMany.mock.calls.map((c) => c[0].where);
    expect(pending.status).toBe("PENDING");
    expect(pending.consentAt.lt.toISOString()).toBe("2026-10-29T03:00:00.000Z");
    expect(traces.status).toBe("UNSUBSCRIBED");
    expect(traces.unsubscribedAt.lt.toISOString()).toBe("2023-11-05T03:00:00.000Z");
  });

  it("sans réponse 30 jours après la reconfirmation : désinscription, empreinte effacée", async () => {
    await entretenirLettre(NOW, { envoyer: jest.fn(), baseUrl: "https://deviens-marrant.fr" });
    const { where, data } = sub.updateMany.mock.calls[0][0];
    expect(where.reconfirmRequestedAt.lt.toISOString()).toBe("2026-10-06T03:00:00.000Z");
    expect(data).toMatchObject({ status: "UNSUBSCRIBED", ipAddress: null });
  });

  it("interrupteur fermé : aucune demande de reconfirmation envoyée", async () => {
    const envoyer = jest.fn();
    await entretenirLettre(NOW, { envoyer, baseUrl: "https://deviens-marrant.fr" });
    expect(sub.findMany).not.toHaveBeenCalled();
    expect(envoyer).not.toHaveBeenCalled();
  });

  it("interrupteur ouvert : reconfirmation à 24 mois avec un nouveau jeton et un bouton", async () => {
    mockOuvert = true;
    sub.findMany.mockResolvedValue([{ id: "s1", email: "a@x.fr", unsubscribeToken: "u".repeat(43) }]);
    const envoyer = jest.fn().mockResolvedValue(undefined);
    const r = await entretenirLettre(NOW, { envoyer, baseUrl: "https://deviens-marrant.fr" });
    expect(sub.findMany.mock.calls[0][0].where.confirmedAt.lt.toISOString()).toBe("2024-11-05T03:00:00.000Z");
    const token = sub.update.mock.calls[0][0].data.confirmationToken;
    expect(envoyer.mock.calls[0][2]).toContain(`/lettre/confirmer?token=${token}`);
    expect(envoyer.mock.calls[0][3]["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(r.reconfirmationsEnvoyees).toBe(1);
  });
});
