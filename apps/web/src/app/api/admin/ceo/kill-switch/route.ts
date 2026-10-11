import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, hashTarget } from "../_helpers";

/**
 * POST /api/admin/ceo/kill-switch
 * Body : { enabled: boolean, reason?: string }
 *
 * Coupe ou réactive l'agent CEO. Audit trail obligatoire (RGPD art. 30).
 */

const bodySchema = z.object({
  enabled: z.boolean(),
  reason: z.string().max(500).nullable().optional(),
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

  const { enabled, reason } = parsed;

  // Si désactivation, raison requise
  if (!enabled && !reason) {
    return NextResponse.json(
      { error: "La raison est obligatoire pour couper l'agent" },
      { status: 400 }
    );
  }

  const existing = await prisma.ceoConfig.findFirst({ orderBy: { updatedAt: "desc" } });

  const updated = existing
    ? await prisma.ceoConfig.update({
        where: { id: existing.id },
        data: { enabled, killSwitchReason: enabled ? null : reason ?? null },
      })
    : await prisma.ceoConfig.create({
        data: { enabled, killSwitchReason: enabled ? null : reason ?? null },
      });

  await prisma.ceoAuditLog.create({
    data: {
      action: enabled ? "kill_switch_disabled" : "kill_switch_triggered",
      targetType: "config",
      targetIdHashed: hashTarget(updated.id),
      channel: "admin",
      outcome: "sent",
      reasoning: reason ?? "Toggle manuel admin",
    },
  });

  return NextResponse.json({
    ok: true,
    config: { ...updated, updatedAt: updated.updatedAt.toISOString() },
  });
}
