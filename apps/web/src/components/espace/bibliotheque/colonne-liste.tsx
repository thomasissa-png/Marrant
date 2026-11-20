"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { TEXTES_BIBLIOTHEQUE, TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import { CLES_BIBLIOTHEQUE, FAMILLES_BIBLIOTHEQUE, type LigneBibliotheque } from "@/lib/espace/bibliotheque-liste";
import { ficheParDefaut } from "@/lib/espace/quoi-repondre-liste";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { useFaitsListe } from "@/components/espace/liste-detail/faits-contexte";
import { ColonneCollante } from "@/components/espace/liste-detail/colonne-collante";
import { LIGNE_ACTIVE, LIGNE_LISTE } from "@/components/espace/liste-detail/styles";
import { CompteFaits, sansPrefixe } from "@/components/espace/liste-fiches";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { Coche } from "@/components/espace/aujourdhui/tableau";
import { ChevronRepli } from "@/components/espace/carte/chevron-repli";
import { LIEN_NEUTRE, SOMMAIRE_REPLIABLE, pastilleFiltre } from "@/components/espace/carte/styles";
import { badgeVariants } from "@/components/ui/badge";
import { ETIQUETTE, META, META_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_BIBLIOTHEQUE);
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);

/**
 * s26 bibliothèque liste et détail : colonne de gauche de la Bibliothèque dès 1024, au modèle de la colonne de Quoi
 * répondre (DA du site : carte à bandeau violet, famille en pastille neutre, ligne active au filet et au texte violets).
 * En tête, repliés comme les filtres de Quoi répondre, les thèmes et le catalogue (« Vannes, conseils, vidéos ») ; puis
 * les techniques par famille, bonus des caps compris (un bonus garde sa porte, `/mon-espace/bonus/[id]`) ; en pied de
 * liste, le coin « Humour noir, fait bien », comportement inchangé (seuil et cookie d'entrée). Carte collante, lignes et
 * ligne active : module commun `liste-detail` (créé par le Carnet), avec le bandeau violet de l'accueil (`FILET_CARTE`).
 */
export function ColonneBibliotheque({
  lignes,
  coin,
}: {
  lignes: readonly LigneBibliotheque[];
  /** `null` : coin absent (aucune fiche) ; sinon ses lignes si le navigateur est entré, `null` dedans au seuil. */
  coin: { lignes: LigneFiche[] | null } | null;
}) {
  const segment = useSelectedLayoutSegment();
  const faits = useFaitsListe();
  const avecFaits = useMemo(() => lignes.map((l) => ({ ...l, fait: faits?.faitDe(l.id) ?? l.fait })), [lignes, faits]);
  const techniques = avecFaits.filter((l) => !l.marque);
  const idOuvert = segment ? decodeURIComponent(segment) : null;
  const actif = idOuvert ?? ficheParDefaut(techniques, new Set(techniques.filter((l) => l.fait).map((l) => l.id)))?.id ?? null;
  const groupes = FAMILLES_BIBLIOTHEQUE.map((f) => ({ cle: f, titre: T.prefixes[f], lignes: avecFaits.filter((l) => l.famille === f) })).filter((g) => g.lignes.length > 0);

  // Annonce polie du titre ouvert après un changement de fiche (jamais au chargement).
  const [annonce, setAnnonce] = useState("");
  const premier = useRef(true);
  useEffect(() => {
    if (premier.current) {
      premier.current = false;
      return;
    }
    setAnnonce(avecFaits.find((l) => l.id === actif)?.titre ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif]);
  // Titre de la liste : H1 quand aucune fiche n'occupe le panneau, sinon H2 (le H1 est celui de la fiche).
  const Titre = actif === null ? "h1" : "h2";

  return (
    <ColonneCollante
      cle={CLES_BIBLIOTHEQUE.liste}
      label={T.titre}
      actif={actif}
      data-colonne-liste=""
      entete={
        <>
          <Titre id="bib-liste-titre" className={cn(TITRE_CARTE, "px-6 pb-4 pt-8")}>
            {T.titre}
          </Titre>
          <p className="sr-only" aria-live="polite" data-annonce-fiche>
            {frEspace(annonce)}
          </p>
        </>
      }
    >
      <details className="group/repli px-6 pb-4" data-vannes-liste>
        <summary className={SOMMAIRE_REPLIABLE}>
          <span className="min-w-0 [overflow-wrap:anywhere]">{T.blocVannes}</span>
          <ChevronRepli />
        </summary>
        <h3 id="bib-themes" className={cn("mt-4", ETIQUETTE)}>
          {T.themesNom}
        </h3>
        <ul aria-labelledby="bib-themes" className="mt-2 flex flex-wrap gap-2">
          {T.themes.map((t) => (
            <li key={t.slug} className="min-w-0 max-w-full">
              <Link href={`/vannes/theme/${t.slug}`} className={pastilleFiltre(false)}>
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-2 flex flex-wrap gap-x-4" data-testid="bibliotheque-catalogue-liste">
          {T.catalogue.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className={LIEN_NEUTRE}>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
      <div className="border-t border-border" data-liste-lignes>
        {groupes.map((g) => {
          const n = g.lignes.filter((l) => l.fait).length;
          return (
            <section key={g.cle} aria-labelledby={`bib-famille-${g.cle}`} data-famille={g.cle}>
              <div className="flex items-baseline justify-between gap-4 px-6 pb-2 pt-4">
                <h3 id={`bib-famille-${g.cle}`} className={badgeVariants({ variant: "default" })}>
                  {g.titre}
                </h3>
                <CompteFaits faits={n} total={g.lignes.length} />
              </div>
              <ul aria-labelledby={`bib-famille-${g.cle}`}>
                {g.lignes.map((l) => {
                  const estActif = l.id === actif && !l.marque;
                  const titre = frEspace(sansPrefixe(l.titre, g.titre));
                  return (
                    <li key={l.id}>
                      <Link
                        href={l.href}
                        scroll={false}
                        prefetch={false}
                        aria-current={estActif ? "page" : undefined}
                        onClick={() => (l.marque ? undefined : faits?.demanderFocus())}
                        data-ligne={l.id}
                        data-ligne-bib={l.id}
                        data-titre={titre}
                        className={cn(LIGNE_LISTE, "group/ligne items-center", estActif && LIGNE_ACTIVE)}
                      >
                        <span className={cn("min-w-0 flex-1 [overflow-wrap:anywhere] group-hover/ligne:text-accent-link", estActif ? `${META_FORT} text-accent-link` : l.fait ? META : `${META} text-text-primary`)}>
                          {l.marque && <span className={cn("block", META)}>{frEspace(l.marque)}</span>}
                          {titre}
                        </span>
                        {l.fait ? (
                          <span className={cn("inline-flex flex-none items-center gap-2", META)} data-fait>
                            <Coche className="h-4 w-4 text-success" />
                            {L.fait}
                          </span>
                        ) : (
                          <span className={cn("flex-none tabular-nums", META)}>{L.minutes(l.minutes)}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {coin && (
          // Coin « Humour noir, fait bien » : même composant, même seuil, même cookie ; posé à plat dans la liste.
          <CoinHumourNoir lignesInitiales={coin.lignes} prefixeId="bib-coin" className="mt-4 rounded-none border-x-0 border-b-0 bg-transparent" />
        )}
      </div>
    </ColonneCollante>
  );
}
