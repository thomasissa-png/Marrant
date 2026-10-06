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

  const href = status === "authenticated" ? callbackUrl : buildRegisterUrl({ callbackUrl, src });
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {label}
    </Link>
  );
}
