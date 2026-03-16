import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verify } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";

async function updateStreak(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastActiveAt: true, streak: true },
    });

    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (user.lastActiveAt) {
      const lastActive = new Date(user.lastActiveAt);
      const lastActiveDay = new Date(
        lastActive.getFullYear(),
        lastActive.getMonth(),
        lastActive.getDate()
      );

      const diffDays = Math.floor(
        (today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        // Même jour — pas de changement
        return;
      } else if (diffDays === 1) {
        // Jour consécutif — incrémenter
        await prisma.user.update({
          where: { id: userId },
          data: { streak: { increment: 1 }, lastActiveAt: now },
        });
      } else {
        // Gap > 1 jour — reset
        await prisma.user.update({
          where: { id: userId },
          data: { streak: 1, lastActiveAt: now },
        });
      }
    } else {
      // Première connexion
      await prisma.user.update({
        where: { id: userId },
        data: { streak: 1, lastActiveAt: now },
      });
    }
  } catch (error) {
    console.error("[Auth] Erreur mise à jour streak:", error);
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  // Logger pour diagnostiquer les erreurs OAuth en production
  logger: {
    error(code, metadata) {
      console.error("[NextAuth][Error]", code, JSON.stringify(metadata, null, 2));
    },
    warn(code) {
      console.warn("[NextAuth][Warn]", code);
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Permettre la liaison d'un compte Google à un compte existant (même email)
      // Sécurisé car Google vérifie l'email — pas de risque d'usurpation
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        // Rate limit : 10 tentatives par email par 15 minutes
        const rl = rateLimit(`login:${email}`, { maxRequests: 10, windowMs: 15 * 60_000 });
        if (!rl.allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await verify(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
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
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.iat = Math.floor(Date.now() / 1000);
        // Mettre à jour le streak à chaque connexion
        await updateStreak(user.id);
      }

      // Pour Google OAuth : s'assurer que token.sub pointe vers l'ID DB
      if (account?.provider === "google" && user) {
        token.sub = user.id;
      }

      // Rafraîchir le plan et vérifier le mot de passe (toutes les 5 minutes max)
      if (token.sub && token.iat) {
        const now = Math.floor(Date.now() / 1000);
        const lastRefresh = (token.planRefreshedAt as number) ?? 0;
        const REFRESH_INTERVAL = 5 * 60; // 5 minutes

        if (now - lastRefresh > REFRESH_INTERVAL) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { plan: true, passwordChangedAt: true },
          });

          token.plan = dbUser?.plan ?? "FREE";
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
      console.log(`[NextAuth][Event] createUser — userId=${user.id} email=${user.email}`);
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
