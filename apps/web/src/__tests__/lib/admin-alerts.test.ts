/**
 * Alertes admin et digest quotidien (s15, 06/10/2026 : « moins d'e-mails »).
 * Classement A/B, enregistrement par clé et par jour, digest unique, rien si
 * vide, filet 48 h.
 */
import {
  type AlertDb,
  classerAlerte,
  htmlVersTexte,
  listAdminAlerts,
  recordAdminAlert,
  setDerniereLecture,
} from "@/lib/admin-alerts";
import { construireDigest, runDailyAdminDigest } from "@/lib/admin-digest";

type Row = { namespace: string; key: string; value: unknown; expiresAt?: Date | null };

function memDb(): AlertDb & { rows: Map<string, Row> } {
  const rows = new Map<string, Row>();
  const id = (w: { namespace_key: { namespace: string; key: string } }) => `${w.namespace_key.namespace}|${w.namespace_key.key}`;
  return {
    rows,
    ceoMemory: {
      findUnique: async ({ where }) => rows.get(id(where)) ?? null,
      upsert: async ({ where, create, update }) => {
        const prev = rows.get(id(where));
        rows.set(id(where), prev ? { ...prev, ...update } : { ...create });
        return null;
      },
      findMany: async ({ where }) => [...rows.values()].filter((r) => r.namespace === where.namespace),
      deleteMany: async ({ where }) => {
        for (const [k, r] of rows) if (r.namespace === where.namespace && r.expiresAt && r.expiresAt < where.expiresAt.lt) rows.delete(k);
        return null;
      },
    },
  };
}

/** 06/10/2026 : Paris = UTC+2. */
const PARIS_0730 = new Date("2026-10-06T05:30:00Z");
const H = 60 * 60 * 1000;

function deps(db: AlertDb) {
  const locks = new Set<string>();
  const send = jest.fn(async (_s: string, _h: string) => undefined);
  return {
    locks,
    send,
    d: {
      db,
      send,
      acquire: async (k: string) => (locks.has(k) ? false : (locks.add(k), true)),
      release: async (k: string) => {
        locks.delete(k);
      },
    },
  };
}

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("classerAlerte", () => {
  it.each([
    ["social-file-basse-x", "B", "social-file-basse", "x"],
    ["social-file-basse-instagram", "B", "social-file-basse", "instagram"],
    ["social-tranche-retard-linkedin", "B", "social-tranche-retard", "linkedin"],
    ["social-429-twitter", "B", "social-429", "twitter"],
    ["social-echec-instagram", "B", "social-echec", "instagram"],
    ["social-repli-image-linkedin", "B", "social-repli-image", "linkedin"],
    ["social-auto-pause-echecs-x", "B", "social-auto-pause-echecs", "x"],
    ["social-auto-pause-canal-instagram", "A", "social-auto-pause-canal", "instagram"],
    ["social-token-buffer", "A", "social-token-buffer", null],
    ["llm-alert-credit", "A", "llm-alert-credit", null],
    ["llm-alert-authentication", "A", "llm-alert-authentication", null],
    ["llm-alert-model_not_found", "B", "llm-alert-model_not_found", null],
    ["llm-budget", "A", "llm-budget", null],
    ["stripe-webhook-echec", "A", "stripe-webhook-echec", null],
    ["qualite-matin", "B", "qualite-matin", null],
    ["publish-social-failure-alert", "B", "publish-social-failure-alert", null],
    ["cle-inconnue", "B", "cle-inconnue", null],
  ])("%s → %s", (cle, classe, type, reseau) => {
    expect(classerAlerte(cle)).toEqual({ classe, type, reseau });
  });
});

describe("recordAdminAlert", () => {
  it("un enregistrement par clé et par jour de Paris, répétitions comptées, HTML en texte", async () => {
    const db = memDb();
    await recordAdminAlert({ cle: "social-file-basse-x", sujet: "File X basse : 3 jour(s)", html: "<p>La file <strong>X</strong> couvre 3 jours.</p>", now: new Date("2026-10-06T05:01:00Z") }, db);
    await recordAdminAlert({ cle: "social-file-basse-x", sujet: "File X basse : 2 jour(s)", html: "<p>2 jours.</p>", now: new Date("2026-10-06T06:01:00Z") }, db);
    const [a] = await listAdminAlerts(db);
    expect(await listAdminAlerts(db)).toHaveLength(1);
    expect(a).toMatchObject({ jour: "2026-10-06", classe: "B", reseau: "x", occurrences: 2, sujet: "File X basse : 2 jour(s)", detail: "2 jours.", envoyeeLe: null });
    expect(a.premiereFois).toBe("2026-10-06T05:01:00.000Z");
  });

  it("base illisible : false, ne lève jamais", async () => {
    const db = memDb();
    db.ceoMemory.findUnique = async () => {
      throw new Error("db down");
    };
    await expect(recordAdminAlert({ cle: "x", sujet: "s", html: "h" }, db)).resolves.toBe(false);
  });

  it("htmlVersTexte : listes, entités, balises", () => {
    expect(htmlVersTexte("<ol><li>Va dans Buffer &gt; API</li><li>Génère</li></ol>")).toBe("- Va dans Buffer > API\n- Génère");
  });
});

describe("digest quotidien", () => {
  it("la nuit du 05 au 06/10 (3 « file basse ») : AUCUN e-mail, tout est pour la session", async () => {
    const db = memDb();
    for (const [pf, at] of [["x", "2026-10-05T18:00:00Z"], ["instagram", "2026-10-06T03:01:00Z"], ["linkedin", "2026-10-06T03:01:00Z"]]) {
      await recordAdminAlert({ cle: `social-file-basse-${pf}`, sujet: `File ${pf} basse`, html: "<p>…</p>", now: new Date(at) }, db);
    }
    const t = deps(db);
    expect(await runDailyAdminDigest(PARIS_0730, t.d)).toEqual({ status: "rien" });
    expect(t.send).not.toHaveBeenCalled();
    expect(t.locks.size).toBe(0);
  });

  it("rien si aucune alerte", async () => {
    const t = deps(memDb());
    expect((await runDailyAdminDigest(PARIS_0730, t.d)).status).toBe("rien");
    expect(t.send).not.toHaveBeenCalled();
  });

  it("alertes A : UN seul e-mail par jour, objet clair, liste des actions", async () => {
    const db = memDb();
    await recordAdminAlert({ cle: "social-token-buffer", sujet: "Token Buffer expire", html: "<p>Régénère le token.</p>", now: new Date("2026-10-05T20:00:00Z") }, db);
    await recordAdminAlert({ cle: "social-auto-pause-canal-instagram", sujet: "Instagram mis en pause : reconnecter le canal Buffer", html: "<p>Reconnecte.</p>", now: new Date("2026-10-06T02:00:00Z") }, db);
    await recordAdminAlert({ cle: "social-file-basse-x", sujet: "File X basse", html: "<p>…</p>", now: new Date("2026-10-06T03:00:00Z") }, db);
    const t = deps(db);
    const res = await runDailyAdminDigest(PARIS_0730, t.d);
    expect(res).toMatchObject({ status: "envoye", alertes: 2, filet: false });
    expect(t.send).toHaveBeenCalledTimes(1);
    const [sujet, html] = t.send.mock.calls[0];
    expect(sujet).toBe("[Marrant] 2 action(s) pour toi (06/10/2026)");
    expect(html).toContain("Token Buffer expire");
    expect(html).toContain("reconnecter le canal Buffer");
    expect(html).not.toContain("File X basse");
    // Ticks suivants du même matin : rien de plus, même avec une nouvelle alerte A.
    await recordAdminAlert({ cle: "llm-alert-credit", sujet: "Crédit Anthropic épuisé", html: "<p>Recharge.</p>", now: new Date(PARIS_0730.getTime() + H) }, db);
    expect((await runDailyAdminDigest(new Date(PARIS_0730.getTime() + 15 * 60 * 1000), t.d)).status).toBe("deja-envoye");
    expect((await runDailyAdminDigest(new Date(PARIS_0730.getTime() + 2 * H), t.d)).status).toBe("deja-envoye");
    expect(t.send).toHaveBeenCalledTimes(1);
    // Lendemain : seule la nouvelle alerte A part (les 2 premières sont marquées envoyées).
    const t2 = deps(db);
    await runDailyAdminDigest(new Date(PARIS_0730.getTime() + 24 * H), t2.d);
    expect(t2.send).toHaveBeenCalledTimes(1);
    expect(t2.send.mock.calls[0][0]).toContain("1 action(s)");
    expect(t2.send.mock.calls[0][1]).toContain("Crédit Anthropic");
    expect(t2.send.mock.calls[0][1]).not.toContain("Token Buffer");
  });

  it("hors fenêtre (07:15 ou 10:00 Paris) : rien", async () => {
    const db = memDb();
    await recordAdminAlert({ cle: "llm-budget", sujet: "Coupe-circuit", html: "x", now: new Date("2026-10-06T01:00:00Z") }, db);
    const t = deps(db);
    expect((await runDailyAdminDigest(new Date("2026-10-06T05:15:00Z"), t.d)).status).toBe("hors-fenetre");
    expect((await runDailyAdminDigest(new Date("2026-10-06T08:00:00Z"), t.d)).status).toBe("hors-fenetre");
    expect(t.send).not.toHaveBeenCalled();
  });

  it("Resend refuse : verrou relâché, retenté au tick suivant, alertes non marquées", async () => {
    const db = memDb();
    await recordAdminAlert({ cle: "llm-budget", sujet: "Coupe-circuit", html: "x", now: new Date("2026-10-06T01:00:00Z") }, db);
    const t = deps(db);
    t.send.mockRejectedValueOnce(new Error("Resend 500"));
    expect((await runDailyAdminDigest(PARIS_0730, t.d)).status).toBe("echec");
    expect(t.locks.size).toBe(0);
    expect((await runDailyAdminDigest(new Date(PARIS_0730.getTime() + 15 * 60 * 1000), t.d)).status).toBe("envoye");
    expect(t.send).toHaveBeenCalledTimes(2);
  });
});

describe("filet 48 h", () => {
  const b = (premiere: string, derniere = premiere) => ({
    cle: "social-file-basse-x", jour: derniere.slice(0, 10), classe: "B" as const, type: "social-file-basse", reseau: "x",
    sujet: "File X basse", detail: "…", premiereFois: premiere, derniereFois: derniere, occurrences: 1, envoyeeLe: null,
  });

  it("session lue il y a 47 h : B non incluses (rien)", () => {
    expect(construireDigest([b("2026-10-05T03:00:00Z")], new Date(PARIS_0730.getTime() - 47 * H), PARIS_0730)).toBeNull();
  });

  it("aucune lecture depuis 48 h et B en attente : elles passent dans le digest", () => {
    const d = construireDigest([b("2026-10-05T03:00:00Z")], new Date(PARIS_0730.getTime() - 49 * H), PARIS_0730);
    expect(d).toMatchObject({ filet: true, actions: 0 });
    expect(d?.sujet).toBe("[Marrant] 1 alerte(s) non relue(s) par la session (06/10/2026)");
    expect(d?.html).toContain("Dernière lecture de /api/admin/alertes");
  });

  it("B déjà vues par la dernière lecture : pas de filet", () => {
    expect(construireDigest([b("2026-10-02T03:00:00Z")], new Date("2026-10-03T00:00:00Z"), PARIS_0730)).toBeNull();
  });

  it("jamais lu : le silence se compte depuis la plus ancienne B en attente", () => {
    expect(construireDigest([b(new Date(PARIS_0730.getTime() - H).toISOString())], null, PARIS_0730)).toBeNull();
    expect(construireDigest([b(new Date(PARIS_0730.getTime() - 49 * H).toISOString())], null, PARIS_0730)?.filet).toBe(true);
  });

  it("une lecture de la route remet le compteur à zéro (bout en bout)", async () => {
    const db = memDb();
    await recordAdminAlert({ cle: "social-file-basse-x", sujet: "File X basse", html: "x", now: new Date(PARIS_0730.getTime() - 50 * H) }, db);
    await setDerniereLecture(new Date(PARIS_0730.getTime() - 10 * H), db);
    const t = deps(db);
    expect((await runDailyAdminDigest(PARIS_0730, t.d)).status).toBe("rien");
  });
});
