/**
 * @jest-environment node
 *
 * s21 « Ta question à l'équipe » : routes abonné (intégration, base en mémoire).
 * Interrupteur fermé = 404 partout ; accès Premium ; garde-fou invisible ;
 * idempotence du double clic ; accord par extrait ; question d'un autre = 404.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({
  sharedRateLimit: jest.fn().mockResolvedValue({ allowed: true, remaining: 1, resetAt: 0 }),
  retryAfterSeconds: () => 1,
}));
const sendTransactionalTextEmail = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/email", () => ({
  ADMIN_EMAIL: "admin@example.test",
  sendTransactionalTextEmail: (...a: unknown[]) => sendTransactionalTextEmail(...a),
}));
const reglage = { ouvert: true };
jest.mock("@/config/equipe-questions", () => ({
  ...jest.requireActual("@/config/equipe-questions"),
  questionsOuvertes: () => reglage.ouvert,
}));
import { creerBaseQuestions } from "@/__tests__/helpers/equipe-questions-db";
const base = creerBaseQuestions();
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return base.prisma;
  },
}));

import { NextRequest } from "next/server";
import { GET as lister, POST as poser } from "@/app/api/equipe-questions/route";
import { DELETE as supprimer, GET as lire } from "@/app/api/equipe-questions/[id]/route";
import { POST as extrait } from "@/app/api/equipe-questions/[id]/extrait/route";
import { GARDE_FOU, QUESTIONS_OUVERTES, VERSION_CASE_REUTILISATION } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_ETATS as E } from "@/config/textes/equipe-questions";

const URL_API = "https://deviens-marrant.fr/api/equipe-questions";
const SITUATION = "Au repas de famille, mon oncle m'a lancé devant tout le monde une pique sur mon célibat.";

function req(url: string, method: string, body?: unknown) {
  return new NextRequest(url, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json", origin: "https://deviens-marrant.fr" },
  });
}
const poserQ = (body: Record<string, unknown>) => poser(req(URL_API, "POST", { idempotencyKey: `cle-${Math.random()}`, ...body }));
const ctx = (id: string) => ({ params: { id } });

beforeEach(() => {
  jest.clearAllMocks();
  reglage.ouvert = true;
  base.questions.length = 0;
  base.users.length = 0;
  base.users.push(
    { id: "u1", plan: "PREMIUM", email: "yanis@example.test", name: "Yanis" },
    { id: "u2", plan: "PREMIUM", email: "sophie@example.test", name: "Sophie" },
    { id: "u3", plan: "FREE", email: "marc@example.test", name: null },
  );
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
});

describe("interrupteur", () => {
  it("est FERMÉ dans le code livré", () => {
    expect(QUESTIONS_OUVERTES).toBe(false);
  });

  it("fermé : toutes les routes abonné répondent 404, sans lire la session ni la base", async () => {
    reglage.ouvert = false;
    const reponses = [
      await lister(),
      await poserQ({ situation: SITUATION }),
      await lire(req(`${URL_API}/x`, "GET"), ctx("x")),
      await supprimer(req(`${URL_API}/x`, "DELETE"), ctx("x")),
      await extrait(req(`${URL_API}/x/extrait`, "POST", { decision: "publier", texte: "t" }), ctx("x")),
    ];
    expect(reponses.map((r) => r.status)).toEqual([404, 404, 404, 404, 404]);
    expect(getServerSession).not.toHaveBeenCalled();
    expect(base.prisma.equipeQuestion.create).not.toHaveBeenCalled();
    expect(sendTransactionalTextEmail).not.toHaveBeenCalled();
  });
});

describe("accès réservé Premium", () => {
  it("visiteur 401, compte sans Premium 403, abonnement terminé 403", async () => {
    getServerSession.mockResolvedValueOnce(null);
    expect((await poserQ({ situation: SITUATION })).status).toBe(401);
    getServerSession.mockResolvedValue({ user: { id: "u3" } });
    const r = await poserQ({ situation: SITUATION });
    expect(r.status).toBe(403);
    expect((await r.json()).error).toBe(E.nonPremium);
    expect((await lister()).status).toBe(403);
    expect(base.questions).toHaveLength(0);
  });
});

describe("création", () => {
  it("201, statut RECUE, échéance à 48 h, accusé envoyé sans le texte de la question", async () => {
    const r = await poserQ({ situation: SITUATION });
    expect(r.status).toBe(201);
    const { question, email } = await r.json();
    expect(question.statut).toBe("RECUE");
    expect(email).toBe("yanis@example.test");
    const ecart = new Date(question.dueAt).getTime() - new Date(question.receivedAt).getTime();
    expect(ecart).toBe(48 * 3_600_000);
    expect(sendTransactionalTextEmail).toHaveBeenCalledTimes(1);
    const [to, , texte, kind] = sendTransactionalTextEmail.mock.calls[0];
    expect([to, kind]).toEqual(["yanis@example.test", "equipe-accuse"]);
    expect(texte).not.toContain("oncle");
  });

  it("messages exacts de la spec : 29 puis 1 001 caractères", async () => {
    const court = await poserQ({ situation: "a".repeat(29) });
    expect(court.status).toBe(400);
    expect((await court.json()).error).toBe(E.situationCourte);
    const long = await poserQ({ situation: "a".repeat(1001) });
    expect((await long.json()).error).toBe(E.situationLongue(1));
  });

  it("double clic (même clé) : une seule ligne en base", async () => {
    const body = { situation: SITUATION, idempotencyKey: "cle-double-clic" };
    const [a, b] = await Promise.all([poser(req(URL_API, "POST", body)), poser(req(URL_API, "POST", body))]);
    expect([a.status, b.status].sort()).toEqual([200, 201]);
    expect(base.questions).toHaveLength(1);
  });

  it("case de reprise : version, date et choix écrits côté serveur", async () => {
    await poserQ({ situation: SITUATION, reutilisation: true });
    expect(base.questions[0]).toMatchObject({ reutilisationAcceptee: true, reutilisationVersion: VERSION_CASE_REUTILISATION });
    expect(base.questions[0].reutilisationAt).toBeInstanceOf(Date);
    await poserQ({ situation: SITUATION });
    expect(base.questions[1]).toMatchObject({ reutilisationAcceptee: false, reutilisationVersion: null });
  });
});

describe("garde-fou invisible", () => {
  it(`refus poli au-delà de ${GARDE_FOU.maxQuestions} questions en ${GARDE_FOU.fenetreJours} jours ; les écartées ne comptent pas`, async () => {
    for (let i = 0; i < GARDE_FOU.maxQuestions; i++) expect((await poserQ({ situation: SITUATION })).status).toBe(201);
    const refus = await poserQ({ situation: SITUATION });
    expect(refus.status).toBe(409);
    expect((await refus.json()).error).toBe(E.gardeFou);
    base.questions[0].statut = "ECARTEE";
    expect((await poserQ({ situation: SITUATION })).status).toBe(201);
  });

  it("aucun texte de limite n'est montré à l'abonné", () => {
    const tous = JSON.stringify(jest.requireActual("@/config/textes/equipe-questions"));
    expect(tous).not.toMatch(/par semaine|illimit/i);
  });
});

describe("historique, lecture, suppression", () => {
  it("la question d'un autre abonné : 404 ; brouillon jamais exposé", async () => {
    await poserQ({ situation: SITUATION });
    base.questions[0].brouillon = "brouillon interne";
    const id = base.questions[0].id;
    const lu = await (await lire(req(`${URL_API}/${id}`, "GET"), ctx(id))).json();
    expect(lu.question.brouillon).toBeUndefined();
    expect(lu.question.reponse).toBeNull();
    getServerSession.mockResolvedValue({ user: { id: "u2" } });
    expect((await lire(req(`${URL_API}/${id}`, "GET"), ctx(id))).status).toBe(404);
    expect((await supprimer(req(`${URL_API}/${id}`, "DELETE"), ctx(id))).status).toBe(404);
    expect(base.questions).toHaveLength(1);
  });

  it("suppression par l'auteur : 204, plus listée", async () => {
    await poserQ({ situation: SITUATION });
    const id = base.questions[0].id;
    expect((await supprimer(req(`${URL_API}/${id}`, "DELETE"), ctx(id))).status).toBe(204);
    expect((await (await lister()).json()).questions).toHaveLength(0);
  });
});

describe("accord par extrait", () => {
  async function questionAvecExtrait(texte: string) {
    await poserQ({ situation: SITUATION, reutilisation: true });
    const q = base.questions[base.questions.length - 1];
    Object.assign(q, { statut: "ENVOYEE", extraitTexte: texte, extraitStatut: "PROPOSE" });
    return q.id;
  }

  it("sans clic, rien n'est accepté ; « Publier » sur le texte exact = ACCEPTE", async () => {
    const id = await questionAvecExtrait("Imagine : ton oncle te chambre au repas.");
    expect(base.questions[0].extraitStatut).toBe("PROPOSE");
    const r = await extrait(req(`${URL_API}/${id}/extrait`, "POST", { decision: "publier", texte: "Imagine : ton oncle te chambre au repas." }), ctx(id));
    expect(r.status).toBe(200);
    expect(base.questions[0].extraitStatut).toBe("ACCEPTE");
    expect(base.questions[0].extraitDecisionAt).toBeInstanceOf(Date);
  });

  it("texte modifié entre l'affichage et le clic : 409, aucun accord", async () => {
    const id = await questionAvecExtrait("Version 2 du texte.");
    const r = await extrait(req(`${URL_API}/${id}/extrait`, "POST", { decision: "publier", texte: "Version 1 du texte." }), ctx(id));
    expect(r.status).toBe(409);
    expect(base.questions[0].extraitStatut).toBe("PROPOSE");
  });

  it("aucun extrait proposé : 409 ; refus possible", async () => {
    await poserQ({ situation: SITUATION });
    const id = base.questions[0].id;
    expect((await extrait(req(`${URL_API}/${id}/extrait`, "POST", { decision: "publier", texte: "x" }), ctx(id))).status).toBe(409);
    const id2 = await questionAvecExtrait("Texte.");
    await extrait(req(`${URL_API}/${id2}/extrait`, "POST", { decision: "refuser", texte: "Texte." }), ctx(id2));
    expect(base.questions.find((q) => q.id === id2)?.extraitStatut).toBe("REFUSE");
  });
});
