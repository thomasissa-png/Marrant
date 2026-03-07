"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <span className="font-display text-2xl font-bold text-gradient">
              deviensmarrant
            </span>
          </Link>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
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
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-text-secondary">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Se connecter
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Continuer avec Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-text-secondary">
            <Link href="/forgot-password" className="text-accent-yellow hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="mt-2 text-center text-sm text-text-secondary">
            Pas de compte ?{" "}
            <Link href="/register" className="text-accent-yellow hover:underline">
              Inscris-toi
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
