"use client";

import { useState } from "react";
import Link from "next/link";
import { TEXTES_BILAN as B } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES as C } from "@/config/textes/espace-cartes";
import type { FicheDeType } from "@/lib/espace/fiches";
import { BOUTON_SECONDAIRE, CARTE, ETIQUETTE, LIEN } from "@/components/espace/carte/styles";
import { ReponseDabord } from "@/components/espace/fiche/reponse-dabord";

type Element = FicheDeType<"bilan">["contenu"]["elements"][number];
type Laquelle = Extract<Element, { forme: "laquelle" }>;

function Entete({ id, titre }: { id: string; titre: string }) {
  return (
    <div className="space-y-1">
      <p className={ETIQUETTE}>{B.eyebrow}</p>
      <h2 id={id} className="font-display text-xl font-bold text-text-primary">
        {titre}
      </h2>
    </div>
  );
}

/** « Laquelle ressortir ici ? » (libellés §5, `mission.html#etat=bilan`) : un seul choix, verrouillé et marqué. */
function QuestionLaquelle({ e, n }: { e: Laquelle; n: number }) {
  const [choix, setChoix] = useState<number | null>(null);
  const juste = choix === e.bonneReponse;
  return (
    <section aria-labelledby={`bilan-${n}`} className={CARTE} data-bilan="laquelle">
      <Entete id={`bilan-${n}`} titre={B.titre} />
      {e.scene && (
        <div className="space-y-2">
          <h3 className={ETIQUETTE}>{C.scene}</h3>
          <p className="text-base text-text-primary">{e.scene}</p>
        </div>
      )}
      <div className="rounded-md border-l-2 border-border-input bg-background-light px-3 py-2">
        <p className={ETIQUETTE}>{C.contexte}</p>
        <p className="text-sm text-text-primary">{e.contexte}</p>
      </div>
      <ReponseDabord>
        <div role="group" aria-labelledby={`bilan-${n}-q`} className="space-y-2">
          <h3 id={`bilan-${n}-q`} className="text-base font-semibold text-text-primary">
            {B.laquelle}
          </h3>
          <div className="grid gap-2">
            {e.options.map((o, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={choix === i}
                disabled={choix !== null}
                onClick={() => setChoix(i)}
                className={`${BOUTON_SECONDAIRE} !justify-start gap-3 text-left font-normal disabled:text-text-muted ${choix === i ? "border-2 border-accent-link bg-background-elevated !text-text-primary" : ""}`}
              >
                <b className="flex-none">{B.lettres[i]}</b>
                <span>{o}</span>
              </button>
            ))}
          </div>
        </div>
        {choix !== null && (
          <div role="status" className="space-y-2 rounded-md bg-background-light p-3 text-sm text-text-primary" data-testid="bilan-retour">
            {!juste && <p>{B.pasCelleLa}</p>}
            <p>{e.retour}</p>
            {!juste && e.renvoi && (
              <p>
                <Link href={e.renvoi.href} className={LIEN}>
                  {B.deuxiemeTour(e.renvoi.titre)}
                </Link>
              </p>
            )}
          </div>
        )}
      </ReponseDabord>
    </section>
  );
}

/**
 * Bilan du parcours (s24, lot D6 ; architecture v20 3.10, libellés 27 et §5) : « refais une situation »,
 * pas un examen (ni note, ni seuil, ni certificat, rien d'enregistré hors « Fait »). Deux « Laquelle
 * ressortir ici ? », un « dans l'ordre » (retour après « Tu avais une réponse ? »), un « à voix haute ».
 */
export function BilanParcours({ elements }: { elements: readonly Element[] }) {
  return (
    <div className="flex flex-col gap-6">
      {elements.map((e, n) => {
        if (e.forme === "laquelle") return <QuestionLaquelle key={n} e={e} n={n} />;
        if (e.forme === "ordre")
          return (
            <section key={n} aria-labelledby={`bilan-${n}`} className={CARTE} data-bilan="ordre">
              <Entete id={`bilan-${n}`} titre={e.consigne} />
              <ol className="list-[lower-alpha] space-y-1 pl-6 text-base text-text-primary">
                {e.etapes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
              <ReponseDabord>
                <p role="status" className="rounded-md bg-background-light p-3 text-sm text-text-primary">
                  {e.retour}
                </p>
              </ReponseDabord>
            </section>
          );
        return (
          <section key={n} aria-labelledby={`bilan-${n}`} className={CARTE} data-bilan="voix-haute">
            <Entete id={`bilan-${n}`} titre={e.consigne} />
          </section>
        );
      })}
    </div>
  );
}
