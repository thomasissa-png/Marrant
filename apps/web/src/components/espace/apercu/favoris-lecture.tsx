import { Badge } from "@/components/ui/badge";
import { CADRE_CARTE } from "@/components/espace/carte/styles";
import { DIFFICULTY_LABELS, DIFFICULTY_VARIANT, JOKE_CATEGORY_LABELS, TIP_CATEGORY_LABELS } from "@/components/favoris/libelles";
import type { PublicJoke, PublicTip } from "@/lib/catalogue-pages";
import { frTypo } from "@/lib/fr-typo";
import { contenuAffiche } from "@/lib/tip-prose";

/**
 * v6 tour 1 (arbitrage 3) : une vanne et un conseil réels présentés comme des favoris, EN LECTURE SEULE, pour
 * l'aperçu de Favoris (visiteur, inscrit gratuit). Mêmes pastilles, mêmes libellés et même ordre que les cartes de
 * `favoris-list.tsx` (vanne avec sa chute, conseil avec son exemple), sans « Retirer », ni partage, ni réaction, ni
 * « Clique pour la chute » : rien ne s'enregistre depuis un aperçu. Aucun texte nouveau. Rendu serveur.
 */
const CARTE_FAVORI = `${CADRE_CARTE} min-w-0 p-4 [overflow-wrap:anywhere] md:p-6`;

export function FavoriVanneLecture({ vanne }: { vanne: PublicJoke }) {
  return (
    <li className={CARTE_FAVORI} data-favori-lecture="vanne">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="primary">Vanne</Badge>
        <Badge variant="default">{JOKE_CATEGORY_LABELS[vanne.category] ?? vanne.category}</Badge>
      </div>
      <p className="text-text-primary">{frTypo(vanne.content)}</p>
      <p className="mt-3 font-semibold text-accent-link">{vanne.punchline}</p>
    </li>
  );
}

export function FavoriConseilLecture({ conseil }: { conseil: PublicTip }) {
  return (
    <li className={CARTE_FAVORI} data-favori-lecture="conseil">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Conseil</Badge>
        <Badge variant={DIFFICULTY_VARIANT[conseil.difficulty] ?? "default"}>{DIFFICULTY_LABELS[conseil.difficulty] ?? conseil.difficulty}</Badge>
        <Badge variant="default">{TIP_CATEGORY_LABELS[conseil.category] ?? conseil.category}</Badge>
      </div>
      <h2 className="font-display text-lg font-bold text-text-primary">{frTypo(conseil.title)}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-primary">{contenuAffiche(conseil.content)}</p>
      {conseil.example && (
        <div className="mt-4 rounded-lg bg-background-elevated p-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exemple</p>
          <p className="text-sm leading-relaxed text-text-secondary">{contenuAffiche(conseil.example)}</p>
        </div>
      )}
    </li>
  );
}
