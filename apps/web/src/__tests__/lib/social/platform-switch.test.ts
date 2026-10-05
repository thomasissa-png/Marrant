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
  type PlatformSettingRow,
  type SwitchDb,
} from "@/lib/social/platform-switch";
import { BUFFER_CONFIRMED_PREFIX } from "@/lib/social/buffer-status-check";
import { construireRapport, rapportPublicationHtml, type PostRapport } from "@/lib/social/publication-report";

const NOW = new Date("2026-10-12T10:00:00Z");

function fakeDb(settings: PlatformSettingRow[], posts: Array<{ id: string; platform: string; status: string; scheduledAt: Date }> = []) {
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
        const a = args as { where: { id: string }; data: { scheduledAt: Date } };
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

  it("reprise : posts en retard replanifiés à 1 par jour, sur les jours libres, à leur heure", async () => {
    const posts = [
      { id: "r1", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-06T16:30:00Z") },
      { id: "r2", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-07T16:30:00Z") },
      { id: "r3", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-09T16:30:00Z") },
      { id: "f1", platform: "INSTAGRAM", status: "APPROVED", scheduledAt: new Date("2026-10-14T16:30:00Z") },
    ];
    const db = fakeDb([ligne("INSTAGRAM", true)], posts);
    const { replanifies } = await reprendre(db, "INSTAGRAM", NOW);
    expect(replanifies).toBe(3);
    expect(posts.map((p) => p.scheduledAt.toISOString())).toEqual([
      "2026-10-13T16:30:00.000Z", "2026-10-15T16:30:00.000Z", "2026-10-16T16:30:00.000Z", "2026-10-14T16:30:00.000Z",
    ]);
  });

  it("replanifierRetards : aucun retard, aucun changement", () => {
    expect(replanifierRetards([], new Set(), NOW)).toEqual([]);
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
