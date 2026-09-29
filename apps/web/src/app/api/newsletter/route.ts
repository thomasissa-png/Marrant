import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import {
  generateOpaqueToken,
  buildConfirmUrl,
  buildUnsubscribeUrl,
  NEWSLETTER_CONSENT_TEXT,
} from "@/lib/newsletter";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Tu dois accepter pour recevoir la newsletter." }),
  }),
  source: z.string().max(120).optional(),
});

const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "Deviens Marrant <noreply@deviens-marrant.fr>";

function getBaseUrl(request: NextRequest): string {
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("host") ?? "deviens-marrant.fr";
  return `${proto}://${host}`;
}

async function sendConfirmationEmail(
  email: string,
  confirmUrl: string,
  unsubscribeUrl: string,
): Promise<{ sent: boolean; reason?: string }> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_dummy") {
    return { sent: false, reason: "resend-not-configured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Confirme ton inscription — Deviens Marrant",
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="margin-bottom: 8px;">Confirme ton inscription</h2>
  <p>On a besoin d'un dernier clic pour t'envoyer une technique d'humour par semaine.</p>
  <p style="margin: 24px 0;">
    <a href="${confirmUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
      Je confirme mon email
    </a>
  </p>
  <p style="font-size: 12px; color: #666;">
    Si tu n'as jamais demandé cet email, ignore-le simplement, on ne t'ajoutera pas.
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #999;">
    L'Équipe Deviens Marrant · <a href="${unsubscribeUrl}" style="color:#999;">Se désinscrire</a>
  </p>
</body>
</html>`,
    });
    return { sent: true };
  } catch (err) {
    console.error("[Newsletter] Envoi email confirmation échoué :", err);
    return { sent: false, reason: "send-failed" };
  }
}

export async function POST(request: NextRequest) {
  // Rate limit : 5 tentatives / heure / IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`newsletter:${ip}`, { maxRequests: 5, windowMs: 3600_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans une heure." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return NextResponse.json(
      { error: first?.message ?? "Données invalides." },
      { status: 400 },
    );
  }
  const { email, source } = parsed.data;

  const userAgent = request.headers.get("user-agent") ?? undefined;
  const baseUrl = getBaseUrl(request);

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    // Idempotence : déjà confirmé → on répond OK sans rien renvoyer
    if (existing?.status === "CONFIRMED") {
      return NextResponse.json(
        {
          success: true,
          alreadySubscribed: true,
          message: "Tu es déjà inscrit. On te retrouve dans ta boîte mail.",
        },
        { status: 200 },
      );
    }

    // Nouvelle inscription (ou pending / unsubscribed → réactiver)
    const confirmationToken = generateOpaqueToken();
    const unsubscribeToken = existing?.unsubscribeToken ?? generateOpaqueToken();

    const record = existing
      ? await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            status: "PENDING",
            confirmationToken,
            confirmedAt: null,
            unsubscribedAt: null,
            source: source ?? existing.source,
            consentText: NEWSLETTER_CONSENT_TEXT,
            consentAt: new Date(),
            ipAddress: ip,
            userAgent,
          },
        })
      : await prisma.newsletterSubscriber.create({
          data: {
            email,
            source,
            status: "PENDING",
            consentText: NEWSLETTER_CONSENT_TEXT,
            confirmationToken,
            unsubscribeToken,
            ipAddress: ip,
            userAgent,
          },
        });

    const confirmUrl = buildConfirmUrl(baseUrl, record.confirmationToken);
    const unsubscribeUrl = buildUnsubscribeUrl(baseUrl, record.unsubscribeToken);
    const emailResult = await sendConfirmationEmail(email, confirmUrl, unsubscribeUrl);

    return NextResponse.json(
      {
        success: true,
        pending: true,
        emailSent: emailResult.sent,
        message: emailResult.sent
          ? "Regarde ta boîte mail pour confirmer."
          : "Inscription enregistrée. On te confirmera par email dès que possible.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[Newsletter] Erreur POST :", err);
    return NextResponse.json(
      { error: "Erreur serveur. Réessaie plus tard." },
      { status: 500 },
    );
  }
}
