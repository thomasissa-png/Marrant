import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  BLOG_PREVIEW_COOKIE,
  BLOG_PREVIEW_MAX_AGE_S,
  BLOG_PREVIEW_PATH,
  BLOG_PREVIEW_QUERY_PARAM,
  isBlogPreviewPath,
} from "@/config/blog-preview";
import { createPreviewToken, isAdminPassword } from "@/lib/blog-preview-auth";
import { buildAbonnementUrl } from "@/lib/premium-return";

// Routes PREMIUM-only (pas de version gratuite)
const PREMIUM_ONLY_PATHS = ["/favoris"];

// s21 (QA v3 m-1) : chaque redirection vers /abonnement porte sa propre source (mesure du
// tunnel jusqu'à `checkout-ouvert`). Valeurs stables : le rapport du lundi les lit telles quelles.
// `/favoris` : même source et même retour que le bouton du mur des favoris.
const ABONNEMENT_DEPUIS_FAVORIS = buildAbonnementUrl("/favoris", "monthly", "favoris");
// `/onboarding` sans session : distincte de `onboarding` (bouton du quiz d'accueil, compte connecté).
const ABONNEMENT_DEPUIS_ONBOARDING = buildAbonnementUrl(null, "monthly", "onboarding-visiteur");

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

    // Onboarding sans session : réservé aux comptes comme avant, et proposé
    // seulement après l'abonnement (plus de compte gratuit, spec s15 §2.5).
    // Un visiteur qui l'ouvre arrive sur /abonnement (avant : /register).
    if (path.startsWith("/onboarding") && !token) {
      return NextResponse.redirect(new URL(ABONNEMENT_DEPUIS_ONBOARDING, req.url));
    }

    // Utilisateur PREMIUM qui visite /abonnement → rediriger vers le contenu. Sauf /abonnement/success
    // (QA conversion s21, m2) : après une session perdue au retour de Stripe puis une connexion, la page
    // de retour doit pouvoir ajouter le favori mémorisé, poser la bienvenue et ramener à la page d'origine
    // (elle redirige d'elle-même vers une destination interdite de /abonnement : pas de boucle).
    if (path.startsWith("/abonnement") && path !== "/abonnement/success" && token?.plan === "PREMIUM") {
      return NextResponse.redirect(new URL("/vannes", req.url));
    }

    // Favoris : PREMIUM uniquement
    const isPremiumOnly = PREMIUM_ONLY_PATHS.some((p) => path.startsWith(p));
    if (isPremiumOnly && token?.plan !== "PREMIUM") {
      return NextResponse.redirect(new URL(ABONNEMENT_DEPUIS_FAVORIS, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Routes nécessitant une session (authentification)
        // (/onboarding : géré ci-dessus, redirection vers /abonnement et non /login.)
        const authRequiredPaths = ["/profil", "/favoris"];
        if (authRequiredPaths.some((p) => path.startsWith(p))) {
          return !!token;
        }

        // Les routes contenu (vannes, conseils, vidéos, parcours) sont publiques
        // L'accès limité FREE est géré côté API, pas côté middleware
        return true;
      },
    },
    // Sans session : /login?callbackUrl=… en un saut (défaut : /api/auth/signin puis /login).
    pages: { signIn: "/login" },
  }
);

// --- Aperçu blog (/blog/apercu/[slug]) ---
// `?cle=` est toujours retiré de l'URL par redirection ; le cookie signé (2 h,
// httpOnly, chemin /blog/apercu) n'est posé que si la clé est ADMIN_PASSWORD.
// La page vérifie ensuite cookie ou Bearer et répond 404 sans autorisation.
export async function blogPreviewMiddleware(req: NextRequest): Promise<NextResponse> {
  const key = req.nextUrl.searchParams.get(BLOG_PREVIEW_QUERY_PARAM);
  let res: NextResponse;
  if (key === null) {
    res = NextResponse.next();
  } else {
    const target = req.nextUrl.clone();
    target.searchParams.delete(BLOG_PREVIEW_QUERY_PARAM);
    res = NextResponse.redirect(target, 303);
    const token = (await isAdminPassword(key)) ? await createPreviewToken() : null;
    if (token) {
      res.cookies.set(BLOG_PREVIEW_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: BLOG_PREVIEW_PATH,
        maxAge: BLOG_PREVIEW_MAX_AGE_S,
      });
    }
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

// --- Middleware principal : www redirect + delegation auth ---
export default async function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";

  // Redirection www → non-www (301 permanente, SEO-friendly)
  // Préserve le path complet et les query params
  if (hostname.startsWith("www.")) {
    const url = new URL(req.url);
    // Construire l'URL canonique sans port interne (Replit expose :5904 en interne)
    const canonicalUrl = `https://deviens-marrant.fr${url.pathname}${url.search}`;
    return NextResponse.redirect(canonicalUrl, 301);
  }

  if (isBlogPreviewPath(req.nextUrl.pathname)) {
    return blogPreviewMiddleware(req);
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
