import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blagues — Deviens drôle avec des centaines de blagues",
  description:
    "Découvre des blagues triées par catégorie : auto-dérision, absurde, jeux de mots, observationnel. Révèle la chute d'un clic !",
};

export default function BlaguesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Blagues
          </h1>
          <p className="mt-2 text-text-secondary">
            Des centaines de blagues pour tous les goûts. Clique pour révéler la
            chute.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            "Toutes",
            "Auto-dérision",
            "Situation",
            "Absurde",
            "Observationnel",
            "Jeux de mots",
            "Couple",
            "Boulot",
          ].map((cat) => (
            <Button
              key={cat}
              variant={cat === "Toutes" ? "primary" : "ghost"}
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grille de blagues (placeholder) */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-4">
              <Badge variant="yellow" className="mb-3">
                Chargement...
              </Badge>
              <p className="text-text-secondary">
                Les blagues seront chargées depuis la base de données.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
