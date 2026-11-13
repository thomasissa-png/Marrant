/**
 * @jest-environment node
 *
 * Lot D9 (s24) : mesure d'usage de l'espace, capteurs et lecture. Interrupteur OUVERT simulé ici
 * (jamais le code livré), sauf les cas « fermé ». Lignes Jest du plan §3 « Lot D9 » :
 * détail d'une liste fermée ; le recalcul unique n'émet aucun `cap_atteint` ; `EspaceCompteur` sans
 * identifiant ; clé d'unicité ; lecture admin refusée sans auth admin ; aucun pourcentage sous 15.
 */
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const etat = globalThis as { __D9_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D9_OUVERT__?: boolean }).__D9_OUVERT__ ?? true;
  },
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
const charger = jest.fn();
jest.mock("@/lib/analytics/espace-lecture-donnees", () => ({ chargerDonneesLecture: () => charger() }));

import { NextRequest } from "next/server";
import { detailFerme, type MesureDb } from "@/lib/mesure/evenements-usage";
import { noterCapsAtteints, noterEvenementEspace } from "@/lib/mesure/evenements-espace";
import { lectureEspace, type DonneesLecture } from "@/lib/analytics/espace-lecture";
import { GET as lireAdmin } from "@/app/api/admin/espace-lecture/route";

const RACINE = join(__dirname, "..", "..", "..");
const JOUR = 86_400_000;

/** Double de base : `dedupKey` unique (P2002 au doublon), aucune opposition. */
function base() {
  const lignes: Array<{ userId: string; type: string; detail: string | null; dedupKey: string | null }> = [];
  const db: MesureDb = {
    usageEvent: {
      create: jest.fn(async ({ data }) => {
        if (data.dedupKey && lignes.some((l) => l.dedupKey === data.dedupKey)) throw Object.assign(new Error("unique"), { code: "P2002" });
        lignes.push(data);
        return data;
      }),
      findUnique: jest.fn(async () => null),
    },
    subscription: { findUnique: jest.fn(async () => null) },
    webhookEvent: { findUnique: jest.fn(async () => null) },
  };
  return { db, lignes };
}

beforeEach(() => {
  etat.__D9_OUVERT__ = true;
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
});

describe("UsageEvent : détail d'une liste fermée, jamais de texte libre", () => {
  it.each([
    ["replique_ecrite", "Ma super réplique"],
    ["question_envoyee", "Comment répondre à mon chef ?"],
    ["espace_ouvert", "accueil"],
    ["cloche_ouverte", "x"],
    ["bonus_ouvert", "Le bonus du cap 3"],
    ["cap_atteint", "cap"],
    ["cap_atteint", "cap:9"],
    ["cap_atteint", "cap:3:texte"],
  ] as const)("%s refuse « %s »", (type, detail) => {
    expect(detailFerme(type, detail)).toBeNull();
  });

  it("le seul numéro de cap est admis pour bonus_ouvert et cap_atteint ; etape et quiz inchangés", () => {
    expect(detailFerme("bonus_ouvert", "cap:3")).toBe("cap:3");
    expect(detailFerme("cap_atteint", "cap:5")).toBe("cap:5");
    expect(detailFerme("aha", "etape")).toBe("etape");
    expect(detailFerme("premier_acces_premium", "etape:3")).toBe("etape:3");
  });
});

describe("écriture des événements de l'espace", () => {
  const maintenant = new Date("2026-11-20T09:00:00Z");

  it("interrupteur fermé : aucun événement écrit, aucune lecture de base", async () => {
    etat.__D9_OUVERT__ = false;
    const { db } = base();
    expect(await noterEvenementEspace({ type: "espace_ouvert" }, "u1", { db })).toBe(false);
    expect(await noterCapsAtteints("u1", [2, 3], { db })).toBe(0);
    expect(db.usageEvent.create).not.toHaveBeenCalled();
    expect(db.webhookEvent.findUnique).not.toHaveBeenCalled();
  });

  it("clé d'unicité : une ouverture par jour de Paris, un cap atteint une fois, une réplique par fiche", async () => {
    const { db, lignes } = base();
    expect(await noterEvenementEspace({ type: "espace_ouvert" }, "u1", { db, maintenant })).toBe(true);
    expect(await noterEvenementEspace({ type: "espace_ouvert" }, "u1", { db, maintenant: new Date(maintenant.getTime() + 3_600_000) })).toBe(false);
    expect(await noterEvenementEspace({ type: "espace_ouvert" }, "u1", { db, maintenant: new Date(maintenant.getTime() + JOUR) })).toBe(true);
    expect(await noterCapsAtteints("u1", [3, 3], { db, maintenant })).toBe(1);
    expect(await noterEvenementEspace({ type: "replique_ecrite", ficheId: "le-callback" }, "u1", { db, maintenant })).toBe(true);
    expect(await noterEvenementEspace({ type: "replique_ecrite", ficheId: "le-callback" }, "u1", { db, maintenant })).toBe(false);
    expect(lignes.map((l) => l.type)).toEqual(["espace_ouvert", "espace_ouvert", "cap_atteint", "replique_ecrite"]);
    expect(lignes.find((l) => l.type === "cap_atteint")?.detail).toBe("cap:3");
  });

  it("réplique et question : aucun détail, aucun texte ; un sujet hors format n'écrit rien", async () => {
    const { db, lignes } = base();
    await noterEvenementEspace({ type: "question_envoyee", envoi: "fil_abc123" }, "u1", { db, maintenant });
    await noterEvenementEspace({ type: "replique_ecrite", ficheId: "Ma réplique en clair" }, "u1", { db, maintenant });
    expect(lignes).toHaveLength(1);
    expect(lignes[0].detail).toBeNull();
  });

  it("le recalcul unique de l'ouverture n'appelle jamais la mesure (sources)", () => {
    const src = readFileSync(join(RACINE, "src/lib/espace/caps-serveur.ts"), "utf8");
    const recalcul = src.slice(src.indexOf("export async function recalculerCapsSilencieux"));
    expect(recalcul).toContain("marquerAnnonces(db, c.id, marques, true)");
    expect(recalcul).not.toMatch(/noterCapsAtteints|noterEvenement/);
    expect(src).toMatch(/if \(!silencieux\) await noterCapsAtteints/);
    expect(readFileSync(join(RACINE, "scripts/recalcul-caps.ts"), "utf8")).not.toMatch(/noterCapsAtteints|noterEvenement|cap_atteint/);
  });
});

describe("EspaceCompteur : capteur anonyme, sans identifiant", () => {
  it("le modèle et sa migration n'ont aucune colonne de compte", () => {
    const schema = readFileSync(join(RACINE, "prisma/schema.prisma"), "utf8");
    const modele = /model EspaceCompteur \{([\s\S]*?)\n\}/.exec(schema)?.[1] ?? "";
    expect(modele).toMatch(/cle\s+String/);
    expect(modele).not.toMatch(/userId|user\s+User|email/i);
    const dossier = readdirSync(join(RACINE, "prisma/migrations")).find((d) => /^21_/.test(d)) ?? "";
    const sql = readFileSync(join(RACINE, "prisma/migrations", dossier, "migration.sql"), "utf8");
    expect(sql).toContain("EspaceCompteur");
    expect(sql).not.toMatch(/userId/);
  });
});

/** n abonnés, ouverts à J0 ; le premier revient à J8. */
function donnees(n: number, debut = new Date("2026-10-01T08:00:00Z")): DonneesLecture {
  const evenements: DonneesLecture["evenements"] = Array.from({ length: n }, (_, i) => ({ userId: `compte-secret-${i}`, type: "espace_ouvert", detail: null, occurredAt: new Date(debut.getTime() + i * 60_000) }));
  evenements.push({ userId: "compte-secret-0", type: "espace_ouvert", detail: null, occurredAt: new Date(debut.getTime() + 8 * JOUR) });
  evenements.push({ userId: "compte-secret-0", type: "bonus_ouvert", detail: "cap:2", occurredAt: debut });
  return {
    evenements,
    missions: new Map([["compte-secret-0", 2]]),
    fiches: new Map(),
    cartes: new Map([["compte-secret-1", 4]]),
    compteurs: [
      { cle: "toucher", valeur: "soiree", n: 3 },
      { cle: "une-autre", valeur: "peu-importe", n: 1 },
    ],
  };
}

describe("lecture de la mesure (tableau d'une ligne par abonné anonymisé)", () => {
  const maintenant = new Date("2026-11-13T12:00:00Z");

  it("sous 15 abonnés : aucun pourcentage rendu, aucun agrégat, aucun identifiant", () => {
    const l = lectureEspace(donnees(14), maintenant);
    expect(l.n).toBe(14);
    expect(l.agregats).toBeNull();
    expect(l.compteurs.every((c) => c.part === null)).toBe(true);
    const sortie = JSON.stringify(l);
    expect(sortie).not.toContain("%");
    expect(sortie).not.toContain("compte-secret");
    expect(l.lignes[0]).toMatchObject({ abonne: "M-A", premiereOuverture: "01/10/2026 10:00", joursOuverture: 2, bonusVus: [2], missionsTentees: 2 });
    expect(l.lignes[0].retours).toEqual({ 7: "oui", 30: "non", 60: "pas encore" });
    expect(l.lignes[1]).toMatchObject({ abonne: "M-B", cartesJouees: 4 });
  });

  it("à 15 abonnés : « x sur n (p %) »", () => {
    const l = lectureEspace(donnees(15), maintenant);
    expect(l.agregats?.find((a) => a.libelle === "Retour à J7")?.valeur).toBe("1 sur 15 (7 %)");
    expect(l.texte).toContain("%");
  });
});

describe("GET /api/admin/espace-lecture", () => {
  const appel = (auth?: string) =>
    lireAdmin(new NextRequest("http://localhost/api/admin/espace-lecture", { headers: auth ? { authorization: auth } : {} }));

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "secret-admin";
    charger.mockReset();
    charger.mockResolvedValue(donnees(3));
  });

  it("fermé : 404 avant toute lecture, même avec l'auth admin", async () => {
    etat.__D9_OUVERT__ = false;
    expect((await appel("Bearer secret-admin")).status).toBe(404);
    expect(charger).not.toHaveBeenCalled();
  });

  it("sans auth admin : 401, rien n'est lu", async () => {
    expect((await appel()).status).toBe(401);
    expect((await appel("Bearer faux")).status).toBe(401);
    expect(charger).not.toHaveBeenCalled();
  });

  it("auth admin : le tableau, sans identifiant ni pourcentage (3 abonnés)", async () => {
    const res = await appel("Bearer secret-admin");
    expect(res.status).toBe(200);
    const corps = await res.text();
    expect(corps).toContain("M-C");
    expect(corps).not.toContain("compte-secret");
    expect(corps).not.toContain("%");
  });
});
