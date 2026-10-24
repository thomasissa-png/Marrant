import { Fragment } from "react";
import { LETTRE_CONTACT } from "@/config/textes/lettre-s21";

/**
 * Texte validé tel quel, où l'adresse de contact devient un lien `mailto:`
 * (blocs 9 de la lettre : lien invalide, erreur technique). Le texte affiché
 * reste identique mot pour mot.
 */
export function AvecContact({ texte }: { texte: string }) {
  const morceaux = texte.split(LETTRE_CONTACT);
  return (
    <>
      {morceaux.map((morceau, i) => (
        <Fragment key={i}>
          {morceau}
          {i < morceaux.length - 1 && (
            <a href={`mailto:${LETTRE_CONTACT}`} className="text-accent-link underline">
              {LETTRE_CONTACT}
            </a>
          )}
        </Fragment>
      ))}
    </>
  );
}
