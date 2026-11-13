"use client";

import { TEXTES_CARTES as C } from "@/config/textes/espace-cartes";
import { TEXTES_FICHE as T } from "@/config/textes/espace-bibliotheque";
import { ETIQUETTE } from "@/components/espace/carte/styles";
import { entreGuillemets } from "@/components/espace/carte/citation";
import { ReponseDabord } from "@/components/espace/fiche/reponse-dabord";

type Replique = { texte: string; pourquoi: string };

export interface CorpsSituationProps {
  premierePhrase: boolean;
  scene: { texte: string; onTeDit?: string; suite?: string };
  repliques: { sure: Replique; joueuse: Replique; risquee: Replique };
  quandMonter?: { regle: string; surCetteScene?: string };
  erreur?: string;
}

const REGISTRES = ["sure", "joueuse", "risquee"] as const;

/**
 * Corps d'une situation (« Quoi répondre », « Quand ça tombe à plat », situation du coin), étalon E1.1 :
 * la scène, « Ta réponse d'abord », puis, après « Tu avais une réponse ? », les trois répliques avec leur
 * pourquoi, « Comment choisir » et « L'erreur que tout le monde fait ». Le geste suit (page de la fiche).
 */
export function CorpsSituation({ premierePhrase, scene, repliques, quandMonter, erreur }: CorpsSituationProps) {
  return (
    <>
      <section aria-labelledby="f-scene" className="space-y-2">
        <h2 id="f-scene" className={ETIQUETTE}>
          {T.scene}
        </h2>
        <p className="text-base text-text-primary">{scene.texte}</p>
        {scene.onTeDit && <p className="text-base font-semibold text-text-primary">{entreGuillemets(scene.onTeDit)}</p>}
        {scene.suite && <p className="text-base text-text-primary">{scene.suite}</p>}
      </section>
      <ReponseDabord premierePhrase={premierePhrase}>
        <div className="space-y-4" data-testid="fiche-suite">
          {REGISTRES.map((g) => (
            <section key={g} aria-labelledby={`f-${g}`} className="space-y-1">
              <h3 id={`f-${g}`} className="text-base font-semibold text-text-primary">
                {C.registres[g]}
              </h3>
              <p className="text-base text-text-primary">« {repliques[g].texte} »</p>
              <p className="text-sm text-text-secondary">{repliques[g].pourquoi}</p>
            </section>
          ))}
          {quandMonter && (
            <section aria-labelledby="f-choisir" className="space-y-1">
              <h3 id="f-choisir" className="text-base font-semibold text-text-primary">
                {T.commentChoisir}
              </h3>
              <p className="text-sm text-text-primary">{quandMonter.regle}</p>
              {quandMonter.surCetteScene && <p className="text-sm text-text-primary">{quandMonter.surCetteScene}</p>}
            </section>
          )}
          {erreur && (
            <section aria-labelledby="f-erreur" className="space-y-1">
              <h3 id="f-erreur" className="text-base font-semibold text-text-primary">
                {T.erreur}
              </h3>
              <p className="text-sm text-text-primary">{erreur}</p>
            </section>
          )}
        </div>
      </ReponseDabord>
    </>
  );
}
