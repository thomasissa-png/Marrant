"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";
import { contenuAffiche } from "@/lib/tip-prose";
import { badgeVariants } from "@/components/ui/badge";
import { useFavoritesStore } from "@/stores/favorites-store";
import { META } from "@/components/espace/typo";
import { FILET_CARTE } from "@/components/espace/carte/styles";
import { LIGNE_ACTIVE, LIGNE_LISTE, texteLigne } from "@/components/espace/liste-detail/styles";
import { ColonneCollante } from "@/components/espace/liste-detail/colonne-collante";
import { TABS } from "@/components/favoris/libelles";

export type Favori = ReturnType<typeof useFavoritesStore.getState>["favorites"][number];
export type TypeFavori = Favori["contentType"];

/** Ordre des groupes de la liste : celui des onglets d'avant (Vannes, Conseils, Vidéos ; « Tout » n'est plus un filtre). */
export const GROUPES = TABS.filter((t): t is (typeof TABS)[number] & { value: TypeFavori } => t.value !== "ALL");

/** Adresse d'un favori ouvert : la page Favoris, `?favori=<id>` (une entrée d'historique par favori). */
export const hrefFavori = (id: string) => `/favoris?favori=${encodeURIComponent(id)}`;

/** Libellé d'une ligne : début de la vanne, titre du conseil ou de la vidéo. */
export function titreFavori(fav: Favori): string {
  if (fav.contentType === "JOKE" && fav.joke) return frTypo(String(fav.joke.content ?? ""));
  if (fav.contentType === "TIP" && fav.tip) return frTypo(String(fav.tip.title ?? ""));
  if (fav.contentType === "VIDEO" && fav.video) return contenuAffiche(String(fav.video.title ?? ""));
  return "Favori";
}

/** Favoris groupés par type, le plus récent en tête de chaque groupe ; groupes vides retirés. */
export function grouperFavoris(favoris: readonly Favori[]) {
  const recents = favoris.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return GROUPES.map((g) => ({ ...g, favoris: recents.filter((f) => f.contentType === g.value) })).filter((g) => g.favoris.length > 0);
}

/**
 * s26 DA, s'entraîner et favoris : liste des favoris, colonne de gauche collante dès 1024 (`ColonneCollante` du module
 * commun `components/espace/liste-detail`, celui du Carnet, en mode `remplir`), page entière dessous. Carte à filet
 * violet de l'accueil (le H1 de la page est au-dessus), groupes par type en pastille neutre de l'accueil avec leur
 * effectif, une ligne par favori (`aria-current` : filet et texte violets). Pied : le lien du catalogue des onglets
 * d'avant (« Explorer les vannes »). Clavier : flèches haut et bas d'une ligne à l'autre, Entrée ouvre. Aucun texte neuf.
 */
export function ListeFavoris({ favoris, actif, titre, ouvrir }: { favoris: readonly Favori[]; actif: string | null; titre: string; ouvrir: () => void }) {
  const groupes = grouperFavoris(favoris);
  const pied = TABS[0];
  return (
    <ColonneCollante
      cle="favoris-liste"
      label={titre}
      actif={actif}
      remplir
      className={FILET_CARTE}
      data-liste-favoris=""
      pied={
        <Link href={pied.ctaHref} className={cn(META, "inline-flex min-h-11 items-center px-6 font-medium text-accent-link underline underline-offset-2")} data-pied-favoris>
          {pied.ctaLabel}
        </Link>
      }
    >
      <div className="py-2">
        {groupes.map((g) => (
          <section key={g.value} aria-labelledby={`favoris-groupe-${g.value}`} data-groupe-favoris={g.value}>
            <div className="flex items-baseline justify-between gap-4 px-6 pb-2 pt-4">
              <h3 id={`favoris-groupe-${g.value}`} className={badgeVariants({ variant: "default" })}>
                {g.label}
              </h3>
              <span className={cn(META, "tabular-nums")}>{g.favoris.length}</span>
            </div>
            <ul aria-labelledby={`favoris-groupe-${g.value}`}>
              {g.favoris.map((f) => {
                const estActif = f.id === actif;
                return (
                  <li key={f.id}>
                    <Link
                      href={hrefFavori(f.id)}
                      scroll={false}
                      prefetch={false}
                      aria-current={estActif ? "page" : undefined}
                      onClick={ouvrir}
                      data-ligne={f.id}
                      data-ligne-favori={f.id}
                      className={cn(LIGNE_LISTE, "group/ligne items-center", estActif && LIGNE_ACTIVE)}
                    >
                      <span className={cn(texteLigne(estActif), "line-clamp-2")}>{titreFavori(f)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </ColonneCollante>
  );
}
