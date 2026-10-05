/**
 * Rapport « prévu contre publié » des réseaux sociaux (s15 cycle 3, K7).
 *
 * Par réseau et par jour (heure de Paris) : posts prévus, remis à Buffer,
 * confirmés publiés (lien réel), en échec, non confirmés, bloqués (en pause ou
 * en retard), à venir. Écart = prévus échus depuis plus de 6 h − confirmés :
 * il doit être à 0. Fonctions pures ; lecture Prisma dans `chargerRapport`.
 * Utilisé par l'admin (`/api/admin/social/report`) et le rapport du lundi.
 */
import type { SocialPlatform } from "@prisma/client";
import { BUFFER_CONFIRMED_PREFIX, NON_CONFIRME_APRES_MS } from "./buffer-status-check";

export interface PostRapport {
  id: string;
  platform: SocialPlatform;
  status: string;
  scheduledAt: Date;
  externalId: string | null;
  bufferStatus: string | null;
  directorNote: string | null;
}

export interface Compteurs {
  prevus: number;
  remis: number;
  confirmes: number;
  echecs: number;
  nonConfirmes: number;
  bloques: number;
  aVenir: number;
  /** Prévus échus (plus de 6 h) non confirmés : doit valoir 0. */
  ecart: number;
}

export interface LigneRapport extends Compteurs {
  jour: string; // AAAA-MM-JJ, heure de Paris
  platform: SocialPlatform;
  liens: string[];
}

export interface RapportPublication {
  du: string;
  au: string;
  lignes: LigneRapport[];
  totaux: Partial<Record<SocialPlatform, Compteurs>>;
  ecartTotal: number;
}

const vide = (): Compteurs => ({
  prevus: 0, remis: 0, confirmes: 0, echecs: 0, nonConfirmes: 0, bloques: 0, aVenir: 0, ecart: 0,
});

export function jourParis(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function estConfirme(p: Pick<PostRapport, "bufferStatus" | "directorNote">): boolean {
  return p.bufferStatus === "sent" || (p.directorNote ?? "").includes(BUFFER_CONFIRMED_PREFIX);
}

function lienConfirme(note: string | null): string | null {
  const ligne = (note ?? "").split("\n").find((l) => l.startsWith(BUFFER_CONFIRMED_PREFIX));
  const m = ligne?.match(/ : (https?:\/\/\S+)$/);
  return m ? m[1] : null;
}

function compter(c: Compteurs, p: PostRapport, now: Date): void {
  if (p.status === "REJECTED" || p.status === "PENDING") return;
  c.prevus += 1;
  const echu = now.getTime() - p.scheduledAt.getTime() > NON_CONFIRME_APRES_MS;
  const confirme = estConfirme(p);
  if (p.externalId) c.remis += 1;
  if (confirme) c.confirmes += 1;
  if (p.status === "FAILED") c.echecs += 1;
  if (p.status === "PUBLISHED" && !confirme && echu) c.nonConfirmes += 1;
  if (p.status === "APPROVED") {
    if (p.scheduledAt.getTime() <= now.getTime()) c.bloques += 1;
    else c.aVenir += 1;
  }
  if (echu && !confirme) c.ecart += 1;
}

/** Construit le rapport sur [du, au] (jours de Paris inclus). */
export function construireRapport(posts: PostRapport[], du: string, au: string, now: Date): RapportPublication {
  const lignes = new Map<string, LigneRapport>();
  const totaux: Partial<Record<SocialPlatform, Compteurs>> = {};
  for (const p of posts) {
    const jour = jourParis(p.scheduledAt);
    if (jour < du || jour > au) continue;
    const cle = `${jour}|${p.platform}`;
    const ligne = lignes.get(cle) ?? { jour, platform: p.platform, liens: [], ...vide() };
    compter(ligne, p, now);
    const lien = lienConfirme(p.directorNote);
    if (lien) ligne.liens.push(lien);
    lignes.set(cle, ligne);
    compter((totaux[p.platform] ??= vide()), p, now);
  }
  const triees = [...lignes.values()].sort((a, b) => a.jour.localeCompare(b.jour) || a.platform.localeCompare(b.platform));
  const ecartTotal = Object.values(totaux).reduce((s, c) => s + (c?.ecart ?? 0), 0);
  return { du, au, lignes: triees, totaux, ecartTotal };
}

const LABEL: Partial<Record<SocialPlatform, string>> = { TWITTER: "X", INSTAGRAM: "Instagram", LINKEDIN: "LinkedIn" };
const TD = "padding:6px 8px;border-bottom:1px solid #eee;";
const TDN = `${TD}text-align:right;`;

/** Section HTML du rapport du lundi (totaux par réseau, écart en rouge). */
export function rapportPublicationHtml(r: RapportPublication): string {
  const reseaux = Object.entries(r.totaux) as Array<[SocialPlatform, Compteurs]>;
  const titre = `<h3 style="font-size:16px;margin:24px 0 8px;">Réseaux sociaux : prévu contre publié</h3>`;
  if (reseaux.length === 0) {
    return `${titre}<p style="font-size:14px;color:#666;margin:0;">Aucun post prévu du ${r.du} au ${r.au}.</p>`;
  }
  const lignes = reseaux
    .map(([pf, c]) => `<tr><td style="${TD}">${LABEL[pf] ?? pf}</td><td style="${TDN}">${c.prevus}</td><td style="${TDN}">${c.remis}</td>
      <td style="${TDN}">${c.confirmes}</td><td style="${TDN}">${c.echecs}</td><td style="${TDN}">${c.nonConfirmes}</td>
      <td style="${TDN}">${c.bloques}</td><td style="${TDN}${c.ecart > 0 ? "color:#dc2626;font-weight:700;" : ""}">${c.ecart}</td></tr>`)
    .join("");
  const verdict = r.ecartTotal === 0
    ? `<p style="font-size:13px;color:#15803d;margin:8px 0 0;">Écart 0 : tout post prévu échu a été confirmé publié par Buffer.</p>`
    : `<p style="font-size:13px;color:#dc2626;margin:8px 0 0;">Écart ${r.ecartTotal} : posts prévus non confirmés (détail dans l'admin social).</p>`;
  return `${titre}<p style="font-size:13px;color:#666;margin:0 0 8px;">Du ${r.du} au ${r.au}, heure de Paris.</p>
  <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><th style="${TD}text-align:left;color:#666;font-weight:500;">Réseau</th><th style="${TDN}color:#666;font-weight:500;">Prévus</th>
    <th style="${TDN}color:#666;font-weight:500;">Remis</th><th style="${TDN}color:#666;font-weight:500;">Publiés</th>
    <th style="${TDN}color:#666;font-weight:500;">Échecs</th><th style="${TDN}color:#666;font-weight:500;">Non conf.</th>
    <th style="${TDN}color:#666;font-weight:500;">Bloqués</th><th style="${TDN}color:#666;font-weight:500;">Écart</th></tr>
    ${lignes}
  </table>${verdict}`;
}

/** Lecture Prisma des posts de la période (marge d'un jour pour le fuseau). */
export async function chargerRapport(du: string, au: string, now: Date = new Date()): Promise<RapportPublication> {
  const { prisma } = await import("@/lib/prisma");
  const JOUR = 86_400_000;
  const debut = new Date(new Date(`${du}T00:00:00Z`).getTime() - JOUR);
  const fin = new Date(new Date(`${au}T00:00:00Z`).getTime() + 2 * JOUR);
  const posts = await prisma.socialPost.findMany({
    where: { platform: { in: ["TWITTER", "INSTAGRAM", "LINKEDIN"] }, scheduledAt: { gte: debut, lt: fin } },
    select: { id: true, platform: true, status: true, scheduledAt: true, externalId: true, bufferStatus: true, directorNote: true },
  });
  return construireRapport(posts, du, au, now);
}
