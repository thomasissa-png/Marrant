import Link from "next/link";
import { TEXTES_BILAN as TEXTES_BILAN_BRUT, TEXTES_FICHE, TEXTES_FICHE_LIGNE, TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import type { Fiche } from "@/lib/espace/fiches-schema";
import type { RetourGeste } from "@/lib/espace/retours";
import { CARTE, CARTE_PRINCIPALE, ETIQUETTE, LIEN } from "@/components/espace/carte/styles";
import { Badge } from "@/components/ui/badge";
import { BANDEAU_ACCUEIL, BLOC_EXERCICE, CARTE_ACCUEIL, EMOJI_CONTENU, LIEN_CARTE_ACCUEIL, RANGEE_PASTILLES } from "@/components/home/da-site";
import { ETIQUETTE as ETIQUETTE_ECHELLE, META, TEXTE, TITRE_PAGE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import { CorpsSituation } from "@/components/espace/fiche/corps-situation";
import { CorpsConstruction, CorpsFormule, CorpsVocabulaire } from "@/components/espace/fiche/corps-technique";
import { CorpsEcouter, CorpsJeu, CorpsLimite, CorpsSeance } from "@/components/espace/fiche/corps-divers";
import { BilanParcours } from "@/components/espace/fiche/bilan-parcours";
import { renvoiDeBilan } from "@/lib/espace/bilan-renvoi";
import { HREF_ENTREE_COIN } from "@/lib/espace/humour-noir";
import { LienRetour } from "@/components/espace/lien-retour";
import { parentEspace } from "@/components/espace/rubriques";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { frEspaceProfond } from "@/lib/fr-typo";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

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
 * Parent d'une fiche (« Retour : … », v5 §4.3) : la rubrique de l'index de son type, ou le parcours
 * d'origine pour un bilan (déduit de l'identifiant). Table unique dans `rubriques.ts`.
 */
function parente(fiche: Fiche): { href: string; label: string } {
  return parentEspace(`${ESPACE_ACCUEIL}/fiche/${fiche.type}/${fiche.id}`) ?? { href: ESPACE_ACCUEIL, label: N.monEspace };
}

function Corps({ fiche, geste = null, da = false }: { fiche: Fiche; geste?: React.ReactNode; da?: boolean }) {
  switch (fiche.type) {
    case "situation":
      return (
        <CorpsSituation
          premierePhrase={fiche.contenu.forme === "premiere-phrase"}
          scene={fiche.contenu.scene}
          repliques={fiche.contenu.repliques}
          quandMonter={fiche.contenu.quandMonterDUnCran}
          erreur={fiche.contenu.erreur}
          da={da}
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
          da={da}
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
      return <CorpsConstruction c={fiche.contenu} da={da} />;
    case "formule":
      return <CorpsFormule c={fiche.contenu} da={da} />;
    case "vocabulaire":
      return <CorpsVocabulaire c={fiche.contenu} da={da} />;
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
      return <BilanParcours elements={elements} renvois={renvois} apres={geste} />;
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
  const parent = parente(fiche);
  const geste = fiche.geste && (
    <div className={CARTE}>
      <GesteFiche
        ficheId={fiche.id}
        consigne={fiche.geste.consigne}
        pourAllerPlusLoin={fiche.geste.pourAllerPlusLoin ?? null}
        grille={fiche.geste.grille ?? null}
        retourInitial={retour}
        repliqueInitiale={replique}
        separe={false}
      />
    </div>
  );
  return (
    <article className="flex flex-col gap-6" data-fiche-type={fiche.type}>
      {/* Relecture des captures nav s24 (design 6, 7) : le titre suit le retour sans écart, à la même hauteur que
          sur les pages B et C de l'espace. */}
      <div>
        <LienRetour href={parent.href} label={parent.label} />
      <div className="space-y-2">
        <h1 id="fiche-titre" className="font-display text-3xl font-bold text-text-primary [overflow-wrap:anywhere] md:text-4xl max-e300:text-2xl">
          {bilan ? TEXTES_BILAN.h1 : fiche.titre}
        </h1>
        {/* Étiquette de type gardée quand elle dit autre chose que la liste parente (« Formules à détourner ») ;
            sous le titre (relecture des captures nav s24, design 7 : H1 à la même hauteur sur toutes les fiches). */}
        {/* Tour 2 (reviewer P2) : l'étiquette et la durée sur une seule ligne sous le titre (« Jeux · 5 min »). */}
        <p className="text-sm text-text-secondary">
          {!bilan && T.types[fiche.type] !== parent.label && (
            <>
              <span className={ETIQUETTE}>{T.types[fiche.type]}</span>
              {" · "}
            </>
          )}
          {L.minutes(fiche.dureeMinutes)}
        </p>
        {fiche.accroche && <p className="text-base text-text-primary">{fiche.accroche}</p>}
        {lettre && (
          <Link href={lettre.href} className={LIEN}>
            {lettre.titre}
          </Link>
        )}
      </div>
      </div>
      {/* Décision de Thomas du 16/11 : dans un bilan, le geste (« À toi ») suit la réponse au « dans l'ordre »
          (`BilanParcours`, prop `apres`) ; ailleurs, sous le corps comme avant. */}
      {bilan ? (
        <Corps fiche={fiche} geste={geste} />
      ) : (
        // s26 finition avant lancement (point 4) : le corps de la fiche ouverte est la carte principale (filet violet).
        <div className={CARTE_PRINCIPALE}>
          <Corps fiche={fiche} />
        </div>
      )}
      {!bilan && geste}
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

/**
 * s26 liste et détail, tour 1 (mesures §4 et §5) : les blocs partagés de la fiche (`CorpsSituation`, `GesteFiche`,
 * `NoteReplique`, `BoutonsReponse` : rafale, autres fiches, aperçu) gardent leur code ; posé sur le panneau, ce jeu les
 * ramène à l'échelle de `typo.ts` : 12 -> 14 px, capitales et interlettrage retirés (« La scène », « À toi », « Fait »,
 * compteur de caractères), gris atténué -> gris secondaire. Une zone d'état vide (`role="status"` sans texte) sort du
 * flux : elle ajoutait 8 px sous le dernier élément des cartes A et B (32 px de fin de carte au lieu de 24).
 */
// s26 DA du site (décision de Thomas du 20/11) : les libellés violets des blocs de l'accueil (`data-libelle-da`) gardent
// leur lettrage (12 px, capitales), comme « Exemple concret » ; l'échelle ne s'applique qu'au reste.
const ECHELLE_PANNEAU =
  "[&_.text-xs:not([data-libelle-da])]:text-sm [&_.uppercase:not([data-libelle-da])]:normal-case [&_.tracking-wide]:tracking-normal [&_.text-text-muted]:text-text-secondary [&_[role=status]:empty]:absolute";

const Q = frEspaceProfond(TEXTES_QUOI_REPONDRE);

/** s26 bibliothèque liste et détail : plus aucune capitale dans la fiche (libellés violets des blocs de l'accueil compris). */
const SANS_CAPITALES = "[&_.uppercase]:normal-case [&_.tracking-wider]:tracking-normal [&_.tracking-wide]:tracking-normal [&_[data-libelle-da]]:text-sm";

/** Pastille neutre du lieu d'une fiche de Quoi répondre (libellés des filtres ; sans lieu : « Rattraper un faux pas », comme la liste). */
function lieuDeFiche(fiche: Fiche): string | null {
  if (fiche.type !== "situation" && fiche.type !== "a-plat") return null;
  return fiche.univers ? Q.univers[fiche.univers] : Q.pourQuoiFaire["rattraper-faux-pas"];
}

/**
 * s26 liste et détail, fiche dans le panneau de Quoi répondre (`docs/design/liste-detail-quoi-repondre-s26.md` §3) :
 * carte A (H1 `TITRE_PAGE`, type et durée, accroche, corps sous un filet), carte B (le geste), liens du catalogue sans
 * carte, puis `apres` (« Situation suivante »). Colonne `gap-6`, cartes neutres en `p-6`, aucun `max-w` (le panneau
 * entier, aucun blanc à droite). Pas de « Retour » ici : la page le pose sous 1024 (dès 1024, la liste est à gauche).
 * H1 focalisable (`tabIndex={-1}`) : le focus lui est rendu à l'ouverture depuis la liste. `FicheVue` (autres
 * rubriques) inchangée.
 */
export function FicheVuePanneau({
  fiche,
  retour,
  replique,
  lettre,
  apres = null,
  emoji = EMOJIS_RUBRIQUES.quoiRepondre,
  rubrique = Q.titre,
  pastille,
  sansCapitales = false,
}: {
  fiche: Fiche;
  retour: RetourGeste | null;
  replique: string | null;
  lettre: { titre: string; href: string } | null;
  apres?: React.ReactNode;
  /** s26 bibliothèque liste et détail : émoji de l'accueil de la rubrique (💡 pour les techniques). */
  emoji?: string;
  /** Pastille violette : la rubrique (« Quoi répondre » par défaut, « Bibliothèque »). */
  rubrique?: string;
  /** Pastille neutre : par défaut le lieu d'une fiche de Quoi répondre ; la famille d'une technique. */
  pastille?: string | null;
  /** Bibliothèque : aucun libellé en capitales, libellés violets des blocs compris. */
  sansCapitales?: boolean;
}) {
  const parent = parente(fiche);
  const lieu = pastille === undefined ? lieuDeFiche(fiche) : pastille;
  return (
    <article className={cn("flex min-w-0 flex-col gap-6", sansCapitales && SANS_CAPITALES)} data-fiche-type={fiche.type} data-fiche-panneau={fiche.id}>
      {/* s26 DA du site (décision de Thomas du 20/11) : une carte de la famille « Ton contenu du jour » de l'accueil
          (bandeau violet, émoji, pastille violette de la rubrique et pastille neutre du lieu), « La scène » dans le bloc
          « Exemple concret » et « À toi » dans le bloc « Exercice du jour ». Structure, ordre et comportement inchangés. */}
      <div className={cn(CARTE_ACCUEIL, "min-w-0")} data-carte-da="">
        <div className={BANDEAU_ACCUEIL} />
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <div className={RANGEE_PASTILLES}>
              {/* Émoji de la répartie à l'accueil (« Je reste muet quand on me chambre »), décoratif. */}
              <span className={EMOJI_CONTENU} aria-hidden="true">
                {emoji}
              </span>
              <Badge variant="primary">{rubrique}</Badge>
              {lieu && <Badge variant="default">{lieu}</Badge>}
            </div>
            <h1 id="fiche-titre" tabIndex={-1} className={cn(TITRE_PAGE, "mt-4 [overflow-wrap:anywhere] focus:outline-none")}>
              {fiche.titre}
            </h1>
            <p className={cn("mt-2", META)}>
              {T.types[fiche.type] !== parent.label && T.types[fiche.type] !== lieu && (
                <>
                  <span className={ETIQUETTE_ECHELLE}>{T.types[fiche.type]}</span>
                  {" · "}
                </>
              )}
              {L.minutes(fiche.dureeMinutes)}
            </p>
            {fiche.accroche && <p className={cn("mt-4", TEXTE)}>{fiche.accroche}</p>}
            {lettre && (
              <Link href={lettre.href} className={cn("mt-2", LIEN)}>
                {lettre.titre}
              </Link>
            )}
          </div>
          {/* Tour 1 : blocs du corps à 24 px (spec design §3.1 ; « Ta réponse d'abord » était collé à la citation). */}
          <div className={cn("space-y-6", ECHELLE_PANNEAU)}>
            <Corps fiche={fiche} da />
          </div>
          {fiche.geste && (
            <div className={cn(BLOC_EXERCICE, "p-4", ECHELLE_PANNEAU)}>
              <GesteFiche
                ficheId={fiche.id}
                consigne={fiche.geste.consigne}
                pourAllerPlusLoin={fiche.geste.pourAllerPlusLoin ?? null}
                grille={fiche.geste.grille ?? null}
                retourInitial={retour}
                repliqueInitiale={replique}
                separe={false}
                da
              />
            </div>
          )}
        </div>
      </div>
      {fiche.type === "a-plat" && fiche.contenu.lienCoin && (
        <p>
          <Link href={HREF_ENTREE_COIN} className={LIEN}>
            {fiche.contenu.lienCoin}
          </Link>
        </p>
      )}
      {fiche.liens && fiche.liens.length > 0 && (
        <ul aria-labelledby="fiche-titre" className="flex flex-wrap gap-x-6" data-testid="fiche-liens">
          {fiche.liens.map((h) => (
            <li key={h}>
              <Link href={h} className={cn(LIEN_CARTE_ACCUEIL, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary")}>
                {nomDuLien(h)}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {apres}
    </article>
  );
}
