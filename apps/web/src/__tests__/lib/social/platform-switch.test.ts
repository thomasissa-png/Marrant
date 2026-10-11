/**
 * @jest-environment node
 *
 * Interrupteur Pause / Reprise par réseau (s15 cycle 3) et rapport
 * « prévu contre publié ». Base en mémoire, aucun réseau.
 */
import {
  alerterPausesAutomatiques,
  canauxEnPanne,
  estAutorisationPerdue,
  lireInterrupteurs,
  mettreEnPause,
  pauserAutomatiquement,
  replanifierRetards,
  reprendre,
  reseauxEnPause,
  sauterAvantJ0,
  type PlatformSettingRow,
  type SwitchDb,
} from "@/lib/social/platform-switch";
import { BUFFER_CONFIRMED_PREFIX } from "@/lib/social/buffer-status-check";
import { construireRapport, rapportPublicationHtml, type PostRapport } from "@/lib/social/publication-report";

const NOW = new Date("2026-10-12T10:00:00Z");

function fakeDb(settings: PlatformSettingRow[], posts: Array<{ id: string; platform: string; status: string; scheduledAt: Date; directorNote?: string | null }> = []) {
  const db: SwitchDb & { settings: PlatformSettingRow[]; posts: typeof posts } = {
    settings,
    posts,
    socialPlatformSetting: {
      findMany: async () => settings.map((s) => ({ ...s })),
      upsert: async (args: unknown) => {
        const a = args as { where: { platform: string }; create: PlatformSettingRow; update: Partial<PlatformSettingRow> };
        const r = settings.find((s) => s.platform === a.where.platform);
        if (r) Object.assign(r, a.update);
        else settings.push({ ...a.create });
        return settings.find((s) => s.platform === a.where.platform)!;
      },
      updateMany: async (args: unknown) => {
        const a = args as { where: { platform: string }; data: Partial<PlatformSettingRow> };
        const r = settings.find((s) => s.platform === a.where.platform);
        if (r) Object.assign(r, a.data);
        return { count: r ? 1 : 0 };
      },
    },
    socialPost: {
      findMany: async (args: unknown) => {
        const w = (args as { where: { platform: string; status: string; scheduledAt: { lt?: Date; gte?: Date } } }).where;
        return posts.filter((p) => p.platform === w.platform && p.status === w.status &&
          (!w.scheduledAt.lt || p.scheduledAt < w.scheduledAt.lt) && (!w.scheduledAt.gte || p.scheduledAt >= w.scheduledAt.gte));
      },
      update: async (args: unknown) => {
        const a = args as { where: { id: string }; data: Record<string, unknown> };
        Object.assign(posts.find((p) => p.id === a.where.id)!, a.data);
        return {};
      },
    },
  };
  return db;
}

const ligne = (platform: "TWITTER" | "INSTAGRAM" | "LINKEDIN", paused: boolean, extra: Partial<PlatformSettingRow> = {}): PlatformSettingRow => ({
  platform, paused, reason: null, changedBy: "migration", pausedAt: null, alertSentAt: null, ...extra,
});

describe("interrupteur", () => {
  it("état initial de la migration : 3 réseaux en pause ; ligne absente = pause", async () => {
    expect([...(await reseauxEnPause(fakeDb([ligne("TWITTER", true), ligne("INSTAGRAM", true), ligne("LINKEDIN", true)])))])
      .toEqual(expect.arrayContaining(["TWITTER", "INSTAGRAM", "LINKEDIN"]));
    const etats = await lireInterrupteurs(fakeDb([ligne("TWITTER", false)]));
    expect(etats.find((e) => e.platform === "TWITTER")!.paused).toBe(false);
    expect(etats.find((e) => e.platform === "LINKEDIN")).toMatchObject({ paused: true, parDefaut: true });
  });

  it("pause manuelle puis reprise depuis l'admin", async () => {
    const db = fakeDb([ligne("LINKEDIN", false)]);
    await mettreEnPause(db, "LINKEDIN", "Test", NOW);
    expect(db.settings[0]).toMatchObject({ paused: true, changedBy: "admin", reason: "Test" });
    await reprendre(db, "LINKEDIN", NOW);
    expect(db.settings[0]).toMatchObject({ paused: false, reason: null });
  });

  it("reprise : plus de 24 h de retard = REJECTED « expiré », moins de 24 h = replanifié sur un jour libre, heure de Paris", async () => {
    const posts: Array<{ id: string; platform: string; status: string; scheduledAt: Date; directorNote?: string | null }> = [
      { id: "r1", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-06T17:30:00Z"), directorNote: "Lot relance-s15 (VANNE)" },
      { id: "r2", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-11T17:30:00Z") },
      { id: "f1", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-12T17:30:00Z") },
      { id: "f2", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-13T17:30:00Z") },
    ];
    const db = fakeDb([ligne("INSTAGRAM", true)], posts);
    const res = await reprendre(db, "INSTAGRAM", NOW);
    expect(res).toEqual({ replanifies: 1, expires: 1 });
    expect(posts[0]).toMatchObject({ status: "REJECTED", scheduledAt: new Date("2026-10-06T17:30:00Z") });
    expect(posts[0].directorNote).toBe("Expiré à la reprise du 12/10/2026 : prévu le 06/10/2026, plus de 24 h avant. Lot relance-s15 (VANNE)");
    // 12/10 et 13/10 occupés : mercredi 14/10 à 19:30 (Paris, heure d'été).
    expect(posts[1].scheduledAt.toISOString()).toBe("2026-10-14T17:30:00.000Z");
    expect(db.settings[0]).toMatchObject({ paused: false });
  });

  it("reprise : relais d'article et post daté en retard de moins de 24 h = REJECTED, jamais rattrapés (plan v2 §7)", async () => {
    const posts: Array<{ id: string; platform: string; status: string; scheduledAt: Date; directorNote?: string | null; content?: string; cta?: string | null }> = [
      { id: "rel", platform: "TWITTER", status: "APPROVED", scheduledAt: new Date("2026-10-12T09:30:00Z"), content: "Vanne\n\nhttps://deviens-marrant.fr/blog/a?utm_source=x", directorNote: null },
      { id: "hal", platform: "TWITTER", status: "APPROVED", scheduledAt: new Date("2026-10-11T10:30:00Z"), content: "Vanne d'Halloween", directorNote: "[date:2026-10-11] Lot relance-s15 (PIVOT)" },
      { id: "van", platform: "TWITTER", status: "APPROVED", scheduledAt: new Date("2026-10-11T10:30:00Z"), content: "Vanne", directorNote: "Lot relance-s15 (VANNE)" },
    ];
    const db = fakeDb([ligne("TWITTER", true)], posts);
    expect(await reprendre(db, "TWITTER", NOW)).toEqual({ replanifies: 1, expires: 2 });
    expect(posts.map((p) => p.status)).toEqual(["REJECTED", "REJECTED", "APPROVED"]);
    expect(posts[0].directorNote).toBe("Expiré à la reprise du 12/10/2026 : prévu le 12/10/2026, relais d'article ou post daté, jamais rattrapé.");
    expect(posts[2].scheduledAt.toISOString()).toBe("2026-10-12T10:30:00.000Z"); // créneau X du jour encore à venir
  });

  it("replanifierRetards : jamais un dimanche ni un jour de silence (11/11)", () => {
    const now = new Date("2026-11-07T15:00:00Z"); // samedi 16:00 Paris, créneau X de 12:30 passé
    const plan = replanifierRetards(
      [{ id: "a", scheduledAt: new Date("2026-11-06T11:30:00Z") }, { id: "b", scheduledAt: new Date("2026-11-07T11:30:00Z") }],
      new Set(["2026-11-09"]),
      now,
      "TWITTER",
    );
    // dim. 08/11 exclu, lun. 09/11 occupé, mar. 10/11 libre ; mer. 11/11 silence, jeu. 12/11.
    expect(plan.map((p) => p.scheduledAt.toISOString())).toEqual(["2026-11-10T11:30:00.000Z", "2026-11-12T11:30:00.000Z"]);
  });

  it("replanifierRetards : heure de Paris du réseau après le passage à l'heure d'hiver (25/10)", () => {
    // Post X du sam. 24/10 à 12:30 Paris (10:30 UTC), reprise dim. 25/10 à 06:00 UTC.
    const plan = replanifierRetards([{ id: "a", scheduledAt: new Date("2026-10-24T10:30:00Z") }], new Set(), new Date("2026-10-25T06:00:00Z"), "TWITTER");
    expect(plan[0].scheduledAt.toISOString()).toBe("2026-10-26T11:30:00.000Z"); // lundi 12:30 Paris = 11:30 UTC
  });

  it("replanifierRetards : créneau du jour même gardé s'il est encore à venir", () => {
    const plan = replanifierRetards([{ id: "a", scheduledAt: new Date("2026-10-12T06:15:00Z") }], new Set(), new Date("2026-10-13T05:00:00Z"), "LINKEDIN");
    expect(plan[0].scheduledAt.toISOString()).toBe("2026-10-13T06:15:00.000Z");
  });

  it("replanifierRetards : un post du bras B ([heure:B]) garde l'heure B, le bras A garde l'heure A (F1, cycle 7)", () => {
    const now = new Date("2026-10-14T05:00:00Z"); // mer. 07:00 Paris
    const plan = replanifierRetards(
      [
        { id: "b", scheduledAt: new Date("2026-10-13T07:00:00Z"), directorNote: "[heure:B] Lot relance-s15 (VANNE, TIRAGE)" },
        { id: "a", scheduledAt: new Date("2026-10-13T10:30:00Z"), directorNote: "[heure:A] Lot relance-s15 (VANNE, TIRAGE)" },
      ],
      new Set(),
      now,
      "TWITTER",
    );
    // B : mer. 14/10 09:00 Paris (07:00 UTC) ; A : jeu. 15/10 12:30 Paris (10:30 UTC), 1 rattrapage par jour.
    expect(plan.map((p) => [p.id, p.scheduledAt.toISOString()])).toEqual([["b", "2026-10-14T07:00:00.000Z"], ["a", "2026-10-15T10:30:00.000Z"]]);
  });

  it("replanifierRetards : aucun retard, aucun changement", () => {
    expect(replanifierRetards([], new Set(), NOW, "TWITTER")).toEqual([]);
  });

  it("sauter les posts avant J0 : APPROVED datés avant le J0 du réseau passés en REJECTED", async () => {
    const posts: Array<{ id: string; platform: string; status: string; scheduledAt: Date; directorNote?: string | null }> = [
      { id: "a", platform: "LINKEDIN", status: "APPROVED", scheduledAt: new Date("2026-10-13T06:15:00Z") },
      { id: "b", platform: "LINKEDIN", status: "APPROVED", scheduledAt: new Date("2026-10-20T06:15:00Z") },
      { id: "c", platform: "TWITTER", status: "APPROVED", scheduledAt: new Date("2026-10-13T10:30:00Z") },
    ];
    const db = fakeDb([ligne("LINKEDIN", true)], posts);
    expect(await sauterAvantJ0(db, "LINKEDIN", "2026-10-20")).toEqual({ sautes: 1 });
    expect(posts.map((p) => p.status)).toEqual(["REJECTED", "APPROVED", "APPROVED"]);
    expect(posts[0].directorNote).toBe("Sauté : prévu le 13/10/2026, avant le J0 du réseau (20/10/2026).");
    expect(db.settings[0].paused).toBe(true);
  });

  it("détecte un canal déconnecté, verrouillé ou introuvable parmi les réseaux configurés", () => {
    const pannes = canauxEnPanne(
      [{ id: "x", isDisconnected: false, isLocked: false }, { id: "ig", isDisconnected: true, isLocked: false }],
      { TWITTER: "x", INSTAGRAM: "ig", LINKEDIN: "li" },
    );
    expect(pannes.map((p) => p.platform)).toEqual(["INSTAGRAM", "LINKEDIN"]);
    expect(pannes[0].motif).toContain("autorisation");
  });

  it("reconnaît les messages d'autorisation perdue", () => {
    expect(estAutorisationPerdue("Buffer has lost authorization to post on your behalf")).toBe(true);
    expect(estAutorisationPerdue("Invalid Credentials")).toBe(true);
    expect(estAutorisationPerdue("Media too small")).toBe(false);
  });

  it("pause automatique idempotente ; alerte posée seulement après envoi réussi", async () => {
    const db = fakeDb([ligne("INSTAGRAM", false)]);
    expect(await pauserAutomatiquement(db, "INSTAGRAM", "canal déconnecté", NOW)).toBe(true);
    expect(await pauserAutomatiquement(db, "INSTAGRAM", "canal déconnecté", NOW)).toBe(false);
    const envoi = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    expect(await alerterPausesAutomatiques(db, envoi, NOW)).toEqual([]);
    expect(db.settings[0].alertSentAt).toBeNull();
    expect(await alerterPausesAutomatiques(db, envoi, NOW)).toEqual(["INSTAGRAM"]);
    expect(db.settings[0].alertSentAt).toEqual(NOW);
    expect(await alerterPausesAutomatiques(db, envoi, NOW)).toEqual([]);
    expect(envoi).toHaveBeenCalledTimes(2);
  });
});

describe("rapport prévu contre publié", () => {
  const p = (id: string, extra: Partial<PostRapport>): PostRapport => ({
    id, platform: "TWITTER", status: "PUBLISHED", scheduledAt: new Date("2026-10-07T10:30:00Z"),
    externalId: `b-${id}`, bufferStatus: null, directorNote: null, ...extra,
  });

  it("compte prévus, remis, confirmés, échecs, non confirmés, bloqués et l'écart", () => {
    const r = construireRapport([
      p("ok", { bufferStatus: "sent", directorNote: `${BUFFER_CONFIRMED_PREFIX} le 2026-10-07T10:31:00.000Z : https://x.com/s/1` }),
      p("ko", { status: "FAILED", bufferStatus: "error" }),
      p("nc", {}),
      p("bloque", { status: "APPROVED", externalId: null, platform: "LINKEDIN" }),
      p("futur", { status: "APPROVED", externalId: null, scheduledAt: new Date("2026-10-13T10:30:00Z") }),
      p("rejete", { status: "REJECTED", externalId: null }),
    ], "2026-10-06", "2026-10-14", NOW);
    expect(r.totaux.TWITTER).toMatchObject({ prevus: 4, remis: 3, confirmes: 1, echecs: 1, nonConfirmes: 1, aVenir: 1, ecart: 2 });
    expect(r.totaux.LINKEDIN).toMatchObject({ prevus: 1, bloques: 1, ecart: 1 });
    expect(r.ecartTotal).toBe(3);
    expect(r.lignes.find((l) => l.jour === "2026-10-07" && l.platform === "TWITTER")!.liens).toEqual(["https://x.com/s/1"]);
    const html = rapportPublicationHtml(r);
    expect(html).toContain("prévu contre publié");
    expect(html).toContain("Écart 3");
    expect(html).not.toMatch(/—/);
  });

  it("période vide : phrase explicite", () => {
    expect(rapportPublicationHtml(construireRapport([], "2026-10-06", "2026-10-12", NOW))).toContain("Aucun post prévu");
  });
});
