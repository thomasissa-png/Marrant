import { z } from "zod";

// Réplique du schéma d'env.ts pour tester la validation
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL doit être une URL valide"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET est requis"),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  ANTHROPIC_API_KEY: z.string().optional().default(""),
  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  STRIPE_PREMIUM_PRICE_ID: z.string().optional().default(""),
  YOUTUBE_API_KEY: z.string().optional().default(""),
});

describe("envSchema — validation des variables d'environnement", () => {
  const validEnv = {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "super-secret-key",
  };

  it("accepte une configuration minimale valide", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("rejette si DATABASE_URL est manquant", () => {
    const { DATABASE_URL, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejette si DATABASE_URL est vide", () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: "" });
    expect(result.success).toBe(false);
  });

  it("rejette si NEXTAUTH_URL n'est pas une URL valide", () => {
    const result = envSchema.safeParse({ ...validEnv, NEXTAUTH_URL: "pas-une-url" });
    expect(result.success).toBe(false);
  });

  it("rejette si NEXTAUTH_SECRET est manquant", () => {
    const { NEXTAUTH_SECRET, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("applique des valeurs par défaut vides pour les optionnels", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.GOOGLE_CLIENT_ID).toBe("");
      expect(result.data.STRIPE_SECRET_KEY).toBe("");
      expect(result.data.ANTHROPIC_API_KEY).toBe("");
    }
  });

  it("accepte la configuration complète", () => {
    const fullEnv = {
      ...validEnv,
      GOOGLE_CLIENT_ID: "google-id",
      GOOGLE_CLIENT_SECRET: "google-secret",
      ANTHROPIC_API_KEY: "sk-ant-xxx",
      STRIPE_SECRET_KEY: "sk_test_xxx",
      STRIPE_PUBLISHABLE_KEY: "pk_test_xxx",
      STRIPE_WEBHOOK_SECRET: "whsec_xxx",
      STRIPE_PREMIUM_PRICE_ID: "price_xxx",
      YOUTUBE_API_KEY: "AIza_xxx",
    };
    const result = envSchema.safeParse(fullEnv);
    expect(result.success).toBe(true);
  });
});
