import type { Metadata } from "next";
import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { hrefFiche } from "@/lib/espace/premier-pas";
import { lireRafale } from "@/lib/espace/cartes-serveur";
import { marcheDeRepli, missionDeMarche, missionOuverte, missionsServiesValidees, type NumeroMarche } from "@/lib/espace/missions";
import { lireRetoursMission } from "@/lib/espace/missions-serveur";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { TEXTES_CARTES as T, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { CarteRegistre } from "@/components/espace/carte/carte-registre";
import { CarteEtToi } from "@/components/espace/carte/carte-et-toi";
import { FournisseurCompteARebours } from "@/components/espace/carte/compte-a-rebours";
import { MissionCarte } from "@/components/espace/mission/mission-carte";
import { CARTE, LIEN } from "@/components/espace/carte/styles";

/**
 * « S'entraîner » (s24, lot D5 ; architecture v20 2.2 à 2.4, 3.11 ; maquettes `carte-rafale.html` et
 * `mission.html`) : la rafale du jour (au plus 3 cartes, l'une après l'autre dans la page, ancres
 * `#carte-N` depuis « Aujourd'hui ») puis la mission ouverte (une seule ; `?marche=n` pour consulter une
 * autre marche, jamais un verrou). Rendu : SSR dynamique (données de l'abonné, jamais en cache). Garde
 * EN PREMIER : 404 interrupteur fermé, connexion, `/abonnement` sans abonnement actif.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: N.menuPlus.sEntrainer } : METADONNEES_404;
}

const lireMarche = (v: unknown): NumeroMarche | null => {
  const n = typeof v === "string" ? Number(v) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 5 ? (n as NumeroMarche) : null;
};

export default async function SEntrainerPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
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
  // Lot D11b (@ux D-4) : aucune carte montrable = « C'est tout pour aujourd'hui », même si le moteur n'a pas dit fini.
  const sansCarte = etat.cartes.every((c) => !etat.catalogue.get(c.carteId));

  return (
    <div className="flex flex-col gap-6 pb-12 lg:max-w-lecture">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{N.menuPlus.sEntrainer}</h1>
      <p className="text-sm text-text-secondary">{T.accroche}</p>
      <FournisseurCompteARebours etat={etat.compteARebours}>
        {etat.cartes.map((c, i) => {
          const carte = etat.catalogue.get(c.carteId);
          if (!carte) return null;
          const ancre = `carte-${i + 1}`;
          return carte.genre === "registre" ? (
            <CarteRegistre key={c.carteId} carte={carte} nouvelle={c.nouvelle} ancre={ancre} />
          ) : (
            <CarteEtToi key={c.carteId} carte={carte} nouvelle={c.nouvelle} ancre={ancre} />
          );
        })}
      </FournisseurCompteARebours>
      {(etat.fini || sansCarte) && (
        <div className={CARTE}>
          <p className="text-base font-semibold text-text-primary">{T.fini}</p>
        </div>
      )}
      {marche && !mission && (
        <div id="mission" className={CARTE} data-testid="mission-vide">
          <p className="text-sm text-text-primary">{M.aucuneMission}</p>
          {repli && (
            <Link href={`/mon-espace/s-entrainer?marche=${repli}#mission`} className={LIEN}>
              {M.voirLaMarche(repli)}
            </Link>
          )}
        </div>
      )}
      {mission && (
        <MissionCarte
          mission={{ id: mission.id, marche: mission.marche, enonce: mission.enonce, suites: mission.suites }}
          hrefAPlat={aPlat ? hrefFiche("a-plat", aPlat.id) : null}
        />
      )}
    </div>
  );
}
