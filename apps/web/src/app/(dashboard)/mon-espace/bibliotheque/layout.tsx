import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { EN_TETE_CHEMIN_ESPACE, ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { ADRESSE_LISTE_BIBLIOTHEQUE, estFicheBibliotheque, idDeCheminBibliotheque } from "@/lib/espace/bibliotheque-liste";
import { chargerBibliotheque } from "@/components/espace/bibliotheque/panneau";
import { ColonneBibliotheque } from "@/components/espace/bibliotheque/colonne-liste";
import { FournisseurFaitsListe } from "@/components/espace/liste-detail/faits-contexte";

/**
 * s26 bibliothèque liste et détail (modèle : le pilote de Quoi répondre, `docs/ux/liste-detail-quoi-repondre-s26.md`,
 * `docs/design/liste-detail-quoi-repondre-s26.md`) : la liste des techniques est un LAYOUT qui reste monté ; seule la
 * fiche (`[id]`) change à droite, dès 1024 px. Sous 1024, la colonne est masquée : la page liste OU la fiche plein écran.
 * Rendu : dynamique (« Fait » de l'abonné, cap, témoin du coin ; jamais en cache).
 *
 * Interrupteur fermé : `notFound()` EN PREMIER, avant toute lecture (HTML fermé inchangé). Ouvert : visiteur et inscrit
 * gratuit voient l'aperçu (la page) ; sur une adresse de fiche, 307 vers la liste. Abonné : garde, puis la liste légère.
 * Fiche inconnue de l'abonné : la vraie 404 de statut, posée ici au-dessus du `loading.tsx` de `[id]`.
 */
export const dynamic = "force-dynamic";

export default async function BibliothequeLayout({ children }: { children: React.ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const chemin = headers().get(EN_TETE_CHEMIN_ESPACE);
  if (await lireLecteurApercu()) {
    if (estFicheBibliotheque(chemin)) redirect(ADRESSE_LISTE_BIBLIOTHEQUE);
    return <>{children}</>;
  }
  const { userId } = await garderEspace(chemin ?? ADRESSE_LISTE_BIBLIOTHEQUE);
  const { ordre, lignes, coin, entre, faits } = await chargerBibliotheque(userId);
  if (estFicheBibliotheque(chemin) && !ordre.some((f) => f.id === idDeCheminBibliotheque(chemin))) notFound();
  // Version des « Fait » du serveur : quand `router.refresh()` la change, l'état optimiste de la liste est oublié.
  const version = lignes.filter((l) => l.fait).map((l) => l.id).join(",");

  return (
    <FournisseurFaitsListe adresseListe={ADRESSE_LISTE_BIBLIOTHEQUE} versionServeur={version}>
      <div
        className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[22.5rem_minmax(0,1fr)] xl:gap-8"
        data-liste-detail
      >
        {/* Cellule hors du calcul de la rangée (`h-0 min-h-full`) : la liste collante ne rallonge jamais la page. */}
        <div className="hidden min-w-0 lg:block lg:h-0 lg:min-h-full" data-zone="liste">
          <ColonneBibliotheque lignes={lignes} coin={coin.length > 0 ? { lignes: entre ? coin.map((x) => ligneDeFiche(x, faits)) : null } : null} />
        </div>
        <div className="min-w-0" data-zone="panneau">
          {children}
        </div>
      </div>
    </FournisseurFaitsListe>
  );
}
