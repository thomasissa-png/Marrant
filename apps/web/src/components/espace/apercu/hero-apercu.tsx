import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { BadgePremium } from "@/components/espace/apercu/badge-premium";
import { OffreApercu } from "@/components/espace/apercu/offre-apercu";

/**
 * Hero de l'aperçu verrouillé, zones A et B (refonte s25, spec UX §2.1 et §3.1, design §3.5) : pas de carte autour
 * du texte (posé sur le halo), la carte d'offre est le seul objet encadré. Pastille « Premium », H1 (nom de la
 * rubrique, aligné à gauche sur la barre), phrase lue seulement (T4), promesse, pastilles « ce qu'il y a dedans »
 * (non cliquables, sans bord) ; à droite dès 1024 px, le bloc d'offre. CTA au premier écran.
 * v7 tour 2 (piste) : 8/4 au lieu de 7/5 (la carte d'offre tient dans 4 colonnes), colonne de texte sans plafond à
 * 768 et pastilles un peu moins larges : les 6 pastilles tiennent sur une ligne à 768 et dès 1280, plus de
 * « Contenu du jour » seule sur sa ligne. La promesse garde son plafond de lecture (`max-w-xl`). Texte calé en haut
 * (`items-start`) : la pastille « Premium » reste à la hauteur du H1 des autres rubriques, même quand la carte d'offre,
 * plus étroite, est plus haute que le texte.
 * v7 tour 3 (piste hero) : promesse sur toute la colonne de texte (`max-w-3xl`, une ligne dès 1280 au lieu de deux
 * courtes qui laissaient environ 480 px de vide avant l'offre) ; l'offre alignée en haut, sur la pastille « Premium ».
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
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12" data-apercu-hero>
      <div className="min-w-0 lg:col-span-8">
        <BadgePremium grand />
        <h1 id="apercu-titre" className="mt-4 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
          {titre}
        </h1>
        <p className="sr-only">{TEXTES_APERCU_VERROUILLE.lecteurEcran}</p>
        <p className="mt-4 max-w-3xl text-lg text-text-secondary [text-wrap:balance] md:text-xl">{promesse}</p>
        <ul className="mt-6 flex flex-wrap gap-2" data-apercu-pastilles>
          {pastilles.map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-2 rounded-full bg-background-elevated px-2.5 py-1 text-xs text-text-secondary md:py-1.5 md:text-sm"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent-primary" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 lg:col-span-4">
        <OffreApercu {...offre} />
      </div>
    </div>
  );
}
