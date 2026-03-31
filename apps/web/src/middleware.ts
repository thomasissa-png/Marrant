import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Routes PREMIUM-only (pas de version gratuite)
const PREMIUM_ONLY_PATHS = ["/favoris"];

// Routes qui passent par withAuth (auth + premium checks)
const AUTH_ROUTES = ["/profil", "/favoris", "/onboarding", "/abonnement"];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

// --- Middleware withAuth pour les routes protégées ---
const authMiddleware = withAuth(
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
        const authRequiredPaths = ["/profil", "/favoris", "/onboarding"];
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

// --- Middleware principal : www redirect + delegation auth ---
export default function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";

  // Redirection www → non-www (301 permanente, SEO-friendly)
  // Préserve le path complet et les query params
  if (hostname.startsWith("www.")) {
    const nonWwwHost = hostname.slice(4);
    const url = new URL(req.url);
    url.host = nonWwwHost;
    return NextResponse.redirect(url, 301);
  }

  // Déléguer à withAuth uniquement pour les routes qui en ont besoin
  // Les pages publiques ne passent PAS par withAuth (évite les problèmes Bingbot)
  if (isAuthRoute(req.nextUrl.pathname)) {
    return (authMiddleware as any)(req, {} as any);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher élargi : capture toutes les routes pour la redirection www,
  // mais seules les routes auth passent par withAuth (filtrage dans le middleware).
  // Exclut les assets statiques et les fichiers internes Next.js.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon-.*\\.png|apple-touch-icon\\.png|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
