import { Fragment } from "react";

/**
 * Titre en police d'affichage (Plus Jakarta Sans gras) : la virgule de cette police a
 * une large approche à gauche, « décryptée , » se lit avec une espace qui n'existe pas
 * (QA s21 m4, mesuré : 8,6 px de boîte pour la virgule à 24 px). Chaque virgule est
 * rapprochée du mot qui précède par une marge négative. Le texte copié est inchangé ;
 * le nom accessible est posé tel quel (`aria-label`), pour qu'aucun lecteur d'écran
 * ne lise une coupure à la frontière des `span`.
 */
export function TitreDisplay({
  as: Balise,
  texte,
  id,
  className,
}: {
  as: "h1" | "h2";
  texte: string;
  id?: string;
  className?: string;
}) {
  const morceaux = texte.split(",");
  return (
    <Balise id={id} className={className} aria-label={texte}>
      {morceaux.map((morceau, i) => (
        <Fragment key={i}>
          {morceau}
          {i < morceaux.length - 1 && <span className="-ml-[0.09em]">,</span>}
        </Fragment>
      ))}
    </Balise>
  );
}
