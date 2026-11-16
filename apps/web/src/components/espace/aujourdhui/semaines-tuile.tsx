import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond, frPonctuation } from "@/lib/fr-typo";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META } from "@/components/espace/typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/**
 * « Tes 4 premières semaines » sur « Aujourd'hui » du nouvel abonné (refonte s25, spec UX §4.4 et design §5.2), à la
 * place de la mission (pas encore ouverte) : la feuille de route, libellés de `TEXTES_PARCOURS_ESPACE.semaines`
 * (lignes 13 et 14 des libellés E5) mot pour mot. Semaine 4 : sans « Écouter, repérer » tant qu'aucune fiche n'est
 * publiée (D11b).
 * v7 tour 2 (faute 5) : « Semaine n : » est VISIBLE en tête de chaque ligne (il était masqué à l'œil, la ligne
 * commençait en minuscule et se lisait comme une phrase coupée) ; le grand numéro décoratif est retiré (il doublait le
 * préfixe et creusait la tuile). Échelle s25 : titre en `TITRE_CARTE`, lignes en `META`, préfixe en 600 blanc (plus
 * de violet : un seul par écran, le bouton plein). v7 tour 7 (décision de Thomas) : mêmes couleurs sur toutes les
 * lignes, « Semaine n : » en texte principal, le reste en secondaire ; la semaine 1 n'a plus de couleur à part.
 * v7 tour 8 (piste, colonne « Semaine n : » non alignée) : grille à 2 colonnes partagée par toutes les lignes (la liste
 * fixe les colonnes, chaque ligne les reprend en `subgrid`) : le libellé prend la largeur du plus long, le texte de
 * chaque semaine démarre sur une même verticale, et ses lignes repliées restent dans sa colonne.
 * v7 tour 10 (relecture design du tour 9 : à côté d'« Étape conseillée », ce titre de 20 px démarrait 28 px plus haut
 * que « Répartie », deux titres sur deux lignes différentes) : « Tes 4 premières semaines » passe en étiquette
 * (`ETIQUETTE`, toujours le `h2` de la tuile), comme « Contenu du jour » dans l'extrait au tour 8. Sans texte neuf ni
 * ligne vide : l'étiquette est sur la ligne de « Étape conseillée », la première semaine sur celle de « Répartie ».
 */
export function SemainesTuile({ ecouterPublie, fige = false }: { ecouterPublie: boolean; fige?: boolean }) {
  const lignes = ecouterPublie ? P.semaines.lignes : [...P.semaines.lignes.slice(0, 3), P.semaines.semaine4SansEcouter];
  return (
    <section aria-labelledby={fige ? undefined : "semaines-titre"} className={TUILE} data-semaines>
      <h2 id={fige ? undefined : "semaines-titre"} className={ETIQUETTE}>
        {P.semaines.titre}
      </h2>
      <ol className="mt-2 grid grid-cols-[max-content_1fr] gap-x-2 divide-y divide-border">
        {lignes.map((l, i) => (
          <li key={l.semaine} className={cn("col-span-2 grid grid-cols-subgrid py-2 first:pt-0 last:pb-0", META)} data-semaine={i + 1}>
            <span className="font-semibold text-text-primary" data-semaine-prefixe>
              {frPonctuation(l.semaine)}
            </span>{" "}
            <span>{frEspace(frPonctuation(l.texte))}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
