import type { Fiche } from "@/lib/espace/fiches-schema";
import { TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { ETIQUETTE } from "@/components/espace/carte/styles";
import { EtatVideQuestions } from "@/components/espace/questions/etat-vide";
import { CorpsSituation } from "@/components/espace/fiche/corps-situation";
import { CorpsConstruction, CorpsFormule, CorpsVocabulaire } from "@/components/espace/fiche/corps-technique";
import { CorpsJeu, CorpsSeance } from "@/components/espace/fiche/corps-divers";
import { TEXTES_APERCU } from "@/config/textes/espace-apercu";
import { frEspaceProfond } from "@/lib/fr-typo";
import { FavoriConseilLecture, FavoriVanneLecture } from "@/components/espace/apercu/favoris-lecture";
import type { ExemplesFavoris } from "@/components/espace/apercu/exemples-favoris";

// Typographie de l'espace (espaces insécables), à l'affichage seulement : JSON et textes validés intacts.
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);
const G = frEspaceProfond(TEXTES_GESTE);
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Corps d'une fiche avec les composants de la page de fiche (mêmes rendus, sans le geste qui écrit en base). */
function Corps({ fiche }: { fiche: Fiche }) {
  switch (fiche.type) {
    case "situation":
      return (
        <CorpsSituation
          premierePhrase={fiche.contenu.forme === "premiere-phrase"}
          scene={fiche.contenu.scene}
          repliques={fiche.contenu.repliques}
          quandMonter={fiche.contenu.quandMonterDUnCran}
          erreur={fiche.contenu.erreur}
        />
      );
    case "construction":
      return <CorpsConstruction c={fiche.contenu} />;
    case "formule":
      return <CorpsFormule c={fiche.contenu} />;
    case "vocabulaire":
      return <CorpsVocabulaire c={fiche.contenu} />;
    case "jeu":
      // v6 tour 1 (arbitrage 2) : dans l'aperçu, « Ce qu'on aurait pu dire » (la valeur du jeu) est ouvert.
      return <CorpsJeu c={fiche.contenu} id={fiche.id} ouvert />;
    case "seance":
      return <CorpsSeance c={fiche.contenu} />;
    default:
      return null;
  }
}

function TeteFiche({ fiche }: { fiche: Fiche }) {
  return (
    <div className="space-y-1">
      <h2 id="apercu-exemple" className="font-display text-xl font-bold leading-7 text-text-primary">
        {fiche.titre}
      </h2>
      <p className="text-sm text-text-secondary">{L.minutes(fiche.dureeMinutes)}</p>
      {fiche.accroche && <p className="pt-2 text-base text-text-primary">{fiche.accroche}</p>}
    </div>
  );
}

/** Une fiche réelle, lisible en entier (Aujourd'hui, Quoi répondre, Bibliothèque, S'entraîner). */
export function ExempleFiche({ fiche: brute }: { fiche: Fiche }) {
  const fiche = frEspaceProfond(brute);
  return (
    <div className="space-y-4" data-apercu-fiche={fiche.id}>
      <TeteFiche fiche={fiche} />
      <Corps fiche={fiche} />
    </div>
  );
}

/**
 * Mes répliques : aucune réplique d'abonné n'est montrée ni inventée. L'exemple est l'endroit où une réplique
 * s'écrit : la consigne « À toi » d'une fiche réelle et le champ « Ma réplique à moi », en lecture seule.
 */
export function ExempleRepliques({ fiche: brute }: { fiche: Fiche }) {
  const fiche = frEspaceProfond(brute);
  return (
    <div className="space-y-4" data-apercu-fiche={fiche.id}>
      <TeteFiche fiche={fiche} />
      {fiche.geste && (
        <section aria-label={G.aToi} className="space-y-1">
          <h3 className={ETIQUETTE}>{G.aToi}</h3>
          <p className="whitespace-pre-line text-base text-text-primary">{fiche.geste.consigne}</p>
        </section>
      )}
      <section aria-labelledby="apercu-note" className="space-y-2">
        <h3 id="apercu-note" className="text-base font-semibold text-text-primary">
          {G.note.label}
        </h3>
        <p className="rounded-md border border-border-input bg-background-light px-4 py-3 text-base text-text-muted">{G.note.placeholder}</p>
      </section>
    </div>
  );
}

/**
 * Mes questions : aucune question d'abonné n'est montrée. L'exemple est l'état « Mes envois » sans envoi, déjà
 * validé (un exemple de message par type, puis le délai de réponse), rendu par son composant.
 */
export function ExempleQuestions() {
  return (
    <div className="space-y-3" data-apercu-fiche="questions-exemples">
      <h2 id="apercu-exemple" className="font-display text-xl font-bold leading-7 text-text-primary">
        {Q.envois.titre}
      </h2>
      <EtatVideQuestions />
    </div>
  );
}

/**
 * Favoris : aucun favori d'abonné n'est montré. v6 tour 1 (arbitrage 3) : la première vanne et le premier conseil
 * gratuits du catalogue, présentés comme des favoris, en lecture seule. Sans eux (base indisponible), l'état vide
 * existant de la page (onglet « Tout »). v6 tour 2 (arbitrage 1) : côte à côte dès `sm`, en `items-start` (aucune
 * carte étirée à la hauteur de sa voisine).
 */
export function ExempleFavoris({ exemples = null }: { exemples?: ExemplesFavoris | null }) {
  if (exemples) {
    return (
      <ul className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2" data-apercu-fiche="favoris-exemples">
        <FavoriVanneLecture vanne={exemples.vanne} />
        <FavoriConseilLecture conseil={exemples.conseil} />
      </ul>
    );
  }
  return (
    <div className="space-y-2" data-apercu-fiche="favoris-vide">
      <h2 id="apercu-exemple" className="font-display text-xl font-bold leading-7 text-text-primary">
        {TEXTES_APERCU.favorisVide.titre}
      </h2>
      <p className="text-base text-text-secondary">{TEXTES_APERCU.favorisVide.texte}</p>
    </div>
  );
}
