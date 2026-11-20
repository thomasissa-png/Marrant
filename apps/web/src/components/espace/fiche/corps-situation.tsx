"use client";

import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { TEXTES_FICHE } from "@/config/textes/espace-bibliotheque";
import { ETIQUETTE } from "@/components/espace/carte/styles";
import { BLOC_EXEMPLE, LIBELLE_BLOC } from "@/components/home/da-site";
import { entreGuillemets } from "@/components/espace/carte/citation";
import { ReponseDabord } from "@/components/espace/fiche/reponse-dabord";
import { FINE, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const C = frEspaceProfond(TEXTES_CARTES);
const T = frEspaceProfond(TEXTES_FICHE);

type Replique = { texte: string; pourquoi: string; sansParole?: true };

export interface CorpsSituationProps {
  premierePhrase: boolean;
  scene: { texte: string; onTeDit?: string; suite?: string };
  repliques: { sure: Replique; joueuse: Replique; risquee: Replique };
  quandMonter?: { regle: string; surCetteScene?: string };
  erreur?: string;
  /** Import 2 (« à plat », C6a fiches 9 et 10) : rubrique entre la scène et les répliques. */
  precision?: { titre: string; texte: string };
  /** Import 2 (C6a fiche 9) : « Si le blanc dure », après les trois répliques. */
  siCaDure?: { titre: string; texte: string; pourquoi: string };
  /**
   * v6 tour 3 (arbitrage 6) : aperçu Premium seulement. La suite est rendue d'emblée et la porte (« Ta réponse
   * d'abord », « Avant de lire la suite », « Tu avais une réponse ? » et ses trois boutons) ne l'est pas : rien
   * d'actif qui ne fait rien. Absent (fiche de l'abonné) : le rendu d'avant, inchangé.
   */
  suiteOuverte?: boolean;
  /**
   * s26 DA du site (décision de Thomas du 20/11) : fiche de Quoi répondre seulement, « La scène » (et la précision d'une
   * fiche « à plat ») dans le bloc « Exemple concret » de l'accueil, libellé violet. Absent : le rendu d'avant.
   */
  da?: boolean;
}

// Import 2 : retours à la ligne des textes à plusieurs paragraphes conservés (`\n` du lot).
const PL = "whitespace-pre-line";
/** Une réplique écrite comme un geste (« Le silence. ») s'affiche sans guillemets. */
const phrase = (r: Replique) => (r.sansParole ? r.texte : `«${FINE}${r.texte}${FINE}»`);

const REGISTRES = ["sure", "joueuse", "risquee"] as const;

/** La porte « Ta réponse d'abord » autour de la suite ; ouverte (aperçu seulement), la suite seule. */
function Porte({ ouverte, premierePhrase, children }: { ouverte: boolean; premierePhrase: boolean; children: React.ReactNode }) {
  return ouverte ? <>{children}</> : <ReponseDabord premierePhrase={premierePhrase}>{children}</ReponseDabord>;
}

/**
 * Corps d'une situation (« Quoi répondre », « Quand ça tombe à plat », situation du coin), étalon E1.1 :
 * la scène, « Ta réponse d'abord », puis, après « Tu avais une réponse ? », les trois répliques avec leur
 * pourquoi, « Comment choisir » et « L'erreur que tout le monde fait ». Le geste suit (page de la fiche).
 */
export function CorpsSituation({ premierePhrase, scene, repliques, quandMonter, erreur, precision, siCaDure, suiteOuverte = false, da = false }: CorpsSituationProps) {
  return (
    <>
      <section aria-labelledby="f-scene" className={da ? `${BLOC_EXEMPLE} space-y-2 p-4` : "space-y-2"}>
        <h2 id="f-scene" className={da ? LIBELLE_BLOC : ETIQUETTE} data-libelle-da={da ? "" : undefined}>
          {T.scene}
        </h2>
        <p className={`${PL} text-base text-text-primary`}>{scene.texte}</p>
        {scene.onTeDit && <p className="text-base font-semibold text-text-primary">{entreGuillemets(scene.onTeDit)}</p>}
        {scene.suite && <p className={`${PL} text-base text-text-primary`}>{scene.suite}</p>}
      </section>
      {precision && (
        <section aria-labelledby="f-precision" className={da ? `${BLOC_EXEMPLE} space-y-2 p-4` : "space-y-2"}>
          <h2 id="f-precision" className={da ? LIBELLE_BLOC : ETIQUETTE} data-libelle-da={da ? "" : undefined}>
            {precision.titre}
          </h2>
          <p className={`${PL} text-base text-text-primary`}>{precision.texte}</p>
        </section>
      )}
      <Porte ouverte={suiteOuverte} premierePhrase={premierePhrase}>
        <div className="space-y-4" data-testid="fiche-suite">
          {REGISTRES.map((g) => (
            <section key={g} aria-labelledby={`f-${g}`} className="space-y-1">
              <h3 id={`f-${g}`} className="text-base font-semibold text-text-primary">
                {C.registres[g]}
              </h3>
              <p className="text-base text-text-primary">{phrase(repliques[g])}</p>
              <p className={`${PL} text-sm text-text-secondary`}>{repliques[g].pourquoi}</p>
            </section>
          ))}
          {siCaDure && (
            <section aria-labelledby="f-si-ca-dure" className="space-y-1">
              <h3 id="f-si-ca-dure" className="text-base font-semibold text-text-primary">
                {siCaDure.titre}
              </h3>
              <p className="text-base text-text-primary">«{FINE}{siCaDure.texte}{FINE}»</p>
              <p className={`${PL} text-sm text-text-secondary`}>{siCaDure.pourquoi}</p>
            </section>
          )}
          {quandMonter && (
            <section aria-labelledby="f-choisir" className="space-y-1">
              <h3 id="f-choisir" className="text-base font-semibold text-text-primary">
                {T.commentChoisir}
              </h3>
              <p className={`${PL} text-sm text-text-primary`}>{quandMonter.regle}</p>
              {quandMonter.surCetteScene && <p className={`${PL} text-sm text-text-primary`}>{quandMonter.surCetteScene}</p>}
            </section>
          )}
          {erreur && (
            <section aria-labelledby="f-erreur" className="space-y-1">
              <h3 id="f-erreur" className="text-base font-semibold text-text-primary">
                {T.erreur}
              </h3>
              <p className={`${PL} text-sm text-text-primary`}>{erreur}</p>
            </section>
          )}
        </div>
      </Porte>
    </>
  );
}
