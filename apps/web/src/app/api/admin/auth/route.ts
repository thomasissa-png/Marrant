import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting : 5 tentatives par IP par 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = rateLimit(`admin-auth:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives, réessayez plus tard" },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configuré" },
      { status: 500 }
    );
  }

  if (password === adminPassword) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
}
