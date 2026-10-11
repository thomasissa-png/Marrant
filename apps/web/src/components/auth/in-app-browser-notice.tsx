"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { buildLoginUrl, buildRegisterUrl } from "@/lib/auth-links";
import { readStoredAttribution } from "@/lib/attribution";
import { buildOpenInBrowserHref } from "@/lib/in-app-browser";
import { cn } from "@/lib/utils";

export const IN_APP_NOTICE_ID = "google-in-app-notice";

const MESSAGES = {
  register:
    "Google n'accepte pas l'inscription depuis cette application. Inscris-toi par e-mail, ou ouvre le site dans ton navigateur.",
  // [PROVISOIRE @copywriter] variante connexion du message v5 §2.4.
  login:
    "Google n'accepte pas la connexion depuis cette application. Connecte-toi par e-mail, ou ouvre le site dans ton navigateur.",
} as const;

interface InAppBrowserNoticeProps {
  page: "register" | "login";
  callbackUrl: string | null;
  src: string | null;
  ios: boolean;
  android: boolean;
}

/** Copie : API presse-papiers, sinon ancienne commande (vues web anciennes). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Refusé : on tente l'ancienne méthode.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Navigateur intégré où Google est refusé (v5 §2.4 et §2.5) : message, puis
 * bascule vers le navigateur du téléphone avec `callbackUrl`, `src`,
 * `origine` et `contenu` conservés. Sur iOS, la copie du lien passe en
 * premier (un lien ne sort pas d'une vue intégrée).
 */
export function InAppBrowserNotice({ page, callbackUrl, src, ios, android }: InAppBrowserNoticeProps) {
  const [copie, setCopie] = useState<"ok" | "echec" | null>(null);
  const build = page === "register" ? buildRegisterUrl : buildLoginUrl;
  const path = build({ callbackUrl, src, ...readStoredAttribution() });
  const absoluteUrl = `${window.location.origin}${path}`;

  const handleCopy = async () => {
    setCopie((await copyText(absoluteUrl)) ? "ok" : "echec");
  };

  const openLink = (
    <a
      href={buildOpenInBrowserHref(absoluteUrl, android)}
      target="_blank"
      rel="noopener"
      className={cn(buttonVariants({ variant: ios ? "outline" : "primary" }), "w-full")}
    >
      Ouvrir dans mon navigateur
    </a>
  );
  const copyButton = (
    <Button type="button" variant={ios ? "primary" : "outline"} className="w-full" onClick={handleCopy}>
      Copier le lien
    </Button>
  );

  return (
    <div className="rounded-lg bg-warning/10 px-3 py-3 text-sm text-warning" data-testid="in-app-notice">
      <p id={IN_APP_NOTICE_ID}>{MESSAGES[page]}</p>
      <div className="mt-3 flex flex-col gap-2">
        {ios ? copyButton : openLink}
        {ios ? openLink : copyButton}
      </div>
      {copie === "ok" && (
        <p className="mt-2 text-text-secondary" role="status">
          Lien copié. Colle-le dans ton navigateur.
        </p>
      )}
      {copie === "echec" && (
        <div className="mt-2" role="status">
          <label htmlFor="in-app-link" className="mb-1 block text-text-secondary">
            Copie le lien à la main :
          </label>
          <input
            id="in-app-link"
            readOnly
            value={absoluteUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-text-primary"
          />
        </div>
      )}
    </div>
  );
}
