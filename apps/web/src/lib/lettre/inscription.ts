/**
 * Lettre mensuelle (s21) : inscription double opt-in, confirmation, désinscription.
 * Spec : `docs/ux/lettre-inscription-s21.md` §2.3, §2.4, §7.2 ; décisions
 * `docs/legal/lettre-et-questions-s21.md` L1, L4, L5, L6.
 *
 *  - Consentement : le serveur écrit SA constante versionnée (jamais le texte du navigateur).
 *  - Preuve minimale (L4) : empreinte HMAC de l'IP, jamais l'IP ; pas d'agent utilisateur.
 *  - Anti-fuite : l'appelant renvoie la même réponse quel que soit le statut ; la
 *    différence se fait par e-mail (confirmation, ou « déjà dans la liste »).
 *  - Plafonds : 60 s entre deux e-mails, 2 confirmations au plus par inscription,
 *    1 « déjà dans la liste » par 24 h.
 *  - Seul un POST change un statut (L5) ; zéro fire-and-forget.
 */
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  LETTRE_CONFIRMATIONS_MAX,
  LETTRE_CONSENT_VERSION,
  LETTRE_DEJA_INSCRIT_HEURES,
  LETTRE_PENDING_JOURS,
  LETTRE_RENVOI_SECONDES,
} from "@/config/lettre";
import { EMAILS_LETTRE, TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { buildConfirmUrl, buildOneClickUnsubscribeUrl, buildUnsubscribeUrl, generateOpaqueToken } from "@/lib/newsletter";
import { desinscrireCompte } from "@/lib/lettre/compte";

/** Texte stocké comme preuve : version + texte exact de la case. */
export const LETTRE_CONSENT_TEXT = `${LETTRE_CONSENT_VERSION} : ${TEXTES_LETTRE.formulaire.case}`;

/** Délai d'envoi d'un e-mail transactionnel (appel externe : 5 s). */
export const LETTRE_EMAIL_TIMEOUT_MS = 5_000;

const JOUR_MS = 24 * 3600 * 1000;

export type EnvoyerEmail = (
  to: string,
  subject: string,
  text: string,
  headers?: Record<string, string>,
) => Promise<void>;

export interface InscriptionInput {
  email: string;
  source: string;
  ip: string | null;
  now?: Date;
}

/** Ce qui s'est passé (pour les tests et les journaux ; jamais renvoyé au navigateur). */
export type InscriptionIssue = "nouveau" | "renvoi" | "deja-inscrit" | "reinscrit" | "trop-tot" | "plafond";

export function normaliserEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Empreinte non réversible de l'IP (HMAC avec le secret serveur, @legal L4).
 * Secret absent ou IP inconnue : rien n'est stocké.
 */
export function empreinteIp(ip: string | null | undefined): string | null {
  const secret = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!ip || ip === "local" || !secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update(`lettre-ip:${ip}`).digest("hex").slice(0, 32);
}

export async function avecDelai<T>(promesse: Promise<T>, ms: number, libelle: string): Promise<T> {
  let minuteur: ReturnType<typeof setTimeout> | undefined;
  const delai = new Promise<never>((_, reject) => {
    minuteur = setTimeout(() => reject(new Error(`${libelle} : délai de ${ms} ms dépassé`)), ms);
  });
  try {
    return await Promise.race([promesse, delai]);
  } finally {
    if (minuteur) clearTimeout(minuteur);
  }
}

/** En-têtes RFC 2369 + RFC 8058 (désinscription en un clic). */
export function enTetesDesinscription(baseUrl: string, unsubscribeToken: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${buildOneClickUnsubscribeUrl(baseUrl, unsubscribeToken)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

function depuisMoinsDe(date: Date | null, ms: number, now: Date): boolean {
  return date !== null && now.getTime() - date.getTime() < ms;
}

function estConflitUnique(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

export async function envoyerConfirmation(envoyer: EnvoyerEmail, baseUrl: string, to: string, token: string) {
  const { sujet, corps } = EMAILS_LETTRE.confirmation;
  await avecDelai(envoyer(to, sujet, corps(buildConfirmUrl(baseUrl, token), baseUrl)), LETTRE_EMAIL_TIMEOUT_MS, "E-mail de confirmation");
}

async function envoyerDejaInscrit(envoyer: EnvoyerEmail, baseUrl: string, to: string, unsubscribeToken: string) {
  const { sujet, corps } = EMAILS_LETTRE.dejaInscrit;
  await avecDelai(
    envoyer(to, sujet, corps(buildUnsubscribeUrl(baseUrl, unsubscribeToken), baseUrl), enTetesDesinscription(baseUrl, unsubscribeToken)),
    LETTRE_EMAIL_TIMEOUT_MS,
    "E-mail déjà inscrit",
  );
}

/**
 * Inscription (ou renvoi). Lève si la base ou l'envoi échoue : l'appelant répond
 * 500 (« Ça n'a pas marché de notre côté »), sans révéler le statut de l'adresse.
 */
export async function inscrireALaLettre(
  input: InscriptionInput,
  deps: { envoyer: EnvoyerEmail; baseUrl: string },
): Promise<InscriptionIssue> {
  const now = input.now ?? new Date();
  const email = normaliserEmail(input.email);
  const preuve = { consentText: LETTRE_CONSENT_TEXT, consentAt: now, ipAddress: empreinteIp(input.ip), userAgent: null };

  let existant = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (!existant) {
    const confirmationToken = generateOpaqueToken();
    try {
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          source: input.source,
          status: "PENDING",
          confirmationToken,
          unsubscribeToken: generateOpaqueToken(),
          confirmationSentAt: now,
          confirmationSendCount: 1,
          ...preuve,
        },
      });
    } catch (err) {
      if (!estConflitUnique(err)) throw err;
      // Double envoi simultané : l'autre requête a créé la ligne.
      existant = await prisma.newsletterSubscriber.findUnique({ where: { email } });
      if (!existant) throw err;
    }
    if (!existant) {
      await envoyerConfirmation(deps.envoyer, deps.baseUrl, email, confirmationToken);
      return "nouveau";
    }
  }

  if (depuisMoinsDe(existant.confirmationSentAt, LETTRE_RENVOI_SECONDES * 1000, now)) return "trop-tot";

  if (existant.status === "CONFIRMED") {
    if (depuisMoinsDe(existant.confirmationSentAt, LETTRE_DEJA_INSCRIT_HEURES * 3600 * 1000, now)) return "plafond";
    await prisma.newsletterSubscriber.update({ where: { id: existant.id }, data: { confirmationSentAt: now } });
    await envoyerDejaInscrit(deps.envoyer, deps.baseUrl, email, existant.unsubscribeToken);
    return "deja-inscrit";
  }

  if (existant.status === "UNSUBSCRIBED") {
    // Nouvel acte positif (case + confirmation à venir) : nouveau cycle, nouveau jeton.
    const confirmationToken = generateOpaqueToken();
    await prisma.newsletterSubscriber.update({
      where: { id: existant.id },
      data: {
        status: "PENDING",
        confirmationToken,
        confirmedAt: null,
        reconfirmRequestedAt: null,
        confirmationSentAt: now,
        confirmationSendCount: 1,
        source: input.source,
        ...preuve,
      },
    });
    await envoyerConfirmation(deps.envoyer, deps.baseUrl, email, confirmationToken);
    return "reinscrit";
  }

  // PENDING : 2 e-mails de confirmation au plus par inscription (L4).
  if (existant.confirmationSendCount >= LETTRE_CONFIRMATIONS_MAX) return "plafond";
  await prisma.newsletterSubscriber.update({
    where: { id: existant.id },
    data: { confirmationSentAt: now, confirmationSendCount: { increment: 1 }, ...preuve },
  });
  await envoyerConfirmation(deps.envoyer, deps.baseUrl, email, existant.confirmationToken);
  return "renvoi";
}

export type ConfirmationResultat =
  | { statut: "confirmee"; email: string; source: string | null }
  | { statut: "invalide" };

/**
 * Confirmation (POST du bouton, jamais GET). Idempotente ; un désinscrit n'est
 * jamais réinscrit par un vieux lien ; lien expiré après 7 jours. Sert aussi à
 * la reconfirmation des 24 mois (CONFIRMED + demande en cours).
 */
export async function confirmerLettre(token: string, ip: string | null, now: Date = new Date()): Promise<ConfirmationResultat> {
  const abonne = await prisma.newsletterSubscriber.findUnique({ where: { confirmationToken: token } });
  if (!abonne || abonne.status === "UNSUBSCRIBED") return { statut: "invalide" };
  if (abonne.status === "PENDING") {
    if (now.getTime() - abonne.consentAt.getTime() > LETTRE_PENDING_JOURS * JOUR_MS) return { statut: "invalide" };
    await prisma.newsletterSubscriber.update({
      where: { id: abonne.id },
      data: { status: "CONFIRMED", confirmedAt: now, unsubscribedAt: null, ipAddress: empreinteIp(ip) ?? abonne.ipAddress },
    });
  } else if (abonne.reconfirmRequestedAt) {
    await prisma.newsletterSubscriber.update({
      where: { id: abonne.id },
      data: { confirmedAt: now, reconfirmRequestedAt: null, ipAddress: empreinteIp(ip) ?? abonne.ipAddress },
    });
  }
  return { statut: "confirmee", email: abonne.email, source: abonne.source };
}

/**
 * Désinscription (POST du bouton ou en un clic). Idempotente. Efface l'empreinte
 * d'IP ; garde adresse, dates et version du consentement (trace 3 ans, L4).
 * s22 : même lien pour la lettre du mois envoyée d'office aux comptes gratuits (`compte.ts`) :
 * jeton inconnu des inscrits par adresse → jeton du canal compte, désinscription durable.
 */
export async function desinscrireLettre(token: string, now: Date = new Date()): Promise<"desinscrit" | "invalide"> {
  const abonne = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribeToken: token } });
  if (!abonne) return (await desinscrireCompte(token, now)) ? "desinscrit" : "invalide";
  if (abonne.status !== "UNSUBSCRIBED") {
    await prisma.newsletterSubscriber.update({
      where: { id: abonne.id },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: now, ipAddress: null, userAgent: null, reconfirmRequestedAt: null },
    });
  }
  return "desinscrit";
}
