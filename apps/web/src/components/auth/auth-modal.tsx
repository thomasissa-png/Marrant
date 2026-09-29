"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostSignupRedirect, sanitizeCallbackUrl } from "@/lib/safe-callback";
import { validateRegisterFields, fieldErrorsFromApiDetails, type RegisterFieldErrors } from "@/lib/register-validation";

type AuthTab = "login" | "register" | "forgot-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
  callbackUrl?: string;
}

export function AuthModal({ isOpen, onClose, defaultTab = "login", callbackUrl }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const router = useRouter();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setFieldErrors({});
    setShowPassword(false);
    setForgotSuccess(false);
  };

  const switchTab = (newTab: AuthTab) => {
    resetForm();
    setTab(newTab);
  };

  const handleLogin = async (e: React.FormEvent) => {
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
        setError("Email ou mot de passe incorrect.");
        setPassword("");
      } else {
        onClose();
        // Connexion : retour vers la destination demandée si elle diffère de la page courante.
        const target = sanitizeCallbackUrl(callbackUrl);
        if (target && target !== window.location.pathname) {
          router.push(target);
        }
        router.refresh();
      }
    } catch {
      setError("Quelque chose a coincé de notre côté. Réessaie.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const clientErrors = validateRegisterFields({ name, email, password });
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        const apiFieldErrors = fieldErrorsFromApiDetails(data.details);
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors(apiFieldErrors);
          return;
        }
        setError(data.error ?? "L'inscription n'a pas abouti. Réessaie.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const registeredEmail = email;
        switchTab("login");
        setEmail(registeredEmail);
        setError("Ton compte est prêt. Il ne reste qu'à te connecter.");
      } else {
        onClose();
        // Même règle que /register : onboarding (passable), callback respecté.
        router.push(getPostSignupRedirect(callbackUrl));
        router.refresh();
      }
    } catch {
      setError("Quelque chose a coincé de notre côté. Réessaie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setForgotSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Quelque chose a coincé de notre côté. Réessaie.");
      }
    } catch {
      setError("Connexion perdue, réessaie");
    } finally {
      setIsLoading(false);
    }
  };

  // Google : inscription = même destination que l'inscription par email ;
  // connexion = retour à la destination demandée, sinon à la page courante.
  const handleGoogle = () => {
    const target =
      tab === "register"
        ? getPostSignupRedirect(callbackUrl)
        : sanitizeCallbackUrl(callbackUrl) ?? window.location.pathname;
    signIn("google", { callbackUrl: target });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const PasswordToggle = (
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
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy={tab === "forgot-password" ? "auth-modal-forgot-title" : `auth-modal-tab-${tab}`}
    >
      <Card className="w-full">
        <CardHeader className="text-center">
          <span className="font-display text-2xl font-bold text-gradient">
            deviens-marrant.fr
          </span>
          {/* Tabs */}
          {tab === "forgot-password" ? (
            <p id="auth-modal-forgot-title" className="mt-4 text-sm font-medium text-text-primary">Mot de passe oublié</p>
          ) : (
            <div className="mt-4 flex rounded-lg bg-background-elevated p-1" role="tablist">
              <button
                id="auth-modal-tab-login"
                role="tab"
                aria-selected={tab === "login"}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "login"
                    ? "bg-accent-secondary-hover text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                onClick={() => switchTab("login")}
              >
                Connexion
              </button>
              <button
                id="auth-modal-tab-register"
                role="tab"
                aria-selected={tab === "register"}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "register"
                    ? "bg-accent-secondary-hover text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                onClick={() => switchTab("register")}
              >
                Inscription
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {tab === "forgot-password" ? (
            <div className="flex flex-col gap-4">
              {forgotSuccess ? (
                <div className="text-center">
                  <p className="mb-4 text-sm text-success">
                    Si un compte existe avec cet email, tu recevras un lien sous quelques minutes.
                  </p>
                  <button type="button" className="text-sm text-accent-link hover:underline" onClick={() => switchTab("login")}>
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-secondary">
                    Donne-nous ton email, on t&apos;envoie un lien pour en choisir un nouveau. Ça arrive aux meilleurs.
                  </p>
                  <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                    <div>
                      <label htmlFor="modal-forgot-email" className="mb-1 block text-sm text-text-secondary">
                        Email
                      </label>
                      <Input
                        id="modal-forgot-email"
                        type="email"
                        placeholder="ton@email.fr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-error" role="alert">{error}</p>
                    )}
                    <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                      {isLoading ? "On t'envoie ça…" : "Envoyer le lien"}
                    </Button>
                  </form>
                  <div className="text-center text-sm text-text-secondary">
                    <button type="button" className="text-accent-link hover:underline" onClick={() => switchTab("login")}>
                      Retour à la connexion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : tab === "login" ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              {error && (
                <p id="login-error" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error" role="alert">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="modal-email" className="mb-1 block text-sm text-text-secondary">
                  Email
                </label>
                <Input
                  id="modal-email"
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
                <label htmlFor="modal-password" className="mb-1 block text-sm text-text-secondary">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="modal-password"
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
                  {PasswordToggle}
                </div>
                <div className="mt-1 text-right">
                  <button
                    type="button"
                    className="inline-flex min-h-[44px] items-center text-sm text-accent-link hover:underline"
                    onClick={() => switchTab("forgot-password")}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "On t'ouvre…" : "Se connecter"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuer avec Google
              </Button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              {error && (
                <p id="register-error" className="order-first rounded-lg bg-error/10 px-3 py-2 text-sm text-error sm:order-none" role="alert">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="modal-name" className="mb-1 block text-sm text-text-secondary">
                  Prénom
                </label>
                <Input
                  id="modal-name"
                  type="text"
                  placeholder="Ton prénom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="given-name"
                  aria-describedby={fieldErrors.name ? "modal-name-error" : undefined}
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <p id="modal-name-error" className="mt-1 text-xs text-error" role="alert">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="modal-reg-email" className="mb-1 block text-sm text-text-secondary">
                  Email
                </label>
                <Input
                  id="modal-reg-email"
                  type="email"
                  placeholder="ton@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-describedby={fieldErrors.email ? "modal-reg-email-error" : undefined}
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <p id="modal-reg-email-error" className="mt-1 text-xs text-error" role="alert">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="modal-reg-password" className="mb-1 block text-sm text-text-secondary">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="modal-reg-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="pr-12"
                    aria-describedby={fieldErrors.password ? "modal-reg-password-error" : "modal-reg-password-hint"}
                    aria-invalid={!!fieldErrors.password}
                  />
                  {PasswordToggle}
                </div>
                <p id="modal-reg-password-hint" className="mt-1 text-xs text-text-muted">Au moins 8 caractères</p>
                {fieldErrors.password && (
                  <p id="modal-reg-password-error" className="mt-1 text-xs text-error" role="alert">{fieldErrors.password}</p>
                )}
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "On prépare ton compte…" : "Créer mon compte"}
              </Button>
              <Button type="button" variant="outline" className="order-first w-full sm:order-none" onClick={handleGoogle}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                S&apos;inscrire avec Google
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}
