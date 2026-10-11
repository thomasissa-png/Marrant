/**
 * Resend Inbound webhook — réceptionne les replies aux emails outbound CEO.
 *
 * Sécurité :
 *  - Auth HMAC via header `resend-signature` + secret `RESEND_WEBHOOK_SECRET`
 *  - Exempté du middleware auth cookie (cf middleware.ts matcher)
 *  - Rate limit IP (TODO Phase 5.B.3 — pour l'instant, secret HMAC suffit)
 *
 * Pipeline :
 *  1. Verify HMAC signature
 *  2. Parse payload Resend Inbound
 *  3. Find original CeoOutboundMessage par threadId/messageId
 *  4. Insert direction=INBOUND (lien original via externalId/utm)
 *  5. Update CeoLead → status=PENDING_ACTION + lastContactAt=now()
 *  6. Detect opt-out keywords (stop/désinscription/unsubscribe) → User.emailOptOut=true
 *  7. Audit log
 *
 * Routage IA des replies = Phase 5.B.3 (ce webhook persiste seulement).
 */
import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { recordAudit, maskPii } from "@/lib/ai/ceo-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Types ───────────────────────────────────────────────────────────────

interface ResendInboundPayload {
  from?: string;
  to?: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  threadId?: string;
  messageId?: string;
  inReplyTo?: string;
  references?: string[];
  receivedAt?: string;
}

// ─── HMAC verification ───────────────────────────────────────────────────

function verifyResendSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || secret.length < 16 || secret.startsWith("...")) {
    console.warn("[resend-inbound] RESEND_WEBHOOK_SECRET absent ou placeholder");
    return false;
  }
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signature.replace(/^sha256=/, "").trim();

  // timingSafeEqual exige Buffers de même longueur
  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(provided, "hex");
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

// ─── Opt-out detection ───────────────────────────────────────────────────

const OPT_OUT_KEYWORDS = [
  "stop",
  "désinscription",
  "desinscription",
  "désinscrire",
  "desinscrire",
  "désabonner",
  "desabonner",
  "désabonnement",
  "unsubscribe",
  "ne plus recevoir",
  "opt out",
  "opt-out",
];

function detectOptOut(body: string): boolean {
  const normalized = body.toLowerCase();
  return OPT_OUT_KEYWORDS.some((kw) => normalized.includes(kw));
}

// ─── Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // 1. Verify signature
  const signature = req.headers.get("resend-signature");
  if (!verifyResendSignature(rawBody, signature)) {
    console.warn("[resend-inbound] Signature invalide ou secret absent");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Parse payload
  let payload: ResendInboundPayload;
  try {
    payload = JSON.parse(rawBody) as ResendInboundPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const fromEmail = (payload.from ?? "").trim().toLowerCase();
  const body = (payload.text ?? payload.html ?? "").trim();
  if (!fromEmail || !body) {
    return NextResponse.json({ error: "missing_from_or_body" }, { status: 400 });
  }

  // 3. Find original message
  // Stratégie : threadId > inReplyTo > messageId (header) > recipient match récent
  let originalMessage = null;
  if (payload.threadId) {
    originalMessage = await prisma.ceoOutboundMessage.findFirst({
      where: { externalId: payload.threadId },
    });
  }
  if (!originalMessage && payload.inReplyTo) {
    originalMessage = await prisma.ceoOutboundMessage.findFirst({
      where: { externalId: payload.inReplyTo },
    });
  }
  if (!originalMessage) {
    // Fallback : dernier outbound vers cet email dans les 30j
    originalMessage = await prisma.ceoOutboundMessage.findFirst({
      where: {
        recipient: fromEmail,
        direction: "OUTBOUND",
        sentAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
      },
      orderBy: { sentAt: "desc" },
    });
  }

  // 4. Find / create lead
  let lead = await prisma.ceoLead.findFirst({ where: { email: fromEmail } });
  if (!lead) {
    // Lead inconnu : on insère quand même la reply pour traçabilité (rare en pratique)
    lead = await prisma.ceoLead.create({
      data: {
        email: fromEmail,
        status: "PENDING_ACTION", // équivalent "ENGAGED" dans l'enum existant
        source: "inbound_reply",
        touchpoints: 1,
      },
    });
  }

  // 5. Insert INBOUND_REPLY
  // Note Phase 5.B.2 : `parentMessageId` pas dans le schéma actuel (Phase 5.B.3
  // ajoutera la colonne ou utilisera une jointure via externalId/inReplyTo).
  // Le lien vers l'original est tracé via `externalId=payload.messageId`
  // + l'incrément `replies` sur le message d'origine.
  const reply = await prisma.ceoOutboundMessage.create({
    data: {
      channel: "EMAIL",
      direction: "INBOUND",
      recipient: fromEmail,
      subject: payload.subject ?? null,
      content: body.slice(0, 10_000), // hard cap pour éviter pollution DB
      status: "PENDING", // pas de "RECEIVED" enum — PENDING tant que non routé (5.B.3)
      leadId: lead.id,
      externalId: payload.messageId ?? null,
      utmSource: originalMessage?.utmSource ?? "ceo",
      utmCampaign: originalMessage?.utmCampaign ?? null,
      utmMedium: "email",
    },
  });

  // 6. Update original message replies counter + repliedAt
  if (originalMessage) {
    await prisma.ceoOutboundMessage
      .update({
        where: { id: originalMessage.id },
        data: { replies: { increment: 1 }, repliedAt: new Date() },
      })
      .catch((err) => console.warn("[resend-inbound] update original.replies échec :", err));
  }

  // 7. Update lead status (PENDING_ACTION = engagé, en attente d'action manuelle)
  await prisma.ceoLead.update({
    where: { id: lead.id },
    data: { status: "PENDING_ACTION", lastContactAt: new Date() },
  });

  // 8. Opt-out detection (override status PENDING_ACTION → OPT_OUT)
  const optOut = detectOptOut(body);
  if (optOut) {
    await prisma.ceoLead.update({
      where: { id: lead.id },
      data: { status: "OPT_OUT", optOut: true },
    });
    if (lead.userId) {
      await prisma.user
        .update({ where: { id: lead.userId }, data: { emailOptOut: true } })
        .catch((err) => console.warn("[resend-inbound] User opt-out update échec :", err));
    } else {
      await prisma.user
        .updateMany({ where: { email: fromEmail }, data: { emailOptOut: true } })
        .catch((err) => console.warn("[resend-inbound] User opt-out updateMany échec :", err));
    }
  }

  // 9. Audit log (PII masquée)
  await recordAudit({
    action: optOut ? "inbound_reply_opt_out" : "inbound_reply_received",
    targetType: "lead",
    targetId: maskPii(fromEmail),
    channel: "email",
    outcome: optOut ? "opt_out" : "received",
    reasoning: `replyId=${reply.id} parent=${originalMessage?.id ?? "none"}`,
  });

  return NextResponse.json({
    ok: true,
    replyId: reply.id,
    leadId: lead.id,
    optOut,
    matched: Boolean(originalMessage),
  });
}

/** GET pour healthcheck du webhook (Resend dashboard ping). */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: "ok", endpoint: "resend-inbound" });
}
