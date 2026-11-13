"use client";

import { useRef, useState } from "react";
import { TEXTES_CARTES as T } from "@/config/textes/espace-cartes";
import type { CarteEtToi as Carte } from "@/lib/espace/rafale";
import type { ReponseCarte } from "@/lib/espace/revision";
import { appelEspace } from "@/components/espace/carte/appel";
import { BoutonsReponse } from "@/components/espace/carte/boutons-reponse";
import { CompteARebours } from "@/components/espace/carte/compte-a-rebours";
import type { DureeCompteARebours } from "@/lib/espace/compte-a-rebours";
import { EnTeteCarte } from "@/components/espace/carte/en-tete-carte";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import type { ApresReponse } from "@/components/espace/carte/carte-registre";
import { CARTE, ETIQUETTE, nouvelleCle } from "@/components/espace/carte/styles";
import { entreGuillemets } from "@/components/espace/carte/citation";

/**
 * Carte « Et toi ? » (fiche du carnet, 2.2 ; maquette `carte-rafale.html`) : carte de production, sans
 * choix. La scène ; « Ta réponse d'abord » ; « Tu avais une réponse ? » (révèle les deux répliques) ; la
 * réponse « détendue » et la sortie polie « tendue » ; en révision, « Ta réplique la dernière fois »
 * APRÈS la réponse ; « Le pourquoi » du carnet. Aucun texte du carnet modifié, aucun texte neuf.
 * Servie pour les fiches relues du carnet (porte G5 franchie, `lib/espace/carnet-cartes.ts`).
 */
export function CarteEtToi({ carte, nouvelle, ancre }: { carte: Carte; nouvelle: boolean; ancre: string }) {
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
    <p className="flex flex-wrap items-start gap-2 text-base text-text-primary">
      <span className="rounded-full border border-border-input px-2 py-0.5 text-xs font-semibold text-text-secondary">{etiquette}</span>
      <span className="min-w-0 flex-1">{texte}</span>
    </p>
  );

  return (
    <article id={ancre} aria-labelledby={titreId} className={CARTE} data-carte={carte.id}>
      <EnTeteCarte id={titreId} titre={carte.titre} nouvelle={nouvelle} />
      <div className="space-y-2">
        <h3 className={ETIQUETTE}>{T.scene}</h3>
        <p className="text-base text-text-primary">{carte.scene}</p>
        <p className="text-base font-semibold text-text-primary">{entreGuillemets(carte.onTeDit)}</p>
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-primary">{T.reponseDabord}</h3>
        <p className="text-sm text-text-secondary">{T.consigne}</p>
      </div>
      <CompteARebours repondu={reponse !== null} proposer={ancre === "carte-1"} onChange={setCompte} />
      <BoutonsReponse reponse={reponse} revision={!nouvelle} compteActif={compte !== null} onRepondre={(r) => void repondre(r)} />
      {echec && (
        <p role="status" className="text-sm text-text-secondary">
          {T.echec}
        </p>
      )}
      {reponse && (
        <div className="space-y-3">
          {ambiance(T.ambiances.detendue, carte.reponse)}
          {ambiance(T.ambiances.tendue, carte.siTendu)}
          {apres?.revision && apres.replique && (
            <p className="text-sm text-text-secondary" data-testid="replique-derniere-fois">
              {T.repliqueDerniereFois}
              <span className="text-text-primary">{apres.replique}</span>
            </p>
          )}
          <h3 className={ETIQUETTE}>{T.pourquoi}</h3>
          <p className="text-base text-text-primary">{carte.pourquoi}</p>
        </div>
      )}
      {reponse && apres && carte.exercice && (
        <GesteFiche ficheId={carte.ficheId} consigne={carte.exercice} retourInitial={apres.retour} repliqueInitiale={apres.replique} />
      )}
    </article>
  );
}
