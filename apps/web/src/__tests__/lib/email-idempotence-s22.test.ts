/**
 * `sendServiceTextEmail` (s22) : la clé d'idempotence part en option Resend
 * (`Idempotency-Key`), jamais dans le corps ; un renvoi concurrent de même clé ne lève
 * pas d'alerte A (le premier envoi part), les autres refus de Resend si.
 */
const send = jest.fn();
jest.mock("resend", () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send } })) }));
const recordAdminAlert = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/admin-alerts", () => ({ recordAdminAlert: (...a: unknown[]) => recordAdminAlert(...a) }));

import { sendServiceTextEmail } from "@/lib/email";

const CLE = `question-equipe/${"a".repeat(64)}`;

beforeEach(() => {
  process.env.RESEND_API_KEY = "re_test_valeur";
  send.mockReset().mockResolvedValue({ data: { id: "m_1" }, error: null });
  recordAdminAlert.mockClear();
});

describe("sendServiceTextEmail : Idempotency-Key", () => {
  it("clé transmise en option Resend, absente du corps ; Reply-To conservé", async () => {
    await sendServiceTextEmail("contact@deviens-marrant.fr", "Objet", "Texte", "question-equipe", { replyTo: "a@x.fr", idempotencyKey: CLE });
    const [corps, options] = send.mock.calls[0];
    expect(options).toEqual({ idempotencyKey: CLE });
    expect(corps).toMatchObject({ to: "contact@deviens-marrant.fr", subject: "Objet", text: "Texte", replyTo: "a@x.fr" });
    expect(corps).not.toHaveProperty("idempotencyKey");
  });

  it("sans clé : aucune option (autres e-mails inchangés)", async () => {
    await sendServiceTextEmail("x@y.fr", "Objet", "Texte", "rappel-parcours", { replyTo: "contact@deviens-marrant.fr" });
    expect(send.mock.calls[0][1]).toBeUndefined();
  });

  it("renvoi concurrent de même clé : lève sans alerte ; autre refus : lève avec alerte A", async () => {
    send.mockResolvedValueOnce({ data: null, error: { name: "concurrent_idempotent_requests", message: "en cours" } });
    await expect(sendServiceTextEmail("contact@deviens-marrant.fr", "O", "T", "question-equipe", { idempotencyKey: CLE })).rejects.toThrow();
    expect(recordAdminAlert).not.toHaveBeenCalled();
    send.mockResolvedValueOnce({ data: null, error: { name: "invalid_idempotent_request", message: "payload différent" } });
    await expect(sendServiceTextEmail("contact@deviens-marrant.fr", "O", "T", "question-equipe", { idempotencyKey: CLE })).rejects.toThrow();
    expect(recordAdminAlert.mock.calls[0][0].cle).toBe("email-envoi-question-equipe");
  });
});
