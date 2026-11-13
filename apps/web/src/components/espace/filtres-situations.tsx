import Link from "next/link";
import { TEXTES_QUOI_REPONDRE as T } from "@/config/textes/espace-bibliotheque";
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";
import { hrefFiltre, type FiltresSituations } from "@/lib/espace/quoi-repondre";
import { puce } from "@/components/espace/carte/styles";
import { Coche } from "@/components/espace/carte/coche";
import { FiltresReplies } from "@/components/espace/filtres-replies";

/**
 * Filtres de « Quoi répondre » (s24, lot D6 ; architecture v20 3.3) : « Où et avec qui ? » (12 univers
 * du schéma) et « Pour quoi faire ? » (5). Liens rendus par le serveur (aucun script nécessaire) : un
 * clic choisit, un second clic sur le même retire le filtre. Le filtre choisi est marqué par la coche ET
 * un contour de 2 px (`puce`), et `aria-current="true"` pour les lecteurs d'écran ; cibles de 44 px. Sous
 * 640 px, les deux groupes sont repliés dans un seul `details` (`filtres-replies.tsx`) ; sous 300 px,
 * puces pleine largeur.
 */
function Groupe<V extends string>({
  id,
  titre,
  valeurs,
  libelles,
  choisi,
  href,
}: {
  id: string;
  titre: string;
  valeurs: readonly V[];
  libelles: Record<V, string>;
  choisi: V | null;
  href: (v: V) => string;
}) {
  return (
    <div className="space-y-2">
      <h2 id={id} className="text-base font-semibold text-text-primary">
        {titre}
      </h2>
      <ul aria-labelledby={id} className="flex flex-wrap gap-2">
        {valeurs.map((v) => (
          <li key={v} className="max-e300:w-full">
            <Link
              href={href(v)}
              scroll={false}
              aria-current={choisi === v ? "true" : undefined}
              className={`${puce(choisi === v)} max-e300:w-full`}
              data-filtre={v}
            >
              {choisi === v && <Coche />}
              {libelles[v]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Texte du `summary` (reste du D6) : les valeurs choisies (« Soirée, Désamorcer ») ; sans filtre, les deux
 * titres de groupe déjà en ligne [À SOUMETTRE À THOMAS : @ux demande un libellé de 20 caractères au plus].
 */
export function resumeFiltres(filtres: FiltresSituations): string {
  const choisis = [filtres.ou ? T.univers[filtres.ou] : null, filtres.pour ? T.pourQuoiFaire[filtres.pour] : null].filter(Boolean);
  return choisis.length ? choisis.join(", ") : `${T.filtreOu} ${T.filtrePour}`;
}

export function FiltresSituations({ base, filtres }: { base: string; filtres: FiltresSituations }) {
  return (
    <FiltresReplies resume={resumeFiltres(filtres)}>
      <Groupe id="filtre-ou" titre={T.filtreOu} valeurs={UNIVERS} libelles={T.univers} choisi={filtres.ou} href={(v) => hrefFiltre(base, filtres, "ou", v)} />
      <Groupe
        id="filtre-pour"
        titre={T.filtrePour}
        valeurs={POUR_QUOI_FAIRE}
        libelles={T.pourQuoiFaire}
        choisi={filtres.pour}
        href={(v) => hrefFiltre(base, filtres, "pour", v)}
      />
    </FiltresReplies>
  );
}
