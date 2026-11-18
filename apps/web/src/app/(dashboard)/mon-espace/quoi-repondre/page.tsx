import type { Metadata } from "next";
import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE, ESPACE_ACCUEIL } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { ApercuQuoiRepondre } from "@/components/espace/apercu/apercu-quoi-repondre";
import { chargeursFiches } from "@/lib/espace/fiches";
import { envoyeesSiBesoin, fichesVisibles } from "@/lib/espace/lettres";
import { idsFaits, ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { filtrerSituations, lireFiltres, premiereSansFait, type FicheQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { UNIVERS } from "@/lib/espace/fiches-schema";
import { TEXTES_FICHE_LIGNE, TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { FiltresSituations } from "@/components/espace/filtres-situations";
import { CompteFaits, ListeFiches } from "@/components/espace/liste-fiches";
import { CADRE_CARTE_NEUTRE, CADRE_CARTE_RUBRIQUE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { BarreProgression, CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { META, TEXTE_FORT, TITRE_CARTE, TITRE_PAGE } from "@/components/espace/typo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);

/**
 * « Quoi répondre » (s24, lot D6 ; architecture v20 3.3, 3.8, 6.2, 6.3) : les situations et « Quand ça
 * tombe à plat », filtrées par « Où et avec qui ? » et « Pour quoi faire ? » (adresse `?ou=&pour=`), puis
 * le carnet du mois, qui garde son adresse publique `/carnet` (aucune copie). Une reprise de lettre n'est
 * listée qu'après l'envoi de sa lettre. États : liste, filtrée, vide (« Raconte-la à l'équipe », vers
 * « Mes questions »), chargement (`loading.tsx`), erreur (`error.tsx`). Rendu : SSR dynamique (« Fait »
 * de l'abonné, jamais en cache). Garde EN PREMIER : 404 interrupteur fermé.
 *
 * s26, vue abonné (`docs/ux/rubriques-premium-s26.md` §1.2, `docs/design/rubriques-abonne-s26.md` §1) : en-tête à
 * gauche ; grille 12 colonnes dès 1024 px : rail de filtres ouvert (3 col.) et, à droite (9 col.), la prochaine
 * action (première situation sans « Fait », dans l'ordre de la liste : seul bouton plein de l'écran) puis les lieux,
 * chacun avec « faits/total » et sa barre. Sous 1024 px : action, filtres repliés, liste.
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
  if (lecteur) return <ApercuQuoiRepondre visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace(BASE);
  const acces = { acces: "ouvert" as const, userId };
  const toutes = [...chargeursFiches.listerFiches("situation", acces), ...chargeursFiches.listerFiches("a-plat", acces)];
  const filtres = lireFiltres(searchParams);
  const servies = fichesVisibles(toutes, await envoyeesSiBesoin(prisma, toutes));
  const retenues = filtrerSituations(servies, filtres);
  const faits = await idsFaits(userId, retenues.map((f) => f.id));
  const groupes = groupesParLieu(retenues);
  // Prochaine action : la première situation sans « Fait », dans l'ordre d'affichage des lieux (null : tout est fait).
  const prochaine = premiereSansFait(groupes.flatMap((g) => g.fiches), faits);

  return (
    <div className="pb-16">
      <header>
        <h1 className={TITRE_PAGE}>{T.titre}</h1>
      </header>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-quoi-repondre-grille>
        {prochaine && (
          <section
            aria-labelledby="prochaine-titre"
            className={cn(
              CARTE_ACTION,
              "h-auto md:col-span-2 lg:col-span-9 lg:col-start-4 lg:row-start-1 lg:flex-row lg:items-center lg:justify-between lg:gap-6",
            )}
            data-prochaine-action={prochaine.id}
          >
            {/* s26 tour 2 (relecture design) : dès 1024, « Voir » à droite de la ligne titre + durée (même bouton) ; la
                moitié droite de la tuile n'est plus vide. */}
            <div className="min-w-0">
              <h2 id="prochaine-titre" className={TITRE_CARTE}>
                {frEspace(prochaine.titre)}
              </h2>
              <p className={cn("mt-2", META)}>{L.minutes(prochaine.dureeMinutes)}</p>
            </div>
            <Link
              href={ligneDeFiche(prochaine, faits).href}
              aria-describedby="prochaine-titre"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 w-full self-start whitespace-normal md:w-auto md:min-w-44 lg:mt-0 lg:shrink-0 lg:self-center")}
            >
              {L.voir}
            </Link>
          </section>
        )}
        {/* Rail collant seulement si la fenêtre est assez haute pour lui (spec design §1.1 : jamais plus haut que
            l'écran sous l'en-tête global de 64 px) [À MESURER @qa à 1280x900]. */}
        <div
          className={cn(
            "min-w-0 md:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:self-start lg:[@media(min-height:56rem)]:sticky lg:[@media(min-height:56rem)]:top-24",
            prochaine && "lg:row-span-2",
          )}
          data-zone="filtres"
        >
          <FiltresSituations base={BASE} filtres={filtres} />
        </div>
        <section
          aria-label={T.titre}
          aria-live="polite"
          data-etat={retenues.length > 0 ? "liste" : "vide"}
          className={cn("min-w-0 md:col-span-2 lg:col-span-9 lg:col-start-4", prochaine ? "lg:row-start-2" : "lg:row-start-1")}
        >
          {retenues.length > 0 ? (
            // Relecture des captures nav s24 (ux F2, design) : la liste est rangée par lieu, sous les titres des
            // filtres « Où et avec qui ? » (libellés validés) ; les fiches sans lieu (« Quand ça tombe à plat »)
            // sous « Rattraper un faux pas ». Un seul groupe quand un lieu est choisi. s26 : une tuile par lieu.
            <div className="flex flex-col gap-6">
              {groupes.map((g) => {
                const n = g.fiches.filter((f) => faits.has(f.id)).length;
                return (
                  <section key={g.cle} aria-labelledby={`lieu-${g.cle}`} className={cn(CADRE_CARTE_RUBRIQUE, "min-w-0 p-6")} data-lieu={g.cle}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 id={`lieu-${g.cle}`} className={TITRE_CARTE}>
                        {g.titre}
                      </h2>
                      <CompteFaits faits={n} total={g.fiches.length} />
                    </div>
                    <BarreProgression className="mt-4" faites={n} total={g.fiches.length} />
                    <div className="mt-4">
                      <ListeFiches lignes={g.fiches.map((f) => ligneDeFiche(f, faits))} deuxColonnes labelledBy={`lieu-${g.cle}`} groupe={g.titre} />
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className={cn(CADRE_CARTE_NEUTRE, "p-6")} data-testid="quoi-repondre-vide">
              <p className={TEXTE_FORT}>{T.vide}</p>
              <Link href={`${ESPACE_ACCUEIL}/questions`} className={cn("mt-2", LIEN_NEUTRE)}>
                {T.raconte}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
