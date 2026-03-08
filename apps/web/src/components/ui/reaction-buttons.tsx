"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface ReactionButtonsProps {
  jokeId: string;
  initialLikes?: number;
  initialDislikes?: number;
  initialUserReaction?: boolean | null;
  className?: string;
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

  const handleReaction = async (e: React.MouseEvent, isLike: boolean) => {
    e.stopPropagation();
    if (status !== "authenticated") return;

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
      }
    } catch {
      // silent
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={(e) => handleReaction(e, true)}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all",
          userReaction === true
            ? "bg-accent-yellow/20 text-accent-yellow"
            : "bg-background-elevated text-text-muted hover:text-accent-yellow"
        )}
        aria-label={`${likes} j'adore`}
      >
        <span>🔥</span>
        <span>{likes}</span>
      </button>
      <button
        onClick={(e) => handleReaction(e, false)}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all",
          userReaction === false
            ? "bg-error/20 text-error"
            : "bg-background-elevated text-text-muted hover:text-text-secondary"
        )}
        aria-label={`${dislikes} bof`}
      >
        <span>💀</span>
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
