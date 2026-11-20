import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { ApercuRepliques } from "@/components/espace/apercu/apercu-repliques";
import { fichesSansReplique, listerRepliques } from "@/lib/espace/repliques";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const R = frEspaceProfond(TEXTES_REPLIQUES);

/**
 * « Mes répliques » (s24, lot D5 ; architecture v20 2.7 ; maquette `mes-repliques.html`) : la plus
 * récente d'abord, la réplique entière et le titre de sa fiche (lien), « Modifier » et « Supprimer » avec
 * confirmation. Rendu : SSR dynamique (données de l'abonné, jamais en cache). Garde EN PREMIER. L'état
 * « abonnement terminé » (lecture seule) vit dans « Mon profil » (lot D10) : la garde envoie tout compte
 * sans abonnement actif vers `/abonnement`.
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §2) : l'aperçu passe au modèle verrouillé (`ApercuRepliques`,
 * sans lecture des répliques) ; l'abonné a son titre à gauche, son compteur et la grille 4/4/4 (`ListeRepliques grille`).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("mesRepliques") : { title: R.titre };
}

export default async function MesRepliquesPage() {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuRepliques visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace("/mon-espace/repliques");
  const acces = { acces: "ouvert" as const, userId };
  const repliques = await listerRepliques(userId, acces);
  // s26 DA, aujourd'hui questions répliques (T8) : les fiches proposées au champ d'écriture de la page.
  const aEcrire = fichesSansReplique(new Set(repliques.map((r) => r.ficheId)), acces);
  return (
    // Relecture des captures nav s24, tour 2 (design F2, F3) : gabarit B ; sans contenu, la page passe en colonne
    // de lecture (retour, titre et état vide dans la même colonne de 768 px, jamais un titre à gauche et une carte
    // centrée). v6 tour 1 (point 15) : l'état vide et la liste dans la même colonne de lecture (le titre ne change
    // plus de place selon le compte ; plus de carte de réplique de 1 216 px presque vide). v6 tour 2 (point 6) : même
    // coque et même gabarit que Mes questions (titre aligné sur le logo, comme l'aperçu) ; la liste garde sa
    // largeur de lecture (`max-w-3xl`), calée à gauche sous le titre, jamais une colonne étroite centrée. v6 tour 3
    // (arbitrages 1 et 3) : titre centré comme l'accueil ; la liste en grille pleine coque, l'état vide centré. s26 : titre
    // à gauche, rendu par `ListeRepliques` (le compteur et le lien suivent la liste vivante).
    <div className="pb-16">
      <ListeRepliques initiales={repliques} lectureSeule={false} grille aEcrire={aEcrire} />
    </div>
  );
}
