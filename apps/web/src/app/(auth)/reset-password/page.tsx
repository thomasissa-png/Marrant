"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";

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
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm text-text-secondary">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Retape ton mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {error && (
                <p className="text-sm text-error">{error}</p>
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
