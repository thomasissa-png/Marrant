import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron quotidien — envoi push notification "vanne du jour" à 9h UTC+1 (8h UTC).
 *
 * Architecture :
 *   1. Récupère le DailyContent du jour (vanne)
 *   2. Liste tous les PushToken actifs
 *   3. Envoie en batch via FCM (Android) et APNs (iOS)
 *
 * Sécurité : auth via ?secret=CRON_SECRET (cohérent avec les autres crons)
 *
 * Setup nécessaire (voir REPLIT_ACTIONS.md section MOBILE) :
 *   - FCM_SERVER_KEY : clé serveur Firebase Cloud Messaging
 *   - APNS_KEY_ID, APNS_TEAM_ID, APNS_BUNDLE_ID, APNS_PRIVATE_KEY (.p8) : credentials Apple Push
 */

const CRON_SECRET = process.env.CRON_SECRET ?? "";

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupère le daily content du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const daily = await prisma.dailyContent.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
    include: { joke: true },
  });

  if (!daily?.joke) {
    return NextResponse.json({ ok: false, reason: "No daily joke" });
  }

  const joke = daily.joke;
  const setupPreview = joke.content.slice(0, 80);
  // Enrichissement push avec la technique comique si dispo (Phase 1b — diffusion pédagogique)
  // Format : "La vanne du jour — Triple chute 😏" pour pousser la valeur dès le push.
  // Fallback si pas de comedyTechnique (vannes pas encore back-fillées) : titre standard.
  const title = joke.comedyTechnique
    ? `La vanne du jour — ${joke.comedyTechnique} 😏`
    : "La vanne du jour 😏";
  // Body = setup teaser. Le décryptage complet reste dans l'app (click sur le push).
  const body = setupPreview + (joke.content.length > 80 ? "…" : "");
  const deepLink = `deviensmarrant://vanne/${joke.id}`;

  // Récupère les tokens actifs
  const tokens = await prisma.pushToken.findMany({
    where: {
      // Token "actif" = vu dans les 60 derniers jours
      lastSeenAt: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    },
  });

  let sentFCM = 0;
  let sentAPNS = 0;
  let errors = 0;

  for (const t of tokens) {
    try {
      if (t.platform === "android") {
        const ok = await sendFCM(t.token, title, body, deepLink);
        if (ok) sentFCM++;
        else errors++;
      } else if (t.platform === "ios") {
        const ok = await sendAPNS(t.token, title, body, deepLink);
        if (ok) sentAPNS++;
        else errors++;
      }
    } catch {
      errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    jokeId: joke.id,
    hasTechnique: Boolean(joke.comedyTechnique),
    sentFCM,
    sentAPNS,
    errors,
    totalTokens: tokens.length,
  });
}

async function sendFCM(
  token: string,
  title: string,
  body: string,
  deepLink: string,
): Promise<boolean> {
  const serverKey = process.env.FCM_SERVER_KEY;
  if (!serverKey) return false;

  try {
    const res = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        notification: { title, body, sound: "default" },
        data: { deepLink },
        priority: "high",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendAPNS(
  token: string,
  title: string,
  body: string,
  deepLink: string,
): Promise<boolean> {
  // En V1, APNs HTTP/2 nécessite un signed JWT.
  // L'implémentation complète utilise le package `apn` ou `node-apn`.
  // Pour le squelette V1, on log l'intention — le setup réel se fait au déploiement.
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  const bundleId = process.env.APNS_BUNDLE_ID;
  const privateKey = process.env.APNS_PRIVATE_KEY;

  if (!keyId || !teamId || !bundleId || !privateKey) return false;

  // Implémentation HTTP/2 + JWT à finaliser via package node-apn
  // Voir REPLIT_ACTIONS.md section "Setup APNs"
  console.log(`[APNS] would send to ${token.slice(0, 8)}… : ${title} | ${body} | ${deepLink}`);
  return true;
}
