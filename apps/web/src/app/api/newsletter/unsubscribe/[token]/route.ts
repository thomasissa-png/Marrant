import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function unsubscribe(token: string, requestUrl: string) {
  const cleaned = token?.trim();
  if (!cleaned || cleaned.length < 20 || cleaned.length > 128) {
    return NextResponse.redirect(new URL("/?newsletter=invalid", requestUrl));
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: cleaned },
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL("/?newsletter=invalid", requestUrl));
    }

    if (subscriber.status !== "UNSUBSCRIBED") {
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: {
          status: "UNSUBSCRIBED",
          unsubscribedAt: new Date(),
        },
      });
    }

    return NextResponse.redirect(new URL("/?newsletter=unsubscribed", requestUrl));
  } catch (err) {
    console.error("[Newsletter] Erreur unsubscribe :", err);
    return NextResponse.redirect(new URL("/?newsletter=error", requestUrl));
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  return unsubscribe(params.token, request.url);
}

// RFC 8058 : One-Click Unsubscribe (List-Unsubscribe-Post) → doit accepter POST
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  return unsubscribe(params.token, request.url);
}
