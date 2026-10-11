import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { firstNameFrom } from "@/lib/emails/annual-renewal-reminder";
import { ADMIN_EMAIL, trySendTransactionalTextEmail } from "@/lib/email";
import { getClientIp, hashRateLimitKey, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { refuserSiAutreSite } from "@/lib/same-site";
import {
  CONTACT_EMAIL,
  TEXTES_RETRACTATION_FORM,
  emailAccuseRetractation,
  emailAdminRetractation,
} from "@/config/textes/paiement";

/**
 * POST /api/retractation : demande de rétractation (14 jours, L.221-18), s16.
 *
 * 1. validation zod ; 2. limitation partagée (5 par heure et par IP, 3 par jour
 * et par e-mail) ; 3. enregistrement en base AVANT toute réponse (preuve) ;
 * 4. e-mail à l'admin (date limite de remboursement, délai calculé depuis la
 * première souscription, lot G) ; 5. accusé de
 * réception au client (support durable). Un e-mail raté ne fait pas échouer la
 * demande (déjà enregistrée) : alerte A `email-envoi-retractation-*` + réponse
 * `ackSent: false` pour que le formulaire invite à écrire au contact.
 */
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  dateAchat: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  motif: z.string().trim().max(2000).optional(),
});

function parseDateAchat(raw: string | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(`${raw}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function tooMany(retryAfter: number) {
  return NextResponse.json(
    { error: TEXTES_RETRACTATION_FORM.erreurTropDeDemandes },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

export async function POST(request: Request) {
  const refus = refuserSiAutreSite(request, "POST /api/retractation");
  if (refus) return refus;
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    raw = null;
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: TEXTES_RETRACTATION_FORM.erreurValidation }, { status: 400 });
  }
  const { email } = parsed.data;
  const dateAchat = parseDateAchat(parsed.data.dateAchat || undefined);
  const motif = parsed.data.motif ? parsed.data.motif : null;

  const ip = getClientIp(request.headers);
  const parIp = await sharedRateLimit("retractation-ip", ip, { maxRequests: 5, windowMs: 3_600_000 });
  if (!parIp.allowed) return tooMany(retryAfterSeconds(parIp));
  const parEmail = await sharedRateLimit("retractation-email", email, { maxRequests: 3, windowMs: 86_400_000 });
  if (!parEmail.allowed) return tooMany(retryAfterSeconds(parEmail));

  const user = await prisma.user
    .findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      // Lot G : date de PREMIÈRE souscription (création de la ligne d'abonnement), jamais un renouvellement.
      select: { id: true, name: true, subscription: { select: { createdAt: true } } },
    })
    .catch(() => null);

  let demande: { id: string; createdAt: Date };
  try {
    demande = await prisma.retractationRequest.create({
      data: { email, userId: user?.id ?? null, purchaseDate: dateAchat, motif, ipHash: hashRateLimitKey(ip) },
      select: { id: true, createdAt: true },
    });
  } catch (err) {
    console.error("[API /retractation] Enregistrement impossible :", err);
    return NextResponse.json(
      { error: `${TEXTES_RETRACTATION_FORM.erreurServeur} ${CONTACT_EMAIL}` },
      { status: 500 },
    );
  }

  const vars = {
    email,
    dateAchat,
    motif,
    recueLe: demande.createdAt,
    reference: `R-${demande.id.slice(-8).toUpperCase()}`,
    // Lot E : prénom du compte s'il existe (« Salut Marie, »), sinon « Salut, ».
    prenom: firstNameFrom(user?.name),
    premiereSouscription: user?.subscription?.createdAt ?? null,
  };
  const admin = emailAdminRetractation({ ...vars, compteTrouve: Boolean(user) });
  const adminSent = await trySendTransactionalTextEmail(ADMIN_EMAIL, admin.subject, admin.text, "retractation-admin");
  const accuse = emailAccuseRetractation(vars);
  const ackSent = await trySendTransactionalTextEmail(email, accuse.subject, accuse.text, "retractation-accuse");

  if (adminSent || ackSent) {
    const now = new Date();
    await prisma.retractationRequest
      .update({
        where: { id: demande.id },
        data: { ...(adminSent ? { adminEmailedAt: now } : {}), ...(ackSent ? { ackEmailedAt: now } : {}) },
      })
      .catch((err: unknown) => console.error("[API /retractation] Horodatage des e-mails impossible :", err));
  }

  return NextResponse.json({ ok: true, reference: vars.reference, ackSent });
}
