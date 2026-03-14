import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verify } from "@/lib/password";

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
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
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
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // Mettre à jour le streak à chaque connexion
        await updateStreak(user.id);
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
