/**
 * @jest-environment node
 *
 * s23 onboarding : OUVERT le 08/11/2026 (code livré) = bienvenue s23 + ancre J0 ; FERMÉ (retour arrière,
 * par mock) = bienvenue actuel envoyé comme aujourd'hui, aucune lecture
 * ni écriture en plus (ni état de la lettre, ni ancre J0). Aucun envoi réel (envoi simulé).
 */
const findUnique = jest.fn();
const create = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: (...a: unknown[]) => findUnique(...a) }, webhookEvent: { create: (...a: unknown[]) => create(...a) } } }));
const envoi = jest.fn(async () => true);
jest.mock("@/lib/email", () => ({ trySendTransactionalTextEmail: (...a: unknown[]) => envoi(...(a as [])) }));
jest.mock("@/lib/admin-alerts", () => ({ recordAdminAlert: jest.fn() }));

import { notifySubscriptionConfirmed } from "@/lib/emails/paiement-notifications";
import { emailConfirmationAbonnement } from "@/config/textes/paiement";
import { ONBOARDING_PREMIUM_OUVERT } from "@/config/onboarding-premium";

const V = { interval: "month", montantCents: 199, dateSouscription: new Date("2026-11-09T09:00:00Z"), prochainRenouvellement: new Date("2026-12-09T09:00:00Z") };

it("fermé (retour arrière, par mock) : e-mail actuel mot pour mot, une seule lecture (destinataire), aucune ancre", async () => {
  findUnique.mockReset().mockResolvedValue({ email: "yanis@exemple.fr", name: "Yanis Martin" });
  envoi.mockClear();
  create.mockReset();
  let notify: typeof notifySubscriptionConfirmed = notifySubscriptionConfirmed;
  jest.isolateModules(() => {
    jest.doMock("@/config/onboarding-premium", () => ({ ...jest.requireActual("@/config/onboarding-premium"), ONBOARDING_PREMIUM_OUVERT: false }));
    notify = require("@/lib/emails/paiement-notifications").notifySubscriptionConfirmed;
  });
  expect(await notify("u1", V)).toBe(true);
  const attendu = emailConfirmationAbonnement({ prenom: "Yanis", ...V });
  expect(envoi).toHaveBeenCalledWith("yanis@exemple.fr", attendu.subject, attendu.text, "confirmation-abonnement");
  expect(attendu.subject).toBe("Bienvenue dans Premium, ton abonnement est confirmé");
  expect(findUnique).toHaveBeenCalledTimes(1);
  expect(create).not.toHaveBeenCalled();
});

it("ouvert (code livré, ouverture du 08/11) : bienvenue s23 (lettre reçue, question), puis ancre J0 à la date de souscription", async () => {
  expect(ONBOARDING_PREMIUM_OUVERT).toBe(true);
  findUnique.mockReset().mockImplementation(async (args: { select: Record<string, unknown> }) =>
    "premiumLetter" in args.select
      ? { id: "u1", email: "yanis@exemple.fr", plan: "PREMIUM", emailOptOut: false, premiumLetter: null }
      : { email: "yanis@exemple.fr", name: "Yanis Martin" },
  );
  envoi.mockClear();
  create.mockReset().mockResolvedValue({});
  expect(await notifySubscriptionConfirmed("u1", V)).toBe(true);
  const [, subject, text] = envoi.mock.calls[0] as unknown as [string, string, string];
  expect(subject).toBe("Ton abonnement est confirmé : Premium est ouvert, sers-toi");
  expect(text).toContain("- La lettre du jeudi : chaque semaine par e-mail, un clic pour l’arrêter.");
  expect(text).toContain("- « Ta question à l’équipe » : écris-nous depuis ton profil, on te répond.");
  expect(create).toHaveBeenCalledWith({ data: expect.objectContaining({ eventId: "onboarding-premium:E0:u1", provider: "interne", receivedAt: V.dateSouscription }) });
});
