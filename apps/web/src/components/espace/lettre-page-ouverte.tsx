import Link from "next/link";
import { LettrePageInscription } from "@/components/lettre/lettre-page-inscription";
import { LettreStatut } from "@/components/lettre/lettre-statut";
import { LettreCorpsApercu } from "@/components/lettre/lettre-corps-apercu";
import { AvecContact } from "@/components/lettre/avec-contact";
import { LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { CADRE_CARTE_NEUTRE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { META, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { frPonctuation } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

const S = TEXTES_LETTRE.statuts;
const PLEINE = "md:col-span-2 lg:col-span-12";

/**
 * `/lettre` interrupteur ouvert, visiteur, compte gratuit et ancien abonné (s26, `docs/ux/questions-repliques-lettre-
 * profil-s26.md` §3.1, design §6.1). Mêmes contenus, mêmes états et mêmes conditions que la page fermée (textes,
 * statuts `?statut=`, mesure de la confirmation) ; seule la mise en page change : bandeaux de statut sur 12 colonnes,
 * inscription en 7 à gauche (collante sous l'en-tête, `lg:top-36`), « Dernier numéro » en 5 à droite ; sans numéro
 * envoyé, l'inscription prend les 12 colonnes. Plus de colonne centrée `max-w-3xl`. Liens de statut neutres (plus de
 * violet ni de `text-xs`). Métadonnées, H1 et redirections : dans `app/(dashboard)/lettre/page.tsx`, inchangés.
 */
export function LettrePageOuverte({
  statut,
  mesure,
  emplacement,
  dernier,
}: {
  statut: string | null;
  mesure: string | undefined;
  emplacement: string | null;
  dernier: { subject: string; bodyText: string } | null;
}) {
  const inscription = LETTRE_INSCRIPTIONS_OUVERTES && statut !== "desinscrit" && statut !== "confirmee";
  return (
    <div className="grid grid-cols-1 gap-6 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:items-start" data-lettre-ouverte>
      {statut === "confirmee" && (
        <div className={PLEINE}>
          <LettreStatut titre={S.confirmee.titre} confirmee confirmeeMesuree={mesure === "1" ? { emplacement } : undefined}>
            <p className={cn("mt-2", META)}>{S.confirmee.texte}</p>
            <Link href={S.confirmee.lienHref} className={cn("mt-2", LIEN_NEUTRE)}>
              {S.confirmee.lien}
            </Link>
          </LettreStatut>
        </div>
      )}
      {statut === "desinscrit" && (
        <div className={PLEINE}>
          <LettreStatut titre={S.desinscrit.titre}>
            {LETTRE_INSCRIPTIONS_OUVERTES && (
              <Link href="/lettre" className={cn("mt-2", LIEN_NEUTRE)}>
                {S.desinscrit.lien}
              </Link>
            )}
          </LettreStatut>
        </div>
      )}
      {statut === "invalide" && (
        <div className={PLEINE}>
          <LettreStatut titre={S.invalide.titre}>
            <p className={cn("mt-2", META)}>
              <AvecContact texte={S.invalide.texte} />
            </p>
          </LettreStatut>
        </div>
      )}
      {statut === "erreur" && (
        <div className={PLEINE}>
          <LettreStatut titre={<AvecContact texte={S.erreur.titre} />} />
        </div>
      )}
      {statut === "verifie" && (
        <div className={PLEINE}>
          <LettreStatut titre={TEXTES_LETTRE.succes.titre}>
            <p className={cn("mt-2", META)}>{TEXTES_LETTRE.succes.texte}</p>
            <p className={cn("mt-2", META)}>{TEXTES_LETTRE.succes.aide}</p>
          </LettreStatut>
        </div>
      )}
      {(statut === "saisie-email" || statut === "saisie-case") && (
        <div className={PLEINE}>
          <LettreStatut titre={statut === "saisie-email" ? TEXTES_LETTRE.erreurs.email : TEXTES_LETTRE.erreurs.case} />
        </div>
      )}

      {/* QA s21 m2 et m1 (inchangés) : après la confirmation ou la désinscription, pas de formulaire ; lien invalide ou
          erreur, le formulaire annoncé par le bandeau est là. */}
      {inscription && (
        // Collante (sous l'en-tête, `lg:top-36`) : le dernier numéro est un texte long (environ 2 000 px à 1280) ; la
        // carte d'inscription le suit pendant la lecture au lieu de laisser la colonne de gauche vide sous le formulaire.
        <div
          className={cn("min-w-0 md:col-span-2", dernier ? "lg:sticky lg:top-36 lg:col-span-7 lg:self-start" : "lg:col-span-12")}
          data-lettre-inscription-colonne
        >
          <LettrePageInscription ignorerDrapeau={statut === "invalide" || statut === "erreur"} />
        </div>
      )}

      {dernier && (
        <section
          aria-labelledby="lettre-dernier"
          className={cn(
            CADRE_CARTE_NEUTRE,
            "min-w-0 p-6 [overflow-wrap:anywhere] md:col-span-2",
            inscription ? "lg:col-span-5" : "lg:col-span-7",
          )}
          data-lettre-apercu=""
        >
          <h2 id="lettre-dernier" className={TITRE_CARTE}>
            {TEXTES_LETTRE.page.dernierNumero}
          </h2>
          <p className={cn("mt-4", TEXTE_FORT)}>{frPonctuation(dernier.subject)}</p>
          <LettreCorpsApercu texte={dernier.bodyText} />
        </section>
      )}
    </div>
  );
}
