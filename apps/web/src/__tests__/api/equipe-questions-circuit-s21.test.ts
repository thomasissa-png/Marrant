/**
 * @jest-environment node
 *
 * s21 « Ta question à l'équipe » : back-office et tâche planifiée.
 * Statuts RECUE -> BROUILLON -> RELUE -> ENVOYEE ; aucun envoi sans validation
 * humaine en mode par défaut ; envoi idempotent ; lot sans identité ; alertes.
 */
const sendTransactionalTextEmail = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/email", () => ({
  ADMIN_EMAIL: "admin@example.test",
  sendTransactionalTextEmail: (...a: unknown[]) => sendTransactionalTextEmail(...a),
}));
const reglage = { mode: "validation_humaine" as "validation_humaine" | "relecture_automatique" };
jest.mock("@/config/equipe-questions", () => ({
  ...jest.requireActual("@/config/equipe-questions"),
  modeValidation: () => reglage.mode,
}));
import { creerBaseQuestions } from "@/__tests__/helpers/equipe-questions-db";
const base = creerBaseQuestions();
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return base.prisma;
  },
}));

import { NextRequest } from "next/server";
import { GET as adminGet, POST as adminPost } from "@/app/api/admin/equipe-questions/route";
import { MODE_VALIDATION, SIGNATURE_EQUIPE } from "@/config/equipe-questions";
import { executerTacheQuestions, purgerQuestionsExpirees } from "@/lib/equipe-questions/taches";
import { PREPARATEUR_ACTIF } from "@/lib/equipe-questions/circuit";

const URL_ADMIN = "https://deviens-marrant.fr/api/admin/equipe-questions";
const REPONSE = `Réponds : « Je suis en période d'essai avec moi-même. » Ça marche parce que tu reprends la main sans attaquer.\n\n${SIGNATURE_EQUIPE}`;
const H = 3_600_000;

function admin(body?: unknown, query = "", auth = "Bearer secret-admin") {
  return new NextRequest(`${URL_ADMIN}${query}`, {
    method: body === undefined ? "GET" : "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json", authorization: auth },
  });
}
const agir = async (body: Record<string, unknown>) => {
  const r = await adminPost(admin(body));
  return { status: r.status, data: await r.json() };
};
function ajouter(champs: Record<string, unknown> = {}) {
  const now = new Date();
  const q = {
    id: `q${base.questions.length + 1}`, userId: "u1", situation: "Mon collègue m'a chambré sur ma cravate en réunion.",
    retour: null, statut: "RECUE", sensible: false, receivedAt: now, dueAt: new Date(now.getTime() + 48 * H),
    idempotencyKey: `k${Math.random()}`, brouillon: null, brouillonSource: null, brouillonAt: null, reponse: null,
    reponseModifieeParAdmin: false, relueAt: null, relueMode: null, envoiReserveAt: null, sentAt: null, ecarteeAt: null,
    alerteArriveeAt: null, alerteEcheanceAt: null, reutilisationAcceptee: false, extraitTexte: null, extraitStatut: "AUCUN",
    ...champs,
  };
  base.questions.push(q);
  return q;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_PASSWORD = "secret-admin";
  reglage.mode = "validation_humaine";
  base.questions.length = 0;
  base.users.length = 0;
  base.users.push({ id: "u1", plan: "PREMIUM", email: "yanis@example.test", name: "Yanis", subscription: null });
});

describe("réglages livrés", () => {
  it("mode par défaut = validation humaine ; aucun préparateur automatique branché", () => {
    expect(MODE_VALIDATION).toBe("validation_humaine");
    expect(PREPARATEUR_ACTIF).toBeNull();
  });

  it("back-office : 401 sans le mot de passe admin", async () => {
    expect((await adminGet(admin(undefined, "", "Bearer faux"))).status).toBe(401);
  });
});

describe("lot de préparation", () => {
  it("export sans e-mail, nom ni id de compte ; questions sensibles exclues", async () => {
    ajouter();
    ajouter({ sensible: true });
    const { lot } = await (await adminGet(admin(undefined, "?lot=1"))).json();
    expect(lot).toEqual([{ id: "q1", situation: expect.any(String), retour: null }]);
    expect(JSON.stringify(lot)).not.toMatch(/yanis|u1/i);
  });

  it("import : brouillon fautif refusé avec ses défauts, conforme -> BROUILLON (jamais RELUE en mode humain)", async () => {
    ajouter();
    ajouter();
    const { data } = await agir({
      action: "importer",
      brouillons: [
        { id: "q1", brouillon: `Une réponse — avec tiret, par l'intelligence artificielle.\n\n${SIGNATURE_EQUIPE}` },
        { id: "q2", brouillon: REPONSE },
      ],
    });
    expect(data.importes).toEqual(["q2"]);
    expect(data.refuses[0]).toEqual({ id: "q1", defauts: ["tiret-cadratin", "mention-outil"] });
    expect(base.questions[1]).toMatchObject({ statut: "BROUILLON", brouillonSource: "agents", reponse: REPONSE });
  });
});

describe("circuit et validation", () => {
  it("RECUE -> BROUILLON -> RELUE -> ENVOYEE, un seul e-mail même en double clic", async () => {
    ajouter();
    expect((await agir({ action: "envoyer", id: "q1" })).status).toBe(409);
    expect((await agir({ action: "relue", id: "q1" })).status).toBe(409);
    expect((await agir({ action: "enregistrer", id: "q1", reponse: REPONSE })).data.statut).toBe("BROUILLON");
    expect((await agir({ action: "envoyer", id: "q1" })).status).toBe(409);
    expect((await agir({ action: "relue", id: "q1" })).data.statut).toBe("RELUE");
    const [a, b] = await Promise.all([agir({ action: "envoyer", id: "q1" }), agir({ action: "envoyer", id: "q1" })]);
    // Le 2e clic simultané trouve l'envoi réservé : 409 (en cours) ou 200 (déjà envoyée), jamais un 2e e-mail.
    expect(a.status).toBe(200);
    expect([200, 409]).toContain(b.status);
    expect(base.questions[0].statut).toBe("ENVOYEE");
    const envois = sendTransactionalTextEmail.mock.calls.filter((c) => c[3] === "equipe-reponse");
    expect(envois).toHaveLength(1);
    expect(envois[0][0]).toBe("yanis@example.test");
    expect((await agir({ action: "envoyer", id: "q1" })).data.deja).toBe(true);
  });

  it("relecture refusée si la grille échoue (signature absente)", async () => {
    ajouter({ statut: "BROUILLON", reponse: "Réponse sans signature." });
    const r = await agir({ action: "relue", id: "q1" });
    expect(r.status).toBe(422);
    expect(r.data.defauts).toContain("signature");
  });

  it("modifier une réponse relue annule la relecture", async () => {
    ajouter({ statut: "RELUE", reponse: REPONSE, relueMode: "humaine", brouillon: REPONSE });
    await agir({ action: "enregistrer", id: "q1", reponse: `${REPONSE} ` + "" });
    await agir({ action: "enregistrer", id: "q1", reponse: REPONSE.replace("Réponds", "Dis") });
    expect(base.questions[0]).toMatchObject({ statut: "BROUILLON", relueMode: null, reponseModifieeParAdmin: true });
  });

  it("échec d'envoi : la question reste RELUE et l'envoi peut être relancé", async () => {
    ajouter({ statut: "RELUE", reponse: REPONSE, relueMode: "humaine" });
    sendTransactionalTextEmail.mockRejectedValueOnce(new Error("Resend"));
    expect((await agir({ action: "envoyer", id: "q1" })).status).toBe(502);
    expect(base.questions[0]).toMatchObject({ statut: "RELUE", envoiReserveAt: null });
    expect((await agir({ action: "envoyer", id: "q1" })).data.statut).toBe("ENVOYEE");
  });

  it("mode par défaut : la tâche planifiée n'envoie RIEN, même une réponse relue", async () => {
    ajouter({ statut: "RELUE", reponse: REPONSE, relueMode: "humaine", alerteArriveeAt: new Date() });
    ajouter({ statut: "RELUE", reponse: REPONSE, relueMode: "automatique", alerteArriveeAt: new Date() });
    const bilan = await executerTacheQuestions(new Date());
    expect(bilan.envoisAuto).toBe(0);
    expect(base.questions.every((q) => q.statut === "RELUE")).toBe(true);
    expect(sendTransactionalTextEmail.mock.calls.some((c) => c[3] === "equipe-reponse")).toBe(false);
  });

  it("mode relecture automatique (si Thomas le choisit) : import conforme -> RELUE, envoyé par la tâche", async () => {
    reglage.mode = "relecture_automatique";
    ajouter({ alerteArriveeAt: new Date() });
    await agir({ action: "importer", brouillons: [{ id: "q1", brouillon: REPONSE }] });
    expect(base.questions[0]).toMatchObject({ statut: "RELUE", relueMode: "automatique" });
    expect((await executerTacheQuestions(new Date())).envoisAuto).toBe(1);
    expect(base.questions[0].statut).toBe("ENVOYEE");
  });

  it("écarter : message à l'abonné, statut ECARTEE", async () => {
    ajouter();
    expect((await agir({ action: "ecarter", id: "q1" })).data.statut).toBe("ECARTEE");
    expect(sendTransactionalTextEmail.mock.calls[0][3]).toBe("equipe-ecartee");
  });

  it("extrait : impossible sans la case cochée ; sinon PROPOSE et e-mail avec le texte exact", async () => {
    ajouter({ statut: "ENVOYEE" });
    expect((await agir({ action: "extrait", id: "q1", texte: "Imagine : on te chambre." })).status).toBe(409);
    ajouter({ statut: "ENVOYEE", reutilisationAcceptee: true });
    expect((await agir({ action: "extrait", id: "q2", texte: "Imagine : on te chambre." })).status).toBe(200);
    expect(base.questions[1]).toMatchObject({ extraitStatut: "PROPOSE", extraitTexte: "Imagine : on te chambre." });
    expect(sendTransactionalTextEmail.mock.calls[0][2]).toContain("Imagine : on te chambre.");
  });
});

describe("tâche planifiée : alertes et purge", () => {
  it("arrivées groupées, au plus un e-mail par jour ; échéance proche une seule fois", async () => {
    const now = new Date("2026-11-10T09:00:00Z");
    ajouter({ receivedAt: now, dueAt: new Date(now.getTime() + 48 * H) });
    ajouter({ receivedAt: now, dueAt: new Date(now.getTime() + 48 * H) });
    expect((await executerTacheQuestions(now)).arrivees).toBe(2);
    ajouter({ receivedAt: now, dueAt: new Date(now.getTime() + 48 * H) });
    expect((await executerTacheQuestions(new Date(now.getTime() + H))).arrivees).toBe(0);
    expect((await executerTacheQuestions(new Date(now.getTime() + 20 * H))).arrivees).toBe(1);
    const alertes = sendTransactionalTextEmail.mock.calls.filter((c) => c[3] === "equipe-alerte-admin");
    expect(alertes.every((c) => c[0] === "admin@example.test" && !String(c[2]).includes("yanis"))).toBe(true);
    const tard = new Date(now.getTime() + 40 * H);
    expect((await executerTacheQuestions(tard)).echeances).toBe(3);
    expect((await executerTacheQuestions(new Date(tard.getTime() + H))).echeances).toBe(0);
  });

  it("purge : 6 mois après la fin de l'abonnement, jamais pour un Premium en cours", async () => {
    const now = new Date("2027-06-01T00:00:00Z");
    base.users.push({ id: "u9", plan: "FREE", email: "x@example.test", name: null, subscription: { currentPeriodEnd: new Date("2026-11-01"), updatedAt: new Date("2026-11-01") } });
    ajouter({ userId: "u9", receivedAt: new Date("2026-10-20") });
    ajouter({ userId: "u1", receivedAt: new Date("2026-10-20") });
    expect(await purgerQuestionsExpirees(now)).toBe(1);
    expect(base.questions.map((q) => q.userId)).toEqual(["u1"]);
  });
});
