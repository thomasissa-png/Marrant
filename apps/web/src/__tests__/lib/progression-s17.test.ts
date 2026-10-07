/**
 * @jest-environment node
 *
 * s17 (lot A) : lib/progression (niveaux, série de pratique en jour de Paris,
 * total d'XP avec bonus) et corrections du seed des parcours (vidéo MàC 3,
 * vannes 82/85/180 remplacées).
 */
import {
  calculateLevel,
  effectiveStreak,
  getPathXpTotal,
  nextRecommendedAt,
  nextStreak,
  recordPractice,
  type PracticeDb,
} from "@/lib/progression";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import blaguesSeed from "../../../../../docs/content/blagues-seed.json";

describe("niveaux (FS-07)", () => {
  it.each([
    [0, "NOVICE"],
    [99, "NOVICE"],
    [100, "APPRENTI"],
    [500, "FARCEUR"],
    [1500, "COMIQUE"],
    [4999, "COMIQUE"],
    [5000, "LEGENDE"],
  ])("%i XP → %s", (xp, level) => expect(calculateLevel(xp)).toBe(level));
});

describe("série de jours sur la pratique (D3), jour civil de Paris", () => {
  it("première pratique → 1", () => expect(nextStreak(0, null, new Date("2026-10-07T10:00:00Z"))).toBe(1));

  it("même jour de Paris → inchangée (23h30 UTC = 01h30 le lendemain à Paris, donc +1)", () => {
    const last = new Date("2026-10-07T08:00:00Z");
    expect(nextStreak(3, last, new Date("2026-10-07T20:00:00Z"))).toBe(3);
    expect(nextStreak(3, last, new Date("2026-10-07T23:30:00Z"))).toBe(4);
  });

  it("trou de 2 jours → repart à 1", () => {
    expect(nextStreak(9, new Date("2026-10-05T10:00:00Z"), new Date("2026-10-07T10:00:00Z"))).toBe(1);
  });

  it("affichage : série rompue → 0 ; veille → conservée", () => {
    const now = new Date("2026-10-07T10:00:00Z");
    expect(effectiveStreak(5, new Date("2026-10-06T10:00:00Z"), now)).toBe(5);
    expect(effectiveStreak(5, new Date("2026-10-05T10:00:00Z"), now)).toBe(0);
    expect(effectiveStreak(5, null, now)).toBe(0);
  });

  it("recordPractice écrit série, date de pratique et dernière activité", async () => {
    const update = jest.fn();
    const db = {
      user: { findUnique: jest.fn().mockResolvedValue({ streak: 2, lastPracticeAt: new Date("2026-10-06T09:00:00Z") }), update },
    } as unknown as PracticeDb;
    const now = new Date("2026-10-07T09:00:00Z");
    await expect(recordPractice(db, "u1", now)).resolves.toBe(3);
    expect(update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { streak: 3, lastPracticeAt: now, lastActiveAt: now } });
  });
});

describe("XP et rythme doux", () => {
  it("total d'un parcours = étapes + bonus de fin (Machine à Café 325, pas 225)", () => {
    expect(getPathXpTotal("machine-a-cafe", [1, 2, 3])).toBe(325);
  });
  it("prochaine étape conseillée 7 jours après", () => {
    expect(nextRecommendedAt(new Date("2026-10-07T10:00:00Z"))).toBe("2026-10-14T10:00:00.000Z");
  });
});

describe("seed des parcours (s17)", () => {
  type Step = { week: number; jokeIds: number[]; videos: { youtubeId: string; artist: string }[] };
  const paths = parcoursSeed as Array<{ slug: string; steps: Step[] }>;
  const ids = new Set((blaguesSeed as Array<{ id: number }>).map((b) => b.id));

  it("Machine à Café étape 3 : la vidéo Djimo est bien tpIOLzv11qo (FS-03)", () => {
    const step = paths.find((p) => p.slug === "machine-a-cafe")?.steps.find((s) => s.week === 3);
    expect(step?.videos.find((v) => v.artist === "Djimo")?.youtubeId).toBe("tpIOLzv11qo");
  });

  it("toutes les vannes citées existent dans blagues-seed (82, 85, 180 remplacées)", () => {
    const manquantes = paths.flatMap((p) => p.steps.flatMap((s) => s.jokeIds.filter((id) => !ids.has(id))));
    expect(manquantes).toEqual([]);
  });
});
