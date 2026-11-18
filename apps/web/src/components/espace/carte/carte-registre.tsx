"use client";

import { useRef, useState } from "react";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import type { CarteRegistre as Carte } from "@/lib/espace/rafale";
import type { ReponseCarte } from "@/lib/espace/revision";
import type { RetourGeste } from "@/lib/espace/retours";
import { appelEspace } from "@/components/espace/carte/appel";
import { BoutonsReponse } from "@/components/espace/carte/boutons-reponse";
import { CompteARebours } from "@/components/espace/carte/compte-a-rebours";
import type { DureeCompteARebours } from "@/lib/espace/compte-a-rebours";
import { EnTeteCarte } from "@/components/espace/carte/en-tete-carte";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import { BOUTON_SECONDAIRE, nouvelleCle } from "@/components/espace/carte/styles";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { entreGuillemets } from "@/components/espace/carte/citation";
import { FINE, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CARTES);

type Registre = keyof Carte["repliques"];
const REGISTRES: readonly Registre[] = ["sure", "joueuse", "risquee"];
export type ApresReponse = { revision: boolean; replique: string | null; retour: RetourGeste | null };

/**
 * s26 (`docs/design/rubriques-abonne-s26.md` §2.2) : cadre d'une carte de la rafale. `action` : la première carte à
 * faire, dépliée, dans la zone d'accent de la page (`CARTE_ACTION`, teinte légère, pas un aplat) ; `repliee` : le
 * corps d'une carte dans son `<details>` (`CarteRepliee`, qui porte le cadre), sous un filet.
 */
export type CadreCarte = "action" | "repliee";
export const cadreCarte = (cadre: CadreCarte) =>
  cadre === "action"
    ? cn(CARTE_ACTION, "h-auto gap-4")
    : "flex min-w-0 flex-col gap-4 border-t border-border p-6 [overflow-wrap:anywhere]";

/**
 * Carte « Quel registre ? » et « Ta première phrase d'abord » (architecture v20 2.2, maquette
 * `carte-rafale.html`) : la scène et le contexte ; « Ta réponse d'abord » ; « Tu avais une réponse ? »
 * (qui révèle les répliques) ; sur une carte de révision, « Ta réplique la dernière fois » APRÈS la
 * réponse (la note n'est pas dans la page avant : elle arrive avec la réponse de l'API) ; le choix ; la
 * règle ; puis le geste de la fiche, « Ton retour » et « Ma réplique à moi ».
 */
export function CarteRegistre({ carte, nouvelle, ancre, cadre = "action" }: { carte: Carte; nouvelle: boolean; ancre: string; cadre?: CadreCarte }) {
  const cle = useRef(nouvelleCle());
  const [reponse, setReponse] = useState<ReponseCarte | null>(null);
  const [apres, setApres] = useState<ApresReponse | null>(null);
  const [choix, setChoix] = useState<Registre | null>(null);
  const [echec, setEchec] = useState(false);
  const [compte, setCompte] = useState<DureeCompteARebours | null>(null);
  const titreId = `${ancre}-t`;

  const repondre = async (r: ReponseCarte) => {
    setReponse(r);
    const res = await appelEspace<ApresReponse>(`/api/espace/carte/${carte.id}/reponse`, "POST", { cle: cle.current, reponse: r, compteARebours: compte });
    setEchec(!res);
    setApres(res ?? { revision: !nouvelle, replique: null, retour: null });
  };

  const choisir = async (g: Registre) => {
    if (choix) return;
    setChoix(g);
    const res = await appelEspace<{ juste: boolean }>(`/api/espace/carte/${carte.id}/reponse`, "POST", { cle: cle.current, choix: g });
    if (!res) setEchec(true);
  };

  return (
    // s26 : les blocs l'un sous l'autre, dans la colonne des cartes (7 colonnes dès 1024 px) ; cadre selon la place.
    <article id={ancre} aria-labelledby={titreId} className={cadreCarte(cadre)} data-carte={carte.id} data-cadre={cadre}>
      <EnTeteCarte id={titreId} titre={carte.titre} nouvelle={nouvelle} />
      <div className="space-y-2">
        <h3 className={ETIQUETTE}>{T.scene}</h3>
        <p className={TEXTE}>{carte.scene.texte}</p>
        {carte.scene.onTeDit && <p className={TEXTE_FORT}>{entreGuillemets(carte.scene.onTeDit)}</p>}
        {carte.scene.suite && <p className={TEXTE}>{carte.scene.suite}</p>}
      </div>
      <div className="space-y-2 rounded-xl bg-background-light px-4 py-2">
        <p className={ETIQUETTE}>{T.contexte}</p>
        <p className={cn(META, "text-text-primary")}>{carte.contexte}</p>
      </div>
      <div className="space-y-2">
        <h3 className={TEXTE_FORT}>{carte.premierePhrase ? T.premierePhraseDabord : T.reponseDabord}</h3>
        <p className={META}>{T.consigne}</p>
      </div>
      <CompteARebours repondu={reponse !== null} proposer={ancre === "carte-1"} onChange={setCompte} />
      <BoutonsReponse reponse={reponse} revision={!nouvelle} compteActif={compte !== null} onRepondre={(r) => void repondre(r)} />
      {echec && (
        <p role="status" className={META}>
          {T.echec}
        </p>
      )}
      {reponse && (
        <section aria-labelledby={`${ancre}-l`} className="space-y-4">
          <h3 id={`${ancre}-l`} className={TEXTE_FORT}>
            {T.laquelle}
          </h3>
          {apres?.revision && apres.replique && (
            <p className={META} data-testid="replique-derniere-fois">
              {T.repliqueDerniereFois}
              <span className="text-text-primary">{apres.replique}</span>
            </p>
          )}
          <div className="grid gap-2">
            {REGISTRES.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={choix === g}
                disabled={choix !== null}
                onClick={() => void choisir(g)}
                className={cn(BOUTON_SECONDAIRE, "flex-col !items-start gap-2 text-left", choix === g && "border-text-primary bg-background-elevated")}
              >
                <span>{T.registres[g]}</span>
                <span className="font-normal">«{FINE}{carte.repliques[g]}{FINE}»</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {choix && (
        <div role="status" className={cn("space-y-2 rounded-xl bg-background-light p-4", META, "text-text-primary")}>
          <p>
            <span className="font-semibold">{T.ici(T.registres[carte.bonneReponse])}</span> {carte.pourquoi}
          </p>
          <p>{carte.regle}</p>
        </div>
      )}
      {choix && apres && carte.geste && (
        <GesteFiche
          ficheId={carte.ficheId}
          consigne={carte.geste.consigne}
          pourAllerPlusLoin={carte.geste.pourAllerPlusLoin ?? null}
          retourInitial={apres.retour}
          repliqueInitiale={apres.replique}
        />
      )}
    </article>
  );
}
