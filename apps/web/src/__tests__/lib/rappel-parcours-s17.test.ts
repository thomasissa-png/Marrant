/**
 * @jest-environment node
 *
 * s17 (lot A, D7, avis @legal C3 à C8) : rappel e-mail des parcours sur demande.
 */
import { runParcoursReminders, signerJetonArret, verifierJetonArret, arreterRappel, type RappelDb } from "@/lib/rappels/rappel-parcours";
import { rappelParcoursEmail } from "@/config/textes/parcours-emails";

const SECRET = "x".repeat(40);
// Jeudi 08/10/2026 09:15 à Paris (07:15 UTC) : jour ISO 4, semaine du lundi 05/10.
const NOW = new Date("2026-10-08T07:15:00Z");

function candidat(over: Record<string, unknown> = {}) {
  return {
    id: "pref-1",
    userId: "user-1",
    weekday: 4,
    activatedAt: new Date("2026-10-01T10:00:00Z"),
    lastSentWeek: null,
    user: { email: "yanis@exemple.fr", name: "Yanis Martin" },
    ...over,
  };
}

function fakeDb(opts: { candidats?: unknown[]; progress?: unknown[]; claim?: number } = {}) {
  const updateMany = jest.fn(async (args: { data: Record<string, unknown> }) => {
    if ("lastSentWeek" in args.data && args.data.lastSentWeek !== null && "lastSentAt" in args.data && args.data.lastSentAt !== null) {
      return { count: opts.claim ?? 1 };
    }
    return { count: 0 };
  });
  return {
    updateMany,
    db: {
      parcoursReminderPreference: { updateMany, findMany: jest.fn().mockResolvedValue(opts.candidats ?? [candidat()]) },
      userPathProgress: {
        findMany: jest.fn().mockResolvedValue(
          opts.progress ?? [
            {
              learningPathId: "lp-1",
              completedSteps: [1],
              learningPath: { slug: "repartie", title: "Répartie", steps: [{ order: 1 }, { order: 2 }, { order: 3 }, { order: 4 }] },
            },
          ],
        ),
      },
      userPathStepCompletion: { findFirst: jest.fn().mockResolvedValue({ completedAt: new Date("2026-10-06T18:00:00Z") }) },
    } as unknown as RappelDb,
  };
}

beforeEach(() => {
  process.env.UNSUBSCRIBE_HMAC_SECRET = SECRET;
});

describe("jeton d'arrêt dédié (C7)", () => {
  it("aller-retour, signature propre au rappel, falsification refusée", () => {
    const t = signerJetonArret("user-1") as string;
    expect(verifierJetonArret(t)).toBe("user-1");
    expect(verifierJetonArret(`${t.split(".")[0]}.${"0".repeat(32)}`)).toBeNull();
    expect(verifierJetonArret(`${Buffer.from("user-2").toString("base64url")}.${t.split(".")[1]}`)).toBeNull();
    expect(verifierJetonArret(null)).toBeNull();
  });

  it("secret absent : aucun jeton", () => {
    delete process.env.UNSUBSCRIBE_HMAC_SECRET;
    expect(signerJetonArret("user-1")).toBeNull();
  });

  it("arrêt idempotent, origine enregistrée", async () => {
    const updateMany = jest.fn().mockResolvedValue({ count: 0 });
    await expect(arreterRappel({ parcoursReminderPreference: { updateMany } }, "u1", "lien-email", NOW)).resolves.toBe(false);
    expect(updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", enabled: true },
      data: { enabled: false, stoppedAt: NOW, stopOrigin: "lien-email" },
    });
  });
});

describe("runParcoursReminders", () => {
  it("arrête d'abord les rappels des comptes qui ne sont plus Premium (C3)", async () => {
    const { db, updateMany } = fakeDb({ candidats: [] });
    await runParcoursReminders(NOW, { db, sendEmail: jest.fn(), baseUrl: "https://deviens-marrant.fr" });
    expect(updateMany.mock.calls[0][0]).toEqual({
      where: { enabled: true, user: { plan: { not: "PREMIUM" } } },
      data: { enabled: false, stoppedAt: NOW, stopOrigin: "fin-premium" },
    });
  });

  it("filtre : jour de Paris, Premium, adresse vérifiée, emailOptOut faux, pas déjà envoyé cette semaine (C4, C5)", async () => {
    const { db } = fakeDb();
    await runParcoursReminders(NOW, { db, sendEmail: jest.fn(), baseUrl: "https://x.fr" });
    const where = (db.parcoursReminderPreference.findMany as jest.Mock).mock.calls[0][0].where;
    expect(where.weekday).toBe(4);
    expect(where.user).toEqual({
      plan: "PREMIUM",
      emailOptOut: false,
      OR: [{ emailVerified: { not: null } }, { accounts: { some: { provider: "google" } } }],
    });
    expect(where.OR).toEqual([{ lastSentWeek: null }, { lastSentWeek: { not: "2026-10-05" } }]);
  });

  it("envoie un e-mail de service avec List-Unsubscribe, semaine réservée AVANT l'envoi", async () => {
    const { db, updateMany } = fakeDb();
    const sendEmail = jest.fn().mockResolvedValue(undefined);
    const res = await runParcoursReminders(NOW, { db, sendEmail, baseUrl: "https://deviens-marrant.fr" });
    expect(res.envoyes).toBe(1);
    const claimOrder = updateMany.mock.invocationCallOrder[1];
    expect(claimOrder).toBeLessThan(sendEmail.mock.invocationCallOrder[0]);
    const [to, subject, text, headers] = sendEmail.mock.calls[0];
    expect(to).toBe("yanis@exemple.fr");
    expect(subject).toContain("Répartie");
    expect(text).toContain("Salut Yanis,");
    expect(text).toContain("https://deviens-marrant.fr/parcours/repartie?src=rappel");
    expect(text).toContain("/api/rappel-parcours/arret?token=");
    expect(text).toContain("chaque jeudi");
    expect(headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(headers["List-Unsubscribe"]).toMatch(/^<https:\/\/deviens-marrant\.fr\/api\/rappel-parcours\/arret\?token=/);
  });

  it("semaine déjà réservée par un autre passage : aucun envoi (jamais de double, C5)", async () => {
    const { db } = fakeDb({ claim: 0 });
    const sendEmail = jest.fn();
    await runParcoursReminders(NOW, { db, sendEmail, baseUrl: "https://x.fr" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("sans parcours en cours (fini ou jamais commencé) : rien", async () => {
    const { db } = fakeDb({ progress: [] });
    const sendEmail = jest.fn();
    const res = await runParcoursReminders(NOW, { db, sendEmail, baseUrl: "https://x.fr" });
    expect(res.sansParcours).toBe(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("échec d'envoi : la semaine est libérée pour le passage suivant", async () => {
    const { db, updateMany } = fakeDb();
    const res = await runParcoursReminders(NOW, { db, sendEmail: jest.fn().mockRejectedValue(new Error("Resend")), baseUrl: "https://x.fr" });
    expect(res.echecs).toBe(1);
    expect(updateMany.mock.calls.at(-1)?.[0]).toEqual({
      where: { id: "pref-1", lastSentWeek: "2026-10-05" },
      data: { lastSentWeek: null, lastSentAt: null },
    });
  });

  it("secret absent : aucun envoi, signalé", async () => {
    delete process.env.UNSUBSCRIBE_HMAC_SECRET;
    const { db } = fakeDb();
    const sendEmail = jest.fn();
    const res = await runParcoursReminders(NOW, { db, sendEmail, baseUrl: "https://x.fr" });
    expect(res.secretAbsent).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("gabarit (C6)", () => {
  const { subject, text } = rappelParcoursEmail({
    prenom: null,
    parcoursTitre: "Confiance",
    etapeNumero: 2,
    etapeTitre: "Titre",
    dateConseillee: "mardi 14 octobre",
    lienEtape: "https://deviens-marrant.fr/parcours/confiance?src=rappel",
    lienArret: "https://deviens-marrant.fr/api/rappel-parcours/arret?token=t",
    lienChangerJour: "https://deviens-marrant.fr/profil#rappel-parcours",
    dateDemande: "7 octobre 2026",
    jourChoisi: "lundi",
  });

  it("pied obligatoire : raison et date de la demande, arrêt, changer de jour, signature, contact", () => {
    expect(text).toContain("parce que tu as demandé un rappel de ton parcours le 7 octobre 2026");
    expect(text).toContain("Arrêter ce rappel");
    expect(text).toContain("Changer de jour");
    expect(text).toContain("L'Équipe Deviens Marrant");
    expect(text).toContain("contact@deviens-marrant.fr");
  });

  it("zéro offre, prix, blog, réseau ; aucun tiret cadratin ; salutation sans prénom", () => {
    const tout = `${subject}\n${text}`;
    expect(tout).not.toMatch(/€|prix|offre|premium|\/blog|instagram|linkedin|twitter|x\.com|—/i);
    expect(text.startsWith("Salut,")).toBe(true);
  });
});
