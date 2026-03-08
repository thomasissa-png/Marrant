import type { Metadata } from "next";
import { FavorisList } from "@/components/favoris/favoris-list";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouve toutes tes blagues, conseils et vidéos sauvegardés.",
};

export default function FavorisPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Mes favoris
        </h1>
        <p className="mt-2 text-text-secondary">
          Tous tes éléments sauvegardés au même endroit.
        </p>
      </div>

      <FavorisList />
    </>
  );
}
