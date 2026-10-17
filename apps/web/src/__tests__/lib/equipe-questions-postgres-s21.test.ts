/**
 * @jest-environment node
 *
 * s21 « Ta question à l'équipe » : intégration sur une VRAIE base PostgreSQL
 * jetable (migration 14 appliquée). Ignoré sans `EQUIPE_QUESTIONS_TEST_DATABASE_URL`
 * (CI, poste sans base). Ne JAMAIS pointer cette variable vers la production :
 * le test crée et supprime des comptes.
 */
const URL_TEST = process.env.EQUIPE_QUESTIONS_TEST_DATABASE_URL;
if (URL_TEST) process.env.DATABASE_URL = URL_TEST;

const envois: unknown[][] = [];
jest.mock("@/lib/email", () => ({
  ADMIN_EMAIL: "admin@example.test",
  sendTransactionalTextEmail: async (...a: unknown[]) => {
    envois.push(a);
  },
}));

import { SIGNATURE_EQUIPE } from "@/config/equipe-questions";

const suite = URL_TEST ? describe : describe.skip;

suite("EquipeQuestion sur PostgreSQL", () => {
  // Chargés après DATABASE_URL (client Prisma réel).
  const { prisma } = require("@/lib/prisma") as typeof import("@/lib/prisma");
  const abonne = require("@/lib/equipe-questions/abonne") as typeof import("@/lib/equipe-questions/abonne");
  const circuit = require("@/lib/equipe-questions/circuit") as typeof import("@/lib/equipe-questions/circuit");
  const taches = require("@/lib/equipe-questions/taches") as typeof import("@/lib/equipe-questions/taches");
  const email = `equipe-test-${Date.now()}@example.test`;
  let userId = "";

  beforeAll(async () => {
    const u = await prisma.user.create({ data: { email, name: "Yanis", plan: "PREMIUM" } });
    userId = u.id;
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it("circuit complet, idempotence, garde-fou, accord par extrait, cascade", async () => {
    const situation = "Au repas de famille, mon oncle m'a chambré sur mon célibat devant tout le monde.";
    const a = await abonne.creerQuestion(userId, { situation, retour: "", reutilisation: true, idempotencyKey: "cle-1" });
    const b = await abonne.creerQuestion(userId, { situation, retour: "", reutilisation: true, idempotencyKey: "cle-1" });
    expect(a.ok && b.ok && a.question.id === b.question.id).toBe(true);
    if (!a.ok) throw new Error("création");
    const id = a.question.id;

    for (let i = 2; i <= 5; i++) await abonne.creerQuestion(userId, { situation, retour: "", reutilisation: false, idempotencyKey: `cle-${i}` });
    const refus = await abonne.creerQuestion(userId, { situation, retour: "", reutilisation: false, idempotencyKey: "cle-6" });
    expect(refus).toEqual({ ok: false, code: "garde-fou" });

    const lot = await circuit.exporterLot();
    expect(JSON.stringify(lot)).not.toContain(email);
    const reponse = `Réponds : « Je suis en période d'essai avec moi-même. »\n\n${SIGNATURE_EQUIPE}`;
    expect((await circuit.importerBrouillons([{ id, brouillon: reponse }])).importes).toEqual([id]);
    expect(await circuit.envoyerReponse(id, "admin")).toEqual({ ok: false, code: "etat" });
    expect(await circuit.marquerRelue(id)).toEqual({ ok: true, statut: "RELUE" });
    expect(await circuit.envoyerReponse(id, "admin")).toEqual({ ok: true, statut: "ENVOYEE" });
    expect(await circuit.envoyerReponse(id, "admin")).toEqual({ ok: true, statut: "ENVOYEE", deja: true });
    expect(envois.filter((e) => e[3] === "equipe-reponse")).toHaveLength(1);

    expect((await circuit.proposerExtrait(id, "Imagine : ton oncle te chambre.")).ok).toBe(true);
    expect((await abonne.deciderExtrait(userId, id, "publier", "Autre texte")).ok).toBe(false);
    expect(await abonne.deciderExtrait(userId, id, "publier", "Imagine : ton oncle te chambre.")).toEqual({ ok: true, extraitStatut: "ACCEPTE" });

    const bilan = await taches.executerTacheQuestions(new Date());
    expect(bilan.arrivees).toBe(4);
    expect(bilan.envoisAuto).toBe(0);

    await prisma.user.delete({ where: { id: userId } });
    expect(await prisma.equipeQuestion.count({ where: { userId } })).toBe(0);
  });
});
