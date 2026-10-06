"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { isPremiumPlan } from "@/lib/parcours-access";

/**
 * Bloc « À toi de jouer » de la page individuelle d'une vanne.
 *
 * Composant client : la page /vannes/[slug] est rendue en ISR (statique,
 * rapide pour les moteurs). Lire la session côté serveur (cookies) y est
 * interdit par Next.js (DYNAMIC_SERVER_USAGE → erreur 500). Plus de compte
 * gratuit (s15 §1.1) : l'exercice d'application est visible pour les abonnés,
 * un lien vers l'accès complet (retour à la fiche) sinon.
 */
export function HowToApplyGate({ howToApply }: { howToApply: string }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);

  if (isPremium) {
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
        L&apos;exercice (consigne + exemple à réutiliser) fait partie de l&apos;accès complet.{" "}
        <Link href={buildAbonnementUrl(pathname, "monthly", "exercice-vanne")} className="font-medium text-accent-link hover:underline">
          Voir l&apos;accès complet
        </Link>
      </p>
    </div>
  );
}
