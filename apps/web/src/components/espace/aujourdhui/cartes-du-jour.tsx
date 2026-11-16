import Link from "next/link";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { Chevron, Coche, PASTILLE, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT, TEXTE, TITRE_CARTE } from "@/components/espace/typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);

/**
 * « Si tu as 5 minutes » (architecture 4.4 état 2, maquette `aujourdhui.html#etat=rafale`) :
 * COQUE du lot D3, remplie par le moteur de cartes du lot D5 (jusqu'à 3 cartes : situations
 * nouvelles puis cartes à revoir ; « C'est tout pour aujourd'hui » une fois faites). Le titre collé
 * au bouton (aucun bloc entre les deux, condition du libellé 7). v7 tour 3 (relectures, piste Z1) : même entrée que
 * les autres variantes de Z1, une étiquette (casse normale depuis l'échelle s25), le libellé existant de la rubrique où mènent les cartes
 * (« S’entraîner », celui de la bande) ; l'accroche, mot pour mot, passe sous la rangée titre et bouton, en
 * sous-texte, au-dessus des comptes (plus de phrase de corps en tête de carte).
 * Jamais montée le jour 1 (le premier pas est la seule action principale).
 */
export type CarteDuJour = { titre: string; href: string; nouvelle: boolean; autreContexte?: boolean };

/** Rond de sens de « C'est tout pour aujourd'hui » (spec design §4 Z5) : la seule note verte de la page. */
function RondFait() {
  return (
    <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-success/15 text-success">
      <Coche className="h-5 w-5" />
    </span>
  );
}

/**
 * Refonte s25 (spec design §4 Z1 et Z5) : `principale` (défaut) = l'action du jour Z1 (carte teintée, seul plein,
 * cartes en ligne dessous) ; `false` = la tuile Z5 quand l'étape est l'action du jour : « C'est tout pour
 * aujourd'hui » avec sa coche une fois la rafale faite, sinon « Si tu as 5 minutes » et un bouton secondaire.
 */
export function CartesDuJour({
  cartes: toutes,
  href,
  fini: finiMoteur,
  principale = true,
}: {
  cartes: readonly CarteDuJour[];
  href: string;
  fini: boolean;
  principale?: boolean;
}) {
  // Lot D11b (Q-6, @ux D-4) : une carte sans titre n'est jamais montrée, et une rafale sans carte
  // montrable (catalogue épuisé, tirage vide) rend l'état « C'est tout pour aujourd'hui », jamais un
  // bouton au sous-titre vide vers une page sans carte.
  const cartes = toutes.filter((c) => c.titre.trim() !== "");
  const fini = finiMoteur || cartes.length === 0;
  const autres = cartes.filter((c) => c.autreContexte).length;
  const nouvelles = cartes.filter((c) => c.nouvelle && !c.autreContexte).length;
  const aRevoir = cartes.filter((c) => !c.nouvelle).length;
  const sousTitre = <p className={cn("mt-2 tabular-nums", META)}>{T.rafale.sousTitre(nouvelles, aRevoir, autres)}</p>;

  if (!principale) {
    return (
      <section aria-labelledby="rafale-titre" className={TUILE} data-rafale={fini ? "faite" : "a-faire"}>
        {fini ? (
          <div className="flex items-center gap-4">
            <RondFait />
            <h2 id="rafale-titre" className={TITRE_CARTE}>
              {T.rafale.fini}
            </h2>
          </div>
        ) : (
          <>
            <h2 id="rafale-titre" className={cn(TITRE_TUILE, "mt-0")}>
              {T.rafale.titre}
            </h2>
            {sousTitre}
            <div className="mt-auto pt-4">
              <Link href={href} className={cn(BOUTON_SECONDAIRE, "w-full")}>
                {T.rafale.bouton}
              </Link>
            </div>
          </>
        )}
      </section>
    );
  }

  if (fini) {
    // Parcours tous finis et rafale faite (spec UX §5) : « C'est tout pour aujourd'hui » en action du jour, sans bouton.
    return (
      <ActionDuJour
        idTitre="rafale-titre"
        data-rafale="faite"
        etiquette={T.rafale.titre}
        titre={
          <span className="flex items-center gap-4">
            <RondFait />
            {T.rafale.fini}
          </span>
        }
        action={null}
      />
    );
  }

  return (
    <ActionDuJour
      idTitre="rafale-titre"
      data-rafale="a-faire"
      etiquette={TEXTES_ESPACE_NAVIGATION.index.sEntrainer}
      titre={T.rafale.titre}
      action={{ href, libelle: T.rafale.bouton }}
      apres={
        <>
          <p className={cn("mt-4 max-w-3xl", TEXTE)} data-rafale-accroche>
            {T.rafale.accroche}
          </p>
          {sousTitre}
          <ul className="mt-4 flex flex-col gap-2 md:grid md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
            {cartes.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="flex min-h-14 items-center gap-4 rounded-xl border border-border bg-background-card/60 px-4 py-2 text-text-primary transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                  <span className={cn(PASTILLE, "flex-none", c.nouvelle && META_FORT)}>
                    {c.nouvelle ? T.rafale.nouvelle : T.rafale.aRevoir}
                  </span>
                  <span className={cn("min-w-0 flex-1", META, "text-text-primary")}>{c.titre}</span>
                  <Chevron className="text-text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      }
    />
  );
}
