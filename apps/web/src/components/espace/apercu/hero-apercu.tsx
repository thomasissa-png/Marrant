import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { BadgePremium } from "@/components/espace/apercu/badge-premium";
import { OffreApercu } from "@/components/espace/apercu/offre-apercu";

/**
 * Hero de l'aperçu verrouillé, zones A et B (refonte s25, spec UX §2.1 et §3.1, design §3.5) : pas de carte autour
 * du texte (posé sur le halo), la carte d'offre est le seul objet encadré. Pastille « Premium », H1 (nom de la
 * rubrique, aligné à gauche sur la barre), phrase lue seulement (T4), promesse, pastilles « ce qu'il y a dedans »
 * (non cliquables, sans bord) ; à droite dès 1024 px (7/5), le bloc d'offre centré verticalement. CTA au premier écran.
 */
export function HeroApercu({
  titre,
  promesse,
  pastilles,
  offre,
}: {
  titre: string;
  promesse: string;
  pastilles: readonly string[];
  offre: React.ComponentProps<typeof OffreApercu>;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12" data-apercu-hero>
      <div className="min-w-0 md:max-w-2xl lg:col-span-7 lg:max-w-none">
        <BadgePremium grand />
        <h1 id="apercu-titre" className="mt-4 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
          {titre}
        </h1>
        <p className="sr-only">{TEXTES_APERCU_VERROUILLE.lecteurEcran}</p>
        <p className="mt-4 max-w-xl text-lg text-text-secondary [text-wrap:balance] md:text-xl">{promesse}</p>
        <ul className="mt-6 flex flex-wrap gap-2" data-apercu-pastilles>
          {pastilles.map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-2 rounded-full bg-background-elevated px-2.5 py-1 text-xs text-text-secondary md:px-3 md:py-1.5 md:text-sm"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent-primary" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 lg:col-span-5">
        <OffreApercu {...offre} />
      </div>
    </div>
  );
}
