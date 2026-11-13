import Link from "next/link";
import { TEXTES_BILAN, TEXTES_FICHE as T, TEXTES_FICHE_LIGNE as L } from "@/config/textes/espace-bibliotheque";
import type { Fiche } from "@/lib/espace/fiches-schema";
import type { RetourGeste } from "@/lib/espace/retours";
import { CARTE, ETIQUETTE, LIEN } from "@/components/espace/carte/styles";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import { CorpsSituation } from "@/components/espace/fiche/corps-situation";
import { CorpsConstruction, CorpsFormule, CorpsVocabulaire } from "@/components/espace/fiche/corps-technique";
import { CorpsEcouter, CorpsJeu, CorpsLimite, CorpsSeance } from "@/components/espace/fiche/corps-divers";
import { BilanParcours } from "@/components/espace/fiche/bilan-parcours";

/** Nom d'un lien vers le catalogue : la rubrique publique existante de son adresse (aucun texte neuf). */
function nomDuLien(href: string): string {
  const r = href.split("/")[1] as keyof typeof T.rubriquesCatalogue;
  return T.rubriquesCatalogue[r] ?? href;
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
      return <CorpsSituation premierePhrase={false} scene={fiche.contenu.scene} repliques={fiche.contenu.repliques} quandMonter={fiche.contenu.quandMonterDUnCran} erreur={fiche.contenu.erreur} />;
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
      return <CorpsJeu c={fiche.contenu} />;
    case "seance":
      return <CorpsSeance c={fiche.contenu} />;
    case "bilan":
      return <BilanParcours elements={fiche.contenu.elements} />;
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
        {!bilan && <p className={ETIQUETTE}>{T.types[fiche.type]}</p>}
        <h1 className="font-display text-3xl font-bold text-text-primary [overflow-wrap:anywhere] md:text-4xl max-e300:text-2xl">
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
            retourInitial={retour}
            repliqueInitiale={replique}
          />
        </div>
      )}
      {fiche.liens && fiche.liens.length > 0 && (
        <ul className="flex flex-wrap gap-x-4">
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
