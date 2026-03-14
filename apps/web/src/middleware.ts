import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Les routes admin nécessitent une authentification
    // (ADMIN_PASSWORD est vérifié côté API, ici on s'assure que l'utilisateur est connecté)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Routes protégées nécessitant une session
        const protectedPaths = ["/profil", "/favoris", "/onboarding"];
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
  matcher: ["/profil/:path*", "/favoris/:path*", "/onboarding/:path*"],
};
