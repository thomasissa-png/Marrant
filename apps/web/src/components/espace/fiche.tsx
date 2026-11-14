import Link from "next/link";
import { TEXTES_BILAN as TEXTES_BILAN_BRUT, TEXTES_FICHE, TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import type { Fiche } from "@/lib/espace/fiches-schema";
import type { RetourGeste } from "@/lib/espace/retours";
import { CARTE, ETIQUETTE, LIEN } from "@/components/espace/carte/styles";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import { CorpsSituation } from "@/components/espace/fiche/corps-situation";
import { CorpsConstruction, CorpsFormule, CorpsVocabulaire } from "@/components/espace/fiche/corps-technique";
import { CorpsEcouter, CorpsJeu, CorpsLimite, CorpsSeance } from "@/components/espace/fiche/corps-divers";
import { BilanParcours } from "@/components/espace/fiche/bilan-parcours";
import { renvoiDeBilan } from "@/lib/espace/bilan-renvoi";
import { HREF_ENTREE_COIN } from "@/lib/espace/humour-noir";
import { LienRetour } from "@/components/espace/lien-retour";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const TEXTES_BILAN = frEspaceProfond(TEXTES_BILAN_BRUT);
const T = frEspaceProfond(TEXTES_FICHE);
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);

/** Nom d'un lien vers le catalogue : la rubrique publique existante de son adresse (aucun texte neuf). */
function nomDuLien(href: string): string {
  const r = href.split("/")[1] as keyof typeof T.rubriquesCatalogue;
  return T.rubriquesCatalogue[r] ?? href;
}

/**
 * Liste parente d'une fiche (lot D11c, lien « retour ») : la porte de sa rubrique dans la barre
 * (`rubriques.ts`), sauf jeu et séance, rangés sous « Plus » mais listés dans les étapes des parcours.
 */
function parente(type: Fiche["type"]): { href: string; label: string } {
  switch (type) {
    case "situation":
    case "a-plat":
      return { href: `${ESPACE_ACCUEIL}/quoi-repondre`, label: N.rubriques.quoiRepondre };
    case "bilan":
    case "jeu":
    case "seance":
      return { href: "/parcours", label: N.rubriques.parcours };
    default:
      return { href: `${ESPACE_ACCUEIL}/bibliotheque`, label: N.rubriques.bibliotheque };
  }
}

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
    case "a-plat":
      return (
        <CorpsSituation
          premierePhrase={false}
          scene={fiche.contenu.scene}
          repliques={fiche.contenu.repliques}
          quandMonter={fiche.contenu.quandMonterDUnCran}
          erreur={fiche.contenu.erreur}
          precision={fiche.contenu.precision}
          siCaDure={fiche.contenu.siCaDure}
        />
      );
    case "humour-noir":
      return fiche.contenu.forme === "limite" ? (
        <CorpsLimite c={fiche.contenu} />
      ) : (
        <CorpsSituation
          premierePhrase={false}
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
    case "ecouter":
      return <CorpsEcouter c={fiche.contenu} />;
    case "jeu":
      return <CorpsJeu c={fiche.contenu} id={fiche.id} />;
    case "seance":
      return <CorpsSeance c={fiche.contenu} />;
    case "bilan": {
      // Import 2 : le « à voix haute » est le geste de la fiche (« À toi ») : affiché une seule fois.
      const consigneGeste = fiche.geste?.consigne;
      const elements = fiche.contenu.elements.filter((e) => !(e.forme === "voix-haute" && e.consigne === consigneGeste));
      const slug = fiche.contenu.parcoursSlug;
      const renvois = elements.map((e) => (e.forme === "laquelle" ? renvoiDeBilan(slug, e.etape) : null));
      return <BilanParcours elements={elements} renvois={renvois} />;
    }
  }
}

/**
 * Page d'une fiche de l'espace (s24, lot D6 ; anatomie architecture v20 2.7) : repère du type, titre,
 * durée, accroche, « Vu dans la lettre du … » pour une reprise (2.8), le corps propre au type, puis le
 * geste (« À toi », « Ton retour » qui pose « Fait », « Ma réplique à moi », lot D5) et les deux liens
 * vers le catalogue public. Le bilan (3.10) garde le titre « Bilan » de la maquette `mission.html`.
 */
export function FicheVue({
  fiche,
  retour,
  replique,
  lettre,
}: {
  fiche: Fiche;
  retour: RetourGeste | null;
  replique: string | null;
  lettre: { titre: string; href: string } | null;
}) {
  const bilan = fiche.type === "bilan";
  return (
    <article className="flex flex-col gap-6" data-fiche-type={fiche.type}>
      <div className="space-y-2">
        <LienRetour href={parente(fiche.type).href}>{parente(fiche.type).label}</LienRetour>
        {/* Étiquette de type gardée quand elle dit autre chose que la liste parente (« Formules à détourner »). */}
        {!bilan && T.types[fiche.type] !== parente(fiche.type).label && <p className={ETIQUETTE}>{T.types[fiche.type]}</p>}
        <h1 id="fiche-titre" className="font-display text-3xl font-bold text-text-primary [overflow-wrap:anywhere] md:text-4xl max-e300:text-2xl">
          {bilan ? TEXTES_BILAN.h1 : fiche.titre}
        </h1>
        <p className="text-sm text-text-secondary">{L.minutes(fiche.dureeMinutes)}</p>
        {fiche.accroche && <p className="text-base text-text-primary">{fiche.accroche}</p>}
        {lettre && (
          <Link href={lettre.href} className={LIEN}>
            {lettre.titre}
          </Link>
        )}
      </div>
      {bilan ? (
        <Corps fiche={fiche} />
      ) : (
        <div className={CARTE}>
          <Corps fiche={fiche} />
        </div>
      )}
      {fiche.geste && (
        <div className={CARTE}>
          <GesteFiche
            ficheId={fiche.id}
            consigne={fiche.geste.consigne}
            pourAllerPlusLoin={fiche.geste.pourAllerPlusLoin ?? null}
            grille={fiche.geste.grille ?? null}
            retourInitial={retour}
            repliqueInitiale={replique}
          />
        </div>
      )}
      {fiche.type === "a-plat" && fiche.contenu.lienCoin && (
        // Import 2 (C6a fiche 10 ; architecture 3.12, E6 §6) : lien au texte neutre, vers l'écran d'entrée du coin.
        <p>
          <Link href={HREF_ENTREE_COIN} className={LIEN}>
            {fiche.contenu.lienCoin}
          </Link>
        </p>
      )}
      {fiche.liens && fiche.liens.length > 0 && (
        // Reste du D6 (arbitrage @ux D6 n°4) : liste étiquetée par le titre de la fiche ; jamais deux liens
        // au même nom (une rubrique par lien, contrôlé par le schéma `liens`).
        <ul aria-labelledby="fiche-titre" className="flex flex-wrap gap-x-4" data-testid="fiche-liens">
          {fiche.liens.map((h) => (
            <li key={h}>
              <Link href={h} className={LIEN}>
                {nomDuLien(h)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
