import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, hashTarget } from "../_helpers";

/**
 * POST /api/admin/ceo/reject
 * Body : { messageId: string, reason: string }
 *
 * Rejette un draft : status REJECTED + audit log avec raison.
 * La raison est obligatoire pour permettre l'amélioration des prompts.
 */

const bodySchema = z.object({
  messageId: z.string().min(1),
  reason: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Body invalide — la raison est obligatoire (1-500 chars)" },
      { status: 400 }
    );
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
      status: "REJECTED",
      requiresHumanReview: false,
      directorNote: msg.directorNote
        ? `${msg.directorNote}\n\nRejet admin : ${parsed.reason}`
        : `Rejet admin : ${parsed.reason}`,
    },
  });

  await prisma.ceoAuditLog.create({
    data: {
      action: "message_rejected",
      targetType: "outbound_message",
      targetIdHashed: hashTarget(msg.recipient),
      channel: msg.channel,
      outcome: "rejected",
      reasoning: parsed.reason.slice(0, 200),
    },
  });

  return NextResponse.json({
    ok: true,
    message: {
      id: updated.id,
      status: updated.status,
    },
  });
}
