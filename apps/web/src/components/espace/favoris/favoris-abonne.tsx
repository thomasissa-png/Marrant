"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reassurance } from "@/components/ui/reassurance";
import { IconeFavoris } from "@/components/layout/header-icons";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useEstPremium } from "@/hooks/use-est-premium";
import { buildLoginUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { libelleToutOuvrir } from "@/config/textes/cta-articles-accueil";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { OngletsFavoris } from "@/components/espace/favoris/onglets-favoris";
import { CarteConseilAbonne, CarteVanneAbonne, CarteVideoAbonne, type JokeData, type TipData, type VideoData } from "@/components/espace/favoris/cartes-abonne";
import { TABS, type TabFilter } from "@/components/favoris/libelles";

type Favori = ReturnType<typeof useFavoritesStore.getState>["favorites"][number];

const GRILLE = "grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start";
const BOUTON = cn(buttonVariants({ size: "lg" }), "mt-6 h-auto min-h-11 whitespace-normal");

/** Carte d'état (vide, mur) : cadre neutre, étoile de la bande (aucun émoji), titre, phrase, un seul bouton plein. */
function CarteEtat({ titre, texte, children }: { titre: string; texte?: string; children: React.ReactNode }) {
  return (
    <div className={cn(CADRE_CARTE_NEUTRE, "p-6")} data-favoris-etat>
      <IconeFavoris className="h-6 w-6 text-text-secondary" />
      <p className={cn("mt-4", TEXTE_FORT)}>{titre}</p>
      {texte && <p className={cn("mt-2", TEXTE)}>{texte}</p>}
      {children}
    </div>
  );
}

/**
 * Favoris, vue de l'abonné, espace OUVERT seulement (s26, `docs/ux/favoris-carnet-s26.md` §1.3, design §2) : rail
 * d'onglets 3 col collant et liste 9 col dès 1024 px ; rangée d'onglets et liste 2 col à 768 ; 1 col à 375. La carte la
 * plus récente en tête, dépliée (chute visible, `CARTE_ACTION`) ; progression = l'effectif réel de chaque onglet. Le seul
 * bouton plein est celui de l'état vide (ou du mur). Fermé : `FavorisList`, au caractère près (inertie `favoris`).
 * Mêmes données, mêmes actions que `FavorisList` (store des favoris), aucun texte neuf.
 */
export function FavorisAbonne() {
  const { status } = useSession();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoritesStore();
  const estPremium = useEstPremium();
  const [actif, setActif] = useState<TabFilter>("ALL");
  // Bascule par carte : la carte de tête est ouverte tant qu'on ne l'a pas refermée (ou exclusif).
  const [basculees, setBasculees] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "authenticated") fetchFavorites();
  }, [status, fetchFavorites]);

  if (status === "unauthenticated") {
    return (
      <div className={GRILLE}>
        <div className="lg:col-span-9">
          <CarteEtat titre="Connecte-toi pour retrouver tes pépites">
            <Link href={buildLoginUrl({ callbackUrl: "/favoris" })} className={BOUTON}>
              Se connecter
            </Link>
          </CarteEtat>
        </div>
      </div>
    );
  }

  // s21 (QA M2) : plan lu dans la session, pas seulement dans le store (vide hors /profil).
  if (!estPremium) {
    return (
      <div className={GRILLE}>
        <div className="lg:col-span-9">
          <CarteEtat
            titre="Les favoris sont réservés aux membres Premium"
            texte="Passe à l’offre complète pour sauvegarder tes vannes, conseils et vidéos préférés."
          >
            {/* s21 (revue v2 m-1) : source `favoris`, suivie jusqu'à `checkout-ouvert` ; retour ici après paiement. */}
            <Link href={buildAbonnementUrl("/favoris", "monthly", "favoris")} className={BOUTON}>
              {libelleToutOuvrir()}
            </Link>
            <Reassurance className="text-left" />
          </CarteEtat>
        </div>
      </div>
    );
  }

  const effectifs: Record<TabFilter, number> = {
    ALL: favorites.length,
    JOKE: favorites.filter((f) => f.contentType === "JOKE").length,
    TIP: favorites.filter((f) => f.contentType === "TIP").length,
    VIDEO: favorites.filter((f) => f.contentType === "VIDEO").length,
  };
  const liste = (actif === "ALL" ? favorites : favorites.filter((f) => f.contentType === actif))
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const tete = liste[0]?.id;
  const onglet = TABS.find((t) => t.value === actif) ?? TABS[0];
  const basculer = (id: string) =>
    setBasculees((avant) => {
      const apres = new Set(avant);
      if (apres.has(id)) apres.delete(id);
      else apres.add(id);
      return apres;
    });

  return (
    <div className={GRILLE}>
      <div className="min-w-0 lg:sticky lg:top-24 lg:col-span-3">
        <OngletsFavoris actif={actif} choisir={setActif} effectifs={effectifs} />
      </div>
      <div className="min-w-0 lg:col-span-9" role="tabpanel" aria-label={onglet.label} data-liste-favoris>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-background-card lg:col-span-6" />
            ))}
          </div>
        ) : liste.length === 0 ? (
          <CarteEtat titre={onglet.emptyTitle} texte={onglet.emptyDesc}>
            <Link href={onglet.ctaHref} className={BOUTON}>
              {onglet.ctaLabel}
            </Link>
          </CarteEtat>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
            {liste.map((fav) => (
              <CarteFavori key={fav.id} fav={fav} enTete={fav.id === tete} ouverte={basculees.has(fav.id) !== (fav.id === tete)} basculer={() => basculer(fav.id)} retirer={() => removeFavorite(fav.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Carte selon le type ; la carte de tête prend la rangée entière (prochaine action), les autres 6 col dès 1024 px. */
function CarteFavori({ fav, enTete, ouverte, basculer, retirer }: { fav: Favori; enTete: boolean; ouverte: boolean; basculer: () => void; retirer: () => void }) {
  const largeur = enTete ? "md:col-span-2 lg:col-span-12" : "lg:col-span-6";
  if (fav.contentType === "JOKE" && fav.joke) {
    return <CarteVanneAbonne joke={fav.joke as unknown as JokeData} jokeId={fav.jokeId ?? ""} ouverte={ouverte} enTete={enTete} basculer={basculer} retirer={retirer} className={largeur} />;
  }
  if (fav.contentType === "TIP" && fav.tip) {
    return <CarteConseilAbonne tip={fav.tip as unknown as TipData} ouverte={ouverte} enTete={enTete} basculer={basculer} retirer={retirer} className={largeur} />;
  }
  if (fav.contentType === "VIDEO" && fav.video) {
    return <CarteVideoAbonne video={fav.video as unknown as VideoData} enTete={enTete} retirer={retirer} />;
  }
  // Type inconnu : la carte de repli d'avant (« Retirer » seul), au gabarit commun.
  return (
    <div className={cn(CADRE_CARTE_NEUTRE, "flex items-center justify-between p-6", largeur)}>
      <p className={TEXTE}>Favori</p>
      <button type="button" onClick={retirer} aria-label="Retirer des favoris" className={cn(TEXTE, "inline-flex min-h-11 items-center underline underline-offset-2")}>
        Retirer
      </button>
    </div>
  );
}
