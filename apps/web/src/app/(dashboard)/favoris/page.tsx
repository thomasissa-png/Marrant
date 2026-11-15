import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { FavorisList } from "@/components/favoris/favoris-list";
import { FavorisOuvert } from "@/components/espace/apercu/favoris-ouvert";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouve toutes tes blagues, conseils et vidéos sauvegardés.",
  robots: { index: false, follow: true },
};

function ContenuFavoris({ centre = false }: { centre?: boolean }) {
  return (
    <>
      {/* Nav v6 (lot B) : plus de place du repère au-dessus du titre (ouvert, la bande est le repère ; H1 à la même
          hauteur que les rubriques de l'espace). Fermé : rien, comme avant. v6 tour 3 (arbitrage 1) : ouvert, titre
          et sous-titre centrés comme l'accueil et les rubriques de l'espace ; fermé, les classes d'avant. */}
      <div className={centre ? "mb-8 text-center" : "mb-8"}>
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

/**
 * Nav v6 (s25, lot B) : interrupteur ouvert, visiteur et inscrit gratuit voient l'aperçu de Favoris à cette adresse
 * (`FavorisOuvert`, plus de redirection dans le middleware). Fermé : rendu synchrone d'aujourd'hui, octet pour octet.
 */
export default function FavorisPage() {
  if (ESPACE_CLIENT_PUBLIE) {
    return (
      <FavorisOuvert>
        <ContenuFavoris centre />
      </FavorisOuvert>
    );
  }
  return <ContenuFavoris />;
}
