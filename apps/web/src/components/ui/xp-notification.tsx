"use client";

import { useState, useEffect, useCallback } from "react";

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
    }, 2000);
    return () => clearTimeout(timer);
  }, [events]);

  if (events.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-[150] flex flex-col gap-2">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="animate-xp-float rounded-full bg-accent-primary px-4 py-2 text-sm font-bold text-white shadow-lg"
          role="status"
          aria-label={`${ev.amount} XP gagnés`}
        >
          +{ev.amount} XP ⚡
        </div>
      ))}
    </div>
  );
}
