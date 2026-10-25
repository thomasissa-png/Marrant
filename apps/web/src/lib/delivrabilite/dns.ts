/**
 * Surveillance quotidienne SPF / DKIM / DMARC / MX du domaine d'envoi (s22).
 *
 * Interroge le DNS public par DoH (Cloudflare, format JSON) et compare à l'attendu relevé
 * le 25/10/2026. Un SPF, une clé DKIM ou un MX qui disparaît (changement chez IONOS,
 * domaine modifié par erreur) fait partir les e-mails en indésirable sans aucun bruit : ce
 * contrôle le rend visible.
 *
 * Résultat d'un jour : `ok`, `ecart` (au moins un contrôle faux) ou `echec` (DoH
 * injoignable). Mémorisé dans `CeoMemory` (namespace `email_dns`, clé `etat`) :
 *  - 1er jour hors `ok` : alerte B `delivrabilite-dns-ecart` (lue par la session) ;
 *  - 2 jours de suite : alerte A `email-dns` (point du matin de Thomas) ;
 *  - `/api/health` lit cet état (`email.dns`), sans aucun détail.
 */
export const DOH_URL = "https://cloudflare-dns.com/dns-query";
export const DOH_TIMEOUT_MS = 5_000;
export const DNS_NAMESPACE = "email_dns";
export const DNS_CLE_ETAT = "etat";
/** Au-delà, l'état est trop vieux : la surveillance ne tourne plus (`/api/health` → degraded). */
export const DNS_ETAT_MAX_AGE_MS = 72 * 3600_000;

export const CLES_DNS = { ecart: "delivrabilite-dns-ecart", alerte: "email-dns" } as const;

type TypeDns = "TXT" | "MX";
const TYPE_NUM: Record<TypeDns, number> = { TXT: 16, MX: 15 };

export interface ControleDns {
  id: string;
  libelle: string;
  nom: string;
  type: TypeDns;
  /** `valeurs` = données du type demandé, normalisées (TXT recollés, MX sans priorité ni point final). */
  valide: (valeurs: string[]) => boolean;
}

const espaces = (v: string) => v.replace(/\s+/g, " ").trim().toLowerCase();
const spf = (valeurs: string[]) => valeurs.filter((v) => /^v=spf1(\s|$)/i.test(v));
/** Un seul SPF (deux = erreur permanente chez les destinataires) et égal à l'attendu. */
const spfEgal = (attendu: string) => (valeurs: string[]) => {
  const liste = spf(valeurs);
  return liste.length === 1 && espaces(liste[0]) === espaces(attendu);
};
const mxContient = (...hotes: string[]) => (valeurs: string[]) => hotes.every((h) => valeurs.includes(h));
/** Clé DKIM présente : balise `p=` non vide (directe ou après `v=DKIM1;`). */
const cleDkim = (valeurs: string[]) => valeurs.some((v) => /(^|;\s*)p=[A-Za-z0-9+/=]{20,}/.test(v));

/** DMARC : `v=DMARC1`, `rua` présent, `p` ∈ {none, quarantine, reject} (durcissement futur accepté). */
export function dmarcValide(valeurs: string[]): boolean {
  const liste = valeurs.filter((v) => /^v=dmarc1\s*(;|$)/i.test(v));
  if (liste.length !== 1) return false;
  const balises = new Map(
    liste[0].split(";").map((b) => {
      const [k, ...r] = b.split("=");
      return [k.trim().toLowerCase(), r.join("=").trim()] as const;
    }),
  );
  return /^(none|quarantine|reject)$/i.test(balises.get("p") ?? "") && /^mailto:\S+@\S+/i.test(balises.get("rua") ?? "");
}

const DOMAINE = "deviens-marrant.fr";
export const CONTROLES_DNS: readonly ControleDns[] = [
  { id: "spf", libelle: "SPF du domaine (IONOS)", nom: DOMAINE, type: "TXT", valide: spfEgal("v=spf1 include:_spf-eu.ionos.com ~all") },
  { id: "mx", libelle: "MX du domaine (IONOS)", nom: DOMAINE, type: "MX", valide: mxContient("mx00.ionos.fr", "mx01.ionos.fr") },
  { id: "send-mx", libelle: "MX de send (retours Resend)", nom: `send.${DOMAINE}`, type: "MX", valide: mxContient("feedback-smtp.eu-west-1.amazonses.com") },
  { id: "send-spf", libelle: "SPF de send (Resend)", nom: `send.${DOMAINE}`, type: "TXT", valide: spfEgal("v=spf1 include:amazonses.com ~all") },
  { id: "dkim-resend", libelle: "DKIM Resend", nom: `resend._domainkey.${DOMAINE}`, type: "TXT", valide: cleDkim },
  { id: "dkim-ionos-1", libelle: "DKIM IONOS s1", nom: `s1-ionos._domainkey.${DOMAINE}`, type: "TXT", valide: cleDkim },
  { id: "dkim-ionos-2", libelle: "DKIM IONOS s2", nom: `s2-ionos._domainkey.${DOMAINE}`, type: "TXT", valide: cleDkim },
  { id: "dmarc", libelle: "DMARC", nom: `_dmarc.${DOMAINE}`, type: "TXT", valide: dmarcValide },
];

interface ReponseDoh {
  Status?: number;
  Answer?: Array<{ type?: number; data?: string }>;
}

/** TXT : `"a" "b"` → `ab` (enregistrements longs découpés). MX : `10 mx00.ionos.fr.` → `mx00.ionos.fr`. */
export function normaliser(type: TypeDns, data: string): string {
  if (type === "MX") return (data.trim().split(/\s+/).pop() ?? "").replace(/\.$/, "").toLowerCase();
  return data.trim().replace(/"\s+"/g, "").replace(/^"|"$/g, "");
}

export type FetchDoh = (url: string, init: RequestInit) => Promise<Response>;

/** Valeurs du type demandé (CNAME suivis par le résolveur). Lève si DoH injoignable ou réponse illisible. */
export async function requeteDoh(nom: string, type: TypeDns, fetchImpl: FetchDoh = fetch): Promise<string[]> {
  const url = `${DOH_URL}?name=${encodeURIComponent(nom)}&type=${type}`;
  const res = await fetchImpl(url, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(DOH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`DoH HTTP ${res.status}`);
  const corps = (await res.json()) as ReponseDoh;
  // 0 = NOERROR, 3 = NXDOMAIN (nom absent : un écart, pas une panne). Autre = panne du résolveur.
  if (corps.Status === 3) return [];
  if (corps.Status !== 0) throw new Error(`DoH Status ${String(corps.Status)}`);
  return (corps.Answer ?? []).filter((a) => a.type === TYPE_NUM[type] && typeof a.data === "string").map((a) => normaliser(type, a.data as string));
}

export type StatutDns = "ok" | "ecart" | "echec";

export interface EtatDns {
  /** Jour de Paris du contrôle (AAAA-MM-JJ). */
  jour: string;
  controleLe: string;
  statut: StatutDns;
  /** Jours consécutifs hors `ok` (0 si `ok`). */
  consecutifs: number;
  /** Identifiants des contrôles faux ou injoignables (jamais de valeur). */
  enDefaut: string[];
}

export interface DnsDb {
  ceoMemory: {
    findUnique(args: { where: { namespace_key: { namespace: string; key: string } } }): Promise<{ value: unknown } | null>;
    upsert(args: {
      where: { namespace_key: { namespace: string; key: string } };
      create: { namespace: string; key: string; value: object };
      update: { value: object };
    }): Promise<unknown>;
  };
}

export type Alerter = (a: { cle: string; sujet: string; html: string; now?: Date }) => Promise<boolean>;

const WHERE_ETAT = { namespace_key: { namespace: DNS_NAMESPACE, key: DNS_CLE_ETAT } };

function veille(jour: string): string {
  const d = new Date(`${jour}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface ResultatSurveillance {
  statut: StatutDns;
  /** `true` : DoH injoignable avant le dernier essai de la fenêtre, rien enregistré, à retenter. */
  aRetenter: boolean;
  etat: EtatDns | null;
  details: Array<{ id: string; libelle: string; resultat: "ok" | "ecart" | "echec"; observe: string[] }>;
}

/**
 * Contrôle complet, mémorisation et alertes. `dernierEssai` : un échec DoH n'est
 * enregistré qu'au dernier passage de la fenêtre (sinon on retente au tick suivant).
 */
export async function surveillerDns(
  now: Date,
  deps: { db: DnsDb; jour: string; alerter: Alerter; fetchImpl?: FetchDoh; dernierEssai?: boolean },
): Promise<ResultatSurveillance> {
  // En parallèle : 8 requêtes courtes, le tick du planificateur reste bref.
  const details: ResultatSurveillance["details"] = await Promise.all(
    CONTROLES_DNS.map(async (c) => {
      try {
        const observe = await requeteDoh(c.nom, c.type, deps.fetchImpl);
        return { id: c.id, libelle: c.libelle, resultat: c.valide(observe) ? ("ok" as const) : ("ecart" as const), observe };
      } catch {
        return { id: c.id, libelle: c.libelle, resultat: "echec" as const, observe: [] };
      }
    }),
  );
  const statut: StatutDns = details.some((d) => d.resultat === "echec") ? "echec" : details.some((d) => d.resultat === "ecart") ? "ecart" : "ok";
  if (statut === "echec" && deps.dernierEssai === false) return { statut, aRetenter: true, etat: null, details };

  const prev = (await deps.db.ceoMemory.findUnique({ where: WHERE_ETAT }))?.value as EtatDns | undefined;
  const suite = prev && prev.statut !== "ok" && (prev.jour === veille(deps.jour) || prev.jour === deps.jour);
  const consecutifs = statut === "ok" ? 0 : suite ? (prev.jour === deps.jour ? prev.consecutifs : prev.consecutifs + 1) : 1;
  const etat: EtatDns = {
    jour: deps.jour,
    controleLe: now.toISOString(),
    statut,
    consecutifs,
    enDefaut: details.filter((d) => d.resultat !== "ok").map((d) => d.id),
  };
  await deps.db.ceoMemory.upsert({ where: WHERE_ETAT, create: { ...WHERE_ETAT.namespace_key, value: { ...etat } }, update: { value: { ...etat } } });

  if (statut !== "ok") {
    const lignes = details
      .filter((d) => d.resultat !== "ok")
      .map((d) => {
        const c = CONTROLES_DNS.find((x) => x.id === d.id) as ControleDns;
        const vu = d.resultat === "echec" ? "résolveur injoignable" : d.observe.length ? d.observe.map((v) => v.slice(0, 120)).join(" | ") : "aucun enregistrement";
        return `<li>${d.libelle} (${c.type} ${c.nom}) : ${vu.replace(/</g, "&lt;")}</li>`;
      })
      .join("");
    const html = `<ul>${lignes}</ul><p>Attendu : relevé du 25/10/2026 (lib/delivrabilite/dns.ts). À vérifier dans la zone DNS chez IONOS et dans Resend › Domains.</p>`;
    if (consecutifs >= 2) {
      await deps.alerter({ cle: CLES_DNS.alerte, sujet: `DNS des e-mails en écart depuis ${consecutifs} jours (SPF, DKIM, DMARC ou MX)`, html, now });
    } else {
      await deps.alerter({ cle: CLES_DNS.ecart, sujet: "DNS des e-mails : écart au contrôle du jour (alerte à Thomas si demain aussi)", html, now });
    }
  }
  return { statut, aRetenter: false, etat, details };
}

/** État pour `/api/health` : jamais de détail. `unknown` = aucun contrôle encore enregistré. */
export function etatDnsPourSante(etat: EtatDns | null | undefined, now: Date): "ok" | "degraded" | "unknown" {
  if (!etat || typeof etat.controleLe !== "string") return "unknown";
  if (now.getTime() - new Date(etat.controleLe).getTime() > DNS_ETAT_MAX_AGE_MS) return "degraded";
  return etat.statut === "ok" ? "ok" : "degraded";
}

/** Lecture de l'état mémorisé ; `null` si la base est illisible (ne lève jamais). */
export async function lireEtatDns(db: DnsDb): Promise<EtatDns | null> {
  try {
    return ((await db.ceoMemory.findUnique({ where: WHERE_ETAT }))?.value as EtatDns | undefined) ?? null;
  } catch {
    return null;
  }
}
