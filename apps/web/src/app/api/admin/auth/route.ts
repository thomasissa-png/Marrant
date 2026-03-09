import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configuré dans les secrets Replit" },
      { status: 500 }
    );
  }

  if (password === adminPassword) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
}
