import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond, frPonctuation } from "@/lib/fr-typo";
import { TUILE } from "@/components/espace/aujourdhui/tableau";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/**
 * « Tes 4 premières semaines » sur « Aujourd'hui » du nouvel abonné (refonte s25, spec UX §4.4 et design §5.2), à la
 * place de la mission (pas encore ouverte) : la feuille de route, libellés de `TEXTES_PARCOURS_ESPACE.semaines`
 * (lignes 13 et 14 des libellés E5) mot pour mot. Chaque ligne : le numéro en grand (violet pour la semaine 1, le
 * seul chiffre violet de la page), puis le libellé ; « Semaine n : » reste lu (liste ordonnée, texte masqué à l'œil
 * seulement, le numéro le porte). Semaine 4 : sans « Écouter, repérer » tant qu'aucune fiche n'est publiée (D11b).
 */
export function SemainesTuile({ ecouterPublie, fige = false }: { ecouterPublie: boolean; fige?: boolean }) {
  const lignes = ecouterPublie ? P.semaines.lignes : [...P.semaines.lignes.slice(0, 3), P.semaines.semaine4SansEcouter];
  return (
    <section aria-labelledby={fige ? undefined : "semaines-titre"} className={TUILE} data-semaines>
      <h2 id={fige ? undefined : "semaines-titre"} className="font-display text-lg font-bold text-text-primary">
        {P.semaines.titre}
      </h2>
      <ol className="mt-2 divide-y divide-border">
        {lignes.map((l, i) => (
          <li key={l.semaine} className="flex items-baseline gap-4 py-3">
            <span aria-hidden="true" className={cn("w-8 flex-none font-display text-2xl font-bold tabular-nums", i === 0 ? "text-accent-primary" : "text-text-muted")}>
              {i + 1}
            </span>
            <span className={cn("min-w-0 text-sm", i === 0 ? "text-text-primary" : "text-text-secondary")}>
              <span className="sr-only">{frPonctuation(l.semaine)} </span>
              {frEspace(frPonctuation(l.texte))}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
