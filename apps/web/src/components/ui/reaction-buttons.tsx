"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

interface ReactionButtonsProps {
  jokeId: string;
  initialLikes?: number;
  initialDislikes?: number;
  initialUserReaction?: boolean | null;
  className?: string;
}

/**
 * Clé localStorage pour stocker les réactions anonymes.
 * Format : { [jokeId]: boolean } (true = like, false = dislike)
 */
const ANON_REACTIONS_KEY = "marrant_reactions";

function getAnonReactions(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(ANON_REACTIONS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setAnonReaction(jokeId: string, isLike: boolean | null) {
  const reactions = getAnonReactions();
  if (isLike === null) {
    delete reactions[jokeId];
  } else {
    reactions[jokeId] = isLike;
  }
  localStorage.setItem(ANON_REACTIONS_KEY, JSON.stringify(reactions));
}

export function ReactionButtons({
  jokeId,
  initialLikes = 0,
  initialDislikes = 0,
  initialUserReaction = null,
  className,
}: ReactionButtonsProps) {
  const { status } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<boolean | null>(initialUserReaction);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/jokes/${jokeId}/like`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !cancelled) {
          setLikes(data.likes);
          setDislikes(data.dislikes);
          if (data.userReaction !== undefined && data.userReaction !== null) {
            setUserReaction(data.userReaction);
          } else if (status !== "authenticated") {
            // Charger la réaction anonyme depuis localStorage
            const anon = getAnonReactions();
            if (jokeId in anon) {
              setUserReaction(anon[jokeId]);
            }
          }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [jokeId, status]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleReaction = async (e: React.MouseEvent, isLike: boolean) => {
    e.stopPropagation();

    // Utilisateur connecté : persistance serveur
    if (status === "authenticated") {
      try {
        const res = await fetch(`/api/jokes/${jokeId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isLike }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.action === "removed") {
            if (isLike) setLikes((l) => l - 1);
            else setDislikes((d) => d - 1);
            setUserReaction(null);
          } else if (data.action === "created") {
            if (isLike) setLikes((l) => l + 1);
            else setDislikes((d) => d + 1);
            setUserReaction(isLike);
          } else if (data.action === "updated") {
            if (isLike) {
              setLikes((l) => l + 1);
              setDislikes((d) => d - 1);
            } else {
              setLikes((l) => l - 1);
              setDislikes((d) => d + 1);
            }
            setUserReaction(isLike);
          }
        } else {
          triggerShake();
          toast("Erreur lors de la réaction", "error");
        }
      } catch {
        triggerShake();
        toast("Connexion perdue, réessaie", "error");
      }
      return;
    }

    // Utilisateur non connecté : persistance localStorage uniquement
    const prev = userReaction;
    if (prev === isLike) {
      // Toggle off
      if (isLike) setLikes((l) => l - 1);
      else setDislikes((d) => d - 1);
      setUserReaction(null);
      setAnonReaction(jokeId, null);
    } else if (prev === null) {
      // Nouvelle réaction
      if (isLike) setLikes((l) => l + 1);
      else setDislikes((d) => d + 1);
      setUserReaction(isLike);
      setAnonReaction(jokeId, isLike);
    } else {
      // Switch
      if (isLike) {
        setLikes((l) => l + 1);
        setDislikes((d) => d - 1);
      } else {
        setLikes((l) => l - 1);
        setDislikes((d) => d + 1);
      }
      setUserReaction(isLike);
      setAnonReaction(jokeId, isLike);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", isShaking && "animate-shake", className)}>
      <button
        onClick={(e) => handleReaction(e, true)}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
          userReaction === true
            ? "bg-accent-primary/20 text-accent-primary"
            : "bg-background-elevated text-text-muted hover:text-accent-primary"
        )}
        aria-label={`${likes} hilarant`}
      >
        <span>🔥</span>
        <span>{likes}</span>
      </button>
      <button
        onClick={(e) => handleReaction(e, false)}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
          userReaction === false
            ? "bg-error/20 text-error"
            : "bg-background-elevated text-text-muted hover:text-text-secondary"
        )}
        aria-label={`${dislikes} pas terrible`}
      >
        <span>💀</span>
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
