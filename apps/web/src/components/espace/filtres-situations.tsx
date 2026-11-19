import Link from "next/link";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";
import { hrefFiltre, type FiltresSituations } from "@/lib/espace/quoi-repondre";
import { CADRE_CARTE_NEUTRE, LIEN_NEUTRE, pastilleFiltre } from "@/components/espace/carte/styles";
import { ChevronRepli } from "@/components/espace/carte/chevron-repli";
import { ETIQUETTE, META_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);

// s26 liste et détail : la pastille vit dans `carte/styles.ts` (importée aussi par la colonne de liste, côté navigateur,
// sans le schéma des fiches) ; réexportée ici pour les appels existants.
export { pastilleFiltre };

/**
 * Filtres de « Quoi répondre » (s24, lot D6 ; architecture v20 3.3) : « Où et avec qui ? » (12 univers du schéma) et
 * « Pour quoi faire ? » (5). Liens rendus par le serveur (aucun script) : un clic choisit, un second clic sur le même
 * retire le filtre. s26 : `id` préfixé par instance (le rail et le repli coexistent dans le DOM).
 */
function Groupe<V extends string>({
  id,
  titre,
  valeurs,
  libelles,
  choisi,
  href,
  className,
}: {
  id: string;
  titre: string;
  valeurs: readonly V[];
  libelles: Record<V, string>;
  choisi: V | null;
  href: (v: V) => string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 id={id} className={ETIQUETTE}>
        {titre}
      </h2>
      <ul aria-labelledby={id} className="mt-2 flex flex-wrap gap-2">
        {valeurs.map((v) => (
          <li key={v} className="max-e300:w-full">
            <Link href={href(v)} scroll={false} aria-current={choisi === v ? "true" : undefined} className={pastilleFiltre(choisi === v)} data-filtre={v}>
              {libelles[v]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Texte du `summary` (reste du D6) : les valeurs choisies (« Soirée, Désamorcer ») ; sans filtre, « Filtrer les
 * cartes » (choix de Thomas du 13/11).
 */
export function resumeFiltres(filtres: FiltresSituations): string {
  const choisis = [filtres.ou ? T.univers[filtres.ou] : null, filtres.pour ? T.pourQuoiFaire[filtres.pour] : null].filter(Boolean);
  return choisis.length ? choisis.join(", ") : T.filtrerLesCartes;
}

function LienCarnet() {
  return (
    <Link href="/carnet" className={LIEN_NEUTRE} data-carnet>
      {T.carnet}
    </Link>
  );
}

/** Les deux groupes et le carnet en pied (même contenu dans le rail et dans le repli). */
function Contenu({ base, filtres, suffixe, carnet }: { base: string; filtres: FiltresSituations; suffixe: string; carnet: boolean }) {
  return (
    <>
      <Groupe id={`filtre-ou${suffixe}`} titre={T.filtreOu} valeurs={UNIVERS} libelles={T.univers} choisi={filtres.ou} href={(v) => hrefFiltre(base, filtres, "ou", v)} />
      <Groupe
        id={`filtre-pour${suffixe}`}
        titre={T.filtrePour}
        valeurs={POUR_QUOI_FAIRE}
        libelles={T.pourQuoiFaire}
        choisi={filtres.pour}
        href={(v) => hrefFiltre(base, filtres, "pour", v)}
        className="mt-6 border-t border-border pt-6"
      />
      {/* Le carnet du mois garde son adresse publique (aucune copie) ; lien secondaire en pied du rail (spec UX §1.2). */}
      {carnet && (
        <div className="mt-6 border-t border-border pt-6">
          <LienCarnet />
        </div>
      )}
    </>
  );
}

/**
 * s26 (spec design §1.3) : DEUX instances, une seule visible (et donc une seule dans l'arbre d'accessibilité) : sous
 * 1024 px, un `<details>` replié (sommaire de 44 px pleine largeur, valeurs choisies ou « Filtrer les cartes ») ; dès
 * 1024 px, le rail ouvert (carnet en pied), sans script. Plus de `details` forcé ouvert par `matchMedia`.
 */
export function FiltresSituations({ base, filtres }: { base: string; filtres: FiltresSituations }) {
  return (
    <>
      <div className="lg:hidden" data-filtres-replies>
        <details className={cn(CADRE_CARTE_NEUTRE, "group/repli")}>
          <summary
            className={cn(
              "flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden",
              META_FORT,
            )}
          >
            <span className="min-w-0 [overflow-wrap:anywhere]">{resumeFiltres(filtres)}</span>
            <ChevronRepli />
          </summary>
          <div className="px-6 pb-6 pt-2">
            <Contenu base={base} filtres={filtres} suffixe="" carnet={false} />
          </div>
        </details>
        {/* Sous 1024 px, le carnet reste visible hors du repli (il était en tête de page avant s26). */}
        <div className="mt-2">
          <LienCarnet />
        </div>
      </div>
      <div className={cn("hidden p-6 lg:block", CADRE_CARTE_NEUTRE)} data-filtres-rail>
        <Contenu base={base} filtres={filtres} suffixe="-rail" carnet />
      </div>
    </>
  );
}
