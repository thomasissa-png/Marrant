import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { CARTE } from "@/components/espace/carte/styles";

const TAG = "inline-block rounded-full border border-border-input px-2 py-0.5 text-xs font-semibold text-text-secondary";
const CITATION = "border-l-2 border-accent-primary px-4 py-2 text-base text-text-primary max-e300:px-3";

/**
 * Aucun envoi (architecture 2.6 : jamais un tableau vide) : un exemple de message par type, puis la phrase
 * sur le délai (maquette `mes-questions.html#etat=vide`). Exemples : libellés 23 et 24.
 */
export function EtatVideQuestions() {
  return (
    <div className={`${CARTE} !space-y-2`} data-etat="vide">
      <p className="text-sm text-text-secondary">{Q.envois.exempleIntro}</p>
      <p className={CITATION}>{Q.types.QUESTION.exemple}</p>
      <div>
        <span className={TAG}>{Q.types.PROBLEME.nom}</span>
      </div>
      <p className={CITATION}>{Q.types.PROBLEME.exemple}</p>
      <div>
        <span className={TAG}>{Q.types.SITUATION.nom}</span>
      </div>
      <p className={CITATION}>{Q.types.SITUATION.exemple}</p>
      <p className="text-sm text-text-secondary">{Q.ecrire.delai}</p>
    </div>
  );
}
