import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouve toutes tes blagues, conseils et vidéos sauvegardés.",
};

export default function FavorisPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Mes favoris
          </h1>
          <p className="mt-2 text-text-secondary">
            Tous tes éléments sauvegardés au même endroit.
          </p>
        </div>

        {/* Tabs filtres */}
        <div className="mb-6 flex gap-2">
          {["Tout", "Blagues", "Conseils", "Vidéos"].map((tab) => (
            <Button
              key={tab}
              variant={tab === "Tout" ? "primary" : "ghost"}
              size="sm"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* État vide */}
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <span className="text-4xl" role="img" aria-label="favoris">
              ⭐
            </span>
            <p className="mt-4 text-lg font-medium text-text-primary">
              Aucun favori pour le moment
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Sauvegarde des blagues, conseils ou vidéos pour les retrouver ici.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
