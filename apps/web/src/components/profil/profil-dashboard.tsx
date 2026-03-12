"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StreakCounter } from "@/components/ui/streak-counter";
import { useUserStore } from "@/stores/user-store";
import { USER_LEVELS } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

const LEVEL_ORDER: (keyof typeof USER_LEVELS)[] = [
  "NOVICE",
  "APPRENTI",
  "FARCEUR",
  "COMIQUE",
  "LEGENDE",
];

function getNextLevel(currentLevel: string) {
  const idx = LEVEL_ORDER.indexOf(currentLevel as keyof typeof USER_LEVELS);
  if (idx === -1 || idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

function getXpProgress(xp: number, currentLevel: string) {
  const currentInfo = USER_LEVELS[currentLevel as keyof typeof USER_LEVELS];
  const nextKey = getNextLevel(currentLevel);
  if (!nextKey) return { value: 100, max: 100, label: "Niveau maximum atteint !" };
  const nextInfo = USER_LEVELS[nextKey];
  const currentMin = currentInfo?.minXp ?? 0;
  const nextMin = nextInfo.minXp;
  return {
    value: xp - currentMin,
    max: nextMin - currentMin,
    label: `Prochain niveau : ${nextInfo.label}`,
  };
}

export function ProfilDashboard() {
  const { status } = useSession();
  const { user, isLoading, fetchUser } = useUserStore();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        toast("Erreur lors de la création du paiement", "error");
      }
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status, fetchUser]);

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl" role="img" aria-label="cadenas">
            🔒
          </span>
          <p className="mt-4 text-lg font-medium text-text-primary">
            Connecte-toi pour voir ton profil
          </p>
          <Link href="/login" className="mt-4">
            <Button variant="primary" size="sm">
              Se connecter
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-8">
              <div className="h-6 w-1/3 rounded bg-background-elevated" />
              <div className="mt-4 h-4 w-2/3 rounded bg-background-elevated" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const levelInfo = USER_LEVELS[user.level as keyof typeof USER_LEVELS] ?? USER_LEVELS.NOVICE;
  const progress = getXpProgress(user.xp, user.level);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Niveau & XP */}
      <Card>
        <CardHeader>
          <CardTitle>Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{levelInfo.icon}</span>
            <div>
              <p className="font-bold text-text-primary">{levelInfo.label}</p>
              <p className="text-sm text-text-secondary">{user.xp} XP</p>
            </div>
          </div>
          <ProgressBar
            value={progress.value}
            max={progress.max}
            label={progress.label}
            showPercentage
            variant="gradient"
          />
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader>
          <CardTitle>Streak</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-4">
          <StreakCounter count={user.streak} />
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent-primary">
                {user.stats.jokesRead}
              </p>
              <p className="text-xs text-text-muted">Blagues lues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-secondary">
                {user.stats.tipsCompleted}
              </p>
              <p className="text-xs text-text-muted">Conseils terminés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {user.stats.videosWatched}
              </p>
              <p className="text-xs text-text-muted">Vidéos vues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prochaine étape — recommandation personnalisée */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Prochaine étape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {user.stats.tipsCompleted < 3 && (
              <Link href="/conseils" className="group">
                <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                  <p className="font-semibold text-accent-primary">Apprends les bases</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Commence par les conseils de répartie et de timing, les fondamentaux pour être à l&apos;aise.
                  </p>
                </div>
              </Link>
            )}
            {user.stats.jokesRead < 10 && (
              <Link href="/blagues" className="group">
                <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                  <p className="font-semibold text-accent-primary">Enrichis ton répertoire</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Lis des blagues par catégorie et sauvegarde celles que tu veux ressortir.
                  </p>
                </div>
              </Link>
            )}
            {user.stats.tipsCompleted >= 3 && user.stats.jokesRead >= 10 && (
              <Link href="/conseils" className="group">
                <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                  <p className="font-semibold text-accent-primary">Approfondis tes techniques</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Tu as les bases, explore les conseils avancés pour affiner ton humour.
                  </p>
                </div>
              </Link>
            )}
            <Link href="/videos" className="group">
              <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-secondary">
                <p className="font-semibold text-accent-secondary">Regarde les pros</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Analyse les techniques des meilleurs humoristes pour t&apos;en inspirer.
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Abonnement */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Abonnement</CardTitle>
            <Badge variant={user.plan === "PREMIUM" ? "primary" : "default"}>
              {user.plan === "PREMIUM" ? "Premium" : "Gratuit"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {user.plan === "PREMIUM" ? (
            <p className="text-sm text-text-secondary">
              Tu profites de l&apos;accès illimité à tous les contenus et de la progression personnalisée.
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-text-secondary">
                Débloque l&apos;accès à toutes les blagues, tous les conseils,
                toutes les vidéos analysées et le contenu quotidien, le tout pour
                seulement 0,99 €/mois. Prix de lancement, profites-en.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Redirection..." : "Débloquer tout à 0,99 €/mois"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
