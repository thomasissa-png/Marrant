"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

interface Feature {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const FEATURES: Feature[] = [
  {
    slug: "whatsapp",
    title: "Vannes, vidéos et conseils du jour par WhatsApp",
    description:
      "Reçois chaque jour ta dose d\u2019humour directement sur WhatsApp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    gradient: "from-background-card to-accent-primary/5",
    iconBg: "bg-accent-primary/10",
    iconColor: "text-accent-primary",
  },
  {
    slug: "nouveaux-parcours",
    title: "De nouveaux parcours",
    description:
      "Des parcours encore plus poussés pour maîtriser l\u2019art de la répartie et du storytelling",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    gradient: "from-background-card to-accent-secondary/5",
    iconBg: "bg-accent-secondary/10",
    iconColor: "text-accent-secondary",
  },
  {
    slug: "communaute",
    title: "Une communauté",
    description:
      "Échange avec d\u2019autres passionnés d\u2019humour, partage tes meilleures vannes et progresse ensemble",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    gradient: "from-background-card to-accent-primary/5",
    iconBg: "bg-accent-primary/10",
    iconColor: "text-accent-primary",
  },
  {
    slug: "surprises",
    title: "Générateur de répartie",
    description:
      "Décris la situation, on te génère 3 répliques possibles. Ton coach de poche pour ne plus jamais rester muet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    gradient: "from-background-card to-accent-secondary/5",
    iconBg: "bg-accent-secondary/10",
    iconColor: "text-accent-secondary",
  },
];

export function UpcomingFeatures() {
  const { status } = useSession();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [votingSlug, setVotingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/features/vote")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCounts(data.counts);
          setUserVotes(new Set(data.userVotes));
        }
      })
      .catch(() => {});
  }, []);

  const handleVote = useCallback(
    async (slug: string) => {
      if (status !== "authenticated") {
        toast("Connecte-toi pour voter", "error");
        return;
      }
      if (votingSlug) return;

      setVotingSlug(slug);
      const hadVote = userVotes.has(slug);

      // Optimistic update
      setUserVotes((prev) => {
        const next = new Set(prev);
        if (hadVote) next.delete(slug);
        else next.add(slug);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [slug]: (prev[slug] ?? 0) + (hadVote ? -1 : 1),
      }));

      try {
        const res = await fetch("/api/features/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featureSlug: slug }),
        });
        if (!res.ok) {
          throw new Error();
        }
      } catch {
        // Rollback
        setUserVotes((prev) => {
          const next = new Set(prev);
          if (hadVote) next.add(slug);
          else next.delete(slug);
          return next;
        });
        setCounts((prev) => ({
          ...prev,
          [slug]: (prev[slug] ?? 0) + (hadVote ? 1 : -1),
        }));
        toast("Erreur lors du vote, réessaie", "error");
      } finally {
        setVotingSlug(null);
      }
    },
    [status, userVotes, votingSlug]
  );

  return (
    <section className="py-16">
      <div className="mb-4 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-primary/30" />
        <Badge variant="premium">Abonnés</Badge>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-primary/30" />
      </div>
      <h2 className="font-display mb-3 text-center text-3xl font-bold md:text-4xl">
        Prochainement
      </h2>
      <p className="mx-auto mb-2 max-w-2xl text-center text-text-secondary">
        On prépare la suite pour te rendre encore plus redoutable en société.
      </p>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-text-muted">
        Vote pour la fonctionnalité que tu veux voir arriver en premier !
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {FEATURES.map((feature) => {
          const voted = userVotes.has(feature.slug);
          const count = counts[feature.slug] ?? 0;

          return (
            <Card
              key={feature.slug}
              className={cn(
                "relative overflow-hidden border-accent-primary/20 bg-gradient-to-br",
                feature.gradient
              )}
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      feature.iconBg,
                      feature.iconColor
                    )}
                  >
                    {feature.icon}
                  </div>
                  <Badge variant="primary">Bientôt</Badge>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                <button
                  onClick={() => handleVote(feature.slug)}
                  disabled={votingSlug !== null}
                  className={cn(
                    "mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                    voted
                      ? "bg-accent-primary text-white"
                      : "bg-background-elevated text-text-muted hover:bg-accent-primary/10 hover:text-accent-primary"
                  )}
                  aria-label={`${count} votes pour ${feature.title}`}
                >
                  <span>{voted ? "👍" : "👆"}</span>
                  <span>
                    {voted ? "Voté !" : "Je veux ça !"}
                  </span>
                  <span
                    className={cn(
                      "ml-1 rounded-full px-2 py-0.5 text-xs",
                      voted
                        ? "bg-white/20 text-white"
                        : "bg-accent-primary/10 text-accent-primary"
                    )}
                  >
                    {count}
                  </span>
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
