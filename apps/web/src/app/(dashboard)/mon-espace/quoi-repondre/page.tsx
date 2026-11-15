import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE, ESPACE_ACCUEIL } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { ApercuRubrique, metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { chargeursFiches } from "@/lib/espace/fiches";
import { envoyeesSiBesoin, fichesVisibles } from "@/lib/espace/lettres";
import { idsFaits, ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { filtrerSituations, lireFiltres, type FicheQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { UNIVERS } from "@/lib/espace/fiches-schema";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { FiltresSituations } from "@/components/espace/filtres-situations";
import { ListeFiches } from "@/components/espace/liste-fiches";
import { BOUTON_SECONDAIRE, CARTE, EN_TETE_CENTRE, LIEN } from "@/components/espace/carte/styles";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);

/**
 * « Quoi répondre » (s24, lot D6 ; architecture v20 3.3, 3.8, 6.2, 6.3) : les situations et « Quand ça
 * tombe à plat », filtrées par « Où et avec qui ? » et « Pour quoi faire ? » (adresse `?ou=&pour=`), puis
 * le carnet du mois, qui garde son adresse publique `/carnet` (aucune copie). Une reprise de lettre n'est
 * listée qu'après l'envoi de sa lettre. États : liste, filtrée, vide (« Raconte-la à l'équipe », vers
 * « Mes questions »), chargement (`loading.tsx`), erreur (`error.tsx`). Rendu : SSR dynamique (« Fait »
 * de l'abonné, jamais en cache). Garde EN PREMIER : 404 interrupteur fermé.
 */
export const dynamic = "force-dynamic";

const BASE = `${ESPACE_ACCUEIL}/quoi-repondre`;

export async function generateMetadata(): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("quoiRepondre") : { title: T.titre };
}

/** Fiches rangées par lieu, dans l'ordre des filtres ; sans lieu : « Rattraper un faux pas ». */
function groupesParLieu(fiches: readonly FicheQuoiRepondre[]) {
  const groupes: { cle: string; titre: string; fiches: FicheQuoiRepondre[] }[] = UNIVERS.map((u) => ({ cle: u, titre: T.univers[u], fiches: fiches.filter((f) => f.univers === u) }));
  const sansLieu = fiches.filter((f) => !f.univers);
  groupes.push({ cle: "sans-lieu", titre: T.pourQuoiFaire["rattraper-faux-pas"], fiches: sansLieu });
  return groupes.filter((g) => g.fiches.length > 0);
}

export default async function QuoiRepondrePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuRubrique rubrique="quoiRepondre" visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace(BASE);
  const acces = { acces: "ouvert" as const, userId };
  const toutes = [...chargeursFiches.listerFiches("situation", acces), ...chargeursFiches.listerFiches("a-plat", acces)];
  const filtres = lireFiltres(searchParams);
  const servies = fichesVisibles(toutes, await envoyeesSiBesoin(prisma, toutes));
  const retenues = filtrerSituations(servies, filtres);
  const faits = await idsFaits(userId, retenues.map((f) => f.id));

  return (
    <div>
      {/* v5 §3, gabarit B : pleine coque, en-tête de page du site ; plus de « Retour : Mon espace » (nav v6 : la bande est le retour). */}
      <div className={EN_TETE_CENTRE}>
        <PageHeader title={T.titre} />
      </div>
      <div className="flex flex-col gap-6">
      <Link href="/carnet" className={`${BOUTON_SECONDAIRE} self-start`}>
        {T.carnet}
      </Link>
      <FiltresSituations base={BASE} filtres={filtres} />
      <section aria-label={T.titre} aria-live="polite" data-etat={retenues.length > 0 ? "liste" : "vide"}>
        {retenues.length > 0 ? (
          // Relecture des captures nav s24 (ux F2, design) : la liste est rangée par lieu, sous les titres des
          // filtres « Où et avec qui ? » (libellés validés) ; les fiches sans lieu (« Quand ça tombe à plat »)
          // sous « Rattraper un faux pas ». Un seul groupe quand un lieu est choisi.
          <div className="space-y-10">
            {groupesParLieu(retenues).map((g) => (
              <section key={g.cle} aria-labelledby={`lieu-${g.cle}`} className="space-y-3">
                <h2 id={`lieu-${g.cle}`} className="font-display text-xl font-bold text-text-primary">
                  {g.titre} <span className="text-base font-normal text-text-secondary">({g.fiches.length})</span>
                </h2>
                <ListeFiches lignes={g.fiches.map((f) => ligneDeFiche(f, faits))} deuxColonnes labelledBy={`lieu-${g.cle}`} groupe={g.titre} />
              </section>
            ))}
          </div>
        ) : (
          <div className={CARTE} data-testid="quoi-repondre-vide">
            <p className="text-base text-text-primary">{T.vide}</p>
            <Link href={`${ESPACE_ACCUEIL}/questions`} className={LIEN}>
              {T.raconte}
            </Link>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
