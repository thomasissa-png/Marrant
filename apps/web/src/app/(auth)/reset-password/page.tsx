"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
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
        setError(data.error || "Une erreur est survenue");
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
            <p className="text-text-secondary">Lien invalide ou incomplet.</p>
            <Link href="/forgot-password" className="mt-4 inline-block text-accent-primary hover:underline text-sm">
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
            <span className="font-display text-2xl font-bold text-gradient">
              deviens-marrant
            </span>
          </Link>
          <CardTitle>Nouveau mot de passe</CardTitle>
          <CardDescription>
            {success
              ? "Mot de passe mis à jour avec succes !"
              : "Choisis un nouveau mot de passe."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-success">
                Tu peux maintenant te connecter avec ton nouveau mot de passe.
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
                  placeholder="Minimum 8 caractères"
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
                {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
