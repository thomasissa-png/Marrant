import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";
import { contenuAffiche } from "@/lib/tip-prose";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { Bandeau, EMOJIS_ACCUEIL, PastillesDa } from "@/components/espace/da-espace";
import { TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { Badge } from "@/components/ui/badge";
import { TYPE_FAVORI } from "@/components/favoris/libelles";

/**
 * Cartes de Favoris, gabarit unique (s26, `docs/design/favoris-carnet-s26.md` §1 et §2.3) : cadre neutre (filet violet
 * retiré, 18/11), étiquette de type, texte ou titre, une catégorie en `META`, aucune pastille colorée, aucune capitale.
 * s26 contrôle d'ensemble, aperçus (DA de l'accueil, Thomas 20/11, seul lecteur : l'aperçu de Favoris) : bandeau violet,
 * émoji, pastille violette du type et pastille neutre de la catégorie, comme le détail de l'abonné.
 * Composants de présentation, sans état ni `"use client"` : rendus tels quels par l'aperçu (serveur, lecture seule) et
 * par la vue de l'abonné (client, qui ajoute ses actions en `children`). Aucun texte neuf.
 */

/** Cadre d'une carte de favori : `CADRE_CARTE_NEUTRE p-6 flex h-full flex-col`. */
export const CARTE_FAVORI = cn(CADRE_CARTE_NEUTRE, "flex h-full min-w-0 flex-col p-6 [overflow-wrap:anywhere]");

/** Vanne : pastilles (type, catégorie), texte (`TEXTE`), puis la chute (`TEXTE_FORT`) quand elle est visible. */
export function CorpsVanne({
  texte,
  chute,
  categorie,
  chuteVisible = true,
  suite,
}: {
  texte: string;
  chute: string;
  categorie: string;
  chuteVisible?: boolean;
  /** Ce qui remplace la chute tant qu'elle est cachée (indice existant de la vue abonné). */
  suite?: React.ReactNode;
}) {
  return (
    <>
      {/* s26 contrôle d'ensemble, aperçus : DA de l'accueil (bandeau, émoji, pastille violette du type, pastille neutre de
          la catégorie), comme le détail de l'abonné. */}
      <PastillesDa className="pr-8" emoji={EMOJIS_ACCUEIL.vanne} pastille={TYPE_FAVORI.JOKE} suite={<Badge variant="default">{categorie}</Badge>} />
      <p className={cn("mt-2", TEXTE)}>{frTypo(texte)}</p>
      {chuteVisible ? <p className={cn("mt-4", TEXTE_FORT)}>{chute}</p> : suite}
      <Bandeau />
    </>
  );
}

/** Conseil : pastilles (type, catégorie), titre (`TITRE_CARTE`), contenu replié sur deux lignes sauf `deplie`. */
export function CorpsConseil({
  titre,
  contenu,
  categorie,
  deplie = false,
  Titre = "h2",
}: {
  titre: string;
  contenu: string;
  categorie: string;
  deplie?: boolean;
  Titre?: "h2" | "h3";
}) {
  return (
    <>
      <PastillesDa className="pr-8" emoji={EMOJIS_ACCUEIL.conseil} pastille={TYPE_FAVORI.TIP} suite={<Badge variant="default">{categorie}</Badge>} />
      <Titre className={cn("mt-2", TITRE_CARTE)}>{frTypo(titre)}</Titre>
      <p className={cn("mt-2", TEXTE, !deplie && "line-clamp-2")}>{contenuAffiche(contenu)}</p>
      <Bandeau variante="inverse" />
    </>
  );
}

/** Bloc déplié d'une carte (exemple, exercice, ce que tu vas apprendre) : sous-titre `TEXTE_FORT`, corps `TEXTE`. */
export function BlocDeplie({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <p className={TEXTE_FORT}>{titre}</p>
      <div className={cn("mt-2", TEXTE)}>{children}</div>
    </div>
  );
}
