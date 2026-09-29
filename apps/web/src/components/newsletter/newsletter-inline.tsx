"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NewsletterInlineProps {
  /** Identifiant du contexte d'inscription (ex : "blog:slug", "quiz-humour"). */
  source?: string;
  /** Titre affiché — override du défaut si besoin. */
  title?: string;
  /** Sous-titre / promesse — override du défaut. */
  subtitle?: string;
  className?: string;
}

type Status = "idle" | "loading" | "success" | "error";

/**
 * Bloc de capture email inline (article de blog, fin de quiz).
 *
 * - Double opt-in (l'email de confirmation est envoyé par l'API)
 * - Case de consentement RGPD obligatoire
 * - Zéro mention IA (règle fondateur)
 */
export function NewsletterInline({
  source,
  title = "Reçois 1 technique par semaine",
  subtitle = "Une vanne ou un conseil de répartie à tester ce soir. Rien d'autre.",
  className,
}: NewsletterInlineProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const emailId = useId();
  const consentId = useId();
  const messageId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    if (!consent) {
      setStatus("error");
      setMessage("Coche la case pour accepter de recevoir la newsletter.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Petit souci de notre côté. Réessaie un peu plus tard.");
        return;
      }

      setStatus("success");
      setMessage(
        data?.alreadySubscribed
          ? "Tu es déjà inscrit. On te retrouve dans ta boîte mail."
          : (data?.message ??
              "Jette un œil à ta boîte mail pour confirmer (et aux spams, on ne se vexe pas)."),
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("La connexion a lâché en route. Réessaie un peu plus tard.");
    }
  }

  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-background-card p-6",
        className,
      )}
      aria-labelledby={`${emailId}-title`}
    >
      <p
        id={`${emailId}-title`}
        className="font-display text-lg font-bold text-text-primary"
      >
        {title}
      </p>
      <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>

      {status === "success" ? (
        <p
          className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3" noValidate>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor={emailId} className="sr-only">
              Ton email
            </label>
            <Input
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="ton@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={message ? messageId : undefined}
              aria-invalid={status === "error"}
              disabled={status === "loading"}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "On t'inscrit…" : "Je m'inscris"}
            </Button>
          </div>

          <div className="flex items-start gap-2">
            <input
              id={consentId}
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border accent-accent-primary focus:ring-accent-primary"
              aria-describedby={message ? messageId : undefined}
            />
            <label
              htmlFor={consentId}
              className="text-xs text-text-secondary leading-relaxed"
            >
              J&apos;accepte de recevoir une technique d&apos;humour par semaine de
              Deviens Marrant à cette adresse email. Je peux me désinscrire à
              tout moment via le lien en bas de chaque email.
            </label>
          </div>

          {status === "error" && message && (
            <p
              id={messageId}
              className="text-sm text-error"
              role="alert"
              aria-live="assertive"
            >
              {message}
            </p>
          )}
        </form>
      )}
    </aside>
  );
}
