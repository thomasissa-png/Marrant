import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, hashTarget } from "../_helpers";

/**
 * POST /api/admin/ceo/contest
 * Body : { messageId: string }
 *
 * Contestation admin (proxy art. 22 RGPD) — bloque l'envoi du draft et trace l'opposition.
 * Distinct de /api/ceo/contest (côté utilisateur final via lien dans email).
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

  const now = new Date();

  const [updatedMsg] = await prisma.$transaction([
    prisma.ceoOutboundMessage.update({
      where: { id: msg.id },
      data: {
        status: "REJECTED",
        requiresHumanReview: false,
        directorNote: `Contestation admin (art. 22 RGPD) le ${now.toISOString()}`,
      },
    }),
    prisma.ceoAuditLog.create({
      data: {
        action: "task_contested",
        targetType: "outbound_message",
        targetIdHashed: hashTarget(msg.recipient),
        channel: msg.channel,
        outcome: "rejected",
        reasoning: "Contestation admin (proxy art. 22 RGPD)",
        contestedAt: now,
      },
    }),
    // Marquer aussi la task source comme contestée si trouvable
    prisma.ceoTask.updateMany({
      where: {
        result: { path: ["messageId"], equals: msg.id },
      },
      data: { contestedAt: now },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    message: { id: updatedMsg.id, status: updatedMsg.status },
  });
}
