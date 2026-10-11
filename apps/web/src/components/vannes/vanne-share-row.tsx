"use client";

import { useState, useCallback } from "react";

interface VanneShareRowProps {
  jokeId: string;
  slug: string;
  content: string;
  punchline: string;
}

/**
 * Ligne de partage natif d'une vanne : Web Share API + fallback (copier, X/Twitter, WhatsApp).
 * Tracke chaque partage via Umami si la variable window.umami est disponible.
 */
export function VanneShareRow({ jokeId, slug, content, punchline }: VanneShareRowProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://deviens-marrant.fr/vannes/${slug}`;
  const shareText = `${content}\n\n${punchline}`;

  const trackShare = useCallback(
    (channel: "native" | "copy" | "twitter" | "whatsapp") => {
      if (typeof window === "undefined") return;
      const umami = (window as unknown as { umami?: { track?: (name: string, data?: Record<string, unknown>) => void } }).umami;
      umami?.track?.("share_vanne", { jokeId, slug, channel });
    },
    [jokeId, slug]
  );

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Une vanne à ressortir ce soir",
          text: shareText,
          url: shareUrl,
        });
        trackShare("native");
        return;
      } catch {
        // annulé — pas de fallback ici, l'utilisateur a d'autres boutons
        return;
      }
    }
    // Fallback direct : copier
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShare("copy");
    } catch {
      // Rien
    }
  }, [shareText, shareUrl, trackShare]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShare("copy");
    } catch {
      // Rien
    }
  }, [shareUrl, trackShare]);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Partager cette vanne">
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 rounded-lg bg-accent-secondary-hover px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label="Partager"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Partager
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label={copied ? "Lien copié" : "Copier le lien"}
      >
        {copied ? "Lien copié" : "Copier le lien"}
      </button>

      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare("twitter")}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label="Partager sur X"
      >
        X / Twitter
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare("whatsapp")}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm font-medium text-text-primary transition hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label="Partager sur WhatsApp"
      >
        WhatsApp
      </a>
    </div>
  );
}
