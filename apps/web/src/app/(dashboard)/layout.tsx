import { Suspense } from "react";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { Header } from "@/components/layout/header";
import { PremiumWelcome } from "@/components/premium/premium-welcome";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";
import { XpNotificationProvider } from "@/components/ui/xp-notification";

/**
 * Relecture des captures nav s24, tour 2 (reviewer FD-B) : interrupteur de l'espace ouvert, la page occupe au moins
 * l'écran et le pied reste en bas d'une page courte, sans être poussé sous l'écran ni laisser de bande dessous
 * (`main` grandit, `flex-1`). Fermé : aucune enveloppe, le HTML d'aujourd'hui.
 */
function Coque({ children }: { children: React.ReactNode }) {
  return ESPACE_CLIENT_PUBLIE ? <div className="flex min-h-dvh flex-col">{children}</div> : <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-background focus:font-semibold"
      >
        Aller au contenu principal
      </a>
      <Coque>
      <Header />
      {/* Revue visuelle s21 (R26) : marges de 32 px dès 1 280 px (mêmes que l'en-tête et le pied). */}
      <main id="main-content" className={ESPACE_CLIENT_PUBLIE ? "mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 xl:px-8" : "mx-auto max-w-7xl px-4 py-8 md:px-6 xl:px-8"}>
        {/* Bienvenue après paiement (?premium=bienvenue) ; Suspense requis par useSearchParams en rendu statique. */}
        <Suspense fallback={null}>
          <PremiumWelcome />
        </Suspense>
        {children}
      </main>
      <Footer />
      </Coque>
      <ToastProvider />
      <XpNotificationProvider />
    </>
  );
}
