"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";

interface AuthCtaProps {
  label?: string;
  callbackUrl?: string;
  size?: "md" | "sm" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
  /** If authenticated, clicking runs this instead of opening modal */
  onAuthenticatedClick?: () => void;
}

/**
 * CTA button that opens the AuthModal for unauthenticated users.
 * Replaces all `<Link href="/register">` patterns.
 */
export function AuthCta({
  label = "Créer un compte pour commencer",
  callbackUrl = "/abonnement",
  size = "lg",
  variant = "primary",
  className,
  onAuthenticatedClick,
}: AuthCtaProps) {
  const { status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => {
          if (status === "authenticated" && onAuthenticatedClick) {
            onAuthenticatedClick();
          } else {
            setIsAuthModalOpen(true);
          }
        }}
      >
        {label}
      </Button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={callbackUrl}
      />
    </>
  );
}
