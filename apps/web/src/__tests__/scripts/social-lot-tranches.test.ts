/**
 * @jest-environment node
 *
 * prepare-social-month.ts, lots suivants (QA cycle 1 C6, plan v2 §5 et §7) :
 * --lot libre, --debut/--fin, --pool ordonné, replis en réserve des relais
 * d'articles programmés, marqueurs, contrôle après insertion, --rollback.
 * Base simulée (PrismaClient remplacé), aucune connexion.
 */
const fake = {
  socialPost: { count: jest.fn(), createMany: jest.fn(), findMany: jest.fn(), groupBy: jest.fn(), updateMany: jest.fn() },
  $disconnect: jest.fn(),
};
jest.mock("@prisma/client", () => ({ PrismaClient: jest.fn().mockImplementation(() => fake) }));

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildLotV5, controlerLot, idDuPost } from "../../../scripts/content/social-lot-v5";
import { fichierLot } from "../../../scripts/content/social-lot-v5-export";
import {
  annulerLot, comptesParReseauSemaine, ecartsInsertion, insererLot, lireFichierLot,
} from "../../../scripts/content/social-lot-v5-insert";
import { argsLot, lirePool } from "../../../scripts/content/prepare-social-month";
import { approvedByDuLot, SAISONS } from "../../../scripts/content/social-lot-v5-config";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const META = { lot: "tranche-1b", debut: "2026-10-19", fin: "2026-11-15" };
const ARTICLES_PROGRAMMES = ARTICLES.map((a) => ({ ...a, aGarder: a.date >= "2026-10-19" }));
const lot1b = buildLotV5({ pool: catalogue(), articles: ARTICLES_PROGRAMMES, recents: [], seed: "test", ...META });

beforeEach(() => jest.clearAllMocks());

describe("arguments --lot, --debut, --fin, --pool", () => {
  it("relance-s15 garde ses bornes par défaut ; un lot libre exige ses dates", () => {
    expect(argsLot(["--lot", "relance-s15"])).toEqual({ lot: "relance-s15", debut: "2026-10-12", fin: "2027-01-03", pool: undefined });
    expect(argsLot(["--lot", "relance-s15", "--fin", "2026-10-18", "--pool", "p.txt"])).toMatchObject({ fin: "2026-10-18", pool: "p.txt" });
    expect(argsLot(["--lot", "2a"])).toMatch(/--debut et --fin/);
    expect(argsLot(["--lot", "2a", "--debut=2026-11-16", "--fin=2026-12-06"])).toEqual({ lot: "2a", debut: "2026-11-16", fin: "2026-12-06", pool: undefined });
    expect(argsLot(["--lot", "Lot 2"])).toMatch(/identifiant libre/);
    expect(argsLot(["--lot", "2a", "--debut", "2026-12-06", "--fin", "2026-11-16"])).toMatch(/après --fin/);
    expect(argsLot(["--lot", "2a", "--debut", "16/11", "--fin", "2026-12-06"])).toMatch(/AAAA-MM-JJ/);
    expect(approvedByDuLot("relance-s15")).toBe("thomas-s15");
    expect(approvedByDuLot("2a")).toBe("lot-2a");
  });

  it("lirePool : texte (commentaires, note après l'id) ou JSON, ordre conservé, doublons refusés", () => {
    expect(lirePool("# meilleures d'abord\nt010 9,1\n\nt003\nslug-a#2\n", "pool.txt")).toEqual(["t010", "t003", "slug-a#2"]);
    expect(lirePool(JSON.stringify(["t1", { id: "t2" }]), "pool.json")).toEqual(["t1", "t2"]);
    expect(() => lirePool("t1\nt1\n", "pool.txt")).toThrow(/en double/);
    expect(() => lirePool("# rien\n", "pool.txt")).toThrow(/aucun identifiant/);
  });
});

describe("lot borné --debut/--fin, identifiant libre", () => {
  it("posts seulement dans les bornes, grille complète (X 19, Instagram 19, LinkedIn 8 : silence du 11/11)", () => {
    expect(lot1b.errors).toEqual([]);
    expect(controlerLot(lot1b.posts).errors).toEqual([]);
    expect(lot1b.posts.every((p) => p.date >= META.debut && p.date <= META.fin)).toBe(true);
    const n = (pf: string) => lot1b.posts.filter((p) => p.platform === pf).length;
    expect([n("TWITTER"), n("INSTAGRAM"), n("LINKEDIN")]).toEqual([19, 19, 8]);
    expect(lot1b.posts[0].id).toBe(idDuPost(lot1b.posts[0].platform, lot1b.posts[0].date, "tranche-1b"));
    expect(lot1b.posts[0].id).not.toBe(idDuPost(lot1b.posts[0].platform, lot1b.posts[0].date));
  });

  it("--pool : tirages limités aux vannes autorisées, dans l'ordre du fichier ; identifiant inconnu signalé", () => {
    const pool = Array.from({ length: 120 }, (_, i) => `t${String(179 - i).padStart(3, "0")}`);
    const res = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...META, autorisees: [...pool, "inconnue"] });
    const tirees = res.posts.filter((p) => p.origine === "TIRAGE").flatMap((p) => p.vannes).filter((k) => /^t\d{3}$/.test(k));
    expect(tirees.length).toBeGreaterThan(20);
    expect(tirees.every((k) => pool.includes(k))).toBe(true);
    expect(tirees).toContain(pool[0]);
    expect(Math.min(...tirees.map((k) => pool.indexOf(k)))).toBe(0);
    expect(res.warnings.some((w) => /--pool : 1 identifiant\(s\) absent\(s\).*inconnue/.test(w))).toBe(true);
  });
});

describe("retour à 90 jours sur un autre réseau que la 1re diffusion (plan v3 §2)", () => {
  const pool = Array.from({ length: 120 }, (_, i) => `t${String(i).padStart(3, "0")}`);
  const recents = [{ date: "2026-07-01", sourceId: "t000", platform: "TWITTER" }];

  it("une vanne diffusée d'abord sur X il y a plus de 90 jours revient, mais jamais sur X", () => {
    const res = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents, seed: "test", ...META, autorisees: pool });
    const avec = res.posts.filter((p) => p.vannes.includes("t000"));
    expect(avec).toHaveLength(1);
    expect(avec[0].platform).not.toBe("TWITTER");
    expect(res.warnings.some((w) => /pénurie/.test(w))).toBe(false);
  });

  it("pénurie : la règle est levée avec un avertissement", () => {
    const res = buildLotV5({ pool: catalogue(), articles: [], recents, seed: "test", lot: "p", debut: "2026-10-20", fin: "2026-10-20", autorisees: ["t000"] });
    const x = res.posts.find((p) => p.platform === "TWITTER")!;
    expect(x.vannes).toEqual(["t000"]);
    expect(res.warnings).toContain("2026-10-20 TWITTER : pénurie, vanne t000 reprise sur son réseau de 1re diffusion (2026-07-01).");
  });
});

describe("replis en réserve et marqueurs (plan v2 §6, R3)", () => {
  const relais = lot1b.posts.filter((p) => p.article && ARTICLES_PROGRAMMES.find((a) => a.slug === p.article)?.aGarder);

  it("chaque relais d'un article programmé a un repli du même réseau, même créneau, sans lien, vanne absente du lot", () => {
    expect(relais.length).toBeGreaterThan(0);
    const vannesLot = new Set(lot1b.posts.flatMap((p) => p.vannes));
    for (const r of relais) {
      const repli = lot1b.replis.find((x) => x.id === r.repli)!;
      expect(repli).toMatchObject({ repliDe: r.id, platform: r.platform, scheduledAt: r.scheduledAt, lien: null, article: null });
      expect(repli.content).not.toMatch(/https?:\/\//);
      for (const k of repli.vannes) expect(vannesLot.has(k)).toBe(false);
    }
    expect(new Set(lot1b.replis.flatMap((r) => r.vannes)).size).toBe(lot1b.replis.length);
  });

  it("fichier : relais [article][repli], replis REJECTED [repli-de], posts datés [date] ; relu par lireFichierLot", () => {
    const f = fichierLot(lot1b.posts, "test", META, lot1b.replis);
    expect(f).toMatchObject({ lot: "tranche-1b", approvedBy: "lot-tranche-1b", debut: "2026-10-19", total: 46 });
    const r = relais[0];
    expect(f.posts.find((p) => p.id === r.id)!.directorNote).toMatch(new RegExp(`^\\[article:${r.article}\\] \\[repli:${r.repli}\\] Lot tranche-1b \\(`));
    expect(f.replis!.every((x) => x.status === "REJECTED" && x.directorNote.startsWith("[repli-de:"))).toBe(true);
    const dates = lot1b.posts.filter((p) => p.type === "PIVOT" || SAISONS.some((x) => x.re.test(`${p.content} ${p.cartes.join(" ")}`)));
    const marques = f.posts.filter((p) => /\[date:\d{4}-\d{2}-\d{2}\]/.test(p.directorNote));
    expect(marques.map((p) => p.id).sort()).toEqual(dates.map((p) => p.id).sort());
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lot-"));
    const ok = path.join(dir, "ok.json");
    fs.writeFileSync(ok, JSON.stringify(f));
    expect(lireFichierLot(ok).replis).toHaveLength(lot1b.replis.length);
    const ko = path.join(dir, "ko.json");
    fs.writeFileSync(ko, JSON.stringify({ ...f, replis: [{ ...f.replis![0], directorNote: "[repli-de:inconnu] x" }] }));
    expect(() => lireFichierLot(ko)).toThrow(/repli\(s\) mal formé/);
    const autre = path.join(dir, "autre.json");
    fs.writeFileSync(autre, JSON.stringify({ ...f, approvedBy: "thomas-s15" }));
    expect(() => lireFichierLot(autre)).toThrow(/approvedBy « thomas-s15 » au lieu de « lot-tranche-1b »/);
  });
});

describe("contrôle après insertion et --rollback", () => {
  const f = fichierLot(lot1b.posts, "test", META, lot1b.replis);

  it("comptes par réseau et par semaine (lundi de Paris), écarts lisibles", () => {
    const attendu = comptesParReseauSemaine([{ platform: "TWITTER", scheduledAt: "2026-10-19T10:30:00Z" }, { platform: "TWITTER", scheduledAt: "2026-10-25T23:30:00Z" }]);
    expect([...attendu]).toEqual([["TWITTER|2026-10-19", 1], ["TWITTER|2026-10-26", 1]]); // dim. 23:30 UTC = lun. 26/10 00:30 à Paris
    expect(ecartsInsertion(attendu, new Map([["TWITTER|2026-10-19", 1]]))).toEqual(["TWITTER, semaine du 2026-10-26 : attendu 1, inséré 0"]);
    expect(ecartsInsertion(attendu, attendu)).toEqual([]);
  });

  it("insererLot : refus si un autre lot occupe la période ; sinon createMany puis relecture conforme", async () => {
    fake.socialPost.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0).mockResolvedValueOnce(3);
    await expect(insererLot(f, "tcp", "postgres://x")).rejects.toThrow(/3 autre\(s\) post\(s\) actif\(s\)/);
    expect(fake.socialPost.createMany).not.toHaveBeenCalled();

    fake.socialPost.count.mockReset().mockResolvedValueOnce(0).mockResolvedValueOnce(0).mockResolvedValueOnce(0).mockResolvedValueOnce(f.replis!.length);
    fake.socialPost.createMany.mockResolvedValue({ count: f.posts.length + f.replis!.length });
    fake.socialPost.findMany.mockResolvedValue(f.posts.map((p) => ({ platform: p.platform, scheduledAt: new Date(p.scheduledAt) })));
    const res = await insererLot(f, "tcp", "postgres://x");
    expect(res).toMatchObject({ inseres: 46, ecarts: [] });
    const data = fake.socialPost.createMany.mock.calls[0][0].data as Array<{ status: string }>;
    expect(data.filter((d) => d.status === "REJECTED")).toHaveLength(f.replis!.length);
    expect(fake.$disconnect).toHaveBeenCalled();
  });

  it("insererLot : une semaine incomplète en base est signalée", async () => {
    fake.socialPost.count.mockReset().mockResolvedValueOnce(0).mockResolvedValueOnce(0).mockResolvedValueOnce(0).mockResolvedValueOnce(f.replis!.length);
    fake.socialPost.createMany.mockResolvedValue({ count: f.posts.length + f.replis!.length });
    fake.socialPost.findMany.mockResolvedValue(f.posts.slice(1).map((p) => ({ platform: p.platform, scheduledAt: new Date(p.scheduledAt) })));
    const res = await insererLot(f, "tcp", "postgres://x");
    expect(res.ecarts).toHaveLength(1);
    expect(res.ecarts[0]).toMatch(/semaine du 2026-10-19 : attendu \d+, inséré \d+/);
  });

  it("--rollback : sans --confirmer, comptes seulement ; avec, APPROVED non envoyés du lot en REJECTED, avant et après", async () => {
    fake.socialPost.groupBy.mockResolvedValue([{ status: "APPROVED", _count: { _all: 46 } }]);
    fake.socialPost.count.mockReset().mockResolvedValue(40);
    const dry = await annulerLot("tranche-1b", "tcp", "postgres://x", false, new Date("2026-10-20T08:00:00Z"));
    expect(dry).toMatchObject({ approvedBy: "lot-tranche-1b", aAnnuler: 40, annules: 0, avant: { APPROVED: 46 } });
    expect(fake.socialPost.updateMany).not.toHaveBeenCalled();

    fake.socialPost.groupBy.mockReset()
      .mockResolvedValueOnce([{ status: "APPROVED", _count: { _all: 46 } }])
      .mockResolvedValueOnce([{ status: "PUBLISHED", _count: { _all: 6 } }, { status: "REJECTED", _count: { _all: 40 } }]);
    fake.socialPost.updateMany.mockResolvedValue({ count: 40 });
    const r = await annulerLot("tranche-1b", "tcp", "postgres://x", true, new Date("2026-10-20T08:00:00Z"));
    expect(r).toMatchObject({ annules: 40, apres: { PUBLISHED: 6, REJECTED: 40 } });
    expect(fake.socialPost.updateMany.mock.calls[0][0]).toMatchObject({
      where: { approvedBy: "lot-tranche-1b", status: "APPROVED", externalId: null, publishedAt: null },
      data: { status: "REJECTED", directorNote: "Lot tranche-1b annulé (--rollback) le 2026-10-20T08:00:00.000Z." },
    });
  });
});
