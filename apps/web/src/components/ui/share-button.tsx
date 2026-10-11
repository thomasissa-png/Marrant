"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type ShareChannel = "natif" | "copie";

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
  /** URL partagée (défaut : page courante ; la copie ajoute alors le nom du site). */
  url?: string;
  /** Nom accessible (défaut : « Partager »). */
  label?: string;
  /** Appelé après un partage réussi (annulation : pas d'appel). */
  onShared?: (channel: ShareChannel) => void;
  /** Texte seul, sans titre ni lien : message à envoyer tel quel (vœux, anniversaire). */
  textOnly?: boolean;
}

export function ShareButton({ title, text, className, url, label = "Partager", onShared, textOnly = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const shareData: ShareData = textOnly ? { text } : { title, text, url: url ?? window.location.href };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShared?.("natif");
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(textOnly ? text : `${text}\n\n${url ?? "deviens-marrant.fr"}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onShared?.("copie");
      } catch {
        // Presse-papiers refusé
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        // Cible tactile 44 px (T17), pastille visible inchangée à 32 px.
        "group/share flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        className
      )}
      type="button"
      aria-label={copied ? "Copié !" : label}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
          copied
            ? "bg-success/20 text-success"
            : "bg-background-elevated text-text-muted group-hover/share:bg-accent-secondary/10 group-hover/share:text-accent-secondary"
        )}
      >
      {copied ? (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
      </span>
    </button>
  );
}
