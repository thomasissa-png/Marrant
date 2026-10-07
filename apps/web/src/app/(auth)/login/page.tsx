"use client";

import Link from "next/link";
import { Suspense, useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolvePostAuthRedirect } from "@/lib/safe-callback";
import {
  AUTH_RETURN_LOGIN_GOOGLE,
  buildRegisterUrl,
  sanitizeSignupSrc,
  withAuthReturnMarker,
} from "@/lib/auth-links";
import { trackUmami } from "@/lib/umami";
import { useInAppBrowser } from "@/hooks/use-in-app-browser";
import { IN_APP_NOTICE_ID, InAppBrowserNotice } from "@/components/auth/in-app-browser-notice";
import { LOGIN_ERROR_CODES, TEXTES_CONNEXION } from "@/config/textes/compte";

const OAUTH_ERRORS: Record<string, string> = {
  // s16 reco 13 : plus de liaison automatique, on renvoie vers le mot de passe.
  OAuthAccountNotLinked: TEXTES_CONNEXION.oauthCompteExistant,
  OAuthCallback:
    "La connexion avec Google n'a pas abouti. Si tu viens d'une appli (Instagram, TikTok, Messenger…), ouvre le site dans ton navigateur puis réessaie, ou connecte-toi avec ton email.",
  OAuthSignin: "Google ne répond pas pour l'instant. Réessaie.",
  // Lot E : erreur inconnue = erreur de notre côté, étalon 4 b.
  Default: TEXTES_CONNEXION.serveur,
};

type ChampFocus = "email" | "password" | "google";

interface ErreurConnexion {
  message: string;
  motif: string;
  focus: ChampFocus;
  /** Aide « compte Google » sous le message (étalon 4 b). */
  aideGoogle: boolean;
}

/**
 * s16 reco 16 : erreur de connexion e-mail → message, motif Umami, champ à refocaliser.
 * Étalon 4 (validé) : un compte créé avec Google affiche EXACTEMENT le même écran
 * que des identifiants faux (message générique + aide Google, focus sur le mot de
 * passe). Depuis le lot F, `authorize` renvoie le même code (`CredentialsSignin`)
 * et Umami le même motif : rien ne révèle qu'un compte existe pour cette adresse.
 */
function erreurConnexion(code: string): ErreurConnexion {
  switch (code) {
    case LOGIN_ERROR_CODES.tropDEssais:
      return { message: TEXTES_CONNEXION.tropDEssais, motif: "trop-d-essais", focus: "password", aideGoogle: false };
    case LOGIN_ERROR_CODES.serveur:
      return { message: TEXTES_CONNEXION.serveur, motif: "serveur", focus: "password", aideGoogle: false };
    default:
      return { message: TEXTES_CONNEXION.identifiants, motif: "identifiants", focus: "password", aideGoogle: true };
  }
}

// Rendu : Client Component. Le fallback de Suspense rend le formulaire sans
// paramètres : le HTML serveur contient déjà le lien d'inscription (s15).
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginForm rawCallbackUrl={null} oauthError={null} src={null} />}>
      <LoginFromUrl />
    </Suspense>
  );
}

function LoginFromUrl() {
  const searchParams = useSearchParams();
  return (
    <LoginForm
      rawCallbackUrl={searchParams.get("callbackUrl")}
      oauthError={searchParams.get("error")}
      src={sanitizeSignupSrc(searchParams.get("src"))}
    />
  );
}

interface LoginFormProps {
  rawCallbackUrl: string | null;
  oauthError: string | null;
  src: string | null;
}

function LoginForm({ rawCallbackUrl, oauthError, src }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [aideGoogle, setAideGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Navigateur intégré détecté au montage : Google désactivé seulement là où il est refusé (v5 §2.4).
  const inApp = useInAppBrowser();
  const googleBloque = inApp?.googleBloque === true;
  // Sanitisation anti open-redirect + fallback vers /vannes pour la connexion classique.
  const callbackUrl = resolvePostAuthRedirect(rawCallbackUrl, "/vannes");
  // Retour de Google marqué pour la mesure (AuthReturnTracker, layout racine).
  const googleCallbackUrl = withAuthReturnMarker(callbackUrl, AUTH_RETURN_LOGIN_GOOGLE);
  // Le lien d'inscription garde la destination demandée (puis le paiement, s15).
  const registerHref = buildRegisterUrl({ callbackUrl: rawCallbackUrl, src: src ?? "login" });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const googleRef = useRef<HTMLButtonElement>(null);
  const oauthTracked = useRef(false);

  // s16 : plus de relance automatique de Google sur OAuthAccountNotLinked
  // (la liaison automatique est coupée, la relance bouclait). Échec mesuré une fois.
  useEffect(() => {
    if (!oauthError || oauthTracked.current) return;
    oauthTracked.current = true;
    trackUmami("connexion-echec", {
      methode: "google",
      motif: oauthError === "OAuthAccountNotLinked" ? "compte-mot-de-passe" : oauthError,
    });
    if (oauthError === "OAuthAccountNotLinked") emailRef.current?.focus();
  }, [oauthError]);

  const oauthMessage = oauthError ? (OAUTH_ERRORS[oauthError] ?? OAUTH_ERRORS.Default) : null;

  // s16 reco 19 : l'e-mail est gardé, le focus revient sur le champ utile.
  const signalerEchec = (motif: string, message: string, focus: ChampFocus, aide = false) => {
    setError(message);
    setAideGoogle(aide);
    setPassword("");
    trackUmami("connexion-echec", { methode: "email", motif });
    const cible = focus === "google" ? googleRef : focus === "email" ? emailRef : passwordRef;
    window.setTimeout(() => cible.current?.focus(), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const { message, motif, focus, aideGoogle: aide } = erreurConnexion(result.error);
        signalerEchec(motif, message, focus, aide);
      } else {
        trackUmami("connexion-reussie", { methode: "email" });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      signalerEchec("reseau", TEXTES_CONNEXION.serveur, "password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    if (googleBloque) return;
    signIn("google", { callbackUrl: googleCallbackUrl });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <span className="whitespace-nowrap font-display text-2xl font-bold text-gradient">
              deviens-marrant.fr
            </span>
          </Link>
          <h1 className="font-display text-xl font-bold text-text-primary">Content de te revoir</h1>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {oauthMessage && !error && (
              <p className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning" role="alert">
                {oauthMessage}
              </p>
            )}
            {error && (
              <p id="login-error" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error" role="alert">
                {error}
                {aideGoogle && (
                  <span className="mt-1 block text-text-secondary" data-testid="login-aide-google">
                    {TEXTES_CONNEXION.aideCompteGoogle}
                  </span>
                )}
              </p>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-text-secondary">
                Email
              </label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="ton@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-describedby={error ? "login-error" : undefined}
                aria-invalid={!!error}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-text-secondary">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-12"
                  aria-describedby={error ? "login-error" : undefined}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? "On t'ouvre…" : "Se connecter"}
            </Button>
            <Button
              ref={googleRef}
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={googleBloque}
              aria-describedby={googleBloque ? IN_APP_NOTICE_ID : undefined}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </Button>
            {googleBloque && inApp && (
              <InAppBrowserNotice page="login" callbackUrl={rawCallbackUrl} src={src} ios={inApp.ios} android={inApp.android} />
            )}
          </form>
          <div className="mt-4 text-center text-sm text-text-secondary">
            <Link href="/forgot-password" className="text-accent-link underline underline-offset-2">
              Mot de passe oublié ?
            </Link>
          </div>
          {/* s15 : création de compte visible (avant : petit lien « Inscris-toi » en bas). */}
          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-sm text-text-secondary">Pas encore abonné ?</p>
            <Link
              href={registerHref}
              className={`${buttonVariants({ variant: "outline" })} mt-2 w-full`}
            >
              Créer mon compte et m&apos;abonner
            </Link>
          </div>
        </CardContent>
      </Card>
      {/* T38 : repère de retour visible (pages plein écran sans header) */}
      <Link
        href="/"
        className="mt-4 inline-flex min-h-[44px] items-center text-sm text-text-muted hover:text-text-primary hover:underline"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
