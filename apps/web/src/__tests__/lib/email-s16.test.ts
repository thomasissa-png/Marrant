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

describe("gabarits hors étalons (s16)", () => {
  // Confirmation, paiement refusé et résiliation : textes VALIDÉS (étalons s16),
  // testés mot pour mot dans __tests__/lib/emails-etalons-s16-lot-e.test.ts.

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
