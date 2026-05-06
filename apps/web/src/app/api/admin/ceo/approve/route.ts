import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, hashTarget } from "../_helpers";

/**
 * POST /api/admin/ceo/approve
 * Body : { messageId: string }
 *
 * Approuve un draft : status APPROVED + requiresHumanReview=false.
 * Le cron ceo-tick prendra le relais pour l'envoi effectif.
 */

const bodySchema = z.object({
  messageId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const msg = await prisma.ceoOutboundMessage.findUnique({
    where: { id: parsed.messageId },
  });
  if (!msg) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  const updated = await prisma.ceoOutboundMessage.update({
    where: { id: msg.id },
    data: {
      status: "APPROVED",
      requiresHumanReview: false,
    },
  });

  await prisma.ceoAuditLog.create({
    data: {
      action: "message_approved",
      targetType: "outbound_message",
      targetIdHashed: hashTarget(msg.recipient),
      channel: msg.channel,
      outcome: "sent",
      reasoning: `Approbation admin — playbook ${msg.playbook ?? "n/a"}`,
    },
  });

  return NextResponse.json({
    ok: true,
    message: {
      id: updated.id,
      status: updated.status,
      requiresHumanReview: updated.requiresHumanReview,
    },
  });
}
