import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { ETIQUETTE, META, TEXTE } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Ordre de la maquette : l'exemple de « Une question » (annoncé par la phrase d'intro), puis les deux autres types. */
const AUTRES = ["PROBLEME", "SITUATION"] as const;

/**
 * Aucun envoi (architecture 2.6 : jamais un tableau vide) : un exemple de message par type, puis la phrase
 * sur le délai (maquette `mes-questions.html#etat=vide`). Exemples : libellés 23 et 24.
 * s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §1 et §2) : contenu seul, le cadre vient de l'appelant
 * (tuile de l'aperçu, carte de l'abonné). Échelle `typo.ts` : type en `ETIQUETTE`, exemple en `TEXTE`, délai en
 * `META` ; plus de pastille en `text-xs` ni de citation à bord violet (un seul aplat violet par écran). Rendu
 * interrupteur ouvert seulement (Mes questions et Mon profil sont fermés en 404 ou sans ce bloc).
 */
export function EtatVideQuestions({ className }: { className?: string }) {
  return (
    <div className={cn("min-w-0 [overflow-wrap:anywhere]", className)} data-etat="vide">
      <p className={ETIQUETTE}>{Q.envois.exempleIntro}</p>
      <p className={cn("mt-2", TEXTE)}>{Q.types.QUESTION.exemple}</p>
      {AUTRES.map((t) => (
        <div key={t} className="mt-4" data-exemple-type={t}>
          <p className={ETIQUETTE}>{Q.types[t].nom}</p>
          <p className={cn("mt-2", TEXTE)}>{Q.types[t].exemple}</p>
        </div>
      ))}
      <p className={cn("mt-4", META)}>{Q.ecrire.delai}</p>
    </div>
  );
}
