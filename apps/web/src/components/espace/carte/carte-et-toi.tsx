"use client";

import { useRef, useState } from "react";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import type { CarteEtToi as Carte } from "@/lib/espace/rafale";
import type { ReponseCarte } from "@/lib/espace/revision";
import { appelEspace } from "@/components/espace/carte/appel";
import { BoutonsReponse } from "@/components/espace/carte/boutons-reponse";
import { CompteARebours } from "@/components/espace/carte/compte-a-rebours";
import type { DureeCompteARebours } from "@/lib/espace/compte-a-rebours";
import { EnTeteCarte } from "@/components/espace/carte/en-tete-carte";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import { BLOC_GESTE, BLOC_SCENE, cadreCarte, type ApresReponse, type CadreCarte } from "@/components/espace/carte/carte-registre";
import { LIBELLE_BLOC } from "@/components/home/da-site";
import { nouvelleCle } from "@/components/espace/carte/styles";
import { ETIQUETTE, META, TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { entreGuillemets } from "@/components/espace/carte/citation";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CARTES);

/**
 * Carte « Et toi ? » (fiche du carnet, 2.2 ; maquette `carte-rafale.html`) : carte de production, sans
 * choix. La scène ; « Ta réponse d'abord » ; « Tu avais une réponse ? » (révèle les deux répliques) ; la
 * réponse « détendue » et la sortie polie « tendue » ; en révision, « Ta réplique la dernière fois »
 * APRÈS la réponse ; « Le pourquoi » du carnet. Aucun texte du carnet modifié, aucun texte neuf.
 * Servie pour les fiches relues du carnet (porte G5 franchie, `lib/espace/carnet-cartes.ts`).
 */
export function CarteEtToi({ carte, nouvelle, ancre, cadre = "action" }: { carte: Carte; nouvelle: boolean; ancre: string; cadre?: CadreCarte }) {
  const cle = useRef(nouvelleCle());
  const [reponse, setReponse] = useState<ReponseCarte | null>(null);
  const [apres, setApres] = useState<ApresReponse | null>(null);
  const [echec, setEchec] = useState(false);
  const [compte, setCompte] = useState<DureeCompteARebours | null>(null);
  const titreId = `${ancre}-t`;

  const repondre = async (r: ReponseCarte) => {
    setReponse(r);
    const res = await appelEspace<ApresReponse>(`/api/espace/carte/${carte.id}/reponse`, "POST", { cle: cle.current, reponse: r, compteARebours: compte });
    setEchec(!res);
    setApres(res ?? { revision: !nouvelle, replique: null, retour: null });
  };

  const ambiance = (etiquette: string, texte: string) => (
    <p className={cn("flex flex-wrap items-start gap-2", TEXTE, "text-text-primary")}>
      <span className={cn("rounded-full border border-border-input px-3 py-1", META)}>{etiquette}</span>
      <span className="min-w-0 flex-1">{texte}</span>
    </p>
  );

  return (
    // s26 : les blocs l'un sous l'autre, dans la colonne des cartes (7 colonnes dès 1024 px) ; cadre selon la place.
    <article id={ancre} aria-labelledby={titreId} className={cadreCarte(cadre)} data-carte={carte.id} data-cadre={cadre}>
      <EnTeteCarte id={titreId} titre={carte.titre} nouvelle={nouvelle} />
      <div className={BLOC_SCENE}>
        <h3 className={LIBELLE_BLOC}>{T.scene}</h3>
        <p className={TEXTE}>{carte.scene}</p>
        <p className={TEXTE_FORT}>{entreGuillemets(carte.onTeDit)}</p>
      </div>
      <div className="space-y-2">
        <h3 className={TEXTE_FORT}>{T.reponseDabord}</h3>
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
        <div className="space-y-4">
          {ambiance(T.ambiances.detendue, carte.reponse)}
          {ambiance(T.ambiances.tendue, carte.siTendu)}
          {apres?.revision && apres.replique && (
            <p className={META} data-testid="replique-derniere-fois">
              {T.repliqueDerniereFois}
              <span className="text-text-primary">{apres.replique}</span>
            </p>
          )}
          <h3 className={ETIQUETTE}>{T.pourquoi}</h3>
          <p className={TEXTE}>{carte.pourquoi}</p>
        </div>
      )}
      {reponse && apres && carte.exercice && (
        <div className={BLOC_GESTE}>
          <GesteFiche ficheId={carte.ficheId} consigne={carte.exercice} retourInitial={apres.retour} repliqueInitiale={apres.replique} separe={false} da />
        </div>
      )}
    </article>
  );
}
