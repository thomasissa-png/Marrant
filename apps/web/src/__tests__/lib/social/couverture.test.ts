/**
 * @jest-environment node
 *
 * Couverture de la file sociale (s15, QA cycles 1-2, plan v2 §5 et §8) : pause
 * après 2 FAILED consécutifs, file basse (< 10 jours), tranche en retard à J-14
 * (insérés < prévus par réseau, 9 tranches), stock < 14 sur le pool strict par
 * réseau, e-mails de lancement, de vague et de jalon, consigne du relevé (plan v3).
 * Alertes séparées par réseau et par type, 1 par jour. Base en mémoire.
 */
import {
  echecsConsecutifs, jalonsDuJour, joursCouverts, postsPrevus, runCouvertureSociale, stockEligible, tranchesAVerifier, type CouvertureDb,
} from "@/lib/social/couverture";
import { HEURE_PARIS, RESERVEES_NOEL, SOUS_HUIT, TRANCHES_SOCIALES } from "@/config/social-calendrier";
import { POOL_STRICT } from "@/config/social-pool";
import { consigneReleveHtml, rapportPublicationHtml } from "@/lib/social/publication-report";
import { ajouterJours, jourSemaine, parisVersUtc } from "@/lib/social/heure-paris";
import { buildPublishErrorNote } from "@/lib/social/publish-failure";
import type { PlatformSettingRow } from "@/lib/social/platform-switch";

interface Post { id: string; platform: string; status: string; scheduledAt: Date; updatedAt: Date; directorNote: string | null; sourceId?: string | null }
type Where = Record<string, unknown> & {
  platform?: string;
  status?: string | { in?: string[]; notIn?: string[] };
  scheduledAt?: { lte?: Date; gte?: Date; lt?: Date };
  updatedAt?: { gte: Date };
};

function filtre(posts: Post[], w: Where): Post[] {
  return posts.filter((p) => {
    if (w.platform && p.platform !== w.platform) return false;
    const src = w.sourceId as { in?: string[] } | undefined;
    if (src?.in && !src.in.includes(p.sourceId ?? "")) return false;
    if (typeof w.status === "string" && p.status !== w.status) return false;
    if (w.status && typeof w.status === "object") {
      if (w.status.in && !w.status.in.includes(p.status)) return false;
      if (w.status.notIn && w.status.notIn.includes(p.status)) return false;
    }
    const s = w.scheduledAt;
    if (s?.lte && p.scheduledAt > s.lte) return false;
    if (s?.gte && p.scheduledAt < s.gte) return false;
    if (s?.lt && p.scheduledAt >= s.lt) return false;
    if (w.updatedAt && p.updatedAt < w.updatedAt.gte) return false;
    return true;
  });
}

function fakeDb(settings: PlatformSettingRow[], posts: Post[]): CouvertureDb {
  return {
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
        const a = args as { where: Where; take?: number };
        const out = filtre(posts, a.where).sort((x, y) => y.scheduledAt.getTime() - x.scheduledAt.getTime());
        return out.slice(0, a.take ?? out.length);
      },
      update: async () => ({}),
      count: async (args: unknown) => filtre(posts, (args as { where: Where }).where).length,
    },
  };
}

const REPRISE = new Date("2026-10-12T05:00:00Z");
const actif = (platform: "TWITTER" | "INSTAGRAM" | "LINKEDIN", paused = false): PlatformSettingRow => ({
  platform, paused, reason: null, changedBy: "admin", pausedAt: null, alertSentAt: null, updatedAt: REPRISE,
});
const post = (id: string, platform: string, status: string, iso: string, note: string | null = null, maj?: string): Post => ({
  id, platform, status, scheduledAt: new Date(iso), updatedAt: new Date(maj ?? iso), directorNote: note,
});
const ECHEC = buildPublishErrorNote("Buffer API error 400: text too long");

/** Envoi simulé avec le verrou « 1 par jour et par alertJob » de sendDailyPublishFailureAlert. */
function envoi() {
  const verrous = new Set<string>();
  const sujets: Array<{ sujet: string; job: string }> = [];
  const envoyer = jest.fn(async (sujet: string, _html: string, now: Date, job: string) => {
    const cle = `${job}-${now.toISOString().slice(0, 10)}`;
    if (verrous.has(cle)) return false;
    verrous.add(cle);
    sujets.push({ sujet, job });
    return true;
  });
  return { envoyer, sujets };
}

/** File pleine (30 jours) pour les réseaux qui ne testent pas la file basse. */
const filePleine = (pf: string, now: Date) => post(`${pf}-loin`, pf, "APPROVED", new Date(now.getTime() + 30 * 86_400_000).toISOString());

/** Posts APPROVED d'un réseau sur ses jours de grille entre deux dates (heure de Paris du réseau). */
function remplir(pf: "TWITTER" | "INSTAGRAM" | "LINKEDIN", debut: string, fin: string, jours: number[], sauf = 0): Post[] {
  const out: Post[] = [];
  for (let d = debut; d <= fin; d = ajouterJours(d, 1)) {
    if (jours.includes(jourSemaine(d)) && d !== "2026-11-11" && d !== "2026-11-27") {
      out.push(post(`${pf}-${d}`, pf, "APPROVED", parisVersUtc(d, HEURE_PARIS[pf].h, HEURE_PARIS[pf].m).toISOString()));
    }
  }
  return out.slice(0, out.length - sauf);
}

describe("fonctions pures", () => {
  it("joursCouverts : 0 sans post, sinon écart en jours", () => {
    const now = new Date("2026-10-20T08:00:00Z");
    expect(joursCouverts(null, now)).toBe(0);
    expect(joursCouverts(new Date("2026-10-25T08:00:00Z"), now)).toBe(5);
  });

  it("echecsConsecutifs : 2 FAILED avec message d'échec ; un nettoyage (sans message) ne compte pas", () => {
    const f = (note: string | null) => ({ id: "a", scheduledAt: new Date(), status: "FAILED", directorNote: note });
    expect(echecsConsecutifs([f(ECHEC), f(ECHEC)])).toBe(true);
    expect(echecsConsecutifs([f(ECHEC), { ...f(null), status: "PUBLISHED" }])).toBe(false);
    expect(echecsConsecutifs([f(ECHEC), f("Lot relance-s15 (VANNE)")])).toBe(false);
    expect(echecsConsecutifs([f(ECHEC)])).toBe(false);
  });

  it("postsPrevus : totaux des tranches du plan v2 (silences 11/11 et 27/11, LinkedIn du 24/12 au 23/12)", () => {
    const total = (id: string) => {
      const t = TRANCHES_SOCIALES.find((x) => x.id === id)!;
      return (["TWITTER", "INSTAGRAM", "LINKEDIN"] as const).reduce((n, pf) => n + postsPrevus(pf, t.debut, t.fin), 0);
    };
    expect(TRANCHES_SOCIALES.map((t) => t.id)).toEqual(["1a", "1b", "2a", "2b", "3a", "3b", "4", "5", "6"]);
    expect([total("1a"), total("1b"), total("2a"), total("2b"), total("3a"), total("3b"), total("4"), total("5")]).toEqual([12, 46, 34, 48, 24, 24, 48, 48]);
    expect(postsPrevus("TWITTER", "2026-11-09", "2026-11-15")).toBe(4);
    expect(postsPrevus("LINKEDIN", "2026-12-21", "2026-12-27")).toBe(2);
  });

  it("tranchesAVerifier : de la date de prêt (J-14) à la veille du début, heure de Paris", () => {
    expect(tranchesAVerifier(new Date("2026-11-01T12:00:00Z"))).toEqual([]);
    expect(tranchesAVerifier(new Date("2026-11-01T23:30:00Z")).map((t) => t.id)).toEqual(["2a"]); // 00:30 le 02/11 à Paris
    expect(tranchesAVerifier(new Date("2026-11-15T12:00:00Z")).map((t) => t.id)).toEqual(["2a"]);
    expect(tranchesAVerifier(new Date("2026-11-23T12:00:00Z")).map((t) => t.id)).toEqual(["2b"]);
  });

  it("stockEligible : pool strict, exclusions v5, ±90 jours tous réseaux, retour interdit sur le réseau de 1re diffusion", () => {
    const now = new Date("2026-11-01T08:00:00Z");
    const pool = ["a", "b", "c", "d", SOUS_HUIT[0], "cs14jk02047ed5635bab6a52", RESERVEES_NOEL[0]];
    const diff = [
      { sourceId: "b", platform: "TWITTER", scheduledAt: new Date("2026-11-20T10:30:00Z") }, // à venir, à moins de 90 jours
      { sourceId: "c", platform: "TWITTER", scheduledAt: new Date("2026-07-01T10:30:00Z") }, // 1re diffusion sur X il y a plus de 90 jours
    ];
    expect(stockEligible(pool, diff, "TWITTER", now)).toBe(2); // a, d
    expect(stockEligible(pool, diff, "INSTAGRAM", now)).toBe(3); // a, c, d
    expect(stockEligible(pool, diff, "INSTAGRAM", new Date("2026-12-24T08:00:00Z"))).toBe(4); // + réservée Noël
  });

  it("pool strict : 40 vannes au niveau + 2 du pilote P0, sans doublon, Alexa (V100) exemptée", () => {
    expect(POOL_STRICT).toHaveLength(42);
    expect(new Set(POOL_STRICT).size).toBe(42);
  });

  it("jalonsDuJour : fiche le dimanche d'avant chaque jalon (J0 12/10) : 25/10, 08/11, 06/12, 03/01, 31/01", () => {
    const dimanches = ["2026-10-25", "2026-11-08", "2026-12-06", "2027-01-03", "2027-01-31"];
    expect(dimanches.map((d) => jalonsDuJour(new Date(`${d}T08:00:00Z`)).map((j) => j.jours))).toEqual([[14], [28], [56], [84], [112]]);
    expect(jalonsDuJour(new Date("2026-10-26T08:00:00Z"))).toEqual([]);
  });

  it("e-mail du lundi : la section sociale porte la consigne du relevé", () => {
    const html = rapportPublicationHtml({ du: "2026-10-12", au: "2026-10-18", lignes: [], totaux: {}, ecartTotal: 0 });
    expect(html).toContain("docs/social/releves/AAAA-MM-JJ.md");
    expect(consigneReleveHtml()).toContain("Relevé du lundi");
  });
});

describe("runCouvertureSociale", () => {
  const NOW = new Date("2026-10-20T08:00:00Z");

  it("2 FAILED consécutifs depuis la reprise : pause automatique + alerte « échecs »", async () => {
    const settings = [actif("TWITTER"), actif("INSTAGRAM"), actif("LINKEDIN")];
    const posts = [
      post("x1", "TWITTER", "PUBLISHED", "2026-10-15T10:30:00Z"),
      post("x2", "TWITTER", "FAILED", "2026-10-16T10:30:00Z", ECHEC),
      post("x3", "TWITTER", "FAILED", "2026-10-19T10:30:00Z", ECHEC),
      post("i1", "INSTAGRAM", "FAILED", "2026-10-16T17:30:00Z", ECHEC),
      post("i2", "INSTAGRAM", "PUBLISHED", "2026-10-19T17:30:00Z"),
      filePleine("TWITTER", NOW), filePleine("INSTAGRAM", NOW), filePleine("LINKEDIN", NOW),
    ];
    const { envoyer, sujets } = envoi();
    const res = await runCouvertureSociale(fakeDb(settings, posts), envoyer, NOW);
    expect(res.pauses).toEqual(["TWITTER"]);
    expect(settings[0]).toMatchObject({ paused: true, changedBy: "auto" });
    expect(settings[0].reason).toMatch(/^Échecs de publication consécutifs : 2 derniers posts X en FAILED \(x3, x2\)/);
    expect(settings[1].paused).toBe(false);
    expect(sujets).toEqual([{ sujet: "X mis en pause automatiquement : échecs de publication consécutifs", job: "social-auto-pause-echecs-twitter" }]);
    expect(settings[0].alertSentAt).toEqual(NOW);
  });

  it("échecs antérieurs à la reprise : pas de nouvelle pause", async () => {
    const settings = [actif("TWITTER"), actif("INSTAGRAM", true), actif("LINKEDIN", true)];
    const posts = [
      post("x2", "TWITTER", "FAILED", "2026-10-09T10:30:00Z", ECHEC, "2026-10-09T10:31:00Z"),
      post("x3", "TWITTER", "FAILED", "2026-10-10T10:30:00Z", ECHEC, "2026-10-10T10:31:00Z"),
      filePleine("TWITTER", NOW),
    ];
    const res = await runCouvertureSociale(fakeDb(settings, posts), envoi().envoyer, NOW);
    expect(res.pauses).toEqual([]);
    expect(settings[0].paused).toBe(false);
  });

  it("file basse : alerte par réseau actif (< 10 jours), aucune pour un réseau en pause, 1 par jour", async () => {
    const settings = [actif("TWITTER"), actif("INSTAGRAM", true), actif("LINKEDIN")];
    const posts = [post("x", "TWITTER", "APPROVED", "2026-10-25T10:30:00Z"), filePleine("LINKEDIN", NOW)];
    const db = fakeDb(settings, posts);
    const { envoyer, sujets } = envoi();
    const res = await runCouvertureSociale(db, envoyer, NOW);
    expect(res.fileBasse.map((f) => f.platform)).toEqual(["TWITTER"]);
    const fileBasse = sujets.filter((x) => x.job.startsWith("social-file-basse"));
    expect(fileBasse).toEqual([{ sujet: "File X basse : 5 jour(s) de posts devant", job: "social-file-basse-twitter" }]);
    expect(envoyer.mock.calls[0][1]).toContain("prepare-social-month.ts --lot");
    const avant = sujets.length;
    await runCouvertureSociale(db, envoyer, new Date(NOW.getTime() + 60 * 60 * 1000));
    expect(sujets).toHaveLength(avant);
  });

  it("file vide d'un réseau actif : alerte « 0 jour » et rappel de lancement de la tranche suivante (file < 21 jours)", async () => {
    const settings = [actif("TWITTER", true), actif("INSTAGRAM"), actif("LINKEDIN", true)];
    const { envoyer, sujets } = envoi();
    const res = await runCouvertureSociale(fakeDb(settings, []), envoyer, NOW);
    expect(sujets).toContainEqual({ sujet: "File Instagram basse : 0 jour(s) de posts devant", job: "social-file-basse-instagram" });
    expect(sujets).toContainEqual({ sujet: "Lancement de la tranche sociale 2a", job: "social-lancement-lot" });
    expect(res.lancement).toBe("2a");
  });

  it("tranche 2a à sa date de prêt (02/11) : insérés < prévus signalé par réseau ; réseau complet ou en pause : rien", async () => {
    const now = new Date("2026-11-02T08:00:00Z");
    const settings = [actif("TWITTER"), actif("INSTAGRAM"), actif("LINKEDIN", true)];
    const posts = [
      ...remplir("TWITTER", "2026-10-19", "2026-12-06", [1, 2, 3, 4, 5]),
      ...remplir("INSTAGRAM", "2026-10-19", "2026-12-06", [1, 2, 3, 4, 5], 1),
    ];
    const { envoyer, sujets } = envoi();
    const res = await runCouvertureSociale(fakeDb(settings, posts), envoyer, now);
    expect(res.tranchesEnRetard).toEqual([{ platform: "INSTAGRAM", tranche: "2a", inseres: 13, prevus: 14 }]);
    expect(sujets).toContainEqual({ sujet: "Tranche 2a Instagram en retard : 13 post(s) inséré(s) sur 14", job: "social-lot-retard-instagram" });
    expect(sujets.filter((x) => x.job.startsWith("social-lot-retard"))).toHaveLength(1);
    // 02/11 est aussi la date de lancement de la tranche 2b.
    expect(sujets).toContainEqual({ sujet: "Lancement de la tranche sociale 2b", job: "social-lancement-lot" });
  });

  it("stock < 14 par réseau actif, calculé sur le pool strict : 1 alerte par jour et par réseau", async () => {
    const settings = [actif("TWITTER"), actif("INSTAGRAM"), actif("LINKEDIN", true)];
    // 30 des 40 vannes du pool posées dans les 90 jours : 10 libres au plus.
    const posts = [
      ...POOL_STRICT.slice(0, 30).map((id, i) => ({ ...post(`p${i}`, "INSTAGRAM", "PUBLISHED", "2026-10-15T17:30:00Z"), sourceId: id })),
      filePleine("TWITTER", NOW), filePleine("INSTAGRAM", NOW),
    ];
    const db = fakeDb(settings, posts);
    const { envoyer, sujets } = envoi();
    const res = await runCouvertureSociale(db, envoyer, NOW);
    expect(res.stock.TWITTER).toBeLessThan(14);
    expect(res.stock.LINKEDIN).toBeUndefined();
    expect(sujets.map((x) => x.job).filter((j) => j.startsWith("social-stock"))).toEqual(["social-stock-twitter", "social-stock-instagram"]);
    expect(sujets.find((x) => x.job === "social-stock-twitter")!.sujet).toMatch(/^Stock de vannes X bas : \d+ vanne\(s\) éligible\(s\) \(seuil 14\)$/);
    const avant = sujets.length;
    await runCouvertureSociale(db, envoyer, NOW);
    expect(sujets).toHaveLength(avant);
  });

  it("pool intact : aucune alerte de stock", async () => {
    const settings = [actif("TWITTER"), actif("INSTAGRAM", true), actif("LINKEDIN", true)];
    const { envoyer, sujets } = envoi();
    const res = await runCouvertureSociale(fakeDb(settings, [filePleine("TWITTER", NOW)]), envoyer, NOW);
    expect(res.stock.TWITTER).toBeGreaterThanOrEqual(14);
    expect(sujets.filter((x) => x.job.startsWith("social-stock"))).toEqual([]);
  });

  it("vagues V1 à V4 : e-mail au démarrage (12/10) et à la livraison (26/10)", async () => {
    const settings = [actif("TWITTER", true), actif("INSTAGRAM", true), actif("LINKEDIN", true)];
    const d = envoi();
    await runCouvertureSociale(fakeDb(settings, []), d.envoyer, new Date("2026-10-12T06:00:00Z"));
    expect(d.sujets).toEqual([{ sujet: "Vague V1 : démarrage (34 vannes neuves pour la tranche 2a)", job: "social-vague" }]);
    expect(d.envoyer.mock.calls[0][1]).toContain("config/social-pool.ts");
    const l = envoi();
    await runCouvertureSociale(fakeDb(settings, []), l.envoyer, new Date("2026-10-26T06:00:00Z"));
    expect(l.sujets).toContainEqual({ sujet: "Vague V1 : livraison (34 vannes neuves pour la tranche 2a)", job: "social-vague" });
  });

  it("jalon : e-mail de fiche le dimanche 08/11 (J+28 le 09/11)", async () => {
    const settings = [actif("TWITTER", true), actif("INSTAGRAM", true), actif("LINKEDIN", true)];
    const { envoyer, sujets } = envoi();
    await runCouvertureSociale(fakeDb(settings, []), envoyer, new Date("2026-11-08T07:00:00Z"));
    expect(sujets).toEqual([{ sujet: "Jalon J+28 demain (09/11/2026) : fiche de décision", job: "social-jalon" }]);
    expect(envoyer.mock.calls[0][1]).toContain("Fiche de jalon");
  });

  it("date de lancement (19/10, tranche 2a) : e-mail de lancement avec la consigne, 1 par jour", async () => {
    const now = new Date("2026-10-19T06:00:00Z");
    const settings = [actif("TWITTER", true), actif("INSTAGRAM", true), actif("LINKEDIN", true)];
    const db = fakeDb(settings, []);
    const { envoyer, sujets } = envoi();
    await runCouvertureSociale(db, envoyer, now);
    expect(sujets).toEqual([{ sujet: "Lancement de la tranche sociale 2a", job: "social-lancement-lot" }]);
    expect(envoyer.mock.calls[0][1]).toContain("Tranche 2a : posts du 16/11/2026 au 06/12/2026, prête (insérée) le 02/11/2026.");
    await runCouvertureSociale(db, envoyer, new Date(now.getTime() + 3_600_000));
    expect(sujets).toHaveLength(1);
  });
});
