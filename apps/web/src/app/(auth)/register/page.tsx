"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
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
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-text-secondary">
                Prénom
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ton prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Min. 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Créer mon compte
            </Button>
            <Button type="button" variant="outline" className="w-full">
              S&apos;inscrire avec Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-text-secondary">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-accent-yellow hover:underline">
              Connecte-toi
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
