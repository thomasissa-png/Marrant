"use client";

import Link from "next/link";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARNET_LISTE as TL } from "@/config/textes/carnet-liste-s26";
import { contextesDe, filtrerLignes, hrefFicheCarnet, hrefListeCarnet, type CarnetListe } from "@/lib/espace/carnet-liste";
import { ColonneCollante } from "@/components/espace/liste-detail/colonne-collante";
import { LIGNE_ACTIVE, LIGNE_ACTIVE_LG, LIGNE_LISTE } from "@/components/espace/liste-detail/styles";
import { pastilleFiltre } from "@/components/espace/carte/styles";
import { ETIQUETTE, META, TEXTE_FORT } from "@/components/espace/typo";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

/** « Où et avec qui ? » : libellé existant de Quoi répondre ; le `contexte` du carnet est ce lieu ou ce milieu (audit §1). */
const LIBELLE_FILTRE = frTypo(TEXTES_QUOI_REPONDRE.filtreOu);

function Effectif({ n }: { n: number }) {
  return <span className="ml-2 tabular-nums text-text-primary">{n}</span>;
}

/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3) : la liste du carnet de l'abonné. Dès 1024, carte
 * collante à gauche (`ColonneCollante`, module neutre), la fiche à droite ; sous 1024, la page liste (une colonne à 375,
 * deux dès 768), la fiche s'ouvrant en plein écran. En tête du corps, le filtre par `contexte` (« Toutes » et les
 * valeurs du mois avec leur effectif, dans l'ordre d'apparition) ; puis les situations : numéro, titre, contexte. Une
 * seule ligne active (`aria-current`, filet violet de 2 px) : la fiche ouverte, sinon la première du filtre (dès 1024
 * seulement, sous 1024 aucune fiche n'est visible à côté). Pied : les mois publiés, le mois affiché marqué. Aucun suivi
 * « lu » (n'existe pas : jamais simulé). Un filtre remplace l'entrée d'historique tant qu'aucune fiche n'est ouverte ;
 * une fiche en ajoute une.
 */
export function ListeCarnet({
  carnets,
  carnet,
  numero,
  contexte,
  surOuverture,
}: {
  carnets: readonly CarnetListe[];
  carnet: CarnetListe;
  /** Fiche ouverte (`/carnet/<mois>/<n>`), sinon `null`. */
  numero: number | null;
  contexte: string | null;
  /** Clic sur une ligne (mémoire de position sous 1024, « Retour » par l'historique). */
  surOuverture: () => void;
}) {
  const courant = carnet.mois === carnets[0]?.mois;
  const ordre = filtrerLignes(carnet.lignes, contexte);
  const actif = numero ?? ordre[0]?.numero ?? null;
  const contextes = contextesDe(carnet.lignes);

  const lienFiltre = (valeur: string | null) => {
    const garde = numero !== null && (valeur === null || carnet.lignes.some((l) => l.numero === numero && l.contexte === valeur));
    return garde && numero !== null
      ? { href: hrefFicheCarnet(carnet.mois, numero, valeur), replace: true }
      : { href: hrefListeCarnet(carnet.mois, courant, valeur), replace: numero === null };
  };
  const pastilles: { valeur: string | null; libelle: string; nombre: number }[] = [
    { valeur: null, libelle: TL.toutes, nombre: carnet.lignes.length },
    ...contextes.map((c) => ({ valeur: c.cle, libelle: frTypo(c.cle), nombre: c.nombre })),
  ];

  return (
    <ColonneCollante
      cle={`carnet-liste:${carnet.mois}:${contexte ?? ""}`}
      label={frTypo(carnet.titre)}
      actif={actif === null ? null : String(actif)}
      data-carnet-liste=""
    >
      <div className="px-6 pb-4 pt-6" data-carnet-filtres>
        <h2 id="carnet-filtre-titre" className={ETIQUETTE}>
          {LIBELLE_FILTRE}
        </h2>
        <ul aria-labelledby="carnet-filtre-titre" className="mt-2 flex flex-wrap gap-2">
          {pastilles.map((p) => {
            const lien = lienFiltre(p.valeur);
            const choisie = p.valeur === contexte;
            return (
              <li key={p.valeur ?? ""} className="min-w-0 max-w-full">
                <Link href={lien.href} replace={lien.replace} scroll={false} prefetch={false} aria-current={choisie ? "true" : undefined} className={pastilleFiltre(choisie)} data-filtre-contexte={p.valeur ?? ""}>
                  {p.libelle}
                  <Effectif n={p.nombre} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <ol className="border-t border-border py-2 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-6" data-carnet-lignes>
        {ordre.map((l) => {
          const estActif = l.numero === actif;
          return (
            <li key={l.id} className="min-w-0">
              <Link
                href={hrefFicheCarnet(carnet.mois, l.numero, contexte)}
                scroll={false}
                prefetch={false}
                aria-current={estActif && numero !== null ? "page" : undefined}
                onClick={surOuverture}
                data-ligne={String(l.numero)}
                data-actif={estActif ? "" : undefined}
                className={cn(LIGNE_LISTE, estActif && (numero !== null ? LIGNE_ACTIVE : LIGNE_ACTIVE_LG))}
              >
                <span className={cn(META, "min-w-6 flex-none pt-0.5 tabular-nums")}>{l.numero}</span>
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  <span className={cn("block", TEXTE_FORT)}>{frTypo(l.titre)}</span>
                  <span className={cn("block", META)}>{frTypo(l.contexte)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      {carnets.length > 1 && (
        <ul aria-label="Carnet" className="flex flex-wrap gap-2 border-t border-border px-6 py-4" data-carnet-mois>
          {carnets.map((c) => {
            const choisi = c.mois === carnet.mois;
            return (
              <li key={c.mois}>
                <Link href={hrefListeCarnet(c.mois, c.mois === carnets[0].mois)} aria-current={choisi ? "true" : undefined} className={pastilleFiltre(choisi)} data-mois={c.mois}>
                  {c.libelle}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </ColonneCollante>
  );
}
