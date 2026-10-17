/**
 * @jest-environment node
 *
 * Lettre s21 : confirmation et désinscription robustes aux scanners de liens (@legal L5).
 * Un GET ne change jamais un statut ; seul le POST du bouton (ou le POST en un clic
 * RFC 8058) agit. Mesure : `mesure=1` seulement hors `emailsExclus()`.
 */
let mockOuvert = true;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_INSCRIPTIONS_OUVERTES() {
    return mockOuvert;
  },
  get LETTRE_ENVOIS_OUVERTS() {
    return mockOuvert;
  },
}));

jest.mock("@/lib/prisma", () => ({
  prisma: { newsletterSubscriber: { findUnique: jest.fn(), update: jest.fn() } },
}));

import { NextRequest } from "next/server";
import { GET as confirmGet, POST as confirmPost } from "@/app/api/newsletter/confirm/[token]/route";
import { GET as unsubGet, POST as unsubPost } from "@/app/api/newsletter/unsubscribe/[token]/route";
import { prisma } from "@/lib/prisma";

const db = prisma.newsletterSubscriber as unknown as Record<"findUnique" | "update", jest.Mock>;
const TOKEN = "t".repeat(43);
const params = { params: { token: TOKEN } };

function req(path: string, init: { method?: string; headers?: Record<string, string>; body?: string } = {}) {
  return new NextRequest(`http://localhost:3000${path}`, init);
}

function abonne(champs: Record<string, unknown> = {}) {
  return {
    id: "sub1",
    email: "yanis@exemple.fr",
    source: "article:meilleures-blagues-droles-2026",
    status: "PENDING",
    consentAt: new Date(),
    reconfirmRequestedAt: null,
    ipAddress: "abc",
    ...champs,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockOuvert = true;
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  delete process.env.ANALYTICS_EMAILS_EXCLUS;
  db.findUnique.mockResolvedValue(abonne());
  db.update.mockResolvedValue({});
});

describe("Confirmation", () => {
  it("GET (scanner de liens) : aucun changement, renvoi vers la page du bouton", async () => {
    const res = await confirmGet(req(`/api/newsletter/confirm/${TOKEN}`), params);
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(`https://deviens-marrant.fr/lettre/confirmer?token=${TOKEN}`);
    expect(db.findUnique).not.toHaveBeenCalled();
    expect(db.update).not.toHaveBeenCalled();
  });

  it("POST du bouton : CONFIRMED, redirection mesurée avec l'emplacement relu en base", async () => {
    const res = await confirmPost(req(`/api/newsletter/confirm/${TOKEN}`, { method: "POST" }), params);
    expect(db.update.mock.calls[0][0].data.status).toBe("CONFIRMED");
    expect(db.update.mock.calls[0][0].data.confirmedAt).toBeInstanceOf(Date);
    const location = res.headers.get("location") ?? "";
    expect(location).toBe("https://deviens-marrant.fr/lettre?statut=confirmee&mesure=1&emplacement=article");
    expect(location).not.toMatch(/yanis|token/);
  });

  it("adresse de test (emailsExclus) : confirmée mais jamais mesurée", async () => {
    process.env.ANALYTICS_EMAILS_EXCLUS = "Yanis@exemple.fr";
    const res = await confirmPost(req(`/api/newsletter/confirm/${TOKEN}`, { method: "POST" }), params);
    expect(db.update).toHaveBeenCalled();
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/lettre?statut=confirmee");
  });

  it("déjà confirmé : idempotent, aucune écriture", async () => {
    db.findUnique.mockResolvedValue(abonne({ status: "CONFIRMED" }));
    const res = await confirmPost(req(`/api/newsletter/confirm/${TOKEN}`, { method: "POST" }), params);
    expect(db.update).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toContain("statut=confirmee");
  });

  it("lien de plus de 7 jours : invalide, rien confirmé", async () => {
    db.findUnique.mockResolvedValue(abonne({ consentAt: new Date(Date.now() - 8 * 86400_000) }));
    const res = await confirmPost(req(`/api/newsletter/confirm/${TOKEN}`, { method: "POST" }), params);
    expect(db.update).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/lettre?statut=invalide");
  });

  it("vieux lien d'un désinscrit : jamais de réinscription", async () => {
    db.findUnique.mockResolvedValue(abonne({ status: "UNSUBSCRIBED" }));
    const res = await confirmPost(req(`/api/newsletter/confirm/${TOKEN}`, { method: "POST" }), params);
    expect(db.update).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toContain("statut=invalide");
  });

  it("jeton inconnu ou malformé : invalide", async () => {
    db.findUnique.mockResolvedValue(null);
    expect((await confirmPost(req("/x", { method: "POST" }), params)).headers.get("location")).toContain("statut=invalide");
    const court = await confirmPost(req("/x", { method: "POST" }), { params: { token: "abc" } });
    expect(court.headers.get("location")).toContain("statut=invalide");
  });

  it("POST d'un autre site : 403", async () => {
    const res = await confirmPost(req("/x", { method: "POST", headers: { origin: "https://pirate.example" } }), params);
    expect(res.status).toBe(403);
    expect(db.update).not.toHaveBeenCalled();
  });

  it("interrupteur fermé : 404 en GET comme en POST", async () => {
    mockOuvert = false;
    expect((await confirmGet(req("/x"), params)).status).toBe(404);
    expect((await confirmPost(req("/x", { method: "POST" }), params)).status).toBe(404);
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("Désinscription", () => {
  beforeEach(() => {
    db.findUnique.mockResolvedValue(abonne({ status: "CONFIRMED" }));
  });

  it("GET (scanner de liens) : aucun changement, renvoi vers la page du bouton", async () => {
    const res = await unsubGet(req("/x"), params);
    expect(res.headers.get("location")).toBe(`https://deviens-marrant.fr/lettre/desinscrire?token=${TOKEN}`);
    expect(db.update).not.toHaveBeenCalled();
  });

  it("POST du bouton : UNSUBSCRIBED, empreinte d'IP effacée, redirection statut=desinscrit", async () => {
    const res = await unsubPost(
      req("/x", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "" }),
      params,
    );
    const data = db.update.mock.calls[0][0].data;
    expect(data.status).toBe("UNSUBSCRIBED");
    expect(data.ipAddress).toBeNull();
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/lettre?statut=desinscrit");
  });

  it("POST en un clic (List-Unsubscribe-Post) : 200 immédiat", async () => {
    const res = await unsubPost(
      req("/x", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "List-Unsubscribe=One-Click" }),
      params,
    );
    expect(res.status).toBe(200);
    expect(db.update.mock.calls[0][0].data.status).toBe("UNSUBSCRIBED");
  });

  it("toujours possible interrupteur fermé (un e-mail déjà parti doit pouvoir être arrêté)", async () => {
    mockOuvert = false;
    const res = await unsubPost(req("/x", { method: "POST" }), params);
    expect(db.update).toHaveBeenCalled();
    expect(res.headers.get("location")).toContain("statut=desinscrit");
  });

  it("déjà désinscrit : idempotent", async () => {
    db.findUnique.mockResolvedValue(abonne({ status: "UNSUBSCRIBED" }));
    const res = await unsubPost(req("/x", { method: "POST" }), params);
    expect(db.update).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toContain("statut=desinscrit");
  });
});
