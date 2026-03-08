import { hash, verify } from "@/lib/password";

describe("password — hash & verify", () => {
  it("hash retourne un format salt:key", async () => {
    const hashed = await hash("monMotDePasse123");
    expect(hashed).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
  });

  it("hash génère des résultats différents pour le même mot de passe (salt unique)", async () => {
    const h1 = await hash("identique");
    const h2 = await hash("identique");
    expect(h1).not.toBe(h2);
  });

  it("verify valide un mot de passe correct", async () => {
    const password = "S3cur3P@ss!";
    const hashed = await hash(password);
    const isValid = await verify(password, hashed);
    expect(isValid).toBe(true);
  });

  it("verify rejette un mot de passe incorrect", async () => {
    const hashed = await hash("bonMotDePasse");
    const isValid = await verify("mauvaisMotDePasse", hashed);
    expect(isValid).toBe(false);
  });

  it("verify rejette un hash malformé (sans séparateur)", async () => {
    const isValid = await verify("test", "pasDeSeparateur");
    expect(isValid).toBe(false);
  });

  it("verify rejette un hash vide", async () => {
    const isValid = await verify("test", "");
    expect(isValid).toBe(false);
  });

  it("hash gère les mots de passe avec caractères spéciaux", async () => {
    const password = "àéîöü@#$%^&*()_+{}|:<>?";
    const hashed = await hash(password);
    const isValid = await verify(password, hashed);
    expect(isValid).toBe(true);
  });

  it("hash gère les mots de passe longs", async () => {
    const password = "a".repeat(1000);
    const hashed = await hash(password);
    const isValid = await verify(password, hashed);
    expect(isValid).toBe(true);
  });
});
