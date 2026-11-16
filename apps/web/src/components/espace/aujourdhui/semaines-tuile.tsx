import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond, frPonctuation } from "@/lib/fr-typo";
import { TUILE } from "@/components/espace/aujourdhui/tableau";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/**
 * « Tes 4 premières semaines » sur « Aujourd'hui » du nouvel abonné (refonte s25, spec UX §4.4 et design §5.2), à la
 * place de la mission (pas encore ouverte) : la feuille de route, libellés de `TEXTES_PARCOURS_ESPACE.semaines`
 * (lignes 13 et 14 des libellés E5) mot pour mot. Semaine 4 : sans « Écouter, repérer » tant qu'aucune fiche n'est
 * publiée (D11b).
 * v7 tour 2 (faute 5) : « Semaine n : » est VISIBLE en tête de chaque ligne (il était masqué à l'œil, la ligne
 * commençait en minuscule et se lisait comme une phrase coupée). Le préfixe porte le rang : en violet (`accent-link`,
 * AA) pour la semaine 1, le seul repère violet de la feuille de route ; le grand numéro décoratif est retiré (il
 * doublait le préfixe et creusait la tuile).
 */
export function SemainesTuile({ ecouterPublie, fige = false }: { ecouterPublie: boolean; fige?: boolean }) {
  const lignes = ecouterPublie ? P.semaines.lignes : [...P.semaines.lignes.slice(0, 3), P.semaines.semaine4SansEcouter];
  return (
    <section aria-labelledby={fige ? undefined : "semaines-titre"} className={TUILE} data-semaines>
      <h2 id={fige ? undefined : "semaines-titre"} className="font-display text-lg font-bold text-text-primary">
        {P.semaines.titre}
      </h2>
      <ol className="mt-1 divide-y divide-border">
        {lignes.map((l, i) => (
          <li key={l.semaine} className={cn("py-2 text-sm last:pb-0", i === 0 ? "text-text-primary" : "text-text-secondary")} data-semaine={i + 1}>
            <span className={cn("font-semibold", i === 0 ? "text-accent-link" : "text-text-primary")} data-semaine-prefixe>
              {frPonctuation(l.semaine)}
            </span>{" "}
            {frEspace(frPonctuation(l.texte))}
          </li>
        ))}
      </ol>
    </section>
  );
}
