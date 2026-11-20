import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { FavorisList } from "@/components/favoris/favoris-list";
import { FavorisOuvert } from "@/components/espace/apercu/favoris-ouvert";
import { FavorisAbonne } from "@/components/espace/favoris/favoris-abonne";
import { TEXTE, TITRE_PAGE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

// Rendu : Client Component pour la liste (store des favoris, session) ; espace ouvert, l'aperçu est rendu côté serveur.
export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouve toutes tes blagues, conseils et vidéos sauvegardés.",
  robots: { index: false, follow: true },
};

const TITRE = "Mes favoris";
const SOUS_TITRE = "Tes vannes, conseils et vidéos préférés, prêts à ressortir.";

/** Fermé : le rendu d'avant, au caractère près (instantané d'inertie `favoris`). */
function ContenuFavoris() {
  return (
    <>
      {/* Nav v6 (lot B) : plus de place du repère au-dessus du titre (ouvert, la bande est le repère ; H1 à la même
          hauteur que les rubriques de l'espace). Fermé : rien, comme avant. */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          {TITRE}
        </h1>
        <p className="mt-2 text-text-secondary">
          {SOUS_TITRE}
        </p>
      </div>

      <FavorisList />
    </>
  );
}

/**
 * s26 (`docs/ux/favoris-carnet-s26.md` §1.3, design §2.1), espace ouvert, abonné : en-tête aligné à gauche (plus de
 * colonne centrée), comme les rubriques de l'espace. s26 DA, s'entraîner et favoris : puis la liste des favoris à
 * gauche et le favori ouvert à droite (`FavorisAbonne`, motif liste et détail de Quoi répondre).
 */
function ContenuFavorisOuvert() {
  return (
    <div className="pb-16">
      <header>
        <h1 className={TITRE_PAGE}>{TITRE}</h1>
        <p className={cn("mt-2 max-w-xl", TEXTE)}>{SOUS_TITRE}</p>
      </header>
      <div className="mt-8">
        <FavorisAbonne titre={TITRE} />
      </div>
    </div>
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
        <ContenuFavorisOuvert />
      </FavorisOuvert>
    );
  }
  return <ContenuFavoris />;
}
