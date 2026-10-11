import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verify } from "@/lib/password";
import { getClientIp, sharedRateLimit } from "@/lib/rate-limit";
import { recordAuthFailureAlert } from "@/lib/admin-alerts";
import { isCloudflareWorkers } from "@/lib/runtime-env";
import { LOGIN_ERROR_CODES } from "@/config/textes/compte";

type CredentialsInput = Record<"email" | "password", string> | undefined;
type HeadersInput = Record<string, string | string[] | undefined>;

/** Fenêtres de limitation du login (s16, reco 14), partagées entre isolats. */
export const LOGIN_LIMITS = {
  parEmail: { maxRequests: 10, windowMs: 15 * 60_000 },
  parIp: { maxRequests: 30, windowMs: 15 * 60_000 },
} as const;

/**
 * Vérification e-mail + mot de passe. Retourne l'utilisateur, `null` pour des
 * identifiants incorrects (code NextAuth `CredentialsSignin`), ou lève une
 * erreur dont le message est un code lu par /login (trop d'essais, erreur
 * serveur). Aucun e-mail dans les logs (s16).
 * Compte créé avec Google (sans mot de passe) : `null`, exactement comme des
 * identifiants faux (s16 lot F, choix de Thomas) : ni l'API ni Umami ne
 * révèlent qu'un compte existe pour cette adresse.
 */
export async function authorizeCredentials(credentials: CredentialsInput, headers: HeadersInput) {
  if (!credentials?.email || !credentials?.password) {
    console.warn("[Auth][authorize] Email ou mot de passe manquant");
    return null;
  }
  const email = credentials.email.toLowerCase().trim();
  const ip = getClientIp(headers);

  const parEmail = await sharedRateLimit("login-email", email, LOGIN_LIMITS.parEmail);
  const parIp = parEmail.allowed ? await sharedRateLimit("login-ip", ip, LOGIN_LIMITS.parIp) : parEmail;
  if (!parEmail.allowed || !parIp.allowed) {
    console.warn(`[Auth][authorize] Limite atteinte (${parEmail.allowed ? "ip" : "email"})`);
    throw new Error(LOGIN_ERROR_CODES.tropDEssais);
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("[Auth][authorize] Erreur base :", error);
    throw new Error(LOGIN_ERROR_CODES.serveur);
  }
  if (!user) return null;
  if (!user.passwordHash) {
    console.warn(`[Auth][authorize] Compte sans mot de passe (Google) : ${user.id}`);
    return null;
  }

  let isValid: boolean;
  try {
    isValid = await verify(credentials.password, user.passwordHash);
  } catch (error) {
    console.error(`[Auth][authorize] Erreur vérification mot de passe : ${user.id}`, error);
    throw new Error(LOGIN_ERROR_CODES.serveur);
  }
  if (!isValid) return null;

  return { id: user.id, email: user.email, name: user.name, image: user.image };
}

/** Résumé lisible d'une métadonnée d'erreur NextAuth (Error non sérialisable par JSON). */
export function describeAuthError(metadata: unknown): string {
  if (metadata instanceof Error) return `${metadata.name}: ${metadata.message}`;
  if (metadata && typeof metadata === "object") {
    const m = metadata as { error?: unknown; message?: unknown; providerId?: unknown };
    const err = m.error instanceof Error ? `${m.error.name}: ${m.error.message}` : undefined;
    const parts = [m.providerId && `provider=${String(m.providerId)}`, err ?? (m.message && String(m.message))];
    return parts.filter(Boolean).join(" ") || "détail indisponible";
  }
  return String(metadata);
}

/** Codes NextAuth qui signalent une panne de la connexion Google (pas un choix de l'utilisateur). */
export function isOAuthFailure(code: string): boolean {
  return code.includes("OAUTH");
}

/**
 * Alerte admin (digest quotidien, clé lot A `auth-connexion-google`, classe A).
 * OAuthAccountNotLinked n'est pas journalisé par NextAuth : c'est une situation
 * de l'utilisateur (mesurée par Umami `connexion-echec`), pas une panne.
 */
export function alertOAuthFailure(code: string, detail: string): Promise<boolean> {
  return recordAuthFailureAlert(code, detail);
}

/** Garde une tâche en vie après la réponse sous Workers (sinon elle peut être coupée). */
function keepAlive(task: Promise<unknown>): void {
  if (!isCloudflareWorkers()) return;
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare") as typeof import("@opennextjs/cloudflare");
    getCloudflareContext().ctx.waitUntil(task);
  } catch {
    // Hors contexte de requête : la tâche suit son cours sans garantie.
  }
}

/**
 * Connexion : met à jour la dernière activité (stats admin, comptes actifs).
 * s17 (D3, FS-05) : la série de jours ne dépend PLUS de la connexion (la
 * session dure 30 jours, la série restait à 1). Elle est comptée sur la
 * pratique (étape validée, quiz d'étape terminé) : voir `lib/progression.ts`.
 */
async function touchLastActive(userId: string): Promise<void> {
  try {
    await prisma.user.update({ where: { id: userId }, data: { lastActiveAt: new Date() } });
  } catch (error) {
    console.error("[Auth] Erreur mise à jour de la dernière activité:", error);
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  // Logger pour diagnostiquer les erreurs OAuth en production
  logger: {
    error(code, metadata) {
      const detail = describeAuthError(metadata);
      console.error("[NextAuth][Error]", code, detail);
      if (isOAuthFailure(code)) keepAlive(alertOAuthFailure(code, detail));
    },
    warn(code) {
      console.warn("[NextAuth][Warn]", code);
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // s16 (reco 13) : plus de liaison automatique Google ↔ compte existant.
      // Les e-mails des comptes mot de passe ne sont jamais vérifiés : la liaison
      // auto permettait de préempter un compte. Cas rencontré → erreur
      // OAuthAccountNotLinked, expliquée sur /login.
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: (credentials, req) => authorizeCredentials(credentials, req?.headers ?? {}),
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as { id: string }).id = token.sub;
        (session.user as { plan?: string }).plan = (token.plan as string) ?? "FREE";
      }
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.sub = user.id;
        token.iat = Math.floor(Date.now() / 1000);
        // Dernière activité (la série de jours est comptée sur la pratique, s17)
        await touchLastActive(user.id);
        // Charger le plan immédiatement à la connexion (évite le fallback "FREE")
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { plan: true },
          });
          token.plan = dbUser?.plan ?? "FREE";
          token.planRefreshedAt = Math.floor(Date.now() / 1000);
        } catch (error) {
          console.error("[Auth] Erreur chargement plan à la connexion:", error);
        }
      }

      // Pour Google OAuth : s'assurer que token.sub pointe vers l'ID DB
      if (account?.provider === "google" && user) {
        token.sub = user.id;
      }

      // Rafraîchir le plan : immédiat si session.update() appelé, sinon toutes les 5 min
      const forceRefresh = trigger === "update";
      if (token.sub && token.iat) {
        const now = Math.floor(Date.now() / 1000);
        const lastRefresh = (token.planRefreshedAt as number) ?? 0;
        const REFRESH_INTERVAL = 5 * 60; // 5 minutes

        if (forceRefresh || now - lastRefresh > REFRESH_INTERVAL) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { plan: true, passwordChangedAt: true },
          });

          // s16 (reco 5) : compte supprimé → jeton invalidé (autres appareils).
          if (!dbUser) return { ...token, sub: undefined };

          let plan = dbUser?.plan ?? "FREE";

          // Filet de sécurité : si le plan est FREE mais qu'une subscription ACTIVE existe,
          // corriger le plan en DB (cas où le webhook Stripe a échoué)
          if (plan === "FREE") {
            const activeSub = await prisma.subscription.findUnique({
              where: { userId: token.sub },
              select: { status: true },
            });
            if (activeSub?.status === "ACTIVE") {
              await prisma.user.update({
                where: { id: token.sub },
                data: { plan: "PREMIUM" },
              });
              plan = "PREMIUM";
              console.log(`[Auth] Auto-fix: user ${token.sub} upgraded to PREMIUM (active subscription found)`);
            }
          }

          token.plan = plan;
          token.planRefreshedAt = now;

          if (dbUser?.passwordChangedAt) {
            const changedAtSec = Math.floor(dbUser.passwordChangedAt.getTime() / 1000);
            if (changedAtSec > (token.iat as number)) {
              // Mot de passe changé après l'émission du token — session invalide
              return { ...token, sub: undefined };
            }
          }
        }
      }

      return token;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[NextAuth][Event] signIn — provider=${account?.provider} userId=${user.id}`);
    },
    async createUser({ user }) {
      console.log(`[NextAuth][Event] createUser — userId=${user.id}`);
    },
    async linkAccount({ user, account }) {
      console.log(`[NextAuth][Event] linkAccount — provider=${account.provider} userId=${user.id}`);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
