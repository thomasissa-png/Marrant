import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vidéos stand-up — Apprends des meilleurs humoristes français",
  description:
    "Regarde des extraits de stand-up français annotés avec les techniques d'humour utilisées. Gad Elmaleh, Blanche Gardin, Fary, Paul Mirabel...",
};

export default function VideosPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Vidéos stand-up
          </h1>
          <p className="mt-2 text-text-secondary">
            Apprends des meilleurs humoristes français avec des extraits annotés.
          </p>
        </div>

        {/* Filtres */}
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

        {/* Grille vidéos (placeholder) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-4">
              <div className="mb-3 aspect-video rounded-lg bg-background-elevated" />
              <CardTitle className="text-base">
                Chargement des vidéos...
              </CardTitle>
              <p className="mt-1 text-sm text-text-secondary">
                Les vidéos seront chargées depuis la base de données.
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant="default">Technique</Badge>
                <Badge variant="default">Niveau</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
