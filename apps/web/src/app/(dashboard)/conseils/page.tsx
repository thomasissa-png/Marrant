import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Conseils humour — Progresse du débutant à l'expert",
  description:
    "Conseils pratiques et actionnables pour maîtriser le timing, la répartie, le storytelling et l'auto-dérision. Exercices inclus.",
};

export default function ConseilsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Conseils humour
          </h1>
          <p className="mt-2 text-text-secondary">
            Progresse à ton rythme avec des conseils actionnables, des exemples
            concrets et des exercices pratiques.
          </p>
        </div>

        {/* Niveaux */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["Tous", "Débutant", "Intermédiaire", "Expert"].map((level) => (
            <Button
              key={level}
              variant={level === "Tous" ? "secondary" : "ghost"}
              size="sm"
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Catégories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            "Timing",
            "Auto-dérision",
            "Observation",
            "Répartie",
            "Storytelling",
            "Absurde",
            "Jeux de mots",
          ].map((cat) => (
            <Badge key={cat} variant="default" className="cursor-pointer">
              {cat}
            </Badge>
          ))}
        </div>

        {/* Liste des conseils (placeholder) */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="orange">Débutant</Badge>
                <Badge variant="default">Timing</Badge>
              </div>
              <CardTitle>Chargement des conseils...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Les conseils seront chargés depuis la base de données.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
