import { z } from "zod";

// Validation des variables d'environnement au démarrage
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL doit être une URL valide"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET est requis"),
  // Optionnels — l'app fonctionne sans mais les features sont désactivées
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  ANTHROPIC_API_KEY: z.string().optional().default(""),
  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  STRIPE_PREMIUM_PRICE_ID: z.string().optional().default(""),
  YOUTUBE_API_KEY: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "Variables d'environnement invalides :",
      result.error.flatten().fieldErrors
    );
    throw new Error("Configuration invalide — vérifiez votre fichier .env");
  }

  return result.data;
}

export const env = validateEnv();
