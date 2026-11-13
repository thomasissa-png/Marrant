"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_CARTES, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import type { RetourGeste } from "@/lib/espace/retours";
import type { SuiteMission } from "@/lib/espace/missions";
import { enonceAffiche } from "@/lib/espace/enonce-mission";
import { appelEspace } from "@/components/espace/carte/appel";
import { LigneRetour } from "@/components/espace/carte/ligne-retour";
import { BOUTON_PRINCIPAL, CARTE, LIEN, nouvelleCle } from "@/components/espace/carte/styles";
import { Marches } from "@/components/espace/mission/marches";
import { preparerQuestion } from "@/components/espace/questions/prefill";

export interface MissionVue {
  id: string;
  marche: 1 | 2 | 3 | 4 | 5;
  enonce: string[];
  suites: { marche?: string; bof?: string };
}

/** Adresse d'une marche (toute marche se consulte : un ordre conseillé, jamais un verrou). */
export const hrefMarche = (n: number, autre?: string) =>
  `/mon-espace/s-entrainer?marche=${n}${autre ? `&autre=${encodeURIComponent(autre)}` : ""}#mission`;

/**
 * Mission (architecture v20 2.4, maquette `mission.html`) : « Marche n » et ses cinq marches, le titre
 * de la marche, l'énoncé, « Facultative », « Ton retour », puis la suite selon le retour (jamais selon
 * la date) : marche d'au-dessus, même marche avec une autre situation, rien, ou, après deux « Pas
 * essayé », la marche d'en dessous sans commentaire. Une seule mission ouverte à la fois.
 */
export function MissionCarte({ mission, hrefAPlat }: { mission: MissionVue; hrefAPlat: string | null }) {
  const cle = useRef(nouvelleCle());
  const [retour, setRetour] = useState<RetourGeste | null>(null);
  const [suite, setSuite] = useState<SuiteMission | null>(null);
  const [occupe, setOccupe] = useState(false);
  const [echec, setEchec] = useState(false);
  const n = mission.marche;

  const choisir = async (r: RetourGeste) => {
    // Après « Pas essayé », la mission reste là : un nouveau retour est un nouveau geste (nouvelle clé).
    if (occupe || (retour && suite !== "pas")) return;
    if (retour) cle.current = nouvelleCle();
    setRetour(r);
    setOccupe(true);
    const res = await appelEspace<{ suite: SuiteMission }>("/api/espace/mission/retour", "POST", { missionId: mission.id, retour: r, cle: cle.current });
    setOccupe(false);
    if (!res) {
      setRetour(null);
      setEchec(true);
      return;
    }
    setEchec(false);
    setSuite(res.suite);
  };

  const autre = (
    <Link href={hrefMarche(n, mission.id)} className={LIEN}>
      {M.autreSituation}
    </Link>
  );

  return (
    <section id="mission" aria-labelledby="mission-titre" className={CARTE} data-mission={mission.id}>
      <p className="flex items-end gap-3 text-xs font-semibold text-text-muted">
        <span>{M.marche(n)}</span>
        <Marches n={n} />
      </p>
      <h2 id="mission-titre" className="font-display text-xl font-bold text-text-primary max-e300:text-lg">
        {M.titresMarches[n]}
      </h2>
      <div className="space-y-2">
        {enonceAffiche(mission.enonce).map((p) => (
          <p key={p} className="text-base text-text-primary">
            {p}
          </p>
        ))}
      </div>
      <p className="text-sm text-text-secondary">{M.facultative}</p>
      <LigneRetour valeur={retour} onChoisir={(r) => void choisir(r)} occupe={occupe} />
      <div role="status" className="space-y-2">
        {echec && <p className="text-sm text-text-secondary">{TEXTES_CARTES.echec}</p>}
        {suite === "marche" && (
          <>
            {mission.suites.marche && <p className="text-sm text-text-secondary">{mission.suites.marche}</p>}
            {n < 5 ? (
              <Link href={hrefMarche(n + 1)} className={BOUTON_PRINCIPAL}>
                {M.voirLaMarche(n + 1)}
              </Link>
            ) : (
              autre
            )}
          </>
        )}
        {suite === "bof" && (
          <>
            {mission.suites.bof && <p className="text-sm text-text-secondary">{mission.suites.bof}</p>}
            <ul className="flex flex-col">
              <li>{autre}</li>
              {hrefAPlat && (
                <li>
                  <Link href={hrefAPlat} className={LIEN}>
                    {M.aPlat}
                  </Link>
                </li>
              )}
              <li>
                {/* Lot D7 : « Une situation à gérer » choisie d'avance (navigateur seul, `prefill.ts`). */}
                <Link href="/mon-espace/questions" className={LIEN} onClick={() => preparerQuestion({ type: "SITUATION" })}>
                  {M.raconte}
                </Link>
              </li>
            </ul>
          </>
        )}
        {suite === "pas2" &&
          (n > 1 ? (
            <Link href={hrefMarche(n - 1)} className={BOUTON_PRINCIPAL}>
              {M.voirLaMarche(n - 1)}
            </Link>
          ) : (
            autre
          ))}
      </div>
    </section>
  );
}
