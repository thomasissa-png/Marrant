import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { EN_TETE_CHEMIN_ESPACE, ESPACE_ACCUEIL, ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { estFicheQuoiRepondre, lireLecteurApercu } from "@/components/espace/apercu/acces";
import { chargeursFiches } from "@/lib/espace/fiches";
import { envoyeesSiBesoin, fichesVisibles } from "@/lib/espace/lettres";
import { idsFaits } from "@/lib/espace/lignes-fiches";
import { lignesQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { FournisseurFaits } from "@/components/espace/quoi-repondre/faits-contexte";
import { ColonneListe } from "@/components/espace/quoi-repondre/colonne-liste";
import { frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);
const BASE = `${ESPACE_ACCUEIL}/quoi-repondre`;

/**
 * s26 liste et détail, pilote (`docs/ux/liste-detail-quoi-repondre-s26.md`, `docs/design/liste-detail-quoi-repondre-s26.md`) :
 * la liste de Quoi répondre est un LAYOUT qui reste monté ; seule la fiche (`[id]`) change à droite, dès 1024 px. Sous
 * 1024, la colonne est masquée (`hidden lg:block`) : la page liste (`page.tsx`) OU la fiche plein écran (`[id]`).
 * Rendu : dynamique (« Fait » de l'abonné, jamais en cache), comme le layout de l'espace.
 *
 * Interrupteur fermé : `notFound()` EN PREMIER, avant toute lecture (la vraie 404 ; le middleware réécrit déjà toute
 * adresse `/mon-espace/**` vers elle, HTML fermé inchangé). Ouvert : visiteur et inscrit gratuit voient l'aperçu de la
 * liste (sa page) ; sur une adresse de fiche, 307 vers la liste (jamais une fiche, jamais une 404 ; posé ici, au-dessus
 * du `loading.tsx` de `[id]`, pour que le statut soit un vrai 307 et non une redirection dans le flux). Abonné : garde,
 * puis la liste légère complète (titres, lieux, durées, « Fait » ; environ 50 situations), filtrée côté navigateur.
 */
export const dynamic = "force-dynamic";

export default async function QuoiRepondreLayout({ children }: { children: React.ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const chemin = headers().get(EN_TETE_CHEMIN_ESPACE);
  if (await lireLecteurApercu()) {
    if (estFicheQuoiRepondre(chemin)) redirect(BASE);
    return <>{children}</>;
  }
  const { userId } = await garderEspace(chemin ?? BASE);
  const acces = { acces: "ouvert" as const, userId };
  const toutes = [...chargeursFiches.listerFiches("situation", acces), ...chargeursFiches.listerFiches("a-plat", acces)];
  const servies = fichesVisibles(toutes, await envoyeesSiBesoin(prisma, toutes));
  const faits = await idsFaits(userId, servies.map((f) => f.id));
  const lignes = lignesQuoiRepondre(servies, faits);
  const lieux = [...UNIVERS.map((u) => ({ cle: u, titre: T.univers[u] })), { cle: "sans-lieu", titre: T.pourQuoiFaire["rattraper-faux-pas"] }];
  // Version des « Fait » du serveur : quand `router.refresh()` la change, l'état optimiste de la liste est oublié.
  const version = lignes.filter((l) => l.fait).map((l) => l.id).join(",");

  return (
    <FournisseurFaits versionServeur={version}>
      <div
        className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[22.5rem_minmax(0,1fr)] xl:gap-8"
        data-liste-detail
      >
        {/* Cellule hors du calcul de la rangée (`h-0 min-h-full`) : la liste collante ne rallonge jamais la page. */}
        <div className="hidden min-w-0 lg:block lg:h-0 lg:min-h-full" data-zone="liste">
          <ColonneListe lignes={lignes} lieux={lieux} valides={{ ou: UNIVERS, pour: POUR_QUOI_FAIRE }} />
        </div>
        <div className="min-w-0" data-zone="panneau">
          {children}
        </div>
      </div>
    </FournisseurFaits>
  );
}
