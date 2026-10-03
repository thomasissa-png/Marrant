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

  const jokesLabel = stats.jokes > 0 ? `${stats.jokes}+` : "Des";
  const tipsLabel = stats.tips > 0 ? `${stats.tips}+` : "des dizaines de";
  const videosLabel = stats.videos > 0 ? `${stats.videos}+` : "des";

  return (
    <section className="py-12 text-center md:py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-8">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Tu crois avoir tout essayé pour être drôle ?
        </h2>
        <p className="mt-2 text-text-secondary">
          {jokesLabel} vannes, {tipsLabel} conseils de pros et {videosLabel} vidéos analysées, le tout pour 4,99 € par mois, sans engagement. La seule chose que tu n&apos;as pas encore essayée pour être plus drôle.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start">
          {/* Le bouton ouvre l'inscription gratuite : libellé aligné (reco T03 validée par Thomas) */}
          <div className="flex w-full flex-col items-center gap-1 sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={() => setShowAuth(true)}>
              Créer mon compte gratuit
            </Button>
            <p className="max-w-[16rem] text-balance text-sm text-text-muted">Puis 4,99 €/mois pour tout débloquer, sans engagement</p>
          </div>
          <Link href="/vannes" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full whitespace-nowrap">
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
