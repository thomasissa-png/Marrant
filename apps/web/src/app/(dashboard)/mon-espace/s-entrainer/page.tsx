import type { Metadata } from "next";
import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { ApercuRubrique, metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { chargeursFiches } from "@/lib/espace/fiches";
import { hrefFiche } from "@/lib/espace/premier-pas";
import { lireRafale } from "@/lib/espace/cartes-serveur";
import { segmentsRafale } from "@/lib/espace/rafale";
import { marcheDeRepli, marcheProposee, marchesReussies, missionDeMarche, missionOuverte, missionsServiesValidees, type NumeroMarche } from "@/lib/espace/missions";
import { lireRetoursMission } from "@/lib/espace/missions-serveur";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { TEXTES_CARTES, TEXTES_MISSION } from "@/config/textes/espace-cartes";
import { CarteRegistre } from "@/components/espace/carte/carte-registre";
import { CarteEtToi } from "@/components/espace/carte/carte-et-toi";
import { CarteRepliee } from "@/components/espace/carte/carte-repliee";
import { FournisseurCompteARebours } from "@/components/espace/carte/compte-a-rebours";
import { MissionCarte } from "@/components/espace/mission/mission-carte";
import { EchelleMarches } from "@/components/espace/mission/echelle-marches";
import { CADRE_CARTE_RUBRIQUE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { TEXTE, TEXTE_FORT, TITRE_PAGE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const N = frEspaceProfond(TEXTES_ESPACE_NAVIGATION);
const T = frEspaceProfond(TEXTES_CARTES);
const M = frEspaceProfond(TEXTES_MISSION);

/**
 * « S'entraîner » (s24, lot D5 ; architecture v20 2.2 à 2.4, 3.11 ; maquettes `carte-rafale.html` et
 * `mission.html`) : la rafale du jour (au plus 3 cartes, ancres `#carte-N` depuis « Aujourd'hui ») puis la
 * mission ouverte (une seule ; `?marche=n` pour consulter une autre marche, jamais un verrou). Rendu : SSR
 * dynamique (données de l'abonné, jamais en cache). Garde EN PREMIER : 404 interrupteur fermé ; nav v6, aperçu
 * pour le visiteur et l'inscrit gratuit.
 *
 * s26, vue abonné (`docs/ux/rubriques-premium-s26.md` §3.2, `docs/design/rubriques-abonne-s26.md` §2) : plus de
 * colonne centrée. Dès 1024 px, 7 colonnes de cartes (segments de la rafale, première carte à faire dépliée dans la
 * zone d'accent, les autres repliées) et 5 colonnes de mission (échelle des 5 marches, puis la mission), sans `sticky`
 * (la colonne dépasse l'écran). Dessous, une colonne : cartes, puis échelle et mission. Rafale finie : « C'est tout
 * pour aujourd'hui » à la place des cartes, et le bouton de suite de la mission devient le plein.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("sEntrainer") : { title: N.index.sEntrainer };
}

const lireMarche = (v: unknown): NumeroMarche | null => {
  const n = typeof v === "string" ? Number(v) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 5 ? (n as NumeroMarche) : null;
};

export default async function SEntrainerPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuRubrique rubrique="sEntrainer" visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace("/mon-espace/s-entrainer");
  const acces = { acces: "ouvert" as const, userId };
  const [etat, retours] = await Promise.all([lireRafale(userId, acces), lireRetoursMission(userId)]);
  const missions = missionsServiesValidees();
  const marche = lireMarche(searchParams.marche);
  const autre = typeof searchParams.autre === "string" ? searchParams.autre : null;
  const mission = marche ? missionDeMarche(missions, retours, marche, autre) : missionOuverte(missions, retours);
  // Lot D11b (@ux D-3) : une marche demandée sans mission servable n'est jamais une page muette ;
  // lien vers la marche ouverte, sinon la plus proche qui a une mission.
  const repli = marche && !mission ? marcheDeRepli(missions, retours, marche) : null;
  const aPlat = chargeursFiches.listerFiches("a-plat", acces)[0];
  // Cartes montrables, dans l'ordre du moteur ; l'ancre garde le rang d'« Aujourd'hui » (`#carte-N`, N = rang + 1).
  const montrables = etat.cartes.flatMap((c, i) => {
    const carte = etat.catalogue.get(c.carteId);
    return carte ? [{ c, carte, ancre: `carte-${i + 1}` }] : [];
  });
  // Lot D11b (@ux D-4) : aucune carte montrable = « C'est tout pour aujourd'hui », même si le moteur n'a pas dit fini.
  const fini = etat.fini || montrables.length === 0;
  // Progression : segments de la rafale (cartes jouées aujourd'hui sur cartes du jour) ; échelle des marches (marche
  // de la mission affichée, sinon celle demandée, sinon la marche proposée ; marches réussies d'après les retours).
  const segments = segmentsRafale(etat);
  const enCours = mission?.marche ?? marche ?? marcheProposee(retours);

  return (
    <div className="pb-16">
      <header>
        <h1 className={TITRE_PAGE}>{N.index.sEntrainer}</h1>
        <p className={cn("mt-2 max-w-xl", TEXTE)}>{T.accroche}</p>
      </header>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start" data-entrainement-grille>
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7" data-zone="cartes">
          {segments.total > 0 && (
            <span className="flex gap-2" aria-hidden="true" data-segments-rafale={`${segments.faites}/${segments.total}`}>
              {Array.from({ length: segments.total }, (_, i) => (
                <span key={i} className={cn("block h-2 flex-1 rounded-full", i < segments.faites ? "bg-text-secondary" : "bg-border-hover")} />
              ))}
            </span>
          )}
          {fini ? (
            <div className={cn(TUILE, "h-auto")} data-rafale-finie>
              <p className={TEXTE_FORT}>{T.fini}</p>
            </div>
          ) : (
            <FournisseurCompteARebours etat={etat.compteARebours}>
              {montrables.map(({ c, carte, ancre }, rang) => {
                const cadre = rang === 0 ? "action" : "repliee";
                const corps =
                  carte.genre === "registre" ? (
                    <CarteRegistre key={c.carteId} carte={frEspaceProfond(carte)} nouvelle={c.nouvelle} ancre={ancre} cadre={cadre} />
                  ) : (
                    <CarteEtToi key={c.carteId} carte={frEspaceProfond(carte)} nouvelle={c.nouvelle} ancre={ancre} cadre={cadre} />
                  );
                // Prochaine action : la première carte à faire, dépliée ; les suivantes repliées (titre seul).
                return rang === 0 ? (
                  corps
                ) : (
                  <CarteRepliee key={c.carteId} ancre={ancre} titre={frEspaceProfond(carte).titre}>
                    {corps}
                  </CarteRepliee>
                );
              })}
            </FournisseurCompteARebours>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5" data-zone="mission">
          <EchelleMarches enCours={enCours} reussies={marchesReussies(retours)} />
          {marche && !mission && (
            <div id="mission" className={cn(CADRE_CARTE_RUBRIQUE, "min-w-0 p-6")} data-testid="mission-vide">
              <p className={TEXTE_FORT}>{M.aucuneMission}</p>
              {repli && (
                <Link href={`/mon-espace/s-entrainer?marche=${repli}#mission`} className={cn("mt-2", LIEN_NEUTRE)}>
                  {M.voirLaMarche(repli)}
                </Link>
              )}
            </div>
          )}
          {mission && (
            <MissionCarte
              mission={{ id: mission.id, marche: mission.marche, enonce: mission.enonce, suites: frEspaceProfond(mission.suites) }}
              hrefAPlat={aPlat ? hrefFiche("a-plat", aPlat.id) : null}
              principal={fini}
            />
          )}
        </div>
      </div>
    </div>
  );
}
