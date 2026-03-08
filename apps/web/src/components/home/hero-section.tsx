"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="py-12 text-center md:py-20">
      <Badge variant="yellow" className="mb-4">
        Nouveau : coaching IA personnalisé
      </Badge>
      <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
        Deviens{" "}
        <span className="text-gradient">drôle</span>
        <br />
        pour de vrai.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary md:text-xl">
        Blagues, conseils de pros, vidéos stand-up et coaching IA — tout ce
        qu&apos;il faut pour maîtriser l&apos;humour et la répartie.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        {isAuthenticated ? (
          <>
            <Link href="/parcours">
              <Button variant="primary" size="lg">
                Mes parcours
              </Button>
            </Link>
            <Link href="/blagues">
              <Button variant="outline" size="lg">
                Explorer les blagues
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/onboarding">
              <Button variant="primary" size="lg">
                Découvrir mon profil humour
              </Button>
            </Link>
            <Link href="/blagues">
              <Button variant="outline" size="lg">
                Voir les blagues
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
