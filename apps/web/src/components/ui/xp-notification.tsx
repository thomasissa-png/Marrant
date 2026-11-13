"use client";

import { useState, useEffect, useCallback } from "react";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

/**
 * s24 lot D4 (niveaux-xp-s24.md 3.0, points 3 et 5) : espace ouvert, la bulle reste au moins 5 s et
 * ne porte plus d'emoji ; fermé, rendu et durée d'aujourd'hui.
 */
const DUREE_BULLE_MS = ESPACE_CLIENT_PUBLIE ? 5000 : 2000;

interface XpEvent {
  id: string;
  amount: number;
}

let globalShowXp: ((amount: number) => void) | null = null;
let xpCounter = 0;

/** Affiche une notification "+X XP" animée depuis n'importe où */
export function showXpGain(amount: number) {
  globalShowXp?.(amount);
}

export function XpNotificationProvider() {
  const [events, setEvents] = useState<XpEvent[]>([]);

  const showXp = useCallback((amount: number) => {
    const id = `xp-${++xpCounter}-${Date.now()}`;
    setEvents((prev) => [...prev, { id, amount }]);
  }, []);

  useEffect(() => {
    globalShowXp = showXp;
    return () => { globalShowXp = null; };
  }, [showXp]);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setTimeout(() => {
      setEvents((prev) => prev.slice(1));
    }, DUREE_BULLE_MS);
    return () => clearTimeout(timer);
  }, [events]);

  if (events.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-[150] flex flex-col gap-2">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="animate-xp-float rounded-full bg-accent-secondary-hover px-4 py-2 text-sm font-bold text-white shadow-lg"
          role="status"
          aria-label={`${ev.amount} XP gagnés`}
        >
          {ESPACE_CLIENT_PUBLIE ? `+${ev.amount} XP` : <>+{ev.amount} XP ⚡</>}
        </div>
      ))}
    </div>
  );
}
