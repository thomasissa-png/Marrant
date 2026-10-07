"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { TEXTES_RESET } from "@/config/textes/compte";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Ton mot de passe doit faire au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne sont pas identiques. Retape-les ?");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Quelque chose a coincé de notre côté. Réessaie.");
      }
    } catch {
      setError("Connexion perdue, réessaie");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <h1 className="mb-3 font-display text-lg font-bold text-text-primary">Nouveau mot de passe</h1>
            <p className="text-text-secondary">Ce lien est cassé ou incomplet. Pas de panique, on t&apos;en renvoie un.</p>
            <Link href="/forgot-password" className="mt-4 inline-block text-accent-link hover:underline text-sm">
              Demander un nouveau lien
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <span className="whitespace-nowrap font-display text-2xl font-bold text-gradient">
              deviens-marrant.fr
            </span>
          </Link>
          <h1 className="font-display text-lg font-bold text-text-primary">Nouveau mot de passe</h1>
          <CardDescription>
            {success
              ? "C'est bon, ton nouveau mot de passe est en place."
              : "Choisis un nouveau mot de passe."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-success">
                Tu peux te connecter avec. Essaie de t&apos;en souvenir plus longtemps que le précédent.
              </p>
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Se connecter
                </Button>
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-text-secondary">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="pr-12"
                    aria-describedby={error ? "reset-error" : undefined}
                    aria-invalid={!!error}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                    aria-label={showPassword ? TEXTES_RESET.masquerMotDePasse : TEXTES_RESET.afficherMotDePasse}
                    aria-pressed={showPassword}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      {showPassword && <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />}
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm text-text-secondary">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Retape ton mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-describedby={error ? "reset-error" : undefined}
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p id="reset-error" className="text-sm text-error" role="alert">{error}</p>
              )}
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "On enregistre…" : "Enregistrer mon nouveau mot de passe"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
