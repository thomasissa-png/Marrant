import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/email/ceo-email-footer";
import { recordAudit } from "@/lib/ai/ceo-helpers";

export const dynamic = "force-dynamic";

/**
 * Endpoint désinscription 1-clic — CPCE L34-5 + RGPD art. 21.
 *
 * Token signé HMAC vérifié → set User.emailOptOut = true + marque CeoLead
 * en OPT_OUT si présent. Réponse HTML simple (pas de framework) car
 * l'utilisateur arrive directement depuis un email.
 *
 * Idempotent : déjà désinscrit → message "déjà fait" en 200.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return htmlResponse(400, "Lien invalide", "Le lien de désinscription est incomplet.");
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return htmlResponse(
      400,
      "Lien invalide",
      "Ce lien de désinscription n'est plus valide. Contacte-nous si le problème persiste.",
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailOptOut: true },
      });
    }

    // CeoLead → OPT_OUT
    const lead = await prisma.ceoLead.findFirst({ where: { email } });
    if (lead) {
      await prisma.ceoLead.update({
        where: { id: lead.id },
        data: { status: "OPT_OUT", optOut: true },
      });
    }

    await recordAudit({
      action: "user_unsubscribe",
      targetType: user ? "user" : "lead",
      targetId: email,
      channel: "email",
      outcome: "sent",
      reasoning: "user_clicked_unsubscribe_link",
    });

    return htmlResponse(
      200,
      "Désinscription confirmée",
      "Tu es désinscrit·e des emails Deviens Marrant. À bientôt peut-être — l'Équipe Deviens Marrant.",
    );
  } catch (error) {
    console.error("[unsubscribe] Erreur :", error);
    return htmlResponse(
      500,
      "Erreur",
      "Quelque chose a coincé. Réessaie ou écris-nous à contact@deviens-marrant.fr.",
    );
  }
}

function htmlResponse(status: number, title: string, body: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${title} — Deviens Marrant</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:64px auto;padding:24px;color:#1a1a1a;text-align:center;">
  <h1 style="color:#7c3aed;">${title}</h1>
  <p style="font-size:16px;line-height:1.6;">${body}</p>
  <p style="margin-top:32px;"><a href="https://deviens-marrant.fr" style="color:#7c3aed;">Retour au site</a></p>
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
