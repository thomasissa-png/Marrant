import { TEXTES_CARNET_LISTE as TL } from "@/config/textes/carnet-liste-s26";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { META, TEXTE } from "@/components/espace/typo";

/** Identifiant du H1 du carnet (nom accessible de la liste du visiteur). */
export const ID_TITRE_CARNET = "carnet-titre";

/**
 * En-tête du carnet, espace ouvert (s26 carnet liste et détail, `docs/ux/carnet-audit-s26.md` §3, « 5 secondes ») :
 * grand titre de l'accueil (H1, « Carnet de novembre »), l'intro du mois, la ligne d'usage (À VALIDER), puis le mois
 * ET l'année (« novembre 2026 », `formatCarnetMonth`, donnée existante) dans un `<time>`. Pas de sur-titre (décision du
 * 19/11) ; le nombre de situations vit dans la liste et la fiche (« Situation n sur N »). Sans état : rendu serveur
 * (visiteur) ou client (layout de l'abonné), même balisage.
 */
export function EnTeteCarnet({
  mois,
  libelle,
  titre,
  intro,
  children,
  className,
}: {
  mois: string;
  libelle: string;
  titre: string;
  intro: string;
  /** Sous le texte (preuve du visiteur). */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("min-w-0", className)} data-carnet-en-tete>
      <h1 id={ID_TITRE_CARNET} className="font-display text-3xl font-bold text-text-primary md:text-4xl [text-wrap:balance]">
        {frTypo(titre)}
      </h1>
      <p className={cn("mt-4 max-w-2xl", TEXTE)}>{frTypo(intro)}</p>
      <p className={cn("mt-2 max-w-2xl", TEXTE)} data-carnet-usage>
        {frTypo(TL.usage)}
      </p>
      <p className={cn("mt-2", META)}>
        <time dateTime={mois} data-carnet-mois-annee>
          {libelle}
        </time>
      </p>
      {children}
    </header>
  );
}
