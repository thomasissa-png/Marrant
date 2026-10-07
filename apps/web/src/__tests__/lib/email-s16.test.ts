/**
 * @jest-environment node
 *
 * s16 (07/10/2026), recos 8 et 10 : lib/email.ts (lecture de `{ error }` de
 * Resend partout, alerte A `email-envoi-<type>`) et gabarits des e-mails
 * transactionnels (config/textes/paiement.ts, rappel annuel).
 */
const send = jest.fn();
jest.mock("resend", () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send } })) }));
const recordAdminAlert = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/admin-alerts", () => ({ recordAdminAlert: (...a: unknown[]) => recordAdminAlert(...a) }));

import { sendAdminHtmlEmail, sendPasswordResetEmail, sendTransactionalTextEmail, trySendTransactionalTextEmail } from "@/lib/email";
import {
  emailAccuseRetractation,
  emailConfirmationAbonnement,
  emailConfirmationResiliation,
  emailPaiementRefuse,
  formulaireTypeRetractation,
} from "@/config/textes/paiement";
import { renderAnnualRenewalReminder } from "@/lib/emails/annual-renewal-reminder";

beforeEach(() => {
  jest.clearAllMocks();
  process.env.RESEND_API_KEY = "re_test_123456789";
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  send.mockResolvedValue({ data: { id: "m_1" }, error: null });
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("envoi : `{ error }` de Resend lu partout", () => {
  it("réinitialisation refusée par Resend : lève + alerte A email-envoi-reinitialisation (domaine seul)", async () => {
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    await expect(sendPasswordResetEmail("jean@exemple.fr", "https://x/reset")).rejects.toThrow("domain not verified");
    const alerte = recordAdminAlert.mock.calls[0][0];
    expect(alerte.cle).toBe("email-envoi-reinitialisation");
    expect(alerte.html).toContain("...@exemple.fr");
    expect(alerte.html).not.toContain("jean@");
  });

  it("réinitialisation : objet et corps sans tiret cadratin, signée", async () => {
    await sendPasswordResetEmail("jean@exemple.fr", "https://x/reset");
    const { subject, html } = send.mock.calls[0][0];
    expect(subject).not.toMatch(/—/);
    expect(html).not.toMatch(/—/);
    expect(html).toContain("L'Équipe Deviens Marrant");
  });

  it("clé Resend absente : erreur + alerte, aucun appel Resend", async () => {
    delete process.env.RESEND_API_KEY;
    await expect(sendTransactionalTextEmail("a@b.fr", "s", "t", "rappel-annuel")).rejects.toThrow(/RESEND_API_KEY/);
    expect(recordAdminAlert.mock.calls[0][0].cle).toBe("email-envoi-rappel-annuel");
  });

  it("trySend : ne lève jamais, renvoie false en cas d'échec", async () => {
    send.mockRejectedValue(new Error("network"));
    await expect(trySendTransactionalTextEmail("a@b.fr", "s", "t", "confirmation-abonnement")).resolves.toBe(false);
    expect(recordAdminAlert.mock.calls[0][0].cle).toBe("email-envoi-confirmation-abonnement");
  });

  it("e-mail admin (digest) en échec : erreur, mais PAS d'alerte (c'est le canal des alertes)", async () => {
    send.mockResolvedValue({ data: null, error: { message: "quota" } });
    await expect(sendAdminHtmlEmail("s", "<p>x</p>")).rejects.toThrow("quota");
    expect(recordAdminAlert).not.toHaveBeenCalled();
  });
});

const sansTiret = (t: string) => expect(t).not.toMatch(/—/);
const tutoie = (t: string) => {
  // Le modèle légal de formulaire (vouvoiement imposé) est exclu du contrôle.
  const hors = t.replace(formulaireTypeRetractation(), "");
  expect(hors).not.toMatch(/\b(vous|votre|vos)\b/i);
};

describe("gabarits (PROVISOIRE s16)", () => {
  it("confirmation d'abonnement : mentions L.221-13 complètes", () => {
    const { subject, text } = emailConfirmationAbonnement({
      prenom: "Léa",
      interval: "year",
      montantCents: 2499,
      dateSouscription: new Date("2026-10-07T10:00:00Z"),
      prochainRenouvellement: new Date("2027-10-07T10:00:00Z"),
    });
    expect(text).toContain("Salut Léa,");
    expect(text).toContain("Premium annuel, 24,99 € TTC par an");
    expect(text).toContain("le 7 octobre 2026");
    expect(text).toContain("le 7 octobre 2027");
    expect(text).toMatch(/automatique chaque année/);
    expect(text).toContain("https://deviens-marrant.fr/profil");
    expect(text).toContain("14 jours");
    expect(text).toContain("https://deviens-marrant.fr/retractation");
    expect(text).toContain("MODÈLE DE FORMULAIRE DE RÉTRACTATION");
    expect(text).toContain("https://deviens-marrant.fr/cgu");
    expect(text).toContain("L'Équipe Deviens Marrant");
    sansTiret(subject + text);
    tutoie(text);
  });

  it("confirmation mensuelle, montant inconnu : pas de prix inventé", () => {
    const { text } = emailConfirmationAbonnement({
      prenom: null,
      interval: "month",
      montantCents: null,
      dateSouscription: new Date("2026-10-07T10:00:00Z"),
      prochainRenouvellement: null,
    });
    expect(text).toContain("Salut,");
    expect(text).toContain("Formule : Premium mensuel\n");
    expect(text).toMatch(/automatique chaque mois/);
  });

  it("paiement refusé : accès conservé, profil, lien facture, pas de réabonnement", () => {
    const { subject, text } = emailPaiementRefuse({ prenom: null, lienFacture: "https://invoice.stripe.com/i/1" });
    expect(text).toContain("reste ouvert");
    expect(text).toContain("https://deviens-marrant.fr/profil");
    expect(text).toContain("https://invoice.stripe.com/i/1");
    expect(text).toMatch(/ne reprends pas un nouvel abonnement/);
    sansTiret(subject + text);
    tutoie(text);
  });

  it("résiliation : date de la demande et fin d'accès", () => {
    const { subject, text } = emailConfirmationResiliation({
      prenom: "Max",
      dateDemande: new Date("2026-10-07T12:30:00Z"),
      finAcces: new Date("2026-11-01T00:00:00Z"),
    });
    expect(text).toContain("le 7 octobre 2026 à 14:30");
    expect(text).toContain("jusqu'au 1er novembre 2026");
    sansTiret(subject + text);
    tutoie(text);
  });

  it("accusé de rétractation : date de réception, référence, signature", () => {
    const { subject, text } = emailAccuseRetractation({
      email: "a@b.fr",
      dateAchat: new Date("2026-10-01T12:00:00Z"),
      motif: null,
      recueLe: new Date("2026-10-07T12:00:00Z"),
      reference: "R-ABC",
    });
    expect(text).toContain("le 7 octobre 2026 à 14:00");
    expect(text).toContain("R-ABC");
    expect(text).toContain("14 jours");
    sansTiret(subject + text);
    tutoie(text);
  });

  it("rappel annuel : plus de « repasse en gratuit » ni de vouvoiement", () => {
    const { text } = renderAnnualRenewalReminder({
      prenom: null,
      renewalDate: new Date("2026-11-12T00:00:00Z"),
      amountCents: 2499,
      manageUrl: "https://deviens-marrant.fr/profil",
    });
    expect(text).not.toMatch(/gratuit/);
    expect(text).toContain("« Résilier ton contrat »");
    tutoie(text);
  });
});
