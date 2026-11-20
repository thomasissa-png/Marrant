import Link from "next/link";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { buttonVariants } from "@/components/ui/button";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { TEXTE } from "@/components/espace/typo";
import { Bandeau, PastillesDa } from "@/components/espace/da-espace";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

const Q = frEspaceProfond(TEXTES_QUESTIONS);
const C = frEspaceProfond(TEXTES_CLOCHE);

/** Adresse d'un fil ouvert (lien de la cloche, lot D8). */
export const hrefFil = (id: string) => `/mon-espace/questions/${id}`;

/**
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.2, design §2) : la prochaine action de l'abonné quand
 * l'équipe a répondu et que la réponse n'est pas lue. Type en `ETIQUETTE`, première ligne de la réponse (texte de
 * l'équipe tel qu'écrit, coupé à deux lignes), et le seul aplat de l'écran vers le fil. Aucun texte neuf : le bouton
 * reprend le libellé validé du lien de la cloche (« L'équipe t'a répondu »), qui mène au même fil ; la spec citait un
 * bouton « Lire » qui n'existe dans aucune constante.
 */
export function ReponseNonLue({ fil, className }: { fil: FilListe; className?: string }) {
  const reponse = fil.messages.filter((m) => m.auteur === "EQUIPE").at(-1);
  return (
    <section aria-label={C.groupes.reponses} className={cn(CARTE_ACTION, className)} data-reponse-non-lue={fil.id}>
      {/* s26 DA, aujourd'hui questions répliques : bandeau de l'accueil, type en pastille violette. */}
      <Bandeau />
      <PastillesDa as="p" pastille={Q.types[fil.type].nom} />
      {reponse && <p className={cn("mt-2 line-clamp-2 whitespace-pre-line", TEXTE)}>{reponse.corps}</p>}
      <Link href={hrefFil(fil.id)} className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full whitespace-normal md:w-auto md:self-start")}>
        {C.groupes.reponses}
      </Link>
    </section>
  );
}
