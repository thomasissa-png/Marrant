import type { Metadata } from "next";
import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE, ESPACE_ACCUEIL } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { ApercuQuoiRepondre } from "@/components/espace/apercu/apercu-quoi-repondre";
import { ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { premiereSansFait, type FicheQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { cleDefilementPage, ficheParDefaut, queryFiltres } from "@/lib/espace/quoi-repondre-liste";
import { UNIVERS } from "@/lib/espace/fiches-schema";
import { TEXTES_FICHE_LIGNE, TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { FiltresSituations } from "@/components/espace/filtres-situations";
import { CompteFaits, ListeFiches } from "@/components/espace/liste-fiches";
// s26 DA du site (décision de Thomas du 20/11) : tuiles au filet violet de l'accueil (`CADRE_CARTE`), liens violets.
import { CADRE_CARTE, LIEN } from "@/components/espace/carte/styles";
import { BarreProgression, CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { PanneauFiche, chargerListeQuoiRepondre, donneesPanneau, lettreDeFiche } from "@/components/espace/quoi-repondre/panneau";
import { MemoireDefilementPage } from "@/components/espace/quoi-repondre/navigation";
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
 * s26 liste et détail (`docs/ux/liste-detail-quoi-repondre-s26.md`, `docs/design/liste-detail-quoi-repondre-s26.md`) :
 * la liste de gauche est dans le layout dès 1024. Cette page rend donc deux choses, une seule visible à chaque largeur :
 * sous 1024, la page liste d'avant (H1, prochaine action « Voir », filtres repliés, une tuile par lieu ; 2 colonnes de
 * lignes dès 768), liens de fiche AVEC les filtres, position gardée au retour ; dès 1024, le panneau de droite n'est
 * jamais vide : la fiche ouverte d'office (première sans « Fait » du filtre, sinon la première), sans redirection ni
 * changement d'adresse, ou la tuile `vide` quand le filtre est vide. Le rail de filtres 3/9 de s26 tour 3 est remplacé
 * par la colonne de liste (filtres repliés dedans).
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

function Vide({ testid = "quoi-repondre-vide" }: { testid?: string }) {
  return (
    <div className={cn(CADRE_CARTE, "p-6")} data-testid={testid}>
      <p className={TEXTE_FORT}>{T.vide}</p>
      <Link href={`${ESPACE_ACCUEIL}/questions`} className={cn("mt-2", LIEN)}>
        {T.raconte}
      </Link>
    </div>
  );
}

export default async function QuoiRepondrePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuQuoiRepondre visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace(BASE);
  const { filtres, ordre: retenues, faits } = await chargerListeQuoiRepondre(userId, searchParams);
  const q = queryFiltres(filtres);
  const groupes = groupesParLieu(retenues);
  // Prochaine action : la première situation sans « Fait », dans l'ordre d'affichage des lieux (null : tout est fait).
  const prochaine = premiereSansFait(retenues, faits);
  // Dès 1024 : la fiche ouverte d'office (la prochaine, sinon la première du filtre).
  const ouverte = ficheParDefaut(retenues, faits);
  const lettre = ouverte ? await lettreDeFiche(ouverte) : null;
  const panneau = ouverte && lettre !== undefined ? await donneesPanneau({ userId, fiche: ouverte, lettre, ordre: retenues, filtres, faits }) : null;
  const ligne = (f: FicheQuoiRepondre) => {
    const l = ligneDeFiche(f, faits);
    return { ...l, href: `${l.href}${q}` };
  };

  return (
    <>
      <MemoireDefilementPage cle={cleDefilementPage(filtres)}>
        <div className="lg:hidden" data-mode="page">
          <header>
            <h1 className={TITRE_PAGE}>{T.titre}</h1>
          </header>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2" data-quoi-repondre-grille>
            {prochaine && (
              <section aria-labelledby="prochaine-titre" className={cn(CARTE_ACTION, "h-auto md:col-span-2")} data-prochaine-action={prochaine.id}>
                <div className="min-w-0">
                  <h2 id="prochaine-titre" className={TITRE_CARTE}>
                    {frEspace(prochaine.titre)}
                  </h2>
                  <p className={cn("mt-2", META)}>{L.minutes(prochaine.dureeMinutes)}</p>
                </div>
                <Link
                  href={ligne(prochaine).href}
                  aria-describedby="prochaine-titre"
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 w-full self-start whitespace-normal md:w-auto md:min-w-44")}
                >
                  {L.voir}
                </Link>
              </section>
            )}
            <div className="min-w-0 md:col-span-2" data-zone="filtres">
              <FiltresSituations base={BASE} filtres={filtres} />
            </div>
            <section aria-label={T.titre} aria-live="polite" data-etat={retenues.length > 0 ? "liste" : "vide"} className="min-w-0 md:col-span-2">
              {retenues.length > 0 ? (
                // Relecture des captures nav s24 (ux F2, design) : la liste est rangée par lieu, sous les titres des
                // filtres « Où et avec qui ? » (libellés validés) ; les fiches sans lieu (« Quand ça tombe à plat »)
                // sous « Rattraper un faux pas ». Un seul groupe quand un lieu est choisi. s26 : une tuile par lieu.
                <div className="flex flex-col gap-6">
                  {groupes.map((g) => {
                    const n = g.fiches.filter((f) => faits.has(f.id)).length;
                    return (
                      <section key={g.cle} aria-labelledby={`lieu-${g.cle}`} className={cn(CADRE_CARTE, "min-w-0 p-6")} data-lieu={g.cle}>
                        <div className="flex items-baseline justify-between gap-4">
                          <h2 id={`lieu-${g.cle}`} className={TITRE_CARTE}>
                            {g.titre}
                          </h2>
                          <CompteFaits faits={n} total={g.fiches.length} />
                        </div>
                        <BarreProgression className="mt-4" faites={n} total={g.fiches.length} />
                        <div className="mt-4">
                          <ListeFiches lignes={g.fiches.map(ligne)} deuxColonnes labelledBy={`lieu-${g.cle}`} groupe={g.titre} />
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <Vide />
              )}
            </section>
          </div>
        </div>
      </MemoireDefilementPage>
      <div className="hidden lg:block" data-mode="panneau">
        {panneau ? <PanneauFiche {...panneau} /> : <Vide testid="quoi-repondre-vide-panneau" />}
      </div>
    </>
  );
}
