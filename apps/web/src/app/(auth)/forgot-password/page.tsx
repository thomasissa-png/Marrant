"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <span className="whitespace-nowrap font-display text-2xl font-bold text-gradient">
              deviens-marrant.fr
            </span>
          </Link>
          <h1 className="font-display text-lg font-bold text-text-primary">Mot de passe oublié</h1>
          <CardDescription>
            {success
              ? "Jette un œil à ta boîte mail, le lien est en route."
              : "Donne-nous ton email, on t'envoie un lien pour en choisir un nouveau. Ça arrive aux meilleurs."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-success">
                Si un compte existe avec cet email, tu recevras un lien sous quelques minutes.
              </p>
              <Link href="/login" className="text-accent-link hover:underline text-sm">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm text-text-secondary">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ton@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-error">{error}</p>
                )}
                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                  {isLoading ? "On t'envoie ça…" : "Envoyer le lien"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-text-secondary">
                <Link href="/login" className="text-accent-link hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {/* T38 : repère de retour visible (pages plein écran sans header) */}
      <Link
        href="/"
        className="mt-4 inline-flex min-h-[44px] items-center text-sm text-text-muted hover:text-text-primary hover:underline"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
