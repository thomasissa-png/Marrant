import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdmin, hashTarget } from "../_helpers";

/**
 * POST /api/admin/ceo/run-task
 * Body : { taskId: string }
 *
 * Force la prise en charge d'une tâche au prochain tick (set scheduledFor=now()).
 * Si la tâche est FAILED, on remet attempts à 0 pour permettre une nouvelle tentative.
 */

const bodySchema = z.object({
  taskId: z.string().min(1),
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

  const task = await prisma.ceoTask.findUnique({ where: { id: parsed.taskId } });
  if (!task) {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }

  const updated = await prisma.ceoTask.update({
    where: { id: task.id },
    data: {
      scheduledFor: new Date(),
      status: "PENDING",
      attempts: task.status === "FAILED" ? 0 : task.attempts,
      errorMessage: null,
    },
  });

  await prisma.ceoAuditLog.create({
    data: {
      action: "task_force_run",
      targetType: "task",
      targetIdHashed: hashTarget(task.id),
      channel: "admin",
      outcome: "sent",
      reasoning: `Force run admin sur tâche ${task.type}`,
    },
  });

  return NextResponse.json({
    ok: true,
    task: { ...updated, scheduledFor: updated.scheduledFor.toISOString() },
  });
}
