"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { buildRegisterUrl } from "@/lib/auth-links";
import { cn } from "@/lib/utils";

interface AuthCtaProps {
  label?: string;
  callbackUrl?: string;
  /** Source du clic pour la mesure du tunnel (kebab-case, ex. `blog-<slug>`, `quiz`). */
  src?: string;
  size?: "md" | "sm" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
  /** If authenticated, clicking runs this instead of following the link */
  onAuthenticatedClick?: () => void;
}

/** Même règle que les autres `src` du tunnel (lib/premium-return, lib/checkout-tracking). */
const SRC_VALIDE = /^[a-z0-9][a-z0-9-]{0,119}$/;

/**
 * s21 (revue v2 m-1) : compte connecté envoyé sur `/abonnement` : la source du clic y est
 * ajoutée (si la destination n'en porte pas déjà une), pour qu'elle suive jusqu'à
 * `checkout-ouvert`. Toute autre destination est rendue telle quelle.
 */
export function avecSourceAbonnement(callbackUrl: string, src?: string): string {
  if (!src || !SRC_VALIDE.test(src)) return callbackUrl;
  const [avantHash, hash] = callbackUrl.split("#");
  const [chemin, query = ""] = avantHash.split("?");
  if (chemin !== "/abonnement") return callbackUrl;
  const params = new URLSearchParams(query);
  if (params.has("src")) return callbackUrl;
  params.set("src", src);
  return `${chemin}?${params.toString()}${hash !== undefined ? `#${hash}` : ""}`;
}

/**
 * CTA d'abonnement (plus de compte gratuit, s15). Visiteur anonyme (et pendant le chargement de la
 * session, donc dans le HTML serveur) : vrai lien vers
 * `/register?callbackUrl=…&src=…` (étape 1 sur 2, puis paiement ouvert tout seul).
 * Connecté : action fournie, sinon lien direct vers la destination.
 */
export function AuthCta({
  label = "Accéder aux parcours complets",
  callbackUrl = "/abonnement",
  src,
  size = "lg",
  variant = "primary",
  className,
  onAuthenticatedClick,
}: AuthCtaProps) {
  const { status } = useSession();

  if (status === "authenticated" && onAuthenticatedClick) {
    return (
      <Button variant={variant} size={size} className={className} onClick={onAuthenticatedClick}>
        {label}
      </Button>
    );
  }

  const href = status === "authenticated" ? avecSourceAbonnement(callbackUrl, src) : buildRegisterUrl({ callbackUrl, src });
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {label}
    </Link>
  );
}
