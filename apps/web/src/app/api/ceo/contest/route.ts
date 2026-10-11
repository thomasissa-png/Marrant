import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/ai/ceo-helpers";

export const dynamic = "force-dynamic";

/**
 * Endpoint manuel — contestation art. 22 RGPD.
 * Permet à Thomas (admin) de marquer un CeoOutboundMessage comme contesté
 * pour blocage envoi auto + audit trail.
 *
 * Auth : Bearer ADMIN_PASSWORD (même pattern que /api/admin/*)
 * Body : { messageId: string, reason: string }
 *
 * Effets :
 *  - CeoOutboundMessage.status → "REJECTED"
 *  - CeoOutboundMessage.directorNote ← reason
 *  - CeoAuditLog row : action="message_contested"
 *  - Si task associée (CeoTask référençant ce messageId dans result.messageId) → contestedAt
 */
const contestSchema = z.object({
  messageId: z.string().min(1),
  reason: z.string().min(3).max(500),
});

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
  }

  const parsed = contestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Body invalide", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { messageId, reason } = parsed.data;

  const message = await prisma.ceoOutboundMessage.findUnique({ where: { id: messageId } });
  if (!message) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  if (message.status === "SENT") {
    return NextResponse.json(
      { error: "Message déjà envoyé — contestation impossible" },
      { status: 409 },
    );
  }

  await prisma.ceoOutboundMessage.update({
    where: { id: messageId },
    data: {
      status: "REJECTED",
      directorNote: `[CONTESTÉ] ${reason}`,
      directorValidated: false,
    },
  });

  await recordAudit({
    action: "message_contested",
    targetType: "system",
    targetId: messageId,
    channel: message.channel,
    outcome: "rejected",
    reasoning: reason.slice(0, 200),
  });

  return NextResponse.json({
    success: true,
    messageId,
    status: "REJECTED",
  });
}
