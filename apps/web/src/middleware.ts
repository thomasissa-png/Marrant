import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Routes qui nécessitent un abonnement PREMIUM actif
const PREMIUM_PATHS = ["/vannes", "/conseils", "/videos", "/parcours", "/favoris"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Utilisateur PREMIUM qui visite /abonnement → rediriger vers le contenu
    if (path.startsWith("/abonnement") && token?.plan === "PREMIUM") {
      return NextResponse.redirect(new URL("/vannes", req.url));
    }

    // Utilisateur FREE qui tente d'accéder au contenu → rediriger vers /abonnement
    const isContentPath = PREMIUM_PATHS.some((p) => path.startsWith(p));
    if (isContentPath && token?.plan !== "PREMIUM") {
      return NextResponse.redirect(new URL("/abonnement", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Routes protégées nécessitant une session
        const protectedPaths = [
          "/profil",
          "/favoris",
          "/onboarding",
          "/abonnement",
          "/vannes",
          "/conseils",
          "/videos",
          "/parcours",
        ];
        if (protectedPaths.some((p) => path.startsWith(p))) {
          return !!token;
        }

        // Toutes les autres routes sont publiques
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/profil/:path*",
    "/favoris/:path*",
    "/onboarding/:path*",
    "/abonnement/:path*",
    "/vannes/:path*",
    "/conseils/:path*",
    "/videos/:path*",
    "/parcours/:path*",
  ],
};
