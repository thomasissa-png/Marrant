import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Routes PREMIUM-only (pas de version gratuite)
const PREMIUM_ONLY_PATHS = ["/favoris"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Utilisateur PREMIUM qui visite /abonnement → rediriger vers le contenu
    if (path.startsWith("/abonnement") && token?.plan === "PREMIUM") {
      return NextResponse.redirect(new URL("/vannes", req.url));
    }

    // Favoris : PREMIUM uniquement
    const isPremiumOnly = PREMIUM_ONLY_PATHS.some((p) => path.startsWith(p));
    if (isPremiumOnly && token?.plan !== "PREMIUM") {
      return NextResponse.redirect(new URL("/abonnement", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Routes nécessitant une session (authentification)
        const authRequiredPaths = [
          "/profil",
          "/favoris",
          "/onboarding",
        ];
        if (authRequiredPaths.some((p) => path.startsWith(p))) {
          return !!token;
        }

        // Les routes contenu (vannes, conseils, vidéos, parcours) sont publiques
        // L'accès limité FREE est géré côté API, pas côté middleware
        return true;
      },
    },
  }
);

export const config = {
  // Only match routes that actually need auth/premium checks.
  // Product pages (/vannes, /conseils, /videos, /parcours) are PUBLIC —
  // keeping them here causes issues with search engine crawlers (Bingbot)
  // because withAuth wraps the request even when authorized() returns true.
  matcher: [
    "/profil/:path*",
    "/favoris/:path*",
    "/onboarding/:path*",
    "/abonnement/:path*",
  ],
};
