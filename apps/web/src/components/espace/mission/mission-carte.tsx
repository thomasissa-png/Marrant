"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_CARTES as TEXTES_CARTES_BRUT, TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { RetourGeste } from "@/lib/espace/retours";
import type { SuiteMission } from "@/lib/espace/missions";
import { enonceAffiche } from "@/lib/espace/enonce-mission";
import { appelEspace } from "@/components/espace/carte/appel";
import { LigneRetour } from "@/components/espace/carte/ligne-retour";
import { BOUTON_SECONDAIRE, CADRE_CARTE_RUBRIQUE, LIEN_NEUTRE, nouvelleCle } from "@/components/espace/carte/styles";
import { buttonVariants } from "@/components/ui/button";
import { ETIQUETTE, META, TEXTE, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { Marches } from "@/components/espace/mission/marches";
import { preparerQuestion } from "@/components/espace/questions/prefill";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const TEXTES_CARTES = frEspaceProfond(TEXTES_CARTES_BRUT);
const M = frEspaceProfond(TEXTES_MISSION);

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
 * s26 (`docs/design/rubriques-abonne-s26.md` §2.3) : cadre des rubriques, échelle `typo.ts`, liens neutres. `principal` :
 * le bouton de suite (« Voir la marche n ») est l'aplat de l'écran quand la rafale est finie ; sinon en contour (la
 * carte à faire reste l'action du jour, un seul plein par écran).
 */
export function MissionCarte({ mission, hrefAPlat, principal = false }: { mission: MissionVue; hrefAPlat: string | null; principal?: boolean }) {
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

  const boutonSuite = principal ? cn(buttonVariants({ variant: "primary", size: "lg" }), "whitespace-normal") : BOUTON_SECONDAIRE;

  const autre = (
    <Link href={hrefMarche(n, mission.id)} className={LIEN_NEUTRE}>
      {M.autreSituation}
    </Link>
  );

  return (
    // s26 : colonne de droite (5 colonnes dès 1024 px), sous l'échelle des marches ; blocs l'un sous l'autre.
    <section id="mission" aria-labelledby="mission-titre" className={cn(CADRE_CARTE_RUBRIQUE, "min-w-0 space-y-4 p-6 [overflow-wrap:anywhere]")} data-mission={mission.id}>
      <p className={cn("flex items-end gap-2", ETIQUETTE)}>
        <span>{M.marche(n)}</span>
        <Marches n={n} />
      </p>
      <h2 id="mission-titre" className={TITRE_CARTE}>
        {M.titresMarches[n]}
      </h2>
      <div className="space-y-2">
        {/* Lot D11c : typographie de l'espace APRÈS le retrait du préfixe « DÉFI XXX : » (sa forme d'origine). */}
        {enonceAffiche(mission.enonce).map(frEspace).map((p) => (
          <p key={p} className={TEXTE}>
            {p}
          </p>
        ))}
      </div>
      <p className={META}>{M.facultative}</p>
      <LigneRetour valeur={retour} onChoisir={(r) => void choisir(r)} occupe={occupe} />
      <div role="status" className="space-y-2">
        {echec && <p className={META}>{TEXTES_CARTES.echec}</p>}
        {suite === "marche" && (
          <>
            {mission.suites.marche && <p className={META}>{mission.suites.marche}</p>}
            {n < 5 ? (
              <Link href={hrefMarche(n + 1)} className={boutonSuite}>
                {M.voirLaMarche(n + 1)}
              </Link>
            ) : (
              autre
            )}
          </>
        )}
        {suite === "bof" && (
          <>
            {mission.suites.bof && <p className={META}>{mission.suites.bof}</p>}
            <ul className="flex flex-col">
              <li>{autre}</li>
              {hrefAPlat && (
                <li>
                  <Link href={hrefAPlat} className={LIEN_NEUTRE}>
                    {M.aPlat}
                  </Link>
                </li>
              )}
              <li>
                {/* Lot D7 : « Une situation à gérer » choisie d'avance (navigateur seul, `prefill.ts`). */}
                <Link href="/mon-espace/questions" className={LIEN_NEUTRE} onClick={() => preparerQuestion({ type: "SITUATION" })}>
                  {M.raconte}
                </Link>
              </li>
            </ul>
          </>
        )}
        {suite === "pas2" &&
          (n > 1 ? (
            <Link href={hrefMarche(n - 1)} className={boutonSuite}>
              {M.voirLaMarche(n - 1)}
            </Link>
          ) : (
            autre
          ))}
      </div>
    </section>
  );
}
