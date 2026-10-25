/**
 * Rebonds et plaintes Resend (s22) : protège la réputation du domaine d'envoi.
 *
 * Sur `email.bounced` PERMANENT (rebond définitif : adresse inexistante, boîte fermée) et
 * sur `email.complained` (le destinataire a cliqué « indésirable ») :
 *  - lettre mensuelle : `NewsletterSubscriber` passe en `UNSUBSCRIBED` (comme le bouton
 *    de désinscription : empreinte d'IP et navigateur effacés, trace gardée) ;
 *  - lettre de la semaine : `PremiumLetterPreference` arrêtée (`stopOrigin` `rebond` ou
 *    `plainte`) ;
 *  - compte : `User.emailOptOut = true` (rappels des parcours, prospection, lettres) ;
 *  - prospection : `CeoLead` en `OPT_OUT`.
 * Rebond temporaire (`Transient`, boîte pleine…) ou indéterminé : rien.
 *
 * Idempotent : chaque `svix-id` traité est noté (`CeoMemory`, namespace
 * `resend_evenement`, 30 jours) ; un rejeu ne refait rien et n'alerte pas deux fois. Les
 * écritures sont de toute façon conditionnelles (seulement ce qui n'est pas déjà fait).
 * Aucune adresse en clair dans les journaux ni les alertes : empreinte SHA-256 (12
 * caractères) et domaine seulement.
 */
import { createHash } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recordAdminAlert } from "@/lib/admin-alerts";

export const EVENEMENT_NAMESPACE = "resend_evenement";
const EVENEMENT_RETENTION_MS = 30 * 86_400_000;

/** Domaine du site : un rebond sur nos propres boîtes = problème de DNS/MX, jamais une désinscription. */
const DOMAINE_INTERNE = "deviens-marrant.fr";

/** Clés d'alerte : plainte et rebond interne en classe A (`email-`), rebond d'un abonné en B. */
export const CLES_DELIVRABILITE = {
  plainte: "email-plainte",
  rebondInterne: "email-rebond-interne",
  rebond: "delivrabilite-rebond-definitif",
} as const;

/** Ce que le webhook lit de l'événement Resend (le reste est ignoré). */
export const evenementResend = z.object({
  type: z.string(),
  created_at: z.string().optional(),
  data: z
    .object({
      to: z.union([z.array(z.string()), z.string()]).optional(),
      bounce: z.object({ type: z.string().optional(), subType: z.string().optional() }).partial().optional(),
    })
    .passthrough(),
});
export type EvenementResend = z.infer<typeof evenementResend>;

export type ActionEvenement = "ignore" | "rebond-temporaire" | "deja-traite" | "traite";

export interface ResultatEvenement {
  action: ActionEvenement;
  motif?: "rebond" | "plainte";
  /** Par adresse : empreinte + ce qui a changé (jamais l'adresse). */
  adresses: Array<{ empreinte: string; interne: boolean; lettre: number; hebdo: number; comptes: number; prospects: number }>;
}

export function empreinteAdresse(adresse: string): string {
  return createHash("sha256").update(adresse.trim().toLowerCase()).digest("hex").slice(0, 12);
}

function domaine(adresse: string): string {
  return adresse.split("@").pop() ?? "?";
}

/** Adresses nues, en minuscules (`"Nom <a@b.fr>"` → `a@b.fr`), sans doublon. */
export function adressesDe(to: string[] | string | undefined): string[] {
  const liste = Array.isArray(to) ? to : to ? [to] : [];
  const propres = liste
    .map((a) => (a.match(/<([^>]+)>/)?.[1] ?? a).trim().toLowerCase())
    .filter((a) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a));
  return [...new Set(propres)];
}

/** Rebond définitif : `bounce.type` vaut `Permanent` (vocabulaire SES repris par Resend). */
export function estRebondDefinitif(evt: EvenementResend): boolean {
  return (evt.data.bounce?.type ?? "").trim().toLowerCase() === "permanent";
}

async function appliquerOpposition(adresse: string, motif: "rebond" | "plainte", now: Date) {
  const email = { equals: adresse, mode: "insensitive" as const };
  const lettre = await prisma.newsletterSubscriber.updateMany({
    where: { email, status: { not: "UNSUBSCRIBED" } },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: now, ipAddress: null, userAgent: null, reconfirmRequestedAt: null },
  });
  const comptes = await prisma.user.findMany({ where: { email }, select: { id: true } });
  const ids = comptes.map((c) => c.id);
  const hebdo = ids.length
    ? await prisma.premiumLetterPreference.updateMany({
        where: { userId: { in: ids }, enabled: true },
        data: { enabled: false, stoppedAt: now, stopOrigin: motif },
      })
    : { count: 0 };
  const optOut = ids.length
    ? await prisma.user.updateMany({ where: { id: { in: ids }, emailOptOut: false }, data: { emailOptOut: true } })
    : { count: 0 };
  const prospects = await prisma.ceoLead.updateMany({
    where: { email, optOut: false },
    data: { optOut: true, status: "OPT_OUT" },
  });
  return { lettre: lettre.count, hebdo: hebdo.count, comptes: optOut.count, prospects: prospects.count };
}

/**
 * Traite un événement Resend déjà authentifié (signature Svix vérifiée par la route).
 * Lève si la base est indisponible : la route répond 500 et Resend réessaie (le rejeu
 * est sans effet sur ce qui a déjà été écrit).
 */
export async function traiterEvenementResend(evt: EvenementResend, svixId: string, now: Date = new Date()): Promise<ResultatEvenement> {
  const motif = evt.type === "email.complained" ? "plainte" : evt.type === "email.bounced" ? "rebond" : null;
  if (!motif) return { action: "ignore", adresses: [] };
  if (motif === "rebond" && !estRebondDefinitif(evt)) return { action: "rebond-temporaire", motif, adresses: [] };

  const where = { namespace_key: { namespace: EVENEMENT_NAMESPACE, key: svixId } };
  if (await prisma.ceoMemory.findUnique({ where })) return { action: "deja-traite", motif, adresses: [] };

  const adresses: ResultatEvenement["adresses"] = [];
  for (const adresse of adressesDe(evt.data.to)) {
    const empreinte = empreinteAdresse(adresse);
    const interne = domaine(adresse) === DOMAINE_INTERNE;
    const effet = interne ? { lettre: 0, hebdo: 0, comptes: 0, prospects: 0 } : await appliquerOpposition(adresse, motif, now);
    adresses.push({ empreinte, interne, ...effet });
    console.warn(
      `[resend-events] ${motif} ${empreinte} @${domaine(adresse)}${interne ? " (boîte interne : rien désinscrit)" : ""} : lettre ${effet.lettre}, hebdo ${effet.hebdo}, compte ${effet.comptes}, prospect ${effet.prospects}.`,
    );

    const resume = `<p>Adresse : empreinte ${empreinte}, domaine ${domaine(adresse)}.</p><p>Lettre du mois désinscrite : ${effet.lettre} ; lettre de la semaine arrêtée : ${effet.hebdo} ; compte en opposition : ${effet.comptes} ; prospect en opposition : ${effet.prospects}.</p>`;
    if (interne) {
      await recordAdminAlert({
        cle: CLES_DELIVRABILITE.rebondInterne,
        sujet: motif === "plainte" ? "Plainte sur une boîte du domaine" : "Rebond définitif sur une boîte du domaine (MX ?)",
        html: `${resume}<p>À vérifier : enregistrements MX du domaine chez IONOS, boîte existante.</p>`,
        now,
      });
    } else if (motif === "plainte") {
      await recordAdminAlert({
        cle: CLES_DELIVRABILITE.plainte,
        sujet: "Un destinataire a signalé un e-mail comme indésirable",
        html: `${resume}<p>Désinscrit automatiquement de tout. Plusieurs plaintes dans la semaine : relire le dernier envoi (objet, fréquence, lien de désinscription).</p>`,
        now,
      });
    } else if (effet.lettre + effet.hebdo + effet.comptes + effet.prospects > 0) {
      await recordAdminAlert({
        cle: CLES_DELIVRABILITE.rebond,
        sujet: "Rebond définitif : adresse retirée des envois",
        html: `${resume}<p>Rien à faire si c'est isolé. Plusieurs rebonds le même jour : vérifier la liste (import, faute de frappe en série).</p>`,
        now,
      });
    }
  }

  await prisma.ceoMemory.upsert({
    where,
    create: { namespace: EVENEMENT_NAMESPACE, key: svixId, value: { type: evt.type, at: now.toISOString() }, expiresAt: new Date(now.getTime() + EVENEMENT_RETENTION_MS) },
    update: {},
  });
  return { action: "traite", motif, adresses };
}
