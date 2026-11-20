/**
 * Tests s26 : remplacement sur place des vidéos YouTube à risque.
 * Garde-fou par empreinte (texte s20 v1), statut « en-attente » ignoré, collision
 * d'id, aucune ligne créée ni supprimée, même `id`, marqueur `DataPatch` dans la
 * même transaction, `note.before` (retour arrière), idempotence au 2e boot,
 * anciennes URL ; + cohérence du JSON avec le seed, s20 et les parcours ; s26 v1 : les 7
 * « appliquer » (go de Thomas du 20/11), les 4 premières non rejouées.
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

import fs from "fs";
import path from "path";
import {
  applyVideoRemplacementsS26Task,
  planVideoRemplacementS26,
  type VideoRemplacementS26Entry,
  type VideoRemplacementS26Row,
  type VideoRemplacementsS26File,
} from "@/lib/video-remplacements-s26";
import { videoTextFingerprint } from "@/lib/video-content-s20";
import { anciensSlugsVideo } from "@/lib/video-anciens-slugs";
import { buildVideoSlug, pickBySlug } from "@/lib/catalogue-slug";
import remplacements from "@/data/video-remplacements-s26.json";
import videoContentS20 from "@/data/video-content-s20.json";
import videosSeed from "../../../../../docs/content/videos-seed.json";

const ROW: VideoRemplacementS26Row = {
  id: "cmrow000000000000014",
  youtubeId: "v-ySkBGAXLI",
  title: "Thomas Ngijol au Jamel Comedy Club",
  channelName: "Ryme Beast",
  duration: "PT7M8S",
  description: "Texte s20.",
  learnings: ["A", "B", "C", "D"],
  exercise: "Défi s20.",
};
const entry = (over: Partial<VideoRemplacementS26Entry> = {}): VideoRemplacementS26Entry => ({
  seedId: 14,
  youtubeId: ROW.youtubeId,
  statut: "appliquer",
  attendu: videoTextFingerprint(ROW),
  anciensTitres: [ROW.title],
  cible: { youtubeId: "l__Xirj2N6c", title: "Thomas Ngijol - Superman (Jamel Comedy Club)", channelName: "Jamel Comedy Club - CANAL+", duration: "" },
  ...over,
});
const file = (...videos: VideoRemplacementS26Entry[]): VideoRemplacementsS26File => ({ _meta: { version: 1 }, videos });

let rows: VideoRemplacementS26Row[];
let markers: Map<string, string>;
const db = {
  dataPatch: {
    findMany: jest.fn(async ({ where }: { where: { patchId: { startsWith: string } } }) =>
      [...markers.keys()].filter((m) => m.startsWith(where.patchId.startsWith)).map((patchId) => ({ patchId }))),
    create: jest.fn((a: { data: { patchId: string; note: string } }) => ({ op: "dataPatch.create", a })),
  },
  video: {
    findUnique: jest.fn(async ({ where }: { where: { youtubeId: string } }) =>
      rows.find((r) => r.youtubeId === where.youtubeId) ?? null),
    update: jest.fn((a: { where: { id: string }; data: Record<string, unknown> }) => ({ op: "video.update", a })),
    create: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
  },
  // Base en mémoire : la transaction applique réellement l'update et le marqueur.
  $transaction: jest.fn(async (ops: Array<{ op: string; a: { where?: { id: string }; data: Record<string, unknown> } }>) => {
    for (const o of ops) {
      if (o.op === "video.update") {
        const r = rows.find((x) => x.id === o.a.where?.id)!;
        const { updatedAt: _ignored, ...data } = o.a.data;
        Object.assign(r, data);
      } else markers.set(String(o.a.data.patchId), String(o.a.data.note));
    }
    return ops;
  }),
};
const run = (f: VideoRemplacementsS26File) =>
  applyVideoRemplacementsS26Task(db as unknown as Parameters<typeof applyVideoRemplacementsS26Task>[0], f);

beforeEach(() => {
  jest.clearAllMocks();
  rows = [{ ...ROW, learnings: [...(ROW.learnings ?? [])] }];
  markers = new Map();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe("applyVideoRemplacementsS26Task", () => {
  it("remplace sur place (même id), sans créer ni supprimer de ligne, marqueur dans la même transaction", async () => {
    const r = await run(file(entry()));
    expect(r).toMatchObject({ updated: 1, refused: 0, done: 0 });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ id: ROW.id, youtubeId: "l__Xirj2N6c", title: "Thomas Ngijol - Superman (Jamel Comedy Club)", channelName: "Jamel Comedy Club - CANAL+", duration: "" });
    expect(rows[0].description).toBe(ROW.description);
    expect(db.video.create).not.toHaveBeenCalled();
    expect(db.video.upsert).not.toHaveBeenCalled();
    expect(db.video.delete).not.toHaveBeenCalled();
    const ops = db.$transaction.mock.calls[0][0];
    expect(ops.map((o: { op: string }) => o.op)).toEqual(["video.update", "dataPatch.create"]);
    expect([...markers.keys()]).toEqual(["video-remplacements-s26:v1:v-ySkBGAXLI"]);
  });

  it("idempotent : 2e boot = 0 écriture", async () => {
    await run(file(entry()));
    jest.clearAllMocks();
    const r = await run(file(entry()));
    expect(r).toMatchObject({ updated: 0, done: 1 });
    expect(db.video.findUnique).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("retour arrière : note.before rend la ligne d'origine champ par champ", async () => {
    await run(file(entry()));
    const note = JSON.parse(markers.get("video-remplacements-s26:v1:v-ySkBGAXLI")!);
    expect(note).toMatchObject({ videoId: ROW.id, youtubeId: ROW.youtubeId, changed: ["youtubeId", "title", "channelName", "duration"] });
    Object.assign(rows[0], note.before);
    expect(rows[0]).toEqual(ROW);
  });

  it("garde-fou : texte en base différent → refus, aucune écriture, pas de marqueur", async () => {
    rows[0].description = "Retouché depuis.";
    const r = await run(file(entry()));
    expect(r).toMatchObject({ updated: 0, refused: 1 });
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(markers.size).toBe(0);
  });

  it("refus si le nouvel id est déjà porté par une autre ligne", async () => {
    rows.push({ ...ROW, id: "cmautre00000000000001", youtubeId: "l__Xirj2N6c" });
    const r = await run(file(entry()));
    expect(r).toMatchObject({ updated: 0, refused: 1 });
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("« en-attente » : ni lecture ni écriture ; absente en base : ignorée", async () => {
    const r = await run(file(entry({ statut: "en-attente" }), entry({ youtubeId: "absent00000", seedId: 99 })));
    expect(r).toMatchObject({ pending: 1, missing: 1, updated: 0 });
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(r.summary).toContain("1 en attente de textes");
  });

  it("durée : vide ou ISO 8601 seulement ; textes optionnels non vides", () => {
    expect(planVideoRemplacementS26(ROW, entry({ cible: { ...entry().cible, duration: "5 min" } })).kind).toBe("refus");
    expect(planVideoRemplacementS26(ROW, entry({ cible: { ...entry().cible, duration: "PT5M13S" } })).kind).toBe("update");
    expect(planVideoRemplacementS26(ROW, entry({ cible: { ...entry().cible, description: " " } })).kind).toBe("refus");
  });

  it("base injoignable : ne lève pas", async () => {
    db.dataPatch.findMany.mockRejectedValueOnce(new Error("down"));
    const r = await run(file(entry()));
    expect(r.failed).toBe(1);
  });
});

describe("anciennes URL (titre changé)", () => {
  it("l'ancien slug, recalculé avec l'id réel, désigne la fiche remplacée parmi les vidéos du même préfixe", () => {
    const remplacee = { id: "cmabcdefgh0000000014", youtubeId: "l__Xirj2N6c", title: "Thomas Ngijol - Superman (Jamel Comedy Club)" };
    const voisine = { id: "cmabcdefgh0000000099", youtubeId: "xxxxxxxxxxx", title: "Thomas Wiesel - Jamel Comedy Club au Comedy Club" };
    const ancien = buildVideoSlug({ id: remplacee.id, title: "Thomas Ngijol au Jamel Comedy Club" });
    expect(anciensSlugsVideo(remplacee)).toContain(ancien);
    expect(pickBySlug([voisine, remplacee], ancien, buildVideoSlug, anciensSlugsVideo)).toBe(remplacee);
  });

  it("aucune ancienne URL pour une ligne qui n'a pas pris le nouvel id (tâche refusée : pas de boucle)", () => {
    expect(anciensSlugsVideo({ id: "cmabcdefgh0000000014", youtubeId: "v-ySkBGAXLI" })).toEqual([]);
  });
});

describe("JSON s26", () => {
  const seed = videosSeed as Array<{ id: number; youtubeId: string; title: string; channelName: string; duration: string; recommendedTimestamp?: string }>;
  const s20 = videoContentS20.fiches as Array<{ seedId: number; youtubeId: string; cible: { title?: string; description: string; learnings: string[]; exercise: string } }>;
  const videos = remplacements.videos as VideoRemplacementS26Entry[];

  it("7 vidéos, ids distincts, attendu = empreinte du texte s20 v1", () => {
    expect(videos).toHaveLength(7);
    expect(new Set(videos.map((v) => v.cible.youtubeId)).size).toBe(7);
    for (const v of videos) {
      const f = s20.find((x) => x.youtubeId === v.youtubeId)!;
      const seedTitre = seed.find((x) => x.id === v.seedId)?.title;
      // Titre en base aujourd'hui : celui posé par s20, sinon le titre d'origine
      // (premier ancien titre si le titre change, titre gardé sinon ; seed inchangé si en attente).
      const titre = f.cible.title ?? (v.statut === "appliquer" ? (v.anciensTitres[0] ?? v.cible.title) : seedTitre);
      expect(videoTextFingerprint({ title: titre ?? "", description: f.cible.description, learnings: f.cible.learnings, exercise: f.cible.exercise })).toBe(v.attendu);
      expect(v.cible.duration).toBe("");
    }
  });

  it("seed aligné : vidéos appliquées et Dany Boon au nouvel id ; aucun nouvel id hors seed", () => {
    for (const v of videos) {
      const ligne = seed.find((x) => x.id === v.seedId)!;
      if (v.statut === "appliquer") {
        expect(ligne).toMatchObject({ youtubeId: v.cible.youtubeId, title: v.cible.title, channelName: v.cible.channelName, duration: "" });
        // Horodatage de l'ancienne mise en ligne vidé (ligne gardée : missions.json cite le seed ligne à ligne).
        expect(ligne.recommendedTimestamp ?? "").toBe("");
      } else expect(ligne.youtubeId).toBe(v.youtubeId);
    }
    expect(seed.find((x) => x.id === 68)?.youtubeId).toBe("JNo86HEt86w");
  });

  it("parcours : Domenge (2.4) et Kev Adams (3.4) au nouvel id, Ngijol (1.4) gardé sur l'ancien tant que son texte n'est pas appliqué", () => {
    const root = path.resolve(__dirname, "../../../../..");
    const parcours = ["parcours-storytelling-s18.json", "parcours-boulot-s19.json"].map((f) => fs.readFileSync(path.join(root, "docs/content", f), "utf8")).join("");
    const auNouvelId = new Set([15, 5]);
    for (const v of videos) {
      if (auNouvelId.has(v.seedId)) {
        expect(parcours).toContain(v.cible.youtubeId);
        expect(parcours).not.toContain(v.youtubeId);
      } else expect(parcours).not.toContain(v.cible.youtubeId);
    }
    expect(parcours).toContain("v-ySkBGAXLI");
  });

  it("toutes « appliquer » (0 en attente) ; textes réécrits complets, sans tiret cadratin", () => {
    expect(videos.filter((v) => v.statut !== "appliquer")).toEqual([]);
    for (const seedId of [15, 57, 5]) {
      const c = videos.find((v) => v.seedId === seedId)!.cible;
      expect(c.description).toBeTruthy();
      expect(c.exercise).toBeTruthy();
      expect(c.learnings).toHaveLength(4);
      expect(JSON.stringify(c)).not.toContain("—");
    }
  });

  it("version 1 gardée : au boot, les 4 déjà faites sont sautées (marqueur v1), les 3 nouvelles s'appliquent", async () => {
    const fichier = remplacements as unknown as VideoRemplacementsS26File;
    expect(fichier._meta.version).toBe(1);
    markers = new Map();
    rows = [];
    for (const v of videos) {
      if (v.cible.description === undefined) {
        markers.set(`video-remplacements-s26:v1:${v.youtubeId}`, "{}");
        continue;
      }
      const f = s20.find((x) => x.youtubeId === v.youtubeId)!;
      const title = f.cible.title ?? v.anciensTitres[0];
      rows.push({ id: `cmseed${v.seedId}`, youtubeId: v.youtubeId, title, channelName: "ancienne", duration: "PT5M", description: f.cible.description, learnings: [...f.cible.learnings], exercise: f.cible.exercise });
    }
    const r = await run(fichier);
    expect(r).toMatchObject({ updated: 3, done: 4, refused: 0, pending: 0, missing: 0, failed: 0 });
    for (const row of rows) {
      const v = videos.find((x) => `cmseed${x.seedId}` === row.id)!;
      expect(row).toMatchObject({ youtubeId: v.cible.youtubeId, title: v.cible.title, channelName: v.cible.channelName, duration: "", description: v.cible.description, learnings: v.cible.learnings, exercise: v.cible.exercise });
    }
    const second = await run(fichier);
    expect(second).toMatchObject({ updated: 0, done: 7 });
  });
});
