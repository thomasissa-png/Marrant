import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } },
) {
  const token = params.token?.trim();
  if (!token || token.length < 20 || token.length > 128) {
    return NextResponse.redirect(new URL("/?newsletter=invalid", _request.url));
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL("/?newsletter=invalid", _request.url));
    }

    if (subscriber.status !== "CONFIRMED") {
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
          unsubscribedAt: null,
        },
      });
    }

    return NextResponse.redirect(new URL("/?newsletter=confirmed", _request.url));
  } catch (err) {
    console.error("[Newsletter] Erreur confirm :", err);
    return NextResponse.redirect(new URL("/?newsletter=error", _request.url));
  }
}
