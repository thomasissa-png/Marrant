"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContentStats } from "@/hooks/use-content-stats";
import { AuthModal } from "@/components/auth/auth-modal";

export function HomeCta() {
  const { status } = useSession();
  const stats = useContentStats();
  const [showAuth, setShowAuth] = useState(false);

  if (status === "authenticated") return null;

  const jokesLabel = stats.jokes > 0 ? `${stats.jokes}+` : "Des centaines de";
  const tipsLabel = stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de";
  const videosLabel = stats.videos > 0 ? `${stats.videos}+` : "Des";

  return (
    <section className="py-8 text-center">
      <div className="mx-auto max-w-xl rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-8">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Prêt à devenir plus drôle ?
        </h2>
        <p className="mt-2 text-text-secondary">
          {jokesLabel} vannes, {tipsLabel} conseils de pros et {videosLabel} vidéos analysées — le tout pour moins qu&apos;un café par mois. Ton futur toi drôle te remerciera.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg" onClick={() => setShowAuth(true)}>
            Commencer à 0,99 €/mois
          </Button>
          <Link href="/vannes">
            <Button variant="outline" size="lg">
              Voir les vannes gratuites
            </Button>
          </Link>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab="register"
      />
    </section>
  );
}
