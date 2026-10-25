/**
 * @jest-environment node
 *
 * Surveillance DNS des e-mails (s22) : SPF, DKIM, DMARC, MX par DoH (mocké, réponses au
 * format réel de cloudflare-dns.com relevé le 25/10/2026).
 *  - Relevé du 25/10 : tout `ok`, aucune alerte.
 *  - Écart 1 jour : alerte B ; 2 jours de suite : alerte A `email-dns` (point du matin).
 *  - DoH injoignable : retenté dans la fenêtre, compté au dernier essai ; retour à `ok`.
 *  - DMARC durci (quarantine, reject) accepté ; sans rua ou p inconnu refusé.
 *  - `/api/health` : `email.dns` ok | degraded | unknown, sans détail.
 */
import {
  CONTROLES_DNS,
  dmarcValide,
  etatDnsPourSante,
  normaliser,
  surveillerDns,
  type DnsDb,
  type EtatDns,
  type FetchDoh,
} from "@/lib/delivrabilite/dns";
import { classerAlerte } from "@/lib/admin-alerts";

type Rr = { type: number; data: string };
const TXT = 16;
const MX = 15;
const CNAME = 5;

/** Zone telle que relevée le 25/10/2026 (DKIM raccourcis). */
function zoneReelle(): Record<string, { Status: number; Answer?: Rr[] }> {
  return {
    "deviens-marrant.fr|TXT": {
      Status: 0,
      Answer: [
        { type: TXT, data: '"google-site-verification=abc"' },
        { type: TXT, data: '"v=spf1 include:_spf-eu.ionos.com ~all"' },
      ],
    },
    "deviens-marrant.fr|MX": { Status: 0, Answer: [{ type: MX, data: "10 mx00.ionos.fr." }, { type: MX, data: "10 mx01.ionos.fr." }] },
    "send.deviens-marrant.fr|MX": { Status: 0, Answer: [{ type: MX, data: "10 feedback-smtp.eu-west-1.amazonses.com." }] },
    "send.deviens-marrant.fr|TXT": { Status: 0, Answer: [{ type: TXT, data: '"v=spf1 include:amazonses.com ~all"' }] },
    "resend._domainkey.deviens-marrant.fr|TXT": { Status: 0, Answer: [{ type: TXT, data: '"p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBieYvsZNNSDsrky"' }] },
    "s1-ionos._domainkey.deviens-marrant.fr|TXT": {
      Status: 0,
      Answer: [
        { type: CNAME, data: "s1.dkim.ionos.com." },
        { type: TXT, data: '"v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3Pge" "4rl6LOAi+aXyO0IA4qYt6s7GELWiIG6"' },
      ],
    },
    "s2-ionos._domainkey.deviens-marrant.fr|TXT": {
      Status: 0,
      Answer: [
        { type: CNAME, data: "s2.dkim.ionos.com." },
        { type: TXT, data: '"v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx9Zz"' },
      ],
    },
    "_dmarc.deviens-marrant.fr|TXT": {
      Status: 0,
      Answer: [{ type: TXT, data: '"v=DMARC1; p=none; rua=mailto:alex@deviens-marrant.fr; adkim=r; aspf=r; pct=100"' }],
    },
  };
}

let zone = zoneReelle();
let panne = false;
const appels: string[] = [];
const fetchDoh: FetchDoh = async (url, init) => {
  appels.push(url);
  expect(url.startsWith("https://cloudflare-dns.com/dns-query?")).toBe(true);
  expect((init.headers as Record<string, string>).accept).toBe("application/dns-json");
  if (panne) throw new Error("réseau");
  const u = new URL(url);
  const r = zone[`${u.searchParams.get("name")}|${u.searchParams.get("type")}`] ?? { Status: 3 };
  return new Response(JSON.stringify(r), { status: 200 });
};

const memoire = new Map<string, unknown>();
const db: DnsDb = {
  ceoMemory: {
    findUnique: async ({ where }) => {
      const k = `${where.namespace_key.namespace}:${where.namespace_key.key}`;
      return memoire.has(k) ? { value: memoire.get(k) } : null;
    },
    upsert: async ({ create }) => {
      memoire.set(`${create.namespace}:${create.key}`, create.value);
      return create;
    },
  },
};
const alertes: Array<{ cle: string; sujet: string; html: string }> = [];
const alerter = async (a: { cle: string; sujet: string; html: string }) => {
  alertes.push(a);
  return true;
};
const J1 = new Date("2026-10-26T04:05:00Z");
const J2 = new Date("2026-10-27T04:05:00Z");
const jour = (d: Date) => d.toISOString().slice(0, 10);
const lancer = (now: Date, dernierEssai = true) => surveillerDns(now, { db, jour: jour(now), alerter, fetchImpl: fetchDoh, dernierEssai });
const etat = () => memoire.get("email_dns:etat") as EtatDns | undefined;

beforeEach(() => {
  zone = zoneReelle();
  panne = false;
  appels.length = 0;
  memoire.clear();
  alertes.length = 0;
});

describe("contrôles DNS", () => {
  it("relevé du 25/10 : 8 contrôles ok, aucune alerte, état ok", async () => {
    const res = await lancer(J1);
    expect(res.details.map((d) => `${d.id}:${d.resultat}`)).toEqual(CONTROLES_DNS.map((c) => `${c.id}:ok`));
    expect(appels).toHaveLength(8);
    expect(etat()).toMatchObject({ statut: "ok", consecutifs: 0, enDefaut: [] });
    expect(alertes).toHaveLength(0);
  });

  it("normalisation : TXT découpé recollé, MX sans priorité ni point final", () => {
    expect(normaliser("TXT", '"v=DKIM1; p=AB" "CD"')).toBe("v=DKIM1; p=ABCD");
    expect(normaliser("MX", "10 MX00.ionos.fr.")).toBe("mx00.ionos.fr");
  });

  it.each([
    ["SPF du domaine modifié", "deviens-marrant.fr|TXT", { Status: 0, Answer: [{ type: TXT, data: '"v=spf1 ~all"' }] }, "spf"],
    ["deux SPF (erreur permanente)", "deviens-marrant.fr|TXT", { Status: 0, Answer: [{ type: TXT, data: '"v=spf1 include:_spf-eu.ionos.com ~all"' }, { type: TXT, data: '"v=spf1 -all"' }] }, "spf"],
    ["MX IONOS manquant", "deviens-marrant.fr|MX", { Status: 0, Answer: [{ type: MX, data: "10 mx00.ionos.fr." }] }, "mx"],
    ["MX de send absent (NXDOMAIN)", "send.deviens-marrant.fr|MX", { Status: 3 }, "send-mx"],
    ["clé DKIM Resend vide", "resend._domainkey.deviens-marrant.fr|TXT", { Status: 0, Answer: [{ type: TXT, data: '"p="' }] }, "dkim-resend"],
    ["DKIM IONOS s2 supprimé", "s2-ionos._domainkey.deviens-marrant.fr|TXT", { Status: 0, Answer: [] }, "dkim-ionos-2"],
    ["DMARC sans rua", "_dmarc.deviens-marrant.fr|TXT", { Status: 0, Answer: [{ type: TXT, data: '"v=DMARC1; p=none"' }] }, "dmarc"],
  ])("%s : écart détecté", async (_nom, cle, rr, id) => {
    zone[cle] = rr as { Status: number; Answer?: Rr[] };
    const res = await lancer(J1);
    expect(res.statut).toBe("ecart");
    expect(etat()?.enDefaut).toEqual([id]);
  });

  it("DMARC : p=quarantine et p=reject acceptés plus tard ; p inconnu refusé", () => {
    const base = "v=DMARC1; p=%; rua=mailto:alex@deviens-marrant.fr; adkim=r; aspf=r; pct=100";
    expect(dmarcValide([base.replace("%", "quarantine")])).toBe(true);
    expect(dmarcValide([base.replace("%", "reject")])).toBe(true);
    expect(dmarcValide([base.replace("%", "monitor")])).toBe(false);
    expect(dmarcValide(["v=spf1 ~all"])).toBe(false);
  });
});

describe("alertes : 2 jours de suite", () => {
  const casser = () => (zone["_dmarc.deviens-marrant.fr|TXT"] = { Status: 3 });

  it("écart jour 1 : alerte B seulement ; jour 2 : alerte A email-dns (point du matin)", async () => {
    casser();
    await lancer(J1);
    expect(alertes.map((a) => a.cle)).toEqual(["delivrabilite-dns-ecart"]);
    expect(classerAlerte("delivrabilite-dns-ecart").classe).toBe("B");
    await lancer(J2);
    expect(alertes.map((a) => a.cle)).toEqual(["delivrabilite-dns-ecart", "email-dns"]);
    expect(classerAlerte("email-dns").classe).toBe("A");
    expect(etat()).toMatchObject({ statut: "ecart", consecutifs: 2, enDefaut: ["dmarc"] });
    expect(alertes[1].html).toContain("DMARC");
    expect(alertes[1].sujet).toContain("2 jours");
  });

  it("écart, puis ok, puis écart : jamais 2 jours de suite, pas d'alerte A", async () => {
    casser();
    await lancer(J1);
    zone = zoneReelle();
    await lancer(J2);
    casser();
    await lancer(new Date("2026-10-28T04:05:00Z"));
    expect(alertes.map((a) => a.cle)).toEqual(["delivrabilite-dns-ecart", "delivrabilite-dns-ecart"]);
  });

  it("jour sauté (contrôle absent la veille) : le compteur repart à 1", async () => {
    casser();
    await lancer(J1);
    await lancer(new Date("2026-10-28T04:05:00Z"));
    expect(etat()?.consecutifs).toBe(1);
    expect(alertes.every((a) => a.cle === "delivrabilite-dns-ecart")).toBe(true);
  });

  it("DoH injoignable : retenté sans rien enregistrer avant le dernier essai, compté au dernier", async () => {
    panne = true;
    const tot = await lancer(J1, false);
    expect(tot).toMatchObject({ statut: "echec", aRetenter: true });
    expect(etat()).toBeUndefined();
    await lancer(new Date("2026-10-26T04:50:00Z"), true);
    expect(etat()).toMatchObject({ statut: "echec", consecutifs: 1 });
    await lancer(J2, true);
    expect(etat()?.consecutifs).toBe(2);
    expect(alertes.map((a) => a.cle)).toEqual(["delivrabilite-dns-ecart", "email-dns"]);
    expect(alertes[1].html).toContain("résolveur injoignable");
  });

  it("DoH en erreur HTTP ou Status SERVFAIL : échec, pas écart", async () => {
    zone["deviens-marrant.fr|MX"] = { Status: 2 };
    expect((await lancer(J1)).statut).toBe("echec");
  });
});

describe("/api/health : email.dns", () => {
  const now = new Date("2026-10-26T10:00:00Z");
  const e = (statut: EtatDns["statut"], controleLe = "2026-10-26T04:05:00Z"): EtatDns => ({ jour: "2026-10-26", controleLe, statut, consecutifs: statut === "ok" ? 0 : 1, enDefaut: [] });
  it("ok, degraded (écart ou échec), unknown (jamais contrôlé), degraded si contrôle trop vieux", () => {
    expect(etatDnsPourSante(e("ok"), now)).toBe("ok");
    expect(etatDnsPourSante(e("ecart"), now)).toBe("degraded");
    expect(etatDnsPourSante(e("echec"), now)).toBe("degraded");
    expect(etatDnsPourSante(null, now)).toBe("unknown");
    expect(etatDnsPourSante(e("ok", "2026-10-22T04:05:00Z"), now)).toBe("degraded");
  });
});

describe("planificateur : runEmailDnsJob", () => {
  it("hors 4h UTC : rien ; à 4h : verrou du jour, contrôle, verrou gardé ; DoH injoignable avant 4h45 : verrou relâché", async () => {
    jest.resetModules();
    const verrous = new Set<string>();
    const releaseLock = jest.fn(async (k: string) => void verrous.delete(k));
    jest.doMock("@/lib/job-lock", () => ({
      ...jest.requireActual("@/lib/job-lock"),
      tryAcquireLock: jest.fn(async (k: string) => (verrous.has(k) ? false : (verrous.add(k), true))),
      releaseLock,
    }));
    jest.doMock("@/lib/prisma", () => ({ prisma: db }));
    const recordAdminAlert = jest.fn(async () => true);
    jest.doMock("@/lib/admin-alerts", () => ({ ...jest.requireActual("@/lib/admin-alerts"), recordAdminAlert }));
    const fetchOrig = global.fetch;
    global.fetch = ((url: string, init: RequestInit) => fetchDoh(url, init)) as typeof fetch;
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    try {
      const { createSchedulerJobs } = await import("@/lib/scheduler/jobs");
      const jobs = createSchedulerJobs(jest.fn());
      await jobs.runEmailDnsJob(new Date("2026-10-26T09:00:00Z"));
      expect(appels).toHaveLength(0);

      panne = true;
      await jobs.runEmailDnsJob(new Date("2026-10-26T04:00:00Z"));
      expect(releaseLock).toHaveBeenCalledTimes(1);
      expect(etat()).toBeUndefined();

      panne = false;
      await jobs.runEmailDnsJob(new Date("2026-10-26T04:15:00Z"));
      expect(etat()).toMatchObject({ statut: "ok" });
      expect(releaseLock).toHaveBeenCalledTimes(1);
      appels.length = 0;
      await jobs.runEmailDnsJob(new Date("2026-10-26T04:30:00Z"));
      expect(appels).toHaveLength(0);
      expect(recordAdminAlert).not.toHaveBeenCalled();
    } finally {
      global.fetch = fetchOrig;
      jest.restoreAllMocks();
    }
  });
});
