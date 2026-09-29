"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

/**
 * Bloc « À toi de jouer » de la page individuelle d'une vanne.
 *
 * Composant client : la page /vannes/[slug] est rendue en ISR (statique,
 * rapide pour les moteurs). Lire la session côté serveur (cookies) y est
 * interdit par Next.js (DYNAMIC_SERVER_USAGE → erreur 500). La règle freemium
 * reste celle du catalogue : l'exercice d'application est visible pour les
 * membres connectés, un CTA d'inscription sinon.
 */
export function HowToApplyGate({ howToApply }: { howToApply: string }) {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="mt-3 rounded-md border border-border bg-background-card p-3">
        <p className="text-xs font-semibold text-text-primary">À toi de jouer</p>
        <p className="mt-1 text-sm text-text-secondary">{howToApply}</p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-md border border-dashed border-accent-primary/30 bg-background-card p-3">
      <p className="text-xs font-semibold text-text-primary">À toi de jouer</p>
      <p className="mt-1 text-sm text-text-secondary">
        L&apos;exercice d&apos;application (consigne + exemple concret à réutiliser)
        est réservé aux membres.{" "}
        <Link href="/register" className="font-medium text-accent-primary hover:underline">
          Crée ton compte gratuit
        </Link>{" "}
        pour le débloquer.
      </p>
    </div>
  );
}
