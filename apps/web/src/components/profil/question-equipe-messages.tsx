/**
 * « Ta question à l'équipe » (s22) : messages d'erreur de l'encadré, avec leurs liens
 * (`mailto:` vers l'équipe, reconnexion, abonnement). Texte stocké intact, `typo` au rendu.
 */
import Link from "next/link";
import { QUESTION_EQUIPE_MAX } from "@/config/question-equipe";
import { QUESTION_EQUIPE_UI as T, type TexteAvecLien } from "@/config/textes/question-equipe-s22";
import { frTypoTexte, NBSP } from "@/lib/fr-typo";

export type Erreur = "vide" | "trop-long" | "envoi" | "trop" | "trop-court" | "session" | "non-premium";

export const nombre = (n: number) => n.toLocaleString("fr-FR");
/** `frTypo` + impératif lié (« Reconnecte-toi ») + « 1 à 2 » jamais coupé (texte affiché seulement). */
export const typo = (t: string) => frTypoTexte(t).replace(/(\d) à(?: |\u00a0)(\d)/g, `$1${NBSP}à${NBSP}$2`);

export const LIEN = "underline underline-offset-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background-card";

/** Texte avec lien : `mailto:` en `<a>`, page du site en `Link`. */
function AvecLien({ t }: { t: TexteAvecLien }) {
  return (
    <>
      {typo(t.avant)}
      {t.href.startsWith("mailto:") ? (
        <a href={t.href} className={LIEN}>
          {t.lien}
        </a>
      ) : (
        <Link href={t.href} className={LIEN}>
          {typo(t.lien)}
        </Link>
      )}
      {typo(t.apres)}
    </>
  );
}

export function MessageErreur({ erreur }: { erreur: Erreur }) {
  switch (erreur) {
    case "vide":
      return <>{typo(T.erreurs.vide)}</>;
    case "trop-long":
      // Espace insécable normale dans la phrase (l'espace fine de `toLocaleString` y disparaît à l'oeil en 14 px).
      return <>{typo(T.erreurs.tropLong(nombre(QUESTION_EQUIPE_MAX).replace(/\u202f/g, NBSP)))}</>;
    case "trop-court":
      return <>{typo(T.erreurs.tropCourt)}</>;
    case "trop":
      return <AvecLien t={T.erreurs.trop} />;
    case "session":
      return <AvecLien t={T.erreurs.session} />;
    case "non-premium":
      return <AvecLien t={T.erreurs.nonPremium} />;
    default:
      return <AvecLien t={T.erreurs.envoi} />;
  }
}

