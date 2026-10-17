/**
 * @jest-environment node
 *
 * Lettre s21 : script d'envoi de TEST (`scripts/envoi-test-lettre-s21.ts`).
 * Liste blanche codée en dur (adresse d'Alex seule), rendu par le vrai code,
 * objet préfixé « [TEST 2] », aucune base touchée.
 */
jest.mock("@/lib/prisma", () => ({
  prisma: new Proxy({}, { get: () => { throw new Error("aucun accès base attendu"); } }),
}));

import {
  ADRESSE_TEST,
  DESTINATAIRES_TEST_AUTORISES,
  envoyerEmailsTest,
  rendreEmailsTest,
  verifierDestinataireTest,
  type ClientEmail,
} from "../../../scripts/envoi-test-lettre-s21";
import { EMAILS_LETTRE, LETTRE_CONTACT } from "@/config/textes/lettre-s21";
import { corpsNumero } from "@/lib/lettre/envoi";
import { frPonctuation } from "@/lib/fr-typo";
import numerosJson from "@/data/lettre/numeros.json";

const client = () => {
  const send = jest.fn(async () => ({ data: { id: "id-simule" }, error: null }));
  return { send, client: { emails: { send } } as unknown as ClientEmail };
};

describe("liste blanche de l'envoi de test", () => {
  it("une seule adresse autorisée : celle d'Alex", () => {
    expect(DESTINATAIRES_TEST_AUTORISES).toEqual(["alex@deviens-marrant.fr"]);
    expect(ADRESSE_TEST).toBe("alex@deviens-marrant.fr");
    expect(verifierDestinataireTest("alex@deviens-marrant.fr")).toBe("alex@deviens-marrant.fr");
  });

  it.each([
    "thomas.issa@gmail.com",
    "contact@deviens-marrant.fr",
    "Alex@deviens-marrant.fr",
    " alex@deviens-marrant.fr",
    "alex+test@deviens-marrant.fr",
    "alex@deviens-marrant.fr.evil.com",
    "alex@deviens-marrant.fr, autre@x.fr",
    "",
  ])("refuse %p et n'envoie rien", async (adresse) => {
    expect(() => verifierDestinataireTest(adresse)).toThrow(/Destinataire refusé/);
    const { send, client: c } = client();
    await expect(envoyerEmailsTest(adresse, c, "Deviens Marrant <test@x.fr>")).rejects.toThrow(/Destinataire refusé/);
    expect(send).not.toHaveBeenCalled();
  });
});

describe("rendu et envoi", () => {
  it("rend les 2 e-mails avec le vrai code, objet préfixé [TEST 2]", async () => {
    const [confirmation, numero] = await rendreEmailsTest();
    expect(confirmation.subject).toBe(`[TEST 2] ${EMAILS_LETTRE.confirmation.sujet}`);
    expect(confirmation.text).toContain("https://deviens-marrant.fr/lettre/confirmer?token=");
    const n1 = numerosJson.find((n) => n.numero === 1)!;
    expect(numero.subject).toBe(`[TEST 2] ${frPonctuation(n1.objet)}`);
    expect(numero.text).toBe(corpsNumero(n1.corps, "https://deviens-marrant.fr", "envoi-de-test-lien-non-valide"));
    expect(numero.headers?.["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(numero.text).not.toContain("[À COMPLÉTER");
    expect(numero.text).toContain("Tu reçois cette lettre parce que tu l'as demandée sur deviens-marrant.fr.");
    expect(numero.text).toContain("deviens-marrant SAS");
  });

  it("envoie 2 e-mails à Alex seulement et relève les identifiants", async () => {
    const { send, client: c } = client();
    const r = await envoyerEmailsTest("alex@deviens-marrant.fr", c, "Deviens Marrant <test@x.fr>");
    expect(r).toEqual([
      { type: "lettre-confirmation", id: "id-simule", erreur: null },
      { type: "lettre-numero-1", id: "id-simule", erreur: null },
    ]);
    expect(send).toHaveBeenCalledTimes(2);
    for (const [payload] of send.mock.calls as unknown as Array<[{ to: string; subject: string; replyTo: string }]>) {
      expect(payload.to).toBe("alex@deviens-marrant.fr");
      expect(payload.subject.startsWith("[TEST 2] ")).toBe(true);
      expect(payload.replyTo).toBe(LETTRE_CONTACT);
    }
  });

  it("refus du service : erreur exacte rapportée, rien n'est contourné", async () => {
    const send = jest.fn(async () => ({ data: null, error: { name: "validation_error", message: "domaine non vérifié" } }));
    const r = await envoyerEmailsTest("alex@deviens-marrant.fr", { emails: { send } } as unknown as ClientEmail, "x <x@x.fr>");
    expect(r.map((x) => x.erreur)).toEqual(["validation_error : domaine non vérifié", "validation_error : domaine non vérifié"]);
    expect(send).toHaveBeenCalledTimes(2);
  });
});
