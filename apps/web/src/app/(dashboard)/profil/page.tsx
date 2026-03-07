import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StreakCounter } from "@/components/ui/streak-counter";

export const metadata: Metadata = {
  title: "Mon profil — Progression & Statistiques",
  description: "Suis ta progression en humour, tes statistiques et gère ton abonnement.",
};

export default function ProfilPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Mon profil
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Niveau & XP */}
          <Card>
            <CardHeader>
              <CardTitle>Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">🌱</span>
                <div>
                  <p className="font-bold text-text-primary">Novice</p>
                  <p className="text-sm text-text-secondary">0 XP</p>
                </div>
              </div>
              <ProgressBar
                value={0}
                max={100}
                label="Prochain niveau : Apprenti"
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
              <StreakCounter count={0} />
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
                  <p className="text-2xl font-bold text-accent-yellow">0</p>
                  <p className="text-xs text-text-muted">Blagues lues</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-orange">0</p>
                  <p className="text-xs text-text-muted">Conseils terminés</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">0</p>
                  <p className="text-xs text-text-muted">Vidéos vues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abonnement */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Abonnement</CardTitle>
                <Badge variant="default">Gratuit</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-text-secondary">
                Passe en Premium pour débloquer l&apos;accès illimité et le
                coaching IA personnalisé.
              </p>
              <Button variant="secondary" size="sm">
                Passer Premium — 9,99€/mois
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
