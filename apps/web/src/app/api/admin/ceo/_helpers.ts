import { NextRequest } from "next/server";
import { createHash } from "node:crypto";

/**
 * Helpers partagés des routes /api/admin/ceo/*.
 * Auth Bearer ADMIN_PASSWORD (cohérent avec /api/admin/social, /api/admin/stats).
 */

export function verifyAdmin(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${adminPassword}`;
}

export function hashTarget(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
