import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { PLACE_REPERE } from "@/components/layout/gabarit";
import { FavorisList } from "@/components/favoris/favoris-list";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouve toutes tes blagues, conseils et vidéos sauvegardés.",
  robots: { index: false, follow: true },
};

export default function FavorisPage() {
  return (
    <>
      {/* Relecture des captures nav s24, tour 2 : interrupteur de l'espace ouvert, place du repère au-dessus du titre,
          H1 à la même hauteur que les pages de l'espace (fermé : rien, page d'aujourd'hui). */}
      {ESPACE_CLIENT_PUBLIE && <div aria-hidden="true" className={PLACE_REPERE} />}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Mes favoris
        </h1>
        <p className="mt-2 text-text-secondary">
          Tes vannes, conseils et vid&#233;os pr&#233;f&#233;r&#233;s, pr&#234;ts &#224; ressortir.
        </p>
      </div>

      <FavorisList />
    </>
  );
}
